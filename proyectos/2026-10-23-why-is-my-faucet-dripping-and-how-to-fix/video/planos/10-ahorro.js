// «A washer that costs about a dollar just saved you three thousand gallons a year.»
// La arandela nueva, enorme y brillante; «dollar»: «$1». «saved»: la arandela sube y las garrafas, ahora verdes,
// se amontonan debajo de ella; el contador sube a 3.000.
import * as k from "#kit";
import { v } from "#voz";
import { camara, gradV, velo, viñeta } from "../mundo.js";
import { arandelaDisco } from "../corte.js";
import { pila } from "../jarras.js";

const F = v.frase(11);
export const desde = F.inicio - 0.04;
export const FIN = v.frase(12).inicio - 0.04;
const { suave: su, tramo: tr, mez } = k;
const Tdol = F.t("dollar"), Tsaved = F.t("saved"), Tgal = F.t("gallons"), Tyear = F.t("year"), T0 = desde;

export function dibuja(g, t) {
  g.fillStyle = gradV(g, 0, 1920, [[0, "#0c3b4a"], [0.55, "#0e5a5c"], [1, "#07262e"]]); g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 800, 1700, "150,255,200", 0.2);
  k.rayos(g, t, 1920, 0.5, 6, "190,255,220");
  // el suelo
  g.fillStyle = gradV(g, 1420, 1920, [[0, "#0a3a3a"], [1, "#03171a"]]); g.fillRect(0, 1420, 1080, 500);
  g.fillStyle = "rgba(190,255,230,0.5)"; g.fillRect(0, 1418, 1080, 4);
  // las garrafas verdes (lo ahorrado)
  pila(g, t, { t0: Tsaved + 0.2, dur: 1.3, base: 1418, filas: 8, w: 112, h: 124, x0: 540, verde: 1 });
  // la arandela: grande al principio, luego sube y se hace pequeña, encima del montón
  const up = su(tr(t, Tsaved - 0.15, Tsaved + 0.5));
  const cx = 540, cy = mez(860, 505, up), esc = mez(2.9, 1.05, up);
  const flota = Math.sin(t * 2.4) * 10 * (1 - up);
  k.brillo(g, cx, cy + flota, 900 * esc / 2.9 * 1.4, "255,170,130", 0.5);
  g.save(); g.translate(cx, cy + flota); g.scale(esc, esc);
  arandelaDisco(g, 0, 0, 100, 36 + 6 * Math.sin(t * 1.6), 34, 0);
  g.restore();
  // «$1»
  const a1 = su(tr(t, Tdol - 0.1, Tdol + 0.2)) * (1 - su(tr(t, Tsaved + 0.1, Tsaved + 0.4)));
  k.pastilla(g, 540, 1180 + 40 * (1 - a1), "$1", "", "170,255,200", a1, 190);
  // el contador de lo ahorrado
  const n = Math.round(3000 * su(tr(t, Tsaved + 0.3, Tgal + 0.1)));
  const a2 = su(tr(t, Tsaved + 0.2, Tsaved + 0.5));
  k.pastilla(g, 540, 1010, n.toLocaleString("en-US"), "gal saved", "170,255,200", a2, 120);
  velo(g, 0.3); viñeta(g, 0.4);
}
