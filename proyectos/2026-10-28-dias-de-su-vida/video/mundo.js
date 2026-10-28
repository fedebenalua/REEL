// El calendario de días, la cuna, las Pascuas, el laboratorio y el plato: la misma cosa en todos los planos.
import { GlobalFonts } from "@napi-rs/canvas";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "#kit";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "../../..");
for (const p of ["Medium", "Bold", "ExtraBold"]) GlobalFonts.registerFromPath(join(raiz, "letra", `Figtree-${p}.ttf`), "Figtree");

export const CAB = ["#e23b4a", "#148a86", "#e8872a", "#3a5ec9", "#c4488a", "#2f9e4f", "#d4a017", "#6a4cc4"];

export function velo(g, a = 0.78) {
  const v = g.createLinearGradient(0, 160, 0, 640);
  v.addColorStop(0, `rgba(6,8,18,${a})`);
  v.addColorStop(0.55, `rgba(6,8,18,${a * 0.55})`);
  v.addColorStop(1, "rgba(6,8,18,0)");
  g.fillStyle = v;
  g.fillRect(0, 0, 1080, 680);
}

function pintar(g, id, w, h) {
  if (id === 0) {
    const c = g.createLinearGradient(0, 0, 0, h);
    c.addColorStop(0, "#102848"); c.addColorStop(0.42, "#3a6ea8"); c.addColorStop(0.43, "#1c2838"); c.addColorStop(1, "#0d1522");
    g.fillStyle = c; g.fillRect(0, 0, w, h);
    g.fillStyle = "#152033";
    g.fillRect(0, h * 0.28, w * 0.3, h * 0.4);
    g.fillRect(w * 0.28, h * 0.38, w * 0.22, h * 0.3);
    g.fillRect(w * 0.72, h * 0.22, w * 0.28, h * 0.46);
    g.fillStyle = "#ffd78a";
    for (let col = 0; col < 3; col++) for (let row = 0; row < 3; row++) g.fillRect(16 + col * 36, h * 0.36 + row * 28, 18, 16);
    g.fillRect(w * 0.78, h * 0.32, 22, 18); g.fillRect(w * 0.86, h * 0.32, 22, 18);
    g.fillRect(w * 0.78, h * 0.44, 22, 18);
    g.fillStyle = "#2a3a52"; g.fillRect(0, h * 0.66, w, h);
    g.fillStyle = "rgba(180,210,240,0.35)"; g.fillRect(w * 0.2, h * 0.78, w * 0.5, 8);
    g.fillStyle = "rgba(255,80,70,0.25)"; g.beginPath(); g.ellipse(w * 0.48, h * 0.86, 40, 10, 0, 0, 7); g.fill();
  } else if (id === 1) {
    const c = g.createLinearGradient(0, 0, 0, h);
    c.addColorStop(0, "#ff8a5b"); c.addColorStop(0.45, "#ffd0a0"); c.addColorStop(1, "#6ea0d0");
    g.fillStyle = c; g.fillRect(0, 0, w, h);
    g.fillStyle = "#f2c14a";
    k.redondo(g, w * 0.12, h * 0.42, w * 0.76, h * 0.32, 28); g.fill();
    g.fillStyle = "#8fd4ff";
    for (let i = 0; i < 4; i++) { k.redondo(g, w * 0.2 + i * w * 0.16, h * 0.48, w * 0.12, h * 0.16, 8); g.fill(); }
    g.fillStyle = "#2a241c";
    g.beginPath(); g.arc(w * 0.28, h * 0.78, 22, 0, 7); g.arc(w * 0.72, h * 0.78, 22, 0, 7); g.fill();
  } else if (id === 2) {
    g.fillStyle = "#2a1430"; g.fillRect(0, 0, w, h);
    const m = g.createRadialGradient(w * 0.5, h * 0.2, 10, w * 0.5, h * 0.3, w * 0.7);
    m.addColorStop(0, "rgba(255,200,120,0.9)"); m.addColorStop(1, "rgba(255,200,120,0)");
    g.fillStyle = m; g.fillRect(0, 0, w, h);
    g.fillStyle = "#ff6d8a";
    g.beginPath(); g.ellipse(w * 0.5, h * 0.62, w * 0.28, h * 0.16, 0, 0, 7); g.fill();
    g.fillStyle = "#ffd0dc";
    g.beginPath(); g.ellipse(w * 0.5, h * 0.52, w * 0.24, h * 0.13, 0, 0, 7); g.fill();
    g.fillStyle = "#ffe7a8";
    g.fillRect(w * 0.48, h * 0.28, 8, h * 0.22);
    g.beginPath(); g.ellipse(w * 0.5, h * 0.26, 16, 22, 0, 0, 7); g.fill();
  } else if (id === 3) {
    const c = g.createLinearGradient(0, 0, 0, h);
    c.addColorStop(0, "#ffb15a"); c.addColorStop(1, "#f6e2c4");
    g.fillStyle = c; g.fillRect(0, 0, w, h);
    g.fillStyle = "#1d4e89";
    g.beginPath(); g.ellipse(w * 0.5, h * 0.58, w * 0.16, h * 0.2, 0, 0, 7); g.fill();
    g.fillStyle = "#163e6e"; g.fillRect(w * 0.4, h * 0.34, w * 0.2, h * 0.16);
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 4;
    g.beginPath(); g.moveTo(w * 0.46, h * 0.32); g.quadraticCurveTo(w * 0.4, h * 0.16, w * 0.5, h * 0.1); g.stroke();
    g.beginPath(); g.moveTo(w * 0.54, h * 0.32); g.quadraticCurveTo(w * 0.62, h * 0.14, w * 0.52, h * 0.08); g.stroke();
  } else if (id === 4) {
    const c = g.createLinearGradient(0, 0, 0, h);
    c.addColorStop(0, "#ffb15c"); c.addColorStop(0.35, "#ff7a6a"); c.addColorStop(0.36, "#1aa7b8"); c.addColorStop(1, "#0b4d6e");
    g.fillStyle = c; g.fillRect(0, 0, w, h);
    g.fillStyle = "#ffe1a8";
    g.beginPath(); g.arc(w * 0.72, h * 0.28, 36, 0, 7); g.fill();
  } else if (id === 5) {
    g.fillStyle = "#1b2c4e"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#eef6ff"; g.fillRect(0, h * 0.62, w, h);
    g.fillStyle = "#ffd9a0"; g.fillRect(w * 0.62, h * 0.28, w * 0.22, h * 0.28);
    g.fillStyle = "#8ec6ff"; g.fillRect(w * 0.66, h * 0.34, w * 0.14, h * 0.14);
    g.fillStyle = "#e23b4a";
    g.beginPath(); g.moveTo(w * 0.18, h * 0.7); g.quadraticCurveTo(w * 0.28, h * 0.42, w * 0.4, h * 0.7); g.fill();
  } else if (id === 6) {
    const c = g.createLinearGradient(0, 0, 0, h);
    c.addColorStop(0, "#7ec8ff"); c.addColorStop(0.55, "#d7f0a8"); c.addColorStop(1, "#6aaa48");
    g.fillStyle = c; g.fillRect(0, 0, w, h);
    g.fillStyle = "#e8f6c8"; g.fillRect(0, h * 0.72, w, h * 0.1);
    g.strokeStyle = "#f27a1a"; g.lineWidth = 12; g.lineCap = "round";
    g.beginPath(); g.arc(w * 0.3, h * 0.62, 34, 0, 7); g.stroke();
    g.beginPath(); g.arc(w * 0.7, h * 0.62, 34, 0, 7); g.stroke();
    g.beginPath();
    g.moveTo(w * 0.3, h * 0.62); g.lineTo(w * 0.42, h * 0.4); g.lineTo(w * 0.62, h * 0.4); g.lineTo(w * 0.7, h * 0.62);
    g.moveTo(w * 0.42, h * 0.4); g.lineTo(w * 0.36, h * 0.28);
    g.stroke();
  } else {
    g.fillStyle = "#160820"; g.fillRect(0, 0, w, h);
    const m = g.createRadialGradient(w * 0.5, 0, 10, w * 0.5, 0, h);
    m.addColorStop(0, "rgba(255,210,80,0.95)"); m.addColorStop(1, "rgba(255,210,80,0)");
    g.fillStyle = m; g.fillRect(0, 0, w, h);
    g.fillStyle = "#1a1020"; g.beginPath(); g.ellipse(w * 0.5, h * 0.62, w * 0.22, h * 0.22, 0, 0, 7); g.fill();
    g.strokeStyle = "#ffd36a"; g.lineWidth = 6; g.beginPath(); g.arc(w * 0.5, h * 0.62, w * 0.1, 0, 7); g.stroke();
  }
}

const ESC = [];
for (let i = 0; i < 8; i++) {
  const l = k.lienzo(480, 300), c = l.getContext("2d");
  pintar(c, i, 480, 300);
  ESC.push(l);
}
export const escena = (i) => ESC[i % 8];

const azT = k.azar(9);
export const TARJETAS = [];
for (let i = 0; i < 28; i++) {
  const hero = i === 11;
  const ang = i * 0.97 + 0.3;
  TARJETAS.push({
    i, hero,
    x: hero ? 0 : Math.sin(ang) * (1.02 + (i % 4) * 0.1),
    y: hero ? -0.22 : Math.cos(ang * 0.85) * 0.48,
    z: hero ? 17.2 : 3.15 + i * 1.32,
    esc: hero ? 0 : i % 8,
    num: String((i * 3 + 4) % 27 + 1),
    color: CAB[i % CAB.length],
    rot: hero ? 0 : (azT() - 0.5) * 0.35,
  });
}
export const HERO = TARJETAS.find((t) => t.hero);

const azL = k.azar(4);
const LUCES = Array.from({ length: 36 }, () => ({
  x: (azL() - 0.5) * 7, y: (azL() - 0.5) * 5, z: 2 + azL() * 22, s: 0.3 + azL(),
}));

export function fondoTunel(g) {
  const c = g.createLinearGradient(0, 0, 0, 1920);
  c.addColorStop(0, "#12162e"); c.addColorStop(0.45, "#1b2748"); c.addColorStop(1, "#070912");
  g.fillStyle = c; g.fillRect(0, 0, 1080, 1920);
}

export function proyectaTarjeta(cam, tar) {
  const p = k.proyecta(cam, [tar.x, tar.y, tar.z]);
  if (!p || p.z < 0.38) return null;
  if (!tar.hero && p.z < 1.15) return null;
  const w = k.tamano(0.82, p.z);
  if (w < 10 || w > 1600) return null;
  const h = w * 1.32;
  const al = k.suave(k.tramo(p.z, 0.38, 0.78));
  return { x: p.x, y: p.y, z: p.z, w, h, al };
}

// Una tarjeta de un día, centrada en (x, y). escenaAl: cuánto se ve lo que pasó ese día.
export function tarjeta(g, x, y, w, h, opt = {}) {
  const al = opt.al ?? 1;
  if (al < 0.02 || w < 8) return;
  const r = Math.min(36, w * 0.08);
  g.save();
  g.translate(x, y);
  g.rotate(opt.rot || 0);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.28)";
  k.redondo(g, -w / 2 + 10, -h / 2 + 16, w, h, r); g.fill();
  k.redondo(g, -w / 2, -h / 2, w, h, r);
  const papel = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  papel.addColorStop(0, "#fffaf2"); papel.addColorStop(1, "#f3e2cc");
  g.fillStyle = papel; g.fill();
  g.save();
  g.clip();
  g.fillStyle = opt.color || "#e23b4a";
  g.fillRect(-w / 2, -h / 2, w, h * 0.2);
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.fillRect(-w / 2, -h / 2, w * 0.35, h * 0.2);
  g.restore();
  const ea = opt.escenaAl ?? 1;
  if (ea > 0.02) {
    const m = w * 0.07, iy = -h / 2 + h * 0.26, iw = w - m * 2, ih = h * 0.66;
    g.save();
    g.globalAlpha *= ea;
    k.redondo(g, -w / 2 + m, iy, iw, ih, r * 0.45); g.clip();
    g.drawImage(escena(opt.esc ?? 0), -w / 2 + m, iy, iw, ih);
    g.restore();
  }
  g.fillStyle = "#fffaf2";
  g.font = `800 ${Math.max(10, h * 0.11)}px Figtree`;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(opt.num || "", 0, -h / 2 + h * 0.1);
  g.restore();
}

export function tunel(g, cam, opt = {}) {
  fondoTunel(g);
  const cosas = [];
  for (const L of LUCES) {
    const p = k.proyecta(cam, [L.x, L.y, L.z]);
    if (!p) continue;
    cosas.push({ z: p.z, dibuja: () => k.brillo(g, p.x, p.y, k.tamano(0.08, p.z) * 8, "amarilla", 0.18 * L.s) });
  }
  for (const tar of TARJETAS) {
    const r = proyectaTarjeta(cam, tar);
    if (!r) continue;
    const hero = tar.hero;
    cosas.push({
      z: r.z,
      dibuja: () => tarjeta(g, r.x, r.y, r.w, r.h, {
        color: tar.color, esc: tar.esc, num: tar.num, rot: tar.rot,
        al: r.al * (opt.alTarjeta ? opt.alTarjeta(tar) : 1),
        escenaAl: hero ? (opt.escenaHero ?? 1) : 1,
      }),
    });
  }
  k.deLejosACerca(cosas);
}

// s: ancho del paraguas en píxeles. abre: 0 cerrado, 1 abierto.
export function paraguas(g, x, y, s, abre) {
  if (abre < 0.04 || s < 8) return;
  g.save();
  g.translate(x, y);
  g.scale(s / 220, s / 220);
  const a = abre;
  g.strokeStyle = "#3a2a22"; g.lineWidth = 10; g.lineCap = "round";
  g.beginPath(); g.moveTo(0, -10); g.lineTo(8, 120); g.stroke();
  g.fillStyle = "#d7dbe2";
  g.beginPath(); g.moveTo(-8, 112); g.lineTo(22, 112); g.lineTo(12, 128); g.closePath(); g.fill();
  g.fillStyle = "#e23b4a";
  g.beginPath();
  g.moveTo(-108 * a, 8);
  g.quadraticCurveTo(-120 * a, -78 * a, 0, -88 * a);
  g.quadraticCurveTo(120 * a, -78 * a, 108 * a, 8);
  g.quadraticCurveTo(0, -16, -108 * a, 8);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 4;
  for (const dx of [-70, -28, 28, 70]) {
    g.beginPath(); g.moveTo(0, -24 * a); g.lineTo(dx * a, 6); g.stroke();
  }
  g.restore();
}

export function lluvia(g, x, y, w, h, t, al) {
  if (al < 0.03) return;
  g.save();
  g.beginPath(); k.redondo(g, x, y, w, h, 16); g.clip();
  g.strokeStyle = `rgba(210,230,255,${0.45 * al})`; g.lineWidth = 2;
  const az = k.azar(21);
  for (let i = 0; i < 28; i++) {
    const px = x + az() * w, py = y + ((az() * h + t * 280 + i * 40) % (h + 30)) - 15;
    g.beginPath(); g.moveTo(px, py); g.lineTo(px - 6, py + 18); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- la cuna y la marca de la puerta
export function cuartoCuna(g, t) {
  const c = g.createLinearGradient(0, 0, 1080, 1920);
  c.addColorStop(0, "#24345c"); c.addColorStop(0.5, "#18243f"); c.addColorStop(1, "#0c101c");
  g.fillStyle = c; g.fillRect(0, 0, 1080, 1920);
  const lam = g.createRadialGradient(180, 280, 20, 260, 520, 900);
  lam.addColorStop(0, "rgba(255,196,120,0.55)"); lam.addColorStop(1, "rgba(255,196,120,0)");
  g.fillStyle = lam; g.fillRect(0, 0, 1080, 1920);
  // suelo
  g.fillStyle = "#6a3e28";
  g.beginPath(); g.moveTo(0, 1500); g.lineTo(1080, 1420); g.lineTo(1080, 1920); g.lineTo(0, 1920); g.fill();
  g.fillStyle = "rgba(0,0,0,0.18)";
  for (let i = 0; i < 8; i++) g.fillRect(0, 1520 + i * 48, 1080, 8);
}

export function cuna(g, x, y, s, t) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // cabeceros
  const madera = g.createLinearGradient(-200, 0, 200, 0);
  madera.addColorStop(0, "#8a552e"); madera.addColorStop(0.45, "#e2b074"); madera.addColorStop(1, "#6b3e1e");
  g.fillStyle = madera;
  k.redondo(g, -210, -250, 36, 460, 16); g.fill();
  k.redondo(g, 174, -180, 36, 390, 16); g.fill();
  g.fillRect(-190, 150, 380, 28);
  g.fillRect(-190, -40, 380, 22);
  g.strokeStyle = "#f0c892"; g.lineWidth = 8;
  for (let i = -3; i <= 3; i++) {
    g.beginPath(); g.moveTo(i * 42, -30); g.lineTo(i * 42, 150); g.stroke();
  }
  // colchón y manta
  g.fillStyle = "#f4fbff";
  k.redondo(g, -170, 20, 340, 90, 16); g.fill();
  g.fillStyle = "#e23b4a";
  k.redondo(g, -160, 48, 250, 70, 18); g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)";
  g.fillRect(-140, 60, 180, 8);
  // móvil
  const bal = Math.sin(t * 1.3) * 0.12;
  g.strokeStyle = "#d7c4a4"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(-40, -250); g.lineTo(-40, -330); g.stroke();
  g.save();
  g.translate(-40, -330); g.rotate(bal);
  g.beginPath(); g.moveTo(-70, 0); g.lineTo(70, 0); g.stroke();
  g.fillStyle = "#ffe08a";
  g.beginPath(); g.arc(-50, 28, 16, 0, 7); g.fill();
  g.fillStyle = "#8fd0ff";
  g.beginPath(); g.arc(10, 36, 12, 0, 7); g.fill();
  g.fillStyle = "#ffd0a8";
  g.beginPath(); g.moveTo(48, 18); g.lineTo(62, 40); g.lineTo(34, 40); g.closePath(); g.fill();
  g.restore();
  g.restore();
}

export function marco(g, x, y) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#d9c4a4";
  k.redondo(g, -70, -420, 140, 860, 18); g.fill();
  g.fillStyle = "#f6efe4";
  k.redondo(g, -48, -390, 96, 800, 12); g.fill();
  g.strokeStyle = "#b08968"; g.lineWidth = 3;
  for (const [yy, n] of [[240, "2"], [80, "6"], [-80, "10"], [-240, "14"]]) {
    g.beginPath(); g.moveTo(-36, yy); g.lineTo(36, yy); g.stroke();
    g.fillStyle = "#6a4a32";
    g.font = "800 32px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(n, 0, yy - 28);
  }
  g.restore();
}

// ---------------------------------------------------------------- Pascuas
export const HUEVOS = ["#e23b4a", "#ffd23a", "#2ec4b6", "#7aa2ff", "#e86adf", "#ff8a3d", "#7dce6a", "#f2f2f2"];

// alto: altura del huevo en píxeles.
export function huevo(g, x, y, alto, color, grieta = 0) {
  if (alto < 6) return;
  const a = alto / 2, b = a * 0.7;
  g.save();
  g.translate(x, y);
  const gr = g.createRadialGradient(-b * 0.35, -a * 0.45, a * 0.08, 0, a * 0.1, a * 1.2);
  gr.addColorStop(0, "#fffef8"); gr.addColorStop(0.42, color); gr.addColorStop(1, "#4a2818");
  g.fillStyle = gr;
  g.beginPath(); g.ellipse(0, 0, b, a, 0, 0, Math.PI * 2); g.fill();
  g.save();
  g.beginPath(); g.ellipse(0, 0, b, a, 0, 0, Math.PI * 2); g.clip();
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = Math.max(3, a * 0.09);
  g.beginPath(); g.moveTo(-b, -a * 0.2); g.quadraticCurveTo(0, -a * 0.5, b, -a * 0.05); g.stroke();
  g.beginPath(); g.moveTo(-b, a * 0.28); g.quadraticCurveTo(0, a * 0.02, b, a * 0.42); g.stroke();
  g.restore();
  if (grieta > 0.05) {
    g.strokeStyle = `rgba(255,255,255,${grieta})`; g.lineWidth = Math.max(3, a * 0.07);
    g.beginPath(); g.moveTo(-b * 0.08, -a * 0.35); g.lineTo(b * 0.16, -a * 0.05); g.lineTo(-b * 0.06, a * 0.22); g.lineTo(b * 0.1, a * 0.48); g.stroke();
  }
  g.restore();
}

export function cocina(g) {
  const c = g.createLinearGradient(0, 0, 0, 1920);
  c.addColorStop(0, "#f6d7b0"); c.addColorStop(0.4, "#e7b583"); c.addColorStop(1, "#c4845a");
  g.fillStyle = c; g.fillRect(0, 0, 1080, 1920);
  const lam = g.createRadialGradient(160, 200, 10, 200, 400, 700);
  lam.addColorStop(0, "rgba(255,244,210,0.7)"); lam.addColorStop(1, "rgba(255,244,210,0)");
  g.fillStyle = lam; g.fillRect(0, 0, 1080, 1920);
  // azulejos abajo
  g.fillStyle = "#f4efe6";
  g.fillRect(0, 1500, 1080, 420);
  g.strokeStyle = "rgba(180,140,100,0.35)"; g.lineWidth = 2;
  for (let x = 0; x < 1080; x += 70) { g.beginPath(); g.moveTo(x, 1500); g.lineTo(x, 1920); g.stroke(); }
  for (let y = 1500; y < 1920; y += 70) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  // maceta
  g.fillStyle = "#2f9e4f";
  g.beginPath(); g.ellipse(140, 1460, 50, 22, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(100, 1420, 28, 40, -0.4, 0, 7); g.fill();
  g.beginPath(); g.ellipse(170, 1410, 26, 42, 0.5, 0, 7); g.fill();
  g.fillStyle = "#d06a3a";
  k.redondo(g, 100, 1455, 80, 50, 8); g.fill();
}

// ---------------------------------------------------------------- laboratorio, cabeza, plato
export function mesa(g) {
  const c = g.createLinearGradient(0, 0, 0, 1920);
  c.addColorStop(0, "#1c2438"); c.addColorStop(0.35, "#2a354c"); c.addColorStop(1, "#121820");
  g.fillStyle = c; g.fillRect(0, 0, 1080, 1920);
  const madera = g.createLinearGradient(0, 980, 0, 1920);
  madera.addColorStop(0, "#a86a3c"); madera.addColorStop(0.15, "#e0a864"); madera.addColorStop(1, "#6b3e22");
  g.fillStyle = madera; g.fillRect(0, 1080, 1080, 840);
  g.strokeStyle = "rgba(90,40,16,0.25)"; g.lineWidth = 3;
  for (let i = 0; i < 9; i++) {
    g.beginPath(); g.moveTo(-40, 1120 + i * 90); g.quadraticCurveTo(540, 1100 + i * 90, 1120, 1160 + i * 90); g.stroke();
  }
}

export function ficha(g, x, y, w, h, texto, al, rot) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y); g.rotate(rot); g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.25)";
  k.redondo(g, -w / 2 + 8, -h / 2 + 12, w, h, 16); g.fill();
  k.redondo(g, -w / 2, -h / 2, w, h, 16);
  const p = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  p.addColorStop(0, "#fffef8"); p.addColorStop(1, "#e6d7c0");
  g.fillStyle = p; g.fill();
  g.fillStyle = "#243049";
  g.font = `800 ${h * 0.4}px Figtree`;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(texto, 0, 6);
  g.restore();
}

export function matraz(g, x, y, s, nivel) {
  g.save();
  g.translate(x, y); g.scale(s, s);
  g.fillStyle = "#d8e4ee";
  k.redondo(g, -16, -150, 32, 80, 8); g.fill();
  g.beginPath();
  g.moveTo(-16, -70); g.lineTo(-70, 40); g.quadraticCurveTo(-80, 110, 0, 120); g.quadraticCurveTo(80, 110, 70, 40); g.lineTo(16, -70);
  g.fill();
  g.save();
  g.beginPath();
  g.moveTo(-16, -70); g.lineTo(-70, 40); g.quadraticCurveTo(-80, 110, 0, 120); g.quadraticCurveTo(80, 110, 70, 40); g.lineTo(16, -70);
  g.clip();
  g.fillStyle = `rgba(60,170,220,${0.85})`;
  g.fillRect(-90, 120 - 150 * nivel, 180, 160);
  g.restore();
  k.brillo(g, x - 10 * s, y - 20 * s, 80 * s, "blanca", 0.35);
  g.restore();
}

export function cabeza(g, x, y, s) {
  g.save();
  g.translate(x, y); g.scale(s, s);
  const piel = g.createRadialGradient(-30, -40, 20, 10, 20, 260);
  piel.addColorStop(0, "#f6c7a4"); piel.addColorStop(0.55, "#d89268"); piel.addColorStop(1, "#7a4634");
  g.fillStyle = piel;
  g.beginPath();
  g.moveTo(-120, 40);
  g.quadraticCurveTo(-160, -90, -40, -170);
  g.quadraticCurveTo(70, -230, 150, -120);
  g.quadraticCurveTo(200, -20, 150, 70);
  g.quadraticCurveTo(90, 150, 10, 160);
  g.quadraticCurveTo(-90, 150, -120, 40);
  g.fill();
  g.fillStyle = "#241c18";
  g.beginPath();
  g.moveTo(-130, 10);
  g.quadraticCurveTo(-150, -140, -20, -200);
  g.quadraticCurveTo(90, -240, 170, -130);
  g.quadraticCurveTo(80, -160, 20, -150);
  g.quadraticCurveTo(-50, -120, -70, -40);
  g.quadraticCurveTo(-90, 0, -130, 10);
  g.fill();
  g.fillStyle = "#e7a888";
  g.beginPath(); g.ellipse(145, 10, 26, 40, 0.3, 0, 7); g.fill();
  g.strokeStyle = "rgba(120,60,40,0.4)"; g.lineWidth = 3;
  g.beginPath(); g.ellipse(145, 10, 12, 22, 0.3, 0, 7); g.stroke();
  g.fillStyle = "#2a1814";
  g.beginPath(); g.ellipse(-70, -10, 9, 12, 0, 0, 7); g.fill();
  g.strokeStyle = "#6a3a2c"; g.lineWidth = 5;
  g.beginPath(); g.moveTo(-130, 30); g.quadraticCurveTo(-155, 55, -125, 70); g.stroke();
  g.restore();
}

export function plato(g, x, y, s, comida) {
  g.save();
  g.translate(x, y); g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.beginPath(); g.ellipse(0, 24, 210, 48, 0, 0, 7); g.fill();
  const cer = g.createRadialGradient(-40, -20, 10, 0, 0, 220);
  cer.addColorStop(0, "#ffffff"); cer.addColorStop(0.7, "#f4efe8"); cer.addColorStop(1, "#c8bfb4");
  g.fillStyle = cer;
  g.beginPath(); g.ellipse(0, 0, 220, 70, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(0, 0, 150, 46, 0, 0, 7);
  g.fillStyle = "#efe6dc"; g.fill();
  if (comida > 0.02) {
    g.save(); g.globalAlpha *= comida;
    g.fillStyle = "#e2a24a";
    g.beginPath(); g.ellipse(-20, -4, 90, 28, -0.2, 0, 7); g.fill();
    g.fillStyle = "#d4533a";
    g.beginPath(); g.ellipse(30, 2, 36, 16, 0.2, 0, 7); g.fill();
    g.beginPath(); g.ellipse(-50, 6, 22, 12, 0, 0, 7); g.fill();
    g.fillStyle = "#6a9a3a";
    g.beginPath(); g.ellipse(10, -8, 40, 10, 0.4, 0, 7); g.fill();
    g.restore();
  }
  g.restore();
}

export function tenedor(g, x, y, s, rot) {
  g.save();
  g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.strokeStyle = "#d5dbe6"; g.lineWidth = 6; g.lineCap = "round";
  g.beginPath(); g.moveTo(0, -70); g.lineTo(0, 80); g.stroke();
  for (const dx of [-14, 0, 14]) { g.beginPath(); g.moveTo(dx, -70); g.lineTo(dx, -110); g.stroke(); }
  g.restore();
}
