// El coche aparcado, la calle y la escarcha. Lo comparten todos los planos: el mismo coche, del mismo tamaño.
import * as k from "#kit";
import { v } from "#voz";

const azF = k.azar(42);
// Helechos de escarcha en el cristal, en coordenadas 0..1. Nacen una vez.
const HELECHOS = [];
for (let h = 0; h < 9; h++) {
  const segs = [];
  let u = 0.08 + azF() * 0.84, v = azF() * 0.08, ang = -0.9 + azF() * 1.8;
  const n = 14 + Math.floor(azF() * 6);
  for (let s = 0; s < n; s++) {
    const largo = 0.055 + azF() * 0.03;
    const u2 = Math.max(0.02, Math.min(0.98, u + Math.sin(ang) * largo));
    const v2 = Math.min(0.98, v + largo * (0.85 + azF() * 0.4));
    segs.push({ u, v, u2, v2, nace: s / n });
    if (s % 2 === 0 && s > 1) {
      const la = largo * 0.55, lado = s % 4 === 0 ? 1.1 : -1.1;
      segs.push({
        u: u2, v: v2,
        u2: Math.max(0.02, Math.min(0.98, u2 + Math.sin(ang + lado) * la)),
        v2: Math.min(0.98, v2 + la * 0.7),
        nace: Math.min(0.96, s / n + 0.05),
      });
    }
    u = u2; v = v2; ang += (azF() - 0.5) * 0.7;
    if (v > 0.96) break;
  }
  HELECHOS.push(segs);
}

// Estrellas altas, para la calle y para el desierto.
export const estrellasAltas = k.cielo(11, 90, [0, 30, 0], 180, 8);

export function velo(g, al = 0.62) {
  if (al <= 0.02) return;
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(5,8,16,${al})`);
  vg.addColorStop(0.55, `rgba(5,8,16,${al * 0.55})`);
  vg.addColorStop(1, "rgba(5,8,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 720);
}

export function proy(cam, pts, zmin = 0.2) {
  const pr = [];
  let zs = 0;
  for (const p of pts) {
    const q = k.proyecta(cam, p);
    if (!q || q.z < zmin) return null;
    pr.push(q);
    zs += q.z;
  }
  return { pr, z: zs / pts.length };
}

export function traza(g, pr) {
  g.beginPath();
  g.moveTo(pr[0].x, pr[0].y);
  for (let i = 1; i < pr.length; i++) g.lineTo(pr[i].x, pr[i].y);
  g.closePath();
}

function normalCara(pts) {
  const n = k.uni(k.cruz(k.res(pts[1], pts[0]), k.res(pts[2], pts[0])));
  const c = pts.reduce((s, p) => k.sum(s, p), [0, 0, 0]);
  const dentro = k.pto(n, k.res([c[0] / pts.length, c[1] / pts.length, c[2] / pts.length], [0, 0.75, 0]));
  return dentro < 0 ? k.por(n, -1) : n;
}

function hexMez(a, b, u) {
  const p = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const x = p(a), y = p(b), t = Math.max(0, Math.min(1, u));
  const n = (i) => Math.round(x[i] + (y[i] - x[i]) * t).toString(16).padStart(2, "0");
  return `#${n(0)}${n(1)}${n(2)}`;
}

export function pintura(calor, luz, spec = 0) {
  const base = hexMez("#1d6cb8", "#ff4c18", calor);
  const cuerpo = hexMez("#16325c", base, 0.62 + 0.38 * Math.max(0, Math.min(1, luz)));
  return spec > 0.04 ? hexMez(cuerpo, "#fff1dc", Math.min(0.18, spec)) : cuerpo;
}

const SOL = k.uni([-0.35, 0.85, -0.45]);

function luzDe(pts) {
  const n = normalCara(pts);
  const nd = Math.max(0, k.pto(n, SOL));
  const spec = Math.pow(Math.max(0, k.pto(n, k.uni([-0.2, 0.95, -0.25]))), 10);
  return { luz: 0.28 + 0.72 * nd, spec };
}

// El parabrisas, de abajo (junto al capó) a arriba (el techo).
const VIDRIO = [[-0.76, 0.84, -0.82], [0.76, 0.84, -0.82], [0.68, 1.3, -0.32], [-0.68, 1.3, -0.32]];

export function enVidrio(u, v) {
  const ab = k.mezV(VIDRIO[0], VIDRIO[1], u);
  const dc = k.mezV(VIDRIO[3], VIDRIO[2], u);
  return k.mezV(ab, dc, v);
}

function caja(min, max) {
  const [x0, y0, z0] = min, [x1, y1, z1] = max;
  const P = (x, y, z) => [x, y, z];
  return [
    [P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)],
    [P(x1, y0, z1), P(x0, y0, z1), P(x0, y1, z1), P(x1, y1, z1)],
    [P(x0, y0, z1), P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1)],
    [P(x1, y0, z0), P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0)],
    [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)],
    [P(x0, y0, z1), P(x1, y0, z1), P(x1, y0, z0), P(x0, y0, z0)],
  ];
}

const CARROCERIA = [
  ...caja([-0.88, 0.36, -1.9], [0.88, 0.82, 1.55]),
  [[-0.84, 0.82, -1.9], [0.84, 0.82, -1.9], [0.78, 0.86, -0.82], [-0.78, 0.86, -0.82]],
  [[-0.7, 1.3, -0.32], [0.7, 1.3, -0.32], [0.66, 1.32, 0.72], [-0.66, 1.32, 0.72]],
  [[-0.7, 0.86, 0.95], [0.7, 0.86, 0.95], [0.64, 1.28, 0.78], [-0.64, 1.28, 0.78]],
];

const CRISTALES = [
  VIDRIO,
  [[-0.88, 0.9, -0.2], [-0.88, 0.9, 0.62], [-0.7, 1.26, 0.5], [-0.72, 1.26, -0.12]],
  [[0.88, 0.9, 0.62], [0.88, 0.9, -0.2], [0.72, 1.26, -0.12], [0.7, 1.26, 0.5]],
  [[-0.58, 0.96, 0.9], [0.58, 0.96, 0.9], [0.52, 1.26, 0.76], [-0.52, 1.26, 0.76]],
];

const FARO_POS = [[-0.5, 0.56, -1.91], [0.5, 0.56, -1.91]];
const RUEDAS = [[-0.8, 0.32, -1.28], [0.8, 0.32, -1.28], [-0.8, 0.32, 1.05], [0.8, 0.32, 1.05]];

const ASIENTOS = [
  ...caja([-0.72, 0.48, 0.15], [-0.12, 0.72, 0.85]),
  ...caja([-0.68, 0.7, 0.45], [-0.16, 1.12, 0.78]),
  ...caja([0.12, 0.48, 0.15], [0.72, 0.72, 0.85]),
  ...caja([0.16, 0.7, 0.45], [0.68, 1.12, 0.78]),
  ...caja([-0.7, 0.55, -0.85], [0.7, 0.82, -0.35]),
];

export function cieloCalle(g, dia) {
  const u = Math.max(0, Math.min(1, dia));
  const g1 = g.createLinearGradient(0, 0, 0, 1500);
  g1.addColorStop(0, k.mezColor("#070814", "#8ec8f5", u));
  g1.addColorStop(0.42, k.mezColor("#1a2344", "#f2d7a4", u));
  g1.addColorStop(0.72, k.mezColor("#3a2748", "#f7b56a", u));
  g1.addColorStop(1, k.mezColor("#1a120e", "#e08a48", u));
  g.fillStyle = g1;
  g.fillRect(0, 0, 1080, 1920);
}

function suelo(g, cam, dia) {
  const cosas = [];
  for (let i = -4; i <= 6; i++) {
    const z0 = i * 1.4 - 0.2, z1 = z0 + 1.4;
    const tono = i % 2 === 0 ? "#241c18" : "#2c221c";
    const caliente = k.mezColor(tono, "#5a3018", dia * 0.35);
    const c = proy(cam, [[-6, 0, z0], [6, 0, z0], [6, 0, z1], [-6, 0, z1]], 1.05);
    if (c) cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = caliente; g.fill(); } });
    if (i % 2 === 0) {
      const r = proy(cam, [[-0.08, 0.01, z0 + 0.25], [0.08, 0.01, z0 + 0.25], [0.08, 0.01, z0 + 0.85], [-0.08, 0.01, z0 + 0.85]], 1.05);
      if (r) cosas.push({ z: r.z - 0.01, dibuja() { traza(g, r.pr); g.fillStyle = "#e6c56a"; g.fill(); } });
    }
  }
  for (let i = -3; i <= 5; i++) {
    const z0 = i * 1.5, z1 = z0 + 1.5;
    for (const [x0, x1] of [[-5.2, -1.7], [1.7, 5.2]]) {
      const c = proy(cam, [[x0, 0.02, z0], [x1, 0.02, z0], [x1, 0.02, z1], [x0, 0.02, z1]], 1.05);
      if (c) cosas.push({ z: c.z + 0.02, dibuja() { traza(g, c.pr); g.fillStyle = k.mezColor("#3e3834", "#6a4030", dia * 0.3); g.fill(); } });
    }
  }
  return cosas;
}

function edificio(g, cam, dia) {
  const cosas = [];
  const faces = caja([-5.4, 0, -1.2], [-2.35, 4.4, 3.2]);
  for (const pts of faces) {
    const L = luzDe(pts);
    const c = proy(cam, pts);
    if (!c) continue;
    const muro = hexMez(pintura(dia * 0.25, L.luz * 0.7, 0), "#2a3148", 0.45);
    cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = muro; g.fill(); } });
  }
  const ventana = [[-2.36, 1.7, 0.2], [-2.36, 1.7, 1.15], [-2.36, 2.7, 1.15], [-2.36, 2.7, 0.2]];
  const v = proy(cam, ventana);
  if (v) cosas.push({
    z: v.z - 0.02,
    dibuja() {
      traza(g, v.pr);
      g.fillStyle = k.mezColor("#ffb15a", "#fff1d2", 0.35);
      g.fill();
    },
  });
  return cosas;
}

function rueda(g, cam, centro, calor) {
  const p = k.proyecta(cam, centro);
  if (!p || p.z < 0.25) return null;
  const s = k.tamano(0.33, p.z);
  return {
    z: p.z,
    dibuja() {
      g.beginPath(); g.arc(p.x, p.y, s, 0, Math.PI * 2);
      g.fillStyle = "#141414"; g.fill();
      g.beginPath(); g.arc(p.x, p.y, s * 0.62, 0, Math.PI * 2);
      g.fillStyle = k.mezColor("#8d939c", "#e8d2c4", calor * 0.4); g.fill();
      g.beginPath(); g.arc(p.x, p.y, s * 0.18, 0, Math.PI * 2);
      g.fillStyle = "#2a2e34"; g.fill();
    },
  };
}

function termometro(g, cam, calorAire) {
  const x = 1.72, z = -0.15;
  const cosas = [];
  const poste = caja([x - 0.06, 0, z - 0.06], [x + 0.06, 1.85, z + 0.06]);
  for (const pts of poste) {
    const c = proy(cam, pts);
    if (!c) continue;
    cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = "#d7dde6"; g.fill(); } });
  }
  const alto = 0.78;
  const tubo = caja([x - 0.035, 0.28, z - 0.07], [x + 0.035, 0.28 + 1.15, z + 0.02]);
  for (const pts of tubo) {
    const c = proy(cam, pts);
    if (!c) continue;
    cosas.push({ z: c.z - 0.01, dibuja() { traza(g, c.pr); g.fillStyle = "rgba(214,236,248,0.35)"; g.fill(); } });
  }
  const col = caja([x - 0.02, 0.32, z - 0.08], [x + 0.02, 0.32 + alto, z + 0.01]);
  for (const pts of col) {
    const c = proy(cam, pts);
    if (!c) continue;
    cosas.push({ z: c.z - 0.02, dibuja() { traza(g, c.pr); g.fillStyle = "#ff3b3b"; g.fill(); } });
  }
  const bulbo = k.proyecta(cam, [x, 0.28, z]);
  if (bulbo) {
    const s = k.tamano(0.09, bulbo.z);
    cosas.push({
      z: bulbo.z - 0.03,
      dibuja() {
        g.beginPath(); g.arc(bulbo.x, bulbo.y, s, 0, Math.PI * 2);
        g.fillStyle = "#ff3b3b"; g.fill();
      },
    });
  }
  return cosas;
}

export function puntoTermometro(cam) {
  return k.proyecta(cam, [1.72, 1.62, -0.15]);
}

function escarcha(g, cam, cantidad) {
  if (cantidad <= 0.02) return;
  g.save();
  g.lineCap = "round";
  g.strokeStyle = "rgba(236,248,255,0.92)";
  g.shadowColor = "rgba(210,240,255,0.8)";
  g.shadowBlur = 8;
  for (const segs of HELECHOS) {
    for (const s of segs) {
      if (cantidad < s.nace) continue;
      const a = k.proyecta(cam, enVidrio(s.u, s.v));
      const b = k.proyecta(cam, enVidrio(s.u2, s.v2));
      if (!a || !b || a.z < 0.2 || b.z < 0.2) continue;
      const crece = Math.min(1, (cantidad - s.nace) / 0.08);
      const x = a.x + (b.x - a.x) * crece, y = a.y + (b.y - a.y) * crece;
      const grosor = Math.max(1.2, k.tamano(0.008, a.z));
      g.lineWidth = grosor;
      g.globalAlpha = 0.35 + 0.65 * Math.min(1, cantidad);
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(x, y); g.stroke();
    }
  }
  g.restore();
}

// calor 0 = hielo, 1 = brasa. escarcha 0..1. dia tiñe la calle.
export function calle(g, cam, { calor = 0, escarcha: hielo = 1, dia = 0, conTermometro = true, conCoche = true } = {}) {
  cieloCalle(g, dia);
  if (dia < 0.65) k.estrellas(g, cam, null, estrellasAltas, 1 - dia);
  const cosas = [...suelo(g, cam, dia), ...edificio(g, cam, dia)];
  if (conTermometro) cosas.push(...termometro(g, cam, 0));
  if (conCoche) {
    const solDia = dia > 0.4 ? k.uni([0.2, 0.9, -0.3]) : SOL;
    for (const pts of CARROCERIA) {
      const n = normalCara(pts);
      const nd = Math.max(0, k.pto(n, solDia));
      const spec = Math.pow(nd, 8) * (0.15 + calor * 0.45);
      const c = proy(cam, pts);
      if (!c) continue;
      const col = pintura(calor, 0.25 + 0.75 * nd, spec);
      cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = col; g.fill(); } });
    }
    for (const pts of ASIENTOS) {
      const c = proy(cam, pts);
      if (!c) continue;
      const col = k.mezColor("#3a2428", "#ff6a32", calor * 0.85);
      cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = col; g.fill(); } });
    }
    for (const centro of RUEDAS) {
      const r = rueda(g, cam, centro, calor);
      if (r) cosas.push(r);
    }
    cosas.push(...faros(g, cam, calor));
    for (const pts of CRISTALES) {
      const c = proy(cam, pts);
      if (!c) continue;
      const leche = hielo * 0.82;
      cosas.push({
        z: c.z - 0.03,
        dibuja() {
          traza(g, c.pr);
          g.fillStyle = k.mezColor("#163044", "#ffd0b0", calor * 0.55);
          g.globalAlpha = 0.28 + calor * 0.15;
          g.fill();
          g.globalAlpha = 1;
          if (leche > 0.02) {
            traza(g, c.pr);
            g.fillStyle = `rgba(214, 236, 248, ${0.25 + leche * 0.6})`;
            g.fill();
          }
          traza(g, c.pr);
          g.strokeStyle = "rgba(255,255,255,0.35)";
          g.lineWidth = 2;
          g.stroke();
        },
      });
    }
  }
  k.deLejosACerca(cosas);
  if (conCoche && hielo > 0.02) escarcha(g, cam, hielo);
  if (conCoche && calor > 0.08) {
    const centro = k.proyecta(cam, [0, 0.9, -0.2]);
    if (centro && centro.z > 0.4 && centro.z < 8) {
      k.brillo(g, centro.x, centro.y, k.tamano(1.3, centro.z), "fuego", Math.min(0.55, calor * 0.45));
    }
  }
  // la ventana del edificio, un poco de luz caliente en el suelo de la noche
  if (dia < 0.4) {
    const w = k.proyecta(cam, [-2.36, 2.2, 0.7]);
    if (w && w.z > 1 && w.z < 14) k.brillo(g, w.x, w.y, 180, "naranja", 0.35);
  }
}

function faros(g, cam, calor) {
  const cosas = [];
  for (const centro of FARO_POS) {
    const p = k.proyecta(cam, centro);
    if (!p || p.z < 0.3 || p.z > 12) continue;
    const s = Math.min(42, k.tamano(0.07, p.z));
    cosas.push({
      z: p.z - 0.05,
      dibuja() {
        g.beginPath(); g.arc(p.x, p.y, s, 0, Math.PI * 2);
        g.fillStyle = calor > 0.45 ? "#fff0dc" : "#f4f8ff";
        g.fill();
      },
    });
  }
  return cosas;
}

export function faroles(g, cam) {
  for (const centro of FARO_POS) {
    const c = k.proyecta(cam, centro);
    if (!c || c.z < 0.4 || c.z > 9) continue;
    k.brillo(g, c.x, c.y, Math.min(70, k.tamano(0.12, c.z)), "blanca", 0.4);
  }
}

// Bocanadas cortas que suben del cristal. u recorre 0..1; no son rayos largos.
export function bocanadas(g, cam, t, t0, t1, suben = true) {
  const u = k.tramo(t, t0, t1);
  if (u <= 0 || u >= 1) return;
  for (let i = 0; i < 6; i++) {
    const p = (u * 1.15 + i / 6) % 1;
    const al = Math.sin(p * Math.PI) * (1 - k.suave(k.tramo(u, 0.72, 1)));
    if (al <= 0.02) continue;
    const uu = 0.18 + (i % 3) * 0.28;
    const vv = suben ? p * 0.9 : 1 - p * 0.9;
    const q = k.proyecta(cam, enVidrio(uu, Math.max(0.05, Math.min(0.95, vv))));
    if (!q) continue;
    const alto = k.proyecta(cam, k.sum(enVidrio(uu, vv), [0, suben ? 0.35 + p * 0.5 : -(0.2 + p * 0.3), 0]));
    if (!alto) continue;
    k.brillo(g, alto.x, alto.y, 140 + p * 80, suben ? "cian" : "naranja", al * 0.7);
  }
}

const azD = k.azar(19);
const DUNAS = Array.from({ length: 5 }, (_, i) => ({
  x: (i - 2) * 2.4 + (azD() - 0.5),
  z: 1.5 + azD() * 3,
  r: 1.4 + azD() * 1.2,
}));

export function desierto(g, cam, hielo) {
  k.fondo(g, cam, 1);
  k.estrellas(g, cam, null, estrellasAltas, 1.15);
  const cosas = [];
  for (const d of DUNAS) {
    const c = proy(cam, [
      [d.x - d.r, 0, d.z],
      [d.x, 0.55 + d.r * 0.15, d.z - 0.2],
      [d.x + d.r, 0, d.z],
      [d.x, 0.15, d.z + d.r * 0.6],
    ]);
    if (!c) continue;
    cosas.push({
      z: c.z,
      dibuja() {
        traza(g, c.pr);
        g.fillStyle = "#c47a45";
        g.fill();
      },
    });
  }
  const sueloD = proy(cam, [[-8, 0, -1], [8, 0, -1], [8, 0, 8], [-8, 0, 8]]);
  if (sueloD) cosas.push({
    z: sueloD.z + 0.4,
    dibuja() { traza(g, sueloD.pr); g.fillStyle = "#a8643a"; g.fill(); },
  });
  // la bandeja, baja y ancha
  const bandeja = [
    [-0.85, 0.42, -0.15], [0.85, 0.42, -0.15], [0.85, 0.42, 1.15], [-0.85, 0.42, 1.15],
  ];
  const borde = [
    [-0.95, 0.38, -0.25], [0.95, 0.38, -0.25], [0.95, 0.5, -0.25], [-0.95, 0.5, -0.25],
    [0.95, 0.38, 1.25], [-0.95, 0.38, 1.25], [-0.95, 0.5, 1.25], [0.95, 0.5, 1.25],
    [-0.95, 0.38, 1.25], [-0.95, 0.38, -0.25], [-0.95, 0.5, -0.25], [-0.95, 0.5, 1.25],
    [0.95, 0.38, -0.25], [0.95, 0.38, 1.25], [0.95, 0.5, 1.25], [0.95, 0.5, -0.25],
  ];
  for (let i = 0; i < borde.length; i += 4) {
    const c = proy(cam, borde.slice(i, i + 4));
    if (!c) continue;
    cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = "#8a5a32"; g.fill(); g.strokeStyle = "#e6b07a"; g.lineWidth = 3; g.stroke(); } });
  }
  const agua = proy(cam, bandeja);
  if (agua) cosas.push({
    z: agua.z - 0.02,
    dibuja() {
      traza(g, agua.pr);
      g.fillStyle = hielo > 0.85 ? "#e7f4ff" : "#1f6f8a";
      g.fill();
      if (hielo > 0.02 && hielo < 0.97) {
        g.save();
        traza(g, agua.pr);
        g.clip();
        const cx = (agua.pr[0].x + agua.pr[1].x + agua.pr[2].x + agua.pr[3].x) / 4;
        const cy = (agua.pr[0].y + agua.pr[1].y + agua.pr[2].y + agua.pr[3].y) / 4;
        const rx = Math.hypot(agua.pr[1].x - agua.pr[0].x, agua.pr[1].y - agua.pr[0].y) / 2;
        const ry = Math.hypot(agua.pr[3].x - agua.pr[0].x, agua.pr[3].y - agua.pr[0].y) / 2;
        g.beginPath();
        g.rect(cx - rx * 2, cy - ry * 2, rx * 4, ry * 4);
        g.arc(cx, cy, Math.max(rx, ry) * (1.05 - hielo), 0, Math.PI * 2);
        g.fillStyle = "rgba(232,246,255,0.95)";
        g.fill("evenodd");
        g.restore();
      }
    },
  });
  k.deLejosACerca(cosas);
  // luna baja, cálida, para que el desierto no sea un esquema
  const luna = k.proyecta(cam, [2.2, 6.5, 3]);
  if (luna) k.brillo(g, luna.x, luna.y, 220, "amarilla", 0.4);
}

export function bajoTejado(g, cam, { rebote = 0, intento = 0 } = {}) {
  cieloCalle(g, 0);
  k.estrellas(g, cam, null, estrellasAltas, 0.8);
  const cosas = [...suelo(g, cam, 0)];
  // el tejado, una losa gruesa encima del coche
  const losa = caja([-2.4, 2.15, -2.4], [2.4, 2.45, 2.3]);
  for (const pts of losa) {
    const L = luzDe(pts);
    const c = proy(cam, pts);
    if (!c) continue;
    const col = k.mezColor("#6a3d32", "#ffb080", rebote * 0.55 * (0.4 + L.luz));
    cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = col; g.fill(); } });
  }
  // pilares
  for (const px of [-2.05, 2.05]) {
    for (const pts of caja([px - 0.12, 0, 1.9], [px + 0.12, 2.2, 2.14])) {
      const c = proy(cam, pts);
      if (!c) continue;
      cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = "#d7c4b2"; g.fill(); } });
    }
  }
  k.deLejosACerca(cosas);
  calleEncima(g, cam, { calor: 0, escarcha: intento, dia: 0, conTermometro: false });
  if (rebote > 0.05) {
    const techo = k.proyecta(cam, [0, 2.2, -0.2]);
    const cristal = k.proyecta(cam, [0, 1.15, -0.7]);
    if (techo) k.brillo(g, techo.x, techo.y, 200, "naranja", rebote * 0.4);
    if (cristal) k.brillo(g, cristal.x, cristal.y, 120, "naranja", rebote * 0.28);
  }
}

// El coche solo, sin redibujar el cielo (para ponerlo bajo el tejado).
function calleEncima(g, cam, opt) {
  const prev = cosasSoloCoche(g, cam, opt);
  k.deLejosACerca(prev);
  if (opt.escarcha > 0.02) escarcha(g, cam, opt.escarcha);
}

function cosasSoloCoche(g, cam, { calor = 0, escarcha: hielo = 0 }) {
  const cosas = [];
  for (const pts of CARROCERIA) {
    const n = normalCara(pts);
    const nd = Math.max(0, k.pto(n, SOL));
    const c = proy(cam, pts);
    if (!c) continue;
    cosas.push({ z: c.z, dibuja() { traza(g, c.pr); g.fillStyle = pintura(calor, 0.3 + 0.7 * nd, Math.pow(nd, 8) * 0.2); g.fill(); } });
  }
  for (const centro of RUEDAS) {
    const r = rueda(g, cam, centro, calor);
    if (r) cosas.push(r);
  }
  for (const pts of CRISTALES) {
    const c = proy(cam, pts);
    if (!c) continue;
    cosas.push({
      z: c.z - 0.03,
      dibuja() {
        traza(g, c.pr);
        g.fillStyle = `rgba(18, 40, 58, ${0.35})`;
        g.fill();
        if (hielo > 0.02) { traza(g, c.pr); g.fillStyle = `rgba(214,236,248,${hielo * 0.7})`; g.fill(); }
        traza(g, c.pr); g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 2; g.stroke();
      },
    });
  }
  cosas.push(...faros(g, cam, calor));
  return cosas;
}

const azV = k.azar(23);
const VIENTOS = Array.from({ length: 7 }, () => ({
  y: 0.6 + azV() * 0.9,
  z: -0.4 + azV() * 0.6,
  fase: azV(),
}));

export function cintasDeAire(g, cam, t, t0, t1) {
  const u = k.tramo(t, t0, t1);
  if (u <= 0 || u >= 1) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  for (const v of VIENTOS) {
    const x = -3.2 + (u * 1.3 + v.fase) % 1 * 6.4;
    const a = k.proyecta(cam, [x - 0.8, v.y, v.z]);
    const b = k.proyecta(cam, [x + 0.7, v.y + 0.12, v.z + 0.15]);
    if (!a || !b) continue;
    const al = Math.sin(Math.min(1, (u + v.fase) % 1) * Math.PI) * 0.45;
    g.strokeStyle = `rgba(186, 230, 255, ${al})`;
    g.lineWidth = Math.min(16, Math.max(4, k.tamano(0.035, a.z)));
    g.beginPath(); g.moveTo(a.x, a.y); g.quadraticCurveTo((a.x + b.x) / 2, a.y - 30, b.x, b.y); g.stroke();
  }
  g.restore();
}

// El volante, grande, cuando la cámara está dentro.
export function volante(g, cam, calor) {
  const c = k.proyecta(cam, [-0.32, 0.98, -0.55]);
  if (!c || c.z < 0.2 || c.z > 3.2) return null;
  const s = k.tamano(0.18, c.z);
  g.save();
  g.lineWidth = Math.max(10, s * 0.28);
  g.strokeStyle = k.mezColor("#2a2428", "#ff5a28", calor);
  g.beginPath(); g.arc(c.x, c.y, s, 0, Math.PI * 2); g.stroke();
  g.fillStyle = k.mezColor("#3a3034", "#ff7840", calor);
  g.beginPath(); g.arc(c.x, c.y, s * 0.28, 0, Math.PI * 2); g.fill();
  if (calor > 0.4) k.brillo(g, c.x, c.y, s * 3.2, "fuego", (calor - 0.4) * 0.7);
  g.restore();
  return c;
}

export function camFinal(t) {
  const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
  return k.ruta([
    [f7.t("sopla"), { pos: [-1.55, 0.95, -3.05], mira: [0.12, 0.78, 0.1] }],
    [f7.t("abriga"), { pos: [-0.55, 1.02, -2.35], mira: [0.15, 0.9, -0.15] }],
    [f8.t("dia"), { pos: [-1.35, 1.05, -3.2], mira: [0.05, 0.85, 0.05] }],
    [f8.t("habitaculo"), { pos: [0.12, 1.02, -1.55], mira: [0.0, 0.95, 0.15] }],
    [f9.t("bandazos"), { pos: [-1.4, 0.98, -3.0], mira: [0.25, 0.8, 0.1] }],
    [f10.t("hielo"), { pos: [0.02, 1.08, -1.2], mira: [0.0, 1.1, -0.4] }],
    [f10.t("volante"), { pos: [-0.2, 0.98, -0.95], mira: [-0.32, 0.98, -0.45] }],
    [53.05, { pos: [0.0, 1.1, -1.06], mira: [0.0, 1.12, -0.38] }],
  ])(t);
}

export function estadoFinal(t) {
  const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
  if (t < f7.t("abriga")) {
    const u = k.suave(k.tramo(t, f7.t("sopla"), f7.t("abriga")));
    return { calor: 0, escarcha: 0.8 * (1 - u) + 0.05, dia: 0 };
  }
  if (t < f8.t("dia")) return { calor: 0, escarcha: 0.04, dia: 0 };
  if (t < f8.t("extremo")) {
    return {
      dia: k.suave(k.tramo(t, f8.t("dia"), f8.t("sol") + 0.35)),
      calor: k.suave(k.tramo(t, f8.t("entra"), f8.t("extremo"))),
      escarcha: 0,
    };
  }
  if (t < f9.t("bandazos")) return { calor: 1, escarcha: 0, dia: 1 };
  const u = k.suave(k.tramo(t, f9.t("bandazos"), f9.t("aparcado")));
  if (t < f9.fin - 0.05) return { calor: 1 - u, escarcha: u, dia: 1 - u };
  return { calor: 0, escarcha: 1, dia: 0 };
}

// El tramo de la calle (día, remate y cierre) se dibuja igual, para que un «sigue» no salte.
export function calleDelFinal(g, t) {
  const c = camFinal(t);
  const e = estadoFinal(t);
  const termo = e.dia < 0.45;
  calle(g, c, { ...e, conTermometro: termo });
  solEnElCielo(g, c, e.dia * 0.85);
  if (e.dia < 0.3) faroles(g, c);
  if (termo) {
    const p = puntoTermometro(c);
    if (p) k.pastilla(g, Math.max(240, Math.min(800, p.x)), Math.max(700, Math.min(1180, p.y)), "+2", "°C", "255,90,90", Math.min(1, (0.45 - e.dia) / 0.45), 78);
  }
  velo(g, 0.4 + e.escarcha * 0.15);
  return c;
}

export function solEnElCielo(g, cam, al) {
  if (al < 0.03) return;
  const p = k.proyecta(cam, [0.6, 5.2, -2.4]);
  if (!p || p.z < 0.3) return;
  g.save();
  g.globalAlpha = Math.min(1, al);
  const r = Math.min(160, k.tamano(0.7, p.z));
  const gr = g.createRadialGradient(p.x, p.y, r * 0.1, p.x, p.y, r);
  gr.addColorStop(0, "#fff4cc");
  gr.addColorStop(0.45, "rgba(255,186,70,0.9)");
  gr.addColorStop(1, "rgba(255,150,40,0)");
  g.fillStyle = gr;
  g.beginPath(); g.arc(p.x, p.y, r, 0, Math.PI * 2); g.fill();
  g.restore();
}

export function mano(g, x, y, tam, ang, al = 1) {
  if (al <= 0.02) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.globalAlpha = al;
  g.fillStyle = "#f0b89a";
  k.redondo(g, -tam * 0.28, -tam * 0.15, tam * 0.7, tam * 0.42, tam * 0.16);
  g.fill();
  for (let i = 0; i < 4; i++) {
    k.redondo(g, -tam * 0.22 + i * tam * 0.16, -tam * 0.48, tam * 0.13, tam * 0.4, tam * 0.06);
    g.fillStyle = i === 0 ? "#e8a88a" : "#f2c0a4";
    g.fill();
  }
  g.fillStyle = "#e7a88c";
  k.redondo(g, -tam * 0.42, -tam * 0.05, tam * 0.16, tam * 0.28, tam * 0.08);
  g.fill();
  g.restore();
}

export function rasqueta(g, x, y, tam, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.fillStyle = "#f4f1ea";
  k.redondo(g, -tam * 0.08, -tam * 0.55, tam * 0.16, tam * 0.7, tam * 0.06);
  g.fill();
  g.fillStyle = "#67d4c5";
  k.redondo(g, -tam * 0.34, -tam * 0.18, tam * 0.68, tam * 0.22, 8);
  g.fill();
  g.restore();
}
