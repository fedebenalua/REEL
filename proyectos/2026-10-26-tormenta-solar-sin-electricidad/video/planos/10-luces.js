// «Así que lo más probable no es un mundo apagado: son apagones en algunas zonas, y...»
// Otro sitio: la Tierra de noche vista desde su órbita, muy de cerca: su curva llena la mitad de abajo, con el norte
// arriba, todas sus ciudades encendidas y la aurora en el horizonte. Corte en «Así».
// - «no es un mundo apagado»: todo sigue encendido; la Tierra gira despacio y la cámara se acerca.
// - «son apagones en algunas zonas»: se apagan solo unas pocas manchas, cerca del norte, una tras otra; cada una con un
//   destello rojo al apagarse. El resto del mundo sigue con su luz.
import * as k from "#kit";
import { v } from "#voz";
import { CIELO, CIUDADES, tierraNoche } from "../mundo.js";

const f9 = v.frase(9);
export const desde = f9.inicio;

const { suave, tramo } = k;
const T0 = f9.inicio, Tapa = f9.t("apagones"), Tzon = f9.t("zonas"), Taur = f9.t("auroras");
const CAM = k.mira([0, 0, 60], [0, 0, -100]);
const giroDe = (t) => 2.4 + t * 0.05;
const G = giroDe((T0 + Taur) / 2);
const dentro = (c, z) => {
  const dl = Math.atan2(Math.sin(c.lon - z.lon), Math.cos(c.lon - z.lon)) * Math.cos(z.lat);
  return Math.hypot(dl, c.lat - z.lat) < z.r;
};
// las zonas que se apagan: tres sitios con muchas ciudades, en el norte, en la cara que se ve y separados entre sí
const ZONAS = (() => {
  const cerca = CIUDADES.filter((c) => c.lat > 0.68 && c.lat < 0.98 && Math.abs(Math.atan2(Math.sin(c.lon + G), Math.cos(c.lon + G))) < 0.75);
  const cuenta = cerca.map((c) => ({ c, n: cerca.filter((o) => dentro(o, { lon: c.lon, lat: c.lat, r: 0.14 })).length })).sort((a, b) => b.n - a.n);
  const l = [];
  for (const { c } of cuenta) if (l.length < 3 && l.every((z) => !dentro(c, { lon: z.lon, lat: z.lat, r: 0.4 }))) l.push({ lon: c.lon, lat: c.lat, r: 0.14 });
  return l.sort((a, b) => a.lon - b.lon).map((z, i) => ({ ...z, t: Tapa - 0.1 + i * 0.4 }));
})();

export function dibuja(g, t) {
  k.fondo(g, CAM);
  k.estrellas(g, CAM, null, CIELO);
  const u = tramo(t, T0, Taur), rad = k.mez(700, 820, 0.6 * u + 0.4 * suave(u));
  tierraNoche(g, 540, 760 + rad, rad, giroDe(t), {
    inc: 0.5,
    apagada: (c) => { for (const z of ZONAS) if (dentro(c, z)) return suave(tramo(t, z.t, z.t + 0.25)); return 0; },
    rojo: (c) => { for (const z of ZONAS) if (dentro(c, z)) return 0.8 * k.pulso(t, z.t + 0.05, 0.35) + 0.18 * suave(tramo(t, z.t, z.t + 0.4)); return 0; },
    aurora: 0.7,
    auroraT: t,
  });
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(3,5,10,0.45)"); vg.addColorStop(1, "rgba(3,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
