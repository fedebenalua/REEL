// «...y las eléctricas se preparan.»
// La subestación otra vez (la misma del plano 4), con sus torres y su transformador, y la aurora encima. Corte en «las».
// - «las eléctricas»: por los cables llega poca corriente, cada vez menos: los pulsos se apagan.
// - «se preparan»: el transformador se queda frío (un brillo azul tranquilo), aunque la aurora siga en el cielo.
import * as k from "#kit";
import { v } from "#voz";
import { NPOSTES, auroras, cable, cielo, enganches, horizonteDe, suelo, torreAlta, trazo, transformador, zPoste, LX } from "../mundo.js";

const f8 = v.frase(8);
export const desde = f8.t("las");

const { suave, tramo } = k;
const Tlas = f8.t("las"), Tpre = f8.t("preparan"), Tfin = f8.fin;
const TR = [LX - 4.5, 0, zPoste(3) + 2];

const camara = k.ruta([
  [Tlas - 0.1, { pos: [TR[0] + 4.5, 3.6, TR[2] + 11], mira: [TR[0] - 0.5, 4.2, TR[2] - 6] }],
  [Tfin + 0.3, { pos: [TR[0] + 5.5, 4.2, TR[2] + 14], mira: [TR[0] - 0.5, 4.8, TR[2] - 6] }],
]);
const bajantes = () => enganches(3, 1).map((p, q) => [p, [TR[0] - 1.5 + q * 3 * 0.5, 6.6, TR[2]]]);

export function dibuja(g, t) {
  const cam = camara(t), hz = horizonteDe(cam);
  cielo(g, t, 1, 0, "90,255,150", hz);
  auroras(g, t, 1, hz - 60);
  suelo(g, t, 1, 0, "90,255,150", hz);
  const corriente = 0.6 * (1 - suave(tramo(t, Tlas + 0.1, Tpre + 0.2)));
  const frio = suave(tramo(t, Tpre - 0.3, Tpre + 0.4));
  const cosas = [];
  for (let i = NPOSTES - 1; i >= 0; i--) {
    const z = k.proyecta(cam, [LX, 5, zPoste(i)]);
    cosas.push({ z: z ? z.z : -1e9, dibuja: () => {
      for (let q = 0; q < 2; q++) {
        const A = enganches(i, 1)[q], B = enganches(i + 1, 1)[q], pts = cable(cam, A, B, 1.75);
        if (!pts) continue;
        trazo(g, pts, "rgba(18,26,30,0.95)", 3.6);
        if (corriente > 0.01) {
          g.save(); g.globalCompositeOperation = "lighter";
          trazo(g, pts, `rgba(255,210,110,${0.45 * corriente})`, 3);
          const u = (((t - Tlas) * 1.6 - i * 0.25 + q * 0.13) % 1 + 1) % 1, j = Math.min(11, Math.floor(u * 12));
          const a = pts[j], b = pts[j + 1];
          if (a && b) { const f = u * 12 - j; k.brillo(g, a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, Math.min(260, Math.max(70, (k.F / a.z) * 5)), "255,214,120", corriente * Math.sin(Math.PI * u)); }
          g.restore();
        }
      }
      torreAlta(g, cam, i, 1);
    } });
  }
  const P = k.proyecta(cam, TR);
  if (P) cosas.push({ z: P.z - 0.1, dibuja: () => {
    const s = k.F / P.z;
    transformador(g, P.x, P.y, s, 0, t, frio);
    for (const [A, B] of bajantes()) {
      const pts = cable(cam, A, B, 0.2);
      if (pts) trazo(g, pts, "rgba(18,26,30,0.95)", 3.5);
    }
  } });
  k.deLejosACerca(cosas);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(2,4,12,0.45)"); vg.addColorStop(1, "rgba(2,4,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
