// Lo de este vídeo: el montón que huele fatal, los olores del estudio (perfume, aceite, caca, curry, lana)
// y el ciervo de la idea del disfraz. El perro es el de perros/mundo.js, con vuelta para revolcarse.
import * as k from "#kit";
import { parque, salon, ponVista, sinVista, velo, vineta, perro, perroFrente, persona, cam } from "../../../perros/mundo.js";

export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
const { azar } = k;

// El gancho y el último fotograma son el mismo revolcón: así el vídeo enlaza al repetirse.
export const ENGANCHE = { x: 500, pila: 445 };
export const hookPerro = (t) => ({ x: ENGANCHE.x + Math.sin(t * 2.2) * 10 });
export function hookCam(t) {
  // Sale del detalle. Con t negativo sigue el mismo zoom: el final del vídeo enlaza con el fotograma 0.
  const Z = Math.max(4.3, 8.3 - t * 2.15);
  return cam(Z, ENGANCHE.x + 6 - t * 16, -62 + t * 6);
}

const GOTAS = (() => {
  const az = azar(881), L = [];
  for (let i = 0; i < 28; i++) L.push({ a: az() * TAU, v: 40 + az() * 90, y: 16 + az() * 50, r: 2.2 + az() * 3.4, ph: az() * TAU, col: az() < 0.5 ? "#c6e24a" : "#8d6a28" });
  return L;
})();

const lin = (g, x0, y0, x1, y1, a, b) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; };

// Un montón húmedo, con brillo y gotas. vivo 0..1 lo hace más grande.
export function monton(g, x, t, vivo = 1) {
  g.save(); g.translate(x, 0); g.scale(vivo, vivo);
  g.save(); g.globalAlpha = 0.35; g.fillStyle = "#3a4a12"; g.beginPath(); g.ellipse(0, 2, 46, 8, 0, 0, TAU); g.fill(); g.restore();
  g.beginPath(); g.moveTo(-40, -2); g.bezierCurveTo(-36, -28, -10, -38, 4, -34); g.bezierCurveTo(22, -40, 40, -22, 42, -4); g.quadraticCurveTo(10, 4, -40, -2); g.closePath();
  g.fillStyle = lin(g, -20, -36, 20, 0, "#d7ee62", "#6a4a16"); g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28; g.drawImage(k.manchas, -48, -42, 96, 48); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  g.fillStyle = "rgba(255,255,220,0.55)"; g.beginPath(); g.ellipse(-12, -26, 14, 6, -0.4, 0, TAU); g.fill();
  g.fillStyle = "#4a3010"; g.beginPath(); g.ellipse(16, -16, 8, 5, 0.4, 0, TAU); g.fill();
  g.restore();
  g.strokeStyle = "rgba(90,60,10,0.45)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-28, -8); g.quadraticCurveTo(-6, -22, 24, -10); g.stroke();
  for (const p of GOTAS) {
    const s = (Math.sin(t * 3.2 + p.ph) + 1) / 2;
    const px = Math.cos(p.a + t * 0.6) * (10 + s * p.v * 0.35), py = -8 - s * p.y;
    g.globalAlpha = 0.35 + 0.55 * (1 - s);
    g.fillStyle = p.col; g.beginPath(); g.ellipse(px, py, p.r, p.r * 1.3, 0, 0, TAU); g.fill();
  }
  g.globalAlpha = 1;
  g.restore();
}

// Cintas de olor. rgb es "r,g,b". Detrás o delante del perro.
export function olor(g, x, y, rgb, t, o = {}) {
  const { n = 9, fuerza = 1, alfa = 0.55 } = o;
  if (fuerza < 0.04 || alfa < 0.02) return;
  g.save();
  for (let i = 0; i < n; i++) {
    const ph = t * (1.1 + i * 0.07) + i * 1.7;
    const ax = x + Math.sin(ph) * (16 + i * 5) * fuerza;
    const ay = y - (10 + i * 8) * fuerza + Math.cos(ph * 0.8) * 8;
    const r = (10 + i * 3.2) * fuerza;
    const gr = g.createRadialGradient(ax - r * 0.2, ay - r * 0.3, 0, ax, ay, r);
    gr.addColorStop(0, `rgba(${rgb},${alfa})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(ax, ay, r, 0, TAU); g.fill();
  }
  g.restore();
}

export function perfume(g, x, s = 1, t = 0) {
  g.save(); g.translate(x, 0); g.scale(s, s);
  g.save(); g.globalAlpha = 0.28; g.fillStyle = "#402018"; g.beginPath(); g.ellipse(2, 2, 16, 4, 0, 0, TAU); g.fill(); g.restore();
  // el cristal
  g.beginPath(); g.moveTo(-12, -6); g.lineTo(-10, -46); g.quadraticCurveTo(-10, -54, 0, -54); g.quadraticCurveTo(10, -54, 10, -46); g.lineTo(12, -6); g.quadraticCurveTo(12, -2, 0, -2); g.closePath();
  g.fillStyle = lin(g, -12, -50, 12, -4, "rgba(255,210,230,0.55)", "rgba(255,120,170,0.35)"); g.fill();
  // el líquido rosa
  const ond = Math.sin(t * 4) * 1.2;
  g.beginPath(); g.moveTo(-11, -16 + ond); g.lineTo(-10.2, -44); g.quadraticCurveTo(0, -40 + ond, 10.2, -44); g.lineTo(11, -16 + ond); g.quadraticCurveTo(0, -8, -11, -16 + ond); g.closePath();
  g.fillStyle = lin(g, 0, -44, 0, -8, "#ff8ab8", "#e23b78"); g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.fillRect(-8, -40, 2.2, 22);
  // el tapón dorado y el pulverizador
  g.fillStyle = lin(g, -7, -62, 7, -52, "#ffe7a0", "#d7a441"); g.fillRect(-7, -62, 14, 12);
  g.fillStyle = "#f4d56a"; g.fillRect(4, -66, 12, 4); g.beginPath(); g.arc(16, -64, 2.4, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(-5, -60, 3, 6);
  g.restore();
}

export function aceite(g, x, s = 1) {
  g.save(); g.translate(x, 0); g.scale(s, s);
  g.save(); g.globalAlpha = 0.3; g.fillStyle = "#201810"; g.beginPath(); g.ellipse(0, 2, 20, 4.5, 0, 0, TAU); g.fill(); g.restore();
  g.beginPath(); g.moveTo(-16, -4); g.lineTo(-14, -40); g.quadraticCurveTo(-14, -50, 0, -50); g.quadraticCurveTo(14, -50, 14, -40); g.lineTo(16, -4); g.closePath();
  g.fillStyle = lin(g, -16, -48, 16, 0, "#3a2414", "#1a100c"); g.fill();
  g.fillStyle = lin(g, -8, -36, 10, -12, "#ffb14a", "#c45a12"); g.beginPath(); g.moveTo(-8, -34); g.lineTo(8, -34); g.lineTo(9, -14); g.lineTo(-9, -14); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,220,140,0.35)"; g.fillRect(-6, -30, 3, 12);
  g.fillStyle = "#f0c14a"; g.fillRect(-6, -56, 12, 8); g.beginPath(); g.moveTo(6, -54); g.lineTo(16, -48); g.lineTo(6, -46); g.fill();
  g.restore();
}

// tipo: oveja (bolitas), caballo (grande), puma, oso.
export function caca(g, x, tipo) {
  g.save(); g.translate(x, 0);
  g.save(); g.globalAlpha = 0.28; g.fillStyle = "#2a1a0c"; g.beginPath(); g.ellipse(0, 2, tipo === "caballo" || tipo === "oso" ? 28 : 16, 5, 0, 0, TAU); g.fill(); g.restore();
  const bola = (px, py, r, a, b) => {
    const gr = g.createRadialGradient(px - r * 0.35, py - r * 0.45, r * 0.1, px, py, r);
    gr.addColorStop(0, a); gr.addColorStop(1, b);
    g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, TAU); g.fill();
    g.fillStyle = "rgba(255,230,180,0.35)"; g.beginPath(); g.arc(px - r * 0.3, py - r * 0.35, r * 0.28, 0, TAU); g.fill();
  };
  if (tipo === "oveja") {
    for (const [px, py, r] of [[-10, -6, 5.5], [-2, -8, 6], [8, -6, 5.2], [-6, -12, 4.4], [3, -13, 4.6], [0, -4, 5]]) bola(px, py, r, "#8a6236", "#3a2412");
  } else if (tipo === "caballo") {
    bola(0, -12, 16, "#a87840", "#4a2c14"); bola(-14, -8, 9, "#8d6230", "#3d2410"); bola(14, -7, 8, "#7a5428", "#3a2010");
  } else if (tipo === "puma") {
    bola(-4, -8, 8, "#b48448", "#5a3418"); bola(7, -6, 6, "#8a5a30", "#3a2010");
  } else {
    bola(0, -14, 18, "#6a4324", "#2a160c"); bola(-16, -8, 8, "#5a381c", "#24140c"); bola(15, -7, 7, "#4e3018", "#1c1008");
  }
  g.restore();
}

export function curry(g, x, t) {
  g.save(); g.translate(x, 0);
  g.save(); g.globalAlpha = 0.3; g.fillStyle = "#5a3010"; g.beginPath(); g.ellipse(0, 2, 22, 5, 0, 0, TAU); g.fill(); g.restore();
  g.fillStyle = lin(g, -18, -8, 18, 2, "#fff6ea", "#e2c2a4"); g.beginPath(); g.ellipse(0, -4, 20, 7, 0, 0, TAU); g.fill();
  g.fillStyle = lin(g, -16, -16, 16, -2, "#ffb03a", "#e25816"); g.beginPath(); g.ellipse(0, -8, 15, 6.5, 0, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,230,140,0.7)"; g.beginPath(); g.ellipse(-4, -11, 6, 2.2, -0.4, 0, TAU); g.fill();
  // vapor
  g.strokeStyle = "rgba(255,220,160,0.7)"; g.lineWidth = 2; g.lineCap = "round";
  for (let i = 0; i < 3; i++) { const y = -16 - ((t * 18 + i * 10) % 22); g.globalAlpha = 1 - ((t * 18 + i * 10) % 22) / 22; g.beginPath(); g.moveTo(-6 + i * 6, -12); g.quadraticCurveTo(-2 + i * 6, y, 2 + i * 5, y - 6); g.stroke(); }
  g.globalAlpha = 1; g.restore();
}

export function lana(g, x, t) {
  g.save(); g.translate(x, 0);
  g.save(); g.globalAlpha = 0.25; g.fillStyle = "#c8b89a"; g.beginPath(); g.ellipse(0, 2, 30, 6, 0, 0, TAU); g.fill(); g.restore();
  const copos = [[-16, -10, 12], [-2, -16, 14], [14, -10, 12], [-8, -6, 10], [8, -6, 11], [0, -8, 13]];
  for (const [px, py, r] of copos) {
    const gr = g.createRadialGradient(px - 3, py - 4, 1, px, py + Math.sin(t * 2 + px) * 0.6, r);
    gr.addColorStop(0, "#fffaf2"); gr.addColorStop(1, "#e4d3b4");
    g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, TAU); g.fill();
  }
  g.restore();
}

// Un ciervo de lado, entero. corre 0..1 mueve las patas.
export function ciervo(g, x, t, corre = 0) {
  const fase = t * (1.2 + corre * 6);
  g.save(); g.translate(x, 0);
  g.save(); g.globalAlpha = 0.25; g.fillStyle = "#5a3a18"; g.beginPath(); g.ellipse(4, 2, 36, 6, 0, 0, TAU); g.fill(); g.restore();
  const pata = (px, ph) => {
    const sube = Math.max(0, Math.sin(fase * TAU + ph)) * 10 * corre;
    g.strokeStyle = "#a56a32"; g.lineWidth = 3.2; g.lineCap = "round";
    g.beginPath(); g.moveTo(px, -28); g.lineTo(px + Math.sin(fase * TAU + ph) * 6 * corre, -2 - sube); g.stroke();
  };
  pata(-10, 0); pata(6, 1); pata(-2, 2); pata(14, 3);
  g.beginPath(); g.ellipse(0, -40, 28, 14, -0.1, 0, TAU);
  g.fillStyle = lin(g, -20, -54, 16, -26, "#e2b06a", "#a86428"); g.fill();
  g.fillStyle = "rgba(255,230,190,0.35)"; g.beginPath(); g.ellipse(-8, -46, 10, 4, -0.3, 0, TAU); g.fill();
  // cuello y cabeza
  g.beginPath(); g.moveTo(18, -46); g.quadraticCurveTo(34, -62, 42, -78); g.lineTo(36, -80); g.quadraticCurveTo(26, -60, 12, -50); g.fill();
  g.fillStyle = lin(g, 30, -92, 56, -70, "#f0c48a", "#b07238");
  g.beginPath(); g.ellipse(46, -82, 14, 8, 0.2, 0, TAU); g.fill();
  g.fillStyle = "#3a2414"; g.beginPath(); g.ellipse(58, -80, 3.2, 2.4, 0.2, 0, TAU); g.fill();
  g.fillStyle = "#2a1a10"; g.beginPath(); g.arc(50, -86, 1.5, 0, TAU); g.fill();
  // cuerna
  g.strokeStyle = "#d8b07a"; g.lineWidth = 2; g.lineCap = "round";
  g.beginPath(); g.moveTo(40, -88); g.lineTo(34, -104); g.moveTo(36, -96); g.lineTo(28, -100); g.moveTo(35, -100); g.lineTo(30, -108); g.stroke();
  // la mancha clara de la cola
  g.fillStyle = "#fff4e0"; g.beginPath(); g.ellipse(-24, -42, 6, 5, 0, 0, TAU); g.fill();
  g.restore();
}

export function puma(g, x, t) {
  g.save(); g.translate(x, 0);
  g.save(); g.globalAlpha = 0.25; g.fillStyle = "#6a4018"; g.beginPath(); g.ellipse(0, 2, 34, 5, 0, 0, TAU); g.fill(); g.restore();
  g.fillStyle = lin(g, -24, -40, 20, -8, "#f0c27a", "#c4843a");
  g.beginPath(); g.ellipse(-2, -28, 26, 13, -0.05, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(22, -40, 12, 10, 0.2, 0, TAU); g.fill();
  g.fillStyle = "#fff6e4"; g.beginPath(); g.ellipse(18, -34, 7, 4, 0.2, 0, TAU); g.fill();
  g.fillStyle = "#2a1a0c"; g.beginPath(); g.arc(30, -42, 1.6, 0, TAU); g.fill();
  g.fillStyle = "#e8b060"; g.beginPath(); g.ellipse(34, -38, 3, 2.2, 0.4, 0, TAU); g.fill();
  // orejas
  g.fillStyle = "#e0a85a"; g.beginPath(); g.moveTo(16, -48); g.lineTo(14, -58); g.lineTo(22, -50); g.fill(); g.beginPath(); g.moveTo(26, -50); g.lineTo(30, -60); g.lineTo(34, -48); g.fill();
  // cola
  g.strokeStyle = "#c4843a"; g.lineWidth = 4; g.lineCap = "round";
  g.beginPath(); g.moveTo(-24, -30); g.quadraticCurveTo(-40, -20 + Math.sin(t * 3) * 4, -48, -36); g.stroke();
  g.strokeStyle = "#5a3214"; g.lineWidth = 3.2;
  for (const px of [-16, -4, 6, 14]) { g.beginPath(); g.moveTo(px, -18); g.lineTo(px + 1, -2); g.stroke(); }
  g.restore();
}

export function oso(g, x, t) {
  g.save(); g.translate(x, 0);
  g.save(); g.globalAlpha = 0.28; g.fillStyle = "#2a180c"; g.beginPath(); g.ellipse(0, 2, 30, 6, 0, 0, TAU); g.fill(); g.restore();
  g.fillStyle = lin(g, -22, -48, 22, -6, "#8a5a34", "#3a2414");
  g.beginPath(); g.ellipse(0, -30, 26, 18, 0, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(18, -48, 14, 12, 0.1, 0, TAU); g.fill();
  g.fillStyle = "#c49a6a"; g.beginPath(); g.ellipse(24, -44, 7, 5, 0.2, 0, TAU); g.fill();
  g.fillStyle = "#1a100c"; g.beginPath(); g.arc(30, -50, 1.7, 0, TAU); g.fill();
  g.fillStyle = "#6a4024"; g.beginPath(); g.arc(10, -58, 5, 0, TAU); g.fill(); g.beginPath(); g.arc(24, -60, 5, 0, TAU); g.fill();
  g.fillStyle = "#3a2414";
  g.beginPath(); g.ellipse(-8, -10, 7, 5, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(10, -10, 7, 5, 0, 0, TAU); g.fill();
  g.strokeStyle = "#4a3018"; g.lineWidth = 5; g.lineCap = "round";
  g.beginPath(); g.moveTo(8, -16); g.quadraticCurveTo(20, -8 + Math.sin(t * 2) * 3, 28, -4); g.stroke();
  g.restore();
}

export function valla(g, x0 = 0) {
  g.save();
  g.strokeStyle = "#8d5a32"; g.lineWidth = 5; g.lineCap = "round";
  for (let x = x0 - 800; x < x0 + 1400; x += 70) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -78); g.stroke(); }
  g.lineWidth = 4; g.beginPath(); g.moveTo(x0 - 800, -28); g.lineTo(x0 + 1400, -28); g.moveTo(x0 - 800, -58); g.lineTo(x0 + 1400, -58); g.stroke();
  g.restore();
}

export function parqueListo(g, c, t, hora = 0) {
  parque(g, c, t, hora);
  ponVista(g, c);
}
export function salonListo(g, c, t, hora = 0) {
  salon(g, c, t, hora);
  ponVista(g, c);
}
export function cierra(g, al = 0.45) {
  sinVista(g); velo(g, al); vineta(g, 0.26);
}

// El perro revolcándose, con la cola viva. Devuelve lo de perro().
export function perroRueda(g, x, t, extra = {}) {
  return perro(g, {
    x, t, espalda: 1, marcha: 0, cola: 0.9,
    cabeza: { ojo: 1, abre: 0.85, ...(extra.cabeza || {}) },
    ...extra, espalda: 1,
  });
}
