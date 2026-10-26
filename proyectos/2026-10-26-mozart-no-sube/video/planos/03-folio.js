// El folio que se dobla, los agujeros, el 119 contra el 110, y el cuarto de hora.
import * as k from "#kit";
import { v } from "#voz";
import { folio, tijeras, numero, reloj, velo } from "../mundo.js";

export const desde = "despues";
export const entrada = "corte";

const f8 = v.frase(8);
const f9 = v.frase(9);
const f10 = v.frase(10);
const f11 = v.frase(11);
const Tdobla = f8.t("doblas");
const Taguj = f8.t("agujeros");
const Tenc = f9.t("encima");
const T119 = f10.t("diecinueve");
const T110 = f10.t("diez");
const Tmin = f11.t("quince");
const Test = f11.t("estaba");

export function dibuja(g, t) {
  const bg = g.createRadialGradient(540, 980, 40, 540, 1000, 1100);
  bg.addColorStop(0, "#4a301c");
  bg.addColorStop(0.5, "#1a1020");
  bg.addColorStop(1, "#07040c");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#5a3a22";
  g.fillRect(0, 1420, 1080, 500);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.4;
  g.drawImage(k.manchas, 0, 1420, 1080, 500);
  g.restore();

  const llega = k.entra(k.tramo(t, 20.52, 21.35));
  const pliegue = k.suave(k.tramo(t, Tdobla - 0.05, Tdobla + 0.45));
  const corta = k.suave(k.tramo(t, Taguj - 0.4, Taguj + 0.05));
  const aguj = k.entra(k.tramo(t, Taguj - 0.05, Taguj + 0.28));
  const abre = k.suave(k.tramo(t, Taguj + 0.05, Taguj + 0.35));
  const pliegueVisto = pliegue * (1 - abre);

  folio(g, k.mez(820, 540, llega), 1240, 760, 780, { pliegue: pliegueVisto, agujeros: aguj });
  if (corta > 0.02 && abre < 0.92) {
    tijeras(g, k.mez(1180, 400, corta), k.mez(760, 1180, corta), 1.8, -0.6 + corta * 0.8);
  }

  const mas = k.entra(k.tramo(t, Tenc - 0.05, Tenc + 0.32));
  const aNum = k.suave(k.tramo(t, T119 - 0.05, T119 + 0.32));
  const baja = k.suave(k.tramo(t, Tmin + 0.05, Test - 0.08));
  const alMas = mas * (1 - aNum);
  numero(g, "+8", 300, k.mez(700, 1180, mas), 200, "140,52,28", alMas);
  const mas9 = k.entra(k.tramo(t, f9.t("nueve") - 0.04, f9.t("nueve") + 0.28));
  numero(g, "+9", 780, k.mez(680, 1120, mas9), 170, "140,52,28", alMas * mas9);

  const v119 = Math.round(k.mez(119, 110, baja));
  numero(g, String(v119), 280, k.mez(720, 1220, aNum), 190, "140,52,28", aNum);
  const al110 = k.entra(k.tramo(t, T110 - 0.05, T110 + 0.28));
  numero(g, "110", 790, k.mez(700, 1280, al110), 160, "60,78,120", aNum * al110);

  const alReloj = k.entra(k.tramo(t, Tmin - 0.08, Tmin + 0.28));
  const minutos = k.mez(0, 15, k.suave(k.tramo(t, Tmin, Test - 0.25)));
  reloj(g, 540, 700, k.mez(0.2, 1.55, alReloj), minutos, alReloj > 0.04 ? 1 : 0);

  velo(g, 0.7);
}
