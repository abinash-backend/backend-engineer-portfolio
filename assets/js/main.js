const sectionsToLoad = [
  ["header", "header.html"],
  ["hero", "hero.html"],
  ["about", "about.html"],
  ["currently-building", "currently-building.html"],
  ["skills", "skills.html"],
  ["services", "services.html"],
  ["future-focus", "future-focus.html"],
  ["portfolio", "portfolio.html"],
  ["contact", "contact.html"],
  ["footer", "footer.html"]
];

const loadSection = async (id, file) => {
  const response = await fetch(`sections/${file}`);
  const markup = await response.text();
  const target = document.getElementById(id);

  if (target) {
    target.innerHTML = markup;
  }
};

const setThemeToggleLabel = () => {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const nextTheme = document.body.dataset.theme === "dark" ? "Light" : "Dark";
  const label = toggle.querySelector(".theme-toggle-label");

  if (label) {
    label.textContent = nextTheme;
  } else {
    toggle.textContent = nextTheme;
  }
};

const initTheme = () => {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.body.dataset.theme = savedTheme;
  }

  setThemeToggleLabel();

  document.addEventListener("click", event => {
    if (event.target.closest("#themeToggle")) {
      const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
      document.body.dataset.theme = nextTheme;
      localStorage.setItem("portfolio-theme", nextTheme);
      setThemeToggleLabel();
    }
  });
};

const initNavigation = () => {
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!navLinks.length || !sections.length) return;

  const setActiveLink = () => {
    const offset = window.scrollY + 140;
    let currentId = sections[0].id;

    sections.forEach(section => {
      if (offset >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
    });
  };

  setActiveLink();
  document.addEventListener("scroll", setActiveLink, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const collapse = document.querySelector(".navbar-collapse.show");
      if (collapse && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });
};

const initFooterYear = () => {
  const yearTarget = document.getElementById("currentYear");
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
};

const initPortfolio = async () => {
  await Promise.all(sectionsToLoad.map(([id, file]) => loadSection(id, file)));
  initTheme();
  initNavigation();
  initFooterYear();
  document.dispatchEvent(new CustomEvent("sections:loaded"));
};

initPortfolio();
