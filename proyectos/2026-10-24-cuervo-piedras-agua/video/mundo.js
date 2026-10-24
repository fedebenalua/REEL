// La mesa, el vaso, el cuervo y la cocina. Todo sale de t: nada se guarda de un fotograma al siguiente.
import * as k from "#kit";
import { v } from "#voz";

const { suave: su, tramo: tr, mez, pulso, azar, lienzo } = k;

const AZ = azar(20241024);
const GOTAS = Array.from({ length: 28 }, () => ({
  a: AZ() * 6.2832,
  v: 80 + AZ() * 220,
  vy: -(80 + AZ() * 260),
  s: 3 + AZ() * 5,
  g: 0.4 + AZ() * 0.6,
}));
const ARENA = Array.from({ length: 70 }, () => ({
  x: AZ() * 2 - 1,
  y: AZ(),
  r: 0.04 + AZ() * 0.09,
  c: AZ(),
}));
const BURBUJAS = Array.from({ length: 14 }, () => ({
  x: AZ() * 2 - 1,
  p: AZ(),
  s: 0.03 + AZ() * 0.04,
  v: 0.15 + AZ() * 0.35,
}));

export function velo(g, fuerza = 0.78) {
  const lg = g.createLinearGradient(0, 220, 0, 540);
  lg.addColorStop(0, `rgba(8,6,14,${fuerza})`);
  lg.addColorStop(0.55, `rgba(8,6,14,${fuerza * 0.45})`);
  lg.addColorStop(1, "rgba(8,6,14,0)");
  g.fillStyle = lg;
  g.fillRect(0, 0, 1080, 560);
}

function fondo(g) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#140e1c");
  bg.addColorStop(0.42, "#241433");
  bg.addColorStop(1, "#07060c");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
}

function mesa(g, y, ancho) {
  g.save();
  g.beginPath();
  g.moveTo(540 - ancho, y);
  g.lineTo(540 + ancho, y);
  g.lineTo(540 + ancho + 180, 1960);
  g.lineTo(540 - ancho - 180, 1960);
  g.closePath();
  const m = g.createLinearGradient(0, y, 0, 1860);
  m.addColorStop(0, "#6a4630");
  m.addColorStop(0.08, "#3a2418");
  m.addColorStop(1, "#1a100c");
  g.fillStyle = m;
  g.fill();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.45;
  g.drawImage(k.red, 200, y, 700, 500);
  g.restore();
  g.save();
  const br = g.createLinearGradient(300, y, 780, y + 40);
  br.addColorStop(0, "rgba(255,220,170,0)");
  br.addColorStop(0.5, "rgba(255,214,160,0.28)");
  br.addColorStop(1, "rgba(255,220,170,0)");
  g.fillStyle = br;
  g.fillRect(220, y - 6, 640, 18);
  g.restore();
}

function foco(g, x, y, r, al) {
  g.save();
  const rg = g.createRadialGradient(x, y, 20, x, y, r);
  rg.addColorStop(0, `rgba(255,214,160,${0.22 * al})`);
  rg.addColorStop(1, "rgba(255,214,160,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

function caminoVaso(g, x, top, bot, rw) {
  g.beginPath();
  g.moveTo(x - rw, top + 8);
  g.lineTo(x - rw, bot - rw * 0.35);
  g.quadraticCurveTo(x - rw, bot, x, bot + rw * 0.12);
  g.quadraticCurveTo(x + rw, bot, x + rw, bot - rw * 0.35);
  g.lineTo(x + rw, top + 8);
  g.closePath();
}

function comida(g, x, y, s, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.scale(s, s);
  g.beginPath();
  g.ellipse(0, 8, 34, 12, 0, 0, 6.28);
  const ck = g.createLinearGradient(-30, 0, 30, 16);
  ck.addColorStop(0, "#a67c52");
  ck.addColorStop(0.5, "#f0d2a4");
  ck.addColorStop(1, "#8a6240");
  g.fillStyle = ck;
  g.fill();
  g.beginPath();
  k.redondo(g, -22, -28, 44, 36, 8);
  const mg = g.createLinearGradient(-20, -28, 22, 8);
  mg.addColorStop(0, "#ff6a62");
  mg.addColorStop(0.45, "#c42838");
  mg.addColorStop(1, "#6e1020");
  g.fillStyle = mg;
  g.fill();
  g.globalCompositeOperation = "screen";
  g.fillStyle = "rgba(255,180,160,0.35)";
  g.beginPath();
  g.ellipse(-6, -16, 10, 6, -0.4, 0, 6.28);
  g.fill();
  g.restore();
}

function hielo(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.beginPath();
  k.redondo(g, -26, -22, 52, 40, 8);
  const hg = g.createLinearGradient(-26, -22, 26, 18);
  hg.addColorStop(0, "rgba(236,248,255,0.95)");
  hg.addColorStop(0.5, "rgba(180,220,245,0.85)");
  hg.addColorStop(1, "rgba(120,170,210,0.9)");
  g.fillStyle = hg;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.95)";
  g.beginPath();
  g.ellipse(0, 0, 18, 12, 0, 0, 6.28);
  g.fill();
  g.restore();
}

// Un vaso de cristal. nivel 0-1 desde el fondo. tipo: agua | arena | seco.
export function vaso(g, x, top, bot, rw, op) {
  const nivel = Math.max(0, Math.min(1, op.nivel || 0));
  const tipo = op.tipo || "agua";
  const al = op.al ?? 1;
  if (al < 0.02 || rw < 8) return;
  const alto = bot - top - 36;
  const sup = bot - 18 - alto * nivel;
  g.save();
  g.globalAlpha *= al;
  // interior
  g.save();
  caminoVaso(g, x, top, bot, rw * 0.9);
  g.clip();
  if (tipo === "arena") {
    const ag = g.createLinearGradient(0, sup, 0, bot);
    ag.addColorStop(0, "#f0d48a");
    ag.addColorStop(1, "#a8743a");
    g.fillStyle = ag;
    g.fillRect(x - rw, sup, rw * 2, bot - sup + 20);
    for (const q of ARENA) {
      const gy = sup + 16 + q.y * (bot - sup - 10);
      g.fillStyle = q.c > 0.5 ? "rgba(255,236,190,0.45)" : "rgba(120,70,30,0.35)";
      g.beginPath();
      g.ellipse(x + q.x * rw * 0.75, gy, rw * q.r, rw * q.r * 0.6, 0, 0, 6.28);
      g.fill();
    }
  } else if (tipo === "agua" && nivel > 0.02) {
    const wg = g.createLinearGradient(0, sup, 0, bot);
    wg.addColorStop(0, "rgba(120,220,255,0.55)");
    wg.addColorStop(0.25, "rgba(40,140,230,0.72)");
    wg.addColorStop(1, "rgba(8,40,110,0.92)");
    g.fillStyle = wg;
    g.fillRect(x - rw, sup, rw * 2, bot - sup + 30);
    g.globalCompositeOperation = "screen";
    g.globalAlpha *= 0.55;
    const dx = ((op.t || 0) * 40) % 180;
    g.drawImage(k.causticas, x - rw - dx, sup, rw * 3, bot - sup);
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = al;
    for (const b of BURBUJAS) {
      const yy = bot - ((op.t * b.v * 80 + b.p * alto) % (alto * nivel + 1));
      if (yy < sup) continue;
      g.strokeStyle = "rgba(230,250,255,0.45)";
      g.lineWidth = 1.5;
      g.beginPath();
      g.arc(x + b.x * rw * 0.6, yy, rw * b.s, 0, 6.28);
      g.stroke();
    }
  }
  if (op.plataforma > 0.02 && tipo !== "arena") {
    const py = mez(sup + 40, bot - 70, op.plataforma);
    g.fillStyle = "rgba(214,160,90,0.98)";
    g.fillRect(x - rw * 0.82, py, rw * 1.64, 22);
    g.fillStyle = "rgba(255,220,160,0.95)";
    g.fillRect(x - rw * 0.82, py, rw * 1.64, 6);
  }
  g.restore();
  // comida flotando, por delante del agua y detrás del cristal de delante
  if (op.comida > 0.02 && tipo === "agua") comida(g, x + (op.cx || 0), sup - 6, op.cs || 1, op.comida);
  if (op.hielo > 0.02) hielo(g, x, bot - 70, op.hielo);
  // cristal
  g.save();
  caminoVaso(g, x, top, bot, rw);
  k.vidrio(g, x - rw, x + rw, 0.55);
  g.restore();
  // borde de luz izquierda
  g.save();
  g.globalCompositeOperation = "screen";
  const lg = g.createLinearGradient(x - rw, 0, x - rw + rw * 0.45, 0);
  lg.addColorStop(0, "rgba(255,255,255,0.38)");
  lg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = lg;
  caminoVaso(g, x, top, bot, rw);
  g.fill();
  g.restore();
  // boca
  g.beginPath();
  g.ellipse(x, top + 6, rw, rw * 0.2, 0, 0, 6.28);
  g.fillStyle = "rgba(210,230,255,0.18)";
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.75)";
  g.lineWidth = 4;
  g.stroke();
  if (tipo === "agua" && nivel > 0.04) {
    g.beginPath();
    g.ellipse(x, sup, rw * 0.86, rw * 0.16, 0, 0, 6.28);
    g.fillStyle = "rgba(200,240,255,0.35)";
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.55)";
    g.lineWidth = 2;
    g.stroke();
  }
  g.restore();
}

function salpicar(g, t, t0, x, y, al = 1) {
  const u = t - t0;
  if (u < 0 || u > 0.55 || al < 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const q of GOTAS) {
    const px = x + Math.cos(q.a) * q.v * u;
    const py = y + q.vy * u * q.g + 700 * u * u;
    const a = al * (1 - u / 0.55);
    g.fillStyle = `rgba(180,230,255,${a})`;
    g.beginPath();
    g.arc(px, py, q.s, 0, 6.28);
    g.fill();
  }
  g.restore();
}

// Cuervo de perfil, pies en (x, y), mirando a la derecha. cabeza: radianes, positivo mira abajo.
export function cuervo(g, x, y, s, p = {}) {
  const al = p.al ?? 1;
  if (al < 0.02 || s < 0.04) return;
  const cabeza = p.cabeza || 0;
  const pico = p.pico || 0;
  const ala = p.ala || 0;
  const vuelo = p.vuelo || 0;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.scale(s * (p.flip ? -1 : 1), s);
  g.rotate(p.ang || 0);

  // sombra de los pies
  if (!p.sinsombra) {
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.beginPath();
    g.ellipse(10, 8, 70, 14, 0, 0, 6.28);
    g.fill();
  }

  // cola
  g.fillStyle = "#12131a";
  for (let i = 0; i < 5; i++) {
    const f = i - 2;
    g.beginPath();
    g.moveTo(-36, -78);
    g.quadraticCurveTo(-120, -70 - f * 16, -188, -58 - f * 22);
    g.quadraticCurveTo(-110, -40 - f * 10, -34, -58);
    g.fill();
  }
  g.strokeStyle = "rgba(90,140,220,0.35)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(-40, -70);
  g.quadraticCurveTo(-120, -78, -180, -60);
  g.stroke();

  // patas
  const pata = (sx) => {
    g.strokeStyle = "#1a120e";
    g.lineWidth = 7;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(sx, -40);
    g.lineTo(sx + 4, -8);
    g.stroke();
    g.lineWidth = 4;
    for (const a of [-0.7, -0.15, 0.45]) {
      g.beginPath();
      g.moveTo(sx + 4, -6);
      g.lineTo(sx + 4 + Math.cos(a) * 22, -6 + Math.sin(a) * 10);
      g.stroke();
    }
  };
  pata(-8);
  pata(24);

  // cuerpo
  g.save();
  g.beginPath();
  g.ellipse(-6, -118, 86, 62, -0.35, 0, 6.28);
  g.clip();
  const cg = g.createRadialGradient(-30, -150, 10, -6, -110, 120);
  cg.addColorStop(0, "#8ea0b8");
  cg.addColorStop(0.28, "#3c4454");
  cg.addColorStop(1, "#151820");
  g.fillStyle = cg;
  g.fillRect(-120, -200, 240, 180);
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.4;
  g.drawImage(k.manchas, -100, -180, 200, 160);
  g.restore();
  g.globalAlpha = al;
  g.save();
  g.strokeStyle = "rgba(190,220,255,0.85)";
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(-6, -118, 86, 62, -0.35, 0, 6.28);
  g.stroke();
  g.restore();
  // pecho
  g.fillStyle = "#5c6574";
  g.beginPath();
  g.ellipse(40, -100, 36, 42, 0.4, 0, 6.28);
  g.fill();

  // ala
  g.save();
  g.translate(-16, -124);
  g.rotate(-0.55 - ala * 0.9 + Math.sin(vuelo) * 0.55);
  g.fillStyle = "#101218";
  g.beginPath();
  g.moveTo(10, 10);
  g.quadraticCurveTo(-20, -70, 30, -108);
  g.quadraticCurveTo(90, -80, 74, -10);
  g.quadraticCurveTo(40, 16, 10, 10);
  g.fill();
  g.globalCompositeOperation = "screen";
  g.fillStyle = "rgba(70,120,230,0.28)";
  g.beginPath();
  g.ellipse(30, -50, 28, 46, -0.6, 0, 6.28);
  g.fill();
  g.globalCompositeOperation = "source-over";
  g.fillStyle = "#0a0c10";
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.ellipse(18 + i * 12, -20 + i * 8, 16, 34, -0.5 + i * 0.05, 0, 6.28);
    g.fill();
  }
  g.restore();

  // cabeza
  g.save();
  g.translate(48, -168);
  g.rotate(cabeza);
  g.beginPath();
  g.ellipse(6, -8, 38, 34, 0, 0, 6.28);
  const hg = g.createRadialGradient(-8, -20, 4, 6, -8, 48);
  hg.addColorStop(0, "#c5d0e0");
  hg.addColorStop(0.35, "#3a4150");
  hg.addColorStop(1, "#12141a");
  g.fillStyle = hg;
  g.fill();
  // pico, en dos piezas si se abre
  const ab = pico * 10;
  g.fillStyle = "#1c140e";
  g.beginPath();
  g.moveTo(28, -14);
  g.quadraticCurveTo(90, -28, 128, -6 - ab);
  g.quadraticCurveTo(70, -4, 30, -4);
  g.fill();
  g.beginPath();
  g.moveTo(30, -2);
  g.quadraticCurveTo(78, 2 + ab, 120, 4 + ab * 0.6);
  g.quadraticCurveTo(70, 8 + ab, 32, 6);
  g.fill();
  g.strokeStyle = "rgba(255,220,170,0.35)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(36, -12);
  g.quadraticCurveTo(80, -18, 112, -8);
  g.stroke();
  // ojo
  g.fillStyle = "#f4f7fb";
  g.beginPath();
  g.ellipse(16, -12, 9, 9, 0, 0, 6.28);
  g.fill();
  g.fillStyle = "#1a120c";
  g.beginPath();
  g.arc(18, -12, 4.5, 0, 6.28);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(16, -14, 1.7, 0, 6.28);
  g.fill();
  g.restore();

  if (p.brillo > 0.02) {
    g.save();
    g.globalCompositeOperation = "screen";
    g.fillStyle = `rgba(140,180,255,${0.35 * p.brillo})`;
    g.beginPath();
    g.ellipse(20, -150, 40, 24, -0.6, 0, 6.28);
    g.fill();
    g.restore();
  }
  g.restore();
}

// El dedo entra desde arriba: la uña es la punta, abajo.
function dedo(g, x, punta, largo, al = 1) {
  g.save();
  g.globalAlpha *= al;
  g.translate(x, punta);
  const piel = g.createLinearGradient(-22, 0, 22, 0);
  piel.addColorStop(0, "#c48468");
  piel.addColorStop(0.42, "#ffd8c0");
  piel.addColorStop(1, "#a86c54");
  g.fillStyle = piel;
  k.redondo(g, -22, -largo, 44, largo - 8, 20);
  g.fill();
  g.fillStyle = "#f7e8e0";
  k.redondo(g, -16, -16, 32, 26, 10);
  g.fill();
  g.restore();
}

function puntaPico(x, y, s, cabeza) {
  const c = Math.cos(cabeza), sn = Math.sin(cabeza);
  const bx = 118, by = -4;
  const rx = bx * c - by * sn, ry = bx * sn + by * c;
  return [x + (48 + rx) * s, y + (-168 + ry) * s];
}

function manoNina(g, x, y, s, abre) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  const piel = g.createLinearGradient(0, -40, 0, 80);
  piel.addColorStop(0, "#ffd0b0");
  piel.addColorStop(1, "#e09878");
  g.fillStyle = piel;
  k.redondo(g, -34, 10, 68, 120, 24);
  g.fill();
  for (let i = 0; i < 4; i++) {
    g.save();
    g.translate(-24 + i * 16, 8);
    g.rotate(abre * (i - 1.5) * 0.15);
    k.redondo(g, -7, -78, 16, 82, 8);
    g.fill();
    g.restore();
  }
  // pulgar
  g.beginPath();
  g.ellipse(-40, 20, 12, 22, 0.8, 0, 6.28);
  g.fill();
  g.restore();
}

function pista(t, keys) {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i].t) {
      const a = keys[i - 1], b = keys[i], u = su(tr(t, a.t, b.t));
      return { x: mez(a.x, b.x, u), y: mez(a.y, b.y, u), z: mez(a.z, b.z, u) };
    }
  }
  return { ...keys[keys.length - 1] };
}

function conCamara(g, cam, fn) {
  g.save();
  g.translate(540, 980);
  g.scale(cam.z, cam.z);
  g.translate(-cam.x, -cam.y);
  fn();
  g.restore();
}

// Geometría estable del vaso de agua.
const TX = 690, TOP = 610, BOT = 1400, RW = 128;
const MESA = 1365;

export function pintarLab(g, t) {
  const f = (n) => v.frase(n);
  const Tpic = f(1).t("pico"), Talc = f(1).t("alcanza");
  const Tflot = f(2).t("flota"), Thielo = f(2).t("hielo");
  const Tmira = f(3).t("mira"), Tpied = f(3).t("piedras");
  const Tpicot = f(4).t("picotea"), Tmarcha = f(4).t("marcha");
  const Tseis = f(5).t("seis"), Tvasos = f(5).t("vasos");
  const Tagua6 = f(6).t("agua"), Tarena = f(6).t("arena");
  const Tpiedra = f(7).t("piedra"), Tplat = f(7).t("plataforma");
  const Tagua8 = f(8).t("agua");
  const Thund = f(9).t("hunden"), Tflot9 = f(9).t("flotan");
  const Tcor = f(10).t("corcho");
  const Tcuatro = f(11).t("cuatro"), Tagua11 = f(11).t("agua");
  const Tsube = f(12).t("sube"), Tpico12 = f(12).t("pico");
  const Tsueltan = f(13).t("sueltan"), Testre = f(13).t("estrecho");
  const Tnino = f(14).t("nino");
  const Tpicotea = f(15).t("picotea");

  const cam = pista(t, [
    { t: 0, x: 700, y: 1040, z: 2.15 },
    { t: Tpic, x: 710, y: 1100, z: 2.05 },
    { t: Talc + 0.2, x: 700, y: 1120, z: 1.9 },
    { t: Tflot + 0.1, x: 700, y: 1120, z: 1.9 },
    { t: Thielo - 0.35, x: 640, y: 1080, z: 1.28 },
    { t: Thielo, x: 640, y: 1080, z: 1.28 },
    // vuelta de la cocina: el plano 3 empieza en Mira, ya asentado
    { t: Tmira, x: 560, y: 1040, z: 1.22 },
    { t: Tmarcha + 0.6, x: 560, y: 1040, z: 1.22 },
    { t: Tvasos, x: 560, y: 1060, z: 1.02 },
    { t: Tpiedra - 0.2, x: 560, y: 1060, z: 1.02 },
    { t: Tpiedra + 0.3, x: 690, y: 1040, z: 1.45 },
    { t: Tagua8 + 0.2, x: 660, y: 1060, z: 1.35 },
    { t: Thund - 0.15, x: 540, y: 1120, z: 0.98 },
    { t: Tcor - 0.1, x: 540, y: 1120, z: 0.98 },
    { t: Tcor + 0.25, x: 690, y: 1000, z: 1.7 },
    { t: Tcuatro - 0.15, x: 620, y: 1080, z: 1.05 },
    { t: Tagua11, x: 660, y: 1060, z: 1.2 },
    { t: Tsube - 0.05, x: 690, y: 1020, z: 1.55 },
    { t: Tpico12, x: 700, y: 960, z: 1.7 },
    { t: Tsueltan - 0.1, x: 640, y: 1080, z: 1.15 },
    { t: Testre, x: 560, y: 1080, z: 0.92 },
    { t: Tnino - 0.1, x: 540, y: 1100, z: 0.9 },
    { t: Tnino + 0.4, x: 540, y: 1100, z: 0.95 },
    { t: Tpicotea - 0.4, x: 660, y: 1000, z: 1.15 },
    { t: Tpicotea + 0.15, x: 700, y: 940, z: 1.85 },
    { t: 60, x: 700, y: 930, z: 1.9 },
  ]);

  // --- qué hay en la mesa
  const entrenamiento = su(tr(t, Tpiedra - 0.15, Tpiedra + 0.45));
  const aguaVuelve = su(tr(t, Tagua8 - 0.05, Tagua8 + 0.7));
  const enSeco = entrenamiento * (1 - aguaVuelve);
  const drenar = su(tr(t, Tpiedra - 0.15, Tpiedra + 0.4));
  let nivel = 0.3;
  if (t < Tagua8) nivel = mez(0.3, 0, drenar);
  else if (t < Tcuatro) nivel = mez(0, 0.3, aguaVuelve);
  else {
    const subidas = [Tcuatro + 0.08, Tcuatro + 0.42, Tagua11 + 0.08, Tsube + 0.05];
    for (const ts of subidas) nivel += 0.13 * su(tr(t, ts, ts + 0.26));
  }
  if (t < Tflot) nivel = 0.2;

  // vaso de arena: aparece en la frase 6
  const arenaAl = su(tr(t, Tvasos - 0.1, Tvasos + 0.35)) * (1 - su(tr(t, Tpiedra - 0.3, Tpiedra + 0.2))) * (t < Tnino ? 1 : 1 - su(tr(t, Tnino, Tnino + 0.4)));
  const arenaOtraVez = su(tr(t, Thund - 0.2, Thund + 0.25)) * (1 - su(tr(t, Tcor - 0.15, Tcor + 0.15)));
  let muestraArena = Math.max(arenaAl, arenaOtraVez);
  muestraArena *= 1 - su(tr(t, Tcor - 0.45, Tcor - 0.08));
  if (t >= Tcuatro - 0.15 && t < Testre) muestraArena = Math.max(muestraArena, su(tr(t, Tcuatro - 0.1, Tcuatro + 0.25)));
  if (t > Testre - 0.35) muestraArena *= 1 - su(tr(t, Testre - 0.3, Testre + 0.05));
  const arenaFinal = su(tr(t, Tpicotea - 0.45, Tpicotea));

  // estrecho / ancho en la frase 13
  const modoEstrecho = su(tr(t, Testre - 0.05, Testre + 0.35)) * (1 - su(tr(t, Tnino - 0.05, Tnino + 0.3)));

  const ninoAl = su(tr(t, Tnino - 0.05, Tnino + 0.35)) * (1 - su(tr(t, Tpicotea - 0.55, Tpicotea - 0.1)));

  // cuervos de fondo
  const grupo = su(tr(t, Tseis, Tseis + 0.45)) * (1 - su(tr(t, Tpiedra - 0.35, Tpiedra)));

  // cabeza del cuervo: mira las piedras, luego el vaso, luego coge
  let cabeza = 0.55;
  cabeza = mez(cabeza, 1.05, su(tr(t, Tpied, Tpied + 0.35)));
  cabeza = mez(cabeza, 0.35, su(tr(t, Tseis, Tvasos)));
  cabeza = mez(cabeza, 0.95, su(tr(t, Tcor, Tcor + 0.3)));
  cabeza = mez(cabeza, 1.25, su(tr(t, Tpico12 - 0.15, Tpico12 + 0.12)));
  cabeza = mez(cabeza, 0.7, su(tr(t, Tsueltan, Tsueltan + 0.3)));
  const coge = su(tr(t, Tpico12 - 0.05, Tpico12 + 0.18));
  const tieneComida = coge * (1 - su(tr(t, Tsueltan - 0.05, Tsueltan + 0.15))) + su(tr(t, Tpicotea - 0.4, Tpicotea));

  // pico del hook: se clava y frena
  const lunge = su(tr(t, 0, Talc));
  const cabezaHook = mez(0.4, 0.82, lunge);
  const enHook = t < Thielo;

  fondo(g);
  conCamara(g, cam, () => {
    foco(g, 640, 1000, 700, 1);
    mesa(g, MESA, 520);

    // piedras en la mesa (las dos clases), desde la frase 3, y claras en la 9
    const piedrasAl = su(tr(t, Tpied - 0.05, Tpied + 0.4));
    const blancasAl = su(tr(t, Tflot9 - 0.1, Tflot9 + 0.35));
    if (t > Tpied - 0.2 && t < Tpiedra) {
      for (let i = 0; i < 4; i++) {
        const cae = su(tr(t, Tpied - 0.15 + i * 0.08, Tpied + 0.35 + i * 0.08));
        const y = mez(420, MESA - 18, cae);
        k.roca(g, 430 + i * 42, y, 34, i, 4 + i, -0.2, -1, 0);
      }
    }
    if (t >= Thund - 0.2 && modoEstrecho < 0.5 && ninoAl < 0.5) {
      for (let i = 0; i < 4; i++) {
        const cae = su(tr(t, Thund - 0.05 + i * 0.07, Thund + 0.3 + i * 0.05));
        const y = mez(MESA - 380, MESA - 16, cae);
        if (piedrasAl > 0.2 || t > Thund) k.roca(g, 250 + (i % 2) * 40, y - (i > 1 ? 18 : 0), 28, i * 0.4, 8 + i, -0.3, -1, 0);
      }
      for (let i = 0; i < 3; i++) {
        const cae = su(tr(t, Tflot9 + i * 0.08, Tflot9 + 0.34 + i * 0.06));
        const reb = Math.sin(Math.min(1, Math.max(0, (t - (Tflot9 + 0.34)) * 8)) * Math.PI) * 16 * (t < Tflot9 + 0.7 ? 1 : 0);
        const y = mez(MESA - 360, MESA - 20, cae) - reb;
        k.planeta(g, 980 + i * 34, y, 22, i, -0.4, -0.8, ["#ffffff", "#d5dde8", "#8e9bb0"]);
        void blancasAl;
      }
    }

    // vasos
    const tipoPrincipal = enSeco > 0.55 ? "seco" : "agua";
    const comidaAl = (tipoPrincipal === "agua" ? 1 : 0) * (1 - tieneComida * 0.95);
    const alPrincipal = (1 - modoEstrecho) * (t > Tnino ? 1 - ninoAl * 0.15 : 1);
    vaso(g, TX, TOP, BOT, RW, {
      t, nivel, tipo: tipoPrincipal,
      comida: comidaAl, plataforma: enSeco, cs: 1.15, al: alPrincipal,
    });

    // piedras que caen al agua (frase 11) y la cuarta (frase 12)
    const lanzadas = [
      { t0: Tcuatro + 0.02, x0: 280, tubo: "agua" },
      { t0: Tcuatro + 0.38, x0: 320, tubo: "agua" },
      { t0: Tagua11 - 0.05, x0: 300, tubo: "agua" },
      { t0: Tsube - 0.08, x0: 340, tubo: "agua" },
    ];
    lanzadas.forEach((L, i) => {
      if (t < L.t0) return;
      const dur = 0.34;
      const u = Math.min(1, (t - L.t0) / dur);
      const x1 = TX + ((i % 3) - 1) * 22;
      const y1 = BOT - 80 - i * 8;
      const x = mez(L.x0, x1, u);
      const y = mez(MESA - 40, y1, u * u) - Math.sin(u * Math.PI) * 70;
      if (u < 1) k.roca(g, x, y, 24, i, 12 + i, -0.2, -1, 0);
      else k.roca(g, x1, Math.min(y1, (BOT - 18 - (BOT - TOP - 36) * nivel) + 30), 22, i, 12 + i, -0.2, -1, 0);
      if (u > 0.82 && u < 1) salpicar(g, t, L.t0 + dur * 0.82, TX, BOT - 18 - (BOT - TOP - 36) * nivel, 1);
    });
    // una a la arena
    if (t > Tagua11 && muestraArena > 0.4) {
      const u = Math.min(1, (t - Tagua11) / 0.36);
      const x = mez(980, 980, u);
      const y = mez(MESA - 200, MESA - 360, u * u);
      k.roca(g, 980, y, 24, 2, 20, -0.2, -1, 0);
      void x;
    }

    const ax = mez(1400, 980, su(tr(t, Tvasos - 0.05, Tarena)));
    const arenaVisible = Math.max(muestraArena, arenaFinal);
    if (arenaVisible > 0.03 && modoEstrecho < 0.4) {
      vaso(g, ax, TOP + 20, BOT, RW * 0.92, { t, nivel: 0.55, tipo: "arena", comida: 0, al: arenaVisible, plataforma: 0 });
    }

    // estrecho y ancho
    if (modoEstrecho > 0.05) {
      const subeEst = su(tr(t, Testre + 0.12, Testre + 0.45));
      const subeAncho = su(tr(t, Testre + 0.42, Testre + 0.75));
      vaso(g, 430, TOP, BOT, 78, { t, nivel: mez(0.36, 0.82, subeEst), tipo: "agua", comida: 1, al: modoEstrecho, cs: 0.85 });
      vaso(g, 820, TOP + 10, BOT, 168, { t, nivel: mez(0.36, 0.48, subeAncho), tipo: "agua", comida: 1, al: modoEstrecho, cs: 0.95 });
      if (subeEst > 0.2 && subeEst < 0.95) {
        const u = subeEst;
        k.roca(g, 430, mez(TOP - 80, BOT - 200, u * u), 20, 1, 30, -0.2, -1, 0);
      }
      if (t > Testre + 0.4) salpicar(g, t, Testre + 0.42, 430, TOP + 180, modoEstrecho);
    }

    // vaso de la mano del niño
    if (ninoAl > 0.03) {
      const subeN = su(tr(t, Tnino + 0.35, Tnino + 0.85));
      vaso(g, 900, TOP + 40, BOT - 20, 100, { t, nivel: mez(0.3, 0.7, subeN), tipo: "agua", comida: 0.8, al: ninoAl, cs: 0.8 });
      const suelta = su(tr(t, Tnino + 0.15, Tnino + 0.55));
      manoNina(g, 980, mez(TOP - 40, TOP + 80, su(tr(t, Tnino, Tnino + 0.35))), 1.7, mez(0, 0.85, suelta));
      if (suelta > 0.15 && suelta < 0.98) k.roca(g, 900, mez(TOP + 20, BOT - 280, suelta * suelta), 20, 1, 40, -0.2, -1, 0);
    }

    // piedra del entrenamiento
    if (enSeco > 0.2 && aguaVuelve < 0.8) {
      const u = su(tr(t, Tpiedra, Tplat));
      const y = mez(TOP - 40, BOT - 160, u * u);
      k.roca(g, TX, y, 30, 0.2, 15, -0.2, -1, 0);
      if (u > 0.92) salpicar(g, t, Tplat - 0.05, TX, BOT - 150, 0.4);
    }

    // piedra blanca que suelta
    if (t > Tsueltan - 0.05 && t < Tnino && modoEstrecho < 0.7) {
      const u = Math.min(1, Math.max(0, (t - Tsueltan) / 0.4));
      k.planeta(g, mez(520, 520, u), mez(MESA - 280, MESA - 18, u * u), 24, 0.4, -0.3, -0.8, ["#ffffff", "#e6eef8", "#9aa8ba"]);
    }

    // el cuervo
    const escala = enHook ? 1.55 : 1.25;
    let cx = enHook ? 520 : 240;
    if (!enHook) {
      cx = mez(240, 360, su(tr(t, Tpied, Tpied + 0.4)));
      cx = mez(cx, 250, su(tr(t, Tseis, Tvasos)));
    }
    const cy = enHook ? MESA - 210 : MESA + 6;
    const cabe = enHook ? cabezaHook : cabeza;
    // respiración
    const resp = 1 + Math.sin(t * 2.2) * 0.012;
    cuervo(g, cx, cy, escala * resp, {
      cabeza: cabe,
      pico: (enHook ? pulso(t, Talc, 0.08) : 0) + tieneComida * 0.35,
      al: 1,
      brillo: pulso(t, Tpied + 0.2, 0.4),
      vuelo: 0,
    });
    // la comida en el pico cuando la ha cogido
    if (tieneComida > 0.2) {
      const [px, py] = puntaPico(cx, cy, escala * resp, cabe);
      comida(g, px, py + 8, 0.85, tieneComida);
    }

    // el otro pájaro, el que se marcha
    if (t > Tpicot - 0.25 && t < Tmarcha + 1.15) {
      const u = su(tr(t, Tmarcha - 0.05, Tmarcha + 0.85));
      const px = mez(520, 1500, u);
      const py = mez(MESA - 20, 200, u * u);
      cuervo(g, px, py, 0.95, {
        cabeza: mez(1.1, 0.2, u),
        ala: 0.85,
        vuelo: t * 14,
        al: 0.55 * (1 - su(tr(t, Tmarcha + 0.7, Tmarcha + 1.15))),
        ang: -0.5 * u,
        sinsombra: true,
      });
      const golpe = pulso(t, Tpicot + 0.05, 0.08);
      if (golpe > 0.05) {
        g.save();
        g.globalCompositeOperation = "lighter";
        g.strokeStyle = `rgba(255,255,255,${golpe})`;
        g.lineWidth = 6;
        g.beginPath();
        g.arc(TX - RW, TOP + 220, 40 + golpe * 30, 0, 6.28);
        g.stroke();
        g.restore();
      }
    }

    // grupo de seis: cinco detrás del protagonista
    if (grupo > 0.03) {
      for (let i = 0; i < 5; i++) {
        cuervo(g, 180 + i * 130, MESA + 16 - (i % 2) * 30, 0.78 + (i % 3) * 0.06, {
          cabeza: 0.4 + (i % 2) * 0.3,
          al: grupo * 0.95,
          flip: i % 2 === 0,
        });
      }
    }
  });

  // rayas de cristal solo mientras la cámara baja en el hook
  const viaje = su(tr(t, 0, 0.15)) * (1 - su(tr(t, Talc - 0.05, Talc + 0.25)));
  if (viaje > 0.05 && t < Thielo) {
    g.save();
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 8; i++) {
      const x = 180 + i * 100 + Math.sin(t * 3 + i) * 16;
      g.strokeStyle = `rgba(190,230,255,${0.08 * viaje})`;
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(x, 500);
      g.lineTo(x + 30, 1500);
      g.stroke();
    }
    g.restore();
  }

  velo(g, enHook ? 0.82 : 0.7);
}

function saleSuave(u) { return u * u; }

export function pintarCocina(g, t) {
  const f2 = v.frase(2);
  const Tllega = f2.t("llega");
  const entraC = f2.t("hielo");
  // Una cocina de casa, cálida: se tiene que ver distinta del laboratorio desde el primer fotograma.
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#ffd7a8");
  bg.addColorStop(0.35, "#f3a56a");
  bg.addColorStop(1, "#7a3b28");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  // azulejos
  g.save();
  g.globalAlpha = 0.18;
  g.strokeStyle = "#fff";
  g.lineWidth = 3;
  for (let y = 200; y < 900; y += 90) for (let x = 40; x < 1040; x += 140) {
    g.strokeRect(x, y, 130, 80);
  }
  g.restore();
  // ventana con cielo
  g.fillStyle = "#9fd6ff";
  k.redondo(g, 760, 280, 220, 260, 18);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.fillRect(860, 280, 10, 260);
  g.fillRect(760, 400, 220, 10);
  // encimera clara
  const enc = g.createLinearGradient(0, 1280, 0, 1920);
  enc.addColorStop(0, "#efe6da");
  enc.addColorStop(1, "#b08968");
  g.fillStyle = enc;
  g.fillRect(0, 1320, 1080, 600);
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(0, 1320, 1080, 16);
  const baja = k.entra(tr(t, entraC - 0.15, Tllega));
  const punta = mez(360, 1180, baja);
  vaso(g, 540, 560, 1500, 230, { t, nivel: 0.55, tipo: "agua", comida: 0, hielo: 1.8, plataforma: 0 });
  dedo(g, 540, punta, 900, 1);
  // velo suave: la cocina es clara y el subtítulo va arriba
  velo(g, 0.55);
}
