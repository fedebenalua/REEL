// El salón y la bombilla-cabeza, compartidos por todos los planos. La misma bombilla por fuera y por dentro.
import * as k from "#kit";

export const H = [0, 1.55, 0.08];
export const R = 0.2;
const az = k.azar(20261024);

const mas = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const dentroDe = (x, y, z) => {
  const e = (x / 0.16) ** 2 + (y / 0.13) ** 2 + (z / 0.15) ** 2;
  return e > 1 ? -1 : e;
};

export const PUNTOS = [];
while (PUNTOS.length < 2800) {
  const x = (az() - 0.5) * 0.34, y = (az() - 0.5) * 0.28, z = (az() - 0.5) * 0.32;
  const e = dentroDe(x, y, z);
  if (e < 0) continue;
  if (e < 0.62 && az() > 0.12) continue;
  PUNTOS.push({
    x, y, z,
    b: 0.4 + az() * 0.6,
    diez: y > 0.045 && z > 0.04 && Math.abs(x) < 0.05,
    trozo: (x - 0.09) ** 2 + (y - 0.04) ** 2 + (z - 0.03) ** 2 < 0.0045,
  });
}

// Neuronas grandes: las dos primeras son las que la cámara roza al entrar.
export const NEURONAS = [
  { p: [0.0, 0.02, -0.05], r: 0.05, fase: 0.2 },
  { p: [0.08, -0.01, -0.1], r: 0.042, fase: 1.4 },
  { p: [-0.07, 0.04, 0.02], r: 0.04, fase: 2.1 },
  { p: [0.05, 0.06, 0.05], r: 0.036, fase: 0.8 },
  { p: [-0.02, -0.05, 0.06], r: 0.038, fase: 3.2 },
  { p: [0.1, 0.02, -0.02], r: 0.032, fase: 4.1 },
  { p: [-0.09, -0.02, -0.06], r: 0.034, fase: 1.1 },
  { p: [0.02, 0.07, -0.02], r: 0.03, fase: 2.7 },
  { p: [-0.04, 0.01, 0.09], r: 0.033, fase: 5.0 },
  { p: [0.07, -0.06, 0.02], r: 0.031, fase: 0.5 },
];

export const CHISPAS = [];
for (let i = 0; i < 36; i++) {
  const a = NEURONAS[Math.floor(az() * NEURONAS.length)], b = NEURONAS[Math.floor(az() * NEURONAS.length)];
  if (a === b) continue;
  CHISPAS.push({ a: a.p, b: b.p, f: az(), v: 0.35 + az() * 0.55 });
}

export const FILAMENTO = [];
for (let i = 0; i < 70; i++) {
  const u = i / 69, a = u * Math.PI * 7;
  FILAMENTO.push(mas(H, [Math.cos(a) * 0.055, -0.06 + u * 0.14, Math.sin(a) * 0.055]));
}

const COLS = [[230, 70, 60], [240, 180, 40], [80, 190, 90], [230, 120, 50], [170, 80, 210]];
export const PLATOS = [-2, -1, 0, 1, 2].map((i, n) => ({
  i, n,
  p: [i * 0.32, 0.98, 1.02 + Math.abs(i) * 0.08],
  col: COLS[n],
}));

const CAL = Array.from({ length: 28 }, () => ({ f: az(), v: 0.55 + az() * 0.7, r: 0.012 + az() * 0.02 }));

import { v } from "#voz";

const f3 = v.frase(3), f5 = v.frase(5);

const T = {
  sofa: v.frase(1).t("sofa"),
  bombilla: v.frase(1).t("bombilla"),
  encendida: v.frase(1).t("encendida"),
  cinco: v.frase(2).t("cinco"),
  dos: v.frase(2).t("dos"),
  nada: v.frase(3).t("nada"),
  dentro: v.frase(4).t("dentro"),
  senales: v.frase(4).t("senales"),
  mensajes: v.frase(5).t("mensajes"),
  sangre: v.frase(6).t("sangre"),
  cinco2: v.frase(6).t("cinco"),
  menos: v.frase(6).t("menos"),
  rompe: v.frase(7).t("rompe"),
  mudo: v.frase(7).t("mudo"),
  diez: v.frase(8).t("diez"),
  mentira: v.frase(8).t("mentira"),
  entero: v.frase(8).t("entero"),
  todas: v.frase(9).t("todas"),
  vez: v.frase(9).t("vez"),
  crisis: v.frase(9).t("crisis"),
  estrenar: v.frase(10).t("estrenar"),
  sofa2: v.frase(10).t("sofa"),
  amigo: v.frase(11).t("amigo"),
  fin: v.duracion,
};

const ganchoComun = [
  [4.4, { pos: [0.0, 1.22, 1.78], mira: [0, 1.05, 0.95] }],
  [T.cinco - 0.02, { pos: [0.02, 1.18, 1.7], mira: [0, 1.02, 0.98] }],
  [T.cinco + 0.75, { pos: [0.08, 1.28, 1.55], mira: H }],
  [T.dos - 0.08, { pos: [0.12, 1.16, 1.78], mira: [0, 1.12, 0.1] }],
  [T.dos + 0.9, { pos: [0.1, 1.16, 1.7], mira: [0, 1.14, 0.1] }],
  [f3.inicio + 0.2, { pos: mas(H, [0.04, 0.0, 0.85]), mira: H }],
  [T.nada + 0.08, { pos: mas(H, [0.02, 0.0, 0.5]), mira: H }],
  [T.dentro - 0.08, { pos: mas(H, [0.01, 0.0, 0.46]), mira: H }],
];

export const camHook = k.ruta([
  [0, { pos: mas(H, [0.0, 0.0, 0.02]), mira: mas(H, [0.0, 0.01, -0.25]) }],
  [0.55, { pos: mas(H, [0.04, 0.02, 0.58]), mira: H }],
  [T.sofa, { pos: mas(H, [0.1, -0.02, 0.98]), mira: H }],
  [T.bombilla - 0.05, { pos: mas(H, [0.05, -0.02, 0.72]), mira: H }],
  [T.encendida + 0.4, { pos: mas(H, [0.06, -0.01, 0.8]), mira: H }],
  ...ganchoComun,
]);

// La otra apertura: la bombilla ya enorme en el fotograma 0, y un fogonazo que descubre el sofá.
export const camGolpe = k.ruta([
  [0, { pos: mas(H, [0.02, 0.0, 0.46]), mira: H }],
  [0.45, { pos: mas(H, [0.08, 0.02, 0.78]), mira: H }],
  [T.sofa + 0.05, { pos: mas(H, [0.12, -0.02, 1.02]), mira: H }],
  [T.bombilla, { pos: mas(H, [0.05, -0.02, 0.74]), mira: H }],
  [T.encendida + 0.35, { pos: mas(H, [0.06, -0.01, 0.82]), mira: H }],
  ...ganchoComun,
]);

export const camDentro = k.ruta([
  [T.dentro - 0.04, { pos: mas(H, [0.0, 0.02, 0.24]), mira: mas(H, [0.0, 0.02, -0.06]) }],
  [T.senales, { pos: mas(H, [0.0, 0.02, 0.16]), mira: mas(H, [0.0, 0.02, -0.05]) }],
  [T.senales + 0.55, { pos: mas(H, [-0.02, 0.03, 0.2]), mira: mas(H, [0.05, 0.0, -0.04]) }],
  [T.mensajes, { pos: mas(H, [0.03, 0.02, 0.22]), mira: mas(H, [0.05, 0.0, -0.02]) }],
  [T.mensajes + 0.75, { pos: mas(H, [0.02, 0.03, 0.28]), mira: H }],
  [T.sangre, { pos: mas(H, [0.02, 0.03, 0.34]), mira: mas(H, [0.08, 0.03, 0.0]) }],
  [T.cinco2, { pos: mas(H, [0.02, 0.03, 0.36]), mira: mas(H, [0.08, 0.03, 0.0]) }],
  [T.menos + 0.2, { pos: mas(H, [0.01, 0.02, 0.38]), mira: mas(H, [0.06, 0.02, 0.0]) }],
  [T.rompe, { pos: mas(H, [0.02, 0.02, 0.38]), mira: mas(H, [0.08, 0.02, 0.0]) }],
  [T.rompe + 0.8, { pos: mas(H, [0.0, 0.0, 0.42]), mira: mas(H, [0.08, -0.1, 0.04]) }],
  [T.mudo, { pos: mas(H, [0.0, 0.02, 0.48]), mira: H }],
  [T.diez, { pos: mas(H, [0.0, 0.03, 0.5]), mira: H }],
  [T.mentira + 0.35, { pos: mas(H, [0.0, 0.02, 0.46]), mira: H }],
  [T.entero, { pos: mas(H, [0.0, 0.02, 0.44]), mira: H }],
  [T.todas, { pos: mas(H, [0.0, 0.02, 0.4]), mira: H }],
  [T.crisis, { pos: mas(H, [0.0, 0.02, 0.36]), mira: H }],
  [T.crisis + 0.75, { pos: mas(H, [0.0, 0.02, 0.4]), mira: H }],
  [T.estrenar - 0.25, { pos: mas(H, [0.06, 0.0, 0.9]), mira: H }],
  [T.sofa2, { pos: [0.08, 1.28, 1.7], mira: [0.05, 1.22, 0.1] }],
  [T.amigo - 0.25, { pos: [0.32, 1.18, 2.15], mira: [0.32, 1.22, 0.1] }],
  [T.amigo + 0.6, { pos: [0.3, 1.18, 2.1], mira: [0.32, 1.24, 0.1] }],
  [T.fin - 0.12, { pos: mas(H, [0.06, 0.0, 0.78]), mira: H }],
]);

function esfera(g, cam, p, r, rgb) {
  const P = k.proyecta(cam, p);
  if (!P) return null;
  const rad = k.tamano(r, P.z);
  if (rad < 1 || rad > 980) return { ...P, rad: 0 };
  const grd = g.createRadialGradient(P.x - rad * 0.32, P.y - rad * 0.38, rad * 0.08, P.x, P.y, rad);
  grd.addColorStop(0, `rgb(${Math.min(255, rgb[0] + 70)},${Math.min(255, rgb[1] + 55)},${Math.min(255, rgb[2] + 40)})`);
  grd.addColorStop(0.55, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
  grd.addColorStop(1, `rgb(${rgb[0] * 0.28 | 0},${rgb[1] * 0.22 | 0},${rgb[2] * 0.22 | 0})`);
  g.beginPath();
  g.arc(P.x, P.y, rad, 0, 6.2832);
  g.fillStyle = grd;
  g.fill();
  return { ...P, rad };
}

function fondo(g, cam, dentro) {
  g.fillStyle = dentro ? "#07061a" : "#100c18";
  g.fillRect(0, 0, 1080, 1920);
  const C = k.proyecta(cam, H) || { x: 540, y: 900 };
  const bg = g.createRadialGradient(C.x, C.y, 40, C.x, C.y, 1400);
  if (dentro) {
    bg.addColorStop(0, "rgba(70,40,120,0.45)");
    bg.addColorStop(1, "rgba(0,0,0,0)");
  } else {
    bg.addColorStop(0, "rgba(255,150,60,0.28)");
    bg.addColorStop(0.45, "rgba(40,30,70,0.2)");
    bg.addColorStop(1, "rgba(0,0,0,0)");
  }
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
}

function quad(g, cam, pts, color) {
  const q = pts.map((p) => k.proyecta(cam, p));
  if (q.some((p) => !p)) return;
  g.beginPath();
  g.moveTo(q[0].x, q[0].y);
  for (let i = 1; i < q.length; i++) g.lineTo(q[i].x, q[i].y);
  g.closePath();
  g.fillStyle = color;
  g.fill();
}

function habitacion(g, cam, t) {
  quad(g, cam, [[-4, 0, -1.4], [4, 0, -1.4], [5, 0, 3.2], [-5, 0, 3.2]], "#5a3424");
  quad(g, cam, [[-0.7, 0.02, 0.35], [1.15, 0.02, 0.35], [1.25, 0.02, 1.35], [-0.85, 0.02, 1.35]], "#c4493a");
  // ventana de noche
  const V = [[-1.15, 2.15, -1.15], [-0.15, 2.15, -1.15], [-0.15, 1.25, -1.15], [-1.15, 1.25, -1.15]].map((p) => k.proyecta(cam, p));
  if (V.every(Boolean)) {
    g.beginPath();
    g.moveTo(V[0].x, V[0].y);
    for (let i = 1; i < 4; i++) g.lineTo(V[i].x, V[i].y);
    g.closePath();
    const ng = g.createLinearGradient(0, V[0].y, 0, V[2].y);
    ng.addColorStop(0, "#1c3f86");
    ng.addColorStop(1, "#071226");
    g.fillStyle = ng;
    g.fill();
    const M = k.proyecta(cam, [-0.85, 1.9, -1.1]);
    if (M) {
      const mr = k.tamano(0.08, M.z);
      g.beginPath();
      g.arc(M.x, M.y, mr, 0, 6.2832);
      g.fillStyle = "#f4e7b0";
      g.fill();
    }
  }
  // sofá
  cojin(g, cam, [0.25, 0.78, -0.22], 1.25, 0.42, [12, 78, 92]);
  cojin(g, cam, [0.25, 0.46, 0.12], 1.2, 0.24, [16, 110, 122]);
  cojin(g, cam, [-0.85, 0.58, 0.05], 0.2, 0.28, [10, 70, 84]);
  cojin(g, cam, [1.35, 0.58, 0.05], 0.2, 0.28, [10, 70, 84]);
  // mesa
  cojin(g, cam, [0, 0.78, 1.05], 0.95, 0.08, [92, 58, 36]);
  persona(g, cam, 0, 1, t);
  if (t > 43.2) {
    const x = k.mez(1.55, 0.62, k.entra(k.tramo(t, 44.15, 45.05)));
    const luz = k.suave(k.tramo(t, T.amigo - 0.08, T.amigo + 0.35));
    persona(g, cam, x, luz, t);
    bombilla(g, cam, [x, H[1], H[2]], R * 0.92, luz, t);
  }
  platos(g, cam, t);
}

function cojin(g, cam, p, rx, ry, rgb) {
  const P = k.proyecta(cam, p);
  if (!P) return;
  const a = Math.max(2, k.tamano(rx, P.z)), b = Math.max(2, k.tamano(ry, P.z));
  const grd = g.createRadialGradient(P.x - a * 0.3, P.y - b * 0.4, a * 0.1, P.x, P.y, a);
  grd.addColorStop(0, `rgb(${Math.min(255, rgb[0] + 50)},${Math.min(255, rgb[1] + 40)},${Math.min(255, rgb[2] + 30)})`);
  grd.addColorStop(1, `rgb(${rgb[0] * 0.45 | 0},${rgb[1] * 0.4 | 0},${rgb[2] * 0.4 | 0})`);
  g.beginPath();
  g.ellipse(P.x, P.y, a, b, 0, 0, 6.2832);
  g.fillStyle = grd;
  g.fill();
}

function persona(g, cam, ox, luz, t) {
  const jersey = [18, 148, 166], pantalon = [46, 52, 112], piel = [232, 186, 158];
  const yz = (y, z) => [ox, y, z];
  esfera(g, cam, yz(0.58, 0.14), 0.17, pantalon);
  esfera(g, cam, [ox - 0.14, 0.4, 0.2], 0.1, pantalon);
  esfera(g, cam, [ox + 0.16, 0.38, 0.22], 0.1, pantalon);
  esfera(g, cam, yz(0.86, 0.14), 0.2, jersey);
  esfera(g, cam, yz(1.12, 0.08), 0.21, jersey);
  esfera(g, cam, [ox - 0.34, 1.1, 0.12], 0.09, jersey);
  esfera(g, cam, [ox - 0.4, 0.88, 0.22], 0.075, jersey);
  esfera(g, cam, [ox - 0.36, 0.7, 0.28], 0.06, piel);
  esfera(g, cam, [ox + 0.34, 1.1, 0.12], 0.09, jersey);
  esfera(g, cam, [ox + 0.42, 0.9, 0.22], 0.075, jersey);
  esfera(g, cam, [ox + 0.38, 0.72, 0.3], 0.06, piel);
  esfera(g, cam, yz(1.32, 0.06), 0.075, piel);
  if (luz < 0.98) {
    // la cabeza apagada, hasta que se enciende
    esfera(g, cam, [ox, H[1], H[2]], R * 0.72, [40, 36, 48]);
  }
}

function platos(g, cam, t) {
  const u = k.suave(k.tramo(t, T.cinco - 0.12, T.cinco + 0.85));
  for (const pl of PLATOS) {
    let p = pl.p, al = 1;
    if (pl.i === 0) {
      const arco = Math.sin(u * Math.PI) * 0.55;
      const base = k.mezV(pl.p, mas(H, [0, -0.02, 0.12]), u);
      p = [base[0], base[1] + arco, base[2]];
      al = 1 - k.suave(k.tramo(u, 0.72, 1));
    }
    if (al < 0.02) continue;
    g.save();
    g.globalAlpha = al;
    esfera(g, cam, p, 0.16, [236, 232, 220]);
    esfera(g, cam, [p[0], p[1] + 0.06, p[2]], 0.1, pl.col);
    g.restore();
  }
  // el chorro de calorías, del plato a la bombilla
  const chorro = k.suave(k.tramo(t, T.cinco + 0.15, T.cinco + 0.45)) * (1 - k.suave(k.tramo(t, T.cinco + 1.05, T.cinco + 1.4)));
  if (chorro > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const c of CAL) {
      const s = (c.f + (t - T.cinco) * c.v) % 1;
      const p = k.mezV(PLATOS[2].p, H, s);
      const P = k.proyecta(cam, [p[0], p[1] + Math.sin(s * 6) * 0.08, p[2]]);
      if (!P) continue;
      k.brillo(g, P.x, P.y, k.tamano(c.r, P.z) * 6, "255,190,80", chorro);
    }
    g.restore();
  }
}

function bombilla(g, cam, centro, radio, luz, t) {
  if (luz <= 0.02) return;
  const P = k.proyecta(cam, centro);
  if (!P) return;
  const rad = k.tamano(radio, P.z);
  const pulso = 0.85 + 0.15 * Math.sin(t * 3.2);
  k.brillo(g, P.x, P.y - rad * 0.05, rad * 3.1, "255,176,70", luz * pulso);
  // casquillo
  const cuello = k.proyecta(cam, [centro[0], centro[1] - radio * 0.82, centro[2]]);
  if (cuello) {
    const a = k.tamano(radio * 0.42, cuello.z), b = k.tamano(radio * 0.38, cuello.z);
    g.beginPath();
    g.ellipse(cuello.x, cuello.y, Math.max(2, a), Math.max(2, b), 0, 0, 6.2832);
    const mg = g.createLinearGradient(cuello.x - a, cuello.y, cuello.x + a, cuello.y);
    mg.addColorStop(0, "#8a6230");
    mg.addColorStop(0.45, "#f0d090");
    mg.addColorStop(1, "#6e4c22");
    g.fillStyle = mg;
    g.fill();
  }
  g.beginPath();
  g.arc(P.x, P.y, rad, 0, 6.2832);
  g.save();
  k.vidrio(g, P.x - rad, P.x + rad, 0.55 * luz);
  g.restore();
  // filamento, si se ve por el cristal
  filamento(g, cam, t, luz, centro);
}

function filamento(g, cam, t, luz, centro) {
  const dx = centro[0] - H[0];
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < FILAMENTO.length; i++) {
    const p = FILAMENTO[i];
    const q = [p[0] + dx, p[1], p[2]];
    const P = k.proyecta(cam, q);
    if (!P) continue;
    const s = Math.min(150, k.tamano(0.022, P.z));
    const parpadeo = 0.75 + 0.25 * Math.sin(t * 9 + i * 0.4);
    k.brillo(g, P.x, P.y, Math.min(380, Math.max(10, s * 2.6)), "255,210,150", luz * parpadeo);
    g.fillStyle = `rgba(255,246,220,${0.9 * luz})`;
    g.beginPath();
    g.arc(P.x, P.y, Math.max(2, s * 0.55), 0, 6.2832);
    g.fill();
  }
  g.restore();
}

function cerebro(g, cam, t) {
  const dist = k.largo(k.res(cam.p, H));
  if (dist > 1.35) return;
  const cae = k.suave(k.tramo(t, T.rompe, T.rompe + 0.85));
  const sangre = k.suave(k.tramo(t, T.sangre - 0.05, T.cinco2 + 0.15)) * (1 - k.suave(k.tramo(t, T.menos + 0.25, T.rompe - 0.05)));
  const mitoOn = k.suave(k.tramo(t, T.diez - 0.05, T.diez + 0.35));
  const mitoOff = k.suave(k.tramo(t, T.mentira, T.mentira + 0.7));
  const mito = mitoOn * (1 - mitoOff);
  const crisis = k.suave(k.tramo(t, T.todas - 0.1, T.crisis)) * (1 - k.suave(k.tramo(t, T.crisis + 0.08, T.crisis + 0.85)));
  const verNeuronas = dist < 0.85;

  const cosas = [];
  if (verNeuronas) {
    for (const n of NEURONAS) {
      const caido = n.p[0] > 0.06 && n.p[1] > 0 && n.p[2] > -0.02;
      const p = caido ? [H[0] + n.p[0] + 0.04 * cae, H[1] + n.p[1] - 0.4 * cae, H[2] + n.p[2] + 0.08 * cae] : mas(H, n.p);
      const P = k.proyecta(cam, p);
      if (!P) continue;
      const esDiez = n.p[1] > 0.03 && n.p[2] > 0.0 && Math.abs(n.p[0]) < 0.07;
      const esZona = n.p[0] > 0.04 && n.p[1] > -0.01;
      let rgb = [255, 176, 80], alN = 1;
      if (crisis > 0.25) rgb = [255, 244, 232];
      else if (mito > 0.15 && !esDiez) { rgb = [70, 48, 42]; alN = 1 - 0.85 * mito; }
      else if (esZona && sangre > 0.15 && cae < 0.2) rgb = [230, 70, 80];
      else if (caido && cae > 0.25) { rgb = [120, 80, 60]; alN = 1 - 0.5 * cae; }
      cosas.push({ z: P.z, dibuja: () => { g.save(); g.globalAlpha *= alN; esfera(g, cam, p, n.r, rgb); g.restore(); } });
    }
  }
  for (const q of PUNTOS) {
    let x = q.x, y = q.y, z = q.z;
    if (q.trozo) { x += 0.05 * cae; y -= 0.42 * cae; z += 0.1 * cae; }
    const P = k.proyecta(cam, [H[0] + x, H[1] + y, H[2] + z]);
    if (!P || P.z > 1.4) continue;
    const s = Math.min(9, k.tamano(0.006, P.z));
    if (s < 1.3) continue;
    let al = q.b * Math.min(1, 0.55 / P.z);
    if (!q.diez) al *= 1 - 0.9 * mito;
    if (q.trozo) al *= 1 - 0.65 * cae;
    const rojo = q.trozo || (q.x > 0.05 && q.y > 0);
    cosas.push({
      z: P.z,
      dibuja: () => {
        const col = crisis > 0.15 ? "255,244,236" : rojo && sangre > 0.05 ? k.mezRgb("255,186,90", "255,50,70", sangre) : "255,190,110";
        g.fillStyle = `rgba(${col},${Math.min(1, al) * (0.45 + 0.55 * (1 - crisis * 0.3))})`;
        g.fillRect(P.x, P.y, s, s);
      },
    });
  }
  k.deLejosACerca(cosas);

  // mensajes
  const msg = 0.45 + 0.55 * k.suave(k.tramo(t, f5.inicio, T.mensajes + 0.2));
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const ch of CHISPAS) {
    const u = (t * ch.v + ch.f) % 1;
    const local = k.mezV(ch.a, ch.b, u);
    const P = k.proyecta(cam, mas(H, local));
    if (!P) continue;
    if (P.z < 0.06) continue;
    const tam = Math.min(120, k.tamano(0.014, P.z) * (4 + 4 * msg));
    k.brillo(g, P.x, P.y, Math.max(8, tam), crisis > 0.45 ? "blanca" : "255,210,120", (0.4 + 0.5 * msg) * (1 - mito * 0.85) * (crisis > 0.45 ? 1 : 0.85));
  }
  g.restore();

  if (cae > 0.05 && cae < 0.98) ventanaRota(g, cam, t, cae);
  rotulos(g, cam, t, sangre, mito, mitoOff);
  if (crisis > 0.02) {
    const C = k.proyecta(cam, H);
    if (C) k.fogonazo(g, C.x, C.y, (t - T.crisis) * 1.3, 520, "255,230,200");
  }
}

function ventanaRota(g, cam, t, cae) {
  const c = mas(H, [0.09 + 0.05 * cae, 0.04 - 0.42 * cae, 0.03 + 0.1 * cae]);
  const P = k.proyecta(cam, c);
  if (!P) return;
  const r = Math.max(30, k.tamano(0.06, P.z));
  const sep = cae * r * 0.65;
  const dib = (dx, lado) => {
    g.save();
    g.beginPath();
    g.rect(P.x - r + dx, P.y - r, r, r * 2);
    if (lado < 0) g.rect(P.x - r + dx, P.y - r, r - sep * 0.1, r * 2);
    g.clip();
    g.translate(dx, cae * 10);
    g.beginPath();
    g.arc(P.x, P.y, r, 0, 6.2832);
    const sg = g.createLinearGradient(P.x, P.y - r, P.x, P.y + r);
    sg.addColorStop(0, "#1a3e86");
    sg.addColorStop(1, "#0c1020");
    g.fillStyle = sg;
    g.fill();
    g.beginPath();
    g.arc(P.x - r * 0.2, P.y - r * 0.25, r * 0.22, 0, 6.2832);
    g.fillStyle = "#f6e7a8";
    g.fill();
    g.fillStyle = "#f0c14a";
    g.fillRect(P.x + r * 0.15, P.y - r * 0.05, r * 0.08, r * 0.45);
    k.brillo(g, P.x + r * 0.19, P.y - r * 0.05, r * 0.7, "255,200,80", 0.8);
    g.restore();
  };
  g.save();
  g.globalAlpha = Math.min(1, cae * 3) * (1 - k.suave(k.tramo(cae, 0.75, 1)));
  dib(-sep, -1);
  dib(sep, 1);
  g.restore();
}

function rotulos(g, cam, t, sangre, mito, mitoOff) {
  const dos = k.suave(k.tramo(t, T.dos - 0.05, T.dos + 0.2)) * (1 - k.suave(k.tramo(t, T.dos + 1.15, T.dos + 1.45)));
  if (dos > 0.05) k.pastilla(g, 540, 1240, "2", "%", "255,196,90", dos, 100);
  const cinco = k.suave(k.tramo(t, T.cinco2 - 0.05, T.cinco2 + 0.18)) * (1 - k.suave(k.tramo(t, T.menos + 0.15, T.menos + 0.45)));
  if (cinco > 0.05) {
    const Z = k.proyecta(cam, mas(H, [0.09, 0.04, 0.03]));
    const x = Z ? Math.max(180, Math.min(780, Z.x)) : 700;
    const y = Z ? Math.max(620, Math.min(1200, Z.y + 80)) : 1000;
    k.pastilla(g, x, y, "5", "%", "255,90,110", cinco, 100);
  }
  const diez = mito * (1 - k.suave(k.tramo(t, T.mentira, T.mentira + 0.4)));
  if (diez > 0.05) k.pastilla(g, 540, 1280, "10", "%", "255,80,90", diez, 108);
  if (mitoOff > 0.02 && mitoOff < 0.9 && t < T.entero + 0.2) {
    // el cartel ya se apagó; la luz que vuelve es el argumento
  }
}

function velo(g) {
  const vg = g.createLinearGradient(0, 220, 0, 560);
  vg.addColorStop(0, "rgba(0,0,0,0.62)");
  vg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = vg;
  g.fillRect(0, 200, 1080, 380);
}

export function dibujaMundo(g, t, cam, golpe) {
  const dist = k.largo(k.res(cam.p, H));
  const interior = t >= T.dentro - 0.05 && t < T.estrenar - 0.35;
  const enFilamento = dist < 0.28 && t < 0.7;
  fondo(g, cam, interior || enFilamento);
  if (!interior && !enFilamento) habitacion(g, cam, t);
  if (interior) cerebro(g, cam, t);
  if (!interior) {
    const luz = enFilamento ? 1 : 0.7 + 0.3 * k.suave(k.tramo(t, T.bombilla - 0.2, T.encendida));
    if (enFilamento) filamento(g, cam, t, 1, H);
    else bombilla(g, cam, H, R, t > T.estrenar ? 1 : luz, t);
    if (golpe && t < 1.15) {
      const P = k.proyecta(cam, H);
      if (P) k.fogonazo(g, P.x, P.y, t * 1.2, 1100, "255,210,140");
    }
    if (t > T.encendida - 0.05 && t < T.encendida + 0.55) {
      const P = k.proyecta(cam, H);
      if (P) k.fogonazo(g, P.x, P.y, t - T.encendida + 0.05, 480, "255,220,170");
    }
  }
  velo(g);
}
