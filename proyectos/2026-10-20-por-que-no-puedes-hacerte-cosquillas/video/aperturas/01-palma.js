// La otra apertura del hook (en lugar de planos/01-pie.js).
// «¿Por qué no puedes hacerte cosquillas a ti mismo? Si te las hace otro, te mueres de risa. Si te las haces tú, nada.»
// - Fotograma 0: la cámara cae en picado sobre la palma de una mano abierta mientras los dedos de la sudadera roja se
//   lanzan a hacerle cosquillas: la mano se encoge y saltan chispas.
// - «a ti mismo»: la roja se va y bajan tus dedos (pijama) a hacer lo mismo: ni una chispa.
// - «otro»: vuelve la roja, «mueres de risa»: la mano se retuerce y revientan las chispas. «tú»: los tuyos, «nada».
import * as k from "#kit";
import { v } from "#voz";
import { fondoSalon, vista, sinVista, palma, manoDedos, chispas, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tti = f1.t("ti"), Tmis = f1.t("mismo"), Totro = f2.t("otro"), Tmue = f2.t("mueres"), Trisa = f2.t("risa"), Tsi2 = f2.t("si", 2), Ttu = f2.t("tu"), Tnada = f2.t("nada");

const PALMA = [0, 380];                 // la muñeca, en el mundo
const BLANCO = [-10, 170];              // donde hacen cosquillas
// cada mano: tramos en los que está [entra0, entra1, sale0, sale1]
const ROJA = [[-1, -0.5, Tti - 0.25, Tti + 0.15], [Totro - 0.45, Totro - 0.05, Tsi2 - 0.2, Tsi2 + 0.2]];
const TUYA = [[Tti - 0.1, Tmis, Totro - 0.5, Totro - 0.1], [Tsi2 - 0.05, Ttu - 0.05, 99, 100]];
const esta = (tramos, t) => { let p = 0; for (const [a, b, c, d] of tramos) p = Math.max(p, su(tr(t, a, b)) * (1 - su(tr(t, c, d)))); return p; };
const QUIETA = Tnada + 0.5;            // tus dedos dejan de moverse antes del corte
const pose = (lado, tramos, t) => {
  const p = esta(tramos, t), f = 2 * Math.PI * 3 * t, m = p * (lado > 0 ? 1 : 1 - su(tr(t, QUIETA - 0.3, QUIETA)));
  return { x: BLANCO[0] + lado * 30 + m * 80 * Math.sin(f) + (1 - p) * lado * 900, y: BLANCO[1] + m * 40 * Math.sin(f * 2) - (1 - p) * 1100, p, m };
};
const roja = (t) => pose(1, ROJA, t), tuya = (t) => pose(-1, TUYA, t);
const cosquillas = (ts) => roja(ts).p * (0.7 + 0.3 * su(tr(ts, Tmue, Trisa)));

export function dibuja(g, t) {
  const dive = entra(tr(t, 0, 0.75));
  const Z = Math.exp(mez(Math.log(0.72), Math.log(1.0), dive)), cy = mez(-120, 60, dive);
  fondoSalon(g, t, 0, -cy);
  vista(g, Z, 0, cy, mez(-0.35, 0, dive));
  const q = Math.max(cosquillas(t), cosquillas(t - 0.12));
  const rt = cosquillas(t) * su(tr(t, Tmue - 0.2, Trisa)) * Math.sin(t * 14);
  g.save(); g.translate(PALMA[0], PALMA[1]); g.rotate(rt * 0.06); palma(g, t, { encoge: q * 0.85, agita: q }); g.restore();
  for (const [o, tipo] of [[tuya(t), "pijama"], [roja(t), "roja"]]) {
    if (o.p <= 0.001) continue;
    g.save(); g.translate(o.x, o.y); if (tipo === "pijama") g.scale(-1, 1); g.rotate(0.65); g.scale(0.8, 0.8); manoDedos(g, t, tipo, o.m); g.restore();
  }
  chispas(g, t, (ts) => { const o = roja(ts); return [o.x, o.y + 10]; }, cosquillas, { escala: 1.4, sem: 5 });
  sinVista(g);
  const frio = su(tr(t, Tnada - 0.2, Tnada + 0.3));
  if (frio > 0) { g.fillStyle = `rgba(20,30,60,${0.22 * frio})`; g.fillRect(0, 0, 1080, 1920); }
  vineta(g, 0.5);
  velo(g, 0.5);
}
