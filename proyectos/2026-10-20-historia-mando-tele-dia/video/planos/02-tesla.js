// «Pero la idea es mucho más vieja: en 1898, Nikola Tesla manejó un barquito sin tocarlo. Con ondas de radio, y
// algunos pensaban que lo movía con la mente.»
// Otro sitio: el pabellón de la exposición eléctrica de Nueva York, 1898. Al fondo, el público bajo bombillas; delante
// un estanque con un barquito de hierro; abajo a la izquierda, Tesla detrás de una mesa con su cajita de palancas y
// su antena. Una sola cámara. Se entra con un corte en «Pero».
// - «Pero la idea es mucho más vieja»: la cámara va por las caras del público, enormes, que siguen algo con la mirada.
// - «en 1898»: la cámara se abre y se ve todo; sale «1898».
// - «Nikola Tesla»: la cámara va a él, que sonríe y pone las manos en las palancas.
// - «manejó un barquito sin tocarlo»: la cámara va al barquito, que arranca, hace estela y da vueltas; al acabar la
//   frase se ve a Tesla lejos de él, con las manos en la caja.
// - «Con ondas de radio»: salen aros violeta de la antena y cruzan el estanque.
// - «algunos pensaban que lo movía con la mente»: la cámara sube al público; sobre una señora sale una nube de
//   pensamiento con la cabeza de Tesla mandando ondas al barquito.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, madera, tejido } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez, azar, redondo } = k;
const f3 = v.frase(3), f4 = v.frase(4);
const T0 = f3.inicio, Tan = f3.t("1898"), Tnik = f3.t("nikola"), Tman = f3.t("manejo"), Tbar = f3.t("barquito"), Tsin = f3.t("sin"), Ttoc = f3.t("tocarlo");
const Tond = f4.t("ondas"), Tpen = f4.t("pensaban"), Tmen = f4.t("mente");
const FIN = v.frase(5).inicio;
const VIOLETA = "190,140,255";

const cam = camino2D([
  [T0, [1.4, 560, 790]], [Tan - 0.3, [1.4, 600, 800]], [Tan + 0.5, [0.85, 540, 1030]],
  [Tnik - 0.5, [0.85, 540, 1030]], [Tnik + 0.25, [1.5, 270, 1330]], [Tman + 0.3, [1.5, 270, 1330]],
  [Tbar + 0.15, [1.25, 640, 1250]], [Tsin + 0.25, [1.25, 640, 1250]], [Ttoc + 0.5, [0.85, 450, 1340]],
  [Tond + 0.6, [0.85, 450, 1340]], [Tpen - 0.1, [0.85, 450, 1340]], [Tpen + 0.7, [1.1, 700, 860]], [FIN, [1.1, 700, 860]],
]);

// ------------------------------------------------------------ el barquito: por dónde va
const THETA0 = 0.4;
function theta(t) {
  let th = THETA0, a = Tman; const dt = 0.04;
  while (a < t) { const h = Math.min(dt, t - a), m = a + h / 2; th += 1.25 * su(tr(m, Tman, Tman + 0.6)) * (1 - su(tr(m, FIN - 1.3, FIN - 0.2))) * h; a += h; }
  return th;
}
function barcoEn(t) {
  const th = theta(t);
  return { x: 740 + 210 * Math.cos(th), y: 1260 + 140 * Math.sin(th), dx: -210 * Math.sin(th), th };
}

// ------------------------------------------------------------ el público
const AZ = azar(1898);
const COLS = [["#4a3a5a", "#1c1426"], ["#5a2e2e", "#240e12"], ["#2e4a44", "#0e2420"], ["#4a4a2e", "#222210"], ["#2e3a5a", "#10162a"], ["#5a3a24", "#26160a"]];
const PIELES = [["#e6b890", "#a8704a"], ["#f0c8a0", "#b07a56"], ["#d49a74", "#8a5238"]];
const GENTE = [];
for (let x = 10; x < 1090; x += 76) GENTE.push({ x: x + AZ() * 20, y: 842 + AZ() * 10, s: 0.8, tipo: Math.floor(AZ() * 3), col: COLS[Math.floor(AZ() * 6)], piel: PIELES[Math.floor(AZ() * 3)], fase: AZ() * 6.28, atras: true });
for (let x = 50; x < 1090; x += 98) GENTE.push({ x: x + AZ() * 22, y: 918, s: 1.08, tipo: Math.floor(AZ() * 3), col: COLS[Math.floor(AZ() * 6)], piel: PIELES[Math.floor(AZ() * 3)], fase: AZ() * 6.28 });
// la señora del pensamiento: la que está más a la derecha de en medio, la grande
const SENORA = { x: 800, y: 925, s: 1.3, tipo: 1, col: ["#7a2e5a", "#341028"], piel: PIELES[1], fase: 1.3 };
GENTE.push(SENORA);

function persona(g, p, t, bx) {
  const mira = Math.max(-1, Math.min(1, (bx - p.x) / 500)), bob = 3 * Math.sin(t * 1.7 + p.fase);
  g.save(); g.translate(p.x, p.y + bob); g.scale(p.s, p.s);
  // el cuerpo
  redondo(g, -62, -170, 124, 200, 52); const bg = g.createLinearGradient(0, -170, 0, 30); bg.addColorStop(0, p.col[0]); bg.addColorStop(1, p.col[1]); g.fillStyle = bg; g.fill();
  g.fillStyle = "#f2eee0"; g.beginPath(); g.moveTo(-18, -170); g.lineTo(0, -120); g.lineTo(18, -170); g.closePath(); g.fill();
  // el cuello y la cabeza
  g.fillStyle = p.piel[1]; g.fillRect(-14, -196, 28, 36);
  const hg = g.createRadialGradient(-10, -240, 4, 0, -220, 48); hg.addColorStop(0, p.piel[0]); hg.addColorStop(1, p.piel[1]);
  g.beginPath(); g.ellipse(0, -222, 36, 42, 0, 0, 6.2832); g.fillStyle = hg; g.fill();
  // la luz del estanque en un lado y el aire de arriba
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,200,130,0.12)"; g.beginPath(); g.ellipse(-10, -232, 30, 34, 0, 0, 6.2832); g.fill(); g.restore();
  // los ojos, que miran al barquito
  for (const sx of [-1, 1]) { g.fillStyle = "#fff"; g.beginPath(); g.ellipse(sx * 14, -226, 8, 9, 0, 0, 6.2832); g.fill(); g.fillStyle = "#1a1210"; g.beginPath(); g.arc(sx * 14 + mira * 4, -225, 4.2, 0, 6.2832); g.fill(); }
  g.strokeStyle = "#5a2a1a"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(-9, -203); g.quadraticCurveTo(0, -198, 9, -203); g.stroke();
  // el sombrero
  if (p.tipo === 0) { g.fillStyle = "#14101a"; redondo(g, -30, -300, 60, 66, 6); g.fill(); g.beginPath(); g.ellipse(0, -240, 46, 10, 0, 0, 6.2832); g.fill(); g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(-24, -296, 8, 56); }
  else if (p.tipo === 1) { g.fillStyle = p.col[0]; g.beginPath(); g.ellipse(0, -248, 74, 18, -0.08, 0, 6.2832); g.fill(); g.beginPath(); g.ellipse(0, -262, 38, 26, 0, 0, 6.2832); g.fill(); g.strokeStyle = "#f2d27a"; g.lineWidth = 6; g.beginPath(); g.moveTo(20, -270); g.quadraticCurveTo(70, -330, 96, -290); g.stroke(); }
  else { g.fillStyle = "#2a1a12"; g.beginPath(); g.ellipse(0, -246, 38, 28, 0, Math.PI, 0); g.fill(); }
  g.restore();
}
function publico(g, t, bx) {
  for (const p of GENTE.filter((q) => q.atras)) persona(g, p, t, bx);
  g.fillStyle = "rgba(6,4,10,0.28)"; g.fillRect(-100, 600, 1400, 340);   // las de atrás, más oscuras
  for (const p of GENTE.filter((q) => !q.atras)) persona(g, p, t, bx);
}

// ------------------------------------------------------------ el pabellón
function pabellon(g, t) {
  const wg = g.createLinearGradient(0, -300, 0, 940); wg.addColorStop(0, "#d8704c"); wg.addColorStop(0.55, "#ec9468"); wg.addColorStop(1, "#f4b484");
  g.fillStyle = wg; g.fillRect(-300, -300, 1700, 1250);
  // las ventanas en arco
  for (const x of [190, 540, 890]) {
    g.save(); g.beginPath(); g.moveTo(x - 92, 640); g.lineTo(x - 92, 280); g.arc(x, 280, 92, Math.PI, 0); g.lineTo(x + 92, 640); g.closePath();
    const sg = g.createLinearGradient(0, 190, 0, 640); sg.addColorStop(0, "#4aa8f0"); sg.addColorStop(1, "#d6f0ff"); g.fillStyle = sg; g.fill();
    g.clip(); g.strokeStyle = "rgba(255,230,170,0.5)"; g.lineWidth = 7; g.beginPath(); g.moveTo(x, 190); g.lineTo(x, 640); g.moveTo(x - 92, 420); g.lineTo(x + 92, 420); g.stroke(); g.restore();
    g.strokeStyle = "#e0b05a"; g.lineWidth = 12; g.beginPath(); g.moveTo(x - 92, 640); g.lineTo(x - 92, 280); g.arc(x, 280, 92, Math.PI, 0); g.lineTo(x + 92, 640); g.stroke();
  }
  // las banderitas y las bombillas de la exposición eléctrica
  for (const [y0, sag, col] of [[150, 60, 0], [330, 80, 1], [520, 70, 0]]) {
    const pt = (u) => [-60 + u * 1200, y0 + sag * Math.sin(u * Math.PI)];
    if (col === 0) { for (let i = 0; i < 22; i++) { const [x, y] = pt((i + 0.5) / 22); g.fillStyle = ["#d63a3a", "#f4efe0", "#3a5ad6"][i % 3]; g.beginPath(); g.moveTo(x - 20, y); g.lineTo(x + 20, y); g.lineTo(x, y + 52); g.closePath(); g.fill(); } }
    else {
      g.strokeStyle = "rgba(20,10,10,0.8)"; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = pt(i / 30); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
      for (let i = 0; i < 20; i++) { const [x, y] = pt((i + 0.5) / 20); k.brillo(g, x, y + 14, 70, "255,214,140", 0.55); g.fillStyle = "#fff4cc"; g.beginPath(); g.arc(x, y + 14, 11, 0, 6.2832); g.fill(); }
    }
  }
  k.brillo(g, 540, 560, 1400, "255,190,120", 0.22);
}

// ------------------------------------------------------------ el suelo, el estanque y el agua
const POND = { x: 360, y: 960, w: 760, h: 620 };
function estanque(g, t, bx, by) {
  // el suelo de madera
  g.fillStyle = "#2a160a"; g.fillRect(-300, 900, 1700, 2300);
  madera(g, -300, 900, 1700, 2300, 0, ["#d89a58", "#b27a40", "#7a4c26"]);
  for (let y = 940; y < 3100; y += 74) { g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(-300, y, 1700, 3); }
  // la barandilla de latón, delante del público
  const rg = g.createLinearGradient(0, 925, 0, 960); rg.addColorStop(0, "#fff0b0"); rg.addColorStop(0.5, "#c9962a"); rg.addColorStop(1, "#6a4810");
  g.fillStyle = rg; g.fillRect(-300, 930, 1700, 24);
  for (let x = 0; x < 1100; x += 120) { g.fillStyle = "#a87a20"; g.fillRect(x, 954, 12, 28); }
  // el borde de piedra y el agua
  redondo(g, POND.x - 26, POND.y - 22, POND.w + 52, POND.h + 44, 90); const pg = g.createLinearGradient(0, POND.y, 0, POND.y + POND.h); pg.addColorStop(0, "#e8dcc0"); pg.addColorStop(1, "#8a7a5a"); g.fillStyle = pg; g.fill();
  g.save(); redondo(g, POND.x, POND.y, POND.w, POND.h, 70); g.clip();
  const wg = g.createLinearGradient(0, POND.y, 0, POND.y + POND.h); wg.addColorStop(0, "#1ab0c8"); wg.addColorStop(0.5, "#0a6e96"); wg.addColorStop(1, "#06324e"); g.fillStyle = wg; g.fillRect(POND.x, POND.y, POND.w, POND.h);
  // el reflejo de las bombillas
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 12; i++) { const x = POND.x + 40 + i * 64 + 10 * Math.sin(t * 1.3 + i), lg = g.createLinearGradient(0, POND.y, 0, POND.y + 300); lg.addColorStop(0, "rgba(255,214,140,0.22)"); lg.addColorStop(1, "rgba(255,214,140,0)"); g.fillStyle = lg; g.fillRect(x, POND.y, 22 + 8 * Math.sin(t * 2 + i * 2), 300); }
  g.globalCompositeOperation = "source-over";
  g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 3;
  for (let j = 0; j < 12; j++) { const y = POND.y + 40 + j * 50; g.beginPath(); for (let x = POND.x; x < POND.x + POND.w + 60; x += 60) { const o = Math.sin(t * 1.4 + j * 1.7 + x * 0.02) * 6; g.moveTo(x, y + o); g.quadraticCurveTo(x + 15, y + o - 8, x + 30, y + o); } g.stroke(); }
  // la estela: anillos que nacen donde estuvo el barquito
  for (let i = 1; i < 16; i++) {
    const tt = t - i * 0.09, b = barcoEn(tt), a = (1 - i / 16) * su(tr(t, Tman, Tman + 0.5)) * (1 - su(tr(t, FIN - 1.0, FIN - 0.3)));
    if (a < 0.02) continue;
    g.strokeStyle = `rgba(235,250,255,${0.5 * a})`; g.lineWidth = 4; g.beginPath(); g.ellipse(b.x, b.y + 38, 30 + i * 9, 8 + i * 2.4, 0, 0, 6.2832); g.stroke();
  }
  g.restore();
}

// ------------------------------------------------------------ el barquito
function barquito(g, t, b) {
  const dir = Math.max(-1, Math.min(1, b.dx / 70)) || 1, bob = 5 * Math.sin(t * 3.1), tilt = 0.04 * Math.sin(t * 2.3);
  g.save(); g.translate(b.x, b.y + bob); g.rotate(tilt); g.scale(dir * 1, 1);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 24; g.shadowOffsetY = 14;
  // el casco de hierro
  g.beginPath(); g.moveTo(-136, -22); g.lineTo(150, -30); g.quadraticCurveTo(168, 4, 112, 38); g.lineTo(-96, 38); g.quadraticCurveTo(-142, 14, -136, -22); g.closePath();
  const hg = g.createLinearGradient(0, -30, 0, 38); hg.addColorStop(0, "#b8c6d6"); hg.addColorStop(0.4, "#6a7d94"); hg.addColorStop(1, "#26303e"); g.fillStyle = hg; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  g.fillStyle = "#c8321e"; g.beginPath(); g.moveTo(-124, 14); g.lineTo(138, 8); g.lineTo(118, 26); g.lineTo(-100, 28); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(-120 + i * 19, -6 + (i % 2) * 1.5, 3, 0, 6.2832); g.fill(); }
  // la cabina y las ventanitas encendidas
  redondo(g, -60, -92, 120, 66, 14); const cg = g.createLinearGradient(0, -92, 0, -26); cg.addColorStop(0, "#f4f1e6"); cg.addColorStop(1, "#9a9a92"); g.fillStyle = cg; g.fill();
  for (const x of [-30, 14]) { g.fillStyle = "#ffe69a"; g.beginPath(); g.arc(x + 8, -58, 13, 0, 6.2832); g.fill(); k.brillo(g, x + 8, -58, 60, "255,214,120", 0.7); g.strokeStyle = "#c9962a"; g.lineWidth = 4; g.stroke(); }
  // el mástil con su antenita y su banderín
  g.strokeStyle = "#2a2a30"; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(0, -92); g.lineTo(0, -196); g.stroke();
  g.fillStyle = "#d63a3a"; g.beginPath(); g.moveTo(2, -196); g.lineTo(52 + 4 * Math.sin(t * 5), -182); g.lineTo(2, -166); g.closePath(); g.fill();
  g.fillStyle = "#8ff"; g.beginPath(); g.arc(0, -198, 7, 0, 6.2832); g.fill();
  // los faroles de proa y de popa (rojo y verde)
  for (const [x, c] of [[148, "255,60,60"], [-130, "70,255,120"]]) { g.fillStyle = `rgb(${c})`; g.beginPath(); g.arc(x, -34, 9, 0, 6.2832); g.fill(); k.brillo(g, x, -34, 70, c, 0.8); }
  g.restore();
}

// ------------------------------------------------------------ Tesla, su mesa y su caja de palancas
const TES = [210, 1630];     // el centro de Tesla en la mesa (su sitio en el mundo)
const PALANCAS = [[110, -96], [210, -96]];
const ANTENA = [280, -330];
function tesla(g, t, levAl, mira) {
  g.save(); g.translate(TES[0], TES[1]);
  // la sombra detrás
  g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(0, 6, 190, 30, 0, 0, 6.2832); g.fill();
  // el torso: levita negra con camisa blanca y pajarita
  g.beginPath(); g.moveTo(-122, -270); g.quadraticCurveTo(-130, -330, -60, -318); g.lineTo(60, -318); g.quadraticCurveTo(130, -330, 122, -270); g.lineTo(104, 0); g.lineTo(-104, 0); g.closePath();
  const cg = g.createLinearGradient(-122, 0, 122, 0); cg.addColorStop(0, "#32323e"); cg.addColorStop(0.5, "#14141c"); cg.addColorStop(1, "#08080c"); g.fillStyle = cg; g.fill();
  g.fillStyle = "#f4f0e4"; g.beginPath(); g.moveTo(-40, -318); g.lineTo(0, -150); g.lineTo(40, -318); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 4; g.beginPath(); g.moveTo(-60, -318); g.lineTo(-10, -140); g.moveTo(60, -318); g.lineTo(10, -140); g.stroke();
  g.fillStyle = "#14141a"; g.beginPath(); g.moveTo(0, -300); g.lineTo(-32, -318); g.lineTo(-32, -284); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0, -300); g.lineTo(32, -318); g.lineTo(32, -284); g.closePath(); g.fill();
  // el cuello alto y la cabeza (cara larga y delgada)
  g.fillStyle = "#c98a68"; g.fillRect(-24, -352, 48, 44);
  g.fillStyle = "#f4f0e4"; g.fillRect(-34, -334, 68, 22);
  const hg = g.createRadialGradient(-16, -440, 6, 0, -410, 84); hg.addColorStop(0, "#f2c9a4"); hg.addColorStop(0.7, "#d99c76"); hg.addColorStop(1, "#a8684a");
  g.beginPath(); g.ellipse(0, -412, 50, 66, 0, 0, 6.2832); g.fillStyle = hg; g.fill();
  g.beginPath(); g.ellipse(-50, -410, 9, 16, 0, 0, 6.2832); g.ellipse(50, -410, 9, 16, 0, 0, 6.2832); g.fillStyle = "#d99c76"; g.fill();
  // el pelo negro, peinado hacia atrás con raya
  g.fillStyle = "#0c0a0c"; g.beginPath(); g.moveTo(-54, -420); g.quadraticCurveTo(-60, -490, -4, -486); g.quadraticCurveTo(56, -490, 54, -420); g.quadraticCurveTo(46, -452, 14, -456); g.quadraticCurveTo(-28, -446, -54, -420); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 4; g.beginPath(); g.moveTo(-30, -470); g.quadraticCurveTo(0, -482, 30, -472); g.stroke();
  // los ojos (miran hacia el barquito, a la derecha), las cejas y la nariz
  for (const sx of [-1, 1]) { g.fillStyle = "#fff"; g.beginPath(); g.ellipse(sx * 19, -420, 12, 9, 0, 0, 6.2832); g.fill(); g.fillStyle = "#2a1a10"; g.beginPath(); g.arc(sx * 19 + 4 * mira, -419, 5.2, 0, 6.2832); g.fill(); g.strokeStyle = "#0c0a0c"; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(sx * 19 - 14, -438 + (sx > 0 ? -3 * levAl : 0)); g.lineTo(sx * 19 + 14, -438 + (sx > 0 ? -5 * levAl : 0)); g.stroke(); }
  g.strokeStyle = "rgba(150,80,50,0.7)"; g.lineWidth = 4; g.beginPath(); g.moveTo(2, -418); g.quadraticCurveTo(-8, -388, 6, -384); g.stroke();
  // el bigote fino y la sonrisa
  g.fillStyle = "#0c0a0c"; g.beginPath(); g.moveTo(-32, -374); g.quadraticCurveTo(0, -392, 32, -374); g.quadraticCurveTo(0, -382, -32, -374); g.closePath(); g.fill();
  g.strokeStyle = "#7a3a2a"; g.lineWidth = 4; g.beginPath(); g.moveTo(-16, -364); g.quadraticCurveTo(0, -356, 16, -364); g.stroke();
  g.restore();
}
function mesaYCaja(g, t, lev) {
  g.save(); g.translate(TES[0], TES[1]);
  // la mesa
  madera(g, -210, 0, 700, 230, 10, ["#a8703a", "#6a3e1c", "#341a0a"]);
  g.fillStyle = "#1a5a3a"; g.fillRect(-210, -10, 700, 18);
  // la caja de las palancas: madera barnizada, latón y dos palancas
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 20; g.shadowOffsetY = 10;
  redondo(g, 30, -96, 270, 92, 12); const bg = g.createLinearGradient(0, -96, 0, -4); bg.addColorStop(0, "#5a3418"); bg.addColorStop(1, "#1e0e06"); g.fillStyle = bg; g.fill(); g.restore();
  g.strokeStyle = "#e0b05a"; g.lineWidth = 4; redondo(g, 34, -92, 262, 84, 10); g.stroke();
  g.fillStyle = "#e0b05a"; g.beginPath(); g.arc(250, -50, 24, 0, 6.2832); g.fill(); g.fillStyle = "#1a1210"; g.beginPath(); g.arc(250, -50, 19, 0, 6.2832); g.fill();
  g.strokeStyle = "#ff6a4a"; g.lineWidth = 4; g.beginPath(); g.moveTo(250, -50); g.lineTo(250 + 14 * Math.cos(-1.9 + lev[0]), -50 + 14 * Math.sin(-1.9 + lev[0])); g.stroke();
  // las palancas
  PALANCAS.forEach(([px, py], i) => {
    const a = lev[i], tx = px + 70 * Math.sin(a), ty = py - 70 * Math.cos(a);
    g.strokeStyle = "#cfd4dc"; g.lineWidth = 11; g.lineCap = "round"; g.beginPath(); g.moveTo(px, py); g.lineTo(tx, ty); g.stroke();
    g.fillStyle = "#d63a3a"; g.beginPath(); g.arc(tx, ty, 17, 0, 6.2832); g.fill(); g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(tx - 5, ty - 6, 5, 0, 6.2832); g.fill();
    g.fillStyle = "#e0b05a"; g.beginPath(); g.arc(px, py, 14, 0, 6.2832); g.fill();
  });
  // la antena: una varilla con su bola, que brilla al mandar ondas
  g.strokeStyle = "#e0b05a"; g.lineWidth = 8; g.beginPath(); g.moveTo(ANTENA[0], -96); g.lineTo(ANTENA[0], ANTENA[1]); g.stroke();
  g.restore();
}
// los brazos y las manos, delante de la mesa
function brazos(g, t, lev) {
  g.save(); g.translate(TES[0], TES[1]); g.lineCap = "round"; g.lineJoin = "round";
  [[-104, -286, 0], [104, -286, 1]].forEach(([sx, sy, i]) => {
    const a = lev[i], hx = PALANCAS[i][0] + 70 * Math.sin(a), hy = PALANCAS[i][1] - 70 * Math.cos(a) - 6;
    const ex = (sx + hx) / 2 + (i ? 34 : -34), ey = (sy + hy) / 2 + 50;
    g.strokeStyle = "rgba(0,0,0,0.4)"; g.lineWidth = 66; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.lineTo(hx - 10, hy + 30); g.stroke();
    g.strokeStyle = "#1a1a22"; g.lineWidth = 58; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.lineTo(hx - 10, hy + 30); g.stroke();
    g.fillStyle = "#f4f0e4"; g.beginPath(); g.ellipse(hx - 6, hy + 22, 32, 14, 0.5, 0, 6.2832); g.fill();
    g.fillStyle = "#e6b18c"; g.beginPath(); g.arc(hx, hy, 24, 0, 6.2832); g.fill();
  });
  g.restore();
}

// ------------------------------------------------------------ las ondas de radio
const EMITE = []; for (let te = Tman - 0.2; te < FIN - 0.4; te += 0.5) EMITE.push(te);
function ondas(g, t) {
  const ax = TES[0] + ANTENA[0], ay = TES[1] + ANTENA[1], fade = 1 - su(tr(t, FIN - 0.7, FIN - 0.15));
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const te of EMITE) {
    const d = t - te; if (d < 0 || d > 3.2) continue;
    const r = 16 + d * 560, al = Math.exp(-d * 0.8) * Math.min(1, d * 10) * fade * (d < 0.6 ? 0.8 : 1);
    g.strokeStyle = `rgba(${VIOLETA},${0.85 * al})`; g.lineWidth = 8; g.beginPath(); g.arc(ax, ay, r, 0, 6.2832); g.stroke();
    g.strokeStyle = `rgba(${VIOLETA},${0.22 * al})`; g.lineWidth = 28; g.beginPath(); g.arc(ax, ay, r, 0, 6.2832); g.stroke();
  }
  g.restore();
  const em = Math.max(0, ...EMITE.map((te) => Math.exp(-Math.abs(t - te - 0.05) * 7)));
  g.fillStyle = `rgb(${k.mezRgb("224,176,90", "230,200,255", em)})`; g.beginPath(); g.arc(ax, ay, 15, 0, 6.2832); g.fill();
  k.brillo(g, ax, ay, 120 + 90 * em, VIOLETA, 0.35 + 0.65 * em * fade);
}

// ------------------------------------------------------------ la nube del pensamiento
function nube(g, t) {
  const a = k.entra(tr(t, Tpen - 0.05, Tpen + 0.4)) * (1 - su(tr(t, FIN - 0.45, FIN - 0.1)));
  if (a < 0.01) return;
  const cx = 800, cy = 590, sc = mez(0.3, 1, a);
  g.save(); g.globalAlpha = Math.min(1, a * 1.5);
  // las bolitas que suben desde la cabeza de la señora
  for (const [x, y, r] of [[806, 705, 16], [800, 665, 24]]) { g.fillStyle = "#f4eefc"; g.beginPath(); g.arc(x, y, r * sc, 0, 6.2832); g.fill(); }
  g.translate(cx, cy); g.scale(sc, sc);
  g.shadowColor = "rgba(0,0,0,0.4)"; g.shadowBlur = 30; g.shadowOffsetY = 12;
  g.fillStyle = "#f4eefc"; g.beginPath();
  for (const [x, y, r] of [[-130, 0, 90], [-60, -70, 100], [50, -80, 104], [140, -20, 96], [110, 60, 84], [0, 78, 92], [-100, 64, 80]]) { g.moveTo(x + r, y); g.arc(x, y, r, 0, 6.2832); }
  g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  // dentro: la cabeza de Tesla mandando ondas al barquito
  const m = su(tr(t, Tmen - 0.3, Tmen + 0.2));
  k.brillo(g, -90, -6, 160, VIOLETA, 0.35 + 0.5 * m);
  g.fillStyle = "#e6b18c"; g.beginPath(); g.ellipse(-90, 0, 40, 52, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#0c0a0c"; g.beginPath(); g.ellipse(-90, -34, 44, 26, 0, Math.PI, 0); g.fill(); g.fillRect(-122, -36, 64, 8);
  g.fillStyle = "#fff"; for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(-90 + sx * 15, -8, 10, 8, 0, 0, 6.2832); g.fill(); }
  g.fillStyle = "#2a1a10"; for (const sx of [-1, 1]) { g.beginPath(); g.arc(-90 + sx * 15 + 3, -7, 4, 0, 6.2832); g.fill(); }
  g.fillStyle = "#0c0a0c"; g.beginPath(); g.moveTo(-114, 20); g.quadraticCurveTo(-90, 8, -66, 20); g.quadraticCurveTo(-90, 16, -114, 20); g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.lineCap = "round";
  g.strokeStyle = `rgba(${VIOLETA},${0.55 + 0.45 * m})`; g.lineWidth = 7;
  for (let i = 0; i < 3; i++) { g.beginPath(); for (let x = -40; x <= 100; x += 8) { const y = -8 + i * 10 - 12 + 10 * Math.sin((x + t * 160) * 0.09); x === -40 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  g.restore();
  // el barquito pequeño
  g.save(); g.translate(120, 24 + 3 * Math.sin(t * 3)); g.scale(0.34, 0.34);
  g.beginPath(); g.moveTo(-136, -22); g.lineTo(150, -30); g.quadraticCurveTo(168, 4, 112, 38); g.lineTo(-96, 38); g.quadraticCurveTo(-142, 14, -136, -22); g.closePath(); g.fillStyle = "#4a5a70"; g.fill();
  g.fillStyle = "#c8321e"; g.fillRect(-120, 8, 250, 14); g.fillStyle = "#f4f1e6"; redondo(g, -60, -92, 120, 66, 14); g.fill();
  g.restore();
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t), b = barcoEn(t);
  vista(g, Z, cx, cy);
  pabellon(g, t);
  publico(g, t, b.x);
  estanque(g, t, b.x, b.y);
  barquito(g, t, b);
  const lev = [0.55 * Math.sin(t * 2.6) * su(tr(t, Tman - 0.4, Tman)), 0.5 * Math.sin(t * 2.0 + 1) * su(tr(t, Tman - 0.4, Tman))];
  const levAl = su(tr(t, Tnik + 0.2, Tnik + 0.7));
  tesla(g, t, levAl, 1);
  mesaYCaja(g, t, lev);
  brazos(g, t, lev);
  ondas(g, t);
  nube(g, t);
  sinVista(g);
  // «1898», quieto, mientras se dice
  const an = su(tr(t, Tan - 0.05, Tan + 0.25)) * (1 - su(tr(t, Tnik - 0.45, Tnik - 0.15)));
  k.pastilla(g, 540, 1390, "1898", "", "255,226,160", an, 120);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { tesla: Tnik, barquito: Tbar, ondas: Tond, mente: Tmen };
