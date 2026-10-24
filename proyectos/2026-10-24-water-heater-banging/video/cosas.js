// El depósito, la cal, las llaves y el cuadro. El mismo objeto en todos los planos.
import * as k from "#kit";
import { chorro, cromo, gota, guante, suelo } from "./mundo.js";

const SEM = k.azar(9);
const MOTAS = Array.from({ length: 18 }, () => ({ a: SEM() * 6.2, f: SEM(), r: 5 + SEM() * 8, v: 0.4 + SEM() * 0.8 }));
const BURBUJAS = Array.from({ length: 10 }, () => ({ x: SEM() * 520 - 260, f: SEM(), r: 8 + SEM() * 16, v: 0.25 + SEM() * 0.5 }));
const GRANOS = Array.from({ length: 28 }, () => ({ x: SEM() * 760 - 380, y: SEM() * 90, r: 7 + SEM() * 14 }));

export function burbuja(g, x, y, r, al = 1) {
  if (al < 0.03 || r < 2) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.arc(x, y, r, 0, 6.28);
  const gr = g.createRadialGradient(x - r * 0.32, y - r * 0.38, r * 0.08, x, y, r);
  gr.addColorStop(0, "rgba(255,255,255,0.95)");
  gr.addColorStop(0.22, "rgba(255, 214, 160, 0.45)");
  gr.addColorStop(0.62, "rgba(90, 190, 230, 0.18)");
  gr.addColorStop(1, "rgba(255,255,255,0.7)");
  g.fillStyle = gr;
  g.fill();
  g.lineWidth = Math.max(3, r * 0.045);
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.stroke();
  g.restore();
}

// Dentro del depósito. y positiva hacia abajo. La costra vive alrededor de y = 180.
export function interior(g, t, o = {}) {
  const calor = o.calor ?? 1;
  const costra = o.costra ?? 1;
  const pop = o.pop ?? 0;
  const corona = o.corona ?? 0;
  const jolt = o.jolt ?? 0;
  g.save();
  g.translate(0, jolt);
  const fondo = g.createRadialGradient(0, -40, 40, 0, 80, 980);
  fondo.addColorStop(0, k.mezColor("#1c7ca0", "#ffb060", calor * 0.35));
  fondo.addColorStop(0.45, "#0c4460");
  fondo.addColorStop(1, "#061018");
  g.fillStyle = fondo;
  g.fillRect(-1600, -1800, 3200, 3600);

  // Pared de acero, a los lados.
  g.fillStyle = "#8ea0ae";
  g.beginPath();
  g.moveTo(-620, -1400);
  g.lineTo(-430, -1400);
  g.quadraticCurveTo(-560, 200, -470, 1200);
  g.lineTo(-700, 1200);
  g.fill();
  g.beginPath();
  g.moveTo(620, -1400);
  g.lineTo(430, -1400);
  g.quadraticCurveTo(560, 200, 470, 1200);
  g.lineTo(700, 1200);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  for (let y = -1100; y < 1000; y += 150) {
    g.fillRect(-560, y, 70, 8);
    g.fillRect(490, y, 70, 8);
  }

  // Agua.
  g.save();
  g.beginPath();
  g.rect(-500, -900, 1000, 1120);
  g.clip();
  const agua = g.createLinearGradient(0, -800, 0, 220);
  agua.addColorStop(0, "rgba(150, 220, 255, 0.2)");
  agua.addColorStop(1, k.mezColor("#0a6aaa", "#e07020", calor * 0.45));
  g.fillStyle = agua;
  g.fillRect(-500, -900, 1000, 1120);
  for (const b of BURBUJAS) {
    const p = (t * b.v + b.f) % 1;
    burbuja(g, b.x, 160 - p * 900, b.r, 0.85);
  }
  g.restore();

  // Calor debajo de la costra.
  if (calor > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const luz = g.createRadialGradient(0, 340, 20, 0, 360, 420);
    luz.addColorStop(0, `rgba(255, 150, 40, ${0.45 * calor})`);
    luz.addColorStop(1, "rgba(255, 80, 20, 0)");
    g.fillStyle = luz;
    g.fillRect(-600, 80, 1200, 520);
    g.restore();
  }

  // Costra de cal.
  const techo = 150 - costra * 40;
  g.beginPath();
  g.moveTo(-520, 640);
  g.lineTo(-520, techo + 30);
  for (let x = -520; x <= 520; x += 36) {
    const y = techo + Math.sin(x * 0.03 + t * 1.4) * 10 + Math.sin(x * 0.08) * 16 * costra;
    g.lineTo(x, y);
  }
  g.lineTo(520, 640);
  g.closePath();
  const cal = g.createLinearGradient(0, techo, 0, 520);
  cal.addColorStop(0, "#fff8ea");
  cal.addColorStop(0.35, "#f0e0c0");
  cal.addColorStop(1, "#c8b48a");
  g.fillStyle = cal;
  g.fill();
  g.save();
  g.clip();
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -500, techo, 1000, 500);
  g.restore();
  for (const n of GRANOS) {
    g.beginPath();
    g.arc(-20 + n.x, techo + 36 + n.y * costra, n.r, 0, 6.28);
    g.fillStyle = n.r > 14 ? "#fffdf8" : "#e7d3ae";
    g.fill();
  }

  // Burbuja atrapada / reventando.
  const r = 36 + pop * 180;
  const by = techo + 50 - pop * 140;
  burbuja(g, 10, by, r, Math.min(1, pop * 1.4 + 0.15));
  if (corona > 0.02) {
    for (const m of MOTAS) {
      const p = corona;
      const px = 10 + Math.cos(m.a) * (80 + 280 * p) * (0.45 + m.v * 0.4);
      const py = by - Math.sin(m.a) * 40 - (220 * p - 140 * p * p) * m.v;
      gota(g, px, py, m.r * (1.2 - p * 0.4), (1 - p) * 0.95 + 0.05);
    }
  }
  g.restore();
}

// Depósito de pie. Centro del cuerpo en (x, y). calor 0-1, oxido 0-1, nivel 0-1, salto en px.
export function tanque(g, x, y, o = {}) {
  const calor = o.calor ?? 0;
  const oxido = o.oxido ?? 0;
  const nivel = o.nivel ?? 1;
  const salto = o.salto ?? 0;
  const esc = o.esc ?? 1;
  g.save();
  g.translate(x, y + salto);
  g.scale(esc, esc);
  // Sombra en el suelo.
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath();
  g.ellipse(0, 470, 230, 36, 0, 0, 6.28);
  g.fill();
  // Patas.
  g.fillStyle = "#2c343c";
  for (const px of [-150, 150]) k.redondo(g, px - 16, 400, 32, 70, 8), g.fill();
  // Cuerpo.
  g.beginPath();
  g.ellipse(0, -360, 210, 48, 0, 0, 6.28);
  let cuerpo = g.createLinearGradient(-210, 0, 210, 0);
  cuerpo.addColorStop(0, k.mezColor("#c5d0da", "#8a5040", oxido));
  cuerpo.addColorStop(0.38, k.mezColor("#f7fbfe", "#e4c8bc", oxido));
  cuerpo.addColorStop(0.78, k.mezColor("#d5dee6", "#a06048", oxido));
  cuerpo.addColorStop(1, k.mezColor("#8ea0ae", "#5a3020", oxido));
  g.fillStyle = cuerpo;
  g.fill();
  g.beginPath();
  g.rect(-210, -360, 420, 760);
  g.fill();
  g.beginPath();
  g.ellipse(0, 400, 210, 52, 0, 0, 6.28);
  g.fillStyle = k.mezColor("#5c6a76", "#3a2418", oxido);
  g.fill();
  // Brillo.
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.fillRect(-150, -340, 36, 700);
  // Óxido.
  if (oxido > 0.02) {
    g.save();
    g.globalAlpha = oxido;
    g.fillStyle = "#8a3c18";
    for (let i = 0; i < 8; i++) {
      g.beginPath();
      g.ellipse(-80 + (i % 4) * 60, 80 + Math.floor(i / 4) * 140, 28, 16, 0.4, 0, 6.28);
      g.fill();
    }
    g.restore();
  }
  // Ventana de nivel.
  g.fillStyle = "#1c242c";
  k.redondo(g, 120, -80, 36, 220, 10);
  g.fill();
  const aguaH = 200 * nivel;
  g.fillStyle = "#3ec0ee";
  k.redondo(g, 124, 130 - aguaH, 28, Math.max(8, aguaH), 8);
  g.fill();
  // Puerta de abajo.
  g.fillStyle = "#243038";
  k.redondo(g, -70, 230, 140, 120, 12);
  g.fill();
  // Calor en la base.
  if (calor > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const luz = g.createRadialGradient(0, 360, 10, 0, 380, 240);
    luz.addColorStop(0, `rgba(255, 150, 40, ${0.9 * calor})`);
    luz.addColorStop(1, "rgba(255, 80, 0, 0)");
    g.fillStyle = luz;
    g.fillRect(-240, 200, 480, 280);
    g.restore();
  }
  // Tubos de arriba.
  g.fillStyle = cromo(g, -80, -520, 40, -360);
  k.redondo(g, -150, -500, 44, 150, 16);
  g.fill();
  g.fillStyle = "#2f8de0";
  g.fillRect(-142, -470, 28, 22);
  g.fillStyle = cromo(g, 40, -520, 160, -360);
  k.redondo(g, 90, -500, 44, 150, 16);
  g.fill();
  g.fillStyle = "#e23b32";
  g.fillRect(98, -470, 28, 22);
  g.restore();
}

export function valvula(g, x, y, u, color = "#1f8cff") {
  // u = 0 cerrada (cruzada), u = 1 abierta (en línea con el tubo).
  g.save();
  g.translate(x, y);
  g.fillStyle = "#b87333";
  k.redondo(g, -280, -36, 560, 72, 28);
  g.fill();
  g.fillStyle = "#e8a060";
  g.fillRect(-280, -36, 560, 16);
  g.fillStyle = "#d0d6dc";
  g.beginPath();
  g.arc(0, 0, 52, 0, 6.28);
  g.fill();
  g.save();
  g.rotate(k.mez(Math.PI / 2, 0, u));
  g.fillStyle = color;
  k.redondo(g, -26, -150, 52, 230, 22);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.fillRect(-8, -80, 8, 90);
  g.restore();
  g.restore();
}

export function desague(g, x, y, abierto) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#c9a227";
  g.beginPath();
  g.arc(0, 0, 34, 0, 6.28);
  g.fill();
  g.fillStyle = "#8a6a10";
  g.fillRect(-8, -34, 16, 28);
  g.save();
  g.rotate(k.mez(-0.8, 0.9, abierto));
  g.fillStyle = "#e10600";
  k.redondo(g, -12, -78, 24, 86, 10);
  g.fill();
  g.restore();
  g.restore();
}

export function mandoGas(g, x, y) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#1a1e24";
  g.beginPath();
  g.arc(0, 0, 120, 0, 6.28);
  g.fill();
  const anillo = g.createRadialGradient(-30, -40, 10, 0, 0, 120);
  anillo.addColorStop(0, "#3a424c");
  anillo.addColorStop(1, "#0e1218");
  g.fillStyle = anillo;
  g.beginPath();
  g.arc(0, 0, 108, 0, 6.28);
  g.fill();
  // Llama.
  g.beginPath();
  g.moveTo(0, 48);
  g.bezierCurveTo(-48, 10, -36, -20, 0, -62);
  g.bezierCurveTo(36, -20, 48, 10, 0, 48);
  const llama = g.createLinearGradient(0, 40, 0, -60);
  llama.addColorStop(0, "#ff9a1f");
  llama.addColorStop(0.6, "#ffe14a");
  llama.addColorStop(1, "#fff6c8");
  g.fillStyle = llama;
  g.fill();
  g.restore();
}

export function cuadro(g, x, y, on) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#d8dde2";
  k.redondo(g, -150, -220, 300, 440, 16);
  g.fill();
  g.fillStyle = "#eef2f6";
  k.redondo(g, -130, -190, 260, 250, 10);
  g.fill();
  // Una palanca grande. on = 1 arriba.
  g.fillStyle = "#2a3138";
  k.redondo(g, -36, -150, 72, 180, 10);
  g.fill();
  g.save();
  g.translate(0, -60);
  g.rotate(k.mez(0.55, -0.55, on));
  g.fillStyle = on > 0.5 ? "#18a34a" : "#d21b1b";
  k.redondo(g, -16, -78, 32, 150, 12);
  g.fill();
  g.restore();
  g.beginPath();
  g.arc(0, 120, 22, 0, 6.28);
  g.fillStyle = on > 0.5 ? "#3dde6a" : "#5c656e";
  g.fill();
  if (on > 0.5) k.brillo(g, 0, 120, 70, "verde", 0.8);
  g.restore();
}

export function grifo(g, x, y, t, o = {}) {
  const abierto = o.abierto ?? 1;
  const calido = o.calido ?? 0;
  const escupe = o.escupe ?? 0;
  g.save();
  g.translate(x, y);
  // Pila.
  g.fillStyle = "#f4f1ea";
  k.redondo(g, -260, 40, 520, 280, 36);
  g.fill();
  g.fillStyle = "#d5d0c6";
  k.redondo(g, -230, 70, 460, 200, 28);
  g.fill();
  // Cuerpo del grifo.
  g.fillStyle = cromo(g, -40, -280, 80, 40);
  k.redondo(g, -34, -40, 68, 120, 20);
  g.fill();
  g.beginPath();
  g.moveTo(0, -20);
  g.quadraticCurveTo(180, -40, 210, 20);
  g.lineWidth = 36;
  g.strokeStyle = cromo(g, 0, -40, 220, 40);
  g.stroke();
  g.beginPath();
  g.arc(210, 24, 16, 0, 6.28);
  g.fillStyle = "#f7fbff";
  g.fill();
  // Maneta.
  g.save();
  g.translate(-80, -10);
  g.rotate(k.mez(0.4, -0.9, abierto));
  g.fillStyle = "#f2f5f8";
  k.redondo(g, -14, -90, 28, 110, 12);
  g.fill();
  g.beginPath();
  g.arc(0, -90, 16, 0, 6.28);
  g.fillStyle = calido > 0.5 ? "#e23b32" : "#f2f5f8";
  g.fill();
  g.restore();
  const largo = 70 + abierto * 150;
  const trozos = escupe > 0.2 ? 4 : 1;
  for (let i = 0; i < trozos; i++) {
    const hueco = escupe * (0.5 + 0.5 * Math.sin(t * 18 + i));
    const y0 = 40 + i * (largo / trozos);
    const y1 = y0 + largo / trozos * (1 - hueco * 0.65);
    chorro(g, 210, y0, y1, 16 + abierto * 8, t, abierto, calido);
  }
  if (calido > 0.2 && abierto > 0.4) {
    g.save();
    g.globalAlpha = 0.35 * calido;
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.4 + i / 3) % 1;
      g.fillStyle = `rgba(255,255,255,${0.4 * (1 - p)})`;
      g.beginPath();
      g.ellipse(210, 20 - p * 180, 18 + p * 20, 28 + p * 30, 0, 0, 6.28);
      g.fill();
    }
    g.restore();
  }
  g.restore();
}

export function pila(g, x, y, t, sucia, nivel) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#f7f4ee";
  k.redondo(g, -280, -40, 560, 420, 30);
  g.fill();
  g.fillStyle = "#c9c2b6";
  k.redondo(g, -250, 10, 500, 330, 24);
  g.fill();
  const h = 40 + nivel * 230;
  g.save();
  k.redondo(g, -240, 300 - h, 480, h, 16);
  g.clip();
  g.fillStyle = k.mezColor("#9ad4f2", "#c4a06a", sucia);
  g.fillRect(-240, 300 - h, 480, h + 20);
  if (sucia > 0.2) {
    g.globalAlpha = sucia;
    for (const n of GRANOS) {
      const yy = 300 - ((t * 40 + n.y * 8) % Math.max(20, h));
      g.beginPath();
      g.arc(-180 + (n.x + 400) % 400, yy, n.r * 0.6, 0, 6.28);
      g.fillStyle = "#fff8ea";
      g.fill();
    }
  }
  g.restore();
  g.restore();
}

export function manguera(g, x0, y0, x1, y1, t, caudal, sucia) {
  g.save();
  g.strokeStyle = "#1f8a32";
  g.lineWidth = 28;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x0, y0);
  g.bezierCurveTo(x0 + 80, y0 + 160, x1 - 120, y1 - 80, x1, y1);
  g.stroke();
  g.strokeStyle = "#46c85a";
  g.lineWidth = 8;
  g.stroke();
  if (caudal > 0.05) {
    const pasos = 8;
    for (let i = 0; i < pasos; i++) {
      const p = (t * 1.4 * caudal + i / pasos) % 1;
      const u = p;
      const cx = k.mez(k.mez(x0, x0 + 80, u), k.mez(x1 - 120, x1, u), u);
      const cy = k.mez(k.mez(y0, y0 + 160, u), k.mez(y1 - 80, y1, u), u);
      // Aproximación basta del bezier: dos lerps no son el bezier, pero se ven cerca.
      g.fillStyle = k.mezColor("#d8f4ff", "#e6d2a4", sucia);
      g.globalAlpha = 0.9;
      g.beginPath();
      g.arc(cx, cy, 8, 0, 6.28);
      g.fill();
    }
    g.globalAlpha = 1;
  }
  g.restore();
}

export function hoja(g, x, y, cae) {
  g.save();
  g.translate(x, y + cae);
  g.rotate(cae * 0.001);
  g.fillStyle = "#f4efe4";
  k.redondo(g, -220, -300, 440, 560, 12);
  g.fill();
  g.fillStyle = "#e23b32";
  g.fillRect(-220, -300, 440, 70);
  g.strokeStyle = "rgba(40,40,40,0.18)";
  g.lineWidth = 3;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) {
      g.strokeRect(-180 + col * 96, -190 + row * 86, 80, 64);
    }
  }
  g.restore();
}

export function cuartoSuelo(g, y) {
  suelo(g, y, "#1a120c");
}
