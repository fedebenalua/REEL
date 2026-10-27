// La adrenalina cae, la digestión se apaga y la sangre se va a los brazos.
import * as k from "#kit";
import { v } from "#voz";
import { saco, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(4).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(4);
const Tadr = f.t("adrenalina");
const Tdig = f.t("digestion");
const Tsangre = f.t("sangre");
const Tmus = f.t("musculos");
const az = k.azar(18);
const GOTAS = Array.from({ length: 16 }, (_, i) => ({
  x: 400 + az() * 280,
  nace: Tadr - 0.05 + (i / 16) * 0.7,
  v: 700 + az() * 500,
}));
const CHORROS = [
  { lado: -1, p: 0.1, y0: 1000 },
  { lado: -1, p: 0.55, y0: 1080 },
  { lado: 1, p: 0.2, y0: 1000 },
  { lado: 1, p: 0.7, y0: 1080 },
];

function curva(lado, u, y0) {
  const x0 = 540, x1 = lado < 0 ? 180 : 900, y1 = 1000;
  const cx = (x0 + x1) / 2, cy = y0 - 180;
  const a = 1 - u;
  return { x: a * a * x0 + 2 * a * u * cx + u * u * x1, y: a * a * y0 + 2 * a * u * cy + u * u * y1 };
}

export function dibuja(g, t) {
  const digest = 1 - k.suave(k.tramo(t, Tdig, Tdig + 0.7));
  const sangre = k.suave(k.tramo(t, f.t("darle"), Tmus));
  const calma = k.suave(k.tramo(t, f.fin - 0.35, f.fin - 0.05));
  g.fillStyle = "#1a0c10";
  g.fillRect(0, 0, 1080, 1920);
  const fondo = g.createRadialGradient(540, 1000, 60, 540, 1000, 900);
  fondo.addColorStop(0, "#5a3040");
  fondo.addColorStop(1, "#14080c");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);

  g.beginPath();
  g.moveTo(160, 560);
  g.quadraticCurveTo(540, 470, 920, 560);
  g.bezierCurveTo(1040, 900, 980, 1280, 760, 1460);
  g.quadraticCurveTo(540, 1560, 320, 1460);
  g.bezierCurveTo(100, 1280, 40, 900, 160, 560);
  const piel = g.createLinearGradient(200, 500, 880, 1500);
  piel.addColorStop(0, "#f0b89a");
  piel.addColorStop(0.5, "#d48468");
  piel.addColorStop(1, "#7a4038");
  g.fillStyle = piel;
  g.fill();
  const musc = 1 + 0.18 * sangre;
  for (const lado of [-1, 1]) {
    const cx = lado < 0 ? 150 : 930;
    g.save();
    g.translate(cx, 980);
    g.scale(musc, musc);
    const mg = g.createRadialGradient(-20, -40, 10, 0, 0, 160);
    mg.addColorStop(0, "#ffb0a0");
    mg.addColorStop(0.5, "#c44848");
    mg.addColorStop(1, "#6a2030");
    g.fillStyle = mg;
    g.beginPath();
    g.ellipse(0, 20, 150, 230, lado * -0.2, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  saco(g, 540, 1080, 250, 210, t, 0.25 + 0.4 * (1 - digest));

  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 8; i++) {
    const a = t * 1.4 + i;
    const x = 540 + Math.cos(a) * 70;
    const y = 1080 + Math.sin(a * 1.3) * 50;
    k.brillo(g, x, y, 50, "verde", 0.55 * digest);
  }
  g.restore();

  for (const gota of GOTAS) {
    const u = t - gota.nace;
    if (u < 0 || u > 0.55) continue;
    const y = 560 + gota.v * u + 900 * u * u;
    if (y > 1040) {
      k.brillo(g, gota.x, 1000, 80, "sodio", Math.max(0, 1 - (y - 1040) / 80));
      continue;
    }
    k.brillo(g, gota.x, y, 36, "sodio", 0.9);
  }

  const flujo = sangre * (1 - calma);
  if (flujo > 0.02) {
    for (const lado of [-1, 1]) {
      g.strokeStyle = `rgba(170,18,28,${0.95 * flujo})`;
      g.lineWidth = 54;
      g.lineCap = "round";
      g.beginPath();
      for (let i = 0; i <= 16; i++) {
        const p = curva(lado, (i / 16) * flujo, 1040);
        if (i === 0) g.moveTo(p.x, p.y);
        else g.lineTo(p.x, p.y);
      }
      g.stroke();
      g.strokeStyle = `rgba(255,190,170,${0.75 * flujo})`;
      g.lineWidth = 14;
      g.stroke();
      if (calma < 0.85) {
        const p = curva(lado, Math.min(flujo, (0.35 + 0.4 * Math.sin(t * 3 + lado)) % 1), 1040);
        k.brillo(g, p.x, p.y, 70, "roja", 0.55 * (1 - calma));
      }
    }
  }
  velo(g, 0.55);
}
