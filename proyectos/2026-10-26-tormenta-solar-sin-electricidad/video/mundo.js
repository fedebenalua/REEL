// Lo que comparten los planos: la Tierra de noche con sus ciudades, la nube del Sol, las auroras, la llanura con su
// línea de postes y torres, el transformador. Si algo sale en más de un plano, es siempre la misma cosa.
import * as k from "#kit";

const { suave, tramo, azar } = k;

// ---------------------------------------------------------------- la Tierra de noche, con sus ciudades
// Una esfera de verdad: cada píxel sabe su latitud y longitud, así que la Tierra gira sin costuras y sus ciudades
// giran con ella. El mapa sale de un ruido que da la vuelta entera (lo de la izquierda se funde con lo de la derecha).
const MW = 512, MH = 256;
const MAPA = (() => {
  const n = k.ruido(1024, 41, 7, 5, "crudo"), m = new Float32Array(MW * MH);
  for (let j = 0; j < MH; j++) for (let i = 0; i < MW; i++) {
    const u = i / MW, a = n.crudo[(j * 3) * 1024 + i + MW] * (1 - u) + n.crudo[(j * 3) * 1024 + i] * u;
    m[j * MW + i] = a;
  }
  // el umbral, para que dos quintos sean tierra firme
  const orden = Array.from(m).sort((a, b) => a - b), umbral = orden[Math.floor(orden.length * 0.6)];
  for (let q = 0; q < m.length; q++) m[q] = m[q] - umbral;
  return m;
})();
const enMapa = (lon, lat) => {
  const i = Math.floor((((lon / (2 * Math.PI)) % 1 + 1) % 1) * MW) % MW, j = Math.max(0, Math.min(MH - 1, Math.floor((0.5 - lat / Math.PI) * MH)));
  return MAPA[j * MW + i];
};
export const CIUDADES = (() => {
  const az = azar(9001), l = [];
  let intentos = 0;
  while (l.length < 1400 && intentos < 400000) {
    intentos++;
    const lon = az() * 2 * Math.PI, lat = Math.asin(az() * 2 - 1);
    if (Math.abs(lat) > 1.15 || enMapa(lon, lat) < 0.01) continue;
    const n = 1 + Math.floor(Math.pow(az(), 2.5) * 9);
    for (let i = 0; i < n; i++) {
      const lo = lon + (az() - 0.5) * 0.06, la = lat + (az() - 0.5) * 0.05;
      if (enMapa(lo, la) < 0) continue;
      l.push({ lon: lo, lat: la, b: i === 0 ? 0.9 + az() * 0.3 : 0.4 + az() * 0.5, s: i === 0 ? 1.5 : 0.9 + az() * 0.3 });
    }
  }
  return l;
})();

// La esfera: un lienzo de 560 px que se pinta píxel a píxel y luego se pone del tamaño que toque.
const ER = 280, ES = ER * 2, esfera = k.lienzo(ES), ectx = esfera.getContext("2d"), eimg = ectx.createImageData(ES, ES);
const NORMALES = (() => {
  const l = [];
  for (let py = 0; py < ES; py++) for (let px = 0; px < ES; px++) {
    const nx = (px + 0.5 - ER) / ER, ny = (ER - py - 0.5) / ER, r2 = nx * nx + ny * ny;
    if (r2 < 1) l.push([px, py, nx, ny, Math.sqrt(1 - r2)]);
  }
  return l;
})();
const mezc = (a, b, u) => a + (b - a) * u;
// La dirección de un punto de la superficie (lon, lat) en la pantalla: [derecha, arriba, hacia la cámara].
function aPantalla(lon, lat, giro, inc) {
  const L = lon + giro, cx = Math.cos(lat) * Math.sin(L), cy = Math.sin(lat), cz = Math.cos(lat) * Math.cos(L);
  return [cx, cy * Math.cos(inc) - cz * Math.sin(inc), cy * Math.sin(inc) + cz * Math.cos(inc)];
}

// La Tierra de noche en (x, y), de radio rad (px). giro: lo que ha girado (radianes). inc: cuánto enseña el polo
// norte (radianes). sol: de dónde le llega la luz, en la pantalla ([derecha, arriba, hacia la cámara]); por defecto,
// desde abajo y por detrás (el Sol está abajo): casi toda la cara que se ve es de noche, con un borde de día abajo. apagada(c, X, Y) y rojo(c, X, Y): de 0 a 1 para cada ciudad, en su sitio de la
// pantalla. aurora: de 0 a 1, el óvalo verde del polo norte. luces: de 0 a 1, todas las ciudades.
export function tierraNoche(g, x, y, rad, giro, { inc = 0.25, sol = [0, -0.8, -0.5], apagada = null, rojo = null, aurora = 0, auroraT = 0, luces = 1, dia = 1 } = {}) {
  if (rad < 2) return;
  const sl = Math.hypot(sol[0], sol[1], sol[2]), sx = sol[0] / sl, sy = sol[1] / sl, sz = sol[2] / sl;
  const ci = Math.cos(inc), si = Math.sin(inc), d = eimg.data;
  for (const [px, py, nx, ny, nz] of NORMALES) {
    // de la pantalla a la Tierra: se deshace la inclinación y el giro
    const wy = ny * ci + nz * si, wz = -ny * si + nz * ci;
    const lat = Math.asin(Math.max(-1, Math.min(1, wy))), lon = Math.atan2(nx, wz) - giro;
    const h = enMapa(lon, lat), hielo = Math.abs(lat) > 1.2 ? 1 : 0;
    const luz = Math.max(0, Math.min(1, (nx * sx + ny * sy + nz * sz) * 2.2 + 0.25)) * dia;
    let r, gg, b;
    if (hielo) { r = mezc(18, 225, luz); gg = mezc(24, 232, luz); b = mezc(40, 245, luz); }
    else if (h > 0) { const s = Math.min(1, h * 6); r = mezc(14, mezc(70, 150, s), luz); gg = mezc(20, mezc(125, 120, s), luz); b = mezc(30, mezc(60, 80, s), luz); }
    else { const p = Math.min(1, -h * 4); r = mezc(6, mezc(30, 14, p), luz); gg = mezc(14, mezc(100, 60, p), luz); b = mezc(42, mezc(175, 140, p), luz); }
    // el borde, más oscuro
    const bo = 0.55 + 0.45 * Math.min(1, nz * 2.2);
    const q = (py * ES + px) * 4;
    d[q] = r * bo; d[q + 1] = gg * bo; d[q + 2] = b * bo; d[q + 3] = 255;
  }
  ectx.putImageData(eimg, 0, 0);
  g.save();
  // el aire: un borde azul alrededor
  const halo = g.createRadialGradient(x, y, rad * 0.96, x, y, rad * 1.12);
  halo.addColorStop(0, "rgba(90,160,255,0.55)"); halo.addColorStop(1, "rgba(90,160,255,0)");
  g.fillStyle = halo; g.beginPath(); g.arc(x, y, rad * 1.12, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.clip();
  g.drawImage(esfera, x - rad, y - rad, rad * 2, rad * 2);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; k.girado(g, k.manchas, x, y, rad * 2.6, giro * 0.3); g.restore();
  // las ciudades
  g.globalCompositeOperation = "lighter";
  const tam0 = Math.max(3, rad * 0.022), luzCiudad = k.halo("255,200,120"), luzRoja = k.halo("255,60,40");
  for (const c of CIUDADES) {
    const p = aPantalla(c.lon, c.lat, giro, inc);
    if (p[2] < 0.08) continue;
    const X = x + p[0] * rad, Y = y - p[1] * rad;
    const noche = 1 - Math.max(0, Math.min(1, (p[0] * sx + p[1] * sy + p[2] * sz) * 3 + 0.6)) * dia;
    const borde = Math.min(1, (p[2] - 0.08) * 4);
    const al = luces * noche * borde * c.b;
    const ap = apagada ? apagada(c, X, Y) : 0, rj = rojo ? rojo(c, X, Y) : 0;
    const tam = tam0 * c.s * (0.5 + 0.5 * p[2]);
    if (al * (1 - ap) > 0.02) { g.globalAlpha = Math.min(1, al * (1 - ap)); g.drawImage(luzCiudad, X - tam, Y - tam, tam * 2, tam * 2); }
    if (rj > 0.02) { g.globalAlpha = Math.min(1, rj * borde * 0.8); g.drawImage(luzRoja, X - tam * 2.4, Y - tam * 2.4, tam * 4.8, tam * 4.8); }
  }
  g.restore();
  if (aurora > 0.01) auroraOvalo(g, x, y, rad, giro, inc, aurora, auroraT);
}

// El óvalo de la aurora alrededor del polo norte: cortinas verdes con la punta roja que salen de la superficie hacia
// arriba y ondulan. Las de detrás de la Tierra no se ven.
export function auroraOvalo(g, x, y, rad, giro, inc, al, t) {
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  const N = Math.max(140, Math.round(rad * 0.45));
  for (let i = 0; i < N; i++) {
    const lon = (i / N) * 2 * Math.PI, lat = 1.16 + 0.04 * Math.sin(lon * 5 + t * 1.8) + 0.025 * Math.sin(lon * 11 - t * 2.6);
    const p = aPantalla(lon - giro, lat, giro, inc);
    const alto = 0.07 + 0.035 * Math.sin(lon * 7 + t * 3.2);
    const X0 = x + p[0] * rad, Y0 = y - p[1] * rad, X1 = x + p[0] * rad * (1 + alto), Y1 = y - p[1] * rad * (1 + alto);
    const visible = p[2] > 0 || p[0] * p[0] + p[1] * p[1] > 0.97;
    if (!visible) continue;
    const gr = g.createLinearGradient(X0, Y0, X1, Y1);
    gr.addColorStop(0, `rgba(110,255,150,${0.75 * al})`); gr.addColorStop(0.55, `rgba(80,255,170,${0.3 * al})`); gr.addColorStop(1, `rgba(255,70,150,${0.12 * al})`);
    g.strokeStyle = gr; g.lineWidth = Math.max(2, Math.min(rad * 0.035, 16));
    g.beginPath(); g.moveTo(X0, Y0); g.lineTo(X1, Y1); g.stroke();
  }
  const pol = aPantalla(0, Math.PI / 2, giro, inc);
  k.brillo(g, x + pol[0] * rad, y - pol[1] * rad, rad * 1.5, "90,255,150", 0.3 * al);
  g.restore();
}

// ---------------------------------------------------------------- el Sol de cerca
// El Sol enorme, de centro (x, y) y radio rad (px): fuego con su granulación fina (a tamaño fijo, no estirada), el
// borde más oscuro y rojo, la corona alrededor y unas protuberancias en el borde. b: lo que brilla de más.
const granos = k.tenir(k.ruido(1024, 61, 46, 3, "lineas"), "#ff9a2a");
const calientes = k.tenir(k.ruido(512, 67, 12, 4, "manchas"), "#fff0a0");
const azP = azar(55);
const PROTUBERANCIAS = Array.from({ length: 9 }, () => ({ a: azP() * 2 - 1, h: 0.02 + azP() * 0.05, w: 0.02 + azP() * 0.04, f: azP() * 6 }));
export function solDeCerca(g, x, y, rad, t, b = 0) {
  g.save();
  // la corona
  g.globalCompositeOperation = "lighter";
  const cg = g.createRadialGradient(x, y, rad * 0.97, x, y, rad * 1.45);
  cg.addColorStop(0, `rgba(255,170,60,${0.75 + 0.2 * b})`); cg.addColorStop(0.12, "rgba(255,120,30,0.35)"); cg.addColorStop(1, "rgba(255,90,20,0)");
  g.fillStyle = cg; g.beginPath(); g.arc(x, y, rad * 1.45, 0, Math.PI * 2); g.fill();
  // las protuberancias: arcos de fuego que salen del borde
  g.lineCap = "round";
  for (const p of PROTUBERANCIAS) {
    const a = -Math.PI / 2 + p.a * 0.55, a0 = a - p.w, a1 = a + p.w, h = rad * p.h * (1 + 0.15 * Math.sin(t * 2 + p.f));
    const x0 = x + Math.cos(a0) * rad, y0 = y + Math.sin(a0) * rad, x1 = x + Math.cos(a1) * rad, y1 = y + Math.sin(a1) * rad;
    const xc = x + Math.cos(a) * (rad + h * 2), yc = y + Math.sin(a) * (rad + h * 2);
    g.strokeStyle = "rgba(255,120,50,0.5)"; g.lineWidth = rad * 0.012;
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(xc, yc, x1, y1); g.stroke();
    g.strokeStyle = "rgba(255,180,90,0.18)"; g.lineWidth = rad * 0.03; g.stroke();
  }
  g.globalCompositeOperation = "source-over";
  // el disco
  g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.clip();
  const dg = g.createRadialGradient(x, y - rad * 0.2, 0, x, y, rad);
  dg.addColorStop(0, "#fff6c8"); dg.addColorStop(0.6, "#ffd060"); dg.addColorStop(0.9, "#ff9a22"); dg.addColorStop(1, "#e05a0c");
  g.fillStyle = dg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  // la granulación, pegada al Sol (una sola pieza, sin costuras), que hierve despacio
  const lado = Math.min(rad * 2, 1500), gx = x - lado / 2 + Math.sin(t * 0.7) * 10, gy = y - rad - 20;
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5;
  g.drawImage(granos, gx, gy, lado, lado);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.3 + 0.05 * Math.sin(t * 3);
  g.drawImage(calientes, gx - 40 + t * 6, gy - 30, lado + 80, lado + 80);
  // el borde, más oscuro
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  const lg = g.createRadialGradient(x, y, rad * 0.8, x, y, rad);
  lg.addColorStop(0, "rgba(120,30,0,0)"); lg.addColorStop(1, "rgba(120,30,0,0.45)");
  g.fillStyle = lg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  if (b > 0.01) { g.fillStyle = `rgba(255,240,200,${0.25 * b})`; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  g.restore();
}

// Una llamarada que revienta en (x, y): un fogonazo, un arco de fuego que se abre y chorros que salen. u: segundos
// desde que empieza. tam: su tamaño (px).
export function llamarada(g, x, y, u, tam) {
  if (u < -0.05 || u > 2.5) return;
  const e = Math.exp(-Math.max(0, u) * 1.6);
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, x, y, tam * (1.2 + 0.6 * (1 - e)), "255,220,150", 0.9 * e + 0.15);
  k.brillo(g, x, y, tam * 0.45, "255,255,245", e);
  // arcos de fuego retorcidos que se abren hacia arriba y se rompen
  const abre = suave(tramo(u, 0, 1.1)), apaga = 1 - suave(tramo(u, 0.6, 1.6));
  g.lineCap = "round";
  for (let i = 0; i < 5; i++) {
    const s = 0.12 + i * 0.05, h = tam * (0.2 + (0.7 + i * 0.12) * abre), tor = (i % 2 ? 1 : -1) * tam * 0.06;
    for (const [w, al] of [[tam * 0.009, 0.55], [tam * 0.035, 0.16]]) {
      g.strokeStyle = `rgba(255,${90 + 40 * e + i * 10},${40 + 20 * e},${al * apaga})`; g.lineWidth = w;
      g.beginPath(); g.moveTo(x - tam * s, y + 4); g.bezierCurveTo(x - tam * s * 1.6 + tor, y - h, x + tam * s * 1.4 + tor, y - h * 0.9, x + tam * s * 0.9, y + 4); g.stroke();
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- la nube del Sol
// Una nube de fuego que sale de (x, y) hacia arriba: un frente curvo de radio R (px), con su neblina detrás, sus
// hilos y sus chispas. al: de 0 a 1. abre: lo abierta que va (radianes a cada lado de arriba).
const azN = azar(321);
const CHISPAS = Array.from({ length: 420 }, () => ({ a: azN() * 2 - 1, d: Math.pow(azN(), 0.5), s: 0.5 + azN() * 1.6, f: azN() * 6.28, c: azN() }));
const HILOS = Array.from({ length: 26 }, () => ({ a: azN() * 2 - 1, l: 0.25 + azN() * 0.5, f: azN() * 6.28 }));
export function nube(g, x, y, R, al, t, abre = 0.95, dir = -Math.PI / 2) {
  if (al <= 0.01 || R < 2) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  // la neblina detrás del frente: brillos suaves a lo largo del arco (sin bordes)
  for (let i = 0; i <= 12; i++) {
    const a = dir + (i / 12 * 2 - 1) * abre * 0.95, lado = 1 - Math.pow(Math.abs(i / 6 - 1), 2) * 0.6;
    k.brillo(g, x + Math.cos(a) * R * 0.86, y + Math.sin(a) * R * 0.86, R * 0.7, "255,130,50", 0.22 * al * lado);
  }
  // los hilos de plasma, del centro al frente
  g.lineCap = "round";
  const hilosAl = al * (1 - tramo(R, 900, 1600));
  if (hilosAl > 0.01) for (const h of HILOS) {
    const a = dir + h.a * abre, ond = Math.sin(t * 3 + h.f) * 0.04;
    const l = h.l * 0.45, x0 = x + Math.cos(a) * R * (1 - l), y0 = y + Math.sin(a) * R * (1 - l), x1 = x + Math.cos(a + ond) * R * 0.98, y1 = y + Math.sin(a + ond) * R * 0.98;
    const hg = g.createLinearGradient(x0, y0, x1, y1);
    hg.addColorStop(0, "rgba(255,140,60,0)"); hg.addColorStop(1, `rgba(255,190,110,${0.4 * hilosAl})`);
    g.strokeStyle = hg; g.lineWidth = Math.max(2, R * 0.012);
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x + Math.cos(a - ond * 2) * R * (1 - l * 0.5), y + Math.sin(a - ond * 2) * R * (1 - l * 0.5), x1, y1); g.stroke();
  }
  // el frente, hecho de chispas: blanco amarillo en el borde, naranja detrás
  const tam = Math.max(8, Math.min(46, R * 0.03));
  for (const c of CHISPAS) {
    const a = dir + c.a * abre * (1 + 0.03 * Math.sin(t * 2 + c.f)), d = R * (1 - 0.14 * c.d * c.d) * (1 + 0.02 * Math.sin(t * 5 + c.f));
    const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
    if (px < -100 || px > 1180 || py < -100 || py > 2020) continue;
    const lado = 1 - Math.pow(Math.abs(c.a), 3);
    g.globalAlpha = Math.min(1, al * lado * (0.25 + 0.45 * (1 - c.d)));
    g.drawImage(k.halo(c.c < 0.35 ? "255,236,190" : c.c < 0.8 ? "255,160,70" : "255,110,50"), px - tam * c.s, py - tam * c.s, tam * 2 * c.s, tam * 2 * c.s);
  }
  g.restore();
}

// ---------------------------------------------------------------- el campo magnético
// Las líneas del campo de la Tierra (un dipolo) alrededor de (x, y), de radio rad. aplasta: de 0 a 1, la nube las
// empuja desde abajo (el lado del Sol); sacude: lo que tiemblan.
export function campo(g, x, y, rad, al, aplasta, sacude, t, L = [1.6, 2.1, 2.8, 3.7, 4.9]) {
  if (al <= 0.01) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  for (let i = 0; i < L.length; i++) for (const lado of [-1, 1]) {
    g.beginPath();
    let pluma = false;
    for (let s = 0; s <= 80; s++) {
      // r = L·cos²(lat): de un polo al otro por el lado (solo lo que queda fuera de la Tierra)
      const lat = -Math.PI / 2 + (s / 80) * Math.PI, r = L[i] * Math.cos(lat) * Math.cos(lat);
      if (r < 1) { pluma = false; continue; }
      let px = lado * r * Math.cos(lat), py = -r * Math.sin(lat);
      // lado del Sol (abajo, py > 0): se aplasta; el otro se estira
      const k2 = py > 0 ? 1 - 0.4 * aplasta * (1 - Math.exp(-py * 0.8)) : 1 + 0.35 * aplasta * (1 - Math.exp(py * 0.6));
      px *= 1 - 0.1 * aplasta * Math.max(0, Math.tanh(py)); py *= k2;
      const tiembla = sacude * 0.09 * Math.sin(t * 22 + i * 1.7 + s * 0.35) * Math.min(1, r / 2);
      const X = x + (px + tiembla) * rad, Y = y + py * rad;
      if (!pluma) { g.moveTo(X, Y); pluma = true; } else g.lineTo(X, Y);
    }
    g.strokeStyle = `rgba(120,210,255,${al * (0.6 - i * 0.08)})`; g.lineWidth = 4 + sacude * 3; g.stroke();
    g.strokeStyle = `rgba(120,210,255,${al * 0.12})`; g.lineWidth = 18; g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- el cielo del espacio para los planos de la Tierra
export const CIELO = k.cielo(77, 1600, [0, 40, -200], 700, 0);

// ---------------------------------------------------------------- las auroras desde el suelo
// Cortinas de rayos de luz que bajan del cielo y ondulan. Cada rayo es una columna con su degradado (verde abajo,
// rojo arriba, o todo rojo y rosa como se vieron desde España). Se dibujan en la pantalla: el cielo está muy lejos.
function columna(abajo, medio, arriba) {
  const l = k.lienzo(4, 512), c = l.getContext("2d"), gr = c.createLinearGradient(0, 512, 0, 0);
  gr.addColorStop(0, `rgba(${abajo},0)`); gr.addColorStop(0.04, `rgba(${abajo},1)`); gr.addColorStop(0.25, `rgba(${medio},0.55)`);
  gr.addColorStop(0.6, `rgba(${arriba},0.28)`); gr.addColorStop(1, `rgba(${arriba},0)`);
  c.fillStyle = gr; c.fillRect(0, 0, 4, 512);
  return l;
}
export const AURORA_VERDE = columna("150,255,170", "70,255,140", "255,70,120");
export const AURORA_ROJA = columna("255,120,150", "255,60,110", "190,70,255");
const ondas = k.ruido(256, 91, 6, 3, "crudo");
const onda = (x, y) => ondas.crudo[(Math.floor(y) & 255) * 256 + (Math.floor(x) & 255)];
// al: de 0 a 1. base: la y de la pantalla donde acaban los rayos más bajos. desliza: lo que se ha girado la cámara (px).
export function auroras(g, t, al, base, columnaDe = AURORA_VERDE, desliza = 0) {
  if (al <= 0.01) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  const CORTINAS = [
    { y: base - 40, alto: 620, amp: 90, f: 0.004, v: 0.35, ph: 0, b: 0.75 },
    { y: base - 220, alto: 520, amp: 120, f: 0.003, v: -0.25, ph: 2, b: 0.5 },
    { y: base - 420, alto: 460, amp: 70, f: 0.006, v: 0.2, ph: 4, b: 0.35 },
  ];
  for (const [q, c] of CORTINAS.entries()) {
    for (let x = -10; x < 1090; x += 5) {
      const X = x + desliza * (0.4 + q * 0.15);
      const yb = c.y - c.amp * Math.sin(X * c.f + t * c.v + c.ph) - 40 * (onda(X * 0.05 + q * 40, t * 6) - 0.5);
      const h = c.alto * (0.55 + 0.7 * onda(X * 0.12 + q * 90, t * 10 + q * 30));
      const b = c.b * al * Math.pow(onda(X * 0.3 + q * 17, t * 14 + 50), 1.6) * 2.2;
      if (b < 0.02) continue;
      g.globalAlpha = Math.min(1, b * 0.6);
      g.drawImage(columnaDe, x - 3, yb - h, 12, h);
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- la llanura de noche
// El cielo (con sus estrellas), las colinas del horizonte y el suelo. La cámara mira a lo lejos, un poco hacia arriba:
// el horizonte queda en y = HORIZONTE, con mucho cielo para las auroras.
export const HORIZONTE = 1250;
const azE = azar(808);
const ESTRELLAS_SUELO = Array.from({ length: 700 }, () => ({ x: azE() * 1200 - 60, y: azE() * (HORIZONTE - 60), s: azE() < 0.08 ? 3 : 1.6, b: 0.25 + azE() * 0.6 }));
const COLINAS = [0, 1].map((q) => { const az = azar(70 + q), p = []; for (let x = -100; x <= 1200; x += 40) p.push([x, 10 + q * 25 + az() * 26 + 22 * Math.sin(x * 0.006 + q * 3)]); return p; });
export function cielo(g, t, verdor = 0, desliza = 0, color = "90,255,150", hz = HORIZONTE) {
  const HZ = hz;
  const cg = g.createLinearGradient(0, 0, 0, Math.max(10, HZ));
  cg.addColorStop(0, "#02040c"); cg.addColorStop(0.65, "#071028"); cg.addColorStop(1, "#13203c");
  g.fillStyle = cg; g.fillRect(0, 0, 1080, Math.max(0, HZ + 4));
  g.save(); g.globalCompositeOperation = "lighter";
  for (const s of ESTRELLAS_SUELO) { const x = (((s.x + desliza * 0.3) % 1200) + 1200) % 1200 - 60, y = s.y + (HZ - HORIZONTE); if (y > HZ - 30) continue; g.fillStyle = `rgba(230,236,255,${s.b * (1 - 0.5 * verdor)})`; g.fillRect(x, y, s.s, s.s); }
  // el resplandor de las auroras sobre el horizonte
  if (verdor > 0.01) {
    const rg = g.createLinearGradient(0, HZ - 700, 0, HZ);
    rg.addColorStop(0, `rgba(${color},0)`); rg.addColorStop(1, `rgba(${color},${0.22 * verdor})`);
    g.fillStyle = rg; g.fillRect(0, HZ - 700, 1080, 704);
  }
  g.restore();
}
export function suelo(g, t, verdor = 0, desliza = 0, color = "90,255,150", hz = HORIZONTE) {
  const HZ = hz;
  // las colinas lejanas
  COLINAS.forEach((p, q) => {
    g.beginPath(); g.moveTo(-100, HZ + 5);
    for (const [x, h] of p) g.lineTo(x + desliza * (0.15 + q * 0.1) % 40, HZ - h);
    g.lineTo(1200, HZ + 5); g.closePath();
    g.fillStyle = q ? "#070b14" : "#0b1220"; g.fill();
  });
  const sg = g.createLinearGradient(0, HZ, 0, 1920);
  sg.addColorStop(0, "#111a26"); sg.addColorStop(0.3, "#0a0f17"); sg.addColorStop(1, "#05070b");
  g.fillStyle = sg; g.fillRect(0, HZ, 1080, 1920 - HZ);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.drawImage(k.manchas, -200 - (desliza % 200), HZ, 1500, Math.max(700, 1920 - HZ)); g.restore();
  if (verdor > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    const rg = g.createLinearGradient(0, HZ, 0, HZ + 400);
    rg.addColorStop(0, `rgba(${color},${0.14 * verdor})`); rg.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = rg; g.fillRect(0, HZ, 1080, 400);
    g.restore();
  }
}
// Dónde queda el horizonte en la pantalla, para una cámara cualquiera.
export function horizonteDe(cam) {
  const f = cam.e.f, l = Math.hypot(f[0], f[2]) || 1, p = k.proyecta(cam, [cam.p[0] + (f[0] / l) * 1e5, cam.p[1], cam.p[2] + (f[2] / l) * 1e5]);
  return p ? p.y : HORIZONTE;
}
// La cámara de la llanura: en (x, 1,7, z), mirando a lo lejos hacia -z y un poco hacia arriba.
export const camLlanura = (x, z, alto = 1.7, gira = 0) => k.mira([x, alto, z], [x + Math.sin(gira) * 40, alto + (40 * (HORIZONTE - 960)) / k.F, z - Math.cos(gira) * 40]);

// ---------------------------------------------------------------- la línea: postes de telégrafo y torres
// Los postes van en x = LX, cada SEP, desde z = Z0 hacia lo lejos. Cada uno puede ser poste (1859) o torre (hoy):
// torre(i) de 0 a 1 es cuánto ha crecido la torre en su sitio.
export const LX = 3.2, SEP = 26, Z0 = -6, NPOSTES = 12;
export const zPoste = (i) => Z0 - i * SEP;
const mezV = k.mezV;
// las puntas de donde cuelgan los cables, en el mundo
export function enganches(i, torre) {
  const z = zPoste(i);
  const poste = [[LX - 0.7, 7.1, z], [LX + 0.7, 7.1, z]];
  const alta = [[LX - 3.4, 15.5, z], [LX + 3.4, 15.5, z]];
  return poste.map((p, q) => mezV(p, alta[q], torre));
}
// un cable entre dos puntos, colgando (catenaria aproximada), proyectado; devuelve los puntos en pantalla
export function cable(cam, A, B, cuelga) {
  const pts = [];
  for (let s = 0; s <= 12; s++) {
    const u = s / 12, P = [k.mez(A[0], B[0], u), k.mez(A[1], B[1], u) - cuelga * 4 * u * (1 - u), k.mez(A[2], B[2], u)];
    pts.push(k.proyecta(cam, P));
  }
  return pts.some((p) => p) ? pts : null;
}
export function trazo(g, pts, color, ancho) {
  g.strokeStyle = color; g.lineWidth = ancho; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  let pluma = false;
  for (const p of pts) { if (!p) { pluma = false; continue; } if (pluma) g.lineTo(p.x, p.y); else { g.moveTo(p.x, p.y); pluma = true; } }
  g.stroke();
}
// un poste de telégrafo de madera, con su cruceta y sus aisladores de cristal; al: transparencia; luz: el color que le
// llega del cielo
export function poste(g, cam, i, al, luz = "90,255,150") {
  if (al <= 0.01) return;
  const z = zPoste(i), pie = k.proyecta(cam, [LX, 0, z]), cab = k.proyecta(cam, [LX, 7.6, z]);
  if (!pie || !cab) return;
  const s = k.F / pie.z, w = Math.max(2, 0.28 * s);
  g.save(); g.globalAlpha *= al;
  const mg = g.createLinearGradient(pie.x - w, 0, pie.x + w, 0);
  mg.addColorStop(0, "#1a120c"); mg.addColorStop(0.6, "#3a2a1c"); mg.addColorStop(1, `rgb(${luz})`);
  g.fillStyle = mg;
  g.beginPath(); g.moveTo(pie.x - w / 2, pie.y); g.lineTo(cab.x - w * 0.38, cab.y); g.lineTo(cab.x + w * 0.38, cab.y); g.lineTo(pie.x + w / 2, pie.y); g.closePath(); g.fill();
  g.fillStyle = "rgba(10,7,4,0.55)"; g.fill();
  // la cruceta
  const c0 = k.proyecta(cam, [LX - 1.0, 7.0, z]), c1 = k.proyecta(cam, [LX + 1.0, 7.0, z]);
  g.strokeStyle = "#2a1d12"; g.lineWidth = Math.max(2, 0.2 * s); g.beginPath(); g.moveTo(c0.x, c0.y); g.lineTo(c1.x, c1.y); g.stroke();
  // los aisladores
  for (const p of enganches(i, 0)) { const q = k.proyecta(cam, p); g.fillStyle = "rgba(150,220,200,0.9)"; g.beginPath(); g.arc(q.x, q.y, Math.max(1.5, 0.12 * s), 0, Math.PI * 2); g.fill(); }
  g.restore();
}
// una torre de alta tensión de celosía de acero; crece del suelo (crece de 0 a 1)
export function torreAlta(g, cam, i, crece, luz = "90,255,150") {
  if (crece <= 0.01) return;
  const z = zPoste(i), H = 18 * crece;
  const P = (x, y, dz = 0) => k.proyecta(cam, [LX + x, y * crece, z + dz]);
  const pie = P(0, 0); if (!pie) return;
  const s = k.F / pie.z, w = Math.max(1.2, 0.07 * s);
  g.save();
  g.strokeStyle = "#8e9aa8"; g.lineWidth = w; g.lineCap = "round";
  const L = (a, b) => { if (!a || !b) return; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); };
  // las patas, que se estrechan hacia arriba
  const ancho = (y) => 2.2 * (1 - y / 22) + 0.35;
  const niveles = [0, 3, 6, 9, 11.5, 14, 15.5, 18];
  for (const sx of [-1, 1]) {
    for (let q = 0; q < niveles.length - 1; q++) {
      const y0 = niveles[q], y1 = niveles[q + 1];
      L(P(sx * ancho(y0), y0), P(sx * ancho(y1), y1));
      // las cruces
      L(P(sx * ancho(y0), y0), P(-sx * ancho(y1), y1));
    }
  }
  for (const y of niveles) L(P(-ancho(y), y), P(ancho(y), y));
  // los brazos
  for (const sx of [-1, 1]) { L(P(sx * ancho(15.5), 15.5), P(sx * 3.6, 15.5)); L(P(sx * ancho(18), 17.6), P(sx * 3.6, 15.5)); }
  // el borde de luz del cielo
  g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${luz},0.25)`; g.lineWidth = w * 0.6;
  for (const sx of [-1, 1]) L(P(sx * ancho(0), 0), P(sx * ancho(18), 18));
  // los aisladores colgando
  g.globalCompositeOperation = "source-over";
  for (const sx of [-1, 1]) { const a = P(sx * 3.4, 15.5), b = P(sx * 3.4, 14.6); if (a && b) { g.strokeStyle = "#c7d2de"; g.lineWidth = Math.max(2, 0.18 * s); L(a, b); } }
  g.restore();
}

// ---------------------------------------------------------------- el transformador
// Un transformador de subestación: una caja de acero con sus radiadores de aletas a los lados y tres aisladores
// encima. (x, y): el centro de su base en la pantalla; s: px por metro. calor de 0 a 1: se pone al rojo.
export function transformador(g, x, y, s, calor, t, frio = 0) {
  g.save();
  g.translate(x, y);
  const W = 5 * s, H = 4.2 * s;
  // la sombra en el suelo
  g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.ellipse(0, 0, W * 0.75, s * 0.5, 0, 0, Math.PI * 2); g.fill();
  // los radiadores: aletas verticales a cada lado
  for (const sx of [-1, 1]) {
    for (let a = 0; a < 7; a++) {
      const ax = sx * (W / 2 + s * 0.15 + a * s * 0.22);
      const rg = g.createLinearGradient(ax - s * 0.08, 0, ax + s * 0.08, 0);
      rg.addColorStop(0, "#3c4652"); rg.addColorStop(0.5, k.mezColor("#8a96a4", "#ff6a2a", calor)); rg.addColorStop(1, "#2a323c");
      g.fillStyle = rg; g.fillRect(ax - s * 0.08, -H * 0.85, s * 0.16, H * 0.72);
    }
    g.fillStyle = "#4a5562"; g.fillRect(sx > 0 ? W / 2 : -W / 2 - s * 1.7, -H * 0.9, s * 1.7, s * 0.14);
  }
  // el cuerpo
  const bg = g.createLinearGradient(-W / 2, 0, W / 2, 0);
  bg.addColorStop(0, "#39434e"); bg.addColorStop(0.35, "#7d8a98"); bg.addColorStop(0.6, "#5c6876"); bg.addColorStop(1, "#2b333c");
  g.fillStyle = bg; k.redondo(g, -W / 2, -H, W, H, s * 0.2); g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45; g.drawImage(k.manchas, -W / 2, -H, W, H); g.restore();
  // costillas del cuerpo
  g.strokeStyle = "rgba(20,26,32,0.6)"; g.lineWidth = Math.max(1, s * 0.06);
  for (let q = 1; q < 5; q++) { g.beginPath(); g.moveTo(-W / 2 + (q * W) / 5, -H + s * 0.3); g.lineTo(-W / 2 + (q * W) / 5, -s * 0.2); g.stroke(); }
  // la tapa
  g.fillStyle = "#56616d"; k.redondo(g, -W / 2 - s * 0.15, -H - s * 0.3, W + s * 0.3, s * 0.4, s * 0.1); g.fill();
  // los aisladores de porcelana, con sus anillos
  for (const bx of [-1, 0, 1]) {
    const cx = bx * W * 0.3, h = s * 2.2;
    for (let r = 0; r < 7; r++) {
      const yy = -H - s * 0.3 - (r + 0.5) * (h / 7);
      const ig = g.createLinearGradient(cx - s * 0.3, 0, cx + s * 0.3, 0);
      ig.addColorStop(0, "#5a3a2a"); ig.addColorStop(0.45, "#c8876a"); ig.addColorStop(1, "#4a2a1c");
      g.fillStyle = ig; g.beginPath(); g.ellipse(cx, yy, s * 0.32, s * 0.1, 0, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = "#c9d1da"; g.fillRect(cx - s * 0.05, -H - s * 0.3 - h - s * 0.35, s * 0.1, s * 0.4);
  }
  // el calor: se pone al rojo desde dentro y brilla
  if (calor > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    const cg = g.createLinearGradient(0, -H, 0, 0);
    cg.addColorStop(0, `rgba(255,90,30,${0.25 * calor})`); cg.addColorStop(1, `rgba(255,140,40,${0.6 * calor})`);
    g.fillStyle = cg; k.redondo(g, -W / 2, -H, W, H, s * 0.2); g.fill();
    k.brillo(g, 0, -H * 0.5, W * 2.6 * (0.8 + 0.2 * Math.sin(t * 9)), "255,90,30", 0.75 * calor);
    // el aire que tiembla encima
    for (let q = 0; q < 5; q++) {
      const yy = -H - s * 0.5 - ((t * 120 + q * 70) % (s * 4));
      g.strokeStyle = `rgba(255,150,80,${0.2 * calor * (1 - (-H - s * 0.5 - yy) / (s * 4))})`; g.lineWidth = s * 0.08;
      g.beginPath(); for (let xx = -W / 2; xx <= W / 2; xx += s * 0.25) { const yv = yy + Math.sin(xx * 0.05 + t * 8 + q) * s * 0.12; xx === -W / 2 ? g.moveTo(xx, yv) : g.lineTo(xx, yv); } g.stroke();
    }
    g.restore();
  }
  if (frio > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, -H * 0.5, W * 2.2, "120,200,255", 0.3 * frio); g.restore(); }
  g.restore();
}
