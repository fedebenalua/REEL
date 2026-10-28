// «Una enfermedad es un germen que salta de persona a persona, y eso no sale de una pantalla.»
// Dos personas grandes. La luz salta de una a la otra. La siguiente se aplasta en un cristal.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, vineta, sinVista, persona, cristal } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio - 0.04;

const f4 = v.frase(4);
const T0 = f4.inicio, Tsal = f4.t("salta"), Tper = f4.t("persona");
const Tsale = f4.t("sale"), Tpant = f4.t("pantalla");
const fin = v.frase(5).inicio - 0.24;

const { suave: su, tramo: tr, mez, entra } = k;

export function dibuja(g, t) {
  const tt = Math.min(t, fin);
  fondo(g, "40,80,140");
  // suelo de color
  const suelo = g.createLinearGradient(0, 1400, 0, 1920);
  suelo.addColorStop(0, "#1a3a55");
  suelo.addColorStop(1, "#071018");
  g.fillStyle = suelo;
  g.fillRect(0, 1480, 1080, 500);
  g.fillStyle = "rgba(120,220,255,0.25)";
  g.fillRect(0, 1480, 1080, 8);

  persona(g, 280, 1580, 900, "55,150,255", tt, 1);
  persona(g, 800, 1580, 900, "255,140,60", tt, -1);
  const luzDer = su(tr(tt, Tsal + 0.15, Tper + 0.15));

  // el germen crece en la primera, salta, y se queda en la segunda
  const crece = su(tr(tt, T0, Tsal));
  const u = su(tr(tt, Tsal - 0.02, Tsal + 0.45));
  const enVuelo = u > 0.02 && u < 0.98;
  const x = enVuelo ? mez(300, 780, u) : (u >= 0.98 ? 780 : 300);
  const y = enVuelo ? mez(900, 860, u) - Math.sin(u * Math.PI) * 240 : 900;
  if (tt < Tsale + 0.25) {
    const alGermen = 1 - su(tr(tt, Tsale - 0.2, Tsale + 0.2));
    const tam = mez(90, 280, Math.max(crece, u));
    k.brillo(g, x, y, tam * 2.2, "cian", 0.95 * alGermen);
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = alGermen;
    g.fillStyle = "rgba(230,255,255,0.95)";
    g.beginPath();
    g.arc(x, y, 36, 0, 7);
    g.fill();
    g.restore();
  }
  // al llegar, la segunda persona se enciende
  if (luzDer > 0.2) k.brillo(g, 800, 980, 360 * luzDer, "amarilla", 0.55 * luzDer);

  // la que intenta salir y se queda en el cristal
  const sale = su(tr(tt, Tsale - 0.05, Tpant));
  const aplastada = su(tr(tt, Tpant - 0.05, Tpant + 0.22));
  const alPant = su(tr(tt, Tpant - 0.35, Tpant + 0.22));
  if (alPant > 0.02) {
    g.save();
    g.globalAlpha *= alPant;
    const px = 230, py = 620, pw = 620, ph = 780;
    g.fillStyle = "rgba(6,10,18,0.72)";
    g.fillRect(px, py, pw, ph);
    // la chispa viene hacia el cristal y se aplana
    const sy = mez(980, 980, sale);
    const sx = mez(800, 540, entra(sale));
    const esc = mez(1, 2.4, sale) * (aplastada > 0 ? 1 : 1);
    const plana = aplastada;
    k.brillo(g, sx, sy - (1 - plana) * 40, 200 * esc, "cian", 1 - plana * 0.3);
    g.save();
    g.globalAlpha *= 0.9;
    g.fillStyle = `rgba(180,240,255,${1 - plana * 0.4})`;
    g.beginPath();
    g.ellipse(540, 1000, mez(30, 200, plana), mez(30, 18, plana), 0, 0, 7);
    g.fill();
    g.restore();
    cristal(g, px, py, pw, ph, 0.4 + 0.35 * plana);
    // las gotas que resbalan y se paran
    if (plana > 0.2) {
      g.fillStyle = `rgba(160,230,255,${plana})`;
      for (let i = 0; i < 5; i++) {
        const gy = 1000 + plana * (40 + i * 28);
        g.beginPath();
        g.ellipse(480 + i * 28, Math.min(gy, fin > 0 ? gy : gy), 10, 16, 0, 0, 7);
        g.fill();
      }
    }
    g.restore();
  }

  sinVista(g);
  vineta(g, 0.5);
  velo(g, 0.8);
}
