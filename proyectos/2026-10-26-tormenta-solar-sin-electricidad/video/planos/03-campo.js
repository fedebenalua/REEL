// «La nube del Sol sacude el campo magnético de la Tierra, y...»
// Otro sitio: la Tierra de cerca en el espacio, con las líneas de su campo magnético alrededor. Corte en «La».
// - «La nube del Sol»: la nube llega desde abajo (el lado del Sol) y sube hacia la Tierra.
// - «sacude»: choca con las líneas, las aplasta por abajo y las estira por arriba; tiemblan; se enciende la aurora.
// - «el campo magnético de la Tierra»: las líneas siguen temblando, cada vez menos; antes del corte (en «eso»), quietas.
import * as k from "#kit";
import { v } from "#voz";
import { campo, nube, tierraNoche } from "../mundo.js";

const f3 = v.frase(3);
export const desde = f3.inicio;

const { suave, tramo } = k;
const T0 = f3.inicio, Tsac = f3.t("sacude"), Teso = f3.t("eso");
export const choque = Tsac;

const az = k.azar(31);
const estrellas = Array.from({ length: 1400 }, () => ({ p: [(az() - 0.5) * 300, (az() - 0.5) * 500, -200 - az() * 300], c: ["roja", "naranja", "amarilla", "blanca", "azul"][Math.floor(az() * 5)], b: 0.3 + Math.pow(az(), 3) * 2, r: 0.1 + az() * 0.2 }));
const camara = (t) => k.mira([0, 0, k.mez(60, 54, suave(tramo(t, T0, Teso)))], [0, 0, -100]);

export function dibuja(g, t) {
  const cam = camara(t);
  k.fondo(g, cam);
  k.estrellas(g, cam, null, estrellas);
  const X = 540, Y = 930, rad = 250 * (60 / cam.p[2]);
  // la nube que sube desde abajo y pasa
  const R = k.claves([[T0 - 0.1, 250], [Tsac + 0.05, 2400 - Y - rad * 1.7], [Teso, 2400 - Y + rad * 2.5]])(t);
  const aplasta = suave(tramo(t, Tsac - 0.1, Tsac + 0.4)) * (1 - 0.3 * tramo(t, Tsac + 1.2, Teso));
  const sacude = suave(tramo(t, Tsac - 0.05, Tsac + 0.15)) * (1 - suave(tramo(t, Tsac + 0.4, Teso - 0.3)));
  // la nube, detrás: choca con el campo y lo rodea
  nube(g, X, 2400, R, 0.9 * (1 - suave(tramo(t, Tsac + 0.3, Tsac + 1.2))), t, 0.75);
  campo(g, X, Y, rad, 0.9, aplasta, sacude, t, [1.4, 1.75, 2.12]);
  tierraNoche(g, X, Y, rad, 2.2 + t * 0.06, { aurora: suave(tramo(t, Tsac, Tsac + 0.5)), auroraT: t });
  // donde choca, abajo, se enciende
  k.brillo(g, X, Y + rad * 1.4, rad * 3, "255,150,70", 0.5 * k.pulso(t, Tsac + 0.1, 0.35));
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(3,5,10,0.4)"); vg.addColorStop(1, "rgba(3,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
