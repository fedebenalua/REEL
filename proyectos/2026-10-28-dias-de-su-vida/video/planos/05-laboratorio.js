// En la mayoría de pruebas del laboratorio, igual que cualquiera. Las fichas se van. El día de su vida se queda.
import * as k from "#kit";
import { v } from "#voz";
import { ficha, matraz, mesa, tarjeta, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(9);
const Tigual = f.t("igual");
const Fin = v.frase(10).inicio - 0.04;

const NUMS = ["8", "3", "5", "2", "9", "6"];

export function dibuja(g, t) {
  const seVan = k.suave(k.tramo(t, Tigual - 0.45, Tigual + 0.5));
  mesa(g);
  matraz(g, 200, 860, 2.15, 0.62 + 0.04 * Math.sin(t * 2));
  tarjeta(g, 800, 900, 400, 520, { num: "14", color: "#e23b4a", esc: 0, escenaAl: 1, rot: -0.03 });
  k.brillo(g, 800, 900, 520, "naranja", 0.2);
  for (let i = 0; i < NUMS.length; i++) {
    const u = k.suave(k.tramo(seVan, i / 12, i / 12 + 0.4));
    const y = 1040 - i * 22 - u * 640;
    ficha(g, 470, y, 230, 150, NUMS[i], 1 - u, (i - 2) * 0.03 + u * 0.25);
  }
  // reposo: ya no quedan fichas al final
  if (t > Fin - 0.35) {
    /* las fichas ya están fuera */
  }
  velo(g, 0.66);
}
