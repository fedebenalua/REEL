// El dolor de cabeza sale de la funda. El tejido, dentro, sigue quieto.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, busto, cerebro, fundaRoja, velo } from "../mundo.js";

export const desde = "dolor#2";
const f16 = v.frase(16), f17 = v.frase(17);
const Tsal = f16.t("sale"), Tfun = f16.t("funda"), Tami = f17.t("amigo");

export function dibuja(g, t) {
  const abre = k.suave(k.tramo(t, Tsal - 0.05, Tfun + 0.35));
  const entra = k.suave(k.tramo(t, Tami - 0.15, Tami + 0.9));
  const S = k.mez(210, 280, entra);
  const y = k.mez(980, 860, entra);
  cuarto(g);
  busto(g, 540, y, S * (1 - abre * 0.15), 1);
  if (abre > 0.05) {
    g.save();
    g.globalAlpha = abre;
    fundaRoja(g, 540, y - S * 0.05, S * k.mez(0.95, 1.2, entra), 1);
    cerebro(g, 540, y - S * 0.02, S * k.mez(0.62, 1.05, entra), { brillo: 0.14 });
    g.restore();
  }
  velo(g, 0.7);
}
