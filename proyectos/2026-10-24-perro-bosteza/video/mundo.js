// El salón donde el bostezo salta de una boca a la otra. El perro y la persona son los de perros/mundo.js.
import * as k from "#kit";
import { perro, persona, ponVista, sinVista, velo, vineta } from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
export { perro, persona, ponVista, sinVista, velo, vineta };

export const OX = -8;
export const DX = 78;

const madera = (() => {
  const w = 520, h = 280, l = k.lienzo(w, h), g = l.getContext("2d");
  const az = k.azar(12);
  for (let y = 0; y < h; y += 28) {
    const tono = 0.35 + (y / h) * 0.4;
    g.fillStyle = k.mezColor("#e0a15c", "#7a4424", tono);
    g.fillRect(0, y, w, 26);
    g.fillStyle = "rgba(255,220,170,0.18)";
    g.fillRect(0, y, w, 4);
    let x = (y * 3) % 40;
    g.strokeStyle = "rgba(70,32,12,0.28)";
    g.lineWidth = 2;
    while (x < w) {
      g.beginPath(); g.moveTo(x, y + 2); g.lineTo(x + (az() - 0.5) * 6, y + 24); g.stroke();
      x += 54 + az() * 40;
    }
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28;
  g.drawImage(k.red, 0, 0, w, h);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  return l;
})();

const pared = (() => {
  const w = 640, h = 480, l = k.lienzo(w, h), g = l.getContext("2d");
  const pg = g.createLinearGradient(0, 0, 0, h);
  pg.addColorStop(0, "#ffe3c4"); pg.addColorStop(0.55, "#f7c49a"); pg.addColorStop(1, "#e59a72");
  g.fillStyle = pg; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.16;
  g.drawImage(k.manchas, 0, 0, w, h);
  g.globalAlpha = 0.1; g.drawImage(k.red, 0, 0, w, h);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  return l;
})();

function ventana(g) {
  g.save();
  g.translate(-20, -250);
  g.fillStyle = "#fff6ea"; g.fillRect(-78, -8, 156, 128);
  const cielo = g.createLinearGradient(0, 0, 0, 112);
  cielo.addColorStop(0, "#7ec8ff"); cielo.addColorStop(1, "#dff4ff");
  g.fillStyle = cielo; g.fillRect(-70, 0, 140, 112);
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath(); g.ellipse(-20, 28, 26, 14, 0, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(18, 40, 20, 11, 0, 0, TAU); g.fill();
  g.fillStyle = "#6fbf45"; g.beginPath(); g.ellipse(0, 112, 70, 16, 0, 0, TAU); g.fill();
  g.strokeStyle = "#f4efe6"; g.lineWidth = 6;
  g.strokeRect(-70, 0, 140, 112);
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 112); g.moveTo(-70, 56); g.lineTo(70, 56); g.stroke();
  g.restore();
}

function sofa(g) {
  g.save();
  g.translate(-10, -8);
  g.fillStyle = "rgba(90,30,20,0.2)"; g.beginPath(); g.ellipse(10, 6, 150, 10, 0, 0, TAU); g.fill();
  const respaldo = g.createLinearGradient(0, -118, 0, -20);
  respaldo.addColorStop(0, "#ff8d78"); respaldo.addColorStop(0.5, "#e45448"); respaldo.addColorStop(1, "#a83232");
  g.fillStyle = respaldo;
  k.redondo(g, -150, -112, 300, 78, 22); g.fill();
  const asiento = g.createLinearGradient(0, -48, 0, 0);
  asiento.addColorStop(0, "#ffb0a0"); asiento.addColorStop(1, "#d24a40");
  g.fillStyle = asiento;
  k.redondo(g, -158, -52, 316, 48, 16); g.fill();
  g.fillStyle = "#ffd0c4";
  k.redondo(g, -146, -96, 70, 46, 16); g.fill();
  k.redondo(g, 70, -92, 64, 42, 16); g.fill();
  g.restore();
}

function lampara(g, t) {
  g.save();
  g.translate(-230, 0);
  const mg = g.createLinearGradient(-4, 0, 4, 0);
  mg.addColorStop(0, "#6a5538"); mg.addColorStop(0.5, "#f0e2c0"); mg.addColorStop(1, "#5a4630");
  g.fillStyle = mg; g.fillRect(-4, -168, 8, 168);
  g.fillStyle = "#3a2a18"; g.beginPath(); g.ellipse(0, -2, 16, 5, 0, 0, TAU); g.fill();
  g.fillStyle = "#ffe7a8"; k.redondo(g, -22, -214, 44, 36, 12); g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(-6, -202, 8, 5, -0.4, 0, TAU); g.fill();
  g.restore();
  k.brillo(g, -230, -196, 90, "255,210,120", 0.55 + 0.05 * Math.sin(t * 1.4));
}

function puerta(g, abierta) {
  const x = 300;
  g.save();
  g.translate(x, 0);
  g.fillStyle = "#6a3a22"; g.fillRect(-8, -210, 16, 210);
  g.fillStyle = "#8a4e2c"; g.fillRect(8, -210, 16, 210);
  g.save();
  g.translate(8, -105);
  g.rotate(-0.5 * abierta);
  const pg = g.createLinearGradient(0, -100, 70, 100);
  pg.addColorStop(0, "#e8b07a"); pg.addColorStop(0.5, "#c48448"); pg.addColorStop(1, "#8a5428");
  g.fillStyle = pg; k.redondo(g, 0, -100, 78, 200, 6); g.fill();
  g.fillStyle = "#f2d7a8"; g.beginPath(); g.arc(62, 8, 4, 0, TAU); g.fill();
  g.restore();
  if (abierta > 0.2) {
    g.fillStyle = `rgba(255,214,150,${0.35 * abierta})`;
    g.beginPath(); g.moveTo(20, -180); g.lineTo(20 + 70 * abierta, -40); g.lineTo(20 + 40 * abierta, 0); g.lineTo(16, 0); g.closePath(); g.fill();
  }
  g.restore();
}

function planta(g) {
  g.save();
  g.translate(175, 0);
  g.fillStyle = "#c4553a"; k.redondo(g, -16, -28, 32, 26, 6); g.fill();
  g.fillStyle = "#e07048"; g.fillRect(-14, -30, 28, 8);
  const hojas = [[0, -70, 16], [-14, -52, 13], [16, -58, 14], [4, -96, 12], [-8, -84, 11]];
  for (const [x, y, r] of hojas) {
    const hg = g.createRadialGradient(x - 3, y - 4, 1, x, y, r);
    hg.addColorStop(0, "#d6f07a"); hg.addColorStop(1, "#2f8a32");
    g.fillStyle = hg; g.beginPath(); g.ellipse(x, y, r, r * 0.62, x * 0.04, 0, TAU); g.fill();
  }
  g.restore();
}

export function salon(g, t, puertaAbierta) {
  g.drawImage(pared, -420, -520, 980, 540);
  ventana(g);
  // el haz de la ventana, quieto en el suelo
  g.save();
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.28;
  g.fillStyle = "#fff1c4";
  g.beginPath(); g.moveTo(-70, -140); g.lineTo(50, -140); g.lineTo(120, 0); g.lineTo(-20, 0); g.closePath(); g.fill();
  g.restore();
  puerta(g, puertaAbierta);
  planta(g);
  sofa(g);
  g.drawImage(madera, -520, -8, 1040, 220);
  // la alfombra
  g.fillStyle = "#f0c24e"; k.redondo(g, -70, -4, 230, 18, 8); g.fill();
  g.fillStyle = "#e07a3a"; k.redondo(g, -58, -2, 206, 12, 6); g.fill();
  lampara(g, t);
  const az = k.azar(4);
  g.fillStyle = "rgba(255,236,190,0.85)";
  for (let i = 0; i < 14; i++) {
    const x = -90 + az() * 180, y = -250 + ((az() * 200 + t * (10 + az() * 16)) % 230);
    g.globalAlpha = 0.35 + 0.4 * az();
    g.fillRect(x, y, 2.2, 2.2);
  }
  g.globalAlpha = 1;
}

// Dónde cae el hocico, para la cámara, sin dibujar.
export function hocico(bostezo, ang) {
  const a = (ang || 0) - 0.32 * (bostezo || 0);
  const hp = [38, -70], ca = Math.cos(a), sa = Math.sin(a), nl = [37, -1.2];
  const lx = hp[0] + nl[0] * ca - nl[1] * sa;
  const ly = hp[1] + nl[0] * sa + nl[1] * ca;
  return [DX + lx * -1, ly + 8 * (bostezo || 0)];
}
