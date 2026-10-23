// «El otro las tapó y las sacó de la cabeza, también las que ya le salían.»
// Otro sitio: mesa más fría. Las fichas se dan la vuelta y el dibujo sale hacia arriba,
// también el de las que ya tenían el tic.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, reverso, velo, ICONOS } from "../mundo.js";

export const desde = "otro";

const CARDS = [
  { x: 280, y: 900, icono: 2 },
  { x: 540, y: 860, icono: 4 },
  { x: 760, y: 900, icono: 6 },
  { x: 300, y: 1240, icono: 8 },
  { x: 540, y: 1220, icono: 9 },
  { x: 760, y: 1200, icono: 7 },
];

export function dibuja(g, t) {
  const f = v.frase(7);
  const Ttap = f.t("tapo"), Tsac = f.t("saco"), Ttam = f.t("tambien"), Tsal = f.t("salian");
  const finPlano = v.frase(8).inicio - 0.04;
  cuarto(g, t, 0.55);
  // luz fría, para que no sea la misma mesa
  g.save();
  g.globalCompositeOperation = "lighter";
  const lg = g.createRadialGradient(700, 400, 20, 640, 700, 800);
  lg.addColorStop(0, "rgba(120,170,255,0.28)");
  lg.addColorStop(1, "rgba(80,120,255,0)");
  g.fillStyle = lg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
  mesa(g, 1360);

  const tambien = k.entra(k.tramo(t, Ttam - 0.05, Tsal + 0.15));
  const quieto = k.suave(k.tramo(t, finPlano - 0.32, finPlano - 0.02));

  CARDS.forEach((c, i) => {
    const u = k.suave(k.tramo(t, Ttap - 0.02 + i * 0.035, Ttap + 0.26 + i * 0.035));
    const sx = Math.cos(u * Math.PI);
    const dada = sx < 0;
    g.save();
    g.translate(c.x, c.y);
    g.scale(Math.max(0.05, Math.abs(sx)), 1);
    if (!dada) carta(g, 0, 0, 220, { icono: c.icono, check: 1 });
    else reverso(g, 0, 0, 220, {});
    g.restore();

    const retraso = i * 0.05;
    const sale = k.suave(k.tramo(t, Tsac - 0.02 + retraso, Tsac + 0.5 + retraso));
    const extra = i >= 3 ? tambien : 1;
    const fuerza = sale * extra;
    if (fuerza > 0.03 && dada) {
      const yIcono = c.y - fuerza * 260;
      const s = 210 * fuerza;
      k.haz(g, c.x, c.y - 40, yIcono + s * 0.2, "150,210,255", 0.55 * fuerza * (1 - quieto * 0.7), 36);
      g.save();
      g.globalAlpha = Math.min(1, fuerza * 1.3);
      g.drawImage(ICONOS[c.icono], c.x - s / 2, yIcono - s / 2, s, s);
      g.restore();
      k.brillo(g, c.x, yIcono, 280, "160,220,255", 0.4 * fuerza * (1 - quieto * 0.45));
    }
  });
  // sube se usa para que el conjunto no se quede en el primer fotograma
  velo(g, 0.68);
}
