let button = document.getElementById("openSettings");

function openSettings() {
  chrome.runtime.openOptionsPage();
}

button.addEventListener("click", openSettings);
