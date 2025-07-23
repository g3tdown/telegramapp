let clicks = parseInt(localStorage.getItem("clicks") || "0");
let clickPower = parseInt(localStorage.getItem("clickPower") || "1");
let upgrades = JSON.parse(localStorage.getItem("upgrades") || "{}");
let lastChestOpen = localStorage.getItem("lastChestOpen");

const counter = document.getElementById("counter");
const powerLabel = document.getElementById("clickPowerLabel");
const clickButton = document.getElementById("clickButton");
const chestDiv = document.getElementById("chest");
const chestStatus = document.getElementById("chestStatus");

function updateDisplay() {
  counter.textContent = clicks;
  powerLabel.textContent = `+${clickPower}`;
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
    let cost, effect;

    switch (type) {
      case "add1":
        cost = 10 * (upgrades.add1 || 1);
        effect = 1;
        if (clicks >= cost) {
          clicks -= cost;
          clickPower += effect;
          upgrades.add1 = (upgrades.add1 || 1) + 1;
        }
        break;
      case "add5":
        cost = 40 * (upgrades.add5 || 1);
        effect = 5;
        if (clicks >= cost) {
          clicks -= cost;
          clickPower += effect;
          upgrades.add5 = (upgrades.add5 || 1) + 1;
        }
        break;
      case "x2":
        cost = 100 * (upgrades.x2 || 1);
        if (clicks >= cost) {
          clicks -= cost;
          clickPower *= 2;
          upgrades.x2 = (upgrades.x2 || 1) + 1;
        }
        break;
    }

    updateDisplay();
    saveState();
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
