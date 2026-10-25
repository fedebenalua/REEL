// «Dos años por detrás no era un sello: era el aviso de otra enseñanza.»
// Un marco grande, dos marcas de oro con un hueco entre ellas. El sello se hace pedazos.
// La hoja azul se abre y se ve la clase, con luz.
import * as k from "#kit";
import { v } from "#voz";
import { sello, velo } from "../mundo.js";

export const desde = "dos";

const Tsello = v.t("sello");
const Taviso = v.t("aviso");
const Tense = v.t("ensenanza");

const AZ = k.azar(4);
const TROZOS = Array.from({ length: 10 }, () => ({ a: AZ() * 6.2832, d: 50 + AZ() * 140, r: 10 + AZ() * 14 }));

export function dibuja(g, t) {
  const h = g.createLinearGradient(0, 0, 1080, 1920);
  h.addColorStop(0, "#3a2418");
  h.addColorStop(1, "#1a100c");
  g.fillStyle = h;
  g.fillRect(0, 0, 1080, 1920);

  const abierta = k.suave(k.tramo(t, Taviso - 0.05, Tense + 0.2));
  // la clase, detrás
  g.save();
  g.beginPath();
  g.rect(200, 620, 680, 900);
  g.clip();
  const luz = g.createLinearGradient(0, 620, 0, 1520);
  luz.addColorStop(0, "#fff3c4");
  luz.addColorStop(1, "#f0a24a");
  g.fillStyle = luz;
  g.fillRect(200, 620, 680, 900);
  g.fillStyle = "#c46a32";
  g.fillRect(340, 1240, 400, 30);
  g.fillRect(380, 1270, 24, 160);
  g.fillRect(680, 1270, 24, 160);
  g.fillStyle = "#2f8a48";
  g.beginPath();
  g.ellipse(720, 1160, 80, 46, 0, 0, 6.3);
  g.fill();
  g.fillStyle = "#1f6b38";
  g.beginPath();
  g.ellipse(640, 1200, 60, 32, -0.4, 0, 6.3);
  g.fill();
  g.fillStyle = "#e7c07a";
  g.fillRect(700, 1160, 30, 90);
  g.restore();

  // hoja que se abre hacia la izquierda, dejando ver la clase
  const ancho = k.mez(680, 70, abierta);
  g.fillStyle = "#2f7f98";
  k.redondo(g, 200, 620, ancho, 900, 18);
  g.fill();
  if (ancho > 90) {
    g.fillStyle = "#f0c14d";
    g.beginPath();
    g.arc(200 + ancho - 50, 1080, 18, 0, 6.3);
    g.fill();
  }

  // marco
  g.fillStyle = "#8a5a32";
  g.fillRect(150, 560, 70, 1020);
  g.fillRect(860, 560, 70, 1020);
  g.fillRect(150, 540, 780, 80);
  g.fillRect(150, 1500, 780, 50);

  // dos marcas y el hueco que se recorre
  g.fillStyle = "#f0c14d";
  g.fillRect(210, 760, 120, 22);
  g.fillRect(210, 1180, 120, 22);
  const recorre = k.suave(k.tramo(t, v.t("anos"), v.t("detras") + 0.35));
  g.strokeStyle = "#ffe08a";
  g.lineWidth = 14;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(270, 1180);
  g.lineTo(270, k.mez(1180, 782, recorre));
  g.stroke();

  // el sello vuela a la marca de abajo y se rompe
  const u = k.entra(k.tramo(t, Tsello - 0.4, Tsello + 0.1));
  const rompe = k.suave(k.tramo(t, Tsello + 0.02, Tsello + 0.38));
  if (rompe < 0.92) {
    g.save();
    g.globalAlpha = 1 - rompe;
    g.translate(k.mez(980, 340, u), k.mez(700, 1190, u));
    sello(g, k.mez(130, 80, rompe), rompe);
    g.restore();
  }
  for (const p of TROZOS) {
    if (rompe < 0.15) continue;
    const d = rompe * p.d;
    g.beginPath();
    g.arc(340 + Math.cos(p.a) * d, 1190 + Math.sin(p.a) * d * 0.55, p.r * (1 - rompe * 0.3), 0, 6.3);
    g.fillStyle = "#d4252e";
    g.fill();
  }
  // las gotas acaban antes del corte
  if (abierta > 0.35) {
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, 540, 1100, 640 * abierta, "amarilla", 0.28 * abierta);
    g.restore();
  }
  velo(g, 0.7);
}
