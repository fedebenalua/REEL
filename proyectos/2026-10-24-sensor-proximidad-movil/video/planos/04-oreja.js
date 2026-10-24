// Otra vez el móvil y la oreja, de lado: no la reconoce. Gira hasta el cristal, ya negro.
// El cierre entra en ese mismo sitio y la cámara acaba cerca, como al principio.
import * as k from "#kit";
import { v } from "#voz";
import { TEL, cabeza, camara, fondo, telefono, velo } from "../mundo.js";

export const desde = "asi";

const { suave: su, tramo: tr, mez, claves } = k;
const f8 = v.frase(8), f9 = v.frase(9);
const Toreja = f8.t("oreja"), Tcristal = f8.t("cristal"), Tmej = f9.t("mejilla");

function giro(t) {
  return su(tr(t, Tcristal - 0.85, Tcristal - 0.15));
}

export function dibuja(g, t) {
  const u = giro(t);
  const z = claves([
    [f8.inicio, 1.08],
    [Toreja, 1.22],
    [Tcristal, 1.04],
    [Tmej - 0.2, 1.12],
    [Tmej + 0.55, 1.48],
  ])(t);
  const fx = mez(640, 620, u);
  const fy = mez(980, 900, su(tr(t, Tmej - 0.4, Tmej + 0.4)));
  fondo(g, 0.35);
  g.save();
  camara(g, fx, fy, z);
  const hx = mez(700, 760, u), hy = mez(980, 1040, u), hs = mez(1.62, 1.08, u);
  cabeza(g, hx, hy, hs, 1, 0);
  const px = mez(390, TEL.x, u), py = mez(1040, TEL.y, u);
  if (u < 0.72) {
    g.save();
    g.globalAlpha = 1 - su(tr(u, 0.42, 0.72));
    g.translate(px, py);
    const ancho = mez(150, 260, u);
    g.shadowColor = "rgba(0,0,0,0.55)";
    g.shadowBlur = 28;
    k.redondo(g, -ancho / 2, -540, ancho, 1080, Math.min(42, ancho / 2));
    k.metal(g, -ancho / 2, ancho / 2, ["#2a2e36", "#d5dbe2", "#6a727c", "#f3f5f8", "#24282e"]);
    g.fillStyle = "#07080c";
    g.fillRect(-5, -480, 10, 960);
    g.restore();
  }
  if (u > 0.4) {
    g.save();
    g.globalAlpha = su(tr(u, 0.4, 0.72));
    telefono(g, px, py, mez(0.72, TEL.esc, su(tr(u, 0.4, 0.85))), -0.03, t, 0, su(tr(t, Tcristal - 0.3, Tcristal + 0.15)) * (1 - su(tr(t, Tmej + 0.15, Tmej + 0.45))));
    g.restore();
  }
  g.restore();
  velo(g, 0.78);
}
