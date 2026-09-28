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

Customers place an order, then send it to your WhatsApp with one tap. You confirm by phone, and they
pay cash on delivery, by bKash or by Nagad. Prices and stock are always re-checked on the server.

Set your numbers in `lib/site.ts` (`whatsapp`, `bkash`, `nagad`, `phone`, `messenger`).
Optionally set `ORDER_WEBHOOK_URL` to also receive every order as JSON (e.g. a Google Sheet or Discord).

## Host it free on Vercel

1. Sign in at vercel.com with GitHub.
2. "Add New… > Project", import this repository, keep the defaults, and Deploy.
3. Every push to `main` redeploys the site automatically.

## Product photos

Photos in `public/products/` have their backgrounds removed and sit on a clean studio backdrop.
To do the same for new photos: `pip install "rembg[cpu]" opencv-python-headless`, then
`python3 scripts/clean-photos.py <folder-of-photos> <output-folder>`. It works best with the card on a
plain dark surface.
