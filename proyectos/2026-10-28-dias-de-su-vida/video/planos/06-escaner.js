// El escáner ve diferencias. Una línea intenta explicarlas y se rompe: nadie ha demostrado la causa.
import * as k from "#kit";
import { v } from "#voz";
import { cabeza, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(10);
const Tdif = f.t("diferencias");
const Tcausa = f.t("causa");

export function dibuja(g, t) {
  const c = g.createRadialGradient(540, 800, 80, 540, 900, 1100);
  c.addColorStop(0, "#2a241c"); c.addColorStop(0.45, "#161410"); c.addColorStop(1, "#07080c");
  g.fillStyle = c; g.fillRect(0, 0, 1080, 1920);

  const baja = k.suave(k.tramo(t, f.inicio, Tdif + 0.35));
  const orbes = k.suave(k.tramo(t, Tdif - 0.1, Tdif + 0.5));
  const rompe = k.suave(k.tramo(t, Tcausa - 0.15, Tcausa + 0.4));
  const reposo = k.suave(k.tramo(t, Tcausa + 0.35, Tcausa + 0.7));

  // aro del escáner
  g.save();
  g.translate(540, 1040);
  g.strokeStyle = `rgba(255,186,90,${0.35 + 0.4 * (1 - reposo)})`;
  g.lineWidth = 18;
  g.beginPath(); g.ellipse(0, 0, 340, 460, 0, 0, 7); g.stroke();
  g.restore();
  const yScan = k.mez(620, 1180, baja);
  if (baja > 0.02 && baja < 0.98 && reposo < 0.5) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const band = g.createLinearGradient(0, yScan - 30, 0, yScan + 30);
    band.addColorStop(0, "rgba(255,210,140,0)");
    band.addColorStop(0.5, "rgba(255,220,160,0.55)");
    band.addColorStop(1, "rgba(255,210,140,0)");
    g.fillStyle = band;
    g.fillRect(220, yScan - 40, 640, 80);
    g.restore();
  }

  cabeza(g, 520, 1080, 2.15);
  const pts = [[640, 860], [730, 940], [670, 1020]];
  for (let i = 0; i < pts.length; i++) {
    const p = 0.7 + 0.3 * Math.sin(t * 2.2 + i);
    k.brillo(g, pts[i][0], pts[i][1], 180, "sodio", orbes * 0.55 * p * (1 - rompe * 0.25));
  }
  // la línea que no llega a ser una causa
  const x0 = 680, y0 = 1000, x1 = 980, y1 = 860;
  const u = (1 - rompe) * orbes;
  if (u > 0.05) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,190,90,${0.7 * u})`;
    g.lineWidth = 8;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(k.mez(x0, x1, u), k.mez(y0, y1, u)); g.stroke();
    g.restore();
  }
  if (rompe > 0.15) {
    for (let i = 0; i < 8; i++) {
      const a = k.azar(30 + i)();
      const ang = a * 6;
      const d = rompe * (40 + i * 18);
      k.brillo(g, k.mez(x1, x0, 0.35) + Math.cos(ang) * d, k.mez(y1, y0, 0.35) + Math.sin(ang) * d, 50, "naranja", (1 - reposo) * 0.5);
    }
  }
  velo(g, 0.6);
}
