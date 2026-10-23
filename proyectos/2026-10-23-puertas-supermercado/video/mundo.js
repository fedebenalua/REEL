// La puerta del súper, la cajita de microondas, el motor y la gente. Lo comparten los planos.
import * as k from "#kit";

const { proyecta, tamano, uni, cruz, res, pto } = k;

export const SENSOR = [0, 2.72, 0.48];

const LUZ = uni([0.25, 0.85, 0.4]);
const VENTANAS = (() => {
  const az = k.azar(41);
  const v = [];
  for (let i = 0; i < 8; i++) for (let f = 0; f < 6; f++) for (let c = 0; c < 2; c++) v.push(az() > 0.45);
  return v;
})();

const CAJAS = [];
const TONOS = ["#ff4d6d", "#ffd60a", "#4cc9f0", "#80ed99", "#ff9f1c", "#c77dff", "#ffffff", "#ff6b35", "#f72585", "#4cc9f0"];
for (let fila = 0; fila < 3; fila++) {
  for (let i = 0; i < 7; i++) {
    CAJAS.push({
      x: -2.15 + i * 0.72,
      y: 0.35 + fila * 0.62,
      z: -0.85 - (i % 2) * 0.15,
      w: 0.48, h: 0.42, d: 0.38,
      color: TONOS[(i + fila * 3) % TONOS.length],
    });
    CAJAS.push({
      x: -2.15 + i * 0.72,
      y: 0.35 + fila * 0.62,
      z: -2.15,
      w: 0.48, h: 0.42, d: 0.38,
      color: TONOS[(i + fila * 2 + 4) % TONOS.length],
    });
  }
}

function rgbDe(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function tono(c, s) {
  const k0 = Math.max(0, Math.min(1.4, s));
  return `rgb(${Math.round(c[0] * k0)},${Math.round(c[1] * k0)},${Math.round(c[2] * k0)})`;
}

function camino(g, pts) {
  g.beginPath();
  g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
  g.closePath();
}

function cara(cam, pts, color, alfa = 1) {
  const pr = pts.map((p) => proyecta(cam, p));
  if (pr.some((p) => !p)) return null;
  const n = uni(cruz(res(pts[1], pts[0]), res(pts[2], pts[0])));
  const centro = pts.reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map((v) => v / pts.length);
  const vista = uni(res(cam.p, centro));
  if (pto(n, vista) <= 0.02) return null;
  const s = 0.32 + 0.78 * Math.max(0, pto(n, LUZ));
  const z = pr.reduce((a, p) => a + p.z, 0) / pr.length;
  const col = typeof color === "string" ? rgbDe(color) : color;
  return {
    z,
    dibuja(g) {
      g.globalAlpha = alfa;
      camino(g, pr);
      g.fillStyle = tono(col, s);
      g.fill();
      g.globalAlpha = 1;
    },
  };
}

function caja(cam, x, y, z, w, h, d, color) {
  const x0 = x - w / 2, x1 = x + w / 2, y0 = y, y1 = y + h, z0 = z - d / 2, z1 = z + d / 2;
  const caras = [
    [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
    [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]],
    [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]],
    [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]],
    [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]],
    [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]],
  ];
  const out = [];
  for (const pts of caras) {
    const c = cara(cam, pts, color);
    if (c) out.push(c);
  }
  return out;
}

function suelo(cam, cosas) {
  for (let x = -5; x < 5; x += 0.9) {
    for (let z = -2.2; z < 8; z += 0.9) {
      const dentro = z < 0.05;
      const par = ((x + 5) / 0.9 + (z + 3) / 0.9) % 2 < 1;
      const color = dentro ? (par ? "#16324a" : "#1c4060") : (par ? "#14202c" : "#1b2c3c");
      const c = cara(cam, [[x, 0, z], [x, 0, z + 0.9], [x + 0.9, 0, z + 0.9], [x + 0.9, 0, z]], color);
      if (c) cosas.push(c);
    }
  }
}

function edificio(cam, cosas) {
  // paredes laterales, dintel y fondo del súper
  cosas.push(...caja(cam, -2.55, 0, 0.15, 1.5, 3.5, 0.7, "#1a3044"));
  cosas.push(...caja(cam, 2.55, 0, 0.15, 1.5, 3.5, 0.7, "#1a3044"));
  cosas.push(...caja(cam, 0, 2.95, 0.05, 3.6, 0.7, 0.85, "#24384c"));
  cosas.push(...caja(cam, 0, 0, -3.3, 6.2, 3.4, 0.2, "#102433"));
  // estantes
  cosas.push(...caja(cam, 0, 0, -0.9, 5.2, 0.12, 0.55, "#2a211c"));
  cosas.push(...caja(cam, 0, 0.95, -0.9, 5.2, 0.08, 0.55, "#3a2c24"));
  cosas.push(...caja(cam, 0, 1.6, -0.9, 5.2, 0.08, 0.55, "#3a2c24"));
  cosas.push(...caja(cam, 0, 0, -2.2, 5.2, 0.12, 0.55, "#2a211c"));
  cosas.push(...caja(cam, 0, 0.95, -2.2, 5.2, 0.08, 0.55, "#3a2c24"));
  cosas.push(...caja(cam, 0, 1.6, -2.2, 5.2, 0.08, 0.55, "#3a2c24"));
  for (const b of CAJAS) cosas.push(...caja(cam, b.x, b.y, b.z, b.w, b.h, b.d, b.color));
  // tubos del techo
  cosas.push(...caja(cam, -0.7, 3.05, -1.4, 0.16, 0.08, 2.2, "#f4f7ff"));
  cosas.push(...caja(cam, 0.7, 3.05, -1.4, 0.16, 0.08, 2.2, "#f4f7ff"));
}

function hojas(cam, abertura, cosas) {
  const w = 1.62;
  const despl = abertura * 1.5;
  const marcos = [
    [-w - despl, -despl],
    [despl, w + despl],
  ];
  for (const [x0, x1] of marcos) {
    const mx = (x0 + x1) / 2, mw = x1 - x0;
    cosas.push(...caja(cam, mx, 0, 0.04, mw, 0.1, 0.1, "#d5dde6"));
    cosas.push(...caja(cam, mx, 2.38, 0.04, mw, 0.14, 0.1, "#d5dde6"));
    cosas.push(...caja(cam, x0 + 0.05, 0.1, 0.04, 0.1, 2.28, 0.1, "#e8eef4"));
    cosas.push(...caja(cam, x1 - 0.05, 0.1, 0.04, 0.1, 2.28, 0.1, "#e8eef4"));
    // tirador
    const lado = x0 < 0 ? x1 - 0.16 : x0 + 0.16;
    cosas.push(...caja(cam, lado, 0.95, 0.12, 0.06, 0.7, 0.06, "#f4f7fb"));
  }
}

function cristal(g, cam, abertura) {
  const w = 1.62;
  const despl = abertura * 1.5;
  const panes = [
    [-w - despl + 0.1, -despl - 0.06],
    [despl + 0.06, w + despl - 0.1],
  ];
  for (const [x0, x1] of panes) {
    const pr = [[x0, 0.14, 0.06], [x1, 0.14, 0.06], [x1, 2.36, 0.06], [x0, 2.36, 0.06]].map((p) => proyecta(cam, p));
    if (pr.some((p) => !p)) continue;
    g.save();
    camino(g, pr);
    const gx = g.createLinearGradient(pr[0].x, pr[0].y, pr[1].x, pr[3].y);
    gx.addColorStop(0, "rgba(220,245,255,0.20)");
    gx.addColorStop(0.35, "rgba(180,220,255,0.05)");
    gx.addColorStop(0.7, "rgba(255,255,255,0.16)");
    gx.addColorStop(1, "rgba(140,190,230,0.08)");
    g.fillStyle = gx;
    g.fill();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = "rgba(255,244,210,0.18)";
    g.fill();
    g.restore();
  }
}

function cajita(cam, cosas) {
  cosas.push(...caja(cam, SENSOR[0], SENSOR[1] - 0.1, SENSOR[2], 0.95, 0.26, 0.4, "#12141a"));
  cosas.push(...caja(cam, SENSOR[0], SENSOR[1] - 0.02, SENSOR[2] + 0.18, 0.32, 0.12, 0.08, "#08383c"));
}

function motor(cam, t, spin, cosas) {
  const n = 16;
  const radio = 0.34, largo = 0.72;
  const cx = 0, cy = 2.62, cz = 0.22;
  for (let i = 0; i < n; i++) {
    const a0 = spin + (i / n) * Math.PI * 2;
    const a1 = spin + ((i + 1) / n) * Math.PI * 2;
    const y0 = cy + Math.cos(a0) * radio, z0 = cz + Math.sin(a0) * radio;
    const y1 = cy + Math.cos(a1) * radio, z1 = cz + Math.sin(a1) * radio;
    const franja = i % 3 === 0;
    const color = franja ? "#ff7a1a" : "#d5dde6";
    const c = cara(cam, [
      [-largo, y0, z0], [largo, y0, z0], [largo, y1, z1], [-largo, y1, z1],
    ], color);
    if (c) cosas.push(c);
  }
  // tapas
  cosas.push(...caja(cam, -0.95, 2.42, 0.22, 0.22, 0.22, 0.22, "#f4f7fb"));
  cosas.push(...caja(cam, 0.95, 2.42, 0.22, 0.22, 0.22, 0.22, "#f4f7fb"));
  cosas.push(...caja(cam, 0, 2.5, 0.32, 2.15, 0.05, 0.06, "#14161a"));
}

function miembro(g, a, b, px, color) {
  if (!a || !b) return;
  g.strokeStyle = color;
  g.lineWidth = px;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(a.x, a.y);
  g.lineTo(b.x, b.y);
  g.stroke();
}

function disco(g, p, r, color, claro = "#fff6ee") {
  if (!p || r < 1) return;
  const gr = g.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, r * 0.05, p.x, p.y, r);
  gr.addColorStop(0, claro);
  gr.addColorStop(0.35, color);
  gr.addColorStop(1, "#120c0a");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(p.x, p.y, r, 0, 6.2832);
  g.fill();
}

// Una persona con volumen. pose: "anda" | "quieto" | "cruzado".
export function persona(g, cam, o) {
  const { x, z, pose, fase, chaqueta, pelo = "#241812" } = o;
  const paso = o.paso != null ? o.paso : (pose === "anda" ? Math.sin(fase) : 0);
  const P = (y, dx = 0, dz = 0) => proyecta(cam, [x + dx, y, z + dz]);
  const cadera = P(0.95), pecho = P(1.28), cabeza = P(1.64);
  if (!cadera || !pecho || !cabeza) return;
  const s = tamano(1, pecho.z);
  const grosor = Math.max(8, 0.16 * s);
  const piel = "#f3c4a2";
  const rodL = P(0.5, -0.12, 0.2 * paso), rodR = P(0.5, 0.12, -0.2 * paso);
  const pieL = P(0.04, -0.12, 0.32 * paso), pieR = P(0.04, 0.12, -0.32 * paso);
  miembro(g, cadera, rodL, grosor * 0.85, "#24448a");
  miembro(g, rodL, pieL, grosor * 0.75, "#24448a");
  miembro(g, cadera, rodR, grosor * 0.85, "#24448a");
  miembro(g, rodR, pieR, grosor * 0.75, "#24448a");
  disco(g, pieL, grosor * 0.55, "#f4f4f4", "#ffffff");
  disco(g, pieR, grosor * 0.55, "#f4f4f4", "#ffffff");
  // torso, ancho
  g.save();
  const tg = g.createLinearGradient(pecho.x - grosor, pecho.y, pecho.x + grosor, cadera.y);
  tg.addColorStop(0, "#fff");
  tg.addColorStop(0.25, chaqueta);
  tg.addColorStop(1, "#1a0c0c");
  g.fillStyle = tg;
  g.beginPath();
  g.ellipse(pecho.x, (pecho.y + cadera.y) / 2, grosor * 1.35, Math.abs(cadera.y - pecho.y) * 0.72, 0, 0, 6.28);
  g.fill();
  g.restore();
  const hL = P(1.4, -0.28), hR = P(1.4, 0.28);
  const mL = pose === "cruzado" ? P(1.16, 0.16, 0.1) : P(1.0, -0.32, -0.12 * paso);
  const mR = pose === "cruzado" ? P(1.22, -0.16, 0.1) : P(1.0, 0.32, 0.12 * paso);
  miembro(g, hL, mL, grosor * 0.62, chaqueta);
  miembro(g, hR, mR, grosor * 0.62, chaqueta);
  disco(g, mL, grosor * 0.38, piel, "#ffe0cc");
  disco(g, mR, grosor * 0.38, piel, "#ffe0cc");
  const hr = Math.max(10, tamano(0.16, cabeza.z));
  disco(g, cabeza, hr, piel, "#ffe6d4");
  g.fillStyle = pelo;
  g.beginPath();
  g.arc(cabeza.x, cabeza.y - hr * 0.08, hr * 1.05, Math.PI * 0.95, Math.PI * 2.05);
  g.fill();
  const deFrente = cam.p[2] > z + 0.12;
  if (deFrente && hr > 14) {
    g.fillStyle = "#24180f";
    const e = hr * 0.14;
    g.beginPath(); g.ellipse(cabeza.x - hr * 0.32, cabeza.y - hr * 0.02, e, e * 1.2, 0, 0, 6.28); g.fill();
    g.beginPath(); g.ellipse(cabeza.x + hr * 0.32, cabeza.y - hr * 0.02, e, e * 1.2, 0, 0, 6.28); g.fill();
    g.strokeStyle = "#c48b74";
    g.lineWidth = Math.max(2, hr * 0.08);
    g.beginPath();
    g.arc(cabeza.x, cabeza.y + hr * 0.28, hr * 0.22, 0.15, Math.PI - 0.15);
    g.stroke();
  }
}

// Viaje sin los tirones de una curva que se pasa de la clave: de un punto al siguiente, y se queda.
export function viaje(lista) {
  return (t) => {
    if (t <= lista[0][0]) return lista[0][1];
    const n = lista.length - 1;
    if (t >= lista[n][0]) return lista[n][1];
    let j = 0;
    while (t > lista[j + 1][0]) j++;
    const u = k.suave((t - lista[j][0]) / (lista[j + 1][0] - lista[j][0]));
    return lista[j][1].map((v, i) => v + (lista[j + 1][1][i] - v) * u);
  };
}

function rotulo(g, cam) {
  const p = proyecta(cam, [0, 3.42, 0.42]);
  if (!p || p.z > 12) return;
  const s = tamano(0.42, p.z);
  if (s < 10) return;
  g.save();
  g.translate(p.x, p.y);
  const w = s * 3.4, h = s * 1.15;
  k.redondo(g, -w / 2, -h / 2, w, h, h * 0.28);
  g.fillStyle = "#ff3b30";
  g.fill();
  g.fillStyle = "#fff4ea";
  g.font = `800 ${Math.round(s * 0.82)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("SÚPER", 0, h * 0.04);
  g.restore();
}

function ondas(g, cam, st) {
  if (st.ondas < 0.02) return;
  const p = proyecta(cam, SENSOR);
  if (!p) return;
  const base = Math.max(28, tamano(0.42, p.z));
  const sep = base * (1.35 - 0.72 * st.apriete);
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  for (let i = 0; i < 6; i++) {
    const rr = base * 0.35 + ((st.fase * base * 0.55 + i * sep) % (sep * 6));
    const apretado = st.apriete;
    g.strokeStyle = `rgba(${apretado > 0.4 ? "230,255,255" : "90,235,255"},${(0.28 + 0.4 * apretado) * st.ondas})`;
    g.lineWidth = 5 + 7 * apretado;
    g.beginPath();
    g.arc(p.x, p.y, rr, 0.35, Math.PI - 0.35);
    g.stroke();
  }
  g.restore();
  k.brillo(g, p.x, p.y, base * 2.2, "cian", 0.45 * st.ondas);
}

function infrarrojos(g, cam, al) {
  if (al < 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 12; i++) {
    const x = -1.45 + (i % 12) * (2.9 / 11);
    const z = i % 2 === 0 ? 0.18 : 0.42;
    const p = proyecta(cam, [x, 0.03, z]);
    if (!p) continue;
    const r = tamano(0.07, p.z);
    k.brillo(g, p.x, p.y, r * 7, "fuego", al * 0.85);
    g.fillStyle = `rgba(255,186,80,${al})`;
    g.beginPath();
    g.ellipse(p.x, p.y, r * 1.4, r * 0.55, 0, 0, 6.28);
    g.fill();
  }
  g.restore();
}

export function velo(g) {
  const v = g.createLinearGradient(0, 250, 0, 560);
  v.addColorStop(0, "rgba(2,6,12,0.78)");
  v.addColorStop(1, "rgba(2,6,12,0)");
  g.fillStyle = v;
  g.fillRect(0, 230, 1080, 360);
}

function fondo(g, cam) {
  g.fillStyle = "#071018";
  g.fillRect(0, 0, 1080, 1920);
  const cielo = g.createLinearGradient(0, 0, 0, 1200);
  cielo.addColorStop(0, "#07111c");
  cielo.addColorStop(0.55, "#14324c");
  cielo.addColorStop(1, "#071018");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1200);
  // el resplandor cálido del súper, anclado a la puerta
  const p = proyecta(cam, [0, 1.4, 0]);
  if (p) {
    const rad = Math.min(1600, tamano(3.2, p.z));
    const gr = g.createRadialGradient(p.x, p.y, 20, p.x, p.y, rad);
    gr.addColorStop(0, "rgba(255,226,170,0.55)");
    gr.addColorStop(0.4, "rgba(255,170,90,0.16)");
    gr.addColorStop(1, "rgba(255,140,60,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 1080, 1920);
  }
}

// st: { abertura, ondas, apriete, fase, ir, spin, gente: [] }
export function puerta(g, cam, st) {
  fondo(g, cam);
  const cosas = [];
  suelo(cam, cosas);
  edificio(cam, cosas);
  hojas(cam, st.abertura, cosas);
  cajita(cam, cosas);
  if (st.spin != null) motor(cam, 0, st.spin, cosas);
  cosas.sort((a, b) => b.z - a.z);
  for (const c of cosas) c.dibuja(g);
  cristal(g, cam, st.abertura);
  for (const personaO of st.gente) persona(g, cam, personaO);
  ondas(g, cam, st);
  infrarrojos(g, cam, st.ir || 0);
  rotulo(g, cam);
  // luz de dentro cuando las hojas están abiertas
  if (st.abertura > 0.2) {
    const p = proyecta(cam, [0, 1.5, -0.4]);
    if (p) k.brillo(g, p.x, p.y, tamano(2.2, p.z) * st.abertura, "amarilla", 0.35 * st.abertura);
  }
  velo(g);
}

// La ambulancia, otro sitio. u 0→1 se acerca; al final se queda.
export function ambulancia(g, u) {
  g.fillStyle = "#070712";
  g.fillRect(0, 0, 1080, 1920);
  const cielo = g.createLinearGradient(0, 0, 0, 1100);
  cielo.addColorStop(0, "#100818");
  cielo.addColorStop(0.5, "#24102a");
  cielo.addColorStop(1, "#0c1018");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1400, 1200);
  // fachadas
  g.save();
  let vi = 0;
  for (let i = 0; i < 8; i++) {
    const x = 40 + i * 140;
    g.fillStyle = i % 2 ? "#1a1030" : "#12182c";
    g.fillRect(x, 280, 120, 700);
    for (let f = 0; f < 6; f++) {
      for (let c = 0; c < 2; c++) {
        g.fillStyle = VENTANAS[vi++] ? "rgba(255,196,110,0.85)" : "rgba(40,50,80,0.5)";
        g.fillRect(x + 22 + c * 48, 340 + f * 90, 28, 42);
      }
    }
  }
  g.restore();
  // calzada
  g.fillStyle = "#12161e";
  g.beginPath();
  g.moveTo(180, 980);
  g.lineTo(900, 980);
  g.lineTo(1200, 1920);
  g.lineTo(-120, 1920);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(255,220,120,0.35)";
  g.lineWidth = 8;
  g.setLineDash([28, 36]);
  g.beginPath();
  g.moveTo(540, 1000);
  g.lineTo(540, 1900);
  g.stroke();
  g.setLineDash([]);

  const esc = k.mez(0.62, 1.18, k.suave(u));
  const cx = 540, cy = k.mez(1180, 1080, u);
  g.save();
  g.translate(cx, cy);
  g.scale(esc, esc);
  // sombra
  g.fillStyle = "rgba(0,0,0,0.45)";
  g.beginPath();
  g.ellipse(0, 430, 340, 40, 0, 0, 6.28);
  g.fill();
  // ruedas
  g.fillStyle = "#141414";
  g.beginPath(); g.ellipse(-230, 360, 70, 70, 0, 0, 6.28); g.fill();
  g.beginPath(); g.ellipse(230, 360, 70, 70, 0, 0, 6.28); g.fill();
  g.fillStyle = "#3a3a3a";
  g.beginPath(); g.ellipse(-230, 360, 32, 32, 0, 0, 6.28); g.fill();
  g.beginPath(); g.ellipse(230, 360, 32, 32, 0, 0, 6.28); g.fill();
  // caja amarilla
  const cuerpo = g.createLinearGradient(-320, -80, 320, 420);
  cuerpo.addColorStop(0, "#ffe56a");
  cuerpo.addColorStop(0.45, "#ffc107");
  cuerpo.addColorStop(1, "#e39b00");
  k.redondo(g, -330, -40, 660, 420, 36);
  g.fillStyle = cuerpo;
  g.fill();
  // franja roja
  g.fillStyle = "#e11d2e";
  g.fillRect(-330, 150, 660, 54);
  g.fillStyle = "#fff";
  g.fillRect(-330, 204, 660, 10);
  // parabrisas
  k.redondo(g, -250, 10, 500, 150, 18);
  g.fillStyle = "#16324a";
  g.fill();
  const refl = g.createLinearGradient(-250, 10, 80, 160);
  refl.addColorStop(0, "rgba(255,255,255,0.45)");
  refl.addColorStop(0.4, "rgba(255,255,255,0.05)");
  refl.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = refl;
  k.redondo(g, -250, 10, 500, 150, 18);
  g.fill();
  // faros
  g.fillStyle = "#f4f7ff";
  k.redondo(g, -280, 250, 110, 70, 16); g.fill();
  k.redondo(g, 170, 250, 110, 70, 16); g.fill();
  // puente de luces
  k.redondo(g, -180, -90, 360, 54, 16);
  g.fillStyle = "#1c1c22";
  g.fill();
  g.restore();

  // los anillos de la sirena se aprietan al acercarse
  const gap = k.mez(150, 58, k.suave(u));
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 1; i <= 5; i++) {
    const rr = 80 + i * gap;
    g.strokeStyle = `rgba(255,236,180,${0.15 + 0.12 * (1 - i / 6)})`;
    g.lineWidth = 8;
    g.beginPath();
    g.ellipse(cx, cy - 20 * esc, rr * esc * 0.7, rr * esc * 0.42, 0, 0, 6.28);
    g.stroke();
  }
  g.restore();
  k.brillo(g, cx - 200 * esc, cy + 270 * esc, 220 * esc, "amarilla", 0.7);
  k.brillo(g, cx + 200 * esc, cy + 270 * esc, 220 * esc, "amarilla", 0.7);
  // la luz del puente, continua, sin saltos: un lado y el otro se relevan en un seno
  const lado = 0.5 + 0.5 * Math.sin(u * 5);
  k.brillo(g, cx - 70 * esc, cy - 70 * esc, 180 * esc, "roja", 0.35 + 0.45 * lado);
  k.brillo(g, cx + 70 * esc, cy - 70 * esc, 180 * esc, "azul", 0.35 + 0.45 * (1 - lado));
  velo(g);
}
