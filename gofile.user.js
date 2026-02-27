// ==UserScript==
// @name         Gofile URL Transformation Demo (Educational)
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.0.0
// @description  Educational demonstration of client-side URL transformation, DOM injection, and UI augmentation.
// @author       Ry-ys
// @match        *://*.gofile.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gofile.io
// @grant        none
// @run-at       document-start
// @license      MIT
// @updateURL    http://tamper-kit.test/gofile.user.js
// @downloadURL  http://tamper-kit.test/gofile.user.js
// ==/UserScript==

/*
  DISCLAIMER:
  This userscript is provided strictly for educational and learning purposes only.

  The code demonstrates:
  - Client-side URL parsing and transformation
  - DOM observation and element injection
  - UI augmentation using JavaScript and CSS
  - Basic event handling in a browser userscript context

  The author does not encourage or support any misuse of this script.
  Users are solely responsible for how they use, modify, or distribute this code.

  Use this script only on websites you own, control, or have explicit permission to test.
  Ensure compliance with applicable laws, regulations, and the target website's
  Terms of Service.

  By using this script, you acknowledge that:
  - This is an educational demonstration, not a production-ready tool
  - The author assumes no liability for any damage, data loss, or legal issues
    resulting from its use

  If you do not agree with these terms, do not use this script.
*/

(function () {
  'use strict';

  const mirrorBaseUrls = ['https://gf.1drv.eu.org/'];

  const idRegex = /gofile\.io\/d\/([a-zA-Z0-9]+)/;

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
    b.className = 'index_addAccount mt-4 flex items-center justify-center gap-2 p-2 text-white bg-blue-600 hover:bg-blue-700 rounded w-full';

    const i = document.createElement('i');
    i.className = 'fa-download fas';

    const t = document.createElement('span');
    t.textContent = text;

    b.append(i, t);
    b.addEventListener('click', cb);

    return b;
  };

  function handleButtonClick() {
    const match = window.location.href.match(idRegex);
    if (!match) {
      alert('Unable to extract file ID from URL. Please ensure you are on a valid Gofile file page.');
      return;
    }

    const fileId = match[1];
    const mirrorUrl = mirrorBaseUrls[0] + fileId;

    window.open(mirrorUrl, '_blank');
  }

  const waitForLabel = setInterval(() => {
    attempt++;
    const parent = document.querySelectorAll('#index_accounts');
    if (parent.length > 0) {
      const btn = makeBtn('download', 'Open Mirror', handleButtonClick);
      parent[0].appendChild(btn);
      clearInterval(waitForLabel);
    } else if (attempt >= maxAttempts) {
      console.warn('Gofile script: Failed to find target element after maximum attempts.');
      clearInterval(waitForLabel);
    }

    if (attempt >= maxAttempts) clearInterval(waitForLabel);
  }, 500);
})();
