// El tablero, las piezas y todo lo que les pasa. Un solo sitio.
import * as k from "#kit";
import { v } from "#voz";

const { suave, tramo, entra, sale, mez, mezV, pulso, proyecta, tamano, mira, azar, lienzo, manchas, brillo, fogonazo } = k;

// f 0..7 = columnas a..h, r 0..7 = fila 1..8 (blancas abajo, cerca de la cámara).
// ok: el maestro la devuelve. nov: el principiante también. queda: no se tumba en el azar.
// grupo 1, 2 o 3: un trozo de partida de verdad.
const def = (tipo, blanca, f, r, ok, nov, grupo, queda) => ({ tipo, blanca, f, r, ok, nov, grupo, queda: !!queda });
const PIEZAS = [
  def("R", 1, 0, 0, 0, 0, 0),
  def("B", 1, 2, 0, 0, 0, 0),
  def("Q", 1, 3, 1, 0, 0, 0),
  def("K", 1, 4, 0, 1, 0, 2),
  def("R", 1, 7, 0, 1, 0, 2),
  def("N", 1, 5, 2, 1, 1, 1, 1),
  def("P", 1, 0, 1, 0, 0, 0),
  def("P", 1, 1, 1, 0, 0, 0),
  def("P", 1, 2, 3, 1, 0, 1),
  def("P", 1, 3, 3, 1, 0, 1),
  def("P", 1, 4, 3, 1, 1, 1, 1),
  def("P", 1, 5, 1, 1, 0, 2),
  def("P", 1, 6, 1, 1, 0, 2),
  def("R", 0, 0, 7, 0, 0, 0),
  def("B", 0, 2, 7, 0, 0, 0),
  def("Q", 0, 3, 7, 0, 0, 0),
  def("K", 0, 4, 7, 1, 1, 3, 1),
  def("R", 0, 5, 7, 1, 0, 3),
  def("N", 0, 5, 5, 1, 0, 0),
  def("P", 0, 0, 6, 0, 0, 0),
  def("P", 0, 2, 4, 1, 0, 0),
  def("P", 0, 3, 5, 1, 1, 0, 1),
  def("P", 0, 4, 5, 1, 0, 0),
  def("P", 0, 5, 6, 1, 0, 3),
  def("P", 0, 6, 6, 1, 0, 3),
];

const az = azar(42);
const orden = PIEZAS.map((_, i) => i);
for (let i = orden.length - 1; i > 0; i--) {
  const j = Math.floor(az() * (i + 1));
  [orden[i], orden[j]] = [orden[j], orden[i]];
}
const libres = [];
for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
  if (!PIEZAS.some((p) => p.f === f && p.r === r)) libres.push([f, r]);
}
for (let i = libres.length - 1; i > 0; i--) {
  const j = Math.floor(az() * (i + 1));
  [libres[i], libres[j]] = [libres[j], libres[i]];
}
PIEZAS.forEach((p, i) => { p.rf = libres[orden[i] % libres.length][0]; p.rr = libres[orden[i] % libres.length][1]; });

const centro = (f, r, y = 0) => [f - 3.5, y, 3.5 - r];
const mix3 = (a, b, u) => mezV(a, b, u);

// ---------------------------------------------------------------- piezas dibujadas una vez
const PAL = {
  1: { luz: "#fffaf0", medio: "#f3d29a", sombra: "#a8743a", aro: "#ffe7a8" },
  0: { luz: "#c4b4ff", medio: "#3c2a86", sombra: "#120c24", aro: "#ddd0ff" },
};
function relleno(g, pal, trazar) {
  g.beginPath();
  trazar();
  const gr = g.createLinearGradient(50, 30, 190, 300);
  gr.addColorStop(0, pal.luz);
  gr.addColorStop(0.42, pal.medio);
  gr.addColorStop(1, pal.sombra);
  g.fillStyle = gr;
  g.fill();
  g.lineWidth = 7;
  g.strokeStyle = pal.aro;
  g.stroke();
  g.save();
  g.clip();
  g.globalAlpha = 0.22;
  g.fillStyle = "#fff";
  g.beginPath();
  g.ellipse(92, 90, 28, 70, -0.4, 0, 6.28);
  g.fill();
  g.restore();
}
function peana(g, pal) {
  g.fillStyle = pal.sombra;
  g.beginPath();
  g.ellipse(120, 292, 78, 16, 0, 0, 6.28);
  g.fill();
  g.fillStyle = pal.aro;
  g.globalAlpha = 0.9;
  g.beginPath();
  g.ellipse(120, 286, 62, 12, 0, 0, 6.28);
  g.fill();
  g.globalAlpha = 1;
}
const trazos = {
  P(g) {
    g.moveTo(78, 286); g.lineTo(96, 168);
    g.bezierCurveTo(70, 150, 78, 78, 120, 78);
    g.bezierCurveTo(162, 78, 170, 150, 144, 168);
    g.lineTo(162, 286); g.closePath();
  },
  R(g) {
    g.moveTo(70, 286); g.lineTo(78, 150);
    g.lineTo(70, 150); g.lineTo(70, 108); g.lineTo(96, 108); g.lineTo(96, 132);
    g.lineTo(112, 132); g.lineTo(112, 108); g.lineTo(128, 108); g.lineTo(128, 132);
    g.lineTo(144, 132); g.lineTo(144, 108); g.lineTo(170, 108); g.lineTo(170, 150);
    g.lineTo(162, 150); g.lineTo(170, 286); g.closePath();
  },
  B(g) {
    g.moveTo(82, 286); g.lineTo(100, 176);
    g.bezierCurveTo(78, 160, 86, 70, 120, 48);
    g.bezierCurveTo(154, 70, 162, 160, 140, 176);
    g.lineTo(158, 286); g.closePath();
  },
  N(g) {
    g.moveTo(74, 286); g.lineTo(64, 196);
    g.bezierCurveTo(48, 150, 78, 96, 112, 86);
    g.lineTo(98, 40); g.lineTo(128, 82);
    g.bezierCurveTo(176, 74, 204, 118, 190, 156);
    g.quadraticCurveTo(176, 176, 148, 162);
    g.bezierCurveTo(172, 210, 156, 250, 160, 286);
    g.closePath();
  },
  Q(g) {
    g.moveTo(68, 286); g.lineTo(80, 168);
    g.lineTo(74, 108); g.lineTo(98, 148); g.lineTo(112, 78); g.lineTo(120, 140);
    g.lineTo(128, 78); g.lineTo(142, 148); g.lineTo(166, 108); g.lineTo(160, 168);
    g.lineTo(172, 286); g.closePath();
  },
  K(g) {
    g.moveTo(72, 286); g.lineTo(84, 170);
    g.lineTo(78, 128); g.lineTo(108, 128); g.lineTo(108, 100);
    g.lineTo(92, 100); g.lineTo(92, 78); g.lineTo(148, 78); g.lineTo(148, 100);
    g.lineTo(132, 100); g.lineTo(132, 128); g.lineTo(162, 128); g.lineTo(156, 170);
    g.lineTo(168, 286); g.closePath();
  },
};
const sprites = new Map();
function sprite(tipo, blanca) {
  const id = tipo + blanca;
  if (sprites.has(id)) return sprites.get(id);
  const c = lienzo(240, 320), g = c.getContext("2d"), pal = PAL[blanca];
  peana(g, pal);
  relleno(g, pal, () => trazos[tipo](g));
  if (tipo === "B") {
    g.strokeStyle = pal.sombra; g.lineWidth = 6;
    g.beginPath(); g.moveTo(120, 70); g.lineTo(120, 150); g.stroke();
  }
  if (tipo === "Q") {
    g.fillStyle = pal.aro;
    for (const x of [74, 112, 128, 166]) { g.beginPath(); g.arc(x, tipo === "Q" ? 108 : 100, 8, 0, 6.28); g.fill(); }
    g.beginPath(); g.arc(120, 74, 9, 0, 6.28); g.fill();
  }
  sprites.set(id, c);
  return c;
}
PIEZAS.forEach((p) => sprite(p.tipo, p.blanca));

// ---------------------------------------------------------------- tiempo de la voz
function tiempos() {
  const f = (n) => v.frase(n);
  return {
    diec: f(1).t("dieciseis"), sitio: f(1).finDe("sitio"),
    f2: f(2).inicio, cuatro: f(2).t("cuatro"),
    f3: f(3).inicio, f4: f(4).inicio,
    v25: f(4).t("veinticinco"), juego: f(4).t("juego"), tapan: f(4).t("tapan"),
    f5: f(5).inicio, foto: f(5).t("foto"),
    f6: f(6).inicio, igual: f(6).t("igual"),
    pon: f(7).t("pon"), azar: f(7).t("azar"),
    cae: f(8).t("cae"), grupos: f(8).t("grupos"),
    f9: f(9).inicio, hueco: f(9).t("hueco"),
    f10: f(10).inicio, partidas: f(10).t("partidas"), dentro: f(10).t("dentro"),
    f11: f(11).inicio, cociente: f(11).t("cociente"), numero: f(11).t("numero"), vales: f(11).t("vales"),
    fin: v.duracion,
  };
}

function camDe(claves, t) {
  if (t <= claves[0][0]) return mira(claves[0][1], claves[0][2]);
  for (let i = 0; i < claves.length - 1; i++) {
    const a = claves[i], b = claves[i + 1];
    if (t <= b[0]) {
      const u = suave(tramo(t, a[0], b[0]));
      return mira(mezV(a[1], b[1], u), mezV(a[2], b[2], u));
    }
  }
  const z = claves[claves.length - 1];
  return mira(z[1], z[2]);
}
function camara(t, T) {
  return camDe([
    [-0.55, [2.4, 2.6, 6.4], [0, 1.3, 0.6]],
    [0.7, [-1.6, 3.1, 7.6], [0, 0.9, 0.2]],
    [T.diec, [0.2, 5.1, 9.4], [0, 0.2, 0]],
    [T.cuatro, [-0.2, 3.5, 6.9], [0.3, 0.1, 1.4]],
    [T.f3, [0.1, 5.6, 9.8], [0, 0, 0]],
    [T.v25, [0.5, 6.6, 10.6], [0, 0, -0.3]],
    [T.tapan, [0, 7.4, 11.2], [0, 0.1, 0]],
    [T.foto, [0.15, 5.5, 9.2], [0, 0.25, 0]],
    [T.igual, [0.7, 5.3, 8.9], [0, 0.1, 0]],
    [T.azar, [-0.9, 6.3, 9.8], [0, 0, 0]],
    [T.cae, [0.25, 4.6, 8.3], [0, -0.15, 0.5]],
    [T.grupos, [0, 5.8, 9.6], [0, 0.35, 0]],
    [T.hueco, [0, 4.2, 8.7], [0, 1.15, 0]],
    [T.partidas, [0, 8.8, 14.5], [0, 0.2, -2.2]],
    [T.numero, [0.15, 8.2, 13.6], [0, 0.15, -0.6]],
    [T.fin, [0, 7.7, 12.9], [0, 0, 0]],
  ], t);
}

// Cuánta tela hay encima (0 destapado, 1 cubierto).
function tela(t, T) {
  const baja = suave(tramo(t, T.tapan - 0.02, T.tapan + 0.34));
  const sube = suave(tramo(t, T.f5 + 0.05, T.foto));
  return t < T.f5 ? baja : baja * (1 - sube);
}

function lugar(p, i, t, T) {
  const real = centro(p.f, p.r);
  const rnd = centro(p.rf, p.rr);
  const bob = Math.sin(t * 2.3 + i * 0.8) * 0.028;
  const aire = [real[0] * 0.55 + ((i % 5) - 2) * 0.55, 2.15 + (i % 4) * 0.22, real[2] * 0.55 + 1.1];
  const fuera = [((i % 2) ? -1 : 1) * (5.1 + (i % 3) * 0.25), 0.35, 5.6];
  let pos = [real[0], bob, real[2]], ang = 0, al = 1, glow = 0, esc = 1;

  if (t < T.f4) {
    const aterriza = sale(tramo(t, -0.4, T.diec + (i % 5) * 0.045 - 0.06));
    pos = mix3(aire, [real[0], bob, real[2]], aterriza);
    if (!p.ok) {
      const seVa = sale(tramo(t, T.diec + 0.02, T.sitio + 0.2));
      pos = mix3(pos, fuera, seVa);
      ang = seVa * 1.15 * ((i % 2) ? 1 : -1);
      al = 1 - seVa * 0.92;
    } else if (!p.nov && t >= T.f3) {
      const fant = Math.sin(tramo(t, T.f3, T.f4) * Math.PI);
      pos = [real[0], bob + 0.08, real[2]];
      ang = 0;
      al = Math.max(0, fant) * 0.72;
    } else if (!p.nov && t >= T.f2) {
      const seVa = entra(tramo(t, T.f2 + 0.08, T.cuatro + 0.05));
      pos = mix3([real[0], bob, real[2]], fuera, seVa);
      ang = seVa * 1.05 * ((i % 2) ? -1 : 1);
      al = 1 - seVa * 0.92;
    }
    if (p.ok && aterriza > 0.92 && t < T.f2) glow = pulso(t, T.diec + (i % 5) * 0.02, 0.18);
    if (p.nov && t >= T.cuatro - 0.05 && t < T.f4) {
      glow = 0.35 + 0.2 * Math.sin(t * 6);
      esc = 1 + 0.1 * Math.sin(t * 6);
    }
    return { pos, ang, al, glow, esc };
  }

  const llega = entra(tramo(t, T.f4, T.v25 + 0.2));
  const origen = p.nov ? real : (p.ok ? fuera : aire);
  pos = mix3(origen, [real[0], bob, real[2]], llega);
  al = p.nov ? 1 : llega;
  if (p.tipo === "P" && p.f === 4 && p.r === 3 && llega > 0.95 && t < T.tapan) {
    pos[1] += Math.sin(tramo(t, T.juego - 0.2, T.juego + 0.55) * Math.PI) * 0.42;
  }
  if (t >= T.f6 && t < T.pon) {
    const j = suave(tramo(t, T.f6, T.igual));
    pos[0] += Math.sin(t * 36 + i * 1.7) * 0.075 * j;
    pos[2] += Math.cos(t * 31 + i) * 0.05 * j;
  }

  const cubre = tela(t, T);
  if (cubre > 0.62 && t < T.foto) al = 0;

  const uAzar = suave(tramo(t, T.pon, T.azar));
  const uVolver = suave(tramo(t, T.grupos - 0.12, T.grupos + 0.62));
  const uRand = uAzar * (1 - uVolver);
  if (uRand > 0.001 || uVolver > 0.001) {
    pos = mix3([real[0], bob, real[2]], [rnd[0], bob, rnd[2]], uRand);
    al = Math.max(al, llega);
  }
  const uCae = suave(tramo(t, T.cae - 0.06, T.cae + 0.38));
  const tumba = uCae * (1 - uVolver);
  if (!p.queda && tumba > 0.001) {
    ang = tumba * 1.45 * ((i % 2) ? 1 : -1);
    pos[1] += tumba * 0.05;
  }

  const comp = t < T.f9 ? 0
    : t < T.f10 ? suave(tramo(t, T.f9 + 0.04, T.hueco))
    : t < T.partidas ? 1 - suave(tramo(t, T.f10, T.partidas))
    : 0;
  if (comp > 0.001 && p.grupo) {
    const c = centroGrupo(p.grupo);
    pos = mix3(pos, [c[0], 0.85, c[2]], comp);
    esc = mez(1, 0.12, comp);
    al *= 1 - comp * 0.92;
    ang *= 1 - comp;
  } else if (comp > 0.001 && !p.grupo) {
    al *= 1 - comp * 0.85;
  }
  if (p.grupo && t >= T.grupos && comp < 0.9) {
    glow = suave(tramo(t, T.grupos, T.grupos + 0.35)) * (1 - comp) * (1 - tumba);
  }
  return { pos, ang, al, glow, esc };
}

const centrosG = [null];
function centroGrupo(g) {
  if (centrosG[g]) return centrosG[g];
  const ps = PIEZAS.filter((p) => p.grupo === g);
  let x = 0, z = 0;
  for (const p of ps) { const c = centro(p.f, p.r); x += c[0]; z += c[2]; }
  centrosG[g] = [x / ps.length, 0.8, z / ps.length];
  return centrosG[g];
}
const huecoDe = (g) => [(g - 2) * 1.85, 1.85, 0.2];

// ---------------------------------------------------------------- dibujo del mundo
function fondo(g) {
  g.fillStyle = "#07060f";
  g.fillRect(0, 0, 1080, 1920);
  const rg = g.createRadialGradient(540, 820, 40, 540, 1040, 980);
  rg.addColorStop(0, "rgba(120,72,28,0.55)");
  rg.addColorStop(0.45, "rgba(18,28,48,0.35)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, 1080, 1920);
}
function velo(g, al) {
  if (al < 0.02) return;
  const vg = g.createLinearGradient(0, 120, 0, 680);
  vg.addColorStop(0, `rgba(7,6,14,${al})`);
  vg.addColorStop(0.55, `rgba(7,6,14,${al * 0.72})`);
  vg.addColorStop(1, "rgba(7,6,14,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 720);
}
function poli(g, cam, pts, color) {
  const q = pts.map((p) => proyecta(cam, p));
  if (q.some((p) => !p)) return null;
  g.beginPath();
  g.moveTo(q[0].x, q[0].y);
  for (let i = 1; i < q.length; i++) g.lineTo(q[i].x, q[i].y);
  g.closePath();
  g.fillStyle = color;
  g.fill();
  const z = q.reduce((s, p) => s + p.z, 0) / q.length;
  return z;
}
function mesa(g, cam) {
  const pts = [];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    pts.push([Math.cos(a) * 8.4, -0.12, Math.sin(a) * 6.6]);
  }
  const q = pts.map((p) => proyecta(cam, p));
  if (q.some((p) => !p)) return;
  g.beginPath();
  g.moveTo(q[0].x, q[0].y);
  for (const p of q) g.lineTo(p.x, p.y);
  g.closePath();
  const y0 = Math.min(...q.map((p) => p.y)), y1 = Math.max(...q.map((p) => p.y));
  const gr = g.createLinearGradient(540, y0, 540, y1);
  gr.addColorStop(0, "#a56b3a");
  gr.addColorStop(0.45, "#5a3018");
  gr.addColorStop(1, "#2a140c");
  g.fillStyle = gr;
  g.fill();
  g.save();
  g.clip();
  g.globalAlpha = 0.4;
  g.globalCompositeOperation = "multiply";
  g.drawImage(manchas, 80, y0, 920, Math.max(200, y1 - y0));
  g.restore();
}
function tablero(g, cam, ox, oz, al) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  poli(g, cam, [[ox - 4.45, 0.02, oz + 4.45], [ox + 4.45, 0.02, oz + 4.45], [ox + 4.45, 0.02, oz - 4.45], [ox - 4.45, 0.02, oz - 4.45]], "#6b3a16");
  poli(g, cam, [[ox - 4.15, 0.08, oz + 4.15], [ox + 4.15, 0.08, oz + 4.15], [ox + 4.15, 0.08, oz - 4.15], [ox - 4.15, 0.08, oz - 4.15]], "#e8c27a");
  const cosas = [];
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
    const x0 = ox + f - 4, x1 = x0 + 1, z0 = oz + 4 - r, z1 = z0 - 1;
    const claro = (f + r) % 2 === 0;
    cosas.push({
      z: proyecta(cam, [(x0 + x1) / 2, 0.1, (z0 + z1) / 2])?.z ?? 0,
      dibuja() {
        poli(g, cam, [[x0, 0.1, z0], [x1, 0.1, z0], [x1, 0.1, z1], [x0, 0.1, z1]], claro ? "#f6e0b4" : "#0c7a62");
        if (claro) {
          g.globalAlpha *= 0.35;
          poli(g, cam, [[x0, 0.11, z0], [x1, 0.11, z0], [x0 + 0.18, 0.11, z1], [x0, 0.11, z1]], "#fff8e8");
          g.globalAlpha /= 0.35;
        }
      },
    });
  }
  cosas.sort((a, b) => b.z - a.z);
  for (const c of cosas) c.dibuja();
  g.restore();
}
function dibujaPieza(g, cam, p, est) {
  if (est.al < 0.03) return;
  const wpos = [est.pos[0], est.pos[1], est.pos[2]];
  const s = proyecta(cam, wpos);
  if (!s) return;
  const alto = tamano(1.42 * est.esc, s.z);
  const ancho = alto * (240 / 320);
  const sombra = proyecta(cam, [wpos[0], 0.12, wpos[2]]);
  if (sombra && est.ang < 0.4) {
    g.save();
    g.globalAlpha *= est.al * 0.4;
    g.fillStyle = "rgba(0,0,0,0.8)";
    g.beginPath();
    g.ellipse(sombra.x, sombra.y, ancho * 0.34, ancho * 0.14, 0, 0, 6.28);
    g.fill();
    g.restore();
  }
  g.save();
  g.translate(s.x, s.y);
  g.rotate(est.ang);
  g.globalAlpha *= est.al;
  g.drawImage(sprite(p.tipo, p.blanca), -ancho / 2, -alto, ancho, alto);
  g.restore();
  if (est.glow > 0.03) brillo(g, s.x, s.y - alto * 0.42, alto * 1.5, p.blanca ? "255,196,90" : "176,150,255", Math.min(1, est.glow));
}
function telaDibuja(g, cam, t, nivel) {
  if (nivel < 0.02) return;
  const y = mez(2.6, 0.55, nivel);
  const onda = (x) => Math.sin(x * 1.7 + t * 6) * 0.06 * (1 - nivel);
  g.save();
  g.globalAlpha *= Math.min(1, nivel * 1.3);
  for (let i = 0; i < 10; i++) {
    const x0 = -4.2 + i * 0.84, x1 = x0 + 0.84;
    const y0 = y + onda(x0), y1 = y + onda(x1);
    const col = i % 2 ? "#8d1838" : "#6e102c";
    poli(g, cam, [[x0, y0, 4.3], [x1, y1, 4.3], [x1, y1 - 0.02, -4.3], [x0, y0 - 0.02, -4.3]], col);
  }
  // el brillo de la tela
  poli(g, cam, [[-4.2, y + 0.02, 4.3], [4.2, y + 0.02, 4.3], [4.2, y + 0.02, 3.5], [-4.2, y + 0.02, 3.5]], "rgba(255,170,190,0.35)");
  g.restore();
}
function marcoFoto(g, cam, al, grietas) {
  if (al < 0.02) return;
  const esq = [[-4, 0.3, 4], [4, 0.3, 4], [4, 0.3, -4], [-4, 0.3, -4]].map((p) => proyecta(cam, p)).filter(Boolean);
  if (esq.length < 4) return;
  const x0 = Math.min(...esq.map((p) => p.x)) - 28, x1 = Math.max(...esq.map((p) => p.x)) + 28;
  const y0 = Math.min(...esq.map((p) => p.y)) - 28, y1 = Math.max(...esq.map((p) => p.y)) + 36;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = "rgba(255,248,236,0.95)";
  g.lineWidth = 18;
  g.strokeRect(x0, y0, x1 - x0, y1 - y0);
  g.strokeStyle = "rgba(40,24,12,0.45)";
  g.lineWidth = 4;
  g.strokeRect(x0 + 16, y0 + 16, x1 - x0 - 32, y1 - y0 - 32);
  if (grietas > 0.02) {
    g.globalAlpha *= grietas;
    g.strokeStyle = "rgba(255,236,220,0.9)";
    g.lineWidth = 4;
    const a = azar(9);
    for (let i = 0; i < 5; i++) {
      const x = mez(x0, x1, a()), y = mez(y0, y1, a());
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (a() - 0.5) * 180, y + (a() - 0.5) * 140);
      g.stroke();
    }
  }
  g.restore();
}
function gruposLuz(g, cam, ests) {
  for (const gi of [1, 2, 3]) {
    const scr = [];
    for (const o of ests) {
      if (o.p.grupo !== gi || o.e.glow < 0.2 || o.e.al < 0.45) continue;
      const s = proyecta(cam, o.e.pos);
      if (s) scr.push(s);
    }
    if (scr.length < 2) continue;
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = gi === 3 ? "rgba(198,170,255,0.9)" : "rgba(255,214,120,0.92)";
    g.lineWidth = 14;
    g.lineJoin = "round";
    g.beginPath();
    scr.forEach((p, i) => (i ? g.lineTo(p.x, p.y - 36) : g.moveTo(p.x, p.y - 36)));
    g.closePath();
    g.stroke();
    g.restore();
  }
}
function gemas(g, cam, t, T) {
  const comp = t < T.f9 ? 0
    : t < T.f10 ? suave(tramo(t, T.f9 + 0.04, T.hueco))
    : t < T.partidas ? 1 - suave(tramo(t, T.f10, T.partidas))
    : 0;
  if (comp < 0.02) return;
  for (let gi = 1; gi <= 3; gi++) {
    const c = centroGrupo(gi), h = huecoDe(gi);
    const pos = mix3(c, h, comp);
    const s = proyecta(cam, pos);
    if (!s) continue;
    const rad = tamano(0.62, s.z);
    // el hueco, quieto encima del tablero
    const hs = proyecta(cam, h);
    if (hs) {
      const hr = tamano(0.95, hs.z);
      g.save();
      g.globalAlpha *= comp;
      g.fillStyle = "rgba(18,10,8,0.9)";
      g.beginPath();
      g.ellipse(hs.x, hs.y, hr, hr * 0.42, 0, 0, 6.28);
      g.fill();
      g.strokeStyle = "rgba(232,194,122,0.9)";
      g.lineWidth = 6;
      g.stroke();
      g.restore();
    }
    const col = gi === 3 ? "176,150,255" : "255,196,90";
    g.save();
    g.globalAlpha *= Math.min(1, comp * 1.4);
    g.fillStyle = `rgb(${col})`;
    g.beginPath();
    g.arc(s.x, s.y, rad, 0, 6.28);
    g.fill();
    g.restore();
    brillo(g, s.x, s.y, rad * 3.2, col, 0.65 * comp);
  }
}
function biblioteca(g, cam, al) {
  if (al < 0.03) return;
  const sitios = [[-7.2, -9.5], [7.2, -9.5], [0, -16], [-6, -22], [6, -22]];
  sitios.forEach((s, i) => tablero(g, cam, s[0], s[1], al * (0.55 - i * 0.06)));
}
function corona(g, t, T) {
  if (t < T.f11) return;
  const cae = entra(tramo(t, T.f11, T.cociente + 0.45));
  const rompe = suave(tramo(t, T.numero - 0.45, T.numero + 0.05));
  const ficha = suave(tramo(t, T.numero - 0.15, T.numero + 0.4));
  const y = mez(560, 1040, cae);
  const al = (1 - rompe) * (t < T.vales ? 1 : 1 - suave(tramo(t, T.vales - 0.15, T.vales + 0.25)));
  if (al > 0.03) {
    const dib = (dx, ang) => {
      g.save();
      g.translate(540 + dx, y);
      g.rotate(ang);
      g.globalAlpha *= al;
      g.beginPath();
      g.moveTo(-70, 40); g.lineTo(-78, -10); g.lineTo(-46, 16); g.lineTo(-24, -48);
      g.lineTo(0, 12); g.lineTo(24, -48); g.lineTo(46, 16); g.lineTo(78, -10); g.lineTo(70, 40);
      g.closePath();
      const gr = g.createLinearGradient(-70, -48, 70, 40);
      gr.addColorStop(0, "#fff1c2"); gr.addColorStop(0.5, "#e2a84a"); gr.addColorStop(1, "#8a5a18");
      g.fillStyle = gr; g.fill();
      g.lineWidth = 4; g.strokeStyle = "#fff6d2"; g.stroke();
      g.restore();
    };
    dib(-rompe * 90, -rompe * 0.5);
    dib(rompe * 90, rompe * 0.5);
    if (rompe > 0.2 && rompe < 0.95) brillo(g, 540, y, 280, "255,220,140", (1 - rompe) * 0.8);
  }
  if (ficha > 0.02) {
    const x = mez(540, 250, ficha), yy = mez(y, 1240, ficha);
    g.save();
    g.globalAlpha *= ficha;
    g.translate(x, yy);
    k.redondo(g, -78, -46, 156, 92, 22);
    g.fillStyle = "rgba(255,248,236,0.95)";
    g.fill();
    g.lineWidth = 4; g.strokeStyle = "rgba(90,60,20,0.45)"; g.stroke();
    g.fillStyle = "#3a2412";
    g.font = "800 54px Figtree";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("n.º", 0, 4);
    g.restore();
  }
}

export function pintar(g, t) {
  const T = tiempos();
  const cam = camara(t, T);
  fondo(g);
  const biblio = suave(tramo(t, T.partidas - 0.15, T.dentro + 0.15));
  biblioteca(g, cam, biblio);
  mesa(g, cam);
  tablero(g, cam, 0, 0, 1);

  const ests = PIEZAS.map((p, i) => ({ p, e: lugar(p, i, t, T) }));
  const ordenD = ests.map((o, i) => ({ i, z: proyecta(cam, o.e.pos)?.z ?? 0 })).sort((a, b) => b.z - a.z);
  for (const o of ordenD) dibujaPieza(g, cam, ests[o.i].p, ests[o.i].e);

  telaDibuja(g, cam, t, tela(t, T));
  gruposLuz(g, cam, ests);
  gemas(g, cam, t, T);

  const alFoto = suave(tramo(t, T.foto - 0.08, T.foto + 0.32)) * (1 - suave(tramo(t, T.pon - 0.05, T.pon + 0.3)));
  const grietas = suave(tramo(t, T.f6 + 0.1, T.pon));
  marcoFoto(g, cam, alFoto, grietas);

  if (t > T.diec - 0.05 && t < T.diec + 1.1) fogonazo(g, 540, 980, t - T.diec, 700, "255,214,140");
  if (t > T.foto - 0.02 && t < T.foto + 0.8) fogonazo(g, 540, 900, t - T.foto, 900, "255,250,240");

  const claro = Math.max(alFoto, suave(tramo(t, 0.2, T.diec)) * 0.5);
  velo(g, 0.45 + claro * 0.35);
  corona(g, t, T);
}
