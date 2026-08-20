const TIMELINE = [
  {
    year: "2026",
    label: "26년",
    spend: 350,
    events: [
      { name: "추석 모임", extra: "부부동반 · 인당 7.5만원", amount: 150 },
      { name: "송년 모임", extra: "부부동반 · 인당 10만원", amount: 200 }
    ]
  },
  {
    year: "2027",
    label: "27년",
    spend: 700,
    events: [
      { name: "설 모임", extra: "인당 5만원", amount: 100 },
      { name: "정기총회", extra: "", amount: 250 },
      { name: "추석 모임", extra: "부부동반 · 인당 7.5만원", amount: 150 },
      { name: "송년 모임", extra: "부부동반 · 인당 10만원", amount: 200 }
    ]
  },
  {
    year: "2028",
    label: "28년",
    spend: 700,
    events: [
      { name: "설 모임", extra: "인당 5만원", amount: 100 },
      { name: "정기총회", extra: "", amount: 250 },
      { name: "추석 모임", extra: "부부동반 · 인당 7.5만원", amount: 150 },
      { name: "송년 모임", extra: "부부동반 · 인당 10만원", amount: 200 }
    ]
  },
  {
    year: "2029",
    label: "29년",
    spend: 350,
    events: [
      { name: "설 모임", extra: "인당 5만원", amount: 100 },
      { name: "정기총회", extra: "", amount: 250 }
    ]
  }
];

const CATEGORIES = [
  { name: "정기총회", value: 750, color: "#d4b45a" },
  { name: "송년 모임", value: 600, color: "#c45c67" },
  { name: "추석 모임", value: 450, color: "#e0c07a" },
  { name: "설 모임", value: 300, color: "#7d9b78" }
];

const BARS = [
  { year: "26", income: 756, spend: 350 },
  { year: "27", income: 756, spend: 700 },
  { year: "28", income: 756, spend: 700 },
  { year: "29", income: 756, spend: 350 }
];

const won = (n) => n.toLocaleString("ko-KR") + "만원";

function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString("ko-KR");
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderTimeline() {
  document.getElementById("timelineList").innerHTML = TIMELINE.map(
    (group) => `
      <section class="year-block">
        <header class="year-heading">
          <div>
            <p class="year-kicker">${group.label}</p>
            <h3>${group.year}</h3>
          </div>
          <p class="year-sum">지출 ${won(group.spend)}</p>
        </header>
        <ol class="timeline">
          ${group.events
            .map(
              (item) => `
            <li>
              <div class="what-wrap">
                <span class="what">${item.name}</span>
                ${item.extra ? `<span class="extra">${item.extra}</span>` : ""}
              </div>
              <span class="who">${won(item.amount)}</span>
            </li>
          `
            )
            .join("")}
        </ol>
      </section>
    `
  ).join("");
}

function drawDonut() {
  const canvas = document.getElementById("donut");
  const ctx = canvas.getContext("2d");
  const cssSize = Math.min(280, Math.floor(canvas.parentElement.clientWidth) || 280);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = cssSize * dpr;
  canvas.height = cssSize * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const total = CATEGORIES.reduce((sum, item) => sum + item.value, 0);
  const cx = cssSize / 2;
  const cy = cssSize / 2;
  const radius = cssSize * 0.38;
  let angle = -Math.PI / 2;

  ctx.clearRect(0, 0, cssSize, cssSize);
  CATEGORIES.forEach((item) => {
    const slice = (item.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, angle, angle + slice);
    ctx.strokeStyle = item.color;
    ctx.lineWidth = Math.max(18, cssSize * 0.1);
    ctx.lineCap = "butt";
    ctx.stroke();
    angle += slice;
  });

  document.getElementById("legend").innerHTML = CATEGORIES.map(
    (item) => `
      <li>
        <span class="swatch" style="background:${item.color}"></span>
        ${item.name}
        <b>${won(item.value)}</b>
      </li>
    `
  ).join("");
}

function renderBars() {
  const max = 756;
  document.getElementById("bars").innerHTML = BARS.map(
    (row) => `
      <div class="bar-row">
        <strong>${row.year}년</strong>
        <div class="tracks">
          <div class="bar-meta"><span>수입</span><span>${won(row.income)}</span></div>
          <div class="track in"><i data-w="${(row.income / max) * 100}"></i></div>
          <div class="bar-meta"><span>지출</span><span>${won(row.spend)}</span></div>
          <div class="track out"><i data-w="${(row.spend / max) * 100}"></i></div>
        </div>
      </div>
    `
  ).join("");
}

function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  const mobile = window.matchMedia("(max-width: 860px)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const dots = Array.from({ length: mobile ? 18 : 48 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.6 + 0.4,
    s: Math.random() * 0.25 + 0.05
  }));

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((dot) => {
      dot.y -= dot.s / 1000;
      if (dot.y < 0) dot.y = 1;
      ctx.beginPath();
      ctx.fillStyle = "rgba(240, 215, 140, 0.35)";
      ctx.arc(dot.x * canvas.width, dot.y * canvas.height, dot.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      entry.target.querySelectorAll(".track > i").forEach((bar) => {
        bar.style.width = bar.dataset.w + "%";
      });
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

observer.observe(document.querySelector(".hero"));
observer.observe(document.querySelector(".charts"));

const navLinks = [...document.querySelectorAll(".mobile-nav a")];
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

["timeline", "charts"].forEach((id) => {
  spy.observe(document.getElementById(id));
});

window.addEventListener("resize", () => drawDonut());

renderTimeline();
drawDonut();
renderBars();
initParticles();
