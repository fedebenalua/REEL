// «Y quien vapea tiene casi el triple de probabilidades de acabar fumando tabaco.»
// El cruce: un váper de pie en medio, con su nube de colores, sobre una mesa oscura.
// - «Y»: corte aquí; el váper solo, echando su nubecita.
// - «triple»: tres cigarrillos crecen detrás y a los lados, uno, dos, tres, y se encienden; «× 3».
// - «fumando tabaco»: humo gris sube de las brasas y va tapando la nube de colores. Corte en «Así».
import * as k from "#kit";
import { v } from "#voz";
import { fondo, nube, vaper, cigarrillo, velo, ROSA, AZUL, LILA } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Tvap = f8.t("vapea"), Ttri = f8.t("triple"), Tfum = f8.t("fumando"), Ttab = f8.t("tabaco"), Fin = f8.fin;
export const momentos = { triple: Ttri, humo: Tfum };

const GRIS = ["200,200,210", "150,150,160", "180,180,190"];
const CIGS = [{ x: 215, L: 900, d: 0 }, { x: 540, L: 1020, d: 0.12 }, { x: 865, L: 900, d: 0.24 }];
const YMESA = 1560;

export function dibuja(g, t) {
  fondo(g, t, "#1a0f28");
  // la mesa
  const mg = g.createLinearGradient(0, YMESA, 0, 1920); mg.addColorStop(0, "#2a2230"); mg.addColorStop(1, "#0d0a12");
  g.fillStyle = mg; g.fillRect(0, YMESA, 1080, 1920 - YMESA);
  g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(0, YMESA, 1080, 6);
  // los cigarrillos, que crecen en «triple»
  const humo = su(tr(t, Tfum - 0.15, Ttab + 0.3));
  CIGS.forEach((c, i) => {
    const crece = k.entra(tr(t, Ttri - 0.2 + c.d, Ttri + 0.35 + c.d));
    if (crece <= 0) return;
    const L = c.L * crece, cy = YMESA - L / 2;
    // la sombra en la mesa
    g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.ellipse(c.x, YMESA + 10, 70, 18, 0, 0, 6.2832); g.fill();
    cigarrillo(g, c.x, cy, L, Math.PI / 2, su(tr(t, Ttri + 0.3 + c.d, Ttri + 0.6 + c.d)));
    // el humo gris de la brasa
    nube(g, t, c.x, YMESA - L - 20, -Math.PI / 2, tr(t, Tfum - 0.2 + c.d, Ttab + 0.6 + c.d), { n: 30, semilla: 700 + i, esc: 0.75, alcance: 700, al: 1.4, colores: GRIS });
  });
  // el váper, delante, con su nube de colores (que se va con el humo)
  const nubeAl = 1 - 0.7 * humo;
  nube(g, t, 540, YMESA - 760, -Math.PI / 2, tr(t, T0 - 0.3, Tvap + 0.6), { n: 40, semilla: 710, esc: 0.9, alcance: 650, al: 1.2 * nubeAl, colores: [ROSA, AZUL, LILA] });
  g.fillStyle = "rgba(0,0,0,0.55)"; g.beginPath(); g.ellipse(540, YMESA + 14, 120, 26, 0, 0, 6.2832); g.fill();
  vaper(g, 540, YMESA - 340, 680, 0, { luz: 0.6 + 0.4 * Math.sin(t * 3) });
  // «× 3»
  const al3 = su(tr(t, Ttri - 0.05, Ttri + 0.2));
  k.pastilla(g, 540, 760, "× 3", "", "255,255,255", al3, 130);
  velo(g, 0.5);
}
