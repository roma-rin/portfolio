(function () {
  "use strict";

  /* Only hide [data-reveal] content once JS is confirmed running,
     so a blocked/slow script never leaves the page blank. */
  document.documentElement.classList.add("js-ready");

  /* Mobile navigation toggle */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scrollspy: highlight the nav link for the section in view */
  var sections = document.querySelectorAll("main > section[id]");
  var navLinkByHash = {};
  document.querySelectorAll(".nav-link").forEach(function (link) {
    navLinkByHash[link.getAttribute("href")] = link;
  });

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navLinkByHash["#" + entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            document.querySelectorAll(".nav-link").forEach(function (l) {
              l.classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* Scroll-reveal animations */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length && "IntersectionObserver" in window) {
    var reveal = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) {
      reveal.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Dark mode toggle, persisted in localStorage */
  var THEME_KEY = "portfolio-theme";
  var root = document.documentElement;
  var themeToggle = document.querySelector(".theme-toggle");

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — theme just won't persist */
    }
  }

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    if (themeToggle) {
      var isDark =
        theme === "dark" ||
        (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  }

  var stored = getStoredTheme();
  applyTheme(stored);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current =
        root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      storeTheme(next);
    });
  }
})();
