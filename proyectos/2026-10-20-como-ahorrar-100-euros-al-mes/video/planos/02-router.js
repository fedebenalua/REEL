// «El primero, tu fibra y tu móvil: cambia de tarifa y ahorras hasta veintinueve euros al mes.»
// Un router enorme del que cae un chorro de monedas; en «cambia» entra otro por la derecha y empuja al viejo, y el
// chorro casi se acaba. En «veintinueve», la cifra.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, chorro, fondo, velo, COL, moneda, pila } from "../mundo.js";

const F = v.frase(3);
export const desde = F.inicio;

const Tcambia = F.t("cambia"), T29 = F.t("veintinueve"), Tahorras = F.t("ahorras");
const { tramo: tr, suave: su, redondo } = k;
const AC = COL.fibra;
const YR = 1180, S = 1.35; // la cara de delante del router y su escala

const cam = camino2D([[F.inicio, [1.18, 540, 1110]], [Tcambia - 0.1, [1.18, 540, 1110]], [Tcambia + 1.0, [1.0, 540, 1130]], [T29 + 0.3, [1.0, 540, 1130]], [F.fin - 0.2, [1.06, 540, 1125]]]);

// dónde está cada router (el viejo se va a la izquierda, el nuevo llega por la derecha)
const salida = (t) => su(tr(t, Tcambia - 0.05, Tcambia + 0.85));
const xViejo = (t) => 540 - 1000 * salida(t);
const xNuevo = (t) => 540 + 1000 * (1 - salida(t));

function router(g, x, y, t, nuevo, pulso = 0) {
  g.save(); g.translate(x, y); g.scale(S, S);
  const claro = nuevo ? ["#ffffff", "#e3ebf5", "#aebace"] : ["#cfc8bc", "#a69f94", "#6d675e"];
  // sombra sobre la repisa
  const sg = g.createRadialGradient(0, 120, 20, 0, 120, 380); sg.addColorStop(0, "rgba(0,0,0,0.6)"); sg.addColorStop(1, "rgba(0,0,0,0)");
  g.save(); g.translate(0, 120); g.scale(1, 0.18); g.translate(0, -120); g.fillStyle = sg; g.fillRect(-400, -280, 800, 800); g.restore();
  // antenas (detrás)
  for (const [ax, ang] of [[-235, -0.15], [0, 0], [235, 0.15]]) {
    g.save(); g.translate(ax, -100); g.rotate(ang);
    const rg = g.createLinearGradient(-22, 0, 22, 0); rg.addColorStop(0, claro[2]); rg.addColorStop(0.35, claro[0]); rg.addColorStop(1, claro[2]);
    redondo(g, -22, -300, 44, 320, 22); g.fillStyle = rg; g.fill();
    g.fillStyle = "rgba(255,255,255,0.65)"; redondo(g, -12, -282, 9, 260, 4); g.fill();
    redondo(g, -34, -34, 68, 60, 16); g.fillStyle = "#2b323d"; g.fill();
    g.restore();
  }
  // la tapa de arriba
  g.beginPath(); g.moveTo(-296, -86); g.lineTo(296, -86); g.lineTo(256, -140); g.lineTo(-256, -140); g.closePath();
  const tg = g.createLinearGradient(0, -140, 0, -86); tg.addColorStop(0, claro[0]); tg.addColorStop(1, claro[1]); g.fillStyle = tg; g.fill();
  // la cara de delante
  redondo(g, -312, -92, 624, 172, 34);
  const fg = g.createLinearGradient(0, -92, 0, 80); fg.addColorStop(0, claro[0]); fg.addColorStop(0.55, claro[1]); fg.addColorStop(1, claro[2]);
  g.fillStyle = fg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 4; redondo(g, -310, -90, 620, 168, 33); g.stroke();
  // el brillo largo
  g.fillStyle = "rgba(255,255,255,0.35)"; redondo(g, -280, -78, 560, 22, 11); g.fill();
  // las luces: pulsan despacio
  for (let i = 0; i < 4; i++) {
    const lx = -230 + i * 62, p = 0.6 + 0.4 * Math.sin(t * 2.6 + i * 1.4);
    const c = nuevo ? COL.fibra : "255,150,60";
    g.fillStyle = "#1c2230"; g.beginPath(); g.arc(lx, -10, 15, 0, 6.2832); g.fill();
    g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(${c},${0.75 * p + 0.2})`; g.beginPath(); g.arc(lx, -10, 10, 0, 6.2832); g.fill();
    g.restore(); k.brillo(g, lx, -10, 90, c, 0.5 * p);
  }
  // la ranura de la que sale el dinero
  g.fillStyle = "#06080d"; redondo(g, -130, 44, 260, 26, 13); g.fill();
  g.strokeStyle = "rgba(190,205,225,0.7)"; g.lineWidth = 4; redondo(g, -134, 41, 268, 32, 15); g.stroke();
  if (pulso > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${AC},${0.9 * pulso})`; g.lineWidth = 8; redondo(g, -142, 37, 284, 40, 19); g.stroke(); g.restore(); k.brillo(g, 0, 58, 380, AC, 0.55 * pulso); }
  g.restore();
}

export function dibuja(g, t) {
  fondo(g, AC, 1.0, 1000);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la repisa donde está
  const rg = g.createLinearGradient(0, YR + 98 * S, 0, YR + 800);
  rg.addColorStop(0, "#26334a"); rg.addColorStop(0.1, "#141c2c"); rg.addColorStop(1, "#070a12");
  g.fillStyle = rg; g.fillRect(-900, YR + 98 * S, 2900, 1400);
  g.fillStyle = "rgba(190,215,255,0.5)"; g.fillRect(-900, YR + 98 * S - 2, 2900, 4);
  // los routers
  const xv = xViejo(t), xn = xNuevo(t);
  const aV = 1 - su(tr(t, Tcambia + 0.2, Tcambia + 0.5));
  router(g, xv, YR, t, false, aV);
  if (xn < 1700) router(g, xn, YR, t, true, 0.55);
  // los chorros: el del viejo, grueso, hasta que sale; el del nuevo, un hilo que se acaba
  const envV = (tn) => 1 - su(tr(tn, Tcambia + 0.05, Tcambia + 0.35));
  const envN = (tn) => su(tr(tn, Tcambia + 0.7, Tcambia + 0.9)) * (1 - su(tr(tn, Tcambia + 1.4, Tcambia + 1.9))) * 0.38;
  chorro(g, t, { x: xv, y: YR + 58 * S }, { semilla: 31, rate: 26, r0: 40, env: envV, centroX: xv, fuerza: 0.7, color: AC, crece: 0.9 });
  // las monedas del viejo que ya no salen siguen cayendo con la repisa en su sitio: el chorro del nuevo sigue su router
  chorro(g, t, { x: xn, y: YR + 58 * S }, { semilla: 47, rate: 26, r0: 40, env: envN, centroX: xn, fuerza: 0.7, color: AC, crece: 0.9 });
  // lo que se queda: una pila de monedas que crece junto al router nuevo
  pila(g, 860, 1440, [0, 1, 2, 3, 4, 5].map((i) => Tahorras + 0.45 + i * 0.26), t, 82, 24);
  sinVista(g);
  velo(g, 0.62);
  const a = su(tr(t, T29 - 0.08, T29 + 0.2));
  k.pastilla(g, 540, 640, "−29", "€ al mes", "150,240,255", a, 100);
}
