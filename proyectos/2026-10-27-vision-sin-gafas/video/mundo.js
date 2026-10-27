// Lo que comparten los planos: la carta del bar, el ojo, el oclusor de la consulta y el borde del agujero.
// Ninguna letra se usa al cargar el módulo: el render lo carga en el hilo principal sin Figtree.
import * as k from "#kit";
import { GlobalFonts } from "@napi-rs/canvas";

const ROMANAS = ["Noto Serif Display", "Noto Serif", "Liberation Serif", "DejaVu Serif"];
let romanaHecha = null;
export function romana() {
  if (!romanaHecha) {
    const hay = new Set(GlobalFonts.families.map((f) => f.family));
    const r = ROMANAS.find((f) => hay.has(f));
    romanaHecha = r ? `'${r}'` : "Figtree";
  }
  return romanaHecha;
}

export const hexRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mezHex = (a, b, u) => {
  const x = hexRgb(a), y = hexRgb(b);
  return `rgb(${x.map((c, i) => Math.round(c + (y[i] - c) * u)).join(",")})`;
};

export function velo(g, al = 0.62) {
  const v = g.createLinearGradient(0, 220, 0, 560);
  v.addColorStop(0, `rgba(6,2,8,${al})`);
  v.addColorStop(1, "rgba(6,2,8,0)");
  g.fillStyle = v;
  g.fillRect(0, 200, 1080, 400);
}

// ---------------------------------------------------------------- la carta
let cartaLisa = null;
function cartaNitida() {
  if (cartaLisa) return cartaLisa;
  const W = 900, H = 1280, c = k.lienzo(W, H), g = c.getContext("2d");
  const m = g.createLinearGradient(0, 0, W, H);
  m.addColorStop(0, "#6b3a22"); m.addColorStop(0.5, "#3e2416"); m.addColorStop(1, "#2a160e");
  g.fillStyle = m; g.fillRect(0, 0, W, H);
  g.strokeStyle = "rgba(255,196,120,0.35)"; g.lineWidth = 10;
  g.strokeRect(28, 28, W - 56, H - 56);
  g.fillStyle = "#f3ddb8"; g.fillRect(54, 54, W - 108, H - 108);
  g.save(); g.globalAlpha = 0.18; g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, 54, 54, W - 108, H - 108); g.restore();
  const fuente = romana();
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "#8a3a2a"; g.font = `600 54px ${fuente}`;
  g.fillText("LA", W / 2, 470);
  g.fillStyle = "#2a140c"; g.font = `700 150px ${fuente}`;
  g.fillText("CARTA", W / 2, 640);
  g.strokeStyle = "rgba(138,58,42,0.55)"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(180, 770); g.lineTo(W - 180, 770); g.stroke();
  const platos = [["Sopa del día", "9"], ["Pan de pueblo", "3"], ["Vino de la casa", "4"], ["Tarta de queso", "6"]];
  platos.forEach((p, i) => {
    const y = 880 + i * 90;
    g.textAlign = "left"; g.fillStyle = "#3a2418"; g.font = `600 42px ${fuente}`;
    g.fillText(p[0], 120, y);
    g.textAlign = "right"; g.fillStyle = "#9a3412"; g.font = `700 42px ${fuente}`;
    g.fillText(p[1], W - 120, y);
  });
  cartaLisa = c;
  return c;
}

const cartasBorrosas = new Map();
export function cartaConBlur(px) {
  const n = Math.max(0, Math.round(px));
  if (n <= 0) return cartaNitida();
  if (cartasBorrosas.has(n)) return cartasBorrosas.get(n);
  const src = cartaNitida();
  const c = k.lienzo(src.width, src.height), g = c.getContext("2d");
  g.filter = `blur(${n}px)`;
  g.drawImage(src, 0, 0);
  g.filter = "none";
  cartasBorrosas.set(n, c);
  return c;
}

const azB = k.azar(27);
export const BOKEH = Array.from({ length: 42 }, () => {
  const a = azB() * 6.2832, rad = 0.4 + Math.pow(azB(), 0.55) * 3.4;
  return {
    x: Math.cos(a) * rad, y: (azB() - 0.45) * 3.2, z: 1.1 + azB() * 6.2,
    r: 0.08 + azB() * 0.42,
    col: ["255,170,50", "255,90,60", "40,220,190", "230,70,255", "255,210,120", "90,150,255"][Math.floor(azB() * 6)],
    al: 0.28 + azB() * 0.5,
  };
});

export function rectMundo(cam, centro, an, al) {
  const p = k.proyecta(cam, centro);
  if (!p) return null;
  const w = k.tamano(an, p.z), h = k.tamano(al, p.z);
  return { x: p.x - w / 2, y: p.y - h / 2, w, h, z: p.z, cx: p.x, cy: p.y };
}

export function fondoCafe(g) {
  const v = g.createLinearGradient(0, 0, 0, 1920);
  v.addColorStop(0, "#1a0830"); v.addColorStop(0.45, "#3a1230"); v.addColorStop(1, "#1a0c08");
  g.fillStyle = v; g.fillRect(0, 0, 1080, 1920);
  const l = g.createRadialGradient(780, 280, 20, 780, 420, 900);
  l.addColorStop(0, "rgba(255,170,70,0.55)"); l.addColorStop(1, "rgba(255,120,40,0)");
  g.fillStyle = l; g.fillRect(0, 0, 1080, 1920);
}

export function bokeh(g, cam, vel = 1) {
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) {
    const p = k.proyecta(cam, [b.x, b.y, b.z]);
    if (!p || p.z < 0.35) continue;
    let rad = k.tamano(b.r, p.z);
    let al = b.al * Math.min(1, 2.2 / Math.max(0.4, p.z));
    if (p.z < 1.15) al *= k.suave(k.tramo(p.z, 0.35, 1.15));
    if (rad > 460) { al *= 460 / rad; rad = 460; }
    if (al < 0.02 || rad < 4) continue;
    const gr = g.createRadialGradient(p.x, p.y, rad * 0.1, p.x, p.y, rad);
    gr.addColorStop(0, `rgba(255,255,255,${al})`);
    gr.addColorStop(0.35, `rgba(${b.col},${al * 0.7})`);
    gr.addColorStop(1, `rgba(${b.col},0)`);
    g.fillStyle = gr;
    g.beginPath(); g.ellipse(p.x, p.y, rad, rad * (1 + vel * 0.35), 0, 0, 6.2832); g.fill();
  }
  g.restore();
}

export function gafas(g, x, y, s, u) {
  if (u <= 0.01) return;
  const a = k.entra(Math.min(1, u));
  g.save();
  g.translate(x, y + (1 - a) * -120);
  g.scale(s, s * (0.92 + 0.08 * a));
  g.globalAlpha *= a;
  g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 24; g.shadowOffsetY = 16;
  const lente = (cx) => {
    const lg = g.createRadialGradient(cx - 18, -16, 4, cx, 0, 70);
    lg.addColorStop(0, "rgba(255,255,255,0.72)");
    lg.addColorStop(0.5, "rgba(214,228,242,0.55)");
    lg.addColorStop(1, "rgba(120,150,180,0.4)");
    g.fillStyle = lg; g.beginPath(); g.ellipse(cx, 0, 68, 60, 0, 0, 6.2832); g.fill();
    g.lineWidth = 9; g.strokeStyle = "#e8c56a"; g.stroke();
    g.lineWidth = 3; g.strokeStyle = "#8a6420"; g.stroke();
    g.shadowColor = "transparent";
    g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 4;
    g.beginPath(); g.ellipse(cx - 16, -18, 22, 10, -0.6, 0, 6.2832); g.stroke();
  };
  lente(-86); lente(86);
  g.strokeStyle = "#e8c56a"; g.lineWidth = 8; g.lineCap = "round";
  g.beginPath(); g.moveTo(-18, -6); g.quadraticCurveTo(0, -28, 18, -6); g.stroke();
  g.strokeStyle = "#c9a24a"; g.lineWidth = 7;
  g.beginPath(); g.moveTo(-150, -8); g.lineTo(-230, 36); g.moveTo(150, -8); g.lineTo(230, 36); g.stroke();
  g.restore();
}

export function granoArroz(g, x, y, L, u) {
  if (u <= 0.01) return;
  const a = k.entra(Math.min(1, u));
  const ancho = L * 0.46;
  g.save();
  g.translate(x, y + (1 - a) * 70);
  g.scale(a, a);
  g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 22; g.shadowOffsetY = 14;
  const lg = g.createLinearGradient(-ancho * 0.4, 0, ancho * 0.45, 0);
  lg.addColorStop(0, "#c9a56a"); lg.addColorStop(0.38, "#fffaf2"); lg.addColorStop(1, "#e2cb9e");
  g.fillStyle = lg;
  g.beginPath();
  g.moveTo(0, -L / 2);
  g.bezierCurveTo(ancho * 0.72, -L * 0.18, ancho * 0.72, L * 0.22, 0, L / 2);
  g.bezierCurveTo(-ancho * 0.55, L * 0.22, -ancho * 0.55, -L * 0.18, 0, -L / 2);
  g.closePath();
  g.fill();
  g.shadowColor = "transparent";
  g.fillStyle = "rgba(255,255,255,0.5)";
  g.beginPath(); g.ellipse(-ancho * 0.1, -L * 0.08, ancho * 0.1, L * 0.06, -0.6, 0, 6.2832); g.fill();
  g.restore();
}

export function tarjeta(g, x, y, w, h, hx, hy, hr) {
  const r = 42;
  g.save();
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
  g.arc(hx, hy, hr, 0, 6.2832, true);
  g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 36; g.shadowOffsetY = 18;
  const lg = g.createLinearGradient(x, y, x + w, y + h);
  lg.addColorStop(0, "#3a3d46"); lg.addColorStop(0.45, "#14161c"); lg.addColorStop(1, "#07080c");
  g.fillStyle = lg;
  g.fill("evenodd");
  g.shadowColor = "transparent";
  g.strokeStyle = "rgba(255,255,255,0.14)"; g.lineWidth = 3;
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
  g.stroke();
  g.strokeStyle = "rgba(255,214,150,0.75)"; g.lineWidth = 5;
  g.beginPath(); g.arc(hx, hy, hr + 2, 0, 6.2832); g.stroke();
  g.strokeStyle = "rgba(0,0,0,0.8)"; g.lineWidth = 16;
  g.beginPath(); g.arc(hx, hy, Math.max(2, hr - 10), 0, 6.2832); g.stroke();
  g.restore();
}

// El mundo del bar: la carta, el agujero y, si toca, las gafas, el arroz y el entrecerrar.
export function escenaCafe(g, cam, o) {
  const vel = o.vel ?? 0;
  fondoCafe(g);
  bokeh(g, cam, vel);
  const rect = rectMundo(cam, [0, 0.05, 0], 2.5, 3.55);
  if (rect && rect.w > 20) {
    const borrosa = cartaConBlur(o.blurFuera ?? 14);
    g.drawImage(borrosa, rect.x, rect.y, rect.w, rect.h);
    if ((o.hr ?? 0) > 2) {
      g.save();
      g.beginPath(); g.arc(o.hx, o.hy, o.hr, 0, 6.2832); g.clip();
      g.drawImage(cartaConBlur(o.blurDentro ?? 0), rect.x, rect.y, rect.w, rect.h);
      g.restore();
    }
  }
  if ((o.tarjeta ?? 0) > 0.02 && (o.hr ?? 0) > 2) {
    const tw = 460, th = 640;
    tarjeta(g, o.hx - tw / 2, o.hy - th / 2, tw, th, o.hx, o.hy, o.hr * o.tarjeta);
  }
  if (o.gafas) gafas(g, o.gafas.x, o.gafas.y, o.gafas.s, o.gafas.u);
  if (o.arroz) granoArroz(g, o.arroz.x, o.arroz.y, o.arroz.L, o.arroz.u);
  if ((o.parpado ?? 0) > 0.02) parpados(g, o.parpado);
  velo(g, o.velo ?? 0.7);
}

export function parpados(g, u) {
  const c = k.suave(Math.max(0, Math.min(1, u)));
  const alto = 520 + c * 280;
  const piel = g.createLinearGradient(0, 0, 0, alto + 80);
  piel.addColorStop(0, "#3a221c"); piel.addColorStop(0.7, "#c4896c"); piel.addColorStop(1, "#a86b52");
  g.fillStyle = piel;
  g.beginPath();
  g.moveTo(0, 0); g.lineTo(1080, 0); g.lineTo(1080, alto - 80);
  g.quadraticCurveTo(540, alto + 160 - c * 40, 0, alto - 80); g.closePath(); g.fill();
  g.fillStyle = "#2a1814";
  const bajo = 1680 - c * 300;
  g.beginPath();
  g.moveTo(0, 1920); g.lineTo(1080, 1920); g.lineTo(1080, bajo + 40);
  g.quadraticCurveTo(540, bajo - 120, 0, bajo + 40); g.closePath(); g.fill();
  g.strokeStyle = "#1a0c0a"; g.lineWidth = 3; g.lineCap = "round";
  for (let i = 0; i < 18; i++) {
    const x = 80 + i * 52, largo = 34 + (i % 3) * 16;
    g.beginPath(); g.moveTo(x, alto - 20); g.quadraticCurveTo(x + 10, alto + largo * 0.6, x - 6, alto + largo); g.stroke();
  }
}

// ---------------------------------------------------------------- el ojo
function fibraIris(g, R) {
  g.save();
  g.beginPath(); g.arc(0, 0, R, 0, 6.2832); g.clip();
  const ig = g.createRadialGradient(-R * 0.22, -R * 0.28, R * 0.04, R * 0.1, R * 0.05, R);
  ig.addColorStop(0, "#f0c27a");
  ig.addColorStop(0.18, "#c47a3a");
  ig.addColorStop(0.4, "#1c8f7c");
  ig.addColorStop(0.72, "#0b4a48");
  ig.addColorStop(1, "#031210");
  g.fillStyle = ig; g.fillRect(-R, -R, R * 2, R * 2);
  const az = k.azar(19);
  g.globalAlpha = 0.12;
  for (let i = 0; i < 70; i++) {
    const a = az() * 6.2832, ond = (az() - 0.5) * 0.5;
    g.strokeStyle = az() > 0.6 ? "rgba(255,220,160,0.45)" : "rgba(0,20,16,0.65)";
    g.lineWidth = 1 + az() * 2.2;
    g.beginPath();
    const r0 = R * (0.16 + az() * 0.2), r1 = R * (0.75 + az() * 0.22);
    g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
    g.quadraticCurveTo(Math.cos(a + ond) * (r0 + r1) * 0.5, Math.sin(a + ond) * (r0 + r1) * 0.5, Math.cos(a) * r1, Math.sin(a) * r1);
    g.stroke();
  }
  g.globalAlpha = 1;
  // criptas, no un anillo de diana
  for (let i = 0; i < 8; i++) {
    const a = az() * 6.2832, rr = R * (0.35 + az() * 0.35);
    g.fillStyle = `rgba(0,30,28,${0.18 + az() * 0.15})`;
    g.beginPath(); g.ellipse(Math.cos(a) * rr, Math.sin(a) * rr, R * 0.07, R * 0.035, a, 0, 6.2832); g.fill();
  }
  g.strokeStyle = "rgba(0,0,0,0.45)"; g.lineWidth = R * 0.045;
  g.beginPath(); g.arc(0, 0, R * 0.98, 0, 6.2832); g.stroke();
  g.restore();
}

let vasos = null;
function texturaRetina() {
  if (vasos) return vasos;
  const c = k.lienzo(800, 800), g = c.getContext("2d");
  const lg = g.createRadialGradient(400, 360, 40, 400, 400, 520);
  lg.addColorStop(0, "#ffb27a"); lg.addColorStop(0.45, "#e2583a"); lg.addColorStop(1, "#6a1428");
  g.fillStyle = lg; g.fillRect(0, 0, 800, 800);
  const az = k.azar(8);
  g.lineCap = "round";
  const rama = (x, y, ang, largo, grosor, n) => {
    if (n === 0 || largo < 12) return;
    const x2 = x + Math.cos(ang) * largo, y2 = y + Math.sin(ang) * largo;
    g.strokeStyle = `rgba(120,16,28,${0.45 + grosor / 20})`;
    g.lineWidth = grosor;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(ang + 0.4) * largo * 0.5, y + Math.sin(ang + 0.4) * largo * 0.5, x2, y2); g.stroke();
    rama(x2, y2, ang - 0.45 - az() * 0.3, largo * 0.72, grosor * 0.62, n - 1);
    rama(x2, y2, ang + 0.5 + az() * 0.3, largo * 0.66, grosor * 0.58, n - 1);
  };
  rama(620, 430, Math.PI, 150, 10, 5);
  rama(600, 470, Math.PI * 0.82, 120, 7, 4);
  vasos = c;
  return c;
}

function manchaLuz(g, r, limpio) {
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
  const a = 0.95;
  gr.addColorStop(0, `rgba(255,255,245,${a})`);
  gr.addColorStop(0.25, `rgba(255,214,120,${0.85 * a})`);
  gr.addColorStop(0.6, `rgba(255,120,40,${0.35 * a})`);
  gr.addColorStop(1, "rgba(255,80,20,0)");
  g.fillStyle = gr;
  g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill();
  if (limpio < 0.95) {
    const az = k.azar(3);
    g.globalAlpha = 1 - limpio;
    for (let i = 0; i < 6; i++) {
      const ang = az() * 6.28, rr = r * (0.25 + az() * 0.7);
      g.fillStyle = "rgba(40,0,10,0.55)";
      g.beginPath(); g.ellipse(Math.cos(ang) * rr * 0.3, Math.sin(ang) * rr * 0.3, r * 0.28, r * 0.16, ang, 0, 6.28); g.fill();
    }
    g.globalAlpha = 1;
  }
}

// zoom: 1 es el ojo entero. pupila: fracción del iris (0.34 abierta, 0.1 un agujero).
// dentro: 0 reflejo borroso de la carta, 1 la retina. limpio: 1 punto limpio, 0 mancha sucia.
export function ojo(g, o) {
  const zoom = o.zoom ?? 1, cx = 540, cy = 1100, R = 470 * zoom;
  const pup = (o.pupila ?? 0.34) * R * 0.78;
  fondoCafe(g);
  g.save();
  g.translate(cx, cy);
  // esclerótica
  const eg = g.createRadialGradient(-R * 0.2, -R * 0.25, R * 0.2, 0, 0, R);
  eg.addColorStop(0, "#fffaf6"); eg.addColorStop(0.6, "#f0d2c8"); eg.addColorStop(1, "#d7a898");
  g.fillStyle = eg;
  g.beginPath(); g.ellipse(0, 0, R * 1.05, R * 0.78, 0, 0, 6.2832); g.fill();
  g.save();
  g.beginPath(); g.ellipse(0, 0, R * 0.92, R * 0.66, 0, 0, 6.2832); g.clip();
  fibraIris(g, R * 0.9);
  // pupila
  g.save();
  g.beginPath(); g.arc(0, 0, pup, 0, 6.2832); g.clip();
  const dentro = o.dentro ?? 0;
  if (dentro < 0.98) {
    g.globalAlpha = 1 - dentro;
    const img = cartaConBlur(o.blurReflejo ?? 16);
    const s = pup * 3.1;
    g.drawImage(img, -s / 2, -s / 2, s, s);
    g.globalAlpha = 1;
  }
  if (dentro > 0.02) {
    g.save();
    g.globalAlpha = dentro;
    const tex = texturaRetina();
    const s = pup * 2.6;
    g.drawImage(tex, -s / 2, -s / 2, s, s);
    const apertura = Math.max(0.08, o.pupila ?? 0.34) / 0.34;
    const radio = pup * (0.16 + 0.95 * apertura);
    g.save(); g.globalCompositeOperation = "lighter";
    manchaLuz(g, radio, o.limpio ?? 1);
    g.restore();
    if ((o.lesion ?? 0) > 0.02) {
      const L = o.lesion;
      g.fillStyle = `rgba(20,0,6,${0.82 * L})`;
      g.beginPath(); g.ellipse(pup * 0.05, pup * 0.02, pup * 0.42 * L + 8, pup * 0.32 * L + 6, 0.4, 0, 6.2832); g.fill();
      g.fillStyle = `rgba(90,10,16,${0.5 * L})`;
      g.beginPath(); g.ellipse(-pup * 0.08, pup * 0.1, pup * 0.2, pup * 0.12, -0.3, 0, 6.2832); g.fill();
    }
    g.restore();
  }
  g.restore(); // clip pupila
  g.restore(); // clip iris oval
  // brillo de la córnea
  g.save(); g.globalCompositeOperation = "screen";
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath(); g.ellipse(-R * 0.22, -R * 0.3, 34, 16, -0.6, 0, 6.2832); g.fill();
  g.restore();
  g.restore();
  // párpados que enmarcan
  const abre = o.abre ?? 1;
  parpados(g, 1 - abre * 0.72);
  velo(g, 0.45);
}

// ---------------------------------------------------------------- la consulta
let optotipo = null;
function lamina() {
  if (optotipo) return optotipo;
  const W = 900, H = 1200, c = k.lienzo(W, H), g = c.getContext("2d");
  g.fillStyle = "#0c0e12"; g.fillRect(0, 0, W, H);
  const fuente = romana();
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#f7f8fb";
  g.font = `700 210px ${fuente}`;
  g.fillText("E", W / 2, H / 2);
  const filas = [["F", "P"], ["T", "O", "Z"], ["L", "P", "E", "D"]];
  filas.forEach((fila, i) => {
    const tam = 92 - i * 16, y = H / 2 + 280 + i * (tam + 18);
    g.font = `700 ${tam}px ${fuente}`;
    const paso = tam * 0.9;
    const x0 = W / 2 - ((fila.length - 1) * paso) / 2;
    fila.forEach((ch, j) => g.fillText(ch, x0 + j * paso, y));
  });
  optotipo = c;
  return c;
}

const optoBorrosos = new Map();
function optoBlur(px) {
  const n = Math.max(0, Math.round(px));
  if (n <= 0) return lamina();
  if (optoBorrosos.has(n)) return optoBorrosos.get(n);
  const src = lamina();
  const c = k.lienzo(src.width, src.height), g = c.getContext("2d");
  g.filter = `blur(${n}px)`;
  g.drawImage(src, 0, 0);
  g.filter = "none";
  optoBorrosos.set(n, c);
  return c;
}

export function consulta(g, o) {
  const v = g.createLinearGradient(0, 0, 0, 1920);
  v.addColorStop(0, "#042028"); v.addColorStop(0.5, "#06343c"); v.addColorStop(1, "#021014");
  g.fillStyle = v; g.fillRect(0, 0, 1080, 1920);
  const lam = g.createRadialGradient(160, 420, 10, 200, 500, 700);
  lam.addColorStop(0, "rgba(255,196,120,0.45)"); lam.addColorStop(1, "rgba(255,160,60,0)");
  g.fillStyle = lam; g.fillRect(0, 0, 1080, 1920);
  const x = 90, y = 430, w = 900, h = 1180;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 30; g.shadowOffsetY = 16;
  g.fillStyle = "#1a1e24"; k.redondo(g, x - 28, y - 28, w + 56, h + 56, 28); g.fill();
  g.shadowColor = "transparent";
  g.drawImage(optoBlur(o.blur ?? 18), x, y, w, h);
  // el halo que queda si la graduación es mucha
  if ((o.halo ?? 0) > 0.02) {
    g.globalAlpha = 0.55 * o.halo;
    g.drawImage(optoBlur(22), x - 30, y - 40, w + 60, h + 80);
    g.globalAlpha = 1;
  }
  g.restore();
  const u = o.disco ?? 1;
  const hx = (o.hx ?? 540) + (1 - u) * 820, hy = o.hy ?? 1020, hr = o.hr ?? 140;
  if (hr > 4) {
    g.save();
    g.beginPath(); g.arc(hx, hy, hr, 0, 6.2832); g.clip();
    g.drawImage(optoBlur(o.blurDentro ?? 0), x, y, w, h);
    g.restore();
  }
  g.save();
  g.translate(hx, hy);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 28; g.shadowOffsetY = 14;
  g.fillStyle = "#12141a";
  g.beginPath();
  g.arc(0, 0, 268, 0, 6.2832);
  g.arc(0, 0, hr, 0, 6.2832, true);
  g.fill("evenodd");
  g.shadowColor = "transparent";
  k.redondo(g, 210, 120, 48, 520, 20); g.fill();
  g.strokeStyle = "rgba(255,214,160,0.7)"; g.lineWidth = 5;
  g.beginPath(); g.arc(0, 0, hr + 2, 0, 6.2832); g.stroke();
  g.restore();
  if ((o.pastilla ?? 0) > 0.02) k.pastilla(g, 300, 620, "1,2", "mm", "255,214,120", o.pastilla, 84);
  velo(g, 0.55);
}

// La retina de cerca, con una mancha que el agujero no limpia.
export function retinaMacro(g, o) {
  const tex = texturaRetina();
  g.drawImage(tex, -120, 80, 1320, 1760);
  const u = Math.max(0, Math.min(1, o.lesion ?? 1));
  g.save();
  g.translate(540, 1080);
  g.fillStyle = `rgba(8,0,2,${0.92 * u})`;
  g.beginPath(); g.ellipse(10, 0, 70 + 240 * u, 50 + 170 * u, 0.35, 0, 6.2832); g.fill();
  g.fillStyle = `rgba(70,8,14,${0.45 * u})`;
  g.beginPath(); g.ellipse(-30, 24, 40 + 70 * u, 24 + 36 * u, -0.4, 0, 6.2832); g.fill();
  g.globalCompositeOperation = "lighter";
  manchaLuz(g, 300, 1);
  g.restore();
  const vg = g.createRadialGradient(540, 1080, 180, 540, 1040, 980);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.78)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
  velo(g, 0.5);
}

// ---------------------------------------------------------------- la difracción
export function borde(g, o) {
  const hr = o.hr ?? 120, anillos = o.anillos ?? 0, oscuro = o.oscuro ?? 0;
  const lg = g.createLinearGradient(0, 0, 1080, 1920);
  lg.addColorStop(0, "#8a7040"); lg.addColorStop(0.35, "#3a3428"); lg.addColorStop(0.7, "#16140f"); lg.addColorStop(1, "#07080c");
  g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920);
  const br = g.createLinearGradient(0, 200, 1080, 1500);
  br.addColorStop(0, "rgba(255,236,190,0.18)"); br.addColorStop(0.4, "rgba(255,255,255,0)"); br.addColorStop(1, "rgba(0,0,0,0.35)");
  g.fillStyle = br; g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "destination-out";
  g.beginPath(); g.arc(540, 1000, hr, 0, 6.2832); g.fill();
  g.restore();
  const luz = 1 - oscuro * 0.85;
  g.save();
  g.beginPath(); g.arc(540, 1000, Math.max(4, hr - 2), 0, 6.2832); g.clip();
  g.fillStyle = "#070814"; g.fillRect(0, 0, 1080, 1920);
  g.restore();
  g.save(); g.globalCompositeOperation = "lighter";
  const cols = ["255,70,50", "255,180,40", "90,255,150", "70,150,255", "190,90,255"];
  cols.forEach((col, i) => {
    const rr = hr * 0.45 + anillos * (70 + i * 95);
    g.strokeStyle = `rgba(${col},${0.85 * luz * Math.min(1, anillos * 1.2)})`;
    g.lineWidth = 16 + i * 6;
    g.beginPath(); g.arc(540, 1000, Math.max(10, rr), 0, 6.2832); g.stroke();
  });
  const core = 26 + (1 - anillos) * 20;
  const gr = g.createRadialGradient(540, 1000, 0, 540, 1000, core * 5);
  gr.addColorStop(0, `rgba(255,255,255,${luz})`);
  gr.addColorStop(0.35, `rgba(255,220,160,${0.75 * luz})`);
  gr.addColorStop(1, "rgba(255,180,80,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(540, 1000, core * 5, 0, 6.2832); g.fill();
  g.restore();
  // canto del agujero
  g.strokeStyle = "rgba(255,236,200,0.7)"; g.lineWidth = 6;
  g.beginPath(); g.arc(540, 1000, hr, 0, 6.2832); g.stroke();
  g.strokeStyle = "rgba(0,0,0,0.7)"; g.lineWidth = 18;
  g.beginPath(); g.arc(540, 1000, hr - 14, 0, 6.2832); g.stroke();
  if (oscuro > 0.01) {
    g.fillStyle = `rgba(2,4,12,${oscuro * 0.88})`;
    g.fillRect(0, 0, 1080, 1920);
  }
  velo(g, 0.4);
}
