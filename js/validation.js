/* ==========================================================================
   validation.js — contact form validation + email sending via EmailJS
   ========================================================================== */

(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  if (!form) return;

  var successMsg = document.getElementById("formSuccess");

  // --- Get field references ---
  var fullNameField = document.getElementById("fullName");
  var emailField = document.getElementById("email");
  var phoneField = document.getElementById("phone");
  var messageField = document.getElementById("message");

  // ========================================
  // 1. REAL-TIME INPUT FILTERING
  // ========================================

  // Full name: only letters, spaces, hyphens, apostrophes
  if (fullNameField) {
    fullNameField.addEventListener("input", function () {
      this.value = this.value.replace(/[^A-Za-z\s\-']/g, "");
    });
  }

  // Phone: only digits (remove anything else instantly)
  if (phoneField) {
    phoneField.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
    });
  }

  // Email & message are not filtered – they can contain any characters.

  // ========================================
  // 2. VALIDATION RULES (for blur/submit)
  // ========================================

  var rules = {
    fullName: function (v) {
      var trimmed = v.trim();
      if (trimmed.length < 2) return "Please enter your full name (at least 2 characters).";
      // Only letters, spaces, hyphens, apostrophes (already enforced by filter, but re-check)
      if (!/^[A-Za-z\s\-']+$/.test(trimmed)) {
        return "Full name can only contain letters, spaces, hyphens, and apostrophes.";
      }
      return true;
    },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) || "Please enter a valid email address.";
    },
    phone: function (v) {
      var digits = v.trim();
      // Digits only – already enforced by filter, but re-check
      if (!/^\d+$/.test(digits)) return "Phone number must contain only digits.";
      if (digits.length < 7) return "Phone number must be at least 7 digits.";
      return true;
    },
    message: function (v) {
      return v.trim().length >= 10 || "Please add a few more details (10+ characters).";
    }
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

  // ========================================
  // 3. ATTACH BLUR / INPUT EVENTS
  // ========================================

  ["fullName", "email", "phone", "message"].forEach(function (name) {
    var field = form.elements[name];
    if (!field) return;
    field.addEventListener("blur", function () { validateField(field); });
    field.addEventListener("input", function () {
      if (field.closest(".form-field").classList.contains("invalid")) {
        validateField(field);
      }
    });
  });

  // ========================================
  // 4. SUBMIT HANDLER
  // ========================================

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    var valid = true;
    ["fullName", "email", "phone", "message"].forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      successMsg.hidden = true;
      var firstInvalid = form.querySelector(".form-field.invalid input, .form-field.invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // --- Prepare data for EmailJS ---
    var templateParams = {
      fullName: fullNameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField.value.trim(), // already only digits
      area: document.getElementById("area").value || "Not specified",
      message: messageField.value.trim()
    };

    var submitBtn = form.querySelector("button[type='submit']");
    var original = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    successMsg.hidden = true;

    // --- Send via EmailJS ---
    var SERVICE_ID = "service_y9oouy9";
    var TEMPLATE_ID = "template_tqm3o8m";

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(function (response) {
        successMsg.textContent = "Thank you. Your message has been sent successfully. I'll reply within one business day.";
        successMsg.hidden = false;
        form.reset();
        submitBtn.textContent = original;
        submitBtn.disabled = false;
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function (error) {
        alert("Sorry, there was an error sending your message. Please try again later or contact me directly at tuhaisejuliet6@gmail.com.");
        console.error("EmailJS error:", error);
        submitBtn.textContent = original;
        submitBtn.disabled = false;
      });
  });
})();