// «Dos: revisa tus suscripciones. Tres de diez euros que ya no usas son trescientos sesenta euros al año.»
// Otro sitio: tu móvil, enorme, con la lista de suscripciones. Corte en «Dos».
// - «revisa»: el dedo baja por la lista; «tres de diez euros»: se encienden tres, cada una con «10 €/mes», y de cada
//   una sale una moneda que se escapa cada pocos instantes.
// - «ya no usas»: las tres se apagan a gris; el dedo las va tachando y se van de la lista.
// - «trescientos sesenta euros al año»: «360 € al año», en verde.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, moneda, velo, vineta, VERDE } from "../mundo.js";

export const desde = (v) => v.frase(4).inicio;

const { suave: su, tramo: tr, mez } = k;
const f4 = v.frase(4);
const T0 = f4.inicio, Trev = f4.t("revisa"), Tsus = f4.t("suscripciones"), Ttres = f4.t("tres"), Tdiez = f4.t("diez"), Tusas = f4.t("usas"), Tson = f4.t("son"), Ttre = f4.t("trescientos"), Fin = v.frase(5).inicio;

const APPS = [
  { c0: "#ff4f6a", c1: "#b81e3a", ic: "play", nombre: "Series" },
  { c0: "#3ad08a", c1: "#138a52", ic: "nota", nombre: "Música" },
  { c0: "#6a8cff", c1: "#3446c8", ic: "pesa", nombre: "Gimnasio" },
];
const TACHA = [Tson - 0.1, Tson + 0.15, Tson + 0.4].map((x, i) => x - 0.45 + i * 0.05);

function icono(g, tipo) {
  g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineWidth = 10; g.lineCap = "round";
  if (tipo === "play") { g.beginPath(); g.moveTo(-18, -26); g.lineTo(28, 0); g.lineTo(-18, 26); g.closePath(); g.fill(); }
  if (tipo === "nota") { g.beginPath(); g.arc(-12, 18, 14, 0, 6.2832); g.fill(); g.beginPath(); g.moveTo(0, 18); g.lineTo(0, -30); g.lineTo(24, -20); g.stroke(); }
  if (tipo === "pesa") { g.fillRect(-30, -6, 60, 12); g.fillRect(-36, -22, 12, 44); g.fillRect(24, -22, 12, 44); }
}
function movil(g, t) {
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 80; g.shadowOffsetY = 40; k.redondo(g, -400, -780, 800, 1560, 110); g.fillStyle = "#15171c"; g.fill(); g.restore();
  k.redondo(g, -400, -780, 800, 1560, 110); k.metal(g, -400, 400, ["#2a2d34", "#8a909c", "#3a3e46", "#b0b6c0", "#22252b"]);
  k.redondo(g, -370, -750, 740, 1500, 86); const sg = g.createLinearGradient(0, -750, 0, 750); sg.addColorStop(0, "#f6f7fb"); sg.addColorStop(1, "#e3e6ee"); g.fillStyle = sg; g.fill();
  k.redondo(g, -90, -728, 180, 44, 22); g.fillStyle = "#0c0d10"; g.fill();
  g.font = "800 58px Figtree"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillStyle = "#1a1c24"; g.fillText("Suscripciones", -320, -590);
}

export function dibuja(g, t) {
  g.save(); sinVista(g);
  const bg = g.createLinearGradient(0, 0, 1080, 1920); bg.addColorStop(0, "#6a2a9a"); bg.addColorStop(1, "#1a0a3a"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 900, 1600, "255,120,200", 0.3);
  g.restore();
  const Z = mez(0.86, 0.95, su(tr(t, T0, Fin))), scroll = mez(120, 0, su(tr(t, Trev - 0.1, Tsus + 0.3)));
  vista(g, Z, 0, -120);
  movil(g, t);
  // la lista (se recorta a la pantalla)
  g.save(); k.redondo(g, -370, -520, 740, 1270, 30); g.clip();
  const enc = su(tr(t, Tdiez - 0.2, Tdiez + 0.2)), gris = su(tr(t, Tusas - 0.2, Tusas + 0.2));
  let y = -470 + scroll;
  for (const [i, a] of APPS.entries()) {
    const fuera = k.sale(tr(t, TACHA[i] + 0.15, TACHA[i] + 0.5)), alto = 230 * (1 - fuera);
    if (alto > 2) {
      g.save(); g.translate(fuera * 900, 0); g.globalAlpha = 1 - fuera;
      k.redondo(g, -340, y, 680, 210, 34); g.fillStyle = "#ffffff"; g.fill(); g.strokeStyle = enc > 0 ? `rgba(255,90,120,${0.8 * enc * (1 - gris)})` : "rgba(0,0,0,0.06)"; g.lineWidth = 6; g.stroke();
      k.redondo(g, -310, y + 30, 150, 150, 36); const ig = g.createLinearGradient(-310, y + 30, -160, y + 180); ig.addColorStop(0, gris > 0.5 ? "#b4b8c2" : a.c0); ig.addColorStop(1, gris > 0.5 ? "#7a7e88" : a.c1); g.fillStyle = ig; g.fill();
      g.save(); g.translate(-235, y + 105); icono(g, a.ic); g.restore();
      g.textAlign = "left"; g.font = "800 50px Figtree"; g.fillStyle = gris > 0.5 ? "#8a8e98" : "#1a1c24"; g.fillText(a.nombre, -130, y + 75);
      g.font = "700 42px Figtree"; g.fillStyle = `rgb(${k.mezRgb("90,96,110", "220,50,80", enc * (1 - gris))})`; g.fillText("10 € / mes", -130, y + 140);
      if (gris > 0.01) { g.font = "700 30px Figtree"; g.fillStyle = `rgba(140,144,155,${gris})`; g.fillText("sin usar desde hace meses", -130, y + 185); }
      // la tachadura
      const ta = su(tr(t, TACHA[i] - 0.15, TACHA[i] + 0.1));
      if (ta > 0) { g.strokeStyle = "#ff3a4a"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(-320, y + 105); g.lineTo(-320 + 640 * ta, y + 105); g.stroke(); }
      g.restore();
      // la moneda que se escapa de cada una
      for (let j = 0; j < 4; j++) { const t0 = T0 + 0.2 + i * 0.25 + j * 1.1, u = tr(t, t0, t0 + 1.0); if (u <= 0 || u >= 1 || t0 > Tusas) continue; moneda(g, 250 + u * 200, y + 100 - u * 260, 36, u * 2, Math.sin(Math.PI * u) * (1 - fuera)); }
    }
    y += alto;
  }
  // otras de abajo, que se quedan (las que sí usas)
  for (let i = 0; i < 3; i++) { k.redondo(g, -340, y + i * 230, 680, 210, 34); g.fillStyle = "#ffffff"; g.fill(); k.redondo(g, -310, y + 30 + i * 230, 150, 150, 36); g.fillStyle = ["#ffb43a", "#38c4e8", "#c47aff"][i]; g.fill(); g.fillStyle = "#d8dbe2"; k.redondo(g, -130, y + 60 + i * 230, 300, 30, 15); g.fill(); k.redondo(g, -130, y + 115 + i * 230, 200, 26, 13); g.fill(); }
  g.restore();
  // el dedo que recorre y tacha
  let fx = 120, fy = 900, al = su(tr(t, Trev - 0.4, Trev)) * (1 - su(tr(t, Fin - 0.6, Fin - 0.3)));
  if (t < Tson - 0.6) { fx = 160; fy = mez(700, 300, su(tr(t, Trev, Tsus + 0.4))); }
  else { const i = Math.min(2, Math.max(0, TACHA.findIndex((x) => t < x + 0.2))); fx = mez(-260, 300, su(tr(t, TACHA[i] - 0.15, TACHA[i] + 0.1))); fy = -470 + 105 + 20; }
  if (al > 0.01) { g.save(); g.globalAlpha = al; g.translate(fx, fy); k.redondo(g, -55, 0, 110, 520, 55); const dg = g.createLinearGradient(-55, 0, 55, 0); dg.addColorStop(0, "#c27a62"); dg.addColorStop(0.4, "#ffd2bc"); dg.addColorStop(1, "#c27a62"); g.fillStyle = dg; g.fill(); k.redondo(g, -34, 14, 68, 70, 24); g.fillStyle = "rgba(255,240,235,0.85)"; g.fill(); g.restore(); }
  sinVista(g);
  const p = su(tr(t, Ttre - 0.1, Ttre + 0.2)) * (1 - su(tr(t, Fin - 0.5, Fin - 0.2)));
  if (p > 0.01) { const s = 1 + 0.2 * k.pulso(t, Ttre + 0.05, 0.12); g.save(); g.translate(540, 1320); g.scale(s, s); k.pastilla(g, 0, 0, "360 €", "al año", VERDE, p, 130); g.restore(); }
  vineta(g, 0.45);
  velo(g, 0.45, "30,10,50");
}
