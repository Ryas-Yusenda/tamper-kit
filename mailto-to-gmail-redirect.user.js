// ==UserScript==
// @name         Mailto to Gmail Redirect
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      2.0.0
// @description  Automatically converts all mailto: links into Gmail compose URLs and opens them in a new tab.
// @author       Ry-ys
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/mailto-to-gmail-redirect.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/mailto-to-gmail-redirect.user.js
// ==/UserScript==

(function () {
  'use strict';

  const update = () => {
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      const email = a.href.replace(/^mailto:/, '');
      a.href = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=${encodeURIComponent(email)}`;
      a.target = '_blank';
    });
  };
  update();
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true });
})();
