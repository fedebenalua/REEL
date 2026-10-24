// «The first wireless remote was a flashlight too.»
// La tele de caja. El haz acierta una esquina y el dial da un paso. Luego falla, y no pasa nada.
import * as k from "#kit";
import { v } from "#voz";
import { ESQUINA, camDe, escenaEsquina } from "../mundo.js";

const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
const CORTE = v.frase(10).t("now");

const quieto = f9.t("miss") - 0.14;
const cam = camDe(
  [[f7.t("first"), 1.02], [f7.t("flashlight"), 1.22], [f8.t("hit"), 1.7], [f8.t("corner"), 2.45], [quieto, 2.45], [f9.t("miss"), 1.15], [f9.t("nothing"), 0.9], [CORTE - 0.28, 0.88]],
  [[f7.t("first"), 540], [f8.t("hit"), 680], [f8.t("corner"), ESQUINA.x], [quieto, ESQUINA.x], [f9.t("miss"), 720], [f9.t("nothing"), 780], [CORTE - 0.28, 780]],
  [[f7.t("first"), 800], [f8.t("corner"), ESQUINA.y + 70], [quieto, ESQUINA.y + 70], [f9.t("nothing"), 740], [CORTE - 0.28, 760]],
);

export const desde = "first";
export const entrada = "corte";

export function dibuja(g, t) {
  const llega = k.entra(k.tramo(t, f7.t("first") - 0.05, f7.t("flashlight") + 0.1));
  const acierto = k.suave(k.tramo(t, f8.t("hit"), f8.t("corner") + 0.12));
  const fallo = k.suave(k.tramo(t, f9.t("miss") - 0.04, f9.t("nothing") + 0.02));
  const fuera = { x: 1120, y: 520 };
  const hacia = k.suave(k.tramo(t, f8.inicio, f8.t("corner")));
  const bx = fallo > 0
    ? k.mez(ESQUINA.x, fuera.x, fallo)
    : k.mez(760, ESQUINA.x, hacia);
  const by = fallo > 0
    ? k.mez(ESQUINA.y, fuera.y, fallo)
    : k.mez(700, ESQUINA.y, hacia);
  const dial = acierto * 0.9;
  escenaEsquina(g, t, cam(t), {
    tm: Math.min(t, CORTE - 0.22),
    llega,
    acierto: acierto * (1 - fallo),
    fallo,
    haz: llega * (1 - k.suave(k.tramo(t, f9.t("happened"), CORTE - 0.35))),
    bx, by,
    dial,
    canal: t > f8.t("corner") ? 5 : 4,
    golpe: f8.t("corner"),
  });
}
