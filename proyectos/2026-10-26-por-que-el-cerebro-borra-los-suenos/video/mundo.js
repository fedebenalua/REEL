// Lo que comparten los planos: el mismo pez del sueño, la misma mañana, la cámara.
import * as k from "#kit";

const { azar, lienzo } = k;

export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);

// Arranca ya en marcha (pendiente natural) y acaba quieto.
export function camino2D(claves) {
  const Zs = k.curva(claves.map(([t, c]) => [t, Math.log(c[0])]), undefined, 0);
  const X = k.curva(claves.map(([t, c]) => [t, c[1]]), undefined, 0);
  const Y = k.curva(claves.map(([t, c]) => [t, c[2]]), undefined, 0);
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}

export function velo(g, al = 0.62) {
  if (al <= 0.01) return;
  g.save();
  sinVista(g);
  const vg = g.createLinearGradient(0, 140, 0, 640);
  vg.addColorStop(0, `rgba(8,4,18,${al})`);
  vg.addColorStop(0.55, `rgba(8,4,18,${al * 0.55})`);
  vg.addColorStop(1, "rgba(8,4,18,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 700);
  g.restore();
}

// ---------------------------------------------------------------- el pez del sueño
export function koi(g, x, y, L, ang, t, al = 1) {
  if (al < 0.012 || L < 2) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.globalAlpha *= al;
  const wag = Math.sin(t * 7.5) * 0.3;
  const h = L * 0.2;
  const cuerpo = () => {
    g.beginPath();
    g.moveTo(L * 0.46, 0);
    g.bezierCurveTo(L * 0.3, -h * 0.92, -L * 0.02, -h * 1.12, -L * 0.22, -h * 0.4);
    g.quadraticCurveTo(-L * 0.34, 0, -L * 0.22, h * 0.4);
    g.bezierCurveTo(-L * 0.02, h * 1.12, L * 0.3, h * 0.92, L * 0.46, 0);
    g.closePath();
  };
  g.fillStyle = "rgba(80,10,30,0.35)";
  g.beginPath(); g.ellipse(0, h * 0.85, L * 0.34, h * 0.28, 0, 0, 6.2832); g.fill();
  cuerpo();
  const bg = g.createLinearGradient(0, -h * 1.1, 0, h * 1.15);
  bg.addColorStop(0, "#fff3cf");
  bg.addColorStop(0.22, "#ffc56a");
  bg.addColorStop(0.5, "#ff4e66");
  bg.addColorStop(1, "#8e1234");
  g.fillStyle = bg;
  g.fill();
  g.save();
  cuerpo();
  g.clip();
  g.globalAlpha *= 0.55;
  g.strokeStyle = "rgba(90,16,36,0.55)";
  g.lineWidth = Math.max(1.2, L * 0.007);
  for (let i = -4; i <= 7; i++) for (let j = -2; j <= 2; j++) {
    const sx = -L * 0.18 + i * L * 0.075;
    const sy = j * h * 0.36 + ((i & 1) ? h * 0.16 : 0);
    g.beginPath(); g.arc(sx, sy, L * 0.05, 0.2, 2.6); g.stroke();
  }
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = al;
  const pan = g.createLinearGradient(0, h * 0.05, 0, h);
  pan.addColorStop(0, "rgba(255,244,224,0)");
  pan.addColorStop(1, "rgba(255,244,224,0.92)");
  g.fillStyle = pan;
  g.fillRect(-L, 0, L * 2, h * 1.2);
  g.fillStyle = "rgba(255,248,230,0.8)";
  g.beginPath(); g.ellipse(-L * 0.02, -h * 0.2, L * 0.075, h * 0.28, -0.45, 0, 6.2832); g.fill();
  g.beginPath(); g.ellipse(L * 0.14, h * 0.02, L * 0.05, h * 0.18, 0.4, 0, 6.2832); g.fill();
  const br = g.createLinearGradient(-L * 0.1, -h, L * 0.2, 0);
  br.addColorStop(0, "rgba(255,255,255,0.42)");
  br.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = br;
  g.beginPath(); g.ellipse(L * 0.05, -h * 0.42, L * 0.2, h * 0.2, -0.6, 0, 6.2832); g.fill();
  g.restore();
  // cola
  g.save();
  g.translate(-L * 0.26, 0);
  g.rotate(wag);
  g.beginPath();
  g.moveTo(L * 0.02, 0);
  g.quadraticCurveTo(-L * 0.16, -h * 0.2, -L * 0.36, -h * 1.05);
  g.quadraticCurveTo(-L * 0.14, -h * 0.15, -L * 0.2, 0);
  g.quadraticCurveTo(-L * 0.14, h * 0.15, -L * 0.36, h * 1.05);
  g.quadraticCurveTo(-L * 0.16, h * 0.2, L * 0.02, 0);
  g.closePath();
  const tg = g.createLinearGradient(0, -h, 0, h);
  tg.addColorStop(0, "#ffe0a0"); tg.addColorStop(0.5, "#ff5d72"); tg.addColorStop(1, "#b01840");
  g.fillStyle = tg; g.fill();
  g.restore();
  // aletas
  g.save();
  g.translate(L * 0.02, -h * 0.72);
  g.rotate(-0.4 + Math.sin(t * 5) * 0.08);
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(L * 0.02, -h * 0.7, -L * 0.16, -h * 0.42);
  g.quadraticCurveTo(-L * 0.04, -h * 0.1, L * 0.06, h * 0.05);
  g.fillStyle = "rgba(255,120,90,0.85)"; g.fill();
  g.restore();
  g.save();
  g.translate(L * 0.1, h * 0.28);
  g.rotate(0.7 + Math.sin(t * 6.2) * 0.18);
  g.beginPath(); g.ellipse(0, h * 0.22, L * 0.07, h * 0.32, 0.2, 0, 6.2832);
  g.fillStyle = "rgba(255,186,140,0.72)"; g.fill();
  g.restore();
  // ojo
  const ex = L * 0.3, ey = -h * 0.16, er = Math.max(2, L * 0.042);
  g.fillStyle = "#fff8ee"; g.beginPath(); g.arc(ex, ey, er, 0, 6.2832); g.fill();
  g.fillStyle = "#23160f"; g.beginPath(); g.arc(ex + er * 0.12, ey, er * 0.58, 0, 6.2832); g.fill();
  g.fillStyle = "#fff"; g.beginPath(); g.arc(ex + er * 0.28, ey - er * 0.28, er * 0.2, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- la mañana (la cama a la que vuelve el vídeo)
const azPolvo = azar(19);
const POLVO = Array.from({ length: 70 }, () => ({ x: azPolvo() * 1080, y: azPolvo() * 1920, s: 1.4 + azPolvo() * 2.6, f: azPolvo() * 6, v: 8 + azPolvo() * 22 }));

export function cuartoManana(g, t) {
  const bg = g.createLinearGradient(0, 0, 200, 1920);
  bg.addColorStop(0, "#f6d7b0");
  bg.addColorStop(0.45, "#e7b48a");
  bg.addColorStop(1, "#c4846a");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.18;
  g.drawImage(k.manchas, -100, -100, 1400, 2200);
  g.restore();
  // ventana
  g.save();
  g.translate(780, 780);
  k.redondo(g, -150, -220, 300, 420, 18);
  g.fillStyle = "#8ec8ff"; g.fill();
  const sol = g.createLinearGradient(0, -220, 0, 200);
  sol.addColorStop(0, "rgba(255,244,210,0.95)");
  sol.addColorStop(1, "rgba(255,190,120,0.15)");
  g.fillStyle = sol; g.fill();
  g.strokeStyle = "#f4e2c8"; g.lineWidth = 14; g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 8;
  g.beginPath(); g.moveTo(0, -206); g.lineTo(0, 186); g.moveTo(-136, -10); g.lineTo(136, -10); g.stroke();
  g.restore();
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 5; i++) {
    const x0 = 620 + i * 28;
    const haz = g.createLinearGradient(x0, 560, x0 - 180, 1500);
    haz.addColorStop(0, "rgba(255,236,190,0.28)");
    haz.addColorStop(1, "rgba(255,236,190,0)");
    g.fillStyle = haz;
    g.beginPath(); g.moveTo(x0, 560); g.lineTo(x0 + 36, 560); g.lineTo(x0 - 80, 1560); g.lineTo(x0 - 200, 1560); g.closePath(); g.fill();
  }
  g.restore();
  // cama
  g.fillStyle = "#6b3a4a";
  k.redondo(g, 120, 1180, 840, 520, 36); g.fill();
  const sab = g.createLinearGradient(120, 1180, 120, 1700);
  sab.addColorStop(0, "#fff8f2"); sab.addColorStop(1, "#f0c9c0");
  g.fillStyle = sab;
  k.redondo(g, 150, 1240, 780, 460, 28); g.fill();
  g.fillStyle = "#fff";
  k.redondo(g, 210, 1120, 280, 170, 40); g.fill();
  g.fillStyle = "#f7d2dc";
  k.redondo(g, 520, 1140, 240, 150, 36); g.fill();
  // mesilla y papel en blanco
  g.fillStyle = "#8d5a3c";
  k.redondo(g, 40, 1360, 150, 220, 12); g.fill();
  g.fillStyle = "#f7f1e6";
  k.redondo(g, 55, 1280, 120, 90, 6); g.fill();
  for (const p of POLVO) {
    const y = (p.y - t * p.v + 4000) % 1920;
    g.fillStyle = `rgba(255,250,240,${0.25 + 0.3 * Math.sin(t * 1.4 + p.f)})`;
    g.fillRect(p.x, y, p.s, p.s);
  }
}

// ---------------------------------------------------------------- ojo enorme
export function ojo(g, cx, cy, R, t, dart) {
  g.save();
  g.translate(cx, cy);
  // piel
  const piel = g.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 2.2);
  piel.addColorStop(0, "#e8b496");
  piel.addColorStop(0.55, "#c48468");
  piel.addColorStop(1, "#3a1c22");
  g.fillStyle = piel;
  g.fillRect(-R * 3.4, -R * 3.4, R * 6.8, R * 6.8);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.28;
  g.drawImage(k.manchas, -R * 2, -R * 2, R * 4, R * 4);
  g.restore();
  const dx = Math.sin(t * 9.5) * dart;
  const dy = Math.sin(t * 4.2) * dart * 0.25;
  // cuenca
  g.fillStyle = "#f3e6dc";
  g.beginPath(); g.ellipse(0, 10, R * 1.15, R * 0.72, 0, 0, 6.2832); g.fill();
  g.save();
  g.beginPath(); g.ellipse(0, 8, R * 1.02, R * 0.58, 0, 0, 6.2832); g.clip();
  g.translate(dx, dy);
  // blanco
  const bl = g.createRadialGradient(-R * 0.2, -R * 0.2, R * 0.1, 0, 0, R);
  bl.addColorStop(0, "#fff"); bl.addColorStop(1, "#d9c2c6");
  g.fillStyle = bl;
  g.beginPath(); g.arc(0, 0, R * 0.92, 0, 6.2832); g.fill();
  // iris
  const ir = g.createRadialGradient(0, 0, R * 0.05, 0, 0, R * 0.48);
  ir.addColorStop(0, "#1a3a36");
  ir.addColorStop(0.45, "#1f8f86");
  ir.addColorStop(0.78, "#e8b15a");
  ir.addColorStop(1, "#6a3a16");
  g.fillStyle = ir;
  g.beginPath(); g.arc(0, 0, R * 0.46, 0, 6.2832); g.fill();
  g.save();
  g.globalAlpha = 0.45;
  g.strokeStyle = "rgba(10,40,36,0.7)";
  g.lineWidth = R * 0.012;
  for (let i = 0; i < 18; i++) {
    g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(i) * R * 0.46, Math.sin(i * 1.7) * R * 0.46); g.stroke();
  }
  g.restore();
  g.fillStyle = "#140c09";
  g.beginPath(); g.arc(0, 0, R * 0.2, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.beginPath(); g.arc(R * 0.12, -R * 0.12, R * 0.06, 0, 6.2832); g.fill();
  g.restore();
  // párpados
  g.fillStyle = "#d9a184";
  g.beginPath();
  g.moveTo(-R * 1.2, 0);
  g.quadraticCurveTo(0, -R * 0.95, R * 1.2, 0);
  g.quadraticCurveTo(0, -R * 0.15, -R * 1.2, 0);
  g.fill();
  g.fillStyle = "#c48468";
  g.beginPath();
  g.moveTo(-R * 1.15, R * 0.08);
  g.quadraticCurveTo(0, R * 0.85, R * 1.15, R * 0.08);
  g.quadraticCurveTo(0, R * 0.22, -R * 1.15, R * 0.08);
  g.fill();
  // pliegue
  g.strokeStyle = "rgba(90,40,40,0.45)";
  g.lineWidth = R * 0.03;
  g.beginPath(); g.moveTo(-R, -R * 0.35); g.quadraticCurveTo(0, -R * 0.85, R, -R * 0.35); g.stroke();
  // pestañas
  g.strokeStyle = "#2a1614";
  g.lineWidth = Math.max(2, R * 0.018);
  g.lineCap = "round";
  for (let i = -6; i <= 6; i++) {
    const x = i * R * 0.16;
    const y = -R * 0.08 + (i * i) * R * 0.012;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + i * 4, y - R * 0.28, x + i * 8, y - R * 0.42); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- esfera de cristal
export function esfera(g, x, y, r, t, dentro, luz = 1) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.beginPath(); g.ellipse(0, r * 0.92, r * 0.72, r * 0.16, 0, 0, 6.2832); g.fill();
  const gl = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
  gl.addColorStop(0, `rgba(255,255,255,${0.55 * luz})`);
  gl.addColorStop(0.35, `rgba(186,220,255,${0.18 * luz})`);
  gl.addColorStop(1, "rgba(40,60,90,0.45)");
  g.fillStyle = gl;
  g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill();
  g.save();
  g.beginPath(); g.arc(0, 0, r * 0.86, 0, 6.2832); g.clip();
  if (dentro) dentro(g, r, t);
  g.restore();
  g.strokeStyle = `rgba(220,240,255,${0.45 + 0.2 * luz})`;
  g.lineWidth = 3;
  g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath(); g.ellipse(-r * 0.38, -r * 0.38, r * 0.16, r * 0.28, -0.7, 0, 6.2832); g.fill();
  g.restore();
}

export function taza(g, r) {
  g.save();
  g.translate(0, r * 0.15);
  g.fillStyle = "#f4efe6";
  k.redondo(g, -r * 0.28, -r * 0.22, r * 0.5, r * 0.42, 8); g.fill();
  g.fillStyle = "#6b3a28";
  g.fillRect(-r * 0.2, -r * 0.22, r * 0.34, r * 0.12);
  g.strokeStyle = "#f4efe6"; g.lineWidth = r * 0.06;
  g.beginPath(); g.arc(r * 0.28, 0, r * 0.14, -1.2, 1.2); g.stroke();
  // vapor de café, corto
  g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-r * 0.05, -r * 0.28); g.quadraticCurveTo(r * 0.05, -r * 0.4, 0, -r * 0.5); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- cabeza de perfil, mirando a la izquierda
export function cabeza(g, x, y, esc, frenteOsc, t) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  const sil = () => {
    g.beginPath();
    g.moveTo(78, 210);
    g.lineTo(70, 150);
    g.quadraticCurveTo(120, 120, 128, 60);
    g.quadraticCurveTo(130, -10, 70, -40);
    g.quadraticCurveTo(20, -58, 0, -20);
    g.quadraticCurveTo(-8, 0, -6, 18);
    g.lineTo(-36, 36);
    g.lineTo(-58, 58);
    g.quadraticCurveTo(-48, 70, -28, 66);
    g.lineTo(-22, 78);
    g.quadraticCurveTo(-40, 96, -22, 112);
    g.quadraticCurveTo(-4, 128, 18, 120);
    g.lineTo(36, 150);
    g.lineTo(48, 210);
    g.closePath();
  };
  sil();
  const pg = g.createLinearGradient(-60, -40, 120, 160);
  pg.addColorStop(0, "#3a241c");
  pg.addColorStop(0.45, "#c48a6c");
  pg.addColorStop(1, "#6a4034");
  g.fillStyle = pg;
  g.fill();
  g.save();
  sil(); g.clip();
  // teatro interior, hacia la nuca
  const tg = g.createRadialGradient(70, 40, 10, 70, 40, 150);
  tg.addColorStop(0, `rgba(255,210,140,${0.95})`);
  tg.addColorStop(0.4, "rgba(255,70,110,0.75)");
  tg.addColorStop(1, "rgba(20,0,30,0)");
  g.fillStyle = tg;
  g.fillRect(-80, -80, 280, 320);
  koi(g, 78 + Math.sin(t) * 6, 48, 90, -0.2 + Math.sin(t * 2) * 0.1, t, 0.95);
  // la frente, apagada, tapa el teatro
  const fg = g.createLinearGradient(-70, 0, 40, 0);
  fg.addColorStop(0, `rgba(6,4,16,${0.55 + frenteOsc * 0.45})`);
  fg.addColorStop(0.55, `rgba(6,4,16,${0.15 + frenteOsc * 0.55})`);
  fg.addColorStop(1, "rgba(6,4,16,0)");
  g.fillStyle = fg;
  g.fillRect(-90, -80, 160, 320);
  g.restore();
  // oreja
  g.beginPath(); g.ellipse(96, 48, 16, 26, 0.2, 0, 6.2832);
  g.fillStyle = "#b87868"; g.fill();
  g.beginPath(); g.ellipse(96, 48, 8, 14, 0.2, 0, 6.2832);
  g.fillStyle = "#8a5048"; g.fill();
  g.restore();
}

// ---------------------------------------------------------------- ratón dormido
export function raton(g, x, y, esc, t) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  const resp = 1 + Math.sin(t * 2.2) * 0.02;
  g.scale(1, resp);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath(); g.ellipse(10, 78, 120, 18, 0, 0, 6.2832); g.fill();
  // cola
  g.strokeStyle = "#c48a96"; g.lineWidth = 7; g.lineCap = "round";
  g.beginPath(); g.moveTo(-70, 40); g.quadraticCurveTo(-140, 80, -180, 20); g.quadraticCurveTo(-200, -10, -160, -30); g.stroke();
  // cuerpo
  const cg = g.createLinearGradient(0, -40, 0, 70);
  cg.addColorStop(0, "#a88870"); cg.addColorStop(0.45, "#6e5140"); cg.addColorStop(1, "#3c2a22");
  g.fillStyle = cg;
  g.beginPath(); g.ellipse(10, 20, 120, 58, -0.1, 0, 6.2832); g.fill();
  g.save();
  g.beginPath(); g.ellipse(10, 20, 120, 58, -0.1, 0, 6.2832); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35;
  g.drawImage(k.red, -140, -50, 300, 160);
  g.restore();
  // tripa
  g.fillStyle = "#e6d2c0";
  g.beginPath(); g.ellipse(20, 42, 70, 28, -0.1, 0, Math.PI); g.fill();
  // cabeza
  g.fillStyle = "#7a5b48";
  g.beginPath(); g.ellipse(108, 8, 48, 40, 0.2, 0, 6.2832); g.fill();
  // oreja
  g.fillStyle = "#6e5140";
  g.beginPath(); g.ellipse(96, -28, 22, 26, -0.4, 0, 6.2832); g.fill();
  g.fillStyle = "#e7a0b4";
  g.beginPath(); g.ellipse(96, -26, 12, 16, -0.4, 0, 6.2832); g.fill();
  // ojo cerrado
  g.strokeStyle = "#2a1c18"; g.lineWidth = 3;
  g.beginPath(); g.moveTo(124, 2); g.quadraticCurveTo(134, 8, 146, 2); g.stroke();
  // nariz
  g.fillStyle = "#2a1c18";
  g.beginPath(); g.arc(152, 16, 6, 0, 6.2832); g.fill();
  // bigotes
  g.strokeStyle = "rgba(255,236,220,0.8)"; g.lineWidth = 1.6;
  for (let i = -1; i <= 1; i++) {
    g.beginPath(); g.moveTo(148, 16 + i * 4); g.lineTo(190, 8 + i * 12); g.stroke();
  }
  // pata
  g.fillStyle = "#e6d2c0";
  g.beginPath(); g.ellipse(70, 62, 16, 10, 0.3, 0, 6.2832); g.fill();
  g.restore();
}

// Una canica con un camino dentro (lo aprendido) o con el pez.
export function canica(g, x, y, r, t, tipo, al = 1) {
  esfera(g, x, y, r, t, (gg, rr) => {
    if (tipo === "camino") {
      gg.strokeStyle = `rgba(255,220,120,${0.95 * al})`;
      gg.lineWidth = rr * 0.08;
      gg.lineCap = "round";
      gg.beginPath();
      gg.moveTo(-rr * 0.4, rr * 0.2);
      gg.quadraticCurveTo(-rr * 0.1, -rr * 0.4, rr * 0.15, -rr * 0.05);
      gg.quadraticCurveTo(rr * 0.35, rr * 0.25, rr * 0.05, rr * 0.4);
      gg.stroke();
      gg.fillStyle = `rgba(255,240,180,${al})`;
      gg.beginPath(); gg.arc(rr * 0.05, rr * 0.4, rr * 0.07, 0, 6.2832); gg.fill();
    } else {
      koi(gg, 0, 8, rr * 1.15, -0.15 + Math.sin(t * 2) * 0.08, t, al);
    }
  }, 0.7 + 0.3 * al);
}

const azN = azar(41);
const NEUR = Array.from({ length: 9 }, (_, i) => {
  const a = -1.2 + i * 0.32;
  return { a, largo: 220 + azN() * 120, rama: 0.4 + azN() * 0.4, lado: azN() < 0.5 ? 1 : -1 };
});
export function neuronas(g, x, y, t, apagadas) {
  g.save();
  g.translate(x, y);
  const luz = 1 - apagadas;
  for (const n of NEUR) {
    const x2 = Math.cos(n.a) * n.largo, y2 = Math.sin(n.a) * n.largo;
    const pul = 0.65 + 0.35 * Math.sin(t * 5 + n.a * 3);
    g.strokeStyle = `rgba(${Math.round(180 + 60 * luz)},${Math.round(120 + 80 * luz)},${Math.round(40 + 20 * luz)},${0.25 + 0.7 * luz * pul})`;
    g.lineWidth = 4 + 3 * luz;
    g.lineCap = "round";
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(x2 * 0.5 + 20, y2 * 0.4, x2, y2); g.stroke();
    const rx = x2 + Math.cos(n.a + n.lado) * 50, ry = y2 + Math.sin(n.a + n.lado * n.rama) * 40;
    g.beginPath(); g.moveTo(x2, y2); g.lineTo(rx, ry); g.stroke();
    g.fillStyle = g.strokeStyle;
    g.beginPath(); g.arc(x2, y2, 7 + 4 * luz, 0, 6.2832); g.fill();
  }
  g.fillStyle = `rgba(255,210,120,${0.4 + 0.6 * luz})`;
  g.beginPath(); g.arc(0, 0, 16, 0, 6.2832); g.fill();
  g.restore();
  if (luz > 0.05) k.brillo(g, x, y, 280, "255,200,80", 0.35 * luz);
}

// ---------------------------------------------------------------- mano que intenta coger
export function mano(g, x, y, esc, cierra) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  const piel = "#f0b89a", sombra = "#c4846a", una = "#ffe0cc";
  // palma
  g.fillStyle = sombra;
  k.redondo(g, -70, 10, 150, 170, 40); g.fill();
  g.fillStyle = piel;
  k.redondo(g, -60, 0, 140, 160, 36); g.fill();
  // dedos
  const dedos = [-46, -12, 24, 58];
  dedos.forEach((dx, i) => {
    const alta = -150 + cierra * (70 + i * 8);
    g.save();
    g.translate(dx, 10);
    g.rotate(cierra * (i - 1.5) * 0.18);
    g.fillStyle = sombra;
    k.redondo(g, -16, alta, 36, 150 - cierra * 30, 16); g.fill();
    g.fillStyle = piel;
    k.redondo(g, -14, alta + 4, 32, 142 - cierra * 30, 14); g.fill();
    g.fillStyle = una;
    g.fillRect(-8, alta + 18, 18, 10);
    g.restore();
  });
  // pulgar
  g.save();
  g.translate(-70, 50);
  g.rotate(-0.6 + cierra * 0.5);
  g.fillStyle = piel;
  k.redondo(g, -16, -70, 34, 100, 16); g.fill();
  g.restore();
  g.restore();
}

export function dedo(g, x, y, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.fillStyle = "#c4846a";
  k.redondo(g, -22, -18, 210, 48, 22); g.fill();
  g.fillStyle = "#f0b89a";
  k.redondo(g, -18, -22, 200, 44, 20); g.fill();
  g.fillStyle = "#ffe0cc";
  g.beginPath(); g.ellipse(170, 0, 22, 16, 0, 0, 6.2832); g.fill();
  g.restore();
}

// Lienzo reutilizable dentro de un mismo hilo: se limpia en cada fotograma.
export const capa = lienzo(1080, 1920);
