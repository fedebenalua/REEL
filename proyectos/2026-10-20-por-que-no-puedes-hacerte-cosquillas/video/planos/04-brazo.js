// «Así distingues lo tuyo de lo de fuera: no te asustas al rozarte, pero sí si te sube una araña.»
// Otro sitio: tu antebrazo, enorme, en diagonal sobre la sábana, con su vello. Corte en «Así».
// - «lo tuyo»: tus dedos (pijama) lo rozan de arriba abajo, con su copia cian encima: «no te asustas al rozarte», el
//   vello ni se mueve.
// - «pero sí»: tus dedos se van y por la esquina de arriba entra una araña negra que baja andando por el brazo;
//   «araña»: el vello se pone de punta, el brazo da un respingo y salta la alarma roja. Se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, manoDedos, manga, chispas, velo, vineta, CIAN, ROJO, PIEL } from "../mundo.js";

export const desde = (v) => v.frase(9).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f9 = v.frase(9);
const T0 = f9.inicio, Ttuy = f9.t("tuyo"), Tfue = f9.t("fuera"), Troz = f9.t("rozarte"), Tper = f9.t("pero"), Tsub = f9.t("sube"), Tara = f9.t("arana"), Fin = v.frase(10).inicio;

// el brazo: del codo (abajo a la izquierda) a la muñeca (arriba a la derecha)
const CODO = [-60, 1640], MUN = [1260, -60], ANCHO0 = 540, ANCHO1 = 400;
const eje = [MUN[0] - CODO[0], MUN[1] - CODO[1]], LB = Math.hypot(eje[0], eje[1]), ux = eje[0] / LB, uy = eje[1] / LB, nx = -uy, ny = ux;
const enBrazo = (s, w) => { const a = mez(ANCHO0, ANCHO1, s) / 2; return [CODO[0] + eje[0] * s + nx * w * a, CODO[1] + eje[1] * s + ny * w * a]; };

const pelos = (() => { const az = azar(4242), l = []; for (let i = 0; i < 300; i++) l.push({ s: 0.08 + az() * 0.9, w: (az() - 0.5) * 1.7, L: 16 + az() * 18, a: (az() - 0.5) * 0.5, f: az() * 6 }); return l; })();
const pielT = k.ruido(512, 4343, 70, 2, "manchas");

// lo que pasa
const dedos = (t) => su(tr(t, T0 - 0.1, Ttuy - 0.1)) * (1 - su(tr(t, Tper - 0.4, Tper + 0.1)));
const roce = (t) => 0.5 + 0.22 * Math.sin(2 * Math.PI * 1.2 * (t - T0));            // dónde rozan (s a lo largo del brazo)
const llega = (t) => su(tr(t, Tper - 0.1, Tara - 0.05));                          // la araña, de la esquina a su sitio
const susto = (t) => su(tr(t, Tara - 0.1, Tara + 0.1)) * (1 - su(tr(t, Tara + 0.45, Fin - 0.12)));
const respingo = (t) => Math.exp(-Math.max(0, t - Tara) * 7) * (t > Tara - 0.02 ? 1 : 0) * Math.sin((t - Tara) * 40);

// ---------------------------------------------------------------- la sábana
const arrugas = k.ruido(512, 4545, 3, 3, "lineas");
function sabana(g, t) {
  g.save(); sinVista(g);
  const bg = g.createLinearGradient(0, 0, 1080, 1920); bg.addColorStop(0, "#f4b860"); bg.addColorStop(0.55, "#e8845a"); bg.addColorStop(1, "#b24a5c");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(arrugas, -100, -100, 1300, 2200);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.18; g.drawImage(arrugas, -96, -108, 1300, 2200);
  g.restore();
}

function brazo(g, t, s0) {
  const pts = []; for (let i = 0; i <= 20; i++) pts.push(enBrazo(i / 20, 1)); for (let i = 20; i >= 0; i--) pts.push(enBrazo(i / 20, -1));
  const camino = () => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
  g.save(); g.shadowColor = "rgba(90,20,30,0.45)"; g.shadowBlur = 60; g.shadowOffsetX = 30; g.shadowOffsetY = 40; camino(); g.fillStyle = PIEL.base; g.fill(); g.restore();
  camino(); g.save(); g.clip();
  const [ax, ay] = enBrazo(0.5, 1), [bx, by] = enBrazo(0.5, -1);
  const gr = g.createLinearGradient(ax, ay, bx, by); gr.addColorStop(0, PIEL.sombra); gr.addColorStop(0.3, PIEL.base); gr.addColorStop(0.62, PIEL.luz); gr.addColorStop(1, PIEL.sombra);
  g.fillStyle = gr; g.fillRect(-600, -600, 2400, 3000);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.07; g.drawImage(pielT, -400, -200, 1800, 2400);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // las venas, apenas
  g.strokeStyle = "rgba(120,110,170,0.18)"; g.lineWidth = 12; g.lineCap = "round";
  g.beginPath(); { const [x0, y0] = enBrazo(0.15, -0.2), [x1, y1] = enBrazo(0.5, 0.1), [x2, y2] = enBrazo(0.95, -0.15); g.moveTo(x0, y0); g.quadraticCurveTo(x1, y1, x2, y2); } g.stroke();
  // el vello: tumbado a lo largo del brazo; de punta con el susto
  for (const p of pelos) {
    const [x, y] = enBrazo(p.s, p.w), up = s0 * (0.7 + 0.3 * Math.sin(t * 30 + p.f));
    const ang = Math.atan2(uy, ux) + p.a + up * (Math.PI / 2 - p.a) * (p.w > 0 ? -1 : 1) * 0.9, L = p.L * (1 + up * 0.6);
    g.strokeStyle = `rgba(110,60,40,${0.4 + 0.4 * up})`; g.lineWidth = 2.4;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(ang) * L * 0.6 + nx * 3, y + Math.sin(ang) * L * 0.6 + ny * 3, x + Math.cos(ang) * L, y + Math.sin(ang) * L); g.stroke();
  }
  g.restore();
  // el pijama remangado en el codo
  manga(g, CODO[0] - ux * 400, CODO[1] - uy * 400, CODO[0] + ux * 120, CODO[1] + uy * 120, 470, "pijama");
}

// ---------------------------------------------------------------- la araña
// En (x, y), mirando hacia ang, de tamaño s (1 ≈ 340 px de pata a pata); andar: la fase de las patas.
function arana(g, x, y, ang, s, andar) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  // las patas: cuatro a cada lado, con su rodilla
  g.lineCap = "round"; g.lineJoin = "round";
  for (const lado of [-1, 1]) for (let i = 0; i < 4; i++) {
    const base = [-6 + i * 14, lado * 22], a0 = lado * (0.55 + i * 0.32) + (i < 2 ? -0.25 * lado : 0.15 * lado);
    const mv = Math.sin(andar + i * 1.6 + (lado > 0 ? Math.PI : 0)) * 0.22;
    const da = (i < 2 ? -1 : 1) * (Math.PI / 2 - 0.9) * lado;
    const r1 = 95, r2 = 115, ang1 = a0 + mv - Math.PI / 2 * 0 + da * 0.3;
    const rod = [base[0] + Math.cos(ang1) * r1 * (i < 2 ? -0.2 : 0.2) + Math.cos(lado * Math.PI / 2) * 0, base[1] + lado * r1 * 0.8];
    rod[0] = base[0] + (i - 1.5) * 38 + mv * 40;
    const pie = [base[0] + (i - 1.5) * 95 + mv * 70, base[1] + lado * 150];
    g.strokeStyle = "#140a0c"; g.lineWidth = 11; g.beginPath(); g.moveTo(base[0], base[1]); g.lineTo(rod[0], rod[1]); g.lineTo(pie[0], pie[1]); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 3; g.beginPath(); g.moveTo(base[0], base[1]); g.lineTo(rod[0], rod[1] - lado * 3); g.stroke();
    void r2; void da;
  }
  // el cuerpo: abdomen detrás, tórax delante, brillante
  for (const [cx, rx, ry] of [[-70, 75, 58], [28, 46, 40]]) {
    g.beginPath(); g.ellipse(cx, 0, rx, ry, 0, 0, 6.2832);
    const gr = g.createRadialGradient(cx - rx * 0.3, -ry * 0.4, 3, cx, 0, rx); gr.addColorStop(0, "#6a4a52"); gr.addColorStop(0.35, "#22121a"); gr.addColorStop(1, "#060304");
    g.fillStyle = gr; g.fill();
  }
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(-92, -24, 18, 9, -0.3, 0, 6.2832); g.fill();
  // los ojitos
  for (const [ex, ey] of [[56, -10], [56, 10], [50, -22], [50, 22]]) { g.fillStyle = "#000"; g.beginPath(); g.arc(ex, ey, 6, 0, 6.2832); g.fill(); g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(ex + 1.5, ey - 1.5, 2, 0, 6.2832); g.fill(); }
  g.restore();
}

export function dibuja(g, t) {
  const push = su(tr(t, T0, Fin));
  sabana(g, t);
  const rj = respingo(t);
  vista(g, mez(0.98, 1.06, push), 560, 960 + 40 * push, 0);
  g.save(); g.translate(rj * 14, -rj * 10);
  const s0 = susto(t);
  brazo(g, t, s0);
  // tus dedos rozando, con su copia cian
  const d = dedos(t);
  if (d > 0.001) {
    const s = roce(t), [x, y] = enBrazo(s, 0.15);
    const X = x + (1 - d) * -900, Y = y + (1 - d) * -700;
    g.save(); g.translate(X, Y); g.rotate(-0.55); g.scale(-0.8, 0.8); manoDedos(g, t, "pijama", 0.25 * d); g.restore();
    // la copia: el mismo roce, dibujado en cian un poco por delante
    const al = d * su(tr(t, Ttuy - 0.2, Ttuy + 0.2));
    if (al > 0) { g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 6; i++) { const [cx, cy] = enBrazo(s + 0.02 * i - 0.05, 0.15 + 0.1 * Math.sin(i)); k.brillo(g, cx, cy, 140, CIAN, 0.35 * al); } g.restore();
      g.save(); g.strokeStyle = `rgba(${CIAN},${0.8 * al})`; g.lineWidth = 6; g.setLineDash([18, 14]); g.beginPath(); const [a1, b1] = enBrazo(s - 0.12, 0.15), [a2, b2] = enBrazo(s + 0.12, 0.15); g.moveTo(a1, b1); g.lineTo(a2, b2); g.stroke(); g.restore(); }
  }
  // la alarma: un latido rojo en la piel, donde está la araña
  { const [ax, ay] = enBrazo(0.45, -0.1); if (s0 > 0) k.brillo(g, ax, ay, 1300, ROJO, 0.42 * s0); }
  // la araña: baja desde la esquina de arriba a la derecha por el brazo
  const u = llega(t);
  if (u > 0) {
    const [x1, y1] = enBrazo(0.45, -0.1), x0 = 1350, y0 = -250;
    const x = mez(x0, x1, u), y = mez(y0, y1, u), anda = (t - Tper) * 14 * (1 - su(tr(t, Tara, Tara + 0.3)));
    // su sombra
    g.save(); g.globalAlpha = 0.3; g.fillStyle = "#3a1010"; g.beginPath(); g.ellipse(x + 35, y + 45, 110, 70, 0, 0, 6.2832); g.fill(); g.restore();
    arana(g, x, y, Math.atan2(y1 - y0, x1 - x0), 1.0, anda);
  }
  g.restore();
  // la alarma: un latido rojo desde donde está la araña, y chispas rojas
  const [ax, ay] = enBrazo(0.45, -0.1);
  chispas(g, t, () => [ax, ay], (ts) => su(tr(ts, Tara - 0.05, Tara + 0.05)) * (1 - su(tr(ts, Tara + 0.15, Tara + 0.25))), { escala: 1.6, sem: 909, colores: [ROJO, "255,170,90", "255,230,210"], vida: 0.5 });
  sinVista(g);
  vineta(g, 0.45);
  velo(g, 0.45, "40,10,20");
}

export const momentos = { arana: Tara };
