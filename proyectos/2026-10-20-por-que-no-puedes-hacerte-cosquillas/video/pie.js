// El sitio del pie: la planta enorme, las dos manos con su pluma (la tuya, con el pijama; la del otro, con la sudadera
// roja) y las chispas. Lo usan el hook (planos/01-pie.js) y el final (planos/06-final.js).
// Cada mano se describe con una lista de tramos: cuándo entra, cuándo hace cosquillas, cuándo se va.
import * as k from "#kit";
import { pie, pluma, puno, chispas, puntaPluma, fondoSalon, vista, sinVista } from "./mundo.js";

const { suave: su, tramo: tr, mez } = k;
export const L = 1050, CURVA = 0.12;
// dónde descansa cada puño (en el mundo del pie) y hacia dónde apunta su pluma
const CASA = { pijama: { x: 330, y: 420, a: -0.42, fuera: [1000, 1250] }, roja: { x: -330, y: 420, a: 0.42, fuera: [-1000, 1250] } };

// presencia(t): de 0 (fuera) a 1 (en su sitio); barre(t): de 0 a 1, cuánto se mueve haciendo cosquillas.
// Se monta con tramos [entra0, entra1, sale0, sale1] y [barre0, barre1].
export function hacerMano(quien, { esta = [], barre = [] }) {
  const presencia = (t) => { let p = 0; for (const [a, b, c, d] of esta) p = Math.max(p, su(tr(t, a, b)) * (1 - su(tr(t, c, d)))); return p; };
  const barrido = (t) => { let p = 0; for (const [a, b] of barre) p = Math.max(p, su(tr(t, a, a + 0.18)) * (1 - su(tr(t, b - 0.25, b)))); return p; };
  const c = CASA[quien], lado = quien === "roja" ? -1 : 1;
  // la pose en el segundo t: el puño (x, y) y el ángulo de la pluma
  const pose = (t) => {
    const p = presencia(t), b = barrido(t), f = 2 * Math.PI * 3.3 * t;
    const x = mez(c.fuera[0], c.x, p) + b * 90 * Math.sin(f), y = mez(c.fuera[1], c.y, p) + b * 70 * Math.sin(f * 2 + 1);
    return { x, y, a: c.a + b * 0.16 * Math.sin(f + 0.6), p, b };
  };
  const punta = (t) => { const o = pose(t), [px, py] = puntaPluma(L, CURVA * lado, 0.95), ca = Math.cos(o.a), sa = Math.sin(o.a); return [o.x + px * ca - py * sa, o.y + px * sa + py * ca]; };
  const dibuja = (g, t) => {
    const o = pose(t); if (o.p <= 0.001) return;
    g.save(); g.translate(o.x, o.y);
    g.save(); g.rotate(o.a); pluma(g, t, L, CURVA * lado, 0.3 + o.b, 1); g.restore();
    g.save(); if (lado < 0) g.scale(-1, 1); puno(g, quien, 1.25, lado * o.a * 0.4); g.restore();
    g.restore();
  };
  return { pose, punta, dibuja, presencia, barrido };
}

// Todo el sitio en el segundo t: cam = [Z, cx, cy]; manos: las que salen; cosquillas(ts): de 0 a 1, cuántas chispas
// salen en ts y de qué mano (devuelve [cuánto, mano]); retuerce: de 0 a 1, el pie entero se retuerce.
export function escenaPie(g, t, cam, manos, { cosquillas, retuerce = 0, encoge = 0, agita = 0, extra } = {}) {
  fondoSalon(g, t, -cam[1] * cam[0] * 0.2, -cam[2] * cam[0] * 0.2);
  vista(g, cam[0], cam[1], cam[2]);
  // el pie, que se retuerce (gira y se encoge un poco)
  const rt = retuerce * (Math.sin(t * 13) * 0.6 + Math.sin(t * 21) * 0.4);
  g.save(); g.translate(0, 300); g.rotate(rt * 0.06); g.scale(1 - retuerce * 0.03, 1 - retuerce * 0.04); g.translate(rt * 18, -300);
  pie(g, t, { encoge, agita });
  g.restore();
  if (extra) extra(g, t);
  for (const m of manos) m.dibuja(g, t);
  if (cosquillas) {
    for (const [i, m] of manos.entries()) chispas(g, t, (ts) => m.punta(ts), (ts) => cosquillas(ts, i), { escala: 1.3, sem: 11 + i * 17 });
  }
  sinVista(g);
}
