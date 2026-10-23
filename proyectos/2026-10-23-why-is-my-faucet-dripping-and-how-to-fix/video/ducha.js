// La ducha: una alcachofa enorme echando agua y vapor sobre el suelo de la ducha, y su desagüe, que se traga la imagen.
import * as k from "#kit";
import { camara, CROMO, ACERO, gradH, gradV, tubo, ruedo, pared } from "./mundo.js";

const { tramo: tr, suave: su, azar } = k;
export const CAB = { x: 40, y: -110 };         // el centro de la alcachofa
export const SUELO_D = 1250, DESAGUE = { x: 40, y: 1296 };

const az = azar(402);
const CHORROS = Array.from({ length: 150 }, () => ({ u: az() * 2 - 1, fase: az(), vel: 1500 + az() * 700, ln: 70 + az() * 70, gr: 0.5 + az() * 0.7, ancho: 4 + az() * 6 }));
const VAPOR = Array.from({ length: 16 }, () => ({ x: az() * 1500 - 750, f: az(), r: 180 + az() * 260, v: 40 + az() * 60 }));

export function dibujaDucha(g, t, o) {
  g.fillStyle = "#082a36"; g.fillRect(0, 0, 1080, 1920);
  g.save(); camara(g, o.cam);
  // la pared de azulejos, más clara, y la luz
  pared(g, -2000, -1700, 2000, SUELO_D);
  g.fillStyle = "rgba(0,28,48,0.55)"; g.fillRect(-2000, -1700, 4000, SUELO_D + 1700);
  k.brillo(g, 40, 400, 1500, "190,235,255", 0.3);
  // el suelo de la ducha, blanco, visto de frente, con su desagüe
  g.fillStyle = gradV(g, SUELO_D, SUELO_D + 600, [[0, "#f3f8fb"], [0.4, "#d7e4ec"], [1, "#9db2c2"]]); g.fillRect(-2000, SUELO_D, 4000, 1000);
  g.fillStyle = "rgba(255,255,255,0.9)"; g.fillRect(-2000, SUELO_D - 6, 4000, 8);
  // el brazo y la rótula
  tubo(g, [[-900, -190], [-150, -190]], 70);
  g.beginPath(); g.arc(-120, -190, 56, 0, 6.2832); g.fillStyle = gradH(g, -176, -64, CROMO); g.fill(); g.strokeStyle = "rgba(25,35,45,0.6)"; g.lineWidth = 4; g.stroke();
  tubo(g, [[-120, -190], [-60, -150]], 54);
  // la cabeza: un disco bombeado, con su cara de agujeros hacia abajo
  g.beginPath(); g.moveTo(CAB.x - 270, CAB.y + 56); g.quadraticCurveTo(CAB.x - 290, CAB.y - 80, CAB.x - 80, CAB.y - 70); g.lineTo(CAB.x + 130, CAB.y - 70); g.quadraticCurveTo(CAB.x + 300, CAB.y - 80, CAB.x + 270, CAB.y + 56); g.closePath();
  g.fillStyle = gradH(g, CAB.x - 290, CAB.x + 290, CROMO); g.fill(); g.strokeStyle = "rgba(25,35,45,0.65)"; g.lineWidth = 5; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(CAB.x - 60, CAB.y - 46, 120, 10, -0.05, 0, 6.2832); g.fill();
  g.beginPath(); k.redondo(g, CAB.x - 276, CAB.y + 44, 552, 36, 16); g.fillStyle = gradV(g, CAB.y + 44, CAB.y + 80, [[0, "#c9d4de"], [1, "#4a5560"]]); g.fill(); g.strokeStyle = "rgba(25,35,45,0.65)"; g.lineWidth = 4; g.stroke();
  g.fillStyle = "#1c242b"; for (let i = 0; i < 22; i++) { g.beginPath(); g.ellipse(CAB.x - 252 + i * 24, CAB.y + 64, 7, 5, 0, 0, 6.2832); g.fill(); }
  // el agua: un cono de chorros desde la cara hasta el suelo
  const yTop = CAB.y + 80, largo = SUELO_D - yTop;
  g.save(); g.lineCap = "round";
  const flujo = o.flujo ?? 1;
  g.globalCompositeOperation = "lighter";
  const cg = g.createLinearGradient(0, yTop, 0, SUELO_D); cg.addColorStop(0, "rgba(120,200,255,0.22)"); cg.addColorStop(1, "rgba(140,210,255,0.1)");
  g.fillStyle = cg; g.beginPath(); g.moveTo(CAB.x - 260, yTop); g.lineTo(CAB.x + 260, yTop); g.lineTo(CAB.x + 420, SUELO_D); g.lineTo(CAB.x - 420, SUELO_D); g.closePath(); g.fill();
  g.globalCompositeOperation = "source-over";
  for (const c of CHORROS) {
    const f = (c.fase + t * c.vel / largo) % 1, y = yTop + f * largo, x = CAB.x + c.u * 250 + c.u * 160 * f * c.gr;
    const y2 = Math.max(yTop, y - c.ln);
    const x2 = CAB.x + c.u * 250 + c.u * 160 * ((y2 - yTop) / largo) * c.gr;
    g.strokeStyle = `rgba(185,232,255,${0.95 * flujo})`; g.lineWidth = c.ancho; g.beginPath(); g.moveTo(x2, y2); g.lineTo(x, y); g.stroke();
    g.strokeStyle = `rgba(255,255,255,${0.7 * flujo})`; g.lineWidth = c.ancho * 0.35; g.beginPath(); g.moveTo(x2 - 1, y2); g.lineTo(x - 1, y); g.stroke();
  }
  g.restore();
  // el charco del suelo y el remolino hacia el desagüe
  const gg = g.createRadialGradient(DESAGUE.x, SUELO_D + 60, 40, DESAGUE.x, SUELO_D + 60, 700);
  gg.addColorStop(0, "rgba(90,180,255,0.75)"); gg.addColorStop(1, "rgba(90,180,255,0)");
  g.fillStyle = gg; g.beginPath(); g.ellipse(DESAGUE.x, SUELO_D + 60, 760, 150, 0, 0, 6.2832); g.fill();
  const rx = 150, ry = 40;
  g.fillStyle = "#04080b"; g.beginPath(); g.ellipse(DESAGUE.x, DESAGUE.y, rx + 26, ry + 12, 0, 0, 6.2832); g.fill();
  g.fillStyle = gradH(g, DESAGUE.x - rx, DESAGUE.x + rx, CROMO); g.beginPath(); g.ellipse(DESAGUE.x, DESAGUE.y, rx, ry, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#04080b"; for (let i = -3; i <= 3; i++) { g.beginPath(); g.ellipse(DESAGUE.x + i * 34, DESAGUE.y, 8, ry * 0.7, 0, 0, 6.2832); g.fill(); }
  // espirales del agua que baja
  const gi = o.giro ?? 0;
  g.strokeStyle = "rgba(210,240,255,0.7)"; g.lineWidth = 6; g.lineCap = "round";
  for (let i = 0; i < 6; i++) {
    const a0 = gi * 5 + (i * 6.2832) / 6; g.beginPath();
    for (let j = 0; j <= 18; j++) { const a = a0 + j * 0.16, rr = 1 - j / 22; g.lineTo(DESAGUE.x + Math.cos(a) * (rx + 200 * rr * 0.6 + 40) * rr, DESAGUE.y + Math.sin(a) * (ry + 60 * rr) * rr + 8); }
    g.globalAlpha = 0.5 * Math.min(1, gi * 3); g.stroke();
  }
  g.globalAlpha = 1;
  // el vapor
  for (const v of VAPOR) { const y = 1000 - ((v.f * 900 + t * v.v) % 1200) + 200; k.brillo(g, v.x, y, v.r * 2, "235,250,255", 0.1); }
  if (o.despues) o.despues(g, t);
  g.restore();
}
