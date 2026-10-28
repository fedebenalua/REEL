// Oxford: casi la mitad se podía automatizar. Luego, era lo que una máquina podría hacer.
import * as k from "#kit";
import { v } from "#voz";
import { oficio, operario, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;
export const entrada = "corte";

const f3 = v.frase(3);
const f4 = v.frase(4);
const Tmitad = f3.t("mitad");
const Tpodria = f4.t("podria");
const Tcorte = v.frase(5).inicio;

const SALAS = [
  { tipo: "coche", mitad: true },
  { tipo: "cocina", mitad: true },
  { tipo: "cajas", mitad: false },
  { tipo: "obra", mitad: false },
];

export function dibuja(g, t) {
  const tt = Math.min(t, Tcorte - 0.26);
  const marca = k.entra(k.tramo(tt, Tmitad - 0.12, Tmitad + 0.4));
  const podria = k.suave(k.tramo(tt, Tpodria - 0.08, Tpodria + 0.5));
  g.fillStyle = "#070b14";
  g.fillRect(0, 0, 1080, 1920);

  SALAS.forEach((sala, i) => {
    const col = i % 2, fil = Math.floor(i / 2);
    const x = 36 + col * 520, y = 530 + fil * 620, w = 490, h = 580;
    g.save();
    k.redondo(g, x, y, w, h, 28);
    g.clip();
    const cielo = g.createLinearGradient(x, y, x, y + h);
    cielo.addColorStop(0, "#1e293b");
    cielo.addColorStop(1, "#0f172a");
    g.fillStyle = cielo;
    g.fillRect(x, y, w, h);
    oficio(g, sala.tipo, x + w * 0.42, y + h * 0.62, 1.7, tt + i);
    operario(g, x + w * 0.68, y + h * 0.78, 300, tt + i, { brazo: -0.8 });
    const rojo = sala.mitad ? marca * (1 - podria * 0.88) : 0;
    if (rojo > 0.02) {
      g.fillStyle = `rgba(185, 28, 28, ${0.45 * rojo})`;
      g.fillRect(x, y, w, h);
    }
    g.restore();
    g.lineWidth = 10;
    g.strokeStyle = sala.mitad && marca > 0.15 ? `rgba(248,113,113,${0.4 + 0.55 * marca})` : "rgba(226,232,240,0.28)";
    k.redondo(g, x, y, w, h, 28);
    g.stroke();
  });
  velo(g);
}
