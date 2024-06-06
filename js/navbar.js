  <script>
    document.addEventListener("DOMContentLoaded", function() {
      const navLinks = document.querySelectorAll('.nav-link');
      const sections = document.querySelectorAll('section');

      function removeActiveClasses() {
        navLinks.forEach(link => link.classList.remove('active'));
      }

      function addActiveClass(currentLink) {
        removeActiveClasses();
        currentLink.classList.add('active');
      }

      window.addEventListener('scroll', function() {
        let current = '';
        const pageHeight = document.documentElement.scrollHeight;
        const scrollPos = window.innerHeight + window.pageYOffset;

        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.parentNode.getAttribute('id');
          }
        });
        
        if (scrollPos >= pageHeight) {
          current = sections[sections.length - 1].parentNode.getAttribute('id');
        }

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
          }
        });
      });
    });
  </script>