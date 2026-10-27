// Lo que comparten los planos: la calle al atardecer, en 3D (metros; y = arriba), con su acera de baldosas grises, la
// franja amarilla de rayas (x de -0,4 a 0,4) que lleva a la banda de botones junto al bordillo (z de 28,4 a 29,6), el
// paso de cebra, los coches, las farolas y las fachadas. Y las pisadas, que se pegan al suelo.
import * as k from "#kit";

const { azar, lienzo, mez, tramo: tr } = k;
// Mezcla dos colores hex y devuelve hex (para poder volver a mezclarlo).
const hx = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const mh = (a, b, u) => { const x = hx(a), y = hx(b); return "#" + x.map((v, i) => Math.round(mez(v, y[i], Math.max(0, Math.min(1, u)))).toString(16).padStart(2, "0")).join(""); };

// ---------------------------------------------------------------- geometría de la calle
export const FRANJA = { x0: -0.4, x1: 0.4, z0: -14, z1: 28.4 };
export const BANDA = { x0: -1.6, x1: 1.6, z0: 28.4, z1: 29.6 };
export const BORDILLO = 30, CALZADA = 40, ACERA_X = [-3.2, 3.2];
export const AMARILLO = "#ffc81e";

// ---------------------------------------------------------------- proyección con recorte (lo que queda detrás no se dibuja)
const NEAR = 0.02;
export const aCam = (cam, X) => { const d = k.res(X, cam.p); return [k.pto(d, cam.e.r), k.pto(d, cam.e.u), k.pto(d, cam.e.f)]; };
const enPantalla = (c) => [k.CX + (k.F * c[0]) / c[2], k.CY - (k.F * c[1]) / c[2]];
export function poli(g, cam, pts) {
  const c = pts.map((p) => aCam(cam, p));
  const out = [];
  for (let i = 0; i < c.length; i++) {
    const a = c[i], b = c[(i + 1) % c.length], ain = a[2] > NEAR, bin = b[2] > NEAR;
    if (ain) out.push(a);
    if (ain !== bin) { const u = (NEAR - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, NEAR]); }
  }
  if (out.length < 3) return false;
  const P = out.map(enPantalla);
  let fx = true, fX = true, fy = true, fY = true;
  for (const [x, y] of P) { if (x > -40) fx = false; if (x < 1120) fX = false; if (y > -40) fy = false; if (y < 1960) fY = false; }
  if (fx || fX || fy || fY) return false;
  g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
  return true;
}
const quad = (g, cam, x0, x1, z0, z1, y = 0) => poli(g, cam, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]);
export function linea(g, cam, A, B) {
  let a = aCam(cam, A), b = aCam(cam, B);
  if (a[2] <= NEAR && b[2] <= NEAR) return false;
  if (a[2] <= NEAR) { const u = (NEAR - a[2]) / (b[2] - a[2]); a = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, NEAR]; }
  if (b[2] <= NEAR) { const u = (NEAR - b[2]) / (a[2] - b[2]); b = [b[0] + (a[0] - b[0]) * u, b[1] + (a[1] - b[1]) * u, NEAR]; }
  const p = enPantalla(a), q = enPantalla(b);
  g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]);
  return true;
}

// Dibuja en el suelo, en coordenadas locales (metros): x a la derecha, y hacia atrás. ang: hacia dónde mira (0 = +z).
export function enSuelo(g, cam, cx, cz, ang, dibuja, y = 0.002) {
  const f = [Math.sin(ang), 0, Math.cos(ang)], r = [Math.cos(ang), 0, -Math.sin(ang)], d = 0.05;
  const C = [cx, y, cz], c0 = aCam(cam, C);
  if (c0[2] < 0.15) return;
  const P0 = k.proyecta(cam, C), P1 = k.proyecta(cam, k.sum(C, k.por(r, d))), P2 = k.proyecta(cam, k.sum(C, k.por(f, -d)));
  if (!P0 || !P1 || !P2) return;
  g.save();
  g.transform((P1.x - P0.x) / d, (P1.y - P0.y) / d, (P2.x - P0.x) / d, (P2.y - P0.y) / d, P0.x, P0.y);
  dibuja(g);
  g.restore();
}

// Un brillo pegado a un punto del mundo, de tam metros; se apaga si queda casi encima de la cámara.
export function luz(g, cam, X, tam, color, al = 1) {
  const P = k.proyecta(cam, X);
  if (!P || P.z < 0.8) return;
  k.brillo(g, P.x, P.y, Math.min(1600, k.tamano(tam, P.z)), color, al * k.tramo(P.z, 0.8, 2.5));
}

// ---------------------------------------------------------------- el cielo y la luz del atardecer
export function cielo(g, cam, oscuro = 0) {
  const H = k.proyecta(cam, k.sum(cam.p, [cam.e.f[0] * 1000, 0, cam.e.f[2] * 1000]));
  const hy = H ? H.y : -2000;
  const cg = g.createLinearGradient(0, hy - 1500, 0, hy + 40);
  cg.addColorStop(0, mh("#1b1f5c", "#05060f", oscuro)); cg.addColorStop(0.45, mh("#5b3a8c", "#0a0a18", oscuro));
  cg.addColorStop(0.8, mh("#ff7a59", "#1a1020", oscuro)); cg.addColorStop(1, mh("#ffc27a", "#201418", oscuro));
  g.fillStyle = cg; g.fillRect(0, 0, 1080, 1920);
  return hy;
}

// ---------------------------------------------------------------- las texturas
// Grano fino de hormigón, para repetirlo con createPattern.
export const GRANO = (() => {
  const l = lienzo(256), c = l.getContext("2d"), az = azar(909);
  c.fillStyle = "#ffffff"; c.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 5200; i++) { const v = Math.floor(150 + az() * 100); c.fillStyle = `rgba(${v},${v},${v},${0.35 + az() * 0.5})`; const r = 0.6 + az() * 1.8; c.fillRect(az() * 256, az() * 256, r, r); }
  return l;
})();
const HALOS = new Map();
const halo = (rgb) => { if (HALOS.has(rgb)) return HALOS.get(rgb); const l = lienzo(128), c = l.getContext("2d"), gr = c.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.35, `rgba(${rgb},0.45)`); gr.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = gr; c.fillRect(0, 0, 128, 128); HALOS.set(rgb, l); return l; };
export const HALO_FAROLA = halo("255,190,110"), HALO_VERDE = halo("90,255,150"), HALO_ROJO = halo("255,70,50"), HALO_BLANCO = halo("255,255,255");

// El botón (cúpula truncada) visto desde arriba con la elevación s (0 = a ras, 1 = desde encima). Base en (64, 78), radio 50.
const SPR = [0.06, 0.15, 0.3, 0.5, 0.7, 0.9, 1].map((s) => {
  const l = lienzo(128, 140), c = l.getContext("2d"), R = 50, h = 0.32 * R * Math.sqrt(1 - s * s), bx = 64, by = 78, rt = 0.78;
  c.fillStyle = "rgba(60,30,0,0.35)"; c.beginPath(); c.ellipse(bx + 8, by + 4, R * 1.05, R * s * 1.05 + 2, 0, 0, 6.2832); c.fill();
  c.beginPath(); c.ellipse(bx, by, R, R * s + 0.5, 0, 0, Math.PI); c.lineTo(bx - R * rt, by - h); c.ellipse(bx, by - h, R * rt, R * rt * s + 0.5, 0, Math.PI, 0); c.closePath();
  const lg = c.createLinearGradient(bx - R, 0, bx + R, 0); lg.addColorStop(0, "#ffe27a"); lg.addColorStop(0.45, "#f0b81a"); lg.addColorStop(1, "#9c6a06");
  c.fillStyle = lg; c.fill();
  c.beginPath(); c.ellipse(bx, by - h, R * rt, R * rt * s + 0.5, 0, 0, 6.2832);
  const tg = c.createRadialGradient(bx - R * 0.3, by - h - R * s * 0.3, 2, bx, by - h, R * rt); tg.addColorStop(0, "#fff3b8"); tg.addColorStop(0.5, "#ffd23c"); tg.addColorStop(1, "#e2a90f");
  c.fillStyle = tg; c.fill();
  return { s, l };
});
const sprite = (s) => { let b = SPR[0]; for (const x of SPR) if (Math.abs(x.s - s) < Math.abs(b.s - s)) b = x; return b.l; };
// Lo mismo, teñido (para las baldosas grises de 1967 o la franja oscura): se tiñe la sombra del color con "multiply".
const tenidos = new Map();
function spriteTenido(s, color) {
  if (!color) return sprite(s);
  const key = color + s.toFixed(2);
  if (tenidos.has(key)) return tenidos.get(key);
  const src = sprite(s), l = lienzo(128, 140), c = l.getContext("2d");
  c.drawImage(src, 0, 0); c.globalCompositeOperation = "saturation"; c.fillStyle = "#808080"; c.fillRect(0, 0, 128, 140);
  c.globalCompositeOperation = "multiply"; c.fillStyle = color; c.fillRect(0, 0, 128, 140);
  c.globalCompositeOperation = "destination-in"; c.drawImage(src, 0, 0);
  tenidos.set(key, l); return l;
}

// La huella de un zapato, en metros (unos 28 cm), centrada, con la punta hacia -y (hacia delante).
export function huella(g, color = "255,255,255", al = 1, izq = false) {
  if (al <= 0.01) return;
  g.save(); if (izq) g.scale(-1, 1);
  g.fillStyle = `rgba(${color},${al})`;
  g.beginPath();
  g.moveTo(0.0, -0.14); g.bezierCurveTo(0.06, -0.14, 0.055, -0.04, 0.045, 0.0); g.bezierCurveTo(0.04, 0.03, 0.045, 0.06, 0.045, 0.09);
  g.bezierCurveTo(0.045, 0.14, -0.04, 0.14, -0.04, 0.09); g.bezierCurveTo(-0.04, 0.05, -0.025, 0.02, -0.035, -0.02); g.bezierCurveTo(-0.05, -0.08, -0.05, -0.14, 0.0, -0.14);
  g.fill();
  g.globalCompositeOperation = "destination-out"; g.fillStyle = `rgba(0,0,0,${0.55})`;
  for (let i = 0; i < 5; i++) g.fillRect(-0.04, -0.11 + i * 0.022, 0.09, 0.007);
  for (let i = 0; i < 3; i++) g.fillRect(-0.04, 0.06 + i * 0.022, 0.09, 0.007);
  g.restore();
}

// Las pisadas de alguien que camina por (x, z0) → (x, z1), a partir de t0, un paso cada dt, cada una se apaga en vida s.
export function pasos(z0, z1, t0, dt = 0.32, paso = 0.62, x = 0, ancho = 0.13) {
  const n = Math.max(1, Math.floor(Math.abs(z1 - z0) / paso) + 1), dir = Math.sign(z1 - z0) || 1;
  return Array.from({ length: n }, (_, i) => ({ x: x + (i % 2 ? ancho : -ancho) * dir, z: z0 + dir * i * paso, t: t0 + i * dt, izq: i % 2 === 0, ang: dir > 0 ? 0 : Math.PI }));
}
export function pisadas(g, cam, t, lista, color = "190,245,255", vida = 1.6, brillo = 1) {
  for (const p of lista) {
    const e = t - p.t;
    if (e < 0 || e > vida) continue;
    const zc = aCam(cam, [p.x, 0.146, p.z])[2];
    const al = Math.min(1, e / 0.08) * (1 - k.tramo(e, vida * 0.5, vida)) * k.tramo(zc, 0.9, 1.8);
    if (al <= 0.01) continue;
    g.save();
    enSuelo(g, cam, p.x, p.z, p.ang, (c) => {
      c.scale(1.3, 1.3);
      c.globalCompositeOperation = "lighter"; c.globalAlpha = 0.5 * al * brillo; c.drawImage(halo(color), -0.3, -0.35, 0.6, 0.7);
      c.globalCompositeOperation = "source-over"; c.globalAlpha = 1; huella(c, color, 0.95 * al * brillo, p.izq);
    }, 0.146);
    g.restore();
  }
}

// ---------------------------------------------------------------- las fachadas, las farolas y los coches
const azV = azar(77);
// Los edificios: bloques de alturas distintas a lo largo de cada fachada (lado d: x = 3,2; i: x = -11; f: z = 46).
const BLOQUES = [];
const COLB = ["#5a3f6e", "#6b4a5e", "#4a3d6a", "#7a4f5a", "#544a78", "#663f62"];
for (const [lado, a0, a1] of [["d", -30, 29.8], ["i", -30, 40], ["f", -40, -7], ["f", 7, 40], ["x", 3.2, 40], ["a", 46, 170], ["b", 46, 170]]) {
  for (let a = a0; a < a1; ) {
    const w = Math.min(a1 - a, 6 + azV() * 8), h = 7 + azV() * 13, col = COLB[Math.floor(azV() * COLB.length)];
    const ventanas = [];
    for (let p = 1; p * 3 + 2 < h; p++) for (let q = a + 0.7; q + 1.3 < a + w - 0.5; q += 2.2) ventanas.push({ a: q, b: p * 3 + 0.6, on: azV() < 0.6, c: azV() < 0.72 ? "255,196,120" : "150,205,255" });
    BLOQUES.push({ lado, a, w, h, col, ventanas });
    a += w;
  }
}
const TIENDAS = [[-22, "255,120,90"], [-12, "120,220,255"], [-2, "255,200,90"], [8, "255,110,200"], [18, "140,255,170"]];
const FAROLAS = [[-3.0, 2], [-3.0, 14], [-3.0, 26.5], [3.0, 8], [3.0, 20]];

const enLado = (lado, a, b, d = 0) => lado === "d" ? [3.2 - d, b, a] : lado === "i" ? [-11 + d, b, a] : lado === "f" ? [a, b, 46 - d] : lado === "a" ? [-7 + d, b, a] : lado === "b" ? [7 - d, b, a] : [a, b, 29.8 - d];
function fachadas(g, cam, oscuro) {
  for (const B of BLOQUES) {
    const pts = [enLado(B.lado, B.a, 0), enLado(B.lado, B.a + B.w, 0), enLado(B.lado, B.a + B.w, B.h), enLado(B.lado, B.a, B.h)];
    if (!poli(g, cam, pts)) continue;
    const P0 = k.proyecta(cam, enLado(B.lado, B.a, 0)), P1 = k.proyecta(cam, enLado(B.lado, B.a, B.h));
    if (P0 && P1) { const gr = g.createLinearGradient(0, P1.y, 0, P0.y); gr.addColorStop(0, mh(mh(B.col, "#ff9a70", 0.25), "#100c16", oscuro)); gr.addColorStop(1, mh(mh(B.col, "#1a1020", 0.45), "#08060c", oscuro)); g.fillStyle = gr; }
    else g.fillStyle = mh(B.col, "#100c16", oscuro);
    g.fill();
    // la cornisa
    if (poli(g, cam, [enLado(B.lado, B.a, B.h - 0.35, 0.01), enLado(B.lado, B.a + B.w, B.h - 0.35, 0.01), enLado(B.lado, B.a + B.w, B.h, 0.01), enLado(B.lado, B.a, B.h, 0.01)])) { g.fillStyle = `rgba(255,190,150,${0.25 * (1 - oscuro)})`; g.fill(); }
    g.save(); g.globalCompositeOperation = "lighter";
    for (const w of B.ventanas) {
      if (!w.on) continue;
      if (poli(g, cam, [enLado(B.lado, w.a, w.b, 0.01), enLado(B.lado, w.a + 1.2, w.b, 0.01), enLado(B.lado, w.a + 1.2, w.b + 1.6, 0.01), enLado(B.lado, w.a, w.b + 1.6, 0.01)])) {
        g.fillStyle = `rgba(${w.c},${0.7 * (1 - oscuro)})`; g.fill();
      }
    }
    g.restore();
  }
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [z, c] of TIENDAS) {
    if (poli(g, cam, [[3.19, 0.3, z], [3.19, 0.3, z + 6], [3.19, 2.6, z + 6], [3.19, 2.6, z]])) { g.fillStyle = `rgba(${c},${0.5 * (1 - oscuro)})`; g.fill(); }
    luz(g, cam, [2.6, 1.4, z + 3], 6, c, 0.35 * (1 - oscuro));
  }
  g.restore();
}

function farolas(g, cam, oscuro) {
  for (const [x, z] of FAROLAS) {
    const zc = aCam(cam, [x, 2.5, z])[2];
    if (zc > 0.6 && linea(g, cam, [x, 0, z], [x, 5, z])) { g.strokeStyle = "#1a1622"; g.lineWidth = Math.min(30, Math.max(1, k.tamano(0.07, zc))); g.stroke(); }
    luz(g, cam, [x - Math.sign(x) * 0.5, 5, z], 3.2, "255,200,120", 0.9 * (1 - oscuro * 0.6));
    luz(g, cam, [x - Math.sign(x) * 0.5, 5, z], 0.8, "255,240,210", 1);
  }
}

// Un coche que cruza por la calzada del paso: x del centro, z del carril, color, sentido (1: hacia +x).
export function coche(g, cam, x, z, color, sentido = 1) {
  const L = 4.3, W = 1.8, c = cam.p;
  const cara = (pts, col) => { if (poli(g, cam, pts)) { g.fillStyle = col; g.fill(); } };
  const zc = c[2] < z ? z - W / 2 : z + W / 2;
  const osc = mh(color, "#000000", 0.45), cla = mh(color, "#ffffff", 0.3);
  // la sombra
  g.save(); g.globalAlpha = 0.5; cara([[x - L / 2 - 0.2, 0.01, z - W / 2 - 0.2], [x + L / 2 + 0.2, 0.01, z - W / 2 - 0.2], [x + L / 2 + 0.2, 0.01, z + W / 2 + 0.2], [x - L / 2 - 0.2, 0.01, z + W / 2 + 0.2]], "#000000"); g.restore();
  // el frente o la trasera que se ve
  const xf = c[0] > x ? x + L / 2 : x - L / 2;
  cara([[xf, 0.3, z - W / 2], [xf, 0.3, z + W / 2], [xf, 0.95, z + W / 2], [xf, 0.95, z - W / 2]], osc);
  // el techo del cuerpo
  cara([[x - L / 2, 0.95, z - W / 2], [x + L / 2, 0.95, z - W / 2], [x + L / 2, 0.95, z + W / 2], [x - L / 2, 0.95, z + W / 2]], cla);
  // la cabina: lunas oscuras con un reflejo
  const xa = x - L * 0.22 * sentido, xb = x + L * 0.18 * sentido, x0 = Math.min(xa, xb), x1 = Math.max(xa, xb);
  cara([[x0 - 0.35, 0.95, zc], [x1 + 0.35, 0.95, zc], [x1, 1.45, zc - Math.sign(zc - z) * 0.12], [x0, 1.45, zc - Math.sign(zc - z) * 0.12]], "#1d2a44");
  cara([[x0, 1.45, z - W * 0.38], [x1, 1.45, z - W * 0.38], [x1, 1.45, z + W * 0.38], [x0, 1.45, z + W * 0.38]], cla);
  // el costado que da a la cámara, con su brillo
  cara([[x - L / 2, 0.3, zc], [x + L / 2, 0.3, zc], [x + L / 2, 0.95, zc], [x - L / 2, 0.95, zc]], color);
  cara([[x - L / 2, 0.82, zc], [x + L / 2, 0.82, zc], [x + L / 2, 0.92, zc], [x - L / 2, 0.92, zc]], cla);
  // las ruedas
  for (const dx of [-1.35, 1.35]) {
    const P = k.proyecta(cam, [x + dx, 0.34, zc]);
    if (P) { const r = k.tamano(0.34, P.z); g.fillStyle = "#0b0b0e"; g.beginPath(); g.ellipse(P.x, P.y, r, r, 0, 0, 6.2832); g.fill(); g.fillStyle = "#8a8f99"; g.beginPath(); g.ellipse(P.x, P.y, r * 0.45, r * 0.45, 0, 0, 6.2832); g.fill(); }
  }
  // los faros delante y las luces rojas detrás
  const fr = x + (L / 2) * sentido, tr = x - (L / 2) * sentido;
  for (const dz of [-0.62, 0.62]) {
    luz(g, cam, [fr, 0.62, z + dz], 1.4, "255,245,220", 0.9); luz(g, cam, [fr, 0.62, z + dz], 0.3, "255,255,255", 1);
    luz(g, cam, [tr, 0.7, z + dz], 0.7, "255,40,40", 0.9);
  }
}

// ---------------------------------------------------------------- el suelo
const azT = azar(5);
const TONOS = Array.from({ length: 4000 }, () => azT());

// o: { tinte (color de la franja y los botones; null = amarillo), suelo (color de la acera), oscuro, cebra, coches(t) }
export function calle(g, t, cam, o = {}) {
  const oscuro = o.oscuro || 0;
  cielo(g, cam, oscuro);
  // el sol que se pone al fondo de la avenida de enfrente
  const sol = k.proyecta(cam, [0, 25, 1200]);
  if (sol) { k.brillo(g, sol.x, sol.y, 1500, "255,150,80", 0.8 * (1 - oscuro)); k.brillo(g, sol.x, sol.y, 380, "255,230,170", 1 - oscuro); }
  if (quad(g, cam, -7, 7, 46, 400)) { g.fillStyle = mh("#3a2c3e", "#0c0b10", oscuro); g.fill(); }
  g.fillStyle = mh("#c9a9a0", "#2a2628", oscuro);
  for (let z = 50; z < 300; z += 9) if (quad(g, cam, -0.12, 0.12, z, z + 4.5, 0.003)) g.fill();
  fachadas(g, cam, oscuro);
  // la calzada (la del paso y la de la izquierda) y la acera de enfrente
  if (quad(g, cam, -60, 60, BORDILLO, CALZADA)) { g.fillStyle = mh("#2a2633", "#0c0b10", oscuro); g.fill(); }
  if (quad(g, cam, -11, ACERA_X[0] - 0.1, -40, BORDILLO)) { g.fillStyle = mh("#2a2633", "#0c0b10", oscuro); g.fill(); }
  if (quad(g, cam, -60, 60, CALZADA, 46)) { g.fillStyle = mh("#8c7f84", "#2a2628", oscuro); g.fill(); }
  // el paso de cebra
  g.fillStyle = mh("#e9e4e6", "#6a6668", oscuro);
  for (let x = -2.4; x < 2.5; x += 0.8) if (quad(g, cam, x, x + 0.45, BORDILLO + 0.6, CALZADA - 0.6, 0.003)) g.fill();
  // la línea de detención y las líneas de la calle
  if (quad(g, cam, -11, ACERA_X[0] - 0.1, -40, -39.9)) g.fill();
  // los coches
  if (o.coches) for (const c of o.coches(t)) coche(g, cam, c.x, c.z, c.color, c.sentido);
  // el bordillo
  if (poli(g, cam, [[-60, 0, BORDILLO], [60, 0, BORDILLO], [60, 0.14, BORDILLO], [-60, 0.14, BORDILLO]])) { g.fillStyle = "#6e6670"; g.fill(); }
  if (poli(g, cam, [[ACERA_X[0] - 0.1, 0, -40], [ACERA_X[0] - 0.1, 0, BORDILLO], [ACERA_X[0] - 0.1, 0.14, BORDILLO], [ACERA_X[0] - 0.1, 0.14, -40]])) { g.fillStyle = "#6e6670"; g.fill(); }
  // nuestra acera: baldosas de 40 cm, cada una con su tono
  const suelo = o.suelo || "#9c938e";
  const cz = cam.p[2];
  const zA = Math.max(-40, Math.floor((cz - 30) / 0.4) * 0.4), zB = Math.min(BORDILLO, cz + 60);
  if (quad(g, cam, ACERA_X[0], ACERA_X[1], -40, BORDILLO, 0.14)) { g.fillStyle = suelo; g.fill(); }
  // la luz de las farolas, en el tono de cada baldosa; las lejanas se funden con el fondo
  const calido = mh(suelo, "#ffd6a0", 0.6);
  for (let z = zA; z < zB - 0.01; z += 0.4) {
    for (let x = ACERA_X[0]; x < ACERA_X[1] - 0.01; x += 0.4) {
      const d = Math.hypot(x + 0.2 - cam.p[0], cam.p[1], z + 0.2 - cz);
      const al = 1 - k.tramo(d, 20, 27);
      if (al <= 0) continue;
      const tn = TONOS[(Math.round(z / 0.4) * 17 + Math.round(x / 0.4) * 131 + 4000000) % 4000];
      let luzF = 0;
      for (const [lx, lz] of FAROLAS) luzF += Math.exp(-((x + 0.2 - lx * 0.8) ** 2 + (z + 0.2 - lz) ** 2) / 9);
      if (quad(g, cam, x + 0.006, x + 0.394, z + 0.006, z + 0.394, 0.14)) {
        g.globalAlpha = al;
        g.fillStyle = mh(mh(suelo, tn < 0.5 ? "#7a706c" : "#b8ada4", Math.abs(tn - 0.5) * 0.45), calido, Math.min(0.7, luzF * 0.55 * (1 - oscuro)));
        g.fill();
        g.globalAlpha = 1;
      }
    }
  }
  tactil(g, t, cam, o);
  farolas(g, cam, oscuro);
}

// Grano y luz sobre una superficie (en pantalla, dentro de su forma).
function luzEn(g, cam, pts) {
  g.save();
  if (!poli(g, cam, pts)) { g.restore(); return; }
  g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.fillStyle = g.createPattern(GRANO, "repeat"); g.fillRect(0, 0, 1080, 1920);
  g.globalAlpha = 1; g.globalCompositeOperation = "multiply";
  const sg = g.createLinearGradient(0, 900, 0, 1920); sg.addColorStop(0, "rgba(255,240,220,1)"); sg.addColorStop(1, "rgba(225,185,150,1)");
  g.fillStyle = sg; g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

// La franja de rayas y la banda de botones. o.tinte: su color si no es amarillo.
export function tactil(g, t, cam, o = {}) {
  const Y = 0.14, base = o.tinte || AMARILLO, hR = 0.005;
  const oscB = mh(base, "#7a4a00", 0.22), claB = mh(base, "#ffffff", 0.3);
  // la franja: el fondo, las juntas y las rayas
  if (quad(g, cam, FRANJA.x0, FRANJA.x1, FRANJA.z0, FRANJA.z1, Y + 0.0005)) { g.fillStyle = oscB; g.fill(); }
  const cz = cam.p[2];
  g.strokeStyle = "rgba(40,25,0,0.5)"; g.lineWidth = 2;
  for (let z = Math.max(FRANJA.z0, Math.floor((cz - 20) / 0.4) * 0.4); z < Math.min(FRANJA.z1, cz + 30); z += 0.4) if (linea(g, cam, [FRANJA.x0, Y + 0.001, z], [FRANJA.x1, Y + 0.001, z])) g.stroke();
  const RAYAS = 9, paso = (FRANJA.x1 - FRANJA.x0) / RAYAS, w = 0.032;
  const orden = Array.from({ length: RAYAS }, (_, i) => FRANJA.x0 + paso * (i + 0.5)).sort((a, b) => Math.abs(b - cam.p[0]) - Math.abs(a - cam.p[0]));
  for (const xc of orden) {
    const x0 = xc - w / 2, x1 = xc + w / 2, z0 = FRANJA.z0, z1 = FRANJA.z1 - 0.03;
    if (cam.p[0] < x0) { if (poli(g, cam, [[x0, Y, z0], [x0, Y, z1], [x0, Y + hR, z1], [x0, Y + hR, z0]])) { g.fillStyle = claB; g.fill(); } }
    else if (cam.p[0] > x1) { if (poli(g, cam, [[x1, Y, z0], [x1, Y, z1], [x1, Y + hR, z1], [x1, Y + hR, z0]])) { g.fillStyle = oscB; g.fill(); } }
    if (poli(g, cam, [[x0, Y + hR, z0], [x1, Y + hR, z0], [x1, Y + hR, z1], [x0, Y + hR, z1]])) {
      g.fillStyle = base; g.fill();
    }
  }
  luzEn(g, cam, [[FRANJA.x0, Y + hR, FRANJA.z0], [FRANJA.x1, Y + hR, FRANJA.z0], [FRANJA.x1, Y + hR, FRANJA.z1], [FRANJA.x0, Y + hR, FRANJA.z1]]);
  // la banda de botones
  if (quad(g, cam, BANDA.x0, BANDA.x1, BANDA.z0, BANDA.z1, Y + 0.0005)) { g.fillStyle = oscB; g.fill(); }
  g.strokeStyle = "rgba(40,25,0,0.5)"; g.lineWidth = 2;
  for (let x = BANDA.x0; x <= BANDA.x1 + 0.01; x += 0.4) if (linea(g, cam, [x, Y + 0.001, BANDA.z0], [x, Y + 0.001, BANDA.z1])) g.stroke();
  for (let z = BANDA.z0; z <= BANDA.z1 + 0.01; z += 0.4) if (linea(g, cam, [BANDA.x0, Y + 0.001, z], [BANDA.x1, Y + 0.001, z])) g.stroke();
  const sp = 0.4 / 6, filas = [];
  for (let z = BANDA.z0 + sp / 2; z < BANDA.z1; z += sp) filas.push(z);
  filas.sort((a, b) => Math.abs(b - cam.p[2]) - Math.abs(a - cam.p[2]));
  const cols = []; for (let x = BANDA.x0 + sp / 2; x < BANDA.x1; x += sp) cols.push(x);
  cols.sort((a, b) => Math.abs(b - cam.p[0]) - Math.abs(a - cam.p[0]));
  for (const z of filas) for (const x of cols) {
    const c = aCam(cam, [x, Y, z]);
    if (c[2] < 0.03) continue;
    const r = (k.F * 0.0125) / c[2];
    if (r < 0.9) continue;
    const [px, py] = enPantalla(c);
    if (px < -r * 2 || px > 1080 + r * 2 || py < -r * 2 || py > 1920 + r * 2) continue;
    const dist = Math.hypot(cam.p[0] - x, cam.p[1] - Y, cam.p[2] - z), s = Math.min(1, Math.max(0.05, (cam.p[1] - Y) / dist));
    const sc = r / 50, img = spriteTenido(s, o.tinte);
    g.drawImage(img, px - 64 * sc, py - 78 * sc, 128 * sc, 140 * sc);
  }
}

// La cámara de un tramo de calle a partir de claves [t, pos, mira].
export const camino = (claves) => k.ruta(claves.map(([t, pos, mira]) => [t, { pos, mira }]));
export { tr, mez };
