// ==UserScript==
// @name         Youtube Volume Enhanced
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      2.0.0
// @description  Control YouTube volume up to 300% with keyboard shortcuts. Use Shift + ArrowUp to increase (+10%), Use Shift + ArrowDown to decrease (−10%).
// @author       Ry-ys
// @match        *://*.youtube.com/*
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
  let currentGain = 1;
  const MAX_GAIN = 3;

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
      Object.assign(overlay.style, {
        position: 'fixed',
        fontSize: '32px',
        padding: '12px 24px',
        borderRadius: '12px',
        zIndex: 9999,
        pointerEvents: 'none',
        fontWeight: 'bold',
        color: 'white'
      });
      document.body.appendChild(overlay);
    }
    overlay.style.background = percent <= 100 ? 'rgba(0,128,0,0.8)' : percent <= 200 ? 'rgba(255,165,0,0.8)' : 'rgba(255,0,0,0.8)';
    const rect = video.getBoundingClientRect();
    overlay.style.left = rect.left + rect.width / 2 + 'px';
    overlay.style.top = rect.top + rect.height / 2 + 'px';
    overlay.style.transform = 'translate(-50%,-50%)';
    overlay.textContent = `🔊 ${percent}%`;
    overlay.style.display = 'block';
    clearTimeout(overlay._timeout);
    overlay._timeout = setTimeout(() => (overlay.style.display = 'none'), 1000);
  }

  addEventListener(
    'keydown',
    e => {
      if (e.shiftKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        adjustVolume(e.key === 'ArrowUp' ? 0.1 : -0.1);
      }
    },
    true
  );
})();
