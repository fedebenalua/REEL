// «Dicen que el noventa por ciento de tu cerebro está apagado. Si fuera verdad, podrían quitártelo y seguirías hablando y andando.»
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, fondo, mano, motas, persona, vaso, velo, zonaPantalla } from "../mundo.js";

export const desde = 0;

const az = k.azar(9);
const CHISPAS = Array.from({ length: 48 }, () => ({
  ang: az() * 6.28, vel: 70 + az() * 160, f: az(), tam: 2 + az() * 3,
}));

export function dibuja(g, t) {
  const f1 = v.frase(1), f2 = v.frase(2);
  const Tquita = f2.t("quitartelo");
  const Thabla = f2.t("hablando");
  const Tanda = f2.t("andando");
  const fin = v.frase(3).inicio;
  const separa = k.suave(k.tramo(t, Tquita - 0.05, Tquita + 1.35));
  const calma = 1 - k.suave(k.tramo(t, fin - 0.4, fin - 0.12));
  const rapido = k.entra(k.tramo(t, 0, 1.15));
  const sigue = k.suave(k.tramo(t, 0.4, Tquita));
  const cx = k.mez(k.mez(760, 600, rapido), 470, sigue);
  const cy = k.mez(k.mez(1120, 960, rapido), 800, sigue);
  const s = k.mez(k.mez(2.55, 2.15, rapido), 1.28, k.suave(k.tramo(t, Tquita - 0.1, Tquita + 1.2)));
  const anda = k.suave(k.tramo(t, Tanda - 0.15, Tanda + 0.45)) * calma;
  const boca = (0.45 + 0.55 * Math.sin(t * 14)) * k.suave(k.tramo(t, Thabla - 0.1, Thabla + 0.2)) * (1 - k.suave(k.tramo(t, f2.fin - 0.15, f2.fin + 0.05)));

  fondo(g, "#140818", "#07060f");
  motas(g, t, 0.45 * calma);
  const px = 540, py = 980, alto = 860;
  if (separa > 0.001) {
    persona(g, px, py + (1 - separa) * 1200, alto, { t, anda: anda * separa, boca: boca * separa, brazo: 0.12 });
    const m = mano(px, py + (1 - separa) * 1200, alto, 0.12);
    vaso(g, m[0], m[1], 0.85, Math.min(1, separa * 1.4));
  }

  cerebro(g, cx, cy - separa * 40, s, {
    t, separa, vivo: 0.08, nucleo: 1,
  });

  const foco = zonaPantalla(cx, cy, s, "habla");
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const c of CHISPAS) {
    const u = (t * 0.55 + c.f) % 1;
    const rr = 30 + u * c.vel;
    const x = foco[0] + Math.cos(c.ang) * rr;
    const y = foco[1] + Math.sin(c.ang) * rr * 0.72;
    g.fillStyle = `rgba(255,190,80,${(1 - u) * 0.8 * calma})`;
    g.fillRect(x, y, c.tam, c.tam);
  }
  g.restore();
  velo(g, 0.82);
}

