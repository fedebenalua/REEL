// La ventanilla del avión: tres láminas de plástico, el agujero en la del medio.
// +z es fuera (el cielo); −z es la cabina. La cámara no cruza las láminas.
import * as k from "#kit";
import { v } from "#voz";

const RX = 9, RY = 11.2, GR = 0.92, HY = -6.55, AN = 52;
const azN = k.azar(41), azM = k.azar(99), azC = k.azar(17), azR = k.azar(23);

const NUBES = Array.from({ length: 11 }, () => ({
  x: (azN() - 0.5) * 70,
  y: (azN() - 0.5) * 28,
  z: 16 + azN() * 36,
  rx: 7 + azN() * 12,
  ry: 2.4 + azN() * 3,
  vel: 7 + azN() * 9,
}));

const MOTAS = Array.from({ length: 64 }, () => ({
  x: (azM() - 0.5) * 2,
  y: (azM() - 0.5) * 2,
  fase: azM(),
  tam: 0.12 + azM() * 0.22,
}));

const COPOS = [];
for (let i = 0; i < 6; i++) COPOS.push({ a: (i / 6) * Math.PI * 2, rad: 0.25, largo: 1.55, gordo: true });
for (let i = 0; i < 22; i++) COPOS.push({ a: azC() * 6.2832, rad: azC() * 0.5, largo: 0.45 + azC() * 0.85, gordo: false });

const REMACHES = [];
for (let ix = -3; ix <= 3; ix++) for (let iy = -3; iy <= 3; iy++) {
  const x = ix * 4.2, y = iy * 5.2;
  if ((x / (RX + 1.4)) ** 2 + (y / (RY + 1.6)) ** 2 < 1) continue;
  REMACHES.push([x, y]);
}
const GRIETAS = Array.from({ length: 7 }, () => ({
  a: azR() * 6.2832,
  L: 70 + azR() * 140,
  w: 2.2 + azR() * 2.2,
  j: (azR() - 0.5) * 26,
}));

let M = null;
export function marcas() {
  if (M) return M;
  const f = (n) => v.frase(n);
  M = {
    fin1: f(1).fin,
    defecto: f(2).t("defecto"),
    no: f(2).t("no"),
    laminas: f(3).inicio,
    fin3: f(3).fin,
    dentro: f(4).t("dentro"),
    movil: f(4).t("movil") - 0.04,
    agujero: f(5).t("agujero") - 0.04,
    medio: f(5).t("medio"),
    abajo: f(5).t("abajo"),
    empuja: f(6).t("empuja"),
    aire: f(7).t("aire"),
    fuera: f(7).t("fuera"),
    descansa: f(8).t("descansa"),
    reserva: f(8).t("reserva"),
    rompe: f(9).t("rompe"),
    sola: f(9).t("sola"),
    hilo: f(10).t("hilo"),
    repone: f(10).t("repone"),
    vaho: f(11).t("vaho") - 0.04,
    espejo: f(11).t("espejo"),
    rendija: f(11).t("rendija"),
    hielo: f(12).t("hielo") - 0.04,
    anillo: f(12).t("anillo"),
    cielo: f(13).t("cielo"),
    ventanilla: f(14).t("ventanilla"),
    tocas: f(4).t("tocas"),
    rayar: f(4).t("rayar"),
    fin: v.duracion,
  };
  return M;
}

// El reloj de lo que flota (nubes, motas): se para un momento antes del corte.
export function reloj(t, fin) {
  const a = fin - 0.58, b = fin - 0.2;
  if (t <= a) return t;
  const meta = a + (b - a) * 0.22;
  if (t >= b) return meta;
  return k.mez(a, meta, k.suave((t - a) / (b - a)));
}

function camino(claves) {
  const P = [0, 1, 2].map((i) => k.curva(claves.map(([t, p]) => [t, p[i]]), undefined, 0));
  const O = [0, 1, 2].map((i) => k.curva(claves.map(([t, , o]) => [t, o[i]]), undefined, 0));
  return (t) => k.mira([P[0](t), P[1](t), P[2](t)], [O[0](t), O[1](t), O[2](t)]);
}

export function camVentana(t, modo) {
  const m = marcas();
  if (t < m.movil) {
    if (modo === "empuje") {
      return camino([
        [0, [14.6, -0.2, -7.4], [0, -2.4, 0.6]],
        [1.1, [13.2, -1.2, -6.6], [0, -4.6, 0.4]],
        [m.fin1, [14.8, 0.4, -7.2], [0, -1.6, 0]],
        [m.fin3 - 0.35, [16.2, 1.6, -6.4], [0, -1, 0]],
        [m.movil - 0.05, [16.2, 1.6, -6.4], [0, -1, 0]],
      ])(t);
    }
    return camino([
      [0, [0.8, -2.2, -24], [0, -3.4, 0]],
      [1.05, [0.15, -5.2, -14.2], [0, -6.1, 0]],
      [m.fin1 - 0.05, [0.05, -6.25, -11.8], [0, -6.5, 0]],
      [m.no + 0.2, [0.35, -3.2, -17], [0, -2.2, 0]],
      [m.fin3 - 0.45, [15.4, 1.2, -7.2], [0, -1.2, 0]],
      [m.movil - 0.05, [15.4, 1.2, -7.2], [0, -1.2, 0]],
    ])(t);
  }
  if (t < m.vaho) {
    return camino([
      [m.agujero, [15.6, 0.8, -8.4], [0, -2.2, 0]],
      [m.abajo, [12.4, -1.6, -7.2], [0, -5.8, 0.3]],
      [m.empuja, [17.2, 1.8, -6.6], [-2.4, -0.2, 0]],
      [m.fuera, [13.6, -0.4, -6.2], [3.2, -1.4, 3.2]],
      [m.reserva, [17.4, 1.8, -6.8], [0, -0.4, 0]],
      [m.rompe - 0.15, [14.2, 0.2, -6.4], [0.6, -1, 1.4]],
      [m.sola, [13.6, -0.4, -6.6], [0.3, -1.6, 1.2]],
      [m.hilo + 0.15, [12.6, -1.4, -6.2], [0, -5.2, 0.5]],
      [m.vaho - 0.08, [12.6, -1.4, -6.2], [0, -5.2, 0.5]],
    ])(t);
  }
  return camino([
    [m.hielo, [0.1, -5.85, -12.4], [0, -6.45, 0]],
    [m.anillo + 0.35, [0.15, -4.2, -18], [0, -4.6, 0]],
    [m.cielo, [1.2, -1.2, -22], [0, -2.4, 0]],
    [m.fin - 0.15, [1.8, -0.2, -30], [0, -1.6, 0]],
  ])(t);
}

function estado(t, modo) {
  const m = marcas();
  const sepU = t >= m.hielo - 0.02 ? 0 : k.suave(k.tramo(t, m.laminas + 0.05, m.fin3 - 0.55));
  let bowOut = 0, bowMid = 0;
  if (t < m.vaho) {
    const sube = k.suave(k.tramo(t, m.aire - 0.05, m.fuera));
    const cae = k.suave(k.tramo(t, m.rompe, m.rompe + 0.4));
    bowOut = sube * (1 - cae) * 2.6;
    bowMid = k.suave(k.tramo(t, m.rompe + 0.08, m.sola)) * 2.3;
  }
  const grieta = t >= m.rompe && t < m.hielo ? k.suave(k.tramo(t, m.rompe, m.rompe + 0.38)) : 0;
  let flujo = t >= m.empuja && t < m.hielo ? k.suave(k.tramo(t, m.empuja, m.empuja + 0.45)) : 0;
  if (modo === "empuje" && t < m.laminas + 0.8) {
    const exagera = 1 - k.suave(k.tramo(t, m.laminas - 0.15, m.laminas + 0.85));
      bowOut = Math.max(bowOut, 2.7 * exagera);
    flujo = Math.max(flujo, exagera);
  }
  const hilo = t >= m.hilo && t < m.vaho ? k.suave(k.tramo(t, m.hilo, m.hilo + 0.28)) : 0;
  const hielo = t >= m.hielo ? k.suave(k.tramo(t, m.hielo + 0.05, m.anillo + 0.2)) : 0;
  let defecto = 0;
  if (t >= m.defecto && t < m.laminas) {
    defecto = t < m.no
      ? k.suave(k.tramo(t, m.defecto, m.defecto + 0.32))
      : 1 - k.suave(k.tramo(t, m.no, m.no + 0.42));
  }
  const dentro = t >= m.dentro && t < m.movil ? k.suave(k.tramo(t, m.dentro, m.dentro + 0.35)) : 0;
  return { sep: k.mez(0.55, 5.6, sepU), bowOut, bowMid, grieta, flujo, hilo, hielo, defecto, dentro };
}

const capa = k.lienzo(1080, 1920);
const cg = capa.getContext("2d");

function proyectados(cam, pts) {
  const o = [];
  for (const p of pts) {
    const q = k.proyecta(cam, p);
    if (!q) return null;
    o.push(q);
  }
  return o;
}

function traza(g, qs) {
  g.beginPath();
  g.moveTo(qs[0].x, qs[0].y);
  for (let i = 1; i < qs.length; i++) g.lineTo(qs[i].x, qs[i].y);
  g.closePath();
}

function dome(x, y, z, bow) {
  const r2 = (x / RX) ** 2 + (y / RY) ** 2;
  return [x, y, z + bow * Math.max(0, 1 - r2)];
}

function borde(z) {
  const p = [];
  for (let i = 0; i < AN; i++) {
    const a = (i / AN) * Math.PI * 2;
    p.push([Math.cos(a) * RX, Math.sin(a) * RY, z]);
  }
  return p;
}

function aro(z, rad, y, bow) {
  const p = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const x = Math.cos(a) * rad, yy = y + Math.sin(a) * rad;
    p.push(dome(x, yy, z, bow));
  }
  return p;
}

function velo(g, al = 0.62) {
  const vg = g.createLinearGradient(0, 220, 0, 560);
  vg.addColorStop(0, `rgba(3,8,20,${al})`);
  vg.addColorStop(1, "rgba(3,8,20,0)");
  g.fillStyle = vg;
  g.fillRect(0, 200, 1080, 400);
}

function nubes(g, cam, tt) {
  g.save();
  for (const n of NUBES) {
    let x = n.x + tt * n.vel;
    x = ((x + 48) % 96) - 48;
    const c = k.proyecta(cam, [x, n.y, n.z]);
    if (!c) continue;
    const rw = k.tamano(n.rx, c.z), rh = k.tamano(n.ry, c.z);
    if (rw < 8 || rw > 2200) continue;
    const gr = g.createRadialGradient(c.x, c.y, rw * 0.1, c.x, c.y, rw);
    gr.addColorStop(0, "rgba(255,255,255,0.92)");
    gr.addColorStop(0.45, "rgba(236,246,255,0.55)");
    gr.addColorStop(1, "rgba(236,246,255,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(c.x, c.y, rw, Math.max(8, rh), 0, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

function fondo(g, cam, tt, ladoCabina) {
  const sg = g.createLinearGradient(0, 0, 0, 1920);
  sg.addColorStop(0, "#06122e");
  sg.addColorStop(0.38, "#1558b0");
  sg.addColorStop(0.62, "#3aa0ea");
  sg.addColorStop(1, "#c5ecff");
  g.fillStyle = sg;
  g.fillRect(0, 0, 1080, 1920);
  nubes(g, cam, tt);
  if (ladoCabina > 0.02) {
    const cg = g.createLinearGradient(0, 0, 820, 0);
    cg.addColorStop(0, `rgba(255,138,52,${0.72 * ladoCabina})`);
    cg.addColorStop(0.42, `rgba(255,168,78,${0.28 * ladoCabina})`);
    cg.addColorStop(1, "rgba(255,168,78,0)");
    g.fillStyle = cg;
    g.fillRect(0, 0, 1080, 1920);
    const suelo = g.createLinearGradient(0, 1200, 0, 1920);
    suelo.addColorStop(0, "rgba(255,138,52,0)");
    suelo.addColorStop(1, `rgba(90,28,16,${0.55 * ladoCabina})`);
    g.fillStyle = suelo;
    g.fillRect(0, 1100, 700, 820);
  }
}

function quad(g, cam, pts, color) {
  const qs = proyectados(cam, pts);
  if (!qs) return;
  traza(g, qs);
  g.fillStyle = color;
  g.fill();
}

function asiento(g, cam, al) {
  if (al < 0.04) return;
  g.save();
  g.globalAlpha = al;
  const x = -15.5, y = -3.2, z = -7.5;
  quad(g, cam, [[x, y, z], [x + 7.4, y, z + 1.6], [x + 7.4, y + 8.4, z + 1.6], [x, y + 8.4, z]], "#e23b42");
  quad(g, cam, [[x, y + 7.2, z], [x + 7.4, y + 7.2, z + 1.6], [x + 7, y + 11.2, z + 0.2], [x, y + 11.2, z - 0.8]], "#9a1c28");
  quad(g, cam, [[x + 0.6, y + 8.4, z + 0.3], [x + 6.4, y + 8.4, z + 1.3], [x + 5.8, y + 10.6, z - 1.6], [x + 0.8, y + 10.6, z - 2]], "#f4f7fb");
  g.restore();
}

function lamina(g, cam, z, bow, hole, tinta, bordeAl) {
  const centro = dome(0, 0, z, bow);
  const c = k.proyecta(cam, centro);
  const rim = borde(z);
  const qr = proyectados(cam, rim);
  if (!c || !qr) return null;
  cg.setTransform(1, 0, 0, 1, 0, 0);
  cg.clearRect(0, 0, 1080, 1920);
  cg.globalCompositeOperation = "source-over";
  cg.beginPath();
  cg.moveTo(c.x, c.y);
  for (const q of qr) cg.lineTo(q.x, q.y);
  cg.closePath();
  const gx = cg.createLinearGradient(c.x - 420, c.y - 500, c.x + 480, c.y + 520);
  gx.addColorStop(0, `rgba(255,255,255,${0.62 * tinta})`);
  gx.addColorStop(0.28, `rgba(198,230,255,${0.4 * tinta})`);
  gx.addColorStop(0.62, `rgba(120,190,255,${0.28 * tinta})`);
  gx.addColorStop(1, `rgba(30,80,140,${0.5 * tinta})`);
  cg.fillStyle = gx;
  cg.fill();
  cg.save();
  cg.clip();
  cg.globalAlpha = 0.22 * tinta;
  cg.globalCompositeOperation = "multiply";
  cg.drawImage(k.manchas, c.x - 700, c.y - 800, 1400, 1500);
  cg.globalCompositeOperation = "screen";
  cg.globalAlpha = 0.18 * tinta;
  cg.drawImage(k.red, c.x - 600, c.y - 700, 1200, 1300);
  cg.restore();
  if (hole) {
    const qh = proyectados(cam, aro(z, GR, HY, bow));
    if (qh) {
      cg.globalCompositeOperation = "destination-out";
      cg.globalAlpha = 1;
      traza(cg, qh);
      cg.fill();
    }
  }
  g.drawImage(capa, 0, 0);
  // canto: el grosor, para que sea una lámina y no una mancha
  g.save();
  const back = borde(z - 0.55);
  for (let i = 0; i < AN; i++) {
    const j = (i + 1) % AN;
    const qs = proyectados(cam, [rim[i], rim[j], back[j], back[i]]);
    if (!qs) continue;
    const dx = qs[1].x - qs[0].x, dy = qs[1].y - qs[0].y;
    if (dx * dx + dy * dy < 4 && (qs[2].x - qs[1].x) ** 2 + (qs[2].y - qs[1].y) ** 2 < 4) continue;
    traza(g, qs);
    g.fillStyle = `rgba(214,236,255,${0.45 * tinta})`;
    g.fill();
  }
  traza(g, qr);
  g.strokeStyle = `rgba(255,255,255,${bordeAl})`;
  g.lineWidth = 7;
  g.stroke();
  g.strokeStyle = `rgba(120,200,255,${bordeAl * 0.7})`;
  g.lineWidth = 16;
  g.stroke();
  g.restore();
  if (hole) {
    const qh = proyectados(cam, aro(z, GR, HY, bow));
    const qh2 = proyectados(cam, aro(z - 0.55, GR * 0.92, HY, bow));
    if (qh && qh2) {
      g.save();
      for (let i = 0; i < qh.length; i++) {
        const j = (i + 1) % qh.length;
        traza(g, [qh[i], qh[j], qh2[j], qh2[i]]);
        g.fillStyle = "rgba(8,16,32,0.55)";
        g.fill();
      }
      traza(g, qh);
      g.strokeStyle = "rgba(255,255,255,0.95)";
      g.lineWidth = 6;
      g.stroke();
      g.restore();
    }
  }
  return { c, qr };
}

function piel(g, cam, z, al) {
  if (al < 0.03) return;
  const fuera = bordeExtra(z, RX + 7.5, RY + 8.2, 36);
  const dentro = bordeExtra(z, RX + 0.35, RY + 0.45, 40);
  const qf = proyectados(cam, fuera), qd = proyectados(cam, dentro);
  if (!qf || !qd) return;
  cg.setTransform(1, 0, 0, 1, 0, 0);
  cg.clearRect(0, 0, 1080, 1920);
  cg.globalAlpha = al;
  cg.globalCompositeOperation = "source-over";
  traza(cg, qf);
  const pg = cg.createLinearGradient(0, 200, 1080, 1700);
  pg.addColorStop(0, "#1d5fbe");
  pg.addColorStop(0.45, "#3c92e4");
  pg.addColorStop(1, "#0c3e86");
  cg.fillStyle = pg;
  cg.fill();
  cg.globalCompositeOperation = "destination-out";
  cg.globalAlpha = 1;
  traza(cg, qd);
  cg.fill();
  g.drawImage(capa, 0, 0);
  // franja naranja
  quad(g, cam, [[-28, -1.15, z + 0.05], [28, -1.15, z + 0.05], [28, 1.35, z + 0.05], [-28, 1.35, z + 0.05]], `rgba(255,122,26,${al})`);
  g.save();
  g.globalAlpha = al;
  for (const [x, y] of REMACHES) {
    const p = k.proyecta(cam, [x, y, z + 0.08]);
    if (!p) continue;
    const s = k.tamano(0.28, p.z);
    g.fillStyle = "#d5dee8";
    g.beginPath();
    g.arc(p.x, p.y, Math.max(1.2, s), 0, 6.2832);
    g.fill();
  }
  g.restore();
  // otras ventanillas, para que al alejarse se vea el fuselaje
  for (const ix of [-2, -1, 1, 2, 3]) {
    const ox = ix * 26;
    const qo = proyectados(cam, bordeExtra(z - 0.02, RX, RY, 28).map((p) => [p[0] + ox, p[1], p[2]]));
    if (!qo) continue;
    g.save();
    g.globalAlpha = al * 0.95;
    traza(g, qo);
    g.fillStyle = "#07182e";
    g.fill();
    g.strokeStyle = "rgba(220,236,255,0.8)";
    g.lineWidth = 4;
    g.stroke();
    g.restore();
  }
}

function bordeExtra(z, rx, ry, n) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    p.push([Math.cos(a) * rx, Math.sin(a) * ry, z]);
  }
  return p;
}

function ala(g, cam, al) {
  if (al < 0.2) return;
  g.save();
  g.globalAlpha = Math.min(1, al);
  quad(g, cam, [[4, -9.5, 5], [52, -16, 16], [48, -17.2, 30], [2, -11, 14]], "#0e4a9a");
  quad(g, cam, [[6, -10.2, 8], [36, -14.2, 16], [34, -14.6, 20], [5, -10.8, 12]], "#ff7a1a");
  g.restore();
}

function motas(g, cam, tt, st) {
  if (st.flujo < 0.02 && st.hilo < 0.02) return;
  const ciclo = 2.15;
  for (let i = 0; i < MOTAS.length; i++) {
    const m = MOTAS[i];
    const e = st.grieta > 0.4 ? k.suave(k.tramo(st.hilo, 0.02, 0.65)) : 0;
    const u = ((tt * k.mez(0.72, 1.05, e) + m.fase * ciclo) % ciclo) / ciclo;
    const hx = m.x * k.mez(1.15, 0.28, e);
    const hy = HY + m.y * k.mez(1.35, 0.28, e);
    let x, y, z, al;
    if (u < 0.42) {
      const s = u / 0.42;
      x = k.mez(m.x * 7.2, hx, k.entra(s));
      y = k.mez(HY + m.y * 6.5, hy, k.entra(s));
      z = k.mez(-11, -0.2, s);
      al = st.flujo * k.suave(k.tramo(s, 0, 0.2));
    } else if (u < 0.62) {
      const s = (u - 0.42) / 0.2;
      x = hx; y = hy;
      z = k.mez(-0.2, st.sep + 0.4, s);
      al = Math.max(st.flujo, st.hilo);
    } else {
      const s = (u - 0.62) / 0.38;
      const xE = k.mez(hx, hx * 2.2, s), yE = k.mez(hy, hy + 0.4, s), zE = k.mez(st.sep, st.sep + 4.2, s);
      const xA = k.mez(hx, m.x * 5.5, s), yA = k.mez(hy, m.y * 6 + HY * 0.3, s);
      const zA = st.sep + st.bowOut * (1 - Math.min(1, (xA / RX) ** 2 + (yA / RY) ** 2)) - 0.1;
      x = k.mez(xA, xE, e); y = k.mez(yA, yE, e); z = k.mez(zA, zE, e);
      al = (1 - s) * k.mez(st.flujo, st.hilo, e);
    }
    const p = k.proyecta(cam, [x, y, z]);
    if (!p) continue;
    const tam = k.tamano(m.tam, p.z) * 6;
    k.brillo(g, p.x, p.y, Math.max(16, tam), "naranja", al * 0.95);
  }
}

function falsas(g, cam, z, u) {
  if (u < 0.03) return;
  const o = k.proyecta(cam, dome(2.4, -1.2, z, 0));
  if (!o) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(255,255,255,${0.8 * u})`;
  g.lineWidth = 5;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(o.x, o.y);
  g.lineTo(o.x + 90 * u, o.y - 40 * u);
  g.lineTo(o.x + 70 * u, o.y + 80 * u);
  g.stroke();
  g.restore();
}

function grietas(g, cam, z, bow, u) {
  if (u < 0.03) return;
  const o = k.proyecta(cam, dome(2.2, 2.4, z, bow));
  if (!o) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  for (const s of GRIETAS) {
    const L = s.L * u;
    g.strokeStyle = "rgba(255,255,255,0.8)";
    g.lineWidth = s.w;
    g.beginPath();
    g.moveTo(o.x, o.y);
    g.lineTo(o.x + Math.cos(s.a) * L * 0.55 + s.j * u, o.y + Math.sin(s.a) * L * 0.42);
    g.lineTo(o.x + Math.cos(s.a) * L, o.y + Math.sin(s.a) * L * 0.72);
    g.stroke();
  }
  k.brillo(g, o.x, o.y, 220 * u, "blanca", 0.55 * (u < 0.4 ? u / 0.4 : Math.max(0, 1 - (u - 0.4) / 0.5)));
  g.restore();
}

function hiloDibujo(g, cam, st) {
  if (st.hilo < 0.05) return;
  const a = k.proyecta(cam, [0, HY, -1.2]);
  const b = k.proyecta(cam, [0, HY, st.sep + 1.5]);
  if (!a || !b) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(190,245,255,${0.45 * st.hilo})`;
  g.lineWidth = 10;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(a.x, a.y);
  g.lineTo(b.x, b.y);
  g.stroke();
  g.strokeStyle = `rgba(255,255,255,${0.8 * st.hilo})`;
  g.lineWidth = 3;
  g.stroke();
  g.restore();
}

function copos(g, cam, z, u) {
  if (u < 0.02) return;
  g.save();
  g.lineCap = "round";
  for (const c of COPOS) {
    const r0 = GR + 0.12 + c.rad * 0.15;
    const r1 = r0 + c.largo * u;
    const x0 = Math.cos(c.a) * r0, y0 = HY + Math.sin(c.a) * r0;
    const x1 = Math.cos(c.a) * r1, y1 = HY + Math.sin(c.a) * r1;
    const p = k.proyecta(cam, [x0, y0, z]);
    const q = k.proyecta(cam, [x1, y1, z]);
    if (!p || !q) continue;
    g.strokeStyle = "rgba(255,255,255,0.95)";
    g.lineWidth = Math.max(1.6, (c.gordo ? 7 : 3.2) * (k.tamano(0.2, p.z) / 18));
    g.beginPath();
    g.moveTo(p.x, p.y);
    g.lineTo(q.x, q.y);
    g.stroke();
  }
  const h = k.proyecta(cam, [0, HY, z]);
  if (h) k.brillo(g, h.x, h.y, k.tamano(2.2, h.z), "blanca", 0.35 * u);
  g.restore();
}

export function ventana(g, t, modo = "cielo") {
  const m = marcas();
  const fin = t < m.movil ? m.movil : t < m.vaho ? m.vaho : m.fin;
  const tt = reloj(t, fin);
  const cam = camVentana(t, modo);
  const st = estado(t, modo);
  const dentroCabina = cam.p[2] < -3;
  const lado = k.suave(k.tramo(cam.p[0], 6, 12));
  const nubeT = (tt <= m.laminas ? tt : m.laminas + (tt - m.laminas) * 0.4);
  fondo(g, cam, nubeT, lado);
  const marco = (st.sep < 1.2 ? 1 : 0) * (1 - k.suave(k.tramo(cam.p[0], 4.5, 9))) * (dentroCabina ? 1 : 0);
  if (marco > 0.03) marcoCabina(g, cam, -st.sep - 0.85, marco);
  asiento(g, cam, Math.max(lado, k.suave(k.tramo(t, m.cielo - 0.3, m.cielo + 0.5))));

  const panes = [
    { rol: "dentro", z: -st.sep, bow: 0, hole: false },
    { rol: "medio", z: 0, bow: st.bowMid, hole: true },
    { rol: "fuera", z: st.sep, bow: st.bowOut, hole: false },
  ];
  const orden = panes.map((p) => {
    const q = k.proyecta(cam, [0, 0, p.z]);
    return { ...p, zz: q ? q.z : 0 };
  }).sort((a, b) => b.zz - a.zz);

  let medio = null;
  for (const p of orden) {
    const foco = (p.rol === "dentro" && st.dentro) || (p.rol === "medio" && t > m.medio && t < m.aire) || (p.rol === "fuera" && st.bowOut > 0.4) ? 1 : 0.72;
    const bordeAl = 0.45 + 0.5 * (p.rol === "dentro" ? st.dentro : p.rol === "fuera" && st.bowOut > 0.3 ? 1 : p.rol === "medio" && st.bowMid > 0.2 ? 1 : 0);
    const dib = lamina(g, cam, p.z, p.bow, p.hole, foco, Math.min(1, bordeAl));
    if (p.rol === "medio") medio = { ...p, dib };
    if (p.rol === "fuera" && st.grieta > 0 && dib) grietas(g, cam, p.z, p.bow, st.grieta);
  }
  if (st.defecto > 0) falsas(g, cam, 0, st.defecto);
  motas(g, cam, tt, st);
  if (st.hilo > 0.05 && st.grieta > 0.5) hiloDibujo(g, cam, st);
  if (st.hielo > 0) copos(g, cam, 0.15, st.hielo);

  // brillo del agujero cuando estamos cerca y aún no hay hielo
  const h = k.proyecta(cam, dome(0, HY, 0, st.bowMid));
  if (h && st.hielo < 0.85) {
    const qh = proyectados(cam, aro(0, GR * 1.05, HY, st.bowMid));
    if (qh) {
      g.save();
      traza(g, qh);
      g.strokeStyle = "rgba(255,255,255,0.95)";
      g.lineWidth = Math.max(4, Math.min(14, k.tamano(0.18, h.z)));
      g.stroke();
      g.restore();
    }
    k.brillo(g, h.x, h.y, Math.min(240, k.tamano(1.05, h.z)), "blanca", 0.28);
  }
  velo(g, 0.5);
}

function marcoCabina(g, cam, z, al) {
  const dentro = bordeExtra(z, RX + 0.15, RY + 0.2, 40);
  const qd = proyectados(cam, dentro);
  if (!qd) return;
  cg.setTransform(1, 0, 0, 1, 0, 0);
  cg.clearRect(0, 0, 1080, 1920);
  cg.globalAlpha = al;
  cg.globalCompositeOperation = "source-over";
  const pg = cg.createLinearGradient(0, 0, 700, 1920);
  pg.addColorStop(0, "#1c314c");
  pg.addColorStop(0.45, "#3c5878");
  pg.addColorStop(1, "#121820");
  cg.fillStyle = pg;
  cg.fillRect(0, 0, 1080, 1920);
  // paneles del revestimiento, para que la pared no sea un vacío
  cg.strokeStyle = "rgba(255,255,255,0.08)";
  cg.lineWidth = 3;
  for (let y = 200; y < 1900; y += 150) { cg.beginPath(); cg.moveTo(0, y); cg.lineTo(1080, y); cg.stroke(); }
  cg.globalCompositeOperation = "destination-out";
  cg.globalAlpha = 1;
  traza(cg, qd);
  cg.fill();
  if (cam.p[2] < -24) {
    for (const ix of [-1, 1]) {
      const ox = ix * 22;
      const qo = proyectados(cam, bordeExtra(z - 0.05, RX * 0.9, RY * 0.9, 24).map((p) => [p[0] + ox, p[1], p[2]]));
      if (!qo) continue;
      traza(cg, qo);
      cg.fill();
    }
  }
  g.drawImage(capa, 0, 0);
  if (cam.p[2] < -24) {
    for (const ix of [-1, 1]) {
      const ox = ix * 22;
      const qo = proyectados(cam, bordeExtra(z - 0.02, RX * 0.9, RY * 0.9, 24).map((p) => [p[0] + ox, p[1], p[2]]));
      if (!qo) continue;
      g.save();
      g.globalAlpha = al;
      traza(g, qo);
      const sg = g.createLinearGradient(0, 300, 0, 1600);
      sg.addColorStop(0, "#b9e6ff");
      sg.addColorStop(1, "#1d6ec8");
      g.fillStyle = sg;
      g.fill();
      g.restore();
    }
  }
}

export function dibujaMovil(g, t) {
  const m = marcas();
  const fin = m.agujero;
  const tt = reloj(t, fin);
  const llega = k.suave(k.tramo(t, m.movil, m.movil + 0.28));
  const prensa = k.suave(k.tramo(t, m.tocas - 0.08, m.tocas + 0.55));
  const raya = k.suave(k.tramo(t, m.rayar, m.rayar + 0.55));
  // mesa oscura, lámpara caliente
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#1a0c14");
  bg.addColorStop(0.45, "#3a1c16");
  bg.addColorStop(1, "#120804");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 180, 280, 900, "naranja", 0.45);
  // móvil grande
  const x = 190, y = 530 + (1 - llega) * 30, w = 700, h = 1120;
  g.save();
  k.redondo(g, x - 28, y - 28, w + 56, h + 56, 78);
  g.fillStyle = "#0c0d12";
  g.fill();
  g.save();
  k.redondo(g, x, y, w, h, 54);
  g.clip();
  const sg = g.createLinearGradient(x, y, x, y + h);
  sg.addColorStop(0, "#8fd0ff");
  sg.addColorStop(0.55, "#2f7ed6");
  sg.addColorStop(1, "#12386e");
  g.fillStyle = sg;
  g.fillRect(x, y, w, h);
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.beginPath();
  g.ellipse(x + 180, y + 280, 150, 54, -0.3, 0, 6.28);
  g.ellipse(x + 400, y + 360, 120, 40, 0.2, 0, 6.28);
  g.fill();
  g.restore();
  // protector: una lámina clara que el dedo aplasta
  const lev = (1 - prensa) * 70;
  g.save();
  g.translate(0, -lev);
  g.globalAlpha = 0.72;
  k.redondo(g, x - 8, y - 16, w + 16, h + 8, 58);
  g.fillStyle = "rgba(214,236,255,0.28)";
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 6;
  g.stroke();
  if (raya > 0.02) {
    g.strokeStyle = `rgba(255,255,255,${0.95 * raya})`;
    g.lineWidth = 8;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(x + 310, y + 520);
    g.lineTo(x + 310 + 150 * raya, y + 520 + 40 * raya);
    g.stroke();
  }
  g.restore();
  // dedo
  const fx = k.mez(1120, x + 420, k.entra(k.suave(k.tramo(t, m.movil + 0.05, m.tocas + 0.15))));
  const fy = k.mez(1760, y + 640 - lev * 0.25, k.entra(k.suave(k.tramo(t, m.movil + 0.05, m.tocas + 0.2))));
  g.save();
  g.translate(fx, fy);
  g.rotate(-0.55);
  const dg = g.createLinearGradient(-80, -60, 90, 160);
  dg.addColorStop(0, "#ffd7c2");
  dg.addColorStop(0.45, "#e39a78");
  dg.addColorStop(1, "#b86a48");
  g.fillStyle = dg;
  k.redondo(g, -90, -40, 180, 520, 90);
  g.fill();
  g.fillStyle = "#f8d8c8";
  k.redondo(g, -58, -36, 116, 100, 40);
  g.fill();
  g.restore();
  // el cristal de debajo, intacto: un reflejo limpio que queda cuando el dedo ya apoyó
  if (prensa > 0.85) {
    g.save();
    g.globalAlpha = (prensa - 0.85) / 0.15 * 0.9;
    k.reflejo(g, x + 70, y + 80, 70, 420, 0.22);
    g.restore();
  }
  g.restore();
  // un poco de vida en la lámpara
  k.brillo(g, 180, 280, 500 + 30 * Math.sin(tt * 3), "naranja", 0.18);
  velo(g, 0.35);
}

export function dibujaBano(g, t) {
  const m = marcas();
  const fin = m.hielo;
  const tt = reloj(t, fin);
  const claro = k.suave(k.tramo(t, m.vaho + 0.12, m.rendija + 0.05));
  // azulejos
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#147a86");
  bg.addColorStop(1, "#0c3e4a");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  const az = k.azar(8);
  for (let iy = 0; iy < 14; iy++) for (let ix = 0; ix < 8; ix++) {
    const x = ix * 140 - 10, y = iy * 140 - 20;
    g.fillStyle = az() > 0.5 ? "#1aa0a8" : "#148f98";
    k.redondo(g, x + 6, y + 6, 128, 128, 10);
    g.fill();
  }
  // luz caliente arriba
  k.brillo(g, 540, 160, 1100, "amarilla", 0.35);
  // espejo
  const x = 140, y = 540, w = 800, h = 860;
  g.save();
  k.redondo(g, x - 28, y - 28, w + 56, h + 56, 36);
  g.fillStyle = "#f4f7fb";
  g.fill();
  g.save();
  k.redondo(g, x, y, w, h, 18);
  g.clip();
  // lo que se ve cuando se desempaña: el cielo, otra vez
  const sg = g.createLinearGradient(x, y, x, y + h);
  sg.addColorStop(0, "#9ad4ff");
  sg.addColorStop(1, "#1d6ec4");
  g.fillStyle = sg;
  g.fillRect(x, y, w, h);
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath();
  g.ellipse(x + 260, y + 300, 180, 60, -0.2, 0, 6.28);
  g.fill();
  // vaho: se abre un círculo desde la rendija de abajo
  const cx = x + w / 2, cy = y + h - 40;
  const R = 80 + claro * 620;
  cg.setTransform(1, 0, 0, 1, 0, 0);
  cg.clearRect(0, 0, 1080, 1920);
  cg.fillStyle = "rgba(244,248,252,0.94)";
  cg.fillRect(x, y, w, h);
  cg.globalCompositeOperation = "destination-out";
  const rg = cg.createRadialGradient(cx, cy, R * 0.45, cx, cy, R);
  rg.addColorStop(0, "rgba(0,0,0,1)");
  rg.addColorStop(0.72, "rgba(0,0,0,1)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  cg.fillStyle = rg;
  cg.beginPath();
  cg.arc(cx, cy, R, 0, 6.2832);
  cg.fill();
  g.drawImage(capa, 0, 0);
  g.restore();
  g.restore();
  // rendija oscura bajo el marco
  g.fillStyle = "#071014";
  k.redondo(g, x + 180, y + h + 18, 420, 28, 10);
  g.fill();
  // vapor grande que baja hacia la rendija: tiene que llenar la pantalla, no un hilito
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 7; i++) {
    const u = ((tt * 0.85 + i * 0.14) % 1);
    const px = 220 + (i % 4) * 180 + Math.sin(u * 6.2 + i) * 40;
    const py = k.mez(y + 80, y + h + 30, u);
    k.brillo(g, px, py, 420, "blanca", 0.34 * Math.sin(Math.PI * u) * (1 - claro * 0.35));
  }
  g.restore();
  // alcachofa de la ducha, para que sea un baño
  g.save();
  g.translate(860, 700);
  g.fillStyle = "#d5dee6";
  k.redondo(g, -18, 0, 36, 160, 16);
  g.fill();
  g.beginPath();
  g.arc(0, 0, 70, 0, 6.2832);
  g.fillStyle = "#eef3f7";
  g.fill();
  g.fillStyle = "#8aa0b0";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 6.2832;
    g.beginPath();
    g.arc(Math.cos(a) * 32, Math.sin(a) * 32, 6, 0, 6.28);
    g.fill();
  }
  g.restore();
  // toalla naranja
  g.fillStyle = "#ff7a1a";
  k.redondo(g, 40, 980, 120, 420, 24);
  g.fill();
  velo(g, 0.42);
}
