const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-history-back]").forEach((link) => {
  link.addEventListener("click", (event) => {
    let isSameSiteReferrer = false;

    if (document.referrer) {
      try {
        isSameSiteReferrer = new URL(document.referrer).origin === window.location.origin;
      } catch {
        isSameSiteReferrer = false;
      }
    }

    if (isSameSiteReferrer && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });
});

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
