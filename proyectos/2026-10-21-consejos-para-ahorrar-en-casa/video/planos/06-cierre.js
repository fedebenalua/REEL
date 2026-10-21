// «Envíaselo a ese amigo que seca los calcetines en el radiador.»
import * as k from "#kit";
import { v } from "#voz";
import {
  vista, camino2D, pared, suelo, radiador, prenda, velo, vineta,
} from "../mundo.js";

const { suave: su, tramo: tr } = k;
const F = v.frase(8);
export const desde = "Enviaselo";
export const entrada = "corte";

const cam = camino2D([
  [F.inicio, [1.1, 0, 30]],
  [F.t("calcetines"), [1.35, 0, 0]],
  [F.fin, [1.4, 0, -10]],
]);

export function dibuja(g, t) {
  pared(g, "255,120,70");
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  suelo(g);

  const cae = su(tr(t, F.t("calcetines") - 0.2, F.t("calcetines") + 0.35));
  radiador(g, t, { calor: 0.9, bloqueado: cae * 0.7, w: 560, h: 300 });

  // calcetines caen
  for (let i = 0; i < 4; i++) {
    const u = su(tr(t, F.t("calcetines") - 0.15 + i * 0.05, F.t("calcetines") + 0.25 + i * 0.05));
    const x = -120 + i * 80;
    const y = mez(-700, -40 + (i % 2) * 20, u);
    prenda(g, "calcetin", x, y, 0.3 * Math.sin(i), 1.3, Math.max(0.3, u));
  }

  // pastilla «ese amigo»
  const amigo = su(tr(t, F.t("amigo") - 0.05, F.t("amigo") + 0.4));
  if (amigo > 0.01) {
    g.save();
    k.redondo(g, -200, 280, 400, 90, 40);
    g.fillStyle = `rgba(30,100,255,${0.9 * amigo})`; g.fill();
    g.font = "800 48px Figtree"; g.fillStyle = `rgba(255,255,255,${amigo})`;
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("Ese amigo", 0, 325);
    g.restore();
  }

  velo(g, 0.45);
  vineta(g, 0.4);
}

function mez(a, b, u) { return a + (b - a) * u; }
