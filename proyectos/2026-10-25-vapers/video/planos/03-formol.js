// «lo mismo que se usa para conservar cadáveres.»
// La estantería de formol: una sala fría y oscura, una balda con tarros grandes de cristal llenos de líquido verdoso y
// bultos oscuros dentro, bajo una luz fría que cae de arriba.
// - «lo mismo»: corte aquí; la luz de arriba parpadea y se queda.
// - «conservar»: la cámara se acerca al tarro del medio; burbujas lentas.
// - «cadáveres»: el tarro llena la pantalla; el bulto de dentro se mece.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, VERDE_F } from "../mundo.js";

export const desde = (vz) => vz.frase(4).t("lo");

const { suave: su, tramo: tr, mez, azar } = k;
const f4 = v.frase(4);
const T0 = f4.t("lo"), Tcons = f4.t("conservar"), Tcad = f4.t("cadáveres"), Fin = f4.fin;
export const momentos = { acerca: Tcons, cadaveres: Tcad };

const az = azar(44);
const TARROS = [
  { x: 200, w: 300, h: 520, semilla: 1 },
  { x: 540, w: 380, h: 660, semilla: 2 },
  { x: 880, w: 300, h: 560, semilla: 3 },
];
const YBALDA = 1420;
const formas = new Map();
function forma(semilla) {
  if (formas.has(semilla)) return formas.get(semilla);
  const a = azar(semilla * 7 + 1);
  const l = Array.from({ length: 14 }, (_, i) => ({ a: (i / 14) * 6.2832, r: 0.6 + a() * 0.4, w: a() * 6.28 }));
  formas.set(semilla, l);
  return l;
}
const BURB = Array.from({ length: 40 }, () => ({ j: Math.floor(az() * 3), x: (az() - 0.5) * 0.7, f: az(), vel: 0.08 + az() * 0.1, r: 4 + az() * 7 }));

function tarro(g, t, tj, mece) {
  const { x, w, h, semilla } = tj;
  const y0 = YBALDA - h, y1 = YBALDA;
  // la sombra en la balda
  g.save(); g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.ellipse(x, y1 + 10, w * 0.6, 26, 0, 0, 6.2832); g.fill(); g.restore();
  // el cristal con el líquido dentro
  g.save(); k.redondo(g, x - w / 2, y0 + 60, w, h - 60, 36); g.clip();
  const lg = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0); lg.addColorStop(0, "#3d6a4a"); lg.addColorStop(0.5, "#9ad58a"); lg.addColorStop(1, "#3a6246");
  g.fillStyle = lg; g.fillRect(x - w / 2, y0 + 90, w, h);
  const vg = g.createLinearGradient(0, y0, 0, y1); vg.addColorStop(0, "rgba(255,255,255,0.15)"); vg.addColorStop(1, "rgba(0,20,10,0.45)");
  g.fillStyle = vg; g.fillRect(x - w / 2, y0 + 90, w, h);
  // el bulto oscuro, que se mece
  const F = forma(semilla), cx = x + Math.sin(t * 0.7 + semilla) * 6 * mece, cy = y0 + h * 0.56 + Math.cos(t * 0.5 + semilla) * 5 * mece, R = w * 0.36;
  g.save(); g.filter = "blur(6px)"; g.fillStyle = "rgba(25,30,22,0.92)"; g.beginPath();
  F.forEach((p, i) => { const rr = R * (p.r + 0.06 * Math.sin(t * 0.9 + p.w)) * (1 + 0.25 * Math.sin(p.a * 3)); const px = cx + Math.cos(p.a) * rr * 0.8, py = cy + Math.sin(p.a) * rr * 1.1; i ? g.lineTo(px, py) : g.moveTo(px, py); });
  g.closePath(); g.fill(); g.restore();
  g.fillStyle = "rgba(90,70,60,0.35)"; g.beginPath(); g.ellipse(cx - R * 0.2, cy - R * 0.3, R * 0.35, R * 0.22, -0.4, 0, 6.2832); g.fill();
  // las burbujas, lentas
  for (const b of BURB) {
    if (b.j !== semilla - 1) continue;
    const p = (t * b.vel + b.f) % 1;
    const bx = x + b.x * w + Math.sin(p * 7) * 6, by = y1 - 30 - p * (h - 150);
    g.fillStyle = "rgba(220,255,220,0.5)"; g.beginPath(); g.arc(bx, by, b.r, 0, 6.2832); g.fill();
    g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(bx - b.r * 0.3, by - b.r * 0.3, b.r * 0.3, 0, 6.2832); g.fill();
  }
  g.restore();
  // el cristal por encima
  k.redondo(g, x - w / 2, y0 + 60, w, h - 60, 36); k.vidrio(g, x - w / 2, x + w / 2, 0.35);
  // la etiqueta de papel, vieja, sin nada escrito
  g.fillStyle = "#d9d3bf"; k.redondo(g, x - w * 0.3, y0 + h * 0.62, w * 0.6, h * 0.16, 8); g.fill();
  g.strokeStyle = "rgba(60,50,30,0.35)"; g.lineWidth = 3; for (let i = 1; i <= 3; i++) { g.beginPath(); g.moveTo(x - w * 0.24, y0 + h * 0.62 + i * h * 0.04); g.lineTo(x + w * (i === 3 ? 0.05 : 0.24), y0 + h * 0.62 + i * h * 0.04); g.stroke(); }
  // la tapa de metal
  k.redondo(g, x - w / 2 - 8, y0, w + 16, 76, 14); k.metal(g, x - w / 2, x + w / 2, ["#4a4f58", "#c9ced6", "#7c838e", "#d8dce2", "#3e434b"]);
  g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(x - w / 2 - 8, y0 + 60, w + 16, 16);
}

export function dibuja(g, t) {
  fondo(g, t, "#0b1a16");
  // la luz fría de arriba, que parpadea al entrar
  const luz = (1 - 0.35 * Math.max(0, Math.sin((t - T0) * 40)) * (1 - su(tr(t, T0 + 0.2, T0 + 0.45)))) * su(tr(t, T0 - 0.05, T0 + 0.1));
  const acerca = su(tr(t, Tcons - 0.2, Tcad + 0.35));
  const z = mez(1, 1.55, acerca);
  g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-540, -mez(1000, 1090, acerca));
  // la pared del fondo, con azulejos
  g.fillStyle = "#0e1c19"; g.fillRect(-400, -400, 1900, 2800);
  g.strokeStyle = "rgba(255,255,255,0.05)"; g.lineWidth = 3;
  for (let x = -400; x < 1500; x += 140) { g.beginPath(); g.moveTo(x, -400); g.lineTo(x, 2400); g.stroke(); }
  for (let y = -400; y < 2400; y += 140) { g.beginPath(); g.moveTo(-400, y); g.lineTo(1500, y); g.stroke(); }
  // el cono de luz
  g.save(); g.globalCompositeOperation = "lighter";
  const cg = g.createRadialGradient(540, 300, 50, 540, 300, 1500); cg.addColorStop(0, `rgba(170,230,210,${0.28 * luz})`); cg.addColorStop(0.5, `rgba(140,210,190,${0.1 * luz})`); cg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = cg; g.beginPath(); g.moveTo(540, 250); g.lineTo(-500, 2400); g.lineTo(1580, 2400); g.closePath(); g.fill();
  g.restore();
  // la balda
  g.fillStyle = "#2a2622"; g.fillRect(-200, YBALDA, 1480, 46);
  g.fillStyle = "#4a433b"; g.fillRect(-200, YBALDA, 1480, 12);
  g.fillStyle = "rgba(0,0,0,0.5)"; g.fillRect(-200, YBALDA + 46, 1480, 30);
  // los tarros: los de los lados primero, el del medio delante
  for (const tj of [TARROS[0], TARROS[2], TARROS[1]]) tarro(g, t, tj, 0.5 + 0.5 * acerca);
  g.restore();
  // la oscuridad general, según la luz
  g.fillStyle = `rgba(2,6,5,${0.75 * (1 - luz)})`; g.fillRect(0, 0, 1080, 1920);
  velo(g, 0.55);
}
