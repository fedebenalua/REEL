// «Y además, el móvil no se pierde entre los cojines del sofá, ni gasta pilas.»
// El sofá, de frente. Se entra con un corte en «Y».
// - «Y además»: el sofá; el mando, encima del cojín, junto a la raja; el móvil, en el brazo, encendido.
// - «se pierde entre los cojines»: el mando resbala hacia la raja y desaparece dentro.
// - «ni gasta pilas»: de debajo del sofá sale rodando una pila vacía.
import * as k from "#kit";
import { v } from "#voz";
import { MANDO, appMando, mando, movil, pila, sofa } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, sale } = k;
const f8 = v.frase(8);
export const desde = (vz) => vz.frase(8).inicio;
const T0 = f8.inicio, Tpie = f8.t("pierde"), Tcoj = f8.t("cojines"), Tgas = f8.t("gasta"), Fin = v.frase(9).inicio;
const SX = 540, SY = 1180, SW = 880;

export function dibuja(g, t) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#1c1530"); fg.addColorStop(0.7, "#2a1d3d"); fg.addColorStop(1, "#140e22");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  // la luz azul de la tele, desde delante
  k.brillo(g, 540, 1000, 2000, "120,150,255", 0.35);
  g.fillStyle = "#1a1220"; g.fillRect(0, 1460, 1080, 460);
  sofa(g, SX, SY, SW, t);
  // el mando: resbala hacia la raja y se hunde (se recorta por el borde del cojín)
  const res = su(tr(t, Tpie - 0.3, Tpie + 0.2)), hunde = sale(tr(t, Tpie + 0.1, Tcoj + 0.3));
  const mx = mez(SX - 150, SX, res), my = SY - 40 + hunde * 380;
  g.save(); g.beginPath(); g.rect(0, 0, 1080, SY - 10); if (hunde <= 0) g.rect(0, SY - 10, 1080, 1000); g.clip();
  g.save(); g.translate(mx, my); g.rotate(mez(1.35, 1.57, res)); g.scale(0.62, 0.62); g.translate(-540, -960);
  mando(g, { x: 0, y: 0, z: 0 }, t, {}, { X: 0, Y: 0, Z: 10, ang: 0 });
  g.restore(); g.restore();
  // el móvil, a salvo en el brazo del sofá
  movil(g, SX + SW * 0.42, SY - 250, 210, 0.12, appMando(0.4 * k.pulso(t, Tcoj + 0.3, 0.2)));
  // la pila vacía que sale rodando
  const rueda = entra(tr(t, Tgas - 0.1, Tgas + 0.6));
  if (rueda > 0) pila(g, mez(200, 380, rueda), 1560, 380, rueda * 4, 0.06, t);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(12,8,22,0.6)"); vg.addColorStop(1, "rgba(12,8,22,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}

export const momentos = { pierde: Tpie, pila: Tgas };
