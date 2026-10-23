// Cámara plana, materiales y piezas que comparten los planos de este lavabo.
import * as k from "#kit";

const { mez, suave: su, tramo: tr, azar, lienzo } = k;
export const W = 1080, H = 1920;

export const camara = (g, c) => { g.translate(540, 960); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
export const mezCam = (a, b, u) => ({ x: mez(a.x, b.x, u), y: mez(a.y, b.y, u), s: Math.exp(mez(Math.log(a.s), Math.log(b.s), u)) });
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, su(tr(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}

export const CROMO = [[0, "#2e3944"], [0.12, "#8d9bab"], [0.3, "#f7fbfd"], [0.48, "#b7c3ce"], [0.66, "#5c6b78"], [0.84, "#e7eef3"], [1, "#323c46"]];
export const NARANJA = [[0, "#8a2e08"], [0.22, "#ff8a32"], [0.48, "#ffd39a"], [0.7, "#f06a14"], [1, "#7a2808"]];
export const AMARILLO = [[0, "#c49a12"], [0.28, "#ffe98a"], [0.55, "#ffd24a"], [0.78, "#e0a010"], [1, "#a87408"]];
export function gradH(g, x0, x1, stops) {
  const gr = g.createLinearGradient(x0, 0, x1, 0);
  for (const [o, c] of stops) gr.addColorStop(o, c);
  return gr;
}
export function gradV(g, y0, y1, stops) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  for (const [o, c] of stops) gr.addColorStop(o, c);
  return gr;
}

const azT = azar(41);
const baldosas = (() => {
  const l = lienzo(480, 320), c = l.getContext("2d");
  c.fillStyle = "#e7f4f2"; c.fillRect(0, 0, 480, 320);
  const bw = 120, bh = 64;
  for (let r = 0; r < 6; r++) for (let i = -1; i < 5; i++) {
    const x = i * bw + (r % 2 ? bw / 2 : 0), y = r * bh, v = azT();
    const gr = c.createLinearGradient(x, y, x + bw, y + bh);
    gr.addColorStop(0, `rgb(${70 + v * 40 | 0},${190 + v * 30 | 0},${186})`);
    gr.addColorStop(0.45, `rgb(${20 + v * 20 | 0},${150 + v * 20 | 0},${158})`);
    gr.addColorStop(1, `rgb(${8},${90 + v * 20 | 0},${112})`);
    c.fillStyle = gr; c.fillRect(x + 4, y + 4, bw - 8, bh - 8);
    c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(x + 8, y + 8, bw - 20, 4);
  }
  return l;
})();
export function pared(g, x0, y0, x1, y1) {
  g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip();
  g.fillStyle = g.createPattern(baldosas, "repeat"); g.fillRect(x0 - 40, y0 - 40, x1 - x0 + 80, y1 - y0 + 80);
  const s = g.createLinearGradient(0, y0, 0, y1);
  s.addColorStop(0, "rgba(0,20,30,0.15)"); s.addColorStop(1, "rgba(0,20,30,0.45)");
  g.fillStyle = s; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.restore();
}

export function velo(g, a = 0.55) {
  const gr = g.createLinearGradient(0, 180, 0, 700);
  gr.addColorStop(0, `rgba(3,14,22,${a * 0.35})`);
  gr.addColorStop(0.35, `rgba(3,14,22,${a})`);
  gr.addColorStop(0.7, `rgba(3,14,22,${a * 0.55})`);
  gr.addColorStop(1, "rgba(3,14,22,0)");
  g.fillStyle = gr; g.fillRect(0, 160, W, 560);
}
export function viñeta(g, a = 0.42) {
  const gr = g.createRadialGradient(540, 980, 480, 540, 980, 1280);
  gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,8,16,${a})`);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

// Una gota de agua. estira > 1 la alarga hacia abajo.
export function gota(g, x, y, r, al = 1, estira = 1) {
  if (al < 0.02 || r < 1) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(1, estira);
  g.beginPath();
  g.moveTo(0, -r * 1.7);
  g.bezierCurveTo(r * 0.2, -r, r, -r * 0.2, r * 0.95, r * 0.35);
  g.bezierCurveTo(r * 0.9, r, r * 0.4, r * 1.2, 0, r * 1.15);
  g.bezierCurveTo(-r * 0.4, r * 1.2, -r * 0.9, r, -r * 0.95, r * 0.35);
  g.bezierCurveTo(-r, -r * 0.2, -r * 0.2, -r, 0, -r * 1.7);
  g.closePath();
  const gr = g.createRadialGradient(-r * 0.25, -r * 0.15, r * 0.1, 0, r * 0.2, r * 1.3);
  gr.addColorStop(0, "rgba(214,248,255,0.95)"); gr.addColorStop(0.5, "rgba(64,186,242,0.92)"); gr.addColorStop(1, "rgba(10,90,200,0.95)");
  g.fillStyle = gr; g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath(); g.ellipse(-r * 0.32, -r * 0.15, r * 0.14, r * 0.42, 0.4, 0, 6.28); g.fill();
  g.restore();
}

// Hebras de pelo alrededor de (0,0), radio r. Se dibujan en el estado actual (traslate ya hecho).
const HEBRAS = (() => {
  const a = azar(19), out = [];
  for (let i = 0; i < 56; i++) out.push({ a0: a() * 6.28, a1: a() * 6.28, r0: 0.15 + a() * 0.7, r1: 0.35 + a() * 0.75, g: 0.6 + a() * 0.8, c: a() < 0.75 ? "#24160f" : "#6b4a30" });
  return out;
})();
export function pelo(g, x, y, r, al = 1) {
  if (al < 0.02) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y);
  g.lineCap = "round";
  for (const h of HEBRAS) {
    g.beginPath();
    g.moveTo(Math.cos(h.a0) * r * h.r0, Math.sin(h.a0) * r * h.r0 * 0.72);
    g.quadraticCurveTo(Math.cos(h.a0 + 1) * r * 0.45, Math.sin(h.a1) * r * 0.5, Math.cos(h.a1) * r * h.r1, Math.sin(h.a1) * r * h.r1 * 0.7);
    g.strokeStyle = h.c; g.lineWidth = h.g * Math.max(1.2, r * 0.035); g.stroke();
  }
  g.fillStyle = "rgba(90,70,40,0.55)";
  g.beginPath(); g.ellipse(0, 0, r * 0.42, r * 0.28, 0.2, 0, 6.28); g.fill();
  g.restore();
}

// Guante de goma amarillo. ang gira la mano (0 = dedos arriba).
export function guante(g, x, y, ang, esc, al = 1) {
  if (al < 0.02) return;
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(esc, esc); g.globalAlpha *= al;
  const cuerpo = () => {
    g.beginPath();
    g.moveTo(-46, 20);
    g.bezierCurveTo(-70, -80, -54, -150, -28, -168);
    g.lineTo(34, -168);
    g.bezierCurveTo(62, -150, 70, -70, 52, 30);
    g.lineTo(58, 78);
    g.quadraticCurveTo(20, 98, -36, 78);
    g.closePath();
  };
  cuerpo(); g.fillStyle = gradH(g, -70, 70, AMARILLO); g.fill();
  g.save(); cuerpo(); g.clip();
  g.fillStyle = "rgba(255,255,255,0.45)"; g.fillRect(-20, -160, 16, 230);
  g.restore();
  // pulgar
  g.beginPath();
  g.moveTo(-40, -10);
  g.bezierCurveTo(-110, -20, -120, 40, -70, 62);
  g.bezierCurveTo(-40, 74, -20, 40, -30, 10);
  g.fillStyle = gradH(g, -120, -20, AMARILLO); g.fill();
  // puño
  g.fillStyle = gradH(g, -64, 64, [[0, "#b88810"], [0.4, "#ffe07a"], [1, "#c09012"]]);
  k.redondo(g, -64, 62, 128, 44, 16); g.fill();
  g.restore();
}

export function telefono(g, x, y, esc, al, t) {
  if (al < 0.02) return;
  g.save(); g.translate(x, y); g.scale(esc, esc); g.globalAlpha *= al;
  k.redondo(g, -70, -120, 140, 240, 28);
  g.fillStyle = gradH(g, -70, 70, [[0, "#1c2430"], [0.4, "#3c4858"], [1, "#121820"]]); g.fill();
  g.fillStyle = "#0e2a22"; k.redondo(g, -54, -96, 108, 180, 12); g.fill();
  const pulso = 0.45 + 0.55 * Math.sin(t * 6);
  g.fillStyle = `rgba(60,220,120,${0.35 + 0.45 * pulso})`;
  g.beginPath(); g.arc(0, 8, 40, 0, 6.28); g.fill();
  // auricular
  g.strokeStyle = "#f4fff8"; g.lineWidth = 8; g.lineCap = "round";
  g.beginPath(); g.moveTo(-18, -6); g.quadraticCurveTo(0, 22, 18, -6); g.stroke();
  g.fillStyle = "#f4fff8";
  g.beginPath(); g.ellipse(-18, -8, 9, 12, -0.4, 0, 6.28); g.fill();
  g.beginPath(); g.ellipse(18, -8, 9, 12, 0.4, 0, 6.28); g.fill();
  g.restore();
}
