// El enchufe, el GFCI, el cuadro y las manos. Lo que se repite, una sola vez.
import * as k from "#kit";
import { v } from "#voz";

export const camara = (g, c) => { g.translate(540, 1040); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
const mezCam = (a, b, u) => ({ x: k.mez(a.x, b.x, u), y: k.mez(a.y, b.y, u), s: Math.exp(k.mez(Math.log(a.s), Math.log(b.s), u)) });
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, k.suave(k.tramo(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}

export function velo(g, a = 0.84, col = "10, 8, 24") {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 60, 0, 580);
  gr.addColorStop(0, `rgba(${col}, ${a})`);
  gr.addColorStop(0.55, `rgba(${col}, ${a * 0.55})`);
  gr.addColorStop(1, `rgba(${col}, 0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 620);
  g.restore();
}
export function viñeta(g, a = 0.45, col = "8, 6, 20") {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 1080, 420, 540, 1080, 1300);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(${col}, ${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

function fondo(g, a, b, luz, lx = -200, ly = -500) {
  const gr = g.createLinearGradient(-1400, -1600, 900, 1200);
  gr.addColorStop(0, a);
  gr.addColorStop(1, b);
  g.fillStyle = gr;
  g.fillRect(-2400, -2400, 4800, 4800);
  g.save();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -900, -1100, 2200, 2400);
  g.restore();
  const L = g.createRadialGradient(lx, ly, 20, lx, ly, 1100);
  L.addColorStop(0, luz);
  L.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = L;
  g.fillRect(-2400, -2400, 4800, 4800);
}

const plastico = (g, x0, y0, x1, y1, claro = "#fffdf8", medio = "#f3ecdf", sombra = "#c9bba6") => {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, claro);
  gr.addColorStop(0.45, medio);
  gr.addColorStop(1, sombra);
  return gr;
};

function ranura(g, x, y, ancha) {
  g.fillStyle = "#1a120c";
  k.redondo(g, x, y, ancha ? 18 : 13, 52, 4);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.fillRect(x + 3, y + 4, 3, 28);
}

function socket(g, y) {
  g.fillStyle = "rgba(40, 24, 16, 0.08)";
  k.redondo(g, -78, y - 62, 156, 150, 18);
  g.fill();
  ranura(g, -46, y - 36, true);
  ranura(g, 16, y - 36, false);
  g.fillStyle = "#1a120c";
  g.beginPath();
  g.arc(-8, y + 48, 13, 0, 6.28);
  g.fill();
}

function botonCara(g, x, y, w, h, color, fuera) {
  g.save();
  g.translate(0, -fuera);
  g.fillStyle = "rgba(0,0,0,0.35)";
  k.redondo(g, x + 6, y + 10 + fuera * 0.3, w, h, 12);
  g.fill();
  g.fillStyle = color;
  k.redondo(g, x, y, w, h, 12);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  k.redondo(g, x + 8, y + 6, w * 0.45, h * 0.28, 8);
  g.fill();
  g.restore();
}

// Cara de enchufe. reset: 0 metido, 1 fuera. calor y negro: el aviso. abierto: la tapa se separa (y una mano la para).
export function enchufe(g, opt = {}) {
  const gfci = !!opt.gfci;
  const reset = opt.reset ?? 0;
  const calor = opt.calor || 0;
  const negro = opt.negro || 0;
  const abierto = opt.abierto || 0;
  const vib = opt.vib || 0;
  g.save();
  g.translate(vib, 0);
  g.fillStyle = "rgba(20, 10, 30, 0.35)";
  k.redondo(g, -168, -250, 360, 560, 36);
  g.fill();
  const claro = k.mezColor("#fffdf8", "#2a211c", negro);
  const medio = k.mezColor("#f4ecdf", "#1a1412", negro);
  const sombra = k.mezColor("#d9cbb8", "#0e0c0b", negro);
  g.fillStyle = plastico(g, -160, -260, 160, 280, claro, medio, sombra);
  k.redondo(g, -160, -268, 320, 536, 32);
  g.fill();
  if (calor > 0.02) {
    g.save();
    g.globalCompositeOperation = "multiply";
    g.globalAlpha = 0.35 + calor * 0.5;
    g.drawImage(k.manchas, -150, -240, 300, 480);
    g.restore();
    g.save();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = `rgba(255, 90, 20, ${0.15 + calor * 0.45})`;
    k.redondo(g, -150, -240, 300, 460, 28);
    g.fill();
    g.restore();
  }
  g.save();
  g.globalAlpha = 0.22;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -160, -260, 320, 520);
  g.restore();
  // tornillos de la tapa
  for (const y of [-236, 236]) {
    g.fillStyle = plastico(g, -16, y - 16, 16, y + 16, "#f3e2b0", "#c8963a", "#6a4a16");
    g.beginPath();
    g.arc(0, y, 14, 0, 6.28);
    g.fill();
    g.strokeStyle = "#4a3010";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-8, y);
    g.lineTo(8, y);
    g.stroke();
  }
  if (abierto > 0.01) {
    g.fillStyle = "#120c0a";
    g.fillRect(-120, -200, 240 * abierto, 400);
  }
  socket(g, gfci ? -150 : -70);
  socket(g, gfci ? 150 : 90);
  if (gfci) {
    g.fillStyle = "#2a241c";
    k.redondo(g, -118, -28, 70, 64, 14);
    g.fill();
    botonCara(g, -112, -34, 58, 52, "#3a4250", 0);
    g.fillStyle = "#1a100c";
    k.redondo(g, 28, -36, 92, 78, 16);
    g.fill();
    const rojo = reset > 0.4 ? "#ff2d3c" : "#c42432";
    botonCara(g, 34, -30, 80, 66, rojo, reset * 46);
  }
  g.restore();
}

export function clavija(g, x, y) {
  g.save();
  g.translate(x, y);
  g.fillStyle = plastico(g, -70, -170, 70, 10, "#ffffff", "#e7eef6", "#b7c3d1");
  k.redondo(g, -70, -170, 140, 180, 26);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)";
  k.redondo(g, -46, -148, 48, 80, 14);
  g.fill();
  const plata = plastico(g, -50, 0, 50, 90, "#f7fbff", "#c5ced8", "#8d98a6");
  g.fillStyle = plata;
  k.redondo(g, -42, -6, 20, 92, 5);
  g.fill();
  k.redondo(g, 18, -6, 14, 92, 5);
  g.fill();
  g.beginPath();
  g.arc(-4, 16, 10, 0, 6.28);
  g.fill();
  g.restore();
}

export function lampara(g, x, y, luz, esc = 1) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  // pantalla
  const pantalla = g.createLinearGradient(-120, -180, 120, 20);
  pantalla.addColorStop(0, luz > 0.2 ? "#ffe28a" : "#6e5a48");
  pantalla.addColorStop(0.5, luz > 0.2 ? "#ffb03a" : "#4a3a32");
  pantalla.addColorStop(1, luz > 0.2 ? "#e06a20" : "#2c221c");
  g.fillStyle = pantalla;
  g.beginPath();
  g.moveTo(-70, -20);
  g.lineTo(-120, 70);
  g.lineTo(120, 70);
  g.lineTo(70, -20);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.beginPath();
  g.moveTo(-40, -8);
  g.lineTo(-70, 50);
  g.lineTo(-20, 50);
  g.closePath();
  g.fill();
  // bombilla
  const bom = luz > 0.15 ? "#fff6d2" : "#2a3142";
  g.fillStyle = bom;
  g.beginPath();
  g.ellipse(0, 110, 42, 54, 0, 0, 6.28);
  g.fill();
  g.fillStyle = luz > 0.15 ? "#fff" : "#8d98aa";
  g.fillRect(-16, 150, 32, 18);
  g.fillStyle = "#6a5438";
  k.redondo(g, -28, 168, 56, 36, 8);
  g.fill();
  if (luz > 0.05) {
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, 0, 108, 360 + 220 * luz, "amarilla", Math.min(1, luz * 1.2));
    k.brillo(g, 0, 10, 520, "naranja", luz * 0.55);
    g.restore();
  } else {
    g.strokeStyle = "rgba(180, 200, 230, 0.35)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-8, 80);
    g.lineTo(6, 100);
    g.lineTo(-4, 120);
    g.lineTo(8, 142);
    g.stroke();
  }
  g.restore();
}

export function mano(g, x, y, rot = 0, esc = 1, pulsa = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  const piel = g.createLinearGradient(-80, -220, 70, 140);
  piel.addColorStop(0, "#ffe7c4");
  piel.addColorStop(0.45, "#f3a45e");
  piel.addColorStop(1, "#c2642e");
  g.fillStyle = piel;
  g.beginPath();
  g.ellipse(6, 36, 74, 86, 0, 0, 6.28);
  g.fill();
  k.redondo(g, -78, 78, 160, 64, 22);
  g.fill();
  g.save();
  g.translate(-84, 16);
  g.rotate(0.85);
  k.redondo(g, -18, -78, 38, 96, 18);
  g.fill();
  g.restore();
  for (let i = 0; i < 3; i++) {
    k.redondo(g, -6 + i * 30, -78, 26, 96, 13);
    g.fill();
  }
  g.save();
  g.translate(8, pulsa * 56);
  k.redondo(g, -18, 10, 36, 150, 18);
  g.fill();
  g.fillStyle = "rgba(255, 244, 230, 0.9)";
  g.beginPath();
  g.ellipse(0, 148, 11, 14, 0, 0, 6.28);
  g.fill();
  g.restore();
  g.fillStyle = "rgba(255, 236, 214, 0.45)";
  g.beginPath();
  g.ellipse(-10, 10, 18, 36, -0.5, 0, 6.28);
  g.fill();
  g.restore();
}

function palanca(g, x, y, estado, color) {
  // estado: 1 arriba (on), 0 en el centro, -1 abajo (off)
  g.save();
  g.translate(x, y);
  g.fillStyle = "#0c1016";
  k.redondo(g, -34, -100, 68, 200, 16);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(30, -78, 18, 6);
  g.fillRect(30, -4, 14, 6);
  g.fillRect(30, 70, 18, 6);
  const pos = estado >= 0 ? k.mez(-6, -62, estado) : k.mez(-6, 42, -estado);
  g.fillStyle = "rgba(0,0,0,0.45)";
  k.redondo(g, -20, pos + 6, 40, 56, 10);
  g.fill();
  g.fillStyle = color;
  k.redondo(g, -22, pos, 44, 54, 12);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(-12, pos + 8, 12, 16);
  g.restore();
}

const COLORES_PAL = ["#ff5a3c", "#ffc53a", "#3ecf8e", "#4aa3ff", "#ff5a3c", "#ffc53a", "#3ecf8e", "#4aa3ff"];

export function cuadro(g, estados, foco = -1, conFondo = true) {
  g.save();
  if (conFondo) fondo(g, "#1c2d6e", "#091428", "rgba(120, 170, 255, 0.35)", 0, -700);
  g.fillStyle = "rgba(0,0,0,0.35)";
  k.redondo(g, -250, -430, 540, 980, 28);
  g.fill();
  g.fillStyle = plastico(g, -260, -460, 260, 500, "#5c6774", "#343b46", "#1a1e26");
  k.redondo(g, -240, -440, 480, 940, 24);
  g.fill();
  g.save();
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -240, -440, 480, 940);
  g.restore();
  g.fillStyle = "#12161c";
  k.redondo(g, -200, -360, 400, 760, 16);
  g.fill();
  for (let i = 0; i < 8; i++) {
    const col = i < 4 ? -100 : 90;
    const fila = (i % 4) * 170 - 250;
    const est = estados[i] ?? 1;
    if (i === foco) {
      g.save();
      g.globalCompositeOperation = "lighter";
      k.brillo(g, col, fila, 180, est > 0.5 ? "verde" : est < -0.5 ? "roja" : "naranja", 0.7);
      g.restore();
    }
    palanca(g, col, fila, est, COLORES_PAL[i]);
  }
  g.restore();
}

export function telefono(g, x, y, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.3)";
  k.redondo(g, -110, -190, 240, 420, 36);
  g.fill();
  g.fillStyle = "#1c2430";
  k.redondo(g, -120, -210, 240, 420, 40);
  g.fill();
  g.fillStyle = "#12362c";
  k.redondo(g, -100, -180, 200, 340, 18);
  g.fill();
  g.fillStyle = "#3ee08a";
  g.beginPath();
  g.arc(0, 20, 54, 0, 6.28);
  g.fill();
  g.strokeStyle = "#eafff4";
  g.lineWidth = 8;
  g.lineCap = "round";
  g.beginPath();
  g.arc(0, 16, 22, 0.6, 2.4);
  g.stroke();
  g.beginPath();
  g.arc(0, 16, 34, 0.5, 2.5);
  g.stroke();
  g.restore();
}

function secador(g, x, y, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "#ff4d6a";
  k.redondo(g, -70, -36, 180, 72, 30);
  g.fill();
  g.fillStyle = "#ffd0da";
  g.beginPath();
  g.ellipse(100, 0, 28, 22, 0, 0, 6.28);
  g.fill();
  g.fillStyle = "#e03658";
  k.redondo(g, -20, 10, 36, 110, 16);
  g.fill();
  g.restore();
}

function gota(g, x, y, al) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "#7ad7ff";
  g.beginPath();
  g.moveTo(0, -28);
  g.quadraticCurveTo(22, 0, 0, 22);
  g.quadraticCurveTo(-22, 0, 0, -28);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.beginPath();
  g.ellipse(-6, -2, 5, 8, -0.4, 0, 6.28);
  g.fill();
  g.restore();
}

function barras(g, abierto) {
  g.fillStyle = plastico(g, -40, -220, 40, 220, "#ffe7b8", "#e29a32", "#7a4c10");
  k.redondo(g, -168, -230, 58, 460, 16);
  g.fill();
  k.redondo(g, 108, -230, 58, 460, 16);
  g.fill();
  g.save();
  g.translate(-20, -abierto * 150);
  g.rotate(-abierto * 1.1);
  g.fillStyle = plastico(g, -40, -24, 40, 24, "#fff8dc", "#f0c56a", "#a86a18");
  k.redondo(g, -150, -22, 300, 44, 14);
  g.fill();
  g.restore();
}

function pulsoCorriente(g, t, vivo) {
  if (vivo < 0.05) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const u = (t * 0.8 + i * 0.25) % 1;
    k.brillo(g, -139, -190 + u * 380, 56, "cian", vivo * 0.95);
    k.brillo(g, 137, 190 - u * 380, 56, "cian", vivo * 0.95);
  }
  g.restore();
}

function fugaRoja(g, al) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha = al;
  g.strokeStyle = "#ff3b22";
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-140, 20);
  g.quadraticCurveTo(-40, 90, 10, 150);
  g.stroke();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 10, 150, 160, "fuego", al);
  k.brillo(g, -140, 20, 80, "fuego", al * 0.6);
  g.restore();
}

function factura(g, x, y, al) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.28)";
  k.redondo(g, -210, -140, 460, 340, 18);
  g.fill();
  g.fillStyle = "#fff8ea";
  k.redondo(g, -230, -160, 460, 340, 14);
  g.fill();
  g.fillStyle = "#ff5a3c";
  g.fillRect(-230, -160, 460, 22);
  g.fillStyle = "#2a241c";
  g.font = "800 108px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("1 HOUR", 0, 10);
  g.font = "700 28px Figtree";
  g.fillStyle = "#8a5a3a";
  g.fillText("SERVICE CALL", 0, 78);
  g.restore();
}

// ---------- escenas

export function escenaMuerto(g, t) {
  const f = v.frase(1);
  const fin = v.frase(2).t("breakers") - 0.04;
  const Tw = f.t("working");
  const Tf = f.t("first");
  const metida = 0.28 + 0.72 * k.suave(k.tramo(t, 0, 0.4));
  const ola = k.pulso(t, Tw + 0.05, 0.28);
  const yPlug = k.mez(-210, -102, metida);
  const cam = rutaCam(t, [
    [0, { x: -60, y: 70, s: 1.55 }],
    [0.42, { x: 10, y: 50, s: 1.9 }],
    [Tw, { x: -200, y: 30, s: 1.22 }],
    [1.4, { x: -170, y: 36, s: 1.28 }],
    [Tf, { x: 8, y: 60, s: 1.85 }],
    [fin, { x: 8, y: 60, s: 1.85 }],
  ]);
  g.save();
  camara(g, cam);
  fondo(g, "#2a1860", "#12081c", "rgba(255, 186, 92, 0.28)", -480, -420);
  g.fillStyle = "#3a2418";
  g.fillRect(-1800, 420, 3600, 800);
  g.fillStyle = "#5a3824";
  for (let x = -1600; x < 1600; x += 140) g.fillRect(x, 430, 8, 700);
  lampara(g, -390, -20, 0.04, 1.45);
  g.strokeStyle = "#241810";
  g.lineWidth = 16;
  g.beginPath();
  g.moveTo(-340, 90);
  g.quadraticCurveTo(-160, 280, 0, yPlug + 20);
  g.stroke();
  clavija(g, 0, yPlug);
  enchufe(g, {});
  if (ola > 0.04) {
    g.fillStyle = `rgba(6, 4, 18, ${ola * 0.45})`;
    g.beginPath();
    g.arc(-390, 80, 180 + ola * 800, 0, 6.28);
    g.fill();
  }
  if (ola > 0.05) {
    g.save();
    g.globalCompositeOperation = "source-over";
    g.fillStyle = `rgba(8, 6, 24, ${ola * 0.55})`;
    g.beginPath();
    g.arc(-430, 70, 200 + ola * 900, 0, 6.28);
    g.fill();
    g.restore();
  }
  g.restore();
  velo(g, 0.86, "16, 8, 32");
  viñeta(g, 0.5, "10, 4, 20");
}

export function escenaCuadro(g, t) {
  const fin = v.t("button") - 0.04;
  const Tfine = v.frase(2).t("fine");
  const cam = rutaCam(t, [
    [v.t("breakers") - 0.04, { x: 0, y: -20, s: 1.15 }],
    [Tfine, { x: -40, y: -80, s: 1.45 }],
    [fin, { x: -40, y: -80, s: 1.45 }],
  ]);
  g.save();
  camara(g, cam);
  const estados = [1, 1, 1, 1, 1, 1, 1, 1];
  cuadro(g, estados, Math.floor(k.tramo(t, v.t("breakers"), Tfine) * 7.99));
  g.restore();
  velo(g, 0.8, "8, 14, 36");
  viñeta(g, 0.4, "6, 10, 28");
}

export function escenaFuga(g, t) {
  const f2 = v.frase(2), f3 = v.frase(3);
  const fin = v.frase(4).inicio;
  const Troom = f2.t("room");
  const Tleaks = f3.t("leaks");
  const Tevery = f3.t("every");
  const Tout = f3.t("outlet");
  const Tafter = f3.t("after");
  const abre = k.suave(k.tramo(t, f3.inicio + 0.15, f3.t("shuts") + 0.15));
  const puente = k.suave(k.tramo(t, Tleaks - 0.05, Tleaks + 0.35));
  const apaga = [
    k.suave(k.tramo(t, Tevery, Tevery + 0.28)),
    k.suave(k.tramo(t, Tout, Tout + 0.28)),
    k.suave(k.tramo(t, Tafter, Tafter + 0.28)),
  ];
  const calma = k.suave(k.tramo(t, Tafter + 0.45, fin - 0.2));
  const cam = rutaCam(t, [
    [f2.t("button") - 0.04, { x: 40, y: 10, s: 1.85 }],
    [Troom, { x: 0, y: 20, s: 2.2 }],
    [f3.t("shuts"), { x: 0, y: 30, s: 1.7 }],
    [Tleaks, { x: 0, y: 60, s: 1.65 }],
    [Tevery, { x: 560, y: 10, s: 0.95 }],
    [Tafter + 0.2, { x: 980, y: 30, s: 0.95 }],
    [fin, { x: 980, y: 30, s: 0.95 }],
  ]);
  g.save();
  camara(g, cam);
  // baño
  fondo(g, "#0e6e78", "#08323a", "rgba(160, 255, 230, 0.35)", -300, -600);
  // baldosas
  g.save();
  g.globalAlpha = 0.35;
  for (let y = -900; y < 900; y += 90) for (let x = -1400; x < 2200; x += 90) {
    g.fillStyle = ((x + y) / 90) % 2 === 0 ? "#1498a4" : "#0c7c88";
    g.fillRect(x, y, 84, 84);
  }
  g.restore();
  // el GFCI con el botón ya fuera (así lo encontramos)
  g.save();
  g.globalAlpha = 1 - abre * 0.92;
  enchufe(g, { gfci: true, reset: 1 });
  g.restore();
  // dentro
  g.save();
  g.globalAlpha = abre;
  g.fillStyle = "#1a120c";
  k.redondo(g, -220, -280, 440, 560, 20);
  g.fill();
  barras(g, puente);
  pulsoCorriente(g, t, (1 - puente) * (1 - calma));
  secador(g, 20, 200, abre);
  const cae = k.suave(k.tramo(t, f3.t("little"), Tleaks));
  gota(g, 20, k.mez(-40, 160, cae), abre * (1 - puente * 0.4));
  fugaRoja(g, puente * (1 - calma * 0.5));
  g.restore();
  // enchufes de detrás, a la derecha
  for (let i = 0; i < 3; i++) {
    const x = 620 + i * 380;
    g.save();
    g.translate(x, 20);
    g.scale(1.05, 1.05);
    lampara(g, 0, -300, 1 - apaga[i], 0.9);
    enchufe(g, {});
    g.restore();
    g.strokeStyle = "#3a2418";
    g.lineWidth = 18;
    g.beginPath();
    g.moveTo(i === 0 ? 180 : x - 380, 40);
    g.lineTo(x - 140, 40);
    g.stroke();
  }
  g.restore();
  velo(g, 0.82, "6, 28, 32");
  viñeta(g, 0.42, "4, 16, 20");
}

export function escenaLampara(g, t) {
  const f = v.frase(4);
  const fin = v.frase(5).inicio;
  const Tlamp = f.t("lamp");
  const Tworks = f.t("works");
  const saca = k.suave(k.tramo(t, f.inicio, f.t("there")));
  const lleva = k.suave(k.tramo(t, Tlamp - 0.15, Tworks - 0.15));
  const muere = k.suave(k.tramo(t, Tworks - 0.12, Tworks + 0.28));
  const cam = rutaCam(t, [
    [f.inicio, { x: 40, y: 20, s: 1.55 }],
    [Tlamp, { x: -180, y: -40, s: 1.25 }],
    [Tworks, { x: 80, y: 10, s: 1.6 }],
    [fin, { x: 80, y: 10, s: 1.6 }],
  ]);
  g.save();
  camara(g, cam);
  fondo(g, "#6a2a3e", "#2a1430", "rgba(255, 190, 120, 0.4)", -500, -500);
  g.fillStyle = "#f3d7b0";
  g.fillRect(-1600, 380, 3200, 40);
  // enchufe bueno a la izquierda, con la lámpara encendida al principio
  g.save();
  g.translate(-460, 40);
  enchufe(g, {});
  g.restore();
  // enchufe muerto
  enchufe(g, {});
  const lx = k.mez(-460, 40, lleva);
  const ly = k.mez(-300, -220, lleva) - Math.sin(lleva * Math.PI) * 80;
  const luz = lleva < 0.85 ? 1 : 1 - muere;
  lampara(g, lx, ly, luz, 0.85);
  g.save();
  g.globalAlpha = 1 - k.suave(k.tramo(t, f.t("there"), f.t("and")));
  g.translate(20, -160 - saca * 220);
  g.fillStyle = "#f2f4f8";
  k.redondo(g, -36, -20, 72, 90, 12);
  g.fill();
  g.fillStyle = "#222";
  g.fillRect(-6, 60, 12, 40);
  g.restore();
  mano(g, lx + 130, ly - 20, -0.3, 0.7, 0.2);
  g.restore();
  velo(g, 0.84, "40, 16, 28");
  viñeta(g, 0.4, "28, 8, 16");
}

export function escenaReset(g, t) {
  const f = v.frase(5);
  const fin = v.frase(6).inicio;
  const Tclick = f.t("clicks");
  const Tpress = f.t("press");
  const pulsa = k.suave(k.tramo(t, Tpress, Tclick));
  const luz = k.suave(k.tramo(t, Tclick - 0.05, Tclick + 0.45));
  const cam = rutaCam(t, [
    [f.inicio, { x: 20, y: 0, s: 2.05 }],
    [Tpress, { x: 50, y: 10, s: 2.25 }],
    [Tclick, { x: 30, y: 30, s: 1.7 }],
    [fin, { x: -80, y: 10, s: 1.45 }],
  ]);
  g.save();
  camara(g, cam);
  const paredA = k.mezColor("#16324a", "#3a2418", luz);
  const paredB = k.mezColor("#0c1c2e", "#1a0e10", luz);
  fondo(g, paredA, paredB, luz > 0.2 ? "rgba(255, 200, 110, 0.55)" : "rgba(120, 180, 255, 0.25)", -200, -400);
  enchufe(g, { gfci: true, reset: 1 - pulsa });
  mano(g, 55, -200, 0.05, 0.85, pulsa);
  lampara(g, -360, -60, luz, 1.1);
  if (luz > 0.2) k.fogonazo(g, -360, 40, (t - Tclick) * 1.4, 700, "255, 210, 140");
  g.restore();
  velo(g, 0.8, "20, 14, 12");
  viñeta(g, 0.4, "16, 8, 6");
}

function celda(g, tipo, reset, al) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  if (tipo === "bath") {
    g.fillStyle = "#0e7c86";
    g.fillRect(-230, -280, 460, 560);
    g.globalAlpha *= 0.5;
    for (let y = -280; y < 280; y += 70) for (let x = -230; x < 230; x += 70) {
      g.strokeStyle = "#bff6ff";
      g.lineWidth = 4;
      g.strokeRect(x, y, 66, 66);
    }
    g.globalAlpha = al;
    g.fillStyle = "#f4fffd";
    g.beginPath();
    g.ellipse(0, 200, 120, 36, 0, 0, 6.28);
    g.fill();
  } else if (tipo === "kitchen") {
    g.fillStyle = "#ff8a3a";
    g.fillRect(-230, -280, 460, 560);
    g.fillStyle = "#7a2e12";
    g.fillRect(-230, -280, 460, 120);
    g.fillStyle = "#fff3e0";
    k.redondo(g, -40, 40, 80, 70, 8);
    g.fill();
    g.fillStyle = "#333";
    g.fillRect(-16, 20, 32, 28);
  } else if (tipo === "garage") {
    g.fillStyle = "#2c4a7a";
    g.fillRect(-230, -280, 460, 560);
    g.fillStyle = "#ff4d3a";
    k.redondo(g, -160, 40, 140, 120, 12);
    g.fill();
    g.fillStyle = "#ffd23a";
    g.beginPath();
    g.arc(90, 80, 54, 0, 6.28);
    g.fill();
    g.strokeStyle = "#1a1a1a";
    g.lineWidth = 8;
    g.beginPath();
    g.arc(90, 80, 20, 0, 6.28);
    g.stroke();
  } else {
    g.fillStyle = "#7fd0ff";
    g.fillRect(-230, -280, 460, 280);
    g.fillStyle = "#3cba6a";
    g.fillRect(-230, 0, 460, 280);
    g.fillStyle = "#f2f6f8";
    g.fillRect(-80, -200, 160, 220);
    g.fillStyle = "#f0c14a";
    k.redondo(g, 70, -20, 28, 70, 8);
    g.fill();
    g.fillStyle = "#7ad7ff";
    g.beginPath();
    g.ellipse(84, 60, 10, 16, 0, 0, 6.28);
    g.fill();
  }
  g.restore();
}

export function escenaBusca(g, t) {
  const f = v.frase(6);
  const fin = v.frase(7).inicio;
  const Tb = f.t("bath");
  const Tk = f.t("kitchen");
  const Tg = f.t("garage");
  const Tw = f.t("water");
  const Ts = f.t("sticking");
  const llega = [
    k.entra(k.suave(k.tramo(t, Tb - 0.05, Tb + 0.35))),
    k.entra(k.suave(k.tramo(t, Tk - 0.05, Tk + 0.35))),
    k.entra(k.suave(k.tramo(t, Tg - 0.05, Tg + 0.35))),
    k.entra(k.suave(k.tramo(t, Tw - 0.05, Tw + 0.4))),
  ];
  const pulsa = k.suave(k.tramo(t, f.t("press"), Ts + 0.15));
  const luz = k.suave(k.tramo(t, Ts, Ts + 0.4));
  const cam = rutaCam(t, [
    [f.inicio, { x: 0, y: 10, s: 2.05 }],
    [Tb, { x: 0, y: 30, s: 1.55 }],
    [Tw, { x: 0, y: 40, s: 0.58 }],
    [f.t("press") - 0.08, { x: 0, y: 40, s: 0.58 }],
    [f.t("press"), { x: -420, y: -300, s: 1.35 }],
    [Ts + 0.15, { x: -420, y: -280, s: 1.5 }],
    [fin, { x: -420, y: -280, s: 1.5 }],
  ]);
  const sitios = [
    [-420, -380, "bath", 1],
    [420, -380, "kitchen", 0],
    [-420, 440, "garage", 0],
    [420, 440, "out", 0],
  ];
  g.save();
  camara(g, cam);
  fondo(g, "#241848", "#100818", "rgba(255, 200, 140, 0.2)", 0, -600);
  // el enchufe sin botones, al principio
  g.save();
  g.globalAlpha = 1 - k.suave(k.tramo(t, Tb, Tb + 0.4));
  enchufe(g, {});
  g.restore();
  sitios.forEach((s, i) => {
    if (llega[i] < 0.02) return;
    g.save();
    g.translate(s[0], s[1]);
    const esc = 0.55 + 0.45 * llega[i];
    g.scale(esc, esc);
    celda(g, s[2], s[3], 1);
    g.translate(0, 30);
    g.scale(0.78, 0.78);
    const esBano = i === 0;
    enchufe(g, { gfci: esBano || i === 3, reset: esBano ? 1 - pulsa : 0 });
    if (esBano) lampara(g, 0, -340, luz, 0.7);
    g.restore();
  });
  if (pulsa > 0.02) mano(g, -390, -520, 0, 0.48, pulsa);
  g.restore();
  velo(g, 0.84, "18, 8, 32");
  viñeta(g, 0.45, "10, 4, 20");
}

export function escenaBreaker(g, t) {
  const f = v.frase(7);
  const fin = v.frase(8).inicio;
  const Toff = f.t("off");
  const Ton = f.t("on");
  const Tb = f.t("breaker");
  const saca = k.suave(k.tramo(t, f.t("unplug"), f.t("it")));
  const aOff = k.suave(k.tramo(t, Toff - 0.12, Toff + 0.22));
  const aOn = k.suave(k.tramo(t, Ton - 0.08, Ton + 0.28));
  const luz = k.suave(k.tramo(t, Ton + 0.05, Ton + 0.45));
  // 1 on, 0 medio, -1 off. El tercero pasa de medio a off a on.
  const est = aOn > 0 ? k.mez(-1, 1, aOn) : k.mez(0, -1, aOff);
  const estados = [1, est, 1, 1, 1, 1, 1, 1];
  const cam = rutaCam(t, [
    [f.inicio, { x: 280, y: 40, s: 1.45 }],
    [Tb - 0.1, { x: -90, y: -70, s: 1.55 }],
    [Toff, { x: -110, y: -80, s: 1.85 }],
    [Ton, { x: 200, y: 0, s: 1.3 }],
    [fin, { x: 220, y: 0, s: 1.3 }],
  ]);
  g.save();
  camara(g, cam);
  cuadro(g, estados, 1);
  lampara(g, 520, -80, luz, 1);
  clavija(g, 560, k.mez(80, -120, saca));
  mano(g, -20, -230, 0.05, 0.62, Math.max(aOff, aOn) * 0.7);
  g.restore();
  velo(g, 0.8, "8, 12, 28");
  viñeta(g, 0.4, "4, 8, 20");
}

export function escenaPeligro(g, t) {
  const f = v.frase(8);
  const fin = v.frase(9).t("that") - 0.04;
  const Thot = f.t("hot");
  const Tblack = f.t("black");
  const Tbuzz = f.t("buzzing");
  const Tstay = f.t("stay");
  const Telec = f.t("electrician");
  const cierra = k.suave(k.tramo(t, f.inicio, f.t("outlet")));
  const calor = k.suave(k.tramo(t, Thot - 0.1, Thot + 0.35));
  const negro = k.suave(k.tramo(t, Tblack - 0.05, Tblack + 0.4));
  const zumba = t > Tbuzz - 0.1 && t < Tstay ? Math.sin(t * 48) * 8 * (1 - k.suave(k.tramo(t, Tstay - 0.3, Tstay))) : 0;
  const cae = k.suave(k.tramo(t, Tstay, Tstay + 0.35));
  const tel = k.entra(k.suave(k.tramo(t, Telec - 0.25, Telec + 0.35)));
  const cam = rutaCam(t, [
    [f.inicio, { x: 0, y: 0, s: 1.9 }],
    [Thot, { x: 10, y: 10, s: 2.05 }],
    [Tstay, { x: -120, y: -20, s: 1.35 }],
    [Telec, { x: 180, y: 20, s: 1.4 }],
    [fin, { x: 180, y: 20, s: 1.4 }],
  ]);
  g.save();
  camara(g, cam);
  fondo(g, "#4a1018", "#1a080c", "rgba(255, 80, 30, 0.35)", 0, -400);
  enchufe(g, { gfci: true, reset: 1, calor, negro, abierto: (1 - cierra) * 0.35, vib: zumba });
  // la mano para la tapa y luego se retira cuando quema
  const retira = k.suave(k.tramo(t, Thot, Thot + 0.45));
  mano(g, 40 + retira * 320, -180, 0, 0.8, 0.85 * (1 - retira));
  if (t > Tstay - 0.15) {
    g.save();
    g.translate(-460, 60);
    g.scale(0.48, 0.48);
    const est = cae < 0.45 ? k.mez(-1, 1, cae / 0.45) : k.mez(1, -1, (cae - 0.45) / 0.55);
    cuadro(g, [1, est, 1, 1, 1, 1, 1, 1], 1, false);
    g.restore();
  }
  telefono(g, 360, 40, tel);
  g.restore();
  velo(g, 0.84, "32, 8, 10");
  viñeta(g, 0.48, "20, 4, 6");
}

export function escenaHora(g, t) {
  const f = v.frase(9);
  const fin = v.frase(10).inicio;
  const Tpress = f.t("press");
  const Tsec = f.t("seconds");
  const Tcall = f.t("calling");
  const Thour = f.t("hour");
  const pulsa = k.suave(k.tramo(t, Tpress, Tsec - 0.05));
  const van = k.entra(k.suave(k.tramo(t, Tcall, Thour - 0.15)));
  const bill = k.suave(k.tramo(t, Thour - 0.2, Thour + 0.35));
  const cam = rutaCam(t, [
    [f.inicio, { x: 40, y: 0, s: 1.8 }],
    [Tsec, { x: -80, y: 20, s: 1.4 }],
    [Thour, { x: 120, y: 40, s: 1.15 }],
    [fin, { x: 120, y: 40, s: 1.15 }],
  ]);
  g.save();
  camara(g, cam);
  fondo(g, "#24104a", "#100818", "rgba(255, 180, 80, 0.3)", -300, -500);
  enchufe(g, { gfci: true, reset: 1 - pulsa });
  mano(g, 50, -210, 0, 0.8, pulsa);
  g.save();
  g.translate(k.mez(780, -340, van), 260);
  g.fillStyle = "#ffc53a";
  k.redondo(g, -160, -70, 340, 140, 16);
  g.fill();
  g.fillStyle = "#8fd0ff";
  k.redondo(g, 40, -52, 110, 70, 10);
  g.fill();
  g.fillStyle = "#222";
  g.beginPath();
  g.arc(-80, 70, 28, 0, 6.28);
  g.arc(110, 70, 28, 0, 6.28);
  g.fill();
  g.restore();
  factura(g, 200, k.mez(-420, 20, bill), bill);
  g.restore();
  velo(g, 0.86, "16, 6, 28");
  viñeta(g, 0.45, "8, 4, 16");
}

export function escenaAmigo(g, t) {
  const f = v.frase(10);
  const fin = v.duracion;
  const cam = rutaCam(t, [
    [f.inicio, { x: -180, y: -20, s: 1.25 }],
    [f.t("friend"), { x: -40, y: 0, s: 1.6 }],
    [fin, { x: 20, y: 16, s: 2.15 }],
  ]);
  g.save();
  camara(g, cam);
  fondo(g, "#ffb067", "#c4482a", "rgba(255, 236, 190, 0.65)", -360, -520);
  g.fillStyle = "#7a3a22";
  g.fillRect(-1800, 400, 3600, 700);
  lampara(g, -380, -80, 1, 1.3);
  enchufe(g, { gfci: true, reset: 0 });
  g.restore();
  velo(g, 0.72, "70, 28, 16");
  viñeta(g, 0.28, "60, 20, 8");
}
