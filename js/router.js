// pages
const homeSection = document.getElementById("home");
const gameSection = document.getElementById("game");
// buttons
const cpuBtn = document.querySelector(".cpu");
const playerBtn = document.querySelector(".player");

let currentSection = "home";

function showSection(section) {
  homeSection.style.display = section === "home" ? "grid" : "none";
  gameSection.style.display =
    section === "cpu" || section === "player" ? "grid" : "none";

  currentSection = section;
}

function playVsPlayer() {
  window.location.hash = "#player";

  document.querySelector(".p-2Name").textContent = "PLAYER 2";
  isAI = false;
  restart();

  showSection("player");
}

function playVsAI() {
  window.location.hash = "#cpu";

  document.querySelector(".p-2Name").textContent = "CPU";
  isAI = true;
  restart();

  showSection("cpu");
}

cpuBtn.addEventListener("click", playVsAI);
playerBtn.addEventListener("click", playVsPlayer);

addEventListener("popstate", () => {
  const newHash = location.hash.slice(1);

  showSection(newHash || "home");

  if (["cpu", "player"].includes(newHash)) clearInterval(intervalId);
});

switch (location.hash.slice(1)) {
  case "player":
    playVsPlayer();
    break;
  case "cpu":
    playVsAI();
    break;
  default:
    showSection("home");
}
