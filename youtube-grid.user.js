// ==UserScript==
// @name         YouTube Grid
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.0.0
// @description  Adjust the number of videos per row based on screen width.
// @author       Ry-ys
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/youtube-grid.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/youtube-grid.user.js
// ==/UserScript==

(function () {
  'use strict';

  let styleTag = document.getElementById('custom-grid-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'custom-grid-style';
    document.head.appendChild(styleTag);
  }

  function updateGridItems() {
    const width = innerWidth;
    const itemsPerRow = Math.max(1, Math.floor(width / 280));
    styleTag.textContent = `
      #contents, ytd-rich-grid-renderer {
        --ytd-rich-grid-items-per-row: ${itemsPerRow} !important;
      }
    `;
  }

  updateGridItems();
  addEventListener('load', updateGridItems);
  addEventListener('resize', updateGridItems);
})();
