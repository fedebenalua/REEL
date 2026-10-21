// «El segundo, las suscripciones: cancela dos de diez euros que ni abres y son veinte al mes.»
// Un móvil grande con sus apps. Dos de ellas, las que ni abres, sueltan monedas sin parar. En «cancela» se marcan, en
// «diez» sale lo que cuestan, y en «y» se van: el chorro se acaba. En «veinte», la cifra.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, chorro, fondo, velo, COL } from "../mundo.js";

const F = v.frase(4);
export const desde = F.inicio;

const Tcancela = F.t("cancela"), Tdiez = F.t("diez"), Ty = F.t("y"), Tveinte = F.t("veinte");
const { tramo: tr, suave: su, entra, redondo, azar } = k;
const AC = COL.subs;

// el móvil: centro y medidas; la parrilla de apps
const PX = 540, PY = 990, PW = 500, PH = 980;
const COLS = [390, 540, 690], FILAS = [660, 825, 990, 1155];
const TAM = 112;
const NO_USADAS = [6, 8]; // las que ni abres (fila 3: la de la izquierda y la de la derecha)

const cam = camino2D([[F.inicio, [1.12, 540, 1010]], [Tcancela - 0.4, [1.12, 540, 1010]], [Tdiez - 0.1, [1.5, 540, 1000]], [Ty + 0.6, [1.5, 540, 1000]], [Tveinte + 0.9, [1.14, 540, 1010]]]);

// las doce apps: color de fondo y un dibujo propio cada una (sin marcas)
const APPS = [
  ["#35e08a", "#0f9d58", (g) => { g.fillStyle = "#fff"; g.beginPath(); g.arc(-12, 20, 15, 0, 6.2832); g.fill(); g.fillRect(1, -30, 9, 52); g.beginPath(); g.moveTo(10, -30); g.quadraticCurveTo(34, -22, 30, 4); g.lineTo(22, 0); g.quadraticCurveTo(24, -16, 10, -18); g.fill(); }],           // música
  ["#6fe3ff", "#1b9fd1", (g) => { g.fillStyle = "#fff"; g.beginPath(); g.arc(-18, 6, 20, 0, 6.2832); g.arc(8, -8, 26, 0, 6.2832); g.arc(30, 8, 18, 0, 6.2832); g.fill(); g.fillRect(-18, 8, 48, 18); }], // nube
  ["#f2f5fa", "#b7c0cf", (g) => { g.fillStyle = "#222b3a"; g.fillRect(-30, -28, 60, 8); g.fillStyle = "#6b7587"; for (let i = 0; i < 4; i++) g.fillRect(-30, -8 + i * 14, i % 2 ? 44 : 60, 7); }],              // noticias
  ["#8b7bff", "#4a34d6", (g) => { g.fillStyle = "#fff"; redondo(g, -34, -18, 68, 40, 18); g.fill(); g.fillStyle = "#4a34d6"; g.fillRect(-24, -4, 16, 6); g.fillRect(-19, -9, 6, 16); g.beginPath(); g.arc(14, -4, 5, 0, 6.2832); g.arc(24, 6, 5, 0, 6.2832); g.fill(); }], // juego
  ["#4aa8ff", "#1c63d6", (g) => { g.fillStyle = "#fff"; redondo(g, -32, -26, 64, 46, 16); g.fill(); g.beginPath(); g.moveTo(-14, 18); g.lineTo(-18, 34); g.lineTo(2, 18); g.fill(); }],  // mensajes
  ["#3fe0c4", "#0b9f8a", (g) => { g.fillStyle = "#fff"; g.beginPath(); g.arc(0, -8, 24, Math.PI, 0); g.lineTo(0, 34); g.closePath(); g.fill(); g.fillStyle = "#0b9f8a"; g.beginPath(); g.arc(0, -8, 9, 0, 6.2832); g.fill(); }], // mapa
  ["#ffa94d", "#e0661a", (g) => { g.fillStyle = "#fff"; g.fillRect(-26, -6, 52, 12); redondo(g, -36, -22, 14, 44, 5); g.fill(); redondo(g, 22, -22, 14, 44, 5); g.fill(); redondo(g, -26, -14, 10, 28, 4); g.fill(); redondo(g, 16, -14, 10, 28, 4); g.fill(); }], // gimnasio
  ["#9aa6b8", "#4c586b", (g) => { g.fillStyle = "#fff"; redondo(g, -34, -20, 68, 46, 12); g.fill(); g.fillStyle = "#4c586b"; g.beginPath(); g.arc(0, 3, 14, 0, 6.2832); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 3, 7, 0, 6.2832); g.fill(); }], // cámara
  ["#ff5d5d", "#c4161c", (g) => { g.fillStyle = "#fff"; g.beginPath(); g.moveTo(-16, -26); g.lineTo(-16, 26); g.lineTo(30, 0); g.closePath(); g.fill(); }],                     // vídeo (play)
  ["#ffd166", "#e3a008", (g) => { g.fillStyle = "#fff"; g.beginPath(); g.moveTo(0, -20); g.lineTo(-34, -28); g.lineTo(-34, 22); g.lineTo(0, 30); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0, -20); g.lineTo(34, -28); g.lineTo(34, 22); g.lineTo(0, 30); g.closePath(); g.fill(); }], // libro
  ["#ff7aa8", "#d12f6c", (g) => { g.fillStyle = "#fff"; g.beginPath(); g.moveTo(0, 28); g.bezierCurveTo(-48, -2, -26, -34, 0, -12); g.bezierCurveTo(26, -34, 48, -2, 0, 28); g.fill(); }], // corazón
  ["#ffe066", "#e0a800", (g) => { g.fillStyle = "#fff"; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 14 : 32; g.lineTo(r * Math.cos(a), r * Math.sin(a)); } g.closePath(); g.fill(); }], // estrella
];

function app(g, x, y, i, esc, gris) {
  if (esc < 0.01) return;
  const [c0, c1, glifo] = APPS[i];
  g.save(); g.translate(x, y); g.scale(esc, esc);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.shadowOffsetY = 8;
  redondo(g, -TAM / 2, -TAM / 2, TAM, TAM, 28);
  const gr = g.createLinearGradient(0, -TAM / 2, 0, TAM / 2); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.save(); redondo(g, -TAM / 2, -TAM / 2, TAM, TAM, 28); g.clip();
  glifo(g);
  const hg = g.createLinearGradient(0, -TAM / 2, 0, 0); hg.addColorStop(0, "rgba(255,255,255,0.34)"); hg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = hg; g.fillRect(-TAM / 2, -TAM / 2, TAM, TAM / 2);
  if (gris > 0.01) { g.fillStyle = `rgba(52,56,70,${0.68 * gris})`; g.fillRect(-TAM / 2, -TAM / 2, TAM, TAM); }
  g.restore();
  g.restore();
}

function movil(g, t) {
  // el cuerpo: marco oscuro con canto plateado
  g.save();
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60; g.shadowOffsetY = 24;
  redondo(g, PX - PW / 2 - 14, PY - PH / 2 - 14, PW + 28, PH + 28, 84);
  const mg = g.createLinearGradient(PX - PW / 2, 0, PX + PW / 2, 0); mg.addColorStop(0, "#5a6577"); mg.addColorStop(0.3, "#d6dde8"); mg.addColorStop(0.7, "#8a95a6"); mg.addColorStop(1, "#47505f");
  g.fillStyle = mg; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  redondo(g, PX - PW / 2 - 4, PY - PH / 2 - 4, PW + 8, PH + 8, 76); g.fillStyle = "#06080d"; g.fill();
  // la pantalla: fondo violeta con luces
  redondo(g, PX - PW / 2 + 10, PY - PH / 2 + 10, PW - 20, PH - 20, 66); g.save(); g.clip();
  const wg = g.createLinearGradient(0, PY - PH / 2, 0, PY + PH / 2); wg.addColorStop(0, "#2a1d5c"); wg.addColorStop(0.55, "#4b2b86"); wg.addColorStop(1, "#1a1240");
  g.fillStyle = wg; g.fillRect(PX - PW / 2, PY - PH / 2, PW, PH);
  for (const [bx, by, br, bc] of [[420, 760, 260, "190,140,255"], [690, 1180, 300, "255,110,200"], [540, 560, 220, "120,200,255"]]) { const rg = g.createRadialGradient(bx, by, 0, bx, by, br); rg.addColorStop(0, `rgba(${bc},0.30)`); rg.addColorStop(1, `rgba(${bc},0)`); g.fillStyle = rg; g.fillRect(bx - br, by - br, br * 2, br * 2); }
  // la hora
  g.fillStyle = "rgba(255,255,255,0.9)"; g.font = "700 30px Figtree"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText("9:41", PX - PW / 2 + 52, PY - PH / 2 + 66);
  g.restore();
  // la isla de la cámara
  redondo(g, PX - 56, PY - PH / 2 + 26, 112, 34, 17); g.fillStyle = "#020306"; g.fill();
  g.restore();
}

export function dibuja(g, t) {
  fondo(g, AC, 1.7, 1000);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  movil(g, t);
  // las apps: entran una a una con un rebote al principio; las dos que ni abres, en gris; se van en «y»
  for (let i = 0; i < 12; i++) {
    // tras irse las dos, las demás ocupan sus huecos (como en un móvil de verdad)
    const hueco = su(tr(t, Ty + 0.3, Ty + 0.85));
    const slotA = i, slotB = i - NO_USADAS.filter((n) => n < i).length;
    const sl = slotA + (slotB - slotA) * hueco;
    const col = ((sl % 3) + 3) % 3, fila = Math.floor(sl / 3 + 1e-6);
    const x = k.mez(COLS[i % 3], COLS[slotB % 3], hueco) , y = k.mez(FILAS[Math.floor(i / 3)], FILAS[Math.floor(slotB / 3)], hueco);
    const u = tr(t, F.inicio + 0.04 + i * 0.045, F.inicio + 0.04 + i * 0.045 + 0.35);
    let esc = u < 1 ? entra(u) * (1 + 0.14 * Math.sin(u * Math.PI)) : 1;
    const nu = NO_USADAS.includes(i);
    let gris = 0;
    if (nu) {
      gris = 1;
      // marcadas en «cancela»: laten un poco
      esc *= 1 + 0.07 * k.pulso(t, Tcancela + 0.1, 0.18) + 0.05 * k.pulso(t, Tcancela + 0.55, 0.15);
      // se van en «y»
      const sale = su(tr(t, Ty - 0.04, Ty + 0.32));
      esc *= 1 - sale;
    }
    app(g, x, y, i, esc, gris);
    if (nu) {
      // el aro violeta de cada app marcada, y lo que cuesta
      const aro = su(tr(t, Tcancela - 0.05, Tcancela + 0.2)) * (1 - su(tr(t, Ty - 0.04, Ty + 0.2)));
      if (aro > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${AC},${0.95 * aro})`; g.lineWidth = 9; redondo(g, x - TAM / 2 - 14, y - TAM / 2 - 14, TAM + 28, TAM + 28, 38); g.stroke(); g.restore(); k.brillo(g, x, y, 300, AC, 0.45 * aro); }
      const bt = su(tr(t, Tdiez - 0.08, Tdiez + 0.14)) * (1 - su(tr(t, Ty - 0.04, Ty + 0.2)));
      if (bt > 0.01) {
        g.save(); g.globalAlpha = bt; g.translate(x + 48, y - 56); g.scale(0.7 + 0.3 * entra(bt), 0.7 + 0.3 * entra(bt));
        redondo(g, -54, -26, 108, 52, 26); g.fillStyle = "#ff3b4e"; g.fill(); g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 4; g.stroke();
        g.fillStyle = "#fff"; g.font = "800 36px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("10 €", 0, 2);
        g.restore();
      }
    }
  }
  // las monedas que se escapan de las dos apps que ni abres
  const env = (tn) => 1 - su(tr(tn, Ty - 0.12, Ty + 0.1));
  NO_USADAS.forEach((i, j) => chorro(g, t, { x: COLS[i % 3], y: FILAS[Math.floor(i / 3)] }, { semilla: 61 + j, rate: 12, r0: 34, env, centroX: 540, fuerza: 1.0, color: AC, crece: 0.8 }));
  // el estallido al irse
  const u = t - Ty;
  if (u > -0.02 && u < 0.7) for (const i of NO_USADAS) { const x = COLS[i % 3], y = FILAS[Math.floor(i / 3)]; const o = 1 - Math.exp(-(u + 0.02) * 6); g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${AC},${0.8 * Math.exp(-u * 4.5)})`; g.lineWidth = 8 * Math.exp(-u * 3) + 2; g.beginPath(); g.arc(x, y, 50 + 150 * o, 0, 6.2832); g.stroke(); g.restore(); }
  sinVista(g);
  velo(g, 0.62);
  const a = su(tr(t, Tveinte - 0.08, Tveinte + 0.2));
  k.pastilla(g, 540, 640, "−20", "€ al mes", "215,180,255", a, 100);
}
