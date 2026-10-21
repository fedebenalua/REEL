// Lo que comparten los planos: la cámara 2D, las monedas de euro, la hucha, el vapor y la lavadora (con su puerta de
// cristal, el agua que pasa de azul a rojo y la rueda de la temperatura).
import * as k from "#kit";

const { azar, lienzo, mez, tramo, suave } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy, ang = 0) { g.setTransform(1, 0, 0, 1, 540, 960); g.rotate(ang); g.scale(Z, Z); g.translate(-cx, -cy); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
export function velo(g, al = 0.5, color = "10,8,20") {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(${color},${al})`); vg.addColorStop(0.6, `rgba(${color},${al * 0.7})`); vg.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.5) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 520, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// ---------------------------------------------------------------- los colores
export const ORO = "255,205,80", ROJO = "255,70,50", AZUL = "90,180,255", VERDE = "120,240,140";
// el color del agua según lo caliente (0 fría, azul; 1 hirviendo, rojo anaranjado)
export const colorAgua = (c) => c < 0.5 ? k.mezRgb("40,150,255", "90,200,235", c * 2) : k.mezRgb("255,150,40", "255,60,20", (c - 0.5) * 2);

// ---------------------------------------------------------------- la moneda de un euro
// En (x, y), de radio r; gira: de 0 a 1 una vuelta sobre su eje (se ve de canto); al: transparencia.
const monedaImg = (() => {
  const S = 256, l = lienzo(S), c = l.getContext("2d"), R = S / 2 - 4;
  c.translate(S / 2, S / 2);
  // el canto de oro
  let gr = c.createLinearGradient(-R, -R, R, R); gr.addColorStop(0, "#fff0a8"); gr.addColorStop(0.35, "#e0b440"); gr.addColorStop(0.7, "#a87818"); gr.addColorStop(1, "#ffe08a");
  c.beginPath(); c.arc(0, 0, R, 0, 6.2832); c.fillStyle = gr; c.fill();
  c.strokeStyle = "rgba(120,80,10,0.7)"; c.lineWidth = 4; c.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.2832; c.fillStyle = "rgba(255,250,210,0.8)"; c.beginPath(); c.arc(Math.cos(a) * R * 0.86, Math.sin(a) * R * 0.86, 5, 0, 6.2832); c.fill(); }
  // el centro de plata
  gr = c.createLinearGradient(-R, -R, R, R); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.4, "#c8ccd4"); gr.addColorStop(0.75, "#8a909c"); gr.addColorStop(1, "#e8ecf2");
  c.beginPath(); c.arc(0, 0, R * 0.66, 0, 6.2832); c.fillStyle = gr; c.fill();
  c.strokeStyle = "rgba(60,64,72,0.6)"; c.lineWidth = 3; c.stroke();
  c.font = `900 ${R * 0.95}px Figtree`; c.textAlign = "center"; c.textBaseline = "middle";
  c.fillStyle = "rgba(70,74,84,0.55)"; c.fillText("1", 4, 8); c.fillStyle = "#f4f6fa"; c.fillText("1", 0, 2);
  c.fillStyle = "rgba(255,255,255,0.5)"; c.beginPath(); c.ellipse(-R * 0.35, -R * 0.45, R * 0.3, R * 0.12, -0.6, 0, 6.2832); c.fill();
  return l;
})();
export function moneda(g, x, y, r, gira = 0, al = 1, ang = 0) {
  if (al <= 0.01 || r < 1) return;
  const sx = Math.cos(gira * 6.2832);
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  // el canto, cuando se ve de lado
  if (Math.abs(sx) < 0.98) { g.fillStyle = "#9a6c14"; g.beginPath(); g.ellipse(r * 0.08 * Math.sign(sx || 1), 0, Math.max(2, Math.abs(sx) * r), r, 0, 0, 6.2832); g.fill(); }
  g.scale(Math.max(0.04, Math.abs(sx)), 1);
  g.drawImage(monedaImg, -r, -r, r * 2, r * 2);
  g.restore();
}

// ---------------------------------------------------------------- el vapor
// Bocanadas blancas que suben desde (x, y) en un ancho w, cuánto: de 0 a 1. Todo sale de t.
const bocanada = (() => { const l = lienzo(128), c = l.getContext("2d"), gr = c.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,0.7)"); gr.addColorStop(0.5, "rgba(240,244,255,0.35)"); gr.addColorStop(1, "rgba(240,244,255,0)"); c.fillStyle = gr; c.fillRect(0, 0, 128, 128); return l; })();
export function vapor(g, t, x, y, w, cuanto, { alto = 700, sem = 1, n = 22, tam = 1 } = {}) {
  if (cuanto <= 0.01) return;
  const az = azar(sem);
  g.save();
  for (let i = 0; i < n; i++) {
    const f = az(), dx = (az() - 0.5) * w, vel = 0.35 + az() * 0.3, u = (t * vel + f) % 1, r = (60 + az() * 80) * tam * (0.5 + u * 1.4);
    const px = x + dx + Math.sin(t * 1.5 + f * 6) * 40 * u, py = y - u * alto;
    g.globalAlpha = cuanto * Math.sin(Math.PI * u) * 0.45;
    g.drawImage(bocanada, px - r, py - r, r * 2, r * 2);
  }
  g.restore();
}

// ---------------------------------------------------------------- la hucha
// Un cerdito rosa de perfil (mirando a la izquierda), centrado en (0, 0), de unos 700 px de largo. lleno: de 0 a 1,
// cuánto brilla por dentro (las monedas que tiene). bota: un saltito al recibir una moneda (0 a 1).
export function hucha(g, t, { bota = 0, brillo = 0 } = {}) {
  g.save(); g.translate(0, -bota * 18); g.scale(1 + bota * 0.03, 1 - bota * 0.03);
  const piel = (x0, y0, x1, y1) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, "#ffd0e0"); gr.addColorStop(0.45, "#ff8fb4"); gr.addColorStop(1, "#c84a78"); return gr; };
  // la sombra
  g.save(); g.globalAlpha = 0.35; g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, 300, 330, 40, 0, 0, 6.2832); g.fill(); g.restore();
  // las patas
  for (const x of [-200, -90, 110, 220]) { k.redondo(g, x - 45, 140, 90, 160, 36); g.fillStyle = piel(x - 45, 140, x + 45, 300); g.fill(); g.fillStyle = "#b83c68"; k.redondo(g, x - 45, 270, 90, 30, 14); g.fill(); }
  // el cuerpo
  g.beginPath(); g.ellipse(0, 0, 360, 250, 0, 0, 6.2832); g.fillStyle = piel(-200, -250, 200, 250); g.fill();
  if (brillo > 0.01) { g.save(); g.beginPath(); g.ellipse(0, 0, 360, 250, 0, 0, 6.2832); g.clip(); k.brillo(g, 0, 20, 900, ORO, 0.5 * brillo); g.restore(); }
  g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(-120, -150, 160, 50, -0.25, 0, 6.2832); g.fill();
  // la oreja
  g.beginPath(); g.moveTo(-210, -170); g.quadraticCurveTo(-200, -330, -110, -250); g.closePath(); g.fillStyle = piel(-210, -330, -110, -170); g.fill();
  g.beginPath(); g.moveTo(-190, -185); g.quadraticCurveTo(-185, -285, -130, -240); g.closePath(); g.fillStyle = "#e66a96"; g.fill();
  // el morro
  g.beginPath(); g.ellipse(-370, 20, 60, 85, 0, 0, 6.2832); g.fillStyle = piel(-430, -60, -310, 100); g.fill();
  g.fillStyle = "#a83060"; for (const y of [-10, 50]) { g.beginPath(); g.ellipse(-385, y, 12, 20, 0, 0, 6.2832); g.fill(); }
  // el ojo
  g.fillStyle = "#2a1020"; g.beginPath(); g.ellipse(-250, -70, 20, 26, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#fff"; g.beginPath(); g.arc(-244, -80, 7, 0, 6.2832); g.fill();
  // la ranura
  k.redondo(g, -70, -258, 150, 26, 12); g.fillStyle = "#5a1430"; g.fill();
  // el rabito
  g.strokeStyle = "#e0628e"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(355, -20); g.bezierCurveTo(430, -70, 430, 40, 390, 10); g.bezierCurveTo(370, -10, 400, -40, 420, -30); g.stroke();
  g.restore();
}
export const RANURA = [5, -250];

// ---------------------------------------------------------------- la lavadora
// De frente, centrada en (0, 0): 800 de ancho por 1040 de alto. La puerta, un círculo en PUERTA de radio 300.
// calor: el agua de 0 (fría, azul) a 1 (hirviendo); giro: lo que ha girado el tambor; vapor: cristal empañado (0 a 1);
// rueda: el ángulo de la rueda de programas (0 frío ... 1 noventa grados).
export const PUERTA = [0, 110], RUEDA = [250, -420];
const ROPA = (() => { const az = azar(808), l = []; const cols = ["#ff5a7a", "#ffd34a", "#5ad1ff", "#9b6bff", "#ffffff", "#3ad08a"]; for (let i = 0; i < 9; i++) l.push({ a: az() * 6.28, r: 60 + az() * 150, s: 70 + az() * 60, c: cols[i % cols.length], f: az() * 6 }); return l; })();
const agujeros = (() => { const l = lienzo(600), c = l.getContext("2d"); c.translate(300, 300);
  const gr = c.createRadialGradient(-40, -60, 20, 0, 0, 300); gr.addColorStop(0, "#c9d2dc"); gr.addColorStop(1, "#4a5260"); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 298, 0, 6.2832); c.fill();
  c.fillStyle = "rgba(20,24,30,0.6)"; for (let r = 40; r < 290; r += 34) { const n = Math.floor((r * 6.28) / 36); for (let i = 0; i < n; i++) { const a = (i / n) * 6.28 + r; c.beginPath(); c.arc(Math.cos(a) * r, Math.sin(a) * r, 6, 0, 6.2832); c.fill(); } }
  return l; })();
export const etiquetasRueda = ["frío", "30°", "40°", "60°", "90°"];
export function lavadora(g, t, { calor = 0, giro = 0, vaho = 0, rueda = 1, hierve = 0, temblor = 0 } = {}) {
  g.save();
  if (temblor > 0) g.translate(Math.sin(t * 61) * 8 * temblor, Math.sin(t * 47) * 5 * temblor);
  // la sombra en el suelo
  g.save(); g.globalAlpha = 0.45; g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, 540, 470, 50, 0, 0, 6.2832); g.fill(); g.restore();
  // el cuerpo blanco esmaltado
  k.redondo(g, -400, -520, 800, 1040, 40);
  let gr = g.createLinearGradient(-400, 0, 400, 0); gr.addColorStop(0, "#c9d0da"); gr.addColorStop(0.18, "#f7f9fc"); gr.addColorStop(0.7, "#eef1f6"); gr.addColorStop(1, "#aeb6c2");
  g.fillStyle = gr; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.08; g.drawImage(k.manchas, -400, -520, 800, 1040); g.restore();
  // el panel de arriba
  k.redondo(g, -370, -495, 740, 170, 26); gr = g.createLinearGradient(0, -495, 0, -325); gr.addColorStop(0, "#e9edf3"); gr.addColorStop(1, "#c4cbd6"); g.fillStyle = gr; g.fill();
  // el cajón del detergente
  k.redondo(g, -345, -470, 230, 110, 14); gr = g.createLinearGradient(0, -470, 0, -360); gr.addColorStop(0, "#f8fafc"); gr.addColorStop(1, "#cdd4de"); g.fillStyle = gr; g.fill(); g.strokeStyle = "rgba(80,90,110,0.4)"; g.lineWidth = 3; g.stroke();
  k.redondo(g, -300, -395, 140, 16, 8); g.fillStyle = "#9aa4b2"; g.fill();
  // la pantallita
  k.redondo(g, -80, -455, 170, 70, 12); g.fillStyle = "#0c1a24"; g.fill();
  const grados = Math.round(mez(0, 90, rueda) / 10) * 10;
  g.font = "800 48px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = `rgb(${colorAgua(calor)})`; g.fillText(grados < 20 ? "frío" : `${grados}°`, 5, -418);
  // la rueda de programas, con sus marcas de temperatura alrededor
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI * 0.85 + (i / 4) * Math.PI * 0.7 + Math.PI * 0.5 - Math.PI * 0.5, ax = RUEDA[0] + Math.cos(a - Math.PI / 2) * 0, ay = 0; void ax; void ay;
  }
  g.save(); g.translate(RUEDA[0], RUEDA[1]);
  for (let i = 0; i < 5; i++) {
    const a = mez(-2.4, -0.75, i / 4) + Math.PI / 2 - Math.PI / 2, x = Math.cos(a) * 95, y = Math.sin(a) * 95 + 0;
    g.font = "800 22px Figtree"; g.fillStyle = i === 0 ? "#2a7fd4" : i === 4 ? "#d4402a" : "#5a6474"; g.fillText(etiquetasRueda[i], x * 1.02 - 10, y + 8);
  }
  g.beginPath(); g.arc(0, 0, 62, 0, 6.2832);
  gr = g.createRadialGradient(-20, -24, 6, 0, 0, 64); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.6, "#c2cad6"); gr.addColorStop(1, "#7e8898"); g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(60,70,90,0.5)"; g.lineWidth = 3; g.stroke();
  const ar = mez(-2.4, -0.75, rueda);
  g.rotate(ar); k.redondo(g, 10, -9, 52, 18, 9); g.fillStyle = `rgb(${colorAgua(calor)})`; g.fill();
  g.restore();
  // el aro de la puerta (cromado)
  const [px, py] = PUERTA;
  g.save(); g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 30; g.shadowOffsetY = 12;
  g.beginPath(); g.arc(px, py, 330, 0, 6.2832); g.fillStyle = "#9aa4b2"; g.fill(); g.restore();
  g.beginPath(); g.arc(px, py, 330, 0, 6.2832); k.metal(g, px - 330, px + 330, ["#6d7684", "#f4f6fa", "#a8b1be", "#ffffff", "#5e6774"]);
  g.beginPath(); g.arc(px, py, 285, 0, 6.2832); g.fillStyle = "#1a1f28"; g.fill();
  // dentro: el tambor que gira, el agua, la ropa
  g.save(); g.beginPath(); g.arc(px, py, 270, 0, 6.2832); g.clip();
  g.save(); g.translate(px, py); g.rotate(giro); g.drawImage(agujeros, -300, -300); g.restore();
  const ca = colorAgua(calor);
  // la ropa que gira
  for (const r of ROPA) {
    const a = r.a + giro * 0.9, x = px + Math.cos(a) * r.r, y = py + Math.sin(a) * r.r * 0.9 + 30;
    g.save(); g.translate(x, y); g.rotate(a + r.f);
    g.beginPath(); g.moveTo(-r.s, 0); g.bezierCurveTo(-r.s * 0.8, -r.s * 0.7, -r.s * 0.1, -r.s * 0.4, r.s * 0.2, -r.s * 0.6); g.bezierCurveTo(r.s * 0.9, -r.s * 0.7, r.s * 1.1, r.s * 0.1, r.s * 0.7, r.s * 0.45); g.bezierCurveTo(r.s * 0.2, r.s * 0.8, -r.s * 0.6, r.s * 0.5, -r.s, 0); g.closePath();
    const rg = g.createLinearGradient(-r.s, -r.s, r.s, r.s); rg.addColorStop(0, r.c); rg.addColorStop(1, k.mezColor(r.c.length === 7 ? r.c : "#ffffff", "#000000", 0.45));
    g.fillStyle = rg; g.fill();
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 6; g.lineCap = "round";
    g.beginPath(); g.moveTo(-r.s * 0.6, -r.s * 0.1); g.quadraticCurveTo(0, r.s * 0.15, r.s * 0.5, -r.s * 0.2); g.stroke();
    g.beginPath(); g.moveTo(-r.s * 0.3, r.s * 0.3); g.quadraticCurveTo(r.s * 0.2, r.s * 0.2, r.s * 0.5, r.s * 0.35); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 4; g.beginPath(); g.moveTo(-r.s * 0.6, -r.s * 0.2); g.quadraticCurveTo(0, r.s * 0.05, r.s * 0.5, -r.s * 0.3); g.stroke();
    g.restore();
  }
  // el agua: la mitad de abajo, con su ola
  const nivel = py + 20;
  g.beginPath(); g.moveTo(px - 300, py + 320);
  for (let x = -300; x <= 300; x += 20) g.lineTo(px + x, nivel + Math.sin(x * 0.02 + t * 5) * 18 + Math.sin(x * 0.045 - t * 7) * 8 * (1 + hierve * 2));
  g.lineTo(px + 300, py + 320); g.closePath();
  const wg = g.createLinearGradient(0, nivel - 20, 0, py + 270); wg.addColorStop(0, `rgba(${k.mezRgb(ca, "255,255,255", 0.15)},0.92)`); wg.addColorStop(1, `rgba(${k.mezRgb(ca, "60,0,10", 0.45)},0.97)`);
  g.fillStyle = wg; g.fill();
  // las burbujas cuando hierve
  if (hierve > 0.01) {
    const az = azar(55);
    for (let i = 0; i < 60; i++) {
      const f = az(), x = px + (az() - 0.5) * 520, v = 0.8 + az(), u = (t * v + f) % 1, y = py + 260 - u * 260, r = 6 + az() * 16;
      g.fillStyle = `rgba(255,220,160,${0.25 * hierve * (1 - u)})`; g.beginPath(); g.arc(x, y, r * (0.8 + u * 1.5), 0, 6.2832); g.fill();
      g.strokeStyle = `rgba(255,250,230,${0.85 * hierve * (1 - u)})`; g.lineWidth = 4; g.stroke();
    }
    k.brillo(g, px, py + 140, 800, ca, 0.45 * calor * hierve);
  }
  g.restore();
  // el cristal: reflejo y vaho
  g.save(); g.beginPath(); g.arc(px, py, 270, 0, 6.2832); g.clip();
  if (vaho > 0.01) {
    const vg = g.createRadialGradient(px, py, 50, px, py, 280); vg.addColorStop(0, `rgba(255,240,235,${0.25 * vaho})`); vg.addColorStop(1, `rgba(255,250,250,${0.65 * vaho})`);
    g.fillStyle = vg; g.fillRect(px - 300, py - 300, 600, 600);
    // gotas
    const az = azar(77); g.fillStyle = `rgba(255,255,255,${0.5 * vaho})`;
    for (let i = 0; i < 40; i++) { const a = az() * 6.28, rr = 120 + az() * 140; g.beginPath(); g.arc(px + Math.cos(a) * rr, py + Math.sin(a) * rr, 3 + az() * 6, 0, 6.2832); g.fill(); }
  }
  g.globalCompositeOperation = "screen";
  const rf = g.createLinearGradient(px - 270, py - 270, px + 100, py + 100); rf.addColorStop(0, "rgba(255,255,255,0.35)"); rf.addColorStop(0.35, "rgba(255,255,255,0.05)"); rf.addColorStop(0.5, "rgba(255,255,255,0)");
  g.fillStyle = rf; g.fillRect(px - 300, py - 300, 600, 600);
  g.restore();
  g.lineWidth = 8; g.strokeStyle = "rgba(30,36,46,0.8)"; g.beginPath(); g.arc(px, py, 272, 0, 6.2832); g.stroke();
  // el tirador
  k.redondo(g, px + 300, py - 70, 50, 140, 20); k.metal(g, px + 300, px + 350, ["#6d7684", "#f4f6fa", "#a8b1be", "#ffffff", "#5e6774"]);
  // las patas
  for (const x of [-330, 330]) { k.redondo(g, x - 40, 515, 80, 30, 8); g.fillStyle = "#3a404a"; g.fill(); }
  g.restore();
}

// El lavadero: azulejos claros con una luz cálida, y el suelo.
const juntas = (() => { const l = lienzo(512), c = l.getContext("2d"); c.fillStyle = "#6fd0c4"; c.fillRect(0, 0, 512, 512); c.strokeStyle = "rgba(20,90,90,0.45)"; c.lineWidth = 4; for (let i = 0; i <= 512; i += 128) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 512); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(512, i); c.stroke(); } c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.2; c.drawImage(k.manchas, 0, 0, 512, 512); return l; })();
export function lavadero(g, t, tinte = "255,170,120") {
  // la pared de azulejos (en el mundo, alrededor de la lavadora)
  for (let x = -2048; x < 2048; x += 512) for (let y = -2048; y < 560; y += 512) g.drawImage(juntas, x, y, 512, 512);
  g.fillStyle = "#cfe3ec"; g.fillRect(-2048, 540, 4096, 4);
  // el suelo
  const sg = g.createLinearGradient(0, 540, 0, 1600); sg.addColorStop(0, "#c07a4a"); sg.addColorStop(1, "#5a2e1c"); g.fillStyle = sg; g.fillRect(-2048, 540, 4096, 1500);
  // la luz cálida y la sombra en las esquinas
  const lu = g.createRadialGradient(0, -200, 100, 0, 0, 1700); lu.addColorStop(0, `rgba(${tinte},0.3)`); lu.addColorStop(0.55, "rgba(20,40,70,0.15)"); lu.addColorStop(1, "rgba(10,20,40,0.65)");
  g.fillStyle = lu; g.fillRect(-2048, -2048, 4096, 4096);
}
