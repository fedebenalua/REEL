// El váter, la llave, las manos y el codo. Lo que se repite, una sola vez.
import * as k from "#kit";

const { azar, mez, suave: su, tramo: tr } = k;

export const camara = (g, c) => { g.translate(540, 960); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
const mezCam = (a, b, u) => ({ x: mez(a.x, b.x, u), y: mez(a.y, b.y, u), s: Math.exp(mez(Math.log(a.s), Math.log(b.s), u)) });
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, su(tr(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}

export function velo(g, a = 0.78) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 180, 0, 560);
  gr.addColorStop(0, `rgba(4, 16, 28, ${a})`);
  gr.addColorStop(1, "rgba(4, 16, 28, 0)");
  g.fillStyle = gr;
  g.fillRect(0, 140, 1080, 460);
  g.restore();
}
export function viñeta(g, a = 0.42) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 1020, 340, 540, 1020, 1240);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(0,0,0,${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

function porcelana(g, x0, y0, x1, y1) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, "#6a8798");
  gr.addColorStop(0.14, "#eaf3f8");
  gr.addColorStop(0.4, "#ffffff");
  gr.addColorStop(0.68, "#d0e0ea");
  gr.addColorStop(1, "#6d8898");
  return gr;
}
function cromo(g, x0, y0, x1, y1) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, "#24303a");
  gr.addColorStop(0.22, "#d5dee8");
  gr.addColorStop(0.46, "#ffffff");
  gr.addColorStop(0.7, "#7e8d9c");
  gr.addColorStop(1, "#1a222a");
  return gr;
}

export function fondo(g, calor = 0) {
  const pared = g.createLinearGradient(-700, -1400, 900, 800);
  pared.addColorStop(0, k.mezColor("#1a8eae", "#3a4a68", calor));
  pared.addColorStop(0.5, k.mezColor("#0c5870", "#241c28", calor));
  pared.addColorStop(1, k.mezColor("#062838", "#140e14", calor));
  g.fillStyle = pared;
  g.fillRect(-2400, -2400, 4800, 4800);
  g.save();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -900, -1300, 2400, 2600);
  g.restore();
  g.strokeStyle = "rgba(210, 245, 255, 0.14)";
  g.lineWidth = 4;
  for (let x = -1600; x <= 1800; x += 156) {
    g.beginPath(); g.moveTo(x, -1600); g.lineTo(x, 1700); g.stroke();
  }
  for (let y = -1600; y <= 1700; y += 118) {
    g.beginPath(); g.moveTo(-1600, y); g.lineTo(1800, y); g.stroke();
  }
  const luz = g.createRadialGradient(-520, -640, 20, -180, -200, 1100);
  luz.addColorStop(0, "rgba(255, 236, 200, 0.34)");
  luz.addColorStop(1, "rgba(255, 236, 200, 0)");
  g.fillStyle = luz;
  g.fillRect(-2400, -2400, 4800, 4800);
  g.fillStyle = k.mezColor("#c4623c", "#3a241c", calor * 0.35);
  g.fillRect(-2400, 430, 4800, 1600);
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.fillRect(-2400, 430, 4800, 7);
  g.save();
  g.globalAlpha = 0.22;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -400, 430, 1600, 500);
  g.restore();
}

const rnd = azar(5);
const GOTAS = Array.from({ length: 26 }, () => ({
  ang: rnd() * 5.4 - 2.7,
  v: 0.45 + rnd() * 1.1,
  f: rnd(),
  r: 10 + rnd() * 18,
}));

export function gota(g, x, y, r, al) {
  if (al < 0.03 || r < 1) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.beginPath();
  g.moveTo(0, -r * 1.55);
  g.bezierCurveTo(r * 0.95, -r * 0.2, r * 0.85, r * 0.85, 0, r);
  g.bezierCurveTo(-r * 0.85, r * 0.85, -r * 0.95, -r * 0.2, 0, -r * 1.55);
  const gr = g.createRadialGradient(-r * 0.25, -r * 0.2, r * 0.1, 0, r * 0.15, r * 1.2);
  gr.addColorStop(0, "rgba(230, 250, 255, 0.95)");
  gr.addColorStop(0.45, "rgba(70, 176, 245, 0.92)");
  gr.addColorStop(1, "rgba(10, 78, 190, 0.95)");
  g.fillStyle = gr;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)";
  g.beginPath();
  g.ellipse(-r * 0.22, -r * 0.25, r * 0.14, r * 0.32, 0.5, 0, 6.28);
  g.fill();
  g.restore();
}

export function salpicar(g, x, y, t, al, esc) {
  if (al < 0.04) return;
  for (const d of GOTAS) {
    const p = (t * 1.25 * d.v + d.f) % 1;
    const px = x + Math.sin(d.ang) * 420 * esc * p;
    const py = y - (520 * esc * p - 640 * esc * p * p) * (0.55 + d.v * 0.35);
    if (py > y + 40) continue;
    gota(g, px, py, d.r * esc * (1 - p * 0.35), al * (1 - p));
  }
}

// Vátern de frente. nivel 1 = agua en el borde. rebose 0–1 = la cortina de delante.
export function taza(g, t, ox, oy, esc, o = {}) {
  const nivel = o.nivel ?? 0.9;
  const rebose = o.rebose ?? 0;
  const maneta = o.maneta ?? 0;
  const remolino = o.remolino ?? 0;
  const quieto = o.quieto ?? 0;
  const tt = quieto > 0.5 ? 0 : t;
  g.save();
  g.translate(ox, oy);
  g.scale(esc, esc);

  g.fillStyle = "rgba(0, 16, 28, 0.35)";
  g.beginPath();
  g.ellipse(10, 470, 340, 36, 0, 0, 6.28);
  g.fill();

  // depósito
  g.beginPath();
  k.redondo(g, -168, -500, 336, 430, 28);
  g.fillStyle = porcelana(g, -168, -500, 168, -70);
  g.fill();
  g.save();
  g.clip();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(-20, -500, 28, 430);
  g.restore();
  g.beginPath();
  k.redondo(g, -190, -545, 380, 62, 20);
  g.fillStyle = porcelana(g, -190, -545, 190, -480);
  g.fill();

  // tapa del asiento, levantada
  g.beginPath();
  g.moveTo(-200, -78);
  g.bezierCurveTo(-210, -210, -80, -250, 0, -246);
  g.bezierCurveTo(90, -250, 214, -200, 200, -70);
  g.lineTo(150, -60);
  g.bezierCurveTo(140, -160, -130, -160, -150, -60);
  g.closePath();
  g.fillStyle = porcelana(g, -200, -240, 200, -60);
  g.fill();

  // cuerpo de la taza
  g.beginPath();
  g.moveTo(-250, 20);
  g.bezierCurveTo(-330, 80, -340, 240, -210, 340);
  g.lineTo(-130, 400);
  g.lineTo(140, 400);
  g.lineTo(220, 340);
  g.bezierCurveTo(350, 240, 330, 80, 250, 20);
  g.bezierCurveTo(190, -50, -190, -50, -250, 20);
  g.closePath();
  g.fillStyle = porcelana(g, -340, -40, 340, 400);
  g.fill();
  g.save();
  g.clip();
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -340, -40, 680, 460);
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 0.45;
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.fillRect(30, -20, 26, 300);
  g.restore();

  // pie
  g.beginPath();
  k.redondo(g, -150, 360, 300, 120, 18);
  g.fillStyle = porcelana(g, -150, 360, 150, 480);
  g.fill();

  // hueco y agua
  const aguaY = 36 + (1 - nivel) * 78;
  const aguaRx = 196 * (0.72 + 0.28 * nivel);
  const aguaRy = 72 * (0.55 + 0.45 * nivel);
  g.beginPath();
  g.ellipse(0, 28, 214, 86, 0, 0, 6.28);
  g.fillStyle = "#0c3a66";
  g.fill();
  g.save();
  g.beginPath();
  g.ellipse(0, 28, 214, 86, 0, 0, 6.28);
  g.clip();
  g.beginPath();
  g.ellipse(0, aguaY, aguaRx, aguaRy, 0, 0, 6.28);
  const ag = g.createLinearGradient(-aguaRx, aguaY - aguaRy, aguaRx, aguaY + aguaRy);
  ag.addColorStop(0, "#8ee4ff");
  ag.addColorStop(0.35, "#2f92f0");
  ag.addColorStop(1, "#0a4ec4");
  g.fillStyle = ag;
  g.fill();
  if (quieto < 0.5) {
    g.globalAlpha = 0.4;
    g.drawImage(k.causticas, -aguaRx + (tt * 18) % 80, aguaY - aguaRy, aguaRx * 2.2, aguaRy * 2.2);
  }
  g.globalAlpha = 1;
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(-aguaRx * 0.7, aguaY - aguaRy * 0.65, aguaRx * 0.55, 6);
  g.restore();

  // aro del asiento
  g.beginPath();
  g.ellipse(0, 18, 248, 102, 0, 0, 6.28);
  g.strokeStyle = porcelana(g, -248, -80, 248, 120);
  g.lineWidth = 34;
  g.stroke();
  g.beginPath();
  g.ellipse(0, 18, 248, 102, 0, 0, 6.28);
  g.strokeStyle = "rgba(255,255,255,0.65)";
  g.lineWidth = 6;
  g.stroke();

  if (remolino > 0.02) {
    const h = Math.min(1, remolino);
    g.save();
    g.beginPath();
    g.ellipse(0, 28, 200, 78, 0, 0, 6.28);
    g.clip();
    g.translate(0, aguaY);
    g.scale(1, Math.max(0.28, aguaRy / Math.max(40, aguaRx)));
    g.lineCap = "round";
    g.strokeStyle = `rgba(245, 255, 255, ${0.95 * h})`;
    g.lineWidth = 26;
    g.beginPath();
    g.arc(0, 0, aguaRx * 0.62, tt * 5.5, tt * 5.5 + 3.6);
    g.stroke();
    g.lineWidth = 16;
    g.strokeStyle = `rgba(190, 235, 255, ${0.9 * h})`;
    g.beginPath();
    g.arc(0, 0, aguaRx * 0.36, -tt * 6.2, -tt * 6.2 + 4);
    g.stroke();
    g.beginPath();
    g.arc(0, 0, aguaRx * (0.1 + 0.06 * (1 - h)), 0, 6.28);
    g.fillStyle = `rgba(3, 14, 36, ${0.95 * h})`;
    g.fill();
    g.restore();
  }

  // cortina por el borde delantero
  if (rebose > 0.03) {
    const y0 = 18 + 70;
    const y1 = 340 + rebose * 80;
    const w = 180 + rebose * 280;
    const onda = quieto > 0.5 ? 0 : Math.sin(tt * 14) * 14;
    g.beginPath();
    g.moveTo(-w * 0.42, y0);
    g.bezierCurveTo(-w * 0.2 + onda, y0 + (y1 - y0) * 0.35, -w * 0.55 - onda, y0 + (y1 - y0) * 0.7, -w * 0.5, y1);
    g.lineTo(w * 0.5, y1);
    g.bezierCurveTo(w * 0.55 - onda, y0 + (y1 - y0) * 0.7, w * 0.2 + onda, y0 + (y1 - y0) * 0.35, w * 0.42, y0);
    g.closePath();
    g.fillStyle = cromo(g, -w, y0, w, y1);
    const cg = g.createLinearGradient(-w, 0, w, 0);
    cg.addColorStop(0, "rgba(8, 60, 170, 0.15)");
    cg.addColorStop(0.3, "rgba(150, 220, 255, 0.92)");
    cg.addColorStop(0.55, "rgba(40, 140, 240, 0.9)");
    cg.addColorStop(1, "rgba(6, 40, 140, 0.2)");
    g.fillStyle = cg;
    g.fill();
    salpicar(g, 0, y0 + 10, tt + 0.2, rebose, 1);
    const anillo = quieto > 0.5 ? 0.2 : (tt * 1.3) % 1;
    g.strokeStyle = `rgba(210, 245, 255, ${rebose * (1 - anillo) * 0.8})`;
    g.lineWidth = 7;
    g.beginPath();
    g.ellipse(0, y1 - 10, 40 + 120 * anillo, 12 + 18 * anillo, 0, 0, 6.28);
    g.stroke();
  }

  // maneta, a la izquierda del depósito
  g.save();
  g.translate(-188, -250);
  g.rotate(-0.5 + maneta * 0.9);
  g.fillStyle = cromo(g, -14, -16, 14, 90);
  g.fillRect(-11, -8, 22, 86);
  g.beginPath();
  g.ellipse(0, 78, 20, 13, 0, 0, 6.28);
  g.fill();
  g.restore();

  // charco, si se pide
  if ((o.charco || 0) > 0.02) {
    const c = o.charco;
    g.beginPath();
    g.ellipse(20, 455, 90 + 280 * c, 22 + 30 * c, 0, 0, 6.28);
    g.fillStyle = `rgba(40, 150, 230, ${0.35 + 0.4 * c})`;
    g.fill();
    g.fillStyle = "rgba(200, 240, 255, 0.45)";
    g.fillRect(-60, 446, 90 + 80 * c, 6);
  }
  g.restore();
}

export function guante(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const dedos = () => {
    g.beginPath();
    g.moveTo(-48, 20);
    g.bezierCurveTo(-78, -60, -64, -150, -30, -172);
    g.lineTo(-6, -172);
    g.lineTo(-4, -118);
    g.lineTo(14, -184);
    g.lineTo(36, -180);
    g.lineTo(30, -114);
    g.lineTo(46, -158);
    g.lineTo(66, -146);
    g.bezierCurveTo(92, -70, 74, 10, 46, 36);
    g.quadraticCurveTo(0, 58, -48, 20);
    g.closePath();
  };
  dedos();
  const gg = g.createLinearGradient(-80, 0, 80, 0);
  gg.addColorStop(0, "#c49208");
  gg.addColorStop(0.32, "#ffe98a");
  gg.addColorStop(0.7, "#f0b41c");
  gg.addColorStop(1, "#a87808");
  g.fillStyle = gg;
  g.fill();
  g.save();
  dedos();
  g.clip();
  g.fillStyle = "rgba(255,255,255,0.5)";
  g.fillRect(-6, -184, 16, 230);
  g.restore();
  g.beginPath();
  g.moveTo(-36, 4);
  g.bezierCurveTo(-120, -20, -124, 58, -62, 70);
  g.bezierCurveTo(-20, 76, -8, 28, -30, 8);
  const pulgar = g.createLinearGradient(-124, 0, -8, 0);
  pulgar.addColorStop(0, "#b8880c");
  pulgar.addColorStop(0.5, "#ffe48a");
  pulgar.addColorStop(1, "#d8a020");
  g.fillStyle = pulgar;
  g.fill();
  const puno = g.createLinearGradient(-70, 24, 70, 70);
  puno.addColorStop(0, "#9a700c");
  puno.addColorStop(0.45, "#ffe9a0");
  puno.addColorStop(1, "#b88810");
  g.fillStyle = puno;
  k.redondo(g, -62, 28, 128, 42, 16);
  g.fill();
  g.restore();
}

export function valvula(g, x, y, ang, abierto) {
  g.save();
  g.translate(x, y);
  // placa y tubo que sale de la pared
  g.fillStyle = cromo(g, -70, -46, 210, 46);
  k.redondo(g, -20, -28, 250, 56, 28);
  g.fill();
  g.beginPath();
  g.ellipse(200, 0, 28, 28, 0, 0, 6.28);
  g.fillStyle = cromo(g, 170, -28, 230, 28);
  g.fill();
  // latiguillo hacia abajo
  g.beginPath();
  g.moveTo(188, 20);
  g.bezierCurveTo(200, 120, 160, 220, 150, 340);
  g.lineTo(176, 340);
  g.bezierCurveTo(196, 220, 230, 120, 214, 16);
  g.closePath();
  g.fillStyle = cromo(g, 150, 0, 230, 340);
  g.fill();
  // el agua dentro, se apaga al cerrar
  if (abierto > 0.04) {
    g.strokeStyle = `rgba(80, 190, 255, ${0.85 * abierto})`;
    g.lineWidth = 10;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(198, 36);
    g.bezierCurveTo(196, 120, 172, 210, 164, 300);
    g.stroke();
  }
  // volante
  g.beginPath();
  g.ellipse(0, 0, 78, 78, 0, 0, 6.28);
  g.fillStyle = cromo(g, -78, -78, 78, 78);
  g.fill();
  g.beginPath();
  g.ellipse(0, 0, 78, 78, 0, 0, 6.28);
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 6;
  g.stroke();
  g.save();
  g.rotate(ang);
  g.fillStyle = "#d7e2ec";
  g.fillRect(-9, -92, 18, 184);
  g.beginPath();
  g.ellipse(0, -92, 16, 16, 0, 0, 6.28);
  g.fill();
  g.beginPath();
  g.ellipse(0, 92, 16, 16, 0, 0, 6.28);
  g.fill();
  g.restore();
  g.beginPath();
  g.ellipse(0, 0, 18, 18, 0, 0, 6.28);
  g.fillStyle = "#24303a";
  g.fill();
  g.restore();
}

// Arco en sentido horario (el ángulo de canvas crece) con punta.
export function arco(g, x, y, r, a0, a1, al, color = "#ffd15a") {
  if (al < 0.03 || a1 <= a0) return;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = color;
  g.lineWidth = 14;
  g.lineCap = "round";
  g.beginPath();
  g.arc(x, y, r, a0, a1, false);
  g.stroke();
  const tx = -Math.sin(a1), ty = Math.cos(a1);
  const px = -ty, py = tx;
  const hx = x + Math.cos(a1) * r, hy = y + Math.sin(a1) * r;
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(hx + tx * 36, hy + ty * 36);
  g.lineTo(hx - tx * 16 + px * 18, hy - ty * 16 + py * 18);
  g.lineTo(hx - tx * 16 - px * 18, hy - ty * 16 - py * 18);
  g.closePath();
  g.fill();
  g.restore();
}

export function cubo(g, x, y, esc, lleno, rot = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  const w0 = 92, w1 = 118, h = 150;
  g.beginPath();
  g.moveTo(-w0, -h * 0.5);
  g.lineTo(w0, -h * 0.5);
  g.lineTo(w1, h * 0.5);
  g.lineTo(-w1, h * 0.5);
  g.closePath();
  const cg = g.createLinearGradient(-w1, 0, w1, 0);
  cg.addColorStop(0, "#9a3208");
  cg.addColorStop(0.35, "#ffb15a");
  cg.addColorStop(0.7, "#ff6a14");
  cg.addColorStop(1, "#8a2808");
  g.fillStyle = cg;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.fillRect(-8, -h * 0.45, 14, h * 0.9);
  if (lleno > 0.03) {
    g.save();
    g.clip();
    const yA = h * 0.5 - lleno * (h - 16);
    g.fillStyle = "rgba(40, 150, 230, 0.9)";
    g.fillRect(-w1, yA, w1 * 2, h);
    g.fillStyle = "rgba(190, 235, 255, 0.7)";
    g.fillRect(-w0 * 0.6, yA, w0 * 0.5, 6);
    g.restore();
  }
  g.beginPath();
  g.ellipse(0, -h * 0.5, w0, 18, 0, 0, 6.28);
  g.fillStyle = "#ffd7a4";
  g.fill();
  g.strokeStyle = "#9a3208";
  g.lineWidth = 6;
  g.stroke();
  // asa
  g.strokeStyle = cromo(g, -70, -160, 70, -40);
  g.lineWidth = 10;
  g.beginPath();
  g.arc(0, -h * 0.35, 78, Math.PI, 0);
  g.stroke();
  g.restore();
}

export function vaso(g, x, y, rot, esc, lleno) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.beginPath();
  g.moveTo(-36, -50);
  g.lineTo(36, -50);
  g.lineTo(30, 54);
  g.lineTo(-30, 54);
  g.closePath();
  if (lleno > 0.03) {
    g.save();
    g.clip();
    g.fillStyle = "rgba(50, 160, 235, 0.85)";
    g.fillRect(-40, 54 - lleno * 90, 80, 100);
    g.restore();
  }
  g.beginPath();
  g.moveTo(-36, -50);
  g.lineTo(36, -50);
  g.lineTo(30, 54);
  g.lineTo(-30, 54);
  g.closePath();
  k.vidrio(g, -36, 36, 0.7);
  g.restore();
}

export function botellaJabon(g, x, y, rot, esc) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.beginPath();
  k.redondo(g, -48, -90, 96, 200, 28);
  const bg = g.createLinearGradient(-48, 0, 48, 0);
  bg.addColorStop(0, "#d8a008");
  bg.addColorStop(0.3, "#fff1a4");
  bg.addColorStop(0.65, "#ffe14a");
  bg.addColorStop(1, "#e0a010");
  g.fillStyle = bg;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(-8, -80, 14, 170);
  g.fillStyle = "#1a6a38";
  k.redondo(g, -34, -20, 68, 78, 12);
  g.fill();
  g.fillStyle = "#f4fff4";
  g.font = "800 28px Figtree";
  g.textAlign = "center";
  g.fillText("SOAP", 0, 28);
  g.fillStyle = cromo(g, -16, -140, 16, -80);
  k.redondo(g, -16, -130, 32, 48, 8);
  g.fill();
  g.restore();
}

export function columna(g, x, y0, y1, w, t, tipo) {
  if (y1 <= y0 || w < 2) return;
  const onda = Math.sin(t * 16) * w * 0.08;
  g.beginPath();
  g.moveTo(x - w * 0.28, y0);
  g.bezierCurveTo(x - w * 0.1 + onda, (y0 + y1) / 2, x - w * 0.45 - onda, y0 + (y1 - y0) * 0.75, x - w * 0.42, y1);
  g.lineTo(x + w * 0.42, y1);
  g.bezierCurveTo(x + w * 0.45 - onda, y0 + (y1 - y0) * 0.75, x + w * 0.1 + onda, (y0 + y1) / 2, x + w * 0.28, y0);
  g.closePath();
  const cg = g.createLinearGradient(x - w, 0, x + w, 0);
  if (tipo === "jabon") {
    cg.addColorStop(0, "#c89810");
    cg.addColorStop(0.4, "#fff6b0");
    cg.addColorStop(1, "#e8b020");
  } else {
    cg.addColorStop(0, "#0a4ec8");
    cg.addColorStop(0.35, "#b6ecff");
    cg.addColorStop(0.62, "#3aa0f4");
    cg.addColorStop(1, "#083888");
  }
  g.fillStyle = cg;
  g.fill();
}

const BOLAS = Array.from({ length: 8 }, (_, i) => ({ x: (i - 3.5) * 36, f: (i * 0.17) % 1, r: 22 + (i % 3) * 8 }));

export function jabonHundido(g, x, y, t, al, prof) {
  if (al < 0.03) return;
  g.save();
  g.globalAlpha *= al;
  for (const b of BOLAS) {
    const p = Math.min(1, prof);
    const py = y + p * 150 + Math.sin(t * 3 + b.f * 6) * 4;
    g.beginPath();
    g.ellipse(x + b.x, py, b.r, b.r * 0.72, 0, 0, 6.28);
    g.fillStyle = "rgba(255, 220, 60, 0.92)";
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.7)";
    g.beginPath();
    g.ellipse(x + b.x - 4, py - 3, b.r * 0.28, b.r * 0.16, 0, 0, 6.28);
    g.fill();
  }
  g.restore();
}

export function vapor(g, x, y, t, al) {
  if (al < 0.03) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const p = (t * 0.35 + i * 0.25) % 1;
    g.globalAlpha = al * (1 - p) * 0.45;
    g.fillStyle = "rgba(255,255,255,0.9)";
    g.beginPath();
    g.ellipse(x + Math.sin(t + i) * 18, y - p * 160, 16 + p * 20, 22 + p * 16, 0, 0, 6.28);
    g.fill();
  }
  g.restore();
}

function papel(g, x, y, esc) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  const tiras = [[-46, -8, 92, 32, 0.35], [8, -40, 100, 30, -0.45], [-18, 22, 110, 34, 0.15], [24, 6, 74, 26, 0.7]];
  for (const [tx, ty, w, h, a] of tiras) {
    g.save();
    g.translate(tx, ty);
    g.rotate(a);
    g.fillStyle = "#fbf8f2";
    k.redondo(g, -w / 2, -h / 2, w, h, 14);
    g.fill();
    g.strokeStyle = "rgba(170, 160, 150, 0.85)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-w * 0.28, 0);
    g.lineTo(w * 0.28, 0);
    g.stroke();
    g.restore();
  }
  g.restore();
}

// El codo, visto de lado: una U de porcelana. El agua llega por la izquierda y el papel la para.
export function trampa(g, t, o = {}) {
  const empuje = o.empuje ?? 0.4;
  const cx = 10, cy = -30, R = 300;
  // depósito y taza, arriba a la izquierda, alimentando la boca del codo
  g.beginPath();
  k.redondo(g, -560, -520, 220, 250, 22);
  g.fillStyle = porcelana(g, -560, -520, -340, -270);
  g.fill();
  g.beginPath();
  g.moveTo(-530, -250);
  g.bezierCurveTo(-590, -40, -500, 40, -300, 10);
  g.lineTo(-250, -30);
  g.bezierCurveTo(-420, 0, -450, -80, -430, -240);
  g.closePath();
  g.fillStyle = porcelana(g, -590, -250, -240, 40);
  g.fill();
  g.beginPath();
  g.ellipse(-450, -210, 70, 24, 0, 0, 6.28);
  g.fillStyle = "#1480ea";
  g.fill();

  g.lineCap = "butt";
  g.lineWidth = 168;
  g.strokeStyle = porcelana(g, -320, -80, 340, 320);
  g.beginPath();
  g.arc(cx, cy, R, Math.PI, 0.08, false);
  g.stroke();
  g.lineWidth = 18;
  g.strokeStyle = "rgba(255,255,255,0.75)";
  g.beginPath();
  g.arc(cx, cy - 36, R, Math.PI + 0.15, -0.15, false);
  g.stroke();

  const finAgua = Math.PI * (0.55 - empuje * 0.03);
  g.lineCap = "round";
  g.lineWidth = 108;
  g.strokeStyle = "#1a74e4";
  g.beginPath();
  g.arc(cx, cy, R, Math.PI, finAgua, false);
  g.stroke();
  g.lineWidth = 22;
  g.strokeStyle = "rgba(190, 240, 255, 0.75)";
  g.beginPath();
  g.arc(cx, cy - 16, R, Math.PI + 0.05, finAgua - 0.08, false);
  g.stroke();

  g.lineWidth = 108;
  g.strokeStyle = "rgba(150, 168, 178, 0.55)";
  g.beginPath();
  g.arc(cx, cy, R, finAgua + 0.42, 0.02, false);
  g.stroke();

  const a = finAgua + 0.06;
  papel(g, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 1.15);
}

export function tetera(g, x, y, rot, t, hervor) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  // cuerpo
  g.beginPath();
  g.ellipse(0, 20, 120, 100, 0, 0, 6.28);
  g.fillStyle = cromo(g, -120, -80, 120, 130);
  g.fill();
  // ventana de hervor
  g.beginPath();
  g.ellipse(10, 24, 46, 36, 0, 0, 6.28);
  g.fillStyle = "#12375c";
  g.fill();
  g.save();
  g.clip();
  for (let i = 0; i < 6; i++) {
    const p = (t * (1.4 + hervor) + i * 0.16) % 1;
    g.globalAlpha = hervor * (1 - p);
    g.fillStyle = "rgba(210, 245, 255, 0.95)";
    g.beginPath();
    g.ellipse(-10 + (i % 3) * 16, 40 - p * 70, 8, 8, 0, 0, 6.28);
    g.fill();
  }
  g.restore();
  // pico
  g.beginPath();
  g.moveTo(90, -10);
  g.bezierCurveTo(170, -30, 200, -70, 210, -90);
  g.lineTo(196, -78);
  g.bezierCurveTo(180, -40, 150, 0, 80, 16);
  g.closePath();
  g.fillStyle = cromo(g, 80, -90, 210, 20);
  g.fill();
  // asa
  g.strokeStyle = cromo(g, -180, -80, -80, 80);
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.arc(-70, 20, 78, Math.PI * 0.6, Math.PI * 1.5);
  g.stroke();
  // tapa
  g.beginPath();
  g.ellipse(0, -70, 70, 22, 0, 0, 6.28);
  g.fillStyle = cromo(g, -70, -90, 70, -50);
  g.fill();
  g.fillRect(-8, -110, 16, 40);
  if (hervor > 0.2) vapor(g, 0, -120, t, hervor);
  g.restore();
}

export function aspa(g, x, y, s, al) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(Math.PI / 4);
  g.globalAlpha *= al;
  g.strokeStyle = "#ff3b30";
  g.lineWidth = 28 * s;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-70 * s, 0);
  g.lineTo(70 * s, 0);
  g.moveTo(0, -70 * s);
  g.lineTo(0, 70 * s);
  g.stroke();
  g.restore();
}

export function grieta(g, x, y, al) {
  if (al < 0.03) return;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = "#ffd0a0";
  g.lineWidth = 6;
  g.lineCap = "round";
  g.shadowColor = "rgba(255, 140, 60, 0.9)";
  g.shadowBlur = 16;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + 18, y + 36);
  g.lineTo(x - 8, y + 70);
  g.lineTo(x + 22, y + 120);
  g.stroke();
  g.restore();
}

export function banera(g, t, o = {}) {
  const burbuja = o.burbuja ?? 0;
  const quieto = o.quieto ?? 0;
  const tt = quieto > 0.5 ? 2 : t;
  g.beginPath();
  k.redondo(g, -420, -40, 860, 460, 80);
  g.fillStyle = porcelana(g, -420, -40, 440, 420);
  g.fill();
  g.save();
  g.clip();
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.fillRect(40, -40, 30, 460);
  g.restore();
  // agua
  g.beginPath();
  g.moveTo(-360, 80);
  g.bezierCurveTo(-200, 60 + Math.sin(tt) * 3, 200, 70, 360, 78);
  g.lineTo(340, 300);
  g.lineTo(-340, 300);
  g.closePath();
  g.fillStyle = "#1d78e4";
  g.fill();
  g.fillStyle = "rgba(200, 240, 255, 0.55)";
  g.fillRect(-200, 78, 140, 6);
  // desagüe
  g.beginPath();
  g.ellipse(0, 200, 28, 12, 0, 0, 6.28);
  g.fillStyle = cromo(g, -28, 188, 28, 214);
  g.fill();
  // burbuja
  if (burbuja > 0.02) {
    const by = 190 - burbuja * 150;
    const r = 20 + burbuja * 70;
    g.beginPath();
    g.ellipse(0, by, r, r * 0.86, 0, 0, 6.28);
    g.fillStyle = `rgba(210, 245, 255, ${0.35 + 0.4 * (1 - burbuja)})`;
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.8)";
    g.lineWidth = 4;
    g.stroke();
  }
}

export function telefono(g, x, y, esc, al) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = "#14181e";
  k.redondo(g, -90, -150, 180, 300, 36);
  g.fill();
  g.fillStyle = "#1ea35a";
  g.beginPath();
  g.ellipse(0, 70, 46, 46, 0, 0, 6.28);
  g.fill();
  g.strokeStyle = "#f4fff8";
  g.lineWidth = 10;
  g.lineCap = "round";
  g.beginPath();
  g.arc(0, 70, 18, Math.PI * 0.15, Math.PI * 0.85);
  g.stroke();
  g.beginPath();
  g.arc(0, 78, 18, Math.PI * 1.15, Math.PI * 1.85);
  g.stroke();
  g.restore();
}

export function quimico(g, x, y, esc) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.beginPath();
  k.redondo(g, -110, -220, 220, 460, 36);
  const bg = g.createLinearGradient(-110, 0, 110, 0);
  bg.addColorStop(0, "#6e0810");
  bg.addColorStop(0.3, "#ff4a55");
  bg.addColorStop(0.7, "#d01222");
  bg.addColorStop(1, "#4a060c");
  g.fillStyle = bg;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(-12, -200, 22, 400);
  // tapa
  g.fillStyle = cromo(g, -50, -280, 50, -210);
  k.redondo(g, -48, -270, 96, 60, 12);
  g.fill();
  // etiqueta
  g.fillStyle = "#fffaf2";
  k.redondo(g, -92, -80, 184, 200, 16);
  g.fill();
  g.fillStyle = "#1a120c";
  g.font = "800 40px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("NOT FOR", 0, -10);
  g.font = "800 42px Figtree";
  g.fillText("TOILETS", 0, 42);
  g.restore();
}

export function fogon(g, x, y, t, al) {
  if (al < 0.03) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha = al;
  const r = 70 + Math.sin(t * 12) * 8;
  const gr = g.createRadialGradient(x, y, 4, x, y, r);
  gr.addColorStop(0, "rgba(255, 240, 200, 0.95)");
  gr.addColorStop(0.5, "rgba(255, 120, 30, 0.7)");
  gr.addColorStop(1, "rgba(255, 60, 0, 0)");
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(x, y, r, r * 0.45, 0, 0, 6.28);
  g.fill();
  g.restore();
}
