// El salón de noche y el interior del mando. La nota que no se oye es cian; la luz del mando de ahora, violeta.
import * as k from "#kit";
import { v } from "#voz";

const { suave: su, tramo: tr, mez, entra, sale, pulso } = k;

const F = (n) => v.frase(n);
export const C1 = F(5).inicio - 0.04;
export const C2 = F(9).inicio - 0.04;

const T = {
  channel: F(1).t("channel"),
  table: F(2).t("table"),
  moved: F(3).t("moved"),
  note: F(4).t("note"),
  hammer: F(5).t("hammer"),
  forty: F(6).t("forty"),
  thousand: F(6).t("thousand"),
  notes: F(7).t("notes"),
  up: F(8).t("up"),
  down: F(8).t("down"),
  sound: F(8).t("sound"),
  power: F(8).t("power"),
  jangle: F(9).t("jangle"),
  fool: F(9).t("fool"),
  glass: F(10).t("glass"),
  clink: F(10).t("clink"),
  stopped: F(11).t("stopped"),
  now: F(12).t("now"),
  button: F(12).t("button"),
  light: F(12).t("light"),
  jangle2: F(13).t("jangle"),
  ignores: F(14).t("ignores"),
  phone: F(15).t("phone"),
  wifi: F(16).t("wifi"),
  app: F(17).t("app"),
  keys2: F(18).t("keys"),
  table2: F(18).t("table"),
};

const LL = [400, 1160];
const OR = [900, 905];
const MAN = [730, 1160];
const GL = [500, 1148];
const GR = [655, 1132];

function aplica(g, cam, dibuja) {
  g.save();
  g.translate(540, 1000);
  g.scale(cam.z, cam.z);
  g.translate(-cam.cx, -cam.cy);
  dibuja();
  g.restore();
}

function velo(g, fuerza = 0.82) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const vg = g.createLinearGradient(0, 0, 0, 560);
  vg.addColorStop(0, `rgba(8,6,16,${fuerza})`);
  vg.addColorStop(0.55, `rgba(8,6,16,${fuerza * 0.72})`);
  vg.addColorStop(1, "rgba(8,6,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 560);
  g.restore();
}

function caja(g, x, y, w, h, r) {
  k.redondo(g, x, y, w, h, r);
}

function sombra(g, x, y, rx, ry, al = 0.45) {
  g.save();
  g.fillStyle = `rgba(0,0,0,${al})`;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function metal(g, x, y, w, h, r, claro, medio, oscuro) {
  const gr = g.createLinearGradient(x, y, x + w, y + h);
  gr.addColorStop(0, oscuro);
  gr.addColorStop(0.35, claro);
  gr.addColorStop(0.7, medio);
  gr.addColorStop(1, oscuro);
  caja(g, x, y, w, h, r);
  g.fillStyle = gr;
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.28;
  g.drawImage(k.manchas, x, y, w, h);
  g.restore();
}

// ---------------------------------------------------------------- salón
function pared(g) {
  const bg = g.createLinearGradient(0, 200, 0, 1500);
  bg.addColorStop(0, "#1a2450");
  bg.addColorStop(0.45, "#3a2258");
  bg.addColorStop(1, "#2a1438");
  g.fillStyle = bg;
  g.fillRect(-200, 0, 1700, 1700);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.22;
  g.drawImage(k.manchas, -200, 200, 1500, 900);
  g.restore();
  // ventana de noche
  caja(g, 70, 430, 250, 340, 18);
  g.fillStyle = "#0c1c3a";
  g.fill();
  const luna = g.createRadialGradient(250, 560, 4, 250, 560, 70);
  luna.addColorStop(0, "rgba(255,244,210,0.95)");
  luna.addColorStop(1, "rgba(255,244,210,0)");
  g.fillStyle = luna;
  g.beginPath();
  g.arc(250, 560, 70, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f4ecd4";
  g.beginPath();
  g.arc(250, 560, 26, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#6e243c";
  g.fillRect(70, 430, 28, 340);
  g.fillRect(292, 430, 28, 340);
  // lámpara de pie
  g.fillStyle = "#3a2418";
  g.fillRect(1048, 620, 16, 620);
  caja(g, 990, 520, 140, 110, 40);
  const lg = g.createLinearGradient(990, 520, 1130, 630);
  lg.addColorStop(0, "#ffe1a8");
  lg.addColorStop(1, "#e0903a");
  g.fillStyle = lg;
  g.fill();
  g.save();
  g.globalCompositeOperation = "lighter";
  const halo = g.createRadialGradient(1060, 700, 20, 1060, 780, 520);
  halo.addColorStop(0, "rgba(255,190,90,0.28)");
  halo.addColorStop(1, "rgba(255,170,60,0)");
  g.fillStyle = halo;
  g.fillRect(500, 400, 900, 1000);
  g.restore();
}

function suelo(g) {
  const sg = g.createLinearGradient(0, 1180, 0, 1680);
  sg.addColorStop(0, "#4a2a22");
  sg.addColorStop(1, "#2a1612");
  g.fillStyle = sg;
  g.fillRect(-200, 1200, 1700, 600);
  g.save();
  caja(g, 80, 1240, 980, 420, 40);
  g.fillStyle = "#c4472e";
  g.fill();
  g.clip();
  g.fillStyle = "#9a301c";
  for (let i = -2; i < 8; i++) {
    g.beginPath();
    g.moveTo(160 + i * 140, 1240);
    g.lineTo(230 + i * 140, 1240);
    g.lineTo(160 + i * 140, 1660);
    g.lineTo(90 + i * 140, 1660);
    g.fill();
  }
  g.restore();
  // sofá
  caja(g, 180, 1040, 820, 220, 70);
  const sof = g.createLinearGradient(180, 1040, 180, 1260);
  sof.addColorStop(0, "#9a3058");
  sof.addColorStop(1, "#5c1834");
  g.fillStyle = sof;
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.25;
  g.drawImage(k.manchas, 180, 1040, 820, 220);
  g.restore();
}

function mesa(g) {
  sombra(g, 560, 1365, 340, 36, 0.35);
  g.fillStyle = "#5c3318";
  g.fillRect(340, 1320, 28, 150);
  g.fillRect(760, 1320, 28, 150);
  const tg = g.createLinearGradient(200, 1260, 900, 1400);
  tg.addColorStop(0, "#e0a15a");
  tg.addColorStop(0.5, "#a86430");
  tg.addColorStop(1, "#6b3a18");
  g.beginPath();
  g.ellipse(560, 1305, 390, 78, 0, 0, Math.PI * 2);
  g.fillStyle = tg;
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.3;
  g.beginPath();
  g.ellipse(560, 1305, 390, 78, 0, 0, Math.PI * 2);
  g.clip();
  g.drawImage(k.red, 200, 1220, 740, 180);
  g.restore();
  g.beginPath();
  g.ellipse(560, 1288, 330, 48, 0, 0, Math.PI * 2);
  g.fillStyle = "rgba(255,220,170,0.18)";
  g.fill();
}

function programa(g, x, y, w, h, t, era) {
  g.save();
  caja(g, x, y, w, h, 16);
  g.clip();
  const cielo = g.createLinearGradient(x, y, x, y + h);
  cielo.addColorStop(0, k.mezColor("#7ec8ff", "#16305a", era * 0.15));
  cielo.addColorStop(1, "#f4c56a");
  g.fillStyle = cielo;
  g.fillRect(x, y, w, h);
  const dx = Math.sin(t * 0.7) * 18;
  g.fillStyle = "#ef6a3a";
  g.beginPath();
  g.arc(x + w * 0.72 + dx, y + h * 0.62, h * 0.16, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#2f9a4a";
  g.beginPath();
  g.ellipse(x + w * 0.4, y + h * 0.82, w * 0.55, h * 0.28, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.beginPath();
  g.ellipse(x + w * 0.38, y + h * 0.28, w * 0.22, h * 0.12, -0.4, 0, Math.PI * 2);
  g.fill();
  if (era < 0.6) {
    g.fillStyle = "rgba(0,0,0,0.13)";
    for (let i = 0; i < h; i += 5) g.fillRect(x, y + i, w, 2);
  }
  g.restore();
  // cristal
  g.save();
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.35;
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.moveTo(x + 20, y + 16);
  g.lineTo(x + w * 0.42, y + 16);
  g.lineTo(x + 20, y + h * 0.55);
  g.fill();
  g.restore();
}

function numero(g, x, y, tam, a, b, u) {
  g.save();
  const w = tam * 1.35, h = tam * 1.05;
  caja(g, x - w / 2, y - h / 2, w, h, tam * 0.16);
  g.fillStyle = "rgba(16,8,6,0.88)";
  g.fill();
  g.clip();
  g.font = `700 ${Math.round(tam)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#fff3d4";
  const dy = su(u) * h;
  g.globalAlpha = 1 - su(u);
  g.fillText(String(a), x, y + tam * 0.06 - dy);
  g.globalAlpha = su(u);
  g.fillText(String(b), x, y + tam * 0.06 + h - dy);
  g.restore();
}

function tele(g, t, era, num, oido, ojo) {
  const x = 540, y = mez(900, 800, era);
  const cw = mez(760, 700, era), ch = mez(820, 470, era);
  const ix = x - cw / 2, iy = y - ch / 2;
  sombra(g, x, iy + ch + 10, cw * 0.42, 24, 0.4);
  const madera = g.createLinearGradient(ix, iy, ix + cw, iy + ch);
  madera.addColorStop(0, k.mezColor("#a86b3c", "#1a1a1a", era));
  madera.addColorStop(0.4, k.mezColor("#e7b27a", "#2a2a2a", era));
  madera.addColorStop(1, k.mezColor("#5c3014", "#0c0c0c", era));
  caja(g, ix, iy, cw, ch, mez(28, 18, era));
  g.fillStyle = madera;
  g.fill();
  if (era < 0.85) {
    g.save();
    g.globalAlpha = 1 - era;
    g.globalCompositeOperation = "multiply";
    g.drawImage(k.manchas, ix, iy, cw, ch);
    g.restore();
  }
  const sw = mez(500, 640, era), sh = mez(310, 390, era);
  const sx = x - sw / 2, sy = mez(760, 730, era) - sh / 2;
  g.fillStyle = "#07080c";
  caja(g, sx - 14, sy - 14, sw + 28, sh + 28, 20);
  g.fill();
  programa(g, sx, sy, sw, sh, t, era);
  numero(g, x, sy + sh * 0.62, mez(118, 96, era), num.a, num.b, num.u);
  // oído / ventanita
  const ox = mez(OR[0], x, era * 0.15), oy = mez(OR[1], sy + sh + 36, era);
  const rad = mez(54, 16, era);
  g.beginPath();
  g.arc(ox, oy, rad + 8, 0, Math.PI * 2);
  g.fillStyle = k.mezColor("#d9b27a", "#111111", era);
  g.fill();
  g.save();
  g.beginPath();
  g.arc(ox, oy, rad, 0, Math.PI * 2);
  g.clip();
  g.fillStyle = "#120c14";
  g.fillRect(ox - rad, oy - rad, rad * 2, rad * 2);
  if (era < 0.5) {
    g.strokeStyle = "rgba(220,190,140,0.7)";
    g.lineWidth = 3;
    for (let i = -3; i <= 3; i++) {
      g.beginPath();
      g.moveTo(ox - rad, oy + i * 10);
      g.lineTo(ox + rad, oy + i * 10);
      g.stroke();
    }
  }
  g.restore();
  // iris
  if (oido < 0.98) {
    g.beginPath();
    g.arc(ox, oy, rad * (1.02 - 0.02 * oido), 0, Math.PI * 2);
    g.fillStyle = `rgba(40,24,16,${1 - oido})`;
    g.fill();
  }
  if (ojo > 0.02) k.brillo(g, ox, oy, 70, "violeta", ojo);
  // patas
  if (era < 0.7) {
    g.globalAlpha = 1 - era;
    g.fillStyle = "#3a2010";
    g.fillRect(ix + 40, iy + ch - 8, 26, 70);
    g.fillRect(ix + cw - 66, iy + ch - 8, 26, 70);
    g.globalAlpha = 1;
  }
}

function llave(g, ang, s) {
  g.save();
  g.rotate(ang);
  const br = g.createLinearGradient(-20, -s, 20, s * 0.2);
  br.addColorStop(0, "#8a5a1c");
  br.addColorStop(0.45, "#ffe3a4");
  br.addColorStop(1, "#a56b22");
  g.fillStyle = br;
  g.strokeStyle = "#5c3a10";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(0, -s * 0.62, s * 0.28, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = "#3a2410";
  g.beginPath();
  g.arc(0, -s * 0.62, s * 0.12, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = br;
  caja(g, -s * 0.07, -s * 0.4, s * 0.14, s * 0.85, 4);
  g.fill();
  for (let i = 0; i < 3; i++) {
    caja(g, s * 0.02, -s * 0.05 + i * s * 0.16, s * 0.16 + (i === 1 ? s * 0.06 : 0), s * 0.07, 2);
    g.fill();
  }
  g.restore();
}

function llavero(g, x, y, s, fase, amp) {
  const n = 5;
  const bases = [-1.05, -0.5, 0.05, 0.55, 1.15];
  // un fantasma de movimiento cuando se agitan
  const pasos = amp > 0.45 ? 3 : 1;
  for (let p = pasos - 1; p >= 0; p--) {
    const f = fase - p * 0.18 * amp;
    g.save();
    g.globalAlpha *= p === 0 ? 1 : 0.18;
    g.translate(x, y);
    for (let i = 0; i < n; i++) {
      const a = bases[i] + Math.sin(f + i * 1.2) * 0.62 * amp;
      llave(g, a, s);
    }
    metal(g, -s * 0.22, -s * 0.22, s * 0.44, s * 0.44, s * 0.22, "#ffe6b0", "#c4923e", "#7a4e16");
    g.beginPath();
    g.arc(0, 0, s * 0.08, 0, Math.PI * 2);
    g.fillStyle = "#3a2410";
    g.fill();
    g.restore();
  }
}

function mandoCuerpo(g, x, y, era, hunde) {
  g.save();
  g.translate(x, y);
  const w = 200, h = 460;
  sombra(g, 10, h * 0.46, 90, 22, 0.4);
  const col = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  col.addColorStop(0, k.mezColor("#fff6e4", "#2a2a2a", era));
  col.addColorStop(0.5, k.mezColor("#e7d3b0", "#111111", era));
  col.addColorStop(1, k.mezColor("#b89a68", "#000000", era));
  caja(g, -w / 2, -h / 2, w, h, 36);
  g.fillStyle = col;
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.2;
  g.drawImage(k.manchas, -w / 2, -h / 2, w, h);
  g.restore();
  const labels = [0, 1, 2, 3];
  labels.forEach((i) => {
    const by = -150 + i * 78 + (i === 0 ? hunde * 10 : 0);
    caja(g, -62, by, 124, 58, 16);
    g.fillStyle = i === 0 && hunde > 0.2 ? "#c4553a" : k.mezColor("#f7f1e6", "#3a3a3a", era);
    g.fill();
    g.fillStyle = k.mezColor("#6b4a22", "#ddd", era);
    g.fillRect(-18, by + 26, 36, 6);
  });
  // punta por donde sale la luz, arriba
  g.beginPath();
  g.arc(0, -h / 2 + 8, 10, 0, Math.PI * 2);
  g.fillStyle = era > 0.4 ? "#1a1028" : "#6b4a22";
  g.fill();
  g.restore();
}

function copa(g, x, y, ang, s = 1) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  g.fillStyle = "rgba(255,255,255,0.14)";
  g.beginPath();
  g.moveTo(-46, -120);
  g.quadraticCurveTo(-58, -20, -16, 10);
  g.lineTo(16, 10);
  g.quadraticCurveTo(58, -20, 46, -120);
  g.quadraticCurveTo(0, -100, -46, -120);
  g.fill();
  g.strokeStyle = "rgba(255,236,210,0.85)";
  g.lineWidth = 5;
  g.stroke();
  g.fillStyle = "rgba(255,186,70,0.55)";
  g.beginPath();
  g.ellipse(0, -40, 28, 12, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(220,230,240,0.9)";
  g.fillRect(-4, 8, 8, 70);
  g.beginPath();
  g.ellipse(0, 82, 36, 10, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function movil(g, x, y, s, pul) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  sombra(g, 0, 250, 90, 20, 0.4);
  caja(g, -130, -250, 260, 500, 40);
  const cg = g.createLinearGradient(-130, -250, 130, 250);
  cg.addColorStop(0, "#2a2e38");
  cg.addColorStop(1, "#0c0e14");
  g.fillStyle = cg;
  g.fill();
  caja(g, -108, -210, 216, 400, 24);
  g.fillStyle = "#10243f";
  g.fill();
  const sg = g.createLinearGradient(0, -210, 0, 80);
  sg.addColorStop(0, "#1d4e89");
  sg.addColorStop(1, "#12304f");
  g.fillStyle = sg;
  caja(g, -108, -210, 216, 250, 24);
  g.fill();
  g.fillStyle = "#ff5a3c";
  g.beginPath();
  g.arc(0, -40, 46, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f4f7ff";
  g.fillRect(-16, -52, 32, 24);
  // chevrones de canal
  g.fillStyle = "#d5e4ff";
  g.beginPath();
  g.moveTo(-70, 80);
  g.lineTo(-40, 50);
  g.lineTo(-10, 80);
  g.fill();
  g.beginPath();
  g.moveTo(10, 60);
  g.lineTo(40, 90);
  g.lineTo(70, 60);
  g.fill();
  if (pul > 0.02) k.brillo(g, 0, -40, 160, "naranja", pul);
  g.restore();
}

function paquete(g, x0, y0, x1, y1, t, t0, dur = 0.46, tope = 1) {
  const u = (t - t0) / dur;
  if (u <= 0 || u >= 1) return 0;
  const s = tope >= 0.999 ? su(u) : tope * su(Math.min(1, u / 0.45));
  const fade = tope >= 0.999 ? (u < 0.78 ? 1 : (1 - u) / 0.22) : 1 - su(tr(u, 0.28, 0.72));
  const x = mez(x0, x1, s), y = mez(y0, y1, s);
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    g.strokeStyle = `rgba(120,230,255,${0.45 * fade * (1 - i * 0.22)})`;
    g.lineWidth = 8 - i * 2;
    g.beginPath();
    g.arc(x, y, 14 + i * 18, 0, Math.PI * 2);
    g.stroke();
  }
  g.restore();
  k.brillo(g, x, y, 90, "cian", 0.65 * fade);
  return u;
}

function orbe(g, x0, y0, x1, y1, t, t0, color) {
  const u = (t - t0) / 0.5;
  if (u < 0 || u > 1) return;
  const s = su(u);
  const x = mez(x0, x1, s), y = mez(y0, y1, s);
  const bx = mez(x0, x1, su(Math.max(0, u - 0.12)));
  const by = mez(y0, y1, su(Math.max(0, u - 0.12)));
  k.brillo(g, bx, by, 36, color, 0.35 * (1 - u));
  k.brillo(g, x, y, 54, color, 0.8 * (1 - u * 0.3));
}

function estadoNum(t, eventos, base) {
  let a = base, b = base, u = 1;
  for (const e of eventos) {
    if (t < e.t) return { a, b: a, u: 1 };
    const dt = t - e.t;
    if (dt < e.d) return { a: e.a, b: e.b, u: dt / e.d };
    a = e.b;
    b = e.b;
  }
  return { a, b, u: 1 };
}

function camDe(z, x, y, t) {
  return { z: z(t), cx: x(t), cy: y(t) };
}

const zA = k.claves([[0, 2.05], [1.15, 1.72], [T.table, 1.18], [4.15, 1.18], [T.moved, 1.68], [6.4, 1.36], [T.note, 1.82], [8.35, 1.55], [8.9, 1.55]]);
const xA = k.claves([[0, 420], [1.5, 470], [T.table, 540], [4.2, 560], [T.moved, 690], [6.5, 640], [T.note, 800], [8.4, 720]]);
const yA = k.claves([[0, 1020], [T.table, 1060], [4.3, 1080], [T.moved, 1120], [6.6, 960], [T.note, 880], [8.4, 920]]);

const zB = k.claves([[C2, 1.85], [T.fool, 1.6], [T.glass, 1.55], [T.clink, 1.72], [T.stopped - 0.2, 1.4], [T.stopped, 1.7], [T.now, 1.28], [T.light, 1.34], [T.jangle2, 1.7], [T.ignores, 1.45], [T.phone, 1.85], [T.app, 2.05], [T.keys2, 1.7]]);
const xB = k.claves([[C2, 380], [T.fool, 460], [T.glass, 560], [T.clink, 580], [T.stopped, 780], [T.now, 620], [T.light, 640], [T.jangle2, 400], [T.phone, 640], [T.app, 620], [T.keys2, 500]]);
const yB = k.claves([[C2, 1080], [T.glass, 1100], [T.clink, 1080], [T.stopped, 920], [T.now, 1000], [T.jangle2, 1100], [T.phone, 1140], [T.app, 1120], [T.keys2, 1040]]);

function apertura() {
  return { z: zA(0), cx: xA(0), cy: yA(0) };
}

export function dibujaAntes(g, t) {
  const vivo = t < C1 - 0.32 ? t : C1 - 0.32;
  const cam = camDe(zA, xA, yA, Math.min(t, C1 - 0.28));
  const amp = t < 8.0 ? 1 : 1 - su(tr(t, 8.0, 8.42));
  const fase = Math.PI / 2 + vivo * 8.5;
  const num = estadoNum(t, [
    { t: -0.22, a: 4, b: 9, d: 0.7 },
    { t: T.channel - 0.06, a: 9, b: 6, d: 0.36 },
    { t: 4.72, a: 6, b: 11, d: 0.34 },
  ], 4);
  const oido = 1;
  aplica(g, cam, () => {
    pared(g);
    suelo(g);
    tele(g, vivo, 0, num, oido, 0);
    mesa(g);
    sombra(g, LL[0], LL[1] + 70, 90, 18, 0.35);
    llavero(g, LL[0], LL[1], 78, fase, amp);
    mandoCuerpo(g, MAN[0], MAN[1], 0, 0);
    const notas = [[-0.08, 0], [4.52, 0], [T.note - 0.42, 0]];
    for (const [t0] of notas) paquete(g, LL[0], LL[1], OR[0], OR[1], t, t0);
    const llega = (t0) => pulso(t, t0 + 0.46, 0.07);
    const flash = Math.max(llega(-0.08), llega(4.52), llega(T.note - 0.42));
    if (flash > 0.02 && t < C1 - 0.35) k.brillo(g, OR[0], OR[1], 120, "cian", flash);
    const chis = Math.max(pulso(t, 0.08, 0.07), pulso(t, T.channel, 0.06));
    if (chis > 0.02) k.brillo(g, LL[0], LL[1], 150, "amarilla", chis);
  });
  velo(g);
}

export function dibujaDespues(g, t) {
  const fin = v.duracion;
  const vuelta = su(tr(t, T.keys2, T.table2 + 0.15));
  let cam = camDe(zB, xB, yB, Math.min(t, T.keys2));
  const a0 = apertura();
  if (t >= T.keys2) {
    cam = { z: mez(cam.z, a0.z, vuelta), cx: mez(cam.cx, a0.cx, vuelta), cy: mez(cam.cy, a0.cy, vuelta) };
  }
  const eraBruta = su(tr(t, T.now, T.now + 0.55));
  const era = t < T.keys2 ? eraBruta : mez(eraBruta, 0, vuelta);
  const fonoBruto = su(tr(t, T.phone, T.phone + 0.55));
  const fono = t < T.keys2 ? fonoBruto : mez(fonoBruto, 0, vuelta);
  const amp = Math.max(
    t < T.fool + 0.45 ? 1 : 1 - su(tr(t, T.fool + 0.35, T.fool + 0.9)),
    su(tr(t, T.jangle2 - 0.12, T.jangle2 + 0.15)) * (1 - su(tr(t, T.ignores + 0.15, T.ignores + 0.55))),
    vuelta,
  );
  const fase = Math.PI / 2 + t * 8.2;
  let num = estadoNum(t, [
    { t: T.fool - 0.12, a: 11, b: 2, d: 0.36 },
    { t: T.clink + 0.12, a: 2, b: 8, d: 0.34 },
    { t: T.wifi - 0.08, a: 8, b: 3, d: 0.36 },
  ], 11);
  if (t > T.table2 - 0.2) num = estadoNum(t - (T.table2 - 0.15), [{ t: 0, a: 4, b: 9, d: 0.55 }], 4);
  let oido = 1 - su(tr(t, T.stopped, T.stopped + 0.48));
  if (era > 0.55) oido = 1;
  if (vuelta > 0.5) oido = 1;
  const hunde = su(tr(t, T.button - 0.04, T.button + 0.12)) * (1 - su(tr(t, T.button + 0.28, T.button + 0.5)));
  const angG = (() => {
    const u = t - (T.clink - 0.32);
    if (u < 0) return 0;
    if (u < 0.32) return su(u / 0.32) * 0.42;
    return 0.42 * Math.cos((u - 0.32) * 16) * Math.exp(-(u - 0.32) * 3.2);
  })();
  const ojo = Math.max(
    pulso(t, T.light + 0.15, 0.08),
    pulso(t, T.light + 0.42, 0.08),
    pulso(t, T.wifi, 0.1),
  ) * (t < T.keys2 ? 1 : 1 - vuelta);
  aplica(g, cam, () => {
    pared(g);
    suelo(g);
    tele(g, t, era, num, oido, ojo);
    mesa(g);
    const copasVis = t < T.keys2 ? 1 : 1 - vuelta;
    if (copasVis > 0.04) {
      g.save();
      g.globalAlpha *= copasVis;
      copa(g, GL[0], GL[1], angG);
      copa(g, GR[0], GR[1], -angG * 0.95);
      if (t > T.clink - 0.05 && t < T.clink + 0.25) k.brillo(g, (GL[0] + GR[0]) / 2, GL[1] - 40, 130, "blanca", pulso(t, T.clink, 0.06));
      g.restore();
    }
    sombra(g, LL[0], LL[1] + 70, 90, 18, 0.35);
    llavero(g, LL[0], LL[1], 78, fase, Math.max(0, Math.min(1, amp)));
    if (fono < 0.98) {
      g.save();
      g.globalAlpha *= 1 - fono;
      mandoCuerpo(g, MAN[0], MAN[1], era, hunde * (1 - fono));
      g.restore();
    }
    if (fono > 0.02) movil(g, mez(MAN[0], 620, fono), mez(MAN[1], 1160, fono), mez(0.55, 1.15, su(fono)), pulso(t, T.app, 0.2) * (t < T.keys2 ? 1 : 0));
    // notas de las llaves y del vaso, solo mientras la tele aún escucha
    if (t < T.stopped + 0.15) {
      paquete(g, LL[0], LL[1], OR[0], OR[1], t, T.jangle - 0.05);
      paquete(g, (GL[0] + GR[0]) / 2, GL[1] - 30, OR[0], OR[1], t, T.clink);
    }
    // la que se apaga a medias, cuando ya no escucha
    paquete(g, LL[0], LL[1], OR[0], OR[1], t, T.ignores - 0.35, 0.85, 0.42);
    const punta = [MAN[0], MAN[1] - 230];
    const ojoP = [mez(OR[0], 540, era), mez(OR[1], 860, era)];
    if (era > 0.4 && t < T.keys2) {
      orbe(g, punta[0], punta[1], ojoP[0], ojoP[1], t, T.light - 0.05, "violeta");
      orbe(g, punta[0], punta[1], ojoP[0], ojoP[1], t, T.light + 0.22, "violeta");
      orbe(g, punta[0], punta[1], ojoP[0], ojoP[1], t, T.light + 0.44, "violeta");
    }
    const pf = [mez(MAN[0], 620, 1), mez(MAN[1], 1160, 1) - 180];
    if (fono > 0.6 && t < T.keys2) {
      orbe(g, pf[0], pf[1], 540, 800, t, T.wifi - 0.85, "naranja");
      orbe(g, pf[0], pf[1], 540, 800, t, T.wifi - 0.55, "naranja");
      orbe(g, pf[0], pf[1], 540, 800, t, T.wifi - 0.28, "amarilla");
      orbe(g, pf[0], pf[1], 540, 800, t, T.wifi - 0.05, "naranja");
    }
    if (vuelta > 0.4) k.brillo(g, LL[0], LL[1], 150, "amarilla", (vuelta - 0.4) * pulso(t, fin - 0.35, 0.1));
  });
  velo(g, 0.8);
}

// ---------------------------------------------------------------- dentro del mando
const XS = [250, 450, 670, 890];
const HS = [460, 540, 400, 500];
const RAIL = 1360;
const GOLPES = [
  [T.hammer, T.up],
  [T.down],
  [T.sound],
  [T.power],
];

function angMartillo(t, golpes) {
  let ang = -0.95;
  for (const tg of golpes) {
    const u = t - (tg - 0.4);
    if (u < 0) return ang;
    if (u < 0.4) return mez(-0.95, 0.22, sale(u / 0.4));
    const d = t - tg;
    if (d < 0.34) return mez(0.22, -0.95, entra(d / 0.34));
    ang = -0.95;
  }
  return ang;
}

function vibra(t, golpes) {
  if (t > C2 - 0.3) return 0;
  let v0 = 0;
  for (const tg of golpes) {
    const d = t - tg;
    if (d > 0 && d < 0.85) v0 = Math.max(v0, Math.sin(d * 90) * Math.exp(-d * 3.1));
  }
  // la pasada de «four notes», sin golpe
  const p = tr(t, T.notes - 0.55, T.notes + 0.15) * (1 - tr(t, T.notes + 0.15, T.notes + 0.55));
  return v0 + p * 0.35 * Math.sin(t * 40);
}

const zD = k.claves([[C1, 2.25], [T.hammer + 0.4, 2.05], [T.forty, 1.65], [T.notes - 0.3, 1.12], [T.up, 1.02], [C2 - 0.3, 1.02]]);
const xD = k.claves([[C1, 250], [T.forty, 340], [T.notes, 540], [C2, 540]]);
const yD = k.claves([[C1, 1040], [T.forty, 980], [T.notes, 900], [C2, 880]]);

function varilla(g, x, h, vib) {
  const y = RAIL - h;
  g.save();
  g.translate(x + vib * 7, 0);
  metal(g, -16, y, 32, h, 8, "#f4f7fb", "#b7c0cc", "#7d8794");
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(-8, y + 8, 5, h - 20);
  g.restore();
}

function martillo(g, x, yPiv, ang) {
  g.save();
  g.translate(x, yPiv);
  g.rotate(ang);
  g.fillStyle = "#8d6a3a";
  g.fillRect(-7, 0, 14, 120);
  metal(g, -34, 108, 68, 36, 8, "#ffe1a4", "#d7a441", "#8a5e1c");
  g.restore();
}

function foco(g, x, y, on) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#d9dde6";
  g.fillRect(-6, 20, 12, 36);
  g.beginPath();
  g.ellipse(0, 0, 28, 36, 0, 0, Math.PI * 2);
  const vg = g.createRadialGradient(-8, -10, 4, 0, 0, 36);
  vg.addColorStop(0, on > 0.4 ? "#fff6d2" : "#6a6258");
  vg.addColorStop(1, on > 0.4 ? "#e7a04a" : "#2a241e");
  g.fillStyle = vg;
  g.fill();
  g.restore();
  if (on > 0.05) k.brillo(g, x, y, 160, "amarilla", 0.55 * on);
}

function altavoz(g, x, y, pul) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.arc(0, 0, 48, 0, Math.PI * 2);
  g.fillStyle = "#1b1e24";
  g.fill();
  g.strokeStyle = "#c5ccd6";
  g.lineWidth = 6;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, 18 + pul * 10, 0, Math.PI * 2);
  g.fillStyle = "#d5dde8";
  g.fill();
  g.restore();
  if (pul > 0.05) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,214,140,${0.4 * pul})`;
    g.lineWidth = 4;
    g.beginPath();
    g.arc(x, y, 60 + pul * 30, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }
}

export function dibujaDentro(g, t) {
  const cam = camDe(zD, xD, yD, Math.min(t, C2 - 0.26));
  const congelado = t > C2 - 0.3;
  const on = congelado ? 0 : 1 - su(tr(t, T.power, T.power + 0.28));
  const num = estadoNum(t, [
    { t: T.up - 0.02, a: 4, b: 7, d: 0.32 },
    { t: T.down - 0.02, a: 7, b: 3, d: 0.3 },
  ], 4);
  const pulsoSon = pulso(t, T.sound + 0.05, 0.12);
  aplica(g, cam, () => {
    const fondo = g.createRadialGradient(540, 900, 80, 540, 980, 900);
    fondo.addColorStop(0, on > 0.5 ? "#3a2a38" : "#1a2438");
    fondo.addColorStop(1, "#07060c");
    g.fillStyle = fondo;
    g.fillRect(-200, 200, 1600, 1500);
    // carcasa de marfil, visible al abrirse
    caja(g, 60, 400, 980, 1120, 70);
    const cg = g.createLinearGradient(60, 400, 1040, 1500);
    cg.addColorStop(0, "#f6ecda");
    cg.addColorStop(0.5, "#e4d0ae");
    cg.addColorStop(1, "#b89a6c");
    g.fillStyle = cg;
    g.fill();
    caja(g, 100, 450, 900, 1020, 50);
    g.fillStyle = on > 0.4 ? "#241820" : "#101820";
    g.fill();
    // tornillos
    for (const [sx, sy] of [[150, 500], [930, 500], [150, 1380], [930, 1380]]) {
      g.beginPath();
      g.arc(sx, sy, 12, 0, Math.PI * 2);
      g.fillStyle = "#8d7348";
      g.fill();
    }
    metal(g, 140, RAIL - 16, 820, 28, 8, "#f0d7a4", "#c4964a", "#7a5420");
    foco(g, 230, 560, on);
    altavoz(g, 860, 570, congelado ? 0 : pulsoSon);
    if (t > T.notes - 0.7) numero(g, 540, 575, 100, num.a, num.b, num.u);
    XS.forEach((x, i) => {
      const h = HS[i];
      const top = RAIL - h;
      const vib = congelado ? 0 : vibra(t, GOLPES[i]);
      varilla(g, x, h, vib);
      martillo(g, x - 10, top - 150, angMartillo(congelado ? C2 - 0.32 : t, GOLPES[i]));
      for (const tg of GOLPES[i]) {
        if (!congelado && t > tg && t < tg + 0.35) {
          k.fogonazo(g, x, top, (t - tg) * 3.2, 70, "255,236,200");
        }
      }
    });
  });
  // el 40,000, en pantalla, quieto y grande
  const al = su(tr(t, T.forty - 0.05, T.forty + 0.18)) * (1 - su(tr(t, T.thousand + 1.15, T.thousand + 1.5)));
  if (al > 0.02 && t < T.notes - 0.15) {
    g.save();
    g.globalAlpha = al;
    k.pastilla(g, 540, 690, "40,000", "", "255,244,220", 1, 120);
    g.restore();
  }
  velo(g, 0.7);
}
