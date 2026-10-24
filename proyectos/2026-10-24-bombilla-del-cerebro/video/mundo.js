// El cerebro de este vídeo, la bombilla, la botella, la persona, la casa y la cama.
// El cerebro es una cosa de luz ámbar: el gasto, no un esquema. Si sale en más de un plano, sale de aquí.
import * as k from "#kit";

const az = k.azar(77);

export const PUNTOS = [];
const pliegue = (x, y, z) =>
  Math.sin(9 * x + 3 * Math.sin(5 * z + 1.2)) * Math.sin(8 * y + 2.2 * z) + 0.5 * Math.sin(13 * z - 4 * x + 2 * y);

// Perfil de cerebro: fino en x, largo de delante (+) a atrás (−), con el cerebelo detrás y abajo.
function dentro(x, y, z) {
  const cerebroE = (x / 0.32) ** 2 + ((y - 0.04) / 0.48) ** 2 + ((z - 0.02) / 0.58) ** 2;
  const cerebelo = (x / 0.26) ** 2 + ((y + 0.2) / 0.2) ** 2 + ((z + 0.46) / 0.22) ** 2;
  if (cerebelo <= 1) return cerebelo;
  if (cerebroE > 1) return -1;
  if (y < -0.28 && z > -0.02) return -1;
  return cerebroE;
}

while (PUNTOS.length < 6800) {
  const x = (az() - 0.5) * 0.8, y = (az() - 0.35) * 1.35, z = (az() - 0.35) * 1.5;
  const e = dentro(x, y, z);
  if (e < 0) continue;
  const cerebelo = z < -0.28 && y < 0.02;
  if (cerebelo && Math.abs(Math.sin(y * 46)) > 0.62) continue;
  const sup = e > 0.55;
  if (!sup && az() > 0.2) continue;
  const surco = sup && !cerebelo && Math.abs(pliegue(x, y, z)) > 0.5;
  let zona = 0;
  if (z > 0.22 && y > -0.05) zona = 1;
  else if (z < -0.28) zona = 2;
  else if (y > 0.22) zona = 3;
  const c = surco ? "140,52,36" : cerebelo ? "255,154,92" : sup ? (az() < 0.6 ? "255,196,84" : "255,122,64") : "196,96,52";
  PUNTOS.push({ p: [x, y, z], b: surco ? 0.95 : 0.55 + az() * 0.45, c, zona, surco });
}
for (let i = 0; i < 140; i++) {
  const u = az(), a = az() * 6.2832;
  PUNTOS.push({ p: [0.06 * Math.cos(a), -0.22 - 0.38 * u, -0.08 + 0.05 * Math.sin(a)], b: 0.55, c: "255,140,100", zona: 0, solido: 1 });
}

export const ZONA = { habla: [0, 0.08, 0.38], vista: [0, -0.05, -0.5], mano: [0, 0.34, 0.02] };

export const CHISPAS = [];
for (let i = 0; i < 42; i++) {
  const a = PUNTOS[(az() * PUNTOS.length) | 0], b = PUNTOS[(az() * PUNTOS.length) | 0];
  if (k.largo(k.res(a.p, b.p)) < 0.42) CHISPAS.push({ a: a.p, b: b.p, f: az(), v: 0.4 + az() * 0.55 });
}

const enIsla = (p) => p[2] > 0.16 && p[1] > -0.08;

// estado: apagado 0–1, isla 0–1 (lo que queda encendido), cae 0–1 (lo apagado se cae),
// g1 g2 g3 0–1 (el golpe ya apagó esa zona), al 0–1.
function trazoCerebro(g, s) {
  g.beginPath();
  g.moveTo(-s * 0.02, s * 0.48);
  g.bezierCurveTo(-s * 0.2, s * 0.3, -s * 0.62, s * 0.2, -s * 0.7, -s * 0.05);
  g.bezierCurveTo(-s * 0.82, -s * 0.38, -s * 0.48, -s * 0.68, -s * 0.05, -s * 0.64);
  g.bezierCurveTo(s * 0.28, -s * 0.7, s * 0.62, -s * 0.5, s * 0.64, -s * 0.16);
  g.bezierCurveTo(s * 0.66, s * 0.05, s * 0.4, s * 0.14, s * 0.26, s * 0.18);
  g.bezierCurveTo(s * 0.5, s * 0.28, s * 0.52, s * 0.52, s * 0.18, s * 0.56);
  g.bezierCurveTo(0, s * 0.6, -s * 0.04, s * 0.52, -s * 0.02, s * 0.48);
  g.closePath();
}

function pintaOrgano(g, s, t) {
  trazoCerebro(g, s);
  const base = g.createRadialGradient(-s * 0.2, -s * 0.25, s * 0.05, 0, 0, s * 0.85);
  base.addColorStop(0, "#ffd7a4");
  base.addColorStop(0.45, "#ff8a3c");
  base.addColorStop(1, "#c2412a");
  g.fillStyle = base; g.fill();
  g.save(); g.clip();
  // surcos: lo que hace que se lea como cerebro y no como una cabeza
  g.strokeStyle = "rgba(90,24,18,0.8)"; g.lineWidth = Math.max(4, s * 0.035); g.lineCap = "round";
  const surcos = [
    [-0.55, -0.28, -0.2, -0.48, 0.15, -0.3],
    [-0.4, -0.05, -0.05, -0.22, 0.28, -0.02],
    [-0.35, 0.18, 0.0, 0.02, 0.3, 0.16],
    [0.05, -0.45, 0.28, -0.2, 0.4, 0.05],
    [-0.15, -0.55, -0.35, -0.2, -0.2, 0.1],
  ];
  for (const q of surcos) {
    g.beginPath();
    g.moveTo(q[0] * s, q[1] * s);
    g.quadraticCurveTo(q[2] * s, q[3] * s, q[4] * s, q[5] * s);
    g.stroke();
  }
  // lóbulos de luz que se desplazan un poco: el órgano no se queda quieto
  g.globalCompositeOperation = "lighter";
  const dx = Math.sin(t * 1.6) * s * 0.06;
  g.fillStyle = "rgba(255,220,150,0.28)";
  g.beginPath(); g.ellipse(-s * 0.28 + dx, -s * 0.22, s * 0.22, s * 0.16, -0.4, 0, 6.29); g.fill();
  g.beginPath(); g.ellipse(s * 0.12 - dx, -s * 0.18, s * 0.2, s * 0.14, 0.3, 0, 6.29); g.fill();
  g.restore();
  // cerebelo, rayado, detrás y abajo
  g.save();
  g.translate(s * 0.3, s * 0.34);
  g.fillStyle = "#ffb060";
  g.beginPath(); g.ellipse(0, 0, s * 0.24, s * 0.16, -0.3, 0, 6.29); g.fill();
  g.strokeStyle = "rgba(120,40,24,0.85)"; g.lineWidth = Math.max(2, s * 0.018);
  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.moveTo(-s * 0.18, i * s * 0.045);
    g.quadraticCurveTo(0, i * s * 0.045 + s * 0.02, s * 0.18, i * s * 0.04);
    g.stroke();
  }
  g.restore();
  // tronco
  g.fillStyle = "#e07048";
  g.fillRect(-s * 0.06, s * 0.42, s * 0.1, s * 0.16);
  g.strokeStyle = "rgba(255,236,210,0.85)"; g.lineWidth = Math.max(3, s * 0.02);
  trazoCerebro(g, s); g.stroke();
}

export function cerebro(g, cam, t, st = {}) {
  const ap = st.apagado || 0, cae = st.cae || 0, al0 = st.al ?? 1;
  const g1 = st.g1 || 0, g2 = st.g2 || 0, g3 = st.g3 || 0;
  if (al0 < 0.01) return;
  const C = k.proyecta(cam, [0, 0, 0]);
  if (!C) return;
  const s = (k.F * 1.05) / C.z;
  k.brillo(g, C.x, C.y, s * 2.1, "255,150,60", 0.28 * al0 * (1 - ap * 0.7));
  g.save(); g.translate(C.x, C.y); g.globalAlpha = al0;
  pintaOrgano(g, s, t);
  // se apaga por detrás, sin partir el órgano: el frente sigue encendido
  if (ap > 0.02) {
    g.save(); trazoCerebro(g, s); g.clip();
    const veloOsc = g.createLinearGradient(-s * 0.15, 0, s * 0.7, 0);
    veloOsc.addColorStop(0, "rgba(8,4,12,0)");
    veloOsc.addColorStop(1, `rgba(8,4,12,${0.94 * ap})`);
    g.fillStyle = veloOsc; g.fillRect(-s, -s, s * 2, s * 2);
    g.restore();
  }
  // lo que «sobra» se desprende del borde de atrás y cae
  if (cae > 0.02) {
    const trozos = [[0.42, -0.28], [0.5, 0.02], [0.28, 0.36], [0.12, -0.4]];
    trozos.forEach((p, i) => {
      const y = p[1] * s + cae * s * (0.7 + i * 0.18);
      const al = al0 * (1 - cae) * (0.4 + 0.6 * ap);
      g.globalAlpha = al;
      g.fillStyle = "#9a4030";
      g.beginPath(); g.ellipse(p[0] * s, y, s * 0.12, s * 0.09, i, 0, 6.29); g.fill();
    });
  }
  const mancha = (x, y, rx, ry, u) => {
    if (u < 0.02) return;
    g.fillStyle = `rgba(90,10,16,${0.62 * u})`;
    g.beginPath(); g.ellipse(x * s, y * s, rx * s, ry * s, 0, 0, 6.29); g.fill();
  };
  g.globalAlpha = al0;
  mancha(-0.28, -0.05, 0.28, 0.24, g1);
  mancha(0.22, 0.05, 0.3, 0.26, g2);
  mancha(0.0, -0.32, 0.34, 0.18, g3);
  g.restore();
}

export function chispas(g, cam, t, al) {
  if (al < 0.02) return;
  const C = k.proyecta(cam, [0, 0, 0]);
  if (!C) return;
  const s = (k.F * 0.85) / C.z;
  for (let i = 0; i < 7; i++) {
    const a = t * 0.9 + i * 1.4;
    k.brillo(g, C.x + Math.cos(a) * s * 0.32, C.y + Math.sin(a * 1.3) * s * 0.24, 40 + 18 * Math.sin(a), "255,210,140", al * 0.45);
  }
}

export function velo(g, fuerza = 0.62) {
  const vg = g.createLinearGradient(0, 180, 0, 620);
  vg.addColorStop(0, `rgba(6,4,12,${fuerza})`); vg.addColorStop(1, "rgba(6,4,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

export function fondo(g, noche, calor = 1) {
  const n = Math.max(0, Math.min(1, noche));
  g.fillStyle = "#07060d"; g.fillRect(0, 0, 1080, 1920);
  const cielo = g.createLinearGradient(0, 0, 0, 1500);
  cielo.addColorStop(0, k.mezColor("#ff8a3a", "#07091a", n));
  cielo.addColorStop(0.45, k.mezColor("#5a2a62", "#120a22", n));
  cielo.addColorStop(1, "#07060c");
  g.fillStyle = cielo; g.fillRect(0, 0, 1080, 1920);
  // sol que se pone, luna que sale
  const solY = k.mez(780, 1680, n), lunY = k.mez(1700, 620, n);
  g.save(); g.globalCompositeOperation = "lighter";
  g.fillStyle = `rgba(255,214,120,${0.9 * (1 - n)})`; g.beginPath(); g.arc(280, solY, 90, 0, 6.29); g.fill();
  g.fillStyle = `rgba(210,220,255,${0.85 * n})`; g.beginPath(); g.arc(800, lunY, 64, 0, 6.29); g.fill();
  g.restore();
  k.brillo(g, 280, solY, 700, "255,190,90", 0.45 * (1 - n) * calor);
  k.brillo(g, 800, lunY, 420, "180,200,255", 0.35 * n);
}

// Bombilla de tungsteno. h en píxeles, y = centro del vidrio. fuerza: lo encendida que está.
export function bombilla(g, x, y, h, t, al = 1, fuerza = 1) {
  if (al < 0.015 || h < 6) return;
  const w = h * 0.62;
  k.brillo(g, x, y - h * 0.02, h * 3.4, "255,176,70", 0.62 * al * fuerza);
  g.save(); g.translate(x, y); g.globalAlpha = al;
  g.beginPath();
  g.moveTo(0, -h * 0.46);
  g.bezierCurveTo(w * 0.62, -h * 0.4, w * 0.58, h * 0.02, w * 0.2, h * 0.2);
  g.lineTo(w * 0.13, h * 0.28); g.lineTo(-w * 0.13, h * 0.28); g.lineTo(-w * 0.2, h * 0.2);
  g.bezierCurveTo(-w * 0.58, h * 0.02, -w * 0.62, -h * 0.4, 0, -h * 0.46);
  g.closePath();
  const vg = g.createRadialGradient(-w * 0.18, -h * 0.16, h * 0.04, 0, 0, w * 0.75);
  vg.addColorStop(0, `rgba(255,248,230,${0.72 * fuerza})`);
  vg.addColorStop(0.35, `rgba(255,196,90,${0.38 * fuerza})`);
  vg.addColorStop(0.75, `rgba(255,150,50,${0.14 * fuerza})`);
  vg.addColorStop(1, "rgba(80,40,20,0.18)");
  g.fillStyle = vg; g.fill();
  g.strokeStyle = "rgba(255,236,210,0.75)"; g.lineWidth = Math.max(2, h * 0.016); g.stroke();
  // reflejo de cristal
  g.fillStyle = "rgba(255,255,255,0.38)";
  g.beginPath(); g.ellipse(-w * 0.22, -h * 0.16, w * 0.08, h * 0.16, -0.4, 0, 6.29); g.fill();
  // filamento
  g.save(); g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(255,252,235,${0.95 * fuerza})`; g.lineWidth = Math.max(2, h * 0.022); g.lineJoin = "round";
  g.beginPath();
  const yf = h * 0.02;
  g.moveTo(-w * 0.16, yf + h * 0.08);
  g.lineTo(-w * 0.16, yf);
  for (let i = 0; i < 6; i++) {
    const xx = -w * 0.16 + i * (w * 0.32 / 6);
    const tembl = h * 0.012 * Math.sin(t * 23 + i);
    g.lineTo(xx + w * 0.028, yf - h * 0.14 + tembl);
    g.lineTo(xx + w * 0.055, yf);
  }
  g.lineTo(w * 0.16, yf + h * 0.08);
  g.stroke();
  g.restore();
  // casquillo
  g.beginPath(); g.rect(-w * 0.16, h * 0.28, w * 0.32, h * 0.16); g.closePath();
  k.metal(g, -w * 0.16, w * 0.16, ["#5c534c", "#d9d0c6", "#8a8178", "#f2ebe3", "#4a433e"]);
  g.strokeStyle = "rgba(40,30,24,0.55)"; g.lineWidth = Math.max(1, h * 0.012);
  for (let i = 0; i < 3; i++) {
    const yy = h * 0.32 + i * h * 0.04;
    g.beginPath(); g.moveTo(-w * 0.16, yy); g.lineTo(w * 0.16, yy); g.stroke();
  }
  g.restore();
}

// Botella de litro, con agua. h = alto en píxeles. y = centro.
export function botella(g, x, y, h, al = 1) {
  if (al < 0.015 || h < 8) return;
  const w = h * 0.36;
  g.save(); g.translate(x, y); g.globalAlpha = al;
  // cuerpo
  g.beginPath();
  g.moveTo(-w * 0.28, -h * 0.18);
  g.lineTo(-w * 0.22, -h * 0.34);
  g.lineTo(-w * 0.22, -h * 0.42);
  g.lineTo(w * 0.22, -h * 0.42);
  g.lineTo(w * 0.22, -h * 0.34);
  g.lineTo(w * 0.28, -h * 0.18);
  g.quadraticCurveTo(w * 0.62, -h * 0.05, w * 0.58, h * 0.22);
  g.lineTo(w * 0.5, h * 0.42);
  g.quadraticCurveTo(0, h * 0.5, -w * 0.5, h * 0.42);
  g.lineTo(-w * 0.58, h * 0.22);
  g.quadraticCurveTo(-w * 0.62, -h * 0.05, -w * 0.28, -h * 0.18);
  g.closePath();
  const ag = g.createLinearGradient(-w, 0, w, 0);
  ag.addColorStop(0, "rgba(120,190,230,0.45)"); ag.addColorStop(0.45, "rgba(190,230,255,0.2)"); ag.addColorStop(1, "rgba(70,140,190,0.4)");
  g.fillStyle = ag; g.fill();
  // agua
  g.save(); g.clip();
  const agua = g.createLinearGradient(0, h * 0.05, 0, h * 0.46);
  agua.addColorStop(0, "rgba(90,190,255,0.55)"); agua.addColorStop(1, "rgba(20,90,170,0.72)");
  g.fillStyle = agua; g.fillRect(-w, h * 0.02, w * 2, h);
  g.globalCompositeOperation = "screen"; g.globalAlpha = al * 0.45;
  g.drawImage(k.causticas, -w, h * 0.02, w * 2.2, h * 0.5);
  g.restore();
  g.globalAlpha = al;
  g.beginPath();
  g.moveTo(-w * 0.28, -h * 0.18);
  g.lineTo(-w * 0.22, -h * 0.34); g.lineTo(-w * 0.22, -h * 0.42); g.lineTo(w * 0.22, -h * 0.42);
  g.lineTo(w * 0.22, -h * 0.34); g.lineTo(w * 0.28, -h * 0.18);
  g.quadraticCurveTo(w * 0.62, -h * 0.05, w * 0.58, h * 0.22);
  g.lineTo(w * 0.5, h * 0.42); g.quadraticCurveTo(0, h * 0.5, -w * 0.5, h * 0.42);
  g.lineTo(-w * 0.58, h * 0.22); g.quadraticCurveTo(-w * 0.62, -h * 0.05, -w * 0.28, -h * 0.18);
  g.closePath();
  k.vidrio(g, -w * 0.7, w * 0.7, 0.55);
  // tapón
  g.beginPath(); g.rect(-w * 0.26, -h * 0.5, w * 0.52, h * 0.09); g.closePath();
  k.metal(g, -w * 0.26, w * 0.26, ["#1d4e89", "#7eb6e0", "#2f6eab", "#d5ecff", "#163e70"]);
  g.restore();
}

// Busto sin cara: el cerebro, dibujado en el mundo, es la cabeza. hx, hy = centro del cerebro.
export function persona(g, hx, hy, r, al) {
  if (al < 0.02 || r < 8) return;
  g.save(); g.globalAlpha = al;
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath(); g.ellipse(hx, hy + r * 4.1, r * 1.7, r * 0.28, 0, 0, 6.29); g.fill();
  const piel = g.createLinearGradient(hx - r, hy, hx + r * 0.2, hy + r * 2);
  piel.addColorStop(0, "#f6c9ad"); piel.addColorStop(1, "#c98462");
  g.fillStyle = piel;
  g.beginPath();
  g.moveTo(hx - r * 0.28, hy + r * 0.62);
  g.quadraticCurveTo(hx - r * 0.1, hy + r * 1.05, hx - r * 0.36, hy + r * 1.25);
  g.lineTo(hx + r * 0.32, hy + r * 1.28);
  g.quadraticCurveTo(hx + r * 0.18, hy + r * 1.0, hx + r * 0.22, hy + r * 0.62);
  g.closePath(); g.fill();
  const tg = g.createLinearGradient(hx - r, hy + r, hx + r, hy + r * 4);
  tg.addColorStop(0, "#5cf0d4"); tg.addColorStop(0.45, "#129888"); tg.addColorStop(1, "#0b3e42");
  g.fillStyle = tg;
  g.beginPath();
  g.moveTo(hx - r * 0.4, hy + r * 1.2);
  g.quadraticCurveTo(hx - r * 1.85, hy + r * 1.45, hx - r * 1.7, hy + r * 2.5);
  g.lineTo(hx - r * 1.15, hy + r * 3.85);
  g.quadraticCurveTo(hx, hy + r * 4.15, hx + r * 1.2, hy + r * 3.85);
  g.lineTo(hx + r * 1.55, hy + r * 2.3);
  g.quadraticCurveTo(hx + r * 1.35, hy + r * 1.4, hx + r * 0.45, hy + r * 1.22);
  g.closePath(); g.fill();
  // un brazo, para que se entienda que es una persona
  g.fillStyle = "#e7a888";
  g.beginPath();
  g.moveTo(hx + r * 1.15, hy + r * 1.7);
  g.quadraticCurveTo(hx + r * 1.9, hy + r * 2.5, hx + r * 1.55, hy + r * 3.35);
  g.lineTo(hx + r * 1.15, hy + r * 3.2);
  g.quadraticCurveTo(hx + r * 1.35, hy + r * 2.4, hx + r * 0.85, hy + r * 1.85);
  g.fill();
  g.restore();
}

export function llama(g, x, y, h, t, fase, al = 1) {
  if (al < 0.02) return;
  k.lengua(g, x, y, h, h * 0.42, t, fase, "255,120,30", "255,220,120");
  k.brillo(g, x, y - h * 0.45, h * 1.6, "255,170,60", 0.45 * al);
}

// Casa de noche, en coordenadas de pantalla, con el origen arriba a la izquierda.
// lampara: 1 lámpara de pie, 0 lucecita. giro: radianes del disco. todas: 0–1, la casa entera se enciende.
// cual: 0–3, qué cuarto brilla más cuando todas > 0.
export function casa(g, lampara, giro, todas, cual) {
  const x0 = 150, y0 = 640, w = 780, h = 820, mx = x0 + w / 2, my = y0 + h / 2;
  // noche detrás
  g.fillStyle = "#100818"; g.fillRect(0, 0, 1080, 1920);
  const cielo = g.createLinearGradient(0, 0, 0, y0);
  cielo.addColorStop(0, "#1a1030"); cielo.addColorStop(1, "#07060e");
  g.fillStyle = cielo; g.fillRect(0, 0, 1080, y0 + 20);
  // muro exterior
  g.fillStyle = "#2a201c";
  k.redondo(g, x0 - 28, y0 - 28, w + 56, h + 70, 28); g.fill();
  const estuco = g.createLinearGradient(x0, y0, x0 + w, y0 + h);
  estuco.addColorStop(0, "#f3d7b4"); estuco.addColorStop(1, "#e2b48a");
  g.fillStyle = estuco;
  k.redondo(g, x0, y0, w, h, 18); g.fill();
  // cuatro cuartos
  const cuartos = [
    { x: x0 + 16, y: y0 + 16, nombre: 0 },
    { x: mx + 8, y: y0 + 16, nombre: 1 },
    { x: x0 + 16, y: my + 8, nombre: 2 },
    { x: mx + 8, y: my + 8, nombre: 3 },
  ];
  const rw = w / 2 - 28, rh = h / 2 - 28;
  cuartos.forEach((c, i) => {
    const principal = i === 3;
    const base = principal ? k.mez(1, 0.55 + 0.45 * (cual === 3 ? 1 : 0.7), todas) : todas * (0.45 + (cual === i ? 0.55 : 0.2));
    const luz = principal ? k.mez(0.25 + 0.75 * lampara, Math.max(base, 0.55), todas > 0.05 ? todas : 0) : base;
    // de noche el cuarto vivido depende de la lámpara; al encenderse la casa, manda «todas»
    const peso = Math.max(0, 1 - Math.abs(i - cual) / 2.2);
    const l = todas > 0.02 ? k.mez(principal ? 0.35 + 0.65 * lampara : 0.08, 0.38 + 0.62 * peso, todas) : (principal ? 0.22 + 0.78 * lampara : 0.08);
    g.fillStyle = k.mezColor("#1a2038", "#ffc48a", Math.min(1, l));
    g.fillRect(c.x, c.y, rw, rh);
    muebles(g, c.x, c.y, rw, rh, i, l, lampara);
  });
  // tabiques
  g.fillStyle = "#f7e6d2";
  g.fillRect(mx - 8, y0 + 10, 16, h - 20);
  g.fillRect(x0 + 10, my - 8, w - 20, 16);
  // contador, en el muro izquierdo
  contador(g, x0 - 8, my + 70, giro, 1);
}

function muebles(g, x, y, w, h, i, luz, lampara) {
  g.save(); g.globalAlpha = 0.9;
  if (i === 3) {
    // sofá y lámpara de pie (o lucecita)
    g.fillStyle = k.mezColor("#4a2060", "#ffb0c8", luz);
    k.redondo(g, x + 24, y + h * 0.55, w * 0.62, h * 0.28, 16); g.fill();
    const alt = k.mez(h * 0.62, h * 0.16, 1 - lampara);
    const ax = x + w * 0.78, ay = y + h * 0.78;
    if (lampara > 0.18) {
      g.strokeStyle = "#5a4030"; g.lineWidth = 6;
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax, ay - alt); g.stroke();
      k.brillo(g, ax, ay - alt - 18, 80 + 160 * lampara, "255,190,90", 0.8 * lampara * Math.max(luz, 0.4));
      g.fillStyle = "#fff4d2"; g.beginPath(); g.arc(ax, ay - alt - 10, 16 + 18 * lampara, 0, 6.29); g.fill();
    } else {
      // lucecita enchufada al rodapié
      g.fillStyle = "#f4e2b0";
      k.redondo(g, ax - 16, ay - 28, 32, 36, 6); g.fill();
      k.brillo(g, ax, ay - 10, 70, "255,210,140", 0.7);
    }
    // planta
    g.fillStyle = "#2f8f55"; g.beginPath(); g.ellipse(x + 36, y + 46, 22, 16, 0, 0, 6.29); g.fill();
    g.fillStyle = "#c47a3a"; g.fillRect(x + 26, y + 58, 20, 16);
  } else if (i === 0) {
    g.fillStyle = k.mezColor("#243056", "#d0d8ee", luz);
    k.redondo(g, x + 30, y + h * 0.42, w * 0.7, h * 0.32, 12); g.fill();
    g.fillStyle = "#7d8cb5"; g.fillRect(x + 40, y + h * 0.38, w * 0.28, h * 0.12);
  } else if (i === 1) {
    g.fillStyle = k.mezColor("#16343a", "#9ee0e0", luz);
    k.redondo(g, x + w * 0.55, y + 36, w * 0.32, h * 0.28, 10); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 4;
    g.strokeRect(x + 28, y + 40, w * 0.28, h * 0.36);
  } else {
    g.fillStyle = k.mezColor("#3a2418", "#e7b07a", luz);
    g.fillRect(x + 34, y + h * 0.48, w * 0.55, h * 0.12);
    g.fillRect(x + 48, y + h * 0.6, 10, h * 0.22);
    g.fillRect(x + w * 0.5, y + h * 0.6, 10, h * 0.22);
  }
  g.restore();
}

export function contador(g, x, y, giro, al = 1) {
  g.save(); g.translate(x, y); g.globalAlpha = al;
  g.fillStyle = "#1c1e24"; k.redondo(g, -70, -90, 140, 180, 16); g.fill();
  g.beginPath(); g.arc(0, -10, 52, 0, 6.29);
  k.metal(g, -52, 52, ["#2a3138", "#9aa4ae", "#e8eef2", "#6a727a"]);
  g.save(); g.beginPath(); g.arc(0, -10, 40, 0, 6.29); g.clip();
  g.fillStyle = "#10141a"; g.fillRect(-40, -50, 80, 80);
  g.translate(0, -10); g.rotate(giro);
  g.fillStyle = "#d7dee6"; g.fillRect(-28, -4, 56, 8);
  g.restore();
  g.fillStyle = "#f0c14a"; k.redondo(g, -36, 52, 72, 16, 4); g.fill();
  g.restore();
}

// Cama de noche. La bombilla va aparte, en la mesilla.
export function dormitorio(g, t, respirar) {
  g.fillStyle = "#070814"; g.fillRect(0, 0, 1080, 1920);
  const cielo = g.createLinearGradient(0, 0, 0, 900);
  cielo.addColorStop(0, "#141833"); cielo.addColorStop(1, "#070814");
  g.fillStyle = cielo; g.fillRect(0, 0, 1080, 1920);
  // luna en la ventana
  g.fillStyle = "#1a2744"; k.redondo(g, 620, 560, 300, 420, 16); g.fill();
  k.brillo(g, 790, 700, 220, "190,210,255", 0.4);
  g.fillStyle = "rgba(230,240,255,0.9)"; g.beginPath(); g.arc(800, 690, 36, 0, 6.29); g.fill();
  // cama
  g.fillStyle = "#3a2a22"; k.redondo(g, 120, 1080, 760, 420, 20); g.fill();
  g.fillStyle = "#f4f0ea"; k.redondo(g, 160, 1120, 680, 250, 16); g.fill();
  g.fillStyle = "#1aa58a"; g.fillRect(160, 1240, 680, 180);
  // almohada y cabeza
  g.fillStyle = "#fff"; k.redondo(g, 220, 1100, 260, 110, 20); g.fill();
  const pecho = 8 * Math.sin(t * 1.6) * respirar;
  g.fillStyle = "#f0b090";
  g.beginPath(); g.ellipse(360, 1160 - pecho * 0.2, 70, 64, 0, 0, 6.29); g.fill();
  // cuerpo bajo la manta, que sube al respirar
  g.fillStyle = "#128a74";
  g.beginPath(); g.ellipse(520, 1320 - pecho, 230, 90, 0, 0, 6.29); g.fill();
  // mesilla
  g.fillStyle = "#6b3e22"; k.redondo(g, 700, 1260, 220, 28, 6); g.fill();
  g.fillRect(730, 1288, 22, 160); g.fillRect(870, 1288, 22, 160);
}

// Ondas de voz que se parten. rotura 0–1.
export function habla(g, x, y, s, rotura, al) {
  if (al < 0.02) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const R = s * (0.28 + i * 0.18);
    const parte = Math.max(0, rotura - i * 0.08);
    g.strokeStyle = `rgba(255,190,90,${0.85 * al * (1 - parte)})`;
    g.lineWidth = 8 - i;
    g.beginPath(); g.arc(x, y, R, -0.9, 0.9); g.stroke();
    if (parte > 0) {
      g.strokeStyle = `rgba(255,120,80,${0.5 * al * parte})`;
      g.beginPath(); g.arc(x - 30 * parte, y + 40 * parte, R, 0.2, 1.1); g.stroke();
    }
  }
  g.restore();
}

// Ojo que se cierra. cierre 0 abierto, 1 cerrado.
export function ojo(g, x, y, s, cierre, al) {
  if (al < 0.02) return;
  g.save(); g.translate(x, y); g.globalAlpha = al;
  g.fillStyle = "#fff8f2";
  g.beginPath(); g.ellipse(0, 0, s * 0.52, s * 0.32, 0, 0, 6.29); g.fill();
  const iris = g.createRadialGradient(0, 0, s * 0.02, 0, 0, s * 0.2);
  iris.addColorStop(0, "#8fd18a"); iris.addColorStop(0.6, "#1f6b4a"); iris.addColorStop(1, "#0d2e22");
  g.fillStyle = iris; g.beginPath(); g.arc(0, 0, s * 0.18, 0, 6.29); g.fill();
  g.fillStyle = "#12080c"; g.beginPath(); g.arc(0, 0, s * 0.08, 0, 6.29); g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(-s * 0.05, -s * 0.05, s * 0.035, 0, 6.29); g.fill();
  // párpado
  g.fillStyle = "#e7b090";
  g.beginPath();
  g.ellipse(0, 0, s * 0.56, s * 0.36, 0, Math.PI, 0);
  g.ellipse(0, k.mez(-s * 0.05, s * 0.02, cierre), s * 0.56, s * 0.36 * k.mez(0.15, 1, cierre), 0, 0, Math.PI);
  // simpler lid: a rect growing down
  g.restore();
  g.save(); g.translate(x, y); g.globalAlpha = al;
  g.beginPath(); g.ellipse(0, 0, s * 0.56, s * 0.38, 0, 0, 6.29); g.clip();
  g.fillStyle = "#e8b494";
  g.fillRect(-s, -s * 0.5, s * 2, s * k.mez(0.08, 0.95, cierre));
  g.restore();
  g.save(); g.translate(x, y); g.globalAlpha = al;
  g.strokeStyle = "#c48468"; g.lineWidth = Math.max(3, s * 0.04);
  g.beginPath(); g.ellipse(0, 0, s * 0.56, s * 0.38, 0, 0, 6.29); g.stroke();
  g.restore();
}

// Mano que suelta un vaso. suelta 0 cerrado, 1 el vaso ya en el suelo (parado).
export function manoVaso(g, x, y, s, suelta, al) {
  if (al < 0.02) return;
  const cae = k.suave(Math.min(1, suelta * 1.15));
  g.save(); g.translate(x, y); g.globalAlpha = al;
  // antebrazo
  const pg = g.createLinearGradient(0, -s * 0.2, 0, s * 0.45);
  pg.addColorStop(0, "#f0b090"); pg.addColorStop(1, "#c47c5c");
  g.fillStyle = pg;
  k.redondo(g, -s * 0.18, -s * 0.55, s * 0.36, s * 0.7, s * 0.16); g.fill();
  // palma
  g.beginPath(); g.ellipse(0, s * 0.12, s * 0.28, s * 0.2, 0, 0, 6.29); g.fill();
  // dedos que se abren
  for (let i = 0; i < 4; i++) {
    const ang = k.mez(-0.6 + i * 0.35, -1.15 + i * 0.7, cae);
    g.save(); g.translate(-s * 0.18 + i * s * 0.12, s * 0.02); g.rotate(ang);
    g.fillRect(-s * 0.045, -s * 0.28, s * 0.09, s * 0.3);
    g.restore();
  }
  g.restore();
  // vaso: de la mano al suelo
  const vx = x + k.mez(0, s * 0.15, cae);
  const vy = y + k.mez(s * 0.28, s * 0.95, cae);
  const incl = k.mez(0, 0.5, cae) * (1 - k.suave(k.tramo(suelta, 0.75, 1)));
  g.save(); g.translate(vx, vy); g.rotate(incl); g.globalAlpha = al;
  g.fillStyle = "rgba(180,220,255,0.45)";
  g.beginPath();
  g.moveTo(-s * 0.12, -s * 0.22); g.lineTo(s * 0.12, -s * 0.22);
  g.lineTo(s * 0.09, s * 0.16); g.lineTo(-s * 0.09, s * 0.16); g.closePath(); g.fill();
  g.strokeStyle = "rgba(230,245,255,0.8)"; g.lineWidth = 3; g.stroke();
  g.restore();
}

export function rayas(g, t, al, vertical = 1) {
  if (al < 0.04) return;
  const rnd = k.azar(3);
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++) {
    const x = rnd() * 1080, y = (rnd() * 1920 + t * 900 * vertical) % 2100 - 100;
    const len = 80 + rnd() * 220;
    g.strokeStyle = `rgba(255,220,170,${0.18 * al})`; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - len * vertical); g.stroke();
  }
  g.restore();
}
