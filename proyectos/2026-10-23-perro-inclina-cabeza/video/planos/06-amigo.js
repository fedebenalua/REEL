// «Envíaselo a ese amigo…» Se derrite, y la cámara acaba en el fotograma 0.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";
import { escena } from "./01-salon.js";

export const desde = "amigo";

const f10 = v.frase(10);
const Tderrite = f10.t("derrite");

export function dibuja(g, t) {
  const DUR = v.duracion;
  const funde = k.suave(k.tramo(t, DUR - 0.78, DUR - 0.18));
  if (funde < 0.98) {
    const pared = g.createLinearGradient(0, 0, 0, 1200);
    pared.addColorStop(0, "#8a6420");
    pared.addColorStop(0.42, "#ffe07a");
    pared.addColorStop(1, "#ffd0a0");
    g.fillStyle = pared;
    g.fillRect(0, 0, 1080, 1920);
    k.brillo(g, 540, 420, 700, "255,220,120", 0.4);
    g.fillStyle = "#ff7a8a";
    k.redondo(g, 140, 980, 800, 260, 60);
    g.fill();
    const suelo = g.createLinearGradient(0, 1180, 0, 1920);
    suelo.addColorStop(0, "#f0c48a");
    suelo.addColorStop(1, "#c88848");
    g.fillStyle = suelo;
    g.fillRect(0, 1200, 1080, 800);

    const der = k.claves([
      [Tderrite - 0.15, 0],
      [Tderrite + 0.55, 1],
      [DUR, 1],
    ])(t);
    m.persona(g, 560, 1500, 1.35, {
      t, derrite: der, habla: 0.2, jersey: "#7c4dff", jersey2: "#d4c4ff", pelo: "#2a1c18",
    });
    m.perro(g, 300, 1320, 1.15, { t, ladeo: m.LADEO, oreja: 0.22, alerta: 0.7, sem: 0.5, miraX: 8 });
    m.velo(g, 0.84);
  }
  if (funde > 0.02) m.conAlfa(g, funde, (c) => escena(c, 0, "viaje"));
}
