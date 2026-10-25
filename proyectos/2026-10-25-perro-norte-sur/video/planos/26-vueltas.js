// «da tres vueltas»: las da enteras, con polvo, y acaba mirando al semáforo.
import { v } from "#voz";
import { CX, escena, giro } from "../mundo.js";

export const desde = (v) => v.frase(15).t("tres") - 0.04;

const a0 = (v) => v.frase(15).t("tres");
const b0 = (v) => v.frase(15).t("agacha");

function polvoDe(t0, t1) {
  const lista = [];
  for (let i = 0; i < 14; i++) {
    const t = t0 + ((i + 0.5) / 14) * (t1 - t0);
    const u = (t - t0) / (t1 - t0);
    const s = giro(u, 3, CX, 68);
    lista.push({ t0: t, x: s.x, k: 0.85, v: s.dir });
  }
  return lista;
}

export function dibuja(g, t) {
  const a = a0(v), b = b0(v);
  const u = Math.max(0, Math.min(1, (t - a) / (b - a)));
  const s = giro(u, 3, CX, 68);
  escena(g, t, {
    Z: 5.6, cx: s.x + 6, cy: -78,
    hora: 0.62,
    sitio: "acera",
    luz: CX + 68 - 130,
    polvo: polvoDe(a, b),
    perro: { x: s.x, dir: s.dir, fase: s.fase, marcha: 1, agacha: 0, cola: 1, abre: 0.8 },
    velo: 0.4,
  });
}
