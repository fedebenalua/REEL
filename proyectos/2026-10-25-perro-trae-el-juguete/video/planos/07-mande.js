// «Y si aun así no lo suelta, no es que mande.»
// Gana el tirón y se sienta. La persona sigue en pie.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(9).inicio - 0.04;

const f = v.frase(9);
const Tasi = f.t("asi"), Tmanda = f.t("mande");
const xP = 270;

export function dibuja(g, t) {
  const gana = k.suave(k.tramo(t, Tasi - 0.15, Tasi + 0.35));
  const sienta = k.suave(k.tramo(t, Tmanda - 0.28, Tmanda + 0.22));
  const xD = k.mez(490, 455, sienta);
  const Z = k.claves([[f.inicio, 3.9], [Tasi, 4.15], [Tmanda, 4.35], [f.fin, 4.3]])(t);
  const cx = k.claves([[f.inicio, 390], [Tmanda, 370], [f.fin, 368]])(t);
  const c = { Z, cx, cy: m.cyPies(Z, 1310) };
  m.salon(g, c, t, 1);
  m.ponVista(g, c);
  const per = m.perro(g, {
    x: xD, dir: -1, fase: (1 - sienta) * t * 0.8, marcha: (1 - sienta) * 0.2, t,
    sentado: sienta, pitch: 0.1 * (1 - sienta),
    cola: k.mez(0.85, 0.45, sienta),
    cabeza: { ang: k.mez(0.1, -0.32, sienta), abre: 0.12, ojo: sienta > 0.7 ? 1 : 0, oreja: 0.1 },
  });
  const gente = m.persona(g, {
    x: xP, dir: 1, recto: 1, paso: 0, fase: 0, t, inclina: 0,
    mano: [xP + 86, -70], tira: 1 - gana,
  });
  const boca = m.enBoca(per.nariz, -1, 4);
  const mano = gente.mano;
  const extremo = [k.mez(mano[0], boca[0] + 22, gana), k.mez(mano[1], boca[1] + 16, gana)];
  m.cuerda(g, boca[0], boca[1], extremo[0], extremo[1], t, k.mez(0.88, 0.22, gana));
  m.cierra(g, 0.5);
}
