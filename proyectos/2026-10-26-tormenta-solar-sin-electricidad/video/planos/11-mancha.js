// «...y auroras que veríamos desde España. Envíaselo a ese amigo que guarda velas por si acaso.»
// Otro sitio: La Mancha de noche. Una loma con tres molinos blancos, una casa encalada delante con su ventana, y el cielo
// lleno de una aurora roja y rosa (así se vio desde España en mayo de 2024). Corte en «auroras».
// - «auroras que veríamos»: la cámara mira al cielo, lleno de cortinas rojas que ondulan.
// - «desde España»: baja y aparecen los molinos en la loma, recortados contra la aurora, con las aspas girando.
// - «Envíaselo a ese amigo»: la cámara se acerca a la casa, a su ventana encendida.
// - «que guarda velas»: dentro, una vela encendida en el alféizar; su llama brilla y tiembla. Se queda así hasta el final.
import * as k from "#kit";
import { v } from "#voz";
import { AURORA_ROJA, auroras, cielo } from "../mundo.js";

const f9 = v.frase(9), f10 = v.frase(10);
export const desde = f9.t("auroras");

const { suave, tramo } = k;
const Taur = f9.t("auroras"), Tesp = f9.t("espana"), T10 = f10.inicio, Tvel = f10.t("velas");
const ROSA = "255,80,130";
const HZ = 1270;
const W = [720, 1585];
const LOMA = (() => { const az = k.azar(5), p = []; for (let x = -200; x <= 1300; x += 30) p.push([x, HZ - 90 * Math.exp(-Math.pow((x - 430) / 520, 2)) - 10 * az()]); return p; })();
const altoLoma = (x) => HZ - 90 * Math.exp(-Math.pow((x - 430) / 520, 2));
const MOLINOS = [[170, 0.8, 0.3], [430, 1, 1.7], [700, 0.86, 3.1]];

function molino(g, x, s, t, fase, luz) {
  const y = altoLoma(x) + 6, h = 230 * s, wb = 70 * s, wt = 52 * s;
  const mg = g.createLinearGradient(x - wb / 2, 0, x + wb / 2, 0);
  mg.addColorStop(0, `rgb(${110 + 40 * luz},${80 + 20 * luz},${100 + 25 * luz})`); mg.addColorStop(1, "#3a3040");
  g.fillStyle = mg;
  g.beginPath(); g.moveTo(x - wb / 2, y); g.lineTo(x - wt / 2, y - h); g.lineTo(x + wt / 2, y - h); g.lineTo(x + wb / 2, y); g.closePath(); g.fill();
  // el tejado de cono y la puerta
  g.fillStyle = "#1c1620"; g.beginPath(); g.moveTo(x - wt / 2 - 4 * s, y - h); g.lineTo(x, y - h - 42 * s); g.lineTo(x + wt / 2 + 4 * s, y - h); g.closePath(); g.fill();
  g.fillStyle = "#151018"; g.fillRect(x - 9 * s, y - 40 * s, 18 * s, 40 * s);
  // las aspas, que giran despacio
  const cx = x, cy = y - h - 14 * s, L = 150 * s, a0 = fase + t * 0.35;
  g.save(); g.translate(cx, cy);
  for (let i = 0; i < 4; i++) {
    g.save(); g.rotate(a0 + (i * Math.PI) / 2);
    g.fillStyle = "#1a141c"; g.fillRect(-3 * s, 0, 6 * s, L);
    g.strokeStyle = "rgba(40,30,44,0.95)"; g.lineWidth = 2.5 * s; g.strokeRect(3 * s, L * 0.22, 26 * s, L * 0.78);
    for (let j = 1; j < 6; j++) { g.beginPath(); g.moveTo(3 * s, L * (0.22 + j * 0.13)); g.lineTo(29 * s, L * (0.22 + j * 0.13)); g.stroke(); }
    g.restore();
  }
  g.fillStyle = "#2a2230"; g.beginPath(); g.arc(0, 0, 8 * s, 0, Math.PI * 2); g.fill();
  g.restore();
}

function casa(g, t, llama) {
  // la casa encalada, con su zócalo azul y el tejado de teja
  const x0 = 380, x1 = 1180, y0 = 1400;
  const cg = g.createLinearGradient(0, y0, 0, 2000); cg.addColorStop(0, "#7e6c7c"); cg.addColorStop(1, "#40343f");
  g.fillStyle = cg; g.fillRect(x0, y0, x1 - x0, 700);
  g.fillStyle = "#2a1c1c"; g.beginPath(); g.moveTo(x0 - 30, y0 + 4); g.lineTo(x0 + 40, y0 - 60); g.lineTo(x1 + 40, y0 - 60); g.lineTo(x1 + 40, y0 + 4); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,150,180,0.25)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + 40, y0 - 60); g.lineTo(x1 + 40, y0 - 60); g.stroke();
  g.fillStyle = "#24365e"; g.fillRect(x0, 1900, x1 - x0, 120);
  // la ventana encendida, con su marco azul
  const [wx, wy] = W, ww = 130, wh = 160;
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, wx, wy, 380, "255,170,90", 0.35 + 0.25 * llama); g.restore();
  const ig = g.createRadialGradient(wx, wy + 40, 5, wx, wy, 150); ig.addColorStop(0, "#ffcf80"); ig.addColorStop(0.5, "#c87a3a"); ig.addColorStop(1, "#4a2818");
  g.fillStyle = ig; g.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
  // la vela en el alféizar
  const vx = wx, vy = wy + wh / 2 - 8;
  g.fillStyle = "#f4ead8"; g.fillRect(vx - 9, vy - 44, 18, 44);
  g.fillStyle = "#d8ccb8"; g.fillRect(vx + 3, vy - 44, 6, 44);
  g.fillStyle = "#2a2020"; g.fillRect(vx - 1, vy - 52, 2, 9);
  const tiembla = Math.sin(t * 13) * 1.2 + Math.sin(t * 7.3) * 0.8;
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, vx, vy - 62, 90 + 40 * llama, "255,190,100", 0.7 + 0.3 * llama);
  g.restore();
  g.fillStyle = "#ffb040"; g.beginPath(); g.ellipse(vx + tiembla * 0.5, vy - 62, 6, 13, tiembla * 0.04, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#fff4c8"; g.beginPath(); g.ellipse(vx + tiembla * 0.4, vy - 60, 3, 7, 0, 0, Math.PI * 2); g.fill();
  // el marco y la cruz
  g.strokeStyle = "#1e3a6e"; g.lineWidth = 12; g.strokeRect(wx - ww / 2, wy - wh / 2, ww, wh);
  g.lineWidth = 6; g.beginPath(); g.moveTo(wx, wy - wh / 2); g.lineTo(wx, wy - 4); g.moveTo(wx - ww / 2, wy - 20); g.lineTo(wx + ww / 2, wy - 20); g.stroke();
  g.fillStyle = "#c8bcc4"; g.fillRect(wx - ww / 2 - 16, wy + wh / 2 + 4, ww + 32, 14);
}

export function dibuja(g, t) {
  const baja = suave(tramo(t, Tesp - 0.6, Tesp + 0.5));
  const acerca = suave(tramo(t, T10 - 0.1, Tvel + 0.2));
  const dy = k.mez(620, 0, baja);
  const S = k.mez(1, 1.75, acerca);
  const cx = k.mez(W[0], 540, acerca), cy = k.mez(W[1] + dy, 1180, acerca);
  const aY = (y) => cy + (y - W[1]) * S;
  const hz = aY(HZ);
  cielo(g, t, 1, 0, ROSA, hz);
  auroras(g, t, 1, Math.min(hz - 40, 1500), AURORA_ROJA, t * 30);
  g.save();
  g.translate(cx - W[0] * S, cy - W[1] * S); g.scale(S, S);
  // la loma y el suelo
  g.beginPath(); g.moveTo(-200, 2600);
  for (const [x, y] of LOMA) g.lineTo(x, y);
  g.lineTo(1300, 2600); g.closePath();
  const lg = g.createLinearGradient(0, HZ - 90, 0, 2000); lg.addColorStop(0, "#22182a"); lg.addColorStop(0.3, "#120c16"); lg.addColorStop(1, "#06040a");
  g.fillStyle = lg; g.fill();
  for (const [x, s, f] of MOLINOS) molino(g, x, s, t, f, 1);
  casa(g, t, k.pulso(t, Tvel, 0.8));
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(2,3,10,0.6)"); vg.addColorStop(1, "rgba(2,3,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
