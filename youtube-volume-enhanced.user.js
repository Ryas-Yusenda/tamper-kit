// ==UserScript==
// @name         Youtube Volume Enhanced
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      1.5.0
// @description  Control YouTube volume up to 300% with keyboard shortcuts. Use Shift + ArrowUp to increase (+10%), Use Shift + ArrowDown to decrease (−10%).
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
  const MAX_GAIN = 3; // maximum = 300%

  // Initialize the audio pipeline (video -> gainNode -> speakers)
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

  // Adjust volume by changing the gain value
  function adjustVolume(change) {
    initAudio();
    if (!gainNode) return;

    // clamp gain value between 0 and MAX_GAIN
    currentGain = Math.min(Math.max(currentGain + change, 0), MAX_GAIN);
    gainNode.gain.value = currentGain;

    // show overlay on screen
    showVolumeOverlay(Math.round(currentGain * 100));
  }

  // Display a volume overlay at the center of the video
  function showVolumeOverlay(percent) {
    if (!video) return;

    let overlay = document.getElementById('yt-volume-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'yt-volume-overlay';
      overlay.style.position = 'fixed';
      overlay.style.fontSize = '32px';
      overlay.style.padding = '12px 24px';
      overlay.style.borderRadius = '12px';
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'none';
      overlay.style.fontWeight = 'bold';
      document.body.appendChild(overlay);
    }

    // choose background color based on volume level
    if (percent <= 100) {
      overlay.style.background = 'rgba(0, 128, 0, 0.8)'; // green
    } else if (percent <= 200) {
      overlay.style.background = 'rgba(255, 165, 0, 0.8)'; // yellow/orange
    } else {
      overlay.style.background = 'rgba(255, 0, 0, 0.8)'; // red
    }

    overlay.style.color = 'white';

    // calculate center position of the video
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

  // Keyboard controls: Shift + ArrowUp / ArrowDown
  window.addEventListener(
    'keydown',
    function (e) {
      if (e.shiftKey && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (e.key === 'ArrowUp') adjustVolume(0.1);
        if (e.key === 'ArrowDown') adjustVolume(-0.1);
      }
    },
    true
  );
})();
