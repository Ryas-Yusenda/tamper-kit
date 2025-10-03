// ==UserScript==
// @name         Wallhaven Enhance
// @namespace    https://github.com/Ryas-Yusenda/tamper-kit
// @version      2.0.0
// @description  Wallhaven Enhancements: Download button on thumbnails, LightGallery integration, and more.
// @author       Ry-ys
// @match        *://*.wallhaven.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wallhaven.cc
// @grant        none
// @run-at       document-end
// @license      MIT
// @updateURL    https://github.com/Ryas-Yusenda/tamper-kit/raw/main/wallhaven-enhance.user.js
// @downloadURL  https://github.com/Ryas-Yusenda/tamper-kit/raw/main/wallhaven-enhance.user.js
// ==/UserScript==

(function () {
  'use strict';

  const injectCSS = url => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = url;
    document.head.appendChild(l);
  };

  const injectJS = url =>
    new Promise(r => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => r();
      document.head.appendChild(s);
    });

  const forceDownload = (url, fileName) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      const u = (window.URL || window.webkitURL).createObjectURL(this.response);
      const a = document.createElement('a');
      a.href = u;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    xhr.send();
  };

  async function loadLightGallery() {
    injectCSS('https://cdn.staticfile.org/lightgallery/1.6.12/css/lightgallery.min.css');
    await injectJS('https://cdn.staticfile.org/lightgallery/1.6.12/js/lightgallery-all.min.js');
    console.log('LightGallery loaded!');
  }

  class Pic {
    constructor(elem, ws) {
      this.elem = elem;
      this.ws = ws;
      const $p = $(elem);
      this.favs = parseInt($p.find('.wall-favs')[0].innerHTML);
      this.seen = $p.find('figure').hasClass('thumb-seen');
      this.id = $p.find('figure').data('wallpaper-id');
      this.isPNG = $p.find('span.png').length > 0;
      const f = this.id.substring(0, 2);
      this.picUrl = `https://w.wallhaven.cc/full/${f}/wallhaven-${this.id}.${this.isPNG ? 'png' : 'jpg'}`;
      this.name = `${this.id}.${this.isPNG ? 'png' : 'jpg'}`;
    }

    addDownload() {
      $(this.elem)
        .find('.thumb-info')
        .append(
          $('<a class="jsDownload" style="margin-left:10px;" href="#">' + '<i class="fa fa-fw fa-cloud-download"></i></a>').on('click', e => {
            e.preventDefault();
            this.download();
          })
        );
      this.addView();
    }

    addView() {
      const hrefView = `https://wallhaven.cc/w/${this.id}`;
      $(this.elem)
        .find('.thumb-info')
        .append(
          $(`<a class="btn-view" style="margin-left:10px" target="_blank" href="${hrefView}">
              <i class="fa fa-fw fa-eye"></i>
            </a>`).on('click', e => {
            e.stopPropagation();
            window.open(hrefView, '_blank');
          })
        );
    }

    download() {
      forceDownload(this.picUrl, this.name);
    }

    initGallery() {
      const $p = $(this.elem).find('figure');
      $p.data('data-src', this.picUrl).data('data-sub-html-url', 'https://wallhaven.cc/w/' + this.id);
      $p.click(this.showGallery);
    }

    showGallery() {
      return false;
    }
  }

  class WallhavenScript {
    constructor() {
      this.download = this.gallery = this.maxView = true;
      this.isLogined = $('#userpanel > a > span.username').length > 0;
      this.pics = [];
    }

    workList() {
      this.workListMain();
      new MutationObserver(this.workListMain.bind(this)).observe(document.body, { childList: true, subtree: true });
    }

    workListMain() {
      const pics = this.getPics();
      const newPics = this.filterNewPics(pics);
      for (const p of newPics) {
        if (this.download) p.addDownload();
        if (this.gallery) p.initGallery();
      }
      this.pics = pics;
    }

    workSingle() {
      if (this.maxView) {
        $('#header, #searchbar').hide('fast');
        $('#showcase-sidebar').animate({ top: 0 }, 'fast');
        $('#main').animate({ borderTopWidth: 0 }, 'fast');
        $('#wallpaper').animate({ maxWidth: '99%', maxHight: '99%' }, 'fast');
      }
    }

    getPics() {
      return $('.thumb-listing-page li')
        .toArray()
        .map(e => new Pic(e, this));
    }

    filterNewPics(pics) {
      const old = this.pics.map(p => p.elem);
      return pics.filter(p => old.indexOf(p.elem) < 0);
    }

    run() {
      if (location.pathname.indexOf('/w/') === 0) return this.workSingle();
      this.pics = [];
      return this.workList();
    }
  }

  new WallhavenScript().run();

  const loadScript = () =>
      new Promise(r => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js';
        document.head.appendChild(s);
        s.onload = () => r();
      }),
    loadStylesheet = () =>
      new Promise(r => {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css';
        document.head.appendChild(l);
        l.onload = () => r();
      }),
    loadFancybox = async () => {
      await loadScript();
      await loadStylesheet();
    };

  const callFancyBox = () => {
    loadFancybox().then(() => {
      for (const el of document.querySelectorAll('.thumbs-container ul li')) {
        const preview = el.querySelector('.preview');
        const ext = el.querySelector('.thumb-info span.png') ? 'png' : 'jpg';
        if (preview.getAttribute('data-href')) continue;
        const id = /wallhaven\.cc\/w\/(\w{6})/.exec(preview.href)[1];
        const path = id.substring(0, 2);
        preview.setAttribute('data-href', preview.href);
        preview.setAttribute('data-fancybox', 'gallery');
        preview.href = `https://w.wallhaven.cc/full/${path}/wallhaven-${id}.${ext}`;
      }
      $('body').on('click', '[data-fancybox-download]', e => {
        const url = $(e.target).parent()[0].href;
        const name = url.substr(url.lastIndexOf('/') + 1);
        forceDownload(url, name.replace('wallhaven-', ''));
        e.preventDefault();
      });
      $("[data-fancybox='gallery']").fancybox({
        buttons: ['zoom', 'share', 'slideShow', 'fullScreen', 'download', 'thumbs', 'close'],
        thumbs: { autoStart: true }
      });
    });
  };

  callFancyBox();
  new MutationObserver(m => {
    if (m[0].addedNodes.length && m[0].addedNodes[0].className === 'thumb-listing-page') callFancyBox();
  }).observe(document.querySelector('.thumbs-container'), { childList: true, characterDataOldValue: true });

  loadLightGallery();
})();
