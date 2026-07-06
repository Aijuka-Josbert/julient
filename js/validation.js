/* ==========================================================================
   validation.js — contact form validation
   ========================================================================== */

(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  if (!form) return;

  var successMsg = document.getElementById("formSuccess");

  var rules = {
    fullName: function (v) { return v.trim().length >= 2 || "Please enter your full name."; },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) || "Please enter a valid email address.";
    },
    message: function (v) { return v.trim().length >= 10 || "Please add a few more details (10+ characters)."; }
  };

  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var result = rule(field.value);
    var errorEl = document.getElementById("err-" + field.name);
    var wrap = field.closest(".form-field");

    if (result === true) {
      wrap.classList.remove("invalid");
      if (errorEl) errorEl.textContent = "";
      return true;
    } else {
      wrap.classList.add("invalid");
      if (errorEl) errorEl.textContent = result;
      return false;
    }
  }

  ["fullName", "email", "message"].forEach(function (name) {
    var field = form.elements[name];
    field.addEventListener("blur", function () { validateField(field); });
    field.addEventListener("input", function () {
      if (field.closest(".form-field").classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;
    ["fullName", "email", "message"].forEach(function (name) {
      if (!validateField(form.elements[name])) valid = false;
    });

    if (!valid) {
      successMsg.hidden = true;
      var firstInvalid = form.querySelector(".form-field.invalid input, .form-field.invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var submitBtn = form.querySelector("button[type='submit']");
    var original = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(function () {
      successMsg.hidden = false;
      form.reset();
      submitBtn.textContent = original;
      submitBtn.disabled = false;
    }, 900);
  });
})();
