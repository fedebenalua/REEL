// «La explicación más aceptada: tu cerebro se adelanta a cada movimiento y calcula lo que vas a notar.»
// «Y lo que ya ve venir, lo siente más flojo: más o menos la mitad.»
// - El cerebro de luz, grande; en «cerebro» se enciende.
// - «adelanta»: una onda cian lo cruza de lado a lado, por delante: lo que espera notar. Se queda dibujada.
// - «ve venir»: llega la onda rosa de verdad y encaja con la cian; el cerebro se enciende de rosa.
// - «flojo»: la rosa se aplasta y el brillo del cerebro baja; «la mitad»: se queda a la mitad de alto, con el
//   fantasma de su altura de antes.
import * as k from "#kit";
import { v } from "#voz";
import { CIAN, ROSA, cerebro, frena, onda, velo, vineta } from "../mundo.js";

export const desde = (v) => v.frase(5).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const T0 = f5.inicio, Tcer = f5.t("cerebro"), Tade = f5.t("adelanta"), Tcal = f5.t("calcula");
const Tven = f6.t("venir"), Tflo = f6.t("flojo"), Tmit = f6.t("mitad"), Tfin = v.frase(7).inicio;

const motas = (() => { const az = k.azar(4411); return Array.from({ length: 70 }, () => ({ x: az() * 1080, y: az() * 1920, r: 1 + az() * 3, f: az() * 6 })); })();

export function dibuja(g, t) {
  const tf = frena(t, Tfin - 0.95, Tfin - 0.25);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#090a2a"); bg.addColorStop(0.5, "#1c0f45"); bg.addColorStop(1, "#07061a");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const m of motas) { g.fillStyle = `rgba(200,170,255,${0.25 + 0.2 * Math.sin(t * 1.5 + m.f)})`; g.beginPath(); g.arc(m.x, (m.y - t * 12) % 1920 + (m.y - t * 12 < 0 ? 1920 : 0), m.r, 0, 6.2832); g.fill(); }
  g.restore();
  // la cámara se acerca al cerebro mientras se explica
  const z = mez(0.82, 1.05, entra(tr(t, T0 - 0.05, Tade + 0.4))) * mez(1, 1.06, su(tr(t, Tade + 0.4, Tfin - 0.3)));
  const cx = 540, cy = 1060;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  const real = su(tr(t, Tven - 0.55, Tven + 0.25));
  const aplasta = su(tr(t, Tflo - 0.25, Tflo + 0.35));
  const luz = mez(0.55, 1, su(tr(t, Tcer - 0.2, Tcer + 0.3))) + 0.6 * real * (1 - aplasta * 0.6);
  cerebro(g, t, cx, cy, 0.95, luz);
  if (real > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, cx, cy - 60, 900, ROSA, 0.35 * real * (1 - 0.55 * aplasta)); g.restore(); }
  // la onda cian: lo que espera notar
  const x0 = 110, x1 = 970, y = 1080, A = 150;
  const cian = entra(tr(t, Tade - 0.15, Tade + 0.75));
  onda(g, x0, x1, y, A, cian, CIAN, 0.85 * (1 - 0.55 * real), tf * 4, 7);
  // la onda rosa de verdad: llega, encaja y se aplasta a la mitad
  const amp = A * mez(1, 0.5, aplasta);
  if (aplasta > 0.01) onda(g, x0, x1, y, A, 1, ROSA, 0.22 * aplasta, tf * 4, 5);
  onda(g, x0, x1, y, amp, real, ROSA, 1, tf * 4, 11);
  // la marca de la mitad: dos rayas, la altura de antes y la de ahora
  const marca = su(tr(t, Tmit - 0.3, Tmit + 0.1));
  if (marca > 0.01) {
    g.save(); g.globalAlpha = marca; g.setLineDash([18, 14]); g.lineWidth = 5;
    g.strokeStyle = "rgba(255,160,215,0.75)"; g.beginPath(); g.moveTo(x0, y - A); g.lineTo(x1, y - A); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.moveTo(x0, y - A * 0.5); g.lineTo(x1, y - A * 0.5); g.stroke();
    g.restore();
    k.pastilla(g, 540, 1420, "½", "", ROSA, marca, 110);
  }
  g.restore();
  vineta(g, 0.5); velo(g, 0.35);
}
