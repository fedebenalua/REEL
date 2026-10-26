// «Y la parte de delante del cerebro, la que archiva lo que acaba de pasar, se queda apagada.»
import * as k from "#kit";
import { v } from "#voz";
import { cabeza, koi, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(7).t("y");

const f = v.frase(7);
const Tdel = f.t("delante");
const Tap = f.t("apagada");

const az = k.azar(9);
const CHISPAS = Array.from({ length: 18 }, () => ({ a: az() * 6.28, v: 40 + az() * 80, s: 6 + az() * 10, f: az() }));

export function dibuja(g, t) {
  const bg = g.createRadialGradient(640, 1000, 80, 540, 1000, 1100);
  bg.addColorStop(0, "#2a1030");
  bg.addColorStop(1, "#07040c");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  const acerca = k.suave(k.tramo(t, Tdel, Tap - 0.2));
  const esc = k.mez(3.3, 4.15, acerca);
  const ox = k.mez(520, 430, acerca);
  const frente = k.suave(k.tramo(t, Tap - 0.25, Tap + 0.35));
  cabeza(g, ox, 1040, esc, frente, t);

  // lo que sube y no se archiva: se apaga antes del corte
  const sube = k.tramo(t, f.t("archiva"), Tap + 0.15);
  const muere = k.suave(k.tramo(t, Tap + 0.05, Tap + 0.7));
  if (sube > 0 && muere < 0.98) {
    const y = 780 - sube * 90;
    const al = (1 - muere) * Math.min(1, sube * 2);
    koi(g, 620, y, 180, -0.4, t, al);
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const c of CHISPAS) {
      const x = 620 + Math.cos(c.a) * c.v * sube;
      const yy = y + Math.sin(c.a) * c.v * sube * 0.4;
      g.fillStyle = `rgba(255,180,120,${0.4 * al})`;
      g.beginPath(); g.arc(x, yy, c.s, 0, 6.2832); g.fill();
    }
    g.restore();
  }
  const calma = 1 - k.suave(k.tramo(t, f.fin - 0.4, f.fin - 0.08));
  k.brillo(g, 700, 980, 500, "255,120,140", 0.28 * calma);
  velo(g, 0.5);
}
