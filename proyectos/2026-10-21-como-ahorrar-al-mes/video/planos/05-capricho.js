// «Cuatro: antes de un capricho, espera un día entero. Muchas veces, al día siguiente ya no lo quieres.»
// Otro sitio: el escaparate de una tienda, con unas zapatillas que brillan y su botón «Comprar». Corte en «Cuatro».
// - «capricho»: las zapatillas giran en su peana, llenas de brillos, y el botón late.
// - «espera un día entero»: por la ventana pasa un día: el cielo va de la noche al día y vuelta, y el reloj da sus vueltas.
// - «al día siguiente»: los brillos se apagan, las zapatillas ya no giran y el botón se queda gris: «ya no lo quieres».
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, velo, vineta } from "../mundo.js";

export const desde = (v) => v.frase(6).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6);
const T0 = f6.inicio, Tcap = f6.t("capricho"), Tesp = f6.t("espera"), Tdia = f6.t("dia"), Tent = f6.t("entero"), Tmuc = f6.t("muchas"), Tsig = f6.t("siguiente"), Tqui = f6.t("quieres"), Fin = v.frase(7).inicio;

const pasa = (t) => su(tr(t, Tesp - 0.1, Tent + 0.4));               // de 0 a 1, el día que pasa
const gana = (t) => 1 - su(tr(t, Tsig - 0.2, Tqui + 0.1));           // las ganas: 1 el primer día, 0 al siguiente

function zapatilla(g, t, gris) {
  const tela = k.mezRgb("255,58,122", "138,138,146", gris), suela = "#ffffff", acento = `rgb(${k.mezRgb("58,208,255", "160,160,168", gris)})`;
  // la suela
  g.beginPath(); g.moveTo(-230, 40); g.quadraticCurveTo(-240, 90, -180, 96); g.lineTo(200, 96); g.quadraticCurveTo(260, 90, 250, 30); g.lineTo(230, 20); g.lineTo(-220, 20); g.closePath();
  g.fillStyle = suela; g.fill(); g.strokeStyle = "rgba(0,0,0,0.15)"; g.lineWidth = 4; g.stroke();
  g.fillStyle = acento; g.fillRect(-200, 60, 420, 12);
  // el cuerpo
  g.beginPath(); g.moveTo(-220, 30); g.bezierCurveTo(-230, -60, -170, -120, -80, -140); g.lineTo(20, -150); g.bezierCurveTo(60, -100, 120, -60, 200, -40); g.bezierCurveTo(260, -20, 260, 20, 240, 26); g.closePath();
  const gr = g.createLinearGradient(0, -150, 0, 30); gr.addColorStop(0, `rgb(${k.mezRgb(tela, "255,255,255", 0.3)})`); gr.addColorStop(1, `rgb(${tela})`); g.fillStyle = gr; g.fill();
  // el logo: un rayo
  g.fillStyle = acento; g.beginPath(); g.moveTo(-140, -10); g.quadraticCurveTo(-20, -40, 140, -70); g.quadraticCurveTo(0, -10, -140, 10); g.closePath(); g.fill();
  // los cordones
  g.strokeStyle = "#ffffff"; g.lineWidth = 7; g.lineCap = "round"; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-60 + i * 30, -130 + i * 12); g.lineTo(-20 + i * 30, -110 + i * 12); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(-90, -100, 60, 16, -0.3, 0, 6.2832); g.fill();
}

export function dibuja(g, t) {
  const d = pasa(t), ganas = gana(t);
  // el cielo por la ventana: noche → día → noche, con el sol cruzando
  g.save(); sinVista(g);
  const luz = Math.sin(Math.PI * d);
  const cielo = g.createLinearGradient(0, 0, 0, 1920); cielo.addColorStop(0, `rgb(${k.mezRgb("20,16,60", "90,180,255", luz)})`); cielo.addColorStop(1, `rgb(${k.mezRgb("70,30,90", "255,200,150", luz)})`);
  g.fillStyle = cielo; g.fillRect(0, 0, 1080, 1920);
  if (d > 0 && d < 1) { const sx = mez(-100, 1180, d), sy = 700 - Math.sin(Math.PI * d) * 450; k.brillo(g, sx, sy, 600, "255,220,140", 0.9 * luz); g.fillStyle = "#fff4c8"; g.beginPath(); g.arc(sx, sy, 60, 0, 6.2832); g.fill(); }
  // la ciudad al fondo
  const az = azar(5); g.fillStyle = `rgb(${k.mezRgb("20,14,40", "60,70,110", luz)})`;
  for (let x = -20; x < 1100; x += 90) { const h = 250 + az() * 300; g.fillRect(x, 1100 - h, 80, h + 900); }
  g.restore();
  const Z = mez(0.95, 1.05, su(tr(t, T0, Fin)));
  vista(g, Z, 0, 80);
  // el escaparate: marco de neón rosa y cristal
  g.fillStyle = "rgba(20,10,30,0.55)"; g.fillRect(-1000, -1300, 2000, 300); g.fillRect(-1000, 980, 2000, 1000);
  g.save(); g.strokeStyle = `rgba(255,80,180,${mez(0.35, 1, ganas)})`; g.lineWidth = 16; k.redondo(g, -470, -760, 940, 1700, 40); g.stroke(); g.restore();
  if (ganas > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,80,180,${0.25 * ganas})`; g.lineWidth = 60; k.redondo(g, -470, -760, 940, 1700, 40); g.stroke(); g.restore(); }
  // la peana y su foco
  const foco = g.createLinearGradient(0, -700, 0, 400); foco.addColorStop(0, `rgba(255,240,200,${0.35 * ganas + 0.05})`); foco.addColorStop(1, "rgba(255,240,200,0)");
  g.fillStyle = foco; g.beginPath(); g.moveTo(-60, -700); g.lineTo(60, -700); g.lineTo(360, 330); g.lineTo(-360, 330); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(0, 330, 340, 70, 0, 0, 6.2832); g.fillStyle = "#e8e4f0"; g.fill(); g.fillStyle = "#b8b2c8"; g.fillRect(-340, 330, 680, 120); g.beginPath(); g.ellipse(0, 450, 340, 70, 0, 0, Math.PI); g.fill();
  // la zapatilla, girando en su peana mientras hay ganas
  const giro = (t - T0) * 1.6 * ganas + (Tsig - T0) * 1.6 * (1 - ganas);
  g.save(); g.translate(0, 190 - 10 * Math.sin(t * 3) * ganas); g.scale(1.3, 1.3); g.scale(Math.cos(giro) * 0.15 + 0.95 * Math.sign(Math.cos(giro) || 1), 1); zapatilla(g, t, 1 - ganas); g.restore();
  // los brillos
  const az2 = azar(77);
  for (let i = 0; i < 14; i++) { const x = (az2() - 0.5) * 600, y = 50 + (az2() - 0.5) * 300, f = az2() * 6; k.brillo(g, x, y, 90, "255,255,255", ganas * Math.pow(Math.max(0, Math.sin(t * 5 + f)), 6)); }
  // la etiqueta del precio
  g.save(); g.translate(-270, -60); g.rotate(-0.15); k.redondo(g, -80, -40, 160, 80, 14); g.fillStyle = "#fff6d8"; g.fill(); g.font = "800 46px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#1a1c24"; g.fillText("89 €", 0, 4); g.restore();
  // el botón «Comprar»: late con ganas; gris al día siguiente
  const late = 1 + 0.05 * Math.sin(t * 7) * ganas;
  g.save(); g.translate(0, 650); g.scale(late, late);
  k.redondo(g, -280, -75, 560, 150, 75); g.fillStyle = `rgb(${k.mezRgb("120,124,135", "255,70,130", ganas)})`; g.fill();
  if (ganas > 0.01) k.brillo(g, 0, 0, 700, "255,80,150", 0.45 * ganas);
  g.font = "800 72px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffffff"; g.fillText("Comprar", 0, 4);
  g.restore();
  // el reloj del escaparate: da dos vueltas en el día que pasa
  g.save(); g.translate(300, -400);
  g.beginPath(); g.arc(0, 0, 120, 0, 6.2832); g.fillStyle = "#fbfaf6"; g.fill(); g.strokeStyle = "#2a2c34"; g.lineWidth = 10; g.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.2832; g.fillStyle = "#2a2c34"; g.fillRect(Math.cos(a) * 96 - 4, Math.sin(a) * 96 - 4, 8, 8); }
  const h = d * 2 * 6.2832, m = d * 24 * 6.2832; g.lineCap = "round";
  g.strokeStyle = "#1a1c24"; g.lineWidth = 12; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(h) * 60, -Math.cos(h) * 60); g.stroke();
  g.strokeStyle = "#ff3a7a"; g.lineWidth = 7; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(m) * 95, -Math.cos(m) * 95); g.stroke();
  g.restore();
  sinVista(g);
  const p = su(tr(t, Tdia - 0.1, Tdia + 0.2)) * (1 - su(tr(t, Tmuc - 0.1, Tmuc + 0.2)));
  if (p > 0.01) k.pastilla(g, 540, 1350, "24 h", "", "255,240,200", p, 110);
  vineta(g, 0.45);
  velo(g, 0.45, "20,10,40");
}
