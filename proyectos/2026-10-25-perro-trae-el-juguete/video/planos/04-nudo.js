// «Lo vieron en labradores, con la misma cuerda anudada.»
// La cámara recorre la cuerda y se queda en el nudo.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(5).inicio - 0.04;

const f = v.frase(5);
const Tcuerda = f.t("cuerda"), Tnudo = f.t("anudada");
const xD = 380;

export function dibuja(g, t) {
  const viaje = k.suave(k.tramo(t, Tcuerda - 0.15, Tnudo + 0.05));
  const Z = k.mez(7.2, 12.4, viaje);
  const cx = k.mez(xD + 40, xD + 78, viaje);
  const cy = k.mez(-58, -42, viaje);
  const c = { Z, cx, cy };
  m.salon(g, c, t, 0.15);
  m.ponVista(g, c);
  const per = m.perro(g, {
    x: xD, dir: 1, fase: 0.2, marcha: 0, t, cola: 0.35,
    cabeza: { ang: 0.02, abre: 0.05, oreja: 0.05 },
  });
  const boca = m.enBoca(per.nariz, 1, 2);
  const fin = [boca[0] + 70, boca[1] + 4];
  m.cuerda(g, boca[0], boca[1], fin[0], fin[1], t, 0.92);
  const luz = k.pulso(t, Tnudo + 0.12, 0.55) * (1 - k.suave(k.tramo(t, f.fin - 0.18, f.fin)));
  m.sinVista(g);
  if (luz > 0.02) {
    const nx = (boca[0] + fin[0]) / 2, ny = (boca[1] + fin[1]) / 2;
    const sx = 540 + (nx - c.cx) * c.Z, sy = 960 + (ny - c.cy) * c.Z;
    k.brillo(g, sx, sy, 240, "255,214,150", 0.45 * luz);
  }
  m.cierra(g, 0.48);
}
