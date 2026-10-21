// Lo que comparten los planos: el salón visto desde detrás del sofá (la cabeza de quien mira, la tele, las palomitas),
// la peli y el anuncio en la tele, las ondas de sonido que salen de ella, la onda del sonido dibujada en grande con su
// techo, el medidor de volumen, el móvil y sus ondas. Todo en coordenadas de pantalla.
import * as k from "#kit";

const { suave: su, tramo: tr, mez, azar } = k;

export const camara = (g, cam) => { g.translate(540, 960); g.scale(cam.Z, cam.Z); g.translate(-cam.F.x, -cam.F.y); };
export const CAM0 = { Z: 1, F: { x: 540, y: 960 } };
export const mezCam = (a, b, u) => ({ Z: Math.exp(mez(Math.log(a.Z), Math.log(b.Z), u)), F: { x: mez(a.F.x, b.F.x, u), y: mez(a.F.y, b.F.y, u) } });

// ---------------------------------------------------------------- la tele: la peli y el anuncio
const CW = 640, CH = 360;
const peli = (() => {
  const l = k.lienzo(CW, CH), c = l.getContext("2d");
  const g = c.createLinearGradient(0, 0, 0, CH); g.addColorStop(0, "#0b1430"); g.addColorStop(1, "#1a2a3a"); c.fillStyle = g; c.fillRect(0, 0, CW, CH);
  c.fillStyle = "#f4f0d8"; c.beginPath(); c.arc(500, 80, 34, 0, 6.2832); c.fill();
  c.fillStyle = "#06080f"; c.beginPath(); c.moveTo(0, 300); c.lineTo(120, 220); c.lineTo(260, 280); c.lineTo(420, 200); c.lineTo(CW, 270); c.lineTo(CW, CH); c.lineTo(0, CH); c.fill();
  // dos personajes hablando bajito
  for (const x of [250, 330]) { c.fillStyle = "#020306"; c.beginPath(); c.arc(x, 250, 18, 0, 6.2832); c.fill(); c.fillRect(x - 16, 266, 32, 60); }
  return l;
})();
function anuncio(c, t) {
  const g = c.createLinearGradient(0, 0, CW, CH); g.addColorStop(0, "#ff2e63"); g.addColorStop(0.5, "#ffb02e"); g.addColorStop(1, "#ffe03a");
  c.fillStyle = g; c.fillRect(0, 0, CW, CH);
  // rayos que giran
  c.save(); c.translate(CW / 2, CH / 2); c.rotate(t * 0.8); c.fillStyle = "rgba(255,255,255,0.18)";
  for (let i = 0; i < 12; i++) { c.rotate(0.5236); c.beginPath(); c.moveTo(0, 0); c.lineTo(600, -60); c.lineTo(600, 60); c.fill(); }
  c.restore();
  const s = 1 + 0.06 * Math.sin(t * 9);
  c.save(); c.translate(CW / 2, CH / 2); c.scale(s, s); c.rotate(-0.08);
  c.fillStyle = "#fff"; c.font = "900 110px Figtree"; c.textAlign = "center"; c.textBaseline = "middle";
  c.lineWidth = 14; c.strokeStyle = "#c4123a"; c.strokeText("¡OFERTA!", 0, -10); c.fillText("¡OFERTA!", 0, -10);
  c.font = "900 50px Figtree"; c.fillStyle = "#1a0a2a"; c.fillText("SOLO HOY", 0, 80);
  c.restore();
}
const imgTV = k.lienzo(CW, CH);
// La tele, centrada en (x, y), de ancho w. op: { anuncio (0 la peli, 1 el anuncio), volumen (0-1), volAl }.
export function tele(g, x, y, w, t, op = {}) {
  const h = w * 0.5625, an = op.anuncio ?? 0;
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 40; g.shadowOffsetY = 16;
  k.redondo(g, x - w / 2 - 12, y - h / 2 - 12, w + 24, h + 24, 10); g.fillStyle = "#0b0b0e"; g.fill(); g.restore();
  const c = imgTV.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1;
  c.drawImage(peli, 0, 0);
  if (an > 0) { c.save(); c.globalAlpha = an; anuncio(c, t); c.restore(); }
  if ((op.volAl ?? 0) > 0) {
    c.save(); c.globalAlpha = op.volAl; k.redondo(c, 40, 296, 560, 40, 20); c.fillStyle = "rgba(10,10,20,0.8)"; c.fill();
    const v = op.volumen ?? 0.3, bg = c.createLinearGradient(80, 0, 560, 0); bg.addColorStop(0, "#5ad1ff"); bg.addColorStop(0.7, "#ffd23c"); bg.addColorStop(1, "#ff2e3d");
    k.redondo(c, 80, 308, Math.max(16, 480 * v), 16, 8); c.fillStyle = bg; c.fill();
    c.fillStyle = "#fff"; c.font = "800 28px Figtree"; c.textAlign = "left"; c.textBaseline = "middle"; c.fillText(String(Math.round(v * 100)), 570, 316);
    c.restore();
  }
  g.drawImage(imgTV, x - w / 2, y - h / 2, w, h);
  const rg = g.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2); rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(0.3, "rgba(255,255,255,0.08)"); rg.addColorStop(0.42, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(x - w / 2, y - h / 2, w, h);
  k.brillo(g, x, y, w * 1.6, an > 0.5 ? "255,160,80" : "90,120,200", 0.3 + 0.3 * an);
}
// Las ondas del sonido que salen de la tele: anillos que se abren, más gruesos y rápidos cuanto más fuerte.
export function ondasSonido(g, x, y, t, fuerza, color = "255,220,120") {
  if (fuerza <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  const n = 6, vel = mez(0.5, 1.6, fuerza);
  for (let i = 0; i < n; i++) {
    const u = ((t * vel + i / n) % 1), r = mez(80, mez(500, 1300, fuerza), u), a = Math.min(1, u * 6) * (1 - u) * fuerza;
    g.strokeStyle = `rgba(${color},${0.75 * a})`; g.lineWidth = mez(4, 22, fuerza);
    g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- el salón, desde detrás del sofá
// La pared, el mueble, la estantería del fondo (con el mando lejos) y la tele. op: { anuncio, volumen, volAl, mandoAl }.
export const TELE = { x: 540, y: 820, w: 720 }, ESTANTE = { x: 930, y: 640 };
export function salon(g, t, op = {}) {
  const pg = g.createLinearGradient(0, 0, 0, 1920); pg.addColorStop(0, "#1c1a2e"); pg.addColorStop(1, "#0e0d18");
  g.fillStyle = pg; g.fillRect(-400, -400, 1880, 2800);
  // la estantería del fondo, a la derecha
  g.fillStyle = "#4a3424"; g.fillRect(860, 560, 220, 16); g.fillRect(860, 700, 220, 16);
  const cols = ["#c94a4a", "#e8b04a", "#4a8ac9", "#6ac94a"];
  for (let i = 0; i < 6; i++) { g.fillStyle = cols[i % 4]; g.fillRect(880 + i * 26, 470 + (i % 2) * 14, 20, 90 - (i % 2) * 14); }
  // el mando, en la estantería: lejos
  const ma = op.mandoAl ?? 1;
  g.save(); g.globalAlpha *= ma; g.translate(ESTANTE.x + 60, 690); g.rotate(-0.1);
  k.redondo(g, -12, -40, 24, 80, 10); g.fillStyle = "#15161c"; g.fill(); g.fillStyle = "#e0283c"; g.beginPath(); g.arc(-4, -28, 4, 0, 6.2832); g.fill();
  g.restore();
  // el mueble
  g.fillStyle = "#3a2a20"; g.fillRect(120, 1060, 840, 90); g.fillStyle = "#4a3628"; g.fillRect(120, 1060, 840, 10);
  tele(g, TELE.x, TELE.y, TELE.w, t, op);
}
// El sofá desde atrás, con la cabeza de quien mira y el bol de palomitas. bote: 0-1, el susto (salta todo).
export function sofa(g, t, bote = 0) {
  const by = -90 * bote;
  // la cabeza y los hombros
  g.save(); g.translate(430, 1430 + by);
  g.fillStyle = "#1a1a24"; g.beginPath(); g.ellipse(0, 170, 190, 120, 0, Math.PI, 0); g.fill();
  g.fillStyle = "#2a1a14"; g.beginPath(); g.arc(0, 0, 110, 0, 6.2832); g.fill();
  g.fillStyle = "#3a2418"; g.beginPath(); g.arc(-20, -30, 80, Math.PI, 0); g.fill();
  // el pelo de punta del susto
  if (bote > 0.05) { g.strokeStyle = "#2a1a14"; g.lineWidth = 12; g.lineCap = "round"; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 26, -90); g.lineTo(i * 36, -90 - 70 * bote); g.stroke(); } }
  g.restore();
  // el respaldo del sofá
  k.redondo(g, -40, 1500, 1160, 520, 80); const sg = g.createLinearGradient(0, 1500, 0, 1900); sg.addColorStop(0, "#7a3a5a"); sg.addColorStop(1, "#3a1a2a"); g.fillStyle = sg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(-40, 1520, 1160, 14);
  // el bol de palomitas, a la derecha
  const az = azar(3);
  g.save(); g.translate(800, 1490 + by * 0.6);
  for (let i = 0; i < 26; i++) { const px = (az() - 0.5) * 220, py = -az() * 70 - 160 * bote * az(); g.fillStyle = "#fff6d0"; g.beginPath(); g.arc(px, py, 16 + az() * 8, 0, 6.2832); g.fill(); }
  g.beginPath(); g.moveTo(-140, -20); g.lineTo(140, -20); g.lineTo(110, 140); g.lineTo(-110, 140); g.closePath(); g.fillStyle = "#e0283c"; g.fill();
  g.save(); g.clip(); g.fillStyle = "#fff"; for (let i = -3; i < 4; i += 2) g.fillRect(i * 36, -30, 36, 200); g.restore();
  g.restore();
}

// ---------------------------------------------------------------- la onda del sonido, en grande
// Las alturas de la peli (susurros y explosiones) y del anuncio (apretado, cerca del techo), una por barra.
const azO = azar(42);
export const PELI = Array.from({ length: 400 }, (_, i) => { const b = 0.08 + 0.12 * azO(); const exp = (i % 90 > 60 && i % 90 < 70) ? 0.55 + 0.35 * azO() : 0; return Math.max(b, exp); });
export const ANUNCIO = Array.from({ length: 400 }, () => 0.78 + 0.18 * azO());
// La onda en el panel (x0..x1, centro yc, alto máximo hMax): barras de la serie dada desde el índice i0, n barras.
// comprime (0-1): las bajitas suben hacia el techo. color: "r,g,b".
export function onda(g, serie, i0, n, x0, x1, yc, hMax, color, comprime = 0, al = 1) {
  if (al <= 0.01) return;
  const paso = (x1 - x0) / n;
  g.save(); g.globalAlpha *= al; g.globalCompositeOperation = "lighter";
  for (let i = 0; i < n; i++) {
    const j = Math.floor(i0 + i), v0 = serie[((j % serie.length) + serie.length) % serie.length];
    const v = mez(v0, 0.8 + 0.12 * v0, comprime), h = hMax * v;
    const x = x0 + i * paso;
    const gg = g.createLinearGradient(0, yc - h, 0, yc + h); gg.addColorStop(0, `rgba(${color},0.9)`); gg.addColorStop(0.5, `rgba(255,255,255,0.95)`); gg.addColorStop(1, `rgba(${color},0.9)`);
    g.fillStyle = gg; k.redondo(g, x, yc - h, Math.max(2, paso * 0.7), h * 2, Math.min(paso * 0.35, 6)); g.fill();
  }
  g.restore();
}
// El techo: dos líneas rojas discontinuas (arriba y abajo de la onda), con su nombre.
export function techo(g, x0, x1, yc, hMax, al, texto = "límite", brilla = 0) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.setLineDash([24, 14]); g.lineWidth = 8 + 6 * brilla; g.strokeStyle = `rgb(${k.mezRgb("255,70,90", "255,200,200", brilla)})`;
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x0, yc + s * hMax); g.lineTo(x1, yc + s * hMax); g.stroke(); }
  g.setLineDash([]); g.restore();
  if (brilla > 0) k.brillo(g, (x0 + x1) / 2, yc - hMax, (x1 - x0) * 1.2, "255,70,90", 0.4 * brilla);
  k.etiqueta(g, x0 + 10, yc - hMax - 86, texto, "255,110,120", al, 44);
}

// ---------------------------------------------------------------- el medidor
// Un medidor de aguja (de verde a rojo), centrado en (x, y), de radio r; v: 0-1 dónde está la aguja.
export function medidor(g, x, y, r, v, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y);
  g.fillStyle = "#14141c"; k.redondo(g, -r * 1.15, -r * 1.05, r * 2.3, r * 1.35, r * 0.15); g.fill();
  const zonas = [["#3ae07a", 0, 0.55], ["#ffd23c", 0.55, 0.78], ["#ff3a4a", 0.78, 1]];
  for (const [c, a, b] of zonas) { g.strokeStyle = c; g.lineWidth = r * 0.16; g.beginPath(); g.arc(0, 0, r * 0.82, Math.PI + a * Math.PI, Math.PI + b * Math.PI); g.stroke(); }
  const ang = Math.PI + v * Math.PI;
  g.strokeStyle = "#fff"; g.lineWidth = r * 0.05; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(ang) * r * 0.8, Math.sin(ang) * r * 0.8); g.stroke();
  g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, r * 0.08, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- el móvil
const lienzoMovil = k.lienzo(900, 1850);
// El móvil de frente, centrado en (x, y), de ancho w. op: { toque: 0-1 el botón de bajar el volumen, nivel: 0-1 }.
export function movil(g, x, y, w, ang, op = {}) {
  const h = w * 2.05, r = w * 0.15;
  g.save(); g.translate(x, y); g.rotate(ang);
  g.save(); g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = w * 0.15; g.shadowOffsetY = w * 0.06;
  k.redondo(g, -w / 2, -h / 2, w, h, r); g.fillStyle = "#111"; g.fill(); g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, r); k.metal(g, -w / 2, w / 2, ["#b8b0e8", "#f4f0ff", "#9a90d8", "#ece8ff", "#7a70c0"]);
  const m = w * 0.035, sw = w - 2 * m, sh = h - 2 * m;
  const c = lienzoMovil.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  const bg = c.createLinearGradient(0, 0, 0, 1850); bg.addColorStop(0, "#1a1430"); bg.addColorStop(1, "#0e0a1e"); c.fillStyle = bg; c.fillRect(0, 0, 900, 1850);
  c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "rgba(255,255,255,0.7)"; c.font = "700 50px Figtree"; c.fillText("Tele del salón", 450, 230);
  c.strokeStyle = "#8ab4ff"; c.lineWidth = 8; c.lineCap = "round"; for (const rr of [20, 38, 56]) { c.beginPath(); c.arc(780, 130, rr, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); }
  // la barra de volumen de la app
  const nv = op.nivel ?? 0.8;
  k.redondo(c, 120, 420, 660, 40, 20); c.fillStyle = "rgba(255,255,255,0.15)"; c.fill();
  k.redondo(c, 120, 420, Math.max(40, 660 * nv), 40, 20); c.fillStyle = nv > 0.6 ? "#ff5a6a" : "#8ab4ff"; c.fill();
  const bt = (x, y, rr, col, txt, luz = 0) => { c.save(); c.shadowColor = `rgba(140,180,255,${0.2 + 0.6 * luz})`; c.shadowBlur = 40 + 70 * luz; const gg = c.createRadialGradient(x - rr * 0.3, y - rr * 0.4, rr * 0.1, x, y, rr); gg.addColorStop(0, k.mezColor(col, "#ffffff", 0.35 + 0.4 * luz)); gg.addColorStop(1, col); c.fillStyle = gg; c.beginPath(); c.arc(x, y, rr * (1 - 0.06 * luz), 0, 6.2832); c.fill(); c.restore(); c.fillStyle = "#14102a"; c.font = `900 ${Math.round(rr * 0.9)}px Figtree`; c.fillText(txt, x, y + 6); };
  bt(450, 760, 120, "#ff5a6a", "I");
  bt(240, 1120, 140, "#d8e4ff", "+"); bt(660, 1120, 140, "#8ab4ff", "-", op.toque ?? 0);
  bt(240, 1480, 100, "#c8b4ff", "C+"); bt(660, 1480, 100, "#c8b4ff", "C-");
  g.save(); k.redondo(g, -sw / 2, -sh / 2, sw, sh, r * 0.8); g.clip(); g.drawImage(lienzoMovil, -sw / 2, -sh / 2, sw, sh); g.restore();
  k.redondo(g, -w * 0.13, -sh / 2 + w * 0.03, w * 0.26, w * 0.065, w * 0.033); g.fillStyle = "#050505"; g.fill();
  g.restore();
}
export function ondasWifi(g, a, b, t, t0, t1) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  for (let te = t0; te < t1; te += 0.12) {
    const u = (t - te) / 0.55; if (u < 0 || u > 1) continue;
    const x = mez(a.x, b.x, u), y = mez(a.y, b.y, u), r = mez(30, 80, u), al = Math.min(1, u * 6) * Math.min(1, (1 - u) * 5);
    g.strokeStyle = `rgba(140,180,255,${0.9 * al})`; g.lineWidth = 8;
    g.beginPath(); g.arc(x - Math.cos(ang) * r, y - Math.sin(ang) * r, r, ang - 0.7, ang + 0.7); g.stroke();
  }
  g.restore();
}
