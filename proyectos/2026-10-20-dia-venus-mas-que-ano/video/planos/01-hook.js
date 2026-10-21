// «¿Sabías que en Venus un día dura más que un año?»
// Venus enorme, girando al revés, con el Sol brillando al fondo. Una cámara que se acerca un poco.
// - desde el principio: Venus gira y dos anillos van llenándose a la vez, el del AÑO (azul, más rápido) y el del DÍA (naranja).
// - «año»: el anillo del año se cierra con un fogonazo, y el del día aún sigue; se cierra un instante después.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, espacio, sol, venusLado, marca, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f = v.frase(1);
const Tano = f.t("ano"), FIN = v.frase(2).inicio;
const CY = 40, R = 340;
const TA = Tano + 0.15, TD = FIN - 0.22;                   // cuándo se cierran el del año y el del día
const cam = camino2D([[0, [1.0, 0, CY]], [FIN, [1.07, 0, CY]]]);

function anillo(g, R, p, col, grosor) {
  if (p <= 0.001) return;
  g.save(); g.lineCap = "round";
  g.strokeStyle = `rgba(${col},0.18)`; g.lineWidth = grosor; g.beginPath(); g.arc(0, CY, R, 0, 6.2832); g.stroke();
  const fin = Math.min(p, 0.9995) * 6.2832 - Math.PI / 2;
  g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${col},0.35)`; g.lineWidth = grosor * 2.4; g.beginPath(); g.arc(0, CY, R, -Math.PI / 2, fin); g.stroke();
  g.globalCompositeOperation = "source-over"; g.strokeStyle = `rgb(${col})`; g.lineWidth = grosor; g.beginPath(); g.arc(0, CY, R, -Math.PI / 2, fin); g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  espacio(g, 1);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // el Sol, grande, a un lado
  sol(g, -600, -400, 300, t, 0.5);
  // Venus, girando al revés
  const gira = 0.1 + t * 0.14;
  venusLado(g, 0, CY, R, gira, -1, -0.45);
  marca(g, 0, CY, R, 1.15 - gira * 4);
  // los dos anillos
  const pa = su(tr(t, 0.9, TA)), pd = su(tr(t, 0.9, TD) * 0.96 + 0.04 * tr(t, 0.9, TD));
  anillo(g, R + 62, pa, "90,200,255", 22);
  anillo(g, R + 112, tr(t, 0.9, TD), "255,140,60", 22);
  // el fogonazo del año al cerrarse
  const ff = k.pulso(t, TA + 0.05, 0.14);
  if (ff > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, CY, 1100, "120,210,255", 0.7 * ff); g.restore(); }
  sinVista(g);
  // las dos etiquetas
  const la = su(tr(t, 0.9, 1.2));
  k.etiqueta(g, 70, 1560, "AÑO", "90,200,255", la, 62);
  k.etiqueta(g, 70, 1680, "DÍA", "255,140,60", la, 62);
  velo(g, 0.45);
  vineta(g, 0.5);
}

export const momentos = { ano: Tano };
