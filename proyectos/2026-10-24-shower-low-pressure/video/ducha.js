// La alcachofa, el brazo y el tubo por dentro. La misma pieza en todos los planos.
import * as k from "#kit";
import { arco, chorro, cromo, gota, guante, pared, salpicar, suelo, telefono } from "./mundo.js";

const rnd = k.azar(4);
function anillo(n, rad, tapa) {
  const o = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rad * 0.01;
    o.push({ x: Math.cos(a) * rad, y: Math.sin(a) * rad * 0.78, r: 6.5, tapa: tapa(i), f: rnd(), abierto: tapa(i) < 0.4 });
  }
  return o;
}
export const TOBERAS = [
  ...anillo(8, 48, (i) => (i === 3 ? 0.12 : 1)),
  ...anillo(12, 96, (i) => (i === 1 || i === 7 ? 0.15 : 0.94)),
  ...anillo(16, 148, (i) => (i % 6 === 2 ? 0.2 : 1)),
];
export const FOCO = TOBERAS.find((n) => n.tapa > 0.9 && n.y > 20) || TOBERAS[10];

const rr = k.azar(9);
export const GRUMOS = Array.from({ length: 22 }, () => {
  const a = rr() * 6.28, d = 20 + rr() * 140;
  return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.78, r: 7 + rr() * 13 };
});

export function costraEn(g, x, y, rad, al) {
  if (al < 0.04) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "#f4f0e4";
  g.beginPath();
  g.arc(0, 0, rad, 0, 6.28);
  g.fill();
  g.fillStyle = "#d9d2c2";
  g.beginPath();
  g.arc(rad * 0.28, rad * 0.18, rad * 0.62, 0, 6.28);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.8)";
  g.beginPath();
  g.arc(-rad * 0.25, -rad * 0.3, rad * 0.28, 0, 6.28);
  g.fill();
  g.restore();
}

// Alcachofa en tres cuartos: el racor arriba, la campana, y la cara con los agujeros abajo.
export function cara(g, t, o = {}) {
  const costra = o.costra ?? 1, chorroN = o.chorro ?? 0, goteo = o.goteo ?? 0, oro = o.oro ?? 0, calido = o.calido ?? 0;
  g.save();
  g.translate(o.x || 0, o.y || 0);
  g.scale(o.esc || 1, o.esc || 1);

  g.beginPath();
  g.moveTo(-28, -340);
  g.lineTo(-34, -210);
  g.bezierCurveTo(-40, -150, -70, -90, -150, -20);
  g.quadraticCurveTo(-210, 40, -188, 78);
  g.lineTo(188, 78);
  g.quadraticCurveTo(210, 40, 150, -20);
  g.bezierCurveTo(70, -90, 40, -150, 34, -210);
  g.lineTo(28, -340);
  g.closePath();
  g.fillStyle = cromo(g, -200, -300, 200, 80, oro);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.fillRect(-6, -330, 9, 280);

  g.save();
  g.translate(0, 70);
  g.rotate(o.giro || 0);
  g.translate(0, -70);
  g.beginPath();
  g.ellipse(0, 70, 176, 78, 0, 0, 6.28);
  g.fillStyle = k.mezColor("#121920", "#3a2a14", oro);
  g.fill();
  g.strokeStyle = k.mezColor("#d5dee6", "#f0d48a", oro);
  g.lineWidth = 10;
  g.stroke();

  if (chorroN > 0.04) {
    g.save();
    g.globalAlpha *= 0.92;
    const largo = 80 + 560 * chorroN;
    g.beginPath();
    for (const n of TOBERAS) {
      const abierto = Math.max(0.35, 1 - costra * n.tapa);
      const x = n.x, y = 70 + n.y * 0.35;
      const w = 4 + 3 * abierto;
      const x2 = n.x * 1.15;
      g.moveTo(x - w, y);
      g.lineTo(x + w, y);
      g.lineTo(x2 + w * 1.6, y + largo);
      g.lineTo(x2 - w * 1.6, y + largo);
      g.closePath();
    }
    g.fillStyle = calido > 0.4 ? "rgba(255, 176, 96, 0.88)" : "rgba(70, 176, 255, 0.9)";
    g.fill();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = "rgba(230, 250, 255, 0.35)";
    g.fill();
    g.restore();
  }

  for (const n of TOBERAS) {
    const x = n.x, y = 70 + n.y * 0.35;
    const abierto = 1 - costra * n.tapa;
    g.beginPath();
    g.ellipse(x, y, n.r, n.r * 0.72, 0, 0, 6.28);
    g.fillStyle = "#061018";
    g.fill();
    if (costra * n.tapa > 0.08) costraEn(g, x, y, n.r * 1.7, Math.min(1, costra * n.tapa));
    if (chorroN < 0.04 && goteo > 0.04 && abierto > 0.55) {
      chorro(g, x, y + 6, y + 460, 7, t + n.f, goteo, calido);
    } else if (chorroN < 0.04 && goteo > 0.04 && n.tapa > 0.8 && n.f > 0.45) {
      const p = (t * 0.5 + n.f) % 1;
      if (p < 0.55) gota(g, x, y + 10 + p * 16, 6 + p * 7, goteo);
      else gota(g, x + Math.sin(n.f * 6) * 8, y + 24 + (p - 0.55) * 640, 10, goteo * (1 - (p - 0.55) / 0.45));
    }
  }
  for (const u of GRUMOS) costraEn(g, u.x, 70 + u.y * 0.35, u.r, costra * 0.8);

  if (o.lavado > 0.04) {
    g.save();
    g.globalAlpha *= 0.55 * o.lavado;
    g.fillStyle = "#e8b423";
    g.beginPath();
    g.ellipse(0, 70 + (o.lavadoY || 0) * 0.4, 150, 28, 0, 0, 6.28);
    g.fill();
    g.restore();
  }
  g.restore();
  g.restore();
}

// De lado: el racor arriba y los agujeros abajo, para el bol.
export function lado(g, t, o = {}) {
  const costra = o.costra ?? 1, oro = o.oro ?? 0, esc = o.esc || 1;
  g.save();
  g.translate(o.x || 0, o.y || 0);
  g.scale(esc, esc);
  g.beginPath();
  g.moveTo(-26, -150);
  g.lineTo(-32, -90);
  g.bezierCurveTo(-150, -70, -175, 10, -150, 48);
  g.lineTo(-132, 78);
  g.lineTo(132, 78);
  g.lineTo(150, 48);
  g.bezierCurveTo(175, 10, 150, -70, 32, -90);
  g.lineTo(26, -150);
  g.closePath();
  g.fillStyle = oro > 0.55 ? "#e2a020" : cromo(g, -170, 0, 170, 0, oro);
  if (oro > 0.55) {
    const gg = g.createLinearGradient(-170, 0, 170, 0);
    gg.addColorStop(0, "#8a5a08");
    gg.addColorStop(0.35, "#ffe08a");
    gg.addColorStop(0.6, "#f0b020");
    gg.addColorStop(1, "#6a3c04");
    g.fillStyle = gg;
  }
  g.fill();
  k.redondo(g, -34, -176, 68, 40, 12);
  g.fillStyle = cromo(g, -34, -176, 34, -136, oro);
  g.fill();
  g.fillStyle = "#1a120c";
  for (let i = -3; i <= 3; i++) {
    g.fillRect(-22 + (i + 3) * 6, -168, 3, 22);
  }
  g.fillStyle = "#10161c";
  k.redondo(g, -140, 52, 280, 36, 12);
  g.fill();
  for (let i = 0; i < 7; i++) {
    const x = -105 + i * 35;
    g.beginPath();
    g.arc(x, 70, 8, 0, 6.28);
    g.fillStyle = "#070b10";
    g.fill();
    costraEn(g, x, 74, 12, costra * (i % 4 === 0 ? 0.45 : 1));
  }
  g.fillStyle = "rgba(255,255,255,0.28)";
  k.redondo(g, -20, -80, 16, 140, 8);
  g.fill();
  if ((o.burbujas || 0) > 0.05) {
    for (let i = 0; i < 7; i++) {
      const p = (t * 0.7 + i * 0.17) % 1;
      const x = -105 + i * 35;
      g.beginPath();
      g.arc(x + Math.sin(t * 3 + i) * 6, 78 - p * 150, 4 + (1 - p) * 5, 0, 6.28);
      g.strokeStyle = `rgba(255,255,255,${0.65 * (1 - p) * o.burbujas})`;
      g.lineWidth = 2;
      g.stroke();
    }
  }
  g.restore();
}

function brazo(g, oro = 0) {
  k.redondo(g, -46, -640, 92, 500, 36);
  g.fillStyle = cromo(g, -46, -640, 46, -140, oro);
  g.fill();
  g.beginPath();
  g.ellipse(0, -630, 70, 28, 0, 0, 6.28);
  g.fillStyle = cromo(g, -70, -650, 70, -610, oro);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(-8, -620, 10, 460);
}

function rosca(g, al) {
  if (al < 0.05) return;
  g.save();
  g.globalAlpha *= al;
  g.fillStyle = "#c5ced6";
  k.redondo(g, -22, -150, 44, 36, 6);
  g.fill();
  g.strokeStyle = "#6a7680";
  g.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.moveTo(-20, -142 + i * 8);
    g.lineTo(20, -136 + i * 8);
    g.stroke();
  }
  g.restore();
}

function trapo(g, al) {
  if (al < 0.04) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(0, -340);
  g.fillStyle = "#148a86";
  g.beginPath();
  g.ellipse(0, 0, 86, 32, 0.15, 0, 6.28);
  g.fill();
  g.fillStyle = "#b8fff4";
  g.beginPath();
  g.ellipse(-24, -8, 34, 16, -0.5, 0, 6.28);
  g.fill();
  g.fillStyle = "#0e6a66";
  g.beginPath();
  g.ellipse(30, 8, 28, 12, 0.4, 0, 6.28);
  g.fill();
  g.restore();
}

export function palanca(g, x, y, u, esc = 1) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.beginPath();
  g.arc(0, 0, 54, 0, 6.28);
  g.fillStyle = cromo(g, -54, -54, 54, 54, 0);
  g.fill();
  g.strokeStyle = "#2f6fe0";
  g.lineWidth = 10;
  g.beginPath();
  g.arc(0, 0, 40, Math.PI * 0.55, Math.PI * 1.15);
  g.stroke();
  g.strokeStyle = "#e23b32";
  g.beginPath();
  g.arc(0, 0, 40, -1.15, -0.15);
  g.stroke();
  const ang = k.mez(1.35, -0.85, u);
  g.rotate(ang);
  k.redondo(g, -12, -78, 24, 92, 12);
  g.fillStyle = "#e8eef2";
  g.fill();
  g.beginPath();
  g.arc(0, -78, 16, 0, 6.28);
  g.fillStyle = u > 0.65 ? "#e23b32" : "#d0d8e0";
  g.fill();
  g.restore();
}

function cortina(g, t) {
  g.save();
  g.beginPath();
  g.moveTo(300, -900);
  for (let y = -900; y <= 900; y += 36) g.lineTo(330 + Math.sin(y * 0.018 + t * 0.8) * 26, y);
  g.lineTo(620, 900);
  g.lineTo(620, -900);
  g.closePath();
  const gr = g.createLinearGradient(300, 0, 620, 0);
  gr.addColorStop(0, "#e9fbff");
  gr.addColorStop(0.45, "#b8eef4");
  gr.addColorStop(1, "#7ed4de");
  g.fillStyle = gr;
  g.fill();
  g.strokeStyle = "rgba(10, 80, 90, 0.18)";
  g.lineWidth = 4;
  for (let x = 360; x <= 560; x += 48) { g.beginPath(); g.moveTo(x, -900); g.lineTo(x + 10, 900); g.stroke(); }
  g.restore();
}

// La ducha entera. o manda costra, chorro, goteo, palanca (0-1), giro, suelta, giroBrazo, trapo, guantes, oro, lavado, calido, telefono, flecha, sentido.
export function ducha(g, t, o = {}) {
  const suelta = o.suelta || 0;
  const giro = o.giro || 0;
  const giroBrazo = o.giroBrazo || 0;
  const hy = 24 + suelta * 250;
  pared(g, "bano");
  cortina(g, t);
  suelo(g, 560, "#0b646c");
  g.fillStyle = "rgba(8,40,70,0.45)";
  g.beginPath();
  g.ellipse(0, 640, 220, 36, 0, 0, 6.28);
  g.fill();
  palanca(g, -250, 150, o.palanca ?? 1, 1.15);

  g.save();
  g.translate(0, -630);
  g.rotate(giroBrazo);
  g.translate(0, 630);
  brazo(g, 0);
  rosca(g, suelta);
  trapo(g, o.trapo || 0);
  if ((o.guanteFijo || 0) > 0.04) guante(g, -78, -300, 0.55, 1.05, o.guanteFijo);
  g.restore();

  cara(g, t, {
    x: Math.sin(giro) * 8,
    y: hy,
    giro,
    esc: 1.05,
    costra: o.costra ?? 1,
    chorro: o.chorro || 0,
    goteo: o.goteo ?? 0,
    oro: o.oro || 0,
    lavado: o.lavado || 0,
    lavadoY: o.lavadoY || 0,
    calido: o.calido || 0,
  });
  if ((o.guanteGiro || 0) > 0.04) guante(g, 168, hy + 10, 0.9 + giro * 0.15, 1.15, o.guanteGiro);
  if ((o.flecha || 0) > 0.04) arco(g, 10, hy, 250, o.flecha, o.sentido || -1);
  if ((o.telefono || 0) > 0.04) telefono(g, 390, 470, o.telefono, 1.05);
  if ((o.chorro || 0) > 0.4) salpicar(g, 0, 620, t, o.chorro, 1.4);
}

// Dentro del tubo, a pantalla completa. acerca 0.5 es el fotograma 0: la cal ya está grande.
export function tubo(g, t, acerca) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#071018";
  g.fillRect(0, 0, 1080, 1920);
  const cx = 540, cy = 1040;
  for (let i = 8; i >= 0; i--) {
    const z = (i + 1) / 9;
    const rad = (70 + z * 560) * (0.82 + acerca * 0.22);
    g.strokeStyle = `rgba(190, 220, 235, ${0.04 + z * 0.1})`;
    g.lineWidth = 10;
    g.beginPath();
    g.ellipse(cx, cy, rad * 0.94, rad, 0, 0, 6.28);
    g.stroke();
  }
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * 6.28;
    const p = (t * 1.45 + i * 0.13) % 1;
    const rad = (1 - p) * 620 + 80;
    const r1 = rad + 70 + p * 40;
    g.strokeStyle = `rgba(150, 220, 255, ${0.15 + p * 0.45})`;
    g.lineWidth = 8 + p * 10;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    g.stroke();
  }
  g.globalCompositeOperation = "source-over";
  const R = 168 * (0.85 + acerca * 1.15);
  const gr = g.createRadialGradient(cx - R * 0.2, cy - R * 0.3, R * 0.1, cx, cy, R);
  gr.addColorStop(0, "#fffaf0");
  gr.addColorStop(0.55, "#e6dfd0");
  gr.addColorStop(1, "#b7ad9c");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(cx, cy, R, 0, 6.28);
  g.fill();
  const esc = R / 200;
  for (const n of TOBERAS) {
    const x = cx + n.x * esc, y = cy + n.y * esc;
    g.beginPath();
    g.arc(x, y, n.r * esc * 0.85, 0, 6.28);
    g.fillStyle = "#16324a";
    g.fill();
    if (n.tapa > 0.5) costraEn(g, x, y, n.r * esc * 1.15, 0.95);
  }
  for (const u of GRUMOS) costraEn(g, cx + u.x * esc, cy + u.y * esc, u.r * esc, 0.9);
  if (acerca > 0.82) {
    const p = (t * 2) % 1;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * 6.28 + 0.3;
      const rad = 40 + p * 280;
      gota(g, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 10 + (1 - p) * 8, (1 - p) * (acerca - 0.82) * 4);
    }
  }
  g.restore();
}
