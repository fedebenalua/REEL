// Bicarbonato, dos tazas de agua caliente del grifo, y nada de hervor.
import * as k from "#kit";
import { v } from "#voz";
import { camara, mano, olla, quieto, rutaCam, taza, vapor, velo, viñeta } from "../mundo.js";

export const desde = "stir";
const fin = v.t("turkey") - 0.04;
const f9 = v.frase(9);

export function dibuja(g, t) {
  const tq = quieto(t, fin);
  const polvo = k.suave(k.tramo(tq, f9.t("stir"), f9.t("soda") + 0.2));
  const segunda = k.suave(k.tramo(tq, f9.t("two") - 0.08, f9.t("cups") + 0.15));
  const agua = k.suave(k.tramo(tq, f9.t("hot"), f9.t("water") + 0.35));
  const fuera = k.suave(k.tramo(tq, f9.t("not"), f9.t("boiling") + 0.15));
  const cam = rutaCam(tq, [
    [f9.t("stir"), { x: -160, y: 20, s: 1.35 }],
    [f9.t("two"), { x: 20, y: 30, s: 1.12 }],
    [f9.t("hot"), { x: 0, y: 10, s: 1.18 }],
    [fin - 0.22, { x: -10, y: 20, s: 1.2 }],
  ]);
  const pared = g.createLinearGradient(0, 0, 0, 1920);
  pared.addColorStop(0, "#3a2418");
  pared.addColorStop(0.45, "#8a4b28");
  pared.addColorStop(1, "#2a160e");
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = pared;
  g.fillRect(0, 0, 1080, 1920);
  camara(g, cam);
  g.fillStyle = "#6b3a22";
  g.fillRect(-900, 220, 1800, 80);
  const enc = g.createLinearGradient(-800, 180, 800, 320);
  enc.addColorStop(0, "#e7b56a");
  enc.addColorStop(1, "#c4843a");
  g.fillStyle = enc;
  g.fillRect(-900, 250, 1800, 700);
  taza(g, -200, 10, 1.7, 0.2 + agua * 0.65, polvo);
  taza(g, k.mez(520, 210, segunda), 24, 1.55, agua * 0.7, 0);
  const rev = k.suave(k.tramo(tq, f9.t("little"), f9.t("into")));
  mano(g, k.mez(40, -160, rev), k.mez(-240, -30, rev), 1.45, -0.7 + Math.sin(tq * 7) * 0.18 * (1 - agua), 0.3);
  if (agua > 0.05 && agua < 0.98) {
    g.strokeStyle = "rgba(170, 225, 255, 0.85)";
    g.lineWidth = 18;
    g.beginPath();
    g.moveTo(20, -260);
    g.lineTo(10, -40);
    g.stroke();
    k.brillo(g, 16, -80, 80, "cian", 0.4);
  }
  vapor(g, -210, -160, tq, agua);
  vapor(g, 230, -140, tq + 0.4, agua * segunda);
  olla(g, k.mez(520, 1100, fuera), -30, 1.35, 1 - fuera, 1);
  if (fuera < 0.85) k.brillo(g, k.mez(520, 1100, fuera), 180, 220, "fuego", 0.6 * (1 - fuera));
  velo(g, 0.88);
  viñeta(g, 0.36);
}
