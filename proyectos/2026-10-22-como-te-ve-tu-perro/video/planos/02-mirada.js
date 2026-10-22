// «Para él eres una mancha: lo que tú distingues a veinte metros, él tiene que verlo a cinco.»
// «Pero si te mueves, te ve al instante: hay perros que ven algo moverse a más de ochocientos metros.»
// Por encima del hombro de tu perro, sentado de espaldas en el campo: sus orejas y su nuca abajo, y tú allí delante.
// Lo que está más lejos que él se ve como lo ve él. Se entra con un corte en «Para».
// - «Para él»: tú, de pie a 20 m, nítido; «mancha»: te emborronas. «veinte metros»: una línea de puntos por el suelo
//   hasta ti y «20 m». «él tiene que verlo a cinco»: andas hacia él y la cifra baja hasta «5 m»: tan cerca, ya se te
//   distingue (el mismo desenfoque, en algo más grande).
// - «si te mueves»: agitas los brazos; «instante»: sus orejas se levantan de golpe y la cola se mueve.
// - «hay perros que ven algo moverse»: la cámara sube muy alto por encima de él; el campo enorme y, allá lejos, algo
//   diminuto que corre, con su círculo; «ochocientos metros»: la línea de puntos hasta allí y «800 m».
import * as k from "#kit";
import { v } from "#voz";
import { camara, campo, pon, tu } from "../campo.js";
import { perroEspalda } from "../perro.js";

export const desde = "para";

const { suave: su, tramo: tr, mez, entra } = k;
const f2 = v.frase(2), f3 = v.frase(3);
const T0 = f2.inicio, Tmancha = f2.t("mancha"), Tveinte = f2.t("veinte"), Tel = f2.t("el", 2), Tcinco = f2.t("cinco"), Fin2 = f2.fin;
const Tmueves = f3.t("mueves"), Tinst = f3.t("instante"), Thay = f3.t("hay"), Tmoverse = f3.t("moverse"), Tocho = f3.t("ochocientos"), Fin3 = f3.fin;

// tú: a 20 m, y andas hasta 5 m
const dTu = (t) => mez(20, 5, su(tr(t, Tel - 0.15, Tcinco + 0.15)));
const andando = (t) => (t > Tel - 0.15 && t < Tcinco + 0.15 ? 1 : 0);
// la cámara: detrás de él con zoom; en «hay» sube muy alto
const Z = k.claves([[0, 2.7], [Tel - 0.15, 2.7], [Tcinco + 0.15, 1.7], [Thay, 1.7], [Tmoverse, 1], [Fin3, 1]]);
const alto = (t) => mez(0.82, 26, su(tr(t, Thay - 0.1, Tmoverse + 0.25)));
const atras = (t) => mez(1.7, 14, su(tr(t, Thay - 0.1, Tmoverse + 0.25)));
const LEJOS = [-90, 0, 800];

export function dibuja(g, t) {
  const sube = su(tr(t, Thay - 0.1, Tmoverse + 0.25));
  const cam = camara([0.12, alto(t), -atras(t)], [0, mez(0.42, 0, sube), mez(10, 120, sube)]);
  const borroso = mez(0, 6, su(tr(t, Tmancha - 0.05, Tmancha + 0.35)));
  const P = [0.35, 0, dTu(t)];
  const zz = Z(t);
  g.save(); g.translate(540, 960); g.scale(zz, zz); g.translate(-540, -960);
  const orejas = su(tr(t, Tinst - 0.08, Tinst + 0.12));
  campo(g, t, cam, {
    borroso, nitido: 0.9 + atras(t) * 0.9,
    cosas: [
      { X: P, dibuja: (c) => {
        const bob = andando(t) * Math.abs(Math.sin(t * 9)) * 0.04;
        tu(c, t, cam, [P[0], bob, P[2]], { brazos: su(tr(t, Tmueves - 0.15, Tmueves + 0.1)) * (1 - su(tr(t, Thay + 0.3, Tmoverse))) });
      } },
      { X: LEJOS, dibuja: (c) => {
        // algo que corre allá lejos: un puntito con sus patas, y el círculo que lo marca
        const p = pon(cam, [LEJOS[0] + (t - Thay) * 6, 0.3, LEJOS[2]]); if (!p || sube < 0.3) return;
        c.fillStyle = "#3a2a1a"; c.beginPath(); c.ellipse(p.x, p.y - 4, 7, 4, 0, 0, 6.2832); c.fill();
      } },
      { X: [0, 0, 0], dibuja: (c) => {
        const p = pon(cam, [0, 0.49, 0]); if (!p) return;
        perroEspalda(c, t, p.x, p.y, p.s * 0.25 / 1000, { orejas: 0.25 + 0.75 * orejas, menea: orejas, inclina: 0.06 * k.pulso(t, Tinst + 0.1, 0.12) });
      } },
    ],
  });
  // la línea de puntos por el suelo hasta ti, y la distancia
  const al = su(tr(t, Tveinte - 0.15, Tveinte + 0.15)) * (1 - su(tr(t, Fin2, Fin2 + 0.4)));
  if (al > 0.01) {
    const a = pon(cam, [0.1, 0, 0.6]), b = pon(cam, [P[0], 0, P[2] - 0.3]);
    if (a && b) {
      g.save(); g.globalAlpha = al; g.setLineDash([22, 18]); g.lineDashOffset = -t * 60; g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 7 / zz;
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); g.restore();
      const m = pon(cam, [P[0] + 1.6, 1.0, P[2]]);
      if (m) k.pastilla(g, Math.min(m.x, 540 + 330 / zz), m.y, `${Math.round(dTu(t))}`, "m", "255,255,255", al, 96 / zz);
    }
  }
  // los 800 m
  const al8 = su(tr(t, Tmoverse, Tmoverse + 0.3));
  if (al8 > 0.01) {
    const a = pon(cam, [0, 0, 0.5]), b = pon(cam, [LEJOS[0] + (t - Thay) * 6, 0, LEJOS[2]]);
    if (a && b) {
      const u = su(tr(t, Tmoverse, Tocho + 0.2));
      g.save(); g.setLineDash([26, 20]); g.lineDashOffset = -t * 80; g.strokeStyle = `rgba(255,255,255,${0.9 * al8})`; g.lineWidth = 7;
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(mez(a.x, b.x, u), mez(a.y, b.y, u)); g.stroke(); g.restore();
      g.save(); g.strokeStyle = `rgba(255,230,120,${al8})`; g.lineWidth = 6; g.beginPath(); g.arc(b.x, b.y - 4, 34 + 6 * Math.sin(t * 8), 0, 6.2832); g.stroke(); g.restore();
      k.brillo(g, b.x, b.y, 160, "255,230,120", 0.5 * al8);
      k.pastilla(g, b.x, b.y - 130, "800", "m", "255,240,170", su(tr(t, Tocho - 0.1, Tocho + 0.2)), 104);
    }
  }
  g.restore();
}
