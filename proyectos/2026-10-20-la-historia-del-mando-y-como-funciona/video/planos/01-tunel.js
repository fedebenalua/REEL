// «El mando de la tele tiene más de setenta años, y casi nadie sabe cómo funciona.»
// Un túnel del tiempo: la cámara vuela entre rayas de luz y le pasan rozando los mandos de la historia.
// - Fotograma 0: el viaje ya va a toda velocidad; pasa el mando de cable de 1950, luego la linterna de 1955 y el del
//   martillito de 1956, cada uno con su año, y en «años» llega el de hoy y se planta en el centro, grande.
// - «casi nadie sabe cómo funciona»: el mando de hoy gira despacio y de su punta sale un temblor que no se ve bien.
// (El creador eligió esta apertura; la otra, el túnel hacia atrás hasta el mando de 1950, se quitó.)
import * as k from "#kit";
import { v } from "#voz";
import { mando1950, mandoHoy } from "../gala.js";
import { linterna, martillito } from "../hist.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f1 = v.frase(1);
const Tano = f1.t("anos"), Tsab = f1.t("sabe"), Tfun = f1.t("funciona"), Fin = v.frase(2).inicio;

const azR = azar(70);
const RAYAS = Array.from({ length: 220 }, () => { const a = azR() * 6.2832, r = 1 + Math.pow(azR(), 0.6) * 8; return { x: Math.cos(a) * r, y: Math.sin(a) * r, z0: azR() * 50, c: ["255,200,120", "120,200,255", "255,120,200", "200,255,160"][Math.floor(azR() * 4)] }; });

// los mandos del pasado: cada uno pasa por delante en su momento
export const PASAN = [
  { t: -0.45, ano: "1950", dibuja: (g, s) => mando1950(g, 0, 0, 220 * s, -0.3) },
  { t: 0.4, ano: "1955", dibuja: (g, s) => { g.save(); g.scale(-1, 1); linterna(g, 0, 0, 0.7 * s, -0.6); g.restore(); } },
  { t: 1.2, ano: "1956", dibuja: (g, s, t) => martillito(g, 0, 0, 260 * s, t) },
];

export function tunel(g, t, orden = PASAN, final = (g2, t2, llega) => mandoHoy(g2, 540, mez(1600, 1080, llega), 250, mez(0.8, -0.05, llega) + 0.04 * Math.sin(t2 * 1.5))) {
  g.fillStyle = "#06040e"; g.fillRect(0, 0, 1080, 1920);
  const frena = su(tr(t, Tano - 0.6, Tano + 0.4)) * 0.8, vel = mez(40, 4, frena);
  const d = 40 * t - 32 * Math.max(0, t - Tano + 0.6) * frena;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const r of RAYAS) {
    const z = (((r.z0 - d) % 50) + 50) % 50 + 0.4, z0 = z + vel * 0.03;
    const x1 = 540 + (k.F * r.x) / z / 3, y1 = 960 + (k.F * r.y) / z / 3, x0 = 540 + (k.F * r.x) / z0 / 3, y0 = 960 + (k.F * r.y) / z0 / 3;
    const a = Math.min(1, 8 / z) * mez(1, 0.35, frena);
    g.strokeStyle = `rgba(${r.c},${a})`; g.lineWidth = Math.min(8, 12 / z) + 1;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  }
  g.restore();
  // los mandos que pasan: vienen del fondo, crecen y salen por un lado
  orden.forEach((p, i) => {
    const u = tr(t, p.t, p.t + 0.9); if (u <= 0 || u >= 1) return;
    const s = Math.pow(u, 1.8) * 3.4 + 0.15, lado = i % 2 ? 1 : -1;
    const x = 540 + lado * Math.pow(u, 2) * 700, y = 980 + Math.pow(u, 2) * 260;
    g.save(); g.translate(x, y); g.globalAlpha = Math.min(1, u * 5) * Math.min(1, (1 - u) * 4); p.dibuja(g, s, t); g.restore();
    k.pastilla(g, 540, 640, p.ano, "", "255,215,140", Math.min(1, u * 5) * Math.min(1, (1 - u) * 3), 100);
  });
  // el de hoy llega y se queda
  const llega = entra(tr(t, Tano - 0.4, Tano + 0.3));
  if (llega > 0) {
    final(g, t, llega);
    k.pastilla(g, 540, 640, "hoy", "", "120,200,255", su(tr(t, Tano - 0.1, Tano + 0.2)) * (1 - su(tr(t, Tsab, Tsab + 0.3))), 100);
    // el temblor de lo que no se ve
    g.save(); g.strokeStyle = "rgba(210,220,255,0.25)"; g.lineWidth = 5;
    for (let i = 0; i < 4; i++) { const w = (((t - Tsab) * 1.2 + i / 4) % 1 + 1) % 1, r = mez(30, 420, w); g.globalAlpha = su(tr(t, Tsab - 0.2, Tsab + 0.2)) * Math.min(1, w * 5) * (1 - w); g.beginPath(); g.arc(540, 1050 - 340, r, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    g.restore();
  }
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(6,4,14,0.55)"); vg.addColorStop(1, "rgba(6,4,14,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export function dibuja(g, t) { tunel(g, t); }
