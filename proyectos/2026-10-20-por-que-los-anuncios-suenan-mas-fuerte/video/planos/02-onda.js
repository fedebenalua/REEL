// «La ley dice que un anuncio no puede sonar más alto que la media del programa de antes.»
// «Y casi nunca se pasa del techo: el truco está en cómo se reparte el sonido.»
// «Una película tiene susurros y explosiones; un anuncio va apretado, todo el rato pegado al techo.»
// «Lo flojo se sube hasta pegarse a lo fuerte, y a tu oído le llega como un grito.»
// La onda del sonido de la tele, dibujada en grande sobre una pantalla de osciloscopio. Se entra con un corte en «La».
// - «La ley»: la onda de la peli corre de derecha a izquierda; en «ley» bajan las dos líneas rojas del límite.
// - «Y casi nunca se pasa del techo»: entra el anuncio por la derecha; sus barras llegan al techo, pero no lo pasan;
//   en «techo», el techo brilla.
// - «Una película tiene susurros y explosiones»: dos ondas, una encima de otra: arriba la peli, con sus susurros y sus
//   explosiones; abajo el anuncio, «apretado», todo pegado al techo.
// - «Lo flojo se sube»: la onda de la peli se aprieta: las barras bajitas suben hasta las altas; «como un grito»: el
//   medidor salta al rojo.
import * as k from "#kit";
import { v } from "#voz";
import { ANUNCIO, PELI, camara, medidor, onda, techo } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
export const desde = (vz) => vz.frase(2).inicio;
const T2 = f2.inicio, Tley = f2.t("ley");
const T3 = f3.inicio, Ttec = f3.t("techo"), Trep = f3.t("reparte");
const T4 = f4.inicio, Tsus = f4.t("susurros"), Texp = f4.t("explosiones"), Tapr = f4.t("apretado");
const T5 = f5.inicio, Tsub = f5.t("sube"), Tfue = f5.t("fuerte"), Toid = f5.t("oido"), Tgri = f5.t("grito"), Fin = v.frase(6).inicio;
const X0 = 70, X1 = 1010, N = 60;

// la serie que se ve: la peli y, desde T3, el anuncio que entra por la derecha
function mezcla(t) {
  const corre = (t - T2) * 18, entraAn = (t - T3 + 0.3) * 40;
  const borde = N - Math.max(0, entraAn);
  return Array.from({ length: N }, (_, i) => (i < borde ? PELI[Math.floor(corre + i) % PELI.length] : ANUNCIO[Math.floor(corre + i) % ANUNCIO.length]));
}

export function dibuja(g, t) {
  // la pantalla del osciloscopio
  const fg = g.createRadialGradient(540, 1000, 100, 540, 1000, 1200); fg.addColorStop(0, "#0e2a24"); fg.addColorStop(1, "#04100e");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.strokeStyle = "rgba(90,255,180,0.08)"; g.lineWidth = 2;
  for (let x = 0; x <= 1080; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke(); }
  for (let y = 0; y <= 1920; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  const dos = su(tr(t, T4 - 0.2, T4 + 0.4)) * (1 - su(tr(t, T5 - 0.3, T5 + 0.2)));
  const cam = { Z: 1 + 0.06 * Math.sin((t - T2) * 0.5), F: { x: 540, y: 980 } };
  g.save(); camara(g, cam);
  // una onda (frases 2, 3 y 5)
  const una = 1 - dos;
  if (una > 0.01) {
    const yc = 1000, h = 300;
    if (t < T5) onda(g, mezcla(t), 0, N, X0, X1, yc, h, "90,255,180", 0, una);
    else onda(g, PELI, (t - T2) * 18, N, X0, X1, yc, h, "255,180,90", su(tr(t, Tsub - 0.1, Tfue + 0.2)), una);
    techo(g, X0 - 20, X1 + 20, yc, h * 1.0, su(tr(t, Tley - 0.15, Tley + 0.2)) * una, "límite", k.pulso(t, Ttec + 0.1, 0.3));
  }
  // dos ondas (frase 4)
  if (dos > 0.01) {
    const h = 190;
    onda(g, PELI, (t - T2) * 18, N, X0, X1, 820, h, "90,255,180", 0, dos);
    onda(g, ANUNCIO, (t - T2) * 18, N, X0, X1, 1300, h, "255,120,140", 0, dos);
    techo(g, X0 - 20, X1 + 20, 820, h, dos, "peli");
    techo(g, X0 - 20, X1 + 20, 1300, h, dos, "anuncio");
    g.save(); g.globalAlpha = dos;
    k.etiqueta(g, 120, 900, "susurros", "160,255,200", su(tr(t, Tsus - 0.1, Tsus + 0.15)), 40);
    k.etiqueta(g, 640, 900, "explosiones", "255,220,120", su(tr(t, Texp - 0.1, Texp + 0.15)), 40);
    k.etiqueta(g, 380, 1380, "apretado", "255,150,170", su(tr(t, Tapr - 0.1, Tapr + 0.15)), 48);
    g.restore();
  }
  g.restore();
  // el medidor: salta al rojo en «grito»
  const med = su(tr(t, Toid - 0.3, Toid)) * (1 - su(tr(t, Fin - 0.4, Fin - 0.1)));
  medidor(g, 540, 1500, 180, mez(0.45, 0.96, entra(tr(t, Tgri - 0.15, Tgri + 0.15))) + 0.02 * Math.sin(t * 30), med);
  if (med > 0) k.brillo(g, 540, 1400, 600, "255,60,70", 0.4 * k.pulso(t, Tgri + 0.1, 0.3) * med);
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(4,16,14,0.6)"); vg.addColorStop(1, "rgba(4,16,14,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export const momentos = { ley: Tley, grito: Tgri };
