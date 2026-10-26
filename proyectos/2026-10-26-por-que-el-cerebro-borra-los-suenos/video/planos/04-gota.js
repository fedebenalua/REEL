// «En esa fase se apaga la noradrenalina, la sustancia que ayuda a guardar lo que vives.»
// Una lámpara azul sella la taza (lo vivido) y se apaga antes de llegar al sueño.
import * as k from "#kit";
import { v } from "#voz";
import { canica, taza, esfera, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(5).t("en");

const f = v.frase(5);
const Tapaga = f.t("apaga");
const Tnor = f.t("noradrenalina");
const Tguardar = f.t("guardar");

const GOTAS = [
  { x: 300, meta: 1080, retraso: 0, s: 16 },
  { x: 360, meta: 1120, retraso: 0.12, s: 13 },
  { x: 250, meta: 1160, retraso: 0.22, s: 15 },
  { x: 700, meta: 980, retraso: 0.05, s: 18 },
  { x: 790, meta: 1000, retraso: 0.16, s: 14 },
  { x: 640, meta: 940, retraso: 0.28, s: 16 },
];

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#071428");
  bg.addColorStop(0.5, "#0c0820");
  bg.addColorStop(1, "#140818");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalAlpha = 0.2;
  g.globalCompositeOperation = "screen";
  g.drawImage(k.manchas, -200, 200, 1500, 1600);
  g.restore();

  const apagada = k.suave(k.tramo(t, Tapaga - 0.05, Tapaga + 0.45));
  const luz = 1 - apagada;
  // la lámpara: una glándula azul, no un esquema
  g.save();
  g.translate(540, 640);
  const lg = g.createRadialGradient(0, -20, 10, 0, 0, 120);
  lg.addColorStop(0, `rgba(210,240,255,${0.3 + 0.7 * luz})`);
  lg.addColorStop(0.5, `rgba(40,120,255,${0.25 + 0.6 * luz})`);
  lg.addColorStop(1, "rgba(10,20,40,0.2)");
  g.fillStyle = lg;
  g.beginPath(); g.ellipse(0, 0, 150, 78, 0, 0, 6.2832); g.fill();
  g.fillStyle = `rgba(180,220,255,${0.35 + 0.4 * luz})`;
  g.beginPath(); g.ellipse(-30, -16, 40, 22, -0.4, 0, 6.2832); g.fill();
  g.restore();
  k.brillo(g, 540, 640, 420, "80,150,255", 0.55 * luz);

  // las gotas de la taza llegan; las del sueño se quedan a medias cuando la lámpara se apaga
  for (const d of GOTAS) {
    const sueno = d.x > 500;
    const tope = sueno ? 1 - apagada * 0.55 : 1;
    const cae = k.suave(k.tramo(t, f.inicio + d.retraso, Tapaga)) * tope;
    const y = 760 + cae * (d.meta - 760);
    const a = sueno ? 0.95 * (1 - k.suave(k.tramo(t, Tnor, Tguardar))) : (cae > 0.05 ? 0.95 : 0);
    if (a < 0.04 || cae < 0.03) continue;
    g.save();
    g.translate(d.x, y);
    g.fillStyle = `rgba(186,220,255,${a})`;
    g.beginPath();
    g.moveTo(0, -d.s * 1.5);
    g.quadraticCurveTo(d.s, 0, 0, d.s * 1.1);
    g.quadraticCurveTo(-d.s, 0, 0, -d.s * 1.5);
    g.fill();
    g.restore();
  }
  // una gota que sí llega a la taza, al principio, y la sella
  const sella = k.suave(k.tramo(t, f.inicio, Tapaga));
  esfera(g, 330, 1240, 200, t, (gg) => taza(gg, 200), 0.55 + 0.45 * sella);
  if (sella > 0.2) {
    g.save();
    g.translate(330, 1240);
    g.strokeStyle = `rgba(140,200,255,${0.85 * sella})`;
    g.lineWidth = 8;
    g.beginPath(); g.arc(0, 0, 188, -0.2, 1.4); g.stroke();
    g.restore();
    k.brillo(g, 330, 1100, 180, "160,210,255", 0.4 * (1 - apagada) * k.pulso(t, Tapaga - 0.15, 0.12));
  }

  // la esfera del sueño, sin sello: el pez se va
  const seVa = k.suave(k.tramo(t, Tnor, Tguardar + 0.45));
  canica(g, 760, 1280, 210, t, "pez", 1 - seVa * 0.92);

  // al final, la taza quieta y el sueño casi vacío: reposo
  velo(g, 0.58);
}
