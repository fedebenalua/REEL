// «un estudio no vio que un chat hiciera esos planes más viables que internet.»
// Dos luces corren hacia una puerta. Se paran a la misma distancia. Luego se mueven deprisa, y la puerta no se abre.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, vineta, sinVista, puerta } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio - 0.04;

const f5 = v.frase(5), f6 = v.frase(6);
const T0 = f5.inicio, Tchat = f5.t("chat"), Tint = f5.t("internet"), Tvia = f5.t("viables");
const Tdep = f6.t("deprisa");
const fin = v.frase(7).inicio - 0.26;

const { suave: su, tramo: tr, mez } = k;

export function dibuja(g, t) {
  const tt = Math.min(t, fin);
  fondo(g, "30,40,110");

  // el pasillo, en perspectiva falsa: el suelo se estrecha hacia la puerta
  g.fillStyle = "#12162c";
  g.beginPath();
  g.moveTo(80, 1680);
  g.lineTo(1000, 1680);
  g.lineTo(700, 620);
  g.lineTo(380, 620);
  g.closePath();
  const suelo = g.createLinearGradient(0, 620, 0, 1680);
  suelo.addColorStop(0, "#243056");
  suelo.addColorStop(1, "#3a2418");
  g.fillStyle = suelo;
  g.fill();
  // dos carriles de color
  g.fillStyle = "rgba(255,200,80,0.35)";
  g.beginPath();
  g.moveTo(220, 1680);
  g.lineTo(430, 1680);
  g.lineTo(500, 700);
  g.lineTo(430, 700);
  g.fill();
  g.fillStyle = "rgba(80,170,255,0.35)";
  g.beginPath();
  g.moveTo(650, 1680);
  g.lineTo(860, 1680);
  g.lineTo(650, 700);
  g.lineTo(580, 700);
  g.fill();

  puerta(g, 540, 1080, 640, 1, 0);

  // la raya donde se paran las dos, a la misma altura
  const yParada = 1180;
  const alRaya = su(tr(tt, Tvia - 0.25, Tvia + 0.05));
  g.save();
  g.globalAlpha = 0.85 * alRaya;
  g.strokeStyle = "#ffe1a0";
  g.lineWidth = 8;
  g.setLineDash([16, 14]);
  g.beginPath();
  g.moveTo(300, yParada);
  g.lineTo(780, yParada);
  g.stroke();
  g.restore();

  const correr = su(tr(tt, Tchat - 0.1, Tvia));
  // después de pararse, giran deprisa en su sitio (movimiento, no un parpadeo)
  const giro = tt > f6.inicio ? (tt - f6.inicio) * 5.5 : 0;
  const quieto = t > fin;
  const yLuz = mez(1620, yParada, correr);
  const radio = tt > f6.inicio ? 70 : 0;
  const x1 = 470 + Math.cos(giro) * radio;
  const x2 = 610 + Math.sin(giro) * radio;
  const y1 = (quieto ? yParada : yLuz) + Math.sin(giro) * radio * 0.4;
  const y2 = (quieto ? yParada : yLuz) + Math.cos(giro) * radio * 0.4;
  const al = su(tr(tt, T0, T0 + 0.3));
  bola(g, x1, y1, 96, "255,196,70", al);
  bola(g, x2, y2, 96, "90,170,255", al);

  // el golpe de parar, las dos a la vez
  const golpe = k.pulso(t, Tvia + 0.02, 0.08);
  if (golpe > 0.05) {
    k.brillo(g, 470, yParada, 280, "amarilla", golpe);
    k.brillo(g, 610, yParada, 280, "azul", golpe);
  }

  // «cambia deprisa»: una oleada de luz recorre el pasillo entero
  if (tt > f6.inicio) {
    const uOla = su(tr(tt, f6.inicio, Math.min(f6.inicio + 2.15, fin)));
    const yOla = mez(1580, 620, uOla);
    const alOla = Math.sin(Math.min(1, uOla) * Math.PI);
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = alOla;
    const og = g.createLinearGradient(0, yOla, 0, yOla + 260);
    og.addColorStop(0, "rgba(255,220,140,0)");
    og.addColorStop(0.5, "rgba(255,230,170,0.5)");
    og.addColorStop(1, "rgba(255,220,140,0)");
    g.fillStyle = og;
    g.fillRect(120, yOla, 840, 260);
    g.restore();
  }

  sinVista(g);
  vineta(g, 0.48);
  velo(g, 0.78);
}

function bola(g, x, y, r, color, al) {
  g.save();
  g.globalAlpha *= al;
  const rg = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  rg.addColorStop(0, "#fff");
  rg.addColorStop(0.35, `rgb(${color})`);
  rg.addColorStop(1, "#14080c");
  g.fillStyle = rg;
  g.beginPath();
  g.arc(x, y, r, 0, 7);
  g.fill();
  k.brillo(g, x, y, r * 3.2, "blanca", 0.35);
  g.restore();
}
