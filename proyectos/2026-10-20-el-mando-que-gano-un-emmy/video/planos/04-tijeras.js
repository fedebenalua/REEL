// «Así que le quitaron el cable…»
// El cable, de cerca, cruzando la pantalla. Se entra con un corte en «Así».
// - «le quitaron el cable»: unas tijeras enormes se cierran en «cable» y el cable se parte: las dos mitades saltan
//   hacia los lados y se van.
import * as k from "#kit";
import { v } from "#voz";

const { suave: su, tramo: tr, mez, entra, sale } = k;
const f5 = v.frase(5);
export const desde = (vz) => vz.frase(5).inicio;
const T0 = f5.inicio, Tqui = f5.t("quitaron"), Tcab = f5.t("cable"), Fin = f5.t("en");
export const corta = Tcab + 0.02;

function tijeras(g, x, y, s, abre) {
  g.save(); g.translate(x, y); g.scale(s, s);
  for (const sgn of [-1, 1]) {
    g.save(); g.rotate(sgn * abre * 0.45);
    // la hoja
    g.beginPath(); g.moveTo(0, -14); g.lineTo(-520, -4 * sgn - 6); g.lineTo(-520, 6); g.lineTo(0, 14); g.closePath();
    const hg = g.createLinearGradient(0, -14, 0, 14); hg.addColorStop(0, "#ffffff"); hg.addColorStop(0.5, "#b8c0cc"); hg.addColorStop(1, "#6a7280");
    g.fillStyle = hg; g.fill();
    // el mango
    g.strokeStyle = "#e0283c"; g.lineWidth = 34; g.beginPath(); g.ellipse(170, sgn * 70, 90, 55, sgn * 0.4, 0, 6.2832); g.stroke();
    g.strokeStyle = "#e0283c"; g.lineWidth = 30; g.beginPath(); g.moveTo(10, 0); g.lineTo(90, sgn * 40); g.stroke();
    g.restore();
  }
  g.fillStyle = "#c9ced6"; g.beginPath(); g.arc(0, 0, 18, 0, 6.2832); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const fg = g.createRadialGradient(540, 960, 100, 540, 960, 1200); fg.addColorStop(0, "#f2c26a"); fg.addColorStop(1, "#c2803a");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  const parte = sale(tr(t, corta, corta + 0.5));
  // el cable, cruzando de lado a lado, que se parte por el centro
  for (const lado of [-1, 1]) {
    g.save(); g.translate(540 + lado * 900 * parte, 980 + 200 * parte * parte); g.rotate(lado * 0.4 * parte);
    g.lineCap = "round";
    for (const [w, c] of [[70, "#1a1a1e"], [52, "#3a3a40"], [12, "rgba(255,255,255,0.3)"]]) {
      g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(lado * 6, Math.sin(t * 2) * 6); g.lineTo(lado * 900, Math.sin(t * 2 + lado) * 30); g.stroke();
    }
    if (parte > 0) { g.fillStyle = "#c86a2a"; g.beginPath(); g.arc(lado * 6, 0, 16, 0, 6.2832); g.fill(); }
    g.restore();
  }
  // las tijeras: llegan abiertas y se cierran en «cable»
  const llega = entra(tr(t, T0 - 0.05, Tqui)), abre = 1 - su(tr(t, corta - 0.15, corta)), va = sale(tr(t, corta + 0.25, Fin - 0.15));
  tijeras(g, mez(1300, 760, llega) + 600 * va, 980 - 400 * va, 1.0, abre);
  k.fogonazo(g, 540, 980, (t - corta) * 1.6, 600, "255,220,150");
}

export const momentos = { corta };
