// «Y las de diecisiete años hacen algo más raro: cuentan las primaveras del árbol.»
// Vuelta al árbol y su suelo (el sitio del hook). Se entra con un corte en «Y».
// - «Y las de diecisiete años»: la ninfa de ojos rojos en su hueco; en la pared, las rayas de los años que lleva.
// - «hacen algo más raro»: la cámara sube por la tierra hasta ver el árbol entero.
// - «cuentan las primaveras»: el árbol florece en rosa; un pulso de luz dorada baja por la raíz hasta ella (la cámara
//   baja con él) y en la pared se graba una raya más.
import * as k from "#kit";
import { v } from "#voz";
import { LB, NINFA_B, mundoArbol, marcas, ninfa, recorrido, RAICES, sinVista, velo, vista } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;

const { suave: su, tramo: tr } = k;
const f6 = v.frase(6);
const T0 = f6.inicio, Thac = f6.t("hacen"), Tcue = f6.t("cuentan"), Tpri = f6.t("primaveras"), Tarb = f6.t("arbol"), Fin = f6.fin;
const [bx, by] = NINFA_B;
export const MARCAS = [bx - 420, by - 230];
const florece = Tpri - 0.15;
const baja0 = Tpri + 0.35, baja1 = Tarb + 0.45;
export const raya = baja1 + 0.02;

const CAM = k.curva([[T0, Math.log(1.45)], [Thac, Math.log(1.35)], [Tcue + 0.1, Math.log(0.42)], [baja0, Math.log(0.42)], [baja1 + 0.1, Math.log(1.05)]], 0, 0);
const CX = k.claves([[T0, bx + 20], [Thac, bx + 20], [Tcue + 0.1, -120], [baja0, -120], [baja1 + 0.1, bx + 40]]);
const CY = k.claves([[T0, by - 60], [Thac, by - 80], [Tcue + 0.1, -700], [baja0, -700], [baja1 + 0.1, by - 80]]);

const R2 = RAICES[1];
const PICO = [bx + 0.46 * LB, by + 0.26 * LB];
const camino = recorrido([[0, -1700], [0, 0]].concat(R2.puntos.slice(1, 5), [[-330, PICO[1]]]));

export function dibuja(g, t) {
  const Z = Math.exp(CAM(t)), cx = CX(t), cy = CY(t);
  const flor = su(tr(t, florece, florece + 0.6));
  mundoArbol(g, t, Z, cx, cy, { flor });
  vista(g, Z, cx, cy);
  // las rayas de la pared: 11 años, y una más cuando llega el pulso
  const n = 11 + su(tr(t, raya, raya + 0.25));
  marcas(g, MARCAS[0], MARCAS[1], n, 105, k.pulso(t, raya + 0.15, 0.25));
  ninfa(g, bx, by, LB, 0, t, { tono: 1, pico: 1 });
  // el pulso: baja del árbol por la raíz hasta la ninfa
  const u = tr(t, baja0, baja1);
  if (u > 0 && u < 1) {
    const [px, py] = camino.en(su(u) * camino.largo);
    k.brillo(g, px, py, 420, "255,205,110", 1);
    k.brillo(g, px, py, 160, "255,255,230", 0.9);
  }
  k.brillo(g, PICO[0], PICO[1], 360, "255,205,110", 0.8 * k.pulso(t, baja1, 0.12));
  sinVista(g);
  velo(g, 0.45);
}

export const momentos = { florece, raya };
