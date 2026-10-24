// El salón de noche, el cuarto oscuro y la tele de 1955. La luz que no se ve es violeta; la linterna, cálida.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, entra, azar } = k;

export const APERTURA = { z: 2.15, cx: 980, cy: 210 };
export const TECHO = { x: 980, y: 150 };
export const OJO = { x: 540, y: 983 };
export const MANDO = { x: 900, y: 1380, w: 156, h: 440, ang: 0.38 };

const azG = azar(41);
export const GOTAS = Array.from({ length: 26 }, () => ({
  x: azG() * 2 - 1,
  retraso: azG(),
  v: 0.55 + azG() * 0.7,
  g: 0.65 + azG() * 0.7,
}));
const azP = azar(77);
export const POLVO = Array.from({ length: 36 }, () => ({
  u: azP(),
  lado: azP() * 2 - 1,
  v: 0.25 + azP() * 0.5,
  s: 0.4 + azP() * 0.8,
}));

export function velo(g, fuerza = 0.8) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const vg = g.createLinearGradient(0, 0, 0, 580);
  vg.addColorStop(0, `rgba(7,5,14,${fuerza})`);
  vg.addColorStop(0.62, `rgba(7,5,14,${fuerza * 0.78})`);
  vg.addColorStop(1, "rgba(7,5,14,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 600);
  g.restore();
}

function conCamara(g, cam, dibuja) {
  g.save();
  g.translate(540, 1000);
  g.scale(cam.z, cam.z);
  g.translate(-cam.cx, -cam.cy);
  dibuja();
  g.restore();
}

export function camDe(z, x, y) {
  const Z = k.claves(z), X = k.claves(x), Y = k.claves(y);
  return (t) => ({ z: Z(t), cx: X(t), cy: Y(t) });
}

export function puntaMando(x, y, ang, h = MANDO.h) {
  const ly = -h / 2 + 8;
  return [x - ly * Math.sin(ang), y + ly * Math.cos(ang)];
}

function textura(g, x, y, w, h, al, modo = "multiply") {
  g.save();
  g.globalCompositeOperation = modo;
  g.globalAlpha *= al;
  g.drawImage(k.manchas, x, y, w, h);
  g.restore();
}

function cono(g, x0, y0, x1, y1, a0, a1, color, al) {
  if (al <= 0.01) return;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
  const px = -dy / L, py = dx / L;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.beginPath();
  g.moveTo(x0 + px * a0, y0 + py * a0);
  g.lineTo(x1 + px * a1, y1 + py * a1);
  g.lineTo(x1 - px * a1, y1 - py * a1);
  g.lineTo(x0 - px * a0, y0 - py * a0);
  g.closePath();
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, `rgba(${color},${al})`);
  gr.addColorStop(0.35, `rgba(${color},${al * 0.45})`);
  gr.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

function salaNoche(g, t) {
  g.fillStyle = "#120c22";
  g.fillRect(-900, -500, 2800, 3200);
  const techo = g.createLinearGradient(0, -80, 0, 340);
  techo.addColorStop(0, "#fff6ea");
  techo.addColorStop(0.55, "#f3e2cc");
  techo.addColorStop(1, "#e7d0b4");
  g.fillStyle = techo;
  g.fillRect(-900, -80, 2800, 420);
  const lampara = g.createRadialGradient(250, 40, 20, 250, 80, 520);
  lampara.addColorStop(0, "rgba(255,214,140,0.95)");
  lampara.addColorStop(1, "rgba(255,214,140,0)");
  g.fillStyle = lampara;
  g.fillRect(-200, -80, 1100, 500);
  textura(g, -200, -40, 1600, 420, 0.18);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(-900, 330, 2800, 8);

  const muro = g.createLinearGradient(0, 340, 0, 1280);
  muro.addColorStop(0, "#2a2158");
  muro.addColorStop(0.5, "#1b1744");
  muro.addColorStop(1, "#14102e");
  g.fillStyle = muro;
  g.fillRect(-900, 338, 2800, 980);
  textura(g, -200, 360, 1600, 900, 0.12);

  // ventana de noche, a la izquierda
  g.save();
  k.redondo(g, -20, 460, 250, 340, 18);
  g.clip();
  const noche = g.createLinearGradient(0, 460, 0, 800);
  noche.addColorStop(0, "#1b3c7a");
  noche.addColorStop(1, "#0c1028");
  g.fillStyle = noche;
  g.fillRect(-20, 460, 250, 340);
  g.fillStyle = "#f6e7b4";
  g.beginPath();
  g.arc(150, 530, 28, 0, 6.3);
  g.fill();
  g.globalAlpha = 0.9;
  const az = azar(9);
  for (let i = 0; i < 5; i++) {
    g.fillStyle = i % 2 ? "#ffb15a" : "#7ee0ff";
    g.fillRect(10 + (i % 3) * 70, 620 + Math.floor(i / 3) * 80, 36, 48);
  }
  g.restore();
  k.brillo(g, 150, 530, 120, "amarilla", 0.35);

  // lámpara de pie
  g.fillStyle = "#3a2418";
  g.fillRect(120, 980, 16, 280);
  g.beginPath();
  g.moveTo(70, 860);
  g.lineTo(190, 860);
  g.lineTo(170, 1000);
  g.lineTo(90, 1000);
  g.closePath();
  g.fillStyle = "#ff5d73";
  g.fill();
  k.brillo(g, 130, 930, 220, "roja", 0.28 + 0.04 * Math.sin(t * 2));

  const suelo = g.createLinearGradient(0, 1280, 0, 1900);
  suelo.addColorStop(0, "#8a5a32");
  suelo.addColorStop(1, "#3e2414");
  g.fillStyle = suelo;
  g.fillRect(-900, 1280, 2800, 800);
  g.globalAlpha = 0.25;
  for (let i = 0; i < 14; i++) {
    g.fillStyle = i % 2 ? "#6e4424" : "#a56b3c";
    g.fillRect(-900, 1300 + i * 48, 2800, 24);
  }
  g.globalAlpha = 1;
  // alfombra
  g.save();
  k.redondo(g, 180, 1460, 760, 220, 80);
  g.fillStyle = "#c4374f";
  g.fill();
  textura(g, 180, 1460, 760, 220, 0.25);
  g.restore();
  // sofá, abajo
  g.save();
  k.redondo(g, 240, 1680, 680, 280, 70);
  g.fillStyle = "#ff6b3d";
  g.fill();
  k.redondo(g, 280, 1640, 600, 90, 40);
  g.fillStyle = "#ffd36a";
  g.fill();
  g.restore();
}

function programa(g, t, canal, w, h) {
  const paletas = [
    ["#ff4d3a", "#ffd15a", "#14b8a6"],
    ["#3d5afe", "#d946ef", "#22d3ee"],
    ["#a3e635", "#f97316", "#7c3aed"],
    ["#fb7185", "#38bdf8", "#facc15"],
  ];
  const p = paletas[Math.abs(Math.round(canal)) % paletas.length];
  const bg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  bg.addColorStop(0, p[0]);
  bg.addColorStop(0.5, p[1]);
  bg.addColorStop(1, p[2]);
  g.fillStyle = bg;
  g.fillRect(-w / 2, -h / 2, w, h);
  g.globalAlpha = 0.9;
  g.fillStyle = "#fff6ea";
  g.beginPath();
  g.arc(-w * 0.18 + Math.sin(t * 0.8) * 24, Math.cos(t * 0.6) * 20, h * 0.28, 0, 6.3);
  g.fill();
  g.fillStyle = "rgba(10,8,30,0.28)";
  g.beginPath();
  g.ellipse(w * 0.12, h * 0.22, w * 0.42, h * 0.2, 0, 0, 6.3);
  g.fill();
  g.globalAlpha = 1;
  g.fillStyle = "#102018";
  const x0 = -w * 0.35 + ((t * 40) % (w * 0.7));
  g.fillRect(x0, h * 0.05, w * 0.12, h * 0.34);
  g.fillStyle = "rgba(255,255,255,0.14)";
  for (let i = 0; i < 6; i++) g.fillRect(-w / 2, -h / 2 + ((t * 30 + i * 37) % h), w, 2);
}

function tele(g, t, canal, ojoAl, wifi) {
  const x = 540, y = 790, w = 720, h = 450;
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.fillRect(-w / 2 + 20, h / 2 - 10, w - 20, 30);
  k.redondo(g, -w / 2, -h / 2, w, h, 36);
  g.fillStyle = "#14141c";
  g.fill();
  k.metal(g, -w / 2, w / 2, ["#2a2a34", "#8e8ea0", "#1a1a22", "#c8c8d4", "#121218"]);
  g.save();
  k.redondo(g, -w / 2 + 22, -h / 2 + 22, w - 44, h - 86, 18);
  g.clip();
  programa(g, t, canal.n, w - 44, h - 86);
  g.restore();
  // el número del canal, grande, en la pantalla
  g.save();
  g.translate(w * 0.22, -10);
  g.scale(1, Math.max(0.08, canal.q));
  g.font = "800 150px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "rgba(8,6,16,0.35)";
  g.fillText(String(canal.n), 4, 6);
  g.fillStyle = "#fffaf2";
  g.fillText(String(canal.n), 0, 0);
  g.restore();
  // ojito
  g.beginPath();
  g.ellipse(0, h / 2 - 32, 64, 26, 0, 0, 6.3);
  g.fillStyle = "#07060a";
  g.fill();
  g.lineWidth = 4;
  g.strokeStyle = `rgba(190,140,255,${0.25 + ojoAl * 0.7})`;
  g.stroke();
  if (wifi > 0.05) {
    g.strokeStyle = `rgba(120,230,255,${wifi})`;
    g.lineWidth = 4;
    for (let i = 1; i <= 3; i++) {
      g.beginPath();
      g.arc(w / 2 - 70, h / 2 - 36, 8 + i * 8, -Math.PI * 0.85, -Math.PI * 0.15);
      g.stroke();
    }
  }
  g.restore();
  if (ojoAl > 0.02) k.brillo(g, OJO.x, OJO.y, 160 + 420 * ojoAl, "violeta", 0.4 + ojoAl * 0.6);
}

function cuerpoMando(g, al, haz) {
  const { w, h } = MANDO;
  g.globalAlpha *= al;
  k.redondo(g, -w / 2, -h / 2, w, h, 46);
  g.fillStyle = "#0e1018";
  g.fill();
  const cuerpo = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  cuerpo.addColorStop(0, "#d5dcf0");
  cuerpo.addColorStop(0.45, "#f7f8fc");
  cuerpo.addColorStop(1, "#9aa3bd");
  g.fillStyle = cuerpo;
  k.redondo(g, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 40);
  g.fill();
  textura(g, -w / 2, -h / 2, w, h, 0.35);
  // ventana de la luz
  g.beginPath();
  g.ellipse(0, -h / 2 + 36, 28, 16, 0, 0, 6.3);
  g.fillStyle = haz > 0.2 ? "#2a1848" : "#0a0a10";
  g.fill();
  if (haz > 0.05) k.brillo(g, 0, -h / 2 + 30, 90, "violeta", haz);
  // cruceta y botones
  g.fillStyle = "#2a3148";
  g.beginPath();
  g.arc(0, -40, 52, 0, 6.3);
  g.fill();
  g.fillStyle = "#f4f7ff";
  g.fillRect(-9, -82, 18, 84);
  g.fillRect(-42, -49, 84, 18);
  const cols = ["#ff4d6a", "#3dde7a", "#ffd15a", "#4cc3ff"];
  cols.forEach((c, i) => {
    g.fillStyle = c;
    g.beginPath();
    g.arc(-48 + (i % 4) * 32, 70, 11, 0, 6.3);
    g.fill();
  });
  g.fillStyle = "#2a3148";
  for (let i = 0; i < 4; i++) g.fillRect(-40, 110 + i * 32, 80, 18);
}

export function mando(g, x, y, ang, al, haz) {
  if (al <= 0.02) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  cuerpoMando(g, al, haz);
  g.restore();
}

function lluvia(g, t, al) {
  if (al <= 0.02) return;
  for (const d of GOTAS) {
    const u = (t * 0.7 * d.v + d.retraso) % 1;
    const x = mez(TECHO.x, OJO.x + d.x * 160, su(u));
    const y = mez(TECHO.y + 30, OJO.y, u);
    const a = al * Math.sin(u * Math.PI) * d.g;
    k.brillo(g, x, y, 70 + 40 * (1 - u), "violeta", a);
  }
}

function luzSube(g, t, est) {
  const al = est.haz;
  if (al <= 0.02) return;
  const [px, py] = puntaMando(est.mx, est.my, est.mang);
  cono(g, px, py, TECHO.x, TECHO.y, 90, 420, "190,140,255", 0.42 * al);
  k.brillo(g, TECHO.x, TECHO.y, 980, "violeta", 0.7 * al);
  k.brillo(g, TECHO.x, TECHO.y, 280, "blanca", 0.4 * al);
  for (const gt of est.golpesTecho || []) k.fogonazo(g, TECHO.x, TECHO.y, t - gt, 700, "190,140,255");
}

function luzBaja(g, t, est) {
  if (est.haz <= 0.02) return;
  lluvia(g, est.tm, est.haz);
  for (const gt of est.golpesOjo || []) k.fogonazo(g, OJO.x, OJO.y, t - gt, 460, "190,140,255");
}

function telefono(g, x, y, al, canal, pulsa) {
  if (al <= 0.02) return;
  const w = 360, h = 680;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(0, h / 2 + 16, 90, 18, 0, 0, 6.3);
  g.fill();
  k.redondo(g, -w / 2, -h / 2, w, h, 46);
  g.fillStyle = "#16181f";
  g.fill();
  k.metal(g, -w / 2, w / 2, ["#3a3d4a", "#f2f4f8", "#22242c", "#ffffff", "#2a2c34"]);
  g.save();
  k.redondo(g, -w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 36);
  g.clip();
  const fondo = g.createLinearGradient(0, -h / 2, 0, h / 2);
  fondo.addColorStop(0, "#f4f0ff");
  fondo.addColorStop(1, "#d9ecff");
  g.fillStyle = fondo;
  g.fillRect(-w / 2, -h / 2, w, h);
  g.fillStyle = "#ff5d73";
  g.beginPath();
  g.arc(0, -150, 22, 0, 6.3);
  g.fill();
  g.strokeStyle = "#241446";
  g.lineWidth = 14;
  g.lineCap = "round";
  g.beginPath();
  g.arc(0, 10, 78, 0, 6.3);
  g.stroke();
  g.fillStyle = "#241446";
  g.fillRect(-10, -78, 20, 50);
  g.fillRect(-10, 48, 20, 50);
  g.fillRect(-78, -8, 50, 20);
  g.fillRect(28, -8, 50, 20);
  // el botón que se hunde
  g.save();
  g.translate(0, -150 + pulsa * 4);
  g.fillStyle = pulsa > 0.2 ? "#ffd0d8" : "#ff5d73";
  g.beginPath();
  g.arc(0, 0, 22, 0, 6.3);
  g.fill();
  g.restore();
  g.font = "800 92px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#1a1030";
  g.fillText(String(canal), 0, 168);
  g.font = "700 28px Figtree";
  g.fillStyle = "#5b4b86";
  g.fillText("VOL", 0, -210);
  g.restore();
  k.brillo(g, 0, 0, 200, "violeta", 0.12 * al);
  g.restore();
}

function ondas(g, t, x, y, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    const u = (t * 0.8 + i / 3) % 1;
    const px = mez(x, 620, u);
    const py = mez(y - 200, OJO.y, u);
    k.brillo(g, px, py, 150, "cian", al * Math.sin(u * Math.PI));
  }
  g.restore();
}

export function escenaRebote(g, t, cam, est) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#07060e";
  g.fillRect(0, 0, 1080, 1920);
  conCamara(g, cam, () => {
    salaNoche(g, est.tm);
    luzSube(g, t, est);
    tele(g, est.tm, est.canal, est.ojo, est.wifi || 0);
    luzBaja(g, t, est);
    mando(g, est.mx, est.my, est.mang, est.mando, est.haz);
    telefono(g, est.fx, est.fy, est.movil, est.canal.n, est.pulsa || 0);
    ondas(g, est.tm, est.fx, est.fy, est.ondas || 0);
  });
  velo(g, est.velo ?? 0.8);
}

export function canalEn(t, saltos, base) {
  let n = base, q = 1;
  for (const s of saltos) {
    const u = tr(t, s.t, s.t + 0.24);
    if (t >= s.t + 0.12) n = s.a;
    if (u > 0 && u < 1) q = Math.abs(Math.cos(u * Math.PI));
  }
  return { n, q: Math.max(0.08, q) };
}

// ---------------------------------------------------------------- el cuarto oscuro
export function escenaLinterna(g, t, cam, est) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#05040a";
  g.fillRect(0, 0, 1080, 1920);
  conCamara(g, cam, () => {
    const l = est.llena;
    const techo = g.createLinearGradient(0, -40, 0, 420);
    techo.addColorStop(0, k.mezColor("#1a140e", "#fff8e8", l));
    techo.addColorStop(1, k.mezColor("#120e0c", "#ffd59a", l));
    g.fillStyle = techo;
    g.fillRect(-800, -80, 2400, 460);
    // una ventana apenas visible, para que el cuarto se entienda a oscuras
    g.globalAlpha = 0.35 + l * 0.4;
    g.fillStyle = "#8eb4d4";
    g.fillRect(80, 520, 180, 240);
    g.globalAlpha = 1;
    textura(g, -200, -20, 1400, 400, 0.12 + l * 0.12);
    const muro = g.createLinearGradient(0, 380, 0, 1500);
    muro.addColorStop(0, k.mezColor("#16120e", "#f0c48a", l));
    muro.addColorStop(1, k.mezColor("#0c0a08", "#c4844a", l));
    g.fillStyle = muro;
    g.fillRect(-800, 370, 2400, 1400);
    // el sofá apenas se adivina y luego se ve
    g.globalAlpha = 0.15 + l * 0.85;
    g.fillStyle = k.mezColor("#1a120c", "#e25b3a", l);
    k.redondo(g, 220, 1500, 700, 260, 60);
    g.fill();
    g.globalAlpha = 1;
    const [lx, ly] = [640, mez(1680, 1240, est.entra)];
    cono(g, lx, ly - 240, 520, 150, 40, 260 + 280 * est.haz, "255,220,150", 0.35 + 0.6 * est.haz);
    k.brillo(g, 520, 160, 360 + 700 * est.llena, "amarilla", 0.35 + 0.65 * Math.max(est.haz, est.llena));
    g.save();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = `rgba(255,196,110,${est.llena * 0.28})`;
    g.fillRect(-800, -80, 2400, 1900);
    g.restore();
    if (est.golpe != null) k.fogonazo(g, 520, 170, t - est.golpe, 780, "255,220,160");
    // polvo en el haz
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const d of POLVO) {
      const u = (est.tm * 0.35 * d.v + d.u) % 1;
      const x = mez(lx, 520 + d.lado * 180, u);
      const y = mez(ly - 180, 180, u);
      k.brillo(g, x, y, 16 * d.s, "amarilla", est.haz * 0.45 * Math.sin(u * Math.PI));
    }
    g.restore();
    // la linterna
    g.save();
    g.translate(lx, ly);
    g.rotate(-0.18);
    g.globalAlpha = est.entra;
    k.redondo(g, -70, -280, 140, 360, 36);
    k.metal(g, -70, 70, ["#6a5130", "#fff1c8", "#c9a15a", "#fffaf0", "#4a3418"]);
    g.beginPath();
    g.ellipse(0, -280, 78, 36, 0, 0, 6.3);
    g.fillStyle = "#fff6d8";
    g.fill();
    k.brillo(g, 0, -300, 260, "amarilla", 0.95);
    g.restore();
  });
  velo(g, 0.72);
}

// ---------------------------------------------------------------- 1955: cuatro esquinas
const CRT = { x: 540, y: 760, w: 560, h: 400 };
export const ESQUINA = { x: CRT.x + CRT.w / 2 - 36, y: CRT.y - CRT.h / 2 + 36 };

function celula(g, x, y, on) {
  g.beginPath();
  g.arc(x, y, 46, 0, 6.3);
  g.fillStyle = on > 0.4 ? "#fff6d0" : "#140e0a";
  g.fill();
  g.lineWidth = 7;
  g.strokeStyle = on > 0.4 ? "#ffe08a" : "#8a6a3a";
  g.stroke();
  if (on > 0.05) k.brillo(g, x, y, 280, "amarilla", on);
}

export function escenaEsquina(g, t, cam, est) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#1a0e0a";
  g.fillRect(0, 0, 1080, 1920);
  conCamara(g, cam, () => {
    const pared = g.createLinearGradient(0, 0, 0, 1600);
    pared.addColorStop(0, "#e8b56a");
    pared.addColorStop(0.45, "#c47a38");
    pared.addColorStop(1, "#8d4c22");
    g.fillStyle = pared;
    g.fillRect(-800, -200, 2600, 2000);
    textura(g, -200, 0, 1500, 1200, 0.16);
    // un cuadro a la derecha: si el haz falla, pega aquí y la tele no se entera
    g.save();
    g.translate(1120, 520);
    g.fillStyle = "#5c3014";
    g.fillRect(-78, -100, 156, 200);
    g.fillStyle = k.mezColor("#1d4e89", "#fff1c4", est.fallo);
    g.fillRect(-62, -84, 124, 168);
    g.fillStyle = k.mezColor("#f2c14e", "#f0a020", est.fallo);
    g.beginPath();
    g.arc(0, 10, 36, 0, 6.3);
    g.fill();
    g.restore();
    if (est.fallo > 0.2) k.brillo(g, 1120, 520, 480 * est.fallo, "amarilla", est.fallo * 0.9);
    // mueble
    g.save();
    g.translate(CRT.x, CRT.y + 40);
    k.redondo(g, -400, -340, 800, 760, 28);
    g.fillStyle = "#6b3a18";
    g.fill();
    const madera = g.createLinearGradient(-400, 0, 400, 0);
    madera.addColorStop(0, "#4e2810");
    madera.addColorStop(0.4, "#c4843c");
    madera.addColorStop(0.55, "#8a4e1e");
    madera.addColorStop(1, "#3f200c");
    g.fillStyle = madera;
    k.redondo(g, -380, -320, 760, 720, 22);
    g.fill();
    textura(g, -380, -320, 760, 720, 0.22);
    // pantalla curva
    g.beginPath();
    g.ellipse(0, -40, CRT.w / 2, CRT.h / 2, 0, 0, 6.3);
    g.save();
    g.clip();
    const acierto = est.acierto;
    const show = g.createLinearGradient(-200, -200, 200, 200);
    show.addColorStop(0, k.mezColor("#0e7490", "#1d4ed8", acierto));
    show.addColorStop(1, k.mezColor("#14532d", "#f59e0b", acierto));
    g.fillStyle = show;
    g.fillRect(-300, -250, 600, 500);
    g.fillStyle = "rgba(255,244,220,0.9)";
    g.beginPath();
    g.arc(-30 + Math.sin(est.tm * 0.8) * 36, 20, 80, 0, 6.3);
    g.fill();
    g.font = "800 120px Figtree";
    g.textAlign = "center";
    g.fillStyle = "#fffaf0";
    g.fillText(String(est.canal), 40, -20);
    g.restore();
    // cristal
    g.strokeStyle = "rgba(255,255,255,0.35)";
    g.lineWidth = 10;
    g.beginPath();
    g.ellipse(-40, -70, 120, 70, -0.4, 0.4, 2.2);
    g.stroke();
    // dial
    g.save();
    g.translate(300, 250);
    g.rotate(est.dial);
    g.beginPath();
    g.arc(0, 0, 54, 0, 6.3);
    k.metal(g, -54, 54, ["#8a5a22", "#ffe7b0", "#d7a441", "#fff6dd", "#6b4014"]);
    g.fillStyle = "#2a140c";
    g.fillRect(-4, -48, 8, 28);
    g.restore();
    g.font = "800 42px Figtree";
    g.textAlign = "center";
    g.fillStyle = "#fff1d0";
    g.fillText(String(est.canal), 300, 250);
    g.restore();
    // las cuatro células, en las esquinas de la pantalla
    const pts = [
      [CRT.x - CRT.w / 2 + 36, CRT.y - CRT.h / 2 + 8],
      [ESQUINA.x, ESQUINA.y],
      [CRT.x - CRT.w / 2 + 36, CRT.y + CRT.h / 2 - 70],
      [CRT.x + CRT.w / 2 - 36, CRT.y + CRT.h / 2 - 70],
    ];
    pts.forEach((p, i) => celula(g, p[0], p[1], i === 1 ? est.acierto : 0.15));
    // el haz de la linterna
    const fx = 860, fy = 1240;
    if (est.haz > 0.02) {
      cono(g, fx, fy - 160, est.bx, est.by, 28, 90, "255,236,190", 0.8 * est.haz);
      k.brillo(g, est.bx, est.by, 160, "blanca", 0.55 * est.haz);
    }
    if (est.golpe != null) k.fogonazo(g, ESQUINA.x, ESQUINA.y, t - est.golpe, 360, "255,230,170");
    // linterna de metal, grande
    g.save();
    g.translate(fx, fy);
    g.rotate(-0.55 + est.fallo * 0.45);
    g.globalAlpha = est.llega;
    k.redondo(g, -38, -200, 76, 230, 20);
    k.metal(g, -38, 38);
    g.beginPath();
    g.ellipse(0, -200, 48, 22, 0, 0, 6.3);
    g.fillStyle = "#fffaf0";
    g.fill();
    k.brillo(g, 0, -210, 100, "blanca", 0.7 * est.haz);
    g.restore();
  });
  velo(g, 0.66);
}
