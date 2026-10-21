// La otra apertura del hook (en lugar de planos/01-puerta.js).
// Fotograma 0: la lavadora entera tiembla y revienta en chorros de vapor, con monedas que salen disparadas; en
// «calentar el agua» la cámara se lanza a la puerta: el agua hierve al rojo. La frase 2, igual que la otra.
import { dibujaHook } from "../hook.js";

export const desde = 0;
export function dibuja(g, t) { dibujaHook(g, t, "vapor"); }
