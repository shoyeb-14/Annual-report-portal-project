$(document).ready(function () {
    // Counter Animation
    $(".counter").each(function () {
      const $this = $(this);
      const target = parseFloat($this.data("target"));
      let count = parseFloat($this.text().replace(/[₹Cr]/g, "")) || 0;
      const isRupee = $this.data("target").toString().includes("₹");
      const needsPlus =
        $this.data("plus") === true || $this.data("plus") === "true";

      function updateCount() {
        let increment = target / 100;

        if (count < target) {
          count += increment;

          if (isRupee) {
            $this.text(`₹${count.toFixed(1)} Cr`);
          } else {
            $this.text(`${Math.floor(count)}${needsPlus ? "+" : ""}`);
          }

          if (count < target) {
            setTimeout(updateCount, 30);
          } else {
            $this.text(
              isRupee
                ? `₹${target} Cr`
                : `${Math.floor(target)}${needsPlus ? "+" : ""}`
            );
          }
        } else {
          if (isRupee) {
            $this.text(`₹${target} Cr`);
          } else {
            $this.text(target + (needsPlus ? "+" : ""));
          }
        }
      }

      updateCount();
    });

    // Lazy Load Images
    const lazyImages = document.querySelectorAll(".lazy-load");
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));

    // Scroll Animations
    const animateOnScroll = document.querySelectorAll(".animate-on-scroll");
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    });

    animateOnScroll.forEach((el) => scrollObserver.observe(el));

    // Scroll to Top Button
    const scrollToTopBtn = $("#scrollToTop");
    $(window).scroll(function () {
      if ($(window).scrollTop() > 300) {
        scrollToTopBtn.fadeIn();
      } else {
        scrollToTopBtn.fadeOut();
      }
    });

    scrollToTopBtn.click(function () {
      $("html, body").animate({ scrollTop: 0 }, 500);
      return false;
    });

    // Card Hover Animation
    $(".interactive-card").hover(
      function () {
        $(this).find(".card-body").addClass("glow");
      },
      function () {
        $(this).find(".card-body").removeClass("glow");
      }
    );
  });