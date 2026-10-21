// «So they built a click the wall could stop.»
// Un salón de 1956. El anillo de oro se aplasta en la pared. La cámara entra: martillo, varilla, pulgar,
// cuatro notas. Sale y la tele obedece una a una. Las pilas rebotan. Al final, la tele «rota», quieta.
import * as k from "#kit";
import { v } from "#voz";
import { ORO, anillos, clickerCuerpo, cojin, interior, pila, tele, velo } from "../mundo.js";

export const desde = "click";

const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const Tclick = f3.t("click"), Tstop = f3.t("stop");
const Thit = f4.t("hit"), Tthumb = f4.t("thumb");
const Tnotes = f5.t("notes"), Thigh = f5.t("high"), Tnext = f5.t("next"), Tlast = f5.t("last"), Tmute = f5.t("mute"), Toff = f5.t("off");
const Tbat = f6.t("batteries"), Tdied = f6.t("died"), Tbroken = f6.t("broken");

const GOLPES = [Thit, Tnext, Tlast, Tmute, Toff];

function sala(g, t, canal, mute, nieve) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#3a1e28"); fondo.addColorStop(0.45, "#5a3040"); fondo.addColorStop(1, "#2a140e");
  g.fillStyle = fondo; g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#6b3d28"; g.fillRect(0, 1280, 1080, 640);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35;
  g.drawImage(k.red, 0, 1280, 1080, 640); g.restore();
  // lámpara
  k.brillo(g, 180, 430, 520, "255,180,110", 0.55);
  g.fillStyle = "#f2d7a2"; g.beginPath(); g.arc(180, 390, 18, 0, 6.3); g.fill();
  // tele
  const ch = nieve > 0.4 ? -2 : canal;
  tele(g, 430, 820, 560, 340, ch, 0, t, mute);
  if (nieve > 0.05 && nieve < 1) {
    // la grieta de «rota»
  }
  if (nieve > 0.2) {
    g.save(); g.globalAlpha = Math.min(1, nieve);
    g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 8; g.lineCap = "round";
    g.beginPath(); g.moveTo(250, 700); g.lineTo(360, 820); g.lineTo(300, 900); g.lineTo(470, 1020); g.stroke();
    g.restore();
  }
  // tabique
  g.fillStyle = "#f0e2cc"; g.fillRect(860, 520, 220, 980);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3;
  g.drawImage(k.manchas, 860, 520, 220, 980); g.restore();
  // la tele del vecino, quieta, al otro lado
  g.save(); k.redondo(g, 900, 760, 150, 100, 8); g.clip();
  tele(g, 975, 810, 160, 110, 4, 1, t, 0);
  g.restore();
  cojin(g, 260, 1560, 340, 200, "#e06a48", "#a33b28");
  cojin(g, 560, 1600, 300, 180, "#f2c14e", "#c48a22");
}

export function dibuja(g, t) {
  const zoom = k.curva([[9, 0], [10.5, 0], [11.3, 1], [14.4, 1], [16.2, 0], [23.7, 0]], 0, 0)(t);
  let canal = 1;
  if (t >= Tnext) canal = 2;
  if (t >= Tlast) canal = 1;
  const mute = k.suave(k.tramo(t, Tmute - 0.05, Tmute + 0.25)) * (1 - k.suave(k.tramo(t, Toff - 0.05, Toff + 0.2)));
  if (t >= Toff) canal = -1;
  const nieve = k.suave(k.tramo(t, Tbroken - 0.35, Tbroken + 0.05));
  if (nieve > 0.5) canal = -2;

  sala(g, t, canal, mute, nieve);

  // el anillo que la pared para
  const crece = k.suave(k.tramo(t, Tclick, Tstop));
  const muere = 1 - k.suave(k.tramo(t, Tstop, Tstop + 0.45));
  if (crece > 0.02 && muere > 0.02 && zoom < 0.4) {
    const r = 30 + crece * 390;
    anillos(g, 480, 1240, Math.min(r, 400), ORO, muere * (1 - zoom), 3);
    if (crece > 0.82) k.brillo(g, 860, 1000, 280, ORO, muere * 0.7);
  }

  // clicker en la sala
  const aSala = 1 - k.suave(k.tramo(zoom, 0.15, 0.72));
  if (aSala > 0.03) {
    g.save(); g.globalAlpha = aSala;
    g.translate(500, 1280);
    const boton = t >= Toff ? 3 : t >= Tmute ? 2 : t >= Tlast ? 1 : t >= Tnext ? 0 : -1;
    clickerCuerpo(g, 340, 460, boton);
    g.restore();
  }

  // dentro
  const aDentro = k.suave(k.tramo(zoom, 0.4, 0.85));
  if (aDentro > 0.03) {
    g.save(); g.globalAlpha = aDentro;
    g.translate(540, 1040);
    const spread = k.tramo(t, Tnotes + 0.05, Thigh + 0.15);
    const pulgarU = k.suave(k.tramo(t, Tthumb - 0.55, Tthumb)) * (1 - k.suave(k.tramo(t, Tnotes, Tnotes + 0.35)));
    interior(g, t, GOLPES, pulgarU, spread);
    // anillos que suben, demasiado altos para oírlos
    const sube = k.tramo(t, Thigh - 0.1, Thigh + 0.7);
    if (sube > 0 && sube < 1) {
      anillos(g, 0, k.mez(-40, -520, sube), 80 + sube * 60, ORO, (1 - sube) * 0.8, 2);
    }
    g.restore();
  }

  // pilas que no entran
  if (t > Tbat - 0.05 && t < Tdied + 0.15) {
    [0, 0.12].forEach((retraso, i) => {
      const t0 = Tbat + retraso;
      const u = k.tramo(t, t0, t0 + 0.42);
      if (u <= 0) return;
      const y = k.mez(620, 1220, k.sale(Math.min(1, u)));
      const reb = t > t0 + 0.42 ? Math.sin((t - t0 - 0.42) * 16) * Math.exp(-(t - t0 - 0.42) * 5) * 36 : 0;
      const fuera = k.suave(k.tramo(t, t0 + 0.42, t0 + 0.95));
      const x = k.mez(420 + i * 90, i === 0 ? 140 : 820, fuera);
      pila(g, x, y - reb, 1.15, 1);
    });
  }
  // la pila que se muere, y por eso creerías que la tele está rota
  if (t > Tdied - 0.45) {
    const viva = 1 - k.suave(k.tramo(t, Tdied - 0.15, Tdied + 0.25));
    const entra = k.entra(k.tramo(t, Tdied - 0.45, Tdied - 0.05));
    pila(g, k.mez(900, 760, entra), 1180, 1.35, viva);
  }

  velo(g, 0.7);
}
