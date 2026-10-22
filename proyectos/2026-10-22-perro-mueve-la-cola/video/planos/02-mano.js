// «Igual que tu mano derecha, que obedece a esa misma mitad.»
// De espaldas: su mano derecha cae a la derecha de la pantalla, y se enciende la mitad izquierda.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(5).t("igual") - 0.04;
export const entrada = "corte";

const f = v.frase(5);
const Tmitad = f.t("mitad");
const Tcorte = v.frase(6).t("aparece");

export function dibuja(g, t) {
  m.cuarto(g, t);
  const sale = k.suave(k.tramo(t, Tcorte - 0.4, Tcorte - 0.14));
  const onda = Math.sin((t - f.inicio) * 7.5);
  const saludo = (0.25 + 0.75 * (0.5 + 0.5 * onda)) * (1 - sale);
  m.personaEspaldas(g, 430 + onda * 70 * (1 - sale), 1580, 1.65, {
    saludo,
    brillo: 0.75 + 0.25 * k.pulso(t, Tmitad, 0.2),
  });
  m.velo(g, 0.38);
}
