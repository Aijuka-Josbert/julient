/* ==========================================================================
   validation.js — contact form validation + email sending via EmailJS
   ========================================================================== */

(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  if (!form) return;

  var successMsg = document.getElementById("formSuccess");

  // --- Validation rules ---
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

  // --- Attach blur/input events ---
  ["fullName", "email", "message"].forEach(function (name) {
    var field = form.elements[name];
    field.addEventListener("blur", function () { validateField(field); });
    field.addEventListener("input", function () {
      if (field.closest(".form-field").classList.contains("invalid")) validateField(field);
    });
  });

  // --- Submit handler ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
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

    // --- Prepare data for EmailJS ---
    var templateParams = {
      fullName: form.elements.fullName.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      area: form.elements.area.value || "Not specified",
      message: form.elements.message.value.trim()
    };

    var submitBtn = form.querySelector("button[type='submit']");
    var original = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    successMsg.hidden = true;

    // --- Send via EmailJS ---
    // Your EmailJS credentials – DO NOT CHANGE THESE
    var SERVICE_ID = "service_y9oouy9";
    var TEMPLATE_ID = "template_tqm3o8m";

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(function(response) {
        // Success
        successMsg.textContent = "Thank you. Your message has been sent successfully. I'll reply within one business day.";
        successMsg.hidden = false;
        form.reset();
        submitBtn.textContent = original;
        submitBtn.disabled = false;

        // Scroll to success message so user can see it
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function(error) {
        // Error
        alert("Sorry, there was an error sending your message. Please try again later or contact me directly at tuhaisejuliet6@gmail.com.");
        console.error("EmailJS error:", error);
        submitBtn.textContent = original;
        submitBtn.disabled = false;
      });
  });
})();