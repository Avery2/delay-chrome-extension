chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ defaultUnblockDuration: 10 });
});

chrome.alarms.onAlarm.addListener(() => {
  doBlockUrls(blockUrls);
});

blockUrls = ["microsoft.com", "averychan.site"];

function doBlockUrls(blockUrls) {
  blockUrls.forEach((domain, index) => {
    let id = index + 1;

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: id,
          priority: 1,
          action: {
            type: "redirect",
            redirect: { extensionPath: "/blocked.html" },
          },
          condition: { regexFilter: domain, resourceTypes: ["main_frame"] },
        },
      ],
      removeRuleIds: [id],
    });
  });
}

// this will only run if this extension is run from source as unpacked
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(
  (info) => {
    const { request, rule } = info;
    const { url } = request;
    chrome.storage.local.set({lastRedirectUrl: url})
  }
)

doBlockUrls(blockUrls);
