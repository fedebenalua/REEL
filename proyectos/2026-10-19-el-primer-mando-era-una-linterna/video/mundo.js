// Lo que comparten los planos: el salón de 1955 (papel pintado, ventana con sol, suelo de madera), la tele de madera
// en blanco y negro con sus cuatro ojos en las esquinas, la linterna-pistola (Flash-Matic), el mando del martillito
// (Space Command) por fuera y por dentro, el mando de hoy y el móvil. Todo en coordenadas de pantalla; la cámara es un
// zoom alrededor de un punto (cam: { Z, F: { x, y } }).
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar } = k;

export const camara = (g, cam) => { g.translate(540, 960); g.scale(cam.Z, cam.Z); g.translate(-cam.F.x, -cam.F.y); };
export const CAM0 = { Z: 1, F: { x: 540, y: 960 } };
export const mezCam = (a, b, u) => ({ Z: Math.exp(mez(Math.log(a.Z), Math.log(b.Z), u)), F: { x: mez(a.F.x, b.F.x, u), y: mez(a.F.y, b.F.y, u) } });

// ---------------------------------------------------------------- la tele de 1955
export const TELE = { x: 540, y: 900, w: 700, h: 760 };              // el mueble; la pantalla va arriba
export const PANT = { x: 540, y: 790, w: 520, h: 400 };
export const ESQUINAS = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => ({ x: PANT.x + sx * (PANT.w / 2 + 38), y: PANT.y + sy * (PANT.h / 2 + 30) }));
export const FUNCIONES = ["encender", "canal +", "silencio", "canal -"];

// los canales, en blanco y negro (se pintan una vez)
const CW = 640, CH = 480;
function carta() {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  c.fillStyle = "#8a8a8a"; c.fillRect(0, 0, CW, CH);
  const grises = ["#f2f2f2", "#cfcfcf", "#a8a8a8", "#7f7f7f", "#575757", "#2f2f2f"];
  grises.forEach((col, i) => { c.fillStyle = col; c.fillRect(i * CW / 6, 0, CW / 6, CH); });
  c.fillStyle = "#1c1c1c"; c.beginPath(); c.arc(CW / 2, CH / 2, 170, 0, 6.2832); c.fill();
  c.strokeStyle = "#f0f0f0"; c.lineWidth = 6;
  for (const r of [60, 110, 160]) { c.beginPath(); c.arc(CW / 2, CH / 2, r, 0, 6.2832); c.stroke(); }
  c.beginPath(); c.moveTo(CW / 2 - 170, CH / 2); c.lineTo(CW / 2 + 170, CH / 2); c.moveTo(CW / 2, CH / 2 - 170); c.lineTo(CW / 2, CH / 2 + 170); c.stroke();
  c.fillStyle = "#f0f0f0"; c.font = "800 44px Figtree"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("CANAL 2", CW / 2, CH / 2);
  return l;
}
function paisaje() {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  const cg = c.createLinearGradient(0, 0, 0, CH); cg.addColorStop(0, "#e8e8e8"); cg.addColorStop(0.6, "#9a9a9a"); cg.addColorStop(1, "#3a3a3a");
  c.fillStyle = cg; c.fillRect(0, 0, CW, CH);
  c.fillStyle = "#fafafa"; c.beginPath(); c.arc(470, 150, 60, 0, 6.2832); c.fill();
  [["#6a6a6a", 300, 1], ["#444", 350, 1.6], ["#222", 400, 2.4]].forEach(([col, b, f], i) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, CH); for (let x = 0; x <= CW; x += 16) c.lineTo(x, b - 70 * Math.abs(Math.sin(x / 120 * f + i))); c.lineTo(CW, CH); c.fill(); });
  // un vaquero a caballo, en silueta
  c.fillStyle = "#111"; c.beginPath(); c.ellipse(200, 380, 60, 26, 0, 0, 6.2832); c.fill();
  c.fillRect(150, 390, 10, 50); c.fillRect(240, 390, 10, 50); c.fillRect(172, 395, 9, 45); c.fillRect(222, 395, 9, 45);
  c.beginPath(); c.moveTo(250, 370); c.lineTo(290, 330); c.lineTo(300, 345); c.lineTo(262, 385); c.fill();
  c.fillRect(192, 320, 18, 45); c.beginPath(); c.arc(201, 312, 12, 0, 6.2832); c.fill(); c.fillRect(180, 300, 42, 6);
  return l;
}
function noticias() {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  c.fillStyle = "#5e5e5e"; c.fillRect(0, 0, CW, CH);
  const fg = c.createRadialGradient(CW / 2, 160, 20, CW / 2, 200, 400); fg.addColorStop(0, "#bdbdbd"); fg.addColorStop(1, "#4a4a4a");
  c.fillStyle = fg; c.fillRect(0, 0, CW, CH);
  // el presentador: hombros, cabeza, pelo y corbata
  c.fillStyle = "#1e1e1e"; c.beginPath(); c.moveTo(170, CH); c.quadraticCurveTo(190, 300, CW / 2, 290); c.quadraticCurveTo(450, 300, 470, CH); c.fill();
  c.fillStyle = "#d8d8d8"; c.beginPath(); c.moveTo(CW / 2 - 40, 295); c.lineTo(CW / 2 + 40, 295); c.lineTo(CW / 2, 380); c.fill();
  c.fillStyle = "#333"; c.beginPath(); c.moveTo(CW / 2 - 12, 300); c.lineTo(CW / 2 + 12, 300); c.lineTo(CW / 2 + 16, 400); c.lineTo(CW / 2, 420); c.lineTo(CW / 2 - 16, 400); c.fill();
  c.fillStyle = "#b5b5b5"; c.beginPath(); c.ellipse(CW / 2, 220, 62, 78, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#2a2a2a"; c.beginPath(); c.ellipse(CW / 2, 168, 64, 36, 0, Math.PI, 0); c.fill();
  c.fillStyle = "#777"; c.fillRect(0, 420, CW, 60);
  c.fillStyle = "#eee"; c.font = "800 34px Figtree"; c.textAlign = "left"; c.fillText("NOTICIAS", 24, 455);
  return l;
}
const CANALES = [carta(), paisaje(), noticias()];
const imagen = k.lienzo(CW, CH);
// La imagen de la tele: canal (con decimales mientras cambia: la imagen nueva baja rodando, como en las teles viejas),
// la nieve de fondo y las líneas de la pantalla. apagada: 0 encendida, 1 negra.
function pintaImagen(t, canal, apagada) {
  const c = imagen.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  const a = Math.floor(canal), u = canal - a;
  const img = (i) => CANALES[((i % 3) + 3) % 3];
  const dy = CH * su(u);
  c.drawImage(img(a), 0, dy); c.drawImage(img(a + 1), 0, dy - CH);
  if (u > 0 && u < 1) { c.fillStyle = "#000"; c.fillRect(0, dy - 14, CW, 18); }
  // el grano de la imagen
  c.globalAlpha = 0.12; c.globalCompositeOperation = "overlay"; c.drawImage(k.red, (t * 600) % 80 - 80, (t * 900) % 80 - 80, CW + 160, CH + 160);
  c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  for (let y = 0; y < CH; y += 4) { c.fillStyle = "rgba(0,0,0,0.12)"; c.fillRect(0, y, CW, 2); }
  if (apagada > 0) { c.fillStyle = `rgba(6,6,8,${apagada})`; c.fillRect(0, 0, CW, CH); }
}

// La tele: op = { canal, apagada, ojos: [4 valores 0-1, cuánto brilla cada esquina], grieta: 0-1, sonido: 0-1 (el
// micrófono de la tele, encendido) }.
export function tele(g, t, op = {}) {
  const { x, y, w, h } = TELE;
  // la sombra en el suelo y en la pared
  g.save(); g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(x, y + h / 2 + 150, w * 0.62, 50, 0, 0, 6.2832); g.fill(); g.restore();
  // las patas
  g.fillStyle = "#3a2214";
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * (w / 2 - 60), y + h / 2 - 10); g.lineTo(x + s * (w / 2 - 40), y + h / 2 - 10); g.lineTo(x + s * (w / 2 - 10), y + h / 2 + 150); g.lineTo(x + s * (w / 2 - 26), y + h / 2 + 150); g.fill(); }
  // el mueble de madera
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 20;
  k.redondo(g, x - w / 2, y - h / 2, w, h, 46); g.fillStyle = "#6b3f22"; g.fill(); g.restore();
  k.redondo(g, x - w / 2, y - h / 2, w, h, 46);
  const mg = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  mg.addColorStop(0, "#5a321a"); mg.addColorStop(0.15, "#9a5f34"); mg.addColorStop(0.5, "#b0703e"); mg.addColorStop(0.85, "#86522c"); mg.addColorStop(1, "#4a2915");
  g.fillStyle = mg; g.fill();
  g.save(); g.clip(); g.globalAlpha = 0.4; g.globalCompositeOperation = "multiply"; g.drawImage(VETAS, x - w / 2, y - h / 2, w, h); g.restore();
  g.strokeStyle = "rgba(255,220,170,0.35)"; g.lineWidth = 4; g.stroke();
  // el marco dorado de la pantalla
  const P = PANT;
  k.redondo(g, P.x - P.w / 2 - 34, P.y - P.h / 2 - 28, P.w + 68, P.h + 56, 50);
  const og = g.createLinearGradient(0, P.y - P.h / 2, 0, P.y + P.h / 2); og.addColorStop(0, "#f2d9a0"); og.addColorStop(0.5, "#b8925a"); og.addColorStop(1, "#e8c98a");
  g.fillStyle = og; g.fill();
  // la pantalla abombada
  g.save();
  k.redondo(g, P.x - P.w / 2, P.y - P.h / 2, P.w, P.h, 60); g.clip();
  pintaImagen(t, op.canal ?? 0, op.apagada ?? 0);
  g.drawImage(imagen, P.x - P.w / 2 - 10, P.y - P.h / 2 - 8, P.w + 20, P.h + 16);
  const vg = g.createRadialGradient(P.x, P.y, P.h * 0.3, P.x, P.y, P.w * 0.62); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.65)");
  g.fillStyle = vg; g.fillRect(P.x - P.w / 2, P.y - P.h / 2, P.w, P.h);
  const rg = g.createLinearGradient(P.x - P.w / 2, P.y - P.h / 2, P.x + P.w / 2, P.y + P.h / 2); rg.addColorStop(0.15, "rgba(255,255,255,0.0)"); rg.addColorStop(0.25, "rgba(255,255,255,0.16)"); rg.addColorStop(0.36, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(P.x - P.w / 2, P.y - P.h / 2, P.w, P.h);
  // la grieta
  if ((op.grieta ?? 0) > 0) grieta(g, P.x + 40, P.y - 30, op.grieta);
  g.restore();
  // los cuatro ojos de las esquinas
  ESQUINAS.forEach((e, i) => {
    const al = op.ojos?.[i] ?? 0;
    g.fillStyle = "#2a2a2a"; g.beginPath(); g.arc(e.x, e.y, 15, 0, 6.2832); g.fill();
    const eg = g.createRadialGradient(e.x - 4, e.y - 4, 1, e.x, e.y, 12); eg.addColorStop(0, al > 0.05 ? "#eaffd0" : "#7a8a70"); eg.addColorStop(1, al > 0.05 ? "#7dff5a" : "#2d3a28");
    g.fillStyle = eg; g.beginPath(); g.arc(e.x, e.y, 11, 0, 6.2832); g.fill();
    if (al > 0) k.brillo(g, e.x, e.y, 170, "150,255,100", al);
  });
  // la rejilla del altavoz, de tela
  const ry = P.y + P.h / 2 + 60, rh = 140;
  k.redondo(g, x - 250, ry, 500, rh, 20);
  const tg = g.createLinearGradient(0, ry, 0, ry + rh); tg.addColorStop(0, "#d9c7a0"); tg.addColorStop(1, "#a8946c");
  g.fillStyle = tg; g.fill();
  g.save(); g.clip(); g.strokeStyle = "rgba(80,60,30,0.35)"; g.lineWidth = 3; for (let xx = x - 250; xx < x + 250; xx += 12) { g.beginPath(); g.moveTo(xx, ry); g.lineTo(xx, ry + rh); g.stroke(); } g.restore();
  // los mandos giratorios y el micrófono (para el mando del martillito)
  for (const [dx, a] of [[-150, t * 0.2], [150, 1.2]]) {
    const kx = x + dx, ky = ry + rh + 55;
    g.fillStyle = "#1c1c1c"; g.beginPath(); g.arc(kx, ky + 4, 34, 0, 6.2832); g.fill();
    const kg = g.createRadialGradient(kx - 10, ky - 10, 2, kx, ky, 32); kg.addColorStop(0, "#f2e6c8"); kg.addColorStop(1, "#8a7a58");
    g.fillStyle = kg; g.beginPath(); g.arc(kx, ky, 30, 0, 6.2832); g.fill();
    g.strokeStyle = "#3a2a14"; g.lineWidth = 5; g.beginPath(); g.moveTo(kx, ky); g.lineTo(kx + 24 * Math.cos(a), ky + 24 * Math.sin(a)); g.stroke();
  }
  const mx = x, my = ry + rh + 55;
  g.fillStyle = "#222"; g.beginPath(); g.arc(mx, my, 18, 0, 6.2832); g.fill();
  g.fillStyle = "#555"; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { g.beginPath(); g.arc(mx + i * 7, my + j * 7, 2.5, 0, 6.2832); g.fill(); }
  if ((op.sonido ?? 0) > 0) k.brillo(g, mx, my, 220, "90,220,255", op.sonido);
}
export const MICRO = { x: TELE.x, y: PANT.y + PANT.h / 2 + 60 + 140 + 55 };

const VETAS = k.ruido(256, 91, 2, 4, "lineas");
function grieta(g, x, y, u) {
  const az = azar(7);
  g.save(); g.strokeStyle = `rgba(255,255,255,${0.9 * Math.min(1, u * 2)})`; g.lineCap = "round";
  for (let r = 0; r < 9; r++) {
    let a = (r / 9) * 6.2832 + az(), px = x, py = y; const L = 320 * u * (0.6 + 0.6 * az());
    g.lineWidth = 3; g.beginPath(); g.moveTo(px, py);
    for (let s = 0; s < 6; s++) { a += (az() - 0.5) * 0.8; px += Math.cos(a) * L / 6; py += Math.sin(a) * L / 6; g.lineTo(px, py); }
    g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- el salón de 1955
const papel = (() => {
  const l = k.lienzo(1080, 1920), c = l.getContext("2d");
  const pg = c.createLinearGradient(0, 0, 0, 1920); pg.addColorStop(0, "#2f6b66"); pg.addColorStop(1, "#1d4a47");
  c.fillStyle = pg; c.fillRect(0, 0, 1080, 1920);
  c.strokeStyle = "rgba(240,220,170,0.18)"; c.lineWidth = 3;
  for (let yy = -60; yy < 1500; yy += 120) for (let xx = (yy / 120) % 2 ? 60 : 0; xx < 1140; xx += 120) {
    c.beginPath(); c.moveTo(xx, yy - 34); c.lineTo(xx + 22, yy); c.lineTo(xx, yy + 34); c.lineTo(xx - 22, yy); c.closePath(); c.stroke();
    c.fillStyle = "rgba(240,220,170,0.14)"; c.beginPath(); c.arc(xx + 60, yy + 60, 5, 0, 6.2832); c.fill();
  }
  c.globalAlpha = 0.25; c.globalCompositeOperation = "multiply"; c.drawImage(k.manchas, 0, 0, 1080, 1920); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  // el rodapié y el suelo de madera
  const sg = c.createLinearGradient(0, 1380, 0, 1920); sg.addColorStop(0, "#7a4a28"); sg.addColorStop(1, "#3c2312");
  c.fillStyle = sg; c.fillRect(0, 1380, 1080, 540);
  c.strokeStyle = "rgba(0,0,0,0.25)"; c.lineWidth = 3; for (let yy = 1420; yy < 1920; yy += 70) { c.beginPath(); c.moveTo(0, yy); c.lineTo(1080, yy); c.stroke(); }
  c.fillStyle = "#e9dcc0"; c.fillRect(0, 1350, 1080, 36);
  return l;
})();
// El salón: la pared, el suelo y la ventana de la izquierda con su sol. sol: 0-1, cuánto entra.
export function salon(g, t, sol = 0) {
  g.drawImage(papel, 0, 0);
  // la ventana, con cortinas
  const vx = -60, vy = 420, vw = 300, vh = 620;
  const cg = g.createLinearGradient(0, vy, 0, vy + vh); cg.addColorStop(0, k.mezColor("#4a7fb0", "#9fd6ff", sol)); cg.addColorStop(1, k.mezColor("#c8d9e8", "#fff4c8", sol));
  g.fillStyle = cg; g.fillRect(vx, vy, vw, vh);
  if (sol > 0) k.brillo(g, vx + 160, vy + 160, 520, "255,240,190", sol);
  g.fillStyle = "#f4ead2"; g.fillRect(vx - 10, vy - 14, vw + 20, 14); g.fillRect(vx - 10, vy + vh, vw + 20, 18); g.fillRect(vx + vw / 2 - 6, vy, 12, vh); g.fillRect(vx, vy + vh / 2 - 6, vw, 12); g.fillRect(vx + vw - 6, vy, 12, vh);
  const cort = g.createLinearGradient(vx + vw - 20, 0, vx + vw + 110, 0); cort.addColorStop(0, "#c94a3a"); cort.addColorStop(0.5, "#e8735e"); cort.addColorStop(1, "#8a2a20");
  g.fillStyle = cort; g.beginPath(); g.moveTo(vx + vw - 10, vy - 40); g.quadraticCurveTo(vx + vw + 70, vy + vh / 2, vx + vw + 10, vy + vh + 60); g.lineTo(vx + vw + 110, vy + vh + 60); g.quadraticCurveTo(vx + vw + 140, vy + vh / 2, vx + vw + 100, vy - 40); g.fill();
  // la luz del techo, cálida
  k.brillo(g, 700, 300, 1500, "255,200,130", 0.25);
}
// Los rayos de sol que entran por la ventana y cruzan el salón (hacia la tele).
export function rayosDeSol(g, t, al) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 6; i++) {
    const y0 = 450 + i * 95, w = 70 + 20 * Math.sin(t * 1.5 + i), a = al * (0.16 + 0.06 * Math.sin(t * 2 + i * 1.7));
    const rg = g.createLinearGradient(80, 0, 1080, 0); rg.addColorStop(0, `rgba(255,236,170,${a})`); rg.addColorStop(1, `rgba(255,236,170,${a * 0.2})`);
    g.fillStyle = rg; g.beginPath(); g.moveTo(80, y0); g.lineTo(80, y0 + w); g.lineTo(1080, y0 + w + 360 + i * 30); g.lineTo(1080, y0 + 260 + i * 30); g.closePath(); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- la linterna-pistola de 1955
// Centrada en el mango (x, y), apuntando con ang (0 = derecha), de tamaño s (1 = unos 600 px de largo).
export function linterna(g, x, y, s, ang, luz = 0) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 40; g.shadowOffsetY = 20;
  // el mango
  g.beginPath(); g.moveTo(-60, -40); g.lineTo(20, -40); g.lineTo(0, 200); g.quadraticCurveTo(-20, 230, -70, 220); g.lineTo(-100, 40); g.closePath();
  const mg = g.createLinearGradient(-100, 0, 20, 0); mg.addColorStop(0, "#1e3b2c"); mg.addColorStop(0.5, "#3f7a5a"); mg.addColorStop(1, "#1a3324");
  g.fillStyle = mg; g.fill(); g.restore();
  g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 4; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-80 + i * 4, 60 + i * 30); g.lineTo(-10 + i * 2, 60 + i * 30); g.stroke(); }
  // el gatillo
  g.strokeStyle = "#c9a85a"; g.lineWidth = 12; g.beginPath(); g.moveTo(30, -10); g.quadraticCurveTo(50, 40, 20, 60); g.stroke();
  // el cañón
  k.redondo(g, -120, -110, 420, 110, 40);
  const cg = g.createLinearGradient(0, -110, 0, 0); cg.addColorStop(0, "#9ad1b0"); cg.addColorStop(0.25, "#4f9a72"); cg.addColorStop(0.7, "#2a5a40"); cg.addColorStop(1, "#1a3a28");
  g.fillStyle = cg; g.fill();
  g.save(); k.redondo(g, -120, -110, 420, 110, 40); g.clip(); g.globalAlpha = 0.25; g.globalCompositeOperation = "multiply"; g.drawImage(k.red, -130, -120, 440, 140); g.restore();
  // los aros dorados y la boca
  g.fillStyle = "#e3c27a"; g.fillRect(40, -110, 14, 110); g.fillRect(80, -110, 8, 110);
  k.redondo(g, 280, -130, 70, 150, 26);
  const bg = g.createLinearGradient(0, -130, 0, 20); bg.addColorStop(0, "#f6e2a8"); bg.addColorStop(0.5, "#b88f44"); bg.addColorStop(1, "#7a5a24");
  g.fillStyle = bg; g.fill();
  g.fillStyle = luz > 0 ? `rgb(${k.mezRgb("90,90,80", "255,250,220", luz)})` : "#5a5a50"; g.beginPath(); g.ellipse(350, -55, 16, 64, 0, 0, 6.2832); g.fill();
  k.reflejo(g, -90, -100, 340, 12, 0.35);
  g.restore();
  // el brillo de la boca, fuera del giro
  const bx = x + Math.cos(ang) * 350 * s - Math.sin(ang) * -55 * s, by = y + Math.sin(ang) * 350 * s + Math.cos(ang) * -55 * s;
  if (luz > 0) k.brillo(g, bx, by, 500 * s, "255,240,190", luz);
  return { x: bx, y: by };
}
// El haz de la linterna: un cono de luz de a (la boca) a b (donde da).
export function haz(g, a, b, al, ancho = 150) {
  if (al <= 0.01) return;
  const ang = Math.atan2(b.y - a.y, b.x - a.x), L = Math.hypot(b.x - a.x, b.y - a.y);
  g.save(); g.translate(a.x, a.y); g.rotate(ang); g.globalCompositeOperation = "lighter";
  const hg = g.createLinearGradient(0, 0, L, 0); hg.addColorStop(0, `rgba(255,245,200,${0.55 * al})`); hg.addColorStop(1, `rgba(255,235,170,${0.25 * al})`);
  g.fillStyle = hg; g.beginPath(); g.moveTo(0, -20); g.lineTo(L, -ancho / 2); g.lineTo(L, ancho / 2); g.lineTo(0, 20); g.closePath(); g.fill();
  g.restore();
  k.brillo(g, b.x, b.y, ancho * 2.4, "255,240,190", 0.8 * al);
}

// ---------------------------------------------------------------- el mando del martillito (1956)
// Centrado en (x, y), de ancho w (alto 1,5 w). rayos: 0 por fuera, 1 se ve por dentro (las barritas, los martillos y el
// hueco donde no hay pilas). golpe: [4 valores 0-1] cada martillo bajando. vibra: [4 valores] cada barrita sonando.
export function martillito(g, x, y, w, t, op = {}) {
  const h = w * 1.5, rx = op.rayos ?? 0;
  g.save(); g.translate(x, y);
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = w * 0.1; g.shadowOffsetY = w * 0.05;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.14); g.fillStyle = "#3a2a1c"; g.fill(); g.restore();
  // por fuera: marrón y dorado
  if (rx < 1) {
    g.save(); g.globalAlpha *= 1 - rx;
    k.redondo(g, -w / 2, -h / 2, w, h, w * 0.14);
    const cg = g.createLinearGradient(-w / 2, 0, w / 2, 0); cg.addColorStop(0, "#4a3220"); cg.addColorStop(0.3, "#8a5e3a"); cg.addColorStop(0.7, "#6a4428"); cg.addColorStop(1, "#3a2414");
    g.fillStyle = cg; g.fill();
    g.save(); g.clip(); g.globalAlpha *= 0.3; g.globalCompositeOperation = "multiply"; g.drawImage(VETAS, -w / 2, -h / 2, w, h); g.restore();
    k.redondo(g, -w * 0.38, -h * 0.42, w * 0.76, h * 0.2, w * 0.05); g.fillStyle = "#d9b870"; g.fill();
    g.fillStyle = "#3a2414"; g.font = `800 ${Math.round(w * 0.1)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ZENITH", 0, -h * 0.32);
    g.restore();
  }
  // por dentro: el hueco oscuro, las barritas, los martillos y el sitio vacío de las pilas
  if (rx > 0) {
    g.save(); g.globalAlpha *= rx;
    k.redondo(g, -w / 2, -h / 2, w, h, w * 0.14); g.fillStyle = "rgba(20,30,50,0.92)"; g.fill();
    g.strokeStyle = "rgba(140,200,255,0.6)"; g.lineWidth = w * 0.012; g.stroke();
    // el sitio de las pilas, vacío
    g.setLineDash([w * 0.03, w * 0.025]); g.strokeStyle = "rgba(255,120,120,0.7)"; g.lineWidth = w * 0.012;
    k.redondo(g, -w * 0.34, h * 0.08, w * 0.68, h * 0.14, w * 0.04); g.stroke(); g.setLineDash([]);
    // las cuatro barritas de aluminio
    for (let i = 0; i < 4; i++) {
      const by = -h * 0.32 + i * h * 0.085, L = w * (0.78 - i * 0.08), vib = (op.vibra?.[i] ?? 0) * Math.sin(t * 90) * w * 0.006;
      const ag = g.createLinearGradient(0, by - w * 0.025, 0, by + w * 0.025); ag.addColorStop(0, "#ffffff"); ag.addColorStop(0.4, "#c9d1dc"); ag.addColorStop(1, "#6d7480");
      g.fillStyle = ag; k.redondo(g, -L / 2, by - w * 0.022 + vib, L, w * 0.044, w * 0.02); g.fill();
      if ((op.vibra?.[i] ?? 0) > 0) k.brillo(g, 0, by, w * 0.9, "120,220,255", 0.6 * op.vibra[i]);
      // el martillito encima
      const gp = op.golpe?.[i] ?? 0, mx = -L / 2 + w * 0.08, my = by - w * 0.055 + gp * w * 0.03;
      g.strokeStyle = "#d9b870"; g.lineWidth = w * 0.012; g.beginPath(); g.moveTo(mx - w * 0.08, my - w * 0.02); g.lineTo(mx, my); g.stroke();
      g.fillStyle = "#e8c070"; k.redondo(g, mx - w * 0.015, my - w * 0.01, w * 0.05, w * 0.03, w * 0.008); g.fill();
    }
    g.restore();
  }
  // los cuatro botones, abajo
  for (let i = 0; i < 4; i++) {
    const bx = -w * 0.3 + (i % 2) * w * 0.6, by = h * 0.3 + Math.floor(i / 2) * h * 0.13, p = op.golpe?.[i] ?? 0;
    g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.ellipse(bx, by + w * 0.02, w * 0.12, w * 0.07, 0, 0, 6.2832); g.fill();
    const bg = g.createRadialGradient(bx - w * 0.03, by - w * 0.03, 2, bx, by, w * 0.12); bg.addColorStop(0, "#fff3d0"); bg.addColorStop(1, "#b8955a");
    g.fillStyle = bg; g.beginPath(); g.ellipse(bx, by + p * w * 0.015, w * 0.12, w * 0.07, 0, 0, 6.2832); g.fill();
  }
  g.restore();
}
// Las ondas del sonido agudo: anillos finos y apretados, azules, que salen de (x, y).
export function ondasAgudas(g, x, y, t, t0, t1, al = 1, R = 1100) {
  g.save(); g.globalCompositeOperation = "lighter";
  for (let te = t0; te < t1; te += 0.07) {
    const u = (t - te) / 0.9; if (u < 0 || u > 1) continue;
    const r = mez(30, R, u), a = al * Math.min(1, u * 8) * (1 - u);
    g.strokeStyle = `rgba(90,220,255,${0.6 * a})`; g.lineWidth = 4; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- el mando de hoy y el móvil
// El mando de hoy, blanco, de frente, centrado en (x, y), de ancho w (alto 3,6 w). pila: 0-1 lo que le queda (se ve
// por dentro si rayos > 0).
export function mandoHoy(g, x, y, w, t, op = {}) {
  const h = w * 3.6;
  g.save(); g.translate(x, y); g.rotate(op.ang ?? 0);
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = w * 0.15; g.shadowOffsetY = w * 0.06;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.4); g.fillStyle = "#e9ecf2"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.4);
  const cg = g.createLinearGradient(-w / 2, 0, w / 2, 0); cg.addColorStop(0, "#c7ccd6"); cg.addColorStop(0.25, "#ffffff"); cg.addColorStop(0.8, "#e2e6ee"); cg.addColorStop(1, "#aab0bc");
  g.fillStyle = cg; g.fill();
  // la punta oscura
  g.save(); k.redondo(g, -w / 2, -h / 2, w, h, w * 0.4); g.clip(); g.fillStyle = "#1b1d24"; g.fillRect(-w / 2, -h / 2, w, h * 0.06); g.restore();
  // botones: un círculo grande y unos pocos
  g.fillStyle = "#dfe3ea"; g.beginPath(); g.arc(0, -h * 0.18, w * 0.32, 0, 6.2832); g.fill();
  g.strokeStyle = "#b9bfca"; g.lineWidth = w * 0.02; g.stroke();
  g.fillStyle = "#f4f6fa"; g.beginPath(); g.arc(0, -h * 0.18, w * 0.13, 0, 6.2832); g.fill();
  g.fillStyle = "#e0283c"; g.beginPath(); g.arc(-w * 0.22, -h * 0.38, w * 0.07, 0, 6.2832); g.fill();
  for (let i = 0; i < 3; i++) { g.fillStyle = "#c9ced8"; k.redondo(g, -w * 0.3 + i * w * 0.22, h * 0.02, w * 0.16, w * 0.1, w * 0.05); g.fill(); }
  // por dentro: las pilas
  const rx = op.rayos ?? 0;
  if (rx > 0) {
    g.save(); g.globalAlpha *= rx;
    k.redondo(g, -w * 0.36, h * 0.12, w * 0.72, h * 0.32, w * 0.1); g.fillStyle = "rgba(20,30,50,0.9)"; g.fill();
    for (const dx of [-0.17, 0.17]) {
      const px = dx * w, py = h * 0.28, pw = w * 0.24, ph = h * 0.27;
      k.redondo(g, px - pw / 2, py - ph / 2, pw, ph, pw * 0.2); g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = w * 0.02; g.stroke();
      const nv = op.pila ?? 1, col = nv > 0.4 ? "90,230,120" : "255,60,70";
      k.redondo(g, px - pw / 2 + w * 0.03, py + ph / 2 - w * 0.03 - (ph - w * 0.06) * nv, pw - w * 0.06, (ph - w * 0.06) * nv, pw * 0.1); g.fillStyle = `rgb(${col})`; g.fill();
    }
    g.restore();
  }
  g.restore();
}

// El móvil, de frente, con la pantalla en claro (la app de mando nueva). x, y: centro; w: ancho. pantalla: 'app' o
// 'tienda' (la app para descargar), con mezcla u (0 app, 1 tienda); toque: 0-1; salta: el icono que salta.
const lienzoMovil = k.lienzo(900, 1850);
export function movil(g, x, y, w, ang, op = {}) {
  const h = w * 2.05, r = w * 0.15;
  g.save(); g.translate(x, y); g.rotate(ang);
  g.save(); g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = w * 0.15; g.shadowOffsetY = w * 0.06;
  k.redondo(g, -w / 2, -h / 2, w, h, r); g.fillStyle = "#111"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, r); k.metal(g, -w / 2, w / 2, ["#f0b9c8", "#fff1f5", "#e2a3b5", "#fde4ec", "#c98aa0"]);
  const m = w * 0.035, sw = w - 2 * m, sh = h - 2 * m;
  const c = lienzoMovil.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  pantallaApp(c, 900, 1850, op);
  g.save(); k.redondo(g, -sw / 2, -sh / 2, sw, sh, r * 0.8); g.clip(); g.drawImage(lienzoMovil, -sw / 2, -sh / 2, sw, sh); g.restore();
  k.redondo(g, -w * 0.13, -sh / 2 + w * 0.03, w * 0.26, w * 0.065, w * 0.033); g.fillStyle = "#050505"; g.fill();
  g.restore();
}
function pantallaApp(c, W, H, op) {
  const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#fff6e8"); bg.addColorStop(1, "#ffe1ea");
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  c.textAlign = "center"; c.textBaseline = "middle";
  const u = op.tienda ?? 0;
  if (u < 1) {
    c.save(); c.globalAlpha = 1 - u;
    c.fillStyle = "#2a1a3a"; c.font = "800 70px Figtree"; c.fillText("Mando TV", W / 2, 230);
    const bt = (x, y, r, col, txt, luz = 0) => {
      c.save(); c.shadowColor = "rgba(0,0,0,0.18)"; c.shadowBlur = 30; c.shadowOffsetY = 12;
      const gg = c.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); gg.addColorStop(0, k.mezColor(col, "#ffffff", 0.35)); gg.addColorStop(1, col);
      c.fillStyle = gg; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); c.restore();
      c.fillStyle = "#fff"; c.font = `800 ${Math.round(r * 0.8)}px Figtree`; c.fillText(txt, x, y + 4);
      if (luz > 0) { c.strokeStyle = `rgba(255,90,140,${luz})`; c.lineWidth = 12; c.beginPath(); c.arc(x, y, r * (1 + 0.5 * (1 - luz)), 0, 6.2832); c.stroke(); }
    };
    bt(W / 2, 520, 140, "#ff4d6d", "I", op.toque ?? 0);
    bt(W / 2 - 230, 900, 110, "#ffb02e", "+"); bt(W / 2 + 230, 900, 110, "#ffb02e", "-");
    bt(W / 2 - 230, 1180, 110, "#7a5cff", "C+"); bt(W / 2 + 230, 1180, 110, "#7a5cff", "C-");
    c.fillStyle = "rgba(42,26,58,0.08)"; k.redondo(c, 120, 1420, W - 240, 200, 100); c.fill();
    c.fillStyle = "#2a1a3a"; c.font = "700 52px Figtree"; c.fillText("Sin pilas · siempre contigo", W / 2, 1520);
    c.restore();
  }
  if (u > 0) {
    c.save(); c.globalAlpha = u;
    c.fillStyle = "#fff6ee"; c.fillRect(0, 0, W, H);
    const s = 1 + (op.salta ?? 0), iw = 480 * s;
    c.save(); c.shadowColor = "rgba(255,80,140,0.55)"; c.shadowBlur = 90;
    k.redondo(c, W / 2 - iw / 2, 640 - iw / 2, iw, iw, iw * 0.24);
    const ig = c.createLinearGradient(0, 640 - iw / 2, 0, 640 + iw / 2); ig.addColorStop(0, "#ffb02e"); ig.addColorStop(1, "#ff4d6d");
    c.fillStyle = ig; c.fill(); c.restore();
    c.save(); c.translate(W / 2, 640); c.scale(s, s); c.rotate(-0.3);
    k.redondo(c, -55, -150, 110, 300, 40); c.fillStyle = "#fff"; c.fill();
    c.fillStyle = "#ff4d6d"; c.beginPath(); c.arc(0, -95, 24, 0, 6.2832); c.fill();
    c.fillStyle = "#ffc9d4"; for (let j = 0; j < 3; j++) for (let i = -1; i <= 1; i++) { c.beginPath(); c.arc(i * 30, -30 + j * 40, 11, 0, 6.2832); c.fill(); }
    c.restore();
    c.fillStyle = "#2a1a3a"; c.font = "800 76px Figtree"; c.fillText("Mando TV", W / 2, 1010);
    k.redondo(c, W / 2 - 270, 1160, 540, 150, 75); c.fillStyle = "#ff4d6d"; c.fill();
    c.fillStyle = "#fff"; c.font = "800 66px Figtree"; c.fillText("Descargar", W / 2, 1237);
    c.restore();
  }
}
