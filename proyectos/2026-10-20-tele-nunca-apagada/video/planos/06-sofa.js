// «Envíaselo a ese amigo que siempre se deja la tele encendida.»
// Otro sitio: el salón de neón de madrugada. Un amigo dormido en el sofá, con la tele encendida delante. Se entra con
// un corte en «Envíaselo». Una sola cámara, que se acerca despacio.
// - «a ese amigo»: un aro de luz señala al durmiente, que respira con sus «z».
// - «que siempre se deja la tele encendida»: la tele, enorme, sigue a todo color y baña de luz al amigo, que ni se entera.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, canal } from "../mundo.js";
import { tubo, rect, circulo, linea, CIAN, ROSA, AMARILLO } from "../neon.js";

export const desde = (vz) => vz.frase(15).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f = v.frase(15);
const T0 = f.inicio, Tami = f.t("amigo"), Tsie = f.t("siempre"), Tdej = f.t("deja"), Ttel = f.t("tele"), Tenc = f.t("encendida");

const cam = camino2D([[T0, [1.18, 540, 880]], [v.duracion, [1.26, 540, 900]]]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la pared, a oscuras
  const bg = g.createLinearGradient(0, 0, 0, 1700); bg.addColorStop(0, "#090320"); bg.addColorStop(1, "#1b0a45"); g.fillStyle = bg; g.fillRect(-400, -400, 1880, 2400);
  // la luz de la tele parpadea sobre todo, más fuerte en «tele encendida»
  const fl = 0.85 + 0.15 * Math.sin(t * 7.3) * Math.sin(t * 3.1) + 0.35 * k.pulso(t, Ttel, 0.5);
  k.brillo(g, 540, 780, 1700, "120,110,255", 0.28 * fl);
  k.brillo(g, 540, 900, 1100, "255,70,200", 0.2 * fl);
  // la tele
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; redondo(g, 120, 540, 840, 470, 24); g.fillStyle = "#07080d"; g.fill(); g.restore();
  g.save(); redondo(g, 140, 560, 800, 420, 12); g.clip(); g.translate(140, 560); canal(g, 0, 800, 420, t); g.restore();
  tubo(g, rect(120, 540, 840, 470, 24), CIAN, 7, 0.9);
  // el ojito encendido de la tele, abajo
  { const b = 0.5 + 0.5 * Math.sin(t * 3.4); k.brillo(g, 540, 1000, 40, "255,70,105", 0.0); }
  // el sofá
  g.save();
  redondo(g, 20, 1030, 1040, 330, 60); const sg = g.createLinearGradient(0, 1030, 0, 1360); sg.addColorStop(0, "#2a1166"); sg.addColorStop(1, "#12063a"); g.fillStyle = sg; g.fill();
  tubo(g, rect(20, 1030, 1040, 330, 60), ROSA, 8, 0.95);
  redondo(g, -20, 1180, 1120, 220, 50); const ag = g.createLinearGradient(0, 1180, 0, 1400); ag.addColorStop(0, "#35167f"); ag.addColorStop(1, "#14073f"); g.fillStyle = ag; g.fill();
  tubo(g, rect(-20, 1180, 1120, 220, 50), ROSA, 8, 0.95);
  g.restore();
  // el amigo, tumbado: cojín, cabeza, cuerpo bajo la manta
  const resp = Math.sin(t * 2.2);
  g.save();
  redondo(g, 130, 1130, 220, 90, 40); g.fillStyle = "#3d1b92"; g.fill(); tubo(g, rect(130, 1130, 220, 90, 40), CIAN, 5, 0.8);
  // la manta, con rayas de neón
  g.save(); g.translate(0, 1190); g.scale(1, 1 + 0.03 * resp); g.translate(0, -1190);
  redondo(g, 280, 1110, 640, 150, 70); const mg = g.createLinearGradient(280, 1110, 920, 1260); mg.addColorStop(0, "#4a1d90"); mg.addColorStop(1, "#7a1f9a"); g.fillStyle = mg; g.fill();
  g.save(); redondo(g, 280, 1110, 640, 150, 70); g.clip(); for (let i = 0; i < 6; i++) { tubo(g, linea([360 + i * 100, 1090], [330 + i * 100, 1280]), i % 2 ? CIAN : AMARILLO, 5, 0.7); } g.restore();
  tubo(g, rect(280, 1110, 640, 150, 70), ROSA, 6, 0.9);
  g.restore();
  // los pies
  g.beginPath(); g.ellipse(940, 1190, 54, 40, 0.1, 0, 6.2832); g.fillStyle = "#f2b896"; g.fill(); tubo(g, circulo(940, 1190, 0.1), ROSA, 1, 0);
  // la cabeza, con pelo, ojos cerrados y boca abierta
  g.save(); g.translate(250, 1095 + 3 * resp);
  g.beginPath(); g.arc(0, 0, 88, 0, 6.2832); const pg = g.createRadialGradient(-20, -24, 8, 0, 0, 90); pg.addColorStop(0, "#ffd9bf"); pg.addColorStop(1, "#e0a07c"); g.fillStyle = pg; g.fill();
  g.beginPath(); g.arc(0, -10, 90, Math.PI * 1.02, Math.PI * 1.98); g.lineTo(60, -34); g.quadraticCurveTo(0, -60, -62, -34); g.closePath(); g.fillStyle = "#1c0f3a"; g.fill();
  g.strokeStyle = "#3a1a14"; g.lineWidth = 7; g.lineCap = "round"; for (const ex of [-30, 30]) { g.beginPath(); g.arc(ex, 6, 14, 0.2, Math.PI - 0.2); g.stroke(); }
  g.beginPath(); g.ellipse(2, 46, 13, 8 + 4 * (resp > 0 ? resp : 0), 0, 0, 6.2832); g.fillStyle = "#6a2020"; g.fill();
  // el brillo de la tele en la mejilla
  g.globalCompositeOperation = "lighter"; k.brillo(g, 40, -10, 90, "120,180,255", 0.25 * fl);
  g.restore();
  g.restore();
  // las «z» que suben
  g.save(); g.fillStyle = "#cdbfff"; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i < 3; i++) { const ph = (t * 0.45 + i / 3) % 1, s = 40 + 40 * ph; g.globalAlpha = Math.sin(ph * Math.PI) * 0.95; g.font = `800 ${s}px Figtree`; g.shadowColor = "rgba(180,160,255,0.9)"; g.shadowBlur = 18; g.fillText("z", 330 + 70 * ph + 26 * i, 1030 - 160 * ph); }
  g.restore();
  // un aro de luz que señala al amigo en «amigo»
  const ar = k.pulso(t, Tami + 0.45, 0.45);
  if (ar > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,226,90,${0.9 * ar})`; g.lineWidth = 10; g.beginPath(); g.arc(250, 1095, 120 + 200 * (1 - ar), 0, 6.2832); g.stroke(); g.restore(); }
  sinVista(g);
  const d = t - Ttel; if (d > 0) k.fogonazo(g, 540, 780, d, 700, "160,190,255");
  velo(g, 0.5);
  vineta(g, 0.5);
}

export const momentos = { amigo: Tami, tele: Ttel };
