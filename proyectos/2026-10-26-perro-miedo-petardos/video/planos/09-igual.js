// «Si nadie pide ayuda, a la mitad se le queda igual.» El dueño se va. Él no cambia.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vv) => vv.frase(9).t("si") - 0.04;
const f = v.frase(9);
const fin = v.frase(10).t("tres") - 0.04;
const Tmitad = f.t("mitad");

export function dibuja(g, t) {
  const q = m.quieto(t, fin);
  const sigue = k.suave(k.tramo(t, Tmitad, fin - 0.3));
  const Z = k.mez(3.5, 4.15, sigue);
  const c = { Z, cx: k.mez(400, 340, sigue), cy: m.pies(Z, 1380) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.perro(g, {
    x: 300, t, dir: -1, marcha: 0, fase: 0.2,
    cola: 0.04, pitch: 0.16, cabeza: { ang: 0.4, oreja: -0.5, ojo: 0 },
  });
  const anda = k.suave(k.tramo(t, f.inicio + 0.15, f.inicio + 0.4)) * (1 - k.suave(k.tramo(t, Tmitad + 0.7, Tmitad + 1.05)));
  const xP = k.claves([[f.inicio, 560], [Tmitad + 0.85, 860], [fin, 860]])(t);
  m.persona(g, { x: xP, dir: 1, recto: 1, paso: anda, fase: (t - f.inicio) * 1.6, t });
  m.sinVista(g);
  const al = k.suave(k.tramo(t, Tmitad - 0.05, Tmitad + 0.28)) * (1 - q * 0);
  m.cifra(g, 540, 600, "1/2", al);
  m.cierra(g, 0.48);
}
