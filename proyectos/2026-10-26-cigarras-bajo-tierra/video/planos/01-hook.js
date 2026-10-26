// «¿Por qué las cigarras pueden pasar tantos años bajo tierra?» · «La que oyes cantar en verano puede llevar seis años
// ahí abajo, y otras aguantan diecisiete.» · «La culpa es de lo que comen: chupan la savia de las raíces, que es casi
// agua.»
// Un solo sitio, el árbol y su suelo en corte, con una cámara:
// - Fotograma 0: pegados a una cigarra enorme que canta en el tronco al sol; la cámara ya baja. Acelera tronco abajo,
//   revienta el suelo en «bajo» (salta la tierra) y frena en «tierra» delante de la ninfa, agarrada a su raíz.
// - «La que oyes cantar»: se aleja hasta ver la cigarra arriba y su ninfa abajo; «seis años»: la cifra corre hasta 6.
// - «y otras»: baja a otra ninfa, más honda y de ojos rojos; «diecisiete»: corre hasta 17.
// - «La culpa es de lo que comen»: entra a la boca de esa ninfa; «chupan»: clava el pico en la raíz; «savia»: la raíz
//   se vuelve transparente y la savia, azul clara, corre hacia ella; «agua»: una gota cuelga y brilla.
import * as k from "#kit";
import { v } from "#voz";
import { LA, LB, NINFA_A, NINFA_B, RAICES, cigarra, canto, mundoArbol, ninfa, sinVista, terrones, velo, vista } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tbajo = f1.t("bajo"), Ttierra = f1.t("tierra");
const Tque = f2.t("que"), Tseis = f2.t("seis"), Tabajo = f2.t("abajo"), Totras = f2.t("otras"), Tdiec = f2.t("diecisiete");
const Tculpa = f3.t("culpa"), Tchup = f3.t("chupan"), Tsav = f3.t("savia"), Tcasi = f3.t("casi"), Tagua = f3.t("agua");
export const suelo = Tbajo + 0.02;
export const pinchazo = Tchup + 0.18;

const CIG = [44, -1150], LC = 320;
const [ax, ay] = NINFA_A, [bx, by] = NINFA_B;
const Zs = (pares) => pares.map(([t, Z, x, y]) => [t, [Z, x, y]]);
// La cámara: en la primera clave (antes del vídeo) ya baja, así que el fotograma 0 se mueve.
const claves = Zs([
  [-0.5, 2.5, 44, -1300],
  [0.0, 2.5, 44, -1160],
  [1.05, 2.15, 42, -1030],
  [1.8, 1.2, 30, -330],
  [Tbajo, 0.95, 60, 40],
  [Ttierra + 0.45, 1.9, ax + 40, ay + 20],
  [Tque + 0.15, 1.9, ax + 40, ay + 20],
  [Tque + 1.0, 0.44, -60, -330],
  [Tseis - 0.25, 0.44, -60, -330],
  [Tseis + 0.35, 1.25, ax + 60, ay - 40],
  [Totras - 0.05, 1.25, ax + 60, ay - 40],
  [Totras + 0.75, 1.15, bx + 60, by - 40],
  [Tculpa + 0.2, 1.15, bx + 60, by - 40],
  [Tchup - 0.1, 2.6, bx + 120, by + 40],
  [Tsav + 0.6, 2.2, bx + 90, by - 10],
  [Tcasi, 2.2, bx + 90, by - 10],
  [Tagua + 0.5, 2.7, bx + 140, by + 70],
]);
const camZ = k.curva(claves.map(([t, c]) => [t, Math.log(c[0])])), camX = k.curva(claves.map(([t, c]) => [t, c[1]])), camY = k.curva(claves.map(([t, c]) => [t, c[2]]));
export const cam = (t) => [Math.exp(camZ(t)), camX(t), camY(t)];

// La savia por la raíz 2 (la de la ninfa honda): de arriba hasta el pico.
const R2 = RAICES[1];
const PICO_B = [bx + 0.46 * LB, by + 0.26 * LB];
const TRAMO = R2.puntos.slice(0, 5).concat([[-330, PICO_B[1]]]);
const largos = [0]; for (let i = 1; i < TRAMO.length; i++) largos.push(largos[i - 1] + Math.hypot(TRAMO[i][0] - TRAMO[i - 1][0], TRAMO[i][1] - TRAMO[i - 1][1]));
const LT = largos[largos.length - 1];
function enRaiz(s) {
  s = Math.max(0, Math.min(LT, s));
  let i = 1; while (i < largos.length - 1 && largos[i] < s) i++;
  const u = (s - largos[i - 1]) / (largos[i] - largos[i - 1]);
  return [mez(TRAMO[i - 1][0], TRAMO[i][0], u), mez(TRAMO[i - 1][1], TRAMO[i][1], u)];
}
const azS = k.azar(606);
const GOTITAS = Array.from({ length: 70 }, () => ({ s0: azS(), r: 4 + azS() * 7, o: (azS() - 0.5) * 18, brilla: azS() < 0.12 }));

function savia(g, t) {
  const sv = su(tr(t, Tsav - 0.1, Tsav + 0.5));
  if (sv <= 0.01) return;
  // la raíz, transparente: un tubo de luz azul
  g.save(); g.globalAlpha = sv;
  g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "rgba(110,190,255,0.2)"; g.lineWidth = 46;
  g.beginPath(); g.moveTo(TRAMO[0][0], TRAMO[0][1]); for (let i = 1; i < TRAMO.length; i++) g.lineTo(TRAMO[i][0], TRAMO[i][1]); g.stroke();
  g.strokeStyle = "rgba(170,225,255,0.28)"; g.lineWidth = 20; g.stroke();
  // lo que corre: gotitas de agua casi sin nada (alguna, brillante: lo poco que lleva)
  g.globalCompositeOperation = "lighter";
  for (const p of GOTITAS) {
    const s = ((p.s0 + (t - Tsav) * 0.55) % 1) * LT;
    const [x, y] = enRaiz(s);
    if (y > PICO_B[1] + 4) continue;
    if (p.brilla) k.brillo(g, x + p.o * 0.5, y, 70, "255,220,120", 0.9);
    else { g.fillStyle = "rgba(170,225,255,0.75)"; g.beginPath(); g.arc(x + p.o * 0.5, y, p.r, 0, 6.2832); g.fill(); }
  }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  mundoArbol(g, t, Z, cx, cy, { savia: (gg) => savia(gg, t) });
  // la cigarra que canta en el tronco
  vista(g, Z, cx, cy);
  canto(g, CIG[0], CIG[1] - 40, t, 1, 520);
  cigarra(g, CIG[0], CIG[1], LC, 0, t, { tipo: 0, canta: 1 });
  // las ninfas
  const pB = su(tr(t, Tchup - 0.05, pinchazo));
  ninfa(g, ax, ay, LA, 0, t, { tono: 0, pico: 1 });
  ninfa(g, bx, by, LB, 0, t, { tono: 1, pico: pB });
  // el pinchazo y la gota de agua que cuelga
  k.brillo(g, PICO_B[0], PICO_B[1], 260, "180,230,255", 0.9 * k.pulso(t, pinchazo, 0.12));
  const go = su(tr(t, Tcasi - 0.1, Tagua + 0.35));
  if (go > 0.01) {
    const gx = PICO_B[0] + 6, gy = PICO_B[1] + 16 + 18 * go, r = 22 * go;
    const gg = g.createRadialGradient(gx - r * 0.35, gy - r * 0.35, r * 0.1, gx, gy, r);
    gg.addColorStop(0, "rgba(255,255,255,0.95)"); gg.addColorStop(0.4, "rgba(150,215,255,0.7)"); gg.addColorStop(1, "rgba(60,140,220,0.55)");
    g.fillStyle = gg; g.beginPath(); g.moveTo(gx, gy - r * 1.9); g.quadraticCurveTo(gx + r * 1.05, gy - r * 0.2, gx, gy + r); g.quadraticCurveTo(gx - r * 1.05, gy - r * 0.2, gx, gy - r * 1.9); g.fill();
    k.brillo(g, gx - r * 0.3, gy - r * 0.3, 90, "220,245,255", 0.7 * go);
  }
  // la tierra que salta al reventar el suelo
  terrones(g, cx, 0, t - suelo, 1.2);
  terrones(g, cx + 80, 30, t - suelo - 0.03, 0.9, 3);
  sinVista(g);
  // el golpe al atravesar el suelo
  const fl = k.pulso(t, suelo + 0.02, 0.07);
  if (fl > 0.01) { g.fillStyle = `rgba(255,220,170,${0.45 * fl})`; g.fillRect(0, 0, 1080, 1920); }
  // las cifras
  const n6 = Math.round(mez(1, 6, su(tr(t, Tseis - 0.3, Tseis + 0.25))));
  const a6 = su(tr(t, Tseis - 0.3, Tseis - 0.05)) * (1 - su(tr(t, Totras - 0.05, Totras + 0.25)));
  k.pastilla(g, 540, 1300, `${n6} años`, "", "255,215,140", a6, 120);
  const n17 = Math.round(mez(1, 17, su(tr(t, Totras + 0.25, Tdiec + 0.3))));
  const a17 = su(tr(t, Totras + 0.2, Totras + 0.45)) * (1 - su(tr(t, Tculpa - 0.1, Tculpa + 0.25)));
  k.pastilla(g, 540, 1300, `${n17} años`, "", "255,110,90", a17, 120);
  velo(g, 0.45);
}

export const momentos = { suelo, pinchazo };
