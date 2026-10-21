// Lo que comparten los planos: la cocina, la olla de cristal (con su agua hirviendo, su vapor, su tapa y su fuego), la
// moneda y la brasa (el calor que viaja dentro del vapor). Todo en 2D, en coordenadas del mundo (px con zoom 1).
// La olla se dibuja en su propio sitio: el centro de su base en (0, y) y se coloca con `colocada` (posición y escala).
import * as k from "#kit";

const { azar, lienzo, redondo, tramo: tr, suave: su, mez, entra } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (el zoom, en log, para que se acerque con ritmo parejo).
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}

// ---------------------------------------------------------------- medidas de la olla (coordenadas locales)
export const M = { mitad: 320, borde: 640, base: 1160, agua: 800, hornillo: 1235, mando: [250, 1385] };

// ---------------------------------------------------------------- texturas que se hacen una vez
const nube = (rgb) => {
  // una bocanada: varias bolitas blandas juntas, para que no sea un círculo perfecto
  const l = lienzo(200), c = l.getContext("2d"), az = azar(rgb.length * 31 + 5);
  for (let i = 0; i < 9; i++) {
    const x = 100 + (az() - 0.5) * 70, y = 100 + (az() - 0.5) * 60, r = 38 + az() * 34, gr = c.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},0.55)`); gr.addColorStop(0.55, `rgba(${rgb},0.28)`); gr.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  return l;
};
const NUBE = nube("246,250,255"), NUBE_CALIDA = nube("255,232,205");

// la pared de azulejos: 4 × 4 azulejos que se repiten, cada uno con su tono y su brillo
const azulejos = (() => {
  const T = 130, N = 4, l = lienzo(T * N), c = l.getContext("2d"), az = azar(808);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const tono = az(), x0 = x * T, y0 = y * T;
    const gr = c.createLinearGradient(x0, y0, x0 + T, y0 + T);
    gr.addColorStop(0, `rgb(${22 + tono * 12},${88 + tono * 22},${108 + tono * 22})`); gr.addColorStop(1, `rgb(${10 + tono * 8},${52 + tono * 16},${70 + tono * 16})`);
    c.fillStyle = gr; c.fillRect(x0, y0, T, T);
    const br = c.createLinearGradient(x0, y0, x0 + T * 0.6, y0 + T * 0.6);
    br.addColorStop(0, "rgba(255,255,255,0.20)"); br.addColorStop(0.5, "rgba(255,255,255,0.02)"); br.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = br; c.fillRect(x0 + 5, y0 + 5, T - 10, T - 10);
    c.fillStyle = "rgba(0,0,0,0.5)"; c.fillRect(x0, y0, T, 5); c.fillRect(x0, y0, 5, T);
  }
  return l;
})();
const patronPared = (() => { const c = lienzo(4, 4).getContext("2d"); return c.createPattern(azulejos, "repeat"); })();

// ---------------------------------------------------------------- la cocina
// La pared de azulejos (azul petróleo), la encimera y el frontal del fogón, a lo ancho de todo lo que puede ver la
// cámara. luz: 0..1.4, cuánto alumbra el fuego la pared.
export function fondoCocina(g, luz = 0.8) {
  g.save();
  g.fillStyle = patronPared; g.fillRect(-1800, -2600, 4700, 3830);
  // la pared se oscurece hacia arriba y hacia los lados
  const og = g.createLinearGradient(0, -400, 0, 1230);
  og.addColorStop(0, "rgba(2,10,16,0.82)"); og.addColorStop(0.55, "rgba(2,10,16,0.35)"); og.addColorStop(1, "rgba(2,10,16,0.05)");
  g.fillStyle = og; g.fillRect(-1800, -2600, 4700, 3830);
  // luces lejanas, suaves, para que la pared tenga profundidad
  g.globalCompositeOperation = "lighter";
  for (const [x, y, r, a] of [[60, 380, 360, 0.10], [980, 260, 420, 0.09], [540, 20, 520, 0.08]]) {
    const bg = g.createRadialGradient(x, y, 0, x, y, r); bg.addColorStop(0, `rgba(120,200,220,${a})`); bg.addColorStop(1, "rgba(120,200,220,0)");
    g.fillStyle = bg; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  g.globalCompositeOperation = "source-over";
  // la encimera (el fogón visto desde un poco arriba)
  const hg = g.createLinearGradient(0, 1170, 0, 1335);
  hg.addColorStop(0, "#1b1f24"); hg.addColorStop(0.5, "#0f1215"); hg.addColorStop(1, "#08090b");
  g.fillStyle = hg; g.fillRect(-1800, 1170, 4700, 165);
  g.fillStyle = "rgba(160,175,190,0.32)"; g.fillRect(-1800, 1169, 4700, 3);
  // el frontal de acero, con su brillo
  const fg = g.createLinearGradient(0, 1335, 0, 2200);
  fg.addColorStop(0, "#343a42"); fg.addColorStop(0.08, "#1d2127"); fg.addColorStop(1, "#0e1013");
  g.fillStyle = fg; g.fillRect(-1800, 1335, 4700, 900);
  g.fillStyle = "rgba(210,220,235,0.28)"; g.fillRect(-1800, 1335, 4700, 4);
  g.globalAlpha = 0.22; g.fillStyle = "rgba(0,0,0,1)"; g.fillRect(-1800, 1339, 4700, 18);
  g.globalAlpha = 1;
  // un cepillado de acero en el frontal y otros mandos apagados, para que sea un fogón de verdad
  g.fillStyle = "rgba(255,255,255,0.035)"; for (let y = 1370; y < 1900; y += 14) g.fillRect(-1800, y, 4700, 3);
  g.fillStyle = "rgba(210,220,235,0.18)"; g.fillRect(-1800, 1520, 4700, 3);
  for (const x of [-60, 290, 540 - 250 + 500, 1290, 1550]) { g.beginPath(); g.arc(x, 1385, 58, 0, 6.2832); g.fillStyle = "#0c0d0f"; g.fill(); g.beginPath(); g.arc(x, 1385, 47, 0, 6.2832); g.fillStyle = "#1c1f23"; g.fill(); g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.arc(x - 12, 1372, 18, 0, 6.2832); g.fill(); }
  g.restore();
  // el reflejo cálido del fuego sobre la pared
  if (luz > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    const wg = g.createRadialGradient(540, 1000, 60, 540, 1000, 1000);
    wg.addColorStop(0, `rgba(255,150,70,${0.28 * Math.min(1.4, luz)})`); wg.addColorStop(0.5, `rgba(255,110,40,${0.1 * Math.min(1.4, luz)})`); wg.addColorStop(1, "rgba(255,110,40,0)");
    g.fillStyle = wg; g.fillRect(-500, 0, 2080, 1230);
    g.restore();
  }
}

// ---------------------------------------------------------------- la brasa y la moneda
// El calor, hecho brasa: un punto naranja encendido con su luz.
export function brasa(g, x, y, tam, al = 1) {
  if (al <= 0.003) return;
  k.brillo(g, x, y, tam * 2.2, "fuego", 0.5 * al);
  k.brillo(g, x, y, tam * 1.0, "fuego", 0.85 * al);
  k.brillo(g, x, y, tam * 0.34, "amarilla", 0.9 * al);
}

// La misma brasa pero con cuerpo (se ve también sobre el vapor blanco): una bola de fuego con su luz alrededor.
export function brasaSolida(g, x, y, r, al = 1) {
  if (al <= 0.003) return;
  k.brillo(g, x, y, r * 4.2, "fuego", 0.5 * al);
  const A = g.globalAlpha;
  g.save(); g.globalAlpha = A * Math.min(1, al);
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, "#fff6c0"); gr.addColorStop(0.35, "#ffc23a"); gr.addColorStop(0.75, "#ff6a14"); gr.addColorStop(1, "rgba(255,70,10,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  g.restore();
}

// Una moneda dorada de radio r, girando (ang) alrededor de su eje vertical: de frente enseña el €, de canto es una
// raya. al: transparencia. Dibujada con volumen: degradado dorado, canto oscuro y aro.
export function moneda(g, x, y, r, ang, al = 1) {
  if (al <= 0.003 || r < 1) return;
  const c = Math.cos(ang), a = Math.abs(c), s = Math.sin(ang), A = g.globalAlpha;
  g.save(); g.globalAlpha = A * al; g.translate(x, y);
  const grueso = r * 0.2 * Math.abs(s);
  // el canto
  if (grueso > 0.5) { g.fillStyle = "#9a6416"; g.beginPath(); g.ellipse(grueso * Math.sign(s) * -0.5, 0, Math.max(0.8, r * a), r, 0, 0, 6.2832); g.fill(); }
  g.scale(Math.max(0.05, a), 1);
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  gr.addColorStop(0, "#fff3b0"); gr.addColorStop(0.5, "#ffc93c"); gr.addColorStop(1, "#d68a12");
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill();
  g.strokeStyle = "#a96a10"; g.lineWidth = r * 0.09; g.beginPath(); g.arc(0, 0, r * 0.97, 0, 6.2832); g.stroke();
  g.strokeStyle = "rgba(255,244,190,0.8)"; g.lineWidth = r * 0.06; g.beginPath(); g.arc(0, 0, r * 0.78, 0, 6.2832); g.stroke();
  if (a > 0.25) { g.fillStyle = "#a8650c"; g.font = `800 ${r * 1.15}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("€", 0, r * 0.04); }
  g.restore();
}

// Una pila de monedas apoyada en (x, yBase). tiempos: el segundo en que cae cada moneda (de abajo arriba); cada una
// llega desde arriba y se posa con un pequeño bote. r: radio de la moneda.
export function pilaMonedas(g, x, yBase, tiempos, t, r = 88) {
  const grueso = r * 0.26, ry = r * 0.3;
  for (let i = 0; i < tiempos.length; i++) {
    const u = t - tiempos[i];
    if (u < -0.5) continue;
    const reposo = yBase - i * grueso;
    let y = reposo, al = 1;
    if (u < 0) { const q = 1 + u / 0.5; y = reposo - 760 * (1 - q * q); al = Math.min(1, q * 3); } else if (u < 0.3) y = reposo - 18 * Math.sin((u / 0.3) * Math.PI) * (1 - u / 0.3);
    g.save(); g.globalAlpha *= al;
    g.fillStyle = "#a9690f"; g.beginPath(); g.ellipse(x, y + grueso * 0.55, r, ry, 0, 0, Math.PI); g.lineTo(x - r, y); g.fill();
    g.fillStyle = "#c98716"; g.fillRect(x - r, y, r * 2, grueso * 0.55);
    g.fillStyle = "#a9690f"; g.beginPath(); g.ellipse(x, y + grueso * 0.55, r, ry, 0, 0, Math.PI); g.fill();
    const gr = g.createLinearGradient(x - r, y, x + r, y); gr.addColorStop(0, "#e8a92a"); gr.addColorStop(0.35, "#ffe07a"); gr.addColorStop(1, "#b8760f");
    g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r, ry, 0, 0, 6.2832); g.fill();
    g.strokeStyle = "rgba(255,246,200,0.7)"; g.lineWidth = 2.5; g.beginPath(); g.ellipse(x, y, r * 0.76, ry * 0.76, 0, 0, 6.2832); g.stroke();
    g.restore();
  }
}

// ---------------------------------------------------------------- el mando del gas
export function mando(g, x, y, giro, al = 1) {
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(1.3, 1.3);
  g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 24; g.shadowOffsetY = 10;
  g.beginPath(); g.arc(0, 0, 62, 0, 6.2832); g.fillStyle = "#101214"; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.beginPath(); g.arc(0, 0, 54, 0, 6.2832); k.metal(g, -54, 54, ["#4b5058", "#d4d9e0", "#7c838d", "#eef1f5", "#4a4f57"]);
  g.rotate(giro);
  g.beginPath(); g.arc(0, 0, 40, 0, 6.2832); const dg = g.createRadialGradient(-12, -14, 4, 0, 0, 40); dg.addColorStop(0, "#3a3f46"); dg.addColorStop(1, "#14161a"); g.fillStyle = dg; g.fill();
  g.fillStyle = "#ff8a2a"; redondo(g, -5, -38, 10, 30, 5); g.fill();                 // la marca del mando
  g.restore();
  // la llamita grabada alrededor del mando, grande y pequeña
  g.save(); g.globalAlpha *= 0.6; g.fillStyle = "#9aa3ad"; g.font = "700 28px Figtree"; g.textAlign = "center"; g.fillText("MAX", x - 100, y - 86); g.fillText("min", x + 104, y - 86); g.restore();
}

// ---------------------------------------------------------------- el fuego
export function fuego(g, t, lv, delante, naranja = 0.08) {
  if (lv <= 0.02) return;
  const rx = 150 + 130 * Math.min(1.4, lv), alto = 26 + 175 * lv;
  k.anilloDeLlamas(g, 0, M.hornillo, rx, rx * 0.2, t, naranja, delante, 32, alto);
}
function hornillo(g) {
  // el quemador de metal y las rejillas del fogón
  const cy = M.hornillo;
  g.fillStyle = "#050607"; g.beginPath(); g.ellipse(0, cy + 8, 330, 70, 0, 0, 6.2832); g.fill();
  const qg = g.createLinearGradient(0, cy - 50, 0, cy + 50);
  qg.addColorStop(0, "#4a4642"); qg.addColorStop(0.5, "#201e1c"); qg.addColorStop(1, "#55504b");
  g.fillStyle = qg; g.beginPath(); g.ellipse(0, cy, 290, 56, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#0b0a09"; g.beginPath(); g.ellipse(0, cy - 4, 180, 33, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#1c1b1a"; g.beginPath(); g.ellipse(0, cy - 8, 70, 13, 0, 0, 6.2832); g.fill();
  // las rejillas negras donde se apoya la olla
  g.strokeStyle = "#050505"; g.lineWidth = 16; g.lineCap = "round";
  for (const [x0, y0, x1, y1] of [[-300, cy - 8, -150, cy - 70], [300, cy - 8, 150, cy - 70], [-300, cy + 30, -150, cy + 20], [300, cy + 30, 150, cy + 20]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
}

// ---------------------------------------------------------------- la olla de cristal
const PAISAJE = (() => {
  const az = azar(515);
  return {
    burbujas: Array.from({ length: 70 }, () => ({ x: (az() - 0.5) * 570, ph: az(), dur: 0.55 + az() * 0.7, r: 5 + az() * 13, em: az() })),
    vapor: Array.from({ length: 150 }, (_, i) => ({ x: (az() + az() - 1) * 270, ph: az(), dur: 1.5 + az() * 0.9, s: 46 + az() * 44, dx: (az() - 0.5) * 120, em: az(), calido: az() * 1.4 })),
    espuma: Array.from({ length: 44 }, () => ({ x: (az() - 0.5) * 600, ph: az() * 6.28, r: 6 + az() * 14 })),
    monedas: Array.from({ length: 34 }, () => ({ x: (az() - 0.5) * 360, vx: (az() - 0.5) * 520, vy: 760 + az() * 640, r: 62 + az() * 28, giro: 5 + az() * 7, ph: az() * 6.28 })),
    gotas: Array.from({ length: 11 }, (_, j) => ({ x: -250 + (500 * (j + az() * 0.7)) / 11, off: az() * 0.35, r: 20 + az() * 12 })),
  };
})();

const caminoOlla = (g, ins = 0) => {
  const L = -M.mitad + ins, R = M.mitad - ins, T = M.borde, B = M.base - ins, r = 46;
  g.beginPath(); g.moveTo(L, T); g.lineTo(L, B - r); g.quadraticCurveTo(L, B, L + r, B); g.lineTo(R - r, B); g.quadraticCurveTo(R, B, R, B - r); g.lineTo(R, T); g.closePath();
};
// El interior del aire de la olla con su tapa puesta: la olla y, encima, el casquete de la tapa.
const caminoCamara = (g) => {
  const L = -M.mitad + 8, R = M.mitad - 8, T = M.borde, B = M.base - 8, r = 40, a = M.borde - 96;
  g.beginPath(); g.moveTo(L, B - r); g.lineTo(L, T); g.bezierCurveTo(L, T - 50, -185, a, 0, a); g.bezierCurveTo(185, a, R, T - 50, R, T); g.lineTo(R, B - r);
  g.quadraticCurveTo(R, B, R - r, B); g.lineTo(L + r, B); g.quadraticCurveTo(L, B, L, B - r); g.closePath();
};
// El casquete de la tapa por dentro: su y en x (aprox.), con el borde de la olla en su base.
const techoTapa = (x) => M.borde - 96 + 88 * Math.pow(Math.min(1, Math.abs(x) / 322), 2.3);

// La tapa: un casquete de cristal con su aro de acero y su pomo, con su base en el borde de la olla + dy.
function tapa(g, t, dy, o) {
  g.save(); g.translate(0, dy);
  const T = M.borde;
  // el casquete de cristal
  g.beginPath(); g.moveTo(-336, T); g.bezierCurveTo(-336, T - 50, -190, T - 104, 0, T - 104); g.bezierCurveTo(190, T - 104, 336, T - 50, 336, T); g.closePath();
  const ng = g.createLinearGradient(0, T - 104, 0, T);
  ng.addColorStop(0, "rgba(190,230,245,0.22)"); ng.addColorStop(1, "rgba(150,210,235,0.10)");
  g.fillStyle = ng; g.fill();
  // la niebla del vapor dentro, cuando está puesta
  if (o.niebla > 0.01) { g.save(); g.clip(); const fg = g.createLinearGradient(0, T - 104, 0, T); fg.addColorStop(0, `rgba(235,244,252,${0.3 * o.niebla})`); fg.addColorStop(1, `rgba(235,244,252,${0.1 * o.niebla})`); g.fillStyle = fg; g.fillRect(-340, T - 110, 680, 120); g.restore(); }
  k.vidrio(g, -336, 336, 0.6);
  k.reflejo(g, -230, T - 82, 14, 52, 0.4); k.reflejo(g, -196, T - 92, 6, 38, 0.25); k.reflejo(g, 150, T - 90, 9, 44, 0.25);
  // el aro de acero
  redondo(g, -344, T - 10, 688, 20, 9); k.metal(g, -344, 344, ["#5a6068", "#e6eaef", "#8f97a2", "#f6f8fa", "#555b63"]);
  // el pomo
  redondo(g, -14, T - 128, 28, 26, 6); k.metal(g, -14, 14);
  const pg = g.createRadialGradient(-10, T - 160, 3, 0, T - 150, 34);
  pg.addColorStop(0, "#5c6068"); pg.addColorStop(0.55, "#16181b"); pg.addColorStop(1, "#050506");
  g.fillStyle = pg; g.beginPath(); g.arc(0, T - 152, 32, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(-12, T - 164, 11, 6, -0.5, 0, 6.2832); g.fill();
  g.restore();
}

// Dibuja la olla entera. o:
//   llama      0..1,4  cuánto fuego (0 apagado)        hierve   0..1  cuánto hierve el agua       vapor  0..1  cuánto vapor sale
//   brasas     0..1    el calor, visible en el vapor    calor    0..1  el agua se enciende de calor
//   tapaDy     cuánto sube la tapa sobre el borde (null: sin tapa); 0 puesta
//   niebla     0..1    la niebla bajo la tapa           gotas    { t0 } cuándo empieza a condensar (null: no)
//   monedas    { desde, hasta, n } cuándo salen monedas con el vapor
//   sonda      0..1    la sonda del termómetro en el agua
//   mando      el giro del mando del gas (rad) o null para no dibujarlo
export function olla(g, t, o) {
  const esc = o.esc ?? 1;
  g.save(); g.translate(o.x ?? 540, (o.y ?? M.base) - M.base * esc); g.scale(esc, esc);
  ollaLocal(g, t, o);
  g.restore();
}
function ollaLocal(g, t, o) {
  const lv = o.llama ?? 0.8, hierve = o.hierve ?? 1, vap = o.vapor ?? 1, brasas = o.brasas ?? 0, calor = o.calor ?? 0.2;
  const cm = o.cubre ?? ((o.tapaDy ?? 99) < 4 ? 1 : 0);
  // la luz del fuego alrededor
  g.save(); g.globalCompositeOperation = "lighter";
  const lg = g.createRadialGradient(0, 1180, 30, 0, 1180, 520 + 160 * lv);
  lg.addColorStop(0, `rgba(255,140,60,${0.2 * Math.min(1.3, lv)})`); lg.addColorStop(1, "rgba(255,120,40,0)");
  g.fillStyle = lg; g.fillRect(-900, 500, 1800, 1000);
  g.restore();
  hornillo(g);
  fuego(g, t, lv, false);

  // ---- el agua, dentro del cristal
  const nivel = M.agua + 4 * Math.sin(t * 7) * hierve;
  g.save(); caminoOlla(g, 8); g.clip();
  const ag = g.createLinearGradient(0, M.agua, 0, M.base);
  ag.addColorStop(0, "rgba(140,214,240,0.84)"); ag.addColorStop(0.45, "rgba(58,152,206,0.92)"); ag.addColorStop(1, "rgba(18,78,142,0.97)");
  g.fillStyle = ag; g.fillRect(-340, nivel, 680, 400);
  // el calor del fondo y la red de luz del agua
  g.globalCompositeOperation = "lighter";
  const cg = g.createRadialGradient(0, M.base, 20, 0, M.base, 360);
  cg.addColorStop(0, `rgba(255,150,60,${0.35 + 0.5 * calor})`); cg.addColorStop(1, "rgba(255,120,40,0)");
  g.fillStyle = cg; g.fillRect(-340, M.agua, 680, 400);
  g.globalAlpha = 0.26 + 0.1 * hierve; { const d = t * 70, b = Math.floor(d / 640), off = d - b * 640; for (let q = 0; q < 3; q++) { g.save(); const flip = (b + q) % 2; g.translate(-340 - off + q * 640 + (flip ? 640 : 0), nivel); g.scale(flip ? -1 : 1, 1); g.drawImage(k.causticas, 0, 0, 640, 400); g.restore(); } }
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // las burbujas (algunas, con su brasa de calor dentro)
  const nb = Math.round(PAISAJE.burbujas.length * hierve);
  for (let i = 0; i < nb; i++) {
    const b = PAISAJE.burbujas[i], age = (((t / b.dur + b.ph) % 1) + 1) % 1, y = mez(M.base - 24, nivel + 6, Math.pow(age, 0.8)), x = b.x + 12 * Math.sin(t * 4 + b.ph * 20 + age * 6), r = b.r * (0.55 + 0.7 * age);
    g.strokeStyle = `rgba(235,250,255,${0.7 * (1 - 0.4 * age)})`; g.lineWidth = 2.4; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.stroke();
    g.fillStyle = `rgba(255,255,255,${0.14})`; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
    g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, Math.max(1.2, r * 0.22), 0, 6.2832); g.fill();
    if (brasas > 0.02 && b.em < 0.45) brasa(g, x, y, r * 2.6, brasas * 0.9);
  }
  g.restore();
  // la superficie del agua: ola, espuma y su borde claro
  g.save(); caminoOlla(g, 8); g.clip();
  g.beginPath(); g.moveTo(-330, nivel);
  const amp = 3 + 7 * hierve;
  for (let x = -330; x <= 330; x += 12) g.lineTo(x, nivel + amp * Math.sin(x * 0.035 + t * 9) * Math.sin(x * 0.011 - t * 3.3));
  g.strokeStyle = "rgba(235,252,255,0.85)"; g.lineWidth = 5; g.stroke();
  const ne = Math.round(PAISAJE.espuma.length * hierve);
  for (let i = 0; i < ne; i++) { const e = PAISAJE.espuma[i], pul = 0.6 + 0.4 * Math.sin(t * 8 + e.ph); g.fillStyle = `rgba(245,252,255,${0.55 * pul})`; g.beginPath(); g.ellipse(e.x, nivel + 3 + 3 * Math.sin(t * 5 + e.ph), e.r * pul + 2, e.r * 0.45 * pul + 1, 0, 0, 6.2832); g.fill(); }
  g.restore();

  // ---- la sonda del termómetro
  if (o.sonda > 0.01) {
    g.save(); g.globalAlpha *= o.sonda;
    g.lineCap = "round"; g.strokeStyle = "#7d858f"; g.lineWidth = 12; g.beginPath(); g.moveTo(300, M.borde - 60); g.lineTo(175, M.base - 50); g.stroke();
    g.strokeStyle = "#e9edf2"; g.lineWidth = 4; g.beginPath(); g.moveTo(296, M.borde - 60); g.lineTo(171, M.base - 50); g.stroke();
    g.fillStyle = "#ffcf5a"; g.beginPath(); g.arc(175, M.base - 50, 9, 0, 6.2832); g.fill();
    g.restore();
  }

  // ---- el vapor (dentro y fuera de la olla). Dos formas que se funden cuando cae la tapa (cm de 0 a 1):
  // sin tapa, sube y sale; con tapa, sube hasta ella, se aplasta y se queda dentro.
  const nv = Math.round(PAISAJE.vapor.length * vap);
  for (const modo of [0, 1]) {
    const peso = modo ? cm : 1 - cm;
    if (peso <= 0.003) continue;
    g.save();
    if (modo) { caminoCamara(g); g.clip(); }
    g.globalCompositeOperation = "source-over";
    for (let i = 0; i < nv; i++) {
      const p = PAISAJE.vapor[i], age = (((t / (modo ? p.dur * 0.5 : p.dur) + p.ph) % 1) + 1) % 1, nb = p.calido < 1.0 ? NUBE : NUBE_CALIDA;
      let x, y, s;
      if (modo) {
        const topY = techoTapa(p.x) + 14, e = entra(Math.min(1, age * 1.15)), aplasta = tr(age, 0.7, 1);
        y = mez(nivel - 10, topY, e); x = p.x * mez(1, 1.12, e) + 10 * Math.sin(t * 2 + p.ph * 9); s = p.s * (0.9 + age * 1.1);
        g.globalAlpha = peso * Math.min(1, Math.sin(Math.PI * Math.min(1, age * 1.05)) * 0.9) * 0.5 * (1 - 0.3 * aplasta);
        if (aplasta > 0) g.drawImage(nb, x - s * (1 + aplasta * 0.9), y - s * (1 - 0.35 * aplasta) * 0.7, s * 2 * (1 + aplasta * 0.9), s * 1.4 * (1 - 0.35 * aplasta));
        else g.drawImage(nb, x - s, y - s, s * 2, s * 2);
      } else {
        y = nivel - 20 - age * 1300; x = p.x * (1 - 0.3 * age) + p.dx * age + 22 * Math.sin(t * 2.2 + p.ph * 9 + age * 5); s = p.s * (1.25 + age * 2.2);
        g.globalCompositeOperation = "lighter"; g.globalAlpha = peso * 0.4 * Math.pow(1 - age, 0.9) * Math.min(1, age * 12);
        g.drawImage(nb, x - s, y - s, s * 2, s * 2);
      }
      if (brasas > 0.02 && p.em < 0.5) { g.globalAlpha = 1; brasa(g, x + 6, y, 42 + 12 * age, peso * brasas * Math.min(1, Math.sin(Math.PI * Math.min(1, age)) * 1.6)); }
    }
    g.restore();
  }

  // ---- las monedas que se van con el vapor
  if (o.monedas) {
    const { desde, hasta, n } = o.monedas;
    for (let i = 0; i < Math.min(n, PAISAJE.monedas.length); i++) {
      const c = PAISAJE.monedas[i], t0 = mez(desde, hasta, Math.pow(i / n, 0.85)), u = t - t0;
      if (u < 0 || u > 6) continue;
      const x = c.x + c.vx * u, y = M.borde - 30 - c.vy * u + 120 * u * u;
      moneda(g, x, y, c.r * (0.7 + 0.5 * Math.min(1, u * 2)), c.ph + c.giro * u, Math.min(1, u * 6));
    }
  }

  // ---- el cristal de delante, el aro, la base y las asas
  g.save();
  caminoOlla(g, 0); k.vidrio(g, -M.mitad, M.mitad, 0.55);
  k.reflejo(g, -296, M.borde + 30, 14, 330, 0.28); k.reflejo(g, -268, M.borde + 60, 6, 220, 0.16); k.reflejo(g, 262, M.borde + 50, 10, 300, 0.2);
  g.restore();
  redondo(g, -M.mitad - 12, M.borde - 14, M.mitad * 2 + 24, 22, 10); k.metal(g, -M.mitad, M.mitad);
  redondo(g, -M.mitad - 4, M.base - 18, M.mitad * 2 + 8, 34, 14); k.metal(g, -M.mitad, M.mitad, ["#2a2d32", "#9aa1ab", "#4a4f57", "#c4cad2", "#24272b"]);
  for (const s of [-1, 1]) {
    g.save(); g.scale(s, 1);
    redondo(g, M.mitad - 6, M.borde + 4, 34, 70, 10); k.metal(g, M.mitad - 6, M.mitad + 28);
    const hg = g.createLinearGradient(0, M.borde + 8, 0, M.borde + 66); hg.addColorStop(0, "#3b3f45"); hg.addColorStop(0.3, "#16181b"); hg.addColorStop(1, "#050506");
    redondo(g, M.mitad + 20, M.borde + 10, 128, 52, 24); g.fillStyle = hg; g.fill();
    g.fillStyle = "rgba(255,255,255,0.25)"; redondo(g, M.mitad + 36, M.borde + 16, 92, 8, 4); g.fill();
    g.restore();
  }

  // ---- la llama de delante
  fuego(g, t, lv, true);
  if (lv > 0.2) { g.save(); g.globalCompositeOperation = "lighter"; const pg = g.createRadialGradient(0, M.base + 6, 10, 0, M.base + 6, 360); pg.addColorStop(0, `rgba(255,170,80,${0.1 * Math.min(1.3, lv)})`); pg.addColorStop(1, "rgba(255,150,60,0)"); g.fillStyle = pg; g.fillRect(-360, M.base - 140, 720, 300); g.restore(); }

  // ---- la tapa, y lo que pasa debajo
  if (o.tapaDy !== undefined && o.tapaDy !== null) {
    tapa(g, t, o.tapaDy, o);
    if (cm > 0.5 && o.gotas) gotasTapa(g, t, o);
  }
  if (o.mando !== undefined && o.mando !== null) mando(g, M.mando[0], M.mando[1], o.mando);
}

// Las gotas que se forman bajo la tapa, cuelgan y caen al agua con su brasa dentro.
function gotasTapa(g, t, o) {
  const { t0, cada = 2.4, formar = 0.85, caer = 0.5, n = 11 } = o.gotas, nivel = M.agua;
  for (let j = 0; j < Math.min(n, PAISAJE.gotas.length); j++) {
    const d = PAISAJE.gotas[j], inicio = t0 + d.off * 1.0 + j * 0.06, u = t - inicio;
    if (u < 0) continue;
    const c = u % cada, y0 = techoTapa(d.x) + 4;
    const ciclo = Math.floor(u / cada);
    // cada ciclo cae en un momento distinto para que no caigan todas a la vez
    const retraso = ((j * 7 + ciclo * 3) % 5) * 0.12;
    if (c < formar + retraso) {
      const q = Math.max(0, c / (formar + retraso)), r = d.r * (0.1 + 0.9 * entra(q));
      g.fillStyle = "rgba(120,190,235,0.75)"; g.beginPath(); g.ellipse(d.x, y0 + r * 0.9, r * 0.82, r * 1.15, 0, 0, 6.2832); g.fill();
      g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 3; g.stroke();
      g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.arc(d.x - r * 0.28, y0 + r * 0.5, Math.max(1, r * 0.2), 0, 6.2832); g.fill();
      brasaSolida(g, d.x, y0 + r * 0.95, r * 0.8, 0.95 * q);
    } else {
      const f = c - formar - retraso, y = y0 + d.r * 1.2 + 0.5 * 2300 * f * f;
      if (y < nivel) {
        g.fillStyle = "rgba(120,190,235,0.8)"; g.beginPath(); g.ellipse(d.x, y, d.r * 0.7, d.r * 1.3, 0, 0, 6.2832); g.fill();
        g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 3; g.stroke();
        brasaSolida(g, d.x, y + 2, d.r * 0.85, 0.95);
      } else {
        const s = Math.sqrt(2 * (nivel - y0 - d.r * 1.2) / 2300), q = (f - s) / 0.55;
        if (q < 1) {
          g.save(); g.globalCompositeOperation = "lighter";
          k.brillo(g, d.x, nivel + 22, 150 + 130 * q, "fuego", 0.9 * (1 - q));
          g.strokeStyle = `rgba(255,220,170,${0.85 * (1 - q)})`; g.lineWidth = 4; g.beginPath(); g.ellipse(d.x, nivel + 4, 14 + 90 * q, 5 + 16 * q, 0, 0, 6.2832); g.stroke();
          g.restore();
        }
      }
    }
  }
}

// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.55) {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 150, 0, 640);
  vg.addColorStop(0, `rgba(4,10,16,${al})`); vg.addColorStop(0.6, `rgba(4,10,16,${al * 0.65})`); vg.addColorStop(1, "rgba(4,10,16,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640); g.restore();
}
