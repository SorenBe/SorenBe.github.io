/* ==========================================================================
   CORE — utilitaires, état global, i18n, bus d'événements, toasts
   ========================================================================== */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const h = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k === "style" && typeof v === "object") for (const [sk, sv] of Object.entries(v)) sk.startsWith("--") ? el.style.setProperty(sk, sv) : (el.style[sk] = sv);
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) if (c != null) el.append(c.nodeType ? c : document.createTextNode(c));
    return el;
  };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- stockage tolérant aux erreurs ---- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("zb." + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("zb." + k, JSON.stringify(v)); } catch {} }
  };

  /* ---- bus d'événements ---- */
  const listeners = {};
  const on = (ev, fn) => ((listeners[ev] ||= []).push(fn), fn);
  const emit = (ev, data) => (listeners[ev] || []).forEach((fn) => fn(data));

  /* ---- état ---- */
  const navLang = (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
  const sysTheme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  const state = {
    lang: store.get("lang", navLang),
    theme: store.get("theme", document.documentElement.dataset.theme || sysTheme),
  };

  /* ---- i18n ---- */
  const t = (key) => {
    const d = App.i18n[state.lang] || App.i18n.fr;
    return d[key] ?? App.i18n.fr[key] ?? key;
  };
  const L = (obj) => (obj && typeof obj === "object" && !Array.isArray(obj) ? obj[state.lang] ?? obj.fr : obj);

  function applyI18n(root = document) {
    $$("[data-i18n]", root).forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]", root).forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.documentElement.lang = state.lang;
    const lbl = $("#lang-label"); if (lbl) lbl.textContent = state.lang === "fr" ? "EN" : "FR";
  }

  function setLang(lang, silent) {
    if (lang !== "fr" && lang !== "en") return;
    state.lang = lang; store.set("lang", lang);
    applyI18n(); emit("lang", lang);
    if (!silent) toast(t("toast.lang"));
  }

  function setTheme(theme, silent) {
    if (theme !== "dark" && theme !== "light") return;
    state.theme = theme; store.set("theme", theme);
    document.documentElement.dataset.theme = theme;
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = theme === "dark" ? "#06090d" : "#f4f6f9";
    emit("theme", theme);
    if (!silent) toast(t(theme === "dark" ? "toast.theme.dark" : "toast.theme.light"));
  }

  /* lecture des tokens CSS (pour les canvas) */
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* ---- toasts ---- */
  function toast(msg, ms = 2400) {
    const box = $("#toasts"); if (!box) return;
    const el = h("div", { class: "toast" }, msg);
    box.append(el);
    setTimeout(() => { el.classList.add("out"); el.addEventListener("animationend", () => el.remove(), { once: true }); }, ms);
  }

  /* ---- canvas haute résolution ---- */
  function fitCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), hgt = Math.max(1, Math.round(r.height));
    if (canvas.width !== w * dpr || canvas.height !== hgt * dpr) {
      canvas.width = w * dpr; canvas.height = hgt * dpr;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h: hgt, dpr };
  }

  /* exécute fn seulement quand l'élément est visible (économie CPU) */
  function whenVisible(el, onShow, onHide) {
    const io = new IntersectionObserver((ents) => ents.forEach((e) => (e.isIntersecting ? onShow() : onHide && onHide())), { threshold: 0.01 });
    io.observe(el); return io;
  }

  /* sparkline */
  function sparkline(canvas, data, color, max) {
    const { ctx, w, h: H } = fitCanvas(canvas);
    ctx.clearRect(0, 0, w, H);
    if (!data.length) return;
    const m = max || Math.max(...data, 1) * 1.15;
    const step = w / (data.length - 1 || 1);
    ctx.beginPath();
    data.forEach((v, i) => { const x = i * step, y = H - (v / m) * (H - 4) - 2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineJoin = "round"; ctx.stroke();
    ctx.lineTo(w, H); ctx.lineTo(0, H); ctx.closePath();
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, color + "55"); g.addColorStop(1, color + "00");
    ctx.fillStyle = g; ctx.fill();
  }

  Object.assign(App, { $, $$, h, clamp, lerp, rand, pick, esc, sleep, reducedMotion, store, on, emit, state, t, L, applyI18n, setLang, setTheme, css, toast, fitCanvas, whenVisible, sparkline });
})();
