// ==UserScript==
// @name         Pixeldrain URL Transformation Demo (Educational)
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      2.9.1
// @description  Educational demonstration of client-side URL transformation, DOM injection, and UI augmentation.
// @author       Ry-ys
// @match        *://*.pixeldrain.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixeldrain.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @updateURL    http://tamper-kit.test/pixeldrain.user.js
// @downloadURL  http://tamper-kit.test/pixeldrain.user.js
// ==/UserScript==

/*
  DISCLAIMER:
  THIS USERSCRIPT IS PROVIDED STRICTLY FOR EDUCATIONAL PURPOSES ONLY.

  Demonstrated concepts:
  - URL pattern analysis and transformation
  - DOM polling and conditional injection
  - Dynamic button creation and event handling
  - Clipboard API usage
  - Basic error handling strategies

  This script is NOT intended to:
  - Circumvent service limitations
  - Bypass paywalls, quotas, or access controls
  - Violate Pixeldrain's Terms of Service

  Do not redistribute as a "bypass" or "downloader" tool.
  Use responsibly and at your own risk.
*/

(function () {
  'use strict';

  const mirrorBaseUrls = [
    // 'https://pd.cybar.xyz/',
    // 'https://pixeldrain.sriflix.my/'
    'https://pd.1drv.eu.org/'
  ];

  const idRegex = /\/api\/file\/(\w+)\//;

  let attempt = 0;
  const maxAttempts = 30;

  const applyCustomStyles = () => {
    const css = `
      #btn-cts-download {}
      #btn-cts-link {}

      .toolbar.svelte-jngqwx.toolbar_visible {
        width: min-content !important;
      }

      .file_preview.toolbar_visible.svelte-jngqwx.svelte-jngqwx.svelte-jngqwx {
        left: 11.2em !important;
      }
    `;

    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  };

  const makeBtn = (icon, text, cb) => {
    const b = document.createElement('button');
    b.style = 'white-space:nowrap;width:100%';
    b.id = `btn-cts-${String(icon).replace(/\W+/g, '').toLowerCase()}`;
    b.className = 'button_highlight';

    const i = document.createElement('span');
    i.className = 'icon';
    i.textContent = icon;

    const t = document.createElement('span');
    t.textContent = text;

    b.append(i, t);
    b.addEventListener('click', cb);

    return b;
  };

  function getTransformedUrls(type, url = '') {
    const cur = location.href;

    if (type === 'file') return mirrorBaseUrls[0] + cur.replace('https://pixeldrain.com/u/', '');

    if (type === 'gallery') {
      const list = [],
        names = [];

      document.querySelectorAll('a.file').forEach(link => {
        const match = link.querySelector('div').style.backgroundImage.match(idRegex);
        if (match?.[1]) {
          list.push(mirrorBaseUrls[0] + match[1]);
          names.push(link.textContent);
        }
      });

      return { urlList: list, urlNames: names };
    }

    if (type === 'zipFile') return mirrorBaseUrls[0] + url.replace('https://pixeldrain.com/api/file/', '');
  }

  function handleButtonClick() {
    try {
      const cur = location.href;

      const openSafely = url => {
        try {
          if (url) window.open(url, '_blank');
          else throw new Error('Invalid URL');
        } catch (err) {
          console.error('Failed to open:', url, err);
          alert('Failed to open link: ' + (err.message || String(err)));
        }
      };

      if (cur.includes('/u/')) {
        const url = getTransformedUrls('file');
        if (url) openSafely(url);
      }

      if (cur.includes('/l/')) {
        const gallery = getTransformedUrls('gallery');
        const list = gallery?.urlList || [];
        list.forEach(openSafely);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error: ' + (err.message || String(err)));
    }
  }

  function handleLinksButtonClick() {
    try {
      const cur = location.href;
      const links = cur.includes('/u/') ? [getTransformedUrls('file')] : cur.includes('/l/') ? getTransformedUrls('gallery').urlList : [];

      if (!links.length) return;

      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API not available.');

      navigator.clipboard.writeText(links.join('\n'));
    } catch (err) {
      console.error('Clipboard error:', err);
      alert(err.message || String(err));
    }
  }

  const btn = makeBtn('download', 'Open Mirror', handleButtonClick);
  const linksBtn = makeBtn('link', 'Copy Mirror Links', handleLinksButtonClick);

  const waitForLabel = setInterval(() => {
    attempt++;
    const labels = document.querySelectorAll('div.label');

    labels.forEach(l => {
      if (l.textContent.trim() === 'Size') {
        const n = l.nextElementSibling;
        if (n) {
          applyCustomStyles();
          n.insertAdjacentElement('afterend', linksBtn);
          n.insertAdjacentElement('afterend', btn);
          clearInterval(waitForLabel);
        }
      }
    });

    if (attempt >= maxAttempts) clearInterval(waitForLabel);
  }, 500);
})();
