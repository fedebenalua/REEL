// «Así que el aire se queda. Se pierde el norte, y el escudo de lo que vuela.
// Envíaselo a ese amigo que cree que sin el imán nos quedaríamos sin aire.»
// El mismo encuadre del principio, sin escudo. El aire aguanta el viento. El eje del norte se tumba y se queda.
import * as k from "#kit";
import { v } from "#voz";
import { ENC, dibujaEspacio } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio - 0.04;

const f11 = v.frase(11), f12 = v.frase(12);
const Tqueda = f11.t("queda"), Tvuela = f11.t("vuela"), Taire = f12.t("aire");

const Pcerca = [-1.15, 0.28, 2.15];

function camara(t) {
  const u11 = k.suave(k.tramo(t, f11.inicio, Tqueda + 0.55));
  const medio = k.mezV(Pcerca, [-0.55, 0.18, 1.85], u11);
  const mira = k.mezV([0, 0, 0], [-0.35, 0, 0], u11);
  const u = k.suave(k.tramo(t, f12.inicio, Taire - 0.15));
  return k.mira(k.mezV(medio, ENC.pos, u), k.mezV(mira, ENC.mira, u));
}

export function dibuja(g, t) {
  const fin = v.duracion;
  const tp = Math.min(t, fin - 0.25);
  const cam = camara(tp), antes = camara(Math.min(t - 1 / 60, fin - 0.25));
  const pulso = k.pulso(tp, Tqueda + 0.12, 0.18) + k.pulso(tp, Taire + 0.08, 0.2);
  const alSat = k.suave(k.tramo(tp, Tvuela - 0.4, Tvuela - 0.05)) * (1 - k.suave(k.tramo(tp, Tvuela + 0.15, Tvuela + 0.55)));
  dibujaEspacio(g, cam, antes, {
    t: tp,
    escudo: 0,
    aire: 0.9 + pulso * 0.45,
    viento: 1,
    aurora: 0.92,
    auroraAl: 0.7,
    luces: 0.9,
    saa: 0,
    sat: alSat > 0.03 ? { u: 0.58, chispa: k.pulso(tp, Tvuela, 0.14), al: alSat } : null,
    velo: 0.5,
  });
}
