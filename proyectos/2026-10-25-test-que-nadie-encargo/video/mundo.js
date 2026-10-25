// Lo que comparten los planos: el sello de lacre, las tareas, el velo del subtítulo.
import * as k from "#kit";

export function velo(g, fuerza = 0.78) {
  const h = g.createLinearGradient(0, 200, 0, 560);
  h.addColorStop(0, `rgba(6,3,10,${fuerza})`);
  h.addColorStop(1, "rgba(6,3,10,0)");
  g.fillStyle = h;
  g.fillRect(0, 180, 1080, 420);
}

// Sello de lacre, centrado en 0,0. grieta de 0 a 1. radio en píxeles.
export function sello(g, r, grieta) {
  g.save();
  g.beginPath();
  g.arc(10, 16, r * 0.96, 0, 6.3);
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.fill();
  const c = g.createRadialGradient(-r * 0.32, -r * 0.38, r * 0.08, 0, 0, r);
  c.addColorStop(0, "#ff7a72");
  c.addColorStop(0.42, "#d4252e");
  c.addColorStop(1, "#6a0e16");
  g.beginPath();
  g.arc(0, 0, r, 0, 6.3);
  g.fillStyle = c;
  g.fill();
  // borde irregular, como cera
  g.beginPath();
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * 6.2832;
    const w = r * (1.02 + 0.035 * Math.sin(i * 2.3) + 0.02 * Math.sin(i * 5.1));
    const x = Math.cos(a) * w, y = Math.sin(a) * w;
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  }
  g.strokeStyle = "rgba(90,8,14,0.55)";
  g.lineWidth = r * 0.035;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, r * 0.72, 0, 6.3);
  g.strokeStyle = "#f3c75a";
  g.lineWidth = Math.max(4, r * 0.045);
  g.stroke();
  g.beginPath();
  g.arc(0, 0, r * 0.58, 0, 6.3);
  g.strokeStyle = "rgba(243,199,90,0.45)";
  g.lineWidth = Math.max(2, r * 0.02);
  g.stroke();
  // un frontón, no un texto
  g.fillStyle = "#f3c75a";
  g.beginPath();
  g.moveTo(0, -r * 0.42);
  g.lineTo(r * 0.28, -r * 0.12);
  g.lineTo(-r * 0.28, -r * 0.12);
  g.closePath();
  g.fill();
  g.fillRect(-r * 0.2, -r * 0.12, r * 0.4, r * 0.34);
  g.fillStyle = "#8a1a22";
  g.fillRect(-r * 0.06, -r * 0.02, r * 0.12, r * 0.24);
  if (grieta > 0.02) {
    g.beginPath();
    g.moveTo(-r * 0.05, -r * 0.9);
    g.lineTo(r * 0.08, -r * 0.35);
    g.lineTo(-r * 0.12, r * 0.05);
    g.lineTo(r * 0.16, r * 0.92);
    g.strokeStyle = `rgba(255,214,150,${0.35 + 0.65 * grieta})`;
    g.lineWidth = Math.max(3, r * 0.03 * grieta);
    g.lineJoin = "round";
    g.stroke();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,190,110,${0.85 * grieta})`;
    g.lineWidth = Math.max(6, r * 0.07 * grieta);
    g.stroke();
    g.globalCompositeOperation = "source-over";
  }
  // brillo de cera
  g.beginPath();
  g.ellipse(-r * 0.28, -r * 0.32, r * 0.22, r * 0.12, -0.6, 0, 6.3);
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.fill();
  g.restore();
}

export function cubo(g, x, y, s, tono = "#e24b3c") {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.moveTo(0, -s * 0.58);
  g.lineTo(s * 0.72, -s * 0.22);
  g.lineTo(0, s * 0.14);
  g.lineTo(-s * 0.72, -s * 0.22);
  g.closePath();
  g.fillStyle = "#ffb0a4";
  g.fill();
  g.beginPath();
  g.moveTo(-s * 0.72, -s * 0.22);
  g.lineTo(0, s * 0.14);
  g.lineTo(0, s * 0.9);
  g.lineTo(-s * 0.72, s * 0.54);
  g.closePath();
  g.fillStyle = "#8d241c";
  g.fill();
  g.beginPath();
  g.moveTo(s * 0.72, -s * 0.22);
  g.lineTo(0, s * 0.14);
  g.lineTo(0, s * 0.9);
  g.lineTo(s * 0.72, s * 0.54);
  g.closePath();
  g.fillStyle = tono;
  g.fill();
  g.restore();
}

// Tarjeta de copiar un cuadrado. progreso 0..1 dibuja el cuadrado.
export function tarjeta(g, x, y, s, progreso) {
  g.save();
  g.translate(x, y);
  k.redondo(g, -s * 0.7, -s * 0.9, s * 1.4, s * 1.8, s * 0.12);
  g.fillStyle = "#fff6e4";
  g.fill();
  g.strokeStyle = "rgba(90,60,30,0.25)";
  g.lineWidth = 4;
  g.stroke();
  g.strokeStyle = "#1c1a24";
  g.lineWidth = Math.max(8, s * 0.07);
  g.strokeRect(-s * 0.38, -s * 0.28, s * 0.76, s * 0.76);
  g.restore();
}

// Pizarra con tres cifras para repetir.
export function pizarra(g, x, y, s) {
  g.save();
  g.translate(x, y);
  k.redondo(g, -s * 0.95, -s * 0.7, s * 1.9, s * 1.4, s * 0.12);
  g.fillStyle = "#16342e";
  g.fill();
  g.strokeStyle = "#d7b56a";
  g.lineWidth = 8;
  g.stroke();
  g.fillStyle = "#f4edd2";
  g.font = `800 ${Math.round(s * 0.55)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("4   7   2", 0, 4);
  g.restore();
}

export function edad(g, x, y, n, al = 1, r = 72) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.arc(x, y, r, 0, 6.3);
  g.fillStyle = "#f0c14d";
  g.fill();
  g.lineWidth = Math.max(4, r * 0.1);
  g.strokeStyle = "#fff3c4";
  g.stroke();
  g.fillStyle = "#3a2408";
  g.font = `800 ${Math.round(r * 1.15)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(String(n), x, y + r * 0.06);
  g.restore();
}

// Ojo dentro de una lámpara de médico. cierre 0 abierto, 1 cerrado.
export function ojo(g, x, y, r, cierre) {
  g.save();
  g.translate(x, y);
  const anillo = g.createLinearGradient(-r, -r, r, r);
  anillo.addColorStop(0, "#fff1c2");
  anillo.addColorStop(0.45, "#e0b15a");
  anillo.addColorStop(1, "#8a5a18");
  g.beginPath();
  g.arc(0, 0, r * 1.28, 0, 6.3);
  g.strokeStyle = anillo;
  g.lineWidth = r * 0.14;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, r * 1.12, 0, 6.3);
  g.strokeStyle = "#5c3a10";
  g.lineWidth = r * 0.03;
  g.stroke();
  g.beginPath();
  g.ellipse(0, 0, r, r * 0.78, 0, 0, 6.3);
  const sc = g.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.05, 0, 0, r);
  sc.addColorStop(0, "#fffdf8");
  sc.addColorStop(1, "#cfc3b4");
  g.fillStyle = sc;
  g.fill();
  g.beginPath();
  g.arc(r * 0.04, r * 0.02, r * 0.4, 0, 6.3);
  const ir = g.createRadialGradient(-r * 0.08, -r * 0.1, r * 0.04, r * 0.04, 0, r * 0.4);
  ir.addColorStop(0, "#ffe08a");
  ir.addColorStop(0.45, "#e08918");
  ir.addColorStop(1, "#4a2208");
  g.fillStyle = ir;
  g.fill();
  // radios del iris
  g.strokeStyle = "rgba(90,40,8,0.35)";
  g.lineWidth = 2;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 6.2832;
    g.beginPath();
    g.moveTo(r * 0.04 + Math.cos(a) * r * 0.16, r * 0.02 + Math.sin(a) * r * 0.16);
    g.lineTo(r * 0.04 + Math.cos(a) * r * 0.38, r * 0.02 + Math.sin(a) * r * 0.38);
    g.stroke();
  }
  g.beginPath();
  g.arc(r * 0.04, r * 0.02, r * 0.16, 0, 6.3);
  g.fillStyle = "#140c08";
  g.fill();
  g.beginPath();
  g.arc(-r * 0.08, -r * 0.12, r * 0.055, 0, 6.3);
  g.fillStyle = "rgba(255,255,255,0.92)";
  g.fill();
  const c = Math.max(0, Math.min(1, cierre));
  if (c > 0.01) {
    g.save();
    g.beginPath();
    g.ellipse(0, 0, r * 1.02, r * 0.82, 0, 0, 6.3);
    g.clip();
    const tapa = -r * 0.9 + c * r * 1.85;
    const piel = g.createLinearGradient(0, -r, 0, tapa);
    piel.addColorStop(0, "#f6d7c0");
    piel.addColorStop(1, "#e2b292");
    g.fillStyle = piel;
    g.fillRect(-r * 1.4, -r * 1.3, r * 2.8, tapa + r * 1.3);
    g.fillStyle = "rgba(90,40,30,0.35)";
    g.fillRect(-r * 1.2, tapa - 8, r * 2.4, 10);
    g.restore();
  }
  g.restore();
}

export function medalla(g, x, y, r, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  const c = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  c.addColorStop(0, "#fff4c4");
  c.addColorStop(0.4, "#f0c14d");
  c.addColorStop(1, "#a56a12");
  g.beginPath();
  g.arc(0, 0, r, 0, 6.3);
  g.fillStyle = c;
  g.fill();
  g.beginPath();
  g.arc(0, 0, r * 0.78, 0, 6.3);
  g.strokeStyle = "#fff6d0";
  g.lineWidth = r * 0.06;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, r * 0.42, 0, 6.3);
  g.fillStyle = "rgba(255,236,170,0.35)";
  g.fill();
  g.restore();
}

export function llama(g, x, y, h, t, fase) {
  const o = Math.sin(t * 2.4 + fase) * h * 0.06;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x - h * 0.35, y - h * 0.45, x + o, y - h);
  g.quadraticCurveTo(x + h * 0.35, y - h * 0.4, x, y);
  g.fillStyle = "rgba(255,170,60,0.9)";
  g.fill();
  g.beginPath();
  g.moveTo(x, y - h * 0.05);
  g.quadraticCurveTo(x - h * 0.12, y - h * 0.4, x + o * 0.4, y - h * 0.72);
  g.quadraticCurveTo(x + h * 0.12, y - h * 0.35, x, y - h * 0.05);
  g.fillStyle = "rgba(255,240,180,0.95)";
  g.fill();
  g.restore();
}
