// «¿Qué pasaría si el campo magnético de la Tierra desapareciera? El aire no saldría volando.»
// Fotograma 0: la Tierra grande y el viento del Sol ya chocando contra el escudo. En «desapareciera» el escudo
// se rasga. Luego la cámara se pega al borde azul: las partículas paran y el aire se queda.
import * as k from "#kit";
import { v } from "#voz";
import { ENC, dibujaEspacio } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2);
const Tdes = f1.t("desapareciera"), Tvol = f2.t("volando");
const corte = v.frase(3).inicio - 0.04;

const P1 = [-0.7, 0.16, 2.55], M1 = [0, 0, 0];
const P2 = [-1.95, 0.1, 0.72], M2 = [-1.02, 0, 0];

function camara(t) {
  const u1 = Math.min(1, t / Math.max(0.4, Tdes));
  let pos = k.mezV(ENC.pos, P1, u1), mira = k.mezV(ENC.mira, M1, u1);
  const u2 = k.suave(k.tramo(t, f2.inicio - 0.08, Tvol + 0.08));
  pos = k.mezV(pos, P2, u2); mira = k.mezV(mira, M2, u2);
  return k.mira(pos, mira);
}

export function dibuja(g, t) {
  const tp = Math.min(t, corte - 0.2);
  const cam = camara(tp), antes = camara(Math.min(tp, t - 1 / 60));
  const escudo = 1 - k.suave(k.tramo(tp, Tdes - 0.02, Tdes + 0.9));
  dibujaEspacio(g, cam, antes, { t: tp, escudo, aire: 0.35 + (1 - escudo) * 0.6, viento: 1, luces: 0.2, velo: 0.4 });
}
