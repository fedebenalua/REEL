// Lo que comparten los planos: la cámara de mundo, los metales, la gota, las herramientas y el velo del subtítulo.
// Todo se dibuja en «unidades de mundo» (px a escala 1) y la cámara {x, y, s} lo lleva a la pantalla.
import * as k from "#kit";

const { mez, suave: su, tramo: tr, azar } = k;
export const W = 1080, H = 1920;

// ---------------------------------------------------------------- la cámara
export const camara = (g, c) => { g.translate(540, 960); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
export const mezCam = (a, b, u) => ({ x: mez(a.x, b.x, u), y: mez(a.y, b.y, u), s: Math.exp(mez(Math.log(a.s), Math.log(b.s), u)) });
// pasa por varias cámaras: lista de [t, cam]; entre dos, se mezcla suave
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, su(tr(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}
export const aPant = (c, x, y) => [540 + (x - c.x) * c.s, 960 + (y - c.y) * c.s];

// ---------------------------------------------------------------- materiales
export const CROMO = [[0, "#37424d"], [0.1, "#7f8e9c"], [0.28, "#f7fafc"], [0.42, "#b9c5d0"], [0.6, "#5e6f7e"], [0.78, "#e3eaf0"], [1, "#3c4752"]];
export const LATON = [[0, "#5e3a0a"], [0.18, "#c8962f"], [0.38, "#fde9a0"], [0.58, "#d19a2a"], [0.82, "#8a5a14"], [1, "#573608"]];
export const ACERO = [[0, "#444c54"], [0.22, "#b4bcc4"], [0.42, "#f4f7f9"], [0.66, "#8a949c"], [1, "#40484f"]];
export const PORCELANA = [[0, "#bfd0dc"], [0.3, "#ffffff"], [0.7, "#e4edf3"], [1, "#a9bccb"]];
export function gradH(g, x0, x1, stops) { const gr = g.createLinearGradient(x0, 0, x1, 0); for (const [o, c] of stops) gr.addColorStop(o, c); return gr; }
export function gradV(g, y0, y1, stops) { const gr = g.createLinearGradient(0, y0, 0, y1); for (const [o, c] of stops) gr.addColorStop(o, c); return gr; }
// un cilindro vertical con su degradado de luz
export function cilV(g, x, y0, y1, w, stops = CROMO) { g.fillStyle = gradH(g, x - w / 2, x + w / 2, stops); g.fillRect(x - w / 2, y0, w, y1 - y0); }
export function cilH(g, x0, x1, y, h, stops = CROMO) { g.fillStyle = gradV(g, y - h / 2, y + h / 2, stops); g.fillRect(x0, y - h / 2, x1 - x0, h); }
// un tubo que sigue una línea quebrada, con luz arriba a la izquierda
export function tubo(g, pts, w, cols = ["#3d4853", "#a4b2bf", "#f6fafc"]) {
  const trazo = (ancho, color, dx = 0, dy = 0) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x + dx, y + dy) : g.moveTo(x + dx, y + dy))); g.strokeStyle = color; g.lineWidth = ancho; g.stroke(); };
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  trazo(w, cols[0]); trazo(w * 0.88, cols[1], -w * 0.03, -w * 0.03); trazo(w * 0.5, "#dfe8ef", -w * 0.13, -w * 0.13);
  trazo(w * 0.17, cols[2], -w * 0.17, -w * 0.17); trazo(w * 0.1, "rgba(255,190,120,0.45)", w * 0.3, w * 0.3);
  g.restore();
}
export const ruedo = (g, x, y, w, h, r, stops = CROMO) => { g.beginPath(); k.redondo(g, x, y, w, h, r); g.fillStyle = gradH(g, x, x + w, stops); g.fill(); };
export const hex = (a, s) => `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})`;

// ---------------------------------------------------------------- el agua
export function gota(g, x, y, r, al = 1, estira = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(1, estira);
  const cam = () => { g.beginPath(); g.moveTo(0, -r * 1.9); g.bezierCurveTo(r * 0.25, -r * 1.05, r * 1.02, -r * 0.35, r, r * 0.3); g.bezierCurveTo(r * 0.98, r * 0.95, r * 0.5, r * 1.25, 0, r * 1.25); g.bezierCurveTo(-r * 0.5, r * 1.25, -r * 0.98, r * 0.95, -r, r * 0.3); g.bezierCurveTo(-r * 1.02, -r * 0.35, -r * 0.25, -r * 1.05, 0, -r * 1.9); g.closePath(); };
  cam();
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.1, r * 0.1, 0, r * 0.2, r * 1.3);
  gr.addColorStop(0, "rgba(190,240,255,0.95)"); gr.addColorStop(0.55, "rgba(70,184,240,0.92)"); gr.addColorStop(1, "rgba(14,98,214,0.95)");
  g.fillStyle = gr; g.fill();
  g.save(); cam(); g.clip();
  const sg = g.createLinearGradient(0, r * 0.2, 0, r * 1.3); sg.addColorStop(0, "rgba(0,60,170,0)"); sg.addColorStop(1, "rgba(0,50,150,0.5)");
  g.fillStyle = sg; g.fillRect(-r * 1.2, 0, r * 2.4, r * 1.5);
  g.restore();
  g.strokeStyle = "rgba(220,248,255,0.85)"; g.lineWidth = Math.max(1.2, r * 0.07); cam(); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.ellipse(-r * 0.4, -r * 0.1, r * 0.17, r * 0.5, 0.35, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.arc(r * 0.42, r * 0.7, r * 0.13, 0, 6.2832); g.fill();
  g.restore();
}
// una salpicadura en (x, y) (la superficie del agua): u segundos desde el golpe
export function salpica(g, x, y, u, esc = 1, semilla = 5, rmax = 260) {
  if (u < 0 || u > 1.3) return;
  const az = azar(semilla), n = 9;
  // el anillo en la superficie
  for (let j = 0; j < 2; j++) {
    const uj = u - j * 0.14; if (uj < 0) continue;
    const rr = (30 + (rmax - 30) * k.entra(Math.min(1, uj / 1.0))) * (rmax < 200 ? 1 : esc);
    g.strokeStyle = `rgba(210,244,255,${0.75 * Math.max(0, 1 - uj / 1.0)})`; g.lineWidth = 5 * esc;
    g.beginPath(); g.ellipse(x, y, rr, rr * 0.18, 0, 0, 6.2832); g.stroke();
  }
  // las gotitas
  for (let i = 0; i < n; i++) {
    const a = (i / (n - 1)) * 2 - 1 + (az() - 0.5) * 0.3, vx = a * 220 * esc, vy = -(520 + az() * 260) * esc * (1 - Math.abs(a) * 0.35);
    const px = x + vx * u, py = y + vy * u + 1500 * esc * u * u;
    if (py > y + 4) continue;
    gota(g, px, py, (7 + az() * 6) * esc, Math.max(0, 1 - u * 0.9), 1);
  }
  // la corona
  const c = Math.max(0, 1 - u * 3.2);
  if (c > 0) { g.fillStyle = `rgba(190,238,255,${0.6 * c})`; g.beginPath(); g.ellipse(x, y - 24 * esc * c, 30 * esc * (1 + u * 3), 40 * esc * c, 0, 0, 6.2832); g.fill(); }
}
// un chorro de agua vertical de x, de y0 a y1, con su ancho w; fluye hacia abajo
export function chorro(g, t, x, y0, y1, w, al = 1) {
  if (al <= 0.01 || w < 1) return;
  g.save(); g.globalAlpha *= al;
  const gr = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  gr.addColorStop(0, "rgba(40,150,230,0.9)"); gr.addColorStop(0.3, "rgba(190,240,255,0.95)"); gr.addColorStop(0.62, "rgba(80,184,244,0.92)"); gr.addColorStop(1, "rgba(20,100,210,0.92)");
  g.fillStyle = gr; g.beginPath(); g.moveTo(x - w / 2, y0); g.lineTo(x + w / 2, y0); g.lineTo(x + w * 0.38, y1); g.lineTo(x - w * 0.38, y1); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = Math.max(2, w * 0.07);
  for (let i = 0; i < 4; i++) { const f = (t * 2.6 + i * 0.27) % 1; const yy = y0 + (y1 - y0) * f; g.beginPath(); g.moveTo(x - w * 0.18, yy); g.lineTo(x - w * 0.14, yy + (y1 - y0) * 0.16); g.stroke(); }
  g.restore();
}

// ---------------------------------------------------------------- herramientas
// el destornillador de punta en (x, y), con la punta hacia abajo (ang = 0) y su mango arriba
export function destornillador(g, x, y, ang = 0, esc = 1, gira = 0) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(esc, esc);
  // el eje
  g.fillStyle = gradH(g, -9, 9, ACERO); g.fillRect(-9, -330, 18, 330);
  g.beginPath(); g.moveTo(-9, -4); g.lineTo(-5, 0); g.lineTo(5, 0); g.lineTo(9, -4); g.closePath(); g.fillStyle = "#cfd6dc"; g.fill();
  // el mango, de plástico naranja con estrías
  const mango = () => { g.beginPath(); k.redondo(g, -48, -640, 96, 330, 38); };
  mango(); g.fillStyle = gradH(g, -48, 48, [[0, "#a43a0a"], [0.25, "#ff9a3c"], [0.45, "#ffd08a"], [0.7, "#ee6a12"], [1, "#8e2f08"]]); g.fill();
  g.save(); mango(); g.clip();
  g.fillStyle = "rgba(90,25,0,0.35)";
  for (let i = 0; i < 7; i++) { const yy = -620 + i * 46 + ((gira * 46) % 46); g.fillRect(-48, yy, 96, 8); }
  g.restore();
  g.fillStyle = gradH(g, -30, 30, ACERO); g.fillRect(-30, -330, 60, 28);
  g.restore();
}
// una llave inglesa de perfil: el agarre en (x, y) y el mango hacia la derecha; ext: cuánto se ve (0..1, el giro)
export function llave(g, x, y, ext = 1, esc = 1, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(esc, esc);
  const L = 820 * Math.max(0.2, ext);
  const cabeza = () => { g.beginPath(); k.redondo(g, -150, -70, 300, 140, 34); };
  // el mango, estrecho
  g.beginPath(); g.moveTo(120, -34); g.lineTo(120 + L, -24); g.quadraticCurveTo(140 + L, 0, 120 + L, 24); g.lineTo(120, 34); g.closePath();
  g.fillStyle = gradV(g, -40, 40, [[0, "#e6edf2"], [0.35, "#fafcfd"], [0.6, "#9eaab4"], [1, "#4d5963"]]); g.fill();
  g.strokeStyle = "rgba(30,40,50,0.6)"; g.lineWidth = 4; g.stroke();
  g.fillStyle = "#1b2128"; g.beginPath(); g.arc(120 + L - 40, 0, 17, 0, 6.2832); g.fill();
  // la cabeza
  cabeza(); g.fillStyle = gradV(g, -70, 70, [[0, "#f3f7fa"], [0.4, "#c7d1da"], [0.75, "#87939e"], [1, "#444f59"]]); g.fill();
  g.strokeStyle = "rgba(30,40,50,0.7)"; g.lineWidth = 5; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.fillRect(-120, -56, 190, 8);
  g.restore();
}

// ---------------------------------------------------------------- el velo del subtítulo (y 318 a 482)
export function velo(g, a = 0.34) {
  const gr = g.createLinearGradient(0, 200, 0, 640);
  gr.addColorStop(0, "rgba(4,16,24,0)"); gr.addColorStop(0.3, `rgba(4,16,24,${a})`); gr.addColorStop(0.65, `rgba(4,16,24,${a * 0.8})`); gr.addColorStop(1, "rgba(4,16,24,0)");
  g.fillStyle = gr; g.fillRect(0, 200, W, 440);
}
export function viñeta(g, a = 0.5) {
  const gr = g.createRadialGradient(540, 960, 520, 540, 960, 1250);
  gr.addColorStop(0, "rgba(0,8,16,0)"); gr.addColorStop(1, `rgba(0,8,16,${a})`);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

// ---------------------------------------------------------------- el azulejo
const AZUL = azar(77);
const baldosas = (() => {
  const l = k.lienzo(512, 512), c = l.getContext("2d");
  c.fillStyle = "#dfeee9"; c.fillRect(0, 0, 512, 512);
  const bw = 128, bh = 64;
  for (let r = 0; r < 8; r++) for (let i = -1; i < 5; i++) {
    const x = i * bw + (r % 2 ? bw / 2 : 0), y = r * bh, v = AZUL() * 0.25;
    const gr = c.createLinearGradient(x, y, x, y + bh);
    gr.addColorStop(0, `rgb(${150 + v * 40 | 0},${226 + v * 10 | 0},${214})`); gr.addColorStop(0.55, `rgb(${84 + v * 30 | 0},${196 + v * 12 | 0},${190})`); gr.addColorStop(1, "rgb(52,150,152)");
    c.fillStyle = gr; c.fillRect(x + 3, y + 3, bw - 6, bh - 6);
    c.fillStyle = "rgba(255,255,255,0.42)"; c.fillRect(x + 3, y + 3, bw - 6, 5);
    c.fillStyle = "rgba(255,255,255,0.18)"; c.fillRect(x + 3, y + 8, 14, bh - 14);
  }
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.25; c.drawImage(k.manchas, 0, 0, 512, 512);
  return l;
})();
export function pared(g, x0, y0, x1, y1) {
  g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip();
  g.fillStyle = g.createPattern(baldosas, "repeat"); g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.restore();
}
