const loader = document.getElementById("loader");
const website = document.getElementById("website");
const notFoundPage = document.getElementById("notFoundPage");
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");
const cursorGlow = document.getElementById("cursorGlow");
const mainHeader = document.getElementById("mainHeader");

window.addEventListener("load", () => {
  if (loader) {
    if (loader) setTimeout(() => loader.classList.add("hide"), 900);
  }

  if (sessionStorage.getItem("stacklyLogoReloaded") === "true") {
    sessionStorage.removeItem("stacklyLogoReloaded");
    showWebsite(true);
  }

  initReveal();
  initCounters();
  initParallax();
  initTiltCards();
});

function toggleMenu() {
  nav?.classList.toggle("open");
  const menuButton = document.querySelector(".menu-btn");
  if (menuButton && nav) {
    menuButton.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
  }
}

function closeMenu() {
  nav?.classList.remove("open");
  const menuButton = document.querySelector(".menu-btn");
  if (menuButton) menuButton.setAttribute("aria-expanded", "false");
}

function scrollToSection(id) {
  const pageMap = {
    home: "index.html",
    services: "services.html",
    about: "about-lab.html",
    research: "research.html",
    automation: "automation.html",
    team: "team.html",
    contact: "contact.html"
  };
  if (pageMap[id]) window.location.href = pageMap[id];
}

document.querySelectorAll(".nav a, .footer a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

function open404() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (currentPage.includes("dashboard")) {
    localStorage.setItem("stacklyDashboardBackPage", currentPage);
  }
  window.location.href = "404.html";
}

function showWebsite(scrollTop = true) {
  notFoundPage?.classList.remove("active");
  website?.classList.add("active");
  closeMenu();

  if (scrollTop) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* Logo click: one reload, then land at top of home */
document.addEventListener("click", (event) => {
  const logo = event.target.closest(".stackly-logo, .stackly-home");
  if (!logo) return;

  event.preventDefault();
  sessionStorage.setItem("stacklyLogoReloaded", "true");
  location.reload();
});

/* Scroll progress and premium header state */
window.addEventListener("scroll", () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const value = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;

  if (progress) {
    if (progress) progress.style.width = value + "%";
  }

  if (mainHeader) {
    mainHeader.classList.toggle("scrolled", window.scrollY > 80);
  }
});

/* Premium cursor glow */
document.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;

  if (cursorGlow) {
    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";
  }
});

/* Reveal animation and progress bars */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("show");

      entry.target.querySelectorAll(".progress b").forEach((bar) => {
        bar.style.width = bar.dataset.width || "80%";
      });
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

/* Animated counters */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count || 0);
      const duration = 1400;
      const startTime = performance.now();

      function update(now) {
        const amount = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - amount, 3);
        const value = Math.floor(eased * target);

        if (target === 98) {
          counter.textContent = value + "%";
        } else if (target >= 1000) {
          counter.textContent = value.toLocaleString() + "+";
        } else {
          counter.textContent = value + "+";
        }

        if (amount < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(counter);
    });
  }, { threshold: 0.65 });

  counters.forEach((counter) => observer.observe(counter));
}

/* Hero image parallax */
function initParallax() {
  const images = document.querySelectorAll(".parallax-img");

  document.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 900) return;

    const x = (event.clientX / window.innerWidth - 0.5) * 16;
    const y = (event.clientY / window.innerHeight - 0.5) * 16;

    images.forEach((image) => {
      image.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
    });
  });
}

/* Soft 3D hover cards */
function initTiltCards() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 900) return;

      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

      card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function submitForm(event) {
  event.preventDefault();
  window.location.href = "404.html";
}



/* ===== LIGHT / DARK MODE ===== */
(function(){
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("stacklyTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("stacklyTheme", isDark ? "dark" : "light");
      themeToggle.textContent = isDark ? "☀️" : "🌙";
    });
  }
})();


/* Extra responsive menu safety */
document.addEventListener("click", (event) => {
  const clickedInsideHeader = event.target.closest("#mainHeader");
  if (!clickedInsideHeader) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) closeMenu();
});

/* Auth modal + safe forms */
function openAuthModal(mode = "login") {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeMenu();
  switchAuth(mode);
  const focusInput = mode === "signup" ? 'input[name="signupEmail"]' : 'input[name="loginEmail"]';
  setTimeout(() => modal.querySelector(focusInput)?.focus(), 80);
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function switchAuth(mode = "login") {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  const loginForm = modal.querySelector("#loginForm");
  const signupForm = modal.querySelector("#signupForm");
  const showSignup = mode === "signup";

  loginForm?.classList.toggle("active", !showSignup);
  signupForm?.classList.toggle("active", showSignup);

  const focusInput = showSignup ? 'input[name="signupEmail"]' : 'input[name="loginEmail"]';
  setTimeout(() => modal.querySelector(focusInput)?.focus(), 60);
}


/* Custom role select - fixes mobile native select overlap */
document.addEventListener("click", function(event) {
  const currentSelect = event.target.closest(".custom-select");

  document.querySelectorAll(".custom-select.open").forEach((select) => {
    if (select !== currentSelect) select.classList.remove("open");
  });

  const selectButton = event.target.closest(".custom-select-btn");
  if (selectButton) {
    const select = selectButton.closest(".custom-select");
    select?.classList.toggle("open");
    return;
  }

  const optionButton = event.target.closest(".custom-select-menu button");
  if (optionButton) {
    const select = optionButton.closest(".custom-select");
    const hiddenInput = select?.querySelector("input[type='hidden']");
    const button = select?.querySelector(".custom-select-btn");

    if (hiddenInput) hiddenInput.value = optionButton.dataset.value || "";
    if (button) button.textContent = optionButton.textContent.trim();
    select?.classList.remove("open");
  }
});

function resetCustomSelect(form) {
  form?.querySelectorAll(".custom-select").forEach((select) => {
    const btn = select.querySelector(".custom-select-btn");
    const hidden = select.querySelector("input[type='hidden']");
    if (btn) btn.textContent = select.dataset.placeholder || "Select Role";
    if (hidden) hidden.value = "";
    select.classList.remove("open");
  });
}


document.addEventListener("input", function(event) {
  const input = event.target;
  if (!input || !input.matches("input")) return;

  const placeholder = (input.getAttribute("placeholder") || "").toLowerCase();
  const isNameField = input.name?.toLowerCase().includes("name") || placeholder.includes("name");
  if (isNameField) {
    input.value = input.value.replace(/[^A-Za-z\s]/g, "");
  }
});

document.addEventListener("submit", function(event) {
  const form = event.target;
  if (!form || !form.matches("form")) return;

  if (form.id !== "loginForm" && form.id !== "signupForm") return;

  event.preventDefault();

  const roleInputName = form.id === "loginForm" ? "loginRole" : "signupRole";
  const selectedRoleInput = form.querySelector(`[name="${roleInputName}"]`);
  if (selectedRoleInput && !selectedRoleInput.value) {
    showAuthNotice("Please select your role.");
    form.querySelector(".custom-select-btn")?.focus();
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (form.id === "signupForm") {
    const password = form.querySelector("#signupPassword")?.value || "";
    const confirm = form.querySelector("#confirmPassword")?.value || "";
    if (password !== confirm) {
      const confirmField = form.querySelector("#confirmPassword");
      confirmField?.setCustomValidity("Passwords do not match");
      confirmField?.reportValidity();
      setTimeout(() => confirmField?.setCustomValidity(""), 1200);
      return;
    }

    const selectedRole = form.querySelector('[name="signupRole"]')?.value || "";
    localStorage.setItem("stacklySignupRole", selectedRole);
    form.reset();
    resetCustomSelect(form);
    switchAuth("login");
    const loginRole = document.querySelector('[name="loginRole"]');
    if (loginRole && selectedRole) loginRole.value = selectedRole;
    const customRole = loginRole?.closest(".custom-select")?.querySelector(".custom-select-btn");
    if (customRole && selectedRole) customRole.textContent = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
    const loginEmail = document.querySelector('input[name="loginEmail"]');
    loginEmail?.focus();
    showAuthNotice("Signup successful. Please login to continue.");
    return;
  }

  if (form.id === "loginForm") {
    const role = form.querySelector('[name="loginRole"]')?.value;
    const loginEmail = form.querySelector('input[name="loginEmail"]')?.value.trim() || "";
    const dashboardMap = {
      admin: "admin-dashboard.html",
      researcher: "researcher-dashboard.html",
      patient: "patient-dashboard.html"
    };

    localStorage.setItem("stacklyLoginRole", role || "");
    localStorage.setItem("stacklyLoginEmail", loginEmail);
    const emailName = loginEmail.includes("@") ? loginEmail.split("@")[0] : loginEmail;
    localStorage.setItem("stacklyDisplayName", emailName || "User");

    window.location.href = dashboardMap[role] || "404.html";
  }
});

function showAuthNotice(message) {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  let notice = modal.querySelector(".auth-notice");
  if (!notice) {
    notice = document.createElement("div");
    notice.className = "auth-notice";
    const activePanel = modal.querySelector(".auth-panel.active");
    const firstField = activePanel?.querySelector(".custom-select, input");
    if (firstField) activePanel.insertBefore(notice, firstField);
    else activePanel?.appendChild(notice);
  }
  notice.textContent = message;
  notice.classList.add("show");
  setTimeout(() => notice.classList.remove("show"), 2600);
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") closeMenu();
});


function showDashPanel(panelId, button) {
  document.querySelectorAll(".dashboard-panel").forEach((panel) => panel.classList.remove("active"));
  document.getElementById(panelId)?.classList.add("active");
  document.querySelectorAll(".dashboard-menu button").forEach((btn) => btn.classList.remove("active"));
  button?.classList.add("active");
  if (window.innerWidth < 950) { closeDashboardMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }
}


function initDashboardUser() {
  const email = localStorage.getItem("stacklyLoginEmail") || "guest@stacklybiotech.com";
  const savedName = localStorage.getItem("stacklyDisplayName");
  const displayName = savedName || (email.includes("@") ? email.split("@")[0] : "User");
  const role = localStorage.getItem("stacklyLoginRole") || "";
  document.querySelectorAll("[data-dashboard-name]").forEach((el) => {
    el.textContent = displayName;
  });
  document.querySelectorAll("[data-dashboard-email]").forEach((el) => {
    el.textContent = email;
  });
  document.querySelectorAll("[data-dashboard-role]").forEach((el) => {
    el.textContent = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";
  });
}

function dashboardLogout() {
  localStorage.removeItem("stacklyLoginRole");
  localStorage.removeItem("stacklyLoginEmail");
  localStorage.removeItem("stacklyDisplayName");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", initDashboardUser);

function toggleDashboardMenu() {
  document.querySelector(".dashboard-sidebar")?.classList.toggle("open");
}
function closeDashboardMenu() {
  document.querySelector(".dashboard-sidebar")?.classList.remove("open");
}

document.querySelectorAll(".custom-select").forEach(select => {
  const btn = select.querySelector(".custom-select-btn");
  const menu = select.querySelector(".custom-select-menu");
  const hidden = select.querySelector("input[type='hidden']");

  if (!btn || !menu || !hidden) return;

  btn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelectorAll(".custom-select.open").forEach(openSelect => {
      if (openSelect !== select) openSelect.classList.remove("open");
    });

    select.classList.toggle("open");
  });

  menu.querySelectorAll("[data-value]").forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      btn.textContent = item.textContent.trim();
      hidden.value = item.dataset.value;
      hidden.dispatchEvent(new Event("change", { bubbles: true }));
      select.classList.remove("open");
    });
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-select")) {
    document.querySelectorAll(".custom-select.open").forEach(select => {
      select.classList.remove("open");
    });
  }
});
function goBackPage(){

    const params = new URLSearchParams(window.location.search);

    const from = params.get("from");

    if(from){

        window.location.href = from;

    }else{

        window.location.href = "index.html";

    }

}