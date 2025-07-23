let count = parseInt(localStorage.getItem("clickCount")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let lastChestOpen = localStorage.getItem("lastChestOpen") || null;

let upgradePrices = JSON.parse(localStorage.getItem("upgradePrices")) || {
  add1: 10,
  add5: 40,
  x2: 100
};

const chestDiv = document.getElementById("chest");

function formatTimeLeft(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function updateDisplay() {
  document.getElementById("counter").textContent = count;
  document.getElementById("clickPowerLabel").textContent = `+${clickPower}`;
  updateChestStatus();
  updateUpgradeButtons();
}

function increment() {
  count += clickPower;
  localStorage.setItem("clickCount", count);
  updateDisplay();
}

function buyUpgrade(type) {
  const price = upgradePrices[type];

  if (count >= price) {
    count -= price;

    if (type === "add1") {
      clickPower += 1;
      upgradePrices.add1 += 5;
      notify("Сила клика +1!");
    } else if (type === "add5") {
      clickPower += 5;
      upgradePrices.add5 += 20;
      notify("Сила клика +5!");
    } else if (type === "x2") {
      clickPower *= 2;
      upgradePrices.x2 *= 2;
      notify("Сила клика x2! 🚀");
    }

    localStorage.setItem("clickCount", count);
    localStorage.setItem("clickPower", clickPower);
    localStorage.setItem("upgradePrices", JSON.stringify(upgradePrices));
    updateDisplay();
  } else {
    notify(`Нужно ${price} кликов`);
  }
}

function updateUpgradeButtons() {
  document.querySelector('[data-upgrade="add1"]').textContent = `+1 клик (${upgradePrices.add1} кликов)`;
  document.querySelector('[data-upgrade="add5"]').textContent = `+5 кликов (${upgradePrices.add5} кликов)`;
  document.querySelector('[data-upgrade="x2"]').textContent = `x2 сила (${upgradePrices.x2} кликов)`;
}

function updateChestStatus() {
  const chestStatus = document.getElementById("chestStatus");
  const now = new Date();

  if (!lastChestOpen) {
    chestStatus.textContent = "Сундук доступен!";
    chestDiv.classList.remove("open");
    return;
  }

  const last = new Date(lastChestOpen);
  const diff = now - last;

  if (diff >= 86400000) {
    chestStatus.textContent = "Сундук доступен!";
    chestDiv.classList.remove("open");
  } else {
    const timeLeft = 86400000 - diff;
    chestStatus.textContent = `Доступно через ${formatTimeLeft(timeLeft)}`;
    chestDiv.classList.add("open");
  }
}

function openChest() {
  const now = new Date();

  if (!lastChestOpen || (now - new Date(lastChestOpen)) >= 86400000) {
    const bonus = Math.floor(Math.random() * 20) + 10;
    count += bonus;
    lastChestOpen = now.toISOString();
    localStorage.setItem("clickCount", count);
    localStorage.setItem("lastChestOpen", lastChestOpen);
    notify(`Вы получили ${bonus} кликов из сундука! 🎁`);
    updateDisplay();
    chestDiv.classList.add("open");
  } else {
    const last = new Date(lastChestOpen);
    const timeLeft = 86400000 - (now - last);
    notify(`Сундук будет доступен через ${formatTimeLeft(timeLeft)}`);
  }
}

function notify(message) {
  const note = document.getElementById("notification");
  note.textContent = message;
  note.classList.add("show");
  setTimeout(() => note.classList.remove("show"), 3000);
}

document.getElementById("clickButton").addEventListener("click", increment);
document.querySelectorAll("#upgrades button").forEach(btn => {
  btn.addEventListener("click", () => buyUpgrade(btn.dataset.upgrade));
});
chestDiv.addEventListener("click", openChest);

const tg = window.Telegram.WebApp;
if (tg) tg.expand();

updateDisplay();

// Обновляем статус сундука каждую секунду для таймера
setInterval(updateChestStatus, 1000);
