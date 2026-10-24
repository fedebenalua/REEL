// El gancho: la ventanilla llena la pantalla y la cámara se mete hacia el agujero.
import { ventana } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  ventana(g, t, "cielo");
}
