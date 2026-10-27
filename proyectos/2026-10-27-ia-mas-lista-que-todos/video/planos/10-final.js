// «Así que hoy ninguna es más lista que todos juntos, y la pregunta sigue abierta.
// Envíaselo a ese amigo que ya se lo pregunta todo a la IA.»
// El mundo del hook otra vez. Corte en «Así».
// - «ninguna es más lista que todos juntos»: el cerebro de oro, enorme, sobre el mar de luces; el chip, más pequeño,
//   delante. En «juntos», el cerebro late.
// - «la pregunta sigue abierta»: la cámara se aleja despacio.
// - «Envíaselo a ese amigo»: una luz salta en arco desde el mar hasta otra luz lejos, que se enciende en «amigo».
// - «a la IA»: la cámara baja hasta el chip y acaba volando a ras de sus pistas, como en el primer fotograma.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, chip, CIELO, mar, MAR, velo } from "../mundo.js";
import { B, RB, angB, C } from "./01-hook.js";

const f9 = v.frase(9), f10 = v.frase(10);
export const desde = f9.inicio;

const { suave, tramo, mez } = k;
const T0 = f9.inicio, Tjun = f9.t("juntos"), Tabi = f9.t("abierta"), Tenv = f10.inicio, Tami = f10.t("amigo"), Tpre = f10.t("pregunta"), Tia = f10.t("ia");
const FIN = v.duracion;

const camara = k.ruta([
  [T0, { pos: [0, 40, 74], mira: [0, -2, -60] }],
  [Tabi + 0.4, { pos: [0, 54, 104], mira: [0, -4, -70] }],
  [Tami + 0.3, { pos: [0, 56, 108], mira: [0, -4, -70] }],
  [FIN - 0.35, { pos: [0.6, 0.45, 9.8], mira: [0.2, -0.15, 3] }],
  [FIN, { pos: [0.6, 0.45, 9.8], mira: [0.2, -0.15, 3] }],
]);

// las dos luces del cierre: una cerca, a la izquierda, y la del amigo, lejos a la derecha
const busca = (f) => MAR.reduce((m, s) => (f(s) < f(m) ? s : m), MAR[0]);
const DE = busca((s) => Math.hypot(s.p[0] + 70, s.p[2] - 0)), A = busca((s) => Math.hypot(s.p[0] - 120, s.p[2] + 330));

export function dibuja(g, t) {
  const cam = camara(t);
  k.fondo(g, cam);
  k.estrellas(g, cam, null, CIELO, 0.8);
  mar(g, cam, t);
  const late = k.pulso(t, Tjun + 0.15, 0.3);
  cerebro(g, cam, B, RB, angB(t), t, { al: 1 + 0.4 * late, nucleo: 1 + 1.5 * late });
  // el envío: una luz que sale de una casa y llega en arco a la del amigo
  const u = tramo(t, Tenv + 0.1, Tami);
  if (u > 0) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    const punto = (s) => { const q = Math.min(1, s); return [mez(DE.p[0], A.p[0], q), mez(DE.p[1], A.p[1], q) + Math.sin(Math.PI * q) * 90, mez(DE.p[2], A.p[2], q)]; };
    let prev = null;
    for (let i = 0; i <= 40; i++) {
      const s = (i / 40) * u, P = k.proyecta(cam, punto(s));
      if (P && prev) { g.strokeStyle = `rgba(255,220,150,${0.25 + 0.6 * (i / 40)})`; g.lineWidth = 3 + 5 * (i / 40); g.beginPath(); g.moveTo(prev.x, prev.y); g.lineTo(P.x, P.y); g.stroke(); }
      prev = P;
    }
    const cabeza = k.proyecta(cam, punto(u)), ini = k.proyecta(cam, DE.p);
    if (cabeza && u < 1) k.brillo(g, cabeza.x, cabeza.y, 160, "255,225,160", 1);
    if (ini) k.brillo(g, ini.x, ini.y, 200, "255,210,140", 0.8 * (1 - suave(tramo(t, Tami, Tpre))));
    const fin = k.proyecta(cam, A.p);
    if (fin) { k.brillo(g, fin.x, fin.y, 260, "255,220,150", k.pulso(t, Tami + 0.05, 0.3) + 0.5 * suave(tramo(t, Tami, Tami + 0.2)) * (1 - suave(tramo(t, Tpre, Tia)))); k.fogonazo(g, fin.x, fin.y, t - Tami, 240, "255,220,160"); }
    g.restore();
  }
  chip(g, cam, C, t);
  velo(g);
}
