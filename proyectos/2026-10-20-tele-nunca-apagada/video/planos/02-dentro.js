// «Cuando la apagas, el resto de la tele se duerme: la pantalla, los altavoces, casi todos los circuitos. Pero el
// ojito sigue recibiendo electricidad del enchufe, día y noche. Pulsas el botón, le llega la luz de tu mando, y el
// ojito va despertando al resto, pieza a pieza.»
// Otro sitio: por dentro de la tele, de neón: la pantalla, los dos altavoces, el cerebro, la fuente, la memoria y, abajo,
// el chip del ojito. Una cámara. Se entra con un corte en «Cuando».
// - «la apagas»: la imagen se cierra en una raya. «se duerme: la pantalla, los altavoces, casi todos los circuitos»:
//   cada pieza se apaga cuando se nombra y de ella salen «z».
// - «el ojito sigue recibiendo electricidad del enchufe»: la cámara baja al chip del ojito y sigue el cable hasta el
//   enchufe; por él corre la electricidad. «día y noche»: un sol y una luna giran alrededor.
// - «Pulsas… le llega la luz de tu mando»: el mando, abajo, lanza su luz al ojito, que se abre y destella.
// - «va despertando al resto, pieza a pieza»: la cámara se aleja y el ojito despierta una a una el cerebro, la
//   memoria, la fuente, los altavoces y la pantalla.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, canal } from "../mundo.js";
import { mandoHoy, IR } from "../objetosHoy.js";
import { ojo, tubo, rect, circulo, linea, CIAN, ROSA, AMARILLO, VERDE } from "../neon.js";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const T0 = f4.inicio, Tapa = f4.t("apagas"), Tdue = f4.t("duerme"), Tpan = f4.t("pantalla"), Talt = f4.t("altavoces"), Tcir = f4.t("circuitos");
const Toj = f5.t("ojito"), Trec = f5.t("recibiendo"), Tele = f5.t("electricidad"), Tenc = f5.t("enchufe"), Tdia = f5.t("dia"), Tnoc = f5.t("noche");
const Tbot = f6.t("boton"), Tluz = f6.t("llega") + 0.1, Tojo = f6.t("ojito"), Tdes = f6.t("despertando"), Tres = f6.t("resto"), Tpie = f6.t("pieza");
const FIN = v.frase(7).inicio;

// la distribución de piezas (coordenadas del mundo)
const PANEL = [-400, -620, 800, 360], SPK = [[-270, -100], [270, -100]], CHIP = [0, -100], PS = [-400, 100, 340, 220], MEM = [60, 100, 340, 220], OJO = [0, 480], PLUG = [-470, 600];
const CABLE = [[-440, 600], [-440, 430], [-230, 430], [-230, 320]];                 // el grueso, a la fuente
const CABLE_OJO = [[-440, 600], [-440, 560], [-250, 560], [-250, 500], [-140, 500]]; // el fino, al ojito (siempre vivo)
const T_CHIP = [[0, 405], [0, 0]];                                                    // del ojito al cerebro
const T_PS = [[-130, 100], [-130, -100], [-100, -100]], T_MEM = [[130, 100], [130, -100], [100, -100]];
const T_PAN = [[0, -200], [0, -260]], T_SPK = [[[-100, -60], [-160, -60]], [[100, -60], [160, -60]]];

const cam = camino2D([
  [T0, [0.72, 0, 19]], [Tdue + 0.1, [0.82, 0, -70]], [Tcir, [0.82, 0, 60]], [Tcir + 1.0, [1.5, 0, 420]], [Tele - 0.4, [1.5, 0, 420]], [Tele + 0.5, [1.15, -170, 480]],
  [Tenc + 0.1, [1.15, -300, 520]], [Tdia, [1.35, -120, 500]], [f6.inicio + 0.4, [1.35, -120, 500]], [Tbot + 0.25, [0.9, 0, 420]],
  [Tdes - 0.1, [0.9, 0, 420]], [Tdes + 1.5, [0.72, 0, 19]], [FIN, [0.72, 0, 19]],
]);

// cuándo se apaga y cuándo vuelve cada pieza
const NOCHE = (tOff) => 1 - su(tr(tOff, 0, 1));
const luz = (t, off, on) => Math.min(1, Math.max(0, 1 - su(tr(t, off, off + 0.4)) + su(tr(t, on, on + 0.35)))) * (t > off && t < off + 0.5 ? 0.65 + 0.35 * Math.sin((t - off) * 48) : 1);
const T_ON = { chip: Tdes + 0.8, mem: Tdes + 1.35, ps: Tdes + 1.55, spk: Tdes + 1.75, pan: Tdes + 1.95 };
const LEDY = 700;
const L = {
  pan: (t) => luz(t, Tpan, T_ON.pan), spk: (t) => luz(t, Talt, T_ON.spk), chip: (t) => luz(t, Tcir - 0.5, T_ON.chip),
  mem: (t) => luz(t, Tcir - 0.1, T_ON.mem), ps: (t) => luz(t, Tcir + 0.1, T_ON.ps),
};
const ePanel = (t) => (t < T0 + 1 ? 1 - tr(t, Tapa, Tapa + 0.4) ** 1.6 : su(tr(t, T_ON.pan, T_ON.pan + 0.35)));

// la electricidad que corre por un camino
function largo(pts) { let d = 0; for (let i = 1; i < pts.length; i++) d += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return d; }
function enCamino(pts, d) { for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (d <= l) { const u = d / l; return [mez(pts[i - 1][0], pts[i][0], u), mez(pts[i - 1][1], pts[i][1], u)]; } d -= l; } return pts[pts.length - 1]; }
function chispas(g, t, pts, t0, t1, col, vel = 380, sep = 0.22) {
  if (t < t0 || t > t1 + 3) return;
  const Ld = largo(pts); g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 30; i++) {
    const te = t0 + i * sep; if (te > t1) break;
    const d = (t - te) * vel; if (d < 0 || d > Ld) continue;
    const [x, y] = enCamino(pts, d); k.brillo(g, x, y, 60, col, 0.9); g.fillStyle = `rgba(${col},1)`; g.beginPath(); g.arc(x, y, 9, 0, 6.2832); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y, 4, 0, 6.2832); g.fill();
  }
  g.restore();
}
const cuerpo = (g, x, y, w, h, r, col, al) => { redondo(g, x, y, w, h, r); const bg = g.createLinearGradient(x, y, x + w, y + h); bg.addColorStop(0, `rgba(${col},${0.12 + 0.14 * al})`); bg.addColorStop(1, "rgba(8,3,26,0.92)"); g.fillStyle = bg; g.fill(); };
const zetas = (g, t, x, y, al, sem) => {
  if (al > 0.99) return; const a = 1 - al; g.save(); g.fillStyle = "#c8b8ff"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i < 3; i++) { const ph = ((t * 0.55 + i / 3 + sem * 0.17) % 1), s = 34 + 26 * ph; g.globalAlpha = a * Math.sin(ph * Math.PI) * 0.9; g.font = `800 ${s}px Figtree`; g.fillText("z", x + 40 * Math.sin(ph * 5 + sem + i) + i * 24 - 24, y - 150 * ph); }
  g.restore();
};

function panel(g, t) {
  const [x, y, w, h] = PANEL, l = L.pan(t), e = ePanel(t);
  cuerpo(g, x, y, w, h, 26, CIAN, l);
  g.save(); redondo(g, x + 18, y + 18, w - 36, h - 36, 14); g.clip(); g.fillStyle = "#020104"; g.fillRect(x, y, w, h);
  if (e > 0.002) {
    g.save(); const sy = Math.max(0.004, Math.min(1, e / 0.6)), sx = e > 0.2 ? 1 : Math.max(0.01, e / 0.2);
    g.translate(x + w / 2, y + h / 2); g.scale(sx * (w - 36) / 540, sy * (h - 36) / 450); g.translate(-270, -225); canal(g, 0, 540, 450, t); g.restore();
    if (e < 0.999) { g.fillStyle = `rgba(255,255,255,${0.9 * Math.min(1, (1 - e) * 3) * Math.min(1, e * 6)})`; g.fillRect(x + w / 2 - (w * (e > 0.2 ? 1 : Math.max(0.01, e / 0.2))) / 2, y + h / 2 - 3, w * (e > 0.2 ? 1 : Math.max(0.01, e / 0.2)), 6); }
  }
  g.restore();
  tubo(g, rect(x, y, w, h, 26), CIAN, 8, 0.25 + 0.75 * l);
  zetas(g, t, x + w - 90, y + h - 40, l, 1);
}
function altavoz(g, t, c, i) {
  const [x, y] = c, l = L.spk(t);
  cuerpo(g, x - 112, y - 112, 224, 224, 112, ROSA, l);
  g.save(); g.translate(x, y); const pulso = l > 0.9 && t > T_ON.spk ? 1 + 0.05 * Math.sin(t * 22) * su(tr(t, T_ON.spk, T_ON.spk + 0.3)) * (1 - su(tr(t, FIN - 0.6, FIN - 0.3))) : 1; g.scale(pulso, pulso);
  tubo(g, circulo(0, 0, 112), ROSA, 8, 0.25 + 0.75 * l); tubo(g, circulo(0, 0, 66), ROSA, 6, 0.2 + 0.7 * l); tubo(g, circulo(0, 0, 22), ROSA, 6, 0.25 + 0.75 * l);
  g.restore();
  zetas(g, t, x + 20, y - 60, l, 2 + i);
}
function cerebro(g, t) {
  const [x, y] = CHIP, l = L.chip(t);
  g.save(); g.translate(x, y);
  for (let i = -3; i <= 3; i++) for (const [dx, dy, w2, h2] of [[i * 28, -118, 10, 22], [i * 28, 96, 10, 22], [-118, i * 28, 22, 10], [96, i * 28, 22, 10]]) { g.fillStyle = `rgba(${AMARILLO},${0.25 + 0.6 * l})`; g.fillRect(dx - w2 / 2, dy, w2, h2); }
  cuerpo(g, -100, -100, 200, 200, 18, AMARILLO, l);
  tubo(g, rect(-100, -100, 200, 200, 18), AMARILLO, 8, 0.25 + 0.75 * l); tubo(g, rect(-52, -52, 104, 104, 10), AMARILLO, 5, 0.2 + 0.7 * l);
  g.restore(); zetas(g, t, x + 30, y - 120, l, 5);
}
function fuente(g, t) {
  const [x, y, w, h] = PS, l = L.ps(t);
  cuerpo(g, x, y, w, h, 20, AMARILLO, l); tubo(g, rect(x, y, w, h, 20), AMARILLO, 7, 0.25 + 0.75 * l);
  for (let i = 0; i < 3; i++) { tubo(g, rect(x + 30 + i * 62, y + 40, 44, 110, 14), AMARILLO, 5, 0.2 + 0.7 * l); tubo(g, linea([x + 36 + i * 62, y + 52], [x + 60 + i * 62, y + 52]), AMARILLO, 4, 0.2 + 0.7 * l); }
  tubo(g, circulo(x + 262, y + 110, 46), AMARILLO, 5, 0.2 + 0.7 * l); tubo(g, circulo(x + 262, y + 110, 24), AMARILLO, 4, 0.2 + 0.7 * l);
  zetas(g, t, x + 270, y - 6, l, 3);
}
function memoria(g, t) {
  const [x, y, w, h] = MEM, l = L.mem(t);
  cuerpo(g, x, y, w, h, 20, VERDE, l); tubo(g, rect(x, y, w, h, 20), VERDE, 7, 0.25 + 0.75 * l);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) tubo(g, rect(x + 28 + c * 100, y + 34 + r * 92, 76, 60, 8), VERDE, 4, 0.2 + 0.7 * l);
  zetas(g, t, x + 80, y - 6, l, 4);
}
function chipOjo(g, t) {
  const [x, y] = OJO, desp = su(tr(t, Tluz, Tluz + 0.2)), flash = k.pulso(t, Tojo - 0.05, 0.4) + 0.7 * k.pulso(t, Tluz + 0.1, 0.35);
  cuerpo(g, x - 140, y - 75, 280, 150, 22, "255,70,105", 1); tubo(g, rect(x - 140, y - 75, 280, 150, 22), IR, 8, 1);
  for (let i = -3; i <= 3; i++) { g.fillStyle = `rgba(${IR},0.8)`; g.fillRect(x + i * 36 - 6, y + 75, 12, 18); }
  // el ojo está a medio abrir mientras la tele duerme, y se abre del todo al recibir la luz
  const par = 1 - 0.9 * k.pulso(t, Tele + 1.0, 0.16) - 0.9 * k.pulso(t, Tdia + 0.9, 0.16);
  const abre = (0.55 + 0.45 * desp) * par;
  ojo(g, t, { x, y, R: 74, abre, mx: 0.5 * Math.sin(t * 1.1), my: 0.1 * Math.sin(t * 0.8), pupila: 0.5 - 0.2 * flash, luz: 0.6 + 0.4 * desp, flash: Math.min(1, flash) });
}
function enchufe(g, t) {
  const [x, y] = PLUG;
  g.save(); g.translate(x, y); tubo(g, rect(-48, -40, 96, 80, 14), AMARILLO, 7, 1);
  for (const dx of [-20, 20]) tubo(g, linea([dx, -40], [dx, -68]), AMARILLO, 7, 1);
  g.restore();
  tubo(g, linea(...CABLE), AMARILLO, 7, 0.55); tubo(g, linea(...CABLE_OJO), AMARILLO, 4, 1);
}
// «día y noche»: un sol y una luna dando vueltas alrededor del chip del ojito
function diaNoche(g, t) {
  const a = su(tr(t, Tdia - 0.1, Tdia + 0.25)) * (1 - su(tr(t, f6.inicio - 0.1, f6.inicio + 0.2)));
  if (a < 0.01) return;
  const ang = (t - Tdia) * 3.2 + 3.1416, [x, y] = OJO, R = 235;
  g.save(); g.globalAlpha = a;
  g.strokeStyle = "rgba(200,190,255,0.25)"; g.lineWidth = 4; g.setLineDash([10, 16]); g.beginPath(); g.ellipse(x, y, R * 1.08, R * 0.62, 0, 0, 6.2832); g.stroke(); g.setLineDash([]);
  for (const [off, sol] of [[0, true], [Math.PI, false]]) {
    const px = x + Math.cos(ang + off) * R * 1.08, py = y + Math.sin(ang + off) * R * 0.62;
    if (sol) { k.brillo(g, px, py, 130, "255,220,90", 0.9); g.fillStyle = "#fff0a0"; g.beginPath(); g.arc(px, py, 34, 0, 6.2832); g.fill(); }
    else { g.fillStyle = "#dcd6ff"; g.beginPath(); g.arc(px, py, 32, 0, 6.2832); g.fill(); g.fillStyle = "#0c0624"; g.beginPath(); g.arc(px + 14, py - 8, 28, 0, 6.2832); g.fill(); k.brillo(g, px, py, 100, "190,180,255", 0.5); }
  }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // el fondo: la placa, oscura, con una rejilla tenue
  const bg = g.createLinearGradient(0, -1000, 0, 800); bg.addColorStop(0, "#0a0422"); bg.addColorStop(1, "#150836");
  g.fillStyle = bg; g.fillRect(-1000, -1300, 2000, 2400);
  g.strokeStyle = "rgba(255,70,200,0.06)"; g.lineWidth = 2; for (let i = -10; i <= 10; i++) { g.beginPath(); g.moveTo(i * 100, -1300); g.lineTo(i * 100, 1100); g.stroke(); g.beginPath(); g.moveTo(-1000, i * 100 + 40); g.lineTo(1000, i * 100 + 40); g.stroke(); }
  // los caminos de la placa
  const cam1 = (pts, col, al) => tubo(g, linea(...pts), col, 3.5, al);
  cam1(T_PS, AMARILLO, 0.25 + 0.5 * Math.min(L.ps(t), L.chip(t))); cam1(T_MEM, VERDE, 0.25 + 0.5 * Math.min(L.mem(t), L.chip(t)));
  cam1(T_PAN, CIAN, 0.25 + 0.5 * Math.min(L.pan(t), L.chip(t))); T_SPK.forEach((p) => cam1(p, ROSA, 0.25 + 0.5 * L.spk(t))); cam1(T_CHIP, IR, 0.5);
  panel(g, t); SPK.forEach((c, i) => altavoz(g, t, c, i)); cerebro(g, t); fuente(g, t); memoria(g, t); enchufe(g, t); chipOjo(g, t); diaNoche(g, t);
  // la electricidad: del enchufe al ojito (siempre) y a la fuente; y, al despertar, del ojito al resto
  chispas(g, t, CABLE_OJO, Trec, Tbot - 0.5, AMARILLO, 330, 0.5); chispas(g, t, CABLE, T0 - 3, Tcir, AMARILLO, 330, 0.5);
  chispas(g, t, T_CHIP, Tdes, Tdes, IR, 520, 1);
  chispas(g, t, T_PS.slice().reverse(), T_ON.ps - 0.4, T_ON.ps - 0.4, AMARILLO, 600, 1);
  chispas(g, t, [[-100, -60], [-160, -60]], T_ON.spk - 0.25, T_ON.spk - 0.25, ROSA, 500, 1); chispas(g, t, [[100, -60], [160, -60]], T_ON.spk - 0.25, T_ON.spk - 0.25, ROSA, 500, 1);
  chispas(g, t, [[100, -100], [130, -100], [130, 100]], T_ON.mem - 0.4, T_ON.mem - 0.4, VERDE, 600, 1);
  chispas(g, t, [[0, -200], [0, -260]], T_ON.pan - 0.3, T_ON.pan - 0.3, CIAN, 600, 1);
  // el mando de fuera: lanza su luz al ojito
  const ent = su(tr(t, Tbot - 0.4, Tbot + 0.2)) * (1 - su(tr(t, Tdes + 0.4, Tdes + 1.0)));
  if (ent > 0.01) {
    g.save(); g.translate(0, LEDY + 520 * (1 - ent)); g.scale(0.62, 0.62); g.translate(0, -282); mandoHoy(g, t, { led: k.pulso(t, Tluz - 0.05, 0.16) + k.pulso(t, Tluz + 0.35, 0.12) }); g.restore();
    const lz = k.pulso(t, Tluz - 0.05, 0.2) + k.pulso(t, Tluz + 0.35, 0.16);
    if (lz > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; const lg = g.createLinearGradient(0, LEDY, 0, OJO[1] + 80); lg.addColorStop(0, `rgba(${IR},${0.9 * Math.min(1, lz)})`); lg.addColorStop(1, `rgba(255,220,230,${Math.min(1, lz)})`); g.strokeStyle = lg; g.lineWidth = 26; g.beginPath(); g.moveTo(0, LEDY + 520 * (1 - ent) - 60); g.lineTo(0, OJO[1] + 80); g.stroke(); g.restore(); }
  }
  sinVista(g);
  k.fogonazo(g, 540 + (OJO[0] - cx) * Z, 960 + (OJO[1] - cy) * Z, t - (Tluz + 0.1), 900 * Z, "255,150,175");
  velo(g, 0.55);
  vineta(g, 0.4);
}

export const momentos = { apaga: Tapa, duerme: Tdue, enchufe: Tenc, luz: Tluz, despierta: Tdes };
