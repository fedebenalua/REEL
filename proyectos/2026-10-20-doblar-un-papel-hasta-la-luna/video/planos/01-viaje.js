// «Si doblas un folio por la mitad 42 veces, llega a la Luna. ¿Cómo llega tan lejos algo tan fino?»
// La columna de papel ya doblada 42 veces, de pie en la calle, y la cámara subiendo pegada a ella.
// - Fotograma 0: pegados a la columna, a ras de la calle; la cámara ya sube deprisa y sus capas pasan hacia abajo.
// - «doblas un folio»: deja abajo los edificios; «mitad»: el rascacielos y las nubes; «42 veces»: el cielo se vuelve
//   negro y la Tierra se curva y se hace una bola debajo.
// - «llega a la Luna»: la Luna llega enorme junto a la columna, que sigue hacia arriba, y la cámara frena.
// - «¿Cómo llega tan lejos»: se lanza hacia abajo por la columna: la Tierra crece, las nubes, la ciudad;
//   «algo tan fino»: frena pegada al pie de la columna, donde se ven sus capas, finísimas. Se queda ahí hasta el corte.
import * as k from "#kit";
import { v } from "#voz";
import { mundo, alto, anchoColumna, viaje, bajada, DL } from "../mundo.js";

export const desde = 0;

const Tluna = v.frase(1).t("luna"), f2 = v.frase(2), Tcomo = f2.t("como"), Tfino = f2.t("fino");
export const H = alto(42);
const ANTES = 1.4;

// la cámara: [t, altura en el centro de la pantalla, alto que se ve] (en metros)
const cam = viaje([
  [0, 7, 22],
  [0.5, 70, 150],
  [1.0, 1400, 2600],
  [1.5, 4e4, 8e4],
  [2.05, 2.5e6, 6e6],
  [2.5, 4e7, 1.5e8],
  [2.9, 2.9e8, 2.0e8],
  [Tluna + 0.05, DL, 1.15e7],
  [Tcomo, DL * 0.99, 1.25e7],
  ...bajada(Tcomo, Tfino),
]);
// la columna se corre a la izquierda para que quepa la Luna
const XT = (t) => k.mez(540, 330, k.suave(k.tramo(t, 2.9, Tluna))) + (540 - 330) * k.suave(k.tramo(t, Tcomo + 0.2, Tcomo + 1.0));
export const camara = cam;

export function dibuja(g, t) {
  const c = cam(t);
  mundo(g, t, c, XT(t), H, anchoColumna(c));
}
