// «Y más listas que todos juntos... eso ya es especulación.»
// El mundo del hook otra vez: el chip delante y el cerebro de oro de la humanidad detrás, sobre el mar de luces.
// Corte en «Y».
// - «más listas que todos juntos»: del chip sale una copia transparente que crece hasta ser más grande que el cerebro.
// - «eso ya es especulación»: la copia se queda en un contorno de rayas con una interrogación y se deshace; el chip
//   de verdad sigue igual. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, chip, CIELO, mar, segmento, CH, velo } from "../mundo.js";
import { B, RB, angB, C } from "./01-hook.js";

const f7 = v.frase(7);
export const desde = f7.t("y");

const { suave, tramo, mez } = k;
const T0 = f7.t("y"), Tlis = f7.t("listas"), Tjun = f7.t("juntos"), Teso = f7.t("eso"), Tesp = f7.t("especulacion"), Tfin = v.frase(8).inicio;

const camara = k.ruta([
  [T0, { pos: [0, 38, 72], mira: [0, -2, -60] }],
  [Tfin, { pos: [0, 44, 84], mira: [0, 0, -60] }],
]);
const aparte = k.lienzo(1080, 1920), ga = aparte.getContext("2d");

export function dibuja(g, t) {
  const cam = camara(t);
  k.fondo(g, cam);
  k.estrellas(g, cam, null, CIELO, 0.8);
  mar(g, cam, t);
  cerebro(g, cam, B, RB, angB(t), t);
  chip(g, cam, C, t);
  // la copia que crece: transparente, cian
  const crece = suave(tramo(t, Tlis - 0.15, Tjun + 0.3)), e = mez(1, 3.1, crece), sube = mez(0, 22, crece);
  const raya = suave(tramo(t, Teso - 0.1, Teso + 0.4)), va = suave(tramo(t, Tesp + 0.25, Tfin - 0.25));
  const al = crece * (1 - raya) * 0.5;
  if (al > 0.01) {
    ga.setTransform(1, 0, 0, 1, 0, 0); ga.globalAlpha = 1; ga.globalCompositeOperation = "source-over"; ga.clearRect(0, 0, 1080, 1920);
    chip(ga, cam, [0, sube, -20 * crece], t, { e, luz: 1.4 });
    g.save(); g.globalAlpha = al; g.globalCompositeOperation = "lighter"; g.drawImage(aparte, 0, 0); g.restore();
  }
  // el contorno de rayas y la interrogación
  const ca = raya * (1 - va);
  if (ca > 0.01) {
    const Ce = [0, sube, -20 * crece], W = (x, z) => [Ce[0] + x * e, Ce[1], Ce[2] + z * e];
    const esq = [W(-CH, -CH), W(CH, -CH), W(CH, CH), W(-CH, CH)];
    g.save(); g.setLineDash([26, 20]); g.lineDashOffset = -t * 60; g.strokeStyle = `rgba(150,230,255,${0.85 * ca})`; g.lineWidth = 6; g.lineCap = "round";
    g.shadowColor = "rgba(120,220,255,0.9)"; g.shadowBlur = 18;
    for (let i = 0; i < 4; i++) { const s = segmento(cam, esq[i], esq[(i + 1) % 4]); if (s) { g.beginPath(); g.moveTo(s[0].x, s[0].y); g.lineTo(s[1].x, s[1].y); g.stroke(); } }
    g.restore();
    const Q = k.proyecta(cam, [Ce[0], Ce[1] + 8, Ce[2]]);
    if (Q) {
      const pop = suave(tramo(t, Tesp - 0.15, Tesp + 0.2));
      g.save(); g.globalAlpha = ca * pop; g.font = `800 ${Math.round(260 * (0.7 + 0.3 * pop))}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
      g.shadowColor = "rgba(120,220,255,0.95)"; g.shadowBlur = 40; g.fillStyle = "#e8fbff"; g.fillText("?", Q.x, Math.max(640, Q.y)); g.restore();
    }
  }
  velo(g);
}
