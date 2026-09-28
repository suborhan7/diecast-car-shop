# Bengal Diecast Club

Online store for Hot Wheels, die-cast, collectibles and RC toys. Built with Next.js + TypeScript.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit your products

All products live in `data/products.json`. Each entry has a name, series, price, stock,
condition grade (`score` 5–10 on the C-scale, plus `packaging` and grader `notes`) and `status`
(`in-stock`, `preorder` or `sold-out`).

- **Photos:** put images in `public/products/` and list them, e.g. `"images": ["/products/twin-mill.jpg"]`.
  Until then a coloured placeholder car is drawn.
- **After a sale:** lower `stock`, or set `status` to `"sold-out"`.
- **Hide an item** without deleting it: add `"hidden": true` (used for cars that don't have a price yet).
- **Preorders:** set `status: "preorder"` and add `"preorder": { "releaseDate": "2026-11-15", "closesOn": "2026-11-01" }`.
- **Store name, shipping prices:** `lib/site.ts`. **Grading wording:** `lib/grading.ts`.

## Orders and payment

1. The customer places an order (no online payment). It's saved, the cars are reserved so nobody else can
   buy them, and the customer sends it to your WhatsApp with one tap.
2. You call or message them to confirm.
3. They pay cash on delivery, or use bKash/Nagad Send Money and type the transaction ID on the site.
4. You check that transaction ID against the SMS in your bKash/Nagad app, then press **Mark paid**.

The orders page is at **/admin** (password = `ADMIN_PASSWORD`). It shows who ordered what, their phone
and address, who has paid, who still owes, and lets you confirm, mark paid, shipped, delivered or cancel.
Cancelling puts the cars back on sale.

Numbers for WhatsApp, bKash and Nagad are in `lib/site.ts`.

## Host it free on Vercel

1. Sign in at vercel.com with GitHub.
2. "Add New… > Project", import this repository, keep the defaults, and Deploy.
3. In the project: **Settings → Environment Variables**, add `ADMIN_PASSWORD`.
4. In the project: **Storage → Create Database → Upstash for Redis** (free), connect it to the project.
5. **Deployments → ⋯ → Redeploy** so the new settings take effect.

Every push to `main` redeploys the site automatically.

## Product photos

Photos in `public/products/` have their backgrounds removed and sit on a clean studio backdrop.
To do the same for new photos: `pip install "rembg[cpu]" opencv-python-headless`, then
`python3 scripts/clean-photos.py <folder-of-photos> <output-folder>`. It works best with the card on a
plain dark surface.
