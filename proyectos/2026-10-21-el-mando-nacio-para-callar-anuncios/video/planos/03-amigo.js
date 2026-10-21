// Ese amigo, gritándole al anuncio. La cámara se mete en la boca y el último fotograma es el primero.
import * as k from "#kit";
import { v } from "#voz";
import { T, anillos, boca, persona, telefono, velo } from "../mundo.js";

export const desde = "friend";
export const entrada = "corte";

const { suave: su, tramo: tr, mez } = k;

export function dibuja(g, t) {
  const zoom = mez(1, 3.3, su(tr(t, T.friend, v.duracion - 0.05)));
  const fx = 540, fy = 780;
  g.save();
  g.translate(fx, fy);
  g.scale(zoom, zoom);
  g.translate(-fx, -fy);

  g.fillStyle = "#102830";
  g.fillRect(-200, -200, 1600, 2300);
  const pared = g.createLinearGradient(0, 0, 0, 1920);
  pared.addColorStop(0, "#14343c");
  pared.addColorStop(0.6, "#0c242c");
  pared.addColorStop(1, "#1a120e");
  g.fillStyle = pared;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 160, 980, 700, "fuego", 0.22);

  // suelo
  g.fillStyle = "#a86430";
  g.fillRect(0, 1280, 1080, 700);
  g.fillStyle = "#0e6e74";
  k.redondo(g, 140, 1340, 800, 280, 40);
  g.fill();

  // tele
  const tvW = 820, tvH = 500, tvX = 540, tvY = 760;
  k.redondo(g, tvX - tvW / 2 - 36, tvY - tvH / 2 - 36, tvW + 72, tvH + 90, 30);
  const madera = g.createLinearGradient(tvX - 400, 0, tvX + 400, 0);
  madera.addColorStop(0, "#3d2214");
  madera.addColorStop(0.5, "#8a4e28");
  madera.addColorStop(1, "#4a2a16");
  g.fillStyle = madera;
  g.fill();
  g.save();
  k.redondo(g, tvX - tvW / 2, tvY - tvH / 2, tvW, tvH, 18);
  g.clip();
  const open = 0.82 + 0.14 * Math.sin(t * 8);
  const pg = g.createRadialGradient(tvX, tvY, 30, tvX, tvY, 500);
  pg.addColorStop(0, "#ffe08a");
  pg.addColorStop(0.5, "#ff2d62");
  pg.addColorStop(1, "#5a0a22");
  g.fillStyle = pg;
  g.fillRect(tvX - tvW / 2, tvY - tvH / 2, tvW, tvH);
  boca(g, tvX, tvY + 10, tvW, tvH, open);
  anillos(g, tvX, tvY, t, 1, open);
  g.restore();

  // sofa y amigo
  g.fillStyle = "#e23b52";
  k.redondo(g, 160, 1180, 760, 280, 50);
  g.fill();
  g.fillStyle = "#ff5a6a";
  k.redondo(g, 200, 1080, 680, 180, 40);
  g.fill();
  const grita = 0.65 + 0.35 * Math.sin(t * 9);
  persona(g, 540, 1120, 460, {
    bocaAbierta: grita,
    jersey: ["#c9b6ff", "#8d74e8", "#5c48b0"],
    pelo: "#1c1a24",
  });
  telefono(g, 760, 1240, 150, 280, 0.4);
  g.restore();
  velo(g, mez(0.45, 0.85, (zoom - 1) / 1.25));
}
