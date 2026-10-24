// Cámara, baño, agua, guante y teléfono. Lo que se repite, una sola vez.
import * as k from "#kit";

export const camara = (g, c) => { g.translate(540, 960); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
const mezCam = (a, b, u) => ({ x: k.mez(a.x, b.x, u), y: k.mez(a.y, b.y, u), s: Math.exp(k.mez(Math.log(a.s), Math.log(b.s), u)) });
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, k.suave(k.tramo(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}

export function velo(g, a = 0.68) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 200, 0, 560);
  gr.addColorStop(0, `rgba(4, 12, 22, ${a})`);
  gr.addColorStop(1, "rgba(4, 12, 22, 0)");
  g.fillStyle = gr;
  g.fillRect(0, 180, 1080, 420);
  g.restore();
}
export function viñeta(g, a = 0.4) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 1000, 380, 540, 1000, 1200);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(0,0,0,${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

export function cromo(g, x0, y0, x1, y1, oro = 0) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  const pares = [
    [0, "#3c4a58", "#6a4010"],
    [0.16, "#9eb0c2", "#f2d78a"],
    [0.38, "#f6fbff", "#fff4c8"],
    [0.58, "#b7c4d0", "#e0b04a"],
    [0.78, "#5e6e7c", "#a87820"],
    [1, "#2c3844", "#5c340c"],
  ];
  for (const [p, a, b] of pares) gr.addColorStop(p, k.mezColor(a, b, oro));
  return gr;
}

// Azulejo. modo: bano (verde agua), madera (el banco), sotano (cobre y bombilla).
export function pared(g, modo = "bano") {
  const fondo = modo === "sotano"
    ? ["#3a2418", "#1a120e", "#4a3020"]
    : modo === "madera"
      ? ["#1a6e86", "#0c4e62", "#083848"]
      : ["#14b4c4", "#0c7490", "#083e4e"];
  const gr = g.createLinearGradient(-900, -1100, 700, 900);
  gr.addColorStop(0, fondo[0]);
  gr.addColorStop(0.5, fondo[1]);
  gr.addColorStop(1, fondo[2]);
  g.fillStyle = gr;
  g.fillRect(-2400, -2400, 4800, 4800);
  if (modo !== "sotano") {
    g.strokeStyle = modo === "madera" ? "rgba(220,255,248,0.14)" : "rgba(220,255,250,0.2)";
    g.lineWidth = 5;
    for (let x = -1800; x <= 1800; x += 156) { g.beginPath(); g.moveTo(x, -1800); g.lineTo(x, 1800); g.stroke(); }
    for (let y = -1800; y <= 1800; y += 118) { g.beginPath(); g.moveTo(-1800, y); g.lineTo(1800, y); g.stroke(); }
  } else {
    g.fillStyle = "rgba(80,50,30,0.35)";
    for (let y = -1400; y <= 1600; y += 90) g.fillRect(-2000, y, 4000, 2);
  }
  const luz = g.createRadialGradient(modo === "sotano" ? 180 : -520, modo === "sotano" ? -680 : -640, 40, 0, -80, 1100);
  luz.addColorStop(0, modo === "sotano" ? "rgba(255,196,120,0.42)" : "rgba(255,255,255,0.28)");
  luz.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = luz;
  g.fillRect(-2400, -2400, 4800, 4800);
  g.save();
  g.globalAlpha = 0.16;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -900, -1200, 1800, 2400);
  g.restore();
}

export function suelo(g, y, color = "#0c5c62") {
  g.fillStyle = color;
  g.fillRect(-2400, y, 4800, 1600);
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.fillRect(-2400, y, 4800, 8);
}

export function gota(g, x, y, r, al = 1) {
  if (al < 0.03 || r < 1) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.beginPath();
  g.moveTo(0, -r * 1.6);
  g.bezierCurveTo(r, -r * 0.3, r * 0.85, r * 0.85, 0, r);
  g.bezierCurveTo(-r * 0.85, r * 0.85, -r, -r * 0.3, 0, -r * 1.6);
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.2, r * 0.1, 0, r * 0.2, r * 1.3);
  gr.addColorStop(0, "rgba(230,250,255,0.95)");
  gr.addColorStop(0.45, "rgba(70,176,245,0.95)");
  gr.addColorStop(1, "rgba(8,70,190,0.95)");
  g.fillStyle = gr;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)";
  g.beginPath();
  g.ellipse(-r * 0.25, -r * 0.2, r * 0.14, r * 0.36, 0.4, 0, 6.28);
  g.fill();
  g.restore();
}

// Chorro de y0 a y1. calido tiñe el agua de tibia.
export function chorro(g, x, y0, y1, w, t, al = 1, calido = 0) {
  if (al < 0.03 || y1 <= y0 + 2 || w < 1.5) return;
  g.save();
  g.globalAlpha *= al;
  const onda = Math.sin(t * 14) * w * 0.08;
  g.beginPath();
  g.moveTo(x - w * 0.32, y0);
  g.bezierCurveTo(x - w * 0.1 + onda, (y0 + y1) / 2, x - w * 0.42 - onda, y0 + (y1 - y0) * 0.75, x - w * 0.48, y1);
  g.lineTo(x + w * 0.48, y1);
  g.bezierCurveTo(x + w * 0.42 - onda, y0 + (y1 - y0) * 0.75, x + w * 0.1 + onda, (y0 + y1) / 2, x + w * 0.32, y0);
  g.closePath();
  const gr = g.createLinearGradient(x - w, 0, x + w, 0);
  gr.addColorStop(0, k.mezColor("#083888", "#8a3a10", calido));
  gr.addColorStop(0.4, k.mezColor("#9ae4ff", "#ffd0a0", calido));
  gr.addColorStop(1, k.mezColor("#0a4ec8", "#c45a18", calido));
  g.fillStyle = gr;
  g.fill();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const p = (t * 1.7 + i / 4) % 1;
    g.fillStyle = `rgba(230,250,255,${0.28 * (1 - p)})`;
    g.fillRect(x - w * 0.1, y0 + (y1 - y0) * p, w * 0.16, Math.max(6, (y1 - y0) * 0.07));
  }
  g.restore();
}

const SEM = k.azar(5);
const GOTAS = Array.from({ length: 14 }, () => ({
  ang: SEM() * 6.2 - 3.1, v: 0.45 + SEM() * 0.7, f: SEM(), r: 7 + SEM() * 9,
}));
export function salpicar(g, x, y, t, al = 1, esc = 1) {
  if (al < 0.03) return;
  for (const d of GOTAS) {
    const p = (t * 1.4 * d.v + d.f) % 1;
    const px = x + Math.sin(d.ang) * 240 * esc * p;
    const py = y - (360 * esc * p - 480 * esc * p * p) * (0.4 + d.v * 0.35);
    if (py > y + 20) continue;
    gota(g, px, py, d.r * esc, al * (1 - p));
  }
}

export function guante(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const pintura = (x0, x1) => {
    const gr = g.createLinearGradient(x0, -40, x1, 40);
    gr.addColorStop(0, "#a8740a");
    gr.addColorStop(0.4, "#ffe9a2");
    gr.addColorStop(0.72, "#f0b020");
    gr.addColorStop(1, "#7a5808");
    return gr;
  };
  const dedos = [[-48, -8], [-18, -20], [12, -18], [40, -6]];
  for (const [dx, dy] of dedos) {
    g.fillStyle = pintura(dx - 16, dx + 16);
    k.redondo(g, dx - 15, -158 + dy, 30, 96, 14);
    g.fill();
  }
  g.fillStyle = pintura(-64, 64);
  k.redondo(g, -64, -78, 128, 128, 42);
  g.fill();
  g.save();
  g.translate(-62, 0);
  g.rotate(-0.65);
  g.fillStyle = pintura(-16, 20);
  k.redondo(g, -16, -16, 34, 78, 14);
  g.fill();
  g.restore();
  g.fillStyle = pintura(-72, 72);
  k.redondo(g, -72, 36, 144, 34, 12);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.32)";
  k.redondo(g, -6, -150, 12, 190, 6);
  g.fill();
  g.restore();
}

// sentido -1: a la izquierda (la punta, a la izquierda, mira hacia abajo).
// sentido +1: a la derecha (la punta, a la derecha, mira hacia abajo).
export function arco(g, x, y, r, al, sentido = -1) {
  if (al < 0.04) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.strokeStyle = "#ffd15a";
  g.lineWidth = Math.max(16, r * 0.075);
  g.lineCap = "round";
  g.fillStyle = "#ffd15a";
  if (sentido < 0) {
    g.beginPath();
    g.arc(0, 0, r, 0.55, Math.PI, true);
    g.stroke();
    g.beginPath();
    g.moveTo(-r, 42);
    g.lineTo(-r - 26, -6);
    g.lineTo(-r + 26, -6);
    g.closePath();
    g.fill();
  } else {
    g.beginPath();
    g.arc(0, 0, r, Math.PI - 0.15, 0.15, false);
    g.stroke();
    g.beginPath();
    g.moveTo(r, 42);
    g.lineTo(r - 26, -6);
    g.lineTo(r + 26, -6);
    g.closePath();
    g.fill();
  }
  g.restore();
}

export function telefono(g, x, y, al = 1, esc = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = "#14181e";
  k.redondo(g, -78, -150, 156, 300, 28);
  g.fill();
  g.fillStyle = "#2a2418";
  k.redondo(g, -64, -120, 128, 210, 16);
  g.fill();
  g.fillStyle = "#3ddc84";
  g.beginPath();
  g.arc(0, 28, 32, 0, 6.28);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 6;
  g.beginPath();
  g.arc(0, 24, 12, 0.6, 2.5);
  g.stroke();
  g.fillStyle = "#cfd6de";
  k.redondo(g, -22, -136, 44, 8, 4);
  g.fill();
  g.restore();
}

export function alarma(g, a) {
  if (a < 0.03) return;
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 1000, 200, 540, 1000, 1000);
  gr.addColorStop(0, `rgba(180, 16, 16, ${0.05 * a})`);
  gr.addColorStop(1, `rgba(140, 0, 0, ${0.38 * a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}
