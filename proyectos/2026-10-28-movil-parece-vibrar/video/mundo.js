// El móvil, el bolsillo, la gente y las escenas que comparten los planos.
import * as k from "#kit";

export const velo = (g, fuerza = 0.78) => {
  const v = g.createLinearGradient(0, 220, 0, 560);
  v.addColorStop(0, `rgba(6,8,16,${fuerza})`);
  v.addColorStop(1, "rgba(6,8,16,0)");
  g.fillStyle = v;
  g.fillRect(0, 200, 1080, 400);
};

const PIELES = ["#f6d3b4", "#e7b08a", "#c98462", "#8d5a3c", "#f3c2a0", "#a86b45"];
const PELOS = ["#241c18", "#5c3a28", "#1a1a22", "#c4a46a", "#3a2418", "#6e4030"];

export function anillos(g, x, y, t, fuerza, alto = 0.55, escala = 1) {
  if (fuerza < 0.02 || escala < 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const u = ((t * 0.85 + i / 4) % 1);
    const r = (70 + u * 280) * escala;
    const al = Math.pow(1 - u, 1.4) * fuerza;
    g.strokeStyle = `rgba(180,245,255,${al})`;
    g.lineWidth = 22 * escala * (1 - u * 0.5);
    g.beginPath();
    g.ellipse(x, y, r * 0.78, r * alto, 0, 0, Math.PI * 2);
    g.stroke();
  }
  g.restore();
  k.brillo(g, x, y, 420 * escala, "cian", 0.5 * fuerza);
}

export function hilosCobre(g, t, al) {
  if (al < 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 7; i++) {
    const y = 640 + i * 110;
    const onda = Math.sin(t * 2.2 + i) * 14;
    g.strokeStyle = `rgba(255,176,80,${0.15 + al * 0.55})`;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(80, y);
    g.quadraticCurveTo(540, y + onda, 1000, y - onda * 0.4);
    g.stroke();
  }
  g.restore();
}

export function bolsillo(g, t, opt = {}) {
  const calor = opt.calor ?? 0;
  g.fillStyle = "#070b16";
  g.fillRect(0, 0, 1080, 1920);
  const gr = g.createRadialGradient(540, 120, 30, 540, 780, 1200);
  gr.addColorStop(0, k.mezColor("#8eb0dc", "#c47a48", calor * 0.35));
  gr.addColorStop(0.22, "#2a4678");
  gr.addColorStop(0.55, "#14243f");
  gr.addColorStop(1, "#070b14");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalAlpha = 0.28;
  g.strokeStyle = "#16325c";
  g.lineWidth = 3;
  const off = (opt.rush ?? 0) * 36 + Math.sin(t * 0.8) * 3;
  for (let i = -8; i < 48; i++) {
    g.beginPath();
    g.moveTo(-280 + i * 36 + off, -40);
    g.lineTo(-40 + i * 36 + off, 1980);
    g.stroke();
  }
  g.restore();
  // boca del bolsillo, arriba, con luz de fuera
  g.save();
  const boca = g.createLinearGradient(0, 0, 0, 420);
  boca.addColorStop(0, "rgba(186,214,245,0.55)");
  boca.addColorStop(1, "rgba(186,214,245,0)");
  g.fillStyle = boca;
  g.fillRect(0, 0, 1080, 420);
  g.strokeStyle = "rgba(232,168,96,0.85)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(40, 210);
  g.quadraticCurveTo(540, 300, 1040, 210);
  g.stroke();
  g.strokeStyle = "rgba(255,220,170,0.35)";
  g.lineWidth = 2;
  g.setLineDash([10, 14]);
  g.beginPath();
  g.moveTo(70, 250);
  g.quadraticCurveTo(540, 330, 1010, 250);
  g.stroke();
  g.restore();
  // remaches
  for (const [x, y] of [[150, 430], [930, 430]]) {
    const rg = g.createRadialGradient(x - 6, y - 6, 2, x, y, 22);
    rg.addColorStop(0, "#fff1c8");
    rg.addColorStop(0.45, "#e0a050");
    rg.addColorStop(1, "#7a4a18");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(x, y, 18, 0, Math.PI * 2);
    g.fill();
  }
}

export function movil(g, x, y, w, ang = 0, op = {}) {
  const al = op.al ?? 1;
  if (al < 0.02 || w < 8) return;
  const h = w * 2.02;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.beginPath();
  g.ellipse(0, h * 0.48, w * 0.42, w * 0.08, 0, 0, Math.PI * 2);
  g.fill();
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.16);
  const cuerpo = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  cuerpo.addColorStop(0, op.claro || "#4a5568");
  cuerpo.addColorStop(0.35, op.medio || "#1c2230");
  cuerpo.addColorStop(1, op.oscuro || "#0a0c12");
  g.fillStyle = cuerpo;
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.28)";
  g.lineWidth = Math.max(2, w * 0.012);
  g.stroke();
  const m = w * 0.075;
  k.redondo(g, -w / 2 + m, -h / 2 + m * 2.1, w - m * 2, h - m * 3.3, w * 0.1);
  const pantalla = g.createLinearGradient(0, -h / 2, 0, h / 2);
  pantalla.addColorStop(0, "#12151c");
  pantalla.addColorStop(0.4, "#07080c");
  pantalla.addColorStop(1, "#0c1018");
  g.fillStyle = pantalla;
  g.fill();
  // un brillo corto de cristal, en una esquina: la pantalla sigue negra
  g.save();
  g.globalCompositeOperation = "lighter";
  const br = g.createLinearGradient(-w * 0.32, -h * 0.36, -w * 0.05, -h * 0.05);
  br.addColorStop(0, "rgba(220,235,255,0.28)");
  br.addColorStop(1, "rgba(220,235,255,0)");
  g.fillStyle = br;
  k.redondo(g, -w / 2 + m, -h / 2 + m * 2.1, w * 0.42, h * 0.28, w * 0.08);
  g.fill();
  g.restore();
  // pastilla de cámara
  g.fillStyle = "#161a22";
  k.redondo(g, -w * 0.22, -h * 0.46, w * 0.28, w * 0.1, w * 0.05);
  g.fill();
  g.fillStyle = "#2a3344";
  g.beginPath();
  g.arc(-w * 0.12, -h * 0.46 + w * 0.05, w * 0.028, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function mano(g, x, y, s, u, op = {}) {
  if (u < 0.02) return;
  const piel = op.piel || "#e7b08a";
  const yy = y + (1 - u) * 240;
  g.save();
  g.translate(x, yy);
  g.scale(s, s);
  g.globalAlpha *= Math.min(1, u * 1.3);
  const palma = g.createLinearGradient(-80, 0, 90, 200);
  palma.addColorStop(0, "#ffe4cc");
  palma.addColorStop(0.45, piel);
  palma.addColorStop(1, "#8a4e38");
  g.fillStyle = palma;
  g.beginPath();
  g.moveTo(-160, 40);
  g.quadraticCurveTo(-180, 150, -30, 200);
  g.quadraticCurveTo(100, 230, 180, 130);
  g.quadraticCurveTo(190, 40, 140, 16);
  g.quadraticCurveTo(20, 60, -160, 40);
  g.fill();
  for (let i = 0; i < 4; i++) {
    g.fillStyle = palma;
    g.beginPath();
    g.ellipse(-110 + i * 72, -10, 26, 78, 0.04 * i, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(255,236,220,0.55)";
    g.beginPath();
    g.ellipse(-110 + i * 72, -62, 12, 8, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = palma;
  g.beginPath();
  g.ellipse(-185, 24, 32, 64, -0.8, 0, Math.PI * 2);
  g.fill();
  if (op.pulsera) {
    g.strokeStyle = "#ff7a4a";
    g.lineWidth = 16;
    g.beginPath();
    g.arc(8, 168, 80, 0.2, Math.PI - 0.2);
    g.stroke();
    g.fillStyle = "#ffe08a";
    for (let i = 0; i < 5; i++) {
      g.beginPath();
      g.arc(-48 + i * 28, 220, 8, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.restore();
}

export function persona(g, x, y, h, semilla, op = {}) {
  const az = k.azar(semilla);
  const piel = op.piel || PIELES[Math.floor(az() * PIELES.length)];
  const pelo = op.pelo || PELOS[Math.floor(az() * PELOS.length)];
  const ropa = op.ropa || ["#ff6b6b", "#ffd15c", "#3ecfb2", "#7aa2ff", "#ff8ad4", "#f2f4f8"][Math.floor(az() * 6)];
  const mira = op.mira ?? 0;
  const hombro = op.hombro ?? 0;
  const paso = op.paso ?? 0;
  g.save();
  g.translate(x, y + hombro * h * 0.09);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath();
  g.ellipse(0, 8, h * 0.18, h * 0.04, 0, 0, Math.PI * 2);
  g.fill();
  // piernas
  g.fillStyle = op.pantalon || "#1c2433";
  const sep = paso * h * 0.04;
  g.fillRect(-h * 0.07 - sep, -h * 0.42, h * 0.06, h * 0.42);
  g.fillRect(h * 0.01 + sep, -h * 0.42, h * 0.06, h * 0.42);
  // torso
  const tg = g.createLinearGradient(-h * 0.2, -h * 0.92, h * 0.2, -h * 0.4);
  tg.addColorStop(0, "#ffffff");
  tg.addColorStop(0.18, ropa);
  tg.addColorStop(1, "#141820");
  g.fillStyle = tg;
  g.beginPath();
  g.moveTo(-h * 0.08, -h * 0.42);
  g.quadraticCurveTo(-h * 0.2, -h * 0.7, -h * 0.16, -h * 0.86);
  g.quadraticCurveTo(0, -h * 0.96, h * 0.16, -h * 0.86);
  g.quadraticCurveTo(h * 0.2, -h * 0.7, h * 0.08, -h * 0.42);
  g.closePath();
  g.fill();
  if (op.bata) {
    g.fillStyle = "rgba(255,255,255,0.14)";
    g.fillRect(-h * 0.012, -h * 0.84, h * 0.024, h * 0.4);
  }
  // cuello y cabeza
  g.fillStyle = piel;
  g.fillRect(-h * 0.03, -h * 0.92, h * 0.06, h * 0.08);
  const cg = g.createRadialGradient(-h * 0.03, -h * 1.02, h * 0.02, 0, -h * 0.98, h * 0.1);
  cg.addColorStop(0, "#ffe8d6");
  cg.addColorStop(0.55, piel);
  cg.addColorStop(1, "#6a4030");
  g.fillStyle = cg;
  g.beginPath();
  g.arc(0, -h * 0.99, h * 0.09, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = pelo;
  g.beginPath();
  g.arc(0, -h * 1.02, h * 0.092, Math.PI * 1.05, Math.PI * 1.95);
  g.fill();
  g.fillStyle = "#1c120e";
  g.beginPath();
  g.ellipse(-h * 0.03, -h * 0.99, h * 0.012, h * 0.015, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(h * 0.032, -h * 0.99, h * 0.012, h * 0.015, 0, 0, Math.PI * 2);
  g.fill();
  if (mira > 0.02) {
    g.strokeStyle = piel;
    g.lineWidth = h * 0.05;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(h * 0.12, -h * 0.78);
    g.quadraticCurveTo(h * 0.28, -h * 0.62, h * 0.04, -h * 0.62);
    g.stroke();
    const px = h * 0.02, py = -h * 0.58 + (op.baja ?? 0) * h * 0.32;
    movil(g, px, py, h * 0.22, -0.18 + (op.baja ?? 0) * 0.25, { al: mira });
    if (op.pulso > 0.02) anillos(g, px, py, op.t || 0, op.pulso * mira, 0.5, Math.min(0.55, h / 1400));
  }
  g.restore();
}

export function cabeza(g, x, y, s, t, opt = {}) {
  const espera = opt.espera ?? 0;
  const puede = opt.puede ?? 0;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // cráneo
  const cg = g.createRadialGradient(-40, -80, 20, 20, 10, 280);
  cg.addColorStop(0, "#f3c7a4");
  cg.addColorStop(0.45, "#d3926c");
  cg.addColorStop(1, "#6a3a2c");
  g.fillStyle = cg;
  g.beginPath();
  g.moveTo(-150, 40);
  g.quadraticCurveTo(-180, -80, -90, -170);
  g.quadraticCurveTo(10, -230, 120, -160);
  g.quadraticCurveTo(190, -80, 150, 30);
  g.quadraticCurveTo(130, 90, 70, 110);
  g.lineTo(-40, 120);
  g.quadraticCurveTo(-120, 100, -150, 40);
  g.fill();
  // pelo
  g.fillStyle = "#2a211c";
  g.beginPath();
  g.moveTo(-150, 10);
  g.quadraticCurveTo(-170, -120, -60, -190);
  g.quadraticCurveTo(40, -240, 140, -150);
  g.quadraticCurveTo(100, -180, 20, -160);
  g.quadraticCurveTo(-40, -150, -70, -80);
  g.quadraticCurveTo(-90, -20, -150, 10);
  g.fill();
  // oreja
  g.fillStyle = "#e0a484";
  g.beginPath();
  g.ellipse(128, -10, 28, 42, 0.2, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(120,60,40,0.45)";
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(128, -10, 14, 24, 0.2, 0, Math.PI * 2);
  g.stroke();
  // masa del cerebro, vista en la sien, sin rótulos
  g.save();
  g.beginPath();
  g.ellipse(20, -70, 92, 78, -0.2, 0, Math.PI * 2);
  g.clip();
  const bg = g.createRadialGradient(-10, -90, 10, 20, -60, 120);
  const cian = puede;
  bg.addColorStop(0, k.mezColor("#ffe1a8", "#bff6ff", cian));
  bg.addColorStop(0.5, k.mezColor("#ff9a3c", "#3ad0e8", cian));
  bg.addColorStop(1, k.mezColor("#8a2a18", "#124058", cian));
  g.fillStyle = bg;
  g.fillRect(-120, -180, 280, 240);
  g.strokeStyle = "rgba(255,236,210,0.45)";
  g.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.moveTo(-70, -120 + i * 28);
    g.quadraticCurveTo(10, -100 + i * 28 + Math.sin(t * 1.4 + i) * 4, 90, -130 + i * 30);
    g.stroke();
  }
  g.restore();
  // ojo y nariz, hacia la izquierda
  g.fillStyle = "#2a1814";
  g.beginPath();
  g.ellipse(-78, -20, 8, 10, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#6a3a2c";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(-150, 10);
  g.quadraticCurveTo(-170, 28, -150, 42);
  g.stroke();
  g.restore();
  const pul = 0.25 + 0.2 * Math.sin(t * 2.2) + espera * 0.45;
  k.brillo(g, x + 20 * s, y - 70 * s, 280 * s, cian > 0.4 ? "cian" : "sodio", pul * 0.45);
}

export function cuna(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "#6a4328";
  for (const bx of [-150, 150]) {
    g.fillRect(bx - 10, -20, 20, 150);
  }
  g.fillRect(-160, 120, 320, 18);
  g.fillRect(-160, -30, 320, 16);
  g.strokeStyle = "#c4884e";
  g.lineWidth = 6;
  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.moveTo(i * 48, -20);
    g.lineTo(i * 48, 120);
    g.stroke();
  }
  g.restore();
}

export function bebe(g, x, y, s, t, quieto = 0) {
  const respira = (1 - quieto) * Math.sin(t * 1.6) * 0.02 + 0.01 * Math.sin(t * 1.6);
  g.save();
  g.translate(x, y);
  g.scale(s, s * (1 + respira));
  // manta
  const mg = g.createLinearGradient(0, -40, 0, 80);
  mg.addColorStop(0, "#ffd0e0");
  mg.addColorStop(0.5, "#ff7aa8");
  mg.addColorStop(1, "#c43b6e");
  g.fillStyle = mg;
  g.beginPath();
  g.ellipse(0, 30, 120, 70, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.3)";
  g.beginPath();
  g.ellipse(-30, 8, 40, 16, -0.4, 0, Math.PI * 2);
  g.fill();
  // cabeza
  const cg = g.createRadialGradient(-16, -50, 4, 0, -40, 54);
  cg.addColorStop(0, "#ffe0cc");
  cg.addColorStop(0.6, "#f0b090");
  cg.addColorStop(1, "#c08060");
  g.fillStyle = cg;
  g.beginPath();
  g.arc(0, -36, 48, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#5a3828";
  g.beginPath();
  g.arc(0, -48, 40, Math.PI * 1.1, Math.PI * 1.9);
  g.fill();
  // ojos cerrados
  g.strokeStyle = "#6a4034";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(-16, -34, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  g.stroke();
  g.beginPath();
  g.arc(14, -34, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  g.stroke();
  g.restore();
}

export function madre(g, x, y, s, erguida) {
  g.save();
  g.translate(x, y + (1 - erguida) * 70);
  g.scale(s, s);
  // silla
  g.fillStyle = "#3a2a22";
  g.fillRect(-70, 40, 140, 18);
  g.fillRect(-60, 50, 16, 80);
  g.fillRect(44, 50, 16, 80);
  // cuerpo
  const tg = g.createLinearGradient(0, -180, 0, 40);
  tg.addColorStop(0, "#ffe0c4");
  tg.addColorStop(0.3, "#ff8f6a");
  tg.addColorStop(1, "#8a3040");
  g.fillStyle = tg;
  g.beginPath();
  g.moveTo(-50, 40);
  g.quadraticCurveTo(-70, -60, -40, -120);
  g.quadraticCurveTo(0, -150, 40, -120);
  g.quadraticCurveTo(70, -40, 50, 40);
  g.closePath();
  g.fill();
  // cabeza
  const cg = g.createRadialGradient(-10, -180, 6, 0, -160, 50);
  cg.addColorStop(0, "#ffe6d2");
  cg.addColorStop(0.6, "#e8aa84");
  cg.addColorStop(1, "#a86a50");
  g.fillStyle = cg;
  g.beginPath();
  g.arc(0, -160, 42, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#3a241c";
  g.beginPath();
  g.arc(4, -172, 44, Math.PI * 0.85, Math.PI * 2.15);
  g.fill();
  g.fillStyle = "#2a1814";
  g.beginPath();
  g.ellipse(-14, -158, 4, 5, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(12, -158, 4, 5, 0, 0, Math.PI * 2);
  g.fill();
  // brazo a la oreja cuando se incorpora
  g.strokeStyle = "#e8aa84";
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(36, -90);
  g.quadraticCurveTo(80, -110 - erguida * 30, 20 + erguida * 30, -175 + erguida * 20);
  g.stroke();
  g.restore();
}

export function monitor(g, x, y, s, t, oye) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  k.redondo(g, -70, -50, 140, 100, 16);
  g.fillStyle = "#1a2430";
  g.fill();
  k.redondo(g, -58, -38, 116, 64, 10);
  g.fillStyle = "#07140f";
  g.fill();
  g.strokeStyle = `rgba(80,255,170,${0.45 + oye * 0.4})`;
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-48, 0);
  for (let i = 0; i <= 16; i++) {
    const xx = -48 + i * 6;
    const yy = Math.sin(i * 0.7 + t) * (2 + oye * 10);
    g.lineTo(xx, yy);
  }
  g.stroke();
  g.restore();
  if (oye > 0.05) k.brillo(g, x, y, 160, "verde", oye * 0.4);
}

export function ventana(g, u) {
  // u 0 mañana, 1 tarde
  g.fillStyle = "#120c18";
  g.fillRect(0, 0, 1080, 1920);
  const cielo = g.createLinearGradient(0, 200, 0, 1100);
  cielo.addColorStop(0, k.mezColor("#7ec8ff", "#ff7a3c", u));
  cielo.addColorStop(0.55, k.mezColor("#ffe29a", "#ffb15a", u));
  cielo.addColorStop(1, k.mezColor("#d8ecff", "#ff8a5a", u));
  g.fillStyle = cielo;
  k.redondo(g, 140, 260, 800, 780, 36);
  g.fill();
  // marco
  g.strokeStyle = "#f2e2c8";
  g.lineWidth = 18;
  g.stroke();
  g.beginPath();
  g.moveTo(540, 270);
  g.lineTo(540, 1030);
  g.moveTo(150, 640);
  g.lineTo(930, 640);
  g.stroke();
  const solX = k.mez(280, 820, u);
  const solY = k.mez(480, 760, u);
  const sg = g.createRadialGradient(solX, solY, 10, solX, solY, 90);
  sg.addColorStop(0, "#fff6d0");
  sg.addColorStop(0.5, "#ffd15c");
  sg.addColorStop(1, "rgba(255,160,40,0)");
  g.fillStyle = sg;
  g.beginPath();
  g.arc(solX, solY, 90, 0, Math.PI * 2);
  g.fill();
  // pared y suelo
  const pared = g.createLinearGradient(0, 1000, 0, 1920);
  pared.addColorStop(0, "#3a2a28");
  pared.addColorStop(1, "#1a1216");
  g.fillStyle = pared;
  g.fillRect(0, 1040, 1080, 880);
}

export function sillaVaquera(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "#6a3e28";
  g.fillRect(-80, -20, 160, 18);
  g.fillRect(-70, -10, 14, 90);
  g.fillRect(56, -10, 14, 90);
  // vaquero doblado
  const dg = g.createLinearGradient(-70, -80, 70, 40);
  dg.addColorStop(0, "#3d6294");
  dg.addColorStop(0.5, "#1e3358");
  dg.addColorStop(1, "#0e1a30");
  g.fillStyle = dg;
  g.beginPath();
  g.moveTo(-76, -10);
  g.quadraticCurveTo(-90, -70, -20, -90);
  g.quadraticCurveTo(40, -100, 78, -40);
  g.quadraticCurveTo(40, 10, -76, -10);
  g.fill();
  g.strokeStyle = "rgba(232,168,96,0.8)";
  g.lineWidth = 3;
  g.stroke();
  g.restore();
}

export function calle(g, t) {
  const cielo = g.createLinearGradient(0, 0, 0, 1920);
  cielo.addColorStop(0, "#1a0a24");
  cielo.addColorStop(0.45, "#2a1030");
  cielo.addColorStop(1, "#120814");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1920);
  // neones
  g.save();
  g.globalCompositeOperation = "lighter";
  const parpadeo = 0.75 + 0.25 * Math.sin(t * 1.3);
  k.brillo(g, 180, 620, 520, "255,70,140", 0.45 * parpadeo);
  k.brillo(g, 860, 760, 480, "40,220,190", 0.4);
  g.fillStyle = `rgba(255,70,150,${0.35 * parpadeo})`;
  k.redondo(g, 80, 520, 220, 70, 18);
  g.fill();
  g.fillStyle = "rgba(40,230,200,0.3)";
  k.redondo(g, 760, 680, 180, 56, 16);
  g.fill();
  g.restore();
  // suelo
  const suelo = g.createLinearGradient(0, 1200, 0, 1920);
  suelo.addColorStop(0, "#241018");
  suelo.addColorStop(1, "#0c060c");
  g.fillStyle = suelo;
  g.fillRect(0, 1280, 1080, 640);
  g.strokeStyle = "rgba(255,180,210,0.15)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(0, 1500);
  g.lineTo(1080, 1460);
  g.stroke();
}

export function telar(g, t, roce) {
  g.fillStyle = "#07101f";
  g.fillRect(0, 0, 1080, 1920);
  const base = g.createLinearGradient(0, 0, 1080, 1600);
  base.addColorStop(0, "#16366c");
  base.addColorStop(0.5, "#1d4e92");
  base.addColorStop(1, "#0c2044");
  g.fillStyle = base;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  const off = Math.sin(t * 1.2) * 6 + roce * 24;
  for (let i = -8; i < 36; i++) {
    g.fillStyle = i % 2 === 0 ? "rgba(6,16,40,0.45)" : "rgba(150,190,230,0.13)";
    g.beginPath();
    g.moveTo(-160 + i * 42 + off, -40);
    g.lineTo(-40 + i * 42 + off, 1980);
    g.lineTo(8 + i * 42 + off, 1980);
    g.lineTo(-112 + i * 42 + off, -40);
    g.fill();
  }
  g.restore();
  // costura de cobre
  g.strokeStyle = "rgba(232,160,80,0.9)";
  g.lineWidth = 6;
  g.setLineDash([16, 18]);
  g.beginPath();
  g.moveTo(80, 520);
  g.quadraticCurveTo(540, 600, 1000, 500);
  g.stroke();
  g.setLineDash([]);
  if (roce > 0.02 && roce < 0.98) {
    const x = k.mez(200, 880, roce);
    const y = k.mez(700, 1200, roce);
    k.brillo(g, x, y, 360, "sodio", 0.9);
  }
}

export function pielSalto(g, t, salto, abierto) {
  if (abierto < 0.02) return;
  g.save();
  g.globalAlpha *= abierto;
  const pg = g.createLinearGradient(0, 700, 0, 1700);
  pg.addColorStop(0, "#f6d0b6");
  pg.addColorStop(0.45, "#e39a78");
  pg.addColorStop(1, "#a15a48");
  g.fillStyle = pg;
  g.beginPath();
  g.moveTo(140, 860);
  g.quadraticCurveTo(540, 700 - salto * 80, 940, 860);
  g.lineTo(960, 1700);
  g.quadraticCurveTo(540, 1840, 120, 1700);
  g.closePath();
  g.fill();
  const bg = g.createRadialGradient(520, 1000 - salto * 50, 20, 540, 1120, 340);
  bg.addColorStop(0, "rgba(255,236,224,0.9)");
  bg.addColorStop(0.4, "rgba(255,190,160,0.35)");
  bg.addColorStop(1, "rgba(255,190,160,0)");
  g.fillStyle = bg;
  g.beginPath();
  g.ellipse(540, 1080 - salto * 80, 220 + salto * 30, 90 + salto * 110, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function mesaDias(g, x, y, s, t, viaje) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // mesa
  const mg = g.createLinearGradient(0, -40, 0, 80);
  mg.addColorStop(0, "#f0c48a");
  mg.addColorStop(1, "#a86a3a");
  g.fillStyle = mg;
  k.redondo(g, -340, -30, 680, 200, 28);
  g.fill();
  // catorce cuentas, dos semanas
  const cual = Math.floor(viaje * 13.99);
  for (let i = 0; i < 14; i++) {
    const col = i % 7, fila = Math.floor(i / 7);
    const cx = -220 + col * 74, cy = 20 + fila * 70;
    const on = viaje > 0.02 && i === cual;
    g.fillStyle = on ? "#9ff4ff" : (fila === 0 ? "#fff6e4" : "#ffe0b0");
    g.beginPath();
    g.arc(cx, cy, on ? 22 : 16, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
  if (viaje > 0.05 && viaje < 0.98) {
    const i = Math.min(13, Math.floor(viaje * 13.99));
    const col = i % 7, fila = Math.floor(i / 7);
    k.brillo(g, x + (-220 + col * 74) * s, y + (20 + fila * 70) * s, 120, "cian", 0.7);
  }
}
