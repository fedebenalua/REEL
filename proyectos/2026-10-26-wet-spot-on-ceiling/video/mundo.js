// El techo mojado, el desván, la habitación, el patio y la casa. Lo que se repite, una sola vez.
import * as k from "#kit";
import { v } from "#voz";

const TAU = Math.PI * 2;
const azA = k.azar(26);
const GOTAS_SAL = Array.from({ length: 16 }, () => ({ a: azA() * TAU, v: 220 + azA() * 520, r: 7 + azA() * 14, g: 0.4 + azA() }));
const LLUVIA = Array.from({ length: 48 }, () => ({ x: azA(), y: azA(), v: 0.55 + azA() * 0.7, r: 5 + azA() * 7 }));
const AISLA = Array.from({ length: 22 }, () => ({ x: -700 + azA() * 1600, y: 150 + azA() * 70, r: 28 + azA() * 36 }));
const CESPED = Array.from({ length: 36 }, () => ({ x: -900 + azA() * 1800, h: 28 + azA() * 46, o: azA() * 5 }));
const BABAS = Array.from({ length: 9 }, () => ({ x: azA(), y: azA(), r: 0.15 + azA() * 0.28 }));

export function camara(g, c) {
  g.setTransform(c.s, 0, 0, c.s, 540 - c.x * c.s, 960 - c.y * c.s);
}
const mezCam = (a, b, u) => ({ x: k.mez(a.x, b.x, u), y: k.mez(a.y, b.y, u), s: Math.exp(k.mez(Math.log(a.s), Math.log(b.s), u)) });
export function ruta(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, k.suave(k.tramo(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}
export function velo(g, a = 0.9) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 60, 0, 680);
  gr.addColorStop(0, `rgba(10, 6, 8, ${a})`);
  gr.addColorStop(0.5, `rgba(10, 6, 8, ${a * 0.78})`);
  gr.addColorStop(1, "rgba(10, 6, 8, 0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 720);
  g.restore();
}
export function viñeta(g, a = 0.45) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 980, 420, 540, 980, 1200);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(20, 6, 8, ${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

function gota(g, x, y, r, al = 1) {
  if (al < 0.02 || r < 1.5) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.scale(0.82, 1.15);
  const gr = g.createRadialGradient(-r * 0.28, -r * 0.35, r * 0.05, 0, 0, r);
  gr.addColorStop(0, "rgba(236, 255, 255, 0.95)");
  gr.addColorStop(0.28, "rgba(90, 206, 236, 0.82)");
  gr.addColorStop(0.7, "rgba(16, 110, 176, 0.9)");
  gr.addColorStop(1, "rgba(6, 40, 80, 0.95)");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(0, -r * 1.25);
  g.bezierCurveTo(r, -r * 0.15, r * 0.85, r * 0.75, 0, r);
  g.bezierCurveTo(-r * 0.85, r * 0.75, -r, -r * 0.15, 0, -r * 1.25);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)";
  g.beginPath();
  g.ellipse(-r * 0.28, -r * 0.2, r * 0.16, r * 0.32, -0.6, 0, TAU);
  g.fill();
  g.restore();
}

function mano(g, x, y, s, rot, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(60, 16, 8, 0.28)";
  g.beginPath(); g.ellipse(6, 86, 54, 16, 0, 0, TAU); g.fill();
  const piel = g.createLinearGradient(-40, -100, 36, 80);
  piel.addColorStop(0, "#ffe6d4");
  piel.addColorStop(0.4, "#f6b08e");
  piel.addColorStop(1, "#c86b48");
  g.fillStyle = piel;
  const angs = [-0.5, -0.2, 0.06, 0.28];
  for (let i = 0; i < 4; i++) {
    g.save();
    g.translate(-30 + i * 21, -6);
    g.rotate(angs[i]);
    k.redondo(g, -11, -98, 22, 102, 11);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.38)";
    g.fillRect(-7, -86, 6, 30);
    g.fillStyle = piel;
    g.restore();
  }
  k.redondo(g, -46, -16, 96, 108, 40);
  g.fill();
  g.save();
  g.translate(44, 18);
  g.rotate(-1);
  k.redondo(g, -14, -20, 28, 74, 14);
  g.fill();
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.22)";
  g.beginPath(); g.ellipse(-10, 18, 20, 30, -0.4, 0, TAU); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- el techo, desde abajo
export function techoAbajo(g, t, faseFija) {
  const fase = faseFija !== undefined ? faseFija : Math.min(1, t / 1.55);
  const z = fase < 0 ? k.mez(0.74, 1, (fase + 0.42) / 0.42) : k.mez(1, 1.28, Math.min(1, fase));
  g.setTransform(z, 0, 0, z, 540 * (1 - z), 740 * (1 - z));
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#2a120e");
  fondo.addColorStop(0.45, "#6a3424");
  fondo.addColorStop(1, "#1a0c10");
  g.fillStyle = fondo;
  g.fillRect(-200, -200, 1500, 2300);
  // paredes en las esquinas: se entiende que es una habitación
  g.fillStyle = "#c4513a";
  g.beginPath(); g.moveTo(0, 980); g.lineTo(0, 1920); g.lineTo(220, 1920); g.closePath(); g.fill();
  g.fillStyle = "#e07a3c";
  g.beginPath(); g.moveTo(1080, 1040); g.lineTo(1080, 1920); g.lineTo(820, 1920); g.closePath(); g.fill();
  const lampara = g.createRadialGradient(540, 1680, 20, 540, 1680, 520);
  lampara.addColorStop(0, "rgba(255, 214, 140, 0.9)");
  lampara.addColorStop(1, "rgba(255, 160, 60, 0)");
  g.fillStyle = lampara;
  g.fillRect(0, 1200, 1080, 720);
  // el techo, cálido, nada blanco
  const techo = g.createLinearGradient(0, 200, 0, 1100);
  techo.addColorStop(0, "#4a241c");
  techo.addColorStop(0.35, "#a85a3c");
  techo.addColorStop(0.7, "#d4896a");
  techo.addColorStop(1, "#8a4030");
  g.fillStyle = techo;
  g.beginPath();
  g.moveTo(-100, -50);
  g.lineTo(1200, -50);
  g.lineTo(980, 1120);
  g.quadraticCurveTo(540, 1280, 100, 1120);
  g.closePath();
  g.fill();
  g.save();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -100, -80, 1400, 1400);
  g.restore();
  // junta de pladur
  g.strokeStyle = "rgba(90, 40, 28, 0.35)";
  g.lineWidth = 6;
  g.beginPath(); g.moveTo(540, 80); g.lineTo(540, 1100); g.moveTo(80, 640); g.lineTo(1000, 700); g.stroke();
  // la mancha: anillos de té
  const crece = fase < 0 ? k.mez(0.68, 0.92, (fase + 0.42) / 0.42) : k.mez(0.92, 1.22, Math.min(1, fase));
  const cx = 540, cy = 640;
  const anillos = ["#4a2414", "#8a4e22", "#c9843a", "#e8c27a", "#a86428"];
  for (let i = 0; i < anillos.length; i++) {
    const p = (anillos.length - i) / anillos.length;
    g.fillStyle = anillos[i];
    g.globalAlpha = 0.92;
    g.beginPath();
    g.ellipse(cx, cy, 460 * crece * p, 300 * crece * p, -0.08, 0, TAU);
    g.fill();
  }
  g.globalAlpha = 1;
  // brillo mojado, abajo del subtítulo
  g.save();
  g.globalCompositeOperation = "screen";
  const br = g.createRadialGradient(470, 760, 10, 500, 740, 260);
  br.addColorStop(0, `rgba(255, 236, 190, ${0.55 + 0.15 * Math.sin(t * 3)})`);
  br.addColorStop(1, "rgba(255, 236, 190, 0)");
  g.fillStyle = br;
  g.beginPath(); g.ellipse(cx, cy + 40, 300, 180, 0, 0, TAU); g.fill();
  g.restore();
  // la gota
  const yG = fase < 0 ? k.mez(700, 1000, (fase + 0.42) / 0.42) : k.mez(1000, 1360, fase);
  const rG = fase < 0 ? k.mez(28, 130, (fase + 0.42) / 0.42) : k.mez(130, 200, Math.min(1, fase * 1.15));
  if (fase < 0.08) {
    // todavía colgando del techo
    g.strokeStyle = "rgba(170, 220, 245, 0.8)";
    g.lineWidth = 8;
    g.beginPath(); g.moveTo(cx, cy + 40); g.lineTo(cx, yG - rG); g.stroke();
  }
  // estela: se ve que cae
  if (fase >= 0) {
    for (let i = 3; i >= 1; i--) gota(g, cx, yG - i * 36 * (0.4 + fase), rG * (0.7 - i * 0.12), 0.18);
  }
  if (fase < 0.98) gota(g, cx, yG, rG, 1);
  // el golpe
  if (faseFija === undefined && t >= 1.48 && t <= 2.38) {
    const dt = t - 1.52;
    const al = 1 - k.tramo(t, 1.9, 2.32);
    g.save();
    g.globalAlpha = al;
    g.strokeStyle = "rgba(190, 236, 255, 0.9)";
    g.lineWidth = 10;
    g.beginPath();
    g.ellipse(cx, 1340, 30 + dt * 420, 14 + dt * 90, 0, 0, TAU);
    g.stroke();
    g.restore();
    for (const s of GOTAS_SAL) {
      const x = cx + Math.cos(s.a) * s.v * dt;
      const y = 1320 + Math.sin(s.a) * s.v * dt * 0.45 + 780 * dt * dt;
      gota(g, x, y, s.r * (1 - dt * 0.25), al * s.g);
    }
  }
}

// ---------------------------------------------------------------- el corte del desván
function madera(g, x, y, w, h) {
  const gr = g.createLinearGradient(x, y, x, y + h);
  gr.addColorStop(0, "#e0b070");
  gr.addColorStop(0.3, "#c4843c");
  gr.addColorStop(0.7, "#a06228");
  gr.addColorStop(1, "#6a3a16");
  g.fillStyle = gr;
  k.redondo(g, x, y, w, h, 10);
  g.fill();
  g.strokeStyle = "rgba(90, 40, 12, 0.35)";
  g.lineWidth = 3;
  for (let i = 1; i < 5; i++) {
    g.beginPath();
    g.moveTo(x + 8, y + (h * i) / 5);
    g.bezierCurveTo(x + w * 0.3, y + (h * i) / 5 - 6, x + w * 0.6, y + (h * i) / 5 + 8, x + w - 8, y + (h * i) / 5);
    g.stroke();
  }
}

function corteAtico(g, t) {
  const f2 = v.frase(2), f3 = v.frase(3);
  const calma = k.tramo(t, 11.85, 12.2);
  const cam = ruta(t, [
    [2.42, { x: 40, y: 20, s: 3.5 }],
    [3.2, { x: -20, y: 10, s: 2.8 }],
    [f2.t("water"), { x: -60, y: 0, s: 2.6 }],
    [f2.t("wood"), { x: 168, y: 30, s: 4.1 }],
    [f2.t("first") + 0.15, { x: 168, y: 90, s: 2.8 }],
    [f3.t("dry"), { x: -140, y: -400, s: 0.56 }],
    [f3.t("conditioner"), { x: -640, y: -430, s: 1.12 }],
    [f3.t("slime"), { x: 20, y: -255, s: 1.85 }],
    [f3.t("drain"), { x: 40, y: -255, s: 2.05 }],
    [f3.t("pan"), { x: -560, y: -220, s: 1.25 }],
    [f3.t("spilling") + 0.2, { x: -400, y: -80, s: 1.05 }],
    [12.02, { x: -380, y: -70, s: 1.0 }],
  ]);
  camara(g, cam);
  // fondo del desván
  const bg = g.createLinearGradient(-800, -900, 600, 400);
  bg.addColorStop(0, "#3a2218");
  bg.addColorStop(0.5, "#6a3a28");
  bg.addColorStop(1, "#24140e");
  g.fillStyle = bg;
  g.fillRect(-2500, -2200, 5000, 4400);
  // cubierta seca y sol: el tejado no es el grifo
  madera(g, -900, -820, 1800, 70);
  g.fillStyle = "#2f86d0";
  k.redondo(g, 220, -980, 460, 200, 16);
  g.fill();
  const sol = g.createRadialGradient(400, -900, 10, 400, -900, 180);
  sol.addColorStop(0, "#fff4c8");
  sol.addColorStop(1, "rgba(255, 220, 120, 0)");
  g.fillStyle = sol;
  g.beginPath(); g.arc(400, -900, 180, 0, TAU); g.fill();
  g.save();
  g.globalCompositeOperation = "lighter";
  g.fillStyle = `rgba(255, 214, 150, ${0.16 + 0.04 * Math.sin(t)})`;
  g.beginPath();
  g.moveTo(280, -820); g.lineTo(520, -820); g.lineTo(260, 80); g.lineTo(-20, 80); g.closePath();
  g.fill();
  g.restore();
  // cabios
  g.strokeStyle = "#8a5428";
  g.lineWidth = 22;
  g.beginPath();
  g.moveTo(-800, -760); g.lineTo(0, -200);
  g.moveTo(900, -760); g.lineTo(80, -180);
  g.stroke();
  for (const a of AISLA) {
    g.fillStyle = (a.x > 0) ? "#f0a0c4" : "#f6c56a";
    g.beginPath(); g.ellipse(a.x, 250 + (a.y % 40), a.r, a.r * 0.62, 0, 0, TAU); g.fill();
  }
  // aparato
  const caja = g.createLinearGradient(-860, -680, -460, -240);
  caja.addColorStop(0, "#f4f7fb");
  caja.addColorStop(0.45, "#c5d0dc");
  caja.addColorStop(1, "#8ea0b4");
  g.fillStyle = caja;
  k.redondo(g, -880, -700, 440, 430, 22);
  g.fill();
  g.fillStyle = "#1c2836";
  k.redondo(g, -820, -640, 200, 250, 12);
  g.fill();
  // serpentín de cobre
  g.strokeStyle = "#e39a55";
  g.lineWidth = 8;
  for (let i = 0; i < 8; i++) {
    const y = -610 + i * 28;
    g.beginPath(); g.moveTo(-800, y); g.bezierCurveTo(-740, y - 10, -680, y + 12, -640, y); g.stroke();
    if (Math.sin(t * 3 + i) > 0.2) gota(g, -700 + (i % 3) * 18, y + 16 + ((t * 40 + i * 17) % 26), 7, 0.9);
  }
  // bandeja
  const panG = g.createLinearGradient(-860, -280, -400, -150);
  panG.addColorStop(0, "#d7dee8");
  panG.addColorStop(0.5, "#f7fbff");
  panG.addColorStop(1, "#8b98a8");
  g.fillStyle = panG;
  g.beginPath();
  g.moveTo(-860, -250); g.lineTo(-380, -250); g.lineTo(-340, -150); g.lineTo(-900, -150); g.closePath();
  g.fill();
  // agua en la bandeja
  const nivel = k.mez(-230, -175, k.suave(k.tramo(t, f3.inicio, f3.t("pan"))));
  g.fillStyle = "rgba(70, 180, 220, 0.75)";
  g.beginPath();
  g.moveTo(-850, -155); g.lineTo(-360, -160); g.lineTo(-370, nivel); g.lineTo(-840, nivel - 6); g.closePath();
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(-820, nivel, 420, 5);
  // tubo con la baba, arriba de la viga para no taparla
  g.fillStyle = "#f4f7fb";
  k.redondo(g, -300, -330, 560, 120, 48);
  g.fill();
  g.fillStyle = "#c5d0dc";
  g.fillRect(-300, -278, 540, 16);
  g.fillStyle = "#123044";
  k.redondo(g, -270, -312, 500, 84, 34);
  g.fill();
  const tapa = k.suave(k.tramo(t, f3.t("slime") - 0.2, f3.t("drain")));
  g.save();
  g.beginPath();
  k.redondo(g, -270, -312, 500, 84, 34);
  g.clip();
  g.fillStyle = "rgba(70, 190, 230, 0.85)";
  g.fillRect(-270, -290, 200 + 36 * Math.sin(t * 4), 62);
  const sx = 40;
  for (const b of BABAS) {
    const ox = Math.sin(t * 2.2 + b.x * 6) * 6;
    const gr = g.createRadialGradient(sx + b.x * 140 + ox, -270 + b.y * 40, 4, sx + b.x * 140, -268, 34 + b.r * 36);
    gr.addColorStop(0, "#ffd0c8");
    gr.addColorStop(0.5, "#ff6d8a");
    gr.addColorStop(1, "#e23d4a");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(sx + b.x * 150 + ox, -274 + b.y * 36, 28 + b.r * 36, 20 + b.r * 22, 0, 0, TAU);
    g.fill();
  }
  g.restore();
  // la viga
  madera(g, -560, -170, 1240, 380);
  const uB = k.suave(k.tramo(t, f2.t("water"), f2.t("wood")));
  const beadX = k.mez(-240, 168, uB);
  g.strokeStyle = "rgba(90, 200, 235, 0.95)";
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-360, -150);
  for (let x = -360; x <= beadX; x += 20) g.lineTo(x, -142 + Math.sin(x * 0.05 + t * 6) * 6);
  g.stroke();
  gota(g, beadX, -100, 42 + 6 * Math.sin(t * 5), t < f3.inicio ? 1 : 0.35);
  // el hilo que cae hacia el pladur en «first»
  const cae = k.tramo(t, f2.t("first"), f2.fin);
  if (cae > 0 && t < f3.t("conditioner")) {
    const y1 = k.mez(-80, 250, k.suave(cae));
    g.strokeStyle = "rgba(120, 210, 240, 0.85)";
    g.lineWidth = 10;
    g.beginPath(); g.moveTo(168, -90); g.lineTo(168, y1); g.stroke();
    gota(g, 168, y1, 22, 1);
  }
  // pladur
  g.fillStyle = "#f0d2c0";
  g.fillRect(-800, 230, 1700, 120);
  g.fillStyle = "#d8b49a";
  g.fillRect(-800, 230, 1700, 16);
  // mancha vista de canto
  g.fillStyle = "#a86428";
  g.beginPath(); g.ellipse(180, 348, 150, 28, 0, 0, TAU); g.fill();
  // el rebose, grande en «spilling», ya parado antes del corte
  const derrame = (1 - calma) * k.suave(k.tramo(t, f3.t("pan") - 0.15, f3.t("spilling")));
  if (derrame > 0.02) {
    g.save();
    g.globalAlpha = derrame;
    const hojaA = g.createLinearGradient(-360, -150, -300, 0);
    hojaA.addColorStop(0, "rgba(190, 240, 255, 0.15)");
    hojaA.addColorStop(0.4, "rgba(80, 190, 230, 0.75)");
    hojaA.addColorStop(1, "rgba(20, 90, 140, 0.2)");
    g.fillStyle = hojaA;
    g.beginPath();
    g.moveTo(-390, -150);
    g.lineTo(-330, -150);
    const onda = Math.sin(t * 8) * 16 * (1 - calma);
    g.quadraticCurveTo(-300 + onda, -40, -420, 10);
    g.lineTo(-500, 6);
    g.quadraticCurveTo(-430, -60, -390, -150);
    g.fill();
    gota(g, -450 + onda, 20, 18, derrame);
    g.restore();
  }
}

export function escenaTecho(g, t) {
  const u = k.suave(k.tramo(t, 2.42, 3.25));
  if (t < 3.25) {
    techoAbajo(g, t);
    if (u > 0.002) {
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.beginPath();
      g.arc(540, 640, k.mez(60, 1900, u), 0, TAU);
      g.clip();
      corteAtico(g, t);
      g.restore();
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      const rad = k.mez(60, 1900, u);
      g.strokeStyle = "#5c3a28";
      g.lineWidth = 22;
      g.beginPath(); g.arc(540, 640, rad, 0, TAU); g.stroke();
      g.strokeStyle = "rgba(255, 220, 180, 0.45)";
      g.lineWidth = 6;
      g.beginPath(); g.arc(540, 640, rad - 12, 0, TAU); g.stroke();
      g.restore();
    }
  } else corteAtico(g, t);
}

// ---------------------------------------------------------------- la habitación: el bulto y el termostato
export function escenaSeguro(g, t) {
  const f4 = v.frase(4), f5 = v.frase(5);
  const hincha = k.mez(0.62, 1, k.suave(k.tramo(t, f4.inicio, f4.t("bulge") + 0.25)));
  const calma = k.tramo(t, 20.05, 20.35);
  const cam = ruta(t, [
    [f4.inicio, { x: 0, y: 20, s: 1.05 }],
    [f4.t("bulge"), { x: 0, y: -20, s: 1.28 }],
    [f4.t("bulge") + 0.45, { x: 0, y: -10, s: 1.22 }],
    [f4.t("light"), { x: 360, y: -80, s: 1.45 }],
    [f4.t("touch"), { x: -460, y: 40, s: 1.4 }],
    [f4.fin - 0.05, { x: -420, y: 30, s: 1.25 }],
    [f5.inicio, { x: 40, y: 180, s: 1.15 }],
    [f5.t("off"), { x: 70, y: 250, s: 1.72 }],
    [f5.t("stops"), { x: 40, y: 160, s: 1.25 }],
    [20.1, { x: 30, y: 150, s: 1.18 }],
  ]);
  camara(g, cam);
  const bg = g.createLinearGradient(0, -700, 0, 800);
  bg.addColorStop(0, "#3a1c18");
  bg.addColorStop(0.4, "#c45a3c");
  bg.addColorStop(1, "#6a241c");
  g.fillStyle = bg;
  g.fillRect(-2000, -1600, 4000, 3200);
  g.save();
  g.globalAlpha = 0.12;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -800, -600, 1600, 1600);
  g.restore();
  // techo
  g.fillStyle = "#e7b89a";
  g.fillRect(-1100, -520, 2200, 300);
  g.fillStyle = "#f3d7c4";
  g.fillRect(-1100, -250, 2200, 28);
  // el bulto
  const fondo = k.mez(40, 360, hincha) + Math.sin(t * 2.2) * 8 * (1 - calma) * (t < f5.t("off") ? 1 : 0.2);
  g.save();
  g.beginPath();
  g.moveTo(-380, -230);
  g.bezierCurveTo(-300, fondo * 0.15, -160, fondo, 0, fondo);
  g.bezierCurveTo(160, fondo, 300, fondo * 0.15, 380, -230);
  g.closePath();
  const agua = g.createLinearGradient(0, -230, 0, fondo);
  agua.addColorStop(0, "rgba(255, 214, 150, 0.2)");
  agua.addColorStop(0.45, "rgba(232, 164, 70, 0.85)");
  agua.addColorStop(1, "rgba(150, 78, 24, 0.95)");
  g.fillStyle = agua;
  g.fill();
  g.strokeStyle = "#f6e2d2";
  g.lineWidth = 16;
  g.stroke();
  // grieta, sin agujero
  g.strokeStyle = "rgba(90, 30, 16, 0.55)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(-40, fondo * 0.45);
  g.quadraticCurveTo(10, fondo * 0.7, 30, fondo * 0.55);
  g.stroke();
  g.restore();
  // brillo del agua
  g.save();
  g.globalCompositeOperation = "screen";
  g.fillStyle = `rgba(255, 230, 180, ${0.25 + 0.08 * Math.sin(t * 3)})`;
  g.beginPath(); g.ellipse(-60, fondo * 0.45, 90, 40, -0.4, 0, TAU); g.fill();
  g.restore();
  // lámpara de techo con agua
  g.fillStyle = "#f4efe6";
  g.beginPath(); g.arc(420, -300, 54, 0, TAU); g.fill();
  g.fillStyle = "#f6e2a8";
  g.beginPath(); g.arc(420, -300, 34, 0, TAU); g.fill();
  g.fillStyle = "#c9a06a";
  g.fillRect(400, -360, 40, 60);
  const goteaLuz = t > f4.t("water") && t < f5.t("stops") + 0.3;
  if (goteaLuz) {
    const u = (t - f4.t("water")) % 0.7;
    gota(g, 450, -240 + u * 180, 14, 1 - u);
  }
  // interruptor, a un lado
  g.fillStyle = "#f7f1ea";
  k.redondo(g, -620, -20, 90, 130, 12);
  g.fill();
  g.fillStyle = "#d8c8b8";
  k.redondo(g, -598, 10, 46, 70, 8);
  g.fill();
  // la mano que no llega a tocarlo
  const acerca = k.tramo(t, f4.t("light"), f4.t("dont"));
  const huye = k.tramo(t, f4.t("dont"), f4.t("switch") + 0.15);
  const manoX = k.mez(-80, -430, k.suave(acerca)) + k.mez(0, 280, k.suave(huye));
  if (t > f4.t("light") - 0.05 && t < f5.inicio) mano(g, manoX, 200, 1.2, -0.2 + huye * 0.8, 1);
  // cubo, a un lado, no debajo
  const cubo = k.suave(k.tramo(t, f4.t("out"), f4.t("bulge")));
  if (cubo > 0.01) {
    g.save();
    g.globalAlpha = cubo;
    g.translate(k.mez(-700, -520, cubo), 470);
    g.fillStyle = "#e23b2f";
    g.beginPath();
    g.moveTo(-70, -20); g.lineTo(70, -20); g.lineTo(54, 90); g.lineTo(-54, 90); g.closePath();
    g.fill();
    g.strokeStyle = "#ffd0c8";
    g.lineWidth = 6;
    g.beginPath(); g.moveTo(-78, -8); g.lineTo(78, -8); g.stroke();
    g.strokeStyle = "#7a1c16";
    g.lineWidth = 8;
    g.beginPath(); g.arc(0, -30, 54, Math.PI, 0); g.stroke();
    g.restore();
  }
  // suelo: vacío debajo del bulto
  g.fillStyle = "#8d4a32";
  g.fillRect(-1200, 560, 2400, 400);
  g.fillStyle = "rgba(40, 16, 10, 0.35)";
  g.beginPath(); g.ellipse(0, 620, 180, 28, 0, 0, TAU); g.fill();
  // termostato
  g.fillStyle = "#fbfaf7";
  k.redondo(g, -40, 120, 230, 300, 28);
  g.fill();
  g.fillStyle = "#1c2430";
  k.redondo(g, -16, 148, 182, 150, 16);
  g.fill();
  const apagado = k.suave(k.tramo(t, f5.t("off") - 0.12, f5.t("off") + 0.2));
  g.save();
  g.globalAlpha = 1 - apagado;
  g.fillStyle = "#7ec8ff";
  g.font = "800 64px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("72", 74, 224);
  g.restore();
  g.save();
  g.globalAlpha = apagado;
  g.fillStyle = "#ffb15a";
  g.font = "800 72px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("OFF", 74, 224);
  g.restore();
  // dedo que pulsa
  if (t > f5.inicio - 0.05) {
    const pulsa = k.suave(k.tramo(t, f5.t("conditioner"), f5.t("off")));
    const fy = k.mez(640, 500, pulsa);
    mano(g, 150, fy, 1.15, -0.35, 1);
  }
  // la gota del bulto se acaba cuando se apaga
  if (t > f4.fin && t < f5.t("water") + 0.15) {
    const u = k.tramo(t, f5.t("stops") - 0.15, f5.t("water"));
    gota(g, 20, k.mez(fondo, 560, u), 16, 1 - calma);
  }
}

// ---------------------------------------------------------------- el patio: el tubo blanco
function tuboBlanco(g, x, y, w, h) {
  const gr = g.createLinearGradient(x, y, x, y + h);
  gr.addColorStop(0, "#ffffff");
  gr.addColorStop(0.45, "#d5dde6");
  gr.addColorStop(1, "#8b98a6");
  g.fillStyle = gr;
  k.redondo(g, x, y, w, h, h / 2);
  g.fill();
}

export function escenaPatio(g, t) {
  const f6 = v.frase(6), f7 = v.frase(7);
  const cam = ruta(t, [
    [f6.inicio, { x: 200, y: 240, s: 0.95 }],
    [f6.t("seal"), { x: 250, y: 340, s: 1.45 }],
    [f6.t("vac"), { x: 300, y: 360, s: 1.55 }],
    [f6.t("pipe"), { x: 280, y: 340, s: 1.4 }],
    [f6.t("pull"), { x: 360, y: 340, s: 1.5 }],
    [f6.t("out"), { x: 470, y: 320, s: 1.65 }],
    [f6.fin, { x: 440, y: 330, s: 1.45 }],
    [f7.t("hose"), { x: 180, y: 340, s: 1.2 }],
    [f7.t("later"), { x: 60, y: 80, s: 1.35 }],
    [f7.t("vinegar"), { x: 70, y: 40, s: 1.6 }],
    [f7.t("line"), { x: 80, y: 60, s: 1.45 }],
    [f7.t("bleach"), { x: 160, y: 200, s: 1.05 }],
    [30.85, { x: 150, y: 210, s: 1.02 }],
  ]);
  camara(g, cam);
  const cielo = g.createLinearGradient(0, -800, 0, 0);
  cielo.addColorStop(0, "#1768b0");
  cielo.addColorStop(1, "#7ec8ea");
  g.fillStyle = cielo;
  g.fillRect(-2000, -1600, 4000, 2000);
  // sol
  g.fillStyle = "#ffe9a8";
  g.beginPath(); g.arc(-600, -520, 90, 0, TAU); g.fill();
  // ladrillo
  for (let row = 0; row < 14; row++) {
    for (let col = -8; col < 14; col++) {
      const x = col * 78 + (row % 2) * 39;
      const y = -80 + row * 40;
      g.fillStyle = (col + row) % 3 === 0 ? "#d4654c" : "#b84332";
      g.fillRect(x, y, 72, 34);
    }
  }
  g.fillStyle = "#6d8a48";
  g.fillRect(-2000, 500, 5000, 800);
  for (const c of CESPED) {
    g.strokeStyle = c.h % 2 ? "#2f6a28" : "#8dce58";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(c.x, 520);
    g.quadraticCurveTo(c.x + Math.sin(t * 2 + c.o) * 10, 500 - c.h * 0.5, c.x + Math.sin(t * 2.4 + c.o) * 14, 490 - c.h);
    g.stroke();
  }
  // condensadora
  const uni = g.createLinearGradient(-460, 40, -80, 480);
  uni.addColorStop(0, "#f7fbff");
  uni.addColorStop(0.5, "#d5e2ee");
  uni.addColorStop(1, "#8aa0b4");
  g.fillStyle = uni;
  k.redondo(g, -480, 40, 340, 460, 18);
  g.fill();
  g.strokeStyle = "#5c6e80";
  g.lineWidth = 8;
  g.beginPath(); g.arc(-310, 200, 90, 0, TAU); g.stroke();
  g.strokeStyle = "#e39a55";
  g.lineWidth = 6;
  for (let i = 0; i < 4; i++) {
    g.beginPath(); g.arc(-310, 200, 20 + i * 18, 0.2 + t * 0.4, 1.2 + t * 0.4 + i); g.stroke();
  }
  // un solo tubo en L, blanco, con el registro arriba
  g.lineCap = "round";
  g.lineJoin = "round";
  g.strokeStyle = "#f7fbff";
  g.lineWidth = 74;
  g.beginPath();
  g.moveTo(-80, 90);
  g.lineTo(188, 90);
  g.quadraticCurveTo(228, 90, 228, 140);
  g.lineTo(228, 470);
  g.stroke();
  g.strokeStyle = "#b7c3d0";
  g.lineWidth = 16;
  g.beginPath();
  g.moveTo(-80, 112);
  g.lineTo(180, 112);
  g.quadraticCurveTo(206, 112, 206, 150);
  g.lineTo(206, 470);
  g.stroke();
  g.fillStyle = "#10202c";
  g.beginPath(); g.ellipse(228, 470, 24, 16, 0, 0, TAU); g.fill();
  // tapón del registro, en el tramo horizontal
  const abierto = k.suave(k.tramo(t, f7.t("later") - 0.1, f7.t("half")));
  g.save();
  g.translate(40, 90);
  g.fillStyle = "#9aa8b6";
  g.beginPath(); g.arc(0, 0, 40, 0, TAU); g.fill();
  g.fillStyle = abierto > 0.4 ? "#123044" : "#eef3f8";
  g.beginPath(); g.arc(abierto * 10, -abierto * 78, 30, 0, TAU); g.fill();
  g.strokeStyle = "#d5dee6";
  g.lineWidth = 6;
  g.stroke();
  g.restore();
  // la aspiradora
  const entraV = k.suave(k.tramo(t, f6.inicio + 0.1, f6.t("seal")));
  const vx = k.mez(860, 470, entraV);
  g.save();
  g.translate(vx, 300);
  g.fillStyle = "#e23a32";
  k.redondo(g, -110, -40, 220, 280, 24);
  g.fill();
  g.fillStyle = "#1b1f26";
  k.redondo(g, -120, -90, 240, 80, 16);
  g.fill();
  // ventana con la baba
  g.fillStyle = "rgba(210, 236, 246, 0.35)";
  k.redondo(g, -70, 20, 140, 160, 12);
  g.fill();
  const chupado = k.suave(k.tramo(t, f6.t("pull") - 0.05, f6.t("out")));
  if (chupado > 0.05) {
    g.fillStyle = "#ff6d8a";
    g.beginPath();
    g.ellipse(0, 150 - chupado * 40, 50, 28 + chupado * 36, 0, 0, TAU);
    g.fill();
    g.fillStyle = "#ffd0c4";
    g.beginPath(); g.ellipse(-16, 130 - chupado * 30, 14, 10, 0, 0, TAU); g.fill();
  }
  g.restore();
  // manguera de la aspiradora hasta el tubo
  const sella = k.suave(k.tramo(t, f6.t("seal"), f6.t("vac") + 0.2));
  const hx = k.mez(vx - 30, 228, sella);
  const hy = k.mez(260, 470, sella);
  g.strokeStyle = "#24282e";
  g.lineWidth = 34;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(vx - 20, 250);
  g.quadraticCurveTo((vx + hx) / 2, 180, hx, hy);
  g.stroke();
  g.fillStyle = "#1a1e24";
  g.beginPath(); g.ellipse(hx, hy, 36, 24, 0, 0, TAU); g.fill();
  g.strokeStyle = "#ff5a3c";
  g.lineWidth = 8;
  g.beginPath(); g.arc(hx, hy, 22, 0, TAU); g.stroke();
  // la baba viaja por la manguera
  if (t > f6.t("pull") - 0.1 && t < f6.t("out") + 0.2) {
    const u = k.suave(k.tramo(t, f6.t("pull"), f6.t("out")));
    const px = k.mez(228, vx, u);
    const py = k.mez(470, 280, u);
    for (let i = 0; i < 3; i++) {
      g.fillStyle = i === 0 ? "#ff6d8a" : "#ffb08a";
      g.beginPath();
      g.ellipse(px - i * 28 * u, py + i * 10, 26 - i * 4, 18, 0, 0, TAU);
      g.fill();
    }
  }
  // manguera de jardín, se deja en el suelo
  if (t > f7.inicio - 0.05 && t < f7.t("vinegar")) {
    const u = k.suave(k.tramo(t, f7.t("push"), f7.t("hose") + 0.25));
    g.strokeStyle = "#3caa45";
    g.lineWidth = 22;
    g.beginPath();
    g.moveTo(700, k.mez(200, 520, u));
    g.quadraticCurveTo(400, k.mez(180, 480, u), k.mez(220, 80, u), k.mez(360, 530, u));
    g.stroke();
    mano(g, k.mez(360, 120, u), k.mez(300, 460, u), 1.1, 0.6, 1);
  }
  // vinagre
  if (t > f7.t("later") - 0.15) {
    const al = k.suave(k.tramo(t, f7.t("later") - 0.1, f7.t("half")));
    const vierte = k.tramo(t, f7.t("vinegar") - 0.15, f7.t("line"));
    const para = k.tramo(t, f7.t("line"), f7.t("never"));
    g.save();
    g.globalAlpha = al;
    g.translate(150, k.mez(-80, -20, k.suave(vierte)) + para * 30);
    g.rotate(k.mez(0, 0.7, k.suave(vierte)) * (1 - para));
    g.fillStyle = "rgba(214, 236, 246, 0.55)";
    k.redondo(g, -36, -70, 72, 150, 16);
    g.fill();
    g.fillStyle = "#e6b84a";
    g.fillRect(-30, -10, 60, 80);
    g.fillStyle = "#f4f7fb";
    g.fillRect(-24, 0, 48, 36);
    g.fillStyle = "#c0392b";
    g.fillRect(-16, -86, 32, 22);
    g.restore();
    if (vierte > 0.2 && para < 0.8) {
      g.strokeStyle = "rgba(230, 184, 74, 0.9)";
      g.lineWidth = 8;
      g.beginPath(); g.moveTo(80, 20); g.lineTo(40, 90); g.stroke();
    }
  }
  // lejía, tapada, al suelo
  if (t > f7.t("never") - 0.1) {
    const u = k.suave(k.tramo(t, f7.t("never"), f7.t("bleach") + 0.35));
    g.save();
    g.translate(k.mez(380, 300, u), k.mez(80, 430, u));
    g.fillStyle = "#f7f7f5";
    k.redondo(g, -40, -70, 80, 130, 12);
    g.fill();
    g.fillStyle = "#2f6fed";
    g.fillRect(-40, -20, 80, 28);
    g.fillStyle = "#f2c14e";
    g.beginPath(); g.moveTo(0, 10); g.lineTo(18, 42); g.lineTo(-18, 42); g.closePath(); g.fill();
    g.fillStyle = "#1d4e89";
    g.fillRect(-22, -88, 44, 24);
    g.restore();
    if (u < 0.95) mano(g, k.mez(460, 360, u), k.mez(160, 360, u), 1, 0.4, 1 - u * 0.3);
  }
  // un goteo limpio, ya caído antes del corte
  if (t > f7.t("bleach")) {
    const u = k.tramo(t, f7.t("bleach"), 30.7);
    const y = k.mez(430, 560, k.suave(Math.min(1, u)));
    if (u < 1) gota(g, 228, y, 14, 1);
    else {
      g.fillStyle = "rgba(80, 170, 210, 0.85)";
      g.beginPath(); g.ellipse(228, 530, 18, 7, 0, 0, TAU); g.fill();
    }
  }
}

// ---------------------------------------------------------------- lluvia, baño, combado, la escalera en el suelo
export function escenaCasa(g, t) {
  const f = v.frase(8);
  const cam = ruta(t, [
    [f.inicio, { x: -500, y: -220, s: 1.45 }],
    [f.t("rain") + 0.4, { x: -490, y: -160, s: 1.55 }],
    [f.t("bathroom") - 0.05, { x: 40, y: -60, s: 1.55 }],
    [f.t("bathroom") + 0.45, { x: 40, y: -20, s: 1.62 }],
    [f.t("sagging"), { x: 500, y: 80, s: 1.7 }],
    [f.t("sagging") + 0.45, { x: 500, y: 110, s: 1.75 }],
    [f.t("stay"), { x: 160, y: 200, s: 0.68 }],
    [f.t("roof"), { x: 0, y: 340, s: 1.25 }],
    [f.t("roof") + 0.32, { x: 20, y: 360, s: 1.32 }],
    [f.t("pro"), { x: 660, y: 280, s: 1.85 }],
    [36.5, { x: 660, y: 270, s: 1.8 }],
  ]);
  camara(g, cam);
  const cielo = g.createLinearGradient(0, -800, 0, -200);
  cielo.addColorStop(0, "#243044");
  cielo.addColorStop(1, "#6a90b0");
  g.fillStyle = cielo;
  g.fillRect(-2200, -1400, 4400, 1200);
  // lluvia solo sobre el tejado izquierdo
  g.save();
  for (const d of LLUVIA) {
    const x = -900 + d.x * 700;
    const y = -700 + ((d.y + t * d.v) % 1) * 600;
    gota(g, x, y, d.r, 0.85);
  }
  g.restore();
  // casa
  g.fillStyle = "#f0a06a";
  g.fillRect(-860, -80, 1720, 520);
  g.fillStyle = "#c96b45";
  g.fillRect(-860, -80, 1720, 18);
  // tejado
  g.fillStyle = "#8d3b32";
  g.beginPath();
  g.moveTo(-960, -60);
  g.lineTo(0, -560);
  g.lineTo(960, -60);
  g.closePath();
  g.fill();
  g.fillStyle = "#5c241c";
  for (let i = 0; i < 8; i++) {
    g.beginPath();
    g.moveTo(-900 + i * 120, -80 + i * 8);
    g.lineTo(-780 + i * 110, -200 - i * 20);
    g.lineWidth = 10;
    g.strokeStyle = "rgba(40,10,8,0.25)";
    g.stroke();
  }
  // tres techos interiores
  g.fillStyle = "#f3d7c4";
  g.fillRect(-800, 40, 1500, 36);
  // bahía de la lluvia: mancha
  g.fillStyle = "#a86428";
  g.beginPath(); g.ellipse(-480, 78, 120, 26, 0, 0, TAU); g.fill();
  if (t < f.t("bathroom") + 0.2) gota(g, -480, 90 + ((t * 80) % 70), 12, 1);
  // baño: ducha grande, el agua cruza el suelo y mancha el techo de abajo
  g.fillStyle = "#dfeaf2";
  k.redondo(g, -70, -150, 280, 120, 28);
  g.fill();
  g.fillStyle = "rgba(70, 170, 220, 0.6)";
  g.fillRect(-40, -120, 220, 70);
  g.strokeStyle = "#f4f8fb";
  g.lineWidth = 16;
  g.beginPath(); g.moveTo(70, -340); g.lineTo(70, -210); g.stroke();
  g.fillStyle = "#f7fbff";
  g.beginPath(); g.ellipse(70, -200, 70, 22, 0, 0, TAU); g.fill();
  g.fillStyle = "#c5d4e0";
  for (let i = -3; i <= 3; i++) {
    g.beginPath(); g.arc(70 + i * 16, -200, 4, 0, TAU); g.fill();
  }
  if (t > f.t("under") - 0.15 && t < f.t("still") + 0.2) {
    for (let i = 0; i < 7; i++) {
      const y = -180 + ((t * 1.6 + i * 0.13) % 1) * 200;
      gota(g, 30 + i * 16, y, 9, 0.95);
    }
  }
  g.fillStyle = "#8a4e22";
  g.beginPath(); g.ellipse(70, 90, 130, 28, 0, 0, TAU); g.fill();
  g.fillStyle = "rgba(90, 190, 230, 0.55)";
  g.beginPath(); g.ellipse(70, 78, 70, 10, 0, 0, TAU); g.fill();
  // combado
  const sag = k.mez(0.3, 1, k.suave(k.tramo(t, f.t("still"), f.t("sagging") + 0.25)));
  g.fillStyle = "#e7b89a";
  g.beginPath();
  g.moveTo(300, 70);
  g.quadraticCurveTo(500, 70 + 220 * sag, 700, 70);
  g.lineTo(700, 40);
  g.lineTo(300, 40);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(200, 120, 40, 0.85)";
  g.beginPath();
  g.moveTo(340, 70);
  g.quadraticCurveTo(500, 60 + 200 * sag, 660, 70);
  g.lineTo(640, 78);
  g.quadraticCurveTo(500, 70 + 160 * sag, 360, 78);
  g.closePath();
  g.fill();
  // suelo y escalera tumbada
  g.fillStyle = "#6f8f48";
  g.fillRect(-1400, 460, 3000, 500);
  g.save();
  g.translate(-80, 520);
  g.rotate(-0.08);
  g.strokeStyle = "#d5dee8";
  g.lineWidth = 14;
  g.strokeRect(-260, -16, 520, 32);
  for (let i = 0; i < 8; i++) {
    g.beginPath();
    g.moveTo(-230 + i * 60, -16);
    g.lineTo(-230 + i * 60, 16);
    g.stroke();
  }
  g.restore();
  // puerta y el profesional, en el suelo, no en el tejado
  g.fillStyle = "#6a3418";
  k.redondo(g, 760, 160, 150, 300, 8);
  g.fill();
  g.fillStyle = "#c9843c";
  k.redondo(g, 780, 180, 110, 250, 6);
  g.fill();
  if (t > f.t("call") - 0.15) {
    const al = k.suave(k.tramo(t, f.t("call"), f.t("pro")));
    g.save();
    g.globalAlpha = al;
    g.translate(660, 250);
    g.fillStyle = "#17867a";
    k.redondo(g, -110, -30, 220, 250, 28);
    g.fill();
    g.fillStyle = "#f2b294";
    g.beginPath(); g.arc(0, -90, 52, 0, TAU); g.fill();
    g.fillStyle = "#1d4e89";
    g.fillRect(-64, -150, 128, 42);
    g.fillRect(-8, -156, 100, 20);
    g.fillStyle = "#f4c14e";
    k.redondo(g, 80, 10, 110, 40, 12);
    g.fill();
    g.fillStyle = "#fff4c4";
    g.beginPath(); g.arc(196, 30, 16, 0, TAU); g.fill();
    g.restore();
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = 0.45 * al;
    g.fillStyle = "#ffe7a0";
    g.beginPath();
    g.moveTo(860, 280);
    g.lineTo(1120, 40);
    g.lineTo(1200, 140);
    g.closePath();
    g.fill();
    g.restore();
  }
}

export function escenaCierre(g, t) {
  const f = v.frase(9);
  const fase = k.mez(-0.42, 0, k.tramo(t, f.inicio, Math.max(f.inicio + 0.2, v.duracion - 0.02)));
  techoAbajo(g, t, fase);
}
