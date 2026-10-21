// «Así que el mando no solo cambia de canal: también es el motivo por el que tu tele no se apaga del todo. Y a día de hoy
// también puedes usar la tele con tu móvil. Con una app, tu móvil se convierte en un mando: tiene el volumen, los canales
// y las flechas, igual que el de siempre. Y ya no tienes que cambiar las pilas ni buscarlo entre los cojines, porque el
// móvil siempre lo llevas encima. Si quieres probarlo, el link de la app está en la bio.»
// Vuelve el salón de neón, con un corte en «Así». Una sola cámara.
// - «el mando… cambia de canal»: el mando cambia dos veces de canal; la tele responde con nieve.
// - «no se apaga del todo»: el mando apaga la tele; el salón se queda a oscuras y solo respira el puntito rojo.
// - «puedes usar la tele con tu móvil»: entra el móvil, en la mano; el pulgar aprieta el botón rojo y la tele despierta.
// - «con tu móvil… volumen, canales y flechas»: el pulgar aprieta cada cosa y la tele responde.
// - «igual que el de siempre»: entra el mando viejo, se queda sin pilas y se lo tragan los cojines.
// - «el link de la app está en la bio»: «link en la bio», grande y quieto.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, tejido } from "../mundo.js";
import { salonHoy, teleHoy, mandoHoy, manoDetras, manoDelante, movilApp, manoMovilDetras, manoMovilDelante, TELE } from "../objetosHoy.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12), f13 = v.frase(13), f14 = v.frase(14);
const T0 = f10.inicio, Tcam = f10.t("cambia"), Tcnl = f10.t("canal"), Tapg = f10.t("apaga");
const Tpue = f11.inicio + 0.45, Tpw = f11.t("tele"), Tmov = f11.t("movil");
const Tapp = f12.t("app"), Tvol = f12.t("volumen"), Tcan = f12.t("canales"), Tfle = f12.t("flechas"), Tigu = f12.t("igual"), Tsie = f12.t("siempre");
const Tpil = f13.t("pilas"), Tbus = f13.t("buscarlo"), Tcoj = f13.t("cojines"), Tmo2 = f13.t("movil"), Tsi2 = f13.t("siempre"), Tenc = f13.t("encima");
const Tlink = f14.t("link"), Tbio = f14.t("bio");
const FIN = v.frase(15).inicio;

const cam = camino2D([
  [T0, [0.78, 0, -330]], [Tapg + 0.4, [0.78, 0, -330]], [Tpue + 1.1, [0.85, 0, -230]], [Tmo2 - 0.5, [0.85, 0, -230]],
  [f14.inicio, [1.0, 20, -120]], [Tlink + 0.5, [1.0, 0, -120]], [FIN, [1.0, 0, -120]],
]);

// ---------------------------------------------------------------- los toques del pulgar
const OBJ = { vol: [-88, 124], ch: [96, 124], der: [78, -96], aba: [0, -18], pw: [-108, -190] };
const TOQUES = [
  { t: Tpw, k: "pw", d: 0.3 }, { t: Tmov + 0.1, k: "vol", d: 0.5 }, { t: Tvol + 0.05, k: "vol", d: 0.4 },
  { t: Tcan + 0.08, k: "ch", d: 0.2 }, { t: Tcan + 0.4, k: "ch", d: 0.2 },
  { t: Tfle + 0.12, k: "der", d: 0.2 }, { t: Tfle + 0.45, k: "der", d: 0.2 }, { t: Tfle + 0.78, k: "aba", d: 0.2 },
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
const CANALES = [0, 3, 1];                           // neón, atardecer, mar
// el mando de antes: dos cambios de canal y, al final, apaga la tele
const PR = [Tcam + 0.05, Tcnl + 0.19, Tapg - 0.02], CR = [PR[0] + 0.06, PR[1] + 0.06], LEDY = -60;
const burst = (t, p) => Math.max(su(tr(t, p, p + 0.06)) * (1 - su(tr(t, p + 0.18, p + 0.28))), su(tr(t, p + 0.3, p + 0.36)) * (1 - su(tr(t, p + 0.42, p + 0.5))));
const rayoIr = (t) => Math.max(...PR.map((p) => burst(t, p)));
const nieveR = (t) => Math.max(0, ...CR.map((s) => tr(t, s - 0.06, s) * (1 - tr(t, s + 0.12, s + 0.26))));
const canalR = (t) => (t < CR[0] ? 0 : t < CR[1] ? 3 : 1);
const wake = (t) => su(tr(t, Tpw + 0.12, Tpw + 0.5));
const encT = (t) => (t < Tpw ? 1 - tr(t, PR[2] + 0.02, PR[2] + 0.38) ** 1.6 : wake(t));
const canalDe = (t) => CANALES[CAMBIOS.filter((s) => t >= s).length];
const nieveDe = (t) => Math.max(0, ...CAMBIOS.map((s) => tr(t, s - 0.06, s) * (1 - tr(t, s + 0.12, s + 0.26))));
const volDe = (t) => mez(0.4, 0.68, su(tr(t, Tmov + 0.2, Tmov + 1.1))) + 0.3 * su(tr(t, Tvol + 0.1, Tvol + 0.9));
const volAlDe = (t) => Math.max(su(tr(t, Tmov + 0.15, Tmov + 0.4)) * (1 - su(tr(t, Tmov + 1.6, Tmov + 1.9))), su(tr(t, Tvol + 0.05, Tvol + 0.3)) * (1 - su(tr(t, Tvol + 1.2, Tvol + 1.5))));

// el menú de apps que sale con las flechas
const TILES = [["#ff5a5a", 0], ["#4a9aff", 1], ["#5aff8a", 2], ["#ffd24a", 3], ["#c86aff", 4], ["#ff9a3a", 5]];
const CURSOR = [[0, 0], [1, 0], [2, 0], [2, 1]];                         // columna, fila
function menu(g, t) {
  const al = su(tr(t, Tfle - 0.05, Tfle + 0.25)) * (1 - su(tr(t, Tfle + 1.45, Tfle + 1.8)));
  if (al <= 0.01) return;
  const [cx, cy, w, h] = [0, TELE.cy, TELE.w, TELE.h];
  g.save(); g.globalAlpha = al; redondo(g, cx - w / 2, cy - h / 2, w, h, 8); g.clip();
  g.fillStyle = "rgba(8,12,34,0.82)"; g.fillRect(cx - w / 2, cy - h / 2, w, h);
  const paso = Math.floor(Math.max(0, t - Tfle - 0.18) / 0.33), ci = Math.min(paso, 3), [cc, cf] = CURSOR[ci];
  const prev = CURSOR[Math.max(0, ci - 1)], u = su(tr(t, Tfle + 0.12 + 0.33 * (ci - 1) + 0.06, Tfle + 0.12 + 0.33 * (ci - 1) + 0.26));
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

// ---------------------------------------------------------------- el mando viejo, la pila y los cojines
const REM = [-420, 250];
const cae = (t) => su(tr(t, Tbus + 0.1, Tcoj + 0.45));
function cojin(g, w, h, r, c0, c1, c2) {
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 36; g.shadowOffsetY = 18;
  redondo(g, -w / 2, -h / 2, w, h, r); const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, c0); gr.addColorStop(0.55, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  g.save(); redondo(g, -w / 2, -h / 2, w, h, r); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28; g.drawImage(tejido, -w / 2, -h / 2, w, h); g.restore();
  redondo(g, -w / 2 + 2, -h / 2 + 2, w - 4, h - 4, r); g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 4; g.stroke();
  g.restore();
}
function pila(g, t, al) {
  if (al <= 0.01) return;
  g.save(); g.translate(REM[0] + 10, REM[1] - 150); const e = 1 + 0.25 * k.pulso(t, Tpil, 0.2); g.scale(e, e); g.globalAlpha = al;
  redondo(g, -80, -40, 150, 80, 16); g.fillStyle = "rgba(10,14,36,0.85)"; g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 8; g.stroke();
  redondo(g, 70, -16, 18, 32, 5); g.fillStyle = "#fff"; g.fill();
  redondo(g, -70, -30, 20, 60, 6); g.fillStyle = "#ff4a3a"; g.fill();
  g.font = "800 40px Figtree"; g.fillStyle = "#ff6a5a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("0%", 2, 2);
  g.restore();
}

const pantalla = (wx, wy, Z, cx, cy) => [540 + (wx - cx) * Z, 960 + (wy - cy) * Z];

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  salonHoy(g, t, "255,60,180");
  const osc = 0.78 * su(tr(t, PR[2] + 0.05, PR[2] + 0.6)) * (1 - wake(t));
  g.fillStyle = `rgba(2,0,8,${osc})`; g.fillRect(-1400, -1900, 2800, 3800);
  const antes = t < Tpw;
  const resp = 0.45 + 0.35 * Math.sin(t * 2.6);
  teleHoy(g, t, { canalN: antes ? canalR(t) : canalDe(t), nv: antes ? nieveR(t) : nieveDe(t), enc: encT(t), ojo: t < PR[2] ? 0 : Math.min(1, resp + 0.2 * su(tr(t, PR[2], PR[2] + 0.4))) * (1 - wake(t)), vol: volDe(t), volAl: volAlDe(t) });
  menu(g, t);
  // el mando de antes: entra por abajo, cambia de canal, apaga la tele y se va
  const offR = 700 * (1 - su(tr(t, T0 + 0.05, T0 + 0.7))) + 900 * su(tr(t, Tapg + 0.6, Tapg + 1.2));
  if (t < Tapg + 1.3) {
    const pr = Math.max(...PR.map((p) => su(tr(t, p - 0.1, p)) * (1 - su(tr(t, p + 0.2, p + 0.32)))));
    g.save(); g.translate(0, LEDY + offR); g.translate(0, -282); mandoHoy(g, t, { led: rayoIr(t) }); if (pr > 0.01) k.brillo(g, -72, 400, 260, "255,255,255", 0.8 * pr); g.restore();
    const ri = rayoIr(t);
    if (ri > 0.01) {
      const [SX, SY] = TELE.ojo; g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
      for (const [col, w2, a2] of [[`rgba(255,70,105,${0.25 * ri})`, 60, 1], [`rgba(255,70,105,${0.95 * ri})`, 20, 1], [`rgba(255,235,240,${0.9 * ri})`, 7, 1]]) { g.strokeStyle = col; g.lineWidth = w2; g.beginPath(); g.moveTo(0, LEDY); g.lineTo(SX, SY + 30); g.stroke(); }
      g.restore();
    }
  }
  // el móvil, en la misma mano
  if (t > Tpue - 0.2) {
    const entra = 1 - su(tr(t, Tpue, Tpue + 0.9)), [pul, obj] = pulgar(t);
    const flota = 16 * Math.sin((t - Tmo2) * 3.2) * su(tr(t, Tmo2 - 0.1, Tmo2 + 0.4)) * (1 - su(tr(t, f14.inicio, f14.inicio + 0.4)));
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
    // los aros verdes que late el móvil, siempre contigo
    g.save(); g.globalCompositeOperation = "lighter";
    for (let n = 0; n < 6; n++) { const d = (t - (Tmo2 + n * 0.55)); if (d < 0 || d > 1.2 || t > f14.inicio) continue; const r = 260 + d * 420, al = Math.exp(-d * 2.2) * 0.8; g.strokeStyle = `rgba(90,255,150,${al})`; g.lineWidth = 12; g.beginPath(); g.ellipse(0, 330, r * 0.62, r, 0, 0, 6.2832); g.stroke(); }
    g.restore();
    // el ✓ verde: el móvil siempre está contigo
    const ok = su(tr(t, Tsi2, Tsi2 + 0.25)) * (1 - su(tr(t, f13.fin - 0.1, f13.fin + 0.2)));
    if (ok > 0.01) {
      g.save(); g.translate(150, 130); const e = 0.6 + 0.4 * su(tr(t, Tsi2, Tsi2 + 0.3)); g.scale(e, e); g.globalAlpha = ok;
      k.brillo(g, 0, 0, 200, "90,255,140", 0.8);
      g.beginPath(); g.arc(0, 0, 62, 0, 6.2832); g.fillStyle = "#2ed36a"; g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 9; g.stroke();
      g.strokeStyle = "#fff"; g.lineWidth = 16; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(-26, 4); g.lineTo(-6, 26); g.lineTo(30, -20); g.stroke();
      g.restore();
    }
  }
  // el mando viejo: entra al lado del móvil, enseña la pila vacía y se pierde entre los cojines
  const ent = su(tr(t, Tigu, Tigu + 0.6));
  const vuelta = su(tr(t, f14.inicio - 0.3, f14.inicio + 0.2));
  if (ent > 0.001 && vuelta < 0.999) {
    const c = cae(t), tiembla = Math.sin(t * 40) * 6 * k.pulso(t, Tpil + 0.1, 0.25);
    g.save(); g.translate(REM[0] - 500 * (1 - ent) + tiembla, REM[1] + 760 * (1 - ent) + 330 * c + 700 * vuelta); g.rotate(-0.12 + 0.09 * c); g.scale(0.55, 0.55); g.translate(0, -282);
    mandoHoy(g, t, { led: 0 }); g.restore();
    pila(g, t, su(tr(t, Tpil, Tpil + 0.2)) * (1 - su(tr(t, Tbus - 0.1, Tbus + 0.2))));
    // los cojines suben desde abajo y se lo tragan
    const up = su(tr(t, Tbus + 0.05, Tbus + 0.5)) * (1 - vuelta), bote = 1 + 0.08 * k.pulso(t, Tcoj + 0.2, 0.2);
    if (up > 0.001) {
      g.save(); g.translate(REM[0] - 70, 690 + 500 * (1 - up) + 500 * vuelta); g.rotate(-0.06); g.scale(bote, 2 - bote); cojin(g, 320, 270, 80, "#ffd070", "#e0a53a", "#8a5a14"); g.restore();
      g.save(); g.translate(REM[0] + 70, 770 + 500 * (1 - up) + 500 * vuelta); g.rotate(0.08); g.scale(bote, 2 - bote); cojin(g, 290, 250, 80, "#ff9a7a", "#e0583a", "#7a2410"); g.restore();
      const q = su(tr(t, Tcoj + 0.15, Tcoj + 0.4)) * (1 - vuelta);
      if (q > 0.01) { g.save(); g.translate(REM[0] - 20, 440 - 20 * q); g.globalAlpha = q; g.font = "800 150px Figtree"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.fillText("?", 0, 0); g.restore(); }
    }
  }
  sinVista(g);
  const lk = su(tr(t, Tlink - 0.1, Tlink + 0.2));
  if (lk > 0.01) {
    k.pastilla(g, 540, 1280, "link en la bio", "", "255,226,160", lk, 84);
    const [px, py] = pantalla(0, 330, Z, cx, cy);
    k.fogonazo(g, px, py - 160, t - (Tlink - 0.05), 380 * Z, "170,210,255");
  }
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { puedes: Tpue, movil: Tmov, volumen: Tvol, canales: Tcan, flechas: Tfle, pilas: Tpil, link: Tlink };
