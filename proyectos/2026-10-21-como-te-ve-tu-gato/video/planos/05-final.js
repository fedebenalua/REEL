// «Así que te ve borroso y sin rojos, pero sabe perfectamente quién eres.»
// «Envíaselo a ese amigo que dice que a su gato le da igual.»
// La cara de tu gato otra vez. Se entra con un corte en «Así».
// - La cámara se acerca a su ojo; en la pupila, abierta, se te ve a ti como te ve él: borroso y con el jersey sin rojo.
//   «pero sabe»: le saludas; «quién»: la pupila se abre un poco más y se enciende una luz cálida en ella.
// - «Envíaselo»: la cámara vuelve a ver la cara; «le da igual»: parpadea despacio (como hacen los gatos cuando están a
//   gusto contigo). Al final la cámara entra hasta pegarse a su ojo, con la pupila en raja y tú nítido dentro: el primer
//   fotograma del vídeo.
import * as k from "#kit";
import { v } from "#voz";
import { ancla, cara, enPupila, fondoCasa, OJOS } from "../mundo.js";
import { vistaGato } from "../salon.js";

export const desde = "asi";

const { suave: su, tramo: tr, mez } = k;
const f9 = v.frase(9), f10 = v.frase(10);
const Tamigo = f10.t("amigo"), Tdice = f10.t("dice");
const T0 = f9.inicio, Tpero = f9.t("pero"), Tquien = f9.t("quien"), T10 = f10.inicio, Tle = f10.t("le"), Tigual = f10.t("igual"), FIN = v.duracion;
const OJO = OJOS[0], CARA = [0, 110];
const Tparp = Tle, Tabre = Tigual + 0.55;

const escL = k.claves([[T0, Math.log(0.95)], [T0 + 0.2, Math.log(0.97)], [Tpero - 0.2, Math.log(3.6)], [T10 - 0.1, Math.log(3.9)], [T10 + 0.9, Math.log(1.05)], [Tabre, Math.log(1.12)], [FIN, Math.log(7.5)]]);
const foco = k.claves([[T0, 0], [T0 + 0.2, 0], [Tpero - 0.2, 1], [T10 - 0.1, 1], [T10 + 0.9, 0], [Tabre, 0], [FIN, 1]]);

export function dibuja(g, t) {
  fondoCasa(g);
  const esc = Math.exp(escL(t)), f = su(Math.min(1, Math.max(0, foco(t))));
  const [x, y] = ancla(esc, [mez(CARA[0], OJO[0], f), mez(CARA[1], OJO[1], f)]);
  const pupila = t < T10 ? mez(0.45, 0.85, su(tr(t, T0, Tpero - 0.4))) + 0.12 * su(tr(t, Tquien - 0.1, Tquien + 0.3))
    : mez(0.9, 0.3, su(tr(t, Tabre, FIN)));
  // el parpadeo lento
  const abre = t < Tparp ? 1 : t < Tigual + 0.05 ? 1 - su(tr(t, Tparp, Tigual + 0.05)) * 0.95 : 0.05 + 0.95 * su(tr(t, Tigual + 0.15, Tabre));
  const nitido = su(tr(t, Tigual + 0.1, Tabre));
  const calido = su(tr(t, Tquien - 0.1, Tquien + 0.3)) * (1 - su(tr(t, T10, T10 + 0.8)));
  cara(g, t, x, y, esc, {
    pupila, abre, inclina: 0.06 * su(tr(t, Tpero, Tquien)) * (1 - su(tr(t, T10, T10 + 0.8))) - 0.1 * su(tr(t, Tamigo - 0.1, Tamigo + 0.4)) * (1 - su(tr(t, Tparp, Tabre))),
    orejas: [0.25 * k.pulso(t, Tdice + 0.1, 0.09), 0.3 * k.pulso(t, Tdice + 0.25, 0.09)], bigotes: 0.6 * k.pulso(t, Tamigo + 0.3, 0.25),
    dentro: (c, px, py) => enPupila(c, px, py, (caja) => {
      vistaGato(c, t, { caja, borroso: 1 - nitido, rojo: 1 - nitido, verde: 1 - nitido, saluda: t > Tpero && t < T10 ? t - Tpero : 0 });
      if (calido > 0.01) k.brillo(c, px, py, 260, "255,190,110", 0.55 * calido);
    }, 1),
    cornea: 1 - tr(esc, 3, 7),
  });
}
