// «Antes, para cambiar de canal tenías que levantarte, ir hasta la tele y girar una rueda.»
// Un salón antiguo, de lado, como un cartel de los años 50. Se entra con un corte en «Antes».
// - «Antes»: el sillón a la izquierda, con unas zapatillas delante, y la tele antigua a la derecha.
// - «levantarte, ir hasta la tele»: las zapatillas cruzan el salón, paso a paso, hasta la tele.
// - «girar una rueda»: la cámara se acerca a la rueda de los canales, que gira a saltos: 2, 3, 4…
import * as k from "#kit";
import { v } from "#voz";
import { camara, mezCam, CAM0 } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f2 = v.frase(2);
export const desde = (vz) => vz.frase(2).inicio;
const T0 = f2.inicio, Tlev = f2.t("levantarte"), Tir = f2.t("ir"), Ttel = f2.t("tele"), Tgir = f2.t("girar"), True = f2.t("rueda"), Fin = v.frase(3).inicio;
const DIAL = { x: 860, y: 1050 };
const CLICS = [Tgir - 0.05, Tgir + 0.25, True + 0.05, True + 0.35];

function sillon(g, x, y) {
  const c = (col) => col;
  g.fillStyle = "#2f8a7a"; k.redondo(g, x - 170, y - 330, 340, 300, 70); g.fill();
  g.fillStyle = "#3aa892"; k.redondo(g, x - 200, y - 90, 400, 120, 40); g.fill();
  g.fillStyle = "#257a6a"; k.redondo(g, x - 230, y - 200, 80, 230, 36); g.fill(); k.redondo(g, x + 150, y - 200, 80, 230, 36); g.fill();
  g.fillStyle = "#4a2a16"; g.fillRect(x - 170, y + 30, 18, 70); g.fillRect(x + 152, y + 30, 18, 70);
}
function teleVieja(g, t, x, y, canal) {
  g.save(); g.shadowColor = "rgba(0,0,0,0.4)"; g.shadowBlur = 40;
  k.redondo(g, x - 210, y - 300, 420, 470, 40); g.fillStyle = "#a0603a"; g.fill(); g.restore();
  k.redondo(g, x - 180, y - 270, 290, 230, 40); g.fillStyle = "#e6e0c8"; g.fill();
  k.redondo(g, x - 168, y - 258, 266, 206, 34); const sg = g.createRadialGradient(x - 35, y - 155, 20, x - 35, y - 155, 180); sg.addColorStop(0, "#d8e8e0"); sg.addColorStop(1, "#6a8a80"); g.fillStyle = sg; g.fill();
  // la imagen: un número de canal grande
  g.fillStyle = "rgba(20,40,36,0.7)"; g.font = "900 120px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(canal), x - 35, y - 150);
  g.fillStyle = "#4a2a16"; g.fillRect(x - 160, y + 170, 18, 90); g.fillRect(x + 142, y + 170, 18, 90);
}
function rueda(g, x, y, r, ang) {
  g.save(); g.translate(x, y);
  g.fillStyle = "#3a2010"; g.beginPath(); g.arc(0, 4, r * 1.25, 0, 6.2832); g.fill();
  g.fillStyle = "#f2e6c8"; g.font = `800 ${Math.round(r * 0.26)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i * 0.4; g.fillText(String(i + 2), Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05); }
  g.rotate(ang);
  const kg = g.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r * 0.8); kg.addColorStop(0, "#fff3d0"); kg.addColorStop(1, "#b89050");
  g.fillStyle = kg; g.beginPath(); g.arc(0, 0, r * 0.78, 0, 6.2832); g.fill();
  g.fillStyle = "#6a4a20"; for (let i = 0; i < 16; i++) { g.save(); g.rotate(i * 0.3927); g.fillRect(-3, -r * 0.78, 6, 14); g.restore(); }
  g.fillStyle = "#e0283c"; g.beginPath(); g.moveTo(0, -r * 0.7); g.lineTo(-10, -r * 0.45); g.lineTo(10, -r * 0.45); g.fill();
  g.restore();
}
function zapatilla(g, x, y, s, alza) {
  g.save(); g.translate(x, y - alza * 40); g.rotate(-alza * 0.2); g.scale(s, s);
  g.fillStyle = "#c94a6a"; g.beginPath(); g.ellipse(0, 0, 70, 26, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#f4d8e0"; g.beginPath(); g.ellipse(-10, -10, 50, 16, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#fff"; g.beginPath(); g.arc(38, -18, 14, 0, 6.2832); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const cam = mezCam({ Z: 1.35, F: { x: 540, y: 1130 } }, { Z: 2.4, F: { x: DIAL.x - 20, y: DIAL.y - 30 } }, su(tr(t, Ttel + 0.1, Tgir - 0.05)));
  g.save(); camara(g, cam);
  // la pared amarilla y el suelo
  g.fillStyle = "#f2c26a"; g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "rgba(255,255,255,0.18)"; for (let x = 0; x < 1080; x += 90) g.fillRect(x, 0, 40, 1300);
  g.fillStyle = "#c25a3a"; g.fillRect(0, 1300, 1080, 620); g.fillStyle = "#a8462a"; g.fillRect(0, 1300, 1080, 24);
  // un cuadro y una lámpara, para que sea un salón
  g.fillStyle = "#6a3a20"; g.fillRect(380, 560, 220, 170); g.fillStyle = "#7ac2c8"; g.fillRect(396, 576, 188, 138); g.fillStyle = "#e8eac8"; g.beginPath(); g.arc(520, 620, 26, 0, 6.2832); g.fill();
  sillon(g, 230, 1300);
  const cambios = CLICS.filter((c) => t > c).length;
  teleVieja(g, t, 860, 1000, 2 + cambios);
  rueda(g, DIAL.x, DIAL.y, 52, CLICS.reduce((a, c) => a + 0.4 * su(tr(t, c, c + 0.12)), 0));
  // las zapatillas: cruzan el salón a pasos
  const anda = tr(t, Tlev, Ttel + 0.1), pasos = 6;
  for (const lado of [0, 1]) {
    const fase = anda * pasos - lado * 0.5, paso = Math.floor(Math.max(0, fase)), u = Math.max(0, fase) - paso;
    const xs = mez(230, 700, Math.min(1, (paso + su(Math.min(1, u * 2))) / pasos));
    zapatilla(g, xs + lado * 70, 1400 + lado * 50, 1.7, anda > 0 && anda < 1 ? Math.sin(Math.min(1, u * 2) * Math.PI) : 0);
  }
  g.restore();
}

export const momentos = { clics: CLICS };
