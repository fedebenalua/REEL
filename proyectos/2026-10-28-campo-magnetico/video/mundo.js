// La Tierra, su escudo, el viento del Sol y las escenas de casa. Lo que sale en más de un plano se dibuja aquí,
// para que sea siempre la misma cosa.
import * as k from "#kit";

export const ENC = { pos: [-2.35, 0.5, 2.4], mira: [-0.15, 0, 0] };
const GIRA = 0.2;

const xy = (lon, lat, W, H) => [(lon + 180) / 360 * W, (90 - lat) / 180 * H];
const mapa = (() => {
  const W = 512, H = 256, l = k.lienzo(W, H), c = l.getContext("2d");
  const mar = c.createLinearGradient(0, 0, 0, H);
  mar.addColorStop(0, "#16386a"); mar.addColorStop(0.42, "#1f78b8"); mar.addColorStop(1, "#12315c");
  c.fillStyle = mar; c.fillRect(0, 0, W, H);
  const poly = (pts, col) => {
    c.beginPath();
    pts.forEach((p, i) => { const q = xy(p[0], p[1], W, H); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); });
    c.closePath(); c.fillStyle = col; c.fill();
  };
  poly([[-168, 66], [-140, 70], [-105, 73], [-90, 62], [-68, 60], [-55, 52], [-70, 44], [-82, 28], [-114, 30], [-125, 48], [-140, 60], [-168, 66]], "#2f8f46");
  poly([[-80, 12], [-68, 12], [-60, 8], [-51, 1], [-36, -6], [-39, -16], [-48, -27], [-54, -36], [-62, -50], [-68, -56], [-76, -52], [-74, -40], [-76, -16], [-81, -2], [-80, 12]], "#348f48");
  poly([[-10, 36], [-8, 44], [0, 50], [10, 54], [24, 46], [30, 41], [20, 38], [12, 36], [3, 36], [-10, 36]], "#3c9850");
  poly([[-6, 36], [10, 32], [25, 32], [32, 22], [43, 12], [51, 11], [40, 0], [42, -15], [34, -30], [26, -34], [18, -34], [12, -16], [14, -6], [8, 5], [-6, 6], [-16, 12], [-17, 21], [-12, 32], [-6, 36]], "#2f8a44");
  poly([[26, 40], [40, 60], [70, 72], [140, 70], [180, 66], [160, 50], [120, 30], [90, 22], [70, 8], [50, 14], [40, 26], [26, 40]], "#38944c");
  poly([[114, -12], [128, -14], [146, -18], [153, -28], [142, -38], [124, -34], [114, -22]], "#348a46");
  c.save(); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.22; c.drawImage(k.manchas, 0, 0, W, H); c.restore();
  return l;
})();

export const CIELO = k.cielo(4, 1100, [0, 0, 0], 90, 3.2).concat(k.cielo(8, 220, [0, 0, 0], 16, 2.2));

const azV = k.azar(11);
export const VIENTO = Array.from({ length: 70 }, () => ({
  y: (azV() - 0.5) * 5.2,
  z: (azV() - 0.5) * 3.8,
  fase: azV(),
  vel: 0.38 + azV() * 0.5,
  gr: 0.4 + azV() * 0.55,
  cerca: false,
})).concat(Array.from({ length: 36 }, () => ({
  y: (azV() - 0.5) * 1.5,
  z: (azV() - 0.5) * 1.1,
  fase: azV(),
  vel: 0.55 + azV() * 0.4,
  gr: 0.85 + azV() * 0.4,
  cerca: false,
}))).concat(Array.from({ length: 14 }, () => ({
  y: (azV() - 0.5) * 1.8,
  z: 1.6 + azV() * 0.5,
  fase: azV(),
  vel: 0.7 + azV() * 0.4,
  gr: 1,
  cerca: true,
})));
const mod = (a) => a - Math.floor(a);

function posViento(p, t, escudo) {
  const u = mod(p.fase + t * p.vel * 0.34);
  let x = -7.2 + u * 14.4;
  let y = p.y * (p.cerca ? 0.35 : 1);
  let z = p.cerca ? 1.35 + p.z * 0.15 : p.z;
  const radial = Math.hypot(y, z) || 0.001;
  const cercaX = Math.exp(-(x * x) / 2.4);
  const radioEscudo = 1.2 + escudo * 1.15;
  const empuje = escudo * cercaX * Math.max(0, radioEscudo - radial);
  y += empuje * (y / radial);
  z += empuje * (z / radial);
  let golpe = 0;
  const r = Math.hypot(x, y, z);
  if (escudo < 0.42 && r < 1.16 && x > -1.5) {
    const s = 1.15 / Math.max(r, 0.08);
    return [x * s, y * s, z * s, 1];
  }
  return [x, y, z, golpe];
}

const LINEAS = [0.9, 1.5, 2.2, 4.0, 4.7, 5.4];

function puntosLinea(phi, escudo) {
  const L = 1.12 + escudo * 1.25, tope = Math.acos(Math.min(0.98, Math.sqrt(1.04 / L)));
  const pts = [];
  for (let i = 0; i <= 26; i++) {
    const lat = -tope + (2 * tope * i) / 26;
    const r = L * Math.cos(lat) ** 2;
    const rr = r * Math.cos(lat);
    pts.push([rr * Math.sin(phi), r * Math.sin(lat), rr * Math.cos(phi)]);
  }
  return pts;
}

const LUCES = (() => {
  const az = k.azar(19), o = [];
  for (let i = 0; i < 36; i++) o.push({ lon: az() * 6.2832, lat: (az() - 0.5) * 2.4, br: 0.35 + az() * 0.9 });
  return o;
})();

function esfera(lat, lon, r = 1.02) {
  const cl = Math.cos(lat);
  return [r * cl * Math.sin(lon), r * Math.sin(lat), r * cl * Math.cos(lon)];
}

export function veloArriba(g, al = 0.42) {
  if (al <= 0.02) return;
  const vg = g.createLinearGradient(0, 60, 0, 680);
  vg.addColorStop(0, `rgba(3,6,14,${al})`);
  vg.addColorStop(0.5, `rgba(3,6,14,${al * 0.72})`);
  vg.addColorStop(1, "rgba(3,6,14,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 720);
}

function tierra(g, x, y, rad, lx, ly) {
  const l = Math.hypot(lx, ly) || 1;
  lx /= l; ly /= l;
  g.save();
  const halo = g.createRadialGradient(x, y, rad * 0.92, x, y, rad * 1.22);
  halo.addColorStop(0, "rgba(90,170,255,0.5)"); halo.addColorStop(1, "rgba(90,170,255,0)");
  g.fillStyle = halo; g.beginPath(); g.arc(x, y, rad * 1.22, 0, 6.28); g.fill();
  g.beginPath(); g.arc(x, y, rad, 0, 6.28); g.clip();
  const w = rad * 4, h = rad * 2, off = GIRA * w;
  g.drawImage(mapa, x - rad - off, y - rad, w, h);
  g.drawImage(mapa, x - rad - off + w, y - rad, w, h);
  const esf = g.createRadialGradient(x - rad * 0.32, y - rad * 0.36, rad * 0.08, x, y, rad);
  esf.addColorStop(0, "rgba(255,255,255,0.2)"); esf.addColorStop(0.62, "rgba(0,0,0,0)"); esf.addColorStop(1, "rgba(0,8,24,0.55)");
  g.fillStyle = esf; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  const sombra = g.createLinearGradient(x + lx * rad, y + ly * rad, x - lx * rad, y - ly * rad);
  sombra.addColorStop(0, "rgba(0,0,0,0)"); sombra.addColorStop(0.42, "rgba(0,0,0,0.08)"); sombra.addColorStop(1, "rgba(0,0,12,0.88)");
  g.fillStyle = sombra; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  g.restore();
}

function trazo(g, cam, pts, ancho, color, al) {
  let abierto = false;
  g.beginPath();
  for (const p of pts) {
    const q = k.proyecta(cam, p);
    if (!q) { abierto = false; continue; }
    if (!abierto) { g.moveTo(q.x, q.y); abierto = true; } else g.lineTo(q.x, q.y);
  }
  g.strokeStyle = `rgba(${color},${al})`; g.lineWidth = ancho; g.lineCap = "round"; g.lineJoin = "round"; g.stroke();
}

function satelite(g, x, y, s, chispa) {
  g.save(); g.translate(x, y);
  const panel = (px) => {
    const gr = g.createLinearGradient(px, -s * 0.35, px, s * 0.35);
    gr.addColorStop(0, "#8ec6ff"); gr.addColorStop(0.5, "#d7ecff"); gr.addColorStop(1, "#3d6eb5");
    g.fillStyle = gr; k.redondo(g, px, -s * 0.38, s * 0.7, s * 0.76, 8); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 2;
    for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(px + 6, -s * 0.38 + i * s * 0.19); g.lineTo(px + s * 0.7 - 6, -s * 0.38 + i * s * 0.19); g.stroke(); }
  };
  panel(-s * 1.15); panel(s * 0.45);
  g.fillStyle = "#9aa4b0"; g.fillRect(-s * 0.45, -2, s * 0.9, 4);
  const cg = g.createLinearGradient(-s * 0.28, -s * 0.22, s * 0.28, s * 0.22);
  cg.addColorStop(0, "#f4f7fb"); cg.addColorStop(0.5, "#c5ced8"); cg.addColorStop(1, "#6d7682");
  g.fillStyle = cg; k.redondo(g, -s * 0.28, -s * 0.22, s * 0.56, s * 0.44, 8); g.fill();
  g.fillStyle = "#243044"; g.fillRect(-s * 0.08, -s * 0.55, s * 0.16, s * 0.34);
  k.brillo(g, 0, 0, s * 1.4, "blanca", 0.25);
  if (chispa > 0.02) k.brillo(g, 0, 0, s * (2.2 + chispa * 2), "255,210,90", Math.min(1, chispa));
  g.restore();
}

export function dibujaEspacio(g, cam, antes, st) {
  const escudo = st.escudo ?? 1, t = st.t ?? 0;
  k.fondo(g, cam);
  k.estrellas(g, cam, antes, CIELO, 1);
  const sol = k.proyecta(cam, [-30, 3, 1]);
  if (sol) k.brillo(g, sol.x, sol.y, 1100, "amarilla", 0.55);
  const cosas = [];
  for (const p of VIENTO) {
    const a = posViento(p, t, escudo), b = posViento(p, t - 0.07, escudo);
    const A = k.proyecta(cam, a), B = k.proyecta(cam, b);
    if (!A) continue;
    cosas.push({ z: A.z, dibuja: () => {
      const al = (st.viento ?? 1) * (0.35 + 0.65 * p.gr);
      if (B) {
        let dx = A.x - B.x, dy = A.y - B.y, L = Math.hypot(dx, dy);
        if (L > 72) { dx *= 72 / L; dy *= 72 / L; L = 72; }
        g.strokeStyle = `rgba(255,214,140,${al})`; g.lineWidth = Math.max(2, 7 * p.gr); g.lineCap = "round";
        g.beginPath(); g.moveTo(A.x - dx, A.y - dy); g.lineTo(A.x, A.y); g.stroke();
      }
      k.brillo(g, A.x, A.y, 18 + 16 * p.gr, a[3] ? "cian" : "amarilla", al * (a[3] ? 0.95 : 0.55));
    } });
  }
  for (const phi of LINEAS) {
    const pts = puntosLinea(phi, escudo);
    const mid = k.proyecta(cam, pts[13]);
    if (!mid || escudo < 0.18) continue;
    cosas.push({ z: mid.z + 0.2, dibuja: () => {
      trazo(g, cam, pts, 16, "80,190,255", 0.1 * escudo);
      trazo(g, cam, pts, 3.2, "210,250,255", 0.55 * escudo);
    } });
  }
  const E = k.proyecta(cam, [0, 0, 0]);
  if (E) {
    cosas.push({ z: E.z, dibuja: () => {
      const rad = (k.F * 1) / E.z;
      let lx = -1, ly = -0.15;
      if (sol) { lx = sol.x - E.x; ly = sol.y - E.y; }
      tierra(g, E.x, E.y, rad, lx, ly);
      g.save();
      g.globalCompositeOperation = "lighter";
      const aire = 0.22 + (st.aire ?? 0) * 0.4;
      const lim = g.createRadialGradient(E.x, E.y, rad * 0.9, E.x, E.y, rad * 1.05);
      lim.addColorStop(0, "rgba(120,190,255,0)"); lim.addColorStop(0.78, `rgba(170,220,255,${aire})`); lim.addColorStop(1, "rgba(170,220,255,0)");
      g.fillStyle = lim; g.beginPath(); g.arc(E.x, E.y, rad * 1.05, 0, 6.28); g.fill();
      if (escudo > 0.18) {
        const R = rad * (1.55 + escudo * 0.35);
        const sh = g.createRadialGradient(E.x, E.y, rad * 1.08, E.x, E.y, R);
        sh.addColorStop(0, "rgba(100,210,255,0)");
        sh.addColorStop(0.72, `rgba(120,210,255,${0.08 * escudo})`);
        sh.addColorStop(0.9, `rgba(190,250,255,${0.42 * escudo})`);
        sh.addColorStop(1, "rgba(190,250,255,0)");
        g.fillStyle = sh; g.beginPath(); g.arc(E.x, E.y, R, 0, 6.28); g.fill();
        g.strokeStyle = `rgba(220,255,255,${0.75 * escudo})`; g.lineWidth = 10 + 8 * escudo; g.lineCap = "round";
        g.beginPath(); g.arc(E.x, E.y, rad * (1.28 + escudo * 0.22), Math.PI * 0.62, Math.PI * 1.38); g.stroke();
        k.brillo(g, E.x - rad * (1.15 + escudo * 0.25), E.y, rad * (0.9 + escudo * 0.35), "cian", 0.7 * escudo);
      }
      g.restore();
      if ((st.saa ?? 0) > 0.02) {
        g.save(); g.beginPath(); g.arc(E.x, E.y, rad, 0, 6.28); g.clip();
        g.globalCompositeOperation = "lighter";
        const ox = E.x - rad * 0.02, oy = E.y + rad * 0.22;
        const sg = g.createRadialGradient(ox, oy, 8, ox, oy, rad * 0.5);
        sg.addColorStop(0, `rgba(186,90,255,${0.55 * st.saa})`);
        sg.addColorStop(1, "rgba(186,90,255,0)");
        g.fillStyle = sg; g.beginPath(); g.ellipse(ox, oy, rad * 0.42, rad * 0.28, -0.4, 0, 6.28); g.fill();
        g.restore();
      }
      const solDir = k.uni([-1, 0.05, 0.15]);
      const alAur = st.auroraAl ?? 0;
      if (alAur > 0.02) {
        const uA = st.aurora ?? 0;
        g.save(); g.beginPath(); g.arc(E.x, E.y, rad, 0, 6.28); g.clip();
        g.globalCompositeOperation = "lighter";
        for (const signo of [1, -1]) {
          const oy = E.y - signo * rad * k.mez(0.62, 0.02, uA);
          const banda = g.createRadialGradient(E.x, oy, rad * 0.05, E.x, oy, rad * 0.72);
          banda.addColorStop(0, `rgba(140,255,180,${0.34 * alAur})`);
          banda.addColorStop(0.45, `rgba(80,200,255,${0.16 * alAur})`);
          banda.addColorStop(1, "rgba(180,120,255,0)");
          g.fillStyle = banda; g.beginPath(); g.ellipse(E.x, oy, rad * 0.78, rad * (0.16 + 0.1 * uA), 0, 0, 6.28); g.fill();
        }
        g.restore();
      }
      if ((st.luces ?? 0) > 0.02) {
        for (const L of LUCES) {
          const p = esfera(L.lat, L.lon, 1.01);
          if (k.pto(k.uni(p), solDir) > -0.05) continue;
          if (k.pto(p, cam.p) < 0.2) continue;
          const q = k.proyecta(cam, p);
          if (!q) continue;
          k.brillo(g, q.x, q.y, 10 + 8 * L.br, "fuego", st.luces * L.br * 0.8);
        }
      }
      if (st.sat) {
        const uS = st.sat.u ?? 0.5, alS = st.sat.al ?? 1;
        if (alS > 0.03) {
          g.save(); g.globalAlpha *= alS;
          satelite(g, E.x + rad * k.mez(-0.72, 0.62, uS), E.y + rad * 0.2, Math.min(210, rad * 0.42), st.sat.chispa || 0);
          g.restore();
        }
      }
    } });
  }
  k.deLejosACerca(cosas);
  veloArriba(g, st.velo ?? 0.48);
}

let lienzoA = null, lienzoB = null;
export function funde(g, u, dibuja0, dibuja1) {
  if (u <= 0.004) return dibuja0(g);
  if (u >= 0.996) return dibuja1(g);
  lienzoA = lienzoA || k.lienzo(1080, 1920);
  lienzoB = lienzoB || k.lienzo(1080, 1920);
  const ga = lienzoA.getContext("2d"), gb = lienzoB.getContext("2d");
  for (const [cv, cx] of [[lienzoA, ga], [lienzoB, gb]]) {
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over"; cx.clearRect(0, 0, 1080, 1920);
  }
  dibuja0(ga); dibuja1(gb);
  g.drawImage(lienzoA, 0, 0);
  g.save(); g.globalAlpha *= u; g.drawImage(lienzoB, 0, 0); g.restore();
}

export function persona(g, x, pies, h, opt = {}) {
  const ropa = opt.ropa || "#e25b3a";
  const cabeza = h * 0.13, yC = pies - h + cabeza * 1.15;
  g.save();
  if (opt.contra) {
    g.fillStyle = "rgba(12,8,6,0.92)";
    g.beginPath(); g.ellipse(x, pies + 4, h * 0.16, 8, 0, 0, 6.28); g.fill();
    k.redondo(g, x - h * 0.07, pies - h * 0.46, h * 0.06, h * 0.46, 6); g.fill();
    k.redondo(g, x + h * 0.02, pies - h * 0.46, h * 0.06, h * 0.46, 6); g.fill();
    k.redondo(g, x - h * 0.15, pies - h * 0.86, h * 0.3, h * 0.44, 14); g.fill();
    g.beginPath(); g.arc(x, yC, cabeza, 0, 6.28); g.fill();
    g.strokeStyle = "rgba(255,170,70,0.85)"; g.lineWidth = 4;
    g.beginPath(); g.arc(x, yC, cabeza, -0.4, 1.2); g.stroke();
    g.restore();
    return;
  }
  g.fillStyle = "rgba(90,40,20,0.22)"; g.beginPath(); g.ellipse(x, pies + 4, h * 0.14, 7, 0, 0, 6.28); g.fill();
  const pg = g.createLinearGradient(x, pies - h * 0.46, x, pies);
  pg.addColorStop(0, "#4a3428"); pg.addColorStop(1, "#2a1c14");
  g.fillStyle = pg;
  k.redondo(g, x - h * 0.09, pies - h * 0.48, h * 0.07, h * 0.48, 6); g.fill();
  k.redondo(g, x + h * 0.02, pies - h * 0.48, h * 0.07, h * 0.48, 6); g.fill();
  const tg = g.createLinearGradient(x - h * 0.16, pies - h * 0.9, x + h * 0.16, pies - h * 0.4);
  tg.addColorStop(0, ropa); tg.addColorStop(1, "#5c3018");
  g.fillStyle = tg; k.redondo(g, x - h * 0.15, pies - h * 0.9, h * 0.3, h * 0.46, 12); g.fill();
  g.fillStyle = "#f0b088";
  k.redondo(g, x - h * 0.2, pies - h * 0.78, h * 0.07, h * 0.32, 8); g.fill();
  k.redondo(g, x + h * 0.13, pies - h * 0.78, h * 0.07, h * 0.32, 8); g.fill();
  const cg = g.createRadialGradient(x - cabeza * 0.3, yC - cabeza * 0.3, 2, x, yC, cabeza);
  cg.addColorStop(0, "#ffd7b8"); cg.addColorStop(1, "#e0a078");
  g.fillStyle = cg; g.beginPath(); g.ellipse(x, yC, cabeza * 0.86, cabeza, 0, 0, 6.28); g.fill();
  g.fillStyle = opt.pelo || "#2a211c";
  g.beginPath(); g.ellipse(x, yC - cabeza * 0.15, cabeza * 0.9, cabeza * 0.7, 0, Math.PI, 0); g.fill();
  g.restore();
}

const CAMP_ESTRELLAS = (() => {
  const az = k.azar(33);
  return Array.from({ length: 70 }, () => [80 + az() * 920, 80 + az() * 700, 1 + az() * 2.2]);
})();

export function campamento(g, t) {
  const cielo = g.createLinearGradient(0, 0, 0, 1200);
  cielo.addColorStop(0, "#070814"); cielo.addColorStop(0.45, "#14102e"); cielo.addColorStop(0.78, "#3a2060"); cielo.addColorStop(1, "#1a1020");
  g.fillStyle = cielo; g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "rgba(255,255,255,0.85)";
  for (const s of CAMP_ESTRELLAS) { g.fillRect(s[0], s[1], s[2], s[2]); }
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [x0, h, w] of [[180, 460, 280], [420, 560, 340], [700, 500, 300], [960, 420, 260]]) {
    const x = x0 + Math.sin(t * 0.6 + x0) * 8, y = 1040 - h * 0.45;
    const col = g.createLinearGradient(x, y + h * 0.45, x, y - h * 0.45);
    col.addColorStop(0, "rgba(80,255,160,0.02)");
    col.addColorStop(0.4, "rgba(110,255,180,0.28)");
    col.addColorStop(0.7, "rgba(170,120,255,0.2)");
    col.addColorStop(1, "rgba(170,120,255,0)");
    g.fillStyle = col;
    g.beginPath(); g.ellipse(x, y, w * 0.5, h * 0.5, 0, 0, 6.28); g.fill();
  }
  g.restore();
  const suelo = g.createLinearGradient(0, 980, 0, 1920);
  suelo.addColorStop(0, "#2a1b28"); suelo.addColorStop(0.25, "#3a2418"); suelo.addColorStop(1, "#1a100c");
  g.fillStyle = suelo; g.beginPath(); g.moveTo(0, 1040); g.quadraticCurveTo(540, 900, 1080, 1060); g.lineTo(1080, 1920); g.lineTo(0, 1920); g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45; g.drawImage(k.manchas, -100, 900, 1400, 1100); g.restore();
  k.roca(g, 250, 1280, 70, 0.4, 3, -0.4, -1, 0.15);
  k.roca(g, 820, 1320, 90, 1.2, 6, -0.2, -1, 0.1);
  const fuegoX = 540, fuegoY = 1360;
  k.brillo(g, fuegoX, fuegoY - 40, 520, "fuego", 0.55);
  k.lengua(g, fuegoX, fuegoY, 220, 70, t, 0.2, "255,120,30", "255,220,120");
  k.lengua(g, fuegoX - 28, fuegoY + 6, 160, 46, t, 1.4, "255,80,20", "255,190,80");
  k.lengua(g, fuegoX + 30, fuegoY + 4, 150, 40, t, 2.2, "255,90,24", "255,210,100");
  const silueta = (x, pies, h, fuegoX) => {
    g.fillStyle = "#120c0a";
    g.beginPath(); g.arc(x, pies - h * 0.86, h * 0.11, 0, 6.28); g.fill();
    g.beginPath();
    g.moveTo(x - h * 0.16, pies - h * 0.74);
    g.lineTo(x + h * 0.16, pies - h * 0.74);
    g.lineTo(x + h * 0.11, pies - h * 0.34);
    g.lineTo(x - h * 0.11, pies - h * 0.34);
    g.closePath(); g.fill();
    g.fillRect(x - h * 0.1, pies - h * 0.34, h * 0.07, h * 0.34);
    g.fillRect(x + h * 0.03, pies - h * 0.34, h * 0.07, h * 0.34);
    const lado = fuegoX > x ? 1 : -1;
    g.strokeStyle = "rgba(255,168,60,0.9)"; g.lineWidth = 4;
    g.beginPath();
    g.arc(x, pies - h * 0.86, h * 0.11, lado > 0 ? -0.4 : Math.PI - 0.8, lado > 0 ? 1.1 : Math.PI + 0.5);
    g.stroke();
  };
  silueta(390, 1480, 520, 540);
  silueta(710, 1500, 560, 540);
  silueta(545, 1560, 430, 540);
  veloArriba(g, 0.55);
}

export function columnaAgua(g, x, y0, y1, ancho, lleno) {
  const sup = y1 - (y1 - y0) * k.suave(lleno);
  g.save();
  g.beginPath(); k.redondo(g, x - ancho / 2, y0, ancho, y1 - y0, ancho * 0.2); g.clip();
  const ag = g.createLinearGradient(x - ancho / 2, 0, x + ancho / 2, 0);
  ag.addColorStop(0, "rgba(10,70,120,0.15)"); ag.addColorStop(0.5, "rgba(180,230,255,0.08)"); ag.addColorStop(1, "rgba(10,60,110,0.2)");
  g.fillStyle = ag; g.fillRect(x - ancho / 2, y0, ancho, y1 - y0);
  if (sup < y1 - 2) {
    const wg = g.createLinearGradient(0, sup, 0, y1);
    wg.addColorStop(0, "#b9f0ff"); wg.addColorStop(0.18, "#3ec4ef"); wg.addColorStop(0.6, "#1478c8"); wg.addColorStop(1, "#0a3e78");
    g.fillStyle = wg; g.fillRect(x - ancho / 2, sup, ancho, y1 - sup);
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.45;
    g.drawImage(k.causticas, x - ancho / 2, sup, ancho, y1 - sup); g.restore();
    g.fillStyle = "rgba(230,255,255,0.85)";
    g.beginPath(); g.ellipse(x, sup, ancho * 0.42, 16, 0, 0, 6.28); g.fill();
  }
  g.restore();
  g.save();
  k.redondo(g, x - ancho / 2, y0, ancho, y1 - y0, ancho * 0.2);
  g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 6; g.stroke();
  g.strokeStyle = "rgba(180,230,255,0.35)"; g.lineWidth = 14; g.stroke();
  k.reflejo(g, x - ancho * 0.28, y0 + 40, 14, (y1 - y0) * 0.55, 0.35);
  g.restore();
}
