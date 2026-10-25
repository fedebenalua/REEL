// «Había una comisión. Binet entró por su cuenta, y nadie le pagó el test.»
// Mesa de roble, lámpara verde. La silla entra sola. El sobre de pago se cae cerrado.
import * as k from "#kit";
import { v } from "#voz";
import { sello, velo } from "../mundo.js";

export const desde = "habia";

const Tentro = v.t("entro");
const Tcuenta = v.t("cuenta");
const Tpago = v.t("pago");
const Tcorte = v.t("queria") - 0.05;

function fondo(g) {
  const h = g.createLinearGradient(0, 0, 0, 1920);
  h.addColorStop(0, "#10241c");
  h.addColorStop(0.5, "#1c3a2c");
  h.addColorStop(1, "#0c1612");
  g.fillStyle = h;
  g.fillRect(0, 0, 1080, 1920);
  // pared de madera
  g.fillStyle = "#5a3824";
  g.fillRect(0, 520, 1080, 980);
  const veta = g.createLinearGradient(0, 520, 1080, 1500);
  veta.addColorStop(0, "rgba(0,0,0,0.18)");
  veta.addColorStop(0.5, "rgba(255,210,150,0.05)");
  veta.addColorStop(1, "rgba(0,0,0,0.22)");
  g.fillStyle = veta;
  g.fillRect(0, 520, 1080, 980);
}

function lampara(g, x, y, s) {
  g.fillStyle = "#c9a06a";
  g.fillRect(x - 8, y, 16, s * 0.8);
  g.beginPath();
  g.moveTo(x - s * 0.55, y);
  g.quadraticCurveTo(x, y - s * 0.15, x + s * 0.55, y);
  g.quadraticCurveTo(x, y + s * 0.55, x - s * 0.55, y);
  const c = g.createLinearGradient(x, y - 20, x, y + s * 0.4);
  c.addColorStop(0, "#b8f0c8");
  c.addColorStop(1, "#1f8a4a");
  g.fillStyle = c;
  g.fill();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, x, y + s * 0.35, s * 1.4, "blanca", 0.45);
  g.globalCompositeOperation = "source-over";
}

function silla(g, x, y, s) {
  // respaldo alto, tapizado claro, para que se vea entrar
  g.fillStyle = "#2a1a10";
  g.fillRect(x - s * 0.42, y, s * 0.12, s * 0.85);
  g.fillRect(x + s * 0.3, y, s * 0.12, s * 0.85);
  k.redondo(g, x - s * 0.5, y - s * 1.35, s, s * 1.25, 30);
  g.fillStyle = "#f4e0b0";
  g.fill();
  g.strokeStyle = "#6b3d28";
  g.lineWidth = 10;
  g.stroke();
  k.redondo(g, x - s * 0.55, y - s * 0.18, s * 1.1, s * 0.28, 16);
  g.fillStyle = "#e8c888";
  g.fill();
}

function sobre(g, x, y, s, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  k.redondo(g, -s * 0.7, -s * 0.45, s * 1.4, s * 0.9, 10);
  g.fillStyle = "#f3e6c8";
  g.fill();
  g.beginPath();
  g.moveTo(-s * 0.7, -s * 0.45);
  g.lineTo(0, s * 0.05);
  g.lineTo(s * 0.7, -s * 0.45);
  g.strokeStyle = "#c4b08a";
  g.lineWidth = 4;
  g.stroke();
  g.translate(0, 8);
  sello(g, s * 0.22, 0.2);
  g.restore();
}

export function dibuja(g, t) {
  fondo(g);
  const t0 = v.t("habia") - 0.04;
  const empuje = k.suave(k.tramo(t, t0, Tcorte));
  g.save();
  g.translate(540, 980);
  g.scale(k.mez(1.02, 1.22, empuje), k.mez(1.02, 1.22, empuje));
  g.translate(-540, -980);
  // mesa en perspectiva
  g.beginPath();
  g.moveTo(80, 1280);
  g.lineTo(1000, 1280);
  g.lineTo(860, 860);
  g.lineTo(220, 860);
  g.closePath();
  const mesa = g.createLinearGradient(0, 860, 0, 1280);
  mesa.addColorStop(0, "#a86a3c");
  mesa.addColorStop(1, "#5a3218");
  g.fillStyle = mesa;
  g.fill();
  lampara(g, 540, 760, 180);
  const uS = k.entra(k.tramo(t, 8.15, Tcuenta));
  const xS = k.mez(1200, 620, uS);
  silla(g, xS, 1080, 280);
  // tarjeta con el nombre, cuando la silla llega
  const alN = k.suave(k.tramo(t, Tcuenta - 0.1, Tcuenta + 0.35));
  if (alN > 0.02) {
    g.globalAlpha = alN;
    k.etiqueta(g, 640, 990, "BINET", "243,199,90", 1, 42);
    g.globalAlpha = 1;
  }
  const uE = k.tramo(t, Tpago - 0.45, Tpago + 0.55);
  const cae = k.suave(uE);
  const xE = k.mez(430, 250, cae);
  const yE = k.mez(980, 1500, k.sale(k.tramo(t, Tpago + 0.05, Tpago + 0.7)));
  const ang = cae * 0.8;
  if (t < Tcorte - 0.05) sobre(g, xE, Math.min(yE, 1460), 150, ang);
  g.restore();
  velo(g, 0.7);
}
