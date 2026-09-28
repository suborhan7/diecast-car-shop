# Cuts each card out of its photo and places it on a clean studio background.
# Usage: python3 scripts/clean-photos.py <photo-dir> <out-dir>
import sys, glob, os
import numpy as np, cv2
from PIL import Image, ImageOps, ImageFilter
from rembg import remove, new_session

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
session = new_session("isnet-general-use")
W, H = 1000, 1250

def background():
    y = np.linspace(0, 1, H)[:, None]; x = np.linspace(-1, 1, W)[None, :]
    base = 250 - 16 * y - 6 * (x ** 2)  # soft light-grey sweep
    return Image.fromarray(np.dstack([base, base + 1, base + 3]).clip(0, 255).astype(np.uint8))

BG = background()

def clean_mask(rgb, alpha):
    a = alpha.astype(np.float32)
    a = np.clip((a - 60) / (200 - 60), 0, 1)  # drop faint haze, firm up edges
    hard = (a > 0.5).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(hard, 8)
    if n > 1:
        keep = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        a[lab != keep] = 0
    # hanger hole: dark, grey pixels in the top of the card are background showing through
    ys, xs = np.where(a > 0.5)
    top, bot = ys.min(), ys.max()
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    zone = np.zeros_like(a, bool); zone[top: top + int((bot - top) * 0.22)] = True
    hole = zone & (hsv[..., 2] < 95) & (hsv[..., 1] < 60)
    hole = cv2.morphologyEx(hole.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)).astype(bool)
    a[hole] = 0
    return refine((a > 0.5).astype(np.uint8), rgb)

def refine(m, rgb):
    """The model sometimes drops parts of the printed card. Grow the mask back with
    GrabCut, which separates the card from the plain background by colour."""
    h, w = m.shape
    pts = cv2.findNonZero(m)
    hull = np.zeros_like(m); cv2.fillConvexPoly(hull, cv2.convexHull(pts), 1)
    x, y, bw, bh = cv2.boundingRect(pts)
    grow = int(max(bw, bh) * 0.12)
    near = cv2.dilate(hull, np.ones((grow, grow), np.uint8))
    gc = np.full((h, w), cv2.GC_BGD, np.uint8)
    gc[near == 1] = cv2.GC_PR_BGD
    gc[hull == 1] = cv2.GC_PR_FGD
    gc[cv2.erode(m, np.ones((15, 15), np.uint8)) == 1] = cv2.GC_FGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), gc, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    out = np.isin(gc, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(out, 8)
    if n > 1:
        out = (lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
    # fill small interior holes (e.g. reflections in the blister), keep the hanger hole
    inv = 1 - out
    n, lab, stats, _ = cv2.connectedComponentsWithStats(inv, 4)
    for i in range(1, n):
        x0, y0, ww, hh, area = stats[i]
        touches = x0 == 0 or y0 == 0 or x0 + ww == w or y0 + hh == h
        if not touches and area < 0.004 * out.sum():
            out[lab == i] = 1
    out = cv2.morphologyEx(out, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    a = cv2.GaussianBlur(out.astype(np.float32), (5, 5), 0)
    return (a * 255).astype(np.uint8)

only = set(sys.argv[3:])
KEEP = {"IMG_20260925_222551.jpg"}  # close-up detail shot
def largest(m):
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), 8)
    return (lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])).astype(np.uint8) if n > 1 else m.astype(np.uint8)

def dark_mat_mask(rgb, model_alpha):
    """Photos on the dark mat. A blister card's outline is a straight-sided shape, so take the
    convex outline of everything that isn't mat, then cut the hanger hole and notch back out."""
    hsv = cv2.cvtColor(cv2.GaussianBlur(rgb, (7, 7), 0), cv2.COLOR_RGB2HSV)
    mat = (hsv[..., 2] < 120) & (hsv[..., 1] < 70)
    colour = cv2.morphologyEx((~mat).astype(np.uint8), cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
    m = largest(colour) | largest(model_alpha > 128)
    hull = np.zeros_like(m); cv2.fillConvexPoly(hull, cv2.convexHull(cv2.findNonZero(m)), 1)
    ys, _ = np.where(hull); top, bot = ys.min(), ys.max()
    zone = np.zeros_like(hull, bool); zone[: top + int((bot - top) * 0.22)] = True
    cut = cv2.morphologyEx((zone & mat).astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    out = largest(hull & (1 - cut))
    out = cv2.erode(out, np.ones((7, 7), np.uint8))
    a = cv2.GaussianBlur(out.astype(np.float32), (5, 5), 0)
    return (a * 255).astype(np.uint8)

def is_dark_background(rgb):
    b = np.concatenate([rgb[:20].reshape(-1, 3), rgb[-20:].reshape(-1, 3), rgb[:, :20].reshape(-1, 3), rgb[:, -20:].reshape(-1, 3)])
    return b.mean() < 110

for f in sorted(glob.glob(f"{src}/IMG*.jpg")):
    name = os.path.basename(f)
    if only and name not in only: continue
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    im.thumbnail((1200, 1600))
    rgb = np.array(im)
    model = np.array(remove(im, session=session))[..., 3]
    alpha = dark_mat_mask(rgb, model) if is_dark_background(rgb) else clean_mask(rgb, model)
    box = Image.fromarray(alpha).point(lambda v: 255 if v > 128 else 0).getbbox()
    x0, y0, x1, y1 = box
    edge = name in KEEP or x0 < 5 or y0 < 5 or x1 > im.width - 5 or y1 > im.height - 5
    if edge:  # close-up shots where the card fills the frame: keep as is
        im2 = ImageOps.fit(im, (W, H), centering=(0.5, 0.5))
        im2.save(f"{out}/{name}", quality=85); print(name, "close-up, kept"); continue
    card = im.crop(box); mask = Image.fromarray(alpha).crop(box)
    scale = min(W * 0.84 / card.width, H * 0.86 / card.height)
    size = (round(card.width * scale), round(card.height * scale))
    card = card.resize(size, Image.LANCZOS); mask = mask.resize(size, Image.LANCZOS)
    canvas = BG.copy()
    px, py = (W - size[0]) // 2, (H - size[1]) // 2
    # soft drop shadow
    sh = Image.new("L", (W, H), 0); sh.paste(mask.point(lambda v: int(v * 0.35)), (px + 10, py + 18))
    sh = sh.filter(ImageFilter.GaussianBlur(22))
    canvas.paste(Image.new("RGB", (W, H), (60, 64, 72)), (0, 0), sh)
    canvas.paste(card, (px, py), mask)
    canvas.save(f"{out}/{name}", quality=86, optimize=True, progressive=True)
    print(name, "ok", box)
