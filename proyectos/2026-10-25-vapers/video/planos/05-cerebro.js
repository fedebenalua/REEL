// «cerebro aún se está montando, y la nicotina cambia cómo se conecta: la atención, el humor, los impulsos.»
// Dentro del cerebro: una red de neuronas de luz azul en la oscuridad. Se entra desde lo oscuro, al meterse la cámara en el cerebro.
// - «cerebro»: lo oscuro se abre y aparecen las neuronas, sueltas, cada una con sus ramas.
// - «montando»: lanzan hilos y se van conectando, una conexión tras otra, azules y rectas.
// - «nicotina»: chispas naranjas entran desde abajo a la izquierda; «cambia»: los hilos que tocan se tuercen y se
//   ponen naranjas; «conecta»: algunos se sueltan y se enganchan a otra neurona.
// - «atención», «humor», «impulsos»: tres zonas se marcan con su nombre, una tras otra, torcidas. Corte en «En».
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, AZUL, NARANJA } from "../mundo.js";

export const desde = (vz) => vz.frase(6).t("cerebro") + 0.3;

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6);
const T0 = f6.t("cerebro") + 0.3, Tmon = f6.t("montando"), Tnic = f6.t("nicotina"), Tcam = f6.t("cambia"), Tcon = f6.t("conecta"), Tate = f6.t("atención"), Thum = f6.t("humor"), Timp = f6.t("impulsos"), Fin = f6.fin;
export const momentos = { montando: Tmon, nicotina: Tnic, cambia: Tcam, atencion: Tate, humor: Thum, impulsos: Timp };

const az = azar(66);
// las neuronas, por zonas: 0 atención (arriba a la izquierda), 1 humor (derecha), 2 impulsos (abajo), 3 sueltas
const NEUR = [
  { x: 200, y: 620, z: 0 }, { x: 420, y: 730, z: 0 }, { x: 250, y: 880, z: 0 }, { x: 470, y: 960, z: 0 },
  { x: 760, y: 680, z: 1 }, { x: 900, y: 860, z: 1 }, { x: 720, y: 980, z: 1 }, { x: 880, y: 1120, z: 1 },
  { x: 330, y: 1250, z: 2 }, { x: 560, y: 1200, z: 2 }, { x: 760, y: 1360, z: 2 }, { x: 520, y: 1420, z: 2 },
  { x: 600, y: 1080, z: 3 }, { x: 140, y: 1100, z: 3 }, { x: 960, y: 1280, z: 3 },
].map((n, i) => ({ ...n, i, r: 30 + az() * 14, f: az() * 6.28, ramas: Array.from({ length: 4 }, () => ({ a: az() * 6.28, l: 50 + az() * 60 })) }));
// las conexiones, en el orden en que se montan
const PARES = [[0, 1], [4, 5], [8, 9], [1, 3], [5, 7], [9, 10], [2, 3], [6, 7], [10, 11], [0, 2], [4, 6], [8, 11], [3, 12], [6, 12], [9, 12], [1, 4], [2, 13], [7, 14], [10, 14], [11, 8], [13, 8], [12, 5], [3, 9], [0, 13]];
const CONEX = PARES.map(([a, b], i) => ({ a, b, t0: Tmon - 0.15 + i * 0.1, c: (az() - 0.5) * 160, w: az() * 6.28, tuerce: az() < 0.7 }));
const CHISPAS = Array.from({ length: 40 }, (_, i) => ({ t0: Tnic - 0.1 + i * 0.03, x0: -60 + az() * 100, y0: 1900 + az() * 200, x1: 150 + az() * 800, y1: 600 + az() * 1100, dur: 0.6 + az() * 0.3, r: 6 + az() * 6 }));
const ZONAS = [{ T: Tate, texto: "atención", x: 60, y: 980 }, { T: Thum, texto: "el humor", x: 700, y: 1200 }, { T: Timp, texto: "los impulsos", x: 90, y: 1340 }];

export function dibuja(g, t) {
  fondo(g, t, "#1e0f22");
  const abre = su(tr(t, T0, T0 + 0.5));
  const tuerce = su(tr(t, Tcam - 0.1, Tcam + 0.5));
  const zonaDe = (n) => ZONAS[n.z] ? su(tr(t, ZONAS[n.z].T - 0.05, ZONAS[n.z].T + 0.25)) : 0;
  // el tejido de fondo: un leve latido
  g.save(); g.globalCompositeOperation = "lighter"; const tg = g.createRadialGradient(540, 1000, 50, 540, 1000, 1100); tg.addColorStop(0, `rgba(120,60,140,${0.35 * abre * (1 + 0.1 * Math.sin(t * 2))})`); tg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = tg; g.fillRect(0, 0, 1080, 1920); g.restore();
  // las conexiones
  g.save(); g.lineCap = "round";
  for (const c of CONEX) {
    const u = su(tr(t, c.t0, c.t0 + 0.55));
    if (u <= 0) continue;
    const A = NEUR[c.a], B = NEUR[c.b];
    const tz = c.tuerce ? tuerce : tuerce * 0.3, marca = Math.max(zonaDe(A), zonaDe(B)) * (A.z === B.z ? 1 : 0.4);
    const col = k.mezRgb(AZUL, NARANJA, tz);
    g.strokeStyle = `rgba(${col},${0.7 + 0.3 * marca})`; g.lineWidth = 7 + 4 * marca;
    g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 18 + 20 * marca;
    g.beginPath();
    const N = 60;
    for (let s = 0; s <= N; s++) {
      const p = (s / N) * u;
      const x = mez(A.x, B.x, p), y = mez(A.y, B.y, p);
      const nx = -(B.y - A.y), ny = B.x - A.x, nl = Math.hypot(nx, ny) || 1;
      const arco = Math.sin(p * Math.PI) * c.c * 0.3;
      const onda = tz * Math.sin(p * 13 + c.w + t * 3) * (30 + 18 * marca) * Math.sin(p * Math.PI);
      const px = x + (nx / nl) * (arco + onda), py = y + (ny / nl) * (arco + onda);
      s === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.stroke();
    // la punta del hilo mientras avanza
    if (u < 1) { const px = mez(A.x, B.x, u), py = mez(A.y, B.y, u); k.brillo(g, px, py, 90, AZUL, 1); }
  }
  g.restore();
  // las neuronas
  for (const n of NEUR) {
    const ap = su(tr(t, T0 + 0.1 + n.i * 0.03, T0 + 0.4 + n.i * 0.03));
    if (ap <= 0) continue;
    const marca = zonaDe(n), col = k.mezRgb(AZUL, NARANJA, tuerce * 0.8);
    const lat = 1 + 0.08 * Math.sin(t * 3 + n.f) + 0.1 * marca * Math.sin(t * 12);
    g.save(); g.globalAlpha = ap;
    g.strokeStyle = `rgba(${col},0.8)`; g.lineWidth = 4; g.lineCap = "round";
    for (const r of n.ramas) { g.beginPath(); g.moveTo(n.x, n.y); const ex = n.x + Math.cos(r.a) * r.l * ap, ey = n.y + Math.sin(r.a) * r.l * ap; g.quadraticCurveTo(n.x + Math.cos(r.a + 0.5) * r.l * 0.6, n.y + Math.sin(r.a + 0.5) * r.l * 0.6, ex, ey); g.stroke(); }
    k.brillo(g, n.x, n.y, n.r * 9 * ap, col, 0.8 + 0.5 * marca);
    const sg = g.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.3, 2, n.x, n.y, n.r * lat); sg.addColorStop(0, "#ffffff"); sg.addColorStop(0.5, `rgb(${col})`); sg.addColorStop(1, `rgba(${col},0.4)`);
    g.fillStyle = sg; g.beginPath(); g.arc(n.x, n.y, n.r * lat * ap, 0, 6.2832); g.fill();
    g.restore();
  }
  // las chispas de nicotina, que entran desde abajo a la izquierda
  g.save(); g.globalCompositeOperation = "lighter";
  for (const c of CHISPAS) {
    const u = tr(t, c.t0, c.t0 + c.dur);
    if (u <= 0 || u >= 1) continue;
    const e = k.entra(u), x = mez(c.x0, c.x1, e), y = mez(c.y0, c.y1, e) - Math.sin(u * Math.PI) * 200;
    g.fillStyle = `rgba(255,190,90,${1 - u * 0.7})`; g.beginPath(); g.arc(x, y, c.r, 0, 6.2832); g.fill();
    k.brillo(g, x, y, c.r * 8, NARANJA, 0.7 * (1 - u));
  }
  g.restore();
  // las zonas, con su nombre
  for (const zn of ZONAS) { const al = su(tr(t, zn.T - 0.05, zn.T + 0.2)); if (al > 0) k.etiqueta(g, zn.x, zn.y, zn.texto, NARANJA, al, 60); }
  // se entra desde lo oscuro
  g.fillStyle = `rgba(20,10,24,${1 - su(tr(t, T0, T0 + 0.3))})`; g.fillRect(0, 0, 1080, 1920);
  velo(g, 0.55);
}
