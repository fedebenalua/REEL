// Vátern de perfil, cortado: el depósito detrás, la taza delante, el agua sale por la goma
// del fondo (no por un grifo). La taza se reconoce por el asiento ovalado y la tapa levantada.
import * as k from "#kit";
import { PORCELANA, CROMO, gradH, gradV, bano, chorro, salpicar, lamina, gota } from "./mundo.js";

export const BOL = { x: 210, y: 30 };
const SUELO = 520;

function caja(g, x, y, w, h, r) {
  g.beginPath();
  k.redondo(g, x, y, w, h, r);
  g.fillStyle = gradH(g, x, x + w, PORCELANA);
  g.fill();
  g.save();
  g.clip();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(x + 18, y, 28, h);
  g.restore();
}

export function dibujaBano(g, t, o = {}) {
  const fuga = o.fuga ?? 1;
  const inunda = o.inunda ?? 0;
  bano(g, SUELO);

  // sombra en el suelo
  g.fillStyle = "rgba(0,16,24,0.3)";
  g.beginPath();
  g.ellipse(40, SUELO + 8, 390, 28, 0, 0, 6.28);
  g.fill();

  // base
  caja(g, -170, 250, 280, 270, 18);
  // falda de la taza (el bulbo de porcelana)
  g.beginPath();
  g.moveTo(-40, -20);
  g.bezierCurveTo(-30, 140, -80, 230, -150, 270);
  g.lineTo(80, 270);
  g.bezierCurveTo(200, 240, 430, 160, 460, 20);
  g.bezierCurveTo(470, -40, 400, -130, 280, -150);
  g.lineTo(-20, -150);
  g.closePath();
  g.fillStyle = gradH(g, -80, 460, PORCELANA);
  g.fill();
  g.save();
  g.clip();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(40, -150, 36, 400);
  g.restore();

  // depósito, detrás, con tapa
  caja(g, -430, -700, 340, 560, 36);
  // tapa del depósito, un poco separada para ver que es un tanque
  g.beginPath();
  k.redondo(g, -450, -760, 380, 70, 24);
  g.fillStyle = gradH(g, -450, -70, PORCELANA);
  g.fill();
  g.fillStyle = "rgba(40,60,80,0.25)";
  g.fillRect(-420, -692, 300, 6);

  // interior del depósito (corte)
  g.beginPath();
  k.redondo(g, -390, -640, 250, 430, 16);
  g.fillStyle = gradV(g, -640, -210, [[0, "#d7e6f0"], [1, "#b9ccd8"]]);
  g.fill();
  lamina(g, -380, -360, 230, 140, t, 0.92);
  // tubo de rebose
  g.fillStyle = gradH(g, -160, -120, [[0, "#f4fafc"], [1, "#8eacbc"]]);
  g.fillRect(-156, -600, 34, 250);
  g.beginPath();
  g.ellipse(-139, -600, 17, 7, 0, 0, 6.28);
  g.fillStyle = "#16324a";
  g.fill();
  // goma en el fondo del depósito
  g.beginPath();
  g.ellipse(-250, -200, 54, 26, 0, 0, 6.28);
  g.fillStyle = "#10202c";
  g.fill();
  g.beginPath();
  g.ellipse(-250, -206, 50, 22, 0, 0, 6.28);
  g.fillStyle = "#5a3028";
  g.fill();

  // maneta en el frontal del depósito
  g.save();
  g.translate(-250, -460);
  g.fillStyle = gradH(g, -16, 16, CROMO);
  g.fillRect(-10, -8, 20, 70);
  g.beginPath();
  g.ellipse(0, 62, 16, 10, 0, 0, 6.28);
  g.fill();
  g.restore();

  // el chorro: sale de la goma, baja por el paso y revienta en la taza
  g.save();
  g.beginPath();
  g.moveTo(-290, -180);
  g.bezierCurveTo(-200, -40, -40, 40, BOL.x - 20, BOL.y + 20);
  g.lineTo(BOL.x + 30, BOL.y + 50);
  g.bezierCurveTo(-20, 80, -180, 0, -230, -170);
  g.closePath();
  g.fillStyle = gradH(g, -280, 200, [[0, "rgba(20,90,200,0.95)"], [0.5, "rgba(150,220,255,0.9)"], [1, "rgba(20,110,220,0.92)"]]);
  g.globalAlpha = 0.95 * fuga;
  g.fill();
  g.restore();
  // vetas que corren a lo largo del chorro
  chorro(g, -80, -80, BOL.y + 10, 54 * fuga, t, fuga);

  // boca de la taza: óvalo de agua, con el asiento alrededor
  g.save();
  g.translate(BOL.x, BOL.y);
  g.beginPath();
  g.ellipse(0, 0, 210, 92, -0.15, 0, 6.28);
  g.fillStyle = "#e9f3f8";
  g.fill();
  g.beginPath();
  g.ellipse(0, 6, 168, 68, -0.15, 0, 6.28);
  g.save();
  g.clip();
  lamina(g, -180, -20, 360, 90, t, 1);
  // remolino
  g.strokeStyle = "rgba(230,250,255,0.75)";
  g.lineWidth = 6;
  const a = t * 4;
  g.beginPath();
  g.ellipse(Math.cos(a) * 20, Math.sin(a) * 8, 70, 28, a, 0, 5);
  g.stroke();
  g.restore();
  // asiento (aro)
  g.beginPath();
  g.ellipse(0, 0, 210, 92, -0.15, 0, 6.28);
  g.lineWidth = 28;
  g.strokeStyle = "#f7fbfe";
  g.stroke();
  g.lineWidth = 6;
  g.strokeStyle = "rgba(60,90,110,0.35)";
  g.stroke();
  g.restore();

  salpicar(g, BOL.x, BOL.y + 10, t, fuga, 1.05);
  const ang = t * 3.2;
  gota(g, BOL.x + Math.cos(ang) * 100, BOL.y + Math.sin(ang) * 28, 18, fuga, 1.15);

  // tapa levantada, detrás del asiento
  g.save();
  g.translate(80, -80);
  g.rotate(-1.05);
  g.beginPath();
  g.ellipse(0, 0, 200, 70, 0, 0, 6.28);
  g.fillStyle = gradH(g, -200, 200, PORCELANA);
  g.fill();
  g.strokeStyle = "rgba(40,70,90,0.4)";
  g.lineWidth = 8;
  g.stroke();
  g.restore();

  // charco
  if (inunda > 0.02) {
    g.save();
    g.globalAlpha = 0.8;
    g.beginPath();
    g.ellipse(80, SUELO + 4, 90 + inunda * 380, 16 + inunda * 34, 0, 0, 6.28);
    g.fillStyle = "rgba(50,160,230,0.5)";
    g.fill();
    g.restore();
  }

  // toalla coral, lejos del váter, solo color
  g.save();
  g.translate(560, SUELO - 40);
  g.beginPath();
  k.redondo(g, -40, -160, 90, 200, 16);
  g.fillStyle = gradV(g, -160, 40, [[0, "#ff8d6a"], [1, "#d24a30"]]);
  g.fill();
  g.restore();
}
