"use strict";

document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector("[data-hero]");
if (hero) {
  const button = hero.querySelector(".motion-toggle");
  function updateControl() {
    button.hidden = reduceMotion.matches;
  }
  updateControl();
  reduceMotion.addEventListener("change", updateControl);
  const label = button.querySelector("[data-motion-label]");
  const motionLabels = {
    de: ["Bewegung pausieren", "Bewegung fortsetzen"],
    en: ["Pause motion", "Resume motion"],
    uk: ["Призупинити рух", "Відновити рух"],
  };
  button.addEventListener("click", () => {
    const paused = hero.classList.toggle("motion-paused");
    button.setAttribute("aria-pressed", String(paused));
    label.dataset.i18n = paused ? "concept.motionPlay" : "concept.motionPause";
    label.textContent = (motionLabels[document.documentElement.lang] || motionLabels.de)[Number(paused)];
  });
}

const constellation = [[.13,.55],[.35,.25],[.57,.58],[.78,.32],[.88,.64]];
const golden = Math.PI * (3 - Math.sqrt(5));

function buildNetwork(element) {
  const canvas = element.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let onscreen = false;
  let hovered = false;
  const animatedHero = element.classList.contains("hero-network");
  let frameId = 0;
  let lastFrame = 0;

  function paint(ms = 0) {
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const spread = Math.min(width, height);
    const large = animatedHero && width > 650;
    const origin = large ? width * .36 : 0;
    const extent = large ? width * .64 : width;
    const points = constellation.map(([x, y], index) => ({
      x: origin + x * extent,
      y: (y + (large ? .10 : .03)) * height,
      r: spread * (.069 + (index % 3) * .017)
    }));

    ctx.strokeStyle = "rgba(171, 226, 213, .07)";
    ctx.lineWidth = 1;
    const step = Math.max(25, spread / 12);
    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        ctx.fillStyle = "rgba(172, 231, 213, .20)";
        ctx.fillRect(x, y, 1, 1);
      }
    }

    points.forEach(({x, y, r}, index) => {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.7);
      glow.addColorStop(0, index % 2 ? "rgba(73,205,174,.28)" : "rgba(101,176,238,.30)");
      glow.addColorStop(1, "rgba(24,75,81,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(x - r * 2.7, y - r * 2.7, r * 5.4, r * 5.4);

      for (let i = 0; i < 87; i++) {
        const a = i * golden;
        const d = Math.sqrt(i / 86) * r * (1 + .13 * Math.sin(i * 2.6));
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d * .78;
        const bright = .22 + (1 - d / (r * 1.2)) * .57;
        ctx.fillStyle = index % 2
          ? "rgba(157,236,186," + bright + ")"
          : "rgba(155,212,248," + bright + ")";
        ctx.beginPath();
        ctx.arc(px, py, Math.max(.65, (1.06 + .7 * Math.sin(i * 8)) * spread / 370), 0, Math.PI * 2);
        ctx.fill();
      }

      if (index === points.length - 1) return;
      const next = points[index + 1];
      const mid = (x + next.x) / 2;
      for (let j = -2; j <= 2; j++) {
        const offset = j * spread * .009;
        ctx.beginPath();
        ctx.moveTo(x, y + offset);
        ctx.bezierCurveTo(mid, y + offset, mid, next.y + offset, next.x, next.y + offset);
        ctx.strokeStyle = j === 0 ? "rgba(181,240,202,.48)" : "rgba(122,198,213,.2)";
        ctx.stroke();
      }

      const t = ((ms / 2900 + index * .25) % 1);
      const t2 = t * t;
      const u = 1 - t;
      const u2 = u * u;
      const px = u2 * u * x + 3 * u2 * t * mid + 3 * u * t2 * mid + t2 * t * next.x;
      const py = u2 * u * y + 3 * u2 * t * y + 3 * u * t2 * next.y + t2 * t * next.y;
      ctx.shadowColor = "#b9ffcf";
      ctx.shadowBlur = 13;
      ctx.fillStyle = "#d4ffe6";
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1.8, spread / 140), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function canAnimate() {
    return onscreen && !reduceMotion.matches && (animatedHero || hovered);
  }
  function tick(time) {
    frameId = 0;
    if (!canAnimate()) return;
    if (time - lastFrame >= 32) {
      paint(time);
      lastFrame = time;
    }
    frameId = requestAnimationFrame(tick);
  }
  function sync() {
    if (canAnimate() && !frameId) frameId = requestAnimationFrame(tick);
    if (!canAnimate() && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }

  new ResizeObserver(([entry]) => {
    width = Math.max(1, entry.contentRect.width);
    height = Math.max(1, entry.contentRect.height);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    paint();
  }).observe(element);

  new IntersectionObserver(([entry]) => {
    onscreen = entry.isIntersecting;
    sync();
  }).observe(element);

  element.addEventListener("pointerenter", () => { hovered = true; sync(); });
  element.addEventListener("pointerleave", () => { hovered = false; sync(); paint(); });
  reduceMotion.addEventListener("change", () => { sync(); paint(); });

}

document.querySelectorAll("[data-network]").forEach(buildNetwork);

if (!reduceMotion.matches) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-in");
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".work-item, .hub-figure, .solution .media").forEach((element) => reveal.observe(element));
}
