// «Envíaselo a ese amigo...»: entra en el salón con el olor puesto y el amigo recula.
import * as k from "#kit";
import { v } from "#voz";
import { salonListo, cierra, olor, perro, persona, cam } from "../mundo.js";

export const desde = (vz) => vz.frase(12).inicio - 0.04;

export function dibuja(g, t) {
  const a = desde(v), parque = v.frase(12).t("parque");
  const entra = k.suave(k.tramo(t, a + 0.02, parque - 0.25));
  const c = cam(3.45, 390 + entra * 20, -90);
  salonListo(g, c, t, 0.15);
  const x = k.mez(240, 400, entra);
  olor(g, x + 10, -30, "186,220,60", t, { n: 10, fuerza: 1.15, alfa: 0.48 });
  perro(g, { x, t, marcha: 0.7 * (1 - entra), fase: t * 2.2, cola: 0.85, cabeza: { abre: 0.55, ojo: 1, oreja: 0.2 } });
  g.save(); g.translate(530, 0); g.scale(0.58, 0.58);
  persona(g, {
    x: 0, t, recto: 1, paso: 0.2 * (1 - entra), dir: -1, fase: t, inclina: -0.18 * entra,
    mano: [-6, -158], tira: entra, boca: 0.35 * entra,
  });
  g.restore();
  cierra(g, 0.38);
}
