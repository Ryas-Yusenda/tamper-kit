// ==UserScript==
// @name         Canva Dark Theme
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.0.0
// @description  Improve the dark theme of the Canva app
// @author       Ry-ys
// @match        *://*.canva.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=canva.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/canva-theme.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/canva-theme.user.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.innerHTML = `
    :root {
      --GoAooA: #282c34 !important; /* background utama */
      --Uhgt1Q: #21252b !important; /* panel/sidebar */
      ---mghVQ: linear-gradient(180deg, var(--Uhgt1Q) 0%, var(--GoAooA) 100%) !important;
    }`;
  document.head.appendChild(style);
})();
