// Un solo plano: el salón. La cámara entra en la tele, sale al mando y acaba en el móvil.
// Frase a frase, lo mismo que plan.md.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);

const tThird = f1.t("third");
const tHit = f2.t("hitting");
const tRod = f2.t("rod");
const tSix = f3.t("six");
const tInside = f3.t("inside");
const tHigh = f4.t("high");
const tHear = f4.t("hear");
const tEar = f4.t("ear");
const tThird2 = f5.t("third");
const tPrice = f5.t("price");
const tShrank = f6.t("shrank");
const tChip = f6.t("chip");
const tLight = f7.t("light");
const tSee = f7.t("see");
const tBat = f8.t("batteries");
const tHam = f9.t("hammer");
const tPhone = f10.t("phone");
const tApp = f11.t("app");
const tBio = f11.t("bio");
const tFriend = f12.t("friend");
const tBuy = f12.t("buying");

const TUBOS = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
const ALTO_TUBO = 20;

function viaje(t, tramos) {
  let s = tramos[0];
  for (const x of tramos) if (t >= x.t0) s = x;
  const u = k.suave(k.tramo(t, s.t0, s.t1));
  return k.mira(k.mezV(s.p0, s.p1, u), k.mezV(s.m0, s.m1, u));
}

function camara(t) {
  return viaje(t, [
    { t0: -0.5, t1: 1.15, p0: [-16, 4, 10], p1: [15, 3, 9], m0: [-6, 3, 0], m1: [7, 3, 0] },
    { t0: 1.15, t1: tThird, p0: [15, 3, 9], p1: [0, 1.2, 30], m0: [7, 3, 0], m1: [0, -1, 0] },
    { t0: tThird, t1: 4.05, p0: [0, 1.2, 30], p1: [2.4, 0.6, 28], m0: [0, -1, 0], m1: [0, -2, 0] },
    { t0: 4.05, t1: tHit, p0: [3, 1.4, 36], p1: [18, -3, 32], m0: [0, -1, 0], m1: [18, -8, 20] },
    { t0: tHit, t1: tRod + 0.4, p0: [18, -3, 32], p1: [18, -5, 30], m0: [18, -8, 20], m1: [18, -8, 20] },
    { t0: tRod + 0.4, t1: tSix, p0: [18, -5, 30], p1: [-6, 1.2, 12], m0: [18, -8, 20], m1: [2, 0, 0] },
    { t0: tSix, t1: tInside + 0.45, p0: [-6, 1.2, 12], p1: [8, 0.6, 11], m0: [2, 0, 0], m1: [2, 0, 0] },
    { t0: tInside + 0.45, t1: tHigh, p0: [8, 0.6, 11], p1: [4, 1, 16], m0: [2, 0, 0], m1: [0, 0, 0] },
    { t0: tHigh, t1: tEar, p0: [4, 1, 16], p1: [0, 1, 13], m0: [0, 0, 0], m1: [0, 0, 0] },
    { t0: tEar, t1: tThird2, p0: [0, 3, 13], p1: [0, 1, 32], m0: [0, 2, 0], m1: [0, -1, 0] },
    { t0: tThird2, t1: tPrice + 0.75, p0: [0, 1, 32], p1: [1.2, 0.4, 29], m0: [0, -1, 0], m1: [3, -2, 0] },
    { t0: tPrice + 0.75, t1: tChip, p0: [1.2, 0.4, 29], p1: [0, -2, 22], m0: [3, -2, 0], m1: [0, -6, 0] },
    { t0: tChip, t1: tLight, p0: [0, 0.4, 28], p1: [17, -4, 31], m0: [0, -2, 0], m1: [16, -8, 18] },
    { t0: tLight, t1: tBat + 0.15, p0: [17, -4, 31], p1: [16, -2, 33], m0: [16, -8, 18], m1: [18, -6, 18] },
    { t0: tBat + 0.15, t1: tHam, p0: [16, -2, 33], p1: [17, -4.5, 30], m0: [18, -6, 18], m1: [16, -8, 18] },
    { t0: tHam, t1: tPhone, p0: [17, -4.5, 30], p1: [2, -1, 24], m0: [16, -8, 18], m1: [0, -6, 12] },
    { t0: tPhone, t1: tBio, p0: [2, -1, 24], p1: [0, -2, 20], m0: [0, -6, 12], m1: [0, -5, 10] },
    { t0: tBio, t1: tFriend, p0: [0, -2, 20], p1: [0, 1, 34], m0: [0, -5, 10], m1: [0, -3, 4] },
    { t0: tFriend, t1: 33.7, p0: [0, 1, 34], p1: [0, -3, 17], m0: [0, -3, 4], m1: [0, -6, 8] },
  ]);
}

function moderno(t) {
  return k.suave(k.tramo(t, tShrank - 0.25, tChip - 0.05));
}
function fino(t) {
  const a = k.suave(k.tramo(t, tChip - 0.15, tLight - 0.15));
  const b = k.suave(k.tramo(t, tBat + 0.15, tHam - 0.12));
  return a * (1 - b);
}
function separa(t) {
  const sale = k.suave(k.tramo(t, tThird2 - 0.45, tThird2 + 0.05));
  const vuelve = k.suave(k.tramo(t, tPrice + 0.35, tShrank - 0.35));
  return sale * (1 - vuelve);
}
function oroBrillo(t) {
  const enciende = k.suave(k.tramo(t, tThird - 0.35, tThird + 0.05));
  const apaga = k.suave(k.tramo(t, tShrank - 0.2, tShrank + 0.4));
  return enciende * (1 - apaga);
}

function golpe(t, t0) {
  const u = t - (t0 - 0.14);
  if (u < 0 || u > 0.55) return { ang: -0.85, hit: 0 };
  if (u < 0.14) return { ang: k.mez(-0.15, -0.95, u / 0.14), hit: 0 };
  const hit = Math.exp(-(u - 0.14) * 16);
  const ring = Math.sin((u - 0.14) * 70) * Math.exp(-(u - 0.14) * 7);
  return { ang: k.mez(-0.95, 0.35, Math.min(1, (u - 0.1) / 0.08)) + ring * 0.12, hit };
}

function martillo(t) {
  const a = golpe(t, tHit), b = golpe(t, tHam);
  return a.hit > b.hit ? a : b;
}

function canal(t) {
  const cambios = [
    [tEar + 0.02, "4", "5"],
    [tLight + 0.28, "5", "9"],
    [tPhone + 0.08, "9", "2"],
    [tApp + 0.12, "2", "7"],
  ];
  let texto = "4", dy = 0;
  for (const [tc, a, b] of cambios) {
    if (t < tc) break;
    const u = k.tramo(t, tc, tc + 0.24);
    if (u < 1) {
      texto = u < 0.5 ? a : b;
      dy = u < 0.5 ? -u * 80 : (1 - u) * 70;
    } else texto = b;
  }
  return { texto, dy };
}

function calor(i, t) {
  let c = 0.72 + 0.28 * Math.sin(t * 15 + i * 1.3);
  c += k.pulso(t, tSix + i * 0.16, 0.09);
  c += 0.85 * k.pulso(t, tEar, 0.16);
  const enc = moderno(t);
  return c * (1 - enc) + enc * 0.15;
}

function posTubo(i, t) {
  const base = [TUBOS[i] * 6.6, -8, -1];
  const chip = [0, -11, 2];
  const u = moderno(t);
  return [k.mez(base[0], chip[0], u), k.mez(base[1], chip[1], u), k.mez(base[2], chip[2], u)];
}

function posPilas(t) {
  const sale = k.entra(k.tramo(t, tBat - 0.08, tBat + 0.42));
  const lado = k.suave(k.tramo(t, tHam, tPhone));
  const sofa = k.suave(k.tramo(t, tBuy - 0.15, tBuy + 0.45));
  const a = k.mezV([16, -8, 18], [22, 2, 22], sale);
  const b = k.mezV(a, [24, -12, 20], lado);
  return k.mezV(b, [8, -15, 16], sofa);
}

function poner(lista, cam, pos, dibuja) {
  const p = k.proyecta(cam, pos);
  if (!p) return;
  lista.push({ z: p.z, dibuja: () => dibuja(p) });
}

export function dibuja(g, t) {
  const cam = camara(t);
  const dentro = k.suave(k.tramo(cam.p[2], 30, 14));
  m.habitacion(g, t, dentro);
  if (dentro > 0.2) {
    const suelo = [[-30, -14, -2], [30, -14, -2], [30, -14, 8], [-30, -14, 8]].map((q) => k.proyecta(cam, q));
    if (suelo.every(Boolean)) {
      g.save();
      g.globalAlpha = dentro;
      g.beginPath();
      g.moveTo(suelo[0].x, suelo[0].y);
      for (let i = 1; i < 4; i++) g.lineTo(suelo[i].x, suelo[i].y);
      g.closePath();
      const sg = g.createLinearGradient(0, suelo[0].y, 0, suelo[2].y);
      sg.addColorStop(0, "#3a2a22");
      sg.addColorStop(1, "#1a120e");
      g.fillStyle = sg;
      g.fill();
      g.strokeStyle = "rgba(212,150,70,0.45)";
      g.lineWidth = 5;
      for (let i = 0; i < 6; i++) {
        const x = -22 + i * 8.8;
        const a = k.proyecta(cam, [x, -14, -1]);
        const b = k.proyecta(cam, [x, -14, 6]);
        if (!a || !b) continue;
        g.beginPath();
        g.moveTo(a.x, a.y);
        g.lineTo(b.x, b.y);
        g.stroke();
      }
      g.restore();
    }
  }

  const cosas = [];
  const esquinas = [[-26, -16, -8], [26, -16, -8], [26, 18, -8], [-26, 18, -8]].map((q) => k.proyecta(cam, q));
  if (dentro > 0.25 && esquinas.every(Boolean)) {
    const zc = esquinas.reduce((s, p) => s + p.z, 0) / 4;
    cosas.push({ z: zc + 2, dibuja: () => { g.save(); g.globalAlpha = dentro; m.chasis(g, esquinas); g.restore(); } });
  }

  poner(cosas, cam, [-30, -2, 4], (p) => {
    if (dentro > 0.4) return;
    const h = k.tamano(18, p.z);
    g.save();
    g.globalAlpha = 1 - dentro;
    m.lampara(g, p.x, p.y, h, t);
    g.restore();
  });

  poner(cosas, cam, [0, -16, 6], (p) => {
    if (dentro > 0.35 || t < tFriend - 0.4) return;
    const h = k.tamano(8, p.z);
    g.save();
    g.globalAlpha = k.suave(k.tramo(t, tFriend - 0.4, tFriend + 0.15)) * (1 - dentro);
    m.sofa(g, p.x, p.y, h);
    g.restore();
  });

  const enc = moderno(t);
  for (let i = 0; i < 6; i++) {
    const base = posTubo(i, t);
    const top = [base[0], base[1] + ALTO_TUBO * (1 - enc * 0.92), base[2]];
    const p = k.proyecta(cam, base);
    const q = k.proyecta(cam, top);
    if (!p || !q) continue;
    const h = Math.hypot(q.x - p.x, q.y - p.y);
    const x = (p.x + q.x) / 2;
    const y = (p.y + q.y) / 2;
    const z = (p.z + q.z) / 2;
    const encogiendo = k.suave(k.tramo(t, tShrank - 0.35, tShrank + 0.15)) * (1 - k.suave(k.tramo(t, tChip + 0.05, tChip + 0.45)));
    const al = (1 - enc * 0.97) * Math.max(dentro, encogiendo);
    if (h < 8 || al < 0.03) continue;
    cosas.push({
      z: z - 14 * enc,
      dibuja: () => {
        g.save();
        g.globalAlpha = Math.min(1, al);
        m.tubo(g, x, y, h, calor(i, t));
        g.restore();
      },
    });
  }

  poner(cosas, cam, [0, -1, 1.5], (p) => {
    const h = k.tamano(30, p.z);
    const cristal = k.suave(k.tramo(h, 2400, 4200));
    if (cristal > 0.92) return;
    g.save();
    g.globalAlpha = 1 - cristal;
    m.tele(g, p.x, p.y, h, enc, separa(t) * oroBrillo(t), canal(t), k.pulso(t, tLight + 0.32, 0.1) + k.pulso(t, tPhone + 0.2, 0.08), cristal);
    g.restore();
  });

  const sep = separa(t);
  if (sep > 0.02 && enc < 0.4) {
    poner(cosas, cam, [16 + sep * 10, -1, 4], (p) => {
      const h = k.tamano(28, p.z) * (0.55 + 0.45 * sep);
      m.tercio(g, p.x, p.y, h, sep * (1 - enc));
    });
  }

  const gol = martillo(t);
  const fn = fino(t);
  poner(cosas, cam, [16, -8, 18], (p) => {
    const h = k.tamano(11, p.z);
    if (t > tPhone + 0.2) return;
    const al = t > tHam ? 1 - k.suave(k.tramo(t, tHam + 0.15, tPhone)) : 1;
    g.save();
    g.globalAlpha = al;
    m.mando(g, p.x, p.y, h, fn, gol.ang, gol.hit);
    g.restore();
  });

  if (t > tBat - 0.12) {
    const pp = posPilas(t);
    poner(cosas, cam, pp, (p) => {
      const h = k.tamano(10, p.z);
      const al = k.suave(k.tramo(t, tBat - 0.05, tBat + 0.12));
      g.save();
      g.globalAlpha = al;
      m.pila(g, p.x - h * 0.28, p.y, h, -0.15);
      m.pila(g, p.x + h * 0.28, p.y + h * 0.08, h * 0.96, 0.18);
      g.restore();
    });
  }

  const llegaMovil = k.entra(k.tramo(t, tPhone - 0.55, tPhone + 0.15));
  if (llegaMovil > 0.01) {
    const py = k.mez(8, -6, llegaMovil);
    poner(cosas, cam, [0, py, 10], (p) => {
      const h = k.tamano(15, p.z);
      const pulgar = k.pulso(t, tPhone, 0.16) + k.pulso(t, tApp, 0.16) + 0.35 * k.suave(k.tramo(t, tBio, tFriend));
      m.movil(g, p.x, p.y, h, pulgar);
    });
  }

  k.deLejosACerca(cosas);

  // la nota aguda, en pantalla, de fuera hacia las válvulas
  const onda = k.tramo(t, tHigh - 0.45, tEar + 0.12);
  if (onda > 0 && onda < 1) {
    const centro = k.proyecta(cam, [0, 2, 0]) || { x: 540, y: 980 };
    const x = k.mez(1180, centro.x, k.entra(onda));
    const y = k.mez(780, centro.y, k.entra(onda));
    const al = Math.sin(Math.min(1, onda) * Math.PI);
    m.nota(g, x, y, Math.max(0.35, al), k.suave(k.tramo(t, tHigh - 0.2, tHear)));
  }

  const al30 = k.suave(k.tramo(t, tThird2 - 0.05, tThird2 + 0.22)) * (1 - k.suave(k.tramo(t, tPrice + 0.45, tPrice + 0.85)));
  if (al30 > 0.02 && enc < 0.3) {
    const ancla = k.proyecta(cam, [20, 6, 4]);
    if (ancla) k.pastilla(g, Math.min(860, ancla.x), Math.max(640, Math.min(1100, ancla.y)), "30%", "", "255,214,120", al30, 96);
  }

  m.velo(g, 0.85 + 0.15 * dentro);

  // los destellos violeta, cortos, entre el mando y la ventanita
  if (t > tLight - 0.08 && t < tSee - 0.15) {
    const a = k.proyecta(cam, [16, -2, 18]);
    const b = k.proyecta(cam, [0, -10, 2]);
    if (a && b) {
      for (const retraso of [0, 0.1, 0.2, 0.32]) {
        const u = k.tramo(t, tLight - 0.02 + retraso, tLight + 0.26 + retraso);
        if (u <= 0 || u >= 1) continue;
        const x = k.mez(a.x, b.x, u);
        const y = k.mez(a.y, b.y, u);
        k.brillo(g, x, y, 90 + 40 * Math.sin(u * 3), "violeta", Math.sin(u * Math.PI));
      }
    }
  }
}
