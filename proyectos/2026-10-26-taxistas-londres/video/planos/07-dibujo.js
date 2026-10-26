// «Un dibujo nuevo, media hora después, se les iba peor.»
// El dibujo está entero. Pasa media hora y la copia sale a medias.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = (vx) => vx.frase(13).inicio;

function figura(g, x, y, s, rotura) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = 8;
  const trozo = (dibuja, i) => {
    if (rotura > 0 && i / 6 > 1 - rotura) return;
    g.save();
    if (rotura > 0) {
      g.translate((i - 3) * 10 * rotura, (i % 2 ? 16 : -12) * rotura);
      g.globalAlpha = 0.55;
    }
    g.strokeStyle = ["#ff4d88", "#3ad0ff", "#ffb03a", "#7c6bff", "#5ad6a0", "#ff7a3a"][i % 6];
    dibuja();
    g.restore();
  };
  trozo(() => { g.beginPath(); g.rect(-150, -110, 300, 220); g.stroke(); }, 0);
  trozo(() => { g.beginPath(); g.moveTo(-90, -40); g.lineTo(40, -90); g.lineTo(120, 20); g.lineTo(-20, 80); g.closePath(); g.stroke(); }, 1);
  trozo(() => { g.beginPath(); g.arc(20, -10, 70, 0, 6.28); g.stroke(); }, 2);
  trozo(() => { g.beginPath(); g.moveTo(-130, 70); g.bezierCurveTo(-40, -80, 80, 120, 140, -20); g.stroke(); }, 3);
  trozo(() => { g.beginPath(); g.moveTo(-40, -100); g.lineTo(-40, 90); g.moveTo(70, -70); g.lineTo(70, 70); g.stroke(); }, 4);
  trozo(() => { g.beginPath(); g.arc(-70, 20, 28, 0, 6.28); g.stroke(); }, 5);
  g.restore();
}

export function dibuja(g, t) {
  const f = v.frase(13);
  const Thora = f.t("hora"), Tpeor = f.t("peor"), Tfin = v.frase(14).inicio;
  const aguja = k.suave(k.tramo(t, f.t("media") - 0.05, Thora + 0.15));
  const mala = k.entra(k.tramo(t, f.t("despues"), Tpeor + 0.08));

  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#120818");
  fondo.addColorStop(0.4, "#24143a");
  fondo.addColorStop(1, "#1a140c");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 980, 700, "255,200,140", 0.28);

  // el papel bueno
  g.save();
  k.redondo(g, 140, 620, 520, 680, 18);
  g.fillStyle = "#fff6e4";
  g.fill();
  g.restore();
  figura(g, 400, 960, 1.15, 0);

  // el reloj
  g.save();
  g.translate(820, 760);
  g.fillStyle = "#1a120c";
  g.beginPath();
  g.arc(0, 0, 110, 0, 6.28);
  g.fill();
  g.strokeStyle = "#ffd27a";
  g.lineWidth = 8;
  g.stroke();
  g.strokeStyle = "#fff6e4";
  g.lineWidth = 8;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(Math.sin(aguja * Math.PI) * 70, -Math.cos(aguja * Math.PI) * 70);
  g.stroke();
  g.restore();

  // la copia peor, a la derecha y más abajo
  if (mala > 0.02) {
    g.save();
    g.globalAlpha = mala;
    k.redondo(g, 560, 1080, 460, 520, 16);
    g.fillStyle = "#fff6e4";
    g.fill();
    g.restore();
    g.save();
    g.globalAlpha = mala;
    figura(g, 790, 1320, 0.85, mala);
    g.restore();
  }

  const al = k.claves([
    [Thora - 0.05, 0], [Thora + 0.2, 1], [Tfin - 0.05, 1],
  ]);
  if (al(t) > 0.04) k.pastilla(g, 820, 980, "30", "min", "255,210,120", al(t), 64);
  velo(g, 0.84);
}
