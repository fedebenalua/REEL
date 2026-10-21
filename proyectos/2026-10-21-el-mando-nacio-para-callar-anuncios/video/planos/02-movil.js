// El móvil, enorme, calla la tele. Otro sitio: se corta en «phone».
import * as k from "#kit";
import { T, anillos, boca, dedo, telefono, velo } from "../mundo.js";

export const desde = "phone";
export const entrada = "corte";

const { suave: su, tramo: tr, mez } = k;

export function dibuja(g, t) {
  g.fillStyle = "#071820";
  g.fillRect(0, 0, 1080, 1920);
  const fondo = g.createRadialGradient(540, 900, 80, 540, 1000, 1100);
  fondo.addColorStop(0, "rgba(20,70,80,0.55)");
  fondo.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);

  const acerca = su(tr(t, T.phone, T.friend - 0.4));
  const tvW = mez(760, 820, acerca), tvH = tvW * 0.6;
  const tvX = 540, tvY = mez(800, 760, acerca);
  // tele
  k.redondo(g, tvX - tvW / 2 - 28, tvY - tvH / 2 - 28, tvW + 56, tvH + 70, 36);
  g.fillStyle = "#1a1e26";
  g.fill();
  g.save();
  k.redondo(g, tvX - tvW / 2, tvY - tvH / 2, tvW, tvH, 22);
  g.clip();
  const cierra = su(tr(t, T.phone + 0.02, T.phone + 0.5));
  const open = 1 - cierra;
  const pg = g.createRadialGradient(tvX, tvY, 40, tvX, tvY, tvW * 0.7);
  pg.addColorStop(0, open > 0.15 ? "#ffd36a" : "#8fd8ff");
  pg.addColorStop(0.5, open > 0.15 ? "#ff2f6a" : "#1c6ea8");
  pg.addColorStop(1, "#102030");
  g.fillStyle = pg;
  g.fillRect(tvX - tvW / 2, tvY - tvH / 2, tvW, tvH);
  if (open > 0.05) {
    boca(g, tvX, tvY, tvW, tvH, open);
    anillos(g, tvX, tvY, t, open, open);
  } else {
    // un canal tranquilo: sol y colina, quietos
    g.fillStyle = "#ffe08a";
    g.beginPath();
    g.arc(tvX - 120, tvY - 40, 70, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#1f8a4d";
    g.beginPath();
    g.moveTo(tvX - 260, tvY + 120);
    g.lineTo(tvX, tvY - 10);
    g.lineTo(tvX + 280, tvY + 140);
    g.fill();
  }
  g.restore();

  const ph = mez(860, 920, acerca);
  const pw = ph * 0.52;
  const py = mez(1360, 1320, acerca);
  telefono(g, 540, py, pw, ph, su(tr(t, T.app - 0.05, T.bio + 0.2)));
  const pulsa = su(tr(t, T.phone - 0.08, T.phone + 0.2));
  dedo(g, mez(900, 700, pulsa), py + 30 + (1 - pulsa) * 50, 320, 0.4, 1);
  velo(g, 0.5);
}
