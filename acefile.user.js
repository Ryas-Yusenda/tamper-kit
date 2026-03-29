// ==UserScript==
// @name         Acefile Bypass (Educational)
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      2.1.1
// @description  Bypass Pixeldrain Download Limit (with zip file content support).
// @author       Ry-ys
// @match        *://*.acefile.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acefile.co
// @grant        none
// @run-at       document-idle
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/acefile.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/acefile.user.js
// @require      https://gist.githubusercontent.com/X-Gorn/e881afb007713a78c2fe429b08b6d7ce/raw/unPacker.js
// ==/UserScript==

// ==UserScript==
// @name         Acefile Educational Redirect
// @namespace    https://example.com/
// @version      1.0
// @description  Educational demonstration only. Do not use to violate site terms.
// @match        *://*.acefile.co/*
// @match        *://*.acefile.com/*
// @grant        none
// ==/UserScript==

/*
  DISCLAIMER:
  This script is provided strictly for EDUCATIONAL PURPOSES ONLY.
  It is intended to demonstrate JavaScript analysis, DOM inspection,
  and request handling techniques.

  The author does NOT encourage:
  - Bypassing paywalls
  - Violating terms of service
  - Unauthorized access to content

  Use responsibly.
*/

(function () {
  'use strict';

  const match = document.body.innerHTML.match(/eval.*/);
  if (!match) return;

  const evaljs = match[0];
  const unpacked = unPack(evaljs);
  let id, link;

  if (!unpacked.match(/"code":"(\w+)"/)) {
    const aceIdMatch = location.href.match(/^https?:\/\/acefile\.(?:co|com)\/(?:f|player)\/(\d+)/);
    if (!aceIdMatch) return;

    const aceId = aceIdMatch[1];

    $.ajax({
      url: `https://acefile.co/service/resource_check/${aceId}/`,
      cache: false,
      dataType: 'json',
      success: res => {
        id = res.data;
        link = `https://drive.google.com/file/d/${id}/view`;
        location.href = link;
      }
    });
  } else {
    id = atob(unpacked.match(/"code":"(\w+)"/)[1]);
    link = `https://drive.google.com/file/d/${id}/view`;
    location.href = link;
  }
})();
