/* ==========================================================================
   security.js — Disable Developer Tools and Right-Click
   ========================================================================== */

(function() {
  "use strict";

  // ============================================
  // 1. DISABLE RIGHT-CLICK
  // ============================================
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // ============================================
  // 2. DISABLE KEYBOARD SHORTCUTS
  // ============================================
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.keyCode === 73)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.keyCode === 74)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.keyCode === 67)) {
      e.preventDefault();
      return false;
    }
    return true;
  });

  // ============================================
  // 3. DETECT DEV TOOLS OPEN (Console Warning)
  // ============================================
  console.log('%c🔒 Developer Tools Detection Enabled', 'font-size: 20px; color: #c8a45d; font-weight: bold;');
  console.log('%c🛡️ This site is protected. Please respect the content.', 'font-size: 14px; color: #888;');

  // ============================================
  // 4. PREVENT TEXT SELECTION (Optional)
  // ============================================
  // document.querySelector('body').style.userSelect = 'none';
  // document.querySelector('body').style.webkitUserSelect = 'none';

})();