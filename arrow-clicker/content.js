document.addEventListener('keydown', e => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

  const domain = window.location.hostname.replace('www.', '');

  chrome.storage.sync.get('sites', data => {
    const sites = data.sites || {};
    const siteSetting = sites[domain];
    if (!siteSetting) return;

    let selector = null;
    if (e.key === 'ArrowLeft') selector = siteSetting.left;
    if (e.key === 'ArrowRight') selector = siteSetting.right;

    if (selector) {
      const el = document.querySelector(selector);
      if (el) {
        // Trigger MouseEvent to ensure internal JS handles it
        const evt = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        el.dispatchEvent(evt);

        console.log(`Arrow Clicker: Clicked ${e.key} on selector "${selector}"`);
      } else {
        console.warn(`Arrow Clicker: Element not found for selector "${selector}"`);
      }
    }
  });
});
