// «¿Sabías que el mar Mediterráneo llegó a secarse casi por completo? Se cerró el paso al Atlántico,
// y el sol se quedó con el mar. Hoy el océano entra por ese paso y repone lo que el sol se bebe.»
// Un solo sitio: la cuenca. La cámara va del agua que se desploma a la sal, al paso que se cierra, y al mar que hoy se llena.
import * as k from "#kit";
import { v } from "#voz";
import { velo, cielo, sol, sueloSal, lago, montanas, lamina, espuma, lluvia, vapor, mar } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tsecarse = f1.t("secarse");
const Tcompleto = f1.t("completo");
const Tcerro = f2.t("cerro");
const Tsol = f2.t("sol");
const Toceano = f3.t("oceano");
const Tentra = f3.t("entra");
const Tbebe = f3.t("bebe");

export function dibuja(g, t) {
  // 0 pegados a la caída; en «secarse» la cuenca entera; luego el viaje al paso
  const abre = k.suave(k.tramo(t, 0.25, Tsecarse + 0.55));
  const alPaso = k.suave(k.tramo(t, Tcompleto - 0.15, Tcerro + 0.05));
  const cierre = k.suave(k.tramo(t, Tcerro - 0.08, Tcerro + 0.62));
  const solAl = k.suave(k.tramo(t, Tsol - 0.2, Tsol + 0.55));
  const abreHoy = k.suave(k.tramo(t, Toceano - 0.12, Tentra + 0.35));
  const llena = k.suave(k.tramo(t, Toceano + 0.15, Tbebe + 0.2));
  const calor = k.mez(0.25, 0.85, solAl) * (1 - llena * 0.65);

  cielo(g, calor);
  sol(g, k.mez(860, 620, solAl), k.mez(430, 560, abre * (1 - alPaso * 0.3)), k.mez(70, 150, solAl), 0.55 + 0.45 * solAl);

  // el suelo: de cerca (horizonte bajo, corre deprisa) a la cuenca abierta
  const yh = k.mez(980, 640, abre) + alPaso * 40;
  const vel = k.mez(1.6, 0.15, abre) * (1 - llena);
  if (llena < 0.98) sueloSal(g, yh, t, vel, 1 - llena * 0.92);
  // el mar de hoy crece desde el paso (arriba-izquierda) hacia nosotros
  if (llena > 0.02) {
    const yMar = k.mez(1500, yh - 10, llena);
    mar(g, yMar, 900, t, k.suave(k.tramo(llena, 0.02, 0.25)));
  }

  montanas(g, yh + 8, abre * (1 - alPaso * 0.85) * (1 - llena * 0.3));

  // lago que queda: el «casi». Grande, en el centro, y se tapa cuando el mar de hoy lo cubre.
  const lagoAl = abre * (1 - k.suave(k.tramo(llena, 0.35, 0.85))) * (1 - alPaso * 0.35);
  lago(g, 540, k.mez(1360, 1240, abre), k.mez(90, 460, abre), k.mez(32, 190, abre), t, lagoAl);

  // la lámina que se desploma, a todo el ancho en el fotograma 0, y revienta en «secarse»
  const cae = 1 - k.suave(k.tramo(t, Tsecarse - 0.35, Tsecarse + 0.25));
  if (cae > 0.02) {
    const y1 = k.mez(1320, yh + 90, abre);
    lamina(g, 540, k.mez(340, 500, abre), y1, k.mez(980, 360, abre), t, cae);
    lluvia(g, t, 360, y1, cae);
    espuma(g, 540, y1, k.mez(520, 240, abre), 42, cae);
    if (t > Tsecarse - 0.05 && t < Tsecarse + 0.7) k.fogonazo(g, 540, y1, t - (Tsecarse - 0.02), 980, "255,244,220");
  }

  // el paso entra desde los lados. En «cerró» los cabos se tocan; hoy se abren y entra el río.
  if (alPaso > 0.01) {
    const gap = k.mez(460, 0, cierre) * (1 - abreHoy) + 420 * abreHoy;
    const fuera = (1 - alPaso) * 520;
    const xL = 540 - gap / 2 - fuera;
    const xR = 540 + gap / 2 + fuera;
    // el Atlántico, detrás, siempre visible por encima de la roca
    const banda = k.suave(k.tramo(alPaso, 0.15, 0.7));
    g.save();
    g.globalAlpha *= banda;
    const ag = g.createLinearGradient(0, 600, 0, 780);
    ag.addColorStop(0, "#d8f7ff");
    ag.addColorStop(1, "#0a7ec0");
    g.fillStyle = ag;
    g.fillRect(80, 610, 920, 150);
    g.restore();
    rocaMarco(g, -1, xL, 820);
    rocaMarco(g, 1, xR, 820);
    if (gap > 36 && abreHoy > 0.15) {
      lamina(g, 540, 700, k.mez(1560, yh + 30, llena), Math.min(gap, 420), t * 1.5, abreHoy * (1 - llena * 0.65));
      espuma(g, 540, k.mez(1500, yh + 50, llena), Math.min(gap, 380) * 0.7, 26, abreHoy * (1 - llena * 0.4));
    }
    // el sol por delante de la roca, para que en «sol» se vea
    sol(g, 780, 470, k.mez(90, 160, solAl), solAl * 0.95);
  }

  vapor(g, t, solAl * (0.35 + 0.65 * (1 - llena)) * (1 - alPaso * 0.4));

  // reposo: al final el mar lleno brilla, sin la caída
  if (llena > 0.85) {
    k.brillo(g, 540, yh + 180, 700, "cian", 0.12 * llena);
  }

  velo(g, 0.62 + 0.15 * (1 - abre));
}

// Cabo que enmarca el paso: el borde interior es una pared, no un montón que tape el hueco.
function rocaMarco(g, dir, borde, cima) {
  g.save();
  g.beginPath();
  if (dir < 0) {
    g.moveTo(-80, 1360);
    g.lineTo(-80, cima + 40);
    g.quadraticCurveTo(borde - 220, cima - 20, borde - 20, cima + 40);
    g.lineTo(borde, cima + 160);
    g.lineTo(borde - 30, 1360);
  } else {
    g.moveTo(1160, 1360);
    g.lineTo(1160, cima + 30);
    g.quadraticCurveTo(borde + 220, cima - 10, borde + 20, cima + 50);
    g.lineTo(borde, cima + 170);
    g.lineTo(borde + 30, 1360);
  }
  g.closePath();
  const lg = g.createLinearGradient(dir < 0 ? 0 : 1080, cima, borde, 1500);
  lg.addColorStop(0, "#f0c29a");
  lg.addColorStop(0.45, "#c46b45");
  lg.addColorStop(1, "#5c2e24");
  g.fillStyle = lg;
  g.fill();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.4;
  g.drawImage(k.manchas, dir < 0 ? -40 : 400, cima - 40, 700, 900);
  g.restore();
}
