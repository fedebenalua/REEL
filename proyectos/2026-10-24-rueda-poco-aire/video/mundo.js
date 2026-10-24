// El coche, la carretera de noche, las ruedas y el interior del neumático. Lo comparten los planos.
import * as k from "#kit";

const { proyecta, tamano, uni, cruz, res, pto } = k;

// Metros recorridos integrando una velocidad. El paso es fijo para que de un fotograma al siguiente no haya tirón.
export function recorrido(t, t0, vel) {
  const dt = 1 / 30;
  if (t <= t0) return 0;
  const n = Math.floor((t - t0) / dt);
  let m = 0;
  for (let i = 0; i < n; i++) m += vel(t0 + (i + 0.5) * dt) * dt;
  const resto = t - t0 - n * dt;
  if (resto > 1e-6) m += vel(t0 + n * dt + resto / 2) * resto;
  return m;
}

export function viaje(lista) {
  const L = lista.slice().sort((a, b) => a[0] - b[0]);
  return (t) => {
    if (t <= L[0][0]) return L[0][1];
    const n = L.length - 1;
    if (t >= L[n][0]) return L[n][1];
    let j = 0;
    while (t > L[j + 1][0]) j++;
    const span = L[j + 1][0] - L[j][0] || 1e-4;
    const u = k.suave((t - L[j][0]) / span);
    return L[j][1].map((v, i) => v + (L[j + 1][1][i] - v) * u);
  };
}

const LUZ = uni([0.25, 0.82, 0.5]);
const ROJO = [230, 42, 58];
const R0 = 0.33;

export const EJES = [
  { x: -1.35, z: 0.88 },
  { x: 1.28, z: 0.88 },
  { x: -1.35, z: -0.88 },
  { x: 1.28, z: -0.88 },
];

export function caidaY(x, aplastDelante, aplastTodas) {
  const u = k.tramo(x, 1.55, -1.95);
  return -0.075 * aplastDelante * u - 0.05 * aplastTodas;
}

export function radioDe(aplast) {
  return R0 * (1 - 0.4 * aplast);
}

function camino(g, pr) {
  g.beginPath();
  g.moveTo(pr[0].x, pr[0].y);
  for (let i = 1; i < pr.length; i++) g.lineTo(pr[i].x, pr[i].y);
  g.closePath();
}

function sombra(rgb, s) {
  const k0 = Math.max(0.08, Math.min(1.45, s));
  return `rgb(${rgb.map((c) => Math.min(255, Math.round(c * k0))).join(",")})`;
}

function cara(cosas, cam, pts, rgb) {
  const pr = pts.map((p) => proyecta(cam, p));
  if (pr.some((p) => !p)) return;
  const nrm = uni(cruz(res(pts[1], pts[0]), res(pts[2], pts[0])));
  const centro = [0, 1, 2].map((i) => (pts[0][i] + pts[1][i] + pts[2][i] + pts[3][i]) / 4);
  if (pto(nrm, uni(res(cam.p, centro))) <= 0.015) return;
  const s = 0.26 + 0.95 * Math.max(0, pto(nrm, LUZ));
  const z = pr.reduce((a, p) => a + p.z, 0) / pr.length;
  cosas.push({
    z,
    dibuja(g) {
      camino(g, pr);
      g.fillStyle = sombra(rgb, s);
      g.fill();
    },
  });
}

// Perfil de un compacto, en el plano de lado. Los pasos de rueda suben para dejar ver la goma.
const PERFIL = [
  [-2.20, 0.42], [-2.24, 0.58], [-2.02, 0.74], [-1.55, 0.84], [-0.95, 0.92],
  [-0.58, 1.16], [-0.28, 1.44], [0.20, 1.52], [0.72, 1.52], [1.08, 1.26],
  [1.42, 1.00], [1.82, 0.90], [2.12, 0.74], [2.16, 0.46], [1.92, 0.36],
  [1.70, 0.40], [1.62, 0.62], [1.42, 0.76], [1.22, 0.76], [1.02, 0.58], [0.92, 0.36],
  [-0.88, 0.34], [-0.98, 0.58], [-1.16, 0.76], [-1.35, 0.80], [-1.56, 0.74], [-1.76, 0.54], [-1.88, 0.38],
];
const VENTANAS = [
  [[-0.48, 1.02], [-0.22, 1.38], [0.48, 1.40], [0.62, 1.04]],
  [[0.78, 1.02], [0.70, 1.26], [1.02, 1.10], [1.12, 0.90]],
];

function ptsPerfil(z, aplastDelante, aplastTodas) {
  return PERFIL.map(([x, y]) => [x, y + caidaY(x, aplastDelante, aplastTodas), z]);
}

function coche(cosas, cam, aplastDelante, aplastTodas) {
  const cerca = ptsPerfil(0.92, aplastDelante, aplastTodas);
  const lejos = ptsPerfil(-0.9, aplastDelante, aplastTodas);
  const prL = proyectados(cam, lejos);
  if (prL) {
    const z = prL.reduce((a, p) => a + p.z, 0) / prL.length;
    cosas.push({
      z: z + 2.2,
      dibuja(g) {
        camino(g, prL);
        g.fillStyle = "#4a0c16";
        g.fill();
      },
    });
  }
  // la cara cercana, un solo polígono, para que se lea la forma
  const pr = proyectados(cam, cerca);
  if (pr) {
    const z = pr.reduce((a, p) => a + p.z, 0) / pr.length;
    cosas.push({
      z: z + 1.4,
      dibuja(g) {
        camino(g, pr);
        const ys = pr.map((p) => p.y), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const xs = pr.map((p) => p.x), x0 = Math.min(...xs), x1 = Math.max(...xs);
        const gr = g.createLinearGradient(x0, y0, x1, y1);
        gr.addColorStop(0, "#ff8d96");
        gr.addColorStop(0.35, "#ff3148");
        gr.addColorStop(0.75, "#c4122c");
        gr.addColorStop(1, "#6e0c18");
        g.fillStyle = gr;
        g.fill();
        g.save();
        g.clip();
        g.globalCompositeOperation = "screen";
        g.globalAlpha = 0.18;
        g.drawImage(k.manchas, x0, y0, x1 - x0, (y1 - y0) * 0.6);
        g.restore();
      },
    });
  }
  for (const vent of VENTANAS) {
    const pts = vent.map(([x, y]) => [x, y + caidaY(x, aplastDelante, aplastTodas), 0.94]);
    cara(cosas, cam, pts, [186, 230, 255]);
  }
  const dyF = caidaY(-2.12, aplastDelante, aplastTodas);
  const dyT = caidaY(2.1, aplastDelante, aplastTodas);
  cara(cosas, cam, [[-2.18, 0.50 + dyF, 0.55], [-2.22, 0.66 + dyF, 0.55], [-2.22, 0.66 + dyF, 0.78], [-2.18, 0.50 + dyF, 0.78]], [255, 244, 210]);
  cara(cosas, cam, [[2.14, 0.52 + dyT, 0.55], [2.16, 0.68 + dyT, 0.55], [2.16, 0.68 + dyT, 0.78], [2.14, 0.52 + dyT, 0.78]], [255, 60, 70]);
}

function anillo(C, R, z, giro, n, aplast, ond, fase) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = giro + (i / n) * Math.PI * 2;
    const rr = R * (1 + ond * Math.sin(3 * a + fase));
    let xx = Math.cos(a) * rr;
    let yy = Math.sin(a) * rr;
    if (yy < 0 && aplast > 0) {
      const f = -yy / rr;
      xx *= 1 + 0.35 * aplast * f;
      yy *= 1 - 0.55 * aplast;
    }
    pts.push([C[0] + xx, C[1] + yy, z]);
  }
  return pts;
}

function proyectados(cam, pts) {
  const pr = pts.map((p) => proyecta(cam, p));
  if (pr.some((p) => !p)) return null;
  return pr;
}

function ruedaItem(cam, eje, aplast, giro, ond, fase, aplastDelante, aplastTodas) {
  const R = radioDe(aplast);
  const C = [eje.x, R * (1 - 0.15 * aplast) + 0.02 + caidaY(eje.x, aplastDelante, aplastTodas), eje.z];
  const signo = cam.p[2] >= eje.z ? 1 : -1;
  const cerca = C[2] + signo * 0.11;
  const lejos = C[2] - signo * 0.11;
  const n = 32;
  const out = proyectados(cam, anillo(C, R, cerca, giro, n, aplast, ond, fase));
  const inn = proyectados(cam, anillo(C, R * 0.56, cerca, giro, n, aplast, ond * 0.4, fase));
  const outL = proyectados(cam, anillo(C, R, lejos, giro, n, aplast, ond, fase));
  if (!out || !inn) return null;
  const c = proyecta(cam, C);
  if (!c) return null;
  const borde = proyecta(cam, [C[0] + R, C[1], cerca]);
  const rx = borde ? Math.hypot(borde.x - c.x, borde.y - c.y) : tamano(R, c.z);
  return {
    z: c.z,
    dibuja(g) {
      if (outL) {
        camino(g, outL);
        g.fillStyle = "#14161c";
        g.fill();
      }
      g.beginPath();
      out.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.closePath();
      for (let i = inn.length - 1; i >= 0; i--) g.lineTo(inn[i].x, inn[i].y);
      g.closePath();
      const gr = g.createRadialGradient(c.x - rx * 0.28, c.y - rx * 0.34, rx * 0.15, c.x, c.y, rx * 1.15);
      gr.addColorStop(0, "#4a5366");
      gr.addColorStop(0.55, "#232833");
      gr.addColorStop(1, "#101218");
      g.fillStyle = gr;
      g.fill("evenodd");
      // llanta
      camino(g, inn);
      const lg = g.createRadialGradient(c.x - rx * 0.12, c.y - rx * 0.16, rx * 0.05, c.x, c.y, rx * 0.62);
      lg.addColorStop(0, "#f4fffd");
      lg.addColorStop(0.35, "#7ef0e4");
      lg.addColorStop(0.72, "#149e96");
      lg.addColorStop(1, "#0c3e40");
      g.fillStyle = lg;
      g.fill();
      g.save();
      g.strokeStyle = "rgba(255,255,255,0.55)";
      g.lineWidth = Math.max(2, rx * 0.025);
      g.beginPath();
      for (let s = 0; s < 5; s++) {
        const a = giro + (s / 5) * Math.PI * 2;
        const p1 = proyecta(cam, [C[0] + Math.cos(a) * R * 0.16, C[1] + Math.sin(a) * R * 0.16, cerca]);
        const p2 = proyecta(cam, [C[0] + Math.cos(a) * R * 0.52, C[1] + Math.sin(a) * R * 0.52, cerca]);
        if (!p1 || !p2) continue;
        g.moveTo(p1.x, p1.y);
        g.lineTo(p2.x, p2.y);
      }
      g.stroke();
      // la raya blanca que enseña las vueltas
      const a0 = giro;
      const s1 = proyecta(cam, [C[0] + Math.cos(a0) * R * 0.64, C[1] + Math.sin(a0) * R * 0.64, cerca]);
      const s2 = proyecta(cam, [C[0] + Math.cos(a0) * R * 0.96, C[1] + Math.sin(a0) * R * 0.96, cerca]);
      if (s1 && s2) {
        g.strokeStyle = "#fff8ee";
        g.lineWidth = Math.max(5, rx * 0.09);
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(s1.x, s1.y);
        g.lineTo(s2.x, s2.y);
        g.stroke();
      }
      g.restore();
      // cuña clara: las vueltas se leen aunque la cámara esté quieta
      g.beginPath();
      const a1 = giro;
      const span = 1.2;
      const cuña = (ang) => {
        let xx = Math.cos(ang) * R * 0.94;
        let yy = Math.sin(ang) * R * 0.94;
        if (yy < 0 && aplast > 0) {
          const f = -yy / (R * 0.94);
          xx *= 1 + 0.35 * aplast * f;
          yy *= 1 - 0.55 * aplast;
        }
        return proyecta(cam, [C[0] + xx, C[1] + yy, cerca]);
      };
      const centro = proyecta(cam, [C[0], C[1], cerca]);
      const primero = cuña(a1);
      if (centro && primero) {
        g.moveTo(centro.x, centro.y);
        g.lineTo(primero.x, primero.y);
        for (let s = 1; s <= 7; s++) {
          const p = cuña(a1 + span * s / 7);
          if (p) g.lineTo(p.x, p.y);
        }
        g.closePath();
        g.fillStyle = "rgba(255, 214, 120, 0.9)";
        g.fill();
      }
      // surcos
      g.strokeStyle = "rgba(0,0,0,0.45)";
      g.lineWidth = Math.max(2, rx * 0.035);
      for (let i = 0; i < 10; i++) {
        const a = giro + 0.35 + (i / 10) * Math.PI * 2;
        const q1 = proyecta(cam, [C[0] + Math.cos(a) * R * 0.9, C[1] + Math.sin(a) * R * 0.9, cerca]);
        const q2 = proyecta(cam, [C[0] + Math.cos(a + 0.08) * R * 0.99, C[1] + Math.sin(a + 0.08) * R * 0.99, cerca]);
        if (!q1 || !q2) continue;
        g.beginPath();
        g.moveTo(q1.x, q1.y);
        g.lineTo(q2.x, q2.y);
        g.stroke();
      }
    },
  };
}

// Un trozo corto: si un vértice cruza la cámara solo desaparece ese trozo, no la raya entera.
function tira(cosas, cam, x0, x1, y, z0, z1, rgb) {
  const n = Math.max(1, Math.ceil((x1 - x0) / 0.28));
  for (let i = 0; i < n; i++) {
    const a = x0 + ((x1 - x0) * i) / n;
    const b = x0 + ((x1 - x0) * (i + 1)) / n;
    cara(cosas, cam, [[a, y, z1], [b, y, z1], [b, y, z0], [a, y, z0]], rgb);
  }
}

function carretera(cosas, cam, metros) {
  const ciclo = 3.6;
  const off = ((metros % ciclo) + ciclo) % ciclo;
  const paso = 0.45;
  const claro = [40, 54, 78], oscuro = [14, 20, 34];
  for (let iz = -4; iz < 6; iz++) {
    const z0 = iz * 1.15, z1 = z0 + 1.15;
    for (let ix = -12; ix < 16; ix++) {
      const x0 = ix * 1.8 - off, x1 = x0 + 1.8;
      const rgb = (ix + iz) % 2 === 0 ? claro : oscuro;
      const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
      const dx = mx - cam.p[0], dy = -cam.p[1], dz = mz - cam.p[2];
      if (dx * dx + dy * dy + dz * dz > 36) {
        cara(cosas, cam, [[x0, 0, z1], [x1, 0, z1], [x1, 0, z0], [x0, 0, z0]], rgb);
        continue;
      }
      for (let z = z0; z < z1 - 1e-6; z += paso) {
        const zz1 = Math.min(z + paso, z1);
        for (let x = x0; x < x1 - 1e-6; x += paso) {
          const xx1 = Math.min(x + paso, x1);
          cara(cosas, cam, [[x, 0, zz1], [xx1, 0, zz1], [xx1, 0, z], [x, 0, z]], rgb);
        }
      }
    }
  }
  for (let i = -8; i < 16; i++) {
    const x = -12 + i * ciclo - off;
    tira(cosas, cam, x, x + 1.05, 0.03, -0.1, 0.1, [255, 196, 70]);
    for (const z of [1.35, -1.45]) tira(cosas, cam, x, x + ciclo, 0.025, z, z + 0.08, [214, 224, 236]);
  }
}

function farolas(cosas, cam) {
  for (const x of [-7.5, -2.2, 3.4, 8.6, 13.2]) {
    cara(cosas, cam, [[x, 0, 3.3], [x + 0.08, 0, 3.3], [x + 0.08, 2.4, 3.3], [x, 2.4, 3.3]], [40, 48, 64]);
    cara(cosas, cam, [[x - 0.35, 2.35, 3.25], [x + 0.15, 2.35, 3.25], [x + 0.15, 2.48, 3.25], [x - 0.35, 2.48, 3.25]], [255, 186, 90]);
  }
}

export function cielo(g) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#07091a");
  gr.addColorStop(0.42, "#12284a");
  gr.addColorStop(0.7, "#c45a32");
  gr.addColorStop(0.82, "#3a241c");
  gr.addColorStop(1, "#120e12");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
}

export function veloArriba(g, al) {
  if (al <= 0.02) return;
  const vg = g.createLinearGradient(0, 180, 0, 760);
  vg.addColorStop(0, `rgba(4,6,14,${0.55 * al})`);
  vg.addColorStop(0.55, `rgba(4,6,14,${0.28 * al})`);
  vg.addColorStop(1, "rgba(4,6,14,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 780);
}

// El testigo ámbar: la herradura del neumático con la exclamación.
export function testigo(g, x, y, s, al) {
  if (al < 0.03 || s < 3) return;
  g.save();
  g.translate(x, y);
  k.brillo(g, 0, 0, s * 3.4, "naranja", Math.min(1, al));
  g.globalAlpha *= Math.min(1, al);
  g.strokeStyle = "#ffc44a";
  g.fillStyle = "#ffc44a";
  g.lineCap = "round";
  g.lineJoin = "round";
  g.lineWidth = Math.max(3, s * 0.16);
  g.beginPath();
  g.arc(0, s * 0.02, s * 0.46, Math.PI * 0.15, Math.PI * 0.85, true);
  g.stroke();
  g.lineWidth = Math.max(2, s * 0.08);
  g.beginPath();
  g.arc(0, s * 0.02, s * 0.28, Math.PI * 0.18, Math.PI * 0.82, true);
  g.stroke();
  g.lineWidth = Math.max(3, s * 0.1);
  g.beginPath();
  g.moveTo(0, -s * 0.18);
  g.lineTo(0, s * 0.08);
  g.stroke();
  g.beginPath();
  g.arc(0, s * 0.24, Math.max(2, s * 0.055), 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function escena(g, cam, t, o) {
  const aplast = o.aplast || [0, 0, 0, 0];
  const delante = aplast[0];
  const todas = Math.min(aplast[1], aplast[2], aplast[3]);
  cielo(g);
  const cosas = [];
  carretera(cosas, cam, o.metros || 0);
  farolas(cosas, cam);
  coche(cosas, cam, delante, todas);
  EJES.forEach((eje, i) => {
    const item = ruedaItem(cam, eje, aplast[i] || 0, (o.giro && o.giro[i]) || 0, i === 0 ? o.ond || 0 : 0, o.fase || 0, delante, todas);
    if (item) cosas.push(item);
  });
  cosas.sort((a, b) => b.z - a.z);
  for (const c of cosas) c.dibuja(g);
  // brillos de farolas y faros, encima
  g.save();
  for (const x of [-7.5, -2.2, 3.4, 8.6, 13.2]) {
    const p = proyecta(cam, [x - 0.1, 2.42, 3.25]);
    if (p) k.brillo(g, p.x, p.y, tamano(1.4, p.z), "naranja", 0.85);
  }
  const dyF = caidaY(-2.05, delante, todas);
  for (const z of [0.52, -0.52]) {
    const p = proyecta(cam, [-2.18, 0.57 + dyF, z]);
    if (p) k.brillo(g, p.x, p.y, tamano(0.55, p.z), "amarilla", 0.9);
  }
  const dash = proyecta(cam, [-0.35, 1.15 + caidaY(-0.35, delante, todas), 0.42]);
  if (dash && o.luz > 0.02) testigo(g, dash.x, dash.y, Math.min(220, tamano(0.28, dash.z)), o.luz);
  if (o.anillos > 0.02) {
    const origen = proyecta(cam, [EJES[0].x, radioDe(aplast[0]) + caidaY(EJES[0].x, delante, todas), EJES[0].z]);
    if (origen && dash) ondas(g, origen.x, origen.y, dash.x, dash.y, o.anillos);
  }
  g.restore();
  if (o.velo) veloArriba(g, o.velo);
}

export function ondas(g, x0, y0, x1, y1, u) {
  const n = 5;
  for (let i = 0; i < n; i++) {
    const p = (u * 1.25 - i * 0.18);
    if (p <= 0 || p >= 1) continue;
    const x = k.mez(x0, x1, p);
    const y = k.mez(y0, y1, p);
    const rad = 28 + p * 110;
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(120,230,255,${0.9 * (1 - p)})`;
    g.lineWidth = 14;
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }
}

// El interior de la rueda, en pantalla: goma alrededor y el hueco con el sensor.
export function interior(g, t, u, o) {
  if (u <= 0.01) return;
  const cx = 540, cy = 1100;
  const cubre = k.suave(k.tramo(u, 0, 0.55));
  const agujero = 520 * k.suave(k.tramo(u, 0.28, 1));
  const radio = k.mez(36, 1500, cubre);
  const aparece = k.suave(k.tramo(u, 0, 0.2));
  g.save();
  g.globalAlpha = aparece;
  g.beginPath();
  g.arc(cx, cy, radio, 0, Math.PI * 2);
  g.arc(cx, cy, Math.max(1, agujero), 0, Math.PI * 2, true);
  const rg = g.createRadialGradient(cx - 80, cy - 120, 40, cx, cy, radio);
  rg.addColorStop(0, "#3c4454");
  rg.addColorStop(0.4, "#1c212b");
  rg.addColorStop(1, "#08090d");
  g.fillStyle = rg;
  g.fill("evenodd");
  // los tacos de la goma giran con la rueda y se paran antes del corte
  const alTacos = k.suave(k.tramo(agujero, 12, 100));
  if (alTacos > 0.02) {
    const spin = o.giro || 0;
    g.save();
    g.globalAlpha *= alTacos;
    g.beginPath();
    g.arc(cx, cy, radio, 0, Math.PI * 2);
    g.arc(cx, cy, agujero + 18, 0, Math.PI * 2, true);
    g.clip("evenodd");
    g.translate(cx, cy);
    g.rotate(spin);
    g.fillStyle = "#d5dbe6";
    for (let i = 0; i < 16; i++) {
      g.rotate(Math.PI / 8);
      g.fillRect(agujero + 28, -22, 220, 44);
    }
    g.restore();
  }
  // cinturón de acero
  const alCinta = k.suave(k.tramo(agujero, 16, 80));
  if (alCinta > 0.02) {
    g.save();
    g.globalAlpha *= alCinta;
    g.strokeStyle = "rgba(190,200,214,0.35)";
    g.lineWidth = 8;
    g.beginPath();
    g.arc(cx, cy, agujero + 28, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.14)";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(cx, cy, agujero + 46, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }
  g.beginPath();
  g.arc(cx, cy, Math.max(1, agujero), 0, Math.PI * 2);
  g.clip();
  const aire = g.createRadialGradient(cx, cy, 10, cx, cy, agujero || 1);
  aire.addColorStop(0, "#16365c");
  aire.addColorStop(1, "#071018");
  g.fillStyle = aire;
  g.fillRect(cx - 800, cy - 800, 1600, 1600);
  // cinco burbujas de aire; la de arriba se va cuando falta la quinta parte
  const sites = [[0, -190], [190, -40], [120, 170], [-130, 160], [-200, -20]];
  sites.forEach((p, i) => {
    const queda = i === 0 ? 1 - (o.quinta || 0) : 1;
    if (queda <= 0.02) return;
    const drift = (1 - (o.quieto || 0)) * Math.sin(t * 1.4 + i) * 10;
    const x = cx + p[0] + drift, y = cy + p[1] + drift * 0.6;
    const rad = (i === 0 ? 78 : 64) * queda;
    const bg = g.createRadialGradient(x - rad * 0.3, y - rad * 0.35, rad * 0.1, x, y, rad);
    bg.addColorStop(0, "rgba(230,250,255,0.95)");
    bg.addColorStop(0.45, "rgba(120,200,255,0.55)");
    bg.addColorStop(1, "rgba(40,90,160,0.15)");
    g.fillStyle = bg;
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
  });
  g.restore();

  if (agujero < 40) return;
  // válvula y sensor, colgando de arriba del hueco
  const boca = cy - agujero;
  const sensor = o.sensor || 0;
  const sy = boca + 150;
  g.save();
  k.redondo(g, cx - 16, boca - 10, 32, 170, 12);
  k.metal(g, cx - 16, cx + 16);
  g.fillStyle = "#d5dbe4";
  g.beginPath();
  g.arc(cx, boca + 8, 14, 0, Math.PI * 2);
  g.fill();
  if (sensor > 0.02) {
    const sc = 0.55 + 0.45 * sensor;
    g.save();
    g.translate(cx, sy);
    g.scale(sc * 1.45, sc * 1.45);
    g.globalAlpha = Math.min(1, sensor * 1.4);
    k.redondo(g, -78, -36, 156, 92, 28);
    g.fillStyle = "#12141a";
    g.fill();
    g.strokeStyle = "#6a7380";
    g.lineWidth = 4;
    g.stroke();
    const mem = g.createRadialGradient(-10, -8, 4, 0, 0, 34);
    mem.addColorStop(0, "#f4f7fb");
    mem.addColorStop(0.5, "#9aa6b6");
    mem.addColorStop(1, "#2a313c");
    g.fillStyle = mem;
    g.beginPath();
    g.arc(-8, 4, 30, 0, Math.PI * 2);
    g.fill();
    const led = o.luz > 0.6 ? "#ffb020" : "#3dffd0";
    g.fillStyle = led;
    g.beginPath();
    g.arc(48, 4, 10, 0, Math.PI * 2);
    g.fill();
    k.brillo(g, 48, 4, 70, o.luz > 0.6 ? "naranja" : "cian", 0.8);
    g.restore();
  }
  g.restore();

  // el cuadro, debajo del subtítulo y encima del hueco
  const panel = o.panel || 0;
  if (panel > 0.02) {
    const px = 540, py = 700;
    g.save();
    g.globalAlpha = Math.min(1, panel);
    k.redondo(g, px - 190, py - 100, 380, 190, 42);
    g.fillStyle = "#141820";
    g.fill();
    g.strokeStyle = "#2c3444";
    g.lineWidth = 6;
    g.stroke();
    testigo(g, px, py + 8, 110, Math.max(0.25, o.luz || 0));
    g.restore();
    if (o.anillos > 0.02 && sensor > 0.4) ondas(g, cx, sy, px, py, o.anillos);
  }
}

export function mesa(g, t, o) {
  // pared oscura arriba, para el subtítulo, y la mesa caliente debajo
  const pared = g.createLinearGradient(0, 0, 0, 900);
  pared.addColorStop(0, "#071018");
  pared.addColorStop(0.55, "#123044");
  pared.addColorStop(1, "#1c4a62");
  g.fillStyle = pared;
  g.fillRect(0, 0, 1080, 980);
  const mesaG = g.createLinearGradient(0, 860, 0, 1920);
  mesaG.addColorStop(0, "#e7b07a");
  mesaG.addColorStop(0.25, "#c4844a");
  mesaG.addColorStop(1, "#6b3a22");
  g.fillStyle = mesaG;
  g.fillRect(0, 900, 1080, 1020);
  const tabla = 120;
  const off = ((o.madera || 0) % (tabla * 2) + tabla * 2) % (tabla * 2);
  for (let i = -2; i < 14; i++) {
    g.fillStyle = (i % 2) ? "#c98448" : "#f0c088";
    g.fillRect(i * tabla - off, 900, tabla - 8, 1020);
  }
  // lámpara
  k.brillo(g, 540, 620, 900, "naranja", 0.45);
  g.fillStyle = "#ffd7a2";
  g.beginPath();
  g.moveTo(470, 430);
  g.lineTo(610, 430);
  g.lineTo(650, 560);
  g.lineTo(430, 560);
  g.closePath();
  g.fill();
  g.fillStyle = "#5a3a22";
  g.fillRect(532, 200, 16, 240);

  const u = o.giro || 0;
  // el plato, grande, a la izquierda; la moneda, a la derecha. Los dos ruedan el mismo camino.
  plato(g, 340, 1240, 210, u / 210);
  moneda(g, 760, 1120, 68, u / 68);
  veloArriba(g, 0.85);
}

function plato(g, x, y, r, vueltas) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.beginPath();
  g.ellipse(18, 28, r * 0.92, r * 0.28, 0, 0, Math.PI * 2);
  g.fill();
  g.rotate(vueltas);
  const rg = g.createRadialGradient(-r * 0.2, -r * 0.25, r * 0.1, 0, 0, r);
  rg.addColorStop(0, "#ffffff");
  rg.addColorStop(0.55, "#f4f1ea");
  rg.addColorStop(0.78, "#d9d2c6");
  rg.addColorStop(0.86, "#ff4d4d");
  rg.addColorStop(1, "#b71c1c");
  g.fillStyle = rg;
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#fff";
  g.lineWidth = 36;
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -r * 0.78);
  g.stroke();
  g.fillStyle = "#ff4d4d";
  g.beginPath();
  g.arc(0, -r * 0.72, 16, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function moneda(g, x, y, r, vueltas) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath();
  g.ellipse(10, 16, r, r * 0.35, 0, 0, Math.PI * 2);
  g.fill();
  g.rotate(vueltas);
  const rg = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  rg.addColorStop(0, "#fff1b0");
  rg.addColorStop(0.45, "#f0c14b");
  rg.addColorStop(0.8, "#c4841a");
  rg.addColorStop(1, "#7a4e0c");
  g.fillStyle = rg;
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#fff6d2";
  g.lineWidth = 6;
  g.beginPath();
  g.arc(0, 0, r * 0.72, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#fff6d2";
  g.beginPath();
  g.moveTo(0, -r * 0.42);
  g.lineTo(r * 0.16, -r * 0.08);
  g.lineTo(r * 0.45, -r * 0.05);
  g.lineTo(r * 0.2, r * 0.16);
  g.lineTo(r * 0.28, r * 0.46);
  g.lineTo(0, r * 0.28);
  g.lineTo(-r * 0.28, r * 0.46);
  g.lineTo(-r * 0.2, r * 0.16);
  g.lineTo(-r * 0.45, -r * 0.05);
  g.lineTo(-r * 0.16, -r * 0.08);
  g.closePath();
  g.fill();
  g.restore();
}
