// «Ya nos gana al ajedrez desde 1997, y al go desde 2016. Pero aquellas máquinas solo sabían hacer eso:»
// Un tablero bajo un foco, en la oscuridad. Corte en «Ya».
// - «Ya nos gana»: una partida a punto de acabar; la cámara gira despacio. «ajedrez»: la dama negra avanza y el rey
//   blanco cae; «1997».
// - «y al go»: las piezas se hunden, las casillas se vuelven la madera del go con su rejilla y caen piedras negras y
//   blancas que rodean a las blancas; «2016».
// - «Pero aquellas máquinas»: la cámara sube y se aleja: el tablero se queda solo, una isla bajo su foco.
//   «solo sabían hacer eso»: el foco se cierra sobre él. Reposa antes del corte a la cocina.
import * as k from "#kit";
import { v } from "#voz";
import { poligono, rey, traza, velo } from "../mundo.js";

export const desde = "ya";

const { suave, tramo, F } = k;
const f2 = v.frase(2), f3 = v.frase(3);
const T0 = f2.inicio, Taje = f2.t("ajedrez"), T97 = f2.t("1997"), Ty = f2.t("y"), Tgo = f2.t("go"), T16 = f2.t("2016");
const Tpero = f3.inicio, Tsolo = f3.t("solo"), Teso = f3.t("eso"), Tfin = f3.t("la");

const camara = k.ruta([
  [T0 - 0.1, { pos: k.orbita(-0.55, 5.6, 3.6), mira: [0.3, 0.5, -0.3] }],
  [Ty, { pos: k.orbita(-0.3, 5.2, 3.4), mira: [0.4, 0.45, 0] }],
  [Tgo + 0.2, { pos: k.orbita(-0.15, 8.6, 7.4), mira: [0, -0.3, 0] }],
  [Tpero, { pos: k.orbita(0.05, 9.4, 8.6), mira: [0, -0.3, 0] }],
  [Teso, { pos: k.orbita(0.15, 24, 20), mira: [0, -0.6, 0] }],
  [Tfin, { pos: k.orbita(0.16, 24.3, 20.2), mira: [0, -0.6, 0] }],
]);

const go = (t) => suave(tramo(t, Ty, Tgo));
const az = k.azar(1616);
// las piedras del go: un grupo blanco en el centro y las negras que lo rodean, y algunas sueltas
const PASO = 8 / 18, enRej = (i, j) => [-4 + i * PASO, 0, -4 + j * PASO];
const PIEDRAS = (() => {
  const l = [], usado = new Set(), pon = (i, j, blanca) => { const c = i + "," + j; if (usado.has(c) || i < 0 || j < 0 || i > 18 || j > 18) return; usado.add(c); l.push({ i, j, blanca }); };
  const blancas = [[9, 9], [10, 9], [9, 10], [8, 9], [10, 10], [9, 8]];
  for (const [i, j] of blancas) pon(i, j, true);
  for (const [i, j] of blancas) for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) pon(i + di, j + dj, false);
  for (let n = 0; n < 26; n++) pon(Math.floor(az() * 19), Math.floor(az() * 19), az() < 0.45);
  return l.map((p, n) => ({ ...p, t: Tgo - 0.15 + (n / l.length) * 0.85 + az() * 0.05 }));
})();

// las piezas del final de la partida
const PIEZAS = [
  { tipo: "rey", negro: false, p: [0.5, 0, 1.5] },
  { tipo: "torre", negro: true, p: [-2.5, 0, -2.5] },
  { tipo: "rey", negro: true, p: [2.5, 0, -2.5] },
  { tipo: "dama", negro: true, p: [-1.5, 0, -1.5], a: [-0.5, 0, 0.5] },
];

function tablero(g, cam, t) {
  const u = go(t);
  // el marco de madera, con su canto
  const M = 4.5, alto = -0.35;
  for (const cara of [[[-M, 0, M], [M, 0, M], [M, alto, M], [-M, alto, M]], [[M, 0, -M], [M, 0, M], [M, alto, M], [M, alto, -M]], [[-M, 0, -M], [-M, 0, M], [-M, alto, M], [-M, alto, -M]]]) {
    const P = poligono(cam, cara); if (P) { traza(g, P); g.fillStyle = "#3a2112"; g.fill(); }
  }
  const marco = poligono(cam, [[-M, 0, -M], [M, 0, -M], [M, 0, M], [-M, 0, M]]);
  if (!marco) return;
  traza(g, marco);
  const xs = marco.map((p) => p.x), ys = marco.map((p) => p.y);
  const mg = g.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
  mg.addColorStop(0, k.mezColor("#6b3b1c", "#b98a46", u)); mg.addColorStop(1, k.mezColor("#3d200f", "#8a6430", u));
  g.fillStyle = mg; g.fill();
  // las casillas (se van con el go)
  if (u < 1) {
    g.save(); g.globalAlpha = 1 - u;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      const P = poligono(cam, [[-4 + i, 0.001, -4 + j], [-3 + i, 0.001, -4 + j], [-3 + i, 0.001, -3 + j], [-4 + i, 0.001, -3 + j]]);
      if (!P) continue;
      traza(g, P); g.fillStyle = (i + j) % 2 ? "#2b1a10" : "#f1dfbf"; g.fill();
    }
    g.restore();
  }
  // la madera del go con su rejilla
  if (u > 0) {
    g.save(); g.globalAlpha = u;
    const P = poligono(cam, [[-4.2, 0.002, -4.2], [4.2, 0.002, -4.2], [4.2, 0.002, 4.2], [-4.2, 0.002, 4.2]]);
    if (P) {
      traza(g, P);
      const wx = P.map((p) => p.x), wy = P.map((p) => p.y);
      const wg = g.createLinearGradient(Math.min(...wx), 0, Math.max(...wx), 0); wg.addColorStop(0, "#d9a95a"); wg.addColorStop(0.5, "#f0c878"); wg.addColorStop(1, "#c8924a");
      g.fillStyle = wg; g.fill();
      g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18 * u; g.drawImage(k.red2, Math.min(...wx), Math.min(...wy), Math.max(...wx) - Math.min(...wx), Math.max(...wy) - Math.min(...wy)); g.restore();
    }
    g.strokeStyle = "rgba(40,22,8,0.8)"; g.lineWidth = 1.6;
    g.beginPath();
    for (let i = 0; i < 19; i++) {
      const a = k.proyecta(cam, enRej(i, 0)), b = k.proyecta(cam, enRej(i, 18)), c = k.proyecta(cam, enRej(0, i)), d = k.proyecta(cam, enRej(18, i));
      if (a && b) { g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); }
      if (c && d) { g.moveTo(c.x, c.y); g.lineTo(d.x, d.y); }
    }
    g.stroke();
    g.restore();
  }
}

export function dibuja(g, t) {
  const cam = camara(t);
  // la sala oscura, con el cono del foco
  const fondo = g.createRadialGradient(540, 820, 50, 540, 900, 1300);
  fondo.addColorStop(0, "#2a1d2c"); fondo.addColorStop(0.5, "#120d1a"); fondo.addColorStop(1, "#04040a");
  g.fillStyle = fondo; g.fillRect(0, 0, 1080, 1920);
  const C = k.proyecta(cam, [0, 0, 0]), cierra = suave(tramo(t, Tsolo - 0.2, Teso + 0.2));
  // el foco: un cono de luz desde arriba y un círculo de luz en el suelo
  if (C) {
    const w = (F * 6.5) / C.z;
    g.save(); g.globalCompositeOperation = "lighter";
    const cg = g.createLinearGradient(0, 0, 0, C.y);
    cg.addColorStop(0, "rgba(255,225,170,0)"); cg.addColorStop(1, `rgba(255,225,170,${0.1 + 0.06 * cierra})`);
    g.fillStyle = cg; g.beginPath(); g.moveTo(C.x - w * 0.12, -50); g.lineTo(C.x + w * 0.12, -50); g.lineTo(C.x + w * (1.1 - 0.25 * cierra), C.y); g.lineTo(C.x - w * (1.1 - 0.25 * cierra), C.y); g.closePath(); g.fill();
    g.restore();
    k.brillo(g, C.x, C.y, w * (3.2 - 0.9 * cierra), "255,215,160", 0.5);
  }
  tablero(g, cam, t);
  // las piezas, de lejos a cerca
  const hunde = suave(tramo(t, Ty - 0.1, Ty + 0.6)), avanza = suave(tramo(t, Taje - 0.3, Taje + 0.15)), cae = tramo(t, Taje + 0.1, Taje + 0.6);
  const cosas = [];
  for (const pz of PIEZAS) {
    const X = pz.a ? k.mezV(pz.p, pz.a, avanza) : pz.p, P = k.proyecta(cam, X);
    if (!P) continue;
    const h = (F * 1.9) / P.z, cayendo = pz.tipo === "rey" && !pz.negro;
    const ang = cayendo ? -1.45 * Math.pow(cae, 2.2) + (cae >= 1 ? 0.03 * Math.exp(-(t - Taje - 0.6) * 8) * Math.sin((t - Taje - 0.6) * 40) : 0) : 0;
    cosas.push({ z: P.z, dibuja: () => {
      g.save(); g.beginPath(); g.rect(0, 0, 1080, P.y + 2); g.clip();
      // la sombra y la pieza, que se hunde en el tablero cuando llega el go
      g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(P.x, P.y, h * 0.36, h * 0.1, 0, 0, Math.PI * 2); g.fill();
      rey(g, P.x, P.y + h * hunde, h, ang, pz.negro, 1 - hunde * 0.3, pz.tipo);
      g.restore();
    } });
  }
  // las piedras del go: caen desde un poco arriba y se quedan
  for (const s of PIEDRAS) {
    if (t < s.t - 0.25) continue;
    const u = suave(tramo(t, s.t - 0.25, s.t)), X = enRej(s.i, s.j), alto = (1 - u) * 1.5;
    const P = k.proyecta(cam, [X[0], alto + 0.06, X[2]]), Q = k.proyecta(cam, [X[0] + PASO * 0.47, 0.06, X[2]]), Rz = k.proyecta(cam, [X[0], 0.06, X[2] + PASO * 0.47]);
    if (!P || !Q || !Rz) continue;
    const rx = Math.hypot(Q.x - k.proyecta(cam, [X[0], 0.06, X[2]]).x, Q.y - k.proyecta(cam, [X[0], 0.06, X[2]]).y), ry = Math.max(rx * 0.3, Math.abs(Rz.y - k.proyecta(cam, [X[0], 0.06, X[2]]).y));
    cosas.push({ z: P.z, dibuja: () => {
      g.save(); g.globalAlpha = Math.min(1, u * 3);
      const pg = g.createRadialGradient(P.x - rx * 0.35, P.y - ry * 0.5, rx * 0.05, P.x, P.y, rx);
      if (s.blanca) { pg.addColorStop(0, "#ffffff"); pg.addColorStop(0.6, "#e8e6e0"); pg.addColorStop(1, "#a9a49a"); }
      else { pg.addColorStop(0, "#6c7080"); pg.addColorStop(0.35, "#1a1c24"); pg.addColorStop(1, "#050507"); }
      g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(P.x + rx * 0.08, P.y + ry * 0.35 + (1 - u) * 0, rx, ry, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = pg; g.beginPath(); g.ellipse(P.x, P.y, rx, ry, 0, 0, Math.PI * 2); g.fill();
      g.restore();
    } });
  }
  k.deLejosACerca(cosas);
  // los años
  const a97 = suave(tramo(t, T97 - 0.1, T97 + 0.15)) * (1 - suave(tramo(t, Ty, Ty + 0.3)));
  k.pastilla(g, 540, 1300, "1997", "", "255,235,200", a97, 104);
  const a16 = suave(tramo(t, T16 - 0.1, T16 + 0.15)) * (1 - suave(tramo(t, Tpero + 0.2, Tpero + 0.5)));
  k.pastilla(g, 540, 1300, "2016", "", "255,235,200", a16, 104);
  velo(g, 0.35);
}
