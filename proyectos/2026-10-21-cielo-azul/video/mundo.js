// Lo que comparten los planos de este vídeo: el cielo, el Sol, las nubes y la Tierra con su capa de aire.
// Si algo sale en más de un plano, se hace aquí una vez, para que sea siempre la misma cosa.
import * as k from "#kit";

const { azar, lienzo, mez, suave, tramo } = k;

// ---------------------------------------------------------------- los colores del cielo
export const AZUL = "70,150,255";      // la luz azul (la que rebota)
export const ROJO = "255,70,60";       // la luz roja (la que pasa)
export const NARANJA = "255,160,60";
export const VIOLETA = "170,100,255";
export const VERDE = "90,230,130";
export const AMARILLO = "255,225,90";
export const BLANCO = "255,255,255";

// Un cielo de día: de lo más hondo, arriba, a lo más claro, en el horizonte. espacio: de 0 (cielo) a 1 (negro).
export function cielo(g, espacio = 0, y0 = 0, y1 = 1920, tono = 0) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  const a = [18, 70, 205], b = [58, 140, 250], c = [170, 215, 255];
  const e = 1 - Math.min(1, espacio * 1.05);
  const col = (x) => `rgb(${Math.round(x[0] * e)},${Math.round(x[1] * e)},${Math.round(x[2] * e)})`;
  gr.addColorStop(0, col(a)); gr.addColorStop(0.55, col(b)); gr.addColorStop(1, col(c));
  g.fillStyle = gr; g.fillRect(0, y0, 1080, y1 - y0);
}

// ---------------------------------------------------------------- las estrellas (quietas)
const azE = azar(4242);
const ESTRELLAS = Array.from({ length: 520 }, () => ({ x: azE() * 1080, y: azE() * 1920, r: 0.8 + azE() * 1.9, b: 0.35 + azE() * 0.65, c: azE() < 0.2 ? "255,215,190" : azE() < 0.35 ? "190,210,255" : "240,244,255" }));
export function estrellasQuietas(g, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const s of ESTRELLAS) { g.fillStyle = `rgba(${s.c},${s.b * al})`; g.fillRect(s.x, s.y, s.r, s.r); }
  g.restore();
}

// ---------------------------------------------------------------- el Sol: blanco, de verdad
export function sol(g, x, y, r, al = 1, rayos = 1) {
  if (al <= 0.003) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha = al;
  // la corona grande, cálida y muy suave
  let gr = g.createRadialGradient(x, y, r * 0.5, x, y, r * 7);
  gr.addColorStop(0, "rgba(255,250,235,0.55)"); gr.addColorStop(0.18, "rgba(255,244,215,0.22)"); gr.addColorStop(1, "rgba(255,240,210,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 7, 0, 6.2832); g.fill();
  // rayos largos
  if (rayos > 0) {
    g.globalAlpha = al * rayos * 0.5;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * 6.2832 + 0.2, L = r * (4.2 + 1.8 * ((i * 7) % 3) / 2);
      const lg = g.createLinearGradient(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L);
      lg.addColorStop(0, "rgba(255,252,240,0.55)"); lg.addColorStop(1, "rgba(255,252,240,0)");
      g.strokeStyle = lg; g.lineWidth = r * 0.14; g.lineCap = "round";
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
    }
  }
  g.globalAlpha = al;
  // el disco: blanco puro
  gr = g.createRadialGradient(x, y, 0, x, y, r * 1.25);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.62, "rgba(255,255,255,1)"); gr.addColorStop(0.8, "rgba(255,252,238,0.85)"); gr.addColorStop(1, "rgba(255,246,220,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 1.25, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- nubes
// Una nube blanca con su luz arriba y su sombra azulada abajo, hecha de bolas que se juntan. (x, y): su centro; w: su ancho.
const bolas = (sem) => { const a = azar(sem); return Array.from({ length: 9 }, (_, i) => ({ dx: (a() - 0.5) * 0.8, dy: (a() - 0.5) * 0.28 - (i < 3 ? 0.08 : 0), r: 0.18 + a() * 0.16 })); };
const NUBES = [bolas(11), bolas(12), bolas(13), bolas(14), bolas(15), bolas(16)];
export function nube(g, i, x, y, w, al = 1) {
  if (al <= 0.01) return;
  const B = NUBES[((i % 6) + 6) % 6];
  g.save(); g.globalAlpha *= al;
  for (const pase of [0, 1]) for (const b of B) {
    const cx = x + b.dx * w, cy = y + b.dy * w, r = b.r * w, gr = g.createRadialGradient(cx - r * 0.25, cy - r * 0.45, r * 0.1, cx, cy, r);
    if (pase === 0) { gr.addColorStop(0, "rgba(120,160,225,0.55)"); gr.addColorStop(1, "rgba(120,160,225,0)"); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy + r * 0.25, r * 1.05, 0, 6.2832); g.fill(); }
    else { gr.addColorStop(0, "rgba(255,255,255,0.97)"); gr.addColorStop(0.7, "rgba(238,246,255,0.85)"); gr.addColorStop(1, "rgba(220,235,255,0)"); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, 6.2832); g.fill(); }
  }
  g.restore();
}

// ---------------------------------------------------------------- la Tierra y su capa de aire
// La Tierra de radio R con su centro en (cx, cy), vista desde el espacio; el borde de su aire brilla con el azul de arriba.
// aire: de 0 (el aire no tiene color) a 1 (azul). La luz viene de (lx, ly).
const aparteTierra = lienzo(1080, 1920);
export function tierraConAire(g, cx, cy, R, aire = 1, gira = 0.1, lx = 0.25, ly = -0.97, ang = 1.3) {
  const top = cy - R;
  if (top > 1960 || R < 5) return;
  const grueso = Math.max(30, Math.min(R * 0.1, 170));
  // el aire: un anillo que brilla (azul) o apenas se ve (transparente)
  g.save();
  g.globalCompositeOperation = "lighter";
  const gr = g.createRadialGradient(cx, cy, R * 0.985, cx, cy, R + grueso);
  gr.addColorStop(0, `rgba(${mezc(AZUL, "255,255,255", 0.5 * (1 - aire))},${0.9 * aire + 0.1 * (1 - aire)})`);
  gr.addColorStop(0.3, `rgba(${AZUL},${0.45 * aire + 0.035 * (1 - aire)})`);
  gr.addColorStop(1, `rgba(${AZUL},0)`);
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R + grueso, 0, 6.2832); g.fill();
  g.restore();
  // la Tierra, girada para que arriba no quede el polo, y sin el borde azul que trae de fábrica
  const c = aparteTierra.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = "source-over"; c.globalAlpha = 1; c.clearRect(0, 0, 1080, 1920);
  c.save(); c.translate(cx, cy); c.rotate(ang);
  const co = Math.cos(-ang), si = Math.sin(-ang);
  k.tierra(c, 0, 0, R, gira, lx * co - ly * si, lx * si + ly * co);
  c.restore();
  c.globalCompositeOperation = "destination-in"; c.fillStyle = "#000"; c.beginPath(); c.arc(cx, cy, R * 0.999, 0, 6.2832); c.fill();
  c.globalCompositeOperation = "source-over";
  g.drawImage(aparteTierra, 0, 0);
}
const mezc = (a, b, u) => k.mezRgb(a, b, u);

// Un haz de luz blanca entre dos puntos, con su brillo, y motas que viajan por él.
export function rayoDeLuz(g, x0, y0, x1, y1, t, al = 1, ancho = 50, color = "255,255,255", vel = 1.6) {
  if (al <= 0.003) return;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [w, a] of [[ancho * 3.2, 0.16], [ancho * 1.7, 0.3], [ancho * 0.7, 0.9]]) {
    g.globalAlpha = al * a; g.strokeStyle = `rgb(${color})`; g.lineWidth = w; g.lineCap = "round";
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  }
  // motas de luz que corren por el haz
  g.globalAlpha = al;
  for (let i = 0; i < 16; i++) {
    const u = (((t * vel + i / 16) % 1) + 1) % 1, off = (((i * 37) % 11) / 11 - 0.5) * ancho * 0.8;
    const x = x0 + dx * u + nx * off, y = y0 + dy * u + ny * off;
    g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(x, y, 3 + (i % 3) * 1.5, 0, 6.2832); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- moléculas y fotones
// Una molécula del aire (dos átomos pegados): perla violácea con luz y sombra. r: radio de cada átomo. azul: de 0 a 1,
// cuánto brilla en azul (cuando acaba de dispersar luz).
export function molecula(g, x, y, r, ang = 0, al = 1, azul = 0, tinte = AZUL) {
  if (al <= 0.01) return;
  const dx = Math.cos(ang) * r * 0.78, dy = Math.sin(ang) * r * 0.78;
  g.save(); g.globalAlpha *= al;
  if (azul > 0.02) { g.globalCompositeOperation = "lighter"; k.brillo(g, x, y, r * 7, tinte, 0.85 * azul); g.globalCompositeOperation = "source-over"; }
  for (const s of [-1, 1]) {
    const cx = x + dx * s, cy = y + dy * s;
    const gr = g.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
    gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.35, "#d9d2ff"); gr.addColorStop(0.8, "#7a6fc7"); gr.addColorStop(1, "#3a3380");
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, 6.2832); g.fill();
  }
  g.restore();
}

// Un fotón que viaja por una ruta de puntos [[x, y], ...]: s, lo que ha recorrido (px). Deja una estela de `cola` px.
export function posRuta(pts, s) {
  let rest = s;
  for (let i = 0; i < pts.length - 1; i++) {
    const L = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    if (rest <= L) { const u = rest / L; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u, i]; }
    rest -= L;
  }
  return null;
}
export function foton(g, pts, s, color, cola = 150, tam = 56, al = 1) {
  if (s < 0 || al <= 0.01) return;
  let total = 0; for (let i = 0; i < pts.length - 1; i++) total += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
  if (s > total + cola) return;
  const head = posRuta(pts, Math.min(s, total)); if (!head) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  // la estela: tramos con la transparencia bajando hacia la cola
  const N = Math.max(14, Math.min(70, Math.round(cola / 5)));
  let prev = head;
  for (let q = 1; q <= N; q++) {
    const sq = Math.min(s, total) - (cola * q) / N; if (sq < 0) break;
    const p = posRuta(pts, sq); if (!p) break;
    const fade = 1 - q / N;
    g.strokeStyle = `rgba(${color},${al * 0.8 * fade})`; g.lineWidth = Math.max(2, tam * 0.2 * fade + 2);
    g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(p[0], p[1]); g.stroke();
    prev = p;
  }
  if (s <= total) { k.brillo(g, head[0], head[1], tam, color, al); k.brillo(g, head[0], head[1], tam * 0.35, "255,255,255", al); }
  g.restore();
}
export const largoRuta = (pts) => { let t = 0; for (let i = 0; i < pts.length - 1; i++) t += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); return t; };

// Un fondo oscuro con profundidad (azul noche), para lo que pasa dentro del aire y en el estudio.
export function fondoNoche(g, a = "#06102c", b = "#0c2b6a", cy = 1000) {
  g.fillStyle = a; g.fillRect(0, 0, 1080, 1920);
  const gr = g.createRadialGradient(540, cy, 40, 540, cy, 1250);
  gr.addColorStop(0, b); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
}

// ---------------------------------------------------------------- el campo y los cielos de colores
// Colinas en tres capas; off: cuánto se ha girado la cámara; osc: de 0 (de día) a 1 (a oscuras), para ir apagándolas.
export function colinas(g, off, osc = 0) {
  const capas = [
    { y: 1290, a: 70, f: 0.006, c1: "#7fc79a", c2: "#4aa56a", par: 0.35, p: 0.4 },
    { y: 1390, a: 90, f: 0.0045, c1: "#4eb06a", c2: "#2b8a48", par: 0.7, p: 2.1 },
    { y: 1560, a: 110, f: 0.0035, c1: "#2f9a4c", c2: "#14602e", par: 1.2, p: 4.3 },
  ];
  const oscuro = ["#241633", "#150d22", "#0c0716"];
  capas.forEach((c, i) => {
    g.beginPath(); g.moveTo(-50, 1960);
    for (let x = -50; x <= 1130; x += 10) { const X = x - off * c.par; g.lineTo(x, c.y + Math.sin(X * c.f + c.p) * c.a + Math.sin(X * c.f * 2.3 + c.p * 1.7) * c.a * 0.4); }
    g.lineTo(1130, 1960); g.closePath();
    const gr = g.createLinearGradient(0, c.y - c.a, 0, c.y + 260);
    gr.addColorStop(0, k.mezColor("#" + c.c1.slice(1), oscuro[i], osc)); gr.addColorStop(1, k.mezColor("#" + c.c2.slice(1), "#05030a", osc));
    g.fillStyle = gr; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35 * (1 - osc); g.drawImage(k.manchas, -200 - off * c.par * 0.5, c.y - 200, 1500, 900); g.restore();
  });
}

// El cielo en tres estados: día (0), atardecer (1) y sin aire (2). e: un número de 0 a 2, con decimales para pasar de uno a otro.
const ESTADOS = [
  [[18, 70, 205], [58, 140, 250], [170, 215, 255]],
  [[28, 22, 96], [176, 52, 108], [255, 146, 54]],
  [[2, 3, 10], [2, 3, 10], [5, 7, 18]],
];
export function cieloEstado(g, e, y0 = 0, y1 = 1500) {
  const i = Math.min(1, Math.floor(e)), u = e - i, A = ESTADOS[i], B = ESTADOS[i + 1] || ESTADOS[i];
  const c = (j) => `rgb(${[0, 1, 2].map((q) => Math.round(A[j][q] + (B[j][q] - A[j][q]) * u)).join(",")})`;
  const gr = g.createLinearGradient(0, y0, 0, y1);
  gr.addColorStop(0, c(0)); gr.addColorStop(0.55, c(1)); gr.addColorStop(1, c(2));
  g.fillStyle = gr; g.fillRect(0, y0, 1080, y1 - y0);
}
