// «Detrás del ojo tiene un espejo: por eso le brillan en la oscuridad.»
// «Y aunque te vea borroso, sabe que eres tú: distingue tu voz de la de un desconocido.»
// La cara de tu gato, con una sola cámara. Se entra con un corte en «Detrás».
// - A oscuras: solo se le ven los ojos, con un brillo verde suave, y la pupila abierta del todo. La cámara se lanza
//   dentro del ojo izquierdo; al fondo, el espejo: un cuenco que brilla, verde y dorado, con los bastones de pie
//   encima. «tiene»: entra un rayo de luz por la pupila y baja; «espejo»: choca, el espejo se enciende y el rayo
//   rebota hacia arriba, verde, y pasa otra vez por los bastones.
// - «por eso»: la cámara sale por la pupila y en «brillan» los dos ojos se encienden verdes en la oscuridad.
// - «Y»: se enciende la luz; la misma cara, cálida, y la pupila se cierra.
// - «tu voz»: llegan ondas naranjas desde la izquierda: las orejas y la cabeza se giran hacia ellas. «desconocido»:
//   llegan ondas grises desde la derecha; las orejas ni se mueven, y sigue mirando hacia tu voz.
import * as k from "#kit";
import { v } from "#voz";
import { ancla, cara, enPupila, ESC_DENTRO, fondoCasa, OJOS } from "../mundo.js";

export const desde = "detras";

const { suave: su, tramo: tr, mez, azar } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const T0 = f5.inicio, Ttiene = f5.t("tiene"), Tesp = f5.t("espejo"), Tpor = f5.t("por"), Tbri = f5.t("brillan");
const Ty = f6.inicio, Tsabe = f6.t("sabe"), Tvoz = f6.t("voz"), Tdesc = f6.t("desconocido"), Fin6 = f6.fin;
const OJO = OJOS[0], CARA = [0, 110];
const Tin0 = T0 + 0.12, Tin1 = Ttiene - 0.02, Tout0 = Tpor - 0.12, Tout1 = Tbri + 0.05;
export const choque = Tesp + 0.02;

// ---------------------------------------------------------------- dentro del ojo
const azI = azar(5150);
const BASTONES = Array.from({ length: 26 }, (_, i) => ({ x: -40 + i * 46 + (azI() - 0.5) * 10, h: 110 + azI() * 40 }));
const fondoBol = (x) => 1300 + 300 * (1 - Math.pow((x - 540) / 700, 2)); // la curva del cuenco (y según x)
function interior(g, t, X, Y, W, H) {
  g.save(); g.translate(X, Y); g.scale(W / 1080, H / 1920);
  g.beginPath(); g.rect(0, 0, 1080, 1920); g.clip();
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#05060f"); bg.addColorStop(0.6, "#0b1024"); bg.addColorStop(1, "#071a1a");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  // la pupila, arriba: la entrada de la luz
  k.brillo(g, 540, 600, 520, "200,220,255", 0.35);
  g.fillStyle = "rgba(170,190,255,0.25)"; g.beginPath(); g.ellipse(540, 600, 150, 40, 0, 0, 6.2832); g.fill();
  // el rayo que entra (baja) y el que rebota (sube, verde)
  const baja = su(tr(t, Ttiene, choque)), sube = su(tr(t, choque + 0.06, choque + 0.55));
  const yb = fondoBol(540) - 40;
  const apaga = 1 - tr(t, Tbri - 0.1, Tbri + 0.25);
  if (baja > 0) k.haz(g, 540, mez(620, yb, baja), 620, "255,240,210", 0.7 * apaga, 34, false);
  // el espejo: se enciende en «espejo»
  const enc = su(tr(t, choque - 0.02, choque + 0.25));
  g.beginPath(); g.moveTo(-40, 1500); for (let x = -40; x <= 1120; x += 20) g.lineTo(x, fondoBol(x)); g.lineTo(1120, 1920); g.lineTo(-40, 1920); g.closePath();
  const eg = g.createLinearGradient(0, 1600, 1080, 1920);
  eg.addColorStop(0, k.mezColor("#123a36", "#1fbfa0", enc)); eg.addColorStop(0.5, k.mezColor("#13332a", "#9ef0a0", enc)); eg.addColorStop(1, k.mezColor("#1a2a10", "#e0c050", enc));
  g.fillStyle = eg; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.25 + 0.55 * enc;
  g.drawImage(k.causticas, -100 + Math.sin(t * 0.7) * 40, 1250, 1300, 700);
  g.restore();
  g.strokeStyle = `rgba(200,255,220,${0.25 + 0.7 * enc})`; g.lineWidth = 6;
  g.beginPath(); for (let x = -40; x <= 1120; x += 20) { const y = fondoBol(x); x === -40 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  // los bastones, de pie sobre el espejo: se encienden cuando pasa la luz (al bajar y al subir)
  for (const b of BASTONES) {
    const y0 = fondoBol(b.x), d = Math.abs(b.x - 540);
    const luz = Math.max(baja * Math.exp(-d / 160) * (t < choque + 0.3 ? 1 : 0.4), sube * Math.exp(-d / 200)) * apaga;
    g.save(); g.translate(b.x, y0);
    k.redondo(g, -14, -b.h, 28, b.h, 14);
    const bg2 = g.createLinearGradient(-11, 0, 11, 0); bg2.addColorStop(0, "#4a3a70"); bg2.addColorStop(0.5, "#a898e0"); bg2.addColorStop(1, "#3a2c60");
    g.fillStyle = bg2; g.fill();
    if (luz > 0.02) { g.fillStyle = `rgba(230,255,200,${0.8 * luz})`; g.fill(); }
    g.restore();
    if (luz > 0.05) k.brillo(g, b.x, y0 - b.h * 0.6, 110, "190,255,170", 0.6 * luz);
  }
  if (sube > 0) k.haz(g, 540, yb, mez(yb, 560, sube), "140,255,150", 0.8 * apaga, 56, true);
  // el choque
  k.fogonazo(g, 540, yb, t - choque, 900, "170,255,190");
  g.restore();
}

// ---------------------------------------------------------------- las ondas de la voz
// Arcos que salen de (sx, sy) hacia el gato, de t0 a t1, de un color.
function ondas(g, t, sx, sy, dir, t0, t1, color, ancho = 0.5) {
  if (t < t0 || t > t1 + 1.2) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; ; i++) {
    const ti = t0 + i * 0.16; if (ti > t1 || ti > t) break;
    const r = 300 + (t - ti) * 900, al = Math.max(0, 1 - (t - ti) / 0.75);
    if (al <= 0) continue;
    g.strokeStyle = `rgba(${color},${0.75 * al})`; g.lineWidth = 16;
    g.beginPath(); g.arc(sx, sy, r, dir - ancho, dir + ancho); g.stroke();
    g.strokeStyle = `rgba(${color},${0.25 * al})`; g.lineWidth = 46;
    g.beginPath(); g.arc(sx, sy, r, dir - ancho, dir + ancho); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- la cámara
function camara(t) {
  if (t < Tin0) return { esc: 0.95, F: CARA };
  if (t < Tout0) {
    const u = tr(t, Tin0, Tin1), w = su(u), f = su(Math.min(1, u * 1.6));
    return { esc: Math.exp(mez(Math.log(0.95), Math.log(ESC_DENTRO), w)), F: [mez(CARA[0], OJO[0], f), mez(CARA[1], OJO[1], f)] };
  }
  if (t < Ty) {
    const u = tr(t, Tout0, Tout1), w = su(u), f = su(tr(u, 0.35, 1));
    return { esc: Math.exp(mez(Math.log(ESC_DENTRO), Math.log(0.95), w)), F: [mez(OJO[0], CARA[0], f), mez(OJO[1], CARA[1], f)] };
  }
  // con la luz: se acerca un poco mientras escucha
  return { esc: mez(0.95, 1.08, su(tr(t, Ty, Fin6))), F: [0, mez(110, 60, su(tr(t, Ty, Fin6)))] };
}

export function dibuja(g, t) {
  const oscuro = 1 - su(tr(t, Ty, Ty + 0.35));
  g.fillStyle = "#000"; g.fillRect(0, 0, 1080, 1920);
  fondoCasa(g, 1 - 0.95 * oscuro);
  const { esc, F } = camara(t);
  const [x, y] = ancla(esc, F);
  // dentro del todo: solo el interior
  if (t > Tin1 && t < Tout0) { interior(g, t, 0, 0, 1080, 1920); return; }
  const noche = (t < Tpor ? 0.45 : mez(0.45, 1, su(tr(t, Tbri - 0.1, Tbri + 0.15)))) * oscuro * (1 - tr(esc, 2, 5));
  const pupila = mez(0.3, 1, oscuro);
  // la voz: la cabeza y las orejas se giran hacia ella (a la izquierda)
  const oye = su(tr(t, Tvoz + 0.1, Tvoz + 0.5));
  const vela = t < Tout0 ? 1 - su(tr(t, Tin1 - 0.2, Tin1)) : su(tr(t, Tout0, Tout0 + 0.25));
  cara(g, t, x, y, esc, {
    oscuro, noche, pupila: pupila + (0.25 * su(tr(t, Tsabe, Tsabe + 0.6)) - 0.1 * oye) * (1 - oscuro),
    gira: -0.35 * oye, inclina: -0.06 * oye + 0.13 * su(tr(t, Tsabe, Tsabe + 0.6)) * (1 - oye),
    mira: [-0.22 * oye, 0], orejas: [mez(0.05, 0.55, oye), mez(0.05, -0.25, oye) + 0.04 * k.pulso(t, Tdesc + 0.4, 0.1)],
    dentro: (c, px, py) => enPupila(c, px, py, (caja) => interior(c, t, ...caja), vela),
    cornea: 1 - tr(esc, 3, 7),
  });
  ondas(g, t, -380, 1050, -0.05, Tvoz - 0.15, Tvoz + 0.45, "255,165,70", 0.45);
  ondas(g, t, 1460, 1000, Math.PI + 0.05, Tdesc - 0.1, Tdesc + 0.5, "175,180,195", 0.45);
}

export const momentos = { choque };
