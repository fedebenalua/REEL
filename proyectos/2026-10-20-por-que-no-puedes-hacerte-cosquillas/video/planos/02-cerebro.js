// «Es porque tu cerebro sabe lo que vas a sentir antes de sentirlo. Cada vez que mueves la mano, el cerebelo, aquí
// detrás, calcula lo que vas a notar. Y cuando llega justo lo que esperaba, le baja el volumen. Pero los dedos de otro no
// los puede predecir, y te llegan a todo volumen.»
// Otro sitio: el cuerpo de luz (../luz.js), con una sola cámara que sube y baja por el nervio. Corte en «Es».
// - «cerebro»: se enciende; «sabe lo que vas a sentir»: en la franja del tacto aparece en cian la cosquilla que espera;
//   «antes» entera; «de sentirlo» llega la de verdad, en oro, y encaja con ella.
// - «mueves la mano»: la cámara baja de golpe por el nervio hasta tu palma, donde tus dedos (pijama) le hacen
//   cosquillas. «cerebelo»: sube de golpe; se enciende, con su nombre; «aquí detrás», un anillo; «calcula», dentro se
//   dibuja en cian la cosquilla que vas a notar.
// - «llega»: la cámara se aleja hasta ver el cuerpo entero y sube por el nervio un pulso de oro; «esperaba»: la copia
//   cian sale del cerebelo y llegan juntos a la franja. «baja el volumen»: el oro se apaga y la barra baja de 10 a 1.
// - «dedos de otro»: abajo, los dedos de la sudadera roja; chispas. «predecir»: en el cerebelo, nada (un anillo vacío que
//   parpadea). «todo volumen»: sube un pulso enorme, la franja revienta y la barra se llena.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, palma, manoDedos, chispas, velo, ORO, CIAN, ROJO } from "../mundo.js";
import { cerebro, bandaTacto, nervio, pulso, enCopia, garabato, volumen, fondoLuz, CEREBELO, FRANJA_MEDIO } from "../luz.js";
import { camino2D } from "../mundo.js";

export const desde = (v) => v.frase(3).inicio;

const { suave: su, tramo: tr, mez, pulso: late } = k;
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const T0 = f3.inicio, Tcer = f3.t("cerebro"), Tsen = f3.t("sentir"), Tant = f3.t("antes"), Tsto = f3.t("sentirlo");
const Tmue = f4.t("mueves"), Tmano = f4.t("mano"), Tcbl = f4.t("cerebelo"), Taqui = f4.t("aqui"), Tcal = f4.t("calcula"), Tnot = f4.t("notar");
const Tlle = f5.t("llega"), Tesp = f5.t("esperaba"), Tbaja = f5.t("baja"), Tvol = f5.t("volumen");
const Tded = f6.t("dedos"), Tpre = f6.t("predecir"), Tllg = f6.t("llegan"), Ttodo = f6.t("todo"), Fin = v.frase(7).inicio;

const MANO = [-40, 2420];                       // donde le hacen cosquillas a tu palma (el final del nervio)
const cam = camino2D([
  [T0, [0.95, 0, -20]], [Tcer + 0.3, [1.0, 0, -40]], [Tant - 0.2, [1.35, -40, -120]], [Tsto + 0.6, [1.35, -50, -100]],
  [Tmue - 0.25, [1.15, -40, 250]], [Tmano, [0.85, -40, 2330]], [Tcbl - 0.2, [0.85, -40, 2300]],
  [Tcbl + 0.3, [1.25, 200, 150]], [Taqui + 0.3, [1.45, 240, 180]], [Tnot, [1.5, 250, 190]],
  [Tlle - 0.2, [1.4, 230, 170]], [Tlle + 0.35, [0.42, 0, 1150]], [Tesp - 0.25, [0.45, 0, 1000]], [Tesp + 0.3, [0.85, -30, 30]], [Tvol + 0.6, [0.88, -40, 30]],
  [f6.inicio, [0.88, -40, 60]], [Tded + 0.25, [0.85, -40, 2330]], [Tpre - 0.45, [0.85, -40, 2300]],
  [Tpre + 0.25, [0.9, 60, 60]], [Ttodo - 0.3, [0.9, 40, 40]], [Ttodo + 0.4, [0.8, 20, 20]], [Fin, [0.8, 20, 20]],
]);

// ---------------------------------------------------------------- lo que pasa, cada cosa en función de t
// Tus dedos en tu palma (frase 4) y los del otro (frase 6): cuándo están [entra0, entra1, sale0, sale1].
const esta = (t, a, b, c, d) => su(tr(t, a, b)) * (1 - su(tr(t, c, d)));
const tuyos = (t) => esta(t, Tmue - 0.5, Tmue - 0.1, Tcbl - 0.15, Tcbl + 0.2);
const suyos = (t) => esta(t, f6.inicio, Tded + 0.1, Tpre + 0.1, Tpre + 0.45);
// La cian en la franja (lo que espera) y el oro (lo que llega).
const cianFranja = (t) => su(tr(t, Tsen - 0.1, Tant)) * (1 - su(tr(t, Tsto + 0.5, Tsto + 1.0))) + su(tr(t, Tesp + 0.2, Tesp + 0.45)) * (1 - su(tr(t, Tvol + 0.3, Tvol + 0.8)));
const oroFranja = (t) => su(tr(t, Tsto - 0.05, Tsto + 0.15)) * mez(1, 0.25, su(tr(t, Tsto + 0.25, Tsto + 0.7))) * (1 - su(tr(t, Tsto + 0.8, Tsto + 1.2)))
  + su(tr(t, Tesp + 0.25, Tesp + 0.45)) * mez(1, 0.12, su(tr(t, Tbaja - 0.05, Tvol + 0.3))) * (1 - su(tr(t, Tvol + 0.5, f6.inicio)))
  + su(tr(t, Ttodo - 0.15, Ttodo + 0.1)) * mez(1.6, 0.9, su(tr(t, Ttodo + 0.2, Fin - 0.3))) * (1 - su(tr(t, Fin - 0.6, Fin - 0.2)));
// Los pulsos por el nervio: [sale, llega, tamaño].
const PULSOS = [[Tsto - 0.6, Tsto, 0.8], [Tlle, Tesp + 0.35, 1.0], [Tpre - 0.5, Ttodo - 0.05, 1.9]];
// La copia del cerebelo: se dibuja en «calcula», sale en «esperaba» y llega a la franja con el pulso.
const copiaSale = Tesp - 0.25, copiaLlega = Tesp + 0.35;
const nVolumen = (t) => t < Tbaja ? 10 : t < f6.inicio ? mez(10, 1, su(tr(t, Tbaja, Tvol + 0.4))) : mez(1, 10, su(tr(t, Ttodo - 0.1, Ttodo + 0.35)));
const alVolumen = (t) => su(tr(t, Tesp + 0.25, Tesp + 0.5)) * (1 - su(tr(t, Ttodo + 0.8, Fin - 0.25)));

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  fondoLuz(g, t, cy * Z);
  vista(g, Z, cx, cy);
  // el nervio y el cerebro
  nervio(g, t);
  const enciende = su(tr(t, T0, Tcer + 0.2));
  cerebro(g, t, { brillo: mez(0.45, 1, enciende) + 0.3 * late(t, Ttodo + 0.05, 0.25) });
  // el cerebelo se enciende en «cerebelo» y cuando calcula
  const cbl = su(tr(t, Tcbl - 0.1, Tcbl + 0.25)) * (1 - su(tr(t, copiaLlega, copiaLlega + 0.5)));
  if (cbl > 0) k.brillo(g, CEREBELO[0], CEREBELO[1], 520, "190,140,255", 0.7 * cbl);
  // «aquí detrás»: un anillo que lo marca
  const an = su(tr(t, Taqui - 0.1, Taqui + 0.25)) * (1 - su(tr(t, Tcal - 0.1, Tcal + 0.3)));
  if (an > 0) {
    g.save(); g.strokeStyle = `rgba(${CIAN},${0.9 * an})`; g.lineWidth = 9; g.setLineDash([26, 16]); g.lineDashOffset = -t * 60;
    g.beginPath(); g.ellipse(CEREBELO[0], CEREBELO[1], 175 + 20 * (1 - an), 115 + 14 * (1 - an), 0.15, 0, 6.2832); g.stroke(); g.restore();
  }
  // su nombre
  const nom = su(tr(t, Tcbl - 0.05, Tcbl + 0.25)) * (1 - su(tr(t, Tcal - 0.3, Tcal)));
  if (nom > 0) { g.save(); sinVista(g); vista(g, 1, 0, 0); g.restore(); const P = [CEREBELO[0] - 150, CEREBELO[1] + 110]; g.save(); g.translate(P[0], P[1]); g.scale(1 / Z, 1 / Z); k.etiqueta(g, 0, 0, "cerebelo", "200,160,255", nom, 54); g.restore(); }
  // la copia: en «calcula» se dibuja dentro del cerebelo (crece de izquierda a derecha); en «esperaba» viaja a la franja
  const dibu = su(tr(t, Tcal - 0.05, Tnot + 0.2));
  if (t < copiaSale + 0.05) garabato(g, t, CEREBELO[0], CEREBELO[1], 200 * dibu, CIAN, dibu);
  else if (t < copiaLlega + 0.1) { const u = su(tr(t, copiaSale, copiaLlega)), [x, y] = enCopia(u); garabato(g, t, x, y, 200 - 60 * u, CIAN, 1 - 0.6 * tr(t, copiaLlega - 0.1, copiaLlega + 0.1)); }
  // «predecir» con los dedos del otro: el cerebelo busca y no sale nada (un anillo vacío que parpadea)
  const busca = su(tr(t, Tpre - 0.15, Tpre + 0.1)) * (1 - su(tr(t, Tllg - 0.2, Tllg + 0.2)));
  if (busca > 0) {
    const p = 0.5 + 0.5 * Math.cos((t - Tpre) * 14);
    k.brillo(g, CEREBELO[0], CEREBELO[1], 420, "190,140,255", 0.35 * busca * p);
    g.save(); g.strokeStyle = `rgba(${CIAN},${0.7 * busca * p})`; g.lineWidth = 7; g.setLineDash([14, 18]);
    g.beginPath(); g.ellipse(CEREBELO[0], CEREBELO[1], 160, 100, 0.15, 0, 6.2832); g.stroke(); g.restore();
  }
  // la franja del tacto
  bandaTacto(g, t, { base: enciende, oro: oroFranja(t), cian: cianFranja(t) });
  // «todo volumen»: la franja revienta en chispas
  chispas(g, t, () => FRANJA_MEDIO, (ts) => su(tr(ts, Ttodo - 0.1, Ttodo)) * (1 - su(tr(ts, Ttodo + 0.4, Ttodo + 0.7))), { escala: 1.6, sem: 77 });
  if (t > Ttodo - 0.1 && t < Ttodo + 1.4) k.fogonazo(g, FRANJA_MEDIO[0], FRANJA_MEDIO[1], t - Ttodo + 0.05, 1500, ORO);
  // los pulsos por el nervio
  for (const [a, b, tam] of PULSOS) {
    if (t < a - 0.05 || t > b + 0.1) continue;
    pulso(g, t, k.entra(tr(t, a, b)) * 0.97, tam, ORO, su(tr(t, a - 0.05, a + 0.15)) * (1 - tr(t, b - 0.05, b + 0.1)));
  }
  // la barra del volumen, a la izquierda, debajo de la frente
  g.save(); g.translate(-420, 440); g.scale(0.95, 0.95); volumen(g, 0, 0, nVolumen(t), alVolumen(t)); g.restore();
  // abajo, tu palma; tus dedos (pijama) o los del otro (roja) le hacen cosquillas
  const fT = 2 * Math.PI * 3 * t;
  g.save(); g.translate(MANO[0], MANO[1] + 200);
  const q = suyos(t);
  palma(g, t, { encoge: 0.8 * q + 0.15 * tuyos(t), agita: q });
  g.restore();
  for (const [p, tipo] of [[tuyos(t), "pijama"], [suyos(t), "roja"]]) {
    if (p <= 0.001) continue;
    const lado = tipo === "roja" ? 1 : -1, x = MANO[0] + lado * 30 + p * 70 * Math.sin(fT) + (1 - p) * lado * 900, y = MANO[1] - 30 + p * 35 * Math.sin(fT * 2) - (1 - p) * 1000;
    g.save(); g.translate(x, y); if (lado < 0) g.scale(-1, 1); g.rotate(0.65); g.scale(0.8, 0.8); manoDedos(g, t, tipo, p); g.restore();
  }
  chispas(g, t, (ts) => { const p = suyos(ts); return [MANO[0] + 30 + p * 70 * Math.sin(2 * Math.PI * 3 * ts), MANO[1] - 20]; }, (ts) => suyos(ts), { escala: 1.3, sem: 31 });
  sinVista(g);
  velo(g, 0.5, "8,6,28");
}

export const momentos = { cerebelo: Tcbl, baja: Tbaja, todo: Ttodo };
