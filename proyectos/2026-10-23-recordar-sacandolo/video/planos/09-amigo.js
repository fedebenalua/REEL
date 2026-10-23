// «Envíaselo a ese amigo que en cuanto le sale una, la da por sabida.»
// La ficha del barco vuelve hacia la cámara, con el tic, hasta quedar como al empezar.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, velo } from "../mundo.js";

export const desde = "enviaselo";

const az = k.azar(19);
const OTRAS = Array.from({ length: 8 }, (_, i) => ({
  x: (i % 2 === 0 ? -1 : 1) * (0.2 + (i % 3) * 0.2),
  y: -0.05 + (i % 2 ? 0.2 : -0.16),
  z: 5.2 + i * 1.35,
  icono: (i + 2) % 10,
  giro: (az() - 0.5) * 0.3,
}));

export function dibuja(g, t) {
  const f = v.frase(12);
  const T0 = f.inicio, Tsab = f.t("sabida");
  cuarto(g, t, 1);
  mesa(g, 1300);

  // la cámara se lanza hacia la ficha y acaba en el mismo sitio que el fotograma 0
  const zcam = k.claves([[T0, -1.2], [Tsab, 2.6], [v.duracion, 2.85]]);
  const cam = k.mira([0, 0.05, zcam(t)], [0, -0.12, zcam(t) + 14]);

  const cosas = [];
  const P0 = k.proyecta(cam, [0, -0.05, 4.05]);
  if (P0) {
    cosas.push({
      z: P0.z,
      dibuja() {
        carta(g, P0.x, P0.y, k.tamano(0.82, P0.z), {
          icono: 0,
          check: 1,
          fuego: 0.4,
          brilloColor: "90,255,160",
        });
      },
    });
  }
  const llegan = k.suave(k.tramo(t, Tsab - 0.4, v.duracion - 0.15));
  for (const c of OTRAS) {
    const P = k.proyecta(cam, [c.x, c.y, c.z]);
    if (!P) continue;
    cosas.push({
      z: P.z,
      dibuja() {
        carta(g, P.x, P.y, k.tamano(0.7, P.z), {
          icono: c.icono, giro: c.giro, check: 1, al: 0.25 + 0.75 * llegan,
        });
      },
    });
  }
  k.deLejosACerca(cosas);
  velo(g, 0.75);
}
