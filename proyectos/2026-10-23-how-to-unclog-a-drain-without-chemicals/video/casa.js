// La casa en corte: tres aparatos lentos y el atasco en la bajante.
import * as k from "#kit";
import { CROMO, gradH, telefono } from "./mundo.js";

function aparatito(g, x, y, agua) {
  g.beginPath(); g.ellipse(x, y, 120, 46, 0, 0, 6.2832);
  g.fillStyle = "#f4f8fa"; g.fill();
  g.beginPath(); g.ellipse(x, y + 4, 90, 30, 0, 0, 6.2832);
  g.fillStyle = "#b7c6ce"; g.fill();
  const rx = 40 + agua * 46, ry = 14 + agua * 16;
  g.beginPath(); g.ellipse(x, y + 6, rx, ry, 0, 0, 6.2832);
  g.fillStyle = "rgba(40,160,220,0.9)"; g.fill();
  g.beginPath(); g.ellipse(x, y + 8, 10, 5, 0, 0, 6.2832);
  g.fillStyle = "#102028"; g.fill();
  // caño
  g.strokeStyle = gradH(g, x - 8, x + 8, CROMO); g.lineWidth = 10; g.lineCap = "round";
  g.beginPath(); g.moveTo(x, y - 50); g.quadraticCurveTo(x + 4, y - 90, x, y - 20); g.stroke();
}

function ducha(g, x, y, agua) {
  g.fillStyle = "#dbeafe"; k.redondo(g, x - 70, y - 20, 140, 170, 16); g.fill();
  g.fillStyle = "rgba(40,150,220,0.85)"; g.fillRect(x - 60, y + 90 - agua * 40, 120, 20 + agua * 50);
  g.strokeStyle = "#e8eef2"; g.lineWidth = 8;
  g.beginPath(); g.moveTo(x, y - 10); g.lineTo(x, y + 30); g.stroke();
  g.fillStyle = "rgba(180,230,255,0.8)";
  for (let i = -2; i <= 2; i++) {
    g.beginPath(); g.arc(x + i * 14, y + 50, 3, 0, 6.28); g.fill();
  }
}

export function casa(g, t, o) {
  const tel = o.tel ?? 0;
  const sube = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.2));

  // noche alrededor
  const cielo = g.createLinearGradient(0, 0, 0, 1920);
  cielo.addColorStop(0, "#142033"); cielo.addColorStop(1, "#070d16");
  g.fillStyle = cielo; g.fillRect(-200, -200, 1600, 2400);

  // la casa
  g.fillStyle = "#f3e6d4"; k.redondo(g, 120, 280, 700, 1420, 18); g.fill();
  // tejado
  g.fillStyle = "#c2414a";
  g.beginPath(); g.moveTo(80, 320); g.lineTo(470, 120); g.lineTo(860, 320); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.moveTo(200, 300); g.lineTo(470, 170); g.lineTo(500, 190); g.lineTo(250, 310); g.closePath(); g.fill();

  // habitaciones
  const salas = [
    [160, 360, 520, 380, "#d7f3ee"],
    [160, 760, 520, 380, "#dbeafe"],
    [160, 1160, 520, 480, "#fde8c8"],
  ];
  for (const [x, y, w, h, c] of salas) {
    g.fillStyle = c; g.fillRect(x, y, w, h);
    g.strokeStyle = "rgba(80,50,30,0.35)"; g.lineWidth = 8; g.strokeRect(x, y, w, h);
  }

  aparatito(g, 360, 560, sube);
  ducha(g, 400, 860, sube);
  aparatito(g, 380, 1360, sube);

  // tubos finos hacia la bajante
  g.strokeStyle = "#8aa0ae"; g.lineWidth = 16; g.lineCap = "round";
  g.beginPath(); g.moveTo(360, 600); g.lineTo(360, 700); g.lineTo(760, 700); g.stroke();
  g.beginPath(); g.moveTo(400, 1040); g.lineTo(760, 1040); g.stroke();
  g.beginPath(); g.moveTo(380, 1400); g.lineTo(380, 1500); g.lineTo(760, 1500); g.stroke();

  // bajante
  g.fillStyle = gradH(g, 760, 900, [[0, "#314048"], [0.35, "#d5dee4"], [0.7, "#7d8e9a"], [1, "#2c3840"]]);
  g.fillRect(760, 420, 120, 1180);
  g.fillStyle = "rgba(255,255,255,0.45)"; g.fillRect(800, 420, 12, 1180);

  // el tapón de la bajante, oscuro y gordo
  g.save(); g.translate(820, 1120);
  g.fillStyle = "#1a120e";
  g.beginPath(); g.ellipse(0, 0, 70, 90, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#3a2a22";
  g.beginPath(); g.ellipse(-10, -16, 36, 28, 0.4, 0, 6.2832); g.fill();
  // el agua se para encima
  g.fillStyle = "rgba(40,140,200,0.85)";
  g.fillRect(-40, -220, 80, 140);
  g.restore();

  if (tel > 0.02) telefono(g, 300, 980, 1.3, tel, t);
}
