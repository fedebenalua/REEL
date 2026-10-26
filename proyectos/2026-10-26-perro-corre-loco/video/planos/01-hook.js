// Del gancho al arranque, sin cortar: es el mismo salón.
// 0 ya va disparado. Frena. La cámara se acerca: se lo pasa bien. Se abre: no hay nadie.
// En «suelta» sale otra vez, y frena suelto antes de irse a la ventana.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const Tsuelta = f4.t("suelta");
const t0 = 0, x0 = 260, vel = 340;
const tA = f1.t("cuento") - 0.08, tB = f1.fin - 0.16;
const xFin = m.frenazo(tB + 1, t0, x0, vel, tA, tB);
const tA2 = Tsuelta + 0.9, tB2 = f4.fin - 0.12;

function xEn(t) {
  if (t < Tsuelta) return m.frenazo(t, t0, x0, vel, tA, tB);
  return m.frenazo(t, Tsuelta, xFin, 480, tA2, tB2);
}

export function dibuja(g, t) {
  const x = xEn(t);
  const sp = Math.abs(m.velocidad(xEn, t));
  const corre = k.suave(k.tramo(sp, 40, 160));
  const acerca = k.suave(k.tramo(t, f2.inicio, f2.t("bien") - 0.1));
  const abre = k.suave(k.tramo(t, f3.inicio, f3.t("concreta")));
  const sale = k.suave(k.tramo(t, Tsuelta - 0.04, Tsuelta + 0.28));
  const asienta = k.suave(k.tramo(t, tB2 - 0.18, tB2));
  let Z, cx, sy;
  if (t < f2.inicio) { Z = 5.9; cx = x + 8; sy = 1300; }
  else if (t < f3.inicio) { Z = k.mez(5.9, 6.7, acerca); cx = x + k.mez(8, 28, acerca); sy = 1290; }
  else if (t < Tsuelta) { Z = k.mez(6.7, 3.3, abre); cx = x + k.mez(28, 110, abre); sy = k.mez(1290, 1220, abre); }
  else { Z = k.mez(k.mez(3.3, 5.5, sale), 6.4, asienta); cx = x + 12; sy = 1310; }
  const c = m.encuadre(Z, cx, sy);
  m.salon(g, c, t, 0.18);
  m.ponVista(g, c);
  const mira = Math.sin(k.tramo(t, f3.inicio, Tsuelta) * Math.PI * 2) * abre * (1 - sale);
  m.polvoCarrera(g, t, x, 1, corre);
  m.trazos(g, x - 18, -34, 1, corre * 0.75);
  m.perro(g, {
    x, dir: 1, t,
    fase: Math.max(0, (t < Tsuelta ? x - x0 : x - xFin + (xFin - x0)) / 44),
    marcha: corre > 0.25 ? 1 : 0,
    pitch: 0.2 * corre,
    cola: k.mez(0.95, 0.15, corre),
    colaTuck: 0.88 * corre,
    cabeza: {
      ang: 0.06 * corre - 0.3 * mira,
      abre: 0.25 + 0.55 * Math.max(corre, (1 - corre) * (t > f2.inicio ? 1 : 0)),
      ojo: corre > 0.5 ? 0 : 1,
      oreja: 0.12 + 0.2 * (1 - corre),
    },
  });
  m.cierra(g, 0.5);
}
