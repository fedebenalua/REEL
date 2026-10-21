// «¿Sabías que el primer mando de la tele sin cable era una linterna? En 1955 apuntabas la luz a una esquina de la
// tele, y cambiaba de canal.»
// Un solo sitio: el salón de 1955, con una cámara.
// - Fotograma 0: la linterna enorme, con la lente encendida; la cámara sale disparada por su haz hasta la fotocélula
//   de una esquina (fogonazo a los 0,5 s, la tele salta de canal) y se aleja: en «linterna» se ve entera, apuntando.
// - «En 1955 apuntabas la luz a una esquina»: la linterna se apaga, vuelve a encenderse y busca la esquina.
// - «cambiaba de canal»: la esquina se enciende, nieve y otro canal, dos veces. Luego la linterna se retira y la
//   imagen reposa antes del corte a Tesla.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, salon50, ventana, teleVieja, linterna, haz, CELDAS } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tlin = f1.t("linterna"), Tluz = f2.t("luz"), Tesq = f2.t("esquina"), Tfin = f2.fin, FIN = v.frase(3).inicio;
const OFF = Tfin - 0.55;   // la linterna se apaga cuando acaba el segundo cambio de canal

const cam = camino2D([
  [0, [1.55, 490, 300]], [0.5, [3.4, 184, -250]], [0.62, [3.4, 184, -250]], [Tlin - 0.55, [0.7, 330, 330]], [Tlin + 0.7, [0.7, 330, 330]],
  [f2.inicio + 1.6, [0.78, 190, 250]], [Tesq + 0.1, [0.78, 190, 250]], [FIN, [0.78, 190, 250]],
]);

// la linterna: dónde está y a dónde apunta (la lente)
const LENTE = [490, 300];
const aim = (t) => {
  const aCelda = CELDAS[1];
  if (t < Tlin + 0.8) return aCelda;
  if (t < Tluz - 0.1) return [mez(aCelda[0], 330, su(tr(t, 3.7, 4.6))), mez(aCelda[1], 60, su(tr(t, 3.7, 4.6)))];
  const u = su(tr(t, Tluz + 0.05, Tesq));
  return [mez(30, aCelda[0], u), mez(-60, aCelda[1], u)];
};
// encendida: en el hook, y otra vez de «luz» hasta que cambia de canal
const lintOn = (t) => Math.max(1 - su(tr(t, Tlin + 0.5, Tlin + 0.75)), su(tr(t, Tluz - 0.05, Tluz + 0.06)) * (1 - su(tr(t, OFF, OFF + 0.25))));
const lintPos = (t) => { const s = su(tr(t, OFF + 0.2, OFF + 0.62)); return [LENTE[0] + 300 * s, LENTE[1] + 1500 * s]; };

// la nieve y el canal: cada salto es un instante en que la tele cambia
const SALTOS = [0.55, 1.6, f2.t("cambiaba"), f2.t("canal") + 0.08];
const canalDe = (t) => SALTOS.filter((s) => t >= s).length;
const nieveDe = (t) => Math.max(0, ...SALTOS.map((s) => tr(t, s - 0.06, s) * (1 - tr(t, s + 0.14, s + 0.3))));
const perillaDe = (t) => SALTOS.reduce((a, s) => a + 0.85 * su(tr(t, s - 0.05, s + 0.2)), 0);

const pantalla = (wx, wy, Z, cx, cy) => [540 + (wx - cx) * Z, 960 + (wy - cy) * Z];

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  salon50(g, t, 0, 0.55);
  ventana(g, t, 0);
  const lin = lintOn(t);
  const celdaDer = Math.max(1 - su(tr(t, Tlin + 0.5, Tlin + 0.75)), su(tr(t, Tesq - 0.12, Tesq + 0.08)) * (1 - su(tr(t, OFF, OFF + 0.25))));
  teleVieja(g, t, { canalN: canalDe(t), nv: nieveDe(t), celdas: [0, celdaDer * (0.85 + 0.15 * Math.sin(t * 40)), 0, 0], perilla: perillaDe(t) });
  // la linterna con su haz
  const P = lintPos(t), A = aim(t), ang = Math.atan2(A[1] - P[1], A[0] - P[0]) + 0.01 * Math.sin(t * 7), dist = Math.hypot(A[0] - P[0], A[1] - P[1]);
  const on = Math.min(1, lin);
  if (t < Tfin + 0.1) {
    haz(g, P[0], P[1], ang, dist, 330, 190, "255,244,205", on * (0.9 + 0.1 * Math.sin(t * 30)), 1, t);
    g.save(); g.translate(P[0], P[1]); g.rotate(ang); g.scale(1.7, 1.7); linterna(g, on); g.restore();
  }
  sinVista(g);
  // un fogonazo en la fotocélula al llegar y cuando la esquina se enciende
  const [fx, fy] = pantalla(CELDAS[1][0], CELDAS[1][1], Z, cx, cy);
  k.fogonazo(g, fx, fy, t - 0.42, 1100 * Math.min(1, Z / 1.6 + 0.4));
  k.fogonazo(g, fx, fy, t - (Tesq - 0.1), 700 * Z);
  velo(g, 0.5);
  vineta(g, 0.45);
  // líneas de velocidad al lanzarse por el haz
  const a = su(tr(t, 0.05, 0.12)) * (1 - su(tr(t, 0.42, 0.55)));
  if (a > 0.01) {
    const az = k.azar(88);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 70; i++) {
      const an = az() * 6.2832, r0 = 260 + az() * 700, l = 140 + az() * 320, ph = (t * 3.4 + az()) % 1, r = r0 + ph * 500;
      g.strokeStyle = `rgba(255,240,200,${a * (0.15 + 0.5 * az()) * (1 - ph)})`; g.lineWidth = 2 + az() * 5;
      g.beginPath(); g.moveTo(540 + Math.cos(an) * r, 960 + Math.sin(an) * r); g.lineTo(540 + Math.cos(an) * (r + l), 960 + Math.sin(an) * (r + l)); g.stroke();
    }
    g.restore();
  }
}

export const momentos = { hook: 0, linterna: Tlin };
