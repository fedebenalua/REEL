// «Quería la misma medida para todos, no el ojo de un médico. Con Simon, las mismas tareas para cada niño,
// una por una. Cada tarea llevaba la edad en la que la mayoría ya la resolvía.»
// Tres tarjetas iguales, el ojo que se cierra, y en el tapete el cuadrado, los cubos y la pizarra, cada uno con su edad.
import * as k from "#kit";
import { v } from "#voz";
import { cubo, edad, ojo, pizarra, tarjeta, velo } from "../mundo.js";

export const desde = "queria";

const f4 = v.frase(4);
const f5 = v.frase(5);
const Tojo = f4.t("ojo");
const Tmed = f4.t("medico");
const Tno = f4.t("no");
const Tsimon = f5.t("simon");
const Ttareas = f5.t("tareas");
const Tcada = f5.t("cada");
const Tuna = f5.t("una");
const Tedad = v.t("edad");
const Tmay = v.t("mayoria");
const Tres = v.t("resolvia");
const Tcorte = v.t("salio") - 0.06;

function fondo(g, t) {
  const h = g.createLinearGradient(0, 0, 0, 1920);
  h.addColorStop(0, "#06262c");
  h.addColorStop(0.4, "#0e4a52");
  h.addColorStop(1, "#071418");
  g.fillStyle = h;
  g.fillRect(0, 0, 1080, 1920);
  // tapete
  const baja = k.suave(k.tramo(t, Tmed, Tsimon + 0.3));
  const y0 = k.mez(1500, 860, baja);
  g.fillStyle = "#0f6a45";
  k.redondo(g, 60, y0, 960, 900, 40);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.06)";
  g.fillRect(110, y0 + 70, 860, 18);
}

function tarjetaIgual(g, x, y, s) {
  k.redondo(g, x - s * 0.55, y - s * 0.7, s * 1.1, s * 1.4, 16);
  g.fillStyle = "#fff6e4";
  g.fill();
  g.strokeStyle = "#1f7a72";
  g.lineWidth = 8;
  g.stroke();
  g.strokeStyle = "#1f7a72";
  g.lineWidth = 6;
  g.strokeRect(x - s * 0.28, y - s * 0.22, s * 0.56, s * 0.5);
}

export function dibuja(g, t) {
  fondo(g, t);
  // tres medidas iguales
  const llega = (i) => k.entra(k.tramo(t, v.t("misma") - 0.2 + i * 0.18, v.t("todos") - 0.05 + i * 0.12));
  for (let i = 0; i < 3; i++) {
    const u = llega(i);
    const x = k.mez(-120, 220 + i * 280, u);
    const y = k.mez(700, 780, u);
    const seVan = 1 - k.suave(k.tramo(t, Tmed + 0.15, Tsimon + 0.35));
    if (u > 0.01 && seVan > 0.02) {
      g.save();
      g.globalAlpha = seVan;
      tarjetaIgual(g, x, y, 150);
      g.restore();
    }
  }
  // el ojo
  const crece = k.entra(k.tramo(t, Tno - 0.05, Tojo + 0.15));
  const cierra = k.suave(k.tramo(t, Tojo, Tmed + 0.45));
  const seVa = k.suave(k.tramo(t, Tmed + 0.35, Tsimon + 0.15));
  if (crece > 0.02 && seVa < 0.98) {
    g.save();
    g.globalAlpha = 1 - seVa;
    const r = k.mez(40, 340, crece) * (1 - seVa * 0.3);
    ojo(g, 540, k.mez(1100, 980, crece) - seVa * 500, r, cierra);
    g.restore();
  }
  // manguito de Simon y las tres tareas
  const enMesa = k.suave(k.tramo(t, Tsimon - 0.1, Tsimon + 0.45));
  if (enMesa > 0.02) {
    const objetos = [
      { a: Ttareas - 0.25, b: Ttareas + 0.15, x: 250, dibuja: (x, y) => tarjeta(g, x, y, 190, 1) },
      { a: Tcada - 0.2, b: Tcada + 0.2, x: 530, dibuja: (x, y) => { cubo(g, x - 70, y - 30, 96); cubo(g, x + 8, y - 8, 108); cubo(g, x + 78, y + 14, 88); } },
      { a: Tuna - 0.15, b: Tuna + 0.25, x: 800, dibuja: (x, y) => pizarra(g, x, y, 145) },
    ];
    objetos.forEach((o) => {
      const u = k.entra(k.tramo(t, o.a, o.b));
      if (u <= 0.02) return;
      const y = k.mez(480, 1120, u);
      g.save();
      g.globalAlpha = Math.min(1, u * 1.6);
      o.dibuja(o.x, y);
      g.restore();
    });
    // edades: 3, 5 y 7 ilustran la escala por edades, no la clave histórica de cada prueba
    const marcas = [
      { t0: Tedad, n: 3, x: 250 },
      { t0: Tmay, n: 5, x: 530 },
      { t0: Tres, n: 7, x: 800 },
    ];
    for (const m of marcas) {
      const al = k.suave(k.tramo(t, m.t0 - 0.35, m.t0 + 0.2));
      const y = k.mez(360, 800, al);
      edad(g, m.x, y, m.n, Math.min(1, al * 1.4), 84);
    }
  }
  // que no cruce el corte: todo quieto al final
  if (t > Tcorte - 0.25) {
    // nada nuevo; las edades ya están
  }
  velo(g, 0.72);
}
