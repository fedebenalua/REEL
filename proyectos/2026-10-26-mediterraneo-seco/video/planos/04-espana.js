// «Esa sal cubriría España con una capa de casi dos kilómetros.»
// Otro sitio: un pueblo blanco. La sal sube con la cámara y se traga las casas y la montaña.
import * as k from "#kit";
import { v } from "#voz";
import { velo, salTex } from "../mundo.js";

export const desde = "esa#2";

const f = v.frase(7);
const Tesp = f.t("espana");
const Tkm = f.t("kilometros");

export function dibuja(g, t) {
  // sube hasta casi el corte: en «España» se ven las casas, y la montaña se hunde al decir los kilómetros
  const sube = k.tramo(t, f.inicio + 0.08, f.fin - 0.4);
  const shift = sube * 920;

  // cielo
  const cg = g.createLinearGradient(0, 0, 0, 1100);
  cg.addColorStop(0, "#1d4e86");
  cg.addColorStop(0.55, "#7eb6e0");
  cg.addColorStop(1, "#f2c48a");
  g.fillStyle = cg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 820, 520, 500, "sodio", 0.25);

  // montaña detrás. Baja con el pueblo (la cámara sube con la sal).
  const my = 480 + shift;
  g.beginPath();
  g.moveTo(-40, my + 520);
  g.lineTo(360, my);
  g.lineTo(780, my + 180);
  g.lineTo(1200, my + 560);
  g.closePath();
  const mg = g.createLinearGradient(0, my, 0, my + 560);
  mg.addColorStop(0, "#d7c4a4");
  mg.addColorStop(0.4, "#8fa36a");
  mg.addColorStop(1, "#5c6b3e");
  g.fillStyle = mg;
  g.fill();

  // pueblo: casas blancas con tejado rojo, una torre
  const base = 760 + shift;
  function casa(x, y, w, h) {
    const fg = g.createLinearGradient(x, y, x + w, y + h);
    fg.addColorStop(0, "#fffaf4");
    fg.addColorStop(0.7, "#f4efe8");
    fg.addColorStop(1, "#ddd4c8");
    g.fillStyle = fg;
    g.fillRect(x, y, w, h);
    g.fillStyle = "rgba(90,60,40,0.18)";
    g.fillRect(x + w - 14, y, 14, h);
    // tejado
    g.fillStyle = "#c4482e";
    g.beginPath();
    g.moveTo(x - 12, y);
    g.lineTo(x + w / 2, y - 36);
    g.lineTo(x + w + 12, y);
    g.closePath();
    g.fill();
    // ventanas
    g.fillStyle = "#9fd4e4";
    g.fillRect(x + 16, y + 28, 22, 28);
    g.fillRect(x + w - 40, y + 28, 22, 28);
    // puerta
    g.fillStyle = "#6b3a28";
    g.fillRect(x + w / 2 - 12, y + h - 48, 24, 48);
  }
  casa(140, base, 150, 170);
  casa(310, base + 20, 170, 190);
  casa(620, base - 10, 160, 180);
  casa(800, base + 30, 140, 160);
  // torre
  const tx = 500, ty = base - 220;
  g.fillStyle = "#f7f3ee";
  g.fillRect(tx, ty, 70, 280);
  g.fillStyle = "#c4482e";
  g.beginPath();
  g.moveTo(tx - 8, ty);
  g.lineTo(tx + 35, ty - 48);
  g.lineTo(tx + 78, ty);
  g.closePath();
  g.fill();
  g.fillStyle = "#2a2a2a";
  g.fillRect(tx + 28, ty - 70, 8, 28);
  // naranjo
  g.fillStyle = "#6a442c";
  g.fillRect(230, base + 80, 14, 70);
  g.fillStyle = "#2f7a3a";
  g.beginPath();
  g.arc(237, base + 70, 42, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f08a1a";
  g.beginPath(); g.arc(220, base + 64, 6, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(248, base + 58, 6, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(236, base + 84, 6, 0, Math.PI * 2); g.fill();

  // la sal: su superficie se queda a media pantalla y todo lo demás se hunde en ella
  const ys = 1080;
  g.save();
  g.beginPath();
  g.moveTo(0, ys + 30);
  g.quadraticCurveTo(540, ys - 50, 1080, ys + 20);
  g.lineTo(1080, 1960);
  g.lineTo(0, 1960);
  g.closePath();
  g.clip();
  g.drawImage(salTex, 0, ys - 40, 1080, 900);
  const sg = g.createLinearGradient(0, ys, 0, 1920);
  sg.addColorStop(0, "rgba(255,250,242,0.15)");
  sg.addColorStop(1, "rgba(210,170,140,0.35)");
  g.fillStyle = sg;
  g.fillRect(0, ys, 1080, 900);
  g.restore();
  // cristales en el borde, el frente que sube
  g.save();
  const a = k.azar(3);
  for (let i = 0; i < 18; i++) {
    const x = (i + 0.5) * 60;
    const h = 24 + (a() * 50);
    g.beginPath();
    g.moveTo(x - 16, ys + 10);
    g.lineTo(x, ys - h);
    g.lineTo(x + 16, ys + 8);
    g.closePath();
    const cg2 = g.createLinearGradient(x, ys - h, x, ys);
    cg2.addColorStop(0, "#ffffff");
    cg2.addColorStop(1, "#f0d2bc");
    g.fillStyle = cg2;
    g.fill();
  }
  g.restore();
  k.brillo(g, 540, ys + 80, 800, "blanca", 0.16);
  k.brillo(g, 180 + ((t * 220) % 760), ys + 60, 140, "blanca", 0.22);

  // en «España» el pueblo todavía se reconoce; al final solo la meseta
  if (t < Tesp) {
    // nada extra: el pueblo ya está
  }
  velo(g, 0.58);
}
