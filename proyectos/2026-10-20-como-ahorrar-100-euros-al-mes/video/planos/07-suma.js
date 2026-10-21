// «Súmalos: casi cien euros al mes que ahora se te escapan.» · «No es ganar más: es dejar de perder.» ·
// «Envíaselo a ese amigo que nunca llega a fin de mes.»
// Vuelve el cubo del principio, con sus chorros. Cada agujero se tapa con un tapón de su color y enseña lo que ahorra
// (29 + 20 + 21 + 20 + 7); el total cuenta hasta 97. Luego las monedas ya solo entran, y el cubo, lleno, se aleja.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, cubo, chorro, fondo, velo, CUBO, COL, moneda } from "../mundo.js";

const F8 = v.frase(8), F9 = v.frase(9), F10 = v.frase(10);
export const desde = F8.inicio;

const Tcasi = F8.t("casi"), Tcien = F8.t("cien"), Tperder = F9.t("perder");
const { tramo: tr, suave: su, entra, azar, pulso } = k;
const AHORRO = [29, 20, 21, 20, 7];
const TTAP = AHORRO.map((_, i) => F8.inicio + 0.3 + i * 0.22);
const TOTAL = AHORRO.reduce((s, a) => s + a, 0);

const cam = camino2D([[F8.inicio, [0.95, 540, 1075]], [F9.inicio, [0.95, 540, 1075]], [F10.inicio + 0.2, [0.9, 540, 1070]], [F10.fin - 0.1, [0.82, 540, 1050]]]);

// los destellos del montón: puntos fijos que brillan por turnos
const DEST = (() => { const az = azar(515), L = []; for (let i = 0; i < 26; i++) { const u = az() * 2 - 1; L.push({ x: 540 + u * 300, y: 770 - (1 - u * u) * 120 - az() * 40, f: 0.8 + az() * 1.4, p: az() * 6.28 }); } return L; })();

export function dibuja(g, t) {
  fondo(g, "255,196,90", 1.0 + 0.5 * su(tr(t, Tperder - 0.1, Tperder + 0.4)), 1000);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const tap = TTAP.map((t0) => su(tr(t, t0, t0 + 0.28)));
  const monton = 1 + 0.55 * su(tr(t, F8.inicio + 1.2, F9.inicio + 1.2)) + 0.12 * su(tr(t, Tperder, Tperder + 0.6));
  // las monedas que ahora solo entran: caen desde arriba y se posan en el montón
  const dentro = (gg) => {
    const ini = F8.inicio + 1.9, rate = 3.4 + 7 * su(tr(t, F9.inicio, F9.inicio + 0.8)), vida = 1.0;
    for (let n = Math.floor((t - vida) * rate); n <= Math.floor(t * rate); n++) {
      const tn = n / rate;
      if (tn < ini) continue;
      const u = (t - tn) / vida;
      if (u < 0 || u > 1) continue;
      const az = azar(3000 + n * 17), x = 540 + (az() - 0.5) * 360, yl = CUBO.boca - 60 - az() * 40;
      const y = yl - (1 - u * u) * 900;
      if (u > 0.96) continue;
      moneda(gg, x, y, 40, az() * 6.28 + u * 9);
    }
  };
  cubo(g, t, { brillo: tap.map((p) => 0.15 * p), tapones: tap, monton, dentro });
  // fogonazo de color cuando cada tapón se pone
  CUBO.agujeros.forEach((h, i) => { const u = t - (TTAP[i] + 0.2); if (u > 0 && u < 0.5) k.brillo(g, h.x, h.y, 520, COL[h.col], 0.8 * Math.exp(-u * 6)); });
  // los chorros, que se cortan al tapar cada agujero
  CUBO.agujeros.forEach((h, i) => {
    const env = (tn) => (tn < TTAP[i] + 0.1 ? 1 : 0);
    chorro(g, t, h, { semilla: i + 1, rate: 20, r0: 30, env, color: COL[h.col], fuerza: 1.15 });
  });
  // al decir «perder», una fuente de monedas sube desde el montón: lo que se ahorra, de fiesta
  chorro(g, t, { x: 540, y: CUBO.boca - 110 }, { semilla: 99, rate: 46, r0: 34, env: (tn) => (tn > Tperder - 0.05 && tn < Tperder + 0.55 ? 1 : 0), centroX: 540, fuerza: 3.1, crece: 0.5, color: "255,214,90", gravedad: 2600 });
  // destellos del montón al final
  const brilloFinal = su(tr(t, F8.inicio + 2.0, F9.inicio + 0.5));
  for (const d of DEST) { const s = Math.max(0, Math.sin(t * d.f * 2.2 + d.p)); k.brillo(g, d.x, d.y + (1 - monton) * 0, 120 * s + 30, "amarilla", 0.9 * s * brilloFinal); }
  // lo que ahorra cada agujero, junto a su tapón
  CUBO.agujeros.forEach((h, i) => {
    const u = su(tr(t, TTAP[i] + 0.2, TTAP[i] + 0.45)) * (1 - su(tr(t, F9.inicio - 0.5, F9.inicio - 0.1)));
    if (u < 0.01) return;
    sinVista(g);
    const sx = 540 + (h.x - cx) * Z, sy = 960 + (h.y - cy) * Z - 78 - (1 - entra(u)) * 20;
    k.pastilla(g, sx, sy, "+" + AHORRO[i], "€", COL[h.col], u, 54);
    vista(g, Z, cx, cy);
  });
  // el resplandor de «perder»
  const f = t - Tperder;
  if (f > -0.05 && f < 1.0) k.brillo(g, 540, 800, 1500, "amarilla", 0.55 * Math.exp(-Math.max(0, f) * 3) * su(tr(f, -0.05, 0.1)));
  sinVista(g);
  g.textAlign = "left";
  velo(g, 0.7);
  // el total: cuenta hasta 97
  const cuenta = Math.round(TOTAL * su(tr(t, Tcasi - 0.25, Tcien + 0.25)));
  const a = su(tr(t, Tcasi - 0.3, Tcasi)) * (1 - su(tr(t, F9.inicio - 0.1, F9.inicio + 0.3)));
  k.pastilla(g, 540, 640, "+" + cuenta, "€ al mes", "255,222,120", a, 116);
}
