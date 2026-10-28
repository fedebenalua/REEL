// Veinticuatro Pascuas en la cocina. Una queda dos días antes; dos años después, encaja.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, huevo, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio - 0.04;
export const entrada = "corte";

const f4 = v.frase(4);
const f5 = v.frase(5);
const T24 = f4.t("veinticuatro");
const Tmin = f4.t("minutos");
const Tuna = f5.t("una");
const Tantes = f5.t("antes");
const Tdes = f5.t("despues");
const Tning = f5.t("ninguna");

const COLORES = ["#e23b4a", "#ffd23a", "#2ec4b6", "#7aa2ff", "#e86adf", "#ff8a3d", "#7dce6a", "#f4f4f4"];
// ocho huevos grandes sobre el calendario, no una cuadrícula vacía
const PUESTOS = [
  [1, 0], [3, 0], [5, 0], [2, 1], [6, 1], [0, 2], [4, 2], [3, 3],
];

export function dibuja(g, t) {
  const llega = k.entra(k.tramo(t, f4.inicio, Tmin - 0.2));
  const cuenta = k.suave(k.tramo(t, T24, Tmin - 0.2));
  const n = Math.round(k.mez(1, 24, cuenta));
  const aSemana = k.suave(k.tramo(t, Tuna - 0.08, Tantes - 0.35));
  const mal = k.suave(k.tramo(t, Tantes - 0.15, Tantes + 0.28));
  const pasa = k.tramo(t, Tdes - 0.02, Tning - 0.12);
  const bien = k.suave(k.tramo(t, Tning - 0.06, Tning + 0.42));

  cocina(g);

  // el mes, con huevos que llegan
  g.save();
  g.globalAlpha = 1 - aSemana;
  g.fillStyle = "rgba(90,40,20,0.2)";
  k.redondo(g, 78, 588, 924, 760, 28); g.fill();
  g.fillStyle = "#fffaf3";
  k.redondo(g, 70, 575, 940, 760, 28); g.fill();
  g.fillStyle = "#e23b4a";
  g.fillRect(70, 575, 940, 64);
  const cw = 120, ch = 150, x0 = 110, y0 = 680;
  for (let d = 0; d < 7; d++) for (let r = 0; r < 4; r++) {
    g.strokeStyle = "rgba(180,140,110,0.35)"; g.lineWidth = 2;
    g.strokeRect(x0 + d * cw, y0 + r * ch, cw - 10, ch - 12);
  }
  for (let i = 0; i < PUESTOS.length; i++) {
    const u = k.suave(k.tramo(llega, i / 12, i / 12 + 0.16));
    const [d, r] = PUESTOS[i];
    const x = x0 + d * cw + 52;
    const yFin = y0 + r * ch + 70;
    const y = k.mez(-80, yFin, u);
    huevo(g, x, y, 86 * (0.4 + 0.6 * u), COLORES[i], 0);
  }
  g.restore();

  // una semana enorme: el huevo está dos días antes y luego entra en su sitio
  if (aSemana > 0.02) {
    g.save();
    g.globalAlpha = aSemana;
    g.fillStyle = "#fffaf3";
    k.redondo(g, 36, 640, 1008, 760, 30); g.fill();
    g.fillStyle = "#e23b4a";
    g.fillRect(36, 640, 1008, 78);
    const dias = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
    const dw = 138, x1 = 58, y1 = 760;
    for (let d = 0; d < 7; d++) {
      const x = x1 + d * dw;
      g.fillStyle = d === 4 ? "rgba(255,206,70,0.45)" : "rgba(255,255,255,0.01)";
      k.redondo(g, x, y1, 124, 560, 18); g.fill();
      g.strokeStyle = "rgba(190,150,120,0.4)"; g.lineWidth = 3;
      k.redondo(g, x, y1, 124, 560, 18); g.stroke();
      g.fillStyle = "#fff"; g.font = "800 32px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(dias[d], x + 62, 678);
    }
    const desdeX = x1 + 2 * dw + 62;
    const hastaX = x1 + 4 * dw + 62;
    const xh = k.mez(desdeX, hastaX, bien);
    huevo(g, xh, y1 + 280, 230, "#ffd23a", mal * (1 - bien));
    g.strokeStyle = `rgba(180,120,20,${0.45 + 0.55 * bien})`; g.lineWidth = 10;
    g.beginPath(); g.ellipse(hastaX, y1 + 280, 70, 120, 0, 0, Math.PI * 2); g.stroke();
    g.restore();
    if (pasa > 0.02 && pasa < 0.97 && bien < 0.15) {
      const px = k.mez(-260, 1280, k.suave(pasa));
      g.save();
      g.fillStyle = "rgba(255,248,236,0.72)";
      g.beginPath();
      g.moveTo(px, 660); g.quadraticCurveTo(px + 220, 1000, px - 30, 1380);
      g.lineTo(px - 280, 1340); g.quadraticCurveTo(px - 20, 980, px - 180, 660);
      g.fill();
      g.restore();
    }
  }

  const aN = k.suave(k.tramo(t, T24 - 0.05, T24 + 0.2)) * (1 - aSemana);
  if (aN > 0.02) k.pastilla(g, 540, 1240, String(n), "", "255,210,90", aN, 108);
  velo(g, 0.58);
}
