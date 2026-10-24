// La escalera mecánica de este vídeo, y el corte de la rendija. Lo que sale en más de un plano se dibuja aquí,
// para que el cepillo, el escalón y el zapato sean siempre los mismos.
import * as k from "#kit";

const { azar, suave, tramo, mez, entra, de } = k;

export function vista(g, Z, cx, cy) {
  g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
}
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);

// Cámara que pasa por [t, z, x, y]. El primer clave puede ir antes de 0: así en el fotograma 0 ya se está moviendo.
export function camara(claves) {
  const Z = k.curva(claves.map((c) => [c[0], Math.log(c[1])]));
  const X = k.curva(claves.map((c) => [c[0], c[2]]));
  const Y = k.curva(claves.map((c) => [c[0], c[3]]));
  return (t) => ({ z: Math.exp(Z(t)), x: X(t), y: Y(t) });
}

// Fase de algo que avanza a velocidad v y frena entre a y b, sin saltar.
export function faseHasta(t, v, a, b) {
  if (t <= a) return v * t;
  const recorrido = v * (b - a) / 3;
  if (t >= b) return v * a + recorrido;
  const s = (t - a) / (b - a);
  return v * a + v * (b - a) * (s - s * s + (s * s * s) / 3);
}

export function velo(g, al = 0.55) {
  g.save();
  sinVista(g);
  const vg = g.createLinearGradient(0, 140, 0, 760);
  vg.addColorStop(0, `rgba(4,8,14,${al})`);
  vg.addColorStop(0.55, `rgba(4,8,14,${al * 0.72})`);
  vg.addColorStop(1, "rgba(4,8,14,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 780);
  g.restore();
}

// ---------------------------------------------------------------- la escalera, vista de quien va subido
const Y0 = 220, Y1 = 1760;
export function pt(u, lat) {
  const y = Y0 + u * (Y1 - Y0);
  const medio = 70 + u * 900;
  return { x: lat * medio, y, medio };
}
export const UZ = 0.61;

const azL = azar(41);
const LUCES = Array.from({ length: 9 }, () => ({
  u: azL() * 0.55,
  lat: azL() * 1.6 - 0.8,
  r: 70 + azL() * 160,
  c: azL() > 0.45 ? "255,186,90" : "90,210,230",
}));
const REMACHES = Array.from({ length: 18 }, (_, i) => i / 18);

function trapecio(g, u0, u1, l0, l1) {
  const a = pt(u0, l0), b = pt(u0, l1), c = pt(u1, l1), d = pt(u1, l0);
  g.beginPath();
  g.moveTo(a.x, a.y);
  g.lineTo(b.x, b.y);
  g.lineTo(c.x, c.y);
  g.lineTo(d.x, d.y);
  g.closePath();
}

function escalon(g, u0, u1) {
  const a = pt(u0, 0), b = pt(u1, 0);
  trapecio(g, u0, u1, -1, 1);
  const gr = g.createLinearGradient(0, a.y, 0, b.y);
  gr.addColorStop(0, "#9aa6b4");
  gr.addColorStop(0.35, "#e9eef4");
  gr.addColorStop(0.75, "#c5ced8");
  gr.addColorStop(1, "#7e8996");
  g.fillStyle = gr;
  g.fill();
  g.save();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.28;
  g.drawImage(k.red, a.x - 800, a.y - 40, 1600, Math.max(80, b.y - a.y + 80));
  g.restore();
  // ranuras, en el sentido de la marcha
  g.save();
  trapecio(g, u0, u1, -0.78, 0.78);
  g.clip();
  const n = 9;
  g.strokeStyle = "rgba(55,64,76,0.55)";
  g.lineWidth = 3;
  for (let i = 0; i < n; i++) {
    const lat = -0.7 + (1.4 * i) / (n - 1);
    const p = pt(u0, lat), q = pt(u1, lat);
    g.beginPath();
    g.moveTo(p.x, p.y);
    g.lineTo(q.x, q.y);
    g.stroke();
  }
  g.restore();
  // los bordes amarillos: ahí no se pisa
  for (const signo of [-1, 1]) {
    trapecio(g, u0, u1, signo * 0.72, signo);
    const yg = g.createLinearGradient(0, a.y, 0, b.y);
    yg.addColorStop(0, "#ffd34a");
    yg.addColorStop(0.5, "#ffb703");
    yg.addColorStop(1, "#e09400");
    g.fillStyle = yg;
    g.fill();
  }
  // el canto de delante, más oscuro, para que cada escalón se separe del siguiente
  trapecio(g, u1 - 0.012, u1 + 0.01, -1, 1);
  g.fillStyle = "#3c4550";
  g.fill();
  const labio = pt(u1, 0);
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(pt(u1, -1).x, labio.y);
  g.lineTo(pt(u1, 1).x, labio.y);
  g.stroke();
}

function cerda(g, x0, y0, x1, y1, w) {
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const tx = x0 + dx * 0.78, ty = y0 + dy * 0.78;
  g.beginPath();
  g.moveTo(x0 + nx * w, y0 + ny * w);
  g.lineTo(x0 - nx * w, y0 - ny * w);
  g.lineTo(tx - nx * w * 0.45, ty - ny * w * 0.45);
  g.lineTo(tx + nx * w * 0.45, ty + ny * w * 0.45);
  g.closePath();
  g.fillStyle = "#1a1a1a";
  g.fill();
  g.beginPath();
  g.moveTo(tx + nx * w * 0.45, ty + ny * w * 0.45);
  g.lineTo(tx - nx * w * 0.45, ty - ny * w * 0.45);
  g.lineTo(x1 - nx * w * 0.15, y1 - ny * w * 0.15);
  g.lineTo(x1 + nx * w * 0.15, y1 + ny * w * 0.15);
  g.closePath();
  g.fillStyle = "#ffc107";
  g.fill();
}

function cerdas(g, fase, bend, uZap) {
  const n = 36;
  for (const lado of [-1, 1]) {
    for (let i = 0; i < n; i++) {
      let u = (i / n + fase) % 1;
      if (u < 0.04 || u > 0.96) continue;
      const borde = pt(u, lado * 0.995);
      const dentro = pt(u, lado * 0.86);
      const cerca = Math.exp(-((u - uZap) ** 2) / 0.0018) * bend * (lado < 0 ? 1 : 0.4);
      const onda = Math.sin(fase * 36 + i * 1.7) * (5 + u * 8);
      const x2 = dentro.x - lado * (48 + cerca * 90);
      const y2 = dentro.y + onda + cerca * 22;
      cerda(g, borde.x, borde.y, x2, y2, 3.2 + u * 5);
    }
  }
}

// Un zapato blanco, de puntas hacia la izquierda, con el polvo pegado si hace falta.
const POLVO = Array.from({ length: 8 }, () => ({ x: azar(7)(), y: azar(9)(), r: 0.4 + azar(3)() }));
export function zapato(g, x, y, L, ang, polvo = 0, aplasto = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(1, 1 - aplasto * 0.08);
  const w = L * 0.42;
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.beginPath();
  g.ellipse(10, 16, L * 0.48, w * 0.55, 0, 0, 6.2832);
  g.fill();
  // la suela
  g.beginPath();
  g.moveTo(-L * 0.48, -w * 0.28);
  g.quadraticCurveTo(-L * 0.62, 0, -L * 0.48, w * 0.28);
  g.lineTo(L * 0.42, w * 0.34);
  g.quadraticCurveTo(L * 0.58, 0, L * 0.42, -w * 0.34);
  g.closePath();
  g.fillStyle = "#2b241c";
  g.fill();
  // la pala
  g.beginPath();
  g.moveTo(-L * 0.44, -w * 0.16);
  g.quadraticCurveTo(-L * 0.56, 0, -L * 0.44, w * 0.16);
  g.lineTo(L * 0.36, w * 0.22);
  g.quadraticCurveTo(L * 0.5, 0, L * 0.36, -w * 0.22);
  g.closePath();
  const pg = g.createLinearGradient(0, -w, 0, w);
  pg.addColorStop(0, "#ffffff");
  pg.addColorStop(0.45, "#f3f0ea");
  pg.addColorStop(1, "#c9c2b6");
  g.fillStyle = pg;
  g.fill();
  // la puntera
  g.beginPath();
  g.ellipse(-L * 0.3, 0, L * 0.2, w * 0.2, 0, 0, 6.2832);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fill();
  // los cordones
  g.strokeStyle = "#f7f4ee";
  g.lineWidth = Math.max(3, L * 0.025);
  for (let i = 0; i < 3; i++) {
    const lx = -L * 0.05 + i * L * 0.12;
    g.beginPath();
    g.moveTo(lx, -w * 0.08);
    g.lineTo(lx + L * 0.06, w * 0.08);
    g.moveTo(lx, w * 0.08);
    g.lineTo(lx + L * 0.06, -w * 0.08);
    g.stroke();
  }
  // la lengüeta roja del talón, sin marca
  k.redondo(g, L * 0.28, -w * 0.16, L * 0.12, w * 0.32, 8);
  g.fillStyle = "#e23b3b";
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(-L * 0.2, -w * 0.12);
  g.quadraticCurveTo(0, -w * 0.2, L * 0.22, -w * 0.1);
  g.stroke();
  if (polvo > 0.02) {
    g.globalAlpha *= polvo;
    g.fillStyle = "#6d5b40";
    for (const p of POLVO) {
      g.beginPath();
      g.ellipse(-L * 0.34 + p.x * L * 0.28, -w * 0.02 + (p.y - 0.5) * w * 0.3, 4 + p.r * 7, 3 + p.r * 4, p.x * 3, 0, 6.2832);
      g.fill();
    }
  }
  g.restore();
}

function cristal(g, lado) {
  const a = pt(0.05, lado * 1.02), b = pt(0.92, lado * 1.02), c = pt(0.92, lado * 1.42), d = pt(0.05, lado * 1.42);
  g.beginPath();
  g.moveTo(a.x, a.y);
  g.lineTo(b.x, b.y);
  g.lineTo(c.x, c.y);
  g.lineTo(d.x, d.y);
  g.closePath();
  const cg = g.createLinearGradient(a.x, 0, c.x, 0);
  cg.addColorStop(0, "rgba(170,230,240,0.1)");
  cg.addColorStop(0.5, "rgba(80,160,180,0.04)");
  cg.addColorStop(1, "rgba(220,255,255,0.12)");
  g.fillStyle = cg;
  g.fill();
  g.strokeStyle = "rgba(230,255,255,0.45)";
  g.lineWidth = 4;
  g.stroke();
}

function pasamanos(g) {
  g.save();
  g.lineCap = "round";
  g.lineJoin = "round";
  for (const lado of [-1, 1]) {
    g.beginPath();
    for (let i = 0; i <= 24; i++) {
      const p = pt(0.04 + (0.9 * i) / 24, lado * 1.46);
      if (i === 0) g.moveTo(p.x, p.y);
      else g.lineTo(p.x, p.y);
    }
    g.strokeStyle = "#121417";
    g.lineWidth = 28;
    g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.35)";
    g.lineWidth = 6;
    g.stroke();
  }
  g.restore();
}

export function mall(g, t, cam, o) {
  const fase = o.fase ?? 0;
  const bend = o.bend ?? 0.5;
  const polvo = o.polvo ?? 0;
  const lat = o.lat ?? -0.8;
  const alZap = o.zapato ?? 1;
  g.save();
  sinVista(g);
  g.fillStyle = "#071018";
  g.fillRect(0, 0, 1080, 1920);
  const cielo = g.createLinearGradient(0, 0, 0, 1920);
  cielo.addColorStop(0, "#123044");
  cielo.addColorStop(0.45, "#0b1c28");
  cielo.addColorStop(1, "#061018");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  vista(g, cam.z, cam.x, cam.y);
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const L of LUCES) {
    const p = pt(L.u, L.lat);
    const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, L.r);
    gr.addColorStop(0, `rgba(${L.c},0.55)`);
    gr.addColorStop(1, `rgba(${L.c},0)`);
    g.fillStyle = gr;
    g.beginPath();
    g.arc(p.x, p.y, L.r, 0, 6.2832);
    g.fill();
  }
  g.restore();

  cristal(g, -1);
  cristal(g, 1);
  for (let i = 0; i < 5; i++) escalon(g, 0.08 + i * 0.17, 0.22 + i * 0.17);

  // los remaches del lateral, quietos respecto al cepillo: pasan junto al escalón
  g.fillStyle = "#d7dde4";
  for (const lado of [-1, 1]) {
    for (const r of REMACHES) {
      const u = (r + fase * 0.35) % 1;
      if (u < 0.06 || u > 0.94) continue;
      const p = pt(u, lado * 1.08);
      g.beginPath();
      g.arc(p.x, p.y, 5 + u * 4, 0, 6.2832);
      g.fill();
    }
  }
  cerdas(g, fase, bend, UZ);
  if (cam.z < 1.65) pasamanos(g);
  if (alZap > 0.02) {
    const p = pt(UZ, lat);
    g.save();
    g.globalAlpha *= alZap;
    zapato(g, p.x, p.y, 390, -0.04, polvo, 0);
    g.restore();
  }
  velo(g, 0.62);
}

// ---------------------------------------------------------------- el corte: el escalón contra el lateral
export const GAP0 = -230, GAP1 = -150, STEP0 = -150, AMARILLO = 70;
const GROSOR = (GAP1 - GAP0) * (2.33 / 4);

export function fondoCorte(g) {
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#10161c");
  bg.addColorStop(0.5, "#1a140e");
  bg.addColorStop(1, "#07090c");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  const foco = g.createRadialGradient(280, 620, 40, 540, 900, 1100);
  foco.addColorStop(0, "rgba(255,196,120,0.28)");
  foco.addColorStop(0.4, "rgba(80,140,160,0.08)");
  foco.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = foco;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

function faldon(g) {
  g.beginPath();
  g.rect(-820, -200, GAP0 + 820, 2400);
  const mg = g.createLinearGradient(-820, 0, GAP0, 0);
  mg.addColorStop(0, "#2a3138");
  mg.addColorStop(0.55, "#8d98a3");
  mg.addColorStop(0.82, "#e6ebf0");
  mg.addColorStop(1, "#5c6670");
  g.fillStyle = mg;
  g.fill();
  g.save();
  g.beginPath();
  g.rect(-820, -200, GAP0 + 820, 2400);
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.35;
  g.drawImage(k.manchas, -900, -200, 900, 2200);
  g.restore();
  // tres tornillos que no se mueven: el lateral está quieto
  for (const y of [280, 860, 1440]) {
    g.beginPath();
    g.arc(-420, y, 22, 0, 6.2832);
    const tg = g.createRadialGradient(-428, y - 6, 2, -420, y, 22);
    tg.addColorStop(0, "#f4f7fa");
    tg.addColorStop(0.55, "#9aa3ad");
    tg.addColorStop(1, "#3e464e");
    g.fillStyle = tg;
    g.fill();
    g.strokeStyle = "rgba(0,0,0,0.45)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-432, y);
    g.lineTo(-408, y);
    g.stroke();
  }
}

function escalonCorte(g, fase) {
  const PASO = 560;
  const base = -fase;
  g.save();
  g.beginPath();
  g.rect(STEP0, -300, 1600, 2600);
  g.clip();
  const i0 = Math.floor((base - 400) / PASO) - 1;
  for (let i = i0; i < i0 + 8; i++) {
    const y = -base + i * PASO;
    const gr = g.createLinearGradient(STEP0, 0, 900, 0);
    gr.addColorStop(0, "#aeb6c0");
    gr.addColorStop(0.35, "#f2f5f8");
    gr.addColorStop(1, "#8b949e");
    g.fillStyle = gr;
    g.fillRect(STEP0, y, 1500, PASO - 18);
    g.save();
    g.beginPath();
    g.rect(STEP0, y, 1500, PASO - 18);
    g.clip();
    g.globalAlpha = 0.22;
    g.globalCompositeOperation = "multiply";
    g.drawImage(k.red, STEP0, y, 1500, PASO);
    g.restore();
    // ranuras longitudinales
    g.strokeStyle = "rgba(50,58,68,0.4)";
    g.lineWidth = 3;
    for (let x = STEP0 + 36; x < 1100; x += 36) {
      g.beginPath();
      g.moveTo(x, y + 8);
      g.lineTo(x, y + PASO - 26);
      g.stroke();
    }
    // borde amarillo, el del lado de la rendija
    const yg = g.createLinearGradient(STEP0, 0, AMARILLO, 0);
    yg.addColorStop(0, "#e39a00");
    yg.addColorStop(0.4, "#ffd24a");
    yg.addColorStop(1, "#ffb000");
    g.fillStyle = yg;
    g.fillRect(STEP0, y, AMARILLO - STEP0, PASO - 18);
    // la junta con el escalón de delante
    g.fillStyle = "#2c343c";
    g.fillRect(STEP0, y + PASO - 18, 1500, 18);
    g.fillStyle = "rgba(255,255,255,0.45)";
    g.fillRect(STEP0, y + PASO - 18, 1500, 3);
    // un tapón rojo que viaja con el escalón: así se ve que el metal se mueve
    g.beginPath();
    g.arc(340, y + 150, 26, 0, 6.2832);
    g.fillStyle = "#d62828";
    g.fill();
    g.beginPath();
    g.arc(340, y + 150, 12, 0, 6.2832);
    g.fillStyle = "#ffe08a";
    g.fill();
  }
  g.restore();
}

function rendija(g, alRojo) {
  g.fillStyle = "#07080a";
  g.fillRect(GAP0, -300, GAP1 - GAP0, 2600);
  const rg = g.createLinearGradient(GAP0, 0, GAP1, 0);
  rg.addColorStop(0, "rgba(0,0,0,0.2)");
  rg.addColorStop(0.5, `rgba(255,70,30,${0.15 + alRojo * 0.75})`);
  rg.addColorStop(1, "rgba(0,0,0,0.55)");
  g.fillStyle = rg;
  g.fillRect(GAP0, -300, GAP1 - GAP0, 2600);
  if (alRojo > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const br = g.createLinearGradient(GAP0, 0, GAP1 + 80, 0);
    br.addColorStop(0, `rgba(255,80,30,0)`);
    br.addColorStop(0.5, `rgba(255,90,40,${alRojo * 0.85})`);
    br.addColorStop(1, "rgba(255,80,30,0)");
    g.fillStyle = br;
    g.fillRect(GAP0 - 10, 200, GAP1 - GAP0 + 120, 1500);
    g.restore();
  }
}

function cepilloCorte(g, largo, yZap, bend) {
  if (largo <= 1) return;
  k.redondo(g, GAP0 - 46, 60, 42, 1800, 12);
  const rg = g.createLinearGradient(GAP0 - 46, 0, GAP0 - 4, 0);
  rg.addColorStop(0, "#4a545e");
  rg.addColorStop(0.45, "#f2f5f8");
  rg.addColorStop(1, "#2e363d");
  g.fillStyle = rg;
  g.fill();
  const n = 28;
  for (let i = 0; i < n; i++) {
    const y = 100 + i * 58;
    const cerca = yZap == null ? 0 : Math.exp(-((y - yZap) ** 2) / 18000) * bend;
    const x2 = GAP0 + largo * (1 - cerca * 0.12);
    const y2 = y + cerca * 40 + Math.sin(i * 1.4) * 5;
    cerda(g, GAP0 - 8, y, x2, y2, 16);
  }
}

function caraMoneda(g, x, y, r) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.arc(0, 6, r, 0, 6.2832);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.fill();
  g.beginPath();
  g.arc(0, 0, r, 0, 6.2832);
  const fg = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.08, 0, 0, r);
  fg.addColorStop(0, "#fff4c8");
  fg.addColorStop(0.55, "#e2b03a");
  fg.addColorStop(1, "#9a6814");
  g.fillStyle = fg;
  g.fill();
  g.beginPath();
  g.arc(0, 0, r * 0.68, 0, 6.2832);
  const sg = g.createRadialGradient(-r * 0.2, -r * 0.25, 4, 0, 0, r * 0.7);
  sg.addColorStop(0, "#ffffff");
  sg.addColorStop(0.6, "#d5dbe3");
  sg.addColorStop(1, "#8b97a3");
  g.fillStyle = sg;
  g.fill();
  g.beginPath();
  g.arc(0, 0, r * 0.68, 0, 6.2832);
  g.strokeStyle = "rgba(255,220,120,0.9)";
  g.lineWidth = r * 0.06;
  g.stroke();
  g.fillStyle = "#4d5862";
  g.font = `800 ${Math.round(r * 0.62)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("1", 0, r * 0.04);
  g.restore();
}

// Dos monedas, una sobre otra, al lado de la rendija. La cara se reconoce; el canto fino es el dato.
export function pilaMonedas(g, x, y, r = 128, n = 2, al = 1) {
  g.save();
  g.globalAlpha *= al;
  for (let i = 0; i < n; i++) caraMoneda(g, x, y - i * r * 0.7, r);
  g.restore();
}

export function cordon(g, x, y, largo, curva) {
  g.save();
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + largo * 0.45, y + curva, x + largo, y + curva * 0.3);
  g.strokeStyle = "#f4efe6";
  g.lineWidth = 10;
  g.stroke();
  g.strokeStyle = "#d9d0c4";
  g.lineWidth = 3;
  g.stroke();
  g.restore();
}

export function bajo(g, x, y, w, h) {
  g.save();
  g.translate(x, y);
  const pg = g.createLinearGradient(0, -h / 2, 0, h / 2);
  pg.addColorStop(0, "#3d6eb5");
  pg.addColorStop(0.5, "#244e86");
  pg.addColorStop(1, "#16365f");
  k.redondo(g, -w / 2, -h / 2, w, h, 18);
  g.fillStyle = pg;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(-w / 2, h / 2 - 10, w, 6);
  g.restore();
}

export function dibujaCorte(g, t, cam, o) {
  fondoCorte(g);
  vista(g, cam.z, cam.x, cam.y);
  escalonCorte(g, o.fase ?? 0);
  faldon(g);
  rendija(g, o.rojo ?? 0);
  if ((o.monedas ?? 0) > 0.02) pilaMonedas(g, o.mx ?? 40, o.my ?? 980, o.mr ?? 118, o.nMon ?? 2, o.monedas);
  if ((o.zapato ?? 0) > 0.02) {
    g.save();
    g.globalAlpha *= o.zapato;
    zapato(g, o.zx, o.zy, o.zL ?? 340, o.zang ?? 0, o.polvo ?? 0, o.aplasto ?? 0);
    g.restore();
  }
  if ((o.cordon ?? 0) > 0.02) {
    g.save();
    g.globalAlpha *= o.cordon;
    cordon(g, o.cx, o.cy, o.cLargo ?? 180, o.cCurva ?? 40);
    g.restore();
  }
  if ((o.bajo ?? 0) > 0.02) {
    g.save();
    g.globalAlpha *= o.bajo;
    bajo(g, o.bx, o.by, 150, 210);
    g.restore();
  }
  if ((o.polvoSuelo ?? 0) > 0.02) {
    g.save();
    g.globalAlpha *= o.polvoSuelo;
    g.fillStyle = "#6d5b40";
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      g.ellipse(520 + i * 28, 1040 + (i % 3) * 16, 8, 5, i, 0, 6.2832);
      g.fill();
    }
    g.restore();
  }
  cepilloCorte(g, o.largo ?? 0, o.yZap ?? null, o.bend ?? 0);
  velo(g, o.velo ?? 0.5);
}

export { GROSOR, suave, tramo, mez, entra, de };
