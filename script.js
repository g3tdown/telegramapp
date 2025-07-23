let count = parseInt(localStorage.getItem("clickCount")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let lastChestOpen = localStorage.getItem("lastChestOpen") || null;

function updateDisplay() {
  document.getElementById("counter").textContent = count;
  document.getElementById("clickPowerLabel").textContent = `+${clickPower}`;
  updateChestStatus();
}

function increment() {
  count += clickPower;
  localStorage.setItem("clickCount", count);
  updateDisplay();
}

function buyUpgrade(type) {
  if (type === "add1" && count >= 10) {
    count -= 10;
    clickPower += 1;
    notify("Сила клика увеличена на +1!");
  } else if (type === "add5" && count >= 40) {
    count -= 40;
    clickPower += 5;
    notify("Сила клика увеличена на +5!");
  } else if (type === "x2" && count >= 100) {
    count -= 100;
    clickPower *= 2;
    notify("Сила клика УДВОЕНА! 🚀");
  } else {
    notify("Недостаточно кликов для покупки.");
    return;
  }

  localStorage.setItem("clickCount", count);
  localStorage.setItem("clickPower", clickPower);
  updateDisplay();
}

function openChest() {
  const now = new Date();
  if (!lastChestOpen || (now - new Date(lastChestOpen)) >= 86400000) {
    const bonus = Math.floor(Math.random() * 20) + 10; // 10–30
    count += bonus;
    lastChestOpen = now.toISOString();
    localStorage.setItem("clickCount", count);
    localStorage.setItem("lastChestOpen", lastChestOpen);
    notify(`Вы получили ${bonus} кликов из сундука! 🎁`);
    updateDisplay();
  } else {
    const hoursLeft = Math.ceil((86400000 - (now - new Date(lastChestOpen))) / 3600000);
    notify(`Сундук будет доступен через ~${hoursLeft} ч.`);
  }
}

function updateChestStatus() {
  if (!lastChestOpen) {
    document.getElementById("chestStatus").textContent = "Сундук доступен!";
    return;
  }

  const now = new Date();
  const diff = now - new Date(lastChestOpen);

  if (diff >= 86400000) {
    document.getElementById("chestStatus").textContent = "Сундук доступен!";
  } else {
    const hoursLeft = Math.ceil((86400000 - diff) / 3600000);
    document.getElementById("chestStatus").textContent = `Осталось: ~${hoursLeft} ч.`;
  }
}

function notify(message) {
  const note = document.getElementById("notification");
  note.textContent = message;
  note.classList.add("show");
  setTimeout(() => note.classList.remove("show"), 3000);
}

// Инициализация событий
document.getElementById("clickButton").addEventListener("click", increment);
document.querySelectorAll("#upgrades button").forEach(btn => {
  btn.addEventListener("click", () => buyUpgrade(btn.dataset.upgrade));
});
document.getElementById("chestButton").addEventListener("click", openChest);

// Telegram SDK
const tg = window.Telegram.WebApp;
tg.expand();

updateDisplay();
