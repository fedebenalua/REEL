// El perro canela, el jardín, la cocina y el bosque. El mismo perro en todos los planos.
import * as k from "#kit";

const { azar, lienzo, manchas } = k;

export const CANELA = {
  luz: "#ffe0b0", medio: "#f0943a", sombra: "#c45e16",
  oreja: "#e07828", dentro: "#f6b2a8",
  hocico: "#fff4e4", pecho: "#fff8f0", nariz: "#241612",
  collar: "#1f8a72", chapa: "#ffe07a",
};
export const VIEJO = {
  luz: "#f3ece2", medio: "#c8beb2", sombra: "#8a8076",
  oreja: "#b0a698", dentro: "#f0b8b0",
  hocico: "#fffaf4", pecho: "#f7f4ef", nariz: "#2a211c",
  collar: "#3d6ea8", chapa: "#ffe08a",
};
export const LOBO = {
  luz: "#d5dde6", medio: "#8b97a6", sombra: "#3e4856",
  oreja: "#6a7686", dentro: "#e7a8a4",
  hocico: "#ece6dc", pecho: "#f4f1ea", nariz: "#1a140f",
  collar: "#000", chapa: "#000",
};
const OTROS = [
  ["#ffd0a8", "#e88840", "#b85c18", "#e07028"],
  ["#f6e6cc", "#d0a878", "#a07848", "#c09060"],
  ["#e4ddd6", "#a39890", "#6a6058", "#8a7e74"],
  ["#f8d0b0", "#e08058", "#b05830", "#d07048"],
  ["#fff6ea", "#f0d0a8", "#c09870", "#e0b888"],
  ["#e8d8c0", "#b89870", "#806848", "#a08058"],
  ["#f0c8a0", "#d07848", "#a05028", "#c06838"],
  ["#d8e4c8", "#8aaa78", "#4e7048", "#6a9060"],
  ["#f8e0c0", "#e09858", "#b06830", "#d08040"],
].map(([luz, medio, sombra, oreja]) => ({
  luz, medio, sombra, oreja, dentro: "#f3b2a4",
  hocico: "#fff6ea", pecho: "#fff8f0", nariz: "#241612",
  collar: "#e25b4a", chapa: "#ffe08a",
}));
export function pielDe(i) { return OTROS[i % OTROS.length]; }

export const HERO = { x: 1080, y: 1360 };

const azB = azar(4401);
export const BRINZAS = Array.from({ length: 110 }, () => ({
  x: -300 + azB() * 2800,
  y: 1180 + azB() * 820,
  h: 80 + azB() * 200,
  an: 8 + azB() * 12,
  curva: (azB() - 0.5) * 70,
  fase: azB() * 6.28,
  tono: azB(),
  delante: azB() > 0.62,
}));

const azR = azar(902);
export const RAFAGA = Array.from({ length: 28 }, () => ({
  ang: azR() * 6.28,
  r0: 80 + azR() * 420,
  vel: 0.55 + azR() * 1.1,
  h: 340 + azR() * 420,
  an: 16 + azR() * 22,
  tono: azR(),
  fase: azR() * 6,
}));

const bufs = [];
export function conAlfa(g, al, fn) {
  if (al <= 0.02) return;
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

export function conCam(g, cam, fn) {
  g.save();
  g.translate(540, 960);
  g.scale(cam.z, cam.z);
  g.translate(-cam.fx, -cam.fy);
  fn();
  g.restore();
}

export function velo(g, al = 0.72) {
  if (al <= 0.02) return;
  const vg = g.createLinearGradient(0, 0, 0, 640);
  vg.addColorStop(0, `rgba(8, 32, 16, ${al})`);
  vg.addColorStop(0.5, `rgba(8, 32, 16, ${al * 0.55})`);
  vg.addColorStop(1, "rgba(8, 32, 16, 0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 680);
}

function bulto(g, x, y, rx, ry, luz, medio, sombra, rot = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.beginPath();
  g.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
  const R = Math.max(rx, ry);
  const gr = g.createRadialGradient(-rx * 0.45, -ry * 0.55, R * 0.05, rx * 0.15, ry * 0.1, R * 1.35);
  gr.addColorStop(0, luz);
  gr.addColorStop(0.5, medio);
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
  const u = (t * 0.85 + sem) % 4.2;
  if (u > 0.14) return 0;
  return Math.sin((u / 0.14) * Math.PI);
}

function ojo(g, x, y, r, t, o) {
  const cierra = parpadeo(t, o.sem || 0.7);
  const alto = (1 + (o.alerta || 0) * 0.15) * (1 - 0.92 * cierra);
  const mx = Math.max(-r * 0.35, Math.min(r * 0.35, o.miraX || 0));
  const my = Math.max(-r * 0.3, Math.min(r * 0.35, o.miraY || 0));
  g.save();
  g.translate(x, y);
  g.scale(1, Math.max(0.08, alto));
  g.beginPath();
  g.ellipse(0, 0, r * 1.15, r, 0, 0, Math.PI * 2);
  g.fillStyle = "#f7f1e6";
  g.fill();
  g.beginPath();
  g.ellipse(mx, my, r * 0.62, r * 0.62, 0, 0, Math.PI * 2);
  const ir = g.createRadialGradient(mx - r * 0.15, my - r * 0.2, 1, mx, my, r * 0.62);
  ir.addColorStop(0, o.ambar ? "#ffe08a" : "#e0a050");
  ir.addColorStop(0.55, o.ambar ? "#d08020" : "#7a4018");
  ir.addColorStop(1, "#2a140c");
  g.fillStyle = ir;
  g.fill();
  g.beginPath();
  g.arc(mx, my + r * 0.08, r * 0.28, 0, Math.PI * 2);
  g.fillStyle = "#140c08";
  g.fill();
  g.beginPath();
  g.arc(mx - r * 0.22, my - r * 0.28, r * 0.16, 0, Math.PI * 2);
  g.fillStyle = "rgba(255,255,255,0.95)";
  g.fill();
  g.restore();
}

function colorBrizna(tono) {
  if (tono < 0.33) return ["#d8ff6a", "#46c43e", "#166828"];
  if (tono < 0.66) return ["#b6f25a", "#2ea844", "#0e5c24"];
  return ["#e8ff8a", "#6ed44a", "#2a8a30"];
}

export function brizna(g, x, y, h, an, curva, tono, t, fase) {
  const [luz, medio, sombra] = colorBrizna(tono);
  const c = curva + Math.sin(t * 3.1 + fase) * 32;
  g.beginPath();
  g.moveTo(x - an * 0.45, y);
  g.quadraticCurveTo(x + c * 0.4, y - h * 0.55, x + c, y - h);
  g.quadraticCurveTo(x + c * 0.7 + an, y - h * 0.45, x + an * 0.55, y);
  g.closePath();
  const gr = g.createLinearGradient(x, y - h, x, y);
  gr.addColorStop(0, luz);
  gr.addColorStop(0.45, medio);
  gr.addColorStop(1, sombra);
  g.fillStyle = gr;
  g.fill();
}

export function jardin(g, t) {
  const cielo = g.createLinearGradient(0, -400, 0, 1200);
  cielo.addColorStop(0, "#1f86f0");
  cielo.addColorStop(0.42, "#7ad4ff");
  cielo.addColorStop(0.78, "#d8ffb0");
  cielo.addColorStop(1, "#8fe06a");
  g.fillStyle = cielo;
  g.fillRect(-1200, -900, 5200, 2600);
  g.save();
  g.globalCompositeOperation = "lighter";
  const sol = g.createRadialGradient(420, 260, 10, 420, 260, 280);
  sol.addColorStop(0, "rgba(255,248,210,0.95)");
  sol.addColorStop(0.35, "rgba(255,200,70,0.45)");
  sol.addColorStop(1, "rgba(255,180,40,0)");
  g.fillStyle = sol;
  g.beginPath();
  g.arc(420, 260, 280, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.fillStyle = "#7ec85a";
  g.beginPath();
  g.ellipse(200, 1040, 520, 120, 0, 0, Math.PI * 2);
  g.ellipse(1100, 1000, 780, 150, 0, 0, Math.PI * 2);
  g.ellipse(2100, 1060, 560, 130, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#3ea048";
  g.beginPath();
  g.ellipse(80, 1120, 260, 80, 0, 0, Math.PI * 2);
  g.ellipse(1680, 1100, 340, 90, 0, 0, Math.PI * 2);
  g.fill();
  const suelo = g.createLinearGradient(0, 1080, 0, 2100);
  suelo.addColorStop(0, "#7ed857");
  suelo.addColorStop(0.35, "#3aaa3c");
  suelo.addColorStop(1, "#1a6a28");
  g.fillStyle = suelo;
  g.fillRect(-2000, 1120, 8000, 4200);
  for (let i = 0; i < 36; i++) {
    brizna(g, -200 + i * 130, 1750 + (i % 4) * 90, 70 + (i % 5) * 24, 8, (i % 2 ? 18 : -14), (i % 7) / 7, t, i);
  }
  g.save();
  g.globalAlpha *= 0.35;
  g.fillStyle = "#ffd86a";
  for (const [x, y] of [[260, 1160], [1500, 1140], [1900, 1280]]) {
    g.beginPath();
    g.arc(x, y, 16, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fffaf0";
    g.beginPath();
    g.arc(x, y, 7, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#ffd86a";
  }
  g.restore();
  for (const b of BRINZAS) if (!b.delante) brizna(g, b.x, b.y, b.h, b.an, b.curva, b.tono, t, b.fase);
}

export function hierbaDelante(g, t) {
  for (const b of BRINZAS) if (b.delante && b.y > 1520) brizna(g, b.x, b.y, b.h * 1.15, b.an, b.curva, b.tono, t, b.fase);
}

export function pielRoja(p, u) {
  if (u < 0.04) return p;
  return {
    ...p,
    luz: k.mezColor(p.luz, "#ffd0d0", u),
    medio: k.mezColor(p.medio, "#ef3a3a", u),
    sombra: k.mezColor(p.sombra, "#8a1020", u),
    oreja: k.mezColor(p.oreja, "#d02020", u),
  };
}

export function rafaga(g, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  for (const r of RAFAGA) {
    const x = 540 + Math.cos(r.ang) * r.r0;
    const y = 980 + Math.sin(r.ang) * r.r0 * 1.15;
    g.save();
    g.translate(x, y);
    g.rotate(r.ang + 1.2);
    brizna(g, 0, 0, r.h, r.an, 30, r.tono, 0, r.fase);
    g.restore();
  }
  g.restore();
}

function orejaCaida(g, x, y, lado, extra, p) {
  g.save();
  g.translate(x, y);
  g.rotate(lado * (0.35 + extra));
  g.beginPath();
  g.moveTo(-6, 0);
  g.quadraticCurveTo(lado * 70, 20, lado * 48, 150);
  g.quadraticCurveTo(lado * 20, 190, lado * -6, 150);
  g.quadraticCurveTo(lado * -28, 80, -2, 8);
  g.closePath();
  const gr = g.createLinearGradient(0, 0, lado * 40, 170);
  gr.addColorStop(0, p.luz);
  gr.addColorStop(0.45, p.oreja);
  gr.addColorStop(1, p.sombra);
  g.fillStyle = gr;
  g.fill();
  g.beginPath();
  g.moveTo(0, 18);
  g.quadraticCurveTo(lado * 36, 40, lado * 26, 130);
  g.quadraticCurveTo(lado * 10, 156, lado * 2, 120);
  g.closePath();
  g.fillStyle = p.dentro;
  g.fill();
  g.restore();
}

function orejaPunta(g, x, y, lado, p) {
  g.save();
  g.translate(x, y);
  g.rotate(lado * -0.15);
  g.beginPath();
  g.moveTo(lado * -8, 20);
  g.lineTo(lado * 8, -150);
  g.lineTo(lado * 46, 28);
  g.closePath();
  const gr = g.createLinearGradient(0, -140, lado * 30, 30);
  gr.addColorStop(0, p.luz);
  gr.addColorStop(0.5, p.medio);
  gr.addColorStop(1, p.sombra);
  g.fillStyle = gr;
  g.fill();
  g.beginPath();
  g.moveTo(lado * 4, 10);
  g.lineTo(lado * 12, -110);
  g.lineTo(lado * 32, 16);
  g.closePath();
  g.fillStyle = p.dentro;
  g.fill();
  g.restore();
}

// (x, y) es el pecho. s escala. baja: 0 cabeza alta, 1 hocico en la hierba.
export function perro(g, x, y, s, o = {}) {
  const p = o.piel || CANELA;
  const t = o.t || 0;
  const baja = o.baja == null ? 0.2 : o.baja;
  const lobo = !!o.lobo;
  const masca = Math.sin(t * (o.ritmo || 7.5) + (o.sem || 0)) * 0.5 + 0.5;
  const cola = Math.sin(t * (o.ritmoCola || 5.5) + (o.sem || 0)) * (o.cola == null ? 0.45 : o.cola);
  const extra = 0.15 + Math.sin(t * 2.2 + (o.sem || 0)) * 0.08;
  g.save();
  g.translate(x, y);
  g.rotate(baja * 0.1);
  g.scale(s * (o.flip || 1), s);
  g.save();
  g.globalAlpha *= 0.28;
  g.fillStyle = "#1a3a14";
  g.beginPath();
  g.ellipse(10, 150, 150, 28, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  bulto(g, -30, 40, 120, 100, p.luz, p.medio, p.sombra);
  g.save();
  g.translate(-120, 10);
  g.rotate(-0.9 + cola * (lobo ? 0.15 : 1));
  if (lobo) {
    bulto(g, -50, -20, 54, 28, p.luz, p.medio, p.sombra, -0.4);
    bulto(g, -10, 10, 36, 22, p.medio, p.sombra, p.sombra, 0.2);
  } else {
    g.strokeStyle = p.medio;
    g.lineWidth = 22;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(-40, -70, -8, -120);
    g.stroke();
  }
  g.restore();
  bulto(g, -70, 70, 28, 70, p.medio, p.sombra, p.sombra, 0.15);
  bulto(g, 50, 78, 26, 64, p.medio, p.sombra, p.sombra, -0.08);
  bulto(g, 8, 20, 112, 118, p.luz, p.medio, p.sombra);
  g.save();
  g.beginPath();
  g.ellipse(8, 20, 112, 118, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -130, -110, 280, 260, 0.22);
  g.restore();
  bulto(g, 10, 70, 70, 78, p.pecho, "#f4e0cc", "#e6c8aa");
  if (!lobo && o.collar !== false) {
    g.save();
    g.translate(6, -40);
    k.redondo(g, -78, -14, 156, 30, 14);
    g.fillStyle = p.collar;
    g.fill();
    bulto(g, 4, 6, 16, 18, p.chapa, "#e8b84a", "#b88820");
    g.restore();
  }
  g.save();
  g.translate(0, -20 + baja * 72);
  g.rotate(baja * 0.4);
  if (lobo) {
    orejaPunta(g, -78, -230, -1, p);
    orejaPunta(g, 78, -230, 1, p);
  } else {
    orejaCaida(g, -92, -210, -1, extra, p);
    orejaCaida(g, 92, -210, 1, extra + 0.12, p);
  }
  bulto(g, 0, -170, lobo ? 100 : 112, lobo ? 96 : 100, p.luz, p.medio, p.sombra);
  g.save();
  g.beginPath();
  g.ellipse(0, -170, lobo ? 100 : 112, lobo ? 96 : 100, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -120, -280, 250, 220, 0.2);
  g.restore();
  if (!lobo) {
    g.save();
    g.beginPath();
    g.ellipse(0, -210, 26, 62, 0, 0, Math.PI * 2);
    g.fillStyle = p.pecho;
    g.fill();
    g.restore();
  }
  const hocicoY = -118 + baja * 10;
  bulto(g, 0, hocicoY, lobo ? 46 : 62, lobo ? 40 : 44, p.hocico, "#f0d8c0", "#e2c2a6");
  if (o.viejo) {
    g.save();
    g.globalAlpha *= 0.85;
    bulto(g, 0, hocicoY - 8, 40, 22, "#f7f7f7", "#d8d4ce", "#b8b2aa");
    g.restore();
  }
  g.strokeStyle = p.sombra;
  g.lineWidth = 6;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-70, -214);
  g.quadraticCurveTo(-40, -228 - (o.alerta || 0) * 8, -16, -206);
  g.moveTo(70, -214);
  g.quadraticCurveTo(40, -228 - (o.ceja || 0) * 8, 16, -206);
  g.stroke();
  const miraY = (o.miraY || 0) + baja * 4;
  ojo(g, -42, -178, 20, t, { ...o, miraY, sem: 0.4 });
  ojo(g, 44, -178, 20, t, { ...o, miraY, sem: 1.3 });
  bulto(g, 2, hocicoY + 8, lobo ? 22 : 26, 16, "#3a2a24", p.nariz, "#120c0a");
  g.fillStyle = "rgba(255,255,255,0.5)";
  g.beginPath();
  g.ellipse(-6, hocicoY + 2, 6, 3.2, -0.4, 0, Math.PI * 2);
  g.fill();
  const boca = -96 + masca * 10 + baja * 6;
  g.strokeStyle = "rgba(90,30,24,0.9)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(-22, boca);
  g.quadraticCurveTo(0, boca + 16 + masca * 14, 24, boca);
  g.stroke();
  if ((o.lengua || o.come) && (o.rojo || 0) < 0.4) {
    g.fillStyle = "#f09098";
    g.beginPath();
    g.ellipse(0, boca + 10 + masca * 8, 14, 10 + masca * 8, 0, 0, Math.PI * 2);
    g.fill();
  }
  if (o.come) {
    g.save();
    g.translate(0, boca + 6);
    for (let i = -3; i <= 3; i++) {
      brizna(g, i * 16, 10, 90 + masca * 70, 8, i * 12, 0.15 + ((i + 3) % 3) * 0.2, t, i + 2);
    }
    g.restore();
  }
  if ((o.rojo || 0) > 0.05) {
    g.save();
    g.globalCompositeOperation = "multiply";
    g.globalAlpha *= 0.35 * o.rojo;
    g.fillStyle = "#ff4040";
    g.beginPath();
    g.ellipse(0, -150, 130, 160, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }
  g.restore();
  g.restore();
}

export function monton(g, x, y, n, t, al = 1) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  for (let i = 0; i < n; i++) {
    const a = azar(20 + i)();
    brizna(g, x + (i - n / 2) * 16, y, 50 + a * 70, 7, (a - 0.5) * 30, a, t, i);
  }
  g.restore();
}

export function chorro(g, x, y, al, t, comico) {
  if (al <= 0.02) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.rotate(Math.sin(t * 3) * 0.04);
  g.beginPath();
  g.moveTo(-20, 20);
  g.quadraticCurveTo(-80, -20, -40, -90);
  g.quadraticCurveTo(10, -160, 70, -120);
  g.quadraticCurveTo(130, -70, 80, 10);
  g.quadraticCurveTo(40, 50, -20, 20);
  g.closePath();
  const gr = g.createRadialGradient(-10, -40, 10, 10, -30, 140);
  gr.addColorStop(0, comico ? "#d8ff6a" : "#8aaa40");
  gr.addColorStop(0.6, comico ? "#7ed42a" : "#5a7830");
  gr.addColorStop(1, comico ? "#3a9a18" : "#3e5424");
  g.fillStyle = gr;
  g.fill();
  if (comico) {
    g.strokeStyle = "rgba(255,255,255,0.92)";
    g.lineWidth = 10;
    g.stroke();
    g.fillStyle = "rgba(255,255,255,0.85)";
    for (const [cx, cy, r] of [[-90, 30, 16], [-120, 58, 10], [-142, 78, 6]]) {
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.restore();
}

export function charco(g, x, y, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.ellipse(x, y, 120, 44, -0.2, 0, Math.PI * 2);
  const gr = g.createRadialGradient(x - 10, y - 6, 4, x, y, 70);
  gr.addColorStop(0, "#c6e05a");
  gr.addColorStop(1, "#4a6a22");
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

export function persona(g, x, y, s, o = {}) {
  const t = o.t || 0;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.save();
  g.globalAlpha *= 0.25;
  g.fillStyle = "#1a3a14";
  g.beginPath();
  g.ellipse(0, 20, 90, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  bulto(g, -28, -40, 36, 90, "#3a2418", "#2a1a10", "#1a1008");
  bulto(g, 28, -40, 36, 90, "#3a2418", "#2a1a10", "#1a1008");
  const c1 = o.color || "#ff5a3c";
  const c2 = o.color2 || "#ffb199";
  bulto(g, 0, -180, 78, 110, c2, c1, "#c43828");
  g.save();
  g.translate(-90, -200);
  g.rotate(-0.7 + (o.brazo || 0));
  bulto(g, 0, 40, 22, 70, "#ffd2b8", "#e8a888", "#c48068");
  if (o.termo) {
    g.save();
    g.translate(0, 100);
    k.redondo(g, -10, -70, 20, 90, 8);
    g.fillStyle = "#f4f7fb";
    g.fill();
    g.fillStyle = "#e23a3a";
    g.fillRect(-6, -10, 12, 28);
    g.fillStyle = "#c8d0da";
    g.fillRect(-12, -78, 24, 12);
    g.restore();
  }
  if (o.movil) {
    g.save();
    g.translate(10, -20);
    k.redondo(g, -16, -36, 32, 56, 8);
    g.fillStyle = "#1a1c22";
    g.fill();
    g.fillStyle = "#8fd0ff";
    g.fillRect(-10, -26, 20, 34);
    g.restore();
  }
  g.restore();
  bulto(g, 70, -150, 22, 64, "#ffd2b8", "#e8a888", "#c48068", 0.4);
  bulto(g, 0, -330, 70, 74, "#ffe0c4", "#f0b898", "#d89878");
  g.fillStyle = "#4a2c1c";
  g.beginPath();
  g.ellipse(0, -370, 74, 46, 0, Math.PI, 0);
  g.fill();
  g.strokeStyle = "#6a3a28";
  g.lineWidth = 5;
  g.lineCap = "round";
  const ceja = o.preocupa || 0;
  g.beginPath();
  g.moveTo(-40, -340);
  g.quadraticCurveTo(-20, -352 - ceja * 12, -6, -332);
  g.moveTo(40, -340);
  g.quadraticCurveTo(20, -352 - ceja * 12, 6, -332);
  g.stroke();
  ojo(g, -24, -314, 12, t, { sem: 0.2, miraX: o.miraX || 0, miraY: 2 });
  ojo(g, 26, -314, 12, t, { sem: 0.9, miraX: o.miraX || 0, miraY: 2 });
  g.strokeStyle = "#a06050";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-16, -286);
  g.quadraticCurveTo(0, -276 + (o.habla || 0) * 8, 16, -286);
  g.stroke();
  g.restore();
}

export function cuenco(g, x, y, s, tipo) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.save();
  g.globalAlpha *= 0.3;
  g.fillStyle = "#6a3018";
  g.beginPath();
  g.ellipse(0, 18, 90, 18, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  bulto(g, 0, -10, 86, 36, tipo === "guiso" ? "#ffb15a" : "#4aa0e8", tipo === "guiso" ? "#e07020" : "#1d6ec4", "#8a4010");
  g.beginPath();
  g.ellipse(0, -28, 70, 28, 0, 0, Math.PI * 2);
  g.fillStyle = tipo === "guiso" ? "#c45018" : "#1660b0";
  g.fill();
  if (tipo === "guiso") {
    g.fillStyle = "#ffd27a";
    for (const [dx, dy] of [[-20, -30], [10, -36], [24, -22], [-8, -18]]) {
      g.beginPath();
      g.ellipse(dx, dy, 12, 8, 0, 0, Math.PI * 2);
      g.fill();
    }
  } else {
    g.fillStyle = "#c9843a";
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * 6.28;
      g.beginPath();
      g.ellipse(Math.cos(a) * 32, -30 + Math.sin(a) * 10, 10, 7, a, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.restore();
}

export function cocina(g, t) {
  const pared = g.createLinearGradient(0, 200, 0, 1100);
  pared.addColorStop(0, "#ffb067");
  pared.addColorStop(0.5, "#ffe0b4");
  pared.addColorStop(1, "#fff4e0");
  g.fillStyle = pared;
  g.fillRect(-600, -200, 2800, 1600);
  k.redondo(g, 1280, 380, 340, 460, 30);
  g.fillStyle = "#8fe06a";
  g.fill();
  const cielo = g.createLinearGradient(1280, 380, 1280, 700);
  cielo.addColorStop(0, "#7ad4ff");
  cielo.addColorStop(1, "#c8f0a0");
  g.fillStyle = cielo;
  g.fillRect(1300, 400, 300, 200);
  g.fillStyle = "#3aaa3c";
  g.fillRect(1300, 600, 300, 210);
  g.strokeStyle = "#fff6ea";
  g.lineWidth = 16;
  k.redondo(g, 1280, 380, 340, 460, 30);
  g.stroke();
  const suelo = g.createLinearGradient(0, 1100, 0, 1900);
  suelo.addColorStop(0, "#f0c48a");
  suelo.addColorStop(1, "#c4844a");
  g.fillStyle = suelo;
  g.fillRect(-800, 1180, 4000, 2200);
  g.save();
  g.globalAlpha *= 0.28;
  g.strokeStyle = "#a06830";
  g.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    g.beginPath();
    g.moveTo(-200, 1220 + i * 70);
    g.lineTo(2000, 1220 + i * 70);
    g.stroke();
  }
  g.restore();
  g.fillStyle = "#fff8f0";
  g.fillRect(180, 620, 520, 28);
  g.fillStyle = "#5a3a28";
  g.fillRect(200, 648, 16, 80);
  g.fillRect(660, 648, 16, 80);
  k.brillo(g, 1500, 560, 280, "255,220,140", 0.35);
  void t;
}

export function bosque(g, t) {
  const cielo = g.createLinearGradient(0, -200, 0, 1000);
  cielo.addColorStop(0, "#1c6a3a");
  cielo.addColorStop(0.4, "#8fd08a");
  cielo.addColorStop(1, "#e4f6c8");
  g.fillStyle = cielo;
  g.fillRect(-800, -600, 3600, 2000);
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const x of [300, 900, 1500]) {
    const lg = g.createLinearGradient(x, 0, x, 1100);
    lg.addColorStop(0, "rgba(255,244,180,0.28)");
    lg.addColorStop(1, "rgba(255,244,180,0)");
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(x - 30, -200);
    g.lineTo(x + 50, -200);
    g.lineTo(x + 140, 1100);
    g.lineTo(x - 80, 1100);
    g.fill();
  }
  g.restore();
  const troncos = [[180, 90], [520, 70], [980, 110], [1460, 80], [1900, 100]];
  for (const [x, w] of troncos) {
    g.fillStyle = "#6a4428";
    g.fillRect(x, 620, w, 620);
    g.fillStyle = "#8a5c34";
    g.fillRect(x, 620, w * 0.3, 620);
  }
  g.fillStyle = "#1f8a3a";
  for (const [x, y, rx] of [[200, 640, 220], [560, 600, 260], [1000, 560, 300], [1500, 620, 240], [1960, 640, 200]]) {
    g.beginPath();
    g.ellipse(x, y, rx, rx * 0.72, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#46c45a";
    g.beginPath();
    g.ellipse(x - 40, y - 30, rx * 0.55, rx * 0.4, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#146828";
    g.beginPath();
    g.ellipse(x + 50, y + 10, rx * 0.7, rx * 0.5, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#1f8a3a";
  }
  const suelo = g.createLinearGradient(0, 1100, 0, 1900);
  suelo.addColorStop(0, "#6aaa40");
  suelo.addColorStop(1, "#2a5a22");
  g.fillStyle = suelo;
  g.fillRect(-1200, 1120, 5000, 2600);
  for (let i = 0; i < 18; i++) {
    const x = 80 + i * 140;
    brizna(g, x, 1280 + (i % 3) * 40, 90 + (i % 4) * 20, 9, (i % 2 ? 20 : -16), i / 18, t, i);
  }
}

export function sofa(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.save();
  g.globalAlpha *= 0.3;
  g.fillStyle = "#142818";
  g.beginPath();
  g.ellipse(0, 40, 260, 28, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  k.redondo(g, -240, -120, 480, 200, 46);
  const sof = g.createLinearGradient(-240, -120, 240, 80);
  sof.addColorStop(0, "#0e8e86");
  sof.addColorStop(0.5, "#5ee0d4");
  sof.addColorStop(1, "#0a6a64");
  g.fillStyle = sof;
  g.fill();
  k.redondo(g, -250, -200, 70, 180, 30);
  g.fillStyle = "#14b8a8";
  g.fill();
  k.redondo(g, 180, -200, 70, 180, 30);
  g.fill();
  k.redondo(g, -160, -160, 150, 90, 28);
  g.fillStyle = "#fff2d8";
  g.fill();
  k.redondo(g, 10, -170, 150, 100, 28);
  g.fillStyle = "#ffe08a";
  g.fill();
  g.restore();
}

export function interrogante(g, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(280, 1080);
  g.scale(1.15, 1.15);
  g.lineJoin = "round";
  g.lineCap = "round";
  g.lineWidth = 54;
  g.strokeStyle = "#f4fff0";
  g.beginPath();
  g.arc(0, -150, 150, Math.PI * 1.15, Math.PI * 1.95);
  g.quadraticCurveTo(170, -40, 8, 40);
  g.stroke();
  g.lineWidth = 34;
  g.strokeStyle = "#67e030";
  g.beginPath();
  g.arc(0, -150, 150, Math.PI * 1.15, Math.PI * 1.95);
  g.quadraticCurveTo(170, -40, 8, 40);
  g.stroke();
  g.fillStyle = "#f4fff0";
  g.beginPath();
  g.arc(4, 130, 28, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#67e030";
  g.beginPath();
  g.arc(4, 130, 16, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function cruz(g, x, y, s, al) {
  if (al <= 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.beginPath();
  g.arc(0, 0, 54, 0, Math.PI * 2);
  g.fillStyle = "#13a36a";
  g.fill();
  g.fillStyle = "#f4fff8";
  g.fillRect(-12, -36, 24, 72);
  g.fillRect(-36, -12, 72, 24);
  g.restore();
}

