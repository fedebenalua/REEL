// Otra vez el parque: la sombra más grande, la mancha vieja, y el remate.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "segun";
export const entrada = "corte";

const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const Tgrandes = f7.t("grandes");
const Ttapan = f8.t("tapan");
const Tarriba = f8.t("arriba");
const Tapunta = f9.t("apunta");
const Tapunta2 = f9.t("apunta", 2);
const Tarbol = f10.t("arbol");

export function dibuja(g, t) {
  const sombra = k.suave(k.tramo(t, f7.t("pueden") - 0.05, Tgrandes + 0.05))
    * (1 - k.suave(k.tramo(t, f8.inicio + 0.15, f8.t("igual"))));
  const vieja = k.suave(k.tramo(t, f8.t("igual"), Ttapan - 0.05));
  const tapa = k.suave(k.tramo(t, Ttapan - 0.08, Tarriba - 0.15));
  const vuelve = k.suave(k.tramo(t, f8.fin, Tapunta - 0.08));
  const extra = vieja * (1 - vuelve);
  const alta = k.mez(0.96, 1, extra * tapa);
  const entra = k.suave(k.tramo(t, Tarbol - 0.25, Tarbol + 0.35));
  const cola = k.suave(k.tramo(t, f10.inicio, f10.inicio + 0.4));

  const pata = m.pataPrevista(m.CHICO, alta);
  const Zbase = k.claves([
    [f7.inicio, 11.5],
    [Tgrandes, 8.4],
    [f8.inicio, 9.2],
    [Ttapan, 13.5],
    [Tarriba, 13.2],
    [Tapunta, 12.4],
    [Tapunta2, 11.2],
    [f9.t("toca"), 12.6],
    [f10.inicio, 11.2],
    [Tarbol - 0.15, 12],
    [Tarbol + 0.45, 17.2],
    [v.duracion, 18],
  ])(t);
  const Z = Zbase;
  const cx = m.CHICO.x + k.mez(8, 4, entra);
  const cyBase = k.claves([
    [f7.inicio, -50],
    [Tgrandes, -70],
    [Ttapan, pata[1] + 2],
    [Tapunta, -36],
    [Tapunta2, pata[1] + 8],
    [f10.inicio, -44],
    [Tarbol, pata[1]],
  ])(t);
  const cy = k.mez(cyBase, pata[1] + 2, entra);
  const c = { Z, cx, cy };

  const chorroAl = k.suave(k.tramo(t, f7.inicio + 0.12, f7.inicio + 0.4));

  m.parque(g, c, t, 0.08);
  m.ponVista(g, c);
  m.arbol(g, m.troncoX(m.CHICO), m.CHICO.s);

  const sSombra = Math.min(1.55, Math.max(1.15, -pata[1] / 50));
  if (sombra > 0.02) {
    g.save(); g.globalAlpha *= 0.38 * sombra;
    m.perro(g, {
      x: m.CHICO.x - 6, escala: sSombra, marcha: 0, fase: 0, t, pataAlta: 0, pitch: 0,
      cola: 0.2, cabeza: { ang: 0.05 },
    });
    g.restore();
  }

  const chico = m.perro(g, {
    x: m.CHICO.x, escala: m.CHICO.s, marcha: 0, fase: 0.1, t, pataAlta: alta, pitch: 0.05,
    cola: 0.3 + 0.7 * cola, cabeza: { ang: 0.05, ojo: cola > 0.6 ? 1 : 0, abre: cola > 0.7 ? 0.5 : 0 },
  });

  const tx = m.bordeTronco(m.CHICO);
  const yPropia = chico.pata[1];
  const yVieja = yPropia - 14;
  const yFin = k.mez(yPropia, yVieja, extra * tapa);
  m.mancha(g, tx, yVieja, vieja * (1 - tapa * 0.35) * (1 - vuelve), { s: m.CHICO.s, fresco: 0.15, sem: 4 });
  m.mancha(g, tx, yFin, 0.95, { s: m.CHICO.s, fresco: k.mez(0.7, 1, tapa) });
  m.chorro(g, chico.ingle, [tx, yFin], t, chorroAl);
  m.marco(g);
}
