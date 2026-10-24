// «The first TV remote turned the channel knob from the sofa.»
// Un solo salón: el dial, el motor, el cable y el sofá. La cámara entra al dial y viaja con la voz.
import { camaraVieja, escenaVieja } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  escenaVieja(g, t, camaraVieja(t));
}
