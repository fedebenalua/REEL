// «Las partículas del Sol llegarían hasta los aviones, y el aire de debajo las pararía antes del suelo.»
// El avión grande. La barrera de partículas baja hasta su altura y ahí se queda. La ciudad, debajo, quieta.
import * as k from "#kit";
import { v } from "#voz";
import { veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio - 0.04;

const f = v.frase(10);
const Tav = f.t("aviones"), Tpar = f.t("pararia");
const corte = v.frase(11).inicio - 0.04;
const az = k.azar(41);
const GOTAS = Array.from({ length: 48 }, () => ({ x: az() * 1080, p: az(), v: 0.35 + az() * 0.5, s: 0.6 + az() }));

function avion(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.2)"; g.beginPath(); g.ellipse(40, 90, 260, 22, 0, 0, 6.28); g.fill();
  g.fillStyle = "#d5e4f2"; g.beginPath(); g.moveTo(-40, 10); g.lineTo(-210, 70); g.lineTo(-40, 28); g.closePath(); g.fill();
  g.fillStyle = "#9fd0ea"; g.beginPath(); g.moveTo(150, -10); g.lineTo(230, -70); g.lineTo(250, -55); g.lineTo(170, 8); g.closePath(); g.fill();
  const cg = g.createLinearGradient(0, -36, 0, 36);
  cg.addColorStop(0, "#ffffff"); cg.addColorStop(0.5, "#d5e6f5"); cg.addColorStop(1, "#8eacc4");
  g.fillStyle = cg; k.redondo(g, -260, -34, 520, 68, 34); g.fill();
  g.fillStyle = "#1c6ea8"; g.beginPath(); g.moveTo(230, -20); g.lineTo(300, -78); g.lineTo(250, 20); g.closePath(); g.fill();
  g.fillStyle = "#16324a";
  for (let i = 0; i < 8; i++) g.fillRect(-160 + i * 36, -8, 16, 10);
  g.fillStyle = "#c5d5e4"; k.redondo(g, -250, 8, 70, 28, 12); g.fill();
  k.brillo(g, 40, 0, 180, "blanca", 0.2);
  g.restore();
}

export function dibuja(g, t) {
  const tp = Math.min(t, corte - 0.22);
  const cielo = g.createLinearGradient(0, 0, 0, 1920);
  cielo.addColorStop(0, "#071426"); cielo.addColorStop(0.35, "#1d4e86"); cielo.addColorStop(0.62, "#7ec0ea"); cielo.addColorStop(1, "#f0d2a4");
  g.fillStyle = cielo; g.fillRect(0, 0, 1080, 1920);
  const baja = k.suave(k.tramo(tp, f.inicio + 0.15, Tav + 0.15));
  const yBar = k.mez(620, 980, baja);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const q of GOTAS) {
    const y = yBar - 40 - mod(q.p + tp * q.v) * 520;
    k.brillo(g, q.x, y, 22 + 14 * q.s, "amarilla", 0.7);
    g.strokeStyle = "rgba(255,196,80,0.9)"; g.lineWidth = 4; g.lineCap = "round";
    g.beginPath(); g.moveTo(q.x, y - 28); g.lineTo(q.x, y); g.stroke();
  }
  const hoja = g.createLinearGradient(0, yBar - 30, 0, yBar + 50);
  hoja.addColorStop(0, "rgba(255,220,140,0)");
  hoja.addColorStop(0.5, `rgba(255,230,170,${0.35 + 0.4 * k.pulso(tp, Tav, 0.25)})`);
  hoja.addColorStop(1, "rgba(120,210,255,0)");
  g.fillStyle = hoja; g.fillRect(0, yBar - 30, 1080, 80);
  g.restore();
  const xAv = k.mez(470, 540, k.suave(k.tramo(tp, f.inicio, Tav)));
  avion(g, xAv, yBar + 10, 1.15);
  g.fillStyle = "#243044";
  g.beginPath(); g.moveTo(0, 1500); g.lineTo(0, 1920); g.lineTo(1080, 1920); g.lineTo(1080, 1520);
  g.lineTo(900, 1380); g.lineTo(740, 1480); g.lineTo(540, 1320); g.lineTo(320, 1460); g.lineTo(140, 1360); g.closePath(); g.fill();
  const calma = k.suave(k.tramo(tp, Tpar - 0.2, Tpar + 0.3));
  g.fillStyle = `rgba(255,196,90,${0.45 + 0.55 * calma})`;
  for (const [x, y] of [[180, 1460], [250, 1520], [340, 1480], [430, 1560], [520, 1440], [610, 1500], [700, 1580], [790, 1480], [880, 1540], [960, 1460]]) {
    g.fillRect(x, y, 14, 18);
  }
  veloArriba(g, 0.55);
}

function mod(a) { return a - Math.floor(a); }
