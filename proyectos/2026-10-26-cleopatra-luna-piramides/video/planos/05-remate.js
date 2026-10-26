// «Así que, para Cleopatra, la pirámide era más antigua de lo que hoy es Cleopatra para ti.»
// «Envíaselo a ese amigo que cree que Cleopatra vio construir las pirámides.»
// El camino del tiempo otra vez, de noche. Se entra con un corte en «Así».
// - «la pirámide era más antigua»: la llave dorada (pirámide → Cleopatra), «2.500 años», que late en «antigua».
// - «de lo que hoy es Cleopatra para ti»: la llave azul hasta hoy, «2.050 años», más corta; «hoy», junto a la Luna.
// - «para ti»: una copia del tramo dorado sube y se pone al lado del azul: lo pasa (la parte que sobra se enciende).
// - «Envíaselo...»: la cámara se lanza hacia la moneda hasta que llena la pantalla, girando como en el fotograma 0, y
//   las chispas vuelven a subir por la cinta.
import * as k from "#kit";
import { v } from "#voz";
import { YCLEO, Y0, Y1, aPantalla } from "../mundo.js";
import { escena, llaves } from "../camino.js";

export const desde = "asi";

const { suave: su, tramo: tr } = k;
const f9 = v.frase(9), f10 = v.frase(10);
const Tpir = f9.t("piramide"), Tant = f9.t("antigua"), Thoy = f9.t("hoy"), Tti = f9.t("ti"), Fin9 = f9.fin;
const Tenv = f10.inicio, Tcle = f10.t("cleopatra"), Tcon = f10.t("construir");

const CY = k.claves([[0, 990], [Fin9 + 0.1, 990], [Tcle - 0.1, YCLEO + 40]]);
const Z = k.claves([[0, 0.9], [Fin9 + 0.1, 0.9], [Tcle - 0.1, 5.6]]);
const camara = (t) => ({ cx: 540, cy: CY(t), z: Z(t) });

export function dibuja(g, t) {
  const c = camara(t);
  const late = k.pulso(t, Tant + 0.15, 0.3);
  escena(g, t, c, {
    alOro: 0.8 + 0.7 * late, alAzul: 0.8 + 0.5 * k.pulso(t, Thoy + 0.2, 0.3),
    luzLuna: 0.5 * k.pulso(t, Thoy + 0.2, 0.35), luzPir: 0.6 * late,
    giro: 2 * Math.PI * su(tr(t, f9.t("cleopatra") - 0.1, f9.t("cleopatra") + 0.6)) + 2 * Math.PI * su(tr(t, f9.t("cleopatra", 2) - 0.1, f9.t("cleopatra", 2) + 0.6)) + 2 * Math.PI * su(tr(t, Tenv + 0.2, Tcon + 0.4)), luzMoneda: 0.4 * su(tr(t, Tenv, Tcle)),
    flujo: su(tr(t, Tenv + 0.3, Tcle)),
    pulso: t > Tpir - 0.1 && t < Tant + 0.3 ? { ya: Y0, yb: YCLEO, u: su(tr(t, Tpir - 0.05, Tant)), color: "255,200,110" }
      : t > Thoy - 0.1 && t < Tti + 0.2 ? { ya: YCLEO, yb: Y1, u: su(tr(t, Thoy - 0.05, Tti)), color: "150,200,255" } : null,
  });
  const fuera = 1 - su(tr(t, Tenv, Tenv + 0.4));
  // la copia del tramo dorado, que sube junto al azul y lo pasa
  const sube = su(tr(t, Thoy + 0.25, Tti + 0.2)), aC = su(tr(t, Thoy + 0.1, Thoy + 0.35)) * fuera;
  if (aC > 0.01) {
    const L = Y0 - YCLEO, ya = Y0 + (YCLEO - Y0) * sube, A = aPantalla(c, 600, ya), B = aPantalla(c, 600, ya - L);
    const sobra = su(tr(t, Tti + 0.1, Tti + 0.4)), Ym = aPantalla(c, 600, Y1);
    g.save(); g.globalAlpha = aC; g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (const [w, a] of [[30, 0.15], [14, 0.35], [7, 1]]) { g.strokeStyle = `rgba(255,200,110,${a})`; g.lineWidth = w; g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.stroke(); }
    if (sobra > 0) {
      for (const [w, a] of [[46, 0.25], [18, 0.6]]) { g.strokeStyle = `rgba(255,235,170,${a * sobra})`; g.lineWidth = w; g.beginPath(); g.moveTo(B.x, Ym.y); g.lineTo(B.x, B.y); g.stroke(); }
      k.brillo(g, B.x, B.y, 140, "255,220,140", 0.9 * sobra);
    }
    g.restore();
  }
  llaves(g, c, {
    oro: su(tr(t, Tpir - 0.1, Tpir + 0.25)) * fuera, azul: su(tr(t, Thoy - 0.1, Thoy + 0.25)) * fuera,
    textoAzul: "2.050 años", latOro: late, hoy: su(tr(t, Thoy, Thoy + 0.3)) * fuera,
  });
}
