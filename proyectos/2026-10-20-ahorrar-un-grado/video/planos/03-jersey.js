// «Y no lo notas: con un jersey fino, tienes el mismo calor que con ese grado.»
// Un sitio nuevo: el salón, con una persona en camiseta (un poco fresca) y el termostato en la pared a 21.
// - «jersey»: un jersey cae sobre la persona y se pone contenta, con un brillo cálido.
// - «mismo calor»: el rótulo. «grado»: el termostato late.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, persona, termostato, ventana, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez, entra, mezColor } = k;
const F8 = v.frase(8);
const T0 = F8.inicio, Tjer = F8.t("jersey"), Tmis = F8.t("mismo"), Tgra = F8.t("grado");
const cam = camino2D([[T0, [1.0, 0, 0]], [F8.fin + 0.04, [1.1, 0, 40]]]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const gr = g.createLinearGradient(0, -1100, 0, 1100); gr.addColorStop(0, "#f7b84e"); gr.addColorStop(1, "#e56a3c");
  g.fillStyle = gr; g.fillRect(-800, -1300, 1600, 2600);
  g.fillStyle = "rgba(255,255,255,0.08)"; for (let x = -800; x < 800; x += 140) g.fillRect(x, -1300, 60, 2600);
  const j = su(tr(t, Tjer - 0.45, Tjer + 0.1));
  const feliz = su(tr(t, Tjer + 0.1, Tjer + 0.4));
  k.brillo(g, 0, 150, 1500, "255,190,90", 0.25 + 0.35 * feliz);
  // la ventana y el termostato de la pared
  g.save(); g.translate(-330, -250); ventana(g, 0, { w: 330, h: 400, fase: 0.08 }); g.restore();
  const late = k.pulso(t, Tgra + 0.15, 0.2);
  g.save(); g.translate(330, -250); const s = 0.4 * (1 + 0.1 * late); g.scale(s, s);
  if (late > 0.02) k.brillo(g, 0, 0, 900, "255,225,140", 0.8 * late);
  termostato(g, t, { grados: 21, calor: 0.45 }); g.restore();
  // la persona
  g.save(); g.translate(0, 250); g.scale(1.35, 1.35);
  const squash = 0.04 * k.pulso(t, Tjer + 0.1, 0.1);
  g.scale(1 + squash, 1 - squash);
  persona(g, t, { jersey: j > 0.001 ? entra(j) : 0, frio: (1 - feliz) * 0.7, feliz });
  g.restore();
  // corazones de calor que suben
  if (feliz > 0.01) for (let i = 0; i < 6; i++) {
    const p = ((t - Tjer) * 0.35 + i / 6) % 1, x = (i % 2 ? 1 : -1) * (250 + 50 * Math.sin(i * 2.1)) + Math.sin(p * 7 + i) * 18, y = 420 - p * 620;
    g.save(); g.translate(x, y); const sc = 0.8 + 0.5 * (i % 3) / 3; g.scale(sc, sc); g.globalAlpha = feliz * Math.min(1, p * 6) * (1 - k.tramo(p, 0.7, 1));
    g.beginPath(); g.moveTo(0, 26); g.bezierCurveTo(-52, -10, -26, -56, 0, -26); g.bezierCurveTo(26, -56, 52, -10, 0, 26); g.fillStyle = "#ff5a7a"; g.shadowColor = "rgba(255,90,120,0.8)"; g.shadowBlur = 20; g.fill(); g.restore();
  }
  sinVista(g);
  const al = su(tr(t, Tmis, Tmis + 0.3)) * (1 - su(tr(t, F8.fin - 0.15, F8.fin + 0.03)));
  k.etiqueta(g, 300, 1640, "mismo calor", "255,236,150", al, 72);
  velo(g, 0.4);
  vineta(g, 0.45);
}
export const momentos = { jersey: Tjer, mismo: Tmis, grado: Tgra };
