// Cámara, baño, cordón y el corte donde el moho baja. Lo que se repite, una sola vez.
import * as k from "#kit";
import { v } from "#voz";

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

export function velo(g, a = 0.78) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 160, 0, 560);
  gr.addColorStop(0, `rgba(4, 18, 28, ${a})`);
  gr.addColorStop(1, "rgba(4, 18, 28, 0)");
  g.fillStyle = gr;
  g.fillRect(0, 140, 1080, 460);
  g.restore();
}
export function viñeta(g, a = 0.42) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 1040, 420, 540, 1040, 1180);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(0,0,0,${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

const ONDA = (2 * Math.PI * 6) / v.duracion;
export const late = (t) => 0.5 + 0.5 * Math.sin(ONDA * t);

export function azulejos(g, x, y, w, h, lado = 168) {
  const gr = g.createLinearGradient(x, y, x + w * 0.2, y + h);
  gr.addColorStop(0, "#2ee0d4");
  gr.addColorStop(0.45, "#12a8b4");
  gr.addColorStop(1, "#0a6e86");
  g.fillStyle = gr;
  g.fillRect(x, y, w, h);
  g.strokeStyle = "rgba(236, 255, 252, 0.55)";
  g.lineWidth = 7;
  const x0 = Math.ceil(x / lado) * lado, y0 = Math.ceil(y / lado) * lado;
  for (let i = x0; i < x + w; i += lado) { g.beginPath(); g.moveTo(i, y); g.lineTo(i, y + h); g.stroke(); }
  for (let j = y0; j < y + h; j += lado) { g.beginPath(); g.moveTo(x, j); g.lineTo(x + w, j); g.stroke(); }
  const luz = g.createRadialGradient(x + w * 0.15, y + 80, 30, x + w * 0.4, y + h * 0.5, Math.max(w, h));
  luz.addColorStop(0, "rgba(255,255,255,0.34)");
  luz.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = luz;
  g.fillRect(x, y, w, h);
  g.save();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, x, y, w, h);
  g.restore();
}

export function tina(g, x, y, w, h) {
  const gr = g.createLinearGradient(x, y, x, y + h);
  gr.addColorStop(0, "#ffffff");
  gr.addColorStop(0.12, "#f3f7fb");
  gr.addColorStop(0.4, "#d5e0ea");
  gr.addColorStop(1, "#8ea3b5");
  g.fillStyle = gr;
  g.fillRect(x, y, w, h);
  g.fillStyle = "rgba(255,255,255,0.95)";
  g.fillRect(x, y, w, 22);
  g.fillStyle = "rgba(30, 60, 80, 0.16)";
  g.fillRect(x, y + 36, w, 14);
  const br = g.createLinearGradient(x, y, x + 180, y);
  br.addColorStop(0, "rgba(120, 210, 230, 0.35)");
  br.addColorStop(1, "rgba(120, 210, 230, 0)");
  g.fillStyle = br;
  g.fillRect(x, y, Math.min(420, w), h);
}

const az = k.azar(4);
export const COLONIAS = Array.from({ length: 16 }, () => ({
  x: -620 + az() * 1240,
  r: 110 + az() * 150,
  dy: (az() - 0.5) * 70,
  fase: az() * 6.28,
  verde: 0.2 + az() * 0.8,
}));

export function mancha(g, x, y, r, al, verde) {
  if (al < 0.03 || r < 2) return;
  g.save();
  g.globalAlpha *= al;
  const gr = g.createRadialGradient(x - r * 0.2, y - r * 0.25, r * 0.1, x, y, r);
  gr.addColorStop(0, "#1a120c");
  gr.addColorStop(0.45, "#24160f");
  gr.addColorStop(0.78, k.mezColor("#14210e", "#3d8f28", verde));
  gr.addColorStop(1, "rgba(40, 90, 30, 0)");
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(x, y, r, r * 0.72, 0, 0, 6.28);
  g.fill();
  g.restore();
}

export function gota(g, x, y, r, al = 1) {
  if (al < 0.03 || r < 1) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.beginPath();
  g.moveTo(0, -r * 1.55);
  g.bezierCurveTo(r, -r * 0.2, r * 0.8, r, 0, r);
  g.bezierCurveTo(-r * 0.8, r, -r, -r * 0.2, 0, -r * 1.55);
  const gr = g.createRadialGradient(-r * 0.25, -r * 0.15, r * 0.1, 0, r * 0.2, r * 1.4);
  gr.addColorStop(0, "rgba(236, 252, 255, 0.95)");
  gr.addColorStop(0.5, "rgba(70, 190, 245, 0.92)");
  gr.addColorStop(1, "rgba(8, 90, 190, 0.95)");
  g.fillStyle = gr;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.8)";
  g.beginPath();
  g.ellipse(-r * 0.22, -r * 0.15, r * 0.12, r * 0.32, 0.5, 0, 6.28);
  g.fill();
  g.restore();
}

// El cordón visto por fuera. moho 0-1, limpio 0-1 (la piel blanca), abierto 0-1 (el núcleo).
export function cordon(g, t, moho, limpio, abierto) {
  azulejos(g, -2200, -1600, 4400, 1600, 170);
  tina(g, -2200, 70, 4400, 1500);
  g.fillStyle = "rgba(20, 40, 50, 0.28)";
  k.redondo(g, -1600, 40, 3200, 280, 120);
  g.fill();
  const gr = g.createLinearGradient(0, -220, 0, 260);
  gr.addColorStop(0, "#fffefb");
  gr.addColorStop(0.42, "#f3ecdf");
  gr.addColorStop(1, "#b7a48c");
  g.fillStyle = gr;
  k.redondo(g, -1600, -210, 3200, 460, 180);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.72)";
  k.redondo(g, -1540, -170, 3080, 70, 34);
  g.fill();
  const pulso = 0.92 + late(t) * 0.08;
  if (moho > 0.05 && limpio < 0.95) {
    g.save();
    g.globalAlpha = moho * (1 - limpio) * 0.9;
    g.fillStyle = "#1c140f";
    g.beginPath();
    g.moveTo(-1500, -20);
    for (let x = -1500; x <= 1500; x += 120) {
      const y = Math.sin(x * 0.008 + t * 1.6) * 36 * moho;
      g.quadraticCurveTo(x + 40, -70 + y, x + 120, 10 + y * 0.3);
    }
    g.lineTo(1500, 80);
    g.lineTo(-1500, 80);
    g.fill();
    g.restore();
  }
  for (const c of COLONIAS) {
    const crece = Math.max(0, moho * pulso - (1 - c.verde) * 0.05);
    mancha(g, c.x, c.dy + Math.sin(c.fase + t * 1.4) * 6, c.r * crece, (1 - limpio) * Math.min(1, crece * 1.2), c.verde);
  }
  if (limpio > 0.02) {
    g.save();
    g.globalAlpha = Math.min(1, limpio);
    g.fillStyle = "rgba(255,252,246,0.94)";
    k.redondo(g, -1560, -180, 3120, 300, 120);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.7)";
    k.redondo(g, -1500, -150, 3000, 48, 22);
    g.fill();
    g.restore();
  }
  if (abierto > 0.004) {
    const a = abierto;
    const alto = a * 280;
    g.save();
    g.globalAlpha = Math.min(1, a * 1.4);
    g.fillStyle = "#140c0a";
    k.redondo(g, -760, -alto / 2, 1520, Math.max(alto, 2), Math.min(70, alto / 2));
    g.fill();
    for (let i = -3; i <= 3; i++) mancha(g, i * 190, 0, 40 + a * 120, a, 0.85);
    g.restore();
  }
}

// Corte de la esquina: la pared, la bañera, el agua y las raíces. raices 0-1, ya crecidas del todo al final.
export function seccion(g, t, raices) {
  azulejos(g, -1100, -980, 520, 1280, 150);
  tina(g, -80, 120, 1400, 1100);
  g.fillStyle = "rgba(8, 40, 50, 0.35)";
  g.beginPath();
  g.moveTo(-80, -220);
  g.lineTo(-80, 120);
  g.lineTo(80, 120);
  g.closePath();
  g.fill();
  const cuerpo = g.createLinearGradient(-40, -300, 280, 180);
  cuerpo.addColorStop(0, "#fffdf8");
  cuerpo.addColorStop(0.5, "#efe4d2");
  cuerpo.addColorStop(1, "#c2ae93");
  g.fillStyle = cuerpo;
  g.beginPath();
  g.moveTo(-70, -340);
  g.bezierCurveTo(210, -300, 390, -20, 430, 130);
  g.lineTo(250, 250);
  g.bezierCurveTo(180, 40, 40, -80, -70, -40);
  g.closePath();
  g.fill();
  g.save();
  g.globalAlpha = 0.45;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -80, -360, 520, 640);
  g.restore();
  g.strokeStyle = "rgba(255,255,255,0.75)";
  g.lineWidth = 10;
  g.beginPath();
  g.moveTo(-40, -300);
  g.bezierCurveTo(180, -250, 330, -10, 380, 110);
  g.stroke();
  const agua = 0.85 + Math.sin(t * 3.2) * 0.04;
  g.save();
  g.globalAlpha = 0.92;
  g.beginPath();
  g.ellipse(150, -70, 150, 48 * agua, -0.3, 0, 6.28);
  const ag = g.createRadialGradient(120, -84, 8, 150, -60, 150);
  ag.addColorStop(0, "rgba(220, 248, 255, 0.95)");
  ag.addColorStop(0.45, "rgba(70, 180, 240, 0.9)");
  ag.addColorStop(1, "rgba(10, 80, 170, 0.85)");
  g.fillStyle = ag;
  g.fill();
  g.restore();
  const p = k.suave(Math.max(0, Math.min(1, raices)));
  const raicesD = [
    [40, -40, 10, 40, -30, 210],
    [120, -20, 90, 80, 70, 240],
    [200, -10, 230, 70, 250, 200],
    [80, -30, 40, 120, 10, 270],
  ];
  g.lineCap = "round";
  for (const [x0, y0, cx, cy, x1, y1] of raicesD) {
    if (p < 0.03) continue;
    const xx = k.mez(x0, x1, p), yy = k.mez(y0, y1, p);
    g.strokeStyle = "rgba(46, 140, 48, 0.95)";
    g.lineWidth = 40;
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo(cx, k.mez(y0, cy, p), xx, yy);
    g.stroke();
    g.strokeStyle = "#120c09";
    g.lineWidth = 18;
    g.stroke();
  }
  if (p > 0.2) {
    mancha(g, k.mez(40, -30, p), k.mez(-40, 210, p), 28, p, 0.7);
    mancha(g, k.mez(200, 250, p), k.mez(-10, 200, p), 24, p, 0.5);
  }
}

// estado: cam, moho, limpio, abierto, seccion, raices, gota (0-1, 0 escondida arriba del todo no: 0 no se dibuja)
export function escenaCostura(g, t, e) {
  g.save();
  camara(g, e.cam);
  const fuera = 1 - k.suave(Math.min(1, e.seccion));
  if (fuera > 0.015) {
    g.save();
    g.globalAlpha = fuera;
    cordon(g, t, e.moho, e.limpio, e.abierto);
    if (e.gota > 0.02 && e.gota < 0.92) gota(g, 40, k.mez(-420, 0, k.entra(e.gota)), 34, 1);
    if (e.gota > 0.78) {
      const s = k.suave(k.tramo(e.gota, 0.78, 1));
      g.globalAlpha = 1 - s;
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * 6.28;
        gota(g, 40 + Math.cos(a) * 80 * s, 10 + Math.sin(a) * 36 * s - 20, 14, 1 - s);
      }
    }
    g.restore();
  }
  if (e.seccion > 0.02) {
    g.save();
    const s = k.mez(0.55, 1, k.suave(e.seccion));
    g.scale(s, s);
    g.globalAlpha = Math.min(1, e.seccion * 1.35);
    seccion(g, t, e.raices);
    g.restore();
  }
  if (e.extra) e.extra(g);
  g.restore();
}

export function estadoCero() {
  return { cam: { x: 20, y: 20, s: 1.72 }, moho: 0.84, limpio: 0, abierto: 0, seccion: 0, raices: 0, gota: 0 };
}
