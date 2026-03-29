// ==UserScript==
// @name         Medium Article Redirection (Educational)
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      3.5.1
// @description  Educational demonstration of client-side redirection and content mirroring.
// @author       Ry-ys
// @match        *://medium.com/*
// @match        *://*.medium.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/medium.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/medium.user.js
// ==/UserScript==

/*
  DISCLAIMER:
  This userscript is provided STRICTLY FOR EDUCATIONAL PURPOSES ONLY.

  It demonstrates:
  - DOM-based platform detection
  - Metadata inspection
  - Client-side URL redirection

  This script is NOT intended to:
  - Encourage bypassing paywalls
  - Circumvent subscription systems
  - Violate Medium's Terms of Service

  Use responsibly and at your own risk.
*/

(function () {
  'use strict';

  const mirrorUrl = 'https://freedium-mirror.cfd';

  const isMedium = !!document.querySelector('meta[content="com.medium.reader"]');
  const isArticle = document.querySelector('meta[property="og:type"]')?.content?.includes('article');
  const isAuthor = !!document.querySelector('meta[property="article:author"]');

  if (isMedium && isArticle && isAuthor) {
    window.location.href = `${mirrorUrl}/${encodeURIComponent(location.href)}`;
  }
})();
