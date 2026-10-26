// «No es que los tire al abrir los ojos: mientras sueñas, casi no los apunta.»
// La pluma dibuja el pez y el trazo se deshace detrás. En «apunta» el papel queda en blanco.
import * as k from "#kit";
import { v } from "#voz";
import { koi, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(2).t("no");

const f = v.frase(2);
const Tdibuja = f.t("mientras");
const Tapunta = f.t("apunta");

function lomo(u) {
  const x = 220 + u * 620;
  return [x, 900 - Math.sin(u * Math.PI) * 40];
}

function fondo(g) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#1a120c");
  bg.addColorStop(1, "#070504");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalAlpha = 0.25;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, 0, 400, 1080, 1400);
  g.restore();
}

function papel(g) {
  g.save();
  g.translate(540, 1040);
  g.rotate(-0.03);
  g.fillStyle = "rgba(0,0,0,0.35)";
  k.redondo(g, -400, -520, 820, 1080, 8); g.fill();
  const pg = g.createLinearGradient(-390, -560, 390, 520);
  pg.addColorStop(0, "#fffaf2");
  pg.addColorStop(1, "#f0e2cc");
  g.fillStyle = pg;
  k.redondo(g, -390, -560, 780, 1080, 6); g.fill();
  g.restore();
}

function pluma(g, x, y, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.fillStyle = "#1c140e";
  k.redondo(g, -170, -16, 200, 32, 10); g.fill();
  const ng = g.createLinearGradient(20, 0, 90, 0);
  ng.addColorStop(0, "#e8c56a");
  ng.addColorStop(1, "#fff1c4");
  g.fillStyle = ng;
  g.beginPath(); g.moveTo(20, -10); g.lineTo(78, -3); g.lineTo(78, 3); g.lineTo(20, 10); g.closePath(); g.fill();
  g.fillStyle = "#2a1c10";
  g.fillRect(70, -2, 16, 4);
  g.restore();
}

export function dibuja(g, t) {
  fondo(g);
  papel(g);
  const avanza = k.suave(k.tramo(t, f.inicio + 0.08, Tapunta - 0.15));
  const seVa = k.suave(k.tramo(t, Tapunta - 0.05, Tapunta + 0.5));
  // el pez está en el papel desde el principio (no lo tiran) y se deshace al no apuntarse
  if (seVa < 0.98) koi(g, 540, 1100, 820, -0.08 + seVa * 0.4, t, 0.95 * (1 - seVa));
  const azP = k.azar(3);
  if (seVa > 0.02 && seVa < 0.98) {
    g.save();
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 14; i++) {
      const a = azP() * 6.28;
      const x = 540 + Math.cos(a) * 420 * seVa;
      const y = 1000 + Math.sin(a) * 280 * seVa - seVa * 200;
      g.fillStyle = `rgba(255,140,150,${0.45 * (1 - seVa)})`;
      g.beginPath(); g.arc(x, y, 18 + azP() * 16, 0, 6.2832); g.fill();
    }
    g.restore();
  }
  const [px, py] = lomo(Math.min(0.98, avanza));
  pluma(g, px + 20, py - 40 - seVa * 240, -0.5 + seVa * 0.6);
  // la lámpara del escritorio
  k.brillo(g, 180, 620, 500, "255,214,160", 0.35);
  velo(g, 0.5);
}
