// «Para él es como una máquina de chicles: tira de la palanca, y sale lo que quiere.»
// Otro sitio (corte en «Para»): una máquina de chicles enorme, de cristal y metal.
// - «Para él es como una máquina de chicles»: la máquina entera, con las bolas moviéndose dentro; la cámara se acerca.
// - «tira de la palanca»: la correa, atada a la palanca, tira de ella y la hace girar; baja la cámara hasta ella.
// - «sale lo que quiere»: una bola baja por dentro, sale por la trampilla y viene a cámara con un hueso dibujado.
import * as k from "#kit";
import { v } from "#voz";
import { correa, sinVista, velo } from "../mundo.js";
import { CHUTE, MANIV, maquina, tienda } from "../maquina.js";

export const desde = (vz) => vz.frase(6).inicio;

const { suave: su, tramo: tr, mez } = k;
const f6 = v.frase(6);
const T0 = f6.inicio, Ttira = f6.t("tira"), Tpal = f6.t("palanca"), Tsale = f6.t("sale"), Tquiere = f6.t("quiere"), Fin = f6.fin;

export const gira = (t) => -1.75 * su(tr(t, Ttira - 0.02, Ttira + 0.75));
export function dibuja(g, t) {
  // la cámara: de la máquina entera a la palanca y luego a la trampilla
  const z = Math.exp(k.claves([[T0, Math.log(1.2)], [Ttira - 0.25, Math.log(1.3)], [Tpal + 0.25, Math.log(1.5)], [Tsale - 0.05, Math.log(1.5)], [Tquiere + 0.15, Math.log(1.28)]])(t));
  const fx = 540, fy = k.claves([[T0, 900], [Ttira - 0.25, 960], [Tpal + 0.25, 1170], [Tsale - 0.05, 1185], [Tquiere + 0.15, 1110]])(t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  tienda(g, t);
  g.setTransform(z, 0, 0, z, 540 - fx * z, 960 - fy * z);
  const ang = gira(t);
  const cae = tr(t, Tpal + 0.35, Tsale - 0.05), sale = tr(t, Tsale - 0.02, Tquiere + 0.18);
  maquina(g, { t, manivela: ang, bolaCae: cae, bolaSale: su(sale), agita: 1 + 4 * k.pulso(t, Tpal + 0.2, 0.5) });
  // la correa, atada al extremo izquierdo de la palanca
  const ex = MANIV[0] - 100 * Math.cos(ang), ey = MANIV[1] - 100 * Math.sin(ang);
  const tensa = su(tr(t, Ttira - 0.1, Ttira + 0.15));
  correa(g, [-420, ey + 55 + 60 * (1 - tensa)], [ex, ey], tensa, t, 15);
  sinVista(g);
  velo(g, 0.4);
}

export const momentos = { gira: Ttira, sale: Tsale };
