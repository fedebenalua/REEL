// «The next year, he put the company up for sale.»
// Otro sitio: una caja. El mando cae dentro. En «sale» la tapa ya ha cerrado y reposa.
import * as k from "#kit";
import { v } from "#voz";
import { mando, caja, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio - 0.04;

const f = v.frase(9);
const Tput = f.t("put"), Tsale = f.t("sale");

export function dibuja(g, t) {
  g.fillStyle = "#16120e"; g.fillRect(0, 0, 1080, 1920);
  const suelo = g.createLinearGradient(0, 1100, 0, 1920);
  suelo.addColorStop(0, "#3a2a1c"); suelo.addColorStop(1, "#120e0a");
  g.fillStyle = suelo; g.fillRect(0, 1180, 1080, 740);
  k.brillo(g, 540, 600, 700, "255,190,120", 0.18);

  const cae = k.suave(k.tramo(t, f.inicio + 0.02, Tput + 0.28));
  const y = k.mez(640, 1260, cae);
  const tapa = k.suave(k.tramo(t, Tput + 0.22, Tsale + 0.12));
  const al = 1 - k.suave(k.tramo(t, Tput + 0.12, Tput + 0.62));
  if (al > 0.02) mando(g, 540, y, k.mez(620, 420, cae), "core", { al, ang: k.mez(-0.18, 0.04, cae), lcd: 0.4 });
  caja(g, 540, 1320, 820, tapa);
  velo(g, 0.55);
}
