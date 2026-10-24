// El lavabo, el calentador, el bol de vinagre y la llave general.
import * as k from "#kit";
import { lado } from "./ducha.js";
import { chorro, cromo, gota, guante, pared, salpicar, suelo, telefono } from "./mundo.js";

function porcelana(g, x, y, rx, ry) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, 6.28);
  const gr = g.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 10, x, y, rx);
  gr.addColorStop(0, "#ffffff");
  gr.addColorStop(0.55, "#e7eef3");
  gr.addColorStop(1, "#9eb0be");
  g.fillStyle = gr;
  g.fill();
}

export function pila(g, t, corona = 1) {
  pared(g, "bano");
  suelo(g, 620, "#0c5e66");
  porcelana(g, 0, 280, 420, 250);
  g.save();
  g.beginPath();
  g.ellipse(0, 250, 300, 150, 0, 0, 6.28);
  g.clip();
  g.fillStyle = "rgba(40, 140, 230, 0.9)";
  g.fillRect(-320, 180, 640, 220);
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(-180, 200, 140, 8);
  g.restore();
  g.beginPath();
  g.ellipse(0, 250, 300, 150, 0, 0, 6.28);
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 8;
  g.stroke();

  g.save();
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = 52;
  g.strokeStyle = "#c5d0da";
  g.beginPath();
  g.moveTo(0, 20);
  g.quadraticCurveTo(-30, -300, 200, -150);
  g.stroke();
  g.lineWidth = 16;
  g.strokeStyle = "rgba(255,255,255,0.75)";
  g.stroke();
  g.beginPath();
  g.arc(0, 30, 34, 0, 6.28);
  g.fillStyle = cromo(g, -34, 0, 34, 70, 0);
  g.fill();
  g.beginPath();
  g.arc(200, -150, 26, 0, 6.28);
  g.fillStyle = "#eef3f7";
  g.fill();
  g.restore();

  chorro(g, 200, -124, 200, 62, t, 1, 0);
  salpicar(g, 200, 190, t, 0.7 + 0.3 * corona, 1.2 + corona * 0.4);
  gota(g, 40, 120, 16, 0.8);
  gota(g, 230, 90, 12, 0.7);
}

// Mundo ancho: la maneta al rojo, y a la derecha el calentador cerrado.
export function caliente(g, t, retro = 0) {
  const gr = g.createLinearGradient(-600, 0, 2200, 0);
  gr.addColorStop(0, "#12a8b8");
  gr.addColorStop(0.35, "#0c6074");
  gr.addColorStop(0.55, "#1c140f");
  gr.addColorStop(1, "#2a1a12");
  g.fillStyle = gr;
  g.fillRect(-1600, -1600, 4200, 3400);
  g.strokeStyle = "rgba(220,255,250,0.16)";
  g.lineWidth = 5;
  for (let x = -800; x <= 700; x += 150) { g.beginPath(); g.moveTo(x, -1400); g.lineTo(x, 400); g.stroke(); }
  for (let y = -1400; y <= 500; y += 112) { g.beginPath(); g.moveTo(-800, y); g.lineTo(700, y); g.stroke(); }
  const luz = g.createRadialGradient(1500, -520, 20, 1400, -200, 700);
  luz.addColorStop(0, "rgba(255,190,110,0.4)");
  luz.addColorStop(1, "rgba(255,190,110,0)");
  g.fillStyle = luz;
  g.fillRect(800, -1400, 1600, 2200);

  // Maneta al rojo y un hilo tibio, a la izquierda.
  g.save();
  g.translate(0, 40);
  g.beginPath();
  g.arc(0, -250, 70, 0, 6.28);
  g.fillStyle = cromo(g, -70, -320, 70, -180, 0);
  g.fill();
  chorro(g, 0, -180, 80, 8, t, 1, 0.85);
  gota(g, 0, 100, 14, 0.9);
  g.restore();
  // palanca grande, ya en rojo (u = 1)
  g.save();
  g.translate(0, 180);
  g.beginPath();
  g.arc(0, 0, 78, 0, 6.28);
  g.fillStyle = cromo(g, -78, -78, 78, 78, 0);
  g.fill();
  g.strokeStyle = "#e23b32";
  g.lineWidth = 16;
  g.beginPath();
  g.arc(0, 0, 58, -1.3, -0.1);
  g.stroke();
  g.rotate(-0.9);
  k.redondo(g, -16, -120, 32, 140, 14);
  g.fillStyle = "#f2f6f8";
  g.fill();
  g.beginPath();
  g.arc(0, -120, 22, 0, 6.28);
  g.fillStyle = "#e23b32";
  g.fill();
  g.restore();

  // Depósito. No se abre.
  const cx = 1360, cy = 80;
  g.fillStyle = "#5c6a76";
  k.redondo(g, cx - 40, cy - 520, 36, 80, 10);
  g.fill();
  k.redondo(g, cx + 30, cy - 520, 36, 80, 10);
  g.fill();
  g.fillStyle = "#e07a3a";
  g.fillRect(cx + 38, cy - 500, 18, 50);
  g.beginPath();
  g.ellipse(cx, cy - 390, 230, 46, 0, 0, 6.28);
  const tapa = g.createLinearGradient(cx - 230, 0, cx + 230, 0);
  tapa.addColorStop(0, "#8ea0ae");
  tapa.addColorStop(0.45, "#f7fbfe");
  tapa.addColorStop(1, "#60707c");
  g.fillStyle = tapa;
  g.fill();
  g.beginPath();
  g.rect(cx - 230, cy - 390, 460, 640);
  g.fillStyle = cromo(g, cx - 230, 0, cx + 230, 0, 0);
  g.fill();
  g.beginPath();
  g.ellipse(cx, cy + 250, 230, 48, 0, 0, 6.28);
  g.fillStyle = "#60707c";
  g.fill();
  g.fillStyle = "#243038";
  k.redondo(g, cx - 70, cy + 40, 140, 150, 12);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.25)";
  g.lineWidth = 4;
  g.stroke();
  const mano = k.mez(0, 240, retro);
  guante(g, cx + 70 + mano, cy + 160, -0.15 + retro * 0.35, 1.3, 1);
}

export function vinagre(g, t, o) {
  pared(g, "madera");
  const noche = o.noche || 0;
  // Ventana y luna.
  g.fillStyle = k.mezColor("#9fd8ff", "#0c1430", noche);
  k.redondo(g, -220, -760, 440, 300, 16);
  g.fill();
  g.strokeStyle = "#f4fbff";
  g.lineWidth = 12;
  g.stroke();
  if (noche > 0.05) {
    g.save();
    g.globalAlpha *= noche;
    g.fillStyle = "#fff6d2";
    g.beginPath();
    g.arc(40, -640, 36, 0, 6.28);
    g.fill();
    g.restore();
  }
  // Banco de madera.
  g.fillStyle = "#c47a3a";
  g.fillRect(-900, 200, 1800, 900);
  const veta = g.createLinearGradient(0, 200, 0, 280);
  veta.addColorStop(0, "rgba(255,220,170,0.45)");
  veta.addColorStop(1, "rgba(90,40,10,0.25)");
  g.fillStyle = veta;
  g.fillRect(-900, 200, 1800, 28);
  for (let i = 0; i < 6; i++) {
    g.strokeStyle = "rgba(90,40,12,0.25)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-800, 260 + i * 70);
    g.quadraticCurveTo(0, 240 + i * 70, 800, 270 + i * 70);
    g.stroke();
  }
  // Paño donde se cepilla.
  g.fillStyle = "#157e86";
  g.beginPath();
  g.ellipse(230, 150, 200, 46, -0.1, 0, 6.28);
  g.fill();

  // Botella de vinagre.
  g.save();
  g.translate(-360, 40);
  g.fillStyle = "#e7eef2";
  k.redondo(g, -28, -150, 56, 40, 8);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  k.redondo(g, -46, -110, 92, 200, 20);
  g.fill();
  g.fillStyle = "rgba(232, 176, 40, 0.88)";
  k.redondo(g, -40, -40, 80, 120, 16);
  g.fill();
  g.restore();

  // Bol, parte de atrás.
  g.beginPath();
  g.ellipse(0, 70, 250, 130, 0, 0, 6.28);
  g.fillStyle = "rgba(255,255,255,0.12)";
  g.fill();

  lado(g, t, {
    x: o.x, y: o.y, esc: o.esc || 1.25,
    costra: o.costra ?? 1, oro: o.oro || 0,
    burbujas: o.burbujas || 0,
  });

  // Vinagre del bol, por encima de lo que está sumergido.
  g.save();
  g.beginPath();
  g.ellipse(0, 90, 230, 100, 0, 0, Math.PI);
  g.lineTo(-230, 200);
  g.lineTo(230, 200);
  g.clip();
  g.globalAlpha *= 0.38;
  const liq = g.createLinearGradient(0, 40, 0, 200);
  liq.addColorStop(0, "rgba(255, 214, 90, 0.2)");
  liq.addColorStop(0.4, "rgba(226, 164, 30, 0.85)");
  liq.addColorStop(1, "rgba(150, 80, 10, 0.95)");
  g.fillStyle = liq;
  g.fillRect(-260, 40, 520, 200);
  g.restore();
  g.beginPath();
  g.ellipse(0, 78, 228, 36, 0, 0, 6.28);
  g.fillStyle = "rgba(255, 220, 120, 0.55)";
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.75)";
  g.lineWidth = 8;
  g.beginPath();
  g.ellipse(0, 78, 248, 52, 0, Math.PI * 1.05, Math.PI * 1.95);
  g.stroke();

  if ((o.cepillo || 0) > 0.04) cepillo(g, (o.cx ?? 230) + Math.sin(t * 10) * 64 * o.cepillo, (o.cy ?? 150) + 70, o.cepillo);
  if ((o.enjuague || 0) > 0.04) {
    chorro(g, o.x, o.y - 180, o.y - 20, 28, t, o.enjuague, 0);
    salpicar(g, o.x, o.y, t, o.enjuague * 0.7, 0.6);
  }
  if ((o.guante || 0) > 0.04) guante(g, o.x + 150, o.y - 20, 0.4, 1.1, o.guante);

  if (noche > 0.02) {
    g.save();
    g.globalAlpha *= noche * 0.2;
    g.fillStyle = "#06101e";
    g.fillRect(-2000, -2000, 4000, 4000);
    g.restore();
  }
}

function cepillo(g, x, y, al) {
  g.save();
  g.translate(x, y);
  g.rotate(-0.4);
  g.globalAlpha *= al;
  g.fillStyle = "#ff4f8b";
  k.redondo(g, -18, -20, 36, 170, 16);
  g.fill();
  g.fillStyle = "#ffe08a";
  k.redondo(g, -16, 130, 32, 28, 8);
  g.fill();
  g.fillStyle = "#f4fbff";
  for (let i = 0; i < 5; i++) g.fillRect(-14 + i * 6, 154, 3, 22);
  g.restore();
}

function grifoChico(g, x, y, t, fuerza) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.moveTo(-16, 20);
  g.quadraticCurveTo(-10, -70, 36, -80);
  g.lineTo(36, -64);
  g.quadraticCurveTo(4, -56, 8, 20);
  g.closePath();
  g.fillStyle = cromo(g, -20, -80, 40, 20, 0);
  g.fill();
  const w = k.mez(6, 46, fuerza);
  const largo = k.mez(110, 320, fuerza);
  chorro(g, 36, -60, -60 + largo, w, t + x * 0.01, 1, 0);
  if (fuerza < 0.4) gota(g, 36, 40 + ((t * 40 + x) % 70), 8, 0.85);
  g.restore();
}

export function llaves(g, t, o) {
  pared(g, "sotano");
  suelo(g, 760, "#2a1c14");
  const fuerza = o.fuerza || 0;
  grifoChico(g, -340, -40, t, fuerza);
  grifoChico(g, 0, -70, t, fuerza);
  grifoChico(g, 340, -40, t, fuerza);

  // Tubo de cobre y válvula de bola. ang 0 = palanca en línea (abierta).
  const ang = o.ang || 0;
  g.fillStyle = "#8a3e22";
  k.redondo(g, -620, 300, 1240, 70, 30);
  g.fill();
  const brillo = g.createLinearGradient(0, 300, 0, 370);
  brillo.addColorStop(0, "rgba(255,210,170,0.55)");
  brillo.addColorStop(1, "rgba(120,40,16,0.2)");
  g.fillStyle = brillo;
  g.fillRect(-620, 312, 1240, 16);
  if (fuerza > 0.2) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const p = (t * 1.2) % 1;
    g.fillStyle = `rgba(180, 230, 255, ${0.35 * fuerza})`;
    g.fillRect(-620 + p * 900, 322, 180, 22);
    g.restore();
  }
  g.beginPath();
  g.arc(0, 334, 54, 0, 6.28);
  g.fillStyle = "#c9842e";
  g.fill();
  g.strokeStyle = "#f0c48a";
  g.lineWidth = 6;
  g.stroke();
  g.save();
  g.translate(0, 334);
  g.rotate(ang);
  k.redondo(g, -16, -18, 210, 36, 14);
  g.fillStyle = "#e10600";
  g.fill();
  g.fillStyle = "#ffb0a8";
  g.fillRect(20, -8, 150, 8);
  g.restore();
  if ((o.guante || 0) > 0.04) guante(g, 150, 250, 0.8, 1.2, o.guante);
  if ((o.telefono || 0) > 0.04) telefono(g, 340, 560, o.telefono, 1.25);
}
