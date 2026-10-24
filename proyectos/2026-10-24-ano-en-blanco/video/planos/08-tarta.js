// «O que la historia que cuentas empiece hacia los tres o los cuatro años.»
// La tarta. Las velas 1 y 2 se apagan. Las de 3 y 4 se quedan. La llama reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { cuna, marcoFoto, tarta, vela, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;
const f10 = v.frase(10);
const T3 = f10.t("tres"), T4 = f10.t("cuatro"), Fin = v.frase(11).inicio;

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#1a0c20");
  bg.addColorStop(0.35, "#4a2048");
  bg.addColorStop(0.7, "#ffb078");
  bg.addColorStop(1, "#e08848");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  const en3 = k.suave(k.tramo(t, T3 - 0.08, T3 + 0.28));
  const en4 = k.suave(k.tramo(t, T4 - 0.05, T4 + 0.28));
  const zoom = k.claves([
    [f10.inicio, 1],
    [T3, 1.05],
    [T4 + 0.35, 1.12],
    [Fin - 0.22, 1.12],
  ]);
  g.save();
  g.translate(540, 1180);
  g.scale(zoom(t), zoom(t));
  g.translate(-540, -1180);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 540, 1100, 900, "naranja", 0.22 + 0.15 * Math.max(en3, en4));
  g.restore();

  tarta(g, 540, 1180, 1.15);

  const apaga1 = k.suave(k.tramo(t, f10.inicio + 0.25, f10.inicio + 0.85));
  const apaga2 = k.suave(k.tramo(t, f10.inicio + 0.55, f10.inicio + 1.15));
  const tLlama = Math.min(t, Fin - 0.28);
  const velas = [
    { x: 360, llama: (1 - apaga1) * k.suave(k.tramo(t, f10.inicio, f10.inicio + 0.2)), fase: 0.2 },
    { x: 470, llama: (1 - apaga2) * k.suave(k.tramo(t, f10.inicio + 0.1, f10.inicio + 0.35)), fase: 1.3 },
    { x: 590, llama: en3, fase: 2.1 },
    { x: 700, llama: en4, fase: 0.7 },
  ];
  for (const velaI of velas) vela(g, velaI.x, 1040, 1.2, velaI.llama, tLlama, velaI.fase);
  g.font = "800 92px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  const n3 = en3, n4 = en4;
  if (n3 > 0.02) {
    g.globalAlpha = n3;
    g.fillStyle = "#fff8ee";
    g.fillText("3", 590, 900);
  }
  if (n4 > 0.02) {
    g.globalAlpha = n4;
    g.fillStyle = "#fff8ee";
    g.fillText("4", 700, 900);
  }
  g.globalAlpha = 1;

  // humo de las que se apagan, y se va antes del corte
  for (const [x, u0] of [[360, apaga1], [470, apaga2]]) {
    const humo = u0 * (1 - k.suave(k.tramo(t, f10.inicio + 1.5, f10.inicio + 2.3)));
    if (humo < 0.03) continue;
    g.save();
    g.globalAlpha = 0.35 * humo;
    g.fillStyle = "#d8d0e0";
    g.beginPath();
    g.ellipse(x + 10, 900 - humo * 80, 28, 48, 0, 0, 6.2832);
    g.fill();
    g.restore();
  }

  // el marco de un recuerdo, oscuro, se enciende con los tres y los cuatro
  const luz = Math.max(en3, en4);
  marcoFoto(g, 760, 1280, 220, 180, luz);
  if (luz > 0.05) {
    g.save();
    g.globalAlpha = luz;
    k.redondo(g, 774, 1294, 192, 152, 10);
    g.clip();
    g.fillStyle = "#ffd8c0";
    g.fillRect(774, 1294, 192, 152);
    cuna(g, 870, 1420, 0.28);
    g.restore();
  }
  g.restore();
  veloArriba(g, 0.82);
}
