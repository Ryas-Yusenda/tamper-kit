// ==UserScript==
// @name         Youtube Grid Enhanced
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.0.0
// @description  Customize Youtube grid items per row and hide ads/unwanted elements.
// @author       Ry-ys
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/youtube-grid-enhanced.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/youtube-grid-enhanced.user.js
// ==/UserScript==

(function () {
  'use strict';

  // Create or get existing style tag
  let styleTag = document.getElementById('custom-grid-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'custom-grid-style';
    document.head.appendChild(styleTag);
  }

  // Function to update grid items based on window width
  function updateGridItems() {
    const width = window.innerWidth;
    const minItemWidth = 280;
    const itemsPerRow = Math.max(1, Math.floor(width / minItemWidth));

    // Update CSS variable
    styleTag.textContent = `
        /* ===================================
        GRID LAYOUT
        =================================== */
        #contents,
        ytd-rich-grid-renderer {
        --ytd-rich-grid-items-per-row: ${itemsPerRow} !important;
        }

        /* ===================================
        VIDEO DESCRIPTION
        =================================== */
        div#teaser-carousel,
        ytd-badge-supported-renderer.style-scope.ytd-watch-metadata {
        display: none !important;
        }

        ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
        margin-left: 8px !important;
        }

        /* ===================================
        ADS & PROMOTIONS
        =================================== */
        /* Description box shelves */
        ytd-merch-shelf-renderer,
        #ticket-shelf,
        ytd-metadata-row-container-renderer[component-style="RICH_METADATA_RENDERER_STYLE_SQUARE"] {
        display: none !important;
        }

        /* Sidebar recommendations & panels */
        .ytd-tvfilm-offer-module-renderer,
        ytd-feed-nudge-renderer,
        ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"],
        ytd-engagement-panel-section-list-renderer[target-id^="shopping_panel_for_entry_point"] {
        display: none !important;
        }

        /* ===================================
        VIDEO GRID DESCRIPTION
        =================================== */
        /* Keep main container column-based */
        yt-content-metadata-view-model {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        }

        /* First row: channel name */
        yt-content-metadata-view-model:nth-child(1) {
        display: block !important;
        text-align: left !important;
        margin-bottom: 4px;
        }

        /* Second row: view count + stream info → stacked vertically */
        yt-content-metadata-view-model:nth-child(2) {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        text-align: left !important;
        gap: 2px;
        }

        /* ===================================
        HIDE SHORTS VIDEOS
        =================================== */
        ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer {
        display: none !important;
        }
    `;
  }

  // Update when load and resize
  window.addEventListener('load', updateGridItems);
  window.addEventListener('resize', updateGridItems);
})();
