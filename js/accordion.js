document.addEventListener("DOMContentLoaded", function () {
  var accordions = document.querySelectorAll(".accordion-trigger");
  var panels = document.querySelectorAll(".accordion-panel");

  function setPanelHeight(panel) {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }

  accordions.forEach(function (accordion, index) {
    accordion.addEventListener("click", function () {
      var panel = panels[index];
      var willOpen = !accordion.classList.contains("active");

      accordions.forEach(function (acc, i) {
        if (i !== index) {
          acc.classList.remove("active");
          acc.setAttribute("aria-expanded", "false");
          panels[i].classList.remove("is-open");
          panels[i].style.maxHeight = null;
        }
      });

      accordion.classList.toggle("active", willOpen);
      accordion.setAttribute("aria-expanded", String(willOpen));
      panel.classList.toggle("is-open", willOpen);
      panel.style.maxHeight = willOpen ? panel.scrollHeight + "px" : null;
    });
  });

  /* keep open panel sized correctly if content/layout changes (e.g. window resize) */
  window.addEventListener("resize", function () {
    document.querySelectorAll(".accordion-panel.is-open").forEach(setPanelHeight);
  });

  /* radio-driven timeline entries live inside the panel and change its content height */
  document.querySelectorAll(".timeline-radio").forEach(function (radio) {
    radio.addEventListener("change", function () {
      var panel = radio.closest(".accordion-panel");
      if (panel && panel.classList.contains("is-open")) {
        window.requestAnimationFrame(function () {
          setPanelHeight(panel);
        });
      }
    });
  });
});
