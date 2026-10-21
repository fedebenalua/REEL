// «Hoy los botones siguen ahí, y el rojo, por ejemplo, abre contenidos extra del canal.»
// El salón de hoy, con la tele plana y el mando de colores. Una cámara.
// - «Hoy los botones siguen ahí»: el mando sube desde abajo y, en la tele, aparecen las cuatro etiquetas de colores.
// - «el rojo»: el botón rojo se enciende y la cámara se acerca; la etiqueta roja late.
// - «abre contenidos extra»: pulsa, sale la luz hacia la tele y la etiqueta roja se abre en un panel de extras.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { salonHoy, teleHoy, mandoColores, MC, TELE, IR } from "../objetos.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f = v.frase(9);
const T0 = f.inicio, Tbot = f.t("botones"), Tahi = f.t("ahi"), Troj = f.t("rojo"), Tabr = f.t("abre"), Textra = f.t("extra");
const FIN = v.frase(10).inicio;
const LEDY = -60;

const cam = camino2D([
  [T0, [0.78, 0, -330]], [Troj - 0.5, [0.78, 0, -330]], [Troj + 0.15, [1.0, 0, 190]], [Tabr - 0.55, [1.0, 0, 190]], [Tabr + 0.3, [0.78, 0, -330]], [FIN, [0.78, 0, -330]],
]);

const PRESS = Tabr - 0.05;
const prensa = (t) => su(tr(t, PRESS - 0.1, PRESS)) * (1 - su(tr(t, PRESS + 0.25, PRESS + 0.4)));
const burst = (t, p) => Math.max(su(tr(t, p, p + 0.06)) * (1 - su(tr(t, p + 0.18, p + 0.28))), su(tr(t, p + 0.3, p + 0.36)) * (1 - su(tr(t, p + 0.42, p + 0.5))));
const rayo = (t) => burst(t, PRESS);

// las cuatro etiquetas de colores que la tele pone abajo
const ETQ = [["Extras", "#e01818", "#fff"], ["Vídeos", "#18b848", "#04200c"], ["Tiempo", "#f0c814", "#2a2000"], ["Juegos", "#2a4ae0", "#fff"]];
const [cx0, cy0, w0, h0] = [TELE.cx, TELE.cy, TELE.w, TELE.h];
const PW = 190, PH = 56, PGAP = 22, PYY = cy0 + h0 / 2 - 60;
const pastillaRect = (i) => [cx0 - (4 * PW + 3 * PGAP) / 2 + i * (PW + PGAP), PYY - PH / 2, PW, PH];
const PANEL = [cx0 - 400, cy0 - 235, 800, 400];

function etiquetas(g, t) {
  const al = (i) => su(tr(t, Tbot + 0.12 * i, Tbot + 0.12 * i + 0.4));
  const abre = su(tr(t, Tabr - 0.02, Tabr + 0.5));
  g.save(); redondo(g, cx0 - w0 / 2, cy0 - h0 / 2, w0, h0, 8); g.clip();
  ETQ.forEach(([txt, c1, c2], i) => {
    const a = al(i); if (a <= 0.01) return;
    const [x, y, w, h] = pastillaRect(i);
    const late = i === 0 ? 1 + 0.12 * Math.max(k.pulso(t, Troj, 0.3), k.pulso(t, Troj + 0.6, 0.25)) : 1;
    if (i === 0 && abre > 0.01) return;
    g.save(); g.globalAlpha = a; g.translate(x + w / 2, y + h / 2 + 14 * (1 - a)); g.scale(late, late);
    redondo(g, -w / 2, -h / 2, w, h, 14); g.fillStyle = c1; g.fill();
    if (i === 0 && late > 1.01) k.brillo(g, 0, 0, 200, "255,70,60", 0.9 * (late - 1) * 5);
    g.font = "800 30px Figtree"; g.fillStyle = c2; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 0, 2);
    g.restore();
  });
  // el panel: nace de la etiqueta roja
  if (abre > 0.001) {
    const [rx, ry, rw, rh] = pastillaRect(0), [px, py, pw, ph] = PANEL;
    const x = mez(rx, px, abre), y = mez(ry, py, abre), w = mez(rw, pw, abre), h = mez(rh, ph, abre);
    redondo(g, x, y, w, h, mez(14, 28, abre)); g.fillStyle = `rgba(10,6,20,${0.55 + 0.4 * abre})`; g.fill();
    g.strokeStyle = "#ff4a3c"; g.lineWidth = 8; redondo(g, x, y, w, h, mez(14, 28, abre)); g.stroke();
    const ca = su(tr(abre, 0.55, 1));
    if (ca > 0.01) {
      g.globalAlpha = ca;
      g.fillStyle = "#e01818"; redondo(g, px + 30, py + 28, 190, 56, 14); g.fill();
      g.font = "800 32px Figtree"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("EXTRAS", px + 125, py + 58);
      for (let i = 0; i < 3; i++) {
        const tx = px + 30 + i * 255, ty = py + 120, aa = su(tr(t, Textra - 0.4 + 0.12 * i, Textra - 0.05 + 0.12 * i));
        g.save(); g.globalAlpha = ca * aa; g.translate(0, 18 * (1 - aa));
        const gr = g.createLinearGradient(tx, ty, tx + 230, ty + 190); gr.addColorStop(0, ["#ff6a5a", "#4a9aff", "#ffd24a"][i]); gr.addColorStop(1, ["#7a1a24", "#16307a", "#7a5a10"][i]);
        redondo(g, tx, ty, 230, 190, 22); g.fillStyle = gr; g.fill();
        g.fillStyle = "rgba(255,255,255,0.92)"; g.beginPath(); g.arc(tx + 115, ty + 85, 34, 0, 6.2832); g.fill(); g.fillStyle = ["#c0281c", "#1a4aaa", "#b08a10"][i]; g.beginPath(); g.moveTo(tx + 105, ty + 68); g.lineTo(tx + 134, ty + 85); g.lineTo(tx + 105, ty + 102); g.closePath(); g.fill();
        g.fillStyle = "rgba(255,255,255,0.75)"; redondo(g, tx + 20, ty + 150, 150, 14, 7); g.fill();
        g.restore();
      }
    }
  }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  salonHoy(g, t, "255,60,180");
  const ri = rayo(t);
  teleHoy(g, t, { canalN: 0, enc: 1, ojo: Math.min(1, ri * 1.2) });
  etiquetas(g, t);
  // el flash de la tele al abrir el panel
  const fl = k.pulso(t, Tabr + 0.1, 0.18); if (fl > 0.01) k.brillo(g, 0, TELE.cy, 900, "255,90,70", 0.5 * fl);
  // el mando de colores
  const offR = 950 * (1 - su(tr(t, Tbot - 0.3, Tbot + 0.5)));
  const lit = [0, 0, 0, 0]; lit[0] = Math.max(su(tr(t, Troj - 0.1, Troj + 0.2)) * (1 - 0.45 * su(tr(t, Troj + 0.8, Troj + 1.1))), prensa(t));
  const bote = [prensa(t), 0, 0, 0];
  g.save(); g.translate(0, LEDY + offR); g.translate(0, -282);
  mandoColores(g, t, { led: ri, lit, bote });
  if (prensa(t) > 0.01) k.brillo(g, MC.xs[0], MC.y, 330, "255,255,255", 0.6 * prensa(t));
  g.restore();
  // el anillo del botón rojo al nombrarlo
  { const u = (t - Troj) / 0.8; if (u > 0 && u < 1) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,80,70,${0.9 * (1 - u)})`; g.lineWidth = 12 * (1 - u) + 3; g.beginPath(); g.arc(MC.xs[0], LEDY - 282 + MC.y, MC.r * (1.2 + 2.2 * u), 0, 6.2832); g.stroke(); g.restore(); } }
  // la luz infrarroja del mando a la tele
  if (ri > 0.01) {
    const [SX, SY] = TELE.ojo; g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (const [col, w2] of [[`rgba(${IR},${0.25 * ri})`, 60], [`rgba(${IR},${0.95 * ri})`, 20], [`rgba(255,235,240,${0.9 * ri})`, 7]]) { g.strokeStyle = col; g.lineWidth = w2; g.beginPath(); g.moveTo(0, LEDY); g.lineTo(SX, SY + 30); g.stroke(); }
    g.restore();
  }
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { botones: Tbot, rojo: Troj, abre: Tabr };
