let clicks = parseInt(localStorage.getItem("clicks") || "0");
let clickPower = parseInt(localStorage.getItem("clickPower") || "1");
let upgrades = JSON.parse(localStorage.getItem("upgrades") || "{}");
let lastChestOpen = localStorage.getItem("lastChestOpen");

const counter = document.getElementById("counter");
const powerLabel = document.getElementById("clickPowerLabel");
const clickButton = document.getElementById("clickButton");
const chestDiv = document.getElementById("chest");
const chestStatus = document.getElementById("chestStatus");

const upgradeSettings = {
  add1: { baseCost: 10, effect: 1 },
  add5: { baseCost: 40, effect: 5 },
  add10: { baseCost: 200, effect: 10 },
  x2: { baseCost: 5000, effect: "x2" },
  x3: { baseCost: 15000, effect: "x3" }
};

function getUpgradeCost(type) {
  const level = upgrades[type] || 0;
  return upgradeSettings[type].baseCost * Math.pow(5, level);
}

function updateDisplay() {
  counter.textContent = clicks;
  powerLabel.textContent = `+${clickPower}`;
  document.querySelectorAll("#upgrades button").forEach(btn => {
    const type = btn.dataset.upgrade;
    const cost = getUpgradeCost(type);
    const label = upgradeSettings[type].effect.toString().includes("x")
      ? `${upgradeSettings[type].effect} сила`
      : `+${upgradeSettings[type].effect} клик(ов)`;
    btn.textContent = `${label} (${cost})`;
  });
}

function saveState() {
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("clickPower", clickPower);
  localStorage.setItem("upgrades", JSON.stringify(upgrades));
  localStorage.setItem("lastChestOpen", lastChestOpen || "");
}

clickButton.addEventListener("click", () => {
  clicks += clickPower;
  updateDisplay();
  saveState();
});

document.querySelectorAll("#upgrades button").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.upgrade;
    const cost = getUpgradeCost(type);
    if (clicks >= cost) {
      clicks -= cost;
      const effect = upgradeSettings[type].effect;
      if (effect === "x2") clickPower *= 2;
      else if (effect === "x3") clickPower *= 3;
      else clickPower += effect;
      upgrades[type] = (upgrades[type] || 0) + 1;
      updateDisplay();
      saveState();
    }
  });
});

function formatTimeLeft(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

function updateChestStatus() {
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

chestDiv.addEventListener("click", () => {
  const now = new Date();
  const last = lastChestOpen ? new Date(lastChestOpen) : null;
  if (!last || now - last >= 86400000) {
    clicks += 100;
    lastChestOpen = now.toISOString();
    updateDisplay();
    saveState();
  }
});

setInterval(updateChestStatus, 1000);

updateDisplay();
updateChestStatus();
