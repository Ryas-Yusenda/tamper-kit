let enabled = false;

// Load saved state
chrome.storage.local.get('enabled', data => {
  enabled = data.enabled || false;
});

// Save state
function saveState() {
  chrome.storage.local.set({ enabled });
}

// Update badge
function updateBadge(tabId) {
  if (enabled) {
    chrome.action.setBadgeText({ text: '⬤', tabId });
    chrome.action.setBadgeTextColor({ color: 'green', tabId });
    chrome.action.setBadgeBackgroundColor({ color: 'transparent', tabId });
  } else {
    chrome.action.setBadgeText({ text: '⬤', tabId });
    chrome.action.setBadgeTextColor({ color: 'red', tabId });
    chrome.action.setBadgeBackgroundColor({ color: 'transparent', tabId });
  }
}

// Apply or remove CSS on one tab
async function applyBlur(tabId) {
  if (enabled) {
    try {
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['blur.css']
      });
    } catch (e) {
      console.warn('insertCSS failed', e);
    }
  } else {
    try {
      await chrome.scripting.removeCSS({
        target: { tabId },
        files: ['blur.css']
      });
    } catch (e) {
      console.warn('removeCSS failed', e);
    }
  }
  updateBadge(tabId);
}

// Apply or remove CSS on ALL tabs
function applyBlurAllTabs() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    for (const tab of tabs) {
      if (tab.id >= 0 && /^https?:/.test(tab.url)) {
        applyBlur(tab.id);
      }
    }
  });
}

// Toggle on click
chrome.action.onClicked.addListener(() => {
  enabled = !enabled;
  saveState();
  applyBlurAllTabs();
});

// Keep effect when switching or refreshing tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^https?:/.test(tab.url)) {
    applyBlur(tabId);
  }
});
chrome.tabs.onActivated.addListener(({ tabId }) => {
  applyBlur(tabId);
});
