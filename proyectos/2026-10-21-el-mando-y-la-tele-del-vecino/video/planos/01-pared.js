// «Your TV remote was almost going to change the channel next door.»
// Dos salones. Fotograma 0: la cámara ya va lanzada, la tele llena la pantalla y la onda cian la cruza.
// En «door» se ven las dos. En «wall» la onda atraviesa el muro. En «press» un dedo hunde el botón
// y en «both» las dos teles cambian a la vez. Antes del corte, la onda se ha apagado y la cámara está quieta.
import * as k from "#kit";
import { v } from "#voz";
import { CIAN, anillos, casas, proy, velo } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2);
const Tdoor = f1.t("door"), Twall = f2.t("wall"), Tpress = f2.t("press"), Tboth = f2.t("both");

const camViaje = k.ruta([
  [0, { pos: [-1.7, 1.5, 2.15], mira: [-1.55, 1.35, 0] }],
  [0.9, { pos: [1.7, 1.48, 2.15], mira: [1.55, 1.32, 0] }],
  [2.5, { pos: [0.05, 1.6, 4.15], mira: [0, 1.25, 0] }],
  [Tdoor, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
  [Twall - 0.05, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
  [Tpress + 0.15, { pos: [-1.05, 0.85, 2.15], mira: [-1.15, 0.62, 1.15] }],
  [Tboth + 0.4, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
  [8.75, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
  [9.1, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
]);

const camImpacto = k.ruta([
  [0, { pos: [0, 1.5, 3.35], mira: [0.05, 1.25, 0] }],
  [0.7, { pos: [1.65, 1.4, 2.05], mira: [1.55, 1.32, 0] }],
  [2.15, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
  [Twall - 0.05, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
  [Tpress + 0.15, { pos: [-1.05, 0.85, 2.15], mira: [-1.15, 0.62, 1.15] }],
  [Tboth + 0.4, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
  [8.75, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
  [9.1, { pos: [0, 1.58, 4.05], mira: [0, 1.28, 0] }],
]);

function canal(t, lado) {
  if (t < 2.65) return Math.floor(t / 0.18) % 5;
  let c = lado === "L" ? 0 : 3;
  if (t >= Tboth - 0.02) c = (c + 2) % 5;
  return c;
}

function ondas(t, modo) {
  const out = [];
  const add = (t0, vel, rmax, r0) => {
    if (t < t0) return;
    const u = (t - t0) / vel;
    if (u > 1.2) return;
    const crece = 1 - Math.exp(-u * 2.4);
    out.push({ r: r0 + crece * rmax, al: Math.max(0, 1 - Math.pow(Math.max(0, u - 0.15) / 0.9, 1.4)) });
  };
  if (modo === "impacto") add(-0.28, 0.95, 3.1, 1.1);
  else add(-0.12, 0.7, 2.6, 0.85);
  add(Twall - 0.55, 0.85, 2.5, 0.2);
  add(Tpress - 0.02, 0.62, 2.3, 0.15);
  return out;
}

export function dibujaCon(g, t, modo) {
  const cam = (modo === "impacto" ? camImpacto : camViaje)(t);
  const lista = ondas(t, modo);
  let grieta = 0;
  for (const o of lista) if (o.r > 1.25) grieta = Math.max(grieta, o.al * Math.min(1, (o.r - 1.25) / 0.45));
  const pulsa = Math.min(1, k.pulso(t, Tpress + 0.06, 0.09) * 1.3 + (t < 1.1 ? 0.25 : 0));
  casas(g, cam, {
    t, canalL: canal(t, "L"), canalR: canal(t, "R"), estilo: 1,
    radio: true, pulsa, grieta, muteL: 0,
  });
  const origen = proy(cam, [-1.15, 0.62, 1.15]);
  const lado = proy(cam, [-0.15, 0.62, 1.15]);
  if (origen && lado) {
    const px = Math.hypot(lado.x - origen.x, lado.y - origen.y);
    for (const o of lista) anillos(g, origen.x, origen.y, o.r * px, CIAN, Math.min(1, o.al * 1.35), 4);
  }
  // En el primer segundo la onda va de tu tele a la del vecino, grande, aunque el mando quede abajo.
  if (t < 2.2) {
    const u = k.suave(k.tramo(t, 0, 0.95));
    const al = 0.85 * (1 - k.suave(k.tramo(t, 1.35, 2.15)));
    anillos(g, k.mez(240, 820, u), k.mez(980, 900, u), 260 + u * 520, CIAN, al, 4);
  }
  // estelas del viaje, solo el primer segundo
  if (modo !== "impacto" && t < 1.05) {
    const c0 = camViaje(t - 1 / 50), c1 = cam;
    const d = k.res(c1.p, c0.p);
    g.save(); g.globalCompositeOperation = "lighter";
    const al = 0.35 * (1 - k.suave(k.tramo(t, 0.65, 1.05)));
    g.strokeStyle = `rgba(${CIAN},${al})`; g.lineWidth = 4; g.lineCap = "round";
    const az = k.azar(4);
    for (let i = 0; i < 18; i++) {
      const x = 80 + az() * 920, y = 500 + az() * 1100;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x - d[0] * 90, y + d[1] * 40); g.stroke();
    }
    g.restore();
  }
  velo(g, 0.78);
}

export function dibuja(g, t) { dibujaCon(g, t, "viaje"); }
