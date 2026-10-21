// «Ahora ponle la tapa. El vapor choca contra ella, vuelve a ser agua y cae dentro, con todo su calor. Así que, en cuanto
// hierva, bajas el fuego y sigue hirviendo igual.»
// Se vuelve a la olla (el mismo sitio del hook): se entra con un corte en «Ahora».
// - «Ahora ponle la»: la tapa baja desde arriba; en «tapa» se cierra con un golpe, y el vapor se queda dentro.
// - «El vapor choca contra ella»: la cámara entra bajo la tapa; el vapor se aplasta contra el cristal.
// - «vuelve a ser agua»: se forman gotas que cuelgan, cada una con su brasa; «cae dentro»: caen al agua, que se enciende.
// - «bajas el fuego»: la cámara baja a la llama y al mando; en «bajas» el mando gira y la llama se encoge; el agua sigue
//   hirviendo igual.
import * as k from "#kit";
import { v } from "#voz";
import { vista, camino2D, fondoCocina, olla, velo, sinVista } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { tramo: tr, suave: su, claves } = k;
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const T0 = f5.inicio, Tcae = f5.t("tapa") - 0.04, Tcalor6 = f6.t("calor"), Tbajas = f7.t("bajas");
export const aterriza = Tcae;

const cam = camino2D([
  [T0, [1.1, 540, 960]], [Tcae + 0.3, [1.1, 540, 960]],
  [f6.t("choca") + 0.1, [1.8, 540, 700]], [f7.inicio - 0.1, [1.8, 540, 700]],
  [f7.t("hierva") + 0.2, [1.12, 590, 1080]], [f7.fin + 0.4, [1.12, 590, 1080]],
]);
const llama = claves([[T0, 1.55], [Tbajas - 0.05, 1.55], [Tbajas + 0.85, 0.3], [f7.fin + 1, 0.3]]);
const giroMando = claves([[T0, -0.9], [Tbajas - 0.05, -0.9], [Tbajas + 0.8, 0.95], [f7.fin + 1, 0.95]]);

// la tapa cae con gravedad y bota un poco al cerrarse
const dyTapa = (t) => {
  if (t < Tcae) { const u = tr(t, T0 - 0.05, Tcae); return -820 * (1 - u * u); }
  const q = t - Tcae;
  return -16 * Math.exp(-q * 13) * Math.abs(Math.sin(q * 20));
};

export function estado(t) {
  const calma = su(tr(t, f7.fin - 0.15, f7.fin + 0.25));   // antes del corte, lo que se mueve se calma
  return {
    llama: llama(t), hierve: 1 - 0.5 * calma, vapor: (1 - 0.3 * su(tr(t, Tbajas, Tbajas + 0.9))) * (1 - 0.5 * calma), brasas: (1 - 0.35 * su(tr(t, Tbajas, Tbajas + 0.9))) * (1 - 0.5 * calma),
    calor: 0.55 + 0.4 * su(tr(t, f6.t("cae"), Tcalor6 + 0.6)) - 0.15 * su(tr(t, Tbajas, Tbajas + 0.9)),
    tapaDy: dyTapa(t), cubre: su(tr(t, Tcae, Tcae + 0.55)), niebla: 0.65 * su(tr(t, Tcae + 0.3, f6.t("choca") + 0.9)),
    gotas: { t0: f6.t("agua") - 0.55 },
    mando: giroMando(t),
  };
}

export function dibuja(g, t) {
  const c = cam(t), o = estado(t);
  vista(g, c[0], c[1], c[2]);
  fondoCocina(g, 0.5 + 0.7 * o.llama);
  olla(g, t, o);
  // un destello cuando la tapa se cierra
  const golpe = k.pulso(t, Tcae + 0.03, 0.07);
  if (golpe > 0.02) k.brillo(g, 540, 560, 900, "blanca", 0.5 * golpe);
  velo(g, 0.85);
}

export const momentos = { tapa: Tcae, baja: Tbajas };
