// «Contigo la suelta mucho más, para que el juego siga.»
// La cuerda pasa a la mano y se queda ahí. Luego él vuelve a por ella: el juego no se acaba.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(4).inicio - 0.04;

const f = v.frase(4);
const Tsuelta = f.t("suelta"), Tmas = f.t("mas"), Tsiga = f.t("siga");
const xP = 250, xD0 = 455;

export function dibuja(g, t) {
  const suelta = k.suave(k.tramo(t, Tsuelta - 0.08, Tsuelta + 0.38));
  const vuelve = k.suave(k.tramo(t, Tsiga - 0.35, Tsiga + 0.28));
  const xD = k.mez(xD0, xD0 - 28, vuelve);
  const Z = k.claves([
    [f.inicio, 3.85], [Tsuelta, 4.7], [Tmas + 0.15, 4.9], [Tsiga, 4.15], [f.fin, 4.05],
  ])(t);
  const cx = k.claves([
    [f.inicio, 360], [Tsuelta, 340], [Tsiga, 370], [f.fin, 368],
  ])(t);
  const c = { Z, cx, cy: m.cyPies(Z, 1320) };
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  const per = m.perro(g, {
    x: xD, dir: -1, fase: vuelve * 1.2, marcha: vuelve * 0.55, t,
    pitch: 0.16 * vuelve, cola: 0.5 + 0.5 * vuelve,
    cabeza: { ang: k.mez(0.12, -0.05, vuelve), abre: 0.15 + 0.45 * vuelve, ojo: vuelve > 0.4 ? 1 : 0, oreja: 0.25 },
  });
  const boca = m.enBoca(per.nariz, -1, 3);
  const gente = m.persona(g, {
    x: xP, dir: 1, recto: 1, paso: 0, fase: 0, t,
    mano: [xP + 78, -78], tira: 1 - 0.35 * suelta,
  });
  const enMano = [gente.mano[0] + 6, gente.mano[1] + 4];
  const a = [k.mez(boca[0], enMano[0] - 4, suelta), k.mez(boca[1], enMano[1], k.sale(suelta)) - Math.sin(suelta * Math.PI) * 16];
  m.cuerda(g, a[0], a[1], enMano[0] + 10, enMano[1] + 2, t, k.mez(0.8, 0.25, suelta));
  m.cierra(g, 0.5);
}
