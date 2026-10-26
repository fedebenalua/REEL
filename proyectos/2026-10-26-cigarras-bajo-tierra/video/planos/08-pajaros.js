// «Los pájaros comen hasta hartarse, y aun así sobran millones.»
// Otro sitio: por la mañana, en el bosque junto al campo. Se entra con un corte en «Los».
// - «Los pájaros comen»: un pájaro en una rama cubierta de cigarras negras de ojos rojos; picotea y se las va comiendo.
// - «hasta hartarse»: se pone redondo, se esponja y se queda quieto, lleno.
// - «y aun así sobran millones»: la cámara se aleja y todas las ramas del bosque están cubiertas.
import * as k from "#kit";
import { v } from "#voz";
import { cigarra, sinVista, velo, vista } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f10 = v.frase(10);
const T0 = f10.inicio, Tcom = f10.t("comen"), Thar = f10.t("hartarse"), Taun = f10.t("aun"), Tsob = f10.t("sobran"), Fin = f10.fin;
const PICOS = [T0 + 0.25, T0 + 0.75, Tcom + 0.6, Thar + 0.1];
export const picotazos = PICOS;
const lleno = Thar + 0.35;

// la cigarra, dibujada una vez en un lienzo (para poner muchas)
const SPR = 220;
const sprite = (() => { const l = k.lienzo(SPR, SPR), c = l.getContext("2d"); cigarra(c, SPR / 2, SPR / 2 + 10, SPR * 0.86, 0, 0, { tipo: 1 }); return l; })();
const pon = (g, x, y, L, a) => { g.save(); g.translate(x, y); g.rotate(a); g.drawImage(sprite, -L / 2, -L / 2, L, L); g.restore(); };

// la rama principal: de abajo a la izquierda hacia arriba a la derecha
const R0 = [-700, 420], R1 = [900, -260];
const ANG = Math.atan2(R1[1] - R0[1], R1[0] - R0[0]);
const enRama = (u, lado) => { const x = mez(R0[0], R1[0], u), y = mez(R0[1], R1[1], u); return [x + Math.sin(ANG) * lado, y - Math.cos(ANG) * lado]; };
const az = azar(321);
// las de la rama principal: la cabeza hacia arriba de la rama
const EN_RAMA = Array.from({ length: 22 }, (_, i) => ({ u: 0.28 + i * 0.033 + az() * 0.01, lado: (i % 2 ? 1 : -1) * (26 + az() * 10), a: ANG + (i % 2 ? -1 : 1) * (Math.PI / 2 - 0.3) + (az() - 0.5) * 0.3, L: 150 + az() * 20 }));
// las que se come: las cuatro de más a la izquierda, una por picotazo
const COMIDAS = [0, 1, 2, 3];
// el bosque de lejos: árboles con su tronco y sus ramas, todo cubierto de cigarras
const RAMAS = [], MATAS = [];
for (const tx of [-3300, -2250, -1180, 1650, 2700, 3600]) {
  const w = 90 + az() * 50;
  RAMAS.push({ x0: tx, y0: 5200, x1: tx + (az() - 0.5) * 300, y1: -4200, w, n: 120, s: az() * 1000 });
  for (let j = 0; j < 7; j++) {
    const y = 3300 - j * 1050 + (az() - 0.5) * 500, lado = (j + (tx > 0 ? 1 : 0)) % 2 ? 1 : -1, L = 600 + az() * 800, an = -0.25 - az() * 0.6;
    const x1 = tx + lado * Math.cos(an) * L, y1 = y + Math.sin(an) * L;
    RAMAS.push({ x0: tx, y0: y, x1, y1, w: 34 + az() * 14, n: Math.round(L / 60), s: az() * 1000 });
    MATAS.push({ x: x1 + lado * 80, y: y1 - 60, s: 650 + az() * 450 });
  }
}
const mata = (() => {
  const l = k.lienzo(400, 400), c = l.getContext("2d"), za = azar(55);
  for (let i = 0; i < 220; i++) {
    const a = za() * 6.2832, r = Math.sqrt(za()) * 170, x = 200 + Math.cos(a) * r, y = 200 + Math.sin(a) * r * 0.8, L = 30 + za() * 20;
    const luz = Math.max(0, Math.min(1, 0.6 - (x - 200) / 400 - (y - 200) / 300 + (za() - 0.5) * 0.4));
    c.save(); c.translate(x, y); c.rotate(za() * 6.28); c.fillStyle = k.mezColor("#1a5a1e", "#9be35a", luz);
    c.beginPath(); c.moveTo(-L / 2, 0); c.quadraticCurveTo(0, -L * 0.32, L / 2, 0); c.quadraticCurveTo(0, L * 0.32, -L / 2, 0); c.fill(); c.restore();
  }
  return l;
})();
const FONDO = Array.from({ length: 14 }, () => ({ x: az() * 1080, y: az() * 1920, r: 120 + az() * 220, c: az() }));

function rama(g, x0, y0, x1, y1, w) {
  g.save(); g.lineCap = "round";
  g.strokeStyle = "#3a2210"; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  const a = Math.atan2(y1 - y0, x1 - x0), ox = Math.sin(a) * w * 0.22, oy = -Math.cos(a) * w * 0.22;
  g.strokeStyle = "rgba(210,150,95,0.6)"; g.lineWidth = w * 0.28; g.beginPath(); g.moveTo(x0 + ox, y0 + oy); g.lineTo(x1 + ox, y1 + oy); g.stroke();
  g.restore();
}

// el pájaro (un petirrojo americano): de lado, mirando a la derecha, de pie en (x, y). gordo: 0 a 1.
function pajaro(g, x, y, s, t, gordo, pico) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const ge = 1 + 0.42 * gordo;
  // la cola
  g.fillStyle = "#3a3632"; g.beginPath(); g.moveTo(-0.3, -0.35); g.lineTo(-0.85, -0.12); g.lineTo(-0.8, -0.02); g.lineTo(-0.25, -0.22); g.fill();
  // las patas
  g.strokeStyle = "#b07a3a"; g.lineWidth = 0.035; g.beginPath(); g.moveTo(0.0, -0.18); g.lineTo(-0.03, 0); g.moveTo(0.1, -0.18); g.lineTo(0.12, 0); g.stroke();
  // el cuerpo: la espalda gris y el pecho naranja
  g.save(); g.translate(0, -0.45); g.scale(ge, ge);
  const bg = g.createRadialGradient(-0.1, -0.2, 0.05, 0, 0, 0.45); bg.addColorStop(0, "#7a7068"); bg.addColorStop(1, "#2e2a26");
  g.fillStyle = bg; g.beginPath(); g.ellipse(0, 0, 0.42, 0.3, -0.25, 0, 6.2832); g.fill();
  const pg = g.createRadialGradient(0.12, 0.05, 0.02, 0.1, 0.08, 0.32); pg.addColorStop(0, "#ffb060"); pg.addColorStop(0.6, "#e8662a"); pg.addColorStop(1, "#9a3a14");
  g.fillStyle = pg; g.beginPath(); g.ellipse(0.12, 0.08, 0.28, 0.22, -0.3, 0, 6.2832); g.fill();
  // el ala
  g.fillStyle = "#4a443e"; g.beginPath(); g.ellipse(-0.12, -0.04, 0.28, 0.14, -0.35, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 0.012; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-0.3 + i * 0.07, -0.0); g.lineTo(-0.05 + i * 0.05, -0.12); g.stroke(); }
  g.restore();
  // la cabeza: baja al picotear
  const p = pico, hx = 0.36 + 0.12 * p, hy = -0.78 + 0.28 * p + 0.1 * gordo;
  g.save(); g.translate(hx, hy); g.rotate(0.5 * p);
  g.fillStyle = "#24211e"; g.beginPath(); g.arc(0, 0, 0.17, 0, 6.2832); g.fill();
  g.fillStyle = "#f2c230"; g.beginPath(); g.moveTo(0.14, -0.03); g.lineTo(0.36, 0.02); g.lineTo(0.14, 0.05); g.fill();
  g.fillStyle = "#fff"; g.beginPath(); g.arc(0.05, -0.04, 0.05, 0, 6.2832); g.fill();
  g.fillStyle = "#000"; g.beginPath(); g.arc(0.06, -0.04, 0.028, 0, 6.2832); g.fill();
  g.fillStyle = "#fff"; g.beginPath(); g.arc(0.068, -0.05, 0.009, 0, 6.2832); g.fill();
  g.restore();
  g.restore();
}

export function dibuja(g, t) {
  const sale = su(tr(t, Taun - 0.15, Tsob + 0.75));
  const Z = Math.exp(mez(Math.log(1.0), Math.log(0.19), sale)), cx = mez(-170, 0, sale), cy = mez(130, 500, sale);
  sinVista(g);
  // el cielo de la mañana
  const sg = g.createLinearGradient(0, 0, 0, 1920); sg.addColorStop(0, "#5aa8ff"); sg.addColorStop(0.6, "#bfe2ff"); sg.addColorStop(1, "#ffe2a8");
  g.fillStyle = sg; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 900, 300, 1400, "255,240,190", 0.8);
  // hojas desenfocadas detrás
  g.save(); g.globalAlpha = 0.35 * (1 - sale);
  for (const f of FONDO) { const fg = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r); fg.addColorStop(0, f.c < 0.5 ? "rgba(60,140,60,1)" : "rgba(120,190,80,1)"); fg.addColorStop(1, "rgba(60,140,60,0)"); g.fillStyle = fg; g.beginPath(); g.arc(f.x, f.y, f.r, 0, 6.2832); g.fill(); }
  g.restore();
  vista(g, Z, cx, cy);
  // el bosque de lejos (solo cuando la cámara se aleja)
  if (sale > 0.01) {
    g.save(); g.globalAlpha = su(tr(sale, 0.01, 0.3));
    for (const r of RAMAS) {
      rama(g, r.x0, r.y0, r.x1, r.y1, r.w);
      const azr = azar(Math.floor(r.s) + 1), a = Math.atan2(r.y1 - r.y0, r.x1 - r.x0);
      for (let i = 0; i < r.n; i++) {
        const u = (i + 0.5) / r.n, lado = (i % 2 ? 1 : -1) * r.w * 0.7;
        const x = mez(r.x0, r.x1, u) + Math.sin(a) * lado, y = mez(r.y0, r.y1, u) - Math.cos(a) * lado;
        pon(g, x, y, 130 + azr() * 30, a + (i % 2 ? -1 : 1) * 1.2 + (azr() - 0.5) * 0.4);
      }
    }
    for (const m of MATAS) g.drawImage(mata, m.x - m.s / 2, m.y - m.s / 2, m.s, m.s);
    g.restore();
  }
  // la rama del pájaro
  rama(g, R0[0] - 400, R0[1] + 170, R1[0] + 300, R1[1] - 130, 74);
  // sus cigarras: las cuatro primeras desaparecen, una en cada picotazo
  EN_RAMA.forEach((c, i) => {
    const j = COMIDAS.indexOf(i);
    if (j >= 0 && t > PICOS[j]) return;
    const [x, y] = enRama(c.u, c.lado);
    pon(g, x, y, c.L, c.a);
  });
  // el pájaro, a la izquierda de la rama
  const [px, py] = enRama(0.17, -26);
  let pico = 0;
  for (const p of PICOS) pico = Math.max(pico, k.pulso(t, p, 0.09));
  const gordo = su(tr(t, PICOS[1], lleno));
  pajaro(g, px, py + 10, 330, t, gordo, pico);
  // migas de alas al comer
  for (const p of PICOS) {
    const u = t - p; if (u < 0 || u > 0.5) continue;
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(255,140,40,${1 - u * 2})`; g.beginPath(); g.ellipse(px + 200 + i * 14, py - 120 + 300 * u * u + i * 6, 14, 5, i, 0, 6.2832); g.fill(); }
  }
  sinVista(g);
  velo(g, 0.4, "20,40,70");
}

export const momentos = { picotazos: PICOS };
