// «En lo que sí hay datos, se está haciendo la cama.» Aplasta la manta y se tumba.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(10).inicio;

const f = v.frase(10);
const fin = v.frase(11).inicio;

export function dibuja(g, t) {
  const u = k.tramo(t, f.t("datos"), f.t("cama") - 0.05);
  const tumba = k.suave(k.tramo(t, f.t("cama") - 0.12, f.fin - 0.2));
  const s = m.giro(u * (1 - tumba), 1.7, m.CX, 68);
  const x = k.mez(s.x, m.CX, tumba);
  const Z = k.claves([[f.inicio, 5.6], [f.t("haciendo"), 6.6], [f.t("cama"), 7.2], [fin, 6.8]])(t);
  const c = { Z, cx: x, cy: -50 };
  m.salon(g, c, t, 0.25);
  m.ponVista(g, c);
  m.manta(g, m.CX, u);
  m.surco(g, m.CX, u, 1.7, 68, "rgba(40,20,80,0.35)", 6);
  m.perro(g, {
    x, dir: tumba > 0.5 ? 1 : s.dir, fase: s.fase, marcha: (1 - tumba) * 0.95, t,
    tumbado: tumba, cola: 0.7 * (1 - tumba * 0.4), escala: tumba > 0.2 ? 1 : s.escala,
    cabeza: { abre: 0.2 * (1 - tumba), ojo: tumba, ang: -0.04 },
  });
  m.rellena(g, 0.42);
}
