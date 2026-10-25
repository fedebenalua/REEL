// «Si el norte se movía»: el eje se despega un poco y se queda torcido.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(7).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(7).inicio;
  const u = k.suave(k.tramo(t, a + 0.08, a + 0.95));
  const ang = k.mez(0, 0.48, u);
  escena(g, t, {
    Z: 6.6, cx: CX + 8, cy: -64,
    hora: 0.28,
    rosa: { x: CX, ang, fuerza: 0.85, radio: 150 },
    perro: { x: CX, agacha: 1, cola: 0.55 },
    ejes: [{ x: CX + 4, y: -44, ang, largo: 88, fuerza: 0.9, ns: false, plano: 0.9 }],
    velo: 0.48,
  });
}
