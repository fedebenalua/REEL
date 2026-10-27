// Lo que comparten los planos: la cabeza de cristal (de perfil, mirando a la derecha), el remolino de palabras de oro
// (la voz interior), sus ondas, la luz azul del silencio, el fondo violeta, los cuadros de lo que se imagina, el
// aparato que pita, las tarjetas de cada pitido y las formas de colores.
import * as k from "#kit";

const { azar, mez, suave: su, tramo: tr, redondo } = k;

export const ORO = "255,200,90", AZUL = "90,190,255", ROJO = "255,60,70", VERDE = "120,255,150", ROSA = "255,120,190";

// ---------------------------------------------------------------- fondo y velos
const bokehs = (() => { const az = azar(91); return Array.from({ length: 24 }, () => ({ x: az() * 1080, y: az() * 1920, r: 50 + az() * 130, c: ["160,90,255", "255,150,90", "90,170,255", "255,100,200"][Math.floor(az() * 4)], f: az() * 6 })); })();
const motas = (() => { const az = azar(92); return Array.from({ length: 90 }, () => ({ x: az() * 1080, y: az() * 1920, r: 1 + az() * 2.6, f: az() * 6, v: 6 + az() * 18 })); })();
// El fondo violeta con luces. dx, dy: se mueve un poco con la cámara (paralaje); cal: 0-1, más cálido (mañana).
export function fondo(g, t, { dx = 0, dy = 0, cal = 0, noche = 0 } = {}) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, k.mezColor("#140a33", "#3a1d4a", cal)); bg.addColorStop(0.55, k.mezColor("#2a1257", "#6a3a5a", cal)); bg.addColorStop(1, "#0b0620");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const cg = g.createRadialGradient(540, 1050, 60, 540, 1050, 1050);
  cg.addColorStop(0, `rgba(${k.mezRgb("150,90,255", "255,160,90", cal)},${0.3 * (1 - noche * 0.5)})`); cg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = cg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of bokehs) {
    const x = ((b.x - dx * 0.25) % 1300 + 1300) % 1300 - 110, y = ((b.y - dy * 0.25) % 2100 + 2100) % 2100 - 90;
    const a = 0.16 * (0.6 + 0.4 * Math.sin(t * 1.2 + b.f));
    const gr = g.createRadialGradient(x, y, 0, x, y, b.r);
    gr.addColorStop(0, `rgba(${b.c},${a})`); gr.addColorStop(0.7, `rgba(${b.c},${a * 0.45})`); gr.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, b.r, 0, 6.2832); g.fill();
  }
  for (const m of motas) {
    const x = ((m.x - dx * 0.5) % 1080 + 1080) % 1080, y = ((m.y - t * m.v - dy * 0.5) % 1920 + 1920) % 1920;
    g.fillStyle = `rgba(220,200,255,${0.22 + 0.18 * Math.sin(t * 1.7 + m.f)})`; g.beginPath(); g.arc(x, y, m.r, 0, 6.2832); g.fill();
  }
  g.restore();
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.05; g.drawImage(k.manchas, -200, -200, 1500, 2400); g.restore();
}
export function vineta(g, al = 0.55) {
  const vg = g.createRadialGradient(540, 1000, 480, 540, 1000, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.5) {
  const vg = g.createLinearGradient(0, 150, 0, 660);
  vg.addColorStop(0, `rgba(8,4,20,${al})`); vg.addColorStop(0.6, `rgba(8,4,20,${al * 0.6})`); vg.addColorStop(1, "rgba(8,4,20,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 660);
}
// La cámara en 2D: (cx, cy) del mundo en el centro de la pantalla (540, 1050), con zoom z.
export function camara(g, cx, cy, z) { g.translate(540, 1050); g.scale(z, z); g.translate(-cx, -cy); }

// ---------------------------------------------------------------- la cabeza de cristal
// De perfil, mirando a la derecha. Coordenadas locales: el centro del cráneo cerca de (0, -120); la coronilla en
// y = -430, la barbilla en y = 300 y el cuello baja hasta y = 640. Ancho de la nuca (-330) a la nariz (385).
export const CRANEO = { x: 10, y: -140, rx: 255, ry: 215 };
export const OJO = { x: 235, y: -45 }, BOCA = { x: 330, y: 168 };
export function caminoCabeza(c) {
  c.beginPath();
  c.moveTo(-150, 640);
  c.bezierCurveTo(-150, 520, -160, 420, -200, 330);
  c.bezierCurveTo(-300, 260, -345, 120, -335, -20);
  c.bezierCurveTo(-325, -230, -200, -425, 20, -432);
  c.bezierCurveTo(200, -436, 300, -330, 312, -180);
  c.bezierCurveTo(318, -120, 300, -95, 312, -60);
  c.bezierCurveTo(330, -10, 385, 50, 382, 82);
  c.bezierCurveTo(380, 105, 345, 112, 322, 118);
  c.bezierCurveTo(338, 135, 338, 150, 326, 158);
  c.bezierCurveTo(336, 166, 340, 182, 324, 196);
  c.bezierCurveTo(330, 225, 322, 262, 292, 290);
  c.bezierCurveTo(255, 318, 200, 318, 160, 312);
  c.bezierCurveTo(140, 400, 140, 520, 150, 640);
  c.closePath();
}
const COL = {
  oro: { borde: "255,205,110", dentro: "255,170,60", vidrio: ["rgba(70,40,90,0.78)", "rgba(40,20,70,0.85)", "rgba(20,10,40,0.92)"] },
  azul: { borde: "120,200,255", dentro: "60,140,255", vidrio: ["rgba(30,50,110,0.8)", "rgba(15,25,75,0.86)", "rgba(8,10,40,0.92)"] },
  gris: { borde: "215,200,255", dentro: "150,120,240", vidrio: ["rgba(55,40,100,0.8)", "rgba(30,20,70,0.86)", "rgba(14,10,40,0.92)"] },
};
const vetas = k.ruido(256, 333, 3, 3, "lineas");
// cabeza(g, x, y, s, t, opciones): la cabeza en (x, y) (su origen local), a escala s.
// tono: "oro" | "azul"; luz: 0-1, lo que brilla por dentro; dentro(g): lo que se ve dentro (coordenadas locales, ya
// recortado a la cabeza); mezcla: 0-1, de oro a azul (para pasar de una a otra).
export function cabeza(g, x, y, s, t, { tono = "oro", luz = 1, dentro = null, al = 1, borde = 1 } = {}) {
  if (al <= 0.01) return;
  const C = COL[tono];
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= al;
  // el halo de detrás
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(0, -120, 80, 0, -120, 720);
  hg.addColorStop(0, `rgba(${C.dentro},${0.26 * luz})`); hg.addColorStop(1, `rgba(${C.dentro},0)`);
  g.fillStyle = hg; g.fillRect(-800, -900, 1600, 1700);
  g.restore();
  // el cristal: oscuro, más claro por arriba a la izquierda (de donde viene la luz)
  caminoCabeza(g);
  const vg = g.createLinearGradient(-300, -430, 250, 600);
  vg.addColorStop(0, C.vidrio[0]); vg.addColorStop(0.5, C.vidrio[1]); vg.addColorStop(1, C.vidrio[2]);
  g.fillStyle = vg; g.fill();
  g.save(); caminoCabeza(g); g.clip();
  // la luz de dentro, en el cráneo
  g.save(); g.globalCompositeOperation = "lighter";
  const ig = g.createRadialGradient(CRANEO.x, CRANEO.y, 20, CRANEO.x, CRANEO.y, 420);
  ig.addColorStop(0, `rgba(${C.dentro},${0.42 * luz})`); ig.addColorStop(0.6, `rgba(${C.dentro},${0.14 * luz})`); ig.addColorStop(1, `rgba(${C.dentro},0)`);
  g.fillStyle = ig; g.fillRect(-400, -500, 800, 1200);
  g.restore();
  if (dentro) dentro(g);
  // la textura del cristal y su sombra hacia abajo a la derecha
  g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.035; g.drawImage(vetas, -360, -460, 760, 1120);
  g.restore();
  g.save(); caminoCabeza(g); g.clip();
  const sg = g.createLinearGradient(-340, 0, 390, 0);
  sg.addColorStop(0, "rgba(0,0,0,0)"); sg.addColorStop(0.75, "rgba(0,0,0,0)"); sg.addColorStop(1, "rgba(0,0,0,0.35)");
  g.fillStyle = sg; g.fillRect(-400, -500, 800, 1200);
  g.restore();
  // el borde de luz
  g.save(); g.globalCompositeOperation = "lighter"; g.lineJoin = "round";
  for (const [w, a] of [[46, 0.07], [26, 0.14], [12, 0.32], [5, 0.8]]) { g.strokeStyle = `rgba(${C.borde},${a * borde})`; g.lineWidth = w; caminoCabeza(g); g.stroke(); }
  // el brillo del cristal en la frente y la nuca
  g.lineCap = "round";
  for (const [w, a] of [[26, 0.12], [10, 0.35], [4, 0.8]]) {
    g.strokeStyle = `rgba(255,255,255,${a})`; g.lineWidth = w;
    g.beginPath(); g.arc(10, -150, 250, -2.45, -1.75); g.stroke();
    g.beginPath(); g.arc(10, -100, 290, 2.75, 3.05); g.stroke();
  }
  g.restore();
  // el ojo: una almendra de luz
  g.save(); g.translate(OJO.x, OJO.y);
  g.beginPath(); g.moveTo(-42, 0); g.quadraticCurveTo(0, -26, 40, -4); g.quadraticCurveTo(0, 20, -42, 0); g.closePath();
  g.fillStyle = "rgba(10,6,25,0.85)"; g.fill();
  g.strokeStyle = `rgba(${C.borde},0.8)`; g.lineWidth = 4; g.stroke();
  g.globalCompositeOperation = "lighter";
  g.fillStyle = `rgba(${C.borde},0.9)`; g.beginPath(); g.arc(14, -2, 11, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(18, -6, 4, 0, 6.2832); g.fill();
  g.restore();
  g.restore();
}

// La misma cabeza ya dibujada (sin nada dentro), para dibujar muchas deprisa: cabezaHecha(g, tono, x, y, s, al).
const HECHAS = {};
for (const tono of ["oro", "azul", "gris"]) {
  const l = k.lienzo(800, 900), c = l.getContext("2d");
  cabeza(c, 400, 450, 0.5, 0, { tono, luz: 0.6 });
  HECHAS[tono] = l;
}
export function cabezaHecha(g, tono, x, y, s, al = 1) {
  if (al <= 0.01) return;
  const f = s / 0.5;
  g.save(); g.globalAlpha *= al; g.drawImage(HECHAS[tono], x - 400 * f, y - 450 * f, 800 * f, 900 * f); g.restore();
}

// ---------------------------------------------------------------- la voz interior: palabras de oro
export const FRASES = ["¿y si llueve?", "vale", "llego tarde", "¿dónde están las llaves?", "pan", "mañana", "qué hambre",
  "venga", "¿apagué el horno?", "ya voy", "no se lo digas", "uf", "¿qué hora es?", "luego", "¿y ahora qué?", "café"];
// Cada frase va en su carril (una altura del cráneo), dando vueltas como en un tiovivo: así no se tapan.
const VEL = [0.7, -0.6, 0.85, -0.75, 0.6, -0.9, 0.75, -0.65];
const REM = (() => { const az = azar(4242); return FRASES.map((p, i) => ({ p, a: (i % 8) * 2.39996 + (i >= 8 ? Math.PI : 0), carril: [3, 5, 1, 6, 2, 4, 0, 7][i % 8], w: VEL[i % 8], tam: 52 + az() * 22, f: az() * 6 })); })();
// Una palabra de oro que brilla, centrada en (x, y), de alto tam. al: transparencia; col: "r,g,b".
export function palabra(g, texto, x, y, tam, al = 1, col = ORO, peso = 800) {
  if (al <= 0.01) return;
  g.save(); g.font = `${peso} ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.globalCompositeOperation = "lighter"; g.lineJoin = "round";
  for (const [w, a] of [[tam * 0.28, 0.07], [tam * 0.12, 0.16]]) { g.strokeStyle = `rgba(${col},${a * al})`; g.lineWidth = w; g.strokeText(texto, x, y); }
  g.restore();
  g.save(); g.font = `${peso} ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.globalAlpha *= al;
  g.lineJoin = "round"; g.strokeStyle = "rgba(40,15,0,0.55)"; g.lineWidth = tam * 0.08; g.strokeText(texto, x, y);
  g.restore();
  g.save(); g.font = `${peso} ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.globalAlpha *= al;
  const lg = g.createLinearGradient(0, y - tam / 2, 0, y + tam / 2);
  lg.addColorStop(0, `rgb(${k.mezRgb(col, "255,255,255", 0.65)})`); lg.addColorStop(0.55, `rgb(${col})`); lg.addColorStop(1, `rgb(${k.mezRgb(col, "120,60,0", 0.35)})`);
  g.fillStyle = lg; g.fillText(texto, x, y);
  g.restore();
}
// El remolino de palabras de oro dentro del cráneo (coordenadas locales). gira: el ángulo que llevan (radianes;
// pásale algo que crezca con t); al: 0-1; n: cuántas; fant: 0-1, transparentes y sin brillo (palabras sin oírlas).
export function remolino(g, gira, { al = 1, n = REM.length, escala = 1, cx = CRANEO.x, cy = CRANEO.y, rx = 235, ry = 190, fant = 0, col = ORO } = {}) {
  if (al <= 0.01) return;
  const orden = REM.slice(0, n).map((w) => { const a = w.a + gira * w.w; return { w, a, z: Math.sin(a) }; }).sort((p, q) => p.z - q.z);
  for (const { w, a, z } of orden) {
    const fila = (w.carril / 7) * 2 - 1, ancho = Math.sqrt(Math.max(0.15, 1 - fila * fila * 0.75));
    const x = cx + Math.cos(a) * rx * ancho * escala, y = cy + fila * ry * 0.85 * escala;
    const prof = (z + 1) / 2;
    palabra(g, w.p, x, y, w.tam * (0.55 + 0.45 * prof) * escala, al * (0.3 + 0.7 * prof) * (1 - 0.65 * fant), col, 800);
  }
}
// Ondas que se abren desde (x, y): el sonido de la voz. periodo: cada cuánto sale una; al: 0-1.
export function ondas(g, t, x, y, r0, r1, { periodo = 0.7, al = 1, color = ORO, ancho = 10, n = 3, aplana = 0.85 } = {}) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (let j = 0; j < n; j++) {
    const u = (((t / periodo + j / n) % 1) + 1) % 1, r = mez(r0, r1, u), a = al * Math.sin(Math.PI * u) * 0.9;
    for (const [w, aa] of [[ancho * 3.5, 0.15], [ancho, 0.7]]) {
      g.strokeStyle = `rgba(${color},${a * aa})`; g.lineWidth = w * (1 - u * 0.5);
      g.beginPath(); g.ellipse(x, y, r, r * aplana, 0, 0, 6.2832); g.stroke();
    }
  }
  g.restore();
}
// Polvo azul: lo que queda de unas letras que se deshacen sin sonar. (x, y): de dónde sale; u: 0-1.
const POLVO = (() => { const az = azar(515); return Array.from({ length: 70 }, () => ({ dx: (az() - 0.5) * 2, dy: (az() - 0.5) * 2, v: 0.4 + az(), r: 3 + az() * 7 })); })();
export function polvo(g, x, y, u, ancho = 300, color = AZUL) {
  if (u <= 0 || u >= 1) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const p of POLVO) {
    const d = k.entra(u) * p.v;
    const px = x + p.dx * ancho * (0.5 + d), py = y + p.dy * 60 + p.dy * 160 * d - 60 * d;
    g.fillStyle = `rgba(${color},${(1 - u) * 0.8})`; g.beginPath(); g.arc(px, py, p.r * (1 - u * 0.5), 0, 6.2832); g.fill();
  }
  g.restore();
}
// La luz azul quieta del silencio, dentro del cráneo (local). Motas cian que flotan despacio.
const MOTAS_AZ = (() => { const az = azar(616); return Array.from({ length: 40 }, () => ({ a: az() * 6.28, r: az(), f: az() * 6, s: 3 + az() * 6 })); })();
export function silencio(g, t, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  const gl = g.createRadialGradient(CRANEO.x, CRANEO.y, 10, CRANEO.x, CRANEO.y, 300);
  gl.addColorStop(0, `rgba(120,210,255,${0.35 * al * (0.85 + 0.15 * Math.sin(t * 2))})`); gl.addColorStop(1, "rgba(60,120,255,0)");
  g.fillStyle = gl; g.beginPath(); g.arc(CRANEO.x, CRANEO.y, 300, 0, 6.2832); g.fill();
  for (const m of MOTAS_AZ) {
    const a = m.a + t * 0.15, x = CRANEO.x + Math.cos(a) * 230 * m.r, y = CRANEO.y + Math.sin(a * 1.3) * 170 * m.r;
    g.fillStyle = `rgba(150,225,255,${al * (0.35 + 0.3 * Math.sin(t * 1.5 + m.f))})`; g.beginPath(); g.arc(x, y, m.s, 0, 6.2832); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- los cuadros de lo que se imagina
function escenaMar(g, w, h, t) {
  const cielo = g.createLinearGradient(0, -h / 2, 0, 0);
  cielo.addColorStop(0, "#3b1d6e"); cielo.addColorStop(0.55, "#ff6a5a"); cielo.addColorStop(1, "#ffc46a");
  g.fillStyle = cielo; g.fillRect(-w / 2, -h / 2, w, h / 2 + 2);
  const sol = g.createRadialGradient(0, -h * 0.02, 0, 0, -h * 0.02, w * 0.22);
  sol.addColorStop(0, "#fff6d0"); sol.addColorStop(0.5, "#ffd36a"); sol.addColorStop(1, "rgba(255,160,80,0)");
  g.fillStyle = sol; g.beginPath(); g.arc(0, -h * 0.02, w * 0.22, 0, 6.2832); g.fill();
  const mar = g.createLinearGradient(0, 0, 0, h / 2);
  mar.addColorStop(0, "#ff8a5a"); mar.addColorStop(0.3, "#7a3a8a"); mar.addColorStop(1, "#1a1046");
  g.fillStyle = mar; g.fillRect(-w / 2, 0, w, h / 2);
  g.strokeStyle = "rgba(255,230,160,0.8)"; g.lineCap = "round";
  for (let i = 0; i < 7; i++) { const y = 10 + i * h * 0.06, l = w * (0.22 - i * 0.025) * (0.8 + 0.2 * Math.sin(t * 2 + i)); g.lineWidth = 5 - i * 0.5; g.beginPath(); g.moveTo(-l, y); g.lineTo(l, y); g.stroke(); }
}
function escenaMontana(g, w, h) {
  const cielo = g.createLinearGradient(0, -h / 2, 0, h / 2);
  cielo.addColorStop(0, "#2a6fd6"); cielo.addColorStop(0.6, "#8fd0ff"); cielo.addColorStop(1, "#d6f0ff");
  g.fillStyle = cielo; g.fillRect(-w / 2, -h / 2, w, h);
  const m = (pts, c1, c2) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) g.lineTo(p[0], p[1]); g.closePath(); const gg = g.createLinearGradient(-w / 2, 0, w / 2, 0); gg.addColorStop(0, c1); gg.addColorStop(1, c2); g.fillStyle = gg; g.fill(); };
  m([[-w / 2, h / 2], [-w * 0.2, -h * 0.05], [w * 0.05, h * 0.2], [w * 0.5, h / 2]], "#5a7aa8", "#2c4870");
  m([[-w * 0.35, h / 2], [w * 0.08, -h * 0.3], [w / 2 + 10, h * 0.25], [w / 2, h / 2]], "#e8f2ff", "#5f7fa6");
  g.beginPath(); g.moveTo(w * 0.08, -h * 0.3); g.lineTo(-w * 0.05, -h * 0.12); g.lineTo(w * 0.02, -h * 0.15); g.lineTo(w * 0.08, -h * 0.08); g.lineTo(w * 0.16, -h * 0.16); g.lineTo(w * 0.22, -h * 0.12); g.closePath();
  g.fillStyle = "#ffffff"; g.fill();
  const pr = g.createLinearGradient(0, h * 0.25, 0, h / 2); pr.addColorStop(0, "#3fbf6a"); pr.addColorStop(1, "#1d7a40");
  g.fillStyle = pr; g.beginPath(); g.moveTo(-w / 2, h * 0.32); g.quadraticCurveTo(0, h * 0.22, w / 2, h * 0.34); g.lineTo(w / 2, h / 2); g.lineTo(-w / 2, h / 2); g.closePath(); g.fill();
}
function escenaCasa(g, w, h, t) {
  const cielo = g.createLinearGradient(0, -h / 2, 0, h / 2);
  cielo.addColorStop(0, "#0a1240"); cielo.addColorStop(1, "#2a3a8a");
  g.fillStyle = cielo; g.fillRect(-w / 2, -h / 2, w, h);
  g.fillStyle = "#fff8d8"; g.beginPath(); g.arc(w * 0.28, -h * 0.28, w * 0.08, 0, 6.2832); g.fill();
  g.fillStyle = "#0a1240"; g.beginPath(); g.arc(w * 0.31, -h * 0.3, w * 0.07, 0, 6.2832); g.fill();
  g.fillStyle = "#1a1f4a"; g.fillRect(-w / 2, h * 0.3, w, h * 0.2);
  // la casa
  g.fillStyle = "#3a2a5a"; g.fillRect(-w * 0.25, -h * 0.02, w * 0.4, h * 0.34);
  g.beginPath(); g.moveTo(-w * 0.3, 0); g.lineTo(-w * 0.05, -h * 0.24); g.lineTo(w * 0.2, 0); g.closePath(); g.fillStyle = "#5a2a3a"; g.fill();
  const vent = 0.85 + 0.15 * Math.sin(t * 3);
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, -w * 0.05, h * 0.12, w * 0.5, "255,190,90", 0.45 * vent);
  g.restore();
  g.fillStyle = `rgba(255,210,110,${vent})`; g.fillRect(-w * 0.12, h * 0.06, w * 0.14, h * 0.1);
  g.fillStyle = "rgba(255,210,110,0.8)"; g.fillRect(w * 0.05, h * 0.16, w * 0.07, h * 0.16);
}
export const ESCENAS = { mar: escenaMar, montana: escenaMontana, casa: escenaCasa };
// Un cuadro con luz, centrado en (x, y), de w × h, girado ang. al: transparencia.
export function cuadro(g, tipo, x, y, w, h, t, { ang = 0, al = 1, borde = AZUL } = {}) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [lw, a] of [[40, 0.1], [18, 0.22]]) { redondo(g, -w / 2, -h / 2, w, h, 26); g.strokeStyle = `rgba(${borde},${a})`; g.lineWidth = lw; g.stroke(); }
  g.restore();
  redondo(g, -w / 2, -h / 2, w, h, 26); g.save(); g.clip();
  ESCENAS[tipo](g, w, h, t);
  const br = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  br.addColorStop(0, "rgba(255,255,255,0.25)"); br.addColorStop(0.4, "rgba(255,255,255,0)"); br.addColorStop(1, "rgba(0,0,0,0.25)");
  g.fillStyle = br; g.fillRect(-w / 2, -h / 2, w, h);
  g.restore();
  redondo(g, -w / 2, -h / 2, w, h, 26); g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 6; g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- el aparato que pita
// Una cajita negra con su pantalla y su luz roja, centrada en (x, y), escala s. pita: 0-1, la luz y su anillo.
export function aparato(g, x, y, s, pita = 0, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= al;
  redondo(g, -70, -46, 140, 92, 24);
  const cg = g.createLinearGradient(0, -46, 0, 46); cg.addColorStop(0, "#4a4a5e"); cg.addColorStop(0.5, "#24242f"); cg.addColorStop(1, "#111118");
  g.fillStyle = cg; g.fill(); g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 3; g.stroke();
  redondo(g, -54, -30, 70, 40, 8); g.fillStyle = pita > 0.05 ? `rgb(${Math.round(mez(30, 120, pita))},40,40)` : "#1a2a2a"; g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(-54, -30, 70, 6);
  g.beginPath(); g.arc(42, -8, 14, 0, 6.2832); g.fillStyle = `rgb(${Math.round(mez(110, 255, pita))},${Math.round(mez(20, 70, pita))},${Math.round(mez(30, 70, pita))})`; g.fill();
  if (pita > 0.02) {
    g.globalCompositeOperation = "lighter";
    k.brillo(g, 42, -8, 220, ROJO, 0.9 * pita);
    g.strokeStyle = `rgba(${ROJO},${0.7 * pita})`; g.lineWidth = 6;
    g.beginPath(); g.arc(42, -8, 30 + 50 * (1 - pita), 0, 6.2832); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- las tarjetas de cada pitido
// Una tarjeta centrada en (x, y): de oro con una frase (se habló por dentro) o azul con un cuadro (no).
export function tarjeta(g, x, y, s, t, { oro = true, texto = "", escena = "mar", al = 1, ang = 0 } = {}) {
  if (al <= 0.01) return;
  const w = 300, h = 210, col = oro ? ORO : AZUL;
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s); g.globalAlpha *= al;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [lw, a] of [[44, 0.1], [18, 0.25]]) { redondo(g, -w / 2, -h / 2, w, h, 24); g.strokeStyle = `rgba(${col},${a})`; g.lineWidth = lw; g.stroke(); }
  g.restore();
  redondo(g, -w / 2, -h / 2, w, h, 24);
  const fg = g.createLinearGradient(0, -h / 2, 0, h / 2);
  if (oro) { fg.addColorStop(0, "#5a3a10"); fg.addColorStop(1, "#2a1606"); } else { fg.addColorStop(0, "#14306a"); fg.addColorStop(1, "#08122e"); }
  g.fillStyle = fg; g.fill();
  if (oro) { g.font = `800 60px Figtree`; const an = g.measureText(texto).width; palabra(g, texto, 0, 0, Math.min(60, (60 * (w - 50)) / an), 1, ORO); }
  else cuadro(g, escena, 0, 0, w - 50, h - 50, t, { borde: AZUL });
  redondo(g, -w / 2, -h / 2, w, h, 24); g.strokeStyle = `rgba(${col},0.95)`; g.lineWidth = 6; g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- formas de colores (otra forma de pensar)
export function forma(g, tipo, x, y, r, ang, color, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  const camino = () => {
    g.beginPath();
    if (tipo === 0) g.arc(0, 0, r, 0, 6.2832);
    else if (tipo === 1) { for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * 2.0944; g[i ? "lineTo" : "moveTo"](Math.cos(a) * r * 1.2, Math.sin(a) * r * 1.2); } g.closePath(); }
    else if (tipo === 2) { redondo(g, -r, -r, r * 2, r * 2, r * 0.25); }
    else { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * 0.6283, rr = i % 2 ? r * 0.5 : r * 1.15; g[i ? "lineTo" : "moveTo"](Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); }
  };
  camino();
  const fg = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.3);
  fg.addColorStop(0, `rgba(${k.mezRgb(color, "255,255,255", 0.6)},0.95)`); fg.addColorStop(0.6, `rgba(${color},0.85)`); fg.addColorStop(1, `rgba(${k.mezRgb(color, "0,0,0", 0.4)},0.85)`);
  g.fillStyle = fg; g.fill();
  g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${color},0.6)`; g.lineWidth = 10; camino(); g.stroke(); g.restore();
  g.restore();
}

// Un reloj que va al ritmo de t y frena hasta pararse entre a y b (para que lo que se mueve repose antes de un corte).
export function frena(t, a, b) {
  if (t <= a) return t;
  const u = Math.min(1, (t - a) / (b - a));
  return a + ((b - a) * (1 - (1 - u) * (1 - u))) / 2;
}
export { su, tr };
