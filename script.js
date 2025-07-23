let count = parseInt(localStorage.getItem("clickCount")) || 0;

function updateDisplay() {
  document.getElementById("counter").textContent = count;
}

function increment() {
  count++;
  localStorage.setItem("clickCount", count);
  updateDisplay();
}

document.getElementById("clickButton").addEventListener("click", increment);

updateDisplay();

// Telegram WebApp SDK init
const tg = window.Telegram.WebApp;
tg.expand();
