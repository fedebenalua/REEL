// Lo que comparten los planos: el gato (un atigrado naranja con el pecho y las patas blancas), dibujado como un cuerpo
// de verdad que gira por mitades; el vacío azul por el que cae a cámara lenta; la caída entera (cuándo gira cada parte).
//
// El gato se ve de lado. Su columna va de la cadera (s = 0) a los hombros (s = 1); cada trozo de cuerpo lleva su giro
// alrededor de la columna (0: el lomo arriba, de pie; π: boca arriba). La mitad de delante (rf) y la de atrás (rr)
// giran por separado, y el giro pasa de una a otra en la mitad del lomo, como se retuerce la columna de verdad.
import * as k from "#kit";
import { v } from "#voz";

const { suave: su, tramo: tr, mez, azar, lienzo } = k;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------- colores
const NARANJA = [236, 146, 62], CLARO = [255, 200, 128], RAYA = [150, 70, 24], CREMA = [252, 240, 226], ROSA = [240, 150, 160];
const mezC = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const rgb = (c, m = 1) => `rgb(${Math.max(0, Math.min(255, Math.round(c[0] * m)))},${Math.max(0, Math.min(255, Math.round(c[1] * m)))},${Math.max(0, Math.min(255, Math.round(c[2] * m)))})`;
const rgba = (c, a, m = 1) => `rgba(${Math.max(0, Math.min(255, Math.round(c[0] * m)))},${Math.max(0, Math.min(255, Math.round(c[1] * m)))},${Math.max(0, Math.min(255, Math.round(c[2] * m)))},${a})`;
const envuelve = (a) => { a = (a + Math.PI) % TAU; if (a < 0) a += TAU; return a - Math.PI; };

// El color de la piel en un punto: s a lo largo del cuerpo, psi el ángulo desde el centro del lomo (0) a la tripa (±π).
function piel(s, psi) {
  const lomo = Math.cos(psi);
  const tripa = su(tr(-lomo, -0.15, 0.55));
  let c = mezC(NARANJA, CLARO, 0.25 * su(tr(lomo, 0.2, 1)) * 0);
  // las rayas: anillos en uve que bajan por los costados, y la raya del lomo
  const anillo = 0.5 + 0.5 * Math.sin(TAU * (s * 6.2 + 0.22 * psi * psi) + 0.6);
  const raya = su(tr(anillo, 0.55, 0.9)) * su(tr(lomo, -0.35, 0.25)) * 0.85 + Math.exp(-Math.pow(psi / 0.32, 2)) * 0.45;
  c = mezC(c, RAYA, Math.min(1, raya));
  return mezC(c, CREMA, tripa);
}

// ---------------------------------------------------------------- el gato
// e: { x, y (el centro del lomo, en pantalla), esc (px por unidad; el lomo mide 2), ang (giro del cuerpo en pantalla),
//      rf, rr (giro de la mitad de delante y de la de atrás), rc (giro de más de la cabeza), ef, et (cuánto encoge las
//      patas de delante y las de atrás, 0-1), estira (las de atrás estiradas hacia atrás, 0-1), dobla (cuánto dobla la
//      cintura), t (el segundo, para la cola y el pelo), rayos (0-1: se ve la columna), luzF, luzA (brillo de cada mitad),
//      clavicula (0-1: se marca), pie (0-1: las patas rectas para estar de pie), aplasta (0-1: el golpe al aterrizar) }
const L = 1.5; // el lomo
// medio alto (del lomo a la tripa) y medio ancho de cada trozo: la cadera, la cintura, el pecho hondo, el cuello
const perfil = (s) => {
  let hb = k.claves([[-0.2, 0.36], [0.1, 0.37], [0.5, 0.34], [0.85, 0.42], [1.05, 0.38], [1.22, 0.25]])(Math.max(-0.2, Math.min(1.22, s)));
  let hw = k.claves([[-0.2, 0.31], [0.1, 0.31], [0.5, 0.27], [0.85, 0.3], [1.05, 0.27], [1.22, 0.2]])(Math.max(-0.2, Math.min(1.22, s)));
  if (s < 0) { const f = Math.sqrt(Math.max(0, 1 - Math.pow(s / 0.2, 2))); hb *= f; hw *= f; }
  return [hb, hw];
};
const radio = (s) => perfil(s)[0];
const capa = lienzo(1080, 1920), capaG = capa.getContext("2d");

export function medir(e0) { return dibujaGato(null, { x: 540, y: 960, esc: 300, ang: 0, rf: 0, rr: 0, rc: 0, dobla: 0, aplasta: 0, ...e0, medir: true }); }
export function gato(g, e0) {
  const e = { x: 540, y: 960, esc: 300, ang: 0, rf: 0, rr: 0, rc: 0, ef: 0, et: 0, estira: 0, dobla: 0, t: 0, rayos: 0, luzF: 0, luzA: 0, clavicula: 0, pie: 0, aplasta: 0, al: 1, mira: 0, patalea: 0, cria: 0, ...e0 };
  const aparte = e.al < 0.999 || e.rayos > 0.01;
  const c = aparte ? capaG : g;
  if (aparte) { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over"; c.clearRect(0, 0, 1080, 1920); }
  const r = dibujaGato(c, { ...e, rayos: 0 });
  if (e.rayos > 0.01) {
    // rayos X: la piel se vuelve oscura y transparente
    c.save(); c.globalCompositeOperation = "source-atop"; c.fillStyle = `rgba(14,26,80,${0.72 * e.rayos})`; c.fillRect(0, 0, 1080, 1920); c.restore();
  }
  if (aparte) { g.save(); g.globalAlpha *= Math.max(0, e.al) * (1 - 0.25 * e.rayos); g.drawImage(capa, 0, 0); g.restore(); }
  if (e.rayos > 0.01) dibujaGato(g, { ...e, soloColumna: true });
  return r;
}

function dibujaGato(g, e) {
  const { esc } = e;
  const ca = Math.cos(e.ang), sa = Math.sin(e.ang);
  // de unidades del cuerpo (x adelante, y arriba, en pantalla) a píxeles
  const P = (x, y) => [e.x + (x * ca + y * sa) * esc, e.y + (x * sa - y * ca) * esc];
  const giro = (s) => mez(e.rr, e.rf, su(tr(s, 0.3, 0.7)));
  const aplY = 1 - 0.18 * e.aplasta; // el golpe: se aplasta un poco
  // la columna: un arco que se dobla hacia el lomo (en la pantalla, según hacia dónde mira el lomo en cada trozo)
  const espina = (s) => {
    const x = (s - 0.5) * L * (1 + 0.06 * e.aplasta);
    const y = e.dobla * 0.55 * 4 * s * (1 - s) * Math.cos((e.rf + e.rr) / 2) - 0.06 * e.aplasta;
    return [x, y * aplY];
  };
  const tang = (s) => { const a = espina(s - 0.01), b = espina(s + 0.01); const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; return [dx / d, dy / d]; };
  // un punto del cuerpo: en el trozo s, a lo largo (a), hacia el lomo (b) y hacia el costado (c, + hacia la cámara de pie)
  // → [x, y en unidades de pantalla, z hacia la cámara]
  const punto = (s, a, b, cc, rho = giro(s)) => {
    const C = espina(s), T = tang(s), N = [-T[1], T[0]];
    const cr = Math.cos(rho), sr = Math.sin(rho);
    const n = b * cr - cc * sr, z = b * sr + cc * cr;
    return [C[0] + T[0] * a + N[0] * n, C[1] + T[1] * a + N[1] * n * aplY, z];
  };

  if (e.medir) { const rho = giro(1) + e.rc, H = punto(1.16, 0.26, 0.1, 0, rho), O = punto(1.16, 0.26 - 0.04 * 1.22, 0.1 + 0.02 * 1.22, 0, rho); return { cabeza: P(H[0], H[1]), oido: P(O[0], O[1]), radio: 0.366 * esc, rho }; }
  if (e.soloColumna) { columna(g, P, esc, espina, giro, punto, e); return; }
  // ---- las patas y la cola: se dibujan detrás o delante del cuerpo según su z
  const patas = [];
  const flota = e.t * 7;
  const pataDe = (delante, lado) => {
    const s = delante ? 0.9 : 0.1, rho = delante ? mez(e.rf, e.rf + e.rc * 0.3, 0) : e.rr;
    const enc = delante ? e.ef : e.et;
    const mueve = Math.sin(flota * (1 + 0.6 * e.patalea) + (delante ? 0 : 1.7) + lado * 2.1) * 0.12 * (1 + 2.2 * e.patalea) * (1 - enc) * (1 - e.pie);
    let a1, a2, l1, l2;
    const corta = 1 - 0.25 * e.cria;
    if (delante) { l1 = 0.42 * corta; l2 = 0.4 * corta; a1 = mez(0.12 + mueve, -0.55, enc); a2 = mez(0.02 - mueve * 0.5, 2.35, enc); }
    else { l1 = 0.46 * corta; l2 = 0.44 * corta; a1 = mez(0.45 + mueve, 1.25, enc); a2 = mez(-0.3 - mueve * 0.6, -1.05, enc); a1 = mez(a1, -0.9, e.estira * (1 - enc)); a2 = mez(a2, -1.25, e.estira * (1 - enc)); }
    a1 = mez(a1, delante ? 0.05 : 0.35, e.pie); a2 = mez(a2, delante ? 0 : -0.28, e.pie);
    const hombro = [delante ? 0 : 0.04, delante ? -0.16 : -0.06, lado * 0.18];
    const d1 = [Math.sin(a1), -Math.cos(a1)], d2 = [Math.sin(a2), -Math.cos(a2)];
    const abre = lado * 0.05 * (1 - enc);
    const codo = [hombro[0] + d1[0] * l1, hombro[1] + d1[1] * l1, hombro[2] + abre];
    const mano = [codo[0] + d2[0] * l2, codo[1] + d2[1] * l2 * (1 - 0.25 * e.aplasta), codo[2] + abre];
    const A = punto(s, ...hombro, rho), B = punto(s, ...codo, rho), C = punto(s, ...mano, rho);
    patas.push({ z: (A[2] + B[2] + C[2]) / 3, dibuja: () => pata(g, P, esc, A, B, C, delante) });
  };
  pataDe(true, 1); pataDe(true, -1); pataDe(false, 1); pataDe(false, -1);
  // la cola: sale de la grupa hacia atrás y arriba, y ondula
  const cola = [];
  {
    let a = 0, b = 0, cc = 0, dirA = -0.75, dirB = 0.55;
    for (let i = 0; i <= 12; i++) {
      cola.push(punto(-0.12, a, b + 0.12, cc, e.rr));
      const w = Math.sin(e.t * 2.6 - i * 0.45) * 0.16;
      dirB += 0.04 + w * 0.5; dirA -= 0.01;
      const d = Math.hypot(dirA, dirB);
      a += (dirA / d) * 0.11; b += (dirB / d) * 0.11; cc += Math.sin(e.t * 1.9 - i * 0.4) * 0.025;
    }
  }
  const zCola = cola[6][2];
  patas.push({ z: zCola, dibuja: () => colaDib(g, P, esc, cola, e.t) });

  for (const p of patas) if (p.z < 0) p.dibuja();

  // ---- el cuerpo: tiras de lado a lado; cada trozo es un óvalo (más alto que ancho) girado con su trozo, y cada punto
  // lleva el color de la piel y la luz según hacia dónde mira
  const N1 = 96, s0 = -0.2, s1 = 1.22, NT = 56;
  const bordes = [];
  for (let i = 0; i <= N1; i++) {
    const s = s0 + (i / N1) * (s1 - s0), ds = (s1 - s0) / N1;
    let [hb, hw] = perfil(s); hb *= 1 + 0.08 * e.aplasta; hw *= 1 + 0.1 * e.aplasta;
    if (hb <= 0.01) continue;
    const C = espina(s), T = tang(s), N = [-T[1], T[0]];
    const rho = giro(s), cr = Math.cos(rho), sr = Math.sin(rho);
    const caida = 0.05 * Math.sin(Math.PI * Math.max(0, Math.min(1, s))); // la tripa cuelga un poco
    const vis = [];
    for (let q = 0; q < NT; q++) {
      const th = (q / NT) * TAU, b = hb * Math.cos(th) - (Math.cos(th) < 0 ? caida * -Math.cos(th) : 0), c = hw * Math.sin(th);
      const n = b * cr - c * sr, z = b * sr + c * cr;
      let nb = Math.cos(th) / hb, nc = Math.sin(th) / hw; const nl = Math.hypot(nb, nc); nb /= nl; nc /= nl;
      const nn = nb * cr - nc * sr, nz = nb * sr + nc * cr;
      if (nz > -0.02) vis.push({ n, th, nn, nz });
    }
    if (vis.length < 2) continue;
    vis.sort((p, q) => q.n - p.n);
    const nmax = vis[0].n, nmin = vis[vis.length - 1].n;
    bordes.push({ s, C, T, N, nmax, nmin, thMax: vis[0].th, thMin: vis[vis.length - 1].th });
    const top = P(C[0] + N[0] * nmax, C[1] + N[1] * nmax * aplY), bot = P(C[0] + N[0] * nmin, C[1] + N[1] * nmin * aplY);
    const gr = g.createLinearGradient(top[0], top[1], bot[0], bot[1]);
    const paso = Math.max(1, Math.floor(vis.length / 16));
    for (let j = 0; j < vis.length; j += paso) {
      const v0 = vis[j];
      let col = piel(Math.max(0, Math.min(1, s)), envuelve(v0.th));
      const dif = Math.max(0, v0.nn * 0.6 + v0.nz * 0.7 - 0.1 * T[1]);
      const m = 0.4 + 0.75 * dif;
      const borde = Math.pow(1 - Math.max(0, v0.nz), 3);
      col = [col[0] * m + 60 * borde, col[1] * m + 110 * borde, col[2] * m + 200 * borde];
      gr.addColorStop(Math.max(0, Math.min(1, (nmax - v0.n) / (nmax - nmin || 1))), rgb(col));
    }
    const w = ds * L * 1.5;
    const a = P(C[0] + N[0] * nmax - T[0] * w, C[1] + (N[1] * nmax - T[1] * w) * aplY), b = P(C[0] + N[0] * nmax + T[0] * w, C[1] + (N[1] * nmax + T[1] * w) * aplY);
    const cB = P(C[0] + N[0] * nmin + T[0] * w, C[1] + (N[1] * nmin + T[1] * w) * aplY), d = P(C[0] + N[0] * nmin - T[0] * w, C[1] + (N[1] * nmin - T[1] * w) * aplY);
    g.fillStyle = gr; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...cB); g.lineTo(...d); g.closePath(); g.fill();
  }
  // el pelo del contorno: pelitos finos y cortos, del color de la piel de ese borde
  {
    const az = azar(77);
    g.save(); g.lineCap = "round";
    for (let i = 0; i < 260; i++) {
      const bo = bordes[Math.floor(az() * bordes.length)], arriba = az() < 0.5;
      if (!bo) continue;
      const nE = arriba ? bo.nmax : bo.nmin, sg = arriba ? 1 : -1;
      const col = piel(Math.max(0, Math.min(1, bo.s)), envuelve(arriba ? bo.thMax : bo.thMin));
      const l = 0.018 + az() * 0.022, inc = (az() - 0.75) * 1.2;
      const { C, T, N } = bo;
      const p0 = P(C[0] + N[0] * (nE - sg * 0.01), C[1] + N[1] * (nE - sg * 0.01) * aplY);
      const p1 = P(C[0] + N[0] * (nE + sg * l) + T[0] * inc * l, C[1] + (N[1] * (nE + sg * l) + T[1] * inc * l) * aplY);
      g.strokeStyle = rgba(col, 0.55, arriba ? 0.9 : 0.55); g.lineWidth = esc * 0.009;
      g.beginPath(); g.moveTo(...p0); g.lineTo(...p1); g.stroke();
    }
    g.restore();
  }
  // las mitades que se iluminan cuando giran
  const luzMitad = (desde, hasta, al, col) => {
    if (al <= 0.01) return;
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i <= 30; i++) {
      const s = mez(desde, hasta, i / 30), r = radio(s), C = espina(s);
      const p = P(C[0], C[1]);
      const borde = Math.min(su(tr(s, desde, desde + 0.12)), su(tr(s, hasta, hasta - 0.12)));
      k.brillo(g, p[0], p[1], r * esc * 2.2, col, al * 0.09 * borde);
    }
    g.restore();
  };
  luzMitad(0.48, 1.12, e.luzF, "255,190,110");
  luzMitad(-0.14, 0.52, e.luzA, "120,210,255");

  // ---- la columna por dentro (rayos X): las vértebras, cada una girada como su trozo de cuerpo
  if (e.rayos > 0.01) {
    g.save();
    g.globalAlpha *= 0.78 * e.rayos;
    const vel = g.createLinearGradient(0, 0, 1080, 1920);
    g.restore();
    columna(g, P, esc, espina, giro, punto, e);
  }

  for (const p of patas) if (p.z >= 0) p.dibuja();

  // ---- la cabeza
  return cabeza(g, P, esc, punto, giro(1) + e.rc, e);
}

// Una pata: dos tramos que se estrechan, con la luz de arriba, y la mano blanca.
function pata(g, P, esc, A, B, C, delante) {
  const lejos = A[2] < 0 ? 0.62 : 1;
  const tubo = (p, q, r0, r1, c0, c1) => {
    const a = P(p[0], p[1]), b = P(q[0], q[1]);
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    const R0 = r0 * esc, R1 = r1 * esc;
    const gr = g.createLinearGradient(a[0] + nx * R0, a[1] + ny * R0, a[0] - nx * R0, a[1] - ny * R0);
    const top = ny < 0 ? 1 : -1;
    gr.addColorStop(0, rgb(c0, (top > 0 ? 1.15 : 0.55) * lejos)); gr.addColorStop(0.45, rgb(c0, 0.95 * lejos)); gr.addColorStop(1, rgb(c0, (top > 0 ? 0.5 : 1.1) * lejos));
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(a[0] + nx * R0, a[1] + ny * R0); g.lineTo(b[0] + nx * R1, b[1] + ny * R1); g.lineTo(b[0] - nx * R1, b[1] - ny * R1); g.lineTo(a[0] - nx * R0, a[1] - ny * R0); g.closePath(); g.fill();
    g.beginPath(); g.arc(a[0], a[1], R0, 0, TAU); g.fill();
    g.beginPath(); g.arc(b[0], b[1], R1, 0, TAU); g.fill();
  };
  const arriba = delante ? mezC(NARANJA, RAYA, 0.15) : mezC(NARANJA, RAYA, 0.25);
  tubo(A, B, delante ? 0.14 : 0.18, 0.1, arriba, arriba);
  tubo(B, C, 0.1, 0.085, mezC(arriba, CREMA, 0.55), CREMA);
  // la mano
  const m = P(C[0], C[1]), R = 0.1 * esc;
  const gr = g.createRadialGradient(m[0] - R * 0.3, m[1] - R * 0.4, R * 0.1, m[0], m[1], R * 1.1);
  gr.addColorStop(0, rgb(CREMA, 1.05 * lejos)); gr.addColorStop(1, rgb(CREMA, 0.62 * lejos));
  g.fillStyle = gr; g.beginPath(); g.ellipse(m[0], m[1], R * 1.1, R * 0.92, 0, 0, TAU); g.fill();
  // las almohadillas, rosas, si se ven
  g.fillStyle = rgba(ROSA, 0.75 * lejos);
  g.beginPath(); g.arc(m[0], m[1] + R * 0.25, R * 0.32, 0, TAU); g.fill();
}

// La cola: un tubo que se estrecha, con anillos oscuros.
function colaDib(g, P, esc, pts, t) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = P(pts[i][0], pts[i][1]), b = P(pts[i + 1][0], pts[i + 1][1]);
    const r = esc * mez(0.1, 0.065, i / (pts.length - 1));
    const raya = i % 3 === 1 || i === pts.length - 2;
    const col = raya ? RAYA : NARANJA;
    const lejos = pts[i][2] < 0 ? 0.65 : 1;
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    const gr = g.createLinearGradient(a[0] + nx * r, a[1] + ny * r, a[0] - nx * r, a[1] - ny * r);
    gr.addColorStop(0, rgb(col, (ny < 0 ? 1.15 : 0.5) * lejos)); gr.addColorStop(0.5, rgb(col, 0.95 * lejos)); gr.addColorStop(1, rgb(col, (ny < 0 ? 0.5 : 1.1) * lejos));
    g.strokeStyle = gr; g.lineWidth = r * 2; g.lineCap = "round";
    g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke();
  }
}

// La columna, vista por dentro: vértebras de luz; cada una tiene su espina hacia el lomo, así se ve cómo se retuerce.
function columna(g, P, esc, espina, giro, punto, e) {
  const al = e.rayos;
  g.save();
  // la piel se vuelve oscura y transparente: un velo azul sobre el cuerpo
  g.globalCompositeOperation = "source-atop";
  g.restore();
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i <= 26; i++) {
    const s = -0.02 + (i / 26) * 1.12, C = espina(s), p = P(C[0], C[1]), rho = giro(s);
    k.brillo(g, p[0], p[1], esc * 0.32, "120,220,255", al * 0.16);
  }
  g.restore();
  for (let i = 0; i <= 22; i++) {
    const s = -0.02 + (i / 22) * 1.14;
    const c = punto(s, 0, 0, 0), sp = punto(s, 0, 0.26, 0), l1 = punto(s, 0, 0.03, 0.14), l2 = punto(s, 0, 0.03, -0.14);
    const a = P(c[0], c[1]), b = P(sp[0], sp[1]), A1 = P(l1[0], l1[1]), A2 = P(l2[0], l2[1]);
    const col = s > 0.5 ? "255,200,120" : "130,215,255";
    const mezcla = su(tr(s, 0.35, 0.65));
    const tono = `${Math.round(mez(130, 255, mezcla))},${Math.round(mez(215, 200, mezcla))},${Math.round(mez(255, 120, mezcla))}`;
    const cerca = sp[2] > 0 ? 1 : 0.55;
    g.save(); g.globalAlpha *= al; g.lineCap = "round";
    // las apófisis de los lados (detrás) y la de arriba: hacia dónde apuntan dice cuánto ha girado cada vértebra
    g.strokeStyle = `rgba(${tono},${0.7})`; g.lineWidth = esc * 0.028;
    g.beginPath(); g.moveTo(...A1); g.lineTo(...A2); g.stroke();
    g.strokeStyle = `rgba(${tono},${cerca})`; g.lineWidth = esc * 0.04;
    g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke();
    g.fillStyle = `rgba(255,255,255,${cerca})`; g.beginPath(); g.arc(b[0], b[1], esc * 0.03, 0, TAU); g.fill();
    const gr = g.createRadialGradient(a[0], a[1] - esc * 0.02, 0, a[0], a[1], esc * 0.075);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, `rgba(${tono},0.9)`);
    g.fillStyle = gr; k.redondo(g, a[0] - esc * 0.045, a[1] - esc * 0.05, esc * 0.09, esc * 0.1, esc * 0.03); g.fill();
    g.restore();
  }
  // la clavícula: un huesecito suelto en el hombro, que se marca y se mueve
  if (e.clavicula > 0.01) {
    const m = Math.sin(e.t * 11) * 0.035 * e.clavicula * (e.mueveClav ?? 1);
    const c0 = punto(0.97, 0.16 + m, 0.02, 0.24), c1 = punto(0.97, 0.0 + m, -0.26, 0.24);
    const a = P(c0[0], c0[1]), b = P(c1[0], c1[1]);
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, esc * 0.9, "255,120,170", 0.8 * e.clavicula);
    g.restore();
    g.save(); g.globalAlpha *= e.clavicula; g.lineCap = "round";
    g.strokeStyle = "rgba(255,225,235,1)"; g.lineWidth = esc * 0.06;
    g.beginPath(); g.moveTo(...a); g.quadraticCurveTo((a[0] + b[0]) / 2 + esc * 0.03, (a[1] + b[1]) / 2, b[0], b[1]); g.stroke();
    g.restore();
  }
}

// La cabeza: una bola con la luz de arriba, el hocico y la barbilla blancos, las orejas, los ojos y la nariz, todos
// girados con la cabeza (rho), así que se ve de lado, desde arriba o desde abajo según gire.
function cabeza(g, P, esc, punto, rho, e) {
  const s = 1.16, hs = 1.22 * (1 + 0.38 * (e.cria || 0));
  const H = punto(s, 0.26, 0.1, 0, rho);
  const pt = (a, b, c) => punto(s, 0.26 + a * hs, 0.1 + b * hs, c * hs, rho);
  const R = 0.3 * hs;
  esc *= hs;
  const h = P(H[0], H[1]);
  const cosas = [];
  // las orejas (detrás de la cabeza si miran lejos)
  const oreja = (lado) => {
    const b1 = pt(-0.13, 0.19, lado * 0.05), b2 = pt(0.07, 0.21, lado * 0.21), pu = pt(-0.07, 0.5, lado * 0.19 + 0.0) ;
    const z = (b1[2] + b2[2] + pu[2]) / 3;
    cosas.push({ z: z - 0.12, dibuja: () => {
      const A = P(b1[0], b1[1]), B = P(b2[0], b2[1]), C = P(pu[0], pu[1]);
      const lejos = z < 0 ? 0.7 : 1;
      g.fillStyle = rgb(mezC(NARANJA, RAYA, 0.2), lejos);
      g.beginPath(); g.moveTo(...A); g.quadraticCurveTo((A[0] + C[0]) / 2 - (B[0] - A[0]) * 0.1, (A[1] + C[1]) / 2, ...C); g.quadraticCurveTo((B[0] + C[0]) / 2, (B[1] + C[1]) / 2, ...B); g.closePath(); g.fill();
      const ci = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
      g.fillStyle = rgba(ROSA, 0.85, lejos);
      g.beginPath(); g.moveTo(mez(A[0], ci[0], 0.35), mez(A[1], ci[1], 0.35)); g.lineTo(mez(C[0], ci[0], 0.3), mez(C[1], ci[1], 0.3)); g.lineTo(mez(B[0], ci[0], 0.35), mez(B[1], ci[1], 0.35)); g.closePath(); g.fill();
    } });
  };
  oreja(1); oreja(-1);
  for (const c of cosas) if (c.z < 0) c.dibuja();
  // la bola
  {
    const Rp = 0.3 * esc;
    const gr = g.createRadialGradient(h[0] - Rp * 0.35, h[1] - Rp * 0.4, Rp * 0.1, h[0], h[1], Rp * 1.05);
    gr.addColorStop(0, rgb(CLARO)); gr.addColorStop(0.5, rgb(NARANJA)); gr.addColorStop(1, rgb(NARANJA, 0.5));
    g.fillStyle = gr; g.beginPath(); g.ellipse(h[0], h[1], Rp, Rp * 0.96, 0, 0, TAU); g.fill();
    // las rayas de la frente: arcos según hacia dónde mira la coronilla
    const top = pt(0, R, 0);
    if (Math.abs(top[2]) < R * 0.98) {
      g.save(); g.beginPath(); g.arc(h[0], h[1], 0.3 * esc, 0, TAU); g.clip();
      g.strokeStyle = rgba(RAYA, 0.55); g.lineWidth = esc * 0.03; g.lineCap = "round";
      for (let i = -1; i <= 1; i++) {
        const a = pt(-0.02 + i * 0.07, R * 0.97, -0.12), b = pt(0.02 + i * 0.07, R * 0.99, 0), c = pt(-0.02 + i * 0.07, R * 0.97, 0.12);
        if (b[2] < -0.1) continue;
        const A = P(a[0], a[1]), B = P(b[0], b[1]), C = P(c[0], c[1]);
        g.beginPath(); g.moveTo(...A); g.quadraticCurveTo(...B, ...C); g.stroke();
      }
      g.restore();
    }
  }
  // el hocico, el pecho y la barbilla blancos
  const hoc = pt(0.21, -0.1, 0), hP = P(hoc[0], hoc[1]);
  {
    const gr = g.createRadialGradient(hP[0] - esc * 0.04, hP[1] - esc * 0.05, 0, hP[0], hP[1], esc * 0.17);
    gr.addColorStop(0, rgb(CREMA, 1.04)); gr.addColorStop(1, rgb(CREMA, 0.72));
    g.fillStyle = gr; g.beginPath(); g.arc(hP[0], hP[1], esc * 0.15, 0, TAU); g.fill();
  }
  // la nariz
  const nz = pt(0.32, -0.03, 0);
  if (nz[2] > -0.12) { const n = P(nz[0], nz[1]); g.fillStyle = rgb(ROSA, 0.95); g.beginPath(); g.ellipse(n[0], n[1], esc * 0.035, esc * 0.028, 0, 0, TAU); g.fill(); }
  // los ojos
  for (const lado of [1, -1]) {
    const o = pt(0.19, 0.07, lado * 0.15);
    if (o[2] < 0.02) continue;
    const vis = Math.min(1, o[2] / 0.15);
    const p = P(o[0], o[1]), r = esc * 0.06 * (1 + 0.25 * (e.cria || 0));
    const ang = Math.atan2(P(pt(0.19, 0.17, lado * 0.15)[0], pt(0.19, 0.17, lado * 0.15)[1])[1] - p[1], P(pt(0.19, 0.17, lado * 0.15)[0], pt(0.19, 0.17, lado * 0.15)[1])[0] - p[0]) + Math.PI / 2;
    g.save(); g.translate(p[0], p[1]); g.rotate(ang); g.scale(0.55 + 0.45 * vis, 1);
    const gr = g.createRadialGradient(-r * 0.2, -r * 0.3, 0, 0, 0, r);
    gr.addColorStop(0, "#f5ff9a"); gr.addColorStop(0.7, "#9ed23a"); gr.addColorStop(1, "#4e7a12");
    g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, r, r * 0.9, 0, 0, TAU); g.fill();
    g.fillStyle = "#121008"; g.beginPath(); g.ellipse(0, 0, r * 0.32, r * 0.8, 0, 0, TAU); g.fill();
    g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.arc(-r * 0.3, -r * 0.35, r * 0.2, 0, TAU); g.fill();
    g.strokeStyle = "rgba(60,30,10,0.8)"; g.lineWidth = r * 0.14; g.beginPath(); g.ellipse(0, 0, r, r * 0.9, 0, 0, TAU); g.stroke();
    g.restore();
  }
  // los bigotes
  g.save(); g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = esc * 0.007; g.lineCap = "round";
  for (const lado of [1, -1]) for (let i = 0; i < 3; i++) {
    const a = pt(0.27, -0.08 - i * 0.025, lado * 0.08), b = pt(0.36 + i * 0.03, -0.06 - i * 0.07, lado * 0.42);
    if (a[2] < -0.05) continue;
    const A = P(a[0], a[1]), B = P(b[0], b[1]);
    g.beginPath(); g.moveTo(...A); g.quadraticCurveTo((A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - esc * 0.03, ...B); g.stroke();
  }
  g.restore();
  for (const c of cosas) if (c.z >= 0) c.dibuja();
  const oi = pt(-0.04, 0.02, 0);
  return { cabeza: h, radio: 0.3 * esc, oido: P(oi[0], oi[1]), rho };
}

// ---------------------------------------------------------------- el vacío azul por el que cae
const azV = azar(909);
const MOTAS = Array.from({ length: 110 }, () => ({ x: azV() * 1080, y: azV() * 2400, z: 0.25 + Math.pow(azV(), 2.2) * 1.6, f: azV() * 6 }));
export function vacio(g, t, cae = 1, ox = 0) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#0a1640"); bg.addColorStop(0.55, "#10287a"); bg.addColorStop(1, "#071030");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 300, 640, 1500, "90,150,255", 0.35);
  k.brillo(g, 860, 1500, 1100, "160,90,255", 0.22);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.07; g.drawImage(k.manchas, -200, -200, 1500, 2400); g.restore();
  // motas de luz desenfocadas que suben (vamos cayendo)
  g.save(); g.globalCompositeOperation = "lighter";
  for (const m of MOTAS) {
    const y = ((m.y - t * 300 * cae * m.z) % 2400 + 2400) % 2400 - 240, x = ((m.x + ox * m.z) % 1080 + 1080) % 1080;
    const r = 2 + m.z * m.z * 6, l = r * (1 + 3 * cae * m.z);
    const a = (m.z > 1.2 ? 0.08 : 0.2) * Math.min(1, m.z) * (0.7 + 0.3 * Math.sin(t * 2 + m.f));
    g.fillStyle = `rgba(170,205,255,${a})`;
    g.beginPath(); g.ellipse(x, y + l / 2 - r, r, l / 2 + r * 0.5, 0, 0, TAU); g.fill();
    g.fillStyle = `rgba(230,240,255,${a * 1.2})`;
    g.beginPath(); g.arc(x, y, r * 0.55, 0, TAU); g.fill();
  }
  g.restore();
}
export function vineta(g, al = 0.55) {
  const vg = g.createRadialGradient(540, 960, 500, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}
export function velo(g, al = 0.5) {
  const vg = g.createLinearGradient(0, 160, 0, 640);
  vg.addColorStop(0, `rgba(4,8,24,${al})`); vg.addColorStop(1, "rgba(4,8,24,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

// ---------------------------------------------------------------- la vuelta en el aire
// u de 0 (boca arriba) a 1 (de pie): primero la cabeza, luego la mitad de delante con sus patas encogidas, luego la de
// atrás. Devuelve el estado de esas partes del gato.
export function vuelta(u) {
  const c = su(tr(u, 0, 0.25)), f = su(tr(u, 0.12, 0.55)), a = su(tr(u, 0.5, 0.92));
  const rf = mez(Math.PI, 0, f);
  const rr = mez(Math.PI, Math.PI + 0.35, su(tr(u, 0.12, 0.5))) * (1 - a) + 0 * a + (a > 0 ? 0 : 0);
  return {
    rf, rr: mez(mez(Math.PI, Math.PI + 0.35, su(tr(u, 0.12, 0.5))), 0, a),
    rc: -0.9 * c * (1 - f),
    ef: Math.min(su(tr(u, 0.05, 0.2)), 1 - su(tr(u, 0.55, 0.75))),
    estira: Math.min(su(tr(u, 0.08, 0.25)), 1 - su(tr(u, 0.45, 0.6))),
    et: Math.min(su(tr(u, 0.45, 0.6)), 1 - su(tr(u, 0.88, 1))),
    dobla: 0.35 * Math.sin(Math.PI * su(tr(u, 0.05, 0.95))),
    pie: su(tr(u, 0.85, 1)),
  };
}

// ---------------------------------------------------------------- la caída a cámara lenta (frases 2 a 6)
// El mismo gato, boca arriba, cayendo despacio por el vacío; cada parte gira cuando la voz la nombra.
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
export const T = {
  suelo: f3.t("suelo"), burbuja: f3.t("burbuja"),
  encoge1: f4.t("encoge"), gira1: f4.t("gira"), delantera: f4.t("delantera"),
  encoge2: f5.t("encoge"), gira2: f5.t("gira"), mitad2: f5.t("mitad"),
  columna: f6.t("columna"), retuerce: f6.t("retuerce"), trapo: f6.t("trapo"), clavicula: f6.t("clavicula"), suelta: f6.t("suelta"), fin6: f6.fin,
};
export function caida(t) {
  const c = su(tr(t, T.suelo - 0.45, T.suelo + 0.45));
  const f = su(tr(t, T.gira1, T.gira1 + 1.25));
  const a = su(tr(t, T.gira2, T.gira2 + 1.2));
  const tw = Math.sin(Math.PI * su(tr(t, T.retuerce - 0.1, T.trapo + 0.9)));
  return {
    rf: Math.PI * (1 - f) - 0.3 * Math.sin(Math.PI * a) + 1.5 * tw,
    rr: mez(Math.PI + 0.35 * f, 0, a) - 1.25 * tw,
    rc: -1.3 * c * (1 - f),
    ef: su(tr(t, T.encoge1 - 0.1, T.encoge1 + 0.45)) * (1 - su(tr(t, T.encoge2 - 0.1, T.encoge2 + 0.45))),
    estira: su(tr(t, T.encoge1, T.encoge1 + 0.5)) * (1 - su(tr(t, T.encoge2 - 0.1, T.encoge2 + 0.4))),
    et: su(tr(t, T.encoge2 - 0.1, T.encoge2 + 0.45)) * (1 - su(tr(t, T.gira2 + 1.0, T.gira2 + 1.5))),
    dobla: 0.35 * Math.sin(Math.PI * su(tr(t, T.encoge1, T.gira2 + 1.3))),
    pie: su(tr(t, T.gira2 + 0.9, T.gira2 + 1.5)),
    luzF: su(tr(t, T.gira1 - 0.15, T.gira1 + 0.2)) * (1 - su(tr(t, T.gira1 + 1.3, T.gira1 + 1.8))),
    luzA: su(tr(t, T.gira2 - 0.15, T.gira2 + 0.2)) * (1 - su(tr(t, T.gira2 + 1.3, T.gira2 + 1.8))),
    rayos: su(tr(t, T.columna - 0.2, T.columna + 0.35)),
    clavicula: su(tr(t, T.clavicula - 0.1, T.clavicula + 0.25)),
    patalea: 0.5 * (1 - su(tr(t, T.encoge1 - 0.4, T.encoge1))),
    t,
  };
}

// ---------------------------------------------------------------- la cámara en el vacío (frases 3 a 6)
// De lado, el gato entero; en la frase 3 entra hasta su oído y vuelve a salir.
export const ZOOM = { entra: v.frase(3).t("su") - 0.3, dentro: v.frase(3).t("nivel"), sale: T.suelo + 0.35, fuera: T.suelo + 1.2 };
export function camVacio(t) {
  const base = {
    x: k.claves([[ZOOM.entra, 470], [ZOOM.fuera, 445], [T.columna - 0.3, 445], [T.columna + 0.6, 455]])(t),
    y: k.claves([[ZOOM.entra, 1000], [ZOOM.fuera, 980], [T.columna - 0.3, 980], [T.columna + 0.6, 840]])(t),
    esc: k.claves([[ZOOM.entra, 350], [ZOOM.fuera, 325], [T.mitad2, 330], [T.columna - 0.3, 330], [T.columna + 0.6, 330]])(t),
    ang: k.claves([[ZOOM.entra, -0.12], [ZOOM.fuera, 0], [T.columna, 0]])(t),
  };
  const z = su(tr(t, ZOOM.entra, ZOOM.dentro)) * (1 - su(tr(t, ZOOM.sale, ZOOM.fuera)));
  if (z <= 0) return { ...base, z: 0 };
  // entra hacia el oído: el oído va al centro y todo crece
  const st = caida(t);
  const esc = base.esc * Math.exp(Math.log(9) * z);
  const o1 = medir({ ...st, x: 0, y: 0, esc: 1, ang: base.ang }).oido;
  const o0 = [base.x + o1[0] * base.esc, base.y + o1[1] * base.esc];
  const ox = mez(o0[0], 540, su(Math.min(1, z * 1.4))), oy = mez(o0[1], 1000, su(Math.min(1, z * 1.4)));
  return { x: ox - o1[0] * esc, y: oy - o1[1] * esc, esc, ang: base.ang, z, oido: [ox, oy] };
}

// ---------------------------------------------------------------- el oído por dentro
// Los tres canales de líquido y, delante, un tubo curvo de cristal con líquido y una burbuja: un nivel de burbuja.
// La burbuja siempre se va a lo más alto; si el oído está boca abajo, se va a un extremo.
// (x, y) el centro; S su tamaño en px; ang su giro en la pantalla (π: boca abajo); suelta (0-1: la burbuja se suelta
// del centro y corre a donde le toca); luz (0-1).
export function laberinto(g, x, y, S, ang, suelta, luz, t) {
  if (luz <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= luz;
  const tubo = (dib, w, col, alC) => {
    g.lineCap = "round";
    g.strokeStyle = `rgba(${col},0.25)`; g.lineWidth = w * 2.2; dib(); g.stroke();
    g.strokeStyle = `rgba(${col},${alC})`; g.lineWidth = w; dib(); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = w * 0.22; dib(); g.stroke();
  };
  // el brillo de detrás
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, 0, S * 2.2, "120,170,255", 0.35); g.restore();
  // los tres canales: bucles de líquido azul
  const w = S * 0.075;
  tubo(() => { g.beginPath(); g.ellipse(-S * 0.08, -S * 0.42, S * 0.3, S * 0.36, -0.15, Math.PI * 0.62, Math.PI * 2.38); }, w, "110,210,255", 0.75);
  tubo(() => { g.beginPath(); g.ellipse(-S * 0.42, -S * 0.08, S * 0.34, S * 0.26, 0.5, Math.PI * 0.1, Math.PI * 1.85); }, w, "120,190,255", 0.7);
  tubo(() => { g.beginPath(); g.ellipse(S * 0.05, -S * 0.12, S * 0.4, S * 0.13, 0.25, 0, Math.PI * 2); }, w * 0.9, "150,225,255", 0.6);
  // el centro, dorado
  const cg = g.createRadialGradient(-S * 0.05, S * 0.02, 0, 0, S * 0.05, S * 0.22);
  cg.addColorStop(0, "rgba(255,240,190,1)"); cg.addColorStop(0.6, "rgba(255,190,90,0.95)"); cg.addColorStop(1, "rgba(200,110,40,0.9)");
  g.fillStyle = cg; g.beginPath(); g.ellipse(0, S * 0.06, S * 0.24, S * 0.17, -0.2, 0, Math.PI * 2); g.fill();
  // el nivel: un tubo de cristal arqueado por encima, con su líquido verde y su burbuja
  const R = S * 0.78, a0 = Math.PI + 0.62, a1 = Math.PI * 2 - 0.62, cy = S * 0.62;
  const ancho = S * 0.2;
  g.save();
  g.lineCap = "round";
  g.strokeStyle = "rgba(20,40,10,0.6)"; g.lineWidth = ancho + S * 0.05; g.beginPath(); g.arc(0, cy, R, a0, a1); g.stroke();
  g.strokeStyle = "rgba(190,255,90,0.95)"; g.lineWidth = ancho; g.beginPath(); g.arc(0, cy, R, a0, a1); g.stroke();
  g.strokeStyle = "rgba(240,255,170,0.7)"; g.lineWidth = ancho * 0.35; g.beginPath(); g.arc(0, cy, R + ancho * 0.18, a0, a1); g.stroke();
  // las marcas del centro
  g.strokeStyle = "rgba(30,50,10,0.85)"; g.lineWidth = S * 0.018;
  for (const d of [-0.12, 0.12]) { const a = Math.PI * 1.5 + d; g.beginPath(); g.moveTo(Math.cos(a) * (R - ancho * 0.55), cy + Math.sin(a) * (R - ancho * 0.55)); g.lineTo(Math.cos(a) * (R + ancho * 0.55), cy + Math.sin(a) * (R + ancho * 0.55)); g.stroke(); }
  // la burbuja: a lo más alto del tubo (en la pantalla)
  let objetivo = -Math.PI / 2 - ang;
  objetivo = ((objetivo % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const centro = Math.PI * 1.5, lim0 = a0 + 0.1, lim1 = a1 - 0.1;
  if (objetivo < lim0 || objetivo > lim1) {
    // fuera del tubo: a la punta más alta
    const y0 = Math.sin(lim0 + ang), y1 = Math.sin(lim1 + ang);
    objetivo = y0 < y1 ? lim0 : lim1;
  }
  const ab = mez(centro, objetivo, suelta);
  const bx = Math.cos(ab) * R, by = cy + Math.sin(ab) * R;
  const bg = g.createRadialGradient(bx - ancho * 0.12, by - ancho * 0.12, 0, bx, by, ancho * 0.42);
  bg.addColorStop(0, "rgba(255,255,255,1)"); bg.addColorStop(0.6, "rgba(245,255,220,0.95)"); bg.addColorStop(1, "rgba(200,240,140,0.7)");
  g.fillStyle = bg; g.beginPath(); g.ellipse(bx, by, ancho * 0.9, ancho * 0.36, ab + Math.PI / 2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "rgba(40,70,10,0.9)"; g.lineWidth = S * 0.02; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.ellipse(bx + Math.cos(ab) * -ancho * 0.08, by - ancho * 0.1, ancho * 0.3, ancho * 0.1, ab + Math.PI / 2, 0, Math.PI * 2); g.fill();
  g.restore();
  g.restore();
}
