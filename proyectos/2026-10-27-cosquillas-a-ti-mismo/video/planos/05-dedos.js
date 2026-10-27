// «Por eso los empujones se van de las manos.» «Unas parejas tenían que devolverse un apretón en el dedo, con la
// misma fuerza.» «Pero el suyo lo sentían flojo, y apretaban un 38 % más en cada turno.»
// - Dos dedos índice, el tuyo (azul) desde la izquierda y el del otro (rojo) desde la derecha, sobre un botón de
//   metal. «empujones»: se empujan por turnos, cada vez más fuerte, con un fogonazo en cada golpe.
// - «parejas»: bajan dos tubos, azul y rojo. «apretón»: aprieta el rojo y su tubo sube; «misma»: aprieta el azul y su
//   tubo llega a la misma raya.
// - «apretaban»: cada turno, uno aprieta más que el otro y su tubo pasa al del otro, con «+38 %»; en «turno», el rojo
//   rebosa. Todo se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, ORO, ROJO, dedo, fondoMorado, tubo, velo, vineta } from "../mundo.js";

export const desde = (v) => v.frase(7).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
const Tfin = v.frase(10).inicio;
// [segundo, quién (0 tú, 1 el otro), fuerza (1 = el tubo lleno), sube el tubo]
const TURNOS = [
  [f7.t("empujones"), 1, 0.35, false], [f7.t("van"), 0, 0.5, false], [f7.t("manos"), 1, 0.7, false],
  [f8.t("apreton"), 1, 0.25, true], [f8.t("misma"), 0, 0.25, true],
  [f9.t("suyo"), 1, 0.1, false], [f9.t("flojo"), 0, 0.1, false],
  [f9.t("apretaban"), 1, 0.345, true], [f9.t("38"), 0, 0.476, true], [f9.t("38") + 0.58, 1, 0.657, true],
  [f9.t("mas"), 0, 0.907, true], [f9.t("turno"), 1, 1.25, true],
];
export const golpes = TURNOS.map((x) => x[0]);
const Ttub = f8.t("parejas"), Tmis = f8.t("misma"), T38 = f9.t("apretaban");

// Cuánto empuja ahora el dedo de quien, y lo que ha subido su tubo.
function estado(t, quien) {
  let emp = 0, nivel = 0, recibe = 0;
  for (const [t0, q, f] of TURNOS) {
    const d = t - t0;
    const golpe = d < -0.12 ? 0 : d < 0 ? entra(tr(d, -0.12, 0)) : Math.exp(-d * 5);
    if (q === quien) emp += golpe * (0.35 + f * 0.65);
    else recibe += golpe * (0.35 + f * 0.65);
  }
  for (const [t0, q, f, sube] of TURNOS) if (q === quien && sube) nivel = Math.max(nivel, f * su(tr(t, t0 - 0.1, t0 + 0.25)));
  return { emp, nivel, recibe };
}

export function dibuja(g, t) {
  fondoMorado(g, t);
  const a = estado(t, 0), b = estado(t, 1);
  const cx = 540, cy = 1290;
  const z = mez(1.75, 1, su(tr(t, Ttub - 0.4, Ttub + 0.7)));
  g.save(); g.translate(cx, mez(1050, cy, su(tr(t, Ttub - 0.4, Ttub + 0.7)))); g.scale(z, z); g.translate(-cx, -cy);
  // los tubos
  const tubos = entra(tr(t, Ttub - 0.1, Ttub + 0.6));
  const y0 = mez(-500, 600, tubos), y1 = y0 + 470;
  tubo(g, 300, y0, y1, a.nivel, "70,150,255", t, tubos);
  tubo(g, 780, y0, y1, b.nivel, "255,70,80", t, tubos);
  // la raya de «la misma fuerza»
  const raya = su(tr(t, Tmis - 0.1, Tmis + 0.3)) * (1 - su(tr(t, T38 - 0.3, T38)));
  if (raya > 0.01) {
    const yy = y1 - 470 * 0.25;
    g.save(); g.globalAlpha = raya; g.setLineDash([20, 14]); g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(210, yy); g.lineTo(870, yy); g.stroke(); g.restore();
  }
  // el rojo rebosa en el último turno
  const Tult = TURNOS[TURNOS.length - 1][0], reb = tr(t, Tult + 0.1, Tult + 0.9);
  if (reb > 0 && reb < 1) {
    g.save();
    for (let i = 0; i < 9; i++) {
      const u = Math.max(0, reb * 1.3 - i * 0.04), lado = i % 2 ? 1 : -1;
      const x = 780 + lado * (78 + u * 40), y = y0 - 10 + 600 * u * u;
      g.fillStyle = `rgba(255,80,90,${0.9 * (1 - reb)})`; g.beginPath(); g.ellipse(x, y, 14, 20, 0, 0, 6.2832); g.fill();
    }
    g.restore();
    k.brillo(g, 780, y0, 420, "255,90,90", 0.6 * Math.sin(Math.PI * reb));
  }
  // «+38 %»
  const p38 = su(tr(t, T38 - 0.1, T38 + 0.2)) * (1 - su(tr(t, Tfin - 0.6, Tfin - 0.25)));
  if (p38 > 0.01) {
    const latido = TURNOS.filter((x) => x[0] >= T38 - 0.01).reduce((s, x) => s + k.pulso(t, x[0] + 0.05, 0.12), 0);
    g.save(); g.translate(540, 870); g.scale(1 + 0.1 * latido, 1 + 0.1 * latido); k.pastilla(g, 0, 0, "+38", "%", ORO, p38, 100); g.restore();
  }
  // el botón de metal y los dos dedos
  const sep = 44;
  const ax = cx - sep + 16 * a.emp - 34 * a.recibe, bx = cx + sep - 16 * b.emp + 34 * b.recibe;
  g.save();
  g.beginPath(); g.ellipse(cx + (ax + bx - 2 * cx) * 0.5, cy, 30, 95, 0, 0, 6.2832);
  k.metal(g, cx - 30, cx + 30, ["#5c626a", "#e8ecf1", "#9aa2ad", "#f4f6f9", "#4c525a"]);
  g.restore();
  dedo(g, ax - 6, cy, 0, 0.85, AZUL, { aprieta: Math.min(1, a.emp + a.nivel * 0.6) });
  dedo(g, bx + 6, cy, Math.PI, 0.85, ROJO, { aprieta: Math.min(1, b.emp + b.nivel * 0.6) });
  // el fogonazo de cada golpe
  for (const [t0, q, f] of TURNOS) {
    const d = t - t0;
    if (d > -0.02 && d < 0.5) { const x = q ? cx - 40 : cx + 40; k.brillo(g, x, cy, 260 + 380 * f, ORO, (0.5 + 0.5 * f) * Math.exp(-d * 7)); }
  }
  g.restore();
  vineta(g); velo(g, 0.45);
}
