// El salón: la película sale de un 3, la cinta rebota, la tele enseña su único agujero,
// el vídeo se vuelve una emisora y el interruptor elige 3 o 4.
import * as k from "#kit";
import { v } from "#voz";
import { aplica, sala, tele, pelicula, numero, cinta, vcr, torre, interruptor, mando, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const Treal = f1.t("real");
const Tchannel = f1.t("channel");
const Tinto = f2.t("into");
const Ttv2 = f2.t("tv");
const Thole = f3.t("hole");
const Tanten = f3.t("antenna");
const Tstation = f4.t("station");
const Tthree = f5.t("three");
const Tfour = f5.t("four");

function pantalla(g, sx, sy, sw, sh, t) {
  const abre = su(tr(t, 0, Treal));
  pelicula(g, sx, sy, sw, sh, t, 1);
  // el 3, partido desde el fotograma 0, se lee en «channel» y se abre del todo en «real»
  const sep = mez(18, sw * 0.42, abre);
  const alNum = 1 - su(tr(t, Treal - 0.15, Treal + 0.35));
  g.save();
  g.beginPath();
  g.rect(sx, sy, sw / 2, sh);
  g.clip();
  numero(g, "3", sx + sw / 2 - sep, sy + sh / 2, sh * 0.72, alNum);
  g.restore();
  g.save();
  g.beginPath();
  g.rect(sx + sw / 2, sy, sw / 2, sh);
  g.clip();
  numero(g, "3", sx + sw / 2 + sep, sy + sh / 2, sh * 0.72, alNum);
  g.restore();
  // la grieta de luz, ya abierta en el fotograma 0
  const grieta = mez(0.35, 1, abre);
  g.save();
  g.globalCompositeOperation = "lighter";
  const grd = g.createLinearGradient(sx + sw / 2, sy, sx + sw / 2, sy + sh);
  grd.addColorStop(0, `rgba(255,220,140,${0.15 * grieta})`);
  grd.addColorStop(0.5, `rgba(255,255,255,${0.85 * grieta})`);
  grd.addColorStop(1, `rgba(255,80,140,${0.2 * grieta})`);
  g.fillStyle = grd;
  g.fillRect(sx + sw / 2 - mez(10, 36, grieta), sy, mez(20, 72, grieta), sh);
  g.restore();
  // «three»: un 3 enorme entra al centro. «four»: se corre y el 4 llega desde fuera.
  if (t > Tthree - 0.3) {
    const llega3 = su(tr(t, Tthree - 0.15, Tthree + 0.4));
    const llega4 = su(tr(t, Tfour - 0.1, Tfour + 0.45));
    const x3 = mez(sx + sw * 0.5, sx + sw * 0.3, llega4);
    const tam3 = sh * mez(0.82, 0.46, llega4);
    numero(g, "3", x3, sy + sh * 0.5, tam3, llega3 * mez(1, 0.45, llega4));
    numero(g, "4", mez(sx + sw * 1.25, sx + sw * 0.72, llega4), sy + sh * 0.5, sh * 0.7, llega4);
  }
}

export function dibuja(g, t) {
  // la cámara sale de dentro de la pantalla hasta ver el salón
  const sale = su(tr(t, 0.05, Treal + 0.15));
  const z = mez(2.35, 1, sale);
  const fy = mez(810, 980, sale);
  const fx = mez(540, 540, sale);
  // la vuelta a la espalda de la tele, y la vuelta al frente
  const aEspalda = su(tr(t, f3.inicio + 0.05, Thole - 0.05));
  const aFrente = su(tr(t, f4.inicio, f4.inicio + 0.7));
  const giro = aEspalda * (1 - aFrente);
  // al volver, nos acercamos un poco al vídeo
  const alVcr = su(tr(t, Tstation - 0.8, Tstation + 0.2));
  // empuja hacia la pantalla mientras se elige el 3 o el 4, y se queda antes del corte
  const alCanal = su(tr(t, 12.3, 14.2));
  const z2 = mez(mez(z, 1.12, alVcr), 1.22, alCanal);
  const fy2 = mez(mez(fy, 1120, alVcr), 1060, alCanal);

  aplica(g, fx, fy2, z2);
  sala(g);

  const cableEnchufa = su(tr(t, Tanten - 0.05, Tanten + 0.45));
  tele(g, {
    x: 540, y: 820, giro, moderno: 0, t,
    pinta: (gg, sx, sy, sw, sh) => pantalla(gg, sx, sy, sw, sh, t),
  });

  // el cable de antena entra en el agujero de la espalda (el agujero vive dentro de la tele)
  if (giro > 0.55) {
    const al = su(tr(giro, 0.62, 0.85));
    const ancho = Math.max(0.08, Math.abs(Math.cos(giro * Math.PI)));
    const hx = 540 + 820 * 0.08 * ancho;
    const hy = 820 + 640 * 0.02;
    const punta = mez(hx + 90, hx, cableEnchufa);
    g.save();
    g.globalAlpha = al;
    g.strokeStyle = "#f4efe4";
    g.lineWidth = 16;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(1040, 1120);
    g.quadraticCurveTo(900, 980, punta, hy);
    g.stroke();
    g.fillStyle = "#f2c14e";
    g.beginPath();
    g.arc(punta, hy, 14, 0, 6.2832);
    g.fill();
    g.restore();
  }

  // el mando, en cuanto se ve el salón, y se va antes de que la tele enseñe la espalda
  const alMando = su(tr(t, Tchannel - 0.05, Tchannel + 0.4)) * (1 - su(tr(t, f3.inicio, Thole - 0.15)));
  if (alMando > 0.03) mando(g, 210, 1160, 0.92 * alMando, 0);

  vcr(g, 540, 1280, t > Tstation ? 1 : 0);

  // la cinta: choca con el cristal y cae al vídeo. Quieta antes del corte de idea.
  if (t > f2.inicio - 0.05 && t < f4.inicio + 0.4) {
    const u = tr(t, f2.inicio, Ttv2 + 0.35);
    let x, y, ang;
    if (u < 0.45) {
      const e = su(u / 0.45);
      x = mez(1100, 700, e);
      y = mez(420, 760, e);
      ang = mez(-0.4, 0.2, e);
    } else if (u < 0.7) {
      const e = su((u - 0.45) / 0.25);
      x = mez(700, 620, e);
      y = mez(760, 980, e);
      ang = mez(0.2, 0.8, e);
    } else {
      const e = su((u - 0.7) / 0.3);
      x = mez(620, 690, e);
      y = mez(980, 1268, e);
      ang = mez(0.8, 0.05, e);
    }
    const seVa = su(tr(t, f4.inicio, f4.inicio + 0.35));
    cinta(g, x, mez(y, 1268, seVa), mez(1, 0.15, seVa), ang);
  }

  // la torre diminuta crece en «station»
  const hTorre = mez(0, 260, su(tr(t, Tstation - 0.45, Tstation + 0.35)));
  if (hTorre > 2 && giro < 0.2) torre(g, 540, 1200, hTorre, t);

  // el interruptor, delante, en el 3 y luego en el 4
  if (t > Tthree - 0.35) {
    const al = su(tr(t, Tthree - 0.35, Tthree));
    const cual = su(tr(t, Tfour - 0.08, Tfour + 0.28));
    interruptor(g, 540, 1400, cual, al);
  }

  velo(g);
}
