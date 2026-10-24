// El salón de 1950 y el de ahora. El dial, el motor y el cable son los mismos en todo el primer plano.
import * as k from "#kit";
import { v } from "#voz";

const { suave: su, tramo: tr, mez, entra, pulso } = k;

export const KX = 800, KY = 960, KR = 118;
const PASO = (Math.PI * 2) / 7;
const VEL = 5.4;
const Tf = v.frase(2).fin;

export function anguloDial(t) {
  if (t <= Tf) return t * VEL;
  const a0 = Tf * VEL;
  const adelante = Math.ceil((a0 + 0.02) / PASO) * PASO;
  const sube = su(tr(t, Tf, v.frase(3).t("up") + 0.12));
  const vuelve = su(tr(t, v.frase(3).t("other") + 0.05, v.frase(3).t("back") + 0.08));
  return mez(a0, adelante, sube) - vuelve * PASO;
}

const Tap = v.frase(4).t("off");
export function apagado(t) {
  return su(tr(t, Tap - 0.02, Tap + 0.38));
}

const Tzap = v.frase(5).t("tripped");
export function levantaCable(t) {
  const sube = su(tr(t, Tzap - 0.22, Tzap + 0.12));
  const baja = su(tr(t, Tzap + 0.42, Tzap + 0.95));
  return sube * (1 - baja);
}

export function velo(g, fuerza = 0.62) {
  const vg = g.createLinearGradient(0, 40, 0, 620);
  vg.addColorStop(0, `rgba(18,8,6,${fuerza})`);
  vg.addColorStop(0.55, `rgba(18,8,6,${fuerza * 0.45})`);
  vg.addColorStop(1, "rgba(18,8,6,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 640);
}

function conCamara(g, cam, dibuja) {
  g.save();
  g.translate(540, 1000);
  g.scale(cam.z, cam.z);
  g.translate(-cam.cx, -cam.cy);
  dibuja();
  g.restore();
}

function engranaje(g, x, y, r, n, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.beginPath();
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const paso = (Math.PI * 2) / n;
    const A = [Math.cos(a0) * r * 0.76, Math.sin(a0) * r * 0.76];
    const B = [Math.cos(a0 + paso * 0.28) * r, Math.sin(a0 + paso * 0.28) * r];
    const C = [Math.cos(a0 + paso * 0.62) * r, Math.sin(a0 + paso * 0.62) * r];
    const D = [Math.cos(a0 + paso) * r * 0.76, Math.sin(a0 + paso) * r * 0.76];
    if (i === 0) g.moveTo(A[0], A[1]);
    else g.lineTo(A[0], A[1]);
    g.lineTo(B[0], B[1]);
    g.lineTo(C[0], C[1]);
    g.lineTo(D[0], D[1]);
  }
  g.closePath();
  k.metal(g, -r, r, ["#8a5418", "#f3d48a", "#d7a44a", "#fff3c8", "#6d3e10"]);
  g.lineWidth = 3;
  g.strokeStyle = "rgba(60,30,8,0.45)";
  g.stroke();
  g.beginPath();
  g.arc(0, 0, r * 0.22, 0, Math.PI * 2);
  g.fillStyle = "#2a140c";
  g.fill();
  g.restore();
}

function dial(g, x, y, r, ang) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.arc(0, 0, r * 1.08, 0, Math.PI * 2);
  g.fillStyle = "#1a0c08";
  g.fill();
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  k.metal(g, -r, r, ["#a86b22", "#ffe6a4", "#e8bc62", "#fff8dc", "#7a4c12"]);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.28;
  g.drawImage(k.manchas, -r, -r, r * 2, r * 2);
  g.restore();
  g.beginPath();
  g.arc(0, 0, r * 0.78, 0, Math.PI * 2);
  g.fillStyle = "#140e0c";
  g.fill();
  g.save();
  g.rotate(ang);
  const canales = [2, 4, 5, 7, 9, 11, 13];
  g.font = `800 ${Math.round(r * 0.2)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  canales.forEach((n, i) => {
    const a = -Math.PI / 2 + (i / canales.length) * Math.PI * 2;
    g.save();
    g.rotate(a);
    g.fillStyle = "#ffe7b8";
    g.fillText(String(n), 0, -r * 0.52);
    g.restore();
  });
  g.fillStyle = "#fff4d2";
  g.fillRect(-5, -r * 0.78, 10, r * 0.28);
  g.restore();
  g.beginPath();
  g.moveTo(0, -r * 1.02);
  g.lineTo(16, -r * 1.28);
  g.lineTo(-16, -r * 1.28);
  g.closePath();
  g.fillStyle = "#fff6e0";
  g.fill();
  g.beginPath();
  g.arc(0, 0, r * 0.16, 0, Math.PI * 2);
  k.metal(g, -r * 0.16, r * 0.16, ["#c4893a", "#fff1c2", "#a86b22"]);
  g.restore();
}

function pantallaVieja(g, t, cx, cy, r) {
  const off = apagado(t);
  g.save();
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2);
  g.clip();
  const show = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  show.addColorStop(0, "#1a4e8a");
  show.addColorStop(0.45, "#e23b4a");
  show.addColorStop(1, "#f2c14b");
  g.fillStyle = show;
  g.fillRect(cx - r, cy - r, r * 2, r * 2);
  g.fillStyle = "rgba(255,244,220,0.9)";
  g.beginPath();
  g.arc(cx - 30 + Math.sin(t * 0.8) * 16, cy + 10, r * 0.28, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#14b89a";
  g.fillRect(cx - r * 0.2, cy - r * 0.55 + Math.sin(t * 1.3) * 8, r * 0.7, r * 0.18);
  g.globalAlpha *= 0.18;
  g.fillStyle = "#041018";
  const des = (t * 36) % 28;
  for (let y = cy - r; y < cy + r; y += 28) g.fillRect(cx - r, y + des, r * 2, 8);
  g.restore();
  if (off > 0.01) {
    g.save();
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.clip();
    g.fillStyle = `rgba(8,10,8,${off})`;
    g.fillRect(cx - r, cy - r, r * 2, r * 2);
    g.restore();
    const punto = pulso(t, Tap + 0.22, 0.16);
    if (punto > 0.02) {
      g.fillStyle = `rgba(230,255,230,${punto})`;
      g.beginPath();
      g.arc(cx, cy, mez(r * 0.45, 7, su(tr(t, Tap, Tap + 0.45))), 0, Math.PI * 2);
      g.fill();
    }
  }
  g.save();
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2);
  k.vidrio(g, cx - r, cx + r, 0.35);
  g.restore();
  k.brillo(g, cx - r * 0.35, cy - r * 0.35, r * 0.7, "blanca", 0.35 * (1 - off));
}

function cable(g, t) {
  const lev = levantaCable(t);
  const y2 = 1240 - lev * 160;
  g.save();
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(760, 1125);
  g.quadraticCurveTo(500, y2, 690, 1325);
  g.strokeStyle = "#3a2416";
  g.lineWidth = 40;
  g.stroke();
  g.strokeStyle = "#e0a15c";
  g.lineWidth = 12;
  g.stroke();
  g.restore();
}

function sofa(g) {
  g.save();
  k.redondo(g, 280, 1260, 860, 280, 70);
  const sg = g.createLinearGradient(280, 1260, 1140, 1540);
  sg.addColorStop(0, "#ff7a45");
  sg.addColorStop(0.5, "#e24b2f");
  sg.addColorStop(1, "#a32e22");
  g.fillStyle = sg;
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.35;
  g.drawImage(k.manchas, 280, 1260, 860, 280);
  g.restore();
  g.restore();
}

function lampara(g, t) {
  g.fillStyle = "#5a3218";
  g.fillRect(150, 980, 28, 620);
  g.beginPath();
  g.moveTo(40, 1040);
  g.lineTo(290, 1040);
  g.lineTo(250, 760);
  g.lineTo(80, 760);
  g.closePath();
  const lg = g.createLinearGradient(40, 760, 290, 1040);
  lg.addColorStop(0, "#ffb15a");
  lg.addColorStop(0.5, "#ffe0a8");
  lg.addColorStop(1, "#e07020");
  g.fillStyle = lg;
  g.fill();
  k.brillo(g, 164, 900, 520 + Math.sin(t * 2) * 8, "fuego", 0.55);
}

function mandoSofa(g, t) {
  const tir = levantaCable(t);
  const x = 500, y = 1188 - tir * 50;
  const up = su(tr(t, v.frase(3).t("up") - 0.08, v.frase(3).t("up") + 0.1)) * (1 - su(tr(t, v.frase(3).t("up") + 0.28, v.frase(3).t("up") + 0.48)));
  const back = su(tr(t, v.frase(3).t("back") - 0.08, v.frase(3).t("back") + 0.1)) * (1 - su(tr(t, v.frase(3).fin, v.frase(3).fin + 0.25)));
  const off = su(tr(t, Tap - 0.08, Tap + 0.12)) * (1 - su(tr(t, Tap + 0.4, Tap + 0.7)));
  g.save();
  k.redondo(g, x, y, 300, 190, 32);
  const cg = g.createLinearGradient(x, y, x + 300, y + 190);
  cg.addColorStop(0, "#fff6e6");
  cg.addColorStop(1, "#e4c8a4");
  g.fillStyle = cg;
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.2;
  g.drawImage(k.red, x, y, 300, 190);
  g.restore();
  const boton = (bx, by, hunde, color) => {
    g.beginPath();
    g.arc(bx, by + hunde * 16, 36, 0, Math.PI * 2);
    g.fillStyle = color;
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)";
    g.beginPath();
    g.arc(bx - 8, by - 8 + hunde * 7, 8, 0, Math.PI * 2);
    g.fill();
  };
  boton(x + 78, y + 78, up, "#e23b3b");
  boton(x + 210, y + 78, back, "#1f8f8a");
  g.beginPath();
  g.arc(x + 148, y + 148, 16, 0, Math.PI * 2);
  g.fillStyle = off > 0.4 ? "#888" : "#2a241c";
  g.fill();
  g.restore();
}

function zapato(g, t) {
  const llega = entra(tr(t, Tzap - 1.05, Tzap - 0.08));
  const seVa = su(tr(t, Tzap + 0.48, Tzap + 0.95));
  const al = llega * (1 - seVa);
  if (al < 0.02) return;
  const x = mez(1100, 430, llega) + seVa * 20;
  const y = mez(1320, 1120, llega) - seVa * 180;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.scale(1.25, 1.25);
  g.rotate(-0.2 + seVa * 0.45);
  k.redondo(g, 0, 20, 280, 70, 24);
  g.fillStyle = "#4a2a18";
  g.fill();
  g.beginPath();
  g.moveTo(30, 40);
  g.quadraticCurveTo(40, -70, 150, -80);
  g.quadraticCurveTo(250, -90, 270, -10);
  g.lineTo(250, 40);
  g.closePath();
  const zg = g.createLinearGradient(0, -80, 200, 40);
  zg.addColorStop(0, "#a86b3c");
  zg.addColorStop(0.5, "#6b3a1e");
  zg.addColorStop(1, "#3a1c10");
  g.fillStyle = zg;
  g.fill();
  g.fillStyle = "rgba(255,220,180,0.35)";
  g.fillRect(70, -20, 16, 50);
  g.restore();
}

function fondoViejo(g) {
  const pg = g.createLinearGradient(0, -400, 0, 1400);
  pg.addColorStop(0, "#4a2418");
  pg.addColorStop(1, "#2a120e");
  g.fillStyle = pg;
  g.fillRect(-800, -600, 2800, 2200);
  const sg = g.createLinearGradient(0, 1160, 0, 2100);
  sg.addColorStop(0, "#c48448");
  sg.addColorStop(1, "#5c3018");
  g.fillStyle = sg;
  g.fillRect(-800, 1160, 2800, 1200);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.3;
  g.drawImage(k.red, -200, 1100, 1600, 900);
  g.restore();
  k.redondo(g, 160, 1140, 1200, 620, 36);
  g.fillStyle = "#0e6b66";
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.35;
  g.drawImage(k.manchas, 160, 1140, 1200, 620);
  g.restore();
}

function teleVieja(g, t) {
  const ang = anguloDial(t);
  k.redondo(g, 250, 430, 700, 760, 36);
  const mg = g.createLinearGradient(250, 430, 950, 1190);
  mg.addColorStop(0, "#a86a38");
  mg.addColorStop(0.4, "#6b3d22");
  mg.addColorStop(1, "#3e2416");
  g.fillStyle = mg;
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.35;
  g.drawImage(k.red, 250, 430, 700, 760);
  g.restore();
  g.fillStyle = "#1a100c";
  g.fillRect(300, 500, 500, 40);
  pantallaVieja(g, t, 520, 760, 210);
  // hueco del motor, siempre abierto, para que los engranajes no aparezcan de golpe
  k.redondo(g, 860, 760, 230, 280, 18);
  g.fillStyle = "#120a08";
  g.fill();
  g.fillStyle = "#c4512a";
  g.fillRect(900, 800, 8, 160);
  g.fillRect(990, 820, 8, 120);
  engranaje(g, 930, 900, 78, 10, -ang * 1.15);
  engranaje(g, 1035, 960, 52, 8, ang * 1.7);
  dial(g, KX, KY, KR, ang);
  // patas
  g.fillStyle = "#2a160e";
  g.fillRect(300, 1160, 28, 90);
  g.fillRect(860, 1160, 28, 90);
}

export function escenaVieja(g, t, cam) {
  conCamara(g, cam, () => {
    fondoViejo(g);
    lampara(g, t);
    sofa(g);
    cable(g, t);
    teleVieja(g, t);
    mandoSofa(g, t);
    zapato(g, t);
    const off = apagado(t);
    k.brillo(g, 520, 760, 700, "cian", 0.28 * (1 - off));
  });
  velo(g, cam.z > 2.2 ? 0.7 : 0.5);
}

export function camaraHook(u) {
  const cerca = entra(tr(Math.max(0, u), 0, 0.42));
  return { cx: KX - 20, cy: KY - 10, z: mez(2.85, 3.45, cerca) };
}

export function camaraVieja(t) {
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
  const cx = k.claves([
    [0, KX - 30],
    [0.45, KX - 10],
    [f1.t("knob"), KX - 20],
    [f1.t("sofa"), 640],
    [f2.t("motor"), 990],
    [f2.t("wire"), 600],
    [f3.inicio, 700],
    [f3.t("up"), 740],
    [f3.t("back"), 760],
    [f4.inicio, 530],
    [f4.t("off"), 520],
    [f5.t("across"), 600],
    [Tzap - 0.05, 560],
    [f5.fin, 560],
  ]);
  const cy = k.claves([
    [0, KY + 40],
    [0.45, KY + 50],
    [f1.t("knob"), KY + 30],
    [f1.t("sofa"), 980],
    [f2.t("motor"), 900],
    [f2.t("wire"), 1220],
    [f3.inicio, 1120],
    [f3.t("up"), 1080],
    [f3.t("back"), 1060],
    [f4.inicio, 820],
    [f4.t("off"), 790],
    [f5.t("across"), 1200],
    [Tzap - 0.05, 1180],
    [f5.fin, 1180],
  ]);
  const z = k.claves([
    [0, 2.85],
    [0.45, 3.15],
    [f1.t("knob"), 3.05],
    [f1.t("sofa"), 1.48],
    [f2.t("motor"), 2.85],
    [f2.t("wire"), 2.15],
    [f3.inicio, 1.9],
    [f3.t("up"), 2.05],
    [f3.t("back"), 2.1],
    [f4.inicio, 1.7],
    [f4.t("off"), 1.9],
    [f5.t("across"), 1.85],
    [Tzap - 0.05, 2.05],
    [f5.fin, 2.05],
  ]);
  return { cx: cx(t), cy: cy(t), z: z(t) };
}

// La otra apertura: el primer segundo viaja por el cable, deprisa, hasta el dial.
export function camaraPorElCable(t) {
  const base = camaraVieja(t);
  const u = su(tr(t, 0.15, 1.05));
  if (t > 1.2) return base;
  return {
    cx: mez(560, base.cx, u),
    cy: mez(1500, base.cy, u),
    z: mez(2.15, base.z, u),
  };
}

// ---------- el salón de ahora ----------

const Tnothing = v.frase(6).t("nothing");
const Tlight = v.frase(7).t("light");
const Tjumps = v.frase(8).t("jumps");
const Tphone = v.frase(10).t("phone");
const Tjump2 = v.frase(10).t("jump");

export function canal(t) {
  if (t < Tjumps) return "4";
  if (t < Tjump2) return "9";
  return "13";
}

function teleNueva(g, t) {
  k.redondo(g, 150, 470, 780, 470, 28);
  g.fillStyle = "#16141c";
  g.fill();
  g.save();
  k.redondo(g, 176, 494, 728, 390, 16);
  g.fill();
  g.clip();
  const sg = g.createLinearGradient(176, 494 + Math.sin(t * 0.7) * 30, 900, 900);
  sg.addColorStop(0, "#3a1d8a");
  sg.addColorStop(0.48, "#ff4d6a");
  sg.addColorStop(1, "#ffd15c");
  g.fillStyle = sg;
  g.fillRect(176, 494, 728, 390);
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.beginPath();
  g.arc(420 + Math.sin(t) * 24, 700, 70, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#10243a";
  g.fillRect(560, 560, 220, 28);
  g.restore();
  // la ventanita que lee la luz
  k.redondo(g, 500, 900, 80, 22, 10);
  g.fillStyle = "#2a0a18";
  g.fill();
  k.brillo(g, 540, 700, 500, "violeta", 0.16);
}

function pulsosLuz(g, t) {
  const t0 = Tlight - 0.05, t1 = Tjumps + 0.05;
  if (t < t0 || t > t1 + 0.35) return;
  const n = 4;
  for (let i = 0; i < n; i++) {
    const nace = t0 + ((t1 - t0) * i) / n;
    const u = (t - nace) / 0.42;
    if (u < 0 || u > 1) continue;
    const x = mez(675, 540, u);
    const y = mez(850, 910, su(u));
    k.brillo(g, x, y, 170 + 70 * (1 - u), "violeta", 0.95 * (1 - u * 0.15));
  }
  const golpe = pulso(t, Tjumps, 0.08);
  k.brillo(g, 540, 910, 280, "violeta", golpe);
  k.fogonazo(g, 540, 700, (t - Tjumps) * 1.4, 700, "190,140,255");
}

function mandoNuevo(g, t, al) {
  if (al < 0.02) return;
  const hund = su(tr(t, Tnothing - 0.12, Tnothing + 0.08)) * (1 - su(tr(t, Tjumps + 0.15, Tjumps + 0.45)));
  g.save();
  g.globalAlpha *= al;
  const x = 560, y = 820;
  k.redondo(g, x, y, 230, 460, 46);
  const rg = g.createLinearGradient(x, y, x + 230, y);
  rg.addColorStop(0, "#2a2e38");
  rg.addColorStop(0.35, "#12141a");
  rg.addColorStop(1, "#3a404c");
  g.fillStyle = rg;
  g.fill();
  g.beginPath();
  g.arc(x + 115, y + 28, 10, 0, Math.PI * 2);
  g.fillStyle = hund > 0.2 ? "#c9a0ff" : "#3a2030";
  g.fill();
  const tecla = (tx, ty, r, color, baja) => {
    g.beginPath();
    g.arc(tx, ty + baja, r, 0, Math.PI * 2);
    g.fillStyle = color;
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.4)";
    g.beginPath();
    g.arc(tx - r * 0.25, ty - r * 0.28 + baja, r * 0.22, 0, Math.PI * 2);
    g.fill();
  };
  tecla(x + 115, y + 150, 42, "#ff3b4e", hund * 10);
  tecla(x + 70, y + 270, 28, "#f4f6fb", 0);
  tecla(x + 160, y + 270, 28, "#f4f6fb", 0);
  tecla(x + 70, y + 360, 28, "#1f8f8a", 0);
  tecla(x + 160, y + 360, 28, "#f2c14b", 0);
  g.restore();
  if (hund > 0.2) k.brillo(g, x + 115, y + 28, 70, "violeta", hund * 0.8 * al);
}

function movil(g, t, al) {
  if (al < 0.02) return;
  const hund = su(tr(t, Tjump2 - 0.06, Tjump2 + 0.08)) * (1 - su(tr(t, Tjump2 + 0.28, Tjump2 + 0.5)));
  g.save();
  g.globalAlpha *= al;
  const x = 520, y = 860;
  k.redondo(g, x, y, 300, 560, 48);
  g.fillStyle = "#12141c";
  g.fill();
  k.redondo(g, x + 16, y + 16, 268, 528, 40);
  const pg = g.createLinearGradient(x, y, x, y + 560);
  pg.addColorStop(0, "#241446");
  pg.addColorStop(1, "#0e2a32");
  g.fillStyle = pg;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath();
  g.arc(x + 150, y + 36, 8, 0, Math.PI * 2);
  g.fill();
  const tecla = (tx, ty, color, baja) => {
    k.redondo(g, tx, ty + baja, 200, 90, 28);
    g.fillStyle = color;
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)";
    k.redondo(g, tx + 16, ty + 12 + baja, 70, 14, 7);
    g.fill();
  };
  tecla(x + 50, y + 120, "#ff3b4e", 0);
  tecla(x + 50, y + 250, "#1f8f8a", hund * 12);
  tecla(x + 50, y + 380, "#f2c14b", 0);
  g.restore();
}

function dialQuieto(g, t) {
  const al = su(tr(t, v.frase(9).inicio - 0.05, v.frase(9).t("knob"))) * (1 - su(tr(t, v.frase(9).fin - 0.05, v.frase(10).inicio + 0.12)));
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  dial(g, 930, 760, 120, 0.6);
  g.restore();
}

function fondoNuevo(g, t) {
  const pg = g.createLinearGradient(0, 0, 0, 1920);
  pg.addColorStop(0, "#1a0d33");
  pg.addColorStop(1, "#071018");
  g.fillStyle = pg;
  g.fillRect(-600, -400, 2400, 2600);
  // una planta, para que el salón no sea una pared lisa
  g.save();
  g.translate(120, 980);
  g.fillStyle = "#123c34";
  g.fillRect(40, 80, 70, 90);
  g.fillStyle = "#1f8f5a";
  g.beginPath();
  g.ellipse(70, 40, 70, 36, -0.4, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#3dcf7a";
  g.beginPath();
  g.ellipse(120, 10 + Math.sin(t) * 4, 54, 28, 0.5, 0, Math.PI * 2);
  g.fill();
  g.restore();
  const sg = g.createLinearGradient(0, 1280, 0, 2000);
  sg.addColorStop(0, "#243044");
  sg.addColorStop(1, "#101820");
  g.fillStyle = sg;
  g.fillRect(-600, 1280, 2400, 900);
  k.brillo(g, 180, 420, 380, "fuego", 0.35);
}

export function escenaNueva(g, t, cam) {
  const alMando = 1 - su(tr(t, Tphone - 0.12, Tphone + 0.28));
  const alMovil = su(tr(t, Tphone - 0.08, Tphone + 0.32));
  conCamara(g, cam, () => {
    fondoNuevo(g, t);
    teleNueva(g, t);
    pulsosLuz(g, t);
    dialQuieto(g, t);
    mandoNuevo(g, t, alMando);
    movil(g, t, alMovil);
  });
  const [nx, ny] = aPantalla(cam, 540, 690);
  if (ny > 580 && ny < 1280) {
    const cambia = Math.max(pulso(t, Tjumps, 0.12), pulso(t, Tjump2, 0.12));
    k.pastilla(g, nx, ny, canal(t), "", cambia > 0.2 ? "190,140,255" : "255,244,220", 1, 108);
  }
  velo(g, 0.42);
}

function aPantalla(cam, x, y) {
  return [540 + (x - cam.cx) * cam.z, 1000 + (y - cam.cy) * cam.z];
}

export function camaraNueva(t) {
  const f6 = v.frase(6), f8 = v.frase(8), f9 = v.frase(9), f12 = v.frase(12);
  const cx = k.claves([
    [f6.inicio, 620],
    [Tnothing - 0.2, 860],
    [Tnothing + 0.45, 860],
    [Tlight, 640],
    [Tjumps - 0.25, 540],
    [f8.fin, 540],
    [f9.t("knob"), 900],
    [f9.fin, 900],
    [Tphone, 660],
    [v.frase(11).t("app"), 640],
    [f12.t("friend"), 620],
    [f12.t("up"), 540],
  ]);
  const cy = k.claves([
    [f6.inicio, 860],
    [Tnothing - 0.2, 820],
    [Tnothing + 0.45, 820],
    [Tlight, 900],
    [Tjumps - 0.25, 720],
    [f8.fin, 720],
    [f9.t("knob"), 800],
    [f9.fin, 800],
    [Tphone, 980],
    [v.frase(11).t("app"), 960],
    [f12.t("friend"), 900],
    [f12.t("up"), 760],
  ]);
  const z = k.claves([
    [f6.inicio, 1.15],
    [Tnothing - 0.2, 1.55],
    [Tnothing + 0.45, 1.55],
    [Tlight, 1.2],
    [Tjumps - 0.25, 1.35],
    [f8.fin, 1.35],
    [f9.t("knob"), 1.45],
    [f9.fin, 1.45],
    [Tphone, 1.42],
    [v.frase(11).t("app"), 1.48],
    [f12.t("friend"), 1.05],
    [f12.t("up"), 1.2],
  ]);
  return { cx: cx(t), cy: cy(t), z: z(t) };
}
