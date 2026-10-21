// Hook B: cámara dentro del calor; ondas chocan contra la ropa y rebotan en billetes.
import * as k from "#kit";
import { v } from "#voz";
import {
  vista, sinVista, camino2D, pared, radiador, prenda, billete, velo, vineta,
  T_ropa, T_radiador, T_gesto, colCalor,
} from "../mundo.js";

const { suave: su, tramo: tr, azar } = k;

export const desde = 0;

const cam = camino2D([
  [0, [2.2, 0, 120]],
  [T_ropa, [1.6, 0, 40]],
  [T_radiador, [1.25, 0, 10]],
  [T_gesto, [1.2, 0, 0]],
  [v.frase(2).fin, [1.15, 0, -10]],
]);

export function dibuja(g, t) {
  pared(g, "255,90,50");
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);

  // calor de cerca: ondas enormes
  const col = colCalor(1);
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; i < 10; i++) {
    const ph = t * 3 + i * 0.7;
    const x = -200 + i * 45;
    g.strokeStyle = `rgba(${col},${0.55})`;
    g.lineWidth = 16;
    g.beginPath();
    g.moveTo(x, 200);
    g.bezierCurveTo(x - 40, 80, x + 50, -40, x + Math.sin(ph) * 30, -280);
    g.stroke();
  }
  g.restore();

  radiador(g, t, { calor: 1, bloqueado: su(tr(t, T_ropa, T_radiador)), w: 600, h: 320 });

  // muro de ropa que llega
  const muro = su(tr(t, 0.1, T_ropa + 0.2));
  const tipos = ["camiseta", "pantalon", "camiseta", "calcetin", "pantalon", "camiseta"];
  for (let i = 0; i < tipos.length; i++) {
    const x = -220 + i * 85;
    const y = mez(-600, -20 + (i % 2) * 30, muro);
    prenda(g, tipos[i], x, y, 0.1 * Math.sin(i + t), 1.2, muro);
  }

  // billetes que rebotan al chocar
  const r = azar(9);
  const boom = su(tr(t, T_radiador - 0.15, T_radiador + 0.4));
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.4;
    const dist = boom * (180 + r() * 220);
    billete(g, Math.cos(a) * dist, -40 + Math.sin(a) * dist * 0.6, a + t, 1, boom);
  }

  if (t < 0.4) {
    sinVista(g);
    k.fogonazo(g, 540, 1000, tr(t, 0, 0.35));
  }

  velo(g, 0.55);
  vineta(g, 0.5);
}

function mez(a, b, u) { return a + (b - a) * u; }
