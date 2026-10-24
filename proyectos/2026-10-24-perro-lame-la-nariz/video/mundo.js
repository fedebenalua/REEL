// El salón de la nariz mojada: cristal, suelo y luz. El perro es el de la casa.
import * as k from "#kit";
import { perro, persona, ponVista, sinVista, velo, vineta, aPantalla, pastillaPop } from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
export { perro, persona, ponVista, sinVista, velo, vineta, aPantalla, pastillaPop };

export const DOG = -75;
export const VIDRIO = -175;
export const PLACA = 102;

const pared = (() => {
  const w = 700, h = 520, l = k.lienzo(w, h), g = l.getContext("2d");
  const pg = g.createLinearGradient(0, 0, 0, h);
  pg.addColorStop(0, "#fff1e2"); pg.addColorStop(0.55, "#f7c9a4"); pg.addColorStop(1, "#e7a47c");
  g.fillStyle = pg; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.14;
  g.drawImage(k.manchas, 0, 0, w, h);
  g.globalAlpha = 0.08; g.drawImage(k.red, 0, 0, w, h);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  return l;
})();

const suelo = (() => {
  const w = 800, h = 280, l = k.lienzo(w, h), g = l.getContext("2d");
  const az = k.azar(21);
  for (let y = 0; y < h; y += 26) {
    g.fillStyle = k.mezColor("#f0cb8c", "#c48448", 0.25 + (y / h) * 0.45);
    g.fillRect(0, y, w, 24);
    g.fillStyle = "rgba(255,236,200,0.28)"; g.fillRect(0, y, w, 3);
    let x = (y * 5) % 36;
    g.strokeStyle = "rgba(90,48,18,0.28)"; g.lineWidth = 2;
    while (x < w) { g.beginPath(); g.moveTo(x, y + 2); g.lineTo(x + (az() - 0.5) * 8, y + 22); g.stroke(); x += 48 + az() * 36; }
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22; g.drawImage(k.red, 0, 0, w, h);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  return l;
})();

function ventana(g, vaho, t) {
  g.save();
  g.translate(VIDRIO, -40);
  g.fillStyle = "#fff8f0"; k.redondo(g, -78, -250, 156, 200, 8); g.fill();
  const cielo = g.createLinearGradient(0, -242, 0, -58);
  cielo.addColorStop(0, "#3eb6ff"); cielo.addColorStop(1, "#d9f4ff");
  g.fillStyle = cielo; g.fillRect(-70, -242, 140, 184);
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.beginPath(); g.ellipse(-24, -190, 28, 14, 0, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(22, -168, 22, 12, 0, 0, TAU); g.fill();
  g.fillStyle = "#67c84a"; g.beginPath(); g.ellipse(0, -64, 74, 16, 0, 0, TAU); g.fill();
  g.strokeStyle = "#f4efe8"; g.lineWidth = 7; g.strokeRect(-70, -242, 140, 184);
  g.beginPath(); g.moveTo(0, -242); g.lineTo(0, -58); g.moveTo(-70, -150); g.lineTo(70, -150); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-58, -230); g.lineTo(-20, -190); g.stroke();
  if (vaho > 0.02) {
    const az = k.azar(44);
    for (let i = 0; i < 18; i++) {
      const x = -60 + az() * 120, y = -230 + az() * 150, r = (10 + az() * 22) * (0.3 + 0.7 * vaho);
      g.fillStyle = `rgba(236,248,255,${0.18 + 0.45 * vaho})`;
      g.beginPath(); g.ellipse(x, y, r, r * 0.72, 0, 0, TAU); g.fill();
    }
    const cols = ["64,214,168", "255,198,90", "110,196,255"];
    for (let i = 0; i < 12; i++) {
      const x = -58 + (i % 4) * 32 + Math.sin(t * 2 + i) * 2, y = -220 + Math.floor(i / 4) * 42;
      g.fillStyle = `rgba(${cols[i % 3]},${0.85 * vaho})`;
      g.beginPath(); g.arc(x, y, 3.2, 0, TAU); g.fill();
    }
  }
  g.restore();
}

function sillon(g) {
  g.save();
  g.translate(-40, 0);
  g.fillStyle = "rgba(20,60,70,0.22)"; g.beginPath(); g.ellipse(8, 4, 70, 10, 0, 0, TAU); g.fill();
  const respaldo = g.createLinearGradient(0, -120, 0, -20);
  respaldo.addColorStop(0, "#7ef0e4"); respaldo.addColorStop(0.5, "#14b8a8"); respaldo.addColorStop(1, "#0c6e6a");
  g.fillStyle = respaldo; k.redondo(g, -62, -108, 124, 70, 18); g.fill();
  const asiento = g.createLinearGradient(0, -48, 0, 0);
  asiento.addColorStop(0, "#bffff4"); asiento.addColorStop(1, "#1a9e96");
  g.fillStyle = asiento; k.redondo(g, -70, -48, 140, 42, 14); g.fill();
  g.fillStyle = "#e8fffb"; k.redondo(g, -54, -92, 36, 28, 10); g.fill();
  g.restore();
}

function lampara(g, t) {
  g.save();
  g.translate(250, 0);
  const mg = g.createLinearGradient(-4, 0, 4, 0);
  mg.addColorStop(0, "#6e5840"); mg.addColorStop(0.5, "#f3e6cc"); mg.addColorStop(1, "#5c4834");
  g.fillStyle = mg; g.fillRect(-4, -168, 8, 168);
  g.fillStyle = "#3a2c1c"; g.beginPath(); g.ellipse(0, -2, 16, 5, 0, 0, TAU); g.fill();
  g.fillStyle = "#ffe7a4"; k.redondo(g, -20, -206, 40, 34, 12); g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(-6, -196, 7, 4, -0.4, 0, TAU); g.fill();
  g.restore();
  k.brillo(g, 250, -190, 80, "255,214,130", 0.45 + 0.06 * Math.sin(t * 1.6));
}

function planta(g) {
  g.save();
  g.translate(96, 0);
  g.fillStyle = "#d85a3e"; k.redondo(g, -16, -30, 32, 28, 6); g.fill();
  g.fillStyle = "#f08a62"; g.fillRect(-14, -32, 28, 8);
  for (const [x, y, r] of [[0, -78, 16], [-16, -56, 13], [16, -60, 14], [2, -100, 11]]) {
    const hg = g.createRadialGradient(x - 3, y - 4, 1, x, y, r);
    hg.addColorStop(0, "#d8f48a"); hg.addColorStop(1, "#2f8a34");
    g.fillStyle = hg; g.beginPath(); g.ellipse(x, y, r, r * 0.62, 0.2, 0, TAU); g.fill();
  }
  g.restore();
}

// calor 0..1: la habitación se pone a treinta grados. vaho 0..1: el cristal se empaña.
export function salon(g, c, t, calor, vaho) {
  sinVista(g);
  const yS = 960 - c.cy * c.Z;
  const arriba = k.mezColor("#fff3e6", "#ffb088", calor);
  const medio = k.mezColor("#f6c49a", "#ff7d55", calor);
  const sg = g.createLinearGradient(0, 0, 0, 1920);
  sg.addColorStop(0, arriba); sg.addColorStop(0.55, medio); sg.addColorStop(1, k.mezColor("#e8b56a", "#d48448", calor * 0.4));
  g.fillStyle = sg; g.fillRect(0, 0, 1080, 1920);
  ponVista(g, c);
  g.drawImage(pared, -480, -520, 980, 500);
  ventana(g, vaho, t);
  g.save();
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.22 + 0.2 * calor;
  g.fillStyle = calor > 0.4 ? "#ffd0a8" : "#fff3c8";
  g.beginPath(); g.moveTo(VIDRIO - 50, -200); g.lineTo(VIDRIO + 60, -200); g.lineTo(VIDRIO + 120, 0); g.lineTo(VIDRIO - 10, 0); g.closePath(); g.fill();
  g.restore();
  sillon(g);
  planta(g);
  g.drawImage(suelo, -560, -6, 1100, 260);
  g.fillStyle = "#ff8d6a"; k.redondo(g, -20, -6, 150, 16, 8); g.fill();
  g.fillStyle = "#ffd36a"; k.redondo(g, -8, -3, 126, 10, 5); g.fill();
  lampara(g, t);
  const az = k.azar(8);
  g.fillStyle = "rgba(255,236,200,0.9)";
  for (let i = 0; i < 16; i++) {
    const x = -80 + az() * 220, y = -280 + ((az() * 240 + t * (12 + az() * 18)) % 270);
    g.globalAlpha = 0.25 + 0.45 * az();
    g.fillRect(x, y, 2.4, 2.4);
  }
  g.globalAlpha = 1;
  if (yS > 1900) { /* el suelo de pantalla ya cubre */ }
}

export function hocico(x, nb = 0, ang = 0) {
  const hp = [38 + 16 * nb, -70 + 30 * nb];
  const ca = Math.cos(ang), sa = Math.sin(ang), nl = [36.96, -1.2];
  return [x + hp[0] + nl[0] * ca - nl[1] * sa, hp[1] + nl[0] * sa + nl[1] * ca];
}
