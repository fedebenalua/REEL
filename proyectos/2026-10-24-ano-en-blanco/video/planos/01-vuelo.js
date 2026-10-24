// «¿Por qué no te acuerdas de cuando eras un bebé?»
// Fotograma 0: ya se va entre muñecos enormes. Al llegar, la cuna. En «bebé» se raja y palidece.
import * as k from "#kit";
import { v } from "#voz";
import { JUGUETES, cuna, grietas, muneco, cuarto, veloArriba } from "../mundo.js";

export const desde = 0;
const f1 = v.frase(1);
const Tbe = f1.t("bebe");

export function dibuja(g, t) {
  const u = Math.min(1, t / 1.5);
  const e = 1 - (1 - u) * (1 - u);
  const zCam = k.mez(24, 7.2, e);
  const cam = k.mira([0, 1.55, zCam], [0, 1.15, zCam - 16]);
  const dia = k.suave(k.tramo(t, 0.15, 1.15));
  cuarto(g, dia);

  const tSpin = Math.min(t, Tbe + 0.05);
  const cosas = [];
  for (const j of JUGUETES) {
    const p = k.proyecta(cam, [j.x, j.y, j.z]);
    if (!p || p.z < 0.2) continue;
    const rad = k.tamano(j.s, p.z);
    if (rad < 4 || rad > 1600) continue;
    const arriba = k.proyecta(cam, [j.x, j.y + 2.4, j.z]);
    cosas.push({
      z: p.z,
      dibuja() {
        if (arriba && arriba.z > 0.2) {
          g.strokeStyle = "rgba(255,236,210,0.55)";
          g.lineWidth = Math.max(2, rad * 0.06);
          g.beginPath();
          g.moveTo(arriba.x, arriba.y);
          g.lineTo(p.x, p.y);
          g.stroke();
        }
        muneco(g, p.x, p.y, rad, j.giro + tSpin * (0.6 + j.pal * 0.15), j.pal, j.tipo);
      },
    });
  }
  const pc = k.proyecta(cam, [0, -0.15, 1.15]);
  if (pc) {
    const s = k.tamano(4.4, pc.z) / 760;
    cosas.push({ z: pc.z, dibuja: () => cuna(g, pc.x, pc.y + 40, s) });
  }
  k.deLejosACerca(cosas);

  const rompe = k.suave(k.tramo(t, Tbe - 0.02, Tbe + 0.42));
  grietas(g, rompe);
  if (rompe > 0) {
    g.fillStyle = `rgba(255,236,228,${rompe * 0.62})`;
    g.fillRect(0, 0, 1080, 1920);
  }
  veloArriba(g, 0.78);
}
