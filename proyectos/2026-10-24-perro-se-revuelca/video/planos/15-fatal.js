// «aunque a ti te huela fatal»: la nube llega a la persona, que se tapa.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, olor, perroRueda, persona, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(10).t("aunque") - 0.04;

export function dibuja(g, t) {
  const a = desde(v);
  const llega = k.suave(k.tramo(t, a, a + 0.7));
  const c = cam(3.7, 440, -80);
  parqueListo(g, c, t, 0.15);
  perroRueda(g, 340, t, { escala: 0.9 });
  olor(g, k.mez(360, 560, llega), -30, "186,220,60", t, { n: 14, fuerza: 1.1 + llega * 0.5, alfa: 0.5 });
  g.save(); g.translate(620, 0); g.scale(0.62, 0.62);
  persona(g, {
    x: 0, t, recto: 1, paso: 0, dir: -1, inclina: -0.12 * llega,
    mano: [-8, -155], tira: llega, boca: 0.45 * llega,
  });
  g.restore();
  cierra(g, 0.4);
}
