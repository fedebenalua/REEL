// El parque, el salón y el perro son los de siempre. Aquí solo lo de este vídeo: el hueso, el plato,
// el hoyo, la tierra que sale, la pata de la presa, el cojín y el calcetín.
import * as k from "#kit";
import {
  parque, salon, ponVista, sinVista, velo, vineta, perro, persona, ambiente,
} from "../../../perros/mundo.js";

export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
const { azar } = k;

export const CX = 460;

const TROZOS = Array.from({ length: 10 }, (_, i) => {
  const a = azar(40 + i * 13);
  return {
    ang: -2.55 + a() * 1.15,
    vel: 70 + a() * 90,
    tam: 5.2 + a() * 4.8,
    retraso: a(),
    giro: a() * 5,
    col: a() > 0.45 ? "#d08948" : "#7a3e22",
  };
});

export function cierra(g, al = 0.42) {
  velo(g, al);
  vineta(g, 0.26);
}

export function tierra(g, x, y, t, fuerza = 1) {
  if (fuerza < 0.02) return;
  g.save();
  for (const p of TROZOS) {
    const u = (t * 2.6 + p.retraso) % 1;
    if (u > 0.9) continue;
    const px = x + Math.cos(p.ang) * p.vel * u * fuerza;
    const py = y + Math.sin(p.ang) * p.vel * u * fuerza + 95 * u * u;
    const s = p.tam * (1 - u * 0.35) * (0.65 + 0.35 * fuerza);
    g.globalAlpha = 1 - u * 0.35;
    g.fillStyle = p.col;
    g.beginPath();
    g.ellipse(px, py, s * 1.15, s * 0.72, p.giro + u * 2, 0, TAU);
    g.fill();
    g.fillStyle = "rgba(255,220,170,0.35)";
    g.beginPath();
    g.ellipse(px - s * 0.2, py - s * 0.15, s * 0.4, s * 0.22, 0, 0, TAU);
    g.fill();
  }
  g.restore();
}

export function lecho(g, x) {
  g.save();
  const mg = g.createLinearGradient(x - 80, -10, x + 80, 16);
  mg.addColorStop(0, "#e2a864");
  mg.addColorStop(0.5, "#c47c3c");
  mg.addColorStop(1, "#8d4e24");
  g.fillStyle = mg;
  g.beginPath(); g.ellipse(x, 4, 78, 26, 0, 0, TAU); g.fill();
  g.fillStyle = "rgba(90,40,16,0.35)";
  g.beginPath(); g.ellipse(x + 10, 8, 50, 14, 0, 0, TAU); g.fill();
  g.restore();
}

export function hoyo(g, x, prof = 0.7) {
  const p = Math.max(0, Math.min(1, prof));
  g.save();
  g.fillStyle = "rgba(40,24,10,0.35)";
  g.beginPath(); g.ellipse(x + 6, 6, 40, 12, 0, 0, TAU); g.fill();
  const mg = g.createLinearGradient(x - 30, -20, x + 36, 8);
  mg.addColorStop(0, "#e0a05a");
  mg.addColorStop(0.5, "#a86432");
  mg.addColorStop(1, "#6d3d1c");
  g.fillStyle = mg;
  g.beginPath();
  g.ellipse(x + 40, -8, 38, 22, -0.15, 0, TAU);
  g.fill();
  g.fillStyle = "#c98448";
  g.beginPath(); g.ellipse(x + 22, -8, 12, 6, -0.4, 0, TAU); g.fill();
  g.fillStyle = "#2a140c";
  g.beginPath(); g.ellipse(x, 3, 32 + 6 * p, 13 + 2 * p, 0, 0, TAU); g.fill();
  const hg = g.createRadialGradient(x - 4, 1, 2, x, 4, 18);
  hg.addColorStop(0, "#120804");
  hg.addColorStop(1, "#3a2014");
  g.fillStyle = hg;
  g.beginPath(); g.ellipse(x, 5, 18 + 4 * p, 8, 0, 0, TAU); g.fill();
  g.restore();
}

export function hueso(g, x, y, al = 1, ang = -0.25, escala = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(escala, escala);
  g.globalAlpha = al;
  g.fillStyle = "rgba(40,24,8,0.28)";
  g.beginPath(); g.ellipse(4, 8, 22, 6, 0, 0, TAU); g.fill();
  const extremo = (ex) => {
    const gr = g.createRadialGradient(ex - 3, -3, 1, ex, 0, 11);
    gr.addColorStop(0, "#fff6e4");
    gr.addColorStop(0.55, "#f0d7b0");
    gr.addColorStop(1, "#c49a6a");
    g.fillStyle = gr;
    g.beginPath(); g.arc(ex, -1, 9.5, 0, TAU); g.fill();
    g.beginPath(); g.arc(ex + (ex < 0 ? -4 : 4), 3, 7.2, 0, TAU); g.fill();
  };
  extremo(-16);
  extremo(16);
  const pg = g.createLinearGradient(0, -7, 0, 7);
  pg.addColorStop(0, "#fff8ec");
  pg.addColorStop(0.45, "#f3ddb8");
  pg.addColorStop(1, "#d7b48a");
  g.fillStyle = pg;
  k.redondo(g, -14, -6.5, 28, 13, 6);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 1.4;
  g.beginPath(); g.moveTo(-8, -4); g.quadraticCurveTo(0, -6, 8, -3.5); g.stroke();
  g.restore();
}

export function plato(g, x, lleno = 1) {
  g.save();
  g.fillStyle = "rgba(20,40,10,0.3)";
  g.beginPath(); g.ellipse(x + 2, 5, 30, 8, 0, 0, TAU); g.fill();
  const gr = g.createLinearGradient(x - 24, -28, x + 24, 4);
  gr.addColorStop(0, "#ff7a55");
  gr.addColorStop(0.45, "#ef4d3a");
  gr.addColorStop(1, "#b4232c");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x - 28, -16);
  g.quadraticCurveTo(x - 24, 4, x, 6);
  g.quadraticCurveTo(x + 24, 4, x + 28, -16);
  g.lineTo(x + 22, -18);
  g.quadraticCurveTo(x, -2, x - 22, -18);
  g.closePath();
  g.fill();
  g.fillStyle = "#fff1c8";
  g.globalAlpha = 0.35;
  g.beginPath(); g.ellipse(x - 8, -8, 8, 12, -0.4, 0, TAU); g.fill();
  g.globalAlpha = 1;
  if (lleno > 0.05) {
    g.fillStyle = "#e8b15a";
    g.beginPath(); g.ellipse(x, -18, 20 * lleno, 9, 0, 0, TAU); g.fill();
    const a = azar(9);
    for (let i = 0; i < 16; i++) {
      const ang = a() * TAU, r = Math.sqrt(a()) * 15;
      g.fillStyle = a() > 0.5 ? "#f2c56a" : "#c9843a";
      g.beginPath();
      g.ellipse(x + Math.cos(ang) * r, -20 + Math.sin(ang) * r * 0.4, 3.1, 2.1, ang, 0, TAU);
      g.fill();
    }
  }
  g.strokeStyle = "rgba(255,255,255,0.5)";
  g.lineWidth = 2;
  g.beginPath(); g.ellipse(x, -16, 24, 7.5, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
  g.restore();
}

// Una pata de presa: hueso con carne. Para el escondite del lobo, no un juguete.
export function pata(g, x, y, al = 1, ang = -0.4, escala = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(escala, escala);
  g.globalAlpha = al;
  g.fillStyle = "rgba(40,16,8,0.3)";
  g.beginPath(); g.ellipse(2, 10, 26, 7, 0, 0, TAU); g.fill();
  const cg = g.createLinearGradient(0, -10, 0, 10);
  cg.addColorStop(0, "#ffb0a0");
  cg.addColorStop(0.4, "#e25848");
  cg.addColorStop(1, "#8e2430");
  g.fillStyle = cg;
  g.beginPath();
  g.moveTo(-6, -8);
  g.quadraticCurveTo(18, -14, 28, -2);
  g.quadraticCurveTo(30, 8, 16, 9);
  g.quadraticCurveTo(4, 6, -4, 8);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.beginPath(); g.ellipse(8, -4, 8, 3, -0.4, 0, TAU); g.fill();
  const og = g.createLinearGradient(-30, -8, -8, 8);
  og.addColorStop(0, "#fff6e6");
  og.addColorStop(1, "#e4c49a");
  g.fillStyle = og;
  k.redondo(g, -30, -5, 26, 10, 5);
  g.fill();
  g.beginPath(); g.arc(-28, 0, 7, 0, TAU); g.fill();
  g.restore();
}

export function monton(g, x, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha = al;
  g.fillStyle = "rgba(40,20,8,0.3)";
  g.beginPath(); g.ellipse(x, 6, 34, 10, 0, 0, TAU); g.fill();
  const mg = g.createLinearGradient(x - 20, -28, x + 20, 4);
  mg.addColorStop(0, "#e7b56a");
  mg.addColorStop(1, "#8d4e28");
  g.fillStyle = mg;
  g.beginPath(); g.ellipse(x, -4, 30, 14, 0, 0, TAU); g.fill();
  g.fillStyle = "#c45a42";
  g.beginPath(); g.ellipse(x - 6, -10, 16, 9, -0.2, 0, TAU); g.fill();
  g.fillStyle = "#f0d2aa";
  g.beginPath(); g.ellipse(x + 8, -6, 7, 4, 0.4, 0, TAU); g.fill();
  g.fillStyle = "#fff4e0";
  g.beginPath(); g.arc(x + 14, -2, 5, 0, TAU); g.fill();
  g.restore();
}

export function cojin(g, x, y = 0, w = 150, h = 70) {
  g.save();
  g.fillStyle = "rgba(20,40,20,0.28)";
  g.beginPath(); g.ellipse(x + w * 0.45, y + 6, w * 0.42, 12, 0, 0, TAU); g.fill();
  const gr = g.createLinearGradient(x, y - h, x, y);
  gr.addColorStop(0, "#7cf0e0");
  gr.addColorStop(0.5, "#2ec4b0");
  gr.addColorStop(1, "#148a7c");
  g.fillStyle = gr;
  k.redondo(g, x, y - h, w, h, 22);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  k.redondo(g, x + 12, y - h + 8, w - 24, 14, 8);
  g.fill();
  g.strokeStyle = "rgba(8,60,54,0.35)";
  g.lineWidth = 3;
  g.beginPath(); g.moveTo(x + 18, y - h * 0.45); g.quadraticCurveTo(x + w * 0.5, y - h * 0.2, x + w - 18, y - h * 0.5); g.stroke();
  g.restore();
}

export function calcetin(g, x, y, ang = 0.4, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.globalAlpha = al;
  g.fillStyle = "#f7f4ef";
  k.redondo(g, -8, -36, 18, 40, 8);
  g.fill();
  g.fillStyle = "#e23b3b";
  g.fillRect(-8, -30, 18, 5);
  g.fillRect(-8, -20, 18, 5);
  g.fillStyle = "#f7f4ef";
  g.beginPath();
  g.moveTo(-8, -4);
  g.lineTo(10, -4);
  g.quadraticCurveTo(28, -2, 30, 8);
  g.lineTo(8, 10);
  g.quadraticCurveTo(-6, 8, -8, -2);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(0,0,0,0.06)";
  g.fillRect(-8, -36, 5, 40);
  g.restore();
}

export function cavando(g, x, t, vel = 3.2) {
  return perro(g, {
    x, fase: t * vel, marcha: 0, t, cava: 1, cola: 0.92,
    cabeza: { ang: 0.08, abre: 0.12, ojo: 0.06, oreja: 0.25 },
  });
}

export function tapando(g, x, t) {
  const u = (t * 2.6) % 1;
  const ang = u < 0.32 ? (u / 0.32) * 0.72 : 0.72 * (1 - (u - 0.32) / 0.68);
  return perro(g, {
    x, fase: 0.08, marcha: 0, t, cola: 0.45, cuelloBaja: 0.82,
    cabeza: { ang, abre: 0, ojo: 0.12, oreja: 0.05 },
  });
}

export function pantalla(cam, x, y) {
  const z = cam.Z;
  return [540 + (x - cam.cx) * z, 960 + (y - cam.cy) * z];
}

export { parque, salon, ponVista, sinVista, perro, persona, ambiente };
