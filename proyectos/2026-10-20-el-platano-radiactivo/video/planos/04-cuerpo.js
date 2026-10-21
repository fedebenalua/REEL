// «tu cuerpo echa el potasio que le sobra. Lo más curioso: tú también eres radiactivo. Dentro de ti se rompen unos
// cinco mil átomos de potasio cada segundo: como trescientos plátanos juntos.»
// Otro sitio: tú, de cristal, de cuerpo entero. Corte en «tu».
// - «tu cuerpo echa el potasio que le sobra»: dentro, tu potasio (bolitas lilas); del plátano, a su lado, entran más
//   por la boca y bajan; en «echa», las mismas salen por abajo: lo de dentro no cambia.
// - «Lo más curioso»: la cámara se acerca; en «tú» se enciende de destellos verdes por todo el cuerpo; en
//   «radiactivo» brilla entero.
// - «cinco mil»: «5.000 por segundo». «trescientos»: la cámara se aleja y a su lado cae un montón de plátanos que
//   chispea igual: «300 plátanos».
import * as k from "#kit";
import { v } from "#voz";
import { CABEZA_DE_PIE, DE_PIE, SPRITE, atomo, cristal, destello, dentroDe, dibujaPlatanito, fondo, monton, platano, roturas, velo, vineta } from "../mundo.js";

export const desde = "tu";

const { suave: su, tramo: tr, mez, entra, azar, claves, lienzo } = k;
const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const T0 = f6.t("tu"), Techa = f6.t("echa"), Tfin6 = f6.fin;
const Tlo = f7.inicio, Ttu = f7.t("tu"), Trad = f7.t("radiactivo");
const Tcinco = f8.t("cinco"), Ttres = f8.t("trescientos"), Tfin8 = f8.fin, Tcorte = v.frase(9).inicio;

// tú: los pies en (540, 1440), 0,9 px por unidad
const CX = 540, PIES = 1440, ESC = 0.9;
const POTASIO = dentroDe([DE_PIE], CABEZA_DE_PIE, 260, 61);
const PUNTOS = dentroDe([DE_PIE], CABEZA_DE_PIE, 500, 62);
const CHISPAS = roturas(63, 42, Ttu - 0.05, Tcorte - 0.35);
// el montón de trescientos plátanos, a la derecha
const MONTON = monton(64, 300, 700, 420), PX = 1090, PY = PIES;
const CHISPAS_P = roturas(65, 40, Ttres + 0.3, Tcorte - 0.35);

const spriteLila = lienzo(64); atomo(spriteLila.getContext("2d"), 32, 32, 29, 0);

// la cámara
const lz = claves([[Tlo, Math.log(1.08)], [Ttu + 0.3, Math.log(1.3)], [Ttres - 0.1, Math.log(1.3)], [Ttres + 0.6, Math.log(0.74)]]);
const lcx = claves([[Ttres - 0.1, 540], [Ttres + 0.6, 760]]);
const lcy = claves([[Tlo, 960], [Ttu + 0.3, 900], [Ttres - 0.1, 900], [Ttres + 0.6, 1020]]);

// el camino de una bolita de potasio que entra: del plátano a la boca, y abajo hasta la tripa; y la que sale
const BOCA = [30, -870], TRIPA = [0, -420], ABAJO = [0, -300], FUERA = [0, 150];
const PL = [240, -800];
const lerp2 = (a, b, u) => [mez(a[0], b[0], u), mez(a[1], b[1], u)];

export function dibuja(g, t) {
  fondo(g, t, "120,170,255", 0.9);
  const Z = Math.exp(lz(t)), cx = lcx(t), cy = lcy(t);
  g.save(); g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
  // el suelo: un brillo azul bajo los pies
  k.brillo(g, CX, PIES, 900, "120,170,255", 0.5);
  // el montón (cae en «trescientos»)
  const cae = entra(tr(t, Ttres - 0.05, Ttres + 0.45));
  if (cae > 0) {
    g.save(); g.translate(PX, PY - (1 - cae) * 1500);
    for (const p of MONTON) dibujaPlatanito(g, p.x, p.y, 120 * p.esc, p.ang, p.flip);
    g.restore();
    if (cae >= 1) for (const r of CHISPAS_P) { if (r.t > t || t - r.t > 0.7) continue; const p = MONTON[Math.floor(r.a * 300)]; destello(g, PX + p.x, PY + p.y, t - r.t, 70, r.dir, 150); }
  }
  // tú
  g.save(); g.translate(CX, PIES); g.scale(ESC, ESC);
  const luz = su(tr(t, Ttu - 0.1, Trad + 0.3)) * (0.5 + 0.15 * su(tr(t, Trad - 0.1, Trad + 0.2)));
  k.brillo(g, 0, -500, 1900, "verde", luz * 0.6);
  cristal(g, [DE_PIE], CABEZA_DE_PIE, luz);
  // tu potasio
  for (const p of POTASIO) { const r = 9 + 2 * Math.sin(t * 2 + p.f); g.globalAlpha = 0.85; g.drawImage(spriteLila, p.x + Math.sin(t * 1.3 + p.f) * 5 - r, p.y + Math.cos(t * 1.1 + p.f) * 5 - r, r * 2, r * 2); }
  g.globalAlpha = 1;
  // lo que entra y lo que sale («echa»)
  const flujo = su(tr(t, T0 - 0.05, T0 + 0.3)) * (1 - su(tr(t, Tfin6 + 0.1, Tlo + 0.4)));
  if (flujo > 0) {
    for (let i = 0; i < 14; i++) {
      const u = ((t - T0) * 0.75 + i / 14) % 1;
      const p = u < 0.3 ? lerp2(PL, BOCA, u / 0.3) : lerp2(BOCA, TRIPA, (u - 0.3) / 0.7);
      g.globalAlpha = flujo; g.drawImage(spriteLila, p[0] - 20, p[1] - 20, 40, 40);
      const sale = su(tr(t, Techa - 0.1, Techa + 0.2));
      if (sale > 0) { const q = lerp2(ABAJO, FUERA, u); g.globalAlpha = flujo * sale * (1 - u); g.drawImage(spriteLila, q[0] - 20, q[1] - 20, 40, 40); }
    }
    g.globalAlpha = 1;
    // el plátano que da su potasio
    g.globalAlpha = flujo; platano(g, PL[0] + 70, PL[1] + 40, 320, -0.4, { giro: t * 0.6 }); g.globalAlpha = 1;
  }
  // los destellos: miles de átomos que se rompen dentro de ti
  for (const r of CHISPAS) {
    if (r.t > t || t - r.t > 0.7) continue;
    const p = PUNTOS[Math.floor(r.a * PUNTOS.length)];
    destello(g, p.x, p.y, t - r.t, 110, r.dir, 230);
  }
  g.restore();
  g.restore();
  // las cifras
  const a5 = su(tr(t, Tcinco - 0.1, Tcinco + 0.15)) * (1 - su(tr(t, Ttres - 0.2, Ttres + 0.1)));
  k.pastilla(g, 540, 1300, "5.000", "por segundo", "190,255,140", a5, 120);
  const a3 = su(tr(t, Ttres + 0.4, Ttres + 0.65));
  k.pastilla(g, 770, 1340, "300", "plátanos", "255,226,90", a3, 100);
  vineta(g, 0.5);
  velo(g, 0.55);
}
