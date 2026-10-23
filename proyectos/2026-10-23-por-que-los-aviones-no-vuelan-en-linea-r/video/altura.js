// «Pero hay más: a diez kilómetros de altura corre un río de viento. Hacia el este, los aviones se suben a él para que
// los empuje, y a la vuelta lo esquivan.»
// Un cielo visto de lado: la cámara sube desde las nubes, pasa el Everest y llega a los diez kilómetros, donde corre el
// río de viento; un avión rumbo al este se mete en él y sale disparado; otro, de vuelta, choca con él y baja a esquivarlo.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaAvion, deLado, rotX, rotZ, mul } from "./avion.js";

const { suave, tramo, mez, claves, azar, lienzo } = k;
const lim = (x, a, b) => Math.max(a, Math.min(b, x));

export const T0 = v.frase(9).inicio, T1 = v.frase(10).inicio, TF = v.frase(11).inicio;
const Tdiez = v.frase(9).t("diez"), Triio = v.frase(9).t("rio"), Tsuben = v.frase(10).t("suben"), Tempuje = v.frase(10).t("empuje");
const Tvuelta = v.frase(10).t("vuelta"), Tesquivan = v.frase(10).t("esquivan");

const PX = 150;                       // píxeles por kilómetro de altura
const SUBE0 = T0, SUBE1 = Tdiez + 1.2; // cuándo sube la cámara
export const alturaCam = (t) => mez(3.0, 10.0, suave(tramo(t, SUBE0, SUBE1)));
const yDe = (A, Ac, par = 1) => 1000 - (A - Ac) * PX * par;

// ---------------------------------------------------------------- el cielo
const CIELO = [[0, [160, 222, 255]], [3, [104, 176, 248]], [6, [46, 108, 222]], [10, [18, 54, 160]], [14, [8, 26, 100]], [20, [3, 8, 46]]];
const colorCielo = (A) => {
  for (let i = 0; i < CIELO.length - 1; i++) if (A <= CIELO[i + 1][0]) { const u = (A - CIELO[i][0]) / (CIELO[i + 1][0] - CIELO[i][0]); return CIELO[i][1].map((c, j) => Math.round(mez(c, CIELO[i + 1][1][j], Math.max(0, u)))); }
  return CIELO[CIELO.length - 1][1];
};

// ---------------------------------------------------------------- las nubes (sprites hechos una vez)
function nube(sem, W, H) {
  const az = azar(sem), l = lienzo(W, H), c = l.getContext("2d");
  const puffs = [];
  const n = 16;
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n, cx = W * (0.12 + 0.76 * u), arco = Math.sin(Math.PI * u);
    puffs.push({ x: cx + (az() - 0.5) * W * 0.08, y: H * 0.62 - arco * H * (0.18 + 0.28 * az()), r: H * (0.14 + 0.2 * az()) * (0.6 + 0.6 * arco) });
  }
  for (let i = 0; i < 7; i++) puffs.push({ x: W * (0.2 + 0.6 * az()), y: H * (0.42 + 0.12 * az()), r: H * (0.22 + 0.15 * az()) });
  c.save();
  // la sombra azulada de abajo
  for (const p of puffs) {
    const gr = c.createRadialGradient(p.x, p.y + p.r * 0.3, 0, p.x, p.y + p.r * 0.3, p.r * 1.2);
    gr.addColorStop(0, "rgba(120,150,210,0.9)"); gr.addColorStop(1, "rgba(120,150,210,0)");
    c.fillStyle = gr; c.beginPath(); c.arc(p.x, p.y + p.r * 0.3, p.r * 1.2, 0, 6.2832); c.fill();
  }
  // y la luz de arriba a la izquierda
  for (const p of puffs) {
    const gr = c.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.35, 0, p.x, p.y, p.r * 1.05);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.55, "rgba(246,250,255,0.95)"); gr.addColorStop(1, "rgba(225,236,255,0)");
    c.fillStyle = gr; c.beginPath(); c.arc(p.x, p.y, p.r * 1.05, 0, 6.2832); c.fill();
  }
  c.restore();
  // la base, que se funde en el aire
  c.globalCompositeOperation = "destination-in";
  const fm = c.createLinearGradient(0, H * 0.56, 0, H * 0.84);
  fm.addColorStop(0, "rgba(0,0,0,1)"); fm.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = fm; c.fillRect(0, 0, W, H);
  return l;
}
const NUBES = [nube(3, 700, 300), nube(8, 800, 320), nube(15, 640, 280), nube(22, 760, 300)];
const azn = azar(404);
const CAPAS = [];
// far (parallax 0.7), mid (1), near (1.45)
for (const [par, n, a0, a1, esc, al] of [[0.7, 9, 1.0, 5.5, 0.75, 0.75], [1.0, 9, 1.5, 6.5, 1.1, 0.95], [1.45, 6, 0.4, 3.0, 1.9, 1.0]]) {
  for (let i = 0; i < n; i++) CAPAS.push({ par, x: azn() * 1500 - 200, A: a0 + (a1 - a0) * azn(), esc: esc * (0.8 + 0.5 * azn()), sprite: NUBES[Math.floor(azn() * NUBES.length)], al, vel: 8 + 24 * par * azn(), flip: azn() > 0.5 });
}
CAPAS.sort((a, b) => a.par - b.par);

// ---------------------------------------------------------------- el Everest
function dibujaEverest(g, Ac) {
  const base = yDe(0, Ac), cx = 640;
  const P = [[-520, 0], [-340, 1.6], [-190, 3.8], [-80, 5.6], [0, 7.2], [60, 8.2], [110, 8.85], [160, 8.0], [230, 7.3], [330, 5.4], [470, 3.2], [640, 1.4], [880, 0]];
  const pt = (q) => [cx + q[0] * 1.9, yDe(q[1], Ac)];
  const cima = pt([110, 8.85]);
  if (cima[1] > 2100 || base < -200) return;
  g.save();
  g.beginPath(); P.forEach((q, i) => { const p = pt(q); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
  g.lineTo(cx + 880 * 1.9, base + 400); g.lineTo(cx - 520 * 1.9, base + 400); g.closePath();
  const gr = g.createLinearGradient(cx - 600, cima[1], cx + 800, base);
  gr.addColorStop(0, "#c9d6ee"); gr.addColorStop(0.28, "#8da2c9"); gr.addColorStop(0.62, "#56688f"); gr.addColorStop(1, "#2f3c61");
  g.fillStyle = gr; g.fill();
  g.clip();
  // la nieve arriba, con el borde roto
  g.beginPath();
  const nieve = [[-210, 5.7], [-150, 6.4], [-90, 6.0], [-20, 6.8], [40, 6.2], [90, 6.8], [150, 6.3], [210, 6.9], [270, 6.2], [330, 6.7], [400, 6.0]];
  g.moveTo(cx - 400, yDe(10, Ac)); g.lineTo(cx + 800, yDe(10, Ac)); g.lineTo(cx + 800, yDe(6.1, Ac));
  nieve.slice().reverse().forEach((q) => g.lineTo(cx + q[0] * 1.9, yDe(q[1], Ac)));
  g.lineTo(cx - 200 * 1.9, yDe(5.9, Ac)); g.closePath();
  const ng = g.createLinearGradient(cx - 200, 0, cx + 300, 0);
  ng.addColorStop(0, "#ffffff"); ng.addColorStop(0.6, "#f1f6ff"); ng.addColorStop(1, "#b9c8e6");
  g.fillStyle = ng; g.fill();
  // la cara en sombra, a la derecha de la cima
  g.beginPath(); g.moveTo(cx + 110 * 1.9, yDe(8.85, Ac)); P.slice(7).forEach((q) => g.lineTo(cx + q[0] * 1.9, yDe(q[1], Ac))); g.lineTo(cx + 880 * 1.9, base + 400); g.lineTo(cx + 150 * 1.9, base + 400); g.closePath();
  g.fillStyle = "rgba(20,30,70,0.34)"; g.fill();
  g.restore();
}

// ---------------------------------------------------------------- el río de viento
const az2 = azar(909), HEB = [];
for (let i = 0; i < 130; i++) HEB.push({ d: ((az2() + az2() + az2()) / 3 - 0.5) * 2 * 175, x0: az2() * 1700, v: 700 + 900 * az2(), larga: 200 + 380 * az2(), w: 3.5 + 6.5 * az2(), t0: az2(), c: az2() });
const cuerdaBanda = (x, t, yb) => yb + 26 * Math.sin(x / 190 + t * 0.8) + 18 * Math.sin(x / 430 - t * 0.5);

function rio(g, t, Ac, formado, tiraDe = 0) {
  const yb = yDe(10.6, Ac);
  if (formado <= 0.003) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round"; g.lineJoin = "round";
  // el halo de la banda
  const xs = []; for (let x = -80; x <= 1160; x += 40) xs.push(x);
  for (const [ancho, a, col] of [[420, 0.07, "120,190,255"], [270, 0.1, "150,215,255"], [130, 0.14, "200,235,255"]]) {
    g.beginPath(); xs.forEach((x, i) => { const y = cuerdaBanda(x, t, yb); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
    g.strokeStyle = `rgba(${col},${a * formado})`; g.lineWidth = ancho; g.stroke();
  }
  for (const H of HEB) {
    const a0 = tramo(formado, H.t0 * 0.75, H.t0 * 0.75 + 0.25);
    if (a0 <= 0.01) continue;
    const W = 1080 + 700, xh = ((H.x0 + H.v * t) % W) - 350;
    const caliente = 1 - Math.min(1, Math.abs(H.d) / 175);
    const M = 14;
    let prev = null;
    for (let j = 0; j <= M; j++) {
      const x = xh - (H.larga * j) / M, y = cuerdaBanda(x, t, yb) + H.d * (0.85 + 0.15 * Math.sin(x / 300 + H.c * 6));
      if (prev) {
        const colr = [Math.round(mez(170, 255, caliente)), Math.round(mez(230, 220, caliente)), Math.round(mez(255, 140, caliente))];
        g.strokeStyle = `rgba(${colr},${a0 * Math.pow(1 - j / M, 1.5) * (0.3 + 0.7 * caliente)})`;
        g.lineWidth = H.w * (0.45 + 0.75 * (1 - j / M));
        g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(x, y); g.stroke();
      }
      prev = [x, y];
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- los dos aviones
export const yBanda = (t) => yDe(10.6, alturaCam(t)) + 26 * Math.sin(500 / 190 + t * 0.8);
function avion(g, x, y, tam, hacia, cabeceo, alabeo, al = 1) {
  const R = deLado(hacia, 0.42, cabeceo, alabeo);
  dibujaAvion(g, x, y, tam, R, { al, luz: [-0.5, 0.75, 0.6] });
}
// el que va al este: entra por la izquierda debajo del río, sube, se mete y sale disparado
const xE = claves([[T1 - 0.1, -360], [Tsuben - 0.1, 330], [Tsuben + 0.7, 380]]);
const velE = (t) => mez(0, 1900, Math.pow(suave(tramo(t, Tsuben + 0.5, Tempuje + 1.15)), 1.5));
// el que viene de vuelta
const Tfrenado = Tvuelta + 0.2;

export function escenaAltura(g, t) {
  const Ac = alturaCam(t);
  // el cielo, según la altura
  const sg = g.createLinearGradient(0, 0, 0, 1920);
  for (let i = 0; i <= 6; i++) { const y = (i / 6) * 1920, A = Ac + (1000 - y) / PX, c = colorCielo(A); sg.addColorStop(i / 6, `rgb(${c})`); }
  g.fillStyle = sg; g.fillRect(0, 0, 1080, 1920);
  // el Sol, a lo lejos y arriba a la derecha
  k.brillo(g, 880, 360, 1000, "amarilla", 0.5);
  k.brillo(g, 880, 360, 360, "blanca", 0.7);

  // el suelo, muy abajo
  const ysuelo = yDe(0, Ac);
  if (ysuelo < 2000) {
    const gg = g.createLinearGradient(0, ysuelo, 0, ysuelo + 400);
    gg.addColorStop(0, "#2f9a6a"); gg.addColorStop(1, "#14583f");
    g.fillStyle = gg; g.fillRect(0, ysuelo, 1080, 2000 - ysuelo);
  }
  const lejos = CAPAS.filter((c) => c.par < 1), medio = CAPAS.filter((c) => c.par === 1), cerca = CAPAS.filter((c) => c.par > 1);
  const pinta = (lista) => {
    for (const c of lista) {
      const w = c.sprite.width * c.esc, h = c.sprite.height * c.esc;
      const W = 1080 + w, x = (((c.x - c.vel * t) % W) + W) % W - w * 0.5 - 0;
      const y = yDe(c.A, Ac, c.par) - h * 0.7;
      if (y > 1980 || y + h < -40) continue;
      g.save(); g.globalAlpha = c.al;
      if (c.flip) { g.translate(x + w, y); g.scale(-1, 1); g.drawImage(c.sprite, 0, 0, w, h); } else g.drawImage(c.sprite, x, y, w, h);
      g.restore();
    }
  };
  pinta(lejos);
  dibujaEverest(g, Ac);
  pinta(medio);

  // el río de viento
  const formado = suave(tramo(t, Triio - 0.25, Triio + 1.2));
  rio(g, t, Ac, formado);

  // los aviones
  const yb = yDe(10.6, Ac);
  if (t > T1 - 0.2) {
    // hacia el este
    const dE = velE(t);
    const x = xE(Math.min(t, Tsuben + 0.7)) + dE;
    const sube = suave(tramo(t, Tsuben - 0.05, Tsuben + 0.75));
    const y = mez(yb + 235, yb + 8, sube) + 6 * Math.sin(t * 2.4);
    const cab = 0.17 * Math.sin(Math.PI * sube) + 0.03;
    // las rayas de velocidad detrás
    if (dE > 40) {
      g.save(); g.globalCompositeOperation = "lighter";
      const az3 = azar(5); for (let i = 0; i < 12; i++) { const yy = y + (az3() - 0.5) * 110, l = 160 + 420 * az3() * Math.min(1, dE / 900); g.strokeStyle = `rgba(255,236,190,${0.35 * Math.min(1, dE / 600)})`; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 190 - az3() * 80, yy); g.lineTo(x - 190 - l, yy); g.stroke(); }
      g.restore();
    }
    if (x < 1700) avion(g, x, y, 560, 1, cab, 0.02);
  }
  if (t > Tvuelta - 0.55) {
    // de vuelta: choca con el río (se frena y se sacude) y baja a esquivarlo
    const u1 = suave(tramo(t, Tvuelta - 0.5, Tvuelta + 0.75));                // entra por la derecha y se frena
    const u2 = suave(tramo(t, Tesquivan - 0.2, Tesquivan + 0.6));              // baja
    const u3 = Math.pow(suave(tramo(t, Tesquivan + 0.3, Tesquivan + 0.95)), 1.3); // y se va
    const x = mez(1700, 820, u1) - 1600 * u3;
    const sacude = (1 - u2) * u1 * 7 * Math.sin(t * 26);
    const y = mez(yb + 10, yb + 250, u2) + sacude + 5 * Math.sin(t * 2.1);
    if (x > -600) avion(g, x, y, 560, -1, 0.12 * u2 - 0.02, -0.2 * Math.sin(Math.PI * u2));
  }

  // el contador de altura
  if (t < Tsuben + 0.2) {
    const val = Ac, a = suave(tramo(t, T0 + 0.05, T0 + 0.25)) * (1 - suave(tramo(t, T1 - 0.45, T1 - 0.1)));
    k.pastilla(g, 330, 1250, k.fmt(val, val >= 9.99 ? 0 : 1), "km", "255,255,255", a, 100);
  }
  // un velo suave arriba (subtítulo)
  const vg = g.createLinearGradient(0, 0, 0, 640);
  vg.addColorStop(0, "rgba(2,10,40,0.45)"); vg.addColorStop(1, "rgba(2,10,40,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}
