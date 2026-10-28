// En los dos estudios, a casi todos les daba igual. Mira, se encoge de hombros y lo guarda.
import * as k from "#kit";
import { v } from "#voz";
import { calle, persona, velo } from "../mundo.js";

export const desde = (v) => v.frase(10).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(10);
const Tigual = f.t("igual");
const Tpoco = f.t("poco");

export function dibuja(g, t) {
  const entra = k.entra(k.tramo(t, f.inicio - 0.04, f.inicio + 0.35));
  const mira = entra * (1 - k.suave(k.tramo(t, Tpoco - 0.05, Tpoco + 0.3)));
  const hombro = k.suave(k.tramo(t, Tigual - 0.08, Tigual + 0.28));
  const baja = hombro;
  const paso = Math.sin(k.tramo(t, f.inicio, Tigual) * Math.PI) * (1 - hombro);
  calle(g, t);
  persona(g, 280, 1280, 460, 51, { ropa: "#ff6b8a", mira: mira * 0.8, hombro: hombro * 0.7, baja: baja * 0.6, paso, t, pulso: 0 });
  persona(g, 820, 1320, 420, 52, { ropa: "#3ecfb2", mira: mira * 0.5, hombro: hombro * 0.5, baja: baja * 0.5, t, pulso: 0 });
  persona(g, 500, 1760, 1040, 18, {
    ropa: "#7aa2ff",
    piel: "#e7b08a",
    pelo: "#241c18",
    mira,
    hombro,
    baja,
    paso,
    t,
    pulso: 0,
  });
  velo(g, 0.75);
}
