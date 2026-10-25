// «Envíaselo a ese amigo...»: la acera, el semáforo ya encendido y él en marcha.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena, giro } from "../mundo.js";

export const desde = (v) => v.frase(15).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(15).inicio, b = v.frase(15).t("tres");
  const u = k.tramo(t, a, b);
  const s = giro(u * 0.35, 3, CX, 68);
  escena(g, t, {
    Z: k.mez(4.3, 5.0, k.suave(u)), cx: s.x, cy: -96,
    hora: 0.62,
    sitio: "acera",
    luz: s.x - 150,
    persona: { x: s.x - 230, lejos: 0.58 },
    perro: { x: s.x, dir: s.dir, fase: s.fase, marcha: 1, agacha: 0, cola: 0.9, abre: 0.75 },
    velo: 0.4,
  });
}
