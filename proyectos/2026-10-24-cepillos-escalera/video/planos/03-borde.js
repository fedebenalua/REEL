// Otra vez la escalera, con el amigo en el borde. La cámara acaba en el mismo cepillo del principio.
import * as k from "#kit";
import { v } from "#voz";
import { mall, camara, pt, UZ } from "../mundo.js";

export const desde = "enviaselo";

const f = v.frase(11);
const Tborde = f.t("borde");
const cerca = pt(UZ, -0.84);

const cam = camara([
  [f.inicio - 0.15, 1.02, 0, 960],
  [f.t("amigo"), 1.35, -220, 1040],
  [Tborde, 2.15, cerca.x + 20, cerca.y],
  [f.fin + 0.7, 2.45, cerca.x, cerca.y],
]);

export function dibuja(g, t) {
  const fase = 0.42 * t;
  const bend = 0.35 + 0.6 * k.suave(k.tramo(t, f.t("pone"), Tborde + 0.15));
  mall(g, t, cam(t), { fase, bend, polvo: 0, lat: -0.84, zapato: 1 });
}
