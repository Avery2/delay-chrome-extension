let defaultDelayButton = document.getElementById("defaultDelay");
let clickFeedback = document.getElementById("clickFeedback");
let saveButton = document.getElementById("saveButton");

let delayValue = 15;
chrome.storage.sync.get("defaultUnblockDuration", (data) => {
  console.log({ "set delayvalue": data.defaultUnblockDuration });
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

function showSaved(event) {
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
