// «Casi la mitad da alguna señal.» Primer plano: tiembla, y sale 1/2.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(2).t("casi") - 0.04;
const f = v.frase(2);
const fin = v.frase(3).t("y") - 0.04;
const Tsen = f.t("senal");

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const u = k.suave(k.tramo(t, f.inicio, Tsen));
  const Z = k.mez(6.6, 8.1, u);
  const x = 420;
  const c = { Z, cx: x + 4, cy: -86 };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.perroFrente(g, {
    x: x + m.temblor(t, 0.45 * (1 - q)), t, cola: 0.02,
    culpa: 0, culpaOrejas: 0.95, culpaOjos: 0.6, culpaCabeza: 0.28,
    cabeza: { oreja: 0, ladea: -0.16, mira: -0.55, ojo: 0 },
  });
  m.sinVista(g);
  const al = k.suave(k.tramo(t, Tsen - 0.08, Tsen + 0.22));
  m.cifra(g, 540, 590, "1/2", al);
  m.cierra(g, 0.55);
}
