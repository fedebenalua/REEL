// La comparación del estudio: una madre cree oír al bebé, y el bebé duerme.
import * as k from "#kit";
import { v } from "#voz";
import { bebe, cuna, madre, monitor, velo } from "../mundo.js";

export const desde = (v) => v.frase(8).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(8);
const Toir = f.t("oir");
const Tduerme = f.t("duerme");

export function dibuja(g, t) {
  const erguida = k.suave(k.tramo(t, Toir - 0.12, Toir + 0.4));
  const oye = erguida * (1 - k.suave(k.tramo(t, Tduerme - 0.15, Tduerme + 0.25)));
  const quieto = k.suave(k.tramo(t, Tduerme - 0.05, Tduerme + 0.3));
  g.fillStyle = "#07101c";
  g.fillRect(0, 0, 1080, 1920);
  const noche = g.createLinearGradient(0, 0, 0, 1920);
  noche.addColorStop(0, "#0c1c38");
  noche.addColorStop(0.4, "#12243f");
  noche.addColorStop(1, "#1a120e");
  g.fillStyle = noche;
  g.fillRect(0, 0, 1080, 1920);
  // luna en la ventana
  g.fillStyle = "#0a1830";
  k.redondo(g, 620, 280, 360, 420, 24);
  g.fill();
  k.brillo(g, 800, 460, 180, "blanca", 0.55);
  // lámpara
  k.brillo(g, 220, 640, 520, "sodio", 0.55);
  g.fillStyle = "#ffd27a";
  g.beginPath();
  g.moveTo(180, 560);
  g.lineTo(260, 560);
  g.lineTo(240, 680);
  g.lineTo(200, 680);
  g.fill();
  g.fillStyle = "#6a5030";
  g.fillRect(214, 680, 12, 220);

  cuna(g, 720, 1180, 1.7);
  bebe(g, 720, 1140, 1.85, t, quieto);
  madre(g, 250, 1280, 1.7, erguida);
  monitor(g, 430, 1320, 1.1, t, oye);
  if (oye > 0.05) k.brillo(g, 300, 860, 200, "blanca", oye * 0.35);
  velo(g, 0.7);
}
