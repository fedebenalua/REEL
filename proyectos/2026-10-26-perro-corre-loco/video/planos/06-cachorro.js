// «Pasa sobre todo de cachorro. Y a algunos, toda la vida.»
// Sale pequeño y disparado. En «vida» ya es el adulto, y frena.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "pasa";

const f7 = v.frase(7), f8 = v.frase(8);
const Tvida = f8.t("vida");
const t0 = f7.inicio, x0 = 200, vel = 300;
const tA = Tvida + 0.15, tB = f8.fin - 0.12;
const xEn = (t) => m.frenazo(t, t0, x0, vel, tA, tB);

export function dibuja(g, t) {
  const x = xEn(t);
  const sp = Math.max(0, m.velocidad(xEn, t));
  const corre = k.suave(k.tramo(sp, 40, 140));
  const crece = k.suave(k.tramo(t, f8.t("algunos"), Tvida + 0.2));
  const escala = k.mez(0.56, 1, crece);
  const Z = k.mez(7.1, 5.15, crece);
  const c = m.encuadre(Z, x + 4, 1320);
  m.salon(g, c, t, k.mez(0.2, 0.55, crece));
  m.ponVista(g, c);
  m.polvoCarrera(g, t, x, 1, corre);
  m.trazos(g, x - 14 * escala, -30 * escala, 1, corre * 0.8);
  m.perro(g, {
    x, dir: 1, t, escala,
    fase: Math.max(0, (x - x0) / 40),
    marcha: corre > 0.2 ? 1 : 0,
    pitch: 0.16 * corre,
    cola: k.mez(0.9, 0.25, corre),
    colaTuck: 0.7 * corre,
    cabeza: { ang: 0.05, abre: 0.35 + 0.4 * corre, ojo: corre > 0.45 ? 0 : 1, oreja: 0.2 },
  });
  m.cierra(g, 0.5);
}
