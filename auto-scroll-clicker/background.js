// Listen when tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkDomain(tabId, tab.url);
  }
});

// Also when user switches tab
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url) {
      checkDomain(tab.id, tab.url);
    }
  });
});

function checkDomain(tabId, url) {
  chrome.storage.local.get(['settings'], result => {
    if (!result.settings) {
      setBadge(tabId, false);
      return;
    }

    let settings;
    try {
      settings = JSON.parse(result.settings);
    } catch {
      setBadge(tabId, false);
      return;
    }

    const hostname = new URL(url).hostname;
    const matched = settings.find(cfg => hostname.includes(cfg.domain));

    setBadge(tabId, !!matched);
  });
}

function setBadge(tabId, isMatch) {
  if (isMatch) {
    chrome.action.setBadgeText({ text: '1', tabId: tabId });
    chrome.action.setBadgeTextColor({ color: 'white', tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: 'green', tabId: tabId });
  } else {
    chrome.action.setBadgeText({ text: '0', tabId: tabId });
    chrome.action.setBadgeTextColor({ color: 'white', tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: 'red', tabId: tabId });
  }
}

// Open options page when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
