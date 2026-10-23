// El lavabo visto desde arriba (la boca) y, cuando hace falta, el tubo por dentro.
import * as k from "#kit";
import { CROMO, NARANJA, gradH, gradV, gota, guante, pared, pelo } from "./mundo.js";

const { azar } = k;
const azG = azar(7);
const GOTAS = Array.from({ length: 14 }, () => ({ x: -0.45 + azG() * 0.9, f: azG(), r: 12 + azG() * 18, v: 0.5 + azG() * 0.8 }));

const CX = 540, CY = 1120;

function porcelana(g, x, y, rx, ry) {
  g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.2832);
  const gr = g.createRadialGradient(x - rx * 0.3, y - ry * 0.35, rx * 0.1, x, y, rx);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.55, "#e7eef2"); gr.addColorStop(1, "#9aafbc");
  g.fillStyle = gr; g.fill();
}

export function lavabo(g, t, o) {
  const dentro = o.dentro ?? 0;
  if (dentro < 0.98) {
    g.save(); g.globalAlpha *= 1 - dentro;
    boca(g, t, o);
    g.restore();
  }
  if (dentro > 0.02) {
    g.save(); g.globalAlpha *= dentro;
    porDentro(g, t, o);
    g.restore();
  }
}

function boca(g, t, o) {
  const nivel = o.nivel ?? 1;
  const derrame = o.derrame ?? 0;
  const grifo = o.grifo ?? 1;
  const pano = o.pano ?? 0;
  const embolo = o.embolo ?? -1;
  const guantesAl = o.guantes ?? 0;
  const colador = o.colador ?? 0;
  const mechón = o.mechón ?? 0;
  const limpio = o.limpio ?? 0;

  if (o.fondo !== false) {
    pared(g, -300, -400, 1500, 2400);
    g.fillStyle = gradV(g, 640, 1680, [[0, "#f7fffc"], [0.35, "#d7eee6"], [1, "#7eb0a6"]]);
    k.redondo(g, 40, 680, 1000, 980, 36); g.fill();
    g.fillStyle = "rgba(255,255,255,0.4)"; g.fillRect(70, 700, 940, 14);
  }

  // boca: aro de porcelana
  porcelana(g, CX, CY, 430, 270);
  g.save();
  g.beginPath(); g.ellipse(CX, CY, 430, 270, 0, 0, 6.2832); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22;
  g.drawImage(k.manchas, 80, 820, 920, 560);
  g.restore();

  // interior oscuro (la taza, más abajo)
  g.beginPath(); g.ellipse(CX, CY + 16, 330, 195, 0, 0, 6.2832);
  g.fillStyle = gradV(g, CY - 180, CY + 220, [[0, "#d5e4ea"], [1, "#6d8694"]]);
  g.fill();

  // rebosadero, en la pared del fondo de la taza
  const ox = 760, oy = CY - 70;
  g.fillStyle = "#314650"; k.redondo(g, ox - 36, oy - 14, 72, 28, 10); g.fill();
  g.fillStyle = "#152228"; k.redondo(g, ox - 28, oy - 8, 56, 16, 6); g.fill();
  if (pano > 0.02) {
    g.save(); g.globalAlpha *= pano; g.translate(ox, oy);
    g.fillStyle = gradH(g, -20, 90, [[0, "#0c646c"], [0.5, "#3ad0c8"], [1, "#083e46"]]);
    g.beginPath();
    g.moveTo(-10, 0); g.bezierCurveTo(20, -70, 110, -30, 80, 36); g.bezierCurveTo(40, 70, -16, 40, -10, 0);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.4)"; g.fillRect(8, -28, 10, 48);
    g.restore();
  }

  // agua: llena llega al borde; con poca, se ve el fondo de porcelana
  const rx = 90 + nivel * 230, ry = 52 + nivel * 130;
  const ay = CY + 30 + (1 - nivel) * 20;
  g.save();
  g.beginPath(); g.ellipse(CX, ay, rx, ry, 0, 0, 6.2832); g.clip();
  const ag = g.createLinearGradient(0, ay - ry, 0, ay + ry);
  ag.addColorStop(0, "rgba(170,230,250,0.75)");
  ag.addColorStop(0.4, "rgba(36,150,214,0.88)");
  ag.addColorStop(1, "rgba(6,70,150,0.95)");
  g.fillStyle = ag; g.fillRect(CX - rx, ay - ry, rx * 2, ry * 2);
  g.strokeStyle = "rgba(230,250,255,0.55)"; g.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const w = 1 + 0.04 * Math.sin(t * 2.4 + i);
    g.beginPath(); g.ellipse(CX, ay, rx * (0.45 + i * 0.18) * w, ry * (0.4 + i * 0.18), 0, 0, 6.2832); g.stroke();
  }
  if (limpio > 0.02) {
    g.strokeStyle = `rgba(240,252,255,${0.85 * limpio})`; g.lineWidth = 6;
    g.beginPath();
    const ang = t * 3.4;
    for (let i = 0; i < 48; i++) {
      const u = i / 48, a = ang + u * 8, rr = u * rx * 0.85;
      const x = CX + Math.cos(a) * rr, y = ay + Math.sin(a) * rr * (ry / rx);
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  }
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.beginPath(); g.ellipse(CX - rx * 0.25, ay - ry * 0.25, rx * 0.28, ry * 0.16, -0.4, 0, 6.2832); g.fill();

  // desagüe
  g.beginPath(); g.ellipse(CX, ay + 4, 34, 16, 0, 0, 6.2832);
  g.fillStyle = gradH(g, CX - 34, CX + 34, CROMO); g.fill();
  g.beginPath(); g.ellipse(CX, ay + 6, 18, 8, 0, 0, 6.2832);
  g.fillStyle = "#0c181e"; g.fill();

  if (colador > 0.02) {
    const u = Math.min(1, colador);
    const cy = ay - (1 - u) * 180;
    g.save(); g.globalAlpha *= Math.min(1, colador * 1.2);
    g.save();
    g.beginPath(); g.ellipse(CX, cy, 78, 32, 0, 0, 6.2832); g.clip();
    g.strokeStyle = "rgba(226,236,242,0.9)"; g.lineWidth = 3;
    for (let i = -5; i <= 5; i++) { g.beginPath(); g.moveTo(CX + i * 14, cy - 40); g.lineTo(CX + i * 14, cy + 40); g.stroke(); }
    for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(CX, cy + i * 10, 78, 8, 0, 0, 6.2832); g.stroke(); }
    g.restore();
    g.strokeStyle = gradH(g, CX - 80, CX + 80, CROMO); g.lineWidth = 10;
    g.beginPath(); g.ellipse(CX, cy, 78, 32, 0, 0, 6.2832); g.stroke();
    g.restore();
    if (mechón > 0.02) {
      const m = Math.min(1, mechón);
      pelo(g, CX, cy - (1 - m) * 200, 36, m);
    }
  }

  grifoArriba(g, t, grifo, ay);

  // el agua salta el borde cercano (la parte de abajo de la elipse)
  if (derrame > 0.02) {
    g.save(); g.globalAlpha *= Math.min(1, derrame);
    const y0 = CY + 250;
    const cg = g.createLinearGradient(CX - 220, 0, CX + 220, 0);
    cg.addColorStop(0, "rgba(16,110,190,0)");
    cg.addColorStop(0.18, "rgba(50,180,235,0.9)");
    cg.addColorStop(0.45, "rgba(220,248,255,0.95)");
    cg.addColorStop(0.7, "rgba(30,140,220,0.9)");
    cg.addColorStop(1, "rgba(10,70,160,0)");
    g.fillStyle = cg;
    g.beginPath();
    g.moveTo(CX - 200, y0);
    g.bezierCurveTo(CX - 120, y0 + 80, CX - 60, y0 + 200, CX - 20, y0 + 380);
    g.lineTo(CX + 70, y0 + 400);
    g.bezierCurveTo(CX + 40, y0 + 180, CX + 140, y0 + 70, CX + 210, y0);
    g.closePath(); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 5;
    g.beginPath(); g.moveTo(CX - 20, y0 + 10); g.bezierCurveTo(CX, y0 + 120, CX + 10, y0 + 240, CX + 16, y0 + 360); g.stroke();
    for (const d of GOTAS) {
      const u = (t * d.v + d.f) % 1;
      gota(g, CX + d.x * 200, y0 + 40 + u * 420, d.r, 1 - u * 0.25, 1.4);
    }
    g.restore();
  }

  if (embolo >= 0) {
    const sube = embolo < 0.12 ? 1 - embolo / 0.12 : 0;
    const bombea = embolo > 0.12 && embolo < 0.9;
    const pump = bombea ? Math.sin((embolo - 0.12) * Math.PI * 8) * 28 : (embolo >= 0.9 ? -40 : 0);
    const y = ay - 10 - sube * 260 + pump;
    g.save(); g.translate(CX, y);
    g.beginPath(); g.ellipse(0, 20, 120, 48, 0, 0, 6.2832);
    g.fillStyle = gradH(g, -120, 120, [[0, "#7a1020"], [0.35, "#ef4454"], [0.6, "#ffb0b4"], [1, "#8e1828"]]);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.4)";
    g.beginPath(); g.ellipse(-30, 8, 36, 12, -0.4, 0, 6.2832); g.fill();
    g.fillStyle = gradH(g, -14, 14, [[0, "#6a3a14"], [0.45, "#f0d09a"], [1, "#5a3010"]]);
    g.fillRect(-14, -340, 28, 340);
    g.restore();
  }

  if (guantesAl > 0.02) {
    const e = k.entra(Math.min(1, guantesAl));
    guante(g, 160 - (1 - e) * 220, CY + 40, 0.8, 1.2, e);
    guante(g, 920 + (1 - e) * 220, CY + 40, -0.8, 1.2, e);
  }
}

function grifoArriba(g, t, abierto, ay) {
  g.save();
  // base en el borde lejano
  g.beginPath(); g.ellipse(CX, CY - 250, 70, 26, 0, 0, 6.2832);
  g.fillStyle = gradH(g, CX - 70, CX + 70, CROMO); g.fill();
  // caño: arco hasta el centro
  g.lineCap = "round";
  g.strokeStyle = gradH(g, CX - 20, CX + 40, CROMO);
  g.lineWidth = 34;
  g.beginPath(); g.moveTo(CX, CY - 248); g.quadraticCurveTo(CX + 70, CY - 360, CX + 6, ay - 50); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(CX - 4, CY - 240); g.quadraticCurveTo(CX + 48, CY - 340, CX, ay - 70); g.stroke();
  // boca del caño
  g.beginPath(); g.ellipse(CX + 8, ay - 70, 16, 8, 0, 0, 6.2832);
  g.fillStyle = "#e9f2f6"; g.fill();
  if (abierto > 0.05) {
    g.save(); g.globalAlpha *= abierto;
    const x = CX + 8, y0 = ay - 60, y1 = ay - 8;
    g.fillStyle = gradH(g, x - 8, x + 8, [[0, "rgba(20,120,200,0.2)"], [0.45, "rgba(210,245,255,0.95)"], [1, "rgba(20,110,190,0.3)"]]);
    g.fillRect(x - 5, y0, 10, y1 - y0);
    const f = (t * 2.2) % 1;
    g.fillStyle = "rgba(255,255,255,0.8)";
    g.fillRect(x - 2, y0 + (y1 - y0) * f, 3, 18);
    g.restore();
  }
  // manetas
  for (const s of [-1, 1]) {
    g.save(); g.translate(CX + s * 150, CY - 230); g.rotate(s * 0.4);
    g.fillStyle = gradH(g, -70, 70, CROMO);
    k.redondo(g, -70, -14, 140, 28, 14); g.fill();
    g.restore();
  }
  g.restore();
}

// El tubo en corte, llenando la pantalla: agua arriba, tapón de pelo, agujero mínimo.
function porDentro(g, t, o) {
  const agujero = o.agujero ?? 0;
  const chorroQ = o.chorroQ ?? 0;
  const botella = o.botella ?? 0;

  // fondo del tubo, azul noche
  const fondo = g.createLinearGradient(0, 400, 0, 1800);
  fondo.addColorStop(0, "#071820"); fondo.addColorStop(1, "#0c3048");
  g.fillStyle = fondo; g.fillRect(-200, -200, 1600, 2400);

  // paredes cromadas, gruesas
  const paredTubo = (x) => {
    g.fillStyle = gradH(g, x, x + 90, CROMO);
    g.fillRect(x, 200, 90, 1600);
    g.fillStyle = "rgba(255,255,255,0.55)"; g.fillRect(x + 28, 200, 10, 1600);
  };
  paredTubo(250);
  paredTubo(740);

  // agua que no baja
  g.fillStyle = gradH(g, 340, 740, [[0, "rgba(20,90,170,0.95)"], [0.4, "rgba(150,220,245,0.85)"], [1, "rgba(10,70,160,0.95)"]]);
  g.fillRect(340, 260, 400, 620);
  g.fillStyle = "rgba(255,255,255,0.2)";
  for (let i = 0; i < 5; i++) {
    const yy = 340 + i * 90 + Math.sin(t * 1.6 + i) * 6;
    g.fillRect(360, yy, 360, 3);
  }

  // tapón
  g.fillStyle = "rgba(210,190,130,0.55)";
  g.beginPath(); g.ellipse(540, 980, 150, 70, 0, 0, 6.2832); g.fill();
  pelo(g, 540, 1040, 200, 1);
  g.fillStyle = "rgba(40,28,18,0.35)";
  g.beginPath(); g.ellipse(540, 1120, 160, 50, 0, 0, 6.2832); g.fill();

  // el agua se corta en el tapón: una línea de superficie
  g.fillStyle = "rgba(200,240,255,0.7)";
  g.fillRect(340, 860, 400, 8);

  if (agujero > 0.02) {
    const r = 10 + agujero * 18;
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, 540, 1040, 70 + r, "fuego", 0.7 * agujero);
    g.restore();
    g.fillStyle = "#1a0c06";
    g.beginPath(); g.arc(540, 1040, r, 0, 6.2832); g.fill();
    g.strokeStyle = "rgba(255,170,60,0.9)"; g.lineWidth = 4;
    g.stroke();
    // una gota que no consigue pasar
    gota(g, 548, 1160 + Math.sin(t * 3) * 6, 12, agujero, 1.3);
  }

  if (botella > 0.02) {
    g.save();
    g.translate(860, 640);
    g.rotate(-1.05 * Math.min(1, botella));
    g.globalAlpha *= Math.min(1, botella * 1.4);
    k.redondo(g, -48, -160, 96, 250, 20);
    g.fillStyle = gradH(g, -48, 48, NARANJA); g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(-10, -140, 16, 200);
    g.fillStyle = "#ffe14a";
    g.beginPath(); g.moveTo(0, -90); g.lineTo(32, -36); g.lineTo(-32, -36); g.closePath(); g.fill();
    g.fillStyle = "#1a1208";
    g.fillRect(-4, -78, 8, 22);
    g.beginPath(); g.arc(0, -48, 5, 0, 6.2832); g.fill();
    g.fillStyle = gradH(g, -16, 16, CROMO);
    g.fillRect(-16, -200, 32, 46);
    g.restore();
    if (chorroQ > 0.04) {
      g.save(); g.globalAlpha *= chorroQ;
      g.strokeStyle = "rgba(255,150,40,0.95)"; g.lineWidth = 12; g.lineCap = "round";
      g.beginPath(); g.moveTo(760, 760); g.quadraticCurveTo(660, 900, 548, 1020); g.stroke();
      k.brillo(g, 548, 1030, 120, "fuego", 0.85);
      g.restore();
    }
  }
}
