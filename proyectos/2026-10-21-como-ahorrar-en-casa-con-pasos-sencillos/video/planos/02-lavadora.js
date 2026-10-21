// «Uno: lava en frío. De cada diez euros de luz de tu lavadora, ocho se van en calentar el agua.»
// Sigue en el lavadero, sin corte: la hucha se va y la cámara sube a la rueda de la lavadora.
// - «frío»: la rueda gira de 90° a frío; el agua pasa de rojo a azul y deja de hervir.
// - «diez euros»: la cámara se aleja y llegan diez monedas en fila delante de la lavadora.
// - «ocho»: ocho se ponen al rojo y se deshacen en vapor, una detrás de otra («calentar el agua»); quedan dos.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, lavadora, lavadero, moneda, vapor, hucha, velo, vineta, RUEDA, ORO } from "../mundo.js";

export const desde = (v) => v.frase(3).inicio;
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, azar } = k;
const f3 = v.frase(3);
const T0 = f3.inicio, Tfri = f3.t("frio"), Tdiez = f3.t("diez"), Teur = f3.t("euros"), Tocho = f3.t("ocho"), Tcal = f3.t("calentar"), Tagua = f3.t("agua"), Fin = v.frase(4).inicio;

const cam = camino2D([[T0, [0.76, 0, 160]], [Tfri - 0.25, [1.7, 180, -330]], [Tfri + 0.6, [1.7, 180, -320]], [Tdiez + 0.1, [1.12, 0, -120]], [Fin, [1.15, 0, -120]]]);
const frio = (t) => su(tr(t, Tfri - 0.15, Tfri + 0.5));
const MONEDAS = Array.from({ length: 10 }, (_, i) => ({ x: -405 + i * 90, llega: Tdiez - 0.1 + i * 0.05, quema: i < 8 ? Tocho - 0.1 + i * ((Tagua - Tocho + 0.1) / 8) : null }));
const Y = -230;

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  g.fillStyle = "#101018"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, cx, cy);
  lavadero(g, t, k.mezRgb("255,170,120", "150,200,255", frio(t)));
  const f = frio(t);
  lavadora(g, t, { calor: 1 - f, giro: t * 2.4, vaho: 0.35 * (1 - f), rueda: 1 - su(tr(t, Tfri - 0.2, Tfri + 0.3)), hierve: 1 - su(tr(t, Tfri, Tfri + 0.6)) });
  // la hucha se va por la izquierda
  const hx = mez(-40, -1400, k.sale(tr(t, T0, T0 + 0.6)));
  if (hx > -1300) { g.save(); g.translate(hx, 700); g.scale(0.85, 0.85); hucha(g, t, { brillo: 1 }); g.restore(); }
  // el aviso en la rueda: un aro azul al girar a frío
  const ar = k.pulso(t, Tfri + 0.2, 0.25);
  if (ar > 0.02) { g.save(); g.strokeStyle = `rgba(120,200,255,${ar})`; g.lineWidth = 10; g.beginPath(); g.arc(RUEDA[0], RUEDA[1], 80 + 40 * (1 - ar), 0, 6.2832); g.stroke(); g.restore(); k.brillo(g, RUEDA[0], RUEDA[1], 400, "120,200,255", 0.6 * ar); }
  // las diez monedas: llegan en fila; ocho se ponen al rojo y se evaporan
  for (const [i, m] of MONEDAS.entries()) {
    const u = k.entra(tr(t, m.llega, m.llega + 0.4)); if (u <= 0) continue;
    let al = 1, rojo = 0, y = Y + (1 - u) * -600, r = 44;
    if (m.quema !== null) {
      rojo = su(tr(t, m.quema, m.quema + 0.25)); const se = su(tr(t, m.quema + 0.2, m.quema + 0.6));
      al = 1 - se; y -= se * 120; r *= 1 - 0.3 * se;
      if (rojo > 0) k.brillo(g, m.x, y, 220, "255,90,30", 0.7 * rojo * (1 - se));
      if (se > 0 && se < 1) vapor(g, t, m.x, y, 60, Math.sin(Math.PI * se), { alto: 300, sem: 30 + i, n: 4, tam: 0.6 });
    }
    moneda(g, m.x, y + Math.sin(t * 3 + i) * 4, r, 0.03 * Math.sin(t * 2 + i), al);
    if (rojo > 0) { g.save(); g.globalAlpha = al * rojo * 0.65; g.fillStyle = "#ff4a10"; g.beginPath(); g.arc(m.x, y + Math.sin(t * 3 + i) * 4, r, 0, 6.2832); g.fill(); g.restore(); k.brillo(g, m.x, y, r * 3, "255,80,20", 0.9 * rojo * al); }
    // las dos que quedan brillan al final
    if (m.quema === null) k.brillo(g, m.x, y, 200, ORO, 0.5 * su(tr(t, Tagua - 0.1, Tagua + 0.3)));
  }
  sinVista(g);
  vineta(g, 0.45);
  velo(g, 0.5);
}
