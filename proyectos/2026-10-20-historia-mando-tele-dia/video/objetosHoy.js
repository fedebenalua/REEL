// El salón de hoy: la tele plana con su «ojito», el mando negro (por fuera y por dentro, con su placa, su chip y su
// lucecita), la mano que lo sostiene y los destellos de luz infrarroja que viajan del mando a la tele.
// La luz infrarroja, que no se ve, siempre va en el mismo color (rojo carmín) y no se usa para nada más.
import * as k from "#kit";
import { tejido, madera, canal, nieve } from "./mundo.js";

const { azar, redondo, suave: su, tramo: tr, mez } = k;

export const IR = "255,70,105";
// el mando: punta arriba, centrado en x = 0. La punta, la lucecita, está en (0, 280).
export const MANDO = { y0: 260, y1: 1140, w: 260, led: [0, 282] };
// la tele: su pantalla y su ojito
export const TELE = { cx: 0, cy: -700, w: 1000, h: 560, ojo: [0, -396] };
export const PULSOS_VEL = 330;

// ---------------------------------------------------------------- el salón
export function salonHoy(g, t, tinte = "80,140,255") {
  const pg = g.createLinearGradient(0, -1700, 0, 1500); pg.addColorStop(0, "#3d4cc8"); pg.addColorStop(0.6, "#5a6fe0"); pg.addColorStop(1, "#2e3a9c");
  g.fillStyle = pg; g.fillRect(-1300, -1800, 2600, 3600);
  g.save(); g.globalAlpha = 0.08; g.globalCompositeOperation = "screen";
  for (let x = -1300; x < 1300; x += 160) { g.fillStyle = "#8ab4ff"; g.fillRect(x, -1800, 3, 3600); }
  g.restore();
  // la luz de la tele sobre la pared
  k.brillo(g, 0, -760, 2300, tinte, 0.22);
  // el mueble
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 20;
  madera(g, -800, -318, 1600, 56, 12, ["#c08850", "#946034", "#58361a"]); g.restore();
  madera(g, -780, -262, 1560, 330, 14, ["#a8703c", "#7a4a26", "#3e2410"]);
  g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -262); g.lineTo(0, 68); g.stroke();
  for (const sx of [-1, 1]) { g.fillStyle = "#c9a45a"; g.beginPath(); g.arc(sx * 56, -90, 11, 0, 6.2832); g.fill(); }
}

// ---------------------------------------------------------------- la tele plana
// o: canalN, nv (nieve), ojo (0 a 1: se enciende al recibir luz), vol (null o 0 a 1: la barra de volumen), brilloVol
export function teleHoy(g, t, o = {}) {
  const { canalN = 0, nv = 0, ojo = 0, vol = null, volAl = 0, tinteGlow = 0.5 } = o;
  const { cx, cy, w, h } = TELE;
  g.save(); g.translate(cx, cy);
  // el pie
  for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 300 - 60, 264); g.lineTo(sx * 300 + 60, 264); g.lineTo(sx * 330 + 70, 320); g.lineTo(sx * 330 - 70, 320); g.closePath(); const fg = g.createLinearGradient(0, 264, 0, 320); fg.addColorStop(0, "#2a2d34"); fg.addColorStop(1, "#0b0c10"); g.fillStyle = fg; g.fill(); }
  // el marco
  g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 60; g.shadowOffsetY = 26;
  redondo(g, -w / 2 - 16, -h / 2 - 16, w + 32, h + 94, 22); g.fillStyle = "#07080b"; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  redondo(g, -w / 2 - 16, -h / 2 - 16, w + 32, h + 94, 22); const mg = g.createLinearGradient(0, -h / 2, 0, h / 2 + 70); mg.addColorStop(0, "#2c3038"); mg.addColorStop(0.1, "#13151a"); mg.addColorStop(1, "#08090c"); g.fillStyle = mg; g.fill();
  redondo(g, -w / 2 - 15, -h / 2 - 15, w + 30, h + 92, 21); g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 3; g.stroke();
  // la pantalla
  g.save(); redondo(g, -w / 2, -h / 2, w, h, 8); g.clip(); g.translate(-w / 2, -h / 2);
  canal(g, canalN, w, h, t);
  if (nv > 0.01) nieve(g, w, h, t, nv);
  const rg = g.createLinearGradient(0, 0, w * 0.7, h); rg.addColorStop(0, "rgba(255,255,255,0.16)"); rg.addColorStop(0.3, "rgba(255,255,255,0.03)"); rg.addColorStop(0.45, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(0, 0, w, h);
  // la barra de volumen
  if (volAl > 0.01 && vol !== null) {
    g.globalAlpha = volAl;
    redondo(g, 30, h - 150, 560, 110, 28); g.fillStyle = "rgba(6,8,14,0.8)"; g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.moveTo(66, h - 112); g.lineTo(92, h - 112); g.lineTo(120, h - 136); g.lineTo(120, h - 54); g.lineTo(92, h - 78); g.lineTo(66, h - 78); g.closePath(); g.fill();
    g.strokeStyle = "#fff"; g.lineWidth = 6; g.lineCap = "round"; for (let i = 0; i < 2; i++) { g.beginPath(); g.arc(124, h - 95, 16 + i * 16, -0.9, 0.9); g.stroke(); }
    redondo(g, 190, h - 108, 372, 30, 15); g.fillStyle = "rgba(255,255,255,0.22)"; g.fill();
    redondo(g, 190, h - 108, Math.max(30, 372 * vol), 30, 15); const vg = g.createLinearGradient(190, 0, 562, 0); vg.addColorStop(0, "#5aff8a"); vg.addColorStop(1, "#eaff5a"); g.fillStyle = vg; g.fill();
  }
  g.restore();
  // la placa y el ojito (el sensor), bajo la pantalla
  const ex = TELE.ojo[0] - cx, ey = TELE.ojo[1] - cy;
  redondo(g, ex - 110, ey - 34, 220, 68, 34); g.fillStyle = "#020203"; g.fill(); g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 2; g.stroke();
  g.beginPath(); g.arc(ex, ey, 29, 0, 6.2832);
  const ig = g.createRadialGradient(ex - 8, ey - 9, 2, ex, ey, 30); ig.addColorStop(0, `rgb(${k.mezRgb("120,40,52", "255,200,215", ojo)})`); ig.addColorStop(0.55, `rgb(${k.mezRgb("70,10,22", "255,80,110", ojo)})`); ig.addColorStop(1, `rgb(${k.mezRgb("16,2,6", "190,20,50", ojo)})`);
  g.fillStyle = ig; g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(ex - 9, ey - 11, 8, 4.5, -0.7, 0, 6.2832); g.fill();
  g.fillStyle = `rgba(${IR},${0.25 + 0.75 * ojo})`; g.beginPath(); g.arc(ex + 74, ey, 7, 0, 6.2832); g.fill();
  g.restore();
  if (ojo > 0.02) k.brillo(g, TELE.ojo[0], TELE.ojo[1], 150 + 220 * ojo, IR, 0.95 * ojo);
}

// ---------------------------------------------------------------- el mando negro
const BOTONES = { vol: [-62, 800], ch: [62, 800] };
export const BOTON_VOL = [-62, 760];
// una luz que recorre un camino de puntos [[x,y],...]: u de 0 a 1 es dónde está la cabeza; largo, cuánta cola.
export function luzPorCamino(g, pts, u, color, largo = 0.28, grosor = 7) {
  if (u <= 0 || u - largo >= 1) return;
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
  const en = (s) => { s = Math.max(0, Math.min(1, s)) * tot; for (let i = 0; i < seg.length; i++) { if (s <= seg[i]) { const f = s / seg[i]; return [mez(pts[i][0], pts[i + 1][0], f), mez(pts[i][1], pts[i + 1][1], f)]; } s -= seg[i]; } return pts[pts.length - 1]; };
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  for (const [gro, al] of [[grosor * 3.4, 0.25], [grosor, 1]]) {
    g.strokeStyle = `rgba(${color},${al})`; g.lineWidth = gro; g.beginPath();
    const a = Math.max(0, u - largo), b = Math.min(1, u);
    const n = 24; for (let i = 0; i <= n; i++) { const p = en(mez(a, b, i / n)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
    g.stroke();
  }
  const cab = en(Math.min(1, u)); k.brillo(g, cab[0], cab[1], grosor * 9, color, 0.9);
  g.restore();
}
export const CAMINO_BOTON = [[BOTON_VOL[0], 700], [BOTON_VOL[0], 668], [-24, 668], [-24, 640]];
export const CAMINO_LED = [[0, 596], [0, 440], [0, 300]];

// o: xray (0 a 1: se ve por dentro), pulsa (0 a 1), led (0 a 1), luz: los avances de las luces internas
export function mandoHoy(g, t, o = {}) {
  const { xray = 0, pulsa = 0, led = 0, uBoton = 0, uLed = 0 } = o;
  const { y0, y1, w } = MANDO, x0 = -w / 2;
  g.save();
  // la sombra
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 70; g.shadowOffsetY = 36; redondo(g, x0, y0, w, y1 - y0, 92); g.fillStyle = "#050507"; g.fill(); g.restore();
  // por dentro: la placa verde con sus pistas, el chip y los contactos
  if (xray > 0.01) {
    g.save(); g.globalAlpha *= xray; redondo(g, x0 + 22, y0 + 52, w - 44, y1 - y0 - 120, 34); g.clip();
    const pcb = g.createLinearGradient(x0, 0, x0 + w, 0); pcb.addColorStop(0, "#0a5a3c"); pcb.addColorStop(0.5, "#14805a"); pcb.addColorStop(1, "#084a30"); g.fillStyle = pcb; g.fillRect(x0, y0, w, y1 - y0);
    g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.4; g.drawImage(tejido, x0, y0, w, y1 - y0); g.restore();
    g.save(); g.globalAlpha *= xray;
    // las pistas de cobre
    g.strokeStyle = "#e6c25a"; g.lineWidth = 5; g.lineCap = "round"; g.lineJoin = "round";
    const az = azar(33);
    for (let i = 0; i < 16; i++) { const x = x0 + 40 + az() * (w - 80), y = 700 + az() * 340, dx = (az() - 0.5) * 120; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 30 + az() * 60); g.lineTo(x + dx, y + 60 + az() * 90); g.stroke(); }
    for (const pts of [CAMINO_BOTON, CAMINO_LED]) { g.lineWidth = 7; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); }
    g.beginPath(); g.moveTo(0, 740); g.lineTo(0, 720); g.lineWidth = 5; g.stroke();
    // los contactos de goma bajo los botones
    for (const [bx, by] of [[-62, 740], [62, 740], [0, 900], [-62, 980], [62, 980]]) { g.beginPath(); g.arc(bx, by, 24, 0, 6.2832); const cg = g.createRadialGradient(bx - 6, by - 6, 2, bx, by, 24); cg.addColorStop(0, "#5a626e"); cg.addColorStop(1, "#1a1e26"); g.fillStyle = cg; g.fill(); g.strokeStyle = "#e6c25a"; g.lineWidth = 3; g.stroke(); }
    // el chip
    for (let i = 0; i < 6; i++) for (const sx of [-1, 1]) { g.fillStyle = "#d8d2c0"; g.fillRect(sx > 0 ? 46 : -62, 604 + i * 14, 16, 8); }
    redondo(g, -46, 596, 92, 92, 8); const ch = g.createLinearGradient(-46, 596, 46, 688); ch.addColorStop(0, "#2a2e38"); ch.addColorStop(1, "#08090d"); g.fillStyle = ch; g.fill(); g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 2; g.stroke();
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(-30, 612, 4, 0, 6.2832); g.fill();
    g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(-26, 640, 52, 4); g.fillRect(-26, 652, 36, 4);
    g.restore();
    // las luces que lo recorren
    g.save(); g.globalAlpha *= xray; luzPorCamino(g, CAMINO_BOTON, uBoton, IR, 0.45); luzPorCamino(g, CAMINO_LED, uLed, IR, 0.4);
    if (uBoton > 0.9) k.brillo(g, 0, 642, 280, IR, 0.9 * Math.min(1, (uBoton - 0.9) * 10) * (1 - su(tr(uLed, 0.7, 1))));
    g.restore();
  }
  // la carcasa: negra y brillante, que se vuelve de cristal cuando se ve por dentro
  g.save(); g.globalAlpha *= 1 - 0.9 * xray;
  redondo(g, x0, y0, w, y1 - y0, 92);
  const cg2 = g.createLinearGradient(x0, 0, x0 + w, 0); cg2.addColorStop(0, "#0c0d11"); cg2.addColorStop(0.18, "#3c4150"); cg2.addColorStop(0.5, "#16181e"); cg2.addColorStop(0.85, "#0a0b0e"); cg2.addColorStop(1, "#262a34");
  g.fillStyle = cg2; g.fill();
  g.save(); redondo(g, x0, y0, w, y1 - y0, 92); g.clip();
  const sh = g.createLinearGradient(0, y0, 0, y0 + 300); sh.addColorStop(0, "rgba(255,255,255,0.22)"); sh.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = sh; g.fillRect(x0, y0, w, 300);
  g.restore();
  redondo(g, x0 + 1.5, y0 + 1.5, w - 3, y1 - y0 - 3, 90); g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 3; g.stroke();
  // los botones
  const btn = (x, y, r, col, brillo2 = 0) => { g.beginPath(); g.arc(x, y, r, 0, 6.2832); const bg = g.createRadialGradient(x - r * 0.3, y - r * 0.35, 2, x, y, r); bg.addColorStop(0, col[0]); bg.addColorStop(1, col[1]); g.fillStyle = bg; g.fill(); g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 2; g.stroke(); if (brillo2 > 0) k.brillo(g, x, y, r * 4, "255,255,255", brillo2); };
  btn(-72, 400, 38, ["#ff6a5a", "#a01810"]);
  btn(72, 400, 30, ["#4a4f5c", "#1a1d24"]);
  // el círculo de las flechas
  g.beginPath(); g.arc(0, 560, 108, 0, 6.2832); const dg = g.createRadialGradient(-30, 520, 10, 0, 560, 108); dg.addColorStop(0, "#3a3f4c"); dg.addColorStop(1, "#13151b"); g.fillStyle = dg; g.fill(); g.strokeStyle = "rgba(255,255,255,0.15)"; g.lineWidth = 3; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.6)"; for (const a of [0, 1.5708, 3.1416, 4.7124]) { g.save(); g.translate(Math.cos(a) * 76, 560 + Math.sin(a) * 76); g.rotate(a + 1.5708); g.beginPath(); g.moveTo(-12, 6); g.lineTo(0, -8); g.lineTo(12, 6); g.closePath(); g.fill(); g.restore(); }
  btn(0, 560, 42, ["#555b6a", "#1d2028"]);
  // el balancín del volumen (con su +) y el del canal
  for (const [bx, by, sig] of [[-62, 800, "vol"], [62, 800, "ch"]]) {
    redondo(g, bx - 38, by - 90, 76, 180, 38); const rg2 = g.createLinearGradient(bx - 38, 0, bx + 38, 0); rg2.addColorStop(0, "#2a2e38"); rg2.addColorStop(0.4, "#4a505e"); rg2.addColorStop(1, "#16181e"); g.fillStyle = rg2; g.fill(); g.strokeStyle = "rgba(255,255,255,0.15)"; g.lineWidth = 2; g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 6; g.lineCap = "round";
    g.beginPath(); g.moveTo(bx - 14, by - 50); g.lineTo(bx + 14, by - 50); g.moveTo(bx, by - 64); g.lineTo(bx, by - 36); g.stroke();
    g.beginPath(); g.moveTo(bx - 14, by + 50); g.lineTo(bx + 14, by + 50); g.stroke();
  }
  if (pulsa > 0.02) { g.fillStyle = `rgba(255,255,255,${0.3 * pulsa})`; redondo(g, -100, 706, 76, 90, 34); g.fill(); k.brillo(g, BOTON_VOL[0], 756, 260, "255,255,255", 0.5 * pulsa); }
  btn(-72, 1000, 26, ["#4a9aff", "#1a4a9a"]); btn(0, 1000, 26, ["#ffd24a", "#9a6a10"]); btn(72, 1000, 26, ["#5aff8a", "#1a8a40"]);
  g.restore();
  // la ventanita de la punta: la lucecita
  const [lx, ly] = MANDO.led;
  redondo(g, lx - 52, ly - 20, 104, 40, 20); g.fillStyle = "#030204"; g.fill(); g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 2; g.stroke();
  g.beginPath(); g.ellipse(lx, ly, 30, 12, 0, 0, 6.2832); const lg = g.createRadialGradient(lx - 8, ly - 3, 1, lx, ly, 30); lg.addColorStop(0, `rgb(${k.mezRgb("80,20,34", "255,230,238", led)})`); lg.addColorStop(0.6, `rgb(${k.mezRgb("40,6,14", "255,90,120", led)})`); lg.addColorStop(1, `rgb(${k.mezRgb("12,2,6", "170,10,40", led)})`); g.fillStyle = lg; g.fill();
  if (led > 0.02) { k.brillo(g, lx, ly, 260 + 160 * led, IR, 0.95 * led); k.brillo(g, lx, ly, 90, "255,255,255", 0.7 * led); }
  g.restore();
}

// ---------------------------------------------------------------- la mano
const PIEL = ["#f6cba4", "#dc9f78", "#a8664a"];
function cap(g, x0, y0, x1, y1, w, col) {
  g.save(); g.lineCap = "round";
  g.strokeStyle = "rgba(60,25,10,0.35)"; g.lineWidth = w + 5; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.restore();
}
// La palma y los cuatro dedos, por detrás y por los lados del mando (se dibuja antes del mando la palma y después los dedos).
export function manoDetras(g) {
  g.save(); g.beginPath(); g.ellipse(0, 1130, 230, 250, 0, 0, 6.2832); const pg = g.createRadialGradient(-40, 1060, 20, 0, 1130, 250); pg.addColorStop(0, PIEL[0]); pg.addColorStop(1, PIEL[2]); g.fillStyle = pg; g.fill(); g.restore();
}
export function manoDelante(g, pulgar = 0) {
  // los cuatro dedos, rodeando el lado derecho
  const fg = (y) => { const gr = g.createLinearGradient(0, y - 34, 0, y + 34); gr.addColorStop(0, PIEL[0]); gr.addColorStop(1, PIEL[1]); return gr; };
  for (let i = 0; i < 4; i++) { const y = 905 + i * 74; cap(g, 205, y, 96, y + 10, 66, fg(y)); }
  // el pulgar: sube desde abajo a la izquierda y baja sobre el botón del volumen
  const press = pulgar;
  const tx = mez(-76, -68, press), ty = mez(842, 806, press);
  cap(g, -210, 1230, tx, ty, 78, PIEL[0]);
  g.save(); g.translate(tx, ty); g.rotate(-0.4);
  g.fillStyle = "rgba(255,235,225,0.6)"; redondo(g, -22, -32, 44, 40, 18); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- los destellos de luz infrarroja
// Un mensaje de ceros y unos: un destello largo es un 1 y uno corto es un 0, uno cada 0,27 s, desde la punta del mando.
export const BITS = [1, 0, 1, 1, 0, 0, 1, 0];
export const BIT_T = 0.27;
// Todos los destellos: [{ t0 (cuándo salen), dur (lo que dura la luz) }]
export function destellos(mensajes) {
  const L = [];
  for (const m of mensajes) for (let r = 0; r < (m.rep ?? 1); r++) BITS.forEach((b, i) => L.push({ t0: m.t0 + r * (BITS.length * BIT_T + 0.35) + i * BIT_T, dur: b ? 0.2 : 0.09 }));
  return L;
}
// ¿Está la lucecita encendida en t?
export const ledEnc = (t, L) => (L.some((d) => t >= d.t0 && t < d.t0 + d.dur) ? 1 : 0);
// ¿Le llega luz al ojito en t? (la cabeza ya ha pasado y la cola aún no)
export function ojoRecibe(t, L, yOjo = TELE.ojo[1]) {
  return L.some((d) => { const yc = MANDO.led[1] - PULSOS_VEL * (t - d.t0), yt = yc + PULSOS_VEL * Math.min(d.dur, t - d.t0); return yc <= yOjo + 4 && yt >= yOjo - 4 && t - d.t0 > 0; }) ? 1 : 0;
}
export function pulsos(g, t, L, yTope = TELE.ojo[1] + 26) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const d of L) {
    const e = t - d.t0; if (e < 0) continue;
    const cab = MANDO.led[1] - 20 - PULSOS_VEL * e, cola = MANDO.led[1] - 20 - PULSOS_VEL * Math.max(0, e - d.dur);
    const a = Math.max(cab, yTope);
    if (a >= cola || cola < yTope) continue;
    const gr = g.createLinearGradient(0, a, 0, cola); gr.addColorStop(0, `rgba(${IR},1)`); gr.addColorStop(1, `rgba(${IR},0.4)`);
    g.strokeStyle = `rgba(${IR},0.22)`; g.lineWidth = 46; g.beginPath(); g.moveTo(0, a); g.lineTo(0, cola); g.stroke();
    g.strokeStyle = gr; g.lineWidth = 20; g.beginPath(); g.moveTo(0, a); g.lineTo(0, cola); g.stroke();
    g.strokeStyle = "rgba(255,235,240,0.9)"; g.lineWidth = 7; g.beginPath(); g.moveTo(0, a + 4); g.lineTo(0, cola - 4); g.stroke();
    k.brillo(g, 0, a, 110, IR, 0.8);
  }
  g.restore();
}

// ---------------------------------------------------------------- el móvil con su app de mando
// Centrado en (0,0), de 340 × 700. pulsa: 0 a 1, el botón de subir volumen apretado.
export const VOL_MAS = [-92, 92]; // dónde está el botón de volumen (en las coordenadas del móvil)
export function movilApp(g, t, o = {}) {
  const { pulsa = 0, luz = 0, pulsaCh = 0, flecha = null } = o;
  const W2 = 340, H2 = 700;
  g.save();
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 70; g.shadowOffsetY = 36; redondo(g, -W2 / 2, -H2 / 2, W2, H2, 62); g.fillStyle = "#050507"; g.fill(); g.restore();
  redondo(g, -W2 / 2, -H2 / 2, W2, H2, 62); k.metal(g, -W2 / 2, W2 / 2, ["#2a2d34", "#c9ced6", "#6b707a", "#e6e9ee", "#2e3138"]);
  // la pantalla
  const sw = W2 - 22, sh = H2 - 22;
  redondo(g, -sw / 2, -sh / 2, sw, sh, 52); g.fillStyle = "#04060c"; g.fill(); g.save(); redondo(g, -sw / 2, -sh / 2, sw, sh, 52); g.clip();
  const bg = g.createLinearGradient(0, -sh / 2, 0, sh / 2); bg.addColorStop(0, "#14224a"); bg.addColorStop(1, "#070c1e"); g.fillStyle = bg; g.fillRect(-sw / 2, -sh / 2, sw, sh);
  k.brillo(g, 0, -40, 520, "90,150,255", 0.25 + 0.3 * luz);
  // arriba: un televisor pequeño y el botón de encendido
  const tvIc = (x, y) => { g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 5; g.lineCap = "round"; redondo(g, x - 34, y - 22, 68, 44, 8); g.stroke(); g.beginPath(); g.moveTo(x - 18, y + 36); g.lineTo(x + 18, y + 36); g.stroke(); };
  tvIc(0, -268);
  g.beginPath(); g.arc(-108, -262, 30, 0, 6.2832); const pg = g.createRadialGradient(-116, -272, 3, -108, -262, 30); pg.addColorStop(0, "#ff7a6a"); pg.addColorStop(1, "#b01c14"); g.fillStyle = pg; g.fill();
  g.strokeStyle = "#fff"; g.lineWidth = 5; g.beginPath(); g.arc(-108, -260, 11, -1.1, 4.25); g.stroke(); g.beginPath(); g.moveTo(-108, -276); g.lineTo(-108, -262); g.stroke();
  g.beginPath(); g.arc(108, -262, 30, 0, 6.2832); g.fillStyle = "rgba(255,255,255,0.14)"; g.fill();
  // el círculo de las flechas
  g.beginPath(); g.arc(0, -96, 112, 0, 6.2832); const dg = g.createRadialGradient(-30, -130, 10, 0, -96, 112); dg.addColorStop(0, "#2a3a6a"); dg.addColorStop(1, "#0e1632"); g.fillStyle = dg; g.fill(); g.strokeStyle = "rgba(160,200,255,0.4)"; g.lineWidth = 3; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.85)"; for (const a of [0, 1.5708, 3.1416, 4.7124]) { g.save(); g.translate(Math.cos(a) * 78, -96 + Math.sin(a) * 78); g.rotate(a + 1.5708); g.beginPath(); g.moveTo(-14, 7); g.lineTo(0, -9); g.lineTo(14, 7); g.closePath(); g.fill(); g.restore(); }
  g.beginPath(); g.arc(0, -96, 44, 0, 6.2832); g.fillStyle = "#3a5090"; g.fill();
  if (flecha && flecha[1] > 0.02) { const a = [0, 1.5708, 3.1416, 4.7124][flecha[0]], fx = Math.cos(a) * 78, fy = -96 + Math.sin(a) * 78; g.beginPath(); g.arc(fx, fy, 40, 0, 6.2832); g.fillStyle = `rgba(190,225,255,${0.6 * flecha[1]})`; g.fill(); k.brillo(g, fx, fy, 260, "140,200,255", 0.9 * flecha[1]); }
  // los balancines del volumen y del canal
  for (const [bx, esVol] of [[-92, true], [92, false]]) {
    redondo(g, bx - 56, 58, 112, 240, 56); const rg = g.createLinearGradient(bx - 56, 0, bx + 56, 0); rg.addColorStop(0, "#1a2850"); rg.addColorStop(0.5, "#34498c"); rg.addColorStop(1, "#141f40"); g.fillStyle = rg; g.fill(); g.strokeStyle = "rgba(160,200,255,0.4)"; g.lineWidth = 3; g.stroke();
    g.strokeStyle = "#fff"; g.lineWidth = 8; g.lineCap = "round";
    g.beginPath(); g.moveTo(bx - 20, 110); g.lineTo(bx + 20, 110); g.moveTo(bx, 90); g.lineTo(bx, 130); g.stroke();
    g.beginPath(); g.moveTo(bx - 20, 246); g.lineTo(bx + 20, 246); g.stroke();
    const pp = esVol ? pulsa : pulsaCh; if (pp > 0.02) { redondo(g, bx - 56, 58, 112, 110, 50); g.fillStyle = `rgba(170,215,255,${0.55 * pp})`; g.fill(); k.brillo(g, bx, 112, 320, "140,200,255", 0.85 * pp); }
  }
  // los tres puntitos de abajo
  for (const [bx, col] of [[-60, "#5aff8a"], [0, "#ffd24a"], [60, "#4a9aff"]]) { g.beginPath(); g.arc(bx, 318, 12, 0, 6.2832); g.fillStyle = col; g.fill(); }
  const rf = g.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2); rf.addColorStop(0.22, "rgba(255,255,255,0)"); rf.addColorStop(0.3, "rgba(255,255,255,0.12)"); rf.addColorStop(0.38, "rgba(255,255,255,0)");
  g.fillStyle = rf; g.fillRect(-sw / 2, -sh / 2, sw, sh);
  g.restore();
  redondo(g, -54, -sh / 2 + 12, 108, 30, 15); g.fillStyle = "#020203"; g.fill();
  g.restore();
}
// La palma por detrás del móvil y, delante, los dedos y el pulgar que pulsa el volumen.
export function manoMovilDetras(g) {
  g.save(); g.beginPath(); g.ellipse(0, 420, 220, 250, 0, 0, 6.2832); const pg = g.createRadialGradient(-40, 360, 20, 0, 420, 250); pg.addColorStop(0, PIEL[0]); pg.addColorStop(1, PIEL[1]); g.fillStyle = pg; g.fill(); g.restore();
}
export function manoMovilDelante(g, pulgar = 0, obj = [VOL_MAS[0] + 4, 124]) {
  const fg = (y) => { const gr = g.createLinearGradient(0, y - 34, 0, y + 34); gr.addColorStop(0, PIEL[0]); gr.addColorStop(1, PIEL[1]); return gr; };
  for (let i = 0; i < 4; i++) { const y = 110 + i * 74; cap(g, 214, y, 112, y + 10, 66, fg(y)); }
  const tx = mez(-106, obj[0], pulgar), ty = mez(190, obj[1], pulgar);
  cap(g, -205, 470, tx, ty, 84, PIEL[0]);
  g.save(); g.translate(tx, ty); g.rotate(-0.4); g.fillStyle = "rgba(255,235,225,0.6)"; redondo(g, -22, -34, 44, 40, 18); g.fill(); g.restore();
}
