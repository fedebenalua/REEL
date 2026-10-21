// «Son los gastos que no ves. Cuatro trucos para que no se te escape el dinero cada mes. Uno: cuenta tus gastos
// hormiga. Un café de un euro ochenta cada día de trabajo son unos cuarenta euros al mes.»
// Otro sitio: la mesa con tu cartera abierta. Corte en «Son».
// - De la cartera sale una fila de hormigas, cada una con una moneda a cuestas, que se va por la derecha.
// - «Cuatro trucos»: cae el tarro de cristal delante y entran en él cuatro monedas, una en cada palabra.
// - «gastos hormiga»: la cámara baja hasta una hormiga; desde «café», las hormigas llevan tazas de café.
// - «cada día de trabajo»: la cámara se aleja, pasan las hormigas con sus tazas y el contador cuenta los días hasta 22;
//   «cuarenta euros»: «40 € al mes».
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, cartera, hormiga, moneda, taza, tarro, velo, vineta, ORO, ROJO } from "../mundo.js";

export const desde = (v) => v.frase(2).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f2 = v.frase(2), f3 = v.frase(3);
const T0 = f2.inicio, Tves = f2.t("ves"), Tcua = f2.t("cuatro"), Ttru = f2.t("trucos"), Tesc = f2.t("escape"), Tdin = f2.t("dinero");
const Tuno = f3.t("uno"), Thor = f3.t("hormiga"), Tcafe = f3.t("cafe"), Tdia = f3.t("dia"), Ttra = f3.t("trabajo"), Tcuar = f3.t("cuarenta"), Tmes = f3.t("mes"), Fin = v.frase(4).inicio;

// el camino de las hormigas: de la cartera a la derecha, en curva
const camino = (s) => [120 + s, -40 + 260 * Math.sin(s / 700) + 0.00012 * s * s];
const VEL = 280, SEP = 265;
const hormigaEn = (i, t) => (t - T0 + 0.6) * VEL - i * SEP;     // cuánto ha andado la hormiga i
const llevaTaza = (i) => i >= 0 && (T0 - 0.6 + (i * SEP) / VEL) > Tcafe - 1.6;   // las que salen tarde llevan taza

const SEGUIDA = 46;                                               // la hormiga a la que baja la cámara
const posSeguida = (t) => camino(Math.max(0, hormigaEn(SEGUIDA, t)));
const cam = (t) => {
  const base = camino2D([[T0, [1.1, 150, 0]], [Tves, [0.95, 380, 120]], [Tcua, [0.85, 160, 240]], [Tdin + 0.4, [0.85, 160, 240]], [Tuno, [0.9, 260, 180]]])(t);
  const baja = su(tr(t, Tuno, Thor + 0.2)) * (1 - su(tr(t, Tdia - 0.3, Tdia + 0.4)));
  const P = posSeguida(t), cerca = [2.0, P[0] + 40, P[1] - 90];
  const lejos = [0.8, 480, 180];
  const fase3 = su(tr(t, Tdia - 0.3, Tdia + 0.4));
  const Z = Math.exp(mez(Math.log(mez(base[0], lejos[0], fase3)), Math.log(cerca[0]), baja));
  return [Z, mez(mez(base[1], lejos[1], fase3), cerca[1], baja), mez(mez(base[2], lejos[2], fase3), cerca[2], baja)];
};

const TARRO = [-140, 600];
const SALTOS = [Tcua, Ttru, Tesc, Tdin];
const mantel = (() => { const l = k.lienzo(256), c = l.getContext("2d"); c.fillStyle = "#4aa8a0"; c.fillRect(0, 0, 256, 256); c.fillStyle = "rgba(255,255,255,0.13)"; c.fillRect(0, 0, 128, 256); c.fillRect(0, 0, 256, 128); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.25; c.drawImage(k.manchas, 0, 0, 256, 256); return l; })();

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  for (let x = -1536; x < 3072; x += 256) for (let y = -1536; y < 1536; y += 256) g.drawImage(mantel, x, y, 256, 256);
  const lg = g.createRadialGradient(300, 0, 100, 300, 100, 1600); lg.addColorStop(0, "rgba(255,230,180,0.25)"); lg.addColorStop(1, "rgba(60,20,0,0.55)"); g.fillStyle = lg; g.fillRect(-1600, -1600, 4800, 3200);
  // el rastro: una línea tenue por donde van
  g.save(); g.strokeStyle = "rgba(90,50,20,0.18)"; g.lineWidth = 40; g.lineCap = "round"; g.beginPath(); for (let s = 0; s <= 3000; s += 50) { const [x, y] = camino(s); s ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore();
  cartera(g);
  // las hormigas
  for (let i = 0; i < 90; i++) {
    const s = hormigaEn(i, t); if (s < 0 || s > 3000) continue;
    const [x, y] = camino(s), [x2, y2] = camino(s + 5), ang = Math.atan2(y2 - y, x2 - x);
    const taz = llevaTaza(i);
    g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha = Math.min(1, s / 120);
    hormiga(g, 0, 0, 1.25, t * 18 + i, taz ? (c) => { c.save(); c.translate(0, 28); c.scale(0.28, 0.28); taza(c, t, {}); c.restore(); } : (c) => moneda(c, 0, -6, 34, 0.12, 1));
    g.restore();
  }
  // el tarro y las cuatro monedas que entran
  const entra = k.entra(tr(t, Tcua - 0.55, Tcua - 0.1)) * (1 - k.sale(tr(t, Tuno - 0.3, Tuno + 0.3)));
  if (entra > 0.001) {
    const yT = mez(TARRO[1] - 1400, TARRO[1], entra), lleno = SALTOS.filter((c) => t > c).length / 4 * 0.18;
    g.save(); g.translate(TARRO[0], yT); g.scale(0.9, 0.9); tarro(g, t, lleno, { brillo: SALTOS.reduce((a, c) => Math.max(a, k.pulso(t, c + 0.05, 0.12)), 0) }); g.restore();
    for (const c of SALTOS) { const u = tr(t, c - 0.4, c); if (u <= 0 || u >= 1) continue; moneda(g, mez(260, TARRO[0], u), TARRO[1] - 560 - 400 * Math.sin(Math.PI * u) + u * 260, 46, u * 2, 1); }
  }
  sinVista(g);
  // los días de trabajo, y los 40 € al mes
  const dias = su(tr(t, Tdia - 0.1, Tcuar - 0.1));
  const pd = su(tr(t, Tdia - 0.2, Tdia + 0.1)) * (1 - su(tr(t, Tcuar - 0.1, Tcuar + 0.1)));
  if (pd > 0.01) k.pastilla(g, 540, 1280, `día ${Math.max(1, Math.round(dias * 22))}`, "", "255,240,220", pd, 110);
  const p40 = su(tr(t, Tcuar - 0.1, Tcuar + 0.15)) * (1 - su(tr(t, Fin - 0.5, Fin - 0.2)));
  if (p40 > 0.01) { const s = 1 + 0.2 * k.pulso(t, Tcuar + 0.05, 0.12); g.save(); g.translate(540, 1280); g.scale(s, s); k.pastilla(g, 0, 0, "40 €", "al mes", ROJO, p40, 130); g.restore(); }
  vineta(g, 0.45);
  velo(g, 0.45, "40,20,5");
}
