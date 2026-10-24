// La sala de la prueba, de un tirón: entran las dos alfombras, la lisa, la de bultos y el escarbar.
// Misma sala, la cámara viaja. No se corta.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(4).inicio;

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const fin = v.frase(9).inicio;

export function dibuja(g, t) {
  const entra = k.entra(k.tramo(t, f4.inicio, f4.t("suelo") + 0.1));
  const mira = k.suave(k.tramo(t, f5.t("y") - 0.05, f5.t("alfombras")));
  const aLisa = k.suave(k.tramo(t, f6.inicio - 0.05, f6.t("lisa") + 0.1));
  const tumba = k.suave(k.tramo(t, f6.t("uno") - 0.02, f6.t("cinco") - 0.02));
  const anillo = k.suave(k.tramo(t, f6.t("cinco") - 0.05, f6.t("vuelta") + 0.12));
  const aBulto = k.suave(k.tramo(t, f7.inicio - 0.04, f7.t("pelo") + 0.12));
  const uGiro = k.tramo(t, f7.t("pelo"), f7.fin - 0.15);
  const aTriple = k.suave(k.tramo(t, f8.inicio - 0.04, f8.t("triple") + 0.05));
  const rasca = k.suave(k.tramo(t, f8.t("solo") - 0.02, f8.t("escarbaba") - 0.08))
    * (1 - k.suave(k.tramo(t, fin - 0.55, fin - 0.28)));
  const quieto = k.suave(k.tramo(t, fin - 0.55, fin - 0.26));

  const Z = k.claves([
    [f4.inicio, 4.15], [f4.t("suelo"), 4.5], [f5.t("perros"), 5.2], [f5.t("alfombras"), 4.7],
    [f6.t("lisa"), 6.5], [f6.t("cinco"), 7.1], [f6.fin, 6.7],
    [f7.t("pelo"), 6.3], [f7.t("bultos"), 7.1], [f7.t("mitad"), 7.4],
    [f8.inicio, 4.3], [f8.t("triple") + 0.15, 4.5],
    [f8.t("escarbaba"), 8.4], [fin - 0.3, 8], [fin, 8],
  ])(t);
  const cx = k.claves([
    [f4.inicio, 470], [f5.inicio, 430], [f5.t("alfombras"), 560],
    [f6.t("lisa"), 400], [f6.fin, 410],
    [f7.t("bultos"), 470], [f7.t("mitad"), 490],
    [f8.inicio, 470], [f8.t("triple"), 490], [f8.t("escarbaba"), 530], [fin, 525],
  ])(t);
  const cy = k.claves([
    [f4.inicio, -62], [f6.inicio, -54], [f7.inicio, -50],
    [f8.inicio, -46], [f8.t("escarbaba"), -20], [fin, -18],
  ])(t);
  const c = { Z, cx, cy };
  m.sala(g, c);
  m.ponVista(g, c);

  const xL = k.mez(210, 330, entra);
  const xB = k.mez(750, 600, entra);
  const lisaX = k.mez(xL, 400, aLisa);
  const bultoX = k.mez(xB, 480, aBulto);
  const s = m.giro(Math.max(0, uGiro), 2, bultoX, 64);

  const alfaLisa = 1 - Math.max(aBulto, aTriple);
  if (alfaLisa > 0.012) {
    g.save();
    g.globalAlpha = alfaLisa;
    m.alfombraLisa(g, lisaX, k.mez(210, 310, aLisa));
    if (aLisa > 0.35) m.anillos(g, 490, 1, anillo, "rgba(120,80,30,0.95)");
    g.restore();
  }
  if (aTriple < 0.988) {
    g.save();
    g.globalAlpha = 1 - aTriple;
    m.alfombraBultos(g, bultoX, uGiro, s.x, k.mez(210, 330, aBulto));
    g.restore();
  }
  if (aTriple > 0.012) {
    g.save();
    g.globalAlpha = aTriple;
    m.alfombraLisa(g, 300, 190);
    m.anillos(g, 300, 1, 1, "rgba(120,80,30,0.95)");
    m.alfombraBultos(g, 545, Math.max(uGiro, rasca), 525, 230);
    m.anillos(g, 520, 3, 1, "rgba(70,12,12,0.9)");
    g.restore();
  }

  const mini = m.giro(k.tramo(t, f6.inicio, f6.t("uno")) * 0.2, 1, 400, 30);
  const xMira = k.mez(450, 520, mira);
  const xLisa = k.mez(mini.x, 390, tumba);
  const xGiro = k.mez(s.x, 480, k.suave(k.tramo(t, f7.fin - 0.45, f7.fin - 0.05)));
  const a6 = k.suave(k.tramo(t, f6.inicio - 0.02, f6.inicio + 0.32));
  const a7 = k.suave(k.tramo(t, f7.inicio - 0.02, f7.inicio + 0.34));
  const a8 = k.suave(k.tramo(t, f8.inicio - 0.02, f8.inicio + 0.32));
  let x = k.mez(xMira, xLisa, a6);
  x = k.mez(x, xGiro, a7);
  x = k.mez(x, 525, a8);
  const dir = a8 > 0.5 || (a7 < 0.5 && a6 > 0.4) ? 1 : (a7 > 0.5 ? s.dir : (mira > 0.5 ? 1 : -1));
  let marcha = 0.45 * (1 - k.suave(k.tramo(t, f5.fin - 0.35, f6.inicio)));
  marcha = k.mez(marcha, (1 - tumba) * 0.55, a6);
  marcha = k.mez(marcha, 1 - k.suave(k.tramo(t, f7.fin - 0.5, f7.fin - 0.12)), a7);
  marcha = k.mez(marcha, 0.08 * (1 - rasca), a8);
  const tumbado = tumba * (1 - a7);
  const alta = (1 - quieto) * a8 * rasca * (0.3 + 0.7 * Math.abs(Math.sin((t - f8.t("ahi")) * 14)));
  const baja = 0.4 * rasca * a8 * (1 - quieto);
  const fase = a7 > 0.5 && a8 < 0.5 ? s.fase : (a6 > 0.5 && a7 < 0.5 ? mini.fase : t * 0.8);
  marcha *= 1 - quieto;

  m.perro(g, {
    x, dir, fase, marcha, t, tumbado, pataAlta: alta, cuelloBaja: baja,
    cola: (0.7 - 0.4 * tumbado) * (1 - quieto),
    cabeza: { abre: 0.25 * (1 - tumbado) * (1 - quieto), ang: 0.3 * baja, ojo: tumbado, oreja: 0.08 },
  });
  m.migas(g, x + 18, t, f8.t("ahi"), rasca * (1 - quieto));
  m.rellena(g, 0.4);
}
