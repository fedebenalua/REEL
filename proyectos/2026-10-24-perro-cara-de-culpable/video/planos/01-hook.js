// El salón después del desastre: la cara de culpable, a lo grande, y el dueño que llega y la ve.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const T = (f, w) => f.t(w);

// Cara de culpable: sube entera con el primer plano, y en la frase 2 se suben una a una las tres cosas que nombra la voz.
const ojos = (t) => k.mez(0.62, 1, k.suave(k.tramo(t, T(f2, "ojos") + 0.1, T(f2, "arriba") + 0.2)));
const orejas = (t) => k.mez(0.62, 1, k.suave(k.tramo(t, T(f2, "orejas") - 0.05, T(f2, "atras") + 0.1)));
const cabeza = (t) => k.mez(0.62, 1, k.suave(k.tramo(t, T(f2, "cabeza") - 0.05, T(f2, "baja") + 0.2)));

// El dueño: entra por la izquierda, se para, y se lleva la mano a la barbilla.
const tEntra = T(f3, "tu") - 0.08, tPara = T(f3, "sabe") + 0.45;
const xDueno = (t) => 118 + 132 * k.suave(k.tramo(t, tEntra, tPara));
const pasoDueno = (t) => (1 - k.suave(k.tramo(t, tPara - 0.4, tPara))) * k.suave(k.tramo(t, tEntra, tEntra + 0.15));
const faseDueno = (t) => 1.25 * Math.max(0, Math.min(t, tPara) - tEntra);

export function camara(t) {
  const Z = k.claves([
    [0, 9.6], [0.4, 9.2], [f1.t("culpable") + 0.35, 4.35],
    [f2.inicio, 4.35], [T(f2, "ojos") + 0.55, 10.2], [T(f2, "arriba") + 0.45, 9.6],
    [T(f2, "orejas") - 0.05, 6.4], [T(f2, "atras") + 0.25, 6.2],
    [T(f2, "cabeza") - 0.05, 4.9], [f2.fin + 0.1, 4.5],
    [f3.inicio + 0.1, 4.2], [T(f3, "sabe") + 0.2, 4.1], [f3.fin, 4.05],
  ])(t);
  const cx = k.claves([
    [0, 422], [f1.t("culpable") + 0.35, 392], [f2.inicio, 392], [T(f2, "ojos") + 0.55, 420], [T(f2, "orejas") - 0.05, 420],
    [T(f2, "cabeza") - 0.05, 410], [f3.inicio + 0.1, 395], [T(f3, "sabe") + 0.2, 338], [f3.fin, 338],
  ])(t);
  const cy = k.claves([
    [0, -96], [0.4, -96], [f1.t("culpable") + 0.35, -82], [f2.inicio, -82], [T(f2, "ojos") + 0.55, -102], [T(f2, "arriba") + 0.45, -100],
    [T(f2, "orejas") - 0.05, -97], [T(f2, "cabeza") - 0.05, -86], [f3.inicio + 0.1, -84], [T(f3, "sabe") + 0.2, -74], [f3.fin, -74],
  ])(t);
  return { Z, cx, cy };
}

export function dibuja(g, t) {
  const c = camara(t);
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  m.cojinRoto(g, m.COJIN_X);
  const cO = ojos(t), cE = orejas(t), cH = cabeza(t), cu = (cO + cE + cH) / 3;
  const mira = -0.95 * k.suave(k.tramo(t, T(f3, "tu"), T(f3, "sabe")));
  const lam = k.tramo(t, f1.t("culpable") + 0.7, f1.t("culpable") + 1.5);
  const du = xDueno(t);
  const hay = t > tEntra - 0.1;
  m.perroFrente(g, {
    x: m.OX, t, culpa: cu, culpaOjos: cO, culpaOrejas: cE, culpaCabeza: cH, cola: 0,
    lamido: lam > 0 && lam < 1 ? lam : 0, cabeza: { mira, ladea: 0 },
  });
  m.plumas(g, t);
  if (hay) {
    const mano = k.suave(k.tramo(t, T(f3, "sabe") - 0.15, T(f3, "sabe") + 0.45));
    m.persona(g, {
      recto: 1, x: du, dir: 1, paso: pasoDueno(t), fase: faseDueno(t), t, inclina: 0.05 * mano,
      mano: [du + 26, -128], tira: mano,
      boca: 0,
    });
  }
  m.velo(g, 0.35);
}
