// El gancho: la escalera ya en marcha, el zapato metido en el cepillo.
// 1. La pregunta, con los cepillos enormes desde el fotograma 0.
// 2. Parece que barren el polvo: el polvo está en la pala y el cepillo pasa de lado.
// 3. No barren nada: el polvo sigue ahí, y todo reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { mall, camara, faseHasta, pt, UZ } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tcep = f1.t("cepillos"), Tlat = f1.t("laterales");
const Tpol = f2.t("polvo"), Tnada = f3.t("nada");
const cerca = pt(UZ, -0.68), polvo = pt(UZ, -0.48);

const cam = camara([
  [-0.5, 2.7, cerca.x - 70, cerca.y + 20],
  [0, 2.15, cerca.x - 20, cerca.y],
  [Tcep, 1.55, -160, 1040],
  [Tlat, 1.02, 0, 980],
  [f2.inicio, 1.05, -30, 1000],
  [Tpol, 1.85, polvo.x, polvo.y - 30],
  [Tnada, 1.9, polvo.x, polvo.y - 20],
  [f3.fin, 1.9, polvo.x, polvo.y - 20],
]);

export function dibuja(g, t) {
  const lat = k.de(t, f2.inicio, Tpol, -0.68, -0.48);
  const bend = Math.min(1, (t < f2.inicio ? 0.85 : k.de(t, f2.inicio, Tpol, 0.85, 0.2)) + 0.45 * k.pulso(t, Tcep, 0.22));
  const sucio = k.entra(k.tramo(t, f2.inicio + 0.05, Tpol));
  const fase = faseHasta(t, 0.55, Tnada - 0.15, Tnada + 0.28);
  mall(g, t, cam(t), { fase, bend, polvo: sucio, lat, zapato: 1 });
}
