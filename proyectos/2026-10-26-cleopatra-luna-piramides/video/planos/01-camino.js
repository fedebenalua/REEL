// Frases 1 a 6 (hasta «cinta»): el camino del tiempo, con una sola cámara.
// - Fotograma 0: la moneda de oro de Cleopatra, enorme, girando, sube disparada por la cinta de luz; la cámara se aleja
//   de golpe y se ve todo: la pirámide abajo, la Luna arriba y la moneda, que frena más cerca de la Luna.
//   «Luna»: la Luna se enciende y el tramo azul brilla; «pirámides»: la pirámide se enciende y brilla el tramo dorado.
// - «Suena a error, pero las cuentas salen»: salen las marcas de cada siglo por la cinta, de abajo arriba.
// - «La Gran Pirámide se terminó»: la cámara baja a la pirámide; «terminó»: baja su punta y encaja con un destello;
//   «4.500»: «hace 4.500 años».
// - «Cleopatra nació casi 2.500 años después»: la cámara sube por el tramo dorado con la cifra corriendo hasta la moneda.
// - «Y desde que murió hasta que Armstrong pisó la Luna»: sigue subiendo por el tramo azul hasta la Luna; «pisó»: la
//   huella. «pasaron unos 2.000»: la cámara se aleja y quedan los dos tramos con su cifra.
// - «Si toda esa historia»: se aleja un poco más y reposa antes del corte en «cinta».
import * as k from "#kit";
import { v } from "#voz";
import { APICE, Y0, YCLEO, Y1, LUNA } from "../mundo.js";
import { escena, llaves } from "../camino.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const Tluna = f1.t("luna"), Tpir = f1.t("piramides"), Tsue = f2.inicio, Terr = f2.t("error"), Tcue = f2.t("cuentas"), Fin2 = f2.fin;
const T3 = f3.inicio, Tter = f3.t("terminó"), T45 = f3.t("4500");
const T4 = f4.inicio, T25 = f4.t("2500"), Fin4 = f4.fin;
const T5 = f5.inicio, Tmur = f5.t("murió"), Tpis = f5.t("pisó"), Tlun2 = f5.t("luna"), Tpas = f5.t("pasaron"), T20 = f5.t("2000"), Fin5 = f5.fin;
const T6 = f6.inicio, Tcin = f6.t("cinta");

export const llegaPunta = Tter + 0.75;
const llegaMoneda = T4 + 2.1, llegaLuna = Tpis - 0.08;

// la cámara: centro y zoom, por claves
const Tcons = f1.t("construccion");
const CX = k.claves([[0, 540], [T3, 540], [T3 + 0.8, 560], [T4 + 0.1, 560], [llegaMoneda, 540], [Tpas, 540], [Tpas + 1.2, 540]]);
const CY = k.curva([[0, Y0 + 40], [1.4, YCLEO], [1.8, 990], [Tluna - 0.05, 990], [Tluna + 0.45, 760], [Tcons, 760], [Tpir - 0.05, 1180], [Tsue - 0.1, 1180], [Terr + 0.4, 990], [T3, 990], [T3 + 0.85, 1320], [T4 + 0.1, 1320], [llegaMoneda, YCLEO], [Tmur, YCLEO], [llegaLuna, LUNA[1] + 20], [Tpas, LUNA[1] + 20], [Tpas + 1.3, 990], [T6, 990], [Tcin - 0.3, 985]], -420, 0);
const Z = k.curva([[0, 6.2], [0.35, 5.4], [1.8, 0.9], [Tluna - 0.05, 0.9], [Tluna + 0.45, 1.55], [Tcons, 1.55], [Tpir - 0.05, 1.45], [Tsue - 0.1, 1.45], [Terr + 0.4, 0.9], [T3, 0.9], [T3 + 0.85, 2.15], [T4 + 0.1, 2.15], [llegaMoneda, 2.7], [Tmur, 2.7], [llegaLuna, 5.0], [Tpas, 5.0], [Tpas + 1.3, 0.9], [T6, 0.9], [Tcin - 0.3, 0.84]], -2, 0);
export const camara = (t) => ({ cx: CX(t), cy: CY(t), z: Z(t) });

// la moneda: sube disparada de la pirámide a su sitio, girando
const yMon = k.curva([[0, Y0 - 10], [1.4, YCLEO]], -330, 0);
const giro = (t) => 4 * Math.PI * entra(tr(t, 0, 1.7)) + 2 * Math.PI * su(tr(t, Terr - 0.2, Terr + 0.6)) + 2 * Math.PI * su(tr(t, llegaMoneda - 0.35, llegaMoneda + 0.45));

export function dibuja(g, t) {
  const c = camara(t);
  const luzLuna = 0.9 * k.pulso(t, Tluna + 0.15, 0.35) + (t > T5 ? 0.3 * su(tr(t, Tmur, llegaLuna)) * (1 - su(tr(t, Tpas, Tpas + 1))) : 0);
  const luzPir = 0.9 * k.pulso(t, Tpir + 0.2, 0.35);
  const marcas = su(tr(t, Terr + 0.25, Tcue + 0.7));
  const puntaDy = 260 * Math.pow(1 - tr(t, Tter - 0.35, llegaPunta), 2.2);
  escena(g, t, c, {
    luzLuna, luzPir, marcas,
    alOro: 0.75 + 0.6 * luzPir, alAzul: 0.75 + 0.6 * k.pulso(t, Tluna + 0.15, 0.35),
    flujo: 1 - su(tr(t, 1.2, 2.2)),
    punta: t < Tter - 0.35 ? 0 : 1, puntaDy,
    fogPunta: t > llegaPunta ? t - llegaPunta : undefined,
    yMoneda: yMon(t), escMoneda: 1, giro: giro(t), luzMoneda: 0.6 * (1 - tr(t, 0.8, 2)),
    huella: su(tr(t, Tpis - 0.02, Tpis + 0.3)),
    pulso: t > T4 && t < llegaMoneda + 0.1 ? { ya: Y0, yb: YCLEO, u: su(tr(t, T4 + 0.1, llegaMoneda)), color: "255,200,110" }
      : t > Tmur - 0.1 && t < llegaLuna + 0.1 ? { ya: YCLEO, yb: Y1, u: su(tr(t, Tmur - 0.1, llegaLuna)), color: "150,200,255" } : null,
  });
  // «hace 4.500 años»
  const a45 = su(tr(t, Tter + 0.2, Tter + 0.45)) * (1 - su(tr(t, T4 - 0.1, T4 + 0.3))), u45 = su(tr(t, Tter + 0.3, T45 + 0.15));
  k.pastilla(g, 540, 1330, "hace " + k.fmt(Math.round(4500 * u45 / 100) * 100), "años", "235,240,255", a45, 104);
  // la cifra que corre hasta la moneda
  const u4 = su(tr(t, T4 + 0.1, llegaMoneda)), a4 = su(tr(t, T4 + 0.05, T4 + 0.3)) * (1 - su(tr(t, Tmur - 0.2, Tmur + 0.2)));
  k.pastilla(g, 540, 1330, k.fmt(Math.round(2500 * u4 / 10) * 10), "años", "255,200,110", a4, 104);
  // los dos tramos con su cifra, al alejarse
  const aLl = su(tr(t, T20 - 0.4, T20 + 0.1));
  if (aLl > 0) llaves(g, c, { oro: aLl, azul: su(tr(t, T20 - 0.15, T20 + 0.25)) });
}
