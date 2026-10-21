// «¿Sabías que el pulpo tiene tres corazones y la sangre azul? Y uno de ellos se para cada vez que nada. ...»
// Fotograma 0: la cámara cae a toda velocidad por el agua, entre burbujas que suben, hacia el pulpo; llega enorme en
// «pulpo», abriendo los ocho brazos. Todo lo demás, hasta el corte en «Nuestra», en ../mar.js.
// La otra apertura (aperturas/01-corazon.js) empieza pegada al corazón que late.
import { escena } from "../mar.js";

export const desde = 0;
export const dibuja = (g, t) => escena(g, t, "bajada");
