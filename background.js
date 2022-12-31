DEFAULT_BLOCK_URLS = ["microsoft.com", "averychan.site"];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ defaultUnblockDuration: 10 });
  chrome.storage.sync.set({ blockUrls: DEFAULT_BLOCK_URLS });
});


blockUrls = [];
chrome.storage.sync.get("blockUrls", (data) => {
  blockUrls = data.blockUrls;
  doBlockUrls(blockUrls);
});

chrome.alarms.onAlarm.addListener(() => {
  doBlockUrls(blockUrls);
});

// this will only run if this extension is run from source as unpacked
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  const { request, rule } = info;
  const { url } = request;
  chrome.storage.local.set({ lastRedirectUrl: url });
});
