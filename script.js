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
    "hero.lead": "Systems Engineer at Sothis (PLM). I install, migrate and operate Siemens Teamcenter and Tecnomatix platforms on Windows Server, Active Directory, Tomcat and SQL Server. 3+ years in production; now taking that infrastructure foundation to Azure, AWS and DevOps.",
    "hero.contact": "Let's talk", "hero.work": "See projects →", "cv.short": "CV ↓", "cv": "Download CV",
    "id.hint": "↻ tap to flip", "id.role": "Role", "id.at": "Company", "id.loc": "Location", "id.study": "Studying", "id.langs": "Languages", "id.next": "Next",
    "id.quote": "Always learning, always building.", "id.photo": "See real photo", "id.char": "See character",
    "about.title": "Systems Engineer today, Cloud Architect tomorrow.",
    "about.p1": "I work in the PLM department at Sothis, where I install, migrate and maintain Siemens Teamcenter and Tecnomatix (server and clients). Before that I went through technical support and software development; that systems foundation is what I am now taking to the cloud.",
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
    "skip": "Skip to content",
    "tagline": "I keep the systems engineering teams depend on up and running. Now I'm taking that same reliability to the cloud.",
    "egg.half": "Half of an Easter egg: drag it onto the other one", "egg.tip": "Break it!", "egg.hammer": "Hammer: hit the egg", "egg.close": "Close",
  };
  const CATS = {
    es: { all: "Todo", cloud: "Cloud", devops: "DevOps / IaC", sys: "Sistemas", code: "Código", db: "Bases de datos" },
    en: { all: "All", cloud: "Cloud", devops: "DevOps / IaC", sys: "Systems", code: "Code", db: "Databases" },
  };
  const ES = {};
  $$("[data-i18n]").forEach(el => { ES[el.dataset.i18n] = el.innerHTML; });
  $$("[data-i18n-label]").forEach(el => { ES[el.dataset.i18nLabel] = el.getAttribute("aria-label"); });
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
    $$("[data-i18n-label]").forEach(el => { const v = dict[el.dataset.i18nLabel]; if (v != null) el.setAttribute("aria-label", v); });
    document.documentElement.lang = lang;
    $("#lang-btn").textContent = lang === "en" ? "ES" : "EN";
    buildFilters();
    $$(".el").forEach(el => el.classList.toggle("off", activeCat !== "all" && el.dataset.cat !== activeCat));
    paintPhotoBtn();
    startTyping();
    splitTagline();
    if (beat) bubble.textContent = beatText(beat);
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
    img.src = realPhoto ? "assets/gary.webp?v=5" : "assets/gary-id.webp?v=5";
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

  // ---------- Mobile menu ----------
  const nav = $("#nav"), menuBtn = $("#menu-btn");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    document.body.classList.toggle("lock", open);
  }
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("#menu a").forEach((a, i) => { a.style.setProperty("--i", i); a.addEventListener("click", () => setMenu(false)); });
  addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false); });

  // ---------- Tagline: words light up one by one as they cross the trigger line ----------
  const tagline = $("#tagline");
  let words = [];
  function splitTagline() {
    tagline.innerHTML = tagline.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join("");
    words = $$(".w", tagline);
    paintWords();
  }
  function paintWords() {
    const line = innerHeight * 0.72;
    words.forEach(w => w.classList.toggle("on", reduced || w.getBoundingClientRect().top < line));
  }
  let wordsQueued = false;
  addEventListener("scroll", () => {
    if (wordsQueued) return;
    wordsQueued = true;
    requestAnimationFrame(() => { wordsQueued = false; paintWords(); });
  }, { passive: true });

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

  // ---------- Hero character: pre-keyed clip (colour on top, alpha below) drawn in WebGL + speech clouds synced to it ----------
  // assets/gary-hero.mp4 (15 s loop): 0–3 arms crossed · 3–5 points down · 5–9 looks around · 9–11 points right ·
  // 11–12 finger to chin · 12–13.4 leans and points down-right at the egg half (EGG_SPOT) · 13.5–15 back to arms crossed
  const BEATS = [
    { id: "hi", from: 0.2, to: 2.9, es: "¡Hola! Bienvenido a mi portafolio 👋", en: "Hi! Welcome to my portfolio 👋" },
    { id: "down", from: 3.1, to: 5, es: "Baja y mira lo que hago 👇", en: "Scroll down and see what I do 👇" },
    { id: "egg", from: 9, to: 13.4, es: "Une las 2 piezas 🥚", en: "Join the 2 pieces 🥚", done: { es: "¡Lo rompiste! 🔨", en: "You broke it! 🔨" } },
  ];
  const PEEK = [[5.5, 8.9]];   // he looks left and right: the egg halves glow
  const hero = $("#hero"), cv = $("#anim"), vid = $("#hero-vid"), poster = $("#hero-poster"), bubble = $("#bubble");
  let beat = null;
  const egg = { state: "apart", hits: 0, solved: false, at: 0, moved: null, home: null };   // easter egg state (see below)
  const beatText = b => (b.done && egg.solved ? b.done : b)[lang];

  function showBeat(b) {
    if (b === beat) return;
    beat = b;
    if (!b) { bubble.classList.remove("show"); return; }
    bubble.className = "bubble b-" + b.id;
    bubble.textContent = beatText(b);
    void bubble.offsetWidth;   // restart the entrance transition
    bubble.classList.add("show");
  }
  function syncTo(t) {
    showBeat(BEATS.find(b => t >= b.from && t < b.to) || null);
    hero.classList.toggle("peek", egg.state === "apart" && (PEEK.some(([a, b]) => t >= a && t < b) || beat?.id === "egg"));
  }

  // The green was keyed offline: top half is premultiplied colour, bottom half is alpha
  function keyer(canvas) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER,
      "attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}"));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER,
      "precision mediump float;uniform sampler2D t;varying vec2 v;void main(){float a=texture2D(t,vec2(v.x,.5+v.y*.5)).g;" +
      "a=smoothstep(.04,.96,a);gl_FragColor=vec4(min(texture2D(t,vec2(v.x,v.y*.5)).rgb,vec3(a)),a);}"));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]]
      .forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
    return src => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
  }

  const draw = !reduced && keyer(cv);
  if (!draw) {
    // Still poster (reduced motion or no WebGL): just the welcome cloud
    vid.remove();
    setTimeout(() => showBeat(BEATS[0]), 500);
  } else {
    const hasVFC = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    const onFrame = () => {
      draw(vid);
      if (!hero.classList.contains("live")) hero.classList.add("live");   // hide the poster once the clip paints
      syncTo(vid.currentTime);
      hasVFC ? vid.requestVideoFrameCallback(onFrame) : requestAnimationFrame(onFrame);
    };
    if (vid.readyState >= 2) onFrame();   // the clip may have loaded before this script ran
    else vid.addEventListener("loadeddata", onFrame, { once: true });
    const play = () => vid.play().catch(() => {
      showBeat(BEATS[0]);   // autoplay blocked (e.g. low-power mode): start on the first tap
      addEventListener("pointerdown", () => vid.play().catch(() => {}), { once: true });
    });
    // Only run while the hero is on screen
    new IntersectionObserver(([en]) => { en.isIntersecting ? play() : vid.pause(); }, { threshold: 0.05 }).observe(hero);
  }

  // ---------- Easter egg: join the two halves, then break it with the hammer ----------
  const halves = [$("#egg-l"), $("#egg-r")], hammer = $("#hammer"), eggTip = $("#egg-tip");
  const reveal = $("#egg-reveal"), revealClose = $("#egg-close");
  const SNAP = 70;   // px between the halves' centres that counts as "joined"
  const ZIG = [[50, 0], [43, 18], [57, 34], [44, 50], [58, 66], [43, 82], [57, 98], [45, 114], [50, 130]];
  const EGG = "M50 4C78 4 96 52 96 82C96 110 76 126 50 126C24 126 4 110 4 82C4 52 22 4 50 4Z";
  const pts = a => a.map(p => p.join(",")).join(" ");
  const eggSVG = side => {
    const cut = side === "l" ? [[0, 0], ...ZIG, [0, 130]] : [[100, 0], ...ZIG, [100, 130]];
    return `<svg viewBox="0 0 100 130" aria-hidden="true">
      <defs>
        <clipPath id="egg-cut-${side}"><polygon points="${pts(cut)}" /></clipPath>
        <clipPath id="egg-in-${side}"><path d="${EGG}" /></clipPath>
      </defs>
      <g clip-path="url(#egg-cut-${side})">
        <path class="shell" d="${EGG}" />
        <g clip-path="url(#egg-in-${side})" class="deco">
          <circle cx="32" cy="34" r="4" /><circle cx="50" cy="24" r="4" /><circle cx="68" cy="34" r="4" />
          <polyline class="zz" points="2,64 12,54 22,64 32,54 42,64 52,54 62,64 72,54 82,64 92,54 102,64" />
          <rect x="0" y="80" width="100" height="10" />
          <circle cx="34" cy="106" r="3" /><circle cx="50" cy="111" r="3" /><circle cx="66" cy="106" r="3" />
        </g>
        <ellipse class="shine" cx="30" cy="32" rx="5" ry="11" transform="rotate(20 30 32)" />
        <path class="crack c1" d="M24 40 L33 49 L28 57 L37 66" />
        <path class="crack c2" d="M74 28 L64 42 L71 51 L62 62 L69 74" />
        <path class="crack c3" d="M14 98 L28 92 L36 100 L50 90 L62 100 L76 92 L88 100" />
        <path class="outline" d="${EGG}" />
        <polyline class="seam" points="${pts(ZIG)}" />
      </g>
    </svg>`;
  };
  halves[0].innerHTML = eggSVG("l");
  halves[1].innerHTML = eggSVG("r");

  // The right half sits where Gary points at 12–13.4 s, as a fraction of the stage (layout box, so the rise animation doesn't matter)
  const EGG_SPOT = [0.92, 0.72], stage = $("#stage");
  function placeSpot() {
    const h = halves[1], sx = stage.getBoundingClientRect().left - hero.getBoundingClientRect().left;
    h.style.right = "auto";
    h.style.left = sx + EGG_SPOT[0] * stage.offsetWidth - h.offsetWidth / 2 + "px";
    h.style.top = stage.offsetTop + EGG_SPOT[1] * stage.offsetHeight - h.offsetHeight / 2 + "px";
  }
  placeSpot();
  addEventListener("resize", placeSpot);

  const other = h => halves[h === halves[0] ? 1 : 0];
  const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const gap = h => { const [a, b] = center(h), [c, d] = center(other(h)); return Math.hypot(a - c, b - d); };
  const off = new Map(halves.map(h => [h, [0, 0]]));
  const place = (h, x, y) => { off.set(h, [x, y]); h.style.translate = `${x}px ${y}px`; };

  function align() {
    const h = egg.moved, o = other(h), [a, b] = center(h), [c, d] = center(o), [x, y] = off.get(h);
    place(h, x + c - a, y + d - b);
    // Tip above the egg, hammer beside it (on whichever side has room)
    const r = o.getBoundingClientRect(), hr = hero.getBoundingClientRect();
    const left = r.left - hr.left, top = r.top - hr.top, flip = left + r.width / 2 > hr.width / 2;
    eggTip.style.left = left + r.width / 2 + "px";
    eggTip.style.top = top - 14 + "px";
    hammer.classList.toggle("flip", flip);
    hammer.style.left = (flip ? left - r.width * 0.55 : left + r.width * 0.75) + "px";
    hammer.style.top = top - r.height * 0.05 + "px";
  }
  function join(h) {
    egg.state = "joined"; egg.at = performance.now(); egg.moved = h;
    hero.classList.add("egg-joined");   // stops the floating so the halves line up exactly
    h.classList.add("snap");
    align();
    eggTip.hidden = hammer.hidden = false;
    void hammer.offsetWidth;
    eggTip.classList.add("show"); hammer.classList.add("show");
  }
  function hint(h) {
    h.classList.remove("wiggle"); void h.offsetWidth; h.classList.add("wiggle");
    setTimeout(() => h.classList.remove("wiggle"), 500);   // hand the transform back to the floating loop
  }
  function hit() {
    if (egg.state !== "joined" || performance.now() - egg.at < 400) return;   // ignore the click that ends the drag
    egg.hits++;
    hammer.classList.remove("swing"); void hammer.offsetWidth; hammer.classList.add("swing");
    setTimeout(() => {   // the blow lands mid-swing
      hero.dataset.cracks = Math.min(egg.hits, 3);
      halves.forEach(x => { x.classList.remove("shake"); void x.offsetWidth; x.classList.add("shake"); });
      if (egg.hits >= 3) smash();
    }, 170);
  }
  function smash() {
    egg.state = "broken"; egg.solved = true;
    eggTip.classList.remove("show"); hammer.classList.remove("show");
    const [cx0, cy0] = center(egg.home = other(egg.moved)), hr = hero.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("i"), ang = (i / 14) * Math.PI * 2 + Math.random() * 0.4, dist = 70 + Math.random() * 90;
      s.className = "shard";
      s.style.left = cx0 - hr.left + "px"; s.style.top = cy0 - hr.top + "px";
      s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      s.style.setProperty("--dy", Math.sin(ang) * dist + 40 + "px");
      s.style.setProperty("--r", (Math.random() * 540 - 270) + "deg");
      hero.appendChild(s);
      setTimeout(() => s.remove(), 1100);
    }
    halves.forEach(x => x.classList.add("burst"));
    setTimeout(openReveal, 650);
  }
  function openReveal() {
    reveal.hidden = false;
    void reveal.offsetWidth;
    reveal.classList.add("open");
    document.body.classList.add("lock");
    revealClose.focus();
  }
  function closeReveal() {
    if (reveal.hidden) return;
    reveal.classList.remove("open");
    document.body.classList.remove("lock");
    setTimeout(() => { reveal.hidden = true; resetEgg(); }, 400);
  }
  function resetEgg() {
    Object.assign(egg, { state: "apart", hits: 0, moved: null });
    eggTip.hidden = hammer.hidden = true;
    delete hero.dataset.cracks;
    hero.classList.remove("egg-joined");
    halves.forEach(h => { h.classList.remove("burst", "snap", "shake"); place(h, 0, 0); });
  }

  halves.forEach(h => {
    let drag = null;
    h.addEventListener("pointerdown", e => {
      if (egg.state !== "apart") return;
      const [x, y] = off.get(h);
      drag = { px: e.clientX, py: e.clientY, x, y, moved: false };
      h.setPointerCapture(e.pointerId);
      h.classList.add("dragging");
    });
    h.addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = e.clientX - drag.px, dy = e.clientY - drag.py;
      if (Math.hypot(dx, dy) > 4) drag.moved = true;
      place(h, drag.x + dx, drag.y + dy);
      other(h).classList.toggle("near", gap(h) < SNAP);
    });
    const end = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      h.classList.remove("dragging");
      other(h).classList.remove("near");
      if (gap(h) < SNAP) join(h);
      else if (!moved) hint(h);
    };
    h.addEventListener("pointerup", end);
    h.addEventListener("pointercancel", end);
    h.addEventListener("click", e => {
      if (egg.state === "joined") hit();
      else if (egg.state === "apart" && e.detail === 0) join(h);   // keyboard: Enter/Space joins straight away
    });
  });
  hammer.addEventListener("click", hit);
  revealClose.addEventListener("click", closeReveal);
  reveal.addEventListener("click", e => { if (e.target === reveal) closeReveal(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeReveal(); });
  addEventListener("resize", () => { if (egg.state === "joined") align(); });

  applyLang();
})();
