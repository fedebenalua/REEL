// «Te lo pone delante para que no pares. Envíaselo a ese amigo al que su perro le acerca la pelota y sale corriendo.»
// La deja delante y espera. Luego se la acerca y sale corriendo, como al principio.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(14).inicio - 0.04;

const f14 = v.frase(14), f15 = v.frase(15);
const Tdelante = f14.t("delante"), Tpelota = f15.t("pelota"), Tsale = f15.t("sale");
const xP = 280;

export function dibuja(g, t) {
  const corre = k.suave(k.tramo(t, Tsale - 0.08, Tsale + 0.35));
  const xQuieto = 470;
  const xD = k.claves([
    [f14.inicio, 520], [Tdelante, xQuieto], [f15.inicio, xQuieto],
    [f15.t("acerca"), 440], [Tpelota, 400], [Tsale, 430], [Tsale + 0.45, 560], [f15.fin, 640],
  ])(t);
  const siguiendo = k.suave(k.tramo(t, Tsale - 0.02, Tsale + 0.3));
  const Zquieto = k.claves([
    [f14.inicio, 7.6], [Tdelante, 5.2], [f15.inicio, 5.75], [f15.t("amigo"), 6.3], [Tpelota, 5.15],
  ])(t);
  const Z = k.mez(Zquieto, 6.45, siguiendo);
  const cxQuieto = k.claves([
    [f14.inicio, 500], [Tdelante, 410], [f15.inicio, 390], [Tpelota, 360],
  ])(t);
  const cx = k.mez(cxQuieto, xD + 18, siguiendo);
  const cy = k.mez(m.cyPies(Math.min(Zquieto, 5.2), 1320), -44, siguiendo);
  const c = { Z, cx, cy };
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  const marcha = k.claves([
    [f14.inicio, 0.55], [Tdelante - 0.05, 0.1], [Tdelante + 0.2, 0],
    [f15.t("acerca") - 0.05, 0.15], [Tpelota, 0.35], [Tsale, 0.4], [Tsale + 0.25, 1], [f15.fin, 1],
  ])(t);
  const dir = corre > 0.55 ? 1 : -1;
  const per = m.perro(g, {
    x: xD, dir, fase: t * 3.1, marcha, t,
    pitch: 0.12 * corre, cola: k.mez(0.85, 1, corre),
    cabeza: {
      ang: k.claves([[f14.inicio, 0.2], [Tdelante, -0.34], [Tpelota, -0.2], [Tsale, 0.12], [f15.fin, 0.1]])(t) + Math.sin(t * 2.1) * 0.07 * (1 - corre),
      abre: marcha > 0.5 ? 0.4 : 0.08, ojo: corre < 0.4 ? 1 : 0, oreja: 0.2,
    },
  });
  m.persona(g, {
    x: xP, dir: 1, recto: 1, paso: 0, fase: 0, t,
    inclina: -0.05,
  });
  const boca = m.enBoca(per.nariz, dir, 4);
  const enBocaU = k.claves([
    [f14.inicio, 1], [Tdelante, 0], [Tsale - 0.08, 0], [Tsale + 0.22, 1], [f15.fin, 1],
  ])(t);
  const sx = k.claves([
    [f14.inicio, 430], [Tdelante, 400], [f15.t("acerca"), 400], [Tpelota, xP + 78], [f15.fin, xP + 78],
  ])(t);
  const px = k.mez(sx, boca[0], enBocaU);
  const arco = Math.sin(k.suave(k.tramo(t, f14.inicio, Tdelante)) * Math.PI) * (t < Tdelante + 0.08 ? 1 : 0);
  const py = k.mez(-14, boca[1], enBocaU) - arco * 22;
  if (enBocaU < 0.65) m.sombra(g, sx, 15, 0.28 * (1 - enBocaU));
  m.pelota(g, px, py, 1.2, enBocaU * Math.sin(t * 8) * 0.2);
  if (marcha > 0.45) m.polvoCorre(g, t, xD - 24 * dir, dir, f14.inicio);
  m.cierra(g, 0.5);
}
