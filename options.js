let clickFeedback = document.getElementById("clickFeedback");
let saveButton = document.getElementById("saveButton");

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
  const feedback = document.createElement("p");
  feedback.innerText = "Saved Changes.";
  clickFeedback.replaceChildren(feedback);
  fade(feedback);
  setTimeout(() => {
    feedback.remove();
  }, 5000);
}

saveButton.addEventListener("click", showSaved);
