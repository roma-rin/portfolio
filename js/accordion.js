document.addEventListener("DOMContentLoaded", function() {
  var accordions = document.querySelectorAll(".accordion");
  var panels = document.querySelectorAll(".panel");

  accordions.forEach(function(accordion, index) {
    accordion.addEventListener("click", function() {
      accordions.forEach(function(acc, i) {
        if (i !== index) {
          acc.classList.remove("active");
          panels[i].style.display = "none";
        }
      });
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
  });
});