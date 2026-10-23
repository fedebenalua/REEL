// El recibidor: la raya de la puerta sube por encima del perro.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "puerta";
export const entrada = "corte";

const f = v.frase(6);
const Traya = f.t("raya");
const Tencima = f.t("encima");
const Taltura = f.t("altura");
const Tcorte = v.t("segun");

const DOG = { x: -8, s: 1.05 };

export function dibuja(g, t) {
  const sube = k.suave(k.tramo(t, Traya + 0.05, Tencima + 0.35));
  const aparece = k.suave(k.tramo(t, Traya - 0.12, Traya + 0.28));
  const quieto = k.suave(k.tramo(t, Taltura - 0.05, Taltura + 0.35));
  const y1 = -46 * DOG.s;
  const y2 = -96 * DOG.s;
  const y = k.mez(y1, y2, sube);
  const mira = -0.45 * sube;

  const llega = k.suave(k.tramo(t, f.inicio, Traya));
  const Z = k.claves([
    [f.inicio, 7.1],
    [Traya, 9.6],
    [Taltura, 10.4],
    [Tcorte - 0.22, 10.2],
  ])(t);
  const c = { Z, cx: k.mez(8, 40, llega), cy: k.mez(-34, -54, k.mez(llega, sube, 0.5)) };

  m.recibidor(g, c);
  m.ponVista(g, c);
  // pared de azulejo claro detrás de la puerta
  g.save();
  g.globalAlpha = 0.9;
  g.fillStyle = "#fff4ea";
  g.fillRect(c.cx - 500, -220, 1000, 220);
  g.restore();
  m.puerta(g, 78);
  m.perro(g, {
    x: DOG.x, escala: DOG.s, marcha: 0, fase: 0, t, pataAlta: 0, pitch: -0.02,
    cola: 0.55, cabeza: { ang: mira, oreja: -0.08 * sube, ojo: 0 },
  });
  // la raya sale a la altura del lomo y trepa por encima de la cabeza
  const xR = 78 - 39 - 6;
  m.raya(g, xR, y, aparece * (0.55 + 0.45 * quieto), 36 + 8 * quieto);
  m.marco(g);
}
