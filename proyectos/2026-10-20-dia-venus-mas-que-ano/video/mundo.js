// Lo que comparten los planos: la cámara 2D, el espacio, Venus (de lado y desde arriba), la superficie de Venus con su
// Sol, y el avión de papel con el amigo. Todo en coordenadas del mundo (px con zoom 1); vista() pone la cámara y
// sinVista() la quita para dibujar luces y texto encima de la pantalla.
import * as k from "#kit";

const { azar, lienzo, redondo, suave: su, tramo: tr, mez, girado } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
export function velo(g, al = 0.55) {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 150, 0, 700);
  vg.addColorStop(0, `rgba(5,5,10,${al})`); vg.addColorStop(0.6, `rgba(5,5,10,${al * 0.7})`); vg.addColorStop(1, "rgba(5,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.5) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 520, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// El Sol: un disco que quema, con su corona. b: cuánto brilla de más.
export function sol(g, x, y, r, t = 0, b = 0) {
  k.brillo(g, x, y, r * 7, "255,190,90", 0.5 + 0.2 * b);
  g.save();
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, "#fffbe6"); gr.addColorStop(0.55, "#ffe890"); gr.addColorStop(0.9, "#ffd060"); gr.addColorStop(1, "#ffc040");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  g.restore();
  k.brillo(g, x, y, r * 3.2, "255,230,150", 0.6 + 0.2 * b);
}

// ---------------------------------------------------------------- el espacio (fondo fijo, en pantalla)
export function espacio(g, brillo = 1) { g.save(); sinVista(g); k.fondo(g, { e: { f: [0, 0, 0] } }, brillo); g.restore(); }

// ---------------------------------------------------------------- Venus: su mapa de nubes
const mapaVenus = (() => {
  const n = 256, r = k.ruido(n, 61, 4, 4, "crudo"), r2 = k.ruido(n, 67, 7, 3, "crudo");
  const l = lienzo(n * 2, n), cx = l.getContext("2d"), img = cx.createImageData(n * 2, n);
  const P = [[120, 66, 20], [196, 124, 44], [236, 178, 78], [252, 220, 130], [255, 244, 196]];
  for (let y = 0; y < n; y++) for (let x = 0; x < n * 2; x++) {
    const xi = Math.floor((x < n ? x : 2 * n - 1 - x) * 0.8), i = y * n + xi;
    const banda = 0.5 + 0.5 * Math.sin(y / n * 9.4 + 3 * r.crudo[i]);
    const raw = 0.18 + 0.5 * r.crudo[i] + 0.2 * r2.crudo[y * n + (x < n ? x : 2 * n - 1 - x)] + 0.22 * banda - 0.1, h = Math.min(0.999, Math.max(0, 0.5 + 2.6 * (raw - 0.54)));
    const p = h * (P.length - 1), a = Math.floor(p), u = p - a, q = (y * n * 2 + x) * 4;
    img.data[q] = mez(P[a][0], P[a + 1][0], u); img.data[q + 1] = mez(P[a][1], P[a + 1][1], u); img.data[q + 2] = mez(P[a][2], P[a + 1][2], u); img.data[q + 3] = 255;
  }
  cx.putImageData(img, 0, 0);
  return l;
})();

// Venus de lado: sus nubes pasan de derecha a izquierda (gira crece = una vuelta cuando sube 1). Su luz viene de (lx, ly).
export function venusLado(g, x, y, r, gira, lx = -1, ly = -0.2) {
  if (r < 1) return;
  const l = Math.hypot(lx, ly) || 1; lx /= l; ly /= l;
  g.save();
  const hg = g.createRadialGradient(x, y, r * 0.95, x, y, r * 1.22);
  hg.addColorStop(0, "rgba(255,200,100,0.55)"); hg.addColorStop(1, "rgba(255,200,100,0)");
  g.fillStyle = hg; g.beginPath(); g.arc(x, y, r * 1.22, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.clip();
  const w = r * 4, off = (((gira % 1) + 1) % 1) * w;
  g.drawImage(mapaVenus, x - r - off, y - r, w, r * 2); g.drawImage(mapaVenus, x - r - off + w - 1, y - r, w + 1, r * 2);
  const esf = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  esf.addColorStop(0, "rgba(255,255,255,0.2)"); esf.addColorStop(0.7, "rgba(0,0,0,0)"); esf.addColorStop(1, "rgba(60,20,0,0.5)");
  g.fillStyle = esf; g.fillRect(x - r, y - r, r * 2, r * 2);
  const sh = g.createLinearGradient(x + lx * r, y + ly * r, x - lx * r, y - ly * r);
  sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(0.5, "rgba(20,5,0,0.1)"); sh.addColorStop(1, "rgba(15,4,0,0.85)");
  g.fillStyle = sh; g.fillRect(x - r, y - r, r * 2, r * 2);
  g.restore();
}
// Un punto rojo en el planeta (lon: su longitud en radianes; visible en la cara de delante).
export function marca(g, x, y, r, lon, tam = 1) {
  const c = Math.cos(lon); if (c <= 0.05) return;
  const px = x + r * Math.sin(lon) * 0.98, py = y - r * 0.16;
  g.save(); g.translate(px, py); g.scale(c * 0.8 + 0.2, 1);
  k.brillo(g, 0, 0, 170 * tam, "255,60,60", 0.8 * Math.min(1, c * 3));
  g.fillStyle = "#ff3030"; g.beginPath(); g.arc(0, 0, 24 * tam, 0, 6.2832); g.fill();
  g.strokeStyle = "#fff"; g.lineWidth = 6 * tam; g.stroke();
  g.restore();
}
// Venus desde arriba: el disco con sus nubes girando (phi, horario si crece) y una aguja roja que marca su giro.
export function venusDisco(g, x, y, r, phi, lx = -1, ly = 0, aguja = 1) {
  const l = Math.hypot(lx, ly) || 1; lx /= l; ly /= l;
  g.save();
  const hg = g.createRadialGradient(x, y, r * 0.95, x, y, r * 1.3);
  hg.addColorStop(0, "rgba(255,200,100,0.5)"); hg.addColorStop(1, "rgba(255,200,100,0)");
  g.fillStyle = hg; g.beginPath(); g.arc(x, y, r * 1.3, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.clip();
  g.save(); g.translate(x, y); g.rotate(phi); g.drawImage(mapaVenus, -r * 1.4, -r * 1.2, r * 2.8, r * 2.4); g.restore();
  g.save(); g.translate(x, y); g.rotate(phi + 2.4); g.globalAlpha = 0.6; g.drawImage(mapaVenus, -r * 1.3, -r * 1.2, r * 2.6, r * 2.4); g.restore();
  const sh = g.createLinearGradient(x + lx * r, y + ly * r, x - lx * r, y - ly * r);
  sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(0.5, "rgba(20,5,0,0.1)"); sh.addColorStop(1, "rgba(15,4,0,0.8)");
  g.fillStyle = sh; g.fillRect(x - r, y - r, r * 2, r * 2);
  const lg = g.createRadialGradient(x, y, r * 0.5, x, y, r); lg.addColorStop(0, "rgba(0,0,0,0)"); lg.addColorStop(1, "rgba(50,15,0,0.45)");
  g.fillStyle = lg; g.fillRect(x - r, y - r, r * 2, r * 2);
  g.restore();
  // la aguja
  if (aguja <= 0.01) return;
  g.save(); g.globalAlpha = aguja; g.translate(x, y); g.rotate(phi - Math.PI / 2);
  g.strokeStyle = "#ff3030"; g.lineWidth = r * 0.11; g.lineCap = "round"; g.beginPath(); g.moveTo(r * 0.1, 0); g.lineTo(r * 0.9, 0); g.stroke();
  k.brillo(g, r * 0.92, 0, r * 0.9, "255,60,60", 0.8);
  g.fillStyle = "#ff3030"; g.beginPath(); g.arc(r * 0.92, 0, r * 0.13, 0, 6.2832); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = r * 0.04; g.stroke();
  g.restore();
}

// Mercurio, de lado.
export function mercurio(g, x, y, r, gira, lx = -1, ly = -0.2) {
  k.planeta(g, x, y, r, gira, lx, ly, ["#d8d2c6", "#8a8378", "#2c2924"]);
}

// ---------------------------------------------------------------- la superficie de Venus
// u: la fase del día solar (0 = amanecer por la izquierda, el oeste; 0,5 = se pone por la derecha, el este; hasta 1, noche).
// El horizonte está en y = 230 (mundo). Devuelve dónde está el Sol {x, y, e}.
const roca = (() => {
  const az = azar(33), p = [];
  for (let i = 0; i < 22; i++) p.push([-1000 + az() * 2000, 340 + Math.pow(az(), 1.4) * 700, 18 + az() * 70, az()]);
  return p.sort((a, b) => a[1] - b[1]);
})();
const cumbres = (() => { const az = azar(9), p = []; for (let i = 0; i <= 24; i++) p.push([-1400 + i * 120, az()]); return p; })();
const HOR = 300;
export function solPos(u) {
  if (u >= 0.5) return { x: 480, y: HOR + 200, e: -1 };
  const a = -0.14 + (Math.PI + 0.28) * (u / 0.5);
  return { x: -Math.cos(a) * 480, y: HOR - Math.sin(a) * 700, e: Math.sin(a) };
}
function crestas(g, base, alto, sem, col) {
  const pts = []; for (let i = 0; i <= 12; i++) { const r = cumbres[(i * 2 + sem * 3) % 25][1]; pts.push([-1500 + i * 250, base - alto * (0.1 + 0.9 * r * r)]); }
  g.fillStyle = col; g.beginPath(); g.moveTo(-1500, base + 200); g.lineTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) { const mx = (pts[i - 1][0] + pts[i][0]) / 2, my = (pts[i - 1][1] + pts[i][1]) / 2; g.quadraticCurveTo(pts[i - 1][0], pts[i - 1][1], mx, my); }
  g.lineTo(1500, base + 200); g.closePath(); g.fill();
}
export function superficie(g, t, u) {
  const s = solPos(u), e = Math.max(0, s.e), dia = u < 0.5 ? Math.min(1, e * 2.2) : 0, tw = u < 0.5 ? Math.exp(-e * 4) : Math.max(u > 0.9 ? su(tr(u, 0.9, 1.0)) * 0.8 : 0, 1 - (u - 0.5) / 0.07), fin = u < 0.5 ? su(tr(0.5 - u, 0, 0.05)) : 0;
  const top = k.mezRgb("58,20,26", "236,150,56", dia), mid = k.mezRgb("100,36,24", "255,196,96", dia), low = k.mezRgb("120,42,16", "255,140,50", Math.max(dia, tw * 0.9));
  const sg = g.createLinearGradient(0, -1200, 0, HOR);
  sg.addColorStop(0, `rgb(${top})`); sg.addColorStop(0.6, `rgb(${mid})`); sg.addColorStop(1, `rgb(${low})`);
  g.fillStyle = sg; g.fillRect(-1500, -1500, 3000, HOR + 1500);
  // las nubes: franjas largas que pasan despacio
  g.save();
  for (let i = 0; i < 9; i++) {
    const y = -950 + i * 130, x = (((i * 337 + t * (14 + 6 * (i % 3))) % 3400) + 3400) % 3400 - 1700, w = 900 + (i % 4) * 260;
    const cg = g.createRadialGradient(x, y, 0, x, y, w); cg.addColorStop(0, `rgba(${i % 2 ? "255,225,150" : "120,50,20"},${0.22 * (0.3 + 0.7 * dia) + 0.05})`); cg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = cg; g.save(); g.translate(x, y); g.scale(1, 0.13); g.translate(-x, -y); g.beginPath(); g.arc(x, y, w, 0, 6.2832); g.fill(); g.restore();
  }
  g.restore();
  // el Sol
  if (u < 0.5) {
    k.brillo(g, s.x, s.y, 1700, "255,200,110", 0.55 * (0.35 + 0.65 * tw + 0.3 * dia) * fin);
    sol(g, s.x, s.y, 120, t);
  } else if (u > 0.9) { k.brillo(g, -480, HOR, 1500, "255,150,70", 0.5 * su(tr(u, 0.9, 1.0))); }
  // las montañas de detrás y el suelo
  crestas(g, HOR + 6, 150, 1, `rgb(${k.mezRgb("30,12,10", "140,66,28", dia * 0.7 + tw * 0.2)})`);
  crestas(g, HOR + 30, 90, 3, `rgb(${k.mezRgb("24,10,8", "96,40,18", dia * 0.7 + tw * 0.2)})`);
  const lg = g.createLinearGradient(0, HOR, 0, 1250);
  lg.addColorStop(0, `rgb(${k.mezRgb("40,18,12", "160,80,34", dia)})`); lg.addColorStop(1, `rgb(${k.mezRgb("14,7,7", "58,26,14", dia)})`);
  g.fillStyle = lg; g.fillRect(-1500, HOR + 40, 3000, 1100);
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, s.x * 0.8, HOR + 70, 1500, "255,170,80", 0.5 * (dia * 0.8 + tw * 0.5)); g.restore();
  for (const [x, y, r, q] of roca) {
    const lz = Math.max(0, Math.min(1, 0.5 - (x - s.x) / 2400)) * (dia + 0.2);
    g.save(); g.translate(x, y);
    const rg = g.createRadialGradient(-r * 0.3 * Math.sign(s.x - x || 1) * -1, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
    rg.addColorStop(0, `rgb(${k.mezRgb("60,32,22", "240,150,80", lz)})`); rg.addColorStop(1, `rgb(${k.mezRgb("14,8,8", "52,24,14", dia)})`);
    g.fillStyle = rg; g.beginPath(); g.ellipse(0, 0, r * 1.2, r * 0.7, 0, 0, 6.2832); g.fill();
    g.restore();
  }
  // en la noche el suelo brilla un poco: está a 464 °C
  if (u >= 0.5) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, HOR + 330, 1900, "255,70,30", 0.25); g.restore(); }
  return s;
}

// ---------------------------------------------------------------- el avión de papel y el amigo
export function avion(g, x, y, ang) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(1.7, 1.7);
  g.fillStyle = "#fff"; g.beginPath(); g.moveTo(-70, -10); g.lineTo(90, 0); g.lineTo(-70, 40); g.closePath(); g.fill();
  g.fillStyle = "#cfe0ff"; g.beginPath(); g.moveTo(-70, -10); g.lineTo(90, 0); g.lineTo(-20, 12); g.closePath(); g.fill();
  g.fillStyle = "#9ab8ee"; g.beginPath(); g.moveTo(-20, 12); g.lineTo(90, 0); g.lineTo(-70, 40); g.closePath(); g.fill();
  g.restore();
}
export function amigo(g, x, y, esc, al, texto = "Ese amigo") {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(esc, esc); g.globalAlpha = al;
  g.beginPath(); g.arc(0, 0, 80, 0, 6.2832); g.fillStyle = "#ffd29a"; g.fill(); g.lineWidth = 8; g.strokeStyle = "#fff"; g.stroke();
  g.fillStyle = "#3a2210"; g.beginPath(); g.arc(-28, -10, 8, 0, 6.2832); g.arc(28, -10, 8, 0, 6.2832); g.fill();
  g.strokeStyle = "#3a2210"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.arc(0, 14, 32, 0.25, Math.PI - 0.25); g.stroke();
  redondo(g, 100, -40, 300, 80, 36); g.fillStyle = "#1d6bff"; g.fill(); g.font = "800 44px Figtree"; g.fillStyle = "#fff"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(texto, 130, 2);
  g.restore();
}

export { girado };
