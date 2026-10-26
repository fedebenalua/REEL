// «Hace unos seis millones de años, en el este se fue la mayor parte del agua y el nivel cayó más de un
// kilómetro y medio. Pero no hasta el polvo: en el fondo quedó un lago de sal de más de un kilómetro.»
// Un cañón. El nivel baja, la playa y un barco se quedan arriba, y abajo hay un lago, no polvo.
import * as k from "#kit";
import { v } from "#voz";
import { velo, lago } from "../mundo.js";

export const desde = "hace";

const f5 = v.frase(5), f6 = v.frase(6);
const Tbaja = f5.t("este");
const Tagua = f5.t("agua");
const Tkm = f5.t("kilometro");
const Tmedio = f5.finDe("medio");
const Tpolvo = f6.t("polvo");
const Tlago = f6.t("lago");

export function dibuja(g, t) {
  const baja = k.suave(k.tramo(t, Tbaja, Tmedio));
  const enLago = k.suave(k.tramo(t, Tpolvo - 0.15, Tlago + 0.3));
  const scroll = baja * 1500;
  const yAgua = k.mez(780, 1360, baja) - enLago * 80;

  const cg = g.createLinearGradient(0, 0, 0, 1920);
  cg.addColorStop(0, "#16386e");
  cg.addColorStop(0.35, "#e8b56e");
  cg.addColorStop(1, "#6a3a2c");
  g.fillStyle = cg;
  g.fillRect(0, 0, 1080, 1920);

  // paredes de roca, irregulares, a los lados del cañón
  pared(g, -1);
  pared(g, 1);

  // la playa que se queda colgada
  const yPlaya = 640 - scroll;
  if (yPlaya > -180 && yPlaya < 1700) {
    g.fillStyle = "#f3d7ae";
    g.fillRect(230, yPlaya, 620, 28);
    g.fillStyle = "#e23d3d";
    g.beginPath();
    g.arc(400, yPlaya, 42, Math.PI, 0);
    g.fill();
    g.fillStyle = "#e7d2a8";
    g.fillRect(394, yPlaya, 12, 36);
  }

  // el ferry, grande, pasa por el centro cuando se va el agua
  const scrollEn = (tt) => 1500 * k.suave(k.tramo(tt, Tbaja, Tmedio));
  const yAguaEn = (tt) => k.mez(780, 1360, k.suave(k.tramo(tt, Tbaja, Tmedio)));
  const yBarco = yAguaEn(Tagua) - 120 - (scroll - scrollEn(Tagua));
  if (yBarco > -280 && yBarco < 1900 && enLago < 0.8) {
    g.fillStyle = "#c98462";
    g.beginPath();
    g.moveTo(250, yBarco + 90);
    g.lineTo(830, yBarco + 70);
    g.lineTo(860, yBarco + 120);
    g.lineTo(230, yBarco + 130);
    g.closePath();
    g.fill();
    barco(g, 540, yBarco);
  }

  // el agua del cañón
  g.save();
  g.beginPath();
  g.rect(210, 0, 660, 1920);
  g.clip();
  const colSup = enLago > 0.5 ? "#9ff6e4" : "#8ee7f2";
  const colFon = enLago > 0.5 ? "#0c6e72" : "#083048";
  const ag = g.createLinearGradient(0, yAgua - 20, 0, 1920);
  ag.addColorStop(0, colSup);
  ag.addColorStop(0.18, enLago > 0.5 ? "#14b8a8" : "#127eae");
  ag.addColorStop(1, colFon);
  g.fillStyle = ag;
  g.fillRect(210, yAgua, 660, 2000);
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 6;
  g.beginPath();
  for (let x = 210; x <= 870; x += 16) {
    const y = yAgua + Math.sin(x * 0.02 + t * 2.4) * 8 + Math.sin(x * 0.008 - t) * 6;
    if (x === 210) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke();
  g.restore();

  // en «polvo» no hay polvo: orillas de sal y el lago
  if (enLago > 0.01) {
    g.save();
    g.globalAlpha = enLago;
    orilla(g, 200, yAgua + 20, -1);
    orilla(g, 880, yAgua + 10, 1);
    lago(g, 540, Math.min(1500, yAgua + 220), 250, 140, t, 1);
    k.brillo(g, 540, yAgua + 180, 640, "cian", 0.28);
    g.restore();
  }

  // en «kilómetro» la pared llena casi todo: el agua ya va muy abajo
  if (t > Tkm - 0.2 && t < Tkm + 0.8) {
    // nada que añadir: el nivel ya está bajo. Un velo de calor.
    k.brillo(g, 540, 900, 500, "sodio", 0.08 * k.pulso(t, Tkm + 0.1, 0.25));
  }

  velo(g, 0.68);
}

function pared(g, dir) {
  g.save();
  g.beginPath();
  if (dir < 0) {
    g.moveTo(-40, -40);
    g.lineTo(300, -40);
    g.lineTo(250, 280);
    g.lineTo(340, 520);
    g.lineTo(230, 860);
    g.lineTo(310, 1240);
    g.lineTo(220, 1600);
    g.lineTo(280, 1980);
    g.lineTo(-40, 1980);
  } else {
    g.moveTo(1120, -40);
    g.lineTo(780, -40);
    g.lineTo(840, 300);
    g.lineTo(740, 560);
    g.lineTo(860, 900);
    g.lineTo(760, 1280);
    g.lineTo(870, 1620);
    g.lineTo(800, 1980);
    g.lineTo(1120, 1980);
  }
  g.closePath();
  const lg = g.createLinearGradient(dir < 0 ? 0 : 1080, 0, dir < 0 ? 340 : 740, 1600);
  lg.addColorStop(0, "#f0c7a2");
  lg.addColorStop(0.35, "#d4845c");
  lg.addColorStop(0.7, "#8a4634");
  lg.addColorStop(1, "#3e221c");
  g.fillStyle = lg;
  g.fill();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.4;
  g.drawImage(k.manchas, dir < 0 ? -80 : 500, 0, 700, 1920);
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.15;
  g.drawImage(k.red, dir < 0 ? 0 : 600, 200, 400, 1400);
  g.restore();
}

function orilla(g, x, y, dir) {
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + dir * 180, y + 80);
  g.lineTo(x + dir * 40, 1960);
  g.lineTo(x - dir * 80, 1960);
  g.closePath();
  const sg = g.createLinearGradient(x, y, x, y + 400);
  sg.addColorStop(0, "#fffaf3");
  sg.addColorStop(1, "#e7cbb4");
  g.fillStyle = sg;
  g.fill();
}

function barco(g, x, y) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.moveTo(-210, 36);
  g.quadraticCurveTo(-180, -10, -40, -16);
  g.lineTo(160, -16);
  g.quadraticCurveTo(200, 0, 220, 36);
  g.closePath();
  const bg = g.createLinearGradient(-210, 0, 220, 0);
  bg.addColorStop(0, "#c5ced8");
  bg.addColorStop(0.4, "#f7fafc");
  bg.addColorStop(1, "#7e8b99");
  g.fillStyle = bg;
  g.fill();
  g.fillStyle = "#1c4e86";
  g.fillRect(-30, -78, 150, 62);
  g.fillStyle = "#b7e4f5";
  for (let i = 0; i < 4; i++) g.fillRect(-8 + i * 32, -62, 20, 18);
  g.fillStyle = "#e23d3d";
  g.fillRect(108, -118, 8, 44);
  g.restore();
}
