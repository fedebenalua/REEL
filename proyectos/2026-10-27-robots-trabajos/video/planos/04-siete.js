// La OCDE: uno de cada siete, y otro tercio que cambia por dentro.
import * as k from "#kit";
import { v } from "#voz";
import { brazo, operario, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;
export const entrada = "corte";

const f5 = v.frase(5);
const f6 = v.frase(6);
const Tsiete = f5.t("siete");
const Tcambia = f6.t("cambia");
const Tdentro = f6.t("dentro");
const Tcorte = v.frase(7).inicio;

const COLORES = ["#fb923c", "#38bdf8", "#4ade80", "#f472b6", "#a78bfa", "#facc15", "#2dd4bf"];

function caja(g, x, y, w, h, color) {
  k.redondo(g, x, y, w, h, 10);
  g.fillStyle = color;
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.35)";
  g.lineWidth = 3;
  g.stroke();
}

export function dibuja(g, t) {
  const tt = Math.min(t, Tcorte - 0.26);
  const toma = k.entra(k.tramo(tt, Tsiete - 0.55, Tsiete + 0.15));
  const parte = k.entra(k.tramo(tt, Tcambia - 0.12, Tdentro + 0.2));
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#0c1220");
  fondo.addColorStop(0.55, "#172033");
  fondo.addColorStop(1, "#1a140c");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 540, 1180, 700, "cian", 0.12);
  g.restore();

  // Cuatro detrás, se quedan como están.
  const atras = [150, 380, 640, 860];
  atras.forEach((x, i) => {
    const bob = Math.sin(tt * 2 + i) * 3;
    k.redondo(g, x - 70, 760, 150, 28, 8);
    g.fillStyle = "#243044";
    g.fill();
    caja(g, x - 28, 700 + bob, 56, 42, COLORES[i + 3]);
    operario(g, x, 900, 280, tt + i);
  });

  // Tres delante. El centro es el uno de cada siete. Los lados cambian por dentro.
  const frente = [
    { x: 210, rol: "parte", color: COLORES[1] },
    { x: 540, rol: "entero", color: COLORES[0] },
    { x: 860, rol: "parte", color: COLORES[2] },
  ];
  for (const p of frente) {
    const esEntero = p.rol === "entero";
    k.redondo(g, p.x - 130, 1180, 260, 46, 12);
    const mesa = g.createLinearGradient(p.x - 130, 0, p.x + 130, 0);
    mesa.addColorStop(0, "#3f2a1a");
    mesa.addColorStop(0.5, "#a56b3c");
    mesa.addColorStop(1, "#4a2e1c");
    g.fillStyle = mesa;
    g.fill();
    if (esEntero) {
      const personaAl = 1 - toma;
      operario(g, p.x - 20, 1500, 540, tt, { al: personaAl, paso: toma * 0.4, lado: -1 });
      const tip = brazo(g, p.x + 30, 1240, 1.35 * (0.4 + 0.6 * toma), tt, 0.2, 0.25 + 0.75 * toma);
      if (toma > 0.4) k.brillo(g, tip.x, tip.y, 80, "naranja", toma);
      caja(g, p.x - 36, 1100, 78, 58, p.color);
    } else {
      operario(g, p.x - 50, 1500, 520, tt, { brazo: -0.35 });
      const tip = brazo(g, p.x + 70, 1260, 0.72, tt, 1.2, 0.35 + 0.65 * parte);
      const ir = k.mez(p.x - 70, tip.x - 20, parte);
      const iy = k.mez(1088, 1125, parte);
      caja(g, ir, iy, 64, 48, p.color);
      caja(g, p.x - 90, 1030, 64, 48, "#fde68a");
    }
  }
  velo(g);
}
