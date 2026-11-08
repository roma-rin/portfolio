/* Rose Fraboulet — portfolio interactions */
(function () {
  var root = document.documentElement;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest(".nav-link")) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- News: older entries ---- */
  var more = document.querySelector(".news-more"), older = document.getElementById("news-older");
  if (more && older) more.addEventListener("click", function () {
    var open = more.getAttribute("aria-expanded") === "true";
    older.hidden = open;
    more.setAttribute("aria-expanded", open ? "false" : "true");
    more.querySelector("span").textContent = open ? "Older news" : "Show less";
  });

  /* ---- News entries: one collapsible per entry ---- */
  document.querySelectorAll(".entry__head").forEach(function (head) {
    var panel = document.getElementById(head.getAttribute("aria-controls"));
    if (!panel) return;
    head.addEventListener("click", function () {
      var open = head.getAttribute("aria-expanded") === "true";
      if (!open) {
        (head.closest("section") || document).querySelectorAll('.entry__head[aria-expanded="true"]').forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
          var p = document.getElementById(other.getAttribute("aria-controls"));
          if (p) p.classList.remove("is-open");
        });
      }
      head.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
    });
  });

  /* ---- Reveal on scroll (opt-in, so a blocked script never hides content) ---- */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (revealables.length && "IntersectionObserver" in window &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("js-ready");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---- Scroll spy on the nav ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var targets = links.map(function (l) {
    return document.querySelector(l.getAttribute("href"));
  });
  var ticking = false;
  function spy() {
    var y = window.scrollY + 140;
    var index = 0;
    targets.forEach(function (section, i) {
      if (section && section.offsetTop <= y) index = i;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) index = targets.length - 1;
    links.forEach(function (l, i) { l.classList.toggle("active", i === index); });
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  spy();

  /* ---- Background slider: one active step at a time ---- */
  document.querySelectorAll("[data-slider]").forEach(function (sl) {
    var track = sl.querySelector("[data-sl-track]"), panels = [].slice.call(track.querySelectorAll(".sl__panel")),
        steps = [].slice.call(sl.querySelectorAll("[data-sl-step]")),
        prev = sl.querySelector("[data-sl-prev]"), fill = sl.querySelector("[data-sl-fill]"), next = sl.querySelector("[data-sl-next]"), active = 0, auto = false, timer;
    function setActive(i, scroll) {
      active = Math.max(0, Math.min(panels.length - 1, i));
      panels.forEach(function (p, k) { p.classList.toggle("is-active", k === active); });
      steps.forEach(function (st, k) { st.classList.toggle("is-active", k === active); st.classList.toggle("is-past", k < active); if (k === active) st.setAttribute("aria-current", "step"); else st.removeAttribute("aria-current"); });
      prev.disabled = active === 0; next.disabled = active === panels.length - 1;
      if (fill) fill.style.width = ((active + 1) / panels.length * 100) + "%";
      if (scroll) {
        var p = panels[active], max = track.scrollWidth - track.clientWidth, left = track.scrollLeft;
        if (p.offsetLeft < left) left = p.offsetLeft;
        else if (p.offsetLeft + p.offsetWidth > left + track.clientWidth) left = p.offsetLeft + p.offsetWidth - track.clientWidth;
        auto = true; clearTimeout(timer); timer = setTimeout(function () { auto = false; }, 700);
        track.scrollTo({ left: Math.min(max, Math.max(0, left)) });
      }
    }
    function visible(p) { return p.offsetLeft >= track.scrollLeft - 2 && p.offsetLeft + p.offsetWidth <= track.scrollLeft + track.clientWidth + 2; }
    function onScroll() {
      if (auto || visible(panels[active])) return;
      var max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft > max - 4) return setActive(panels.length - 1);
      for (var k = 0; k < panels.length; k++) if (visible(panels[k])) return setActive(k);
    }
    prev.addEventListener("click", function () { setActive(active - 1, true); });
    next.addEventListener("click", function () { setActive(active + 1, true); });
    steps.forEach(function (st, k) { st.addEventListener("click", function () { setActive(k, true); }); });
    panels.forEach(function (p, k) { p.addEventListener("click", function (e) { if (!e.target.closest("a") && !track.classList.contains("is-drag")) setActive(k, true); }); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); setActive(active + 1, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setActive(active - 1, true); }
    });
    track.querySelectorAll(".has-sub").forEach(function (p) {
      var btn = p.querySelector(".sl__toggle"), main = p.querySelector(".sl__face--main"), list = p.querySelector(".sl__face--list");
      if (!btn || !main || !list) return;
      function set(open) {
        p.classList.toggle("is-open", open);
        main.classList.toggle("is-shown", !open); main.setAttribute("aria-hidden", open ? "true" : "false");
        list.classList.toggle("is-shown", open); list.setAttribute("aria-hidden", open ? "false" : "true");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.setAttribute("aria-label", open ? "Back to main experience" : btn.getAttribute("data-label"));
      }
      btn.addEventListener("click", function (e) { e.stopPropagation(); set(!p.classList.contains("is-open")); });
      p.addEventListener("keydown", function (e) { if (e.key === "Escape" && p.classList.contains("is-open")) { set(false); btn.focus(); } });
      set(false);
    });
    track.addEventListener("scroll", onScroll, { passive: true });
    setActive(0);
  });

  /* ---- Contact: Paris time + copy email ---- */
  var t = document.getElementById("cpTime");
  if (t) { var tick = function () { t.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }); }; tick(); setInterval(tick, 30000); }
  document.querySelectorAll(".cp-copy").forEach(function (b) {
    var txt = b.querySelector(".cp-copy__txt");
    b.addEventListener("click", function () {
      var done = function () { b.classList.add("is-done"); txt.textContent = "Copied"; setTimeout(function () { b.classList.remove("is-done"); txt.textContent = "Copy"; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done); else done();
    });
  });

  /* ---- Back to top ---- */
  document.querySelectorAll(".ft__top").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); var f = document.querySelector(".site-header a:not(.skip-link)"); if (f) f.focus({ preventScroll: true }); });
  });

  /* ---- Mobile: current section label in closed menu ---- */
  var cur = document.querySelector(".nav-current"), navUl = document.getElementById("nav-links");
  if (cur && navUl) {
    var sync = function () { var a = navUl.querySelector(".nav-link.active"); if (a) cur.textContent = a.textContent; };
    new MutationObserver(sync).observe(navUl, { subtree: true, attributes: true, attributeFilter: ["class"] });
    sync();
  }

  /* ---- Contact: logo height = text block height ---- */
  var cvB = document.querySelector(".cv-b"), cvTxt = cvB && cvB.querySelector(".cp-b");
  if (cvB && cvTxt && "ResizeObserver" in window) {
    var cvFit = function () {
      var k = cvTxt.children; if (!k.length) return;
      var h = k[k.length - 1].getBoundingClientRect().bottom - k[0].getBoundingClientRect().top;
      if (h > 0) cvB.style.setProperty("--cv-h", Math.round(h * 1.12) + "px");
    };
    new ResizeObserver(cvFit).observe(cvTxt);
    if (document.fonts) document.fonts.ready.then(cvFit);
    cvFit();
  }

  /* ---- Analytics: custom PostHog events (no-op if PostHog is blocked) ---- */
  function track(name, props) { if (window.posthog && posthog.capture) posthog.capture(name, props || {}); }
  function sectionOf(el) { var s = el.closest("section[id]"); return s ? s.id : "other"; }

  // Sections actually seen, once per page load: shows how far people read.
  if ("IntersectionObserver" in window) {
    var seenIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { track("section_viewed", { section: en.target.id }); seenIo.unobserve(en.target); }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll("main section[id]").forEach(function (s) { seenIo.observe(s); });
  }

  // News entry opened (only on open, not on close).
  document.querySelectorAll(".entry__head").forEach(function (head) {
    head.addEventListener("click", function () {
      if (head.getAttribute("aria-expanded") !== "true") return;
      var title = head.querySelector(".entry__title");
      track("news_opened", { entry: head.getAttribute("aria-controls").replace(/^entry-/, ""), title: title ? title.textContent.trim() : "" });
    });
  });
  if (more) more.addEventListener("click", function () { if (more.getAttribute("aria-expanded") === "true") track("older_news_opened"); });

  // Background: other experiences revealed.
  document.querySelectorAll(".has-sub .sl__toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.getAttribute("aria-expanded") !== "true") return;
      var role = btn.closest(".sl__panel").querySelector(".sl__face--main .sl__role");
      track("background_expanded", { experience: role ? role.textContent.trim() : "" });
    });
  });

  // E-mail copied or opened.
  document.querySelectorAll(".cp-copy").forEach(function (b) { b.addEventListener("click", function () { track("email_copied"); }); });
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) { a.addEventListener("click", function () { track("email_clicked"); }); });

  // Links leaving the page (CV, LinkedIn, GitHub, paper, posters...).
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]"); if (!a) return;
    var href = a.getAttribute("href");
    if (/^(#|mailto:)/.test(href)) return;
    var label = (a.textContent.trim() || a.getAttribute("aria-label") || href).replace(/\s+/g, " ");
    if (/^resume\//.test(href)) track("resume_opened", { section: sectionOf(a) });
    track("link_clicked", { label: label, url: a.href, section: sectionOf(a) });
  });
})();
