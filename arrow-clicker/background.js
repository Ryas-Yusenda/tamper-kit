function updateBadge(tabId, url) {
  if (!url) return;

  const domain = new URL(url).hostname;

  chrome.storage.sync.get('sites', data => {
    const sites = data.sites || {};
    if (sites[domain]) {
      chrome.action.setBadgeText({ tabId, text: '1' });
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#10B981' }); // green
    } else {
      chrome.action.setBadgeText({ tabId, text: '0' });
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#EF4444' }); // red
    }
  });
}

// When tab is updated (page load/refresh)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateBadge(tabId, tab.url);
  }
});

// When tab is activated (user switches tab)
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url) {
      updateBadge(activeInfo.tabId, tab.url);
    }
  });
});

// Click badge = open options
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
