// Dibujos que se repiten en los dos sitios del vídeo: la cara, el depósito de cristal, la taza, el rótulo.
import * as k from "#kit";

const { redondo, mez } = k;
export const TAU = Math.PI * 2;
export const rs = (n, s = 0) => { const x = Math.sin(n * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
export const lin = (g, x0, y0, x1, y1, st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach(([o, c]) => q.addColorStop(o, c)); return q; };
export const rad = (g, x, y, r0, r1, st) => { const q = g.createRadialGradient(x, y, r0, x, y, r1); st.forEach(([o, c]) => q.addColorStop(o, c)); return q; };
export const disco = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, TAU); };
export const texto = (g, s, x, y, tam, col = "#fff", peso = 800, alin = "center") => { g.font = `${peso} ${tam}px Figtree`; g.textAlign = alin; g.textBaseline = "middle"; g.fillStyle = col; g.fillText(s, x, y); g.textAlign = "left"; g.textBaseline = "alphabetic"; };

// Un rótulo pequeño centrado en (x, y), con su color y su transparencia.
export function rotulo(g, x, y, s, rgb, al = 1, tam = 30) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.font = `800 ${tam}px Figtree`;
  const w = g.measureText(s).width + 34, h = tam + 20;
  redondo(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = "rgba(4,7,18,0.72)"; g.fill();
  g.strokeStyle = `rgba(${rgb},0.75)`; g.lineWidth = 3; g.stroke();
  texto(g, s, x, y + 1, tam, `rgb(${rgb})`); g.restore();
}

// ------------------------------------------------------------------ las moléculas
function hex(g, x, y, r, rot = 0) { g.beginPath(); for (let i = 0; i < 6; i++) { const a = rot + (i / 6) * TAU; i ? g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : g.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); }
// Adenosina: una gema azul hexagonal con caras.
export function gema(g, x, y, r, rot = 0, al = 1, brillo = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  k.brillo(g, x, y, r * 4.2, "90,170,255", 0.55 * brillo);
  hex(g, x, y, r, rot); g.fillStyle = lin(g, x - r, y - r, x + r, y + r, [[0, "#c9ecff"], [0.45, "#4aa3ff"], [1, "#1c4fd6"]]); g.fill();
  g.strokeStyle = "rgba(230,248,255,0.9)"; g.lineWidth = Math.max(2, r * 0.07); g.stroke();
  hex(g, x, y, r * 0.55, rot + 0.52); g.fillStyle = "rgba(255,255,255,0.28)"; g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)"; disco(g, x - r * 0.3, y - r * 0.38, r * 0.14); g.fill();
  g.restore();
}
// Cafeína: el mismo hexágono, naranja, con un grano de café dentro.
export function pepita(g, x, y, r, rot = 0, al = 1, brillo = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  k.brillo(g, x, y, r * 4.2, "255,150,50", 0.55 * brillo);
  hex(g, x, y, r, rot); g.fillStyle = lin(g, x - r, y - r, x + r, y + r, [[0, "#ffe2a8"], [0.45, "#ff9d2e"], [1, "#b2470a"]]); g.fill();
  g.strokeStyle = "rgba(255,240,205,0.9)"; g.lineWidth = Math.max(2, r * 0.07); g.stroke();
  g.save(); g.translate(x, y); g.rotate(rot * 0.5 - 0.5);
  g.fillStyle = "#4a210c"; g.beginPath(); g.ellipse(0, 0, r * 0.38, r * 0.54, 0, 0, TAU); g.fill();
  g.strokeStyle = "#ffcf8a"; g.lineWidth = Math.max(2, r * 0.07); g.beginPath(); g.moveTo(0, -r * 0.5); g.quadraticCurveTo(r * 0.2, -r * 0.1, -r * 0.05, r * 0.1); g.quadraticCurveTo(-r * 0.2, r * 0.3, 0, r * 0.5); g.stroke();
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.7)"; disco(g, x - r * 0.4, y - r * 0.45, r * 0.12); g.fill();
  g.restore();
}

// ------------------------------------------------------------------ el depósito de cristal
export function tanque(g, t, x, y, w, h, nivel, rgbA, rgbB, glow = 1, ondas = 1) {
  const r = w / 2, ny = y + h - h * Math.max(0, Math.min(1, nivel));
  g.save();
  g.fillStyle = "rgba(6,10,28,0.62)"; redondo(g, x, y, w, h, r); g.fill();
  g.save(); redondo(g, x + 4, y + 4, w - 8, h - 8, r - 4); g.clip();
  if (nivel > 0.002) {
    g.fillStyle = lin(g, 0, ny, 0, y + h, [[0, `rgb(${rgbA})`], [1, `rgb(${rgbB})`]]);
    g.beginPath(); g.moveTo(x, y + h + 4); g.lineTo(x, ny);
    for (let px = 0; px <= w; px += 6) g.lineTo(x + px, ny + Math.sin(px * 0.09 + t * 3) * 3.5 * ondas);
    g.lineTo(x + w, y + h + 4); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(x, ny - 1, w, 3);
    for (let i = 0; i < 7; i++) { const u = (t * 0.4 + rs(i, 3)) % 1, bx = x + 14 + rs(i, 4) * (w - 28), by = y + h - u * (y + h - ny); g.fillStyle = `rgba(255,255,255,${0.5 * (1 - u)})`; disco(g, bx, by, 3 + rs(i, 5) * 3); g.fill(); }
  }
  g.restore();
  g.strokeStyle = `rgba(${rgbA},${0.55 + 0.4 * glow})`; g.lineWidth = 4; redondo(g, x, y, w, h, r); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.22)"; redondo(g, x + 10, y + 16, 8, h - 40, 4); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 3;
  for (let i = 1; i < 5; i++) { const ty = y + (h * i) / 5; g.beginPath(); g.moveTo(x + w - 20, ty); g.lineTo(x + w - 4, ty); g.stroke(); }
  g.restore();
  if (glow > 0.01) k.brillo(g, x + w / 2, ny, w * 2.6, rgbA, 0.35 * glow * (nivel > 0.02 ? 1 : 0));
}

// ------------------------------------------------------------------ la cara
// sueno 0 = despierto, 1 = muerto de sueño; alerta 0-1: ojos muy abiertos (con café).
export function cara(g, t, x, y, R, sueno, alerta = 0) {
  g.save(); g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.3)"; disco(g, 4, 10, R); g.fill();
  g.fillStyle = lin(g, -R, -R, R, R, [[0, "#ffe3a6"], [1, "#f09a4a"]]); disco(g, 0, 0, R); g.fill();
  g.strokeStyle = "rgba(120,50,10,0.45)"; g.lineWidth = 4; g.stroke();
  g.fillStyle = "rgba(255,110,120,0.4)"; disco(g, -R * 0.62, R * 0.22, R * 0.16); g.fill(); disco(g, R * 0.62, R * 0.22, R * 0.16); g.fill();
  const cl = Math.max(0, Math.min(1, sueno)), abre = (1 - cl * 0.92) * (1 + 0.1 * alerta);
  for (const sx of [-1, 1]) {
    const ex = sx * R * 0.38, ey = -R * 0.12, rx = R * 0.22, ry = R * 0.26 * (1 + 0.12 * alerta);
    g.fillStyle = "#fff"; g.beginPath(); g.ellipse(ex, ey, rx, ry, 0, 0, TAU); g.fill();
    g.fillStyle = "#2b2150"; disco(g, ex + Math.sin(t * 0.7) * 3, ey + ry * 0.12 + cl * 6, rx * 0.5); g.fill();
    g.fillStyle = "#fff"; disco(g, ex - rx * 0.12, ey - ry * 0.12, rx * 0.14); g.fill();
    g.save(); g.beginPath(); g.ellipse(ex, ey, rx + 1, ry + 1, 0, 0, TAU); g.clip();
    const lid = Math.max(0, ry * 2 * (1 - Math.min(1, abre)));
    g.fillStyle = lin(g, 0, ey - ry, 0, ey + ry, [[0, "#f0a85a"], [1, "#e89448"]]); g.fillRect(ex - rx - 2, ey - ry - 2, rx * 2 + 4, lid + 2);
    g.strokeStyle = "#7a3a12"; g.lineWidth = 4; g.beginPath(); g.moveTo(ex - rx, ey - ry + lid); g.lineTo(ex + rx, ey - ry + lid); g.stroke();
    g.restore();
    g.strokeStyle = "#7a3a12"; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(ex - rx, ey - ry - 12 - 8 * alerta - cl * -4); g.lineTo(ex + rx, ey - ry - 16 - 8 * alerta + cl * 4 * sx); g.stroke();
  }
  // boca: sonrisa despierta o bostezo
  const bos = Math.max(0, (cl - 0.35) / 0.65);
  g.fillStyle = bos > 0.01 ? "#4a1410" : "none"; g.strokeStyle = "#7a2a12"; g.lineWidth = 7; g.lineCap = "round";
  if (bos > 0.02) { g.beginPath(); g.ellipse(0, R * 0.52, R * (0.15 + 0.06 * bos), R * (0.06 + 0.2 * bos * (0.8 + 0.2 * Math.sin(t * 1.6))), 0, 0, TAU); g.fill(); g.stroke(); }
  else { g.beginPath(); g.arc(0, R * 0.34, R * (0.26 + 0.1 * alerta), 0.25, Math.PI - 0.25); g.stroke(); }
  g.restore();
  // las zetas
  const za = Math.max(0, (cl - 0.4) / 0.6);
  if (za > 0.02) for (let i = 0; i < 3; i++) {
    const u = (t * 0.45 + i / 3) % 1, zx = x + R * 0.95 + u * 40 + i * 6, zy = y - R * 0.5 - u * R * 0.9;
    g.save(); g.globalAlpha = za * Math.sin(u * Math.PI); texto(g, "z", zx, zy, 34 + i * 12, "#bcd2ff", 800); g.restore();
  }
}

// Una taza de café grande, con vapor, inclinada un ángulo ang.
export function taza(g, t, x, y, s, ang, vapor = 1) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.ellipse(0, 112, 80, 12, 0, 0, TAU); g.fill();
  g.fillStyle = lin(g, -80, 0, 80, 0, [[0, "#b8c2d8"], [0.3, "#ffffff"], [0.75, "#e8edf8"], [1, "#9aa6c0"]]);
  g.beginPath(); g.moveTo(-82, -50); g.lineTo(82, -50); g.quadraticCurveTo(80, 82, 38, 104); g.lineTo(-38, 104); g.quadraticCurveTo(-80, 82, -82, -50); g.closePath(); g.fill();
  g.strokeStyle = "#e8edf8"; g.lineWidth = 16; g.beginPath(); g.moveTo(82, -20); g.bezierCurveTo(138, -26, 138, 52, 70, 54); g.stroke();
  g.fillStyle = lin(g, 0, -62, 0, -40, [[0, "#2e1306"], [1, "#6b3414"]]); g.beginPath(); g.ellipse(0, -50, 82, 15, 0, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,230,190,0.5)"; g.beginPath(); g.ellipse(-22, -52, 30, 4, 0, 0, TAU); g.fill();
  g.fillStyle = "#ff8a3d"; disco(g, 0, 32, 20); g.fill(); g.fillStyle = "#fff"; disco(g, 0, 32, 10); g.fill();
  g.restore();
  if (vapor > 0.01) {
    g.save(); g.globalAlpha = vapor * 0.5; g.lineCap = "round"; g.lineWidth = 10;
    for (let i = 0; i < 3; i++) { g.strokeStyle = "rgba(255,255,255,0.5)"; g.beginPath(); for (let j = 0; j <= 10; j++) { const yy = y - 60 * s - j * 14 * s, xx = x + (i - 1) * 40 * s + Math.sin(j * 0.8 - t * 3 + i) * 10 * s; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
    g.restore();
  }
}
