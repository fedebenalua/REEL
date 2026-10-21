// «Hoy tu mando usa una luz que no ves, y sigue gastando pilas.»
// El mando de hoy, blanco, sobre un fondo claro de ahora. Se entra con un corte en «Hoy».
// - «Hoy tu mando»: entra deslizando y se queda en el centro, enorme.
// - «una luz que no ves»: de la punta sale un temblor transparente, nada más.
// - «sigue gastando pilas»: se ve por dentro: sus dos pilas, que bajan de verde a rojo.
import * as k from "#kit";
import { v } from "#voz";
import { mandoHoy } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f8 = v.frase(8);
export const desde = (vz) => vz.frase(8).inicio;
const T0 = f8.inicio, Tluz = f8.t("luz"), Tsig = f8.t("sigue"), Tgas = f8.t("gastando"), Tpil = f8.t("pilas"), Fin = v.frase(9).inicio;

export function dibuja(g, t) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#ffd9e4"); fg.addColorStop(0.5, "#f6c9ff"); fg.addColorStop(1, "#b9c8ff");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 900, 1600, "255,255,255", 0.5);
  const en = entra(tr(t, T0 - 0.05, T0 + 0.5));
  const x = mez(1500, 540, en), y = 1130, w = 250, ang = mez(0.6, -0.08, en);
  // la luz que no ves: un temblor
  const top = { x: x + Math.sin(-ang) * -w * 1.8, y: y - w * 1.8 * Math.cos(ang) };
  g.save(); g.strokeStyle = "rgba(120,60,200,0.8)"; g.lineWidth = 6;
  for (let i = 0; i < 5; i++) { const u = (((t - Tluz) * 1.2 + i / 5) % 1 + 1) % 1, r = mez(40, 520, u); g.globalAlpha = su(tr(t, Tluz - 0.2, Tluz + 0.2)) * Math.min(1, u * 5) * (1 - u) * 0.6; g.beginPath(); g.arc(top.x, top.y, r, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
  g.restore();
  mandoHoy(g, x, y, w, t, { ang, rayos: su(tr(t, Tsig - 0.1, Tgas + 0.1)), pila: 1 - su(tr(t, Tgas, Tpil + 0.4)) * 0.92 });
  k.pastilla(g, 540, 590, "hoy", "", "120,60,200", su(tr(t, T0 + 0.1, T0 + 0.4)) * (1 - su(tr(t, Tsig - 0.2, Tsig + 0.1))), 100);
  const vg = g.createLinearGradient(0, 180, 0, 640); vg.addColorStop(0, "rgba(50,16,60,0.72)"); vg.addColorStop(0.55, "rgba(50,16,60,0.5)"); vg.addColorStop(1, "rgba(50,16,60,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

export const momentos = { entra: T0 };
