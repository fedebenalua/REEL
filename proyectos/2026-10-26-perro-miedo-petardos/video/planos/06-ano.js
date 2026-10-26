// «Casi la mitad empieza antes de cumplir el año.» Pequeño junto al sofá, y crece.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(6).t("en") - 0.04;
const f = v.frase(6);
const fin = v.frase(7).inicio - 0.04;
const Tano = f.t("ano");
const Tem = f.t("empieza");

export function dibuja(g, t) {
  const crece = k.suave(k.tramo(t, Tem, Tano - 0.05));
  const escala = k.mez(0.55, 1, crece);
  const acerca = k.suave(k.tramo(t, f.inicio, Tem));
  const Z = k.mez(k.mez(6.8, 7.8, acerca), 4.9, crece);
  const x = 430 + Math.sin(t * 1.7) * 10 * (1 - crece);
  const c = { Z, cx: x + 20, cy: m.pies(Z, 1360) };
  m.salon(g, c, t, m.DIA);
  m.ponVista(g, c);
  m.perro(g, {
    x, t, dir: 1, escala, marcha: 0, fase: 0.3,
    cola: 0.75, cabeza: { ang: Math.sin(t * 1.5) * 0.18 * (1 - crece), oreja: 0.25, ojo: 0.2 },
  });
  m.sinVista(g);
  const muestra = k.suave(k.tramo(t, Tano - 0.08, Tano + 0.2));
  m.cifra(g, 540, 600, "1", muestra, "255,214,120");
  m.cierra(g, 0.4);
}
