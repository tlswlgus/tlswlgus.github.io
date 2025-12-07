// Boot screen fade-out
setTimeout(() => {
  const boot = document.getElementById("boot-screen");
  if (!boot) return;
  boot.style.opacity = "0";
  setTimeout(() => boot.remove(), 600);
}, 1200);

// CRT parallax tilt (desktop / pointer devices only)
const crt = document.getElementById("crt");
const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;

if (crt && prefersFinePointer) {
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 4;
    const y = (e.clientY / window.innerHeight - 0.5) * -4;
    crt.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
  });
}

// Sweep line animation loop
setInterval(() => {
  const sweep = document.querySelector(".crt-sweep");
  if (!sweep) return;
  sweep.classList.remove("run");
  // force reflow
  void sweep.offsetWidth;
  sweep.classList.add("run");
}, 3000);
