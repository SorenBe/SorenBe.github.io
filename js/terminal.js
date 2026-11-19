/* ==========================================================================
   TERMINAL — shell interactif : système de fichiers virtuel, historique,
   auto-complétion, pipes simples (| grep), commandes réseau simulées
   ========================================================================== */
(function () {
  const { esc, t, L, sleep, rand } = App;

  App.initTerminal = function () {
    const body = document.getElementById("term-body");
    const out = document.getElementById("term-out");
    const input = document.getElementById("term-in");
    const ps1El = document.getElementById("term-ps1");
    const ghost = document.getElementById("term-ghost");
    if (!body) return;

    let cwd = "~";
    const history = App.store.get("termHistory", []);
    let hIdx = history.length;
    let busy = false;
    const P = App.profile;
    const fr = () => App.state.lang === "fr";

    /* ---- système de fichiers virtuel ---- */
    function fs() {
      return {
        "~": ["about.txt", "contact.txt", "cv.pdf", "experience/", "projects/", "skills.json", "certifications.md", ".secret"],
        "~/experience": App.experiences.map((e) => e.id + ".md"),
        "~/projects": App.projects.map((p) => p.id + ".md")
      };
    }
    function readFile(path) {
      const name = path.replace(/^~\//, "").replace(/^\.\//, "");
      const full = cwd === "~" ? name : cwd.slice(2) + "/" + name;
      const n = full.replace(/^~\//, "");
      if (n === "about.txt") return [L({ fr: "Ingénieur d'État en Informatique & Réseaux — Diplômé MIAGE (EMSI, 2021–2026).", en: "State-certified Engineer in Computer Science & Networks — MIAGE graduate (EMSI, 2021–2026)." }), "", stripHtml(t("about.p1")), "", t("about.p2"), "", t("about.p3")].join("\n");
      if (n === "contact.txt") return `email    : <span class="t-link" data-cmd="email">${esc(P.email)}</span>\nphone    : ${esc(P.phone)}\nlocation : ${esc(L({ fr: "Maroc — mobilité internationale", en: "Morocco — open to relocation" }))}\nmode     : ${esc(L({ fr: "Présentiel / Hybride / Télétravail", en: "On-site / Hybrid / Remote" }))}`;
      if (n === "skills.json") {
        const obj = {}; App.skillCategories.forEach((c) => (obj[c.en] = App.skills.filter((s) => s.c === c.id).map((s) => s.n)));
        return colorJson(JSON.stringify(obj, null, 2));
      }
      if (n === "certifications.md") return App.certs.map((c) => `<span class="t-p">## ${esc(L(c.group))}</span>\n` + c.items.map((i) => `  <span class="t-g">✓</span> ${esc(i)}`).join("\n")).join("\n\n");
      if (n === ".secret") return `<span class="t-y">${L({ fr: "Indice : essayez « sudo hire-me » ou le code Konami (↑↑↓↓←→←→BA).", en: "Hint: try “sudo hire-me” or the Konami code (↑↑↓↓←→←→BA)." })}</span>`;
      if (n === "cv.pdf") { setTimeout(() => window.open(P.cv, "_blank"), 300); return `<span class="t-d">${L({ fr: "ouverture de cv.pdf…", en: "opening cv.pdf…" })}</span>`; }
      let m = n.match(/^experience\/(\w+)\.md$/);
      if (m) { const e = App.experiences.find((x) => x.id === m[1]); if (e) return expMd(e); }
      m = n.match(/^projects\/(\w+)\.md$/);
      if (m) { const p = App.projects.find((x) => x.id === m[1]); if (p) return projMd(p); }
      return null;
    }
    const stripHtml = (s) => s.replace(/<[^>]+>/g, "");
    const expMd = (e) => `<span class="t-w"># ${esc(e.company)}</span> — <span class="t-g">${esc(L(e.role))}</span>\n<span class="t-d">${esc(L(e.period))} · ${esc(L(e.place))}</span>\n\n` + L(e.missions).map((m) => `  <span class="t-b">▸</span> ${esc(m)}`).join("\n") + `\n\n<span class="t-d">stack:</span> ${e.stack.map((s) => `<span class="t-y">${esc(s)}</span>`).join(", ")}`;
    const projMd = (p) => `<span class="t-w"># ${esc(L(p.title))}</span>\n\n<span class="t-p">${esc(t("proj.challenge"))}</span>\n  ${esc(L(p.challenge))}\n<span class="t-p">${esc(t("proj.approach"))}</span>\n  ${esc(L(p.approach))}\n\n<span class="t-d">tags:</span> ${p.tags.map((s) => `<span class="t-y">${esc(s)}</span>`).join(", ")}`;
    const colorJson = (s) => esc(s).replace(/(&quot;[^&]+&quot;)(\s*:)/g, '<span class="t-b">$1</span>$2').replace(/:\s(&quot;[^&]*&quot;)/g, ': <span class="t-g">$1</span>').replace(/^(\s+)(&quot;[^&]*&quot;)(,?)$/gm, '$1<span class="t-g">$2</span>$3');

    /* ---- commandes ---- */
    const C = {
      help: { d: { fr: "liste des commandes", en: "list commands" }, run: () => {
        const rows = Object.entries(C).filter(([, v]) => !v.hidden).map(([k, v]) => `  <span class="t-g">${k.padEnd(13)}</span><span class="t-d">${esc(L(v.d))}</span>`);
        return `<span class="t-w">${L({ fr: "Commandes disponibles", en: "Available commands" })}</span>\n${rows.join("\n")}\n\n<span class="t-d">${L({ fr: "Astuces : Tab = complétion · ↑/↓ = historique · Ctrl+L = effacer · cmd | grep motif", en: "Tips: Tab = complete · ↑/↓ = history · Ctrl+L = clear · cmd | grep pattern" })}</span>`;
      } },
      whoami: { d: { fr: "qui suis-je", en: "who am I" }, run: () => `<span class="t-w">${esc(P.name)}</span>\n${L({ fr: "Ingénieur d'État — Informatique & Réseaux (MIAGE)", en: "State-certified Engineer — Computer Science & Networks (MIAGE)" })}\n<span class="t-g">● ${esc(t("hero.status"))}</span>` },
      neofetch: { d: { fr: "fiche système", en: "system info" }, run: () => App.neofetchText(true) },
      ls: { d: { fr: "lister les fichiers", en: "list files" }, run: (a) => {
        const all = a.includes("-a") || a.includes("-la");
        const dir = a.filter((x) => !x.startsWith("-"))[0];
        const target = dir ? (dir.startsWith("~") ? dir.replace(/\/$/, "") : (cwd + "/" + dir).replace(/\/$/, "")) : cwd;
        const list = fs()[target]; if (!list) return `<span class="t-r">ls: ${esc(dir)}: No such file or directory</span>`;
        return list.filter((f) => all || !f.startsWith(".")).map((f) => f.endsWith("/") ? `<span class="t-b">${f}</span>` : f.startsWith(".") ? `<span class="t-d">${f}</span>` : f.endsWith(".pdf") ? `<span class="t-r">${f}</span>` : f).join("   ");
      } },
      cd: { d: { fr: "changer de dossier", en: "change directory" }, run: (a) => {
        const d = (a[0] || "~").replace(/\/$/, "");
        if (d === "~" || d === ".." || d === "/") { cwd = "~"; }
        else { const target = d.startsWith("~") ? d : cwd + "/" + d; if (!fs()[target]) return `<span class="t-r">cd: ${esc(d)}: No such directory</span>`; cwd = target; }
        renderPs1(); document.getElementById("logo-path").textContent = cwd; return "";
      } },
      pwd: { d: { fr: "dossier courant", en: "current directory" }, run: () => "/home/ziyad" + cwd.slice(1) },
      cat: { d: { fr: "afficher un fichier", en: "print a file" }, run: (a) => { if (!a[0]) return `<span class="t-r">cat: missing operand</span>`; const r = readFile(a[0]); return r ?? `<span class="t-r">cat: ${esc(a[0])}: No such file</span>`; } },
      experience: { d: { fr: "parcours professionnel", en: "work history" }, run: () => App.experiences.map(expMd).join("\n\n<span class=\"t-d\">────────────────────────────────────────</span>\n\n") },
      projects: { d: { fr: "projets académiques", en: "academic projects" }, run: () => App.projects.map((p, i) => `<span class="t-d">${String(i + 1).padStart(2, "0")}</span> <span class="t-w">${esc(L(p.title))}</span> <span class="t-d">—</span> ${esc(L(p.short))}`).join("\n") + `\n\n<span class="t-d">cat projects/&lt;id&gt;.md · ids: ${App.projects.map((p) => p.id).join(", ")}</span>` },
      skills: { d: { fr: "compétences techniques", en: "tech skills" }, run: (a) => {
        const f = a[0]?.toLowerCase();
        return App.skillCategories.filter((c) => !f || c.id === f || L(c).toLowerCase().includes(f)).map((c) => `<span style="color:${c.color}">■</span> <span class="t-w">${esc(L(c)).padEnd(20)}</span>${App.skills.filter((s) => s.c === c.id).map((s) => esc(s.n)).join(", ")}`).join("\n");
      } },
      education: { d: { fr: "formation", en: "education" }, run: () => App.education.map((e) => `<span class="t-w">${esc(L(e.title))}</span>\n  ${esc(e.school)} <span class="t-d">· ${e.period} · ${e.place}</span>`).join("\n") },
      contact: { d: { fr: "me contacter", en: "get in touch" }, run: () => readFile("contact.txt") },
      email: { d: { fr: "écrire un e-mail", en: "send an e-mail" }, run: () => { setTimeout(() => (location.href = "mailto:" + P.email), 400); return `<span class="t-d">${L({ fr: "ouverture du client mail…", en: "opening mail client…" })}</span>`; } },
      cv: { d: { fr: "ouvrir le CV (PDF)", en: "open résumé (PDF)" }, run: () => readFile("cv.pdf") },
      goto: { d: { fr: "aller à une section", en: "jump to a section" }, run: (a) => { const s = document.getElementById(a[0]); if (!s) return `<span class="t-d">goto: about | experience | skills | projects | education | contact</span>`; s.scrollIntoView({ behavior: "smooth" }); return `→ #${esc(a[0])}`; } },
      theme: { d: { fr: "thème clair/sombre", en: "light/dark theme" }, run: (a) => { App.setTheme(a[0] || (App.state.theme === "dark" ? "light" : "dark")); return `theme = ${App.state.theme}`; } },
      lang: { d: { fr: "changer la langue (fr|en)", en: "switch language (fr|en)" }, run: (a) => { App.setLang(a[0] || (fr() ? "en" : "fr")); return `lang = ${App.state.lang}`; } },
      ping: { d: { fr: "tester la latence", en: "test latency" }, run: async (a) => {
        const host = a[0] || "recruiter.local";
        print(`PING ${esc(host)} (10.0.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}) 56(84) bytes of data.`);
        const times = [];
        for (let i = 1; i <= 4; i++) { await sleep(450); const ms = rand(8, 26); times.push(ms); print(`64 bytes from ${esc(host)}: icmp_seq=${i} ttl=57 time=${ms.toFixed(1)} ms`); }
        const avg = times.reduce((x, y) => x + y) / 4;
        return `\n--- ${esc(host)} ping statistics ---\n4 packets transmitted, 4 received, <span class="t-g">0% packet loss</span>\nrtt min/avg/max = ${Math.min(...times).toFixed(1)}/${avg.toFixed(1)}/${Math.max(...times).toFixed(1)} ms`;
      } },
      traceroute: { d: { fr: "chemin réseau jusqu'à moi", en: "network path to me" }, run: async () => {
        const hops = ["gateway.local", "isp-core.casablanca", "ix.rabat.ma", "emsi.edu.ma", "cma-cgm.logistics", "emerge-invest.pve", "smb-industries.fr", "ziyad.noc"];
        print("traceroute to ziyad.noc, 30 hops max");
        for (let i = 0; i < hops.length; i++) { await sleep(320); print(` ${String(i + 1).padStart(2)}  <span class="${i === hops.length - 1 ? "t-g" : ""}">${hops[i].padEnd(22)}</span> ${rand(1 + i * 3, 4 + i * 4).toFixed(2)} ms`); }
        return `<span class="t-g">${L({ fr: "destination atteinte ✓", en: "destination reached ✓" })}</span>`;
      } },
      "docker": { d: { fr: "docker ps", en: "docker ps" }, run: (a) => {
        if (a[0] !== "ps") return `<span class="t-d">usage: docker ps</span>`;
        return `<span class="t-w">CONTAINER ID   IMAGE                   STATUS          PORTS</span>\n3f9a1c2b7d01   fastapi-api:latest      Up 2 years      0.0.0.0:8000->8000/tcp\n8c2e5f1a9b44   react-frontend:latest   Up 2 years      0.0.0.0:3000->80/tcp\n1b7d3e9f0c22   postgres:16             Up 2 years      5432/tcp\n<span class="t-g">a4c1e8d2f6b9   ziyad/engineer:2026     Up, healthy     0.0.0.0:443->hire/tcp</span>`;
      } },
      kubectl: { d: { fr: "kubectl get pods", en: "kubectl get pods" }, run: (a) => {
        if (a.join(" ") !== "get pods" && a.join(" ") !== "get po") return `<span class="t-d">usage: kubectl get pods</span>`;
        const rows = [["skills-backend-7d9f8", "Spring Boot · FastAPI · Django"], ["skills-frontend-5c2a1", "React · React Native · Tailwind"], ["skills-devops-9e4b7", "Docker · K8s · OpenShift · Proxmox · Ceph"], ["skills-data-2f8c3", "PostgreSQL · MongoDB · Oracle"], ["skills-ai-6a1d9", "PyTorch · NLP · Siamese nets"], ["skills-net-4b7e2", "TCP/IP · Wireshark · OWASP"]];
        return `<span class="t-w">NAME                     READY   STATUS    RESTARTS   NOTES</span>\n` + rows.map(([n, d]) => `${n.padEnd(25)}1/1     <span class="t-g">Running</span>   0          <span class="t-d">${d}</span>`).join("\n");
      } },
      ceph: { d: { fr: "ceph -s", en: "ceph -s" }, run: () => `  cluster:\n    id:     ziyad-hci\n    health: <span class="t-g">HEALTH_OK</span>\n\n  services:\n    mon: 3 daemons, quorum pve-01,pve-02,pve-03\n    osd: 6 osds: 6 up, 6 in\n\n  data:\n    pools:   1 pools, 128 pgs\n    pgs:     128 active+clean` },
      history: { d: { fr: "historique", en: "history" }, run: () => history.map((c, i) => `${String(i + 1).padStart(4)}  ${esc(c)}`).join("\n") || "<span class=\"t-d\">(empty)</span>" },
      date: { d: { fr: "date", en: "date" }, run: () => new Date().toString() },
      echo: { d: { fr: "afficher du texte", en: "print text" }, run: (a) => esc(a.join(" ")) },
      clear: { d: { fr: "effacer l'écran", en: "clear screen" }, run: () => { out.innerHTML = ""; return ""; } },
      matrix: { d: { fr: "…", en: "…" }, run: () => { App.toggleMatrix(); return `<span class="t-g">${L({ fr: "Suivez le lapin blanc.", en: "Follow the white rabbit." })}</span>`; } },
      sudo: { d: { fr: "…", en: "…" }, hidden: true, run: async (a) => {
        if (a.join(" ") === "hire-me" || a.join(" ") === "hire ziyad") {
          print(`[sudo] password for recruiter: ********`);
          await sleep(600); print(`<span class="t-g">✓ access granted</span>`);
          for (const s of ["Verifying engineering degree", "Loading 3 internships", "Compiling skills", "Provisioning motivation"]) { await sleep(380); print(`  ${s}… <span class="t-g">done</span>`); }
          App.confetti && App.confetti();
          return `\n<span class="t-w">${L({ fr: "Excellent choix. Écrivez-moi :", en: "Great choice. Reach me at:" })}</span> <span class="t-link" data-cmd="email">${esc(P.email)}</span>`;
        }
        return `<span class="t-r">${L({ fr: "recruiter n'est pas dans le fichier sudoers. Cet incident sera signalé. (essayez « sudo hire-me »)", en: "recruiter is not in the sudoers file. This incident will be reported. (try “sudo hire-me”)" })}</span>`;
      } },
      rm: { hidden: true, run: (a) => a.includes("-rf") ? `<span class="t-r">${L({ fr: "Bien tenté. Ce portfolio est en haute disponibilité. 😉", en: "Nice try. This portfolio is highly available. 😉" })}</span>` : `<span class="t-d">rm: permission denied</span>` },
      exit: { hidden: true, run: () => `<span class="t-d">${L({ fr: "Il n'y a pas d'échappatoire. Tapez « contact ».", en: "There is no escape. Type “contact”." })}</span>` },
      vim: { hidden: true, run: () => `<span class="t-d">${L({ fr: "Pour quitter vim : :q! … ah, vous n'êtes pas dedans. Ouf.", en: "To exit vim: :q! … oh, you're not in it. Phew." })}</span>` }
    };
    C.ll = { hidden: true, run: () => C.ls.run(["-la"]) };

    /* ---- rendu ---- */
    function renderPs1() { ps1El.innerHTML = `<span class="t-g">recruiter@ziyad</span><span class="t-d">:</span><span class="t-b">${cwd}</span><span class="t-d">$ </span>`; }
    function print(html, cls) { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; out.append(d); body.scrollTop = body.scrollHeight; }
    function echoCmd(cmd) { print(`${ps1El.innerHTML}${esc(cmd)}`); }

    async function exec(line) {
      line = line.trim();
      echoCmd(line);
      if (!line) return;
      history.push(line); if (history.length > 50) history.shift(); App.store.set("termHistory", history); hIdx = history.length;
      const [main, grepPart] = line.split(/\s*\|\s*grep\s+/);
      const parts = (main.match(/(?:[^\s"]+|"[^"]*")+/g) || [""]).map((s) => s.replace(/^"|"$/g, ""));
      const name = parts[0].toLowerCase(), args = parts.slice(1);
      const cmd = C[name];
      if (!cmd) { print(`<span class="t-r">${esc(name)}: command not found</span> <span class="t-d">— ${L({ fr: "tapez", en: "type" })} help</span>`); return; }
      busy = true; input.disabled = true;
      try {
        let res = await cmd.run(args);
        if (res && grepPart) { const re = new RegExp(grepPart.replace(/[.*+?^${}()[\]\\]/g, "\\$&"), "i"); res = res.split("\n").filter((l) => re.test(stripHtml(l))).map((l) => l.replace(new RegExp(`(${re.source})(?![^<]*>)`, "gi"), '<span class="t-y">$1</span>')).join("\n"); }
        if (res) print(res);
      } catch (e) { print(`<span class="t-r">error: ${esc(e.message)}</span>`); }
      busy = false; input.disabled = false; input.focus({ preventScroll: true });
    }

    function complete(v) {
      const parts = v.split(" ");
      if (parts.length === 1) return Object.keys(C).filter((k) => !C[k].hidden && k.startsWith(parts[0]));
      const last = parts[parts.length - 1];
      const files = (fs()[cwd] || []).concat(parts[0] === "goto" ? ["about", "experience", "skills", "projects", "education", "contact"] : []);
      return files.filter((f) => f.startsWith(last)).map((f) => parts.slice(0, -1).concat(f).join(" "));
    }
    function updateGhost() {
      const v = input.value; ghost.textContent = "";
      if (!v) return;
      const m = complete(v); if (m.length !== 1 || m[0] === v) return;
      const meas = document.createElement("span"); meas.style.cssText = "visibility:hidden;white-space:pre;position:absolute"; meas.textContent = v; input.parentNode.append(meas);
      ghost.style.left = (ps1El.offsetWidth + meas.offsetWidth) + "px"; meas.remove();
      ghost.textContent = m[0].slice(v.length);
    }

    input.addEventListener("input", updateGhost);
    input.addEventListener("keydown", (e) => {
      if (busy) return;
      if (e.key === "Enter") { const v = input.value; input.value = ""; ghost.textContent = ""; exec(v); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (hIdx > 0) input.value = history[--hIdx]; updateGhost(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; updateGhost(); }
      else if (e.key === "Tab") {
        e.preventDefault(); const m = complete(input.value);
        if (m.length === 1) input.value = m[0] + (m[0].endsWith("/") ? "" : " ");
        else if (m.length > 1) { echoCmd(input.value); print(m.map((x) => x.split(" ").pop()).join("   ")); }
        updateGhost();
      }
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.innerHTML = ""; }
      else if (e.key === "c" && e.ctrlKey && !getSelection().toString()) { echoCmd(input.value + "^C"); input.value = ""; ghost.textContent = ""; }
    });
    body.addEventListener("click", (e) => {
      const link = e.target.closest("[data-cmd]"); if (link) { exec(link.dataset.cmd); return; }
      if (!getSelection().toString()) input.focus({ preventScroll: true });
    });

    function welcome() {
      out.innerHTML = "";
      print(`<span class="t-g">ziyad-os 26.04 LTS</span> <span class="t-d">(GNU/Linux 6.8 x86_64)</span>\n\n${L({ fr: "Bienvenue ! Commandes utiles :", en: "Welcome! Useful commands:" })} <span class="t-link" data-cmd="help">help</span> · <span class="t-link" data-cmd="whoami">whoami</span> · <span class="t-link" data-cmd="neofetch">neofetch</span> · <span class="t-link" data-cmd="experience">experience</span> · <span class="t-link" data-cmd="skills">skills</span> · <span class="t-link" data-cmd="kubectl get pods">kubectl get pods</span> · <span class="t-link" data-cmd="traceroute">traceroute</span>\n`);
    }

    renderPs1(); welcome();
    App.on("lang", welcome);
    App.termExec = (c) => { document.getElementById("terminal").scrollIntoView({ behavior: "smooth" }); setTimeout(() => exec(c), 500); };
  };
})();
