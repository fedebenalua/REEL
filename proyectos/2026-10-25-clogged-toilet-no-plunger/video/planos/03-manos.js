// La llave, el vaso, el jabón y el cubo. Un solo sitio, la cámara viaja.
import * as k from "#kit";
import { v } from "#voz";
import {
  rutaCam, camara, fondo, taza, guante, valvula, arco, cubo, vaso, botellaJabon,
  columna, jabonHundido, vapor, salpicar, velo, viñeta,
} from "../mundo.js";

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const Tclock = f4.t("clockwise");
const Tshut = f4.t("shut");
const Trim = f5.t("rim");
const Tscoop = f5.t("scoop");
const Tbucket = f5.t("bucket");
const Tpour = f6.t("pour");
const Tsoap = f6.t("soap");
const Tfifteen = f6.t("fifteen");
const Tgal = f7.t("gallon");
const Twaist = f7.t("waist");
const Tback = f7.t("back");
const fin = v.frase(8).inicio;

export const desde = (voz) => voz.frase(4).inicio - 0.04;
export const entrada = "corte";

const TX = 90, TY = 30;
const VX = -470, VY = 20;

const CAMS = [
  [f4.inicio, { x: VX, y: VY, s: 1.9 }],
  [Tshut, { x: VX, y: VY - 10, s: 1.85 }],
  [Trim, { x: TX, y: TY + 20, s: 1.12 }],
  [Tsoap, { x: TX + 20, y: TY, s: 1.28 }],
  [Tfifteen, { x: TX, y: TY + 30, s: 1.22 }],
  [Tgal - 0.1, { x: TX + 40, y: -30, s: 0.78 }],
  [Tback, { x: TX + 30, y: 10, s: 0.92 }],
  [fin, { x: TX + 30, y: 10, s: 0.92 }],
];

const nivel = k.claves([
  [f4.inicio, 1],
  [Tscoop, 1],
  [Tbucket + 0.15, 0.76],
  [Tgal, 0.76],
  [Twaist, 0.94],
  [fin, 0.94],
], 0, 0);

const angulo = k.claves([
  [f4.inicio, -1.05],
  [Tclock, -0.35],
  [Tshut, 0.85],
  [fin, 0.85],
], 0, 0);

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const ang = angulo(t);
  const abierto = 1 - k.suave(k.tramo(t, Tclock, Tshut));
  const quieto = k.tramo(t, fin - 0.38, fin - 0.12);
  const nv = nivel(t);

  const cX = k.claves([
    [f5.inicio, 20],
    [Tscoop, TX - 20],
    [Tscoop + 0.32, TX + 10],
    [Tscoop + 0.62, TX - 30],
    [Tbucket, 360],
    [Tbucket + 0.4, 390],
    [Tpour, 520],
  ], 0, 0)(t);
  const cY = k.claves([
    [f5.inicio, -60],
    [Tscoop, 0],
    [Tscoop + 0.32, 120],
    [Tscoop + 0.62, -10],
    [Tbucket, 40],
    [Tbucket + 0.35, 80],
    [Tpour, -80],
  ], 0, 0)(t);
  const cRot = k.claves([
    [f5.inicio, -0.4],
    [Tscoop + 0.5, 0.1],
    [Tbucket - 0.05, 0.2],
    [Tbucket + 0.28, 1.5],
    [Tbucket + 0.5, 1.5],
    [Tpour, 0.4],
  ], 0, 0)(t);
  const cLleno = k.claves([
    [Tscoop, 0],
    [Tscoop + 0.4, 1],
    [Tbucket, 1],
    [Tbucket + 0.35, 0.05],
    [fin, 0],
  ], 0, 0)(t);
  const cAl = k.suave(k.tramo(t, Trim, Tscoop - 0.05)) * (1 - k.suave(k.tramo(t, Tbucket + 0.45, Tpour)));

  const bX = k.claves([
    [f4.inicio, 430],
    [Tgal - 0.15, 400],
    [Tgal + 0.05, TX],
    [Twaist, TX],
    [Tback, 340],
    [Tback + 0.28, 390],
    [fin, 390],
  ], 0, 0)(t);
  const bY = k.claves([
    [f4.inicio, 300],
    [Tgal - 0.2, 280],
    [Tgal, -250],
    [Twaist, -230],
    [Tback, -20],
    [Tback + 0.28, 40],
    [fin, 40],
  ], 0, 0)(t);
  const bLleno = k.claves([
    [f4.inicio, 0.08],
    [Tbucket + 0.2, 0.55],
    [Tgal, 0.9],
    [Twaist, 0.2],
    [Tback, 0.05],
    [fin, 0.05],
  ], 0, 0)(t);
  const bRot = k.claves([
    [Tgal - 0.2, 0],
    [Tgal + 0.08, 0.35],
    [Twaist, 0.45],
    [Tback, 0.15],
    [fin, 0.1],
  ], 0, 0)(t);

  const sX = k.claves([
    [Tpour - 0.05, 560],
    [Tsoap - 0.1, 230],
    [Tsoap + 0.45, 230],
    [Tfifteen - 0.05, 520],
  ], 0, 0)(t);
  const sRot = k.claves([
    [Tpour, -0.3],
    [Tsoap, 1.15],
    [Tsoap + 0.4, 1.15],
    [Tfifteen - 0.1, 0.1],
  ], 0, 0)(t);
  const sAl = k.suave(k.tramo(t, Tpour - 0.1, Tpour + 0.2)) * (1 - k.suave(k.tramo(t, Tfifteen - 0.25, Tfifteen + 0.05)));

  const chorroJabon = k.suave(k.tramo(t, Tsoap - 0.15, Tsoap + 0.08)) * (1 - k.suave(k.tramo(t, Tsoap + 0.35, Tsoap + 0.55)));
  const hunde = k.suave(k.tramo(t, Tsoap, Tfifteen + 0.2));
  const chorroAgua = k.suave(k.tramo(t, Tgal - 0.05, Tgal + 0.12)) * (1 - k.suave(k.tramo(t, Twaist + 0.15, Tback - 0.05))) * (1 - quieto);

  const gVal = (1 - k.suave(k.tramo(t, Tshut + 0.05, Tshut + 0.4)));
  const gCubo = k.suave(k.tramo(t, Tgal - 0.35, Tgal)) * (1 - quieto * 0.15);

  g.save();
  camara(g, cam);
  fondo(g);
  valvula(g, VX, VY, ang, abierto);
  const arcoAl = k.suave(k.tramo(t, Tclock - 0.12, Tclock + 0.15)) * (1 - k.suave(k.tramo(t, Tshut + 0.05, Tshut + 0.35)));
  arco(g, VX, VY, 118, -1.15, Math.max(-1.05, ang + 0.15), Math.max(arcoAl, gVal * 0.85));
  guante(g, VX + Math.cos(ang) * 36, VY + Math.sin(ang) * 36, ang * 0.85, 1.35, gVal);

  taza(g, t, TX, TY, 1, { nivel: nv, rebose: 0, quieto, remolino: chorroAgua * 0.4 });
  cubo(g, bX, bY, 1.15, bLleno, bRot);
  if (gCubo > 0.03) guante(g, bX - 20, bY + 10, -0.5 + bRot, 1.2, gCubo);

  if (cAl > 0.03) {
    vaso(g, cX, cY, cRot, 1.15, cLleno);
    guante(g, cX - 10, cY + 16, cRot * 0.3, 1.05, cAl);
  }
  if (sAl > 0.03) {
    botellaJabon(g, sX, TY - 150, sRot, 1.05);
    guante(g, sX - 30, TY - 80, sRot * 0.4 - 0.2, 1.05, sAl);
    if (chorroJabon > 0.05) {
      const bocaX = sX + Math.sin(sRot) * 70;
      const bocaY = TY - 150 - Math.cos(sRot) * 40;
      columna(g, bocaX, bocaY, TY + 40, 22 * chorroJabon, t, "jabon");
    }
  }
  jabonHundido(g, TX, TY + 55, t, hunde, hunde);

  if (chorroAgua > 0.04) {
    const bocaY = bY + 40;
    columna(g, TX, bocaY, TY + 36, 62 * chorroAgua, t, "agua");
    vapor(g, TX, bocaY - 30, t, 0.65 * chorroAgua);
    salpicar(g, TX, TY + 50, t, chorroAgua, 1.15);
  }
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.8);

  const num = k.suave(k.tramo(t, Tfifteen - 0.08, Tfifteen + 0.22)) * (1 - k.suave(k.tramo(t, Tgal - 0.55, Tgal - 0.22)));
  k.pastilla(g, 540, 1240, "15", "min", "255,214,80", num, 120);
}
