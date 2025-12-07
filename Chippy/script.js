// Boot screen fade-out + "press start" style delay
setTimeout(() => {
  const boot = document.getElementById("boot-screen");
  if (!boot) return;
  boot.style.opacity = "0";
  setTimeout(() => boot.remove(), 600);
}, 1400);

// CRT parallax tilt (desktop / pointer-fine only)
const crt = document.getElementById("crt");
const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;

if (crt && prefersFinePointer) {
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * -4;
    crt.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  });
}

// Sweep line loop
setInterval(() => {
  const sweep = document.querySelector(".crt-sweep");
  if (!sweep) return;
  sweep.classList.remove("run");
  // force reflow
  void sweep.offsetWidth;
  sweep.classList.add("run");
}, 3000);

// Scroll reveal for panels
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

// Sound toggle (with placeholder audio src)
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

    // IMPORTANT: replace "INSERT_SOUND_HERE" in index.html with a real file
    if (soundOn) {
      bgm.volume = 0.35;
      bgm.play().catch(() => {
        // ignore autoplay errors
      });
    } else {
      bgm.pause();
    }
  });
}
