// «Además, hay aviso: los satélites ven salir la nube horas o días antes, y...»
// Otro sitio: el espacio entre el Sol y la Tierra. El Sol arriba a la derecha, la Tierra pequeña abajo a la izquierda y,
// en medio, un satélite dorado que mira al Sol. Corte en «Además».
// - «hay aviso»: la luz del satélite parpadea; su antena mira al Sol.
// - «ven salir la nube»: el Sol revienta y suelta una nube hacia la Tierra; el satélite la ve (un destello en su antena).
// - «horas o días antes»: el satélite manda el aviso: pulsos de luz que corren hasta la Tierra y llegan mucho antes que
//   la nube, que va despacio; la Tierra se rodea de un anillo y sale «aviso».
import * as k from "#kit";
import { v } from "#voz";
import { CIELO, llamarada, nube, solDeCerca, tierraNoche } from "../mundo.js";

const f8 = v.frase(8);
export const desde = f8.inicio;

const { suave, tramo } = k;
const T0 = f8.inicio, Tav = f8.t("aviso"), Tsal = f8.t("salir"), Thor = f8.t("horas"), Tlas = f8.t("las");
const CAM = k.mira([0, 0, 60], [0, 0, -100]);
const SOL = [860, 720], TIERRA = [220, 1330];
const S = 0.55, SAT = [SOL[0] + (TIERRA[0] - SOL[0]) * S, SOL[1] + (TIERRA[1] - SOL[1]) * S];
const DIR = Math.atan2(TIERRA[1] - SOL[1], TIERRA[0] - SOL[0]);
const T_VE = Tsal + 0.25, T_LLEGA = Thor;

function satelite(g, x, y, s, t, ve) {
  g.save();
  g.translate(x, y + Math.sin(t * 1.2) * 6); g.rotate(DIR + Math.PI + 0.08 * Math.sin(t * 0.6));
  // los paneles
  for (const lado of [-1, 1]) {
    g.fillStyle = "#555c66"; g.fillRect(-s * 0.08, lado * s * 0.55, s * 0.16, lado * s * 0.35);
    const px = -s * 0.55, py = lado > 0 ? s * 0.9 : -s * 2.9, w = s * 1.1, h = s * 2;
    const pg = g.createLinearGradient(px, py, px + w, py + h); pg.addColorStop(0, "#1c3a7a"); pg.addColorStop(0.5, "#3b6ad0"); pg.addColorStop(1, "#1a3068");
    g.fillStyle = pg; g.fillRect(px, py, w, h);
    g.strokeStyle = "rgba(170,200,255,0.55)"; g.lineWidth = 2;
    for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(px, py + (i * h) / 6); g.lineTo(px + w, py + (i * h) / 6); g.stroke(); }
    g.beginPath(); g.moveTo(px + w / 2, py); g.lineTo(px + w / 2, py + h); g.stroke();
  }
  // el cuerpo, con su manta dorada
  const og = g.createLinearGradient(-s * 0.6, -s * 0.6, s * 0.6, s * 0.6);
  og.addColorStop(0, "#7a5410"); og.addColorStop(0.35, "#ffd968"); og.addColorStop(0.6, "#c8962c"); og.addColorStop(1, "#6a4a10");
  g.fillStyle = og; g.fillRect(-s * 0.6, -s * 0.55, s * 1.2, s * 1.1);
  g.strokeStyle = "rgba(255,240,180,0.35)"; g.lineWidth = 2;
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-s * 0.6 + i * s * 0.35, -s * 0.55); g.lineTo(-s * 0.45 + i * s * 0.3, s * 0.55); g.stroke(); }
  // el ojo que mira al Sol (delante, hacia +x)
  g.fillStyle = "#2a2e36"; g.fillRect(s * 0.6, -s * 0.25, s * 0.4, s * 0.5);
  g.fillStyle = "#0c1018"; g.beginPath(); g.ellipse(s * 1.0, 0, s * 0.08, s * 0.22, 0, 0, Math.PI * 2); g.fill();
  g.restore();
  g.save(); g.globalCompositeOperation = "lighter";
  const ox = x + Math.cos(DIR + Math.PI) * s, oy = y + Math.sin(t * 1.2) * 6 + Math.sin(DIR + Math.PI) * s;
  k.brillo(g, ox, oy, s * 2.5, "160,220,255", 0.25 + 0.75 * ve);
  // la luz que parpadea
  const parpadeo = t > Tav - 0.1 ? 0.5 + 0.5 * Math.sin((t - Tav) * 9) : 0.3;
  k.brillo(g, x, y + Math.sin(t * 1.2) * 6 - s * 0.7, s * 0.8, "255,90,70", parpadeo);
  g.restore();
}

export function dibuja(g, t) {
  k.fondo(g, CAM);
  k.estrellas(g, CAM, null, CIELO);
  const zoom = k.mez(0.92, 1.12, (u => 0.6 * u + 0.4 * suave(u))(tramo(t, T0, Tlas)));
  g.save(); g.translate(SAT[0], SAT[1]); g.scale(zoom, zoom); g.translate(-SAT[0], -SAT[1]);
  // la nube, que sale despacio hacia la Tierra
  const R = k.claves([[Tsal - 0.05, 60], [Tlas + 0.2, 380]])(t);
  nube(g, SOL[0], SOL[1], R, 0.85 * suave(tramo(t, Tsal - 0.05, Tsal + 0.3)), t, 0.5, DIR);
  solDeCerca(g, SOL[0], SOL[1], 150, t, 0.4 * k.pulso(t, Tsal, 0.5));
  g.save(); g.globalCompositeOperation = "lighter";
  g.translate(SOL[0] + Math.cos(DIR) * 140, SOL[1] + Math.sin(DIR) * 140); g.rotate(DIR + Math.PI / 2);
  llamarada(g, 0, 0, t - Tsal + 0.1, 200);
  g.restore();
  // lo que mira el satélite: un haz tenue hacia el Sol
  const haz = suave(tramo(t, f8.t("satelites") - 0.1, f8.t("satelites") + 0.3));
  if (haz > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    const hg = g.createLinearGradient(SAT[0], SAT[1], SOL[0], SOL[1]);
    hg.addColorStop(0, `rgba(140,210,255,${0.22 * haz})`); hg.addColorStop(1, "rgba(140,210,255,0)");
    g.fillStyle = hg; g.beginPath(); g.moveTo(SAT[0], SAT[1]);
    for (const s of [-1, 1]) g.lineTo(SOL[0] + Math.cos(DIR + Math.PI / 2) * 170 * s, SOL[1] + Math.sin(DIR + Math.PI / 2) * 170 * s);
    g.closePath(); g.fill(); g.restore();
  }
  // el aviso: pulsos de luz que corren del satélite a la Tierra
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const u = tramo(t, T_VE + i * 0.14, T_LLEGA + i * 0.14);
    if (u <= 0 || u >= 1) continue;
    const x = SAT[0] + (TIERRA[0] - SAT[0]) * u, y = SAT[1] + (TIERRA[1] - SAT[1]) * u;
    k.brillo(g, x, y, 90, "120,220,255", 0.9);
    k.brillo(g, x, y, 30, "235,250,255", 1);
  }
  g.restore();
  tierraNoche(g, TIERRA[0], TIERRA[1], 90, 1.5 + t * 0.08, { inc: 0.35, sol: [0.7, 0.6, 0.2] });
  // el anillo de aviso alrededor de la Tierra
  const llega = tramo(t, T_LLEGA, T_LLEGA + 0.9);
  if (llega > 0 && llega < 1) {
    g.save(); g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(130,220,255,${0.8 * (1 - llega)})`; g.lineWidth = 6;
    g.beginPath(); g.arc(TIERRA[0], TIERRA[1], 100 + llega * 160, 0, Math.PI * 2); g.stroke();
    g.restore();
  }
  satelite(g, SAT[0], SAT[1], 70, t, k.pulso(t, T_VE, 0.4));
  k.etiqueta(g, TIERRA[0] + 40, TIERRA[1] + 150, "aviso", "150,225,255", suave(tramo(t, T_LLEGA, T_LLEGA + 0.25)), 46);
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(3,5,10,0.45)"); vg.addColorStop(1, "rgba(3,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
