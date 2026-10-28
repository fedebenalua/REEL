// La pregunta, y el sorteo: dos móviles enormes, botón azul y botón verde.
// La moneda de tu cuenta cae en el azul; la otra mitad, en el verde.
import * as k from "#kit";
import { v } from "#voz";
import { sala, velo, telefono, pantallaConBoton, moneda } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Texp = f1.t("experimentar"), Tsin = f1.t("sin"), Tsep = f1.t("sepan");
const Tcue = f2.t("cuenta"), Taz = f2.t("azul"), Tmit = f2.t("mitad"), Tver = f2.t("verde");

function aviso(g, x, y, u) {
  if (u <= 0.01 || u >= 0.99) return;
  const s = Math.sin(u * Math.PI);
  g.save();
  g.globalAlpha = s;
  g.translate(x, y - (1 - entra(u)) * 40);
  k.redondo(g, -150, -46, 300, 92, 46);
  g.fillStyle = "rgba(255,255,255,0.94)";
  g.fill();
  g.fillStyle = "#8a93a6";
  k.redondo(g, -110, -10, 150, 16, 8);
  g.fill();
  g.restore();
}

export function dibuja(g, t) {
  sala(g, "#070b18", "#0c1224", t);
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  const d = (t * 900) % 240;
  for (let i = 0; i < 18; i++) {
    const y = ((i * 130 - d) % 2100) - 80;
    g.strokeStyle = `rgba(120,170,255,${0.05 + (i % 3) * 0.02})`;
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(-40, y);
    g.lineTo(1120, y + 220);
    g.stroke();
  }
  g.restore();

  const entra = k.entra(tr(t, 0, 0.75));
  const empuje = 0.92 + 0.14 * entra;
  const lean = su(tr(t, Tcue, Taz)) * 50 - su(tr(t, Tmit, Tver)) * 50;
  const azul = { x: mez(140, 300, entra) - lean * 0.25, y: 1140, w: 530 * empuje, h: 1020 * empuje };
  const verde = { x: mez(960, 790, entra) - lean * 0.1, y: 1160, w: 490 * empuje, h: 960 * empuje };
  const calma = 1 - su(tr(t, f2.fin - 0.5, f2.fin - 0.12));
  const pulsoAz = 0.75 + calma * (0.25 * k.pulso(t, Taz, 0.16) + 0.12 * Math.sin(t * 2.2));
  const pulsoVe = 0.75 + calma * (0.25 * k.pulso(t, Tver, 0.16) + 0.12 * Math.sin(t * 2.2 + 1));
  const tFeed = Math.min(t, f2.fin - 0.28);

  k.brillo(g, azul.x, azul.y, 900, "80,140,255", 0.18);
  k.brillo(g, verde.x, verde.y, 820, "40,220,140", 0.16);

  telefono(g, verde.x, verde.y, verde.w, verde.h, 0.04, (c, x, y, w, h) => {
    pantallaConBoton(c, x, y, w, h, tFeed * 0.85 + 1.7, "verde", pulsoVe);
  });
  telefono(g, azul.x, azul.y, azul.w, azul.h, -0.03, (c, x, y, w, h) => {
    pantallaConBoton(c, x, y, w, h, tFeed, "azul", pulsoAz);
    aviso(c, x + w * 0.5, y + h * 0.28, tr(t, Tsin, Tsep));
  });

  const caeAz = su(tr(t, Tcue, Taz));
  if (t > Tcue - 0.05) {
    const y = mez(-120, azul.y + azul.h * 0.18, caeAz);
    const x = mez(540, azul.x, caeAz);
    const aplasta = 1 + 0.14 * k.pulso(t, Taz + 0.04, 0.07);
    moneda(g, x, y, 86 * aplasta, (1 - caeAz) * Math.PI * 3, "70,140,255");
  }
  const caeVe = su(tr(t, Tmit + 0.05, Tver));
  if (t > Tmit) {
    const y = mez(-80, verde.y + verde.h * 0.16, caeVe);
    const x = mez(700, verde.x, caeVe);
    moneda(g, x, y, 72, (1 - caeVe) * Math.PI * 2.2, "40,200,130");
  }
  if (t > Taz && t < Taz + 0.28) k.fogonazo(g, azul.x, azul.y + azul.h * 0.16, (t - Taz) * 4, 240, "90,160,255");
  if (t > Tver && t < Tver + 0.26) k.fogonazo(g, verde.x, verde.y + verde.h * 0.14, (t - Tver) * 4, 200, "70,220,150");
  velo(g, 0.8);
}
