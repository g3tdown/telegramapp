let count = parseInt(localStorage.getItem("clickCount")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let lastChestOpen = localStorage.getItem("lastChestOpen") || null;

// Начальные цены и загрузка из localStorage
let upgradePrices = JSON.parse(localStorage.getItem("upgradePrices")) || {
  add1: 10,
  add5: 40,
  x2: 100
};

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

    // Сохраняем
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

// События
document.getElementById("clickButton").addEventListener("click", increment);
document.querySelectorAll("#upgrades button").forEach(btn => {
  btn.addEventListener("click", () => buyUpgrade(btn.dataset.upgrade));
});
document.getElementById("chestButton").addEventListener("click", openChest);

// Telegram SDK
const tg = window.Telegram.WebApp;
tg.expand();

updateDisplay();
