// «Cómo llevan la cuenta por dentro, todavía nadie lo sabe.»
// Otro sitio: la cámara de una ninfa de diecisiete años, de cerca y a oscuras. Se entra con un corte en «Cómo».
// - «Cómo llevan la cuenta»: en la pared, sus 17 rayas se encienden una a una, como si contara.
// - «por dentro»: un brillo cálido late dentro de la ninfa.
// - «todavía nadie lo sabe»: las rayas se apagan; queda ella sola, con sus ojos rojos. La cámara se acerca despacio.
import * as k from "#kit";
import { v } from "#voz";
import { grano, hueco, marcas, ninfa, sinVista, velo, vista, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Tcue = f8.t("cuenta"), Tpor = f8.t("por"), Tden = f8.t("dentro"), Tnad = f8.t("nadie"), Fin = f8.fin;
const apaga = Tnad - 0.05;

export function dibuja(g, t) {
  const Z = mez(1.0, 1.22, su(tr(t, T0, Fin + 0.4))), cx = mez(-40, 60, su(tr(t, T0, Fin + 0.4))), cy = 0;
  sinVista(g); g.fillStyle = "#120904"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, cx, cy);
  const sg = g.createRadialGradient(0, 100, 200, 0, 100, 1500); sg.addColorStop(0, "#5a3820"); sg.addColorStop(1, "#1a0d06");
  g.fillStyle = sg; g.fillRect(-1400, -1800, 2800, 3600);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.85;
  for (let i = -2; i < 2; i++) for (let j = -2; j < 2; j++) g.drawImage(grano, i * 800 + 300, j * 900 + 200, 800, 900);
  g.globalAlpha = 0.5; g.drawImage(k.manchas, -1400, -1800, 2800, 3600);
  g.restore();
  hueco(g, 60, 260, 560, 330);
  // la raíz que baja por la derecha
  g.save(); g.lineCap = "round";
  g.strokeStyle = "#7a4a26"; g.lineWidth = 46; g.beginPath(); g.moveTo(330, -1200); g.quadraticCurveTo(300, 200, 360, 1400); g.stroke();
  g.strokeStyle = "rgba(255,190,120,0.45)"; g.lineWidth = 8; g.beginPath(); g.moveTo(312, -1200); g.quadraticCurveTo(282, 200, 342, 1400); g.stroke();
  g.restore();
  // las 17 rayas, encima del hueco: se encienden una a una y en «nadie» se apagan
  const cuenta = 17 * su(tr(t, T0 + 0.1, Tden + 0.2));
  const fuera = 1 - su(tr(t, apaga, apaga + 0.45));
  g.save();
  g.globalAlpha = mez(0.35, 1, fuera);
  marcas(g, -400, -200, Math.max(0.01, cuenta), 210, fuera * 0.8, "255,205,120");
  g.restore();
  // la ninfa, con su brillo de dentro
  const late = k.pulso(t, Tden + 0.1, 0.35) * fuera;
  ninfa(g, -30, 270, 560, 0, t, { tono: 1, pico: 1 });
  if (late > 0.02) k.brillo(g, 30, 250, 700, "255,170,80", 0.65 * late);
  sinVista(g);
  vineta(g, 0.6);
  velo(g, 0.45);
}

export const momentos = { apaga };
