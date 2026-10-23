// «But you had to program it, and it was as long as a pencil.»
// Otra mesa, de cerca. La pantallita se llena mientras hay que programarlo.
// El lápiz entra en «long» y se queda a su lado, igual de largo, hasta el corte.
import * as k from "#kit";
import { v } from "#voz";
import { mando, lapiz, velo } from "../mundo.js";

export const desde = "but";

const f = v.frase(7);
const Tprog = f.t("program"), Tlong = f.t("long"), Tpen = f.t("pencil");

export function dibuja(g, t) {
  g.fillStyle = "#14110e"; g.fillRect(0, 0, 1080, 1920);
  const mesa = g.createLinearGradient(0, 900, 0, 1920);
  mesa.addColorStop(0, "#2a2118"); mesa.addColorStop(1, "#120e0b");
  g.fillStyle = mesa; g.fillRect(0, 980, 1080, 940);
  k.brillo(g, 540, 700, 900, "255,200,140", 0.2);

  const lcd = k.suave(k.tramo(t, Tprog - 0.2, Tprog + 0.85));
  const llega = k.entra(k.tramo(t, Tlong - 0.35, Tpen + 0.02));
  const z = k.mez(0.72, 1.08, k.suave(k.tramo(t, f.inicio, Tlong)));
  g.save(); g.translate(540, 1120); g.scale(z, z); g.translate(-540, -1120);
  const h = 980;
  mando(g, 360, 1140, h, "core", { lcd, aprende: lcd });
  // De pie, el mismo largo. Entra en «long» y se queda quieto en «pencil».
  const y = k.mez(1880, 1140, llega);
  lapiz(g, 800, y, h, -Math.PI / 2);
  g.restore();
  k.brillo(g, 360, 900, 500, "verde", 0.45 * k.pulso(t, Tprog + 0.15, 0.22));
  velo(g, 0.45);
}
