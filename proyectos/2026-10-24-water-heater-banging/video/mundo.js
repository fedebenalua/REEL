// Cámara, cuartos, manos y agua. Lo que se repite, una sola vez.
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

export function velo(g, a = 0.8) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 180, 0, 560);
  gr.addColorStop(0, `rgba(6, 10, 16, ${a})`);
  gr.addColorStop(1, "rgba(6, 10, 16, 0)");
  g.fillStyle = gr;
  g.fillRect(0, 160, 1080, 460);
  g.restore();
}
export function viñeta(g, a = 0.45) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 980, 420, 540, 980, 1180);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(0,0,0,${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

export function cromo(g, x0, y0, x1, y1) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, "#3a4652");
  gr.addColorStop(0.22, "#d5e2ee");
  gr.addColorStop(0.48, "#f7fbff");
  gr.addColorStop(0.7, "#8ea0b0");
  gr.addColorStop(1, "#2a343e");
  return gr;
}

// modo: servicio (ámbar), bano (crema con ventana).
export function cuarto(g, modo = "servicio") {
  const fondo = modo === "bano"
    ? ["#1288a4", "#0b5c74", "#063848"]
    : ["#7a5434", "#3d2818", "#1a100c"];
  const gr = g.createLinearGradient(-800, -1400, 600, 900);
  gr.addColorStop(0, fondo[0]);
  gr.addColorStop(0.55, fondo[1]);
  gr.addColorStop(1, fondo[2]);
  g.fillStyle = gr;
  g.fillRect(-2400, -2400, 4800, 4800);
  if (modo === "bano") {
    g.strokeStyle = "rgba(255,248,236,0.45)";
    g.lineWidth = 6;
    for (let x = -1600; x <= 1800; x += 168) { g.beginPath(); g.moveTo(x, -1800); g.lineTo(x, 700); g.stroke(); }
    for (let y = -1600; y <= 800; y += 128) { g.beginPath(); g.moveTo(-1800, y); g.lineTo(1800, y); g.stroke(); }
    g.fillStyle = "#b7e6ff";
    k.redondo(g, 280, -80, 340, 460, 16);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.4)";
    g.fillRect(300, -60, 140, 420);
  } else {
    g.fillStyle = "rgba(90, 60, 36, 0.45)";
    for (let y = -1500; y <= 900; y += 86) g.fillRect(-2000, y, 4000, 3);
  }
  const lx = modo === "bano" ? -760 : 180;
  const ly = modo === "bano" ? -680 : -820;
  const luz = g.createRadialGradient(lx, ly, 20, lx, ly, modo === "bano" ? 900 : 1100);
  luz.addColorStop(0, modo === "bano" ? "rgba(255,255,255,0.55)" : "rgba(255, 196, 110, 0.5)");
  luz.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = luz;
  g.fillRect(-2400, -2400, 4800, 4800);
  g.save();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -900, -1100, 1800, 2200);
  g.restore();
}

export function suelo(g, y, color) {
  g.fillStyle = color;
  g.fillRect(-2400, y, 4800, 1800);
  g.fillStyle = "rgba(255,255,255,0.16)";
  g.fillRect(-2400, y, 4800, 8);
}

export function guante(g, x, y, rot = 0, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const piel = g.createLinearGradient(-70, -160, 80, 150);
  piel.addColorStop(0, "#ffe56a");
  piel.addColorStop(0.5, "#f0b800");
  piel.addColorStop(1, "#c48400");
  g.fillStyle = piel;
  g.beginPath();
  g.ellipse(0, 16, 74, 86, 0, 0, 6.28);
  g.fill();
  for (let i = 0; i < 4; i++) {
    k.redondo(g, -50 + i * 32, -138 + (i === 0 || i === 3 ? 16 : 0), 30, 108, 14);
    g.fill();
  }
  g.save();
  g.translate(-62, 24);
  g.rotate(0.65);
  k.redondo(g, -16, -78, 34, 96, 16);
  g.fill();
  g.restore();
  k.redondo(g, -70, 48, 140, 78, 22);
  g.fill();
  g.fillStyle = "rgba(255, 246, 190, 0.45)";
  g.beginPath();
  g.ellipse(-16, -10, 18, 40, -0.5, 0, 6.28);
  g.fill();
  g.restore();
}

export function telefono(g, x, y, al = 1, esc = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.28)";
  k.redondo(g, -62, -130, 150, 300, 36);
  g.fill();
  g.fillStyle = "#161b22";
  k.redondo(g, -78, -156, 156, 312, 36);
  g.fill();
  const pantalla = g.createLinearGradient(0, -120, 0, 120);
  pantalla.addColorStop(0, "#12382c");
  pantalla.addColorStop(1, "#071610");
  g.fillStyle = pantalla;
  k.redondo(g, -62, -128, 124, 246, 16);
  g.fill();
  g.beginPath();
  g.arc(0, 28, 38, 0, 6.28);
  g.fillStyle = "#18c85a";
  g.fill();
  g.strokeStyle = "#e8fff0";
  g.lineWidth = 6;
  g.beginPath();
  g.arc(0, 28, 16, 0.6, 2.4);
  g.stroke();
  g.restore();
}

export function gota(g, x, y, r, al = 1) {
  if (al < 0.03 || r < 1) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.beginPath();
  g.moveTo(0, -r * 1.55);
  g.bezierCurveTo(r, -r * 0.25, r * 0.8, r * 0.9, 0, r);
  g.bezierCurveTo(-r * 0.8, r * 0.9, -r, -r * 0.25, 0, -r * 1.55);
  const gr = g.createRadialGradient(-r * 0.25, -r * 0.15, r * 0.05, 0, r * 0.15, r * 1.2);
  gr.addColorStop(0, "rgba(236,250,255,0.95)");
  gr.addColorStop(0.5, "rgba(80,186,245,0.92)");
  gr.addColorStop(1, "rgba(10,78,190,0.95)");
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

export function chorro(g, x, y0, y1, w, t, al = 1, calido = 0) {
  if (al < 0.03 || y1 <= y0 + 2) return;
  g.save();
  g.globalAlpha *= al;
  const onda = Math.sin(t * 16) * w * 0.08;
  g.beginPath();
  g.moveTo(x - w * 0.28, y0);
  g.bezierCurveTo(x - w * 0.05 + onda, (y0 + y1) / 2, x - w * 0.4 - onda, y0 + (y1 - y0) * 0.7, x - w * 0.45, y1);
  g.lineTo(x + w * 0.45, y1);
  g.bezierCurveTo(x + w * 0.4 - onda, y0 + (y1 - y0) * 0.7, x + w * 0.05 + onda, (y0 + y1) / 2, x + w * 0.28, y0);
  g.closePath();
  const gr = g.createLinearGradient(x - w, 0, x + w, 0);
  gr.addColorStop(0, k.mezColor("#083888", "#a84810", calido));
  gr.addColorStop(0.45, k.mezColor("#b6ecff", "#ffd0a4", calido));
  gr.addColorStop(1, k.mezColor("#0a52c8", "#e07020", calido));
  g.fillStyle = gr;
  g.fill();
  g.restore();
}
