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
        pts.forEach(([x, y], i) => { ctx.fillStyle = `rgba(${c},${.45 + .25 * Math.sin(t * 2 + i + si)})`; ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill(); });
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
