// 2009: la galleta, los catorce perros, el dueño que regaña y la cara que sale igual. Mismo salón, la cámara viaja.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
export const desde = f4.inicio;

const tr = k.tramo, su = k.suave, mez = k.mez;
const BX = 470, AX = 372, OWX = 292, RX = 228; // hero (el que no la come), el que sí, dueño, investigadora
const HORA = 0.45;

// ---------------------------------------------------------------- tiempos de la voz
const tGalleta = f4.t("galleta"), tCatorce = f4.t("catorce"), tDuenos = f4.t("duenos"), tNo = f4.t("no");
const tVolver = f5.t("volver"), tComido5 = f5.t("comido");
const tMentira = f6.t("mentira"), tGalleta6 = f6.t("galleta"), tEntera = f6.t("entera");
const tEnf7 = f7.t("enfadaba"), tCara7 = f7.t("cara"), tComido7 = f7.t("comido"), tHub7 = f7.t("hubiera"), tO7 = f7.t("o");
const tNada = f8.t("nada"), tRecibia = f9.t("recibia"), tContento = f9.t("contento"), tMucho = f9.t("mucho");
const tCoMo = f10.t("como"), tTi = f10.t("ti"), tCalmarte = f11.t("calmarte"), tFunciona = f11.t("funciona");

// ---------------------------------------------------------------- andar sin patinar
// De x0 a x1 entre t0 y t1, a velocidad constante: un ciclo de paso = una zancada (92 cm).
function anda(t, t0, t1, x0, x1) {
  const u = Math.max(0, Math.min(1, (t - t0) / (t1 - t0))), x = mez(x0, x1, u);
  const dentro = t > t0 && t < t1;
  const paso = dentro ? Math.min(1, (t - t0) / 0.12, (t1 - t) / 0.12) : 0;
  return { x, dir: x1 >= x0 ? 1 : -1, fase: Math.abs(x - x0) / 92, paso: Math.max(0, paso) };
}
const mueve = (a) => a.paso > 0.001;

// ---------------------------------------------------------------- el dueño
const OW_IN = [14.45, tDuenos + 0.7 + 0.0];
const OW_IN1 = 15.62, OW_OUT0 = 16.75, OW_OUT1 = 17.4, OW_BACK0 = 17.65, OW_BACK1 = 18.3;
const OW_WALK0 = tCalmarte + 0.12, OW_WALK1 = tCalmarte + 1.0;

// enfado: 0 .. 1 (el aura roja y el dedo); calidez: 0 .. 1 (el aura cálida y el saludo)
function enfado(t) {
  const a = su(tr(t, 20.6, 21.7)) * (1 - su(tr(t, tRecibia - 0.1, tContento - 0.1)));
  const b = su(tr(t, tCoMo - 0.35, tCoMo + 0.5)) * (1 - su(tr(t, tCalmarte, tCalmarte + 0.9)));
  return Math.max(a, b);
}
function calidez(t) {
  const a = su(tr(t, tRecibia, tContento + 0.5)) * (1 - su(tr(t, f10.inicio - 0.1, f10.inicio + 0.9)));
  const b = su(tr(t, tCalmarte + 0.9, tFunciona + 0.5));
  return Math.max(a, b);
}
function dueno(t) {
  let w;
  if (t < OW_IN[0]) return null;
  if (t < OW_IN1) w = anda(t, OW_IN[0], OW_IN1, 120, OWX);
  else if (t < OW_OUT0) w = { x: OWX, dir: 1, fase: 0, paso: 0 };
  else if (t < OW_OUT1) w = anda(t, OW_OUT0, OW_OUT1, OWX, 196);
  else if (t < OW_BACK0) return null;
  else if (t < OW_BACK1) w = anda(t, OW_BACK0, OW_BACK1, 196, OWX);
  else if (t < OW_WALK0) w = { x: OWX, dir: 1, fase: 0, paso: 0 };
  else if (t < OW_WALK1) w = anda(t, OW_WALK0, OW_WALK1, OWX, 392);
  else w = { x: 392, dir: 1, fase: 0, paso: 0 };
  const en = enfado(t), ca = calidez(t);
  const reg1 = su(tr(t, tNo - 0.35, tNo - 0.1)) * (1 - su(tr(t, 16.55, 16.75))); // el dedo del «no la toquéis»
  const wag = Math.sin(t * 11);
  const escucha = su(tr(t, 18.5, 18.9)) * (1 - su(tr(t, tComido5 - 0.1, tComido5 + 0.1)));
  const recula = su(tr(t, tComido5 - 0.05, tComido5 + 0.3)) * (1 - su(tr(t, 20.7, 21.4)));
  // el dedo que regaña
  let mano = null, tira = 0, inclina = 0, boca = 0;
  const habla1 = su(tr(t, 15.6, 15.75)) * (1 - su(tr(t, 16.85, 16.95)));
  if (reg1 > 0.01) { mano = [w.x + 52 + 5 * wag, -122 + 4 * Math.abs(wag)]; tira = reg1; inclina = 0.07 * reg1; }
  inclina += 0.035 * escucha * Math.sin(t * 2.4) - 0.1 * recula;
  if (recula > 0.02) { mano = [w.x + 20, -150]; tira = recula; }
  if (en > 0.02) { mano = [w.x + 54 + 7 * wag, -124 + 5 * Math.abs(wag)]; tira = Math.max(tira, en); inclina = Math.max(inclina, 0.17 * en); }
  if (ca > 0.02) { mano = [w.x + 24 + 16 * Math.sin(t * 7), -184 + 4 * Math.cos(t * 7)]; tira = Math.max(tira * (1 - ca), ca); inclina = mez(inclina, -0.08, ca); }
  // acaricia
  const acar = su(tr(t, OW_WALK1, OW_WALK1 + 0.35)) * (1 - su(tr(t, 42.62, 42.72)));
  if (acar > 0.02) { mano = [w.x + 46 + 3 * Math.sin(t * 5), -112 + 5 * Math.sin(t * 5 + 1)]; tira = Math.max(tira * (1 - acar), acar); inclina = mez(inclina, 0.1, acar); }
  boca = Math.max(habla1 * (0.5 + 0.5 * Math.sin(t * 12)) * 0.65, en * (0.5 + 0.5 * Math.sin(t * 14)) * 0.85, ca * (0.5 + 0.5 * Math.sin(t * 7)) * 0.35);
  return { ...w, mano, tira, inclina, boca, en, ca };
}

// ---------------------------------------------------------------- la investigadora
function investigadora(t) {
  const t0 = 18.0, t1 = 18.85, s0 = 21.0, s1 = 21.8;
  if (t < t0 || t > s1 + 0.05) return null;
  let w;
  if (t < t1) w = anda(t, t0, t1, 90, RX);
  else if (t < s0) w = { x: RX, dir: 1, fase: 0, paso: 0 };
  else w = anda(t, s0, s1, RX, 100);
  const habla = su(tr(t, 18.95, 19.05)) * (1 - su(tr(t, 20.7, 20.8)));
  const dedo = su(tr(t, tComido5 - 0.5, tComido5 - 0.2)) * (1 - su(tr(t, s0 - 0.15, s0)));
  return { ...w, boca: habla * (0.5 + 0.5 * Math.sin(t * 12)) * 0.6, mano: dedo > 0.01 ? [w.x + 54 + 4 * Math.sin(t * 6), -118] : null, tira: dedo, inclina: 0.05 * dedo };
}

// ---------------------------------------------------------------- los perros
// Catorce, en tres filas (5, 5 y 4). El del medio de la segunda fila es el de siempre.
const GRID = (() => {
  const az = k.azar(88), L = [], filas = [[5, 0], [5, 40], [4, 80]];
  let n = 0;
  for (const [cant, y] of filas) for (let i = 0; i < cant; i++) { L.push({ x: BX + (i - (cant - 1) / 2) * 76, y, ph: az() * 6, ladea: (az() - 0.5) * 0.22, mira: (az() - 0.5) * 1.4, hero: y === 40 && i === 2, n: n++ }); }
  const orden = L.map((_, i) => i).sort(() => az() - 0.5);
  L.forEach((d, i) => (d.orden = orden[i]));
  return L;
})();

function culpaBFinal(t) {
  let c = su(tr(t, 26.0, tCara7 + 0.02));
  c *= 1 - su(tr(t, tMucho - 0.5, tMucho + 0.9));
  if (t >= f10.inicio) {
    const sube = su(tr(t, tCoMo + 0.1, tTi + 0.15)) * (1 - su(tr(t, tCalmarte + 0.3, tFunciona + 0.5)) * 0.5);
    c = Math.max(c, sube);
  }
  return Math.min(1, c);
}
function culpaA(t) {
  let c = su(tr(t, tHub7 + 0.25, tComido7 + 0.85));
  c = mez(c, 0.55, su(tr(t, f8.t("ponian") - 0.1, f8.t("mas") + 0.6)));
  c *= 1 - su(tr(t, tMucho - 0.5, tMucho + 0.9));
  return c;
}
const apareceA = (t) => k.entra(tr(t, tHub7 - 0.05, tHub7 + 0.3)) * (1 - su(tr(t, f10.inicio + 0.05, f10.inicio + 0.55)));
const felizDog = (t) => su(tr(t, tMucho, tMucho + 0.7)) * (1 - su(tr(t, f10.inicio, f10.inicio + 0.3)));

// ---------------------------------------------------------------- la cámara
export function camara(t) {
  const Z = k.claves([
    [f4.inicio, 4.6], [tCatorce - 0.45, 4.3], [tCatorce + 0.55, 2.7], [14.35, 2.7],
    [15.0, 3.2], [tNo + 1.4, 3.2], [tVolver + 0.8, 3.2], [19.2, 4.3],
    [20.95, 4.4], [tGalleta6 + 0.05, 5.4], [tEntera + 0.35, 5.3], [24.55, 3.2], [24.6, 3.2],
    [26.0, 3.2], [tCara7 - 0.05, 5.9], [tCara7 + 0.5, 5.8], [tHub7 + 0.1, 3.6], [tComido7 + 0.1, 4.4],
    [tO7 + 0.15, 4.4], [f7.fin, 3.6], [29.8, 3.6], [tNada - 0.35, 3.6], [tNada + 0.2, 6.0], [f8.fin, 5.9],
    [tRecibia - 0.05, 3.3], [tContento + 0.6, 3.5], [tMucho + 0.5, 4.0], [f9.fin, 4.0],
    [f10.inicio + 0.2, 3.3], [tCoMo, 3.2], [tTi - 0.35, 3.2], [tTi + 0.05, 10.5], [f10.fin, 10.2],
    [f11.inicio + 0.12, 4.2], [tCalmarte + 0.4, 3.1], [tFunciona, 3.0], [f11.fin, 3.0],
  ])(t);
  const cx = k.claves([
    [f4.inicio, 480], [tCatorce - 0.45, 478], [tCatorce + 0.55, 470], [14.35, 470],
    [15.0, 384], [tVolver + 0.8, 382], [19.2, 268], [20.95, 268], [tGalleta6 + 0.05, 470], [tEntera + 0.35, 470], [24.55, 382], [24.6, 382],
    [26.0, 382], [tCara7 - 0.05, 470], [tCara7 + 0.5, 470], [tHub7 + 0.1, 420], [tComido7 + 0.1, 372], [tO7 - 0.1, 372], [tO7 + 0.15, 470], [f7.fin, 428],
    [29.8, 410], [tNada - 0.35, 410], [tNada + 0.2, 470], [f8.fin, 470], [tRecibia - 0.05, 400], [tMucho + 0.5, 420], [f9.fin, 420],
    [f10.inicio + 0.2, 410], [tTi - 0.35, 410], [tTi + 0.05, 470], [f10.fin, 470], [f11.inicio + 0.12, 440], [tCalmarte + 0.4, 410], [f11.fin, 418],
  ])(t);
  const cy = k.claves([
    [f4.inicio, -60], [tCatorce - 0.45, -58], [tCatorce + 0.55, -13], [14.35, -13], [15.0, -95], [tVolver + 0.8, -95], [19.2, -100], [20.95, -100],
    [tGalleta6 + 0.05, -34], [tEntera + 0.35, -34], [24.55, -95], [26.0, -95], [tCara7 - 0.05, -86], [tCara7 + 0.5, -86], [tHub7 + 0.1, -85],
    [tNada + 0.2, -82], [f8.fin, -82], [tRecibia - 0.05, -92], [tMucho + 0.5, -78], [f10.inicio + 0.2, -92], [tTi - 0.35, -94], [tTi + 0.05, -101], [f10.fin, -100],
    [f11.inicio + 0.12, -80], [tCalmarte + 0.4, -96], [f11.fin, -96],
  ])(t);
  return { Z, cx, cy };
}


export function dibuja(g, t) {
  const c = camara(t);
  m.salon(g, c, t, HORA);
  m.ponVista(g, c);

  const du = dueno(t), inv = investigadora(t);
  const en = du ? du.en : 0, ca = du ? du.ca : 0;
  const vivo = Math.sin(t * 1.1);

  // --- el de siempre (el que no se la come)
  const reduce = su(tr(t, 12.95, 13.55)) * (1 - su(tr(t, 14.6, 15.2)));
  const sH = mez(1, 0.6, reduce), yH = mez(0, 40, reduce), xH = mez(BX, 470, reduce);
  const cB = culpaBFinal(t);
  const mirando = su(tr(t, 15.5, 15.8)) * (1 - su(tr(t, OW_OUT0 - 0.1, OW_OUT0 + 0.3))); // al cartel del dueño
  const alDueno = t > tComido5 - 2.4 ? -0.95 : 0;
  const alCielo = su(tr(t, tGalleta - 0.3, tGalleta + 0.05)) * (1 - su(tr(t, tGalleta + 0.35, tGalleta + 0.6)));
  const alSuelo = su(tr(t, tGalleta + 0.5, tGalleta + 0.8)) * (1 - su(tr(t, OW_IN[0] + 0.5, OW_IN[0] + 0.9)));
  const miraH = t > OW_IN[0] ? (t < OW_OUT0 ? -0.8 * mirando : alDueno) : 0;
  const lamB = (() => { const u = tr(t, tCara7 + 0.35, tCara7 + 1.1); return u > 0 && u < 1 ? u : 0; })();
  const felizH = felizDog(t) + su(tr(t, tFunciona + 0.15, tFunciona + 0.6));
  const hero = { x: xH, y: yH, escala: sH, t, culpa: cB, cola: (cB < 0.3 ? 0.55 : 0) * (1 - 0.0), lamido: lamB, cabeza: { mira: miraH, miraY: 0.9 * alSuelo - 0.8 * alCielo, ladea: 0.05 * vivo, ojo: Math.min(1, felizH) } };

  // el fondo de los perros de la rejilla (de atrás adelante), antes que el de siempre en su fila
  const hayRejilla = t > tCatorce - 0.1 && t < 15.0;
  const filas = [0, 40, 80];
  if (hayRejilla) {
    for (const y of filas) {
      for (const d of GRID.filter((q) => q.y === y)) {
        const pop = k.entra(tr(t, tCatorce + 0.07 * d.orden, tCatorce + 0.07 * d.orden + 0.28)) * (1 - su(tr(t, 14.5 + 0.03 * d.orden, 14.5 + 0.03 * d.orden + 0.25)));
        if (d.hero) { drawHero(g, hero, t, true); continue; }
        if (pop <= 0.01) continue;
        const s = 0.6 * pop;
        m.galleta(g, d.x + 6 * s, d.y + 28 * s, { s: 0.5 * pop, t });
        m.perroFrente(g, { x: d.x, y: d.y, escala: s, t: t + d.ph, culpa: 0, cola: 0.55, cabeza: { mira: d.mira, ladea: d.ladea } });
      }
    }
  } else {
    drawHero(g, hero, t, false);
  }

  // --- la gente (detrás de los perros si andan; el dueño siempre a la izquierda)
  if (inv) {
    m.persona(g, { recto: 1, x: inv.x, dir: inv.dir, paso: inv.paso, fase: inv.fase, t, inclina: inv.inclina, boca: inv.boca, mano: inv.mano, tira: inv.tira, chaqueta: m.BATA, pelo: "#7a4a2a" });
  }
  if (du) {
    m.auraEnfado(g, du.x, en, t);
    m.auraCalida(g, du.x, ca, t);
    m.persona(g, { recto: 1, x: du.x, dir: du.dir, paso: du.paso, fase: du.fase, t, inclina: du.inclina, boca: du.boca, mano: du.mano, tira: du.tira });
  }

  // --- el que sí se la comió
  const aA = apareceA(t);
  if (aA > 0.01) {
    m.galleta(g, AX + 6, 30, { s: 1.0 * aA, comida: 1, t });
    const felA = felizDog(t);
    m.perroFrente(g, { x: AX, y: 0, escala: aA, t: t + 1.7, culpa: culpaA(t), cola: culpaA(t) < 0.3 ? 0.55 : 0, lamido: 0, cabeza: { mira: -0.9, ladea: -0.04 * vivo, ojo: felA } });
  }

  // la luz de «ven» en el ojo del perro cuando mira al dueño enfadado
  const ven = su(tr(t, tTi - 0.35, tTi + 0.05)) * (1 - su(tr(t, tCalmarte, tCalmarte + 0.5))) * en;
  if (ven > 0.01 && t >= tTi - 0.4) {
    for (const s of [-1, 1]) k.brillo(g, 470 + s * 9.5 - 1.5, -101 + 0.5 + 6 * cB, 22, "255,70,40", 0.8 * ven);
  }
  m.velo(g, 0.35);
}

function drawHero(g, hero, t, enRejilla) {
  // la galleta, delante del perro (se queda: es la misma todo el rato)
  const cae = tr(t, tGalleta - 0.12, tGalleta + 0.2);
  const baja = cae * cae;
  const rebote = tr(t, tGalleta + 0.2, tGalleta + 0.5);
  const hop = rebote > 0 && rebote < 1 ? -5 * Math.sin(rebote * Math.PI) : 0;
  const y = t < tGalleta - 0.12 ? -999 : mez(-300, 24, baja) + hop;
  const dest = su(tr(t, tGalleta6 + 0.1, tGalleta6 + 0.35)) * (1 - su(tr(t, tEntera + 0.45, tEntera + 0.8)));
  const s = hero.escala;
  m.perroFrente(g, hero);
  if (y > -900) m.galleta(g, hero.x + (y < 24 ? 0 : 0), hero.y + y * s + 0, { s: 1.0 * s, destello: dest, t });
}
