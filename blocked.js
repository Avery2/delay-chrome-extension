// chrome.declarativeNetRequest
let button = document.getElementById("disableBlockButton");
let redirectMessage = document.getElementById("redirectMessage");
let disableInput = document.getElementById("disableInput");


let delayValue = 15;
chrome.storage.sync.get("defaultUnblockDuration", (data) => {
  console.log({ "set delayvalue": data.defaultUnblockDuration });
  delayValue = data.defaultUnblockDuration;
  disableInput.value = delayValue;
});

let url = null;

chrome.storage.local.get("lastRedirectUrl", (data) => {
  redirectMessage.innerText = `Redirected from ${data.lastRedirectUrl}`;
  url = data.lastRedirectUrl;
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

function handleButtonClick(event) {
  console.log("handleButtonClick");
  // disable all blocks
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map((rule) => rule?.id),
    });
  });

  chrome.alarms.clearAll();
  let delay = parseFloat(disableInput.value);
  console.log(`set alarm for delay=${delay}`);
  chrome.alarms.create("myAlarm", {
    delayInMinutes: delay,
  });

  // hack: delay because otherwise the window is funky
  setTimeout(() => {
    if (!url) {
      window.close();
    }
    console.log(`redirect to ${url}`);
    window.location.href = url;
  }, 100);
}

button.addEventListener("click", handleButtonClick);
