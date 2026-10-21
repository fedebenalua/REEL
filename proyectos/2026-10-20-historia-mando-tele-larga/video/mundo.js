// Lo que comparten los planos: la cámara 2D, las texturas, la tele (la de madera de 1955 y la de hoy), las pantallas
// con sus canales, la linterna y la ventana con sol. Todo se dibuja en coordenadas del mundo (px con zoom 1); vista()
// pone la cámara y sinVista() la quita para dibujar luces y texto encima de la pantalla.
import * as k from "#kit";

const { azar, lienzo, redondo, suave: su, tramo: tr, mez } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// claves [t, [Z, cx, cy]]: el zoom en log (para que se aleje con ritmo parejo), y todo sin tirones.
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.55) {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 150, 0, 700);
  vg.addColorStop(0, `rgba(5,5,10,${al})`); vg.addColorStop(0.6, `rgba(5,5,10,${al * 0.7})`); vg.addColorStop(1, "rgba(5,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.5) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 520, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// ---------------------------------------------------------------- texturas
export const veta = k.ruido(256, 91, 2, 4, "lineas");   // madera (se estira a lo largo)
export const tejido = k.ruido(256, 95, 18, 2, "lineas"); // tela y papel

// Un rectángulo de madera: degradado, veta y un borde de luz. (x, y) arriba a la izquierda.
export function madera(g, x, y, w, h, r, tono = ["#a6713f", "#7b4a25", "#4a2a14"], vertical = false) {
  g.save();
  redondo(g, x, y, w, h, r); g.clip();
  const gr = vertical ? g.createLinearGradient(x, y, x + w, y) : g.createLinearGradient(x, y, x, y + h);
  gr.addColorStop(0, tono[0]); gr.addColorStop(0.5, tono[1]); gr.addColorStop(1, tono[2]);
  g.fillStyle = gr; g.fillRect(x, y, w, h);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.55;
  if (vertical) g.drawImage(veta, x, y, w * 1.5, h * 2.2); else g.drawImage(veta, x, y, w * 2.2, h * 1.5);
  g.restore();
  g.save(); redondo(g, x + 1.5, y + 1.5, w - 3, h - 3, r); g.strokeStyle = "rgba(255,225,180,0.22)"; g.lineWidth = 3; g.stroke(); g.restore();
}

// ---------------------------------------------------------------- las pantallas: canales y nieve
const W = 540, H = 450;
// La nieve de una tele que no encuentra el canal. a: cuánta (0 a 1).
export function nieve(g, w, h, t, a) {
  if (a <= 0.01) return;
  const az = azar(Math.floor(t * 30) * 7 + 3);
  g.save(); g.globalAlpha = a;
  g.fillStyle = "#2a2a2a"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) {
    const y = az() * h, hh = 2 + az() * 7, x = az() * w, ww = 30 + az() * 220, c = Math.floor(80 + az() * 175);
    g.fillStyle = `rgb(${c},${c},${c})`; g.fillRect(x, y, ww, hh); g.fillRect(x - w, y, ww, hh);
  }
  const by = ((t * 400) % (h + 120)) - 60;
  g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(0, by, w, 50);
  g.restore();
}
// Los canales: cada uno, una escena pequeña y con color. t para que se muevan.
export function canal(g, c, w, h, t) {
  c = ((c % 4) + 4) % 4;
  g.save();
  if (c === 0) { // desierto al atardecer
    const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#5a2a8a"); sk.addColorStop(0.55, "#ff6a4a"); sk.addColorStop(1, "#ffd27a");
    g.fillStyle = sk; g.fillRect(0, 0, w, h);
    k.brillo(g, w * 0.7, h * 0.58, 330, "255,230,160", 0.9);
    g.fillStyle = "#fff4cc"; g.beginPath(); g.arc(w * 0.7, h * 0.58, 46, 0, 6.2832); g.fill();
    g.fillStyle = "#3a1530"; g.beginPath(); g.moveTo(0, h * 0.72); g.lineTo(w * 0.15, h * 0.58); g.lineTo(w * 0.32, h * 0.58); g.lineTo(w * 0.4, h * 0.72); g.lineTo(w * 0.55, h * 0.66); g.lineTo(w * 0.65, h * 0.72); g.lineTo(w, h * 0.72); g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill();
    g.fillStyle = "#1a0a1e"; g.fillRect(0, h * 0.78, w, h * 0.22);
    g.fillStyle = "#16401f"; redondo(g, w * 0.2 - 12, h * 0.52, 24, h * 0.34, 12); g.fill(); redondo(g, w * 0.2 - 44, h * 0.62, 22, 60, 11); g.fill(); redondo(g, w * 0.2 + 22, h * 0.58, 22, 70, 11); g.fill();
  } else if (c === 1) { // mar con velero
    const sk = g.createLinearGradient(0, 0, 0, h * 0.55); sk.addColorStop(0, "#3a9be8"); sk.addColorStop(1, "#d6f1ff");
    g.fillStyle = sk; g.fillRect(0, 0, w, h);
    const sea = g.createLinearGradient(0, h * 0.55, 0, h); sea.addColorStop(0, "#0f7ac4"); sea.addColorStop(1, "#04325e");
    g.fillStyle = sea; g.fillRect(0, h * 0.55, w, h * 0.45);
    g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 4;
    for (let i = 0; i < 9; i++) { const y = h * 0.6 + i * 28, off = (t * 40 + i * 53) % 120; g.beginPath(); for (let x = -120 + off; x < w + 120; x += 120) { g.moveTo(x, y); g.quadraticCurveTo(x + 30, y - 12, x + 60, y); } g.stroke(); }
    const bob = Math.sin(t * 2) * 5;
    g.fillStyle = "#fff"; g.beginPath(); g.moveTo(w * 0.5, h * 0.2 + bob); g.lineTo(w * 0.5, h * 0.5 + bob); g.lineTo(w * 0.72, h * 0.5 + bob); g.closePath(); g.fill();
    g.fillStyle = "#ffd24a"; g.beginPath(); g.moveTo(w * 0.47, h * 0.28 + bob); g.lineTo(w * 0.47, h * 0.5 + bob); g.lineTo(w * 0.3, h * 0.5 + bob); g.closePath(); g.fill();
    g.fillStyle = "#7a2a1a"; g.beginPath(); g.moveTo(w * 0.26, h * 0.52 + bob); g.lineTo(w * 0.76, h * 0.52 + bob); g.lineTo(w * 0.7, h * 0.58 + bob); g.lineTo(w * 0.32, h * 0.58 + bob); g.closePath(); g.fill();
  } else if (c === 2) { // la carta de ajuste
    const cols = ["#f2f2f2", "#f2d21a", "#1ad2d2", "#1ad21a", "#d21ad2", "#d21a1a", "#1a1ad2"];
    cols.forEach((col, i) => { g.fillStyle = col; g.fillRect((w / 7) * i, 0, w / 7 + 1, h * 0.7); });
    g.fillStyle = "#101018"; g.fillRect(0, h * 0.7, w, h * 0.3);
    g.fillStyle = "#e8e8f0"; g.fillRect(0, h * 0.7, w * 0.3, h * 0.3); g.fillStyle = "#1a2a8a"; g.fillRect(w * 0.7, h * 0.7, w * 0.3, h * 0.3);
    g.strokeStyle = "#fff"; g.lineWidth = 6; g.beginPath(); g.arc(w / 2, h * 0.45, 92, 0, 6.2832); g.stroke();
    g.fillStyle = "#101018"; g.beginPath(); g.arc(w / 2, h * 0.45, 20, 0, 6.2832); g.fill();
  } else { // ciudad de noche
    const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#050b2a"); sk.addColorStop(1, "#2a2a7a");
    g.fillStyle = sk; g.fillRect(0, 0, w, h);
    k.brillo(g, w * 0.22, h * 0.2, 220, "220,235,255", 0.7);
    g.fillStyle = "#f4f6ff"; g.beginPath(); g.arc(w * 0.22, h * 0.2, 36, 0, 6.2832); g.fill();
    const az = azar(55);
    for (let i = 0; i < 9; i++) {
      const bw = 56 + az() * 36, bh = 130 + az() * 190, bx = i * 62 - 6;
      g.fillStyle = "#0a0a20"; g.fillRect(bx, h - bh, bw, bh);
      for (let yy = h - bh + 14; yy < h - 14; yy += 24) for (let xx = bx + 8; xx < bx + bw - 12; xx += 18) if (az() < 0.55) { g.fillStyle = az() < 0.8 ? "#ffd86a" : "#7ac8ff"; g.fillRect(xx, yy, 9, 13); }
    }
  }
  g.restore();
}

// El contenido de una pantalla: el canal c, o nieve con a de intensidad, más las líneas y el brillo del tubo.
export function contenido(g, w, h, t, c, nv = 0, apagada = 0) {
  g.save();
  canal(g, c, w, h, t);
  if (nv > 0.01) nieve(g, w, h, t, nv);
  g.globalAlpha = 0.09; g.fillStyle = "#000";
  for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 2);
  g.globalAlpha = 1;
  const vg = g.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)");
  g.fillStyle = vg; g.fillRect(0, 0, w, h);
  if (apagada > 0.01) { g.fillStyle = `rgba(4,6,8,${apagada})`; g.fillRect(0, 0, w, h); }
  g.restore();
}

// ---------------------------------------------------------------- la tele de 1955
// Centrada en (0,0) con su caja de madera de 860 × 720. Las cuatro fotocélulas, una en cada esquina de la pantalla.
export const CELDAS = [[-384, -264], [184, -264], [-384, 214], [184, 214]];
export const PANTALLA50 = { x: -370, y: -250, w: W, h: H };
export function teleVieja(g, t, o = {}) {
  const { canalN = 0, nv = 0, celdas = [0, 0, 0, 0], perilla = 0, apagada = 0 } = o;
  g.save();
  // las patas
  for (const sx of [-1, 1]) {
    g.save();
    g.beginPath(); g.moveTo(sx * 300 - 34, 340); g.lineTo(sx * 300 + 34, 340); g.lineTo(sx * 345 + 18, 570); g.lineTo(sx * 345 - 18, 570); g.closePath();
    const lg = g.createLinearGradient(sx * 300 - 34, 0, sx * 300 + 34, 0); lg.addColorStop(0, "#8a5a30"); lg.addColorStop(0.5, "#5a3418"); lg.addColorStop(1, "#2e1a0a");
    g.fillStyle = lg; g.fill();
    g.beginPath(); g.ellipse(sx * 345, 572, 24, 9, 0, 0, 6.2832); g.fillStyle = "#d9b45a"; g.fill();
    g.restore();
  }
  // la caja
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60; g.shadowOffsetY = 30;
  redondo(g, -430, -360, 860, 720, 64); g.fillStyle = "#4a2a14"; g.fill(); g.restore();
  madera(g, -430, -360, 860, 720, 64);
  // la cara, algo más oscura, con su marco
  madera(g, -402, -332, 804, 664, 44, ["#6e4222", "#4e2c14", "#30190a"]);
  // el hueco de la pantalla: marco negro con borde cromado
  g.save();
  redondo(g, -396, -276, 588, 498, 70);
  const cg = g.createLinearGradient(-396, -276, 192, 222); cg.addColorStop(0, "#f4f1e6"); cg.addColorStop(0.5, "#8c8a82"); cg.addColorStop(1, "#d8d4c6");
  g.fillStyle = cg; g.fill();
  redondo(g, -386, -266, 568, 478, 62); g.fillStyle = "#050506"; g.fill();
  g.restore();
  // el cristal
  g.save(); redondo(g, PANTALLA50.x, PANTALLA50.y, W, H, 74); g.clip(); g.translate(PANTALLA50.x, PANTALLA50.y);
  contenido(g, W, H, t, canalN, nv, apagada);
  // el brillo curvo del cristal
  const rg = g.createLinearGradient(0, 0, W * 0.8, H * 0.8); rg.addColorStop(0, "rgba(255,255,255,0.22)"); rg.addColorStop(0.35, "rgba(255,255,255,0.05)"); rg.addColorStop(0.5, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(0, 0, W, H);
  g.restore();
  // el altavoz
  redondo(g, 218, -262, 172, 220, 20); g.fillStyle = "#20120a"; g.fill();
  g.save(); redondo(g, 218, -262, 172, 220, 20); g.clip();
  for (let i = 0; i < 12; i++) { const x = 232 + i * 13.5; const sg = g.createLinearGradient(x, 0, x + 8, 0); sg.addColorStop(0, "#c9a050"); sg.addColorStop(1, "#6a4a1a"); g.fillStyle = sg; g.fillRect(x, -250, 8, 196); }
  g.restore();
  g.strokeStyle = "rgba(255,225,170,0.4)"; g.lineWidth = 3; redondo(g, 218, -262, 172, 220, 20); g.stroke();
  // las dos perillas
  for (const [px, py, giro] of [[262, 70, perilla], [348, 70, -perilla * 0.4], [262, 190, 0.5], [348, 190, 1.3]]) {
    g.save(); g.translate(px, py);
    g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 16; g.shadowOffsetY = 8;
    g.beginPath(); g.arc(0, 0, 36, 0, 6.2832); g.fillStyle = "#2a1a0e"; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
    g.rotate(giro);
    const kg = g.createRadialGradient(-10, -12, 4, 0, 0, 34); kg.addColorStop(0, "#fffbe8"); kg.addColorStop(0.6, "#e0d3a8"); kg.addColorStop(1, "#8a7a4a");
    g.beginPath(); g.arc(0, 0, 32, 0, 6.2832); g.fillStyle = kg; g.fill();
    g.strokeStyle = "rgba(90,70,30,0.55)"; g.lineWidth = 3; for (let i = 0; i < 18; i++) { const a = (i / 18) * 6.2832; g.beginPath(); g.moveTo(Math.cos(a) * 26, Math.sin(a) * 26); g.lineTo(Math.cos(a) * 32, Math.sin(a) * 32); g.stroke(); }
    g.fillStyle = "#3a2a10"; redondo(g, -3, -26, 6, 20, 3); g.fill();
    g.restore();
  }
  // las cuatro fotocélulas
  CELDAS.forEach(([cx, cy], i) => {
    const a = celdas[i];
    g.save(); g.translate(cx, cy);
    g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 14; g.shadowOffsetY = 6;
    g.beginPath(); g.arc(0, 0, 30, 0, 6.2832); const rg2 = g.createLinearGradient(-30, -30, 30, 30); rg2.addColorStop(0, "#fff"); rg2.addColorStop(0.5, "#8a8a88"); rg2.addColorStop(1, "#e8e8e0"); g.fillStyle = rg2; g.fill();
    g.shadowColor = "rgba(0,0,0,0)";
    const lg = g.createRadialGradient(-6, -8, 2, 0, 0, 23);
    lg.addColorStop(0, `rgb(${k.mezRgb("255,214,120", "255,255,235", a)})`); lg.addColorStop(0.55, `rgb(${k.mezRgb("168,92,24", "255,214,110", a)})`); lg.addColorStop(1, `rgb(${k.mezRgb("60,28,6", "255,170,60", a)})`);
    g.beginPath(); g.arc(0, 0, 23, 0, 6.2832); g.fillStyle = lg; g.fill();
    g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(-7, -9, 6, 3.5, -0.7, 0, 6.2832); g.fill();
    g.restore();
    if (a > 0.02) k.brillo(g, cx, cy, 190 + 150 * a, "255,220,140", a * 0.95);
  });
  g.restore();
}

// ---------------------------------------------------------------- la linterna (Flash-Matic)
// Con la lente en (0,0) apuntando a +x; se pone con translate y rotate. enc: 0 apagada, 1 encendida.
export function linterna(g, enc = 0) {
  g.save();
  // el cuerpo, de crema con aros cromados (se dibuja hacia -x)
  const cuerpo = (x0, x1, h, tono) => { const gr = g.createLinearGradient(0, -h / 2, 0, h / 2); tono.forEach((c, i) => gr.addColorStop(i / (tono.length - 1), c)); g.fillStyle = gr; g.beginPath(); g.rect(x0, -h / 2, x1 - x0, h); g.fill(); };
  g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 40; g.shadowOffsetY = 24;
  cuerpo(-640, -140, 118, ["#8a7a5a", "#fff3d2", "#e4d2a2", "#a08a58", "#4a3e24"]);
  g.shadowColor = "rgba(0,0,0,0)";
  // la banda roja y los aros
  cuerpo(-430, -380, 122, ["#6a0e0a", "#ff5a46", "#d4281c", "#8a1410", "#3a0604"]);
  for (const x of [-150, -330, -460, -630]) cuerpo(x - 14, x + 14, 130, ["#5a6068", "#f4f6f9", "#aeb4bc", "#e8ecf1", "#3c4248"]);
  // el cabezal: un cono que se abre hacia la lente
  g.beginPath(); g.moveTo(-140, -64); g.lineTo(-6, -118); g.lineTo(-6, 118); g.lineTo(-140, 64); g.closePath();
  const hg = g.createLinearGradient(0, -118, 0, 118); ["#4c525a", "#f4f6f9", "#a6acb6", "#e2e6ec", "#30363e"].forEach((c, i) => hg.addColorStop(i / 4, c));
  g.fillStyle = hg; g.fill();
  // el aro de la lente
  g.beginPath(); g.ellipse(-6, 0, 28, 124, 0, 0, 6.2832); const ag = g.createLinearGradient(0, -124, 0, 124); ["#3c4248", "#fff", "#9aa0aa", "#e8ecf1", "#2c3238"].forEach((c, i) => ag.addColorStop(i / 4, c));
  g.fillStyle = ag; g.fill();
  // la lente: se enciende
  g.beginPath(); g.ellipse(-6, 0, 21, 108, 0, 0, 6.2832);
  const lg = g.createRadialGradient(-12, -20, 4, -6, 0, 110);
  lg.addColorStop(0, `rgb(${k.mezRgb("210,226,236", "255,255,255", enc)})`); lg.addColorStop(0.6, `rgb(${k.mezRgb("90,110,128", "255,244,200", enc)})`); lg.addColorStop(1, `rgb(${k.mezRgb("36,46,58", "255,200,110", enc)})`);
  g.fillStyle = lg; g.fill();
  // el botón de disparo
  g.save(); g.translate(-300, -62); redondo(g, -34, -22, 68, 26, 12); const bg = g.createLinearGradient(0, -22, 0, 4); bg.addColorStop(0, "#ff8a7a"); bg.addColorStop(1, "#9a1a10"); g.fillStyle = bg; g.fill(); g.restore();
  // un reflejo largo en el cuerpo
  g.fillStyle = "rgba(255,255,255,0.28)"; redondo(g, -620, -42, 460, 8, 4); g.fill();
  g.restore();
  if (enc > 0.02) k.brillo(g, 14, 0, 330, "255,244,205", 0.8 * enc);
}

// Un haz de luz: de (x0, y0), hacia el ángulo ang, de largo len, que se abre de w0 a w1. Se suma ("lighter").
export function haz(g, x0, y0, ang, len, w0, w1, color, al = 1, sem = 1, t = 0) {
  if (al <= 0.01) return;
  g.save(); g.translate(x0, y0); g.rotate(ang); g.globalCompositeOperation = "lighter";
  const gr = g.createLinearGradient(0, 0, len, 0);
  gr.addColorStop(0, `rgba(${color},${0.7 * al})`); gr.addColorStop(0.5, `rgba(${color},${0.36 * al})`); gr.addColorStop(1, `rgba(${color},${0.2 * al})`);
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, -w0 / 2); g.lineTo(len, -w1 / 2); g.lineTo(len, w1 / 2); g.lineTo(0, w0 / 2); g.closePath(); g.fill();
  // el núcleo, más fino y más claro
  const ng = g.createLinearGradient(0, 0, len, 0);
  ng.addColorStop(0, `rgba(255,255,255,${0.85 * al})`); ng.addColorStop(1, `rgba(${color},${0.25 * al})`);
  g.fillStyle = ng; g.beginPath(); g.moveTo(0, -w0 * 0.22); g.lineTo(len, -w1 * 0.2); g.lineTo(len, w1 * 0.2); g.lineTo(0, w0 * 0.22); g.closePath(); g.fill();
  // el polvo que flota en la luz
  const az = azar(sem * 17 + 5);
  for (let i = 0; i < 46; i++) {
    const u = az(), v2 = (az() - 0.5) * 2, fase = az() * 6.2832, d = u * len + 18 * Math.sin(t * 0.9 + fase), w = mez(w0, w1, u) * 0.46, yy = v2 * w + 12 * Math.cos(t * 0.8 + fase * 1.7);
    g.fillStyle = `rgba(255,255,240,${(0.25 + 0.45 * az()) * al * (0.6 + 0.4 * Math.sin(t * 2 + fase))})`; g.beginPath(); g.arc(d, yy, 1.5 + az() * 2.4, 0, 6.2832); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- el salón de 1955
// luz: 0 de noche (solo la tele y la linterna), 1 de día con el sol entrando por la ventana.
export function ventana(g, t, sol) {
  const x = -10, y = -1010, w = 440, h = 560;
  g.save();
  // la pared que la rodea, iluminada por fuera
  g.save(); redondo(g, x - w / 2, y - h / 2, w, h, 12); g.clip();
  const sk = g.createLinearGradient(0, y - h / 2, 0, y + h / 2);
  sk.addColorStop(0, k.mezColor("#050a22", "#4aa8f0", sol)); sk.addColorStop(1, k.mezColor("#1a2a5a", "#d6f0ff", sol));
  g.fillStyle = sk; g.fillRect(x - w / 2, y - h / 2, w, h);
  // estrellas por la noche
  const az = azar(8); g.fillStyle = `rgba(255,255,255,${0.9 * (1 - sol)})`;
  for (let i = 0; i < 30; i++) g.fillRect(x - w / 2 + az() * w, y - h / 2 + az() * h * 0.7, 3, 3);
  // el sol
  if (sol > 0.01) {
    const sx = x - 40, sy = y + 70;
    k.brillo(g, sx, sy, 560, "255,238,170", 0.7 * sol);
    g.globalAlpha = sol; g.fillStyle = "#fffbe0"; g.beginPath(); g.arc(sx, sy, 84 + 6 * Math.sin(t * 3), 0, 6.2832); g.fill();
  }
  g.restore();
  // el marco y los cristales
  g.strokeStyle = "#f2efe6"; g.lineWidth = 26; redondo(g, x - w / 2, y - h / 2, w, h, 12); g.stroke();
  g.lineWidth = 14; g.beginPath(); g.moveTo(x, y - h / 2); g.lineTo(x, y + h / 2); g.moveTo(x - w / 2, y - 60); g.lineTo(x + w / 2, y - 60); g.stroke();
  g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 3; redondo(g, x - w / 2 - 13, y - h / 2 - 13, w + 26, h + 26, 14); g.stroke();
  // los cortinas
  for (const sx of [-1, 1]) {
    const cx = x + sx * (w / 2 + 60);
    g.save(); g.beginPath(); g.moveTo(cx - 70, y - h / 2 - 50); g.lineTo(cx + 70, y - h / 2 - 50); g.quadraticCurveTo(cx + 85 * sx, y + 80, cx + 40 * sx, y + h / 2 + 70); g.lineTo(cx - 40 * sx, y + h / 2 + 70); g.quadraticCurveTo(cx - 85 * sx, y + 80, cx - 70, y - h / 2 - 50); g.closePath();
    const cg = g.createLinearGradient(cx - 80, 0, cx + 80, 0); for (let i = 0; i <= 6; i++) cg.addColorStop(i / 6, i % 2 ? "#b8382e" : "#6e1a14");
    g.fillStyle = cg; g.fill(); g.clip();
    g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(tejido, cx - 90, y - h / 2 - 50, 180, 800);
    g.restore();
  }
  g.restore();
}
// El salón: la pared, el zócalo y el suelo. sol: cuánta luz de día entra.
export function salon50(g, t, sol, brilloTele = 0.5) {
  // la pared
  const pg = g.createLinearGradient(0, -1500, 0, 580); pg.addColorStop(0, k.mezColor("#0a1c24", "#b4824a", sol)); pg.addColorStop(1, k.mezColor("#122e36", "#d8a868", sol));
  g.fillStyle = pg; g.fillRect(-1100, -1700, 2200, 2300);
  g.save(); g.globalAlpha = 0.16;
  for (let x = -1100; x < 1100; x += 90) { g.fillStyle = "#fff"; g.fillRect(x, -1700, 38, 2300); }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.14; g.drawImage(tejido, -1100, -1700, 2200, 2300);
  g.restore();
  // el zócalo
  madera(g, -1100, 470, 2200, 100, 0, ["#e6d9b8", "#c9b88a", "#8a7a52"]);
  // el suelo
  g.fillStyle = "#2a160a"; g.fillRect(-1100, 568, 2200, 1500);
  madera(g, -1100, 568, 2200, 1500, 0, ["#7a4a24", "#5a3216", "#2e180a"]);
  for (let y = 600; y < 2000; y += 70) { g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(-1100, y, 2200, 3); }
  // la luz de la tele en la pared y el suelo
  k.brillo(g, -100, -20, 2000, "170,200,230", brilloTele * 0.5);
}
