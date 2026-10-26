// «Si va tenso y con miedo, eso ya es otra cosa.»
// De frente, orejas atrás, cabeza baja, cola pegada, ojos abiertos. No es la cara de antes.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(10).inicio - 2 / 60;

const f10 = v.frase(10);

export function dibuja(g, t) {
  const acerca = k.suave(k.tramo(t, f10.t("miedo") - 0.05, f10.t("cosa") + 0.15));
  const Z = k.mez(5.35, 6.05, acerca);
  const temblor = Math.sin(t * 17) * 1.4;
  const c = m.encuadre(Z, 430 + temblor, 1330);
  m.salon(g, c, t, 1.15);
  m.ponVista(g, c);
  m.perro(g, {
    x: 430, dir: 1, t, fase: 0.2, marcha: 0,
    cola: 0.02, colaTuck: 1,
    pitch: 0.04,
    cabeza: { ang: 0.48, abre: 0, ojo: 0, oreja: 0.65 },
  });
  m.cierra(g, 0.55);
}
