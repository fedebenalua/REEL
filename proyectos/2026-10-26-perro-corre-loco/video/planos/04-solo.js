// «Sobre todo si ha pasado el día solo, sin nada que hacer.»
// Empieza en la ventana, de mañana. La luz pasa a la tarde y la cámara baja hasta él, que camina solo.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "sobre";

const f5 = v.frase(5);
const Tnada = f5.t("nada");

export function dibuja(g, t) {
  const baja = k.suave(k.tramo(t, f5.inicio + 0.08, f5.t("dia") + 0.15));
  const u = k.suave(k.tramo(t, f5.inicio + 0.15, Tnada + 0.1));
  const hora = u * 1;
  const anda = 1 - k.suave(k.tramo(t, Tnada + 0.08, f5.fin - 0.12));
  const x = 520 - u * 90;
  const Z = k.mez(3.3, 4.7, baja);
  const cy = k.mez(-210, (960 - 1320) / Z, baja);
  const c = { Z, cx: k.mez(280, x - 10, baja), cy };
  m.salon(g, c, t, hora);
  m.ponVista(g, c);
  m.perro(g, {
    x, dir: -1, t,
    fase: (t - f5.inicio) * 1.6 * anda,
    marcha: 0.9 * anda,
    cola: 0.25 + 0.15 * (1 - anda),
    cabeza: { ang: k.mez(-0.35, 0.02, baja) * (0.35 + 0.65 * anda) + (1 - anda) * -0.2, abre: 0.06, ojo: 0, oreja: 0.08 },
  });
  m.cierra(g, 0.38 + 0.16 * hora);
}
