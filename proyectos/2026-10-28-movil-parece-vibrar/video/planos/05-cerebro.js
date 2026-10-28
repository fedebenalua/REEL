// La cabeza espera el aviso. En «puede», la tela y el músculo entran. En «móvil», dentro aparece un móvil que el de verdad no enciende.
import * as k from "#kit";
import { v } from "#voz";
import { cabeza, movil, velo } from "../mundo.js";

export const desde = (v) => v.frase(7).inicio - 0.04;
export const entrada = "corte";

const f = v.frase(7);
const Tespera = f.t("espera");
const Tpuede = f.t("puede");
const Tmovil = f.t("movil");

export function dibuja(g, t) {
  const entra = k.entra(k.tramo(t, f.inicio - 0.04, f.inicio + 0.55));
  const espera = k.suave(k.tramo(t, Tespera - 0.1, Tespera + 0.35));
  const viaje = k.suave(k.tramo(t, Tespera + 0.05, Tmovil - 0.02));
  const cian = k.suave(k.tramo(t, Tmovil - 0.12, Tmovil + 0.28));
  g.fillStyle = "#140818";
  g.fillRect(0, 0, 1080, 1920);
  const fondo = g.createRadialGradient(420, 900, 40, 480, 960, 1000);
  fondo.addColorStop(0, "#3a1848");
  fondo.addColorStop(0.5, "#1a0c28");
  fondo.addColorStop(1, "#07040e");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);

  cabeza(g, 460, k.mez(1100, 980, entra), k.mez(1.35, 1.85, entra), t, { espera, puede: cian });

  if (viaje > 0.02 && cian < 0.85) {
    const x = k.mez(120, 560, viaje);
    const y = k.mez(1400, 900, viaje);
    k.brillo(g, x, y, 160, "sodio", 0.8);
    k.brillo(g, x + 50, y + 30, 120, "255,150,140", 0.55);
  }
  // el móvil de verdad, apagado, al lado
  movil(g, 820, 1180, 250, 0.08, { reflejo: 0.2, al: entra });
  if (cian > 0.2) {
    g.save();
    g.globalAlpha = (1 - k.suave(k.tramo(t, Tmovil + 0.45, f.fin - 0.2))) * cian;
    movil(g, 470, 860, 160, -0.1, { claro: "#9ff4ff", medio: "#1a6a78", oscuro: "#062028" });
    g.restore();
  }
  velo(g, 0.8);
}
