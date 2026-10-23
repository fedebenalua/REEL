// «One button could turn the TV on, start the tape, and find the channel.»
// «It could even do that while you were out.»
// El salón de antes. El botón se hunde, la tele se enciende, el vídeo gira, cae el 4.
// En «out» se van la taza y la manta, y el reloj corre: la tele sigue sola.
import * as k from "#kit";
import { v } from "#voz";
import { mando, teleGorda, video, sofa, taza, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio - 0.04;

const f5 = v.frase(5), f6 = v.frase(6);
const Tbtn = f5.t("button"), Ton = f5.t("on"), Ttape = f5.t("tape"), Tch = f5.t("channel");
const Tout = f6.t("out"), Tfin = f6.fin;

export function dibuja(g, t) {
  g.fillStyle = "#100c0a"; g.fillRect(0, 0, 1080, 1920);
  const seVa = k.suave(k.tramo(t, Tout - 0.12, Tout + 0.55));
  const luz = 0.55 * (1 - seVa);
  const lam = g.createRadialGradient(820, 520, 20, 820, 700, 700);
  lam.addColorStop(0, `rgba(255,190,110,${luz})`); lam.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lam; g.fillRect(0, 0, 1080, 1920);
  // suelo
  g.fillStyle = "#1a120e"; g.beginPath(); g.moveTo(0, 1500); g.lineTo(1080, 1420); g.lineTo(1080, 1920); g.lineTo(0, 1920); g.fill();

  const on = k.suave(k.tramo(t, f5.t("turn"), Ton + 0.28));
  const canal = k.entra(k.tramo(t, Tch - 0.08, Tch + 0.28));
  const gira = k.suave(k.tramo(t, f5.t("start"), Ttape + 0.2));
  const zoom = k.mez(0.96, 1.08, k.suave(k.tramo(t, f5.inicio, Tch + 0.2))) * k.mez(1, 0.94, seVa);
  g.save(); g.translate(540, 860); g.scale(zoom, zoom); g.translate(-540, -860);
  teleGorda(g, 540, 820, 820, t, on, canal);
  video(g, 540, 1240, 640, t, gira * (0.35 + seVa * 2.2));
  sofa(g, 540, 1560, 780, 1);
  // la manta se va con quien se levanta
  g.save(); g.globalAlpha = 1 - seVa; g.translate(0, seVa * 220);
  k.redondo(g, 250, 1480, 280, 70, 16); g.fillStyle = "#c4553a"; g.fill();
  g.restore();
  taza(g, 250, k.mez(1460, 1760, seVa), 1 - seVa);
  g.restore();

  const pulsa = k.pulso(t, Tbtn + 0.12, 0.16);
  mando(g, 250, 1320, 680, "core", { pulsa, aprende: 1, lcd: on, ang: -0.12 });
  if (on > 0.2 && on < 0.95) k.fogonazo(g, 540, 760, (on - 0.2) * 1.4, 900, "255,200,140");
  velo(g, 0.58);
}
