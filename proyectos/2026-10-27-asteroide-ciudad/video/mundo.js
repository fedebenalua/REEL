// Lo que comparten los planos: la misma roca, la misma Tierra, la ciudad que sirve de metro,
// el suelo donde se apagan las especies y la nave que empuja.
import * as k from "#kit";

export const cielo = k.cielo(11, 1500, [0, 0, 0], 720, 5);

export function veloArriba(g, al = 0.55) {
  if (al <= 0.01) return;
  const vg = g.createLinearGradient(0, 80, 0, 760);
  vg.addColorStop(0, `rgba(3,6,14,${al})`);
  vg.addColorStop(0.55, `rgba(3,6,14,${al * 0.72})`);
  vg.addColorStop(1, "rgba(3,6,14,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 780);
}

// Una roca de escombros, siempre la misma: varias piedras juntas, al rojo si calor > 0.
export function asteroide(g, x, y, rad, ang, calor = 0) {
  if (rad < 2) return;
  const piezas = [
    [-0.28, 0.16, 0.46, 4, 0.2],
    [0.32, -0.1, 0.42, 6, -0.4],
    [0.06, 0.32, 0.36, 8, 0.8],
    [-0.1, -0.3, 0.34, 3, 1.1],
    [0.26, 0.22, 0.28, 9, -0.6],
    [0, -0.02, 0.56, 2, 0],
    [-0.16, 0.02, 0.3, 11, 0.5],
  ];
  for (const [dx, dy, r, sem, da] of piezas) {
    k.roca(g, x + dx * rad, y + dy * rad, r * rad, ang + da, sem, -0.35, -0.85, calor);
  }
}

// Un bloque de edificios de noche, del ancho que se le pida, para ponerlo al lado de la roca.
// (x, y) es el centro. al: 0 invisible, 1 del todo.
export function ciudad(g, x, y, ancho, al) {
  if (al <= 0.02 || ancho < 8) return;
  const az = k.azar(23);
  const n = 5;
  const altoMax = ancho * 0.78;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.fillStyle = "rgba(8,10,16,0.55)";
  g.beginPath();
  g.ellipse(0, altoMax * 0.08, ancho * 0.55, ancho * 0.12, 0, 0, Math.PI * 2);
  g.fill();
  const hueco = ancho / n;
  for (let i = 0; i < n; i++) {
    const w = hueco * (0.78 + az() * 0.16);
    const h = altoMax * (0.42 + ((i * 37) % 5) * 0.11);
    const bx = -ancho / 2 + i * hueco + (hueco - w) / 2;
    const by = -h * 0.72;
    const gr = g.createLinearGradient(bx, by, bx + w, by + h);
    gr.addColorStop(0, "#24344e");
    gr.addColorStop(0.4, "#405574");
    gr.addColorStop(1, "#141a28");
    g.fillStyle = gr;
    k.redondo(g, bx, by, w, h, Math.min(14, w * 0.12));
    g.fill();
    const cols = Math.max(2, Math.round(w / 22));
    const fils = Math.max(3, Math.round(h / 26));
    for (let cx = 0; cx < cols; cx++) for (let cy = 0; cy < fils; cy++) {
      if (az() < 0.18) continue;
      const wx = bx + w * 0.12 + cx * ((w * 0.76) / cols);
      const wy = by + h * 0.1 + cy * ((h * 0.78) / fils);
      g.fillStyle = az() < 0.2 ? "rgba(150,200,255,0.9)" : "rgba(255,206,120,0.95)";
      g.fillRect(wx, wy, Math.max(2, w * 0.1), Math.max(2, h * 0.045));
    }
  }
  g.restore();
}

// Luces de ciudad en el lado de noche del globo. al 0 las apaga (el mundo de hace 66 millones de años).
const LUCES = [[0.18, -0.22], [0.22, -0.05], [0.3, 0.18], [0.55, -0.28], [0.62, 0.05], [0.7, 0.22], [0.84, -0.08], [0.4, 0.32], [0.48, -0.02]];
export function lucesCiudad(g, x, y, rad, gira, al) {
  if (al <= 0.02 || rad < 20) return;
  g.save();
  g.beginPath();
  g.arc(x, y, rad * 0.98, 0, Math.PI * 2);
  g.clip();
  g.globalCompositeOperation = "lighter";
  for (const [lon, lat] of LUCES) {
    const a = (lon + gira) * Math.PI * 2;
    const frente = Math.cos(a);
    if (frente < 0.08) continue;
    const px = x + Math.sin(a) * rad * 0.78;
    const py = y + lat * rad * 0.85;
    if (px < x + rad * 0.05) continue;
    k.brillo(g, px, py, Math.max(10, rad * 0.07), "amarilla", al * frente * 0.85);
    k.brillo(g, px + rad * 0.03, py + rad * 0.02, Math.max(6, rad * 0.035), "naranja", al * frente * 0.5);
  }
  g.restore();
}

// El punto del golpe, pegado al disco, o null si está al otro lado.
export function puntoGolpe(cx, cy, rad, gira) {
  // En gira = 0,36 el punto está de frente, un poco por encima del centro del disco.
  const a = (gira - 0.36) * Math.PI * 2;
  const frente = Math.cos(a);
  if (frente < 0.05) return null;
  return {
    x: cx + Math.sin(a) * rad * 0.22,
    y: cy - rad * 0.16,
    frente,
  };
}

// Un anillo de cráter: borde claro, cuenco oscuro. u 0 cerrado, 1 abierto del todo.
export function crater(g, x, y, r, u) {
  if (u <= 0.01 || r < 4) return;
  g.save();
  g.globalAlpha *= u;
  const fondo = g.createRadialGradient(x, y - r * 0.05, r * 0.08, x, y, r);
  fondo.addColorStop(0, "rgba(8,4,3,0.78)");
  fondo.addColorStop(0.55, "rgba(48,24,12,0.55)");
  fondo.addColorStop(0.8, "rgba(90,42,18,0.28)");
  fondo.addColorStop(0.9, "rgba(255,176,90,0.95)");
  fondo.addColorStop(0.96, "rgba(60,28,14,0.7)");
  fondo.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = fondo;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

// Cielo y suelo de un día que se puede apagar. oscuro 0 día, 1 noche de polvo.
export function paisaje(g, oscuro, t) {
  const o = Math.max(0, Math.min(1, oscuro));
  const cieloG = g.createLinearGradient(0, 0, 0, 1200);
  cieloG.addColorStop(0, k.mezColor("#07111f", "#140c08", o));
  cieloG.addColorStop(0.45, k.mezColor("#1a4c86", "#3a2414", o));
  cieloG.addColorStop(1, k.mezColor("#7ec4f0", "#6a4030", o));
  g.fillStyle = cieloG;
  g.fillRect(0, 0, 1080, 1920);
  const suelo = g.createLinearGradient(0, 980, 0, 1920);
  suelo.addColorStop(0, k.mezColor("#3f8f45", "#4a3424", o));
  suelo.addColorStop(0.35, k.mezColor("#1d6b32", "#2a1c12", o));
  suelo.addColorStop(1, k.mezColor("#0c3a18", "#120c08", o));
  g.fillStyle = suelo;
  g.beginPath();
  g.moveTo(0, 1120);
  g.quadraticCurveTo(540, 980, 1080, 1140);
  g.lineTo(1080, 1920);
  g.lineTo(0, 1920);
  g.fill();
  // colinas lejanas, para que el suelo tenga profundidad
  g.fillStyle = k.mezColor("#176b38", "#3a2818", o);
  g.globalAlpha = 0.85;
  g.beginPath();
  g.moveTo(0, 1180);
  g.quadraticCurveTo(220, 1040, 460, 1160);
  g.quadraticCurveTo(700, 1280, 1080, 1100);
  g.lineTo(1080, 1260);
  g.lineTo(0, 1280);
  g.fill();
  g.globalAlpha = 1;
}

export function sol(g, x, y, rad, cubierto) {
  const c = Math.max(0, Math.min(1, cubierto));
  const al = 1 - c * 0.82;
  k.brillo(g, x, y, rad * 5.2, "amarilla", 0.55 * al);
  const gr = g.createRadialGradient(x - rad * 0.25, y - rad * 0.3, rad * 0.1, x, y, rad);
  gr.addColorStop(0, `rgba(255,255,240,${al})`);
  gr.addColorStop(0.55, `rgba(255,196,70,${al})`);
  gr.addColorStop(1, `rgba(230,110,30,${0.8 * al})`);
  g.fillStyle = gr;
  g.beginPath();
  g.arc(x, y, rad, 0, Math.PI * 2);
  g.fill();
}

// tipo: "polvo" gris, "azufre" amarillo, "hollin" negro.
export function nube(g, x, y, rx, ry, tipo, al) {
  if (al <= 0.02) return;
  const pal = tipo === "azufre" ? ["#f0d15a", "#b8860b"] : tipo === "hollin" ? ["#3a332e", "#100e0c"] : ["#efe8dc", "#9a9288"];
  const blobs = tipo === "azufre"
    ? [[0.1, 0, 0.9], [-0.35, 0.15, 0.6], [0.4, 0.1, 0.55]]
    : tipo === "hollin"
      ? [[0, 0.05, 1], [-0.3, -0.1, 0.7], [0.28, 0.12, 0.65], [0.05, -0.2, 0.5]]
      : [[-0.15, 0, 0.85], [0.25, 0.08, 0.7], [0, -0.18, 0.5]];
  g.save();
  g.globalAlpha *= al;
  for (const [dx, dy, s] of blobs) {
    const px = x + dx * rx, py = y + dy * ry, R = rx * s;
    const gr = g.createRadialGradient(px - R * 0.2, py - R * 0.2, R * 0.05, px, py, R);
    gr.addColorStop(0, pal[0]);
    gr.addColorStop(0.62, pal[1]);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(px, py, R, R * 0.58, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

function sombra(g, x, y, rx) {
  g.save();
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.beginPath();
  g.ellipse(x, y, rx, rx * 0.28, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

// Un árbol ancho. viva 1 verde, 0 ceniza.
export function arbol(g, x, y, h, viva) {
  const v = Math.max(0, Math.min(1, viva));
  const copa = k.mezColor("#21481f", "#2f8a32", v);
  const copa2 = k.mezColor("#3a342c", "#8ed15a", v);
  const tronco = k.mezColor("#2a211c", "#6b4428", v);
  g.save();
  sombra(g, x, y, h * 0.28);
  g.fillStyle = tronco;
  k.redondo(g, x - h * 0.06, y - h * 0.42, h * 0.12, h * 0.46, 8);
  g.fill();
  g.fillStyle = copa;
  g.beginPath();
  g.arc(x, y - h * 0.62, h * 0.28, 0, Math.PI * 2);
  g.arc(x - h * 0.22, y - h * 0.48, h * 0.2, 0, Math.PI * 2);
  g.arc(x + h * 0.2, y - h * 0.5, h * 0.18, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = copa2;
  g.beginPath();
  g.arc(x - h * 0.06, y - h * 0.72, h * 0.16, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

// Un gran dinosaurio de lado, apoyado en (x, y). caida 0 en pie, 1 derrumbado hacia la derecha.
export function dinosaurio(g, x, y, h, al, caida) {
  if (al <= 0.02) return;
  const c = Math.max(0, Math.min(1, caida));
  g.save();
  g.translate(x, y);
  g.rotate(c * 0.5);
  g.globalAlpha *= al * (1 - c * 0.25);
  const s = h / 520;
  g.scale(s, s);
  sombra(g, 20, 8, 180);
  // cola, cuerpo y cabeza, un solo bicho
  g.beginPath();
  g.moveTo(-250, -30);
  g.quadraticCurveTo(-180, -80, -70, -150);
  g.quadraticCurveTo(20, -250, 70, -280);
  g.quadraticCurveTo(130, -310, 200, -250);
  g.quadraticCurveTo(250, -210, 210, -180);
  g.quadraticCurveTo(160, -160, 120, -150);
  g.quadraticCurveTo(40, -70, 10, -40);
  g.quadraticCurveTo(-40, -20, -90, -50);
  g.quadraticCurveTo(-160, -20, -250, -30);
  g.closePath();
  const cg = g.createLinearGradient(-80, -300, 40, 0);
  cg.addColorStop(0, "#8ea84a");
  cg.addColorStop(0.45, "#5e7a32");
  cg.addColorStop(1, "#2c3a18");
  g.fillStyle = cg;
  g.fill();
  g.save();
  g.clip();
  g.globalAlpha *= 0.35;
  g.drawImage(k.manchas, -260, -320, 520, 340);
  g.restore();
  // pata
  g.fillStyle = "#4d682c";
  g.beginPath();
  g.moveTo(20, -90);
  g.quadraticCurveTo(70, -40, 60, 0);
  g.lineTo(20, 0);
  g.quadraticCurveTo(10, -40, -10, -80);
  g.fill();
  g.beginPath();
  g.moveTo(-40, -70);
  g.quadraticCurveTo(-10, -20, -30, 0);
  g.lineTo(-70, 0);
  g.quadraticCurveTo(-80, -30, -70, -60);
  g.fill();
  // ojo
  g.fillStyle = "#1a1208";
  g.beginPath();
  g.arc(168, -230, 7, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

// Un pez grande en un charco. viva 1, 0 se hunde.
export function pez(g, x, y, h, viva) {
  const v = Math.max(0, Math.min(1, viva));
  g.save();
  g.translate(x, y + (1 - v) * h * 0.25);
  g.globalAlpha *= v;
  const s = h / 280;
  g.scale(s, s);
  g.fillStyle = "rgba(40,120,170,0.55)";
  g.beginPath();
  g.ellipse(0, 20, 150, 48, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = k.mezColor("#5a5348", "#2f86b0", v);
  g.beginPath();
  g.ellipse(-10, 0, 90, 42, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(-90, 0);
  g.lineTo(-140, -32);
  g.lineTo(-140, 32);
  g.closePath();
  g.fill();
  g.fillStyle = "#102028";
  g.beginPath();
  g.arc(48, -8, 6, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

// Un ave con las alas abiertas. Se queda cuando los otros se apagan.
export function ave(g, x, y, h, al, aleteo) {
  if (al <= 0.02) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  const s = h / 160;
  g.scale(s, s);
  const ala = Math.sin(aleteo) * 0.35;
  g.fillStyle = "#f2efe6";
  g.save();
  g.rotate(-0.5 - ala);
  g.beginPath();
  g.ellipse(-70, 0, 78, 18, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.save();
  g.rotate(0.5 + ala);
  g.beginPath();
  g.ellipse(70, 0, 78, 18, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  g.fillStyle = "#d8b15a";
  g.beginPath();
  g.ellipse(0, 0, 28, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#e8a040";
  g.beginPath();
  g.moveTo(24, 0);
  g.lineTo(48, -4);
  g.lineTo(24, 6);
  g.fill();
  g.restore();
}

// Una planta grande. viva 1 erguida y verde, 0 mustia.
export function planta(g, x, y, h, viva) {
  const v = Math.max(0, Math.min(1, viva));
  g.save();
  g.translate(x, y);
  sombra(g, 0, 6, h * 0.22);
  const tallo = k.mezColor("#6a5430", "#2f7a32", v);
  g.strokeStyle = tallo;
  g.lineWidth = Math.max(8, h * 0.035);
  g.lineCap = "round";
  const dobla = (1 - v) * 0.9;
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(h * 0.05, -h * 0.35, h * dobla * 0.35, -h * (0.55 + 0.35 * v));
  g.stroke();
  const copaY = -h * (0.42 + 0.4 * v);
  const copaX = h * dobla * 0.38;
  g.fillStyle = k.mezColor("#6b5434", "#3aaa40", v);
  g.beginPath();
  g.ellipse(copaX, copaY, h * 0.22, h * (0.1 + 0.08 * v), dobla, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = k.mezColor("#4a3a28", "#b6e86a", v);
  g.beginPath();
  g.ellipse(copaX - h * 0.08, copaY - h * 0.06, h * 0.1, h * 0.06, -0.4, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

// El que come de la planta. caida 0 de pie, 1 en el suelo.
export function herbivoro(g, x, y, h, al, caida) {
  if (al <= 0.02) return;
  const c = Math.max(0, Math.min(1, caida));
  g.save();
  g.translate(x, y);
  g.rotate(c * 1.35);
  g.globalAlpha *= al;
  const s = h / 220;
  g.scale(s, s);
  sombra(g, 0, 6, 70);
  g.fillStyle = "#c4843a";
  g.beginPath();
  g.ellipse(0, -48, 58, 36, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.ellipse(48, -70, 26, 18, 0.4, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#6b3a16";
  g.beginPath();
  g.arc(58, -76, 4, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#a86c2c";
  g.fillRect(-20, -28, 12, 30);
  g.fillRect(16, -26, 12, 28);
  g.restore();
}

// La nave del ensayo: un cuerpo de metal y un motor encendido. ang en radianes.
export function nave(g, x, y, s, ang) {
  if (s < 0.02) return;
  const bx = x - Math.cos(ang) * 78 * s, by = y - Math.sin(ang) * 78 * s;
  k.brillo(g, bx, by, 70 * s, "cian", 0.85);
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  g.fillStyle = "#1c4f92";
  g.beginPath();
  g.moveTo(-20, 0);
  g.lineTo(36, -48);
  g.lineTo(58, -42);
  g.lineTo(8, 0);
  g.lineTo(58, 42);
  g.lineTo(36, 48);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(108, 0);
  g.lineTo(-48, -18);
  g.lineTo(-72, -10);
  g.lineTo(-72, 10);
  g.lineTo(-48, 18);
  g.closePath();
  k.metal(g, -72, 108, ["#8b93a0", "#f7f9fc", "#6e7682", "#ffffff", "#3a424c"]);
  g.restore();
}
