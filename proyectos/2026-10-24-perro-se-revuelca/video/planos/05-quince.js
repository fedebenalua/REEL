// «a quince lobos les pusieron perfume»: el bote, enorme, delante del hocico.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, perfume, olor, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(3).t("quince") - 0.04;

export function dibuja(g, t) {
  const llega = k.suave(k.tramo(t, desde(v) , v.frase(3).t("perfume") + 0.15));
  const c = cam(5.4 + llega * 1.1, 450, -60 - llega * 6);
  parqueListo(g, c, t, 0.1);
  perfume(g, 390, 1.45 + llega * 0.4, t);
  olor(g, 400, -36, "255,90,170", t, { n: 10, fuerza: 0.6 + llega, alfa: 0.5 });
  perro(g, {
    x: 540, t, dir: -1, marcha: 0.2 * (1 - llega), fase: t * 2, cola: 0.85, cuelloBaja: 0.35 * llega, pitch: 0.08 * llega,
    cabeza: { ang: 0.1, abre: 0.45, ojo: 1, oreja: 0.25, olfato: 0.8 },
  });
  cierra(g, 0.48);
}
