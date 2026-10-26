// «Y ella vio la pirámide mejor que tú: aún estaba forrada de piedra blanca pulida, y brillaba al sol.»
// Otro sitio: la Gran Pirámide de día, como la ves hoy (escalones color arena, la cima gastada). Se entra con un corte
// en «pirámide». La cámara se acerca despacio todo el plano.
// - «forrada de piedra blanca»: el forro blanco sube desde la base hasta la punta, y la punta vuelve.
// - «pulida»: un reflejo recorre las caras.
// - «y brillaba al sol»: el sol se refleja en la cara de la derecha: un destello enorme, que se apaga antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { piramide, dunas } from "../mundo.js";

export const desde = (vz) => vz.frase(8).t("piramide");

const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8);
const T0 = f8.t("piramide"), Tfor = f8.t("forrada"), Tbla = f8.t("blanca"), Tpul = f8.t("pulida"), Tbri = f8.t("brillaba"), Tsol = f8.t("sol"), Fin = f8.fin;
export const destello = Tbri + 0.12;

const PIR = { A: [520, 660], BL: [-90, 1520], BR: [760, 1520], BK: [1190, 1370] };
const SOL = [1010, 330];

export function dibuja(g, t) {
  const esc = mez(1, 1.07, su(tr(t, T0, Fin + 0.1)));
  g.setTransform(esc, 0, 0, esc, 540 - 540 * esc, 1000 - 1000 * esc);
  // el cielo de mediodía y el sol
  const gr = g.createLinearGradient(0, -200, 0, 1400); gr.addColorStop(0, "#2a6fc4"); gr.addColorStop(0.7, "#8ec7ee"); gr.addColorStop(1, "#e8f2f2");
  g.fillStyle = gr; g.fillRect(-200, -300, 1500, 1800);
  k.brillo(g, SOL[0], SOL[1], 900, "255,240,200", 0.7); k.brillo(g, SOL[0], SOL[1], 220, "255,255,240", 1);
  dunas(g, true);
  // la pirámide
  const forro = su(tr(t, Tfor - 0.1, Tbla + 0.25)), punta = su(tr(forro, 0.86, 1));
  piramide(g, PIR, { dia: true, forro, punta, rota: 1 - punta, brillo: mez(-0.2, 1.2, su(tr(t, Tpul - 0.15, Tbri + 0.1))), brilloAl: 0.45 });
  // la sombra en la arena, a la izquierda
  g.save(); g.globalCompositeOperation = "multiply";
  g.beginPath(); g.moveTo(PIR.BL[0], PIR.BL[1]); g.lineTo(-300, 1560); g.lineTo(-300, 1700); g.lineTo(PIR.BR[0], PIR.BL[1] + 6); g.closePath();
  g.fillStyle = "rgba(150,110,80,0.6)"; g.fill(); g.restore();
  // el destello del sol en la cara pulida
  const u = t - destello;
  if (u > -0.2) {
    const X = 830, Y = 1000, a = Math.exp(-Math.max(0, u) * 1.7) * su(tr(u, -0.2, 0.05)) * (1 - su(tr(t, Fin - 0.25, Fin + 0.05)));
    k.brillo(g, X, Y, 2600, "255,240,200", a); k.brillo(g, X, Y, 700, "255,255,255", a);
    g.save(); g.globalCompositeOperation = "lighter"; g.translate(X, Y);
    for (let i = 0; i < 6; i++) {
      g.rotate(Math.PI / 6 + 0.05 * Math.sin(t)); const L = 1200 * a * (i % 2 ? 0.6 : 1);
      const lg = g.createLinearGradient(-L, 0, L, 0); lg.addColorStop(0, "rgba(255,250,230,0)"); lg.addColorStop(0.5, `rgba(255,250,230,${0.7 * a})`); lg.addColorStop(1, "rgba(255,250,230,0)");
      g.fillStyle = lg; g.fillRect(-L, -7, 2 * L, 14);
    }
    g.restore();
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(20,50,100,0.45)"); vg.addColorStop(1, "rgba(20,50,100,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
