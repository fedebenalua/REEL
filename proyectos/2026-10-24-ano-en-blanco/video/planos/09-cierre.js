// «No es que no te pasara nada...» y el cierre. La cuna viva, la página en blanco,
// y la cámara sale entre los muñecos hasta el mismo vuelo del principio.
import * as k from "#kit";
import { v } from "#voz";
import { JUGUETES, cuarto, cuna, muneco, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio;
const f11 = v.frase(11), f12 = v.frase(12);
const This = f11.t("historia"), Tcuna = f12.t("cuna");

export function dibuja(g, t) {
  const vuelo = k.suave(k.tramo(t, f12.inicio - 0.05, f12.fin - 0.15));
  // de la cuna quieta al mismo encuadre del fotograma 0 (cámara en z = 24)
  const zCam = k.mez(7.2, 24, vuelo);
  const dia = 1 - vuelo * 0.35;
  const cam = k.mira([0, 1.55, zCam], [0, 1.15, zCam - 16]);
  cuarto(g, dia);

  const cosas = [];
  const pc = k.proyecta(cam, [0, -0.15, 1.15]);
  if (pc) {
    const s = k.tamano(4.4, pc.z) / 760;
    cosas.push({ z: pc.z, dibuja: () => cuna(g, pc.x, pc.y + 40, Math.max(0.15, s)) });
  }
  for (const j of JUGUETES) {
    const p = k.proyecta(cam, [j.x, j.y, j.z]);
    if (!p || p.z < 0.2) continue;
    const rad = k.tamano(j.s, p.z);
    if (rad < 4 || rad > 1600) continue;
    const arriba = k.proyecta(cam, [j.x, j.y + 2.4, j.z]);
    cosas.push({
      z: p.z,
      dibuja() {
        if (arriba) {
          g.strokeStyle = "rgba(255,236,210,0.55)";
          g.lineWidth = Math.max(2, rad * 0.06);
          g.beginPath();
          g.moveTo(arriba.x, arriba.y);
          g.lineTo(p.x, p.y);
          g.stroke();
        }
        const brilloExtra = j.tipo === "estrella" && j.pal === 0 ? k.pulso(t, Tcuna, 0.12) : 0;
        muneco(g, p.x, p.y, rad * (1 + 0.08 * brilloExtra), j.giro + Math.min(t, This + 0.2) * 0.35, j.pal, j.tipo);
        if (brilloExtra > 0.05) {
          g.save();
          g.globalCompositeOperation = "lighter";
          k.brillo(g, p.x, p.y, rad * 3, "amarilla", brilloExtra);
          g.restore();
        }
      },
    });
  }
  k.deLejosACerca(cosas);

  // la página en blanco sube en «historia» y se va cuando arranca el vuelo
  const sube = k.entra(k.tramo(t, This - 0.12, This + 0.45));
  const seVa = k.suave(k.tramo(t, f12.inicio, f12.inicio + 0.45));
  const al = sube * (1 - seVa);
  if (al > 0.02) {
    g.save();
    g.globalAlpha = al;
    const y = k.mez(1680, 760, sube);
    const x = 300;
    k.redondo(g, x, y, 480, 620, 16);
    g.fillStyle = "#fff8f0";
    g.fill();
    g.fillStyle = "#e23a4a";
    g.fillRect(x, y, 26, 620);
    g.restore();
  }
  veloArriba(g, 0.78);
}
