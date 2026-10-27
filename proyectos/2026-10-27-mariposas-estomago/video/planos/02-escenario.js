// El escenario: la misma ola, justo antes de hablar en público.
import * as k from "#kit";
import { v } from "#voz";
import { saco, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(3).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(3);
const Tsalta = f.t("salta");
const Tpub = f.t("publico");
const az = k.azar(44);
const MOTAS = Array.from({ length: 28 }, () => ({ x: 280 + az() * 520, z: az(), p: az() }));

export function dibuja(g, t) {
  const entra = k.entra(k.tramo(t, desde(v), desde(v) + 0.7));
  const tripa = k.suave(k.tramo(t, Tsalta - 0.05, Tsalta + 0.35)) * (1 - 0.45 * k.suave(k.tramo(t, f.fin - 0.28, f.fin)));
  g.fillStyle = "#07060c";
  g.fillRect(0, 0, 1080, 1920);
  const sala = g.createRadialGradient(540, 700, 40, 540, 900, 1100);
  sala.addColorStop(0, "#2a1840");
  sala.addColorStop(1, "#05040a");
  g.fillStyle = sala;
  g.fillRect(0, 0, 1080, 1920);

  g.fillStyle = "#4a1020";
  g.beginPath();
  g.moveTo(0, 480);
  g.lineTo(150, 500);
  g.quadraticCurveTo(80, 1100, 0, 1500);
  g.fill();
  g.beginPath();
  g.moveTo(1080, 480);
  g.lineTo(930, 500);
  g.quadraticCurveTo(1000, 1100, 1080, 1500);
  g.fill();
  for (const lado of [-1, 1]) {
    g.strokeStyle = "rgba(255,180,160,0.18)";
    g.lineWidth = 8;
    for (let i = 0; i < 4; i++) {
      const x = lado < 0 ? 30 + i * 28 : 1050 - i * 28;
      g.beginPath();
      g.moveTo(x, 500);
      g.quadraticCurveTo(x + lado * 20, 900, x, 1480);
      g.stroke();
    }
  }

  g.save();
  g.globalCompositeOperation = "lighter";
  const foco = g.createLinearGradient(540, 360, 540, 1500);
  foco.addColorStop(0, "rgba(255,214,160,0)");
  foco.addColorStop(0.15, `rgba(255,214,160,${0.18 + 0.2 * entra})`);
  foco.addColorStop(1, "rgba(255,180,120,0)");
  g.fillStyle = foco;
  g.beginPath();
  g.moveTo(470, 360);
  g.lineTo(610, 360);
  g.lineTo(860, 1560);
  g.lineTo(220, 1560);
  g.closePath();
  g.fill();
  const polvo = 1 - k.suave(k.tramo(t, f.fin - 0.35, f.fin - 0.08));
  for (const m of MOTAS) {
    const y = 520 + ((m.p + t * 0.15) % 1) * 900;
    k.brillo(g, m.x + 20 * Math.sin(t + m.p * 6), y, 16, "amarilla", 0.35 * polvo * entra);
  }
  g.restore();

  const suelo = g.createLinearGradient(0, 1280, 0, 1600);
  suelo.addColorStop(0, "#1a120c");
  suelo.addColorStop(1, "#07060a");
  g.fillStyle = suelo;
  g.fillRect(0, 1320, 1080, 600);

  saco(g, 520, 1180, 340, 280, t, 0.2 + tripa);
  k.brillo(g, 520, 1120, 520, "roja", 0.55 * tripa);
  const mx = 800;
  g.save();
  g.translate(0, k.mez(80, 0, entra));
  g.fillStyle = "#3a322c";
  g.fillRect(mx - 7, 980, 14, 460);
  g.beginPath();
  g.ellipse(mx, 900, 78, 120, 0.1, 0, Math.PI * 2);
  k.metal(g, mx - 78, mx + 78);
  g.strokeStyle = "rgba(255,255,255,0.4)";
  g.lineWidth = 4;
  g.stroke();
  g.restore();
  velo(g, 0.62);
}
