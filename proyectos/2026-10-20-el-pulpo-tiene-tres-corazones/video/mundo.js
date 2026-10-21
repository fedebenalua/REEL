// Lo que comparten los planos: el mar (con su luz que baja de la superficie, sus partículas y el fondo de arena), y el
// pulpo: un pulpo rojo de frente, con sus ocho brazos y sus ventosas, que puede volverse transparente y enseñar dentro
// sus tres corazones, sus dos branquias y la sangre azul que corre hasta la punta de los brazos.
// Todo en 2D, en coordenadas del mundo (px con zoom 1); vista() pone la cámara.
import * as k from "#kit";

const { azar, mez, suave: su, tramo: tr } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (el zoom, en log).
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}

// ---------------------------------------------------------------- el mar
// El agua, de la luz de arriba al azul hondo de abajo. cy: dónde mira la cámara (para que las partículas pasen al
// moverse); Z: su zoom. hondo: de 0 (cerca de la superficie) a 1 (el fondo).
const azM = azar(4242);
const NIEVE = Array.from({ length: 170 }, () => ({ x: azM() * 1400 - 160, y: azM() * 2600, r: 1.5 + azM() * 3.5, p: 0.25 + azM() * 0.9, f: azM() * 6.3 }));
export function mar(g, t, cx = 0, cy = 0, Z = 1, hondo = 0.3, { rayosAl = 1 } = {}) {
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, k.mezColor("#3fb3e6", "#1c6fae", hondo)); bg.addColorStop(0.45, k.mezColor("#1471b4", "#0b3c78", hondo));
  bg.addColorStop(1, k.mezColor("#06305f", "#041833", hondo));
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  // la luz de la superficie, arriba, que se mueve
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.16 * (1 - hondo * 0.6);
  const off = (t * 22 + cx * 0.1) % 640;
  g.drawImage(k.causticas, -off, -200, 1400, 1100); g.drawImage(k.causticas, 1400 - off, -200, 1400, 1100);
  g.restore();
  k.rayos(g, t, 1900, rayosAl * (1 - hondo * 0.45), 7, "190,235,255");
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, -300, -300, 1700, 2500); g.restore();
  // las partículas que flotan (pasan cuando la cámara se mueve)
  g.save(); g.globalCompositeOperation = "lighter";
  for (const q of NIEVE) {
    const zp = q.p * Math.min(2, Math.max(0.6, Z));
    const x = ((q.x - cx * zp * 0.6) % 1400 + 1400) % 1400 - 160 + 8 * Math.sin(t * 0.7 + q.f);
    const y = ((q.y - cy * zp * 0.6 - t * 12 * q.p) % 2600 + 2600) % 2600 - 340;
    g.fillStyle = `rgba(200,235,255,${0.18 + 0.25 * q.p})`; g.beginPath(); g.arc(x, y, q.r * q.p, 0, 6.2832); g.fill();
  }
  g.restore();
}
export function vineta(g, al = 0.55) {
  sinVista(g);
  const vg = g.createRadialGradient(540, 960, 500, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(1,10,24,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.5) {
  if (al <= 0.01) return;
  sinVista(g);
  const vg = g.createLinearGradient(0, 160, 0, 720);
  vg.addColorStop(0, `rgba(2,14,32,${al})`); vg.addColorStop(0.6, `rgba(2,14,32,${al * 0.6})`); vg.addColorStop(1, "rgba(2,14,32,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 720);
}

// Burbujas que suben: lista hecha una vez, con su sitio en el mundo.
export function burbuja(g, x, y, r, al = 1) {
  if (al <= 0.01 || r < 0.5) return;
  g.save(); g.globalAlpha *= al;
  const bg = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  bg.addColorStop(0, "rgba(255,255,255,0.55)"); bg.addColorStop(0.6, "rgba(190,235,255,0.12)"); bg.addColorStop(1, "rgba(220,245,255,0.5)");
  g.fillStyle = bg; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(230,250,255,0.6)"; g.lineWidth = Math.max(1, r * 0.08); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.arc(x - r * 0.35, y - r * 0.4, r * 0.18, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- el fondo del mar
// Arena y rocas, en coordenadas del mundo: la arena empieza en y = SUELO y se extiende a los lados.
export const SUELO = 700;
const azS = azar(717);
const ROCAS = Array.from({ length: 24 }, (_, i) => ({ x: -2600 + i * 330 + azS() * 200, r: 70 + azS() * 140, s: 30 + i, y: SUELO + 10 + azS() * 60 }));
const ALGAS = Array.from({ length: 30 }, (_, i) => ({ x: -2700 + i * 260 + azS() * 160, h: 180 + azS() * 260, f: azS() * 6, c: azS() < 0.5 ? "60,170,110" : "200,90,140" }));
const arena = k.tenir(k.ruido(512, 733, 18, 3, "manchas"), "#e7c993");
export function fondoMar(g, t, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  // las algas, detrás
  for (const a of ALGAS) {
    g.strokeStyle = `rgba(${a.c},0.8)`; g.lineCap = "round";
    for (let j = 0; j < 3; j++) {
      g.lineWidth = 16 - j * 3; g.beginPath(); g.moveTo(a.x + j * 22, SUELO + 20);
      for (let s = 1; s <= 10; s++) g.lineTo(a.x + j * 22 + 26 * Math.sin(t * 1.3 + a.f + s * 0.5 + j) * (s / 10), SUELO + 20 - (a.h * s) / 10 * (1 - j * 0.15));
      g.stroke();
    }
  }
  // la arena
  const sg = g.createLinearGradient(0, SUELO - 30, 0, SUELO + 900);
  sg.addColorStop(0, "#e6c78e"); sg.addColorStop(0.3, "#c9a46a"); sg.addColorStop(1, "#6a5232");
  g.fillStyle = sg;
  g.beginPath(); g.moveTo(-4000, SUELO + 20);
  for (let x = -4000; x <= 4000; x += 200) g.lineTo(x, SUELO + 18 * Math.sin(x * 0.004) + 10 * Math.sin(x * 0.011));
  g.lineTo(4000, SUELO + 1400); g.lineTo(-4000, SUELO + 1400); g.closePath(); g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22 * al;
  for (let x = -4000; x < 4000; x += 1000) g.drawImage(arena, x, SUELO - 40, 1000, 700);
  // las ondas de la arena
  g.globalCompositeOperation = "source-over"; g.globalAlpha = al;
  for (let j = 0; j < 9; j++) {
    const y0 = SUELO + 40 + j * j * 14;
    g.strokeStyle = `rgba(90,60,30,${0.25 - j * 0.015})`; g.lineWidth = 6 + j;
    g.beginPath(); for (let x = -4000; x <= 4000; x += 60) { const y = y0 + 10 * Math.sin(x * 0.01 + j * 1.7) + 6 * Math.sin(x * 0.023 + j); x === -4000 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    g.strokeStyle = `rgba(255,235,190,${0.18 - j * 0.012})`; g.lineWidth = 3;
    g.beginPath(); for (let x = -4000; x <= 4000; x += 60) { const y = y0 - 7 + 10 * Math.sin(x * 0.01 + j * 1.7) + 6 * Math.sin(x * 0.023 + j); x === -4000 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  }
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.18 * al;
  for (let x = -4000; x < 4000; x += 1300) g.drawImage(k.causticas, x + ((t * 30) % 1300), SUELO - 40, 1300, 700);
  g.restore();
  for (const r of ROCAS) k.roca(g, r.x, r.y, r.r, r.s * 0.7, r.s, -0.4, -1, 0);
  g.restore();
}

// ---------------------------------------------------------------- el pulpo
// De frente, con la cabeza (los ojos) en (0, 0), el manto hacia arriba (hasta y = -520) y los brazos hacia abajo.
// p: { abre (0 cerrado, 1 abierto), chorro (0 a 1: brazos juntos detrás, el manto apretado), anda (0 a 1),
//      paso (la fase de andar), rayos (0 a 1: se ve por dentro), sangre (0 a 1: la sangre azul llega a los brazos),
//      flujo (lo que ha corrido la sangre, para que avance), lat: [b1, b2, s] el latido de cada corazón (0 a 1),
//      vivo: [b1, b2, s] (0 parado y gris, 1 latiendo), luzCor: [b1, b2, s] (brillo extra), brillaBrazos (0 a 1) }
const COL = { luz: "#f59a68", medio: "#d0502f", sombra: "#6d1a12", piel: "208,80,47" };
const piel = k.ruido(512, 919, 9, 4, "lineas");
const azP = azar(5150);
const MANCHAS_PIEL = Array.from({ length: 70 }, () => ({ x: (azP() - 0.5) * 380, y: -40 - azP() * 470, r: 4 + azP() * 10, l: azP() < 0.35 }));
const N = 40;
const VAR = Array.from({ length: 8 }, () => ({ c: 0.75 + azP() * 0.6, l: 0.9 + azP() * 0.22, f: azP() * 6.3, o: 0.7 + azP() * 0.6 }));

function mantoCamino(g, apr) {
  const sx = 1 - 0.26 * apr, sy = 1 + 0.1 * apr;
  g.beginPath();
  g.moveTo(-125, 20);
  g.bezierCurveTo(-150 * sx, -60, -232 * sx, -140 * sy, -218 * sx, -300 * sy);
  g.bezierCurveTo(-204 * sx, -455 * sy, -105 * sx, -525 * sy, 0, -525 * sy);
  g.bezierCurveTo(105 * sx, -525 * sy, 204 * sx, -455 * sy, 218 * sx, -300 * sy);
  g.bezierCurveTo(232 * sx, -140 * sy, 150 * sx, -60, 125, 20);
  g.quadraticCurveTo(0, 70, -125, 20);
  g.closePath();
}

// La línea de un brazo: N puntos con su ancho.
function brazoLinea(i, t, p) {
  const lado = i > 3.5 ? 1 : -1, cen = (i - 3.5) / 3.5;
  const abre = p.abre ?? 1, chorro = p.chorro ?? 0, anda = p.anda ?? 0;
  const spread = mez(mez(0.25, 1.32, abre), 0.24, chorro);
  const a0 = Math.PI / 2 + spread * cen;
  const curl = mez(mez(0.2, 1.0, abre) * (0.75 + 0.25 * Math.abs(cen)), 0.04, chorro);
  const ola = mez(0.32, 0.12, chorro);
  const V = VAR[i];
  const L = mez(680, 720, chorro) * (1 - 0.06 * Math.abs(cen)) * mez(V.l, 1, chorro);
  const bx = mez(-118, 118, i / 7) * mez(1, 0.8, chorro), by = 40;
  const pts = [];
  let x = bx, y = by;
  const ds = L / (N - 1);
  // andar: cada brazo baja al suelo y su punta se dobla hacia fuera; los pasos alternan
  const pasoI = Math.sin((p.paso ?? 0) * 6.2832 + i * 1.7 + (i % 2) * Math.PI);
  for (let j = 0; j < N; j++) {
    const s = j / (N - 1);
    let th = a0 + lado * curl * V.c * (1.6 * s * s + 4.2 * Math.pow(s, 7)) + ola * V.o * Math.sin(t * 1.7 + V.f - s * 4.2) * s;
    if (anda > 0) {
      const aBaja = Math.PI / 2 + cen * 0.75 + pasoI * 0.12;
      const fuera = Math.PI / 2 + lado * (1.25 + 0.15 * pasoI);
      th = mez(th, mez(aBaja, fuera, su(tr(s, 0.25, 0.75))) + lado * 0.5 * Math.pow(Math.max(0, s - 0.8) / 0.2, 2), anda);
    }
    pts.push({ x, y, s, th, w: 60 * Math.pow(1 - s, 0.95) * (1 - 0.1 * Math.abs(cen)) + 2.5 });
    x += Math.cos(th) * ds; y += Math.sin(th) * ds;
  }
  return pts;
}
export const brazoPuntos = brazoLinea;

function caminoBrazo(g, pts) {
  const n = pts.length, L = [], R = [];
  for (let j = 0; j < n; j++) {
    const q = pts[j], nx = -Math.sin(q.th), ny = Math.cos(q.th);
    L.push([q.x + nx * q.w, q.y + ny * q.w]); R.push([q.x - nx * q.w, q.y - ny * q.w]);
  }
  g.beginPath(); g.moveTo(L[0][0], L[0][1]);
  for (let j = 1; j < n; j++) g.lineTo(L[j][0], L[j][1]);
  const e = pts[n - 1]; g.arc(e.x, e.y, e.w, e.th + Math.PI / 2, e.th - Math.PI / 2, true);
  for (let j = n - 1; j >= 0; j--) g.lineTo(R[j][0], R[j][1]);
  g.closePath();
}

function brazo(g, pts, i, t, p, lx, delante) {
  const n = pts.length;
  caminoBrazo(g, pts);
  const mx = pts[Math.floor(n / 2)];
  const gr = g.createLinearGradient(pts[0].x - 140, pts[0].y - 80, mx.x + 200, mx.y + 260);
  gr.addColorStop(0, delante ? COL.luz : "#d9774f"); gr.addColorStop(0.45, COL.medio); gr.addColorStop(1, COL.sombra);
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35;
  g.drawImage(piel, pts[0].x - 400, pts[0].y - 100, 900, 900);
  g.globalAlpha = 0.3; g.drawImage(k.manchas, pts[0].x - 400, pts[0].y - 100, 900, 900);
  g.restore();
  // la luz por un lado y la sombra por el otro, a lo largo del brazo
  g.save(); g.lineCap = "round";
  for (let j = 0; j < n - 2; j++) {
    const q = pts[j], q2 = pts[j + 1], nx = -Math.sin(q.th), ny = Math.cos(q.th), lado = nx * lx < 0 ? 1 : -1;
    g.strokeStyle = "rgba(255,200,160,0.28)"; g.lineWidth = q.w * 0.32;
    g.beginPath(); g.moveTo(q.x + nx * q.w * 0.5 * lado, q.y + ny * q.w * 0.5 * lado); g.lineTo(q2.x + nx * q2.w * 0.5 * lado, q2.y + ny * q2.w * 0.5 * lado); g.stroke();
    g.strokeStyle = "rgba(60,8,6,0.32)"; g.lineWidth = q.w * 0.4;
    g.beginPath(); g.moveTo(q.x - nx * q.w * 0.62 * lado, q.y - ny * q.w * 0.62 * lado); g.lineTo(q2.x - nx * q2.w * 0.62 * lado, q2.y - ny * q2.w * 0.62 * lado); g.stroke();
  }
  g.restore();
  // las ventosas, en dos filas por el lado de dentro de la curva
  const ladoV = i > 3.5 ? -1 : 1;
  for (let j = 4; j < n - 1; j++) {
    const q = pts[j], nx = -Math.sin(q.th), ny = Math.cos(q.th), fila = j % 2 ? 0.62 : 0.28;
    const r = q.w * 0.3;
    if (r < 1.6) continue;
    const x = q.x + nx * q.w * fila * ladoV, y = q.y + ny * q.w * fila * ladoV;
    const vg = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    vg.addColorStop(0, "#ffe2cf"); vg.addColorStop(0.65, "#f1b496"); vg.addColorStop(1, "#a8503a");
    g.fillStyle = vg; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
    g.fillStyle = "rgba(120,40,30,0.55)"; g.beginPath(); g.arc(x + r * 0.08, y + r * 0.08, r * 0.38, 0, 6.2832); g.fill();
  }
}

// La sangre azul por un brazo: una vena que brilla, con pulsos que bajan hasta la punta.
function venaBrazo(g, pts, llega, flujo, al, extra = 0, pulsoEn = -1) {
  if (al <= 0.01 || llega <= 0.01) return;
  const n = Math.max(2, Math.round(pts.length * Math.min(1, llega)));
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  const j0 = 3;
  const camino = () => { g.beginPath(); g.moveTo(pts[j0].x, pts[j0].y); for (let j = j0 + 1; j < n; j++) g.lineTo(pts[j].x, pts[j].y); };
  camino(); g.strokeStyle = `rgba(30,100,255,${0.28 * al})`; g.lineWidth = 30; g.stroke();
  camino(); g.strokeStyle = `rgba(60,140,255,${0.6 * al})`; g.lineWidth = 10; g.stroke();
  camino(); g.setLineDash([22, 60]); g.lineDashOffset = -flujo * 300; g.strokeStyle = `rgba(150,215,255,${0.75 * al})`; g.lineWidth = 7; g.stroke();
  g.setLineDash([]);
  const e = pts[n - 1];
  k.brillo(g, e.x, e.y, 120 + 220 * extra, "70,160,255", al * (0.5 + 0.5 * extra));
  if (pulsoEn >= 0 && pulsoEn <= 1.05) { const q = pts[Math.min(pts.length - 1, Math.round(pulsoEn * (pts.length - 1)))], a = al * tr(pulsoEn, 0.08, 0.25); k.brillo(g, q.x, q.y, 200, "120,190,255", a); k.brillo(g, q.x, q.y, 70, "255,255,255", a * 0.7); }
  g.restore();
}

// Un corazón de pulpo: una bolsa de músculo, rosada, con la sangre azul que brilla dentro. lat: el latido (0 a 1),
// vivo: 0 parado (gris), 1 latiendo. luz: un brillo extra.
export function corazon(g, x, y, r, lat, vivo, luz = 0, al = 1) {
  if (al <= 0.01) return;
  const s = 1 + 0.2 * lat * vivo;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(s * 1.05, s * 0.95);
  if (vivo > 0.01) { k.brillo(g, 0, 0, r * (5.5 + 3 * luz), "60,150,255", Math.min(1, 0.7 + 0.3 * lat + luz * 0.6) * vivo); k.brillo(g, 0, 0, r * (3 + 2 * lat), "255,120,160", (0.25 + 0.35 * lat + 0.4 * luz) * vivo); }
  // una bolsa de músculo redonda arriba que se estrecha hacia abajo, con los dos vasos que entran por arriba
  const forma = () => {
    g.beginPath();
    g.moveTo(0, -r * 0.88);
    g.bezierCurveTo(r * 0.75, -r * 0.95, r * 1.12, -r * 0.4, r * 0.95, r * 0.15);
    g.bezierCurveTo(r * 0.8, r * 0.62, r * 0.35, r * 0.95, r * 0.05, r * 1.12);
    g.bezierCurveTo(-r * 0.4, r * 0.92, -r * 0.85, r * 0.6, -r * 0.97, r * 0.12);
    g.bezierCurveTo(-r * 1.1, -r * 0.42, -r * 0.72, -r * 0.92, 0, -r * 0.88);
    g.closePath();
  };
  forma();
  const c1 = k.mezColor("#8d8a94", "#ffb0b8", vivo), c2 = k.mezColor("#5d5864", "#e04a68", vivo), c3 = k.mezColor("#2a2830", "#6a0c26", vivo);
  const gr = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
  gr.addColorStop(0, c1); gr.addColorStop(0.55, c2); gr.addColorStop(1, c3);
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(piel, -r * 1.3, -r * 1.3, r * 2.6, r * 2.6);
  g.globalAlpha = 0.16; g.strokeStyle = "#5a1020"; g.lineWidth = r * 0.04;
  for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(-r, i * r * 0.22); g.quadraticCurveTo(0, i * r * 0.22 + r * 0.25, r, i * r * 0.22 - r * 0.05); g.stroke(); }
  // la sangre azul que se ve a través
  if (vivo > 0.01) {
    g.globalCompositeOperation = "lighter"; g.globalAlpha = (0.35 + 0.4 * lat) * vivo;
    const bg = g.createRadialGradient(0, r * 0.15, 0, 0, r * 0.15, r);
    bg.addColorStop(0, "rgba(90,170,255,1)"); bg.addColorStop(1, "rgba(30,80,200,0)");
    g.fillStyle = bg; g.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4);
  }
  g.restore();
  forma(); g.strokeStyle = `rgba(255,220,225,${0.35 * vivo + 0.15})`; g.lineWidth = r * 0.06; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(-r * 0.4, -r * 0.45, r * 0.25, r * 0.12, -0.6, 0, 6.2832); g.fill();
  g.restore();
}

// Una branquia: una pluma con sus filamentos, de (x, y) hacia arriba, de largo h. azul: cuánto se ha vuelto azul.
function branquia(g, x, y, h, lado, azul, flujo, al) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const P = (u) => [x + lado * (18 * Math.sin(u * 3) + u * 22), y - u * h];
  const cu = (u) => k.mezRgb("235,215,230", "110,190,255", azul * Math.min(1, u * 1.6));
  const c = cu(1);
  g.lineCap = "round";
  for (let i = 0; i <= 40; i++) {
    const u = i / 40, [px, py] = P(u), w = Math.sin(Math.PI * Math.min(1, u * 1.1 + 0.08)) * 52 + 6, c = cu(u);
    for (const sd of [-1, 1]) {
      const gr = g.createLinearGradient(px, py, px + sd * w, py);
      gr.addColorStop(0, `rgba(${c},0.95)`); gr.addColorStop(1, `rgba(${k.mezRgb(c, "255,255,255", 0.3)},0.35)`);
      g.strokeStyle = gr; g.lineWidth = 4.5 - u * 1.5;
      g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + sd * w * 0.6, py - 4, px + sd * w, py + 9 + 3 * Math.sin(i * 1.7)); g.stroke();
    }
  }
  g.strokeStyle = `rgba(${c},0.95)`; g.lineWidth = 10;
  g.beginPath(); for (let i = 0; i <= 22; i++) { const [px, py] = P(i / 22); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
  if (azul > 0.01) {
    g.globalCompositeOperation = "lighter";
    g.beginPath(); for (let i = 0; i <= 22; i++) { const [px, py] = P(i / 22); i ? g.lineTo(px, py) : g.moveTo(px, py); }
    g.setLineDash([18, 30]); g.lineDashOffset = -flujo * 220; g.strokeStyle = `rgba(190,230,255,${0.9 * azul})`; g.lineWidth = 7; g.stroke(); g.setLineDash([]);
    k.brillo(g, P(0.5)[0], P(0.5)[1], h * 1.4, "60,150,255", 0.45 * azul);
  }
  g.restore();
}

// Dónde están, dentro del pulpo (para que los planos puedan acercarse a ellos).
export const SIS = [0, -225], BR1 = [-118, -150], BR2 = [118, -150];

// Un tubo de sangre con su flujo (lighter), de una lista de puntos.
function tubo(g, pts, color, al, flujo, ancho = 14, dash = true) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  const c = () => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); };
  c(); g.strokeStyle = `rgba(${color},${0.3 * al})`; g.lineWidth = ancho * 2.6; g.stroke();
  c(); g.strokeStyle = `rgba(${color},${0.75 * al})`; g.lineWidth = ancho; g.stroke();
  if (dash) { c(); g.setLineDash([20, 40]); g.lineDashOffset = -flujo * 260; g.strokeStyle = `rgba(235,245,255,${0.85 * al})`; g.lineWidth = ancho * 0.5; g.stroke(); g.setLineDash([]); }
  g.restore();
}

export function pulpo(g, t, p = {}) {
  const lat = p.lat ?? [0, 0, 0], vivo = p.vivo ?? [1, 1, 1], luzCor = p.luzCor ?? [0, 0, 0];
  const rayos = p.rayos ?? 0, sangre = p.sangre ?? 0, flujo = p.flujo ?? t, apr = p.chorro ?? 0;
  const brazos = [];
  for (let i = 0; i < 8; i++) brazos.push(brazoLinea(i, t, p));
  // sombra suave detrás
  k.brillo(g, 0, -100, 1300, "0,20,50", 0);
  // los brazos, de fuera hacia dentro (los de fuera, detrás)
  const orden = [0, 7, 1, 6, 2, 5, 3, 4];
  // la membrana entre los brazos
  g.save();
  g.beginPath();
  for (let a = 0; a < 8; a++) { const i = 7 - a, q = brazos[i][Math.round(N * 0.18)]; a ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y); }
  g.lineTo(-90, -30); g.lineTo(90, -30); g.closePath();
  const mg = g.createLinearGradient(0, -20, 0, 200); mg.addColorStop(0, COL.medio); mg.addColorStop(1, "#7e2416");
  g.fillStyle = mg; g.fill();
  g.restore();
  for (const i of orden) {
    brazo(g, brazos[i], i, t, p, -1, i === 3 || i === 4);
    // por dentro: el brazo se oscurece para que se vea la sangre
    if (rayos > 0.01) { caminoBrazo(g, brazos[i]); g.fillStyle = `rgba(30,10,45,${0.38 * rayos})`; g.fill(); }
  }
  // la sangre por los brazos
  if (sangre > 0.01) for (const i of orden) venaBrazo(g, brazos[i], sangre, flujo, rayos * (vivo[2] * 0.75 + 0.25), p.brillaBrazos ?? 0, p.pulsoBrazo ?? -1);
  // el manto
  g.save();
  mantoCamino(g, apr);
  const mg2 = g.createRadialGradient(-80, -400, 30, 0, -230, 380);
  mg2.addColorStop(0, "#ffb88a"); mg2.addColorStop(0.35, COL.luz); mg2.addColorStop(0.7, COL.medio); mg2.addColorStop(1, COL.sombra);
  g.fillStyle = mg2; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(piel, -300, -560, 600, 640);
  g.globalAlpha = 0.35; g.drawImage(k.manchas, -280, -560, 560, 620);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  const sh = g.createRadialGradient(-60, -380, 80, 0, -250, 340); sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(50,5,5,0.45)");
  g.fillStyle = sh; g.fillRect(-300, -560, 600, 640);
  g.fillStyle = "rgba(255,235,215,0.22)"; g.beginPath(); g.ellipse(-80, -410, 70, 40, -0.6, 0, 6.2832); g.fill();
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  for (const m of MANCHAS_PIEL) { g.fillStyle = m.l ? "rgba(255,210,180,0.35)" : "rgba(90,20,12,0.35)"; g.beginPath(); g.arc(m.x * (1 - 0.26 * apr), m.y, m.r, 0, 6.2832); g.fill(); }
  // borde de luz azul del agua, a la derecha
  const rg = g.createLinearGradient(120, 0, 230, 0); rg.addColorStop(0, "rgba(140,210,255,0)"); rg.addColorStop(1, "rgba(140,210,255,0.35)");
  g.fillStyle = rg; g.fillRect(100, -560, 160, 640);
  g.restore();
  g.restore();
  // por dentro
  if (rayos > 0.01) {
    g.save();
    mantoCamino(g, apr); g.clip();
    g.globalAlpha = rayos;
    const dg = g.createRadialGradient(0, -240, 40, 0, -240, 330);
    dg.addColorStop(0, "rgba(28,10,40,0.74)"); dg.addColorStop(0.75, "rgba(45,12,40,0.6)"); dg.addColorStop(1, "rgba(80,20,30,0.2)");
    g.fillStyle = dg; g.fillRect(-300, -560, 600, 640);
    g.globalAlpha = 1;
    const sx = 1 - 0.26 * apr;
    const S = [SIS[0], SIS[1]], B1 = [BR1[0] * sx, BR1[1]], B2 = [BR2[0] * sx, BR2[1]];
    // la sangre sin oxígeno, casi transparente, que vuelve del cuerpo a los dos corazones de las branquias
    const gris = "200,195,230";
    tubo(g, [[-60, 40], [-80, -40], B1], gris, rayos * 0.7 * (p.vuelve ?? 1), flujo, 12 * (0.4 + 0.6 * (p.vuelve ?? 1)));
    tubo(g, [[60, 40], [80, -40], B2], gris, rayos * 0.7 * (p.vuelve ?? 1), flujo, 12 * (0.4 + 0.6 * (p.vuelve ?? 1)));
    // las branquias y la sangre que sube por ellas
    const azul = p.branquiasAzul ?? sangre;
    branquia(g, B1[0] - 6, B1[1] - 28, 230, -1, azul, flujo * vivo[0], rayos);
    branquia(g, B2[0] + 6, B2[1] - 28, 230, 1, azul, flujo * vivo[1], rayos);
    // de las branquias al corazón del cuerpo: ya azul
    tubo(g, [[B1[0] - 30, -390], [-70, -330], [S[0] - 30, S[1] - 30]], "70,150,255", rayos * azul, flujo, 12);
    tubo(g, [[B2[0] + 30, -390], [70, -330], [S[0] + 30, S[1] - 30]], "70,150,255", rayos * azul, flujo, 12);
    // del corazón del cuerpo, abajo, a los brazos
    tubo(g, [[S[0], S[1] + 40], [0, -60], [0, 40]], "70,150,255", rayos * sangre * (0.25 + 0.75 * vivo[2]), flujo * vivo[2], 16, vivo[2] > 0.3);
    const ca = p.corAl ?? [1, 1, 1];
    corazon(g, B1[0], B1[1], 46, lat[0], vivo[0], luzCor[0], rayos * ca[0]);
    corazon(g, B2[0], B2[1], 46, lat[1], vivo[1], luzCor[1], rayos * ca[1]);
    corazon(g, S[0], S[1], 72, lat[2], vivo[2], luzCor[2], rayos * ca[2]);
    g.restore();
  }
  // los ojos
  for (const lado of [-1, 1]) {
    const ex = lado * 98, ey = -8;
    g.beginPath(); g.ellipse(ex, ey, 54, 44, lado * 0.15, 0, 6.2832);
    const eg = g.createRadialGradient(ex - 15, ey - 18, 5, ex, ey, 56); eg.addColorStop(0, "#ffb08a"); eg.addColorStop(1, "#8a2a18");
    g.fillStyle = eg; g.fill();
    g.beginPath(); g.ellipse(ex, ey, 36, 28, 0, 0, 6.2832);
    const og = g.createRadialGradient(ex - 10, ey - 10, 2, ex, ey, 36); og.addColorStop(0, "#fff1c2"); og.addColorStop(0.7, "#e8bd62"); og.addColorStop(1, "#8a6420");
    g.fillStyle = og; g.fill();
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(piel, ex - 40, ey - 32, 80, 64); g.restore();
    g.beginPath(); g.moveTo(ex - 26, ey); g.quadraticCurveTo(ex, ey - 13, ex + 26, ey); g.quadraticCurveTo(ex, ey + 13, ex - 26, ey); g.fillStyle = "#120806"; g.fill();
    g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(ex - 12, ey - 12, 6, 0, 6.2832); g.fill();
  }
}

// El latido: un golpe corto cada 1/frec segundos (0 a 1). fase, para que no laten a la vez.
export const latido = (t, frec = 1.4, fase = 0) => Math.pow(Math.max(0, Math.sin(6.2832 * (t * frec + fase))), 6);

// El chorro de agua que deja al nadar: burbujas y una estela, de (x, y) hacia abajo. u: fuerza (0 a 1).
const azC = azar(3131);
const CHORRO = Array.from({ length: 70 }, () => ({ d: azC(), x: (azC() - 0.5), r: 6 + azC() * 18, v: 0.6 + azC() * 0.8 }));
export function chorroAgua(g, x, y, u, t, largo = 900) {
  if (u <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  const cg = g.createLinearGradient(0, y, 0, y + largo);
  cg.addColorStop(0, `rgba(200,240,255,${0.35 * u})`); cg.addColorStop(1, "rgba(200,240,255,0)");
  g.fillStyle = cg; g.beginPath(); g.moveTo(x - 40, y); g.lineTo(x + 40, y); g.lineTo(x + 160, y + largo); g.lineTo(x - 160, y + largo); g.closePath(); g.fill();
  g.restore();
  for (const b of CHORRO) {
    const d = (b.d + t * b.v * 1.2) % 1;
    burbuja(g, x + b.x * 260 * d + b.x * 40, y + d * largo, b.r * (0.5 + d), u * (1 - d));
  }
}
