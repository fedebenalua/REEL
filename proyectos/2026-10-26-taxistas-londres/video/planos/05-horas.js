// «Quien aprobó había practicado el doble de horas cada semana.»
// Dos torres. La de quien aprueba llega al doble y se queda.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = (vx) => vx.frase(9).inicio;

const COLORES = ["#ff5d78", "#ffb03a", "#7c6bff", "#3ad0ff", "#ffe07a", "#ff7a3a", "#5ad6a0", "#ff4d8a"];

function bloque(g, cam, x, y, color) {
  const a = k.proyecta(cam, [x - 0.38, y, 0.32]);
  const b = k.proyecta(cam, [x + 0.38, y + 0.34, 0.32]);
  const c = k.proyecta(cam, [x + 0.38, y + 0.34, -0.32]);
  const d = k.proyecta(cam, [x - 0.38, y, -0.32]);
  const e = k.proyecta(cam, [x - 0.38, y + 0.34, -0.32]);
  const f = k.proyecta(cam, [x + 0.38, y, 0.32]);
  if (!a || !b || !c || !d || !e || !f) return;
  const cara = (pts, col) => {
    g.beginPath();
    pts.forEach((p, i) => g[i ? "lineTo" : "moveTo"](p.x, p.y));
    g.closePath();
    g.fillStyle = col;
    g.fill();
  };
  cara([d, c, e, a], k.mezColor(color, "#2a140c", 0.35));
  cara([a, b, c, d], color);
  cara([f, b, c, d], k.mezColor(color, "#fff4d2", 0.35));
}

export function dibuja(g, t) {
  const f = v.frase(9);
  const Td = f.t("doble"), Tfin = v.frase(10).inicio;
  const cam = k.ruta([
    [f.inicio, { pos: [0.2, 0.6, 3.3], mira: [0.55, 1.1, 0] }],
    [Td, { pos: [0.7, 1.5, 2.7], mira: [0.85, 1.8, 0] }],
    [f.t("semana"), { pos: [0.85, 2.0, 2.55], mira: [0.9, 2.15, 0] }],
    [Tfin - 0.05, { pos: [0.85, 2.0, 2.55], mira: [0.9, 2.15, 0] }],
  ])(t);

  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#1a0c18");
  fondo.addColorStop(0.45, "#3a1840");
  fondo.addColorStop(1, "#1a1008");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 1500, 900, "255,150,60", 0.35);

  // la mesa
  const m1 = k.proyecta(cam, [-2.2, 0, 1.2]);
  const m2 = k.proyecta(cam, [2.4, 0, 1.2]);
  const m3 = k.proyecta(cam, [2.4, 0, -1.2]);
  const m4 = k.proyecta(cam, [-2.2, 0, -1.2]);
  if (m1 && m2 && m3 && m4) {
    g.beginPath();
    [m1, m2, m3, m4].forEach((p, i) => g[i ? "lineTo" : "moveTo"](p.x, p.y));
    g.closePath();
    g.fillStyle = "#6a3a22";
    g.fill();
  }

  for (let i = 0; i < 4; i++) bloque(g, cam, -0.95, 0.02 + i * 0.36, COLORES[i]);
  const hueco = (Td - f.inicio - 0.32) / 7;
  for (let i = 0; i < 8; i++) {
    const u = k.entra(k.tramo(t, f.inicio + i * hueco, f.inicio + i * hueco + 0.32));
    if (u <= 0) continue;
    const y = k.mez(3.2, 0.02 + i * 0.36, u);
    bloque(g, cam, 0.95, y, COLORES[i]);
  }
  velo(g, 0.75);
}
