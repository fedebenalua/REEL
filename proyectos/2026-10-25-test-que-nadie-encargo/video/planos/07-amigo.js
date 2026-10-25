// «Envíaselo a ese amigo que cree que un test dice lo que vales.»
// El avión de la tarjeta cruza hasta un amigo de espaldas. La medalla se le cae.
import * as k from "#kit";
import { v } from "#voz";
import { medalla, velo } from "../mundo.js";

export const desde = "enviaselo";

const Tvales = v.t("vales");

function cielo(g) {
  const h = g.createLinearGradient(0, 0, 0, 1920);
  h.addColorStop(0, "#2a1860");
  h.addColorStop(0.45, "#e07a3a");
  h.addColorStop(1, "#f2c56a");
  g.fillStyle = h;
  g.fillRect(0, 0, 1080, 1920);
  // tejados
  g.fillStyle = "#3a2458";
  g.beginPath();
  g.moveTo(0, 1500);
  g.lineTo(180, 1320);
  g.lineTo(360, 1500);
  g.fill();
  g.fillStyle = "#4a2c6a";
  g.beginPath();
  g.moveTo(300, 1560);
  g.lineTo(560, 1280);
  g.lineTo(820, 1560);
  g.fill();
  g.fillRect(0, 1500, 1080, 420);
}

function amigo(g, x, y, s) {
  // de espaldas
  g.fillStyle = "#1f4d6e";
  k.redondo(g, x - s * 0.4, y - s * 0.1, s * 0.8, s * 0.95, s * 0.2);
  g.fill();
  g.beginPath();
  g.arc(x, y - s * 0.45, s * 0.28, 0, 6.3);
  g.fillStyle = "#f0c2a0";
  g.fill();
  g.fillStyle = "#3a2418";
  g.beginPath();
  g.arc(x, y - s * 0.55, s * 0.28, Math.PI, 6.2832);
  g.fill();
}

function avion(g, x, y, s, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.fillStyle = "#fff6e4";
  g.beginPath();
  g.moveTo(s, 0);
  g.lineTo(-s * 0.8, s * 0.35);
  g.lineTo(-s * 0.3, 0);
  g.lineTo(-s * 0.8, -s * 0.35);
  g.closePath();
  g.fill();
  g.strokeStyle = "#1c1a24";
  g.lineWidth = 6;
  g.strokeRect(-s * 0.15, -s * 0.16, s * 0.32, s * 0.32);
  g.restore();
}

export function dibuja(g, t) {
  const t0 = v.t("enviaselo") - 0.04;
  const vuelo = 1 - Math.exp(-Math.max(0, t - t0) * 1.5);
  cielo(g);
  const xA = k.mez(-80, 680, k.entra(k.tramo(t, t0, Tvales - 0.05)));
  const yA = k.mez(720, 1000, k.suave(k.tramo(t, t0, Tvales - 0.1))) + Math.sin((t - t0) * 6) * 28 * (1 - k.tramo(t, Tvales - 0.3, Tvales));
  avion(g, xA, yA, 280, -0.35 + (xA / 1080) * 0.4);
  const xF = 760, yF = 1040;
  amigo(g, xF, yF, 340);
  // la medalla en el pecho, y se cae en «vales»
  const cae = k.sale(k.tramo(t, Tvales - 0.12, Tvales + 0.55));
  const xM = k.mez(xF, xF - 40, cae);
  const yM = k.mez(yF + 30, 1480, cae);
  const r = k.mez(86, 64, cae);
  medalla(g, xM, yM, r, 1);
  if (cae > 0.15) {
    g.strokeStyle = "rgba(240,193,77,0.5)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(xF, yF + 20);
    g.lineTo(xM, yM - r);
    g.stroke();
  }
  velo(g, 0.62);
}
