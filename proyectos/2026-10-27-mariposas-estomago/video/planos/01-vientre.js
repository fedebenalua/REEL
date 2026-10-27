// Hook: dos caras enormes y la cámara se deja caer en el estómago, lleno de mariposas.
// En «mariposa» el enjambre se rompe. En «alarma» queda un anillo rojo, ya quieto antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { enjambre, perfil, saco, velo } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1), f2 = v.frase(2);
const Tmari = f1.t("mariposas");
const Troma = f2.t("mariposa");
const Tes = f2.t("es");
const Talarma = f2.t("alarma");

export function escenaHook(g, t) {
  const rush = k.entra(k.tramo(t, 0, 1.15));
  const calor = k.suave(k.tramo(t, Tes - 0.05, Talarma + 0.35));
  const rotura = k.entra(k.tramo(t, Troma, Tes - 0.02));
  g.fillStyle = "#12040a";
  g.fillRect(0, 0, 1080, 1920);
  const fondo = g.createRadialGradient(540, 1040, 80, 540, 1000, 1200);
  fondo.addColorStop(0, k.mezColor("#5a1830", "#6a141c", calor));
  fondo.addColorStop(0.45, "#2a0a14");
  fondo.addColorStop(1, "#070206");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);

  const sy = 1120;
  saco(g, 540, sy, 460, 390, t, calor);
  const caras = 1 - k.suave(k.tramo(t, Troma - 0.1, Troma + 0.35));
  if (caras > 0.02) {
    const junto = 0.35 + 0.65 * rush;
    perfil(g, k.mez(210, 300, junto), 690, 1.15, true);
    perfil(g, k.mez(870, 780, junto), 690, 1.15, false);
    k.brillo(g, 540, 640, 280, "sodio", 0.45 * caras);
  }

  const zoom = k.mez(0.92, 1.18, rush) * (1 + 0.08 * k.suave(k.tramo(t, Tmari - 0.08, Tmari + 0.3)));
  enjambre(g, t, { zoom, rotura, al: 1 - calor * 0.94, tFijo: rotura > 0 ? Troma : t });

  if (calor > 0.02) {
    const pul = k.pulso(t, Talarma + 0.12, 0.16) * (1 - k.suave(k.tramo(t, Talarma + 0.4, f2.fin)));
    k.brillo(g, 540, sy, 980, "roja", (0.4 + 0.45 * pul) * calor);
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,70,50,${0.75 * calor * (1 - k.suave(k.tramo(t, Talarma + 0.5, f2.fin)))})`;
    g.lineWidth = 16;
    g.beginPath();
    g.ellipse(540, sy, 250, 190, 0, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }
  velo(g, 0.78);
}

export function dibuja(g, t) {
  escenaHook(g, t);
}
