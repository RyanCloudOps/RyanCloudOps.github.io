// Terminal-style intro ("deploy --portfolio") + custom cursor
(() => {
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- intro ----
  let resolve;
  window.introReady = new Promise(r => (resolve = r));
  if (root.classList.contains("no-intro") || reduced) {
    intro.remove(); resolve();
  } else {
    document.body.classList.add("loading");
    const cmd = "deploy --env production --portfolio";
    const typed = document.getElementById("intro-typed");
    const steps = [...document.querySelectorAll("#intro-steps li")];
    const status = document.getElementById("intro-status");
    const pct = document.getElementById("intro-pct");
    const bar = document.getElementById("intro-steps");
    const MSG = ["› initializing build environment…", "› running test suite…", "› deploying to production…", "› verifying health checks…"];
    let i = 0;
    const type = () => {
      typed.textContent = cmd.slice(0, ++i);
      if (i < cmd.length) return setTimeout(type, 28 + Math.random() * 30);
      setTimeout(run, 250);
    };
    const run = () => {
      const DUR = 2600, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / DUR, 1);
        const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;   // ease in-out
        pct.textContent = Math.round(e * 100);
        bar.style.setProperty("--p", e.toFixed(3));
        let n = 0;
        steps.forEach((s, k) => { const on = e >= Math.max(k / 3, .06); s.classList.toggle("on", on); if (on) n = k; });
        status.textContent = p === 1 ? "› ready — welcome" : MSG[n];
        if (p < 1) return requestAnimationFrame(tick);
        setTimeout(finish, 450);
      };
      requestAnimationFrame(tick);
    };
    const finish = () => {
      try { sessionStorage.setItem("intro", "1"); } catch (e) {}
      intro.classList.add("done");
      document.body.classList.remove("loading");
      resolve();
      setTimeout(() => intro.remove(), 800);
    };
    setTimeout(type, 400);
  }

  // ---- cursor ----
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const ring = document.getElementById("cur-ring"), dot = document.getElementById("cur-dot");
  root.classList.add("has-cur");
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    root.classList.add("cur-on");
    dot.style.transform = `translate(${x}px,${y}px)`;
    ring.classList.toggle("link", !!e.target.closest("a, button, [role=button], .filter, .egg-half, input, label"));
  }, { passive: true });
  document.addEventListener("mouseleave", () => root.classList.remove("cur-on"));
  addEventListener("pointerdown", () => ring.classList.add("down"));
  addEventListener("pointerup", () => ring.classList.remove("down"));
  (function loop() {
    rx += (x - rx) * .18; ry += (y - ry) * .18;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();
})();

// ---- constellations (fixed background, tech-themed) + git-history timeline ----
(() => {
  const cv = document.getElementById("stars");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (cv) {
    const ctx = cv.getContext("2d");
    // Named constellations: points are fractions of the viewport
    const SETS = [
      { n: "DEVOPS", p: [[.08, .22], [.13, .12], [.2, .2], [.17, .33], [.09, .38]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3]] },
      { n: "CLOUD", p: [[.8, .14], [.87, .09], [.93, .18], [.88, .3], [.78, .27]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4]] },
      { n: "PLM", p: [[.06, .66], [.14, .6], [.2, .7], [.14, .82]], e: [[0, 1], [1, 2], [2, 3], [1, 3]] },
      { n: "SYSTEMS", p: [[.82, .62], [.9, .55], [.95, .68], [.86, .8], [.78, .76]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
    ];
    const dust = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + .3, a: Math.random() * .5 + .15 }));
    const flares = new Map();   // "set:index" -> start time (ms): a star flares up now and then
    let nextFlare = performance.now() + 1500;
    let W, H, mx = 0, my = 0, tx = 0, ty = 0, sy = 0, t = 0;
    const resize = () => { const d = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    resize(); addEventListener("resize", resize);
    addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
    addEventListener("scroll", () => { sy = scrollY; }, { passive: true });
    const draw = () => {
      t += .01; mx += (tx - mx) * .05; my += (ty - my) * .05;
      const w = innerWidth, h = innerHeight, dark = document.documentElement.dataset.theme === "dark";
      const c = dark ? "255,255,255" : "0,0,0";
      ctx.clearRect(0, 0, w, h);
      const now = performance.now();
      if (!reduced && now > nextFlare) {
        const si = Math.floor(Math.random() * SETS.length);
        flares.set(si + ":" + Math.floor(Math.random() * SETS[si].p.length), now);
        nextFlare = now + 900 + Math.random() * 1800;
      }
      ctx.font = "600 10px 'Geist Mono', monospace"; ctx.textAlign = "center";
      dust.forEach((d, i) => {
        const k = .4 + (i % 3) * .3;
        const x = ((d.x * w + mx * 30 * k) % w + w) % w, y = (((d.y * h - sy * .04 * k + my * 30 * k) % h) + h) % h;
        ctx.fillStyle = `rgba(${c},${d.a * (.7 + .3 * Math.sin(t * 2 + i))})`;
        ctx.beginPath(); ctx.arc(x, y, d.r, 0, 7); ctx.fill();
      });
      SETS.forEach((s, si) => {
        const k = 1 + si * .25, ox = mx * 22 * k, oy = my * 22 * k - ((sy * .06 * k) % (h * 1.1));
        const pts = s.p.map(([x, y]) => [x * w + ox, ((y * h + oy) % (h * 1.1) + h * 1.1) % (h * 1.1) - h * .05]);
        ctx.strokeStyle = `rgba(${c},.13)`; ctx.lineWidth = 1; ctx.beginPath();
        s.e.forEach(([a, b]) => { ctx.moveTo(pts[a][0], pts[a][1]); ctx.lineTo(pts[b][0], pts[b][1]); });
        ctx.stroke();
        pts.forEach(([x, y], i) => {
          const key = si + ":" + i, f0 = flares.get(key);
          let e = 0;
          if (f0 != null) { const q = (now - f0) / 1600; if (q >= 1) flares.delete(key); else e = Math.sin(q * Math.PI); }
          ctx.fillStyle = `rgba(${c},${Math.min(1, .45 + .25 * Math.sin(t * 2 + i + si) + e * .55)})`;
          ctx.beginPath(); ctx.arc(x, y, 2 + e * 2.2, 0, 7); ctx.fill();
          if (e > 0) {   // four-point glint
            const L = 5 + e * 13;
            ctx.strokeStyle = `rgba(${c},${e * .7})`; ctx.lineWidth = 1; ctx.beginPath();
            ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
          }
        });
        ctx.fillStyle = `rgba(${c},.18)`; ctx.fillText(s.n, pts[0][0], pts[0][1] - 14);
      });
      if (!reduced) requestAnimationFrame(draw);
    };
    draw();
  }

  const tl = document.querySelector(".timeline");
  if (tl) {
    const items = [...tl.children];
    const upd = () => {
      const r = tl.getBoundingClientRect(), line = innerHeight * .6;
      tl.style.setProperty("--tl", Math.max(0, Math.min(1, (line - r.top) / r.height)).toFixed(3));
      items.forEach(li => li.classList.toggle("lit", reduced || li.getBoundingClientRect().top < line));
    };
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  }
})();

// ---- hidden Draco constellation in the footer: brush all 10 stars with the cursor (or tap them) and a Chinese dragon is drawn ----
(() => {
  const sky = document.getElementById("sky");
  if (!sky) return;
  const NS = "http://www.w3.org/2000/svg", W = 560, H = 300;
  const S = [[.84, .28], [.74, .2], [.67, .36], [.8, .44], [.62, .58], [.5, .48], [.4, .62], [.28, .5], [.18, .66], [.08, .55]].map(([x, y]) => [(x * .7 + .02) * W, y * H]);
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]];
  const key = (a, b) => (a < b ? a + "-" + b : b + "-" + a);
  const el = (n, a = {}, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p && p.appendChild(e); return e; };
  const f = v => v.toFixed(1), pt = p => f(p[0]) + "," + f(p[1]);

  function dragon(g) {
    const h0 = S[0], P = [S[9], S[8], S[7], S[6], S[5], S[4], S[3], h0, [h0[0] + 38, h0[1] - 16]];
    const pts = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
      for (let t = 0; t < 1; t += 1 / 22) {
        const t2 = t * t, t3 = t2 * t;
        pts.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    pts.push(P[P.length - 1]);
    const n = pts.length, L = [], R = [], T = [], Wd = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, n - 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
      const w = 1.4 + 8.6 * Math.pow(Math.min(1, i / (n - 1) / .38), .9);
      T.push([dx, dy]); Wd.push(w);
      L.push([p[0] - dy * w, p[1] + dx * w]);   // belly side
      R.push([p[0] + dy * w, p[1] - dx * w]);   // back side
    });
    el("path", { class: "body", d: "M" + L.map(pt).join("L") + "L" + [...R].reverse().map(pt).join("L") + "Z", pathLength: 1 }, g);
    let sc = "";
    for (let i = 8; i < n - 14; i += 4) sc += `M${pt(L[i])}Q${pt([pts[i][0] - T[i][0] * Wd[i] * 1.1, pts[i][1] - T[i][1] * Wd[i] * 1.1])} ${pt(R[i])}`;
    el("path", { class: "scale", d: sc }, g);
    let fin = "";
    for (let i = 10; i < n - 8; i += 6) {   // flame mane along the back
      const w = Wd[i], tx = T[i][0], ty = T[i][1], nx = R[i][0] - pts[i][0], ny = R[i][1] - pts[i][1], k = 1.25 + w / 7;
      const tip = [R[i][0] + nx * k - tx * (4 + w * .7), R[i][1] + ny * k - ty * (4 + w * .7)];
      fin += `M${pt(R[i])}Q${pt([R[i][0] + nx * k * .9 + tx * 2, R[i][1] + ny * k * .9 + ty * 2])} ${pt(tip)}`;
    }
    const e0 = pts[0];
    fin += `M${pt(e0)}C${f(e0[0] - 10)},${f(e0[1] - 8)} ${f(e0[0] - 20)},${f(e0[1] - 2)} ${f(e0[0] - 26)},${f(e0[1] - 12)}M${pt(e0)}C${f(e0[0] - 10)},${f(e0[1] + 4)} ${f(e0[0] - 18)},${f(e0[1] + 12)} ${f(e0[0] - 26)},${f(e0[1] + 8)}`;
    el("path", { class: "fin", d: fin }, g);
    let legs = "";
    [.2, .3, .55, .66].forEach(q => {
      const i = Math.floor(n * q), tx = T[i][0], ty = T[i][1], bx = L[i][0], by = L[i][1];
      const nx = bx - pts[i][0], ny = by - pts[i][1], m = Math.hypot(nx, ny) || 1, ux = nx / m, uy = ny / m;
      const k = [bx + ux * 7 - tx * 5, by + uy * 7 - ty * 5], paw = [bx + ux * 15 + tx * 3, by + uy * 15 + ty * 3];
      legs += `M${pt([bx, by])}L${pt(k)}L${pt(paw)}`;
      [-4, 0, 4].forEach(o => { legs += `M${pt(paw)}L${pt([paw[0] + ux * 5 + tx * (3 + o), paw[1] + uy * 5 + ty * (3 + o)])}`; });
    });
    el("path", { class: "leg", d: legs }, g);
    const e = pts[n - 1], q = pts[n - 7], ang = Math.atan2(e[1] - q[1], e[0] - q[0]);
    const hg = el("g", { transform: `translate(${f(e[0])} ${f(e[1])}) rotate(${f(ang * 180 / Math.PI)})` }, g);
    el("path", { class: "head", d:
      "M-6 -10C8 -17 26 -16 38 -10C44 -8 48 -11 51 -6C51 -3 45 -2 41 -1L27 0L41 4C36 9 24 11 14 10C6 10 -1 9 -6 10Z" +
      "M31 -1L33 4L35 -1M23 0L25 4L27 0M9 -10Q15 -13 21 -9" +
      "M-2 -12C-10 -22 -22 -28 -38 -25M-14 -22C-16 -31 -24 -37 -32 -38M-8 -15C-18 -18 -28 -14 -34 -8" +
      "M46 -6C60 -16 74 -8 90 -20C94 -23 99 -19 96 -16M45 -4C58 3 72 9 90 2C94 0 97 4 94 6" +
      "M14 10C13 19 7 24 -1 24M22 10C23 17 19 23 12 27" }, hg);
    el("circle", { class: "eye", cx: 15, cy: -6, r: 2.2 }, hg);
    el("circle", { class: "eye", cx: 45, cy: -6, r: 1.2 }, hg);
    const pg = el("g", { class: "pearl", transform: `translate(${f(e[0] + Math.cos(ang) * 100 + 4)} ${f(e[1] + Math.sin(ang) * 100 + 8)})` }, g);
    el("circle", { r: 9 }, pg);
    el("path", { d: "M-9 -2C-16 -10 -12 -18 -8 -22M-3 -9C-6 -18 0 -24 4 -28M5 -8C10 -14 8 -22 14 -26M9 0C18 -2 22 -10 20 -14" }, pg);
  }

  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, "aria-hidden": "true" });
  sky.insertBefore(svg, sky.firstChild);
  const edges = new Map(E.map(([a, b]) => [key(a, b), el("line", { class: "edge", x1: S[a][0], y1: S[a][1], x2: S[b][0], y2: S[b][1] }, svg)]));
  dragon(el("g", { class: "dragon" }, svg));
  const stars = S.map(p => {
    const g = el("g", { class: "star" }, svg);
    el("circle", { class: "core", cx: p[0], cy: p[1], r: 2.4 }, g);
    el("circle", { class: "hit", cx: p[0], cy: p[1], r: 18 }, g);
    return g;
  });
  const lit = new Set();
  let done = false;
  const touch = i => {
    if (done) return;
    lit.add(i); stars[i].classList.add("lit");
    E.forEach(([a, b]) => { if (lit.has(a) && lit.has(b)) edges.get(key(a, b)).classList.add("on"); });
    if (lit.size === S.length) { done = true; setTimeout(() => sky.classList.add("done"), 500); }
  };
  stars.forEach((s, i) => { s.addEventListener("pointerenter", () => touch(i)); s.addEventListener("pointerdown", () => touch(i)); });
})();
