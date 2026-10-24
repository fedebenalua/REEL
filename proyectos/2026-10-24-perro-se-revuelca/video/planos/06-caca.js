// «Caca de oveja y de caballo: ni se rozaron.» Pasa de largo, con la nariz alta.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, caca, perro, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio - 0.04;

export function dibuja(g, t) {
  const a = desde(v), roz = v.frase(4).t("rozaron");
  const pasa = k.suave(k.tramo(t, a + 0.15, roz - 0.05));
  const c = cam(4.4, k.mez(340, 500, pasa), -62);
  parqueListo(g, c, t, 0.08);
  caca(g, 300, "oveja");
  caca(g, 460, "caballo");
  const x = k.mez(200, 620, pasa);
  perro(g, {
    x, t, marcha: 0.85 * (1 - k.suave(k.tramo(t, roz - 0.15, roz + 0.2))), fase: t * 2.4, cola: 0.45,
    cuelloBaja: 0, pitch: 0, cabeza: { ang: -0.35, abre: 0.15, ojo: 0, oreja: 0.05 },
  });
  cierra(g, 0.4);
}
