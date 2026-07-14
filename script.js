const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navDropdowns = document.querySelectorAll(".nav-dropdown");

const closeDropdowns = (exceptDropdown) => {
  navDropdowns.forEach((dropdown) => {
    if (dropdown === exceptDropdown) {
      return;
    }

    dropdown.classList.remove("is-open");
    dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    const menu = dropdown.querySelector(".nav-dropdown-menu");
    if (menu) {
      menu.hidden = true;
    }
  });
};

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      closeDropdowns();
    }
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      closeDropdowns();
    });
  });
}

navDropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  const menu = dropdown.querySelector(".nav-dropdown-menu");

  toggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (menu) {
      menu.hidden = !isOpen;
    }
    closeDropdowns(dropdown);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".primary-nav")) {
    closeDropdowns();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdowns();
  }
});

const lifeTabs = document.querySelectorAll("[data-life-tab]");
const lifePanels = document.querySelectorAll("[data-life-panel]");

const activateLifePanel = (panelName) => {
  if (!lifeTabs.length || !lifePanels.length) {
    return;
  }

  const targetPanelName = [...lifePanels].some((panel) => panel.dataset.lifePanel === panelName)
    ? panelName
    : lifePanels[0].dataset.lifePanel;

  lifeTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.lifeTab === targetPanelName);
  });

  lifePanels.forEach((panel) => {
    const isActive = panel.dataset.lifePanel === targetPanelName;
    panel.classList.toggle("is-active", isActive);
  });
};

lifeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const panelName = tab.dataset.lifeTab;
    activateLifePanel(panelName);
    history.replaceState(null, "", `#${panelName}`);
  });
});

if (lifeTabs.length) {
  activateLifePanel(window.location.hash.replace("#", ""));
}

window.addEventListener("hashchange", () => {
  activateLifePanel(window.location.hash.replace("#", ""));
});

document.querySelectorAll("[data-history-back]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetHref = link.getAttribute("href") || "";

    if (targetHref.includes("#")) {
      return;
    }

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
