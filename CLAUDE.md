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
- Background sub-experience lists (`.sl__face--list`, e.g. `#sub-2`, `#sub-3`): every `.sl__panel` shares one fixed `--panel-h`, so a sub-list panel only has room for ~2 short (one-line place) sub-items. A 3rd item, or a place long enough to wrap to two lines, overflows `.sl__list`. Rose explicitly didn't want the card itself to grow taller for this — `.sl__list` already had `overflow-y:auto`, just no visible scrollbar, so the fix is a styled native scrollbar (`scrollbar-width`/`scrollbar-color` + `::-webkit-scrollbar*`, orange thumb) rather than a taller panel. Note: Chromium in **overlay-scrollbar mode** (true in this sandbox's headless testing, maybe not in a real browser) ignores `::-webkit-scrollbar` styling entirely and shows nothing — don't assume that means it's broken for real users; check `getComputedStyle` deltas or ask before "fixing" it again with a bigger `--panel-h` or a custom JS scrollbar (both tried and reverted once already).
- News photo layouts, decided entry-by-entry with Rose rather than one global rule (her request — ask before applying one of these broadly to a new entry):
  - `.gallery` img no longer forces a crop (no `aspect-ratio`/`object-fit`) — each photo keeps its real proportions, which is why a 2-up row can have uneven heights.
  - `.gallery--match`: forces both figures to the same height via `object-fit:cover` (minor crop) — use only when the two photos' aspect ratios are close enough that cropping stays subtle (checked visually first, e.g. Stanford garden+portrait).
  - `.gallery--prize`: asymmetric columns (`1.3fr 1fr`) + `align-items:center`, no cropping at all — used when one photo is noticeably more landscape than the other (defense slide+podium, prize ceremony+portrait). Preferred over `.gallery--match` when available, since it has zero crop.
  - `.media--shot--sm` (`max-width:290px`): the "happy medium" size for the text-left/photo-right single-shot layout (`.entry__body:has(.media--shot)`, ≥901px only) — 380px (the unscoped default) read too tall/dominant, 230px read too small. Applied to both current single-photo entries (e-BIGO, "180 seconds").
  - When a photo looks mis-framed, the fastest fix is asking Rose to re-crop and replace the file herself (Windows Photos' crop tool) rather than fighting it with `object-position` — a round of that guessing (prize ceremony photo) went the wrong direction twice before she just re-cropped it herself.

## Open items
1. Add the final domain to Open Graph/canonical tags, plus `sitemap.xml` and `robots.txt`, once deployment is decided (target infra: VM → container → Nginx → Portainer).
2. Projects: first card is "Sport Cycle — Soon" (tag "Sport data", no link yet) — a teaser for a future project linking sport performance data with menstrual-cycle tracking, not started yet, placed first out of chronological order on purpose since it's upcoming. Once she starts it for real, give it a proper link/arrow. The NAR submission (circRNA sponging in melanoma resistance, in review) was deliberately removed from Projects rather than shown unlinked — once it's published, give it its own card with a real DOI link, modelled on the Cirscan card.
3. Meta tags (`<title>`, `description`, `og:title`, `og:description`) still say "Bioinformatics project manager" — out of sync with the new About copy (see below). Update once the full text pass is done.

## Content rewrite (in progress, Oct 2026)
Rose is rewriting the site's text herself (with help) to reposition from "bioinformatics project manager" toward a more general computational/data profile, for job hunting outside pure bioinformatics. Rules for this pass, confirmed with her directly — don't deviate without asking:
- Never display "Data Scientist" or "Data Analyst" literally as a role/title anywhere on the site. Current About role title: "Computational Scientist".
- No em dashes ("—") in body copy — she finds them an AI writing tell. Use a colon or comma instead, picked by context.
- Keep bioinformatics/cancer-research facts specific and visible (PhD, published paper, NAR submission, "cancer data", "melanoma") — this is real, verifiable, and not sensitive. But generalize anything naming CAD-internal tools, cohorts or private repos (e.g. she benchmarks public ML classifiers and CAD-internal pipelines; don't name the specific tools/cohorts/repo names — her employer repos are private, not linkable).
- Don't overclaim: she benchmarks/evaluates/integrates existing tools, she does not build ML models from scratch. Word it as evaluating, comparing, benchmarking — not developing/creating.
- Tone: plain and direct over "literary". Sentences starting with "I'm" tend to get rejected — vary the opening.
- News entry titles: never repeat the entry's own tag word in the title (e.g. not "Poster at JOBIM 2022" when the tag already says "Poster" — just "JOBIM 2022"; not "PhD defense" next to tag "PhD" — retitled "Thesis defense"). Apply this to any new entry too.
- Status: About, Background, Projects and News done for this repositioning pass. Contact copy not yet finalized, she's weighing whether to add a downloadable CV but her CV itself isn't updated yet, so meta tags (title/description/og:*) still say "Bioinformatics project manager" until Contact is settled.
- Her real pre-CAD CV (PDF) was used to fact-check Background: Teaching was two separate posts in 2022 (Master, Paris) and 2023 (Bachelor, Rennes), not one in 2022; M1 intern 2020 (Ligue Nationale Contre le Cancer, remote, pancreatic cancer scRNA-seq) and M2 intern 2021 (IGDR/GEO team, melanoma RNA signatures) were missing entirely and are now sub-experiences of the MSc card. She declined to add her in-progress Datacamp "Data Scientist" training (not finished yet) and confirmed `github.com/roma-rin/portfolio` over the CV's stale GitLab link.
- News was rebuilt against her real CV/photos: added JOBIM 2021/2022/2023 (posters/talk, with "View my poster"/"View my slides" links reusing `.cp-diag` — see `.news-poster-link` in style.css), "My thesis in 180 seconds" (Ligue Nationale, Apr 2023, photo gallery + slides PDF), "Thesis defense" (Nov 28 2024, with the openagenda.com event link) and "Thesis prize" (2nd prize, Fondation Université de Rennes, Nov 21 **2025** — not 2024, got corrected once already) with its own year-row. The original 2024 "Portfolio deployment" entry was kept as a first-launch announcement (not reframed as a "redesign") per her explicit request, now dated 2026 to match the actual rebuild — if she ever wants the *history* of the 2024→2026 rebuild told honestly, that's a separate ask, don't do it unprompted.
- `.entry__type` is now `flex-direction:column` (was row) so a second tag (e.g. Stanford's "Mobility" + "Award") stacks instead of overflowing the fixed 96px column — safe for existing single-tag entries too.

## Deploy
Static hosting — publish the repo root as-is (no build step). Do not push or deploy without being asked; the user handles git pushes themselves.
