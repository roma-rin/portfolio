# Portfolio — Rose-Marie Fraboulet

Single-page site, plain HTML/CSS/JS, no build step, no framework. Open `index.html` directly or serve statically.

## Files
- `index.html` — one page: About, Background, Projects, News, Contact, footer.
- `design-system.html` — living style guide (colours, type, spacing, components, rules). Loads the real `css/style.css`/`css/palettes.css`, so it reflects the site as implemented rather than the original handoff — update its prose when a layout rule changes (e.g. the Contact component note), not just the site.
- `css/style.css` — all styles (dark theme only). `css/palettes.css` — colour tokens, palette `p4` (Bordeaux) selected via `<html data-palette="p4" data-theme="dark">`.
- `js/main.js` — mobile menu, scroll spy, Background slider (arrows/progress line/sub-experience reveal), News accordion + "Older news", Paris clock, copy e-mail, back-to-top, contact-logo height fit.
- `font/` — Sonder (display) + Hanken Grotesk fallback (`.woff2` only — don't reintroduce `.otf`, nothing loads them).
- `img/` — portrait, logo, favicons, News photos.

## Design rules (keep them)
- Dark only. Background `#2d1520` with a slow warm glow; text cream `#f8f5e9`; accent orange `#f39118`; gold `#f0b952`; mauve `#977881`; bordeaux `#8c1632`.
- Titles in Sonder, orange, ending with a white dot: "I'm Rose.", "Where I've worked and studied.", "Where we can talk."
- Body in Hanken Grotesk. Meta lines (places, dates) in muted mauve.
- One card shape everywhere (rounded rectangles, same height in Background and Projects). Only the arrow inside a card is clickable: down arrow = reveal, diagonal arrow = external link.
- Tags: gold-tinted pills.
- Mobile ≤ 680px: hero centred, intro justified, contact logo left / info right, no "Copy" button. Above 680px, Contact flips: info left, logo right, spread across the full width like Background/Projects.
- `style.css` has layered, overlapping rules from several design passes (later rule in the file wins) — when changing shared selectors like `.cv-b`/`.cv-b__logo`, check what comes after in the cascade before assuming a change took effect.

## Known fragile spots
- Contact-section logo width follows `--cv-h` (JS matches it to the text block's height). Below 680px, if the e-mail wraps to two lines the block grows tall and the logo — width:auto, no max-width — can balloon and overflow. Fixed with a `max-width:680px` override pinning it to 92px; don't remove that override without re-testing narrow phones (≤390px).
- News entries: `.entry__body`'s indent (`calc(84px + 96px + var(--s4)*2)`) and max-width are hand-matched to `.entry__date` (84px) + `.entry__type` (96px) + two gaps, so the expanded text/media line up under `.entry__title`, not under the date/tag. If those column widths ever change, update this calc too or the body text will drift left of the title again.

## Open items (from the original design handoff)
1. "Teaching Assistant · Université de Paris · 2022" in Background — added as a test, confirm real or remove.
2. Project "Cirscan · Shiny app" points to the same DOI as "Thesis paper" — needs the real app URL or removal.
3. Add the final domain to Open Graph/canonical tags, plus `sitemap.xml` and `robots.txt`, once deployment is decided (target infra: VM → container → Nginx → Portainer).

## Deploy
Static hosting — publish the repo root as-is (no build step). Do not push or deploy without being asked; the user handles git pushes themselves.
