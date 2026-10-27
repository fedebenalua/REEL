// «Y bajar un poco las ventanillas casi no cambia nada.»
// La ventanilla de atrás del coche, de cerca y desde fuera, con el interior al rojo. Se entra con un corte en «Y».
// - «bajar un poco»: el cristal baja una rendija y por ella se escapa un hilo de aire caliente.
// - «casi no cambia nada»: la cifra de dentro pasa de 47 a 46 y se queda.
import * as k from "#kit";
import { v } from "#voz";
import { aparcamiento, aPantalla, VENT_TRAS_C, velo } from "../mundo.js";

const f9 = v.frase(9);
export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez } = k;
const T0 = f9.inicio, Tbaj = f9.t("bajar"), Tpoco = f9.t("poco"), Tcasi = f9.t("casi"), Tnada = f9.t("nada");
const Fin = v.frase(10).inicio;
const cam = (t) => [2.7, VENT_TRAS_C[0] + 10, VENT_TRAS_C[1] + 60 - 10 * su(tr(t, T0, Fin))];

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  const baja = su(tr(t, Tbaj + 0.05, Tpoco + 0.55));
  const rendija = 24 * baja;
  aparcamiento(g, t, Z, cx, cy, 0, { calor: 1, brasa: 0.45, rendija });

  // el hilo de aire caliente que sale por la rendija
  if (baja > 0.05) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 5; i++) {
      const fase = (t * 0.7 + i * 0.2) % 1, x0 = -230 + i * 26, y0 = -388 + rendija * 0.5;
      const al = 0.5 * baja * Math.sin(Math.PI * fase);
      g.strokeStyle = `rgba(255,140,70,${al})`; g.lineWidth = 3;
      g.beginPath();
      for (let q = 0; q <= 12; q++) {
        const yy = y0 - fase * 40 - q * 6, xx = x0 + 6 * Math.sin(yy * 0.12 + t * 5 + i);
        const [X, Y] = aPantalla(Z, cx, cy, xx, yy);
        q ? g.lineTo(X, Y) : g.moveTo(X, Y);
      }
      g.stroke();
    }
    g.restore();
  }
  // la cifra de dentro: 47, y en «casi» baja a 46
  const u = su(tr(t, Tcasi, Tcasi + 0.35));
  const [wx, wy] = aPantalla(Z, cx, cy, VENT_TRAS_C[0] - 10, VENT_TRAS_C[1] + 25);
  k.pastilla(g, wx, wy, u > 0.5 ? "46" : "47", "°C", "255,90,60", 1, 150);
  k.etiqueta(g, wx - 108, wy + 112, "dentro", "255,120,60", 1, 46);
  velo(g, 0.4);
}
