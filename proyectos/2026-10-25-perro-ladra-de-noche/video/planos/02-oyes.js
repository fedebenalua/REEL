// «Tú no oyes nada, y él no para.» La persona, entera, con la mano en la oreja. El pitido se apaga antes de llegar.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(2).inicio;
const f = v.frase(2);
const fin = v.frase(3).inicio;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio + 0.12, f.t("para") - 0.05));
  const quieto = k.suave(k.tramo(t, fin - 0.32, fin - 0.08));
  const Z = k.mez(4.6, 3.7, Math.max(u, quieto));
  const cx = k.mez(250, 360, u * (1 - quieto * 0.3));
  const c = { Z, cx, cy: -78 };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.dueno(g, 210, t, { dir: 1 });
  m.lado(g, 470, t, { dir: 1 });
  m.ondas(g, 500, -62, t, { radio: 36, fuerza: 1, color: "170,220,255" });
  m.rellena(g, 0.42);
}
