// «Así que no se borraron al despertar...» y el cierre.
// El último vaho no deja tinta. La mano no lo coge. Luego el pez vuelve, enorme, como al principio.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, cuartoManana, koi, mano, sinVista, velo, vista } from "../mundo.js";

export const desde = (voz) => voz.frase(10).t("asi");

const f10 = v.frase(10), f11 = v.frase(11);
const Ttinta = f10.t("tinta");
const Tvan = f10.t("van");
const Tcoges = f10.t("coges");
const Tenvia = f11.t("enviaselo");
const Tnada = f11.t("nada");

const cam = camino2D([
  [Tenvia, [0.55, 900, 1000]],
  [Tnada - 0.1, [1.7, 1100, 1000]],
  [v.duracion - 0.15, [2.05, 1160, 990]],
]);

export function dibuja(g, t) {
  const vuelve = k.suave(k.tramo(t, Tenvia, Tnada - 0.05));
  if (vuelve < 0.98) {
    g.save();
    g.globalAlpha = 1 - vuelve;
    cuartoManana(g, t);
    // el papel de la mesilla, en grande cuando toca la tinta
    const zoom = k.suave(k.tramo(t, f10.inicio, Ttinta - 0.2));
    const px = k.mez(110, 540, zoom);
    const py = k.mez(1320, 1100, zoom);
    const pw = k.mez(120, 620, zoom);
    const ph = k.mez(90, 760, zoom);
    g.fillStyle = "rgba(0,0,0,0.2)";
    k.redondo(g, px - pw / 2 + 12, py - ph / 2 + 16, pw, ph, 8); g.fill();
    g.fillStyle = "#fffaf2";
    k.redondo(g, px - pw / 2, py - ph / 2, pw, ph, 6); g.fill();
    // el vaho baja, toca el papel y no mancha
    const baja = k.suave(k.tramo(t, f10.inicio + 0.1, Ttinta + 0.1));
    const seEscurre = k.suave(k.tramo(t, Tvan - 0.15, Tcoges + 0.2));
    const wx = k.mez(720, px + 40, baja) + Math.sin(t * 6) * 18 * (1 - seEscurre) + seEscurre * 160;
    const wy = k.mez(560, py - 20, baja) - seEscurre * 340;
    const wal = (1 - vuelve) * (1 - seEscurre * 0.85);
    koi(g, wx, wy, k.mez(220, 360, zoom) * (1 - seEscurre * 0.4), -0.2 + seEscurre * 0.5, t, wal * 0.85);
    const cierra = k.suave(k.tramo(t, Tcoges - 0.25, Tcoges + 0.2));
    if (t > Tvan - 0.05 && vuelve < 0.7) mano(g, 700, k.mez(1500, 1280, k.suave(k.tramo(t, Tvan - 0.2, Tcoges))), 1.3, cierra);
    g.restore();
  }

  if (vuelve > 0.02) {
    g.save();
    g.globalAlpha = vuelve;
    const bg = g.createLinearGradient(0, 0, 0, 1920);
    bg.addColorStop(0, "#24104a");
    bg.addColorStop(1, "#071422");
    g.fillStyle = bg;
    g.fillRect(0, 0, 1080, 1920);
    const [Z, cx, cy] = cam(Math.max(t, Tenvia));
    vista(g, Z, cx, cy);
    const lg = g.createRadialGradient(280, 460, 20, 280, 460, 230);
    lg.addColorStop(0, "#fff6d2"); lg.addColorStop(1, "#e8944a");
    g.fillStyle = lg;
    g.beginPath(); g.arc(280, 460, 230, 0, 6.2832); g.fill();
    const px = 700 + (t - Tenvia) * 40;
    k.brillo(g, px + 180, 1020, 800, "255,90,120", 0.4);
    koi(g, px, 1020, 1680, -0.05, t, 1);
    sinVista(g);
    g.restore();
  }
  velo(g, 0.48 + 0.1 * (1 - vuelve));
}
