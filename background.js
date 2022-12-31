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

function doUnBlockUrls() {
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map((rule) => rule?.id),
    });
  });
}

//stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

DEFAULT_BLOCK_URLS = ["microsoft.com", "averychan.site"];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ defaultUnblockDuration: 10 });
  chrome.storage.sync.set({ blockUrls: DEFAULT_BLOCK_URLS });
});

let blockUrls = [];
chrome.storage.sync.get("blockUrls", (data) => {
  blockUrls = data.blockUrls;
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.alarms.clearAll();
  doBlockUrls(blockUrls);
});

// this will only run if this extension is run from source as unpacked
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  const { request, rule } = info;
  const { url } = request;
  chrome.storage.local.set({ lastRedirectUrl: url });
});
