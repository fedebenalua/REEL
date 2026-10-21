// «Tres: ventila solo unos minutos… Nunca a la vez.»
import * as k from "#kit";
import { v } from "#voz";
import {
  vista, camino2D, pared, suelo, radiador, ventanaNoche, velo, vineta, colCalor,
} from "../mundo.js";

const { suave: su, tramo: tr, azar } = k;
const F = v.frase(5);
export const desde = "Tres";
export const entrada = "corte";

const cam = camino2D([
  [F.inicio, [1.0, -120, 0]],
  [F.t("ventila"), [1.15, -80, -20]],
  [F.t("cierra"), [1.2, -40, 0]],
  [F.t("enciende"), [1.25, 80, 20]],
  [F.t("nunca"), [1.3, 40, 0]],
  [F.fin, [1.2, 20, 0]],
]);

export function dibuja(g, t) {
  pared(g, "180,200,255");
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  suelo(g);

  const abierta = su(tr(t, F.t("ventila") - 0.1, F.t("ventila") + 0.35))
    * (1 - su(tr(t, F.t("cierra") - 0.05, F.t("cierra") + 0.45)));
  const enciende = su(tr(t, F.t("enciende") - 0.1, F.t("enciende") + 0.5));
  const nunca = su(tr(t, F.t("nunca") - 0.05, F.t("nunca") + 0.4));

  // ventana a la izquierda
  g.save(); g.translate(-220, -80); g.scale(0.85, 0.85);
  // día frío / abierto
  ventanaNoche(g, t, {
    w: 400, h: 480,
    persiana: 0,
    cortina: 0,
    calorSale: 0,
  });
  // override cristal a día si ventila
  if (abierta > 0.05) {
    const w = 400, h = 480;
    k.redondo(g, -w / 2, -h / 2, w, h, 8);
    const cielo = g.createLinearGradient(0, -h / 2, 0, h / 2);
    cielo.addColorStop(0, "#7ec8ff"); cielo.addColorStop(1, "#c8e8ff");
    g.fillStyle = cielo; g.globalAlpha = abierta; g.fill();
    g.globalAlpha = 1;
    // viento: partículas
    const r = azar(33);
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 20; i++) {
      const p = (t * 1.5 + r() * 3) % 1;
      const x = -w / 2 + p * w;
      const y = -h / 2 + 40 + r() * (h - 80);
      g.fillStyle = `rgba(200,230,255,${0.5 * abierta * (1 - Math.abs(p - 0.5) * 2)})`;
      g.fillRect(x, y, 40 * abierta, 3);
    }
    g.restore();
  }
  g.restore();

  // radiador a la derecha — apagado mientras ventila, luego enciende
  g.save(); g.translate(200, 120); g.scale(0.7, 0.7);
  const calor = enciende * 0.9 * (1 - abierta) * (1 - nunca * 0.5);
  radiador(g, t, { calor, bloqueado: nunca * 0.4, w: 480, h: 260 });
  // «nunca a la vez»: flash rojo si ambos
  if (nunca > 0.1) {
    const col = colCalor(1);
    g.save(); g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,60,40,${0.5 * nunca})`; g.lineWidth = 14;
    g.beginPath(); g.moveTo(-300, -200); g.lineTo(300, 200);
    g.moveTo(300, -200); g.lineTo(-300, 200); g.stroke();
    g.restore();
  }
  g.restore();

  velo(g, 0.45);
  vineta(g, 0.4);
}
