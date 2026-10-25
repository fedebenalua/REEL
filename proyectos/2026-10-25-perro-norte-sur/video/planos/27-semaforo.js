// «se agacha mirando al semáforo»: ya está el semáforo, y él se agacha delante.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena, giro } from "../mundo.js";

export const desde = (v) => v.frase(15).t("agacha") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(15).t("agacha");
  const u = k.suave(k.tramo(t, a - 0.05, a + 0.38));
  const s = giro(1, 3, CX, 68);
  const miraIzquierda = s.dir < 0;
  escena(g, t, {
    Z: k.mez(6.2, 8.4, Math.max(u, 0.35)), cx: s.x + (miraIzquierda ? 36 : -36), cy: -56,
    hora: 0.62,
    sitio: "acera",
    luz: s.x + (miraIzquierda ? -118 : 118),
    persona: { x: s.x + (miraIzquierda ? 210 : -210), lejos: 0.52 },
    perro: { x: s.x, dir: s.dir, fase: 0, marcha: 0, agacha: Math.max(u, 0.55), cola: 0.9, abre: 0.15 },
    velo: 0.46,
  });
}
