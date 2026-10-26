// El camino del tiempo, de noche: el desierto, la Gran Pirámide abajo, la Luna arriba y la cinta de luz entre las dos,
// con la moneda de Cleopatra donde nace (el 55 % del camino). Lo dibujan el plano 01 y el 05.
import * as k from "#kit";
import { APICE, BL, BR, BK, LUNA, RLUNA, Y0, Y1, YCLEO, RMONEDA, pon, aPantalla, piramide, luna, huella, moneda, cieloNoche, dunas, cinta } from "./mundo.js";

export const PIR = { A: APICE, BL, BR, BK };

// c: la cámara { cx, cy, z }. o: lo que pasa (ver cada campo abajo).
export function escena(g, t, c, o = {}) {
  cieloNoche(g, c, t);
  pon(g, c);
  // la Luna y su huella
  luna(g, LUNA[0], LUNA[1], RLUNA, o.luzLuna ?? 0);
  if (o.huella > 0) huella(g, LUNA[0] - 8, LUNA[1] + 18, 58, o.huella);
  dunas(g);
  // la pirámide, con su luz de luna detrás
  k.brillo(g, APICE[0] + 40, APICE[1] + 150, 900, "150,170,255", 0.12 + 0.45 * (o.luzPir ?? 0));
  piramide(g, PIR, { forro: 1, punta: o.punta ?? 1, puntaDy: o.puntaDy ?? 0 });
  if (o.fogPunta !== undefined) k.fogonazo(g, APICE[0], APICE[1], o.fogPunta, 520, "235,240,255");
  // la cinta
  cinta(g, t, { alOro: o.alOro ?? 1, alAzul: o.alAzul ?? 1, marcas: o.marcas ?? 0, flujo: o.flujo ?? 0 });
  // un pulso de luz que recorre un tramo (de ya a yb, en u)
  if (o.pulso) { const { ya, yb, u, color } = o.pulso; if (u > 0 && u < 1.02) { const y = ya + (yb - ya) * Math.min(1, u); k.brillo(g, 540, y, 120, color, 0.9); k.brillo(g, 540, y, 40, "255,255,255", 0.9); } }
  // la moneda
  const yM = o.yMoneda ?? YCLEO, rM = RMONEDA * (o.escMoneda ?? 1);
  moneda(g, 540, yM, rM, o.giro ?? 0, o.luzMoneda ?? 0);
  g.setTransform(1, 0, 0, 1, 0, 0);
  // velo arriba, para el subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(4,8,28,0.55)"); vg.addColorStop(1, "rgba(4,8,28,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}

// Las llaves de los dos tramos, en la pantalla: una raya a la izquierda de la cinta con su cifra.
export function llaves(g, c, { oro = 0, azul = 0, textoOro = "2.500 años", textoAzul = "2.000 años", latOro = 0, hoy = 0 } = {}) {
  const tramo = (ya, yb, al, txt, color, lat) => {
    if (al <= 0.01) return;
    const A = aPantalla(c, 490, ya), B = aPantalla(c, 490, yb), d = 3;
    g.save(); g.globalAlpha = al; g.lineCap = "round";
    g.strokeStyle = `rgba(${color},0.95)`; g.lineWidth = 7 + 5 * lat; g.shadowColor = `rgba(${color},0.9)`; g.shadowBlur = 18 + 20 * lat;
    g.beginPath(); g.moveTo(A.x + 28, A.y - d); g.lineTo(A.x, A.y - d); g.lineTo(B.x, B.y + d); g.lineTo(B.x + 28, B.y + d); g.stroke();
    g.restore();
    k.pastilla(g, A.x - 200, (A.y + B.y) / 2, txt, "", color, al, 74 + 12 * lat);
  };
  tramo(Y0, YCLEO + RMONEDA * 0.4, oro, textoOro, "255,200,110", latOro);
  tramo(YCLEO - RMONEDA * 0.4, Y1, azul, textoAzul, "150,200,255", 0);
  if (hoy > 0.01) { const P = aPantalla(c, 540, Y1 - 5); k.etiqueta(g, P.x + 150, P.y - 30, "hoy", "150,200,255", hoy, 44); }
}
