// La cuna de día: la patada, los días, las dos semanas. Un solo sitio, sin corte.
import * as k from "#kit";
import { v } from "#voz";
import { calendario, cuarto, cuna, muneco, pierna, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const Tp1 = f3.t("patea"), Tq = f4.t("quietos"), Tp2 = f4.t("patea");
const Tsem = f5.t("semanas"), Fin = v.frase(6).inicio;

const COLGADOS = [
  { x: -180, tipo: "estrella", pal: 0, fase: 0.2 },
  { x: -60, tipo: "luna", pal: 1, fase: 1.1 },
  { x: 60, tipo: "bola", pal: 2, fase: 2.2 },
  { x: 170, tipo: "aro", pal: 3, fase: 0.6 },
  { x: 0, tipo: "estrella", pal: 4, fase: 1.8 },
];

const ang = k.claves([
  [f3.inicio, 0.15],
  [Tp1 - 0.05, 0.35],
  [Tp1 + 0.55, 2.4],
  [Tq - 0.35, 6.8],
  [Tq + 0.15, 7.15],
  [Tp2 - 0.05, 7.25],
  [Tp2 + 0.5, 8.6],
  [Tsem, 14.2],
  [Fin - 0.28, 15.6],
  [Fin + 0.2, 15.65],
]);

export function dibuja(g, t) {
  const dia = k.claves([
    [f3.inicio, 1],
    [f4.inicio - 0.05, 1],
    [f4.inicio + 0.18, 0],
    [f4.inicio + 0.42, 0],
    [f4.inicio + 0.58, 1],
    [f4.inicio + 0.72, 0],
    [Tq - 0.12, 0],
    [Tq + 0.05, 1],
    [Fin, 1],
  ]);
  cuarto(g, dia(t));
  const zoom = k.claves([
    [f3.inicio, 1],
    [Tp1, 1.06],
    [Tp1 + 0.45, 1.14],
    [f4.inicio, 1.04],
    [f5.inicio, 0.96],
    [Fin - 0.2, 1],
  ]);
  const z = zoom(t);
  g.save();
  g.translate(540, 1100);
  g.scale(z, z);
  g.translate(-540, -1100);

  // barra y muñecos
  const giro = ang(t);
  g.strokeStyle = "#e8c8a0";
  g.lineWidth = 14;
  g.beginPath();
  g.moveTo(300, 640);
  g.lineTo(780, 640);
  g.stroke();
  COLGADOS.forEach((c, i) => {
    const x = 540 + c.x;
    const y = 820 + Math.sin(giro * 2 + c.fase) * 18;
    g.strokeStyle = "rgba(255,236,210,0.7)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(x, 640);
    g.lineTo(x, y);
    g.stroke();
    muneco(g, x, y, i === 4 ? 128 : 108, giro * (i % 2 ? 1 : -1) + c.fase, c.pal, c.tipo);
  });

  cuna(g, 560, 1280, 1.05);

  // la pierna: escondida, sale en cada patada
  const k1 = k.pulso(t, Tp1 + 0.05, 0.16);
  const k2 = k.pulso(t, Tp2 + 0.05, 0.16);
  const salePata = (t0) => k.suave(k.tramo(t, t0 - 0.22, t0)) * (1 - k.suave(k.tramo(t, t0 + 0.32, t0 + 0.62)));
  const ver = Math.max(salePata(Tp1), salePata(Tp2));
  if (ver > 0.02) {
    g.save();
    g.globalAlpha = ver;
    const angP = k.mez(-0.2, -1.25, Math.max(k1, k2));
    pierna(g, 390, 1240, 1.85, angP);
    g.restore();
  }
  const golpe = Math.max(k1, k2);
  if (golpe > 0.05) {
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, 560, 820, 700, "amarilla", golpe * 0.85);
    g.restore();
  }

  // el calendario entra con los seis meses y pasa a la segunda hoja en «semanas»
  const llega = k.entra(k.tramo(t, f5.inicio - 0.05, f5.inicio + 0.4));
  if (llega > 0.01) {
    const pasa = k.suave(k.tramo(t, Tsem - 0.55, Tsem - 0.08));
    g.save();
    g.globalAlpha = llega;
    const cx = k.mez(-120, 210, llega);
    calendario(g, cx, 980, 1.05, "2");
    if (pasa < 0.98) {
      g.save();
      g.translate(cx, 800);
      g.scale(1, Math.max(0.04, 1 - pasa));
      g.translate(-cx, -800);
      calendario(g, cx, 980, 1.05, "1");
      g.restore();
    }
    g.restore();
  }
  g.restore();
  veloArriba(g, 0.8);
}
