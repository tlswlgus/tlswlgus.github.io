/* Boot screen fade-out */
setTimeout(() => {
  const boot = document.getElementById("boot-screen");
  boot.style.opacity = "0";
  setTimeout(() => boot.remove(), 600);
}, 1200);

/* CRT wobble effect */
const crt = document.getElementById("crt");
let wobble = 0;

function animateCRT() {
  wobble += 0.01;
  const distortion = Math.sin(wobble) * 0.8;

  crt.style.transform = `skewX(${distortion}deg)`;
  requestAnimationFrame(animateCRT);
}
animateCRT();

/* Parallax tilt on mouse move */
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 4;
  const y = (e.clientY / window.innerHeight - 0.5) * -4;

  crt.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
});

/* Sweep line animation */
setInterval(() => {
  const sweep = document.querySelector(".crt-sweep");
  sweep.classList.remove("run");
  void sweep.offsetWidth;
  sweep.classList.add("run");
}, 3000);
