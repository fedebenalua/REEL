// La calle: la ambulancia ya viene de frente. Los anillos se aprietan y, al llegar, se queda quieta antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { ambulancia } from "../mundo.js";

export const desde = "sirena";

const f = v.frase(6);
const T0 = f.t("sirena");
const Tfin = f.finDe("acerca");
const Tcorte = v.t("ese");

export function dibuja(g, t) {
  // llega en «acerca» y reposa hasta el corte
  const u = k.suave(k.tramo(t, T0, Tfin));
  const quieto = t > Tfin ? 1 : u;
  ambulancia(g, Math.min(1, quieto));
  // la luz del puente deja de relevarse: en el reposo, u ya no cambia
  void Tcorte;
}
