// ==UserScript==
// @name         ouo.io Form Automation (Educational)
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      2.0.2
// @description  Educational demonstration of form detection and automated submission logic.
// @author       Ry-ys
// @match        *://*.ouo.io/*
// @match        *://*.ouo.press/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouo.io
// @grant        none
// @run-at       document-idle
// @license      MIT
// @updateURL    http://tamper-kit.test/ouo-io.user.js
// @downloadURL  http://tamper-kit.test/ouo-io.user.js
// ==/UserScript==

/*
  DISCLAIMER:
  This userscript is provided STRICTLY FOR EDUCATIONAL PURPOSES ONLY.

  It demonstrates:
  - DOM form detection
  - Conditional element inspection
  - Automated form submission logic

  This script is NOT intended to:
  - Circumvent advertising systems
  - Bypass captchas or access controls
  - Violate website terms of service

  Use responsibly and at your own risk.
*/

(function () {
  'use strict';

  const form = document.forms[0];
  const captcha = document.getElementById('form-captcha');
  const hasClickableCaptcha = captcha && typeof captcha.click === 'function';

  if (form && (!captcha || hasClickableCaptcha)) {
    form.submit();
  }
})();
