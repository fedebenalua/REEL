// Lo que comparten los planos: las teles, el clicker, el móvil y la luz de cada época.
// Cian = radio. Oro = el clic que no se oye. Violeta = la luz que el ojo no ve.
import * as k from "#kit";

export const CIAN = "70,220,255";
export const ORO = "255,196,70";
export const VIOLETA = "186,96,255";

export function velo(g, fuerza = 0.72) {
  const vg = g.createLinearGradient(0, 80, 0, 760);
  vg.addColorStop(0, `rgba(6,4,10,${fuerza})`);
  vg.addColorStop(0.55, `rgba(6,4,10,${fuerza * 0.55})`);
  vg.addColorStop(1, "rgba(6,4,10,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 780);
}

export function cartel(g, cam, X, fn) {
  const p = k.proyecta(cam, X);
  if (!p) return null;
  const s = k.F / p.z;
  g.save();
  g.translate(p.x, p.y);
  g.scale(s, s);
  fn(g, p, s);
  g.restore();
  return { ...p, s };
}

function quad(g, cam, pts, color) {
  const p = pts.map((X) => k.proyecta(cam, X));
  if (p.some((q) => !q)) return;
  g.beginPath();
  g.moveTo(p[0].x, p[0].y);
  for (let i = 1; i < p.length; i++) g.lineTo(p[i].x, p[i].y);
  g.closePath();
  g.fillStyle = color;
  g.fill();
}

// ---------------------------------------------------------------- pantallas
function show(pintar) {
  const c = k.lienzo(480, 270), g = c.getContext("2d");
  pintar(g);
  return c;
}

export const SHOWS = [
  show((g) => {
    g.fillStyle = "#168a3c"; g.fillRect(0, 0, 480, 270);
    g.fillStyle = "#0e6d2e"; g.fillRect(0, 150, 480, 120);
    g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 8;
    g.beginPath(); g.arc(230, 168, 78, 0.15, Math.PI - 0.15); g.stroke();
    g.beginPath(); g.moveTo(40, 168); g.lineTo(440, 168); g.stroke();
    g.fillStyle = "#ffb11a"; g.beginPath(); g.arc(318, 118, 26, 0, 6.3); g.fill();
    g.fillStyle = "rgba(255,255,255,0.9)"; g.fillRect(70, 36, 150, 18); g.fillRect(70, 64, 90, 12);
  }),
  show((g) => {
    g.fillStyle = "#3a2288"; g.fillRect(0, 0, 480, 270);
    const cielo = g.createLinearGradient(0, 0, 0, 270);
    cielo.addColorStop(0, "#6a48d8"); cielo.addColorStop(1, "#241250");
    g.fillStyle = cielo; g.fillRect(0, 0, 480, 270);
    g.fillStyle = "#ffd23a"; g.beginPath(); g.arc(250, 150, 70, 0, 6.3); g.fill();
    g.fillStyle = "#2a1860"; g.beginPath(); g.arc(226, 140, 8, 0, 6.3); g.arc(274, 140, 8, 0, 6.3); g.fill();
    g.strokeStyle = "#2a1860"; g.lineWidth = 6; g.beginPath(); g.arc(250, 162, 28, 0.3, Math.PI - 0.3); g.stroke();
    g.fillStyle = "#ff5a8a"; g.beginPath(); g.arc(80, 50, 18, 0, 6.3); g.arc(400, 70, 12, 0, 6.3); g.fill();
  }),
  show((g) => {
    const bg = g.createLinearGradient(0, 0, 0, 270);
    bg.addColorStop(0, "#ff8a2a"); bg.addColorStop(1, "#ffd25a");
    g.fillStyle = bg; g.fillRect(0, 0, 480, 270);
    g.fillStyle = "#fff4d2"; k.redondo(g, 250, 40, 150, 190, 30); g.fill();
    g.fillStyle = "#e23a3a"; k.redondo(g, 270, 70, 110, 70, 12); g.fill();
    g.fillStyle = "rgba(255,255,255,0.85)"; g.fillRect(60, 70, 140, 22); g.fillRect(60, 106, 100, 14);
  }),
  show((g) => {
    g.fillStyle = "#071426"; g.fillRect(0, 0, 480, 270);
    g.fillStyle = "#123"; g.fillRect(0, 150, 480, 120);
    const az = k.azar(9);
    for (let i = 0; i < 28; i++) {
      const x = 30 + (i % 7) * 64, y = 40 + Math.floor(i / 7) * 48;
      g.fillStyle = az() > 0.45 ? "#ffe27a" : "#1c3148";
      g.fillRect(x, y, 22, 16);
    }
    g.fillStyle = "#0b1c30"; g.fillRect(40, 168, 70, 102); g.fillRect(200, 140, 90, 130); g.fillRect(340, 156, 80, 114);
  }),
  show((g) => {
    g.fillStyle = "#123055"; g.fillRect(0, 0, 480, 270);
    g.fillStyle = "#1d4e86"; g.fillRect(0, 170, 480, 100);
    g.fillStyle = "#f2f6ff"; g.beginPath(); g.arc(150, 120, 46, 0, 6.3); g.fill();
    g.fillStyle = "#d7e4f8"; k.redondo(g, 104, 160, 92, 70, 20); g.fill();
    g.fillStyle = "#9fd0ff"; g.fillRect(240, 70, 190, 16); g.fillRect(240, 100, 150, 12); g.fillRect(240, 124, 170, 12);
  }),
];

export const NSHOW = SHOWS.length;

export function nieve(g, x, y, w, h, t) {
  g.save();
  k.redondo(g, x, y, w, h, 8); g.clip();
  g.fillStyle = "#9aa3ad"; g.fillRect(x, y, w, h);
  const off = (Math.floor(t * 14) * 37) % 200;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, x - off, y, w + 200, h);
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.45;
  g.drawImage(k.red, x - off * 0.5, y - 20, w + 80, h + 40);
  g.restore();
}

// Tele en píxeles, centro (x, y). estilo 0 madera, 1 plana. canal -1 apagada, -2 nieve.
export function tele(g, x, y, w, h, canal, estilo, t = 0, mute = 0) {
  const u = Math.min(w, h);
  g.save();
  g.translate(x, y);
  if (estilo < 0.5) {
    const bw = w * 0.16, bh = h * 0.2;
    k.redondo(g, -w / 2 - bw, -h / 2 - bh * 0.25, w + bw * 2, h + bh * 1.35, u * 0.08);
    const madera = g.createLinearGradient(-w / 2, 0, w / 2, 0);
    madera.addColorStop(0, "#4a2a16"); madera.addColorStop(0.35, "#a56a38"); madera.addColorStop(0.7, "#6b3e1e"); madera.addColorStop(1, "#3a2010");
    g.fillStyle = madera; g.fill();
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35;
    g.drawImage(k.red, -w / 2 - bw, -h / 2, w + bw * 2, h + bh); g.restore();
    g.save();
    k.redondo(g, -w / 2, -h / 2, w, h, u * 0.05); g.clip();
    pantalla(g, -w / 2, -h / 2, w, h, canal, t);
    g.restore();
    g.strokeStyle = "rgba(255,255,255,0.2)"; g.lineWidth = Math.max(2, u * 0.012);
    g.beginPath(); g.ellipse(0, -h * 0.08, w * 0.38, h * 0.22, -0.5, 0.5, 1.6); g.stroke();
    g.fillStyle = "#e6c48a";
    g.beginPath(); g.arc(-w * 0.28, h / 2 + bh * 0.42, u * 0.045, 0, 6.3); g.arc(w * 0.28, h / 2 + bh * 0.42, u * 0.045, 0, 6.3); g.fill();
    g.fillStyle = "#1a100c";
    for (let i = 0; i < 7; i++) g.fillRect(-w * 0.16 + i * u * 0.05, h / 2 + u * 0.02, u * 0.025, u * 0.05);
  } else {
    k.redondo(g, -w / 2 - u * 0.03, -h / 2 - u * 0.03, w + u * 0.06, h + u * 0.12, u * 0.05);
    const bezel = g.createLinearGradient(-w / 2, 0, w / 2, 0);
    bezel.addColorStop(0, "#14161c"); bezel.addColorStop(0.4, "#3a4150"); bezel.addColorStop(1, "#0c0e12");
    g.fillStyle = bezel; g.fill();
    g.save();
    const m = u * 0.02;
    k.redondo(g, -w / 2 + m, -h / 2 + m, w - m * 2, h - m * 2, u * 0.03); g.clip();
    pantalla(g, -w / 2 + m, -h / 2 + m, w - m * 2, h - m * 2, canal, t);
    g.restore();
    g.fillStyle = "#1a1e26"; g.fillRect(-u * 0.06, h / 2 + u * 0.02, u * 0.12, u * 0.05);
    g.fillStyle = "#0e1014"; k.redondo(g, -w * 0.22, h / 2 + u * 0.06, w * 0.44, u * 0.035, u * 0.02); g.fill();
    g.fillStyle = canal < 0 ? "#3a2018" : "#ff3b2e";
    g.beginPath(); g.arc(0, h / 2 + u * 0.015, Math.max(3, u * 0.018), 0, 6.3); g.fill();
    if (canal >= 0) k.brillo(g, 0, h / 2 + u * 0.015, u * 0.16, "255,60,40", 0.85);
  }
  if (mute > 0.05) {
    g.save(); g.globalAlpha = mute;
    g.strokeStyle = "#fff"; g.fillStyle = "rgba(0,0,0,0.45)";
    g.lineWidth = Math.max(4, u * 0.035); g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.arc(0, 0, u * 0.2, 0, 6.3); g.fill();
    const s = u * 0.09;
    g.beginPath(); g.moveTo(-s, -s * 0.15); g.lineTo(-s * 0.15, -s * 0.15); g.lineTo(s * 0.7, -s); g.lineTo(s * 0.7, s); g.lineTo(-s * 0.15, s * 0.15); g.lineTo(-s, s * 0.15); g.closePath();
    g.stroke();
    g.beginPath(); g.moveTo(-s * 0.75, -s * 0.85); g.lineTo(s * 0.9, s * 0.9); g.stroke();
    g.restore();
  }
  g.restore();
}

// La misma tele puesta en el mundo, con ancho y alto en unidades de mundo.
export function teleEn(g, cam, X, w, h, canal, estilo, t, mute = 0) {
  const p = k.proyecta(cam, X);
  if (!p) return null;
  const s = k.F / p.z;
  tele(g, p.x, p.y, w * s, h * s, canal, estilo, t, mute);
  return p;
}

function pantalla(g, x, y, w, h, canal, t) {
  if (canal === -1) {
    g.fillStyle = "#05060a"; g.fillRect(x, y, w, h);
    return;
  }
  if (canal === -2) { nieve(g, x, y, w, h, t); return; }
  const img = SHOWS[Math.abs(canal) % NSHOW];
  g.drawImage(img, x, y, w, h);
  g.save();
  const br = g.createLinearGradient(x, y, x + w, y + h);
  br.addColorStop(0, "rgba(255,255,255,0.16)"); br.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = br; g.fillRect(x, y, w, h);
  g.restore();
}

// ---------------------------------------------------------------- mandos
export function mandoRadio(g, pulsa) {
  // Unidades de mundo, centro en el origen. Alto ~1.2
  k.redondo(g, -0.32, -0.5, 0.64, 1.05, 0.12);
  k.metal(g, -0.32, 0.32, ["#3a241c", "#c48a62", "#6a4030", "#e2b088", "#2a1812"]);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28;
  g.drawImage(k.red, -0.32, -0.5, 0.64, 1.05); g.restore();
  // antena
  g.strokeStyle = "#d7dde6"; g.lineWidth = 0.035; g.lineCap = "round";
  g.beginPath(); g.moveTo(0, -0.5); g.lineTo(0.04, -1.15); g.stroke();
  g.fillStyle = "#9aa6b4"; g.beginPath(); g.arc(0.04, -1.18, 0.05, 0, 6.3); g.fill();
  // botón
  const h = 0.04 * pulsa;
  g.fillStyle = pulsa > 0.4 ? "#7ee9ff" : "#1a9bb0";
  g.beginPath(); g.ellipse(0, -0.22 + h, 0.12, 0.07, 0, 0, 6.3); g.fill();
  if (pulsa > 0.15) {
    g.save(); g.globalAlpha = Math.min(1, pulsa * 1.4);
    g.fillStyle = "#f0b090";
    g.beginPath(); g.ellipse(0.02, -0.34 + h, 0.1, 0.16, 0.2, 0, 6.3); g.fill();
    g.restore();
  }
  g.fillStyle = "#f4f7fb";
  g.beginPath(); g.arc(-0.16, 0.18, 0.045, 0, 6.3); g.arc(0, 0.18, 0.045, 0, 6.3); g.arc(0.16, 0.18, 0.045, 0, 6.3); g.fill();
}

export function clickerCuerpo(g, w, h, boton) {
  k.redondo(g, -w / 2, -h / 2, w, h, 36);
  const cuerpo = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  cuerpo.addColorStop(0, "#3a2418"); cuerpo.addColorStop(0.42, "#a87848"); cuerpo.addColorStop(0.72, "#6a4224"); cuerpo.addColorStop(1, "#2a1810");
  g.fillStyle = cuerpo; g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3;
  g.drawImage(k.manchas, -w / 2, -h / 2, w, h); g.restore();
  g.strokeStyle = "rgba(255,214,140,0.7)"; g.lineWidth = 6;
  k.redondo(g, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 28); g.stroke();
  const xs = [-w * 0.3, -w * 0.1, w * 0.1, w * 0.3];
  xs.forEach((x, i) => {
    const on = boton === i;
    g.save(); g.translate(x, -h * 0.08 + (on ? 6 : 0));
    g.fillStyle = on ? "#ffe08a" : "#e6c27a";
    g.beginPath(); g.ellipse(0, 0, 28, 18, 0, 0, 6.3); g.fill();
    g.fillStyle = "rgba(90,50,20,0.45)"; g.beginPath(); g.ellipse(-6, -4, 10, 6, -0.4, 0, 6.3); g.fill();
    g.restore();
  });
}

// Interior del clicker, en píxeles, centro del hueco.
export function interior(g, t, golpeEn, conPulgar, spread) {
  k.redondo(g, -340, -460, 680, 920, 48);
  const cav = g.createLinearGradient(-340, 0, 340, 0);
  cav.addColorStop(0, "#1a100c"); cav.addColorStop(0.5, "#3a281c"); cav.addColorStop(1, "#120c09");
  g.fillStyle = cav; g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4;
  g.drawImage(k.manchas, -340, -460, 680, 920); g.restore();

  const s = k.suave(Math.max(0, Math.min(1, spread)));
  const n = 1 + Math.round(s * 3);
  const altas = [460, 420, 490, 390];
  const bases = [-180, -60, 60, 180];
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(k.mez(0, bases[i], s < 0.04 ? 0 : s));
  const golpe = (i) => {
    const t0 = golpeEn[i];
    if (t0 == null) return 0;
    return Math.exp(-Math.pow((t - t0) / 0.12, 2));
  };
  xs.forEach((x, i) => {
    const al = altas[i];
    const y0 = 180 - al;
    k.redondo(g, x - 16, y0, 32, al, 12);
    k.metal(g, x - 16, x + 16, ["#8d97a3", "#f4f7fb", "#c5ced8", "#ffffff", "#7e8794"]);
    const br = golpe(i);
    if (br > 0.05) k.brillo(g, x, y0 + 10, 180, ORO, br);
    // anillo que sube si suena
    if (br > 0.02) {
      g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = br;
      g.strokeStyle = `rgba(${ORO},0.9)`; g.lineWidth = 4;
      g.beginPath(); g.ellipse(x, y0 - 30 - (1 - br) * 80, 26 + (1 - br) * 20, 10, 0, 0, 6.3); g.stroke();
      g.restore();
    }
  });

  // martillo: va a la varilla que toca
  let hx = xs[0], ang = -0.6;
  for (let i = 0; i < xs.length; i++) {
    const t0 = golpeEn[i];
    if (t0 == null) continue;
    const cerca = k.tramo(t, t0 - 0.28, t0 - 0.04);
    if (t > t0 - 0.28) hx = k.mez(hx, xs[i], k.entra(cerca));
    if (t > t0 - 0.22 && t < t0 + 0.2) {
      const u = k.tramo(t, t0 - 0.16, t0);
      const v = k.tramo(t, t0, t0 + 0.08);
      ang = t < t0 ? k.mez(-0.2, -1.05, k.suave(u)) : k.mez(-1.05, 0.15, k.entra(v));
    }
  }
  g.save();
  g.translate(hx, -250);
  g.rotate(ang);
  g.fillStyle = "#5c636e";
  k.redondo(g, -14, 0, 28, 210, 10); g.fill();
  g.fillStyle = "#d5dbe3";
  k.redondo(g, -26, 190, 52, 36, 8); g.fill();
  g.restore();

  if (conPulgar > 0.01) pulgar(g, k.mez(280, 70, k.entra(conPulgar)), 180 - 460, 460 * Math.min(1, conPulgar * 1.3));
}

export function pulgar(g, x, y, alto) {
  g.save();
  g.translate(x, y + (460 - alto));
  const h = alto;
  k.redondo(g, 0, 0, h * 0.42, h, h * 0.2);
  const piel = g.createLinearGradient(0, 0, h * 0.42, 0);
  piel.addColorStop(0, "#d98968"); piel.addColorStop(0.45, "#ffc2a2"); piel.addColorStop(1, "#e09474");
  g.fillStyle = piel; g.fill();
  g.fillStyle = "#ffe0d0";
  k.redondo(g, h * 0.08, 8, h * 0.26, h * 0.22, 12); g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  k.redondo(g, h * 0.12, 16, h * 0.08, h * 0.12, 8); g.fill();
  g.restore();
}

export function pila(g, x, y, s, viva) {
  g.save();
  g.translate(x, y); g.scale(s, s);
  k.redondo(g, -28, -70, 56, 140, 16);
  const c = viva > 0.5 ? ["#3a4a28", "#b7c96a", "#6e8438", "#e4ee9a", "#2c3a1c"] : ["#2a2c30", "#8a8e96", "#4a4e56", "#c8ccd2", "#1c1e22"];
  k.metal(g, -28, 28, c);
  g.fillStyle = viva > 0.5 ? "#d7a24a" : "#6a6260";
  k.redondo(g, -18, -86, 36, 24, 6); g.fill();
  g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(-16, -10, 32, 10);
  g.restore();
}

export function anillos(g, x, y, r, rgb, al, n = 3) {
  if (al < 0.02 || r < 2) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.fillStyle = `rgba(${rgb},${al * 0.16})`;
  g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
  for (let i = 0; i < n; i++) {
    const rr = r * (1 - i * 0.16);
    g.strokeStyle = `rgba(${rgb},${al * (0.85 - i * 0.2)})`;
    g.lineWidth = 22 - i * 5;
    g.beginPath(); g.arc(x, y, rr, 0, 6.3); g.stroke();
  }
  k.brillo(g, x, y, r * 1.4, rgb, al * 0.45);
  g.restore();
}

// Haz violeta de (x0,y0) a (x1,y1). No ilumina el suelo: solo el núcleo.
export function haz(g, x0, y0, x1, y1, al) {
  if (al < 0.02) return;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.beginPath();
  g.moveTo(x0 + nx * 8, y0 + ny * 8);
  g.lineTo(x1 + nx * 36, y1 + ny * 36);
  g.lineTo(x1 - nx * 36, y1 - ny * 36);
  g.lineTo(x0 - nx * 8, y0 - ny * 8);
  g.closePath();
  g.fillStyle = `rgba(${VIOLETA},${0.28 * al})`; g.fill();
  g.strokeStyle = `rgba(255,255,255,${0.65 * al})`; g.lineWidth = 4;
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  k.brillo(g, x1, y1, 160, VIOLETA, al);
  g.restore();
}

// Móvil en píxeles, centro (x, y), alto h. La pantalla es un mando.
export function movil(g, x, y, h, pulso = 0) {
  const w = h * 0.48;
  g.save();
  g.translate(x, y);
  k.redondo(g, -w / 2, -h / 2, w, h, h * 0.08);
  k.metal(g, -w / 2, w / 2, ["#2a2e36", "#d5dbe4", "#8b929e", "#f5f7fb", "#1c2026"]);
  const m = h * 0.035;
  k.redondo(g, -w / 2 + m, -h / 2 + m, w - m * 2, h - m * 2, h * 0.06);
  g.fillStyle = "#0c1018"; g.fill();
  // isla
  g.fillStyle = "#05070b";
  k.redondo(g, -w * 0.14, -h / 2 + m + 8, w * 0.28, h * 0.028, 12); g.fill();
  const sx = -w / 2 + m, sy = -h / 2 + m + h * 0.07, sw = w - m * 2, sh = h * 0.78;
  // botones del mando
  const bot = (bx, by, bw, bh, color, marca) => {
    g.save(); g.translate(bx, by); g.scale(1 + 0.04 * pulso, 1 + 0.04 * pulso);
    k.redondo(g, -bw / 2, -bh / 2, bw, bh, Math.min(bw, bh) * 0.3);
    g.fillStyle = color; g.fill();
    g.fillStyle = "rgba(255,255,255,0.9)"; g.strokeStyle = "rgba(255,255,255,0.9)";
    g.lineWidth = Math.max(4, bh * 0.08); g.lineCap = "round"; g.lineJoin = "round";
    if (marca === "on") {
      g.beginPath(); g.arc(0, 6, bh * 0.22, -2.4, 2.4); g.stroke();
      g.beginPath(); g.moveTo(0, -bh * 0.28); g.lineTo(0, 4); g.stroke();
    } else if (marca === "up" || marca === "down") {
      g.beginPath();
      const s = bh * 0.22, d = marca === "up" ? -1 : 1;
      g.moveTo(0, d * -s); g.lineTo(s, d * s * 0.6); g.lineTo(-s, d * s * 0.6); g.closePath(); g.fill();
    }
    g.restore();
  };
  bot(0, sy + sh * 0.16, sw * 0.42, sh * 0.16, "#e23a3a", "on");
  bot(-sw * 0.24, sy + sh * 0.48, sw * 0.34, sh * 0.2, "#1f6bff", "up");
  bot(-sw * 0.24, sy + sh * 0.74, sw * 0.34, sh * 0.2, "#1f6bff", "down");
  bot(sw * 0.24, sy + sh * 0.48, sw * 0.34, sh * 0.2, "#19b37a", "up");
  bot(sw * 0.24, sy + sh * 0.74, sw * 0.34, sh * 0.2, "#19b37a", "down");
  // cristal
  g.save();
  const rg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(0.32, "rgba(255,255,255,0.14)"); rg.addColorStop(0.42, "rgba(255,255,255,0)");
  g.fillStyle = rg; k.redondo(g, -w / 2 + m, -h / 2 + m, w - m * 2, h - m * 2, h * 0.06); g.fill();
  g.restore();
  g.restore();
}

export function cojin(g, x, y, w, h, color, color2) {
  g.save();
  g.translate(x, y);
  k.redondo(g, -w / 2, -h / 2, w, h, 40);
  const cg = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  cg.addColorStop(0, color2); cg.addColorStop(0.5, color); cg.addColorStop(1, color2);
  g.fillStyle = cg; g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28;
  g.drawImage(k.manchas, -w / 2, -h / 2, w, h); g.restore();
  g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(-w * 0.2, -h * 0.3); g.quadraticCurveTo(0, h * 0.1, w * 0.15, -h * 0.05); g.stroke();
  g.restore();
}

export function comas(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Dos salones vistos de frente, en 3D. st: { canalL, canalR, estilo, pulsa, muteL }
export function casas(g, cam, st) {
  const x = cam.p[0];
  const u = k.suave(k.tramo(x, -1.2, 1.2));
  const fondo = g.createLinearGradient(0, 0, 1080, 0);
  fondo.addColorStop(0, "#2a1422");
  fondo.addColorStop(Math.max(0, Math.min(1, 0.5 - u * 0.1)), k.mezColor("#2a1422", "#121c30", u));
  fondo.addColorStop(1, "#121c30");
  g.fillStyle = fondo; g.fillRect(0, 0, 1080, 1920);

  // suelos
  quad(g, cam, [[-4.2, 0, -0.6], [-0.36, 0, -0.6], [-0.36, 0, 3.4], [-4.2, 0, 3.4]], "#6a3c24");
  quad(g, cam, [[0.36, 0, -0.6], [4.2, 0, -0.6], [4.2, 0, 3.4], [0.36, 0, 3.4]], "#314258");
  // paredes de fondo
  quad(g, cam, [[-4.2, 0, -0.6], [-0.36, 0, -0.6], [-0.36, 3.3, -0.6], [-4.2, 3.3, -0.6]], "#4a2434");
  quad(g, cam, [[0.36, 0, -0.6], [4.2, 0, -0.6], [4.2, 3.3, -0.6], [0.36, 3.3, -0.6]], "#1a2c44");
  // ventanas
  quad(g, cam, [[-3.3, 1.5, -0.58], [-2.2, 1.5, -0.58], [-2.2, 2.5, -0.58], [-3.3, 2.5, -0.58]], "#102033");
  quad(g, cam, [[2.3, 1.55, -0.58], [3.4, 1.55, -0.58], [3.4, 2.55, -0.58], [2.3, 2.55, -0.58]], "#102033");

  const estilo = st.estilo ?? 1;
  teleEn(g, cam, [-1.55, 1.42, 0], 1.9, 1.15, st.canalL, estilo, st.t, st.muteL || 0);
  teleEn(g, cam, [1.55, 1.42, 0], 1.9, 1.15, st.canalR, estilo, st.t, 0);

  // el muro, un tabique de escayola entre las dos
  cartel(g, cam, [0, 1.5, 0.08], (gg) => {
    k.redondo(gg, -0.34, -1.45, 0.68, 2.9, 0.04);
    const pg = gg.createLinearGradient(-0.28, 0, 0.28, 0);
    pg.addColorStop(0, "#cbb79a"); pg.addColorStop(0.5, "#f3e6d0"); pg.addColorStop(1, "#b79d80");
    gg.fillStyle = pg; gg.fill();
    gg.save(); gg.globalCompositeOperation = "multiply"; gg.globalAlpha = 0.35;
    gg.drawImage(k.manchas, -0.34, -1.45, 0.68, 2.9); gg.restore();
    if (st.grieta > 0.02) {
      gg.save(); gg.globalCompositeOperation = "lighter";
      gg.fillStyle = `rgba(${CIAN},${0.55 * st.grieta})`;
      gg.fillRect(-0.06, -0.9, 0.12, 1.8);
      gg.restore();
    }
  });

  // lámparas
  const l1 = k.proyecta(cam, [-2.6, 2.5, -0.2]);
  const l2 = k.proyecta(cam, [2.6, 2.5, -0.2]);
  if (l1) k.brillo(g, l1.x, l1.y, 420 * (k.F / l1.z) / 400, "255,170,90", 0.9);
  if (l2) k.brillo(g, l2.x, l2.y, 380 * (k.F / l2.z) / 400, "120,180,255", 0.75);

  if (st.radio) {
    cartel(g, cam, [-1.15, 0.62, 1.15], (gg) => mandoRadio(gg, st.pulsa || 0));
  }
  // sofás, delante
  cartel(g, cam, [-2.35, 0.32, 2.35], (gg) => {
    k.redondo(gg, -0.7, -0.22, 1.4, 0.44, 0.12);
    gg.fillStyle = "#c4513a"; gg.fill();
    k.redondo(gg, -0.55, -0.28, 0.42, 0.28, 0.08); gg.fillStyle = "#e7b24a"; gg.fill();
  });
  cartel(g, cam, [2.35, 0.32, 2.35], (gg) => {
    k.redondo(gg, -0.7, -0.22, 1.4, 0.44, 0.12);
    gg.fillStyle = "#2f6f8a"; gg.fill();
    k.redondo(gg, 0.1, -0.28, 0.42, 0.28, 0.08); gg.fillStyle = "#8fd0c4"; gg.fill();
  });
}

export function proy(cam, X) {
  return k.proyecta(cam, X);
}
