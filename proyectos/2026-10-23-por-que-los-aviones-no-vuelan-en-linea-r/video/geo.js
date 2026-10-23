// El mapa y el globo: la misma Tierra (contornos de Natural Earth 1:50m) vista como un mapa plano (Mercator, el de casi
// todas las webs) o como una bola, y todo lo que hay entre una cosa y otra: cada punto se mueve de su sitio en el
// mapa al que le toca en la bola con `u` (0 = mapa plano, 1 = bola).
import * as k from "#kit";
import TIERRA from "./tierra-datos.js";

export const D = Math.PI / 180;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const merc = (phi) => Math.log(Math.tan(Math.PI / 4 + clamp(phi, -1.48, 1.48) / 2));
export const invMerc = (m) => 2 * Math.atan(Math.exp(m)) - Math.PI / 2;

// un punto de la Tierra con todo lo que hace falta calculado una vez
export const punto = (lonDeg, latDeg) => {
  const lam = lonDeg * D, phi = latDeg * D;
  return { lam, phi, sp: Math.sin(phi), cp: Math.cos(phi), my: merc(phi) };
};

// ---------------------------------------------------------------- los contornos
const POLIS = TIERRA.map((flat) => {
  const n = flat.length / 2, lam = new Float64Array(n), sp = new Float64Array(n), cp = new Float64Array(n), my = new Float64Array(n);
  const X = new Float64Array(n), Y = new Float64Array(n), Z = new Float64Array(n);
  let maxlat = -90, prev = flat[0], off = 0;
  for (let i = 0; i < n; i++) {
    // los contornos que cruzan la línea de cambio de fecha (lon ±180) se desenrollan para que no den un salto
    if (flat[2 * i] - prev > 180) off -= 360; else if (flat[2 * i] - prev < -180) off += 360;
    prev = flat[2 * i];
    const p = punto(flat[2 * i] + off, flat[2 * i + 1]);
    lam[i] = p.lam; sp[i] = p.sp; cp[i] = p.cp; my[i] = p.my; maxlat = Math.max(maxlat, flat[2 * i + 1]);
    X[i] = p.cp * Math.cos(p.lam); Y[i] = p.cp * Math.sin(p.lam); Z[i] = p.sp;
  }
  return { n, lam, sp, cp, my, maxlat, X, Y, Z };
}).filter((p) => p.maxlat > -58);
const BUF = new Float64Array(4096);

// ---------------------------------------------------------------- la vista
// lon0, lat0: el punto que queda en el centro (en grados). s: píxeles por radián del mapa plano. R: el radio de la bola.
// u: 0 mapa, 1 bola. cx, cy: dónde está el centro en la pantalla.
export function vista({ lon0, lat0, s = 800, R = 440, u = 0, cx = 540, cy = 960 }) {
  const lam0 = lon0 * D, phi0 = lat0 * D;
  return { lam0, phi0, sp0: Math.sin(phi0), cp0: Math.cos(phi0), m0: merc(phi0), s, R, u, cx, cy };
}
const OUT = [0, 0, 1];
// Proyecta un punto: deja en OUT [x, y, visible]. Lo que está al otro lado de la bola se pega al borde.
export function proyecta(V, lam, sp, cp, my, o = OUT) {
  const dl = lam - V.lam0;
  const fx = V.cx + V.s * dl, fy = V.cy - V.s * (my - V.m0);
  if (V.u <= 0.0005) { o[0] = fx; o[1] = fy; o[2] = 1; return o; }
  const cdl = Math.cos(dl), sdl = Math.sin(dl);
  let gx = V.R * cp * sdl, gy = V.R * (V.cp0 * sp - V.sp0 * cp * cdl);
  const cosc = V.sp0 * sp + V.cp0 * cp * cdl;
  let vis = 1;
  if (cosc < 0) {
    vis = 0;
    const l = Math.hypot(gx, gy);
    if (l < 1e-6) { gx = V.R; gy = 0; } else { gx *= V.R / l; gy *= V.R / l; }
  }
  const u = V.u;
  o[0] = fx + (V.cx + gx - fx) * u; o[1] = fy + (V.cy - gy - fy) * u; o[2] = vis;
  return o;
}
export const proyectaP = (V, p, o) => proyecta(V, p.lam, p.sp, p.cp, p.my, o);

// ---------------------------------------------------------------- dibujar la Tierra
// El camino de toda la tierra firme (sin pintar): luego fill / stroke / clip.
export function trazaTierra(g, V) {
  if (V.u > 0.985) return trazaTierraBola(g, V);
  g.beginPath();
  for (const P of POLIS) {
    const n = P.n;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, vis = 0;
    for (let i = 0; i < n; i++) {
      const o = proyecta(V, P.lam[i], P.sp[i], P.cp[i], P.my[i]);
      BUF[2 * i] = o[0]; BUF[2 * i + 1] = o[1]; if (o[2]) vis++;
      if (o[0] < x0) x0 = o[0]; if (o[0] > x1) x1 = o[0]; if (o[1] < y0) y0 = o[1]; if (o[1] > y1) y1 = o[1];
    }
    if (V.u > 0.0005 && vis === 0) continue;
    if (x1 < -120 || x0 > 1200 || y1 < -120 || y0 > 2040) continue;
    g.moveTo(BUF[0], BUF[1]);
    for (let i = 1; i < n; i++) g.lineTo(BUF[2 * i], BUF[2 * i + 1]);
    g.closePath();
  }
}

// Lo mismo cuando ya es una bola de verdad: cada contorno se recorta por el horizonte, y por donde se esconde
// detrás sigue el borde de la bola (así no hay rectas raras que cruzan la Tierra).
const SAL = [];
function trazaTierraBola(g, V) {
  const R = V.R, cl = V.lam0, ce = [-Math.sin(cl), Math.cos(cl), 0];
  const c = [V.cp0 * Math.cos(cl), V.cp0 * Math.sin(cl), V.sp0], no = [-V.sp0 * Math.cos(cl), -V.sp0 * Math.sin(cl), V.cp0];
  g.beginPath();
  for (const P of POLIS) {
    const n = P.n, co = new Float64Array(n);
    let vis = 0;
    for (let i = 0; i < n; i++) { co[i] = P.X[i] * c[0] + P.Y[i] * c[1] + P.Z[i] * c[2]; if (co[i] >= 0) vis++; }
    if (vis === 0) continue;
    const gp = (x, y, z) => [V.cx + R * (x * ce[0] + y * ce[1] + z * ce[2]), V.cy - R * (x * no[0] + y * no[1] + z * no[2])];
    SAL.length = 0;
    if (vis === n) {
      for (let i = 0; i < n; i++) SAL.push(gp(P.X[i], P.Y[i], P.Z[i]));
    } else {
      let i0 = 0; while (co[i0] < 0) i0++;
      let oculto = false, ang0 = 0, barrido = 0, angPrev = 0;
      const angDe = (q) => Math.atan2(-(q[1] - V.cy), q[0] - V.cx);
      const barre = (a) => { let d = a - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; barrido += d; angPrev = a; };
      for (let s = 0; s < n; s++) {
        const i = (i0 + s) % n, j = (i + 1) % n, ci = co[i], cj = co[j];
        if (!oculto) {
          if (ci >= 0) SAL.push(gp(P.X[i], P.Y[i], P.Z[i]));
          if (ci >= 0 && cj < 0) { // sale: el punto del horizonte
            const t = ci / (ci - cj), x = P.X[i] + t * (P.X[j] - P.X[i]), y = P.Y[i] + t * (P.Y[j] - P.Y[i]), z = P.Z[i] + t * (P.Z[j] - P.Z[i]), l = Math.hypot(x, y, z);
            const q = gp(x / l, y / l, z / l); SAL.push(q); oculto = true; ang0 = angDe(q); angPrev = ang0; barrido = 0;
          }
        } else {
          if (ci < 0) { const q = gp(P.X[i], P.Y[i], P.Z[i]), dx = q[0] - V.cx, dy = q[1] - V.cy; barre(angDe([V.cx + dx, V.cy + dy])); }
          if (ci < 0 && cj >= 0) { // vuelve: el punto del horizonte y, entre uno y otro, el borde de la bola
            const t = ci / (ci - cj), x = P.X[i] + t * (P.X[j] - P.X[i]), y = P.Y[i] + t * (P.Y[j] - P.Y[i]), z = P.Z[i] + t * (P.Z[j] - P.Z[i]), l = Math.hypot(x, y, z);
            const q = gp(x / l, y / l, z / l); barre(angDe(q));
            const pasos = Math.max(2, Math.ceil(Math.abs(barrido) / 0.08));
            for (let m = 1; m < pasos; m++) { const a = ang0 + (barrido * m) / pasos; SAL.push([V.cx + R * Math.cos(a), V.cy - R * Math.sin(a)]); }
            SAL.push(q); oculto = false;
          }
        }
      }
    }
    if (SAL.length < 3) continue;
    g.moveTo(SAL[0][0], SAL[0][1]);
    for (let i = 1; i < SAL.length; i++) g.lineTo(SAL[i][0], SAL[i][1]);
    g.closePath();
  }
}

// Una línea de puntos: se corta donde se esconde detrás de la bola. `desde`/`hasta`: qué parte (índices, con decimales).
export function trazaLinea(g, V, pts, desde = 0, hasta = pts.length - 1) {
  let abierta = false;
  const i0 = Math.max(0, Math.floor(desde)), i1 = Math.min(pts.length - 1, Math.ceil(hasta));
  for (let i = i0; i <= i1; i++) {
    let p = pts[i];
    if (i === i1 && hasta < i1) p = entre(pts[i - 1], pts[i], hasta - (i - 1));
    if (i === i0 && desde > i0) p = entre(pts[i], pts[i + 1], desde - i);
    const o = proyecta(V, p.lam, p.sp, p.cp, p.my);
    if (V.u > 0.0005 && !o[2]) { abierta = false; continue; }
    if (abierta) g.lineTo(o[0], o[1]); else { g.moveTo(o[0], o[1]); abierta = true; }
  }
}
export const entre = (a, b, u) => {
  const lam = a.lam + (b.lam - a.lam) * u, phi = a.phi + (b.phi - a.phi) * u;
  return { lam, phi, sp: Math.sin(phi), cp: Math.cos(phi), my: merc(phi) };
};

// ---------------------------------------------------------------- rutas
const aVec = (p) => [p.cp * Math.cos(p.lam), p.cp * Math.sin(p.lam), p.sp];
// El camino más corto entre A y B (un arco de círculo máximo), en N+1 puntos.
export function circuloMaximo(A, B, N = 240) {
  const a = aVec(A), b = aVec(B), c = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), om = Math.acos(c), pts = [];
  let prev = A.lam;
  for (let i = 0; i <= N; i++) {
    const t = i / N, w0 = Math.sin((1 - t) * om) / Math.sin(om), w1 = Math.sin(t * om) / Math.sin(om);
    const v = [w0 * a[0] + w1 * b[0], w0 * a[1] + w1 * b[1], w0 * a[2] + w1 * b[2]];
    let lam = Math.atan2(v[1], v[0]);
    while (lam - prev > Math.PI) lam -= 2 * Math.PI;
    while (lam - prev < -Math.PI) lam += 2 * Math.PI;
    prev = lam;
    const phi = Math.asin(clamp(v[2], -1, 1));
    pts.push({ lam, phi, sp: Math.sin(phi), cp: Math.cos(phi), my: merc(phi) });
  }
  return pts;
}
// La «recta» del mapa: rumbo constante (una recta en Mercator).
export function rumbo(A, B, N = 240) {
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, lam = A.lam + (B.lam - A.lam) * t, my = A.my + (B.my - A.my) * t, phi = invMerc(my);
    pts.push({ lam, phi, sp: Math.sin(phi), cp: Math.cos(phi), my });
  }
  return pts;
}
// Entre dos rutas con los mismos puntos: w = 0 la primera, w = 1 la segunda.
export function mezclaRutas(r1, r2, w) {
  return r1.map((p, i) => entre(p, r2[i], w));
}
// Dónde está y hacia dónde mira algo que va por una ruta, en la pantalla. i: el índice (con decimales).
export function sobreRuta(V, pts, i) {
  const n = pts.length - 1, a = clamp(i, 0, n), e = 0.6;
  const P = (q) => { const j = clamp(Math.floor(q), 0, n - 1); const p = entre(pts[j], pts[j + 1], clamp(q - j, 0, 1)); const o = proyecta(V, p.lam, p.sp, p.cp, p.my); return [o[0], o[1], o[2]]; };
  const c = P(a), p = P(a - e), q = P(a + e);
  return { x: c[0], y: c[1], vis: c[2], ang: Math.atan2(q[1] - p[1], q[0] - p[0]) };
}
// El camino más corto en kilómetros (para los rótulos).
export const km = (A, B) => 6371 * Math.acos(Math.max(-1, Math.min(1, A.sp * B.sp + A.cp * B.cp * Math.cos(A.lam - B.lam))));

// ---------------------------------------------------------------- la cuadrícula
const MERIDIANOS = [], PARALELOS = [];
for (let lo = -180; lo < 180; lo += 10) { const l = []; for (let la = -80; la <= 80; la += 2) l.push(punto(lo, la)); MERIDIANOS.push(l); }
for (let la = -80; la <= 80; la += 10) { const l = []; for (let lo = -180; lo <= 180; lo += 2) l.push(punto(lo, la)); PARALELOS.push(l); }
export function cuadricula(g, V, al = 0.14, ancho = 2) {
  g.save();
  g.strokeStyle = `rgba(210,235,255,${al})`; g.lineWidth = ancho;
  g.beginPath();
  for (const l of MERIDIANOS) trazaLinea(g, V, l);
  for (const l of PARALELOS) trazaLinea(g, V, l);
  g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- el aspecto
// Una textura repetida por toda la pantalla, con cada baldosa en espejo para que no se vean las juntas.
function mosaico(g, img, tam, ox, oy) {
  const x0 = Math.floor(-ox / tam) - 1, y0 = Math.floor(-oy / tam) - 1, x1 = Math.ceil((1080 - ox) / tam), y1 = Math.ceil((1920 - oy) / tam);
  for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) {
    const sx = i & 1 ? -1 : 1, sy = j & 1 ? -1 : 1;
    g.save(); g.translate(ox + (i + (i & 1)) * tam, oy + (j + (j & 1)) * tam); g.scale(sx, sy); g.drawImage(img, 0, 0, tam, tam); g.restore();
  }
}

const estrellasFondo = (() => { const az = k.azar(31), l = []; for (let i = 0; i < 260; i++) l.push([az() * 1080, az() * 1920, 0.4 + az() * 1.3, 0.25 + az() * 0.6]); return l; })();
// El borde de la hoja del mapa: un rectángulo enorme que, al hacerse bola, se encoge hasta el círculo.
function bordeHoja(V, N = 96) {
  const e = Math.pow(Math.max(0, (V.u - 0.35) / 0.65), 1.4);
  const pts = [];
  for (let i = 0; i < N; i++) {
    const th = (i / N) * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
    const rf = Math.min(2400 / (Math.abs(c) + 1e-6), 3200 / (Math.abs(s) + 1e-6));
    const r = rf + (V.R - rf) * Math.min(1, e);
    pts.push([V.cx + r * c, V.cy + r * s]);
  }
  return pts;
}

// El mar (con su luz) y el espacio alrededor, según u. Deja puesto como recorte la hoja/la bola si recorte = true.
export function fondoMar(g, V, t, { espacio = true } = {}) {
  const u = V.u;
  if (u > 0.002 && espacio) {
    const sg = g.createLinearGradient(0, 0, 0, 1920);
    sg.addColorStop(0, "#02051a"); sg.addColorStop(1, "#071540");
    g.fillStyle = sg; g.fillRect(0, 0, 1080, 1920);
    g.fillStyle = "#fff";
    for (const q of estrellasFondo) { g.globalAlpha = q[3] * Math.min(1, u * 1.6); g.beginPath(); g.arc(q[0], q[1], q[2], 0, 6.2832); g.fill(); }
    g.globalAlpha = 1;
    // el aire de la Tierra
    if (u > 0.5) {
      const a = (u - 0.5) * 2, ag = g.createRadialGradient(V.cx, V.cy, V.R * 0.96, V.cx, V.cy, V.R * 1.3);
      ag.addColorStop(0, `rgba(90,190,255,${0.75 * a})`); ag.addColorStop(0.35, `rgba(40,120,255,${0.28 * a})`); ag.addColorStop(1, "rgba(20,60,255,0)");
      g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = ag; g.fillRect(0, 0, 1080, 1920); g.restore();
    }
  }
  g.save();
  const b = bordeHoja(V);
  g.beginPath(); b.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.clip();
  // el mar: de azul profundo a azul claro, con su luz
  const mg = g.createLinearGradient(0, 0, 0, 1920);
  mg.addColorStop(0, "#0a2c6a"); mg.addColorStop(0.5, "#0f4c9e"); mg.addColorStop(1, "#0a3a86");
  g.fillStyle = mg; g.fillRect(-300, -300, 1700, 2600);
  const lg = g.createRadialGradient(V.cx - 90 * u, V.cy - 120, 40, V.cx, V.cy, 1000);
  lg.addColorStop(0, "rgba(90,200,255,0.45)"); lg.addColorStop(0.5, "rgba(40,130,230,0.16)"); lg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lg; g.fillRect(-300, -300, 1700, 2600);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.13;
  mosaico(g, k.causticas, 900, -((t * 16) % 1800), -((t * 5) % 1800));
  g.restore();
}

// Toda la tierra firme con su color, su textura y su costa; y encima el sombreado de la bola.
export function dibujaTierra(g, V, t, { color = ["#9cea6e", "#4cc06c", "#2a9a66"], alCuad = 0.14 } = {}) {
  const u = V.u;
  g.save();
  const b = bordeHoja(V);
  g.beginPath(); b.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.clip();
  cuadricula(g, V, alCuad, 2);
  trazaTierra(g, V);
  // el mar poco profundo alrededor de la costa
  g.save(); g.lineJoin = "round";
  g.strokeStyle = "rgba(120,235,255,0.22)"; g.lineWidth = 34; g.stroke();
  g.strokeStyle = "rgba(150,240,255,0.30)"; g.lineWidth = 16; g.stroke();
  g.restore();
  const lg = g.createLinearGradient(0, 200, 0, 1700);
  lg.addColorStop(0, color[0]); lg.addColorStop(0.55, color[1]); lg.addColorStop(1, color[2]);
  g.fillStyle = lg; g.fill();
  g.save(); g.clip();
  const ox = -((V.lam0 * 700) % 1000), oy = ((V.phi0 * 400) % 1000);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3;
  mosaico(g, k.manchas, 1000, ox, oy);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.16;
  mosaico(g, k.manchas, 620, ox * 1.3 + 100, oy * 1.3 + 60);
  g.restore();
  g.lineJoin = "round";
  g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 2.2; g.stroke();
  // el sombreado de la bola: luz arriba a la izquierda y el borde oscuro
  if (u > 0.01) {
    g.save();
    g.globalAlpha = Math.min(1, u * 1.4);
    const sh = g.createRadialGradient(V.cx - V.R * 0.34, V.cy - V.R * 0.4, V.R * 0.05, V.cx, V.cy, V.R * 1.02);
    sh.addColorStop(0, "rgba(255,255,255,0.28)"); sh.addColorStop(0.35, "rgba(255,255,255,0.04)"); sh.addColorStop(0.72, "rgba(0,12,50,0.25)"); sh.addColorStop(1, "rgba(0,6,34,0.8)");
    g.fillStyle = sh; g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- líneas con luz
// Una línea que brilla (se suma a lo de abajo): ancho en píxeles, color "r,g,b".
export function lineaLuz(g, V, pts, color, ancho, al = 1, desde = 0, hasta = pts.length - 1, nucleo = true) {
  if (al <= 0.003 || hasta <= desde) return;
  g.save();
  g.lineCap = "round"; g.lineJoin = "round";
  g.globalCompositeOperation = "lighter";
  g.beginPath(); trazaLinea(g, V, pts, desde, hasta);
  g.strokeStyle = `rgba(${color},${0.12 * al})`; g.lineWidth = ancho * 5; g.stroke();
  g.strokeStyle = `rgba(${color},${0.28 * al})`; g.lineWidth = ancho * 2.6; g.stroke();
  g.strokeStyle = `rgba(${color},${0.9 * al})`; g.lineWidth = ancho; g.stroke();
  if (nucleo) { g.strokeStyle = `rgba(255,255,255,${0.8 * al})`; g.lineWidth = ancho * 0.38; g.stroke(); }
  g.restore();
}
// Una línea de rayas (la «recta» del mapa).
export function lineaRayas(g, V, pts, color, ancho, al = 1, raya = 34, hueco = 26, desde = 0, hasta = pts.length - 1, desfase = 0) {
  if (al <= 0.003 || hasta <= desde) return;
  g.save();
  g.lineCap = "butt"; g.lineJoin = "round";
  g.setLineDash([raya, hueco]); g.lineDashOffset = -desfase;
  g.beginPath(); trazaLinea(g, V, pts, desde, hasta);
  g.strokeStyle = `rgba(0,10,40,${0.45 * al})`; g.lineWidth = ancho + 5; g.stroke();
  g.strokeStyle = `rgba(${color},${al})`; g.lineWidth = ancho; g.stroke();
  g.restore();
}

// Un sitio marcado: una chincheta roja con su sombra y su nombre en una pastilla.
export function marca(g, V, p, nombre, al = 1, { dx = 0, color = "255,214,90", dy = -66, tam = 50, rad = 17 } = {}) {
  if (al <= 0.003) return;
  const o = proyecta(V, p.lam, p.sp, p.cp, p.my);
  if (V.u > 0.0005 && !o[2]) return;
  const x = o[0], y = o[1], A = g.globalAlpha;
  g.save();
  g.globalAlpha = A * al;
  // la sombra y la chincheta
  g.fillStyle = "rgba(0,10,30,0.4)"; g.beginPath(); g.ellipse(x + rad * 0.5, y + rad * 0.55, rad * 1.1, rad * 0.55, 0, 0, 6.2832); g.fill();
  const pg = g.createRadialGradient(x - rad * 0.35, y - rad * 0.4, rad * 0.1, x, y, rad * 1.05);
  pg.addColorStop(0, "#ffd0c0"); pg.addColorStop(0.3, "#ff4a3a"); pg.addColorStop(1, "#8a0f1c");
  g.fillStyle = pg; g.beginPath(); g.arc(x, y, rad, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 2.4; g.stroke();
  g.font = `800 ${tam}px Figtree`;
  const w = g.measureText(nombre).width + 44, h = tam + 26;
  const bx = x - w / 2 + dx, by = y + dy - h / 2 - 20;
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 24; g.shadowOffsetY = 8;
  k.redondo(g, bx, by, w, h, 28); g.fillStyle = "rgba(4,10,26,0.8)"; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  k.redondo(g, bx + 1.5, by + 1.5, w - 3, h - 3, 26.5); g.strokeStyle = `rgba(${color},0.7)`; g.lineWidth = 3; g.stroke();
  g.fillStyle = "#fff"; g.textBaseline = "middle"; g.textAlign = "center";
  g.fillText(nombre, bx + w / 2, by + h / 2 + 2);
  g.restore();
}

// Un hilo de verdad: una línea gruesa con su sombra, su volumen y su brillo.
export function hilo(g, V, pts, ancho, al = 1, desde = 0, hasta = pts.length - 1, color = "255,244,214", vibra = 0, t = 0) {
  if (al <= 0.003 || hasta <= desde) return;
  g.save();
  g.lineCap = "round"; g.lineJoin = "round";
  g.globalAlpha = (g.globalAlpha ?? 1) * al;
  g.beginPath(); trazaLinea(g, V, pts, desde, hasta);
  g.translate(ancho * 0.5, ancho * 1.3);
  g.strokeStyle = "rgba(0,8,30,0.4)"; g.lineWidth = ancho * 1.3; g.stroke();
  g.translate(-ancho * 0.5, -ancho * 1.3);
  g.strokeStyle = `rgb(${color})`; g.lineWidth = ancho; g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = ancho * 0.35; g.translate(0, -ancho * 0.18); g.stroke();
  g.restore();
}
