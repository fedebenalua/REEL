// «¿Por qué el cielo es azul? La luz del Sol es blanca y el aire no tiene color. Entonces, ¿de dónde sale ese azul?»
// Un solo sitio, una sola cámara (el hook, de 0 a 7,6 s):
// - Fotograma 0: la cámara sube disparada por el cielo azul, entre nubes que caen a toda velocidad, con el Sol blanco
//   detrás; en «azul» el cielo se ha apagado del todo: negro, estrellas, y la Tierra abajo con una capa fina azul.
// - «La luz del Sol es blanca»: un haz blanco baja del Sol hasta la capa de aire; «el aire no tiene color»: el azul de
//   la capa se vacía hasta quedar transparente, y el haz sigue blanco.
// - «Entonces, ¿de dónde sale ese azul?»: la cámara se lanza hacia abajo, atraviesa la capa y el cielo vuelve a ser azul.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, cielo, estrellasQuietas, nube, rayoDeLuz, sol, tierraConAire } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, azar, entra, pulso } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tblanca = f2.t("blanca"), Tazul1 = f1.t("azul"), Tluz = f2.t("luz"), Taire = f2.t("aire"), Tcolor = f2.t("color"), Tazul3 = f3.t("azul");
const T_BAJA = f3.inicio + 0.2, T_FIN = f3.fin - 0.35;

// de 0 (en el cielo) a 1 (en el espacio)
const alto = (t) => 1 - Math.pow(1 - tr(t, 0, 2.0), 2.2) - su(tr(t, T_BAJA, T_FIN));
const aire = (t) => (t < T_BAJA ? 1 - su(tr(t, Taire - 0.05, Tcolor + 0.05)) : su(tr(t, T_BAJA + 0.5, Tazul3 + 0.1)));

// las nubes: cada una con su profundidad (las cercanas caen más deprisa)
const az = azar(808);
const SOL = [800, 700];
const NUBES = [];
while (NUBES.length < 8) {
  const n = { i: NUBES.length, x: 60 + az() * 960, y: 560 + az() * 1150, w: 260 + az() * 260, d: 0.55 + az() * 0.9 };
  if (Math.hypot(n.x - SOL[0], n.y - SOL[1]) > 330 || n.i % 3 === 2) NUBES.push(n);
}
const LINEAS = Array.from({ length: 46 }, () => ({ x: az() * 1080, y: az() * 1920, l: 0.5 + az(), a: 0.25 + az() * 0.5 }));

export function dibuja(g, t) {
  pinta(g, t, alto(t), Math.abs(alto(t) - alto(t - 1 / 60)) * 60, alto(t) - alto(t - 1 / 60));
}

// Todo el hook con la altura `a` dada (0 en el cielo, 1 en el espacio), su velocidad v1 y su sentido: para que la otra
// apertura pueda pintar el cielo y el espacio por separado.
export function pinta(g, t, a, v1, sentido, sinSol = false) {
  const sp = su(tr(a, 0.3, 0.85));

  // el cielo, o el espacio
  g.fillStyle = "#02040a"; g.fillRect(0, 0, 1080, 1920);
  cielo(g, sp);
  estrellasQuietas(g, su(tr(sp, 0.55, 1)));

  // la Tierra con su capa de aire, que sube desde abajo
  const R = Math.exp(mez(Math.log(7000), Math.log(640), a)), top = mez(2250, 1150, a), cy = top + R;
  const lx = SOL[0] - 540, ly = SOL[1] - cy;
  if (top < 1950) {
    g.save();
    tierraConAire(g, 540, cy, R, aire(t), 0.1 + 0.03 * t, lx, ly);
    g.restore();
  }

  // las nubes que caen mientras sube, y vuelven a subir cuando baja
  for (const n of NUBES) {
    const y = n.y + 2500 * n.d * a, al = 1 - su(tr(sp, 0.3, 0.75));
    if (y > -300 && y < 2200) nube(g, n.i, n.x, y, n.w * (0.8 + 0.4 * n.d), al);
  }
  // el Sol: blanco, grande; más grande en el espacio (delante de las nubes: las ilumina)
  sol(g, SOL[0], SOL[1], mez(78, 135, sp) * (1 + 0.1 * pulso(t, Tblanca + 0.1, 0.18)), 1);
  k.brillo(g, SOL[0], SOL[1], 900, "255,255,255", 0.5 * pulso(t, Tblanca + 0.1, 0.18));

  // las rayas de velocidad
  if (v1 > 0.15) {
    g.save(); g.lineCap = "round";
    for (const l of LINEAS) {
      const dir = sentido > 0 ? 1 : -1, y = (((l.y + 2400 * l.l * a * 0.9) % 2100) + 2100) % 2100 - 100;
      const len = Math.min(520, 120 + 360 * v1 * l.l);
      g.strokeStyle = `rgba(255,255,255,${Math.min(0.55, l.a * v1) * (1 - 0.6 * sp)})`; g.lineWidth = 3 + 3 * l.l;
      g.beginPath(); g.moveTo(l.x, y); g.lineTo(l.x, y - dir * len); g.stroke();
    }
    g.restore();
  }

  // el haz de luz blanca que baja del Sol hasta la capa de aire
  const luz = su(tr(t, Tluz - 0.05, Tluz + 0.35)) * (1 - su(tr(t, T_BAJA + 0.2, T_BAJA + 0.8)));
  if (luz > 0.01) {
    const dx = 540 + 20 - SOL[0], dy = top - 20 - SOL[1];
    rayoDeLuz(g, SOL[0] - dx * 0.1, SOL[1] - dy * 0.1, 560, top + 120, t, luz, 54);
    k.brillo(g, 560, top + 120, 380, "255,255,255", 0.75 * luz);
  }

  // el destello del azul: cuando se dice, y cuando vuelve
  k.brillo(g, 540, top + 40, 1500, AZUL, 0.55 * pulso(t, Tazul1 + 0.05, 0.12));
  k.brillo(g, 540, 900, 1700, AZUL, 0.35 * pulso(t, Tazul3 + 0.05, 0.14));

  // un velo oscuro suave detrás del subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 640);
  vg.addColorStop(0, `rgba(4,10,30,${0.5 * (1 - sp * 0.4)})`); vg.addColorStop(1, "rgba(4,10,30,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 660);
}

export { SOL, alto, aire };
export const momentos = { azul1: Tazul1, luz: Tluz, vacia: Tcolor, baja: T_BAJA, azul3: Tazul3 };
