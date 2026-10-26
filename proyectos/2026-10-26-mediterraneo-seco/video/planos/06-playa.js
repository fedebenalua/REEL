// «Envíaselo a ese amigo que se baña ahí cada verano.»
// Otro sitio: la orilla, con dos toallas. La cámara se aleja hasta la cuenca llena.
import * as k from "#kit";
import { v } from "#voz";
import { velo, cielo, sol, mar } from "../mundo.js";

export const desde = "enviaselo";

const f = v.frase(10);
const Tverano = f.t("verano");

export function dibuja(g, t) {
  const lejos = k.entra(k.tramo(t, f.inicio + 0.15, Tverano + 0.2));
  const zoom = k.mez(1, 0.34, lejos);

  // el mar ancho, debajo: al alejarse se descubre
  cielo(g, 0.12);
  sol(g, 760, 430, 100, 0.55 + 0.45 * lejos);
  g.beginPath();
  g.moveTo(-30, k.mez(620, 700, lejos));
  g.quadraticCurveTo(540, k.mez(480, 540, lejos), 1110, k.mez(660, 760, lejos));
  g.lineTo(1110, 1960);
  g.lineTo(-30, 1960);
  g.closePath();
  const costa = g.createLinearGradient(0, 500, 0, 900);
  costa.addColorStop(0, "#e7b07a");
  costa.addColorStop(1, "#c46a42");
  g.fillStyle = costa;
  g.fill();
  mar(g, k.mez(700, 820, lejos), 1200, t, 1);
  k.brillo(g, 520, k.mez(980, 1100, lejos), 480, "blanca", 0.16 + 0.1 * lejos);

  // la playa, grande al empezar, y se aleja con la cámara
  g.save();
  g.translate(540, k.mez(1180, 980, lejos));
  g.scale(zoom, zoom);
  g.translate(-540, -1180);
  g.fillStyle = "#f6e3b8";
  g.fillRect(0, 1080, 1080, 900);
  // orilla mojada
  g.fillStyle = "#e7c98a";
  g.fillRect(0, 1040, 1080, 80);
  toalla(g, 300, 1280, "#2f7cf6", "#f4f7fb");
  toalla(g, 680, 1340, "#e85d4c", "#f2c14e");
  g.fillStyle = "#e8b45c";
  g.beginPath();
  g.ellipse(760, 1240, 70, 18, 0.2, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(760, 1218, 32, 20, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();

  velo(g, 0.58);
}

function toalla(g, x, y, a, b) {
  g.save();
  g.translate(x, y);
  g.rotate(-0.08);
  g.shadowColor = "rgba(0,0,0,0.25)";
  g.shadowBlur = 18;
  g.shadowOffsetY = 10;
  for (let i = 0; i < 9; i++) {
    g.fillStyle = i % 2 ? a : b;
    g.fillRect(-110, -160 + i * 40, 220, 40);
  }
  g.restore();
}
