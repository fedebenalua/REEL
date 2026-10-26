// Lo que comparten los planos: la noche de la ciudad, los números de LED que ruedan, el tótem de precios, la gasolinera,
// el billete de 10 € y la chincheta del mapa. Siempre los mismos, del mismo tamaño.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar } = k;

export const VERDE = "90,255,140", ROJO = "255,70,60", AMBAR = "255,190,60";
export const MARCA_A = "20,200,170", MARCA_B = "235,60,70";

// ---------------------------------------------------------------- la noche
const azN = azar(77);
const EDIFICIOS = [];
for (let x = -200; x < 1300;) {
  const w = 60 + azN() * 120, h = 120 + Math.pow(azN(), 1.6) * 520;
  const ventanas = [];
  for (let vy = 30; vy < h - 20; vy += 34) for (let vx = 14; vx < w - 18; vx += 26) if (azN() < 0.32) ventanas.push([vx, vy, azN() < 0.75 ? "255,210,140" : "150,200,255"]);
  EDIFICIOS.push({ x, w, h, ventanas, tono: 10 + azN() * 14 });
  x += w + 4 + azN() * 20;
}
const BOKEH = Array.from({ length: 40 }, () => ({ x: azN() * 1080, y: azN(), r: 20 + azN() * 70, c: ["255,170,80", "255,90,150", "120,180,255", "255,230,160"][Math.floor(azN() * 4)], f: azN() * 6 }));
const ESTRELLAS = Array.from({ length: 140 }, () => ({ x: azN() * 1080, y: azN(), s: 1 + azN() * 2.2, f: azN() * 6 }));

// El cielo de noche, la ciudad en el horizonte hor (px) y el asfalto debajo. esc: lo grande que se ve la ciudad.
export function noche(g, t, hor = 1000, esc = 1, desliza = 0) {
  const cg = g.createLinearGradient(0, 0, 0, hor);
  cg.addColorStop(0, "#070a24"); cg.addColorStop(0.55, "#1c1450"); cg.addColorStop(0.88, "#5a2163"); cg.addColorStop(1, "#b0406a");
  g.fillStyle = cg; g.fillRect(0, 0, 1080, hor + 2);
  for (const e of ESTRELLAS) { const y = e.y * hor * 0.7; g.fillStyle = `rgba(255,255,255,${0.25 + 0.25 * Math.sin(t * 1.5 + e.f)})`; g.fillRect(e.x, y, e.s, e.s); }
  k.brillo(g, 540, hor, 1800, "255,90,130", 0.35);
  // la ciudad
  g.save(); g.translate(540, hor); g.scale(esc, esc); g.translate(-540 - desliza, 0);
  for (const e of EDIFICIOS) {
    const gr = g.createLinearGradient(0, -e.h, 0, 0); gr.addColorStop(0, `rgb(${e.tono + 10},${e.tono + 6},${e.tono + 40})`); gr.addColorStop(1, `rgb(${e.tono},${e.tono - 4},${e.tono + 22})`);
    g.fillStyle = gr; g.fillRect(e.x, -e.h, e.w, e.h);
    for (const [vx, vy, c] of e.ventanas) { g.fillStyle = `rgba(${c},0.75)`; g.fillRect(e.x + vx, -e.h + vy, 12, 16); }
  }
  g.restore();
  // el asfalto
  const ag = g.createLinearGradient(0, hor, 0, 1920);
  ag.addColorStop(0, "#1b1530"); ag.addColorStop(1, "#08070f");
  g.fillStyle = ag; g.fillRect(0, hor, 1080, 1920 - hor);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, 0, hor, 1080, 1920 - hor); g.restore();
}

// Luces desenfocadas delante, para dar fondo.
export function bokeh(g, t, al = 1, y0 = 0, y1 = 1920) {
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) {
    const y = mez(y0, y1, b.y), a = al * (0.12 + 0.08 * Math.sin(t * 2 + b.f));
    const gr = g.createRadialGradient(b.x, y, 0, b.x, y, b.r); gr.addColorStop(0, `rgba(${b.c},${a})`); gr.addColorStop(0.75, `rgba(${b.c},${a * 0.7})`); gr.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(b.x, y, b.r, 0, 6.2832); g.fill();
  }
  g.restore();
}

// Un velo oscuro arriba, para que se lea el subtítulo.
export function velo(g, al = 0.55) {
  const vg = g.createLinearGradient(0, 220, 0, 620); vg.addColorStop(0, `rgba(5,4,14,${al})`); vg.addColorStop(1, "rgba(5,4,14,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}

// ---------------------------------------------------------------- los números de LED
// a b c d e f g
const SEG = [
  [1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 0, 0, 0, 0], [1, 1, 0, 1, 1, 0, 1], [1, 1, 1, 1, 0, 0, 1], [0, 1, 1, 0, 0, 1, 1],
  [1, 0, 1, 1, 0, 1, 1], [1, 0, 1, 1, 1, 1, 1], [1, 1, 1, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 0, 1, 1],
];
function segmento(g, x0, y0, x1, y1, th) {
  const hor = y0 === y1, m = th / 2;
  g.beginPath();
  if (hor) { g.moveTo(x0 + m, y0); g.lineTo(x0 + th, y0 - m); g.lineTo(x1 - th, y0 - m); g.lineTo(x1 - m, y0); g.lineTo(x1 - th, y0 + m); g.lineTo(x0 + th, y0 + m); }
  else { g.moveTo(x0, y0 + m); g.lineTo(x0 + m, y0 + th); g.lineTo(x0 + m, y1 - th); g.lineTo(x0, y1 - m); g.lineTo(x0 - m, y1 - th); g.lineTo(x0 - m, y0 + th); }
  g.closePath(); g.fill();
}
function digito7(g, cx, cy, h, d, encendidos) {
  const w = h * 0.52, th = h * 0.13, x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, ym = cy, y1 = cy + h / 2;
  const s = SEG[d] || SEG[8], P = [[x0, y0, x1, y0], [x1, y0, x1, ym], [x1, ym, x1, y1], [x0, y1, x1, y1], [x0, ym, x0, y1], [x0, y0, x0, ym], [x0, ym, x1, ym]];
  g.save(); g.transform(1, 0, -0.08, 1, cy * 0.08, 0);
  for (let i = 0; i < 7; i++) if (!!s[i] === encendidos) segmento(g, ...P[i], th);
  g.restore();
}
// Un dígito que rueda: val de 0 a 10 (3,4 es entre el 3 y el 4).
function rueda(g, cx, cy, h, val, rgb, al) {
  const v = ((val % 10) + 10) % 10, d0 = Math.floor(v), fr = v - d0, d1 = (d0 + 1) % 10, paso = h * 1.25;
  const w = h * 0.68;
  g.save(); g.beginPath(); g.rect(cx - w / 2, cy - h * 0.62, w, h * 1.24); g.clip();
  g.fillStyle = "rgba(255,255,255,0.05)"; digito7(g, cx, cy, h, 8, true);
  g.shadowColor = `rgba(${rgb},${0.95 * al})`; g.shadowBlur = h * 0.25; g.fillStyle = `rgba(${k.mezRgb(rgb, "255,255,255", 0.35)},${al})`;
  digito7(g, cx, cy - fr * paso, h, d0, true);
  if (fr > 0.001) digito7(g, cx, cy + (1 - fr) * paso, h, d1, true);
  g.restore();
}
// Un precio de LED centrado en (cx, cy): céntimos (139 = 1,39). Si céntimos tiene decimales, los números ruedan como un
// cuentakilómetros.
// También vale una lista de tres dígitos que ruedan cada uno a su aire: [1, 3.4, 9].
export function precio(g, cx, cy, h, cent, rgb, al = 1) {
  let eu, dec, u;
  if (Array.isArray(cent)) [eu, dec, u] = cent;
  else { u = cent % 10; dec = Math.floor(cent / 10) % 10 + Math.max(0, u - 9); eu = Math.floor(cent / 100) + Math.max(0, (Math.floor(cent / 10) % 10 === 9 ? u - 9 : 0)); }
  rueda(g, cx - h * 0.87, cy, h, eu, rgb, al);
  rueda(g, cx + h * 0.15, cy, h, dec, rgb, al);
  rueda(g, cx + h * 0.87, cy, h, u, rgb, al);
  // la coma
  const xc = cx - h * 0.36, yc = cy + h * 0.44, r = h * 0.075;
  g.save(); g.shadowColor = `rgba(${rgb},${al})`; g.shadowBlur = h * 0.2; g.fillStyle = `rgba(${k.mezRgb(rgb, "255,255,255", 0.35)},${al})`;
  g.beginPath(); g.arc(xc, yc, r, 0, 6.2832); g.fill();
  g.beginPath(); g.moveTo(xc + r * 0.2, yc); g.lineTo(xc + r, yc + r * 0.3); g.lineTo(xc - r * 1.2, yc + r * 2.6); g.lineTo(xc - r * 0.9, yc + r * 0.4); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- el tótem de precios
// Base en (x, y), esc 1 = 1050 px de alto. op: { marca, p1, c1, p2, c2, luz, rotulo1, rotulo2 }.
export function totem(g, x, y, esc, op = {}) {
  const { marca = MARCA_A, p1 = 139, c1 = VERDE, p2 = 129, c2 = VERDE, luz = 1, alfa = 1 } = op;
  const W = 400, H = 1050;
  g.save(); g.translate(x, y); g.scale(esc, esc); g.globalAlpha *= alfa;
  // el halo detrás
  k.brillo(g, 0, -H * 0.6, 1500, marca, 0.35 * luz);
  // la pata
  g.fillStyle = "#15161c"; g.fillRect(-W * 0.3, -120, W * 0.6, 120);
  // el cuerpo
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 60; g.shadowOffsetY = 20;
  k.redondo(g, -W / 2, -H, W, H - 100, 26); g.fillStyle = "#101320"; g.fill(); g.restore();
  const cg = g.createLinearGradient(-W / 2, 0, W / 2, 0);
  cg.addColorStop(0, "#232838"); cg.addColorStop(0.18, "#3a4158"); cg.addColorStop(0.5, "#1a1e2c"); cg.addColorStop(1, "#0c0e16");
  k.redondo(g, -W / 2, -H, W, H - 100, 26); g.fillStyle = cg; g.fill();
  g.save(); g.globalCompositeOperation = "screen";
  const rg = g.createLinearGradient(-W / 2, 0, W / 2, 0); rg.addColorStop(0.03, "rgba(255,255,255,0)"); rg.addColorStop(0.08, "rgba(255,255,255,0.22)"); rg.addColorStop(0.14, "rgba(255,255,255,0)");
  rg.addColorStop(0.9, "rgba(255,255,255,0)"); rg.addColorStop(0.96, `rgba(${marca},0.35)`); rg.addColorStop(1, "rgba(255,255,255,0)");
  k.redondo(g, -W / 2, -H, W, H - 100, 26); g.fillStyle = rg; g.fill(); g.restore();
  // la cabeza con la marca: una gota blanca
  const hg = g.createLinearGradient(0, -H, 0, -H + 260);
  hg.addColorStop(0, `rgb(${k.mezRgb(marca, "255,255,255", 0.35)})`); hg.addColorStop(1, `rgb(${k.mezRgb(marca, "0,0,0", 0.25)})`);
  k.redondo(g, -W / 2 + 18, -H + 18, W - 36, 240, 18); g.fillStyle = hg; g.fill();
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.4 * luz; k.redondo(g, -W / 2 + 18, -H + 18, W - 36, 240, 18); g.fillStyle = `rgb(${marca})`; g.fill(); g.restore();
  g.fillStyle = "#fff"; g.beginPath(); g.moveTo(0, -H + 60); g.bezierCurveTo(40, -H + 120, 70, -H + 150, 70, -H + 180); g.arc(0, -H + 180, 70, 0, Math.PI); g.bezierCurveTo(-70, -H + 150, -40, -H + 120, 0, -H + 60); g.fill();
  g.fillStyle = `rgb(${marca})`; g.beginPath(); g.arc(-22, -H + 186, 18, 0, 6.2832); g.fill();
  // los dos precios
  const fila = (yy, rot, p, c) => {
    g.fillStyle = "rgba(255,255,255,0.88)"; g.font = "800 44px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(rot, 0, yy - 30);
    k.redondo(g, -W / 2 + 30, yy + 4, W - 60, 200, 14); g.fillStyle = "#020203"; g.fill();
    g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 3; g.stroke();
    precio(g, 0, yy + 104, 124, p, c, luz);
  };
  fila(-H + 320, op.rotulo1 ?? "GASOLINA 95", p1, c1);
  fila(-H + 600, op.rotulo2 ?? "DIÉSEL", p2, c2);
  // el borde de luz
  g.strokeStyle = `rgba(${marca},${0.8 * luz})`; g.lineWidth = 6; k.redondo(g, -W / 2, -H, W, H - 100, 26); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la gasolinera
// Un surtidor con base en (x, y), esc 1 = 420 px de alto.
export function surtidor(g, x, y, esc, marca, luz = 1, pantalla = null) {
  g.save(); g.translate(x, y); g.scale(esc, esc);
  const W = 170, H = 420;
  g.fillStyle = "#2a2d38"; g.fillRect(-W / 2 - 14, -24, W + 28, 24);
  const cg = g.createLinearGradient(-W / 2, 0, W / 2, 0); cg.addColorStop(0, "#d9dde6"); cg.addColorStop(0.35, "#ffffff"); cg.addColorStop(1, "#8d93a3");
  k.redondo(g, -W / 2, -H, W, H - 24, 16); g.fillStyle = cg; g.fill();
  k.redondo(g, -W / 2, -H, W, 70, 16); g.fillStyle = `rgb(${marca})`; g.fill();
  k.redondo(g, -W / 2 + 22, -H + 100, W - 44, 90, 8); g.fillStyle = "#0a0d12"; g.fill();
  if (pantalla) pantalla(g, 0, -H + 145);
  else { g.fillStyle = `rgba(${AMBAR},${0.8 * luz})`; g.fillRect(-W / 2 + 34, -H + 120, W - 68, 12); g.fillRect(-W / 2 + 34, -H + 150, (W - 68) * 0.6, 12); }
  // las pistolas a los lados
  for (const s of [-1, 1]) {
    g.fillStyle = "#1c1f27"; k.redondo(g, s * W / 2 - (s > 0 ? 0 : 26), -H + 220, 26, 90, 6); g.fill();
    g.strokeStyle = "#111"; g.lineWidth = 12; g.beginPath(); g.moveTo(s * (W / 2 + 13), -H + 300); g.quadraticCurveTo(s * (W / 2 + 60), -120, s * (W / 2 + 10), -40); g.stroke();
  }
  g.restore();
}

// La gasolinera de frente, con el suelo en y. esc 1 = 1000 px de ancho. op: { marca, luz, tienda }.
export function gasolinera(g, x, y, esc, op = {}) {
  const { marca = MARCA_A, luz = 1, tienda = 1 } = op;
  g.save(); g.translate(x, y); g.scale(esc, esc);
  const W = 1000, techo = -700;
  // la tienda detrás
  g.fillStyle = "#1a1c26"; g.fillRect(-W * 0.42, -420, W * 0.84, 420);
  const tg = g.createLinearGradient(0, -360, 0, -60); tg.addColorStop(0, `rgba(255,226,170,${0.9 * tienda})`); tg.addColorStop(1, `rgba(255,190,120,${0.6 * tienda})`);
  g.fillStyle = tienda > 0.02 ? tg : "#0b0c12"; g.fillRect(-W * 0.38, -360, W * 0.76, 300);
  g.fillStyle = "#0b0c12"; for (let i = -3; i <= 3; i++) g.fillRect(i * W * 0.108 - 4, -360, 8, 300);
  // la luz en el suelo
  g.save(); g.globalCompositeOperation = "lighter";
  const sg = g.createRadialGradient(0, 0, 10, 0, 0, W * 0.75); sg.addColorStop(0, `rgba(230,240,255,${0.35 * luz})`); sg.addColorStop(1, "rgba(230,240,255,0)");
  g.fillStyle = sg; g.save(); g.scale(1, 0.22); g.beginPath(); g.arc(0, 0, W * 0.75, 0, 6.2832); g.fill(); g.restore();
  // los conos de luz bajo el techo
  const lg = g.createLinearGradient(0, techo + 60, 0, 0); lg.addColorStop(0, `rgba(235,245,255,${0.2 * luz})`); lg.addColorStop(1, "rgba(235,245,255,0)");
  g.fillStyle = lg; g.beginPath(); g.moveTo(-W * 0.46, techo + 60); g.lineTo(W * 0.46, techo + 60); g.lineTo(W * 0.5, 0); g.lineTo(-W * 0.5, 0); g.fill();
  g.restore();
  // los pilares
  for (const s of [-1, 1]) { const pg = g.createLinearGradient(s * W * 0.36 - 22, 0, s * W * 0.36 + 22, 0); pg.addColorStop(0, "#6c7182"); pg.addColorStop(0.5, "#c7ccd8"); pg.addColorStop(1, "#4b5060"); g.fillStyle = pg; g.fillRect(s * W * 0.36 - 22, techo + 60, 44, -techo - 60); }
  // los surtidores
  surtidor(g, -W * 0.16, 0, 0.75, marca, luz); surtidor(g, W * 0.16, 0, 0.75, marca, luz);
  // el techo
  g.save(); g.shadowColor = `rgba(${marca},${0.8 * luz})`; g.shadowBlur = 60;
  k.redondo(g, -W / 2, techo - 70, W, 130, 10); g.fillStyle = "#f2f4f8"; g.fill(); g.restore();
  const bg = g.createLinearGradient(0, techo - 40, 0, techo + 30); bg.addColorStop(0, `rgb(${k.mezRgb(marca, "255,255,255", 0.25)})`); bg.addColorStop(1, `rgb(${marca})`);
  g.fillStyle = bg; g.fillRect(-W / 2, techo - 40, W, 70);
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.5 * luz; g.fillStyle = `rgb(${marca})`; g.fillRect(-W / 2, techo - 40, W, 70); g.restore();
  g.fillStyle = "#d6dae4"; g.fillRect(-W / 2, techo + 50, W, 14);
  for (let i = 0; i < 6; i++) k.brillo(g, -W * 0.4 + i * W * 0.16, techo + 66, 120, "243,246,255", 0.9 * luz);
  g.restore();
}

// ---------------------------------------------------------------- la calle con dos gasolineras, una frente a otra
// op: { esc, cx, cy (la cámara: zoom y hacia dónde mira), pA, cA, pB, cB, luzA, luzB }.
export function calle(g, t, op = {}) {
  const { esc = 1, cx = 540, cy = 1000, pA = 139, cA = VERDE, pB = 139, cB = VERDE, luzA = 1, luzB = 1, despues = null } = op;
  const HOR = 1060;
  g.save(); g.translate(540, 1000); g.scale(esc, esc); g.translate(-cx, -cy);
  g.fillStyle = "#070a24"; g.fillRect(-2000, -3000, 5080, 3000);
  noche(g, t, HOR, 1);
  g.fillStyle = "#08070f"; g.fillRect(-2000, 1919, 5080, 3000);
  // la calle: la calzada hacia el horizonte, con sus rayas y el brillo mojado
  g.fillStyle = "#15131f"; g.beginPath(); g.moveTo(500, HOR); g.lineTo(580, HOR); g.lineTo(1500, 2400); g.lineTo(-420, 2400); g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  for (let i = 0; i < 9; i++) { const z = 1 + i * 1.6, z1 = z + 0.7, y0 = HOR + 900 / z, y1 = HOR + 900 / z1; g.beginPath(); g.moveTo(540 - 14 / z, y0); g.lineTo(540 + 14 / z, y0); g.lineTo(540 + 14 / z1, y1); g.lineTo(540 - 14 / z1, y1); g.fill(); }
  // las dos gasolineras, una a cada lado
  gasolinera(g, 150, 1210, 0.62, { marca: MARCA_A, luz: luzA });
  gasolinera(g, 930, 1210, 0.62, { marca: MARCA_B, luz: luzB });
  // sus reflejos en el suelo mojado
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [x, c, l] of [[270, MARCA_A, luzA], [810, MARCA_B, luzB]]) {
    g.save(); g.translate(x, 1560); g.scale(1, 2.2);
    const rg = g.createRadialGradient(0, 0, 0, 0, 0, 190); rg.addColorStop(0, `rgba(${c},${0.3 * l})`); rg.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 190, 0, 6.2832); g.fill(); g.restore();
  }
  g.restore();
  // los tótems, delante
  totem(g, 270, 1520, 0.72, { marca: MARCA_A, p1: pA, c1: cA, p2: typeof pA === "number" ? pA - 10 : [pA[0], pA[1] - 1, pA[2]], c2: cA, luz: luzA });
  totem(g, 810, 1520, 0.72, { marca: MARCA_B, p1: pB, c1: cB, p2: typeof pB === "number" ? pB - 10 : [pB[0], pB[1] - 1, pB[2]], c2: cB, luz: luzB });
  if (despues) despues(g);
  g.restore();
}

// ---------------------------------------------------------------- el billete de 10 €
const billeteImg = (() => {
  const W = 640, H = 340, c = k.lienzo(W, H), x = c.getContext("2d");
  const gr = x.createLinearGradient(0, 0, W, H); gr.addColorStop(0, "#f0a58c"); gr.addColorStop(0.5, "#dc6f55"); gr.addColorStop(1, "#b9473a");
  k.redondo(x, 0, 0, W, H, 18); x.fillStyle = gr; x.fill();
  x.save(); k.redondo(x, 0, 0, W, H, 18); x.clip();
  x.globalCompositeOperation = "multiply"; x.globalAlpha = 0.35; x.drawImage(k.manchas, 0, 0, W, H); x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
  // los arcos
  x.strokeStyle = "rgba(120,30,25,0.45)"; x.lineWidth = 6;
  for (let i = 0; i < 3; i++) { x.beginPath(); x.arc(330 + i * 90, 260, 70, Math.PI, 0); x.lineTo(400 + i * 90, 330); x.moveTo(260 + i * 90, 260); x.lineTo(260 + i * 90, 330); x.stroke(); }
  x.strokeStyle = "rgba(255,240,220,0.25)"; x.lineWidth = 2; for (let i = 0; i < 30; i++) { x.beginPath(); x.arc(170, 170, 40 + i * 9, 0, 6.2832); x.stroke(); }
  // la banda plateada
  const pg = x.createLinearGradient(110, 0, 160, 0); pg.addColorStop(0, "#9aa3b0"); pg.addColorStop(0.5, "#f4f6fa"); pg.addColorStop(1, "#8892a0");
  x.fillStyle = pg; x.fillRect(110, 0, 50, H);
  x.restore();
  x.fillStyle = "#fff6ee"; x.font = "900 150px Figtree"; x.textBaseline = "alphabetic"; x.fillText("10", 200, 160);
  x.font = "800 52px Figtree"; x.fillStyle = "rgba(255,246,238,0.9)"; x.fillText("EURO", 205, 225);
  x.font = "900 110px Figtree"; x.fillStyle = "rgba(120,30,25,0.7)"; x.fillText("10", 470, 120);
  x.strokeStyle = "rgba(255,255,255,0.55)"; x.lineWidth = 4; k.redondo(x, 2, 2, W - 4, H - 4, 16); x.stroke();
  return c;
})();
// Un billete de 10 € centrado en (x, y), de esc * 640 px de ancho, girado ang, inclinado incl (0 a 1: de canto).
export function billete(g, x, y, esc, ang = 0, incl = 0, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(esc, esc * Math.cos(incl * 1.4)); g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 40; g.shadowOffsetY = 20;
  g.drawImage(billeteImg, -320, -170);
  g.restore();
}

// ---------------------------------------------------------------- la chincheta del mapa
// La punta en (x, y); esc 1 = 120 px de alto.
export function chincheta(g, x, y, esc, color, al = 1) {
  if (al <= 0.01 || esc <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(esc, esc); g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.shadowOffsetY = 8;
  const gr = g.createRadialGradient(-14, -92, 4, 0, -80, 60); gr.addColorStop(0, `rgb(${k.mezRgb(color, "255,255,255", 0.5)})`); gr.addColorStop(1, `rgb(${k.mezRgb(color, "0,0,0", 0.25)})`);
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-20, -40, -48, -54, -48, -84); g.arc(0, -84, 48, Math.PI, 0); g.bezierCurveTo(48, -54, 20, -40, 0, 0); g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.fillStyle = "#fff"; g.beginPath(); g.arc(0, -84, 18, 0, 6.2832); g.fill();
  g.restore();
}
