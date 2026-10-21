// Lo que comparten los planos de este vídeo: el mundo visto de lado, con la columna de papel doblado de pie en medio
// de una ciudad, y todo lo que hay a su alrededor a su tamaño de verdad (la calle, los edificios, el rascacielos, las
// nubes, el cielo, la Tierra y la Luna). La cámara es solo una escala: `s` píxeles por metro, y `y0`, la altura de la
// pantalla a la que está el suelo. Alejarse es bajar `s`; subir es bajar el suelo (subir `y0`).
import * as k from "#kit";

const { mez, tramo, suave: su, azar, lienzo } = k;

export const GROSOR = 1e-4;                 // un folio: 0,1 mm
export const alto = (n) => GROSOR * Math.pow(2, n);   // la columna tras n dobleces, en metros
export const RT = 6.371e6, DL = 3.844e8, RL = 1.737e6;   // radio de la Tierra, distancia a la Luna, radio de la Luna

// Lo que se ve de lejos se dibuja más grande de lo que es (la Tierra y la Luna, si no, serían un punto): el radio en
// pantalla nunca baja de estos mínimos.
export const RMIN_T = 250, RMIN_L = 140;

// La altura en pantalla de algo a h metros, y al revés.
export const yDe = (cam, h) => cam.y0 - h * cam.s;
export const hDe = (cam, y) => (cam.y0 - y) / cam.s;

// ------------------------------------------------------------------- el cielo
// El color del aire según la altura (km): azul claro abajo, cada vez más oscuro, negro en el espacio.
const CIELO = [[0, [150, 205, 255]], [2, [104, 172, 246]], [8, [58, 128, 226]], [18, [30, 84, 190]], [35, [14, 44, 130]], [60, [6, 18, 62]], [100, [3, 6, 18]]];
function colorAire(hkm) {
  if (hkm <= 0) return CIELO[0][1];
  for (let i = 1; i < CIELO.length; i++) if (hkm < CIELO[i][0]) {
    const a = CIELO[i - 1], b = CIELO[i], u = (Math.log(1 + hkm) - Math.log(1 + a[0])) / (Math.log(1 + b[0]) - Math.log(1 + a[0]));
    return [mez(a[1][0], b[1][0], u), mez(a[1][1], b[1][1], u), mez(a[1][2], b[1][2], u)];
  }
  return CIELO[CIELO.length - 1][1];
}
export const oscuridad = (hkm) => tramo(Math.log(1 + Math.max(0, hkm)), Math.log(1 + 25), Math.log(1 + 95));

const azE = azar(7);
const ESTRELLAS = Array.from({ length: 900 }, () => ({ x: azE() * 1080, y: azE() * 1920, r: 0.6 + Math.pow(azE(), 4) * 2.6, a: 0.3 + azE() * 0.7, c: ["255,255,255", "200,220,255", "255,230,200"][Math.floor(azE() * 3)] }));
const nebulosa = (() => {
  const l = lienzo(1080, 1920), c = l.getContext("2d"), a = azar(31);
  for (let i = 0; i < 14; i++) {
    const x = a() * 1080, y = a() * 1920, r = 250 + a() * 500, col = ["70,90,200", "140,70,190", "40,120,170"][i % 3];
    const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${col},0.16)`); gr.addColorStop(1, `rgba(${col},0)`);
    c.fillStyle = gr; c.fillRect(0, 0, 1080, 1920);
  }
  return l;
})();

// El cielo entero: el aire de cada altura y, donde ya es negro, las estrellas. Con la Tierra pequeña, el aire es solo
// su halo (lo dibuja la Tierra): aquí el fondo es el espacio.
function cieloDe(g, cam, cx, cy, R) {
  const plano = R > 60000;
  if (plano) {
    const gr = g.createLinearGradient(0, 0, 0, 1920);
    for (let i = 0; i <= 24; i++) { const y = (i / 24) * 1920, c = colorAire(hDe(cam, y) / 1000); gr.addColorStop(i / 24, `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`); }
    g.fillStyle = gr;
  } else {
    // el aire alrededor de la Tierra: de su borde hacia fuera (las alturas, en km, en píxeles de esta escala)
    // (cerca de la Tierra, la escala es la de la Tierra tal y como se dibuja: R px por cada RT metros)
    const fuera = R * (1 + 140000 / RT);
    const gr = g.createRadialGradient(cx, cy, R, cx, cy, fuera);
    for (let i = 0; i <= 16; i++) { const u = i / 16, hkm = ((fuera - R) * u * RT) / R / 1000, c = colorAire(hkm); gr.addColorStop(u, `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`); }
    gr.addColorStop(1, "rgb(3,6,18)");
    g.fillStyle = gr;
  }
  g.fillRect(0, 0, 1080, 1920);
  // las estrellas, donde el aire ya es negro (arriba de la pantalla, la altura más alta)
  const osc = plano ? oscuridad(hDe(cam, 0) / 1000) : 1;
  if (osc > 0.01) {
    g.save(); g.globalAlpha = osc; g.globalCompositeOperation = "lighter"; g.drawImage(nebulosa, 0, 0); g.restore();
    // al subir, las estrellas bajan un poco por la pantalla (cada vez diez veces más alto, lo mismo): se nota el viaje
    const baja = 180 * Math.log(Math.max(1, (cam.y0 - 960) / cam.s));
    for (const e of ESTRELLAS) {
      const y = (((e.y + baja) % 1920) + 1920) % 1920;
      const o = plano ? oscuridad(hDe(cam, y) / 1000) : 1;
      if (o < 0.02) continue;
      g.fillStyle = `rgba(${e.c},${e.a * o})`; g.fillRect(e.x, y, e.r, e.r);
    }
  }
  // el Sol, arriba a la izquierda: su luz
  const sol = g.createRadialGradient(-80, 140, 0, -80, 140, 900);
  sol.addColorStop(0, `rgba(255,236,190,${0.55 - 0.25 * osc})`); sol.addColorStop(0.35, `rgba(255,214,150,${0.18 - 0.08 * osc})`); sol.addColorStop(1, "rgba(255,214,150,0)");
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = sol; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// ------------------------------------------------------------------- la ciudad
// Edificios en metros: x (el centro, la columna está en 0), ancho, alto y su color de fachada. Casas de cuatro a ocho
// pisos, algunas torres y, a la derecha, el rascacielos más alto del mundo (828 m).
const azC = azar(21), FACHADAS = ["#e8b48a", "#f0d2a0", "#d98e6a", "#f2e2c4", "#c97b5c", "#e6c38e", "#b8c9d9", "#f4c07c"];
export const EDIFICIO = { x: 6.6, w: 10, h: 12.4, color: "#e9a77a", pisos: 4 };   // el de cuatro pisos, junto a la columna
export const BURJ = { x: 260, h: 828 };
const CIUDAD = [];
for (let lado of [-1, 1]) {
  let x = lado < 0 ? -14 : 13;
  while (Math.abs(x) < 4200) {
    const lejos = Math.abs(x), w = 9 + azC() * 16, torre = lejos > 60 && azC() < 0.16;
    const h = torre ? 50 + azC() * (lejos > 400 ? 260 : 110) : 9 + azC() * 18;
    if (!(lado > 0 && Math.abs(x - BURJ.x) < 60)) CIUDAD.push({ x: x + (lado * w) / 2, w, h, color: FACHADAS[Math.floor(azC() * FACHADAS.length)], z: azC() });
    x += lado * (w + 1 + azC() * 6);
  }
}
// junto a la columna, a los lados, unas torres de viviendas por las que pasa la cámara al subir
CIUDAD.push({ x: -24, w: 16, h: 46, color: "#f0d2a0", z: 1 }, { x: -46, w: 22, h: 72, color: "#d98e6a", z: 1 }, { x: 30, w: 18, h: 58, color: "#f2e2c4", z: 1 }, { x: 56, w: 24, h: 96, color: "#c97b5c", z: 1 });
CIUDAD.sort((a, b) => b.h - a.h);

// Un edificio: su fachada con la luz por la izquierda, las ventanas si se ven, y su sombra.
function casa(g, cam, XT, b, al = 1) {
  const x0 = XT + (b.x - b.w / 2) * cam.s, w = b.w * cam.s, y1 = yDe(cam, b.h), y0 = cam.y0, h = y0 - y1;
  if (h < 0.7 || x0 > 1100 || x0 + w < -20) return;
  g.save(); g.globalAlpha *= al;
  const fg = g.createLinearGradient(x0, 0, x0 + w, 0);
  fg.addColorStop(0, k.mezColor(b.color, "#ffffff", 0.18)); fg.addColorStop(0.7, b.color); fg.addColorStop(1, k.mezColor(b.color, "#3a2a30", 0.35));
  g.fillStyle = fg; g.fillRect(x0, y1, w, h);
  const pisos = b.pisos || Math.max(1, Math.round(b.h / 3.1)), alto = h / pisos;
  if (alto > 5) {
    const cols = Math.max(1, Math.round(b.w / 3.2)), aw = w / cols;
    for (let p = 0; p < pisos; p++) for (let c = 0; c < cols; c++) {
      const vx = x0 + c * aw + aw * 0.25, vy = y1 + p * alto + alto * 0.28, vw = aw * 0.5, vh = alto * 0.5;
      const vg = g.createLinearGradient(vx, vy, vx + vw, vy + vh);
      vg.addColorStop(0, "#9fd0f2"); vg.addColorStop(0.5, "#4f86b8"); vg.addColorStop(1, "#24476e");
      g.fillStyle = vg; g.fillRect(vx, vy, vw, vh);
      if (alto > 30) { g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(vx + vw * 0.1, vy + vh * 0.08, vw * 0.18, vh * 0.8); g.fillStyle = "rgba(60,40,40,0.5)"; g.fillRect(vx - vw * 0.08, vy + vh, vw * 1.16, Math.max(1, alto * 0.06)); }
    }
  } else if (alto > 1.6) {
    g.fillStyle = "rgba(40,60,90,0.35)";
    for (let p = 0; p < pisos; p++) g.fillRect(x0 + w * 0.12, y1 + p * alto + alto * 0.3, w * 0.76, alto * 0.4);
  }
  // la cornisa y el borde de luz
  g.fillStyle = "rgba(255,250,235,0.5)"; g.fillRect(x0, y1, w, Math.max(1, h * 0.02));
  g.fillStyle = "rgba(255,245,220,0.45)"; g.fillRect(x0, y1, Math.max(1, w * 0.04), h);
  g.restore();
}

// El rascacielos más alto del mundo: una aguja de cristal escalonada que se estrecha hasta la punta.
function rascacielos(g, cam, XT, al = 1) {
  const s = cam.s, xc = XT + BURJ.x * s, y0 = cam.y0, H = BURJ.h * s;
  if (H < 2 || xc > 1200) return;
  g.save(); g.globalAlpha *= al;
  // escalones: [altura relativa, medio ancho relativo]
  const P = [[0, 0.11], [0.18, 0.1], [0.18, 0.085], [0.36, 0.075], [0.36, 0.06], [0.52, 0.05], [0.52, 0.038], [0.66, 0.03], [0.66, 0.02], [0.8, 0.012], [1, 0.0015]];
  const anchoBase = H;
  g.beginPath();
  g.moveTo(xc - P[0][1] * anchoBase, y0);
  for (const [h, a] of P) g.lineTo(xc - a * anchoBase, y0 - h * H);
  for (let i = P.length - 1; i >= 0; i--) g.lineTo(xc + P[i][1] * anchoBase * 0.8, y0 - P[i][0] * H);
  g.closePath();
  const cg = g.createLinearGradient(xc - 0.11 * anchoBase, 0, xc + 0.09 * anchoBase, 0);
  cg.addColorStop(0, "#f4f9ff"); cg.addColorStop(0.35, "#b5d2ee"); cg.addColorStop(0.62, "#6c97c4"); cg.addColorStop(1, "#2c4a74");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip();
  g.globalAlpha *= 0.25; g.fillStyle = "#ffffff";
  for (let i = 1; i < 40; i++) g.fillRect(xc - anchoBase * 0.12, y0 - (i / 40) * H * 0.8, anchoBase * 0.24, Math.max(0.5, H * 0.002));
  g.restore();
  g.restore();
}

// ------------------------------------------------------------------- las nubes
const azN = azar(44), NUBES = [];
for (let i = 0; i < 70; i++) {
  const hkm = 1.2 + Math.pow(azN(), 1.4) * 9, ancho = 1500 + azN() * 5000;
  NUBES.push({ x: (azN() - 0.5) * 60000, h: hkm * 1000, w: ancho, bolas: Array.from({ length: 7 }, () => [(azN() - 0.5) * 1.6, (azN() - 0.2) * 0.35, 0.25 + azN() * 0.35]) });
}
// unas cuantas justo al lado de la columna, para que la cámara las atraviese al subir
for (let i = 0; i < 9; i++) NUBES.push({ x: (i % 2 ? 1 : -1) * (300 + azN() * 900), h: 1500 + i * 900 + azN() * 400, w: 1400 + azN() * 1400, bolas: Array.from({ length: 7 }, () => [(azN() - 0.5) * 1.6, (azN() - 0.2) * 0.35, 0.25 + azN() * 0.35]) });

function nubes(g, cam, XT) {
  for (const n of NUBES) {
    const w = n.w * cam.s;
    if (w < 6) continue;
    const al = tramo(w, 6, 40) * (1 - tramo(w, 2600, 6000));
    if (al <= 0.01) continue;
    const x = XT + n.x * cam.s, y = yDe(cam, n.h);
    if (x + w < -100 || x - w > 1180 || y + w * 0.6 < -100 || y - w * 0.6 > 2020) continue;
    g.save(); g.globalAlpha *= al * 0.92;
    for (const [bx, by, br] of n.bolas) {
      const cx = x + bx * w * 0.5, cy = y + by * w * 0.5, r = br * w * 0.5;
      const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy, r);
      gr.addColorStop(0, "rgba(255,255,255,0.95)"); gr.addColorStop(0.55, "rgba(242,246,255,0.75)"); gr.addColorStop(0.85, "rgba(196,214,240,0.35)"); gr.addColorStop(1, "rgba(196,214,240,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }
}

// ------------------------------------------------------------------- la Tierra y el suelo
// El radio con que se dibuja (nunca menos que RMIN_T) y su centro, con su punto más alto siempre en el suelo (y0).
export const radioTierra = (cam) => Math.sqrt(Math.pow(RT * cam.s, 2) + RMIN_T * RMIN_T);
const suelo = (() => {
  const l = lienzo(1080, 700), c = l.getContext("2d");
  const gr = c.createLinearGradient(0, 0, 0, 700);
  gr.addColorStop(0, "#e2b98c"); gr.addColorStop(0.08, "#c99a6e"); gr.addColorStop(0.5, "#9a6a4a"); gr.addColorStop(1, "#4a2a22");
  c.fillStyle = gr; c.fillRect(0, 0, 1080, 700);
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.4; c.drawImage(k.manchas, 0, 0, 1080, 700);
  return l;
})();

function tierraYSuelo(g, cam, t, XT) {
  const R = radioTierra(cam), cy = cam.y0 + R, cx = XT;
  if (cam.y0 > 2400 && R > 60000) return { cx, cy, R };
  if (R > 60000) {
    // de cerca: el suelo es plano. La acera de la calle, y bajo ella la tierra.
    const y0 = cam.y0;
    // la tierra (la acera de baldosas, de un color cálido)
    g.drawImage(suelo, 0, y0, 1080, Math.max(1, 1920 - y0 + 40));
    // las juntas de las baldosas, cuando se ven (baldosas de 40 cm)
    const bald = 0.4 * cam.s;
    if (bald > 14 && bald < 500) {
      g.save(); g.globalAlpha = Math.min(1, (bald - 14) / 30) * 0.5;
      g.strokeStyle = "#7a5a40"; g.lineWidth = Math.max(1, bald * 0.03);
      for (let i = 1; i < 12; i++) { const yy = y0 + bald * 0.35 * i * (1 + i * 0.25); if (yy > 1920) break; g.beginPath(); g.moveTo(0, yy); g.lineTo(1080, yy); g.stroke(); }
      for (let x = ((XT % bald) + bald) % bald - bald; x < 1080 + bald; x += bald) { g.beginPath(); g.moveTo(x, y0); g.lineTo(XT + (x - XT) * 2.2, 1920); g.stroke(); }
      g.restore();
    }
    // la franja de la acera, con su borde de luz
    const bord = Math.max(3, Math.min(40, 0.25 * cam.s));
    const ag = g.createLinearGradient(0, y0, 0, y0 + bord * 2);
    ag.addColorStop(0, "#f3d8b4"); ag.addColorStop(1, "rgba(200,160,120,0)");
    g.fillStyle = ag; g.fillRect(0, y0, 1080, bord * 2);
    // a lo lejos, la tierra se va volviendo verde y azulada
    const lejos = tramo(Math.log(1920 / cam.s), Math.log(2000), Math.log(60000));
    if (lejos > 0) { g.save(); g.globalAlpha = lejos; const lg = g.createLinearGradient(0, y0, 0, 1920); lg.addColorStop(0, "#9cc7a8"); lg.addColorStop(0.3, "#3a8a6a"); lg.addColorStop(1, "#173a6a"); g.fillStyle = lg; g.fillRect(0, y0, 1080, 1920 - y0 + 40); g.restore(); }
    return { cx, cy, R };
  }
  // de lejos: la Tierra, redonda. Primero un arco enorme de tierra y mar, con los mismos colores que el suelo de lejos
  // (para que no se note el paso de uno a otro); al encogerse, la Tierra de verdad, con sus mares, nubes y giro.
  const lejos = tramo(R, 1500, 600);
  if (lejos < 1) {
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2);
    const tg = g.createLinearGradient(0, cam.y0, 0, 1920);
    tg.addColorStop(0, "#9cc7a8"); tg.addColorStop(0.3, "#3a8a6a"); tg.addColorStop(1, "#173a6a");
    g.fillStyle = tg; g.fill(); g.restore();
  }
  if (lejos > 0) { g.save(); g.globalAlpha *= lejos; k.tierra(g, cx, cy, R, 0.31 + t * 0.004, -0.7, -0.6); g.restore(); }
  void lejos;
  return { cx, cy, R };
}

// ------------------------------------------------------------------- la Luna
const crateres = (() => { const a = azar(91); return Array.from({ length: 34 }, () => ({ x: (a() - 0.5) * 1.7, y: (a() - 0.5) * 1.7, r: 0.025 + Math.pow(a(), 2.2) * 0.12 })); })();
const MARES = [[-0.28, -0.22, 0.3, 0.22], [0.16, -0.36, 0.2, 0.16], [0.08, 0.1, 0.24, 0.2], [-0.36, 0.3, 0.17, 0.14], [0.36, 0.05, 0.12, 0.1]];
// La Luna, iluminada por el Sol desde arriba a la izquierda: blanca y crema, sus mares grises azulados, sus cráteres
// con el borde de luz, y su lado de noche.
export function luna(g, x, y, r, gira = 0) {
  if (r < 0.6) return;
  k.brillo(g, x, y, r * 3.4, "255,246,226", 0.45);
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
  const bg = g.createRadialGradient(x - r * 0.35, y - r * 0.38, r * 0.05, x, y, r * 1.05);
  bg.addColorStop(0, "#ffffff"); bg.addColorStop(0.4, "#f7f1e4"); bg.addColorStop(0.78, "#d9d1c2"); bg.addColorStop(1, "#aaa39a");
  g.fillStyle = bg; g.fillRect(x - r, y - r, r * 2, r * 2);
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.3; k.girado(g, k.manchas, x, y, r * 2.4, gira);
  g.globalAlpha = 1;
  for (const [mx, my, rx, ry] of MARES) {
    const mg = g.createRadialGradient(x + mx * r, y + my * r, 0, x + mx * r, y + my * r, rx * r);
    mg.addColorStop(0, "rgba(150,152,170,0.85)"); mg.addColorStop(0.7, "rgba(170,170,185,0.6)"); mg.addColorStop(1, "rgba(200,198,205,0)");
    g.fillStyle = mg; g.beginPath(); g.ellipse(x + mx * r, y + my * r, rx * r, ry * r, 0.5, 0, Math.PI * 2); g.fill();
  }
  g.globalCompositeOperation = "source-over";
  for (const c of crateres) {
    if (c.x * c.x + c.y * c.y > 0.8) continue;
    const cx = x + c.x * r * 0.62, cy = y + c.y * r * 0.62, cr = c.r * r;
    const cg = g.createRadialGradient(cx + cr * 0.25, cy + cr * 0.25, 0, cx, cy, cr);
    cg.addColorStop(0, "rgba(120,112,108,0.45)"); cg.addColorStop(0.8, "rgba(140,130,125,0.3)"); cg.addColorStop(1, "rgba(140,130,125,0)");
    g.fillStyle = cg; g.beginPath(); g.arc(cx, cy, cr, 0, Math.PI * 2); g.fill();
    const lg = g.createRadialGradient(cx + cr * 0.45, cy + cr * 0.45, 0, cx + cr * 0.45, cy + cr * 0.45, cr * 0.7);
    lg.addColorStop(0, "rgba(255,250,236,0.35)"); lg.addColorStop(1, "rgba(255,250,236,0)");
    g.fillStyle = lg; g.beginPath(); g.arc(cx, cy, cr, 0, Math.PI * 2); g.fill();
  }
  const sg = g.createLinearGradient(x - r * 0.7, y - r * 0.7, x + r * 0.8, y + r * 0.8);
  sg.addColorStop(0, "rgba(0,0,0,0)"); sg.addColorStop(0.55, "rgba(10,10,30,0.08)"); sg.addColorStop(0.85, "rgba(10,10,30,0.55)"); sg.addColorStop(1, "rgba(5,5,20,0.85)");
  g.fillStyle = sg; g.fillRect(x - r, y - r, r * 2, r * 2);
  g.restore();
  // el borde iluminado
  g.save(); g.strokeStyle = "rgba(255,250,235,0.5)"; g.lineWidth = Math.max(1.5, r * 0.012); g.beginPath(); g.arc(x, y, r - 1, Math.PI * 0.75, Math.PI * 1.75); g.stroke(); g.restore();
}
export const radioLuna = (cam) => Math.sqrt(Math.pow(RL * cam.s, 2) + RMIN_L * RMIN_L);
// Dónde está la Luna en pantalla: a su distancia, a la derecha de la columna.
export function sitioLuna(cam, XT, ancho) {
  const r = radioLuna(cam);
  return { x: XT + ancho / 2 + r * 1.25, y: yDe(cam, DL), r };
}

// ------------------------------------------------------------------- la columna de papel
// Las rayas de las capas, cuando son tan finas que no se cuentan: una textura que se mueve con el mundo.
const rayas = (() => {
  const l = lienzo(64, 512), c = l.getContext("2d"), a = azar(5);
  c.fillStyle = "#fff"; c.fillRect(0, 0, 64, 512);
  for (let y = 0; y < 512; y += 4 + Math.floor(a() * 4)) { c.fillStyle = `rgba(120,110,100,${0.18 + a() * 0.22})`; c.fillRect(0, y, 64, 1 + (a() < 0.3 ? 1 : 0)); }
  return l;
})();

// La columna de papel de pie en XT, desde el suelo hasta H metros, de `ancho` px. brilla: su luz en el espacio (0 a 1).
// tramos: [{ h0, h1, color, al }] partes que se encienden (el último doblez, cada doblez).
export function columna(g, cam, XT, H, ancho, brilla = 0, tramos = []) {
  const yb = Math.min(cam.y0, 2100), yt = yDe(cam, H);
  if (yt > yb) return;
  const x0 = XT - ancho / 2, top = Math.max(yt, -200);
  // su luz alrededor (en el espacio se ve como un hilo de luz)
  if (brilla > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    const hg = g.createLinearGradient(XT - ancho * 2.5, 0, XT + ancho * 2.5, 0);
    hg.addColorStop(0, "rgba(255,236,200,0)"); hg.addColorStop(0.5, `rgba(255,236,200,${0.3 * brilla})`); hg.addColorStop(1, "rgba(255,236,200,0)");
    g.fillStyle = hg; g.fillRect(XT - ancho * 2.5, top, ancho * 5, yb - top);
    g.restore();
  }
  g.save();
  g.beginPath(); g.rect(x0, top, ancho, yb - top); g.clip();
  const pg = g.createLinearGradient(x0, 0, x0 + ancho, 0);
  pg.addColorStop(0, "#fffdf6"); pg.addColorStop(0.35, "#fbf6ea"); pg.addColorStop(0.8, "#dcd9d6"); pg.addColorStop(1, "#b9bccb");
  g.fillStyle = pg; g.fillRect(x0, top, ancho, yb - top);
  // las capas
  const d = GROSOR * cam.s;
  g.globalCompositeOperation = "multiply";
  if (d >= 3) {
    const n0 = Math.max(0, Math.floor((cam.y0 - yb) / d)), n1 = Math.min(Math.ceil(H / GROSOR), Math.ceil((cam.y0 - top) / d));
    g.fillStyle = "rgba(150,135,120,0.75)";
    for (let i = n0 + 1; i < n1; i++) g.fillRect(x0, cam.y0 - i * d - Math.max(0.6, d * 0.04), ancho, Math.max(1, d * 0.08));
  } else {
    const fase = ((cam.y0 % 512) + 512) % 512;
    for (let y = top - 512 + ((fase - top) % 512 + 512) % 512; y < yb; y += 512) g.drawImage(rayas, x0, y, ancho, 512);
  }
  g.globalCompositeOperation = "source-over";
  for (const tr of tramos) {
    if (!tr.al || tr.al < 0.01) continue;
    const a = yDe(cam, tr.h1), b = yDe(cam, tr.h0);
    g.save(); g.globalAlpha = tr.al;
    g.fillStyle = `rgb(${tr.color})`; g.fillRect(x0, a, ancho, b - a); g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = tr.al * 0.5;
    const lg = g.createLinearGradient(x0 - ancho * 2, 0, x0 + ancho * 3, 0);
    lg.addColorStop(0, `rgba(${tr.color},0)`); lg.addColorStop(0.5, `rgba(${tr.color},0.6)`); lg.addColorStop(1, `rgba(${tr.color},0)`);
    g.fillStyle = lg; g.fillRect(x0 - ancho * 2, a, ancho * 5, b - a); g.restore();
  }
  // el lado de sombra y el borde de luz
  const sg = g.createLinearGradient(x0, 0, x0 + ancho, 0);
  sg.addColorStop(0, "rgba(255,255,255,0.55)"); sg.addColorStop(0.08, "rgba(255,255,255,0)"); sg.addColorStop(0.85, "rgba(40,40,70,0)"); sg.addColorStop(1, "rgba(40,40,70,0.35)");
  g.fillStyle = sg; g.fillRect(x0, top, ancho, yb - top);
  g.restore();
  // la punta: el doblez de arriba, redondeado
  if (yt > -100) {
    g.save();
    g.beginPath(); g.moveTo(x0, yt + ancho * 0.12); g.quadraticCurveTo(x0, yt, x0 + ancho * 0.12, yt); g.lineTo(x0 + ancho * 0.88, yt); g.quadraticCurveTo(x0 + ancho, yt, x0 + ancho, yt + ancho * 0.12); g.lineTo(x0 + ancho, yt + Math.min(ancho * 0.3, 22)); g.lineTo(x0, yt + Math.min(ancho * 0.3, 22)); g.closePath();
    g.fillStyle = "#fffef9"; g.fill();
    g.restore();
    if (brilla > 0.01) k.brillo(g, XT, yt, ancho * 6, "255,244,220", 0.7 * brilla);
  }
  // su sombra en el suelo
  if (cam.y0 < 1950) {
    const sh = g.createRadialGradient(XT + ancho * 0.9, cam.y0 + 4, 0, XT + ancho * 0.9, cam.y0 + 4, ancho * 1.6);
    sh.addColorStop(0, "rgba(40,20,10,0.4)"); sh.addColorStop(1, "rgba(40,20,10,0)");
    g.fillStyle = sh; g.fillRect(XT - ancho, cam.y0 - 20, ancho * 4, 60);
  }
}

// ------------------------------------------------------------------- todo junto
// El mundo entero visto con la cámara cam ({ s, y0 }), con la columna en XT, de H metros y `ancho` px.
// o.columnaAparte: si se dibuja la columna fuera (para doblarla); o.ciudad: transparencia de la ciudad.
export function mundo(g, t, cam, XT, H, ancho, o = {}) {
  const R = radioTierra(cam), cy = cam.y0 + R;
  cieloDe(g, cam, XT, cy, R);
  // la Luna
  const L = sitioLuna(cam, XT, ancho);
  if (L.y + L.r > -50 && L.y - L.r < 2000) luna(g, L.x, L.y, L.r, 0.6 + t * 0.01);
  nubes(g, cam, XT);
  // la ciudad: las torres de detrás primero
  const ciudad = o.ciudad ?? 1;
  if (ciudad > 0.01 && cam.y0 < 2100) {
    for (const b of CIUDAD) casa(g, cam, XT, b, ciudad);
    rascacielos(g, cam, XT, ciudad);
    casa(g, cam, XT, EDIFICIO, ciudad);
  }
  tierraYSuelo(g, cam, t, XT);
  // el aire alrededor de la Tierra pequeña (encima de su borde)
  if (R < 60000) {
    // tan grueso como su aire de verdad (unos 100 km) cuando es grande; algo más cuando se ve pequeña
    const fuera = R * (1 + mez(0.016, 0.12, tramo(R, 3000, 300))), al = 0.6 * tramo(R, 60000, 15000);
    const r0 = R * (1 - mez(0.004, 0.03, tramo(R, 3000, 300))), halo = g.createRadialGradient(XT, cy, r0, XT, cy, fuera);
    halo.addColorStop(0, "rgba(130,190,255,0)"); halo.addColorStop((R - r0) / (fuera - r0), `rgba(130,190,255,${al})`); halo.addColorStop(1, "rgba(130,190,255,0)");
    g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = halo; g.beginPath(); g.arc(XT, cy, fuera, 0, Math.PI * 2); g.fill(); g.restore();
  }
  // un velo oscuro suave arriba, donde va el subtítulo, cuando detrás el cielo es claro
  const claro = 1 - oscuridad(hDe(cam, 400) / 1000);
  if (claro > 0.02) {
    const vg = g.createLinearGradient(0, 160, 0, 700);
    vg.addColorStop(0, `rgba(8,20,48,${0.5 * claro})`); vg.addColorStop(0.55, `rgba(8,20,48,${0.36 * claro})`); vg.addColorStop(1, "rgba(8,20,48,0)");
    g.fillStyle = vg; g.fillRect(0, 0, 1080, 700);
  }
  const brilla = oscuridad(H / 1000) * tramo(Math.log(1 + ancho), 0, 1);
  if (!o.columnaAparte) columna(g, cam, XT, H, ancho, brilla * (o.brilla ?? 1), o.tramos || []);
  // de muy cerca, el papel llena la pantalla de blanco: otro velo suave arriba, para el subtítulo
  const blanco = 0.55 * tramo(ancho, 500, 1300);
  if (blanco > 0.01) {
    const vg = g.createLinearGradient(0, 200, 0, 640);
    vg.addColorStop(0, `rgba(30,24,20,${blanco})`); vg.addColorStop(0.6, `rgba(30,24,20,${blanco * 0.7})`); vg.addColorStop(1, "rgba(30,24,20,0)");
    g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
  }
  return { L, R, cy, brilla };
}

// El ancho de la columna en pantalla: ancha en la calle, más fina cuanto más lejos (sigue siendo un hilo visible).
// De muy cerca (unos centímetros de pantalla) la columna llena la pantalla y se ven sus capas.
export const anchoColumna = (cam) => {
  const vista = Math.log(1920 / cam.s);
  return mez(1500, mez(140, 46, tramo(vista, Math.log(30), Math.log(4e6))), su(tramo(vista, Math.log(0.03), Math.log(3))));
};

// Una cámara dicha como la altura que hay en el centro de la pantalla (hc, en metros) y lo que se ve de alto (vista).
export const camaraEn = (hc, vista) => { const s = 1920 / vista; return { s, y0: 960 + hc * s }; };
export const comoVista = (cam) => ({ hc: (cam.y0 - 960) / cam.s, vista: 1920 / cam.s });
// Un viaje de cámara por claves [t, hc, vista], sin tirones (en logaritmos: cada vez diez veces más lejos, al mismo ritmo).
export function viaje(claves) {
  const h = k.curva(claves.map(([t, hc]) => [t, Math.log(hc)]), undefined, 0), v = k.curva(claves.map(([t, , vi]) => [t, Math.log(vi)]), undefined, 0);
  return (t) => camaraEn(Math.exp(h(t)), Math.exp(v(t)));
}

// La cámara que sigue a la columna: el suelo en ySuelo y la punta (H metros) en yPunta.
export const camaraPara = (H, ySuelo = 1350, yPunta = 640) => ({ s: (ySuelo - yPunta) / H, y0: ySuelo });

// El texto de una altura: «13 m», «839 m», «107 km», «440.000 km».
export function textoAltura(h) {
  if (h < 0.01) return [k.fmt(h * 1000, 1), "mm"];
  if (h < 1) return [k.fmt(h * 100, 0), "cm"];
  if (h < 1000) return [k.fmt(h, 0), "m"];
  if (h < 1e7) return [k.fmt(h / 1000, 0), "km"];
  return [k.fmt(Math.round(h / 1e7) * 10000, 0), "km"];
}

// «¿Cómo llega tan lejos algo tan fino?»: la cámara se lanza hacia abajo por la columna, desde la Luna hasta su pie, y
// frena pegada a sus capas en «fino». Las claves del viaje, para las dos aperturas del hook.
export const bajada = (Tcomo, Tfino) => [
  [Tcomo + 0.45, 6e7, 1.2e8],
  [Tcomo + 0.8, 2.5e6, 6e6],
  [Tcomo + 1.1, 4e4, 8e4],
  [Tcomo + 1.35, 600, 1200],
  [Tcomo + 1.55, 6, 12],
  [Tfino + 0.1, 0.0121, 0.0302],
  [Tfino + 0.45, 0.012, 0.03],
];
