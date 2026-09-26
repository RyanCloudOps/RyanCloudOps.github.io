// ====== CLOUD QUEST — arcade portfolio ======
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  // ---------- i18n ----------
  // Spanish lives in the HTML; this is the English copy for each data-i18n key.
  const EN = {
    "start.sub": "THE ROAD TO CLOUD ARCHITECT",
    "start.press": "▶ PRESS START",
    "start.hint": "ENTER / CLICK TO PLAY",
    "nav.player": "PLAYER", "nav.cloud": "CLOUD", "nav.worlds": "WORLDS",
    "cloud.title": "CHOOSE YOUR CLOUD",
    "cloud.azure": "Azure DevOps day to day at Sothis, plus the Microsoft stack (Windows Server, AD, SQL Server). Next target: AZ-104.",
    "cloud.aws": "Preparing AWS Cloud Practitioner: IAM, VPC, EC2, S3 and a first Terraform-built infrastructure.",
    "cloud.gcp": "On the roadmap: Associate Cloud Engineer, GKE and multi-cloud architectures.", "nav.inventory": "INVENTORY",
    "nav.achievements": "TROPHIES", "nav.quests": "QUESTS", "nav.contact": "CONTACT",
    "cv.short": "⬇ CV", "cv.long": "⬇ DOWNLOAD CV", "cta.contact": "✉ CONTACT ME",
    "player.tag": "— PLAYER SELECT —",
    "player.class": "CLASS",
    "player.lead": "Systems Engineer in the PLM department at Sothis. My background is systems administration, virtualization and technical support, and I'm now levelling up in Cloud and DevOps.",
    "player.stats": "STATS",
    "stat.virt": "VIRTUALIZATION", "stat.support": "SUPPORT",
    "player.langs": "UNLOCKED LANGUAGES",
    "lang.es": "SPANISH · NATIVE", "lang.ca": "CATALAN · PROFESSIONAL", "lang.en": "ENGLISH · PROFESSIONAL",
    "worlds.tag": "— WORLD SELECT —", "worlds.title": "EXPERIENCE",
    "w1.date": "JUN 2021 – NOV 2021",
    "w1.a": "Microsoft 365 / Active Directory administration",
    "w1.b": "Windows and Linux administration",
    "w1.c": "Application installation and maintenance",
    "w2.role": "Software Developer", "w2.date": "APR 2022 – APR 2023",
    "w2.c": "Version control with Git",
    "badge.playing": "▶ PLAYING", "badge.progress": "IN PROGRESS",
    "w3.role": "Systems Engineer · PLM Department", "w3.date": "JUL 2023 – PRESENT",
    "w3.a": "Installation, migration and maintenance of Siemens Teamcenter (server and clients)",
    "w3.b": "Tecnomatix: eMServer, eMSAgent and clients · SimTalk programming in Plant Simulation",
    "w4.role": "Next world",
    "w4.a": "Req: AWS / Azure · Terraform · Docker · Kubernetes · CI/CD",
    "edu.title": "TRAINING (EDUCATION)",
    "edu.uoc": "BSc Computer Engineering · 2024 – 2028",
    "edu.dam": "Higher Diploma in Multiplatform App Development (DAM) · 2021 – 2023",
    "edu.asir": "Higher Diploma in Network Systems Administration (ASIR) · 2020 – 2022",
    "inv.tag": "— INVENTORY —", "inv.title": "SKILLS &amp; TOOLS",
    "inv.all": "ALL", "inv.equipped": "EQUIPPED", "inv.training": "TRAINING",
    "inv.hint": "Hover an item to read its description.",
    "ach.tag": "— TROPHY ROOM —", "ach.title": "ACHIEVEMENTS",
    "cert.vmware": "VMware Virtualization Expert", "cert.apache": "Apache Web Server 2.4",
    "cert.backup": "Backup Planning", "cert.next": "NEXT TARGET", "cert.route": "ON THE ROADMAP",
    "q.tag": "— QUEST LOG —", "q.title": "PROJECTS &amp; ROADMAP",
    "q.main": "MAIN QUEST", "q.side": "SIDE QUEST",
    "q1.desc": "This arcade portfolio: framework-free HTML, CSS and JavaScript, bilingual and deployed on GitHub Pages.",
    "q2.title": "3-TIER INFRA WITH TERRAFORM",
    "q2.desc": "VPC, subnets, load balancer, autoscaling and a managed database, deployed with GitHub Actions.",
    "q3.title": "KUBERNETES OBSERVABILITY",
    "q3.desc": "Prometheus + Grafana + Loki on a cluster, with ready-made dashboards and alerts.",
    "q.roadmap": "LEVEL MAP",
    "rm1.t": "Foundations", "rm1.d": "Linux, networking, Windows Server, AD, virtualization, Git",
    "rm2.t": "Cloud &amp; IaC", "rm2.d": "AWS / Azure, Docker, Terraform, CI/CD",
    "rm3.t": "Platform &amp; operations", "rm3.d": "Kubernetes, Helm, observability, cost, high availability",
    "rm4.t": "Cloud Architect", "rm4.d": "Landing zones, hybrid networking, Well-Architected",
    "c.lead": "Looking for someone for your systems or cloud team? Insert a coin and let's talk.",
    "c.secret": "Hint: clicking the clouds scores points. And there's a secret code… ↑↑↓↓←→←→BA",
  };
  const UI = {
    es: { allClear: "🏆 LOGRO DESBLOQUEADO: MODO RECLUTADOR", konami: "★ CÓDIGO SECRETO ACTIVADO ★", insert: "INSERT COIN", cv: "¡CV DESCARGADO! +1000", pick: n => `☁ ${n} SELECCIONADA` },
    en: { allClear: "🏆 ACHIEVEMENT UNLOCKED: RECRUITER MODE", konami: "★ SECRET CODE ACTIVATED ★", insert: "INSERT COIN", cv: "CV DOWNLOADED! +1000", pick: n => `☁ ${n} SELECTED` },
  };
  const ES = {};
  $$("[data-i18n]").forEach(el => { ES[el.dataset.i18n] = el.innerHTML; });

  let lang = store.get("cq-lang") || (navigator.language || "es").slice(0, 2);
  if (lang !== "en") lang = "es";

  function applyLang() {
    const dict = lang === "en" ? EN : ES;
    $$("[data-i18n]").forEach(el => {
      const v = dict[el.dataset.i18n];
      if (v != null) el.innerHTML = v;
    });
    document.documentElement.lang = lang;
    $("#lang-btn").textContent = lang === "en" ? "ES" : "EN";
  }
  $("#lang-btn").addEventListener("click", () => {
    lang = lang === "en" ? "es" : "en";
    store.set("cq-lang", lang);
    applyLang();
    sfx("select");
  });

  // ---------- Sound (WebAudio chiptune blips) ----------
  let audio = null;
  let soundOn = store.get("cq-sound") === "1";
  const SFX = {
    coin:   [[988, .06], [1319, .18]],
    select: [[660, .05], [880, .05]],
    start:  [[523, .08], [659, .08], [784, .08], [1047, .2]],
    level:  [[784, .08], [988, .08], [1175, .08], [1568, .25]],
    tick:   [[440, .04]],
  };
  function sfx(name) {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      let t = audio.currentTime;
      for (const [f, d] of SFX[name]) {
        const o = audio.createOscillator(), g = audio.createGain();
        o.type = "square"; o.frequency.value = f;
        g.gain.setValueAtTime(.06, t);
        g.gain.exponentialRampToValueAtTime(.001, t + d);
        o.connect(g).connect(audio.destination);
        o.start(t); o.stop(t + d);
        t += d * .9;
      }
    } catch {}
  }
  const soundBtn = $("#sound-btn");
  function paintSound() { soundBtn.textContent = soundOn ? "🔊" : "🔇"; soundBtn.setAttribute("aria-pressed", soundOn); }
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn; store.set("cq-sound", soundOn ? "1" : "0"); paintSound(); sfx("select");
  });
  paintSound();

  // ---------- Score ----------
  let score = 0;
  let hi = parseInt(store.get("cq-hi") || "0", 10) || 0;
  const pad = n => String(n).padStart(6, "0");
  function addScore(n, x, y) {
    score += n;
    $("#score").textContent = pad(score);
    if (score > hi) { hi = score; store.set("cq-hi", hi); }
    $("#hiscore").textContent = pad(hi);
    if (x != null) {
      const f = document.createElement("div");
      f.className = "float-score"; f.textContent = "+" + n;
      f.style.left = x + "px"; f.style.top = y + "px";
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 900);
    }
  }
  $("#hiscore").textContent = pad(hi);

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // ---------- Start screen ----------
  const start = $("#start-screen");
  let started = false;
  function begin() {
    if (started) return;
    started = true;
    start.classList.add("hidden");
    document.body.classList.remove("locked");
    try { sessionStorage.setItem("cq-started", "1"); } catch {}
    sfx("start");
  }
  let seen = false;
  try { seen = sessionStorage.getItem("cq-started") === "1"; } catch {}
  if (seen) { started = true; start.classList.add("hidden"); }
  else document.body.classList.add("locked");
  start.addEventListener("click", begin);

  // ---------- Pixel-art logos ----------
  // Real devicon SVGs drawn onto a tiny canvas, alpha-thresholded and outlined,
  // then scaled up with image-rendering: pixelated for an 8-bit sprite look.
  const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";
  const OUTLINE = [3, 6, 12];
  const INK = [228, 239, 255];
  const imgCache = new Map();
  function loadImg(src) {
    if (!imgCache.has(src)) imgCache.set(src, new Promise((ok, fail) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => ok(img);
      img.onerror = fail;
      img.src = src;
    }));
    return imgCache.get(src);
  }
  async function pixelIcon(path, size, { light = false, res = 20 } = {}) {
    const img = await loadImg(DI + path);
    const ratio = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 1;
    const h = res, w = Math.max(1, Math.round(res * Math.min(ratio, 2.5)));
    const cv = document.createElement("canvas");
    cv.width = w + 2; cv.height = h + 2;
    const ctx = cv.getContext("2d");
    ctx.drawImage(img, 1, 1, w, h);
    try {
      const d = ctx.getImageData(0, 0, cv.width, cv.height), p = d.data, W = cv.width, H = cv.height;
      const solid = new Uint8Array(W * H);
      for (let i = 0; i < W * H; i++) {
        if (p[i * 4 + 3] > 90) {
          solid[i] = 1; p[i * 4 + 3] = 255;
          const lum = .3 * p[i * 4] + .59 * p[i * 4 + 1] + .11 * p[i * 4 + 2];
          if (light && lum < 70) { p[i * 4] = INK[0]; p[i * 4 + 1] = INK[1]; p[i * 4 + 2] = INK[2]; }
        } else p[i * 4 + 3] = 0;
      }
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (solid[i]) continue;
        if ((x > 0 && solid[i - 1]) || (x < W - 1 && solid[i + 1]) || (y > 0 && solid[i - W]) || (y < H - 1 && solid[i + W])) {
          p[i * 4] = OUTLINE[0]; p[i * 4 + 1] = OUTLINE[1]; p[i * 4 + 2] = OUTLINE[2]; p[i * 4 + 3] = 255;
        }
      }
      ctx.putImageData(d, 0, 0);
    } catch { /* tainted canvas: keep the smooth downscale */ }
    const scale = size / cv.height;
    cv.style.width = Math.round(cv.width * scale) + "px";
    cv.style.height = size + "px";
    return cv;
  }
  function mountPixelIcons(root = document) {
    $$("[data-px]", root).forEach(el => {
      const size = +el.dataset.pxSize || 40;
      pixelIcon(el.dataset.px, size, { light: el.hasAttribute("data-px-light"), res: +el.dataset.pxRes || 20 })
        .then(cv => el.replaceChildren(cv))
        .catch(() => { el.innerHTML = `<span class="px-fallback">?</span>`; });
      el.removeAttribute("data-px");
    });
  }
  mountPixelIcons();

  // ---------- Pixel clouds ----------
  const CLOUD = [
    "......XXXX........",
    "....XXWWWWXX......",
    "...XWWWWWWWWX.XXX.",
    ".XXWWWWWWWWWWXWWWX",
    "XWWWWWWWWWWWWWWWWX",
    "XWWWWWWWWWWWWWWWSX",
    ".XSSWWWWWWWWWWSSX.",
    "..XXSSSSSSSSSSXX..",
    "....XXXXXXXXXX....",
  ];
  const FACE = { "4,6": "E", "4,11": "E", "6,8": "M", "6,9": "M" }; // row,col
  function cloudSVG(face, tint) {
    const w = CLOUD[0].length, h = CLOUD.length;
    const col = { X: "#00e5ff", W: tint, S: "#0e1628", E: "#00e5ff", M: "#ff3d7f" };
    let rects = "";
    CLOUD.forEach((row, y) => [...row].forEach((c, x) => {
      if (c === ".") return;
      const k = face && FACE[`${y},${x}`] || c;
      rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${col[k]}"/>`;
    }));
    return `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects}</svg>`;
  }
  const cloudsEl = $("#clouds");
  const TINTS = ["#17223a", "#1a2744", "#141d33"];
  // The first few clouds carry a provider logo: "regions" drifting by.
  const CLOUD_LOGOS = [
    ["azure/azure-original.svg", false],
    ["amazonwebservices/amazonwebservices-original-wordmark.svg", true],
    ["googlecloud/googlecloud-original.svg", false],
  ];
  function spawnCloud(i, initial) {
    const c = document.createElement("div");
    c.className = "cloud";
    const logo = CLOUD_LOGOS[i];
    const size = logo ? 170 + Math.random() * 50 : 90 + Math.random() * 130;
    const dur = 40 + Math.random() * 50;
    c.style.width = size + "px";
    c.style.top = (8 + Math.random() * 78) + "vh";
    c.style.animationDuration = dur + "s";
    c.style.animationDelay = initial ? (-Math.random() * dur) + "s" : "0s";
    c.style.opacity = logo ? ".85" : (.3 + Math.random() * .3).toFixed(2);
    c.innerHTML = cloudSVG(!logo && Math.random() < .4, TINTS[i % TINTS.length]);
    if (logo) {
      c.dataset.bonus = "1";
      const s = document.createElement("span");
      s.className = "px-icon cloud-logo";
      s.dataset.px = logo[0];
      s.dataset.pxSize = Math.round(size * .26);
      if (logo[1]) s.setAttribute("data-px-light", "");
      c.appendChild(s);
      mountPixelIcons(c);
    }
    cloudsEl.appendChild(c);
  }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CLOUD_COUNT = window.innerWidth < 760 ? 5 : 9;
  if (!reduced) for (let i = 0; i < CLOUD_COUNT; i++) spawnCloud(i, true);

  // Clouds sit behind the content, so hit-test them on any click that isn't on a control.
  document.addEventListener("click", e => {
    if (!started || e.target.closest("a, button, .item, .cabinet, .start-screen")) return;
    for (const c of $$(".cloud:not(.pop)")) {
      const r = c.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        c.classList.add("pop");
        addScore(c.dataset.bonus ? 300 : 100, e.clientX, e.clientY);
        sfx("coin");
        setTimeout(() => { const i = $$(".cloud").indexOf(c); c.remove(); spawnCloud(i, false); }, 300);
        break;
      }
    }
  });

  // ---------- Coin buttons ----------
  $$("[data-coin]").forEach(a => a.addEventListener("click", e => {
    const isCV = a.hasAttribute("download");
    addScore(isCV ? 1000 : 50, e.clientX, e.clientY);
    sfx("coin");
    if (isCV) toast(UI[lang].cv);
  }));

  // ---------- Cloud select cabinets ----------
  const picked = new Set();
  $$(".cabinet").forEach(cab => {
    const pick = e => {
      $$(".cabinet").forEach(x => x.classList.toggle("selected", x === cab));
      sfx("level");
      if (!picked.has(cab.dataset.cloud)) {
        picked.add(cab.dataset.cloud);
        const r = cab.getBoundingClientRect();
        addScore(250, e.clientX || r.left + r.width / 2, e.clientY || r.top + 40);
      }
      toast(UI[lang].pick(cab.querySelector("h3").textContent));
    };
    cab.addEventListener("click", pick);
    cab.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(e); } });
  });

  // ---------- Terminal ----------
  const TERM = [
    ["$ ", "whoami"],
    ["", "gary · systems engineer -> cloud architect", "dim"],
    ["$ ", "az devops project list --output table"],
    ["", "PLM-Teamcenter   PLM-Tecnomatix   infra-scripts", "dim"],
    ["$ ", "terraform plan -out quest.tfplan"],
    ["", "+ azurerm_resource_group.cloud_quest", "add"],
    ["", "+ azurerm_static_web_app.portfolio", "add"],
    ["", "Plan: 2 to add, 0 to change, 0 to destroy.", "warn"],
    ["$ ", "docker build -t cloud-quest:1up ."],
    ["", "[ok] image built - 42 MB", "add"],
    ["$ ", "kubectl get pods -n career"],
    ["", "NAME               READY   STATUS", "dim"],
    ["", "junior-engineer    1/1     Completed", "add"],
    ["", "cloud-engineer     1/1     Running", "warn"],
    ["", "cloud-architect    0/1     Pending", "dim"],
    ["$ ", "echo \"ship it!\""],
  ];
  const termEl = $("#term");
  const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function runTerminal() {
    for (;;) {
      let html = "";
      for (const [prompt, text, cls] of TERM) {
        if (prompt) {
          const pre = html + `<span class="prompt">${prompt}</span>`;
          for (let i = 1; i <= text.length && !reduced; i++) {
            termEl.innerHTML = pre + `<span class="cmd">${esc(text.slice(0, i))}</span><span class="cursor">&nbsp;</span>`;
            await wait(35 + Math.random() * 40);
          }
          html = pre + `<span class="cmd">${esc(text)}</span>\n`;
          if (!reduced) await wait(350);
        } else {
          html += `<span class="${cls}">${esc(text)}</span>\n`;
          if (!reduced) { termEl.innerHTML = html; await wait(140); }
        }
        termEl.scrollTop = termEl.scrollHeight;
      }
      termEl.innerHTML = html + `<span class="prompt">$ </span><span class="cursor">&nbsp;</span>`;
      termEl.scrollTop = termEl.scrollHeight;
      if (reduced) return;
      await wait(4000);
    }
  }
  runTerminal();

  // ---------- CI/CD pipeline ----------
  const pipeSteps = $$("#pipe li");
  const pipeBadge = $("#pipe-badge");
  let pipeIdx = reduced ? pipeSteps.length : 0;
  function tickPipe() {
    pipeSteps.forEach((li, i) => {
      li.classList.toggle("done", i < pipeIdx);
      li.classList.toggle("run", i === pipeIdx);
    });
    const passed = pipeIdx >= pipeSteps.length;
    pipeBadge.textContent = passed ? "PASSING ✔" : "RUNNING";
    pipeBadge.className = "badge " + (passed ? "badge-ok" : "badge-live");
    if (reduced) return;
    pipeIdx = passed ? 0 : pipeIdx + 1;
    setTimeout(tickPipe, passed ? 2600 : 900);
  }
  tickPipe();

  // ---------- Inventory ----------
  const ITEMS = [
    { n: "Windows Server", i: "windows11/windows11-original.svg", c: "equipped", es: "Windows Server 2016 y Active Directory en producción.", en: "Windows Server 2016 and Active Directory in production." },
    { n: "Active Directory", g: "AD", c: "equipped", es: "Usuarios, grupos y políticas en entornos corporativos.", en: "Users, groups and policies in corporate environments." },
    { n: "Linux", i: "linux/linux-original.svg", c: "equipped", es: "Administración de sistemas Linux.", en: "Linux systems administration." },
    { n: "VMware", g: "VM", c: "equipped", es: "Experto en virtualización VMware (certificado).", en: "Certified VMware virtualization expert." },
    { n: "Azure DevOps", i: "azuredevops/azuredevops-original.svg", c: "equipped", es: "Trabajo diario con Azure DevOps en Sothis.", en: "Day-to-day Azure DevOps at Sothis." },
    { n: "VS Code", i: "vscode/vscode-original.svg", c: "equipped", es: "Mi editor principal para scripts, IaC y configuración.", en: "My main editor for scripts, IaC and config." },
    { n: "Git", i: "git/git-original.svg", c: "equipped", es: "Control de versiones, ramas y PRs.", en: "Version control, branches and PRs." },
    { n: "GitHub", i: "github/github-original.svg", light: true, c: "equipped", es: "Repos, README de perfil y GitHub Pages.", en: "Repos, profile README and GitHub Pages." },
    { n: "SQL Server", i: "microsoftsqlserver/microsoftsqlserver-original.svg", c: "equipped", es: "SQL Server y SSMS para aplicaciones PLM e informes.", en: "SQL Server and SSMS for PLM apps and reporting." },
    { n: "Apache Tomcat", i: "tomcat/tomcat-original.svg", c: "equipped", es: "Despliegue y mantenimiento de Tomcat para Teamcenter.", en: "Deploying and maintaining Tomcat for Teamcenter." },
    { n: "Apache HTTP", i: "apache/apache-original.svg", c: "equipped", es: "Servidor web Apache 2.4 (certificado).", en: "Apache 2.4 web server (certified)." },
    { n: "Teamcenter", g: "TC", c: "equipped", es: "Siemens Teamcenter: instalación, migración y mantenimiento.", en: "Siemens Teamcenter: installation, migration and maintenance." },
    { n: "Tecnomatix", g: "TX", c: "equipped", es: "Siemens Tecnomatix: eMServer, eMSAgent y clientes.", en: "Siemens Tecnomatix: eMServer, eMSAgent and clients." },
    { n: "Microsoft 365", g: "365", c: "equipped", es: "Administración de Microsoft 365.", en: "Microsoft 365 administration." },
    { n: "Python", i: "python/python-original.svg", c: "lang", es: "Scripting y automatización.", en: "Scripting and automation." },
    { n: "Java", i: "java/java-original.svg", c: "lang", es: "Base de programación del ciclo DAM.", en: "Programming foundation from the DAM diploma." },
    { n: ".NET", i: "dot-net/dot-net-original.svg", c: "lang", es: "Desarrollo de aplicaciones en ALTEN.", en: "Application development at ALTEN." },
    { n: "SimTalk", g: "ST", c: "lang", es: "Programación de simulaciones en Plant Simulation.", en: "Simulation programming in Plant Simulation." },
    { n: "Batch / Shell", i: "bash/bash-original.svg", c: "lang", es: "Scripts .bat y shell para automatizar instalaciones.", en: ".bat and shell scripts to automate installs." },
    { n: "Bootstrap", i: "bootstrap/bootstrap-original.svg", c: "lang", es: "Interfaces web en ALTEN.", en: "Web UIs at ALTEN." },
    { n: "Azure", i: "azure/azure-original.svg", c: "training", es: "Entrenando: preparando AZ-104.", en: "Training: preparing for AZ-104." },
    { n: "AWS", i: "amazonwebservices/amazonwebservices-original-wordmark.svg", light: true, c: "training", es: "Entrenando: preparando AWS Cloud Practitioner.", en: "Training: preparing for AWS Cloud Practitioner." },
    { n: "Google Cloud", i: "googlecloud/googlecloud-original.svg", c: "training", es: "En la ruta: Associate Cloud Engineer.", en: "On the roadmap: Associate Cloud Engineer." },
    { n: "Docker", i: "docker/docker-original.svg", c: "training", es: "Entrenando: imágenes, volúmenes y compose.", en: "Training: images, volumes and compose." },
    { n: "Kubernetes", i: "kubernetes/kubernetes-original.svg", c: "training", es: "Entrenando: clústeres, Helm y observabilidad.", en: "Training: clusters, Helm and observability." },
    { n: "Terraform", i: "terraform/terraform-original.svg", c: "training", es: "Entrenando: módulos, estados remotos e IaC.", en: "Training: modules, remote state and IaC." },
    { n: "GitHub Actions", i: "githubactions/githubactions-original.svg", c: "training", es: "Entrenando: pipelines CI/CD.", en: "Training: CI/CD pipelines." },
    { n: "Grafana", i: "grafana/grafana-original.svg", c: "training", es: "Entrenando: dashboards y observabilidad.", en: "Training: dashboards and observability." },
  ];
  const grid = $("#inventory-grid");
  const desc = $("#item-desc");
  ITEMS.forEach((it, idx) => {
    const b = document.createElement("button");
    b.className = "item" + (it.c === "training" ? " training" : "");
    b.dataset.cat = it.c;
    b.dataset.idx = idx;
    const glyph = `<span class="glyph">${it.g || it.n.slice(0, 2).toUpperCase()}</span>`;
    b.innerHTML = (it.i ? `<span class="px-icon" data-px="${it.i}" data-px-size="40"${it.light ? " data-px-light" : ""}></span>` : glyph)
      + `<span class="item-name">${it.n}</span>`;
    mountPixelIcons(b);
    const show = () => { desc.innerHTML = `<strong>${it.n}</strong> — ${it[lang]}`; };
    b.addEventListener("mouseenter", show);
    b.addEventListener("focus", show);
    b.addEventListener("click", () => { show(); sfx("select"); });
    grid.appendChild(b);
  });
  $$(".filter").forEach(f => f.addEventListener("click", () => {
    $$(".filter").forEach(x => x.classList.toggle("active", x === f));
    const cat = f.dataset.filter;
    $$(".item").forEach(i => i.classList.toggle("hidden", cat !== "all" && i.dataset.cat !== cat));
    sfx("select");
  }));

  // ---------- Stage discovery + nav highlight ----------
  const stages = $$("[data-stage]");
  const visited = new Set();
  const navLinks = $$(".hud-nav a");
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const s = en.target;
      s.classList.add("in-view");
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + s.id));
      if (started && !visited.has(s.id)) {
        visited.add(s.id);
        if (visited.size > 1) { addScore(500); sfx("level"); }
        if (visited.size === stages.length) {
          addScore(5000);
          setTimeout(() => toast(UI[lang].allClear), 600);
        }
      }
      if (s.id === "continue") runCountdown();
    });
  }, { threshold: .3 });
  stages.forEach(s => io.observe(s));

  // ---------- CONTINUE? countdown ----------
  let cdTimer = null;
  function runCountdown() {
    if (cdTimer) return;
    const el = $("#countdown");
    let n = 9;
    el.textContent = n;
    cdTimer = setInterval(() => {
      n--;
      if (n < 0) n = 9;
      el.textContent = n === 0 ? UI[lang].insert : n;
      el.style.fontSize = n === 0 ? "clamp(20px, 4vw, 40px)" : "";
      if (n > 0) sfx("tick");
    }, 1000);
  }

  // ---------- Konami code ----------
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  document.addEventListener("keydown", e => {
    if (!started && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); begin(); return; }
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kIdx = k === KONAMI[kIdx] ? kIdx + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) {
      kIdx = 0;
      document.body.classList.toggle("konami");
      addScore(9999);
      sfx("level");
      toast(UI[lang].konami);
    }
  });

  applyLang();
})();
