// Frases 8 a 11. La bombilla de verdad, y tres golpes.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, chispas, velo, fondo, bombilla, habla, ojo, manoVaso, ZONA } from "../mundo.js";

export const desde = "pero";

const { suave: su, tramo: tr, mez, mezV, orbita, mira, proyecta, tamano } = k;
const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const Tenc = f8.t("encoge"), Tgol = f9.t("golpe"), Thab = f9.t("habla");
const Tvis = f10.t("vista"), Tman = f11.t("mano");
const Tcorte = v.t("tumbado");
const Tquieto = Tcorte - 0.3;

const BULBO = [0.12, -0.08, -1.45];
const OJO = [0.02, 0.55, -1.35];
const MANO = [0.0, -1.25, 0.05];
const BOCA = [0.0, 0.15, 1.45];

function camEn(t) {
  const tc = Math.min(t, Tquieto);
  const A = { pos: orbita(1.2, 3.5, 0.02), mira: [0, 0.02, -0.1] };
  const frente = (X, dist, alt = 0.05) => ({ pos: [X[0] + 2.6, X[1] + alt, X[2] + dist * 0.15], mira: X });
  const pB = frente(BOCA, 1.4, 0.02);
  const pO = frente(OJO, 1.2, 0.04);
  const pM = frente(MANO, 1.3, 0.35);
  const pFin = { pos: orbita(1.15, 3.9, -0.25), mira: [0, -0.2, 0] };

  const uB = su(tr(tc, f9.inicio - 0.05, Tgol + 0.15));
  let pos = mezV(A.pos, pB.pos, uB), mir = mezV(A.mira, pB.mira, uB);
  const uO = su(tr(tc, f10.inicio, Tvis));
  pos = mezV(pos, pO.pos, uO); mir = mezV(mir, pO.mira, uO);
  const uM = su(tr(tc, f11.inicio, Tman - 0.05));
  pos = mezV(pos, pM.pos, uM); mir = mezV(mir, pM.mira, uM);
  const uF = su(tr(tc, Tman + 0.15, Tman + 0.42));
  pos = mezV(pos, pFin.pos, uF); mir = mezV(mir, pFin.mira, uF);
  return mira(pos, mir);
}

export function dibuja(g, t) {
  const cam = camEn(t);
  fondo(g, 1, 1);
  const amaga = su(tr(t, Tenc - 0.08, Tenc + 0.14));
  const vuelve = su(tr(t, Tenc + 0.1, Tenc + 0.34));
  const fuerza = mez(mez(1, 0.7, amaga), 1, vuelve);
  const alto = mez(mez(1.35, 0.95, amaga), 1.35, vuelve);
  const P = proyecta(cam, BULBO);
  if (P) bombilla(g, P.x, P.y, tamano(alto, P.z), t, 1, fuerza);

  const g1 = su(tr(t, Thab, Thab + 0.28));
  const g2 = su(tr(t, Tvis, Tvis + 0.25));
  const g3 = su(tr(t, Tman, Tman + 0.22));
  cerebro(g, cam, t, { g1, g2, g3, al: 1 });
  const calma = 1 - su(tr(t, Tman + 0.25, Tquieto));
  chispas(g, cam, t, 0.8 * (1 - 0.5 * Math.max(g1, g2, g3)) * (0.4 + 0.6 * calma));

  const alH = su(tr(t, f9.inicio, Tgol));
  const rot = su(tr(t, Thab - 0.05, Thab + 0.32));
  const H = proyecta(cam, BOCA);
  if (H) habla(g, H.x, H.y, tamano(0.85, H.z), rot, alH);

  const alO = su(tr(t, f10.inicio - 0.04, f10.t("otro") + 0.12));
  const cierre = su(tr(t, Tvis - 0.08, Tvis + 0.3));
  const O = proyecta(cam, OJO);
  if (O) ojo(g, O.x, O.y, tamano(0.95, O.z), cierre, alO);

  const alM = su(tr(t, f11.inicio - 0.04, f11.t("la") + 0.08));
  const suelta = su(tr(t, Tman - 0.12, Tman + 0.26));
  const M = proyecta(cam, MANO);
  if (M) manoVaso(g, M.x, M.y, tamano(0.9, M.z), suelta, alM);

  const flash = (X, t0) => {
    const Q = proyecta(cam, X);
    if (Q) k.fogonazo(g, Q.x, Q.y, t - t0, 640, "255,90,60");
  };
  flash(ZONA.habla, Tgol);
  flash(ZONA.vista, f10.t("otro"));
  flash(ZONA.mano, f11.t("otro"));

  velo(g, 0.6);
}
