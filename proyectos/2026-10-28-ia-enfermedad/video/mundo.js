// Lo que comparten los planos: el germen de la pregunta, las moléculas de la pantalla, la cocina,
// la gente, el laboratorio y la máquina que revisa el pedido. Siempre la misma cosa.
import * as k from "#kit";

const { azar, lienzo, redondo } = k;

export function vista(g, Z, cx, cy) {
  g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
}
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);

export function fondo(g, tinte = "90,30,120") {
  g.save();
  sinVista(g);
  g.fillStyle = "#07040f";
  g.fillRect(0, 0, 1080, 1920);
  const bg = g.createRadialGradient(540, 980, 80, 540, 1000, 1280);
  bg.addColorStop(0, `rgba(${tinte},0.55)`);
  bg.addColorStop(0.55, `rgba(${tinte},0.16)`);
  bg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.07;
  g.drawImage(k.manchas, -180, -80, 1500, 2200);
  g.restore();
}

export function velo(g, al = 0.78) {
  if (al <= 0.01) return;
  g.save();
  sinVista(g);
  const vg = g.createLinearGradient(0, 140, 0, 760);
  vg.addColorStop(0, `rgba(6,3,12,${al})`);
  vg.addColorStop(0.55, `rgba(6,3,12,${al * 0.72})`);
  vg.addColorStop(1, "rgba(6,3,12,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 780);
  g.restore();
}

export function vineta(g, al = 0.55) {
  g.save();
  sinVista(g);
  const vg = g.createRadialGradient(540, 980, 480, 540, 980, 1280);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

// ---------------------------------------------------------------- el germen (la pregunta, enorme)
const G = 1100;
const germenImg = lienzo(G, G);
{
  const g = germenImg.getContext("2d");
  const c = G / 2;
  const az = azar(6);
  g.clearRect(0, 0, G, G);
  for (let i = 0; i < 42; i++) {
    const a = (i / 42) * Math.PI * 2;
    const largo = 210 + az() * 150;
    const ancho = 22 + az() * 26;
    const base = 250;
    g.save();
    g.translate(c, c);
    g.rotate(a);
    const gr = g.createLinearGradient(base - 20, 0, base + largo, 0);
    const caliente = i % 3 === 0;
    gr.addColorStop(0, caliente ? "rgba(255,210,80,0.95)" : "rgba(255,60,130,0.95)");
    gr.addColorStop(0.35, "rgba(190,40,255,0.7)");
    gr.addColorStop(1, "rgba(90,230,255,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(base - 10, -ancho * 0.28);
    g.quadraticCurveTo(base + largo * 0.45, -ancho, base + largo, 0);
    g.quadraticCurveTo(base + largo * 0.45, ancho, base - 10, ancho * 0.28);
    g.closePath();
    g.fill();
    g.restore();
  }
  const rg = g.createRadialGradient(c - 80, c - 100, 30, c + 20, c + 10, 280);
  rg.addColorStop(0, "#fff4fb");
  rg.addColorStop(0.18, "#ff5d98");
  rg.addColorStop(0.5, "#c026ff");
  rg.addColorStop(0.82, "#5a14a8");
  rg.addColorStop(1, "#1a0630");
  g.beginPath();
  g.arc(c, c, 268, 0, 7);
  g.fillStyle = rg;
  g.fill();
  g.save();
  g.beginPath();
  g.arc(c, c, 268, 0, 7);
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.4;
  g.drawImage(k.manchas, c - 320, c - 320, 640, 640);
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.28;
  g.drawImage(k.causticas, c - 300, c - 300, 600, 600);
  g.restore();
  const az2 = azar(19);
  g.save();
  g.beginPath();
  g.arc(c, c, 268, 0, 7);
  g.clip();
  for (let i = 0; i < 16; i++) {
    const a = az2() * 6.2832;
    const rr = 30 + az2() * 190;
    const x = c + Math.cos(a) * rr;
    const y = c + Math.sin(a) * rr * 0.92;
    const rad = 22 + az2() * 28;
    const bg = g.createRadialGradient(x - 8, y - 10, 2, x, y, rad);
    bg.addColorStop(0, "rgba(255,255,255,0.7)");
    bg.addColorStop(0.45, "rgba(255,140,190,0.28)");
    bg.addColorStop(1, "rgba(40,0,50,0)");
    g.fillStyle = bg;
    g.beginPath();
    g.arc(x, y, rad, 0, 7);
    g.fill();
  }
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.42)";
  g.beginPath();
  g.ellipse(c - 90, c - 100, 86, 40, -0.7, 0, 7);
  g.fill();
  g.globalCompositeOperation = "destination-over";
  const halo = g.createRadialGradient(c, c, 200, c, c, 540);
  halo.addColorStop(0, "rgba(255,60,160,0.35)");
  halo.addColorStop(1, "rgba(255,60,160,0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, G, G);
}
export function germen(g, x, y, r, ang = 0, al = 1, aplasta = 1) {
  if (al <= 0.01 || r < 2) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.rotate(ang);
  g.scale(1, aplasta);
  g.drawImage(germenImg, -r, -r, r * 2, r * 2);
  g.restore();
}

// ---------------------------------------------------------------- moléculas (bolitas con volumen)
function bola(centro, borde) {
  const c = lienzo(160, 160);
  const g = c.getContext("2d");
  const rg = g.createRadialGradient(58, 52, 6, 80, 82, 74);
  rg.addColorStop(0, "#ffffff");
  rg.addColorStop(0.16, centro);
  rg.addColorStop(0.72, borde);
  rg.addColorStop(1, "#14060c");
  g.fillStyle = rg;
  g.beginPath();
  g.arc(80, 80, 72, 0, 7);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.72)";
  g.beginPath();
  g.ellipse(58, 54, 22, 12, -0.6, 0, 7);
  g.fill();
  return c;
}
const BOLAS = {
  oro: bola("#ffe28a", "#e09010"),
  roja: bola("#ff6a8a", "#9a1030"),
  verde: bola("#b6ff8a", "#1e9a48"),
  azul: bola("#9ad8ff", "#2060d0"),
};
export function molecula(g, x, y, r, tipo, al = 1) {
  if (al <= 0.01 || r < 1) return;
  const img = BOLAS[tipo] || BOLAS.oro;
  g.save();
  g.globalAlpha *= al;
  g.drawImage(img, x - r, y - r, r * 2, r * 2);
  g.restore();
}

// Una cápsula de medicina, de lado.
export function capsula(g, x, y, w, ang, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.rotate(ang);
  const h = w * 0.38;
  redondo(g, -w / 2, -h / 2, w, h, h / 2);
  const gr = g.createLinearGradient(0, -h / 2, 0, h / 2);
  gr.addColorStop(0, "#fff");
  gr.addColorStop(0.45, "#f4f7ff");
  gr.addColorStop(1, "#c5d0e4");
  g.fillStyle = gr;
  g.fill();
  g.save();
  g.beginPath();
  g.rect(0, -h / 2, w / 2, h);
  g.clip();
  g.fillStyle = "#19c37d";
  g.fillRect(0, -h / 2, w / 2, h);
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.55)";
  redondo(g, -w * 0.32, -h * 0.32, w * 0.28, h * 0.22, 8);
  g.fill();
  g.restore();
}

// ---------------------------------------------------------------- la pantalla del ordenador
// El cristal interior va de (x, y) con ancho w y alto h. El bisel sobresale.
export function pantalla(g, x, y, w, h, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  const b = 34;
  const gr = g.createLinearGradient(x - b, y, x + w + b, y + h);
  gr.addColorStop(0, "#3a4158");
  gr.addColorStop(0.4, "#141824");
  gr.addColorStop(1, "#070910");
  redondo(g, x - b, y - b, w + b * 2, h + b * 2 + 18, 36);
  g.fillStyle = gr;
  g.fill();
  g.fillStyle = "#05060c";
  g.fillRect(x, y, w, h);
  // pie
  g.fillStyle = "#1c2233";
  redondo(g, x + w * 0.38, y + h + b + 8, w * 0.24, 28, 8);
  g.fill();
  g.fillRect(x + w * 0.46, y + h + b - 4, w * 0.08, 22);
  // reflejo del cristal, encima del contenido: lo pinta quien llama, después
  g.restore();
}
export function cristal(g, x, y, w, h, al = 0.45) {
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.rect(x, y, w, h);
  g.clip();
  const rg = g.createLinearGradient(x, y, x + w * 0.8, y + h);
  rg.addColorStop(0, "rgba(255,255,255,0.2)");
  rg.addColorStop(0.22, "rgba(255,255,255,0.03)");
  rg.addColorStop(1, "rgba(180,220,255,0.05)");
  g.fillStyle = rg;
  g.fillRect(x, y, w, h);
  g.restore();
}

// Un vial vacío de verdad: se ve el fondo a través.
export function vial(g, x, y, h, al = 1, lleno = 0) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  const w = h * 0.36;
  g.beginPath();
  g.moveTo(-w * 0.22, -h * 0.5);
  g.lineTo(-w * 0.22, -h * 0.28);
  g.quadraticCurveTo(-w * 0.55, -h * 0.22, -w * 0.5, -h * 0.05);
  g.lineTo(-w * 0.5, h * 0.32);
  g.quadraticCurveTo(-w * 0.5, h * 0.5, 0, h * 0.5);
  g.quadraticCurveTo(w * 0.5, h * 0.5, w * 0.5, h * 0.32);
  g.lineTo(w * 0.5, -h * 0.05);
  g.quadraticCurveTo(w * 0.55, -h * 0.22, w * 0.22, -h * 0.28);
  g.lineTo(w * 0.22, -h * 0.5);
  g.closePath();
  if (lleno > 0.02) {
    g.save();
    g.clip();
    g.fillStyle = `rgba(255,50,80,${0.85 * lleno})`;
    g.fillRect(-w, h * 0.5 - h * 0.7 * lleno, w * 2, h);
    g.restore();
  }
  k.vidrio(g, -w * 0.55, w * 0.55, 0.5);
  k.reflejo(g, -w * 0.28, -h * 0.22, w * 0.12, h * 0.55, 0.5);
  // tapón
  redondo(g, -w * 0.28, -h * 0.56, w * 0.56, h * 0.1, 6);
  g.fillStyle = "#d7dee8";
  g.fill();
  g.restore();
}

// Una persona con volumen: piel, pelo y ropa de color. y son los pies.
export function persona(g, x, y, h, ropa, t, mira = 1) {
  g.save();
  g.translate(x, y);
  g.scale(mira, 1);
  const sway = Math.sin(t * 1.5) * h * 0.012;
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(10, 8, h * 0.2, h * 0.03, 0, 0, 7);
  g.fill();
  const piel = g.createRadialGradient(-h * 0.03, -h + h * 0.13, h * 0.02, sway, -h + h * 0.16, h * 0.13);
  piel.addColorStop(0, "#ffe6cc");
  piel.addColorStop(0.65, "#e2a57c");
  piel.addColorStop(1, "#a86b45");
  g.fillStyle = piel;
  g.beginPath();
  g.arc(sway, -h + h * 0.16, h * 0.11, 0, 7);
  g.fill();
  g.fillStyle = "#24160f";
  g.beginPath();
  g.arc(sway, -h + h * 0.145, h * 0.112, Math.PI * 1.02, Math.PI * 1.98);
  g.fill();
  const cg = g.createLinearGradient(-h * 0.2, -h, h * 0.2, 0);
  cg.addColorStop(0, `rgb(${k.mezRgb(ropa, "0,0,0", 0.35)})`);
  cg.addColorStop(0.42, `rgb(${k.mezRgb(ropa, "255,255,255", 0.28)})`);
  cg.addColorStop(1, `rgb(${k.mezRgb(ropa, "0,0,0", 0.5)})`);
  g.fillStyle = cg;
  g.beginPath();
  g.moveTo(-h * 0.04 + sway, -h + h * 0.26);
  g.quadraticCurveTo(-h * 0.2, -h * 0.52, -h * 0.15, -h * 0.05);
  g.lineTo(-h * 0.06, 0);
  g.lineTo(h * 0.06, 0);
  g.lineTo(h * 0.15, -h * 0.05);
  g.quadraticCurveTo(h * 0.2, -h * 0.52, h * 0.04 + sway, -h + h * 0.26);
  g.closePath();
  g.fill();
  g.strokeStyle = "#e2a57c";
  g.lineWidth = h * 0.04;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, -h * 0.58);
  g.quadraticCurveTo(h * 0.2, -h * 0.48 + Math.sin(t * 2) * h * 0.01, h * 0.16, -h * 0.3);
  g.stroke();
  g.restore();
}

// Una puerta pesada, con cerradura.
export function puerta(g, x, y, h, al = 1, abierta = 0) {
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  const w = h * 0.62;
  g.translate(abierta * w * 0.15, 0);
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  gr.addColorStop(0, "#6a5438");
  gr.addColorStop(0.5, "#c4a36a");
  gr.addColorStop(1, "#3c2c18");
  redondo(g, -w / 2, -h, w, h, 18);
  g.fillStyle = gr;
  g.fill();
  // dos paneles
  g.strokeStyle = "rgba(90,60,30,0.45)";
  g.lineWidth = 4;
  redondo(g, -w / 2 + 18, -h + 18, w - 36, h * 0.42, 8);
  g.stroke();
  redondo(g, -w / 2 + 18, -h * 0.5, w - 36, h * 0.42, 8);
  g.stroke();
  // cerradura
  g.fillStyle = "#ffd56a";
  g.beginPath();
  g.arc(w * 0.28, -h * 0.46, 16, 0, 7);
  g.fill();
  g.fillRect(w * 0.24, -h * 0.46, 8, 28);
  // marco
  g.strokeStyle = "rgba(255,220,160,0.45)";
  g.lineWidth = 6;
  redondo(g, -w / 2 + 16, -h + 16, w - 32, h - 32, 12);
  g.stroke();
  g.restore();
}

// Proteína: una cinta doblada, de colores, solo un dibujo.
export function proteina(g, x, y, s, t, al = 1) {
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.scale(s, s);
  g.lineCap = "round";
  g.lineJoin = "round";
  const cols = ["#ff5d8f", "#ffc14d", "#7dffb2", "#67b7ff", "#d070ff"];
  g.lineWidth = 28;
  for (let i = 0; i < 5; i++) {
    const o = i * 0.7;
    g.strokeStyle = cols[i];
    g.beginPath();
    g.moveTo(-120 + i * 8, 40);
    g.bezierCurveTo(-40, -80 + Math.sin(t * 2 + o) * 16, 30, 90, 70, -20 + Math.cos(t * 1.6 + o) * 12);
    g.bezierCurveTo(100, -90, 140, 40, 80, 70);
    g.stroke();
  }
  g.restore();
}

// Reloj de pared, con las agujas en un ángulo dado (horas).
export function reloj(g, x, y, r, horas, al = 1) {
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.beginPath();
  g.arc(0, 0, r, 0, 7);
  g.fillStyle = "#120c18";
  g.fill();
  g.lineWidth = 8;
  g.strokeStyle = "#ffe1a8";
  g.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 6.2832 - 1.5708;
    g.strokeStyle = "rgba(255,225,168,0.8)";
    g.lineWidth = i % 3 === 0 ? 6 : 3;
    g.beginPath();
    g.moveTo(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78);
    g.lineTo(Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92);
    g.stroke();
  }
  const ah = (horas / 12) * 6.2832 - 1.5708;
  const am = ((horas % 1) * 12) * 6.2832 - 1.5708;
  g.strokeStyle = "#fff";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(Math.cos(ah) * r * 0.48, Math.sin(ah) * r * 0.48);
  g.stroke();
  g.strokeStyle = "#ffd56a";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(Math.cos(am) * r * 0.72, Math.sin(am) * r * 0.72);
  g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- teléfono con una foto dentro
export function telefono(g, x, y, h, ang, dibujaFoto) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  const w = h * 0.5;
  redondo(g, -w / 2, -h / 2, w, h, 36);
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  gr.addColorStop(0, "#2a3144");
  gr.addColorStop(0.5, "#0c1018");
  gr.addColorStop(1, "#1a2030");
  g.fillStyle = gr;
  g.fill();
  g.save();
  redondo(g, -w / 2 + 14, -h / 2 + 16, w - 28, h - 32, 22);
  g.clip();
  g.translate(-w / 2 + 14, -h / 2 + 16);
  dibujaFoto(g, w - 28, h - 32);
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(-28, -h / 2 + 22, 56, 8);
  g.restore();
}

// Fuego de la foto, dibujado en un rectángulo local (0,0)-(w,h).
export function fuegoFoto(g, w, h, t) {
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#1a0a08");
  bg.addColorStop(1, "#4a1408");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 7; i++) {
    const x = w * (0.18 + (i % 5) * 0.15);
    k.lengua(g, x, h * 0.92, h * (0.55 + (i % 3) * 0.12), w * 0.16, t, i, "255,90,20", "255,220,80");
  }
  g.restore();
}

// Banco de laboratorio, de color, no gris.
export function banco(g, y, t) {
  const gr = g.createLinearGradient(0, y, 0, 1920);
  gr.addColorStop(0, "#12324a");
  gr.addColorStop(1, "#071018");
  g.fillStyle = gr;
  g.fillRect(0, y, 1080, 1920 - y);
  g.fillStyle = "rgba(120,220,255,0.35)";
  g.fillRect(0, y, 1080, 8);
  g.save();
  g.globalAlpha = 0.08;
  g.drawImage(k.causticas, 0, y, 1080, 280);
  g.restore();
  // frascos de colores, quietos, de adorno: no son un procedimiento
  const cols = ["40,190,255", "255,90,140", "255,190,60", "80,230,150"];
  for (let i = 0; i < 4; i++) {
    const x = 140 + i * 80;
    g.save();
    g.translate(x, y + 70);
    g.globalAlpha = 0.9;
    redondo(g, -18, -50, 36, 64, 12);
    g.fillStyle = `rgba(${cols[i]},0.85)`;
    g.fill();
    k.reflejo(g, -12, -40, 6, 30, 0.4);
    g.restore();
  }
}

// La máquina que revisa el pedido: una caja con una ventana y una hélice de cuentas de colores.
// Las cuentas no son letras: es el pedido, visto de lejos.
export function maquina(g, x, y, s, t, al = 1) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  redondo(g, -260, -180, 520, 360, 28);
  const gr = g.createLinearGradient(-260, -180, 260, 180);
  gr.addColorStop(0, "#16324a");
  gr.addColorStop(0.5, "#0c1a28");
  gr.addColorStop(1, "#10283c");
  g.fillStyle = gr;
  g.fill();
  g.strokeStyle = "rgba(130,220,255,0.45)";
  g.lineWidth = 4;
  g.stroke();
  // ventana
  redondo(g, -200, -120, 400, 200, 16);
  g.fillStyle = "#071018";
  g.fill();
  g.save();
  redondo(g, -200, -120, 400, 200, 16);
  g.clip();
  helice(g, t);
  // barra de lectura
  const bx = -180 + ((t * 90) % 360);
  g.fillStyle = "rgba(120,255,210,0.85)";
  g.fillRect(bx, -120, 10, 200);
  g.restore();
  // luz de estado
  g.beginPath();
  g.arc(210, -140, 12, 0, 7);
  g.fillStyle = "#3dff9a";
  g.fill();
  g.restore();
}
function helice(g, t) {
  const n = 18;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const ang = t * 2.2 + u * 9;
    const xx = -160 + u * 320;
    const yy = Math.sin(ang) * 48;
    const col = ["#5dffe1", "#ffd15a", "#ff6d9a", "#8eb6ff"][i % 4];
    g.beginPath();
    g.arc(xx, yy, 14, 0, 7);
    g.fillStyle = col;
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.6)";
    g.beginPath();
    g.arc(xx - 4, yy - 4, 4, 0, 7);
    g.fill();
  }
}

// Un sello grande de NO, rojo, que cae.
export function selloNo(g, x, y, s, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.rotate(-0.18);
  g.strokeStyle = "#ff3355";
  g.lineWidth = 16;
  g.beginPath();
  g.arc(0, 0, 110, 0, 7);
  g.stroke();
  g.font = "800 92px Figtree";
  g.fillStyle = "#ff3355";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("NO", 0, 6);
  g.restore();
}

// Calle de día, al fondo de una ventana. Gente pequeña andando, sana.
export function calle(g, x, y, w, h, t) {
  g.save();
  g.beginPath();
  g.rect(x, y, w, h);
  g.clip();
  const cielo = g.createLinearGradient(0, y, 0, y + h);
  cielo.addColorStop(0, "#7ec8ff");
  cielo.addColorStop(0.55, "#ffe1a8");
  cielo.addColorStop(1, "#f0a060");
  g.fillStyle = cielo;
  g.fillRect(x, y, w, h);
  // sol
  g.beginPath();
  g.arc(x + w * 0.78, y + h * 0.28, 36, 0, 7);
  g.fillStyle = "#fff4c8";
  g.fill();
  // edificios de color
  const cols = ["#ff7a59", "#3d6dff", "#ff5fa2", "#2fbf71", "#ffc14d"];
  for (let i = 0; i < 6; i++) {
    const bh = h * (0.28 + (i % 3) * 0.08);
    g.fillStyle = cols[i % cols.length];
    g.fillRect(x + i * (w / 6), y + h * 0.62 - bh, w / 6 - 6, bh);
  }
  g.fillStyle = "#2a2118";
  g.fillRect(x, y + h * 0.78, w, h * 0.22);
  // tres paseantes
  for (let i = 0; i < 3; i++) {
    const px = x + ((t * 40 + i * w * 0.3) % (w + 40)) - 20;
    persona(g, px, y + h * 0.95, h * 0.22, "255,244,220", t + i, 1);
  }
  g.restore();
  // marco de la ventana
  g.save();
  g.strokeStyle = "#d7c4a2";
  g.lineWidth = 14;
  g.strokeRect(x, y, w, h);
  g.strokeStyle = "rgba(255,255,255,0.25)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(x + w / 2, y);
  g.lineTo(x + w / 2, y + h);
  g.moveTo(x, y + h * 0.45);
  g.lineTo(x + w, y + h * 0.45);
  g.stroke();
  g.restore();
}
