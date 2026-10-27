// «¿Por qué existen baldosas amarillas con relieve en las calles de casi todas las ciudades?» … «Las rayas dicen
// "sigue": por aquí puedes caminar seguro.»
// La calle al atardecer, con una sola cámara que viaja:
// - fotograma 0: a ras de suelo, volando sobre la franja amarilla; cruza la banda de botones como colinas;
// - «relieve»: frena y sube; el paso de cebra y un coche que cruza; «ciudades»: la calle entera;
// - «mapa»: desde arriba, las rayas se encienden en verde y los botones en rojo; «pies»: pisadas de luz;
// - «para»: baja a los botones, una onda roja; «paso de peatones»: mira al paso y cruza un coche;
// - «sigue»: se da la vuelta; una luz verde corre por las rayas y las pisadas siguen por ella.
import * as k from "#kit";
import { v } from "#voz";
import { calle, camino, poli, enSuelo, pasos, pisadas, FRANJA, BANDA, HALO_ROJO, HALO_VERDE } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const Trel = f1.t("relieve"), Tciu = f1.t("ciudades"), Tmapa = f2.t("mapa"), Tpies = f2.t("pies");
const Tpara = f3.t("para"), Tpaso = f3.t("paso"), Tsig = f4.t("sigue"), Fin = f5.inicio;

const cam = camino([
  [-0.6, [0.02, 0.25, 15.0], [0, 0.05, 18.0]],
  [0.0, [0.02, 0.24, 19.2], [0, 0.05, 22.2]],
  [0.95, [0.02, 0.22, 26.4], [0, 0.08, 29.4]],
  [1.65, [0.02, 0.21, 29.0], [0, 0.16, 33]],
  [Trel + 0.35, [0, 0.95, 28.2], [0, 0.6, 36]],
  [Tciu + 0.2, [1.5, 2.8, 24.2], [-0.3, 0.3, 32]],
  [Tmapa + 0.1, [0.2, 7.5, 19.0], [0, 0.14, 26.5]],
  [Tpies + 0.6, [0.1, 6.6, 20.6], [0, 0.14, 27.4]],
  [Tpara - 0.1, [-0.9, 1.7, 26.4], [0, 0.14, 29.2]],
  [Tpaso, [-0.7, 1.5, 26.9], [0, 0.5, 34]],
  [Tpaso + 0.9, [-0.7, 1.5, 26.9], [0, 0.5, 34]],
  [Tsig - 0.6, [1.6, 1.6, 29.4], [-1.5, 0.3, 28.6]],
  [Tsig + 0.2, [0.7, 1.6, 31.0], [0, 0.14, 22]],
  [Fin - 0.3, [0.5, 1.4, 30.2], [0, 0.14, 20]],
]);

// los coches que cruzan: uno en el hook y otro en «paso de peatones»
const coches = (t) => [
  { x: -22 + (t - 1.6) * 13, z: 33, color: "#d8323c", sentido: 1 },
  { x: 24 - (t - (Tpaso - 0.9)) * 15, z: 37, color: "#2f7fe0", sentido: -1 },
];

const ida = pasos(23.0, 28.1, Tpies - 0.25, 0.27);
const vuelta = pasos(28.0, 21.0, Tsig + 0.15, 0.3);

// una luz que recorre la franja desde zA hasta zB a partir de t0 (u: lo que ha avanzado)
function corre(g, c, u, zA, zB, color, al) {
  if (al <= 0.01) return;
  const frente = k.mez(zA, zB, u), dir = Math.sign(zB - zA);
  g.save();
  for (let z = Math.min(zA, zB); z < Math.max(zA, zB); z += 0.4) {
    const d = (frente - z) * dir;
    const a = d < 0 ? 0 : Math.exp(-d / 3.5) * 0.55 + 0.12;
    if (a < 0.02) continue;
    if (poli(g, c, [[FRANJA.x0, 0.146, z], [FRANJA.x1, 0.146, z], [FRANJA.x1, 0.146, z + 0.4], [FRANJA.x0, 0.146, z + 0.4]])) { g.fillStyle = `rgba(${color},${Math.min(0.8, a * al * 1.3)})`; g.fill(); }
  }
  g.restore();
}

export function dibuja(g, t) {
  const c = cam(t);
  calle(g, t, c, { coches });
  // «mapa»: las rayas en verde hacia el paso y los botones en rojo
  const mapa = k.tramo(t, Tmapa - 0.1, Tmapa + 1.0), mapaAl = 1 - k.tramo(t, Tpara + 1.2, Tpaso + 0.6);
  corre(g, c, k.suave(mapa), 18, 28.4, "40,220,110", mapaAl * (mapa > 0 ? 1 : 0));
  const rojo = Math.max(k.suave(k.tramo(t, Tmapa + 0.6, Tmapa + 1.0)) * 0.35 * mapaAl, 0.6 * k.pulso(t, Tpara + 0.1, 0.35));
  if (rojo > 0.01) {
    g.save();
    if (poli(g, c, [[BANDA.x0, 0.146, BANDA.z0], [BANDA.x1, 0.146, BANDA.z0], [BANDA.x1, 0.146, BANDA.z1], [BANDA.x0, 0.146, BANDA.z1]])) { g.fillStyle = `rgba(235,40,30,${Math.min(0.75, rojo * 1.4)})`; g.fill(); }
    g.restore();
  }
  // «para»: la onda roja que sale de los botones
  const onda = k.tramo(t, Tpara - 0.05, Tpara + 0.9);
  if (onda > 0 && onda < 1) {
    g.save(); g.globalCompositeOperation = "lighter";
    enSuelo(g, c, 0, 29, 0, (q) => { q.globalAlpha = 0.9 * (1 - onda); const R = 0.6 + 3.2 * k.entra(onda); q.drawImage(HALO_ROJO, -R, -R * 0.5, 2 * R, R); }, 0.15);
    g.restore();
  }
  // «sigue»: la luz verde corre por las rayas hacia lo lejos
  const sig = k.tramo(t, Tsig - 0.1, Tsig + 2.2), sigAl = 1 - k.tramo(t, Fin - 0.7, Fin - 0.25);
  corre(g, c, k.suave(sig), 28.4, 6, "40,220,110", (sig > 0 ? 1 : 0) * sigAl);
  if (sig > 0 && sigAl > 0) {
    g.save(); g.globalCompositeOperation = "lighter";
    const z = k.mez(28.4, 6, k.suave(sig));
    enSuelo(g, c, 0, z, 0, (q) => { q.globalAlpha = 0.8 * sigAl; q.drawImage(HALO_VERDE, -0.9, -1.6, 1.8, 3.2); }, 0.15);
    g.restore();
  }
  // las pisadas
  pisadas(g, c, t, ida, "40,200,255", 2.2);
  pisadas(g, c, t, vuelta, "40,200,255", 1.8, sigAl);
  // un velo arriba, detrás del subtítulo, cuando el cielo está claro
  const vg = g.createLinearGradient(0, 200, 0, 680); vg.addColorStop(0, "rgba(12,8,30,0.6)"); vg.addColorStop(1, "rgba(12,8,30,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 680);
}
