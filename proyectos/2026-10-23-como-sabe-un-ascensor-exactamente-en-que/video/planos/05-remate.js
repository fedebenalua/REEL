// «Así que no ve el piso: lo cuenta, y el imán le confirma que ha acertado. Envíaselo a ese amigo que se queda mirando
// los números del ascensor.»
// La cabina baja contando y cada imán la confirma; vuelve a subir a toda velocidad, igual que en el primer fotograma.
import { escena } from "../escena.js";
import { v } from "#voz";
export const desde = () => v.frase(10).inicio;
export const entrada = "sigue";
export function dibuja(g, t) { escena(g, t); }
