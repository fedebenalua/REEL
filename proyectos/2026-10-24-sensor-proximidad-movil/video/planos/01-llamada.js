// La llamada, el gancho. El móvil pegado a la mejilla y la pantalla que se apaga.
// Luego la mejilla se aparta, vuelve, y un dedo hace lo mismo: no es la oreja.
// Se corta en «lo», cuando ya está quieto, hacia el mando.
import * as k from "#kit";
import { v } from "#voz";
import { SENSOR, TEL, cabeza, camara, dedo, fondo, ondas, telefono, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, claves } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tpeg = f1.t("pegada"), Tape = f2.t("apaga"), Trec = f3.t("reconoce");
const Tcorte = v.t("lo");

function encendida(t) {
  if (t < 1.65) return mez(0.62, 0, su(tr(t, 0.05, 1.5)));
  if (t < 3.2) return 0;
  if (t < 3.6) return su(tr(t, 3.22, 3.55));
  if (t < Tape - 0.12) return 1;
  if (t < Tape + 0.28) return 1 - su(tr(t, Tape - 0.08, Tape + 0.22));
  if (t < Trec - 0.15) return 0;
  if (t < Trec + 0.15) return su(tr(t, Trec - 0.12, Trec + 0.12));
  if (t < Trec + 0.55) return 1 - su(tr(t, Trec + 0.18, Trec + 0.5));
  return 0;
}

function pres(t) {
  if (t < 3.15) return 1;
  if (t < 3.7) return 1 - su(tr(t, 3.18, 3.62));
  if (t < 5.35) return k.entra(tr(t, 3.62, 5.15));
  if (t < Trec - 0.2) return 1;
  return 1 - su(tr(t, Trec - 0.15, Trec + 0.28));
}

function dedoU(t) {
  if (t < Trec - 0.05) return 0;
  return k.entra(tr(t, Trec, Trec + 0.48));
}

function zoom(t) {
  return claves([
    [0, 1.78],
    [1.15, 1.02],
    [Tpeg, 1.08],
    [2.7, 1],
    [3.5, 1],
    [4.9, 1.12],
    [6.3, 1.02],
    [Trec + 0.15, 1.16],
    [Tcorte - 0.45, 1.16],
  ])(t);
}

function foco(t) {
  const z1 = su(tr(t, 0, 1.15));
  const sube = su(tr(t, Trec - 0.2, Trec + 0.35));
  return {
    x: mez(mez(640, 520, z1), SENSOR.x, sube),
    y: mez(mez(860, 1040, z1), SENSOR.y + 40, sube),
  };
}

export function dibuja(g, t) {
  const e = encendida(t), p = pres(t), d = dedoU(t);
  fondo(g, 0.4 + 0.2 * e);
  const f = foco(t);
  g.save();
  camara(g, f.x, f.y, zoom(t));
  telefono(g, TEL.x, TEL.y, TEL.esc, -0.03, t, e, 0);
  cabeza(g, 760, 1040, 1.05, p, e);
  dedo(g, SENSOR.x, SENSOR.y + 36, d);
  const habla = (1 - e) * (1 - su(tr(t, Tcorte - 0.7, Tcorte - 0.4))) * (t < Trec ? 1 : 1 - d);
  ondas(g, TEL.x - 20, TEL.y - TEL.H * TEL.esc * 0.46, t, 0.85 * habla);
  g.restore();
  velo(g, 0.78);
}
