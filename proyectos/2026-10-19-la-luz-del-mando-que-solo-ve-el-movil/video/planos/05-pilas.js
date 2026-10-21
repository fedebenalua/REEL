// «Y si un día el mando no va, apúntalo a la cámara: si no ves la luz, son las pilas.»
// El mando y el móvil otra vez, como en el hook. Se entra con un corte en «Y».
// - «el mando no va»: el botón rojo se pulsa una y otra vez y no pasa nada, ni siquiera el temblor.
// - «apúntalo a la cámara»: el móvil sube a su sitio; «si no ves la luz»: en su pantalla, la punta sigue apagada.
// - «son las pilas»: entran dos pilas grandes, vacías, con su marca roja que late.
import * as k from "#kit";
import { v } from "#voz";
import { camaraDelMovil, fondoOscuro, movil, puntaDeFrente } from "../mundo.js";
import { MANDO, MOVIL } from "./01-movil.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f9 = v.frase(9);
export const desde = (vz) => vz.frase(9).inicio;
const T0 = f9.inicio, Tno = f9.t("no"), Tapu = f9.t("apuntalo"), Tves = f9.t("ves"), Tpil = f9.t("pilas"), Tson = f9.t("son"), Fin = v.frase(10).inicio;
const GOLPES = [Tno, Tno + 0.5, Tapu + 0.4, Tves - 0.1, Tves + 0.4];
const golpe = (t) => GOLPES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.06, 0.09)), 0);
export const pilas = Tson + 0.05;

// una pila grande, tumbada, centrada en (x, y), de largo L, girada ang; nivel: lo que le queda (0 a 1)
function pila(g, x, y, L, ang, nivel, t) {
  const h = L * 0.3;
  g.save(); g.translate(x, y); g.rotate(ang);
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 50; g.shadowOffsetY = 25;
  k.redondo(g, -L / 2, -h / 2, L, h, h * 0.18); g.fillStyle = "#111"; g.fill(); g.restore();
  // el cuerpo: negro y cobre
  k.redondo(g, -L / 2, -h / 2, L, h, h * 0.18);
  const cg = g.createLinearGradient(0, -h / 2, 0, h / 2);
  cg.addColorStop(0, "#5a5d68"); cg.addColorStop(0.18, "#2a2b33"); cg.addColorStop(0.55, "#121216"); cg.addColorStop(1, "#2a2b33");
  g.fillStyle = cg; g.fill();
  g.save(); k.redondo(g, -L / 2, -h / 2, L, h, h * 0.18); g.clip();
  const cu = g.createLinearGradient(0, -h / 2, 0, h / 2); cu.addColorStop(0, "#ffcf8a"); cu.addColorStop(0.2, "#d2853a"); cu.addColorStop(0.6, "#7a4318"); cu.addColorStop(1, "#c07a35");
  g.fillStyle = cu; g.fillRect(L / 2 - L * 0.3, -h / 2, L * 0.3, h);
  g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(-L / 2, -h / 2 + h * 0.12, L, h * 0.08);
  g.restore();
  // el polo +
  const pg = g.createLinearGradient(0, -h * 0.2, 0, h * 0.2); pg.addColorStop(0, "#f2f4f7"); pg.addColorStop(1, "#7d838c");
  g.fillStyle = pg; k.redondo(g, L / 2 - 4, -h * 0.17, h * 0.16, h * 0.34, 6); g.fill();
  g.fillStyle = "#fff"; g.font = `800 ${Math.round(h * 0.5)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("+", L / 2 - L * 0.15, 2);
  // la marca de lo que le queda: casi vacía, en rojo
  const bw = L * 0.42, bx = -L / 2 + L * 0.12, bh = h * 0.36;
  k.redondo(g, bx, -bh / 2, bw, bh, bh * 0.25); g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 6; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.fillRect(bx + bw, -bh * 0.22, 10, bh * 0.44);
  const late = 0.6 + 0.4 * Math.sin(t * 9);
  k.redondo(g, bx + 8, -bh / 2 + 8, Math.max(14, (bw - 16) * nivel), bh - 16, 6); g.fillStyle = `rgba(255,50,60,${late})`; g.fill();
  g.restore();
  k.brillo(g, x - L * 0.12, y, L * 0.8, "255,60,70", 0.35 * late);
}

export function dibuja(g, t) {
  fondoOscuro(g);
  const p = golpe(t);
  // el mando, grande al principio; luego arriba a la izquierda, y el móvil sube
  const ap = su(tr(t, Tapu - 0.1, Tapu + 0.5));
  const mx = mez(540, MANDO.x, ap), my = mez(1000, MANDO.y, ap), mw = mez(900, MANDO.w, ap);
  puntaDeFrente(g, mx, my + 6 * Math.sin(t * 1.3), mw, 0, p);
  const en = entra(tr(t, Tapu - 0.15, Tapu + 0.45));
  if (en > 0) movil(g, MOVIL.x, mez(2600, MOVIL.y, en), MOVIL.w, MOVIL.ang, camaraDelMovil(0, p));
  // las pilas
  const e1 = entra(tr(t, pilas, pilas + 0.35)), e2 = entra(tr(t, pilas + 0.1, pilas + 0.45));
  const nivel = mez(0.35, 0.06, su(tr(t, pilas + 0.2, pilas + 0.8)));
  if (e1 > 0) pila(g, mez(-500, 520, e1), 1060, 760, -0.12, nivel, t);
  if (e2 > 0) pila(g, mez(1600, 560, e2), 1300, 760, -0.06, nivel, t);
}

export const momentos = { golpes: GOLPES, pilas };
