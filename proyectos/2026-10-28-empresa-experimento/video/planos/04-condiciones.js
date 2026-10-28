// «una frase de las condiciones»: el contrato, la línea que se enciende, el aceptar ya pulsado, y la grieta.
import * as k from "#kit";
import { v } from "#voz";
import { sala, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez } = k;
const f5 = v.frase(5);
const Tfra = f5.t("frase"), Tsi = f5.t("si"), Tdis = f5.t("discutido");

const az = k.azar(23);
const ANCHOS = Array.from({ length: 11 }, () => 0.38 + az() * 0.52);

export function dibuja(g, t) {
  sala(g, "#1a120c", "#0c0a09", t);
  const oro = su(tr(t, Tfra - 0.05, Tfra + 0.45));
  const acerca = 1 + 0.06 * su(tr(t, f5.inicio, Tsi));
  const grieta = su(tr(t, Tdis - 0.05, Tdis + 0.55)) * 46;
  const pulsa = su(tr(t, Tsi - 0.1, Tsi + 0.35));

  g.save();
  g.translate(540, 1100);
  g.scale(acerca, acerca);
  g.translate(-540, -1100);

  // dos mitades del mismo papel
  for (const lado of [-1, 1]) {
    g.save();
    g.translate(lado * grieta, 0);
    g.beginPath();
    g.rect(lado < 0 ? 0 : 540, 0, 540, 1920);
    g.clip();
    const x = 120, y = 500, w = 840, h = 1180;
    k.redondo(g, x, y, w, h, 36);
    const papel = g.createLinearGradient(x, y, x + w, y + h);
    papel.addColorStop(0, "#fbf6ec");
    papel.addColorStop(0.5, "#f3e6cc");
    papel.addColorStop(1, "#e7d2ae");
    g.fillStyle = papel;
    g.fill();
    // sombra del lomo
    g.fillStyle = "rgba(80,50,20,0.08)";
    g.fillRect(x, y, 28, h);

    for (let i = 0; i < ANCHOS.length; i++) {
      const ly = y + 80 + i * 62;
      const es = i === 3;
      const lw = (es ? 0.72 : ANCHOS[i]) * (w - 140);
      k.redondo(g, x + 70, ly, lw, es ? 28 : 16, 8);
      if (es) {
        g.fillStyle = `rgb(${k.mezRgb("150,120,70", "210,140,20", oro)})`;
      } else g.fillStyle = "rgba(90,60,30,0.22)";
      g.fill();
    }

    g.restore();
  }

  if (grieta > 2) {
    g.fillStyle = `rgba(10,7,5,${Math.min(0.92, grieta / 34)})`;
    g.fillRect(534, 560, 12, 880);
  }

  // el botón se queda entero, por encima de la grieta
  const bx = 120, by = 1490, bw = 840;
  k.redondo(g, bx + 170, by + 8, bw - 340, 110, 55);
  const bg = g.createLinearGradient(0, by, 0, by + 110);
  bg.addColorStop(0, "#248a52");
  bg.addColorStop(1, "#0e4d2c");
  g.fillStyle = bg;
  g.fill();
  g.fillStyle = "#fff";
  g.font = "800 52px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("Aceptar", bx + bw / 2 - 24, by + 66);
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 8;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(bx + bw - 250, by + 66);
  g.lineTo(bx + bw - 226, by + 90);
  g.lineTo(bx + bw - 186, by + 42);
  g.stroke();
  if (pulsa > 0.05) {
    g.save();
    g.globalCompositeOperation = "screen";
    g.globalAlpha = 0.4 * Math.sin(Math.min(1, pulsa) * Math.PI) * (1 - su(tr(t, Tdis, Tdis + 0.35)));
    k.redondo(g, bx + 150, by - 8, bw - 300, 146, 60);
    g.fillStyle = "#ffe9a8";
    g.fill();
    g.restore();
  }

  k.brillo(g, 540, 760, 420, "255,190,80", 0.1 * oro * (1 - su(tr(t, Tsi, Tsi + 0.4))));
  const bajaLuz = su(tr(t, Tfra + 0.2, Tsi + 0.15));
  const aLuz = Math.sin(Math.min(1, Math.max(0, bajaLuz)) * Math.PI);
  if (aLuz > 0.01) {
    g.save();
    g.globalAlpha = 0.18 * aLuz;
    g.fillStyle = "#f0c36a";
    k.redondo(g, 220, mez(760, 1460, bajaLuz), 640, 28, 14);
    g.fill();
    g.restore();
  }
  g.restore();
  velo(g, 0.84);
}
