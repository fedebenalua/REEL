// «¿Por qué tu perro inclina la cabeza cuando le hablas?»
// Salón. Del fotograma 0 a «juguete»: la cara ya ladeada y el dueño que cruza sin llevarse el ladeo.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2);
const Tcabeza = f1.t("cabeza");
const Thablas = f1.t("hablas");
const Testabas = f2.t("estabas");
const Tjuguete = v.frase(3).t("juguete");

export function escena(g, t, modo = "viaje") {
  const base = m.poseCero(Math.min(t, 1.45));
  const z = t < 1.45
    ? (modo === "oreja" ? k.claves([[-0.35, 4.15], [0.15, 3.1], [0.7, base.z], [1.45, 1.05]])(t) : base.z)
    : k.claves([[1.45, 1.05], [Testabas - 0.3, 1.02], [Testabas + 0.85, 0.88], [Tjuguete - 0.18, 0.96]])(t);
  const fx = t < 1.45
    ? (modo === "oreja" ? k.claves([[-0.3, 780], [0.55, 640], [1.45, base.fx]])(t) : base.fx)
    : k.claves([[1.45, 530], [Testabas, 430], [Tjuguete, 500]])(t);
  const fy = t < 1.45 ? base.fy : k.claves([[1.45, 1100], [Testabas, 1120], [Tjuguete - 0.2, 1080]])(t);

  const cam = { z, fx, fy };
  m.conCam(g, cam, () => m.salon(g, t, 0));

  const xP = k.claves([
    [0, 1400],
    [1.2, 1180],
    [Thablas, 980],
    [Thablas + 0.9, 720],
    [Testabas - 0.15, 640],
    [Testabas + 1.0, 110],
    [Tjuguete, 130],
  ])(t);
  const habla = k.suave(k.tramo(t, Thablas - 0.2, Thablas + 0.35)) * (1 - k.suave(k.tramo(t, Testabas - 0.15, Testabas + 0.35)));
  m.conCam(g, cam, () => {
    m.persona(g, xP, 1520, 1.38, { t, habla, jersey: "#ff4d32", jersey2: "#ffb199", senala: habla });
  });

  const quieto = k.suave(k.tramo(t, Tcabeza - 0.12, Tcabeza + 0.08)) * (1 - k.suave(k.tramo(t, Tcabeza + 0.55, Tcabeza + 0.9)));
  const ladeo = m.LADEO + Math.sin(t * 2.2) * 0.04 * (1 - quieto);
  const mira = k.claves([
    [0, 0],
    [Thablas, 0.4],
    [Testabas - 0.2, 0.2],
    [Testabas + 0.9, -1],
    [Tjuguete, -0.7],
  ])(t);

  m.conCam(g, cam, () => {
    m.perro(g, 540, 1160, 1.52, { t, ladeo, oreja: 0.22, miraX: mira * 9, alerta: 0.45 + habla * 0.45, sem: 0.6 });
  });

  const rush = modo === "oreja"
    ? 1 - k.suave(k.tramo(t, 0.05, 0.7))
    : 1 - k.suave(k.tramo(t, 0.02, 0.85));
  m.rafagas(g, rush);
  m.velo(g, 0.74);
}

export function dibuja(g, t) {
  escena(g, t, "viaje");
}
