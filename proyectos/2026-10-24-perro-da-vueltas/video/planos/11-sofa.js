// «Envíaselo...» Tres vueltas en el sofá y se le tumba encima. La cámara entra, sin corte.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(11).inicio;

const f = v.frase(11);

export function dibuja(g, t) {
  const u = k.tramo(t, f.t("tres") - 0.05, f.t("tumba") - 0.18);
  const tumba = k.suave(k.tramo(t, f.t("tumba") - 0.04, f.t("encima") + 0.08));
  const entra = k.suave(k.tramo(t, f.t("encima") - 0.02, f.fin + 0.4));
  const s = m.giro(Math.max(0, Math.min(1, u)), 3, 490, 32);
  const x = k.mez(s.x, 560, tumba);
  const Z = k.claves([
    [f.inicio, 4.55], [f.t("vueltas"), 5.15], [f.t("sofa"), 5.3],
    [f.t("tumba"), 5.5], [f.t("encima"), 6.15], [f.fin + 0.4, 6.35],
  ])(t);
  const c = { Z, cx: k.mez(x + 50, 575, entra), cy: k.mez(-104, -96, entra) };
  m.salon(g, c, t, 0.35);
  m.ponVista(g, c);
  m.sofaCerca(g, 350);
  m.amigo(g, 610, -64, t);
  if (tumba < 0.85) m.surco(g, 490, Math.max(0, u), 3, 32, "rgba(12,70,64,0.5)", 5);
  m.perro(g, {
    x, y: -64, dir: tumba > 0.4 ? 1 : s.dir,
    fase: tumba > 0.5 ? 0.2 : s.fase,
    marcha: (1 - tumba) * (u > 0.02 ? 1 : 0.2), t,
    tumbado: tumba, cola: 0.7 * (1 - tumba * 0.35),
    escala: 0.9,
    cabeza: { abre: 0.3 * (1 - tumba), ojo: tumba },
  });
  m.rellena(g, 0.42);
}
