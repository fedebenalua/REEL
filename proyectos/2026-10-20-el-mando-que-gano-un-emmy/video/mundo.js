// Lo que comparten los planos: el escenario de una gala (telón rojo, focos, suelo de madera brillante, confeti), la
// estatuilla dorada, el sobre del premio, el mando de cable de 1950, el mando de hoy, la tele de ahora y el móvil.
// Todo en coordenadas de pantalla; la cámara es un zoom alrededor de un punto.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar, entra } = k;

export const camara = (g, cam) => { g.translate(540, 960); g.scale(cam.Z, cam.Z); g.translate(-cam.F.x, -cam.F.y); };
export const CAM0 = { Z: 1, F: { x: 540, y: 960 } };
export const mezCam = (a, b, u) => ({ Z: Math.exp(mez(Math.log(a.Z), Math.log(b.Z), u)), F: { x: mez(a.F.x, b.F.x, u), y: mez(a.F.y, b.F.y, u) } });

// ---------------------------------------------------------------- el escenario
const terciopelo = (() => {
  const l = k.lienzo(540, 1920), c = l.getContext("2d");
  for (let x = 0; x < 540; x += 2) {
    const u = (Math.sin(x / 34) + 1) / 2, v = Math.pow(u, 1.6);
    c.fillStyle = `rgb(${Math.round(mez(70, 210, v))},${Math.round(mez(6, 30, v))},${Math.round(mez(16, 46, v))})`;
    c.fillRect(x, 0, 2, 1920);
  }
  c.globalAlpha = 0.25; c.globalCompositeOperation = "multiply"; c.drawImage(k.red, 0, 0, 540, 1920);
  return l;
})();
// El escenario: el fondo oscuro, el suelo, el telón a los lados y arriba, y el foco. foco: 0-1; fx: dónde da el foco.
export function escenario(g, t, op = {}) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#0d0614"); fg.addColorStop(0.6, "#1e0c22"); fg.addColorStop(1, "#0a0408");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  // el suelo de madera brillante, en perspectiva
  const sy = 1240;
  const sg = g.createLinearGradient(0, sy, 0, 1920); sg.addColorStop(0, "#5a3218"); sg.addColorStop(1, "#2a1408");
  g.fillStyle = sg; g.fillRect(0, sy, 1080, 1920 - sy);
  g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 3;
  for (let i = -8; i <= 8; i++) { g.beginPath(); g.moveTo(540 + i * 60, sy); g.lineTo(540 + i * 260, 1920); g.stroke(); }
  for (let y = sy + 40, d = 40; y < 1920; d *= 1.3, y += d) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  // el foco: un cono de luz desde arriba y su círculo en el suelo
  const foco = op.foco ?? 1, fx = op.fx ?? 540;
  if (foco > 0) {
    g.save(); g.globalCompositeOperation = "lighter";
    const cg = g.createLinearGradient(0, 0, 0, sy + 120); cg.addColorStop(0, `rgba(255,240,200,${0.05 * foco})`); cg.addColorStop(1, `rgba(255,240,200,${0.22 * foco})`);
    g.fillStyle = cg; g.beginPath(); g.moveTo(fx - 70, -20); g.lineTo(fx + 70, -20); g.lineTo(fx + 360, sy + 120); g.lineTo(fx - 360, sy + 120); g.closePath(); g.fill();
    const pg = g.createRadialGradient(fx, sy + 120, 10, fx, sy + 120, 380); pg.addColorStop(0, `rgba(255,240,200,${0.5 * foco})`); pg.addColorStop(1, "rgba(255,240,200,0)");
    g.fillStyle = pg; g.save(); g.translate(fx, sy + 120); g.scale(1, 0.28); g.beginPath(); g.arc(0, 0, 380, 0, 6.2832); g.fill(); g.restore();
    g.restore();
  }
  // el telón: a los lados, con pliegues, y la bambalina de arriba
  const abre = op.abre ?? 1;
  g.drawImage(terciopelo, mez(0, -330, abre) - 0, 0, 540, 1920);
  g.save(); g.translate(1080, 0); g.scale(-1, 1); g.drawImage(terciopelo, mez(0, -330, abre), 0, 540, 1920); g.restore();
  g.save();
  const bg = g.createLinearGradient(0, 0, 0, 260); bg.addColorStop(0, "#5a0a18"); bg.addColorStop(1, "#a8203a");
  g.fillStyle = bg; g.beginPath(); g.moveTo(0, 0); g.lineTo(1080, 0); g.lineTo(1080, 200);
  for (let x = 1080; x >= 0; x -= 135) g.quadraticCurveTo(x - 67, 290, x - 135, 200);
  g.closePath(); g.fill();
  g.fillStyle = "#e8c070"; for (let x = 0; x <= 1080; x += 135) { g.beginPath(); g.arc(x, 204, 9, 0, 6.2832); g.fill(); }
  g.restore();
}

// El confeti dorado y de colores que cae, desde t0, con su cantidad al.
const azC = azar(77);
const CONFETI = Array.from({ length: 160 }, () => ({ x: azC() * 1180 - 50, v: 260 + azC() * 380, f: azC() * 6.28, d: azC() * 1.2, w: 10 + azC() * 14, c: ["#ffd23c", "#ff5a7a", "#5ad1ff", "#ffffff", "#ffb02e"][Math.floor(azC() * 5)] }));
export function confeti(g, t, t0, al = 1) {
  if (al <= 0.01 || t < t0) return;
  g.save(); g.globalAlpha *= al;
  for (const p of CONFETI) {
    const u = t - t0 - p.d; if (u < 0) continue;
    const y = -60 + u * p.v; if (y > 1980) continue;
    const x = p.x + 40 * Math.sin(u * 3 + p.f);
    g.save(); g.translate(x, y); g.rotate(u * 5 + p.f); g.scale(1, Math.abs(Math.sin(u * 7 + p.f)) + 0.15);
    g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2);
    g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- la estatuilla dorada
// Una figura dorada con alas que sostiene una esfera, sobre su peana. (x, y): el pie; h: el alto total.
export function estatuilla(g, x, y, h, t, brillo = 0) {
  const s = h / 600;
  g.save(); g.translate(x, y); g.scale(s, s);
  const oro = (y0, y1) => { const og = g.createLinearGradient(-90, y0, 90, y1); og.addColorStop(0, "#7a5410"); og.addColorStop(0.3, "#ffe08a"); og.addColorStop(0.5, "#f2b632"); og.addColorStop(0.75, "#fff1b8"); og.addColorStop(1, "#8a5e14"); return og; };
  // la peana negra con su aro dorado
  k.redondo(g, -110, -110, 220, 110, 16); const pg = g.createLinearGradient(-110, 0, 110, 0); pg.addColorStop(0, "#111"); pg.addColorStop(0.4, "#3a3a40"); pg.addColorStop(1, "#0a0a0c"); g.fillStyle = pg; g.fill();
  g.fillStyle = oro(-130, -110); g.fillRect(-120, -128, 240, 22);
  // el cuerpo, que sube estrechándose
  g.beginPath(); g.moveTo(-50, -128); g.quadraticCurveTo(-30, -260, -22, -360); g.lineTo(22, -360); g.quadraticCurveTo(30, -260, 50, -128); g.closePath();
  g.fillStyle = oro(-360, -128); g.fill();
  // las alas
  for (const sx of [-1, 1]) {
    g.save(); g.scale(sx, 1);
    g.beginPath(); g.moveTo(14, -340); g.bezierCurveTo(90, -380, 150, -470, 130, -560); g.bezierCurveTo(100, -500, 70, -440, 22, -400); g.closePath();
    g.fillStyle = oro(-560, -340); g.fill();
    g.strokeStyle = "rgba(120,80,10,0.5)"; g.lineWidth = 3; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(30 + i * 15, -380 - i * 8); g.quadraticCurveTo(80 + i * 10, -430 - i * 20, 110 + i * 5, -500 - i * 15); g.stroke(); }
    g.restore();
  }
  // la cabeza y los brazos que suben la esfera
  g.fillStyle = oro(-400, -370); g.beginPath(); g.arc(0, -385, 22, 0, 6.2832); g.fill();
  g.strokeStyle = "#f2c24a"; g.lineWidth = 14; g.lineCap = "round"; for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 16, -350); g.quadraticCurveTo(sx * 40, -420, sx * 18, -470); g.stroke(); }
  // la esfera con sus órbitas
  g.fillStyle = oro(-540, -470); g.beginPath(); g.arc(0, -505, 40, 0, 6.2832); g.fill();
  g.strokeStyle = "#ffe08a"; g.lineWidth = 6;
  for (const a of [0, 1.05, 2.1]) { g.save(); g.translate(0, -505); g.rotate(a + t * 0.6); g.beginPath(); g.ellipse(0, 0, 70, 22, 0, 0, 6.2832); g.stroke(); g.restore(); }
  g.restore();
  // los destellos del oro
  const d = 0.5 + 0.5 * Math.sin(t * 3);
  k.brillo(g, x + 20 * s, y - 300 * s, 140 * s, "255,240,190", 0.5 * d + brillo);
  k.brillo(g, x - 70 * s, y - 520 * s, 120 * s, "255,240,190", 0.4 * (1 - d) + brillo);
  if (brillo > 0) k.brillo(g, x, y - 350 * s, 900 * s, "255,210,110", brillo);
}

// ---------------------------------------------------------------- el sobre del premio
// La tarjeta dorada que sale del sobre: «Y el Emmy es para…» y, debajo, el nombre. abre: 0-1.
export function sobre(g, x, y, w, abre, nombre) {
  const h = w * 0.62;
  g.save(); g.translate(x, y);
  // la tarjeta sube
  const ty = -h * 0.75 * entra(abre);
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30;
  k.redondo(g, -w * 0.45, ty - h * 0.45, w * 0.9, h * 0.9, 14);
  const cg = g.createLinearGradient(0, ty - h / 2, 0, ty + h / 2); cg.addColorStop(0, "#fff6d8"); cg.addColorStop(1, "#f0d898");
  g.fillStyle = cg; g.fill(); g.restore();
  g.fillStyle = "#6a4a10"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `600 ${Math.round(w * 0.065)}px Figtree`; g.fillText("Y el Emmy es para…", 0, ty - h * 0.2);
  g.font = `900 ${Math.round(w * 0.14)}px Figtree`; g.fillStyle = "#b8202a"; g.fillText(nombre, 0, ty + h * 0.1);
  // el sobre, delante
  g.beginPath(); g.rect(-w / 2, -h * 0.1, w, h * 0.62);
  const sg = g.createLinearGradient(0, -h * 0.1, 0, h * 0.52); sg.addColorStop(0, "#e8c070"); sg.addColorStop(1, "#b8862e");
  g.fillStyle = sg; g.fill();
  g.fillStyle = "#d4a548"; g.beginPath(); g.moveTo(-w / 2, -h * 0.1); g.lineTo(0, h * 0.28); g.lineTo(w / 2, -h * 0.1); g.closePath(); g.fill();
  g.fillStyle = "#a01c28"; g.beginPath(); g.arc(0, h * 0.24, w * 0.05, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- los mandos
// El mando de 1950 (con cable): una caja color crema con dos botones grandes. (x, y): centro; w: ancho; ang.
export function mando1950(g, x, y, w, ang = 0) {
  const h = w * 1.3;
  g.save(); g.translate(x, y); g.rotate(ang);
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = w * 0.15; g.shadowOffsetY = w * 0.06;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.18); g.fillStyle = "#e8dcc0"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.18);
  const cg = g.createLinearGradient(-w / 2, 0, w / 2, 0); cg.addColorStop(0, "#c8b890"); cg.addColorStop(0.3, "#fff6e0"); cg.addColorStop(1, "#b8a880");
  g.fillStyle = cg; g.fill();
  for (const [by, col] of [[-0.18, "#b8202a"], [0.2, "#3a3a40"]]) {
    g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.arc(0, by * h + w * 0.03, w * 0.2, 0, 6.2832); g.fill();
    const bg = g.createRadialGradient(-w * 0.06, by * h - w * 0.06, 2, 0, by * h, w * 0.2); bg.addColorStop(0, k.mezColor(col, "#ffffff", 0.4)); bg.addColorStop(1, col);
    g.fillStyle = bg; g.beginPath(); g.arc(0, by * h, w * 0.2, 0, 6.2832); g.fill();
  }
  g.restore();
}
// El mando de hoy, negro y con botones de colores, de pie. (x, y): centro; w: ancho (alto 3,4 w).
export function mandoHoy(g, x, y, w, ang = 0, op = {}) {
  const h = w * 3.4;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= op.al ?? 1;
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = w * 0.2; g.shadowOffsetY = w * 0.08;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.35); g.fillStyle = "#1b1c22"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.35);
  const cg = g.createLinearGradient(-w / 2, 0, w / 2, 0); cg.addColorStop(0, "#4a4c56"); cg.addColorStop(0.2, "#2a2b33"); cg.addColorStop(0.8, "#18191e"); cg.addColorStop(1, "#33343c");
  g.fillStyle = cg; g.fill();
  const b = (bx, by, r, col) => { const gg = g.createRadialGradient(bx * w - r * 0.3, by * h - r * 0.3, 1, bx * w, by * h, r); gg.addColorStop(0, k.mezColor(col, "#ffffff", 0.35)); gg.addColorStop(1, col); g.fillStyle = gg; g.beginPath(); g.arc(bx * w, by * h, r, 0, 6.2832); g.fill(); };
  b(-0.22, -0.4, w * 0.11, "#e0283c");
  for (let j = 0; j < 3; j++) for (let i = -1; i <= 1; i++) b(i * 0.25, -0.24 + j * 0.08, w * 0.08, "#55575f");
  g.fillStyle = "#3a3c44"; g.beginPath(); g.arc(0, h * 0.08, w * 0.3, 0, 6.2832); g.fill(); b(0, 0.08, w * 0.13, "#6a6c74");
  ["#e0283c", "#2fbf55", "#f2c230", "#2f7ae0"].forEach((c, i) => b(-0.33 + i * 0.22, 0.3, w * 0.07, c));
  g.restore();
}

// ---------------------------------------------------------------- la tele de ahora (en el escenario)
const CW = 640, CH = 360;
function canal(n) {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  if (n === 0) { const gg = c.createLinearGradient(0, 0, 0, CH); gg.addColorStop(0, "#ff7a59"); gg.addColorStop(1, "#ffd27a"); c.fillStyle = gg; c.fillRect(0, 0, CW, CH); c.fillStyle = "#fff6d0"; c.beginPath(); c.arc(320, 230, 70, 0, 6.2832); c.fill(); c.fillStyle = "#3a6ad0"; c.fillRect(0, 250, CW, 110); for (let i = 0; i < 8; i++) { c.fillStyle = "rgba(255,255,255,0.5)"; c.fillRect(260 + (i % 2) * 30, 262 + i * 11, 80 - i * 6, 4); } }
  if (n === 1) { c.fillStyle = "#2fa24a"; c.fillRect(0, 0, CW, CH); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#2a9343" : "#34b052"; c.fillRect(i * 80, 0, 80, CH); } c.strokeStyle = "#fff"; c.lineWidth = 5; c.strokeRect(20, 20, CW - 40, CH - 40); c.beginPath(); c.moveTo(320, 20); c.lineTo(320, CH - 20); c.stroke(); c.beginPath(); c.arc(320, 180, 60, 0, 6.2832); c.stroke(); c.fillStyle = "#fff"; c.beginPath(); c.arc(420, 200, 14, 0, 6.2832); c.fill(); }
  if (n === 2) { const gg = c.createLinearGradient(0, 0, CW, CH); gg.addColorStop(0, "#1a0d3a"); gg.addColorStop(1, "#0a1a3a"); c.fillStyle = gg; c.fillRect(0, 0, CW, CH); const a = azar(3); for (let i = 0; i < 200; i++) { c.fillStyle = `rgba(255,255,255,${a()})`; c.fillRect(a() * CW, a() * CH, 2, 2); } c.fillStyle = "#ff9a3c"; c.beginPath(); c.arc(420, 170, 90, 0, 6.2832); c.fill(); c.strokeStyle = "#ffd27a"; c.lineWidth = 8; c.beginPath(); c.ellipse(420, 170, 150, 30, -0.3, 0, 6.2832); c.stroke(); }
  return l;
}
const CANALES = [canal(0), canal(1), canal(2)];
const imgTV = k.lienzo(CW, CH);
// La tele de ahora, centrada en (x, y), de ancho w. op: { encendida, canal (con decimales al cambiar), volumen, volAl, flash }.
export function teleHoy(g, x, y, w, t, op = {}) {
  const h = w * 0.5625;
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 50; g.shadowOffsetY = 20;
  k.redondo(g, x - w / 2 - 14, y - h / 2 - 14, w + 28, h + 28, 12); g.fillStyle = "#0b0b0e"; g.fill(); g.restore();
  g.fillStyle = "#151518"; g.fillRect(x - 10, y + h / 2 + 14, 20, 60); g.fillRect(x - 120, y + h / 2 + 70, 240, 14);
  const enc = op.encendida ?? 1;
  g.save(); g.beginPath(); g.rect(x - w / 2, y - h / 2, w, h); g.clip();
  g.fillStyle = "#0a0a0e"; g.fillRect(x - w / 2, y - h / 2, w, h);
  if (enc > 0) {
    const c = imgTV.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
    const cn = op.canal ?? 0, a = Math.floor(cn), u = cn - a;
    c.drawImage(CANALES[((a % 3) + 3) % 3], -CW * su(u), 0); c.drawImage(CANALES[(((a + 1) % 3) + 3) % 3], CW * (1 - su(u)), 0);
    if ((op.volAl ?? 0) > 0) {
      c.save(); c.globalAlpha = op.volAl; k.redondo(c, 40, 290, 560, 44, 22); c.fillStyle = "rgba(10,10,20,0.75)"; c.fill();
      const bg = c.createLinearGradient(80, 0, 560, 0); bg.addColorStop(0, "#5ad1ff"); bg.addColorStop(1, "#ff5ac8");
      k.redondo(c, 80, 304, Math.max(16, 480 * (op.volumen ?? 0.5)), 16, 8); c.fillStyle = bg; c.fill(); c.restore();
    }
    g.globalAlpha = enc; g.drawImage(imgTV, x - w / 2, y - h / 2, w, h); g.globalAlpha = 1;
  }
  const fl = op.flash;
  if (fl != null && fl > -0.05 && fl < 0.45) { g.fillStyle = `rgba(255,250,240,${0.95 * (1 - fl / 0.45)})`; g.fillRect(x - w / 2, y - h / 2, w, h); }
  const rg = g.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(0.3, "rgba(255,255,255,0.08)"); rg.addColorStop(0.42, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(x - w / 2, y - h / 2, w, h);
  g.restore();
  if (enc > 0) k.brillo(g, x, y, w * 1.5, "120,170,255", 0.25 * enc);
}

// ---------------------------------------------------------------- el móvil
const lienzoMovil = k.lienzo(900, 1850);
// El móvil de frente, centrado en (x, y), de ancho w, girado ang. op: { toque (0-1, el botón que se pulsa), boton }.
export function movil(g, x, y, w, ang, op = {}) {
  const h = w * 2.05, r = w * 0.15;
  g.save(); g.translate(x, y); g.rotate(ang);
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = w * 0.15; g.shadowOffsetY = w * 0.06;
  k.redondo(g, -w / 2, -h / 2, w, h, r); g.fillStyle = "#111"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, r); k.metal(g, -w / 2, w / 2, ["#c9a24a", "#fff1c0", "#d4b060", "#ffeab0", "#a8822e"]);
  const m = w * 0.035, sw = w - 2 * m, sh = h - 2 * m;
  const c = lienzoMovil.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  pantallaApp(c, 900, 1850, op);
  g.save(); k.redondo(g, -sw / 2, -sh / 2, sw, sh, r * 0.8); g.clip(); g.drawImage(lienzoMovil, -sw / 2, -sh / 2, sw, sh); g.restore();
  k.redondo(g, -w * 0.13, -sh / 2 + w * 0.03, w * 0.26, w * 0.065, w * 0.033); g.fillStyle = "#050505"; g.fill();
  g.restore();
}
function pantallaApp(c, W, H, op) {
  const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#14101f"); bg.addColorStop(1, "#2a1530");
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = "rgba(255,255,255,0.7)"; c.font = "700 50px Figtree"; c.fillText("Tele del salón", W / 2, 230);
  // el símbolo del wifi
  c.strokeStyle = "#5ad1ff"; c.lineWidth = 8; c.lineCap = "round"; for (const r of [20, 38, 56]) { c.beginPath(); c.arc(W - 120, 130, r, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); }
  const bt = (i, x, y, r, col, txt) => {
    const luz = op.boton === i ? (op.toque ?? 0) : 0;
    c.save(); c.shadowColor = `rgba(${col === "#e8b04a" ? "255,200,90" : "255,255,255"},${0.25 + 0.6 * luz})`; c.shadowBlur = 40 + 60 * luz;
    const gg = c.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); gg.addColorStop(0, k.mezColor(col, "#ffffff", 0.35 + 0.4 * luz)); gg.addColorStop(1, col);
    c.fillStyle = gg; c.beginPath(); c.arc(x, y, r * (1 - 0.06 * luz), 0, 6.2832); c.fill(); c.restore();
    c.fillStyle = "#1a0d14"; c.font = `800 ${Math.round(r * 0.7)}px Figtree`; c.fillText(txt, x, y + 4);
  };
  bt(0, W / 2, 520, 140, "#e8b04a", "I");
  bt(1, W / 2 - 230, 900, 110, "#f4e6c8", "+"); bt(2, W / 2 + 230, 900, 110, "#f4e6c8", "-");
  bt(3, W / 2 - 230, 1180, 110, "#c8b4ff", "C+"); bt(4, W / 2 + 230, 1180, 110, "#c8b4ff", "C-");
}
// Las ondas del wifi que salen del móvil hacia la tele: arcos azules que viajan de a a b.
export function ondas(g, a, b, t, t0, t1) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  for (let te = t0; te < t1; te += 0.12) {
    const u = (t - te) / 0.55; if (u < 0 || u > 1) continue;
    const x = mez(a.x, b.x, u), y = mez(a.y, b.y, u), r = mez(30, 80, u), al = Math.min(1, u * 6) * Math.min(1, (1 - u) * 5);
    g.strokeStyle = `rgba(90,210,255,${0.9 * al})`; g.lineWidth = 8;
    g.beginPath(); g.arc(x - Math.cos(ang) * r, y - Math.sin(ang) * r, r, ang - 0.7, ang + 0.7); g.stroke();
  }
  g.restore();
}
