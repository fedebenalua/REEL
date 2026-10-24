// La máquina expendedora, siempre la misma: de frente, con espirales, la cortina de luz infrarroja
// (magenta: ese color no se usa para nada más) y el panel de las monedas. El garaje es el otro sitio.
import * as k from "#kit";
import { v } from "#voz";

const IR = "255,40,140";
const CY = -0.02; // altura de la cortina, justo encima de la tolva
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const f6 = v.frase(6), f7 = v.frase(7), f9 = v.frase(9), f10 = v.frase(10);
const Tcae = f1.t("caido"), Tluz = f2.t("luz"), Tsen = f3.t("sensores"), Tcor = f3.t("cortina");
const Tgir = f4.t("gira"), Tsue = f4.t("suelta"), Ttap = f5.t("tapa"), Tya = f5.t("esta");
const Teng = f6.t("enganchada"), Tent = f6.t("entera"), Tmas = f6.t("mas");
const Tdin = f7.t("dinero"), Teli = f7.t("elijas");
const Tadv = f9.t("adivina"), Ttap2 = f9.t("tapado");
const Tsac = f10.t("sacude");
const Tgar = v.frase(8).inicio, Trem = f9.t("adivina");

const PAL = [
  { base: "#e23b3b", luz: "#ff7468", sombra: "#8d1820", raya: "#ffd23a" },
  { base: "#1c8f4a", luz: "#45d27a", sombra: "#0c5a2e", raya: "#f6f1e4" },
  { base: "#2a66f0", luz: "#6aa2ff", sombra: "#14368a", raya: "#ffe14a" },
  { base: "#ff8a1c", luz: "#ffb15e", sombra: "#a34c08", raya: "#fff4e4" },
  { base: "#f0c14e", luz: "#ffe08a", sombra: "#a07812", raya: "#c0392b" },
  { base: "#5b46e0", luz: "#9a8cff", sombra: "#2c1d86", raya: "#ffe14a" },
];

const azP = k.azar(41);
const STOCK = [];
for (const x of [-0.46, 0, 0.46]) {
  for (const y of [1.18, 0.18]) {
    STOCK.push({ x, y, z: -0.72, pal: PAL[Math.floor(azP() * PAL.length)], alto: 0.26, ang: (azP() - 0.5) * 0.08 });
  }
}

function pose(t, claves) {
  if (t <= claves[0][0]) return { pos: claves[0][1], mira: claves[0][2] };
  const uL = claves.length - 1;
  if (t >= claves[uL][0]) return { pos: claves[uL][1], mira: claves[uL][2] };
  let i = 0;
  while (i < uL - 1 && t > claves[i + 1][0]) i++;
  const a = claves[i], b = claves[i + 1], u = k.suave(k.tramo(t, a[0], b[0]));
  return { pos: k.mezV(a[1], b[1], u), mira: k.mezV(a[2], b[2], u) };
}

const CAM = [
  [-0.5, [0.1, 0.14, 0.02], [0.0, 0.04, -0.36]],
  [0.85, [0.02, 0.0, -0.06], [0.0, 0.0, -0.36]],
  [Tcae, [0.0, -0.32, 0.28], [0.0, -0.42, -0.4]],
  [3.5, [0.0, -0.26, 0.42], [0.0, -0.32, -0.45]],
  [Tluz, [0.0, 0.0, 1.15], [0.0, -0.02, -0.45]],
  [7.1, [0.0, -0.02, 0.95], [0.0, -0.02, -0.42]],
  [Tsen, [-0.15, -0.02, 0.78], [0.0, -0.02, -0.45]],
  [Tcor, [0.12, -0.02, 0.62], [0.0, -0.02, -0.4]],
  [11.55, [0.0, 0.55, 0.78], [0.0, 0.62, -0.45]],
  [Tgir, [0.0, 0.62, 0.55], [0.0, 0.66, -0.5]],
  [Tsue, [0.0, 0.42, 0.48], [0.0, 0.3, -0.32]],
  [Ttap, [0.0, -0.02, 0.32], [0.0, -0.02, -0.36]],
  [Tya, [0.0, -0.12, 0.85], [0.0, -0.18, -0.4]],
  [Teng, [0.46, 0.48, 0.58], [0.46, 0.42, -0.28]],
  [Tent, [0.4, -0.02, 0.55], [0.2, -0.02, -0.4]],
  [Tmas, [0.46, 0.5, 0.52], [0.46, 0.48, -0.28]],
  [24.55, [0.85, -0.12, 1.15], [1.02, -0.15, 0.2]],
  [Tdin, [1.0, -0.2, 0.78], [1.02, -0.22, 0.2]],
  [Tgar - 0.02, [1.0, -0.2, 0.78], [1.02, -0.22, 0.2]],
  [Trem - 0.35, [0.0, 0.5, 0.9], [0.0, 0.36, -0.38]],
  [Trem, [0.0, 0.4, 0.62], [0.0, 0.28, -0.4]],
  [Ttap2, [0.0, -0.02, 0.26], [0.0, -0.02, -0.36]],
  [36.85, [0.0, -0.2, 0.62], [0.0, -0.28, -0.38]],
  [Tsac - 0.2, [0.12, 0.12, 2.05], [0.08, 0.0, -0.1]],
  [Tsac + 0.95, [0.12, 0.12, 2.05], [0.08, 0.0, -0.1]],
  [40.4, [0.04, 0.06, 0.12], [0.0, 0.02, -0.36]],
  [40.88, [0.06, 0.08, 0.0], [0.0, 0.03, -0.36]],
];

const FRENTE = [
  [-0.45, [0.0, 0.08, 0.7], [0.0, 0.02, -0.35]],
  [0.7, [0.0, 0.0, 0.05], [0.0, 0.0, -0.36]],
  [Tcae, [0.0, -0.32, 0.28], [0.0, -0.42, -0.4]],
  [3.5, [0.0, -0.26, 0.42], [0.0, -0.32, -0.45]],
  [Tluz, [0.0, 0.0, 1.15], [0.0, -0.02, -0.45]],
  [7.1, [0.0, -0.02, 0.95], [0.0, -0.02, -0.42]],
];

function camara(t) {
  const p = pose(t, CAM);
  return k.mira(p.pos, p.mira);
}

function pr(cam, x, y, z) { return k.proyecta(cam, [x, y, z]); }

function quad(g, cam, pts, estilo) {
  const ps = pts.map(([x, y, z]) => pr(cam, x, y, z));
  if (ps.some((p) => !p)) return null;
  const z = ps.reduce((s, p) => s + p.z, 0) / ps.length;
  g.beginPath();
  g.moveTo(ps[0].x, ps[0].y);
  for (let i = 1; i < ps.length; i++) g.lineTo(ps[i].x, ps[i].y);
  g.closePath();
  if (typeof estilo === "string") g.fillStyle = estilo;
  else estilo(g, ps);
  g.fill();
  return z;
}

function bolsa(g, cam, x, y, z, ang, alto, pal) {
  const p = pr(cam, x, y, z);
  if (!p) return null;
  const s = k.tamano(alto, p.z), w = s * 0.7, h = s;
  g.save();
  g.translate(p.x, p.y);
  g.rotate(ang);
  k.redondo(g, -w / 2, -h / 2, w, h, Math.min(22, w * 0.18));
  const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  gr.addColorStop(0, pal.sombra); gr.addColorStop(0.38, pal.base); gr.addColorStop(0.72, pal.luz); gr.addColorStop(1, pal.sombra);
  g.fillStyle = gr; g.fill();
  if (s > 90) {
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.22;
    g.drawImage(k.manchas, -w / 2, -h / 2, w, h); g.restore();
  }
  g.fillStyle = pal.raya; g.fillRect(-w / 2, -h * 0.06, w, h * 0.18);
  g.fillStyle = "rgba(255,255,255,0.2)";
  k.redondo(g, -w * 0.22, -h * 0.32, w * 0.14, h * 0.4, 6); g.fill();
  if (s > 70) {
    g.strokeStyle = "rgba(0,0,0,0.4)"; g.lineWidth = Math.max(2, s * 0.03);
    g.beginPath();
    g.moveTo(-w * 0.28, -h / 2 + 2); g.lineTo(w * 0.28, -h / 2 + h * 0.08);
    g.moveTo(-w * 0.28, h / 2 - h * 0.08); g.lineTo(w * 0.28, h / 2 - 2);
    g.stroke();
  }
  g.restore();
  return p;
}

function espiral(g, cam, x, y, z0, z1, fase) {
  const N = 42, R = 0.12, tramos = [];
  let run = [], lado = null, prev = null;
  const cierra = () => { if (run.length > 1) tramos.push({ pts: run, lado }); };
  for (let i = 0; i <= N; i++) {
    const u = i / N, a = fase + u * Math.PI * 4;
    const P = pr(cam, x + Math.cos(a) * R, y + Math.sin(a) * R, z0 + (z1 - z0) * u);
    if (!P) { cierra(); run = []; lado = null; prev = null; continue; }
    const frente = Math.sin(a) > 0;
    if (lado !== null && frente !== lado) { cierra(); run = prev ? [prev, P] : [P]; }
    else run.push(P);
    lado = frente; prev = P;
  }
  cierra();
  tramos.sort((a, b) => (a.lado ? 1 : 0) - (b.lado ? 1 : 0));
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  for (const tr of tramos) {
    g.strokeStyle = tr.lado ? "#f4f7fb" : "#7e8794";
    g.lineWidth = Math.max(7, k.tamano(0.05, tr.pts[0].z));
    g.beginPath(); g.moveTo(tr.pts[0].x, tr.pts[0].y);
    for (const p of tr.pts) g.lineTo(p.x, p.y);
    g.stroke();
  }
  g.restore();
}

function sensores(g, cam, al) {
  for (const x of [-0.68, 0.68]) {
    const p = pr(cam, x, CY, -0.45);
    if (!p) continue;
    const s = k.tamano(0.13, p.z);
    g.save();
    k.redondo(g, p.x - s * 1.15, p.y - s * 0.72, s * 2.3, s * 1.44, s * 0.3);
    const mg = g.createLinearGradient(p.x - s, 0, p.x + s, 0);
    mg.addColorStop(0, "#12161c"); mg.addColorStop(0.4, "#3c4452"); mg.addColorStop(1, "#0c0e12");
    g.fillStyle = mg; g.fill();
    g.fillStyle = `rgba(${IR},1)`;
    g.beginPath(); g.arc(p.x, p.y, s * 0.34, 0, 6.2832); g.fill();
    g.restore();
    k.brillo(g, p.x, p.y, s * 5, IR, 0.7 * al);
  }
}

function cortina(g, cam, bolsas, al) {
  if (al <= 0.02) return;
  const L = pr(cam, -0.64, CY, -0.45), R = pr(cam, 0.64, CY, -0.45);
  if (!L || !R) return;
  const y = (L.y + R.y) / 2, grosor = Math.max(18, k.tamano(0.09, (L.z + R.z) / 2));
  let gap = null;
  for (const b of bolsas) {
    const pen = 1 - Math.abs(b.y - CY) / b.ry;
    if (pen > 0.04) {
      const p = pr(cam, b.x, CY, b.z);
      if (p) gap = { x: p.x, w: Math.max(20, k.tamano(b.rx * 2.4, p.z) * pen) };
    }
  }
  const trozo = (x0, x1) => {
    if (x1 - x0 < 8) return;
    g.save(); g.globalCompositeOperation = "lighter";
    const gr = g.createLinearGradient(x0, y - grosor, x0, y + grosor);
    gr.addColorStop(0, `rgba(${IR},0)`); gr.addColorStop(0.35, `rgba(${IR},${0.45 * al})`);
    gr.addColorStop(0.5, `rgba(255,220,240,${0.55 * al})`); gr.addColorStop(0.65, `rgba(${IR},${0.45 * al})`); gr.addColorStop(1, `rgba(${IR},0)`);
    g.fillStyle = gr; g.fillRect(x0, y - grosor, x1 - x0, grosor * 2);
    g.restore();
  };
  if (!gap) trozo(Math.min(L.x, R.x), Math.max(L.x, R.x));
  else {
    const a = Math.min(L.x, R.x), b = Math.max(L.x, R.x);
    trozo(a, gap.x - gap.w / 2); trozo(gap.x + gap.w / 2, b);
  }
}

function panel(g, cam, t) {
  const x0 = 0.78, x1 = 1.28, y0 = -0.72, y1 = 0.95, z = 0.2;
  quad(g, cam, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], (ctx) => {
    const pg = ctx.createLinearGradient(0, 0, 0, 1920);
    pg.addColorStop(0, "#1c2430"); pg.addColorStop(1, "#0e141c");
    ctx.fillStyle = pg;
  });
  const uMon = k.entra(k.tramo(t, Tdin - 0.25, Tdin + 0.4));
  const yMon = k.mez(0.42, -0.38, uMon);
  const p = pr(cam, 1.02, yMon, z + 0.04);
  if (p) {
    const s = k.tamano(0.2, p.z);
    g.save();
    g.beginPath(); g.arc(p.x, p.y, s, 0, 6.2832);
    const cg = g.createRadialGradient(p.x - s * 0.3, p.y - s * 0.35, s * 0.1, p.x, p.y, s);
    cg.addColorStop(0, "#fff4c4"); cg.addColorStop(0.45, "#f0c14a"); cg.addColorStop(1, "#a87412");
    g.fillStyle = cg; g.fill();
    g.lineWidth = Math.max(2, s * 0.08); g.strokeStyle = "#c8922a"; g.stroke();
    g.fillStyle = "#8a5a10"; g.font = `800 ${Math.round(s * 0.9)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("€", p.x, p.y + s * 0.04);
    g.restore();
    k.brillo(g, p.x, p.y, s * 3.2, "255,200,80", 0.35 + 0.2 * Math.sin(t * 3));
  }
  const uB = k.suave(k.tramo(t, Teli - 0.05, Teli + 0.45));
  const botones = [[0.9, 0.15], [1.08, 0.15], [0.9, -0.05], [1.08, -0.05]];
  botones.forEach(([x, y], i) => {
    const b = pr(cam, x, y, z + 0.02);
    if (!b) return;
    const s = k.tamano(0.07, b.z), on = uB * (i === 1 || i === 2 ? 1 : 0.35);
    g.beginPath(); g.arc(b.x, b.y, s, 0, 6.2832);
    g.fillStyle = `rgb(${k.mezRgb("42,51,64", "61,255,122", on)})`; g.fill();
    if (on > 0.05) k.brillo(g, b.x, b.y, s * 4, "80,255,140", on * 0.7);
  });
}

function maquina(g, cam, t, bolsas) {
  quad(g, cam, [[-0.78, -0.9, -1.08], [0.78, -0.9, -1.08], [0.78, 1.5, -1.08], [-0.78, 1.5, -1.08]], (ctx, ps) => {
    const lg = ctx.createLinearGradient(0, ps[2].y, 0, ps[0].y);
    lg.addColorStop(0, "#163246"); lg.addColorStop(0.5, "#0c1e2e"); lg.addColorStop(1, "#102838");
    ctx.fillStyle = lg;
  });
  for (const [x0, x1] of [[-0.84, -0.74], [0.74, 0.84]]) {
    quad(g, cam, [[x0, -0.9, -1.05], [x0, -0.9, 0.12], [x0, 1.5, 0.12], [x0, 1.5, -1.05]], x0 < 0 ? "#10202c" : "#0e1c28");
  }
  quad(g, cam, [[-0.78, 1.42, -1.05], [0.78, 1.42, -1.05], [0.78, 1.5, 0.1], [-0.78, 1.5, 0.1]], "#183044");
  const tubo = pr(cam, 0, 1.32, -0.55);
  if (tubo) k.brillo(g, tubo.x, tubo.y, k.tamano(1.3, tubo.z), "186,220,255", 0.55);
  for (const y of [1.0, 0.5, 0.0]) {
    quad(g, cam, [[-0.72, y, -1.02], [0.72, y, -1.02], [0.72, y + 0.025, -0.22], [-0.72, y + 0.025, -0.22]], "#245068");
  }
  quad(g, cam, [[-0.7, -0.78, -1.0], [0.7, -0.78, -1.0], [0.7, -0.78, -0.18], [-0.7, -0.78, -0.18]], "#081018");
  quad(g, cam, [[-0.72, -0.7, -0.18], [0.72, -0.7, -0.18], [0.72, -0.18, -0.18], [-0.72, -0.18, -0.18]], (ctx) => {
    const rg = ctx.createLinearGradient(0, 0, 1080, 0);
    rg.addColorStop(0, "#8ea0b0"); rg.addColorStop(0.5, "#e8eef4"); rg.addColorStop(1, "#6c7c8c");
    ctx.fillStyle = rg;
  });
  for (const x of [-0.46, 0, 0.46]) {
    let fase = 0;
    if (x === 0) fase = k.suave(k.tramo(t, Tgir, Tsue)) * 5.2 + (t > Trem ? k.suave(k.tramo(t, Trem, Ttap2 - 0.35)) * 4.2 : 0);
    if (x === 0.46) fase = k.suave(k.tramo(t, f6.t("gira"), Tmas + 0.25)) * 1.4;
    espiral(g, cam, x, 0.68, -1.0, -0.26, fase);
  }
  for (const s of STOCK) bolsa(g, cam, s.x, s.y, s.z, s.ang, s.alto, s.pal);
  const hero = PAL[0];
  for (const b of bolsas) bolsa(g, cam, b.x, b.y, b.z, b.ang, b.alto, b.pal || hero);
  const alC = 0.35 + 0.65 * k.suave(k.tramo(t, Tluz - 0.35, Tluz + 0.25));
  const entera = t > Teng - 0.2 && t < Trem;
  cortina(g, cam, entera ? [] : bolsas, t < Tluz - 0.2 && t > 2.2 ? 0.45 : alC);
  const pulso = Math.max(k.pulso(t, Tluz, 0.18), k.pulso(t, Tya, 0.16), k.pulso(t, Ttap2, 0.16));
  sensores(g, cam, 0.65 + 0.7 * pulso);
  if (pulso > 0.15 && (Math.abs(t - Tya) < 0.45 || Math.abs(t - Ttap2) < 0.45)) {
    const c = pr(cam, 0, CY, -0.45);
    if (c) k.brillo(g, c.x, c.y, 520, "170,255,150", pulso * 0.85);
  }
  panel(g, cam, t);
  const fuera = k.suave(k.tramo(cam.p[2], 0.22, 0.6));
  if (fuera > 0.03) {
    const marco = [[-0.8, -0.88, 0.16], [0.76, -0.88, 0.16], [0.76, 1.52, 0.16], [-0.8, 1.52, 0.16]];
    const ps = marco.map(([x, y, z]) => pr(cam, x, y, z));
    if (ps.every(Boolean)) {
      g.save();
      g.beginPath(); g.moveTo(ps[0].x, ps[0].y);
      for (let i = 1; i < 4; i++) g.lineTo(ps[i].x, ps[i].y);
      g.closePath();
      g.globalAlpha = 0.14 * fuera; g.fillStyle = "#d5e6f5"; g.fill();
      g.globalAlpha = 0.35 * fuera; g.strokeStyle = "#d5e6f5"; g.lineWidth = 10; g.stroke();
      g.restore();
    }
  }
}

function bolsasEn(t) {
  const out = [];
  const uCae = k.tramo(t, -0.45, Tcae);
  let yH = k.mez(0.06, -0.5, uCae);
  let angH = -0.4 + t * 2.4;
  if (t >= Tcae) {
    const reb = Math.sin(Math.min(1, (t - Tcae) / 0.28) * Math.PI) * (t < Tcae + 0.35 ? 0.06 : 0);
    yH = -0.5 + reb; angH = k.mez(angH, 0.2, k.suave(k.tramo(t, Tcae, Tcae + 0.3)));
  }
  if (t < Trem) out.push({ x: 0.02, y: yH, z: -0.38, ang: angH, alto: 0.34, rx: 0.13, ry: 0.17, rz: 0.08, pal: PAL[0] });

  const av = k.suave(k.tramo(t, Tgir, Tsue));
  let yV = 0.68, zV = k.mez(-0.78, -0.3, av), angV = 0;
  if (t >= Tsue && t < Trem) {
    const llega = Ttap + 0.25;
    const c = k.tramo(t, Tsue, llega);
    yV = k.mez(0.68, -0.42, c * c); zV = -0.34; angV = c * 1.1;
    if (t > llega) {
      const u = k.suave(k.tramo(t, llega, llega + 0.6));
      angV = k.mez(1.1, 0.18, u); yV = -0.42;
    }
  }
  if (t >= Tgir - 0.4 && t < Trem) out.push({ x: 0, y: yV, z: zV, ang: angV, alto: 0.24, rx: 0.1, ry: 0.12, rz: 0.07, pal: PAL[3] });

  let yA = 0.68, zA = -0.55, angA = 0.05;
  if (t >= Teng - 0.45) { yA = 0.46; zA = -0.24; angA = 0.85 + Math.sin(t * 7) * 0.08; }
  if (t < Trem) out.push({ x: 0.46, y: yA, z: zA, ang: angA, alto: 0.24, rx: 0.1, ry: 0.12, rz: 0.07, pal: PAL[1] });

  if (t >= Trem) {
    const av2 = k.suave(k.tramo(t, Trem + 0.15, Ttap2 - 0.45));
    let yR = 0.68, zR = k.mez(-0.78, -0.3, av2), angR = 0;
    const c = k.tramo(t, Ttap2 - 0.7, Ttap2 + 0.45);
    if (t > Ttap2 - 0.7) {
      yR = k.mez(0.6, -0.46, c * c); zR = -0.36; angR = Math.min(c, 1) * 1.2;
      if (c >= 1) angR = k.mez(1.2, 0.18, k.suave(k.tramo(t, Ttap2 + 0.45, Ttap2 + 1.05)));
    }
    out.push({ x: 0, y: yR, z: zR, ang: angR, alto: 0.28, rx: 0.11, ry: 0.14, rz: 0.08, pal: PAL[0] });
  }
  return out;
}

export function velo(g) {
  const vg = g.createLinearGradient(0, 140, 0, 620);
  vg.addColorStop(0, "rgba(4,8,16,0.78)"); vg.addColorStop(0.55, "rgba(4,8,16,0.42)"); vg.addColorStop(1, "rgba(4,8,16,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

function fondo(g) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#061018"); bg.addColorStop(0.4, "#0c2836"); bg.addColorStop(1, "#12322a");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
}

export function escena(g, t, modo) {
  const cam = modo === "frente" ? k.mira(pose(t, FRENTE).pos, pose(t, FRENTE).mira) : camara(t);
  const sac = (t > Tsac - 0.05 && t < Tsac + 1.15) ? Math.sin((t - Tsac) * 16) * Math.exp(-(t - Tsac) * 2.4) * 0.03 : 0;
  fondo(g);
  g.save();
  if (sac) { g.translate(540, 1080); g.rotate(sac); g.translate(-540, -1080); }
  maquina(g, cam, t, bolsasEn(t));
  g.restore();
  velo(g);
}

export function garaje(g, t) {
  const f8 = v.frase(8);
  const Tcorta = f8.t("corta"), Tbaja = f8.t("baja"), Tfin = f9.inicio;
  fondo(g);
  g.fillStyle = "#1a120c"; g.fillRect(0, 0, 1080, 520);
  const suelo = g.createLinearGradient(0, 1380, 0, 1920);
  suelo.addColorStop(0, "#6a7380"); suelo.addColorStop(1, "#3e4652");
  g.fillStyle = suelo; g.fillRect(0, 1380, 1080, 540);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, 0, 1380, 1080, 540); g.restore();

  const bajaHasta = 31.45;
  const yBaja = k.mez(430, 740, k.tramo(t, Tgar - 0.9, bajaHasta));
  const yP = t < bajaHasta ? yBaja : k.mez(yBaja, 500, k.suave(k.tramo(t, bajaHasta, Tfin - 0.4)));
  const alto = 500;
  g.save();
  k.redondo(g, 140, yP, 800, alto, 8);
  const pg = g.createLinearGradient(140, 0, 940, 0);
  pg.addColorStop(0, "#d7d2c8"); pg.addColorStop(0.18, "#f7f4ee"); pg.addColorStop(0.5, "#fff"); pg.addColorStop(0.82, "#e6e1d6"); pg.addColorStop(1, "#b7b1a6");
  g.fillStyle = pg; g.fill();
  g.strokeStyle = "rgba(80,70,60,0.35)"; g.lineWidth = 3;
  for (let i = 1; i <= 4; i++) { const yy = yP + (alto * i) / 5; g.beginPath(); g.moveTo(150, yy); g.lineTo(930, yy); g.stroke(); }
  g.fillStyle = "rgba(150,200,230,0.55)";
  for (const wx of [230, 620]) { k.redondo(g, wx, yP + 70, 200, 90, 8); g.fill(); }
  g.restore();
  k.brillo(g, 540, 980, 700, "255,214,160", 0.12);

  const yR = 1288, x0 = 170, x1 = 910;
  const bx = k.mez(-160, 1240, k.tramo(t, Tcorta - 0.7, Tcorta + 0.55));
  const rompe = bx > x0 + 20 && bx < x1 - 20 && t < Tcorta + 0.45;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  g.strokeStyle = `rgba(${IR},0.95)`; g.lineWidth = 26;
  g.beginPath();
  if (!rompe) { g.moveTo(x0 + 40, yR); g.lineTo(x1 - 40, yR); }
  else { g.moveTo(x0 + 40, yR); g.lineTo(bx - 115, yR); g.moveTo(bx + 115, yR); g.lineTo(x1 - 40, yR); }
  g.stroke();
  g.restore();
  if (!rompe) k.brillo(g, 540, yR, 520, IR, 0.22);

  for (const [x, col, on] of [[x0, "255,170,60", true], [x1, "80,255,140", !rompe]]) {
    k.redondo(g, x - 36, yR - 28, 72, 56, 10); g.fillStyle = "#1a1e24"; g.fill();
    g.fillStyle = on ? `rgb(${col})` : "#2a3038";
    g.beginPath(); g.arc(x, yR, 11, 0, 6.2832); g.fill();
    if (on) k.brillo(g, x, yR, 90, col, 0.7);
  }

  g.save();
  g.translate(bx, yR - 6);
  g.beginPath(); g.arc(0, 0, 100, 0, 6.2832);
  const bg = g.createRadialGradient(-20, -24, 8, 0, 0, 78);
  bg.addColorStop(0, "#ff7a7a"); bg.addColorStop(0.5, "#e02323"); bg.addColorStop(1, "#8e1010");
  g.fillStyle = bg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = 5;
  g.beginPath(); g.arc(0, 0, 100, -0.2, 1.1); g.stroke();
  g.restore();

  if (t > Tbaja - 0.1 && t < Tbaja + 0.7) k.brillo(g, 540, yP + 40, 500, "255,244,220", k.pulso(t, Tbaja, 0.2) * 0.45);
  velo(g);
}
