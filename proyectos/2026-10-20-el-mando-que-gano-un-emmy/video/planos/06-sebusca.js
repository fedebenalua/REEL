// «Hoy es tan normal que solo te acuerdas de él cuando desaparece.»
// Un cartel de «SE BUSCA» clavado en la pared. Se entra con un corte en «Hoy».
// - «Hoy es tan normal»: el cartel, con el dibujo del mando de hoy y «RECOMPENSA», se mueve un poco con el aire.
// - «cuando desaparece»: el dibujo del mando se borra y deja solo su silueta de puntos.
import * as k from "#kit";
import { v } from "#voz";
import { mandoHoy } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f6 = v.frase(6);
export const desde = (vz) => vz.frase(6).inicio;
const T0 = f6.inicio, Tacu = f6.t("acuerdas"), Tdes = f6.t("desaparece"), Fin = v.frase(7).inicio;
const papel = k.ruido(256, 33, 3, 4, "manchas");

export function dibuja(g, t) {
  // la pared de ladrillo
  g.fillStyle = "#8a3a2a"; g.fillRect(0, 0, 1080, 1920);
  for (let y = 0, f = 0; y < 1920; y += 70, f++) for (let x = (f % 2) * -70; x < 1080; x += 140) { g.fillStyle = (x + y) % 3 ? "#a24a34" : "#9a4230"; k.redondo(g, x + 4, y + 4, 132, 62, 6); g.fill(); }
  k.brillo(g, 540, 900, 1600, "255,220,160", 0.35);
  // el cartel
  const llega = entra(tr(t, T0 - 0.05, T0 + 0.4));
  g.save(); g.translate(540, mez(-600, 1020, llega)); g.rotate(-0.04 + 0.015 * Math.sin(t * 2.2));
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 40; g.shadowOffsetY = 18;
  g.fillStyle = "#f0e0b8"; g.fillRect(-360, -520, 720, 1040); g.restore();
  g.save(); g.globalAlpha = 0.35; g.globalCompositeOperation = "multiply"; g.drawImage(k.tenir(papel, "#b88a50"), -360, -520, 720, 1040); g.restore();
  g.fillStyle = "#3a1a0a"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 120px Figtree"; g.fillText("SE BUSCA", 0, -400);
  g.fillStyle = "#e8d4a4"; g.fillRect(-250, -310, 500, 560); g.strokeStyle = "#3a1a0a"; g.lineWidth = 6; g.strokeRect(-250, -310, 500, 560);
  const borra = su(tr(t, Tdes - 0.1, Tdes + 0.5));
  g.save(); g.translate(0, -30); g.rotate(-0.15); mandoHoy(g, 0, 0, 130, 0, { al: 1 - borra }); g.restore();
  if (borra > 0) { g.save(); g.globalAlpha = borra; g.translate(0, -30); g.rotate(-0.15); g.setLineDash([16, 12]); g.strokeStyle = "#3a1a0a"; g.lineWidth = 6; k.redondo(g, -65, -221, 130, 442, 45); g.stroke(); g.restore(); }
  g.fillStyle = "#b8202a"; g.font = "900 78px Figtree"; g.fillText("RECOMPENSA", 0, 360);
  // las chinchetas
  for (const [x, y] of [[-330, -490], [330, -490]]) { g.fillStyle = "#e0283c"; g.beginPath(); g.arc(x, y, 16, 0, 6.2832); g.fill(); }
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(30,10,6,0.6)"); vg.addColorStop(1, "rgba(30,10,6,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { desaparece: Tdes };
