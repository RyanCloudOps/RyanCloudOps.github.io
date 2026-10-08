// ====== Portfolio — Gary Flores ======
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- i18n (Spanish lives in the HTML) ----------
  const EN = {
    "nav.about": "About", "nav.skills": "Skills", "nav.exp": "Experience", "nav.ach": "Achievements", "nav.proj": "Projects", "nav.contact": "Contact",
    "hero.eyebrow": "Barcelona · Systems Engineer", "hero.hi": "Hi, I'm",
    "hero.lead": "Systems Engineer in the PLM department at Sothis. My background is systems administration, virtualization and technical support, and I'm now levelling up in Cloud and DevOps.",
    "hero.contact": "Let's talk", "hero.work": "See projects →", "cv.short": "CV ↓", "cv": "Download CV",
    "id.hint": "↻ tap to flip", "id.role": "Role", "id.at": "Company", "id.loc": "Location", "id.study": "Studying", "id.langs": "Languages", "id.next": "Next",
    "id.quote": "Always learning, always building.", "id.photo": "See real photo", "id.char": "See character",
    "about.title": "From sysadmin to future Cloud Architect.",
    "about.p1": "I started in help desk, moved through software development, and today I install, migrate and maintain Siemens Teamcenter and Tecnomatix at Sothis. That systems foundation is what I'm now taking to the cloud.",
    "about.p2": "Azure is my main cloud; I'm training on AWS and have GCP on the roadmap, along with Terraform, Docker, Kubernetes and CI/CD.",
    "st.years": "years in IT", "st.langs": "languages", "st.certs": "certifications", "st.clouds": "clouds on the roadmap",
    "sk.title": "Periodic table of skills", "sk.hint": "Hover an element to read its description.", "sk.use": "in use", "sk.train": "in training",
    "exp.title": "Journey",
    "w1.date": "JUN 2021 – NOV 2021", "w1.a": "Microsoft 365 / Active Directory administration", "w1.b": "Windows and Linux administration", "w1.c": "Application installation and maintenance",
    "w2.role": "Software Developer", "w2.date": "APR 2022 – APR 2023", "w2.c": "Version control with Git",
    "w3.role": "Systems Engineer · PLM Department", "w3.date": "JUL 2023 – PRESENT",
    "w3.a": "Installation, migration and maintenance of Siemens Teamcenter (server and clients)",
    "w3.b": "Tecnomatix: eMServer, eMSAgent and clients · SimTalk programming in Plant Simulation",
    "edu.title": "Education", "badge.progress": "In progress",
    "edu.uoc": "BSc Computer Engineering · 2024 – 2028",
    "edu.dam": "Higher Diploma in Multiplatform App Development (DAM) · 2021 – 2023",
    "edu.asir": "Higher Diploma in Network Systems Administration (ASIR) · 2020 – 2022",
    "ach.title": "Certifications",
    "cert.vmware": "VMware Virtualization Expert", "cert.apache": "Apache Web Server 2.4", "cert.backup": "Backup Planning", "cert.next": "NEXT TARGET", "cert.route": "ON THE ROADMAP",
    "q.title": "Projects & roadmap", "q.done": "Published", "q.next": "Next",
    "q1.desc": "This portfolio: framework-free HTML, CSS and JavaScript, bilingual and deployed on GitHub Pages.",
    "q2.title": "3-tier infra with Terraform", "q2.desc": "VPC, subnets, load balancer, autoscaling and a managed database, deployed with GitHub Actions.",
    "q3.title": "Kubernetes observability", "q3.desc": "Prometheus + Grafana + Loki on a cluster, with ready-made dashboards and alerts.",
    "q.roadmap": "Roadmap",
    "rm1.t": "Foundations", "rm1.d": "Linux, networking, Windows Server, AD, virtualization, Git",
    "rm2.t": "Cloud & IaC", "rm2.d": "AWS / Azure, Docker, Terraform, CI/CD",
    "rm3.t": "Platform & operations", "rm3.d": "Kubernetes, Helm, observability, cost, high availability",
    "rm4.t": "Cloud Architect", "rm4.d": "Landing zones, hybrid networking, Well-Architected",
    "c.title": "Let's talk?", "c.lead": "Looking for someone for your systems or cloud team? Drop me a line.",
  };
  const CATS = {
    es: { all: "Todo", cloud: "Cloud", devops: "DevOps / IaC", sys: "Sistemas", code: "Código", db: "Bases de datos" },
    en: { all: "All", cloud: "Cloud", devops: "DevOps / IaC", sys: "Systems", code: "Code", db: "Databases" },
  };
  const ES = {};
  $$("[data-i18n]").forEach(el => { ES[el.dataset.i18n] = el.innerHTML; });
  let lang = store.get("pf-lang") || (navigator.language || "es").slice(0, 2);
  if (lang !== "en") lang = "es";

  // ---------- Skills (periodic table) ----------
  // s = symbol, n = name, c = category, t = in training
  const SK = [
    { s: "Az", n: "Azure", c: "cloud", t: 1, es: "Cloud principal. Preparando AZ-104.", en: "Main cloud. Preparing for AZ-104." },
    { s: "Aw", n: "AWS", c: "cloud", t: 1, es: "Entrenando: preparando AWS Cloud Practitioner.", en: "Training: preparing for AWS Cloud Practitioner." },
    { s: "Gc", n: "Google Cloud", c: "cloud", t: 1, es: "En la ruta: Associate Cloud Engineer.", en: "On the roadmap: Associate Cloud Engineer." },
    { s: "Tf", n: "Terraform", c: "devops", t: 1, es: "Entrenando: módulos, estados remotos e IaC.", en: "Training: modules, remote state and IaC." },
    { s: "Dk", n: "Docker", c: "devops", t: 1, es: "Entrenando: imágenes, volúmenes y compose.", en: "Training: images, volumes and compose." },
    { s: "K8", n: "Kubernetes", c: "devops", t: 1, es: "Entrenando: clústeres, Helm y observabilidad.", en: "Training: clusters, Helm and observability." },
    { s: "Ga", n: "GitHub Actions", c: "devops", t: 1, es: "Entrenando: pipelines CI/CD.", en: "Training: CI/CD pipelines." },
    { s: "Gr", n: "Grafana", c: "devops", t: 1, es: "Entrenando: dashboards y observabilidad.", en: "Training: dashboards and observability." },
    { s: "Do", n: "Azure DevOps", c: "devops", es: "Trabajo diario con Azure DevOps en Sothis.", en: "Day-to-day Azure DevOps at Sothis." },
    { s: "Gt", n: "Git", c: "devops", es: "Control de versiones, ramas y PRs.", en: "Version control, branches and PRs." },
    { s: "Gh", n: "GitHub", c: "devops", es: "Repos, README de perfil y GitHub Pages.", en: "Repos, profile README and GitHub Pages." },
    { s: "Vs", n: "VS Code", c: "devops", es: "Mi editor principal para scripts, IaC y configuración.", en: "My main editor for scripts, IaC and config." },
    { s: "Ws", n: "Windows Server", c: "sys", es: "Windows Server 2016 y Active Directory en producción.", en: "Windows Server 2016 and Active Directory in production." },
    { s: "Ad", n: "Active Directory", c: "sys", es: "Usuarios, grupos y políticas en entornos corporativos.", en: "Users, groups and policies in corporate environments." },
    { s: "Lx", n: "Linux", c: "sys", es: "Administración de sistemas Linux.", en: "Linux systems administration." },
    { s: "Vm", n: "VMware", c: "sys", es: "Experto en virtualización VMware (certificado).", en: "Certified VMware virtualization expert." },
    { s: "M3", n: "Microsoft 365", c: "sys", es: "Administración de Microsoft 365.", en: "Microsoft 365 administration." },
    { s: "Tc", n: "Teamcenter", c: "sys", es: "Siemens Teamcenter: instalación, migración y mantenimiento.", en: "Siemens Teamcenter: installation, migration and maintenance." },
    { s: "Tx", n: "Tecnomatix", c: "sys", es: "Siemens Tecnomatix: eMServer, eMSAgent y clientes.", en: "Siemens Tecnomatix: eMServer, eMSAgent and clients." },
    { s: "Tm", n: "Apache Tomcat", c: "sys", es: "Despliegue y mantenimiento de Tomcat para Teamcenter.", en: "Deploying and maintaining Tomcat for Teamcenter." },
    { s: "Ap", n: "Apache HTTP", c: "sys", es: "Servidor web Apache 2.4 (certificado).", en: "Apache 2.4 web server (certified)." },
    { s: "Py", n: "Python", c: "code", es: "Scripting y automatización.", en: "Scripting and automation." },
    { s: "Jv", n: "Java", c: "code", es: "Base de programación del ciclo DAM.", en: "Programming foundation from the DAM diploma." },
    { s: "Nt", n: ".NET", c: "code", es: "Desarrollo de aplicaciones en ALTEN.", en: "Application development at ALTEN." },
    { s: "Sh", n: "Bash / Batch", c: "code", es: "Scripts .bat y shell para automatizar instalaciones.", en: ".bat and shell scripts to automate installs." },
    { s: "St", n: "SimTalk", c: "code", es: "Programación de simulaciones en Plant Simulation.", en: "Simulation programming in Plant Simulation." },
    { s: "Bs", n: "Bootstrap", c: "code", es: "Interfaces web en ALTEN.", en: "Web UIs at ALTEN." },
    { s: "Sq", n: "SQL Server", c: "db", es: "SQL Server y SSMS para aplicaciones PLM e informes.", en: "SQL Server and SSMS for PLM apps and reporting." },
    { s: "Or", n: "Oracle", c: "db", es: "Manejo de bases de datos Oracle.", en: "Working with Oracle databases." },
  ];
  const table = $("#periodic"), desc = $("#sk-desc"), filters = $("#filters");
  SK.forEach((e, i) => {
    const b = document.createElement("button");
    b.className = "el" + (e.t ? " train" : "");
    b.dataset.cat = e.c;
    b.innerHTML = `<span class="n">${String(i + 1).padStart(2, "0")}</span><span class="s">${e.s}</span><span class="m">${e.n}</span>`;
    const show = () => { desc.innerHTML = `<strong>${e.n}</strong> — ${e[lang]}`; };
    b.addEventListener("mouseenter", show);
    b.addEventListener("focus", show);
    b.addEventListener("click", show);
    table.appendChild(b);
  });
  let activeCat = "all";
  function buildFilters() {
    filters.innerHTML = "";
    Object.keys(CATS.es).forEach(k => {
      const f = document.createElement("button");
      f.className = "filter" + (k === activeCat ? " active" : "");
      f.textContent = CATS[lang][k];
      f.addEventListener("click", () => {
        activeCat = k;
        $$(".filter").forEach(x => x.classList.toggle("active", x === f));
        $$(".el").forEach(el => el.classList.toggle("off", k !== "all" && el.dataset.cat !== k));
      });
      filters.appendChild(f);
    });
  }

  function applyLang() {
    const dict = lang === "en" ? EN : ES;
    $$("[data-i18n]").forEach(el => { const v = dict[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    document.documentElement.lang = lang;
    $("#lang-btn").textContent = lang === "en" ? "ES" : "EN";
    buildFilters();
    $$(".el").forEach(el => el.classList.toggle("off", activeCat !== "all" && el.dataset.cat !== activeCat));
    paintPhotoBtn();
    startTyping();
    if (typeof say === "function" && bubble.textContent) bubble.textContent = SAY[sayIdx][lang];
  }
  $("#lang-btn").addEventListener("click", () => { lang = lang === "en" ? "es" : "en"; store.set("pf-lang", lang); applyLang(); });

  // ---------- Theme ----------
  const root = document.documentElement;
  const savedTheme = store.get("pf-theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  else if (matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
  $("#theme-btn").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    store.set("pf-theme", root.dataset.theme);
  });

  // ---------- ID card ----------
  const card = $("#id-card");
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  const img = $("#id-img"), photoBtn = $("#photo-btn");
  let realPhoto = false;
  function paintPhotoBtn() { photoBtn.textContent = (lang === "en" ? EN : ES)[realPhoto ? "id.char" : "id.photo"]; }
  photoBtn.addEventListener("click", () => {
    realPhoto = !realPhoto;
    img.src = realPhoto ? "assets/gary.webp" : "assets/gary-id.webp";
    img.alt = realPhoto ? "Foto de Gary" : "Personaje de Gary";
    card.classList.remove("flipped");
    paintPhotoBtn();
  });
  ES["id.char"] = "Ver personaje";

  // ---------- Typed role ----------
  const ROLES = ["Systems Engineer", "Cloud Engineer in progress", "Future Cloud Architect"];
  const typed = $("#typed");
  let typeRun = 0;
  async function startTyping() {
    const run = ++typeRun;
    if (reduced) { typed.textContent = ROLES[0] + " → " + ROLES[2]; return; }
    const wait = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; run === typeRun; i = (i + 1) % ROLES.length) {
      for (let c = 1; c <= ROLES[i].length && run === typeRun; c++) { typed.textContent = ROLES[i].slice(0, c); await wait(55); }
      await wait(1400);
      for (let c = ROLES[i].length; c >= 0 && run === typeRun; c--) { typed.textContent = ROLES[i].slice(0, c); await wait(28); }
      await wait(250);
    }
  }

  // ---------- Reveal + nav highlight ----------
  const links = $$(".nav nav a");
  const rev = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    if (en.target.id) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  }), { threshold: .15 });
  $$(".block").forEach(s => { s.classList.add("reveal"); rev.observe(s); });

  // ---------- Drag-scroll for achievements ----------
  const sc = $("#scroller");
  let down = false, sx = 0, sl = 0;
  sc.addEventListener("pointerdown", e => { down = true; sx = e.clientX; sl = sc.scrollLeft; sc.classList.add("drag"); });
  window.addEventListener("pointerup", () => { down = false; sc.classList.remove("drag"); });
  sc.addEventListener("pointermove", e => { if (down) sc.scrollLeft = sl - (e.clientX - sx); });

  // ---------- Hero character: two cross-faded clips (talking / arms crossed) + speech bubble ----------
  const SAY = [
    { es: "¡Hola! Soy Gary 👋", en: "Hi! I'm Gary 👋" },
    { es: "Systems Engineer en Sothis", en: "Systems Engineer at Sothis" },
    { es: "De sysadmin a Cloud Architect", en: "From sysadmin to Cloud Architect" },
    { es: "Ahora: AWS, Terraform y Kubernetes", en: "Now: AWS, Terraform and Kubernetes" },
    { es: "3 nubes en mi ruta: Azure, AWS y GCP", en: "3 clouds on my path: Azure, AWS and GCP" },
    { es: "Certificado en virtualización VMware", en: "VMware virtualization certified" },
    { es: "Siguiente nivel: Terraform Associate", en: "Next level: Terraform Associate" },
    { es: "Uptime del 99.9% ✔", en: "99.9% uptime ✔" },
    { es: "¿Hablamos?", en: "Shall we talk?" },
  ];
  const cv = $("#anim"), cx = cv.getContext("2d"), bubble = $("#bubble"), stage = $("#stage");
  const CLIPS = {
    talk: { src: "assets/gary-talk.webp", cols: 6, rows: 4, n: 24, fw: 319, fh: 720, loop: 4000 },
    idle: { src: "assets/gary-anim.webp", cols: 4, rows: 3, n: 12, fw: 304, fh: 720, loop: 2000 },
  };
  Object.values(CLIPS).forEach(c => { c.img = new Image(); });
  let cur = "idle", prev = null, switchAt = 0, sayIdx = 0, sayTimer = null, hideTimer = null, hovering = false;
  const FADE_MS = 350;

  function drawClip(c, t, alpha) {
    const f = ((t / c.loop) * c.n) % c.n, i = Math.floor(f), k = f - i;
    const put = (idx, a) => {
      cx.globalAlpha = a;
      cx.drawImage(c.img, (idx % c.cols) * c.fw, Math.floor(idx / c.cols) * c.fh, c.fw, c.fh,
        (cv.width - c.fw) / 2, 0, c.fw, c.fh);
    };
    put(i, alpha);
    if (!reduced && k > 0) put((i + 1) % c.n, alpha * k);   // cross-fade into the next frame
  }
  function render(t) {
    cx.clearRect(0, 0, cv.width, cv.height);
    drawClip(CLIPS[cur], t, 1);
    if (prev) {
      const k = (performance.now() - switchAt) / FADE_MS;
      if (k >= 1) prev = null; else drawClip(CLIPS[prev], t, 1 - k);   // old clip fades out on top
    }
    cx.globalAlpha = 1;
  }
  function tick(t) { render(t); if (!reduced) requestAnimationFrame(tick); }
  function setClip(name) {
    if (name === cur) return;
    prev = cur; cur = name; switchAt = performance.now();
  }

  function say(i) {
    sayIdx = (i + SAY.length) % SAY.length;
    clearTimeout(hideTimer);
    bubble.classList.remove("show");
    setTimeout(() => {
      bubble.textContent = SAY[sayIdx][lang]; bubble.classList.add("show");
      setClip("talk");
    }, 260);
    hideTimer = setTimeout(() => { bubble.classList.remove("show"); setClip("idle"); }, 3900);
  }
  function loop() {
    clearTimeout(sayTimer);
    if (reduced) return;
    sayTimer = setTimeout(() => { if (!hovering) say(sayIdx + 1); loop(); }, 5600);
  }
  stage.addEventListener("click", () => { say(sayIdx + 1); loop(); });
  stage.addEventListener("mouseenter", () => { hovering = true; });
  stage.addEventListener("mouseleave", () => { hovering = false; });

  let pending = Object.keys(CLIPS).length;
  Object.values(CLIPS).forEach(c => {
    c.img.onload = () => {
      if (--pending) return;
      if (reduced) { render(0); bubble.textContent = SAY[0][lang]; bubble.classList.add("show"); return; }
      requestAnimationFrame(tick);
      setTimeout(() => say(0), 600);
      loop();
    };
    c.img.src = c.src;
  });

  applyLang();
})();
