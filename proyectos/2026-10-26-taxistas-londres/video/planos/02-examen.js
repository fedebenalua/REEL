// «No vale mirar un mapa: te las preguntan de viva voz, una ruta detrás de otra.»
// El mapa de la mesa se cierra. Las rutas se dibujan en el aire y se quedan.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = (vx) => vx.frase(4).inicio;

const RUTAS = [
  { c: "255,186,70", p: [[180, 980], [420, 620], [860, 860]] },
  { c: "255,96,120", p: [[220, 1180], [560, 760], [900, 1100]] },
  { c: "90,210,255", p: [[260, 820], [640, 1280], [880, 740]] },
  { c: "190,140,255", p: [[200, 1320], [500, 980], [840, 1280]] },
];

function punto(pts, t) {
  const x = (1 - t) * (1 - t) * pts[0][0] + 2 * (1 - t) * t * pts[1][0] + t * t * pts[2][0];
  const y = (1 - t) * (1 - t) * pts[0][1] + 2 * (1 - t) * t * pts[1][1] + t * t * pts[2][1];
  return [x, y];
}

function trazo(g, pts, u, color, ancho) {
  if (u <= 0.01) return;
  const n = 28;
  g.save();
  g.lineCap = "round";
  g.lineJoin = "round";
  g.strokeStyle = `rgba(${color},0.95)`;
  g.lineWidth = ancho;
  g.shadowColor = `rgba(${color},0.9)`;
  g.shadowBlur = 22;
  g.beginPath();
  for (let i = 0; i <= n * u; i++) {
    const [x, y] = punto(pts, i / n);
    g[i ? "lineTo" : "moveTo"](x, y);
  }
  g.stroke();
  g.restore();
  const [x, y] = punto(pts, Math.min(1, u));
  k.brillo(g, x, y, 160, color, 0.9);
}

export function dibuja(g, t) {
  const f = v.frase(4);
  const Tmapa = f.t("mapa"), Tte = f.t("te"), Tfin = v.frase(5).inicio;
  const cierra = k.suave(k.tramo(t, f.inicio, Tmapa + 0.2));
  const zoom = k.claves([
    [f.inicio, 1], [Tmapa, 1.06], [f.t("otra"), 1.22], [Tfin - 0.28, 1.28], [Tfin, 1.28],
  ]);

  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#100818");
  fondo.addColorStop(0.5, "#1a1030");
  fondo.addColorStop(1, "#241808");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.translate(540, 1000);
  g.scale(zoom(t), zoom(t));
  g.translate(-540, -1000);

  // la lámpara, quieta al final
  k.brillo(g, 250, 620, 520, "255,186,90", 0.85);
  g.save();
  g.fillStyle = "#3a2a18";
  g.fillRect(232, 640, 36, 520);
  k.redondo(g, 160, 520, 180, 70, 20);
  g.fillStyle = "#ffe0a0";
  g.fill();
  g.restore();

  // quien pregunta, de espaldas, sin cara
  g.save();
  g.translate(250, 1180);
  g.fillStyle = "#1a120c";
  g.beginPath();
  g.ellipse(0, -40, 70, 84, 0, 0, 6.28);
  g.fill();
  k.redondo(g, -120, 40, 240, 280, 80);
  g.fillStyle = "#24180f";
  g.fill();
  g.restore();

  // la mesa y el mapa que se cierra
  g.save();
  g.fillStyle = "#4a3018";
  k.redondo(g, 80, 1460, 920, 80, 16);
  g.fill();
  const mw = 780 * (1 - cierra);
  if (mw > 4) {
    g.save();
    g.translate(540, 1420);
    k.redondo(g, -mw / 2, -150, mw, 260, 10);
    g.fillStyle = "#f3e2b8";
    g.fill();
    g.strokeStyle = "rgba(40,80,120,0.7)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(-mw * 0.3, -80);
    g.lineTo(mw * 0.2, 40);
    g.stroke();
    g.restore();
  }
  g.restore();

  const paso = (Tfin - 0.55 - Tte) / RUTAS.length;
  RUTAS.forEach((r, i) => {
    const u = k.suave(k.tramo(t, Tte + i * paso * 0.72, Tte + i * paso * 0.72 + paso));
    trazo(g, r.p, u, r.c, 22);
  });
  g.restore();

  velo(g, 0.8);
}
