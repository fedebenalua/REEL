// «The idea didn't die. It moved into your phone.»
// «The app is in the link in bio.»
// «Send it to that friend who still keeps a pile of remotes on the table.»
// El salón de ahora. El mando viejo se deshace y sale el móvil. La wifi, cian, enciende la tele plana.
// Al final la cámara se abre: el montón en la mesa, el móvil de pie encima.
import * as k from "#kit";
import { v } from "#voz";
import { mando, movil, telePlana, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio - 0.04;

const f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);
const Tdie = f10.t("die"), Tphone = f10.t("phone"), Tapp = f11.t("app"), Tpile = f12.t("pile");
const Fin = v.duracion;

export function dibuja(g, t) {
  g.fillStyle = "#070910"; g.fillRect(0, 0, 1080, 1920);
  const abre = k.suave(k.tramo(t, Tpile - 0.35, Tpile + 0.7));
  const z = k.mez(1.05, 0.72, abre);
  g.save();
  g.translate(540, 980); g.scale(z, z); g.translate(-540, -980);

  const pared = g.createLinearGradient(0, 200, 0, 1600);
  pared.addColorStop(0, "#121826"); pared.addColorStop(1, "#070910");
  g.fillStyle = pared; g.fillRect(-200, -200, 1600, 2400);
  // mesa
  g.fillStyle = "#1c140f"; g.beginPath(); g.moveTo(-100, 1500); g.lineTo(1200, 1400); g.lineTo(1200, 2100); g.lineTo(-100, 2100); g.fill();

  const nace = k.suave(k.tramo(t, Tdie - 0.1, Tphone + 0.15));
  const ui = k.suave(k.tramo(t, Tapp - 0.2, Tapp + 0.35));
  const on = k.suave(k.tramo(t, Tapp + 0.05, Tapp + 0.55));

  telePlana(g, 540, 540, 720, on);

  // el viejo se apaga y el móvil ocupa su sitio
  const muere = 1 - k.suave(k.tramo(t, f10.inicio, Tdie + 0.15));
  if (muere > 0.02) {
    mando(g, 540, k.mez(1180, 1040, 1 - muere), 700, "core", { al: muere, lcd: muere, aprende: muere });
    k.brillo(g, 540, 1040, 600, "violeta", 0.4 * k.pulso(t, Tdie, 0.2) * muere);
  }
  const h = k.mez(560, 900, nace) * k.mez(1, 0.7, abre);
  const y = k.mez(1240, 1320, abre);
  movil(g, 540, y, h, t, nace * (0.35 + 0.65 * ui));

  // la wifi, tres arcos cian por encima del móvil, hacia la tele. No es un rayo.
  if (on > 0.04) {
    const yArco = y - h * 0.42;
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) {
      const pul = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 3 - i * 0.7));
      g.strokeStyle = `rgba(120,230,255,${on * pul * 0.9})`;
      g.lineWidth = 14 - i * 2;
      g.beginPath(); g.arc(540, yArco, 70 + i * 52, Math.PI * 1.2, Math.PI * 1.8); g.stroke();
    }
    g.restore();
    k.brillo(g, 540, 540, 360, "cian", 0.35 * on * (0.6 + 0.4 * Math.sin(t * 3)));
  }

  // el montón, al abrirse
  if (abre > 0.02) {
    const a = abre;
    mando(g, 300, 1560, 280, "tv", { al: a, ang: -0.4, aprende: 0.3 });
    mando(g, 470, 1600, 250, "vcr", { al: a, ang: 0.5 });
    mando(g, 680, 1570, 300, "barato", { al: a, ang: 0.25 });
    mando(g, 820, 1620, 240, "core", { al: a * 0.8, ang: -0.7, lcd: 0.2 });
  }
  g.restore();
  velo(g, 0.62);
}
