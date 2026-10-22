// «Y lo que quiere es oler: para muchos perros, el paseo es casi el único rato para leer la calle con la nariz.»
// Otro sitio (corte en «Y»): la acera vista con la nariz del perro, en penumbra, con los olores como cintas de colores.
// - «Y lo que quiere es»: el hocico enorme, pegado al suelo, junto a una flor.
// - «oler»: de la flor suben cintas rosas que se doblan y entran por la nariz; el perro resopla.
// - «para muchos perros... calle»: la cámara se abre y el perro anda despacio; la acera es una línea de cosas con su
//   olor (un hidrante, unas huellas, una pelota) y las cintas entran por la nariz como si leyera.
// - «nariz»: la cámara vuelve al hocico, que aspira fuerte.
import * as k from "#kit";
import { v } from "#voz";
import { cam, correa, parque, perro, ponVista, sinVista, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez } = k;
const f7 = v.frase(7);
const T0 = f7.inicio, Toler = f7.t("oler:") ?? f7.t("oler"), Tpara = f7.t("para"), Tnariz = f7.t("nariz"), Fin = f7.fin;

// El perro anda despacio de «oler» a «nariz»; la tabla se calcula una vez (todo sale de t).
const V = 70, TW0 = Toler + 0.55, TW1 = Toler + 1.25, TS0 = Tnariz - 0.55, TS1 = Tnariz - 0.05;
const vel = (t) => V * su(tr(t, TW0, TW1)) * (1 - su(tr(t, TS0, TS1)));
const tabla = []; { let x = 0; for (let t = 0; t <= Fin + 0.1; t += 0.01) { tabla.push(x); x += vel(t) * 0.01; } }
const dogX = (t) => { const i = Math.max(0, (t) / 0.01), a = Math.min(tabla.length - 1, Math.floor(i)), b = Math.min(tabla.length - 1, a + 1); return mez(tabla[a], tabla[b], i - Math.floor(i)); };

const NX = 72; // dónde queda la nariz respecto al perro, más o menos
// las cosas del suelo y su olor: x en el mundo, color, cuándo empiezan a oler
const COSAS = [
  { x: NX + 18, tipo: "flor", col: "255,110,185", ini: 0 },
  { x: 150, tipo: "hidrante", col: "255,205,70", ini: Toler + 1.1 },
  { x: 215, tipo: "huellas", col: "90,215,255", ini: Toler + 1.6 },
  { x: 291, tipo: "pelota", col: "160,255,100", ini: Toler + 2.0 },
];

function flor(g, x) {
  g.save(); g.lineCap = "round";
  g.strokeStyle = "#3f9a3a"; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x, 1); g.quadraticCurveTo(x - 4, -14, x - 1, -30); g.stroke();
  g.fillStyle = "#4fbd45"; g.beginPath(); g.ellipse(x + 6, -10, 7, 2.6, -0.5, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x - 7, -17, 7, 2.6, 0.5, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.fillStyle = i % 2 ? "#ff8fc4" : "#ff6aae"; g.beginPath(); g.arc(x - 1 + Math.cos(a) * 5.4, -32 + Math.sin(a) * 5.4, 4.6, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = "#ffe066"; g.beginPath(); g.arc(x - 1, -32, 3.4, 0, Math.PI * 2); g.fill();
  g.restore();
}
function hidrante(g, x) {
  g.save();
  const cg = g.createLinearGradient(x - 11, 0, x + 11, 0); cg.addColorStop(0, "#ff7a6a"); cg.addColorStop(0.45, "#e0302a"); cg.addColorStop(1, "#8f1512");
  g.fillStyle = cg;
  k.redondo(g, x - 11, -42, 22, 42, 3); g.fill();
  g.beginPath(); g.arc(x, -42, 11, Math.PI, 0); g.fill();
  k.redondo(g, x - 14, -36, 28, 6, 2); g.fill(); k.redondo(g, x - 14, -6, 28, 6, 2); g.fill();
  g.fillStyle = "#c92a24"; k.redondo(g, x - 17, -26, 9, 9, 2); g.fill(); k.redondo(g, x + 8, -26, 9, 9, 2); g.fill();
  g.fillStyle = "#ffd36a"; g.beginPath(); g.arc(x, -55, 3, 0, Math.PI * 2); g.fill();
  g.restore();
}
function huellas(g, x) {
  g.save(); g.fillStyle = "rgba(60,40,24,0.62)";
  for (let i = 0; i < 3; i++) {
    const px = x - 26 + i * 26, py = 10 + (i % 2) * 7;
    g.beginPath(); g.ellipse(px, py, 7.4, 4.4, 0, 0, Math.PI * 2); g.fill();
    for (const [dx, dy] of [[-8, -4.5], [-3, -7.5], [3, -7.5], [8, -4.5]]) { g.beginPath(); g.ellipse(px + dx * 0.9, py + dy * 0.62, 2.6, 1.9, 0, 0, Math.PI * 2); g.fill(); }
  }
  g.restore();
}
function pelota(g, x) {
  g.save();
  g.fillStyle = "rgba(0,0,0,0.25)"; g.beginPath(); g.ellipse(x, 1, 10, 3, 0, 0, Math.PI * 2); g.fill();
  const bg = g.createRadialGradient(x - 3, -13, 1, x, -9, 10); bg.addColorStop(0, "#e8ff8a"); bg.addColorStop(1, "#8fc22a");
  g.fillStyle = bg; g.beginPath(); g.arc(x, -9, 9, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 1.3; g.beginPath(); g.arc(x - 9, -9, 8, -0.8, 0.8); g.stroke(); g.beginPath(); g.arc(x + 9, -9, 8, Math.PI - 0.8, Math.PI + 0.8); g.stroke();
  g.restore();
}
const DIBUJA = { flor, hidrante, huellas, pelota };

// Una cinta de olor: sube libre de la cosa o, si la nariz está cerca, se dobla hacia ella.
function cinta(g, c, t, xs, ys, nose, a, amp, sd, Z) {
  const N = 26, H = (52 + (sd % 4) * 11) * (0.55 + 0.45 * amp), lado = (sd % 3) - 1;
  const libre = (u) => [xs + lado * u * 12 + Math.sin(u * 5.2 + t * 1.7 + sd * 1.3) * (4 + 11 * u), ys - u * H];
  const cx = xs + (nose[0] - xs) * 0.12, cy = -H * 1.25 - sd * 3;
  const curva = (u) => { const w = 1 - u; return [w * w * xs + 2 * w * u * cx + u * u * nose[0], w * w * ys + 2 * w * u * cy + u * u * nose[1]]; };
  const pt = (u) => {
    const l = libre(u), b = curva(u), ond = Math.sin(u * 9 - t * 6 + sd * 1.7) * 4.2 * Math.sin(Math.PI * u);
    return [mez(l[0], b[0] + ond * 0.4, a), mez(l[1], b[1] + ond, a)];
  };
  const pts = []; for (let i = 0; i <= N; i++) pts.push(pt(i / N));
  g.lineCap = "round";
  for (const [ancho, al, col] of [[15 / Z, 0.5, c], [5 / Z, 0.95, "255,255,255"]]) {
    for (let i = 0; i < N; i++) {
      const u = (i + 0.5) / N, vis = mez(Math.sin(Math.PI * Math.min(1, u * 1.05)), Math.min(1, u * 5) * (1 - 0.35 * u), a);
      g.strokeStyle = `rgba(${col},${al * vis * amp})`; g.lineWidth = ancho * (0.7 + 0.3 * Math.sin(u * 12 - t * 5 + sd));
      g.beginPath(); g.moveTo(pts[i][0], pts[i][1]); g.lineTo(pts[i + 1][0], pts[i + 1][1]); g.stroke();
    }
  }
}

export function dibuja(g, t) {
  const dx = dogX(t), ancho = su(tr(t, Tpara + 0.3, Tpara + 1.0)) * (1 - su(tr(t, Tnariz - 0.85, Tnariz - 0.15)));
  const zl = k.claves([[T0, Math.log(9.5)], [Toler, Math.log(10.5)], [Tpara + 0.1, Math.log(9.8)], [Tpara + 0.95, Math.log(3.5)], [Tnariz - 0.85, Math.log(3.5)], [Tnariz - 0.1, Math.log(10.5)], [Fin, Math.log(11.5)]]);
  const Z = Math.exp(zl(t));
  const c = cam(Z, dx + mez(54, 78, ancho), -(7 + 330 / Z));
  parque(g, c, t, 0.3);
  // la penumbra: se ve todo con la nariz, lo que importa es el olor
  sinVista(g);
  g.fillStyle = "rgba(14,14,52,0.55)"; g.fillRect(0, 0, 1080, 1920);
  ponVista(g, c);
  for (const o of COSAS) DIBUJA[o.tipo](g, o.x);
  // la correa, por detrás del perro (se va hacia quien lo pasea)
  correa(g, [dx - 420, -92], [dx + 55, -30.4], 0, t);
  // el perro, con la nariz al suelo, resoplando
  const sn = tr(t, Toler - 0.1, Toler + 0.3);
  const olf = 0.5 + 0.5 * Math.sin(t * 17), fuerte = k.entra(tr(t, Tnariz - 0.05, Tnariz + 0.25));
  const mv = vel(t) / V;
  const per = perro(g, {
    x: dx, fase: dx / 50, marcha: 0.5 * mv, pitch: 0.02, t, cola: 0.35,
    cuelloBaja: 1, cabeza: { ang: 1.12 + 0.03 * Math.sin(t * 11) - 0.05 * fuerte, abre: 0, ojo: 0, oreja: 0.05, olfato: Math.max(olf * (0.4 + 0.6 * su(sn)), fuerte) },
  });
  // las cintas de olor, que brillan por encima
  const nose = per.nariz;
  g.save(); g.globalCompositeOperation = "lighter";
  COSAS.forEach((o, i) => {
    const quedan = su(tr(t, o.ini, o.ini + 0.45));
    if (quedan <= 0.01) return;
    const cerca = su(tr(110 - Math.abs(nose[0] - o.x), 0, 80));
    const pulso = i === 0 ? 0.55 + 0.45 * su(tr(t, Toler - 0.05, Toler + 0.5)) : 1;
    for (let s = 0; s < 4; s++) cinta(g, o.col, t, o.x + (s - 1.5) * 3, -3, nose, cerca, quedan * pulso * (0.8 + 0.2 * Math.sin(s * 2.1)), s + 1 + i * 4, Z);
  });
  g.restore();
  sinVista(g);
  vineta(g, 0.38);
  velo(g, 0.5);
}
