// «Una frase hecha entra entera, con todas sus palabras. Porque ya es un solo trozo.»
// Las palabras llegan grandes, se leen, y se aplastan en un bloque.
import * as k from "#kit";
import { v } from "#voz";
import { cartel, fondo, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(5).inicio;

const f5 = v.frase(5), f6 = v.frase(6);
const Tent = f5.t("entera"), Ttro = f6.t("trozo");
const PAL = [
  { t: "MÁS", x: 320, y: 760, rgb: "255,214,90" },
  { t: "VALE", x: 760, y: 760, rgb: "255,170,90" },
  { t: "PÁJARO", x: 340, y: 1080, rgb: "140,220,255" },
  { t: "EN MANO", x: 760, y: 1120, rgb: "255,140,180" },
];

export function dibuja(g, t) {
  fondo(g, t, "oro");
  const acerca = k.suave(k.tramo(t, f5.t("palabras"), Ttro));
  const aplasta = k.suave(k.tramo(t, Ttro - 0.05, Ttro + 0.35));
  const junto = Math.max(acerca * 0.55, aplasta);
  PAL.forEach((p, i) => {
    const llega = f5.inicio - 0.05 + i * 0.22;
    const u = k.entra(k.tramo(t, llega - 0.4, llega + 0.15));
    const lado = i % 2 === 0 ? -1 : 1;
    const x0 = p.x + lado * 640;
    const x = k.mez(k.mez(x0, p.x, u), 540, junto);
    const y = k.mez(k.mez(p.y - 480, p.y, u), 1060, junto);
    const al = u * (1 - aplasta);
    if (al > 0.03) {
      g.save();
      g.globalAlpha = al;
      cartel(g, x, y, p.t, p.rgb, i === 2 ? 72 : 86);
      g.restore();
    }
  });
  if (aplasta > 0.02) {
    const s = k.mez(40, 280, k.entra(aplasta));
    g.save();
    g.translate(540, 1080);
    k.redondo(g, -s, -s * 0.72, s * 2, s * 1.44, 36);
    const gr = g.createLinearGradient(-s, -s, s, s);
    gr.addColorStop(0, "#fff1b8");
    gr.addColorStop(0.45, "#f0b429");
    gr.addColorStop(1, "#a86a10");
    g.fillStyle = gr;
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.55)";
    g.lineWidth = 8;
    g.stroke();
    g.fillStyle = "rgba(90,50,8,0.85)";
    g.fillRect(-s * 0.15, -s * 0.55, s * 0.3, s * 1.1);
    g.restore();
    k.brillo(g, 540, 1000, 360 * aplasta, "amarilla", 0.4 * aplasta);
  }
  const quieto = k.suave(k.tramo(t, Tent - 0.05, Tent + 0.2));
  if (quieto > 0 && aplasta < 0.05) k.brillo(g, 540, 960, 200, "blanca", 0.12 * quieto);
  velo(g);
}
