// El dedo y, sin corte, el interior de la piel.
import * as k from "#kit";
import { v } from "#voz";
import { dedo, papel, campoPiel, velo } from "../mundo.js";

export const desde = "dedo";
const f3 = v.frase(3), f4 = v.frase(4);
const Tcor = f3.t("corte"), Tsal = f3.t("saltar"), Tpiel = f4.t("piel"), Tala = f4.t("alarmas");

export function dibuja(g, t) {
  const entraPiel = k.suave(k.tramo(t, Tpiel - 0.05, Tpiel + 0.55));
  if (entraPiel < 0.98) {
    const fondo = g.createLinearGradient(0, 0, 0, 1920);
    fondo.addColorStop(0, "#2a120e");
    fondo.addColorStop(1, "#4a2418");
    g.fillStyle = fondo;
    g.fillRect(0, 0, 1080, 1920);
    const mesa = g.createLinearGradient(0, 1200, 0, 1920);
    mesa.addColorStop(0, "#8a4e32");
    mesa.addColorStop(1, "#3a2016");
    g.fillStyle = mesa;
    g.fillRect(0, 1280, 1080, 640);
    const salto = k.entra(k.tramo(t, Tsal - 0.02, Tsal + 0.32));
    const corte = k.suave(k.tramo(t, Tcor - 0.1, Tcor + 0.2));
    const y = k.mez(1080, 280, salto);
    papel(g, k.mez(1040, 720, k.suave(k.tramo(t, 8.5, Tcor + 0.2))), k.mez(900, 1040, corte), 300, -0.55);
    dedo(g, 460, y, 340, corte);
    if (salto > 0.05 && salto < 0.95) {
      const u = (salto - 0.05) / 0.85;
      k.estallido(g, 500, y - 80, u, "roja", 0.28, 9, 36, 0);
    }
  }
  if (entraPiel > 0.02) {
    g.save();
    g.globalAlpha = entraPiel;
    campoPiel(g, t, Tala - 0.05);
    g.restore();
  }
  velo(g, 0.7);
}
