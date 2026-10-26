// Lo que comparten los planos: la moneda de oro de Cleopatra (su perfil, como en sus monedas), la Luna, la Gran
// Pirámide (de noche, forrada de blanco; de día, como hoy) y el camino del tiempo que las une.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar } = k;

// ---------------------------------------------------------------- las cuentas (idea.md)
export const TOTAL = 4528;                 // de la pirámide (2560 a. C.) a la Luna (1969)
export const F_CLEO = 2491 / TOTAL;        // nace Cleopatra (69 a. C.)

// ---------------------------------------------------------------- el camino del tiempo (coordenadas del mundo de noche)
export const APICE = [540, 1190], BL = [285, 1530], BR = [750, 1530], BK = [850, 1468];
export const LUNA = [540, 600], RLUNA = 110;
export const Y0 = APICE[1], Y1 = LUNA[1] + RLUNA;          // la cinta: de la punta de la pirámide a la Luna
export const yDe = (f) => mez(Y0, Y1, f);                   // f: fracción del camino (0 pirámide, 1 Luna)
export const YCLEO = yDe(F_CLEO), RMONEDA = 60;

// Una cámara 2D: centro (cx, cy) del mundo en el centro de la pantalla, con zoom z.
export const pon = (g, c) => g.setTransform(c.z, 0, 0, c.z, 540 - c.cx * c.z, 960 - c.cy * c.z);
export const aPantalla = (c, x, y) => ({ x: 540 + (x - c.cx) * c.z, y: 960 + (y - c.cy) * c.z });

// ---------------------------------------------------------------- la moneda de Cleopatra
const SM = 640;
function perfil(c, R) {
  // de perfil, mirando a la derecha: la frente, la nariz marcada de sus monedas, la boca, la barbilla, el cuello y el
  // moño en la nuca
  const P = [[0.16, -0.6], [0.31, -0.45], [0.36, -0.27], [0.37, -0.2], [0.47, -0.03], [0.48, 0.01], [0.4, 0.05], [0.42, 0.1],
    [0.38, 0.135], [0.41, 0.17], [0.39, 0.22], [0.37, 0.3], [0.27, 0.36], [0.22, 0.4], [0.25, 0.72], [-0.2, 0.72], [-0.15, 0.44],
    [-0.3, 0.38], [-0.5, 0.3], [-0.56, 0.12], [-0.48, -0.02], [-0.42, -0.25], [-0.27, -0.48], [-0.05, -0.62]].map(([x, y]) => [x * R, y * R]);
  c.beginPath();
  const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let q = m(P[P.length - 1], P[0]); c.moveTo(q[0], q[1]);
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], mm = m(a, b); c.quadraticCurveTo(a[0], a[1], mm[0], mm[1]); }
  c.closePath();
}
function caraMoneda() {
  const l = k.lienzo(SM), c = l.getContext("2d"), R = SM / 2 - 4;
  c.translate(SM / 2, SM / 2);
  const oro = (c, r0) => { const gr = c.createRadialGradient(-0.4 * R, -0.45 * R, r0, 0, 0, R * 1.05); gr.addColorStop(0, "#fff4b8"); gr.addColorStop(0.35, "#f0c04e"); gr.addColorStop(0.75, "#b37a1d"); gr.addColorStop(1, "#6a420d"); return gr; };
  c.beginPath(); c.arc(0, 0, R, 0, 6.2832); c.fillStyle = oro(c, 10); c.fill();
  c.save(); c.clip();
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.35; c.drawImage(k.red, -R, -R, 2 * R, 2 * R);
  c.globalAlpha = 0.25; c.drawImage(k.manchas, -R, -R, 2 * R, 2 * R);
  c.restore();
  // el borde, levantado
  c.lineWidth = R * 0.07; c.strokeStyle = "rgba(90,55,10,0.75)"; c.beginPath(); c.arc(0, 0, R * 0.93, 0, 6.2832); c.stroke();
  c.lineWidth = R * 0.025; c.strokeStyle = "rgba(255,240,180,0.7)"; c.beginPath(); c.arc(-R * 0.01, -R * 0.015, R * 0.955, 3.4, 5.6); c.stroke();
  // las perlas de alrededor
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * 6.2832, x = Math.cos(a) * R * 0.84, y = Math.sin(a) * R * 0.84, rr = R * 0.022;
    c.fillStyle = "rgba(80,48,8,0.7)"; c.beginPath(); c.arc(x + rr * 0.4, y + rr * 0.5, rr, 0, 6.2832); c.fill();
    c.fillStyle = "rgba(255,236,160,0.95)"; c.beginPath(); c.arc(x - rr * 0.2, y - rr * 0.2, rr * 0.8, 0, 6.2832); c.fill();
  }
  // el retrato, en relieve: sombra abajo a la derecha, luz arriba a la izquierda
  const r = R * 0.95;
  c.save(); c.translate(R * 0.035, R * 0.045); perfil(c, r); c.fillStyle = "rgba(70,38,4,0.85)"; c.fill(); c.restore();
  c.save(); c.translate(-R * 0.02, -R * 0.025); perfil(c, r); c.fillStyle = "rgba(255,246,200,0.9)"; c.fill(); c.restore();
  perfil(c, r); const gp = c.createLinearGradient(-0.5 * R, -0.6 * R, 0.5 * R, 0.7 * R); gp.addColorStop(0, "#ffe68a"); gp.addColorStop(0.5, "#e2a93b"); gp.addColorStop(1, "#9a6516"); c.fillStyle = gp; c.fill();
  c.save(); perfil(c, r); c.clip();
  // el pelo: toda la cabeza por detrás de la frente, más oscuro y en gajos
  c.beginPath(); c.moveTo(0.3 * r, -0.75 * r); c.quadraticCurveTo(0.2 * r, -0.32 * r, 0.12 * r, -0.12 * r); c.quadraticCurveTo(0.0, 0.12 * r, -0.12 * r, 0.42 * r); c.lineTo(-0.9 * r, 0.6 * r); c.lineTo(-0.9 * r, -0.9 * r); c.closePath();
  const gh = c.createLinearGradient(-0.5 * r, -0.6 * r, 0.2 * r, 0.4 * r); gh.addColorStop(0, "#f2c860"); gh.addColorStop(1, "#8d5a12"); c.fillStyle = gh; c.fill();
  // el pelo en gajos (el peinado «de melón» de sus retratos), hacia el moño
  c.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const y0 = -0.58 + i * 0.075, x0 = 0.2 - i * 0.02;
    c.beginPath(); c.moveTo(x0 * r, y0 * r); c.quadraticCurveTo(-0.15 * r, (y0 + 0.05) * r, -0.4 * r, (0.12 + i * 0.012) * r);
    c.lineWidth = r * 0.03; c.strokeStyle = "rgba(110,62,8,0.55)"; c.stroke();
    c.beginPath(); c.moveTo((x0 - 0.01) * r, (y0 - 0.012) * r); c.quadraticCurveTo(-0.16 * r, (y0 + 0.035) * r, -0.41 * r, (0.105 + i * 0.012) * r);
    c.lineWidth = r * 0.012; c.strokeStyle = "rgba(255,240,180,0.55)"; c.stroke();
  }
  // el moño
  c.beginPath(); c.arc(-0.42 * r, 0.16 * r, 0.12 * r, 0, 6.2832); c.lineWidth = r * 0.025; c.strokeStyle = "rgba(110,62,8,0.6)"; c.stroke();
  c.beginPath(); c.arc(-0.42 * r, 0.16 * r, 0.06 * r, 0, 6.2832); c.stroke();
  // la diadema: una cinta ancha sobre el pelo
  c.beginPath(); c.moveTo(0.2 * r, -0.55 * r); c.quadraticCurveTo(-0.05 * r, -0.32 * r, -0.32 * r, -0.06 * r);
  c.lineWidth = r * 0.07; c.strokeStyle = "rgba(120,70,10,0.65)"; c.stroke();
  c.lineWidth = r * 0.035; c.strokeStyle = "rgba(255,238,170,0.75)"; c.stroke();
  // la cara lisa, el ojo, la oreja
  const gc = c.createRadialGradient(0.3 * r, -0.12 * r, 0, 0.3 * r, -0.05 * r, 0.3 * r); gc.addColorStop(0, "rgba(255,240,170,0.5)"); gc.addColorStop(1, "rgba(255,240,170,0)");
  c.fillStyle = gc; c.fillRect(0, -0.5 * r, 0.6 * r, 0.8 * r);
  c.beginPath(); c.ellipse(0.27 * r, -0.17 * r, 0.05 * r, 0.025 * r, -0.15, 0, 6.2832); c.fillStyle = "rgba(100,58,8,0.75)"; c.fill();
  c.beginPath(); c.arc(0.06 * r, -0.06 * r, 0.06 * r, -1.2, 2.2); c.lineWidth = r * 0.02; c.strokeStyle = "rgba(110,62,8,0.6)"; c.stroke();
  c.restore();
  // brillo general
  const gb = c.createRadialGradient(-0.45 * R, -0.5 * R, 0, -0.45 * R, -0.5 * R, R * 0.9); gb.addColorStop(0, "rgba(255,255,230,0.35)"); gb.addColorStop(1, "rgba(255,255,230,0)");
  c.globalCompositeOperation = "screen"; c.fillStyle = gb; c.beginPath(); c.arc(0, 0, R, 0, 6.2832); c.fill();
  return l;
}
export const CARA = caraMoneda();

// La moneda en (x, y), de radio r, girada ang (0: de frente). brilla: cuánto luce.
export function moneda(g, x, y, r, ang = 0, brilla = 0) {
  const c = Math.cos(ang), s = Math.sin(ang), w = Math.max(0.04, Math.abs(c)), grosor = r * 0.11;
  g.save();
  // la sombra suave
  k.brillo(g, x, y, r * 3.2, "255,190,80", 0.25 + 0.4 * brilla);
  // el canto
  const dx = -s * grosor * Math.sign(c || 1);
  g.beginPath(); g.ellipse(x + dx, y, r * w + Math.abs(s) * grosor * 0.4, r, 0, 0, 6.2832);
  const gk = g.createLinearGradient(x - r, 0, x + r, 0); gk.addColorStop(0, "#6a420d"); gk.addColorStop(0.5, "#d39a32"); gk.addColorStop(1, "#5a360a");
  g.fillStyle = gk; g.fill();
  // la cara
  g.translate(x, y); g.scale(w * (c < 0 ? -1 : 1), 1);
  g.drawImage(CARA, -r, -r, 2 * r, 2 * r);
  // el reflejo que corre al girar
  g.globalCompositeOperation = "lighter";
  const rx = -r * 0.9 + ((ang * 0.5) % 1 + 1) % 1 * 1.8 * r;
  const gr = g.createLinearGradient(rx - r * 0.35, -r, rx + r * 0.35, r); gr.addColorStop(0, "rgba(255,240,190,0)"); gr.addColorStop(0.5, `rgba(255,240,190,${0.18 + 0.25 * brilla})`); gr.addColorStop(1, "rgba(255,240,190,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- la Luna
const SL = 900;
function caraLuna() {
  const l = k.lienzo(SL), c = l.getContext("2d"), R = SL / 2 - 2, az = azar(7171);
  c.translate(SL / 2, SL / 2);
  const gr = c.createRadialGradient(-0.3 * R, -0.35 * R, R * 0.05, 0, 0, R); gr.addColorStop(0, "#fbfaf4"); gr.addColorStop(0.6, "#d9d8d2"); gr.addColorStop(1, "#8f8f92");
  c.beginPath(); c.arc(0, 0, R, 0, 6.2832); c.fillStyle = gr; c.fill();
  c.save(); c.clip();
  // los mares: manchas oscuras grandes
  c.globalCompositeOperation = "multiply";
  for (const [x, y, rr] of [[-0.25, -0.3, 0.32], [0.2, -0.15, 0.25], [0.05, 0.25, 0.3], [-0.4, 0.15, 0.2], [0.35, 0.3, 0.15]]) {
    const m = c.createRadialGradient(x * R, y * R, 0, x * R, y * R, rr * R); m.addColorStop(0, "rgba(150,152,165,0.6)"); m.addColorStop(0.7, "rgba(185,185,195,0.35)"); m.addColorStop(1, "rgba(200,200,205,0)");
    c.fillStyle = m; c.fillRect(-R, -R, 2 * R, 2 * R);
  }
  c.globalAlpha = 0.22; c.drawImage(k.manchas, -R, -R, 2 * R, 2 * R);
  c.globalAlpha = 0.2; c.drawImage(k.red, -R, -R, 2 * R, 2 * R);
  c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  // cráteres
  for (let i = 0; i < 70; i++) {
    const a = az() * 6.2832, d = Math.sqrt(az()) * R * 0.95, x = Math.cos(a) * d, y = Math.sin(a) * d, rr = R * (0.012 + Math.pow(az(), 3) * 0.07);
    c.fillStyle = "rgba(90,90,98,0.35)"; c.beginPath(); c.arc(x + rr * 0.15, y + rr * 0.15, rr, 0, 6.2832); c.fill();
    c.strokeStyle = "rgba(255,255,250,0.35)"; c.lineWidth = rr * 0.22; c.beginPath(); c.arc(x, y, rr, 2.2, 5.6); c.stroke();
  }
  // el lado de la sombra
  const sh = c.createRadialGradient(-0.35 * R, -0.35 * R, R * 0.6, -0.1 * R, -0.1 * R, R * 1.25); sh.addColorStop(0, "rgba(0,0,20,0)"); sh.addColorStop(1, "rgba(0,0,20,0.35)");
  c.fillStyle = sh; c.fillRect(-R, -R, 2 * R, 2 * R);
  c.restore();
  return l;
}
export const CARA_LUNA = caraLuna();
export function luna(g, x, y, r, brilla = 0) {
  k.brillo(g, x, y, r * 5.5, "200,220,255", 0.55 + 0.4 * brilla);
  g.drawImage(CARA_LUNA, x - r, y - r, 2 * r, 2 * r);
  if (brilla > 0) { g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.25 * brilla; g.drawImage(CARA_LUNA, x - r, y - r, 2 * r, 2 * r); g.restore(); }
}
// La huella de una bota en el polvo, centrada en (x, y), de largo L, hundiéndose (u de 0 a 1).
export function huella(g, x, y, L, u, ang = -0.35) {
  if (u <= 0) return;
  g.save(); g.translate(x, y); g.rotate(ang);
  const W = L * 0.42;
  const forma = () => { g.beginPath(); g.ellipse(0, -L * 0.18, W * 0.5, L * 0.32, 0, 0, 6.2832); g.ellipse(0, L * 0.28, W * 0.42, L * 0.22, 0, 0, 6.2832); g.rect(-W * 0.44, -L * 0.15, W * 0.88, L * 0.45); };
  g.globalAlpha = u;
  // el borde levantado, con luz
  g.save(); g.translate(-L * 0.012, -L * 0.02); forma(); g.fillStyle = "rgba(255,255,250,0.6)"; g.fill(); g.restore();
  forma(); g.fillStyle = "rgba(70,70,80,0.75)"; g.fill();
  g.save(); forma(); g.clip();
  // las estrías de la suela
  for (let i = -9; i <= 9; i++) { const yy = i * L * 0.052; g.fillStyle = "rgba(30,30,38,0.65)"; g.fillRect(-W * 0.5, yy - L * 0.012, W, L * 0.024); g.fillStyle = "rgba(150,150,160,0.45)"; g.fillRect(-W * 0.5, yy + L * 0.012, W, L * 0.012); }
  const sh = g.createLinearGradient(-W, -L, W, L); sh.addColorStop(0, "rgba(0,0,0,0.45)"); sh.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sh; g.fillRect(-W, -L, 2 * W, 2 * L);
  g.restore();
  g.restore();
}

// ---------------------------------------------------------------- la Gran Pirámide
// p: { A, BL, BR, BK } (la punta y las tres esquinas de la base que se ven). o.forro: hasta dónde (0-1 del alto) está
// forrada de blanco; o.punta: 0 sin su punta, 1 puesta; o.puntaDy: lo que le falta para bajar; o.dia: luz del sol
// (de la derecha) en vez de la Luna; o.brillo: un reflejo que recorre la cara (posición 0-1); o.rota: la cima gastada.
const lp = (a, b, u) => [mez(a[0], b[0], u), mez(a[1], b[1], u)];
export function piramide(g, p, o = {}) {
  const { A, BL: L, BR: R, BK: K } = p;
  const forro = o.forro ?? 1, dia = !!o.dia, punta = o.punta ?? 1, rota = o.rota ?? 0;
  const tope = 1 - 0.075 * (1 - punta) - 0.06 * rota;     // hasta dónde llega el cuerpo (sin la punta)
  const caras = [
    { pts: [L, R], luz: dia ? ["#e8c88e", "#b98d52"] : ["#c9d6ec", "#7d8aa8"], forroC: dia ? ["#efe4cc", "#bfa982"] : ["#e8eefb", "#9aa6c4"], piedra: dia ? ["#d7ae6e", "#a87b42"] : ["#8a8aa0", "#4e5068"] },
    { pts: [R, K], luz: dia ? ["#ffe2a6", "#e0b06a"] : ["#7f8cab", "#454e6c"], forroC: dia ? ["#fffdf6", "#efe2c4"] : ["#a9b4d0", "#5b6684"], piedra: dia ? ["#edc27e", "#c4924c"] : ["#5e6078", "#33354a"] },
  ];
  for (const cara of caras) {
    const [a, b] = cara.pts, ta = lp(a, A, tope), tb = lp(b, A, tope);
    g.save();
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(tb[0], tb[1]); g.lineTo(ta[0], ta[1]); g.closePath(); g.clip();
    // la piedra de debajo, en escalones
    let gr = g.createLinearGradient(0, A[1], 0, a[1]); gr.addColorStop(0, cara.piedra[0]); gr.addColorStop(1, cara.piedra[1]);
    g.fillStyle = gr; g.fillRect(-2000, -2000, 6000, 6000);
    const N = 34;
    for (let i = 1; i < N; i++) {
      const u = i / N; if (u > tope) break;
      const p0 = lp(a, A, u), p1 = lp(b, A, u);
      g.strokeStyle = dia ? "rgba(110,70,30,0.55)" : "rgba(20,20,40,0.5)"; g.lineWidth = Math.max(1, (a[1] - A[1]) / N * 0.22);
      g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
      g.strokeStyle = dia ? "rgba(255,236,190,0.35)" : "rgba(200,210,240,0.15)"; g.lineWidth *= 0.5;
      g.beginPath(); g.moveTo(p0[0], p0[1] - (a[1] - A[1]) / N * 0.22); g.lineTo(p1[0], p1[1] - (a[1] - A[1]) / N * 0.22); g.stroke();
      // las juntas entre bloque y bloque, alternadas
      const q0 = lp(a, A, (i - 1) / N), q1 = lp(b, A, (i - 1) / N), M = 16;
      g.strokeStyle = dia ? "rgba(110,70,30,0.4)" : "rgba(20,20,40,0.35)"; g.lineWidth = Math.max(0.8, (a[1] - A[1]) / N * 0.12);
      g.beginPath();
      for (let j = 0; j < M; j++) { const f = (j + (i % 2) * 0.5) / M; const s0 = lp(q0, q1, f), s1 = lp(p0, p1, f); g.moveTo(s0[0], s0[1]); g.lineTo(s1[0], s1[1]); }
      g.stroke();
    }
    g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22;
    const bx = Math.min(a[0], b[0], A[0]), by = A[1], bw = Math.abs(b[0] - a[0]) + 400, bh = a[1] - A[1] + 100;
    g.drawImage(k.manchas, bx - 50, by - 50, bw, bh); g.globalAlpha = 0.3; g.drawImage(k.red, bx - 50, by - 50, bw, bh);
    g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    // el forro blanco pulido, de la base hasta «forro»
    if (forro > 0) {
      const fa = lp(a, A, forro), fb = lp(b, A, forro);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(fb[0], fb[1]); g.lineTo(fa[0], fa[1]); g.closePath();
      gr = g.createLinearGradient(A[0], A[1], (a[0] + b[0]) / 2, a[1]); gr.addColorStop(0, cara.forroC[0]); gr.addColorStop(1, cara.forroC[1]);
      g.fillStyle = gr; g.fill();
      g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.05; g.drawImage(k.red2, bx - 50, by - 50, bw, bh); g.restore();
      // el borde de arriba del forro, mientras sube
      if (forro < 0.999) { g.strokeStyle = dia ? "rgba(255,255,255,0.9)" : "rgba(220,235,255,0.8)"; g.lineWidth = Math.max(2, (a[1] - A[1]) * 0.008); g.beginPath(); g.moveTo(fa[0], fa[1]); g.lineTo(fb[0], fb[1]); g.stroke(); }
    }
    // el reflejo que recorre la cara pulida
    if (o.brillo !== undefined && o.brillo > -0.5 && o.brillo < 1.5 && forro > 0.5) {
      const u = o.brillo, x0 = mez(Math.min(a[0], b[0]) - 300, Math.max(a[0], b[0]) + 300, u);
      g.globalCompositeOperation = "lighter";
      const sg = g.createLinearGradient(x0 - 200, A[1], x0 + 200, A[1] + 140); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, `rgba(255,252,240,${o.brilloAl ?? 0.5})`); sg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = sg; g.fillRect(-2000, -2000, 6000, 6000);
      g.globalCompositeOperation = "source-over";
    }
    g.restore();
  }
  // la arista de luz entre las dos caras y el borde de la base
  g.save();
  const tR = lp(R, A, tope);
  g.strokeStyle = dia ? "rgba(255,248,225,0.8)" : "rgba(220,232,255,0.55)"; g.lineWidth = Math.max(1.5, (R[1] - A[1]) * 0.006);
  g.beginPath(); g.moveTo(R[0], R[1]); g.lineTo(tR[0], tR[1]); g.stroke();
  g.restore();
  // la cima gastada: unas piedras sueltas
  if (rota > 0.01) {
    const tL = lp(L, A, tope), tK = lp(K, A, tope);
    g.save(); g.globalAlpha = rota; g.fillStyle = dia ? "#c79a5c" : "#555870";
    g.beginPath(); g.moveTo(tL[0], tL[1]); g.lineTo(mez(tL[0], tR[0], 0.3), tL[1] - (R[1] - A[1]) * 0.015); g.lineTo(mez(tL[0], tR[0], 0.6), tL[1] - (R[1] - A[1]) * 0.008); g.lineTo(tR[0], tR[1]); g.lineTo(tK[0], tK[1]); g.closePath(); g.fill();
    g.restore();
  }
  // la punta (el piramidión), que baja y encaja
  if (punta > 0) {
    const dy = o.puntaDy ?? 0, s = 0.075;
    const pL = lp(L, A, 1 - s), pR = lp(R, A, 1 - s), pK = lp(K, A, 1 - s);
    g.save(); g.translate(0, -dy); g.globalAlpha = Math.min(1, punta * 1.2);
    g.beginPath(); g.moveTo(pL[0], pL[1]); g.lineTo(pR[0], pR[1]); g.lineTo(A[0], A[1]); g.closePath();
    let gp = g.createLinearGradient(A[0], A[1], pL[0], pL[1]); gp.addColorStop(0, dia ? "#fffdf4" : "#f4f7ff"); gp.addColorStop(1, dia ? "#ece2cc" : "#aab4d2"); g.fillStyle = gp; g.fill();
    g.beginPath(); g.moveTo(pR[0], pR[1]); g.lineTo(pK[0], pK[1]); g.lineTo(A[0], A[1]); g.closePath();
    gp = g.createLinearGradient(A[0], A[1], pK[0], pK[1]); gp.addColorStop(0, dia ? "#ffffff" : "#b9c3df"); gp.addColorStop(1, dia ? "#f5edda" : "#6b7695"); g.fillStyle = gp; g.fill();
    g.restore();
  }
}

// ---------------------------------------------------------------- el desierto de noche, con su cielo
const azE = azar(4242);
const ESTRELLAS = Array.from({ length: 700 }, () => ({ x: -900 + azE() * 2900, y: -1400 + azE() * 2900, s: Math.pow(azE(), 3), f: azE() * 6.28 }));
export function cieloNoche(g, c, t) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 0, 0, 1920); gr.addColorStop(0, "#050a22"); gr.addColorStop(0.55, "#0d1640"); gr.addColorStop(1, "#2a2350");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  // las estrellas, con un poco de paralaje (se mueven menos que el mundo)
  const zs = 1 + (c.z - 1) * 0.18;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const e of ESTRELLAS) {
    const x = 540 + (e.x - c.cx * 0.3 - 378) * zs, y = 960 + (e.y - c.cy * 0.3 + 0) * zs * 0.9;
    if (x < -20 || x > 1100 || y < -20 || y > 1940) continue;
    const a = (0.35 + 0.65 * e.s) * (0.8 + 0.2 * Math.sin(t * 2 + e.f));
    g.fillStyle = `rgba(225,232,255,${a})`; const r = 0.8 + 2.2 * e.s; g.fillRect(x - r / 2, y - r / 2, r, r);
    if (e.s > 0.6) k.brillo(g, x, y, 18 + 20 * e.s, "200,215,255", 0.5 * e.s);
  }
  g.restore();
}
// Las dunas, en coordenadas del mundo.
export function dunas(g, dia = false) {
  const capa = (y0, amp, f, ph, c0, c1) => {
    g.beginPath(); g.moveTo(-1500, 3500); g.lineTo(-1500, y0);
    for (let x = -1500; x <= 2600; x += 40) g.lineTo(x, y0 + amp * Math.sin(x * f + ph) + amp * 0.4 * Math.sin(x * f * 2.7 + ph * 2));
    g.lineTo(2600, 3500); g.closePath();
    const gr = g.createLinearGradient(0, y0 - amp, 0, y0 + 600); gr.addColorStop(0, c0); gr.addColorStop(1, c1); g.fillStyle = gr; g.fill();
  };
  if (dia) {
    capa(1390, 22, 0.004, 1, "#e9c58a", "#c9995a");
    capa(1470, 30, 0.003, 2.5, "#e0b574", "#b9844a");
  } else {
    capa(1405, 18, 0.004, 1, "#3b3a5e", "#1d1b33");
    capa(1470, 26, 0.003, 2.5, "#4a4670", "#1a1830");
  }
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3;
  g.drawImage(k.manchas, -1500, 1380, 4100, 2100); g.restore();
}

// ---------------------------------------------------------------- la cinta de luz del tiempo
// oro y azul: cuánto está encendido cada tramo (0-1 de su largo), con su intensidad.
export function cinta(g, t, { oro = 1, azul = 1, alOro = 1, alAzul = 1, marcas = 0, flujo = 0 } = {}) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const tramo = (ya, yb, u, color, al) => {
    if (u <= 0 || al <= 0) return;
    const y1 = mez(ya, yb, u);
    for (const [w, a] of [[26, 0.12], [12, 0.3], [5, 0.95]]) { g.strokeStyle = `rgba(${color},${a * al})`; g.lineWidth = w; g.beginPath(); g.moveTo(540, ya); g.lineTo(540, y1); g.stroke(); }
  };
  tramo(Y0, YCLEO, oro, "255,196,90", alOro);
  tramo(YCLEO, Y1, azul, "130,190,255", alAzul);
  // las marcas de los siglos, de abajo arriba
  if (marcas > 0) {
    const n = Math.floor(TOTAL / 100);
    for (let i = 1; i <= n; i++) {
      const u = tr(marcas * (n + 4), i, i + 4); if (u <= 0) continue;
      const y = yDe((i * 100) / TOTAL), largo = i % 5 === 0 ? 26 : 14;
      g.strokeStyle = `rgba(255,240,210,${0.85 * u})`; g.lineWidth = i % 5 === 0 ? 3.5 : 2;
      g.beginPath(); g.moveTo(540 - largo * u, y); g.lineTo(540 + largo * u, y); g.stroke();
    }
  }
  // chispas que suben por la cinta
  if (flujo > 0) {
    const az = azar(99);
    for (let i = 0; i < 60; i++) {
      const v0 = az(), vel = 0.6 + az() * 0.8, u = ((v0 + t * vel) % 1 + 1) % 1, y = mez(Y0, Y1, u);
      k.brillo(g, 540 + (az() - 0.5) * 10, y, 16 + az() * 16, u < F_CLEO ? "255,200,110" : "150,200,255", 0.8 * flujo);
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- la máscara de oro de un faraón (para la avenida)
function mascara() {
  const W = 400, H = 520, l = k.lienzo(W, H), c = l.getContext("2d");
  const oro = (y0, y1) => { const gr = c.createLinearGradient(60, y0, 340, y1); gr.addColorStop(0, "#fff0a8"); gr.addColorStop(0.45, "#e7b444"); gr.addColorStop(1, "#8c5a12"); return gr; };
  // el nemes: el tocado a rayas que cae hasta los hombros
  const nemes = () => { c.beginPath(); c.moveTo(200, 30); c.bezierCurveTo(300, 30, 330, 110, 320, 190); c.lineTo(370, 470); c.lineTo(290, 480); c.lineTo(270, 300); c.lineTo(130, 300); c.lineTo(110, 480); c.lineTo(30, 470); c.lineTo(80, 190); c.bezierCurveTo(70, 110, 100, 30, 200, 30); c.closePath(); };
  nemes(); c.fillStyle = oro(30, 480); c.fill();
  c.save(); nemes(); c.clip();
  for (let i = 0; i < 26; i++) { const y = 40 + i * 18; c.fillStyle = "rgba(28,48,120,0.88)"; c.beginPath(); c.moveTo(0, y); c.quadraticCurveTo(200, y - 30 + i * 0.6, 400, y); c.lineTo(400, y + 8); c.quadraticCurveTo(200, y - 22 + i * 0.6, 0, y + 8); c.closePath(); c.fill(); }
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.35; c.drawImage(k.red, 0, 0, W, H);
  c.restore();
  // la cara
  const cara = () => { c.beginPath(); c.moveTo(135, 120); c.lineTo(265, 120); c.bezierCurveTo(272, 210, 262, 300, 200, 320); c.bezierCurveTo(138, 300, 128, 210, 135, 120); c.closePath(); };
  cara(); const gc = c.createRadialGradient(175, 170, 10, 200, 210, 140); gc.addColorStop(0, "#fff3b6"); gc.addColorStop(0.5, "#eab84a"); gc.addColorStop(1, "#9c6516"); c.fillStyle = gc; c.fill();
  // la frente con la banda y la cobra
  c.fillStyle = "#e9b84a"; c.fillRect(130, 110, 140, 16);
  c.beginPath(); c.moveTo(200, 70); c.quadraticCurveTo(214, 90, 204, 118); c.lineTo(196, 118); c.quadraticCurveTo(186, 90, 200, 70); c.fillStyle = "#ffe48a"; c.fill();
  // cejas y ojos con kohl
  for (const s of [-1, 1]) {
    const x = 200 + s * 34;
    c.strokeStyle = "#1c2f7a"; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(x - 24, 168); c.quadraticCurveTo(x, 158, x + 24 + s * 8, 168); c.stroke();
    c.fillStyle = "#fbf7ea"; c.beginPath(); c.ellipse(x, 188, 20, 9, 0, 0, 6.2832); c.fill();
    c.fillStyle = "#151515"; c.beginPath(); c.arc(x, 188, 7, 0, 6.2832); c.fill();
    c.strokeStyle = "#141414"; c.lineWidth = 4; c.beginPath(); c.ellipse(x, 188, 21, 10, 0, 0, 6.2832); c.stroke();
    c.beginPath(); c.moveTo(x + s * 20, 190); c.lineTo(x + s * 38, 184); c.stroke();
  }
  // nariz y boca
  c.strokeStyle = "rgba(120,70,10,0.7)"; c.lineWidth = 4; c.beginPath(); c.moveTo(200, 195); c.lineTo(194, 240); c.quadraticCurveTo(200, 248, 208, 240); c.stroke();
  c.fillStyle = "rgba(150,80,20,0.8)"; c.beginPath(); c.moveTo(180, 266); c.quadraticCurveTo(200, 258, 220, 266); c.quadraticCurveTo(200, 278, 180, 266); c.fill();
  // la barba trenzada
  c.beginPath(); c.moveTo(188, 315); c.lineTo(212, 315); c.lineTo(216, 430); c.quadraticCurveTo(200, 445, 184, 430); c.closePath(); c.fillStyle = oro(315, 440); c.fill();
  for (let y = 325; y < 430; y += 14) { c.strokeStyle = "rgba(28,48,120,0.85)"; c.lineWidth = 5; c.beginPath(); c.moveTo(186, y); c.lineTo(214, y + 6); c.stroke(); }
  // el collar ancho
  for (let i = 0; i < 5; i++) { c.strokeStyle = ["#1c3a8a", "#e9b84a", "#b23a2a", "#e9b84a", "#2a8a8a"][i]; c.lineWidth = 12; c.beginPath(); c.arc(200, 300, 150 + i * 13, 0.55, 2.6); c.stroke(); }
  // el brillo
  const gb = c.createRadialGradient(150, 120, 0, 150, 120, 220); gb.addColorStop(0, "rgba(255,255,230,0.45)"); gb.addColorStop(1, "rgba(255,255,230,0)");
  c.globalCompositeOperation = "screen"; nemes(); c.fillStyle = gb; c.fill();
  return l;
}
export const MASCARA = mascara();
