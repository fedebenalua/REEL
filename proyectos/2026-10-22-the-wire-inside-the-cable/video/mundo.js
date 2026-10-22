// El salón: la tele, la barra, el cable y el mando. La cámara entra en el cable y el cuarto vuelve a 1950
// delante de ella. Todo sale de t.
import * as k from "#kit";
import { v } from "#voz";

const f = (n) => v.frase(n);
const f1 = f(1), f2 = f(2), f3 = f(3), f4 = f(4), f5 = f(5);
const f6 = f(6), f7 = f(7), f8 = f(8), f9 = f(9), f10 = f(10);
const f11 = f(11), f12 = f(12), f13 = f(13);

export const TV = { x: 0, y: 30, w: 780, h: 440 };
export const BAR = { x: 0, y: 430, w: 720, h: 168 };
export const SENSOR = { x: 0, y: 232 };
const MANDO = { x: -430, y: 150 };

const azP = k.azar(19);
const PINES = [];
for (let i = 0; i < 10; i++) PINES.push({ n: 1 + i * 2, x: -28 + i * 6.2, y: -5.2 });
for (let i = 0; i < 9; i++) PINES.push({ n: 2 + i * 2, x: -24.8 + i * 6.2, y: 5.2 });
const VENTANAS = Array.from({ length: 28 }, () => ({ x: 80 + azP() * 520, y: 70 + azP() * 180, w: 10 + azP() * 16, h: 14 + azP() * 22, p: azP() * 6 }));

export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);

export function velo(g, al = 0.72) {
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 140, 0, 760);
  vg.addColorStop(0, `rgba(6,8,16,${al})`);
  vg.addColorStop(0.55, `rgba(6,8,16,${al * 0.55})`);
  vg.addColorStop(1, "rgba(6,8,16,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 780);
  g.restore();
}

function camDe(claves) {
  const Z = k.curva(claves.map(([t, c]) => [t, Math.log(c[0])]), -1.6, 0);
  const X = k.curva(claves.map(([t, c]) => [t, c[1]]), 0, 0);
  const Y = k.curva(claves.map(([t, c]) => [t, c[2]]), 0, 0);
  return (t) => [Math.exp(Z(t)), X(t), Y(t)];
}

// La apertura sale deprisa del cono (entra: arranca rápido). Luego la spline no se para entre frases.
const salida = (t) => {
  const u = k.entra(k.tramo(t, 0, 1.42));
  return [k.mez(4.8, 0.86, u), k.mez(0, -20, u), k.mez(BAR.y, 340, u)];
};
const resto = camDe([
  [1.42, [0.86, -20, 340]],
  [f1.t("never"), [0.98, -60, 300]],
  [f1.fin, [0.98, -40, 280]],
  [f2.t("light"), [1.35, -160, 190]],
  [f2.t("tv"), [2.4, -10, 200]],
  [f2.t("stops"), [4.4, 0, 232]],
  [f2.fin, [4.1, 0, 232]],
  [f3.t("who"), [2.4, 0, 270]],
  [f3.fin, [1.85, 0, 310]],
  [f4.t("runs"), [4.2, 0, 300]],
  [f4.t("wire"), [14, 6, 308]],
  [f4.t("inside"), [12, 0, 330]],
  [f4.t("cable"), [6.5, -20, 330]],
  [f4.fin, [2.8, -120, 260]],
  [f5.t("press"), [1.65, -360, 170]],
  [f5.t("whispers"), [3.6, 0, 310]],
  [f5.t("loud"), [2.15, 0, 430]],
  [f5.fin, [1.85, 0, 418]],
  [f6.t("swap"), [1.9, 0, 400]],
  [f6.t("cable"), [2.3, 0, 340]],
  [f6.t("optical"), [3.1, 16, 305]],
  [f6.t("press"), [1.55, -300, 200]],
  [f6.t("nothing"), [1.25, 0, 420]],
  [f6.finDe("nothing") + 0.25, [1.25, 0, 400]],
  [f7.t("red"), [13, 4, 300]],
  [f7.t("wire"), [13.5, 0, 300]],
  [f7.t("orders"), [7.5, 0, 292]],
  [f7.fin, [2.0, 0, 284]],
  [f8.t("first"), [0.9, 0, 280]],
  [f8.t("floor"), [0.78, 80, 620]],
  [f8.t("tripped"), [2.15, 250, 790]],
  [f8.finDe("it") + 0.15, [1.35, 180, 740]],
  [f9.t("cut"), [1.7, 60, 700]],
  [f9.t("wire"), [1.55, 40, 680]],
  [f9.t("then"), [0.9, 0, 220]],
  [f9.finDe("you"), [0.92, 0, 180]],
  [f10.t("back"), [1.15, 40, 420]],
  [f10.t("hidden"), [2.6, 0, 320]],
  [f10.t("picture"), [1.15, -30, 280]],
  [f10.finDe("cable"), [1.05, -40, 260]],
  [f11.t("phone"), [1.45, -280, 180]],
  [f12.t("app"), [2.15, -360, 150]],
  [f12.finDe("bio"), [1.15, -120, 240]],
  [f13.t("aims"), [1.7, 40, 460]],
  [f13.t("soundbar"), [3.6, 0, BAR.y]],
  [v.duracion, [4.8, 0, BAR.y]],
]);

export function camara(t) { return t < 1.42 ? salida(t) : resto(t); }

export function eraDe(t) {
  const sube = k.suave(k.tramo(t, f8.t("first") - 0.05, f8.t("floor")));
  const baja = k.suave(k.tramo(t, f10.t("back") - 0.05, f10.t("picture") + 0.05));
  return sube * (1 - baja);
}
export function opticoDe(t) {
  const sube = k.suave(k.tramo(t, f6.t("swap"), f6.t("optical") + 0.12));
  const baja = k.suave(k.tramo(t, f7.finDe("orders"), f8.t("first")));
  return sube * (1 - baja);
}
export function telefonoDe(t) { return k.suave(k.tramo(t, f11.t("now"), f11.t("phone") + 0.2)); }
export function fuerzaDe(t, era, optico) {
  const nada = optico * k.suave(k.tramo(t, f6.t("optical"), f6.t("press")));
  const hook = 1 - k.suave(k.tramo(t, f2.t("light"), f2.t("stops")));
  const fuerte = k.suave(k.tramo(t, f5.t("bar"), f5.t("loud") + 0.15)) * (1 - k.suave(k.tramo(t, f6.t("swap"), f6.t("optical"))));
  const fin = k.suave(k.tramo(t, f13.t("at"), f13.t("soundbar")));
  const vuelve = (1 - era) * k.suave(k.tramo(t, f10.t("picture"), f10.finDe("cable") + 0.2));
  return Math.max(0.08, (0.25 + 0.7 * hook + fuerte * 0.9 + fin * 0.85 + vuelve * 0.35) * (1 - nada) * (1 - era * 0.92));
}

function redondo(g, x, y, w, h, r) { k.redondo(g, x, y, w, h, r); }

function fondo(g, t, era) {
  const pared = g.createLinearGradient(0, -700, 0, 520);
  pared.addColorStop(0, k.mezColor("#07101c", "#2a160c", era));
  pared.addColorStop(0.55, k.mezColor("#12233a", "#6a3a22", era));
  pared.addColorStop(1, k.mezColor("#1b3a44", "#c9844a", era * 0.7));
  g.fillStyle = pared; g.fillRect(-1600, -900, 3200, 1600);
  g.save(); g.globalAlpha = 0.18; g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -800, -600, 1800, 1400); g.restore();
  // lámpara de pie, luz caliente
  g.save();
  g.fillStyle = k.mezColor("#1c140e", "#4a2a16", era);
  g.fillRect(520, 80, 18, 460);
  g.beginPath(); g.moveTo(430, 90); g.lineTo(630, 90); g.lineTo(600, 150); g.lineTo(460, 150); g.closePath();
  const lg = g.createLinearGradient(430, 90, 630, 150);
  lg.addColorStop(0, "#6a4a28"); lg.addColorStop(0.5, "#f2d7a2"); lg.addColorStop(1, "#8a6234");
  g.fillStyle = lg; g.fill();
  g.restore();
  g.save(); g.globalCompositeOperation = "lighter";
  const haz = g.createRadialGradient(530, 200, 10, 530, 360, 420);
  haz.addColorStop(0, "rgba(255,196,120,0.28)"); haz.addColorStop(1, "rgba(255,196,120,0)");
  g.fillStyle = haz; g.fillRect(80, 80, 900, 700); g.restore();
  // suelo
  const suelo = g.createLinearGradient(0, 500, 0, 1200);
  suelo.addColorStop(0, k.mezColor("#4a5c70", "#e0b07a", era));
  suelo.addColorStop(1, k.mezColor("#243140", "#7a4e2c", era));
  g.fillStyle = suelo; g.fillRect(-1600, 500, 3200, 900);
  g.save(); g.globalAlpha = 0.25; g.strokeStyle = k.mezColor("#0e1622", "#2a180e", era); g.lineWidth = 3;
  for (let x = -800; x < 900; x += 70) { g.beginPath(); g.moveTo(x, 500); g.lineTo(x + 40, 1400); g.stroke(); }
  g.restore();
  // alfombra cuando el cuarto es viejo
  if (era > 0.02) {
    g.save(); g.globalAlpha = era;
    g.fillStyle = "#7a2e3a"; redondo(g, -200, 640, 980, 280, 24); g.fill();
    g.strokeStyle = "#e6c27a"; g.lineWidth = 8; g.stroke();
    g.globalAlpha = era * 0.35; g.drawImage(k.manchas, -200, 640, 980, 280);
    g.restore();
  }
  // planta
  g.save();
  g.fillStyle = "#16302a"; g.fillRect(610, 430, 70, 16);
  g.fillStyle = "#0e2420"; g.beginPath(); g.moveTo(600, 446); g.lineTo(690, 446); g.lineTo(670, 500); g.lineTo(620, 500); g.closePath(); g.fill();
  g.fillStyle = "#1f8a4d";
  g.beginPath(); g.ellipse(645, 400, 54, 70, 0, 0, 6.28); g.fill();
  g.fillStyle = "#2fbf6a"; g.beginPath(); g.ellipse(610, 390, 36, 48, -0.4, 0, 6.28); g.fill();
  g.restore();
  const tapiz = g.createLinearGradient(0, 820, 0, 1100);
  tapiz.addColorStop(0, k.mezColor("#1f6f86", "#6a3038", era));
  tapiz.addColorStop(1, k.mezColor("#0e3c4a", "#3a1820", era));
  g.fillStyle = tapiz; redondo(g, -780, 880, 1200, 240, 40); g.fill();
}

function pantalla(g, t, x, y, w, h, era, show) {
  g.save();
  redondo(g, x, y, w, h, k.mez(18, 80, era)); g.clip();
  const cielo = g.createLinearGradient(0, y, 0, y + h);
  const dia = t < f11.t("phone");
  cielo.addColorStop(0, k.mezColor("#1d4e89", "#07101e", show));
  cielo.addColorStop(0.55, k.mezColor("#e36a3a", "#14203a", show));
  cielo.addColorStop(1, k.mezColor("#f2c14e", "#070b14", show));
  g.fillStyle = cielo; g.fillRect(x, y, w, h);
  // sol o luna
  const sx = x + w * (0.72 + 0.04 * Math.sin(t * 0.4)), sy = y + h * k.mez(0.38, 0.22, show);
  g.fillStyle = k.mezColor("#ffe7b0", "#d7e4ff", show);
  g.beginPath(); g.arc(sx, sy, k.mez(48, 22, show), 0, 6.28); g.fill();
  // colinas o ciudad
  g.fillStyle = k.mezColor("#163a28", "#0c1018", show);
  g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + h * 0.72);
  g.quadraticCurveTo(x + w * 0.3, y + h * 0.5, x + w * 0.55, y + h * 0.7);
  g.quadraticCurveTo(x + w * 0.8, y + h * 0.86, x + w, y + h * 0.6); g.lineTo(x + w, y + h); g.fill();
  if (show > 0.05) {
    g.globalAlpha = show;
    for (const vn of VENTANAS) {
      const parpadeo = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2 + vn.p));
      g.fillStyle = `rgba(255,214,140,${parpadeo})`;
      g.fillRect(x + vn.x, y + vn.y, vn.w, vn.h);
    }
    g.globalAlpha = 1;
  }
  if (dia && show < 0.95) {
    const u = (t * 0.15) % 1;
    g.globalAlpha = (1 - show) * (1 - era * 0.85);
    g.fillStyle = "#f4f4f4"; g.beginPath(); g.arc(x + 60 + u * (w - 120), y + h * 0.62, 16, 0, 6.28); g.fill();
    g.strokeStyle = "#222"; g.lineWidth = 2; g.stroke();
    g.globalAlpha = 1;
  }
  if (era > 0.15) {
    g.globalAlpha = era * 0.55;
    g.fillStyle = "#c8d0d8";
    for (let i = 0; i < 8; i++) g.fillRect(x, y + 20 + i * (h / 8), w, 2);
    g.globalAlpha = 1;
  }
  g.restore();
  // brillo del cristal
  g.save(); g.globalAlpha = 0.18;
  const rg = g.createLinearGradient(x, y, x + w, y + h);
  rg.addColorStop(0, "rgba(255,255,255,0.7)"); rg.addColorStop(0.3, "rgba(255,255,255,0)");
  g.fillStyle = rg; redondo(g, x, y, w, h, k.mez(18, 80, era)); g.fill();
  g.restore();
}

function tele(g, t, era, show) {
  const w = k.mez(TV.w, 640, era), h = k.mez(TV.h, 500, era);
  const x = -w / 2, y = k.mez(TV.y - TV.h / 2, 40, era);
  // patas y caja de madera
  g.save(); g.globalAlpha = Math.max(era, 0.15);
  g.fillStyle = k.mezColor("#14181e", "#6b3e22", era);
  redondo(g, x - 28, y - 16, w + 56, h + k.mez(36, 90, era), k.mez(22, 12, era)); g.fill();
  g.globalAlpha = Math.max(era, 0.15) * 0.45; g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, x - 28, y - 16, w + 56, h + 80);
  g.restore();
  if (era > 0.2) {
    g.save(); g.globalAlpha = era;
    g.fillStyle = "#4a2c16";
    g.fillRect(x + 30, y + h + 60, 22, 120); g.fillRect(x + w - 52, y + h + 60, 22, 120);
    // botones del sintonizador
    g.fillStyle = "#c9a06a"; g.beginPath(); g.arc(x + w + 8, y + h * 0.55, 16, 0, 6.28); g.fill();
    g.beginPath(); g.arc(x + w + 8, y + h * 0.7, 12, 0, 6.28); g.fill();
    g.restore();
  }
  pantalla(g, t, x, y, w, h, era, show);
  // marco
  g.save();
  g.lineWidth = k.mez(16, 28, era);
  g.strokeStyle = k.mezColor("#0c0e12", "#3d2616", era);
  redondo(g, x, y, w, h, k.mez(18, 70, era)); g.stroke();
  g.restore();
  // ojito
  const oj = 1 - era;
  if (oj > 0.05) {
    g.save(); g.globalAlpha = oj;
    g.fillStyle = "#05060a"; g.beginPath(); g.ellipse(SENSOR.x, SENSOR.y, 34, 16, 0, 0, 6.28); g.fill();
    const ojo = g.createRadialGradient(SENSOR.x - 6, SENSOR.y - 3, 1, SENSOR.x, SENSOR.y, 22);
    ojo.addColorStop(0, "#9dffc8"); ojo.addColorStop(0.45, "#123828"); ojo.addColorStop(1, "#050608");
    g.fillStyle = ojo; g.beginPath(); g.ellipse(SENSOR.x, SENSOR.y, 22, 11, 0, 0, 6.28); g.fill();
    g.restore();
  }
}

function cono(g, x, y, r, t, fuerza, fase) {
  const bombeo = Math.sin(t * 17 + fase) * r * 0.2 * fuerza;
  g.save();
  g.fillStyle = "#2a2118"; g.beginPath(); g.ellipse(x, y, r * 1.12, r * 0.8, 0, 0, 6.28); g.fill();
  g.strokeStyle = "#f0c27a"; g.lineWidth = Math.max(3, r * 0.07);
  g.beginPath(); g.ellipse(x, y, r * 1.05, r * 0.74, 0, 0, 6.28); g.stroke();
  const cg = g.createRadialGradient(x - r * 0.25, y - r * 0.18, r * 0.05, x, y, r);
  cg.addColorStop(0, "#ffe7c4"); cg.addColorStop(0.28, "#d08948"); cg.addColorStop(0.62, "#6a4030"); cg.addColorStop(1, "#1a1210");
  g.fillStyle = cg;
  g.beginPath(); g.ellipse(x, y + bombeo * 0.25, r * 0.8, r * 0.52, 0, 0, 6.28); g.fill();
  g.strokeStyle = "rgba(255,226,190,0.35)"; g.lineWidth = 2;
  for (let i = 1; i <= 3; i++) { g.beginPath(); g.ellipse(x, y + bombeo * 0.15, r * 0.22 * i, r * 0.14 * i, 0, 0, 6.28); g.stroke(); }
  g.fillStyle = "#fff1dc"; g.beginPath(); g.ellipse(x - r * 0.04, y + bombeo - r * 0.02, r * 0.2, r * 0.12, 0, 0, 6.28); g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(x - r * 0.08, y + bombeo - r * 0.04, r * 0.07, r * 0.04, 0, 0, 6.28); g.fill();
  g.restore();
  return bombeo;
}

function anillos(g, x, y, t, fuerza) {
  if (fuerza < 0.08) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineWidth = 10;
  for (let i = 0; i < 4; i++) {
    const u = (t * 0.85 + i / 4) % 1;
    const r = 60 + u * 320;
    g.strokeStyle = `rgba(90,220,255,${(1 - u) * 0.8 * fuerza})`;
    g.beginPath(); g.ellipse(x, y, r, r * 0.46, 0, 0, 6.28); g.stroke();
  }
  g.restore();
}

function barra(g, t, era, fuerza, anillar) {
  if (era > 0.98) return;
  g.save(); g.globalAlpha = 1 - era;
  const x = -BAR.w / 2, y = BAR.y - BAR.h / 2;
  const cuerpo = g.createLinearGradient(x, y, x, y + BAR.h);
  cuerpo.addColorStop(0, "#2a3038"); cuerpo.addColorStop(0.4, "#12161c"); cuerpo.addColorStop(1, "#07080c");
  g.fillStyle = cuerpo; redondo(g, x, y, BAR.w, BAR.h, 28); g.fill();
  g.save(); g.globalAlpha = 0.35; g.globalCompositeOperation = "screen";
  g.drawImage(k.red2, x, y, BAR.w, BAR.h); g.restore();
  // tela
  g.fillStyle = "#16181c"; redondo(g, x + 16, y + 18, BAR.w - 32, BAR.h - 36, 18); g.fill();
  cono(g, -220, BAR.y, 62, t, fuerza, 0);
  cono(g, 0, BAR.y, 78, t, fuerza, 1.2);
  cono(g, 220, BAR.y, 62, t, fuerza, 2.1);
  g.restore();
  if (anillar) anillos(g, 0, BAR.y, t, fuerza * (1 - era));
}

// Camino del cable: cuelga de la tele a la barra, o cruza la alfombra si el cuarto es viejo.
function puntoCable(u, era) {
  const a = { x: 0, y: 250 }, b = { x: 0, y: 350 };
  const moderno = { x: k.mez(a.x, b.x, u) + Math.sin(u * 3.14) * 18, y: k.mez(a.y, b.y, u) };
  const suelo = { x: k.mez(-20, 460, u), y: k.mez(520, 820, k.suave(u)) + Math.sin(u * 9) * 16 };
  return { x: k.mez(moderno.x, suelo.x, era), y: k.mez(moderno.y, suelo.y, era) };
}

function trazoCable(g, era, grosor, color) {
  g.beginPath();
  for (let i = 0; i <= 24; i++) {
    const p = puntoCable(i / 24, era);
    if (i === 0) g.moveTo(p.x, p.y); else g.lineTo(p.x, p.y);
  }
  g.lineWidth = grosor; g.lineCap = "round"; g.strokeStyle = color; g.stroke();
}

function cable(g, t, era, optico, pulso) {
  const grosor = k.mez(26, 10, optico) * (1 - era * 0.35) + era * 16;
  const color = optico > 0.5 ? "#2a1014" : k.mezColor("#14181e", "#d7c4a4", era);
  g.save();
  trazoCable(g, era, grosor + 8, "rgba(0,0,0,0.35)");
  trazoCable(g, era, grosor, color);
  // brillo longitudinal
  g.globalAlpha = 0.35;
  trazoCable(g, era, grosor * 0.28, optico > 0.4 ? "#ff6a6a" : "#8a93a0");
  g.restore();
  // punta óptica
  if (optico > 0.05 && era < 0.8) {
    const p = puntoCable(0.15, era);
    g.save(); g.globalAlpha = optico * (1 - era);
    g.fillStyle = "#1a1c20"; redondo(g, p.x - 16, p.y - 18, 34, 36, 4); g.fill();
    g.fillStyle = "#ff2a2a"; g.beginPath(); g.arc(p.x + 2, p.y, 6, 0, 6.28); g.fill();
    k.brillo(g, p.x + 2, p.y, 40, "255,40,40", 0.8);
    g.restore();
  }
  if (pulso > 0 && pulso < 1 && optico < 0.7) {
    const p = puntoCable(pulso, era * 0.2);
    k.brillo(g, p.x, p.y, 70, "255,190,80", 0.95);
    k.brillo(g, p.x, p.y, 24, "blanca", 1);
  }
}

function corteCable(g, t, era, optico, muestra13) {
  // El corte vive en el medio del cable moderno. Al acercarse la cámara se leen los pines.
  if (era > 0.75) return;
  const p = puntoCable(0.55, 0);
  const al = (1 - era) * (optico < 0.5 ? 1 : 1 - optico);
  const R = 40;
  g.save(); g.translate(p.x, p.y); g.globalAlpha = Math.max(0.15, al);
  g.fillStyle = "#1a1e28"; g.beginPath(); g.arc(0, 0, R, 0, 6.28); g.fill();
  const anillo = g.createRadialGradient(0, 0, R * 0.7, 0, 0, R);
  anillo.addColorStop(0, "rgba(0,0,0,0)"); anillo.addColorStop(1, "rgba(80,90,110,0.9)");
  g.fillStyle = anillo; g.beginPath(); g.arc(0, 0, R, 0, 6.28); g.fill();
  g.strokeStyle = "#d8e0ea"; g.lineWidth = 1.6; g.stroke();
  if (optico < 0.55) {
    for (const pin of PINES) {
      const es = pin.n === 13;
      const on = es ? muestra13 : 0.35;
      g.fillStyle = es ? `rgb(${k.mez(120, 255, on)},${k.mez(90, 200, on)},${k.mez(60, 80, on)})` : "#c5ceda";
      g.beginPath(); g.arc(pin.x * 1.35, pin.y * 1.35, es ? 3.1 : 2.1, 0, 6.28); g.fill();
      if (es && muestra13 > 0.5) k.brillo(g, pin.x * 1.35, pin.y * 1.35, 16, "255,190,80", muestra13);
    }
  }
  if (optico > 0.15) {
    g.globalAlpha = optico * (1 - era);
    const vidrio = g.createRadialGradient(-6, -8, 2, 0, 0, 30);
    vidrio.addColorStop(0, "rgba(255,230,230,0.55)"); vidrio.addColorStop(0.6, "rgba(255,80,70,0.2)"); vidrio.addColorStop(1, "rgba(255,40,40,0.05)");
    g.fillStyle = vidrio; g.beginPath(); g.arc(0, 0, 30, 0, 6.28); g.fill();
    g.strokeStyle = "rgba(255,160,150,0.9)"; g.lineWidth = 2.4; g.beginPath(); g.arc(0, 0, 18, 0, 6.28); g.stroke();
    const flujo = (t * 2.2) % 1;
    k.brillo(g, 0, (flujo - 0.5) * 36, 22, "255,40,40", 1);
    k.brillo(g, 0, 0, 26, "255,70,50", 0.85);
    g.globalAlpha = optico * 0.95;
    g.setLineDash([2.2, 2.2]); g.strokeStyle = `rgba(255,200,120,${0.55 * k.suave(k.tramo(t, f7.t("no"), f7.t("wire") + 0.35))})`;
    g.lineWidth = 1.4; g.beginPath(); g.arc(16, 10, 5, 0, 6.28); g.stroke(); g.setLineDash([]);
  }
  g.restore();
  if (muestra13 > 0.4 && optico < 0.3) {
    g.save(); g.globalAlpha = k.suave(k.tramo(muestra13, 0.4, 1));
    g.fillStyle = "#ffd078"; g.font = "700 7px Figtree"; g.textAlign = "center";
    g.fillText("13", p.x + 22, p.y - 16);
    g.restore();
  }
}

function mando(g, x, y, ang, t, pulsa) {
  g.save(); g.translate(x, y); g.rotate(ang);
  const w = 110, h = 300;
  const cuerpo = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  cuerpo.addColorStop(0, "#2c3138"); cuerpo.addColorStop(0.35, "#8b939e"); cuerpo.addColorStop(0.7, "#3a4048"); cuerpo.addColorStop(1, "#15181c");
  g.fillStyle = cuerpo; redondo(g, -w / 2, -h / 2, w, h, 28); g.fill();
  // ventana de infrarrojos
  g.fillStyle = "#0a0c10"; redondo(g, -22, -h / 2 + 14, 44, 16, 6); g.fill();
  g.fillStyle = "#101820"; g.beginPath(); g.ellipse(0, -h / 2 + 8, 10, 5, 0, 0, 6.28); g.fill();
  // botón de encendido
  g.fillStyle = "#c0392b"; g.beginPath(); g.arc(0, -h / 2 + 52, 12, 0, 6.28); g.fill();
  // volumen, el que se pulsa
  const hunde = pulsa * 5;
  g.fillStyle = "#1a1e24"; redondo(g, -16, -20 + hunde, 32, 70, 10); g.fill();
  g.fillStyle = "#d5dbe3"; g.font = "700 16px Figtree"; g.textAlign = "center";
  g.fillText("+", 0, -2 + hunde); g.fillText("−", 0, 36 + hunde);
  // cruceta
  g.fillStyle = "#232830"; redondo(g, -22, 62, 44, 44, 10); g.fill();
  g.restore();
}

function dedo(g, x, y, ang, cuanto) {
  if (cuanto < 0.02) return;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha = Math.min(1, cuanto * 1.4);
  const baja = (1 - cuanto) * -50;
  const piel = g.createLinearGradient(0, -30, 40, 40);
  piel.addColorStop(0, "#f0c2a0"); piel.addColorStop(1, "#c48462");
  g.fillStyle = piel; redondo(g, -16 + baja, -18, 54, 36, 16); g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; redondo(g, -8 + baja, -14, 10, 18, 5); g.fill();
  g.restore();
}

function pulsoDedo(t, t0) {
  const entra = k.entra(k.tramo(t, t0 - 0.28, t0 + 0.05));
  const sale = k.suave(k.tramo(t, t0 + 0.12, t0 + 0.42));
  return entra * (1 - sale);
}

function movil(g, x, y, ang, t) {
  g.save(); g.translate(x, y); g.rotate(ang);
  const w = 150, h = 280;
  g.fillStyle = "#0e1014"; redondo(g, -w / 2, -h / 2, w, h, 22); g.fill();
  g.fillStyle = "#0b1c18"; redondo(g, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 16); g.fill();
  g.fillStyle = "#d9fff0"; redondo(g, -w / 2 + 16, -h / 2 + 28, w - 32, h - 52, 14); g.fill();
  const late = 0.65 + 0.35 * Math.sin(t * 5);
  g.fillStyle = `rgba(70,230,160,${late})`;
  redondo(g, -46, -78, 92, 58, 14); g.fill();
  g.fillStyle = "#04281c"; g.font = "700 36px Figtree"; g.textAlign = "center"; g.fillText("+", 0, -38);
  g.fillStyle = "#1c3144"; redondo(g, -46, -6, 92, 50, 14); g.fill();
  g.fillStyle = "#d5e8ff"; g.fillText("−", 0, 28);
  g.fillStyle = "#1c3144"; redondo(g, -34, 58, 68, 52, 12); g.fill();
  g.beginPath(); g.moveTo(0, 68); g.lineTo(16, 96); g.lineTo(-16, 96); g.fillStyle = "#9ad7ff"; g.fill();
  g.restore();
}

function zapato(g, t) {
  const t0 = f8.t("tripped");
  const u = k.entra(k.tramo(t, t0 - 0.45, t0 + 0.05));
  const tropiezo = Math.sin(k.tramo(t, t0, t0 + 0.35) * Math.PI) * (t > t0 ? 1 : 0);
  if (u < 0.01 && t < t0) return;
  const x = k.mez(620, 300, u) + tropiezo * 20;
  const y = 790 - tropiezo * 36;
  const ang = tropiezo * -0.4;
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(1.5, 1.5);
  g.fillStyle = "#f2efe6"; redondo(g, -70, -8, 150, 28, 12); g.fill();
  const cuero = g.createLinearGradient(-70, -40, 80, 10);
  cuero.addColorStop(0, "#6b3a22"); cuero.addColorStop(0.5, "#a86a3e"); cuero.addColorStop(1, "#4a2818");
  g.fillStyle = cuero;
  g.beginPath(); g.moveTo(-60, -6); g.quadraticCurveTo(-70, -48, -10, -52); g.lineTo(40, -28); g.quadraticCurveTo(78, -10, 70, 0); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(-20, -46, 8, 20);
  g.restore();
}

function tijeras(g, t) {
  const t0 = f9.t("cut");
  const entra = k.entra(k.tramo(t, t0 - 0.28, t0));
  const cierra = k.suave(k.tramo(t, t0, t0 + 0.16));
  const sale = k.suave(k.tramo(t, t0 + 0.28, t0 + 0.7));
  if (entra < 0.01 || sale > 0.98) return;
  const x = k.mez(180, 40, entra), y = k.mez(520, 690, entra) - sale * 80;
  const apertura = k.mez(0.7, 0.05, cierra);
  g.save(); g.translate(x, y); g.globalAlpha = 1 - sale;
  const hoja = (ang) => {
    g.save(); g.rotate(ang);
    g.fillStyle = "#c5ccd6";
    g.beginPath(); g.moveTo(0, 0); g.lineTo(120, -8); g.lineTo(126, 0); g.lineTo(120, 6); g.closePath(); g.fill();
    k.metal ? null : null;
    g.fillStyle = "#e8eef6"; g.fillRect(8, -2, 90, 2);
    g.fillStyle = "#8a3030"; g.beginPath(); g.arc(-16, 0, 14, 0, 6.28); g.fill();
    g.restore();
  };
  hoja(-apertura); hoja(apertura);
  g.fillStyle = "#ddd"; g.beginPath(); g.arc(0, 0, 5, 0, 6.28); g.fill();
  if (cierra > 0.6 && sale < 0.3) k.brillo(g, 90, 0, 50, "blanca", (1 - sale) * (cierra - 0.6));
  g.restore();
}

function caboCortado(g, t, era) {
  const t0 = f9.t("cut");
  const u = k.suave(k.tramo(t, t0, t0 + 0.35));
  if (u < 0.02 || era < 0.4) return;
  g.save(); g.globalAlpha = era * (1 - k.suave(k.tramo(t, f10.t("back"), f10.t("hidden"))));
  g.strokeStyle = "#d7c4a4"; g.lineWidth = 14; g.lineCap = "round";
  g.beginPath(); g.moveTo(-20, 560); g.quadraticCurveTo(-40, 640, -10, 700 + u * 20); g.stroke();
  g.beginPath(); g.moveTo(80, 640); g.quadraticCurveTo(200, 760, 340, 800 + (1 - u) * 10); g.stroke();
  g.restore();
}

function haz(g, x0, y0, x1, y1, al, ancho, color) {
  if (al < 0.02) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = al;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L * ancho, ny = dx / L * ancho;
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, `rgba(${color},0.15)`); gr.addColorStop(0.5, `rgba(${color},0.85)`); gr.addColorStop(1, `rgba(${color},0.2)`);
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(x0 + nx, y0 + ny); g.lineTo(x1 + nx * 0.3, y1 + ny * 0.3); g.lineTo(x1 - nx * 0.3, y1 - ny * 0.3); g.lineTo(x0 - nx, y0 - ny); g.fill();
  g.restore();
}

function mandoMal(g, t) {
  const u = k.suave(k.tramo(t, f13.t("friend"), f13.t("aims")));
  const seVa = k.suave(k.tramo(t, f13.t("soundbar") - 0.05, f13.t("soundbar") + 0.35));
  if (u < 0.02) return;
  const x = k.mez(380, 180, u), y = k.mez(780, 640, u);
  g.save(); g.globalAlpha = 1 - seVa;
  mando(g, x, y, -0.4, t, 0);
  g.restore();
  const al = u * (1 - seVa) * k.pulso(t, f13.t("aims"), 0.18);
  haz(g, x + 20, y - 80, 40, BAR.y + 20, al, 16, "255,60,180");
  if (al > 0.05) k.brillo(g, 40, BAR.y + 10, 80, "255,80,180", al);
}

export function escena(g, t) {
  const era = eraDe(t), optico = opticoDe(t), tel = telefonoDe(t);
  const fuerza = fuerzaDe(t, era, optico);
  const show = k.suave(k.tramo(t, f11.t("is"), f12.t("app") + 0.15));
  const [Z, cx, cy] = camara(t);
  g.fillStyle = "#070b12"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, cx, cy);
  fondo(g, t, era);
  tele(g, t, era, show);
  barra(g, t, era, fuerza, Z < 2.8);
  const pulsoCorre = k.tramo(t, f4.t("runs"), f4.finDe("cable"));
  const pulsoSusurro = k.tramo(t, f5.t("whispers") - 0.05, f5.t("loud"));
  const pulso = pulsoCorre > 0 && pulsoCorre < 1 ? pulsoCorre : pulsoSusurro > 0 && pulsoSusurro < 1 ? pulsoSusurro : -1;
  cable(g, t, era, optico, pulso < 0 ? -1 : pulso);
  caboCortado(g, t, era);
  const muestra13 = k.suave(k.tramo(t, f4.t("one"), f4.t("wire") + 0.05)) * (1 - k.suave(k.tramo(t, f4.finDe("cable"), f5.t("press"))));
  corteCable(g, t, era, optico, muestra13);

  const ang = Math.atan2(SENSOR.x - MANDO.x, -(SENSOR.y - MANDO.y));
  const p1 = pulsoDedo(t, f5.t("press"));
  const p2 = pulsoDedo(t, f6.t("press")) * optico;
  if (tel < 0.98) {
    g.save(); g.globalAlpha = 1 - tel;
    mando(g, MANDO.x, MANDO.y, ang, t, Math.max(p1, p2));
    dedo(g, MANDO.x - 10, MANDO.y + 10, ang, Math.max(p1, p2));
    g.restore();
  }
  if (tel > 0.02) {
    g.save(); g.globalAlpha = tel * (1 - k.suave(k.tramo(t, f13.t("aims"), f13.t("soundbar"))));
    movil(g, MANDO.x, MANDO.y, ang * 0.4, t);
    g.restore();
  }

  // el haz que se para en el ojito
  const crece = k.suave(k.tramo(t, f2.t("light") - 0.05, f2.t("tv")));
  const para = 1 - k.suave(k.tramo(t, f2.t("stops"), f2.finDe("stops") + 0.45));
  const previo = k.suave(k.tramo(t, f1.t("never") - 0.05, f1.t("points"))) * (1 - k.suave(k.tramo(t, f2.t("that"), f2.t("light"))));
  const alHaz = Math.max(previo * 0.45, crece * para);
  const punta = { x: MANDO.x + Math.sin(ang) * 130, y: MANDO.y - Math.cos(ang) * 130 };
  haz(g, punta.x, punta.y, SENSOR.x, SENSOR.y, alHaz, 22, "255,70,190");
  if (crece > 0.8 && para > 0.2) k.brillo(g, SENSOR.x, SENSOR.y, 50, "255,80,190", crece * para);
  const desdePara = t - f2.t("stops");
  if (desdePara > 0 && desdePara < 1.2) k.fogonazo(g, SENSOR.x, SENSOR.y, desdePara, 140, "255,170,220");

  // el pulso que muere en el óptico
  if (optico > 0.5 && t > f6.t("press") && t < f6.finDe("nothing") + 0.3) {
    const muere = k.tramo(t, f6.t("press"), f6.t("nothing") + 0.15);
    const q = puntoCable(Math.min(0.2, muere * 0.25), 0);
    k.brillo(g, q.x, q.y, 40 * (1 - muere), "255,40,40", (1 - muere) * optico);
  }

  zapato(g, t);
  tijeras(g, t);
  mandoMal(g, t);

  sinVista(g);
  const claro = Z > 2.2 || (t < 1.3) ? 0.78 : 0.62;
  velo(g, claro);
}

export const momentos = {
  para: f2.t("stops"),
  hilo: f4.t("wire"),
  fuerte: f5.t("loud"),
  nada: f6.t("nothing"),
  tropiezo: f8.t("tripped"),
  corte: f9.t("cut"),
};
