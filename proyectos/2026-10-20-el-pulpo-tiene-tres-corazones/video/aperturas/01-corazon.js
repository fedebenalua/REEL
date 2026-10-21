// La otra apertura del hook: desde el fotograma 0, pegada al corazón del medio del pulpo, que late azul y llena la
// pantalla; en «pulpo» la cámara sale disparada hacia atrás y se ve el pulpo entero, transparente; en «tres corazones»
// se encienden los otros dos. Luego, lo mismo que planos/01-mar.js.
import { escena } from "../mar.js";

export const desde = 0;
export const dibuja = (g, t) => escena(g, t, "corazon");
