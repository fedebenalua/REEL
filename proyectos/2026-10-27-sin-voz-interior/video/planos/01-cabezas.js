// «¿Por qué algunas personas no tienen voz interior cuando piensan?» «Tú lees esta frase y la oyes por dentro.»
// «Ellas no oyen nada.»
// - Fotograma 0: dentro de la cabeza de oro, el remolino de palabras enormes; la cámara sale deprisa hacia atrás y se
//   ve la cabeza entera, con sus ondas de oro.
// - «no tienen voz»: la cámara se desliza a la derecha y llega la cabeza azul, en silencio; «piensan»: se enciende.
// - «esta frase»: las palabras entran por el ojo de la de oro y en «oyes» revientan en ondas.
// - «Ellas»: la cámara pasa a la azul; las mismas palabras entran y en «nada» se deshacen en polvo azul.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, CRANEO, OJO, ORO, cabeza, camara, fondo, frena, ondas, palabra, polvo, remolino, silencio, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra, claves } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tno = f1.t("no"), Tvoz = f1.t("voz"), Tpie = f1.t("piensan");
const Tlees = f2.t("lees"), Testa = f2.t("esta"), Toyes = f2.t("oyes"), Tdentro = f2.t("dentro");
const Tellas = f3.inicio, Toyen = f3.t("oyen"), Tnada = f3.t("nada"), Tfin = v.frase(4).inicio;

export const B = 1000; // la cabeza azul, a la derecha de la de oro

// la cámara: dentro del remolino → la cabeza de oro entera → las dos → la azul → la de oro → la azul
const camX = claves([[0, CRANEO.x], [0.95, 40], [Tno - 0.05, 40], [Tvoz + 0.3, 520], [Tpie + 0.1, 980], [Tlees - 0.15, 980], [Testa + 0.05, 70], [Tellas - 0.1, 70], [Tellas + 0.55, 1020]]);
const camY = claves([[0, CRANEO.y], [0.95, 40], [Tno - 0.05, 40], [Tvoz + 0.3, 20], [Tpie + 0.1, 0], [Tlees - 0.15, 0], [Testa + 0.05, -10], [Tellas - 0.1, -10], [Tellas + 0.55, -20]]);
const camZ = claves([[0, 4.2], [0.95, 1.08], [Tno - 0.05, 1.04], [Tvoz + 0.3, 0.62], [Tpie + 0.1, 1.02], [Tlees - 0.15, 1.02], [Testa + 0.05, 1.06], [Tellas - 0.1, 1.08], [Tellas + 0.55, 1.12], [Tfin, 1.16]]);

// las palabras «esta frase» que vuelan hasta el ojo: de fuera (derecha, arriba) al ojo, entre a y b.
function vuelan(g, x0, y0, a, b, t, col, al = 1) {
  const u = su(tr(t, a, b));
  if (u <= 0 || u >= 1 || al <= 0.01) return;
  const x = mez(x0 + 900, x0 + OJO.x + 30, u), y = mez(y0 - 260, y0 + OJO.y, u) - Math.sin(Math.PI * u) * 120;
  palabra(g, "esta frase", x, y, mez(120, 26, entra(u)), al * Math.min(1, (1 - u) * 6), col);
}

export function dibuja(g, t) {
  const cx = camX(t), cy = camY(t), z = camZ(t);
  fondo(g, t, { dx: cx * 0.6, dy: cy * 0.3 });
  g.save(); camara(g, cx, cy, z);
  // la cabeza de oro: su remolino gira deprisa al principio y se calma
  const gira = 2.2 * t - 1.1 * Math.min(t, 1.6) * Math.min(t, 1.6) / 1.6 * 0.5;
  const oyes = su(tr(t, Toyes - 0.12, Toyes + 0.25)) * (1 - su(tr(t, Tdentro + 0.2, Tellas + 0.4)));
  cabeza(g, 0, 0, 1, t, { tono: "oro", luz: mez(0.45, 1, su(tr(t, 0.3, 1.0))) + 0.5 * oyes, dentro: (c) => {
    remolino(c, gira, { escala: 1 });
    ondas(c, t, CRANEO.x, CRANEO.y, 60, 330, { periodo: 0.75, al: 0.45 + 0.7 * oyes, ancho: 7 });
    // «oyes»: la frase que entró suena dentro, grande
    if (oyes > 0.01) palabra(c, "esta frase", CRANEO.x + 20, CRANEO.y + 40, mez(40, 92, oyes), oyes, ORO);
  } });
  // la cabeza azul: en silencio; en «piensan» se enciende su luz (sin palabras)
  const piensa = su(tr(t, Tpie - 0.2, Tpie + 0.5));
  const nada = su(tr(t, Tnada - 0.25, Tnada + 0.2));
  cabeza(g, B, 0, 1, t, { tono: "azul", luz: 0.55 + 0.45 * piensa, dentro: (c) => { silencio(c, t, 0.4 + 0.6 * piensa); } });
  // «esta frase» entra por el ojo de la de oro, y luego por el de la azul
  vuelan(g, 0, 0, Testa - 0.3, Toyes - 0.05, t, ORO);
  vuelan(g, B, 0, Tellas + 0.05, Tnada - 0.2, t, "200,230,255");
  // «nada»: se deshace en polvo azul dentro de la azul, sin ondas
  polvo(g, B + CRANEO.x + 60, CRANEO.y + 40, tr(t, Tnada - 0.22, Tnada + 0.75), 200, AZUL);
  if (nada > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, B + CRANEO.x, CRANEO.y, 700, AZUL, 0.25 * nada * (1 - su(tr(t, Tnada + 0.3, Tfin - 0.2)))); g.restore(); }
  g.restore();
  vineta(g, 0.5);
  velo(g, mez(0.55, 0.35, su(tr(t, 0.5, 1.2))));
}
