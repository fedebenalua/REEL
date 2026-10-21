// «Your phone is radio again, but only for the TV in your house.»
// El móvil es el mando. El hilo cian se queda en tu tele. La del vecino no se entera.
// Al final el clicker se hunde en el sofá y se ven las dos casas, como al principio.
import * as k from "#kit";
import { v } from "#voz";
import { CIAN, clickerCuerpo, cojin, movil, tele, velo } from "../mundo.js";

export const desde = "phone";

const f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const Tradio = f9.t("radio"), Tonly = f9.t("only"), Thouse = f9.t("house");
const Tapp = f10.t("app");
const Tfriend = f11.t("friend"), Tlosing = f11.t("losing");

export function dibuja(g, t) {
  // 0 = móvil a pantalla completa, 1 = las dos casas
  const abierto = k.curva([
    [31.7, 0],
    [Tradio - 0.05, 0.05],
    [Tonly, 0.72],
    [Thouse + 0.15, 0.85],
    [Tapp - 0.15, 0.08],
    [f10.fin, 0.05],
    [Tfriend, 0.55],
    [Tlosing + 0.15, 1],
    [40.2, 1],
  ], 0, 0)(t);

  const fondo = g.createLinearGradient(0, 0, 1080, 0);
  fondo.addColorStop(0, "#2a1420"); fondo.addColorStop(0.48, "#3a2430"); fondo.addColorStop(0.52, "#162433"); fondo.addColorStop(1, "#121c2e");
  g.fillStyle = fondo; g.fillRect(0, 0, 1080, 1920);

  // las dos habitaciones, más presentes cuanto más abierto
  const sala = k.suave(k.tramo(abierto, 0.15, 0.7));
  if (sala > 0.02) {
    g.save(); g.globalAlpha = sala;
    g.fillStyle = "#6a3c24"; g.fillRect(0, 1320, 500, 600);
    g.fillStyle = "#314258"; g.fillRect(580, 1320, 500, 600);
    g.fillStyle = "#f0e2cc"; g.fillRect(500, 480, 80, 1440);
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3;
    g.drawImage(k.manchas, 500, 480, 80, 1440); g.restore();
    const llega = k.suave(k.tramo(t, Tradio + 0.15, Tradio + 0.55));
    const canalL = llega > 0.8 ? 2 : 0;
    tele(g, 250, 860, 380, 230, canalL, 1, t, 0);
    tele(g, 820, 860, 340, 210, 3, 1, t, 0);
    k.brillo(g, 120, 520, 280, "255,170,90", 0.4);
    k.brillo(g, 960, 520, 260, "120,180,255", 0.35);
    g.restore();
  }

  // el hilo que solo llega a tu tele
  const hilo = k.suave(k.tramo(t, Tradio - 0.05, Tradio + 0.45));
  if (hilo > 0.02 && abierto > 0.2 && abierto < 0.95) {
    const x0 = k.mez(540, 250, abierto), y0 = k.mez(620, 1280, abierto);
    const x1 = 250, y1 = 990;
    const x = k.mez(x0, x1, hilo), y = k.mez(y0, y1, hilo);
    g.save(); g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(${CIAN},${0.9})`; g.lineWidth = 8; g.lineCap = "round";
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x, y); g.stroke();
    g.restore();
    k.brillo(g, x, y, 80, CIAN, 0.8);
    if (hilo > 0.85) k.brillo(g, x1, y1, 140, CIAN, 0.6);
  }

  // cojines y el mando que se pierde
  if (abierto > 0.45) {
    const a = k.suave(k.tramo(abierto, 0.45, 0.8));
    g.save(); g.globalAlpha = a;
    cojin(g, 180, 1560, 280, 180, "#e06a48", "#a33b28");
    cojin(g, 400, 1600, 260, 170, "#f2c14e", "#c48a22");
    const hunde = k.suave(k.tramo(t, Tlosing - 0.15, Tlosing + 0.45));
    g.save();
    g.translate(300, k.mez(1460, 1620, hunde));
    g.scale(0.55, 0.55);
    g.rotate(-0.4);
    clickerCuerpo(g, 280, 380, -1);
    g.restore();
    // el cojín de delante lo tapa al hundirse
    g.globalAlpha = a * hunde;
    cojin(g, 300, 1580, 240, 150, "#ff7a55", "#c44830");
    g.restore();
  }

  // el móvil
  const h = k.mez(1320, 460, k.suave(abierto));
  const mx = k.mez(540, 250, k.suave(abierto));
  const my = k.mez(1040, 1240, k.suave(abierto));
  const pulso = k.pulso(t, Tapp + 0.1, 0.18);
  movil(g, mx, my, h, pulso);

  velo(g, k.mez(0.55, 0.72, abierto));
}
