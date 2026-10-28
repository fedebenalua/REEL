// Estudiantes al sol: el 89 %. Luego la mesa, catorce cuentas y un solo aviso en dos semanas.
import * as k from "#kit";
import { v } from "#voz";
import { mesaDias, movil, persona, velo } from "../mundo.js";

export const desde = (v) => v.frase(4).inicio - 0.04;
export const entrada = "corte";

const f4 = v.frase(4);
const f5 = v.frase(5);
const Tnueve = f4.t("nueve");
const Tdos = f5.t("dos");
const gente = [
  { x: 160, y: 980, h: 460, s: 41, mira: 1, ropa: "#ff6b6b" },
  { x: 400, y: 940, h: 420, s: 42, mira: 1, ropa: "#ffd15c" },
  { x: 860, y: 1000, h: 440, s: 43, mira: 1, ropa: "#3ecfb2" },
  { x: 240, y: 1280, h: 340, s: 44, mira: 0, ropa: "#7aa2ff" },
  { x: 820, y: 1300, h: 320, s: 45, mira: 1, ropa: "#ff8ad4" },
];

export function dibuja(g, t) {
  const entra = k.entra(k.tramo(t, f4.inicio - 0.04, f4.inicio + 0.4));
  const num = k.suave(k.tramo(t, Tnueve - 0.05, Tnueve + 0.25));
  const numSeVa = 1 - k.suave(k.tramo(t, f5.inicio - 0.05, f5.inicio + 0.35));
  const acerca = k.suave(k.tramo(t, f5.inicio, Tdos));
  const viaje = k.suave(k.tramo(t, f5.t("vez"), f5.t("semanas") + 0.15));
  const pulso = k.pulso(t, Tnueve, 0.16) * numSeVa;

  const cielo = g.createLinearGradient(0, 0, 0, 1600);
  cielo.addColorStop(0, "#ffb15a");
  cielo.addColorStop(0.35, "#7ec8ff");
  cielo.addColorStop(1, "#ffe29a");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#e07a45";
  g.fillRect(0, 1180, 1080, 800);
  g.fillStyle = "#c45a30";
  for (let i = 0; i < 8; i++) g.fillRect(0, 1240 + i * 70, 1080, 8);

  g.save();
  g.globalAlpha = 1 - acerca;
  g.translate(0, -acerca * 280);
  for (const p of gente) {
    persona(g, p.x, p.y, p.h, p.s, { ropa: p.ropa, mira: p.mira * entra, pulso: p.mira ? pulso : 0, t });
  }
  persona(g, 540, 1680, 900, 12, {
    ropa: "#ffd15c",
    piel: "#c98462",
    pelo: "#241c18",
    mira: entra * (1 - acerca),
    pulso,
    t,
  });
  g.restore();

  if (acerca > 0.02) {
    g.save();
    g.globalAlpha = acerca;
    g.fillStyle = "#e07a45";
    g.fillRect(0, 520, 1080, 1400);
    g.fillStyle = "#c45a30";
    for (let i = 0; i < 10; i++) g.fillRect(0, 560 + i * 90, 1080, 10);
    movil(g, 540, 1120, 280, -0.04);
    mesaDias(g, 540, 1520, 1.05, t, viaje);
    g.restore();
  }

  if (num * numSeVa > 0.02) k.pastilla(g, 540, 700, "89", "%", "255,210,90", num * numSeVa, 120);
  if (acerca > 0.45) k.pastilla(g, 540, 680, "2", "semanas", "120,230,255", k.suave(k.tramo(t, Tdos - 0.08, Tdos + 0.22)) * acerca, 90);
  velo(g, 0.84);
}
