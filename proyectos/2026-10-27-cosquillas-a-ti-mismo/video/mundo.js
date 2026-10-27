// Lo que comparten los planos: la palma abierta, el dedo que señala, las chispas de las cosquillas (y su humo gris
// cuando no hacen nada), el fondo morado con luces, las gafas, el cerebro de luz y los tubos de la fuerza.
import * as k from "#kit";

const { azar, lienzo, redondo, mez, mezRgb } = k;

export const AZUL = { manga: ["#2f6fe0", "#173f9a", "#0b2260"], borde: "120,190,255" };
export const ROJO = { manga: ["#ef4a4a", "#a81f2a", "#5c0d16"], borde: "255,120,120" };
export const ROSA = "255,80,170", ORO = "255,205,90", CIAN = "90,235,255";

const PIEL = { luz: "#ffdcc2", base: "#f0b48e", sombra: "#b8714f", honda: "#8a4a33" };

// ---------------------------------------------------------------- fondos
const bokehs = (() => { const az = azar(77); return Array.from({ length: 26 }, () => ({ x: az() * 1080, y: az() * 1920, r: 40 + az() * 120, c: ["255,90,190", "120,120,255", "255,190,110", "90,220,255"][Math.floor(az() * 4)], f: az() * 6 })); })();
export function fondoMorado(g, t, al = 1) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#1a0b3a"); bg.addColorStop(0.5, "#3a1260"); bg.addColorStop(1, "#160828");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const cg = g.createRadialGradient(540, 1050, 80, 540, 1050, 1000);
  cg.addColorStop(0, "rgba(255,120,200,0.35)"); cg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = cg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of bokehs) {
    const a = 0.18 * al * (0.6 + 0.4 * Math.sin(t * 1.3 + b.f));
    const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    gr.addColorStop(0, `rgba(${b.c},${a})`); gr.addColorStop(0.7, `rgba(${b.c},${a * 0.5})`); gr.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.2832); g.fill();
  }
  g.restore();
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.06; g.drawImage(k.manchas, -200, -200, 1500, 2400); g.restore();
}
export function vineta(g, al = 0.55) {
  const vg = g.createRadialGradient(540, 980, 500, 540, 980, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.5) {
  const vg = g.createLinearGradient(0, 150, 0, 640);
  vg.addColorStop(0, `rgba(8,4,16,${al})`); vg.addColorStop(0.6, `rgba(8,4,16,${al * 0.6})`); vg.addColorStop(1, "rgba(8,4,16,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

// ---------------------------------------------------------------- la piel
function pielCruzada(g, x0, x1) {
  const pg = g.createLinearGradient(x0, 0, x1, 0);
  pg.addColorStop(0, PIEL.luz); pg.addColorStop(0.35, PIEL.base); pg.addColorStop(0.85, PIEL.sombra); pg.addColorStop(1, PIEL.honda);
  return pg;
}
const poros = k.tenir(k.red, "#d9a083");

// La manga de punto, de ancho w, desde y0 hacia abajo (largo L), en coordenadas locales.
function manga(g, w, y0, L, col) {
  g.beginPath(); g.moveTo(-w / 2, y0); g.lineTo(w / 2, y0); g.lineTo(w / 2 + 30, y0 + L); g.lineTo(-w / 2 - 30, y0 + L); g.closePath();
  const mg = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  mg.addColorStop(0, col[0]); mg.addColorStop(0.55, col[1]); mg.addColorStop(1, col[2]);
  g.fillStyle = mg; g.fill();
  g.save(); g.clip();
  g.strokeStyle = "rgba(0,0,0,0.22)"; g.lineWidth = 6;
  for (let x = -w / 2 - 30; x < w / 2 + 30; x += 22) { g.beginPath(); g.moveTo(x, y0); g.lineTo(x * 1.05, y0 + L); g.stroke(); }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.red, -w, y0, w * 2, L);
  g.restore();
  // el puño, más claro
  g.fillStyle = "rgba(255,255,255,0.14)"; g.fillRect(-w / 2, y0, w, 26);
}

// Un dedo de la palma (cara de dentro), en su base, girado ang, de largo L y ancho w. encoge: 0-1, se dobla hacia ti.
function dedoPalma(g, bx, by, ang, L, w, encoge) {
  const Le = L * (1 - 0.42 * encoge);
  g.save(); g.translate(bx, by); g.rotate(ang);
  const wt = w * 0.86;
  g.beginPath();
  g.moveTo(-w / 2, 30); g.lineTo(-wt / 2, -Le + wt / 2); g.arc(0, -Le + wt / 2, wt / 2, Math.PI, 0); g.lineTo(w / 2, 30); g.closePath();
  g.fillStyle = pielCruzada(g, -w / 2, w / 2); g.fill();
  g.save(); g.clip();
  // las yemas, más claras; las arrugas de las articulaciones
  const yema = g.createRadialGradient(-wt * 0.1, -Le + wt * 0.55, 4, 0, -Le + wt * 0.55, wt * 0.7);
  yema.addColorStop(0, "rgba(255,226,210,0.75)"); yema.addColorStop(1, "rgba(255,226,210,0)");
  g.fillStyle = yema; g.fillRect(-w, -Le - 20, w * 2, wt * 1.4);
  g.strokeStyle = "rgba(130,60,40,0.45)"; g.lineWidth = 4; g.lineCap = "round";
  for (const f of [0.36, 0.66]) { const y = -Le * f; g.beginPath(); g.moveTo(-w * 0.32, y + 4); g.quadraticCurveTo(0, y - 6, w * 0.32, y + 4); g.stroke(); g.beginPath(); g.moveTo(-w * 0.22, y + 14); g.quadraticCurveTo(0, y + 7, w * 0.22, y + 14); g.stroke(); }
  // al doblarse, la punta se oscurece (se va hacia ti)
  if (encoge > 0.01) { g.fillStyle = `rgba(120,50,30,${0.25 * encoge})`; g.fillRect(-w, -Le, w * 2, Le * 0.35); }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.1; g.drawImage(poros, -w, -Le, w * 2, Le + 40);
  g.restore();
  g.restore();
}

// La mano izquierda abierta, con la palma hacia ti, en (x, y) = el centro de la palma; s: escala (1 → palma de 400 px).
// encoge: 0-1, los dedos se doblan (las cosquillas); tiembla: el meneo; borde: un contorno de luz "r,g,b" (al: bordeAl).
export function palma(g, x, y, s, t, { estilo = AZUL, encoge = 0, tiembla = 0, ang = 0, borde = null, bordeAl = 0 } = {}) {
  g.save();
  const mx = Math.sin(t * 37) * 9 * tiembla, my = Math.cos(t * 29) * 7 * tiembla;
  g.translate(x + mx * s, y + my * s); g.scale(s, s); g.rotate(ang + Math.sin(t * 23) * 0.03 * tiembla);
  manga(g, 330, 330, 1400, estilo.manga);
  // la muñeca y la palma, en un solo camino
  const palmaCamino = (c) => {
    c.beginPath();
    c.moveTo(-150, 360);
    c.bezierCurveTo(-160, 300, -190, 240, -205, 150);
    c.bezierCurveTo(-222, 40, -225, -120, -175, -185);
    c.bezierCurveTo(-110, -215, 100, -215, 170, -165);
    c.bezierCurveTo(222, -110, 210, 80, 190, 170);
    c.bezierCurveTo(175, 250, 155, 300, 150, 360);
    c.closePath();
  };
  const sp = Math.sin(t * 31) * 0.04 * tiembla;
  const D = [[-140, -170, -0.13, 290, 94], [-48, -192, -0.03, 322, 98], [46, -186, 0.07, 298, 92], [138, -150, 0.19, 232, 80]];
  if (borde && bordeAl > 0.01) contorno(g, palmaCamino, D, borde, bordeAl, [[70, 0.12], [44, 0.2], [24, 0.4], [12, 0.7]]);
  for (let i = 0; i < 4; i++) { const [bx, by, a, L, w] = D[i]; dedoPalma(g, bx, by, a + sp * (i % 2 ? 1 : -1), L, w, Math.min(1, encoge * (0.8 + 0.1 * i))); }
  // el pulgar, abierto hacia la izquierda
  g.save(); g.translate(-150, 150); g.rotate(-0.8 + encoge * 0.35 + sp);
  const tw = 108, tl = 300 * (1 - 0.25 * encoge);
  g.beginPath(); g.moveTo(-tw * 0.75, 90); g.quadraticCurveTo(-tw * 0.62, -tl * 0.3, -tw * 0.44, -tl + tw * 0.44); g.arc(0, -tl + tw * 0.44, tw * 0.44, Math.PI, 0); g.quadraticCurveTo(tw * 0.55, -tl * 0.4, tw * 0.9, 60); g.closePath();
  g.fillStyle = pielCruzada(g, -tw / 2, tw / 2); g.fill();
  g.save(); g.clip(); g.strokeStyle = "rgba(130,60,40,0.4)"; g.lineWidth = 4; g.beginPath(); g.moveTo(-tw * 0.3, -tl * 0.5); g.quadraticCurveTo(0, -tl * 0.5 - 8, tw * 0.3, -tl * 0.5); g.stroke(); g.restore();
  g.restore();
  palmaCamino(g);
  const pg = g.createRadialGradient(-60, -40, 30, 0, 20, 330);
  pg.addColorStop(0, PIEL.luz); pg.addColorStop(0.5, PIEL.base); pg.addColorStop(1, PIEL.sombra);
  g.fillStyle = pg; g.fill();
  g.save(); g.clip();
  // el hueco de la palma, en sombra; la almohadilla del pulgar, con luz
  const hueco = g.createRadialGradient(20, 10, 10, 20, 10, 170);
  hueco.addColorStop(0, "rgba(170,90,60,0.32)"); hueco.addColorStop(1, "rgba(170,90,60,0)");
  g.fillStyle = hueco; g.fillRect(-250, -250, 500, 600);
  const tenar = g.createRadialGradient(-120, 170, 10, -120, 170, 160);
  tenar.addColorStop(0, "rgba(255,225,205,0.55)"); tenar.addColorStop(1, "rgba(255,225,205,0)");
  g.fillStyle = tenar; g.fillRect(-300, 0, 400, 400);
  // las rayas de la mano
  g.lineCap = "round"; g.strokeStyle = "rgba(125,55,38,0.5)"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(-200, -95); g.bezierCurveTo(-90, -110, 40, -125, 175, -70); g.stroke();
  g.beginPath(); g.moveTo(-195, -55); g.bezierCurveTo(-90, -40, 20, -10, 120, 40); g.stroke();
  g.beginPath(); g.moveTo(-160, -70); g.bezierCurveTo(-60, 40, -60, 190, -40, 330); g.stroke();
  g.strokeStyle = "rgba(255,230,210,0.35)"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-198, -88); g.bezierCurveTo(-90, -103, 40, -118, 175, -63); g.stroke();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.1; g.drawImage(poros, -260, -260, 520, 680);
  g.restore();
  g.restore();
}

function contorno(g, palmaCamino, D, borde, al, capas) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineJoin = "round";
  for (const [lw, a] of capas) {
    g.strokeStyle = `rgba(${borde},${a * al})`; g.lineWidth = lw;
    palmaCamino(g); g.stroke();
    for (const [bx, by, an, L, w] of D) { g.save(); g.translate(bx, by); g.rotate(an); g.beginPath(); g.moveTo(-w / 2, 10); g.lineTo(-w * 0.43, -L + w * 0.43); g.arc(0, -L + w * 0.43, w * 0.43, Math.PI, 0); g.lineTo(w / 2, 10); g.stroke(); g.restore(); }
  }
  g.restore();
}

// ---------------------------------------------------------------- el dedo que señala
// Una mano con el índice estirado: la yema en (tx, ty), apuntando en la dirección ang (radianes; 0 = hacia la
// derecha). s: escala. La mano y la manga quedan detrás de la yema.
export function dedo(g, tx, ty, ang, s, estilo = AZUL, { aprieta = 0 } = {}) {
  g.save(); g.translate(tx, ty); g.rotate(ang); g.scale(s, s);
  const volteo = Math.cos(ang) < 0; // apuntando a la izquierda: se da la vuelta para que la uña quede arriba
  if (volteo) g.scale(1, -1);
  // la manga
  g.save(); g.translate(-480, 30); g.rotate(Math.PI / 2); manga(g, 250, 0, 1500, estilo.manga); g.restore();
  // el puño
  const fg = g.createLinearGradient(0, -90, 0, 150);
  fg.addColorStop(0, PIEL.luz); fg.addColorStop(0.45, PIEL.base); fg.addColorStop(1, PIEL.sombra);
  redondo(g, -500, -92, 290, 228, 90); g.fillStyle = fg; g.fill();
  // los dedos doblados, uno debajo de otro, con su sombra
  for (let i = 0; i < 3; i++) {
    const y = 26 + i * 40;
    redondo(g, -330 + i * 8, y, 120 - i * 10, 46, 23);
    const dg = g.createLinearGradient(0, y, 0, y + 46); dg.addColorStop(0, PIEL.base); dg.addColorStop(1, PIEL.sombra);
    g.fillStyle = dg; g.fill(); g.strokeStyle = "rgba(120,55,35,0.45)"; g.lineWidth = 3; g.stroke();
  }
  // el índice
  const w = 74, L = 270, pres = 1 + 0.06 * aprieta;
  g.beginPath(); g.moveTo(-L - 30, -w / 2 - 6); g.lineTo(-w / 2, -w / 2 * pres); g.arc(-w / 2, 0, w / 2 * pres, -Math.PI / 2, Math.PI / 2); g.lineTo(-L - 30, w / 2 + 6); g.closePath();
  const ig = g.createLinearGradient(0, -w / 2, 0, w / 2);
  ig.addColorStop(0, PIEL.luz); ig.addColorStop(0.4, PIEL.base); ig.addColorStop(1, PIEL.sombra);
  g.fillStyle = ig; g.fill();
  g.save(); g.clip();
  g.strokeStyle = "rgba(130,60,40,0.4)"; g.lineWidth = 4;
  for (const xx of [-110, -200]) { g.beginPath(); g.moveTo(xx, -w * 0.45); g.quadraticCurveTo(xx - 8, 0, xx, w * 0.45); g.stroke(); }
  if (aprieta > 0.01) { g.fillStyle = `rgba(255,60,60,${0.3 * aprieta})`; g.fillRect(-90, -w, 90, w * 2); }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.1; g.drawImage(poros, -L - 40, -w, L + 40, w * 2);
  g.restore();
  // la uña
  redondo(g, -78, -w / 2 + 6, 62, 26, 12);
  const ug = g.createLinearGradient(0, -w / 2, 0, -w / 2 + 34); ug.addColorStop(0, "#ffe9e2"); ug.addColorStop(1, "#e7a99a");
  g.fillStyle = ug; g.fill(); g.strokeStyle = "rgba(150,80,70,0.5)"; g.lineWidth = 2; g.stroke();
  // el pulgar, encima del puño
  g.beginPath(); g.moveTo(-470, -70); g.quadraticCurveTo(-360, -120, -270, -70); g.quadraticCurveTo(-250, -40, -290, -30); g.quadraticCurveTo(-380, -40, -470, -10); g.closePath();
  const pug = g.createLinearGradient(0, -110, 0, -20); pug.addColorStop(0, PIEL.luz); pug.addColorStop(1, PIEL.sombra);
  g.fillStyle = pug; g.fill();
  g.restore();
}

// Dónde está la yema mientras dibuja círculos en (cx, cy), de radio R, a w vueltas por segundo (radianes/s).
export const circulo = (t, cx, cy, R, w = 15, fase = 0) => [cx + R * Math.cos(w * t + fase), cy + R * 0.7 * Math.sin(w * t + fase)];

// La estela del dedo: un trazo de luz por los últimos dur segundos del círculo.
export function estela(g, t, cx, cy, R, color, al = 1, w = 15, dur = 0.22, fase = 0) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = circulo(t - (dur * i) / n, cx, cy, R, w, fase), b = circulo(t - (dur * (i + 1)) / n, cx, cy, R, w, fase);
    const f = 1 - i / n;
    g.strokeStyle = `rgba(${color},${0.55 * al * f})`; g.lineWidth = 6 + 22 * f;
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- las cosquillas
// Chispas rosas y doradas que saltan de (x, y), con fuerza inten (0-1, puede pasar de 1). Todo sale de t.
const CH = (() => { const az = azar(505); return Array.from({ length: 90 }, () => ({ a: az() * 6.2832, v: 0.4 + az() * 0.9, f: az(), c: az() < 0.6 ? ROSA : ORO, r: 4 + az() * 9 })); })();
export function chispas(g, t, x, y, inten, escala = 1) {
  if (inten <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, x, y, 420 * escala * Math.min(1.4, inten), ROSA, 0.55 * Math.min(1, inten));
  const n = Math.round(CH.length * Math.min(1, inten));
  for (let i = 0; i < n; i++) {
    const c = CH[i], P = 0.55, age = (((t + c.f * P) % P) + P) % P / P;
    const d = age * 360 * c.v * escala * (0.6 + 0.5 * inten);
    const px = x + Math.cos(c.a) * d, py = y + Math.sin(c.a) * d - 80 * age * age * escala;
    const al = (1 - age) * Math.min(1, inten);
    g.fillStyle = `rgba(${c.c},${al})`; g.beginPath(); g.arc(px, py, c.r * escala * (1 - age * 0.5), 0, 6.2832); g.fill();
    g.fillStyle = `rgba(255,255,255,${al * 0.7})`; g.beginPath(); g.arc(px, py, c.r * escala * 0.35, 0, 6.2832); g.fill();
  }
  // ondas rosas que se abren desde el roce
  for (let j = 0; j < 3; j++) {
    const P = 0.42, age = (((t + j * P / 3) % P) + P) % P / P;
    g.strokeStyle = `rgba(255,140,210,${0.6 * (1 - age) * Math.min(1, inten)})`; g.lineWidth = 7 * escala * (1 - age * 0.6);
    g.beginPath(); g.ellipse(x, y, 40 * escala + age * 230 * escala, (40 + age * 230) * 0.72 * escala, 0, 0, 6.2832); g.stroke();
  }
  g.restore();
}
// El humo gris de las cosquillas que no hacen nada: u, de 0 a 1, desde que se apagan.
const HU = (() => { const az = azar(606); return Array.from({ length: 16 }, () => ({ a: az() * 6.2832, d: 40 + az() * 120, r: 30 + az() * 50, f: az() })); })();
export function humo(g, x, y, u, escala = 1) {
  if (u <= 0 || u >= 1) return;
  g.save();
  for (const h of HU) {
    const w = Math.min(1, u * (1 + h.f * 0.4));
    const px = x + Math.cos(h.a) * h.d * w * escala, py = y + Math.sin(h.a) * h.d * w * 0.6 * escala - 140 * w * escala;
    const r = h.r * (0.5 + w) * escala, al = 0.5 * Math.sin(Math.PI * Math.min(1, u * 1.15));
    const gr = g.createRadialGradient(px, py, 0, px, py, r);
    gr.addColorStop(0, `rgba(190,185,200,${al})`); gr.addColorStop(1, "rgba(190,185,200,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, 6.2832); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- lo que ve el otro (la vista de las gafas)
// Una mesa de laboratorio vista desde arriba, la mano del otro con la palma hacia arriba y la varilla con espuma.
// Se dibuja en el marco 1080 × 1920, pero rellena alrededor (se ve dentro de la lente, más pequeña).
// mueve: 0-1, cuánto se mueve la varilla (de lado a lado); bordeAl: el borde azul («como si fuera tuya»).
const vetas = k.ruido(256, 811, 2, 4, "lineas");
export function vista(g, t, { estilo = ROJO, mueve = 0, bordeAl = 0, chispa = 0, apaga = -1, mano = 0 } = {}) {
  // la mesa
  const mg = g.createLinearGradient(0, -600, 0, 2500);
  mg.addColorStop(0, "#3a6a8a"); mg.addColorStop(0.5, "#6aa6c4"); mg.addColorStop(1, "#2a4a66");
  g.fillStyle = mg; g.fillRect(-1500, -1500, 4080, 4920);
  g.save(); g.globalAlpha = 0.18; g.globalCompositeOperation = "multiply"; g.drawImage(vetas, -1500, -1500, 4080, 4920); g.restore();
  const luz = g.createRadialGradient(540, 900, 50, 540, 900, 1100);
  luz.addColorStop(0, "rgba(255,250,230,0.45)"); luz.addColorStop(1, "rgba(255,250,230,0)");
  g.fillStyle = luz; g.fillRect(-1500, -1500, 4080, 4920);
  // la palma del otro, que entra desde abajo (sus ojos son los tuyos)
  const tiembla = 0;
  palma(g, 540, 1180, 1.25, t, { estilo, encoge: 0, tiembla, borde: AZUL.borde, bordeAl });
  // la varilla: entra por la derecha (la mueves tú, desde tu lado de la mesa)
  const dx = Math.sin(t * 2 * Math.PI * 1.6) * 120 * mueve;
  const rx = 1250 + dx * 0.4, ry = 760;
  const ex = 540 + dx, ey = 1120;
  g.save();
  g.lineCap = "round";
  const vg = g.createLinearGradient(ex - 20, 0, ex + 20, 0); vg.addColorStop(0, "#f5d9a0"); vg.addColorStop(0.5, "#c8964e"); vg.addColorStop(1, "#7a5226");
  g.strokeStyle = vg; g.lineWidth = 34; g.beginPath(); g.moveTo(ex + 40, ey - 40); g.lineTo(rx, ry); g.stroke();
  // la espuma de la punta
  g.beginPath(); g.ellipse(ex, ey - 20, 82, 64, -0.35, 0, 6.2832);
  const eg = g.createRadialGradient(ex - 25, ey - 45, 5, ex, ey - 20, 90); eg.addColorStop(0, "#fffbd0"); eg.addColorStop(0.55, "#ffe04a"); eg.addColorStop(1, "#d89a10");
  g.fillStyle = eg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22; g.drawImage(k.manchas, ex - 100, ey - 100, 200, 170); g.restore();
  g.restore();
  // tu mano, que sujeta la varilla
  if (mano > 0.01) { g.save(); g.globalAlpha *= mano; const a = Math.atan2(ey - 40 - ry, ex + 40 - rx); dedo(g, ex + 40 + (rx - ex - 40) * 0.5, ey - 40 + (ry - ey + 40) * 0.5, a, 0.75, AZUL); g.restore(); }
  chispas(g, t, ex, ey + 10, chispa, 0.8);
  if (apaga >= 0) humo(g, ex, ey, apaga, 0.9);
}

// ---------------------------------------------------------------- las gafas de realidad virtual
// Vistas desde dentro (desde tu cara): la carcasa, la espuma y las dos lentes. Centro (x, y), escala s, giro ang.
// lente(g, i): dibuja lo que se ve en la lente i (0 izquierda, 1 derecha) ya recortado a su círculo, en coordenadas
// locales de las gafas (la lente i está en LENTES[i], de radio RL).
export const LENTES = [[-205, -10], [205, -10]], RL = 165;
export function gafas(g, x, y, s, ang, t, lente, cristal = 1) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  // la cinta
  g.fillStyle = "#1c1c26"; g.fillRect(-640, -90, 1280, 150);
  g.fillStyle = "rgba(255,255,255,0.06)"; g.fillRect(-640, -90, 1280, 12);
  // la carcasa
  redondo(g, -470, -270, 940, 520, 150);
  const cg = g.createLinearGradient(0, -270, 0, 250); cg.addColorStop(0, "#f4f6fa"); cg.addColorStop(0.5, "#c9ced8"); cg.addColorStop(1, "#7d8494");
  g.fillStyle = cg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 6; g.stroke();
  // la espuma de la cara, oscura, con el hueco de la nariz
  g.beginPath();
  g.moveTo(-420, -190); g.bezierCurveTo(-420, -240, -380, -240, -330, -240); g.lineTo(330, -240); g.bezierCurveTo(380, -240, 420, -240, 420, -190);
  g.lineTo(420, 120); g.bezierCurveTo(420, 200, 380, 210, 300, 210); g.lineTo(110, 210);
  g.bezierCurveTo(80, 210, 60, 110, 0, 105); g.bezierCurveTo(-60, 110, -80, 210, -110, 210);
  g.lineTo(-300, 210); g.bezierCurveTo(-380, 210, -420, 200, -420, 120); g.closePath();
  const eg = g.createRadialGradient(0, -20, 50, 0, -20, 480); eg.addColorStop(0, "#14141c"); eg.addColorStop(1, "#2c2c3a");
  g.fillStyle = eg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.05; g.drawImage(k.red, -500, -300, 1000, 600); g.restore();
  // las lentes
  for (let i = 0; i < 2; i++) {
    const [lx, ly] = LENTES[i];
    g.save(); g.beginPath(); g.arc(lx, ly, RL, 0, 6.2832); g.clip();
    g.fillStyle = "#000"; g.fillRect(lx - RL, ly - RL, RL * 2, RL * 2);
    lente(g, i);
    // el cristal: un reflejo curvo y el borde oscuro
    const rg = g.createRadialGradient(lx, ly, RL * 0.6, lx, ly, RL);
    rg.addColorStop(0, "rgba(0,0,0,0)"); rg.addColorStop(1, `rgba(0,0,0,${0.55 * cristal})`);
    g.fillStyle = rg; g.fillRect(lx - RL, ly - RL, RL * 2, RL * 2);
    g.restore();
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha *= cristal;
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 10; g.beginPath(); g.arc(lx, ly, RL * 0.82, -2.6, -1.7); g.stroke();
    g.restore();
    g.strokeStyle = "#3a3a48"; g.lineWidth = 14; g.beginPath(); g.arc(lx, ly, RL + 6, 0, 6.2832); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- el cerebro de luz
// De lado, mirando a la izquierda: una nube de neuronas que brillan, unidas por hilos. CEREBRO: su centro.
export const CEREBRO = { x: 540, y: 1060, w: 980, h: 760 };
function caminoCerebro(c) {
  c.beginPath();
  c.moveTo(-440, 80);
  c.bezierCurveTo(-500, -80, -420, -300, -230, -350);
  c.bezierCurveTo(-60, -400, 160, -390, 300, -310);
  c.bezierCurveTo(440, -230, 480, -80, 450, 40);
  c.bezierCurveTo(430, 120, 380, 170, 300, 175);
  c.bezierCurveTo(240, 180, 200, 160, 150, 150);
  c.bezierCurveTo(90, 220, -30, 230, -140, 200);
  c.bezierCurveTo(-250, 175, -300, 140, -340, 150);
  c.bezierCurveTo(-400, 155, -430, 120, -440, 80);
  c.closePath();
}
export const cerebroImg = (() => {
  const W = 1100, H = 900, l = lienzo(W, H), c = l.getContext("2d");
  c.translate(W / 2, H / 2);
  caminoCerebro(c);
  const bg = c.createRadialGradient(-80, -160, 40, 0, -40, 560);
  bg.addColorStop(0, "rgba(255,150,210,0.55)"); bg.addColorStop(0.6, "rgba(170,70,200,0.35)"); bg.addColorStop(1, "rgba(80,30,140,0.25)");
  c.fillStyle = bg; c.fill();
  c.save(); c.clip();
  // los pliegues, como surcos de luz
  c.lineCap = "round"; c.strokeStyle = "rgba(255,190,240,0.35)"; c.lineWidth = 7;
  const az = azar(1201);
  for (let i = 0; i < 46; i++) {
    let x = -460 + az() * 920, y = -380 + az() * 560, a = az() * 6.28;
    c.beginPath(); c.moveTo(x, y);
    for (let s = 0; s < 7; s++) { a += (az() - 0.5) * 1.8; const nx = x + Math.cos(a) * 46, ny = y + Math.sin(a) * 46; c.quadraticCurveTo(x + Math.cos(a + 0.8) * 30, y + Math.sin(a + 0.8) * 30, nx, ny); x = nx; y = ny; }
    c.stroke();
  }
  c.restore();
  // las neuronas: puntos que brillan, unidos a sus vecinas
  const pts = [];
  while (pts.length < 170) { const x = -460 + az() * 920, y = -400 + az() * 620; if ((x / 420) ** 2 + ((y + 95) / 255) ** 2 < 1) pts.push([x, y]); }
  c.globalCompositeOperation = "lighter";
  c.strokeStyle = "rgba(255,200,250,0.18)"; c.lineWidth = 2;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (d < 95) { c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[j][0], pts[j][1]); c.stroke(); } }
  for (const [x, y] of pts) {
    const gr = c.createRadialGradient(x, y, 0, x, y, 22); gr.addColorStop(0, "rgba(255,235,255,0.95)"); gr.addColorStop(0.3, "rgba(255,140,220,0.6)"); gr.addColorStop(1, "rgba(255,140,220,0)");
    c.fillStyle = gr; c.beginPath(); c.arc(x, y, 22, 0, 6.2832); c.fill();
  }
  c.globalCompositeOperation = "source-over";
  c.lineWidth = 8; c.strokeStyle = "rgba(255,200,245,0.75)"; caminoCerebro(c); c.stroke();
  return l;
})();
export const NEURONAS = (() => { const az = azar(1301), l = []; while (l.length < 60) { const x = -440 + az() * 880, y = -360 + az() * 520; l.push([x, y, az() * 6.28]); } return l; })();
export function cerebro(g, t, x, y, s, luz = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(0, -80, 100, 0, -80, 760); hg.addColorStop(0, `rgba(220,90,255,${0.22 * luz})`); hg.addColorStop(1, "rgba(220,90,255,0)");
  g.fillStyle = hg; g.fillRect(-900, -900, 1800, 1800);
  g.restore();
  g.globalAlpha *= 0.55 + 0.45 * luz;
  g.drawImage(cerebroImg, -550, -450);
  g.restore();
}

// Una onda de luz que cruza de x0 a x1 a la altura y: la señal del tacto. amp: su alto; hasta: 0-1, por dónde va
// dibujada (de izquierda a derecha); fase: para que se mueva.
export function onda(g, x0, x1, y, amp, hasta, color, al = 1, fase = 0, ancho = 9) {
  if (al <= 0.01 || hasta <= 0.001) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  const xf = mez(x0, x1, hasta), yOf = (x) => { const u = (x - x0) / (x1 - x0); const env = k.suave(k.tramo(u, 0, 0.1)) * k.suave(k.tramo(u, 1, 0.9)); return y - amp * env * Math.sin(u * 44 + fase); };
  for (const [w, a] of [[ancho * 4, 0.18], [ancho * 2, 0.35], [ancho, 1]]) {
    g.strokeStyle = `rgba(${color},${a * al})`; g.lineWidth = w;
    g.beginPath(); g.moveTo(x0, yOf(x0));
    for (let x = x0; x <= xf; x += 5) g.lineTo(x, yOf(x));
    g.stroke();
  }
  k.brillo(g, xf, yOf(xf), 110, color, 0.8 * al * (hasta < 1 ? 1 : 0));
  g.restore();
}

// ---------------------------------------------------------------- los tubos de la fuerza
// Un tubo de cristal centrado en x, de y0 (arriba) a y1 (abajo), con su líquido hasta nivel (0-1; más de 1 rebosa).
export function tubo(g, x, y0, y1, nivel, color, t, al = 1) {
  if (al <= 0.01) return;
  const w = 150, H = y1 - y0;
  g.save(); g.globalAlpha *= al;
  // el líquido
  const n = Math.min(1, nivel), top = y1 - H * n;
  g.save(); redondo(g, x - w / 2 + 10, y0, w - 20, H - 8, 30); g.clip();
  const lg = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  lg.addColorStop(0, `rgba(${mezRgb(color, "255,255,255", 0.35)},0.95)`); lg.addColorStop(0.5, `rgba(${color},0.95)`); lg.addColorStop(1, `rgba(${mezRgb(color, "0,0,0", 0.45)},0.95)`);
  g.fillStyle = lg;
  g.beginPath(); g.moveTo(x - w, y1 + 10);
  for (let xx = x - w; xx <= x + w; xx += 10) g.lineTo(xx, top + Math.sin(xx * 0.06 + t * 6) * 6 * Math.min(1, n * 4));
  g.lineTo(x + w, y1 + 10); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(x - w, top - 2, w * 2, 5);
  g.restore();
  // las rayas de medir
  g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = 3;
  for (let i = 1; i < 8; i++) { const yy = y1 - (H * i) / 8; g.beginPath(); g.moveTo(x - w / 2 + 8, yy); g.lineTo(x - w / 2 + (i % 2 ? 28 : 44), yy); g.stroke(); }
  // el cristal
  redondo(g, x - w / 2, y0 - 10, w, H + 10, 40); g.lineWidth = 5; k.vidrio(g, x - w / 2, x + w / 2, 0.5);
  k.reflejo(g, x - w * 0.32, y0 + 30, w * 0.12, H * 0.8, 0.45);
  if (nivel > 0.02) k.brillo(g, x, top, 200, color, 0.35);
  g.restore();
}

// Un reloj que va al ritmo de t y frena hasta pararse entre a y b (para que lo que se mueve repose antes de un corte).
export function frena(t, a, b) {
  if (t <= a) return t;
  const u = Math.min(1, (t - a) / (b - a));
  return a + ((b - a) * (1 - (1 - u) * (1 - u))) / 2;
}
