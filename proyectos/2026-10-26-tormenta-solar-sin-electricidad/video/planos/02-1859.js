// «En 1859 ya pasó: el cielo se llenó de auroras y los telégrafos echaron chispas.»
// Otro sitio: una llanura de noche con una fila de postes de telégrafo que se pierde en el horizonte. Se entra con un
// corte en «En».
// - «En 1859»: la llanura, con un resplandor verde que ya asoma sobre el horizonte; «1859» en su pastilla.
// - «el cielo se llenó de auroras»: las cortinas verdes y rojas suben y llenan el cielo, y ondulan.
// - «los telégrafos echaron chispas»: los cables y los aisladores echan chispas, poste a poste, de cerca a lejos.
// La cámara avanza despacio junto a los postes todo el plano; antes del corte, las chispas se han apagado.
import * as k from "#kit";
import { v } from "#voz";
import { NPOSTES, auroras, cable, camLlanura, cielo, enganches, poste, suelo, trazo, HORIZONTE } from "../mundo.js";

const f2 = v.frase(2);
export const desde = f2.inicio;

const { suave, tramo } = k;
const T0 = f2.inicio, Tano = f2.t("1859"), Tcielo = f2.t("cielo"), Taur = f2.t("auroras"), Tchis = f2.t("chispas"), Tfin = f2.fin;
// cuándo salta cada chispa (de cerca a lejos), para el sonido
export const chispas = Array.from({ length: 6 }, (_, i) => Tchis - 0.12 + i * 0.07);

const camara = (t) => camLlanura(0, k.mez(22, 6, (u => 0.6 * u + 0.4 * suave(u))(tramo(t, T0 - 0.2, Tfin + 0.5))));
const azS = k.azar(18);
const CHISPAS = Array.from({ length: 16 }, () => ({ a: azS() * Math.PI * 2, v: 0.6 + azS() * 1.4, l: 0.3 + azS() * 0.7 }));

export function dibuja(g, t) {
  const cam = camara(t);
  const verdor = 0.25 + 0.75 * suave(tramo(t, Tcielo - 0.1, Taur + 0.5));
  cielo(g, t, verdor);
  auroras(g, t, verdor, HORIZONTE - 60);
  suelo(g, t, verdor);
  // los postes y sus cables, de lejos a cerca
  for (let i = NPOSTES - 1; i >= 0; i--) {
    for (let q = 0; q < 2; q++) {
      const pts = cable(cam, enganches(i, 0)[q], enganches(i + 1, 0)[q], 0.55);
      if (pts) trazo(g, pts, "rgba(20,30,34,0.95)", 2.4);
    }
    poste(g, cam, i, 1);
  }
  // las chispas, en cada aislador, poste a poste
  g.save(); g.globalCompositeOperation = "lighter";
  chispas.forEach((tc, i) => {
    const u = t - tc;
    if (u < 0 || u > 0.55) return;
    const e = Math.exp(-u * 7);
    for (const p of enganches(i, 0)) {
      const q = k.proyecta(cam, p);
      if (!q) continue;
      const s = k.F / q.z;
      k.brillo(g, q.x, q.y, s * 5, "200,230,255", e);
      k.brillo(g, q.x, q.y, s * 1.2, "255,255,255", e);
      g.strokeStyle = `rgba(220,240,255,${0.9 * e})`; g.lineWidth = Math.max(1.5, s * 0.05); g.lineCap = "round";
      for (const c of CHISPAS) {
        const d = s * c.v * Math.min(1, u * 6), x1 = q.x + Math.cos(c.a) * d, y1 = q.y + Math.sin(c.a) * d + s * 2 * u * u;
        g.beginPath(); g.moveTo(q.x + Math.cos(c.a) * d * (1 - c.l), q.y + Math.sin(c.a) * d * (1 - c.l)); g.lineTo(x1, y1); g.stroke();
      }
    }
    // el cable entre este poste y el siguiente se enciende un instante
    for (let q = 0; q < 2; q++) {
      const pts = cable(cam, enganches(i, 0)[q], enganches(i + 1, 0)[q], 0.55);
      if (pts) { trazo(g, pts, `rgba(170,215,255,${0.7 * e})`, 4); trazo(g, pts, `rgba(170,215,255,${0.2 * e})`, 14); }
    }
  });
  g.restore();
  // el año
  const al = suave(tramo(t, Tano - 0.05, Tano + 0.2)) * (1 - suave(tramo(t, Tcielo, Tcielo + 0.3)));
  k.pastilla(g, 540, 760, "1859", "", "255,236,190", al, 120);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(2,4,12,0.45)"); vg.addColorStop(1, "rgba(2,4,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
