// El mito: el cerebro entero, casi a oscuras, con un solo casquete en oro.
// Frases 1 a 5. Una cámara que ya se mueve en el fotograma 0.
import * as k from "#kit";
import { v } from "#voz";
import { cerebroSolido, fondoNoche, manoLuz, onda, placaNombre, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mezV, pulso, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const Tdiez = f1.t("diez"), Tapag = f2.t("apagado"), Tdesp = f2.t("despiertes");
const Tperder = f3.t("perder"), Tigual = f3.t("igual");
const Tpero = f4.t("pero"), Tgolpe = f4.t("golpe"), Thabla = f4.t("habla"), Tmano = f4.t("mano"), Tnombre = f4.t("nombre");
const Tsobra = f5.t("sobra");
const Tcorte = v.frase(6).t("tu") - 0.04;

const CLAVES = [
  [0, { pos: [0.55, 0.42, 2.05], mira: [0.08, -0.08, 0] }],
  [Tdiez + 0.2, { pos: [0.35, 0.15, 1.85], mira: [0.12, -0.02, 0] }],
  [Tapag - 0.2, { pos: [-1.15, 0.55, 1.7], mira: [-0.25, 0.02, 0] }],
  [Tdesp + 0.2, { pos: [-0.2, 0.7, 2.05], mira: [0, 0.05, 0] }],
  [Tperder, { pos: [0.15, 0.25, 2.35], mira: [0, -0.02, 0] }],
  [Tigual, { pos: [0.02, 0.18, 2.5], mira: [0, 0.02, 0] }],
  [Tpero, { pos: [0.02, 0.4, 2.3], mira: [0, -0.1, 0] }],
  [Thabla, { pos: [-0.15, 0.22, 2.15], mira: [-0.08, -0.05, 0] }],
  [Tnombre + 0.4, { pos: [0.05, 0.35, 2.7], mira: [0, -0.22, 0] }],
  [Tsobra + 0.15, { pos: [-0.25, 0.18, 2.25], mira: [-0.12, -0.08, 0] }],
  [Tcorte - 0.28, { pos: [-0.2, 0.2, 2.28], mira: [-0.1, -0.08, 0] }],
];

function camDe(t) {
  let i = 0;
  while (i < CLAVES.length - 2 && t >= CLAVES[i + 1][0]) i++;
  const [t0, a] = CLAVES[i];
  const [t1, b] = CLAVES[i + 1];
  let u = t >= t1 ? 1 : tr(t, t0, t1);
  u = i === 0 ? 1 - Math.pow(1 - u, 0.4) : su(u);
  return k.mira(mezV(a.pos, b.pos, u), mezV(a.mira, b.mira, u));
}

export function pinta(g, t, modo) {
  const cam = camDe(t);
  fondoNoche(g, 0);
  const baja = su(tr(t, Tperder - 0.05, Tigual - 0.2));
  const vuelve = su(tr(t, Tpero, Tgolpe + 0.05));
  const u = baja * (1 - vuelve);
  const golpe = su(tr(t, Tgolpe - 0.05, Tgolpe + 0.28));
  const ref = cerebroSolido(g, cam, {
    oro: 1 - su(tr(t, Tcorte - 0.8, Tcorte - 0.3)) * 0,
    trozos: { izq: u, bajo: u, cerebelo: u * 0.85 },
    golpe,
  });

  // la otra apertura: un 10 % que ocupa el primer segundo y se atraviesa
  if (modo === "numero") {
    const cruza = 1 - Math.pow(1 - tr(t, 0, Tdiez), 0.5);
    const alN = 1 - su(tr(t, Tdiez - 0.25, Tdiez + 0.2));
    if (alN > 0.02 && ref) {
      g.save();
      g.translate(ref.cx, ref.cy - ref.s * 0.15);
      g.scale(k.mez(1.4, 6.5, cruza), k.mez(1.4, 6.5, cruza));
      g.globalAlpha = alN;
      k.pastilla(g, 0, 0, "10", "%", "255,214,120", 1, 140);
      g.restore();
    }
  }

  // chispa que intenta despertar el lado apagado y se apaga
  if (ref && t > Tdiez + 0.15 && t < Tdesp + 0.6) {
    const nace = su(tr(t, Tdiez + 0.2, Tdiez + 0.55));
    const uu = tr(t, Tdiez + 0.35, Tdesp + 0.05);
    const muere = su(tr(t, Tdesp - 0.05, Tdesp + 0.4));
    const x = k.mez(ref.cx + ref.s * 0.42, ref.cx - ref.s * 0.55, uu);
    const y = k.mez(ref.cy - ref.s * 0.42, ref.cy + ref.s * 0.02, Math.sin(Math.min(1, uu) * Math.PI));
    const al = nace * (1 - muere);
    k.brillo(g, x, y, ref.s * 0.9, "255,220,140", al * 0.8);
    k.brillo(g, x, y, ref.s * 0.26, "255,255,240", al);
  }

  if (ref) {
    const alPie = su(tr(t, Tdiez - 0.08, Tdiez + 0.25)) * (1 - su(tr(t, Tperder + 0.2, Tigual)));
    if (alPie > 0.03) {
      k.pastilla(g, Math.min(820, ref.cx + ref.s * 0.15), Math.max(560, ref.cy - ref.s * 0.95), "10", "%", "255,214,120", alPie, 78);
    }
    const aO = entra(tr(t, Thabla - 0.1, Thabla + 0.3));
    const rO = su(tr(t, Thabla + 0.04, Thabla + 0.4));
    const aM = entra(tr(t, Tmano - 0.08, Tmano + 0.26));
    const cM = su(tr(t, Tmano + 0.04, Tmano + 0.42));
    const aN = entra(tr(t, Tnombre - 0.08, Tnombre + 0.28));
    const rN = su(tr(t, Tnombre + 0.04, Tnombre + 0.4));
    onda(g, ref.onda.x, Math.min(1320, Math.max(640, ref.onda.y)), Math.min(520, ref.s * 0.85), aO, rO);
    manoLuz(g, ref.mano.x, Math.min(1360, Math.max(700, ref.mano.y)), Math.min(380, ref.s * 0.62), aM, cM);
    placaNombre(g, ref.nombre.x, Math.min(1450, Math.max(820, ref.nombre.y)), Math.min(300, ref.s * 0.48), aN, rN);
  }
  // un latido del oro en «apagado», lento, no un parpadeo
  if (ref) k.brillo(g, ref.cx + ref.s * 0.38, ref.cy - ref.s * 0.42, ref.s * 0.7, "255,200,80", 0.28 * pulso(t, Tapag, 0.28));
  velo(g, 0.55);
}

export function dibuja(g, t) { pinta(g, t, "superficie"); }
