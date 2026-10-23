// «Why is your faucet dripping, and how do you fix it in five minutes?» … «One drip a second wastes»
// La cocina de perfil. Fotograma 0: macro de la punta del grifo con la gota enorme a punto de caer; la cámara se
// aleja hasta ver el fregadero mientras caen más gotas (una por segundo; la 2.ª cae en «dripping»).
// En «five minutes» sale «5 min» y en «One drip a second», «1 drip / sec».
import * as k from "#kit";
import { v } from "#voz";
import { dibujaCocina } from "../cocina.js";
import { rutaCam, velo, viñeta } from "../mundo.js";

export const desde = 0;
export const FIN = v.frase(2).t("wastes") - 0.04;
const { suave: su, tramo: tr } = k;
const Tdrip = v.frase(1).t("dripping"), Tfive = v.frase(1).t("five"), Tone = v.frase(2).inicio;

export const GOTAS = [[0.34, 3.0], [Tdrip, 0.8], [2.0, 0.85], [3.0, 0.85], [4.0, 0.85], [5.0, 0.85]];
const CAMS = [[0.4, { x: 180, y: 345, s: 3.0 }], [1.55, { x: 100, y: 530, s: 1.12 }], [3.9, { x: 100, y: 530, s: 1.12 }], [FIN, { x: 120, y: 560, s: 1.2 }]];

export function dibuja(g, t) {
  dibujaCocina(g, t, { cam: rutaCam(t, CAMS), gotas: GOTAS });
  // «5 min»
  const a5 = su(tr(t, Tfive - 0.1, Tfive + 0.2)) * (1 - su(tr(t, Tone - 0.1, Tone + 0.05)));
  k.pastilla(g, 250, 1180 + 30 * (1 - a5), "5", "min", "150,240,200", a5, 130);
  const a1 = su(tr(t, Tone + 0.1, Tone + 0.4));
  k.pastilla(g, 330, 1180 + 30 * (1 - a1), "1", "drip / sec", "150,225,255", a1, 110);
  velo(g, 0.4); viñeta(g, 0.45);
}
