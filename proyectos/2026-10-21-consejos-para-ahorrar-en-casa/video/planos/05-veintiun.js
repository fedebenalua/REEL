// «Con ropa adecuada, veintiún grados… dejar de calentar la calle.»
import * as k from "#kit";
import { v } from "#voz";
import {
  vista, camino2D, pared, termostato, jersey, velo, vineta, colCalor,
} from "../mundo.js";

const { suave: su, tramo: tr } = k;
const F6 = v.frase(6);
const F7 = v.frase(7);
export const desde = "Con";
export const entrada = "corte";

const cam = camino2D([
  [F6.inicio, [1.05, 0, 40]],
  [F6.t("veintiun"), [1.35, 0, 0]],
  [F6.t("siete"), [1.4, 0, -10]],
  [F7.inicio, [1.15, 0, 20]],
  [F7.t("calle"), [1.0, 0, 80]],
  [F7.fin, [0.95, 0, 100]],
]);

export function dibuja(g, t) {
  pared(g, "255,160,90");
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);

  const baja = su(tr(t, F6.t("veintiun") - 0.2, F6.t("veintiun") + 0.5));
  const grados = 22 - baja;
  const calor = 0.85 - baja * 0.4;
  const siete = su(tr(t, F6.t("siete") - 0.1, F6.t("siete") + 0.5));
  const calle = su(tr(t, F7.t("calle") - 0.15, F7.t("calle") + 0.5));

  termostato(g, t, {
    grados,
    calor: calor + 0.05 * Math.sin(t * 3),
    boton: baja * (1 - siete * 0.5),
    TR: 300,
  });

  // jersey entra y se mueve
  const j = su(tr(t, F6.t("ropa") - 0.1, F6.t("ropa") + 0.45));
  const jy = 80 + Math.sin(t * 2.5) * 12 * j;
  jersey(g, -280, jy, 0.85, j * (1 - calle * 0.8));
  if (j > 0.2 && siete < 0.8) {
    k.brillo(g, -280, jy - 40, 100, "255,180,100", 0.25 * j);
  }

  // -7 %
  if (siete > 0.05) {
    g.save();
    g.font = "800 120px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(80,220,120,0.9)"; g.shadowBlur = 40;
    g.fillStyle = `rgba(120,255,160,${siete})`;
    g.fillText("-7 %", 0, 340);
    g.restore();
  }

  // calentar la calle: ondas que se cortan
  if (t >= F7.inicio - 0.05) {
    const col = colCalor(0.9);
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const ph = t * 2 + i;
      const corte = calle;
      g.strokeStyle = `rgba(${col},${0.4 * (1 - corte * 0.85)})`;
      g.lineWidth = 10;
      g.beginPath();
      g.moveTo(-200 + i * 50, 200);
      g.bezierCurveTo(-180 + i * 50, 400, -160 + i * 50, 550, -140 + i * 50, 700 + (1 - corte) * 200);
      g.stroke();
      if (corte > 0.3) {
        g.strokeStyle = `rgba(100,180,255,${0.5 * corte})`;
        g.beginPath();
        g.moveTo(-220 + i * 55, 620);
        g.lineTo(-100 + i * 55, 620);
        g.stroke();
      }
    }
    g.restore();
  }

  velo(g, 0.5);
  vineta(g, 0.4);
}
