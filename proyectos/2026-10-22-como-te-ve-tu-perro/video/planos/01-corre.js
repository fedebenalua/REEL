// «¿Cómo te ve tu perro cuando te mira?»
// - Fotograma 0: tu perro corre hacia ti por la hierba alta del campo, enorme, con las orejas al viento y la lengua
//   fuera; la cámara, a ras de hierba, retrocede delante de él y la hierba pasa a los lados.
// - «perro»: frena y se sienta delante. «cuando te mira»: la cámara sube a tu altura y él levanta la cabeza hacia ti;
//   en «mira» la ladea.
import * as k from "#kit";
import { v } from "#voz";
import { camara, campo, pon } from "../campo.js";
import { perroFrente } from "../perro.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1);
const Tperro = f1.t("perro"), Tcuando = f1.t("cuando"), Tmira = f1.t("mira"), Fin = v.frase(2).inicio;
const Tfrena = Tperro + 0.25;
// dónde va la cámara (z) y lo que adelanta el perro: corre a 6 m/s y frena en «perro»
const vel = (t) => 6 * (1 - su(tr(t, Tperro - 0.1, Tfrena + 0.1)));
const zCam = (t) => { let z = 0; const n = 30; for (let i = 0; i < n; i++) z += vel((t * (i + 0.5)) / n) * (t / n); return z; };
export function dibuja(g, t) {
  const sube = su(tr(t, Tcuando - 0.05, Tmira + 0.1));
  const zc = zCam(t), dPerro = mez(0.62, 0.78, su(tr(t, Tperro - 0.1, Tfrena + 0.2)));
  const corre = 1 - su(tr(t, Tperro - 0.05, Tfrena + 0.1));
  const H = [0.02, 0.49, -zc + dPerro];
  const cam = camara([0, mez(0.42, 0.85, sube), -zc], k.mezV([0, 0.42, -zc + 6], [0, 0.3, H[2]], sube));
  campo(g, t, cam, {
    cosas: [{ X: [H[0], 0, H[2]], dibuja: (c) => {
      const p = pon(cam, H); if (!p) return;
      const esc = p.s * 0.25 / 1000;
      perroFrente(c, t, p.x, p.y, esc, {
        corre, paso: t * 2.6, orejasVuelan: corre, contento: 1, orejas: [0.3 + 0.5 * sube, 0.3 + 0.5 * sube],
        mira: [0, -0.32 * sube], inclina: 0.16 * su(tr(t, Tmira - 0.1, Tmira + 0.25)), pupila: 0.35,
      });
    } }],
  });
}
