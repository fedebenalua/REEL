// El cajero automático: llegó la máquina y la persona siguió en la ventanilla.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;
export const entrada = "corte";

const f = v.frase(7);
const Tmaq = f.t("maquina");
const Tven = f.t("ventanilla");
const Tcorte = v.frase(8).inicio;

function cliente(g, x, y, h) {
  g.save();
  g.translate(x, y);
  const u = h / 300;
  g.fillStyle = "#1e293b";
  k.redondo(g, -50 * u, -200 * u, 100 * u, 190 * u, 30 * u);
  g.fill();
  g.fillStyle = "#334155";
  g.beginPath();
  g.arc(0, -210 * u, 36 * u, 0, 6.2832);
  g.fill();
  g.fillStyle = "#0f172a";
  g.beginPath();
  g.arc(0, -220 * u, 28 * u, Math.PI, 0);
  g.fill();
  g.restore();
}

function cajera(g, x, y, h, giro) {
  g.save();
  g.translate(x, y);
  const u = h / 340;
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(0, 8, 40 * u, 12 * u, 0, 0, 6.2832);
  g.fill();
  k.redondo(g, -28 * u, -150 * u, 56 * u, 150 * u, 16 * u);
  const cam = g.createLinearGradient(-28 * u, 0, 28 * u, 0);
  cam.addColorStop(0, "#0f766e");
  cam.addColorStop(0.5, "#5eead4");
  cam.addColorStop(1, "#115e59");
  g.fillStyle = cam;
  g.fill();
  g.save();
  g.translate(k.mez(0, -26 * u, giro), -168 * u);
  g.rotate(k.mez(0, -0.28, giro));
  g.beginPath();
  g.ellipse(0, 0, 28 * u, 32 * u, 0, 0, 6.2832);
  const piel = g.createLinearGradient(-20 * u, -30 * u, 20 * u, 20 * u);
  piel.addColorStop(0, "#fdba74");
  piel.addColorStop(1, "#c2410c");
  g.fillStyle = piel;
  g.fill();
  g.fillStyle = "#1c1917";
  g.beginPath();
  g.arc(0, -8 * u, 26 * u, Math.PI * 1.05, Math.PI * 1.95);
  g.fill();
  g.restore();
  g.restore();
}

export function dibuja(g, t) {
  const tt = Math.min(t, Tcorte - 0.24);
  const sale = k.entra(k.tramo(tt, Tmaq - 0.2, Tmaq + 0.45));
  const gira = k.suave(k.tramo(tt, Tven - 0.35, Tven + 0.25));
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#071410");
  fondo.addColorStop(0.45, "#12352e");
  fondo.addColorStop(1, "#1c140c");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 960, 640, 320, "amarilla", 0.28);
  k.brillo(g, 250, 900, 240, "cian", 0.2);
  g.restore();

  // Lámpara de latón.
  g.strokeStyle = "#e7c27a";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(980, 500);
  g.lineTo(980, 700);
  g.stroke();
  g.fillStyle = "#f6e0a8";
  g.beginPath();
  g.moveTo(930, 700);
  g.lineTo(1030, 700);
  g.lineTo(1005, 770);
  g.lineTo(955, 770);
  g.fill();

  cajera(g, k.mez(800, 720, gira), 1560, 1320, gira);

  // Mostrador de madera.
  k.redondo(g, 40, 1240, 1000, 80, 16);
  const madera = g.createLinearGradient(80, 0, 1000, 0);
  madera.addColorStop(0, "#6b3e22");
  madera.addColorStop(0.5, "#c4844a");
  madera.addColorStop(1, "#5c341c");
  g.fillStyle = madera;
  g.fill();
  k.redondo(g, 40, 1310, 1000, 260, 8);
  g.fillStyle = "#3f2918";
  g.fill();

  // El cajero, a la izquierda.
  g.save();
  g.translate(250, 1040);
  k.redondo(g, -110, -260, 220, 420, 24);
  const met = g.createLinearGradient(-110, 0, 110, 0);
  met.addColorStop(0, "#1e293b");
  met.addColorStop(0.45, "#94a3b8");
  met.addColorStop(0.6, "#e2e8f0");
  met.addColorStop(1, "#334155");
  g.fillStyle = met;
  g.fill();
  k.redondo(g, -80, -210, 160, 120, 12);
  g.fillStyle = "#082f49";
  g.fill();
  g.fillStyle = "#67e8f9";
  g.font = "800 42px Figtree";
  g.textAlign = "center";
  g.fillText("••••", 0, -145);
  // El billete sale y se queda.
  const by = k.mez(-20, 36, sale);
  g.globalAlpha = sale;
  k.redondo(g, -46, by, 92, 42, 6);
  g.fillStyle = "#86efac";
  g.fill();
  g.fillStyle = "#14532d";
  g.font = "800 28px Figtree";
  g.fillText("€", 0, by + 30);
  g.restore();

  cliente(g, 600, 1760, 980);
  velo(g);
}
