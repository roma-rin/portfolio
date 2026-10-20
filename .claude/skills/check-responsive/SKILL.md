---
name: check-responsive
description: Serve this portfolio locally and screenshot it across desktop/tablet/mobile widths with headless Chromium, to check the responsive layout after a CSS or HTML change. Use whenever asked to check responsiveness, look at the site in a browser, or verify a layout fix on this project.
---

# Checking the portfolio responsively

This is a static site (no build step). Node/npm/`chromium-cli` are **not** installed on
this machine — don't reach for them. Use the Python toolchain instead: Playwright for
Python is already installed, including the Chromium browser (installed once via
`python -m playwright install chromium`; re-run that only if launch fails with
"Executable doesn't exist").

## 1. Serve the site

```bash
nohup python -m http.server 8743 > /path/to/scratchpad/server.log 2>&1 &
disown
timeout 10 bash -c 'until curl -sf http://localhost:8743/index.html >/dev/null; do sleep 0.5; done'
```

Stop it when done:
```bash
pid=$(netstat -ano 2>/dev/null | grep ":8743" | grep LISTENING | awk '{print $5}' | head -1)
powershell -Command "Stop-Process -Id $pid -Force"
```

**Gotcha:** `python -m http.server` is single-threaded. Opening many Playwright pages
against it in one long-lived script can hang the navigation (`Page.goto` timing out)
once Chromium opens several keep-alive connections at once. If a multi-width loop
inside one `with sync_playwright()` block stalls, split it into one Python
invocation per width (launch + close the browser each time) instead of debugging the
server.

## 2. Widths that matter

- **Desktop**: 1440 (and optionally 1920, 1280)
- **Tablet**: 900/901 (the `min-width:901px` vs `max-width:900px` breakpoint), 820, 768
- **Mobile**: 680/681 (the main mobile breakpoint), 600, 430, 390, 360, 320 — narrow
  phones (≤390px) are where text starts wrapping to extra lines and is where past
  overflow bugs showed up (see the contact-logo note in `CLAUDE.md`)

## 3. Reveal-on-scroll means don't just screenshot cold

Sections use `[data-reveal]` + an `IntersectionObserver` (`js/main.js`) that only
adds `.is-visible` (the CSS that actually shows the content) once an element has
scrolled into view. A `page.screenshot(full_page=True)` taken right after `goto()`
will show big blank gaps — that's not a bug, the observer just never fired. Scroll
through the page first:

```python
total = page.evaluate("document.documentElement.scrollHeight")
y = 0
while y < total:
    page.evaluate(f"window.scrollTo(0,{y})")
    page.wait_for_timeout(80)
    y += 400
page.evaluate(f"window.scrollTo(0,{total})")
page.wait_for_timeout(300)
```
then screenshot (or scroll back to top first for a top-of-page shot).

## 4. A representative script (per width)

```python
import sys
from playwright.sync_api import sync_playwright
w = int(sys.argv[1])
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": w, "height": 1000})
    page.goto("http://localhost:8743/index.html", timeout=15000)
    total = page.evaluate("document.documentElement.scrollHeight")
    y = 0
    while y < total:
        page.evaluate(f"window.scrollTo(0,{y})"); page.wait_for_timeout(80); y += 400
    page.evaluate(f"window.scrollTo(0,{total})"); page.wait_for_timeout(300)
    page.screenshot(path=f"scan_{w}.png", full_page=True)
    b.close()
```

To inspect one section closely (e.g. the contact block), use
`page.query_selector("#contact").screenshot(path=...)` instead of a full-page shot.

## 5. Interactions worth clicking through, not just viewing statically

- `.nav-toggle` → mobile menu opens/closes, `.nav-current` label updates
- `[data-sl-next]` / `[data-sl-prev]` and `.sl__toggle` → Background slider + PhD
  sub-experience reveal
- `.entry__head` → News accordion (one open at a time), `.news-more` → older news
- `.cp-copy` → clipboard copy button swaps to "Copied"

Check `page.on("console", ...)` for `type == "error"` and `page.on("pageerror", ...)`
after each interaction — a silent JS exception is easy to miss from screenshots alone.

Save screenshots to the session scratchpad, not the repo.
