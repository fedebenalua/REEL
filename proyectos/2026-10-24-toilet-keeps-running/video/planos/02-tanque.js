// Del rebose al flotador, a la goma, a la llave y otra vez al depósito. Un solo sitio.
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, aPant, velo, viñeta } from "../mundo.js";
import { dibujaTanque, TUBO_X, TUBO_TOP, FLAP, TORNILLO, VALV } from "../tanque.js";

export const desde = (vx) => vx.frase(3).inicio - 2 / 60;
export const entrada = "corte";

const { suave: su, tramo: tr, entra } = k;
const u = (t, a, b) => su(tr(t, a, b));

const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const Tspill = f3.t("spills"), Tfloat = f3.t("float");
const Tccw = f4.t("counterclockwise"), Tstops = f4.t("stops"), Tinch = f4.t("inch");
const Tflap = f5.t("flapper"), Tclock = f5.t("clockwise"), Tflush = f5.t("flush");
const Told = f6.t("old"), Tnew = f6.t("new"), Tsame = f6.t("same");
const Tslack = f7.t("slack"), Topen = f7.t("open");
const Trise = f8.t("rises"), Tstop2 = f8.t("stops"), Tquiet = f8.t("quiet");

const tubo = { x: TUBO_X, y: TUBO_TOP + 40, s: 1.85 };
const tornillo = { x: TORNILLO.x, y: TORNILLO.y + 30, s: 1.75 };
const nivel = { x: 60, y: -380, s: 1.32 };
const goma = { x: FLAP.x + 20, y: FLAP.y + 40, s: 2.05 };
const llave = { x: VALV.x, y: VALV.y, s: 1.7 };
const deposito = { x: 10, y: -240, s: 1.12 };
const CAMS = [
  [f3.inicio, tubo],
  [Tfloat - 0.25, tubo],
  [Tfloat, { x: -20, y: -500, s: 1.4 }],
  [Tccw - 0.15, tornillo],
  [Tstops + 0.05, tornillo],
  [Tinch, nivel],
  [Tflap - 0.45, nivel],
  [Tflap, goma],
  [Tclock - 0.7, goma],
  [Tclock - 0.2, llave],
  [Tclock + 0.55, llave],
  [Tflush, deposito],
  [Told - 0.15, { x: FLAP.x, y: FLAP.y - 10, s: 1.75 }],
  [Tsame + 0.35, { x: FLAP.x, y: FLAP.y - 10, s: 1.75 }],
  [Tslack, { x: -30, y: -220, s: 1.3 }],
  [Topen - 0.15, { x: -30, y: -220, s: 1.3 }],
  [Topen, llave],
  [Topen + 0.5, llave],
  [Trise, deposito],
  [Tquiet + 0.7, deposito],
];

export function dibuja(g, t) {
  const baja = u(t, Tccw - 0.15, Tstops);
  const nivelAlto = -560;
  const nivelBien = TUBO_TOP + 86;
  let nivelY = k.mez(nivelAlto, nivelBien, baja);
  const rebose = (1 - baja) * (t < Tflap - 0.4 ? 1 : 0);
  // a partir de la goma, el nivel se queda bien pero hay fuga, hasta vaciar
  const vacia = u(t, Tflush, Tflush + 0.7);
  if (t >= Tflush - 0.05) nivelY = k.mez(nivelBien, 40, vacia);
  const llena = u(t, Topen + 0.25, Tstop2);
  if (t >= Topen) nivelY = k.mez(80, nivelBien, llena);

  const fuga = t < Tflap - 0.3 ? 0 : t < Tflush ? u(t, Tflap - 0.35, Tflap + 0.15) : (1 - vacia) * 0.3;
  const viejaFuera = u(t, Told, Told + 0.55);
  const nueva = u(t, Tnew - 0.15, Tnew + 0.35);
    const sagN = k.mez(18, 150, u(t, Tslack - 0.15, Tslack + 0.35));
  const flujoCerrado = 1 - u(t, Tclock - 0.1, Tclock + 0.45);
  const flujoAbre = u(t, Topen, Topen + 0.4);
  const flujo = t < Tclock ? 1 : t < Topen ? flujoCerrado : flujoAbre;
  const llenado = t < Tflush ? (t > Tflap - 0.2 ? 0.9 : rebose * 0.4 + 0.35) : t < Topen ? 0 : (1 - u(t, Tquiet - 0.2, Tquiet + 0.35)) * flujoAbre;
  const giro = t < Topen ? u(t, Tclock - 0.15, Tclock + 0.45) * 1.4 : u(t, Topen, Topen + 0.45) * -1.3;
  const tornillo = -baja * 2.4;

  let guante = null;
  if (t > Tccw - 0.7 && t < Tstops + 0.15) {
    const al = u(t, Tccw - 0.7, Tccw - 0.25) * (1 - u(t, Tstops - 0.05, Tstops + 0.2));
    guante = { x: TORNILLO.x + 90, y: TORNILLO.y + 80, rot: -0.9 - baja * 0.7, esc: 1.7, al };
  } else if (t > Tclock - 0.7 && t < Tclock + 0.7) {
    const al = u(t, Tclock - 0.7, Tclock - 0.3) * (1 - u(t, Tclock + 0.4, Tclock + 0.7));
    guante = { x: VALV.x + 30, y: VALV.y + 20, rot: 0.2 + giro, esc: 1.35, al };
  } else if (t > Told - 0.35 && t < Tnew + 0.55) {
    const al = u(t, Told - 0.35, Told) * (1 - u(t, Tnew + 0.25, Tnew + 0.6));
    const y = k.mez(FLAP.y - 20, FLAP.y - 160, viejaFuera);
    guante = { x: FLAP.x + 80, y: y, rot: -0.3, esc: 1.2, al: t < Tnew ? al : al * (1 - nueva * 0.3) };
  } else if (t > Topen - 0.35 && t < Topen + 0.7) {
    const al = u(t, Topen - 0.35, Topen) * (1 - u(t, Topen + 0.4, Topen + 0.75));
    guante = { x: VALV.x + 40, y: VALV.y + 10, rot: -0.4 + flujoAbre * 0.6, esc: 1.3, al };
  }

  const arcoCCW = t > Tccw - 0.2 && t < Tstops;
  const arcoCW = t > Tclock - 0.15 && t < Tclock + 0.55;

  const cam = rutaCam(t, CAMS);
  g.save();
  g.translate(540, 960);
  g.scale(cam.s, cam.s);
  g.translate(-cam.x, -cam.y);
  dibujaTanque(g, t, {
    nivelY,
    rebose: t < Tflap ? 1 - baja : 0,
    fuga: t < Told ? fuga * (t < Tflush ? 1 : 0.2) : 0,
    vieja: 1 - viejaFuera,
    viejaY: viejaFuera * 180,
    nueva: t < Tnew - 0.2 ? 0 : nueva,
    abierta: t < Tflush
      ? (t > Tflap - 0.25 ? 1.05 : 0)
      : u(t, Tflush - 0.05, Tflush + 0.2) * (1 - u(t, Told - 0.2, Told + 0.15)),
    sag: 18,
    sagNueva: t < Tslack - 0.2 ? 20 : Math.max(sagN, 70),
    flujo,
    llenado: Math.max(0, llenado),
    giroLlave: t < Tclock - 0.2 ? 0.3 : 0.3 + giro,
    tornillo,
    floatY: k.mez(-560, -360, baja),
    palanca: u(t, Tflush - 0.05, Tflush + 0.2) * 28 * (1 - u(t, Tflush + 0.45, Tflush + 0.7)),
    aro: u(t, Tsame - 0.15, Tsame + 0.15) * (1 - u(t, Tsame + 0.7, Tsame + 1.05)),
    marca: u(t, Tinch - 0.15, Tinch + 0.15) * (1 - u(t, Tflap - 0.45, Tflap - 0.1)),
    guante,
    arco: arcoCCW
      ? { x: TORNILLO.x, y: TORNILLO.y, r: 110, a0: 1.1, a1: 1.1 - Math.max(0.4, baja) * 3.4, ccw: true, al: u(t, Tccw - 0.15, Tccw + 0.1) * (1 - u(t, Tstops - 0.15, Tstops + 0.05)) }
      : arcoCW
        ? { x: VALV.x, y: VALV.y, r: 148, a0: -Math.PI / 2, a1: -Math.PI / 2 + u(t, Tclock - 0.25, Tclock + 0.45) * 2.6, ccw: false, al: 0.95 }
        : null,
  });
  g.restore();
  viñeta(g, 0.36);
  velo(g, 0.6);

  const alIn = u(t, Tinch - 0.1, Tinch + 0.2) * (1 - u(t, Tflap - 0.5, Tflap - 0.15));
  if (alIn > 0.02) {
    const [px, py] = aPant(cam, TUBO_X + 150, TUBO_TOP + 86);
    k.etiqueta(g, Math.min(px, 760), Math.max(py - 20, 560), "1 in", "255,225,80", alIn, 54);
  }
  const alSl = u(t, Tslack - 0.05, Tslack + 0.25) * (1 - u(t, Topen - 0.25, Topen));
  if (alSl > 0.02) {
    const [px, py] = aPant(cam, -40, -80);
    k.etiqueta(g, Math.min(Math.max(px, 80), 700), Math.max(py, 560), "1/2 in", "255,225,80", alSl, 54);
  }
}
