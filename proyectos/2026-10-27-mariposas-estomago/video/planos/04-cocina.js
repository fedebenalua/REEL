// La cocina: el fuego se apaga porque llaman a la puerta.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = (voz) => voz.frase(5).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(5);
const Tapaga = f.t("apagaras");
const Tfuego = f.t("fuego");
const Tllama = f.t("llaman");
const Tpuerta = f.t("puerta");
const CX = 430, CY = 1120;

export function dibuja(g, t) {
  const llama = 1 - k.suave(k.tramo(t, Tapaga, Tpuerta - 0.05));
  const timbre = k.suave(k.tramo(t, Tllama - 0.04, Tllama + 0.25));
  const vapor = (1 - k.suave(k.tramo(t, Tfuego, f.fin - 0.22))) * (0.35 + 0.65 * llama);
  g.fillStyle = "#100c0a";
  g.fillRect(0, 0, 1080, 1920);
  const pared = g.createLinearGradient(0, 0, 0, 1400);
  pared.addColorStop(0, "#1c1418");
  pared.addColorStop(1, "#0a0808");
  g.fillStyle = pared;
  g.fillRect(0, 0, 1080, 1400);
  const encimera = g.createLinearGradient(0, 1320, 0, 1600);
  encimera.addColorStop(0, "#3a3430");
  encimera.addColorStop(1, "#161210");
  g.fillStyle = encimera;
  g.fillRect(0, 1360, 1080, 560);
  const br = g.createRadialGradient(CX, CY, 40, CX, CY, 700);
  br.addColorStop(0, `rgba(80,120,255,${0.28 * llama})`);
  br.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = br;
  g.fillRect(0, 0, 1080, 1920);

  if (llama > 0.04) k.anilloDeLlamas(g, CX, CY, 250, 78, t, 0, false, 26, 120 * llama);
  g.beginPath();
  g.ellipse(CX, CY, 230, 70, 0, 0, Math.PI * 2);
  k.metal(g, CX - 230, CX + 230, ["#2a2826", "#8d8680", "#3a3632", "#c8c2bb", "#2e2a28"]);
  g.beginPath();
  g.ellipse(CX, CY - 8, 150, 42, 0, 0, Math.PI * 2);
  g.fillStyle = "#12100e";
  g.fill();
  if (llama > 0.04) k.anilloDeLlamas(g, CX, CY, 250, 78, t, 0, true, 26, 120 * llama);

  g.save();
  g.translate(CX, CY - 210);
  g.beginPath();
  k.redondo(g, -150, -40, 300, 200, 28);
  k.metal(g, -150, 150, ["#4a4038", "#d9d3cc", "#6a6058", "#f4f1ec", "#3a342e"]);
  g.beginPath();
  g.ellipse(0, -20, 110, 28, 0, 0, Math.PI * 2);
  g.fillStyle = "#1a1410";
  g.fill();
  g.restore();

  if (vapor > 0.03) {
    g.save();
    g.globalAlpha = vapor;
    for (let i = 0; i < 5; i++) {
      const u = ((t * 0.35 + i / 5) % 1);
      k.brillo(g, CX + Math.sin(t * 2 + i) * 30, CY - 250 - u * 280, 70 + u * 40, "blanca", (1 - u) * 0.45);
    }
    g.restore();
  }

  g.fillStyle = "#3a241c";
  k.redondo(g, 780, 620, 230, 700, 16);
  g.fill();
  g.strokeStyle = "rgba(255,220,180,0.2)";
  g.lineWidth = 4;
  k.redondo(g, 800, 660, 190, 280, 10);
  g.stroke();
  const tx = 895, ty = 820;
  g.beginPath();
  g.arc(tx, ty, 70, 0, Math.PI * 2);
  k.metal(g, tx - 70, tx + 70, ["#6a5430", "#f0d090", "#a07838", "#fff1c4", "#5a4828"]);
  g.beginPath();
  g.arc(tx, ty, 36, 0, Math.PI * 2);
  g.fillStyle = `rgb(${k.mezRgb("90,70,40", "255,220,120", timbre)})`;
  g.fill();
  k.brillo(g, tx, ty, 200, "amarilla", 0.7 * timbre * (1 - k.suave(k.tramo(t, Tllama + 0.35, Tllama + 0.7))));
  const onda = k.tramo(t, Tllama, Tllama + 0.55);
  if (onda > 0 && onda < 1) {
    g.strokeStyle = `rgba(255,220,140,${(1 - onda) * 0.7})`;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(tx, ty, 80 + onda * 90, 0, Math.PI * 2);
    g.stroke();
  }
  velo(g, 0.5);
}
