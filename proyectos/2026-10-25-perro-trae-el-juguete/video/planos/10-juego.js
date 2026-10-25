// «Los diez más juguetones pedían más juego después de ganar.»
// Sale el 10. Después de ganar, le trae la pelota otra vez, más vivo.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(13).inicio - 0.04;

const f = v.frase(13);
const Tdiez = f.t("diez"), Tjuego = f.t("juego"), Tganar = f.t("ganar");
const xP = 250;

export function dibuja(g, t) {
  const trae = k.suave(k.tramo(t, Tjuego - 0.35, Tganar - 0.05));
  const xD = k.claves([
    [f.inicio, 520], [Tjuego - 0.2, 500], [Tganar, 390], [f.fin, 385],
  ])(t);
  const Z = k.claves([[f.inicio, 4.15], [Tdiez, 4.3], [Tjuego, 4.5], [Tganar, 4.2], [f.fin, 4.15]])(t);
  const cx = k.mez(430, 340, trae);
  const c = { Z, cx, cy: m.cyPies(Z, 1310) };
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  const marcha = k.claves([[f.inicio, 0], [Tjuego - 0.15, 0.2], [Tjuego + 0.1, 0.9], [Tganar, 0.15], [f.fin, 0]])(t);
  const per = m.perro(g, {
    x: xD, dir: -1, fase: Math.max(0, t - (Tjuego - 0.2)) * 3.2, marcha, t,
    sentado: 1 - k.suave(k.tramo(t, Tjuego - 0.45, Tjuego - 0.12)),
    pitch: 0.1 * marcha, cola: k.mez(0.4, 1, k.suave(k.tramo(t, Tjuego - 0.2, Tjuego + 0.2))),
    cabeza: { ang: k.mez(0.05, -0.2, trae), abre: 0.15 + 0.35 * marcha, ojo: 1, oreja: 0.3 },
  });
  m.persona(g, { x: xP, dir: 1, recto: 1, paso: 0, fase: 0, t, inclina: -0.06 });
  const boca = m.enBoca(per.nariz, -1, 4);
  const enSuelo = trae < 0.15;
  if (enSuelo) m.pelotaSuelo(g, xD - 40, 1.15, 0);
  else m.pelota(g, k.mez(xD - 40, boca[0], k.entra(trae)), k.mez(-14, boca[1], k.entra(trae)) - Math.sin(Math.min(trae, 1) * Math.PI) * 20, 1.15, trae);
  if (marcha > 0.4) m.polvoCorre(g, t, xD + 20, -1, Tjuego - 0.1);
  m.sinVista(g);
  const al = k.entra(k.tramo(t, Tdiez - 0.04, Tdiez + 0.3));
  m.cierra(g, 0.5);
  k.pastilla(g, 540, 700, "10", "", "255,214,120", al, 110);
}
