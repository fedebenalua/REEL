// Dentro de la tripa: la ola, luego la red de neuronas al lado de la médula.
import * as k from "#kit";
import { v } from "#voz";
import { columna, mariposa, redNeuronas, saco, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(6).inicio - 0.04;
export const entrada = "corte";

const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
const Taleja = f8.inicio;
const Tmill = f8.t("millones");
const Tciento = f8.t("ciento");
const Tveinte = f9.t("veinte");
const Tdosc = f9.t("doscientas");

function ola(g, t, alas) {
  g.fillStyle = "#1a060c";
  g.fillRect(0, 0, 1080, 1920);
  const fase = t * 1.15;
  const cresta = (x, capa) => 1080 + Math.sin((x / 1080) * Math.PI * 2.1 - fase + capa) * (200 - capa * 24);
  for (let capa = 2; capa >= 0; capa--) {
    g.beginPath();
    g.moveTo(0, cresta(0, capa) + 80);
    for (let x = 0; x <= 1080; x += 16) g.lineTo(x, cresta(x, capa));
    g.lineTo(1080, 1920);
    g.lineTo(0, 1920);
    g.closePath();
    const col = ["#6a1830", "#d04860", "#ffb0b0"][capa];
    const gr = g.createLinearGradient(0, 600, 0, 1500);
    gr.addColorStop(0, col);
    gr.addColorStop(1, "#2a0810");
    g.fillStyle = gr;
    g.fill();
  }
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let x = 40; x <= 1080; x += 24) {
    const y = cresta(x, 0);
    k.brillo(g, x, y - 6, 36, "blanca", 0.18);
  }
  if (alas > 0.04) {
    for (let i = 0; i < 5; i++) {
      const x = 140 + i * 200;
      mariposa(g, x, cresta(x, 0) - 10, 120, -0.4 + i * 0.15, 0.8, alas, i % 2 ? "oro" : "rosa");
    }
  }
  g.restore();
}

export function dibuja(g, t) {
  const lejos = k.suave(k.tramo(t, Taleja, Taleja + 1.35));
  const alas = k.suave(k.tramo(t, f7.t("sacudida") - 0.05, f7.t("sacudida") + 0.4)) * (1 - k.suave(k.tramo(t, f7.t("mariposas"), f7.t("mariposas") + 0.7)));
  const numTrip = k.suave(k.tramo(t, Tciento, Tciento + 0.35));
  const llegaCol = k.entra(k.tramo(t, f9.inicio, Tdosc));
  const numCol = k.suave(k.tramo(t, Tdosc, Tveinte + 0.15));

  if (lejos < 0.98) {
    g.save();
    g.translate(k.mez(540, 390, lejos), k.mez(960, 980, lejos));
    g.scale(k.mez(1, 0.28, lejos), k.mez(1, 0.28, lejos));
    g.translate(-540, -960);
    g.globalAlpha = 1 - k.suave(k.tramo(lejos, 0.62, 1));
    ola(g, t, alas);
    g.restore();
  }

  if (lejos > 0.05) {
    g.save();
    g.globalAlpha = k.suave(k.tramo(lejos, 0.12, 0.55));
    g.fillStyle = "#14060c";
    g.fillRect(0, 0, 1080, 1920);
    const fondo = g.createRadialGradient(420, 1000, 40, 500, 1000, 900);
    fondo.addColorStop(0, "#4a1830");
    fondo.addColorStop(1, "#0c0408");
    g.fillStyle = fondo;
    g.fillRect(0, 0, 1080, 1920);
    saco(g, 400, 1040, 280, 340, t, 0.15);
    redNeuronas(g, 400, 1040, 320, 390, t, k.suave(k.tramo(t, Taleja + 0.5, Tmill - 0.2)));
    const xCol = k.mez(1280, 780, llegaCol);
    columna(g, xCol, 620, 1320, t, llegaCol);
    if (numTrip > 0.05) k.pastilla(g, 400, 1320, "170", "millones", "255,196,120", numTrip, 72);
    if (numCol > 0.05) k.pastilla(g, xCol, 1320, "220", "millones", "255,236,210", numCol, 72);
    g.restore();
  }
  velo(g, 0.7);
}
