// ==UserScript==
// @name         Shopee Total Buying
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.0.0
// @description  Automatically displays your total spending and purchase summary on Shopee order pages for quick insights.
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

  // calculate total
  function calculateTotal() {
    const elements = document.querySelectorAll(SELECTOR);
    let total = 0;
    console.log('[ShopeeTotal] found elements:', elements.length);
    elements.forEach(el => {
      total += extractNumber(el.textContent || '');
    });
    totalDiv.textContent = `🧾 Total: Rp ${total.toLocaleString('id-ID')}`;
  }

  // observe <main> for any added nodes (robust)
  function observeMain() {
    const main = document.querySelector('main');
    if (!main) {
      console.log('[ShopeeTotal] <main> not found, retrying in 800ms');
      setTimeout(observeMain, 800);
      return;
    }

    // initial calc
    calculateTotal();

    const observer = new MutationObserver(mutations => {
      let shouldRecalc = false;
      for (const m of mutations) {
        // if nodes added directly match or contain descendants that match the selector
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches && node.matches(SELECTOR)) {
            shouldRecalc = true;
            break;
          }
          if (node.querySelector && node.querySelector(SELECTOR)) {
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

  // start logic: check CSS link then start observing (supports cases where load already fired)
  function startIfCssMatches() {
    const link = document.querySelector(`link[rel="preload"][as="style"][href="${hrefToCheck}"]`);
    if (!link) {
      console.warn('[ShopeeTotal] preload link not found:', hrefToCheck);
      // optional: still continue without link check — uncomment next line to force run
      // observeMain();
      return;
    }

    function start() {
      observeMain();
    }

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start, { once: true });
      // also try DOMContentLoaded as a fallback for SPA-ish pages
      window.addEventListener(
        'DOMContentLoaded',
        () => {
          if (document.readyState === 'interactive' || document.readyState === 'complete') {
            start();
          }
        },
        { once: true }
      );
    }
  }

  startIfCssMatches();
})();
