// «Y ahora también hace de mando de la tele. Con una app, tu móvil tiene el volumen, los canales y las flechas. Y ya no
// tienes que buscar el mando entre los cojines.»
// El salón de neón, con la tele apagada. Corte en «Y». Una sola cámara.
// - «ahora también hace de mando de la tele»: entra el móvil, en la mano; el pulgar aprieta el botón rojo y la tele despierta.
// - «con una app… volumen, canales y flechas»: el pulgar aprieta cada cosa y la tele responde.
// - «ya no tienes que buscar el mando»: entra el mando de siempre y los cojines se lo tragan, con su «?».
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, tejido } from "../mundo.js";
import { salonHoy, teleHoy, mandoHoy, movilApp, manoMovilDetras, manoMovilDelante, TELE } from "../objetos.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
const T0 = f7.inicio, Tpue = f7.t("ahora"), Tpw = f7.t("mando"), Ttel = f7.t("tele");
const Tapp = f8.t("app"), Tvol = f8.t("volumen"), Tcan = f8.t("canales"), Tfle = f8.t("flechas");
const Tbus = f9.t("buscar"), Tent = f9.t("entre"), Tcoj = f9.t("cojines");
const FIN = v.frase(10).inicio;

const cam = camino2D([
  [T0, [0.78, 0, -330]], [Tpue - 0.2, [0.78, 0, -330]], [Tpue + 1.1, [0.85, 0, -230]], [FIN, [0.85, 0, -230]],
]);

// ---------------------------------------------------------------- los toques del pulgar
const OBJ = { vol: [-88, 124], ch: [96, 124], der: [78, -96], aba: [0, -18], pw: [-108, -190] };
const TOQUES = [
  { t: Tpw, k: "pw", d: 0.3 }, { t: Ttel + 0.3, k: "vol", d: 0.5 }, { t: Tvol + 0.05, k: "vol", d: 0.4 },
  { t: Tcan + 0.08, k: "ch", d: 0.2 }, { t: Tcan + 0.4, k: "ch", d: 0.2 },
  { t: Tfle + 0.02, k: "der", d: 0.16 }, { t: Tfle + 0.26, k: "der", d: 0.16 }, { t: Tfle + 0.5, k: "aba", d: 0.16 },
];
const prensa = (q, t) => su(tr(t, q.t - 0.1, q.t)) * (1 - su(tr(t, q.t + q.d, q.t + q.d + 0.14)));
function pulgar(t) {
  let ult = null; for (const q of TOQUES) if (t >= q.t - 0.25) ult = q;
  if (!ult) return [0, OBJ.vol];
  return [Math.max(...TOQUES.filter((q) => q.k === ult.k).map((q) => prensa(q, t))), OBJ[ult.k]];
}
const sumaK = (t, kk) => Math.max(0, ...TOQUES.filter((q) => q.k === kk).map((q) => prensa(q, t)));

// ---------------------------------------------------------------- lo que hace la tele
const CAMBIOS = TOQUES.filter((q) => q.k === "ch").map((q) => q.t + 0.06);
const CANALES = [0, 3, 1];
const wake = (t) => su(tr(t, Tpw + 0.12, Tpw + 0.5));
const canalDe = (t) => CANALES[CAMBIOS.filter((s) => t >= s).length];
const nieveDe = (t) => Math.max(0, ...CAMBIOS.map((s) => tr(t, s - 0.06, s) * (1 - tr(t, s + 0.12, s + 0.26))));
const volDe = (t) => mez(0.4, 0.68, su(tr(t, Ttel + 0.4, Ttel + 1.3))) + 0.3 * su(tr(t, Tvol + 0.1, Tvol + 0.9));
const volAlDe = (t) => Math.max(su(tr(t, Ttel + 0.35, Ttel + 0.6)) * (1 - su(tr(t, Ttel + 1.8, Ttel + 2.1))), su(tr(t, Tvol + 0.05, Tvol + 0.3)) * (1 - su(tr(t, Tvol + 1.2, Tvol + 1.5))));

// el menú de apps que sale con las flechas
const TILES = [["#ff5a5a", 0], ["#4a9aff", 1], ["#5aff8a", 2], ["#ffd24a", 3], ["#c86aff", 4], ["#ff9a3a", 5]];
const CURSOR = [[0, 0], [1, 0], [2, 0], [2, 1]];
function menu(g, t) {
  const al = su(tr(t, Tfle - 0.05, Tfle + 0.25)) * (1 - su(tr(t, Tfle + 1.0, Tfle + 1.3)));
  if (al <= 0.01) return;
  const [cx, cy, w, h] = [0, TELE.cy, TELE.w, TELE.h];
  g.save(); g.globalAlpha = al; redondo(g, cx - w / 2, cy - h / 2, w, h, 8); g.clip();
  g.fillStyle = "rgba(8,12,34,0.82)"; g.fillRect(cx - w / 2, cy - h / 2, w, h);
  const paso = Math.floor(Math.max(0, t - Tfle - 0.1) / 0.24), ci = Math.min(paso, 3), [cc, cf] = CURSOR[ci];
  const prev = CURSOR[Math.max(0, ci - 1)], u = su(tr(t, Tfle + 0.1 + 0.24 * (ci - 1) + 0.04, Tfle + 0.1 + 0.24 * (ci - 1) + 0.2));
  const px = ci === 0 ? cc : mez(prev[0], cc, u), py = ci === 0 ? cf : mez(prev[1], cf, u);
  for (let i = 0; i < 6; i++) {
    const c = i % 3, r = Math.floor(i / 3), x = cx - 320 + c * 320, y = cy - 120 + r * 240;
    g.save(); g.translate(x, y); redondo(g, -130, -95, 260, 190, 36); g.fillStyle = TILES[i][0]; g.fill();
    g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(0, 0, 38, 0, 6.2832); g.fill(); g.fillStyle = TILES[i][0]; g.beginPath(); g.moveTo(-12, -20); g.lineTo(24, 0); g.lineTo(-12, 20); g.closePath(); g.fill();
    g.restore();
  }
  const kx = cx - 320 + px * 320, ky = cy - 120 + py * 240;
  g.strokeStyle = "#fff"; g.lineWidth = 12; redondo(g, kx - 146, ky - 110, 292, 220, 44); g.stroke();
  k.brillo(g, kx, ky, 380, "255,255,255", 0.3);
  g.restore();
}

// ---------------------------------------------------------------- el mando de siempre y los cojines
const REM = [-430, 300];
const cae = (t) => su(tr(t, Tent + 0.2, Tcoj + 0.4));
function cojin(g, w, h, r, c0, c1, c2) {
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 36; g.shadowOffsetY = 18;
  redondo(g, -w / 2, -h / 2, w, h, r); const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, c0); gr.addColorStop(0.55, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  g.save(); redondo(g, -w / 2, -h / 2, w, h, r); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28; g.drawImage(tejido, -w / 2, -h / 2, w, h); g.restore();
  redondo(g, -w / 2 + 2, -h / 2 + 2, w - 4, h - 4, r); g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 4; g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  salonHoy(g, t, "255,60,180");
  const osc = 0.7 * (1 - wake(t));
  g.fillStyle = `rgba(2,0,8,${osc})`; g.fillRect(-1400, -1900, 2800, 3800);
  teleHoy(g, t, { canalN: canalDe(t), nv: nieveDe(t), enc: wake(t), ojo: 0, vol: volDe(t), volAl: volAlDe(t) });
  menu(g, t);
  // el móvil, en la mano
  if (t > Tpue - 0.2) {
    const entra = 1 - su(tr(t, Tpue, Tpue + 0.9)), [pul, obj] = pulgar(t);
    const flota = 14 * Math.sin((t - Tapp) * 3.2) * su(tr(t, Tapp, Tapp + 0.4)) * (1 - su(tr(t, Tbus, Tbus + 0.4)));
    g.save(); g.translate(0, 330 + 1200 * entra + flota); g.scale(1.25, 1.25);
    manoMovilDetras(g);
    const fl = ["der", "aba"].map((kk) => sumaK(t, kk));
    movilApp(g, t, { pulsa: sumaK(t, "vol"), luz: Math.max(pul, k.pulso(t, Tapp, 0.4)), pulsaCh: sumaK(t, "ch"), flecha: fl[0] > fl[1] ? [0, fl[0]] : [1, fl[1]] });
    { const pq = sumaK(t, "pw"); if (pq > 0.02) { k.brillo(g, -108, -262, 300, "255,120,100", 0.9 * pq); g.save(); g.strokeStyle = `rgba(255,150,130,${pq})`; g.lineWidth = 8; g.beginPath(); g.arc(-108, -262, 30 + 40 * (1 - pq), 0, 6.2832); g.stroke(); g.restore(); } }
    manoMovilDelante(g, pul, obj);
    g.restore();
    // las ondas que salen del móvil hacia la tele con cada toque
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (const q of TOQUES) for (let n = 0; n < 2; n++) {
      const d = t - (q.t + 0.05 + n * 0.22); if (d < 0 || d > 1.2) continue;
      const r = 90 + d * 720, al = Math.exp(-d * 1.6) * 0.9;
      g.strokeStyle = `rgba(120,190,255,${al})`; g.lineWidth = 14; g.beginPath(); g.arc(0, -120, r, -Math.PI / 2 - 0.75, -Math.PI / 2 + 0.75); g.stroke();
      g.strokeStyle = `rgba(120,190,255,${al * 0.25})`; g.lineWidth = 44; g.beginPath(); g.arc(0, -120, r, -Math.PI / 2 - 0.75, -Math.PI / 2 + 0.75); g.stroke();
    }
    g.restore();
  }
  // el mando de siempre: entra al lado del móvil y se pierde entre los cojines
  const ent = su(tr(t, Tbus, Tbus + 0.5));
  if (ent > 0.001) {
    const c = cae(t), tiembla = Math.sin(t * 40) * 6 * k.pulso(t, Tcoj + 0.1, 0.2);
    g.save(); g.translate(REM[0] - 400 * (1 - ent) + tiembla, REM[1] + 700 * (1 - ent) + 300 * c); g.rotate(-0.12 + 0.09 * c); g.scale(0.55, 0.55); g.translate(0, -282);
    mandoHoy(g, t, { led: 0 }); g.restore();
    const up = su(tr(t, Tent, Tent + 0.45)), bote = 1 + 0.08 * k.pulso(t, Tcoj + 0.25, 0.2);
    if (up > 0.001) {
      g.save(); g.translate(REM[0] - 40, 660 + 500 * (1 - up)); g.rotate(-0.06); g.scale(bote, 2 - bote); cojin(g, 330, 280, 80, "#ffd070", "#e0a53a", "#8a5a14"); g.restore();
      g.save(); g.translate(REM[0] + 100, 740 + 500 * (1 - up)); g.rotate(0.08); g.scale(bote, 2 - bote); cojin(g, 300, 260, 80, "#ff9a7a", "#e0583a", "#7a2410"); g.restore();
      const q = su(tr(t, Tcoj + 0.3, Tcoj + 0.55));
      if (q > 0.01) { g.save(); g.translate(REM[0] - 10, 400 - 20 * q); g.globalAlpha = q; g.font = "800 150px Figtree"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.fillText("?", 0, 0); g.restore(); }
    }
  }
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { ahora: Tpue, mando: Tpw, volumen: Tvol, canales: Tcan, flechas: Tfle, buscar: Tbus, cojines: Tcoj };
