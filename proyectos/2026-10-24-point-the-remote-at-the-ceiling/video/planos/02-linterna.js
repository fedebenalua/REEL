// «Same trick as a flashlight in a dark room.»
// Otro sitio: el cuarto a oscuras. El haz pega en el techo y la habitación se llena.
import * as k from "#kit";
import { v } from "#voz";
import { camDe, escenaLinterna } from "../mundo.js";

const f5 = v.frase(5), f6 = v.frase(6);
const CORTE = v.frase(7).t("first");

const cam = camDe(
  [[f5.inicio, 1.65], [f5.t("flashlight"), 1.9], [f6.t("beam"), 1.35], [f6.t("ceiling"), 1.7], [f6.t("fills"), 0.78], [CORTE - 0.28, 0.76]],
  [[f5.inicio, 640], [f5.t("flashlight"), 640], [f6.t("ceiling"), 530], [f6.t("fills"), 540], [CORTE - 0.28, 540]],
  [[f5.inicio, 1150], [f5.t("flashlight"), 1120], [f6.t("beam"), 720], [f6.t("ceiling"), 320], [f6.t("fills"), 800], [CORTE - 0.28, 820]],
);

export const desde = "same";
export const entrada = "corte";

export function dibuja(g, t) {
  const entraL = k.entra(k.tramo(t, f5.inicio - 0.45, f5.t("flashlight") - 0.05));
  const haz = k.suave(k.tramo(t, f5.inicio - 0.1, f6.t("ceiling")));
  const llena = k.suave(k.tramo(t, f6.t("hits"), f6.t("fills") + 0.35));
  escenaLinterna(g, t, cam(t), {
    tm: Math.min(t, CORTE - 0.22),
    entra: entraL,
    haz,
    llena,
    golpe: f6.t("ceiling"),
  });
}
