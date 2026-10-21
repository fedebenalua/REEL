// Del vídeo «cómo funciona un mando de la tele»: el salón de noche, la tele, el mando, los destellos y las cifras.
// Lo que comparten los planos: el salón de noche, la tele con sus canales, el mando y los destellos de luz.
// La cámara es sencilla: mira siempre de frente al fondo del salón y se mueve en x, y, z. A distancia 10, una unidad
// del mundo es un píxel; más cerca, más grande.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar } = k;

// ---------------------------------------------------------------- la cámara
export const CAM0 = { x: 0, y: 0, z: 0 };
export function pr(cam, X, Y, Z) {
  const d = Z - cam.z;
  if (d < 0.15) return null;
  const s = 10 / d;
  return { x: 540 + (X - cam.x) * s, y: 960 + (Y - cam.y) * s, s };
}
export const mezCam = (a, b, u) => ({ x: mez(a.x, b.x, u), y: mez(a.y, b.y, u), z: mez(a.z, b.z, u) });

// ---------------------------------------------------------------- dónde está cada cosa
export const TV = { X: 0, Y: -240, Z: 10, W: 760, H: 428 };          // el centro de la pantalla y su tamaño
export const MANDO = { X: 6, Y: 92, Z: 4.6, ang: -0.32 };              // la punta del mando y su giro
export const ROJO = "255,60,200";                                      // el color de la luz del mando (lo invisible)

// un punto del mando (en sus unidades: x de -60 a 60, y de 0 en la punta hacia abajo) en el mundo
export function enMando(lx, ly, M = MANDO) {
  const c = Math.cos(M.ang), s = Math.sin(M.ang);
  return [M.X + lx * c - ly * s, M.Y + lx * s + ly * c, M.Z];
}

// ---------------------------------------------------------------- los canales de la tele (se pintan una vez)
const CW = 960, CH = 540;
function atardecer() {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  const cielo = c.createLinearGradient(0, 0, 0, CH * 0.62);
  cielo.addColorStop(0, "#2a1b5e"); cielo.addColorStop(0.45, "#c2408a"); cielo.addColorStop(0.8, "#ff8a3d"); cielo.addColorStop(1, "#ffd27a");
  c.fillStyle = cielo; c.fillRect(0, 0, CW, CH);
  const sol = c.createRadialGradient(480, 330, 0, 480, 330, 300);
  sol.addColorStop(0, "rgba(255,250,220,1)"); sol.addColorStop(0.18, "rgba(255,220,120,1)"); sol.addColorStop(0.19, "rgba(255,190,90,0.7)"); sol.addColorStop(1, "rgba(255,120,60,0)");
  c.fillStyle = sol; c.fillRect(0, 0, CW, CH);
  const montes = [["#5a2d6e", 300, 0.9], ["#3b1f55", 340, 1.4], ["#22123a", 380, 2.1]];
  montes.forEach(([col, base, f], i) => {
    c.fillStyle = col; c.beginPath(); c.moveTo(0, CH);
    for (let x = 0; x <= CW; x += 20) c.lineTo(x, base - 60 * Math.sin(x / 140 * f + i * 2) - 30 * Math.sin(x / 47 + i));
    c.lineTo(CW, CH); c.closePath(); c.fill();
  });
  const mar = c.createLinearGradient(0, 400, 0, CH);
  mar.addColorStop(0, "#ff9d5c"); mar.addColorStop(1, "#4a1d5c");
  c.fillStyle = mar; c.fillRect(0, 410, CW, CH - 410);
  c.globalCompositeOperation = "lighter";
  for (let i = 0; i < 26; i++) { c.fillStyle = `rgba(255,220,150,${0.5 - i * 0.017})`; const w = 160 - i * 5 + (i % 3) * 30; c.fillRect(480 - w / 2, 416 + i * 5, w, 2.5); }
  return l;
}
function futbol() {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  const grada = c.createLinearGradient(0, 0, 0, 170);
  grada.addColorStop(0, "#0d1b3a"); grada.addColorStop(1, "#24407a"); c.fillStyle = grada; c.fillRect(0, 0, CW, 170);
  const az = azar(7);
  for (let i = 0; i < 900; i++) { c.fillStyle = ["#ffffff", "#ff4d4d", "#ffd84d", "#4dc3ff"][Math.floor(az() * 4)]; c.globalAlpha = 0.5 + az() * 0.5; c.fillRect(az() * CW, 20 + az() * 150, 3, 4); }
  c.globalAlpha = 1;
  for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? "#2f9e3c" : "#38b347"; c.beginPath(); c.moveTo(i * 96 - (i - 5) * 40, 170); c.lineTo((i + 1) * 96 - (i - 4) * 40, 170); c.lineTo((i + 1) * 96 * 1.6 - 300, CH); c.lineTo(i * 96 * 1.6 - 300, CH); c.closePath(); c.fill(); }
  c.strokeStyle = "rgba(255,255,255,0.9)"; c.lineWidth = 5;
  c.beginPath(); c.moveTo(0, 175); c.lineTo(CW, 175); c.stroke();
  c.beginPath(); c.ellipse(480, 360, 260, 90, 0, 0, 6.2832); c.stroke();
  c.beginPath(); c.moveTo(480, 175); c.lineTo(480, CH); c.stroke();
  const fo = c.createRadialGradient(480, 0, 0, 480, 0, 700); fo.addColorStop(0, "rgba(255,255,230,0.35)"); fo.addColorStop(1, "rgba(255,255,230,0)");
  c.fillStyle = fo; c.fillRect(0, 0, CW, CH);
  // el balón
  c.fillStyle = "#fff"; c.beginPath(); c.arc(610, 380, 26, 0, 6.2832); c.fill();
  c.fillStyle = "#222"; c.beginPath(); c.arc(616, 374, 9, 0, 6.2832); c.fill();
  return l;
}
function espacio() {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  const f = c.createLinearGradient(0, 0, CW, CH); f.addColorStop(0, "#050816"); f.addColorStop(1, "#1a0d3a"); c.fillStyle = f; c.fillRect(0, 0, CW, CH);
  const az = azar(41);
  for (let i = 0; i < 400; i++) { c.fillStyle = `rgba(255,255,255,${0.3 + az() * 0.7})`; const r = az() * 1.8 + 0.4; c.beginPath(); c.arc(az() * CW, az() * CH, r, 0, 6.2832); c.fill(); }
  const n = c.createRadialGradient(300, 200, 0, 300, 200, 400); n.addColorStop(0, "rgba(120,80,255,0.4)"); n.addColorStop(1, "rgba(120,80,255,0)"); c.fillStyle = n; c.fillRect(0, 0, CW, CH);
  k.tierra(c, 600, 300, 210, 0.6, -1, -0.3);
  return l;
}
export const CANALES = [atardecer(), futbol(), espacio()];

// La imagen de la tele en el lienzo c (CW × CH): el canal, que se mueve despacio, y al cambiar, el nuevo entra
// deslizando. canal: número (con decimales mientras cambia, de 0 a 1 entre el viejo y el nuevo).
export function imagenTV(c, canal, t) {
  const a = Math.floor(canal), u = canal - a;
  const pinta = (i, dx) => {
    const img = CANALES[((i % 3) + 3) % 3], z = 1.06 + 0.03 * Math.sin(t * 0.4 + i);
    const w = CW * z, h = CH * z;
    c.drawImage(img, dx + (CW - w) / 2 + 12 * Math.sin(t * 0.5 + i), (CH - h) / 2, w, h);
  };
  pinta(a, -CW * su(u));
  if (u > 0) pinta(a + 1, CW * (1 - su(u)));
}
const lienzoTV = k.lienzo(CW, CH);

// ---------------------------------------------------------------- el salón
const vetas = k.ruido(256, 91, 2, 4, "lineas");
const azS = azar(5);
const LIBROS = Array.from({ length: 11 }, (_, i) => ({ w: 14 + azS() * 14, h: 70 + azS() * 40, c: ["#b8463c", "#e0a33b", "#2f7d8c", "#6c4aa3", "#d1d1c7", "#3f8a4d"][Math.floor(azS() * 6)] }));

// La pared, la lámpara, la estantería, el mueble y la tele. op: { encendida (0-1), canal, flash (segundos desde que
// se enciende), volumen (0-1, y su barra al), ojito (0-1, el receptor encendido) }.
export function salon(g, cam, t, op = {}) {
  const enc = op.encendida ?? 0;
  // la pared: un azul de noche, con su textura, y la luz de la lámpara
  const pg = g.createLinearGradient(0, 0, 0, 1920);
  pg.addColorStop(0, "#14122b"); pg.addColorStop(0.55, "#221a3d"); pg.addColorStop(1, "#120d22");
  g.fillStyle = pg; g.fillRect(0, 0, 1080, 1920);
  const pa = pr(cam, 0, 0, 14);
  g.save(); g.globalAlpha = 0.18; g.globalCompositeOperation = "multiply";
  g.drawImage(vetas, pa.x - 1400 * pa.s / 0.71, pa.y - 1800 * pa.s / 0.71, 2800 * pa.s / 0.71, 3600 * pa.s / 0.71); g.restore();
  const la = pr(cam, -470, -120, 12);
  if (la) {
    k.brillo(g, la.x, la.y, 1500 * la.s, "255,170,90", 0.55);
    // la lámpara de pie: la pantalla de tela y el palo
    g.save(); g.translate(la.x, la.y); g.scale(la.s, la.s);
    g.strokeStyle = "#2a2230"; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 60); g.lineTo(0, 560); g.stroke();
    g.beginPath(); g.moveTo(-90, 80); g.lineTo(90, 80); g.lineTo(60, -60); g.lineTo(-60, -60); g.closePath();
    const lg = g.createLinearGradient(-90, 0, 90, 0); lg.addColorStop(0, "#ffb067"); lg.addColorStop(0.5, "#ffe1a8"); lg.addColorStop(1, "#e88a44");
    g.fillStyle = lg; g.fill();
    g.restore();
  }
  // la estantería a la derecha, con libros de colores
  const es = pr(cam, 520, -470, 11.5);
  if (es) {
    g.save(); g.translate(es.x, es.y); g.scale(es.s, es.s);
    for (let f = 0; f < 2; f++) {
      let x = -120;
      for (const b of LIBROS) { if (x > 110) break; const yb = f * 170; const lg = g.createLinearGradient(x, 0, x + b.w, 0); lg.addColorStop(0, b.c); lg.addColorStop(1, "#1a1424"); g.fillStyle = lg; g.fillRect(x, yb - b.h, b.w, b.h); x += b.w + 3; }
      const tb = g.createLinearGradient(0, f * 170, 0, f * 170 + 18); tb.addColorStop(0, "#8a6040"); tb.addColorStop(1, "#4a3020");
      g.fillStyle = tb; g.fillRect(-140, f * 170, 280, 18);
    }
    g.restore();
  }
  // el mueble de la tele, de madera, con una tira de luz morada debajo
  const mu = pr(cam, 0, 70, 10.4);
  if (mu) {
    g.save(); g.translate(mu.x, mu.y); g.scale(mu.s, mu.s);
    k.brillo(g, 0, 150, 1300, "160,90,255", 0.45);
    g.beginPath(); g.rect(-520, -60, 1040, 190);
    const mg = g.createLinearGradient(0, -60, 0, 130); mg.addColorStop(0, "#9a6a45"); mg.addColorStop(0.12, "#6e4a30"); mg.addColorStop(1, "#3a2618");
    g.fillStyle = mg; g.fill();
    g.save(); g.clip(); g.globalAlpha = 0.35; g.globalCompositeOperation = "multiply"; g.drawImage(vetas, -520, -60, 1040, 190); g.restore();
    g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(-2, -40, 4, 160);
    g.fillStyle = "rgba(255,220,180,0.25)"; g.fillRect(-520, -60, 1040, 6);
    g.restore();
  }
  tele(g, cam, t, op);
}

// La tele: el marco negro, la imagen (o el cristal apagado), su luz en la pared, el ojito y la barra del volumen.
export function tele(g, cam, t, op = {}) {
  const enc = op.encendida ?? 0;
  const p = pr(cam, TV.X, TV.Y, TV.Z);
  if (!p) return;
  const w = TV.W * p.s, h = TV.H * p.s, x0 = p.x - w / 2, y0 = p.y - h / 2, b = 16 * p.s;
  // la luz de la tele en la pared
  if (enc > 0) {
    k.brillo(g, p.x - w * 0.3, p.y, w * 1.6, "255,120,170", 0.5 * enc);
    k.brillo(g, p.x + w * 0.3, p.y, w * 1.6, "255,170,90", 0.45 * enc);
  }
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 50 * p.s; g.shadowOffsetY = 20 * p.s;
  k.redondo(g, x0 - b, y0 - b, w + 2 * b, h + 2 * b + 10 * p.s, 10 * p.s); g.fillStyle = "#0b0b0e"; g.fill(); g.restore();
  k.redondo(g, x0 - b, y0 - b, w + 2 * b, h + 2 * b + 10 * p.s, 10 * p.s); g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 2 * p.s; g.stroke();
  // la pantalla
  g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
  const ap = g.createLinearGradient(x0, y0, x0 + w, y0 + h); ap.addColorStop(0, "#15161c"); ap.addColorStop(1, "#060608");
  g.fillStyle = ap; g.fillRect(x0, y0, w, h);
  if (enc > 0) {
    const c = lienzoTV.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
    imagenTV(c, op.canal ?? 0, t);
    if (op.volumen != null && (op.volAl ?? 0) > 0) volumen(c, op.volumen, op.volAl);
    g.globalAlpha = enc; g.drawImage(lienzoTV, x0, y0, w, h); g.globalAlpha = 1;
  }
  // al encenderse: un golpe de luz blanca que se abre
  if (op.flash != null && op.flash > -0.05 && op.flash < 0.5) {
    const u = op.flash;
    g.fillStyle = `rgba(255,250,240,${Math.max(0, 0.95 * (1 - u / 0.45))})`;
    const hh = h * Math.min(1, 0.05 + u * 6);
    g.fillRect(x0, p.y - hh / 2, w, hh);
  }
  // el cristal: un reflejo en diagonal
  const rg = g.createLinearGradient(x0, y0, x0 + w, y0 + h);
  rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(0.3, "rgba(255,255,255,0.07)"); rg.addColorStop(0.42, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(x0, y0, w, h);
  g.restore();
  // el ojito: abajo en el centro del marco
  const oj = ojito(cam);
  const al = op.ojito ?? 0;
  g.fillStyle = "#1b0c14"; g.beginPath(); g.ellipse(oj.x, oj.y, 14 * p.s, 6 * p.s, 0, 0, 6.2832); g.fill();
  if (al > 0) k.brillo(g, oj.x, oj.y, 90 * p.s, ROJO, al);
}
export const ojito = (cam) => { const p = pr(cam, TV.X, TV.Y + TV.H / 2 + 13, TV.Z); return p; };

// La barra del volumen, dentro de la imagen de la tele.
export function volumen(c, nivel, al) {
  c.save(); c.globalAlpha = al;
  k.redondo(c, 60, 400, 840, 90, 45); c.fillStyle = "rgba(10,10,20,0.75)"; c.fill();
  c.fillStyle = "#fff"; c.font = "800 52px Figtree"; c.textAlign = "left"; c.textBaseline = "middle";
  // el altavoz
  c.beginPath(); c.moveTo(100, 432); c.lineTo(116, 432); c.lineTo(138, 414); c.lineTo(138, 486); c.lineTo(116, 468); c.lineTo(100, 468); c.closePath(); c.fill();
  c.strokeStyle = "#fff"; c.lineWidth = 5; c.beginPath(); c.arc(140, 450, 22, -0.8, 0.8); c.stroke(); c.beginPath(); c.arc(140, 450, 36, -0.8, 0.8); c.stroke();
  k.redondo(c, 200, 436, 560, 28, 14); c.fillStyle = "rgba(255,255,255,0.22)"; c.fill();
  const bg = c.createLinearGradient(200, 0, 760, 0); bg.addColorStop(0, "#5ad1ff"); bg.addColorStop(1, "#ff5ac8");
  k.redondo(c, 200, 436, Math.max(28, 560 * nivel), 28, 14); c.fillStyle = bg; c.fill();
  c.fillText(String(Math.round(nivel * 100)), 790, 452);
  c.restore();
}

// ---------------------------------------------------------------- el mando
const NUMS = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["", "0", ""]];
function boton(g, x, y, w, h, r, base, hundido = 0, texto = "", tc = "rgba(255,255,255,0.85)") {
  // la sombra que deja en el cuerpo
  g.fillStyle = "rgba(0,0,0,0.55)"; k.redondo(g, x - w / 2 - 1, y - h / 2 + 3, w + 2, h + 2, r); g.fill();
  const dy = hundido * 2.5;
  k.redondo(g, x - w / 2, y - h / 2 + dy, w, h, r);
  const bg = g.createLinearGradient(0, y - h / 2, 0, y + h / 2);
  bg.addColorStop(0, k.mezColor(base, "#ffffff", 0.28 * (1 - hundido))); bg.addColorStop(0.55, base); bg.addColorStop(1, k.mezColor(base, "#000000", 0.45));
  g.fillStyle = bg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 0.8; g.stroke();
  if (texto) { g.fillStyle = tc; g.font = `700 ${Math.round(h * 0.62)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(texto, x, y + dy + 0.5); }
}
// El mando con la punta en el punto del mundo de MANDO (o M), visto con la cámara cam. op: { pulsa: 0-1 el botón
// rojo hundido, pulsaVol: 0-1 el volumen, led: 0-1 la lucecita, al }.
export function mando(g, cam, t, op = {}, M = MANDO) {
  const p = pr(cam, M.X, M.Y, M.Z);
  if (!p || (op.al ?? 1) < 0.01) return p;
  g.save(); g.globalAlpha = op.al ?? 1;
  g.translate(p.x, p.y); g.rotate(M.ang); g.scale(p.s, p.s);
  // la sombra del mando
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 40; g.shadowOffsetX = 14; g.shadowOffsetY = 20;
  k.redondo(g, -60, -4, 120, 520, 34); g.fillStyle = "#1a1a20"; g.fill(); g.restore();
  // el cuerpo: plástico negro, con luz por la izquierda
  k.redondo(g, -60, -4, 120, 520, 34);
  const cg = g.createLinearGradient(-60, 0, 60, 0);
  cg.addColorStop(0, "#5a5d68"); cg.addColorStop(0.12, "#33353d"); cg.addColorStop(0.6, "#202128"); cg.addColorStop(0.92, "#141419"); cg.addColorStop(1, "#2a2b32");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip();
  g.globalAlpha = 0.25; g.globalCompositeOperation = "multiply"; g.drawImage(k.red, -80, -10, 160, 540); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // la punta: plástico oscuro y brillante que deja pasar la luz
  const pg = g.createLinearGradient(0, -4, 0, 24); pg.addColorStop(0, "#3a0f22"); pg.addColorStop(1, "#16070e");
  g.fillStyle = pg; g.fillRect(-60, -4, 120, 26);
  g.fillStyle = "rgba(255,255,255,0.22)"; g.fillRect(-50, 0, 100, 2);
  g.restore();
  // el reflejo largo del borde
  k.reflejo(g, -54, 30, 4, 440, 0.2);
  // la lucecita, tras el plástico
  if ((op.led ?? 0) > 0) { k.brillo(g, 0, 9, 90, ROJO, op.led); }
  // los botones
  boton(g, -32, 46, 30, 26, 13, "#e0283c", op.pulsa ?? 0);
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 2.2; g.lineCap = "round";
  const hp = (op.pulsa ?? 0) * 2.5;
  g.beginPath(); g.arc(-32, 46 + hp, 6, -1.1, 4.25); g.stroke(); g.beginPath(); g.moveTo(-32, 38 + hp); g.lineTo(-32, 45 + hp); g.stroke();
  if ((op.pulsa ?? 0) > 0) k.brillo(g, -32, 46, 110, "255,90,110", 0.8 * op.pulsa);
  boton(g, 32, 46, 26, 18, 9, "#3b3d46");
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 1.6; g.strokeRect(26, 42, 12, 8);
  NUMS.forEach((fila, j) => fila.forEach((n, i) => { if (n) boton(g, -34 + i * 34, 82 + j * 26, 28, 19, 8, "#3b3d46", 0, n); }));
  // la cruz con el OK
  g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.arc(0, 212, 38, 0, 6.2832); g.fill();
  const dg = g.createRadialGradient(-10, 200, 4, 0, 210, 38); dg.addColorStop(0, "#5c5f6b"); dg.addColorStop(1, "#24252c");
  g.fillStyle = dg; g.beginPath(); g.arc(0, 210, 36, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  for (let i = 0; i < 4; i++) { g.save(); g.translate(0, 210); g.rotate(i * Math.PI / 2); g.beginPath(); g.moveTo(-5, -26); g.lineTo(5, -26); g.lineTo(0, -32); g.closePath(); g.fill(); g.restore(); }
  boton(g, 0, 210, 30, 30, 15, "#4a4d58", 0, "OK");
  // volumen y canal
  const pv = op.pulsaVol ?? 0;
  boton(g, -36, 282, 24, 60, 12, "#3b3d46", pv, "");
  boton(g, 36, 282, 24, 60, 12, "#3b3d46", op.pulsaCanal ?? 0, "");
  g.fillStyle = "rgba(255,255,255,0.85)"; g.font = "800 16px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("+", -36, 264 + pv * 2.5); g.fillText("-", -36, 299 + pv * 2.5);
  g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 2.2; g.beginPath(); g.moveTo(31, 268); g.lineTo(36, 262); g.lineTo(41, 268); g.moveTo(31, 296); g.lineTo(36, 302); g.lineTo(41, 296); g.stroke();
  if (pv > 0) k.brillo(g, -36, 264, 70, "120,200,255", 0.7 * pv);
  // los botones de colores
  ["#e0283c", "#2fbf55", "#f2c230", "#2f7ae0"].forEach((c, i) => boton(g, -39 + i * 26, 336, 20, 11, 5, c));
  g.restore();
  return p;
}
// Dónde sale la luz: la lucecita de la punta, en pantalla.
export const punta = (cam, M = MANDO) => { const P = enMando(0, 9, M); return pr(cam, P[0], P[1], P[2]); };

// ---------------------------------------------------------------- los destellos
// Un destello que va de a a b (en pantalla): un arco de luz de cara a donde va. u: 0 sale, 1 llega. fantasma: 0 se ve,
// 1 casi no (un temblor del aire).
export function destello(g, a, b, u, tam, fantasma = 0, color = ROJO) {
  if (u < 0 || u > 1) return;
  const x = mez(a.x, b.x, u), y = mez(a.y, b.y, u), ang = Math.atan2(b.y - a.y, b.x - a.x), r = tam * mez(1, 0.45, u);
  const al = Math.min(1, u * 8) * Math.min(1, (1 - u) * 6);
  g.save(); g.translate(x, y); g.rotate(ang); g.lineCap = "round";
  if (fantasma < 1) {
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(${color},${0.35 * al * (1 - fantasma)})`; g.lineWidth = r * 0.5;
    g.beginPath(); g.arc(-r, 0, r, -0.7, 0.7); g.stroke();
    g.strokeStyle = `rgba(255,235,250,${0.95 * al * (1 - fantasma)})`; g.lineWidth = r * 0.14;
    g.beginPath(); g.arc(-r, 0, r, -0.7, 0.7); g.stroke();
  }
  if (fantasma > 0) {
    g.globalCompositeOperation = "source-over";
    g.strokeStyle = `rgba(220,230,255,${0.22 * al * fantasma})`; g.lineWidth = r * 0.08;
    g.beginPath(); g.arc(-r, 0, r, -0.7, 0.7); g.stroke();
    g.beginPath(); g.arc(-r * 1.08, 0, r, -0.6, 0.6); g.stroke();
  }
  g.restore();
}

// El velo de arriba, para que el subtítulo se lea si detrás hay algo claro.
export function velo(g, al = 0.55) {
  const vg = g.createLinearGradient(0, 200, 0, 620);
  vg.addColorStop(0, `rgba(8,6,18,${al})`); vg.addColorStop(1, "rgba(8,6,18,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}

// ---------------------------------------------------------------- el número del botón
export const CODIGO = [1, 0, 1, 1, 0, 1, 0, 0];               // el del botón de subir el volumen (inventado, de 8 cifras)
// Las cifras en fila, centradas en (x, y), cada una en su pastilla de luz. n: cuántas se ven (con decimales, la última
// entrando). tam: el alto de cada cifra.
export function cifras(g, x, y, bits, n = bits.length, tam = 90, al = 1, color = "255,210,90") {
  if (al <= 0.01) return;
  const paso = tam * 0.95, x0 = x - (paso * (bits.length - 1)) / 2;
  g.save(); g.globalAlpha *= al;
  g.font = `800 ${Math.round(tam)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  bits.forEach((b, i) => {
    const u = Math.max(0, Math.min(1, n - i));
    if (u <= 0) return;
    const yy = y + (1 - k.entra(u)) * tam * 0.8, xx = x0 + i * paso;
    g.save(); g.globalAlpha *= u;
    k.redondo(g, xx - paso * 0.42, yy - tam * 0.62, paso * 0.84, tam * 1.24, tam * 0.2);
    g.fillStyle = "rgba(10,8,20,0.75)"; g.fill();
    g.strokeStyle = `rgba(${color},0.6)`; g.lineWidth = Math.max(2, tam * 0.04); g.stroke();
    g.shadowColor = `rgba(${color},0.95)`; g.shadowBlur = tam * 0.35;
    g.fillStyle = `rgb(${color})`; g.fillText(String(b), xx, yy + tam * 0.04);
    g.restore();
  });
  g.restore();
}

// ---------------------------------------------------------------- el móvil
// Un móvil de frente, centrado en (x, y), de ancho w (alto 2,05 w), girado ang. pantalla(c, W, H): dibuja lo que
// enseña su pantalla en un lienzo de W × H.
const lienzoMovil = k.lienzo(900, 1850);
export function movil(g, x, y, w, ang, pantalla, al = 1) {
  if (al <= 0.01) return;
  const h = w * 2.05, r = w * 0.14;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  g.save(); g.shadowColor = "rgba(0,0,0,0.75)"; g.shadowBlur = w * 0.15; g.shadowOffsetY = w * 0.06;
  k.redondo(g, -w / 2, -h / 2, w, h, r); g.fillStyle = "#222"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, r); k.metal(g, -w / 2, w / 2, ["#3a3d44", "#c9ced6", "#6b707a", "#e6e9ee", "#33363c"]);
  const m = w * 0.035, sw = w - 2 * m, sh = h - 2 * m;
  const c = lienzoMovil.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  c.fillStyle = "#000"; c.fillRect(0, 0, 900, 1850);
  pantalla(c, 900, 1850);
  g.save(); k.redondo(g, -sw / 2, -sh / 2, sw, sh, r * 0.8); g.clip();
  g.drawImage(lienzoMovil, -sw / 2, -sh / 2, sw, sh);
  g.globalCompositeOperation = "screen";
  const rg = g.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2); rg.addColorStop(0.25, "rgba(255,255,255,0)"); rg.addColorStop(0.32, "rgba(255,255,255,0.1)"); rg.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(-sw / 2, -sh / 2, sw, sh);
  g.restore();
  k.redondo(g, -w * 0.13, -sh / 2 + w * 0.03, w * 0.26, w * 0.065, w * 0.033); g.fillStyle = "#050505"; g.fill();
  g.restore();
}
