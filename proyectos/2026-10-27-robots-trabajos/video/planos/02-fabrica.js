// «En las fábricas ya hay cinco millones de robots, y la gente sigue a su lado.»
import * as k from "#kit";
import { v } from "#voz";
import { brazo, chispas, fondoNave, operario, panelCoche, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(2).inicio;
export const entrada = "corte";

const f = v.frase(2);
const Tmil = f.t("millones");
const Tlado = f.t("lado");
const Tcorte = v.frase(3).inicio;

export function dibuja(g, t) {
  const tt = Math.min(t, Tcorte - 0.26);
  const acerca = k.suave(k.tramo(tt, f.inicio, Tlado));
  fondoNave(g);
  g.fillStyle = "#24180f";
  g.beginPath();
  g.moveTo(0, 1500);
  g.lineTo(1080, 1420);
  g.lineTo(1080, 1920);
  g.lineTo(0, 1920);
  g.fill();
  g.strokeStyle = "rgba(255,170,80,0.25)";
  g.lineWidth = 3;
  for (let x = -40; x < 1200; x += 90) {
    g.beginPath();
    g.moveTo(x, 1540);
    g.lineTo(x + 540, 1920);
    g.stroke();
  }

  const cx = k.mez(530, 500, acerca);
  const cy = k.mez(1080, 1000, acerca);
  const s = k.mez(1.75, 2.25, acerca);
  panelCoche(g, cx, cy, s, 0.85 + 0.15 * Math.sin(tt * 7));
  const tip = brazo(g, cx - 55 * s, cy + 55 * s, s * 0.58, tt, 0.4);
  chispas(g, tip.x, tip.y, tt, 0.9, 0.2);
  operario(g, cx + 145 * s, cy + 95 * s, 210 * s, tt, { brazo: -1.15 });

  const cifra = k.entra(k.tramo(tt, Tmil - 0.08, Tmil + 0.28));
  if (cifra > 0.02) k.pastilla(g, 390, 1240, "5", "millones", "120,230,255", cifra, 86);
  velo(g);
}
