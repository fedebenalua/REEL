// El bosque: el lobo ya come hierba. El sofá cae y no le importa.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(7).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(7);
const Tlobos = f.t("lobos");
const Tcasa = f.t("casa");
const Tfin = v.frase(8).inicio;

export function dibuja(g, t) {
  const cae = k.suave(k.tramo(t, Tcasa - 0.55, Tcasa + 0.15));
  const posa = k.suave(k.tramo(t, Tcasa + 0.05, Tcasa + 0.35));
  const ySofa = k.mez(-80, 1180, cae);
  const aplasta = 1 - 0.08 * k.pulso(t, Tcasa + 0.16, 0.08);
  const z = k.claves([[f.inicio, 1.2], [Tlobos + 0.4, 1.05], [Tcasa - 0.2, 0.78], [Tcasa + 0.4, 0.74], [Tfin - 0.2, 0.74]])(t);
  const fx = k.claves([[f.inicio, 860], [Tcasa, 1180], [Tfin - 0.25, 1160]])(t);
  const cam = { z, fx, fy: 1120 };

  m.conCam(g, cam, () => {
    m.bosque(g, t);
    m.perro(g, 780, 1380, 1.65, {
      t, piel: m.LOBO, lobo: true, collar: false, baja: 1, come: true,
      ambar: true, sem: 1.2, cola: 0.08, ritmo: 4.2,
    });
    m.monton(g, 760, 1280, 16, t, 1);
    if (cae > 0.02) {
      g.save();
      g.translate(1480, ySofa);
      g.scale(1, aplasta);
      m.sofa(g, 0, 0, 1.15);
      g.restore();
    }
    m.hierbaDelante(g, t * 0 + 2);
  });
  m.velo(g, 0.66);
}
