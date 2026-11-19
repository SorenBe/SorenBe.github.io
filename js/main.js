/* ==========================================================================
   MAIN — orchestration : boot, rendu des sections, interactions globales
   ========================================================================== */
(function () {
  const { $, $$, h, t, L, esc, state, toast, reducedMotion, sleep, rand, on } = App;

  /* ================= BOOT SEQUENCE ================= */
  async function boot() {
    const el = $("#boot"), log = $("#boot-log"), fill = $("#boot-fill");
    const seen = App.store.get("booted", false);
    if (reducedMotion || seen) { el.remove(); document.body.classList.remove("booting"); return; }
    document.body.classList.add("booting");
    let skip = false;
    const finish = () => { if (skip) return; skip = true; el.classList.add("done"); document.body.classList.remove("booting"); App.store.set("booted", true); setTimeout(() => el.remove(), 700); };
    addEventListener("keydown", finish, { once: true }); el.addEventListener("click", finish);
    const lines = [
      ["d", "ZIYAD-BIOS v26.04 — Copyright (c) 2021-2026 EMSI Rabat"],
      ["", "CPU: Engineer-class, 5 years @ MIAGE ......... <span class='ok'>OK</span>"],
      ["", "Memory test: 3 internships, 6 projects ........ <span class='ok'>OK</span>"],
      ["b", "[    0.000000] Linux version 6.8.0-ziyad (gcc 13.2)"],
      ["", "[    0.042133] Mounting /home/ziyad/experience ........ <span class='ok'>[ OK ]</span>"],
      ["", "[    0.118020] Starting docker.service ................. <span class='ok'>[ OK ]</span>"],
      ["", "[    0.204871] Starting kubelet.service ................ <span class='ok'>[ OK ]</span>"],
      ["", "[    0.311458] pve-cluster: quorum 3/3 — ceph HEALTH_OK  <span class='ok'>[ OK ]</span>"],
      ["", "[    0.402911] Loading skills graph (38 nodes) ......... <span class='ok'>[ OK ]</span>"],
      ["w", "[    0.455001] warn: candidate highly motivated — consider hiring"],
      ["", "[    0.512340] Reached target <b>portfolio.target</b>"],
    ];
    for (let i = 0; i < lines.length && !skip; i++) {
      const [c, txt] = lines[i];
      log.insertAdjacentHTML("beforeend", `<span class="${c}">${txt}</span>\n`);
      fill.style.width = ((i + 1) / lines.length) * 100 + "%";
      await sleep(rand(70, 150));
    }
    await sleep(350); finish();
  }

  /* ================= SCRAMBLE TEXT ================= */
  const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
  function scramble(el) {
    const final = el.dataset.text; if (reducedMotion) { el.textContent = final; return; }
    let frame = 0; const q = [...final].map((ch, i) => ({ ch, start: (Math.random() * 12) | 0, end: 12 + i * 2 + ((Math.random() * 10) | 0) }));
    const tick = () => {
      let done = 0, s = "";
      for (const o of q) {
        if (frame >= o.end) { s += o.ch; done++; }
        else if (frame >= o.start) s += o.ch === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else s += o.ch === " " ? " " : "";
      }
      el.textContent = s; frame++;
      if (done < q.length) setTimeout(tick, 28);
    };
    tick();
  }
  function scrambleAll() { $$(".scramble").forEach((el, i) => setTimeout(() => scramble(el), i * 180)); }

  /* ================= TYPED ROLES ================= */
  let typedTimer;
  function typed() {
    clearTimeout(typedTimer);
    const el = $("#typed"); const roles = t("hero.roles"); let r = 0, i = 0, del = false;
    const step = () => {
      const word = roles[r % roles.length];
      el.textContent = word.slice(0, i);
      if (!del && i < word.length) { i++; typedTimer = setTimeout(step, 55 + Math.random() * 50); }
      else if (!del) { del = true; typedTimer = setTimeout(step, 1800); }
      else if (i > 0) { i--; typedTimer = setTimeout(step, 28); }
      else { del = false; r++; typedTimer = setTimeout(step, 300); }
    };
    if (reducedMotion) el.textContent = roles[0]; else step();
  }

  /* ================= NEOFETCH ================= */
  App.neofetchText = function (forTerm) {
    const art = ["   ▄▄▄▄▄▄▄▄▄▄▄  ", "  █ ▄▄▄▄▄▄▄▄▄ █ ", "  █ █ ▀▀▀▀▀▀█ █ ", "  █ █    ▄▄▀  █ ", "  █ █  ▄▀     █ ", "  █ █▄█▄▄▄▄▄█ █ ", "  █▄▄▄▄▄▄▄▄▄▄▄█ ", "     ▀▀▀▀▀▀▀    "];
    const kv = [
      ["", `<span class="h">ziyad</span><span class="sep">@</span><span class="h">noc</span>`],
      ["", `<span class="sep">────────────────────</span>`],
      ["OS", L({ fr: "Ingénieur d'État 2026", en: "State Engineer 2026" })],
      ["Host", "EMSI Rabat · MIAGE"],
      ["Kernel", L({ fr: "Informatique & Réseaux", en: "CS & Networks" })],
      ["Uptime", L({ fr: "5 ans de cycle ingénieur", en: "5 years engineering school" })],
      ["Packages", L({ fr: "38 technos (graph)", en: "38 techs (graph)" })],
      ["Shell", "bash · python · java"],
      ["Cloud", "Docker · K8s · OpenShift"],
      ["Infra", "Proxmox VE · Ceph"],
      ["Locale", "fr_MA · ar_MA · en_US"],
      ["Status", `<span style="color:var(--ok)">● ${L({ fr: "disponible", en: "available" })}</span>`],
    ];
    if (forTerm) return art.map((a, i) => `<span class="t-g">${a}</span>  ${kv[i] ? (kv[i][0] ? `<span class="t-b">${kv[i][0]}</span>: ` : "") + kv[i][1].replace(/class="h"/g, 'class="t-g"').replace(/class="sep"/g, 'class="t-d"') : ""}`).concat(kv.slice(art.length).map((k) => " ".repeat(18) + `<span class="t-b">${k[0]}</span>: ${k[1]}`)).join("\n");
    return `<pre>${art.join("\n")}</pre><div>${kv.map(([k, v]) => (k ? `<span class="k">${k}</span>: ${v}` : v)).join("<br>")}<div class="palette-row">${["--bg-2", "--danger", "--ok", "--warn", "--accent-2", "--accent-3", "--accent", "--text"].map((c) => `<i style="background:var(${c})"></i>`).join("")}</div></div>`;
  };
  function renderNeofetch() { $("#neofetch").innerHTML = App.neofetchText(false); }

  /* ================= MARQUEE ================= */
  function renderMarquee() {
    const items = ["Java", "Python", "FastAPI", "Spring Boot", "React", "Docker", "Kubernetes", "OpenShift", "Proxmox VE", "Ceph", "PostgreSQL", "MongoDB", "GitHub Actions", "PyTorch", "TCP/IP", "OWASP", "Salesforce", "Grafana"];
    const track = $("#marquee"); track.innerHTML = "";
    for (let k = 0; k < 2; k++) items.forEach((i) => track.append(h("span", {}, i)));
  }

  /* ================= EXPERIENCE TIMELINE ================= */
  function renderTimeline() {
    const tl = $("#timeline"); tl.innerHTML = "";
    tl.append(h("div", { class: "timeline-fill", id: "timeline-fill" }));
    App.experiences.forEach((e, idx) => {
      const pid = "job-" + e.id;
      const mkTab = (key, name, sel, live) => h("button", { class: "tab", role: "tab", "aria-selected": sel ? "true" : "false", "aria-controls": pid + "-" + name, "data-panel": name }, live ? h("span", { class: "live" }) : null, t(key));
      const missions = h("div", { class: "panel", id: pid + "-missions", role: "tabpanel" }, h("ul", { class: "missions" }, L(e.missions).map((m) => h("li", {}, m))));
      const labBox = h("div");
      const lab = h("div", { class: "panel", id: pid + "-lab", role: "tabpanel", hidden: true }, labBox);
      const stack = h("div", { class: "panel", id: pid + "-stack", role: "tabpanel", hidden: true }, h("div", { class: "stack-tags" }, e.stack.map((s) => h("span", { class: "tag" }, s))));
      const job = h("article", { class: "job reveal", id: pid },
        h("header", { class: "job-head" },
          h("div", {}, h("h3", { class: "job-company" }, e.company), h("p", { class: "job-role" }, L(e.role) + " · " + L(e.domain))),
          h("div", { class: "job-meta" }, h("b", {}, L(e.period)), h("span", {}, L(e.place)))),
        h("div", { class: "tabs", role: "tablist" }, mkTab("exp.tab.missions", "missions", true), mkTab("exp.tab.lab", "lab", false, true), mkTab("exp.tab.stack", "stack", false)),
        missions, lab, stack);
      job.querySelector(".tabs").addEventListener("click", (ev) => {
        const b = ev.target.closest(".tab"); if (!b) return;
        job.querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
        [missions, lab, stack].forEach((p) => (p.hidden = p.id !== pid + "-" + b.dataset.panel));
        if (b.dataset.panel === "lab") { if (!labBox.dataset.mounted) { labBox.dataset.mounted = "1"; App.mountLab(e.lab, labBox); App.labStart(labBox); } else App.labStart(labBox); }
        else if (labBox.dataset.mounted) App.labStop(labBox);
      });
      job.style.setProperty("--d", idx * .08 + "s");
      tl.append(job);
    });
    observeReveal(tl);
  }
  function timelineProgress() {
    const tl = $("#timeline"), fill = $("#timeline-fill"); if (!tl || !fill) return;
    const r = tl.getBoundingClientRect(); const mid = innerHeight * .6;
    const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    fill.style.height = p * (r.height - 16) + "px";
    $$(".job", tl).forEach((j) => j.classList.toggle("lit", j.getBoundingClientRect().top + 36 < mid));
  }

  /* ================= SKILLS ================= */
  function renderSkills() {
    const filters = $("#skill-filters"); filters.innerHTML = "";
    const cols = $("#skill-columns"); cols.innerHTML = "";
    let current = null;
    const setF = (id) => {
      current = id; App.graphFilter && App.graphFilter(id);
      $$(".chip", filters).forEach((c) => c.classList.toggle("on", (c.dataset.id || null) === id));
      $$(".skill-col", cols).forEach((c) => c.classList.toggle("dim", !!id && c.dataset.id !== id));
    };
    filters.append(h("button", { class: "chip on", onclick: () => setF(null) }, t("skills.all")));
    App.skillCategories.forEach((c) => {
      filters.append(h("button", { class: "chip", "data-id": c.id, style: { "--c": c.color }, onclick: () => setF(current === c.id ? null : c.id) }, h("i"), L(c)));
      cols.append(h("div", { class: "skill-col reveal", "data-id": c.id, style: { "--c": c.color } }, h("h4", {}, h("i"), L(c)), h("div", {}, App.skills.filter((s) => s.c === c.id).map((s) => h("span", { class: "tag" }, App.state.lang === "en" && s.en ? s.en : s.n)))));
    });
    observeReveal(cols);
  }

  /* ================= PROJECTS ================= */
  const FLOWS = {
    micro: { fr: ["Client", "API Gateway", "Service A", "Service B", "Service C", "Données"], en: ["Client", "API Gateway", "Service A", "Service B", "Service C", "Data"], kind: "fan" },
    devsecops: { fr: ["Commit", "Build", "SAST", "Tests", "Image", "Déploiement"], en: ["Commit", "Build", "SAST", "Tests", "Image", "Deploy"] },
    face: { fr: ["Image A · B", "CNN partagé", "Embeddings", "Distance", "Même personne ?"], en: ["Image A · B", "Shared CNN", "Embeddings", "Distance", "Same person?"] },
    agri: { fr: ["Image", "Augmentation", "CNN", "Softmax", "Classe"], en: ["Image", "Augmentation", "CNN", "Softmax", "Class"] },
    nlp: { fr: ["Texte", "Nettoyage", "Tokenisation", "Vectorisation", "Classifieur", "Polarité"], en: ["Text", "Cleaning", "Tokenisation", "Vectorisation", "Classifier", "Polarity"] },
    ecom: { fr: ["Client", "Frontend", "API", "Base de données", "Back-office"], en: ["Customer", "Frontend", "API", "Database", "Back-office"] }
  };
  function flowSvg(id) {
    const f = FLOWS[id]; if (!f) return "";
    const steps = L(f); const n = steps.length; const W = 640, bw = Math.min(118, (W - 20) / n - 14), H = 110;
    const gap = (W - n * bw) / (n + 1);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="flow"><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--accent)"/></marker></defs>`;
    steps.forEach((label, i) => {
      const x = gap + i * (bw + gap), y = 30;
      s += `<rect x="${x}" y="${y}" width="${bw}" height="48" rx="10" fill="var(--surface)" stroke="${i === 0 || i === n - 1 ? "var(--accent)" : "var(--line-2)"}" stroke-width="1.5"/>`;
      s += `<text x="${x + bw / 2}" y="${y + 29}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="var(--text)">${esc(label)}</text>`;
      s += `<text x="${x + bw / 2}" y="${y - 10}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="var(--faint)">${String(i + 1).padStart(2, "0")}</text>`;
      if (i < n - 1) s += `<line x1="${x + bw + 3}" y1="${y + 24}" x2="${x + bw + gap - 4}" y2="${y + 24}" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#ah)" stroke-dasharray="4 3"><animate attributeName="stroke-dashoffset" from="14" to="0" dur="1s" repeatCount="indefinite"/></line>`;
    });
    return s + "</svg>";
  }

  function renderProjects() {
    const grid = $("#projects-grid"), filters = $("#project-filters");
    grid.innerHTML = ""; filters.innerHTML = "";
    let cur = null;
    const setF = (id) => {
      cur = id; $$(".chip", filters).forEach((c) => c.classList.toggle("on", (c.dataset.id || null) === id));
      $$(".project", grid).forEach((p) => p.classList.toggle("hidden", !!id && p.dataset.cat !== id));
    };
    filters.append(h("button", { class: "chip on", onclick: () => setF(null) }, t("proj.all")));
    App.projectCats.forEach((c) => filters.append(h("button", { class: "chip", "data-id": c.id, onclick: () => setF(cur === c.id ? null : c.id) }, L(c))));
    App.projects.forEach((p, i) => {
      const card = h("article", { class: "project reveal", "data-cat": p.cat, tabindex: "0", role: "button", "aria-label": L(p.title), style: { "--d": (i % 3) * .08 + "s" } },
        h("span", { class: "project-num" }, String(i + 1).padStart(2, "0")),
        h("div", { class: "project-icon", html: `<svg><use href="#i-${p.icon}"/></svg>` }),
        h("h3", {}, L(p.title)),
        h("p", {}, L(p.short)),
        h("div", { class: "project-tags" }, p.tags.map((tg) => h("span", { class: "tag" }, tg))),
        h("span", { class: "project-more", html: `${esc(t("proj.open"))} <svg><use href="#i-arrow"/></svg>` }));
      const open = () => openProject(p);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
      tiltCard(card);
      grid.append(card);
    });
    observeReveal(grid);
  }

  let lastFocus = null;
  function openProject(p) {
    lastFocus = document.activeElement;
    const m = $("#modal");
    $("#modal-body").innerHTML = `
      <div class="project-icon"><svg><use href="#i-${p.icon}"/></svg></div>
      <h3 id="modal-title">${esc(L(p.title))}</h3>
      <p>${esc(L(p.short))}</p>
      <h4>${esc(t("proj.challenge"))}</h4><p>${esc(L(p.challenge))}</p>
      <h4>${esc(t("proj.approach"))}</h4><p>${esc(L(p.approach))}</p>
      <div class="modal-diagram">${flowSvg(p.id)}</div>
      <h4>${esc(t("proj.stack"))}</h4><div class="project-tags">${p.tags.map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>`;
    m.hidden = false; document.body.style.overflow = "hidden";
    m.querySelector(".modal-x").focus();
  }
  function closeModal() { const m = $("#modal"); if (m.hidden) return; m.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus({ preventScroll: true }); }

  /* ================= EDUCATION ================= */
  function renderEducation() {
    const list = $("#edu-list"); list.innerHTML = "";
    App.education.forEach((e, i) => list.append(h("div", { class: "edu reveal", style: { "--d": i * .08 + "s" } },
      h("span", { class: "edu-year", html: e.period.replace(" – ", "<br>") }),
      h("h3", {}, L(e.title)), h("p", { class: "school" }, e.school), h("p", { class: "meta" }, e.period + " · " + e.place),
      L(e.detail) ? h("p", { class: "detail" }, L(e.detail)) : null)));
    $("#certs").innerHTML = ""; App.certs.forEach((c) => $("#certs").append(h("div", { class: "cert-group" }, h("h5", {}, L(c.group)), h("div", {}, c.items.map((i) => h("span", { class: "cert" }, i))))));
    $("#langs").innerHTML = ""; App.languages.forEach((l) => $("#langs").append(h("div", { class: "lang" }, h("div", { class: "lang-h" }, h("b", {}, L(l.n)), h("span", {}, L(l.lvl))), h("div", { class: "meter" }, h("i", { style: { "--v": l.v + "%" } })))));
    $("#soft").innerHTML = ""; L(App.softSkills).forEach((s) => $("#soft").append(h("li", {}, s)));
    $("#interests").innerHTML = ""; L(App.interests).forEach((s) => $("#interests").append(h("div", { class: "interest" }, h("b", {}, s.t), h("span", {}, s.d))));
    observeReveal(list);
  }

  /* ================= CONTACT ================= */
  function renderContact() {
    const P = App.profile;
    $("#email-text").textContent = P.email;
    $("#phone-text").textContent = P.phone;
    $("#phone-link").href = "tel:" + P.phoneRaw;
    const sel = $("#subject-select"); const prev = sel.selectedIndex; sel.innerHTML = "";
    t("contact.subjects").forEach((s) => sel.append(h("option", {}, s))); if (prev > 0) sel.selectedIndex = prev;
    const soc = $("#socials"); soc.innerHTML = "";
    [["LinkedIn", P.linkedin], ["GitHub", P.github]].filter(([, u]) => u).forEach(([n, u]) => soc.append(h("a", { class: "btn btn-ghost", href: u, target: "_blank", rel: "noopener", html: `<svg><use href="#i-link"/></svg>${n}` })));
  }
  function bindContact() {
    $("#copy-email").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(App.profile.email); } catch { const ta = h("textarea", {}, App.profile.email); document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
      toast(t("contact.copied"));
    });
    $("#contact-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target, name = f.name.value.trim(), msg = f.message.value.trim();
      [f.name, f.message].forEach((x) => x.classList.toggle("invalid", !x.value.trim()));
      if (!name || !msg) { toast(t("contact.required")); setTimeout(() => $$(".invalid", f).forEach((x) => x.classList.remove("invalid")), 600); return; }
      const company = f.company.value.trim();
      const subject = `${f.subject.value} — ${name}${company ? " (" + company + ")" : ""}`;
      const body = `${msg}\n\n— ${name}${company ? "\n" + company : ""}`;
      toast(t("contact.opening"));
      location.href = `mailto:${App.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ================= REVEAL / COUNTERS ================= */
  const revealIO = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); revealIO.unobserve(e.target);
    $$(".count", e.target).concat(e.target.matches(".count") ? [e.target] : []).forEach(countUp);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  function observeReveal(root = document) { $$(".reveal:not(.in)", root).forEach((el) => revealIO.observe(el)); }
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = +el.dataset.to, suf = el.dataset.suffix || ""; const t0 = performance.now(), dur = 1400;
    const step = (now) => { const p = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 4))); el.textContent = v + suf; if (p < 1) requestAnimationFrame(step); };
    reducedMotion ? (el.textContent = to + suf) : requestAnimationFrame(step);
  }

  /* ================= SCROLL: progress, header, nav ================= */
  function bindScroll() {
    const bar = $("#progress"), top = $("#topbar"), links = $$(".nav a"), ind = $("#nav-indicator");
    const sections = links.map((a) => $(a.getAttribute("href")));
    let lastY = scrollY, ticking = false;
    const moveInd = (a) => { if (!a) { ind.style.opacity = 0; return; } ind.style.opacity = 1; ind.style.width = a.offsetWidth + "px"; ind.style.transform = `translateX(${a.offsetLeft}px)`; };
    const update = () => {
      ticking = false;
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      top.classList.toggle("scrolled", y > 20);
      top.classList.toggle("hide", y > lastY && y > 400 && !$("#nav").classList.contains("open"));
      lastY = y;
      let active = null;
      sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) active = links[i]; });
      links.forEach((a) => a.classList.toggle("active", a === active));
      moveInd(active);
      if (!App._termCwdSet) $("#logo-path").textContent = active ? "~/" + active.getAttribute("href").slice(1) : "~";
      timelineProgress();
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update);
    on("lang", () => setTimeout(update, 50));
    update();
    // menu mobile
    const burger = $("#burger"), nav = $("#nav");
    burger.addEventListener("click", () => { const o = !nav.classList.contains("open"); nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); });
    links.forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));
  }

  /* ================= CURSOR / MAGNETIC / TILT ================= */
  function bindCursor() {
    if (matchMedia("(hover: none), (pointer: coarse)").matches) return;
    const c = $("#cursor"), d = $("#cursor-dot"); let x = 0, y = 0, cx = 0, cy = 0;
    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY; d.style.transform = `translate(${x}px,${y}px)`; document.body.classList.add("has-cursor");
      const tgt = e.target;
      document.body.classList.toggle("cursor-text", !!tgt.closest("input, textarea, .term-body"));
      document.body.classList.toggle("cursor-hover", !!tgt.closest("a, button, .project, .pve-node, .pod, select, [data-cmd]") && !tgt.closest("input, textarea"));
    });
    document.addEventListener("pointerleave", () => document.body.classList.remove("has-cursor"));
    const loop = () => { cx += (x - cx) * .18; cy += (y - cy) * .18; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); };
    loop();
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
    const pw = $(".photo-wrap");
    if (pw) {
      $("#hero").addEventListener("pointermove", (e) => { const r = pw.getBoundingClientRect(); const rx = (e.clientY - r.top - r.height / 2) / r.height, ry = (e.clientX - r.left - r.width / 2) / r.width; pw.style.transform = `perspective(900px) rotateX(${-rx * 10}deg) rotateY(${ry * 12}deg)`; });
      $("#hero").addEventListener("pointerleave", () => (pw.style.transform = ""));
    }
  }
  function tiltCard(card) {
    if (matchMedia("(hover: none)").matches || reducedMotion) return;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(.5 - py) * 8}deg) rotateY(${(px - .5) * 10}deg) translateZ(0)`;
      card.style.setProperty("--mx", px * 100 + "%"); card.style.setProperty("--my", py * 100 + "%");
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  }

  /* ================= COMMAND PALETTE ================= */
  function paletteItems() {
    const go = (id) => () => $("#" + id).scrollIntoView({ behavior: "smooth" });
    const items = [
      ...["about", "experience", "skills", "projects", "terminal", "education", "contact"].map((id) => ({ icon: "#", label: t("nav." + id), hint: "section", run: go(id) })),
      ...App.experiences.map((e) => ({ icon: "▸", label: e.company + " — " + L(e.role), hint: "lab", run: () => { const j = $("#job-" + e.id); j.scrollIntoView({ behavior: "smooth", block: "center" }); j.querySelector('[data-panel="lab"]').click(); } })),
      ...App.projects.map((p) => ({ icon: "◆", label: L(p.title), hint: L({ fr: "projet", en: "project" }), run: () => openProject(p) })),
      { icon: "◐", label: L({ fr: "Basculer le thème", en: "Toggle theme" }), hint: "T", run: () => App.setTheme(state.theme === "dark" ? "light" : "dark") },
      { icon: "文", label: L({ fr: "Switch to English", en: "Passer en français" }), hint: "L", run: () => App.setLang(state.lang === "fr" ? "en" : "fr") },
      { icon: "↓", label: t("hero.cta.cv"), hint: "PDF", run: () => window.open(App.profile.cv, "_blank") },
      { icon: "@", label: t("contact.copy") + " — " + App.profile.email, hint: "mail", run: () => $("#copy-email").click() },
      { icon: ">", label: "Terminal: neofetch", hint: "cmd", run: () => App.termExec("neofetch") },
      { icon: ">", label: "Terminal: sudo hire-me", hint: "cmd", run: () => App.termExec("sudo hire-me") },
      { icon: "▒", label: "Matrix", hint: "fx", run: () => App.toggleMatrix() },
    ];
    return items;
  }
  function bindPalette() {
    const pal = $("#palette"), inp = $("#palette-input"), list = $("#palette-list");
    let items = [], sel = 0, shown = [];
    const fuzzy = (q, s) => { q = q.toLowerCase(); s = s.toLowerCase(); let i = 0, score = 0; for (const ch of s) { if (ch === q[i]) { i++; score++; } } return i === q.length ? score / s.length + (s.includes(q) ? 1 : 0) : -1; };
    const render = () => {
      const q = inp.value.trim();
      shown = q ? items.map((it) => [it, fuzzy(q, it.label)]).filter(([, s]) => s >= 0).sort((a, b) => b[1] - a[1]).map(([it]) => it) : items;
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      list.innerHTML = "";
      if (!shown.length) { list.append(h("li", { class: "empty" }, t("palette.empty"))); return; }
      shown.forEach((it, i) => { const li = h("li", { role: "option", "aria-selected": i === sel ? "true" : "false" }, h("span", { class: "pi" }, it.icon), it.label, h("small", {}, it.hint)); li.addEventListener("click", () => run(it)); li.addEventListener("pointermove", () => { if (sel !== i) { sel = i; render(); } }); list.append(li); });
      list.children[sel]?.scrollIntoView({ block: "nearest" });
    };
    const open = () => { items = paletteItems(); inp.placeholder = t("palette.placeholder"); inp.value = ""; sel = 0; pal.hidden = false; render(); inp.focus(); };
    const close = () => { pal.hidden = true; };
    const run = (it) => { close(); setTimeout(it.run, 60); };
    App.openPalette = open;
    $("#open-palette").addEventListener("click", open);
    pal.addEventListener("click", (e) => { if (e.target.matches("[data-close]")) close(); });
    inp.addEventListener("input", () => { sel = 0; render(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % shown.length; render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % shown.length; render(); }
      else if (e.key === "Enter" && shown[sel]) run(shown[sel]);
      else if (e.key === "Escape") close();
    });
  }

  /* ================= KEYBOARD GLOBAL + KONAMI ================= */
  function bindKeys() {
    const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]; let kp = 0;
    addEventListener("keydown", (e) => {
      const typing = e.target.closest("input, textarea, select");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#palette").hidden ? App.openPalette() : ($("#palette").hidden = true); return; }
      if (e.key === "Escape") { closeModal(); $("#palette").hidden = true; }
      if (!typing) {
        if (e.key === "/") { e.preventDefault(); App.openPalette(); }
        else if (e.key === "t" && !e.ctrlKey && !e.metaKey) App.setTheme(state.theme === "dark" ? "light" : "dark");
        else if (e.key === "l" && !e.ctrlKey && !e.metaKey) App.setLang(state.lang === "fr" ? "en" : "fr");
      }
      kp = e.key === KONAMI[kp] ? kp + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (kp === KONAMI.length) { kp = 0; const onNoc = document.body.classList.toggle("noc"); App.netTrafficFactor = onNoc ? 5 : 1; App.emit("theme"); toast(t("toast.konami")); App.confetti(); }
    });
    $("#modal").addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  }

  /* ================= MATRIX + CONFETTI ================= */
  let matrixOn = false, matrixRaf = 0;
  App.toggleMatrix = function () {
    const cv = $("#matrix"); matrixOn = !matrixOn; cv.classList.toggle("on", matrixOn);
    if (!matrixOn) { setTimeout(() => cancelAnimationFrame(matrixRaf), 600); return; }
    const { ctx, w, h: H } = App.fitCanvas(cv); const fs = 15, cols = Math.ceil(w / fs); const drops = Array(cols).fill(0).map(() => Math.random() * -50);
    const chars = "アイウエオカキクケコサシスセソ0123456789ZIYADDEVOPS<>/{}";
    const loop = () => {
      ctx.fillStyle = "rgba(0,0,0,.08)"; ctx.fillRect(0, 0, w, H);
      ctx.fillStyle = App.css("--accent"); ctx.font = fs + "px JetBrains Mono, monospace";
      drops.forEach((y, i) => { ctx.fillText(chars[(Math.random() * chars.length) | 0], i * fs, y * fs); drops[i] = y * fs > H && Math.random() > .975 ? 0 : y + 1; });
      matrixRaf = requestAnimationFrame(loop);
    };
    ctx.clearRect(0, 0, w, H); loop();
    setTimeout(() => matrixOn && App.toggleMatrix(), 7000);
  };
  App.confetti = function () {
    if (reducedMotion) return;
    const cv = h("canvas", { style: { position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 960, pointerEvents: "none" } }); document.body.append(cv);
    const { ctx, w, h: H } = App.fitCanvas(cv);
    const cols = [App.css("--accent"), App.css("--accent-2"), App.css("--accent-3"), App.css("--warn")];
    const ps = Array.from({ length: 160 }, () => ({ x: w / 2, y: H * .6, vx: rand(-9, 9), vy: rand(-16, -6), r: rand(3, 7), c: cols[(Math.random() * 4) | 0], a: rand(0, 6), va: rand(-.3, .3) }));
    let f = 0; const loop = () => { ctx.clearRect(0, 0, w, H); ps.forEach((p) => { p.vy += .42; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); ctx.restore(); }); if (++f < 180) requestAnimationFrame(loop); else cv.remove(); };
    loop();
  };

  /* ================= LATENCY (footer) ================= */
  function latency() {
    const el = $("#latency"); const t0 = performance.now();
    fetch(location.href, { method: "HEAD", cache: "no-store" }).then(() => (el.textContent = Math.round(performance.now() - t0))).catch(() => (el.textContent = (rand(8, 24)).toFixed(0)));
  }

  /* ================= LANG RE-RENDER ================= */
  function renderDynamic() {
    renderNeofetch(); renderSkills(); renderProjects(); renderEducation(); renderContact(); typed();
    // timeline : on préserve les labs montés en les remontant dans la nouvelle langue
    const openTabs = {}; $$(".job").forEach((j) => (openTabs[j.id] = j.querySelector('.tab[aria-selected="true"]')?.dataset.panel));
    $$(".job [data-mounted]").forEach((box) => App.labStop(box));
    renderTimeline();
    Object.entries(openTabs).forEach(([id, panel]) => { if (panel && panel !== "missions") $(`#${id} [data-panel="${panel}"]`)?.click(); });
    $$(".job").forEach((j) => j.classList.add("in"));
    $$("#skill-columns .reveal, #projects-grid .reveal, #edu-list .reveal").forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in"); });
  }

  /* ================= INIT ================= */
  function init() {
    document.documentElement.dataset.theme = state.theme;
    App.applyI18n();
    $("#year").textContent = new Date().getFullYear();
    renderMarquee(); renderNeofetch(); renderTimeline(); renderSkills(); renderProjects(); renderEducation(); renderContact();
    bindContact(); bindScroll(); bindCursor(); bindPalette(); bindKeys();
    observeReveal();
    typed();
    App.initNetwork(); App.initGraph(); App.initTerminal();
    $("#lang-toggle").addEventListener("click", () => App.setLang(state.lang === "fr" ? "en" : "fr"));
    $("#theme-toggle").addEventListener("click", () => App.setTheme(state.theme === "dark" ? "light" : "dark"));
    on("lang", renderDynamic);
    latency(); setInterval(latency, 15000);
    boot().then(() => { if (!document.body.classList.contains("booting")) scrambleAll(); });
    console.log("%czb@noc%c — Salut, curieux·se ! Tapez App.termExec('help') ou ouvrez la palette avec Ctrl+K.", "color:#3ee8c5;font-weight:700", "color:inherit");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
