// «Y el de hoy usa luz, pero una que tus ojos no ven.»
// El salón de ahora, de noche, con el mando delante de la tele. Se entra con un corte en «Y».
// - «el de hoy»: la cámara se acerca a la punta del mando; «usa luz»: salen destellos morados hacia la tele;
//   «tus ojos no ven»: se vuelven transparentes, un temblor del aire.
import * as k from "#kit";
import { v } from "#voz";
import { destello, mando, ojito, punta, salon, velo } from "../mundo.js";

const { suave: su, tramo: tr, mez } = k;
const f5 = v.frase(5);
export const desde = (vz) => vz.frase(5).inicio;
const T0 = f5.inicio, Thoy = f5.t("hoy"), Tluz = f5.t("luz"), Tno = f5.t("no"), Tven = f5.t("ven"), Fin = v.frase(6).inicio;
const SALIDAS = []; for (let te = Tluz - 0.05; te < Fin - 0.6; te += 0.13) SALIDAS.push(te);

export function dibuja(g, t) {
  const c = su(tr(t, T0, Tluz));
  const cam = { x: mez(0, 6, c), y: mez(0, -60, c), z: mez(0, 1.4, c) };
  salon(g, cam, t, { encendida: 1, canal: 1 });
  const led = SALIDAS.reduce((m, te) => Math.max(m, k.pulso(t, te, 0.03)), 0) * (1 - su(tr(t, Tno, Tven)));
  mando(g, cam, t, { led });
  const a = punta(cam), b = ojito(cam);
  const fan = su(tr(t, Tno - 0.1, Tven));
  if (a && b) for (const te of SALIDAS) destello(g, a, b, (t - te) / 0.5, 110 * a.s / 2.17, fan);
  k.pastilla(g, 540, 640, "hoy", "", "120,200,255", su(tr(t, Thoy - 0.1, Thoy + 0.2)) * (1 - su(tr(t, Tluz, Tluz + 0.3))), 100);
  velo(g, 0.5);
}

export const momentos = { luz: Tluz };
