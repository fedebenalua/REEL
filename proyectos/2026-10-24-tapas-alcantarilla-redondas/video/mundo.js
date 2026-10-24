// La tapa de alcantarilla de este vídeo: la misma pieza de hierro en la calle, en el giro y en el pozo.
import * as k from "#kit";

const { azar, red, manchas } = k;

export function vista(g, Z, cx, cy) {
  g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
}
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);

// Cámara que pasa por [t, z, x, y]. Dos claves iguales al final la dejan quieta.
export function camara(claves) {
  const Z = k.curva(claves.map((c) => [c[0], Math.log(c[1])]));
  const X = k.curva(claves.map((c) => [c[0], c[2]]));
  const Y = k.curva(claves.map((c) => [c[0], c[3]]));
  return (t) => ({ z: Math.exp(Z(t)), x: X(t), y: Y(t) });
}

export function velo(g, al = 0.72) {
  sinVista(g);
  const vg = g.createLinearGradient(0, 80, 0, 760);
  vg.addColorStop(0, `rgba(6,8,14,${al})`);
  vg.addColorStop(0.45, `rgba(6,8,14,${al * 0.78})`);
  vg.addColorStop(1, "rgba(6,8,14,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 820);
}

const az = azar(10);
const GRIETAS = Array.from({ length: 18 }, () => ({
  x: (az() - 0.5) * 1600,
  y: (az() - 0.5) * 1400,
  L: 40 + az() * 160,
  a: az() * 3.14,
  w: 1.2 + az() * 2.2,
}));
const CHARCOS = Array.from({ length: 7 }, () => ({
  x: (az() - 0.5) * 1200,
  y: (az() - 0.5) * 1000,
  rx: 50 + az() * 90,
  ry: 16 + az() * 28,
}));

function hierroRadial(g, x, y, r) {
  const hg = g.createRadialGradient(x - r * 0.35, y - r * 0.42, r * 0.1, x, y, r);
  hg.addColorStop(0, "#d5dbe3");
  hg.addColorStop(0.35, "#8b939e");
  hg.addColorStop(0.72, "#4a515b");
  hg.addColorStop(1, "#2a3038");
  g.fillStyle = hg;
}

// Asfalto de noche, mojado, con la farola en ámbar. El agujero va en el origen.
export function asfalto(g, t) {
  g.fillStyle = "#1a1e26";
  g.fillRect(-1600, -1200, 3200, 2600);
  const suelo = g.createLinearGradient(0, -800, 0, 900);
  suelo.addColorStop(0, "#2a3140");
  suelo.addColorStop(0.4, "#232830");
  suelo.addColorStop(1, "#14171c");
  g.fillStyle = suelo;
  g.fillRect(-1600, -1200, 3200, 2600);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.55;
  g.drawImage(red, -900, -700, 1800, 1600);
  g.drawImage(red, 700, -700, 1800, 1600);
  g.restore();
  g.save();
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.08;
  g.drawImage(manchas, -800, -600, 1700, 1400);
  g.restore();
  g.strokeStyle = "rgba(20,22,28,0.85)";
  g.lineCap = "round";
  for (const q of GRIETAS) {
    g.lineWidth = q.w;
    g.beginPath();
    g.moveTo(q.x, q.y);
    g.lineTo(q.x + Math.cos(q.a) * q.L, q.y + Math.sin(q.a) * q.L);
    g.stroke();
  }
  // acera y bordillo, arriba, para que la calle no sea un tablero
  g.fillStyle = "#3a342c";
  g.fillRect(-1600, -1200, 3200, 520);
  g.fillStyle = "#c4552a";
  g.fillRect(-1600, -690, 3200, 16);
  g.fillStyle = "#6a6258";
  g.fillRect(-1600, -674, 3200, 22);
  // línea amarilla
  g.fillStyle = "#e2b043";
  for (let y = -200; y < 1100; y += 150) g.fillRect(430, y, 28, 80);
  // charcos
  for (const c of CHARCOS) {
    if (c.x * c.x + c.y * c.y < 360 * 360) continue;
    g.beginPath();
    g.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, 7);
    g.fillStyle = "rgba(90,140,180,0.16)";
    g.fill();
  }
  // farola
  const fx = -520, fy = -180;
  g.save();
  g.globalCompositeOperation = "lighter";
  const fg = g.createRadialGradient(fx, fy, 10, fx, fy, 520);
  fg.addColorStop(0, "rgba(255,186,90,0.45)");
  fg.addColorStop(1, "rgba(255,186,90,0)");
  g.fillStyle = fg;
  g.beginPath();
  g.arc(fx, fy, 520, 0, 7);
  g.fill();
  g.restore();
  g.fillStyle = "#1c140c";
  g.fillRect(fx - 8, fy, 16, 420);
  g.beginPath();
  g.ellipse(fx, fy, 46, 18, 0, 0, 7);
  g.fillStyle = "#ffe0a8";
  g.fill();
}

// Tapa redonda. lift: píxeles hacia arriba (aún no apoyada). ang: giro del dibujo.
export function tapaRedonda(g, lift, ang, opt = {}) {
  const R = 300;
  const hueco = R * 0.78;
  const marco = R * 1.08;
  // el hueco, naranja
  g.beginPath();
  g.arc(0, 0, hueco, 0, 7);
  const pg = g.createRadialGradient(0, 40, 20, 0, 0, hueco);
  pg.addColorStop(0, "#ffd7a4");
  pg.addColorStop(0.45, "#f07828");
  pg.addColorStop(1, "#6a220c");
  g.fillStyle = pg;
  g.fill();
  // marco de acero
  g.beginPath();
  g.arc(0, 0, marco, 0, 7);
  g.arc(0, 0, hueco, 0, 7, true);
  const mg = g.createLinearGradient(-marco, 0, marco, 0);
  mg.addColorStop(0, "#3e4550");
  mg.addColorStop(0.4, "#9aa3af");
  mg.addColorStop(0.7, "#5c6570");
  mg.addColorStop(1, "#2c3138");
  g.fillStyle = mg;
  g.fill();
  // tornillos del marco
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 6.2832 - 0.4;
    const rr = (marco + hueco) / 2;
    g.beginPath();
    g.arc(Math.cos(a) * rr, Math.sin(a) * rr, 7, 0, 7);
    g.fillStyle = "#1c2026";
    g.fill();
  }
  // sombra de la tapa, si está en el aire
  if (lift > 2) {
    g.save();
    g.globalAlpha = 0.35 * Math.min(1, lift / 40);
    g.beginPath();
    g.ellipse(18, 26, R * 0.92, R * 0.28, 0, 0, 7);
    g.fillStyle = "#000";
    g.fill();
    g.restore();
  }
  if (opt.reborde) {
    g.beginPath();
    g.arc(0, 0, (marco + hueco) / 2, 0, 7);
    g.strokeStyle = `rgba(255,196,70,${0.35 + 0.55 * opt.reborde})`;
    g.lineWidth = 18;
    g.stroke();
  }
  // la tapa (el hueco y el marco se quedan: solo se mueve el hierro)
  g.save();
  g.translate(opt.dx || 0, -lift);
  g.rotate(ang);
  g.beginPath();
  g.arc(0, 0, R * 0.98, 0, 7);
  hierroRadial(g, 0, 0, R);
  g.fill();
  g.save();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.45;
  g.drawImage(manchas, -R, -R, R * 2, R * 2);
  g.restore();
  // surcos
  g.strokeStyle = "rgba(20,24,30,0.55)";
  g.lineWidth = 8;
  for (const rr of [0.42, 0.62, 0.8]) {
    g.beginPath();
    g.arc(0, 0, R * rr, 0, 7);
    g.stroke();
  }
  g.strokeStyle = "rgba(255,255,255,0.18)";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(0, 0, R * 0.62, 0.6, 2.2);
  g.stroke();
  // dos agujeros de gancho
  g.fillStyle = "#12151a";
  for (const s of [-1, 1]) {
    g.beginPath();
    g.ellipse(s * 78, 8, 16, 28, 0, 0, 7);
    g.fill();
  }
  // brillo
  g.save();
  g.globalCompositeOperation = "screen";
  const bg = g.createRadialGradient(-90, -110, 10, -40, -40, R);
  bg.addColorStop(0, "rgba(255,255,255,0.28)");
  bg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = bg;
  g.beginPath();
  g.arc(0, 0, R * 0.98, 0, 7);
  g.fill();
  g.restore();
  if (opt.anilloDorado) {
    g.beginPath();
    g.arc(0, 0, R * 0.98, 0, 7);
    g.arc(0, 0, R * 0.86, 0, 7, true);
    g.fillStyle = `rgba(255,196,70,${0.35 + 0.4 * opt.anilloDorado})`;
    g.fill();
  }
  g.restore();
  // el reborde que asoma cuando la tapa ya apoya: un aro justo bajo el canto
  if (lift < 8) {
    const a = 1 - lift / 8;
    g.beginPath();
    g.arc(0, 0, R * 1.02, 0, 7);
    g.strokeStyle = `rgba(255,214,140,${0.35 * a})`;
    g.lineWidth = 6;
    g.stroke();
  }
}

export function golpe(g, u) {
  if (u <= 0 || u >= 1) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(255,196,120,${(1 - u) * 0.85})`;
  g.lineWidth = 16 * (1 - u) + 3;
  g.beginPath();
  g.arc(0, 0, 300 + u * 180, 0, 7);
  g.stroke();
  g.restore();
}

// Agujero cuadrado, visto desde arriba. Lado del hueco 540. La losa mide 640 de canto:
// no cabe de lado (sobra) y sí cabe por la diagonal (540 × √2 ≈ 764).
export const LADO = 540;
export const LOSA = 640;

export function huecoCuadrado(g) {
  const L = LADO;
  g.beginPath();
  g.rect(-L / 2, -L / 2, L, L);
  const pg = g.createLinearGradient(0, -L / 2, 0, L / 2);
  pg.addColorStop(0, "#ffb06a");
  pg.addColorStop(0.5, "#e25a16");
  pg.addColorStop(1, "#4a1608");
  g.fillStyle = pg;
  g.fill();
}

export function marcoCuadrado(g) {
  const L = LADO, marco = 72;
  g.beginPath();
  g.rect(-L / 2 - marco, -L / 2 - marco, L + marco * 2, L + marco * 2);
  g.rect(-L / 2, -L / 2, L, L);
  const mg = g.createLinearGradient(-L, -L, L, L);
  mg.addColorStop(0, "#3a414c");
  mg.addColorStop(0.5, "#b7c0cc");
  mg.addColorStop(1, "#2a3038");
  g.fillStyle = mg;
  g.fill("evenodd");
}

export function lucesCuadrado(g, o) {
  const L = LADO;
  if (o.diag > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,176,70,${0.9 * o.diag})`;
    g.lineWidth = 46;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-L / 2 + 18, -L / 2 + 18);
    g.lineTo(L / 2 - 18, L / 2 - 18);
    g.stroke();
    g.restore();
  }
  if (o.lado > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(120,220,255,${0.95 * o.lado})`;
    g.lineWidth = 48;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-L / 2 + 24, L / 2 - 6);
    g.lineTo(L / 2 - 24, L / 2 - 6);
    g.stroke();
    g.restore();
  }
}

// Losa de canto. ang 0 = paralela al lado (no cabe). ang = PI/4 = sobre la diagonal.
// hundir 0..1: se va por el agujero.
// La tapa cuadrada vista de canto, desde arriba: una barra. De lado no cabe; en diagonal, sí.
export function losa(g, ang, hundir, aviso = 0) {
  const largo = LOSA;
  const grosor = 96;
  const s = 1 - hundir * 0.78;
  const al = hundir > 0.84 ? Math.max(0, 1 - (hundir - 0.84) / 0.16) : 1;
  g.save();
  g.rotate(ang);
  g.scale(s, s * (1 - hundir * 0.35));
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.4)";
  k.redondo(g, -largo / 2 + 8, -grosor / 2 + 16, largo, grosor, 20);
  g.fill();
  k.redondo(g, -largo / 2, -grosor / 2, largo, grosor, 22);
  const lg = g.createLinearGradient(0, -grosor / 2, 0, grosor / 2);
  lg.addColorStop(0, "#f4f7fb");
  lg.addColorStop(0.45, "#9aa3ae");
  lg.addColorStop(1, "#3a424c");
  g.fillStyle = lg;
  g.fill();
  g.save();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.35;
  g.drawImage(manchas, -largo / 2, -grosor, largo, grosor * 2);
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.35)";
  k.redondo(g, -largo / 2 + 18, -grosor / 2 + 8, largo - 36, 16, 8);
  g.fill();
  if (aviso > 0.04) {
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const signo of [-1, 1]) {
      const rg = g.createRadialGradient(signo * largo / 2, 0, 6, signo * largo / 2, 0, 80);
      rg.addColorStop(0, `rgba(255,50,40,${0.9 * aviso})`);
      rg.addColorStop(1, "rgba(255,50,40,0)");
      g.fillStyle = rg;
      g.beginPath();
      g.arc(signo * largo / 2, 0, 80, 0, 7);
      g.fill();
    }
    g.restore();
  }
  g.restore();
}

export function calibre(g, ang, r, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  for (const extra of [0, Math.PI]) {
    const a = ang + extra;
    g.save();
    g.translate(Math.cos(a) * (r + 36), Math.sin(a) * (r + 36));
    g.rotate(a);
    k.redondo(g, -20, -78, 78, 156, 18);
    const cg = g.createLinearGradient(0, -78, 0, 78);
    cg.addColorStop(0, "#ffe08a");
    cg.addColorStop(0.5, "#e09a18");
    cg.addColorStop(1, "#a86a08");
    g.fillStyle = cg;
    g.fill();
    g.fillStyle = "#fff6d4";
    g.fillRect(46, -58, 14, 116);
    g.restore();
  }
  g.restore();
}

export function olla(g, baja, vaporT) {
  // pared de cocina
  g.fillStyle = "#2a1210";
  g.fillRect(-1400, -1200, 2800, 2600);
  const pared = g.createLinearGradient(0, -600, 0, 700);
  pared.addColorStop(0, "#4a221c");
  pared.addColorStop(0.55, "#2a1412");
  pared.addColorStop(1, "#140c0c");
  g.fillStyle = pared;
  g.fillRect(-1400, -1200, 2800, 2600);
  // luz de ventana
  g.save();
  g.globalCompositeOperation = "lighter";
  const vg = g.createRadialGradient(-180, -80, 20, -180, -80, 480);
  vg.addColorStop(0, "rgba(255,196,120,0.35)");
  vg.addColorStop(1, "rgba(255,196,120,0)");
  g.fillStyle = vg;
  g.fillRect(-1400, -1200, 2800, 2600);
  g.restore();
  // encimera
  g.fillStyle = "#3a2416";
  g.fillRect(-1400, 280, 2800, 900);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.35;
  g.drawImage(red, -800, 200, 1600, 500);
  g.restore();
  g.fillStyle = "#8a5a32";
  g.fillRect(-1400, 210, 2800, 18);
  // cuerpo de la olla
  const cx = 0, cy = 80, rx = 250, ry = 210;
  g.beginPath();
  g.ellipse(cx, cy + 40, rx, ry * 0.92, 0, 0, 7);
  const og = g.createLinearGradient(-rx, 0, rx, 0);
  og.addColorStop(0, "#5c656e");
  og.addColorStop(0.35, "#e8eef4");
  og.addColorStop(0.7, "#9aa4b0");
  og.addColorStop(1, "#3e464e");
  g.fillStyle = og;
  g.fill();
  // interior, solo mientras la tapa no lo tapa
  if (baja < -24) {
  g.beginPath();
  g.ellipse(cx, cy - 20, rx * 0.78, ry * 0.42, 0, 0, 7);
  const ig = g.createRadialGradient(0, cy - 40, 10, 0, cy, rx);
  ig.addColorStop(0, "#ffb060");
  ig.addColorStop(0.6, "#c44818");
  ig.addColorStop(1, "#4a1408");
  g.fillStyle = ig;
  g.fill();
  }
  // asas
  g.strokeStyle = "#d5dbe2";
  g.lineWidth = 22;
  g.beginPath();
  g.arc(-rx - 8, cy + 10, 54, 0.4, 5.8);
  g.stroke();
  g.beginPath();
  g.arc(rx + 8, cy + 10, 54, 3.5, 2.6, true);
  g.stroke();
  // borde brillante de la boca
  g.beginPath();
  g.ellipse(cx, cy - 16, rx * 0.86, ry * 0.46, 0, 0, 7);
  g.strokeStyle = "#f7fbff";
  g.lineWidth = 10;
  g.stroke();
  // vapor, solo si la tapa no ha cerrado del todo
  if (baja < -30) {
    g.save();
    g.globalAlpha = Math.min(1, -baja / 160) * 0.7;
    for (let i = 0; i < 5; i++) {
      const y = cy - 80 - ((vaporT * 80 + i * 50) % 220);
      const x = Math.sin(vaporT * 2 + i) * 30 + (i - 2) * 28;
      g.beginPath();
      g.ellipse(x, y, 26, 16, 0, 0, 7);
      g.fillStyle = "rgba(255,236,220,0.45)";
      g.fill();
    }
    g.restore();
  }
  // tapa
  g.save();
  g.translate(0, baja);
  g.beginPath();
  g.ellipse(0, cy - 30, rx * 0.96, ry * 0.5, 0, 0, 7);
  const tg = g.createLinearGradient(-rx, cy - 160, rx, cy);
  tg.addColorStop(0, "#6a7380");
  tg.addColorStop(0.4, "#f4f7fb");
  tg.addColorStop(1, "#4a525c");
  g.fillStyle = tg;
  g.fill();
  g.beginPath();
  g.ellipse(0, cy - 30, rx * 0.55, ry * 0.26, 0, 0, 7);
  g.strokeStyle = "rgba(30,36,44,0.45)";
  g.lineWidth = 8;
  g.stroke();
  // pomo
  g.beginPath();
  g.ellipse(0, cy - 78, 28, 16, 0, 0, 7);
  g.fillStyle = "#2c241c";
  g.fill();
  g.beginPath();
  g.ellipse(0, cy - 92, 16, 22, 0, 0, 7);
  g.fillStyle = "#1a1612";
  g.fill();
  g.restore();
}

const azP = azar(77);
const MOTAS = Array.from({ length: 28 }, () => ({
  x: (azP() - 0.5) * 500,
  y: (azP() - 0.5) * 700,
  s: 2 + azP() * 4,
  v: 20 + azP() * 40,
  p: azP(),
}));

// El pozo visto desde abajo. La tapa está en el cielo del agujero.
export function pozo(g, t, o) {
  const cx = 540, cy = 1040;
  sinVista(g);
  g.fillStyle = "#120a08";
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.translate(cx, cy);
  g.scale(o.zoom, o.zoom);
  g.translate(-cx, -cy);
  for (let i = 9; i >= 0; i--) {
    const r = 230 + i * 130;
    g.beginPath();
    g.arc(cx, cy, r, 0, 7);
    const tono = i % 2 === 0 ? "#6a3a22" : "#4a2818";
    g.fillStyle = tono;
    g.fill();
    g.strokeStyle = "rgba(20,8,4,0.45)";
    g.lineWidth = 8;
    g.stroke();
  }
  // cielo del agujero y el reborde donde apoya la tapa
  g.beginPath();
  g.arc(cx, cy, 250, 0, 7);
  const cg = g.createRadialGradient(cx, cy, 40, cx, cy, 250);
  cg.addColorStop(0, "#9fd0ff");
  cg.addColorStop(1, "#3a6ea8");
  g.fillStyle = cg;
  g.fill();
  g.beginPath();
  g.arc(cx, cy, 318, 0, 7);
  g.arc(cx, cy, 248, 0, 7, true);
  const rg = g.createLinearGradient(cx - 300, cy, cx + 300, cy);
  rg.addColorStop(0, "#3e4650");
  rg.addColorStop(0.5, "#d5dce6");
  rg.addColorStop(1, "#2a3038");
  g.fillStyle = rg;
  g.fill();
  // la tapa, sentada, tapando el cielo. escTapa 1 = en su sitio. Más grande = viene hacia nosotros.
  const rt = 286 * (o.escTapa || 1);
  g.beginPath();
  g.arc(cx, cy, rt, 0, 7);
  hierroRadial(g, cx, cy, rt);
  g.fill();
  g.save();
  g.beginPath();
  g.arc(cx, cy, rt, 0, 7);
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.4;
  g.drawImage(manchas, cx - rt, cy - rt, rt * 2, rt * 2);
  g.restore();
  g.strokeStyle = "rgba(20,24,30,0.65)";
  g.lineWidth = 8;
  g.beginPath(); g.arc(cx, cy, rt * 0.55, 0, 7); g.stroke();
  g.beginPath(); g.arc(cx, cy, rt * 0.78, 0, 7); g.stroke();
  g.fillStyle = "#14181e";
  g.beginPath(); g.ellipse(cx - rt * 0.22, cy, rt * 0.06, rt * 0.12, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(cx + rt * 0.22, cy, rt * 0.06, rt * 0.12, 0, 0, 7); g.fill();
  g.strokeStyle = "rgba(255,220,160,0.85)";
  g.lineWidth = 7;
  g.beginPath();
  g.arc(cx, cy, Math.min(rt + 8, 312), 0, 7);
  g.stroke();
  g.restore();
  // casco, delante
  const hx = 540, hy = 1340 - o.sube;
  g.save();
  g.translate(hx, hy);
  // haz
  g.save();
  g.globalCompositeOperation = "lighter";
  const hz = g.createLinearGradient(0, 0, 0, -700);
  hz.addColorStop(0, "rgba(255,220,140,0.28)");
  hz.addColorStop(1, "rgba(255,220,140,0)");
  g.fillStyle = hz;
  g.beginPath();
  g.moveTo(-34, -10);
  g.lineTo(34, -10);
  g.lineTo(150, -640);
  g.lineTo(-150, -640);
  g.closePath();
  g.fill();
  g.restore();
  // ala
  g.beginPath();
  g.ellipse(0, 18, 168, 46, 0, 0, 7);
  g.fillStyle = "#f0b429";
  g.fill();
  g.beginPath();
  g.arc(0, 16, 112, Math.PI, 0);
  g.fillStyle = "#ffd34a";
  g.fill();
  const dg = g.createLinearGradient(-80, -80, 80, 20);
  dg.addColorStop(0, "rgba(255,255,255,0.45)");
  dg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = dg;
  g.beginPath();
  g.arc(0, 16, 112, Math.PI, 0);
  g.fill();
  // lámpara
  g.beginPath();
  g.arc(0, 8, 26, 0, 7);
  g.fillStyle = "#fff4cc";
  g.fill();
  g.restore();
  // motas en el haz
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const m of MOTAS) {
    const tt = o.tMota ?? t;
    const y = hy - 80 - ((tt * m.v + m.p * 400) % 620);
    g.fillStyle = "rgba(255,220,160,0.7)";
    g.beginPath();
    g.arc(hx + m.x * 0.35, y, m.s, 0, 7);
    g.fill();
  }
  g.restore();
}

export function zapatillas(g, x, fase) {
  g.save();
  g.translate(x, 0);
  g.scale(2.15, 2.15);
  const paso = Math.sin(fase * Math.PI);
  const pies = [
    { dx: -70, dy: paso * 36, rot: -0.15 },
    { dx: 70, dy: -paso * 36, rot: 0.12 },
  ];
  for (const p of pies) {
    g.save();
    g.translate(p.dx, p.dy);
    g.rotate(p.rot);
    // suela
    k.redondo(g, -46, -22, 120, 64, 26);
    g.fillStyle = "#f4f1ea";
    g.fill();
    k.redondo(g, -36, -14, 78, 40, 16);
    g.fillStyle = "#e23b2f";
    g.fill();
    g.fillStyle = "#1c1c1c";
    g.fillRect(58, -8, 22, 16);
    g.restore();
  }
  g.restore();
}
