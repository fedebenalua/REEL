// «Solo con los tres primeros, son más de mil cuatrocientos euros al año.»
// Otro sitio: el tarro, enorme, delante de una luz cálida. Corte en «Solo».
// - Caen en él monedas y billetes, cada vez más deprisa, y se llena; el contador corre hasta «1.435 €» en «cuatrocientos».
// - «euros al año»: un fogonazo dorado y el tarro lleno, quieto, antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, moneda, billete, tarro, velo, vineta, ORO, VERDE } from "../mundo.js";

export const desde = (v) => v.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f7 = v.frase(7);
const T0 = f7.inicio, Tmil = f7.t("mil"), Tcua = f7.t("cuatrocientos"), Teur = f7.t("euros"), Fin = v.frase(8).inicio;
const llena = (t) => su(tr(t, T0 + 0.1, Tcua + 0.3));
const CAEN = Array.from({ length: 40 }, (_, i) => { const az = azar(500 + i); return { t0: T0 - 0.2 + Math.pow(i / 40, 0.8) * (Tcua - T0), x: (az() - 0.5) * 300, b: az() < 0.25, n: [50, 20, 10][Math.floor(az() * 3)], g: az() }; });
const BOKEH = (() => { const az = azar(15), l = []; for (let i = 0; i < 20; i++) l.push({ x: az() * 1080, y: az() * 1920, r: 60 + az() * 160, c: ["255,200,110", "255,150,90", "160,255,180"][i % 3] }); return l; })();

export function dibuja(g, t) {
  g.save(); sinVista(g);
  const bg = g.createRadialGradient(540, 1000, 50, 540, 1000, 1300); bg.addColorStop(0, "#2a6a4a"); bg.addColorStop(1, "#08200f"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "lighter"; for (const b of BOKEH) { const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${b.c},0.2)`); gr.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.2832); g.fill(); }
  g.restore();
  const Z = mez(1.2, 1.4, su(tr(t, T0, Fin)));
  vista(g, Z, 0, -180);
  const flash = t > Teur ? k.pulso(t, Teur + 0.1, 0.25) : 0;
  g.save(); g.translate(0, 300); tarro(g, t, llena(t), { brillo: 0.4 * llena(t) + flash }); g.restore();
  for (const c of CAEN) {
    const u = tr(t, c.t0, c.t0 + 0.45); if (u <= 0 || u >= 1) continue;
    const y = mez(-1300, 300 - 560 * 0.9 + 60, u * u);
    if (c.b) { g.save(); g.translate(c.x * 0.6, y); g.rotate(c.g * 2 + u); g.scale(0.55, 0.55); billete(g, c.n); g.restore(); }
    else moneda(g, c.x * 0.6, y, 34, c.g + u * 2, 1);
  }
  sinVista(g);
  const cuenta = Math.round(1435 * su(tr(t, T0 + 0.2, Tcua + 0.2)));
  const txt = cuenta >= 1000 ? `${Math.floor(cuenta / 1000)}.${String(cuenta % 1000).padStart(3, "0")} €` : `${cuenta} €`;
  const p = su(tr(t, T0, T0 + 0.25)) * (1 - su(tr(t, Fin - 0.35, Fin - 0.1)));
  if (p > 0.01) { const s = 1 + 0.25 * k.pulso(t, Tcua + 0.25, 0.15); g.save(); g.translate(540, 1330); g.scale(s, s); k.pastilla(g, 0, 0, txt, "al año", cuenta >= 1435 ? VERDE : ORO, p, 130); g.restore(); }
  if (flash > 0.01) { g.save(); g.globalAlpha = flash; k.fogonazo(g, 540, 1000, t - Teur - 0.1, 900, ORO); g.restore(); }
  vineta(g, 0.45);
  velo(g, 0.45, "5,20,10");
}
