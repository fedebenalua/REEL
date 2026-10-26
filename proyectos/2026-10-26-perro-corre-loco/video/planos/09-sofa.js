// «Envíaselo a ese amigo al que su perro da tres vueltas al sofá y se tumba como si nada.»
// El sofá se queda. Tres idas y vueltas, frena, y se tira en la alfombra.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "enviaselo";

const f11 = v.frase(11);
const Tsofa = f11.t("sofa"), Ttumba = f11.t("tumba");
const xL = 300, xR = 560, vel = 340;

export function dibuja(g, t) {
  const frena = k.suave(k.tramo(t, Ttumba - 0.55, Ttumba - 0.16));
  const cae = k.suave(k.tramo(t, Ttumba - 0.02, Ttumba + 0.26));
  const lap = m.idaVuelta(t, f11.inicio, xL, xR, vel);
  const xQuieto = 440;
  const x = k.mez(lap.x, xQuieto, frena);
  const dir = frena > 0.5 ? 1 : lap.dir;
  const corre = (1 - frena) * (1 - cae);
  const Z = k.mez(4.05, 5.55, cae);
  const cx = k.mez(lap.x * 0.42 + 420 * 0.58, x + 8, cae);
  const c = m.encuadre(Z, cx, k.mez(1310, 1360, cae));
  m.salon(g, c, t, 0.3);
  m.ponVista(g, c);
  m.polvoCarrera(g, t, x, dir, corre * 0.85);
  const nube = Math.sin(Math.min(1, Math.max(0, k.tramo(t, Ttumba - 0.02, Ttumba + 0.34))) * Math.PI);
  m.perro(g, {
    x, dir, t,
    fase: (t - f11.inicio) * (vel / 46),
    marcha: corre > 0.4 ? 1 : 0,
    tumbado: t > Ttumba + 0.1 ? 1 : 0,
    pitch: 0.14 * corre + 0.2 * Math.max(0, nube - 0.4),
    cola: cae > 0.55 ? 0.9 : k.mez(0.85, 0.25, corre),
    colaTuck: 0.7 * corre,
    cabeza: { ang: 0.05, abre: cae > 0.55 ? 0.4 : 0.35 + 0.35 * corre, ojo: 1, oreja: 0.12 },
  });
  if (nube > 0.04) {
    g.save();
    g.globalAlpha = Math.min(1, nube * 1.35);
    for (const [dx, dy, r] of [[0, -28, 86], [-40, -14, 64], [42, -18, 68], [6, -62, 54], [-8, -2, 40]]) {
      const gr = g.createRadialGradient(x + dx, dy, 2, x + dx, dy, r);
      gr.addColorStop(0, "rgba(232,214,180,0.9)");
      gr.addColorStop(1, "rgba(232,214,180,0)");
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x + dx, dy, r, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
  m.cierra(g, 0.5);
}
