// La pregunta, pegados al germen, y enseguida la pantalla del programa de medicinas.
// Del fotograma 0 al final de la pregunta estamos DENTRO del cristal: el germen llena la pantalla y viene hacia nosotros.
// Luego la cámara sale, se ve el ordenador, y las moléculas se quedan detrás del cristal.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, vineta, vista, sinVista, germen, molecula, capsula, pantalla, cristal, vial, reloj } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tpel = f1.t("peligrosa");
const T2 = f2.inicio, Tpro = f2.t("programa"), Tprop = f2.t("propuso"), Tcua = f2.t("cuarenta");
const Ttox = f2.t("toxicas"), Tseis = f2.t("seis"), Thoras = f2.t("horas");
const Tfab = f3.t("fabrico"), Tuna = f3.t("una"), Tfoto = f3.t("foto");
const finMov = Tfoto - 0.28;

const SX = 150, SY = 530, SW = 780, SH = 700;
const az = k.azar(41);
const GOTAS = Array.from({ length: 56 }, (_, i) => ({
  x: 40 + az() * (SW - 80),
  y: 50 + az() * (SH - 110),
  r: 16 + az() * 22,
  n: i,
  fase: az() * 6.28,
}));
const RAYOS = Array.from({ length: 80 }, () => {
  const a = az() * 6.2832;
  const r = 40 + Math.pow(az(), 0.55) * 520;
  return { x: 540 + Math.cos(a) * r, y: 980 + Math.sin(a) * r, c: az() < 0.5 ? "255,80,150" : "120,220,255", w: 2 + az() * 3 };
});

const { suave: su, tramo: tr, mez, entra, pulso } = k;

function cam(t) {
  const dentro = 1 - su(tr(t, T2 - 0.05, Tpro + 0.2));
  const Z = mez(1.42, 2.95, dentro);
  const cy = mez(990, 900, dentro);
  return { Z, cx: 540, cy };
}

function cuenta(t) {
  const u = su(tr(t, Tprop, Ttox));
  return Math.round(mez(0, 40000, u));
}

export function dibuja(g, t) {
  const tt = Math.min(t, finMov);
  const c = cam(t);
  fondo(g, "120,30,90");
  vista(g, c.Z, c.cx, c.cy);

  // la mesa, oscura, con el resplandor de la pantalla
  g.fillStyle = "#1a1020";
  g.fillRect(0, 1280, 1080, 700);
  const mesa = g.createLinearGradient(0, 1280, 0, 1600);
  mesa.addColorStop(0, "#3a2040");
  mesa.addColorStop(1, "#120810");
  g.fillStyle = mesa;
  g.fillRect(80, 1320, 920, 280);
  g.fillStyle = "rgba(255,80,140,0.18)";
  g.fillRect(80, 1320, 920, 16);

  pantalla(g, SX, SY, SW, SH, 1);

  // contenido del cristal
  g.save();
  g.beginPath();
  g.rect(SX, SY, SW, SH);
  g.clip();
  g.fillStyle = "#07010c";
  g.fillRect(SX, SY, SW, SH);

  const encoge = su(tr(tt, T2, Tpro + 0.05));
  const rG = mez(340, 78, encoge);
  const xG = mez(540, SX + 110, encoge);
  const yG = mez(900, SY + 250, encoge);
  const golpe = pulso(t, Tpel + 0.08, 0.07);
  const aplasta = 1 - 0.16 * golpe;
  germen(g, xG, yG, rG, t * 0.55, 1, aplasta);

  // cápsulas de medicina, y luego la lluvia de moléculas
  const lleganCaps = su(tr(tt, Tpro - 0.05, Tprop));
  const explotan = su(tr(tt, Tprop, Tprop + 0.45));
  for (let i = 0; i < 7; i++) {
    const al = lleganCaps * (1 - explotan);
    if (al < 0.02) continue;
    const x = SX + 110 + i * 95;
    const y = SY + SH * 0.42 + Math.sin(t * 2 + i) * 6 * (1 - lleganCaps);
    capsula(g, x, mez(SY - 80, y, llegaEntrada(lleganCaps)), 78, -0.15 + i * 0.04, al);
  }
  const rojas = su(tr(tt, Ttox - 0.05, Ttox + 0.35));
  const salida = su(tr(tt, Tfab, Tuna - 0.05));
  const rebote = su(tr(tt, Tuna - 0.12, Tuna + 0.28));
  const fuera = salida * (1 - rebote);
  for (const d of GOTAS) {
    const aparece = su(tr(tt, Tprop + (d.n % 8) * 0.03, Tprop + 0.55 + (d.n % 8) * 0.03));
    if (aparece < 0.02) continue;
    const tipo = d.n % 5 === 0 && rojas < 0.5 ? "oro" : rojas > 0.35 ? "roja" : d.n % 2 ? "verde" : "oro";
    const salto = fuera * (30 + (d.n % 5) * 18);
    const flota = Math.sin(t * 1.7 + d.fase) * 7;
    molecula(g, SX + d.x, SY + d.y + flota - salto, d.r * (0.4 + 0.6 * aparece), tipo, aparece);
  }

  // el cuarenta mil, quieto desde «tóxicas»
  const alNum = su(tr(tt, Tcua - 0.15, Tcua + 0.1));
  if (alNum > 0.02) {
    const n = t < Ttox ? cuenta(tt) : 40000;
    k.pastilla(g, SX + SW / 2, SY + SH - 130, k.fmt(n), "", "255,170,190", alNum, 78);
  }
  // el reloj de las seis horas, en una esquina, y se para
  const alRel = su(tr(tt, Tseis - 0.2, Tseis + 0.15)) * (1 - su(tr(t, Tfoto - 0.45, Tfoto - 0.2)));
  if (alRel > 0.02) {
    const horas = mez(9, 15, su(tr(tt, Tseis - 0.05, Math.min(Thoras + 0.15, finMov))));
    reloj(g, SX + SW - 90, SY + 90, 58, horas, alRel);
  }
  g.restore();

  cristal(g, SX, SY, SW, SH, 0.08 + 0.32 * su(tr(t, T2, Tpro + 0.2)) + 0.55 * golpe);

  // el vial de la mesa, vacío: no fabricó ni una
  const alVial = su(tr(tt, Tfab - 0.05, Tfab + 0.25));
  vial(g, 270, 1365, 210, alVial, 0);

  // anillo del golpe contra el cristal
  if (golpe > 0.05) {
    g.save();
    g.strokeStyle = `rgba(255,255,255,${golpe})`;
    g.lineWidth = 10;
    g.beginPath();
    g.arc(540, 900, 200 + (1 - golpe) * 280, 0, 7);
    g.stroke();
    g.restore();
  }

  sinVista(g);
  // estelas del viaje, solo mientras estamos dentro
  const alViaje = 1 - su(tr(t, Tpel + 0.02, T2 + 0.2));
  if (alViaje > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const d = t * 900;
    for (const r of RAYOS) {
      const x1 = 540 + (r.x - 540) * (1 + d / 1400);
      const y1 = 980 + (r.y - 980) * (1 + d / 1400);
      const x0 = 540 + (r.x - 540) * (1 + (d - 40) / 1400);
      const y0 = 980 + (r.y - 980) * (1 + (d - 40) / 1400);
      g.strokeStyle = `rgba(${r.c},${alViaje * 0.8})`;
      g.lineWidth = r.w * 2;
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      g.stroke();
    }
    g.restore();
  }
  vineta(g, 0.45);
  velo(g, 0.82);
}

function llegaEntrada(u) {
  return entra(u);
}
