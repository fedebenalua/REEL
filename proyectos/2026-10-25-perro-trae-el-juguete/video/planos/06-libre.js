// «Si el otro eres tú, ignora el que está libre. El premio no es el juguete. Eres tú.»
// Una pelota en la mano y otra en el suelo. Pasa de largo la del suelo y se va con la persona.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(7).inicio - 0.04;

const f7 = v.frase(7), f8 = v.frase(8);
const Tignora = f7.t("ignora"), Tlibre = f7.t("libre"), Tpremio = f8.t("premio"), Ttu = f8.t("tu");
const xP = 280;

export function dibuja(g, t) {
  const pasa = k.suave(k.tramo(t, Tignora - 0.1, Tlibre + 0.05));
  const aTi = k.suave(k.tramo(t, Tpremio - 0.05, Ttu + 0.05));
  const xD = k.claves([
    [f7.inicio, 620], [Tignora, 540], [Tlibre, 470], [Tpremio, 450], [Ttu, 390], [f8.fin, 385],
  ])(t);
  const Z = k.claves([
    [f7.inicio, 4.35], [Tignora, 5.15], [Tlibre, 4.7], [Tpremio, 5.25], [Ttu, 6.15], [f8.fin, 6.55],
  ])(t);
  const cx = k.claves([
    [f7.inicio, 500], [Tlibre, 450], [Tpremio, 420], [Ttu, 360], [f8.fin, 340],
  ])(t);
  const c = { Z, cx, cy: m.cyPies(Z, 1320) };
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  const xLibre = 500;
  m.pelotaSuelo(g, xLibre, 1.15, 0.2);
  const marcha = k.claves([
    [f7.inicio, 0.85], [Tlibre, 0.4], [Tpremio, 0.7], [Ttu - 0.05, 0.15], [f8.fin, 0],
  ])(t);
  const per = m.perro(g, {
    x: xD, dir: -1, fase: t * 2.4, marcha, t,
    cuelloBaja: 0.35 * (1 - pasa) * (1 - aTi),
    pitch: 0.06 * marcha,
    cola: k.mez(0.4, 1, aTi),
    cabeza: {
      ang: k.claves([[f7.inicio, 0.35], [Tlibre, 0.05], [Tpremio, -0.05], [Ttu, -0.38], [f8.fin, -0.36]])(t) + Math.sin(t * 2.2) * 0.07 * aTi,
      abre: 0.12, ojo: aTi > 0.45 ? 1 : 0, oreja: 0.15 + 0.35 * aTi,
    },
  });
  const gente = m.persona(g, {
    x: xP, dir: 1, recto: 1, paso: 0, fase: 0, t,
    mano: [xP + 70, -96], tira: 0.85,
    inclina: -0.04 * aTi,
  });
  // La de la mano se queda en la mano: el premio no es esa pelota.
  m.pelota(g, gente.mano[0] + 3, gente.mano[1] - 1, 1.05, 0);
  if (marcha > 0.3) m.polvoCorre(g, t, xD + 16, -1, f7.inicio);
  void per;
  m.cierra(g, 0.5);
}
