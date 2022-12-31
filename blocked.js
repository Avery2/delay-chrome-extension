// chrome.declarativeNetRequest
let button = document.getElementById("disableBlockButton");
let redirectMessage = document.getElementById("redirectMessage");
let disableInput = document.getElementById("disableInput");


let delayValue = 15;
chrome.storage.sync.get("defaultUnblockDuration", (data) => {
  delayValue = data.defaultUnblockDuration;
  disableInput.value = delayValue;
});

let url = null;

chrome.storage.local.get("lastRedirectUrl", (data) => {
  redirectMessage.innerText = `Redirected from ${data.lastRedirectUrl}`;
  url = data.lastRedirectUrl;
});

blockUrls = [];
chrome.storage.sync.get("blockUrls", (data) => {
  blockUrls = data.blockUrls;
});

function handleButtonClick(event) {
  // disable all blocks
  doUnBlockUrls();

  chrome.alarms.clearAll();
  let delay = parseFloat(disableInput.value);
  chrome.alarms.create("myAlarm", {
    delayInMinutes: delay,
  });

  // hack: delay because otherwise the window is funky
  setTimeout(() => {
    if (!url) {
      window.close();
    }
    window.location.href = url;
  }, 100);
}

button.addEventListener("click", handleButtonClick);

function doUnBlockUrls() {
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map((rule) => rule?.id),
    });
  });
}
