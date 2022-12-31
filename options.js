let defaultDelayButton = document.getElementById("defaultDelay");
let clickFeedback = document.getElementById("clickFeedback");
let saveButton = document.getElementById("saveButton");
let blocklistArea = document.getElementById("blocklist");
let timeLeft = document.getElementById("timeLeft");

let delayValue = 15;
chrome.storage.sync.get("defaultUnblockDuration", (data) => {
  delayValue = data.defaultUnblockDuration;
  defaultDelayButton.value = delayValue;
});

// https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
function fade(element) {
  var op = 1; // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op -= op * 0.05;
  }, 50);
}

let timer;
clearTimeout(timer);
function showTimeLeft() {
  chrome.alarms.getAll((alarms) => {
    const alarm = alarms?.[0];
    if (alarm) {
      const { scheduledTime } = alarm;
      unblockedTimeLeft = scheduledTime - Date.now();
    }
    timeLeft.innerHTML = `You have <b>${msToTime(
      unblockedTimeLeft
    )}</b> of unblocked time left.`;
  });
  timer = setTimeout(showTimeLeft, 100);
}

let blockUrls = [];
let unblockedTimeLeft = 0;
chrome.storage.sync.get("blockUrls", (data) => {
  blockUrls = data.blockUrls;
  blocklistArea.value = blockUrls.join("\n");
  showTimeLeft();
});

function showSaved(event) {
  // save block list
  blockUrls = blocklistArea.value.split("\n");
  chrome.storage.sync.set({ blockUrls: blockUrls }, () => {
    blocklistArea.value = blockUrls.join("\n");
    doBlockUrls(blockUrls);
  });
  // save duration
  chrome.storage.sync.set({ defaultUnblockDuration: defaultDelayButton.value });
  // show feedback save happened
  const feedback = document.createElement("p");
  feedback.innerText = "Saved Changes.";
  clickFeedback.replaceChildren(feedback);
  fade(feedback);
  setTimeout(() => {
    feedback.remove();
  }, 5000);
}

saveButton.addEventListener("click", showSaved);
