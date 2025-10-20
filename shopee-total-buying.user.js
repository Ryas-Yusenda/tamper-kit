// ==UserScript==
// @name         Shopee Total Buying
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.5.0
// @description  Displays your total spending on Shopee order pages, excluding cancelled orders.(Skip Cancelled Orders)
// @author       Ry-ys
// @match        *://*.shopee.co.id/user/purchase*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.co.id
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const hrefToCheck = 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/orderlist/pcmall-orderlist.be906d354978591b4b3d.css';
  const SELECTOR = '.t7TQaf';

  // helper: extract numbers only
  function extractNumber(text) {
    const digits = (text || '').replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }

  // create floating div
  const totalDiv = document.createElement('div');
  Object.assign(totalDiv.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: '999999',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'sans-serif',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(6px)'
  });
  totalDiv.textContent = 'Loading total...';
  document.body.appendChild(totalDiv);

  // helper: check if element belongs to a cancelled order
  function isCancelled(el) {
    const container = el.closest('.YL_VlX'); // tiap order container
    if (!container) return false;
    const statusEl = container.querySelector('.bv3eJE');
    if (!statusEl) return false;
    const statusText = statusEl.textContent.trim().toLowerCase();
    return statusText.includes('dibatalkan');
  }

  // calculate total
  function calculateTotal() {
    const elements = document.querySelectorAll(SELECTOR);
    let total = 0;
    let skipped = 0;

    elements.forEach(el => {
      if (isCancelled(el)) {
        skipped++;
        return;
      }
      total += extractNumber(el.textContent || '');
    });

    totalDiv.textContent = `🧾 Total: Rp ${total.toLocaleString('id-ID')} (Skip ${skipped})`;
    console.log(`[ShopeeTotal] Total Rp${total}, skipped ${skipped} cancelled orders`);
  }

  // observe <main> for any added nodes (robust)
  function observeMain() {
    const main = document.querySelector('main');
    if (!main) {
      console.log('[ShopeeTotal] <main> not found, retrying in 800ms');
      setTimeout(observeMain, 800);
      return;
    }

    calculateTotal();

    const observer = new MutationObserver(mutations => {
      let shouldRecalc = false;
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.(SELECTOR) || node.querySelector?.(SELECTOR)) {
            shouldRecalc = true;
            break;
          }
        }
        if (shouldRecalc) break;
      }
      if (shouldRecalc) {
        console.log('[ShopeeTotal] changes detected -> recalc');
        calculateTotal();
      }
    });

    observer.observe(main, { childList: true, subtree: true });
    console.log('[ShopeeTotal] Observer attached to <main>');
  }

  // start logic: check CSS link then start observing
  function startIfCssMatches() {
    const link = document.querySelector(`link[rel="preload"][as="style"][href="${hrefToCheck}"]`);
    if (!link) {
      console.warn('[ShopeeTotal] preload link not found:', hrefToCheck);
      // tetap lanjut meskipun link tidak ditemukan
      observeMain();
      return;
    }

    function start() {
      observeMain();
    }

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
      window.addEventListener(
        'DOMContentLoaded',
        () => {
          if (document.readyState === 'interactive' || document.readyState === 'complete') start();
        },
        { once: true }
      );
    }
  }

  startIfCssMatches();
})();
