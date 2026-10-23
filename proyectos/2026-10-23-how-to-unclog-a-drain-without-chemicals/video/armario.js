// Debajo del lavabo: el tubo en P, el cubo y las dos tuercas.
import * as k from "#kit";
import { CROMO, gradH, gota, guante, pelo, telefono } from "./mundo.js";

function tuerca(g, x, y, rot, r = 54) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
    const px = Math.cos(a) * r, py = Math.sin(a) * r * 0.72;
    i ? g.lineTo(px, py) : g.moveTo(px, py);
  }
  g.closePath();
  g.fillStyle = gradH(g, -r, r, CROMO); g.fill();
  g.strokeStyle = "rgba(20,28,36,0.55)"; g.lineWidth = 4; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(-r * 0.15, -r * 0.45, r * 0.12, r * 0.9);
  g.beginPath(); g.ellipse(0, 0, r * 0.34, r * 0.22, 0, 0, 6.2832);
  g.fillStyle = "#1a2830"; g.fill();
  g.restore();
}

function arandela(g, x, y, al) {
  if (al < 0.02) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y);
  g.beginPath(); g.ellipse(0, 0, 36, 16, 0, 0, 6.2832);
  g.fillStyle = "#f4f7f2"; g.fill();
  g.beginPath(); g.ellipse(0, 0, 16, 7, 0, 0, 6.2832);
  g.fillStyle = "#243038"; g.fill();
  g.strokeStyle = "rgba(180,190,180,0.9)"; g.lineWidth = 3;
  g.beginPath(); g.ellipse(0, 0, 36, 16, 0, 0, 6.2832); g.stroke();
  g.restore();
}

function cubo(g, x, y, al, agua, peloAl) {
  if (al < 0.02) return;
  g.save(); g.translate(x, y); g.globalAlpha *= al;
  g.beginPath();
  g.moveTo(-150, 0); g.lineTo(150, 0); g.lineTo(120, 220); g.lineTo(-120, 220); g.closePath();
  g.fillStyle = gradH(g, -150, 150, [[0, "#c2410c"], [0.35, "#fb923c"], [0.55, "#ffd0a8"], [0.8, "#ea580c"], [1, "#9a3412"]]);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(-90, 20, 18, 180);
  // asa
  g.strokeStyle = "#7c2d12"; g.lineWidth = 8;
  g.beginPath(); g.arc(0, 10, 110, Math.PI, 0); g.stroke();
  if (agua > 0.02) {
    g.save();
    g.beginPath(); g.rect(-140, 40, 280, 180); g.clip();
    g.fillStyle = `rgba(40,90,70,${0.75 * agua})`;
    g.fillRect(-130, 90, 260, 140);
    g.restore();
    if (peloAl > 0.02) pelo(g, 10, 130, 70 * Math.min(1, peloAl), peloAl);
  }
  g.restore();
}

// El tubo en U. baja: píxeles que ha bajado al soltarlo. vuelve: 0 sigue fuera, 1 ha vuelto.
function trampa(g, baja, verde, peloAl) {
  g.save(); g.translate(0, baja);
  const camino = () => {
    g.beginPath();
    g.moveTo(400, 620);
    g.lineTo(400, 860);
    g.bezierCurveTo(400, 1040, 700, 1040, 700, 860);
    g.lineTo(700, 700);
  };
  g.lineCap = "round"; g.lineJoin = "round";
  camino(); g.strokeStyle = "#243038"; g.lineWidth = 108; g.stroke();
  camino(); g.strokeStyle = "#9aabB8"; g.lineWidth = 92; g.stroke();
  camino(); g.strokeStyle = "#e7eef3"; g.lineWidth = 70; g.stroke();
  camino(); g.strokeStyle = verde > 0.2 ? `rgba(120,220,60,${0.35 + verde * 0.4})` : "#1a3c30"; g.lineWidth = 48; g.stroke();
  // ventana al tapón
  g.save();
  g.beginPath(); g.ellipse(550, 980, 70, 46, 0, 0, 6.2832); g.clip();
  g.fillStyle = verde > 0.2 ? `rgba(150,230,70,${0.45 + verde * 0.3})` : "#123028";
  g.fillRect(460, 900, 180, 140);
  if (peloAl > 0.02) pelo(g, 550, 980, 60, peloAl);
  g.restore();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 4;
  g.beginPath(); g.ellipse(550, 980, 70, 46, 0, 0, 6.2832); g.stroke();
  g.restore();
}

export function armario(g, t, o) {
  const verde = o.verde ?? 0;
  const mano = o.mano ?? 0;       // 0 lejos, 1 en la tuerca
  const atras = o.atras ?? 0;     // se retira
  const tel = o.tel ?? 0;
  const cuboAl = o.cubo ?? 0;
  const giro = o.giro ?? 0;       // 0..1 a izquierdas
  const baja = o.baja ?? 0;       // 0..1 el tubo fuera
  const cae = o.cae ?? 0;         // agua y pelo al cubo
  const puesto = o.puesto ?? 1;   // 1 montado, 0 en el cubo; al volver, 1
  const aran = o.aran ?? 0;
  const aprieta = o.aprieta ?? 0; // 0..1 a derechas, a mano
  const goteo = o.goteo ?? 0;

  // armario
  g.fillStyle = "#2a1c14"; g.fillRect(-200, -200, 1600, 2400);
  // luz de la puerta abierta, a la izquierda
  const luz = g.createLinearGradient(0, 0, 700, 0);
  luz.addColorStop(0, "rgba(255,210,150,0.28)"); luz.addColorStop(1, "rgba(255,210,150,0)");
  g.fillStyle = luz; g.fillRect(0, 0, 800, 1920);
  // baldas y suelo
  g.fillStyle = "#4a3024"; g.fillRect(80, 1500, 920, 28);
  g.fillStyle = "#1a100c"; g.fillRect(80, 1528, 920, 200);
  // paredes laterales
  g.fillStyle = "#3c281c"; g.fillRect(60, 200, 36, 1400); g.fillRect(980, 200, 40, 1400);
  k.brillo(g, 180, 280, 420, "amarilla", 0.35);

  // cola que baja del lavabo (no se mueve)
  g.lineCap = "round";
  g.strokeStyle = "#d5dee6"; g.lineWidth = 64;
  g.beginPath(); g.moveTo(400, 180); g.lineTo(400, 640); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 8;
  g.beginPath(); g.moveTo(384, 180); g.lineTo(384, 630); g.stroke();

  // el tubo se mete en la pared
  g.strokeStyle = "#c5d0d8"; g.lineWidth = 64;
  g.beginPath(); g.moveTo(700, 700); g.lineTo(1000, 700); g.stroke();
  g.fillStyle = "#6a5344"; g.beginPath(); g.ellipse(1000, 700, 28, 54, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#c5d0d8"; g.beginPath(); g.ellipse(1000, 700, 18, 36, 0, 0, 6.2832); g.fill();

  trampa(g, o.bajaPx ?? baja * 240, verde, o.peloTubo ?? 1);

  const rotIzq = -giro * 1.35;
  const rotDer = aprieta * 1.1;
  tuerca(g, 400, 650, rotIzq + rotDer, 58);
  tuerca(g, 700, 700, rotIzq * 0.9 + rotDer, 58);
  arandela(g, 400, 700, aran);
  arandela(g, 688, 760, aran);

  // agua y pelo que caen de la cola
  if (cae > 0.02 && cae < 1.15) {
    const u = Math.min(1, cae);
    g.strokeStyle = `rgba(60,140,90,${0.8 * (1 - Math.max(0, u - 0.7) / 0.3)})`; g.lineWidth = 16;
    g.beginPath(); g.moveTo(400, 660); g.lineTo(400, 660 + u * 520); g.stroke();
    pelo(g, 420, 700 + u * 500, 54, Math.min(1, cae * 1.4) * (u < 0.92 ? 1 : 1 - (u - 0.92) / 0.2));
  }

  cubo(g, 430, 1180, cuboAl, cae > 0.4 ? 1 : 0, cae > 0.55 ? 1 : 0);

  // manos
  const acerca = Math.max(0, mano - atras);
  if (acerca > 0.02) {
    guante(g, 250 + acerca * 80, 620, -0.4 + rotIzq, 1.15, acerca);
  }
  if (aprieta > 0.02) {
    guante(g, 250, 600, -0.2 + rotDer, 1.15, Math.min(1, aprieta * 2));
  }

  if (goteo > 0.02 && goteo < 0.92) {
    const u = goteo;
    gota(g, 400, 760 + u * 180, 11, 1 - Math.max(0, u - 0.7), 1.4);
  }

  if (tel > 0.02) telefono(g, 820, 1180, 1.15, tel, t);

  if (verde > 0.4) k.brillo(g, 550, 980 + (o.bajaPx ?? 0), 200, "verde", 0.25 * verde);
}
