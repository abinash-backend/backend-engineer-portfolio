const applyRevealAnimations = () => {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 50, 220)}ms`;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach(item => observer.observe(item));
};

document.addEventListener("sections:loaded", applyRevealAnimations);
