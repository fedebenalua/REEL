// «¿Sabías que el primer mando de la tele era una linterna? En 1955 apuntabas la luz a una esquina de la tele, y
// cambiaba de canal. Pero si le daba el sol, la tele cambiaba de canal sola.»
// Un solo sitio: el salón de 1955, con una cámara.
// - Fotograma 0: la linterna enorme, con la lente encendida; la cámara sale disparada por su haz hasta la fotocélula
//   de una esquina (fogonazo a los 0,5 s, la tele salta de canal) y se aleja: en «linterna» se ve entera, apuntando.
// - «En 1955 apuntabas la luz a una esquina»: la linterna se apaga, vuelve a encenderse y busca la esquina.
// - «cambiaba de canal»: la esquina se enciende, nieve y otro canal, dos veces.
// - «Pero si le daba el sol»: la cámara sube a la ventana; sale el sol con un fogonazo y su haz cae sobre otra
//   esquina; «cambiaba de canal sola»: la tele salta de canal una y otra vez, con la perilla girando sola.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, salon50, ventana, teleVieja, linterna, haz, CELDAS } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tlin = f1.t("linterna"), Tluz = f2.t("luz"), Tesq = f2.t("esquina"), Tsol = f3.t("sol"), Tfin = f3.fin;

// la cámara
const cam = camino2D([
  [0, [1.55, 490, 300]], [0.5, [3.4, 184, -250]], [0.62, [3.4, 184, -250]], [Tlin - 0.55, [0.7, 330, 330]], [Tlin + 0.7, [0.7, 330, 330]],
  [f2.inicio + 1.6, [0.78, 190, 250]], [Tesq + 0.1, [0.78, 190, 250]], [f2.fin - 0.2, [0.78, 180, 240]],
  [Tsol - 0.35, [0.72, 0, -330]], [Tfin, [0.7, 0, -340]],
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
const lintOn = (t) => Math.max(1 - su(tr(t, Tlin + 0.5, Tlin + 0.75)), su(tr(t, Tluz - 0.05, Tluz + 0.06)) * (1 - su(tr(t, f2.fin - 0.25, f2.fin))));
const lintPos = (t) => { const s = su(tr(t, f2.fin + 0.1, f2.fin + 0.5)); return [LENTE[0] + 180 * s, LENTE[1] + 900 * s]; };

// la nieve y el canal: cada salto es un instante en que la tele cambia
const SALTOS = [0.55, 1.6, f2.t("cambiaba"), f2.t("canal") + 0.08, 10.62, 10.96, 11.3, 11.62, 11.95];
const canalDe = (t) => SALTOS.filter((s) => t >= s).length;
const nieveDe = (t) => Math.max(0, ...SALTOS.map((s) => tr(t, s - 0.06, s) * (1 - tr(t, s + 0.14, s + 0.3))));
const perillaDe = (t) => SALTOS.reduce((a, s) => a + 0.85 * su(tr(t, s - 0.05, s + 0.2)), 0);

export const solDe = (t) => su(tr(t, Tsol - 0.12, Tsol + 0.2)) * (1 - su(tr(t, Tfin - 0.5, Tfin - 0.05)));
const pantalla = (wx, wy, Z, cx, cy) => [540 + (wx - cx) * Z, 960 + (wy - cy) * Z];

// La escena entera con la cámara que se le pase (la apertura alternativa usa otra).
export function escena(g, t, camara, uFogonazo) {
  const [Z, cx, cy] = camara(t), sol = solDe(t);
  vista(g, Z, cx, cy);
  salon50(g, t, sol, 0.55);
  ventana(g, t, sol);
  // el haz del sol, de la ventana a la esquina de arriba a la izquierda
  const cs = CELDAS[0];
  haz(g, -120, -900, Math.atan2(cs[1] + 900, cs[0] + 120), Math.hypot(cs[0] + 120, cs[1] + 900), 400, 190, "255,226,140", su(tr(t, Tsol + 0.02, Tsol + 0.3)) * (1 - su(tr(t, Tfin - 0.5, Tfin - 0.05))), 3, t);
  // la tele
  const lin = lintOn(t), solCelda = su(tr(t, Tsol + 0.25, Tsol + 0.45)) * (1 - su(tr(t, Tfin - 0.5, Tfin - 0.05)));
  const celdaDer = Math.max(1 - su(tr(t, Tlin + 0.5, Tlin + 0.75)), su(tr(t, Tesq - 0.12, Tesq + 0.08)) * (1 - su(tr(t, f2.fin - 0.25, f2.fin))));
  teleVieja(g, t, { canalN: canalDe(t), nv: nieveDe(t), celdas: [solCelda, celdaDer * (0.85 + 0.15 * Math.sin(t * 40)), 0, 0], perilla: perillaDe(t) });
  // la linterna con su haz
  const P = lintPos(t), A = aim(t), ang = Math.atan2(A[1] - P[1], A[0] - P[0]) + 0.01 * Math.sin(t * 7), dist = Math.hypot(A[0] - P[0], A[1] - P[1]);
  if (t < f2.fin + 0.7) {
    const on = Math.min(1, lin);
    haz(g, P[0], P[1], ang, dist, 330, 190, "255,244,205", on * (0.9 + 0.1 * Math.sin(t * 30)), 1, t);
    g.save(); g.translate(P[0], P[1]); g.rotate(ang); g.scale(1.7, 1.7); linterna(g, on); g.restore();
  }
  sinVista(g);
  // un fogonazo en la fotocélula al empezar y cuando la esquina se enciende
  const [fx, fy] = pantalla(CELDAS[1][0], CELDAS[1][1], Z, cx, cy);
  k.fogonazo(g, fx, fy, uFogonazo(t), 1100 * Math.min(1, Z / 1.6 + 0.4));
  k.fogonazo(g, fx, fy, t - (Tesq - 0.1), 700 * Z);
  const [sx, sy] = pantalla(CELDAS[0][0], CELDAS[0][1], Z, cx, cy);
  k.fogonazo(g, sx, sy, t - (Tsol + 0.3), 900 * Z);
  k.brillo(g, 540, 600, 2200, "255,240,190", 0.5 * k.pulso(t, Tsol + 0.08, 0.13));
  velo(g, 0.5);
  vineta(g, 0.45);
}

export function dibuja(g, t) {
  escena(g, t, cam, (u) => u - 0.42);
  // líneas de velocidad al lanzarse por el haz
  const a = su(tr(t, 0.05, 0.12)) * (1 - su(tr(t, 0.42, 0.55)));
  if (a > 0.01) {
    const az = k.azar(88);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 70; i++) {
      const ang = az() * 6.2832, r0 = 260 + az() * 700, l = 140 + az() * 320, ph = (t * 3.4 + az()) % 1, r = r0 + ph * 500;
      g.strokeStyle = `rgba(255,240,200,${a * (0.15 + 0.5 * az()) * (1 - ph)})`; g.lineWidth = 2 + az() * 5;
      g.beginPath(); g.moveTo(540 + Math.cos(ang) * r, 960 + Math.sin(ang) * r); g.lineTo(540 + Math.cos(ang) * (r + l), 960 + Math.sin(ang) * (r + l)); g.stroke();
    }
    g.restore();
  }
}

export const momentos = { hook: 0, linterna: Tlin, sol: Tsol };
