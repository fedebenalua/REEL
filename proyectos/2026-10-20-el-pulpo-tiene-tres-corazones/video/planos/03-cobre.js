// «Cuando ese cobre coge oxígeno, se vuelve azul.»
// Otro sitio: dentro de la sangre del pulpo, casi transparente. Se entra con un corte en «Cuando».
// - «Cuando ese cobre»: flotan las piezas que llevan el oxígeno, cada una con sus dos bolas de cobre brillante; la del
//   medio, grande; en «cobre», un brillo recorre los cobres.
// - «coge oxígeno»: llegan burbujas de oxígeno; cada una se mete entre los dos cobres de una pieza, primero la del
//   medio, en «oxígeno».
// - «se vuelve azul»: cada pieza que ha cogido su oxígeno se enciende de azul, una tras otra; en «azul», todo es azul.
//   Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { burbuja } from "../mundo.js";

export const desde = "cuando";

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f = v.frase(6);
const T0 = f.inicio, Tcob = f.t("cobre"), Tcog = f.t("coge"), Toxi = f.t("oxigeno"), Tvue = f.t("vuelve"), Tazu = f.t("azul"), Fin = f.fin;

const az = azar(9393);
// las piezas: x, y en pantalla, r su tamaño, z la profundidad (0 cerca, 1 lejos); la primera, la del medio
const PIEZAS = [{ x: 540, y: 1000, r: 250, z: 0, coge: Toxi - 0.05, ang: 0.3 }];
const SITIOS = [[180, 640], [880, 620], [150, 1330], [900, 1360], [520, 1560], [330, 1880 - 1000], [760, 880 - 120], [40, 980], [1040, 1060], [560, 560], [300, 1150], [760, 1180]];
SITIOS.forEach(([x, y], i) => PIEZAS.push({ x: x + (az() - 0.5) * 60, y: y + (az() - 0.5) * 60, r: 70 + az() * 80, z: 0.3 + az() * 0.7, coge: mez(Toxi + 0.05, Tazu - 0.12, i / (SITIOS.length - 1)), ang: az() * 6.28 }));
PIEZAS.sort((a, b) => b.z - a.z);
// de dónde viene la burbuja de cada una
PIEZAS.forEach((p) => { const a = az() * 6.28; p.bx = p.x + Math.cos(a) * p.r * 3.2; p.by = p.y + Math.sin(a) * p.r * 2.6 + p.r * 1.5; p.f = az() * 6.28; });

function pieza(g, p, t, zoom) {
  const llega = p.coge, azul = su(tr(t, llega + 0.05, llega + 0.4));
  const dx = 14 * Math.sin(t * 0.8 + p.f) * (1 - p.z * 0.5), dy = 18 * Math.cos(t * 0.6 + p.f);
  const x = 540 + (p.x + dx - 540) * zoom, y = 1000 + (p.y + dy - 1000) * zoom, r = p.r * zoom;
  const al = 1 - 0.55 * p.z;
  g.save(); g.globalAlpha = al;
  // el brillo azul alrededor cuando ya lleva oxígeno
  if (azul > 0.01) k.brillo(g, x, y, r * 4.2, "60,150,255", 0.8 * azul);
  // la pieza: una bola blanda, casi transparente (azul cuando lleva oxígeno)
  g.save(); g.translate(x, y); g.rotate(p.ang + t * 0.15);
  g.beginPath();
  for (let i = 0; i <= 48; i++) { const a = (i / 48) * 6.2832, rr = r * (0.95 + 0.07 * Math.sin(3 * a + p.f) + 0.05 * Math.sin(5 * a + p.f * 2) + 0.02 * Math.sin(t * 2 + a * 2)); i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.9) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.9); }
  g.closePath();
  const pg = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.2);
  pg.addColorStop(0, `rgba(${k.mezRgb("245,235,245", "170,220,255", azul)},0.55)`);
  pg.addColorStop(0.6, `rgba(${k.mezRgb("200,185,215", "50,130,255", azul)},0.35)`);
  pg.addColorStop(1, `rgba(${k.mezRgb("150,135,175", "20,70,220", azul)},0.6)`);
  g.fillStyle = pg; g.fill();
  g.strokeStyle = `rgba(${k.mezRgb("235,225,245", "150,210,255", azul)},0.55)`; g.lineWidth = Math.max(1.5, r * 0.025); g.stroke();
  g.save(); g.clip(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.25; g.drawImage(k.red2, -r * 1.3, -r * 1.3, r * 2.6, r * 2.6); g.restore();
  g.restore();
  // los dos cobres, y el oxígeno que se mete entre ellos
  const sep = r * 0.36, cr = r * 0.2, brilla = k.pulso(t, Tcob + 0.1 + p.z * 0.3, 0.18);
  const u = tr(t, llega - 0.55, llega);
  if (u > 0 && t < llega + 0.3) {
    const e = su(u), bx = mez(p.bx, p.x + dx, e), by = mez(p.by, p.y + dy, e);
    burbuja(g, 540 + (bx - 540) * zoom, 1000 + (by - 1000) * zoom, mez(r * 0.32, r * 0.16, e), Math.min(1, u * 4) * (1 - su(tr(t, llega, llega + 0.3))));
  }
  for (const s of [-1, 1]) {
    const cx = x + s * sep * Math.cos(p.ang), cy = y + s * sep * Math.sin(p.ang);
    g.beginPath(); g.arc(cx, cy, cr, 0, 6.2832);
    const cg = g.createRadialGradient(cx - cr * 0.35, cy - cr * 0.4, cr * 0.08, cx, cy, cr);
    cg.addColorStop(0, "#fff0d8"); cg.addColorStop(0.3, "#f2a565"); cg.addColorStop(0.7, "#b9581e"); cg.addColorStop(1, "#4a1c06");
    g.fillStyle = cg; g.fill();
    k.brillo(g, cx - cr * 0.3, cy - cr * 0.35, cr * 2.2, "255,200,140", 0.35 + 0.6 * brilla);
  }
  // el oxígeno ya cogido: brilla entre los dos cobres
  if (azul > 0.01) { k.brillo(g, x, y, r * 1.4, "150,210,255", azul); k.brillo(g, x, y, r * 0.5, "255,255,255", 0.7 * azul); }
  g.restore();
}

// las motas que flotan en la sangre
const MOTAS = Array.from({ length: 90 }, () => ({ x: az() * 1080, y: az() * 1920, r: 2 + az() * 6, f: az() * 6.28 }));

export function dibuja(g, t) {
  const todo = su(tr(t, Tvue - 0.1, Tazu + 0.2));
  const bg = g.createRadialGradient(540, 1000, 100, 540, 1000, 1300);
  bg.addColorStop(0, k.mezColor("#4a3f5e", "#1f5fc0", todo)); bg.addColorStop(0.6, k.mezColor("#241d33", "#0c2c70", todo)); bg.addColorStop(1, k.mezColor("#0c0912", "#041030", todo));
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.1 + 0.08 * todo; g.drawImage(k.causticas, -200 + t * 10, -200, 1500, 2400); g.restore();
  const zoom = mez(1, 1.12, su(tr(t, T0, Fin)));
  g.save(); g.globalCompositeOperation = "lighter";
  for (const m of MOTAS) { g.fillStyle = `rgba(${k.mezRgb("220,200,240", "150,210,255", todo)},0.25)`; g.beginPath(); g.arc(m.x + 10 * Math.sin(t + m.f), m.y - t * 15 % 1920, m.r, 0, 6.2832); g.fill(); }
  g.restore();
  for (const p of PIEZAS) pieza(g, p, t, zoom);
  k.brillo(g, 540, 1000, 2400, "120,190,255", 0.35 * k.pulso(t, Tazu + 0.05, 0.15));
  const vg = g.createLinearGradient(0, 180, 0, 640); vg.addColorStop(0, "rgba(5,5,15,0.6)"); vg.addColorStop(1, "rgba(5,5,15,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

export const momentos = { coge: Toxi - 0.05, azul: Tazu };
