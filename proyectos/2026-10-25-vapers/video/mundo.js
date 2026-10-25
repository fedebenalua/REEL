// Lo que comparten los planos: el fondo oscuro, la nube de sabores, el váper, el cigarrillo y el paquete de tabaco.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar } = k;

export const ROSA = "255,110,200", AZUL = "110,200,255", LILA = "190,130,255", NARANJA = "255,150,50", ROJO = "255,70,60", VERDE_F = "150,230,120";

// ---------------------------------------------------------------- el fondo
export function fondo(g, t, tono = "#120a22") {
  const bg = g.createRadialGradient(540, 900, 50, 540, 900, 1400);
  bg.addColorStop(0, tono); bg.addColorStop(1, "#040308");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, 0, 0, 1080, 1920); g.restore();
}

export function velo(g, al = 0.55) {
  const vg = g.createLinearGradient(0, 220, 0, 640); vg.addColorStop(0, `rgba(4,3,8,${al})`); vg.addColorStop(1, "rgba(4,3,8,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

// ---------------------------------------------------------------- la nube de sabores
// Bocanadas blandas que salen de (x0, y0) hacia dir (radianes) y crecen. t: el tiempo; u: cuánto ha salido (0 a 1);
// n: cuántas; colores: lista "r,g,b"; esc: tamaño; semilla.
const nubes = new Map();
function bocanadas(semilla, n) {
  const key = semilla + ":" + n;
  if (nubes.has(key)) return nubes.get(key);
  const az = azar(semilla);
  const l = Array.from({ length: n }, () => ({ a: (az() - 0.5) * 1.3, d: 0.15 + az() * 0.85, r: 0.5 + az() * 0.8, f: az() * 6.28, c: Math.floor(az() * 3), w: (az() - 0.5) * 0.4 }));
  nubes.set(key, l);
  return l;
}
export function nube(g, t, x0, y0, dir, u, op = {}) {
  const { n = 60, colores = [ROSA, AZUL, LILA], esc = 1, semilla = 7, al = 1, alcance = 900 } = op;
  if (u <= 0 || al <= 0.01) return;
  const L = bocanadas(semilla, n);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of L) {
    const p = Math.min(1, u / b.d);
    if (p <= 0) continue;
    const e = k.entra(p), dist = e * alcance * esc * b.d, a = dir + b.a * e + b.w * Math.sin(t * 0.7 + b.f);
    const x = x0 + Math.cos(a) * dist + Math.sin(t * 0.9 + b.f) * 14, y = y0 + Math.sin(a) * dist + Math.cos(t * 0.8 + b.f) * 14;
    const r = (40 + 220 * e * b.r) * esc, aa = al * 0.13 * Math.min(1, p * 3) * (0.35 + 0.65 * Math.min(1, e * 2)) * (1 - 0.45 * e);
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${colores[b.c % colores.length]},${aa})`); gr.addColorStop(0.6, `rgba(${colores[b.c % colores.length]},${aa * 0.5})`); gr.addColorStop(1, `rgba(${colores[b.c % colores.length]},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- el váper
// Un váper desechable, vertical, con la boquilla arriba. Centro en (x, y), largo L (px), girado ang.
// op: { color, luz (el led de abajo), abierto (0 a 1: se parte por la mitad y las dos mitades se separan) }.
export function vaper(g, x, y, L, ang = 0, op = {}) {
  const { color = "#ff5fb0", color2 = "#7a4bff", luz = 1, abierto = 0, al = 1, baja = 0 } = op;
  const W = L * 0.17, R = W / 2;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  const mitad = (s) => {
    // s = -1 arriba, +1 abajo; cada mitad se separa al abrirse; baja: cuánto más cae la de abajo
    g.save(); g.translate(0, s * abierto * L * 0.22 + (s > 0 ? baja : 0)); g.rotate(s * abierto * 0.08);
    g.save(); g.beginPath(); g.rect(-R * 2, s < 0 ? -L / 2 - L * 0.1 : 0, W * 2, L / 2 + L * 0.1); g.clip();
    g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60; g.shadowOffsetY = 20;
    k.redondo(g, -R, -L / 2, W, L, R); g.fillStyle = "#222"; g.fill(); g.restore();
    // el cuerpo: un cilindro con degradado de colores
    k.redondo(g, -R, -L / 2, W, L, R);
    const cg = g.createLinearGradient(-R, 0, R, 0); cg.addColorStop(0, "#1a1020"); cg.addColorStop(0.12, color2); cg.addColorStop(0.35, "#ffffff"); cg.addColorStop(0.5, color); cg.addColorStop(0.85, color2); cg.addColorStop(1, "#1a1020");
    g.fillStyle = cg; g.fill();
    const vg = g.createLinearGradient(0, -L / 2, 0, L / 2); vg.addColorStop(0, color2); vg.addColorStop(0.5, color); vg.addColorStop(1, color2);
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.55; k.redondo(g, -R, -L / 2, W, L, R); g.fillStyle = vg; g.fill(); g.restore();
    g.save(); g.globalCompositeOperation = "screen"; const rg = g.createLinearGradient(-R, 0, R, 0); rg.addColorStop(0.25, "rgba(255,255,255,0)"); rg.addColorStop(0.36, "rgba(255,255,255,0.55)"); rg.addColorStop(0.45, "rgba(255,255,255,0)"); k.redondo(g, -R, -L / 2, W, L, R); g.fillStyle = rg; g.fill(); g.restore();
    // la boquilla, negra, arriba
    if (s < 0) { const bg = g.createLinearGradient(-R, 0, R, 0); bg.addColorStop(0, "#0c0a10"); bg.addColorStop(0.4, "#3a3542"); bg.addColorStop(1, "#0c0a10"); k.redondo(g, -R * 0.85, -L / 2 - L * 0.07, W * 0.85, L * 0.12, R * 0.4); g.fillStyle = bg; g.fill(); g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, -L / 2 - L * 0.065, R * 0.5, R * 0.16, 0, 0, 6.2832); g.fill(); }
    // el led, abajo
    if (s > 0) { g.fillStyle = `rgba(${AZUL},${0.9 * luz})`; g.beginPath(); g.ellipse(0, L / 2 - L * 0.01, R * 0.55, R * 0.22, 0, 0, 6.2832); g.fill(); k.brillo(g, 0, L / 2, R * 3, AZUL, 0.8 * luz); }
    // el corte: el interior cuando se abre
    if (abierto > 0.01) { g.fillStyle = "#2b2430"; g.beginPath(); g.ellipse(0, 0, R, R * 0.35, 0, 0, 6.2832); g.fill(); g.fillStyle = "#0e0b12"; g.beginPath(); g.ellipse(0, 0, R * 0.75, R * 0.25, 0, 0, 6.2832); g.fill(); }
    g.restore();
    g.restore();
  };
  mitad(1); mitad(-1);
  g.restore();
}

// ---------------------------------------------------------------- el cigarrillo
// Centro en (x, y), largo L, girado ang. encendido: 0 a 1 (la brasa).
export function cigarrillo(g, x, y, L, ang = 0, encendido = 0, al = 1) {
  const W = L * 0.11;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 18; g.shadowOffsetY = 8;
  k.redondo(g, -L / 2, -W / 2, L, W, W * 0.3); g.fillStyle = "#f4f1ea"; g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  const pg = g.createLinearGradient(0, -W / 2, 0, W / 2); pg.addColorStop(0, "#ffffff"); pg.addColorStop(0.5, "#ece7dc"); pg.addColorStop(1, "#b9b2a4");
  k.redondo(g, -L / 2, -W / 2, L, W, W * 0.3); g.fillStyle = pg; g.fill();
  // el filtro
  const fg = g.createLinearGradient(0, -W / 2, 0, W / 2); fg.addColorStop(0, "#f2c57a"); fg.addColorStop(0.5, "#d99b3c"); fg.addColorStop(1, "#8f5f1c");
  g.save(); k.redondo(g, -L / 2, -W / 2, L, W, W * 0.3); g.clip(); g.fillStyle = fg; g.fillRect(L / 2 - L * 0.28, -W / 2, L * 0.28, W);
  g.fillStyle = "rgba(120,80,20,0.5)"; g.fillRect(L / 2 - L * 0.28, -W / 2, 4, W); g.fillRect(L / 2 - L * 0.28 + L * 0.02, -W / 2, 2, W);
  // la brasa
  if (encendido > 0.01) { g.fillStyle = "#3a3330"; g.fillRect(-L / 2, -W / 2, L * 0.07, W); const bg = g.createLinearGradient(-L / 2, 0, -L / 2 + L * 0.07, 0); bg.addColorStop(0, `rgba(255,120,30,${encendido})`); bg.addColorStop(1, `rgba(255,60,20,${0.3 * encendido})`); g.fillStyle = bg; g.fillRect(-L / 2, -W / 2, L * 0.07, W); }
  g.restore();
  if (encendido > 0.01) k.brillo(g, -L / 2, 0, W * 4, "255,130,40", encendido);
  g.restore();
}

// Un paquete de tabaco abierto, visto de frente, con la base en (x, y) y alto H; girado ang. lleno: 0 a 1 (cuántos
// cigarrillos asoman). color: del paquete.
export function paquete(g, x, y, H, ang = 0, lleno = 1, color = "#c8102e", al = 1) {
  const W = H * 0.62, D = H * 0.22;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 24;
  g.fillStyle = "#111"; g.fillRect(-W / 2, -H, W, H); g.restore();
  // el cuerpo
  const cg = g.createLinearGradient(-W / 2, 0, W / 2, 0); cg.addColorStop(0, k.mezColor(color, "#000000", 0.35)); cg.addColorStop(0.3, color); cg.addColorStop(0.7, k.mezColor(color, "#ffffff", 0.15)); cg.addColorStop(1, k.mezColor(color, "#000000", 0.3));
  g.fillStyle = cg; g.fillRect(-W / 2, -H * 0.72, W, H * 0.72);
  // el papel plateado y los cigarrillos asomando
  g.fillStyle = "#e9ebef"; g.fillRect(-W / 2 + 8, -H * 0.82, W - 16, H * 0.14);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const cx = -W / 2 + 14 + (i + 0.5) * ((W - 28) / n), alto = (H * 0.2 + (i % 2) * H * 0.04) * lleno;
    if (alto < 2) continue;
    const r = (W - 28) / n / 2 - 2;
    g.fillStyle = "#f4f1ea"; k.redondo(g, cx - r, -H * 0.76 - alto, r * 2, alto + 10, r * 0.5); g.fill();
    g.fillStyle = "#e8e1d4"; g.beginPath(); g.ellipse(cx, -H * 0.76 - alto, r, r * 0.45, 0, 0, 6.2832); g.fill();
    g.fillStyle = "#b07a2c"; g.beginPath(); g.ellipse(cx, -H * 0.76 - alto, r * 0.7, r * 0.3, 0, 0, 6.2832); g.fill();
  }
  // la tapa abierta, hacia atrás
  g.fillStyle = k.mezColor(color, "#000000", 0.15); g.beginPath(); g.moveTo(-W / 2, -H * 0.72); g.lineTo(W / 2, -H * 0.72); g.lineTo(W / 2 + D * 0.3, -H * 0.72 - D * 0.9); g.lineTo(-W / 2 + D * 0.3, -H * 0.72 - D * 0.9); g.closePath(); g.fill();
  // el aviso de sanidad, una franja negra
  g.fillStyle = "#111"; g.fillRect(-W / 2, -H * 0.36, W, H * 0.36);
  g.fillStyle = "rgba(255,255,255,0.9)"; g.font = `800 ${H * 0.07}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("FUMAR", 0, -H * 0.24); g.fillText("MATA", 0, -H * 0.14);
  g.save(); g.globalCompositeOperation = "screen"; const rg = g.createLinearGradient(-W / 2, 0, W / 2, 0); rg.addColorStop(0.1, "rgba(255,255,255,0)"); rg.addColorStop(0.2, "rgba(255,255,255,0.25)"); rg.addColorStop(0.3, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(-W / 2, -H, W, H); g.restore();
  g.restore();
}

// ---------------------------------------------------------------- una viruta de metal
export function viruta(g, x, y, tam, ang, al = 1, tono = ["#8e949f", "#f3f5f8", "#5a606b"]) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  const gr = g.createLinearGradient(-tam, -tam * 0.4, tam, tam * 0.4); gr.addColorStop(0, tono[0]); gr.addColorStop(0.5, tono[1]); gr.addColorStop(1, tono[2]);
  g.fillStyle = gr; g.beginPath(); g.moveTo(-tam, 0); g.lineTo(-tam * 0.3, -tam * 0.5); g.lineTo(tam * 0.6, -tam * 0.3); g.lineTo(tam, tam * 0.1); g.lineTo(tam * 0.2, tam * 0.5); g.lineTo(-tam * 0.6, tam * 0.35); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 2; g.stroke();
  g.restore();
}
