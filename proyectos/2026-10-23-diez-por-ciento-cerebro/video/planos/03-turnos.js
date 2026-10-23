// La respuesta: cada parte trabaja y se turnan. No hay un noventa por ciento parado.
import * as k from "#kit";
import { v } from "#voz";
import { cerebroSolido, fondoNoche, velo } from "../mundo.js";

export const desde = (vv) => vv.frase(8).t("no") - 0.04;
export const entrada = "corte";

const { suave: su, tramo: tr, mezV, pulso } = k;
const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const Tno = f8.t("no"), Tparado = f8.t("parado"), Ttrabaja = f8.t("trabaja"), Tturnan = f8.t("turnan");
const Tseg = f9.t("segundo"), Tusando = f10.t("usando"), Tcabeza = f11.t("cabeza");
const Fin = v.duracion;
const ORDEN = ["habla", "mano", "nombre", "vista"];

const CLAVES = [
  [Tno - 0.04, { pos: [0.85, 0.45, 1.85], mira: [0.05, -0.05, 0] }],
  [Tparado, { pos: [0.1, 0.32, 2.2], mira: [0, -0.08, 0] }],
  [Tturnan, { pos: [-0.45, 0.22, 2.05], mira: [-0.05, -0.04, 0] }],
  [Tseg - 0.4, { pos: [-0.55, 0.15, 1.85], mira: [-0.1, 0, 0] }],
  [Tseg + 0.35, { pos: [0.4, 0.2, 2.05], mira: [0.08, -0.04, 0] }],
  [Tusando, { pos: [0.1, 0.38, 2.4], mira: [0, -0.06, 0] }],
  [38.3, { pos: [0.35, 0.28, 2.15], mira: [0.06, -0.02, 0] }],
  [Tcabeza, { pos: [-0.15, 0.5, 2.85], mira: [0, -0.1, 0] }],
  [Fin - 0.28, { pos: [-0.08, 0.46, 2.75], mira: [0, -0.08, 0] }],
];

function camDe(t) {
  let i = 0;
  while (i < CLAVES.length - 2 && t >= CLAVES[i + 1][0]) i++;
  const [t0, a] = CLAVES[i];
  const [t1, b] = CLAVES[i + 1];
  let u = t >= t1 ? 1 : tr(t, t0, t1);
  u = i === 0 ? 1 - Math.pow(1 - u, 0.45) : su(u);
  return k.mira(mezV(a.pos, b.pos, u), mezV(a.mira, b.mira, u));
}

function zonas(t) {
  const z = { habla: 0.35, mano: 0.35, nombre: 0.35, vista: 0.35 };
  const u = tr(t, Ttrabaja - 0.15, Tusando - 0.2);
  if (u > 0 && u < 1) {
    const i = Math.min(ORDEN.length - 1, Math.floor(u * ORDEN.length));
    z[ORDEN[i]] = 1;
  } else if (t >= Tusando - 0.2) {
    z.habla = 0.9;
    z.mano = 0.7;
    z.nombre = 0.7;
    z.vista = 0.7;
  }
  const barrido = su(tr(t, Tno, Tparado + 0.2));
  for (const nombre of ORDEN) z[nombre] = Math.max(z[nombre], barrido * 0.55);
  return z;
}

export function dibuja(g, t) {
  fondoNoche(g, 0.9);
  const cam = camDe(t);
  cerebroSolido(g, cam, { oro: 0.15, vivo: 1, zonas: zonas(t), golpe: 0 });
  const subeTodas = tr(t, f9.inicio, Tseg);
  if (subeTodas > 0 && subeTodas < 1) {
    const x = k.mez(280, 800, subeTodas);
    k.brillo(g, x, 980, 520, "255,236,200", 0.62 * Math.sin(subeTodas * Math.PI));
  }
  k.brillo(g, 540, 1080, 640, "255,210,160", 0.4 * pulso(t, Tusando, 0.16));
  velo(g, 0.48);
  void Tcabeza;
}
