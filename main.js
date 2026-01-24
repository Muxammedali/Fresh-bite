// =========================================
// For customers (testimonial) start code

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("[data-carousel]");
  const dotsContainer = document.querySelector("[data-carousel-dots]");
  const slides = carousel
    ? Array.from(carousel.querySelectorAll(".testimonial"))
    : [];

  if (carousel && dotsContainer && slides.length) {
    const dots = [];

    carousel.setAttribute("tabindex", "0");

    dotsContainer.innerHTML = "";

    const getSlideOffset = (index) =>
      slides[index] ? slides[index].offsetLeft : 0;

    const clampIndex = (index) =>
      Math.max(0, Math.min(index, slides.length - 1));

    const findNearestSlideIndex = () => {
      let nearestIndex = 0;
      let smallestDelta = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const delta = Math.abs(carousel.scrollLeft - slide.offsetLeft);
        if (delta < smallestDelta) {
          smallestDelta = delta;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    };

    const setActiveDot = (index) => {
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    };

    const goToSlide = (index, { smooth = true } = {}) => {
      const targetIndex = clampIndex(index);
      const targetOffset = getSlideOffset(targetIndex);

      carousel.scrollTo({
        left: targetOffset,
        behavior: smooth ? "smooth" : "auto",
      });
      setActiveDot(targetIndex);
    };

    slides.forEach((slide, index) => {
      slide.setAttribute("role", "group");
      slide.setAttribute(
        "aria-label",
        `Testimonial ${index + 1} of ${slides.length}`,
      );

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
      dot.setAttribute("aria-controls", carousel.id);
      dot.setAttribute("aria-pressed", "false");
      dot.addEventListener("click", () => goToSlide(index));

      dots.push(dot);
      dotsContainer.appendChild(dot);
    });

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let activePointerId = null;
    let scrollUpdateFrame = null;

    const shouldIgnoreDrag = (target) =>
      Boolean(
        target.closest(
          "button, a, input, textarea, select, [data-ignore-drag]",
        ),
      );

    const startDrag = (clientX) => {
      isDragging = true;
      startX = clientX;
      scrollLeft = carousel.scrollLeft;
      carousel.classList.add("is-dragging");
      carousel.style.scrollBehavior = "auto";
    };

    const moveDrag = (clientX) => {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      carousel.scrollLeft = scrollLeft - deltaX;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove("is-dragging");
      requestAnimationFrame(() => {
        carousel.style.scrollBehavior = "";
        setActiveDot(findNearestSlideIndex());
      });
    };

    carousel.addEventListener("dragstart", (event) => event.preventDefault());

    if (window.PointerEvent) {
      carousel.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        if (shouldIgnoreDrag(event.target)) return;

        activePointerId = event.pointerId;
        startDrag(event.clientX);

        if (typeof carousel.setPointerCapture === "function") {
          carousel.setPointerCapture(activePointerId);
        }
        event.preventDefault();
      });

      carousel.addEventListener("pointermove", (event) => {
        if (!isDragging || event.pointerId !== activePointerId) return;
        moveDrag(event.clientX);
        event.preventDefault();
      });

      const releasePointer = () => {
        if (
          activePointerId !== null &&
          typeof carousel.hasPointerCapture === "function" &&
          carousel.hasPointerCapture(activePointerId)
        ) {
          carousel.releasePointerCapture(activePointerId);
        }
        activePointerId = null;
      };

      carousel.addEventListener("pointerup", (event) => {
        if (event.pointerId !== activePointerId) return;
        releasePointer();
        endDrag();
      });

      carousel.addEventListener("pointercancel", (event) => {
        if (event.pointerId !== activePointerId) return;
        releasePointer();
        endDrag();
      });

      carousel.addEventListener("pointerleave", (event) => {
        if (event.pointerId !== activePointerId) return;
        releasePointer();
        endDrag();
      });
    } else {
      const handleMouseMove = (event) => {
        if (!isDragging) return;
        moveDrag(event.clientX);
        event.preventDefault();
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        endDrag();
      };

      carousel.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        if (shouldIgnoreDrag(event.target)) return;

        startDrag(event.clientX);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        event.preventDefault();
      });
    }

    carousel.addEventListener("scroll", () => {
      if (scrollUpdateFrame) return;

      scrollUpdateFrame = requestAnimationFrame(() => {
        scrollUpdateFrame = null;
        if (isDragging) return;
        const index = findNearestSlideIndex();
        setActiveDot(index);
      });
    });

    carousel.addEventListener("keydown", (event) => {
      const currentIndex = findNearestSlideIndex();

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSlide(currentIndex + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(currentIndex - 1);
      }
    });

    setActiveDot(0);
  }

  document.querySelectorAll(".heart-icon").forEach((button) => {
    button.addEventListener("click", () => {
      const isActive = button.classList.toggle("active");
      button.setAttribute("aria-pressed", String(isActive));
    });
  });
});
// Muxammedali