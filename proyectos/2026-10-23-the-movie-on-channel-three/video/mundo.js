// El salón, la tele, el vídeo, la torre diminuta y la ciudad. Lo que sale en más de un plano se dibuja aquí.
import * as k from "#kit";

const { suave: su, mez, azar } = k;

export function aplica(g, fx, fy, z) {
  g.setTransform(z, 0, 0, z, 540 - fx * z, 960 - fy * z);
}

export function velo(g) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const grd = g.createLinearGradient(0, 220, 0, 560);
  grd.addColorStop(0, "rgba(6,2,14,0.72)");
  grd.addColorStop(0.55, "rgba(6,2,14,0.28)");
  grd.addColorStop(1, "rgba(6,2,14,0)");
  g.fillStyle = grd;
  g.fillRect(0, 200, 1080, 400);
  g.restore();
}

export function sala(g) {
  const cielo = g.createLinearGradient(0, -400, 0, 1100);
  cielo.addColorStop(0, "#24103a");
  cielo.addColorStop(0.45, "#3a1a48");
  cielo.addColorStop(1, "#1a1028");
  g.fillStyle = cielo;
  g.fillRect(-600, -500, 2400, 1800);
  // lámpara de pie, a la izquierda, caliente
  g.save();
  g.fillStyle = "#2a1408";
  g.fillRect(70, 420, 28, 980);
  const bomb = g.createRadialGradient(84, 390, 10, 84, 390, 280);
  bomb.addColorStop(0, "rgba(255,196,90,0.95)");
  bomb.addColorStop(0.35, "rgba(255,140,40,0.35)");
  bomb.addColorStop(1, "rgba(255,120,20,0)");
  g.fillStyle = bomb;
  g.beginPath();
  g.arc(84, 390, 280, 0, 6.2832);
  g.fill();
  g.fillStyle = "#ffd27a";
  g.beginPath();
  g.arc(84, 400, 36, 0, 6.2832);
  g.fill();
  g.restore();
  // suelo y alfombra
  const suelo = g.createLinearGradient(0, 1180, 0, 2100);
  suelo.addColorStop(0, "#4a2a22");
  suelo.addColorStop(1, "#1a0c10");
  g.fillStyle = suelo;
  g.fillRect(-600, 1180, 2400, 1100);
  g.fillStyle = "#8d2438";
  k.redondo(g, 180, 1360, 760, 280, 40);
  g.fill();
  g.fillStyle = "rgba(255,180,80,0.18)";
  k.redondo(g, 220, 1400, 680, 40, 20);
  g.fill();
}

// Una película sencilla que se mueve: cielo, sol, colinas y alguien que corre.
export function pelicula(g, x, y, w, h, t, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.rect(x, y, w, h);
  g.clip();
  const cielo = g.createLinearGradient(x, y, x, y + h);
  cielo.addColorStop(0, "#ff6a2a");
  cielo.addColorStop(0.45, "#ff3d8a");
  cielo.addColorStop(1, "#3a1cff");
  g.fillStyle = cielo;
  g.fillRect(x, y, w, h);
  const solX = x + w * (0.72 + 0.04 * Math.sin(t * 0.7));
  const solY = y + h * 0.28;
  g.fillStyle = "#ffe56a";
  g.beginPath();
  g.arc(solX, solY, w * 0.12, 0, 6.2832);
  g.fill();
  g.fillStyle = "#1a0a28";
  g.beginPath();
  g.moveTo(x, y + h * 0.78);
  g.quadraticCurveTo(x + w * 0.3, y + h * 0.58, x + w * 0.55, y + h * 0.74);
  g.quadraticCurveTo(x + w * 0.8, y + h * 0.88, x + w, y + h * 0.62);
  g.lineTo(x + w, y + h);
  g.lineTo(x, y + h);
  g.fill();
  const ciclo = (t * 0.35) % 1;
  const px = x + w * (0.15 + ciclo * 0.7);
  const py = y + h * 0.7;
  const paso = Math.sin(t * 10);
  g.strokeStyle = "#fff4d8";
  g.lineWidth = Math.max(4, w * 0.012);
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(px, py - h * 0.12);
  g.lineTo(px, py);
  g.moveTo(px, py - h * 0.08);
  g.lineTo(px - w * 0.04 * paso, py - h * 0.02);
  g.moveTo(px, py - h * 0.08);
  g.lineTo(px + w * 0.04 * paso, py - h * 0.015);
  g.moveTo(px, py);
  g.lineTo(px - w * 0.035, py + h * 0.08);
  g.moveTo(px, py);
  g.lineTo(px + w * 0.04, py + h * 0.07);
  g.stroke();
  g.fillStyle = "#fff4d8";
  g.beginPath();
  g.arc(px, py - h * 0.15, Math.max(6, w * 0.02), 0, 6.2832);
  g.fill();
  g.restore();
}

export function numero(g, texto, x, y, tam, al = 1, color = "#fff6d8") {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.font = `800 ${tam}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 24;
  g.lineWidth = tam * 0.06;
  g.strokeStyle = "rgba(40,10,20,0.85)";
  g.strokeText(texto, x, y);
  g.shadowBlur = 0;
  g.fillStyle = color;
  g.fillText(texto, x, y);
  g.restore();
}

// Tele de tubo. giro 0 de frente, 1 de espaldas. moderno 0 tubo, 1 plana.
export function tele(g, opt) {
  const {
    x = 540, y = 860, giro = 0, moderno = 0, t = 0,
    pinta = null,
  } = opt;
  const lado = Math.cos(giro * Math.PI);
  const ancho = Math.max(0.08, Math.abs(lado));
  const detras = lado < 0;
  const W = mez(820, 900, moderno);
  const H = mez(640, 540, moderno);
  g.save();
  g.translate(x, y);
  g.scale(ancho, 1);
  // mueble
  const madera = g.createLinearGradient(-W / 2, 0, W / 2, 0);
  madera.addColorStop(0, "#3a2014");
  madera.addColorStop(0.4, "#a8643a");
  madera.addColorStop(0.7, "#6a3820");
  madera.addColorStop(1, "#2a140c");
  k.redondo(g, -W / 2, -H / 2, W, H, mez(36, 18, moderno));
  g.fillStyle = madera;
  g.fill();
  if (!detras) {
    const sw = W * mez(0.78, 0.9, moderno);
    const sh = H * mez(0.68, 0.82, moderno);
    const sx = -sw / 2;
    const sy = -sh / 2 - H * 0.04;
    k.redondo(g, sx - 18, sy - 18, sw + 36, sh + 36, mez(28, 12, moderno));
    g.fillStyle = "#12080e";
    g.fill();
    g.save();
    k.redondo(g, sx, sy, sw, sh, mez(18, 8, moderno));
    g.clip();
    if (pinta) pinta(g, sx, sy, sw, sh, t);
    else g.fillStyle = "#1a0820", g.fillRect(sx, sy, sw, sh);
    // cristal curvo
    if (moderno < 0.85) {
      g.globalAlpha = 0.28 * (1 - moderno);
      const br = g.createLinearGradient(sx, sy, sx + sw, sy);
      br.addColorStop(0, "rgba(255,255,255,0.45)");
      br.addColorStop(0.2, "rgba(255,255,255,0)");
      br.addColorStop(0.8, "rgba(255,255,255,0.12)");
      br.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = br;
      g.fillRect(sx, sy, sw, sh);
    }
    g.restore();
  } else {
    // espalda: un solo agujero
    k.redondo(g, -W * 0.42, -H * 0.36, W * 0.84, H * 0.72, 16);
    g.fillStyle = "#1a120e";
    g.fill();
    g.fillStyle = "#2a201c";
    for (let i = 0; i < 5; i++) g.fillRect(-W * 0.32, -H * 0.22 + i * 48, W * 0.5, 10);
    const hx = W * 0.08;
    const hy = H * 0.02;
    g.fillStyle = "#c8ccd2";
    g.beginPath();
    g.arc(hx, hy, 54, 0, 6.2832);
    g.fill();
    g.fillStyle = "#1a120e";
    g.beginPath();
    g.arc(hx, hy, 28, 0, 6.2832);
    g.fill();
    g.strokeStyle = "#f2c14e";
    g.lineWidth = 6;
    g.beginPath();
    g.arc(hx, hy, 40, 0, 6.2832);
    g.stroke();
  }
  g.restore();
  return { detras, ancho };
}

export function cinta(g, x, y, s = 1, ang = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  k.redondo(g, -90, -54, 180, 108, 10);
  g.fillStyle = "#1a1a1e";
  g.fill();
  k.redondo(g, -78, -42, 156, 70, 6);
  const et = g.createLinearGradient(-78, 0, 78, 0);
  et.addColorStop(0, "#ff4d6a");
  et.addColorStop(0.5, "#ffb703");
  et.addColorStop(1, "#3d7eff");
  g.fillStyle = et;
  g.fill();
  g.fillStyle = "#0c0c10";
  g.beginPath();
  g.arc(-40, 8, 16, 0, 6.2832);
  g.arc(40, 8, 16, 0, 6.2832);
  g.fill();
  g.strokeStyle = "#f4f4f6";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(-40, 8, 16, 0, 6.2832);
  g.arc(40, 8, 16, 0, 6.2832);
  g.stroke();
  g.restore();
}

export function vcr(g, x, y, luz = 0) {
  g.save();
  g.translate(x, y);
  k.redondo(g, -340, -70, 680, 150, 16);
  const m = g.createLinearGradient(-340, 0, 340, 0);
  m.addColorStop(0, "#2a2e34");
  m.addColorStop(0.35, "#8d949e");
  m.addColorStop(0.7, "#3c424a");
  m.addColorStop(1, "#1a1e24");
  g.fillStyle = m;
  g.fill();
  k.redondo(g, -250, -28, 280, 36, 6);
  g.fillStyle = "#0c0e12";
  g.fill();
  // boca de la cinta
  k.redondo(g, 40, -36, 220, 28, 6);
  g.fillStyle = "#07080c";
  g.fill();
  g.fillStyle = luz > 0.5 ? "#3dff9a" : "#143028";
  g.beginPath();
  g.arc(300, -10, 10, 0, 6.2832);
  g.fill();
  g.restore();
}

// Torre de emisora. base en (x, y), altura h, hacia arriba.
export function torre(g, x, y, h, t, color = "#f2c14e") {
  if (h < 4) return;
  g.save();
  g.strokeStyle = color;
  g.lineWidth = 8;
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(x - 34, y);
  g.lineTo(x - 8, y - h);
  g.lineTo(x + 8, y - h);
  g.lineTo(x + 34, y);
  g.moveTo(x - 22, y - h * 0.35);
  g.lineTo(x + 22, y - h * 0.35);
  g.moveTo(x - 14, y - h * 0.68);
  g.lineTo(x + 14, y - h * 0.68);
  g.stroke();
  g.fillStyle = color;
  g.beginPath();
  g.arc(x, y - h - 8, 10, 0, 6.2832);
  g.fill();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    const u = ((t * 0.6 + i / 3) % 1);
    g.strokeStyle = color;
    g.globalAlpha = (1 - u) * 0.7;
    g.lineWidth = 3;
    g.beginPath();
    g.arc(x, y - h - 8, 16 + u * 70, 0, 6.2832);
    g.stroke();
  }
  g.restore();
}

export function interruptor(g, x, y, cual, al = 1) {
  // cual 0 = tres, 1 = cuatro
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  k.redondo(g, -150, -46, 300, 92, 46);
  g.fillStyle = "#14181e";
  g.fill();
  g.font = "800 42px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = cual < 0.5 ? "#fff6d8" : "#6a6248";
  g.fillText("3", -70, 2);
  g.fillStyle = cual > 0.5 ? "#fff6d8" : "#6a6248";
  g.fillText("4", 70, 2);
  const sx = mez(-70, 70, su(cual));
  g.strokeStyle = "#f2c14e";
  g.lineWidth = 6;
  g.beginPath();
  g.arc(sx, 0, 32, 0, 6.2832);
  g.stroke();
  g.restore();
}

export function mando(g, x, y, s, hundido = 0) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 30;
  g.shadowOffsetY = 18;
  k.redondo(g, -110, -280, 220, 560, 40);
  const cuerpo = g.createLinearGradient(-110, 0, 110, 0);
  cuerpo.addColorStop(0, "#1c2030");
  cuerpo.addColorStop(0.45, "#3a4460");
  cuerpo.addColorStop(1, "#12151e");
  g.fillStyle = cuerpo;
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  // el botón que importa, grande y ámbar
  const by = -40 + hundido * 10;
  g.fillStyle = "#f2c14e";
  g.beginPath();
  g.arc(0, by, 54 - hundido * 6, 0, 6.2832);
  g.fill();
  g.fillStyle = "#1a1204";
  g.font = "800 40px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("TV", 0, by);
  // otros botones, pequeños, para que se vea que es un mando
  g.fillStyle = "#2a3144";
  for (const [bx, by2] of [[-40, 80], [40, 80], [-40, 140], [40, 140], [0, 200]]) {
    g.beginPath();
    g.arc(bx, by2, 16, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

export function cableGrueso(g, x0, y0, x1, y1, t, color = "80,220,255") {
  const mx = (x0 + x1) / 2;
  const my = Math.min(y0, y1) - 80;
  g.save();
  g.lineCap = "round";
  g.strokeStyle = "#1a1c24";
  g.lineWidth = 36;
  g.beginPath();
  g.moveTo(x0, y0);
  g.quadraticCurveTo(mx, my, x1, y1);
  g.stroke();
  g.strokeStyle = `rgba(${color},0.95)`;
  g.lineWidth = 14;
  g.stroke();
  g.globalCompositeOperation = "lighter";
  const u = (t * 0.8) % 1;
  for (let i = 0; i < 4; i++) {
    const p = (u + i / 4) % 1;
    const omt = 1 - p;
    const px = omt * omt * x0 + 2 * omt * p * mx + p * p * x1;
    const py = omt * omt * y0 + 2 * omt * p * my + p * p * y1;
    g.fillStyle = `rgba(255,255,255,0.9)`;
    g.beginPath();
    g.arc(px, py, 8, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

export function movil(g, x, y, s, t) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.shadowColor = "rgba(0,0,0,0.5)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 16;
  k.redondo(g, -150, -300, 300, 600, 42);
  g.fillStyle = "#16181e";
  g.fill();
  g.shadowBlur = 0;
  k.redondo(g, -132, -276, 264, 520, 28);
  g.fillStyle = "#241428";
  g.fill();
  // una botonera grande, no una captura de una app real
  g.fillStyle = "#f2c14e";
  g.beginPath();
  g.arc(0, -20, 70, 0, 6.2832);
  g.fill();
  g.fillStyle = "#1a1204";
  g.font = "800 64px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("TV", 0, -20);
  g.fillStyle = "#3a3148";
  g.beginPath();
  g.arc(-70, 120, 28, 0, 6.2832);
  g.arc(70, 120, 28, 0, 6.2832);
  g.arc(0, 190, 28, 0, 6.2832);
  g.fill();
  const pulso = 0.35 + 0.25 * Math.sin(t * 5);
  g.globalCompositeOperation = "lighter";
  g.fillStyle = `rgba(242,193,78,${pulso})`;
  g.beginPath();
  g.arc(0, -20, 100, 0, 6.2832);
  g.fill();
  g.restore();
}

const BLOQUES = [
  [40, 1180, 160, 740, "#2a1248"],
  [190, 1040, 200, 880, "#3a1860"],
  [400, 900, 240, 1020, "#241040"],
  [660, 1100, 180, 820, "#401848"],
  [850, 980, 200, 940, "#2c1450"],
];
const azC = azar(77);
export const VENTANAS = BLOQUES.flatMap(([x, y, w, h]) =>
  Array.from({ length: 7 }, () => ({
    x: x + 14 + azC() * (w - 40),
    y: y + 24 + azC() * (h - 90),
    w: 14 + azC() * 16,
    h: 16 + azC() * 20,
    on: azC() > 0.38,
  })),
);

export function ciudad(g, t, salto) {
  const cielo = g.createLinearGradient(0, 0, 0, 1920);
  cielo.addColorStop(0, "#1a0a3a");
  cielo.addColorStop(0.4, "#c2416a");
  cielo.addColorStop(0.62, "#ff8a3d");
  cielo.addColorStop(1, "#2a1230");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1920);
  for (const [x, y, w, h, c] of BLOQUES) {
    g.fillStyle = c;
    g.fillRect(x, y, w, h);
  }
  for (const v of VENTANAS) {
    g.fillStyle = v.on ? "rgba(255,214,120,0.9)" : "rgba(20,8,30,0.5)";
    g.fillRect(v.x, v.y, v.w, v.h);
  }
  // torre de verdad. El 3 queda debajo del subtítulo (y 318–482).
  const tx = 540;
  const base = 1560;
  const h = 820;
  g.strokeStyle = "#ff4d6a";
  g.lineWidth = 16;
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(tx - 70, base);
  g.lineTo(tx - 16, base - h);
  g.lineTo(tx + 16, base - h);
  g.lineTo(tx + 70, base);
  g.stroke();
  g.fillStyle = "#ff4d6a";
  for (let i = 0; i < 6; i++) {
    g.fillRect(tx - 8, base - 160 - i * 130, 16, 28);
  }
  g.globalCompositeOperation = "lighter";
  const pul = 0.55 + 0.45 * Math.sin(t * 6);
  g.fillStyle = `rgba(255,70,90,${0.35 * pul})`;
  g.beginPath();
  g.arc(tx, base - h, 120, 0, 6.2832);
  g.fill();
  g.globalCompositeOperation = "source-over";
  numero(g, "3", tx, base - h + 70, 150, 1, "#ffe6ea");
  // la torre pequeña, a un lado, salta al 4 y se queda debajo del subtítulo
  const lx = mez(230, 840, su(salto));
  const ly = 1360;
  torre(g, lx, ly, 240, t, salto > 0.5 ? "#7dffa8" : "#f2c14e");
  numero(g, salto > 0.55 ? "4" : "3", lx, ly - 300, 110, 1, salto > 0.55 ? "#d8ffe8" : "#fff6d8");
}
