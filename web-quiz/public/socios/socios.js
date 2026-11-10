(() => {
  const { guides, covers, challenges } = window.BRIO_CONTENT;
  const $screen = document.getElementById("screen");
  const $tabbar = document.getElementById("tabbar");
  const $back = document.getElementById("back");
  const $logout = document.getElementById("logout");
  const TOKEN_KEY = "brio_token";
  let me = null;
  let done = new Set();

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  async function api(path, body) {
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`/api/${path}`, {
      method: body ? "POST" : "GET",
      headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "No se ha podido conectar.");
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function mount(html, { tab = null, back = false } = {}) {
    $screen.style.animation = "none";
    void $screen.offsetWidth;
    $screen.style.animation = "";
    $screen.innerHTML = html;
    $tabbar.hidden = !tab;
    $back.hidden = !back;
    $logout.hidden = !tab;
    $tabbar.querySelectorAll("a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
    window.scrollTo({ top: 0 });
  }

  function toast(text) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }

  // ---------- personalization ----------
  function profile() {
    const a = me.answers || {};
    const w = a.weightKg || 70, t = a.targetKg || w, h = a.heightCm || 168;
    const ageMid = { "18-29": 25, "30-39": 35, "40-49": 45, "50+": 57 }[a.age] || 35;
    const woman = a.gender !== "hombre";
    const bmr = 10 * w + 6.25 * h - 5 * ageMid + (woman ? -161 : 5);
    const factor = [1.2, 1.35, 1.5, 1.7][Number(a.activity || 2) - 1];
    const loss = Math.max(0, w - t);
    const kcal = Math.max(woman ? 1300 : 1500, Math.round((bmr * factor - (loss > 0 ? 450 : 0)) / 10) * 10);
    const water = Math.max(1.6, Math.round(w * 0.033 * 10) / 10);
    const steps = [6000, 7000, 9000, 10000][Number(a.activity || 2) - 1];
    const rec = ["energia", "habitos"].includes(a.goal) ? "r21" : "r28";
    const recGuides = [];
    const habits = a.habits || [];
    if (habits.some((x) => ["noche", "dulce", "estres"].includes(x))) recGuides.push("antojos");
    if (Number(a.sleep) <= 6) recGuides.push("sueno");
    if (a.goal === "tonificar" || rec === "r28") recGuides.push("entreno", "proteina");
    recGuides.push("plato", "pasos");
    return { w, t, h, kcal, water, steps, rec, recGuides: [...new Set(recGuides)].slice(0, 3), loss, a };
  }

  const challengeById = (id) => challenges.find((c) => c.id === id);
  const dayDone = (c, d) => c.day(d, me.answers || {}).tasks.every((_, i) => done.has(`${c.id}:${d}:${i}`));
  const currentDay = (c) => { for (let d = 1; d <= c.days; d++) if (!dayDone(c, d)) return d; return c.days; };
  const pct = (c) => {
    let total = 0, n = 0;
    for (let d = 1; d <= c.days; d++) { const k = c.day(d, me.answers || {}).tasks.length; total += k; for (let i = 0; i < k; i++) if (done.has(`${c.id}:${d}:${i}`)) n++; }
    return Math.round((n / total) * 100);
  };
  function streak() {
    const days = new Set(me.progress.filter((p) => !p.item.startsWith("guide:")).map((p) => new Date(p.done_at).toDateString()));
    let s = 0; const d = new Date();
    if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
    while (days.has(d.toDateString())) { s++; d.setDate(d.getDate() - 1); }
    return s;
  }

  async function toggle(item, on) {
    if (on) { done.add(item); me.progress.push({ item, done_at: new Date().toISOString() }); }
    else { done.delete(item); me.progress = me.progress.filter((p) => p.item !== item); }
    try { await api("progress", { item, done: on }); }
    catch (e) { toast(e.message); }
  }

  // ---------- screens ----------
  function renderLogin(msg = "") {
    mount(`
      <div class="q-head">
        <span class="pill pill-light"><span class="dot"></span>Zona Brío</span>
        <h2 style="margin-top:12px">Entra en tu plan</h2>
        <p class="sub">Usa el email con el que pagaste y el código de acceso que te dimos al terminar.</p>
      </div>
      ${msg ? `<div class="hint warn"><span class="ic">✋</span><span>${esc(msg)}</span></div>` : ""}
      <input class="text-field" id="mail" type="email" placeholder="tu@email.com" autocomplete="email" inputmode="email" />
      <input class="text-field" id="code" type="text" placeholder="BRIO-XXXX-XXXX-XXXX" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" />
      <div class="cta-wrap"><button class="cta" id="go">Entrar</button>
      <a class="restart" href="/">¿Aún no tienes plan? Haz el test</a></div>
    `);
    const $go = $screen.querySelector("#go");
    $go.addEventListener("click", async () => {
      $go.disabled = true; $go.textContent = "Entrando…";
      try {
        const r = await api("login", { email: $screen.querySelector("#mail").value, code: $screen.querySelector("#code").value });
        localStorage.setItem(TOKEN_KEY, r.token);
        await boot();
      } catch (e) {
        renderLogin(e.message);
      }
    });
  }

  function renderExpired(msg) {
    mount(`
      <div class="inter screen" style="padding:0">
        <div class="state-icon warn">⏳</div>
        <h2>${esc(msg)}</h2>
        <p class="sub">Tu progreso se queda guardado: en cuanto renueves, lo tendrás todo como lo dejaste.</p>
      </div>
      <div class="cta-wrap"><a class="cta" href="/#planes">Ver planes</a><button class="restart" id="out">Cerrar sesión</button></div>
    `);
    $screen.querySelector("#out").addEventListener("click", logout);
  }

  function taskList(c, d) {
    const day = c.day(d, me.answers || {});
    return `<div class="tasks">${day.tasks.map((t, i) => {
      const id = `${c.id}:${d}:${i}`;
      return `<button class="opt task ${done.has(id) ? "selected" : ""}" data-item="${id}"><span class="check"></span><span class="txt">${esc(t)}</span></button>`;
    }).join("")}</div>`;
  }

  function bindTasks(after) {
    $screen.querySelectorAll(".task").forEach((b) => b.addEventListener("click", async () => {
      const on = !b.classList.contains("selected");
      b.classList.toggle("selected", on);
      await toggle(b.dataset.item, on);
      after?.(b.dataset.item, on);
    }));
  }

  function renderHome() {
    const p = profile();
    const c = challengeById(p.rec);
    const d = currentDay(c);
    const name = me.name ? esc(me.name) : "";
    const until = new Date(me.expiresAt).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
    mount(`
      <section class="result-hero home-hero">
        <span class="pill"><span class="dot"></span>${esc(me.plan)} · hasta el ${until}</span>
        <h2>Hola${name ? `, ${name}` : ""} 👋</h2>
        <p class="sub">${p.loss > 0 ? `Vamos a por tus ${p.t} kg, paso a paso.` : "Hoy toca sumar energía y fuerza."} Llevas <b style="color:#fff">${streak()} ${streak() === 1 ? "día" : "días"}</b> seguidos.</p>
      </section>
      <div class="kpis">
        <div class="kpi"><b>${p.kcal}</b><span>kcal/día</span></div>
        <div class="kpi"><b>${String(p.water).replace(".", ",")} L</b><span>de agua</span></div>
        <div class="kpi"><b>${(p.steps / 1000).toLocaleString("es-ES")}k</b><span>pasos</span></div>
      </div>
      <h3 class="section-t">Hoy en tu reto</h3>
      <div class="ch-card" style="--c:${c.color}">
        <div class="ch-top"><div><small>${esc(c.short)} · día ${d} de ${c.days}</small><h3>${esc(c.day(d, me.answers || {}).title)}</h3></div>${ringSvg(pct(c), c.color)}</div>
        ${taskList(c, d)}
        <a class="link-more" href="#/reto/${c.id}">Ver el reto completo →</a>
      </div>
      <h3 class="section-t">Elegidas para ti</h3>
      <div class="guide-row">${p.recGuides.map((id) => guideCard(guides.find((g) => g.id === id), true)).join("")}</div>
      <h3 class="section-t">Tu enfoque</h3>
      <div class="plan-list">${focusItems(p).map((x) => `<div class="plan-item"><span class="emo">${x.e}</span><div><h3>${x.h}</h3><p>${x.p}</p></div></div>`).join("")}</div>
    `, { tab: "inicio" });
    bindTasks((item, on) => { if (on && dayDone(c, d)) { toast("¡Día completado! 🎉"); setTimeout(renderHome, 600); } });
  }

  function focusItems(p) {
    const a = p.a, out = [];
    const zones = (a.zones || []).filter((z) => z !== "todo");
    const zoneTxt = zones.length ? zones.map((z) => ({ abdomen: "abdomen", brazos: "brazos", piernas: "piernas", gluteos: "glúteos" })[z]).join(", ") : "todo el cuerpo";
    out.push({ e: "🎯", h: `Zonas: ${zoneTxt}`, p: "Los circuitos del reto de 28 días se eligen para esas zonas." });
    if ((a.habits || []).includes("noche")) out.push({ e: "🌙", h: "Noches sin picoteo", p: "Cena con proteína y verdura, y cierra la cocina después." });
    if ((a.habits || []).includes("refrescos")) out.push({ e: "🥤", h: "Adiós a los refrescos", p: "Cámbialos por agua con gas, limón y hielo. Notarás la diferencia en dos semanas." });
    if ((a.habits || []).includes("desayuno")) out.push({ e: "☕", h: "Desayuno sencillo", p: "Algo con proteína en 5 minutos: yogur con fruta o una tostada con huevo." });
    if (Number(a.sleep) <= 6) out.push({ e: "😴", h: "Dormir más", p: "Tu meta: 20 minutos más de sueño cada noche esta semana." });
    if (Number(a.activity) <= 2) out.push({ e: "🚶", h: "Empezar suave", p: "Rutinas cortas y más pasos. La intensidad sube sola cada semana." });
    return out.slice(0, 4);
  }

  const ringSvg = (v, color) => {
    const c = 2 * Math.PI * 22;
    return `<svg class="mini-ring" viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="#ece5d8" stroke-width="6"/><circle cx="27" cy="27" r="22" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v / 100)}" transform="rotate(-90 27 27)"/><text x="27" y="31" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="12" fill="#12302f">${v}%</text></svg>`;
  };

  const guideCard = (g, small) => `<a class="guide-card ${small ? "small" : ""}" href="#/guia/${g.id}">
      <div class="cover">${covers[g.id]}${done.has(`guide:${g.id}`) ? '<span class="read">✓ Leída</span>' : ""}</div>
      <div class="gc-body"><small>${g.cat} · ${g.mins} min</small><h3>${esc(g.title)}</h3>${small ? "" : `<p>${esc(g.sub)}</p>`}</div>
    </a>`;

  function renderChallenges() {
    const rec = profile().rec;
    mount(`
      <div class="q-head"><h2>Retos</h2><p class="sub">Un paso cada día. Marca las tareas al hacerlas y el siguiente día se desbloquea.</p></div>
      <div class="plan-list">${challenges.map((c) => `
        <a class="ch-card link" href="#/reto/${c.id}" style="--c:${c.color}">
          <div class="ch-top"><div><small>${c.days} días${c.id === rec ? " · recomendado para ti" : ""}</small><h3>${esc(c.title)}</h3><p>${esc(c.sub)}</p></div>${ringSvg(pct(c), c.color)}</div>
          <div class="bar"><span style="width:${pct(c)}%"></span></div>
          <span class="link-more">${pct(c) ? `Seguir por el día ${currentDay(c)}` : "Empezar"} →</span>
        </a>`).join("")}</div>
    `, { tab: "retos" });
  }

  function renderChallenge(id, dayParam) {
    const c = challengeById(id);
    if (!c) return go("#/retos");
    const cur = currentDay(c);
    const d = Math.min(Math.max(1, Number(dayParam) || cur), cur);
    const day = c.day(d, me.answers || {});
    mount(`
      <section class="ch-hero" style="--c:${c.color}">
        <small>${c.days} días</small>
        <h2>${esc(c.title)}</h2>
        <div class="bar light"><span style="width:${pct(c)}%"></span></div>
        <p>${pct(c)}% completado · día ${cur} de ${c.days}</p>
      </section>
      <div class="day-grid">${Array.from({ length: c.days }, (_, i) => {
        const n = i + 1, isDone = dayDone(c, n), locked = n > cur;
        return `<button class="day ${isDone ? "done" : ""} ${n === d ? "on" : ""} ${locked ? "locked" : ""}" data-d="${n}" ${locked ? "disabled" : ""} aria-label="Día ${n}">${locked ? "🔒" : n}</button>`;
      }).join("")}</div>
      <h3 class="section-t">${esc(day.title)}</h3>
      ${taskList(c, d)}
      ${d === c.days && dayDone(c, d) ? `<div class="hint good" style="margin-top:16px"><span class="ic">🏆</span><span>¡Reto terminado! Pásate por Progreso para ver todo lo que has conseguido.</span></div>` : ""}
      <p class="fine">Si algún ejercicio te molesta, cámbialo por una versión más suave de la guía «Entrenar en 15 minutos en casa».</p>
    `, { tab: "retos", back: true });
    $screen.querySelectorAll(".day:not([disabled])").forEach((b) => b.addEventListener("click", () => go(`#/reto/${c.id}/${b.dataset.d}`)));
    bindTasks((item, on) => {
      if (on && dayDone(c, d)) { toast(d === c.days ? "¡Reto completado! 🏆" : `¡Día ${d} completado! 🎉`); setTimeout(() => renderChallenge(c.id, Math.min(c.days, d + 1)), 650); }
      else renderChallenge(c.id, d);
    });
  }

  function renderGuides() {
    mount(`
      <div class="q-head"><h2>Guías</h2><p class="sub">Lecturas cortas para entender qué haces y por qué funciona.</p></div>
      <div class="guide-list">${guides.map((g) => guideCard(g)).join("")}</div>
    `, { tab: "guias" });
  }

  function renderGuide(id) {
    const g = guides.find((x) => x.id === id);
    if (!g) return go("#/guias");
    const read = done.has(`guide:${g.id}`);
    mount(`
      <article class="guide">
        <div class="cover big">${covers[g.id]}</div>
        <small class="cat">${g.cat} · ${g.mins} min de lectura</small>
        <h2>${esc(g.title)}</h2>
        <p class="sub">${esc(g.sub)}</p>
        ${g.sections.map((s) => `<h3>${esc(s.h)}</h3>${s.p ? `<p>${esc(s.p)}</p>` : ""}${s.list ? `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : ""}`).join("")}
      </article>
      <div class="cta-wrap"><button class="cta ${read ? "dark" : ""}" id="read">${read ? "✓ Leída" : "Marcar como leída"}</button></div>
    `, { tab: "guias", back: true });
    $screen.querySelector("#read").addEventListener("click", async () => {
      await toggle(`guide:${g.id}`, !read);
      if (!read) toast("Guía marcada como leída");
      renderGuide(g.id);
    });
  }

  function weightChart(p) {
    const pts = [{ day: "inicio", kg: p.w }, ...me.weights];
    const W = 320, H = 140, pad = 18;
    const vals = pts.map((x) => x.kg).concat(p.t);
    const lo = Math.min(...vals) - 1, hi = Math.max(...vals) + 1;
    const y = (v) => pad + ((hi - v) / (hi - lo)) * (H - pad * 2);
    const x = (i) => pad + (pts.length === 1 ? 0 : (i / (pts.length - 1)) * (W - pad * 2));
    const d = pts.map((pt, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(pt.kg).toFixed(1)}`).join(" ");
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del peso">
      <line x1="${pad}" x2="${W - pad}" y1="${y(p.t)}" y2="${y(p.t)}" stroke="#5fcf98" stroke-width="2" stroke-dasharray="5 5"/>
      <text x="${W - pad}" y="${y(p.t) - 6}" text-anchor="end" font-size="11" fill="#24564d" font-family="DM Sans" font-weight="700">Meta ${p.t} kg</text>
      <path d="${d}" fill="none" stroke="#ff7a59" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map((pt, i) => `<circle cx="${x(i)}" cy="${y(pt.kg)}" r="4.5" fill="#fff" stroke="#ff7a59" stroke-width="2.5"/>`).join("")}
    </svg>`;
  }

  function renderProgress() {
    const p = profile();
    const last = me.weights.length ? me.weights[me.weights.length - 1].kg : p.w;
    const diff = Math.round((p.w - last) * 10) / 10;
    const tasksDone = me.progress.filter((x) => !x.item.startsWith("guide:")).length;
    const guidesRead = guides.filter((g) => done.has(`guide:${g.id}`)).length;
    mount(`
      <div class="q-head"><h2>Tu progreso</h2></div>
      <div class="kpis">
        <div class="kpi"><b>🔥 ${streak()}</b><span>días seguidos</span></div>
        <div class="kpi"><b>${tasksDone}</b><span>tareas hechas</span></div>
        <div class="kpi"><b>${guidesRead}/${guides.length}</b><span>guías leídas</span></div>
      </div>
      <h3 class="section-t">Peso</h3>
      <div class="bmi">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-family:var(--display);font-size:28px">${String(last).replace(".", ",")} kg</b><span style="font-weight:700;color:${diff > 0 ? "var(--teal-2)" : "var(--ink-soft)"}">${diff > 0 ? `−${String(diff).replace(".", ",")} kg desde el inicio` : "Punto de partida"}</span></div>
        <div class="chart light">${weightChart(p)}</div>
        <div class="weight-row"><input class="text-field" id="kg" type="number" inputmode="decimal" step="0.1" placeholder="Peso de hoy (kg)" /><button class="cta dark" id="save">Guardar</button></div>
      </div>
      <h3 class="section-t">Retos</h3>
      <div class="plan-list">${challenges.map((c) => `<a class="ch-card link" href="#/reto/${c.id}" style="--c:${c.color}"><div class="ch-top"><div><small>${c.days} días</small><h3>${esc(c.title)}</h3></div>${ringSvg(pct(c), c.color)}</div><div class="bar"><span style="width:${pct(c)}%"></span></div></a>`).join("")}</div>
      <h3 class="section-t">Tu acceso</h3>
      <div class="bmi" id="access">
        <p class="sub" style="margin:0">Entras con <b>${esc(me.email)}</b> y tu código de acceso. Si lo has perdido, crea uno nuevo: el anterior dejará de funcionar y se cerrarán tus otras sesiones.</p>
        <button class="cta dark" id="newcode" style="margin-top:12px">Crear nuevo código</button>
      </div>
    `, { tab: "progreso" });
    $screen.querySelector("#newcode").addEventListener("click", async () => {
      if (!confirm("¿Crear un código nuevo? El anterior dejará de funcionar y se cerrará la sesión en tus otros dispositivos.")) return;
      try {
        const { accessCode } = await api("code", {});
        $screen.querySelector("#access").innerHTML = `<div class="code-box" style="margin:0"><small>Tu nuevo código de acceso</small><b>${esc(accessCode)}</b></div><p class="fine">Guárdalo: lo necesitarás para entrar desde otro dispositivo.</p>`;
      } catch (e) { toast(e.message); }
    });
    $screen.querySelector("#save").addEventListener("click", async () => {
      const kg = parseFloat($screen.querySelector("#kg").value.replace(",", "."));
      try {
        await api("weight", { kg });
        const today = new Date().toISOString().slice(0, 10);
        me.weights = me.weights.filter((w) => w.day !== today).concat({ day: today, kg: Math.round(kg * 10) / 10 });
        toast("Peso guardado");
        renderProgress();
      } catch (e) { toast(e.message); }
    });
  }

  // ---------- routing ----------
  const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };
  function route() {
    if (!me) return;
    const [, view, a, b] = (location.hash || "#/inicio").split("/");
    if (view === "retos") return renderChallenges();
    if (view === "reto") return renderChallenge(a, b);
    if (view === "guias") return renderGuides();
    if (view === "guia") return renderGuide(a);
    if (view === "progreso") return renderProgress();
    return renderHome();
  }
  window.addEventListener("hashchange", route);
  $back.addEventListener("click", () => history.length > 1 ? history.back() : go("#/inicio"));
  $logout.addEventListener("click", logout);
  async function logout() {
    try { await api("logout", {}); } catch {}
    localStorage.removeItem(TOKEN_KEY); me = null; renderLogin();
  }

  async function boot() {
    if (!localStorage.getItem(TOKEN_KEY)) return renderLogin();
    mount(`<div class="loading screen" style="padding:0"><div class="spinner"></div></div>`);
    try {
      me = await api("me");
      done = new Set(me.progress.map((p) => p.item));
      route();
    } catch (e) {
      if (e.status === 402) return renderExpired(e.message);
      localStorage.removeItem(TOKEN_KEY);
      renderLogin(e.status === 401 ? e.message : "No hemos podido cargar tu zona. Inténtalo de nuevo.");
    }
  }
  boot();
})();
