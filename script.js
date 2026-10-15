// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (remembered per browser)
const themeToggle = document.getElementById("themeToggle");
function setTheme(light) {
  document.body.classList.toggle("light", light);
  themeToggle.textContent = light ? "☀️" : "🌙";
}
try { setTheme(localStorage.getItem("theme") === "light"); } catch (e) {}
themeToggle.addEventListener("click", () => {
  const light = !document.body.classList.contains("light");
  setTheme(light);
  try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
});

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuBtn.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("open");
  })
);

// Typing effect
const phrases = ["Data Science Student", "Finance Enthusiast", "ML Explorer", "F1 & Cricket Fan"];
const typed = document.getElementById("typed");
let pi = 0, ci = 0, deleting = false;
function type() {
  const word = phrases[pi];
  ci += deleting ? -1 : 1;
  typed.textContent = word.slice(0, ci);
  let delay = deleting ? 50 : 90;
  if (!deleting && ci === word.length) { deleting = true; delay = 1500; }
  else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}
type();

// Scroll: progress bar, nav shadow, back-to-top, active link
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");
const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".nav-link");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  nav.classList.toggle("scrolled", y > 40);
  toTop.classList.toggle("show", y > 500);
  let current = "";
  sections.forEach((s) => { if (y >= s.offsetTop - 120) current = s.id; });
  links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Reveal on scroll, skill bars and counters
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("visible");
    el.querySelectorAll(".fill").forEach((f) => (f.style.width = f.dataset.w + "%"));
    el.querySelectorAll(".counter").forEach(countUp);
    observer.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

function countUp(el) {
  const target = +el.dataset.target;
  let n = 0;
  const step = () => {
    n++;
    el.textContent = n;
    if (n < target) setTimeout(step, 120);
  };
  step();
}

// Project filters
document.querySelectorAll(".filter").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.f;
    document.querySelectorAll(".project").forEach((p) =>
      p.classList.toggle("hide", f !== "all" && p.dataset.cat !== f)
    );
  })
);

// Card tilt (desktop only)
if (window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });

  const glow = document.getElementById("cursorGlow");
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

// Copy email buttons
document.querySelectorAll(".copy-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(btn.dataset.copy).then(() => {
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    });
  })
);

// Contact form: opens the visitor's email app with the message filled in
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const msg = document.getElementById("cMsg").value.trim();
  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(msg + "\n\n— " + name + " (" + email + ")");
  window.location.href = `mailto:satavadwait@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById("formNote").textContent = "Opening your email app…";
});

// Background: slow drifting dots
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let dots = [];
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.min(60, Math.floor(window.innerWidth / 25));
  dots = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  }));
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(108, 140, 255, 0.35)";
  dots.forEach((d) => {
    d.x = (d.x + d.vx + canvas.width) % canvas.width;
    d.y = (d.y + d.vy + canvas.height) % canvas.height;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
window.addEventListener("resize", resize);
resize();
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) draw();
