// «hace falta tiempo, gente formada y un laboratorio.»
// La proteína se queda en la tablet. El vial, vacío. Entran el reloj, la persona y el laboratorio.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, vineta, sinVista, proteina, reloj, persona, vial, banco } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio - 0.04;

const f7 = v.frase(7);
const T0 = f7.inicio, Tpro = f7.t("proteinas"), Tfue = f7.t("falta");
const Ttie = f7.t("tiempo"), Tgen = f7.t("gente"), Tlab = f7.t("laboratorio");
const fin = v.frase(8).inicio - 0.24;

const { suave: su, tramo: tr, mez } = k;

export function dibuja(g, t) {
  const tt = Math.min(t, fin);
  fondo(g, "20,90,110");

  // pared de laboratorio, de color
  const par = g.createLinearGradient(0, 0, 0, 1400);
  par.addColorStop(0, "#071820");
  par.addColorStop(0.6, "#123044");
  par.addColorStop(1, "#0c2838");
  g.fillStyle = par;
  g.fillRect(0, 0, 1080, 1500);

  const alBanco = su(tr(tt, Tlab - 0.15, Tlab + 0.35));
  banco(g, mez(1560, 1280, alBanco), t);

  // la tablet, grande desde el primer fotograma
  const tw = 640, th = 820;
  const tx = 540 - tw / 2, ty = mez(560, 500, su(tr(tt, T0, Tpro)));
  k.redondo(g, tx - 18, ty - 18, tw + 36, th + 36, 36);
  g.fillStyle = "#1a2430";
  g.fill();
  g.save();
  k.redondo(g, tx, ty, tw, th, 24);
  g.clip();
  const pg = g.createLinearGradient(tx, ty, tx, ty + th);
  pg.addColorStop(0, "#102030");
  pg.addColorStop(1, "#1a1030");
  g.fillStyle = pg;
  g.fillRect(tx, ty, tw, th);
  proteina(g, 540, ty + th * 0.52, mez(1.7, 2.45, su(tr(tt, T0, Tfue))), t * 1.6, 1);
  g.restore();
  const respira = 0.5 + 0.5 * Math.sin(tt * 5);
  k.brillo(g, 540, ty + th * 0.5, 420 + respira * 520, "violeta", 0.4);

  // el reloj se acelera en «tiempo» y se para
  const alRel = su(tr(tt, T0 + 0.15, Tpro));
  const horas = tt < Ttie ? 1.5 + (tt - T0) * 0.22 : mez(3.2, 10.5, su(tr(tt, Ttie, Math.min(Ttie + 1.15, fin))));
  reloj(g, 180, 780, 110, horas, alRel);

  // la persona formada entra
  const entraP = su(tr(tt, Tgen - 0.1, Tgen + 0.45));
  if (entraP > 0.02) {
    persona(g, mez(1180, 880, entraP), 1520, 640, "226,236,248", t, -1);
  }

  // el vial vacío delante, en «laboratorio»
  const alV = su(tr(tt, Tlab - 0.1, Tlab + 0.3));
  vial(g, 300, mez(1600, 1320, alV), 250, alV, 0);

  sinVista(g);
  vineta(g, 0.45);
  velo(g, 0.8);
}
