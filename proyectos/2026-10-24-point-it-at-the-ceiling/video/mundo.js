// El salón: el mismo techo, la misma tele y el mismo aparato en todo el vídeo.
// La tele de 1955 no es otro sitio: el mueble cambia delante de la cámara.
import * as k from "#kit";
import { v } from "#voz";

const { suave: su, tramo: tr, mez, pulso } = k;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);

const SPLASH = [760, 280];
const TIP0 = [900, 680];
const RAYO = [SPLASH[0] - TIP0[0], SPLASH[1] - TIP0[1]];
const LARGO = Math.hypot(RAYO[0], RAYO[1]);
const DIR = [RAYO[0] / LARGO, RAYO[1] / LARGO];
const TIP_LEJOS = [TIP0[0] - DIR[0] * LARGO, TIP0[1] - DIR[1] * LARGO];
const SOFA_P = [520, 1260];
const TIP_VIEJO = [830, 980];
const PHONE = [500, 1040];
const VIOLETA = "190,140,255";
const CALIDA = "255,186,90";

export function era(t) {
  const sube = su(tr(t, f7.t("first") - 0.05, f7.t("hit")));
  const baja = su(tr(t, f9.t("today"), f9.t("blinks") + 0.28));
  return sube * (1 - baja);
}

export function lejos(t) {
  const ida = su(tr(t, f4.t("back"), f4.t("fainter") - 0.08));
  const vuelve = su(tr(t, f5.t("shove"), f5.t("under") + 0.05));
  return ida * (1 - vuelve);
}

export function tapa(t) {
  const entraC = su(tr(t, f5.t("under"), f5.t("out")));
  const saleC = su(tr(t, f7.t("first") - 0.25, f7.t("wireless") + 0.1));
  return entraC * (1 - saleC);
}

function alMovil(t) {
  const entraM = su(tr(t, f10.inicio - 0.08, f10.t("phone") + 0.18));
  const saleM = su(tr(t, f12.t("aims") - 0.2, f12.t("remote") + 0.12));
  return entraM * (1 - saleM);
}

function mez2(a, b, u) {
  return [mez(a[0], b[0], u), mez(a[1], b[1], u)];
}

export function punta(t) {
  const a = lejos(t);
  const b = su(tr(t, f5.t("shove"), f5.t("cushion")));
  const c = su(tr(t, f7.t("first") + 0.02, f7.t("corner") - 0.28));
  const d = su(tr(t, f9.t("today"), f9.t("blinks") + 0.22));
  let p = mez2(TIP0, TIP_LEJOS, a);
  p = mez2(p, SOFA_P, b);
  p = mez2(p, TIP_VIEJO, c);
  p = mez2(p, TIP0, d);
  return p;
}

function teleGeo(e) {
  const x = mez(16, 0, e), y = mez(530, 390, e), w = mez(390, 640, e), h = mez(370, 560, e);
  const ix = x + mez(16, 54, e), iy = y + mez(16, 60, e);
  const iw = w - mez(32, 112, e), ih = h - mez(58, 130, e);
  return { x, y, w, h, ix, iy, iw, ih };
}

function esquina(e) {
  const b = teleGeo(e);
  return [b.ix + b.iw - 28, b.iy + 28];
}

function madera(e) {
  const b = teleGeo(e);
  return [b.x + b.w - 28, b.y + 78];
}

function ventana(e) {
  const b = teleGeo(e);
  return [b.x + b.w - 22, b.y + b.h - 26];
}

function blanco(t) {
  const e = era(t);
  const llega = su(tr(t, f7.t("hit"), f7.t("corner") + 0.06));
  const falla = su(tr(t, f8.t("miss"), f8.t("sat") - 0.12));
  const desde = [1080, 760];
  const es = esquina(e), ma = madera(e);
  return [
    mez(mez(desde[0], es[0], llega), ma[0], falla),
    mez(mez(desde[1], es[1], llega), ma[1], falla),
  ];
}

function abertura(t) {
  return 1 + 0.75 * su(tr(t, f3.t("spreads") - 0.06, f3.t("flashlight") + 0.18));
}

export function canal(t) {
  if (t < f2.t("changes") + 0.04) return "4";
  if (t < f9.t("counts") + 0.04) return "11";
  if (t < f10.t("change") + 0.06) return "18";
  return "6";
}

function arranque(t) {
  const ini = 1 - su(tr(t, 0.18, 1.15));
  const fin = su(tr(t, f12.t("ceiling") - 0.08, f12.t("ceiling") + 0.35));
  return Math.max(ini, fin);
}

function conCamara(g, cam, dibuja) {
  g.save();
  g.translate(540, 1000);
  g.scale(cam.z, cam.z);
  g.translate(-cam.cx, -cam.cy);
  dibuja();
  g.restore();
}

export function aPantalla(cam, x, y) {
  return [540 + (x - cam.cx) * cam.z, 1000 + (y - cam.cy) * cam.z];
}

export function velo(g) {
  const vg = g.createLinearGradient(0, 240, 0, 560);
  vg.addColorStop(0, "rgba(28,12,18,0.78)");
  vg.addColorStop(0.42, "rgba(28,12,18,0.42)");
  vg.addColorStop(1, "rgba(28,12,18,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 580);
}

function fondo(g, t) {
  g.fillStyle = "#1a2244";
  g.fillRect(-4000, -4000, 9000, 9000);
  const techo = g.createLinearGradient(0, -800, 0, 460);
  techo.addColorStop(0, "#ffe0b0");
  techo.addColorStop(0.55, "#f0b56a");
  techo.addColorStop(1, "#c4844a");
  g.fillStyle = techo;
  g.fillRect(-2500, -1600, 6000, 2100);
  g.save();
  g.globalAlpha = 0.22;
  g.drawImage(k.manchas, -200, -80, 1800, 520);
  g.restore();
  g.fillStyle = "rgba(255,236,200,0.45)";
  g.beginPath();
  g.ellipse(760, 250, 220, 70, -0.2, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,214,160,0.35)";
  g.beginPath();
  g.ellipse(980, 340, 160, 48, 0.3, 0, Math.PI * 2);
  g.fill();
  const muro = g.createLinearGradient(0, 420, 200, 1400);
  muro.addColorStop(0, "#5c2a62");
  muro.addColorStop(0.45, "#2a3c78");
  muro.addColorStop(1, "#1a2244");
  g.fillStyle = muro;
  g.fillRect(-2500, 430, 6000, 1100);
  g.save();
  g.globalAlpha = 0.16;
  g.drawImage(k.red, -100, 430, 1700, 1000);
  g.restore();
  g.fillStyle = "#6a3a28";
  g.fillRect(-2500, 430, 6000, 18);
  const suelo = g.createLinearGradient(0, 1280, 0, 2100);
  suelo.addColorStop(0, "#c4844c");
  suelo.addColorStop(1, "#5a3018");
  g.fillStyle = suelo;
  g.fillRect(-2500, 1320, 6000, 2200);
  g.save();
  g.globalAlpha = 0.28;
  g.drawImage(k.manchas, -200, 1280, 2000, 700);
  g.restore();
  g.strokeStyle = "rgba(90,40,18,0.35)";
  g.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    g.beginPath();
    g.moveTo(-400, 1380 + i * 90);
    g.lineTo(1800, 1360 + i * 90);
    g.stroke();
  }
  k.brillo(g, 200, 1100, 480, "fuego", 0.35);
  lampara(g, t);
  planta(g, t);
}

function lampara(g, t) {
  g.save();
  g.translate(210, 1180);
  g.fillStyle = "#2a140c";
  g.fillRect(-7, -180, 14, 360);
  k.redondo(g, -78, -250, 156, 78, 24);
  const lg = g.createLinearGradient(-78, -250, 78, -170);
  lg.addColorStop(0, "#ffe7b0");
  lg.addColorStop(0.5, "#fff6d4");
  lg.addColorStop(1, "#e09040");
  g.fillStyle = lg;
  g.fill();
  g.restore();
  const pul = 0.8 + 0.2 * Math.sin(t * 2.6);
  k.brillo(g, 210, 1080, 340, "fuego", 0.55 * pul);
}

function planta(g, t) {
  g.save();
  g.translate(70, 1280);
  g.fillStyle = "#8a4030";
  k.redondo(g, 10, 20, 80, 64, 16);
  g.fill();
  const hoja = (x, y, rx, ry, ang, col) => {
    g.save();
    g.translate(x, y + Math.sin(t * 1.5 + x) * 3);
    g.rotate(ang);
    g.fillStyle = col;
    g.beginPath();
    g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };
  hoja(30, -20, 50, 20, -0.7, "#0e8a48");
  hoja(78, -40, 44, 18, 0.35, "#3ee07a");
  hoja(48, -78, 36, 16, -0.15, "#b6ffc8");
  g.restore();
}

function sofa(g) {
  g.save();
  g.translate(480, 1480);
  k.redondo(g, -460, -90, 1040, 320, 80);
  const sg = g.createLinearGradient(-460, -90, 580, 230);
  sg.addColorStop(0, "#0c7c86");
  sg.addColorStop(0.5, "#1ec4b0");
  sg.addColorStop(1, "#0a4e58");
  g.fillStyle = sg;
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.22;
  g.drawImage(k.manchas, -460, -90, 1040, 320);
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.16)";
  k.redondo(g, -400, -70, 460, 34, 16);
  g.fill();
  g.restore();
}

function cojin(g, t, cubre) {
  const x = mez(980, SOFA_P[0] + 10, su(tr(t, f5.inicio, f5.t("cushion"))));
  const y = mez(1100, SOFA_P[1] + 70, su(tr(t, f5.inicio, f5.t("out"))));
  const al = Math.max(cubre, su(tr(t, f5.inicio - 0.05, f5.t("shove") + 0.05)) * (1 - su(tr(t, f7.t("first") - 0.15, f7.t("wireless")))));
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.rotate(-0.22 + cubre * 0.2);
  k.redondo(g, -280, -190, 580, 380, 90);
  const cg = g.createLinearGradient(-240, -150, 260, 150);
  cg.addColorStop(0, "#ffc14a");
  cg.addColorStop(0.45, "#ff7a1a");
  cg.addColorStop(1, "#c2410c");
  g.fillStyle = cg;
  g.fill();
  g.save();
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.4;
  g.fillStyle = "#fff1c4";
  g.beginPath();
  g.ellipse(-30, -24, 130, 42, -0.4, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.restore();
}

function espectaculo(g, t, x, y, w, h, cual) {
  const pal = [
    ["#ff4d8d", "#ffd15c", "#3a1d8a"],
    ["#14c8b4", "#ff7a3c", "#102048"],
    ["#7cff6b", "#2450ff", "#081018"],
    ["#ff5a3c", "#ffe7c2", "#3a1020"],
  ][cual];
  const sg = g.createLinearGradient(x, y, x + w, y + h);
  sg.addColorStop(0, pal[2]);
  sg.addColorStop(0.5, pal[0]);
  sg.addColorStop(1, pal[1]);
  g.fillStyle = sg;
  g.fillRect(x, y, w, h);
  g.fillStyle = "rgba(255,255,255,0.94)";
  g.beginPath();
  g.arc(x + w * 0.36 + Math.sin(t * 0.9) * 14, y + h * 0.62, Math.min(w, h) * 0.24, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = pal[2];
  g.fillRect(x + w * 0.55, y + h * 0.22 + Math.sin(t * 1.4) * 6, w * 0.3, h * 0.1);
}

function showViejo(g, t, x, y, w, h) {
  const salto = su(tr(t, f8.t("button") - 0.02, f8.t("button") + 0.22));
  const tt = t < f8.t("sat") ? t : f8.t("sat");
  g.fillStyle = "#e4dcc8";
  g.fillRect(x, y, w, h);
  g.fillStyle = "rgba(20,16,12,0.18)";
  for (let i = 0; i < 16; i++) g.fillRect(x, y + i * (h / 16), w, 3);
  g.save();
  g.globalAlpha = 1 - salto;
  g.fillStyle = "#1a1a1a";
  g.beginPath();
  g.arc(x + w * 0.34, y + h * 0.48 + Math.sin(tt * 1.4) * 3, h * 0.2, 0, Math.PI * 2);
  g.fill();
  g.fillRect(x + w * 0.2, y + h * 0.66, w * 0.28, h * 0.22);
  g.restore();
  g.save();
  g.globalAlpha = salto;
  g.fillStyle = "#161616";
  g.fillRect(x + w * 0.12, y + h * 0.18, w * 0.76, h * 0.11);
  g.beginPath();
  g.arc(x + w * 0.66, y + h * 0.64, h * 0.16, 0, Math.PI * 2);
  g.fill();
  g.fillRect(x + w * 0.18, y + h * 0.78, w * 0.4, h * 0.08);
  g.restore();
}

function tele(g, t, e) {
  const b = teleGeo(e);
  const { x, y, w, h, ix, iy, iw, ih } = b;
  g.save();
  k.redondo(g, x, y, w, h, mez(22, 16, e));
  const marco = g.createLinearGradient(x, y, x + w, y + h);
  marco.addColorStop(0, k.mezColor("#2c3038", "#8a4e22", e));
  marco.addColorStop(0.4, k.mezColor("#12141a", "#f0d2a0", e));
  marco.addColorStop(1, k.mezColor("#3a404c", "#4a2c14", e));
  g.fillStyle = marco;
  g.fill();
  if (e > 0.15) {
    g.save();
    g.globalCompositeOperation = "multiply";
    g.globalAlpha = e * 0.4;
    g.drawImage(k.manchas, x, y, w, h);
    g.restore();
  }
  g.save();
  const curva = Math.min(iw, ih) / 2;
  k.redondo(g, ix, iy, iw, ih, mez(16, curva, e));
  g.clip();
  const funde = e <= 0.15 ? 0 : e >= 0.8 ? 1 : (e - 0.15) / 0.65;
  const uShow = funde * funde * (3 - 2 * funde);
  if (uShow < 0.98) {
    g.save();
    g.globalAlpha *= 1 - uShow;
    const cual = t < f2.t("changes") ? 0 : t < f9.t("counts") ? 1 : t < f10.t("change") ? 2 : 3;
    espectaculo(g, t, ix, iy, iw, ih, cual);
    g.restore();
  }
  if (uShow > 0.02) {
    g.save();
    g.globalAlpha *= uShow;
    showViejo(g, t, ix, iy, iw, ih);
    g.restore();
  }
  g.restore();
  g.save();
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.22;
  g.fillStyle = "#fff";
  g.beginPath();
  g.ellipse(ix + iw * 0.35, iy + ih * 0.2, iw * 0.22, ih * 0.08, -0.5, 0, Math.PI * 2);
  g.fill();
  g.restore();
  if (e < 0.55) {
    const vn = ventana(e);
    k.redondo(g, vn[0] - 16, vn[1] - 10, 36, 18, 6);
    g.fillStyle = "#140810";
    g.fill();
    const recibe = Math.max(pulso(t, f2.t("changes"), 0.12), pulso(t, f9.t("counts"), 0.12)) * (1 - e);
    if (recibe > 0.04) k.brillo(g, vn[0], vn[1], 90, "violeta", recibe);
  }
  if (e > 0.3) {
    const pts = [
      [ix + 26, iy + 26],
      [ix + iw - 26, iy + 26],
      [ix + 26, iy + ih - 26],
      [ix + iw - 26, iy + ih - 26],
    ];
    const falla = su(tr(t, f8.t("miss"), f8.t("sat") - 0.1));
    pts.forEach((p, i) => {
      const nace = su(tr(t, f7.t("wireless") + i * 0.14, f7.t("wireless") + i * 0.14 + 0.26));
      const a = nace * e;
      if (a < 0.02) return;
      const hit = i === 1 && falla < 0.85;
      g.save();
      g.globalAlpha *= a;
      g.beginPath();
      g.arc(p[0], p[1], 28, 0, Math.PI * 2);
      g.fillStyle = "#3a2410";
      g.fill();
      g.beginPath();
      g.arc(p[0], p[1], hit ? 18 : 12, 0, Math.PI * 2);
      g.fillStyle = hit ? "#fff6d4" : "#e8a04a";
      g.fill();
      g.restore();
      if (i === 1 && t > f8.t("button") - 0.12 && t < f8.t("button") + 0.5) {
        k.brillo(g, p[0], p[1], 170, "fuego", pulso(t, f8.t("button"), 0.1) * e);
      }
    });
  }
  g.restore();
}

function cono(g, x0, y0, x1, y1, w0, w1, rgb, al) {
  if (al < 0.02) return;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
  const px = -dy / L, py = dx / L;
  const tira = (a, b, alpha) => {
    g.beginPath();
    g.moveTo(x0 + px * a, y0 + py * a);
    g.lineTo(x1 + px * b, y1 + py * b);
    g.lineTo(x1 - px * b, y1 - py * b);
    g.lineTo(x0 - px * a, y0 - py * a);
    g.closePath();
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    gr.addColorStop(0, `rgba(${rgb},${0.15 * alpha})`);
    gr.addColorStop(0.45, `rgba(${rgb},${0.45 * alpha})`);
    gr.addColorStop(1, `rgba(${rgb},${0.75 * alpha})`);
    g.fillStyle = gr;
    g.fill();
  };
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha *= al;
  tira(w0, w1, 0.55);
  tira(w0 * 0.28, w1 * 0.22, 1);
  g.restore();
}

function dashes(g, x0, y0, x1, y1, t, al) {
  if (al < 0.02) return;
  for (let i = 0; i < 6; i++) {
    const u = (t * 0.42 + i / 6) % 1;
    k.brillo(g, mez(x0, x1, u), mez(y0, y1, u), 70, "violeta", al * (0.25 + u * 0.55));
  }
}

function salpicon(g, t, radio, al) {
  if (al < 0.02) return;
  const pul = 0.86 + 0.14 * Math.sin(t * 6);
  k.brillo(g, SPLASH[0], SPLASH[1], radio * 2.6 * pul, "violeta", al);
  k.brillo(g, SPLASH[0], SPLASH[1], radio * 0.85, "blanca", al * 0.7);
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(255,255,255,${0.4 * al})`;
  g.lineWidth = 7;
  g.beginPath();
  g.arc(SPLASH[0], SPLASH[1], radio * (0.72 + 0.08 * Math.sin(t * 4)), 0, Math.PI * 2);
  g.stroke();
  g.restore();
}

function haz(g, t) {
  const e = era(t);
  const cubre = tapa(t);
  const movil = alMovil(t);
  const abierto = abertura(t);
  const dist = 1 + lejos(t);
  const [x, y] = punta(t);
  const techo = (1 - e) * (1 - cubre) * (1 - movil);
  const radio = 150 * abierto * dist;
  const alMancha = 0.95 / (dist * dist);
  const mostrandoPulsos = su(tr(t, f9.t("blinks") - 0.05, f9.t("blinks") + 0.18)) * (1 - su(tr(t, f12.t("aims") - 0.15, f12.t("remote") + 0.05)));
  const solido = techo * (1 - mostrandoPulsos) * (cubre > 0.45 ? 0 : 1);
  if (solido > 0.04) {
    cono(g, x, y, SPLASH[0], SPLASH[1], 22, radio * 0.85, VIOLETA, solido);
    dashes(g, x, y, SPLASH[0], SPLASH[1], t, solido);
    salpicon(g, t, radio, solido * alMancha);
    if (arranque(t) > 0.03) k.fogonazo(g, SPLASH[0], SPLASH[1], (1 - arranque(t)) * 1.15, 640, VIOLETA);
    const rebote = su(tr(t, f2.t("bounces") - 0.1, f2.t("bounces") + 0.22)) * (1 - su(tr(t, f4.t("back"), f4.t("far"))));
    const vn = ventana(0);
    cono(g, SPLASH[0], SPLASH[1], vn[0], vn[1], radio * 0.28, 22, VIOLETA, solido * rebote * 0.9);
    dashes(g, SPLASH[0], SPLASH[1], vn[0], vn[1], t + 1.7, solido * rebote);
    if (t > f2.t("bounces") - 0.02 && t < f2.t("bounces") + 1.1) {
      k.fogonazo(g, SPLASH[0], SPLASH[1], t - (f2.t("bounces") - 0.02), 380, VIOLETA);
    }
  }
  if (mostrandoPulsos > 0.2 && techo > 0.25 && t < f10.inicio + 0.05) pulsos(g, t, x, y);
  if (e > 0.35) {
    const b = blanco(t);
    cono(g, x, y, b[0], b[1], 8, 22, CALIDA, e);
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.5 + i / 5) % 1;
      k.brillo(g, mez(x, b[0], u), mez(y, b[1], u), 56, "fuego", e * 0.55);
    }
    k.brillo(g, b[0], b[1], 150, "fuego", e * (0.45 + 0.55 * pulso(t, f8.t("button"), 0.11)));
  }
  if (lejos(t) > 0.7 && t < f4.fin + 0.05) {
    const monedas = su(tr(t, f4.t("four") - 0.06, f4.t("four") + 0.22)) * (1 - su(tr(t, f4.fin - 0.4, f4.fin)));
    const sitios = [[-90, -36], [84, -28], [-46, 70], [62, 58]];
    sitios.forEach((p, i) => {
      const a = monedas * su(tr(t, f4.t("four") + i * 0.07, f4.t("four") + 0.24 + i * 0.07));
      if (a < 0.03) return;
      k.brillo(g, SPLASH[0] + p[0], SPLASH[1] + p[1], 200, "violeta", a * 0.9);
      k.brillo(g, SPLASH[0] + p[0], SPLASH[1] + p[1], 70, "blanca", a * 0.55);
    });
  }
  const linterna = su(tr(t, f3.t("like") - 0.04, f3.t("flashlight") + 0.1)) * (1 - su(tr(t, f4.t("back"), f4.t("twice") + 0.12))) * (1 - e) * (1 - cubre);
  if (linterna > 0.04) {
    const lx = x - 210, ly = y + 20;
    cono(g, lx, ly, SPLASH[0] - 70, SPLASH[1] + 16, 16, radio * 0.48, CALIDA, linterna * 0.8);
    k.brillo(g, SPLASH[0] - 70, SPLASH[1] + 16, radio * 2, "fuego", linterna * 0.4);
  }
}

function pulsos(g, t, x, y) {
  const vn = ventana(0);
  for (let i = 0; i < 4; i++) {
    const nace = f9.t("blinks") + 0.08 + i * 0.55;
    const u = (t - nace) / 0.5;
    if (u < 0 || u > 1) continue;
    const sube = u < 0.55;
    const uu = sube ? u / 0.55 : (u - 0.55) / 0.45;
    const ax = sube ? mez(x, SPLASH[0], uu) : mez(SPLASH[0], vn[0], uu);
    const ay = sube ? mez(y, SPLASH[1], uu) : mez(SPLASH[1], vn[1], uu);
    k.brillo(g, ax, ay, 78, "blanca", 0.9);
    k.brillo(g, ax, ay, 150, "violeta", 0.8);
  }
  const al = su(tr(t, f9.t("bounce") - 0.12, f9.t("bounce") + 0.08)) * (1 - su(tr(t, f10.inicio - 0.1, f10.inicio + 0.15)));
  salpicon(g, t, 100, al);
}

function anguloHacia(x, y, ax, ay) {
  return Math.atan2(ax - x, y - ay);
}

function aparato(g, x, y, ang, e, hundir) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  const ancho = mez(108, 50, e), alto = mez(300, 280, e);
  k.redondo(g, -ancho, mez(-16, 8, e), ancho * 2, alto, mez(40, 24, e));
  const rg = g.createLinearGradient(-ancho, 0, ancho, 0);
  rg.addColorStop(0, k.mezColor("#1a1e28", "#8e98a4", e));
  rg.addColorStop(0.4, k.mezColor("#07080c", "#f7f8fb", e));
  rg.addColorStop(1, k.mezColor("#2a3140", "#5c656e", e));
  g.fillStyle = rg;
  g.fill();
  if (e < 0.92) {
    g.save();
    g.globalAlpha *= 1 - e;
    g.beginPath();
    g.arc(0, -8, 15, 0, Math.PI * 2);
    g.fillStyle = "#efe4ff";
    g.fill();
    k.brillo(g, 0, -8, 64, "violeta", 0.85);
    const tecla = (tx, ty, r, col, baja) => {
      g.beginPath();
      g.arc(tx, ty + baja, r, 0, Math.PI * 2);
      g.fillStyle = col;
      g.fill();
      g.fillStyle = "rgba(255,255,255,0.5)";
      g.beginPath();
      g.arc(tx - r * 0.25, ty - r * 0.28 + baja, r * 0.22, 0, Math.PI * 2);
      g.fill();
    };
    tecla(0, 42, 32, "#ff2d42", hundir);
    tecla(-34, 108, 18, "#f7f8fc", 0);
    tecla(34, 108, 18, "#f7f8fc", 0);
    tecla(-34, 160, 18, "#12c4ae", 0);
    tecla(34, 160, 18, "#f2c14b", 0);
    tecla(0, 200, 14, "#20242e", 0);
    g.restore();
  }
  if (e > 0.08) {
    g.save();
    g.globalAlpha *= e;
    g.beginPath();
    g.ellipse(0, -4, 58, 26, 0, 0, Math.PI * 2);
    g.fillStyle = "#fff4d2";
    g.fill();
    k.brillo(g, 0, -4, 100, "fuego", 0.75);
    g.restore();
  }
  g.restore();
}

function movil(g, x, y, t, al) {
  if (al < 0.02) return;
  const hund = su(tr(t, f10.t("change") - 0.06, f10.t("change") + 0.05)) * (1 - su(tr(t, f10.t("change") + 0.22, f10.t("change") + 0.5)));
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  k.redondo(g, -150, -270, 300, 560, 48);
  g.fillStyle = "#14161e";
  g.fill();
  k.redondo(g, -132, -250, 264, 500, 36);
  const pg = g.createLinearGradient(0, -250, 0, 250);
  pg.addColorStop(0, "#3a1868");
  pg.addColorStop(1, "#0e3c44");
  g.fillStyle = pg;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.92)";
  g.font = "800 120px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(canal(t), 0, -150);
  const tecla = (ty, col, baja) => {
    k.redondo(g, -100, ty + baja, 200, 78, 26);
    g.fillStyle = col;
    g.fill();
  };
  tecla(-40, "#ff3b4e", 0);
  tecla(70, "#14b8a6", hund * 16);
  tecla(180, "#f2c14b", 0);
  g.beginPath();
  g.ellipse(40, 70 + hund * 16, 36, 28, 0, 0, Math.PI * 2);
  g.fillStyle = "#e7a888";
  g.fill();
  g.restore();
}

function objetos(g, t) {
  const [x, y] = punta(t);
  const e = era(t);
  const mov = alMovil(t);
  const aim = e > 0.4 ? blanco(t) : SPLASH;
  const ang = anguloHacia(x, y, aim[0], aim[1]);
  const press = tapa(t) > 0.4 ? 0 : 11 * Math.max(
    (1 - su(tr(t, 0.7, 1.4))) * 0.65,
    pulso(t, f2.t("changes"), 0.11),
    pulso(t, f9.t("counts"), 0.1),
  );
  if ((1 - mov) > 0.03) aparato(g, x, y, ang, e, press);
  const comp = su(tr(t, f3.t("like") - 0.05, f3.t("flashlight") + 0.05)) * (1 - su(tr(t, f4.t("back"), f4.t("twice") + 0.1))) * (1 - e);
  if (comp > 0.04) aparato(g, x - 210, y + 24, anguloHacia(x - 210, y + 24, SPLASH[0] - 70, SPLASH[1] + 16), 1, 0);
  const px = mez(x, PHONE[0], mov), py = mez(y, PHONE[1], mov);
  movil(g, px, py, t, mov);
}

function clavesCam(modo) {
  const cola = [
    [f1.t("ceiling"), 600, 620, 1.22],
    [f2.t("misses"), 460, 720, 1.08],
    [f2.t("bounces"), 560, 560, 1.05],
    [f2.t("changes"), 320, 800, 1.28],
    [f2.fin, 400, 760, 1.14],
    [f3.t("spreads"), 600, 660, 0.96],
    [f3.t("flashlight"), 660, 690, 0.9],
    [f4.t("back"), 640, 720, 0.88],
    [f4.t("far"), 680, 840, 0.8],
    [f4.t("fainter"), 700, 860, 0.76],
    [f4.fin, 700, 860, 0.76],
    [f5.t("cushion"), 530, 1120, 1.3],
    [f5.t("out"), 520, 1180, 1.45],
    [f6.t("nothing"), 440, 960, 0.9],
    [f6.fin, 450, 940, 0.92],
    [f7.t("first"), 420, 820, 1.08],
    [f7.t("corner"), 500, 500, 1.58],
    [f7.fin, 490, 540, 1.46],
    [f8.t("button"), 520, 490, 1.7],
    [f8.t("button") + 0.42, 520, 490, 1.7],
    [f8.t("miss"), 640, 460, 1.38],
    [f8.t("sat"), 430, 660, 1.1],
    [f8.fin, 440, 700, 1.06],
    [f9.t("blinks"), 700, 520, 1.18],
    [f9.t("counts"), 340, 820, 1.28],
    [f9.fin, 380, 800, 1.18],
    [f10.t("phone"), 500, 1040, 1.55],
    [f10.t("change"), 500, 1060, 1.62],
    [f10.fin, 500, 1040, 1.55],
    [f11.t("app"), 500, 1050, 1.68],
    [f11.fin, 500, 1040, 1.58],
    [f12.t("friend"), 600, 780, 1.12],
    [f12.t("ceiling"), 760, 400, 2.55],
    [v.duracion, 760, 400, 2.55],
  ];
  const cabeza = modo === "mando"
    ? [[0, 900, 820, 1.75], [0.55, 780, 720, 1.4], [1.4, 660, 660, 1.22]]
    : [[0, 760, 400, 2.55], [0.95, 680, 520, 1.6]];
  return cabeza.concat(cola);
}

export function camara(t, modo) {
  const ks = clavesCam(modo);
  const cx = k.claves(ks.map(([tt, x]) => [tt, x]));
  const cy = k.claves(ks.map(([tt, , y]) => [tt, y]));
  const z = k.claves(ks.map(([tt, , , zz]) => [tt, zz]));
  return { cx: cx(t), cy: cy(t), z: z(t) };
}

export function escena(g, t, modo) {
  const cam = camara(t, modo);
  const e = era(t);
  conCamara(g, cam, () => {
    fondo(g, t);
    tele(g, t, e);
    sofa(g);
    haz(g, t);
    objetos(g, t);
    cojin(g, t, tapa(t));
  });
  if (e < 0.35 && alMovil(t) < 0.45) {
    const b = teleGeo(e);
    const [nx, ny] = aPantalla(cam, b.x + b.w * 0.5, b.y + b.h + 36);
    if (ny > 530 && ny < 1360 && nx > 160 && nx < 920) {
      const golpe = Math.max(pulso(t, f2.t("changes"), 0.14), pulso(t, f9.t("counts"), 0.14), pulso(t, f10.t("change"), 0.14));
      k.pastilla(g, nx, ny, canal(t), "", golpe > 0.2 ? VIOLETA : "255,244,220", 1, 108);
    }
  }
  velo(g);
}
