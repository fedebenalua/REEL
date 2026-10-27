// «...tu cerebro, lo que una bombilla.»
// Otro sitio: una bombilla en la oscuridad, con el cerebro de oro dentro, como filamento. Corte en «tu».
// - Fotograma 0: la bombilla grande, con el cerebro brillando flojo dentro, girando despacio.
// - «bombilla»: se enciende del todo: su luz llena la sala; «20 W». Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, velo } from "../mundo.js";

export const desde = "tu";

const { suave, tramo } = k;
const f5 = v.frase(5);
const T0 = f5.t("tu"), Tbom = f5.t("bombilla"), Tfin = v.frase(6).inicio;

const CX = 540, CY = 900, RG = 320;

function forma(g) {
  // el globo y el cuello que baja hasta la rosca
  g.beginPath();
  g.arc(CX, CY, RG, Math.PI * 0.72, Math.PI * 0.28, false);
  g.bezierCurveTo(CX + RG * 0.62, CY + RG * 1.0, CX + RG * 0.44, CY + RG * 1.15, CX + RG * 0.42, CY + RG * 1.32);
  g.lineTo(CX - RG * 0.42, CY + RG * 1.32);
  g.bezierCurveTo(CX - RG * 0.44, CY + RG * 1.15, CX - RG * 0.62, CY + RG * 1.0, CX + Math.cos(Math.PI * 0.72) * RG, CY + Math.sin(Math.PI * 0.72) * RG);
  g.closePath();
}

export function dibuja(g, t) {
  const enc = suave(tramo(t, Tbom - 0.15, Tbom + 0.25)), z = 1 + 0.05 * suave(tramo(t, T0, Tfin));
  // la sala: oscura, y se ilumina cálida cuando se enciende
  const fg = g.createRadialGradient(CX, CY, 50, CX, CY, 1300);
  fg.addColorStop(0, k.mezColor("#1a1420", "#5a3a1a", enc)); fg.addColorStop(0.5, k.mezColor("#0c0a12", "#2a1a10", enc)); fg.addColorStop(1, "#040408");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.translate(CX, CY + 200); g.scale(z, z); g.translate(-CX, -CY - 200);
  // el resplandor
  k.brillo(g, CX, CY, 1500 + 700 * enc, "255,200,110", 0.25 + 0.55 * enc);
  // el cerebro, dentro
  const cam = k.mira([0, 0, 6.2], [0, 0, 0]);
  g.save(); forma(g); g.clip();
  const ig = g.createRadialGradient(CX, CY, 20, CX, CY, RG * 1.1); ig.addColorStop(0, `rgba(255,220,150,${0.12 + 0.3 * enc})`); ig.addColorStop(1, "rgba(255,200,120,0.03)");
  g.fillStyle = ig; g.fillRect(CX - RG, CY - RG, RG * 2, RG * 2.4);
  cerebro(g, cam, [0, 0.05, 0], 1.25, 1.5 + 0.35 * (t - T0), t, { al: 0.7 + 0.5 * enc, nucleo: 0.6 + 1.2 * enc });
  g.restore();
  // el cristal
  forma(g); k.vidrio(g, CX - RG, CX + RG, 0.5);
  k.reflejo(g, CX - RG * 0.62, CY - RG * 0.55, 36, RG * 0.75, 0.3);
  // la rosca: bandas de metal
  for (let i = 0; i < 5; i++) {
    const y = CY + RG * 1.32 + i * 46, w = RG * (0.44 - i * 0.012);
    g.beginPath(); k.redondo(g, CX - w, y, 2 * w, 44, 16); k.metal(g, CX - w, CX + w);
  }
  g.beginPath(); g.moveTo(CX - RG * 0.3, CY + RG * 1.32 + 230); g.quadraticCurveTo(CX, CY + RG * 1.32 + 300, CX + RG * 0.3, CY + RG * 1.32 + 230); g.closePath();
  k.metal(g, CX - RG * 0.3, CX + RG * 0.3, ["#3a2a12", "#c79a44", "#6b4c1e", "#e8c27a", "#3a2a12"]);
  g.restore();
  k.pastilla(g, 230, 1320, "20", "W", "255,215,140", suave(tramo(t, Tbom, Tbom + 0.25)), 100);
  velo(g);
}
