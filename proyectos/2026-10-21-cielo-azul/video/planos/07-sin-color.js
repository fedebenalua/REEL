// «Así que el cielo no tiene color propio: es lo que el aire le hace a la luz del Sol.»
// Otro sitio: el campo, con el Sol. Se entra con un corte en «Así». El mismo cielo, tres veces:
// - «el cielo no tiene color propio»: de día, azul; el Sol baja y el cielo se vuelve rojo y naranja, atardecer.
// - «es lo que el aire le hace»: las motitas del aire se ven flotando por todo el cielo.
// - «a la luz del Sol»: el aire desaparece de golpe y el cielo se queda negro, con estrellas, y el Sol blanco.
import * as k from "#kit";
import { v } from "#voz";
import { colinas, cieloEstado, estrellasQuietas, sol, nube } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f = v.frase(11);
const T0 = f.inicio, Tcolor = f.t("color"), Tpropio = f.t("propio"), Tes = f.t("es"), Taire = f.t("aire"), Thace = f.t("hace"), Tluz = f.t("luz"), Tsol = f.t("sol"), Fin = f.fin;

const az = azar(31);
const MOTAS = Array.from({ length: 140 }, () => ({ x: az() * 1080, y: 250 + az() * 1050, f: az() * 6.28, r: 3 + az() * 3.5 }));

export function dibuja(g, t) {
  const atardecer = su(tr(t, T0 + 0.7, Tpropio + 0.5)), vacio = su(tr(t, Tluz - 0.05, Tluz + 0.35));
  const e = atardecer + vacio;
  cieloEstado(g, e);
  estrellasQuietas(g, su(tr(vacio, 0.5, 1)) * 0.9);

  // el Sol baja con el atardecer; con el aire quitado, se queda enorme y blanco sobre el horizonte
  const sy = mez(760, 1190, atardecer), sr = mez(82, 96, atardecer) * mez(1, 1.12, vacio);
  sol(g, 800, sy, sr, 1, mez(1, 0.8, atardecer));
  if (atardecer > 0.3) k.brillo(g, 800, sy + 30, 1700, "255,110,40", 0.55 * atardecer * (1 - vacio));
  nube(g, 1, 220, 640, 300, 0.95 * (1 - atardecer * 0.55) * (1 - vacio));
  nube(g, 3, 700, 1010, 360, 0.9 * (1 - atardecer * 0.55) * (1 - vacio));

  // las motas del aire: se ven flotando mientras el aire está, y desaparecen de golpe con él
  const aire = su(tr(t, Tes - 0.05, Thace)) * (1 - vacio);
  if (aire > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (const m of MOTAS) {
      const x = m.x + Math.sin(t * 1.1 + m.f) * 14, y = m.y + Math.cos(t * 0.9 + m.f * 1.3) * 14;
      g.fillStyle = `rgba(235,225,255,${0.8 * aire})`; g.beginPath(); g.arc(x, y, m.r, 0, 6.2832); g.fill();
      k.brillo(g, x, y, m.r * 7, "200,180,255", 0.5 * aire);
    }
    g.restore();
  }
  if (t >= Tluz - 0.02) k.fogonazo(g, 800, sy, t - (Tluz - 0.02), 1500, "235,240,255");
  colinas(g, 0, Math.max(atardecer * 0.55, vacio));

  const vg = g.createLinearGradient(0, 200, 0, 650); vg.addColorStop(0, "rgba(6,8,30,0.5)"); vg.addColorStop(1, "rgba(6,8,30,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 650);
}
