// Lo que ve tu gato: el salón desde el suelo, contigo de pie y la mano tendida. Sigue sin corte de la pupila de 01-ojo.
// - «Para empezar»: nítido, como lo ves tú. «borroso»: todo se emborrona. «ve unas seis veces menos detalle»: la
//   cámara sube hasta tu cara, que ya es una mancha; «que tú»: vuelve a verte entero.
// - «El azul lo ve bien»: un brillo recorre los vaqueros. «rojo»: el jersey se apaga a un marrón verdoso. «verde»: la
//   planta se vuelve del mismo color.
// - «apaga la luz»: la lámpara se apaga y todo queda negro (como lo verías tú). «gana él»: el salón sale de lo negro,
//   azul y sin color, como lo ve él; mientras dice «seis veces menos luz», tú le saludas con la mano, y él lo ve.
import * as k from "#kit";
import { v } from "#voz";
import { vistaGato } from "../salon.js";

export const desde = "para";
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, pulso } = k;
const f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const Tborr = f2.t("borroso"), Tve = f2.t("ve"), Ttu = f2.t("tu");
const Tazul = f3.t("azul"), Trojo = f3.t("rojo"), Tverde = f3.t("verde");
const Tapaga = f4.t("apaga"), Tgana = f4.t("gana"), Tle = f4.t("le"), Fin4 = f4.fin;
export const apagon = Tapaga + 0.12;

const Tbien = f3.t("bien"), Tconf = f3.t("confunde"), Tapag = f4.t("apaga");
const Zc = k.claves([[0, 1], [f2.inicio, 1], [Tborr + 0.3, 1.05], [Tve, 1.06], [Tve + 1.1, 1.95], [Ttu - 0.15, 2.0], [Tazul + 0.1, 1.35], [Tbien + 0.2, 1.35], [Trojo + 0.2, 1.3], [Tverde + 0.2, 1.3], [Tconf + 0.3, 1.0], [Tapag, 1.0], [Tle, 1], [Fin4 - 0.2, 1.55], [Fin4 + 0.2, 1.56]]);
const Yc = k.claves([[0, 960], [Tve, 960], [Tve + 1.1, 700], [Ttu - 0.15, 690], [Tazul + 0.1, 1450], [Tbien + 0.2, 1440], [Trojo + 0.2, 1050], [Tverde + 0.2, 1080], [Tconf + 0.3, 960], [Tle, 960], [Fin4 - 0.2, 1050], [Fin4 + 0.2, 1050]]);
const Xc = k.claves([[0, 540], [Trojo + 0.2, 520], [Tverde + 0.2, 720], [Tconf + 0.3, 540], [Tle, 540], [Fin4 - 0.2, 470], [Fin4 + 0.2, 470]]);

export function dibuja(g, t) {
  const borroso = su(tr(t, Tborr - 0.05, Tborr + 0.45));
  const rojo = su(tr(t, Trojo - 0.05, Trojo + 0.45)), verde = su(tr(t, Tverde - 0.05, Tverde + 0.45));
  const luz = 1 - tr(t, apagon, apagon + 0.06), oscuro = su(tr(t, apagon, apagon + 0.1));
  const noche = k.entra(tr(t, Tgana - 0.05, Tgana + 0.7));
  const saluda = Math.max(0, t - Tle) * (t < Fin4 - 0.4 ? 1 : 0);
  vistaGato(g, t, { Z: Zc(t), cx: Xc(t), cy: Yc(t), borroso, rojo, verde, luz, oscuro, noche, saluda: saluda > 0 ? saluda : 0, mano: 1 });
  // «El azul lo ve bien»: un brillo azul recorre los vaqueros
  const u = tr(t, Tazul - 0.05, Tazul + 0.7);
  if (u > 0 && u < 1) k.brillo(g, mez(200, 880, su(u)), 1350, 1300, "110,160,255", 0.6 * Math.sin(u * Math.PI));
  // la bombilla que se apaga: lo último que brilla antes del negro
  if (t > apagon && t < apagon + 0.7) k.brillo(g, 900, 570, 160, "255,170,90", 0.6 * (1 - tr(t, apagon, apagon + 0.7)) * (1 - noche));
}
