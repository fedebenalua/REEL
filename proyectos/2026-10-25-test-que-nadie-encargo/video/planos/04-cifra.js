// «Y de ahí salió una sola cifra, que medio mundo trató como un veredicto.»
// Una medalla de oro, enorme desde el primer fotograma. El sello rojo la golpea y se queda.
import * as k from "#kit";
import { v } from "#voz";
import { medalla, sello, velo } from "../mundo.js";

export const desde = "salio";

const Tcif = v.t("cifra");
const Tver = v.t("veredicto");
const Tcorte = v.t("dos") - 0.06;

export function dibuja(g, t) {
  const h = g.createLinearGradient(0, 0, 0, 1920);
  h.addColorStop(0, "#140c04");
  h.addColorStop(0.5, "#3a220c");
  h.addColorStop(1, "#100804");
  g.fillStyle = h;
  g.fillRect(0, 0, 1080, 1920);
  const cerca = 1 - Math.exp(-Math.max(0, t - (v.t("salio") - 0.04)) * 1.6);
  const r = k.mez(420, 300, k.suave(k.tramo(t, Tcif - 0.2, Tcif + 0.45)));
  const y = k.mez(860, 1020, cerca * 0.3);
  // halo
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 540, y, r * 2.4, "amarilla", 0.8);
  g.restore();
  medalla(g, 540, y, r, 1);
  // tres edades que se funden al llegar
  const funde = k.suave(k.tramo(t, v.t("salio"), Tcif));
  for (let i = 0; i < 3; i++) {
    const al = 1 - funde;
    if (al < 0.04) continue;
    const ang = -0.6 + i * 0.6;
    const dist = k.mez(280, 0, funde);
    const x = 540 + Math.sin(ang) * dist;
    const yy = y - 40 + Math.cos(ang) * dist * 0.4;
    g.save();
    g.globalAlpha = al;
    g.beginPath();
    g.arc(x, yy, 36, 0, 6.3);
    g.fillStyle = "#f0c14d";
    g.fill();
    g.fillStyle = "#3a2408";
    g.font = "800 40px Figtree";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(String([3, 5, 7][i]), x, yy + 2);
    g.restore();
  }
  // el sello-veredicto cae y se queda
  const u = k.sale(k.tramo(t, Tver - 0.35, Tver + 0.22));
  const ys = k.mez(280, y, u);
  const rs = k.mez(70, 168, u);
  if (t > Tver - 0.4) {
    g.save();
    g.translate(540, ys);
    sello(g, rs, u > 0.92 ? 0.15 : 0);
    g.restore();
    if (u > 0.85 && t < Tver + 0.45) {
      g.save();
      g.globalCompositeOperation = "lighter";
      k.fogonazo(g, 540, y, k.pulso(t, Tver + 0.18, 0.08), 700, "255,180,80");
      g.restore();
    }
  }
  // reposo: el sello ya está quieto antes del corte
  void Tcorte;
  velo(g, 0.75);
}
