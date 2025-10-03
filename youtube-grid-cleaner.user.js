// ==UserScript==
// @name         YouTube Grid & Cleaner
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      3.0.0
// @description  Adjust the number of videos per row based on screen width and hide ads, Shorts, and other unwanted elements on YouTube for a cleaner layout experience.
// @author       Ry-ys
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/youtube-grid-cleaner.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/youtube-grid-cleaner.user.js
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
      div#teaser-carousel,
      ytd-badge-supported-renderer.style-scope.ytd-watch-metadata,
      ytd-merch-shelf-renderer,
      #ticket-shelf,
      ytd-metadata-row-container-renderer[component-style="RICH_METADATA_RENDERER_STYLE_SQUARE"],
      .ytd-tvfilm-offer-module-renderer,
      ytd-feed-nudge-renderer,
      ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
      ytd-engagement-panel-section-list-renderer[target-id^="shopping_panel_for_entry_point"],
      yt-slimline-survey-view-model,
      ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer,
      ytd-rich-shelf-renderer:has(a[href^="/shorts"]),
      ytd-reel-shelf-renderer,
      a[href^="/shorts"],
      ytd-grid-video-renderer:has(a[href^="/shorts"]),
      ytd-reel-item-renderer,
      ytd-video-renderer:has(a[href*="shorts"]),
      a[title="Shorts"],
      a[href="/shorts"] {
        display: none !important;
      }
      ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
        margin-left: 8px !important;
      }
      yt-content-metadata-view-model {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      yt-content-metadata-view-model:nth-child(1) {
        display: block !important;
        text-align: left !important;
        margin-bottom: 4px;
      }
      yt-content-metadata-view-model:nth-child(2) {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        text-align: left !important;
        gap: 2px;
      }
      yt-live-chat-text-message-renderer {
        font-size: 20px !important;
      }
    `;
  }

  updateGridItems();
  addEventListener('load', updateGridItems);
  addEventListener('resize', updateGridItems);
})();
