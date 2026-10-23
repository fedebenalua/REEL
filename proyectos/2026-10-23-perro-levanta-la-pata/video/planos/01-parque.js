// El parque: la pata alta, el tronco, el tamaño y el perro grande.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const Ttronco = f2.t("tronco");
const Talta = f3.t("alta");
const Ttam = f4.t("tamano");
const Tpequenos = f5.t("pequenos");
const Tgrandes = f5.t("grandes");
const Tcorte = v.t("puerta");

export function altaChico(t) {
  const baja = k.suave(k.tramo(t, 5.5, 6.3));
  const sube = k.suave(k.tramo(t, 6.4, Talta + 0.35));
  return k.mez(k.mez(0.95, 0.5, baja), 0.97, sube);
}

export function dibuja(g, t) {
  const alta = altaChico(t);
  const pata = m.pataPrevista(m.CHICO, alta);
  const viaje = k.suave(k.tramo(t, Tpequenos + 0.55, Tgrandes + 0.05));
  const cerca = 1 - k.suave(k.tramo(t, 0.12, 1.05));
  const Zc = k.claves([
    [0.9, 12.4],
    [f1.fin, 11.2],
    [f2.t("suelo"), 9.4],
    [Ttronco, 13.2],
    [Talta, 14],
    [Ttam, 11],
    [f4.t("alta"), 13.2],
    [Tpequenos, 12.6],
    [Tpequenos + 0.4, 12.2],
    [Tgrandes, 7.4],
    [Tcorte - 0.2, 7.4],
  ])(t);
  const Z = k.mez(Zc, 17.5, cerca);
  const cyC = k.claves([
    [0.9, -40],
    [f2.t("suelo"), -14],
    [Ttronco, pata[1] + 8],
    [Talta, pata[1] + 4],
    [Ttam, -42],
    [f4.fin, -44],
    [Tcorte, -44],
  ])(t);
  const cx = k.mez(k.mez(m.CHICO.x + 22, pata[0] - 8, cerca), m.GRANDE.x + 16, viaje);
  const cy = k.mez(k.mez(cyC, pata[1] + 10, cerca), -70, viaje);
  const c = { Z, cx, cy };

  const charcoAl = k.suave(k.tramo(t, f2.inicio, f2.t("cae") + 0.1)) * (1 - k.suave(k.tramo(t, f2.t("sube"), Ttronco - 0.15)));
  const chorroAl = (1 - k.suave(k.tramo(t, Tcorte - 0.38, Tcorte - 0.16))) * (t < 5.45 || t > 6.35 ? 1 : k.suave(k.tramo(t, 6.35, 6.7)));

  m.parque(g, c, t, 0);
  m.ponVista(g, c);
  m.arbol(g, m.troncoX(m.GRANDE), m.GRANDE.s);
  m.arbol(g, m.troncoX(m.CHICO), m.CHICO.s);

  const grande = m.perro(g, {
    x: m.GRANDE.x, escala: m.GRANDE.s, marcha: 0, fase: 0, t, pataAlta: 0.58, pitch: 0.04,
    cola: 0.25, cabeza: { ang: 0.08, oreja: -0.05 },
  });
  const chico = m.perro(g, {
    x: m.CHICO.x, escala: m.CHICO.s, marcha: 0, fase: 0.1, t, pataAlta: alta, pitch: 0.05 * alta,
    cola: 0.35 + 0.15 * Math.sin(t * 3), cabeza: { ang: 0.06, oreja: 0.02 },
  });

  const tx = m.bordeTronco(m.CHICO);
  m.mancha(g, tx, chico.pata[1], k.suave(k.tramo(t, 0.05, 0.35)) * (1 - viaje), { s: m.CHICO.s, fresco: 1 });
  m.mancha(g, m.bordeTronco(m.GRANDE), grande.pata[1], viaje, { s: m.GRANDE.s, fresco: 0.8 });

  m.charco(g, m.CHICO.x + 6, 1.5, charcoAl * (1 - viaje));
  const suben = k.suave(k.tramo(t, f2.t("sube") - 0.05, Ttronco));
  if (charcoAl > 0.05 && suben > 0.02 && suben < 0.98) {
    g.fillStyle = "#ffe56a";
    for (let i = 0; i < 5; i++) {
      const u = k.suave(Math.min(1, suben + i * 0.08));
      g.globalAlpha = (1 - u) * charcoAl;
      g.beginPath(); g.arc(m.CHICO.x + 4 + i * 3, k.mez(0, chico.pata[1], u), 1.6, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  }

  const destC = [tx, chico.pata[1]];
  const destG = [m.bordeTronco(m.GRANDE), grande.pata[1]];
  m.chorro(g, chico.ingle, destC, t, chorroAl * (1 - viaje));
  m.chorro(g, grande.ingle, destG, t + 2, chorroAl * viaje);

  m.marco(g);
}
