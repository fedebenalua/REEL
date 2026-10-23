// «Los autores creen que está atento: encaja la palabra con el juguete que recuerda.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "autores";

const f7 = v.frase(7), f8 = v.frase(8);
const Tatento = f7.t("atento");
const Tencaja = f7.t("encaja");
const Tjuguete = f7.t("juguete");
const Trecuerda = f7.t("recuerda");
const Tmomento = f8.t("momento");
const Tojo = f8.t("ojo");
const Totras = f8.t("otras");

export function dibuja(g, t) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#2a120c");
  fondo.addColorStop(0.5, "#6a3018");
  fondo.addColorStop(1, "#1a0c08");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 980, 900, "255,180,90", 0.25);

  const alerta = k.suave(k.tramo(t, Tatento - 0.15, Tatento + 0.35));
  const mira = (1 - alerta) * 12;
  m.ojoGrande(g, 540, 980, 1.2, { t, alerta, miraX: mira, miraY: 4 });

  const uAro = k.tramo(t, Tencaja - 0.08, Tjuguete + 0.15);
  m.anillos(g, 700, 1180, uAro);

  const nace = k.suave(k.tramo(t, Tjuguete - 0.08, Tjuguete + 0.4));
  const queda = k.suave(k.tramo(t, Trecuerda - 0.1, Trecuerda + 0.25));
  const bola = Math.max(nace, queda) * (1 - k.suave(k.tramo(t, Totras - 0.4, Totras - 0.16)));
  const rebote = Math.sin(Math.max(0, k.tramo(t, Trecuerda - 0.05, Trecuerda + 0.85)) * Math.PI) * 36;
  if (bola > 0.02) m.pelota(g, 760, 1220 - bola * 40 - rebote, 80 + bola * 55, bola);

  const aMarco = k.claves([
    [Tojo - 0.02, 0],
    [Tmomento + 0.08, 1],
    [Totras - 0.4, 1],
    [Totras - 0.16, 0],
  ])(t);
  m.marco(g, aMarco);
  m.velo(g, 0.35);
}
