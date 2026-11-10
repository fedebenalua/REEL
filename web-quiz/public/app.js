(() => {
  const $screen = document.getElementById("screen");
  const $back = document.getElementById("back");
  const $progressWrap = document.getElementById("progressWrap");
  const $progress = document.getElementById("progress");
  const $stepCount = document.getElementById("stepCount");

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const state = { units: "metric", answers: {} };
  const A = state.answers;

  function figure({ w = 1, skin = "#f2c29b", top = "#1d6b63", bottom = "#0f3d3e", hair = "#3b2a20", long = false, bg = "#ffe9c7" } = {}) {
    const hw = 18 * w, ww = 14 * w, hip = 17 * w;
    const hairPath = long
      ? `<path d="M41 30c0-12 7-18 19-18s19 6 19 18v18c-4 3-8 4-10 4V34H51v18c-3 0-7-1-10-4z" fill="${hair}"/>`
      : `<path d="M44 28c0-10 6-15 16-15s16 5 16 15c-4-4-9-6-16-6s-12 2-16 6z" fill="${hair}"/>`;
    return `<svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="62" r="54" fill="${bg}"/>
      <path d="M${60 - hw} 60 Q${60 - hw - 4} 66 ${60 - ww} 82 L${60 - hip} 96 Q60 102 ${60 + hip} 96 L${60 + ww} 82 Q${60 + hw + 4} 66 ${60 + hw} 60 Q60 52 ${60 - hw} 60z" fill="${top}"/>
      <path d="M${60 - hip} 95 L${60 - hip + 2} 118 L${58} 118 L60 104 L${62} 118 L${60 + hip - 2} 118 L${60 + hip} 95 Q60 100 ${60 - hip} 95z" fill="${bottom}"/>
      <rect x="55" y="44" width="10" height="12" rx="4" fill="${skin}"/>
      <circle cx="60" cy="33" r="14" fill="${skin}"/>
      ${hairPath}
      <circle cx="55" cy="35" r="1.6" fill="#2b2b2b"/><circle cx="65" cy="35" r="1.6" fill="#2b2b2b"/>
      <path d="M56 40q4 3 8 0" stroke="#2b2b2b" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </svg>`;
  }
  const isWoman = () => A.gender === "mujer";
  const fig = (opts) => figure({ long: isWoman(), hair: isWoman() ? "#6b3e26" : "#3b2a20", ...opts });

  const heroArt = `<svg class="hero-art" viewBox="0 0 360 200" aria-hidden="true">
    <defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf7a"/><stop offset="1" stop-color="#ff9a6b"/></linearGradient></defs>
    <circle cx="270" cy="70" r="46" fill="url(#sun)"/>
    <path d="M0 150 Q90 100 180 140 T360 120 V200 H0z" fill="#1d6b63"/>
    <path d="M0 175 Q120 140 220 170 T360 160 V200 H0z" fill="#2a8a7c"/>
    <g transform="translate(70 40)">
      <circle cx="40" cy="22" r="14" fill="#f2c29b"/>
      <path d="M27 18c2-10 22-12 27 0-6-3-20-3-27 0z" fill="#3b2a20"/>
      <path d="M30 40 L50 40 L56 80 L24 80z" fill="#ffb547"/>
      <path d="M30 44 L8 62 M50 44 L72 30" stroke="#f2c29b" stroke-width="8" stroke-linecap="round"/>
      <path d="M28 80 L16 118 M52 80 L66 112" stroke="#0f3d3e" stroke-width="10" stroke-linecap="round"/>
    </g>
    <g fill="#fff" opacity=".7"><circle cx="40" cy="40" r="2"/><circle cx="190" cy="30" r="1.5"/><circle cx="330" cy="140" r="2"/></g>
  </svg>`;

  const ring = (pct, color = "#1d6b63") => {
    const c = 2 * Math.PI * 26;
    return `<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#e8e0d3" stroke-width="7"/>
      <circle cx="32" cy="32" r="26" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}" transform="rotate(-90 32 32)"/>
      <text x="32" y="37" text-anchor="middle" font-family="Bricolage Grotesque" font-weight="800" font-size="15" fill="#12302f">${pct}%</text></svg>`;
  };

  const kgOf = (v) => (state.units === "metric" ? v : v * 0.4536);
  const cmOf = (v) => (state.units === "metric" ? v : v * 2.54);
  const fmtW = (kg) => (state.units === "metric" ? `${Math.round(kg)} kg` : `${Math.round(kg / 0.4536)} lb`);
  const bmi = () => {
    const h = cmOf(A.height) / 100;
    return kgOf(A.weight) / (h * h);
  };

  const steps = [
    {
      id: "age", type: "single", title: "¿En qué etapa de la vida estás?", sub: "Ajustamos el ritmo y la intensidad a tu edad.",
      options: [
        { v: "18-29", t: "18 – 29 años", e: "🌱" },
        { v: "30-39", t: "30 – 39 años", e: "🌿" },
        { v: "40-49", t: "40 – 49 años", e: "🌳" },
        { v: "50+", t: "50 años o más", e: "🍂" },
      ],
    },
    {
      id: "goal", type: "single", title: "¿Qué te gustaría conseguir primero?",
      options: [
        { v: "perder", t: "Perder peso", s: "Bajar kilos sin dietas extremas", e: "⚖️" },
        { v: "tonificar", t: "Tonificar", s: "Más firmeza y definición", e: "💪" },
        { v: "energia", t: "Tener más energía", s: "Dejar de ir siempre cansado", e: "⚡" },
        { v: "habitos", t: "Comer mejor", s: "Crear hábitos que duren", e: "🥗" },
      ],
    },
    {
      id: "body", type: "tiles", title: "¿Cómo describirías tu cuerpo hoy?", sub: "Elige la figura que más se parezca a ti.",
      options: [
        { v: "delgado", t: "Delgado", w: 0.8 },
        { v: "medio", t: "Medio", w: 1 },
        { v: "relleno", t: "Con curvas", w: 1.25 },
        { v: "grande", t: "Grande", w: 1.5 },
      ],
    },
    {
      id: "zones", type: "multi", title: "¿En qué zonas quieres notar el cambio?", sub: "Puedes marcar varias.",
      options: [
        { v: "abdomen", t: "Abdomen", e: "🎯" },
        { v: "brazos", t: "Brazos", e: "💪" },
        { v: "piernas", t: "Piernas", e: "🦵" },
        { v: "gluteos", t: "Glúteos", e: "🍑" },
        { v: "todo", t: "Todo el cuerpo", e: "✨" },
      ],
    },
    {
      id: "ideal", type: "single", title: "¿Cuándo fue la última vez que te sentiste a gusto con tu peso?",
      options: [
        { v: "ahora", t: "Ahora mismo, quiero mantenerlo", e: "😊" },
        { v: "1", t: "Hace menos de un año", e: "📅" },
        { v: "3", t: "Hace entre 1 y 3 años", e: "🗓️" },
        { v: "mas", t: "Hace más de 3 años", e: "⏳" },
        { v: "nunca", t: "Nunca", e: "🤷" },
      ],
    },
    {
      id: "activity", type: "single", title: "¿Cuánto te mueves en un día normal?",
      options: [
        { v: "1", t: "Poco", s: "Paso casi todo el día sentado", e: "🪑" },
        { v: "2", t: "Algo", s: "Camino un rato casi todos los días", e: "🚶" },
        { v: "3", t: "Bastante", s: "Entreno 2 o 3 veces por semana", e: "🏃" },
        { v: "4", t: "Mucho", s: "Hago deporte casi a diario", e: "🏋️" },
      ],
    },
    { id: "inter1", type: "inter" },
    {
      id: "habits", type: "multi", title: "¿Te reconoces en alguno de estos hábitos?", sub: "Sin juicios: solo nos ayuda a afinar tu plan.",
      options: [
        { v: "noche", t: "Pico entre horas por la noche", e: "🌙" },
        { v: "dulce", t: "Me cuesta resistirme al dulce", e: "🍫" },
        { v: "refrescos", t: "Bebo refrescos a menudo", e: "🥤" },
        { v: "desayuno", t: "Me salto el desayuno", e: "☕" },
        { v: "estres", t: "Como más cuando estoy estresado", e: "😮‍💨" },
        { v: "ninguno", t: "Ninguno de estos", e: "👌", exclusive: true },
      ],
    },
    {
      id: "water", type: "single", title: "¿Cuánta agua bebes al día?",
      options: [
        { v: "1", t: "Casi nada, solo café o refrescos", e: "🫗" },
        { v: "2", t: "Unos 2 vasos", e: "🥛" },
        { v: "3", t: "Entre 3 y 6 vasos", e: "💧" },
        { v: "4", t: "Más de 6 vasos", e: "🌊" },
      ],
    },
    {
      id: "sleep", type: "single", title: "¿Cuántas horas duermes normalmente?",
      options: [
        { v: "5", t: "Menos de 5 horas", e: "😵" },
        { v: "6", t: "Entre 5 y 6 horas", e: "🥱" },
        { v: "7", t: "Entre 7 y 8 horas", e: "😴" },
        { v: "9", t: "Más de 8 horas", e: "🛌" },
      ],
    },
    { id: "height", type: "number", title: "¿Cuánto mides?", metric: { unit: "cm", min: 130, max: 230 }, imperial: { unit: "in", min: 51, max: 90 } },
    { id: "weight", type: "number", title: "¿Cuánto pesas ahora?", metric: { unit: "kg", min: 35, max: 250 }, imperial: { unit: "lb", min: 77, max: 550 } },
    { id: "target", type: "number", title: "¿Y cuál es el peso al que te gustaría llegar?", metric: { unit: "kg", min: 35, max: 250 }, imperial: { unit: "lb", min: 77, max: 550 } },
    {
      id: "event", type: "single", title: "¿Tienes alguna fecha en mente?", sub: "Una meta con fecha motiva el doble.",
      options: [
        { v: "vacaciones", t: "Unas vacaciones", e: "🏖️" },
        { v: "boda", t: "Una boda o celebración", e: "💍" },
        { v: "cumple", t: "Mi cumpleaños", e: "🎂" },
        { v: "deporte", t: "Una carrera o reto deportivo", e: "🏅" },
        { v: "no", t: "No, solo quiero empezar ya", e: "🚀" },
      ],
    },
    { id: "loading", type: "loading" },
    { id: "email", type: "email" },
    { id: "result", type: "result" },
  ];

  const quizSteps = steps.filter((s) => !["loading", "email", "result"].includes(s.type)).length;
  let idx = -1;

  function setChrome() {
    const inQuiz = idx >= 0 && steps[idx] && !["loading", "result"].includes(steps[idx].type);
    $back.hidden = idx < 0 || (steps[idx] && ["loading", "result"].includes(steps[idx].type));
    $progressWrap.hidden = !inQuiz;
    const n = Math.min(idx + 1, quizSteps);
    $stepCount.textContent = inQuiz && idx < quizSteps ? `${n}/${quizSteps}` : "";
    $progress.style.width = `${Math.min(100, ((idx + 1) / (quizSteps + 1)) * 100)}%`;
  }

  function mount(html) {
    $screen.style.animation = "none";
    void $screen.offsetWidth;
    $screen.style.animation = "";
    $screen.innerHTML = html;
    window.scrollTo({ top: 0 });
    setChrome();
  }

  function go(i) {
    idx = i;
    if (idx < 0) return renderIntro();
    const s = steps[idx];
    ({ single: renderChoice, multi: renderChoice, tiles: renderTiles, number: renderNumber, inter: renderInter, loading: renderLoading, email: renderEmail, result: renderResult })[s.type](s);
  }
  const next = () => go(idx + 1);
  $back.addEventListener("click", () => {
    let i = idx - 1;
    while (i >= 0 && steps[i].type === "loading") i--;
    go(i);
  });

  function renderIntro() {
    mount(`
      <section class="hero">
        <span class="pill"><span class="dot"></span>Test de 2 minutos</span>
        <h1>Tu cuerpo, <span style="color:var(--amber)">a tu ritmo</span>.</h1>
        <p class="sub">Contesta unas preguntas y te preparamos un plan de comida, movimiento y hábitos pensado solo para ti.</p>
        ${heroArt}
      </section>
      <p class="intro-q">Para empezar, ¿cómo te identificas?</p>
      <div class="gender-grid">
        <button class="gender" data-g="mujer">${figure({ long: true, hair: "#6b3e26", top: "#ff7a59", bg: "#ffe4d9" })}<span>Mujer →</span></button>
        <button class="gender" data-g="hombre">${figure({ top: "#1d6b63", bg: "#d8efe6" })}<span>Hombre →</span></button>
      </div>
      <div class="trust">
        <div><b>${quizSteps}</b>preguntas</div>
        <div><b>2 min</b>de tu tiempo</div>
        <div><b>100%</b>personalizado</div>
      </div>
      <p class="fine">Brío no sustituye el consejo médico. Si tienes alguna condición de salud, consulta con un profesional antes de cambiar tu dieta o ejercicio.</p>
    `);
    $screen.querySelectorAll(".gender").forEach((b) =>
      b.addEventListener("click", () => { A.gender = b.dataset.g; go(0); })
    );
  }

  function renderChoice(s) {
    const multi = s.type === "multi";
    const sel = new Set(multi ? A[s.id] || [] : A[s.id] ? [A[s.id]] : []);
    mount(`
      <div class="q-head"><h2>${s.title}</h2>${s.sub ? `<p class="sub">${s.sub}</p>` : ""}</div>
      <div class="options">
        ${s.options.map((o) => `
          <button class="opt ${multi ? "" : "radio"} ${sel.has(o.v) ? "selected" : ""}" data-v="${o.v}">
            <span class="emo">${o.e}</span>
            <span class="txt">${o.t}${o.s ? `<small>${o.s}</small>` : ""}</span>
            <span class="check"></span>
          </button>`).join("")}
      </div>
      ${multi ? `<div class="cta-wrap"><button class="cta" id="cont" ${sel.size ? "" : "disabled"}>Continuar</button></div>` : ""}
    `);
    const btns = [...$screen.querySelectorAll(".opt")];
    btns.forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.v;
      if (!multi) {
        A[s.id] = v;
        btns.forEach((x) => x.classList.toggle("selected", x === b));
        setTimeout(next, 220);
        return;
      }
      const opt = s.options.find((o) => o.v === v);
      if (sel.has(v)) sel.delete(v);
      else {
        if (opt.exclusive) sel.clear();
        else s.options.filter((o) => o.exclusive).forEach((o) => sel.delete(o.v));
        sel.add(v);
      }
      btns.forEach((x) => x.classList.toggle("selected", sel.has(x.dataset.v)));
      A[s.id] = [...sel];
      $screen.querySelector("#cont").disabled = !sel.size;
    }));
    if (multi) $screen.querySelector("#cont").addEventListener("click", next);
  }

  function renderTiles(s) {
    const palette = isWoman() ? ["#ff7a59", "#ffe4d9"] : ["#1d6b63", "#d8efe6"];
    mount(`
      <div class="q-head"><h2>${s.title}</h2>${s.sub ? `<p class="sub">${s.sub}</p>` : ""}</div>
      <div class="grid2">
        ${s.options.map((o) => `<button class="tile ${A[s.id] === o.v ? "selected" : ""}" data-v="${o.v}">${fig({ w: o.w, top: palette[0], bg: palette[1] })}${o.t}</button>`).join("")}
      </div>
    `);
    $screen.querySelectorAll(".tile").forEach((b) => b.addEventListener("click", () => {
      A[s.id] = b.dataset.v;
      $screen.querySelectorAll(".tile").forEach((x) => x.classList.toggle("selected", x === b));
      setTimeout(next, 220);
    }));
  }

  function numberHint(s, val) {
    if (!val) return "";
    if (s.id === "weight" && A.height) {
      const b = kgOf(val) / Math.pow(cmOf(A.height) / 100, 2);
      if (b < 18.5) return `<div class="hint warn"><span class="ic">💡</span><span>Tu IMC es <b>${b.toFixed(1)}</b>, algo por debajo de lo recomendado. Enfocaremos tu plan en ganar fuerza y energía.</span></div>`;
      if (b < 25) return `<div class="hint good"><span class="ic">👍</span><span>Tu IMC es <b>${b.toFixed(1)}</b>, dentro del rango saludable. ¡Buen punto de partida!</span></div>`;
      return `<div class="hint warn"><span class="ic">💡</span><span>Tu IMC es <b>${b.toFixed(1)}</b>. Con pequeños cambios constantes puedes notar mucha diferencia en pocas semanas.</span></div>`;
    }
    if (s.id === "target" && A.weight) {
      const diff = kgOf(A.weight) - kgOf(val);
      const pct = (diff / kgOf(A.weight)) * 100;
      if (diff <= 0) return `<div class="hint good"><span class="ic">🎯</span><span>Objetivo: mantener o ganar. Pondremos el foco en tonificar y en tu energía.</span></div>`;
      if (pct > 25) return `<div class="hint warn"><span class="ic">🧭</span><span>Es un objetivo ambicioso (${Math.round(pct)}% de tu peso). Lo dividiremos en metas pequeñas para que sea realista.</span></div>`;
      return `<div class="hint good"><span class="ic">🎯</span><span>Perder un <b>${Math.round(pct)}%</b> de tu peso es una meta realista y con beneficios para tu salud.</span></div>`;
    }
    if (s.id === "height") return `<div class="hint"><span class="ic">📏</span><span>Lo usamos para calcular tu IMC y tus necesidades de energía.</span></div>`;
    return "";
  }

  function renderNumber(s) {
    const cfg = s[state.units];
    const val = A[s.id] || "";
    mount(`
      <div class="q-head"><h2>${s.title}</h2></div>
      <div class="unit-toggle" role="tablist">
        <button data-u="metric" class="${state.units === "metric" ? "on" : ""}">${s.id === "height" ? "cm" : "kg"}</button>
        <button data-u="imperial" class="${state.units === "imperial" ? "on" : ""}">${s.id === "height" ? "pulgadas" : "lb"}</button>
      </div>
      <label class="num-field">
        <input id="num" type="number" inputmode="decimal" placeholder="0" value="${val}" min="${cfg.min}" max="${cfg.max}" aria-label="${s.title}" />
        <span>${cfg.unit}</span>
      </label>
      <div id="hint">${numberHint(s, val)}</div>
      <div class="cta-wrap"><button class="cta" id="cont" disabled>Continuar</button></div>
    `);
    const $in = $screen.querySelector("#num");
    const $cont = $screen.querySelector("#cont");
    const $hint = $screen.querySelector("#hint");
    const validate = () => {
      const v = parseFloat($in.value);
      const ok = v >= cfg.min && v <= cfg.max;
      $cont.disabled = !ok;
      $hint.innerHTML = ok ? numberHint(s, v) : $in.value ? `<div class="hint warn"><span class="ic">✋</span><span>Introduce un valor entre ${cfg.min} y ${cfg.max} ${cfg.unit}.</span></div>` : numberHint(s, 0);
      return ok ? v : null;
    };
    $in.addEventListener("input", validate);
    $in.addEventListener("keydown", (e) => { if (e.key === "Enter" && !$cont.disabled) $cont.click(); });
    $cont.addEventListener("click", () => { const v = validate(); if (v) { A[s.id] = v; next(); } });
    $screen.querySelectorAll(".unit-toggle button").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.u === state.units) return;
      const conv = (v, id) => id === "height" ? (state.units === "metric" ? v / 2.54 : v * 2.54) : (state.units === "metric" ? v / 0.4536 : v * 0.4536);
      ["height", "weight", "target"].forEach((id) => { if (A[id]) A[id] = Math.round(conv(A[id], id)); });
      state.units = b.dataset.u;
      renderNumber(s);
    }));
    validate();
    setTimeout(() => $in.focus(), 50);
  }

  function renderInter() {
    const low = Number(A.activity) <= 2;
    mount(`
      <div class="inter screen" style="padding:0">
        <svg class="big-art" viewBox="0 0 220 180" aria-hidden="true">
          <circle cx="110" cy="96" r="80" fill="#d8efe6"/>
          <path d="M40 140 C70 60, 120 160, 180 50" fill="none" stroke="#1d6b63" stroke-width="8" stroke-linecap="round"/>
          <circle cx="180" cy="50" r="14" fill="#ffb547"/>
          <path d="M174 50l4 4 8-9" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="40" cy="140" r="8" fill="#ff7a59"/>
        </svg>
        <h2>${low ? "Empezar desde el sofá es más común de lo que crees" : "Ya tienes una base que juega a tu favor"}</h2>
        <p class="sub">${low
          ? "No necesitas horas de gimnasio. Tu plan arranca con sesiones de 10 minutos que puedes hacer en casa y sube poco a poco."
          : "Aprovecharemos tu actividad actual y la combinaremos con ajustes en la comida para que los resultados se noten antes."}</p>
        <div class="stat-card">
          <div class="row">${ring(low ? 72 : 64)}
            <p><b>${low ? "7 de cada 10" : "Más de la mitad"}</b> de las personas que empiezan con Brío en tu misma situación notan más energía en las primeras 3 semanas.</p>
          </div>
        </div>
      </div>
      <div class="cta-wrap"><button class="cta dark" id="cont">Seguir</button></div>
    `);
    $screen.querySelector("#cont").addEventListener("click", next);
  }

  function renderLoading() {
    const items = ["Analizando tu perfil", "Calculando tus calorías ideales", "Eligiendo tus entrenamientos", "Preparando recetas a tu gusto"];
    mount(`
      <div class="loading screen" style="padding:0">
        <div class="loader-ring">
          <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#e8e0d3" stroke-width="8"/>
          <circle id="arc" cx="50" cy="50" r="44" fill="none" stroke="#1d6b63" stroke-width="8" stroke-linecap="round" stroke-dasharray="276.5" stroke-dashoffset="276.5"/></svg>
          <div class="pct" id="pct">0%</div>
        </div>
        <h2>Creando tu plan…</h2>
        <ul class="load-steps">${items.map((t) => `<li><span class="b"></span>${t}</li>`).join("")}</ul>
      </div>
    `);
    const $arc = $screen.querySelector("#arc"), $pct = $screen.querySelector("#pct"), lis = $screen.querySelectorAll("li");
    const myIdx = idx, start = performance.now(), dur = 4200;
    const tick = (t) => {
      if (idx !== myIdx) return;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 2);
      $arc.style.strokeDashoffset = 276.5 * (1 - e);
      $pct.textContent = `${Math.round(e * 100)}%`;
      lis.forEach((li, i) => li.classList.toggle("done", e >= (i + 1) / items.length - 0.01));
      if (p < 1) requestAnimationFrame(tick); else setTimeout(next, 450);
    };
    requestAnimationFrame(tick);
  }

  function renderEmail() {
    mount(`
      <div class="q-head">
        <h2>¡Tu plan está listo! ¿Cómo te llamas?</h2>
        <p class="sub">Así personalizamos tu plan. Tu email será tu usuario si decides activar tu zona Brío.</p>
      </div>
      <input class="text-field" id="name" type="text" placeholder="Tu nombre" autocomplete="given-name" value="${esc(A.name || "")}" />
      <input class="text-field" id="mail" type="email" placeholder="tu@email.com" autocomplete="email" inputmode="email" value="${esc(A.email || "")}" />
      <div class="privacy"><span>🔒</span><span>Hasta que compres un plan, tus respuestas, tu nombre y tu email solo están en este navegador. Si compras, los guardamos en Brío para darte acceso y personalizar tu zona, y el pago lo procesa Square. No los vendemos ni los usamos para publicidad.</span></div>
      <div class="cta-wrap"><button class="cta" id="cont" disabled>Ver mi plan</button></div>
    `);
    const $m = $screen.querySelector("#mail"), $n = $screen.querySelector("#name"), $c = $screen.querySelector("#cont");
    const ok = () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($m.value.trim());
    const upd = () => ($c.disabled = !ok());
    $m.addEventListener("input", upd);
    $m.addEventListener("keydown", (e) => { if (e.key === "Enter" && ok()) $c.click(); });
    $c.addEventListener("click", () => { A.email = $m.value.trim(); A.name = $n.value.trim(); next(); });
    upd();
  }

  function planData() {
    const w = kgOf(A.weight), t = kgOf(A.target);
    const loss = Math.max(0, w - t);
    const rate = w * (Number(A.activity) >= 3 ? 0.008 : 0.0065);
    const weeks = loss > 0 ? Math.max(4, Math.ceil(loss / rate)) : 8;
    const date = new Date(Date.now() + weeks * 7 * 864e5);
    const ageMid = { "18-29": 25, "30-39": 35, "40-49": 45, "50+": 57 }[A.age] || 35;
    const h = cmOf(A.height);
    const bmr = 10 * w + 6.25 * h - 5 * ageMid + (isWoman() ? -161 : 5);
    const factor = [1.2, 1.35, 1.5, 1.7][Number(A.activity) - 1] || 1.3;
    const kcal = Math.round((bmr * factor - (loss > 0 ? 450 : 0)) / 10) * 10;
    const waterL = Math.max(1.6, Math.round(w * 0.033 * 10) / 10);
    return { w, t, loss, weeks, date, kcal: Math.max(isWoman() ? 1300 : 1500, kcal), waterL };
  }

  function chartSvg({ w, t, weeks, date }) {
    const W = 320, H = 150, pad = 16;
    const lo = Math.min(w, t) - 3, hi = Math.max(w, t) + 3;
    const y = (v) => pad + (hi - v) / (hi - lo) * (H - pad * 2 - 18);
    const pts = Array.from({ length: 7 }, (_, i) => {
      const p = i / 6;
      const e = 1 - Math.pow(1 - p, 1.6);
      return [pad + p * (W - pad * 2), y(w + (t - w) * e)];
    });
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const area = `${d} L${W - pad} ${H - 18} L${pad} ${H - 18}z`;
    const month = (off) => new Date(Date.now() + off * weeks * 7 * 864e5).toLocaleDateString("es-ES", { month: "short" });
    const last = pts[6];
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Previsión de peso">
      <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb547" stop-opacity=".45"/><stop offset="1" stop-color="#ffb547" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#ga)"/>
      <path d="${d}" fill="none" stroke="#ffb547" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${pts[0][0]}" cy="${pts[0][1]}" r="6" fill="#ff7a59" stroke="#fff" stroke-width="2"/>
      <circle cx="${last[0]}" cy="${last[1]}" r="7" fill="#5fcf98" stroke="#fff" stroke-width="2.5"/>
      <g font-family="DM Sans" font-size="11" fill="#cfe5df">
        <text x="${pts[0][0]}" y="${pts[0][1] - 12}" font-weight="700" fill="#fff">${fmtW(w)}</text>
        <text x="${last[0]}" y="${last[1] - 14}" text-anchor="end" font-weight="700" fill="#fff">${fmtW(t)}</text>
        <text x="${pad}" y="${H - 2}">Hoy</text>
        <text x="${W / 2}" y="${H - 2}" text-anchor="middle">${month(0.5)}</text>
        <text x="${W - pad}" y="${H - 2}" text-anchor="end">${date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</text>
      </g>
    </svg>`;
  }

  function renderResult() {
    const d = planData();
    const b = bmi();
    const pin = Math.max(2, Math.min(98, ((b - 15) / (40 - 15)) * 100));
    const bmiLabel = b < 18.5 ? "Bajo peso" : b < 25 ? "Saludable" : b < 30 ? "Sobrepeso" : "Obesidad";
    const habits = A.habits || [];
    const zones = (A.zones || []).includes("todo") || !(A.zones || []).length ? "todo el cuerpo" :
      A.zones.map((z) => ({ abdomen: "abdomen", brazos: "brazos", piernas: "piernas", gluteos: "glúteos" })[z]).join(", ");
    const tips = [];
    tips.push({ e: "🍽️", h: `${d.kcal} kcal al día`, p: "Repartidas en 3 comidas y 1 tentempié, con recetas de menos de 20 minutos." });
    tips.push({ e: "🏃", h: Number(A.activity) <= 2 ? "Rutinas de 12 minutos en casa" : "3 entrenos de 25 minutos por semana", p: `Enfocadas en ${zones}, sin material y con progresión semanal.` });
    tips.push({ e: "💧", h: `${d.waterL.toString().replace(".", ",")} litros de agua`, p: Number(A.water) <= 2 ? "Empezamos con recordatorios suaves: un vaso más cada pocos días." : "Ya bebes bien: mantenlo y te avisamos los días de calor." });
    if (habits.includes("noche") || habits.includes("dulce")) tips.push({ e: "🌙", h: "Plan anti-antojos", p: "Cenas saciantes y alternativas dulces que no rompen tu progreso." });
    if (habits.includes("estres")) tips.push({ e: "🧘", h: "Pausas de 3 minutos", p: "Respiraciones guiadas para cuando el estrés te empuje a la nevera." });
    if (Number(A.sleep) <= 6) tips.push({ e: "😴", h: "Rutina de descanso", p: "Dormir mejor regula el hambre. Te ayudamos a ganar 30 minutos de sueño." });
    const hello = A.name ? `${esc(A.name)}, ` : "";
    const eventTxt = { vacaciones: "para tus vacaciones", boda: "para esa celebración", cumple: "para tu cumpleaños", deporte: "para tu reto deportivo" }[A.event] || "";

    mount(`
      <section class="result-hero">
        <span class="pill"><span class="dot"></span>Tu plan Brío</span>
        <h2>${hello}${d.loss > 0 ? `puedes llegar a <span style="color:var(--amber)">${fmtW(d.t)}</span> hacia el ${d.date.toLocaleDateString("es-ES", { day: "numeric", month: "long" })}` : "este es tu plan para tonificar y ganar energía"}</h2>
        <p class="sub">${eventTxt ? `Justo a tiempo ${eventTxt}. ` : ""}Previsión basada en tus respuestas y en un ritmo saludable.</p>
        <div class="chart">${chartSvg(d)}</div>
      </section>
      <div class="kpis">
        <div class="kpi"><b>${d.loss > 0 ? "−" + fmtW(d.loss) : "✓"}</b><span>${d.loss > 0 ? "objetivo" : "mantener"}</span></div>
        <div class="kpi"><b>${d.weeks}</b><span>semanas</span></div>
        <div class="kpi"><b>${d.kcal}</b><span>kcal/día</span></div>
      </div>
      <h3 class="section-t">Tu índice de masa corporal</h3>
      <div class="bmi">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-family:var(--display);font-size:28px">${b.toFixed(1)}</b><span style="font-weight:700;color:var(--teal-2)">${bmiLabel}</span></div>
        <div class="bmi-bar"><span class="bmi-pin" style="left:${pin}%"></span></div>
        <div class="bmi-labels"><span>Bajo</span><span>Saludable</span><span>Sobrepeso</span><span>Obesidad</span></div>
      </div>
      <h3 class="section-t">Lo que incluye tu plan</h3>
      <div class="plan-list">
        ${tips.map((x) => `<div class="plan-item"><span class="emo">${x.e}</span><div><h3>${x.h}</h3><p>${x.p}</p></div></div>`).join("")}
      </div>
      <div class="offer">
        <h3>Empieza hoy tu plan</h3>
        <p class="sub" style="margin:0">Todo esto te espera en tu zona Brío, ajustado a tus respuestas.</p>
        <ul><li>Retos de 21 y 28 días con tareas diarias</li><li>Guías de nutrición, entreno, sueño y antojos</li><li>Seguimiento de peso, rachas y progreso</li></ul>
        <button class="cta" id="start">Quiero empezar</button>
      </div>
      <button class="restart" id="restart">Repetir el test</button>
    `);
    $screen.querySelector("#start").addEventListener("click", () => renderPaywall());
    $screen.querySelector("#restart").addEventListener("click", () => {
      Object.keys(A).forEach((k) => delete A[k]);
      go(-1);
    });
  }

  // ---------- Paywall & checkout ----------
  let configPromise;
  const getConfig = () => (configPromise ??= fetch("/api/config").then((r) => {
    if (!r.ok) throw new Error("config");
    return r.json();
  }).catch((e) => { configPromise = undefined; throw e; }));
  const money = (cents, currency) => (cents / 100).toLocaleString("es-ES", { style: "currency", currency });
  let chosenPlan = null;

  function metricAnswers() {
    const out = { ...A };
    delete out.name; delete out.email; delete out.height; delete out.weight; delete out.target;
    if (A.height) out.heightCm = Math.round(cmOf(A.height));
    if (A.weight) out.weightKg = Math.round(kgOf(A.weight) * 10) / 10;
    if (A.target) out.targetKg = Math.round(kgOf(A.target) * 10) / 10;
    return out;
  }

  function chromeFor(back) {
    $progressWrap.hidden = true;
    $stepCount.textContent = "";
    $back.hidden = !back;
  }

  async function renderPaywall() {
    idx = steps.length;
    mount(`<div class="loading screen" style="padding:0"><div class="spinner"></div></div>`);
    chromeFor(Boolean(A.weight));
    let cfg;
    try { cfg = await getConfig(); }
    catch { return renderPayError("No hemos podido cargar los planes. Revisa tu conexión e inténtalo de nuevo.", () => renderPaywall()); }
    const plans = cfg.plans;
    chosenPlan ??= plans.find((p) => p.popular) || plans[0];
    const hasData = A.weight && A.target;
    const d = hasData ? planData() : null;
    mount(`
      <div class="q-head" style="margin-bottom:0">
        <h2>${A.name ? `${esc(A.name)}, tu` : "Tu"} plan está listo</h2>
        <p class="sub">Elige cuánto tiempo quieres tener acceso a tu zona Brío.</p>
      </div>
      ${hasData ? `<div class="pw-recap"><div><small>Ahora</small><b>${fmtW(d.w)}</b></div><span class="arrow">→</span><div><small>Tu meta</small><b style="color:var(--teal-2)">${fmtW(d.t)}</b></div></div>` : ""}
      <div class="plans" role="radiogroup" aria-label="Planes">
        ${plans.map((p) => `
          <button class="plan ${p.id === chosenPlan.id ? "selected" : ""}" role="radio" aria-checked="${p.id === chosenPlan.id}" data-id="${p.id}">
            ${p.popular ? '<span class="badge">La más elegida</span>' : ""}
            <span class="check"></span>
            <span><h3>${p.name}</h3><div class="total">${p.listCents ? `<s>${money(p.listCents, cfg.currency)}</s>` : ""}${money(p.priceCents, cfg.currency)}${p.note ? ` · ${p.note}` : ""}</div></span>
            <span class="perday"><b>${money(Math.floor(p.priceCents / p.days), cfg.currency)}</b><span>al día</span></span>
          </button>`).join("")}
      </div>
      <ul class="includes">
        <li><span>🏆</span>Retos de 21 y 28 días con tareas para cada día</li>
        <li><span>📚</span>Guías de nutrición, entreno en casa, sueño y antojos</li>
        <li><span>📈</span>Seguimiento de peso, rachas y progreso</li>
        <li><span>🎯</span>Todo adaptado a tus respuestas del test</li>
      </ul>
      <div class="cta-wrap">
        <button class="cta" id="cont">Continuar</button>
        <p class="legal">Pago único con tarjeta a través de Square. No se renueva automáticamente: al terminar el periodo eliges si quieres seguir.</p>
      </div>
    `);
    chromeFor(Boolean(A.weight));
    $screen.querySelectorAll(".plan").forEach((b) => b.addEventListener("click", () => {
      chosenPlan = plans.find((p) => p.id === b.dataset.id);
      $screen.querySelectorAll(".plan").forEach((x) => { x.classList.toggle("selected", x === b); x.setAttribute("aria-checked", x === b); });
    }));
    $screen.querySelector("#cont").addEventListener("click", () => renderCheckout());
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error("sdk"));
      document.head.appendChild(s);
    });
  }

  async function renderCheckout() {
    const cfg = await getConfig();
    const plan = chosenPlan;
    const sq = cfg.square;
    const testCards = sq.demo;
    const member = Boolean(localStorage.getItem("brio_token"));
    mount(`
      <div class="q-head" style="margin-bottom:14px"><h2>Pago seguro</h2></div>
      <div class="summary"><div><small>Plan Brío</small><b style="font-size:18px">${plan.name}</b></div><b>${money(plan.priceCents, cfg.currency)}</b></div>
      <label class="label" for="pname">Nombre</label>
      <input class="text-field" id="pname" type="text" autocomplete="given-name" placeholder="Tu nombre" value="${esc(A.name || "")}" />
      ${member ? `<div class="hint good" style="margin-top:14px"><span class="ic">👤</span><span>Has iniciado sesión: el plan se añadirá a tu cuenta Brío. <a href="#" id="notme">¿No eres tú?</a></span></div>` : `<label class="label" for="pmail">Email (aquí te llega el recibo)</label>
      <input class="text-field" id="pmail" type="email" inputmode="email" autocomplete="email" placeholder="tu@email.com" value="${esc(A.email || "")}" />`}
      <span class="label">Tarjeta</span>
      ${sq.demo ? `<div class="demo-card"><input id="dnum" inputmode="numeric" value="4111 1111 1111 1111" aria-label="Número de tarjeta" /><input value="12/29" aria-label="Caducidad" /><input value="111" aria-label="CVV" /></div>` : `<div class="card-box" id="card-container"></div>`}
      <div id="perr"></div>
      ${testCards ? `<div class="hint test-cards"><span class="ic">🧪</span><span><b>Modo demo local</b>: no se cobra nada. Tarjeta de prueba <code>4111 1111 1111 1111</code>, CVV <code>111</code>, cualquier fecha futura. Para simular un rechazo usa <code>4000 0000 0000 0002</code>.</span></div>` : ""}
      <div class="cta-wrap">
        <button class="cta" id="pay" disabled>Pagar ${money(plan.priceCents, cfg.currency)}</button>
        <div class="secure">🔒 Pago cifrado procesado por Square. Brío no guarda los datos de tu tarjeta.</div>
      </div>
    `);
    chromeFor(true);
    $back.onclick = null;
    $screen.querySelector("#notme")?.addEventListener("click", (e) => { e.preventDefault(); localStorage.removeItem("brio_token"); renderCheckout(); });
    const $pay = $screen.querySelector("#pay");
    const $err = $screen.querySelector("#perr");
    const showErr = (m) => { $err.innerHTML = m ? `<div class="hint warn"><span class="ic">✋</span><span>${esc(m)}</span></div>` : ""; };
    let card = null;
    if (sq.demo) {
      $pay.disabled = false;
    } else if (!sq.configured) {
      return renderPayError("Los pagos todavía no están activados en esta web. Vuelve a intentarlo más tarde.", null);
    } else {
      try {
        await loadScript(sq.environment === "production" ? "https://web.squarecdn.com/v1/square.js" : "https://sandbox.web.squarecdn.com/v1/square.js");
        const payments = window.Square.payments(sq.applicationId, sq.locationId);
        card = await payments.card();
        await card.attach("#card-container");
        $pay.disabled = false;
      } catch {
        return renderPayError("No hemos podido cargar el formulario de pago. Recarga la página e inténtalo de nuevo.", null);
      }
    }
    $pay.addEventListener("click", async () => {
      const email = member ? "" : $screen.querySelector("#pmail").value.trim();
      const name = $screen.querySelector("#pname").value.trim();
      if (!member && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return showErr("Escribe un email válido para recibir tu acceso.");
      showErr("");
      $pay.disabled = true; $pay.textContent = "Procesando…";
      let sourceId;
      try {
        if (sq.demo) {
          sourceId = $screen.querySelector("#dnum").value.replace(/\s/g, "") === "4000000000000002" ? "demo-fail" : "demo-ok";
        } else {
          const result = await card.tokenize({
            amount: (plan.priceCents / 100).toFixed(2),
            currencyCode: cfg.currency,
            intent: "CHARGE",
            customerInitiated: true,
            sellerKeyedIn: false,
            billingContact: { email: email || undefined, givenName: name || undefined },
          });
          if (result.status !== "OK") {
            $pay.disabled = false; $pay.textContent = `Pagar ${money(plan.priceCents, cfg.currency)}`;
            return showErr("Revisa los datos de la tarjeta.");
          }
          sourceId = result.token;
        }
      } catch {
        $pay.disabled = false; $pay.textContent = `Pagar ${money(plan.priceCents, cfg.currency)}`;
        return showErr("Revisa los datos de la tarjeta.");
      }
      if (email) A.email = email;
      A.name = name || A.name;
      submitPayment({ checkoutId: crypto.randomUUID(), checkoutSecret: randomSecret(), planId: plan.id, sourceId, email, name, answers: metricAnswers() });
    });
  }

  const randomSecret = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  // The same checkoutId (Square idempotency key) is resent on network retries, so a
  // retry can never charge twice. A declined or rejected attempt needs a new checkout.
  async function submitPayment(attempt) {
    mount(`<div class="loading screen" style="padding:0"><div class="spinner"></div><h2>Procesando tu pago…</h2></div>`);
    chromeFor(false);
    const token = localStorage.getItem("brio_token");
    let res, data;
    try {
      res = await fetch("/api/pay", {
        method: "POST",
        headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(attempt),
      });
      data = await res.json().catch(() => ({}));
    } catch {
      return renderPayError("Se ha cortado la conexión durante el pago. Vuelve a intentarlo: no se te cobrará dos veces.", () => submitPayment(attempt), "Reintentar");
    }
    if (res.ok) return renderPaySuccess(data, attempt.email);
    if (data.alreadyPaid) return renderPayError(data.error, null, "Reintentar", true);
    if (res.status >= 500 || (res.status === 409 && !data.retryWithNewCheckout)) {
      return renderPayError(data.error || "No hemos podido confirmar el pago.", () => submitPayment(attempt), "Reintentar");
    }
    const taken = res.status === 409;
    renderPayError(data.error || "No hemos podido completar el pago.", () => renderCheckout(), "Volver a intentarlo", taken);
  }

  function renderPaySuccess(data, email) {
    localStorage.setItem("brio_token", data.token);
    const until = data.expiresAt ? new Date(data.expiresAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "";
    mount(`
      <div class="inter screen" style="padding:0">
        <div class="state-icon">✅</div>
        <h2>¡Pago completado!</h2>
        <p class="sub">${data.renewed ? "Hemos ampliado tu plan" : `Ya tienes tu ${esc(data.plan)}`}${until ? ` hasta el ${until}` : ""}.</p>
        ${data.accessCode ? `<div class="code-box"><small>Tu código de acceso</small><b id="code">${esc(data.accessCode)}</b><button id="copy">Copiar código</button></div>
        <p class="fine" style="margin-top:6px">Guárdalo: con tu email${email ? ` (${esc(email)})` : ""} y este código entras en tu zona desde cualquier dispositivo.</p>` : ""}
        ${data.codeAvailableInZone ? '<p class="fine">Ya tienes la sesión iniciada en este dispositivo. Si no guardaste tu código, crea uno nuevo en Progreso → Tu acceso.</p>' : ""}
        ${data.receiptUrl && /^https:\/\//.test(data.receiptUrl) ? `<a class="restart" href="${esc(data.receiptUrl)}" target="_blank" rel="noopener">Ver recibo de Square</a>` : ""}
      </div>
      <div class="cta-wrap"><a class="cta" href="/socios/">Entrar en mi zona Brío</a></div>
    `);
    chromeFor(false);
    $screen.querySelector("#copy")?.addEventListener("click", async (e) => {
      try { await navigator.clipboard.writeText(data.accessCode); e.target.textContent = "¡Copiado!"; } catch { e.target.textContent = "Cópialo a mano"; }
    });
  }

  function renderPayError(message, onRetry, retryLabel = "Volver a intentarlo", showLogin = false) {
    mount(`
      <div class="inter screen" style="padding:0">
        <div class="state-icon warn">⚠️</div>
        <h2>No se ha completado el pago</h2>
        <p class="sub">${esc(message)}</p>
        ${retryLabel === "Reintentar" ? "" : '<p class="fine">No se ha hecho ningún cargo en tu tarjeta.</p>'}
      </div>
      <div class="cta-wrap">
        ${showLogin ? '<a class="cta" href="/socios/">Entrar en mi zona</a>' : onRetry ? `<button class="cta" id="retry">${retryLabel}</button>` : ""}
        <button class="restart" id="plans">Elegir otro plan</button>
      </div>
    `);
    chromeFor(false);
    if (!showLogin) $screen.querySelector("#retry")?.addEventListener("click", onRetry);
    $screen.querySelector("#plans").addEventListener("click", () => renderPaywall());
  }

  if (location.hash === "#planes") renderPaywall();
  else go(-1);
})();
