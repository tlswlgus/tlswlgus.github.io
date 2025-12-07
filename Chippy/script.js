/* =========================================================
   BOOT SCREEN FADE
========================================================= */
window.addEventListener("load", () => {
  const boot = document.getElementById("boot-screen");
  if (!boot) return;

  setTimeout(() => {
    boot.style.opacity = "0";
    setTimeout(() => boot.remove(), 600);
  }, 1000);
});


/* =========================================================
   GLOBAL SOUND STATE
========================================================= */
let soundOn = true; // DEFAULT: SOUND ENABLED

const bgm = document.getElementById("bgm");
const sfx = document.getElementById("sfx-player");
const soundBtn = document.getElementById("sound-toggle");

const ledBlue = document.querySelector(".led-blue");
const ledGreen = document.querySelector(".led-green");
const ledRed = document.querySelector(".led-red");

// Initialize display state
soundBtn.textContent = "SOUND: ON";
ledBlue.classList.add("active");
ledGreen.classList.add("active");
ledRed.classList.remove("active");

// BGM should NOT play automatically
bgm.pause();


/* =========================================================
   SOUND TOGGLE BUTTON
========================================================= */
soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;

  soundBtn.textContent = soundOn ? "SOUND: ON" : "SOUND: OFF";

  ledBlue.classList.toggle("active", soundOn);
  ledGreen.classList.toggle("active", soundOn);
  ledRed.classList.toggle("active", !soundOn);

  // No automatic BGM — SFX only unless you manually start bgm.play()
  if (!soundOn) bgm.pause();
});


/* =========================================================
   SHARED SFX PLAYER (prevents stacking)
========================================================= */
function playSFX(file) {
  if (!soundOn) return;

  sfx.pause();
  sfx.src = file;
  sfx.currentTime = 0;

  sfx.play().catch(() => {});
}

document.querySelectorAll(".sfx-btn").forEach((btn) => {
  btn.addEventListener("click", () => playSFX(btn.dataset.sound));
});

// DOWNLOAD BUTTON SOUND
document.querySelectorAll(".primary-download").forEach((btn) => {
  btn.addEventListener("click", () => playSFX("Game_Menu.wav"));
});


/* =========================================================
   CRT PARALLAX (DESKTOP ONLY)
========================================================= */
const crt = document.getElementById("crt");
const isDesktop = window.matchMedia("(pointer: fine)").matches;

if (crt && isDesktop) {
  let lastX = 0, lastY = 0;

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4.5;
    const y = (e.clientY / window.innerHeight - 0.5) * -4.5;

    // Smooth movement
    lastX += (x - lastX) * 0.15;
    lastY += (y - lastY) * 0.15;

    crt.style.transform = `rotateX(${lastY}deg) rotateY(${lastX}deg)`;
  });
}


/* =========================================================
   CRT SWEEP (Optimized)
========================================================= */
const sweep = document.querySelector(".crt-sweep");

function runSweep() {
  if (!sweep) return;
  sweep.classList.remove("run");
  void sweep.offsetWidth; // reset animation
  sweep.classList.add("run");
}

setInterval(runSweep, 2600);


/* =========================================================
   PANEL SCROLL REVEAL (lighter + faster)
========================================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
);

document.querySelectorAll(".panel").forEach((panel) =>
  revealObserver.observe(panel)
);
