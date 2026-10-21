// «En 1987, el cofundador de Apple, Steve Wozniak, creó un mando programable para controlar todos tus aparatos.»
// Otro sitio y otra época: un mueble de salón de 1987 con la tele de tubo, el vídeo y el equipo de música, todo
// apagado (el vídeo con su «12:00» parpadeando). Una cámara que se acerca al mando y se vuelve a alejar. Se entra con
// un corte en «En».
// - «En 1987»: «1987» en grande. «Steve Wozniak»: su nombre, con Apple.
// - «creó un mando»: el mando sube desde abajo.
// - «programable»: la cámara se acerca al mando; su pantallita escribe «PROG» y las teclas se encienden una a una.
// - «controlar todos tus»: la cámara se aleja; de la punta salen rayos de luz infrarroja (carmín) que llegan a la
//   tele, al vídeo y al equipo.
// - «aparatos»: todo se enciende de golpe, cada uno con su fogonazo. Antes del corte todo reposa.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, madera } from "../mundo.js";
import { IR } from "../objetosHoy.js";

export const desde = (vz) => vz.frase(17).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f = v.frase(17);
const T0 = f.inicio, Tano = f.t("1987"), Twoz = f.t("wozniak"), Tcreo = f.t("creo"), Tman = f.t("mando"), Tprog = f.t("programable");
const Tctrl = f.t("controlar"), Ttod = f.t("todos"), Tap = f.t("aparatos");
const FIN = v.frase(18).inicio;

// la cámara: quieta en el mueble; se acerca al mando en «programable» y se aleja en «controlar»
const cam = camino2D([
  [T0, [0.84, 0, -365]], [Tman + 0.15, [0.87, 0, -365]], [Tprog - 0.2, [0.88, 0, -365]], [Tprog + 0.35, [1.5, 0, 150]],
  [Tctrl - 0.3, [1.5, 0, 150]], [Ttod - 0.15, [0.88, 0, -365]], [FIN, [0.88, 0, -365]],
]);

const S = 1.0, PUNTA = [0, -80];                  // el mando: escala y dónde está su lucecita en el mundo
const mandoY = (t) => 1150 * (1 - su(tr(t, Tcreo - 0.05, Tman + 0.45)));   // lo que le falta por subir

// ---------------------------------------------------------------- tiempos de cada aparato
const DEV = { tele: [-285, -540], video: [-285, -195], equipo: [284, -760], disco: [284, -250] };
const RAYO0 = { tele: Ttod - 0.55, video: Ttod - 0.4, equipo: Ttod - 0.25, disco: Ttod - 0.1 };
const encDe = (t, d) => su(tr(t, Tap + { tele: 0, video: 0.08, equipo: 0.14, disco: 0.2 }[d], Tap + { tele: 0, video: 0.08, equipo: 0.14, disco: 0.2 }[d] + 0.28));
// giro de los discos y las bobinas: arrancan al encender y frenan hasta parar antes del corte
function giro(t, w0) { let a = 0; for (let s = Tap + 0.2; s < t; s += 0.02) a += w0 * 0.02 * (1 - su(tr(s, FIN - 0.55, FIN - 0.2))); return a; }

// ---------------------------------------------------------------- la sala
function sala(g, t, luz) {
  const wg = g.createLinearGradient(0, -1500, 0, -80); wg.addColorStop(0, "#2a1620"); wg.addColorStop(1, "#4e2a24");
  g.fillStyle = wg; g.fillRect(-1700, -1700, 3400, 1640);
  g.save(); g.globalAlpha = 0.12;
  for (let x = -1700; x < 1700; x += 120) { g.fillStyle = "#ffc890"; g.fillRect(x, -1700, 40, 1640); }
  g.restore();
  // la moqueta, naranja y marrón de los ochenta
  const fg = g.createLinearGradient(0, -80, 0, 900); fg.addColorStop(0, "#8a4620"); fg.addColorStop(1, "#4a220e");
  g.fillStyle = fg; g.fillRect(-1700, -80, 3400, 1500);
  g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(-1700, -86, 3400, 12);
  for (let i = -8; i < 8; i++) { g.fillStyle = "rgba(255,190,110,0.07)"; g.fillRect(i * 220 - 40, -60, 90, 1500); }
  // luz de una lámpara a la izquierda y la de los aparatos encendidos
  k.brillo(g, -520, -900, 1500, "255,190,120", 0.3);
  if (luz > 0.01) { k.brillo(g, 0, -420, 1500, "255,235,200", 0.22 * luz); k.brillo(g, -285, -540, 800, "170,210,255", 0.4 * luz); }
}

// ---------------------------------------------------------------- el mueble
function mueble(g) {
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 26;
  madera(g, -580, -880, 1160, 810, 16, ["#8c5c32", "#5e3a1c", "#33200f"]);
  g.restore();
  for (const [x, w] of [[-548, 528], [20, 528]]) { g.fillStyle = "#150b07"; g.fillRect(x, -850, w, 760); }
  madera(g, -548, -300, 528, 26, 0, ["#9a6a3a", "#6a4220", "#3a2410"]);
  madera(g, -548, -122, 528, 28, 0, ["#9a6a3a", "#6a4220", "#3a2410"]);
}

function pantallaBarras(g, x, y, w, h, t, luz) {
  const bar = ["#e8e8e8", "#e8e820", "#20e8e8", "#20e820", "#e820e8", "#e82020", "#2020e8"];
  g.save(); redondo(g, x, y, w, h, 34); g.clip();
  bar.forEach((c, i) => { g.fillStyle = c; g.fillRect(x + (w * i) / 7, y, w / 7 + 1, h * 0.72); });
  ["#2020e8", "#101010", "#e820e8", "#101010", "#20e8e8", "#101010", "#e8e8e8"].forEach((c, i) => { g.fillStyle = c; g.fillRect(x + (w * i) / 7, y + h * 0.72, w / 7 + 1, h * 0.12); });
  g.fillStyle = "#101010"; g.fillRect(x, y + h * 0.84, w, h * 0.16);
  g.fillStyle = "#f2f2f2"; g.fillRect(x + w * 0.2, y + h * 0.84, w * 0.14, h * 0.16);
  g.globalAlpha = 0.22; for (let yy = y; yy < y + h; yy += 6) { g.fillStyle = "#000"; g.fillRect(x, yy, w, 2); }
  g.restore();
}

function tele(g, t, on) {
  // el tubo: caja oscura con una pantalla combada y un panel con perillas
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 30; g.shadowOffsetY = 14;
  redondo(g, -519, -760, 470, 470, 34); const bg = g.createLinearGradient(-519, -760, -49, -290); bg.addColorStop(0, "#4a4a50"); bg.addColorStop(1, "#1c1c20"); g.fillStyle = bg; g.fill();
  g.restore();
  const sx = -496, sy = -736, sw = 340, sh = 300;
  redondo(g, sx - 14, sy - 14, sw + 28, sh + 28, 46); g.fillStyle = "#0a0a0c"; g.fill();
  redondo(g, sx, sy, sw, sh, 36); const dg = g.createRadialGradient(sx + 90, sy + 60, 10, sx + sw / 2, sy + sh / 2, 260); dg.addColorStop(0, "#2c3238"); dg.addColorStop(1, "#080a0c"); g.fillStyle = dg; g.fill();
  if (on > 0.01) { g.save(); g.globalAlpha = on; pantallaBarras(g, sx, sy, sw, sh, t, on); g.restore(); }
  // el reflejo del cristal
  g.save(); redondo(g, sx, sy, sw, sh, 36); g.clip();
  const rg = g.createLinearGradient(sx, sy, sx + 160, sy + 160); rg.addColorStop(0, "rgba(255,255,255,0.28)"); rg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = rg; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + 190, sy); g.lineTo(sx, sy + 190); g.closePath(); g.fill();
  g.restore();
  // el panel de la derecha: dos perillas, rejilla del altavoz y el piloto
  for (let i = 0; i < 7; i++) { g.fillStyle = "#08080a"; g.fillRect(-140, -720 + i * 16, 74, 7); }
  for (const [px, py] of [[-103, -560], [-103, -490]]) { g.beginPath(); g.arc(px, py, 26, 0, 6.2832); const kg = g.createRadialGradient(px - 8, py - 8, 2, px, py, 26); kg.addColorStop(0, "#9a9aa2"); kg.addColorStop(1, "#2a2a30"); g.fillStyle = kg; g.fill(); g.strokeStyle = "#0a0a0c"; g.lineWidth = 3; g.beginPath(); g.moveTo(px, py); g.lineTo(px + 14, py - 14); g.stroke(); }
  g.beginPath(); g.arc(-103, -400, 8, 0, 6.2832); g.fillStyle = on > 0.5 ? "#40ff70" : "#401010"; g.fill();
  if (on > 0.01) { k.brillo(g, -326, -586, 520, "180,210,255", 0.55 * on); }
}

function video(g, t, on) {
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.shadowOffsetY = 10;
  redondo(g, -519, -268, 470, 138, 12); const bg = g.createLinearGradient(0, -268, 0, -130); bg.addColorStop(0, "#3a3a40"); bg.addColorStop(1, "#16161a"); g.fillStyle = bg; g.fill();
  g.restore();
  // la ranura de la cinta
  redondo(g, -500, -250, 290, 62, 8); g.fillStyle = "#050507"; g.fill(); g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 2; g.stroke();
  g.fillStyle = "#2a2a30"; g.fillRect(-488, -228, 266, 6);
  // la pantallita: «12:00» parpadeando hasta que se enciende
  redondo(g, -190, -250, 124, 44, 6); g.fillStyle = "#050605"; g.fill();
  const par = Math.floor(t * 1.2) % 2 === 0;
  g.font = "bold 34px monospace"; g.textAlign = "center"; g.textBaseline = "middle";
  if (on < 0.5) { if (par) { g.fillStyle = "#ff3a2a"; g.fillText("12:00", -128, -227); } }
  else { g.fillStyle = "#6aff8a"; g.fillText("PLAY", -128, -227); k.brillo(g, -128, -227, 150, "100,255,140", 0.5 * on); }
  // botoncitos
  for (let i = 0; i < 5; i++) redondo(g, -500 + i * 58, -176, 46, 22, 5), (g.fillStyle = "#5a5a62"), g.fill();
  g.beginPath(); g.arc(-210, -165, 7, 0, 6.2832); g.fillStyle = on > 0.5 ? "#ff4040" : "#401818"; g.fill();
}

function equipo(g, t, on) {
  const X = 44, W = 480, base = (y, h) => { redondo(g, X, y, W, h, 8); const mg = g.createLinearGradient(0, y, 0, y + h); mg.addColorStop(0, "#c4c4c8"); mg.addColorStop(0.5, "#8c8c92"); mg.addColorStop(1, "#5a5a60"); g.fillStyle = mg; g.fill(); redondo(g, X + 8, y + 8, W - 16, h - 16, 6); g.fillStyle = "#0c0c10"; g.fill(); };
  const am = su(tr(t, Tap + 0.14, Tap + 0.42)) * (1 - su(tr(t, FIN - 0.5, FIN - 0.2)) * 0.8);
  // el sintonizador, con su dial iluminado
  base(-830, 140);
  redondo(g, X + 30, -806, 290, 70, 6); g.fillStyle = `rgb(${k.mezRgb("40,28,12", "255,196,100", on)})`; g.fill();
  g.strokeStyle = `rgba(40,20,0,${0.35 + 0.4 * on})`; g.lineWidth = 3;
  for (let i = 0; i < 20; i++) { const xx = X + 44 + i * 14; g.beginPath(); g.moveTo(xx, -796); g.lineTo(xx, -796 + (i % 4 ? 16 : 30)); g.stroke(); }
  g.strokeStyle = "#ff3a20"; g.lineWidth = 5; g.beginPath(); g.moveTo(X + 170 + 20 * on, -806); g.lineTo(X + 170 + 20 * on, -736); g.stroke();
  for (const [kx, ky] of [[X + 370, -760], [X + 430, -760]]) { g.beginPath(); g.arc(kx, ky, 25, 0, 6.2832); const kg = g.createRadialGradient(kx - 8, ky - 8, 2, kx, ky, 25); kg.addColorStop(0, "#d0d0d6"); kg.addColorStop(1, "#4a4a52"); g.fillStyle = kg; g.fill(); g.strokeStyle = "#16161a"; g.lineWidth = 3; g.beginPath(); g.moveTo(kx, ky); g.lineTo(kx + 8, ky - 15); g.stroke(); }
  // el ecualizador: barras de luz
  base(-684, 140);
  for (let i = 0; i < 10; i++) {
    const h = 0.12 + 0.82 * (0.18 + am * 0.82 * (0.5 + 0.5 * Math.sin(t * (5.5 + i * 1.3) + i * 1.7))) * on, bx = X + 36 + i * 42;
    for (let j = 0; j < 7; j++) { const lit = j / 7 < h * on + (on > 0.01 ? 0 : -1); const c = j < 4 ? "70,255,120" : j < 6 ? "255,230,60" : "255,70,60"; g.fillStyle = lit ? `rgba(${c},1)` : "rgba(70,70,76,0.8)"; g.fillRect(bx, -552 - 16 - j * 16 - 8, 28, 11); }
  }
  // la pletina de casete, con sus dos bobinas
  base(-538, 140);
  redondo(g, X + 30, -514, 240, 90, 8); g.fillStyle = "#26201a"; g.fill();
  const ang = giro(t, 9);
  for (const rx of [X + 90, X + 210]) { g.save(); g.translate(rx, -470); g.rotate(ang); g.beginPath(); g.arc(0, 0, 26, 0, 6.2832); g.fillStyle = "#e8e0d0"; g.fill(); g.fillStyle = "#16120e"; for (let i = 0; i < 6; i++) { g.rotate(1.0472); g.fillRect(-4, -20, 8, 14); } g.restore(); }
  for (let i = 0; i < 4; i++) redondo(g, X + 300 + (i % 2) * 80, -510 + Math.floor(i / 2) * 44, 66, 34, 6), (g.fillStyle = "#3a3a42"), g.fill();
  // el plato de discos: una funda de madera, el disco, y el brazo con su aguja
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.shadowOffsetY = 8;
  madera(g, X, -392, W, 290, 12, ["#8c5c32", "#5e3a1c", "#33200f"]); g.restore();
  const cx = X + 220, cy = -250;
  g.beginPath(); g.arc(cx, cy, 128, 0, 6.2832); g.fillStyle = "#0a0a0c"; g.fill();
  const dang = giro(t, 7);
  g.save(); g.translate(cx, cy); g.rotate(dang);
  g.strokeStyle = "rgba(255,255,255,0.1)"; g.lineWidth = 2; for (let r = 50; r < 124; r += 9) { g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.stroke(); }
  const sg = g.createLinearGradient(-120, -120, 120, 120); sg.addColorStop(0.35, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,0.16)"); sg.addColorStop(0.65, "rgba(255,255,255,0)");
  g.fillStyle = sg; g.beginPath(); g.arc(0, 0, 126, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(0, 0, 42, 0, 6.2832); g.fillStyle = "#e0482c"; g.fill(); g.fillStyle = "#f2e8d0"; g.fillRect(-26, -4, 52, 8);
  g.restore();
  g.beginPath(); g.arc(cx, cy, 6, 0, 6.2832); g.fillStyle = "#cfcfd6"; g.fill();
  // el brazo
  const ba = mez(-0.15, 0.2, on);
  g.save(); g.translate(X + 440, -354); g.rotate(2.35 + ba); g.strokeStyle = "#d0d0d6"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 190); g.stroke(); g.fillStyle = "#2a2a30"; g.fillRect(-12, 190, 24, 30); g.restore();
  g.beginPath(); g.arc(X + 440, -354, 18, 0, 6.2832); g.fillStyle = "#9a9aa2"; g.fill();
  if (on > 0.01) { k.brillo(g, 284, -760, 560, "255,200,110", 0.4 * on); k.brillo(g, 284, -600, 480, "90,255,140", 0.12 * on * am); }
}

// ---------------------------------------------------------------- el mando de 1987
const TECLAS = [["PWR", "#d83a2a"], ["TV", "#c8c2b0"], ["VCR", "#c8c2b0"], ["HIFI", "#c8c2b0"]];
function mando87(g, t, lcdTxt, teclas, led) {
  const x0 = -130, y0 = 260, w = 260, h = 880;
  g.save(); g.shadowColor = "rgba(0,0,0,0.65)"; g.shadowBlur = 50; g.shadowOffsetY = 28; redondo(g, x0, y0, w, h, 30); g.fillStyle = "#000"; g.fill(); g.restore();
  redondo(g, x0, y0, w, h, 30); const bg = g.createLinearGradient(x0, 0, x0 + w, 0); bg.addColorStop(0, "#807a6a"); bg.addColorStop(0.2, "#d6d0be"); bg.addColorStop(0.7, "#aaa490"); bg.addColorStop(1, "#6a6454"); g.fillStyle = bg; g.fill();
  redondo(g, x0 + 2, y0 + 2, w - 4, h - 4, 28); g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 3; g.stroke();
  // la ventanita de infrarrojos, de plástico oscuro
  redondo(g, -76, 266, 152, 40, 12); g.fillStyle = "#1a060a"; g.fill(); g.strokeStyle = "rgba(255,255,255,0.2)"; g.lineWidth = 2; g.stroke();
  g.beginPath(); g.ellipse(0, 286, 34, 11, 0, 0, 6.2832); g.fillStyle = `rgb(${k.mezRgb("70,14,24", "255,200,210", led)})`; g.fill();
  if (led > 0.02) { k.brillo(g, 0, 286, 300 + 160 * led, IR, 0.95 * led); k.brillo(g, 0, 286, 90, "255,255,255", 0.7 * led); }
  // la pantallita de cristal líquido
  redondo(g, -104, 330, 208, 92, 10); g.fillStyle = "#2a2a2c"; g.fill();
  redondo(g, -94, 340, 188, 72, 6); g.fillStyle = "#a4b890"; g.fill();
  g.font = "bold 40px monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#26321e"; g.fillText(lcdTxt, 0, 378);
  // las teclas: una fila de funciones y el teclado
  const key = (cx, cy, kw, kh, col, txt, lit) => {
    redondo(g, cx - kw / 2, cy - kh / 2, kw, kh, 8); const kg = g.createLinearGradient(0, cy - kh / 2, 0, cy + kh / 2); kg.addColorStop(0, col); kg.addColorStop(1, "#7a7464"); g.fillStyle = kg; g.fill();
    g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 2; g.stroke();
    if (lit > 0.01) { g.fillStyle = `rgba(255,236,170,${0.85 * lit})`; redondo(g, cx - kw / 2, cy - kh / 2, kw, kh, 8); g.fill(); k.brillo(g, cx, cy, 120, "255,226,140", 0.8 * lit); }
    g.font = "bold 20px sans-serif"; g.fillStyle = "#22201a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, cx, cy + 1);
  };
  TECLAS.forEach(([txt, col], i) => key(-87 + i * 58, 462, 50, 34, col, txt, teclas(i)));
  let n = 4;
  for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) { const num = j < 3 ? String(j * 3 + i + 1) : ["-", "0", "+"][i]; key(-58 + i * 58, 520 + j * 54, 50, 40, "#cfc9b8", num, teclas(n++)); }
  // teclas largas de reproducción
  ["◀◀", "▶", "▶▶"].forEach((txt, i) => key(-58 + i * 58, 770, 50, 40, "#bdb7a4", txt, teclas(n++)));
  ["■", "●", "II"].forEach((txt, i) => key(-58 + i * 58, 824, 50, 40, i === 1 ? "#d85a4a" : "#bdb7a4", txt, teclas(n++)));
}

// ---------------------------------------------------------------- los rayos
function rayo(g, t, de, a, u, al) {
  if (u <= 0.001 || al <= 0.01) return;
  const [ax, ay] = de, [bx, by] = a, px = ax + (bx - ax) * u, py = ay + (by - ay) * u;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  g.strokeStyle = `rgba(${IR},${0.2 * al})`; g.lineWidth = 44; g.beginPath(); g.moveTo(ax, ay); g.lineTo(px, py); g.stroke();
  g.strokeStyle = `rgba(${IR},${0.85 * al})`; g.lineWidth = 16; g.setLineDash([46, 26]); g.lineDashOffset = -t * 120; g.beginPath(); g.moveTo(ax, ay); g.lineTo(px, py); g.stroke(); g.setLineDash([]);
  g.strokeStyle = `rgba(255,235,240,${0.7 * al})`; g.lineWidth = 5; g.beginPath(); g.moveTo(ax, ay); g.lineTo(px, py); g.stroke();
  k.brillo(g, px, py, 120, IR, 0.9 * al);
  g.restore();
}

const pantalla = (wx, wy, Z, cx, cy) => [540 + (wx - cx) * Z, 960 + (wy - cy) * Z];

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  const on = { tele: encDe(t, "tele"), video: encDe(t, "video"), equipo: encDe(t, "equipo"), disco: encDe(t, "disco") };
  const luz = Math.max(on.tele, on.video, on.equipo);
  vista(g, Z, cx, cy);
  sala(g, t, luz);
  mueble(g);
  tele(g, t, on.tele);
  video(g, t, on.video);
  equipo(g, t, on.equipo);
  // los rayos, que salen de la punta del mando y llegan a cada aparato
  const aRayo = 1 - su(tr(t, FIN - 0.55, FIN - 0.25));
  for (const d of ["tele", "video", "equipo", "disco"]) {
    const u = su(tr(t, RAYO0[d], RAYO0[d] + 0.5));
    rayo(g, t, PUNTA, DEV[d], u, aRayo);
  }
  // el mando, que sube desde abajo
  const lcd = t < Tprog + 0.1 ? "" : t < Tprog + 0.9 ? "PROG" : t < Tctrl + 0.2 ? "TV VCR" : "OK";
  const lite = (i) => { const t1 = Tprog + 0.15 + i * 0.045; return su(tr(t, t1, t1 + 0.05)) * (1 - su(tr(t, t1 + 0.12, t1 + 0.22))); };
  const ledV = Math.max(su(tr(t, RAYO0.tele - 0.05, RAYO0.tele + 0.15)) * aRayo, 0);
  g.save(); g.translate(PUNTA[0], PUNTA[1] + mandoY(t)); g.scale(S, S); g.translate(0, -286);
  mando87(g, t, lcd, lite, ledV);
  g.restore();
  sinVista(g);
  // fogonazos al encenderse cada aparato
  for (const d of ["tele", "video", "equipo", "disco"]) {
    const dt = { tele: 0, video: 0.08, equipo: 0.14, disco: 0.2 }[d];
    const [fx, fy] = pantalla(DEV[d][0], DEV[d][1], Z, cx, cy);
    k.fogonazo(g, fx, fy, 1.5 * (t - (Tap + dt)), 700 * Z);
  }
  // «1987» y el nombre de Wozniak
  const an = su(tr(t, T0 + 0.12, T0 + 0.4)) * (1 - su(tr(t, Twoz - 0.6, Twoz - 0.25)));
  k.pastilla(g, 540, 1390, "1987", "", "255,226,160", an, 120);
  const wz = su(tr(t, Twoz - 0.08, Twoz + 0.2)) * (1 - su(tr(t, Tcreo + 0.05, Tcreo + 0.3)));
  k.pastilla(g, 540, 1390, "Steve Wozniak", "Apple", "255,255,255", wz, 60);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { mando: Tman, programable: Tprog, controlar: Tctrl, aparatos: Tap };
