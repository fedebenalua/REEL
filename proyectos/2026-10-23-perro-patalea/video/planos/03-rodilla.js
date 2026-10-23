// La rodilla de casa: el martillo golpea y la pierna salta sola.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "como";

const f7 = v.frase(7);
const Tdan = f7.t("dan");
const Tsalta = f7.t("salta");
const Tcorte = v.t("cerebro");

export function dibuja(g, t) {
  const golpe = k.suave(k.tramo(t, Tdan - 0.28, Tdan + 0.06));
  const sube = k.suave(k.tramo(t, Tsalta - 0.12, Tsalta + 0.38));
  const baja = k.suave(k.tramo(t, Tsalta + 0.7, Tcorte - 0.28));
  const uSalta = sube * (1 - baja);

  const z = k.claves([
    [f7.inicio, 1.05],
    [Tdan, 1.18],
    [Tsalta, 1.02],
    [Tsalta + 0.45, 0.96],
    [Tcorte - 0.25, 0.98],
  ])(t);
  const fy = k.claves([
    [f7.inicio, 880],
    [Tsalta, 1040],
    [Tcorte - 0.25, 980],
  ])(t);

  m.conCam(g, { z, fx: 640, fy }, () => {
    m.salon(g, t);
    m.rodilla(g, golpe, uSalta);
  });
  m.velo(g, 0.88);
}
