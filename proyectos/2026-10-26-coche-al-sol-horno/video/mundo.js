// Lo que comparten los planos: el aparcamiento al sol (el cielo, el sol, el asfalto) y el coche rojo de lado, con sus
// ventanillas que se ponen al rojo. Todo en 2D, en coordenadas del mundo (px a zoom 1); vista() pone la cámara.
//
// El mundo del aparcamiento: el suelo donde apoyan las ruedas en y = 0; el horizonte en y = HORIZ; el coche, de
// x = -500 (atrás) a x = 500 (el morro); el sol en SOL.
import * as k from "#kit";

const { azar, lienzo, mez, suave: su, tramo: tr } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(540, 960); g.scale(Z, Z); g.translate(-cx, -cy);
}
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (el zoom, en log, para que el acercamiento vaya parejo).
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
// Del mundo a la pantalla, con esa cámara.
export const aPantalla = (Z, cx, cy, x, y) => [540 + (x - cx) * Z, 960 + (y - cy) * Z];

// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.5, color = "10,14,30") {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 150, 0, 700);
  vg.addColorStop(0, `rgba(${color},${al})`); vg.addColorStop(0.6, `rgba(${color},${al * 0.6})`); vg.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.5) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 600, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// El color del calor (0 nada, 0,5 naranja, 1 rojo encendido), como "r,g,b".
export function colorCalor(u) {
  return u < 0.5 ? k.mezRgb("255,190,90", "255,120,40", u * 2) : k.mezRgb("255,120,40", "255,60,30", (u - 0.5) * 2);
}

// ---------------------------------------------------------------- el cielo y el sol
export const HORIZ = -150;
export const SOL = [-330, -1150], R_SOL = 150;

export function cielo(g, Z, cx, cy, t) {
  const y0 = cy - 960 / Z - 50, y1 = HORIZ + 4, x0 = cx - 540 / Z - 50, x1 = cx + 540 / Z + 50;
  const sg = g.createLinearGradient(0, -2600, 0, HORIZ);
  sg.addColorStop(0, "#0a3796"); sg.addColorStop(0.5, "#2370d4"); sg.addColorStop(0.86, "#76b6ee"); sg.addColorStop(1, "#f0dcb0");
  g.fillStyle = sg; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  // el resplandor del sol en todo el cielo
  g.save(); g.globalCompositeOperation = "lighter";
  const rg = g.createRadialGradient(SOL[0], SOL[1], 0, SOL[0], SOL[1], 1600);
  rg.addColorStop(0, "rgba(255,216,140,0.38)"); rg.addColorStop(0.25, "rgba(255,196,110,0.16)"); rg.addColorStop(1, "rgba(255,200,120,0)");
  g.fillStyle = rg; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.restore();
}

// Las lenguas de luz del sol, que giran despacio, y el disco.
const RAYOS = (() => { const az = azar(41); return Array.from({ length: 16 }, (_, i) => ({ a: (i / 16) * 6.2832 + az() * 0.2, l: 0.7 + az() * 0.6, w: 0.05 + az() * 0.05, f: az() * 6 })); })();
export function sol(g, t, fuerza = 1) {
  const [x, y] = SOL, R = R_SOL;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const r of RAYOS) {
    const a = r.a + t * 0.08, L = R * (2.6 + 1.2 * r.l + 0.25 * Math.sin(t * 1.7 + r.f)) * fuerza;
    const lg = g.createRadialGradient(x, y, R * 0.8, x, y, L);
    lg.addColorStop(0, "rgba(255,215,140,0.2)"); lg.addColorStop(1, "rgba(255,200,120,0)");
    g.fillStyle = lg; g.beginPath(); g.moveTo(x, y);
    g.lineTo(x + Math.cos(a - r.w) * L, y + Math.sin(a - r.w) * L); g.lineTo(x + Math.cos(a + r.w) * L, y + Math.sin(a + r.w) * L); g.closePath(); g.fill();
  }
  k.brillo(g, x, y, R * 9 * fuerza, "255,190,100", 0.3);
  k.brillo(g, x, y, R * 4.2, "255,220,150", 0.45);
  g.restore();
  const dg = g.createRadialGradient(x - R * 0.2, y - R * 0.2, 0, x, y, R);
  dg.addColorStop(0, "#ffffff"); dg.addColorStop(0.55, "#fff8dc"); dg.addColorStop(0.9, "#ffe08a"); dg.addColorStop(1, "#ffc45a");
  g.fillStyle = dg; g.beginPath(); g.arc(x, y, R, 0, 6.2832); g.fill();
  // el borde del disco hierve un poco
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.35;
  g.beginPath(); g.arc(x, y, R, 0, 6.2832); g.clip();
  const off = (t * 40) % 300;
  g.drawImage(k.manchas, x - R - off, y - R, 2 * R + 300, 2 * R);
  g.restore();
}

// ---------------------------------------------------------------- lo de lejos y el asfalto
const LEJOS = (() => {
  const az = azar(7), cosas = [];
  for (let x = -2600; x < 2600;) {
    const arbol = az() < 0.55, w = arbol ? 120 + az() * 160 : 220 + az() * 300, h = arbol ? 120 + az() * 120 : 140 + az() * 260;
    cosas.push({ x, w, h, arbol, tono: az() }); x += w * (0.55 + az() * 0.5);
  }
  return cosas;
})();
export function lejos(g, t) {
  for (const c of LEJOS) {
    const col = c.arbol ? k.mezColor("#6d9a8a", "#5d8a9a", c.tono) : k.mezColor("#9db4c8", "#b9c6d4", c.tono);
    g.fillStyle = col;
    if (c.arbol) {
      g.beginPath(); g.ellipse(c.x + c.w / 2, HORIZ - c.h * 0.55, c.w / 2, c.h * 0.55, 0, 0, 6.2832); g.fill();
      g.fillRect(c.x + c.w / 2 - 8, HORIZ - c.h * 0.2, 16, c.h * 0.2 + 2);
    } else {
      g.fillRect(c.x, HORIZ - c.h, c.w, c.h + 2);
      g.fillStyle = "rgba(255,255,255,0.18)";
      for (let yy = HORIZ - c.h + 20; yy < HORIZ - 20; yy += 34) g.fillRect(c.x + 14, yy, c.w - 28, 10);
    }
  }
  // la neblina caliente del horizonte
  const ng = g.createLinearGradient(0, HORIZ - 260, 0, HORIZ + 10);
  ng.addColorStop(0, "rgba(244,226,184,0)"); ng.addColorStop(1, "rgba(244,226,184,0.75)");
  g.fillStyle = ng; g.fillRect(-3000, HORIZ - 260, 6000, 272);
}

// La grava del asfalto: granitos claros y oscuros, que se repiten sin juntas.
const GRAVA = (() => {
  const W = 400, l = lienzo(W, W), c = l.getContext("2d"), az = azar(29);
  for (let i = 0; i < 5200; i++) {
    const x = az() * W, y = az() * W, r = 0.7 + Math.pow(az(), 2.5) * 2.6, b = az();
    c.fillStyle = b < 0.5 ? `rgba(10,10,14,${0.3 + az() * 0.4})` : `rgba(230,228,222,${0.12 + az() * 0.3})`;
    for (const dx of [-W, 0, W]) for (const dy of [-W, 0, W]) {
      if (x + dx < -4 || x + dx > W + 4 || y + dy < -4 || y + dy > W + 4) continue;
      c.beginPath(); c.arc(x + dx, y + dy, r, 0, 6.2832); c.fill();
    }
  }
  return l;
})();
const patrones = new WeakMap();
const patronGrava = (g) => { if (!patrones.has(g)) patrones.set(g, g.createPattern(GRAVA, "repeat")); return patrones.get(g); };

// El asfalto: oscuro, con su granulación, las rayas blancas del aparcamiento y el espejismo del calor al fondo.
export function asfalto(g, Z, cx, cy, t) {
  const y1 = cy + 960 / Z + 50, x0 = cx - 540 / Z - 60, x1 = cx + 540 / Z + 60;
  const ag = g.createLinearGradient(0, HORIZ, 0, 900);
  ag.addColorStop(0, "#8b8c94"); ag.addColorStop(0.12, "#5a5c66"); ag.addColorStop(1, "#24252c");
  g.fillStyle = ag; g.fillRect(x0, HORIZ, x1 - x0, y1 - HORIZ);
  g.save(); g.beginPath(); g.rect(x0, HORIZ, x1 - x0, y1 - HORIZ); g.clip();
  g.fillStyle = patronGrava(g); g.fillRect(x0, HORIZ, x1 - x0, y1 - HORIZ);
  // las manchas de aceite y los parches más oscuros
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25;
  g.drawImage(k.manchas, -1600, HORIZ, 3200, 1400);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // las rayas del aparcamiento, en perspectiva hacia el horizonte
  for (let i = -6; i <= 6; i++) {
    const xb = i * 1250 + 640, xh = xb * 0.18, w0 = 8, w1 = 46;
    g.fillStyle = "rgba(240,236,220,0.82)";
    g.beginPath(); g.moveTo(xh - w0, HORIZ); g.lineTo(xh + w0, HORIZ); g.lineTo(xb + w1, 900); g.lineTo(xb - w1, 900); g.closePath(); g.fill();
  }
  // el espejismo: una franja clara que tiembla justo encima del asfalto del fondo
  g.globalCompositeOperation = "lighter";
  for (let j = 0; j < 4; j++) {
    const yy = HORIZ + 8 + j * 14, a = 0.12 + 0.06 * Math.sin(t * 5 + j * 2);
    g.strokeStyle = `rgba(200,225,255,${a})`; g.lineWidth = 6;
    g.beginPath();
    for (let x = x0; x <= x1; x += 40) { const y = yy + 3 * Math.sin(x * 0.02 + t * 7 + j); x === x0 ? g.moveTo(x, y) : g.lineTo(x, y); }
    g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- la reverberación del calor
// Hilos de aire caliente que suben ondulando desde una línea (de xa a xb, en y), de alto h. fuerza: 0 a 1.
const HILOS = (() => { const az = azar(53); return Array.from({ length: 22 }, () => ({ u: az(), f: az() * 6, v: 0.6 + az() * 0.6, l: 0.5 + az() * 0.5 })); })();
export function reverbera(g, t, xa, xb, y, h, fuerza = 1, color = "255,225,180") {
  if (fuerza <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const s of HILOS) {
    const x = mez(xa, xb, s.u), fase = (t * 0.45 * s.v + s.f) % 1, base = y - fase * h * 0.5, L = h * 0.45 * s.l;
    const al = fuerza * 0.22 * Math.sin(Math.PI * fase);
    g.strokeStyle = `rgba(${color},${al})`; g.lineWidth = 7;
    g.beginPath();
    for (let q = 0; q <= 14; q++) { const yy = base - (q / 14) * L, xx = x + 14 * Math.sin(yy * 0.03 + t * 6 + s.f); q ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
    g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- el coche
// De lado, mirando a la derecha. Las ruedas, en RUEDAS (centro x, y), de radio R_RUEDA.
export const R_RUEDA = 88, RUEDAS = [[-310, -88], [320, -88]];
export const VENT_DEL = [[165, -262], [66, -384], [-72, -388], [-72, -262]];
export const VENT_TRAS = [[-96, -262], [-96, -388], [-236, -390], [-368, -270]];
// El centro de la ventanilla de atrás (la que se mira de cerca).
export const VENT_TRAS_C = [-215, -330];

function carroceria(g) {
  const b = -55;
  g.beginPath();
  g.moveTo(-488, b);
  g.lineTo(-416, b);
  g.arc(RUEDAS[0][0], RUEDAS[0][1], 104, 2.82, 0.32 + 6.2832, false);
  g.lineTo(214, b);
  g.arc(RUEDAS[1][0], RUEDAS[1][1], 104, 2.82, 0.32 + 6.2832, false);
  g.lineTo(482, b - 8);
  g.quadraticCurveTo(506, -100, 502, -150);
  g.quadraticCurveTo(498, -196, 440, -212);
  g.quadraticCurveTo(320, -236, 190, -258);
  g.quadraticCurveTo(110, -340, 70, -396);
  g.quadraticCurveTo(50, -414, 10, -416);
  g.lineTo(-236, -414);
  g.quadraticCurveTo(-270, -412, -300, -392);
  g.quadraticCurveTo(-380, -320, -440, -272);
  g.quadraticCurveTo(-490, -258, -500, -220);
  g.lineTo(-506, -120);
  g.quadraticCurveTo(-506, -70, -488, b);
  g.closePath();
}

function poli(g, P) { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); }

// El interior visto por una ventanilla: los reposacabezas y el respaldo, a oscuras o al rojo.
function interior(g, P, calor, t, xs) {
  g.save(); poli(g, P); g.clip();
  const ig = g.createLinearGradient(0, -400, 0, -260);
  ig.addColorStop(0, "#1a2433"); ig.addColorStop(1, "#0b1018");
  g.fillStyle = ig; g.fillRect(-520, -420, 1040, 180);
  // los reposacabezas
  g.fillStyle = "#06080c";
  for (const x of xs) { k.redondo(g, x - 34, -352, 68, 62, 22); g.fill(); g.fillRect(x - 46, -296, 92, 40); }
  if (calor > 0.005) {
    const c = colorCalor(calor);
    g.globalCompositeOperation = "lighter";
    const hg = g.createLinearGradient(0, -260, 0, -400);
    hg.addColorStop(0, `rgba(${c},${0.95 * calor})`); hg.addColorStop(1, `rgba(${c},${0.55 * calor})`);
    g.fillStyle = hg; g.fillRect(-520, -420, 1040, 180);
    g.globalAlpha = 0.35 * calor;
    g.drawImage(k.manchas, -520 - ((t * 30) % 200), -440, 1300, 260);
    g.globalAlpha = 1;
  }
  g.restore();
}

// El cristal encima: reflejo del cielo y una franja de luz.
function cristal(g, P, calor) {
  g.save(); poli(g, P); g.clip();
  const cg = g.createLinearGradient(0, -400, 0, -260);
  cg.addColorStop(0, `rgba(160,200,255,${0.5 - 0.3 * calor})`); cg.addColorStop(0.5, `rgba(60,100,170,${0.25 - 0.15 * calor})`); cg.addColorStop(1, "rgba(20,30,50,0.1)");
  g.fillStyle = cg; g.fillRect(-520, -420, 1040, 180);
  g.fillStyle = "rgba(255,255,255,0.22)";
  g.beginPath(); g.moveTo(P[0][0] - 60, -262); g.lineTo(P[0][0] - 20, -262); g.lineTo(P[0][0] - 110, -400); g.lineTo(P[0][0] - 150, -400); g.closePath(); g.fill();
  g.restore();
  g.save(); poli(g, P); g.strokeStyle = "#0a0b0e"; g.lineWidth = 9; g.stroke(); g.restore();
}

function rueda(g, x, y, gira) {
  // el neumático
  const ng = g.createRadialGradient(x - 20, y - 20, 10, x, y, R_RUEDA);
  ng.addColorStop(0, "#3a3b40"); ng.addColorStop(0.75, "#1b1c20"); ng.addColorStop(1, "#0b0b0d");
  g.fillStyle = ng; g.beginPath(); g.arc(x, y, R_RUEDA, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.08)"; g.lineWidth = 4; g.beginPath(); g.arc(x, y, R_RUEDA - 8, 3.6, 5.2); g.stroke();
  // la llanta
  const lg = g.createRadialGradient(x - 18, y - 22, 4, x, y, 58);
  lg.addColorStop(0, "#ffffff"); lg.addColorStop(0.45, "#c9ced6"); lg.addColorStop(0.85, "#7c828c"); lg.addColorStop(1, "#4a4f57");
  g.fillStyle = lg; g.beginPath(); g.arc(x, y, 58, 0, 6.2832); g.fill();
  g.fillStyle = "#2a2d33";
  for (let i = 0; i < 5; i++) {
    const a = gira + (i / 5) * 6.2832, a2 = a + 0.62;
    g.beginPath(); g.moveTo(x + Math.cos(a + 0.12) * 18, y + Math.sin(a + 0.12) * 18);
    g.lineTo(x + Math.cos(a + 0.1) * 52, y + Math.sin(a + 0.1) * 52); g.arc(x, y, 52, a + 0.1, a2 - 0.1); g.lineTo(x + Math.cos(a2 - 0.12) * 18, y + Math.sin(a2 - 0.12) * 18);
    g.closePath(); g.fill();
  }
  const hg = g.createRadialGradient(x - 4, y - 5, 1, x, y, 16);
  hg.addColorStop(0, "#f4f6f9"); hg.addColorStop(1, "#6d737c");
  g.fillStyle = hg; g.beginPath(); g.arc(x, y, 15, 0, 6.2832); g.fill();
}

// El coche entero en x (su centro), con:
//   calor: 0 a 1, lo encendido que se ve dentro; brasa: 0 a 1, el golpe de horno (las ventanillas, como la puerta de
//   un horno encendido); gira: el ángulo de las ruedas; rendija: lo que ha bajado el cristal de atrás (unidades).
export function coche(g, x, t, { calor = 0, brasa = 0, gira = 0, rendija = 0 } = {}) {
  g.save(); g.translate(x, 0);
  // la sombra en el asfalto
  const sg = g.createRadialGradient(0, 0, 60, 0, 0, 600);
  sg.addColorStop(0, "rgba(0,0,0,0.7)"); sg.addColorStop(0.75, "rgba(0,0,0,0.4)"); sg.addColorStop(1, "rgba(0,0,0,0)");
  g.save(); g.translate(0, 8); g.scale(1, 0.085); g.fillStyle = sg; g.beginPath(); g.arc(0, 0, 600, 0, 6.2832); g.fill(); g.restore();
  // los pasos de rueda, a oscuras, y las ruedas (detrás de la carrocería)
  g.fillStyle = "#140a0b";
  for (const [rx, ry] of RUEDAS) { g.beginPath(); g.arc(rx, ry, 103, Math.PI, 0); g.lineTo(rx + 103, -50); g.lineTo(rx - 103, -50); g.closePath(); g.fill(); }
  for (const [rx, ry] of RUEDAS) rueda(g, rx, ry, gira);
  // la carrocería
  carroceria(g);
  const pg = g.createLinearGradient(0, -416, 0, -55);
  pg.addColorStop(0, "#ff7a66"); pg.addColorStop(0.12, "#f2342a"); pg.addColorStop(0.42, "#d61c1e"); pg.addColorStop(0.5, "#ff5a48");
  pg.addColorStop(0.56, "#c5161a"); pg.addColorStop(1, "#5e070c");
  g.fillStyle = pg; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18; g.drawImage(k.red2, -520, -430, 1040, 420);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // el reflejo del cielo en la parte de arriba y el del sol en el lomo
  const rg = g.createLinearGradient(-500, 0, 500, 0);
  rg.addColorStop(0, "rgba(255,255,255,0)"); rg.addColorStop(0.3, "rgba(255,240,220,0.5)"); rg.addColorStop(0.5, "rgba(255,255,255,0.08)"); rg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(-520, -248, 1040, 16);
  // los bajos más oscuros y el estribo
  g.fillStyle = "rgba(20,0,4,0.35)"; g.fillRect(-520, -110, 1040, 60);
  // el calor tiñe la chapa
  if (brasa > 0.01) { g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,90,30,${0.22 * brasa})`; g.fillRect(-520, -430, 1040, 400); }
  g.restore();
  // las líneas de las puertas, las manillas, los pilotos
  g.strokeStyle = "rgba(40,0,6,0.7)"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(178, -250); g.quadraticCurveTo(190, -150, 172, -62); g.stroke();
  g.beginPath(); g.moveTo(-84, -258); g.lineTo(-84, -62); g.stroke();
  g.beginPath(); g.moveTo(-380, -262); g.quadraticCurveTo(-396, -150, -330, -62); g.stroke();
  g.fillStyle = "#3a0408"; k.redondo(g, 60, -226, 70, 14, 7); g.fill(); k.redondo(g, -200, -226, 70, 14, 7); g.fill();
  g.fillStyle = "rgba(255,200,190,0.5)"; k.redondo(g, 64, -228, 60, 4, 2); g.fill(); k.redondo(g, -196, -228, 60, 4, 2); g.fill();
  // el faro y el piloto
  const fg = g.createLinearGradient(440, -190, 500, -150);
  fg.addColorStop(0, "#fffbe8"); fg.addColorStop(1, "#c9d4e0");
  g.fillStyle = fg; g.beginPath(); g.moveTo(448, -206); g.quadraticCurveTo(494, -196, 500, -160); g.lineTo(470, -164); g.quadraticCurveTo(452, -180, 448, -206); g.fill();
  g.fillStyle = "#ff2a3a"; g.beginPath(); g.moveTo(-500, -226); g.lineTo(-466, -246); g.lineTo(-470, -200); g.lineTo(-504, -196); g.closePath(); g.fill();
  k.brillo(g, -488, -222, 60, "255,60,70", 0.5);
  // los parachoques
  g.fillStyle = "#1c1d22";
  k.redondo(g, 400, -110, 108, 34, 14); g.fill(); k.redondo(g, -512, -112, 96, 34, 14); g.fill();
  // las ventanillas
  interior(g, VENT_DEL, calor, t, [-10]);
  // la de atrás: el cristal baja la rendija y deja ver el interior por encima
  interior(g, VENT_TRAS, calor, t, [-190]);
  if (rendija > 0.5) {
    const P = VENT_TRAS.map(([x, y]) => [x, Math.max(y, -388 + rendija)]);
    g.save(); poli(g, VENT_TRAS); g.clip();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = `rgba(${colorCalor(calor)},${0.5 * calor})`; g.fillRect(-380, -392, 300, rendija + 4);
    g.restore();
    cristalBajado(g, P, calor);
    g.save(); poli(g, VENT_TRAS); g.strokeStyle = "#0a0b0e"; g.lineWidth = 9; g.stroke(); g.restore();
    // el borde de arriba del cristal bajado
    g.strokeStyle = "rgba(230,240,255,0.8)"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(-96, -388 + rendija); g.lineTo(-250 + rendija * 0.9, -388 + rendija); g.stroke();
  } else cristal(g, VENT_TRAS, calor);
  cristal(g, VENT_DEL, calor);
  // el golpe de horno en las ventanillas
  if (brasa > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (const P of [VENT_DEL, VENT_TRAS]) {
      g.save(); poli(g, P); g.clip();
      g.fillStyle = `rgba(255,140,50,${0.55 * brasa})`; g.fillRect(-520, -420, 1040, 180);
      g.restore();
    }
    k.brillo(g, -100, -330, 900, "255,130,50", 0.55 * brasa);
    g.restore();
  }
  // el retrovisor
  g.fillStyle = "#b5141a"; g.beginPath(); g.moveTo(150, -270); g.quadraticCurveTo(205, -300, 214, -262); g.lineTo(180, -246); g.closePath(); g.fill();
  g.fillStyle = "#1c1d22"; g.fillRect(168, -258, 18, 12);
  g.restore();
}

function cristalBajado(g, P, calor) {
  g.save(); poli(g, P); g.clip();
  const cg = g.createLinearGradient(0, -400, 0, -260);
  cg.addColorStop(0, `rgba(160,200,255,${0.5 - 0.3 * calor})`); cg.addColorStop(1, "rgba(20,30,50,0.1)");
  g.fillStyle = cg; g.fillRect(-520, -420, 1040, 180);
  g.restore();
}

// ---------------------------------------------------------------- el aparcamiento entero
// Con la cámara (Z, cx, cy); el coche en xc, con sus opciones.
export function aparcamiento(g, t, Z, cx, cy, xc, op = {}) {
  vista(g, Z, cx, cy);
  cielo(g, Z, cx, cy, t);
  sol(g, t);
  lejos(g, t);
  asfalto(g, Z, cx, cy, t);
  coche(g, xc, t, op);
  reverbera(g, t, xc - 380, xc + 120, -420, 420, 0.35 + 0.65 * Math.max(op.calor || 0, op.brasa || 0));
  sinVista(g);
}
