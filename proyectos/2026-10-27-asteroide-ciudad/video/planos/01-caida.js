// «¿Qué ocurriría si un asteroide del tamaño de una ciudad impactara contra la Tierra?
// Ya ocurrió: hace sesenta y seis millones de años, en Yucatán.
// Una roca de unos diez kilómetros, lo que mide una ciudad, abrió un cráter de unos doscientos.»
// Un solo sitio: la Tierra. El fogonazo se recoge y el mismo globo enseña el golpe antiguo.
// Luego la cámara se mete en ese punto y, en el suelo, la ciudad y la roca caben dentro del cráter.
import * as k from "#kit";
import { v } from "#voz";
import { asteroide, cielo, ciudad, crater, lucesCiudad, paisaje, puntoGolpe, veloArriba } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tciudad = f1.t("ciudad");
const Timp = f1.t("impactara");
const Toc = f2.t("ocurrio");
const Tyuc = f2.t("yucatan");
const Tdiez = f3.t("diez");
const Tcrat = f3.t("crater");
const Tdos = f3.t("doscientos");
const Tcorte = v.frase(4).inicio;
const Tquieto = Tcorte - 0.28;

const RACHAS = Array.from({ length: 42 }, (_, i) => {
  const az = k.azar(120 + i);
  return { x: az() * 1080, y: az() * 1920, l: 36 + az() * 70, v: 520 + az() * 640, w: 1.6 + az() * 2.2, c: az() < 0.5 ? "255,236,210" : "255,255,255" };
});

function camEstrellas(t) {
  const tt = Math.min(Math.max(t, 0), Timp);
  return k.mira([tt * 0.85, 0.4 - tt * 0.35, 6.2 - tt * 1.6], [0, 0, 0]);
}

function fogonazoU(t) {
  if (t < Timp) return 0;
  if (t < 4.35) return k.entra(k.tramo(t, Timp, 4.35));
  if (t < Toc) return 1;
  return 1 - k.suave(k.tramo(t, Toc, 7.05));
}

export function dibuja(g, t) {
  const tt = Math.min(t, Tquieto);
  const cam = camEstrellas(tt);
  k.fondo(g, cam);
  k.estrellas(g, cam, camEstrellas(tt - 1 / 60), cielo, 1.15);

  const rachaAl = 1 - k.suave(k.tramo(tt, Timp - 0.15, Timp + 0.28));
  if (rachaAl > 0.03) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.lineCap = "round";
    for (const r of RACHAS) {
      const y = (r.y + tt * r.v) % 2000 - 40;
      const x = r.x + tt * 40;
      g.strokeStyle = `rgba(${r.c},${0.45 * rachaAl})`;
      g.lineWidth = r.w;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x - 18, y - r.l);
      g.stroke();
    }
    g.restore();
  }

  // El globo, entero, y luego un viaje hasta el suelo del golpe (el ecuador, no el casquete).
  const zuma = k.suave(k.tramo(tt, 9.85, 10.45));
  const cx = 540;
  const cy = k.mez(1260, 1080, k.suave(k.tramo(tt, 5.1, 8.2)));
  const rad = 500;
  const gira = k.claves([[0, 0.02], [4.8, 0.05], [6.5, 0.08], [Tyuc - 0.2, 0.36], [Tquieto, 0.36]])(tt);
  const luces = (1 - zuma) * (1 - k.suave(k.tramo(tt, Toc, 6.5)));
  if (zuma < 0.98) {
    g.save();
    g.globalAlpha = 1 - zuma;
    k.tierra(g, cx, cy, rad, gira, -0.9, -0.25);
    lucesCiudad(g, cx, cy, rad, gira, luces);
    g.restore();
  }
  if (zuma > 0.02) {
    g.save();
    g.globalAlpha = zuma;
    paisaje(g, 0, tt);
    g.restore();
  }

  const golpe = puntoGolpe(cx, cy, rad * Math.min(1, 520 / rad), gira);
  const marca = k.suave(k.tramo(tt, 6.85, Tyuc - 0.05)) * (1 - zuma);
  if (golpe && marca > 0.03) {
    k.brillo(g, golpe.x, golpe.y, 160, "fuego", 0.95 * marca);
    k.brillo(g, golpe.x, golpe.y, 36, "blanca", 0.9 * marca);
  }

  // La caída: la roca ya está enorme, se clava en el centro del disco en «impactara».
  const cae = k.sale(k.tramo(tt, 0, Timp));
  const hunde = k.suave(k.tramo(tt, Timp - 0.05, Timp + 0.28));
  const rx = k.mez(340, 460, cae);
  const ry = k.mez(820, 1120, cae);
  const rr = k.mez(210, 245, cae);
  if (tt < 9.6 && hunde < 0.99) {
    g.save();
    g.globalAlpha = 1 - hunde;
    asteroide(g, rx, ry, rr, tt * 1.1, 0.62 + 0.38 * cae);
    g.restore();
    const an = rr * 1.9;
    const llega = k.entra(k.tramo(tt, Tciudad - 0.32, Tciudad + 0.12));
    const seVa = k.suave(k.tramo(tt, Timp - 0.08, Timp + 0.18));
    ciudad(g, rx + rr * 2.15, ry, an, llega * (1 - seVa) * (1 - hunde));
  }

  const u = fogonazoU(tt);
  if (u > 0.02 && tt < 9.7) {
    g.save();
    g.globalAlpha = Math.min(1, u * 1.25);
    k.fogonazo(g, 460, 1100, Math.min(u, 1) * 0.55, 1900, "255,214,170");
    k.estallido(g, 460, 1100, u * 0.8, "fuego", 1.35, 19, 64, 6);
    g.restore();
  }

  // En el suelo: la roca y la ciudad, del mismo tamaño, y el cuenco que se abre.
  const metro = k.entra(k.tramo(tt, Tdiez - 0.28, Tdiez + 0.12));
  const abre = k.entra(k.tramo(tt, Tcrat, Tdos));
  const tam = k.mez(200, 36, abre) * metro;
  const my = 1120;
  if (tam > 2) {
    asteroide(g, 540 - tam * 1.25, my, tam, 0.6 + tt * 0.12, 0.08);
    ciudad(g, 540 + tam * 1.35, my, tam * 1.9, metro);
  }
  crater(g, 540, my, k.mez(24, 700, abre), abre * metro);

  veloArriba(g, 0.5 + 0.2 * (1 - zuma));
}
