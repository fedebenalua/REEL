// El perro de miel (el que se sabe el nombre), el salón, los juguetes y la gente.
import * as k from "#kit";

const { azar, suave, tramo, mez, entra, lienzo, brillo, manchas } = k;

export const MIEL = {
  luz: "#ffe3b6", medio: "#f09a3a", sombra: "#c46418",
  oreja: "#e08830", dentro: "#f3b2a4",
  hocico: "#fff3e2", pecho: "#fff8ef", nariz: "#1a110e",
  collar: "#128a7c", chapa: "#ffd25a",
};
export const GRIS = {
  luz: "#e6eaf2", medio: "#8e97a8", sombra: "#525a6b",
  oreja: "#6e7688", dentro: "#f0b8b4",
  hocico: "#f7f8fb", pecho: "#f4f6fa", nariz: "#1a110e",
  collar: "#e25b4a", chapa: "#ffe08a",
};

const OTROS = [
  ["#ffd0a0", "#e8883a", "#b85e16", "#d87828"],
  ["#f4e2c4", "#c9a06a", "#8e6840", "#b89060"],
  ["#d8d2cc", "#9a9088", "#5e564e", "#7a7268"],
  ["#f0c8a8", "#d08050", "#a05830", "#c07040"],
  ["#e8d8c0", "#b89870", "#806848", "#a88860"],
  ["#f8e6c8", "#e0a060", "#b07030", "#d09050"],
].map(([luz, medio, sombra, oreja]) => ({
  luz, medio, sombra, oreja, dentro: "#f3b2a4",
  hocico: "#fff6ea", pecho: "#fff8ef", nariz: "#1a110e",
  collar: "#3a6ea8", chapa: "#ffe08a",
}));
export function pielDe(i) { return OTROS[i % OTROS.length]; }

const bufs = [];
export function conAlfa(g, al, fn) {
  if (al <= 0.015) return;
  if (al >= 0.985) { fn(g); return; }
  const b = bufs.pop() || lienzo(1080, 1920);
  const c = b.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  c.clearRect(0, 0, 1080, 1920);
  fn(c);
  g.save();
  g.globalAlpha *= al;
  g.drawImage(b, 0, 0);
  g.restore();
  bufs.push(b);
}

export function velo(g, al = 0.58) {
  if (al <= 0.02) return;
  const vg = g.createLinearGradient(0, 20, 0, 640);
  vg.addColorStop(0, `rgba(18,8,4,${al})`);
  vg.addColorStop(0.55, `rgba(18,8,4,${al * 0.45})`);
  vg.addColorStop(1, "rgba(18,8,4,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 680);
}

export function conCam(g, cam, fn) {
  g.save();
  g.translate(540, 960);
  g.scale(cam.z, cam.z);
  g.translate(-cam.fx, -cam.fy);
  fn();
  g.restore();
}

function bulto(g, x, y, rx, ry, luz, medio, sombra, rot = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.beginPath();
  g.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
  const R = Math.max(rx, ry);
  const gr = g.createRadialGradient(-rx * 0.42, -ry * 0.5, R * 0.04, rx * 0.12, ry * 0.08, R * 1.25);
  gr.addColorStop(0, luz);
  gr.addColorStop(0.48, medio);
  gr.addColorStop(1, sombra);
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

function textura(g, x, y, w, h, al) {
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= al;
  g.drawImage(manchas, x, y, w, h);
  g.restore();
}

function parpadeo(t, sem) {
  const u = (t + sem) % (3.6 + sem);
  if (u > 0.14) return 0;
  return Math.sin((u / 0.14) * Math.PI);
}

function ojo(g, x, y, t, o) {
  const cierra = parpadeo(t, o.sem || 0.8);
  const alto = (1 + (o.alerta || 0) * 0.22) * (1 - 0.9 * cierra);
  const mx = Math.max(-9, Math.min(9, o.miraX || 0)), my = Math.max(-6, Math.min(6, o.miraY || 0));
  g.save();
  g.translate(x, y);
  g.scale(1, Math.max(0.08, alto));
  g.beginPath();
  g.ellipse(0, 0, 26, 22, 0, 0, Math.PI * 2);
  g.fillStyle = "#f6efe4";
  g.fill();
  g.beginPath();
  g.ellipse(mx, my + 1, 15, 15, 0, 0, Math.PI * 2);
  const ir = g.createRadialGradient(mx - 3, my - 3, 1, mx, my, 15);
  ir.addColorStop(0, "#c4843c");
  ir.addColorStop(0.55, "#6b3a18");
  ir.addColorStop(1, "#3a2010");
  g.fillStyle = ir;
  g.fill();
  g.beginPath();
  g.arc(mx + 1, my + 2, 7.2, 0, Math.PI * 2);
  g.fillStyle = "#140c08";
  g.fill();
  g.beginPath();
  g.arc(mx - 5, my - 6, 4.2, 0, Math.PI * 2);
  g.fillStyle = "rgba(255,255,255,0.95)";
  g.fill();
  g.restore();
}

function oreja(g, x, y, lado, extra, p) {
  g.save();
  g.translate(x, y);
  g.rotate(lado * (0.55 + extra));
  g.beginPath();
  g.moveTo(-8, -6);
  g.quadraticCurveTo(lado * 78, 10, lado * 62, 168);
  g.quadraticCurveTo(lado * 30, 214, lado * -8, 176);
  g.quadraticCurveTo(lado * -36, 90, -4, 8);
  g.closePath();
  const gr = g.createLinearGradient(lado * -20, 0, lado * 50, 180);
  gr.addColorStop(0, p.luz);
  gr.addColorStop(0.4, p.oreja);
  gr.addColorStop(1, p.sombra);
  g.fillStyle = gr;
  g.fill();
  g.beginPath();
  g.moveTo(0, 16);
  g.quadraticCurveTo(lado * 46, 36, lado * 36, 150);
  g.quadraticCurveTo(lado * 16, 176, lado * 2, 140);
  g.quadraticCurveTo(lado * -8, 70, 0, 20);
  g.fillStyle = p.dentro;
  g.fill();
  g.restore();
}

function pata(g, x, y, p) {
  g.save();
  g.translate(x, y);
  bulto(g, 0, 70, 32, 78, p.luz, p.medio, p.sombra);
  bulto(g, 0, 148, 36, 20, p.luz, p.medio, p.sombra);
  g.fillStyle = p.nariz;
  for (const dx of [-16, -5, 6, 16]) {
    g.beginPath();
    g.ellipse(dx, 152, 5, 6.5, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

// (x, y) es el pecho. s en píxeles de mundo. ladeo en radianes (positivo: cae la oreja derecha de la pantalla).
export function perro(g, x, y, s, o = {}) {
  const p = o.piel || MIEL;
  const t = o.t || 0;
  const ladeo = o.ladeo || 0;
  const extra = (o.oreja == null ? 0.28 : o.oreja) + Math.sin(t * 3.1 + (o.sem || 0)) * 0.16;
  const alerta = o.alerta || 0;
  const cola = Math.sin(t * 2.2) * 0.12;
  g.save();
  g.translate(x, y);
  g.scale(s, s * (1 + Math.sin(t * 1.7) * 0.012));
  g.save();
  g.globalAlpha *= 0.28;
  g.fillStyle = "#2a1408";
  g.beginPath();
  g.ellipse(10, 200, 150, 28, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  // grupa y cola
  bulto(g, -20, 70, 120, 100, p.luz, p.medio, p.sombra);
  g.save();
  g.translate(-90, 40);
  g.rotate(-0.8 + cola);
  g.strokeStyle = p.medio;
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(-30, -50, -10, -90);
  g.stroke();
  g.restore();
  pata(g, -58, 40, p);
  pata(g, 48, 40, p);
  bulto(g, 6, 36, 118, 130, p.luz, p.medio, p.sombra);
  g.save();
  g.beginPath();
  g.ellipse(6, 36, 118, 130, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -140, -110, 300, 280, 0.28);
  g.restore();
  bulto(g, 8, 78, 62, 78, p.pecho, "#f3e0cc", "#e4c8a8");
  // collar
  g.save();
  g.translate(4, -28);
  g.rotate(-0.04);
  k.redondo(g, -78, -16, 156, 32, 14);
  g.fillStyle = p.collar;
  g.fill();
  bulto(g, 0, 8, 16, 18, p.chapa, "#e8b84a", "#c48a20");
  g.restore();
  // cabeza ladeada
  g.save();
  g.translate(0, -70);
  g.rotate(ladeo);
  g.translate(0, 70);
  oreja(g, -96, -250, -1, 0.05 + Math.max(0, -ladeo) * 0.25 + extra * 0.2, p);
  oreja(g, 96, -250, 1, 0.12 + Math.max(0, ladeo) * 0.4 + extra * 0.45, p);
  bulto(g, 0, -188, 116, 104, p.luz, p.medio, p.sombra);
  g.save();
  g.beginPath();
  g.ellipse(0, -188, 116, 104, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -130, -300, 270, 230, 0.26);
  // mancha blanca
  g.globalCompositeOperation = "source-over";
  bulto(g, 0, -230, 28, 70, "#fffaf4", p.pecho, "#f0ddc8");
  g.restore();
  bulto(g, 0, -132, 58, 46, p.hocico, "#f0d8c0", "#e0c0a4");
  // cejas: la del lado alto se levanta
  g.strokeStyle = p.sombra;
  g.lineWidth = 7;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-78, -230);
  g.quadraticCurveTo(-48, -252 - alerta * 16, -18, -214);
  g.moveTo(78, -230);
  g.quadraticCurveTo(48, -246 - alerta * 8, 18, -220);
  g.stroke();
  ojo(g, -46, -196, t, { ...o, sem: 0.4, miraX: o.miraX || 0, miraY: o.miraY || 0, alerta });
  ojo(g, 48, -196, t, { ...o, sem: 1.1, miraX: o.miraX || 0, miraY: o.miraY || 0, alerta });
  bulto(g, 2, -124, 24, 16, "#3a2a24", p.nariz, "#0c0806");
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath();
  g.ellipse(-6, -130, 6, 3.5, -0.4, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(40,24,16,0.85)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-28, -108);
  g.quadraticCurveTo(0, -96, 28, -108);
  g.stroke();
  g.strokeStyle = "rgba(40,24,16,0.45)";
  g.lineWidth = 2;
  for (const s of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      g.beginPath();
      g.moveTo(s * 36, -120 + i * 10);
      g.lineTo(s * (70 + i * 4), -128 + i * 14);
      g.stroke();
    }
  }
  g.restore();
  g.restore();
}

export function pelota(g, x, y, r, oro = 0) {
  g.save();
  g.globalAlpha *= 0.25;
  g.fillStyle = "#6a3010";
  g.beginPath();
  g.ellipse(x, y + r * 0.86, r * 0.72, r * 0.22, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.save();
  g.translate(x, y);
  const gr = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.08, r * 0.1, r * 0.05, r);
  gr.addColorStop(0, oro > 0.5 ? "#fff1c4" : "#ff8d8a");
  gr.addColorStop(0.45, oro > 0.5 ? "#ffb43a" : "#ef3a42");
  gr.addColorStop(1, oro > 0.5 ? "#d07010" : "#9e1828");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  g.fill();
  g.save();
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  g.clip();
  g.fillStyle = "rgba(255,255,255,0.92)";
  g.fillRect(-r, -r * 0.18, r * 2, r * 0.28);
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.beginPath();
  g.ellipse(-r * 0.32, -r * 0.36, r * 0.22, r * 0.14, -0.5, 0, Math.PI * 2);
  g.fill();
  if (oro > 0.05) {
    g.strokeStyle = `rgba(255,210,80,${0.9 * oro})`;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(0, 0, r + 6, 0, Math.PI * 2);
    g.stroke();
  }
  g.restore();
}

function mezColor(a, b, u) {
  return k.mezColor(a, b, Math.max(0, Math.min(1, u)));
}

export function salon(g, t, frio = 0) {
  g.fillStyle = "#c4844a";
  g.fillRect(-2500, -2500, 6000, 7000);
  const pared = g.createLinearGradient(0, 280, 0, 1120);
  pared.addColorStop(0, mezColor("#ffb067", "#6a7894", frio));
  pared.addColorStop(0.45, mezColor("#ffd7a4", "#9aa6b8", frio));
  pared.addColorStop(1, mezColor("#fff0d4", "#c4ccd6", frio));
  g.fillStyle = pared;
  g.fillRect(-800, -800, 2600, 2300);
  // ventana
  g.save();
  k.redondo(g, 690, 430, 300, 420, 28);
  g.fillStyle = mezColor("#9ad8ff", "#66748a", frio);
  g.fill();
  g.strokeStyle = "#fff6e8";
  g.lineWidth = 16;
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(828, 446, 10, 388);
  g.fillRect(706, 628, 268, 10);
  // cielo en la ventana
  g.restore();
  brillo(g, 860, 620, 520, frio > 0.4 ? "180,200,230" : "255,214,150", 0.55);
  // sofá
  g.save();
  k.redondo(g, 150, 980, 780, 280, 70);
  const sof = g.createLinearGradient(150, 980, 930, 1260);
  sof.addColorStop(0, mezColor("#14b8a8", "#3a6870", frio));
  sof.addColorStop(0.5, mezColor("#7ef0e4", "#6a98a0", frio));
  sof.addColorStop(1, mezColor("#0e7e78", "#2a4850", frio));
  g.fillStyle = sof;
  g.fill();
  g.restore();
  // suelo
  const suelo = g.createLinearGradient(0, 1120, 0, 1900);
  suelo.addColorStop(0, mezColor("#f0c48a", "#b09880", frio));
  suelo.addColorStop(1, mezColor("#c4844a", "#7a624e", frio));
  g.fillStyle = suelo;
  g.fillRect(-800, 1140, 2600, 2600);
  g.save();
  g.globalAlpha *= 0.35;
  for (let i = -2; i < 14; i++) {
    g.strokeStyle = "rgba(120,70,30,0.35)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-100, 1180 + i * 52);
    g.lineTo(1300, 1160 + i * 52);
    g.stroke();
  }
  g.restore();
  // alfombra
  g.save();
  k.redondo(g, 220, 1280, 640, 220, 40);
  g.fillStyle = mezColor("#ff6b4a", "#a86868", frio);
  g.fill();
  g.restore();
  // lámpara
  g.fillStyle = "#5a3a28";
  g.fillRect(150, 860, 18, 280);
  g.beginPath();
  g.moveTo(80, 860);
  g.lineTo(230, 860);
  g.lineTo(200, 760);
  g.lineTo(110, 760);
  g.closePath();
  g.fillStyle = "#ffe08a";
  g.fill();
  brillo(g, 160, 820, 280, "255,220,150", 0.7);
  // planta
  g.fillStyle = "#e07a3a";
  g.fillRect(980, 980, 70, 54);
  g.fillStyle = "#1f9a4a";
  g.beginPath();
  g.ellipse(1015, 900, 70, 36, 0, 0, Math.PI * 2);
  g.ellipse(980, 940, 46, 28, 0.4, 0, Math.PI * 2);
  g.ellipse(1055, 940, 46, 28, -0.4, 0, Math.PI * 2);
  g.fill();
  // motas de sol
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 8; i++) {
    const y = 700 + ((i * 90 + t * 24) % 420);
    const x = 760 + (i % 4) * 40 + Math.sin(t + i) * 8;
    g.fillStyle = `rgba(255,236,190,${0.18 + (i % 3) * 0.06})`;
    g.beginPath();
    g.arc(x, y, 5, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

export function cuarto(g, t) {
  g.fillStyle = "#d09a58";
  g.fillRect(-2500, -2500, 6000, 7000);
  const pared = g.createLinearGradient(0, 200, 0, 1100);
  pared.addColorStop(0, "#8fd4ff");
  pared.addColorStop(0.5, "#fff0c8");
  pared.addColorStop(1, "#ffe0b0");
  g.fillStyle = pared;
  g.fillRect(-800, -800, 2600, 2200);
  // estantería
  g.fillStyle = "#e08a3c";
  g.fillRect(80, 520, 920, 28);
  g.fillRect(80, 760, 920, 28);
  for (let i = 0; i < 6; i++) {
    pelota(g, 180 + i * 140, 470 - (i % 2) * 10, 36, i === 2 ? 0.3 : 0);
  }
  const suelo = g.createLinearGradient(0, 1080, 0, 1900);
  suelo.addColorStop(0, "#f2d2a0");
  suelo.addColorStop(1, "#d09a58");
  g.fillStyle = suelo;
  g.fillRect(-800, 1080, 2600, 2800);
  brillo(g, 540, 280, 700, "255,244,210", 0.45);
}

const azM = azar(5);
export const MONTON = Array.from({ length: 64 }, (_, i) => ({
  x: 160 + azM() * 760,
  y: 1240 + azM() * 380,
  r: 26 + azM() * 22,
  oro: false,
}));
MONTON.push({ x: 470, y: 1340, r: 40, oro: true }, { x: 650, y: 1380, r: 36, oro: true });

export function persona(g, x, y, s, o = {}) {
  const t = o.t || 0;
  const der = Math.max(0, Math.min(1, o.derrite || 0));
  const habla = o.habla || 0;
  const jersey = o.jersey || "#ff6a3c";
  const jersey2 = o.jersey2 || "#ffb088";
  const pelo = o.pelo || "#3a2418";
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // charco
  if (der > 0.02) {
    g.save();
    g.globalAlpha *= der;
    g.fillStyle = jersey;
    g.beginPath();
    g.ellipse(0, -8, 70 + der * 90, 22 + der * 16, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#f3c7a4";
    g.beginPath();
    g.ellipse(-20, -4, 26, 10, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  const aplasta = 1 - der * 0.92;
  g.save();
  g.translate(0, -der * 40);
  g.scale(1 + der * 0.35, aplasta);
  g.globalAlpha *= 1 - der * 0.85;
  // piernas
  g.fillStyle = "#2c3e86";
  k.redondo(g, -46, -250, 36, 200, 14);
  g.fill();
  k.redondo(g, 10, -250, 36, 200, 14);
  g.fill();
  g.fillStyle = "#1c2438";
  g.fillRect(-50, -70, 44, 18);
  g.fillRect(8, -70, 44, 18);
  // torso
  const cu = g.createLinearGradient(-80, -460, 80, -220);
  cu.addColorStop(0, jersey2);
  cu.addColorStop(0.45, jersey);
  cu.addColorStop(1, jersey);
  k.redondo(g, -84, -470, 168, 250, 46);
  g.fillStyle = cu;
  g.fill();
  // cabeza
  bulto(g, 0, -540, 62, 70, "#ffe0c4", "#f3c7a4", "#e0a888");
  g.fillStyle = pelo;
  g.beginPath();
  g.ellipse(0, -590, 64, 40, 0, 0, Math.PI * 2);
  g.ellipse(-48, -550, 22, 34, 0.3, 0, Math.PI * 2);
  g.ellipse(48, -550, 22, 34, -0.3, 0, Math.PI * 2);
  g.fill();
  // cara
  g.fillStyle = "#2a2018";
  g.beginPath();
  g.arc(-20, -545, 5, 0, Math.PI * 2);
  g.arc(20, -545, 5, 0, Math.PI * 2);
  g.fill();
  const boca = 8 + habla * 10 + Math.sin(t * 8) * habla * 4;
  g.beginPath();
  g.ellipse(0, -512, 14, Math.max(4, boca * 0.35), 0, 0, Math.PI * 2);
  g.fillStyle = "#c4686a";
  g.fill();
  // brazo que señala
  g.strokeStyle = "#f3c7a4";
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(70, -400);
  g.quadraticCurveTo(120, -360, 130, -300 - (o.senala || 0) * 40);
  g.stroke();
  g.restore();
  g.restore();
}

export function escritorio(g, u, alza = 0) {
  const pared = g.createLinearGradient(0, 0, 0, 900);
  pared.addColorStop(0, "#3a241c");
  pared.addColorStop(1, "#8a5030");
  g.fillStyle = pared;
  g.fillRect(0, 0, 1080, 1920);
  brillo(g, 180, 280, 500, "255,210,140", 0.85);
  // mesa
  const mesa = g.createLinearGradient(0, 980, 0, 1920);
  mesa.addColorStop(0, "#e8b070");
  mesa.addColorStop(1, "#a86830");
  g.fillStyle = mesa;
  g.fillRect(0, 1080, 1080, 900);
  g.save();
  g.globalAlpha *= 0.3;
  g.drawImage(manchas, 0, 1000, 1080, 900);
  g.restore();
  // taza
  g.fillStyle = "#fff";
  k.redondo(g, 760, 980, 120, 110, 16);
  g.fill();
  g.fillStyle = "#6a3a28";
  g.fillRect(778, 1000, 84, 50);
  // folio
  g.save();
  g.translate(540, 1280);
  g.rotate(-0.06);
  g.fillStyle = "#fffaf4";
  g.shadowColor = "rgba(0,0,0,0.25)";
  g.shadowBlur = 30;
  k.redondo(g, -280, -220, 560, 460, 12);
  g.fill();
  g.shadowBlur = 0;
  g.strokeStyle = "#243056";
  g.lineWidth = 8;
  g.lineCap = "round";
  const largo = 40 + u * 420;
  g.beginPath();
  g.moveTo(-200, -20);
  g.lineTo(-200 + largo, -20 + Math.sin(u * 6) * 8);
  g.stroke();
  g.restore();
  mano(g, 620 + (1 - u) * 40, 1180 - alza * 80, u);
}

function mano(g, x, y, u) {
  g.save();
  g.translate(x, y);
  g.rotate(-0.5 + u * 0.08);
  // puño
  bulto(g, 40, 20, 90, 70, "#ffe0c4", "#f0c09a", "#d09878", 0.2);
  bulto(g, -30, -10, 36, 54, "#ffe0c4", "#f0c09a", "#d09878", -0.4);
  // índice
  bulto(g, 70, -40, 28, 70, "#ffe6cc", "#f3c7a4", "#d8a888", 0.5);
  // boli
  g.save();
  g.translate(90, -70);
  g.rotate(0.7);
  g.fillStyle = "#1c2438";
  k.redondo(g, -14, -10, 28, 170, 8);
  g.fill();
  g.fillStyle = "#ffd25a";
  g.beginPath();
  g.moveTo(-10, 150);
  g.lineTo(10, 150);
  g.lineTo(0, 190);
  g.fill();
  g.restore();
  g.restore();
}

// Ojo enorme del perro de miel, en coordenadas de pantalla (la escena ya está encuadrada).
export function ojoGrande(g, cx, cy, esc, o) {
  const t = o.t || 0;
  const alerta = o.alerta || 0;
  g.save();
  g.translate(cx, cy);
  g.scale(esc, esc);
  // pelo alrededor
  bulto(g, 0, 40, 340, 280, MIEL.luz, MIEL.medio, MIEL.sombra);
  g.save();
  g.beginPath();
  g.ellipse(0, 40, 340, 280, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -360, -260, 740, 620, 0.3);
  g.restore();
  bulto(g, -40, -80, 46, 90, "#fffaf4", MIEL.pecho, "#f0ddc8");
  const cierra = parpadeo(t, 0.5);
  g.save();
  g.scale(1, Math.max(0.12, 1 + alerta * 0.08 - cierra * 0.85));
  g.beginPath();
  g.ellipse(0, 0, 150, 120, 0, 0, Math.PI * 2);
  g.fillStyle = "#f7f1e8";
  g.fill();
  const mx = o.miraX || 0, my = o.miraY || 0;
  g.beginPath();
  g.arc(mx, my, 72, 0, Math.PI * 2);
  const ir = g.createRadialGradient(mx - 16, my - 18, 4, mx, my, 72);
  ir.addColorStop(0, "#e0a050");
  ir.addColorStop(0.5, "#7a4018");
  ir.addColorStop(1, "#3a2010");
  g.fillStyle = ir;
  g.fill();
  g.beginPath();
  g.arc(mx + 4, my + 6, 34, 0, Math.PI * 2);
  g.fillStyle = "#120c08";
  g.fill();
  g.beginPath();
  g.arc(mx - 22, my - 24, 16, 0, Math.PI * 2);
  g.fillStyle = "#fff";
  g.fill();
  g.restore();
  // párpado / ceja
  g.strokeStyle = MIEL.sombra;
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-160, -130);
  g.quadraticCurveTo(0, -180 - alerta * 30, 170, -120);
  g.stroke();
  g.restore();
}

export function anillos(g, x, y, u) {
  if (u <= 0 || u >= 1) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const p = Math.max(0, Math.min(1, u * 1.15 - i * 0.12));
    const r = mez(280, 30, entra(p));
    g.strokeStyle = `rgba(255,210,90,${0.55 * (1 - p)})`;
    g.lineWidth = 10;
    g.beginPath();
    g.arc(x - (1 - p) * 180, y, r, 0, Math.PI * 2);
    g.stroke();
  }
  g.restore();
}

export function corazon(g, x, y, s, al) {
  if (al <= 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.beginPath();
  g.moveTo(0, 36);
  g.bezierCurveTo(-8, -10, -78, -8, -78, 28);
  g.bezierCurveTo(-78, 70, 0, 100, 0, 120);
  g.bezierCurveTo(0, 100, 78, 70, 78, 28);
  g.bezierCurveTo(78, -8, 8, -10, 0, 36);
  const gr = g.createRadialGradient(-20, 10, 8, 0, 40, 120);
  gr.addColorStop(0, "#ffd0d8");
  gr.addColorStop(0.4, "#ff4d6a");
  gr.addColorStop(1, "#c41840");
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

export function trozos(g, x, y, u) {
  if (u <= 0 || u >= 1) return;
  const az = azar(9);
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 10; i++) {
    const a = az() * Math.PI * 2;
    const d = entra(u) * (80 + az() * 220);
    const al = (1 - u) * 0.8;
    brillo(g, x + Math.cos(a) * d, y + Math.sin(a) * d, 40 + az() * 30, "255,80,110", al);
  }
  g.restore();
}

export function marco(g, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.rect(0, 0, 1080, 1920);
  const x = 180, y = 620, w = 720, h = 780, r = 48;
  g.moveTo(x + r, y);
  g.lineTo(x + w - r, y);
  g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.lineTo(x + w, y + h - r);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.lineTo(x + r, y + h);
  g.quadraticCurveTo(x, y + h, x, y + h - r);
  g.lineTo(x, y + r);
  g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
  g.fillStyle = "rgba(12,6,4,0.72)";
  g.fill("evenodd");
  g.strokeStyle = "#ffd25a";
  g.lineWidth = 14;
  k.redondo(g, x, y, w, h, r);
  g.stroke();
  g.restore();
}

export function hueco(g, x, y, r, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  const gr = g.createRadialGradient(x, y, r * 0.2, x, y, r);
  gr.addColorStop(0, "rgba(255,255,255,0.15)");
  gr.addColorStop(0.6, "rgba(255,220,160,0.18)");
  gr.addColorStop(1, "rgba(255,220,160,0)");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "rgba(255,236,200,0.8)";
  g.lineWidth = 6;
  g.setLineDash([16, 14]);
  g.beginPath();
  g.arc(x, y, r * 0.72, 0, Math.PI * 2);
  g.stroke();
  g.restore();
}

export function rafagas(g, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha *= al;
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    g.strokeStyle = "rgba(255,228,190,0.28)";
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(540 + Math.cos(a) * 220, 980 + Math.sin(a) * 220);
    g.lineTo(540 + Math.cos(a) * 460, 980 + Math.sin(a) * 460);
    g.stroke();
  }
  g.restore();
}

export function hoja(g, x, y, ang, color) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  k.redondo(g, -150, 0, 300, 380, 18);
  g.fillStyle = color;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(-110, 40, 220, 10);
  g.fillRect(-110, 80, 160, 8);
  g.restore();
}

// La pose del fotograma 0, para cerrar el vídeo encima de ella. En t=0 la cámara va a mitad de camino.
export function poseCero(t) {
  const tt = Math.max(-0.4, Math.min(t, 1.5));
  const z = k.claves([[-0.42, 3.7], [0.58, 1.62], [1.45, 1.05]])(tt);
  const fx = k.claves([[-0.42, 660], [0.62, 555], [1.45, 530]])(tt);
  const fy = k.claves([[-0.42, 820], [0.6, 960], [1.45, 1100]])(tt);
  return { z, fx, fy };
}

export const LADEO = 0.98;
