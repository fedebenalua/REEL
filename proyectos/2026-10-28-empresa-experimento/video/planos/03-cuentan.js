// «cuentan los toques y lo que escribes.»
import * as k from "#kit";
import { v } from "#voz";
import { sala, velo, telefono, muro, boton } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f4 = v.frase(4);
const Tcuen = f4.t("cuentan"), Ttoq = f4.t("toques"), Tesc = f4.t("escribes");
const az = azar(77);
const LETRAS = "aeiouhlmnr".split("");
const FICHAS = Array.from({ length: 6 }, (_, i) => ({ ch: LETRAS[Math.floor(az() * LETRAS.length)], retraso: i * 0.06 }));

export function dibuja(g, t) {
  sala(g, "#08101e", "#140e24", t);
  const aplasta = k.pulso(t, Ttoq, 0.1);
  const pila = su(tr(t, Ttoq - 0.05, Ttoq + 0.9));
  const n = Math.round(mez(0, 6, pila));

  k.brillo(g, 400, 1100, 700, "70,140,255", 0.18);

  telefono(g, 400, 1120, 680, 1200, -0.02, (c, x, y, w, h) => {
    muro(c, x, y, w, h, Math.min(t, f4.fin - 0.25) * 0.2, "azul", 0);
    const bw = w * 0.72, bh = h * 0.11;
    const bx = x + w / 2, by = y + h * 0.72;
    c.fillStyle = "rgba(0,0,0,0.28)";
    c.beginPath();
    c.ellipse(bx, by + bh * 0.55, bw * 0.36, 16, 0, 0, 6.2832);
    c.fill();
    boton(c, bx, by + aplasta * 10, bw, bh * (1 - 0.22 * aplasta), "50,130,255", 1);
  });

  for (let i = 0; i < n; i++) {
    const u = su(tr(pila, i / 6, i / 6 + 0.2));
    const y = mez(1500, 1320 - i * 72, u);
    g.save();
    g.globalAlpha = u;
    k.redondo(g, 760, y, 150, 64, 32);
    const gr = g.createLinearGradient(760, y, 760, y + 64);
    gr.addColorStop(0, "#9ec4ff");
    gr.addColorStop(1, "#2d6adf");
    g.fillStyle = gr;
    g.fill();
    g.restore();
  }
  if (t > Ttoq && t < Ttoq + 0.35) k.fogonazo(g, 400, 1120, (t - Ttoq) * 4, 360, "150,190,255");

  FICHAS.forEach((f, i) => {
    const u = su(tr(t, Tesc + f.retraso, Tesc + 0.7 + f.retraso));
    if (u <= 0) return;
    const fil = i;
    const x = mez(520, 930, u);
    const y = mez(340, 560 + fil * 66, u);
    g.save();
    g.translate(x, y);
    k.redondo(g, -30, -30, 60, 60, 14);
    const cg = g.createLinearGradient(0, -30, 0, 30);
    cg.addColorStop(0, "#ffe6ae");
    cg.addColorStop(1, "#e09830");
    g.fillStyle = cg;
    g.fill();
    g.fillStyle = "#3a2408";
    g.font = "800 32px Figtree";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(f.ch, 0, 2);
    g.restore();
  });

  velo(g, 0.82);
}
