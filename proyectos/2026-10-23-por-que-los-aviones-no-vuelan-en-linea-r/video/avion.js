// Un avión de pasajeros de dos motores, en 3D de verdad (unos cientos de polígonos), dibujado con luz desde cualquier
// ángulo. Coordenadas del modelo: x hacia la nariz (de -0,5 a 0,5: mide 1), y arriba, z hacia el ala derecha.
// R: matriz 3×3 (filas) que lleva el modelo al espacio de la cámara: X a la derecha, Y arriba, Z hacia quien mira.
// Se dibuja con su centro en (x, y), midiendo `tam` píxeles de nariz a cola.

const DOS_PI = Math.PI * 2;

// ---------------------------------------------------------------- matrices
export const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
export const mul = (A, B) => A.map((f) => [0, 1, 2].map((j) => f[0] * B[0][j] + f[1] * B[1][j] + f[2] * B[2][j]));
export const rotX = (a) => { const c = Math.cos(a), s = Math.sin(a); return [[1, 0, 0], [0, c, -s], [0, s, c]]; };
export const rotY = (a) => { const c = Math.cos(a), s = Math.sin(a); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]; };
export const rotZ = (a) => { const c = Math.cos(a), s = Math.sin(a); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; };
const apl = (R, p) => [R[0][0] * p[0] + R[0][1] * p[1] + R[0][2] * p[2], R[1][0] * p[0] + R[1][1] * p[1] + R[1][2] * p[2], R[2][0] * p[0] + R[2][1] * p[1] + R[2][2] * p[2]];
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const uni = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// El avión visto desde arriba, en un mapa: la nariz apunta a la pantalla con el ángulo `rumbo` (radianes, 0 = derecha,
// positivo = hacia abajo, como en la pantalla). elev: cuánto se ve de lado (90° = justo desde arriba; 55° = en picado).
export function desdeArriba(rumbo, elev = 1.15, alabeo = 0) {
  // el modelo: nariz hacia +x; lo ponemos tumbado en el suelo (y = altura) y miramos desde elev sobre el horizonte.
  const giroPlano = rotY(-rumbo);                // girar sobre el eje vertical (positivo = hacia abajo en la pantalla)
  const camara = rotX(elev);                     // 90° = desde arriba del todo; 0 = de lado
  return mul(camara, mul(giroPlano, rotX(alabeo)));
}
// El avión visto de lado (algo de tres cuartos): rumbo 0 = nariz a la derecha; dirigido hacia delante si `tresCuartos`.
export function deLado(mirando = 1, tresCuartos = 0.35, cabeceo = 0, alabeo = 0) {
  const base = mul(rotX(0.2), rotY(mirando > 0 ? -tresCuartos : Math.PI + tresCuartos));
  return mul(base, mul(rotZ(cabeceo), rotX(alabeo)));
}

// ---------------------------------------------------------------- el modelo
const BLANCO = [244, 247, 252], GRIS = [150, 166, 190], VENTANA = [24, 38, 66], ACENTO = [255, 92, 54], ACENTO2 = [255, 188, 66], MOTOR = [212, 220, 232], OSCURO = [32, 40, 58];
const polis = [];
const poli = (pts, col, op = {}) => {
  // normal del polígono (por su orden); `doble`: se ve por las dos caras
  const n = uni(cruz(res(pts[1], pts[0]), res(pts[pts.length - 1], pts[0])));
  const c = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length, a[2] + p[2] / pts.length], [0, 0, 0]);
  polis.push({ pts, col, n, c, ...op });
};

// El fuselaje: de revolución, con la cola subiendo.
const perfil = [
  [0.5, 0.0], [0.492, 0.016], [0.478, 0.03], [0.455, 0.041], [0.42, 0.048], [0.37, 0.0515], [0.26, 0.0525], [-0.2, 0.0525],
  [-0.27, 0.0495], [-0.34, 0.040], [-0.41, 0.027], [-0.47, 0.015], [-0.5, 0.009],
];
const yc = (x) => (x < -0.2 ? (-0.2 - x) * 0.16 : 0);
const LADOS = 20;
const anillo = (i, a) => { const [x, r] = perfil[i]; return [x, yc(x) + r * Math.cos(a), r * Math.sin(a)]; };
for (let i = 0; i < perfil.length - 1; i++) {
  for (let j = 0; j < LADOS; j++) {
    const a0 = (j / LADOS) * DOS_PI, a1 = ((j + 1) / LADOS) * DOS_PI, am = (a0 + a1) / 2;
    const p = [anillo(i, a0), anillo(i, a1), anillo(i + 1, a1), anillo(i + 1, a0)];
    // el color: blanco arriba, gris azulado por debajo, y una franja de color en el costado, a la altura de las ventanas
    const arriba = Math.cos(am); // 1 arriba, -1 abajo
    let col = arriba < -0.45 ? GRIS : BLANCO;
    const lado = Math.abs(Math.sin(am));
    const franja = lado > 0.9 && arriba < -0.12 && arriba > -0.38 && perfil[i][0] < 0.36 && perfil[i][0] > -0.3;
    if (franja) col = ACENTO;
    poli(p, col, { cerrado: true, brillo: 0.5, esFuselaje: true });
  }
}
// Parabrisas y ventanillas.
const radioEn = (x) => { for (let i = 0; i < perfil.length - 1; i++) if (x <= perfil[i][0] && x >= perfil[i + 1][0]) { const u = (perfil[i][0] - x) / (perfil[i][0] - perfil[i + 1][0]); return perfil[i][1] + (perfil[i + 1][1] - perfil[i][1]) * u; } return 0.05; };
const parche = (x0, x1, a0, a1, col, dr = 1.006) => {
  const pts = [[x0, a0], [x0, a1], [x1, a1], [x1, a0]].map(([x, a]) => [x, yc(x) + radioEn(x) * dr * Math.cos(a), radioEn(x) * dr * Math.sin(a)]);
  poli(pts, col, { cerrado: true, brillo: 0.9, parche: true });
};
for (const lado of [1, -1]) {
  for (let x = 0.3; x > -0.19; x -= 0.036) parche(x, x - 0.016, lado * 1.12, lado * 1.3, VENTANA);
  // cabina
  parche(0.455, 0.42, lado * 0.35, lado * 1.0, OSCURO);
}
parche(0.462, 0.43, -0.34, 0.34, OSCURO);

// Las alas (derecha, y la izquierda por simetría), en varias franjas para que se ordenen bien.
const ala = (s) => {
  const RLE = [0.08, -0.012, 0.05], RTE = [-0.15, -0.012, 0.05], TLE = [-0.22, 0.045, 0.5], TTE = [-0.31, 0.045, 0.5];
  const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  const N = 5;
  for (let i = 0; i < N; i++) {
    const u0 = i / N, u1 = (i + 1) / N;
    const A = lerp3(RLE, TLE, u0), B = lerp3(RLE, TLE, u1), C = lerp3(RTE, TTE, u1), D = lerp3(RTE, TTE, u0);
    const f = (p, dy) => [p[0], p[1] + dy, p[2] * s];
    const arriba = [f(A, 0.005), f(B, 0.005), f(C, 0.005), f(D, 0.005)], abajo = [f(A, -0.005), f(B, -0.005), f(C, -0.005), f(D, -0.005)];
    const sp = s > 0 ? 1 : -1;
    poli(sp > 0 ? arriba : arriba.slice().reverse(), [231, 237, 247], { brillo: 0.35 });
    poli(sp > 0 ? abajo.slice().reverse() : abajo, [154, 168, 192], { brillo: 0.2 });
  }
  // la punta (un pequeño winglet)
  const t = (p, dy) => [p[0], p[1] + dy, p[2] * s];
  poli([t(TLE, 0.0), t([TLE[0] - 0.015, TLE[1] + 0.05, TLE[2] + 0.005], 0), t([TTE[0] + 0.0, TTE[1] + 0.05, TTE[2] + 0.005], 0), t(TTE, 0)], ACENTO, { doble: true, brillo: 0.4 });
  // el motor
  const cx = 0.04, cy = -0.062, cz = 0.2 * s, r = 0.037, M = 12, x0 = 0.115, x1 = -0.04;
  const an = (x, a, rr = r) => [x, cy + rr * Math.cos(a), cz + rr * Math.sin(a)];
  for (let j = 0; j < M; j++) {
    const a0 = (j / M) * DOS_PI, a1 = ((j + 1) / M) * DOS_PI;
    poli([an(x0, a0), an(x0, a1), an(x1, a1), an(x1, a0)], MOTOR, { cerrado: true, brillo: 0.8 });
    poli([an(x0, a0, r * 0.82), an(x0, a1, r * 0.82), an(x0, a1, r * 0.1), an(x0, a0, r * 0.1)], OSCURO, { cerrado: true, brillo: 0.1, delante: true });
    poli([an(x1, a0), an(x1, a1), an(x1 - 0.03, a1, r * 0.5), an(x1 - 0.03, a0, r * 0.5)], [120, 130, 150], { cerrado: true, brillo: 0.6 });
  }
  // el estabilizador horizontal
  const SL = [-0.37, 0.025, 0.02], ST = [-0.46, 0.025, 0.02], TL = [-0.455, 0.03, 0.18], TT = [-0.5, 0.03, 0.18];
  const g3 = (p, dy) => [p[0], p[1] + dy, p[2] * s];
  const ea = [g3(SL, 0.004), g3(TL, 0.004), g3(TT, 0.004), g3(ST, 0.004)], eb = [g3(SL, -0.004), g3(TL, -0.004), g3(TT, -0.004), g3(ST, -0.004)];
  poli(s > 0 ? ea : ea.slice().reverse(), [226, 232, 244], { brillo: 0.3 });
  poli(s > 0 ? eb.slice().reverse() : eb, [150, 164, 188], { brillo: 0.2 });
};
ala(1); ala(-1);

// La deriva (la aleta de la cola), con su color.
for (const z of [0.004, -0.004]) {
  const f = (x, y) => [x, y, z];
  poli(z > 0 ? [f(-0.27, 0.07), f(-0.43, 0.215), f(-0.49, 0.215), f(-0.47, 0.07)] : [f(-0.47, 0.07), f(-0.49, 0.215), f(-0.43, 0.215), f(-0.27, 0.07)], ACENTO, { brillo: 0.45 });
  poli(z > 0 ? [f(-0.34, 0.1), f(-0.41, 0.17), f(-0.45, 0.17), f(-0.43, 0.1)] : [f(-0.43, 0.1), f(-0.45, 0.17), f(-0.41, 0.17), f(-0.34, 0.1)], ACENTO2, { brillo: 0.5 });
}

// ---------------------------------------------------------------- dibujar
const LUZ = uni([-0.45, 0.8, 0.55]);
const aRgb = (c, k = 1) => `rgb(${Math.min(255, Math.round(c[0] * k))},${Math.min(255, Math.round(c[1] * k))},${Math.min(255, Math.round(c[2] * k))})`;

// op: { luz: [x,y,z] en espacio cámara, tinte: "r,g,b" de la luz ambiente de rebote, al: transparencia, sombra: {dx, dy, al} }
export function dibujaAvion(g, x, y, tam, R, op = {}) {
  const luz = op.luz ? uni(op.luz) : LUZ;
  const lista = [];
  for (const p of polis) {
    let n = apl(R, p.n);
    const c = apl(R, p.c);
    if (p.cerrado) { if (n[2] < -0.02) continue; }          // las caras de atrás de lo cerrado no se ven
    else if (n[2] < 0 && !p.doble) n = [-n[0], -n[1], -n[2]]; // las de las alas, por las dos caras
    else if (n[2] < 0) n = [-n[0], -n[1], -n[2]];
    lista.push({ p, n, z: c[2], c });
  }
  lista.sort((a, b) => a.z - b.z);
  if (op.sombra) {
    const S = op.sombra, A = g.globalAlpha;
    g.save(); g.globalAlpha = A * S.al; g.fillStyle = "#000";
    for (const q of lista) {
      if (q.p.parche) continue;
      g.beginPath();
      q.p.pts.forEach((pt, i) => { const w = apl(R, pt); const X = x + tam * w[0] + S.dx + (w[2] * S.dz || 0), Y = y - tam * w[1] + S.dy; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); });
      g.closePath(); g.fill();
    }
    g.restore();
  }
  const A0 = g.globalAlpha;
  g.save();
  g.globalAlpha = A0 * (op.al ?? 1);
  g.lineJoin = "round";
  for (const q of lista) {
    const dif = Math.max(0, q.n[0] * luz[0] + q.n[1] * luz[1] + q.n[2] * luz[2]);
    // luz de relleno desde abajo (el reflejo del mapa/las nubes) y borde claro
    const rel = Math.max(0, -q.n[1]) * 0.18;
    // reflejo: el vector de la mitad entre la luz y quien mira (0,0,1)
    const h = uni([luz[0], luz[1], luz[2] + 1]);
    const esp = Math.pow(Math.max(0, q.n[0] * h[0] + q.n[1] * h[1] + q.n[2] * h[2]), 18) * (q.p.brillo ?? 0.3);
    const k = 0.5 + 0.6 * dif + rel;
    const base = q.p.col;
    let r = base[0] * k + 255 * esp * 0.55, gg = base[1] * k + 255 * esp * 0.55, b = base[2] * k + 255 * esp * 0.6;
    if (op.tinte) { const t = op.tinte.split(",").map(Number); r = r * 0.86 + t[0] * 0.14 * k; gg = gg * 0.86 + t[1] * 0.14 * k; b = b * 0.86 + t[2] * 0.14 * k; }
    const col = `rgb(${Math.min(255, Math.round(r))},${Math.min(255, Math.round(gg))},${Math.min(255, Math.round(b))})`;
    g.beginPath();
    q.p.pts.forEach((pt, i) => { const w = apl(R, pt); const X = x + tam * w[0], Y = y - tam * w[1]; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); });
    g.closePath();
    g.fillStyle = col; g.fill();
    g.strokeStyle = col; g.lineWidth = Math.max(0.6, tam * 0.0016); g.stroke();
  }
  g.restore();
}
