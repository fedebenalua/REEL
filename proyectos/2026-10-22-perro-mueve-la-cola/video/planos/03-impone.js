// «Si aparece un perro que no conoce y le impone…» y «la del apartarse».
// El perro grande delante; el nuestro recula y el meneo llega más lejos a su izquierda.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "aparece";
export const entrada = "corte";

const f6 = v.frase(6), f7 = v.frase(7);
const Timp = f6.t("impone");
const Tizq = f6.t("izquierda");
const Tizq2 = f7.t("izquierda");
const Tap = f7.t("apartarse");
const Tcorte = v.frase(8).t("otro");

export function dibuja(g, t) {
  const zDe = k.claves([
    [f6.inicio, 0.96],
    [Timp, 0.92],
    [Tap, 0.98],
    [Tcorte, 0.96],
  ]);
  const cam = { z: zDe(t), fx: 520, fy: 1080 };
  const frio = k.suave(k.tramo(t, Timp - 0.1, Timp + 0.4));
  m.parque(g, cam, t, frio * 0.55);
  const X = (x) => 540 + (x - cam.fx) * cam.z;
  const Y = (y) => 960 + (y - cam.fy) * cam.z;
  const S = (s) => s * cam.z;

  const llega = k.entra(k.suave(k.tramo(t, f6.inicio - 0.04, Timp - 0.15)));
  m.perroFrente(g, X(160), Y(1000), S(1.35 * (0.86 + 0.14 * llega)), { t });

  const sesgo = k.claves([
    [f6.inicio, 0.2],
    [Timp, -0.35],
    [Tizq, -1],
    [Tcorte, -1],
  ]);
  const calma = k.suave(k.tramo(t, Tcorte - 0.45, Tcorte - 0.16));
  const ang = k.mez(m.angulo(t, sesgo(t)), -m.extension(-1).izq * 0.92, calma);
  const paso = -k.suave(k.tramo(t, Tizq - 0.1, Tap + 0.35));
  const brilloR = k.suave(k.tramo(t, Tizq2 - 0.1, Tizq2 + 0.3)) * (1 - calma);
  const nervio = k.suave(k.tramo(t, Tizq2 + 0.05, Tap - 0.05)) * (1 - calma);

  const dx = X(760), dy = Y(1240);
  m.perroDetras(g, dx, dy, S(1.05), {
    ang,
    paso,
    giro: -0.25,
    brilloR,
    nervio,
    nervioHacia: -1,
    rastro: calma > 0.55 ? [] : m.rastro(t, sesgo(t)),
    t,
  });
  const aArco = k.suave(k.tramo(t, Tizq - 0.1, Tizq + 0.25)) * (1 - k.suave(k.tramo(t, f6.fin - 0.1, f7.inicio + 0.15)));
  const aArco2 = k.pulso(t, Tap, 0.3);
  m.arcos(g, dx, dy, 280 * S(1.05), sesgo(t), Math.max(aArco, aArco2));
  m.velo(g, 0.68);
}
