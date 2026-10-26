// «O cuando llegas y se emociona.»
// La puerta ya está abierta, la persona entera y pequeña, y él cruza el salón hasta ella.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "o";

const f6 = v.frase(6);
const Temo = f6.t("emociona");
const xPersona = 350;
const t0 = f6.inicio, x0 = 530, vel = 200;
const tA = t0 + 0.48, tB = t0 + 0.86;
const xEn = (t) => m.frenazo(t, t0, x0, -vel, tA, tB);

export function dibuja(g, t) {
  const x = xEn(t);
  const sp = Math.max(0, -m.velocidad(xEn, t));
  const corre = k.suave(k.tramo(sp, 40, 140));
  const llega = k.suave(k.tramo(t, t0 + 0.42, Temo + 0.2));
  const Z = k.mez(2.95, 4.05, llega);
  const cx = k.mez(440, 410, llega);
  const c = m.encuadre(Z, cx, 1360);
  m.salon(g, c, t, 0.35);
  m.ponVista(g, c);
  m.puerta(g, 300, 0.92);
  m.polvoCarrera(g, t, x, -1, corre);
  m.persona(g, {
    x: xPersona, dir: 1, t, fase: 0, paso: 0, recto: 1, boca: 0.35 + 0.25 * (1 - corre),
  });
  m.perro(g, {
    x, dir: -1, t,
    fase: Math.max(0, (x0 - x) / 44),
    marcha: corre > 0.25 ? 1 : 0,
    pitch: 0.16 * corre,
    cola: k.mez(0.95, 0.2, corre),
    colaTuck: 0.75 * corre,
    cabeza: { ang: -0.08 * (1 - corre), abre: k.mez(0.7, 0.45, corre), ojo: 1, oreja: 0.3 },
  });
  m.cierra(g, 0.48);
}
