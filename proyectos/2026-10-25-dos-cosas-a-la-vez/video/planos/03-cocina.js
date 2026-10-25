// «En la cocina pasa igual: el mensaje y la sartén.»
import * as k from "#kit";
import { v } from "#voz";
import { sala, sarten, tarjetaMensaje, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio - 0.04;

const f9 = v.frase(9), f10 = v.frase(10);
const Tmsg = f9.t("mensaje"), Tsart = f9.t("sarten"), Tqueda = f9.t("queda");
const Tquieta = f10.t("quieta"), Tfin = f10.t("termina");
const corte = v.frase(11).inicio - 0.04;

export function dibuja(g, t) {
  sala(g, "#1a0c08", "#070504", 540, 1000, 800);
  // encimera
  const enc = g.createLinearGradient(0, 980, 0, 1920);
  enc.addColorStop(0, "#2a211c");
  enc.addColorStop(1, "#100c0a");
  g.fillStyle = enc;
  g.fillRect(0, 980, 1080, 940);

  const creceMsg = k.suave(k.tramo(t, f9.inicio, Tmsg + 0.15));
  const aSarten = k.suave(k.tramo(t, Tsart - 0.15, Tsart + 0.45));
  const escribe = k.tramo(t, Tquieta - 0.2, Tfin);
  const sMsg = k.mez(1.15, 1.45, creceMsg) * k.mez(1, 0.88, aSarten);
  const sPan = k.mez(0.9, 1.35, aSarten);
  const lineas = 1.2 + escribe * 1.8;
  const listo = k.suave(k.tramo(t, Tfin - 0.08, Tfin + 0.28));
  const alto = k.suave(k.tramo(t, Tfin, Tfin + 0.45)) * (1 - k.suave(k.tramo(t, corte - 0.45, corte - 0.12)));
  const tFuego = t < corte - 0.32 ? t : corte - 0.32;

  tarjetaMensaje(g, 540, k.mez(780, 700, aSarten), sMsg, lineas, listo);
  sarten(g, 540, k.mez(1280, 1200, aSarten), sPan, { t: tFuego, naranja: alto * 0.7, alto: 0.15 + alto * 0.9 });

  // quietud: un brillo fijo, sin latido, cuando la sartén espera
  const quieta = k.suave(k.tramo(t, Tquieta - 0.1, Tquieta + 0.2)) * (1 - listo);
  k.brillo(g, 540, 1240, 500, "255,170,80", 0.12 * quieta);
  // que «queda» se note: el aceite no salta
  void Tqueda;
  velo(g, 0.5);
}
