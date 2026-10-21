// Lo que comparten los planos: el plátano (con sus caras, sus motas y su modo rayos X), los átomos de potasio y sus
// destellos, el fondo cálido de la cocina y el velo de los subtítulos.
import * as k from "#kit";

const { azar, mez, lienzo } = k;

// ---------------------------------------------------------------- el fondo
// Una cocina a oscuras: degradado cálido, luces desenfocadas y un poco de textura.
const azF = azar(77);
const BOKEH = Array.from({ length: 22 }, () => ({ x: azF() * 1080, y: azF() * 1920, r: 50 + azF() * 140, c: ["255,190,90", "255,140,60", "255,220,150", "120,200,255"][Math.floor(azF() * 4)], f: azF() * 6 }));
export function fondo(g, t, tinte = "255,170,70", al = 1, dx = 0, dy = 0) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#0b0704"; g.fillRect(0, 0, 1080, 1920);
  const bg = g.createRadialGradient(540, 1000, 80, 540, 1000, 1300);
  bg.addColorStop(0, `rgba(${tinte},${0.3 * al})`); bg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) {
    const x = (((b.x + dx) % 1300) + 1300) % 1300 - 110, y = (((b.y + dy) % 2100) + 2100) % 2100 - 90;
    const a = al * (0.09 + 0.05 * Math.sin(t * 1.3 + b.f)), gr = g.createRadialGradient(x, y, 0, x, y, b.r);
    gr.addColorStop(0, `rgba(${b.c},${a})`); gr.addColorStop(0.75, `rgba(${b.c},${a * 0.7})`); gr.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, b.r, 0, 6.2832); g.fill();
  }
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.07; g.drawImage(k.manchas, -200, -200, 1500, 2400);
  g.restore();
}
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.6) {
  if (al <= 0.01) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(6,4,3,${al})`); vg.addColorStop(0.6, `rgba(6,4,3,${al * 0.7})`); vg.addColorStop(1, "rgba(6,4,3,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.55) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const vg = g.createRadialGradient(540, 960, 500, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// ---------------------------------------------------------------- el plátano
// En coordenadas locales: su lomo es un arco que sonríe, de x = -L/2 (el tallo) a x = +L/2 (la punta), y su grosor
// máximo es W (de lado a lado). Se dibuja con cinco caras que giran alrededor de su eje (giro), cada una con su luz.
const N = 48;
function lomo(L, curva) {
  const R = L / (2 * Math.sin(curva / 2)), c = Math.cos(curva / 2), pts = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N, a = -curva / 2 + curva * s;
    pts.push({ s, x: R * Math.sin(a), y: R * Math.cos(a) - R * c - (R - R * c) * 0.5, nx: Math.sin(a), ny: Math.cos(a) });
  }
  return pts;
}
const ancho = (s) => Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, (s - 0.01) / 0.98))), 0.32) * (1.04 - 0.14 * s);

// Las motas de azúcar, una vez: posición a lo largo (s) y alrededor (ang).
const azM = azar(5150);
const MOTAS = Array.from({ length: 55 }, () => ({ s: 0.1 + azM() * 0.8, ang: azM() * 6.2832, r: 0.003 + azM() * 0.006 }));

// platano(g, x, y, L, ang, { giro, curva, W, rayos, al })
//   giro: cuánto ha girado sobre su eje (radianes) · rayos: de 0 (piel) a 1 (transparente, como en una radiografía).
export function platano(g, x, y, L, ang, o = {}) {
  const giro = o.giro || 0, curva = o.curva ?? 1.15, W = (o.W ?? 0.23) * L, rx = o.rayos || 0;
  const P = lomo(L, curva);
  const pt = (p, f) => [p.x + p.nx * ancho(p.s) * W * 0.5 * f, p.y + p.ny * ancho(p.s) * W * 0.5 * f];
  g.save(); g.translate(x, y); g.rotate(ang);
  // la sombra que deja
  g.save(); g.globalAlpha *= 0.35 * (1 - rx);
  const sg = g.createRadialGradient(0, W * 0.9, 0, 0, W * 0.9, L * 0.55); sg.addColorStop(0, "rgba(0,0,0,0.8)"); sg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = sg; g.fillRect(-L * 0.6, -L * 0.3, L * 1.2, L * 0.8); g.restore();
  // el contorno
  const contorno = () => { g.beginPath(); P.forEach((p, i) => { const [a, b] = pt(p, -1); i ? g.lineTo(a, b) : g.moveTo(a, b); }); for (let i = N; i >= 0; i--) { const [a, b] = pt(P[i], 1); g.lineTo(a, b); } g.closePath(); };
  // las caras: cinco aristas que giran; cada cara visible entre sus dos aristas, con su luz
  const caras = 5;
  if (rx < 1) {
    g.save(); g.globalAlpha *= 1 - rx;
    for (let j = 0; j < caras; j++) {
      const th0 = giro + (j * 6.2832) / caras, th1 = th0 + 6.2832 / caras, thm = (th0 + th1) / 2;
      if (Math.cos(thm) <= -0.1) continue;
      const f0 = Math.max(-1, Math.min(1, Math.sin(th0))), f1 = Math.max(-1, Math.min(1, Math.sin(th1)));
      const ca = Math.cos(((thm % 6.2832) + 6.2832) % 6.2832);
      if (ca < -0.05) continue;
      const fa = Math.sin(th0), fb = Math.sin(th1);
      const lo = Math.min(fa, fb), hi = Math.max(fa, fb);
      // la luz llega de arriba (del lado de -n) y un poco de frente
      const luz = Math.max(0, Math.min(1, 0.45 + 0.45 * Math.cos(thm) - 0.4 * Math.sin(thm)));
      g.beginPath();
      P.forEach((p, i) => { const [a, b] = pt(p, Math.max(-1, lo)); i ? g.lineTo(a, b) : g.moveTo(a, b); });
      for (let i = N; i >= 0; i--) { const [a, b] = pt(P[i], Math.min(1, hi)); g.lineTo(a, b); }
      g.closePath();
      const lg = g.createLinearGradient(-L / 2, 0, L / 2, 0);
      const base = k.mezRgb("176,112,10", "255,226,70", luz), clara = k.mezRgb("200,140,20", "255,244,150", luz);
      lg.addColorStop(0, `rgb(${k.mezRgb(base, "120,120,40", 0.55)})`); lg.addColorStop(0.12, `rgb(${base})`); lg.addColorStop(0.5, `rgb(${clara})`);
      lg.addColorStop(0.86, `rgb(${base})`); lg.addColorStop(1, `rgb(${k.mezRgb(base, "90,60,20", 0.6)})`);
      g.fillStyle = lg; g.fill();
      g.strokeStyle = `rgba(150,95,10,${0.35 * (1 - Math.abs(f0 + f1) / 2)})`; g.lineWidth = Math.max(1, L * 0.003); g.stroke();
    }
    // textura, motas y brillo, dentro del contorno
    g.save(); contorno(); g.clip();
    g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.18; g.drawImage(k.red2, -L * 0.6, -L * 0.4, L * 1.2, L * 0.8);
    g.globalAlpha /= 0.18; g.globalCompositeOperation = "source-over";
    for (const m of MOTAS) {
      const th = m.ang + giro; if (Math.cos(th) < 0.15) continue;
      const p = P[Math.round(m.s * N)], [a, b] = pt(p, Math.sin(th) * 0.95);
      g.fillStyle = `rgba(90,50,10,${0.55 * Math.cos(th)})`; g.beginPath(); g.ellipse(a, b, m.r * L * Math.max(0.3, Math.cos(th)) + 1, m.r * L + 1, 0, 0, 6.2832); g.fill();
    }
    // el brillo largo, en la cara de arriba
    g.beginPath(); P.forEach((p, i) => { if (p.s < 0.15 || p.s > 0.85) return; const [a, b] = pt(p, -0.55); g.lineTo(a, b); });
    g.strokeStyle = "rgba(255,255,235,0.55)"; g.lineWidth = W * 0.07; g.lineCap = "round"; g.stroke();
    g.restore();
    // el tallo y la punta
    const p0 = P[0], p1 = P[N];
    g.save(); g.translate(p0.x, p0.y); g.rotate(Math.atan2(p0.ny, p0.nx));
    k.redondo(g, -W * 0.09, -W * 0.05, W * 0.18, W * 0.62, W * 0.05);
    const tg = g.createLinearGradient(-W * 0.09, 0, W * 0.09, 0); tg.addColorStop(0, "#5a4a14"); tg.addColorStop(0.45, "#a39444"); tg.addColorStop(1, "#3b2e0c");
    g.fillStyle = tg; g.fill();
    g.fillStyle = "#2a1c08"; k.redondo(g, -W * 0.1, W * 0.5, W * 0.2, W * 0.12, W * 0.04); g.fill();
    g.restore();
    g.fillStyle = "#2a1a08"; g.beginPath(); g.arc(p1.x, p1.y, W * 0.065, 0, 6.2832); g.fill();
    g.restore();
  }
  // rayos X: la pulpa a contraluz, su corazón con semillas y el borde que brilla
  if (rx > 0) {
    g.save(); g.globalAlpha *= rx;
    contorno();
    const pg = g.createLinearGradient(0, -W, 0, W);
    pg.addColorStop(0, "rgba(255,248,210,0.30)"); pg.addColorStop(0.5, "rgba(255,240,180,0.55)"); pg.addColorStop(1, "rgba(255,230,160,0.30)");
    g.fillStyle = pg; g.fill();
    g.save(); g.clip();
    g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.25; g.drawImage(k.causticas, -L * 0.6, -L * 0.4, L * 1.2, L * 0.8); g.globalAlpha /= 0.25;
    g.globalCompositeOperation = "source-over";
    // el corazón: tres hilos y semillas
    for (const f of [-0.12, 0, 0.12]) {
      g.beginPath(); P.forEach((p, i) => { if (p.s < 0.1 || p.s > 0.9) return; const [a, b] = pt(p, f); g.lineTo(a, b); });
      g.strokeStyle = "rgba(255,235,170,0.35)"; g.lineWidth = W * 0.05; g.stroke();
    }
    for (let i = 6; i < N - 5; i += 2) { const [a, b] = pt(P[i], (i % 4 ? 0.06 : -0.06)); g.fillStyle = "rgba(70,40,15,0.5)"; g.beginPath(); g.arc(a, b, W * 0.018, 0, 6.2832); g.fill(); }
    g.restore();
    contorno(); g.strokeStyle = "rgba(255,240,170,0.9)"; g.lineWidth = Math.max(3, L * 0.006); g.stroke();
    g.shadowColor = "rgba(255,220,120,0.8)"; g.shadowBlur = 40; g.stroke();
    g.restore();
  }
  g.restore();
}
// Un punto dentro del plátano (s a lo largo, f de lado a lado entre -1 y 1), en la pantalla.
export function enPlatano(x, y, L, ang, s, f, o = {}) {
  const curva = o.curva ?? 1.15, W = (o.W ?? 0.23) * L;
  const R = L / (2 * Math.sin(curva / 2)), c = Math.cos(curva / 2), a = -curva / 2 + curva * s;
  const nx = Math.sin(a), ny = Math.cos(a), h = ancho(s) * W * 0.5 * f;
  const lx = R * nx - 0 + nx * h, ly = R * ny - R * c - (R - R * c) * 0.5 + ny * h;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  return [x + lx * ca - ly * sa, y + lx * sa + ly * ca];
}

// ---------------------------------------------------------------- los átomos
// Una bolita de potasio: lila con su luz arriba a la izquierda. verde: de 0 a 1, el potasio-40 (radiactivo).
export function atomo(g, x, y, r, verde = 0, al = 1) {
  if (r < 0.6 || al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const c1 = k.mezRgb("226,190,255", "220,255,170", verde), c2 = k.mezRgb("150,90,220", "80,220,60", verde), c3 = k.mezRgb("50,20,90", "20,80,20", verde);
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
  gr.addColorStop(0, `rgb(${c1})`); gr.addColorStop(0.45, `rgb(${c2})`); gr.addColorStop(1, `rgb(${c3})`);
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(x - r * 0.38, y - r * 0.42, r * 0.22, r * 0.14, -0.6, 0, 6.2832); g.fill();
  g.restore();
}
// Un átomo que se rompe: u segundos después, un destello verde con su onda y un rayo que sale en la dirección dir.
export function destello(g, x, y, u, tam = 160, dir = 0, largo = 260) {
  if (u < 0 || u > 0.7) return;
  const e = Math.exp(-u * 7);
  k.brillo(g, x, y, tam * (1.2 + u * 2), "verde", e);
  k.brillo(g, x, y, tam * 0.5, "blanca", e);
  g.save(); g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(160,255,120,${0.6 * Math.exp(-u * 5)})`; g.lineWidth = 3 + tam * 0.02;
  g.beginPath(); g.arc(x, y, tam * 0.2 + tam * 1.6 * (1 - Math.exp(-u * 6)), 0, 6.2832); g.stroke();
  // el rayo: un trazo corto que viaja hacia fuera
  const d0 = largo * Math.min(1, u * 5), d1 = largo * Math.min(1, u * 5) + tam * 0.6;
  const cx = Math.cos(dir), sy = Math.sin(dir);
  const lg = g.createLinearGradient(x + cx * d0, y + sy * d0, x + cx * d1, y + sy * d1);
  lg.addColorStop(0, "rgba(190,255,150,0)"); lg.addColorStop(1, `rgba(220,255,190,${0.9 * Math.exp(-u * 4)})`);
  g.strokeStyle = lg; g.lineWidth = 4 + tam * 0.015; g.lineCap = "round";
  g.beginPath(); g.moveTo(x + cx * d0, y + sy * d0); g.lineTo(x + cx * d1, y + sy * d1); g.stroke();
  g.restore();
}
// Una lista de roturas a ritmo fijo (por segundo), con semilla: [{ t, a, b, dir }] con a y b de 0 a 1 para colocarlas.
export function roturas(semilla, porSeg, t0, t1) {
  const az = azar(semilla), l = [];
  for (let t = t0; t < t1; t += (1 / porSeg) * (0.4 + az() * 1.2)) l.push({ t, a: az(), b: az(), dir: az() * 6.2832 });
  return l;
}

// ---------------------------------------------------------------- un plátano pequeño ya dibujado (para montones)
export const SPRITE = (() => {
  const c = lienzo(260, 160), x = c.getContext("2d");
  platano(x, 130, 70, 220, 0, { giro: 0.3, curva: 1.2, W: 0.22 });
  return c;
})();

// ---------------------------------------------------------------- el plátano grande, como acaba el hook
// Cómo queda el plátano al final del hook (y al principio de «Dentro de este»): grande, en diagonal, a contraluz.
export const BX = 540, BY = 1040, BL = 1080, BANG = -0.95;
// las roturas de todo el plátano: unas quince por segundo (su potasio-40), desde «radiactivos» hasta el final
export const ROTURAS = roturas(4040, 15, 0, 20);
// dónde se rompe cada una dentro del plátano (s a lo largo, f de lado a lado)
export const dondeRotura = (r) => enPlatano(BX, BY, BL, BANG, 0.12 + r.a * 0.76, (r.b - 0.5) * 1.5);

// ---------------------------------------------------------------- un camino suave por una lista de puntos (cerrado)
export function caminoSuave(g, pts) {
  const n = pts.length, m = (i) => { const a = pts[i % n], b = pts[(i + 1) % n]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
  const m0 = m(n - 1); g.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) { const p = pts[i], q = m(i); g.quadraticCurveTo(p[0], p[1], q[0], q[1]); }
  g.closePath();
}

// ---------------------------------------------------------------- un montón de plátanos (posiciones, una vez)
// n plátanos en un montón con forma de colina de ancho w y alto h, sobre (0, 0): [{ x, y, ang, esc, orden }].
export function monton(semilla, n, w, h) {
  const az = azar(semilla), l = [];
  for (let i = 0; i < n; i++) {
    const u = i / n, alto = h * Math.sqrt(u);                 // los primeros abajo, los últimos arriba
    const anchoAhi = w * 0.5 * (1 - alto / h * 0.85);
    l.push({ x: (az() * 2 - 1) * anchoAhi, y: -alto + (az() - 0.5) * h * 0.08, ang: (az() - 0.5) * 2.6, esc: 0.85 + az() * 0.3, flip: az() < 0.5 });
  }
  return l;
}
export function dibujaPlatanito(g, x, y, tam, ang, flip = false) {
  g.save(); g.translate(x, y); g.rotate(ang); if (flip) g.scale(-1, 1);
  g.drawImage(SPRITE, -tam / 2, -tam * 0.31, tam, tam * 0.615); g.restore();
}

// ---------------------------------------------------------------- tú, de cristal
// Las siluetas en coordenadas locales: los pies en y = 0, la cabeza arriba (y negativa), unas 1.000 unidades de alto.
const MITAD = [[30, -812], [34, -772], [150, -736], [192, -700], [208, -560], [218, -400], [214, -300], [226, -240], [196, -212], [170, -252], [166, -400], [150, -600], [140, -500], [126, -420], [142, -330], [132, -170], [100, -30], [122, 0], [28, 0], [32, -150], [6, -300]];
export const DE_PIE = [...MITAD, ...MITAD.slice(0, -1).reverse().map(([x, y]) => [-x, y])];
export const CABEZA_DE_PIE = [0, -905, 78, 98];
export const SENTADO = [[-25, -795], [-72, -700], [-88, -550], [-84, -430], [-96, -370], [-62, -325], [150, -325], [228, -318], [238, -200], [226, -40], [222, 0], [330, 0], [332, -28], [292, -62], [288, -300], [302, -372], [262, -425], [60, -432], [58, -525], [76, -640], [56, -742], [28, -795]];
export const BRAZO_SENTADO = [[-34, -735], [24, -742], [62, -560], [180, -505], [204, -478], [186, -448], [36, -482], [-22, -560]];
export const CABEZA_SENTADO = [12, -885, 80, 98];

// Puntos al azar dentro de una silueta (para el potasio y las roturas), una vez.
export function dentroDe(siluetas, cabeza, n, semilla) {
  const c = lienzo(10, 10).getContext("2d"), az = azar(semilla), l = [];
  const xs = siluetas.flat().map((p) => p[0]), ys = siluetas.flat().map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = cabeza[1] - cabeza[3], y1 = 0;
  let intentos = 0;
  while (l.length < n && intentos++ < n * 40) {
    const x = mez(x0, x1, az()), y = mez(y0, y1, az());
    const enCabeza = ((x - cabeza[0]) / cabeza[2]) ** 2 + ((y - cabeza[1]) / cabeza[3]) ** 2 < 0.85;
    let dentro = enCabeza;
    for (const s of siluetas) { if (dentro) break; c.beginPath(); caminoSuave(c, s); dentro = c.isPointInPath(x, y); }
    if (dentro) l.push({ x, y, f: az() * 6.2832, d: az() });
  }
  return l;
}

// La silueta de cristal: azul por dentro, con su borde de luz y un reflejo. luz: de 0 a 1, cuánto brilla en verde.
export function cristal(g, siluetas, cabeza, luz = 0, al = 1) {
  g.save(); g.globalAlpha *= al;
  const forma = () => { g.beginPath(); for (const s of siluetas) caminoSuave(g, s); g.ellipse(cabeza[0], cabeza[1], cabeza[2], cabeza[3], 0, 0, 6.2832); };
  forma();
  const bg = g.createLinearGradient(-250, -1000, 250, 0);
  bg.addColorStop(0, `rgba(${k.mezRgb("120,190,255", "180,255,140", luz)},0.38)`); bg.addColorStop(0.5, `rgba(${k.mezRgb("40,90,170", "60,170,60", luz)},0.30)`); bg.addColorStop(1, `rgba(${k.mezRgb("20,40,110", "30,90,30", luz)},0.42)`);
  g.fillStyle = bg; g.fill("nonzero");
  g.save(); g.clip("nonzero"); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.18; g.drawImage(k.causticas, -400, -1100, 800, 1150); g.restore();
  g.strokeStyle = `rgba(${k.mezRgb("170,225,255", "200,255,160", luz)},0.9)`; g.lineWidth = 5;
  for (const s of siluetas) { g.beginPath(); caminoSuave(g, s); g.stroke(); }
  g.beginPath(); g.ellipse(cabeza[0], cabeza[1], cabeza[2], cabeza[3], 0, 0, 6.2832); g.stroke();
  g.save(); g.shadowColor = `rgba(${k.mezRgb("120,200,255", "150,255,100", luz)},0.9)`; g.shadowBlur = 30; g.globalAlpha *= 0.6;
  for (const s of siluetas) { g.beginPath(); caminoSuave(g, s); g.stroke(); }
  g.restore();
  // el reflejo, a la izquierda
  g.fillStyle = "rgba(255,255,255,0.22)"; g.beginPath(); g.ellipse(cabeza[0] - cabeza[2] * 0.45, cabeza[1] - cabeza[3] * 0.3, cabeza[2] * 0.15, cabeza[3] * 0.35, 0.3, 0, 6.2832); g.fill();
  g.restore();
}
