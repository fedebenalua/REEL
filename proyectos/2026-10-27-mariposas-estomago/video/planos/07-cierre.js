// El remate: no es amor en el estómago, es una alerta y se pasa. Luego vuelve el primer fotograma.
import * as k from "#kit";
import { v } from "#voz";
import { escenaHook } from "./01-vientre.js";
import { saco, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(13).inicio - 0.04;
export const entrada = "corte";

const f13 = v.frase(13), f14 = v.frase(14);
const Tamor = f13.t("amor");
const Talerta = f13.t("alerta");
const Tpasa = f13.t("pasa");
const Tamigo = f14.t("enviaselo");
const Ttripa = f14.t("tripa");
const Tcita = f14.t("cita");
const lienzo = k.lienzo(1080, 1920);
const cg = lienzo.getContext("2d");

export function dibuja(g, t) {
  const alas = k.suave(k.tramo(t, Tamor - 0.05, Tamor + 0.25)) * (1 - k.suave(k.tramo(t, Tamor + 0.35, Talerta)));
  const alarma = k.suave(k.tramo(t, Talerta - 0.05, Talerta + 0.3)) * (1 - k.suave(k.tramo(t, Tpasa - 0.05, Tpasa + 0.45)));
  const calma = k.suave(k.tramo(t, Tpasa, Tpasa + 0.5));
  const amigo = k.entra(k.tramo(t, Tamigo - 0.05, Ttripa));
  const vuelta = k.suave(k.tramo(t, Tcita - 0.05, v.duracion - 0.08));

  g.fillStyle = "#12040a";
  g.fillRect(0, 0, 1080, 1920);
  const fondo = g.createRadialGradient(540, 1040, 60, 540, 1000, 1100);
  fondo.addColorStop(0, k.mezColor("#5a2030", "#3a1828", calma));
  fondo.addColorStop(1, "#070206");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);

  const x1 = k.mez(540, 300, amigo);
  saco(g, x1, 1100, k.mez(400, 250, amigo), k.mez(340, 220, amigo), t, alarma);
  if (amigo > 0.05) saco(g, k.mez(1200, 780, amigo), 1140, 250, 220, t, 0.2 + 0.5 * k.suave(k.tramo(t, Ttripa, Tcita)));

  if (alas > 0.03) {
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, x1 - 80, 980, 220, "255,80,150", alas);
    k.brillo(g, x1 + 90, 1040, 180, "sodio", alas * 0.8);
    g.restore();
  }
  if (alarma > 0.03) {
    k.brillo(g, x1, 1080, 700, "roja", 0.4 * alarma);
    g.strokeStyle = `rgba(255,70,60,${0.7 * alarma})`;
    g.lineWidth = 14;
    g.beginPath();
    g.ellipse(x1, 1080, 230, 180, 0, 0, Math.PI * 2);
    g.stroke();
  }

  if (vuelta > 0.01) {
    cg.setTransform(1, 0, 0, 1, 0, 0);
    cg.clearRect(0, 0, 1080, 1920);
    escenaHook(cg, 0);
    g.save();
    g.globalAlpha = vuelta;
    g.drawImage(lienzo, 0, 0);
    g.restore();
  } else velo(g, 0.66);
}
