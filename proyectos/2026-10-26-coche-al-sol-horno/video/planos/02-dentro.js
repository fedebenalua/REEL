// Dentro del coche, visto desde el asiento de atrás. Se entra con un corte en «Todo».
// - «Todo empieza en el cristal: deja entrar la luz del sol.»: un brillo recorre el parabrisas; en «luz», los rayos de
//   sol entran por él y caen en diagonal.
// - «Esa luz cae sobre el salpicadero y los asientos, y los calienta muchísimo.»: el salpicadero se pone naranja y rojo
//   donde le da; en «asientos», los respaldos; en «muchísimo», el aire de encima reverbera.
// - «En Arizona midieron un salpicadero a 69 grados...»: la cámara se acerca al salpicadero; «69 °C» corre y se queda.
// - «A esa temperatura, la clara de un huevo ya empieza a cuajarse.»: cae un huevo y se abre; la clara se vuelve blanca.
// - «Y ese calor ya no sale igual...»: la cámara se aleja; suben ondas rojas, chocan con el parabrisas y rebotan; el
//   coche se llena de niebla naranja que gira sin salir.
// - «Por eso sube tan rápido...»: un reloj: los minutos corren de 0 a 30 (media vuelta) y la temperatura se dispara y
//   frena.
import * as k from "#kit";
import { v } from "#voz";
import { colorCalor, velo, vineta } from "../mundo.js";

const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez, azar, entra } = k;
const T0 = f3.inicio, Tcri = f3.t("cristal"), Tluz = f3.t("luz");
const Tsal = f4.t("salpicadero"), Tasi = f4.t("asientos"), Tmuy = f4.t("muchisimo");
const T5 = f5.inicio, T69 = f5.t("69"), Tgra = f5.t("grados");
const T6 = f6.inicio, Tcla = f6.t("clara"), Thue = f6.t("huevo"), Tcua = f6.t("cuajarse");
const T7 = f7.inicio, Tcal = f7.t("calor"), Tcri7 = f7.t("cristal"), Tfre = f7.t("frena"), Tair = f7.t("aire"), Tenc = f7.t("encerrado");
const T8 = f8.inicio, Tsub = f8.t("sube"), Tmed = f8.t("media"), Thor = f8.t("hora");
const Fin = v.frase(9).inicio;

// La cámara: [Z, cx, cy] en coordenadas del coche (1080 × 1920 a zoom 1).
const cam = (() => {
  const c = [
    [T0, [1.0, 540, 930]], [f3.fin, [1.05, 540, 920]],
    [Tsal, [1.08, 540, 980]], [f4.fin, [1.1, 540, 1000]],
    [T69 - 0.1, [1.85, 600, 1080]], [f6.fin, [1.95, 620, 1085]],
    [Tair, [1.0, 540, 940]], [Tsub, [1.0, 540, 940]], [Tmed + 0.3, [1.12, 540, 900]], [Fin, [1.12, 540, 900]],
  ];
  const Zs = k.claves(c.map(([t, q]) => [t, Math.log(q[0])])), X = k.claves(c.map(([t, q]) => [t, q[1]])), Y = k.claves(c.map(([t, q]) => [t, q[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
})();

// ---------------------------------------------------------------- texturas, una vez
const tela = (() => {
  const W = 256, l = k.lienzo(W, W), c = l.getContext("2d"), az = azar(61);
  c.fillStyle = "#808080"; c.fillRect(0, 0, W, W);
  for (let i = 0; i < 4000; i++) { const x = az() * W, y = az() * W; c.fillStyle = az() < 0.5 ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.18)"; c.fillRect(x, y, 2, 2); }
  for (let y = 0; y < W; y += 4) { c.fillStyle = "rgba(0,0,0,0.08)"; c.fillRect(0, y, W, 1); }
  return l;
})();
const naranja = k.tenir(k.manchas, "rgb(255,120,40)");
const patrones = new WeakMap();
const patronTela = (g) => { if (!patrones.has(g)) patrones.set(g, g.createPattern(tela, "repeat")); return patrones.get(g); };

// El parabrisas: un trapecio.
const PB = [[118, 560], [962, 560], [1150, 1045], [-70, 1045]];
const SOLD = [790, 700];
const poli = (g, P) => { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
// El borde de delante del salpicadero (la curva donde empieza la cara de las salidas de aire).
const bordeY = (x) => 1150 + 0.00008 * (x - 540) * (x - 540);

// Los rayos de sol que entran: de la zona del sol a sitios del salpicadero y de los asientos.
const RAYOS = [
  { a: [700, 600], b: [360, 1095], w0: 70, w1: 160 },
  { a: [760, 600], b: [600, 1110], w0: 60, w1: 150 },
  { a: [840, 610], b: [820, 1100], w0: 60, w1: 140 },
  { a: [690, 640], b: [270, 1330], w0: 60, w1: 220 },
  { a: [860, 640], b: [790, 1360], w0: 60, w1: 220 },
];

// Las ondas de calor: cada una sale del salpicadero en x0, sube hasta el cristal (yC) y rebota.
const ONDAS = (() => { const az = azar(83); return Array.from({ length: 14 }, (_, i) => ({ x0: 150 + (i / 13) * 780 + (az() - 0.5) * 40, d: az() * 0.9, v: 380 + az() * 160, yC: 640 + az() * 140, f: az() * 6, deriva: (az() - 0.5) * 220 })); })();

function cielo(g, t) {
  g.save(); poli(g, PB); g.clip();
  const sg = g.createLinearGradient(0, 560, 0, 990);
  sg.addColorStop(0, "#1e66cf"); sg.addColorStop(0.7, "#7fbdf0"); sg.addColorStop(1, "#f0dcb0");
  g.fillStyle = sg; g.fillRect(-80, 550, 1240, 500);
  // lo de lejos
  const az = azar(5);
  for (let x = -80; x < 1160;) { const w = 90 + az() * 160, h = 30 + az() * 80; g.fillStyle = az() < 0.5 ? "#9fb6c9" : "#7ea494"; g.fillRect(x, 975 - h, w, h + 10); x += w * (0.7 + az() * 0.4); }
  const ng = g.createLinearGradient(0, 900, 0, 985); ng.addColorStop(0, "rgba(240,220,176,0)"); ng.addColorStop(1, "rgba(240,220,176,0.8)");
  g.fillStyle = ng; g.fillRect(-80, 900, 1240, 90);
  // el sol
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, SOLD[0], SOLD[1], 900, "255,210,130", 0.55);
  k.brillo(g, SOLD[0], SOLD[1], 380, "255,236,190", 0.8);
  g.restore();
  g.fillStyle = "#fffbe6"; g.beginPath(); g.arc(SOLD[0], SOLD[1], 62, 0, 6.2832); g.fill();
  // el capó rojo
  const cg = g.createLinearGradient(0, 975, 0, 1045); cg.addColorStop(0, "#ff6a55"); cg.addColorStop(0.3, "#e0261f"); cg.addColorStop(1, "#7a0a0e");
  g.fillStyle = cg; g.beginPath(); g.moveTo(-80, 1050); g.lineTo(-80, 1010); g.quadraticCurveTo(540, 955, 1160, 1010); g.lineTo(1160, 1050); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,230,210,0.45)"; g.beginPath(); g.moveTo(200, 992); g.quadraticCurveTo(540, 962, 880, 992); g.quadraticCurveTo(540, 972, 200, 996); g.fill();
  g.restore();
}

function cristalBrillo(g, t, u) {
  // el reflejo del parabrisas y el brillo que lo recorre en «cristal»
  g.save(); poli(g, PB); g.clip();
  g.fillStyle = "rgba(255,255,255,0.05)"; g.fillRect(-80, 550, 1240, 500);
  if (u > 0 && u < 1) {
    const x = mez(-300, 1400, u);
    g.globalCompositeOperation = "lighter";
    const bg = g.createLinearGradient(x - 160, 0, x + 160, 0);
    bg.addColorStop(0, "rgba(255,255,255,0)"); bg.addColorStop(0.5, "rgba(255,255,255,0.55)"); bg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = bg; g.beginPath(); g.moveTo(x - 160, 1045); g.lineTo(x + 160, 1045); g.lineTo(x + 360, 560); g.lineTo(x + 40, 560); g.closePath(); g.fill();
  }
  g.restore();
}

function techo(g) {
  const tg = g.createLinearGradient(0, -200, 0, 570);
  tg.addColorStop(0, "#2a2723"); tg.addColorStop(1, "#57514a");
  g.fillStyle = tg; g.fillRect(-200, -400, 1480, 970);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.fillStyle = patronTela(g); g.fillRect(-200, -400, 1480, 970); g.restore();
  // los pilares, a los lados del parabrisas
  g.fillStyle = "#24211e";
  g.beginPath(); g.moveTo(-200, 480); g.lineTo(140, 540); g.lineTo(-40, 1060); g.lineTo(-200, 1060); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(1280, 480); g.lineTo(940, 540); g.lineTo(1120, 1060); g.lineTo(1280, 1060); g.closePath(); g.fill();
  // el marco negro del cristal
  poli(g, PB); g.strokeStyle = "#0b0b0c"; g.lineWidth = 22; g.stroke();
}

function retrovisor(g) {
  g.fillStyle = "#151517"; g.fillRect(528, 548, 24, 50);
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.shadowOffsetY = 8;
  k.redondo(g, 420, 592, 240, 78, 30); g.fillStyle = "#1b1b1e"; g.fill(); g.restore();
  k.redondo(g, 432, 602, 216, 58, 24);
  const mg = g.createLinearGradient(432, 602, 648, 660); mg.addColorStop(0, "#9ab4cf"); mg.addColorStop(0.5, "#cfe0f0"); mg.addColorStop(1, "#6f88a3");
  g.fillStyle = mg; g.fill();
}

function salpicadero(g, t, calS) {
  // la parte de arriba, en pendiente, del cristal al borde
  g.beginPath(); g.moveTo(-200, 1040); g.lineTo(1280, 1040); g.lineTo(1280, bordeY(1280)); for (let x = 1280; x >= -200; x -= 40) g.lineTo(x, bordeY(x)); g.closePath();
  const sg = g.createLinearGradient(0, 1040, 0, 1160);
  sg.addColorStop(0, "#3a3c44"); sg.addColorStop(0.6, "#25272d"); sg.addColorStop(1, "#16171b");
  g.fillStyle = sg; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.fillStyle = patronTela(g); g.fillRect(-200, 1030, 1480, 260);
  g.globalAlpha = 1; g.globalCompositeOperation = "lighter";
  // el calor del salpicadero: donde dan los rayos, naranja y rojo
  if (calS > 0.01) {
    for (const r of RAYOS.slice(0, 3)) {
      const hg = g.createRadialGradient(r.b[0], r.b[1] + 10, 0, r.b[0], r.b[1] + 10, 380);
      const c = colorCalor(calS);
      hg.addColorStop(0, `rgba(${c},${0.85 * calS})`); hg.addColorStop(0.5, `rgba(${c},${0.35 * calS})`); hg.addColorStop(1, `rgba(${c},0)`);
      g.fillStyle = hg; g.fillRect(-200, 1030, 1480, 260);
    }
    g.globalAlpha = 0.25 * calS; g.drawImage(k.manchas, -200 - ((t * 25) % 300), 1020, 1800, 300); g.globalAlpha = 1;
  }
  g.restore();
  // la cara de las salidas de aire
  g.beginPath(); for (let x = -200; x <= 1280; x += 40) g.lineTo(x, bordeY(x)); g.lineTo(1280, 1420); g.lineTo(-200, 1420); g.closePath();
  const fg = g.createLinearGradient(0, 1150, 0, 1400); fg.addColorStop(0, "#1c1d22"); fg.addColorStop(1, "#0d0d10");
  g.fillStyle = fg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 3; g.beginPath(); for (let x = -200; x <= 1280; x += 40) g.lineTo(x, bordeY(x) + 2); g.stroke();
  // las rejillas
  for (const x of [150, 420, 660, 930]) {
    k.redondo(g, x - 75, bordeY(x) + 30, 150, 52, 14); g.fillStyle = "#08080a"; g.fill();
    g.strokeStyle = "rgba(120,124,135,0.5)"; g.lineWidth = 3; g.stroke();
    g.strokeStyle = "rgba(90,94,104,0.6)"; g.lineWidth = 3;
    for (let q = 1; q < 5; q++) { g.beginPath(); g.moveTo(x - 66, bordeY(x) + 30 + q * 10.5); g.lineTo(x + 66, bordeY(x) + 30 + q * 10.5); g.stroke(); }
  }
  // la pantalla del centro
  k.redondo(g, 440, 1240, 200, 120, 16); g.fillStyle = "#050608"; g.fill();
  g.strokeStyle = "rgba(160,170,190,0.35)"; g.lineWidth = 3; g.stroke();
  g.fillStyle = "rgba(120,170,255,0.18)"; k.redondo(g, 452, 1252, 176, 96, 10); g.fill();
}

function volante(g, calA) {
  const x = 300, y = 1360;
  g.save();
  g.strokeStyle = "#0f1013"; g.lineWidth = 46;
  g.beginPath(); g.ellipse(x, y, 230, 200, 0, 0, 6.2832); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 6;
  g.beginPath(); g.ellipse(x, y - 8, 236, 206, 0, 3.6, 5.8); g.stroke();
  if (calA > 0.01) { g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${colorCalor(calA * 0.8)},${0.5 * calA})`; g.lineWidth = 30; g.beginPath(); g.ellipse(x, y, 230, 200, 0, 3.4, 6.0); g.stroke(); }
  g.restore();
  g.fillStyle = "#121317";
  g.beginPath(); g.moveTo(x - 220, y + 10); g.lineTo(x - 60, y - 20); g.lineTo(x + 60, y - 20); g.lineTo(x + 220, y + 10); g.lineTo(x + 60, y + 40); g.lineTo(x - 60, y + 40); g.closePath(); g.fill();
}

function asiento(g, cx, calA, t) {
  // el reposacabezas y sus dos barras
  g.fillStyle = "#9aa0aa"; g.fillRect(cx - 70, 1380, 12, 70); g.fillRect(cx + 58, 1380, 12, 70);
  k.redondo(g, cx - 150, 1240, 300, 170, 70);
  const rg = g.createLinearGradient(cx - 150, 1240, cx + 150, 1410); rg.addColorStop(0, "#4b4e57"); rg.addColorStop(0.5, "#2d3038"); rg.addColorStop(1, "#1a1c21");
  g.fillStyle = rg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.fillStyle = patronTela(g); g.fillRect(cx - 160, 1230, 320, 190); g.restore();
  // el respaldo
  g.beginPath(); g.moveTo(cx - 230, 1960); g.lineTo(cx - 250, 1560); g.quadraticCurveTo(cx - 250, 1440, cx - 120, 1430); g.lineTo(cx + 120, 1430); g.quadraticCurveTo(cx + 250, 1440, cx + 250, 1560); g.lineTo(cx + 230, 1960); g.closePath();
  const bg = g.createLinearGradient(cx - 250, 1430, cx + 250, 1900); bg.addColorStop(0, "#4a4d56"); bg.addColorStop(0.45, "#2b2e35"); bg.addColorStop(1, "#141519");
  g.fillStyle = bg; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.fillStyle = patronTela(g); g.fillRect(cx - 260, 1420, 520, 560);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  g.strokeStyle = "rgba(0,0,0,0.45)"; g.lineWidth = 6; g.beginPath(); g.moveTo(cx - 150, 1500); g.lineTo(cx - 140, 1960); g.moveTo(cx + 150, 1500); g.lineTo(cx + 140, 1960); g.stroke();
  if (calA > 0.01) {
    g.globalCompositeOperation = "lighter";
    const hg = g.createRadialGradient(cx, 1300, 0, cx, 1400, 420);
    const c = colorCalor(calA);
    hg.addColorStop(0, `rgba(${c},${0.5 * calA})`); hg.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = hg; g.fillRect(cx - 260, 1420, 520, 560);
  }
  g.restore();
  if (calA > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    k.redondo(g, cx - 150, 1240, 300, 170, 70); g.clip();
    const hc = g.createRadialGradient(cx + 20, 1290, 10, cx, 1320, 190); hc.addColorStop(0, `rgba(${colorCalor(calA)},${0.6 * calA})`); hc.addColorStop(1, `rgba(${colorCalor(calA)},${0.1 * calA})`);
    g.fillStyle = hc; g.fillRect(cx - 160, 1230, 320, 190);
    g.restore();
  }
}

function rayosDeSol(g, t, al) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  RAYOS.forEach((r, i) => {
    const dx = r.b[0] - r.a[0], dy = r.b[1] - r.a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    const lg = g.createLinearGradient(r.a[0], r.a[1], r.b[0], r.b[1]);
    const a = al * (0.22 + 0.04 * Math.sin(t * 1.5 + i));
    lg.addColorStop(0, `rgba(255,236,180,${a * 0.6})`); lg.addColorStop(0.8, `rgba(255,226,160,${a})`); lg.addColorStop(1, `rgba(255,226,160,0)`);
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(r.a[0] + nx * r.w0 / 2, r.a[1] + ny * r.w0 / 2); g.lineTo(r.b[0] + nx * r.w1 / 2, r.b[1] + ny * r.w1 / 2);
    g.lineTo(r.b[0] - nx * r.w1 / 2, r.b[1] - ny * r.w1 / 2); g.lineTo(r.a[0] - nx * r.w0 / 2, r.a[1] - ny * r.w0 / 2); g.closePath(); g.fill();
    // la mancha de luz donde cae
    k.brillo(g, r.b[0], r.b[1], r.w1 * 2.2, "255,230,170", al * 0.45);
  });
  g.restore();
}

// El huevo: cae y se abre en el salpicadero en H; la clara pasa de transparente a blanca con «cuaja» (0 a 1).
const H = [640, 1098];
const BORDE_CLARA = (() => { const az = azar(97); return Array.from({ length: 24 }, (_, i) => 1 + 0.16 * Math.sin(i * 1.7) + (az() - 0.5) * 0.14); })();
function huevo(g, t) {
  const Tcae = Tcla - 0.45, Tchoca = Tcla + 0.05;
  if (t < Tcae) return;
  if (t < Tchoca) {
    // cae entero
    const u = tr(t, Tcae, Tchoca), y = mez(H[1] - 520, H[1] - 30, u * u);
    const eg = g.createRadialGradient(H[0] - 14, y - 22, 4, H[0], y, 50);
    eg.addColorStop(0, "#fffaf0"); eg.addColorStop(0.6, "#f0dcc0"); eg.addColorStop(1, "#b89a78");
    g.fillStyle = eg; g.beginPath(); g.ellipse(H[0], y, 34, 44, 0.3, 0, 6.2832); g.fill();
    return;
  }
  const abre = entra(tr(t, Tchoca, Tchoca + 0.35));
  const cuaja = su(tr(t, Tcua - 0.35, Tcua + 0.7)), previo = 0.25 * su(tr(t, Thue, Tcua - 0.35));
  const c = previo + cuaja * 0.75;
  const R = 130 * abre, ry = 0.42;
  // la clara: una forma irregular, aplastada por la perspectiva del salpicadero
  const camino = () => {
    g.beginPath();
    BORDE_CLARA.forEach((m, i) => { const a = (i / BORDE_CLARA.length) * 6.2832, x = H[0] + Math.cos(a) * R * m, y = H[1] + Math.sin(a) * R * m * ry; i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.closePath();
  };
  camino();
  const cg = g.createRadialGradient(H[0], H[1], 0, H[0], H[1], R * 1.1);
  cg.addColorStop(0, `rgba(255,255,250,${0.12 + 0.6 * Math.max(0, c - 0.35)})`);
  cg.addColorStop(0.6, `rgba(255,255,250,${0.15 + 0.8 * c})`);
  cg.addColorStop(1, `rgba(255,255,250,${0.25 + 0.75 * Math.min(1, c * 1.4)})`);
  g.fillStyle = cg; g.fill();
  g.strokeStyle = `rgba(255,255,255,${0.35 + 0.4 * c})`; g.lineWidth = 3; g.stroke();
  // el brillo húmedo de la clara cruda
  g.fillStyle = `rgba(255,255,255,${0.45 * (1 - c)})`; g.beginPath(); g.ellipse(H[0] - R * 0.4, H[1] - R * 0.16, R * 0.25, R * 0.05, -0.1, 0, 6.2832); g.fill();
  // la yema
  const yr = 46 * Math.min(1, abre * 1.3), yx = H[0] + 14, yy = H[1] - 14;
  g.save(); g.shadowColor = "rgba(120,50,0,0.5)"; g.shadowBlur = 16; g.shadowOffsetY = 6;
  const yg = g.createRadialGradient(yx - yr * 0.35, yy - yr * 0.45, 2, yx, yy, yr);
  yg.addColorStop(0, "#fff3b0"); yg.addColorStop(0.35, "#ffbf2a"); yg.addColorStop(1, "#e07a00");
  g.fillStyle = yg; g.beginPath(); g.ellipse(yx, yy, yr, yr * 0.78, 0, 0, 6.2832); g.fill(); g.restore();
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(yx - yr * 0.35, yy - yr * 0.35, yr * 0.22, yr * 0.13, -0.4, 0, 6.2832); g.fill();
}

function ondas(g, t) {
  const t0 = Tcal - 0.2;
  if (t < t0) return;
  const fuerza = su(tr(t, t0, t0 + 0.5)) * (1 - 0.5 * su(tr(t, Tmed, Fin - 0.3)));
  const choque = su(tr(t, Tcri7 - 0.3, Tfre));
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const o of ONDAS) {
    const s = (t - t0 - o.d) * o.v;
    if (s <= 0) continue;
    const y0 = bordeY(o.x0) - 50, D = y0 - o.yC, L = 260;
    // antes del cristal, las ondas siguen hacia arriba; desde «cristal» rebotan en él
    const yDe = (q) => {
      if (choque < 0.5 || q < D) return y0 - q;
      return o.yC + ((q - D) % (D * 2) < D ? (q - D) % D : D - ((q - D) % D));
    };
    const pts = [];
    for (let j = 0; j <= 18; j++) {
      const q = s - (j / 18) * L;
      if (q < 0) break;
      const y = yDe(q), x = o.x0 + o.deriva * Math.min(1, q / 900) + 18 * Math.sin(q * 0.025 + o.f + t * 4);
      pts.push([x, y, 1 - j / 18]);
    }
    if (pts.length < 2) continue;
    // un trazo rojo continuo, con su halo, que se afina hacia la cola
    g.globalCompositeOperation = "source-over";
    for (const [w, a] of [[34, 0.18], [14, 0.85]]) {
      g.strokeStyle = `rgba(255,${w > 20 ? 110 : 70},40,${a * fuerza})`; g.lineWidth = w;
      g.beginPath(); pts.slice(0, 14).forEach(([x, y], j) => (j ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    }
    g.strokeStyle = `rgba(255,70,40,${0.4 * fuerza})`; g.lineWidth = 6;
    g.beginPath(); pts.slice(13).forEach(([x, y], j) => (j ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    g.globalCompositeOperation = "lighter";
    // donde choca con el cristal, un destello
    if (choque > 0.5 && s > D) k.brillo(g, o.x0 + o.deriva * Math.min(1, D / 900), o.yC, 160, "255,110,60", 0.35 * fuerza * k.pulso((s - D) % (2 * D), 0, 60));
  }
  g.restore();
}

// El reloj: los minutos corren de 0 a 30 (media vuelta) y dentro, la temperatura.
function reloj(g, t) {
  const al = su(tr(t, T8 - 0.1, T8 + 0.3));
  if (al <= 0.01) return;
  const x = 540, y = 820, R = 200 + 14 * su(tr(t, Tsub, Tmed + 0.3));
  const u = su(tr(t, Tsub, Tmed + 0.25)), min = Math.round(30 * u), temp = 22 + 20 * (1 - Math.pow(1 - u, 2.2));
  g.save(); g.globalAlpha = al;
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 18;
  g.fillStyle = "rgba(8,10,16,0.82)"; g.beginPath(); g.arc(x, y, R, 0, 6.2832); g.fill(); g.restore();
  g.strokeStyle = "rgba(255,255,255,0.2)"; g.lineWidth = 22; g.beginPath(); g.arc(x, y, R - 26, 0, 6.2832); g.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.2832; g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 5; g.beginPath(); g.moveTo(x + Math.cos(a) * (R - 6), y + Math.sin(a) * (R - 6)); g.lineTo(x + Math.cos(a) * (R - 16), y + Math.sin(a) * (R - 16)); g.stroke(); }
  if (u > 0.001) {
    const c = colorCalor(0.3 + 0.7 * u);
    g.save(); g.shadowColor = `rgba(${c},0.9)`; g.shadowBlur = 24;
    g.strokeStyle = `rgb(${c})`; g.lineWidth = 22; g.lineCap = "round";
    g.beginPath(); g.arc(x, y, R - 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * u); g.stroke(); g.restore();
  }
  g.textAlign = "center"; g.textBaseline = "alphabetic";
  const c2 = k.mezRgb("255,220,170", "255,90,60", u);
  g.save(); g.shadowColor = `rgba(${c2},0.9)`; g.shadowBlur = 24; g.fillStyle = `rgb(${c2})`;
  g.font = "800 128px Figtree"; g.fillText(String(Math.round(temp)), x - 22, y + 30);
  g.font = "700 56px Figtree"; g.fillText("°C", x + 102, y + 30); g.restore();
  g.fillStyle = "rgba(255,255,255,0.9)"; g.font = "700 50px Figtree"; g.fillText(`${min} min`, x, y + 108);
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  const brilloCri = tr(t, Tcri - 0.2, Tcri + 0.7);
  const alRayos = su(tr(t, Tluz - 0.25, Tluz + 0.35)) * (1 - 0.55 * su(tr(t, T5, T69)) + 0.55 * su(tr(t, T7, Tcri7)));
  const calS = Math.min(1, 0.85 * su(tr(t, Tsal - 0.3, Tsal + 0.9)) + 0.15 * su(tr(t, Tmuy - 0.2, Tmuy + 0.5)) + 0.1 * su(tr(t, T5, T69)));
  const calA = 0.85 * su(tr(t, Tasi - 0.25, Tasi + 0.7)) + 0.15 * su(tr(t, Tmuy - 0.2, Tmuy + 0.5));
  const niebla = su(tr(t, Tair - 0.2, Tenc + 0.3)) * (0.75 + 0.25 * su(tr(t, Tsub, Tmed)));

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(540, 960); g.scale(Z, Z); g.translate(-cx, -cy);
  techo(g);
  cielo(g, t);
  cristalBrillo(g, t, brilloCri);
  // en «frena», el cristal se marca en rojo: el calor no lo cruza
  const marca = k.pulso(t, Tfre + 0.05, 0.35);
  if (marca > 0.02) { g.save(); g.globalCompositeOperation = "lighter"; poli(g, PB); g.strokeStyle = `rgba(255,90,50,${0.8 * marca})`; g.lineWidth = 26; g.stroke(); g.restore(); }
  retrovisor(g);
  salpicadero(g, t, calS);
  // la reverberación sobre el salpicadero caliente
  const rev = su(tr(t, Tmuy - 0.3, Tmuy + 0.4)) * (1 - su(tr(t, Tcal - 0.2, Tcal + 0.3)));
  if (rev > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 16; i++) {
      const x = 120 + i * 56, fase = (t * 0.6 + i * 0.37) % 1, y = 1080 - fase * 220;
      g.strokeStyle = `rgba(255,200,150,${0.28 * rev * Math.sin(Math.PI * fase)})`; g.lineWidth = 6;
      g.beginPath(); for (let q = 0; q <= 10; q++) { const yy = y - q * 14, xx = x + 10 * Math.sin(yy * 0.04 + t * 7 + i); q ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke();
    }
    g.restore();
  }
  huevo(g, t);
  volante(g, calA);
  asiento(g, 300, calA, t);
  asiento(g, 800, calA, t);
  rayosDeSol(g, t, alRayos);
  ondas(g, t);
  // la niebla naranja del aire caliente, que gira sin salir
  if (niebla > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    g.globalAlpha = 0.22 * niebla;
    const a = t * 0.25;
    g.drawImage(naranja, -500 + Math.sin(a) * 120, -500 + Math.cos(a) * 80, 2100, 2900);
    g.globalAlpha = 1;
    g.fillStyle = `rgba(255,110,40,${0.16 * niebla})`; g.fillRect(-300, -400, 1700, 2500);
    g.restore();
  }
  g.setTransform(1, 0, 0, 1, 0, 0);

  // «69 °C» sobre el salpicadero
  const al69 = su(tr(t, T69 - 0.45, T69 - 0.1)) * (1 - su(tr(t, Tcla - 0.6, Tcla - 0.3)));
  if (al69 > 0.01) {
    const u = su(tr(t, T69 - 0.45, T69 + 0.15));
    k.pastilla(g, 540, 700, String(Math.round(mez(40, 69, u))), "°C", k.mezRgb("255,190,110", "255,80,50", u), al69, 130 + 18 * k.pulso(t, T69 + 0.15, 0.12));
  }
  reloj(g, t);
  vineta(g, 0.45);
  velo(g, 0.5, "12,10,8");
}
