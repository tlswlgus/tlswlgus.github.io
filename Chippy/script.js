// Boot screen fade-out
setTimeout(() => {
  const boot = document.getElementById("boot-screen");
  if (!boot) return;
  boot.style.opacity = "0";
  setTimeout(() => boot.remove(), 600);
}, 1400);

// CRT parallax (desktop)
const crt = document.getElementById("crt");
const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;

if (crt && prefersFinePointer) {
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * -4;
    crt.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  });
}

// Sweep line
setInterval(() => {
  const sweep = document.querySelector(".crt-sweep");
  if (!sweep) return;
  sweep.classList.remove("run");
  void sweep.offsetWidth;
  sweep.classList.add("run");
}, 3000);

// Scroll reveal
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
  { threshold: 0.15 }
);

panels.forEach((p) => revealObserver.observe(p));

// SOUND TOGGLE (BGM placeholder)
const soundBtn = document.getElementById("sound-toggle");
const bgm = document.getElementById("bgm");
const ledBlue = document.querySelector(".led-blue");
const ledGreen = document.querySelector(".led-green");
const ledRed = document.querySelector(".led-red");

if (soundBtn && bgm && ledBlue && ledGreen && ledRed) {
  let soundOn = false;

  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;

    soundBtn.textContent = soundOn ? "SOUND: ON" : "SOUND: OFF";
    ledBlue.classList.toggle("active", soundOn);
    ledGreen.classList.toggle("active", soundOn);
    ledRed.classList.toggle("active", !soundOn);

    if (soundOn) {
      bgm.volume = 0.35;
      bgm.play().catch(() => {});
    } else {
      bgm.pause();
    }
  });
}

/* =========================================================
   SFX BUTTONS
========================================================= */

document.querySelectorAll(".sfx-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const soundFile = btn.dataset.sound;
    const audio = new Audio(soundFile);
    audio.volume = 1.0;
    audio.play();
  });
});

/* Menu click sound triggers on DOWNLOAD buttons */
document.querySelectorAll(".primary-download").forEach((btn) => {
  btn.addEventListener("click", () => {
    const clickSound = new Audio("Game_Menu.wav");
    clickSound.volume = 1.0;
    clickSound.play();
  });
});
