// La fila: la nada se coloca debajo del uno, y eso es el cero. No el de la pizarra.
import * as k from "#kit";
import { v } from "#voz";
import { carta, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra } = k;
const f11 = v.frase(11);
const f12 = v.frase(12);
const Tdeb = f11.t("debajo");
const Tuno = f11.t("uno");
const Tcero = f11.t("cero");
const Tcuen = f12.t("cuentas");
const Tsaber = f12.t("saber");
const Talgo = f12.t("algo");

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#1b2450");
  bg.addColorStop(0.55, "#3c6e86");
  bg.addColorStop(1, "#e7b15a");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 540, 1500, 1100, "255,190,90", 0.35);
  g.restore();

  const baja = entra(tr(t, f11.inicio, Tdeb + 0.15));
  // el dos se va; el uno se queda arriba y la vacía, debajo.
  const fila = [
    { n: 2, y: 700, seQueda: false, w: 220, h: 260 },
    { n: 1, y: 960, seQueda: true, w: 280, h: 320 },
  ];
  fila.forEach((c, i) => {
    const llega = entra(tr(baja, i * 0.2, i * 0.2 + 0.45));
    const queda = c.seQueda ? 1 : 1 - su(tr(t, Tsaber, Talgo));
    const xLlega = mez(-240, 540, llega);
    const x = c.seQueda ? xLlega : mez(xLlega, 1280, 1 - queda);
    const y = c.y + (c.seQueda ? 0 : (1 - queda) * -180);
    carta(g, x, y, c.w, c.h, c.n, { al: Math.min(1, llega) * (c.seQueda ? 1 : queda), rot: 0 });
  });

  const yVacia = mez(680, 1260, entra(tr(t, Tdeb - 0.05, Tuno + 0.25)));
  const crece = entra(tr(t, Tcero - 0.08, Tcero + 0.55));
  const cero = entra(tr(t, Tcero - 0.02, Tcero + 0.4));
  carta(g, 540, yVacia, mez(340, 520, crece), mez(360, 480, crece), 0, { cero, rot: 0 });

  // la pizarra del cero de las cuentas, entra y se va
  const piz = su(tr(t, Tcuen - 0.08, Tcuen + 0.28)) * (1 - su(tr(t, Tsaber - 0.05, Tsaber + 0.45)));
  if (piz > 0.02) {
    const x = mez(-280, 200, su(tr(t, Tcuen - 0.08, Tcuen + 0.35)));
    const x2 = mez(x, -320, su(tr(t, Tsaber - 0.05, Tsaber + 0.45)));
    g.save();
    g.globalAlpha = piz;
    k.redondo(g, x2 - 110, 1120, 220, 170, 16);
    g.fillStyle = "#1d4a32";
    g.fill();
    g.strokeStyle = "#d8b072";
    g.lineWidth = 8;
    g.stroke();
    g.fillStyle = "#f4f1e4";
    g.font = "800 110px Figtree";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("0", x2, 1205);
    g.restore();
  }

  velo(g, 0.66);
}
