// Lo que comparten los planos: la cámara 2D, las monedas, la taza de café, la cafetera, la barra del bar, la cartera,
// las hormigas que se llevan las monedas y el tarro de cristal donde cae lo que ahorras.
import * as k from "#kit";

const { azar, lienzo, mez } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy, ang = 0) { g.setTransform(1, 0, 0, 1, 540, 960); g.rotate(ang); g.scale(Z, Z); g.translate(-cx, -cy); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
export function velo(g, al = 0.5, color = "20,10,5") {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(${color},${al})`); vg.addColorStop(0.6, `rgba(${color},${al * 0.7})`); vg.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.5) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 520, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}
export const ORO = "255,205,80", VERDE = "120,240,140", ROJO = "255,80,70";

// ---------------------------------------------------------------- la moneda de un euro
const monedaImg = (() => {
  const S = 256, l = lienzo(S), c = l.getContext("2d"), R = S / 2 - 4;
  c.translate(S / 2, S / 2);
  let gr = c.createLinearGradient(-R, -R, R, R); gr.addColorStop(0, "#fff2b0"); gr.addColorStop(0.35, "#e2b23c"); gr.addColorStop(0.7, "#a87414"); gr.addColorStop(1, "#ffe08a");
  c.beginPath(); c.arc(0, 0, R, 0, 6.2832); c.fillStyle = gr; c.fill(); c.strokeStyle = "rgba(120,80,10,0.7)"; c.lineWidth = 4; c.stroke();
  gr = c.createLinearGradient(-R, -R, R, R); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.45, "#c6cad2"); gr.addColorStop(0.8, "#868c98"); gr.addColorStop(1, "#e6eaf0");
  c.beginPath(); c.arc(0, 0, R * 0.64, 0, 6.2832); c.fillStyle = gr; c.fill(); c.strokeStyle = "rgba(60,64,72,0.6)"; c.lineWidth = 3; c.stroke();
  c.font = `900 ${R * 0.9}px Figtree`; c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = "rgba(70,74,84,0.55)"; c.fillText("1", 4, 8); c.fillStyle = "#f4f6fa"; c.fillText("1", 0, 2);
  c.fillStyle = "rgba(255,255,255,0.5)"; c.beginPath(); c.ellipse(-R * 0.35, -R * 0.45, R * 0.3, R * 0.12, -0.6, 0, 6.2832); c.fill();
  return l;
})();
export function moneda(g, x, y, r, gira = 0, al = 1, ang = 0) {
  if (al <= 0.01 || r < 1) return;
  const sx = Math.cos(gira * 6.2832);
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  if (Math.abs(sx) < 0.98) { g.fillStyle = "#9a6c14"; g.beginPath(); g.ellipse(r * 0.08 * Math.sign(sx || 1), 0, Math.max(2, Math.abs(sx) * r), r, 0, 0, 6.2832); g.fill(); }
  g.scale(Math.max(0.04, Math.abs(sx)), 1);
  g.drawImage(monedaImg, -r, -r, r * 2, r * 2);
  g.restore();
}
// una moneda tumbada (vista desde un lado de la mesa), para pilas y montones
export function monedaTumbada(g, x, y, r, al = 1) {
  g.save(); g.globalAlpha *= al; g.translate(x, y);
  g.fillStyle = "#8a5e10"; g.beginPath(); g.ellipse(0, 6, r, r * 0.32, 0, 0, 6.2832); g.fill();
  g.scale(1, 0.32); g.drawImage(monedaImg, -r, -r, r * 2, r * 2); g.restore();
}

// ---------------------------------------------------------------- la barra del bar
const vetas = k.ruido(512, 41, 3, 3, "lineas");
const BOKEH = (() => { const az = azar(7), l = []; for (let i = 0; i < 26; i++) l.push({ x: az() * 1080, y: az() * 1100, r: 40 + az() * 120, c: ["255,170,80", "255,210,140", "255,120,90", "120,200,255"][i % 4], f: az() * 6 }); return l; })();
export function bar(g, t, yBarra = 0) {
  // la pared del fondo, con las botellas desenfocadas (en pantalla)
  g.save(); sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#2a1408"); bg.addColorStop(0.6, "#5a2c12"); bg.addColorStop(1, "#1a0c06");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) { const a = 0.18 + 0.05 * Math.sin(t + b.f); const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${b.c},${a})`); gr.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.2832); g.fill(); }
  g.restore();
}
// la madera de la barra, en el mundo, de y0 hacia abajo
export function barra(g, y0, ancho = 3000) {
  const sg = g.createLinearGradient(0, y0, 0, y0 + 900); sg.addColorStop(0, "#b8743c"); sg.addColorStop(0.05, "#8a4e22"); sg.addColorStop(1, "#2a1206");
  g.fillStyle = sg; g.fillRect(-ancho / 2, y0, ancho, 1400);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(vetas, -ancho / 2, y0, ancho, 1400); g.restore();
  g.fillStyle = "rgba(255,220,170,0.4)"; g.fillRect(-ancho / 2, y0, ancho, 5);
}

// ---------------------------------------------------------------- la taza de café
// De lado, con el plato; la base del plato en (0, 0); unos 300 px de ancho. lleno: de 0 a 1 el café dentro.
export function taza(g, t, { lleno = 1, al = 1, humo = 0 } = {}) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  // el plato
  g.beginPath(); g.ellipse(0, -8, 230, 40, 0, 0, 6.2832); let gr = g.createLinearGradient(0, -48, 0, 32); gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#b9bcc4"); g.fillStyle = gr; g.fill();
  g.beginPath(); g.ellipse(0, -14, 150, 22, 0, 0, 6.2832); g.fillStyle = "rgba(160,160,170,0.5)"; g.fill();
  // el asa
  g.lineWidth = 26; g.strokeStyle = "#e8eaee"; g.beginPath(); g.ellipse(150, -120, 55, 60, 0, -1.4, 1.4); g.stroke();
  g.lineWidth = 8; g.strokeStyle = "rgba(150,150,160,0.6)"; g.beginPath(); g.ellipse(150, -120, 55, 60, 0, -1.2, 1.2); g.stroke();
  // el cuerpo
  g.beginPath(); g.moveTo(-150, -230); g.bezierCurveTo(-150, -90, -110, -30, 0, -26); g.bezierCurveTo(110, -30, 150, -90, 150, -230); g.closePath();
  gr = g.createLinearGradient(-150, 0, 150, 0); gr.addColorStop(0, "#c4c8d0"); gr.addColorStop(0.3, "#ffffff"); gr.addColorStop(0.75, "#f0f2f6"); gr.addColorStop(1, "#a8acb6");
  g.fillStyle = gr; g.fill();
  // la boca y el café
  g.beginPath(); g.ellipse(0, -230, 150, 34, 0, 0, 6.2832); g.fillStyle = "#e4e6ec"; g.fill();
  if (lleno > 0.01) {
    g.beginPath(); g.ellipse(0, -230 + (1 - lleno) * 30, 136 * (0.85 + 0.15 * lleno), 28, 0, 0, 6.2832);
    gr = g.createRadialGradient(-20, -236, 5, 0, -230, 140); gr.addColorStop(0, "#d8a060"); gr.addColorStop(0.5, "#8a4a1c"); gr.addColorStop(1, "#3a1a08"); g.fillStyle = gr; g.fill();
  }
  g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.ellipse(-100, -150, 14, 60, 0.1, 0, 6.2832); g.fill();
  // el humo
  if (humo > 0.01) {
    g.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      g.strokeStyle = `rgba(255,255,255,${0.3 * humo})`; g.lineWidth = 16;
      g.beginPath(); for (let j = 0; j <= 10; j++) { const y = -270 - j * 26, x = -50 + i * 50 + Math.sin(j * 0.8 + t * 2 + i) * 18; j ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- la cafetera
// El grupo de la cafetera visto de frente, con el portafiltro y sus dos caños; los caños acaban en (±28, 0).
export function cafetera(g) {
  k.redondo(g, -420, -620, 840, 380, 30); k.metal(g, -420, 420, ["#5e646e", "#eef1f5", "#9aa2ae", "#ffffff", "#4e545e"]);
  k.redondo(g, -150, -250, 300, 120, 30); k.metal(g, -150, 150, ["#4a4f58", "#dfe3ea", "#8a929e", "#f6f8fb", "#3e434c"]);
  // el portafiltro con su mango negro
  k.redondo(g, -130, -150, 260, 90, 24); k.metal(g, -130, 130, ["#555b64", "#e8ebf0", "#949ca8", "#ffffff", "#444a52"]);
  k.redondo(g, 120, -130, 380, 50, 25); g.fillStyle = "#14161a"; g.fill(); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(140, -124, 340, 8);
  for (const x of [-28, 28]) { k.redondo(g, x - 14, -65, 28, 65, 8); k.metal(g, x - 14, x + 14); }
}

// ---------------------------------------------------------------- la cartera
// Abierta sobre la mesa, vista un poco desde arriba; centro en (0, 0), unos 700 px de ancho.
export function cartera(g, { billetes = 1 } = {}) {
  g.save(); g.globalAlpha *= 0.4; g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, 200, 400, 60, 0, 0, 6.2832); g.fill(); g.restore();
  for (const s of [-1, 1]) {
    g.save(); g.scale(s, 1);
    g.beginPath(); g.moveTo(0, -150); g.lineTo(340, -170); g.quadraticCurveTo(370, -168, 370, -140); g.lineTo(360, 160); g.quadraticCurveTo(358, 185, 330, 185); g.lineTo(0, 190); g.closePath();
    const gr = g.createLinearGradient(0, -170, 0, 190); gr.addColorStop(0, "#a0582a"); gr.addColorStop(1, "#5a2a10"); g.fillStyle = gr; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, 0, -200, 400, 400); g.restore();
    g.setLineDash([10, 8]); g.strokeStyle = "rgba(255,210,160,0.55)"; g.lineWidth = 3; g.stroke(); g.setLineDash([]);
    // los bolsillos
    for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(40, -40 + i * 60); g.lineTo(330, -50 + i * 60); g.strokeStyle = "rgba(40,15,5,0.6)"; g.lineWidth = 5; g.stroke(); }
    g.restore();
  }
  // los billetes asomando
  if (billetes > 0.01) {
    g.save(); g.globalAlpha *= billetes;
    for (let i = 0; i < 2; i++) { k.redondo(g, -320 + i * 30, -230 - i * 10, 280, 120, 8); g.fillStyle = i ? "#7ac2e8" : "#f2a65a"; g.fill(); g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 3; g.stroke(); }
    g.restore();
  }
  g.fillStyle = "#3a1808"; g.fillRect(-12, -160, 24, 350);
}

// ---------------------------------------------------------------- la hormiga
// De lado, mirando a la derecha; centro en (0, 0), unos 150 px de largo con escala 1. paso: la fase de las patas.
// carga: una función (g) que dibuja lo que lleva encima (en (0, -70)).
export function hormiga(g, x, y, s, paso, carga = null, dir = 1) {
  g.save(); g.translate(x, y); g.scale(s * dir, s);
  g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#140806"; g.lineWidth = 6;
  const A = g.globalAlpha;
  for (let i = 0; i < 3; i++) for (const lado of [0, 1]) {
    const f = paso + i * 2.1 + lado * Math.PI, bx = -10 + i * 18, dx = Math.sin(f) * 22, dy = Math.max(0, Math.cos(f)) * -10;
    g.globalAlpha = A * (lado ? 0.6 : 1);
    g.beginPath(); g.moveTo(bx, 0); g.lineTo(bx + (i - 1) * 22 + dx * 0.5, -26 + dy); g.lineTo(bx + (i - 1) * 40 + dx, 38 + dy); g.stroke();
  }
  g.globalAlpha = A;
  for (const [cx, cy, rx, ry] of [[-60, 4, 42, 30], [0, 0, 24, 16], [46, -6, 24, 21]]) {
    g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 6.2832);
    const gr = g.createRadialGradient(cx - rx * 0.3, cy - ry * 0.4, 2, cx, cy, rx); gr.addColorStop(0, "#7a4a3a"); gr.addColorStop(0.4, "#2a120c"); gr.addColorStop(1, "#080303"); g.fillStyle = gr; g.fill();
  }
  // las antenas y las mandíbulas
  g.lineWidth = 4; g.beginPath(); g.moveTo(58, -20); g.quadraticCurveTo(80, -60, 98, -46); g.stroke(); g.beginPath(); g.moveTo(54, -22); g.quadraticCurveTo(66, -66, 86, -60); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.arc(54, -12, 4, 0, 6.2832); g.fill();
  if (carga) { g.save(); g.translate(30, -70); g.scale(dir, 1); carga(g); g.restore(); }
  g.restore();
}

// ---------------------------------------------------------------- el tarro de cristal
// De pie, con la base en (0, 0); 420 px de ancho por 560 de alto. lleno: de 0 a 1 (monedas dentro).
const MONTON = (() => { const az = azar(91), l = []; for (let i = 0; i < 160; i++) l.push({ x: (az() - 0.5) * 340, y: az(), r: 28 + az() * 10, b: az() < 0.12 }); return l.sort((a, b) => b.y - a.y); })();
export function tarro(g, t, lleno = 0, { brillo = 0 } = {}) {
  const w = 420, h = 560;
  // la sombra
  g.save(); g.globalAlpha *= 0.4; g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, 4, w * 0.6, 34, 0, 0, 6.2832); g.fill(); g.restore();
  // las monedas dentro: se apilan desde abajo
  g.save(); k.redondo(g, -w / 2 + 14, -h + 70, w - 28, h - 80, 60); g.clip();
  const alto = (h - 100) * lleno;
  for (const m of MONTON) { const y = -20 - m.y * alto; if (m.y > lleno * 1.02 + 0.02 && lleno < 1) continue; if (m.b) { g.save(); g.translate(m.x, y); g.rotate(m.x * 0.01); k.redondo(g, -60, -24, 120, 48, 6); g.fillStyle = "#7ac2e8"; g.fill(); g.restore(); } else monedaTumbada(g, m.x, y, m.r); }
  if (brillo > 0.01) k.brillo(g, 0, -alto / 2, 700, ORO, 0.6 * brillo);
  g.restore();
  // el cristal
  k.redondo(g, -w / 2, -h + 60, w, h - 60, 70);
  g.fillStyle = "rgba(190,230,255,0.12)"; g.fill(); g.lineWidth = 6; g.strokeStyle = "rgba(220,240,255,0.7)"; g.stroke();
  k.reflejo(g, -w / 2 + 40, -h + 110, 30, h - 200, 0.45); k.reflejo(g, w / 2 - 70, -h + 140, 14, h - 260, 0.25);
  // el cuello y la tapa de rosca
  k.redondo(g, -w / 2 + 30, -h + 20, w - 60, 50, 14); g.fillStyle = "rgba(220,240,255,0.25)"; g.fill(); g.strokeStyle = "rgba(220,240,255,0.6)"; g.lineWidth = 4; g.stroke();
}

// ---------------------------------------------------------------- el billete
// Un billete de euro de valor n (50: naranja; 20: azul; 10: rojo), centrado en (0, 0), de 360 × 190.
const COLB = { 50: ["#ffb35a", "#d9702a"], 20: ["#7ab8f0", "#3a6ab8"], 10: ["#ff8a7a", "#c84a3a"] };
export function billete(g, n = 50, al = 1) {
  if (al <= 0.01) return;
  const [c0, c1] = COLB[n] || COLB[50];
  g.save(); g.globalAlpha *= al;
  g.save(); g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 20; g.shadowOffsetY = 10; k.redondo(g, -180, -95, 360, 190, 12); g.fillStyle = c1; g.fill(); g.restore();
  k.redondo(g, -180, -95, 360, 190, 12); const gr = g.createLinearGradient(-180, -95, 180, 95); gr.addColorStop(0, c0); gr.addColorStop(0.6, k.mezColor(c0, "#ffffff", 0.25)); gr.addColorStop(1, c1); g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 3; k.redondo(g, -168, -83, 336, 166, 8); g.stroke();
  // el arco y las estrellas
  g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = 8; g.beginPath(); g.arc(30, 60, 80, Math.PI, 0); g.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.2832; g.fillStyle = "rgba(255,240,120,0.9)"; g.beginPath(); g.arc(-110 + Math.cos(a) * 34, -30 + Math.sin(a) * 34, 4, 0, 6.2832); g.fill(); }
  g.font = "900 84px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(0,0,0,0.25)"; g.fillText(`${n}`, 112, -32); g.fillStyle = "#ffffff"; g.fillText(`${n}`, 108, -36);
  g.font = "800 30px Figtree"; g.fillText("EURO", -110, 55);
  g.restore();
}
