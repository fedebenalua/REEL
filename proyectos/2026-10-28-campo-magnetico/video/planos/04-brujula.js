// «Si se apagara del todo, la brújula de tu móvil no encontraría el norte.»
// El móvil llena la pantalla. La aguja da vueltas y se para torcida en «norte». La N se apaga.
import * as k from "#kit";
import { v } from "#voz";
import { veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio - 0.04;

const f = v.frase(9);
const Tn = f.t("norte");
const corte = v.frase(10).inicio - 0.04;

export function dibuja(g, t) {
  const tp = Math.min(t, corte - 0.22);
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#3a2418"); fondo.addColorStop(0.35, "#8a5a32"); fondo.addColorStop(1, "#c48a48");
  g.fillStyle = fondo; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, -200, 200, 1600, 1800); g.restore();
  k.brillo(g, 180, 420, 280, "amarilla", 0.25);
  const x = 190, y = 500, w = 700, h = 980;
  g.save();
  g.fillStyle = "rgba(40,20,10,0.25)"; k.redondo(g, x + 24, y + 30, w, h, 70); g.fill();
  const cuerpo = g.createLinearGradient(x, y, x + w, y);
  cuerpo.addColorStop(0, "#2a2e33"); cuerpo.addColorStop(0.5, "#4a5158"); cuerpo.addColorStop(1, "#1c2024");
  g.fillStyle = cuerpo; k.redondo(g, x, y, w, h, 64); g.fill();
  g.fillStyle = "#0e1a22"; k.redondo(g, x + 28, y + 28, w - 56, h - 56, 48); g.fill();
  const cx = 540, cy = 980, R = 250;
  g.beginPath(); g.arc(cx, cy, R, 0, 6.28);
  const dial = g.createRadialGradient(cx - 40, cy - 50, 20, cx, cy, R);
  dial.addColorStop(0, "#f7fbff"); dial.addColorStop(1, "#c5d4e4");
  g.fillStyle = dial; g.fill();
  g.strokeStyle = "#8aa0b4"; g.lineWidth = 8; g.stroke();
  const u = k.suave(k.tramo(tp, Tn - 0.85, Tn + 0.22));
  const ang = 2.5 + (1 - u) * (1 - u) * 16;
  const nAl = 1 - k.suave(k.tramo(tp, Tn - 0.15, Tn + 0.35));
  g.save(); g.translate(cx, cy);
  g.font = "800 64px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
  const letras = [["N", 0, -R + 48], ["E", R - 48, 0], ["S", 0, R - 48], ["O", -R + 48, 0]];
  for (const [L, lx, ly] of letras) {
    g.fillStyle = L === "N" ? `rgba(220,40,40,${0.35 + 0.65 * nAl})` : "#243040";
    g.fillText(L, lx, ly);
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 6.2832;
    g.strokeStyle = "#243040"; g.lineWidth = i % 3 === 0 ? 6 : 3;
    g.beginPath(); g.moveTo(Math.sin(a) * (R - 18), -Math.cos(a) * (R - 18)); g.lineTo(Math.sin(a) * (R - 36), -Math.cos(a) * (R - 36)); g.stroke();
  }
  g.rotate(ang);
  k.brillo(g, 0, -190, 120, "roja", 0.85);
  g.fillStyle = "#e23b32"; g.beginPath(); g.moveTo(0, -210); g.lineTo(26, 16); g.lineTo(0, 0); g.closePath(); g.fill();
  g.fillStyle = "#f4f7fb"; g.beginPath(); g.moveTo(0, 170); g.lineTo(-22, -8); g.lineTo(0, 0); g.closePath(); g.fill();
  g.beginPath(); g.arc(0, 0, 16, 0, 6.28); g.fillStyle = "#243040"; g.fill();
  g.restore();
  g.restore();
  veloArriba(g, 0.4);
}
