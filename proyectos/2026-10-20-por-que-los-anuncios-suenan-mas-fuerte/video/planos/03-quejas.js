// «Hay tantas quejas que en 2025 la CNMC abrió una consulta para medirlo mejor.»
// La onda del anuncio, al fondo, y las quejas que caen. Se entra con un corte en «Hay».
// - «Hay tantas quejas»: caen bocadillos de quejas («¡Qué alto!», «¡Bajadlo!», «¡Otra vez!»…) y se amontonan.
// - «2025 la CNMC abrió una consulta»: la cifra; una lupa enorme pasa por encima de la onda del anuncio, midiéndola.
import * as k from "#kit";
import { v } from "#voz";
import { ANUNCIO, onda, techo } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f6 = v.frase(6);
export const desde = (vz) => vz.frase(6).inicio;
const T0 = f6.inicio, Tque = f6.t("quejas"), Tano = f6.t("2025"), Tcnmc = f6.t("cnmc"), Tcon = f6.t("consulta"), Tmed = f6.t("medirlo"), Fin = v.frase(7).inicio;
const azQ = azar(8);
const TEXTOS = ["¡Qué alto!", "¡Bajadlo!", "¡Otra vez!", "¡Mi oído!", "¿Por qué?", "¡Que duerme el bebé!", "¡Más bajo!", "¡Siempre igual!"];
const QUEJAS = Array.from({ length: 16 }, (_, i) => ({ txt: TEXTOS[i % TEXTOS.length], x: 160 + azQ() * 760, y: 820 + (i % 6) * 110 + azQ() * 40, a: (azQ() - 0.5) * 0.3, t: T0 + 0.1 + i * 0.12, c: ["255,90,110", "255,200,90", "120,200,255", "190,140,255"][i % 4] }));

export function dibuja(g, t) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#1a0e24"); fg.addColorStop(1, "#0a0612");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  // la onda del anuncio, al fondo
  onda(g, ANUNCIO, (t - T0) * 18, 50, 70, 1010, 1080, 240, "255,120,140", 0, 0.5);
  techo(g, 50, 1030, 1080, 240, 0.5, "límite");
  // las quejas: caen y se quedan
  const vanse = su(tr(t, Tano - 0.2, Tano + 0.4));
  for (const q of QUEJAS) {
    const u = entra(tr(t, q.t, q.t + 0.3)); if (u <= 0) continue;
    const y = mez(-200, q.y, u) + 900 * vanse * vanse;
    g.save(); g.translate(q.x, y); g.rotate(q.a); g.globalAlpha = 1 - vanse * 0.6;
    g.font = "800 44px Figtree"; const w = g.measureText(q.txt).width + 60;
    g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20;
    k.redondo(g, -w / 2, -45, w, 90, 40); g.fillStyle = "#fff"; g.fill(); g.shadowBlur = 0;
    g.beginPath(); g.moveTo(-20, 40); g.lineTo(0, 76); g.lineTo(12, 40); g.fill();
    g.fillStyle = `rgb(${q.c})`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(q.txt, 0, 2);
    g.restore();
  }
  // la lupa que mide
  const lupa = su(tr(t, Tcon - 0.3, Tcon)), lx = mez(-200, mez(250, 830, su(tr(t, Tcon, Tmed + 0.4))), lupa), ly = 1050;
  if (lupa > 0) {
    g.save(); g.beginPath(); g.arc(lx, ly, 200, 0, 6.2832); g.clip();
    g.fillStyle = "rgba(40,20,60,0.5)"; g.fillRect(lx - 200, ly - 200, 400, 400);
    g.translate(lx, ly); g.scale(1.6, 1.6); g.translate(-lx, -ly);
    onda(g, ANUNCIO, (t - T0) * 18, 50, 70, 1010, 1080, 240, "255,120,140", 0, 1);
    g.restore();
    g.strokeStyle = "#e8e8f0"; g.lineWidth = 26; g.beginPath(); g.arc(lx, ly, 200, 0, 6.2832); g.stroke();
    g.strokeStyle = "#5a3a20"; g.lineWidth = 46; g.lineCap = "round"; g.beginPath(); g.moveTo(lx + 150, ly + 150); g.lineTo(lx + 330, ly + 330); g.stroke();
    k.reflejo(g, lx - 130, ly - 150, 40, 120, 0.4);
  }
  k.pastilla(g, 540, 640, "2025", "", "255,215,140", su(tr(t, Tano - 0.1, Tano + 0.2)), 110);
  k.etiqueta(g, 400, 760, "CNMC: consulta", "255,215,140", su(tr(t, Tcnmc - 0.1, Tcnmc + 0.2)), 46);
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(10,6,18,0.6)"); vg.addColorStop(1, "rgba(10,6,18,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { quejas: T0, lupa: Tcon };
