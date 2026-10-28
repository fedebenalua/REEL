// «Lo sujeta la gravedad: encima de ti pesa como diez metros de agua.»
// Una plaza. Un edificio de tres plantas y, a su lado, una columna de agua de la misma altura. La persona cabe
// abajo, para ver la escala. La columna ya está al entrar y termina de llenarse en «agua».
import * as k from "#kit";
import { v } from "#voz";
import { columnaAgua, persona, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio - 0.04;

const f = v.frase(3);
const Tdiez = f.t("diez"), Tagua = f.t("agua");
const corte = v.frase(4).inicio - 0.04;

function edificio(g, x, y0, y1, w) {
  const h = y1 - y0;
  g.save();
  g.fillStyle = "rgba(80,30,20,0.25)"; g.beginPath(); g.ellipse(x + w * 0.5, y1 + 8, w * 0.55, 18, 0, 0, 6.28); g.fill();
  const fg = g.createLinearGradient(x, 0, x + w, 0);
  fg.addColorStop(0, "#c4553a"); fg.addColorStop(0.45, "#f0a06a"); fg.addColorStop(1, "#a84432");
  g.fillStyle = fg; k.redondo(g, x, y0 + 36, w, h - 36, 8); g.fill();
  g.fillStyle = "#8d3a28"; g.beginPath(); g.moveTo(x - 16, y0 + 48); g.lineTo(x + w / 2, y0); g.lineTo(x + w + 16, y0 + 48); g.closePath(); g.fill();
  g.fillStyle = "#e7b15a";
  for (let fila = 0; fila < 3; fila++) for (let col = 0; col < 2; col++) {
    const wx = x + 28 + col * (w * 0.48), wy = y0 + 80 + fila * (h * 0.26);
    k.redondo(g, wx, wy, w * 0.32, 54, 6); g.fill();
    g.fillStyle = fila === 1 ? "#2f6d4f" : "#245a8a";
    g.fillRect(wx + 6, wy + 6, w * 0.32 - 12, 42);
    g.fillStyle = "#e7b15a";
  }
  g.fillStyle = "#5c3318"; k.redondo(g, x + w * 0.36, y1 - 78, w * 0.28, 78, 6); g.fill();
  g.fillStyle = "rgba(90,40,20,0.35)";
  for (let fila = 0; fila < 3; fila++) g.fillRect(x + 8, y0 + 150 + fila * (h * 0.26), w - 16, 10);
  g.fillStyle = "#3d8f4a"; g.beginPath(); g.ellipse(x + w - 20, y0 + 70, 28, 16, 0, 0, 6.28); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const tp = Math.min(t, corte - 0.22);
  const cielo = g.createLinearGradient(0, 0, 0, 1920);
  cielo.addColorStop(0, "#16345c"); cielo.addColorStop(0.28, "#4aa0d8"); cielo.addColorStop(0.55, "#f2c98a"); cielo.addColorStop(1, "#e7a56a");
  g.fillStyle = cielo; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 860, 430, 380, "amarilla", 0.45);
  const suelo = g.createLinearGradient(0, 1480, 0, 1920);
  suelo.addColorStop(0, "#e7c48a"); suelo.addColorStop(1, "#c9844a");
  g.fillStyle = suelo; g.fillRect(0, 1480, 1080, 440);
  g.strokeStyle = "rgba(255,230,190,0.35)"; g.lineWidth = 2;
  for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(0, 1520 + i * 48); g.lineTo(1080, 1500 + i * 48); g.stroke(); }
  const y0 = 560, y1 = 1500;
  edificio(g, 90, y0, y1, 340);
  const lleno = 0.08 + 0.92 * k.suave(k.tramo(tp, f.inicio + 0.15, Tagua));
  columnaAgua(g, 760, y0, y1, 250, lleno);
  persona(g, 250, 1500, 250, { ropa: "#2a6f8f" });
  const al = k.suave(k.tramo(tp, Tdiez - 0.1, Tdiez + 0.25)) * (1 - k.suave(k.tramo(tp, corte - 0.45, corte - 0.22)));
  k.pastilla(g, 760, 1040, "10", "m", "180,240,255", al, 100);
  veloArriba(g, 0.5);
}
