/* =========================================================
   BOOT SCREEN FADE
========================================================= */
setTimeout(() => {
  const boot = document.getElementById("boot-screen");
  if (!boot) return;
  boot.style.opacity = "0";
  setTimeout(() => boot.remove(), 600);
}, 1400);


/* =========================================================
   GLOBAL SOUND STATE
========================================================= */
let soundOn = false;

const bgm = document.getElementById("bgm");
const sfx = document.getElementById("sfx-player");
const soundBtn = document.getElementById("sound-toggle");

const ledBlue = document.querySelector(".led-blue");
const ledGreen = document.querySelector(".led-green");
const ledRed = document.querySelector(".led-red");


/* =========================================================
   SOUND TOGGLE BUTTON
========================================================= */
soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;

  soundBtn.textContent = soundOn ? "SOUND: ON" : "SOUND: OFF";
  ledBlue.classList.toggle("active", soundOn);
  ledGreen.classList.toggle("active", soundOn);
  ledRed.classList.toggle("active", !soundOn);

  if (soundOn) {
    bgm.volume = 0.3;
    bgm.currentTime = 0;
    bgm.play().catch(() => {});
  } else {
    bgm.pause();
  }
});


/* =========================================================
   SHARED SFX PLAYER
========================================================= */
function playSFX(file) {
  if (!soundOn) return;
  sfx.src = file;
  sfx.currentTime = 0;
  sfx.play().catch(() => {});
}

document.querySelectorAll(".sfx-btn").forEach((btn) => {
  btn.addEventListener("click", () => playSFX(btn.dataset.sound));
});

/* DOWNLOAD BUTTON SOUND */
document.querySelectorAll(".primary-download").forEach((btn) => {
  btn.addEventListener("click", () => playSFX("Game_Menu.wav"));
});


/* =========================================================
   CRT PARALLAX (desktop only)
========================================================= */
const crt = document.getElementById("crt");
const desktopPointer = window.matchMedia("(pointer: fine)").matches;

if (desktopPointer) {
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 5;
    const y = (e.clientY / window.innerHeight - 0.5) * -5;
    
    crt.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  });
}


/* =========================================================
   CRT SWEEP LINE
========================================================= */
setInterval(() => {
  const sweep = document.querySelector(".crt-sweep");
  if (!sweep) return;

  sweep.classList.remove("run");
  void sweep.offsetWidth;
  sweep.classList.add("run");
}, 2800);


/* =========================================================
   PANEL SCROLL REVEAL
========================================================= */
const panels = document.querySelectorAll(".panel");

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);

panels.forEach((panel) => revealObserver.observe(panel));
