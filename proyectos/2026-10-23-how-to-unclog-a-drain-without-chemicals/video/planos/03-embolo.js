// «If you haven't, gloves on…» El émbolo, con el rebosadero tapado. El agua no baja.
import * as k from "#kit";
import { v } from "#voz";
import { lavabo } from "../lavabo.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "haven't";

const f5 = v.frase(5), f6 = v.frase(6);
const Tgloves = f5.t("gloves"), Tcloth = f5.t("cloth"), Tplunge = f5.t("plunge");
const Tfull = f6.t("full");

const CAM = [
  [f5.t("haven't"), { x: 540, y: 1100, s: 1.08 }],
  [Tcloth, { x: 640, y: 1080, s: 1.2 }],
  [Tplunge, { x: 540, y: 1120, s: 1.38 }],
  [Tfull, { x: 540, y: 1140, s: 1.14 }],
  [f6.t("full") + 0.45, { x: 540, y: 1140, s: 1.14 }],
];

export function dibuja(g, t) {
  const guantes = k.suave(k.tramo(t, Tgloves - 0.15, Tgloves + 0.35));
  const pano = k.suave(k.tramo(t, Tcloth - 0.1, Tcloth + 0.4));
  // el émbolo entra, bombea, y en «full» se queda arriba, quieto
  let embolo = -1;
  if (t > Tplunge - 0.35) {
    const entra = k.suave(k.tramo(t, Tplunge - 0.35, Tplunge + 0.05));
    const bombea = k.tramo(t, Tplunge, Tfull - 0.15);
    const quieto = k.suave(k.tramo(t, Tfull - 0.2, Tfull + 0.15));
    embolo = entra * (1 - quieto) * (0.15 + 0.75 * bombea) + quieto * 0.98;
  }
  g.save();
  camara(g, rutaCam(t, CAM));
  lavabo(g, t, { nivel: 0.42, derrame: 0, grifo: 0, guantes, pano, embolo, dentro: 0 });
  g.restore();
  velo(g, 0.58);
  viñeta(g, 0.35);
}
