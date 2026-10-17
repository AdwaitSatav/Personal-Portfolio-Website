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
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
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

// Background: faint market-style line that slowly draws across the screen
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let series = [];
let head = 0;
function makeSeries(n) {
  const out = [];
  let v = 0.55;
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.47) * 0.035; // slight upward drift
    v = Math.min(0.85, Math.max(0.2, v));
    out.push(v);
  }
  return out;
}
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  series = makeSeries(Math.ceil(canvas.width / 6) + 1);
  head = series.length;
}
function drawChart(count) {
  const w = canvas.width, h = canvas.height, step = w / (series.length - 1);
  const css = getComputedStyle(document.body);
  ctx.clearRect(0, 0, w, h);
  // grid
  ctx.strokeStyle = css.getPropertyValue("--grid").trim();
  ctx.lineWidth = 1;
  for (let y = 80; y < h; y += 80) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke(); }
  for (let x = 120; x < w; x += 120) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke(); }
  if (count < 2) return;
  const pts = series.slice(0, count).map((v, i) => [i * step, h - v * h]);
  // area under the line
  const fill = ctx.createLinearGradient(0, 0, 0, h);
  fill.addColorStop(0, css.getPropertyValue("--dot").trim());
  fill.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.moveTo(pts[0][0], h);
  pts.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.lineTo(pts[pts.length - 1][0], h);
  ctx.closePath();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.globalAlpha = 1;
  // line
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.strokeStyle = css.getPropertyValue("--dot").trim();
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // leading dot
  const [lx, ly] = pts[pts.length - 1];
  ctx.fillStyle = css.getPropertyValue("--accent").trim();
  ctx.beginPath();
  ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
  ctx.fill();
}
function animate() {
  if (head < series.length) head += 0.6;
  else {
    // keep it alive: shift left and add a new point every few frames
    series.shift();
    let v = series[series.length - 1] + (Math.random() - 0.48) * 0.035;
    series.push(Math.min(0.85, Math.max(0.2, v)));
  }
  drawChart(Math.floor(head));
  setTimeout(() => requestAnimationFrame(animate), head < series.length ? 0 : 220);
}
window.addEventListener("resize", () => { resize(); drawChart(series.length); });
resize();
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) drawChart(series.length);
else { head = 0; animate(); }
