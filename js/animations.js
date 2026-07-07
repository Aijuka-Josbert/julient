/* ==========================================================================
   animations.js — scroll reveals, animated counters, hero canvas,
   testimonial slider, gallery filter + lightbox, FAQ accordion
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-up");
  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".stat-num");
  var counterObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || "";
      var start = 0;
      var duration = 1600;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { counterObserver.observe(c); });

  /* ---------- Hero canvas: slow drifting constellation of lines ---------- */
  var canvas = document.getElementById("heroCanvas");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var points = [];
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resizeCanvas() {
      var hero = canvas.closest(".hero");
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function initPoints() {
      points = [];
      var count = Math.min(46, Math.floor((canvas.width * canvas.height) / 26000));
      for (var i = 0; i < count; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(200,164,93,0.18)";
      ctx.fillStyle = "rgba(200,164,93,0.5)";

      points.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
          var dx = points[i].x - points[j].x;
          var dy = points[i].y - points[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.globalAlpha = 1 - dist / 130;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      points.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reduceMotion) requestAnimationFrame(draw);
    }

    resizeCanvas();
    initPoints();
    draw();
    window.addEventListener("resize", function () {
      resizeCanvas();
      initPoints();
      if (reduceMotion) draw();
    });
  }

  /* ---------- Testimonial slider (auto-sliding) ---------- */
  var slides = document.querySelectorAll(".testimonial-slide");
  var dotsWrap = document.getElementById("testimonialDots");
  var current = 0;
  var slideTimer;

  if (slides.length) {
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Show testimonial " + (i + 1));
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", function () { goToSlide(i); resetTimer(); });
      dotsWrap.appendChild(b);
    });

    function goToSlide(i) {
      slides[current].classList.remove("active");
      dotsWrap.children[current].classList.remove("active");
      current = i;
      slides[current].classList.add("active");
      dotsWrap.children[current].classList.add("active");
    }

    function nextSlide() { goToSlide((current + 1) % slides.length); }

    function resetTimer() {
      clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, 6000);
    }
    resetTimer();
  }

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.dataset.filter;
      galleryItems.forEach(function (item) {
        var show = filter === "all" || item.dataset.cat === filter;
        item.classList.toggle("hide", !show);
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var placeholder = item.querySelector(".img-placeholder");
      var label = placeholder.getAttribute("data-label");
      lightboxImg.style.backgroundImage = window.getComputedStyle(placeholder).backgroundImage;
      lightboxImg.setAttribute("data-label", label);
      lightboxCaption.textContent = label;
      lightbox.classList.add("open");
    });
  });

  function closeLightbox() { lightbox.classList.remove("open"); }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- FAQ accordion ---------- */
  var triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var panel = trigger.nextElementSibling;
      var expanded = trigger.getAttribute("aria-expanded") === "true";

      triggers.forEach(function (t) {
        t.setAttribute("aria-expanded", "false");
        t.nextElementSibling.style.maxHeight = null;
      });

      if (!expanded) {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- Insights search ---------- */
  var searchInput = document.getElementById("insightSearch");
  var insightCards = document.querySelectorAll(".insight-card");
  var emptyMsg = document.getElementById("insightsEmpty");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var q = searchInput.value.trim().toLowerCase();
      var visibleCount = 0;
      insightCards.forEach(function (card) {
        var haystack = (card.dataset.tags + " " + card.textContent).toLowerCase();
        var show = haystack.indexOf(q) !== -1;
        card.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });
      emptyMsg.hidden = visibleCount !== 0;
    });
  }
})();
