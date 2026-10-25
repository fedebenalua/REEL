// «En una ristra de cifras que no para, te quedas con cuatro coma dos. No está clavado: casi todo cae entre tres y cinco.»
// Un río de cifras. Se clava el 4,2 y luego se abre en 3, 4 y 5.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, numero, velo } from "../mundo.js";

export const desde = "ristra";

const f10 = v.frase(10), f11 = v.frase(11);
const Tcoma = f10.t("coma"), Ttres = f11.t("tres"), Tcinco = f11.t("cinco");
const az = k.azar(77);
const RIO = Array.from({ length: 42 }, (_, i) => ({
  d: String(Math.floor(az() * 10)),
  x: 160 + az() * 760,
  z: az(),
  f: az() * 8,
}));

export function dibuja(g, t) {
  fondo(g, t, "rio");
  const muestra = k.suave(k.tramo(t, Tcoma - 0.08, Tcoma + 0.28));
  const abre = k.suave(k.tramo(t, Ttres - 0.2, Tcinco + 0.25));
  const calma = k.suave(k.tramo(t, Tcinco + 0.15, Tcinco + 0.55));
  const vel = k.mez(k.mez(920, 260, muestra), 0, calma);
  g.save();
  g.globalAlpha = k.mez(k.mez(1, 0.28, muestra), 0.05, calma);
  for (const r of RIO) {
    const y = ((r.f * 220 - (t - f10.inicio) * vel) % 2300 + 2300) % 2300 - 200;
    const tam = 70 + r.z * 80;
    numero(g, r.x, y, r.d, "150,220,255", tam, 0.55 + r.z * 0.45);
  }
  g.restore();
  if (muestra > 0.02 && abre < 0.85) numero(g, 540, 1040, "4,2", "255,214,90", 340, muestra * (1 - abre));
  const n3 = k.suave(k.tramo(t, Ttres - 0.05, Ttres + 0.28));
  const n5 = k.suave(k.tramo(t, Tcinco - 0.05, Tcinco + 0.3));
  const n4 = k.suave(k.tramo(t, Ttres + 0.05, Tcinco));
  if (n3 > 0.02) numero(g, 250, 1080, "3", "120,220,255", 260, n3);
  if (n4 > 0.02) numero(g, 540, 1040, "4", "255,214,90", 280, n4);
  if (n5 > 0.02) numero(g, 830, 1080, "5", "255,150,180", 260, n5);
  velo(g);
}
