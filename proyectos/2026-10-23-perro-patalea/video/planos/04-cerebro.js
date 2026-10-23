// Pegados a la cabeza: su luz se apaga y, aun así, la médula lanza la pata.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "cerebro";

const f8 = v.frase(8);
const Tcer = f8.t("cerebro");
const Tlanza = f8.t("lanza");
const Tcorte = v.t("asi");

export function dibuja(g, t) {
  const apaga = k.suave(k.tramo(t, Tcer - 0.05, Tcer + 0.55));
  const sube = k.suave(k.tramo(t, Tlanza - 0.22, Tlanza + 0.12));
  const quieto = k.suave(k.tramo(t, Tlanza + 0.45, Tcorte - 0.32));
  const fase = 0.5 * sube * (1 - quieto * 0.15);
  const ampl = 0.95 * sube;
  const late = Math.sin(Math.min(1, sube) * Math.PI) * (1 - quieto);

  const z = k.claves([
    [Tcer, 1.85],
    [Tcer + 0.7, 1.7],
    [Tlanza, 1.25],
    [Tcorte - 0.25, 1.18],
  ])(t);
  const fx = k.claves([
    [Tcer, m.DOG.x + 430],
    [Tlanza, m.DOG.x + 40],
    [Tcorte - 0.25, m.DOG.x + 10],
  ])(t);
  const fy = k.claves([
    [Tcer, m.DOG.y - 210],
    [Tlanza, m.DOG.y - 20],
    [Tcorte - 0.25, m.DOG.y],
  ])(t);

  m.conCam(g, { z, fx, fy }, () => {
    m.oscuro(g);
    m.perroLado(g, {
      t, fase, ampl, estela: sube * (1 - quieto), luz: 1,
      pulso: 1, late, cerebro: k.mez(0.95, 0.04, apaga), lengua: 0,
    });
  });
  m.velo(g, 0.55);
}
