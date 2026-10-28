// «Quien fabrica el ADN lo revisa: lo mira una persona y puede decir que no.»
// La máquina pasa el pedido por la luz. Una persona lo mira. El sello cae y se queda.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, vineta, sinVista, maquina, persona, selloNo } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio - 0.04;

const f8 = v.frase(8);
const T0 = f8.inicio, Trev = f8.t("revisa"), Tmira = f8.t("mira"), Tno = f8.t("no");
const fin = v.frase(9).inicio - 0.22;

const { suave: su, tramo: tr, mez, entra } = k;

export function dibuja(g, t) {
  const tt = Math.min(t, fin);
  fondo(g, "10,140,110");
  const par = g.createRadialGradient(540, 880, 40, 540, 1000, 980);
  par.addColorStop(0, "#146858");
  par.addColorStop(1, "#04221c");
  g.fillStyle = par;
  g.fillRect(0, 400, 1080, 1200);

  // la máquina crece al entrar
  const llega = entra(su(tr(tt, T0, T0 + 0.45)));
  const s = mez(1.35, 1.9, llega);
  const tMaq = tt < Tno ? t : Tno;
  maquina(g, 480, 900, s, tMaq, 1);

  const alP = su(tr(tt, Tmira - 0.15, Tmira + 0.4));
  if (alP > 0.02) persona(g, mez(1120, 860, alP), 1560, 560, "255,176,90", t, -1);

  // barra de «lo está mirando»: un haz que cruza y se queda
  const alHaz = su(tr(tt, Trev - 0.1, Trev + 0.25)) * (1 - su(tr(tt, Tno - 0.1, Tno + 0.15)));
  if (alHaz > 0.02) k.haz(g, 540, 1120, 820, "120,255,210", alHaz, 36, false);

  // el sello cae en «no» y reposa
  const cae = entra(su(tr(tt, Tno - 0.08, Math.min(Tno + 0.28, fin))));
  if (cae > 0.01) {
    const y = mez(420, 980, cae);
    const golpe = k.pulso(t, Tno + 0.22, 0.06);
    selloNo(g, 540, y, mez(0.6, 1.15, cae), cae);
    if (golpe > 0.05) k.brillo(g, 540, 980, 500, "roja", golpe * 0.7);
  }

  sinVista(g);
  vineta(g, 0.5);
  velo(g, 0.82);
}
