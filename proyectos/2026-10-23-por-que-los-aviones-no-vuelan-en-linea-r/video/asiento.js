// «Envíaselo a ese amigo que mira el mapa del asiento y cree que el piloto se ha equivocado.»
// La pantalla del respaldo de un asiento de avión con el mapa del vuelo (el de siempre: la curva sobre el Atlántico). La
// pantalla se hace grande hasta llenar todo el vídeo y el mapa vuelve a su primer fotograma: el del hook.
import * as k from "#kit";
import { v } from "#voz";
import { escenaMapa } from "./escena.js";

const { suave, tramo, mez, azar, lienzo, redondo } = k;
export const T13 = v.frase(13).inicio;
const Tmapa = v.frase(13).t("mapa"), Tcree = v.frase(13).t("cree");
const FIN = v.frase(13).finDe("equivocado");

const mapa = lienzo(1080, 1920), gm = mapa.getContext("2d");
const tela = (() => { const l = lienzo(1080, 1920), c = l.getContext("2d"), az = azar(12); for (let i = 0; i < 5200; i++) { c.fillStyle = `rgba(${az() < 0.5 ? "255,255,255" : "0,0,0"},${0.02 + az() * 0.05})`; c.fillRect(az() * 1080, az() * 1920, 2 + az() * 3, 1 + az() * 2); } return l; })();

export function escenaAsiento(g, t) {
  // el reloj del mapa: del momento del avión a mitad de camino hacia atrás, hasta el primer fotograma del hook
  const tx = 6.9 * (1 - suave(tramo(t, T13 + 0.3, FIN + 0.1)));
  gm.clearRect(0, 0, 1080, 1920);
  escenaMapa(gm, tx);

  const z = suave(tramo(t, Tmapa - 0.55, FIN + 0.05));
  const x = mez(110, 0, z), y = mez(780, 0, z), w = mez(860, 1080, z), h = mez(600, 1920, z), r = mez(44, 0, z);

  // la cabina: oscura, con la luz de la pantalla
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#0a1230"); bg.addColorStop(1, "#16213f");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  // el respaldo del asiento
  g.save();
  const sg = g.createLinearGradient(0, 300, 0, 1750);
  sg.addColorStop(0, "#3a4a78"); sg.addColorStop(1, "#222d52");
  redondo(g, 34, 330, 1012, 1400, 150); g.fillStyle = sg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "overlay"; g.globalAlpha = 0.5; g.drawImage(tela, 0, 0); g.restore();
  // la costura y el reposacabezas
  g.strokeStyle = "rgba(0,0,20,0.35)"; g.lineWidth = 4; g.setLineDash([18, 14]);
  redondo(g, 66, 362, 948, 1336, 124); g.stroke(); g.setLineDash([]);
  const hg = g.createLinearGradient(0, 330, 0, 640);
  hg.addColorStop(0, "rgba(255,255,255,0.12)"); hg.addColorStop(1, "rgba(255,255,255,0)");
  redondo(g, 34, 330, 1012, 320, 150); g.fillStyle = hg; g.fill();
  g.restore();

  // el marco y la pantalla
  const m = 36 * (1 - z);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50 * (1 - z); g.shadowOffsetY = 18 * (1 - z);
  redondo(g, x - m, y - m, w + 2 * m, h + 2 * m, r + m); g.fillStyle = "#05070d"; g.fill();
  g.restore();
  g.save();
  redondo(g, x, y, w, h, r); g.clip();
  const c = Math.max(w / 1080, h / 1920);
  g.drawImage(mapa, x + w / 2 - 540 * c, y + h / 2 - 960 * c, 1080 * c, 1920 * c);
  // el brillo del cristal
  const rg = g.createLinearGradient(x, y, x + w, y + h);
  rg.addColorStop(0, `rgba(255,255,255,${0.16 * (1 - z)})`); rg.addColorStop(0.35, "rgba(255,255,255,0)"); rg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(x, y, w, h);
  g.restore();
  g.save(); redondo(g, x, y, w, h, r); g.strokeStyle = `rgba(255,255,255,${0.12 * (1 - z)})`; g.lineWidth = 3; g.stroke(); g.restore();

  // el «¿?» del que mira y duda
  const a = suave(tramo(t, Tcree, Tcree + 0.3)) * (1 - suave(tramo(t, FIN - 0.6, FIN - 0.1)));
  if (a > 0.01) {
    const bx = 830, by = 640 + 8 * Math.sin(t * 3);
    g.save(); g.globalAlpha = a;
    g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 24; g.shadowOffsetY = 8;
    g.beginPath(); g.ellipse(bx, by, 120, 90, 0, 0, 6.2832); g.fillStyle = "#fff"; g.fill();
    g.beginPath(); g.moveTo(bx - 60, by + 70); g.lineTo(bx - 120, by + 150); g.lineTo(bx - 10, by + 84); g.closePath(); g.fill();
    g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0;
    g.fillStyle = "#1a2547"; g.font = "800 120px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("¿?", bx, by + 6);
    g.restore();
  }
}
