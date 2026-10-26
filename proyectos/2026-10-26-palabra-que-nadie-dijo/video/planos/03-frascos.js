// Dos botes. El de la palabra que faltaba llega a 84. El de las de verdad, a 86.
import * as k from "#kit";
import { v } from "#voz";
import { ORO, bote, noche, velo } from "../mundo.js";

export const desde = "reconocerlas";

const f7 = v.frase(7);
const Toida = f7.t("oida"), Tigual = f7.t("igual");
const T84 = f7.t("cuatro"), T86 = f7.t("seis");
const corte = v.t("porque") - 0.04;
const quieto = (t) => 1 - k.suave(k.tramo(t, corte - 0.32, corte - 0.12));

export function dibuja(g, t) {
  const q = quieto(t);
  noche(g, 0.06);
  const mesa = g.createLinearGradient(0, 1100, 0, 1700);
  mesa.addColorStop(0, "#3a2418");
  mesa.addColorStop(1, "#1a0e0c");
  g.fillStyle = mesa;
  g.beginPath();
  g.moveTo(0, 1280);
  g.lineTo(1080, 1220);
  g.lineTo(1080, 1920);
  g.lineTo(0, 1920);
  g.fill();

  const sube = k.suave(k.tramo(t, Toida - 0.1, T84 + 0.15));
  const n84 = Math.round(k.mez(0, 84, k.suave(k.tramo(t, T84 - 0.45, T84 + 0.28))));
  const n86 = Math.round(k.mez(0, 86, k.suave(k.tramo(t, T86 - 0.55, T86 + 0.25))));
  const nivelL = 0.84 * k.mez(sube * 0.55, 1, k.suave(k.tramo(t, Tigual - 0.1, T84 + 0.2)));
  const nivelR = 0.86 * k.mez(sube * 0.5, 1, k.suave(k.tramo(t, Tigual, T86 + 0.22)));

  const llega = k.entra(k.tramo(t, f7.inicio - 0.05, f7.inicio + 0.65));
  const marea = Math.sin(t * 2.1) * 26 * q;
  g.save();
  g.translate(Math.sin(t * 1.5) * 18 * q, marea);
  bote(g, k.mez(40, 140, llega), k.mez(760, 560, llega), 330, 820, nivelL, ORO);
  bote(g, k.mez(710, 610, llega), k.mez(780, 548, llega), 330, 820, nivelR, "150,205,255");
  k.brillo(g, 540 + Math.sin(t * 2.4) * 280, 1040, 520, "255,210,150", 0.32);

  for (const [x0, nivel, color] of [[140, nivelL, ORO], [610, nivelR, "170,215,255"]]) {
    const top = 560 + 820 * (1 - nivel) * 0.78 + 60;
    for (let i = 0; i < 7; i++) {
      const y = top + 30 + ((t * 50 * q + i * 70) % Math.max(40, 820 - (top - 560)));
      if (y > 1320) continue;
      g.beginPath();
      g.arc(x0 + 70 + (i * 37) % 190, y, 7 + (i % 3) * 2, 0, 6.28);
      g.fillStyle = `rgba(${color},0.35)`;
      g.fill();
    }
  }

  g.restore();
  const a84 = k.suave(k.tramo(t, T84 - 0.15, T84 + 0.2));
  const a86 = k.suave(k.tramo(t, T86 - 0.2, T86 + 0.15));
  if (a84 > 0.02) k.pastilla(g, 305, 900, String(n84), "", ORO, a84, 108);
  if (a86 > 0.02) k.pastilla(g, 775, 900, String(n86), "", "186,225,255", a86, 108);

  k.etiqueta(g, 175, 1280, "la que faltaba", ORO, k.suave(k.tramo(t, Toida, Toida + 0.35)), 36);
  k.etiqueta(g, 655, 1280, "las de verdad", "186,225,255", k.suave(k.tramo(t, Tigual - 0.1, Tigual + 0.3)), 36);

  velo(g);
}
