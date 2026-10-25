// El cuarto de noche: la grabación entra por el oído y, al abrir los ojos, se supone que ya hablas.
import * as k from "#kit";
import { v } from "#voz";
import { PALABRAS, cabeza, cuarto, movil, palabra, velo } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1);
const f2 = v.frase(2);
const f3 = v.frase(3);
const Tense = f1.t("ensena");
const Tnoche = f2.t("noche");
const Tojos = f3.t("ojos");
const Thablas = f3.t("hablas");

const OREJA = [700, 1040];

export function dibuja(g, t) {
  const acerca = 1 - k.suave(k.tramo(t, 2.15, 4.1));
  const aBoca = k.suave(k.tramo(t, 6.7, 8.15));
  const zoom = k.mez(k.mez(1.72, 1, 1 - acerca), 1.42, aBoca);
  const fx = k.mez(OREJA[0], 540, 1 - acerca * 0.15);
  const fy = k.mez(OREJA[1], 980, aBoca);
  const ojos = k.suave(k.tramo(t, Tojos - 0.05, Tojos + 0.45));
  const boca = k.suave(k.tramo(t, Thablas - 0.35, Thablas + 0.35));

  g.save();
  g.translate(fx, fy);
  g.scale(zoom, zoom);
  g.translate(-fx, -fy);
  cuarto(g, t, 0, 0);
  movil(g, 210, 1180, 1.15, t, k.suave(k.tramo(t, 2.4, 3.3)));
  cabeza(g, 560, 980, 1.15, ojos, boca);
  // palabras dando vueltas cuando la grabación suena toda la noche
  const orbita = k.suave(k.tramo(t, Tnoche - 0.3, Tnoche + 0.6)) * (1 - k.suave(k.tramo(t, Thablas - 0.2, Thablas + 0.45)));
  if (orbita > 0.02) {
    for (let i = 0; i < 6; i++) {
      const a = t * (0.55 + i * 0.04) + i * 1.05;
      const rx = 340 + (i % 3) * 36;
      const ry = 210 + (i % 2) * 30;
      const x = 560 + Math.cos(a) * rx;
      const y = 980 + Math.sin(a) * ry;
      palabra(g, x, y, PALABRAS[i], 0.72, orbita * (0.7 + 0.3 * (0.5 + 0.5 * Math.sin(a))));
    }
  }
  g.restore();

  // el río de palabras, en pantalla, desde el fotograma 0
  const rio = 1 - k.suave(k.tramo(t, 2.35, 3.15));
  if (rio > 0.02) {
    for (let i = 3; i >= 0; i--) {
      const lag = i * 0.22;
      const u = k.suave(k.tramo(t - lag, 0, 1.7));
      const x = k.mez(260 - i * 40, OREJA[0] + 20, u);
      const y = k.mez(860 + i * 18, OREJA[1] + 10, u);
      const s = k.mez(2.15 - i * 0.28, 0.42, u);
      const al = rio * (i === 0 ? 1 : 0.72);
      if (i > 0) {
        g.save();
        g.globalAlpha = 0.25 * al * (1 - u);
        g.strokeStyle = "rgba(140,220,255,0.8)";
        g.lineWidth = 18;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(x - 220, y);
        g.lineTo(x - 40, y + 8);
        g.stroke();
        g.restore();
      }
      palabra(g, x, y, PALABRAS[i], s, al);
    }
  }

  // la frase que se supone que ya sale de la boca
  const dice = k.entra(k.suave(k.tramo(t, Thablas - 0.15, Thablas + 0.45)));
  if (dice > 0.02) {
    const y = k.mez(1180, 860, dice);
    palabra(g, 540, y, "TORU", k.mez(0.4, 1.35, dice), dice, "255,196,90");
  }

  // fogonazo al entrar en el oído
  k.fogonazo(g, OREJA[0], OREJA[1], t - Tense, 900, "180,230,255");
  velo(g, 0.78);
}
