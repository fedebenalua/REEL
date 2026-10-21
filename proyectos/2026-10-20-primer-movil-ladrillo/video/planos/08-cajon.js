// «Envíaselo a ese amigo que aún guarda su primer móvil en un cajón.»
// Un sitio nuevo: una cómoda de madera con un cajón, en una casa de luz cálida. Una cámara.
// - «Envíaselo»: un avión de papel cruza hacia el amigo.
// - «ese amigo»: el amigo asoma sobre la cómoda, con su nombre.
// - «guarda»: el cajón se abre y se ve lo que hay: cables, pilas, llaves, una bombilla… y el móvil ladrillo.
// - «su primer móvil»: la pantallita del ladrillo se enciende en rojo, «1984», y la cámara se echa sobre él.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, madera } from "../mundo.js";
import { movilLadrillo } from "../cosas.js";

export const desde = (vz) => vz.frase(11).inicio;

const { suave: su, tramo: tr, mez, redondo, azar } = k;
const f = v.frase(11);
const T0 = f.inicio, Tami = f.t("amigo"), Tgua = f.t("guarda"), Tmov = f.t("movil"), Tcaj = f.t("cajon");
const FIN = v.duracion;

const cam = camino2D([[T0, [1.0, 0, 20]], [Tgua + 0.1, [1.0, 0, 20]], [Tmov + 0.8, [1.7, -40, 140]], [FIN, [1.75, -40, 140]]]);
const DR = { x: -450, y: -80, w: 900, h: 420 };

function avion(g, x, y, ang) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(1.7, 1.7);
  g.fillStyle = "#fff"; g.beginPath(); g.moveTo(-70, -10); g.lineTo(90, 0); g.lineTo(-70, 40); g.closePath(); g.fill();
  g.fillStyle = "#cfe0ff"; g.beginPath(); g.moveTo(-70, -10); g.lineTo(90, 0); g.lineTo(-20, 12); g.closePath(); g.fill();
  g.fillStyle = "#9ab8ee"; g.beginPath(); g.moveTo(-20, 12); g.lineTo(90, 0); g.lineTo(-70, 40); g.closePath(); g.fill();
  g.restore();
}

function contenido(g, t, ab) {
  const { x, y, w, h } = DR;
  redondo(g, x, y, w, h, 18); g.fillStyle = "#1c0e06"; g.fill();
  g.save(); redondo(g, x, y, w, h, 18); g.clip();
  const ig = g.createLinearGradient(0, y, 0, y + h); ig.addColorStop(0, "#3a2010"); ig.addColorStop(1, "#24130a"); g.fillStyle = ig; g.fillRect(x, y, w, h);
  const r = azar(5);
  // cables enredados
  g.lineCap = "round"; for (const [col, ox, oy] of [["#ff5a4a", 0, 0], ["#4aa8ff", 80, 40], ["#ffd24a", -60, 80]]) { g.strokeStyle = col; g.lineWidth = 12; g.beginPath(); g.moveTo(x + 80 + ox, y + 120 + oy); g.bezierCurveTo(x + 260 + ox, y + 20 + oy, x + 360 + ox, y + 340 + oy, x + 560 + ox, y + 160 + oy); g.bezierCurveTo(x + 680 + ox, y + 60 + oy, x + 780 + ox, y + 260 + oy, x + 840, y + 100 + oy); g.stroke(); }
  // pilas
  for (const [px, py, a] of [[x + 700, y + 300, 0.4], [x + 160, y + 330, -0.7], [x + 760, y + 90, 1.1]]) { g.save(); g.translate(px, py); g.rotate(a); redondo(g, -60, -22, 120, 44, 12); g.fillStyle = "#2a6ae0"; g.fill(); g.fillStyle = "#d6a82c"; g.fillRect(-60, -22, 28, 44); g.fillRect(60, -9, 12, 18); g.restore(); }
  // llaves
  for (const [px, py, a] of [[x + 470, y + 350, 0.3], [x + 90, y + 60, -0.4]]) { g.save(); g.translate(px, py); g.rotate(a); g.strokeStyle = "#e0c060"; g.lineWidth = 12; g.beginPath(); g.arc(-30, 0, 24, 0, 6.2832); g.moveTo(-6, 0); g.lineTo(70, 0); g.moveTo(52, 0); g.lineTo(52, 20); g.stroke(); g.restore(); }
  // una bombilla y monedas
  g.save(); g.translate(x + 740, y + 200); g.rotate(0.5); g.beginPath(); g.arc(0, 0, 40, 0, 6.2832); g.fillStyle = "rgba(255,240,200,0.75)"; g.fill(); g.fillStyle = "#9a9a9a"; g.fillRect(-18, 36, 36, 34); g.restore();
  for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x + 280 + r() * 160, y + 60 + r() * 60, 18, 0, 6.2832); g.fillStyle = "#d6a82c"; g.fill(); g.strokeStyle = "#8a6a14"; g.lineWidth = 3; g.stroke(); }
  // el móvil ladrillo, tumbado, que se enciende
  const la = su(tr(t, Tmov, Tmov + 0.25));
  g.save(); g.translate(x + w / 2 - 40, y + h / 2 + 5); g.rotate(1.25); g.scale(0.5, 0.5);
  if (la > 0.01) k.brillo(g, 0, 0, 700, "255,60,50", 0.5 * la);
  movilLadrillo(g, t, { led: "1984", ledAl: la, polvo: 1 - la });
  g.restore();
  // la luz sale de golpe cuando se abre
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la pared, de papel de rayas, con luz cálida
  const bg = g.createLinearGradient(0, -1000, 0, 800); bg.addColorStop(0, "#e8b86a"); bg.addColorStop(1, "#b8783a"); g.fillStyle = bg; g.fillRect(-1300, -1500, 2600, 2300);
  g.save(); g.globalAlpha = 0.18; g.fillStyle = "#fff"; for (let x = -1300; x < 1300; x += 110) g.fillRect(x, -1500, 44, 2300); g.restore();
  k.brillo(g, 0, -200, 1100, "255,240,170", 0.35);
  // la cómoda
  madera(g, -560, -140, 1120, 1300, 20, ["#a6713f", "#7b4a25", "#4a2a14"]);
  g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 6; redondo(g, -560, -140, 1120, 1300, 20); g.stroke();
  // el cajón de abajo, de adorno
  redondo(g, -470, 420, 940, 360, 16); g.fillStyle = "rgba(0,0,0,0.18)"; g.fill();
  madera(g, -450, 440, 900, 320, 14, ["#b9824a", "#8a5a2c", "#58321a"]); g.fillStyle = "#e0b04a"; g.beginPath(); g.arc(0, 600, 24, 0, 6.2832); g.fill();
  // el cajón de arriba: por dentro y, delante, su frente que baja al abrirse
  const ab = su(tr(t, Tgua - 0.05, Tgua + 0.6));
  redondo(g, DR.x - 20, DR.y - 20, DR.w + 40, DR.h + 40, 22); g.fillStyle = "rgba(0,0,0,0.35)"; g.fill();
  contenido(g, t, ab);
  // el frente del cajón
  g.save(); g.translate(0, mez(0, 470, ab)); g.scale(1 + 0.04 * ab, 1 + 0.04 * ab);
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30; g.shadowOffsetY = 14; madera(g, DR.x - 10, DR.y - 10, DR.w + 20, DR.h + 20, 14, ["#c08850", "#92602f", "#5e3a1c"]); g.restore();
  g.fillStyle = "#e0b04a"; g.beginPath(); g.arc(0, DR.y + DR.h / 2, 30, 0, 6.2832); g.fill(); g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(-9, DR.y + DR.h / 2 - 9, 10, 0, 6.2832); g.fill();
  g.restore();
  // el avión de papel y el amigo
  const ua = tr(t, T0 - 0.05, Tami + 0.05);
  if (ua > 0 && ua < 1) { const u = su(ua); avion(g, mez(-700, -300, u), mez(-250, -330 - 60 * Math.sin(u * 3.14), u), -0.35 + 0.5 * u); }
  const am = su(tr(t, Tami, Tami + 0.35)) * (1 - su(tr(t, Tgua + 0.1, Tgua + 0.5)));
  if (am > 0.01) {
    g.save(); g.translate(-330, -330); g.scale((0.6 + 0.4 * am) * 1.3, (0.6 + 0.4 * am) * 1.3); g.globalAlpha = am;
    g.beginPath(); g.arc(0, 0, 80, 0, 6.2832); g.fillStyle = "#ffd29a"; g.fill(); g.lineWidth = 8; g.strokeStyle = "#fff"; g.stroke();
    g.fillStyle = "#3a2210"; g.beginPath(); g.arc(-28, -10, 8, 0, 6.2832); g.arc(28, -10, 8, 0, 6.2832); g.fill();
    g.strokeStyle = "#3a2210"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.arc(0, 14, 32, 0.25, Math.PI - 0.25); g.stroke();
    redondo(g, 100, -40, 300, 80, 36); g.fillStyle = "#1d6bff"; g.fill(); g.font = "800 44px Figtree"; g.fillStyle = "#fff"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("Ese amigo", 130, 2);
    g.restore();
  }
  // el anillo de luz al encenderse el móvil
  { const u = (t - Tmov) / 1.0; if (u > 0 && u < 1) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,70,60,${0.8 * (1 - u)})`; g.lineWidth = 12 * (1 - u) + 3; g.beginPath(); g.arc(DR.x + DR.w / 2 - 40, DR.y + DR.h / 2 + 5, 120 + 380 * u, 0, 6.2832); g.stroke(); g.restore(); } }
  sinVista(g);
  velo(g, 0.4);
  vineta(g, 0.5);
}

export const momentos = { amigo: Tami, guarda: Tgua, movil: Tmov, cajon: Tcaj };
