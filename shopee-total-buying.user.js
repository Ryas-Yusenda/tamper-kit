// ==UserScript==
// @name         Shopee Total Buying
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.8.0
// @description  Displays your total spending on Shopee order pages, excluding cancelled orders.
// @author       Ry-ys
// @match        *://*.shopee.co.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.co.id
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const hrefToCheck = 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/orderlist/pcmall-orderlist.be906d354978591b4b3d.css';
  const SELECTOR = '.t7TQaf';

  function extractNumber(text) {
    const digits = (text || '').replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }

  // floating div
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
  totalDiv.textContent = '$';
  document.body.appendChild(totalDiv);

  function isCancelled(el) {
    const container = el.closest('.YL_VlX');
    if (!container) return false;
    const statusEl = container.querySelector('.bv3eJE');
    if (!statusEl) return false;
    return statusEl.textContent.trim().toLowerCase().includes('dibatalkan');
  }

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
    console.log(`[ShopeeTotal] Total Rp${total}, skipped ${skipped}`);
  }

  function observeMain() {
    const main = document.querySelector('main');
    if (!main) {
      console.log('[ShopeeTotal] <main> not found, retrying in 800ms');
      totalDiv.textContent = '$';
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
        console.log('[ShopeeTotal] DOM changed -> recalc');
        calculateTotal();
      }
    });

    observer.observe(main, { childList: true, subtree: true });
    console.log('[ShopeeTotal] Observer attached to <main>');
  }

  function startIfMatches() {
    const isPurchasePage = location.href.startsWith('https://shopee.co.id/user/purchase/') || location.href.includes('/user/purchase/');

    if (!isPurchasePage) {
      console.log('[ShopeeTotal] Not purchase page -> script disabled.');
      totalDiv.textContent = '$';
      return;
    }

    const link = document.querySelector(`link[rel="preload"][as="style"][href="${hrefToCheck}"]`);

    if (!link) {
      console.warn('[ShopeeTotal] Style preload not found -> still continue');
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
          if (['interactive', 'complete'].includes(document.readyState)) start();
        },
        { once: true }
      );
    }
  }

  const pushState = history.pushState;
  const replaceState = history.replaceState;

  function triggerEvent(type) {
    const event = new Event(type);
    window.dispatchEvent(event);
  }

  history.pushState = function (...args) {
    pushState.apply(history, args);
    triggerEvent('urlchange');
  };

  history.replaceState = function (...args) {
    replaceState.apply(history, args);
    triggerEvent('urlchange');
  };

  window.addEventListener('popstate', () => triggerEvent('urlchange'));

  window.addEventListener('urlchange', () => {
    startIfMatches();
  });
})();
