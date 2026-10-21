// «Esa luz es infrarroja: tus ojos no la ven, pero la cámara del móvil sí.»
// La punta del mando, de frente, en el salón a oscuras. Se entra con un corte en «Esa».
// - «Esa luz es infrarroja»: la punta enorme; el botón rojo se hunde una y otra vez y la lucecita no se ve: solo un
//   temblor del aire, como en el hook.
// - «pero la cámara del móvil»: el mando se aparta arriba a la izquierda y entra un móvil por abajo; en su pantalla,
//   la misma punta, con la lucecita encendida en morado. «sí»: brilla más fuerte.
import * as k from "#kit";
import { v } from "#voz";
import { ROJO, movil } from "../mundo.js";

const { suave: su, tramo: tr, mez, azar, entra } = k;
const f7 = v.frase(7);
export const desde = (vz) => vz.frase(7).inicio;
const T0 = f7.inicio, Tpero = f7.t("pero"), Tcam = f7.t("camara"), Tsi = f7.t("si"), Fin = v.frase(8).inicio;

// el botón se pulsa a golpes, cada 0,55 s; cada golpe manda un destello
const GOLPES = []; for (let te = T0 + 0.25; te < Fin - 0.6; te += 0.55) GOLPES.push(te);
const golpe = (t) => GOLPES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.06, 0.09)), 0);

const azB = azar(12);
const BOKEH = Array.from({ length: 24 }, () => ({ x: azB() * 1080, y: azB() * 1920, r: 60 + azB() * 160, c: ["255,140,80", "255,80,180", "120,100,255"][Math.floor(azB() * 3)] }));

// La punta del mando de frente, centrada en (cx, cy), de ancho w: la cara de plástico rojo oscuro con la lucecita, y
// arriba la tapa con los botones, alejándose. led: lo que brilla la lucecita (0 a 1); p: el botón rojo hundido.
function punta(g, cx, cy, w, led, p) {
  const h = w * 0.4, sup = w * 0.42;
  // la tapa de arriba, que se aleja hacia el fondo
  g.save();
  g.beginPath(); g.moveTo(cx - w / 2 + 10, cy - h / 2 + 6); g.lineTo(cx - w * 0.36, cy - h / 2 - sup); g.lineTo(cx + w * 0.36, cy - h / 2 - sup); g.lineTo(cx + w / 2 - 10, cy - h / 2 + 6); g.closePath();
  const tg = g.createLinearGradient(0, cy - h / 2 - sup, 0, cy - h / 2); tg.addColorStop(0, "#15151a"); tg.addColorStop(1, "#3a3c45");
  g.fillStyle = tg; g.fill();
  g.clip(); g.globalAlpha = 0.25; g.globalCompositeOperation = "multiply"; g.drawImage(k.red, cx - w / 2, cy - h / 2 - sup, w, sup); g.restore();
  // los botones, aplastados por la perspectiva
  const bot = (bx, by, r, col, hund = 0) => {
    const x = cx + bx * w, y = cy - h / 2 - by * sup + hund * 4, rx = r * w, ry = r * w * 0.38;
    g.fillStyle = "rgba(0,0,0,0.55)"; g.beginPath(); g.ellipse(x, y + ry * 0.5, rx, ry, 0, 0, 6.2832); g.fill();
    const bg = g.createLinearGradient(0, y - ry, 0, y + ry); bg.addColorStop(0, k.mezColor(col, "#ffffff", 0.3 * (1 - hund))); bg.addColorStop(1, k.mezColor(col, "#000000", 0.4));
    g.fillStyle = bg; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.2832); g.fill();
  };
  bot(-0.22, 0.32, 0.085, "#e0283c", p); bot(0.22, 0.32, 0.07, "#3b3d46");
  for (let i = -1; i <= 1; i++) bot(i * 0.17, 0.72, 0.055, "#3b3d46");
  if (p > 0) k.brillo(g, cx - 0.22 * w, cy - h / 2 - 0.32 * sup, w * 0.35, "255,90,110", 0.7 * p);
  // la cara de la punta: plástico rojo oscuro y brillante
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = w * 0.08; g.shadowOffsetY = w * 0.04;
  k.redondo(g, cx - w / 2, cy - h / 2, w, h, h * 0.42); g.fillStyle = "#1a0710"; g.fill(); g.restore();
  k.redondo(g, cx - w / 2, cy - h / 2, w, h, h * 0.42);
  const cg = g.createRadialGradient(cx - w * 0.15, cy - h * 0.3, 10, cx, cy, w * 0.6);
  cg.addColorStop(0, "#5a1530"); cg.addColorStop(0.5, "#2c0a18"); cg.addColorStop(1, "#12040a");
  g.fillStyle = cg; g.fill();
  g.strokeStyle = "rgba(255,180,210,0.25)"; g.lineWidth = w * 0.006; g.stroke();
  // la lucecita detrás del plástico
  g.fillStyle = "rgba(90,60,120,0.6)"; g.beginPath(); g.arc(cx, cy, w * 0.07, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.arc(cx - w * 0.02, cy - w * 0.02, w * 0.025, 0, 6.2832); g.fill();
  // el reflejo del plástico
  g.save(); k.redondo(g, cx - w / 2, cy - h / 2, w, h, h * 0.42); g.clip();
  const rg = g.createLinearGradient(0, cy - h / 2, 0, cy); rg.addColorStop(0, "rgba(255,255,255,0.16)"); rg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(cx - w / 2, cy - h / 2, w, h * 0.4);
  g.restore();
  if (led > 0) {
    k.brillo(g, cx, cy, w * 1.6, "200,110,255", 0.8 * led);
    k.brillo(g, cx, cy, w * 0.6, "255,235,255", led);
  }
}

// lo que no se ve: un temblor transparente que sale de la punta
function temblor(g, cx, cy, w, t) {
  g.save();
  for (const te of GOLPES) {
    const u = (t - te) / 0.7; if (u < 0 || u > 1) continue;
    const r = mez(w * 0.1, w * 0.9, u), al = Math.min(1, u * 5) * (1 - u);
    g.strokeStyle = `rgba(210,220,255,${0.22 * al})`; g.lineWidth = 6;
    g.beginPath(); g.arc(cx, cy, r, 0, 6.2832); g.stroke();
  }
  g.restore();
}

export function dibuja(g, t) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#0c0918"); fg.addColorStop(1, "#1a1028");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) { const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${b.c},0.12)`); gr.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = gr; g.fillRect(b.x - b.r, b.y - b.r, 2 * b.r, 2 * b.r); }
  g.restore();
  const p = golpe(t);
  // el mando: grande en el centro; con el móvil, se aparta arriba a la izquierda
  const ap = su(tr(t, Tpero - 0.1, Tcam + 0.1));
  const cx = mez(540, 330, ap), cy = mez(1020, 820, ap) + 6 * Math.sin(t * 1.3), w = mez(860, 560, ap);
  punta(g, cx, cy, w, 0, p);
  temblor(g, cx, cy, w, t);
  // el móvil entra por abajo a la derecha
  const en = entra(tr(t, Tpero - 0.05, Tcam + 0.15));
  if (en > 0) {
    const si = su(tr(t, Tsi - 0.08, Tsi + 0.15));
    movil(g, mez(760, 720, en), mez(2500, 1200, en), 500, mez(0.25, 0.07, en), (c, W, H) => {
      const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#120d1e"); bg.addColorStop(1, "#22152f");
      c.fillStyle = bg; c.fillRect(0, 0, W, H);
      c.save(); c.globalAlpha = 0.45; c.globalCompositeOperation = "lighter";
      for (const b of BOKEH.slice(0, 10)) { const x = b.x * 0.8, y = b.y * 0.95, gr = c.createRadialGradient(x, y, 0, x, y, b.r * 1.3); gr.addColorStop(0, `rgba(${b.c},0.25)`); gr.addColorStop(1, `rgba(${b.c},0)`); c.fillStyle = gr; c.fillRect(x - b.r * 1.3, y - b.r * 1.3, b.r * 2.6, b.r * 2.6); }
      c.restore();
      // la misma punta, con la lucecita encendida a cada golpe
      punta(c, W / 2, H * 0.47, W * 0.86, Math.min(1, 0.35 + p * 0.9) * (0.75 + 0.25 * si) + 0.3 * si, p);
      // la interfaz de la cámara
      c.fillStyle = "rgba(0,0,0,0.4)"; c.fillRect(0, H - 330, W, 330); c.fillRect(0, 0, W, 170);
      c.strokeStyle = "#fff"; c.lineWidth = 12; c.beginPath(); c.arc(W / 2, H - 165, 90, 0, 6.2832); c.stroke();
      c.fillStyle = "#fff"; c.beginPath(); c.arc(W / 2, H - 165, 72, 0, 6.2832); c.fill();
      c.fillStyle = "#ffd23c"; c.font = "800 52px Figtree"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FOTO", W / 2, H - 290);
    }, Math.min(1, en * 3));
    // «sí»: un destello en la pantalla del móvil
    k.brillo(g, 720, 1150, 900, "200,110,255", 0.5 * k.pulso(t, Tsi + 0.05, 0.15));
  }
}

export const momentos = { golpes: GOLPES, movil: Tpero };
