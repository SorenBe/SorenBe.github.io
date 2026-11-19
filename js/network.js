/* ==========================================================================
   NETWORK — topologie réseau animée du hero
   - graphe k-plus-proches-voisins, nœuds dérivants
   - paquets routés par plus court chemin (BFS) entre hôtes aléatoires
   - clic = broadcast (inondation) depuis le nœud le plus proche
   ========================================================================== */
(function () {
  const { fitCanvas, css, whenVisible, rand, reducedMotion } = App;

  App.initNetwork = function () {
    const canvas = document.getElementById("net");
    if (!canvas) return;
    let W = 0, H = 0, ctx;
    let nodes = [], edges = [], adj = [], packets = [], waves = [];
    let mouse = { x: -9999, y: -9999, px: 0, py: 0 };
    let running = false, raf = 0, last = 0, spawnAcc = 0;
    let colors = {};
    App.netTrafficFactor = 1;

    const LABELS = ["core-sw-01", "edge-fw", "pve-node-1", "pve-node-2", "pve-node-3", "ceph-osd", "k8s-master", "api-gateway", "db-primary", "db-replica", "ci-runner", "grafana", "registry", "lb-01"];

    function readColors() {
      colors = { accent: css("--accent"), accent2: css("--accent-2"), accent3: css("--accent-3"), line: css("--line-2"), text: css("--muted"), warn: css("--warn") };
    }

    function build() {
      ({ ctx, w: W, h: H } = fitCanvas(canvas));
      const count = Math.round(Math.min(90, Math.max(34, (W * H) / 16000)));
      nodes = [];
      for (let i = 0; i < count; i++) {
        const hub = i < LABELS.length && W > 700;
        nodes.push({
          x: rand(30, W - 30), y: rand(30, H - 30),
          ox: 0, oy: 0, vx: rand(-.12, .12), vy: rand(-.12, .12),
          r: hub ? rand(3.2, 4.4) : rand(1.4, 2.4),
          hub, label: hub ? LABELS[i] : null, z: rand(.4, 1), heat: 0
        });
      }
      // k plus proches voisins → graphe connexe-ish
      const set = new Set();
      edges = []; adj = nodes.map(() => []);
      nodes.forEach((a, i) => {
        const d = nodes.map((b, j) => [j, (a.x - b.x) ** 2 + (a.y - b.y) ** 2]).filter(([j]) => j !== i).sort((p, q) => p[1] - q[1]);
        const k = a.hub ? 4 : 2 + (Math.random() < .4 ? 1 : 0);
        d.slice(0, k).forEach(([j]) => {
          const key = i < j ? i + "-" + j : j + "-" + i;
          if (set.has(key)) return;
          set.add(key); edges.push([i, j]); adj[i].push(j); adj[j].push(i);
        });
      });
      packets = []; waves = [];
    }

    function bfs(src, dst) {
      const prev = new Array(nodes.length).fill(-1); prev[src] = src;
      const q = [src];
      while (q.length) {
        const u = q.shift(); if (u === dst) break;
        for (const v of adj[u]) if (prev[v] === -1) { prev[v] = u; q.push(v); }
      }
      if (prev[dst] === -1) return null;
      const path = []; for (let v = dst; v !== src; v = prev[v]) path.push(v); path.push(src);
      return path.reverse();
    }

    function spawnPacket() {
      const a = (Math.random() * nodes.length) | 0;
      let b = (Math.random() * nodes.length) | 0; if (a === b) return;
      const path = bfs(a, b); if (!path || path.length < 2) return;
      const kind = Math.random();
      packets.push({ path, seg: 0, t: 0, speed: rand(.9, 1.8), color: kind < .6 ? colors.accent : kind < .88 ? colors.accent2 : colors.accent3, trail: [] });
    }

    function broadcast(from) {
      const seen = new Set([from]);
      const frontier = [[from, 0]];
      waves.push({ x: nodes[from].x, y: nodes[from].y, r: 0, a: 1 });
      while (frontier.length) {
        const [u, depth] = frontier.shift();
        if (depth > 4) continue;
        for (const v of adj[u]) {
          if (seen.has(v)) continue; seen.add(v);
          packets.push({ path: [u, v], seg: 0, t: -depth * .9, speed: 2.4, color: colors.warn, trail: [], flood: true });
          frontier.push([v, depth + 1]);
        }
      }
    }

    function pos(n) { return { x: n.x + n.ox, y: n.y + n.oy }; }

    function frame(ts) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(50, ts - (last || ts)) / 16.67; last = ts;
      ctx.clearRect(0, 0, W, H);

      // parallaxe souris
      mouse.px += ((mouse.x === -9999 ? W / 2 : mouse.x) - mouse.px) * .05;
      mouse.py += ((mouse.y === -9999 ? H / 2 : mouse.y) - mouse.py) * .05;
      const mx = (mouse.px / W - .5), my = (mouse.py / H - .5);

      for (const n of nodes) {
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x < 10 || n.x > W - 10) n.vx *= -1;
        if (n.y < 10 || n.y > H - 10) n.vy *= -1;
        n.ox = -mx * 26 * n.z; n.oy = -my * 26 * n.z;
        const p = pos(n), d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        n.heat += ((d < 140 ? 1 - d / 140 : 0) - n.heat) * .12;
      }

      // arêtes
      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = pos(nodes[i]), b = pos(nodes[j]);
        const heat = Math.max(nodes[i].heat, nodes[j].heat);
        ctx.strokeStyle = heat > .05 ? colors.accent : colors.line;
        ctx.globalAlpha = .28 + heat * .6;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // trafic
      spawnAcc += dt * .06 * App.netTrafficFactor;
      while (spawnAcc > 1) { spawnAcc--; if (packets.length < 70 * App.netTrafficFactor) spawnPacket(); }

      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k];
        const a = pos(nodes[p.path[p.seg]]), b = pos(nodes[p.path[p.seg + 1]]);
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        p.t += (p.speed * dt) / len * 2.2;
        if (p.t < 0) continue;
        if (p.t >= 1) {
          nodes[p.path[p.seg + 1]].heat = Math.min(1, nodes[p.path[p.seg + 1]].heat + .25);
          p.seg++; p.t = 0;
          if (p.seg >= p.path.length - 1) { packets.splice(k, 1); continue; }
          continue;
        }
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        p.trail.push(x, y); if (p.trail.length > 16) p.trail.splice(0, 2);
        ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.globalAlpha = .5;
        ctx.beginPath(); for (let q = 0; q < p.trail.length; q += 2) q ? ctx.lineTo(p.trail[q], p.trail[q + 1]) : ctx.moveTo(p.trail[q], p.trail[q + 1]); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = p.color;
        ctx.shadowColor = p.color; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(x, y, p.flood ? 2.4 : 2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ondes de broadcast
      for (let k = waves.length - 1; k >= 0; k--) {
        const w = waves[k]; w.r += 4 * dt; w.a -= .015 * dt;
        if (w.a <= 0) { waves.splice(k, 1); continue; }
        ctx.strokeStyle = colors.warn; ctx.globalAlpha = w.a; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // nœuds
      ctx.font = "500 10.5px JetBrains Mono, monospace";
      for (const n of nodes) {
        const p = pos(n);
        const r = n.r + n.heat * 2.5;
        ctx.fillStyle = n.hub ? colors.accent : colors.accent2;
        ctx.globalAlpha = .55 + n.heat * .45 + (n.hub ? .2 : 0);
        if (n.hub) {
          ctx.beginPath(); ctx.arc(p.x, p.y, r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = colors.accent; ctx.lineWidth = 1; ctx.globalAlpha = .25 + n.heat * .5; ctx.stroke();
          ctx.globalAlpha = .9;
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        if (n.label && n.heat > .15) {
          ctx.globalAlpha = Math.min(1, n.heat * 1.6);
          ctx.fillStyle = colors.text; ctx.fillText(n.label, p.x + 10, p.y - 8);
        }
      }
      ctx.globalAlpha = 1;
    }

    function start() { if (running || reducedMotion) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    readColors(); build();
    if (reducedMotion) { frame(0); cancelAnimationFrame(raf); }

    const hero = document.getElementById("hero");
    hero.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    hero.addEventListener("click", (e) => {
      if (e.target.closest("a,button,.photo-wrap")) return;
      const r = canvas.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
      let best = 0, bd = Infinity;
      nodes.forEach((n, i) => { const p = pos(n), d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = i; } });
      broadcast(best);
    });

    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 200); });
    App.on("theme", () => { readColors(); });
    whenVisible(canvas, start, stop);
  };
})();
