// «La NASA ya tiene cerca del noventa y cinco por ciento de las de más de un kilómetro, y ninguna amenaza ahora.
// En dos mil veintidós, una nave chocó contra una pequeña y le cambió la órbita.
// Así que no es una profecía: es un golpe que ya vimos, y las grandes las vemos venir.
// Envíaselo a ese amigo que cada asteroide lo cuenta como el último día.»
// El vecindario de la Tierra: las rocas fichadas pasan de largo, una nave empuja una pequeña,
// y la grande —la misma del principio— se ve venir y no cae.
import * as k from "#kit";
import { v } from "#voz";
import { asteroide, cielo, nave, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;
export const entrada = "corte";

const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const T0 = f8.inicio;
const Tcinco = f8.t("cinco");
const Tninguna = f8.t("ninguna");
const Tnave = f9.t("nave");
const Tchoco = f9.t("choco");
const Torb = f9.t("orbita");
const Tvenir = f10.t("venir");
const Tamigo = f11.t("amigo");
const Fin = v.duracion;

const ROCAS = Array.from({ length: 10 }, (_, i) => ({
  fase: i * 0.9,
  radio: 1.55 + (i % 4) * 0.16,
  tam: 0.16 + (i % 3) * 0.04,
  inc: ((i % 5) - 2) * 0.42,
  sem: 40 + i,
  oscura: i === 7,
}));

const DIDY = [3.1, 0.05, 0.2];

const camara = k.ruta([
  [T0, { pos: [0.2, 2.8, 3.6], mira: [0, 0, 0] }],
  [Tcinco, { pos: [1.1, 2.3, 3.3], mira: [0, 0, 0] }],
  [Tninguna + 0.2, { pos: [-0.6, 2.0, 3.1], mira: [0.2, 0, 0] }],
  [Tnave - 0.1, { pos: [1.9, 0.42, 1.85], mira: DIDY }],
  [Tchoco + 0.05, { pos: [2.05, 0.32, 1.55], mira: [3.35, 0.05, 0.35] }],
  [Torb + 0.25, { pos: [1.95, 0.38, 1.7], mira: DIDY }],
  [Tvenir - 0.25, { pos: [0.1, 0.85, 3.5], mira: [0, -0.05, 0] }],
  [Tamigo, { pos: [0.05, 0.6, 3.25], mira: [0, -0.12, 0] }],
  [Fin, { pos: [-0.05, 0.45, 3.15], mira: [0, -0.18, 0] }],
]);

function marca(i, t) {
  if (ROCAS[i].oscura) return 0;
  const t0 = 37.1 + i * 0.16;
  return k.suave(k.tramo(t, t0, t0 + 0.28));
}

function luna(t) {
  const radio = k.mez(0.78, 0.62, k.suave(k.tramo(t, Tchoco + 0.2, Torb + 0.2)));
  const ang = 0.4 + t * 0.85;
  return {
    p: [DIDY[0] + Math.cos(ang) * radio, DIDY[1] + Math.sin(ang) * 0.08, DIDY[2] + Math.sin(ang) * radio],
    radio,
  };
}

function grande(t) {
  const u = k.suave(k.tramo(t, f10.inicio + 0.1, Tvenir + 0.15));
  const sigue = k.suave(k.tramo(t, Tvenir, Fin));
  return k.mezV(k.mezV([-2.4, -0.15, 2.7], [-0.95, -0.55, 1.45], u), [-0.2, -0.62, 1.7], sigue * 0.45);
}

function elipse(g, cam, centro, rx, ry, rz, al, color) {
  if (al <= 0.02) return;
  g.save();
  g.strokeStyle = `rgba(${color},${al})`;
  g.lineWidth = 3;
  g.beginPath();
  let on = false;
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const p = k.proyecta(cam, [centro[0] + Math.cos(a) * rx, centro[1] + ry, centro[2] + Math.sin(a) * rz]);
    if (!p) { on = false; continue; }
    if (!on) g.moveTo(p.x, p.y);
    else g.lineTo(p.x, p.y);
    on = true;
  }
  g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  const cam = camara(t);
  const antes = camara(t - 1 / 60);
  k.fondo(g, cam);
  k.estrellas(g, cam, antes, cielo);

  const cosas = [];
  const tierraP = k.proyecta(cam, [0, 0, 0]);
  if (tierraP) {
    cosas.push({
      z: tierraP.z,
      dibuja() {
        k.tierra(g, tierraP.x, tierraP.y, k.tamano(1, tierraP.z), t * 0.012, -0.8, -0.2);
      },
    });
  }

  ROCAS.forEach((r, i) => {
    const ang = r.fase + t * 0.22;
    const p = [Math.cos(ang) * r.radio, Math.sin(ang) * r.inc, Math.sin(ang) * r.radio];
    const pr = k.proyecta(cam, p);
    if (!pr) return;
    const m = marca(i, t);
    cosas.push({
      z: pr.z,
      dibuja() {
        k.roca(g, pr.x, pr.y, Math.max(8, k.tamano(r.tam, pr.z)), ang, r.sem, -0.4, -0.8, 0);
        if (m > 0.05) k.brillo(g, pr.x, pr.y, k.tamano(r.tam, pr.z) * 3.2, "amarilla", 0.7 * m);
      },
    });
  });

  // la pareja del ensayo: una roca y otra más pequeña, con su vuelta
  const dentro = k.suave(k.tramo(t, Tnave - 1.1, Torb + 0.4)) * (1 - k.suave(k.tramo(t, f10.inicio, f10.inicio + 0.8)));
  if (dentro > 0.04) {
    const L = luna(t);
    const pd = k.proyecta(cam, DIDY);
    const pl = k.proyecta(cam, L.p);
    if (pd) {
      cosas.push({
        z: pd.z,
        dibuja() {
          g.save();
          g.globalAlpha *= dentro;
          k.roca(g, pd.x, pd.y, k.tamano(0.32, pd.z), t * 0.4, 7, -0.3, -0.9, 0);
          g.restore();
        },
      });
    }
    if (pl) {
      cosas.push({
        z: pl.z - 0.01,
        dibuja() {
          g.save();
          g.globalAlpha *= dentro;
          k.roca(g, pl.x, pl.y, k.tamano(0.09, pl.z), t * 1.2, 12, -0.2, -0.7, t > Tchoco ? 0.4 * Math.exp(-(t - Tchoco) * 1.4) : 0);
          if (t > Tchoco && t < Tchoco + 1.1) k.estallido(g, pl.x, pl.y, t - Tchoco, "blanca", 0.35, 8, 40, 0);
          g.restore();
        },
      });
    }
    const lejos = [DIDY[0] - 1.6, DIDY[1] + 0.35, DIDY[2] + 1.5];
    const dest = luna(Tchoco).p;
    const uN = k.sale(k.tramo(t, Tnave - 0.75, Tchoco));
    if (t < Tchoco + 0.04 && uN > 0.02) {
      const pNave = k.mezV(lejos, dest, uN);
      const pn = k.proyecta(cam, pNave);
      const pd2 = k.proyecta(cam, dest);
      if (pn && pd2) {
        cosas.push({
          z: pn.z - 0.02,
          dibuja() {
            nave(g, pn.x, pn.y, 1.15, Math.atan2(pd2.y - pn.y, pd2.x - pn.x));
          },
        });
      }
    }
  }

  const verGrande = k.suave(k.tramo(t, f10.t("grandes") - 0.25, f10.t("grandes") + 0.35));
  if (verGrande > 0.03) {
    const gp = grande(t);
    const pg = k.proyecta(cam, gp);
    if (pg) {
      cosas.push({
        z: pg.z,
        dibuja() {
          g.save();
          g.globalAlpha *= verGrande;
          asteroide(g, pg.x, pg.y, k.tamano(0.72, pg.z), t * 0.35, 0);
          g.restore();
        },
      });
    }
  }

  k.deLejosACerca(cosas);

  // caminos que no tocan la Tierra, y la vuelta de la pequeña que se encoge
  g.save();
  if (dentro > 0.2 && t > Tnave - 0.5 && t < f10.inicio + 0.5) {
    const radio = luna(t).radio;
    elipse(g, cam, DIDY, radio, 0.08, radio, 0.7 * dentro, "120,220,255");
  }
  g.restore();

  veloArriba(g, 0.48);
}
