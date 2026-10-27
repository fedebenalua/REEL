// Lo que comparten los planos: el chip de la IA (con sus pistas de luz cian), el mar de luces de la humanidad, el
// cerebro de oro que forman juntas, el rey del ajedrez, la medalla y el velo del subtítulo.
import * as k from "#kit";

const { suave, tramo, azar, F, res, pto } = k;

// ---------------------------------------------------------------- 3D: recortar contra la cámara
// Un punto del mundo en el espacio de la cámara: [derecha, arriba, delante].
export const enCam = (cam, X) => { const d = res(X, cam.p); return [pto(d, cam.e.r), pto(d, cam.e.u), pto(d, cam.e.f)]; };
const aPant = (c) => ({ x: 540 + (F * c[0]) / c[2], y: 960 - (F * c[1]) / c[2], z: c[2] });
const CERCA = 0.25;
// Un polígono del mundo, recortado por delante de la cámara y proyectado (lista de {x, y}), o null.
export function poligono(cam, pts) {
  const c = pts.map((p) => enCam(cam, p)), out = [];
  for (let i = 0; i < c.length; i++) {
    const a = c[i], b = c[(i + 1) % c.length], ad = a[2] >= CERCA, bd = b[2] >= CERCA;
    if (ad) out.push(a);
    if (ad !== bd) { const u = (CERCA - a[2]) / (b[2] - a[2]); out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, CERCA]); }
  }
  return out.length >= 3 ? out.map(aPant) : null;
}
export function traza(g, P) { g.beginPath(); g.moveTo(P[0].x, P[0].y); for (let i = 1; i < P.length; i++) g.lineTo(P[i].x, P[i].y); g.closePath(); }
// Un segmento del mundo recortado por delante de la cámara: [a, b] en pantalla, o null.
export function segmento(cam, A, B) {
  let a = enCam(cam, A), b = enCam(cam, B);
  if (a[2] < CERCA && b[2] < CERCA) return null;
  if (a[2] < CERCA) { const u = (CERCA - a[2]) / (b[2] - a[2]); a = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, CERCA]; }
  if (b[2] < CERCA) { const u = (CERCA - b[2]) / (a[2] - b[2]); b = [b[0] + (a[0] - b[0]) * u, b[1] + (a[1] - b[1]) * u, CERCA]; }
  return [aPant(a), aPant(b)];
}

// ---------------------------------------------------------------- el chip de la IA
// Un chip cuadrado, tumbado (su cara de arriba en y = 0 de su sitio), de medio lado 10, con su núcleo en el centro,
// pistas que salen del núcleo a los bordes (con sus codos), patas doradas y pulsos de luz cian corriendo por las pistas.
export const CH = 10, NUC = 3.2;
const PISTAS = (() => {
  const az = azar(404), l = [];
  for (let lado = 0; lado < 4; lado++) {
    for (let i = 0; i < 13; i++) {
      const s = -NUC + 0.35 + (i / 12) * (2 * NUC - 0.7);
      const codo = (az() - 0.5) * 5.5, d1 = NUC + 0.6 + az() * 2.6, d2 = d1 + 1.0 + az() * 1.2;
      // en coordenadas de un lado (a lo largo del lado, hacia fuera); luego se giran
      const loc = [[s, NUC], [s, d1], [s + codo * 0.5, d2], [s + codo * 0.5, CH - 0.2]];
      const p = loc.map(([a, o]) => (lado === 0 ? [a, -o] : lado === 1 ? [o, a] : lado === 2 ? [-a, o] : [-o, -a]));
      let L = 0; const tramos = [];
      for (let j = 0; j < p.length - 1; j++) { const d = Math.hypot(p[j + 1][0] - p[j][0], p[j + 1][1] - p[j][1]); tramos.push(d); L += d; }
      l.push({ p, tramos, L, vel: 3 + az() * 4, fase: az() * 20, color: az() < 0.18 ? "violeta" : "cian", ancho: 0.09 + az() * 0.07 });
    }
  }
  // más pistas por toda la cara: salen de cualquier sitio fuera del núcleo y van, con un codo, al borde más cercano
  for (let n = 0; n < 110; n++) {
    const x = (az() * 2 - 1) * (CH - 0.6), z = (az() * 2 - 1) * (CH - 0.6);
    if (Math.abs(x) < NUC + 0.4 && Math.abs(z) < NUC + 0.4) continue;
    const p = [[x, z]];
    if (Math.abs(x) > Math.abs(z)) { const sx = Math.sign(x), m = x + sx * (CH - Math.abs(x)) * 0.45, jz = z + (az() - 0.5) * 2.2; p.push([m, z], [m + sx * 0.6, jz], [sx * (CH - 0.2), jz]); }
    else { const sz = Math.sign(z), m = z + sz * (CH - Math.abs(z)) * 0.45, jx = x + (az() - 0.5) * 2.2; p.push([x, m], [jx, m + sz * 0.6], [jx, sz * (CH - 0.2)]); }
    let L = 0; const tramos = [];
    for (let j = 0; j < p.length - 1; j++) { const d = Math.hypot(p[j + 1][0] - p[j][0], p[j + 1][1] - p[j][1]); tramos.push(d); L += d; }
    if (L < 1) continue;
    l.push({ p, tramos, L, vel: 2.5 + az() * 3.5, fase: az() * 20, color: az() < 0.25 ? "violeta" : "cian", ancho: 0.05 + az() * 0.06 });
  }
  return l;
})();
const PATAS = (() => { const l = []; for (let lado = 0; lado < 4; lado++) for (let i = 0; i < 16; i++) l.push({ lado, s: -CH + 1 + (i / 15) * (2 * CH - 2) }); return l; })();
const enPista = (pi, d) => {
  let r = ((d % pi.L) + pi.L) % pi.L;
  for (let j = 0; j < pi.tramos.length; j++) {
    if (r <= pi.tramos[j]) { const u = r / pi.tramos[j], a = pi.p[j], b = pi.p[j + 1]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; }
    r -= pi.tramos[j];
  }
  return pi.p[pi.p.length - 1];
};
// La rejilla fina de la superficie (líneas), para que se note que es un chip y que vuela por debajo.
const REJILLA = (() => { const l = []; for (let i = -9; i <= 9; i += 1.5) { l.push([[i, -CH], [i, CH]]); l.push([[-CH, i], [CH, i]]); } return l; })();

// Dibuja el chip en C (centro de su cara de arriba), con escala e. t: el segundo (para los pulsos). luz: de 0 a 1 lo
// que brilla el núcleo (1 = normal; más, estalla). al: transparencia (dibújalo en un lienzo aparte si es < 1).
export function chip(g, cam, C, t, { e = 1, luz = 1, pulsos = 1 } = {}) {
  const W = (x, z, y = 0) => [C[0] + x * e, C[1] + y * e, C[2] + z * e];
  // el canto y la sombra de debajo
  const caras = [
    [W(-CH, CH), W(CH, CH), W(CH, CH, -1.3), W(-CH, CH, -1.3)],
    [W(CH, -CH), W(CH, CH), W(CH, CH, -1.3), W(CH, -CH, -1.3)],
    [W(-CH, -CH), W(-CH, CH), W(-CH, CH, -1.3), W(-CH, -CH, -1.3)],
    [W(-CH, -CH), W(CH, -CH), W(CH, -CH, -1.3), W(-CH, -CH, -1.3)],
  ];
  // patas doradas, que asoman por los cuatro lados
  for (const pa of PATAS) {
    const a = pa.s - 0.28, b = pa.s + 0.28, o0 = CH - 0.1, o1 = CH + 1.1;
    const loc = [[a, o0], [b, o0], [b, o1], [a, o1]];
    const pts = loc.map(([s, o]) => (pa.lado === 0 ? W(s, -o, -0.75) : pa.lado === 1 ? W(o, s, -0.75) : pa.lado === 2 ? W(-s, o, -0.75) : W(-o, -s, -0.75)));
    const P = poligono(cam, pts);
    if (!P) continue;
    traza(g, P);
    const xs = P.map((p) => p.x); k.metal(g, Math.min(...xs), Math.max(...xs), ["#7a5a1c", "#ffe08a", "#c99a3a", "#fff2c0", "#8a6420"]);
  }
  for (const c of caras) { const P = poligono(cam, c); if (P) { traza(g, P); g.fillStyle = "#1a2236"; g.fill(); g.strokeStyle = "rgba(120,200,255,0.25)"; g.lineWidth = 1.5; g.stroke(); } }
  // la cara de arriba: azul noche, más clara hacia el núcleo, con su granulación
  const top = poligono(cam, [W(-CH, -CH), W(CH, -CH), W(CH, CH), W(-CH, CH)]);
  if (!top) return;
  const N = k.proyecta(cam, W(0, 0));
  g.save();
  traza(g, top); g.clip();
  const xs = top.map((p) => p.x), ys = top.map((p) => p.y), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const cx = N ? N.x : (x0 + x1) / 2, cy = N ? N.y : (y0 + y1) / 2, R = Math.max(x1 - x0, y1 - y0);
  const rg = g.createRadialGradient(cx, cy, 0, cx, cy, R * 0.75);
  rg.addColorStop(0, "#1d3358"); rg.addColorStop(0.45, "#111d36"); rg.addColorStop(1, "#070c18");
  g.fillStyle = rg; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.red, x0, y0, x1 - x0, y1 - y0);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // la rejilla fina
  g.strokeStyle = "rgba(110,170,255,0.10)"; g.lineWidth = 1.2;
  for (const [a, b] of REJILLA) { const s = segmento(cam, W(a[0], a[1], 0.01), W(b[0], b[1], 0.01)); if (s) { g.beginPath(); g.moveTo(s[0].x, s[0].y); g.lineTo(s[1].x, s[1].y); g.stroke(); } }
  // las pistas
  g.lineCap = "round"; g.lineJoin = "round";
  for (const pi of PISTAS) {
    for (let j = 0; j < pi.p.length - 1; j++) {
      const s = segmento(cam, W(pi.p[j][0], pi.p[j][1], 0.02), W(pi.p[j + 1][0], pi.p[j + 1][1], 0.02));
      if (!s) continue;
      const z = Math.max(0.3, Math.min(enCam(cam, W(pi.p[j][0], pi.p[j][1]))[2], enCam(cam, W(pi.p[j + 1][0], pi.p[j + 1][1]))[2]));
      g.strokeStyle = pi.color === "cian" ? "rgba(70,170,230,0.55)" : "rgba(150,110,240,0.55)";
      g.lineWidth = Math.max(1.2, Math.min(40, (F * pi.ancho * e) / z));
      g.beginPath(); g.moveTo(s[0].x, s[0].y); g.lineTo(s[1].x, s[1].y); g.stroke();
    }
  }
  g.restore();
  // los pulsos: luces que salen del núcleo hacia los bordes, con su cola
  if (pulsos > 0) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (const pi of PISTAS) {
      for (let q = 0; q < 2; q++) {
        const d = t * pi.vel * (1 + 0.6 * (luz - 1)) + pi.fase + q * pi.L * 0.5;
        const a = enPista(pi, d), b = enPista(pi, d - 1.2);
        if (Math.abs((((d % pi.L) + pi.L) % pi.L)) < 1.2) continue;
        const s = segmento(cam, W(a[0], a[1], 0.05), W(b[0], b[1], 0.05));
        if (!s) continue;
        const z = Math.max(0.3, enCam(cam, W(a[0], a[1]))[2]), w = Math.max(2, Math.min(46, (F * 0.16 * e) / z));
        const rgb = k.COLORES[pi.color];
        const lg = g.createLinearGradient(s[1].x, s[1].y, s[0].x, s[0].y); lg.addColorStop(0, `rgba(${rgb},0)`); lg.addColorStop(1, `rgba(${rgb},${0.9 * pulsos})`);
        g.strokeStyle = lg; g.lineWidth = w; g.beginPath(); g.moveTo(s[1].x, s[1].y); g.lineTo(s[0].x, s[0].y); g.stroke();
        k.brillo(g, s[0].x, s[0].y, Math.min(260, w * 5), pi.color, 0.75 * pulsos);
      }
    }
    g.restore();
  }
  // el núcleo: un cuadrado de cristal oscuro que brilla por dentro
  const nuc = poligono(cam, [W(-NUC, -NUC, 0.3), W(NUC, -NUC, 0.3), W(NUC, NUC, 0.3), W(-NUC, NUC, 0.3)]);
  if (nuc) {
    const nx = nuc.map((p) => p.x), ny = nuc.map((p) => p.y), mx = (Math.min(...nx) + Math.max(...nx)) / 2, my = (Math.min(...ny) + Math.max(...ny)) / 2, nr = Math.max(Math.max(...nx) - Math.min(...nx), Math.max(...ny) - Math.min(...ny));
    traza(g, nuc);
    const ng = g.createRadialGradient(mx, my, 0, mx, my, nr * 0.7);
    ng.addColorStop(0, `rgba(${Math.round(120 + 100 * Math.min(1, luz))},240,255,1)`); ng.addColorStop(0.35, "rgba(40,140,220,1)"); ng.addColorStop(1, "rgba(12,30,70,1)");
    g.fillStyle = ng; g.fill();
    g.strokeStyle = "rgba(200,240,255,0.8)"; g.lineWidth = Math.max(1.5, nr * 0.012); g.stroke();
    g.save(); traza(g, nuc); g.clip(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.25; g.drawImage(k.causticas, mx - nr, my - nr, nr * 2, nr * 2);
    // las celdas del núcleo, como un procesador por dentro
    g.globalCompositeOperation = "source-over"; g.globalAlpha = 1; g.strokeStyle = "rgba(5,25,60,0.55)"; g.lineWidth = Math.max(1, nr * 0.006);
    for (let q = -NUC + 0.8; q < NUC - 0.1; q += 0.8) {
      for (const [a, b] of [[W(q, -NUC, 0.31), W(q, NUC, 0.31)], [W(-NUC, q, 0.31), W(NUC, q, 0.31)]]) { const s = segmento(cam, a, b); if (s) { g.beginPath(); g.moveTo(s[0].x, s[0].y); g.lineTo(s[1].x, s[1].y); g.stroke(); } }
    }
    g.restore();
    k.brillo(g, mx, my, Math.min(1100, nr * 2.6 * (0.7 + 0.5 * luz)), "cian", 0.55 * Math.min(2, luz) * Math.min(1, 700 / nr));
  }
}

// ---------------------------------------------------------------- el mar de luces: la humanidad
// Un suelo enorme de noche (y = SUELO) cubierto de luces doradas, en grupos como pueblos y ciudades.
export const SUELO = -60;
export const MAR = (() => {
  const az = azar(2207), l = [];
  for (let c = 0; c < 900; c++) {
    const cx = (az() - 0.5) * 1400, cz = -1300 + az() * 1500, n = 3 + Math.floor(Math.pow(az(), 2.2) * 26), rad = 4 + az() * 14;
    for (let i = 0; i < n; i++) {
      const a = az() * 6.283, r = rad * Math.sqrt(az());
      l.push({ p: [cx + Math.cos(a) * r, SUELO, cz + Math.sin(a) * r], b: 0.5 + az() * 0.6, f: az() * 6.283, c: az() < 0.8 ? "255,196,110" : "255,236,190" });
    }
  }
  return l;
})();
// Dibuja el suelo con su horizonte y el mar de luces. al: lo encendidas que están (0 a 1). luz(q): un extra por luz.
export function mar(g, cam, t, { al = 1, extra = null } = {}) {
  // el suelo, más oscuro cerca y con un resplandor cálido en el horizonte
  const H = k.proyecta(cam, [cam.p[0], SUELO, cam.p[2] - 6000]);
  if (H && H.y < 1920) {
    const yh = H.y, sg = g.createLinearGradient(0, yh - 120, 0, 1920);
    sg.addColorStop(0, "rgba(40,30,40,0)"); sg.addColorStop(0.06, "rgba(70,45,40,0.9)"); sg.addColorStop(0.2, "#120d16"); sg.addColorStop(1, "#05060b");
    g.fillStyle = sg; g.fillRect(0, yh - 120, 1080, 1920 - yh + 120);
    k.brillo(g, 540, yh, 2400, "255,170,90", 0.18 * al);
  }
  g.save(); g.globalCompositeOperation = "lighter";
  const A = g.globalAlpha;
  for (let i = 0; i < MAR.length; i++) {
    const s = MAR[i], P = k.proyecta(cam, s.p);
    if (!P || P.x < -30 || P.x > 1110 || P.y < -30 || P.y > 1950) continue;
    const tw = 0.8 + 0.2 * Math.sin(t * 2.3 + s.f), b = al * s.b * tw * (extra ? 1 + extra(i, P) : 1);
    if (b <= 0.01) continue;
    const tam = Math.min(70, Math.max(2.2, (F * 0.9) / P.z));
    if (tam < 7) { g.globalAlpha = A * Math.min(1, b); g.fillStyle = `rgb(${s.c})`; g.fillRect(P.x - tam / 4, P.y - tam / 4, tam / 2, tam / 2); }
    else { g.globalAlpha = A * Math.min(1, b); g.drawImage(k.halo(s.c), P.x - tam, P.y - tam, tam * 2, tam * 2); }
  }
  g.restore();
}

// ---------------------------------------------------------------- el cerebro de oro
// Una nube de puntos con forma de cerebro (dos hemisferios con sus pliegues), de largo 2 (de delante a atrás), y
// unas conexiones entre puntos cercanos.
// De perfil (z hacia delante): el cerebro grande, con el lóbulo de abajo que baja por delante, el cerebelo detrás y
// abajo, y el tronco. Los pliegues: los puntos brillan más sobre unas líneas que serpentean por la superficie.
export const CEREBRO = (() => {
  const az = azar(8080), l = [];
  const pliegue = (x, y, z) => Math.sin(9 * x + 4 * Math.sin(5 * z)) + Math.sin(8 * y + 3 * Math.sin(6 * x + 1)) + Math.sin(7 * z + 3 * Math.sin(7 * y + 2));
  while (l.length < 2600) {
    const r = az();
    let x = az() * 2 - 1, y = az() * 2 - 1, z = az() * 2 - 1; const d = Math.hypot(x, y, z);
    if (d > 1 || d < 0.01) continue;
    x /= d; y /= d; z /= d;
    let X, Y, Z, parte = "cerebro";
    if (r < 0.86) {
      const pl = 1 + 0.05 * Math.sin(11 * x + 2) * Math.sin(9 * y + 1) * Math.sin(10 * z);
      X = x * 0.72 * pl; Y = y * 0.62 * pl; Z = z * pl;
      // por debajo, plano; el lóbulo temporal baja un poco por delante del centro
      const fondo = -0.3 - 0.12 * Math.exp(-Math.pow((Z - 0.15) / 0.35, 2));
      if (Y < fondo) Y = fondo + (Y - fondo) * 0.25;
      X = Math.sign(X || 1) * (Math.abs(X) * 0.93 + 0.05);
    } else if (r < 0.96) {
      parte = "cerebelo";
      X = x * 0.42; Y = -0.42 + y * 0.17; Z = -0.68 + z * 0.24;
    } else {
      parte = "tronco";
      const h = az(); X = x * 0.1; Y = -0.35 - h * 0.45; Z = -0.32 + z * 0.1 - h * 0.08;
    }
    const f = pliegue(X, Y, Z), linea = Math.exp(-f * f * 3);
    const b = parte === "cerebro" ? 0.25 + 0.95 * linea : parte === "cerebelo" ? 0.35 + 0.5 * Math.abs(Math.sin(Y * 60)) : 0.45;
    l.push({ p: [X, Y + 0.08, Z], b, f: az() * 6.283 });
  }
  return l;
})();
export const ENLACES = (() => {
  const az = azar(81), l = [];
  for (let n = 0; n < 900; n++) {
    const i = Math.floor(az() * CEREBRO.length), a = CEREBRO[i].p;
    for (let tries = 0; tries < 30; tries++) {
      const j = Math.floor(az() * CEREBRO.length), b = CEREBRO[j].p, d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (d > 0.05 && d < 0.2 && Math.sign(a[0]) === Math.sign(b[0])) { l.push([i, j]); break; }
    }
  }
  return l;
})();
// El sitio en el mundo de cada punto del cerebro, con centro B, tamaño R y girado ang alrededor del eje vertical.
export const enCerebro = (q, B, R, ang) => {
  const [x, y, z] = q, c = Math.cos(ang), s = Math.sin(ang);
  return [B[0] + R * (x * c + z * s), B[1] + R * y, B[2] + R * (-x * s + z * c)];
};
// Dibuja el cerebro de oro. pos(i): si se da, el sitio de cada punto (para cuando llegan volando); si no, en su sitio.
// al: lo encendido; brillo extra: late. color: "r,g,b".
export function cerebro(g, cam, B, R, ang, t, { al = 1, pos = null, enlaces = 1, color = "255,205,110", nucleo = 1 } = {}) {
  if (al <= 0.003) return;
  const A = g.globalAlpha, Pp = new Array(CEREBRO.length);
  for (let i = 0; i < CEREBRO.length; i++) Pp[i] = k.proyecta(cam, pos ? pos(i) : enCerebro(CEREBRO[i].p, B, R, ang));
  g.save(); g.globalCompositeOperation = "lighter";
  // el resplandor de dentro
  const Bc = k.proyecta(cam, B);
  if (Bc && nucleo > 0) { const rr = (F * R) / Bc.z; k.brillo(g, Bc.x, Bc.y, rr * 3.4, color, 0.4 * al * nucleo); }
  if (enlaces > 0) {
    g.lineWidth = 1.4; g.strokeStyle = `rgba(${color},${0.22 * al * enlaces})`; g.beginPath();
    for (const [i, j] of ENLACES) { const a = Pp[i], b = Pp[j]; if (a && b) { g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); } }
    g.stroke();
  }
  for (let i = 0; i < CEREBRO.length; i++) {
    const P = Pp[i]; if (!P || P.x < -40 || P.x > 1120 || P.y < -40 || P.y > 1960) continue;
    const s = CEREBRO[i], tam = Math.min(60, Math.max(5, (F * 0.022 * R) / P.z) * (0.8 + 0.4 * s.b));
    g.globalAlpha = A * Math.min(1, al * s.b * (0.75 + 0.25 * Math.sin(t * 3 + s.f)));
    g.drawImage(k.halo(color), P.x - tam, P.y - tam, tam * 2, tam * 2);
  }
  g.restore();
}

// ---------------------------------------------------------------- el rey del ajedrez
// Un rey de pie con su base en (x, y), de alto h píxeles, inclinado ang (radianes, desde la base). negro: true o false.
const PERFILES = {
  rey: [[0, 0], [0.36, 0], [0.37, 0.05], [0.31, 0.08], [0.33, 0.12], [0.24, 0.15], [0.17, 0.3], [0.13, 0.5], [0.14, 0.6], [0.24, 0.63], [0.24, 0.66], [0.15, 0.68], [0.2, 0.78], [0.18, 0.83], [0.08, 0.85], [0.08, 0.86]],
  dama: [[0, 0], [0.36, 0], [0.37, 0.05], [0.31, 0.08], [0.33, 0.12], [0.24, 0.15], [0.16, 0.3], [0.12, 0.5], [0.13, 0.58], [0.23, 0.61], [0.23, 0.64], [0.14, 0.66], [0.22, 0.8], [0.12, 0.83], [0.06, 0.86], [0.06, 0.87]],
  torre: [[0, 0], [0.36, 0], [0.37, 0.05], [0.3, 0.09], [0.32, 0.12], [0.24, 0.15], [0.21, 0.42], [0.22, 0.47], [0.28, 0.5], [0.28, 0.62], [0.28, 0.62]],
};
// Una pieza de ajedrez de pie con su base en (x, y), de alto h píxeles (el del rey), inclinada ang desde la base.
export function rey(g, x, y, h, ang, negro = true, al = 1, tipo = "rey") {
  if (al <= 0.003) return;
  g.save(); g.globalAlpha *= al;
  g.translate(x, y); g.rotate(ang);
  const P = PERFILES[tipo].map(([r, a]) => [r * h, -a * h]);
  // el contorno, suavizado (curvas por los puntos medios)
  const O = P.concat(P.slice().reverse().map(([px, py]) => [-px, py]));
  g.beginPath(); g.moveTo(O[0][0], O[0][1]);
  for (let i = 1; i < O.length - 1; i++) g.quadraticCurveTo(O[i][0], O[i][1], (O[i][0] + O[i + 1][0]) / 2, (O[i][1] + O[i + 1][1]) / 2);
  g.lineTo(O[O.length - 1][0], O[O.length - 1][1]);
  g.closePath();
  const tonos = negro ? ["#06070b", "#2b2f3c", "#0d0f15", "#6a7184", "#05060a"] : ["#8d8270", "#fff9ec", "#d9ccb2", "#ffffff", "#7f735f"];
  k.metal(g, -0.37 * h, 0.37 * h, tonos);
  g.strokeStyle = negro ? "rgba(140,170,255,0.35)" : "rgba(255,240,210,0.6)"; g.lineWidth = Math.max(1.5, h * 0.008); g.stroke();
  if (tipo === "rey") {
    // la cruz de arriba
    const cw = 0.045 * h, ct = -0.86 * h;
    g.beginPath(); g.rect(-cw / 2, ct - 0.14 * h, cw, 0.14 * h); g.rect(-0.07 * h, ct - 0.1 * h, 0.14 * h, cw);
    k.metal(g, -0.07 * h, 0.07 * h, tonos);
  } else if (tipo === "dama") {
    // la corona de bolitas y la bola de arriba
    g.beginPath();
    for (let i = -2; i <= 2; i++) g.arc(i * 0.055 * h, -0.82 * h + Math.abs(i) * 0.012 * h, 0.03 * h, 0, Math.PI * 2);
    g.moveTo(0.05 * h, -0.91 * h); g.arc(0, -0.91 * h, 0.05 * h, 0, Math.PI * 2);
    k.metal(g, -0.14 * h, 0.14 * h, tonos);
  } else if (tipo === "torre") {
    // las almenas
    g.beginPath();
    for (let i = 0; i < 3; i++) g.rect(-0.28 * h + i * 0.205 * h, -0.7 * h, 0.15 * h, 0.09 * h);
    k.metal(g, -0.28 * h, 0.28 * h, tonos);
  }
  // un brillo de luz en el borde
  g.globalCompositeOperation = "lighter";
  const bg = g.createLinearGradient(0.1 * h, 0, 0.3 * h, 0); bg.addColorStop(0, "rgba(255,255,255,0)"); bg.addColorStop(1, `rgba(255,255,255,${negro ? 0.12 : 0.2})`);
  g.fillStyle = bg; g.beginPath(); g.moveTo(P[0][0], P[0][1]); for (const [px, py] of P) g.lineTo(px, py); g.lineTo(0, P[P.length - 1][1]); g.lineTo(0, 0); g.closePath(); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- el velo para el subtítulo
export function velo(g, al = 0.45) {
  const vg = g.createLinearGradient(0, 180, 0, 640); vg.addColorStop(0, `rgba(3,5,10,${al})`); vg.addColorStop(1, "rgba(3,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

export const CIELO = k.cielo(31, 900, [0, 0, 0], 3000, 900);
