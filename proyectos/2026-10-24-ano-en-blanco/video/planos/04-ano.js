// «Y aun así, de adulto, ese primer año no lo cuentas.»
// Cuatro fotos de marco vivo y centro en blanco. La cámara baja.
import * as k from "#kit";
import { v } from "#voz";
import { cuna, marcoFoto, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;
const f6 = v.frase(6);
const Tcu = f6.t("cuentas");

const FOTOS = [
  { y: 560, pal: "#ff4d6d" },
  { y: 1020, pal: "#ffc43d" },
  { y: 1480, pal: "#3ec6ff" },
  { y: 1940, pal: "#c49bff" },
];

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#140820");
  bg.addColorStop(0.4, "#3a1860");
  bg.addColorStop(1, "#1a0c28");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  const baja = k.suave(k.tramo(t, f6.inicio + 0.1, Tcu)) * 520;
  g.save();
  g.translate(0, -baja);
  for (const f of FOTOS) {
    marcoFoto(g, 230, f.y, 620, 340, 0);
    g.save();
    k.redondo(g, 250, f.y + 18, 580, 304, 12);
    g.clip();
    g.fillStyle = "#f7f2f8";
    g.fillRect(240, f.y, 600, 360);
    // un intento de cuna que se borra
    const queda = 1 - k.suave(k.tramo(t, f6.t("primer"), f6.t("no")));
    if (queda > 0.02) {
      g.globalAlpha = 0.85 * queda;
      g.fillStyle = "#ffd8c4";
      g.fillRect(250, f.y, 580, 340);
      cuna(g, 540, f.y + 200, 0.55);
    }
    g.restore();
    // el marco de color por encima del borde
    g.strokeStyle = f.pal;
    g.lineWidth = 18;
    k.redondo(g, 230, f.y, 620, 340, 22);
    g.stroke();
  }
  g.restore();
  veloArriba(g, 0.84);
}
