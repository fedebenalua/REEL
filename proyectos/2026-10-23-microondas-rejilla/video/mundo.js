// El microondas de este vídeo: la caja, la puerta con su rejilla de metal y lo que se ve dentro.
// Un solo aparato, el mismo en todos los planos. La cámara lo escala desde escena.js.
import * as k from "#kit";

export const ANCLA = [540, 1000];
export const BODY = { x: 90, y: 440, w: 900, h: 1080 };
export const WIN = { x: 155, y: 520, w: 530, h: 800 };
export const HOLE = [420, 920];
export const PASO = 40;
export const RAD = 14;
export const CENTRO = [540, 980];

const az = k.azar(20261023);
export const PALOM = [
  ...Array.from({ length: 18 }, () => ({
    x: HOLE[0] - 170 + az() * 340,
    y: HOLE[1] + 120 + az() * 180,
    s: 22 + az() * 18,
    ph: az(),
    dur: 0.8 + az() * 0.6,
    tono: az(),
  })),
  // unas cuantas junto al agujero del centro, para que se vean al entrar la cámara
  ...Array.from({ length: 10 }, () => ({
    x: HOLE[0] - 70 + az() * 140,
    y: HOLE[1] - 50 + az() * 120,
    s: 20 + az() * 16,
    ph: az(),
    dur: 0.7 + az() * 0.5,
    tono: az(),
  })),
];

const CHIS = Array.from({ length: 36 }, () => ({
  a: az() * 6.2832,
  v: 90 + az() * 280,
  s: 4 + az() * 7,
  ph: az(),
}));

export function fondoCocina(g) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#140c28");
  gr.addColorStop(0.45, "#2a1458");
  gr.addColorStop(1, "#3a1a3a");
  g.fillStyle = gr;
  g.fillRect(-400, -200, 2200, 2600);
  const lam = g.createRadialGradient(280, 280, 40, 420, 520, 900);
  lam.addColorStop(0, "rgba(255,186,90,0.55)");
  lam.addColorStop(0.4, "rgba(255,140,60,0.16)");
  lam.addColorStop(1, "rgba(255,140,60,0)");
  g.fillStyle = lam;
  g.fillRect(-400, -200, 2200, 2600);
  g.save();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "screen";
  g.drawImage(k.manchas, -200, 0, 1600, 2000);
  g.restore();
  // encimera de madera, caliente
  const y = 1505;
  const mad = g.createLinearGradient(0, y, 0, y + 280);
  mad.addColorStop(0, "#a8643c");
  mad.addColorStop(0.15, "#6c3a22");
  mad.addColorStop(1, "#2a140e");
  g.fillStyle = mad;
  g.fillRect(-400, y, 2200, 500);
  g.save();
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -200, y, 1600, 320);
  g.restore();
}

export function caja(g, t) {
  const { x, y, w, h } = BODY;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 40;
  g.shadowOffsetY = 24;
  k.redondo(g, x, y, w, h, 36);
  const mg = g.createLinearGradient(x, y, x + w, y + h);
  mg.addColorStop(0, "#3c4250");
  mg.addColorStop(0.18, "#1c2028");
  mg.addColorStop(0.5, "#12151c");
  mg.addColorStop(1, "#07080c");
  g.fillStyle = mg;
  g.fill();
  g.shadowColor = "transparent";
  g.shadowBlur = 0;
  k.redondo(g, x + 10, y + 10, w - 20, h - 20, 28);
  g.strokeStyle = "rgba(255,255,255,0.14)";
  g.lineWidth = 3;
  g.stroke();
  // puerta, un pelín más clara
  k.redondo(g, x + 28, y + 36, 640, h - 72, 22);
  const pg = g.createLinearGradient(x, y, x + 500, y + h);
  pg.addColorStop(0, "#2a303c");
  pg.addColorStop(0.5, "#141820");
  pg.addColorStop(1, "#0c0e14");
  g.fillStyle = pg;
  g.fill();
  // asa
  k.redondo(g, x + 615, y + 430, 28, 220, 12);
  g.fillStyle = "#d5dbe6";
  g.fill();
  const ag = g.createLinearGradient(x + 615, 0, x + 643, 0);
  ag.addColorStop(0, "#8b93a3");
  ag.addColorStop(0.45, "#f4f7fb");
  ag.addColorStop(1, "#6e7686");
  g.fillStyle = ag;
  g.fill();
  // panel
  k.redondo(g, x + 690, y + 70, 180, h - 150, 18);
  g.fillStyle = "#0e1118";
  g.fill();
  k.redondo(g, x + 712, y + 100, 136, 64, 10);
  g.fillStyle = "#06140f";
  g.fill();
  // la lucecita del tiempo, sin cifras: un texto diminuto no se lee en el móvil
  const pulso = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 4));
  g.fillStyle = `rgba(125,255,168,${0.35 + 0.65 * pulso})`;
  g.fillRect(x + 732, y + 124, 96, 14);
  for (let i = 0; i < 6; i++) {
    const bx = x + 748 + (i % 3) * 42, by = y + 210 + Math.floor(i / 3) * 52;
    g.beginPath();
    g.arc(bx, by, 14, 0, 6.2832);
    g.fillStyle = i === 5 ? `rgba(80,255,160,${pulso})` : "#2a3344";
    g.fill();
  }
  // botón grande de marcha
  g.beginPath();
  g.arc(x + 780, y + 430, 36, 0, 6.2832);
  const bg = g.createRadialGradient(x + 770, y + 418, 4, x + 780, y + 430, 36);
  bg.addColorStop(0, "#fff");
  bg.addColorStop(0.35, "#3dff9a");
  bg.addColorStop(1, "#0a6b3a");
  g.fillStyle = bg;
  g.fill();
  g.restore();
  k.brillo(g, x + 780, y + 430, 160, "verde", 0.35 * pulso);
}

export function interior(g, t) {
  const { x, y, w, h } = WIN;
  g.save();
  k.redondo(g, x, y, w, h, 18);
  g.clip();
  const cg = g.createRadialGradient(HOLE[0], HOLE[1] + 40, 40, HOLE[0], HOLE[1] + 80, 520);
  cg.addColorStop(0, "#16345a");
  cg.addColorStop(0.45, "#0c1c38");
  cg.addColorStop(1, "#070b14");
  g.fillStyle = cg;
  g.fillRect(x, y, w, h);
  // un lavado magenta fuerte: de lejos, cada agujero se ve rosa y se nota que la onda está dentro
  g.save();
  g.globalAlpha = 0.78;
  g.fillStyle = "#ff2b9a";
  g.fillRect(x, y, w, h);
  g.restore();
  // paredes: más oscuras en el borde, para que se note la caja
  const vg = g.createLinearGradient(x, 0, x + w, 0);
  vg.addColorStop(0, "rgba(0,0,0,0.45)");
  vg.addColorStop(0.15, "rgba(0,0,0,0)");
  vg.addColorStop(0.85, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.5)");
  g.fillStyle = vg;
  g.fillRect(x, y, w, h);
  // luz de dentro: cian, y un fogonazo magenta que llena los agujeros (la onda, dentro)
  const luz = 0.55 + 0.2 * Math.sin(t * 6);
  g.save();
  g.globalCompositeOperation = "lighter";
  const lg = g.createRadialGradient(HOLE[0], HOLE[1] + 80, 10, HOLE[0], HOLE[1] + 80, 420);
  lg.addColorStop(0, `rgba(120,230,255,${0.7 * luz})`);
  lg.addColorStop(1, "rgba(120,230,255,0)");
  g.fillStyle = lg;
  g.fillRect(x, y, w, h);
  const mg = g.createRadialGradient(HOLE[0], HOLE[1] - 20, 20, HOLE[0], HOLE[1], 380);
  const pul = 0.35 + 0.25 * Math.sin(t * 7);
  mg.addColorStop(0, `rgba(255,40,180,${pul})`);
  mg.addColorStop(0.55, `rgba(255,40,180,${pul * 0.45})`);
  mg.addColorStop(1, "rgba(255,40,180,0)");
  g.fillStyle = mg;
  g.fillRect(x, y, w, h);
  g.restore();
  // ondas dentro, gruesas, para que se cuelen por los agujeros también de lejos
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  for (let k = 0; k < 4; k++) {
    g.beginPath();
    const yy = y + 120 + k * 160;
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      const px = x + u * w;
      const py = yy + Math.sin(u * 7 + t * 7 + k * 1.3) * 34;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.strokeStyle = `rgba(255,60,200,${0.55})`;
    g.lineWidth = 26;
    g.stroke();
  }
  g.restore();
  // plato de cristal
  const px = HOLE[0], py = HOLE[1] + 230;
  g.save();
  g.translate(px, py);
  g.rotate(t * 0.9);
  g.beginPath();
  g.ellipse(0, 0, 168, 52, 0, 0, 6.2832);
  const tg = g.createRadialGradient(-30, -10, 8, 0, 0, 160);
  tg.addColorStop(0, "rgba(210,245,255,0.55)");
  tg.addColorStop(0.45, "rgba(80,160,190,0.25)");
  tg.addColorStop(1, "rgba(20,40,60,0.15)");
  g.fillStyle = tg;
  g.fill();
  g.strokeStyle = "rgba(220,250,255,0.65)";
  g.lineWidth = 4;
  g.stroke();
  g.restore();
  // bol
  g.beginPath();
  g.ellipse(px, py - 18, 92, 34, 0, 0, 6.2832);
  const bol = g.createLinearGradient(px - 90, py, px + 90, py);
  bol.addColorStop(0, "#ff5a6a");
  bol.addColorStop(0.5, "#ffd0d4");
  bol.addColorStop(1, "#c42040");
  g.fillStyle = bol;
  g.fill();
  g.beginPath();
  g.ellipse(px, py - 26, 78, 20, 0, 0, Math.PI, true);
  g.fillStyle = "#8e1830";
  g.fill();
  // palomitas
  for (const p of PALOM) {
    const age = (t / p.dur + p.ph) % 1;
    const salto = Math.sin(age * Math.PI);
    const xx = p.x + Math.sin(t * 2 + p.ph * 6) * 4;
    const yy = p.y - salto * (70 + p.s);
    const col = p.tono < 0.35 ? "#fff6d8" : p.tono < 0.7 ? "#ffd27a" : "#ffb03a";
    g.save();
    g.translate(xx, yy);
    g.rotate(p.ph * 6 + t * 0.4);
    g.fillStyle = col;
    g.beginPath();
    g.ellipse(0, 0, p.s, p.s * 0.72, 0, 0, 6.2832);
    g.fill();
    g.beginPath();
    g.ellipse(-p.s * 0.45, -p.s * 0.2, p.s * 0.55, p.s * 0.4, -0.6, 0, 6.2832);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.65)";
    g.beginPath();
    g.ellipse(-p.s * 0.2, -p.s * 0.25, p.s * 0.28, p.s * 0.18, 0, 0, 6.2832);
    g.fill();
    g.restore();
  }
  g.restore();
}

function caminoRejilla(g) {
  const { x, y, w, h } = WIN;
  const i0 = -16, i1 = 16, j0 = -14, j1 = 14;
  g.beginPath();
  g.rect(x - 16, y - 16, w + 32, h + 32);
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const cx = HOLE[0] + i * PASO, cy = HOLE[1] + j * PASO;
      g.moveTo(cx + RAD, cy);
      g.arc(cx, cy, RAD, 0, Math.PI * 2);
    }
  }
}

export function rejilla(g) {
  const { x, y, w, h } = WIN;
  // el metal se pinta con los agujeros vacíos: lo de detrás (la comida, la onda) se ve.
  // nada de rellenar antes la ventana, que eso tapa el interior.
  caminoRejilla(g);
  const mg = g.createLinearGradient(x, y, x + w, y + h);
  mg.addColorStop(0, "#4a5160");
  mg.addColorStop(0.35, "#1a1e28");
  mg.addColorStop(0.7, "#2a3140");
  mg.addColorStop(1, "#0c0e14");
  g.fillStyle = mg;
  g.fill("evenodd");
  // marco
  g.strokeStyle = "#05060a";
  g.lineWidth = 16;
  k.redondo(g, x - 10, y - 10, w + 20, h + 20, 20);
  g.stroke();
}

// Reflejo fijo del cristal, encima de la rejilla: se ve que hay un vidrio, sin ser otra pieza.
export function brilloCristal(g, al = 0.22) {
  if (al < 0.01) return;
  const { x, y, w, h } = WIN;
  g.save();
  k.redondo(g, x, y, w, h, 18);
  g.clip();
  g.globalAlpha = al;
  const rg = g.createLinearGradient(x, y, x + w, y + h * 0.4);
  rg.addColorStop(0, "rgba(255,255,255,0.55)");
  rg.addColorStop(0.18, "rgba(255,255,255,0.05)");
  rg.addColorStop(0.45, "rgba(255,255,255,0)");
  rg.addColorStop(1, "rgba(180,220,255,0.12)");
  g.fillStyle = rg;
  g.fillRect(x, y, w, h);
  g.restore();
}

export function chispas(g, x, y, t0, t, escala = 1) {
  const u = t - t0;
  if (u < 0 || u > 0.42) return;
  const vida = 1 - u / 0.42;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const c of CHIS) {
    const d = c.v * u * escala;
    const px = x + Math.cos(c.a) * d;
    const py = y + Math.sin(c.a) * d;
    g.globalAlpha = vida * (0.4 + c.ph * 0.6);
    g.fillStyle = c.ph > 0.5 ? "#ff4ec8" : "#ffd0f0";
    g.beginPath();
    g.arc(px, py, c.s * (0.6 + vida) * escala, 0, 6.2832);
    g.fill();
  }
  g.restore();
}
