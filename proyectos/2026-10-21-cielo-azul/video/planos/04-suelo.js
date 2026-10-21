// «Por eso, mires donde mires, te llega luz azul desde todo el cielo.»
// Otro sitio: el campo, de día, visto desde el suelo. Se entra con un corte en «Por».
// - «mires donde mires»: la cámara mira a un lado y luego al otro, por encima de las colinas, con el Sol blanco.
// - «te llega luz azul»: de puntos del cielo salen fotones azules que bajan hasta quien mira, abajo.
// - «desde todo el cielo»: salen de todas partes a la vez y el cielo entero se enciende de azul.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, cielo, foton, nube, sol } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar, pulso } = k;
const f = v.frase(7);
const T0 = f.inicio, Tmires = f.t("mires"), Tdonde = f.t("donde"), Tllega = f.t("llega"), Tazul = f.t("azul"), Ttodo = f.t("todo"), Fin = f.fin;

const pan = k.claves([[T0, 0], [Tmires + 0.1, -380], [Tdonde + 0.55, 380], [Tllega + 0.2, 0], [Fin, 0]]);
const OJO = [540, 1665];

const az = azar(444);
const FOTONES = Array.from({ length: 64 }, (_, i) => {
  const u = i / 63, t0 = Tllega - 0.05 + Math.pow(u, 0.75) * (Ttodo + 0.9 - Tllega);
  return { x: -40 + az() * 1160, y: 330 + Math.pow(az(), 0.8) * 900, t0, vel: 1500 + az() * 700 };
});
const NUBES = [{ x: 180, y: 640, w: 330, i: 1 }, { x: 760, y: 1010, w: 400, i: 2 }, { x: 420, y: 1130, w: 300, i: 4 }];

// colinas con su luz: tres capas
function colinas(g, off, t) {
  const capas = [
    { y: 1290, a: 70, f: 0.006, c1: "#7fc79a", c2: "#4aa56a", par: 0.35, p: 0.4 },
    { y: 1390, a: 90, f: 0.0045, c1: "#4eb06a", c2: "#2b8a48", par: 0.7, p: 2.1 },
    { y: 1560, a: 110, f: 0.0035, c1: "#2f9a4c", c2: "#14602e", par: 1.2, p: 4.3 },
  ];
  for (const c of capas) {
    g.beginPath(); g.moveTo(-50, 1960);
    for (let x = -50; x <= 1130; x += 10) { const X = x - off * c.par; g.lineTo(x, c.y + Math.sin(X * c.f + c.p) * c.a + Math.sin(X * c.f * 2.3 + c.p * 1.7) * c.a * 0.4); }
    g.lineTo(1130, 1960); g.closePath();
    const gr = g.createLinearGradient(0, c.y - c.a, 0, c.y + 260); gr.addColorStop(0, c.c1); gr.addColorStop(1, c.c2); g.fillStyle = gr; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, -200 - off * c.par * 0.5, c.y - 200, 1500, 900); g.restore();
  }
}

export function dibuja(g, t) {
  const off = pan(t);
  cielo(g, 0);
  const cielosAl = su(tr(t, Ttodo - 0.1, Fin));
  // el Sol y las nubes, que se desplazan al mirar
  sol(g, 800 + off * 1.15, 760, 82, 1);
  for (const n of NUBES) nube(g, n.i, n.x + off * 1.0, n.y, n.w, 0.95);
  // el cielo entero que se enciende
  g.save(); g.globalCompositeOperation = "lighter";
  const cg = g.createLinearGradient(0, 200, 0, 1350); cg.addColorStop(0, `rgba(${AZUL},${0.5 * cielosAl})`); cg.addColorStop(1, `rgba(${AZUL},${0.25 * cielosAl})`);
  g.fillStyle = cg; g.fillRect(0, 0, 1080, 1350); g.restore();
  colinas(g, off, t);

  // los fotones azules que bajan hasta quien mira
  let llegan = 0;
  for (const p of FOTONES) {
    const dx = OJO[0] - p.x, dy = OJO[1] - p.y, L = Math.hypot(dx, dy), s = (t - p.t0) * p.vel;
    foton(g, [[p.x, p.y], [OJO[0] + dx * 0.02, OJO[1] + dy * 0.02]], s, AZUL, 420, 210, 1 - su(tr(t, Fin - 0.55, Fin - 0.1)));
    if (s > L * 0.9 && s < L * 1.1) llegan++;
  }
  // quien mira: una silueta de espaldas, con el cielo en el borde
  k.brillo(g, OJO[0], OJO[1] - 40, 760, AZUL, Math.min(1, 0.15 + su(tr(t, Tllega, Ttodo)) * 0.75));
  g.save();
  const hg = g.createLinearGradient(0, 1700, 0, 1960); hg.addColorStop(0, "#0c2a1b"); hg.addColorStop(1, "#04100a");
  g.fillStyle = hg;
  g.beginPath(); g.ellipse(540, 2010, 400, 230, 0, Math.PI, 2 * Math.PI); g.fill();
  g.beginPath(); g.arc(540, 1745, 86, 0, 6.2832); g.fill();
  // el borde de luz azul del pelo y los hombros
  g.strokeStyle = `rgba(${AZUL},${0.35 + 0.6 * su(tr(t, Tllega, Ttodo))})`; g.lineWidth = 7;
  g.beginPath(); g.arc(540, 1745, 86, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  g.beginPath(); g.ellipse(540, 2010, 400, 230, 0, Math.PI * 1.05, Math.PI * 1.35); g.stroke();
  g.beginPath(); g.ellipse(540, 2010, 400, 230, 0, Math.PI * 1.65, Math.PI * 1.95); g.stroke();
  g.restore();

  // velo suave detrás del subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 650); vg.addColorStop(0, "rgba(10,40,120,0.45)"); vg.addColorStop(1, "rgba(10,40,120,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 650);
}
