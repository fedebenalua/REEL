// «un 0,1 % menos»: dos columnas de fichas casi iguales. La lupa enseña el hueco de una sola ficha.
import * as k from "#kit";
import { v } from "#voz";
import { sala, velo, lupa } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8);
const Tnum = f8.t("01"), Tdis = f8.t("discute");
const N = 9;

export function dibuja(g, t) {
  sala(g, "#140e12", "#1a1030", t);
  const crece = su(tr(t, f8.inicio, f8.inicio + 0.85));
  const n = Math.max(1, Math.round(crece * N));
  const lupaEn = su(tr(t, Tnum - 0.1, Tnum + 0.4));
  const flota = su(tr(t, Tnum, Tdis + 0.15)) * 40;
  const separa = su(tr(t, Tdis, Tdis + 0.85)) * 42;

  function ficha(x, y, al = 1) {
    g.save();
    g.globalAlpha = al;
    k.redondo(g, x, y, 168, 52, 14);
    const gr = g.createLinearGradient(x, y, x, y + 52);
    gr.addColorStop(0, "#ffe09a");
    gr.addColorStop(1, "#e0942c");
    g.fillStyle = gr;
    g.fill();
    g.fillStyle = "rgba(120,70,10,0.28)";
    g.fillRect(x + 16, y + 18, 90, 8);
    g.fillRect(x + 16, y + 32, 60, 6);
    g.restore();
  }

  const base = 1460;
  const paso = 64;
  for (let i = 0; i < n; i++) ficha(220 - separa * 0.2, base - (i + 1) * paso);
  for (let i = 0; i < n; i++) {
    const ultima = i === n - 1;
    ficha(700 + separa, base - (i + 1) * paso - (ultima ? flota + 18 : 0));
  }

  if (lupaEn > 0.04 && n > 2) {
    const lx = mez(980, 784, lupaEn);
    const ly = base - n * paso - flota - 8;
    lupa(g, lx, ly, 118, 0.6);
    g.save();
    g.globalCompositeOperation = "screen";
    g.globalAlpha = 0.18 * lupaEn;
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(lx - 16, ly - 16, 70, 0, 6.2832);
    g.fill();
    g.restore();
  }

  const numAl = su(tr(t, Tnum + 0.2, Tnum + 0.55));
  if (numAl > 0.02) k.pastilla(g, 540, 700, "0,1", "%", "255,214,120", numAl, 100);
  velo(g, 0.72);
}
