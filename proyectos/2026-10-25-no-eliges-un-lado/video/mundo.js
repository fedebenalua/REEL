// El mismo cerebro de luz en todos los planos, y las cosas de casa que se repiten: el bloque de cristal,
// la gota de pintura, la mesa, la mano y el escáner.
import * as k from "#kit";

export const AZUL = "90,200,255";
export const CORAL = "255,120,60";
export const ROSA = "255,156,178";
export const ORO = "255,196,90";

const az = k.azar(20261025);
const pliegue = (x, y, z) =>
  Math.sin(8.5 * y + 2.4 * Math.sin(5 * z + x)) * Math.sin(6.5 * z + 3 * x) + 0.4 * Math.sin(13 * y + 7 * z);

function enCorteza(x, y, z) {
  const ax = Math.abs(x);
  const xx = (ax - 0.06) / 0.56;
  const yy = (y - 0.02) / 0.64;
  const zz = (z + 0.02) / 0.78;
  const e = xx * xx + yy * yy + zz * zz;
  if (e > 1 || e < 0.68) return false;
  if (ax < 0.075) return false;
  if (y < -0.5) return false;
  if (y < -0.22 && z > 0.42) return false;
  if (e > 0.86 && Math.abs(pliegue(x, y, z)) > 0.62) return false;
  return true;
}

export const PUNTOS = [];
let guard = 0;
while (PUNTOS.length < 4600 && guard < 220000) {
  guard++;
  const x = (az() - 0.5) * 2.5, y = (az() - 0.42) * 1.7, z = (az() - 0.5) * 2.05;
  if (!enCorteza(x, y, z)) continue;
  PUNTOS.push({ x, y, z, b: 0.45 + az() * 0.55, lado: x < 0 ? -1 : 1, s: az() });
}
for (let i = 0; i < 700; i++) {
  const u = az() * 6.2832, w = (az() - 0.5) * 1.4;
  const x = 0.34 * Math.cos(w) * Math.cos(u);
  const y = -0.58 + 0.2 * Math.sin(w);
  const z = -0.28 + 0.34 * Math.cos(w) * Math.sin(u);
  if (Math.abs(Math.sin(y * 55 + x * 20)) > 0.55) continue;
  PUNTOS.push({ x, y, z, b: 0.55, lado: x < -0.02 ? -1 : x > 0.02 ? 1 : 0, s: az(), cerebelo: true });
}

export const CHISPAS = [];
for (let i = 0; i < 48; i++) {
  const a = PUNTOS[Math.floor(az() * 4000)] || PUNTOS[0];
  let b = null;
  for (let n = 0; n < 24; n++) {
    const c = PUNTOS[Math.floor(az() * PUNTOS.length)];
    const d = Math.hypot(a.x - c.x, a.y - c.y, a.z - c.z);
    if (d > 0.1 && d < 0.36 && a.lado === c.lado) { b = c; break; }
  }
  if (b) CHISPAS.push({ a, b, f: az(), v: 0.35 + az() * 0.7 });
}

// Un nudo delantero de la mitad izquierda, y seis vecinos pegados a él.
export const NUDO = [-0.4, 0.2, 0.48];
export const CERCA = [
  [-0.22, 0.28, 0.5],
  [-0.52, 0.08, 0.5],
  [-0.48, 0.36, 0.32],
  [-0.24, 0.06, 0.58],
  [-0.58, 0.22, 0.3],
  [-0.34, 0.38, 0.42],
];

export function velo(g, fuerza = 0.7) {
  const v = g.createLinearGradient(0, 200, 0, 580);
  v.addColorStop(0, `rgba(2,2,8,${fuerza})`);
  v.addColorStop(1, "rgba(2,2,8,0)");
  g.fillStyle = v;
  g.fillRect(0, 180, 1080, 420);
}

export function sala(g, frio = 0.5, calor = 0.5) {
  g.fillStyle = "#070612";
  g.fillRect(0, 0, 1080, 1920);
  const a = g.createRadialGradient(280, 820, 20, 480, 980, 1100);
  a.addColorStop(0, `rgba(40,90,200,${0.42 * frio})`);
  a.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = a;
  g.fillRect(0, 0, 1080, 1920);
  const b = g.createRadialGradient(820, 880, 20, 620, 1000, 1100);
  b.addColorStop(0, `rgba(210,80,30,${0.4 * calor})`);
  b.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = b;
  g.fillRect(0, 0, 1080, 1920);
}

function colorPunto(q, o) {
  const iz = q.lado < 0 ? o.iz || 0 : 0;
  const de = q.lado > 0 ? o.de || 0 : 0;
  let foco = 0;
  if (o.foco) {
    const d = Math.hypot(q.x - o.foco[0], q.y - o.foco[1], q.z - o.foco[2]);
    foco = d < (o.focoR || 0.34) ? (1 - d / (o.focoR || 0.34)) * (o.focoAl || 0) : 0;
  }
  const hot = Math.max(iz, de, foco);
  const unido = o.unido || 0;
  if (unido > 0.04) {
    const lado = q.lado < 0 ? [130, 200, 255] : q.lado > 0 ? [255, 150, 90] : [255, 176, 170];
    const comun = [255, 186, 154];
    const rgb = lado.map((c, i) => Math.round(c * (1 - unido) + comun[i] * unido));
    const pulso = (o.pulsoDer || 0) * (q.lado > 0 ? 1 : 0);
    return { rgb, a: Math.min(1, 0.38 + 0.55 * Math.max(hot, unido * 0.9) + 0.45 * pulso) };
  }
  if (o.mito) {
    const base = q.lado < 0 ? [70, 170, 255] : q.lado > 0 ? [255, 110, 60] : [255, 170, 190];
    return { rgb: base, a: 0.55 + 0.45 * hot };
  }
  if (hot > 0.18) {
    const c = foco > iz && foco > de ? [150, 230, 255] : q.lado < 0 ? [120, 210, 255] : [255, 140, 70];
    return { rgb: c, a: 0.35 + 0.7 * hot };
  }
  const rosa = q.cerebelo ? [230, 140, 160] : [255, 150, 176];
  return { rgb: rosa, a: 0.42 };
}

// sep: cuánto se abren las mitades. iz/de: 0 a 1, cuánto arde cada una. mito: cada mitad con su color desde el principio.
export function cerebro(g, cam, o = {}) {
  const sep = o.sep || 0;
  const al = o.al == null ? 1 : o.al;
  if (al < 0.02) return;
  const t = o.t || 0;
  g.save();
  g.globalAlpha = al * 0.9;
  for (const lado of [-1, 1]) {
    const P = k.proyecta(cam, [lado * (0.4 + sep), 0.0, 0.02]);
    if (!P) continue;
    const rx = (k.F * 0.5) / P.z, ry = (k.F * 0.6) / P.z;
    const gr = g.createRadialGradient(P.x - rx * 0.25, P.y - ry * 0.3, rx * 0.1, P.x, P.y, rx);
    gr.addColorStop(0, "rgba(150,50,70,0.55)");
    gr.addColorStop(1, "rgba(40,8,16,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(P.x, P.y, rx, ry, lado * -0.08, 0, 6.2832);
    g.fill();
  }
  g.restore();
  g.save();
  g.globalAlpha = al;
  for (const q of PUNTOS) {
    const x = q.x + (q.lado || 0) * sep;
    const P = k.proyecta(cam, [x, q.y, q.z]);
    if (!P || P.x < -30 || P.x > 1110 || P.y < -30 || P.y > 1950) continue;
    const s = Math.max(1.5, Math.min(9, (k.F * 0.012) / P.z));
    const col = colorPunto(q, o);
    const vida = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(t * 2.1 + q.s * 12 + q.y * 5));
    const a = Math.min(1, (2.1 / P.z) * q.b * col.a * vida);
    g.fillStyle = `rgba(${col.rgb[0]},${col.rgb[1]},${col.rgb[2]},${a})`;
    g.fillRect(P.x - s / 2, P.y - s / 2, s, s);
  }
  g.restore();
  if ((o.chispas ?? 1) > 0.02) {
    for (const ch of CHISPAS) {
      const u = (t * ch.v + ch.f) % 1;
      const x = k.mez(ch.a.x, ch.b.x, u) + ch.a.lado * sep;
      const y = k.mez(ch.a.y, ch.b.y, u);
      const z = k.mez(ch.a.z, ch.b.z, u);
      const P = k.proyecta(cam, [x, y, z]);
      if (!P) continue;
      const col = o.mito ? (ch.a.lado < 0 ? AZUL : CORAL) : "230,190,255";
      k.brillo(g, P.x, P.y, Math.min(64, (k.F * 0.055) / P.z), col, 0.55 * Math.sin(u * Math.PI) * (o.chispas ?? 1) * al);
    }
  }
}

export function bloque(g, x, y, s, al, ang = 0) {
  if (al < 0.02 || s < 3) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,20,0.35)";
  k.redondo(g, -s * 0.42, -s * 0.34, s, s, s * 0.12);
  g.fill();
  const gr = g.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
  gr.addColorStop(0, "rgba(236,250,255,0.92)");
  gr.addColorStop(0.42, "rgba(120,190,255,0.48)");
  gr.addColorStop(1, "rgba(20,50,130,0.62)");
  g.fillStyle = gr;
  k.redondo(g, -s / 2, -s / 2, s, s, s * 0.14);
  g.fill();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.35;
  g.drawImage(k.red, -s / 2, -s / 2, s, s);
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = al;
  g.strokeStyle = "rgba(230,250,255,0.95)";
  g.lineWidth = Math.max(2, s * 0.035);
  k.redondo(g, -s / 2, -s / 2, s, s, s * 0.14);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)";
  k.redondo(g, -s * 0.34, -s * 0.38, s * 0.28, s * 0.16, s * 0.06);
  g.fill();
  g.restore();
  k.brillo(g, x, y, s * 2.4, AZUL, 0.28 * al);
}

export function pintura(g, x, y, r, col, al) {
  if (al < 0.02 || r < 2) return;
  k.brillo(g, x, y, r * 3.1, col, 0.5 * al);
  g.save();
  g.globalAlpha *= al;
  const gr = g.createRadialGradient(x - r * 0.28, y - r * 0.32, r * 0.08, x, y, r);
  gr.addColorStop(0, "rgba(255,255,255,0.95)");
  gr.addColorStop(0.4, `rgba(${col},0.92)`);
  gr.addColorStop(1, `rgba(${col},0.05)`);
  g.fillStyle = gr;
  g.beginPath();
  g.arc(x, y, r, 0, 6.2832);
  g.fill();
  g.restore();
}

export function chispasMundo(g, cam, t, lista, sep, al = 1) {
  for (const p of lista) {
    const u = k.suave(k.tramo(t, p.t0, p.t1));
    if (u <= 0 || u >= 1) continue;
    const x = p.x + (p.lado || 0) * sep;
    const P = k.proyecta(cam, [x, p.y, p.z]);
    if (!P) continue;
    k.brillo(g, P.x, P.y, (k.F * p.s) / P.z, p.col, Math.sin(u * Math.PI) * al);
  }
}

// La mano derecha, desde arriba, cerrada sobre el bolígrafo. s en píxeles.
export function mano(g, x, y, s, al) {
  if (al < 0.02 || s < 8) return;
  g.save();
  g.translate(x, y);
  g.rotate(-0.35);
  g.scale(s / 340, s / 340);
  g.globalAlpha *= al;
  const sombra = g.createRadialGradient(0, 20, 10, 10, 30, 150);
  sombra.addColorStop(0, "rgba(0,0,0,0.35)");
  sombra.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = sombra;
  g.beginPath();
  g.ellipse(8, 36, 120, 78, 0.2, 0, 6.2832);
  g.fill();
  const luz = g.createLinearGradient(-90, -150, 70, 90);
  luz.addColorStop(0, "#ffe6d6");
  luz.addColorStop(0.45, "#f0b394");
  luz.addColorStop(1, "#c17d62");
  const dedo = (pts) => {
    g.beginPath();
    pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
    g.closePath();
    g.fillStyle = luz;
    g.fill();
    g.save();
    g.clip();
    g.globalCompositeOperation = "multiply";
    g.globalAlpha *= 0.4;
    g.drawImage(k.manchas, -90, -160, 200, 240);
    g.restore();
    g.strokeStyle = "rgba(110,55,40,0.3)";
    g.lineWidth = 3;
    g.stroke();
  };
  // bolígrafo debajo de los dedos
  g.save();
  g.rotate(-0.85);
  const pg = g.createLinearGradient(0, -9, 0, 9);
  pg.addColorStop(0, "#fff8ee");
  pg.addColorStop(0.45, "#f2c14e");
  pg.addColorStop(1, "#9a6418");
  g.fillStyle = pg;
  k.redondo(g, -168, -8, 188, 16, 8);
  g.fill();
  g.fillStyle = "#5c3412";
  g.beginPath();
  g.moveTo(20, -7);
  g.lineTo(46, 0);
  g.lineTo(20, 7);
  g.fill();
  g.restore();
  // palma
  dedo([[-70, 20], [-40, -30], [20, -36], [55, -8], [48, 48], [10, 78], [-48, 70]]);
  // índice, corazón, anular, meñique: se estrechan hacia la uña
  dedo([[-8, -18], [-18, -78], [-6, -132], [10, -128], [16, -70], [14, -12]]);
  dedo([[18, -24], [10, -92], [24, -148], [42, -142], [44, -80], [40, -16]]);
  dedo([[40, -16], [38, -78], [54, -128], [70, -120], [68, -64], [60, -8]]);
  dedo([[58, -4], [64, -52], [80, -92], [94, -84], [86, -40], [74, 6]]);
  // pulgar, más corto, cruzado
  dedo([[-78, 8], [-118, -8], [-132, 18], [-108, 36], [-70, 28]]);
  // uñas
  g.fillStyle = "rgba(255,228,216,0.85)";
  for (const [nx, ny] of [[0, -124], [30, -140], [60, -118], [84, -82]]) {
    g.beginPath();
    g.ellipse(nx, ny, 7, 5, -0.4, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

export function vaso(g, x, y, s, al) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.beginPath();
  g.ellipse(6, s * 0.55, s * 0.38, s * 0.12, 0, 0, 6.28);
  g.fill();
  const cg = g.createLinearGradient(-s * 0.3, -s * 0.5, s * 0.3, s * 0.5);
  cg.addColorStop(0, "rgba(220,245,255,0.85)");
  cg.addColorStop(0.5, "rgba(90,170,210,0.45)");
  cg.addColorStop(1, "rgba(20,60,90,0.55)");
  g.fillStyle = cg;
  g.beginPath();
  g.moveTo(-s * 0.28, -s * 0.35);
  g.lineTo(-s * 0.36, s * 0.4);
  g.quadraticCurveTo(0, s * 0.62, s * 0.36, s * 0.4);
  g.lineTo(s * 0.28, -s * 0.35);
  g.quadraticCurveTo(0, -s * 0.5, -s * 0.28, -s * 0.35);
  g.fill();
  g.fillStyle = "rgba(120,70,30,0.85)";
  g.beginPath();
  g.ellipse(0, -s * 0.18, s * 0.22, s * 0.08, 0, 0, 6.28);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(0, -s * 0.35, s * 0.28, s * 0.1, 0, 0, 6.28);
  g.stroke();
  g.strokeStyle = "rgba(230,250,255,0.8)";
  g.lineWidth = 5;
  g.beginPath();
  g.arc(s * 0.42, 0, s * 0.16, -1.2, 1.2);
  g.stroke();
  g.restore();
}

export function lampara(g, x, y, s, al, luz) {
  if (al < 0.02) return;
  k.brillo(g, x, y - s * 0.15, s * 2.8, ORO, 0.45 * luz * al);
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "#5a4030";
  k.redondo(g, -s * 0.22, s * 0.35, s * 0.44, s * 0.12, 8);
  g.fill();
  g.strokeStyle = "#c8a060";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, s * 0.35);
  g.lineTo(0, -s * 0.05);
  g.stroke();
  const pg = g.createLinearGradient(0, -s * 0.55, 0, s * 0.05);
  pg.addColorStop(0, luz > 0.4 ? "#ffe6a8" : "#d8c4a0");
  pg.addColorStop(1, luz > 0.4 ? "#e09030" : "#a08060");
  g.fillStyle = pg;
  g.beginPath();
  g.moveTo(-s * 0.12, -s * 0.02);
  g.lineTo(-s * 0.42, -s * 0.48);
  g.quadraticCurveTo(0, -s * 0.62, s * 0.42, -s * 0.48);
  g.lineTo(s * 0.12, -s * 0.02);
  g.closePath();
  g.fill();
  g.restore();
}

export function libro(g, x, y, s, al) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.rotate(-0.18);
  g.globalAlpha *= al;
  g.fillStyle = "#1c6b78";
  k.redondo(g, -s * 0.5, -s * 0.32, s, s * 0.64, 10);
  g.fill();
  g.fillStyle = "#f4efe4";
  k.redondo(g, -s * 0.42, -s * 0.26, s * 0.84, s * 0.52, 6);
  g.fill();
  g.strokeStyle = "rgba(40,40,40,0.25)";
  g.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.moveTo(-s * 0.3, -s * 0.12 + i * s * 0.1);
    g.lineTo(s * 0.28, -s * 0.12 + i * s * 0.1);
    g.stroke();
  }
  g.fillStyle = "#f2c14b";
  g.fillRect(-s * 0.02, -s * 0.32, s * 0.04, s * 0.64);
  g.restore();
}

export function papel(g, cam, al) {
  const pts = [[-0.55, -0.72, 0.15], [0.55, -0.72, 0.15], [0.45, -0.72, 0.85], [-0.45, -0.72, 0.85]].map((p) => k.proyecta(cam, p));
  if (pts.some((p) => !p) || al < 0.02) return null;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.closePath();
  g.fillStyle = "#f7f1e4";
  g.fill();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.35;
  g.drawImage(k.manchas, pts[0].x, pts[3].y, 400, 260);
  g.restore();
  return pts;
}

// Aro del escáner y la persona tumbada, en el mundo. u: cuánto ha entrado la camilla (0 a 1).
export function escaner(g, cam, u, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  const camaZ = k.mez(0.9, 0.15, u);
  const cama = [[-0.28, -0.35, camaZ + 0.7], [0.28, -0.35, camaZ + 0.7], [0.28, -0.35, camaZ - 0.9], [-0.28, -0.35, camaZ - 0.9]]
    .map((p) => k.proyecta(cam, p));
  if (cama.every(Boolean)) {
    g.beginPath();
    cama.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
    g.closePath();
    g.fillStyle = "#d7dee8";
    g.fill();
  }
  // aros
  for (let i = 0; i < 14; i++) {
    const z = 0.15 - i * 0.11;
    const rad = 0.72;
    const pasos = 28;
    g.beginPath();
    let ok = true;
    for (let s = 0; s <= pasos; s++) {
      const a = (s / pasos) * 6.2832;
      const P = k.proyecta(cam, [Math.cos(a) * rad, Math.sin(a) * rad * 0.92 - 0.05, z]);
      if (!P) { ok = false; break; }
      if (s) g.lineTo(P.x, P.y);
      else g.moveTo(P.x, P.y);
    }
    if (!ok) continue;
    const frente = i === 0;
    g.strokeStyle = frente ? "rgba(236,244,255,0.95)" : `rgba(170,190,220,${0.28 - i * 0.012})`;
    g.lineWidth = frente ? 16 : 5;
    g.stroke();
  }
  // la coronilla y los hombros, vistos desde la boca del aparato: reposo, sin una cara
  const cabeza = k.proyecta(cam, [0, -0.02, camaZ - 0.05]);
  if (cabeza) {
    const r = (k.F * 0.24) / cabeza.z;
    const hom = k.proyecta(cam, [0, -0.28, camaZ + 0.28]);
    if (hom) {
      g.fillStyle = "#31404e";
      g.beginPath();
      g.ellipse(hom.x, hom.y, r * 1.55, r * 0.7, 0, 0, 6.28);
      g.fill();
    }
    g.fillStyle = "#241c18";
    g.beginPath();
    g.ellipse(cabeza.x, cabeza.y - r * 0.08, r * 0.78, r * 0.9, 0, 0, 6.28);
    g.fill();
    const cg = g.createRadialGradient(cabeza.x - r * 0.15, cabeza.y + r * 0.1, r * 0.05, cabeza.x, cabeza.y + r * 0.15, r * 0.7);
    cg.addColorStop(0, "#f0c2aa");
    cg.addColorStop(1, "#b88870");
    g.fillStyle = cg;
    g.beginPath();
    g.ellipse(cabeza.x, cabeza.y + r * 0.22, r * 0.5, r * 0.42, 0, 0, 6.28);
    g.fill();
    k.brillo(g, cabeza.x, cabeza.y, r * 1.5, "255,170,190", 0.28);
  }
  g.restore();
}

export function miniCerebro(g, x, y, r, al) {
  if (al < 0.03 || r < 3) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  const lobe = (sx) => {
    const gr = g.createRadialGradient(sx * r * 0.15, -r * 0.15, r * 0.05, sx * r * 0.28, 0, r * 0.55);
    gr.addColorStop(0, "rgba(255,214,214,0.95)");
    gr.addColorStop(0.6, "rgba(214,110,140,0.85)");
    gr.addColorStop(1, "rgba(80,20,40,0.15)");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(sx * r * 0.3, 0, r * 0.4, r * 0.48, sx * -0.15, 0, 6.28);
    g.fill();
  };
  lobe(-1);
  lobe(1);
  g.strokeStyle = "rgba(40,10,20,0.45)";
  g.lineWidth = Math.max(1.5, r * 0.045);
  g.beginPath();
  g.moveTo(0, -r * 0.42);
  g.quadraticCurveTo(r * 0.06, 0, 0, r * 0.46);
  g.stroke();
  g.strokeStyle = "rgba(120,40,60,0.35)";
  g.beginPath();
  g.arc(-r * 0.28, -r * 0.02, r * 0.2, 0.5, 2.4);
  g.stroke();
  g.beginPath();
  g.arc(r * 0.28, -r * 0.02, r * 0.2, Math.PI - 2.4, Math.PI - 0.5);
  g.stroke();
  g.restore();
  k.brillo(g, x, y, r * 2.2, "255,150,180", 0.22 * al);
}

// Un puñado de cerebros de los mismos puntos, pequeños, para la sala del estudio.
// El número 1011 lo pone el plano: aquí se ve la sala, no un icono repetido.
export const LEJANOS = [];
const SITIOS = [
  [-1.55, 0.15, 3.15, 0.72],
  [0.15, 0.42, 3.55, 0.66],
  [1.6, 0.02, 2.95, 0.7],
  [-1.35, 1.05, 2.15, 0.58],
  [1.45, 1.1, 2.35, 0.56],
  [-0.15, -0.85, 2.45, 0.6],
  [1.35, -0.75, 3.7, 0.5],
  [-1.5, -0.7, 3.85, 0.52],
];
for (const [ox, oy, oz, sc] of SITIOS) {
  for (let p = 0; p < PUNTOS.length; p += 8) {
    const q = PUNTOS[p];
    LEJANOS.push({ x: ox + q.x * sc, y: oy + q.y * sc, z: oz + q.z * sc, b: q.b });
  }
}

export function campo(g, cam, al) {
  if (al < 0.03) return;
  g.save();
  g.globalAlpha = al;
  for (const q of LEJANOS) {
    const P = k.proyecta(cam, [q.x, q.y, q.z]);
    if (!P || P.y < 500 || P.x < -20 || P.x > 1100 || P.y > 1500) continue;
    const s = Math.max(1.4, Math.min(7, (k.F * 0.02) / P.z));
    const a = Math.min(1, (1.6 / P.z) * q.b);
    g.fillStyle = `rgba(255,150,176,${a})`;
    g.fillRect(P.x, P.y, s, s);
  }
  g.restore();
}
