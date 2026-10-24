// Lo que comparten los planos: la misma cuna, los mismos muñecos, el mismo cuarto.
import * as k from "#kit";

const azJ = k.azar(20261024);
const TIPOS = ["estrella", "luna", "bola", "aro"];
const PALS = [
  ["#ff4d6d", "#ffd0da", "#9c183c"],
  ["#ffc43d", "#fff3c4", "#c47a08"],
  ["#3ec6ff", "#d9f6ff", "#0c6e9e"],
  ["#c49bff", "#f3e8ff", "#5c2d9e"],
  ["#3ee0a0", "#d8ffe9", "#127a48"],
];

function juguete(x, y, z, s, tipo, pal, fase) {
  return { x, y, z, s, tipo, pal, fase, giro: fase * 2 };
}

// Delante de la cámara del fotograma 0 (z ≈ 24, mira al frente): en el centro y enormes.
// Más atrás, hacia la cuna, para atravesarlos.
const FIJOS = [
  juguete(0.05, 2.25, 20.4, 1.45, "estrella", 0, 0.4),
  juguete(-0.55, 0.85, 21.2, 1.2, "luna", 1, 1.2),
  juguete(0.62, 1.45, 19.2, 1.25, "bola", 2, 2.1),
  juguete(-0.15, 2.7, 18.0, 1.05, "aro", 3, 0.8),
  juguete(0.35, 0.55, 16.6, 1.15, "estrella", 4, 2.4),
  juguete(-0.7, 1.9, 14.8, 1.1, "bola", 1, 1.7),
  juguete(0.15, 1.2, 12.6, 1.2, "luna", 0, 0.2),
  juguete(-0.4, 2.4, 10.4, 1.05, "aro", 2, 3.1),
  juguete(0.55, 0.7, 8.2, 1.15, "estrella", 3, 1.1),
  juguete(-0.2, 1.8, 6.2, 1.0, "bola", 4, 2.8),
];
const SUELTOS = Array.from({ length: 14 }, (_, i) => {
  const ang = azJ() * 6.2832;
  const radio = 1.4 + azJ() * 3.6;
  return juguete(Math.cos(ang) * radio, -1.4 + azJ() * 5.2, 4 + azJ() * 20, 0.72 + azJ() * 0.55, TIPOS[i % 4], i % 5, azJ() * 6);
});
export const JUGUETES = FIJOS.concat(SUELTOS);

const azG = k.azar(77);
export const GRIETAS = Array.from({ length: 16 }, () => {
  const a = azG() * 6.2832;
  const pts = [[540, 900]];
  let x = 540, y = 900, ang = a;
  for (let i = 0; i < 8; i++) {
    ang += (azG() - 0.5) * 1.1;
    x += Math.cos(ang) * (70 + azG() * 150);
    y += Math.sin(ang) * (70 + azG() * 170);
    pts.push([x, y]);
    if (azG() > 0.62) {
      const b = ang + (azG() > 0.5 ? 0.8 : -0.8);
      pts.push([x + Math.cos(b) * (40 + azG() * 90), y + Math.sin(b) * (40 + azG() * 90), true]);
      pts.push([x, y]);
    }
  }
  return pts;
});

export function veloArriba(g, a = 0.72) {
  const vg = g.createLinearGradient(0, 60, 0, 780);
  vg.addColorStop(0, `rgba(10,6,18,${a})`);
  vg.addColorStop(0.5, `rgba(10,6,18,${a * 0.62})`);
  vg.addColorStop(1, "rgba(10,6,18,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 800);
}

// dia: 0 noche, 1 día. El techo se queda oscuro para el subtítulo.
export function cuarto(g, dia) {
  const d = Math.max(0, Math.min(1, dia));
  const top = k.mezColor("#120818", "#3a1458", d * 0.35);
  const mid = k.mezColor("#3a1868", "#ffb07a", d);
  const low = k.mezColor("#6a3060", "#ffe0b8", d);
  const suelo = k.mezColor("#2a140c", "#e0a06a", d);
  const cg = g.createLinearGradient(0, 0, 0, 1920);
  cg.addColorStop(0, top);
  cg.addColorStop(0.28, k.mezColor("#241040", "#ff8d62", d * 0.7));
  cg.addColorStop(0.52, mid);
  cg.addColorStop(0.78, low);
  cg.addColorStop(1, suelo);
  g.fillStyle = cg;
  g.fillRect(0, 0, 1080, 1920);
  // suelo de madera
  g.save();
  g.beginPath();
  g.moveTo(0, 1500);
  g.lineTo(1080, 1460);
  g.lineTo(1080, 1920);
  g.lineTo(0, 1920);
  g.closePath();
  const sg = g.createLinearGradient(0, 1460, 0, 1920);
  sg.addColorStop(0, k.mezColor("#4a2414", "#f0c090", d));
  sg.addColorStop(1, k.mezColor("#241008", "#a86838", d));
  g.fillStyle = sg;
  g.fill();
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, 0, 1460, 1080, 480);
  g.restore();
  // ventana a la izquierda, por debajo del subtítulo
  ventana(g, 70, 560, 340, 460, d);
  // lámpara de pie, luz cálida
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 860, 1180, 900, "naranja", 0.28 + 0.22 * (1 - d));
  g.restore();
  lampara(g, 860, 1040);
}

function ventana(g, x, y, w, h, dia) {
  g.save();
  k.redondo(g, x - 16, y - 16, w + 32, h + 32, 28);
  g.fillStyle = "#3a2418";
  g.fill();
  k.redondo(g, x, y, w, h, 18);
  const vg = g.createLinearGradient(x, y, x, y + h);
  if (dia > 0.45) {
    vg.addColorStop(0, "#9fd6ff");
    vg.addColorStop(0.55, "#ffe0a0");
    vg.addColorStop(1, "#ffb060");
  } else {
    vg.addColorStop(0, "#1a1448");
    vg.addColorStop(0.7, "#3a2a78");
    vg.addColorStop(1, "#120818");
  }
  g.fillStyle = vg;
  g.fill();
  g.strokeStyle = "rgba(255,236,210,0.35)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(x + w / 2, y);
  g.lineTo(x + w / 2, y + h);
  g.moveTo(x, y + h / 2);
  g.lineTo(x + w, y + h / 2);
  g.stroke();
  if (dia > 0.45) {
    const u = (dia - 0.45) / 0.55;
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, x + w * 0.62, y + h * 0.38, 180 + 80 * u, "amarilla", 0.55 * u);
    g.restore();
  } else {
    g.fillStyle = "#f4f7ff";
    g.beginPath();
    g.arc(x + w * 0.72, y + h * 0.3, 28, 0, 6.2832);
    g.fill();
    g.fillStyle = "rgba(90,80,160,0.55)";
    g.beginPath();
    g.arc(x + w * 0.8, y + h * 0.26, 22, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

function lampara(g, x, y) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#5a4030";
  g.fillRect(-8, 0, 16, 280);
  g.beginPath();
  g.ellipse(0, 280, 70, 18, 0, 0, 6.2832);
  g.fillStyle = "#3a2818";
  g.fill();
  g.beginPath();
  g.moveTo(-70, 10);
  g.quadraticCurveTo(-90, -80, 0, -100);
  g.quadraticCurveTo(90, -80, 70, 10);
  g.closePath();
  const lg = g.createLinearGradient(-70, -100, 70, 20);
  lg.addColorStop(0, "#c47a38");
  lg.addColorStop(0.5, "#ffe0a0");
  lg.addColorStop(1, "#a85a28");
  g.fillStyle = lg;
  g.fill();
  g.restore();
}

export function pathEstrella(g, r) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const rad = i % 2 ? r * 0.42 : r;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    if (i) g.lineTo(x, y);
    else g.moveTo(x, y);
  }
  g.closePath();
}

export function muneco(g, x, y, r, ang, palI, tipo) {
  if (r < 2) return;
  const pal = PALS[palI % PALS.length];
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  if (tipo === "estrella") {
    pathEstrella(g, r);
    const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    gr.addColorStop(0, pal[1]);
    gr.addColorStop(0.45, pal[0]);
    gr.addColorStop(1, pal[2]);
    g.fillStyle = gr;
    g.fill();
  } else if (tipo === "luna") {
    g.beginPath();
    g.arc(0, 0, r, 0, 6.2832);
    g.arc(r * 0.42, -r * 0.1, r * 0.78, 0, 6.2832, true);
    const gr = g.createLinearGradient(-r, -r, r, r);
    gr.addColorStop(0, pal[1]);
    gr.addColorStop(0.5, pal[0]);
    gr.addColorStop(1, pal[2]);
    g.fillStyle = gr;
    g.fill();
  } else if (tipo === "aro") {
    g.lineWidth = r * 0.38;
    g.strokeStyle = pal[0];
    g.beginPath();
    g.arc(0, 0, r * 0.62, 0, 6.2832);
    g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.55)";
    g.lineWidth = r * 0.08;
    g.beginPath();
    g.arc(0, 0, r * 0.74, -2.2, -0.4);
    g.stroke();
  } else {
    g.beginPath();
    g.arc(0, 0, r, 0, 6.2832);
    const gr = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    gr.addColorStop(0, "#fff");
    gr.addColorStop(0.18, pal[1]);
    gr.addColorStop(0.55, pal[0]);
    gr.addColorStop(1, pal[2]);
    g.fillStyle = gr;
    g.fill();
    g.globalAlpha = 0.35;
    g.fillStyle = "rgba(255,255,255,0.5)";
    g.beginPath();
    g.ellipse(-r * 0.28, -r * 0.32, r * 0.28, r * 0.16, -0.6, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

// La cuna, con el centro del colchón en (x, y). s = 1 ocupa unos 760 px de ancho.
export function cuna(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // cabecero
  k.redondo(g, -390, -250, 70, 420, 24);
  let mg = g.createLinearGradient(-390, 0, -320, 0);
  mg.addColorStop(0, "#8a4e22");
  mg.addColorStop(0.5, "#f0c090");
  mg.addColorStop(1, "#a86430");
  g.fillStyle = mg;
  g.fill();
  k.redondo(g, 320, -230, 64, 390, 22);
  g.fillStyle = mg;
  g.fill();
  // barrotes
  for (let i = 0; i < 7; i++) {
    const bx = -240 + i * 80;
    k.redondo(g, bx, -40, 22, 250, 10);
    const bg = g.createLinearGradient(bx, 0, bx + 22, 0);
    bg.addColorStop(0, "#a86830");
    bg.addColorStop(0.45, "#ffe0b8");
    bg.addColorStop(1, "#8a4c20");
    g.fillStyle = bg;
    g.fill();
  }
  // colchón
  k.redondo(g, -300, -20, 600, 180, 36);
  const cg = g.createLinearGradient(-300, -20, 300, 160);
  cg.addColorStop(0, "#fff8f2");
  cg.addColorStop(0.5, "#ffe8d4");
  cg.addColorStop(1, "#f0c8b0");
  g.fillStyle = cg;
  g.fill();
  g.save();
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -300, -20, 600, 180);
  g.restore();
  // manta
  g.beginPath();
  g.moveTo(-250, 40);
  g.quadraticCurveTo(-80, 10, 40, 70);
  g.quadraticCurveTo(160, 120, 280, 50);
  g.lineTo(300, 150);
  g.quadraticCurveTo(40, 190, -270, 140);
  g.closePath();
  const tg = g.createLinearGradient(-250, 40, 280, 160);
  tg.addColorStop(0, "#ff6b8a");
  tg.addColorStop(0.5, "#ffd0a8");
  tg.addColorStop(1, "#ff4d6d");
  g.fillStyle = tg;
  g.fill();
  // almohada
  g.beginPath();
  g.ellipse(-150, 10, 110, 42, -0.2, 0, 6.2832);
  g.fillStyle = "#fff";
  g.fill();
  g.restore();
}

// Pierna que sale de la manta. ang en radianes (0 horizontal a la derecha, negativo hacia arriba).
export function pierna(g, x, y, s, ang) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.rotate(ang);
  const piel = g.createLinearGradient(0, -36, 0, 36);
  piel.addColorStop(0, "#ffe0cc");
  piel.addColorStop(0.45, "#f2b89a");
  piel.addColorStop(1, "#d4896a");
  k.redondo(g, 0, -34, 168, 68, 34);
  g.fillStyle = piel;
  g.fill();
  g.beginPath();
  g.ellipse(168, 0, 54, 38, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#f6c2a6";
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.ellipse(196 + i * 4, -22 + i * 14, 16, 12, 0.4, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

export function grietas(g, u) {
  if (u <= 0.001) return;
  g.save();
  g.lineCap = "round";
  g.lineJoin = "round";
  g.strokeStyle = `rgba(255,255,255,${0.35 + 0.6 * u})`;
  GRIETAS.forEach((pts, i) => {
    const cu = Math.max(0, Math.min(1, (u * 1.25) - i * 0.015));
    if (cu <= 0) return;
    const n = Math.max(2, Math.floor(cu * (pts.length - 1)) + 1);
    g.lineWidth = 2 + 5 * cu;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < n; k++) g.lineTo(pts[k][0], pts[k][1]);
    g.stroke();
  });
  g.restore();
}

// Ratón de lado, mirando a la derecha. Centro del cuerpo en (0, 0) con s = 1 (~900 px).
export function raton(g, x, y, s, t) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  const respira = 1 + 0.012 * Math.sin(t * 2.2);
  g.scale(respira, 1 / respira);
  // cola
  g.strokeStyle = "#c47a8a";
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-280, 40);
  g.quadraticCurveTo(-420, 180, -520, 40);
  g.quadraticCurveTo(-600, -80, -480, -140);
  g.stroke();
  // cuerpo
  g.beginPath();
  g.ellipse(0, 20, 340, 210, -0.08, 0, 6.2832);
  const cg = g.createRadialGradient(-80, -40, 40, 0, 20, 360);
  cg.addColorStop(0, "#f6d2b0");
  cg.addColorStop(0.35, "#d8a070");
  cg.addColorStop(0.72, "#a86840");
  cg.addColorStop(1, "#6a3828");
  g.fillStyle = cg;
  g.fill();
  g.save();
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.beginPath();
  g.ellipse(0, 20, 340, 210, -0.08, 0, 6.2832);
  g.clip();
  g.drawImage(k.manchas, -360, -200, 720, 440);
  g.restore();
  // vientre
  g.beginPath();
  g.ellipse(20, 80, 230, 120, -0.1, 0, Math.PI);
  g.fillStyle = "#ffe6d4";
  g.fill();
  // cabeza
  g.beginPath();
  g.ellipse(300, -30, 170, 150, 0.1, 0, 6.2832);
  const hg = g.createRadialGradient(250, -80, 20, 300, -20, 180);
  hg.addColorStop(0, "#ffe0c8");
  hg.addColorStop(0.5, "#e0a878");
  hg.addColorStop(1, "#8a5030");
  g.fillStyle = hg;
  g.fill();
  // oreja
  g.beginPath();
  g.ellipse(250, -160, 78, 96, -0.4, 0, 6.2832);
  g.fillStyle = "#c47858";
  g.fill();
  g.beginPath();
  g.ellipse(250, -160, 46, 60, -0.4, 0, 6.2832);
  g.fillStyle = "#ffb0c0";
  g.fill();
  // ojo
  g.beginPath();
  g.ellipse(360, -50, 28, 32, 0, 0, 6.2832);
  g.fillStyle = "#1a1020";
  g.fill();
  g.beginPath();
  g.arc(350, -60, 8, 0, 6.2832);
  g.fillStyle = "#fff";
  g.fill();
  // nariz
  g.beginPath();
  g.ellipse(455, -10, 22, 16, 0.2, 0, 6.2832);
  g.fillStyle = "#ff6d8a";
  g.fill();
  // bigotes
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 3;
  for (const dy of [-20, 0, 18]) {
    g.beginPath();
    g.moveTo(430, -8 + dy);
    g.lineTo(540, -28 + dy * 1.6);
    g.stroke();
  }
  // pata
  g.beginPath();
  g.ellipse(180, 190, 70, 28, 0.2, 0, 6.2832);
  g.fillStyle = "#f0c0a0";
  g.fill();
  g.beginPath();
  g.ellipse(-40, 200, 64, 24, -0.1, 0, 6.2832);
  g.fill();
  g.restore();
}

export function fondoCueva(g, tono) {
  const cg = g.createRadialGradient(540, 980, 80, 540, 1000, 1100);
  cg.addColorStop(0, tono[0]);
  cg.addColorStop(0.45, tono[1]);
  cg.addColorStop(1, tono[2]);
  g.fillStyle = cg;
  g.fillRect(0, 0, 1080, 1920);
}

const azN = k.azar(909);
export const NEURONAS = Array.from({ length: 28 }, () => ({
  x: 180 + azN() * 720,
  y: 560 + azN() * 1100,
  r: 16 + azN() * 22,
  fase: azN() * 6,
  pal: azN() > 0.5 ? 0 : 1,
}));
export const HUELLAS = Array.from({ length: 7 }, () => {
  const a = NEURONAS[Math.floor(azN() * NEURONAS.length)];
  const b = NEURONAS[Math.floor(azN() * NEURONAS.length)];
  return { x0: a.x, y0: a.y, x1: b.x, y1: b.y, cx: (a.x + b.x) / 2 + (azN() - 0.5) * 120, cy: (a.y + b.y) / 2 + (azN() - 0.5) * 80 };
});

export function neuronas(g, t, rotura) {
  const u = Math.max(0, Math.min(1, rotura));
  g.save();
  for (const h of HUELLAS) {
    const mx = h.cx, my = h.cy;
    const abre = u * 28;
    g.strokeStyle = `rgba(190,140,255,${0.85 - 0.35 * u})`;
    g.lineWidth = 8;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(h.x0, h.y0);
    g.quadraticCurveTo(mx - abre, my - abre, (h.x0 + h.x1) / 2 - abre, (h.y0 + h.y1) / 2);
    g.stroke();
    g.beginPath();
    g.moveTo(h.x1, h.y1);
    g.quadraticCurveTo(mx + abre, my + abre, (h.x0 + h.x1) / 2 + abre, (h.y0 + h.y1) / 2);
    g.stroke();
    if (u > 0.15 && u < 0.95) {
      g.save();
      g.globalCompositeOperation = "lighter";
      k.brillo(g, (h.x0 + h.x1) / 2, (h.y0 + h.y1) / 2, 80, "violeta", Math.sin(Math.min(1, u) * Math.PI) * 0.7);
      g.restore();
    }
  }
  for (const n of NEURONAS) {
    const pulsa = 1 + 0.06 * Math.sin(t * 3 + n.fase);
    const col = n.pal ? "255,210,120" : "255,244,210";
    g.save();
    g.translate(n.x, n.y);
    g.strokeStyle = `rgba(${col},0.55)`;
    g.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      const a = n.fase + i * 1.4;
      g.beginPath();
      g.moveTo(0, 0);
      g.quadraticCurveTo(Math.cos(a) * 40, Math.sin(a) * 30, Math.cos(a) * 70, Math.sin(a) * 54);
      g.stroke();
    }
    g.beginPath();
    g.arc(0, 0, n.r * pulsa, 0, 6.2832);
    const gr = g.createRadialGradient(-4, -4, 2, 0, 0, n.r * pulsa);
    gr.addColorStop(0, "#fff");
    gr.addColorStop(0.4, `rgb(${col})`);
    gr.addColorStop(1, "rgba(180,90,20,0.2)");
    g.fillStyle = gr;
    g.fill();
    g.restore();
  }
  g.restore();
}

// Una cara de frente, con volumen. s = 1 mide unos 340 px de ancho de cabeza.
export function cara(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.beginPath();
  g.ellipse(0, 250, 230, 110, 0, 0, 6.2832);
  const camisa = g.createLinearGradient(-200, 180, 200, 340);
  camisa.addColorStop(0, "#1d4e89");
  camisa.addColorStop(0.5, "#3ec6ff");
  camisa.addColorStop(1, "#163a66");
  g.fillStyle = camisa;
  g.fill();
  k.redondo(g, -46, 70, 92, 150, 36);
  g.fillStyle = "#e8a888";
  g.fill();
  g.beginPath();
  g.ellipse(-185, 10, 36, 52, 0, 0, 6.2832);
  g.ellipse(185, 10, 36, 52, 0, 0, 6.2832);
  const piel = g.createRadialGradient(-60, -80, 30, 10, -10, 230);
  piel.addColorStop(0, "#ffe4d2");
  piel.addColorStop(0.55, "#f0b090");
  piel.addColorStop(1, "#c07858");
  g.fillStyle = piel;
  g.fill();
  g.beginPath();
  g.ellipse(0, -30, 168, 198, 0, 0, 6.2832);
  g.fill();
  g.save();
  g.beginPath();
  g.ellipse(0, -30, 168, 198, 0, 0, 6.2832);
  g.clip();
  g.fillStyle = "#2a160e";
  g.beginPath();
  g.ellipse(0, -170, 150, 100, 0, 0, 6.2832);
  g.fill();
  g.restore();
  g.strokeStyle = "#3a2014";
  g.lineWidth = 8;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-78, -70);
  g.quadraticCurveTo(-50, -88, -22, -68);
  g.moveTo(22, -68);
  g.quadraticCurveTo(50, -88, 78, -70);
  g.stroke();
  g.fillStyle = "#fff";
  g.beginPath();
  g.ellipse(-48, -28, 28, 18, 0, 0, 6.2832);
  g.ellipse(48, -28, 28, 18, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#1a1020";
  g.beginPath();
  g.arc(-48, -28, 9, 0, 6.2832);
  g.arc(48, -28, 9, 0, 6.2832);
  g.fill();
  g.strokeStyle = "rgba(160,80,60,0.7)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, -10);
  g.quadraticCurveTo(16, 20, 0, 36);
  g.stroke();
  g.fillStyle = "#e07080";
  g.beginPath();
  g.ellipse(0, 78, 36, 16, 0, 0, 6.2832);
  g.fill();
  g.restore();
}

export function bolaCristal(g, x, y, r) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.arc(0, 0, r, 0, 6.2832);
  const gr = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.05, 0, 0, r);
  gr.addColorStop(0, "rgba(255,255,255,0.55)");
  gr.addColorStop(0.25, "rgba(186,230,255,0.18)");
  gr.addColorStop(0.7, "rgba(80,140,200,0.12)");
  gr.addColorStop(1, "rgba(20,40,80,0.45)");
  g.fillStyle = gr;
  g.fill();
  g.lineWidth = 10;
  g.strokeStyle = "rgba(220,245,255,0.65)";
  g.stroke();
  g.beginPath();
  g.ellipse(-r * 0.32, -r * 0.38, r * 0.22, r * 0.12, -0.7, 0, 6.2832);
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.fill();
  // base
  g.beginPath();
  g.ellipse(0, r * 0.92, r * 0.55, r * 0.14, 0, 0, 6.2832);
  g.fillStyle = "#6a5038";
  g.fill();
  k.redondo(g, -r * 0.5, r * 0.82, r, r * 0.22, 16);
  const mg = g.createLinearGradient(-r, 0, r, 0);
  mg.addColorStop(0, "#4a3424");
  mg.addColorStop(0.5, "#f0d2a8");
  mg.addColorStop(1, "#5a3c28");
  g.fillStyle = mg;
  g.fill();
  g.restore();
}

export function tarta(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // plato
  g.beginPath();
  g.ellipse(0, 210, 340, 48, 0, 0, 6.2832);
  g.fillStyle = "#f4f0ea";
  g.fill();
  g.strokeStyle = "#d8c8b8";
  g.lineWidth = 6;
  g.stroke();
  // bizcocho
  k.redondo(g, -250, -40, 500, 230, 40);
  const bg = g.createLinearGradient(-250, -40, 250, 190);
  bg.addColorStop(0, "#f0a060");
  bg.addColorStop(0.5, "#c46830");
  bg.addColorStop(1, "#8a4018");
  g.fillStyle = bg;
  g.fill();
  // nata
  g.beginPath();
  g.ellipse(0, -20, 270, 70, 0, 0, 6.2832);
  const ng = g.createLinearGradient(0, -90, 0, 50);
  ng.addColorStop(0, "#fff");
  ng.addColorStop(1, "#ffd8ea");
  g.fillStyle = ng;
  g.fill();
  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.ellipse(i * 90, -30, 70, 46, 0, Math.PI, 0);
    g.fillStyle = i % 2 ? "#ff8aaa" : "#fff";
    g.fill();
  }
  // fresas
  for (const fx of [-150, 0, 150]) {
    g.beginPath();
    g.ellipse(fx, -70, 28, 34, 0, 0, 6.2832);
    g.fillStyle = "#e03048";
    g.fill();
    g.fillStyle = "#3aaa50";
    g.beginPath();
    g.ellipse(fx, -100, 16, 10, 0, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

export function vela(g, x, y, s, llama, t, fase) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  k.redondo(g, -16, -120, 32, 130, 10);
  const vg = g.createLinearGradient(-16, 0, 16, 0);
  vg.addColorStop(0, "#f0c060");
  vg.addColorStop(0.5, "#fff4c8");
  vg.addColorStop(1, "#e0a040");
  g.fillStyle = vg;
  g.fill();
  if (llama > 0.05) {
    k.lengua(g, 0, -120, 90 * llama, 28, t, fase, "255,180,60", "255,240,180");
  }
  g.restore();
}

// Una hoja de calendario con un número enorme. s = 1 mide 300 × 380.
export function calendario(g, x, y, s, n) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  k.redondo(g, -150, -190, 300, 380, 24);
  g.fillStyle = "#fff8f2";
  g.fill();
  g.fillStyle = "#e23a4a";
  g.fillRect(-150, -190, 300, 70);
  g.fillStyle = "#1a1020";
  g.font = "800 200px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(String(n), 0, 40);
  g.restore();
}

export function marcoFoto(g, x, y, w, h, luz) {
  g.save();
  k.redondo(g, x, y, w, h, 18);
  g.fillStyle = luz > 0.4 ? "#ffe8c8" : "#d8d0dc";
  g.fill();
  g.lineWidth = 14;
  g.strokeStyle = luz > 0.4 ? "#ff8a4a" : "#8a8098";
  g.stroke();
  g.restore();
}
