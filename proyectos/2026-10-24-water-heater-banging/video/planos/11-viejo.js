// «Still banging, a leak, or eight years old? Call a pro.»
import * as k from "#kit";
import { v } from "#voz";
import { tanque } from "../cosas.js";
import { camara, cuarto, rutaCam, suelo, telefono, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(14).inicio;
export const entrada = "corte";

const f = v.frase(14);
const Tb = f.t("banging");
const Tl = f.t("leak");
const Tc = f.t("call");
const fin = v.frase(15).inicio;
const CAM = [
  [f.inicio, { x: 0, y: 10, s: 1.5 }],
  [Tl, { x: 20, y: 220, s: 1.7 }],
  [Tc, { x: 80, y: 20, s: 1.42 }],
  [fin, { x: 60, y: 10, s: 1.4 }],
];

export function dibuja(g, t) {
  const hop = Math.sin(Math.min(1, k.tramo(t, Tb, Tb + 0.4)) * Math.PI) * -64;
  const charco = k.suave(k.tramo(t, Tl, Tl + 0.7));
  const tel = k.suave(k.tramo(t, Tc, Tc + 0.28));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "servicio");
  suelo(g, 540, "#1a120c");
  g.save();
  g.globalAlpha = 0.85;
  g.fillStyle = "#2f6fbe";
  g.beginPath();
  g.ellipse(20, 520, 40 + charco * 260, 16 + charco * 48, 0, 0, 6.28);
  g.fill();
  g.restore();
  tanque(g, 0, 10, { calor: 0.15, oxido: 0.9, nivel: 0.7, salto: hop });
  telefono(g, 220, 60, tel, 1.25);
  g.restore();
  viñeta(g, 0.42);
  velo(g, 0.7);
}
