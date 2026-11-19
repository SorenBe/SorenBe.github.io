/* ==========================================================================
   GRAPH — graphe de compétences à forces (simulation physique maison)
   nœuds : catégories (hubs) · technologies · missions/projets (losanges)
   ========================================================================== */
(function () {
  const { fitCanvas, css, whenVisible, L, t, reducedMotion } = App;

  App.initGraph = function () {
    const canvas = document.getElementById("skill-graph");
    const info = document.getElementById("graph-info");
    if (!canvas) return;
    let W = 0, H = 0, ctx, nodes = [], links = [], byId = {};
    let hover = null, drag = null, filter = null, running = false, raf = 0, alpha = 1;
    let colors = {};

    const workTitle = (id) => {
      const e = App.experiences.find((x) => x.id === id); if (e) return e.company;
      const p = App.projects.find((x) => x.id === id); return p ? L(p.title) : id;
    };

    function build() {
      ({ ctx, w: W, h: H } = fitCanvas(canvas));
      const old = Object.fromEntries(nodes.map((n) => [n.id, n]));
      nodes = []; links = []; byId = {};
      const add = (n) => { const o = old[n.id]; Object.assign(n, { x: o ? o.x : W / 2 + (Math.random() - .5) * W * .6, y: o ? o.y : H / 2 + (Math.random() - .5) * H * .6, vx: 0, vy: 0 }); nodes.push(n); byId[n.id] = n; };
      const cats = App.skillCategories;
      cats.forEach((c, i) => {
        const ang = (i / cats.length) * Math.PI * 2;
        add({ id: "cat:" + c.id, type: "cat", label: L(c), color: c.color, cat: c.id, r: 9, ax: Math.cos(ang), ay: Math.sin(ang) });
      });
      App.experiences.forEach((e) => add({ id: "w:" + e.id, type: "work", label: e.company, r: 9, sub: L(e.role) }));
      App.projects.forEach((p) => add({ id: "w:" + p.id, type: "work", label: L(p.title), r: 7, sub: "Projet" }));
      App.skills.forEach((s) => {
        const c = cats.find((x) => x.id === s.c);
        const label = App.state.lang === "en" && s.en ? s.en : s.n;
        add({ id: "s:" + s.n, type: "skill", label, color: c.color, cat: s.c, r: 4.5 + (s.links ? s.links.length : 0) * .9, links: s.links || [] });
        links.push({ a: "s:" + s.n, b: "cat:" + s.c, kind: "cat" });
        (s.links || []).forEach((w) => byId["w:" + w] && links.push({ a: "s:" + s.n, b: "w:" + w, kind: "work" }));
      });
      links.forEach((l) => { l.s = byId[l.a]; l.t = byId[l.b]; });
      nodes.forEach((n) => (n.deg = links.filter((l) => l.s === n || l.t === n).length));
      alpha = 1;
      for (let i = 0; i < 260; i++) step();   // pré-calcul : le graphe apparaît déjà stabilisé
      alpha = .35;
    }

    function readColors() { colors = { text: css("--text"), muted: css("--muted"), faint: css("--faint"), line: css("--line-2"), accent: css("--accent"), bg: css("--bg-2"), surface: css("--surface") }; }

    function step() {
      const cx = W / 2, cy = H / 2;
      const k = Math.min(W, H);
      // répulsion
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
          const both = a.type === "work" && b.type === "work";
          if (d2 > (both ? 90000 : 40000)) continue;
          if (d2 < 1) { dx = Math.random() - .5; dy = Math.random() - .5; d2 = 1; }
          const f = (both ? 900 : a.type === "cat" || b.type === "cat" ? 160 : 90) / Math.max(d2, 900) * 10 * alpha;
          const d = Math.sqrt(d2); dx /= d; dy /= d;
          a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
        }
      }
      // ressorts
      for (const l of links) {
        const dx = l.t.x - l.s.x, dy = l.t.y - l.s.y, d = Math.hypot(dx, dy) || 1;
        const rest = l.kind === "cat" ? k * .11 : k * .2;
        const str = l.kind === "cat" ? .02 : .006;
        const f = (d - rest) * str * alpha;
        l.s.vx += dx / d * f; l.s.vy += dy / d * f; l.t.vx -= dx / d * f; l.t.vy -= dy / d * f;
      }
      // gravité + ancrage des catégories en cercle
      for (const n of nodes) {
        if (n.type === "cat") { const tx = cx + n.ax * W * .34, ty = cy + n.ay * H * .34; n.vx += (tx - n.x) * .012; n.vy += (ty - n.y) * .012; }
        else if (n.type === "work") { n.vx += (cx - n.x) * .0018; n.vy += (cy - n.y) * .0018; }
        else { n.vx += (cx - n.x) * .0012; n.vy += (cy - n.y) * .0012; }
        if (n === drag) { n.vx = n.vy = 0; continue; }
        n.vx *= .82; n.vy *= .82;
        const sp = Math.hypot(n.vx, n.vy); if (sp > 6) { n.vx *= 6 / sp; n.vy *= 6 / sp; }
        n.x += n.vx; n.y += n.vy;
        n.x = Math.max(20, Math.min(W - 20, n.x)); n.y = Math.max(20, Math.min(H - 20, n.y));
      }
      alpha = Math.max(.12, alpha * .995);
    }

    function isLinked(a, b) { return links.some((l) => (l.s === a && l.t === b) || (l.t === a && l.s === b)); }
    function visible(n) { if (!filter) return true; if (n.cat) return n.cat === filter; return links.some((l) => (l.s === n && l.t.cat === filter) || (l.t === n && l.s.cat === filter)); }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const focus = hover || drag;
      for (const l of links) {
        const on = focus ? (l.s === focus || l.t === focus) : true;
        const vis = visible(l.s) && visible(l.t);
        ctx.globalAlpha = !vis ? .03 : focus ? (on ? .9 : .05) : l.kind === "work" ? .35 : .18;
        ctx.strokeStyle = l.kind === "work" ? (on && focus ? colors.accent : colors.line) : (l.s.color || colors.line);
        ctx.lineWidth = on && focus ? 1.6 : 1;
        if (l.kind === "work") ctx.setLineDash([3, 4]); else ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(l.s.x, l.s.y); ctx.lineTo(l.t.x, l.t.y); ctx.stroke();
      }
      ctx.setLineDash([]);
      for (const n of nodes) {
        const near = !focus || n === focus || isLinked(n, focus);
        ctx.globalAlpha = !visible(n) ? .08 : near ? 1 : .15;
        if (n.type === "work") {
          const r = n.r + (n === focus ? 3 : 0);
          ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(Math.PI / 4);
          ctx.fillStyle = colors.surface; ctx.strokeStyle = colors.text; ctx.lineWidth = 2;
          ctx.fillRect(-r, -r, r * 2, r * 2); ctx.strokeRect(-r, -r, r * 2, r * 2); ctx.restore();
        } else {
          const r = n.r + (n === focus ? 3 : 0);
          if (n.type === "cat") { ctx.beginPath(); ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2); ctx.strokeStyle = n.color; ctx.lineWidth = 1; ctx.globalAlpha *= .5; ctx.stroke(); ctx.globalAlpha = !visible(n) ? .08 : near ? 1 : .15; }
          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fillStyle = n.color;
          ctx.shadowColor = n.color; ctx.shadowBlur = n === focus ? 18 : n.type === "cat" ? 10 : 0; ctx.fill(); ctx.shadowBlur = 0;
        }
        // libellés
        const showLabel = n.type !== "skill" || W > 760 || n === focus || (focus && isLinked(n, focus));
        if (showLabel) {
          ctx.font = n.type === "cat" ? "700 12px JetBrains Mono, monospace" : n.type === "work" ? "600 12px Space Grotesk, sans-serif" : "500 11px Space Grotesk, sans-serif";
          ctx.fillStyle = n.type === "cat" ? n.color : n.type === "work" ? colors.text : colors.muted;
          ctx.textAlign = "center";
          ctx.fillText(n.type === "cat" ? n.label.toUpperCase() : n.label, n.x, n.y - n.r - (n.type === "work" ? 10 : 7));
        }
      }
      ctx.globalAlpha = 1;
    }

    function loop() { raf = requestAnimationFrame(loop); step(); draw(); }
    function start() { if (running) return; running = true; if (reducedMotion) { for (let i = 0; i < 300; i++) step(); draw(); running = false; return; } loop(); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    function nodeAt(x, y) {
      let best = null, bd = 22 * 22;
      for (const n of nodes) { const d = (n.x - x) ** 2 + (n.y - y) ** 2; if (d < bd && visible(n)) { bd = d; best = n; } }
      return best;
    }
    function local(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

    function showInfo(n) {
      if (!n) { info.hidden = true; return; }
      let html = "";
      if (n.type === "skill") {
        const c = App.skillCategories.find((x) => x.id === n.cat);
        html = `<span class="cat" style="color:${c.color}">${App.esc(L(c))}</span><h4>${App.esc(n.label)}</h4>`;
        html += n.links.length ? `<p>${t("skills.usedIn")} :</p><ul>${n.links.map((w) => `<li>${App.esc(workTitle(w))}</li>`).join("")}</ul>` : `<p>${t("skills.none")}</p>`;
      } else if (n.type === "work") {
        const used = links.filter((l) => l.t === n).map((l) => l.s.label);
        html = `<span class="cat" style="color:${colors.accent}">${App.esc(n.sub)}</span><h4>${App.esc(n.label)}</h4><p>${used.map(App.esc).join(" · ")}</p>`;
      } else {
        const sk = links.filter((l) => l.t === n).map((l) => l.s.label);
        html = `<span class="cat" style="color:${n.color}">${sk.length} skills</span><h4>${App.esc(n.label)}</h4><p>${sk.map(App.esc).join(" · ")}</p>`;
      }
      info.innerHTML = html; info.hidden = false;
    }

    canvas.addEventListener("pointermove", (e) => {
      const p = local(e);
      if (drag) { drag.x = p.x; drag.y = p.y; alpha = Math.max(alpha, .4); return; }
      const n = nodeAt(p.x, p.y);
      if (n !== hover) { hover = n; showInfo(n); canvas.style.cursor = n ? "pointer" : "grab"; }
    });
    canvas.addEventListener("pointerdown", (e) => { const p = local(e); const n = nodeAt(p.x, p.y); if (n) { drag = n; canvas.setPointerCapture(e.pointerId); canvas.classList.add("dragging"); showInfo(n); } });
    const end = () => { drag = null; canvas.classList.remove("dragging"); };
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("pointerleave", () => { if (!drag) { hover = null; showInfo(null); } });

    App.graphFilter = (cat) => { filter = cat; alpha = Math.max(alpha, .3); };
    readColors(); build();
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { build(); }, 200); });
    App.on("theme", readColors);
    App.on("lang", () => { build(); });
    whenVisible(canvas, start, stop);
  };
})();
