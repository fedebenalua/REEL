// «Al año siguiente, uno con martillitos que golpeaban barras de metal: un sonido que tú no oías y la tele sí.»
// El mismo salón de 1955: sigue al plano de la linterna sin cortar; la linterna se va por abajo y sube el martillito.
// - «Al año siguiente»: «1956»; el mando del martillito entra por abajo.
// - «martillitos»: se ve por dentro: las barritas y los martillos; «golpeaban barras de metal»: un martillazo y la
//   barrita vibra.
// - «un sonido»: salen anillos azules, finos, hacia la tele; «tú no oías»: casi transparentes; «la tele sí»: su
//   micrófono se enciende y cambia de canal.
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, camara, linterna, martillito, mezCam, ondasAgudas, salon, tele } from "../hist.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f4 = v.frase(4);
export const desde = (vz) => vz.frase(4).inicio;
export const entrada = "sigue";
const T0 = f4.inicio, Tano = f4.t("ano"), Tmar = f4.t("martillitos"), Tgol = f4.t("golpeaban"), Tson = f4.t("sonido"), Tno = f4.t("no"), Toi = f4.t("oias"), Tsi = f4.t("si"), Fin = v.frase(5).inicio;
const RX = 790, RY = 1450, RW = 380;
const GOLPES = [[Tgol, 0], [Tson - 0.1, 2], [Tsi - 0.45, 1]];

export function dibuja(g, t) {
  const cam = mezCam(CAM0, { Z: 1.12, F: { x: 640, y: 1100 } }, su(tr(t, Tmar - 0.3, Tgol)) * (1 - su(tr(t, Tson - 0.2, Tson + 0.4))));
  g.save(); camara(g, cam);
  salon(g, t, 0);
  tele(g, t, { canal: 4 + su(tr(t, Tsi, Tsi + 0.3)), sonido: su(tr(t, Tsi - 0.3, Tsi)) * (1 - su(tr(t, Tsi + 0.4, Fin - 0.1))) });
  const golpe = [0, 0, 0, 0], vibra = [0, 0, 0, 0];
  for (const [te, i] of GOLPES) { golpe[i] = Math.max(golpe[i], k.pulso(t, te + 0.05, 0.08)); vibra[i] = Math.max(vibra[i], tr(t, te + 0.05, te + 0.1) * Math.exp(-Math.max(0, t - te - 0.1) * 3)); }
  const llega = entra(tr(t, T0 + 0.1, Tano + 0.5));
  // la linterna del plano de antes se va por abajo
  const va = k.sale(tr(t, T0, T0 + 0.5));
  if (va < 1) { g.save(); g.translate(860, 1560 + 700 * va); g.scale(-1, 1); linterna(g, 0, 0, 0.95, -0.62); g.restore(); }
  ondasAgudas(g, RX - 60, RY - 220, t, Tson - 0.1, Tson + 0.5, 1 - 0.75 * su(tr(t, Tno - 0.1, Toi)), 1400);
  ondasAgudas(g, RX - 60, RY - 220, t, Tsi - 0.5, Tsi - 0.1, 1, 1400);
  g.save(); g.translate(RX, mez(2400, RY, llega)); g.rotate(-0.15);
  martillito(g, 0, 0, RW, t, { rayos: su(tr(t, Tmar - 0.15, Tmar + 0.3)), golpe, vibra });
  g.restore();
  g.restore();
  k.pastilla(g, 540, 640, "1956", "", "255,215,140", su(tr(t, Tano - 0.1, Tano + 0.2)) * (1 - su(tr(t, Tmar, Tmar + 0.3))), 100);
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(10,25,24,0.55)"); vg.addColorStop(1, "rgba(10,25,24,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { golpes: GOLPES.map((x) => x[0]), si: Tsi };
