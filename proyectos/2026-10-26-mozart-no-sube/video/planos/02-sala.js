// El cuarto de la prueba: una persona, la sonata, la voz y el silencio.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, persona, piano, notasVolando, velo } from "../mundo.js";

export const desde = "treinta";
export const entrada = "corte";

const f4 = v.frase(4);
const f5 = v.frase(5);
const f6 = v.frase(6);
const f7 = v.frase(7);
const Ttres = f4.t("tres");
const Tson = f5.t("sonata");
const Trel = f6.t("relajate");
const Tsil = f7.t("silencio");

const FILA = [
  [140, 760, 0.5, 2],
  [300, 720, 0.46, 4],
  [620, 710, 0.46, 1],
  [860, 740, 0.48, 5],
  [180, 900, 0.42, 3],
  [820, 880, 0.42, 0],
];

function lampara(g, x, y, rgb, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = "rgba(255,236,200,0.35)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(x, 560);
  g.lineTo(x, y - 36);
  g.stroke();
  g.fillStyle = `rgb(${rgb})`;
  k.redondo(g, x - 34, y - 28, 68, 44, 16);
  g.fill();
  const halo = g.createRadialGradient(x, y + 20, 8, x, y + 80, 160);
  halo.addColorStop(0, `rgba(${rgb},0.3)`);
  halo.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = halo;
  g.fillRect(x - 180, y - 20, 360, 280);
  g.restore();
}

function altavoz(g, x, y, s, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.beginPath();
  g.ellipse(0, 150, 120, 18, 0, 0, Math.PI * 2);
  g.fill();
  const caja = g.createLinearGradient(-110, -120, 110, 140);
  caja.addColorStop(0, "#3a4650");
  caja.addColorStop(0.5, "#1c262e");
  caja.addColorStop(1, "#0c1216");
  g.fillStyle = caja;
  k.redondo(g, -120, -130, 240, 270, 28);
  g.fill();
  g.strokeStyle = "rgba(180,220,210,0.45)";
  g.lineWidth = 6;
  g.stroke();
  g.fillStyle = "#10241f";
  g.beginPath();
  g.arc(0, -10, 72, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#8fd8c4";
  g.lineWidth = 8;
  g.stroke();
  g.beginPath();
  g.arc(0, -10, 28, 0, Math.PI * 2);
  g.stroke();
  g.restore();
}

function auriculares(g, x, y, s, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.scale(s, s);
  g.strokeStyle = "#e8c56a";
  g.lineWidth = 14;
  g.lineCap = "round";
  g.beginPath();
  g.arc(0, 10, 70, Math.PI, 0);
  g.stroke();
  g.fillStyle = "#3a2a12";
  g.beginPath();
  g.arc(-70, 16, 28, 0, Math.PI * 2);
  g.arc(70, 16, 28, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#ffd56a";
  g.lineWidth = 4;
  g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  const son = k.suave(k.tramo(t, Tson - 0.08, Tson + 0.4));
  const rel = k.suave(k.tramo(t, Trel - 0.08, Trel + 0.45));
  const sil = k.suave(k.tramo(t, Tsil - 0.1, Tsil + 0.45));
  const modo = sil > 0.55 ? "quieto" : rel > 0.55 ? "calma" : "oro";
  const tinte = sil > 0.4 ? "#1a2744" : rel > 0.4 ? "#14302c" : "#3a2418";
  cuarto(g, tinte);

  const luces = k.suave(k.tramo(t, Ttres - 0.05, Ttres + 0.4));
  lampara(g, 220, 700, "255,190,70", luces * (1 - rel * 0.85));
  lampara(g, 540, 660, "110,210,180", luces * rel * (1 - sil));
  lampara(g, 840, 700, "120,160,240", luces * sil);

  const baile = (1 - sil) * Math.sin(t * 3.1) * 28;
  for (const [x, y, s, i] of FILA) persona(g, x, y + baile * 0.4, s, "quieto", i);

  const alMus = son * (1 - rel);
  g.save();
  g.globalAlpha = alMus;
  piano(g, 220, 1210, 0.82, { brillo: 1, tecla: alMus > 0.2 ? t * 8 : 0 });
  piano(g, 690, 1190, 0.76, { brillo: 1, espejo: -1, tecla: alMus > 0.2 ? t * 8 + 2 : 0 });
  g.restore();
  persona(g, 420, 980 + baile, 2.55, modo, 2);
  notasVolando(g, t, 500, 1040, alMus, 0.7);

  altavoz(g, 760, 1120, k.mez(0.8, 1.55, rel), rel * (1 - sil));

  if (sil > 0.04) {
    g.save();
    g.globalAlpha = sil;
    const ven = g.createLinearGradient(700, 620, 960, 1100);
    ven.addColorStop(0, "rgba(255,210,140,0.05)");
    ven.addColorStop(0.45, "rgba(255,186,90,0.7)");
    ven.addColorStop(1, "rgba(255,150,60,0.05)");
    g.fillStyle = ven;
    g.fillRect(700, 640, 250, 360);
    g.strokeStyle = "#f0d7a8";
    g.lineWidth = 10;
    g.strokeRect(712, 652, 226, 336);
    g.beginPath();
    g.moveTo(825, 652);
    g.lineTo(825, 988);
    g.moveTo(712, 820);
    g.lineTo(938, 820);
    g.stroke();
    g.restore();
  }
  auriculares(g, 300, 1320, k.mez(0.4, 1.35, sil), sil);
  velo(g, 0.7);
}
