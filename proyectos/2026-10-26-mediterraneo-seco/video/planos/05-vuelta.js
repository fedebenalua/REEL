// «Cuando el Atlántico volvió, hay quien calcula más de diez metros al día, aunque no todos lo ven tan rápido.
// Así que no se vació del todo: dejó un lago de sal, y el océano lo llenó otra vez.»
// El paso, con la cascada dentro del hueco. Se calma, se ve el lago, y el mar lo tapa. Al corte, el mar ya está quieto.
import * as k from "#kit";
import { v } from "#voz";
import { velo, cielo, sol, lamina, espuma, lago, mar } from "../mundo.js";

export const desde = "cuando";

const f8 = v.frase(8), f9 = v.frase(9);
const Tvolvio = f8.t("volvio");
const Tdiez = f8.t("diez");
const Tdia = f8.t("dia");
const Aunque = f8.t("aunque");
const Trapido = f8.t("rapido");
const Tdejo = f9.t("dejo");
const Tlago = f9.t("lago");
const Tlleno = f9.t("lleno");

export function dibuja(g, t) {
  const furia = k.suave(k.tramo(t, f8.inicio, Tdia));
  const calma = k.suave(k.tramo(t, Aunque - 0.05, Trapido + 0.25));
  const alLago = k.suave(k.tramo(t, Tdejo - 0.05, Tlago + 0.1)) * (1 - k.suave(k.tramo(t, Tlago + 0.35, Tlleno + 0.15)));
  const tapa = k.suave(k.tramo(t, Tlago + 0.2, Tlleno + 0.25));
  const apaga = k.suave(k.tramo(t, Tlleno - 0.05, Tlleno + 0.45));

  cielo(g, 0.25 * (1 - calma));
  sol(g, 800, 420, 110, 0.8);

  // el nivel: sube deprisa hasta «día», más despacio después, y acaba cubriendo el lago
  const yRapido = k.mez(1500, 1200, k.suave(k.tramo(t, Tvolvio, Tdia)));
  const yLento = k.mez(yRapido, 1080, calma);
  // en «lago» la cámara baja y el nivel se queda por debajo del lago; luego el mar lo tapa
  const yVisto = k.mez(yLento, 1560, alLago);
  const ySuper = k.mez(yVisto, 900, tapa);

  // sal y lago, debajo del mar
  g.fillStyle = "#f6e7d6";
  g.fillRect(0, 1080, 1080, 900);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.3 * (1 - tapa);
  g.drawImage(k.manchas, 0, 1100, 1080, 700);
  g.restore();
  lago(g, 540, 1360, k.mez(240, 360, alLago), k.mez(120, 180, alLago), t, 1 - tapa * 0.85);

  mar(g, ySuper, 1000, t, 0.2 + 0.8 * Math.max(furia * 0.5, tapa));

  // cabos. El hueco es estrecho y violento, y se abre cuando «no todos lo ven tan rápido».
  const medio = k.mez(120, 280, calma);
  roca(g, -1, 540 - medio);
  roca(g, 1, 540 + medio);

  // Atlántico detrás del hueco
  g.save();
  g.beginPath();
  g.rect(540 - medio, 520, medio * 2, 220);
  g.clip();
  const oc = g.createLinearGradient(0, 520, 0, 740);
  oc.addColorStop(0, "#dff8ff");
  oc.addColorStop(1, "#0a82c4");
  g.fillStyle = oc;
  g.fillRect(540 - medio, 520, medio * 2, 240);
  g.restore();

  const fuerza = (1 - calma * 0.7) * (1 - apaga);
  if (fuerza > 0.03) {
    const alto = k.mez(700, 380, calma);
    lamina(g, 540, 640, 640 + alto, medio * 1.7, t * (1.2 + furia), 0.5 + 0.5 * fuerza);
    espuma(g, 540, Math.min(640 + alto, ySuper + 10), medio * 1.4, 30, fuerza);
    if (t > Tdiez - 0.04 && t < Tdiez + 0.65) k.fogonazo(g, 540, 640 + alto * 0.7, t - Tdiez, 700, "190,235,255");
  }

  velo(g, 0.66);
}

function roca(g, dir, borde) {
  g.save();
  g.beginPath();
  if (dir < 0) {
    g.moveTo(-40, 1500);
    g.lineTo(-40, 700);
    g.quadraticCurveTo(borde - 160, 560, borde, 680);
    g.lineTo(borde - 16, 1500);
  } else {
    g.moveTo(1120, 1500);
    g.lineTo(1120, 680);
    g.quadraticCurveTo(borde + 160, 540, borde, 700);
    g.lineTo(borde + 16, 1500);
  }
  g.closePath();
  const lg = g.createLinearGradient(dir < 0 ? 0 : 1080, 560, borde, 1400);
  lg.addColorStop(0, "#f3c79e");
  lg.addColorStop(0.45, "#c56b44");
  lg.addColorStop(1, "#4a261e");
  g.fillStyle = lg;
  g.fill();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.4;
  g.drawImage(k.manchas, dir < 0 ? -20 : 500, 500, 600, 1000);
  g.restore();
}
