// La semilla de sésamo y, después, tu cerebro.
import * as k from "#kit";
import { v } from "#voz";
import { cabeza, cerebro, sesamo, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(13).t("con");
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra } = k;
const f13 = v.frase(13);
const f14 = v.frase(14);
const Tses = f13.t("sesamo");
const Tmill = f13.t("millon");
const Ttuyo = f14.t("tuyo");
const Tmillos = f14.t("millones");
const Fin = f14.fin;

const az = k.azar(19);
const CHISPAS = Array.from({ length: 180 }, () => ({
  x: (az() - 0.5) * 280,
  y: (az() - 0.55) * 240,
  r: 1.5 + az() * 2.5,
  f: az() * 6.28,
}));

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#140e22");
  bg.addColorStop(0.5, "#3a2158");
  bg.addColorStop(1, "#e08a3c");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  const llegaCabeza = su(tr(t, Ttuyo - 0.15, Ttuyo + 0.85));
  const llegaSem = entra(tr(t, f13.inicio, Tses + 0.05));
  const sSem = mez(1.7, 0.38, llegaCabeza) * mez(0.3, 1, llegaSem);
  const xSem = mez(1300, mez(380, 200, llegaCabeza), llegaSem);
  const ySem = mez(1500, mez(980, 1320, llegaCabeza), llegaSem);
  const giro = -0.9 + su(tr(t, f13.inicio, Tmill)) * 1.1;
  sesamo(g, xSem, ySem, sSem, giro);

  const llegaCer = entra(tr(t, Tses - 0.15, Tmill - 0.15));
  const pulso = k.pulso(t, Tmill + 0.08, 0.2);
  const sCer = mez(170, 40, llegaCabeza) * mez(0.2, 1, llegaCer) * (1 + pulso * 0.35);
  const xCer = mez(-180, mez(820, 240, llegaCabeza), llegaCer);
  const yCer = mez(1500, mez(1100, 1380, llegaCabeza), llegaCer);
  // el cerebro de la abeja se queda un momento al lado de la semilla y luego se va con ella, ya quieto
  const alMini = 1 - su(tr(t, Tmillos - 0.2, Tmillos + 0.25));
  g.save();
  g.globalAlpha = alMini;
  cerebro(g, xCer, yCer, sCer, pulso);
  g.restore();

  const yCab = mez(1480, 840, llegaCabeza);
  cabeza(g, 620, yCab, mez(0.95, 1.12, llegaCabeza), llegaCabeza, 1);
  if (llegaCabeza > 0.35) {
    g.save();
    g.translate(620, yCab);
    g.scale(llegaCabeza, llegaCabeza);
    g.globalCompositeOperation = "lighter";
    for (const c of CHISPAS) {
      const calma = 1 - su(tr(t, Fin - 0.55, Fin - 0.1));
      const a = 0.22 + 0.2 * Math.sin(t * 2 + c.f) * calma;
      g.fillStyle = `rgba(255,190,210,${a * llegaCabeza})`;
      g.beginPath();
      g.arc(-40 + c.x * 0.55, -70 + c.y * 0.55, c.r, 0, 6.28);
      g.fill();
    }
    g.restore();
  }

  const num = su(tr(t, Tmillos - 0.08, Tmillos + 0.28));
  if (num > 0.02) k.pastilla(g, 540, 1320, "86.000", "millones", "255,214,120", num, 84);
  velo(g, 0.55);
}
