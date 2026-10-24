// «vuelve del parque oliendo a algo innombrable.» El mismo revolcón del principio, para que el vídeo enlace.
import * as k from "#kit";
import { v } from "#voz";
import { parqueListo, cierra, monton, olor, perroRueda, persona, cam, hookCam, hookPerro, ENGANCHE } from "../mundo.js";

export const desde = (vz) => vz.frase(12).t("parque") - 0.04;

export function dibuja(g, t) {
  const fin = v.duracion;
  const tt = t - fin;
  const u = k.suave(k.tramo(t, fin - 0.9, fin - 0.02));
  const amplio = cam(4.3 - (t - desde(v)) * 0.12, 460 + (t - desde(v)) * 14, -70);
  const cerca = hookCam(tt);
  const c = cam(
    Math.exp(k.mez(Math.log(amplio.Z), Math.log(cerca.Z), u)),
    k.mez(amplio.cx, cerca.cx, u),
    k.mez(amplio.cy, cerca.cy, u),
  );
  parqueListo(g, c, t, 0.15);
  monton(g, ENGANCHE.pila, t, 1);
  olor(g, ENGANCHE.pila, -12, "186,220,60", tt, { n: 12, fuerza: 1.2 + u * 0.3, alfa: 0.5 });
  const p = hookPerro(tt);
  perroRueda(g, p.x, tt);
  if (u < 0.85) {
    g.save(); g.globalAlpha = 1 - u; g.translate(640, 0); g.scale(0.52, 0.52);
    persona(g, { x: 0, t, recto: 1, paso: 0, dir: -1, inclina: -0.1, mano: [-4, -155], tira: 0.8, boca: 0.3 });
    g.restore();
  }
  cierra(g, 0.48);
}
