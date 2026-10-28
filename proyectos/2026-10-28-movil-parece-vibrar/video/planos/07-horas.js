// En ese hospital: más horas con el aparato encima, más les pasaba. Tres bolsillos, tres tardes.
import * as k from "#kit";
import { v } from "#voz";
import { anillos, movil, sillaVaquera, velo, ventana } from "../mundo.js";

export const desde = (v) => v.frase(9).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(9);
const Thoras = f.t("horas");
const Tmas = f.t("mas", 2);

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, f.fin - 0.35));
  const a1 = k.pulso(t, f.inicio + 0.35, 0.12);
  const a2 = k.pulso(t, Thoras, 0.14);
  const a3 = k.pulso(t, Tmas, 0.16);
  ventana(g, u);
  const sitios = [
    { x: 250, arco: 0.25, anillo: a1, w: 180 },
    { x: 540, arco: 0.55, anillo: a2, w: 200 },
    { x: 800, arco: 1, anillo: a3, w: 220 },
  ];
  for (const p of sitios) {
    const llega = k.suave(k.tramo(u, p.arco * 0.15, p.arco * 0.15 + 0.2));
    sillaVaquera(g, p.x, 1500, 1.15);
    movil(g, p.x, 1240, p.w, -0.08, { al: 0.45 + llega * 0.55 });
    anillos(g, p.x, 1240, t, p.anillo, 0.48);
    g.strokeStyle = `rgba(255,236,180,${0.45 + llega * 0.5})`;
    g.lineWidth = 14;
    g.beginPath();
    g.arc(p.x, 820, 78, Math.PI, Math.PI + Math.PI * p.arco * Math.max(u, 0.08), false);
    g.stroke();
  }
  velo(g, 0.55);
}
