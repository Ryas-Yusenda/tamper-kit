// ==UserScript==
// @name         Youtube Volume Enhanced
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.2.0
// @description  Control YouTube volume up to 600% with keyboard shortcuts.
// @author       Ry-ys
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/youtube-volume-enhanced.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/youtube-volume-enhanced.user.js
// ==/UserScript==

(function () {
  'use strict';

  let video, audioCtx, source, gainNode;
  let currentGain = 1; // default = 100%
  const MAX_GAIN = 6; // 600%

  function initAudio() {
    video = document.querySelector('video');
    if (!video) return;

    if (!audioCtx) {
      audioCtx = new AudioContext();
      source = audioCtx.createMediaElementSource(video);
      gainNode = audioCtx.createGain();
      source.connect(gainNode).connect(audioCtx.destination);
    }
  }

  function adjustVolume(change) {
    initAudio();
    if (!gainNode) return;

    currentGain = Math.min(Math.max(currentGain + change, 0), MAX_GAIN);
    gainNode.gain.value = currentGain;
    showVolumeOverlay(Math.round(currentGain * 100));
  }

  function showVolumeOverlay(percent) {
    if (!video) return;

    let overlay = document.getElementById('yt-volume-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'yt-volume-overlay';
      overlay.style.position = 'fixed';
      overlay.style.fontSize = '32px';
      overlay.style.padding = '12px 24px';
      overlay.style.background = 'rgba(0,0,0,0.7)';
      overlay.style.color = 'white';
      overlay.style.borderRadius = '12px';
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'none';
      document.body.appendChild(overlay);
    }

    // Calculate the middle position of the video
    const rect = video.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    overlay.style.left = `${centerX}px`;
    overlay.style.top = `${centerY}px`;
    overlay.style.transform = 'translate(-50%, -50%)';

    overlay.textContent = `🔊 ${percent}%`;
    overlay.style.display = 'block';

    clearTimeout(overlay._timeout);
    overlay._timeout = setTimeout(() => {
      overlay.style.display = 'none';
    }, 1000);
  }

  // Control with the keyboardrd
  window.addEventListener('keydown', function (e) {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      if (e.key === 'ArrowUp') adjustVolume(0.1); // +10%
      if (e.key === 'ArrowDown') adjustVolume(-0.1); // -10%
    }
  });
})();
