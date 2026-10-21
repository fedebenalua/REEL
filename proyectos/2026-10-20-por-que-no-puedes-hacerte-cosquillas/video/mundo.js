// Lo que comparten los planos: el pie descalzo, la pluma, las manos (la tuya con el pijama de rayas azules, la del otro
// con la sudadera roja), las chispas de las cosquillas y el fondo del salón.
// Todo en 2D, en coordenadas del mundo (px con zoom 1); vista() pone la cámara.
import * as k from "#kit";

const { azar, lienzo, mez, tramo, suave } = k;

// ---------------------------------------------------------------- la cámara 2D
// Mira al punto (cx, cy) del mundo con zoom Z (y girada ang): lo que está en (cx, cy) sale en el centro de la pantalla.
export function vista(g, Z, cx, cy, ang = 0) {
  g.setTransform(1, 0, 0, 1, 540, 960); g.rotate(ang); g.scale(Z, Z); g.translate(-cx, -cy);
}
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (el zoom, en log).
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}

// ---------------------------------------------------------------- los colores
export const ORO = "255,200,80", ROSA = "255,110,170", CIAN = "110,230,255", ROJO = "255,60,70";
export const PIEL = { luz: "#ffd9c2", base: "#f0b394", sombra: "#c27a62", honda: "#8a4a3c" };

// ---------------------------------------------------------------- el fondo del salón
// Morado y templado, con luces desenfocadas de lámparas (bokeh). Se dibuja en pantalla.
const BOKEH = (() => { const az = azar(77), l = []; for (let i = 0; i < 22; i++) l.push({ x: az() * 1080, y: az() * 1920, r: 60 + az() * 150, c: ["255,170,90", "255,120,170", "150,120,255", "255,210,140"][i % 4], f: az() * 6 }); return l; })();
export function fondoSalon(g, t, dx = 0, dy = 0) {
  g.save(); sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#1a0b2e"); bg.addColorStop(0.5, "#3a1340"); bg.addColorStop(1, "#130818");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) {
    const x = ((b.x + dx * 0.3) % 1300 + 1300) % 1300 - 110, y = ((b.y + dy * 0.3) % 2100 + 2100) % 2100 - 90, a = 0.16 + 0.05 * Math.sin(t * 1.3 + b.f);
    const gr = g.createRadialGradient(x, y, 0, x, y, b.r);
    gr.addColorStop(0, `rgba(${b.c},${a})`); gr.addColorStop(0.75, `rgba(${b.c},${a * 0.6})`); gr.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, b.r, 0, 6.2832); g.fill();
  }
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 0.1; g.drawImage(k.manchas, -200, -200, 1500, 2400);
  g.restore();
}
export function vineta(g, al = 0.55) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 520, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.55, color = "12,5,20") {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(${color},${al})`); vg.addColorStop(0.6, `rgba(${color},${al * 0.7})`); vg.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}

// ---------------------------------------------------------------- las telas
// El pijama: azul con rayas finas claras. La sudadera: roja, con su punto.
const tela = (fondo, raya, cada, ancho, sem) => {
  const l = lienzo(512), c = l.getContext("2d");
  c.fillStyle = fondo; c.fillRect(0, 0, 512, 512);
  if (raya) { c.fillStyle = raya; for (let x = 0; x < 512; x += cada) c.fillRect(x, 0, ancho, 512); }
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.35; c.drawImage(k.ruido(256, sem, 18, 2, "lineas"), 0, 0, 512, 512);
  return l;
};
export const PIJAMA = tela("#2f5fb8", "#b9d3ff", 46, 9, 301);
export const SUDADERA = tela("#d8283a", null, 0, 0, 307);

// Una manga: un tubo de tela de (x0, y0) a (x1, y1), de ancho w, con su puño en el extremo (x1, y1).
// tipo: "pijama" o "roja".
export function manga(g, x0, y0, x1, y1, w, tipo) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
  g.save(); g.translate(x0, y0); g.rotate(a);
  g.beginPath(); g.moveTo(0, -w * 0.55); g.lineTo(L, -w / 2); g.quadraticCurveTo(L + w * 0.08, 0, L, w / 2); g.lineTo(0, w * 0.55); g.closePath();
  g.save(); g.clip();
  g.save(); g.rotate(Math.PI / 2); g.drawImage(tipo === "roja" ? SUDADERA : PIJAMA, -w, -L - 40, w * 2.4, L + 80); g.restore();
  // el volumen: luz arriba, sombra abajo; pliegues
  const sg = g.createLinearGradient(0, -w / 2, 0, w / 2);
  sg.addColorStop(0, "rgba(255,255,255,0.28)"); sg.addColorStop(0.35, "rgba(255,255,255,0)"); sg.addColorStop(0.7, "rgba(0,0,20,0.25)"); sg.addColorStop(1, "rgba(0,0,20,0.6)");
  g.fillStyle = sg; g.fillRect(-10, -w, L + 20, w * 2);
  g.strokeStyle = "rgba(0,0,30,0.25)"; g.lineWidth = w * 0.06;
  for (let i = 1; i < 5; i++) { const x = L * (i / 5.5); g.beginPath(); g.moveTo(x, -w / 2); g.quadraticCurveTo(x + w * 0.25, 0, x - w * 0.05, w / 2); g.stroke(); }
  g.restore();
  // el puño
  g.beginPath(); g.ellipse(L - w * 0.06, 0, w * 0.14, w * 0.52, 0, 0, 6.2832);
  g.fillStyle = tipo === "roja" ? "#9a1424" : "#22468c"; g.fill();
  if (tipo === "roja") { g.strokeStyle = "rgba(255,120,120,0.35)"; g.lineWidth = 3; for (let i = -4; i <= 4; i++) { g.beginPath(); g.moveTo(L - w * 0.18, i * w * 0.1); g.lineTo(L + w * 0.06, i * w * 0.1); g.stroke(); } }
  g.restore();
}

// ---------------------------------------------------------------- la piel
const poros = k.ruido(512, 211, 90, 2, "manchas");
function texturaPiel(g, x, y, w, h, al = 0.22) {
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= al * 0.2; g.drawImage(poros, x, y, w, h); g.restore();
}

// ---------------------------------------------------------------- el pie
// La planta de un pie descalzo, vista desde abajo, con los dedos arriba. Origen en el centro de la planta; mide unos
// 1450 px del talón a la punta del dedo gordo. encoge: de 0 a 1, los dedos se encogen (cosquillas). agita: de 0 a 1,
// los dedos se mueven cada uno a su aire. t: el segundo del vídeo.
const DEDOS = [
  { x: -170, y: -590, rx: 102, ry: 165, a: -0.1 },
  { x: -32, y: -610, rx: 62, ry: 125, a: -0.03 },
  { x: 70, y: -592, rx: 56, ry: 112, a: 0.06 },
  { x: 160, y: -556, rx: 51, ry: 98, a: 0.16 },
  { x: 236, y: -494, rx: 45, ry: 80, a: 0.32 },
];
function caminoPlanta(g) {
  g.beginPath();
  g.moveTo(0, 735);
  g.bezierCurveTo(115, 738, 195, 650, 198, 520);          // el talón, por fuera
  g.bezierCurveTo(205, 340, 225, 140, 268, -60);           // el borde de fuera, que se abre
  g.bezierCurveTo(300, -220, 320, -330, 285, -420);        // la bola, por fuera
  g.bezierCurveTo(215, -480, 60, -505, -70, -495);         // donde nacen los dedos
  g.bezierCurveTo(-220, -484, -315, -450, -318, -330);     // la bola, por dentro
  g.bezierCurveTo(-320, -190, -190, -40, -150, 140);       // el puente (hacia dentro)
  g.bezierCurveTo(-130, 280, -195, 390, -192, 520);
  g.bezierCurveTo(-192, 650, -112, 732, 0, 735);
  g.closePath();
}
const plantaImg = (() => {
  const l = lienzo(700, 1600), c = l.getContext("2d");
  c.translate(350, 820);
  caminoPlanta(c); c.save(); c.clip();
  const bg = c.createLinearGradient(-300, 0, 300, 0);
  bg.addColorStop(0, "#c46f63"); bg.addColorStop(0.3, "#f2a98f"); bg.addColorStop(0.62, "#ffd2bd"); bg.addColorStop(1, "#ee9d86");
  c.fillStyle = bg; c.fillRect(-350, -820, 700, 1600);
  // las almohadillas: el talón y la bola, más claras y rosadas
  for (const [x, y, rx, ry] of [[0, 520, 220, 240], [0, -330, 280, 170], [180, 80, 90, 260]]) {
    const pg = c.createRadialGradient(x - rx * 0.2, y - ry * 0.2, 10, x, y, Math.max(rx, ry));
    pg.addColorStop(0, "rgba(255,226,212,0.95)"); pg.addColorStop(0.6, "rgba(250,196,176,0.5)"); pg.addColorStop(1, "rgba(250,196,176,0)");
    c.fillStyle = pg; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 6.2832); c.fill();
  }
  // el puente, en sombra
  const ag = c.createRadialGradient(-260, 120, 20, -230, 120, 260);
  ag.addColorStop(0, "rgba(150,70,60,0.75)"); ag.addColorStop(1, "rgba(150,70,60,0)");
  c.fillStyle = ag; c.fillRect(-350, -200, 400, 640);
  texturaPiel(c, -350, -820, 700, 1600, 0.3);
  // las arrugas de la planta
  c.lineCap = "round";
  const az = azar(5);
  for (let i = 0; i < 14; i++) {
    const y = -420 + az() * 1050, x = -200 + az() * 400, L = 40 + az() * 90, cv = (az() - 0.5) * 30;
    c.strokeStyle = `rgba(140,70,60,${0.18 + az() * 0.18})`; c.lineWidth = 2 + az() * 2;
    c.beginPath(); c.moveTo(x - L / 2, y); c.quadraticCurveTo(x, y + cv, x + L / 2, y + cv * 0.4); c.stroke();
    c.strokeStyle = "rgba(255,235,225,0.25)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - L / 2, y + 3); c.quadraticCurveTo(x, y + cv + 3, x + L / 2, y + cv * 0.4 + 3); c.stroke();
  }
  // el pliegue donde nacen los dedos
  c.strokeStyle = "rgba(130,60,52,0.55)"; c.lineWidth = 7;
  c.beginPath(); c.moveTo(-270, -420); c.bezierCurveTo(-150, -470, 120, -470, 255, -400); c.stroke();
  // el borde en sombra y el reflejo de la luz por fuera
  const sh = c.createRadialGradient(40, 0, 300, 0, 0, 900);
  sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(80,20,30,0.55)");
  c.fillStyle = sh; c.fillRect(-350, -820, 700, 1600);
  c.restore();
  c.lineWidth = 8; c.strokeStyle = "rgba(255,225,205,0.55)";
  c.save(); caminoPlanta(c); c.clip(); c.beginPath(); c.moveTo(232, 560); c.bezierCurveTo(240, 300, 245, 100, 268, -60); c.stroke(); c.restore();
  return l;
})();
const dedoImg = (() => {
  const l = lienzo(220, 300), c = l.getContext("2d"); // un dedo de lado a lado 200 px y de alto 280
  c.translate(110, 150);
  c.beginPath(); c.ellipse(0, 0, 100, 140, 0, 0, 6.2832); c.save(); c.clip();
  const bg = c.createRadialGradient(25, -35, 10, 0, 0, 150);
  bg.addColorStop(0, "#ffe6d8"); bg.addColorStop(0.55, PIEL.base); bg.addColorStop(1, PIEL.sombra);
  c.fillStyle = bg; c.fillRect(-110, -150, 220, 300);
  texturaPiel(c, -110, -150, 220, 300, 0.35);
  // la yema, más clara, y el pliegue de la falange
  const yg = c.createRadialGradient(10, -45, 5, 0, -40, 80); yg.addColorStop(0, "rgba(255,232,222,0.9)"); yg.addColorStop(1, "rgba(255,232,222,0)");
  c.fillStyle = yg; c.fillRect(-100, -140, 200, 200);
  c.strokeStyle = "rgba(140,64,56,0.55)"; c.lineWidth = 6; c.beginPath(); c.moveTo(-70, 55); c.quadraticCurveTo(0, 75, 70, 55); c.stroke();
  c.restore();
  return l;
})();
export function pie(g, t, { encoge = 0, agita = 0, al = 1 } = {}) {
  if (al <= 0.003) return;
  g.save(); g.globalAlpha *= al;
  // la pierna del pijama: baja desde detrás del talón y sale por abajo, ensanchándose
  g.save();
  g.beginPath(); g.moveTo(-175, 430); g.bezierCurveTo(-200, 800, -300, 1200, -360, 1700); g.lineTo(360, 1700); g.bezierCurveTo(300, 1200, 200, 800, 175, 430); g.closePath();
  g.save(); g.clip();
  g.drawImage(PIJAMA, -380, 430, 760, 1270);
  const pg = g.createLinearGradient(-360, 0, 360, 0);
  pg.addColorStop(0, "rgba(0,0,30,0.7)"); pg.addColorStop(0.35, "rgba(0,0,30,0.15)"); pg.addColorStop(0.6, "rgba(255,255,255,0.12)"); pg.addColorStop(1, "rgba(0,0,30,0.65)");
  g.fillStyle = pg; g.fillRect(-380, 430, 760, 1270);
  const sg = g.createLinearGradient(0, 600, 0, 900); sg.addColorStop(0, "rgba(10,0,20,0.75)"); sg.addColorStop(1, "rgba(10,0,20,0)");
  g.fillStyle = sg; g.fillRect(-380, 430, 760, 500);
  g.strokeStyle = "rgba(0,0,30,0.35)"; g.lineWidth = 14;
  for (const y of [980, 1180]) { g.beginPath(); g.moveTo(-300, y); g.quadraticCurveTo(0, y + 60, 300, y - 10); g.stroke(); }
  g.restore();
  g.restore();
  // la sombra del pie sobre el fondo
  g.save(); g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 80; g.shadowOffsetY = 30;
  caminoPlanta(g); g.fillStyle = PIEL.sombra; g.fill(); g.restore();
  // los dedos (detrás del borde de la planta), cada uno con su sombra; detrás, la sombra entre ellos
  g.save(); g.fillStyle = "rgba(40,10,20,0.6)"; g.beginPath(); g.ellipse(30, -530, 250, 80, 0.12, 0, 6.2832); g.fill(); g.restore();
  const az = azar(9);
  for (let i = 0; i < 5; i++) {
    const d = DEDOS[i], f = az() * 6, mv = agita * (Math.sin(t * 17 + f) * 0.6 + Math.sin(t * 29 + f * 2) * 0.4);
    const baja = encoge * d.ry * 0.55 + mv * 14, esc = 1 - encoge * 0.28 + mv * 0.04;
    g.save(); g.translate(d.x + mv * 10, d.y + baja); g.rotate(d.a + mv * 0.16 + encoge * (i - 2) * -0.05);
    g.save(); g.globalAlpha *= 0.5; g.fillStyle = "#4a1c22"; g.beginPath(); g.ellipse(4, d.ry * 0.25 * esc, d.rx * 1.02, d.ry * 0.8 * esc, 0, 0, 6.2832); g.fill(); g.restore();
    g.drawImage(dedoImg, -d.rx * 1.1, -d.ry * 1.07 * esc, d.rx * 2.2, d.ry * 2.14 * esc);
    g.restore();
  }
  g.drawImage(plantaImg, -350, -820);
  // al encoger, la base de los dedos se oscurece
  if (encoge > 0.01) {
    g.save(); caminoPlanta(g); g.clip(); g.globalAlpha *= encoge * 0.5;
    const eg = g.createLinearGradient(0, -500, 0, -300); eg.addColorStop(0, "rgba(120,40,50,0.7)"); eg.addColorStop(1, "rgba(120,40,50,0)");
    g.fillStyle = eg; g.fillRect(-320, -520, 640, 240); g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- la pluma
// Una pluma rosa larga. Su base (donde se coge) en (0, 0) y la punta hacia arriba, a L px; curva: lo que se dobla
// (+ a la derecha); ondea: lo que tiemblan las barbas.
export function pluma(g, t, L = 900, curva = 0.15, ondea = 0, al = 1) {
  if (al <= 0.003) return;
  g.save(); g.globalAlpha *= al;
  const P = (s) => { const y = -L * s, x = curva * L * s * s; return [x, y]; };
  const T = (s) => { const d = 2 * curva * s; const n = Math.hypot(d, 1); return [d / n, -1 / n]; };
  g.lineCap = "round";
  // las barbas
  const az = azar(41);
  for (let lado = -1; lado <= 1; lado += 2) {
    for (let i = 0; i < 110; i++) {
      const s = 0.12 + (i / 110) * 0.88, [x, y] = P(s), [tx, ty] = T(s), nx = -ty * lado, ny = tx * lado;
      const W = L * 0.17 * Math.pow(Math.sin(Math.PI * Math.min(1, (s - 0.08) / 0.95)), 0.55) * (0.85 + az() * 0.3);
      const fl = ondea * Math.sin(t * 14 + s * 9 + lado) * 0.25, ang = 0.75 + fl;   // las barbas apuntan hacia la punta
      const ex = x + (nx * Math.cos(ang) + tx * Math.sin(ang)) * W, ey = y + (ny * Math.cos(ang) + ty * Math.sin(ang)) * W;
      const mx = x + nx * W * 0.55 + tx * W * 0.1, my = y + ny * W * 0.55 + ty * W * 0.1;
      const gr = g.createLinearGradient(x, y, ex, ey);
      gr.addColorStop(0, "rgba(255,240,248,0.95)"); gr.addColorStop(0.45, "rgba(255,150,200,0.9)"); gr.addColorStop(1, "rgba(255,70,150,0.55)");
      g.strokeStyle = gr; g.lineWidth = L * 0.0075;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(mx, my, ex, ey); g.stroke();
    }
  }
  // la luz por encima (un lado más claro)
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.08;
  for (let i = 0; i < 40; i++) { const s = 0.15 + i / 46, [x, y] = P(s); k.brillo(g, x - L * 0.05, y, L * 0.16, "255,190,220", 0.5); }
  g.restore();
  // el plumón de la base
  for (let i = 0; i < 26; i++) {
    const s = 0.05 + az() * 0.1, [x, y] = P(s), a = az() * 6.2832, r = L * (0.03 + az() * 0.05);
    g.strokeStyle = "rgba(255,225,240,0.6)"; g.lineWidth = L * 0.004; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.5, x + Math.cos(a + 0.6) * r * 1.3, y + Math.sin(a + 0.6) * r); g.stroke();
  }
  // el cañón
  g.strokeStyle = "#fff6f0"; g.lineWidth = L * 0.014;
  g.beginPath(); g.moveTo(0, 30); for (let s = 0; s <= 1; s += 0.05) { const [x, y] = P(s); g.lineTo(x, y); } g.stroke();
  g.strokeStyle = "rgba(200,120,150,0.7)"; g.lineWidth = L * 0.005;
  g.beginPath(); g.moveTo(3, 30); for (let s = 0; s <= 0.95; s += 0.05) { const [x, y] = P(s); g.lineTo(x + 3, y); } g.stroke();
  g.restore();
}
// Dónde está la punta de la pluma (en su sistema), para poner las chispas.
export const puntaPluma = (L, curva, s = 0.93) => [curva * L * s * s, -L * s];

// ---------------------------------------------------------------- el puño que coge la pluma
// Visto de lado, con los nudillos hacia la cámara, cogiendo algo vertical que pasa por (0, 0). La muñeca sale hacia
// abajo a la derecha. tipo: "pijama" o "roja" (la manga). esc: tamaño (1 ≈ 260 px de ancho).
export function puno(g, tipo, esc = 1, ang = 0) {
  g.save(); g.rotate(ang); g.scale(esc, esc);
  manga(g, 560, 720, 150, 175, 240, tipo);
  const capsula = (x0, y0, w, h, r, c0, c1, c2) => {
    k.redondo(g, x0, y0, w, h, r);
    const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, c0); gr.addColorStop(0.5, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.fill();
  };
  // la muñeca
  g.beginPath(); g.moveTo(60, 40); g.bezierCurveTo(120, 90, 170, 150, 200, 210); g.lineTo(110, 270); g.bezierCurveTo(80, 210, 30, 160, -20, 130); g.closePath();
  let gr = g.createLinearGradient(40, 60, 180, 250); gr.addColorStop(0, PIEL.base); gr.addColorStop(1, PIEL.sombra); g.fillStyle = gr; g.fill();
  // el dorso de la mano (redondeado, con la luz arriba a la izquierda)
  k.redondo(g, -60, -135, 215, 265, 95);
  gr = g.createLinearGradient(-60, -135, 155, 130); gr.addColorStop(0, "#ffdcc8"); gr.addColorStop(0.45, PIEL.base); gr.addColorStop(1, PIEL.sombra);
  g.fillStyle = gr; g.fill();
  g.save(); g.clip(); texturaPiel(g, -70, -140, 240, 280, 0.3);
  g.strokeStyle = "rgba(255,240,230,0.35)"; g.lineWidth = 7; g.lineCap = "round";
  for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(30 + i * 8, -70 + i * 55); g.quadraticCurveTo(80, -50 + i * 60, 140, -10 + i * 55); g.stroke(); }
  g.restore();
  // los cuatro dedos doblados delante del palo, uno encima de otro
  const ys = [-112, -52, 6, 60], ws = [150, 156, 146, 126], hs = [62, 62, 58, 52];
  for (let i = 0; i < 4; i++) {
    const x0 = -120 + (150 - ws[i]) * 0.3, y0 = ys[i];
    g.save(); g.shadowColor = "rgba(80,20,20,0.45)"; g.shadowBlur = 10; g.shadowOffsetY = 5;
    capsula(x0, y0, ws[i], hs[i], hs[i] / 2, "#ffd7c3", PIEL.base, PIEL.sombra); g.restore();
    capsula(x0, y0, ws[i], hs[i], hs[i] / 2, "#ffd7c3", PIEL.base, PIEL.sombra);
    // el pliegue del nudillo de en medio y su brillo
    g.strokeStyle = "rgba(140,60,52,0.55)"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x0 + ws[i] * 0.45, y0 + 10); g.quadraticCurveTo(x0 + ws[i] * 0.42, y0 + hs[i] / 2, x0 + ws[i] * 0.45, y0 + hs[i] - 10); g.stroke();
    g.fillStyle = "rgba(255,240,232,0.55)"; g.beginPath(); g.ellipse(x0 + ws[i] * 0.25, y0 + hs[i] * 0.3, ws[i] * 0.14, hs[i] * 0.14, 0, 0, 6.2832); g.fill();
  }
  // el pulgar, por encima del índice, con su uña
  g.save(); g.translate(-10, -140); g.rotate(-0.12);
  g.save(); g.shadowColor = "rgba(80,20,20,0.5)"; g.shadowBlur = 14; g.shadowOffsetY = 6;
  capsula(-110, -32, 200, 64, 32, "#ffe0cf", PIEL.base, PIEL.sombra); g.restore();
  capsula(-110, -32, 200, 64, 32, "#ffe0cf", PIEL.base, PIEL.sombra);
  k.redondo(g, -104, -24, 52, 40, 18);
  const ug = g.createLinearGradient(-104, -24, -52, 16); ug.addColorStop(0, "#fff3ee"); ug.addColorStop(1, "#e8b4a8"); g.fillStyle = ug; g.fill();
  g.strokeStyle = "rgba(150,80,70,0.5)"; g.lineWidth = 2; g.stroke();
  g.restore();
  g.restore();
}

// ---------------------------------------------------------------- las chispas de las cosquillas
// Salen de un punto que se mueve (donde(ts) → [x, y] en el mundo) mientras dura la cosquilla; cuanto(ts) de 0 a 1 dice
// cuántas salen. Cada chispa vive 0,7 s: sale disparada, gira y se apaga. Todo sale de t.
export function chispas(g, t, donde, cuanto, { escala = 1, sem = 1, cada = 0.008, colores = [ORO, ROSA, "255,240,200"], vida = 0.8 } = {}) {
  const n0 = Math.floor((t - vida) / cada), n1 = Math.floor(t / cada);
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let n = n0; n <= n1; n++) {
    const ts = n * cada, q = cuanto(ts); if (q <= 0.01) continue;
    const az = azar(n * 7919 + sem * 131);
    if (az() > q) continue;
    const u = (t - ts) / vida; if (u < 0 || u > 1) continue;
    const [x0, y0] = donde(ts), a = az() * 6.2832, v = (260 + az() * 520) * escala, c = colores[Math.floor(az() * colores.length)];
    const d = v * (1 - Math.pow(1 - u, 2)) * 0.9, x = x0 + Math.cos(a) * d, y = y0 + Math.sin(a) * d - 120 * u * escala;
    const al = (1 - u) * (0.6 + 0.4 * q), r = (10 + az() * 16) * escala * (1 - 0.5 * u);
    if (az() < 0.35) {
      // un garabato de cosquilla: un zigzag corto que sale hacia fuera
      const L = (40 + az() * 50) * escala, dx = Math.cos(a), dy = Math.sin(a);
      g.strokeStyle = `rgba(${c},${al})`; g.lineWidth = 7 * escala;
      g.beginPath(); for (let j = 0; j <= 4; j++) { const s = j / 4, w = (j % 2 ? 1 : -1) * 10 * escala; g.lineTo(x + dx * L * s - dy * w, y + dy * L * s + dx * w); } g.stroke();
    } else {
      // una estrellita de cuatro puntas con su brillo
      const gi = u * 4 + a;
      g.fillStyle = `rgba(${c},${al})`;
      g.beginPath();
      for (let j = 0; j < 8; j++) { const rr = j % 2 ? r * 0.28 : r, aa = gi + (j * Math.PI) / 4; g.lineTo(x + Math.cos(aa) * rr, y + Math.sin(aa) * rr); }
      g.closePath(); g.fill();
      k.brillo(g, x, y, r * 5, c, al * 0.55);
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- la palma abierta
// Una mano derecha abierta, con la palma hacia la cámara, los dedos hacia arriba y el pulgar a la izquierda. La muñeca
// en (0, 0); mide unos 720 px de la muñeca a la punta del dedo corazón. encoge: de 0 a 1, los dedos se doblan hacia
// la palma (cosquillas). manga: "pijama", "roja" o null.
const DEDOS_MANO = [
  { x: -122, L: 285, w: 80, a: -0.1 },
  { x: -40, L: 320, w: 84, a: -0.02 },
  { x: 42, L: 300, w: 80, a: 0.05 },
  { x: 118, L: 235, w: 68, a: 0.14 },
];
function caminoPalma(g) {
  g.beginPath();
  g.moveTo(-150, -10); g.bezierCurveTo(-190, -150, -185, -300, -165, -390);
  g.bezierCurveTo(-120, -420, 120, -425, 160, -380);
  g.bezierCurveTo(185, -280, 180, -120, 140, -10);
  g.bezierCurveTo(80, 30, -90, 30, -150, -10); g.closePath();
}
function dedo(g, L, w, encoge, t, pliegues = 2) {
  // de la base (0, 0) hacia arriba; al encoger se acorta (se dobla hacia la cámara) y se oscurece
  const Le = L * (1 - 0.55 * encoge);
  k.redondo(g, -w / 2, -Le, w, Le + w * 0.3, w / 2);
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  gr.addColorStop(0, PIEL.sombra); gr.addColorStop(0.35, PIEL.luz); gr.addColorStop(0.7, PIEL.base); gr.addColorStop(1, PIEL.sombra);
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  if (encoge > 0.01) { g.fillStyle = `rgba(120,50,50,${0.35 * encoge})`; g.fillRect(-w, -Le, w * 2, Le * 0.4); }
  // las yemas y los pliegues de las falanges
  for (let i = 0; i < 3; i++) {
    const y0 = -Le + (Le * i) / 3, y1 = y0 + Le / 3;
    const yg = g.createRadialGradient(0, (y0 + y1) / 2, 4, 0, (y0 + y1) / 2, w * 0.6);
    yg.addColorStop(0, "rgba(255,226,214,0.6)"); yg.addColorStop(1, "rgba(255,226,214,0)");
    g.fillStyle = yg; g.fillRect(-w, y0, w * 2, y1 - y0);
    if (i > 0) { g.strokeStyle = "rgba(140,60,55,0.55)"; g.lineWidth = 3; for (let j = 0; j < pliegues; j++) { g.beginPath(); g.moveTo(-w * 0.35, y0 + j * 6); g.quadraticCurveTo(0, y0 + 6 + j * 6, w * 0.35, y0 + j * 6); g.stroke(); } }
  }
  texturaPiel(g, -w, -L, w * 2, L + w, 0.3);
  g.restore();
}
export function palma(g, t, { encoge = 0, agita = 0, manga: tipoManga = "pijama" } = {}) {
  if (tipoManga) manga(g, 0, 620, 0, 20, 330, tipoManga);
  // la muñeca
  g.beginPath(); g.moveTo(-140, 60); g.lineTo(-130, -40); g.lineTo(130, -40); g.lineTo(125, 60); g.closePath();
  let gr = g.createLinearGradient(-140, 0, 140, 0); gr.addColorStop(0, PIEL.sombra); gr.addColorStop(0.5, PIEL.base); gr.addColorStop(1, PIEL.sombra); g.fillStyle = gr; g.fill();
  // los dedos, detrás de la palma
  const az = azar(17);
  for (const d of DEDOS_MANO) {
    const f = az() * 6, mv = agita * Math.sin(t * 19 + f) * 0.12;
    g.save(); g.translate(d.x, -360); g.rotate(d.a + mv - encoge * d.x * 0.0012); dedo(g, d.L, d.w, encoge, t); g.restore();
  }
  // el pulgar, hacia fuera a la izquierda
  g.save(); g.translate(-150, -150); g.rotate(-0.75 + encoge * 0.45 + agita * Math.sin(t * 17) * 0.08); dedo(g, 240, 92, encoge * 0.6, t, 1); g.restore();
  // la palma: luz, montes más claros y las líneas
  g.save(); g.shadowColor = "rgba(60,10,20,0.4)"; g.shadowBlur = 30; caminoPalma(g); g.fillStyle = PIEL.base; g.fill(); g.restore();
  caminoPalma(g);
  gr = g.createRadialGradient(-20, -230, 30, 0, -200, 300); gr.addColorStop(0, "#ffd4c2"); gr.addColorStop(0.6, "#f4ad94"); gr.addColorStop(1, PIEL.sombra);
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  for (const [x, y, rx, ry] of [[-90, -90, 90, 120], [60, -340, 150, 60], [100, -120, 70, 130]]) {
    const mg = g.createRadialGradient(x, y, 5, x, y, Math.max(rx, ry)); mg.addColorStop(0, "rgba(255,226,214,0.7)"); mg.addColorStop(1, "rgba(255,226,214,0)");
    g.fillStyle = mg; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.2832); g.fill();
  }
  if (encoge > 0.01) { g.fillStyle = `rgba(150,60,70,${0.25 * encoge})`; g.fillRect(-200, -430, 400, 460); }
  g.lineCap = "round"; g.strokeStyle = "rgba(140,58,55,0.7)"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(160, -290); g.bezierCurveTo(60, -300, -40, -290, -110, -330); g.stroke();      // la del corazón
  g.beginPath(); g.moveTo(-170, -250); g.bezierCurveTo(-80, -230, 20, -210, 120, -170); g.stroke();      // la de la cabeza
  g.beginPath(); g.moveTo(-150, -255); g.bezierCurveTo(-60, -170, -70, -60, -50, 10); g.stroke();        // la de la vida
  g.strokeStyle = "rgba(255,235,225,0.3)"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(160, -284); g.bezierCurveTo(60, -294, -40, -284, -110, -324); g.stroke();
  texturaPiel(g, -200, -430, 400, 460, 0.35);
  g.restore();
}

// ---------------------------------------------------------------- la mano que hace cosquillas
// Vista por el dorso, con los dedos índice y corazón estirados hacia abajo (hacia lo que tocan) y moviéndose; la manga
// sale hacia arriba. La punta de los dedos, en (0, 0). mueve: de 0 a 1, cuánto se mueven los dedos.
export function manoDedos(g, t, tipo, mueve = 1) {
  g.save();
  manga(g, 30, -900, 20, -470, 280, tipo);
  // el dorso
  k.redondo(g, -150, -500, 290, 260, 110);
  let gr = g.createLinearGradient(-150, -500, 140, -240); gr.addColorStop(0, "#ffd9c6"); gr.addColorStop(0.5, PIEL.base); gr.addColorStop(1, PIEL.sombra);
  g.fillStyle = gr; g.fill();
  g.save(); g.clip(); texturaPiel(g, -160, -510, 310, 280, 0.3);
  g.strokeStyle = "rgba(255,240,230,0.3)"; g.lineWidth = 7; g.lineCap = "round";
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-90 + i * 55, -440); g.lineTo(-100 + i * 62, -280); g.stroke(); }
  g.restore();
  // anular y meñique, doblados (sus nudillos)
  for (const [x, w] of [[55, 70], [115, 60]]) { k.redondo(g, x - w / 2, -270, w, 90, w / 2); gr = g.createLinearGradient(0, -270, 0, -180); gr.addColorStop(0, PIEL.base); gr.addColorStop(1, PIEL.sombra); g.fillStyle = gr; g.fill(); }
  // índice y corazón, estirados, que se mueven
  for (const [i, x, L] of [[0, -95, 290], [1, -15, 310]]) {
    const ang = mueve * 0.22 * Math.sin(t * 20 + i * Math.PI);
    g.save(); g.translate(x, -270); g.rotate(ang);
    k.redondo(g, -38, 0, 76, L, 38);
    gr = g.createLinearGradient(-38, 0, 38, 0); gr.addColorStop(0, PIEL.sombra); gr.addColorStop(0.4, PIEL.luz); gr.addColorStop(1, PIEL.sombra);
    g.fillStyle = gr; g.fill();
    g.strokeStyle = "rgba(140,60,55,0.5)"; g.lineWidth = 3;
    for (const y of [L * 0.36, L * 0.66]) { g.beginPath(); g.moveTo(-22, y); g.quadraticCurveTo(0, y - 6, 22, y); g.stroke(); }
    // la uña
    k.redondo(g, -24, L - 82, 48, 66, 20);
    const ug = g.createLinearGradient(0, L - 82, 0, L - 16); ug.addColorStop(0, "#f2c4ba"); ug.addColorStop(1, "#fff4f0"); g.fillStyle = ug; g.fill();
    g.strokeStyle = "rgba(150,80,70,0.5)"; g.lineWidth = 2; g.stroke();
    g.restore();
  }
  // el pulgar, recogido por debajo
  k.redondo(g, -175, -330, 80, 150, 40); gr = g.createLinearGradient(-175, 0, -95, 0); gr.addColorStop(0, PIEL.sombra); gr.addColorStop(1, PIEL.base); g.fillStyle = gr; g.fill();
  g.restore();
}
// Dónde tocan las puntas de los dedos de manoDedos (en su sistema).
export const puntaDedos = (t, mueve = 1) => { const a = mueve * 0.22 * Math.sin(t * 20); return [-55 - Math.sin(a) * 300, 40]; };
