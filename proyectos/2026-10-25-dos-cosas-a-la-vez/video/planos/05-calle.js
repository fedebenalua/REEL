// «Caminar y hablar se estorban menos, aunque el paso se frena.»
import * as k from "#kit";
import { v } from "#voz";
import { calle, cinta, persona, velo } from "../mundo.js";

export const desde = "caminar";

const f13 = v.frase(13), f14 = v.frase(14);
const Tfrena = f13.t("frena");
const Tcomp = f14.t("complica"), Tcorta = f14.t("corta");
const corte = v.frase(15).inicio - 0.04;

function fase(t) {
  const v1 = 5.2, v2 = 2.3;
  if (t < Tfrena) return t * v1;
  return Tfrena * v1 + (t - Tfrena) * v2;
}

export function dibuja(g, t) {
  const tD = Math.min(t, corte - 0.3);
  const camina = fase(tD);
  const desplaza = camina * 46;
  calle(g, tD, desplaza);
  const obst = k.entra(k.tramo(t, Tcomp - 0.05, Tcomp + 0.35));
  // tapa de alcantarilla y caja, delante de la persona
  if (obst > 0.01) {
    g.save();
    g.globalAlpha = obst;
    g.fillStyle = "#facc15";
    g.beginPath();
    g.ellipse(700, 1280, 110, 36, 0, 0, 6.2832);
    g.fill();
    g.fillStyle = "#0b0b10";
    g.beginPath();
    g.ellipse(700, 1272, 78, 24, 0, 0, 6.2832);
    g.fill();
    g.fillStyle = "#fb7185";
    g.fillRect(300, k.mez(1500, 1210, obst), 120, 100);
    g.restore();
  }
  const habla = 0.3 + 0.7 * Math.abs(Math.sin(t * 8));
  const hablaRota = k.suave(k.tramo(t, Tcorta, Tcorta + 0.25));
  persona(g, 500, 1040, 1.55, camina, habla * (1 - hablaRota));
  cinta(g, 640, 820, tD, Tcorta);
  // la cinta ya ha caído y reposa: cinta() la baja sola
  void corte;
  velo(g, 0.45);
}
