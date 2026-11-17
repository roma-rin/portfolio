# Portfolio — Rose-Marie Fraboulet

Single-page site, plain HTML/CSS/JS, no build step, no framework. Open `index.html` directly or serve statically.

## Files
- `index.html` — one page: About, Background, Projects, News, Contact, footer.
- `design-system.html` — living style guide (colours, type, spacing, components, rules). Loads the real `css/style.css`, so it reflects the site as implemented rather than the original handoff — update its prose when a layout rule changes (e.g. the Contact component note), not just the site.
- `css/style.css` — all styles, starting with one `:root` block of tokens (Bordeaux palette). The site has a single dark look: no light theme, no theme switch, no palette switch.
- `js/main.js` — mobile menu, scroll spy, Background slider (arrows/progress line/sub-experience reveal), News accordion + "Older news", Paris clock, copy e-mail, back-to-top, contact-logo height fit, custom PostHog events (`section_viewed`, `news_opened`, `older_news_opened`, `background_expanded`, `email_copied`, `email_clicked`, `resume_opened`, `link_clicked`). These feed the "Portfolio overview" dashboard, which exists identically in Portfolio-dev and Portfolio-prod: rename an event in both the code and the dashboards. Both projects have "Discard client IP data" on; GeoIP country/city still works with it.
- `font/` — Sonder (display) + Hanken Grotesk fallback, `.woff2` files.
- `img/` — portrait, logo, favicons, News photos. Strip EXIF/GPS metadata from any new photo before committing it.
- `resume/` — the resume (CV) PDF linked from Contact (link label "Resume").

## Design rules (keep them)
- Colours: background `#2d1520` with a slow warm glow; text cream `#f8f5e9`; accent orange `#f39118`; gold `#f0b952`; mauve `#977881`; bordeaux `#8c1632`.
- Titles in Sonder, orange, ending with a white dot: "I'm Rose.", "Where I've worked and studied.", "Where we can talk."
- Body in Hanken Grotesk. Meta lines (places, dates) in muted mauve.
- One card shape everywhere (rounded rectangles, same height in Background and Projects). Only the arrow inside a card is clickable: down arrow = reveal, diagonal arrow = external link.
- Tags: gold-tinted pills.
- Mobile ≤ 680px: hero centred, intro justified, contact logo left / info right, no "Copy" button. Above 680px, Contact flips: info left, logo right, spread across the full width like Background/Projects.
- `style.css` is organised by component in page order (tokens, base, navigation, hero, cards, Background, Projects, News, Contact, footer), each followed by its own `@media` rules. Keep one rule per selector and media condition: edit the existing rule rather than appending an override at the end of the file, and remove styles when the markup they target goes away.

## Known fragile spots
- Contact-section logo width follows `--cv-h` (JS matches it to the text block's height). Below 680px, if the e-mail wraps to two lines the block grows tall and the logo — width:auto, no max-width — can balloon and overflow. Fixed with the `max-width:680px` rule pinning it to 92px (Contact section of style.css); don't remove that override without re-testing narrow phones (≤390px).
- News entries: `.entry__body`'s indent (`calc(84px + 96px + var(--s4)*2)`) and max-width are hand-matched to `.entry__date` (84px) + `.entry__type` (96px) + two gaps, so the expanded text/media line up under `.entry__title`, not under the date/tag. If those column widths ever change, update this calc too or the body text will drift left of the title again.
- Background sub-experience lists (`.sl__face--list`, e.g. `#sub-2`, `#sub-3`): every `.sl__panel` shares one fixed `--panel-h`, so a sub-list panel only has room for ~2 short (one-line place) sub-items. A 3rd item, or a place long enough to wrap to two lines, overflows `.sl__list`. The card must not grow taller for this: `.sl__list` has `overflow-y:auto` with a styled native scrollbar (`scrollbar-width`/`scrollbar-color` + `::-webkit-scrollbar*`, orange thumb) rather than a taller panel. Note: Chromium in **overlay-scrollbar mode** (true in headless testing, maybe not in a real browser) ignores `::-webkit-scrollbar` styling entirely and shows nothing — don't assume that means it's broken for real users; check `getComputedStyle` deltas or ask before "fixing" it again with a bigger `--panel-h` or a custom JS scrollbar (both tried and reverted once already).
- News photo layouts are decided entry by entry rather than with one global rule (ask before applying one of these broadly to a new entry):
  - `.gallery` img no longer forces a crop (no `aspect-ratio`/`object-fit`) — each photo keeps its real proportions, which is why a 2-up row can have uneven heights.
  - `.gallery--match`: forces both figures to the same height via `object-fit:cover` (minor crop) — use only when the two photos' aspect ratios are close enough that cropping stays subtle (checked visually first, e.g. Stanford garden+portrait).
  - `.gallery--prize`: asymmetric columns (`1.3fr 1fr`) + `align-items:center`, no cropping at all — used when one photo is noticeably more landscape than the other (defense slide+podium, prize ceremony+portrait). Preferred over `.gallery--match` when available, since it has zero crop.
  - `.media--shot--sm` (`max-width:290px`): the "happy medium" size for the text-left/photo-right single-shot layout (`.entry__body:has(.media--shot)`, ≥901px only) — 380px (the unscoped default) read too tall/dominant, 230px read too small. Applied to both current single-photo entries (e-BIGO, "180 seconds").
  - When a photo looks mis-framed, re-crop the source file rather than adjusting `object-position` by guesswork.

## Open items
1. Production is https://portfolio.romarin.tech/ (behind Cloudflare, which already serves a managed `robots.txt`). `og:url`, `og:image` (absolute URL, required for LinkedIn/WhatsApp previews) and `canonical` use it. `og:image` is `img/og-banner.jpg` (1200×630, rendered at 2x then downscaled and saved as JPEG quality 95 without chroma subsampling: a plain 1x render looked blurry on LinkedIn, and the 2400×1260 file only got a small thumbnail on WhatsApp; bump the `?v=` query in its URL after each change, since Cloudflare and LinkedIn cache it): name on one line in Sonder, underlined `https://portfolio.romarin.tech` with "tech" in accent orange, big logo on the right, no badge, no photo and no role. It is a static render with the site's fonts and colours, regenerate it if the name or the logo changes. A `sitemap.xml` is still missing.
2. Projects: first card is "CyclePulse — Soon" (provisional project name) (tag "Sport data", no link yet) — a teaser for a future project linking sport performance data with menstrual-cycle tracking, placed first out of chronological order on purpose since it's upcoming. Once it exists, give it a proper link/arrow. A paper on circRNA sponging in melanoma resistance is in review: once it's published, give it its own card with a real DOI link, modelled on the Cirscan card.

## Copy rules
Rules for the site's text (ask before deviating):
- Role title on the site: "Computational Scientist" (About). Don't replace it with another title.
- No em dashes ("—") in body copy. Use a colon or comma instead, picked by context.
- Keep research facts specific and visible (PhD, published paper, "cancer data", "melanoma"). Describe current work in general terms, without naming internal tools, datasets or repositories.
- Describe tool work accurately: evaluating, comparing, benchmarking and integrating existing tools.
- Tone: plain and direct over "literary". Vary sentence openings rather than starting with "I'm".
- News entry titles: never repeat the entry's own tag word in the title (e.g. not "Poster at JOBIM 2022" when the tag already says "Poster" — just "JOBIM 2022"; not "PhD defense" next to tag "PhD" — retitled "Thesis defense"). Apply this to any new entry too.
- Contact links to `resume/resume_rose-marie_fraboulet.pdf`, the public version of the resume (no phone number): replace it whenever the resume changes. Title and `og:title` are "Rose-Marie Fraboulet • Portfolio" (same name as the banner and resume). There is deliberately no `description` nor `og:description`: WhatsApp cut it mid-sentence (it falls back to `description` if `og:description` is missing, so both are gone).
- The site's code link is `github.com/roma-rin/portfolio`.
- News: the "Thesis prize" (2nd prize, Fondation Université de Rennes) is dated Nov 21 **2025**, not 2024, with its own year-row.

## Deploy
`.github/workflows/build.yml` builds the `Dockerfile` (nginx + site) on each push to `main` and pushes `ghcr.io/roma-rin/portfolio` tagged `latest` and with the commit sha. The package must stay public so the hosting server can pull it without credentials. The workflow builds only, it does not deploy. The `Dockerfile` copies an explicit file list: never copy the repo root, which holds the git-ignored `.env` with PostHog secret keys. A new top-level site folder must be added to that list. Do not push or deploy without being asked; the user handles git pushes themselves.

Caching: Cloudflare and browsers keep `css/` and `js/` files for 4 hours (`max-age=14400`), while `index.html` is never cached. Whenever `css/style.css` or `js/main.js` changes, bump the `?v=` query on its link in `index.html`, or visitors get the new page with the old stylesheet/script.
