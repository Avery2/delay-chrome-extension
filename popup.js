let button = document.getElementById("openSettings");

function openSettings() {
  chrome.runtime.openOptionsPage();
}

let timer;
let unblockedTimeLeft = 0;
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
showTimeLeft();


button.addEventListener("click", openSettings);
