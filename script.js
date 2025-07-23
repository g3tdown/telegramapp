let count = parseInt(localStorage.getItem("clickCount")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;
let lastChestOpen = localStorage.getItem("lastChestOpen") || null;

function updateDisplay() {
  document.getElementById("counter").textContent = count;
  document.getElementById("clickPower").textContent = clickPower;
  updateChestStatus();
}

function increment() {
  count += clickPower;
  localStorage.setItem("clickCount", count);
  updateDisplay();
}

function buyUpgrade() {
  if (count >= 10) {
    count -= 10;
    clickPower++;
    localStorage.setItem("clickCount", count);
    localStorage.setItem("clickPower", clickPower);
    updateDisplay();
  } else {
    alert("Недостаточно кликов!");
  }
}

function openChest() {
  const now = new Date();
  if (!lastChestOpen || (now - new Date(lastChestOpen)) >= 86400000) {
    const bonus = Math.floor(Math.random() * 20) + 10; // 10–30
    count += bonus;
    lastChestOpen = now.toISOString();
    localStorage.setItem("clickCount", count);
    localStorage.setItem("lastChestOpen", lastChestOpen);
    alert(`Вы получили ${bonus} кликов из сундука!`);
    updateDisplay();
  } else {
    const hoursLeft = Math.ceil((86400000 - (now - new Date(lastChestOpen))) / 3600000);
    alert(`Сундук будет доступен через ~${hoursLeft} ч.`);
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

document.getElementById("clickButton").addEventListener("click", increment);
document.getElementById("upgradeButton").addEventListener("click", buyUpgrade);
document.getElementById("chestButton").addEventListener("click", openChest);

updateDisplay();

// Telegram WebApp SDK
const tg = window.Telegram.WebApp;
tg.expand();
