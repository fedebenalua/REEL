// Una sola cámara, el microondas de la cocina. Se mete en la rejilla, separa el cristal,
// encaja un alfiler, compara la onda con un móvil y vuelve a salir.
import * as k from "#kit";
import { v } from "#voz";
import {
  ANCLA, BODY, CENTRO, HOLE, PALOM, PASO, RAD, WIN,
  brilloCristal, caja, chispas, fondoCocina, interior, rejilla,
} from "./mundo.js";

const azR = k.azar(77);
const RAFAGAS = Array.from({ length: 42 }, () => {
  const a = azR() * 6.2832;
  return { a, r0: 30 + azR() * 160, largo: 60 + azR() * 110, w: 4 + azR() * 6, ph: azR() };
});

function rafagas(g, t) {
  const al = 1 - k.suave(k.tramo(t, 0.2, 1.2));
  if (al < 0.03) return;
  const vuelo = t * 1100;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  for (const r of RAFAGAS) {
    const d = r.r0 + vuelo * (0.4 + r.ph);
    const x1 = ANCLA[0] + Math.cos(r.a) * d, y1 = ANCLA[1] + Math.sin(r.a) * d;
    const x0 = ANCLA[0] + Math.cos(r.a) * (d - r.largo), y0 = ANCLA[1] + Math.sin(r.a) * (d - r.largo);
    g.globalAlpha = al * 0.7;
    g.strokeStyle = r.ph > 0.55 ? "rgba(255,70,190,0.95)" : "rgba(190,245,255,0.9)";
    g.lineWidth = r.w;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x1, y1);
    g.stroke();
  }
  g.restore();
}

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);

const T = {
  rejilla: f1.t("rejilla"),
  dentro: f1.t("dentro"),
  plato: f2.t("plato"),
  cristal: f3.t("cristal"),
  para: f3.t("para"),
  metal: f3.t("metal"),
  agujero: f4.t("agujero"),
  cabeza: f4.t("cabeza"),
  alfiler: f4.t("alfiler"),
  onda: f5.t("onda"),
  centimetros: f5.t("centimetros"),
  corta: f5.t("corta"),
  movil: f5.t("movil"),
  ochenta: f6.t("ochenta"),
  agujero2: f6.t("agujero"),
  rebota: f6.t("rebota"),
  luz: f7.t("luz"),
  cuela: f7.t("cuela"),
  palomitas: f8.t("palomitas"),
  quedan: f8.t("quedan"),
  cara: f9.t("cara"),
  esta: f9.t("esta"),
};

// pendiente inicial distinta de cero: en el fotograma 0 la cámara ya está saliendo, no arranca parada
const zoomEn = k.curva([
  [0, 6.4],
  [0.42, 3.7],
  [T.rejilla, 2.45],
  [T.dentro, 1.32],
  [T.plato, 1.14],
  [T.cristal, 1.06],
  [T.metal, 1.12],
  [12.6, 1.05],
  [T.agujero, 1.4],
  [T.alfiler, 16.5],
  [17.25, 16.2],
  [T.centimetros, 1.72],
  [T.movil, 1.62],
  [T.ochenta, 1.18],
  [T.rebota, 1.5],
  [T.cuela, 2.45],
  [T.palomitas, 0.92],
  [T.quedan, 0.94],
  [T.cara, 1.02],
  [T.esta, 1.7],
  [39.05, 5.2],
], -5.5, 0);

function focoDe(z) {
  const u = k.suave(k.tramo(z, 0.84, 1.2));
  return [k.mez(CENTRO[0], HOLE[0], u), k.mez(CENTRO[1], HOLE[1], u)];
}

// 0 = el cristal en su sitio, 1 = sacado hacia la cámara. Vuelve antes del agujero.
function cristalFuera(t) {
  const sale = k.suave(k.tramo(t, T.cristal, T.para));
  const vuelve = k.suave(k.tramo(t, 11.9, 12.55));
  return sale * (1 - vuelve);
}

function ondaFrente(g, t, al, dir = 1) {
  if (al < 0.02) return;
  const { x, y, w, h } = WIN;
  g.save();
  k.redondo(g, x - 8, y - 8, w + 16, h + 16, 20);
  g.clip();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  const fase = t * 8 * dir;
  for (let n = 0; n < 3; n++) {
    g.beginPath();
    const base = y + h * (0.28 + n * 0.22);
    for (let i = 0; i <= 64; i++) {
      const u = i / 64;
      const px = x + u * w;
      const py = base + Math.sin(u * 10 + fase + n * 1.4) * 36;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.strokeStyle = `rgba(255,45,185,${0.85 * al})`;
    g.lineWidth = 34;
    g.stroke();
    g.strokeStyle = `rgba(255,230,250,${0.7 * al})`;
    g.lineWidth = 10;
    g.stroke();
  }
  g.restore();
}

function laminaCristal(g, t) {
  const off = cristalFuera(t);
  if (off < 0.02) return;
  const { x, y, w, h } = WIN;
  const sc = 1 + off * 0.22;
  const cx = x + w / 2 + off * 70;
  const cy = y + h / 2 + off * 380;
  g.save();
  g.translate(cx, cy);
  g.rotate(off * 0.08);
  g.scale(sc, sc);
  g.translate(-w / 2, -h / 2);
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 30;
  g.shadowOffsetY = 18;
  k.redondo(g, 0, 0, w, h, 22);
  const cg = g.createLinearGradient(0, 0, w, h);
  cg.addColorStop(0, "rgba(230,250,255,0.42)");
  cg.addColorStop(0.22, "rgba(190,230,255,0.1)");
  cg.addColorStop(0.55, "rgba(255,255,255,0.2)");
  cg.addColorStop(1, "rgba(210,240,255,0.34)");
  g.fillStyle = cg;
  g.fill();
  g.shadowColor = "transparent";
  g.shadowBlur = 0;
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineWidth = 14;
  g.stroke();
  // un reflejo gordo, para que se lea como un cristal y no como un velo
  g.fillStyle = "rgba(255,255,255,0.55)";
  k.redondo(g, 36, 30, 70, h * 0.55, 30);
  g.fill();
  g.restore();
  // la onda atraviesa el cristal mientras está fuera, y solo hasta que habla el metal
  const cruza = off * (1 - k.suave(k.tramo(t, T.metal - 0.12, T.metal + 0.28)));
  if (cruza > 0.05) {
    g.save();
    g.translate(cx, cy);
    g.rotate(off * 0.08);
    g.scale(sc, sc);
    g.globalCompositeOperation = "lighter";
    g.lineCap = "round";
    for (let n = 0; n < 3; n++) {
      g.beginPath();
      for (let i = 0; i <= 36; i++) {
        const u = i / 36;
        const px = -w / 2 + u * w;
        const py = -40 + n * 70 + Math.sin(u * 8 + t * 10 + n) * 26;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.strokeStyle = `rgba(255,50,200,${0.9 * cruza})`;
      g.lineWidth = 28;
      g.stroke();
      g.strokeStyle = `rgba(255,240,255,${0.75 * cruza})`;
      g.lineWidth = 8;
      g.stroke();
    }
    g.restore();
  }
}

function alfiler(g, t) {
  const entra = k.entra(k.suave(k.tramo(t, T.cabeza, T.alfiler)));
  const seVa = k.suave(k.tramo(t, f5.inicio, f5.inicio + 0.45));
  const al = entra * (1 - seVa);
  if (al < 0.02) return;
  const x = k.mez(HOLE[0] - 160, HOLE[0], entra);
  const y = HOLE[1];
  const cabeza = RAD * 0.86;
  g.save();
  g.globalAlpha = al;
  // asta
  g.lineCap = "round";
  g.strokeStyle = "#c5ccd6";
  g.lineWidth = 3.2;
  g.beginPath();
  g.moveTo(x - 90, y);
  g.lineTo(x - cabeza * 0.2, y);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 1.2;
  g.beginPath();
  g.moveTo(x - 90, y - 0.8);
  g.lineTo(x - cabeza, y - 0.8);
  g.stroke();
  // cabeza
  const hg = g.createRadialGradient(x - cabeza * 0.35, y - cabeza * 0.35, 1, x, y, cabeza);
  hg.addColorStop(0, "#ffffff");
  hg.addColorStop(0.45, "#d5dbe4");
  hg.addColorStop(1, "#6a7382");
  g.fillStyle = hg;
  g.beginPath();
  g.arc(x, y, cabeza, 0, 6.2832);
  g.fill();
  g.restore();
}

function comparacion(g, t) {
  const llegaOnda = k.suave(k.tramo(t, T.onda, T.centimetros));
  const llegaMovil = k.entra(k.suave(k.tramo(t, T.corta - 0.05, T.movil)));
  const seVa = k.suave(k.tramo(t, T.ochenta + 0.15, T.ochenta + 0.7));
  const al = (1 - seVa);
  if (llegaOnda < 0.02 || al < 0.02) return;
  // el móvil, a la derecha, y la onda de pie, más corta, con la misma base
  const base = 1340;
  const altMovil = 760;
  const altOnda = 420;
  const xMov = 700, xOnda = 470;
  g.save();
  g.globalAlpha = al;
  // onda
  const hO = altOnda * llegaOnda;
  g.save();
  g.beginPath();
  g.rect(xOnda - 80, base - hO - 20, 200, hO + 40);
  g.clip();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  g.beginPath();
  const pasos = 50;
  for (let i = 0; i <= pasos; i++) {
    const u = i / pasos;
    const py = base - u * hO;
    const px = xOnda + Math.sin(u * 10 - t * 8) * 46;
    i ? g.lineTo(px, py) : g.moveTo(px, py);
  }
  g.strokeStyle = "rgba(255,50,190,0.95)";
  g.lineWidth = 22;
  g.stroke();
  g.strokeStyle = "rgba(255,220,250,0.8)";
  g.lineWidth = 6;
  g.stroke();
  g.restore();
  // móvil
  if (llegaMovil > 0.02) {
    const y0 = base - altMovil * llegaMovil;
    const h = altMovil * llegaMovil;
    g.save();
    g.globalAlpha = al * llegaMovil;
    k.redondo(g, xMov, y0, 230, Math.max(8, h), 36);
    g.fillStyle = "#141820";
    g.fill();
    g.lineWidth = 8;
    g.strokeStyle = "#8b93a6";
    g.stroke();
    const m = 16;
    k.redondo(g, xMov + m, y0 + m + 10, 230 - m * 2, Math.max(4, h - m * 2 - 28), 22);
    const sg = g.createLinearGradient(xMov, y0, xMov, y0 + h);
    sg.addColorStop(0, "#7ae0ff");
    sg.addColorStop(0.45, "#2450c8");
    sg.addColorStop(1, "#ff8a4a");
    g.fillStyle = sg;
    g.fill();
    // un reflejo, para que sea cristal y no un rectángulo plano
    g.globalAlpha = al * llegaMovil * 0.45;
    k.redondo(g, xMov + 28, y0 + 36, 28, Math.max(4, h * 0.45), 12);
    g.fillStyle = "#fff";
    g.fill();
    g.restore();
  }
  g.restore();
}

function selloOchenta(g, t) {
  const entra = k.suave(k.tramo(t, T.ochenta, T.ochenta + 0.22));
  const seVa = k.suave(k.tramo(t, T.ochenta + 1.35, T.ochenta + 1.7));
  const al = entra * (1 - seVa);
  if (al < 0.02) return;
  k.pastilla(g, 540, 760, "×80", "", "255,70,190", al, 120);
}

function hazLuz(g, t) {
  const entra = k.suave(k.tramo(t, T.luz, T.cuela));
  const seVa = k.suave(k.tramo(t, f8.inicio - 0.15, f8.inicio + 0.35));
  const al = entra * (1 - seVa);
  if (al < 0.02) return;
  // en coordenadas de mundo: entra por arriba a la izquierda y cruza el agujero hasta las palomitas
  const x0 = HOLE[0] - 220, y0 = HOLE[1] - 340;
  const x1 = HOLE[0] + 10, y1 = HOLE[1] + 200;
  const u = k.suave(k.tramo(t, T.luz, T.cuela + 0.35));
  const x = k.mez(x0, x1, u), y = k.mez(y0, y1, u);
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  g.strokeStyle = `rgba(255,190,60,${0.55 * al})`;
  g.lineWidth = 54;
  g.beginPath();
  g.moveTo(x0, y0);
  g.lineTo(x, y);
  g.stroke();
  g.strokeStyle = `rgba(255,250,220,${0.95 * al})`;
  g.lineWidth = 16;
  g.stroke();
  g.restore();
  k.brillo(g, HOLE[0], HOLE[1], 90, "amarilla", al * 0.8);
  if (u > 0.85) k.brillo(g, x1, y1, 160, "naranja", al * 0.55);
}

function cara(g, t) {
  const entra = k.entra(k.suave(k.tramo(t, f9.inicio + 0.05, T.cara)));
  const seVa = k.suave(k.tramo(t, T.esta - 0.05, T.esta + 0.55));
  const al = entra * (1 - seVa);
  if (al < 0.02) return;
  const x = k.mez(1300, 620, entra) + seVa * 640;
  const y = 980;
  g.save();
  g.translate(x, y);
  g.scale(1.7, 1.7);
  g.globalAlpha = al;
  // pelo
  g.fillStyle = "#2a1a16";
  g.beginPath();
  g.ellipse(20, -40, 150, 180, 0.1, 0, 6.2832);
  g.fill();
  // oreja
  g.fillStyle = "#e7a07c";
  g.beginPath();
  g.ellipse(118, 10, 36, 58, 0, 0, 6.2832);
  g.fill();
  g.strokeStyle = "#c47b62";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(118, 12, 18, 32, 0, 0, 6.2832);
  g.stroke();
  // perfil
  const pg = g.createLinearGradient(-40, -160, 140, 140);
  pg.addColorStop(0, "#ffd2b4");
  pg.addColorStop(0.55, "#f0a484");
  pg.addColorStop(1, "#d4846c");
  g.fillStyle = pg;
  g.beginPath();
  g.moveTo(10, -160);
  g.quadraticCurveTo(130, -170, 145, -30);
  g.quadraticCurveTo(175, 20, 108, 48);
  g.quadraticCurveTo(150, 78, 96, 102);
  g.quadraticCurveTo(40, 190, -30, 150);
  g.quadraticCurveTo(-90, 40, -50, -70);
  g.quadraticCurveTo(-30, -160, 10, -160);
  g.fill();
  // ojo
  g.fillStyle = "#fff";
  g.beginPath();
  g.ellipse(48, -36, 26, 20, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#241818";
  g.beginPath();
  g.arc(56, -34, 11, 0, 6.2832);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(52, -38, 4, 0, 6.2832);
  g.fill();
  // ceja
  g.strokeStyle = "#3a2420";
  g.lineWidth = 6;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(24, -62);
  g.quadraticCurveTo(50, -74, 78, -58);
  g.stroke();
  g.restore();
}

function velo(g) {
  const gr = g.createLinearGradient(0, 240, 0, 540);
  gr.addColorStop(0, "rgba(8,6,16,0.72)");
  gr.addColorStop(0.7, "rgba(8,6,16,0.28)");
  gr.addColorStop(1, "rgba(8,6,16,0)");
  g.fillStyle = gr;
  g.fillRect(0, 220, 1080, 340);
}

export function escena(g, t) {
  const z = zoomEn(t);
  const [fx, fy] = focoDe(z);
  g.save();
  g.translate(ANCLA[0], ANCLA[1]);
  g.scale(z, z);
  g.translate(-fx, -fy);
  fondoCocina(g);
  caja(g, t);
  interior(g, t);
  rejilla(g);
  brilloCristal(g, 0.2 + 0.15 * (1 - cristalFuera(t)));
  const apaga = k.suave(k.tramo(t, f8.inicio - 0.2, f8.inicio + 0.45));
  const vuelve = k.suave(k.tramo(t, T.esta - 0.1, T.esta + 0.55));
  const alOnda = 0.9 * (1 - apaga) + 0.95 * vuelve;
  const dir = t < T.rebota + 0.08 ? 1 : -1;
  // en el choque del metal (frase 3) la onda de delante se apaga un momento y vuelve rebotada
  const golpeMetal = k.pulso(t, T.metal, 0.12);
  const golpeRej = k.pulso(t, T.rejilla, 0.1) + k.pulso(t, 0.12, 0.08);
  const golpeReb = k.pulso(t, T.rebota, 0.11);
  ondaFrente(g, t, alOnda * (1 - 0.45 * cristalFuera(t)), t > T.metal && t < f4.inicio ? -1 : dir);
  laminaCristal(g, t);
  alfiler(g, t);
  hazLuz(g, t);
  // fogonazos en el agujero del centro, en mundo: la cámara los pone grandes cuando está cerca
  if (golpeRej > 0.05) k.brillo(g, HOLE[0], HOLE[1], 80, "violeta", golpeRej);
  if (golpeMetal > 0.05) k.brillo(g, HOLE[0], HOLE[1] - 40, 110, "violeta", golpeMetal);
  if (golpeReb > 0.05) k.brillo(g, HOLE[0], HOLE[1], 120, "violeta", golpeReb);
  k.fogonazo(g, HOLE[0], HOLE[1], t, 55, "255,50,190");
  k.fogonazo(g, HOLE[0], HOLE[1], t - T.metal, 80, "255,50,190");
  k.fogonazo(g, HOLE[0], HOLE[1], t - T.rebota, 90, "255,50,190");
  chispas(g, HOLE[0], HOLE[1], -0.06, t, 0.85);
  chispas(g, HOLE[0], HOLE[1], T.rejilla - 0.02, t, 0.7);
  chispas(g, HOLE[0], HOLE[1], T.metal - 0.02, t, 0.85);
  chispas(g, HOLE[0], HOLE[1], T.rebota - 0.02, t, 1);
  g.restore();

  const tapa = k.suave(k.tramo(t, T.onda, T.centimetros)) * (1 - k.suave(k.tramo(t, T.ochenta + 0.15, T.ochenta + 0.75)));
  if (tapa > 0.02) {
    g.fillStyle = `rgba(8,4,16,${0.42 * tapa})`;
    g.fillRect(0, 500, 1080, 1420);
  }
  comparacion(g, t);
  selloOchenta(g, t);
  cara(g, t);
  rafagas(g, t);
  velo(g);

  // anillo en el agujero de verdad, en pantalla, cuando dice que la onda es más larga que él
  const marca = k.suave(k.tramo(t, T.agujero2 - 0.05, T.agujero2 + 0.2)) * (1 - k.suave(k.tramo(t, T.rebota + 0.35, T.rebota + 0.7)));
  if (marca > 0.04 && z < 3) {
    const [fx2, fy2] = focoDe(z);
    const sx = ANCLA[0] + (HOLE[0] - fx2) * z;
    const sy = ANCLA[1] + (HOLE[1] - fy2) * z;
    const rad = RAD * z;
    g.save();
    g.globalAlpha = marca;
    g.strokeStyle = "#ffe14a";
    g.lineWidth = 8;
    g.beginPath();
    g.arc(sx, sy, rad + 10, 0, 6.2832);
    g.stroke();
    g.restore();
  }
}

export const momentos = { rejilla: T.rejilla, metal: T.metal, alfiler: T.alfiler, rebota: T.rebota, cuela: T.cuela };
