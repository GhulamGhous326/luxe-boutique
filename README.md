# Luxe Boutique

Premium demo e-commerce store with a Shopify-style admin dashboard. Vanilla HTML/CSS/JS frontend, Supabase backend.

**Live store:** https://luxeboutiquee.netlify.app
**Admin:** https://luxeboutiquee.netlify.app/#/admin (secret route, password login, 12h session)

## Storefront

- Home, Collection, Our Story, Track Order, Contact pages
- Product gallery with zoom lens (desktop) + tap-to-zoom lightbox (mobile)
- Cart + wishlist drawers (localStorage), promo codes, COD checkout with per-city delivery fees
- Order tracking by order number + phone
- PWA: manifest + service worker (network-first for app shell so deploys go live instantly)

## Admin dashboard

- **Overview:** revenue analytics, 7D/30D/All ranges, trend vs previous period, SVG charts, sales-goal ring
- **Orders:** search/filter/CSV export, repeat-buyer badges, status workflow with email confirmations (EmailJS), WhatsApp/call/print-invoice actions, order detail drawer, new-order polling alerts
- **Products:** stock editor, visibility toggle, bulk price updates
- **Customers, Promos** (usage stats), **Content** (CMS for site copy), **Messages, Newsletter, Settings** (store info, delivery fees, sales goal, open/close)

## Run it

No build step. Serve the folder and open `index.html`:

```bash
npx serve .
```

Supabase credentials are configured in `script.js` (anon key, RLS-protected). SQL migrations: `supabase-setup.sql`, `supabase-cms-upgrade.sql`, plus feature migrations in `~/workspace/your_files/luxe-boutique-*.sql`.
EmailJS keys are configured for order confirmation emails.
