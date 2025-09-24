(function () {
  'use strict';

  let isLoading = false;

  chrome.storage.local.get(['settings'], result => {
    if (!result.settings) return;

    let settings;
    try {
      settings = JSON.parse(result.settings);
    } catch (e) {
      console.error('Invalid JSON format in settings');
      return;
    }

    const currentDomain = window.location.hostname;
    const siteConfig = settings.find(cfg => currentDomain.includes(cfg.domain));

    if (!siteConfig) return;

    console.log('Extension active for domain:', siteConfig.domain);

    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const triggerPoint = document.documentElement.scrollHeight - window.innerHeight / 2;

      if (scrollPosition >= triggerPoint && !isLoading) {
        isLoading = true;

        let button = document.querySelector(siteConfig.querySelector);
        console.log('Button found:', button);

        if (button) {
          button.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            })
          );
        }

        setTimeout(() => {
          isLoading = false;
        }, siteConfig.delay || 500);
      }
    });
  });
})();
