// El agua que toca, el lavado que se alarga, y el sensor del tubo que cierra.
import * as k from "#kit";
import { v } from "#voz";
import { fotograma, tiempoQuieto } from "../mundo.js";

export const desde = "con";
const f7 = v.frase(7), f8 = v.frase(8);
const corte = v.frase(9).inicio - 0.04;

export function dibuja(g, t) {
  const tm = tiempoQuieto(t, corte);
  const agua = k.suave(k.tramo(tm, f7.t("agua") - 0.1, f7.t("toca") + 0.35));
  const arco = k.suave(k.tramo(tm, f7.t("alarga") - 0.08, f7.finDe("lavado")));
  const alTubo = k.suave(k.tramo(tm, f8.inicio, f8.t("tubo") + 0.15));
  const valvula = k.suave(k.tramo(tm, f8.t("cierra") - 0.04, f8.t("llegar") + 0.05));
  const cam = {
    x: k.mez(k.mez(540, 760, k.suave(k.tramo(tm, f7.t("alarga") - 0.15, f7.t("lavado")))), 390, alTubo),
    y: k.mez(k.mez(1100, 650, k.suave(k.tramo(tm, f7.t("alarga") - 0.15, f7.t("lavado")))), 470, alTubo),
    z: k.mez(k.mez(1.15, 2.6, k.suave(k.tramo(tm, f7.t("alarga") - 0.15, f7.t("lavado")))), 3.9, alTubo),
  };
  fotograma(g, cam, {
    pala: 0.9,
    alrededor: 0,
    carga: 1,
    agua: agua * (1 - valvula * 0.15),
    tm,
    corriente: 0,
    tope: 0.35,
    arco,
    valvula,
    golpe: 0,
  }, "frente");
}
