// Hook A: ropa en cascada sobre el radiador gigante.
import * as k from "#kit";
import { v } from "#voz";
import {
  vista, camino2D, pared, suelo, radiador, prenda, lluviaBilletes, velo, vineta,
  T_ropa, T_radiador, T_gesto,
} from "../mundo.js";

const { suave: su, tramo: tr } = k;

export const desde = 0;

const cam = camino2D([
  [0, [1.05, 0, 80]],
  [T_ropa, [1.15, 0, 40]],
  [T_radiador, [1.35, 0, 20]],
  [T_gesto, [1.4, 0, 10]],
  [v.frase(2).fin, [1.45, 0, 0]],
]);

export function dibuja(g, t) {
  pared(g, "255,120,70");
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  suelo(g);

  const cae = su(tr(t, 0.05, T_ropa + 0.15));
  const tapa = su(tr(t, T_ropa - 0.1, T_radiador + 0.2));
  const bloqueado = tapa * 0.95;

  radiador(g, t, { calor: 0.95, bloqueado, w: 560, h: 300 });

  // cascada de ropa
  const items = [
    ["camiseta", -180, -900, 0.4],
    ["pantalon", 40, -1100, -0.3],
    ["camiseta", 160, -1300, 0.6],
    ["calcetin", -60, -1000, -0.8],
    ["pantalon", -220, -1200, 0.2],
    ["calcetin", 200, -950, 1.1],
  ];
  for (let i = 0; i < items.length; i++) {
    const [tipo, x0, y0, rot0] = items[i];
    const delay = i * 0.08;
    const u = su(tr(t, delay, T_ropa + 0.05 + delay * 0.3));
    const y = mez(y0, -40 + (i % 3) * 25, u);
    const x = mez(x0, -80 + i * 35, u);
    const rot = mez(rot0, 0.15 * Math.sin(i), u);
    prenda(g, tipo, x, y, rot, 1.1, Math.min(1, cae + 0.3));
  }

  lluviaBilletes(g, t, T_radiador - 0.2, 12, 17);
  lluviaBilletes(g, t, T_gesto - 0.3, 8, 23);

  velo(g, 0.5);
  vineta(g, 0.45);
}

function mez(a, b, u) { return a + (b - a) * u; }
