// El cuerpo: una parte de cada cincuenta, y una caloría de cada cinco, mirando al techo.
import * as k from "#kit";
import { v } from "#voz";
import { CUERPO, bloque, cuarto, lampara, orbe, velo } from "../mundo.js";

export const desde = (vv) => vv.frase(6).t("tu") - 0.04;
export const entrada = "corte";

const { suave: su, tramo: tr, mezV, mez, entra } = k;
const f6 = v.frase(6), f7 = v.frase(7);
const Ttu = f6.t("tu"), Tcinc = f6.t("cincuenta"), Tcinco = f7.t("cinco"), Ttecho = f7.t("techo");
const Tcorte = v.frase(8).t("no") - 0.04;

const CLAVES = [
  [Ttu - 0.04, { pos: [0.05, -1.15, 3.5], mira: [0, -1.05, 0] }],
  [Tcinc, { pos: [0.08, 1.15, 3.15], mira: [0, 1.25, 0] }],
  [Tcinc + 0.65, { pos: [0, 1.05, 3.05], mira: [0, 1.3, 0] }],
  [Tcinco - 0.1, { pos: [0, 0.25, 4.3], mira: [0, 0.35, 0] }],
  [Tcinco + 0.8, { pos: [0.05, 0.55, 3.7], mira: [0, 0.7, 0] }],
  [Ttecho + 0.2, { pos: [0.15, 0.85, 3.2], mira: [0, 1.7, 0] }],
  [Tcorte - 0.22, { pos: [0.1, 0.8, 3.25], mira: [0, 1.55, 0] }],
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

const ORBES = [
  { p: [-0.85, 0.55, 0.55], va: false },
  { p: [-0.15, 0.85, 0.7], va: true },
  { p: [0.7, 0.6, 0.5], va: false },
  { p: [-0.45, 0.15, 0.6], va: false },
  { p: [0.4, 0.2, 0.55], va: false },
];
const CABEZA = CUERPO.find((c) => c.cabeza).p;

export function dibuja(g, t) {
  const cam = camDe(t);
  cuarto(g);
  const sube = su(tr(t, Tcinc - 0.15, Tcinc + 0.45));
  const calor = su(tr(t, Tcinco - 0.05, Tcinco + 0.55));
  const miraArriba = su(tr(t, Ttecho - 0.2, Ttecho + 0.35));

  // la cama, un plano ancho bajo el cuerpo
  const cama = [
    [-1.7, 1.85, -0.25], [1.7, 1.85, -0.25], [1.7, -2.15, -0.25], [-1.7, -2.15, -0.25],
  ].map((p) => k.proyecta(cam, p)).filter(Boolean);
  if (cama.length === 4 && cama.every((p) => p.z > 0.35)) {
    g.beginPath();
    g.moveTo(cama[0].x, cama[0].y);
    for (const p of cama.slice(1)) g.lineTo(p.x, p.y);
    g.closePath();
    g.fillStyle = "rgba(36,28,64,0.92)";
    g.fill();
  }

  const piezas = CUERPO.map((c) => {
    let p = c.p;
    if (c.cabeza) p = [p[0], p[1] + sube * 0.38, p[2] + 0.05];
    const P = k.proyecta(cam, p);
    return P ? { ...c, P, p } : null;
  }).filter(Boolean);
  piezas.sort((a, b) => b.P.z - a.P.z);
  for (const c of piezas) {
    const w = Math.max(22, Math.min(120, (k.F * 0.24) / c.P.z));
    bloque(g, c.P.x, c.P.y, w, 1, c.cabeza, calor);
  }

  const llegan = entra(tr(t, Tcinco - 0.35, Tcinco + 0.15));
  for (const o of ORBES) {
    const fin = o.va ? mezV(o.p, [CABEZA[0], CABEZA[1] + 0.7, CABEZA[2]], su(tr(t, Tcinco - 0.05, Tcinco + 0.7))) : o.p;
    const desde = [o.p[0] * 1.8, o.p[1] + 1.4, o.p[2]];
    const p = mezV(desde, fin, llegan);
    const al = o.va ? llegan * (1 - su(tr(t, Tcinco + 0.55, Tcinco + 0.85))) : llegan;
    const P = k.proyecta(cam, p);
    if (!P) continue;
    const r = Math.max(28, Math.min(210, (k.F * 0.22) / P.z));
    orbe(g, P.x, P.y, r, al);
  }

  const Pcab = k.proyecta(cam, [CABEZA[0], CABEZA[1] + sube * 0.55, CABEZA[2]]);
  const alNum = su(tr(t, Tcinc - 0.1, Tcinc + 0.25)) * (1 - su(tr(t, Tcinco - 0.2, Tcinco + 0.15)));
  if (Pcab && alNum > 0.03) k.pastilla(g, Pcab.x, Math.max(560, Pcab.y - 80), "1", "/50", "255,220,150", alNum, 88);

  const Plam = k.proyecta(cam, [0, 2.15, 0]);
  if (Plam) lampara(g, Plam.x, Plam.y, su(tr(t, Ttecho - 0.25, Ttecho + 0.2)));

  velo(g, 0.5);
}
