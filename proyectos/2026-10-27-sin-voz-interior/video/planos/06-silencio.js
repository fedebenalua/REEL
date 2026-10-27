// «Así que no es que no piensen: es que piensan en silencio.»
// «Síguenos, o envíaselo a ese amigo que no se calla ni por dentro.»
// - Las dos cabezas otra vez. «no es que no piensen»: dentro de la azul empiezan a girar cuadros y formas de colores;
//   «piensan»: la cámara va a ella, viva y llena; «silencio»: todo late suave, sin una onda.
// - «Síguenos»: la cámara vuelve a la de oro; «no se calla»: su remolino se acelera y sus ondas crecen; «ni por
//   dentro»: la cámara entra en ella hasta el remolino del primer fotograma.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, CRANEO, ORO, ROSA, VERDE, cabeza, camara, cuadro, fondo, forma, ondas, remolino, silencio, velo, vineta } from "../mundo.js";
import { B } from "./01-cabezas.js";

export const desde = (v) => v.frase(14).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, claves } = k;
const f14 = v.frase(14), f15 = v.frase(15);
const T0 = f14.inicio, Tno = f14.t("no"), Tpie = f14.t("piensen"), Tpie2 = f14.t("piensan"), Tsil = f14.t("silencio");
const Tsig = f15.inicio, Tami = f15.t("amigo"), Tcal = f15.t("calla"), Tni = f15.t("ni"), Tden = f15.t("dentro");
const Tvoz = v.fin ? v.fin("dentro") : Tden + 0.5;

const camX = claves([[T0, 500], [Tpie2 - 0.3, 500], [Tsil + 0.1, B + 30], [Tsig - 0.15, B + 30], [Tsig + 0.85, 40], [Tni - 0.1, 40], [Tden + 0.7, CRANEO.x]]);
const camY = claves([[T0, 20], [Tpie2 - 0.3, 20], [Tsil + 0.1, -10], [Tsig - 0.15, -10], [Tsig + 0.85, 40], [Tni - 0.1, 40], [Tden + 0.7, CRANEO.y]]);
const camZ = claves([[T0, 0.62], [Tpie2 - 0.3, 0.64], [Tsil + 0.1, 1.1], [Tsig - 0.15, 1.12], [Tsig + 0.85, 1.06], [Tni - 0.1, 1.1], [Tden + 0.7, 4.2]]);

// lo que gira dentro de la azul: tres cuadros y cuatro formas, cada uno en su carril
const COSAS = [
  { c: "mar", a: 0.0, h: -0.75 }, { f: 0, col: ROSA, a: 2.1, h: -0.55 }, { c: "montana", a: 4.2, h: -0.25 },
  { f: 1, col: ORO, a: 1.0, h: 0.0 }, { c: "casa", a: 3.1, h: 0.3 }, { f: 3, col: VERDE, a: 5.2, h: 0.55 }, { f: 2, col: "190,130,255", a: 0.5, h: 0.8 },
];
function pensamientos(c, t, al) {
  if (al <= 0.01) return;
  const orden = COSAS.map((o) => { const a = o.a + t * 0.7; return { o, a, z: Math.sin(a) }; }).sort((p, q) => p.z - q.z);
  for (const { o, a, z } of orden) {
    const prof = (z + 1) / 2, s = (0.6 + 0.4 * prof) * mez(0.3, 1, al);
    const x = CRANEO.x + Math.cos(a) * 200 * Math.sqrt(1 - o.h * o.h * 0.6), y = CRANEO.y + o.h * 165;
    const aa = al * (0.4 + 0.6 * prof);
    if (o.c) cuadro(c, o.c, x, y, 150 * s, 106 * s, t, { al: aa, ang: Math.sin(a) * 0.1 });
    else forma(c, o.f, x, y, 34 * s, t + o.a, o.col, aa);
  }
}

export function dibuja(g, t) {
  const cx = camX(t), cy = camY(t), z = camZ(t);
  fondo(g, t, { dx: cx * 0.6, dy: cy * 0.3 });
  g.save(); camara(g, cx, cy, z);
  // la de oro: su remolino se acelera con «amigo que no se calla»
  const corre = su(tr(t, Tami - 0.2, Tcal + 0.3));
  const gira = 0.9 * t + 2.2 * Math.max(0, t - (Tami - 0.2)) * corre;
  cabeza(g, 0, 0, 1, t, { tono: "oro", luz: (1 + 0.4 * corre) * mez(1, 0.4, su(tr(t, Tni, Tden + 0.6))), dentro: (c) => {
    remolino(c, gira, {});
    ondas(c, t, CRANEO.x, CRANEO.y, 60, 330 + 120 * corre, { periodo: mez(0.75, 0.45, corre), al: 0.45 + 0.5 * corre, ancho: 7 });
  } });
  // la azul: empieza a pensar en «no piensen» y late suave en «silencio»
  const piensa = su(tr(t, Tno - 0.1, Tpie + 0.5));
  const late = 0.85 + 0.15 * Math.sin((t - Tsil) * 4) * su(tr(t, Tsil - 0.2, Tsil + 0.3));
  cabeza(g, B, 0, 1, t, { tono: "azul", luz: (0.55 + 0.45 * piensa) * late, dentro: (c) => {
    silencio(c, t, 0.6 + 0.4 * piensa);
    pensamientos(c, t, piensa);
  } });
  g.restore();
  vineta(g, 0.5);
  velo(g, mez(0.4, 0.55, su(tr(t, Tni, Tden + 0.6))));
}
