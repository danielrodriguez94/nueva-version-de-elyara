# ELYARA Creative — Website v2

Redesign focused exclusively on digital website services.

## Structure
- `index.html` — Home
- `services.html` — Website services
- `portfolio.html` — Real website portfolio
- `about.html` — About ELYARA
- `contact.html` — Contact / project inquiry

## Changes in v2
- Multi-page architecture instead of a long one-page site.
- Smooth fade transition when moving between internal pages.
- Header logo corrected so the full logo is shown proportionally instead of being cropped by CSS.
- Removed printing, merchandise, embroidery, physical business cards, flyers, and other physical-product services.
- Removed the marketing/advertising section and Google login to keep the site focused and minimal.
- Added digital business cards as a digital-only secondary service.
- Portfolio now focuses only on websites created by ELYARA.
- `sandrafamilychildcare.com` points exactly to `https://sandrafamilychildcare.com`.
- No pricing is shown.
- Preserved six-language support: English, Spanish, Portuguese, Italian, French, Simplified Chinese.
- Contact form can still use Supabase when configured in `config.js`.

## Supabase
If form delivery is needed, add the project URL and anonymous key in `config.js` and run the existing `supabase.sql` schema.
