// El nombre cae sobre la tierra del sur y rasga la cinta de Asia. Luego el oro se va,
// llegan las naves, la cinta se rehace y el farol se apaga.
import * as k from "#kit";
import { v } from "#voz";
import { barco, cieloMar, cinta, palabraOro, tierraSur, velo } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tnombre = f1.t("nombre");
const Tmurio = f2.t("murio");
const Tasia = f2.t("asia");
const Tmapa = f3.t("mapa");

const CX = 560, CY = 1040;

export function dibuja(g, t) {
  const impacto = k.suave(k.tramo(t, 0.05, 0.62));
  const oroSeVa = k.suave(k.tramo(t, f2.inicio, f2.inicio + 0.85));
  const llegan = k.suave(k.tramo(t, f2.inicio + 0.15, Tmurio));
  const farol = 1 - k.suave(k.tramo(t, Tmurio, Tmurio + 0.45));
  const cintaNueva = k.suave(k.tramo(t, Tasia - 0.35, Tasia + 0.55));
  const rasga = k.suave(k.tramo(t, Tnombre, f1.fin - 0.3));
  const empuje = k.suave(k.tramo(t, 8.05, 9.02));
  const reposo = k.suave(k.tramo(t, 8.9, Tmapa));
  const bob = 1 - reposo;

  cieloMar(g, t);

  g.save();
  g.translate(540, 1000);
  g.scale(1 + empuje * 0.06, 1 + empuje * 0.06);
  g.translate(-540, -1000);

  const sube = (1 - impacto) * 70;
  tierraSur(g, CX, CY + sube * 0.3, 2.15);

  const yNombre = 930 + (1 - impacto) * -70 + oroSeVa * -240;

  // la cinta vieja se rasga mientras cae el nombre
  if (oroSeVa < 0.98) {
    const al = 1 - oroSeVa;
    const parte = rasga * 90;
    cinta(g, CX - parte, 760 + sube, 420, 92, "ASIA", 1, al);
    if (rasga > 0.05) cinta(g, CX + parte, 768 + sube, 200, 78, "", 1, al * rasga);
  }

  // AMÉRICA, entero desde el fotograma 0: el sello llega y se queda
  const tam = 132 * (1.22 - 0.22 * impacto);
  palabraOro(g, "AMÉRICA", CX, yNombre, tam, 1 - oroSeVa);

  if (impacto > 0.55 && impacto < 0.98 && oroSeVa < 0.2) {
    const u = (impacto - 0.55) / 0.43;
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = (1 - u) * 0.7;
    g.strokeStyle = "#ffe09a";
    g.lineWidth = 10;
    g.beginPath();
    g.arc(CX, 1000, 80 + u * 420, 0, 6.2832);
    g.stroke();
    g.restore();
  }

  gotas(g, t, 1 - oroSeVa);

  // tres naves: al principio cabecean abajo; luego se acercan a la costa
  const naves = [
    { x0: 200, y0: 1460, x1: 280, y1: 1280, s: 1.15, f: 0.4 },
    { x0: 530, y0: 1520, x1: 540, y1: 1320, s: 1.45, f: 1.2 },
    { x0: 860, y0: 1440, x1: 800, y1: 1260, s: 1.05, f: 2.1 },
  ];
  naves.forEach((n, i) => {
    const x = k.mez(n.x0, n.x1, llegan);
    const y = k.mez(n.y0, n.y1, llegan) + Math.sin(t * 1.6 + n.f) * 6 * bob;
    barco(g, x, y, n.s, t, n.f, i === 1 ? farol : 0.85 * farol + 0.15);
  });

  // la cinta nueva, la que él creía: Asia, entera y quieta antes del corte
  if (cintaNueva > 0.02) {
    cinta(g, CX, 780, 520, 110, "ASIA", cintaNueva, 1);
  }

  g.restore();
  velo(g, 0.84);
}

function gotas(g, t, al) {
  if (al < 0.05) return;
  const az = k.azar(1507);
  g.save();
  g.globalAlpha = al;
  for (let i = 0; i < 16; i++) {
    const ang = az() * 6.2832;
    const v0 = 180 + az() * 520;
    const delay = az() * 0.2;
    const rad = 4 + az() * 4;
    const u = t - 0.42 - delay;
    if (u < 0 || u > 2) continue;
    const x = CX + Math.cos(ang) * v0 * u;
    const y = 1000 + Math.sin(ang) * v0 * u * 0.55 + 380 * u * u;
    g.fillStyle = i % 3 ? "#ffd56a" : "#fff6d0";
    g.beginPath();
    g.arc(x, y, rad, 0, 6.2832);
    g.fill();
  }
  g.restore();
}
