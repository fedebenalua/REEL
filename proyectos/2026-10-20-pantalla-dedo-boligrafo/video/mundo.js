// Lo que comparten los planos: la cámara 2D, el móvil, las cosas que tocan la pantalla (dedo, bolígrafo, salchicha,
// guante, lápiz), las ráfagas de luz de un toque, el corte de la pantalla por dentro, y el avión de papel con el amigo.
// Todo en coordenadas del mundo (px con zoom 1). Cada cosa que toca se dibuja con la PUNTA en (0,0) y el cuerpo hacia
// abajo; luego se gira y se escala donde haga falta.
import * as k from "#kit";

const { azar, redondo, suave: su, tramo: tr, mez } = k;

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

// ---------------------------------------------------------------- el móvil, de frente (centrado en 0,0)
export const MOV = { w: 800, h: 1620 };
export function movil(g, t, o = {}) {
  const { w, h } = MOV, { brilla = 0 } = o;
  g.save();
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 70; g.shadowOffsetY = 36; redondo(g, -w / 2, -h / 2, w, h, 100); g.fillStyle = "#1a1c24"; g.fill(); g.restore();
  redondo(g, -w / 2, -h / 2, w, h, 100); const bg = g.createLinearGradient(-w / 2, 0, w / 2, 0); bg.addColorStop(0, "#6a6e7c"); bg.addColorStop(0.15, "#2a2c36"); bg.addColorStop(0.85, "#24262e"); bg.addColorStop(1, "#5a5e6c"); g.fillStyle = bg; g.fill();
  // la pantalla: un fondo de colores
  const sx = -w / 2 + 22, sy = -h / 2 + 22, sw = w - 44, sh = h - 44;
  g.save(); redondo(g, sx, sy, sw, sh, 80); g.clip();
  const pg = g.createLinearGradient(0, sy, 0, sy + sh); pg.addColorStop(0, "#2a1670"); pg.addColorStop(0.5, "#7a2a9a"); pg.addColorStop(1, "#e0509a"); g.fillStyle = pg; g.fillRect(sx, sy, sw, sh);
  g.globalCompositeOperation = "lighter";
  k.brillo(g, -150 + 40 * Math.sin(t * 0.5), -300, 900, "90,160,255", 0.35); k.brillo(g, 200, 450 + 30 * Math.cos(t * 0.4), 900, "255,120,60", 0.35);
  g.globalCompositeOperation = "source-over";
  // un reloj de pantalla de bloqueo
  g.font = "800 150px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(255,255,255,0.88)"; g.fillText("12:30", 0, -h / 2 + 390);
  g.font = "700 40px Figtree"; g.fillStyle = "rgba(255,255,255,0.7)"; g.fillText("martes 20 de octubre", 0, -h / 2 + 480);
  // el brillo de cristal
  const rg = g.createLinearGradient(sx, sy, sx + sw, sy + sh * 0.5); rg.addColorStop(0, "rgba(255,255,255,0.14)"); rg.addColorStop(0.4, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(sx, sy, sw, sh);
  if (brilla > 0.01) { g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,255,255,${0.2 * brilla})`; g.fillRect(sx, sy, sw, sh); }
  g.restore();
  // la cámara delantera
  g.beginPath(); g.arc(0, -h / 2 + 60, 17, 0, 6.2832); g.fillStyle = "#06070a"; g.fill();
  redondo(g, -w / 2 + 2, -h / 2 + 2, w - 4, h - 4, 98); g.strokeStyle = "rgba(255,255,255,0.3)"; g.lineWidth = 3; g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- las cosas que tocan
// Todas: la punta en (0,0), el cuerpo hacia +y (abajo). esc las agranda.
function sombraPunta(g, r, al) { if (al > 0.01) { g.save(); const sg = g.createRadialGradient(10, 14, 0, 10, 14, r); sg.addColorStop(0, `rgba(0,0,0,${0.5 * al})`); sg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sg; g.beginPath(); g.arc(10, 14, r, 0, 6.2832); g.fill(); g.restore(); } }

export function dedo(g, sombra = 1) {
  sombraPunta(g, 110, sombra);
  g.save();
  const w = 150, L = 1100;
  g.beginPath(); g.moveTo(-w / 2 - 12, L); g.lineTo(-w / 2, 80); g.arc(0, 80, w / 2, Math.PI, 0); g.lineTo(w / 2 + 12, L); g.closePath();
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, "#f7cfa8"); gr.addColorStop(0.45, "#f1b88c"); gr.addColorStop(1, "#c98a60");
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  g.strokeStyle = "rgba(150,90,60,0.35)"; g.lineWidth = 5; for (const y of [380, 410, 640, 668]) { g.beginPath(); g.moveTo(-w / 2, y); g.quadraticCurveTo(0, y + 14, w / 2, y); g.stroke(); }
  g.restore();
  // la uña
  redondo(g, -46, 38, 92, 120, 36); const ng = g.createLinearGradient(-46, 0, 46, 0); ng.addColorStop(0, "#fde9da"); ng.addColorStop(1, "#f0c8b4"); g.fillStyle = ng; g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(-16, 70, 10, 28, 0.1, 0, 6.2832); g.fill();
  g.restore();
}
export function boli(g, sombra = 1) {
  sombraPunta(g, 60, sombra);
  g.save();
  // la punta: una pieza cónica blanca con la bolita metálica
  g.beginPath(); g.moveTo(0, 0); g.lineTo(-17, 120); g.lineTo(17, 120); g.closePath();
  const cg = g.createLinearGradient(-17, 0, 17, 0); cg.addColorStop(0, "#fff"); cg.addColorStop(1, "#aab"); g.fillStyle = cg; g.fill();
  g.beginPath(); g.arc(0, 4, 6, 0, 6.2832); g.fillStyle = "#6a6e7a"; g.fill();
  // el cuerpo de plástico azul
  g.beginPath(); g.moveTo(-17, 120); g.lineTo(-30, 220); g.lineTo(-30, 1050); g.lineTo(30, 1050); g.lineTo(30, 220); g.lineTo(17, 120); g.closePath();
  const bg = g.createLinearGradient(-30, 0, 30, 0); bg.addColorStop(0, "#3a7aff"); bg.addColorStop(0.35, "#7ab4ff"); bg.addColorStop(0.7, "#2a5ae0"); bg.addColorStop(1, "#1a3aa0"); g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)"; g.fillRect(-18, 240, 8, 760);
  g.fillStyle = "#fff"; g.fillRect(-30, 205, 60, 18);
  // el clip
  redondo(g, 22, 780, 22, 270, 9); g.fillStyle = "#cfd6e6"; g.fill();
  g.restore();
}
export function salchicha(g, sombra = 1) {
  sombraPunta(g, 100, sombra);
  g.save();
  const w = 150, L = 1000;
  redondo(g, -w / 2, -30, w, L + 30, 74);
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, "#f09070"); gr.addColorStop(0.3, "#e0644a"); gr.addColorStop(0.7, "#c04630"); gr.addColorStop(1, "#8a2a1c");
  g.fillStyle = gr; g.fill();
  g.save(); redondo(g, -w / 2, -30, w, L + 30, 74); g.clip();
  g.strokeStyle = "rgba(80,20,10,0.4)"; g.lineWidth = 12; g.lineCap = "round"; for (let y = 120; y < 900; y += 150) { g.beginPath(); g.moveTo(-w / 2 + 14, y); g.lineTo(w / 2 - 14, y + 44); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.4)"; g.beginPath(); g.ellipse(-36, 220, 12, 190, 0, 0, 6.2832); g.fill();
  g.restore();
  g.restore();
}
export function guante(g, sombra = 1) {
  sombraPunta(g, 120, sombra);
  g.save();
  const w = 190, L = 1100;
  g.beginPath(); g.moveTo(-w / 2 - 20, L); g.lineTo(-w / 2, 90); g.arc(0, 90, w / 2, Math.PI, 0); g.lineTo(w / 2 + 20, L); g.closePath();
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, "#7a9aff"); gr.addColorStop(0.45, "#4a6ae0"); gr.addColorStop(1, "#2a3aa0"); g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  g.strokeStyle = "rgba(20,30,110,0.5)"; g.lineWidth = 6; g.lineCap = "round"; g.lineJoin = "round";
  for (let y = 10; y < L; y += 30) for (let x = -w / 2 - 20; x < w / 2 + 20; x += 24) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 12, y + 18); g.lineTo(x + 24, y); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(-w / 2, 0, 36, L);
  // el puño, más gordo y de otro color
  g.fillStyle = "#ffd24a"; g.fillRect(-w, 760, w * 2, 130);
  g.strokeStyle = "rgba(120,80,0,0.5)"; g.lineWidth = 6; for (let x = -w; x < w; x += 16) { g.beginPath(); g.moveTo(x, 760); g.lineTo(x, 890); g.stroke(); }
  g.restore();
  g.restore();
}
export function lapiz(g, sombra = 1) {
  sombraPunta(g, 80, sombra);
  g.save();
  // el cuerpo, de metal oscuro
  g.beginPath(); g.moveTo(-26, 250); g.lineTo(-30, 1050); g.lineTo(30, 1050); g.lineTo(26, 250); g.closePath();
  const bg = g.createLinearGradient(-30, 0, 30, 0); bg.addColorStop(0, "#5a5f70"); bg.addColorStop(0.4, "#9aa0b4"); bg.addColorStop(1, "#2a2d38"); g.fillStyle = bg; g.fill();
  // el aro de plata
  g.fillStyle = "#dfe4f0"; g.fillRect(-30, 230, 60, 26);
  // la punta: un disco de goma negra conductora, mate
  g.beginPath(); g.moveTo(-26, 230); g.lineTo(-36, 110); g.arc(0, 40, 40, Math.PI * 0.85, Math.PI * 0.15, true); g.lineTo(36, 110); g.lineTo(26, 230); g.closePath();
  const tg = g.createRadialGradient(-12, 20, 4, 0, 60, 80); tg.addColorStop(0, "#4a4a52"); tg.addColorStop(1, "#08080a"); g.fillStyle = tg; g.fill();
  g.beginPath(); g.arc(0, 40, 38, Math.PI, 0); g.fillStyle = tg; g.fill();
  g.restore();
}
export const COSAS = { dedo, boli, salchicha, guante, lapiz };

// Pone una cosa con la punta en (x, y), girada rot, a escala esc, a h de altura (0 = tocando; sube y se agranda un poco)
export function pon(g, cosa, x, y, rot, esc, h = 0) {
  g.save(); g.translate(x + 40 * h, y + 90 * h);
  const s = esc * (1 + 0.16 * h); g.rotate(rot); g.scale(s, s);
  COSAS[cosa](g, 1 - Math.min(1, h * 1.2));
  g.restore();
}

// ---------------------------------------------------------------- lo que pasa en la pantalla al tocar
// Una ráfaga de luz: anillos de colores que se abren y chispas. u: segundos desde el toque.
const COLS = ["80,220,255", "255,90,200", "255,230,90", "120,255,160"];
export function rafaga(g, x, y, u, esc = 1) {
  if (u < 0 || u > 1.5) return;
  g.save(); g.globalCompositeOperation = "lighter";
  const fl = Math.exp(-u * 5);
  k.brillo(g, x, y, 900 * esc, "255,255,255", 0.8 * fl);
  for (let i = 0; i < 4; i++) {
    const uu = u - i * 0.07; if (uu < 0) continue;
    const r = (60 + 760 * (1 - Math.exp(-uu * 2.6))) * esc, a = Math.exp(-uu * 2.2);
    g.strokeStyle = `rgba(${COLS[i]},${0.9 * a})`; g.lineWidth = (46 - i * 8) * Math.exp(-uu * 1.3) * esc + 3;
    g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.stroke();
  }
  const az = azar(17);
  for (let i = 0; i < 26; i++) { const a = az() * 6.2832, d = (160 + 520 * az()) * (1 - Math.exp(-u * 3)) * esc, s = 3 + 6 * az(); g.fillStyle = `rgba(${COLS[i % 4]},${0.9 * Math.exp(-u * 2.4)})`; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, s, 0, 6.2832); g.fill(); }
  g.restore();
}
// Un toque que no pasa nada: una nubecilla gris y una cruz roja
export function nada(g, x, y, u, esc = 1) {
  if (u < 0 || u > 1.4) return;
  g.save();
  const a = Math.exp(-u * 2.2);
  g.fillStyle = `rgba(200,200,215,${0.5 * a})`; g.beginPath(); g.arc(x, y, (30 + 90 * (1 - Math.exp(-u * 3))) * esc, 0, 6.2832); g.fill();
  const pop = su(tr(u, 0, 0.12)) * (1 - su(tr(u, 0.9, 1.3))), sh = Math.sin(u * 60) * 8 * Math.exp(-u * 4);
  if (pop > 0.01) {
    g.translate(x + sh, y - 150 * esc); g.scale(pop * esc, pop * esc);
    g.beginPath(); g.arc(0, 0, 70, 0, 6.2832); g.fillStyle = "#ff3a3a"; g.fill(); g.lineWidth = 8; g.strokeStyle = "#fff"; g.stroke();
    g.lineCap = "round"; g.strokeStyle = "#fff"; g.lineWidth = 16; g.beginPath(); g.moveTo(-28, -28); g.lineTo(28, 28); g.moveTo(28, -28); g.lineTo(-28, 28); g.stroke();
  }
  g.restore();
}
export function visto(g, x, y, u, esc = 1) {
  if (u < 0 || u > 3) return;
  const pop = su(tr(u, 0, 0.15));
  if (pop <= 0.01) return;
  g.save(); g.translate(x, y - 150 * esc); g.scale(pop * esc, pop * esc);
  g.beginPath(); g.arc(0, 0, 70, 0, 6.2832); g.fillStyle = "#22c070"; g.fill(); g.lineWidth = 8; g.strokeStyle = "#fff"; g.stroke();
  g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#fff"; g.lineWidth = 18; g.beginPath(); g.moveTo(-30, 2); g.lineTo(-8, 26); g.lineTo(32, -24); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- el gancho: el móvil con un dedo, un bolígrafo y una salchicha
// (se usa en el primer plano y, al final, vuelve a entrar para que el último fotograma lleve al primero)
const P1 = [-110, 120], P2 = [150, -140], PB1 = [-70, 280], PB2 = [-20, 190], PS = [100, 60];
const kx = (L) => k.claves(L);
const dedoX = kx([[-0.3, P1[0]], [0.6, P1[0]], [1.0, P1[0]], [1.6, P2[0]], [2.05, P2[0]], [2.6, P2[0]], [3.1, P2[0] + 300]]);
const dedoY = kx([[-0.3, P1[1]], [0.6, P1[1]], [1.0, P1[1] - 50], [1.6, P2[1] - 40], [2.05, P2[1]], [2.6, P2[1]], [3.1, P2[1] + 500]]);
const dedoH = kx([[-0.3, 0], [0.5, 0], [1.0, 0.9], [1.6, 0.9], [2.05, 0], [2.5, 0], [3.1, 2.0]]);
const boliX = kx([[2.7, PB1[0] - 200], [3.35, PB1[0]], [3.55, PB1[0]], [3.85, PB2[0]], [4.5, PB2[0] - 300]]);
const boliY = kx([[2.7, PB1[1] + 300], [3.35, PB1[1]], [3.55, PB1[1] - 30], [3.85, PB2[1]], [4.5, PB2[1] + 500]]);
const boliH = kx([[2.7, 2.0], [3.35, 0], [3.55, 0.55], [3.85, 0], [4.5, 2.0]]);
const salX = kx([[4.2, PS[0] + 250], [5.2, PS[0] + 20], [5.75, PS[0]], [7.2, PS[0]]]);
const salY = kx([[4.2, PS[1] + 600], [5.2, PS[1] + 80], [5.75, PS[1]], [7.2, PS[1]]]);
const salH = kx([[4.2, 2.2], [5.2, 0.5], [5.75, 0], [7.2, 0]]);
export function gancho(g, t) {
  const fondo = g.createLinearGradient(0, -960, 0, 960); fondo.addColorStop(0, "#14083a"); fondo.addColorStop(1, "#3a0a4a"); g.fillStyle = fondo; g.fillRect(-700, -1100, 1400, 2200);
  k.brillo(g, 0, 0, 2000, "120,60,255", 0.3);
  const brilla = Math.max(k.pulso(t, 0.05, 0.12), k.pulso(t, 2.1, 0.12), k.pulso(t, 5.8, 0.15));
  g.save(); g.translate(0, 40);
  movil(g, t, { brilla });
  rafaga(g, P1[0], P1[1], t + 0.05, 1);
  rafaga(g, P2[0], P2[1], t - 2.05, 1);
  nada(g, PB1[0], PB1[1], t - 3.35, 1); nada(g, PB2[0], PB2[1], t - 3.85, 1);
  rafaga(g, PS[0], PS[1], t - 5.75, 1.35);
  if (t < 3.1) pon(g, "dedo", dedoX(t), dedoY(t), -0.32, 1.0, Math.max(0, dedoH(t)));
  if (t > 2.7 && t < 4.5) pon(g, "boli", boliX(t), boliY(t), 0.38, 1.1, Math.max(0, boliH(t)));
  if (t > 4.2) pon(g, "salchicha", salX(t), salY(t), -0.28, 1.05, Math.max(0, salH(t)));
  g.restore();
}

// ---------------------------------------------------------------- el corte de la pantalla por dentro (de lado)
// Lo comparten el plano del dedo y el del final. El cristal arriba (su cara de arriba en y = 0), los dos electrodos debajo.
export const EL = { xTX: -170, xRX: 170, y: 120 };
const LINEAS = [60, 110, 170, 240, 330];
// El campo entre los electrodos: arcos que suben por el cristal hacia fuera. e: cuánto se lo lleva algo conductor (0 a 1),
// que está en (fx, fy) (la punta del dedo). dash: el movimiento.
export function campo(g, t, e = 0, fx = 0, fy = -60, al = 1) {
  g.save(); g.lineCap = "round"; g.globalCompositeOperation = "lighter";
  LINEAS.forEach((h, i) => {
    const alto = h * 1.0, capt = i >= 2 ? e * (0.5 + 0.25 * i) : 0;     // las líneas altas son las que el dedo se lleva
    const tx = EL.xTX, rx = EL.xRX, y0 = EL.y - 4;
    const col = i % 2 ? "255,230,120" : "120,230,255";
    g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 18;
    g.setLineDash([22, 18]); g.lineDashOffset = -t * 90;
    const dibuja = (a, f) => { g.strokeStyle = `rgba(${col},${a * al})`; g.lineWidth = f; };
    // el arco que sigue de un electrodo al otro
    if (1 - Math.min(1, capt) > 0.02) { dibuja(0.9 * (1 - Math.min(1, capt)), 8); g.beginPath(); g.moveTo(tx, y0); g.bezierCurveTo(tx + 30, y0 - alto * 1.5, rx - 30, y0 - alto * 1.5, rx, y0); g.stroke(); }
    // los dos arcos que se van al dedo
    if (capt > 0.02) {
      dibuja(0.9 * Math.min(1, capt), 8);
      g.beginPath(); g.moveTo(tx, y0); g.bezierCurveTo(tx + 20, y0 - alto * 1.2, fx - 60, fy + 60, fx - 24 + i * 6, fy + 20); g.stroke();
      g.beginPath(); g.moveTo(rx, y0); g.bezierCurveTo(rx - 20, y0 - alto * 1.2, fx + 60, fy + 60, fx + 24 - i * 6, fy + 20); g.stroke();
    }
  });
  g.setLineDash([]); g.shadowBlur = 0;
  g.restore();
}
// El corte: el cristal, los dos electrodos y la pantalla debajo. lat: la mitad del ancho.
export function corte(g, t, o = {}) {
  const { carga = 1 } = o;
  const L = 520;
  // la pantalla de debajo (píxeles)
  g.save(); redondo(g, -L, EL.y + 40, L * 2, 200, 24); const dg = g.createLinearGradient(0, EL.y + 40, 0, EL.y + 240); dg.addColorStop(0, "#2a1670"); dg.addColorStop(1, "#14083a"); g.fillStyle = dg; g.fill();
  g.clip(); for (let x = -L; x < L; x += 16) { g.fillStyle = ["rgba(255,60,100,0.5)", "rgba(60,255,120,0.5)", "rgba(80,120,255,0.5)"][((x + L) / 16) % 3]; g.fillRect(x, EL.y + 70, 10, 130); }
  g.restore();
  // los electrodos
  for (const [x, col, cc] of [[EL.xTX, "#2ab8ff", "120,220,255"], [EL.xRX, "#ff5ac8", "255,110,210"]]) {
    g.save(); redondo(g, x - 70, EL.y - 8, 140, 52, 12); g.fillStyle = col; g.shadowColor = `rgba(${cc},0.9)`; g.shadowBlur = 30; g.fill(); g.restore();
    g.fillStyle = "#fff"; g.font = "800 40px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(x < 0 ? "+" : "−", x, EL.y + 20);
  }
  // el cristal, translúcido
  g.save(); redondo(g, -L, -4, L * 2, EL.y - 8, 20); const gg = g.createLinearGradient(0, 0, 0, EL.y); gg.addColorStop(0, "rgba(190,230,255,0.38)"); gg.addColorStop(1, "rgba(120,180,255,0.22)"); g.fillStyle = gg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 5; g.beginPath(); g.moveTo(-L + 20, -2); g.lineTo(L - 20, -2); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.moveTo(-L + 60, 6); g.lineTo(-L + 200, 6); g.lineTo(-L + 150, EL.y - 14); g.lineTo(-L + 10, EL.y - 14); g.closePath(); g.fill();
  g.restore();
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
