// «¿Sabías que los plátanos son radiactivos?»
// Apertura «rayos X»:
// - Fotograma 0: la cámara se lanza hacia un plátano enorme que gira en la oscuridad cálida de una cocina, entre luces
//   que pasan a toda velocidad; llega y frena, grande, en diagonal.
// - «radiactivos»: un fogonazo verde, la piel se vuelve transparente como en una radiografía y dentro empiezan a
//   romperse átomos con su destello y su rayo; sale una onda verde.
// El plano siguiente («Dentro de este») sigue desde este mismo plátano, sin corte.
import * as k from "#kit";
import { v } from "#voz";
import { BANG, BL, BX, BY, ROTURAS, destello, dondeRotura, fondo, platano, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra, azar, F } = k;
const Trad = v.frase(1).t("radiactivos"), Tlleg = 1.35;

// las luces que pasan a toda velocidad (el viaje)
const azT = azar(31);
const RAYAS = Array.from({ length: 260 }, () => { const a = azT() * 6.2832, r = 1.5 + Math.pow(azT(), 0.7) * 9; return { x: Math.cos(a) * r, y: Math.sin(a) * r, z0: azT() * 50, c: ["255,200,110", "255,160,70", "255,235,170", "150,210,255"][Math.floor(azT() * 4)], w: 1 + azT() * 2 }; });
const viaje = (t) => 52 * t - 19 * t * t;

export function estado(t) {
  const u = entra(tr(t, 0, Tlleg));
  return {
    L: Math.exp(mez(Math.log(620), Math.log(BL), u)),
    x: mez(560, BX, u), y: mez(900, BY, u), ang: mez(0.9, BANG, u),
    giro: 7 * (1 - Math.exp(-t * 1.6)) / 1.6 * 1.1,
  };
}

export function dibuja(g, t) {
  fondo(g, t, "255,170,70", 1, 0, 0);
  // el viaje: rayas de luz que salen hacia fuera y se apagan al llegar
  const al = 1 - su(tr(t, Tlleg - 0.35, Tlleg + 0.1));
  if (al > 0) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    const tt = Math.min(t, 1.4), d = viaje(tt), d0 = viaje(Math.max(0, tt - 1 / 30));
    for (const r of RAYAS) {
      const z = (((r.z0 - d) % 50) + 50) % 50 + 0.5, z0 = z + (d - d0) * 2;
      const x1 = 540 + (F * r.x) / z / 3, y1 = 960 + (F * r.y) / z / 3, x0 = 540 + (F * r.x) / z0 / 3, y0 = 960 + (F * r.y) / z0 / 3;
      if (x1 < -200 || x1 > 1280 || y1 < -200 || y1 > 2120) continue;
      g.strokeStyle = `rgba(${r.c},${al * Math.min(0.8, 7 / z)})`; g.lineWidth = r.w * Math.min(7, 12 / z) + 1;
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    }
    g.restore();
  }
  const e = estado(t), rx = su(tr(t, Trad - 0.05, Trad + 0.4));
  // el resplandor verde que se queda detrás del plátano
  k.brillo(g, e.x, e.y, 1900, "verde", 0.35 * rx);
  platano(g, e.x, e.y, e.L, e.ang, { giro: e.giro, rayos: rx });
  // los átomos que se rompen dentro
  if (rx > 0.2) for (const r of ROTURAS) { if (r.t < Trad || r.t > t) continue; const [x, y] = dondeRotura(r); destello(g, x, y, t - r.t, 150, r.dir, 380); }
  // el fogonazo y la onda de «radiactivos»
  k.fogonazo(g, e.x, e.y, t - (Trad - 0.02), 1500, "170,255,130");
  vineta(g, 0.5);
  velo(g, 0.55);
}
