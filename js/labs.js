/* ==========================================================================
   LABS — trois simulateurs interactifs liés aux expériences
   - k8s : ordonnanceur de conteneurs avec boucle de réconciliation
   - pve : cluster Proxmox VE + Ceph avec HA, fio et iperf3
   - ci  : pipeline GitHub Actions avec logs et injection de bug
   ========================================================================== */
(function () {
  const { h, t, rand, pick, sleep, sparkline, css, whenVisible } = App;

  function logger(el) {
    return (msg, cls = "") => {
      const time = new Date().toTimeString().slice(0, 8);
      el.insertAdjacentHTML("beforeend", `<div><span class="d">${time}</span> <span class="${cls}">${msg}</span></div>`);
      while (el.children.length > 80) el.firstChild.remove();
      el.scrollTop = el.scrollHeight;
    };
  }

  /* =====================================================================
     1) ORCHESTRATEUR (CMA CGM — conteneurisation)
     ===================================================================== */
  function k8sLab(root) {
    const S = { desired: 4, nodes: [{ name: "worker-1", up: true }, { name: "worker-2", up: true }, { name: "worker-3", up: true }], pods: [], seq: 0, rps: [] };
    let timer = 0, tickT = 0;

    root.innerHTML = "";
    const title = h("p", { class: "lab-title mono" }, h("span", { class: "dot ok" }), t("lab.k8s.title"), h("span", { class: "tag" }, "deployment/logistics-api"));
    const btn = (key, fn, cls = "") => h("button", { class: "lb " + cls, onclick: fn }, t(key));
    const btns = h("div", { class: "lab-btns" },
      btn("lab.k8s.scaleDown", () => scale(-1)),
      btn("lab.k8s.scaleUp", () => scale(1)),
      btn("lab.k8s.kill", killRandom, "danger"),
      btn("lab.k8s.drain", nodeFail, "danger"),
      btn("lab.k8s.reset", reset));
    const metrics = h("div", { class: "lab-metrics" });
    const bar = h("i"); const lbRow = h("div", { class: "k8s-lb" }, "ingress → svc/logistics-api", h("div", { class: "bar" }, bar), h("span", { class: "rps" }, "0 req/s"));
    const nodesEl = h("div", { class: "k8s-nodes" });
    const chart = h("canvas");
    const stage = h("div", { class: "lab-stage" }, lbRow, nodesEl, h("div", { class: "chart", style: { marginTop: "12px" } }, h("div", { class: "chart-h" }, "throughput", h("b", { class: "thr" }, "0")), chart));
    const logEl = h("div", { class: "lab-log" }); const log = logger(logEl);
    root.append(h("div", { class: "lab" }, h("div", { class: "lab-top" }, title, btns), h("p", { class: "lab-hint" }, t("lab.k8s.hint")), metrics, stage, logEl));

    function upNodes() { return S.nodes.map((n, i) => (n.up ? i : -1)).filter((i) => i >= 0); }
    function leastLoaded() {
      const ups = upNodes(); if (!ups.length) return -1;
      return ups.sort((a, b) => S.pods.filter((p) => p.node === a && !p.dying).length - S.pods.filter((p) => p.node === b && !p.dying).length)[0];
    }
    function newPod() {
      const id = "pod-" + (++S.seq).toString(36).padStart(3, "0") + Math.random().toString(36).slice(2, 4);
      const node = leastLoaded();
      if (node < 0) { log("0/3 nodes available: insufficient resources", "e"); return; }
      const pod = { id, node, phase: "Pending" };
      S.pods.push(pod);
      log(`scheduler: assigned <b>${id}</b> → ${S.nodes[node].name}`, "i");
      setTimeout(() => { if (S.pods.includes(pod) && !pod.dying) { pod.phase = "Running"; log(`kubelet: ${id} Running (readiness probe OK)`, "ok"); render(); } }, rand(700, 1500));
    }
    function reconcile() {
      const alive = S.pods.filter((p) => !p.dying && S.nodes[p.node].up);
      if (alive.length < S.desired) newPod();
      else if (alive.length > S.desired) { const p = alive[alive.length - 1]; terminate(p, "scale down"); }
      render();
    }
    function terminate(p, why) {
      if (p.dying) return; p.dying = true; log(`${p.id} Terminating (${why})`, "w"); render();
      setTimeout(() => { S.pods = S.pods.filter((x) => x !== p); render(); }, 500);
    }
    function scale(d) {
      const n = Math.max(1, Math.min(9, S.desired + d));
      if (n === S.desired) return; S.desired = n;
      log(`kubectl scale deployment/logistics-api --replicas=${n}`, "d"); reconcile();
    }
    function killRandom() {
      const alive = S.pods.filter((p) => !p.dying);
      if (!alive.length) return; const p = pick(alive);
      log(`kubectl delete pod ${p.id} --force`, "d"); terminate(p, "killed");
    }
    function nodeFail() {
      const ups = upNodes(); if (ups.length <= 1) { log("refusing: last schedulable node", "w"); return; }
      const i = pick(ups); S.nodes[i].up = false;
      log(`node/${S.nodes[i].name} NotReady — evicting pods`, "e");
      S.pods.filter((p) => p.node === i).forEach((p) => terminate(p, "node lost"));
      setTimeout(() => { S.nodes[i].up = true; log(`node/${S.nodes[i].name} Ready`, "ok"); render(); }, 9000);
    }
    function reset() { S.desired = 4; S.nodes.forEach((n) => (n.up = true)); S.pods = []; log("cluster reset", "d"); render(); }
    function podClick(e) { const id = e.target.closest(".pod")?.dataset.id; const p = S.pods.find((x) => x.id === id); if (p) { log(`kubectl delete pod ${p.id}`, "d"); terminate(p, "killed"); } }
    nodesEl.addEventListener("click", podClick);

    function render() {
      nodesEl.innerHTML = "";
      S.nodes.forEach((n, i) => {
        const pods = S.pods.filter((p) => p.node === i);
        nodesEl.append(h("div", { class: "k8s-node" + (n.up ? "" : " down") },
          h("h5", {}, h("span", {}, n.name), h("span", {}, n.up ? "Ready" : "NotReady")),
          h("div", { class: "k8s-pods" }, pods.map((p) => h("div", { class: "pod " + (p.dying ? "dying" : p.phase === "Pending" ? "pending" : ""), "data-id": p.id, title: p.id + " · " + p.phase }, p.id.slice(4, 7))))));
      });
      const ready = S.pods.filter((p) => p.phase === "Running" && !p.dying).length;
      metrics.innerHTML = `<span>${t("lab.k8s.desired")} <b>${S.desired}</b></span><span>${t("lab.k8s.ready")} <b>${ready}/${S.desired}</b></span><span>nodes <b>${upNodes().length}/3</b></span><span>image <b>registry/logistics-api:2.4.1</b></span>`;
      bar.style.width = Math.min(100, (ready / Math.max(1, S.desired)) * 100) + "%";
    }

    function tick() {
      const ready = S.pods.filter((p) => p.phase === "Running" && !p.dying).length;
      const demand = 900 + Math.sin(Date.now() / 3000) * 250 + rand(-60, 60);
      const cap = ready * 260;
      const served = Math.max(0, Math.min(demand, cap));
      S.rps.push(served); if (S.rps.length > 60) S.rps.shift();
      root.querySelector(".rps").textContent = Math.round(served) + " " + t("lab.k8s.rps");
      root.querySelector(".thr").textContent = Math.round(served) + " req/s" + (served < demand - 5 ? " ⚠" : "");
      sparkline(chart, S.rps, served < demand - 5 ? css("--warn") : css("--accent"), 1400);
      if (++tickT % 2 === 0) reconcile();
    }

    log("cluster bootstrap: 3 workers joined", "ok");
    render();
    return {
      start() { if (!timer) { timer = setInterval(tick, 500); } },
      stop() { clearInterval(timer); timer = 0; }
    };
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
      health: "HEALTH_OK", iops: [], lat: [], net: [], mode: "idle", recovering: 0
    };
    for (let i = 0; i < 6; i++) S.osdState[i] = "up";
    let timer = 0;

    root.innerHTML = "";
    const healthEl = h("span", { class: "health ok" }, "HEALTH_OK");
    const quorumEl = h("b", {}, "3/3");
    const title = h("p", { class: "lab-title mono" }, h("span", { class: "dot ok" }), t("lab.pve.title"));
    const btns = h("div", { class: "lab-btns" },
      h("button", { class: "lb", onclick: () => bench("fio") }, t("lab.pve.bench")),
      h("button", { class: "lb", onclick: () => bench("iperf") }, t("lab.pve.iperf")),
      h("button", { class: "lb", onclick: healAll }, t("lab.pve.heal")));
    const grid = h("div", { class: "pve-grid" });
    const mk = (label, unit) => { const c = h("canvas"), v = h("b", {}, "0"); return { el: h("div", { class: "chart" }, h("div", { class: "chart-h" }, label, h("span", {}, v, " " + unit)), c), c, v }; };
    const cIops = mk("IOPS (fio randrw 4k)", ""), cLat = mk("latency", "ms"), cNet = mk("iperf3 cluster net", "Gbit/s");
    const metrics = h("div", { class: "lab-metrics" }, h("span", {}, t("lab.pve.health") + " ", healthEl), h("span", {}, t("lab.pve.quorum") + " ", quorumEl), h("span", {}, "pool ", h("b", {}, "rbd · size=3 min_size=2")), h("span", { class: "pgs" }));
    const logEl = h("div", { class: "lab-log" }); const log = logger(logEl);
    root.append(h("div", { class: "lab" },
      h("div", { class: "lab-top" }, title, btns),
      h("p", { class: "lab-hint" }, t("lab.pve.hint")),
      metrics,
      h("div", { class: "lab-stage" }, grid, h("div", { class: "pve-charts" }, cIops.el, cLat.el, cNet.el)),
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

    async function bench(kind) {
      if (S.mode !== "idle") return;
      S.mode = kind; render();
      if (kind === "fio") {
        log("fio --name=randrw --rw=randrw --bs=4k --iodepth=32 --numjobs=4 --runtime=10 --filename=/dev/rbd0", "d");
        await sleep(5000);
        const deg = S.health !== "HEALTH_OK";
        const io = Math.round((deg ? 18000 : 32000) * rand(.92, 1.06));
        log(`fio: read: IOPS=${(io * .5 / 1000).toFixed(1)}k, write: IOPS=${(io * .5 / 1000).toFixed(1)}k, clat avg=${(deg ? 2.9 : 1.4).toFixed(1)}ms`, "ok");
      } else {
        log("iperf3 -c 10.10.10.2 -P 4 -t 10   # ceph cluster network", "d");
        await sleep(5000);
        log(`iperf3: [SUM] 0.00-10.00 sec  ${(rand(10.8, 11.6)).toFixed(1)} GBytes  ${(rand(9.2, 9.6)).toFixed(2)} Gbits/sec  receiver`, "ok");
      }
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
      root.querySelectorAll(".lb").forEach((b, k) => (b.disabled = k < 2 && S.mode !== "idle"));
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
      const fio = S.mode === "fio";
      const iops = fio ? (deg ? 18000 : 32000) * rand(.9, 1.08) : rand(800, 1600) * (deg ? 1.6 : 1);
      const lat = fio ? (deg ? 2.9 : 1.4) * rand(.85, 1.2) : rand(.3, .6) * (deg ? 2 : 1);
      const net = S.mode === "iperf" ? rand(9.1, 9.6) : (S.recovering > 0 ? rand(4, 7) : rand(.2, .8));
      for (const [arr, v] of [[S.iops, iops], [S.lat, lat], [S.net, net]]) { arr.push(v); if (arr.length > 60) arr.shift(); }
      cIops.v.textContent = Math.round(iops).toLocaleString(); cLat.v.textContent = lat.toFixed(2); cNet.v.textContent = net.toFixed(2);
      sparkline(cIops.c, S.iops, css("--accent"), 38000);
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
      { k: "test", icon: "✓", label: "pytest", logs: ["pytest -q --cov=app", "collected 84 items", "84 passed in 6.21s — coverage 91%"], failLogs: ["pytest -q --cov=app", "collected 84 items", "FAILED tests/test_auth.py::test_token_expiry — AssertionError: 200 != 401", "1 failed, 83 passed in 6.40s"] },
      { k: "sast", icon: "⛨", label: "SAST", logs: ["bandit -r app/ — No issues identified", "npm audit --audit-level=high — 0 vulnerabilities"] },
      { k: "build", icon: "▣", label: "docker build", logs: ["docker buildx build -t api:{sha} .", "=> exporting layers 2.1s", "image size 142MB"] },
      { k: "push", icon: "⇪", label: "push", logs: ["docker push ghcr.io/smb/api:{sha}", "digest: sha256:{dig}"] },
      { k: "deploy", icon: "🚀", label: "deploy", logs: ["docker compose pull && docker compose up -d", "healthcheck GET /health → 200 OK", "deployed ✓"] }
    ];
    const MSGS = ["feat(api): add JWT refresh endpoint", "fix(ui): debounce search input", "perf(db): add index on orders.created_at", "chore(ci): cache pip deps", "feat(front): dashboard charts", "refactor(api): pydantic v2 schemas"];
    let running = false, bug = false, runs = 0, okRuns = 0;

    root.innerHTML = "";
    const title = h("p", { class: "lab-title mono" }, h("span", { class: "dot info" }), t("lab.ci.title"), h("span", { class: "tag" }, ".github/workflows/ci.yml"));
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

  const LABS = { k8s: k8sLab, pve: pveLab, ci: ciLab };
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
