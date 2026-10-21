// «Así que cinco años después llegó la linterna: un mando sin cables. Pero si le daba el sol, la tele cambiaba de
// canal sola.»
// Vuelve el salón de 1955 (el del hook), con un corte en «Así».
// - «cinco años después»: «1955» y la linterna entra por abajo a la derecha.
// - «llegó la linterna»: queda encendida apuntando a la fotocélula; la tele cambia de canal.
// - «un mando sin cables»: la linterna se aleja, y el haz sigue dando en la esquina sin nada de por medio.
// - «Pero si le daba el sol»: la cámara sube a la ventana; sale el sol con un fogonazo y su haz cae sobre otra
//   esquina; «cambiaba de canal sola»: la tele salta de canal una y otra vez, con la perilla girando sola.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, salon50, ventana, teleVieja, linterna, haz, CELDAS } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez } = k;
const f7 = v.frase(7), f8 = v.frase(8);
const T0 = f7.inicio, Tcin = f7.t("cinco"), Tlleg = f7.t("llego"), Tlin = f7.t("linterna"), Tsin = f7.t("sin"), Tsol = f8.t("sol"), Tfin = f8.fin;
const FIN = v.frase(9).inicio;
const APAGA = Tsol - 0.5;

const cam = camino2D([
  [T0, [0.7, 330, 330]], [Tsin + 0.3, [0.7, 330, 330]], [Tsin + 0.9, [0.66, 380, 420]], [APAGA + 0.2, [0.66, 380, 420]],
  [Tsol - 0.1, [0.72, 0, -330]], [FIN, [0.7, 0, -340]],
]);

const LENTE = [490, 300];
const lejos = (t) => su(tr(t, Tsin, Tsin + 0.9));            // la linterna se aleja con «sin cables»
const lintPos = (t) => {
  const e = 1 - su(tr(t, Tcin + 0.1, Tlleg + 0.15)), s = su(tr(t, APAGA + 0.15, APAGA + 0.6));
  return [LENTE[0] + 300 * e + 260 * lejos(t) + 300 * s, LENTE[1] + 1500 * e + 330 * lejos(t) + 1500 * s];
};
const lintOn = (t) => su(tr(t, Tlleg + 0.12, Tlleg + 0.3)) * (1 - su(tr(t, APAGA, APAGA + 0.2)));

// los saltos de canal: dos con la linterna y los del sol
const SALTOS = [Tlin + 0.55, Tsin + 0.6, Tsol + 0.5, Tsol + 0.84, Tsol + 1.18, Tsol + 1.5, Tsol + 1.83];
const canalDe = (t) => 4 + SALTOS.filter((s) => t >= s).length;
const nieveDe = (t) => Math.max(0, ...SALTOS.map((s) => tr(t, s - 0.06, s) * (1 - tr(t, s + 0.14, s + 0.3))));
const perillaDe = (t) => SALTOS.reduce((a, s) => a + 0.85 * su(tr(t, s - 0.05, s + 0.2)), 0);

const solDe = (t) => su(tr(t, Tsol - 0.12, Tsol + 0.2)) * (1 - su(tr(t, Tfin - 0.5, Tfin - 0.05)));
const pantalla = (wx, wy, Z, cx, cy) => [540 + (wx - cx) * Z, 960 + (wy - cy) * Z];

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t), sol = solDe(t);
  vista(g, Z, cx, cy);
  salon50(g, t, sol, 0.55);
  ventana(g, t, sol);
  // el haz del sol, de la ventana a la esquina de arriba a la izquierda
  const cs = CELDAS[0], solAl = su(tr(t, Tsol + 0.02, Tsol + 0.3)) * (1 - su(tr(t, Tfin - 0.5, Tfin - 0.05)));
  haz(g, -120, -900, Math.atan2(cs[1] + 900, cs[0] + 120), Math.hypot(cs[0] + 120, cs[1] + 900), 400, 190, "255,226,140", solAl, 3, t);
  const lin = lintOn(t), solCelda = su(tr(t, Tsol + 0.25, Tsol + 0.45)) * (1 - su(tr(t, Tfin - 0.5, Tfin - 0.05)));
  const celdaDer = su(tr(t, Tlleg + 0.2, Tlleg + 0.45)) * (1 - su(tr(t, APAGA, APAGA + 0.2)));
  teleVieja(g, t, { canalN: canalDe(t), nv: nieveDe(t), celdas: [solCelda, celdaDer * (0.85 + 0.15 * Math.sin(t * 40)), 0, 0], perilla: perillaDe(t) });
  // la linterna con su haz, siempre sobre la fotocélula de la derecha
  if (lin > 0.01 || t < Tlleg + 0.4) {
    const P = lintPos(t), A = CELDAS[1], ang = Math.atan2(A[1] - P[1], A[0] - P[0]) + 0.012 * Math.sin(t * 6), dist = Math.hypot(A[0] - P[0], A[1] - P[1]);
    haz(g, P[0], P[1], ang, dist, 330, 190, "255,244,205", lin * (0.9 + 0.1 * Math.sin(t * 30)), 1, t);
    g.save(); g.translate(P[0], P[1]); g.rotate(ang); g.scale(1.7, 1.7); linterna(g, lin); g.restore();
  }
  sinVista(g);
  const [fx, fy] = pantalla(CELDAS[1][0], CELDAS[1][1], Z, cx, cy);
  k.fogonazo(g, fx, fy, t - (Tlleg + 0.25), 700 * Z);
  const [sx, sy] = pantalla(CELDAS[0][0], CELDAS[0][1], Z, cx, cy);
  k.fogonazo(g, sx, sy, t - (Tsol + 0.3), 900 * Z);
  k.brillo(g, 540, 600, 2200, "255,240,190", 0.5 * k.pulso(t, Tsol + 0.08, 0.13));
  // «1955», quieto, mientras se dice «cinco años después»
  const an = su(tr(t, T0 + 0.12, T0 + 0.4)) * (1 - su(tr(t, Tlleg + 0.1, Tlleg + 0.4)));
  k.pastilla(g, 540, 1390, "1955", "", "255,226,160", an, 120);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { llega: Tlleg, sol: Tsol };
