// Lo que comparten los planos (el salón, el mando, el móvil y las pilas son los de los dos vídeos anteriores del mando,
// que el creador pidió seguir haciendo, y el router del wifi; aquí se suman la serie en la tele, el sofá con sus
// cojines y el cajón sin pilas): el salón de noche, con su ventana, la tele con sus canales, el mando y los destellos de luz.
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
function serie() {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  const f = c.createLinearGradient(0, 0, 0, CH); f.addColorStop(0, "#0b1030"); f.addColorStop(1, "#2a0f3a"); c.fillStyle = f; c.fillRect(0, 0, CW, CH);
  const az = azar(19);
  // una ciudad de noche, con ventanas encendidas
  for (let i = 0; i < 16; i++) { const w = 40 + az() * 50, h = 120 + az() * 260, x = i * 62 - 20; c.fillStyle = "#0a0a18"; c.fillRect(x, CH - h, w, h); for (let y = CH - h + 14; y < CH - 10; y += 22) for (let xx = x + 8; xx < x + w - 8; xx += 16) if (az() < 0.4) { c.fillStyle = az() < 0.5 ? "#ffd27a" : "#7ad0ff"; c.fillRect(xx, y, 7, 10); } }
  const lu = c.createRadialGradient(720, 120, 10, 720, 120, 260); lu.addColorStop(0, "rgba(255,240,220,0.9)"); lu.addColorStop(0.2, "rgba(255,240,220,0.3)"); lu.addColorStop(1, "rgba(255,240,220,0)");
  c.fillStyle = lu; c.fillRect(0, 0, CW, CH);
  c.fillStyle = "rgba(0,0,0,0.45)"; c.fillRect(0, 0, CW, CH);
  c.fillStyle = "#fff"; c.font = "800 74px Figtree"; c.textAlign = "left"; c.fillText("T1 · Episodio 4", 70, 210);
  c.fillStyle = "rgba(255,255,255,0.8)"; c.font = "600 40px Figtree"; c.fillText("Empieza en 5", 74, 280);
  c.fillStyle = "rgba(255,255,255,0.25)"; k.redondo(c, 70, 440, 820, 14, 7); c.fill();
  c.fillStyle = "#e5303c"; k.redondo(c, 70, 440, 300, 14, 7); c.fill();
  // el triángulo de reproducir
  c.fillStyle = "rgba(255,255,255,0.9)"; c.beginPath(); c.moveTo(440, 300); c.lineTo(440, 400); c.lineTo(530, 350); c.closePath(); c.fill();
  return l;
}
export const CANALES = [atardecer(), futbol(), espacio(), serie()];
export const SERIE = 3;

// La imagen de la tele en el lienzo c (CW × CH): el canal, que se mueve despacio, y al cambiar, el nuevo entra
// deslizando. canal: número (con decimales mientras cambia, de 0 a 1 entre el viejo y el nuevo).
export function imagenTV(c, canal, t) {
  const a = Math.floor(canal), u = canal - a;
  const pinta = (i, dx) => {
    const img = CANALES[((i % CANALES.length) + CANALES.length) % CANALES.length], z = 1.06 + 0.03 * Math.sin(t * 0.4 + i);
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
const CIUDAD = Array.from({ length: 40 }, () => ({ x: -160 + azS() * 320, y: 60 + azS() * 190, w: 6 + azS() * 10, h: 8 + azS() * 10, c: azS() < 0.5 ? "#ffd27a" : "#9ad0ff" }));
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
    const lp = op.lampara ?? 1;
    k.brillo(g, la.x, la.y, 1500 * la.s * (0.8 + 0.4 * lp), "255,170,90", 0.55 * lp);
    // la lámpara de pie: la pantalla de tela y el palo
    g.save(); g.translate(la.x, la.y); g.scale(la.s, la.s);
    g.strokeStyle = "#2a2230"; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 60); g.lineTo(0, 560); g.stroke();
    g.beginPath(); g.moveTo(-90, 80); g.lineTo(90, 80); g.lineTo(60, -60); g.lineTo(-60, -60); g.closePath();
    const lg = g.createLinearGradient(-90, 0, 90, 0); const lp2 = op.lampara ?? 1;
    lg.addColorStop(0, k.mezColor("#4a3a40", "#ffb067", lp2)); lg.addColorStop(0.5, k.mezColor("#5a4850", "#ffe1a8", lp2)); lg.addColorStop(1, k.mezColor("#3a2e34", "#e88a44", lp2));
    g.fillStyle = lg; g.fill();
    g.restore();
  }
  // la ventana a la derecha: de noche, la ciudad; con op.ventana, el día entra
  const ve = pr(cam, 500, -300, 11.5);
  if (ve) {
    const dia = op.ventana ?? 0;
    g.save(); g.translate(ve.x, ve.y); g.scale(ve.s, ve.s);
    const vg = g.createLinearGradient(0, -260, 0, 260);
    vg.addColorStop(0, k.mezColor("#0b1430", "#7cc8ff", dia)); vg.addColorStop(1, k.mezColor("#1e1a40", "#fff1c9", dia));
    g.fillStyle = vg; g.fillRect(-170, -260, 340, 520);
    if (dia < 1) { g.globalAlpha = 1 - dia; for (const c of CIUDAD) { g.fillStyle = c.c; g.fillRect(c.x, c.y, c.w, c.h); } g.globalAlpha = 1; }
    if (dia > 0) k.brillo(g, 60, -120, 500, "255,240,200", 0.9 * dia);
    g.fillStyle = "#2a2232"; g.fillRect(-180, -270, 360, 16); g.fillRect(-180, 254, 360, 16); g.fillRect(-180, -270, 16, 540); g.fillRect(164, -270, 16, 540); g.fillRect(-6, -270, 12, 540); g.fillRect(-180, -10, 360, 10);
    g.restore();
    if (dia > 0) k.brillo(g, ve.x, ve.y, 1800 * ve.s, "255,230,170", 0.5 * dia);
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

// ---------------------------------------------------------------- la punta del mando, de frente
// Centrada en (cx, cy), de ancho w: la cara de plástico rojo oscuro con la lucecita, y arriba la tapa con los botones,
// alejándose. led: lo que brilla la lucecita (0 a 1, así la ve la cámara del móvil); p: el botón rojo hundido.
export function puntaDeFrente(g, cx, cy, w, led, p = 0) {
  const h = w * 0.4, sup = w * 0.42;
  g.save();
  g.beginPath(); g.moveTo(cx - w / 2 + 10, cy - h / 2 + 6); g.lineTo(cx - w * 0.36, cy - h / 2 - sup); g.lineTo(cx + w * 0.36, cy - h / 2 - sup); g.lineTo(cx + w / 2 - 10, cy - h / 2 + 6); g.closePath();
  const tg = g.createLinearGradient(0, cy - h / 2 - sup, 0, cy - h / 2); tg.addColorStop(0, "#15151a"); tg.addColorStop(1, "#3a3c45");
  g.fillStyle = tg; g.fill();
  g.clip(); g.globalAlpha = 0.25; g.globalCompositeOperation = "multiply"; g.drawImage(k.red, cx - w / 2, cy - h / 2 - sup, w, sup); g.restore();
  const bot = (bx, by, r, col, hund = 0) => {
    const x = cx + bx * w, y = cy - h / 2 - by * sup + hund * 4, rx = r * w, ry = r * w * 0.38;
    g.fillStyle = "rgba(0,0,0,0.55)"; g.beginPath(); g.ellipse(x, y + ry * 0.5, rx, ry, 0, 0, 6.2832); g.fill();
    const bg = g.createLinearGradient(0, y - ry, 0, y + ry); bg.addColorStop(0, k.mezColor(col, "#ffffff", 0.3 * (1 - hund))); bg.addColorStop(1, k.mezColor(col, "#000000", 0.4));
    g.fillStyle = bg; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.2832); g.fill();
  };
  bot(-0.22, 0.32, 0.085, "#e0283c", p); bot(0.22, 0.32, 0.07, "#3b3d46");
  for (let i = -1; i <= 1; i++) bot(i * 0.17, 0.72, 0.055, "#3b3d46");
  if (p > 0) k.brillo(g, cx - 0.22 * w, cy - h / 2 - 0.32 * sup, w * 0.35, "255,90,110", 0.7 * p);
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = w * 0.08; g.shadowOffsetY = w * 0.04;
  k.redondo(g, cx - w / 2, cy - h / 2, w, h, h * 0.42); g.fillStyle = "#1a0710"; g.fill(); g.restore();
  k.redondo(g, cx - w / 2, cy - h / 2, w, h, h * 0.42);
  const cg = g.createRadialGradient(cx - w * 0.15, cy - h * 0.3, 10, cx, cy, w * 0.6);
  cg.addColorStop(0, "#5a1530"); cg.addColorStop(0.5, "#2c0a18"); cg.addColorStop(1, "#12040a");
  g.fillStyle = cg; g.fill();
  g.strokeStyle = "rgba(255,180,210,0.25)"; g.lineWidth = w * 0.006; g.stroke();
  g.fillStyle = "rgba(90,60,120,0.6)"; g.beginPath(); g.arc(cx, cy, w * 0.07, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.arc(cx - w * 0.02, cy - w * 0.02, w * 0.025, 0, 6.2832); g.fill();
  g.save(); k.redondo(g, cx - w / 2, cy - h / 2, w, h, h * 0.42); g.clip();
  const rg = g.createLinearGradient(0, cy - h / 2, 0, cy); rg.addColorStop(0, "rgba(255,255,255,0.16)"); rg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(cx - w / 2, cy - h / 2, w, h * 0.4);
  g.restore();
  if (led > 0) { k.brillo(g, cx, cy, w * 1.6, "200,110,255", 0.8 * led); k.brillo(g, cx, cy, w * 0.6, "255,235,255", led); }
}

// La pantalla del móvil con la cámara abierta, apuntando a la punta del mando (para movil()).
const azP = azar(12);
export const BOKEH = Array.from({ length: 24 }, () => ({ x: azP() * 1080, y: azP() * 1920, r: 60 + azP() * 160, c: ["255,140,80", "255,80,180", "120,100,255"][Math.floor(azP() * 3)] }));
export function fondoOscuro(g) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#0c0918"); fg.addColorStop(1, "#1a1028");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) { const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${b.c},0.12)`); gr.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = gr; g.fillRect(b.x - b.r, b.y - b.r, 2 * b.r, 2 * b.r); }
  g.restore();
}
export function camaraDelMovil(led, p) {
  return (c, W, H) => {
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#120d1e"); bg.addColorStop(1, "#22152f");
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.save(); c.globalAlpha = 0.45; c.globalCompositeOperation = "lighter";
    for (const b of BOKEH.slice(0, 10)) { const x = b.x * 0.8, y = b.y * 0.95, gr = c.createRadialGradient(x, y, 0, x, y, b.r * 1.3); gr.addColorStop(0, `rgba(${b.c},0.25)`); gr.addColorStop(1, `rgba(${b.c},0)`); c.fillStyle = gr; c.fillRect(x - b.r * 1.3, y - b.r * 1.3, b.r * 2.6, b.r * 2.6); }
    c.restore();
    puntaDeFrente(c, W / 2, H * 0.47, W * 0.86, led, p);
    c.fillStyle = "rgba(0,0,0,0.4)"; c.fillRect(0, H - 330, W, 330); c.fillRect(0, 0, W, 170);
    c.strokeStyle = "#fff"; c.lineWidth = 12; c.beginPath(); c.arc(W / 2, H - 165, 90, 0, 6.2832); c.stroke();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(W / 2, H - 165, 72, 0, 6.2832); c.fill();
    c.fillStyle = "#ffd23c"; c.font = "800 52px Figtree"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FOTO", W / 2, H - 290);
  };
}
// Lo que no se ve: un temblor transparente que sale de (cx, cy) a cada golpe.
export function temblor(g, cx, cy, w, t, golpes) {
  g.save();
  for (const te of golpes) {
    const u = (t - te) / 0.7; if (u < 0 || u > 1) continue;
    const r = mez(w * 0.1, w * 0.9, u), al = Math.min(1, u * 5) * (1 - u);
    g.strokeStyle = `rgba(210,220,255,${0.22 * al})`; g.lineWidth = 6;
    g.beginPath(); g.arc(cx, cy, r, 0, 6.2832); g.stroke();
  }
  g.restore();
}

// una pila grande, tumbada, centrada en (x, y), de largo L, girada ang; nivel: lo que le queda (0 a 1)
export function pila(g, x, y, L, ang, nivel, t) {
  const h = L * 0.3;
  g.save(); g.translate(x, y); g.rotate(ang);
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 50; g.shadowOffsetY = 25;
  k.redondo(g, -L / 2, -h / 2, L, h, h * 0.18); g.fillStyle = "#111"; g.fill(); g.restore();
  // el cuerpo: negro y cobre
  k.redondo(g, -L / 2, -h / 2, L, h, h * 0.18);
  const cg = g.createLinearGradient(0, -h / 2, 0, h / 2);
  cg.addColorStop(0, "#5a5d68"); cg.addColorStop(0.18, "#2a2b33"); cg.addColorStop(0.55, "#121216"); cg.addColorStop(1, "#2a2b33");
  g.fillStyle = cg; g.fill();
  g.save(); k.redondo(g, -L / 2, -h / 2, L, h, h * 0.18); g.clip();
  const cu = g.createLinearGradient(0, -h / 2, 0, h / 2); cu.addColorStop(0, "#ffcf8a"); cu.addColorStop(0.2, "#d2853a"); cu.addColorStop(0.6, "#7a4318"); cu.addColorStop(1, "#c07a35");
  g.fillStyle = cu; g.fillRect(L / 2 - L * 0.3, -h / 2, L * 0.3, h);
  g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(-L / 2, -h / 2 + h * 0.12, L, h * 0.08);
  g.restore();
  // el polo +
  const pg = g.createLinearGradient(0, -h * 0.2, 0, h * 0.2); pg.addColorStop(0, "#f2f4f7"); pg.addColorStop(1, "#7d838c");
  g.fillStyle = pg; k.redondo(g, L / 2 - 4, -h * 0.17, h * 0.16, h * 0.34, 6); g.fill();
  g.fillStyle = "#fff"; g.font = `800 ${Math.round(h * 0.5)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("+", L / 2 - L * 0.15, 2);
  // la marca de lo que le queda: casi vacía, en rojo
  const bw = L * 0.42, bx = -L / 2 + L * 0.12, bh = h * 0.36;
  k.redondo(g, bx, -bh / 2, bw, bh, bh * 0.25); g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 6; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.fillRect(bx + bw, -bh * 0.22, 10, bh * 0.44);
  const late = 0.6 + 0.4 * Math.sin(t * 9);
  k.redondo(g, bx + 8, -bh / 2 + 8, Math.max(14, (bw - 16) * nivel), bh - 16, 6); g.fillStyle = `rgba(255,50,60,${late})`; g.fill();
  g.restore();
  k.brillo(g, x - L * 0.12, y, L * 0.8, "255,60,70", 0.35 * late);
}


// La pantalla del móvil con la app de mando (para movil()): el nombre, el botón de encender, el OK y el volumen.
// brilla: un golpe de luz en toda la app (0 a 1).
export function appMando(brilla = 0, aparecen = 99) {
  return (c, W, H) => {
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1b1440"); bg.addColorStop(1, "#0d0a20");
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "rgba(255,255,255,0.75)"; c.font = "700 52px Figtree"; c.fillText("Tele del salón", W / 2, 230);
    let n = 0;
    const bt = (x, y, r, col, txt) => {
      const u = Math.max(0, Math.min(1, aparecen - n++)); if (u <= 0) return;
      r *= k.entra(u);
      const gg = c.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); gg.addColorStop(0, k.mezColor(col, "#ffffff", 0.35)); gg.addColorStop(1, col);
      c.fillStyle = gg; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
      c.fillStyle = "#fff"; c.font = `800 ${Math.round(r * 0.9)}px Figtree`; c.fillText(txt, x, y + 4);
    };
    bt(W / 2, 470, 120, "#e0283c", "I");
    c.fillStyle = "rgba(255,255,255,0.08)"; c.beginPath(); c.arc(W / 2, 900, 230, 0, 6.2832); c.fill();
    bt(W / 2, 900, 95, "#5a4cd6", "OK");
    bt(W / 2 - 220, 1350, 110, "#2f7ae0", "+"); bt(W / 2 + 220, 1350, 110, "#2f7ae0", "-");
    bt(W / 2 - 220, 1620, 90, "#3b3d46", "1"); bt(W / 2, 1620, 90, "#3b3d46", "2"); bt(W / 2 + 220, 1620, 90, "#3b3d46", "3");
    if (brilla > 0) { c.fillStyle = `rgba(255,200,255,${0.5 * brilla})`; c.fillRect(0, 0, W, H); }
  };
}

// ---------------------------------------------------------------- el wifi
export const ROUTER = { X: 330, Y: -22, Z: 10.3 };
// El router encima del mueble: una caja negra con sus antenas y sus lucecitas verdes.
export function router(g, cam, t, al = 1) {
  const p = pr(cam, ROUTER.X, ROUTER.Y, ROUTER.Z);
  if (!p || al <= 0.01) return p;
  g.save(); g.globalAlpha *= al; g.translate(p.x, p.y); g.scale(p.s, p.s);
  g.strokeStyle = "#1a1a20"; g.lineWidth = 9; g.lineCap = "round";
  for (const a of [-0.35, 0.35]) { g.beginPath(); g.moveTo(a * 140, -20); g.lineTo(a * 140 + a * 60, -150); g.stroke(); }
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 20; g.shadowOffsetY = 8;
  k.redondo(g, -90, -40, 180, 44, 12);
  const rg = g.createLinearGradient(0, -40, 0, 4); rg.addColorStop(0, "#4a4c56"); rg.addColorStop(0.3, "#25262d"); rg.addColorStop(1, "#111116");
  g.fillStyle = rg; g.fill(); g.restore();
  for (let i = 0; i < 5; i++) { const on = 0.5 + 0.5 * Math.sin(t * (6 + i * 2.3) + i); k.brillo(g, -60 + i * 22, -14, 30, "90,255,140", 0.5 + 0.5 * on); }
  g.restore();
  return p;
}
// Las ondas del wifi: arcos que salen de (x, y) y se abren. al: cuánto se ven.
export function ondasWifi(g, x, y, t, al = 1, R = 900, color = "90,220,255") {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; i < 5; i++) {
    const u = ((t * 0.7 + i / 5) % 1), r = mez(40, R, u), a = al * Math.min(1, u * 6) * (1 - u);
    g.strokeStyle = `rgba(${color},${0.35 * a})`; g.lineWidth = 22; g.beginPath(); g.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.strokeStyle = `rgba(220,250,255,${0.7 * a})`; g.lineWidth = 5; g.beginPath(); g.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  }
  g.restore();
}
// El símbolo del wifi, pequeño, en (x, y), de tamaño s.
export function iconoWifi(g, x, y, s, al = 1, color = "90,220,255") {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.strokeStyle = `rgb(${color})`; g.lineCap = "round"; g.lineWidth = s * 0.13;
  g.shadowColor = `rgba(${color},0.9)`; g.shadowBlur = s * 0.4;
  for (const r of [0.35, 0.65, 0.95]) { g.beginPath(); g.arc(x, y, s * r, Math.PI * 1.25, Math.PI * 1.75); g.stroke(); }
  g.fillStyle = `rgb(${color})`; g.beginPath(); g.arc(x, y, s * 0.1, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- el sofá
// El sofá de frente, centrado en (x, y) (el borde de arriba del asiento), de ancho w. hueco: dónde está la raja entre
// los dos cojines (x en pantalla), para que algo se caiga dentro.
export function sofa(g, x, y, w, t) {
  const h = w * 0.55;
  g.save();
  // el respaldo
  k.redondo(g, x - w / 2, y - h * 0.85, w, h * 0.9, w * 0.08);
  const rg = g.createLinearGradient(0, y - h * 0.85, 0, y); rg.addColorStop(0, "#d8664a"); rg.addColorStop(1, "#9a3a28");
  g.fillStyle = rg; g.fill();
  // los cojines del respaldo
  for (const s of [-1, 1]) {
    k.redondo(g, x + s * w * 0.22 - w * 0.2, y - h * 0.78, w * 0.4, h * 0.7, w * 0.06);
    const cg = g.createRadialGradient(x + s * w * 0.2, y - h * 0.55, 10, x + s * w * 0.22, y - h * 0.45, w * 0.3); cg.addColorStop(0, "#f08a68"); cg.addColorStop(1, "#b44a32");
    g.fillStyle = cg; g.fill();
  }
  // el asiento: dos cojines y la raja en medio
  for (const s of [-1, 1]) {
    k.redondo(g, x + s * w * 0.225 - w * 0.215, y - h * 0.05, w * 0.43, h * 0.32, w * 0.05);
    const sg = g.createLinearGradient(0, y - h * 0.05, 0, y + h * 0.27); sg.addColorStop(0, "#f39a78"); sg.addColorStop(0.4, "#d8664a"); sg.addColorStop(1, "#8a3222");
    g.fillStyle = sg; g.fill();
  }
  g.fillStyle = "#3a120a"; g.fillRect(x - w * 0.012, y - h * 0.04, w * 0.024, h * 0.3);
  // los brazos
  for (const s of [-1, 1]) {
    k.redondo(g, x + s * w * 0.5 - w * 0.07, y - h * 0.45, w * 0.14, h * 0.85, w * 0.06);
    const bg = g.createLinearGradient(x + s * w * 0.5 - w * 0.07, 0, x + s * w * 0.5 + w * 0.07, 0); bg.addColorStop(0, "#c4523a"); bg.addColorStop(1, "#8a3222");
    g.fillStyle = bg; g.fill();
  }
  // la parte de abajo y las patas
  g.fillStyle = "#7a2a1c"; g.fillRect(x - w * 0.5, y + h * 0.26, w, h * 0.16);
  g.fillStyle = "#2a1a10"; for (const s of [-0.45, 0.45]) g.fillRect(x + s * w - 10, y + h * 0.42, 20, h * 0.1);
  g.save(); k.redondo(g, x - w / 2, y - h * 0.85, w, h * 1.3, w * 0.08); g.clip(); g.globalAlpha = 0.25; g.globalCompositeOperation = "multiply"; g.drawImage(k.red, x - w / 2, y - h, w, h * 1.5); g.restore();
  g.restore();
}

// ---------------------------------------------------------------- el cajón sin pilas
// Un cajón abierto visto desde arriba, centrado en (x, y), de ancho w: cinta, tijeras, gomas, llaves, un mechero,
// una vela y papeles. Ninguna pila.
const azC = azar(8);
const GOMAS = Array.from({ length: 6 }, () => ({ x: azC() - 0.5, y: azC() - 0.5, r: 0.03 + azC() * 0.02, c: ["#e84a5f", "#ffd23c", "#4ab0e8"][Math.floor(azC() * 3)] }));
export function cajon(g, x, y, w, t) {
  const h = w * 1.25;
  g.save(); g.translate(x, y);
  // la madera
  k.redondo(g, -w / 2 - 30, -h / 2 - 30, w + 60, h + 60, 20);
  const mg = g.createLinearGradient(-w / 2, 0, w / 2, 0); mg.addColorStop(0, "#8a5a34"); mg.addColorStop(0.5, "#b07a48"); mg.addColorStop(1, "#7a4a28");
  g.fillStyle = mg; g.fill();
  // el fondo, en sombra
  const fg = g.createLinearGradient(0, -h / 2, 0, h / 2); fg.addColorStop(0, "#3a2414"); fg.addColorStop(1, "#5a3a20");
  g.fillStyle = fg; g.fillRect(-w / 2, -h / 2, w, h);
  g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip();
  // papeles
  for (const [px, py, a, col] of [[-0.2, -0.3, 0.2, "#f4efe2"], [0.15, 0.25, -0.3, "#fff6c8"]]) { g.save(); g.translate(px * w, py * h); g.rotate(a); g.fillStyle = col; g.fillRect(-w * 0.2, -w * 0.14, w * 0.4, w * 0.28); g.strokeStyle = "rgba(0,0,0,0.12)"; g.lineWidth = 3; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-w * 0.16, -w * 0.09 + i * w * 0.045); g.lineTo(w * 0.16, -w * 0.09 + i * w * 0.045); g.stroke(); } g.restore(); }
  // la cinta
  g.save(); g.translate(w * 0.22, -h * 0.28); g.fillStyle = "#cfc6a8"; g.beginPath(); g.arc(0, 0, w * 0.11, 0, 6.2832); g.fill(); g.fillStyle = "#5a3a20"; g.beginPath(); g.arc(0, 0, w * 0.06, 0, 6.2832); g.fill(); g.restore();
  // las tijeras
  g.save(); g.translate(-w * 0.18, h * 0.12); g.rotate(0.5);
  g.strokeStyle = "#e84a5f"; g.lineWidth = w * 0.025; for (const s of [-1, 1]) { g.beginPath(); g.arc(s * w * 0.05, w * 0.12, w * 0.045, 0, 6.2832); g.stroke(); }
  g.fillStyle = "#cfd3da"; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * w * 0.03, w * 0.06); g.lineTo(-s * w * 0.01, -w * 0.18); g.lineTo(s * w * 0.0, w * 0.06); g.fill(); }
  g.restore();
  // las llaves
  g.save(); g.translate(w * 0.25, h * 0.05); g.rotate(-0.4); g.strokeStyle = "#d9c070"; g.lineWidth = w * 0.015; g.beginPath(); g.arc(0, 0, w * 0.05, 0, 6.2832); g.stroke();
  g.fillStyle = "#d9c070"; g.fillRect(w * 0.04, -w * 0.012, w * 0.14, w * 0.024); g.fillRect(w * 0.13, 0, w * 0.02, w * 0.035); g.restore();
  // el mechero y la vela
  g.save(); g.translate(-w * 0.28, -h * 0.05); g.rotate(-0.2); g.fillStyle = "#4ab0e8"; k.redondo(g, -w * 0.03, -w * 0.08, w * 0.06, w * 0.16, w * 0.015); g.fill(); g.fillStyle = "#c9ced6"; g.fillRect(-w * 0.03, -w * 0.1, w * 0.06, w * 0.03); g.restore();
  g.save(); g.translate(0, h * 0.34); g.rotate(1.3); g.fillStyle = "#f4efe2"; g.fillRect(-w * 0.14, -w * 0.025, w * 0.28, w * 0.05); g.restore();
  for (const gm of GOMAS) { g.strokeStyle = gm.c; g.lineWidth = w * 0.008; g.beginPath(); g.arc(gm.x * w * 0.7, gm.y * h * 0.7, gm.r * w, 0, 6.2832); g.stroke(); }
  g.restore();
  // el borde de delante del cajón, con su tirador
  g.fillStyle = "#9a6a40"; g.fillRect(-w / 2 - 30, h / 2, w + 60, 40);
  g.fillStyle = "#d9c070"; k.redondo(g, -60, h / 2 + 8, 120, 22, 11); g.fill();
  g.restore();
}
