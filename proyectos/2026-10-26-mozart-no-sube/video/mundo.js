// Lo que comparten los planos: los pianos, la sala, el folio, la gente y el reloj.
import * as k from "#kit";

const azN = k.azar(448);
export const NOTAS = Array.from({ length: 36 }, () => ({
  x: (azN() - 0.5) * 900,
  y: (azN() - 0.5) * 700,
  z: 0.4 + azN() * 2.4,
  fase: azN(),
  oro: azN() > 0.4,
}));

export function velo(g, fuerza = 0.72) {
  const vg = g.createLinearGradient(0, 40, 0, 620);
  vg.addColorStop(0, `rgba(8,2,16,${fuerza})`);
  vg.addColorStop(0.62, `rgba(8,2,16,${fuerza * 0.45})`);
  vg.addColorStop(1, "rgba(8,2,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 640);
}

export function salaConcierto(g, calor = 1) {
  const bg = g.createRadialGradient(540, 860, 40, 540, 980, 1280);
  bg.addColorStop(0, calor > 0.5 ? "#3a1848" : "#1a2450");
  bg.addColorStop(0.45, "#140814");
  bg.addColorStop(1, "#050208");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  cortinas(g, calor);
  const foco = g.createRadialGradient(540, 620, 20, 540, 980, 640);
  foco.addColorStop(0, `rgba(255,196,110,${0.22 * calor})`);
  foco.addColorStop(0.45, `rgba(255,140,60,${0.06 * calor})`);
  foco.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = foco;
  g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.beginPath();
  g.ellipse(540, 1680, 620, 90, 0, 0, Math.PI * 2);
  g.fill();
}

function cortinas(g, calor) {
  for (const lado of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      const x = lado < 0 ? i * 48 : 1080 - (i + 1) * 48;
      const grd = g.createLinearGradient(x, 0, x + 48, 0);
      const claro = calor > 0.5 ? "#c44868" : "#3a4e86";
      const oscuro = calor > 0.5 ? "#3a0c1c" : "#10182e";
      grd.addColorStop(0, oscuro);
      grd.addColorStop(0.45, claro);
      grd.addColorStop(1, oscuro);
      g.fillStyle = grd;
      g.globalAlpha = i > 4 ? 0.95 : 0.88;
      g.fillRect(x, 0, 50, 1920);
      g.globalAlpha = 1;
    }
  }
}

// Un piano de cola, centrado en (x, y). espejo -1 lo da la vuelta.
export function piano(g, x, y, s, { brillo = 1, espejo = 1, tecla = 0 } = {}) {
  g.save();
  g.translate(x, y);
  g.scale(s * espejo, s);
  g.fillStyle = "rgba(0,0,0,0.4)";
  g.beginPath();
  g.ellipse(10, 188, 250, 28, 0, 0, Math.PI * 2);
  g.fill();

  g.beginPath();
  g.moveTo(-250, 20);
  g.quadraticCurveTo(-210, -130, 20, -150);
  g.quadraticCurveTo(230, -130, 270, 10);
  g.quadraticCurveTo(250, 120, 0, 132);
  g.quadraticCurveTo(-230, 118, -250, 20);
  g.closePath();
  const cuerpo = g.createLinearGradient(-250, -150, 220, 140);
  cuerpo.addColorStop(0, "#2a2433");
  cuerpo.addColorStop(0.4, "#4a3d58");
  cuerpo.addColorStop(0.72, "#16121c");
  cuerpo.addColorStop(1, "#07060a");
  g.fillStyle = cuerpo;
  g.fill();
  g.lineWidth = 7;
  g.strokeStyle = `rgba(232,190,96,${0.8 * brillo})`;
  g.stroke();

  g.beginPath();
  g.moveTo(-190, -10);
  g.quadraticCurveTo(-140, -200, 30, -210);
  g.quadraticCurveTo(210, -170, 220, -20);
  g.quadraticCurveTo(40, -70, -190, -10);
  g.closePath();
  const tapa = g.createLinearGradient(0, -210, 40, 0);
  tapa.addColorStop(0, "#8a5a28");
  tapa.addColorStop(0.4, "#f0d7a0");
  tapa.addColorStop(1, "#a56b32");
  g.fillStyle = tapa;
  g.fill();
  g.strokeStyle = "rgba(255,236,200,0.45)";
  g.lineWidth = 1.4;
  for (let i = 0; i < 16; i++) {
    const u = i / 15;
    g.beginPath();
    g.moveTo(-150 + u * 340, -16);
    g.lineTo(-120 + u * 300, -150 - (1 - u) * 20);
    g.stroke();
  }

  g.beginPath();
  g.moveTo(-280, 78);
  g.lineTo(275, 78);
  g.lineTo(246, 148);
  g.lineTo(-250, 148);
  g.closePath();
  g.fillStyle = "#f7f1e6";
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.18;
  g.drawImage(k.manchas, -280, 78, 560, 70);
  g.restore();
  g.strokeStyle = "rgba(50,36,24,0.4)";
  g.lineWidth = 2;
  const blancas = 15;
  for (let i = 1; i < blancas; i++) {
    const u = i / blancas;
    g.beginPath();
    g.moveTo(-280 + u * 555, 78);
    g.lineTo(-250 + u * 496, 148);
    g.stroke();
  }
  const baja = Math.floor(Math.abs(tecla)) % blancas;
  if (tecla) {
    const u = (baja + 0.5) / blancas;
    g.fillStyle = "rgba(0,0,0,0.18)";
    g.beginPath();
    g.moveTo(-280 + (baja / blancas) * 555, 86);
    g.lineTo(-280 + ((baja + 1) / blancas) * 555, 86);
    g.lineTo(-250 + ((baja + 1) / blancas) * 496, 148);
    g.lineTo(-250 + (baja / blancas) * 496, 148);
    g.fill();
    void u;
  }
  g.fillStyle = "#14121a";
  for (const i of [0, 1, 3, 4, 5, 7, 8, 10, 11, 12]) {
    const u = (i + 0.68) / blancas;
    g.fillRect(-268 + u * 520, 78, 18, 40);
  }
  const pata = g.createLinearGradient(0, 140, 0, 230);
  pata.addColorStop(0, "#2a241c");
  pata.addColorStop(1, "#0a090c");
  g.fillStyle = pata;
  g.fillRect(-200, 136, 18, 78);
  g.fillRect(176, 136, 18, 78);
  g.save();
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.28 * brillo;
  g.fillStyle = "#fff6e0";
  g.beginPath();
  g.ellipse(-70, -30, 80, 26, -0.5, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.restore();
}

export function nota(g, x, y, s, oro = true) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = oro ? "#ffd56a" : "#fff1c4";
  g.beginPath();
  g.ellipse(0, 0, 16, 11, -0.7, 0, Math.PI * 2);
  g.fill();
  g.fillRect(12, -48, 3.2, 48);
  g.restore();
}

export function notasVolando(g, t, cx, cy, al = 1, vel = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  for (const n of NOTAS) {
    const z = ((n.z + t * vel * 0.55) % 2.6) + 0.35;
    const s = (0.55 / z) * (0.7 + 0.3 * n.fase);
    const x = cx + n.x / z;
    const y = cy + n.y / z - ((t * 40 * vel + n.fase * 200) % 180);
    if (x < -40 || x > 1120 || y < 500 || y > 1700) continue;
    nota(g, x, y, s * 1.4, n.oro);
  }
  g.restore();
}

export function ochoGrande(g, x, y, al, tam = 280) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 ${tam}px Figtree`;
  g.shadowColor = "rgba(255,186,60,0.9)";
  g.shadowBlur = 40;
  g.fillStyle = "#ffe7a8";
  g.fillText("8", x, y);
  g.shadowBlur = 0;
  g.fillStyle = "#fff8e4";
  g.fillText("8", x, y);
  g.restore();
}

export function revista(g, x, y, s, abierta = 0) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.beginPath();
  g.ellipse(0, 170, 240, 26, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f7f1e4";
  redondeado(g, -160, -30, 330, 280, 8);
  g.fill();
  g.strokeStyle = "rgba(40,28,16,0.35)";
  g.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const yy = 10 + i * 36;
    g.beginPath();
    g.moveTo(-130, yy);
    g.lineTo(140, yy);
    g.stroke();
  }
  g.fillStyle = "#1a1020";
  g.beginPath();
  g.ellipse(-40, 46, 14, 10, -0.6, 0, Math.PI * 2);
  g.fill();
  g.fillRect(-28, 8, 3, 40);
  const tapa = g.createLinearGradient(-200, -50, 40, 40);
  tapa.addColorStop(0, "#1c2744");
  tapa.addColorStop(1, "#0c1224");
  g.save();
  g.translate(-170, 110);
  g.rotate(-abierta * 1.2);
  g.translate(170, -110);
  g.fillStyle = tapa;
  redondeado(g, -180, -50, 270, 310, 10);
  g.fill();
  g.fillStyle = "rgba(232,190,96,0.9)";
  g.fillRect(-130, 40, 160, 10);
  g.fillRect(-130, 62, 90, 6);
  g.restore();
  g.restore();
}

function redondeado(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

const COLORES = ["#e25b4a", "#3aa0c8", "#f0a202", "#7a4de0", "#2f9e78", "#d4527a"];

export function persona(g, x, y, s, modo, i = 0) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  if (modo === "calma") g.rotate(-0.08);
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(0, 168, 78, 16, 0, 0, Math.PI * 2);
  g.fill();
  const c = COLORES[i % COLORES.length];
  g.strokeStyle = c;
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-58, 48);
  g.lineTo(-92, 130);
  g.moveTo(58, 48);
  g.lineTo(96, 118);
  g.stroke();
  g.fillStyle = "#e8b898";
  g.beginPath();
  g.arc(-92, 138, 14, 0, Math.PI * 2);
  g.arc(96, 126, 14, 0, Math.PI * 2);
  g.fill();
  const ropa = g.createLinearGradient(-70, 10, 50, 180);
  ropa.addColorStop(0, "#fff6ea");
  ropa.addColorStop(0.18, c);
  ropa.addColorStop(1, "#140c16");
  g.fillStyle = ropa;
  redondeado(g, -72, 8, 144, 158, 40);
  g.fill();
  g.fillStyle = "#f0c2a0";
  g.fillRect(-18, -6, 36, 28);
  const cara = g.createRadialGradient(-14, -58, 8, 0, -50, 54);
  cara.addColorStop(0, "#ffe0c8");
  cara.addColorStop(1, "#d99270");
  g.fillStyle = cara;
  g.beginPath();
  g.arc(0, -52, 50, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#2a160e";
  g.beginPath();
  g.arc(0, -66, 48, Math.PI * 1.08, Math.PI * 1.92);
  g.fill();
  g.fillStyle = "#3a2418";
  if (modo === "calma") {
    g.strokeStyle = "#3a2418";
    g.lineWidth = 3.2;
    g.beginPath();
    g.moveTo(-18, -56);
    g.quadraticCurveTo(-8, -50, 0, -56);
    g.moveTo(8, -56);
    g.quadraticCurveTo(18, -50, 24, -56);
    g.stroke();
  } else {
    g.beginPath();
    g.ellipse(-15, -54, 5.5, 6.5, 0, 0, Math.PI * 2);
    g.ellipse(15, -54, 5.5, 6.5, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.strokeStyle = "#c47a6a";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(0, -38, 10, 0.2, Math.PI - 0.2);
  g.stroke();
  if (modo !== "quieto") {
    const glow = modo === "oro" ? "rgba(255,200,80,0.95)" : "rgba(120,220,190,0.9)";
    g.strokeStyle = "#1a1218";
    g.lineWidth = 9;
    g.beginPath();
    g.arc(0, -62, 56, Math.PI * 1.12, Math.PI * 1.88);
    g.stroke();
    g.fillStyle = modo === "oro" ? "#3a2a12" : "#12302c";
    g.beginPath();
    g.arc(-48, -40, 18, 0, Math.PI * 2);
    g.arc(48, -40, 18, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = glow;
    g.lineWidth = 3.5;
    g.stroke();
  }
  g.restore();
}

export function cuarto(g, tinte) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#241438");
  bg.addColorStop(0.42, tinte);
  bg.addColorStop(1, "#120c18");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#4a3018";
  for (let i = 0; i < 8; i++) g.fillRect(i * 140, 520, 8, 980);
  g.fillStyle = "#5c3a22";
  g.fillRect(0, 1360, 1080, 560);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.35;
  g.drawImage(k.manchas, 0, 1360, 1080, 560);
  g.restore();
  const luz = g.createRadialGradient(540, 700, 40, 540, 900, 700);
  luz.addColorStop(0, "rgba(255,220,170,0.16)");
  luz.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 1080, 1600);
}

export function folio(g, x, y, w, h, { pliegue = 0, agujeros = 0 } = {}) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath();
  g.ellipse(0, h * 0.5 + 16, w * 0.42, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f7f1e4";
  redondeado(g, -w / 2, -h / 2, w, h, 12);
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.22;
  g.drawImage(k.red, -w / 2, -h / 2, w, h);
  g.restore();
  const sombra = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  sombra.addColorStop(0, "rgba(90,60,30,0.18)");
  sombra.addColorStop(0.2, "rgba(255,255,255,0)");
  sombra.addColorStop(1, "rgba(90,60,30,0.12)");
  g.fillStyle = sombra;
  g.fillRect(-w / 2, -h / 2, w, h);
  if (pliegue > 0.04) {
    const ph = h * 0.34 * Math.min(1, pliegue);
    const fg = g.createLinearGradient(0, -h / 2, 0, -h / 2 + ph);
    fg.addColorStop(0, "#d9c7a4");
    fg.addColorStop(1, "#f4ecdc");
    g.fillStyle = fg;
    g.fillRect(-w / 2 + 8, -h / 2, w - 16, ph);
    g.strokeStyle = "rgba(90,60,30,0.45)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-w / 2 + 8, -h / 2 + ph);
    g.lineTo(w / 2 - 8, -h / 2 + ph);
    g.stroke();
  }
  if (agujeros > 0.02) {
    g.save();
    g.globalAlpha *= agujeros;
    const pts = [[-w * 0.22, -h * 0.05], [w * 0.02, -h * 0.16], [w * 0.24, 0.02 * h], [-w * 0.08, h * 0.16], [w * 0.18, h * 0.2]];
    for (const [px, py] of pts) {
      g.beginPath();
      g.arc(px, py, 22, 0, Math.PI * 2);
      g.fillStyle = "#1a1020";
      g.fill();
      g.strokeStyle = "rgba(255,255,255,0.35)";
      g.lineWidth = 3;
      g.stroke();
    }
    g.restore();
  }
  g.restore();
}

export function tijeras(g, x, y, s, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  g.strokeStyle = "#d7dde6";
  g.lineWidth = 10;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-70, 30);
  g.lineTo(50, -8);
  g.moveTo(-70, -30);
  g.lineTo(50, 8);
  g.stroke();
  g.fillStyle = "#e8c56a";
  g.beginPath();
  g.arc(-78, 36, 16, 0, Math.PI * 2);
  g.arc(-78, -36, 16, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function numero(g, texto, x, y, tam, color, al) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 ${tam}px Figtree`;
  g.shadowColor = `rgba(${color},0.85)`;
  g.shadowBlur = 28;
  g.fillStyle = `rgb(${color})`;
  g.fillText(texto, x, y);
  g.restore();
}

export function reloj(g, x, y, s, minutos, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(8, 16, 78, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.arc(0, 0, 86, 0, Math.PI * 2);
  const cara = g.createRadialGradient(-20, -24, 10, 0, 0, 86);
  cara.addColorStop(0, "#fffaf1");
  cara.addColorStop(1, "#e4d3b4");
  g.fillStyle = cara;
  g.fill();
  g.lineWidth = 10;
  g.strokeStyle = "#3a2216";
  g.stroke();
  g.strokeStyle = "#3a2216";
  g.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    g.beginPath();
    g.moveTo(Math.cos(a) * 62, Math.sin(a) * 62);
    g.lineTo(Math.cos(a) * 74, Math.sin(a) * 74);
    g.stroke();
  }
  const ang = -Math.PI / 2 + (minutos / 60) * Math.PI * 2;
  g.strokeStyle = "#c4522a";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(Math.cos(ang) * 58, Math.sin(ang) * 58);
  g.stroke();
  g.fillStyle = "#c4522a";
  g.beginPath();
  g.arc(0, 0, 7, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function libroCerrado(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(0, 130, 180, 20, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f4ecdc";
  redondeado(g, -150, -90, 36, 220, 6);
  g.fill();
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i % 2 ? "#e7dcc6" : "#f7f1e4";
    g.fillRect(-148 + i * 3, -88, 3, 216);
  }
  const tapa = g.createLinearGradient(-140, -100, 160, 140);
  tapa.addColorStop(0, "#243056");
  tapa.addColorStop(1, "#10182c");
  g.fillStyle = tapa;
  redondeado(g, -130, -110, 280, 240, 12);
  g.fill();
  g.strokeStyle = "rgba(232,190,96,0.7)";
  g.lineWidth = 4;
  g.stroke();
  g.restore();
}

export function tarjeta(g, x, y, s, tipo, ang = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  g.fillStyle = "#fffaf1";
  redondeado(g, -70, -90, 140, 180, 10);
  g.fill();
  g.strokeStyle = "rgba(40,24,16,0.25)";
  g.lineWidth = 3;
  g.stroke();
  if (tipo === "folio") {
    g.fillStyle = "#1a1020";
    for (const [px, py] of [[-20, -20], [16, -8], [-6, 24], [22, 36]]) {
      g.beginPath();
      g.arc(px, py, 10, 0, Math.PI * 2);
      g.fill();
    }
  } else if (tipo === "patron") {
    g.fillStyle = "#e25b4a";
    g.beginPath();
    g.moveTo(0, -40);
    g.lineTo(36, 20);
    g.lineTo(-36, 20);
    g.fill();
    g.fillStyle = "#3aa0c8";
    g.fillRect(-28, 36, 24, 24);
    g.beginPath();
    g.arc(22, 48, 14, 0, Math.PI * 2);
    g.fill();
  } else {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      g.fillStyle = (r + c) % 2 ? "#2a160e" : "#f0a202";
      g.beginPath();
      g.arc(-28 + c * 28, -28 + r * 28, 8, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.restore();
}

export function cuento(g, x, y, s, abierto) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(10, 150, 200, 22, 0, 0, Math.PI * 2);
  g.fill();
  const hoja = (dx, giro) => {
    g.save();
    g.translate(dx, 0);
    g.rotate(giro);
    g.fillStyle = "#fff6e8";
    redondeado(g, 0, -120, 190, 250, 8);
    g.fill();
    g.restore();
  };
  hoja(-20, -abierto * 0.15);
  g.save();
  g.translate(10, 0);
  const cielo = g.createLinearGradient(0, -100, 0, 80);
  cielo.addColorStop(0, "#243056");
  cielo.addColorStop(1, "#c47a4a");
  g.fillStyle = cielo;
  redondeado(g, -170, -120, 180, 250, 8);
  g.fill();
  g.globalAlpha *= Math.min(1, abierto * 1.4);
  g.fillStyle = "#f4e2a8";
  g.beginPath();
  g.arc(-90, -50, 22, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1c2438";
  g.beginPath();
  g.moveTo(-160, 40);
  g.lineTo(-90, -10);
  g.lineTo(-20, 50);
  g.fill();
  g.fillStyle = "#6b2a2a";
  redondeado(g, -120, 20, 46, 36, 4);
  g.fill();
  g.restore();
  g.save();
  g.translate(-180 + abierto * 10, 0);
  g.rotate(-abierto * 1.2);
  g.fillStyle = "#8e1e2e";
  redondeado(g, 0, -130, 200, 270, 10);
  g.fill();
  g.fillStyle = "rgba(232,190,96,0.85)";
  g.fillRect(30, -8, 140, 8);
  g.restore();
  g.restore();
}

export function estanteria(g, al, filas) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  const colores = ["#e25b4a", "#f0a202", "#3aa0c8", "#7a4de0", "#2f9e78", "#d4527a", "#243056"];
  for (let f = 0; f < filas; f++) {
    const y = 740 + f * 140;
    g.fillStyle = "#4a301c";
    g.fillRect(80, y + 110, 920, 16);
    const n = 8;
    for (let i = 0; i < n; i++) {
      const x = 110 + i * 108;
      const h = 90 + ((i * 3 + f) % 4) * 8;
      g.fillStyle = colores[(i + f) % colores.length];
      g.fillRect(x, y + 110 - h, 78, h);
      g.fillStyle = "rgba(255,255,255,0.18)";
      g.fillRect(x + 8, y + 120 - h, 8, h - 20);
    }
  }
  g.restore();
}

export function barra(g, x, y, h, color, al = 1) {
  if (al <= 0.01 || h <= 1) return;
  g.save();
  g.globalAlpha *= al;
  const grd = g.createLinearGradient(x, y - h, x, y);
  grd.addColorStop(0, "#fff6dd");
  grd.addColorStop(0.25, color);
  grd.addColorStop(1, "#1a1020");
  g.fillStyle = grd;
  redondeado(g, x - 54, y - h, 108, h, 24);
  g.fill();
  g.restore();
}

export function llama(g, x, y, s, t) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  k.lengua(g, 0, 0, 150, 70, t, 0.2, "255,150,40", "255,230,150");
  k.lengua(g, 0, 10, 100, 40, t, 1.4, "255,90,30", "255,210,120");
  g.restore();
}

export function multitud(g, al, n) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  const az = k.azar(3000);
  for (let i = 0; i < n; i++) {
    const x = 140 + (i % 10) * 82 + az() * 6;
    const y = 1280 + Math.floor(i / 10) * 36;
    g.fillStyle = COLORES[i % COLORES.length];
    g.beginPath();
    g.arc(x, y, 16, 0, Math.PI * 2);
    g.fill();
    g.fillRect(x - 14, y + 10, 28, 22);
  }
  g.restore();
}
