// «Así que tu coche no se parece a un horno: es un horno con ruedas.» · «Envíaselo a ese amigo que deja el coche al
// sol "solo cinco minutos".»
// El aparcamiento otra vez. Se entra con un corte en «Así».
// - «horno» (la segunda): las ventanillas brillan como la puerta de un horno encendido.
// - «ruedas»: el coche rueda un poco hacia delante y frena.
// - El cierre: la cámara sube hacia el sol hasta quedar como en el primer fotograma.
import * as k from "#kit";
import { v } from "#voz";
import { aparcamiento, camino2D, aPantalla, velo } from "../mundo.js";
import { cam as camHook } from "./01-hook.js";

const f11 = v.frase(11), f12 = v.frase(12);
export const desde = (vz) => vz.frase(11).inicio;

const { suave: su, tramo: tr, mez } = k;
const T0 = f11.inicio, Tcoche = f11.t("coche"), Thorno = f11.t("horno", 2), True = f11.t("ruedas");
const T12 = f12.inicio, Tamigo = f12.t("amigo"), Tsol = f12.t("sol"), Tmin = f12.t("minutos");
const Fin = v.duracion;
const AVANCE = 170;

// La cámara acaba exactamente como empieza el vídeo (el primer fotograma del hook).
const inicio = camHook(0);
const cam = camino2D([
  [T0, [1.0, 10, -350]],
  [True + 0.9, [1.0, 30 + AVANCE * 0.5, -350]],
  [Tamigo, [1.0, 30 + AVANCE * 0.5, -350]],
  [Tmin + 0.6, inicio],
]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  const rueda = su(tr(t, True - 0.1, True + 0.75));
  const xc = AVANCE * rueda;
  const golpe = k.pulso(t, Thorno + 0.15, 0.3);
  const brasa = Math.max(0.4 + 0.2 * su(tr(t, Thorno - 0.2, Thorno + 0.3)), golpe);
  aparcamiento(g, t, Z, cx, cy, xc, { calor: 1, brasa, gira: xc / 88 });
  if (golpe > 0.02) {
    const [wx, wy] = aPantalla(Z, cx, cy, xc - 80, -330);
    k.brillo(g, wx, wy, 1500, "255,120,40", 0.45 * golpe);
  }
  velo(g, 0.45);
}
