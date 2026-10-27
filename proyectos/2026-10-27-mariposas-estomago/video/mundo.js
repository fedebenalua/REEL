// Lo que comparten los planos: el estómago, las mariposas, las caras, la gente del estudio y la columna.
import * as k from "#kit";

export const velo = (g, fuerza = 0.72) => {
  const v = g.createLinearGradient(0, 240, 0, 540);
  v.addColorStop(0, `rgba(8,2,8,${fuerza})`);
  v.addColorStop(1, "rgba(8,2,8,0)");
  g.fillStyle = v;
  g.fillRect(0, 240, 1080, 320);
};

const PAL = {
  rosa: { a: "#ffe6f4", b: "#ff4d98", c: "#9a1248", luz: "255,80,140" },
  oro: { a: "#fff6d2", b: "#ffc233", c: "#d85500", luz: "255,186,70" },
};

export function mariposa(g, x, y, s, ang, abre, al, tono = "rosa") {
  if (al < 0.02 || s < 3) return;
  const pal = PAL[tono] || PAL.rosa;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.globalAlpha *= al;
  const ala = (signo, arriba) => {
    g.beginPath();
    const y1 = (arriba ? -1 : 0.78) * s * (arriba ? 1 : 0.72) * abre;
    const x1 = signo * s * (arriba ? 1.15 : 0.82);
    g.moveTo(0, 0);
    g.bezierCurveTo(signo * s * 0.2, y1 * 0.25, x1 * 0.55, y1 * 1.05, x1, y1 * 0.42);
    g.bezierCurveTo(x1 * 0.62, arriba ? s * 0.08 : -s * 0.02, signo * s * 0.12, arriba ? s * 0.02 : -s * 0.04, 0, 0);
    const gr = g.createLinearGradient(0, 0, x1, y1);
    gr.addColorStop(0, pal.a);
    gr.addColorStop(0.5, pal.b);
    gr.addColorStop(1, pal.c);
    g.fillStyle = gr;
    g.fill();
    if (s > 36) {
      g.strokeStyle = "rgba(255,255,255,0.35)";
      g.lineWidth = Math.max(1, s * 0.015);
      g.beginPath();
      g.moveTo(0, 0);
      g.quadraticCurveTo(x1 * 0.45, y1 * 0.55, x1 * 0.82, y1 * 0.4);
      g.stroke();
    }
  };
  ala(-1, true); ala(1, true); ala(-1, false); ala(1, false);
  g.fillStyle = "#3a1020";
  g.beginPath();
  g.ellipse(0, 0, s * 0.06, s * 0.42, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  if (s > 28) k.brillo(g, x, y, s * 1.3, pal.luz, al * 0.28);
}

const azE = k.azar(20261027);
export const ENJAMBRE = Array.from({ length: 40 }, () => {
  const ang = azE() * Math.PI * 2;
  const rad = 0.12 + Math.pow(azE(), 0.65) * 2.15;
  return {
    x: Math.cos(ang) * rad,
    y: (azE() - 0.42) * 2.35,
    z0: azE() * 6.2,
    fase: azE() * 8,
    tono: azE() < 0.62 ? "rosa" : "oro",
    tam: 0.26 + azE() * 0.5,
    giro: (azE() - 0.5) * 0.8,
    vx: (azE() - 0.5) * 2,
  };
});

export function puestoMariposa(m, t, zoom = 1) {
  const ciclo = 6.6;
  const z = (0.78 + ((m.z0 - t * 0.85) % ciclo + ciclo) % ciclo) / zoom;
  const sRaw = (m.tam * 420) / z;
  const cerca = sRaw < 250 ? 1 : Math.max(0, 1 - (sRaw - 250) / 130);
  return {
    x: 540 + (m.x * 860) / z,
    y: 1080 + (m.y * 860) / z,
    s: Math.min(250, sRaw),
    cerca,
    z,
    abre: 0.42 + 0.58 * (0.5 + 0.5 * Math.sin(t * 8.5 + m.fase)),
    ang: m.giro + 0.25 * Math.sin(t * 1.7 + m.fase),
  };
}

export function enjambre(g, t, o = {}) {
  const zoom = o.zoom ?? 1;
  const rotura = o.rotura ?? 0;
  const al = o.al ?? 1;
  if (al < 0.02) return;
  const lista = ENJAMBRE.map((m) => ({ m, p: puestoMariposa(m, o.tFijo ?? t, zoom) })).sort((a, b) => b.p.z - a.p.z);
  for (const { m, p } of lista) {
    const x = p.x + rotura * m.vx * 220;
    const y = p.y - rotura * 80 + rotura * rotura * 160;
    const s = p.s * (1 - rotura * 0.45);
    if (x < -200 || x > 1280 || y < -200 || y > 2100) continue;
    mariposa(g, x, y, s, p.ang + rotura * m.vx, p.abre * (1 - rotura * 0.85), al * (1 - rotura) * p.cerca, m.tono);
  }
}

export function saco(g, cx, cy, rx, ry, t, calor = 0) {
  g.save();
  g.translate(cx, cy);
  g.beginPath();
  g.moveTo(-rx * 0.15, -ry);
  g.bezierCurveTo(rx * 0.95, -ry * 0.92, rx * 1.12, ry * 0.15, rx * 0.42, ry * 0.92);
  g.bezierCurveTo(rx * 0.05, ry * 1.22, -rx * 0.85, ry * 0.95, -rx * 0.98, ry * 0.15);
  g.bezierCurveTo(-rx * 1.08, -ry * 0.45, -rx * 0.72, -ry * 1.02, -rx * 0.15, -ry);
  g.closePath();
  const claro = k.mezRgb("255,186,196", "255,120,110", calor);
  const medio = k.mezRgb("214,92,112", "176,36,48", calor);
  const osc = k.mezRgb("92,18,36", "64,8,16", calor);
  const gr = g.createRadialGradient(-rx * 0.28, -ry * 0.38, rx * 0.08, rx * 0.1, ry * 0.05, rx * 1.35);
  gr.addColorStop(0, `rgb(${claro})`);
  gr.addColorStop(0.45, `rgb(${medio})`);
  gr.addColorStop(1, `rgb(${osc})`);
  g.fillStyle = gr;
  g.fill();
  const br = g.createRadialGradient(-rx * 0.35, -ry * 0.42, 4, -rx * 0.2, -ry * 0.2, rx * 0.7);
  br.addColorStop(0, "rgba(255,255,255,0.55)");
  br.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = br;
  g.fill();
  g.lineWidth = 10;
  g.strokeStyle = `rgba(255,210,206,${0.35 + calor * 0.25})`;
  g.stroke();
  g.restore();
}

const PIELES = ["#f3c7a6", "#e0a07a", "#c98462", "#8d5a3c", "#f6d7b8", "#a86b45"];
const PELOS = ["#2a211c", "#5a3828", "#1c1a22", "#c4a46a", "#3a2418", "#6e4a32"];

export function perfil(g, x, y, s, der) {
  g.save();
  g.translate(x, y);
  if (!der) g.scale(-1, 1);
  g.scale(s, s);
  g.beginPath();
  g.moveTo(-120, 150);
  g.lineTo(-70, 70);
  g.quadraticCurveTo(-78, 20, -64, -20);
  g.quadraticCurveTo(-90, -70, -40, -108);
  g.quadraticCurveTo(20, -128, 48, -70);
  g.quadraticCurveTo(58, -40, 78, -22);
  g.quadraticCurveTo(96, -6, 70, 8);
  g.quadraticCurveTo(84, 22, 62, 36);
  g.quadraticCurveTo(40, 62, 8, 78);
  g.lineTo(-10, 150);
  g.closePath();
  const sg = g.createLinearGradient(-80, -100, 90, 80);
  sg.addColorStop(0, "#2a1218");
  sg.addColorStop(0.55, "#14080c");
  sg.addColorStop(1, "#3a1810");
  g.fillStyle = sg;
  g.fill();
  g.strokeStyle = "rgba(255,196,150,0.9)";
  g.lineWidth = 5;
  g.stroke();
  g.restore();
}

export function figurin(g, x, y, h, semilla) {
  const az = k.azar(semilla);
  const piel = PIELES[Math.floor(az() * PIELES.length)];
  const pelo = PELOS[Math.floor(az() * PELOS.length)];
  const camisa = ["#6a3050", "#3a4060", "#5a4030", "#2e4a48", "#703848", "#3c3058"][Math.floor(az() * 6)];
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.4)";
  g.beginPath();
  g.ellipse(0, 4, h * 0.16, h * 0.035, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1a1216";
  g.fillRect(-h * 0.07, -h * 0.46, h * 0.055, h * 0.46);
  g.fillRect(h * 0.015, -h * 0.46, h * 0.055, h * 0.46);
  const tg = g.createLinearGradient(-h * 0.16, -h * 0.9, h * 0.16, -h * 0.4);
  tg.addColorStop(0, "#d8c8c0");
  tg.addColorStop(0.25, camisa);
  tg.addColorStop(1, "#12080c");
  g.fillStyle = tg;
  g.beginPath();
  g.moveTo(-h * 0.07, -h * 0.46);
  g.lineTo(-h * 0.16, -h * 0.78);
  g.quadraticCurveTo(0, -h * 0.9, h * 0.16, -h * 0.78);
  g.lineTo(h * 0.07, -h * 0.46);
  g.closePath();
  g.fill();
  g.fillStyle = piel;
  g.fillRect(-h * 0.025, -h * 0.84, h * 0.05, h * 0.08);
  const cg = g.createRadialGradient(-h * 0.02, -h * 0.92, 2, 0, -h * 0.88, h * 0.08);
  cg.addColorStop(0, "#ffe6d4");
  cg.addColorStop(0.55, piel);
  cg.addColorStop(1, "#6a4030");
  g.fillStyle = cg;
  g.beginPath();
  g.arc(0, -h * 0.9, h * 0.075, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = pelo;
  g.beginPath();
  g.arc(0, -h * 0.92, h * 0.078, Math.PI * 0.85, Math.PI * 0.15, true);
  g.fill();
  g.restore();
}

const azN = k.azar(91);
export const NODOS = Array.from({ length: 42 }, () => ({
  a: azN() * Math.PI * 2,
  r: 0.78 + azN() * 0.32,
  fase: azN() * 6,
}));

export function redNeuronas(g, cx, cy, rx, ry, t, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 16; i++) {
    const n = NODOS[i];
    const a0 = n.a + t * 0.04;
    const a1 = a0 + 0.9 + n.fase * 0.05;
    const x0 = cx + Math.cos(a0) * rx * 0.72, y0 = cy + Math.sin(a0) * ry * 0.72;
    const x1 = cx + Math.cos(a1) * rx * 0.9, y1 = cy + Math.sin(a1) * ry * 0.9;
    const xc = cx + Math.cos(a0 + 0.45) * rx * 1.08, yc = cy + Math.sin(a0 + 0.45) * ry * 1.08;
    g.strokeStyle = `rgba(255,196,110,${0.28 + 0.22 * (0.5 + 0.5 * Math.sin(t * 1.4 + n.fase))})`;
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo(xc, yc, x1, y1);
    g.stroke();
    k.brillo(g, x0, y0, 26, "sodio", 0.75);
  }
  g.restore();
}

export function vertebra(g, x, y, w, h) {
  g.save();
  g.translate(x, y);
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  gr.addColorStop(0, "#5c4638");
  gr.addColorStop(0.4, "#f6e6d0");
  gr.addColorStop(1, "#3e2c24");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(-w * 0.15, -h * 0.45);
  g.quadraticCurveTo(-w * 0.55, -h * 0.2, -w * 0.48, h * 0.15);
  g.quadraticCurveTo(-w * 0.2, h * 0.55, w * 0.15, h * 0.4);
  g.quadraticCurveTo(w * 0.55, h * 0.15, w * 0.42, -h * 0.2);
  g.quadraticCurveTo(w * 0.2, -h * 0.55, -w * 0.15, -h * 0.45);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(50,28,24,0.55)";
  g.beginPath();
  g.ellipse(-w * 0.02, 0, w * 0.12, h * 0.16, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function columna(g, x, y0, y1, t, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  const n = 11;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const y = y0 + (y1 - y0) * u + Math.sin(t * 0.8 + i) * 1.5;
    const w = 150 - Math.abs(u - 0.5) * 30;
    vertebra(g, x + Math.sin(u * 2) * 10, y, w, 52);
  }
  k.brillo(g, x, (y0 + y1) / 2, 380, "amarilla", 0.18 * al);
  g.restore();
}

export function tubo(g, x, yBase, ancho, alto, lleno, color, t) {
  const h = Math.max(8, alto * lleno);
  const x0 = x - ancho / 2, y0 = yBase - h;
  g.save();
  const lg = g.createLinearGradient(0, yBase, 0, y0);
  lg.addColorStop(0, `rgba(${color},0.95)`);
  lg.addColorStop(0.7, `rgba(${color},0.75)`);
  lg.addColorStop(1, "rgba(255,236,220,0.9)");
  g.fillStyle = lg;
  k.redondo(g, x0 + 10, y0 + 16, ancho - 20, h - 8, 18);
  g.fill();
  const ola = 6 * Math.sin(t * 3);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.beginPath();
  g.ellipse(x, y0 + 22 + ola * 0.2, ancho * 0.32, 8, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  k.redondo(g, x0, yBase - alto - 24, ancho, alto + 36, 28);
  k.vidrio(g, x0, x0 + ancho, 0.55);
  k.reflejo(g, x0 + 14, yBase - alto, 16, alto * 0.7, 0.22);
  g.restore();
}

export function personaEscenario(g, x, yPie, h, t, tripa) {
  g.save();
  g.translate(x, yPie);
  const resp = 1 + 0.01 * Math.sin(t * 1.6);
  g.scale(resp, resp);
  g.fillStyle = "rgba(0,0,0,0.45)";
  g.beginPath();
  g.ellipse(0, 4, h * 0.22, 14, 0, 0, Math.PI * 2);
  g.fill();
  const pata = g.createLinearGradient(0, -h * 0.45, 0, 0);
  pata.addColorStop(0, "#3a3034");
  pata.addColorStop(1, "#100c0e");
  g.fillStyle = pata;
  g.fillRect(-h * 0.13, -h * 0.46, h * 0.09, h * 0.46);
  g.fillRect(h * 0.04, -h * 0.46, h * 0.09, h * 0.46);
  g.fillStyle = "#22181c";
  k.redondo(g, -h * 0.36, -h * 0.9, h * 0.1, h * 0.38, 16);
  g.fill();
  k.redondo(g, h * 0.26, -h * 0.9, h * 0.1, h * 0.38, 16);
  g.fill();
  g.beginPath();
  g.moveTo(-h * 0.22, -h * 0.48);
  g.lineTo(-h * 0.32, -h * 0.98);
  g.quadraticCurveTo(0, -h * 1.06, h * 0.32, -h * 0.98);
  g.lineTo(h * 0.22, -h * 0.48);
  g.closePath();
  const jg = g.createLinearGradient(-h * 0.3, -h, h * 0.3, -h * 0.45);
  jg.addColorStop(0, "#4a3c40");
  jg.addColorStop(0.45, "#1a1418");
  jg.addColorStop(1, "#0c0a0c");
  g.fillStyle = jg;
  g.fill();
  g.strokeStyle = "rgba(255,220,200,0.18)";
  g.lineWidth = 3;
  g.stroke();
  if (tripa > 0) {
    g.save();
    g.beginPath();
    g.ellipse(0, -h * 0.7, h * 0.14, h * 0.11, 0, 0, Math.PI * 2);
    g.clip();
    for (let i = -2; i <= 2; i++) {
      const yy = -h * 0.7 + i * h * 0.045 + Math.sin(t * 4.2 + i) * h * 0.012;
      k.brillo(g, Math.sin(t * 3 + i) * h * 0.04, yy, h * 0.28, "roja", tripa * (0.35 + 0.1 * (2 - Math.abs(i))));
    }
    g.restore();
  }
  g.fillStyle = "#e8b898";
  g.fillRect(-h * 0.035, -h * 1.04, h * 0.07, h * 0.1);
  const hg = g.createRadialGradient(-h * 0.03, -h * 1.18, 6, 0, -h * 1.12, h * 0.12);
  hg.addColorStop(0, "#ffe4d2");
  hg.addColorStop(0.55, "#e2aa8c");
  hg.addColorStop(1, "#7a4e3e");
  g.fillStyle = hg;
  g.beginPath();
  g.arc(0, -h * 1.12, h * 0.1, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1a100e";
  g.beginPath();
  g.ellipse(0, -h * 1.16, h * 0.1, h * 0.07, 0, Math.PI * 1.05, Math.PI * 1.95);
  g.fill();
  g.restore();
  const mx = x + h * 0.34;
  g.fillStyle = "#3a322c";
  g.fillRect(mx - 4, yPie - h * 0.95, 8, h * 0.9);
  g.beginPath();
  g.ellipse(mx, yPie - h * 1.0, 26, 40, 0, 0, Math.PI * 2);
  k.metal(g, mx - 26, mx + 26);
  g.strokeStyle = "rgba(255,255,255,0.45)";
  g.lineWidth = 3;
  g.stroke();
}
