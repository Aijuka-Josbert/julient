/* ==========================================================================
   app.js — core site behaviour: preloader, cursor, header, nav, theme,
   scroll progress, cookie banner, scroll-to-top
   ========================================================================== */

(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var preloader = document.getElementById("preloader");
    setTimeout(function () {
      preloader.classList.add("hidden");
    }, 900);
  });

  /* ---------- Custom cursor ---------- */
  var dot = document.getElementById("cursorDot");
  var ring = document.getElementById("cursorRing");
  var hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (hasFinePointer) {
    var ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = "translate(" + mouseX + "px," + mouseY + "px) translate(-50%,-50%)";
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll("a, button, input, textarea, select, .practice-card, .gallery-item").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("grow"); });
    });
  } else {
    dot.style.display = "none";
    ring.style.display = "none";
  }

  /* ---------- Header scroll state + scroll progress ---------- */
  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("scrollProgress");
  var scrollTopBtn = document.getElementById("scrollTop");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("scrolled", y > 40);
    scrollTopBtn.classList.toggle("show", y > 600);

    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    progress.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll spy for nav active state ---------- */
  var sections = Array.prototype.map.call(
    document.querySelectorAll("section[id]"),
    function (s) { return s; }
  );
  var navLinks = document.querySelectorAll(".nav-link");

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (l) {
          l.classList.toggle("active", l.dataset.section === id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(function (s) { spyObserver.observe(s); });

  /* ---------- Theme toggle (persisted) ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var htmlEl = document.documentElement;

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  try {
    var savedTheme = localStorage.getItem("nabirye-theme");
    if (savedTheme) applyTheme(savedTheme);
  } catch (e) { /* storage unavailable, default theme stands */ }

  themeToggle.addEventListener("click", function () {
    var next = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("nabirye-theme", next); } catch (e) {}
  });

  /* ---------- Cookie consent ---------- */
  var cookieBanner = document.getElementById("cookieBanner");
  var cookieAccept = document.getElementById("cookieAccept");
  var cookieDecline = document.getElementById("cookieDecline");

  try {
    if (!localStorage.getItem("nabirye-cookie-choice")) {
      setTimeout(function () { cookieBanner.classList.add("show"); }, 1600);
    }
  } catch (e) {
    setTimeout(function () { cookieBanner.classList.add("show"); }, 1600);
  }

  function dismissCookieBanner(choice) {
    cookieBanner.classList.remove("show");
    try { localStorage.setItem("nabirye-cookie-choice", choice); } catch (e) {}
  }
  cookieAccept.addEventListener("click", function () { dismissCookieBanner("accepted"); });
  cookieDecline.addEventListener("click", function () { dismissCookieBanner("declined"); });

  /* ---------- Ripple effect origin for buttons ---------- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("pointerdown", function (e) {
      var rect = btn.getBoundingClientRect();
      btn.style.setProperty("--rx", (e.clientX - rect.left) + "px");
      btn.style.setProperty("--ry", (e.clientY - rect.top) + "px");
    });
  });

  /* ---------- Newsletter form (front-end only) ---------- */
  var newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector("input");
      var btn = newsletterForm.querySelector("button");
      var original = btn.textContent;
      btn.textContent = "Subscribed";
      input.value = "";
      setTimeout(function () { btn.textContent = original; }, 2400);
    });
  }
})();
