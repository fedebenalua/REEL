// Lo que comparten los planos: el mismo cielo, la misma sal, el mismo lago y los mismos cabos.
import * as k from "#kit";

const az = k.azar(7);

export function velo(g, fuerza = 0.72) {
  if (fuerza <= 0.01) return;
  const vg = g.createLinearGradient(0, 40, 0, 700);
  vg.addColorStop(0, `rgba(8,16,32,${fuerza})`);
  vg.addColorStop(0.55, `rgba(8,16,32,${fuerza * 0.55})`);
  vg.addColorStop(1, "rgba(8,16,32,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 760);
}

export function cielo(g, calor = 0.35) {
  const cg = g.createLinearGradient(0, 0, 0, 1200);
  const arriba = k.mezColor("#12305f", "#1a3f86", 1 - calor);
  cg.addColorStop(0, arriba);
  cg.addColorStop(0.42, k.mezColor("#3c86c4", "#6eb0dd", 1 - calor * 0.3));
  cg.addColorStop(0.72, k.mezColor("#f0b56a", "#9fd0ea", 1 - calor));
  cg.addColorStop(1, k.mezColor("#f6d7a4", "#d5ecf6", 1 - calor));
  g.fillStyle = cg;
  g.fillRect(0, 0, 1080, 1920);
}

export function sol(g, x, y, r, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  k.brillo(g, x, y, r * 7.2, "blanca", 0.55);
  k.brillo(g, x, y, r * 3.4, "sodio", 0.45);
  const sg = g.createRadialGradient(x - r * 0.25, y - r * 0.28, r * 0.1, x, y, r);
  sg.addColorStop(0, "#fffef6");
  sg.addColorStop(0.45, "#ffe08a");
  sg.addColorStop(1, "rgba(255,176,60,0)");
  g.fillStyle = sg;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

// Costra de sal, una vez: celdas claras con grietas.
const salTex = k.lienzo(900, 900);
{
  const s = salTex.getContext("2d");
  s.fillStyle = "#f4e6d4";
  s.fillRect(0, 0, 900, 900);
  const a = k.azar(4);
  for (let i = 0; i < 90; i++) {
    const x = a() * 900, y = a() * 900, n = 5 + (a() * 3 | 0), r = 28 + a() * 74;
    s.beginPath();
    for (let k = 0; k <= n; k++) {
      const ang = (k / n) * Math.PI * 2 + a() * 0.4;
      const rr = r * (0.65 + a() * 0.5);
      const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr;
      if (k) s.lineTo(px, py); else s.moveTo(px, py);
    }
    s.closePath();
    const claro = a();
    s.fillStyle = claro > 0.72 ? "#fffaf3" : claro > 0.35 ? "#f7e7d6" : "#ecd3bf";
    s.fill();
    s.strokeStyle = "rgba(150,108,82,0.45)";
    s.lineWidth = 2.4;
    s.stroke();
  }
  s.globalCompositeOperation = "multiply";
  s.globalAlpha = 0.28;
  s.drawImage(k.manchas, 0, 0, 900, 900);
}
export { salTex };

// Suelo de sal en perspectiva, con el horizonte en yh. vel: cuánto corre hacia la cámara.
export function sueloSal(g, yh, t, vel, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.moveTo(-40, 1960);
  g.lineTo(1120, 1960);
  g.lineTo(760, yh);
  g.lineTo(320, yh);
  g.closePath();
  g.clip();
  const sg = g.createLinearGradient(0, yh, 0, 1920);
  sg.addColorStop(0, "#f8e2c4");
  sg.addColorStop(0.35, "#fff6ea");
  sg.addColorStop(1, "#e7d0bb");
  g.fillStyle = sg;
  g.fillRect(0, yh - 20, 1080, 2000);
  const off = (t * vel) % 1;
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.55;
  for (let i = 0; i < 16; i++) {
    const u = (i / 16 + off) % 1;
    const y = yh + (1920 - yh) * u * u;
    const medio = 240 + u * 420;
    g.strokeStyle = `rgba(120,82,60,${0.15 + u * 0.45})`;
    g.lineWidth = 1 + u * 4;
    g.beginPath();
    g.moveTo(540 - medio, y);
    g.lineTo(540 + medio, y);
    g.stroke();
  }
  for (let i = -6; i <= 6; i++) {
    g.strokeStyle = "rgba(120,82,60,0.28)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(540 + i * 28, yh);
    g.lineTo(540 + i * 150, 1960);
    g.stroke();
  }
  g.restore();
  g.restore();
}

export function lago(g, x, y, rx, ry, t, al = 1) {
  if (al <= 0.01 || rx < 2) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.clip();
  const lg = g.createLinearGradient(0, y - ry, 0, y + ry);
  lg.addColorStop(0, "#b8fff0");
  lg.addColorStop(0.35, "#1ec8b0");
  lg.addColorStop(1, "#064e58");
  g.fillStyle = lg;
  g.fillRect(x - rx, y - ry, rx * 2, ry * 2);
  g.globalAlpha *= 0.45;
  g.drawImage(k.causticas, x - rx + (t * 40) % 80, y - ry, rx * 2, ry * 2);
  g.globalAlpha = al;
  k.rayos(g, t, y + ry, 0.35, 5, "180,255,230");
  // brillo de la superficie
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.beginPath();
  g.ellipse(x - rx * 0.15, y - ry * 0.25, rx * 0.55, ry * 0.18, -0.3, 0, Math.PI * 2);
  g.fill();
  g.restore();
  // orilla de sal más clara
  g.save();
  g.globalAlpha *= al * 0.9;
  g.strokeStyle = "rgba(255,250,240,0.85)";
  g.lineWidth = 8;
  g.beginPath();
  g.ellipse(x, y, rx + 6, ry + 5, 0, 0, Math.PI * 2);
  g.stroke();
  g.restore();
}

// Un cabo de roca. dir -1 izquierda, +1 derecha. El borde interior queda en x.
export function cabo(g, x, y, dir, alto, ancho, semilla) {
  const a = k.azar(semilla);
  g.save();
  g.beginPath();
  g.moveTo(x, y + alto * 0.55);
  const pasos = 7;
  for (let i = 0; i <= pasos; i++) {
    const u = i / pasos;
    const px = x + dir * (ancho * (0.15 + u * 0.85) + a() * 18);
    const py = y - alto * (0.15 + Math.sin(u * Math.PI) * 0.85) + (a() - 0.5) * 30;
    g.lineTo(px, py);
  }
  g.lineTo(x + dir * (ancho + 80), y + alto);
  g.lineTo(x, y + alto);
  g.closePath();
  const x0 = Math.min(x, x + dir * ancho), x1 = Math.max(x, x + dir * ancho);
  const rg = g.createLinearGradient(x0, y - alto, x1, y + alto);
  rg.addColorStop(0, "#f2c49a");
  rg.addColorStop(0.35, "#d4845a");
  rg.addColorStop(0.75, "#8d4633");
  rg.addColorStop(1, "#4d261c");
  g.fillStyle = rg;
  g.fill();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.45;
  g.drawImage(k.manchas, x0 - 40, y - alto, ancho + 160, alto * 2);
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.18;
  g.drawImage(k.red, x0, y - alto, ancho + 80, alto * 1.4);
  g.restore();
}

export function montanas(g, yh, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  const cerros = [[80, 220, "#c47a52"], [260, 160, "#a86448"], [480, 250, "#d4926a"], [700, 140, "#b56e4e"], [920, 210, "#c98458"]];
  cerros.forEach(([x, h, col], i) => {
    g.beginPath();
    g.moveTo(x - 150, yh + 30);
    g.lineTo(x, yh - h);
    g.lineTo(x + 170, yh + 40);
    g.closePath();
    const mg = g.createLinearGradient(x, yh - h, x, yh);
    mg.addColorStop(0, "#f0c9a4");
    mg.addColorStop(0.4, col);
    mg.addColorStop(1, "#6a382c");
    g.fillStyle = mg;
    g.fill();
    if (i % 2 === 0) {
      g.globalAlpha *= 0.9;
    }
  });
  g.restore();
}

// Chorro o lámina de agua. y0 arriba, y1 abajo.
export function lamina(g, x, y0, y1, ancho, t, al = 1) {
  if (al <= 0.01 || y1 <= y0) return;
  g.save();
  g.globalAlpha *= al;
  const rg = g.createLinearGradient(0, y0, 0, y1);
  rg.addColorStop(0, "rgba(186,244,255,0.15)");
  rg.addColorStop(0.2, "rgba(64,196,230,0.75)");
  rg.addColorStop(1, "rgba(10,90,140,0.9)");
  g.fillStyle = rg;
  g.beginPath();
  g.moveTo(x - ancho * 0.35, y0);
  g.quadraticCurveTo(x - ancho * 0.15, (y0 + y1) / 2, x - ancho * 0.5, y1);
  g.lineTo(x + ancho * 0.5, y1);
  g.quadraticCurveTo(x + ancho * 0.15, (y0 + y1) / 2, x + ancho * 0.35, y0);
  g.closePath();
  g.fill();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 14; i++) {
    const u = (i / 14 + t * 1.4) % 1;
    const y = y0 + (y1 - y0) * u;
    const w = ancho * (0.2 + u * 0.35);
    g.fillStyle = `rgba(230,250,255,${0.15 + 0.25 * (1 - u)})`;
    g.fillRect(x - w / 2, y, w, 8 + u * 18);
  }
  g.restore();
}

export function espuma(g, x, y, rx, ry, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.fill();
  k.brillo(g, x, y, rx * 2.2, "blanca", 0.35 * al);
  g.restore();
}

// Gotas que acompañan una caída. Cada una: u de nacimiento, x, s.
export const gotas = Array.from({ length: 70 }, () => ({
  u: az(), x: (az() - 0.5) * 900, s: 3 + az() * 7, v: 0.6 + az() * 0.8,
}));

export function lluvia(g, t, y0, y1, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.fillStyle = `rgba(220,245,255,${0.8 * al})`;
  for (const q of gotas) {
    const u = (q.u + t * q.v) % 1;
    const y = y0 + (y1 - y0) * u;
    g.fillRect(540 + q.x, y, q.s * 0.6, q.s * 2.2);
  }
  g.restore();
}

export function vapor(g, t, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 8; i++) {
    const u = (i / 8 + t * 0.15) % 1;
    const x = 180 + (i * 110) % 760;
    const y = 1500 - u * 700;
    k.brillo(g, x, y, 180 + u * 80, "blanca", al * 0.12 * (1 - u));
  }
  g.restore();
}

// Mar lleno, visto de lado o desde arriba: una franja con olas.
export function mar(g, y, alto, t, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.moveTo(0, 1920);
  g.lineTo(0, y);
  for (let x = 0; x <= 1080; x += 40) {
    const oy = Math.sin(x * 0.02 + t * 2.2) * 10 + Math.sin(x * 0.008 - t * 1.3) * 16;
    g.lineTo(x, y + oy);
  }
  g.lineTo(1080, 1920);
  g.closePath();
  const mg = g.createLinearGradient(0, y - 20, 0, y + alto);
  mg.addColorStop(0, "#7ee7ef");
  mg.addColorStop(0.25, "#1396c4");
  mg.addColorStop(1, "#06345c");
  g.fillStyle = mg;
  g.fill();
  g.globalCompositeOperation = "screen";
  g.globalAlpha *= 0.35;
  g.drawImage(k.causticas, -((t * 60) % 200), y, 1400, alto);
  g.restore();
}
