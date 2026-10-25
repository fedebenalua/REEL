// «Catorce golden retriever. Veinte partidas ganadas, y veinte perdidas.»
// El 14 se queda. Luego un 20 y otro 20, mientras gana un tirón y pierde el siguiente.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(10).inicio - 0.04;

const f10 = v.frase(10), f11 = v.frase(11);
const Tcator = f10.t("catorce"), Tgana = f11.t("ganadas"), Tpierde = f11.t("perdidas");
const xP = 260;

export function dibuja(g, t) {
  const llega14 = k.entra(k.tramo(t, Tcator - 0.05, Tcator + 0.28));
  const seVa14 = k.suave(k.tramo(t, f11.inicio - 0.08, f11.inicio + 0.22));
  const llegan20 = k.entra(k.tramo(t, f11.t("veinte") - 0.02, f11.t("veinte") + 0.32));
  const gana = k.suave(k.tramo(t, Tgana - 0.15, Tgana + 0.35));
  const pierde = k.suave(k.tramo(t, Tpierde - 0.2, Tpierde + 0.3));
  const quien = k.mez(gana, 1 - pierde, pierde);
  const Z = 4.35;
  const cx = 390;
  const c = { Z, cx, cy: m.cyPies(Z, 1280) };
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  const xD = 500;
  const per = m.perro(g, {
    x: xD, dir: -1, fase: t * 0.6, marcha: 0.15 * (1 - pierde), t,
    pitch: 0.08 * quien, cola: 0.4 + 0.4 * quien,
    cabeza: { ang: 0.06, abre: 0.1 },
  });
  const gente = m.persona(g, {
    x: xP, dir: 1, recto: 1, paso: 0, fase: 0, t,
    mano: [xP + 90, -72], tira: 0.9,
  });
  const boca = m.enBoca(per.nariz, -1, 3);
  const mano = gente.mano;
  const medio = [(boca[0] + mano[0]) / 2, (boca[1] + mano[1]) / 2 + 8];
  const a = [k.mez(medio[0], boca[0], quien), k.mez(medio[1], boca[1], quien)];
  const b = [k.mez(medio[0], mano[0], 1 - quien), k.mez(medio[1], mano[1], 1 - quien)];
  m.cuerda(g, a[0], a[1], b[0], b[1], t, 0.7);
  m.cierra(g, 0.55);
  const al14 = llega14 * (1 - seVa14);
  k.pastilla(g, 540, 780, "14", "", "255,214,120", al14, 118);
  k.pastilla(g, 360, 860, "20", "", "255,214,120", llegan20, 96);
  k.pastilla(g, 740, 860, "20", "", "186,220,255", llegan20, 96);
}
