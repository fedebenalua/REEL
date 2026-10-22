// «Así cambias la palanca: ahora solo funciona con la correa floja.»
// Otro sitio (corte en «Así»): la máquina de chicles otra vez, con una luz arriba a un lado.
// - «Así cambias la palanca»: la luz está roja y un candado cierra la palanca; la correa, tensa, tira y no pasa nada.
// - «ahora solo funciona con la correa»: la máquina tiembla y la palanca no se mueve.
// - «floja»: la correa cuelga floja, la luz se pone verde, el candado se abre y sale la bola con su hueso.
import * as k from "#kit";
import { v } from "#voz";
import { correa, sinVista, velo } from "../mundo.js";
import { CHUTE, MANIV, candado, maquina, tienda } from "../maquina.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez } = k;
const f10 = v.frase(10);
const T0 = f10.inicio, Tpal = f10.t("palanca:") ?? f10.t("palanca"), Tfloja = f10.t("floja."), Fin = f10.fin;

export function dibuja(g, t) {
  const z = Math.exp(k.claves([[T0, Math.log(1.18)], [Tpal, Math.log(1.3)], [Tfloja - 0.2, Math.log(1.42)], [Fin - 0.2, Math.log(1.28)]])(t));
  const fy = k.claves([[T0, 900], [Tpal, 1040], [Tfloja - 0.2, 1100], [Fin - 0.2, 1110]])(t);
  const fx = k.claves([[T0, 540], [Tpal, 580], [Tfloja - 0.2, 560], [Fin - 0.2, 540]])(t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  tienda(g, t);
  g.setTransform(z, 0, 0, z, 540 - fx * z, 960 - fy * z);
  const verde = su(tr(t, Tfloja, Tfloja + 0.12)), tiembla = (1 - verde) * su(tr(t, T0 + 0.3, T0 + 0.6));
  const ang = 0.035 * Math.sin(t * 44) * tiembla;
  const sale = tr(t, Tfloja + 0.2, Fin - 0.02);
  g.save();
  const sx = 3 * Math.sin(t * 38) * tiembla, sy = 1.5 * Math.sin(t * 51) * tiembla;
  g.translate(sx, sy);
  maquina(g, { t, manivela: ang, bolaCae: 0, bolaSale: su(sale), agita: 1 + 3 * tiembla, lampara: verde > 0.5 ? "verde" : "roja" });
  // la correa, atada a la palanca: tensa y vibrando, y luego floja
  const ex = MANIV[0] - 100, ey = MANIV[1];
  const tensa = 1 - su(tr(t, Tfloja - 0.05, Tfloja + 0.3));
  const ya = mez(ey + 190, ey + 70, tensa);
  correa(g, [-420, ya], [ex, ey], tensa, t, 15);
  // el candado, sobre el centro de la palanca, hasta que se abre
  const ab = su(tr(t, Tfloja + 0.05, Tfloja + 0.4)), al = 1 - su(tr(t, Tfloja + 0.3, Tfloja + 0.65));
  candado(g, MANIV[0], MANIV[1] + 8, 1.15, ab, al);
  // el destello de la luz verde
  const u = tr(t, Tfloja, Tfloja + 0.6);
  if (u > 0 && u < 1) { g.save(); g.strokeStyle = `rgba(110,255,150,${0.8 * (1 - u)})`; g.lineWidth = 10 * (1 - u) + 2; g.beginPath(); g.arc(MANIV[0] + 178, 1066, 40 + 190 * su(u), 0, Math.PI * 2); g.stroke(); g.restore(); }
  g.restore();
  sinVista(g);
  velo(g, 0.4);
}
