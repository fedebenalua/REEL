// El salón, la tele, la barra, el mando y el cable. Lo comparten los planos: siempre la misma cosa.
import * as k from "#kit";

export const ANCLA = 980;
export const TV = { x: 120, y: 545, w: 840, h: 470 };
export const OJO = { x: 540, y: 1004 };
export const BAR = { x: 150, y: 1148, w: 780, h: 156 };
export const CABLE = { x: 790, y: 1088 };
export const PUCK = { x: 196, y: 1355, w: 150, h: 78 };

const az = k.azar(19);
const GOTAS = Array.from({ length: 7 }, () => ({
  x: 0.12 + az() * 0.76,
  y: 0.15 + az() * 0.7,
  r: 0.16 + az() * 0.28,
  f: az() * 6.28,
  c: ["255,70,120", "70,190,255", "255,190,60", "150,90,255", "60,230,170"][Math.floor(az() * 5)],
}));

export function conCamara(g, cam, fn) {
  g.save();
  g.translate(540, ANCLA);
  g.scale(cam.z, cam.z);
  g.translate(-cam.x, -cam.y);
  fn();
  g.restore();
}

export function fondo(g, cam, apagado = 0) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, k.mezColor("#1a0d2e", "#100818", apagado));
  gr.addColorStop(0.45, k.mezColor("#3a1d4a", "#1a1024", apagado));
  gr.addColorStop(1, "#100810");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  const lx = 180 - (cam.x - 540) * 0.15, ly = 620 - (cam.y - 1050) * 0.1;
  k.brillo(g, lx, ly, 900, "255,170,90", 0.55 * (1 - apagado * 0.85));
  k.brillo(g, 980, 420, 520, "90,140,255", 0.22 * (1 - apagado));
}

export function suelo(g, apagado = 0) {
  g.fillStyle = "#24100c";
  g.fillRect(-200, 1480, 1600, 700);
  k.redondo(g, 40, 1505, 1000, 280, 80);
  g.fillStyle = k.mezColor("#9a4038", "#4a2420", apagado);
  g.fill();
  g.save();
  k.redondo(g, 40, 1505, 1000, 280, 80);
  g.clip();
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, 40, 1480, 1000, 340);
  g.restore();
  g.strokeStyle = "rgba(255,220,180,0.35)";
  g.lineWidth = 8;
  k.redondo(g, 70, 1540, 940, 210, 60);
  g.stroke();
}

function pantalla(g, t, apagado) {
  const x = TV.x + 28, y = TV.y + 26, w = TV.w - 56, h = TV.h - 130;
  g.save();
  k.redondo(g, x, y, w, h, 18);
  g.clip();
  g.fillStyle = k.mezColor("#120818", "#07060a", apagado);
  g.fillRect(x, y, w, h);
  g.globalAlpha = 1 - apagado;
  g.globalCompositeOperation = "lighter";
  for (const b of GOTAS) {
    const px = x + ((b.x + t * 0.04) % 1) * w;
    const py = y + (b.y + 0.08 * Math.sin(t * 1.4 + b.f)) * h;
    const r = b.r * w * (0.85 + 0.15 * Math.sin(t * 2 + b.f));
    const rg = g.createRadialGradient(px, py, 0, px, py, r);
    rg.addColorStop(0, `rgba(${b.c},0.95)`);
    rg.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = rg;
    g.beginPath();
    g.arc(px, py, r, 0, 6.2832);
    g.fill();
  }
  g.restore();
  g.save();
  k.redondo(g, x, y, w, h, 18);
  g.clip();
  const vg = g.createLinearGradient(x, y, x + w, y + h);
  vg.addColorStop(0, "rgba(255,255,255,0.16)");
  vg.addColorStop(0.25, "rgba(255,255,255,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.25)");
  g.fillStyle = vg;
  g.fillRect(x, y, w, h);
  g.restore();
}

export function tele(g, t, apagado, mudo) {
  g.save();
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 40;
  g.shadowOffsetY = 24;
  k.redondo(g, TV.x, TV.y, TV.w, TV.h, 36);
  g.fillStyle = "#16141c";
  g.fill();
  g.restore();
  k.redondo(g, TV.x, TV.y, TV.w, TV.h, 36);
  k.metal(g, TV.x, TV.x + TV.w, ["#2a2832", "#8d8a96", "#3a3842", "#d9d6e0", "#1a1820"]);
  pantalla(g, t, apagado);
  const sy = TV.y + TV.h - 52;
  altavoz(g, TV.x + 150, sy, mudo);
  altavoz(g, TV.x + TV.w - 150, sy, mudo);
  const o = 1 - apagado;
  g.beginPath();
  g.arc(OJO.x, OJO.y, 11, 0, 6.2832);
  g.fillStyle = `rgba(20,8,30,1)`;
  g.fill();
  g.beginPath();
  g.arc(OJO.x, OJO.y, 5, 0, 6.2832);
  g.fillStyle = `rgba(180,90,255,${0.25 * o})`;
  g.fill();
  if (apagado > 0.4) {
    g.beginPath();
    g.arc(TV.x + 48, TV.y + TV.h - 28, 9, 0, 6.2832);
    g.fillStyle = `rgba(255,170,60,${apagado})`;
    g.fill();
  }
}

function altavoz(g, x, y, mudo) {
  g.save();
  g.beginPath();
  g.arc(x, y, 46, 0, 6.2832);
  g.fillStyle = "#0c0c12";
  g.fill();
  g.beginPath();
  g.arc(x, y, 32, 0, 6.2832);
  const vivo = 1 - mudo;
  const rg = g.createRadialGradient(x - 6, y - 8, 2, x, y, 32);
  rg.addColorStop(0, `rgba(220,230,255,${0.2 + vivo * 0.55})`);
  rg.addColorStop(1, k.mezColor("#3a3a48", "#140810", 1 - vivo));
  g.fillStyle = rg;
  g.fill();
  if (mudo > 0.02) {
    g.globalAlpha = mudo;
    g.strokeStyle = "#ff3358";
    g.lineWidth = 12;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(x - 30, y - 30);
    g.lineTo(x + 30, y + 30);
    g.stroke();
    g.beginPath();
    g.arc(x, y, 40, 0, 6.2832);
    g.lineWidth = 8;
    g.stroke();
  }
  g.restore();
}

export function anillos(g, t, fuerza) {
  if (fuerza < 0.02) return;
  const cx = BAR.x + BAR.w / 2, cy = BAR.y + BAR.h / 2;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const u = (t * 0.85 + i / 4) % 1;
    const a = (1 - u) * (1 - u) * fuerza * 0.7;
    const rx = 70 + u * 460;
    g.beginPath();
    g.ellipse(cx, cy, rx, rx * 0.22, 0, 0, 6.2832);
    g.strokeStyle = i % 2 ? `rgba(255,80,160,${a})` : `rgba(70,220,255,${a})`;
    g.lineWidth = 16 * (1 - u * 0.6);
    g.stroke();
  }
  g.restore();
}

export function barra(g, t, fuerza, apagado) {
  const { x, y, w, h } = BAR;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 30;
  g.shadowOffsetY = 16;
  k.redondo(g, x, y, w, h, 40);
  g.fillStyle = "#121218";
  g.fill();
  g.restore();
  k.redondo(g, x, y, w, h, 40);
  k.metal(g, x, x + w, ["#1c1c24", "#6a6a78", "#2a2a34", "#b7b7c4", "#121218"]);
  const vivo = (1 - apagado) * (0.35 + 0.65 * Math.min(1, fuerza));
  for (let i = 0; i < 5; i++) {
    const cx = x + 110 + i * 140, cy = y + h / 2;
    const pulso = 1 + 0.08 * Math.sin(t * 14 + i) * fuerza * (1 - apagado);
    g.beginPath();
    g.arc(cx, cy, 42 * pulso, 0, 6.2832);
    g.fillStyle = "#0c0c10";
    g.fill();
    const rg = g.createRadialGradient(cx - 8, cy - 10, 4, cx, cy, 36);
    rg.addColorStop(0, `rgba(210,230,255,${0.25 + vivo * 0.4})`);
    rg.addColorStop(0.5, `rgba(40,40,60,${0.9})`);
    rg.addColorStop(1, "#050508");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(cx, cy, 34 * pulso, 0, 6.2832);
    g.fill();
    g.beginPath();
    g.arc(cx, cy, 8, 0, 6.2832);
    g.fillStyle = `rgba(${k.mezRgb("40,40,50", "120,255,240", vivo)})`;
    g.fill();
  }
  if (apagado > 0.4) {
    g.beginPath();
    g.arc(x + w - 36, y + h / 2, 6, 0, 6.2832);
    g.fillStyle = `rgba(255,170,60,${apagado})`;
    g.fill();
  }
}

export function puck(g, apagado) {
  const { x, y, w, h } = PUCK;
  k.redondo(g, x, y, w, h, 18);
  g.fillStyle = "#1a1a22";
  g.fill();
  k.redondo(g, x, y, w, h, 18);
  k.metal(g, x, x + w, ["#22222c", "#9aa0aa", "#33333c", "#e6e8ee", "#16161c"]);
  g.beginPath();
  g.arc(x + w - 28, y + h / 2, 7, 0, 6.2832);
  g.fillStyle = `rgb(${k.mezRgb("80,255,180", "255,170,60", apagado)})`;
  g.fill();
}

export function cableSala(g, t, flujo) {
  g.save();
  g.lineCap = "round";
  g.lineWidth = 28;
  g.strokeStyle = "#1a120e";
  g.beginPath();
  g.moveTo(700, 1010);
  g.bezierCurveTo(860, 1020, 900, 1040, 860, 1160);
  g.stroke();
  g.lineWidth = 10;
  g.strokeStyle = `rgba(255,196,70,${0.15 + flujo * 0.85})`;
  g.stroke();
  if (flujo > 0.05) {
    const u = (t * 0.8) % 1;
    const p = puntoCable(u);
    k.brillo(g, p.x, p.y, 80, "255,200,80", flujo);
  }
  g.restore();
}

function puntoCable(u) {
  const bez = (a, b, c, d, t) => {
    const m = 1 - t;
    return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * d;
  };
  return { x: bez(700, 860, 900, 860, u), y: bez(1010, 1020, 1040, 1160, u) };
}

export function puntaMando(ang) {
  const x = 690, y = 1365, h = 500;
  const ly = -h / 2 + 8;
  return [x + -ly * Math.sin(ang), y + ly * Math.cos(ang)];
}

export function mando(g, t, ang, pulsa, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha = al;
  g.translate(690, 1365);
  g.rotate(ang);
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 18;
  k.redondo(g, -105, -250, 210, 500, 48);
  g.fillStyle = "#141418";
  g.fill();
  g.shadowColor = "transparent";
  k.redondo(g, -105, -250, 210, 500, 48);
  k.metal(g, -105, 105, ["#222228", "#7c7c88", "#2e2e36", "#d5d5de", "#121216"]);
  k.redondo(g, -28, -228, 56, 22, 10);
  g.fillStyle = "#2a0818";
  g.fill();
  const by = -150 + (pulsa === "power" ? 6 : 0);
  g.beginPath();
  g.arc(0, by, 32, 0, 6.2832);
  g.fillStyle = "#e10600";
  g.fill();
  g.strokeStyle = "#fff";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(0, by + 2, 12, 0.7, 2.45);
  g.stroke();
  g.beginPath();
  g.moveTo(0, by - 16);
  g.lineTo(0, by + 2);
  g.stroke();
  g.beginPath();
  g.arc(0, 10, 54, 0, 6.2832);
  g.fillStyle = "#0e0e12";
  g.fill();
  g.beginPath();
  g.arc(0, 10, 16, 0, 6.2832);
  g.fillStyle = "#3a3a44";
  g.fill();
  const vy = pulsa === "vol" ? -6 : 0;
  k.redondo(g, 78, -40 + vy, 22, 90, 10);
  g.fillStyle = "#c8c8d2";
  g.fill();
  g.restore();
}

export function mandosSofa(g) {
  const piezas = [
    { x: 250, tono: ["#16161c", "#6e6e7a", "#222228", "#c8c8d2", "#101014"] },
    { x: 500, tono: ["#c5c8d0", "#f4f6fa", "#8e95a0", "#ffffff", "#9aa1ab"] },
    { x: 760, tono: ["#3a1218", "#a85a62", "#5a2028", "#f0c0c4", "#2a0c10"] },
  ];
  for (const p of piezas) {
    g.save();
    g.translate(p.x, 1625);
    g.rotate(p.x === 500 ? 0.06 : -0.08);
    k.redondo(g, -48, -100, 96, 200, 24);
    g.fillStyle = p.tono[0];
    g.fill();
    k.redondo(g, -48, -100, 96, 200, 24);
    k.metal(g, -48, 48, p.tono);
    g.beginPath();
    g.arc(0, -58, 16, 0, 6.2832);
    g.fillStyle = "#e10600";
    g.fill();
    k.redondo(g, -16, -10, 32, 70, 10);
    g.fillStyle = "#0e0e12";
    g.fill();
    g.restore();
  }
}

export function haz(g, x0, y0, x1, y1, u, color, al) {
  if (al < 0.02 || u <= 0) return;
  const x = k.mez(x0, x1, Math.min(1, u)), y = k.mez(y0, y1, Math.min(1, u));
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(${color},${al})`;
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x0, y0);
  g.lineTo(x, y);
  g.stroke();
  g.restore();
  k.brillo(g, x, y, 140, color, al);
}

export function velo(g) {
  const vg = g.createLinearGradient(0, 180, 0, 560);
  vg.addColorStop(0, "rgba(8,4,16,0.78)");
  vg.addColorStop(1, "rgba(8,4,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 560);
}

export function aPantalla(cam, x, y) {
  return { x: 540 + (x - cam.x) * cam.z, y: ANCLA + (y - cam.y) * cam.z };
}
