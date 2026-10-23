// «Practicaron casi lo mismo.»
// Dos mazos, a la misma altura. El de la izquierda solo se mira. El de la derecha suelta una ficha.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, velo } from "../mundo.js";

export const desde = "practicaron";

export function dibuja(g, t) {
  const f = v.frase(8);
  const T0 = f.inicio, Tmis = f.t("mismo");
  const fin = v.frase(9).inicio - 0.04;
  cuarto(g, t, 0.9);
  mesa(g, 1200);

  const crece = k.suave(k.tramo(t, T0, Tmis + 0.05));
  const n = Math.round(k.mez(3, 7, crece));
  const quieto = t > Tmis;

  function pila(x, y, modo) {
    for (let i = 0; i < n; i++) {
      const yy = y + (n - i) * 18;
      carta(g, x, yy, 300, { icono: (i + (modo === "saca" ? 3 : 0)) % 10, giro: modo === "mira" ? -0.03 : 0.03, check: i < n - 1 ? 1 : 0 });
    }
    if (modo === "mira") {
      g.save();
      g.globalCompositeOperation = "lighter";
      const r = g.createRadialGradient(x, y + 20, 10, x, y + 20, 220);
      r.addColorStop(0, "rgba(255,210,140,0.45)");
      r.addColorStop(1, "rgba(255,180,80,0)");
      g.fillStyle = r;
      g.beginPath(); g.arc(x, y + 20, 220, 0, 6.28); g.fill();
      g.restore();
    } else {
      const alza = quieto ? 1 : crece;
      carta(g, x, y - 70 - alza * 90, 300, {
        icono: 4, giro: -0.08, check: 1, fuego: 0.4, brilloColor: "140,210,255", al: 0.4 + 0.6 * alza,
      });
    }
  }

  pila(300, 980, "mira");
  pila(760, 980, "saca");
  // fin se usa para no cruzar el corte con un movimiento nuevo
  if (t > fin) { /* el plano ya acabó */ }
  velo(g, 0.62);
}
