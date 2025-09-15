// ==UserScript==
// @name         ChatGPT Soft Green Theme
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.1.0
// @description  Change ChatGPT custom theme to soft green
// @author       Ry-ys
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/chat-gpt-theme.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/chat-gpt-theme.user.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.innerHTML = `
        [data-chat-theme=green], [data-chat-theme=green] .dark {
            --theme-attribution-highlight-bg: #ffffff33 !important;
            --theme-entity-accent: #f9f9f9 !important;
            --theme-mini-msg-bg: #4cafa380 !important;
            --theme-secondary-btn-bg: #f0f0f0 !important;
            --theme-secondary-btn-text: #4cafa3 !important;
            --theme-submit-btn-bg: #f0f0f0 !important;
            --theme-submit-btn-text: #4cafa3 !important;
            --theme-user-msg-bg: #4cafa380 !important;
            --theme-user-msg-text: #f9f9f9 !important;
            --theme-user-selection-bg: #ffffff33 !important;
        }
    `;
  document.head.appendChild(style);
})();
