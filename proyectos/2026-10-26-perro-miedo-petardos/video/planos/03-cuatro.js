// «Y solo uno de cada cuatro lo llama miedo.» El perro tiembla; la mano mira el móvil.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(3).t("y") - 0.04;
const f = v.frase(3);
const fin = v.frase(4).t("no") - 0.04;
const T4 = f.t("cuatro");

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const u = k.suave(k.tramo(t, f.inicio, T4 + 0.2));
  const Z = k.mez(4.8, 5.5, u);
  const x = 250;
  const c = { Z, cx: x + 70, cy: m.pies(Z, 1340) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.perro(g, {
    x: x + m.temblor(t, 1 - q), t, dir: -1, marcha: 0, fase: 0.2,
    cola: 0.02, pitch: 0.05, cabeza: { ang: -0.36, oreja: -0.85, ojo: 0 },
  });
  const entra = k.suave(k.tramo(t, f.inicio + 0.05, T4));
  const mx = k.mez(x + 210, x + 150, entra);
  const my = -92;
  m.mano(g, mx, my, -1.15, 1.55);
  m.telefono(g, mx - 2, my - 28, 1.45);
  m.sinVista(g);
  const al = k.suave(k.tramo(t, T4 - 0.05, T4 + 0.25));
  m.cifra(g, 540, 600, "1/4", al, "255,176,140");
  m.cierra(g, 0.5);
}
