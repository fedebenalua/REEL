// El remate: ahora se ven las dos pantallas, el aviso queda enterrado, y el móvil azul se acerca como quien se lo pasa a un amigo.
import * as k from "#kit";
import { v } from "#voz";
import { sala, velo, telefono, pantallaConBoton } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez } = k;
const f9 = v.frase(9), f10 = v.frase(10);
const Tpan = f9.t("pantalla"), Tent = f9.t("enterrado");
const Tenv = f10.t("enviaselo"), Tami = f10.t("amigo");

export function dibuja(g, t) {
  sala(g, "#081018", "#10182c", t);
  const abre = su(tr(t, f9.inicio, Tpan));
  const luz = k.pulso(t, Tent + 0.12, 0.28);
  const ofrece = su(tr(t, Tenv, Tami + 0.45));

  const verde = {
    x: mez(860, 760, abre),
    y: mez(1240, 1180, abre) + ofrece * 30,
    w: mez(360, 500, abre),
    h: mez(700, 960, abre),
  };
  const azul = {
    x: mez(420, 340, abre) - ofrece * 20,
    y: mez(1080, 1040, abre) + ofrece * 40,
    w: mez(640, 560, abre) * (1 + ofrece * 0.34),
    h: mez(1180, 1040, abre) * (1 + ofrece * 0.34),
  };

  // suelo
  g.fillStyle = "rgba(20,40,70,0.45)";
  g.beginPath();
  g.ellipse(540, 1580, 480, 50, 0, 0, 6.2832);
  g.fill();

  k.brillo(g, verde.x, verde.y, 640, "40,200,130", 0.12 * abre);
  k.brillo(g, azul.x, azul.y, 780, "70,140,255", 0.15);

  telefono(g, verde.x, verde.y, verde.w, verde.h, 0.08, (c, x, y, w, h) => {
    pantallaConBoton(c, x, y, w, h, t * 0.55 + 2, "verde", 0.85);
  });
  telefono(g, azul.x, azul.y, azul.w, azul.h, -0.06, (c, x, y, w, h) => {
    pantallaConBoton(c, x, y, w, h, t * 0.4, "azul", 1);
  });

  // el rollo, delante, abajo en el centro: se enciende en «enterrado» y se queda
  const rolloAl = 0.7 + 0.3 * luz;
  g.save();
  g.translate(540, 1470);
  g.globalAlpha = rolloAl;
  k.redondo(g, -120, -46, 240, 92, 20);
  g.fillStyle = luz > 0.2 ? "#f8ecd0" : "#6a5840";
  g.fill();
  g.fillStyle = luz > 0.2 ? "#e6c98a" : "#3e3428";
  for (let i = 0; i < 3; i++) g.fillRect(-70, -22 + i * 18, 100 - i * 16, 7);
  g.restore();
  k.brillo(g, 540, 1470, 300, "255,200,120", 0.4 * luz);

  velo(g, 0.8);
}
