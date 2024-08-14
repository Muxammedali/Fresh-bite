// =========================================
// For customers (testimonial) start code

document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("carousel");
  const dotsContainer = document.getElementById("dots");
  const testimonials = document.querySelectorAll(".testimonial");

  let isDragging = false;
  let startX, scrollLeft;

  // Create dots
  testimonials.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => {
      carousel.scrollTo({
        left: index * carousel.clientWidth,
        behavior: "smooth",
      });
      setActiveDot(index);
    });
    dotsContainer.appendChild(dot);
  });

  // Set active dot
  function setActiveDot(index) {
    const dots = dotsContainer.querySelectorAll("button");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // Scroll event listener
  carousel.addEventListener("scroll", () => {
    const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
    setActiveDot(index);
  });

  // Set initial active dot
  setActiveDot(0);

  // Mouse down event
  carousel.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  // Mouse leave event
  carousel.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  // Mouse up event
  carousel.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Mouse move event
  carousel.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    carousel.scrollLeft = scrollLeft - walk;
  });
});

// ============================================
// For customers (testimonial) end code

// for heart icon
document.querySelectorAll(".heart-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    icon.classList.toggle("active");
  });
});
