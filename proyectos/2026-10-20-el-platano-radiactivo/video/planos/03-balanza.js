// «una sola radiografía de pecho equivale a comerte mil plátanos. Para hacerte daño, harían falta decenas de
// millones. Y ni así:»
// Otro sitio: una balanza en la cocina. Corte en «una».
// - «una sola radiografía de pecho»: en el platillo de la izquierda, una radiografía de pecho iluminada por detrás; la
//   balanza está hundida hacia ella.
// - «equivale a comerte mil plátanos»: llueven plátanos en el otro platillo y el contador corre; en «mil» llega a 1.000
//   y la balanza se iguala.
// - «Para hacerte daño, harían falta decenas de millones»: la cámara se aleja y sube; siguen cayendo plátanos hasta
//   hacer una montaña que entierra la balanza; en «millones», «decenas de millones».
// - «Y ni así»: la montaña quieta, entera.
import * as k from "#kit";
import { v } from "#voz";
import { caminoSuave, dibujaPlatanito, fondo, monton, velo, vineta } from "../mundo.js";

export const desde = "una";

const { suave: su, tramo: tr, mez, entra, azar, claves } = k;
const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const T0 = f4.t("una"), Tcom = f4.t("comerte"), Tmil = f4.t("mil"), Tpla = f4.t("platanos");
const Tpara = f5.inicio, Tdec = f5.t("decenas"), Tmill = f5.t("millones"), Tfin5 = f5.fin;

// la balanza, en el mundo (px con zoom 1)
const PX = 540, PY = 800, BRAZO = 270, CUELGA = 250;
// lo que lleva cada platillo: 1.000 plátanos entre «comerte» y un poco después de «mil»
const Tlleno = Tmil + 0.15;
const cuenta = (t) => 1000 * su(tr(t, Tcom - 0.05, Tlleno));
const incl = (t) => -0.24 * (1 - su(tr(t, Tcom + 0.2, Tlleno + 0.35))) + 0.012 * Math.sin((t - T0) * 5) * Math.exp(-(t - T0) * 2.5);

// la cámara: quieta en la balanza; en «Para» se aleja y sube para ver la montaña
const lz = claves([[Tpara - 0.1, Math.log(1.2)], [Tmill + 0.2, Math.log(0.3)]]);
const cyC = claves([[Tpara - 0.1, 900], [Tmill + 0.2, -150]]);

// los plátanos del platillo (cada uno llega cayendo) y los de la montaña
const PLATILLO = monton(91, 46, 300, 190);
const MONTANA = monton(92, 1500, 5200, 3200);
const az = azar(17);
const CAEN = Array.from({ length: 80 }, () => ({ x: (az() - 0.5) * 1800, f: az(), ang: az() * 6.28, giro: (az() - 0.5) * 6 }));

// la radiografía de pecho, de pie, w × h, centrada abajo en (0, 0)
function radiografia(g, w, h, t) {
  const x0 = -w / 2, y0 = -h;
  k.brillo(g, 0, -h / 2, w * 2.6, "azul", 0.6);
  g.save();
  k.redondo(g, x0, y0, w, h, 14); g.fillStyle = "#0a1626"; g.fill(); g.clip();
  const lg = g.createRadialGradient(0, -h * 0.5, 10, 0, -h * 0.5, h * 0.7); lg.addColorStop(0, "rgba(90,140,200,0.55)"); lg.addColorStop(1, "rgba(20,40,70,0)");
  g.fillStyle = lg; g.fillRect(x0, y0, w, h);
  // los pulmones, oscuros, y alrededor el cuerpo
  g.fillStyle = "rgba(170,205,240,0.28)"; g.beginPath(); g.ellipse(0, -h * 0.48, w * 0.44, h * 0.46, 0, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(10,20,35,0.75)";
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * w * 0.18, -h * 0.5, w * 0.15, h * 0.3, s * 0.12, 0, 6.2832); g.fill(); }
  // la columna y las costillas
  g.strokeStyle = "rgba(235,245,255,0.9)"; g.lineCap = "round";
  g.lineWidth = w * 0.05; g.beginPath(); g.moveTo(0, -h * 0.9); g.lineTo(0, -h * 0.08); g.stroke();
  g.lineWidth = w * 0.022;
  for (let i = 0; i < 8; i++) {
    const y = -h * (0.78 - i * 0.075), ab = w * (0.2 + i * 0.022);
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(s * ab * 1.2, y - h * 0.05, s * ab * 1.5, y + h * 0.04, s * ab * 1.2, y + h * 0.1); g.stroke(); }
  }
  // las clavículas y el corazón
  g.lineWidth = w * 0.03; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(0, -h * 0.82); g.quadraticCurveTo(s * w * 0.2, -h * 0.88, s * w * 0.4, -h * 0.84); g.stroke(); }
  g.fillStyle = "rgba(220,235,255,0.35)"; g.beginPath(); g.ellipse(w * 0.06, -h * 0.4, w * 0.13, h * 0.12, 0.4, 0, 6.2832); g.fill();
  g.restore();
  k.redondo(g, x0, y0, w, h, 14); g.strokeStyle = "rgba(200,225,255,0.9)"; g.lineWidth = 6; g.stroke();
  // la pinza de arriba
  g.fillStyle = "#c7ccd4"; k.redondo(g, -40, y0 - 18, 80, 34, 8); g.fill();
}

function platillo(g, x, y) {
  // la cadena hasta el brazo (tres hilos) y el plato de metal
  g.strokeStyle = "rgba(220,225,235,0.9)"; g.lineWidth = 4;
  for (const dx of [-118, 0, 118]) { g.beginPath(); g.moveTo(x, y - CUELGA); g.lineTo(x + dx, y); g.stroke(); }
  g.beginPath(); g.ellipse(x, y, 150, 28, 0, 0, Math.PI); g.lineTo(x - 150, y); g.closePath();
  k.metal(g, x - 150, x + 150, ["#7a6a40", "#e9d9a2", "#b69c5a", "#fff2c4", "#6e5c30"]);
  g.beginPath(); g.ellipse(x, y, 150, 24, 0, 0, 6.2832); g.fillStyle = "rgba(255,240,190,0.35)"; g.fill();
  g.strokeStyle = "rgba(255,245,210,0.8)"; g.lineWidth = 3; g.stroke();
}

export function dibuja(g, t) {
  fondo(g, t);
  const Z = Math.exp(lz(t)), cy = cyC(t);
  g.save(); g.setTransform(Z, 0, 0, Z, 540 - 540 * Z, 960 - cy * Z);
  // la mesa
  const mg = g.createLinearGradient(0, 1150, 0, 2400); mg.addColorStop(0, "#7a4a22"); mg.addColorStop(1, "#1e0f06");
  g.fillStyle = mg; g.fillRect(-3000, 1150, 7080, 4000);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.red, -3000, 1150, 7080, 3000); g.restore();
  g.fillStyle = "rgba(255,210,150,0.25)"; g.fillRect(-3000, 1150, 7080, 4);
  // el pie y el brazo de la balanza
  const a = incl(t), ca = Math.cos(a), sa = Math.sin(a);
  g.beginPath(); g.moveTo(PX - 26, PY); g.lineTo(PX + 26, PY); g.lineTo(PX + 40, 1150); g.lineTo(PX - 40, 1150); g.closePath();
  k.metal(g, PX - 40, PX + 40, ["#6e5c30", "#f2e3ae", "#a88f50", "#5e4e26"]);
  g.beginPath(); g.ellipse(PX, 1150, 160, 30, 0, 0, 6.2832); k.metal(g, PX - 160, PX + 160, ["#5e4e26", "#e8d59a", "#9a8246", "#4e3e1a"]);
  const L = [PX - ca * BRAZO, PY - sa * BRAZO], R = [PX + ca * BRAZO, PY + sa * BRAZO];
  g.save(); g.translate(PX, PY); g.rotate(a);
  k.redondo(g, -BRAZO - 14, -14, BRAZO * 2 + 28, 28, 14); k.metal(g, -BRAZO, BRAZO, ["#6e5c30", "#f6e8b6", "#b2985a", "#fff4cc", "#5e4e26"]);
  g.restore();
  g.beginPath(); g.arc(PX, PY, 30, 0, 6.2832); k.metal(g, PX - 30, PX + 30, ["#4e3e1a", "#fff0c0", "#6e5c30"]);
  // los platillos cuelgan siempre rectos
  const pl = [L[0], L[1] + CUELGA], pr = [R[0], R[1] + CUELGA];
  // la radiografía, de pie en el de la izquierda
  g.save(); g.translate(pl[0], pl[1] - 4); radiografia(g, 230, 290, t); g.restore();
  platillo(g, pl[0], pl[1]);
  platillo(g, pr[0], pr[1]);
  // los plátanos del platillo: aparecen según la cuenta, cayendo desde arriba
  const n = Math.floor((cuenta(t) / 1000) * PLATILLO.length);
  for (let i = 0; i < n; i++) {
    const p = PLATILLO[i], tl = Tcom + (i / PLATILLO.length) * (Tlleno - Tcom), cae = entra(tr(t, tl - 0.12, tl + 0.12));
    dibujaPlatanito(g, pr[0] + p.x * 0.9, pr[1] - 10 + p.y - (1 - cae) * 500, 150 * p.esc, p.ang, p.flip);
  }
  // la montaña: crece desde abajo en cuanto la cámara se aleja, y entierra la balanza
  const crece = su(tr(t, Tpara + 0.2, Tmill + 0.35));
  if (crece > 0) {
    const s0 = 0.12 + 0.88 * crece, hb = 3200 * s0 * 0.95, wb = 2700 * s0;
    g.beginPath(); g.moveTo(540 - wb, 1210); g.bezierCurveTo(540 - wb * 0.45, 1210, 540 - wb * 0.3, 1200 - hb, 540, 1200 - hb); g.bezierCurveTo(540 + wb * 0.3, 1200 - hb, 540 + wb * 0.45, 1210, 540 + wb, 1210); g.closePath();
    const hg = g.createLinearGradient(0, 1200 - hb, 0, 1210); hg.addColorStop(0, "#f4d050"); hg.addColorStop(1, "#7a5a10"); g.fillStyle = hg; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(k.red, 540 - wb, 1200 - hb, wb * 2, hb + 20); g.restore();
    const m = Math.floor(crece * MONTANA.length);
    for (let i = 0; i < m; i++) { const p = MONTANA[i]; const s = 0.12 + 0.88 * crece; dibujaPlatanito(g, 540 + p.x * s, 1200 + p.y * s, 230 * p.esc * (0.6 + 0.4 * s), p.ang, p.flip); }
  }
  // los que caen del cielo, sin parar, desde «comerte» hasta antes de «Y»
  const lluvia = su(tr(t, Tpara, Tpara + 0.3)) * (1 - su(tr(t, f6.t("asi") - 0.2, f6.t("asi") + 0.25)));
  if (lluvia > 0) {
    const ancho = mez(0.25, 1, su(tr(t, Tpara, Tmill)));
    for (const c of CAEN) {
      const cima = 1200 - 3200 * (0.12 + 0.88 * crece), ph = ((t * 1.1 + c.f) % 1), y = mez(-2600, cima + Math.abs(c.x) * 0.9, ph * ph), x = 540 + c.x * ancho;
      g.globalAlpha = lluvia * Math.min(1, ph * 6);
      dibujaPlatanito(g, x, y, 200, c.ang + c.giro * t);
    }
    g.globalAlpha = 1;
  }
  g.restore();
  // las cifras
  const c = cuenta(t), al = su(tr(t, Tcom - 0.15, Tcom + 0.1)) * (1 - su(tr(t, Tpara + 0.1, Tpara + 0.4)));
  k.pastilla(g, 540, 600, k.fmt(Math.round(c / 10) * 10), "plátanos", c >= 999 ? "255,226,90" : "255,255,255", al, 110);
  const am = su(tr(t, Tmill - 0.1, Tmill + 0.2));
  k.pastilla(g, 540, 640, "decenas de millones", "", "255,226,90", am, 84);
  vineta(g, 0.5);
  velo(g, 0.55);
}
