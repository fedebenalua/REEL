// La consulta: el oclusor de 1,2 mm, y que con mucha graduación no basta. Frases 6 y 7.
import * as k from "#kit";
import { v } from "#voz";
import { consulta } from "../mundo.js";

const f6 = v.frase(6), f7 = v.frase(7);
export const desde = "consulta";

export function dibuja(g, t) {
  const disco = k.entra(k.tramo(t, f6.inicio - 0.05, f6.t("uno")));
  const pastilla = k.claves([
    [f6.t("uno"), 0],
    [f6.t("milimetro"), 1],
    [f6.fin, 1],
    [f7.t("mejor"), 0],
  ]);
  const blurDentro = k.claves([
    [f6.inicio, 8],
    [f7.t("mejor"), 6],
    [f7.t("enfoque"), 0],
    [f7.t("graduacion"), 1],
    [f7.t("basta"), 9],
    [f7.fin, 9],
  ]);
  const halo = k.suave(k.tramo(t, f7.t("mucha"), f7.t("basta")));
  consulta(g, {
    blur: 20,
    blurDentro: blurDentro(t),
    disco,
    hx: 540,
    hy: 1020,
    hr: 150,
    pastilla: pastilla(t) * (1 - halo * 0.3),
    halo,
  });
}
