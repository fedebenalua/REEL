// El móvil, la mejilla, el dedo, el mando y la luz infrarroja (magenta: es el color de lo que no se ve).
import * as k from "#kit";

export const IR = "255,30,130";
export const TEL = { x: 470, y: 1120, esc: 0.96, W: 640, H: 1280 };
const sensorLocal = [86, -TEL.H / 2 + 58];
export const SENSOR = {
  x: TEL.x + sensorLocal[0] * TEL.esc,
  y: TEL.y + sensorLocal[1] * TEL.esc,
};

export function fondo(g, calor = 0.3) {
  const bg = g.createLinearGradient(0, 0, 200, 1920);
  bg.addColorStop(0, "#1a0c28");
  bg.addColorStop(0.42, "#241238");
  bg.addColorStop(1, "#0c0614");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  const lamp = g.createRadialGradient(40, 280, 0, 40, 280, 820);
  lamp.addColorStop(0, `rgba(255,168,70,${0.34 + calor * 0.08})`);
  lamp.addColorStop(0.45, "rgba(255,120,60,0.08)");
  lamp.addColorStop(1, "rgba(255,120,60,0)");
  g.fillStyle = lamp;
  g.fillRect(0, 0, 1080, 1920);
  const azul = g.createRadialGradient(1040, 1500, 0, 1040, 1500, 640);
  azul.addColorStop(0, "rgba(70,90,255,0.16)");
  azul.addColorStop(1, "rgba(70,90,255,0)");
  g.fillStyle = azul;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
  g.save();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, 0, 0, 1080, 1920);
  g.restore();
}

export function velo(g, fuerza = 0.72) {
  const vg = g.createLinearGradient(0, 140, 0, 560);
  vg.addColorStop(0, `rgba(6,3,12,${fuerza})`);
  vg.addColorStop(1, "rgba(6,3,12,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 600);
}

function pantallaLlamada(g, t, e) {
  const W = TEL.W, H = TEL.H, m = 22;
  g.save();
  k.redondo(g, -W / 2 + m, -H / 2 + m, W - 2 * m, H - 2 * m, 70);
  g.clip();
  g.fillStyle = "#05060c";
  g.fillRect(-W / 2, -H / 2, W, H);
  if (e > 0.012) {
    g.save();
    g.globalAlpha = Math.min(1, e);
    const bg = g.createLinearGradient(0, -H / 2, 0, H / 2);
    bg.addColorStop(0, "#083526");
    bg.addColorStop(0.55, "#04160f");
    bg.addColorStop(1, "#020806");
    g.fillStyle = bg;
    g.fillRect(-W / 2, -H / 2, W, H);
    g.beginPath();
    g.arc(0, -210, 108, 0, 6.2832);
    const ag = g.createRadialGradient(-36, -250, 8, 0, -210, 120);
    ag.addColorStop(0, "#ffe0cc");
    ag.addColorStop(1, "#d4846a");
    g.fillStyle = ag;
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.92)";
    g.font = "800 54px Figtree";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("llamada", 0, -40);
    g.fillStyle = "#39f0a8";
    for (let i = 0; i < 15; i++) {
      const h = 18 + 78 * Math.abs(Math.sin(t * 7 + i * 0.65));
      k.redondo(g, -168 + i * 24, 90 - h / 2, 14, h, 7);
      g.fill();
    }
    g.beginPath();
    g.arc(0, 340, 78, 0, 6.2832);
    g.fillStyle = "#e4333a";
    g.fill();
    g.strokeStyle = "#fff";
    g.lineWidth = 10;
    g.lineCap = "round";
    g.beginPath();
    g.arc(0, 348, 26, 0.5, Math.PI - 0.5);
    g.stroke();
    g.beginPath();
    g.moveTo(-22, 338);
    g.lineTo(-8, 352);
    g.moveTo(22, 338);
    g.lineTo(8, 352);
    g.stroke();
    g.restore();
    if (e < 0.98) {
      g.save();
      g.globalCompositeOperation = "lighter";
      const rad = 30 + e * 520;
      const rg = g.createRadialGradient(0, -60, 0, 0, -60, rad);
      rg.addColorStop(0, `rgba(255,255,255,${0.7 * e})`);
      rg.addColorStop(0.35, `rgba(80,255,180,${0.28 * e})`);
      rg.addColorStop(1, "rgba(80,255,180,0)");
      g.fillStyle = rg;
      g.fillRect(-W / 2, -H / 2, W, H);
      g.restore();
    }
  }
  g.save();
  g.globalCompositeOperation = "screen";
  const rg = g.createLinearGradient(-W / 2, -H / 2, W / 3, H / 5);
  rg.addColorStop(0, "rgba(255,255,255,0.2)");
  rg.addColorStop(0.22, "rgba(255,255,255,0)");
  rg.addColorStop(0.55, "rgba(255,255,255,0.05)");
  rg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rg;
  g.fillRect(-W / 2, -H / 2, W, H);
  g.restore();
  g.restore();
}

export function telefono(g, x, y, esc, ang, t, encendida, sensor = 0) {
  const { W, H } = TEL;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(esc, esc);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.72)";
  g.shadowBlur = 80;
  g.shadowOffsetY = 36;
  k.redondo(g, -W / 2, -H / 2, W, H, 92);
  g.fillStyle = "#16181e";
  g.fill();
  g.restore();
  k.redondo(g, -W / 2, -H / 2, W, H, 92);
  k.metal(g, -W / 2, W / 2, ["#23262e", "#c5ccd4", "#5e656e", "#f2f4f7", "#2a2e36"]);
  g.save();
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -W / 2, -H / 2, W, H);
  g.restore();
  pantallaLlamada(g, t, encendida);
  g.fillStyle = "#07080c";
  for (let i = 0; i < 7; i++) {
    k.redondo(g, -78 + i * 16, -H / 2 + 46, 8, 22, 4);
    g.fill();
  }
  const [sx, sy] = sensorLocal;
  g.beginPath();
  g.arc(sx, sy, 18, 0, 6.2832);
  g.fillStyle = "#05060a";
  g.fill();
  g.beginPath();
  g.arc(sx, sy, 11, 0, 6.2832);
  const sg = g.createRadialGradient(sx - 3, sy - 4, 1, sx, sy, 12);
  sg.addColorStop(0, `rgba(255,180,210,${0.35 + 0.65 * sensor})`);
  sg.addColorStop(1, `rgba(40,0,20,${0.9})`);
  g.fillStyle = sg;
  g.fill();
  if (sensor > 0.05) k.brillo(g, sx, sy, 90 * sensor, IR, 0.85 * sensor);
  g.fillStyle = "#9aa2ac";
  k.redondo(g, W / 2 - 6, -120, 12, 110, 5);
  g.fill();
  g.restore();
}

export function ondas(g, x, y, t, al) {
  if (al < 0.03) return;
  g.save();
  g.strokeStyle = "rgba(90,255,180,0.9)";
  g.lineWidth = 5;
  g.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    const u = (t * 0.85 + i / 3) % 1;
    g.globalAlpha = al * (1 - u) * 0.85;
    g.beginPath();
    g.arc(x, y, 16 + u * 78, -1.05, 1.05);
    g.stroke();
  }
  g.restore();
}

function oreja(g) {
  g.save();
  g.translate(70, -30);
  g.beginPath();
  g.ellipse(0, 0, 100, 150, 0.12, 0, 6.2832);
  const eg = g.createRadialGradient(-30, -40, 10, 10, 10, 160);
  eg.addColorStop(0, "#ffd0b6");
  eg.addColorStop(0.55, "#f09a80");
  eg.addColorStop(1, "#c46e5c");
  g.fillStyle = eg;
  g.fill();
  g.strokeStyle = "rgba(120,55,48,0.35)";
  g.lineWidth = 8;
  g.stroke();
  g.beginPath();
  g.ellipse(10, 8, 52, 86, 0.2, 0, 6.2832);
  g.fillStyle = "#c86456";
  g.fill();
  g.strokeStyle = "rgba(255,214,196,0.75)";
  g.lineWidth = 9;
  g.beginPath();
  g.arc(-6, -16, 46, 0.7, 2.5);
  g.stroke();
  g.beginPath();
  g.ellipse(4, 118, 40, 30, 0.1, 0, 6.2832);
  const lg = g.createRadialGradient(-8, 108, 4, 4, 118, 40);
  lg.addColorStop(0, "#ffd8c4");
  lg.addColorStop(1, "#e09078");
  g.fillStyle = lg;
  g.fill();
  g.restore();
}

// pres: 0 lejos a la derecha, 1 pegada al cristal. enciende: la pantalla le da luz verde.
export function cabeza(g, x, y, s, pres, enciende) {
  g.save();
  const dx = (1 - pres) * 360;
  g.translate(x + dx, y);
  g.scale(s, s);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.5)";
  g.shadowBlur = 46;
  g.shadowOffsetX = 16;
  g.beginPath();
  g.moveTo(20, -520);
  g.bezierCurveTo(260, -560, 460, -280, 430, 40);
  g.bezierCurveTo(410, 280, 300, 520, 80, 540);
  g.bezierCurveTo(-80, 520, -70, 240, -36, 40);
  g.bezierCurveTo(-16, -220, -50, -420, 20, -520);
  g.closePath();
  const piel = g.createLinearGradient(-60, -400, 360, 420);
  piel.addColorStop(0, "#ffd8c2");
  piel.addColorStop(0.4, "#f3aa8c");
  piel.addColorStop(1, "#c87a64");
  g.fillStyle = piel;
  g.fill();
  g.restore();
  g.save();
  g.beginPath();
  g.moveTo(20, -520);
  g.bezierCurveTo(260, -560, 460, -280, 430, 40);
  g.bezierCurveTo(410, 280, 300, 520, 80, 540);
  g.bezierCurveTo(-80, 520, -70, 240, -36, 40);
  g.bezierCurveTo(-16, -220, -50, -420, 20, -520);
  g.clip();
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -80, -560, 620, 1160);
  g.restore();
  g.beginPath();
  g.moveTo(-20, -540);
  g.bezierCurveTo(180, -620, 420, -500, 390, -300);
  g.bezierCurveTo(300, -420, 80, -480, -20, -540);
  g.fillStyle = "#2a120e";
  g.fill();
  oreja(g);
  g.save();
  g.globalAlpha = 0.28;
  g.fillStyle = "#e06868";
  g.beginPath();
  g.ellipse(40, 120, 78, 42, -0.3, 0, 6.2832);
  g.fill();
  g.restore();
  if (enciende > 0.04) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const lg = g.createRadialGradient(-20, 20, 10, 40, 40, 280);
    lg.addColorStop(0, `rgba(120,255,190,${0.28 * enciende})`);
    lg.addColorStop(1, "rgba(120,255,190,0)");
    g.fillStyle = lg;
    g.beginPath();
    g.arc(20, 40, 280, 0, 6.2832);
    g.fill();
    g.restore();
  }
  g.restore();
}

export function dedo(g, x, y, u) {
  if (u <= 0.001) return;
  const yy = k.mez(y - 640, y, k.entra(Math.min(1, u)));
  g.save();
  g.translate(x, yy);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 12;
  k.redondo(g, -54, -460, 108, 500, 54);
  const fg = g.createLinearGradient(-54, 0, 54, 0);
  fg.addColorStop(0, "#e7a48c");
  fg.addColorStop(0.42, "#ffe0cc");
  fg.addColorStop(1, "#c47c66");
  g.fillStyle = fg;
  g.fill();
  g.restore();
  g.save();
  g.globalAlpha = 0.22;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -54, -460, 108, 500);
  g.restore();
  g.beginPath();
  g.ellipse(0, 8, 34, 28, 0, 0, 6.2832);
  const ng = g.createLinearGradient(-20, -10, 20, 30);
  ng.addColorStop(0, "#fff4ea");
  ng.addColorStop(1, "#f0c2ae");
  g.fillStyle = ng;
  g.fill();
  g.strokeStyle = "rgba(160,90,74,0.45)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-30, -80);
  g.quadraticCurveTo(0, -64, 30, -80);
  g.stroke();
  g.restore();
}

// Un cono de luz infrarroja, ancho, de (x0,y0) a (x1,y1). No es una línea.
export function cono(g, x0, y0, x1, y1, al, ancho = 90) {
  if (al < 0.02) return;
  const ang = Math.atan2(y1 - y0, x1 - x0);
  const L = Math.hypot(x1 - x0, y1 - y0);
  g.save();
  g.translate(x0, y0);
  g.rotate(ang);
  g.globalCompositeOperation = "lighter";
  const gr = g.createLinearGradient(0, 0, L, 0);
  gr.addColorStop(0, `rgba(255,60,150,${0.15 * al})`);
  gr.addColorStop(0.35, `rgba(255,40,130,${0.28 * al})`);
  gr.addColorStop(1, "rgba(255,40,130,0)");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(0, -14);
  g.lineTo(L, -ancho);
  g.lineTo(L, ancho);
  g.lineTo(0, 14);
  g.closePath();
  g.fill();
  g.fillStyle = `rgba(255,220,235,${0.55 * al})`;
  k.redondo(g, 0, -7, L * 0.92, 14, 7);
  g.fill();
  g.restore();
  k.brillo(g, x0, y0, 90, IR, al * 0.9);
  k.brillo(g, x1, y1, ancho * 2.2, IR, al * 0.75);
}

export function televisor(g, x, y, w, h, t) {
  g.save();
  g.translate(x, y);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.55)";
  g.shadowBlur = 40;
  g.shadowOffsetY = 16;
  k.redondo(g, -w / 2, -h / 2, w, h, 28);
  g.fillStyle = "#14161c";
  g.fill();
  g.restore();
  g.save();
  k.redondo(g, -w / 2 + 16, -h / 2 + 16, w - 32, h - 48, 16);
  g.clip();
  const cielo = g.createLinearGradient(0, -h / 2, 0, h / 2);
  cielo.addColorStop(0, "#5ec8ff");
  cielo.addColorStop(0.55, "#f7d29a");
  cielo.addColorStop(1, "#3a8f4a");
  g.fillStyle = cielo;
  g.fillRect(-w / 2, -h / 2, w, h);
  g.fillStyle = "#f4fbff";
  g.beginPath();
  g.ellipse(-80 + 20 * Math.sin(t * 0.4), -40, 90, 36, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#2f7a3e";
  g.beginPath();
  g.moveTo(-w / 2, h / 2 - 20);
  g.lineTo(-40, 20);
  g.lineTo(80, h / 2 - 20);
  g.fill();
  g.fillStyle = "#246b34";
  g.beginPath();
  g.moveTo(20, h / 2 - 20);
  g.lineTo(160, -10);
  g.lineTo(w / 2, h / 2 - 20);
  g.fill();
  g.restore();
  g.beginPath();
  g.arc(0, h / 2 - 16, 8, 0, 6.2832);
  g.fillStyle = "#1a1c22";
  g.fill();
  g.restore();
}

export function mando(g, x, y, ang, pulsa, luz) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.55)";
  g.shadowBlur = 36;
  g.shadowOffsetY = 18;
  k.redondo(g, -70, -210, 140, 460, 46);
  g.fillStyle = "#1c1e24";
  g.fill();
  g.restore();
  k.redondo(g, -70, -210, 140, 460, 46);
  k.metal(g, -70, 70, ["#2c3038", "#d5dbe3", "#6a727c", "#f4f6f8", "#24282e"]);
  g.beginPath();
  g.arc(0, -168, 16, 0, 6.2832);
  g.fillStyle = luz > 0.2 ? "#3a1020" : "#12141a";
  g.fill();
  if (luz > 0.05) k.brillo(g, 0, -168, 70, IR, luz);
  const teclas = [[-28, -70, "#e23b4a"], [28, -70, "#3a3e46"], [-28, -10, "#3a3e46"], [28, -10, "#3a3e46"], [0, 70, "#2a2e36"]];
  for (const [tx, ty, col] of teclas) {
    const hunde = tx === -28 && ty === -70 ? pulsa * 6 : 0;
    g.beginPath();
    g.arc(tx, ty + hunde, tx === 0 && ty === 70 ? 28 : 20, 0, 6.2832);
    g.fillStyle = col;
    g.fill();
  }
  g.restore();
}

export function camara(g, fx, fy, z) {
  g.translate(540, 960);
  g.scale(z, z);
  g.translate(-fx, -fy);
}

// El interior del sensor, en un recuadro de 440×700. La mejilla llena casi todo: el emisor está en primer plano.
export function dentro(g, t, cerca, sale, vuelve, al) {
  const pielX = k.mez(40, -30, cerca);
  const pg = g.createLinearGradient(0, 0, 440, 700);
  pg.addColorStop(0, "#ffd0b8");
  pg.addColorStop(0.45, "#f0a88c");
  pg.addColorStop(1, "#c47864");
  g.fillStyle = pg;
  g.fillRect(pielX, -80, 560, 900);
  g.save();
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, pielX, 0, 480, 700);
  g.restore();
  g.save();
  g.strokeStyle = "rgba(150,70,60,0.35)";
  g.lineWidth = 10;
  g.beginPath();
  g.arc(260 + pielX * 0.2, 300, 120, 0.4, 2.2);
  g.stroke();
  g.restore();
  g.save();
  g.beginPath();
  g.rect(0, 0, 168, 700);
  g.clip();
  const cav = g.createLinearGradient(0, 0, 168, 0);
  cav.addColorStop(0, "#1a1014");
  cav.addColorStop(1, "#3a2420");
  g.fillStyle = cav;
  g.fillRect(0, 0, 168, 700);
  g.restore();
  g.save();
  const vg = g.createLinearGradient(150, 0, 196, 0);
  vg.addColorStop(0, "rgba(255,255,255,0.55)");
  vg.addColorStop(0.5, "rgba(255,255,255,0.05)");
  vg.addColorStop(1, "rgba(210,240,255,0.28)");
  g.fillStyle = vg;
  g.fillRect(152, 0, 44, 700);
  g.restore();
  const led = [92, 470], ojo = [92, 230], blanco = [210, 400];
  g.save();
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 18;
  k.redondo(g, ojo[0] - 46, ojo[1] - 46, 92, 92, 22);
  g.fillStyle = "#140e0c";
  g.fill();
  g.restore();
  const ojoLuz = Math.min(1, vuelve * al * (0.4 + 0.8 * cerca));
  g.beginPath();
  g.arc(ojo[0], ojo[1], 22, 0, 6.2832);
  g.fillStyle = `rgb(${k.mezRgb("90,55,30", "255,214,90", ojoLuz)})`;
  g.fill();
  g.beginPath();
  g.arc(led[0], led[1], 36, 0, 6.2832);
  const lg = g.createRadialGradient(led[0] - 10, led[1] - 12, 2, led[0], led[1], 36);
  lg.addColorStop(0, "#ffe0ea");
  lg.addColorStop(0.45, "#e01858");
  lg.addColorStop(1, "#4a0618");
  g.fillStyle = lg;
  g.fill();
  const luzPiel = Math.min(1, al * (0.55 * sale + 0.85 * vuelve));
  g.save();
  g.globalCompositeOperation = "lighter";
  g.fillStyle = `rgba(255,40,130,${0.42 * luzPiel})`;
  g.fillRect(168, 0, 280, 700);
  g.restore();
  const llega = k.mez(led[0] + 40, blanco[0] + 80, sale);
  cono(g, led[0] + 24, led[1], llega, blanco[1], al * (0.4 + 0.6 * sale), k.mez(90, 170, cerca));
  if (vuelve > 0.04) {
    const rx = k.mez(blanco[0] + 40, ojo[0] + 20, vuelve);
    const ry = k.mez(blanco[1] - 20, ojo[1], vuelve);
    cono(g, blanco[0] + 40, blanco[1] - 20, rx, ry, al * vuelve * (0.55 + 0.45 * cerca), k.mez(70, 150, cerca));
  }
  k.brillo(g, led[0], led[1], 120, IR, 0.7 * al);
  if (ojoLuz > 0.08) k.brillo(g, ojo[0], ojo[1], 100, "255,210,90", ojoLuz);
}
