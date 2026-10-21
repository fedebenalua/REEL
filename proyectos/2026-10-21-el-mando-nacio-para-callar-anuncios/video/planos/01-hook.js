// El salón, de la boca del anuncio al agarrón. Una sola cámara (zoom y viaje), sin corte.
import * as k from "#kit";
import { v } from "#voz";
import { T, CHISPAS, anillos, boca, dedo, mando, persona, velo, zapato } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra, claves } = k;

// A dónde mira la cámara y cuánto se acerca. Cada clave es el momento de una frase.
const TX = [
  [-0.45, 540], [T.ads, 520], [3.55, 540], [T.die, 540],
  [T.button, 760], [T.mute, 750], [T.cable, 500], [T.tripped, 620],
  [15.25, 540], [T.channel, 820], [T.talking, 540],
  [T.flash, 680], [T.corner, 800], [T.dies, 540],
  [T.sun, 460], [T.spun, 860], [T.own + 0.3, 540],
  [T.kill, 540], [T.leave, 500], [T.them + 0.22, 540],
  [T.before, 540], [T.stuck, 540], [T.much, 540],
  [T.click, 640], [T.gone, 540], [T.grab, 560], [38.05, 540], [38.42, 540],
];
const TY = [
  [-0.45, 860], [T.ads, 820], [3.55, 780], [T.die, 760],
  [T.button, 1260], [T.mute, 1280], [T.cable, 1520], [T.tripped, 1460],
  [15.25, 900], [T.channel, 980], [T.talking, 800],
  [T.flash, 760], [T.corner, 620], [T.dies, 800],
  [T.sun, 700], [T.spun, 1020], [T.own + 0.3, 820],
  [T.kill, 800], [T.leave, 820], [T.them + 0.22, 860],
  [T.before, 1180], [T.stuck, 1160], [T.much, 1200],
  [T.click, 1140], [T.gone, 980], [T.grab, 1040], [38.05, 1080], [38.42, 1080],
];
const TZ = [
  [-0.45, 1.85], [T.ads, 2.4], [3.55, 1.45], [T.die, 1.28],
  [T.button, 1.65], [T.mute, 1.95], [T.cable, 1.7], [T.tripped, 1.9],
  [15.25, 1.35], [T.channel, 1.85], [T.talking, 1.72],
  [T.flash, 1.45], [T.corner, 1.95], [T.dies, 1.55],
  [T.sun, 1.22], [T.spun, 1.75], [T.own + 0.3, 1.4],
  [T.kill, 1.7], [T.leave, 1.5], [T.them + 0.22, 1.32],
  [T.before, 1.2], [T.stuck, 1.48], [T.much, 1.4],
  [T.click, 1.42], [T.gone, 1.22], [T.grab, 1.12], [38.05, 1.16], [38.42, 1.16],
];
const fx = claves(TX), fy = claves(TY), fz = claves(TZ);

const TV = { x: 540, y: 780, w: 920, h: 560 };

function abertura(t) {
  let o = 0.82 + 0.14 * Math.sin(t * 8);
  o *= 1 - su(tr(t, T.ads - 0.05, T.ads + 0.22));
  if (t < T.talking - 0.28) return Math.max(0, o);
  const habla = su(tr(t, T.talking - 0.25, T.talking + 0.1));
  const calla = su(tr(t, T.corner, T.dies + 0.08));
  if (t < T.kill - 0.04) return habla * (1 - calla) * (0.8 + 0.15 * Math.sin(t * 7));
  const revive = su(tr(t, T.kill, T.ads2 + 0.16));
  const seVa = su(tr(t, T.leave - 0.04, T.leave + 0.18));
  return revive * (1 - seVa) * 0.92;
}

function pantalla(g, t) {
  const { x, y, w, h } = TV;
  const open = abertura(t);
  const muere = su(tr(t, 6.15, T.die + 0.18));
  const vivo = t < T.die + 0.35 ? 1 - muere : su(tr(t, T.channel - 0.4, T.channel));
  const ang = su(tr(t, T.channel - 0.04, T.channel + 0.5)) * 2.2 + su(tr(t, T.spun - 0.05, T.own + 0.1)) * 6.4;
  const deja = su(tr(t, T.leave, T.before - 0.28));
  g.save();
  k.redondo(g, x - w / 2, y - h / 2, w, h, 26);
  g.clip();
  g.fillStyle = "#14080e";
  g.fillRect(x - w / 2, y - h / 2, w, h);
  g.save();
  g.translate(x, y);
  g.scale(Math.max(0.03, vivo), Math.max(0.03, vivo));
  if (open < 0.08 && t > T.ads + 0.35 && t < T.kill && deja < 0.97) {
    const colores = ["#49d0ff", "#ffd15c", "#86f0a2", "#d2b6ff"];
    const i = Math.floor(ang) % colores.length;
    const grd = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    grd.addColorStop(0, colores[i]);
    grd.addColorStop(1, "#10202a");
    g.fillStyle = grd;
    g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle = "rgba(255,255,255,0.9)";
    g.beginPath();
    g.arc(-w * 0.16, -h * 0.06, w * 0.11, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#16382a";
    g.beginPath();
    g.moveTo(w * 0.02, h * 0.22);
    g.lineTo(w * 0.2, -h * 0.02);
    g.lineTo(w * 0.4, h * 0.24);
    g.fill();
  }
  if (open > 0.04) {
    const pg = g.createRadialGradient(0, 0, 40, 0, 0, w * 0.65);
    pg.addColorStop(0, "#ffe08a");
    pg.addColorStop(0.42, "#ff2d62");
    pg.addColorStop(1, "#5c0a24");
    g.fillStyle = pg;
    g.fillRect(-w / 2, -h / 2, w, h);
    boca(g, 0, 20, w * 0.96, h, open);
    anillos(g, 0, 10, t, 0.9, open);
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const s of CHISPAS) {
      const a = s.a + t * s.v;
      g.fillStyle = `rgba(255,236,190,${0.25 + 0.45 * open})`;
      g.beginPath();
      g.arc(Math.cos(a) * s.r * w * 0.42, Math.sin(a) * s.r * h * 0.32, 5 + s.s * 8, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }
  if (deja > 0.02 && deja < 0.995) {
    const cols = ["#ff4d6d", "#3ec6ff", "#ffe066"];
    for (let i = 0; i < 3; i++) {
      const cx = mez(-w * 0.34 + i * w * 0.34, -w * 1.15 + i * w * 0.08, deja);
      g.fillStyle = cols[i];
      k.redondo(g, cx - w * 0.16, -h * 0.36, w * 0.3, h * 0.72, 22);
      g.fill();
      g.fillStyle = "rgba(255,255,255,0.85)";
      g.beginPath();
      g.arc(cx, -h * 0.05, w * 0.05, 0, 7);
      g.fill();
    }
  }
  g.restore();
  if (muere > 0.15 && t < T.channel - 0.15) {
    k.brillo(g, x, y, 220 * (1.15 - muere), "blanca", muere * (1 - su(tr(t, T.die + 0.2, T.channel - 0.35))));
  }
  g.restore();
}

function haz(g, x0, y0, x1, y1, al, ancho, color) {
  if (al < 0.03) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = color;
  g.lineCap = "round";
  g.globalAlpha = al * 0.28;
  g.lineWidth = ancho * 3;
  g.beginPath();
  g.moveTo(x0, y0);
  g.lineTo(x1, y1);
  g.stroke();
  g.globalAlpha = al;
  g.lineWidth = ancho;
  g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  const madera = su(tr(t, 3.7, 6.3));
  const z = fz(t);
  g.save();
  g.translate(540, 960);
  g.scale(z, z);
  g.translate(-fx(t), -fy(t));

  // pared y lampara
  const pared = g.createLinearGradient(0, 0, 0, 1920);
  pared.addColorStop(0, "#164048");
  pared.addColorStop(0.55, "#0d2c34");
  pared.addColorStop(1, "#1a120c");
  g.fillStyle = pared;
  g.fillRect(-400, -400, 2000, 2800);
  k.brillo(g, 180, 620, 640, "fuego", 0.22 + 0.15 * madera);

  // suelo y alfombra
  g.fillStyle = "#b56b32";
  g.fillRect(-200, 1240, 1600, 900);
  g.fillStyle = "#0f7c82";
  k.redondo(g, 120, 1320, 840, 420, 48);
  g.fill();

  // mueble de la tele
  const marco = mez(18, 70, madera);
  const { x, y, w, h } = TV;
  k.redondo(g, x - w / 2 - marco, y - h / 2 - marco * 0.7, w + marco * 2, h + marco * 2.1, 34);
  const mad = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  if (madera > 0.45) {
    mad.addColorStop(0, "#3a2012");
    mad.addColorStop(0.42, "#8d5228");
    mad.addColorStop(1, "#4e2c16");
  } else {
    mad.addColorStop(0, "#0e1016");
    mad.addColorStop(0.5, "#2a3140");
    mad.addColorStop(1, "#12141a");
  }
  g.fillStyle = mad;
  g.fill();
  if (madera > 0.4) {
    g.save();
    k.redondo(g, x - w / 2 - marco, y - h / 2 - marco, w + marco * 2, h + marco * 2, 34);
    g.clip();
    g.globalCompositeOperation = "multiply";
    g.globalAlpha = 0.35;
    g.drawImage(k.red, x - w / 2, y - h / 2, w, h);
    g.restore();
  }
  pantalla(g, t);

  // antena
  if (madera > 0.4) {
    g.strokeStyle = "#e7edf4";
    g.lineWidth = 10;
    g.lineCap = "round";
    const by = y - h / 2 - marco;
    g.beginPath();
    g.moveTo(x, by);
    g.lineTo(x - 150, by - 170);
    g.moveTo(x, by);
    g.lineTo(x + 150, by - 170);
    g.stroke();
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(x - 150, by - 170, 12, 0, 7);
    g.arc(x + 150, by - 170, 12, 0, 7);
    g.fill();
  }

  // dial
  const dialAl = su(tr(t, 5.2, 6.4));
  if (dialAl > 0.05) {
    const dx = x + w / 2 + marco + 10, dy = y + h * 0.15;
    const ang = su(tr(t, T.channel - 0.05, T.channel + 0.48)) * 2.4 + su(tr(t, T.spun - 0.05, T.own + 0.12)) * 7;
    g.save();
    g.translate(dx, dy);
    g.globalAlpha = dialAl;
    const s = 78;
    const dg = g.createRadialGradient(-20, -24, 8, 0, 0, s);
    dg.addColorStop(0, "#fff1d4");
    dg.addColorStop(0.5, "#e0a85a");
    dg.addColorStop(1, "#6d4316");
    g.fillStyle = dg;
    g.beginPath();
    g.arc(0, 0, s, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#2a140c";
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(Math.cos(ang - 1.2) * s * 0.72, Math.sin(ang - 1.2) * s * 0.72);
    g.stroke();
    g.restore();
  }

  // fotocelula
  const cx = x + w / 2 - 36, cy = y - h / 2 + 36;
  const hazOn = su(tr(t, T.corner - 0.3, T.corner)) * (1 - su(tr(t, T.dies + 0.06, T.dies + 0.42)));
  const solOn = su(tr(t, T.sun, T.sun + 0.32)) * (1 - su(tr(t, T.own + 0.18, T.kill - 0.25)));
  if (madera > 0.55) {
    g.fillStyle = "#ffe28a";
    g.beginPath();
    g.arc(cx, cy, 18 + 10 * Math.max(hazOn, solOn), 0, 7);
    g.fill();
    if (hazOn + solOn > 0.08) k.brillo(g, cx, cy, 200, "amarilla", 0.75 * Math.max(hazOn, solOn));
  }

  // cable
  const crece = su(tr(t, T.cable - 0.25, v.frase(4).t("floor") + 0.2));
  if (crece > 0.02 && t < T.flash - 0.2) {
    g.strokeStyle = "#fff4dc";
    g.lineWidth = 26;
    g.lineCap = "round";
    g.beginPath();
    for (let i = 0; i <= 18; i++) {
      const u = (i / 18) * crece;
      const px = mez(x, 280, u) + Math.sin(u * 8) * 70;
      const py = mez(y + h / 2 + 40, 1560, u);
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.stroke();
  }

  // sofa, solo cuando la frase está en el sofá
  const verSofa = su(tr(t, T.button - 0.45, T.button + 0.05)) * (1 - su(tr(t, T.cable + 0.15, T.cable + 0.7)))
    + su(tr(t, T.before - 0.35, T.before + 0.15));
  const sofaAl = Math.min(1, verSofa);
  if (sofaAl > 0.03) {
    g.save();
    g.globalAlpha = sofaAl;
    g.fillStyle = "#c4283c";
    k.redondo(g, 140, 1240, 800, 250, 46);
    g.fill();
    g.fillStyle = "#ff5c6e";
    k.redondo(g, 180, 1120, 720, 200, 40);
    g.fill();
    g.restore();
  }

  // boton del deseo
  const saleBoton = entra(tr(t, T.button - 0.12, T.button + 0.3));
  if (saleBoton > 0.02 && t < T.cable + 0.1) {
    const press = su(tr(t, T.mute - 0.04, T.mute + 0.16));
    const bx = 790, by = 1210 + press * 16;
    const rad = 90 * (0.35 + 0.65 * saleBoton);
    const bg = g.createRadialGradient(bx - 24, by - 30, 10, bx, by, rad);
    bg.addColorStop(0, "#ffd5de");
    bg.addColorStop(0.5, "#ff2d4a");
    bg.addColorStop(1, "#7c1024");
    g.fillStyle = bg;
    g.beginPath();
    g.arc(bx, by, rad, 0, 7);
    g.fill();
    const dedoAl = su(tr(t, T.mute - 0.38, T.mute)) * (1 - su(tr(t, T.couch + 0.25, T.cable - 0.2)));
    dedo(g, bx + 20, by - rad + 10, 260, 0.2, dedoAl);
    if (t >= T.mute && t < T.mute + 1.15) k.fogonazo(g, bx, by, t - T.mute, 640, "255,90,120");
  }

  // persona
  if (t > T.before - 0.15) {
    const llega = entra(tr(t, T.before - 0.1, T.before + 0.35));
    const hunde = su(tr(t, T.stuck - 0.08, T.stuck + 0.35));
    const intenta = Math.sin(Math.PI * tr(t, T.getting, T.much));
    const salto = su(tr(t, T.click, T.gone + 0.1));
    const py = 1180 + hunde * 90 - intenta * 70 - salto * 220;
    persona(g, 500, py, 520, { al: llega, bocaAbierta: salto * 0.4 });
    if (hunde > 0.2 && salto < 0.75) {
      g.fillStyle = "#ff7384";
      g.beginPath();
      g.ellipse(420, 1320, 180, 70, 0, 0, 7);
      g.ellipse(640, 1330, 170, 64, 0.2, 0, 7);
      g.fill();
    }
    const hay = su(tr(t, T.click - 0.06, T.click + 0.14));
    if (hay > 0.02) mando(g, 680, py + 40, 250 * hay, -0.5, su(tr(t, T.click, T.click + 0.14)), hay);
  }

  // zapato
  if (t > v.frase(4).t("people") - 0.25 && t < T.channel - 0.05) {
    const camina = su(tr(t, v.frase(4).t("people") - 0.1, T.tripped));
    const trop = su(tr(t, T.tripped - 0.02, T.tripped + 0.26));
    const px = mez(180, 560, camina);
    const py = mez(1500, 1470, camina) - trop * 40;
    zapato(g, px, py, 260, trop * 0.8 - 0.2);
  }

  // linterna
  const linAl = su(tr(t, T.flash - 0.3, T.flash + 0.25)) * (1 - su(tr(t, T.dies + 0.1, T.sun - 0.15)));
  if (linAl > 0.03 && madera > 0.5) {
    haz(g, 160, 860, cx, cy, hazOn * linAl, 34, "rgba(255,248,220,0.95)");
    g.save();
    g.translate(170, 900);
    g.rotate(-0.55);
    g.globalAlpha = linAl;
    k.redondo(g, -36, -150, 72, 280, 30);
    const mg = g.createLinearGradient(-36, 0, 36, 0);
    mg.addColorStop(0, "#8b93a0");
    mg.addColorStop(0.35, "#f4f7fb");
    mg.addColorStop(0.7, "#9aa3b0");
    mg.addColorStop(1, "#5c6570");
    g.fillStyle = mg;
    g.fill();
    g.fillStyle = "#ffe9b0";
    g.beginPath();
    g.arc(0, -150, 34, 0, 7);
    g.fill();
    g.restore();
  }

  // sol
  if (solOn > 0.03) {
    g.save();
    g.globalAlpha = solOn;
    g.fillStyle = "#ffd56a";
    g.beginPath();
    g.arc(160, 400, 130, 0, 7);
    g.fill();
    g.strokeStyle = "rgba(255,220,120,0.9)";
    g.lineWidth = 16;
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * 6.28 + 0.2;
      g.beginPath();
      g.moveTo(160 + Math.cos(a) * 150, 400 + Math.sin(a) * 150);
      g.lineTo(160 + Math.cos(a) * 210, 400 + Math.sin(a) * 210);
      g.stroke();
    }
    g.restore();
    k.brillo(g, 160, 400, 560, "amarilla", solOn);
    haz(g, 160, 400, cx, cy, solOn, 54, "rgba(255,200,70,0.9)");
  }

  // brazos del anuncio
  const agarre = su(tr(t, T.grab - 0.48, T.grab + 0.26));
  if (agarre > 0.02 && t > T.grab - 0.5) {
    const yPersona = 1180 - su(tr(t, T.click, T.gone + 0.1)) * 220;
    const x1 = mez(x, 620, agarre);
    const y1 = mez(y, yPersona + 40, agarre);
    g.strokeStyle = "#ff2b60";
    g.lineWidth = 70;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(x - 60, y + 30);
    g.quadraticCurveTo(x - 180, (y + y1) / 2, x1 - 40, y1);
    g.moveTo(x + 60, y + 30);
    g.quadraticCurveTo(x + 200, (y + y1) / 2, x1 + 50, y1);
    g.stroke();
    g.fillStyle = "#ffd56a";
    g.beginPath();
    g.ellipse(x1 - 40, y1, 64, 46, -0.4, 0, 7);
    g.ellipse(x1 + 50, y1, 64, 46, 0.4, 0, 7);
    g.fill();
  }

  g.restore();

  // mando del hook, en la pantalla, por delante de la cámara
  const mandoAl = 1 - su(tr(t, T.up + 0.05, 3.45));
  if (mandoAl > 0.03) {
    const u = entra(tr(t, -0.9, T.ads));
    const px = mez(980, 700, u);
    const py = mez(1500, 1180, u);
    const press = su(tr(t, T.ads - 0.04, T.ads + 0.14));
    mando(g, px, py, 760, mez(0.4, -0.05, u), press, mandoAl);
    if (t >= T.ads && t < T.ads + 0.6) k.fogonazo(g, px, py - 80, t - T.ads, 980, "255,226,180");
  }

  velo(g, t < 4 ? 0.85 : 0.5);
}
