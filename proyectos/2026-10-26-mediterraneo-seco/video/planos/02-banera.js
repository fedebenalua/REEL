// «Sin esa entrada, el mar baja medio metro cada año: una bañera.»
// Otro sitio: un cuarto de baño. La bañera está llena al entrar y se vacía entera antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = "sin";

const f = v.frase(4);
const Tbaja = f.t("baja");
const Tbanera = f.t("banera");

const az = k.azar(9);
const losetas = [];
for (let i = 0; i < 40; i++) losetas.push(az());

export function dibuja(g, t) {
  // se vacía desde «baja» y ya está quieta en «bañera»
  const vacia = k.suave(k.tramo(t, Tbaja - 0.05, Tbanera - 0.15));
  const nivel = 1 - vacia; // 1 llena, 0 vacía

  // pared: arriba oscura (el subtítulo), abajo cálida
  const pg = g.createLinearGradient(0, 0, 0, 1920);
  pg.addColorStop(0, "#1b3a4a");
  pg.addColorStop(0.28, "#24596a");
  pg.addColorStop(0.5, "#e7c4a4");
  pg.addColorStop(1, "#c98462");
  g.fillStyle = pg;
  g.fillRect(0, 0, 1080, 1920);

  // luz de una ventana, a la derecha
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 860, 780, 900, "blanca", 0.28);
  k.brillo(g, 860, 780, 420, "sodio", 0.18);
  g.restore();

  // suelo de baldosas, en perspectiva
  g.save();
  for (let row = 0; row < 5; row++) {
    const y = 1500 + row * 70;
    for (let col = 0; col < 8; col++) {
      const x = 40 + col * 130;
      const tono = losetas[(row * 8 + col) % losetas.length];
      g.fillStyle = tono > 0.5 ? "#e7b08a" : "#d9896a";
      g.fillRect(x, y, 122, 62);
      g.strokeStyle = "rgba(90,40,30,0.35)";
      g.strokeRect(x, y, 122, 62);
    }
  }
  g.restore();

  // la bañera, grande, de tres cuartos
  const cx = 540, cy = 1180, rx = 390, ry = 210;
  // exterior
  g.save();
  g.beginPath();
  g.ellipse(cx, cy + 30, rx + 36, ry + 28, 0, 0, Math.PI * 2);
  const eg = g.createLinearGradient(cx - rx, cy, cx + rx, cy);
  eg.addColorStop(0, "#f7f4ef");
  eg.addColorStop(0.45, "#ffffff");
  eg.addColorStop(1, "#d9d3cb");
  g.fillStyle = eg;
  g.fill();
  // borde
  g.beginPath();
  g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  g.fillStyle = "#fbfaf7";
  g.fill();
  // interior oscuro
  g.beginPath();
  g.ellipse(cx, cy + 16, rx - 36, ry - 28, 0, 0, Math.PI * 2);
  const ig = g.createRadialGradient(cx - 40, cy, 40, cx, cy + 20, rx);
  ig.addColorStop(0, "#6f8ea4");
  ig.addColorStop(1, "#243846");
  g.fillStyle = ig;
  g.fill();
  g.restore();

  // el agua, que baja
  if (nivel > 0.02) {
    const ay = cy + 16 + (1 - nivel) * (ry - 50);
    const arx = (rx - 46) * (0.72 + 0.28 * nivel);
    const ary = (ry - 40) * (0.55 + 0.45 * nivel) * Math.max(0.25, nivel);
    g.save();
    g.beginPath();
    g.ellipse(cx, cy + 16, rx - 36, ry - 28, 0, 0, Math.PI * 2);
    g.clip();
    g.beginPath();
    g.ellipse(cx, ay, arx, Math.max(8, ary), 0, 0, Math.PI * 2);
    const ag = g.createLinearGradient(0, ay - ary, 0, ay + 80);
    ag.addColorStop(0, "#bff4ee");
    ag.addColorStop(0.4, "#1aa0b8");
    ag.addColorStop(1, "#0a4e68");
    g.fillStyle = ag;
    g.fill();
    g.globalCompositeOperation = "screen";
    g.globalAlpha = 0.4;
    g.drawImage(k.causticas, cx - arx + (t * 30) % 50, ay - ary, arx * 2, ary * 2 + 40);
    g.restore();
    // marca del nivel de cuando estaba llena
    g.save();
    g.strokeStyle = "rgba(255,255,255,0.55)";
    g.lineWidth = 4;
    g.beginPath();
    g.ellipse(cx, cy - ry * 0.35, rx * 0.72, ry * 0.22, 0, Math.PI, Math.PI * 2);
    g.stroke();
    g.restore();
  }

  // desagüe y última gota
  g.fillStyle = "#1a242c";
  g.beginPath();
  g.ellipse(cx, cy + 70, 16, 8, 0, 0, Math.PI * 2);
  g.fill();
  if (vacia > 0.55 && vacia < 1) {
    const u = (t * 3) % 1;
    g.strokeStyle = `rgba(180,230,240,${0.5 * (1 - vacia)})`;
    g.lineWidth = 3;
    g.beginPath();
    g.ellipse(cx, cy + 70, 10 + u * 28, 5 + u * 10, t * 6, 0, Math.PI * 1.4);
    g.stroke();
  }
  const gota = k.tramo(t, Tbanera - 0.05, Tbanera + 0.55);
  if (gota > 0 && gota < 1) {
    g.fillStyle = "rgba(190,235,245,0.9)";
    g.beginPath();
    g.ellipse(cx + 120, 760 + gota * 360, 7, 12, 0, 0, Math.PI * 2);
    g.fill();
  }

  // grifo
  g.save();
  g.translate(250, 860);
  g.beginPath();
  g.moveTo(0, 40);
  g.lineTo(0, -80);
  g.quadraticCurveTo(10, -150, 150, -150);
  g.lineTo(150, -110);
  g.quadraticCurveTo(40, -110, 40, -70);
  g.lineTo(40, 40);
  g.closePath();
  k.metal(g, 0, 160, ["#8a929c", "#f4f7fb", "#c5ccd4", "#ffffff", "#6e767f"]);
  g.beginPath();
  g.arc(150, -130, 22, 0, Math.PI * 2);
  k.metal(g, 128, 172);
  g.restore();

  // toalla de color, para que no sea un baño gris
  g.save();
  k.redondo(g, 800, 900, 150, 220, 16);
  const tg = g.createLinearGradient(800, 900, 950, 1120);
  tg.addColorStop(0, "#e85d4c");
  tg.addColorStop(1, "#b4332a");
  g.fillStyle = tg;
  g.fill();
  g.restore();

  velo(g, 0.5);
}
