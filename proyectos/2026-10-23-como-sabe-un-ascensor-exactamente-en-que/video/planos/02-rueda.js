// «En muchos ascensores hay una rueda pegada al raíl que gira al subir, y manda un pulso por cada trocito que avanza.
// El ascensor los va sumando, y así sabe cuánto ha subido.»
// La cámara se mete en la rueda; cada trocito de raíl que pasa manda un pulso volando al contador.
import { escena } from "../escena.js";
import { v } from "#voz";
export const desde = () => v.frase(3).inicio;
export const entrada = "sigue";
export function dibuja(g, t) { escena(g, t); }
