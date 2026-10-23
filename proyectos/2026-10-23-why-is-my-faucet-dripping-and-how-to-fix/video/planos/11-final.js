// «Send this to that friend whose faucet won't stop dripping.»
// La cocina otra vez: cae una gota y la cámara se acerca a la punta, donde otra gota enorme crece despacio; en el último
// fotograma está a punto de caer, igual que en el primero del vídeo.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaCocina } from "../cocina.js";
import { rutaCam, velo, viñeta } from "../mundo.js";

const F = v.frase(12);
export const desde = F.inicio - 0.04;
export const FIN = v.duracion;
const { suave: su, tramo: tr } = k;
const T0 = desde;
// la última gota termina de crecer justo después del final, con el mismo tamaño con que empieza el vídeo
const GOTAS = [[T0 + 0.75, 0.85], [FIN + 0.34, 2.6]];
const CAMS = [[T0, { x: 100, y: 530, s: 1.12 }], [T0 + 1.2, { x: 100, y: 530, s: 1.12 }], [FIN, { x: 180, y: 345, s: 3.0 }]];

export function dibuja(g, t) {
  dibujaCocina(g, t, { cam: rutaCam(t, CAMS), gotas: GOTAS });
  velo(g, 0.4); viñeta(g, 0.45);
}
