// El salón, el parque y el perro son los de siempre. Aquí, la puerta y el arranque.
import * as k from "#kit";
import { polvo, velo, vineta } from "../../../perros/mundo.js";

export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;

export function cierra(g, al = 0.58) {
  velo(g, al);
  vineta(g, 0.3);
}

// Pies cerca de sy, dentro de lo que se ve.
export const encuadre = (Z, cx, sy = 1340) => ({ Z, cx, cy: (960 - sy) / Z });

// Corre a velocidad fija y frena sin tirón entre tA y tB. Antes de t0, sigue como si ya viniera corriendo.
export function frenazo(t, t0, x0, v, tA, tB) {
  if (t <= tA) return x0 + (t - t0) * v;
  const xF = x0 + (tA - t0) * v;
  if (t >= tB) return xF + v * 0.5 * (tB - tA);
  const T = tB - tA, u = (t - tA) / T;
  return xF + v * 0.5 * (u + Math.sin(Math.PI * u) / Math.PI) * T;
}

export function velocidad(xEn, t) {
  return (xEn(t) - xEn(t - 0.05)) / 0.05;
}

// Ida y vuelta a velocidad v. La vuelta es el tramo de vuelta.
export function idaVuelta(t, t0, xL, xR, v) {
  const ancho = Math.max(40, xR - xL), per = (2 * ancho) / v;
  let u = (t - t0) % per;
  if (u < 0) u += per;
  const ida = u < per / 2;
  const x = ida ? xL + (u / (per / 2)) * ancho : xR - ((u - per / 2) / (per / 2)) * ancho;
  return { x, dir: ida ? 1 : -1 };
}

export function polvoCarrera(g, t, x, dir, al = 1) {
  if (al < 0.04) return;
  const lista = [];
  for (let i = 0; i < 7; i++) {
    const tt = t - i * 0.12;
    lista.push({ t0: tt, x: x - dir * (22 + i * 16), v: dir, k: 0.75 + (i % 3) * 0.12 });
  }
  g.save();
  g.globalAlpha = al;
  polvo(g, t, lista, 0.48);
  g.restore();
}

// Rayas cortas detrás del cuerpo. Nunca cruzan la pantalla.
export function trazos(g, x, y, dir, al) {
  if (al < 0.05) return;
  g.save();
  g.strokeStyle = `rgba(255,255,255,${0.55 * al})`;
  g.lineWidth = 2.2;
  g.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    const yy = y - 18 - i * 16;
    const x0 = x - dir * (36 + i * 10);
    g.beginPath();
    g.moveTo(x0, yy);
    g.lineTo(x0 - dir * (18 + i * 4), yy + 2);
    g.stroke();
  }
  g.restore();
}

// La puerta de casa, en el suelo del salón. abre 0 cerrada, 1 abierta (se ve el canto).
export function puerta(g, x, abre) {
  const a = Math.max(0, Math.min(1, abre));
  const w = 78 * (1 - 0.82 * a);
  g.save();
  g.fillStyle = "#3a2418";
  k.redondo(g, x - 10, -214, 98, 214, 4);
  g.fill();
  const gr = g.createLinearGradient(x, 0, x + 78, 0);
  gr.addColorStop(0, "#c4894e");
  gr.addColorStop(0.45, "#a86b38");
  gr.addColorStop(1, "#6a3e1e");
  g.fillStyle = gr;
  g.fillRect(x, -202, Math.max(10, w), 198);
  g.fillStyle = "rgba(255,236,200,0.28)";
  g.fillRect(x + 4, -196, Math.max(4, w * 0.18), 186);
  g.fillStyle = "#f0d78c";
  g.beginPath();
  g.arc(x + Math.max(14, w - 12), -104, 4.2, 0, TAU);
  g.fill();
  if (a > 0.4) {
    g.fillStyle = "#1c2438";
    g.fillRect(x + w, -198, (78 - w) * 0.35 + 8, 190);
  }
  g.restore();
}
