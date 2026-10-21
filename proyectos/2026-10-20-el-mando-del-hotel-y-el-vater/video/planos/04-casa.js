// «Y el de tu casa va de mano en mano: del sofá a la cocina, y vuelta.»
// Tu casa vista desde arriba: el sofá abajo y la cocina arriba. Se entra con un corte en «Y».
// - «de mano en mano»: el mando, en el sofá, gira de un sitio a otro, y le salen huellas.
// - «del sofá a la cocina»: viaja por el pasillo hasta la encimera, junto a la sartén; «y vuelta»: vuelve al sofá,
//   cada vez con más huellas.
import * as k from "#kit";
import { v } from "#voz";
import { huella, mando } from "../mundo.js";

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6);
export const desde = (vz) => vz.frase(6).inicio;
const T0 = f6.inicio, Tman = f6.t("mano"), Tsof = f6.t("sofa"), Tcoc = f6.t("cocina"), Tvue = f6.t("vuelta"), Fin = v.frase(7).inicio;
const azH = azar(15);
const COLORES = ["255,90,120", "90,200,255", "255,200,60", "140,255,120"];
const HUELLAS = Array.from({ length: 14 }, (_, i) => ({ x: (azH() - 0.5) * 100, y: (azH() - 0.5) * 420, a: azH() * 6.28, c: COLORES[i % 4], t: mez(Tman - 0.2, Tvue + 0.4, i / 14) }));

export function dibuja(g, t) {
  // el suelo de casa y las paredes, en plano
  g.fillStyle = "#e8d8bc"; g.fillRect(0, 0, 1080, 1920);
  g.strokeStyle = "rgba(0,0,0,0.06)"; g.lineWidth = 2; for (let x = 0; x < 1080; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke(); }
  g.fillStyle = "#4a3a30"; g.fillRect(0, 900, 380, 30); g.fillRect(700, 900, 380, 30);
  // la cocina arriba: la encimera, los fuegos y la sartén
  g.fillStyle = "#c8ccd4"; g.fillRect(80, 470, 920, 260); g.fillStyle = "#2a2a30"; for (const x of [640, 820]) { g.beginPath(); g.arc(x, 600, 60, 0, 6.2832); g.fill(); }
  g.fillStyle = "#3a3a40"; g.beginPath(); g.arc(640, 600, 70, 0, 6.2832); g.fill(); g.fillStyle = "#555"; g.fillRect(700, 590, 130, 20);
  g.fillStyle = "#e8a04a"; g.beginPath(); g.arc(640, 600, 40, 0, 6.2832); g.fill();
  g.fillStyle = "#8ac0e8"; g.fillRect(140, 520, 280, 160); g.fillStyle = "#c8e4f4"; g.fillRect(160, 540, 240, 120);
  // el sofá abajo y la alfombra
  g.fillStyle = "#4a7ab8"; k.redondo(g, 200, 1300, 680, 260, 50); g.fill();
  g.fillStyle = "#5a8ac8"; k.redondo(g, 250, 1320, 280, 200, 30); g.fill(); k.redondo(g, 550, 1320, 280, 200, 30); g.fill();
  g.fillStyle = "#3a6aa8"; k.redondo(g, 170, 1470, 740, 110, 40); g.fill();
  // el mando: del sofá a la cocina y vuelta
  const ida = su(tr(t, Tsof - 0.1, Tcoc + 0.1)), vuelta = su(tr(t, Tvue - 0.2, Tvue + 0.4));
  const x = mez(mez(420, 460, ida), 420, vuelta), y = mez(mez(1420, 640, ida), 1420, vuelta), ang = mez(1.0, 2.4, ida) + mez(0, 1.8, vuelta) + 0.3 * Math.sin(t * 6) * su(tr(t, T0, Tman + 0.3)) * (1 - su(tr(t, Tman + 0.3, Tsof)));
  mando(g, x, y, 90, ang);
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(0.6, 0.6);
  for (const h of HUELLAS) huella(g, h.x, h.y, 70, h.a, h.c, su(tr(t, h.t, h.t + 0.12)));
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(40,30,20,0.5)"); vg.addColorStop(1, "rgba(40,30,20,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export const momentos = { cocina: Tcoc, vuelta: Tvue };
