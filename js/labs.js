/* ==========================================================================
   LABS — trois simulateurs interactifs liés aux expériences
   - net : réseau & stockage multi-sites (Casablanca, Tanger, Agadir)
   - pve : cluster Proxmox VE + Ceph : migration de VMs et haute disponibilité
   - ci  : pipeline CI/CD avec logs et injection de bug
   ========================================================================== */
(function () {
  const { h, t, L, rand, pick, sleep, sparkline, css, whenVisible } = App;

  function logger(el) {
    return (msg, cls = "") => {
      const time = new Date().toTimeString().slice(0, 8);
      el.insertAdjacentHTML("beforeend", `<div><span class="d">${time}</span> <span class="${cls}">${msg}</span></div>`);
      while (el.children.length > 80) el.firstChild.remove();
      el.scrollTop = el.scrollHeight;
    };
  }

  /* =====================================================================
     1) RÉSEAU & STOCKAGE MULTI-SITES (CMA CGM — 3 sites)
     Simulation illustrative : noms, adresses et valeurs fictifs.
     ===================================================================== */
  function netLab(root) {
    const SITES = [
      { id: "cas", name: "Casablanca", hq: true, lat: 2, net: "10.10" },
      { id: "tng", name: "Tanger", hq: false, lat: 14, net: "10.20" },
      { id: "aga", name: "Agadir", hq: false, lat: 11, net: "10.30" }
    ];
    const DEVICES = [
      { k: "gw", vendor: "Meraki", role: { fr: "Passerelle de sécurité", en: "Security gateway" } },
      { k: "sw", vendor: "Cisco", role: { fr: "Commutation", en: "Switching" } },
      { k: "srv", vendor: "Dell", role: { fr: "Serveur", en: "Server" } },
      { k: "nas", vendor: "Synology", role: { fr: "Stockage NAS", en: "NAS storage" } }
    ];
    const VLANS = [
      { id: 10, n: { fr: "Données", en: "Data" } },
      { id: 20, n: { fr: "Voix", en: "Voice" } },
      { id: 30, n: { fr: "Invités", en: "Guests" } },
      { id: 99, n: { fr: "Administration", en: "Management" } }
    ];
    const S = { up: { cas: true, tng: true, aga: true }, vlan: false, sync: {}, busy: false, thr: [] };
    let timer = 0;

    root.innerHTML = "";
    const title = h("p", { class: "lab-title mono" }, h("span", { class: "dot ok" }), t("lab.net.title"), h("span", { class: "tag" }, "Casablanca · Tanger · Agadir"));
    const vlanBtn = h("button", { class: "lb", onclick: () => { S.vlan = !S.vlan; vlanBtn.classList.toggle("sel", S.vlan); render(); } }, t("lab.net.vlan"));
    const btns = h("div", { class: "lab-btns" },
      h("button", { class: "lb", onclick: ping }, t("lab.net.ping")),
      h("button", { class: "lb", onclick: replicate }, t("lab.net.sync")),
      vlanBtn,
      h("button", { class: "lb", onclick: documentation }, t("lab.net.doc")));
    const metrics = h("div", { class: "lab-metrics" });
    const wan = h("div", { class: "wan-bar mono" });
    const sitesEl = h("div", { class: "net-sites" });
    const chart = h("canvas");
    const stage = h("div", { class: "lab-stage" }, wan, sitesEl,
      h("div", { class: "chart", style: { marginTop: "12px" } }, h("div", { class: "chart-h" }, L({ fr: "trafic inter-sites", en: "inter-site traffic" }), h("b", { class: "thr" }, "0")), chart));
    const logEl = h("div", { class: "lab-log" }); const log = logger(logEl);
    root.append(h("div", { class: "lab" }, h("div", { class: "lab-top" }, title, btns), h("p", { class: "lab-hint" }, t("lab.net.hint")), metrics, stage, logEl));

    wan.addEventListener("click", (e) => {
      const b = e.target.closest("[data-site]"); if (!b) return;
      const id = b.dataset.site, site = SITES.find((s) => s.id === id);
      S.up[id] = !S.up[id];
      if (S.up[id]) log(`${site.name}: ${L({ fr: "lien WAN rétabli", en: "WAN link restored" })}`, "ok");
      else log(`${site.name}: ${L({ fr: "lien WAN coupé — site injoignable", en: "WAN link down — site unreachable" })}`, "e");
      if (!S.up[id] && S.sync[id] != null && S.sync[id] < 100) { log(`${site.name}: ${L({ fr: "réplication NAS interrompue", en: "NAS replication interrupted" })}`, "w"); delete S.sync[id]; }
      render();
    });

    const reachable = (a, b) => S.up[a] && S.up[b];

    async function ping() {
      if (S.busy) return; S.busy = true; render();
      log("ping " + L({ fr: "inter-sites", en: "inter-site" }) + " (5 × ICMP)", "d");
      for (let i = 0; i < SITES.length; i++) for (let j = i + 1; j < SITES.length; j++) {
        const a = SITES[i], b = SITES[j];
        await sleep(450);
        if (reachable(a.id, b.id)) {
          const ms = (a.lat + b.lat) * rand(.9, 1.15);
          log(`${a.name} → ${b.name} : ${L({ fr: "5/5 reçus", en: "5/5 received" })}, ${ms.toFixed(1)} ms`, "ok");
        } else log(`${a.name} → ${b.name} : ${L({ fr: "délai dépassé, 0/5 reçus", en: "timed out, 0/5 received" })}`, "e");
      }
      S.busy = false; render();
    }

    function replicate() {
      SITES.filter((s) => !s.hq).forEach((s) => {
        if (!reachable("cas", s.id)) { log(`${s.name}: ${L({ fr: "réplication impossible, site injoignable", en: "replication impossible, site unreachable" })}`, "e"); return; }
        if (S.sync[s.id] != null && S.sync[s.id] < 100) return;
        S.sync[s.id] = 0;
        log(`NAS ${s.name} → NAS Casablanca : ${L({ fr: "réplication démarrée", en: "replication started" })}`, "i");
      });
      render();
    }

    function documentation() {
      log(L({ fr: "Inventaire généré :", en: "Inventory generated:" }), "i");
      log("| Site       | " + DEVICES.map((d) => d.vendor.padEnd(9)).join("| ") + "| WAN  |", "d");
      SITES.forEach((s) => log(`| ${s.name.padEnd(10)} | ` + DEVICES.map((d) => (s.id + "-" + d.k).padEnd(9)).join("| ") + `| ${S.up[s.id] ? "up  " : "down"} |`, ""));
      log(L({ fr: "Plan d'adressage : ", en: "Addressing plan: " }) + SITES.map((s) => `${s.name} ${s.net}.0.0/16`).join(" · "), "d");
      log(L({ fr: "✓ schéma et inventaire prêts pour la documentation technique", en: "✓ diagram and inventory ready for the technical documentation" }), "ok");
    }

    function render() {
      wan.innerHTML = "";
      wan.append(h("span", { class: "wan-label" }, t("lab.net.wan")));
      SITES.forEach((s) => wan.append(h("button", { class: "wan-link" + (S.up[s.id] ? "" : " down"), "data-site": s.id, title: L({ fr: "Cliquer pour couper / rétablir", en: "Click to cut / restore" }) },
        h("span", { class: "dot " + (S.up[s.id] ? "ok" : "err") }), s.name, h("small", {}, S.up[s.id] ? s.lat + " ms" : "down"))));

      sitesEl.innerHTML = "";
      SITES.forEach((s) => {
        const up = S.up[s.id];
        const body = S.vlan
          ? h("div", { class: "vlans" }, VLANS.map((v) => h("div", { class: "vlan v" + v.id }, h("b", {}, "VLAN " + v.id), h("span", {}, L(v.n)), h("small", {}, `${s.net}.${v.id}.0/24`))))
          : h("ul", { class: "devices" }, DEVICES.map((d) => h("li", {}, h("span", { class: "dot " + (up || d.k !== "gw" ? "ok" : "warn") }), h("b", {}, d.vendor), h("span", {}, L(d.role)))));
        const sync = S.sync[s.id];
        sitesEl.append(h("div", { class: "net-site" + (up ? "" : " down") },
          h("h5", {}, h("span", {}, s.name), h("small", {}, s.hq ? t("lab.net.hq") : t("lab.net.branch"))),
          body,
          sync != null ? h("div", { class: "sync" }, h("span", {}, sync >= 100 ? L({ fr: "réplication ✓", en: "replication ✓" }) : `NAS → Casablanca ${Math.floor(sync)}%`), h("div", { class: "meter" }, h("i", { style: { width: Math.min(100, sync) + "%" } }))) : null));
      });

      const online = SITES.filter((s) => S.up[s.id]).length;
      const lats = SITES.filter((s) => !s.hq && S.up[s.id]).map((s) => s.lat + 2);
      metrics.innerHTML = `<span>${t("lab.net.online")} <b>${online}/3</b></span><span>${t("lab.net.latency")} <b>${lats.length ? (lats.reduce((a, b) => a + b) / lats.length).toFixed(1) + " ms" : "—"}</b></span><span>VLANs <b>${VLANS.length}</b></span><span>${L({ fr: "équipements", en: "devices" })} <b>${SITES.length * DEVICES.length}</b></span>`;
      root.querySelectorAll(".lab-btns .lb")[0].disabled = S.busy;
    }

    function tick() {
      let changed = false;
      Object.keys(S.sync).forEach((id) => {
        if (S.sync[id] < 100) { S.sync[id] += rand(4, 9); changed = true; if (S.sync[id] >= 100) { S.sync[id] = 100; log(`NAS ${SITES.find((s) => s.id === id).name}: ${L({ fr: "réplication terminée ✓", en: "replication complete ✓" })}`, "ok"); } }
      });
      if (changed) render();
      const syncing = Object.values(S.sync).filter((v) => v < 100).length;
      const v = (SITES.filter((s) => !s.hq && S.up[s.id]).length * 40 + syncing * 180) * rand(.85, 1.15);
      S.thr.push(v); if (S.thr.length > 60) S.thr.shift();
      root.querySelector(".thr").textContent = Math.round(v) + " Mbit/s";
      sparkline(chart, S.thr, css("--accent"), 500);
    }

    log(L({ fr: "3 sites connectés : Casablanca (siège), Tanger, Agadir", en: "3 sites connected: Casablanca (HQ), Tangier, Agadir" }), "ok");
    render();
    return { start() { if (!timer) timer = setInterval(tick, 500); }, stop() { clearInterval(timer); timer = 0; } };
  }

  /* =====================================================================
     2) PROXMOX VE + CEPH (Emerge Invest — hyperconvergence)
     ===================================================================== */
  function pveLab(root) {
    const S = {
      nodes: [
        { name: "pve-01", up: true, vms: ["vm-100", "vm-101"], osds: [0, 1] },
        { name: "pve-02", up: true, vms: ["vm-102", "ct-200"], osds: [2, 3] },
        { name: "pve-03", up: true, vms: ["vm-103", "ct-201"], osds: [4, 5] }
      ],
      osdState: {}, // id → "up" | "out" | "backfill"
      legacy: ["vm-104", "vm-105", "vm-106", "ct-202"], // VMs encore sur l'ancien serveur
      health: "HEALTH_OK", iops: [], lat: [], net: [], mode: "idle", recovering: 0
    };
    for (let i = 0; i < 6; i++) S.osdState[i] = "up";
    let timer = 0;

    root.innerHTML = "";
    const healthEl = h("span", { class: "health ok" }, "HEALTH_OK");
    const quorumEl = h("b", {}, "3/3");
    const title = h("p", { class: "lab-title mono" }, h("span", { class: "dot ok" }), t("lab.pve.title"));
    const btns = h("div", { class: "lab-btns" },
      h("button", { class: "lb", onclick: migrate }, "⇢ " + t("lab.pve.migrate")),
      h("button", { class: "lb", onclick: healAll }, t("lab.pve.heal")));
    const grid = h("div", { class: "pve-grid" });
    const legacyEl = h("div", { class: "pve-legacy" });
    const mk = (label, unit) => { const c = h("canvas"), v = h("b", {}, "0"); return { el: h("div", { class: "chart" }, h("div", { class: "chart-h" }, label, h("span", {}, v, " " + unit)), c), c, v }; };
    const cIops = mk("IOPS Ceph", ""), cLat = mk(L({ fr: "latence", en: "latency" }), "ms"), cNet = mk(L({ fr: "réseau cluster", en: "cluster network" }), "Gbit/s");
    const metrics = h("div", { class: "lab-metrics" }, h("span", {}, t("lab.pve.health") + " ", healthEl), h("span", {}, t("lab.pve.quorum") + " ", quorumEl), h("span", {}, "pool ", h("b", {}, "rbd · size=3 min_size=2")), h("span", { class: "pgs" }));
    const logEl = h("div", { class: "lab-log" }); const log = logger(logEl);
    root.append(h("div", { class: "lab" },
      h("div", { class: "lab-top" }, title, btns),
      h("p", { class: "lab-hint" }, t("lab.pve.hint")),
      metrics,
      h("div", { class: "lab-stage" }, legacyEl, grid, h("div", { class: "pve-charts" }, cIops.el, cLat.el, cNet.el)),
      logEl));

    grid.addEventListener("click", (e) => {
      const el = e.target.closest(".pve-node"); if (!el) return;
      const i = +el.dataset.i; S.nodes[i].up ? fail(i) : recover(i);
    });

    function upCount() { return S.nodes.filter((n) => n.up).length; }

    function fail(i) {
      if (upCount() <= 1) { log("refusing: cluster would lose quorum", "w"); return; }
      const n = S.nodes[i]; n.up = false;
      log(`corosync: link down to ${n.name} — node fenced`, "e");
      n.osds.forEach((o) => (S.osdState[o] = "out"));
      log(`ceph: osd.${n.osds.join(", osd.")} marked down → PGs degraded`, "w");
      S.health = "HEALTH_WARN";
      const orphans = n.vms.splice(0);
      render();
      orphans.forEach((vm, k) => {
        setTimeout(() => {
          const targets = S.nodes.map((x, j) => (x.up ? j : -1)).filter((j) => j >= 0)
            .sort((a, b) => S.nodes[a].vms.length - S.nodes[b].vms.length);
          const tgt = targets[0]; if (tgt == null) return;
          S.nodes[tgt].vms.push(vm + "*");
          log(`ha-manager: ${vm} recovered on ${S.nodes[tgt].name} (restart from shared RBD)`, "i");
          render();
          setTimeout(() => { const v = S.nodes[tgt].vms; const ix = v.indexOf(vm + "*"); if (ix >= 0) v[ix] = vm; log(`${vm}: started ✓`, "ok"); render(); }, 1400);
        }, 1600 + k * 900);
      });
      // backfill sur les OSD restants
      setTimeout(() => {
        S.recovering = 100;
        Object.keys(S.osdState).forEach((o) => { if (S.osdState[o] === "up") S.osdState[o] = "backfill"; });
        log("ceph: recovery/backfill started — re-replicating objects", "w"); render();
      }, 2200);
    }

    function recover(i) {
      const n = S.nodes[i]; n.up = true;
      log(`${n.name} rejoined cluster — quorum ${upCount()}/3`, "ok");
      n.osds.forEach((o) => (S.osdState[o] = "backfill"));
      S.recovering = Math.max(S.recovering, 60);
      render();
    }

    function healAll() { S.nodes.forEach((n, i) => { if (!n.up) recover(i); }); }

    /* migration d'une VM de l'ancien serveur vers le nœud le moins chargé */
    async function migrate() {
      if (S.mode !== "idle" || !S.legacy.length) return;
      const ups = S.nodes.map((n, j) => (n.up ? j : -1)).filter((j) => j >= 0).sort((a, b) => S.nodes[a].vms.length - S.nodes[b].vms.length);
      if (!ups.length) return;
      const vm = S.legacy[0], tgt = S.nodes[ups[0]];
      S.mode = "migrate"; S.legacy[0] = vm + "*"; render();
      log(`${vm}: ${L({ fr: "export depuis l'ancien serveur, import du disque sur Ceph RBD", en: "export from old server, disk import to Ceph RBD" })} → ${tgt.name}`, "d");
      await sleep(2600);
      if (!tgt.up) { S.legacy[0] = vm; log(`${vm}: ${L({ fr: "migration annulée, nœud cible hors ligne", en: "migration cancelled, target node offline" })}`, "e"); S.mode = "idle"; render(); return; }
      S.legacy.shift(); tgt.vms.push(vm);
      log(`${vm}: ${L({ fr: "démarrée sur", en: "started on" })} ${tgt.name}, ${L({ fr: "protégée par la HA", en: "protected by HA" })} ✓`, "ok");
      if (!S.legacy.length) log(L({ fr: "Toutes les VMs sont sur le cluster : l'ancien serveur peut être retiré.", en: "All VMs are on the cluster: the old server can be retired." }), "ok");
      S.mode = "idle"; render();
    }

    function render() {
      grid.innerHTML = "";
      S.nodes.forEach((n, i) => {
        grid.append(h("div", { class: "pve-node" + (n.up ? "" : " down"), "data-i": i, title: n.up ? "Click → simulate failure" : "Click → recover" },
          h("h5", {}, h("span", { class: "dot " + (n.up ? "ok" : "err") }), n.name),
          h("div", { class: "pve-row" }, "VMs / CTs"),
          h("div", { class: "vms" }, n.vms.map((v) => h("span", { class: "vm" + (v.endsWith("*") ? " migrating" : "") }, v.replace("*", "")))),
          h("div", { class: "pve-row" }, "Ceph OSDs"),
          h("div", { class: "osds" }, n.osds.map((o) => h("span", { class: "osd " + (S.osdState[o] === "out" ? "out" : S.osdState[o] === "backfill" ? "backfill" : ""), title: "osd." + o }, o)))));
      });
      const st = S.health === "HEALTH_OK" ? "ok" : S.health === "HEALTH_WARN" ? "warn" : "err";
      healthEl.className = "health " + st; healthEl.textContent = S.health;
      quorumEl.textContent = upCount() + "/3";
      root.querySelector(".pgs").innerHTML = S.recovering > 0 ? `recovery <b>${Math.round(100 - S.recovering)}%</b>` : `PGs <b>128 active+clean</b>`;
      legacyEl.innerHTML = "";
      legacyEl.append(h("span", { class: "pve-row" }, t("lab.pve.legacy")),
        S.legacy.length ? h("div", { class: "vms" }, S.legacy.map((v) => h("span", { class: "vm legacy" + (v.endsWith("*") ? " migrating" : "") }, v.replace("*", ""))))
          : h("span", { class: "legacy-done" }, L({ fr: "vide — toutes les VMs sont sur le cluster ✓", en: "empty — all VMs are on the cluster ✓" })));
      root.querySelector(".lab-btns .lb").disabled = S.mode !== "idle" || !S.legacy.length;
    }

    function tick() {
      // progression de la reconstruction
      if (S.recovering > 0) {
        S.recovering -= upCount() === 3 ? 6 : 3;
        if (S.recovering <= 0) {
          S.recovering = 0;
          Object.keys(S.osdState).forEach((o) => { const nodeUp = S.nodes.find((n) => n.osds.includes(+o)).up; S.osdState[o] = nodeUp ? "up" : "out"; });
          S.health = upCount() === 3 ? "HEALTH_OK" : "HEALTH_WARN";
          log(upCount() === 3 ? "ceph: all PGs active+clean — HEALTH_OK" : "ceph: recovery done — running with 2/3 replicas (min_size satisfied)", upCount() === 3 ? "ok" : "w");
        }
        render();
      }
      const deg = S.health !== "HEALTH_OK";
      const mig = S.mode === "migrate";
      const iops = (mig ? rand(6000, 9000) : rand(800, 1600)) * (deg ? 1.6 : 1);
      const lat = (mig ? rand(.8, 1.3) : rand(.3, .6)) * (deg ? 2 : 1);
      const net = mig ? rand(5, 8) : (S.recovering > 0 ? rand(4, 7) : rand(.2, .8));
      for (const [arr, v] of [[S.iops, iops], [S.lat, lat], [S.net, net]]) { arr.push(v); if (arr.length > 60) arr.shift(); }
      cIops.v.textContent = Math.round(iops).toLocaleString(); cLat.v.textContent = lat.toFixed(2); cNet.v.textContent = net.toFixed(2);
      sparkline(cIops.c, S.iops, css("--accent"), 16000);
      sparkline(cLat.c, S.lat, deg ? css("--warn") : css("--accent-2"), 4);
      sparkline(cNet.c, S.net, css("--accent-3"), 10);
    }

    log("pvecm status: Quorate — 3 nodes, expected votes 3", "ok");
    log("ceph -s: HEALTH_OK · 6 osds: 6 up, 6 in · 128 pgs active+clean", "ok");
    render();
    return { start() { if (!timer) timer = setInterval(tick, 500); }, stop() { clearInterval(timer); timer = 0; } };
  }

  /* =====================================================================
     3) PIPELINE CI/CD (SMB-Industries — FastAPI / React / Docker)
     ===================================================================== */
  function ciLab(root) {
    const STAGES = [
      { k: "checkout", icon: "⎇", label: "checkout", logs: ["actions/checkout@v4", "HEAD is now at {sha} {msg}"] },
      { k: "lint", icon: "≡", label: "lint", logs: ["ruff check app/ — 0 errors", "eslint src/ --max-warnings=0 ✓"] },
      { k: "test", icon: "✓", label: "pytest", logs: ["pytest -q --cov=app", "collected 84 items", "84 passed in 6.21s — coverage 91%"], failLogs: ["pytest -q --cov=app", "collected 84 items", "FAILED tests/test_rdv.py::test_creneau_deja_reserve — AssertionError: 201 != 409", "1 failed, 83 passed in 6.40s"] },
      { k: "audit", icon: "⛨", label: "audit", logs: ["pip-audit — No known vulnerabilities found", "npm audit --audit-level=high — 0 vulnerabilities"] },
      { k: "build", icon: "▣", label: "docker build", logs: ["docker buildx build -t api:{sha} .", "=> exporting layers 2.1s", "image size 142MB"] },
      { k: "push", icon: "⇪", label: "push", logs: ["docker push registry.local/rdv-api:{sha}", "digest: sha256:{dig}"] },
      { k: "deploy", icon: "🚀", label: "deploy", logs: ["docker compose pull && docker compose up -d", "healthcheck GET /health → 200 OK", "deployed ✓"] }
    ];
    const MSGS = ["feat(api): endpoint de réservation de créneau", "feat(front): calendrier des rendez-vous", "fix(api): refuser un créneau déjà réservé", "feat(front): formulaire de prise de rendez-vous", "chore(ci): cache des dépendances", "fix(front): affichage des créneaux sur mobile"];
    let running = false, bug = false, runs = 0, okRuns = 0;

    root.innerHTML = "";
    const title = h("p", { class: "lab-title mono" }, h("span", { class: "dot info" }), t("lab.ci.title"), h("span", { class: "tag" }, L({ fr: "logiciel de prise de rendez-vous", en: "appointment-booking app" })));
    const pushBtn = h("button", { class: "lb", onclick: run }, "▶ " + t("lab.ci.push"));
    const bugBtn = h("button", { class: "lb danger", onclick: () => { bug = !bug; bugBtn.classList.toggle("on", bug); } }, "🐛 " + t("lab.ci.bug"));
    const flow = h("div", { class: "ci-flow" });
    STAGES.forEach((s, i) => {
      if (i) flow.append(h("div", { class: "ci-link", "data-i": i }, h("i")));
      flow.append(h("div", { class: "ci-stage", "data-k": s.k }, h("div", { class: "ci-icon" }, s.icon), h("span", {}, s.label)));
    });
    const badge = h("span", { class: "ci-badge" }, "idle");
    const summary = h("div", { class: "ci-summary" }, badge, h("span", { class: "ci-meta" }, t("lab.ci.idle")));
    const logEl = h("div", { class: "lab-log", style: { height: "150px" } }); const log = logger(logEl);
    root.append(h("div", { class: "lab" }, h("div", { class: "lab-top" }, title, h("div", { class: "lab-btns" }, bugBtn, pushBtn)), h("p", { class: "lab-hint" }, t("lab.ci.hint")), h("div", { class: "lab-stage" }, flow, summary), logEl));

    async function run() {
      if (running) return; running = true; pushBtn.disabled = true; runs++;
      const sha = Math.random().toString(16).slice(2, 9), msg = pick(MSGS), willFail = bug;
      const dig = Array.from({ length: 12 }, () => "0123456789abcdef"[(Math.random() * 16) | 0]).join("") + "…";
      flow.querySelectorAll(".ci-stage").forEach((e) => (e.className = "ci-stage"));
      flow.querySelectorAll(".ci-link").forEach((e) => e.classList.remove("done"));
      badge.className = "ci-badge run"; badge.textContent = "running";
      log(`$ git push origin main  →  ${sha} "${msg}"`, "d");
      log(`workflow "CI/CD" triggered — run #${100 + runs}`, "i");
      const t0 = performance.now();
      let failed = false;
      for (let i = 0; i < STAGES.length; i++) {
        const s = STAGES[i], el = flow.querySelector(`[data-k="${s.k}"]`);
        if (failed) { el.classList.add("skip"); continue; }
        el.classList.add("run");
        summary.querySelector(".ci-meta").textContent = `job: ${s.label} …`;
        const lines = willFail && s.failLogs ? s.failLogs : s.logs;
        for (const line of lines) { await sleep(rand(280, 650)); log(line.replace("{sha}", sha).replace("{msg}", msg).replace("{dig}", dig), /FAILED|failed/.test(line) ? "e" : ""); }
        el.classList.remove("run");
        if (willFail && s.failLogs) { el.classList.add("fail"); failed = true; log(`✗ job "${s.label}" failed — deployment blocked, production untouched`, "e"); continue; }
        el.classList.add("ok");
        const link = flow.querySelector(`.ci-link[data-i="${i + 1}"]`); if (link) link.classList.add("done");
      }
      const dur = ((performance.now() - t0) / 1000).toFixed(1);
      if (!failed) okRuns++;
      badge.className = "ci-badge " + (failed ? "fail" : "ok"); badge.textContent = failed ? "failed" : "passed";
      summary.querySelector(".ci-meta").textContent = `run #${100 + runs} · ${dur}s · success rate ${Math.round((okRuns / runs) * 100)}%`;
      log(failed ? "pipeline failed — fix the test and push again" : `✓ pipeline passed in ${dur}s — api:${sha} live`, failed ? "w" : "ok");
      running = false; pushBtn.disabled = false;
    }
    return { start() {}, stop() {} };
  }

  const LABS = { net: netLab, pve: pveLab, ci: ciLab };
  const instances = new Map();

  /* monte (ou remonte après changement de langue) un lab dans un conteneur */
  App.mountLab = function (kind, container) {
    const prev = instances.get(container); if (prev) prev.inst.stop();
    const inst = LABS[kind](container);
    const rec = { inst, visible: false };
    instances.set(container, rec);
    if (!prev) whenVisible(container, () => { const r = instances.get(container); r.visible = true; if (!container.closest("[hidden]")) r.inst.start(); }, () => { const r = instances.get(container); r.visible = false; r.inst.stop(); });
    else if (prev.visible && !container.closest("[hidden]")) inst.start();
    return inst;
  };
  App.labStart = (container) => { const r = instances.get(container); if (r) r.inst.start(); };
  App.labStop = (container) => { const r = instances.get(container); if (r) r.inst.stop(); };
})();
