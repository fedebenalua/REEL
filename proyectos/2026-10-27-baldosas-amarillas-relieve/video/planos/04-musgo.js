// «Su amigo notaba con los zapatos dónde acababa la tierra y empezaba el musgo.»
// Otro sitio: el suelo visto desde arriba, con la luz baja del atardecer. Un camino de tierra y, a la derecha, musgo.
// - desde «Su»: pisadas de zapato que avanzan por la tierra; la cámara sube con ellas.
// - «tierra»: la tierra se marca; «musgo»: un pie pisa el borde y una onda de luz corre por la línea entre los dos.
import * as k from "#kit";
import { v } from "#voz";
import { huella, GRANO } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const f7 = v.frase(7), T0 = f7.inicio, Tzap = f7.t("zapatos"), Ttie = f7.t("tierra"), Tmus = f7.t("musgo"), Fin = v.frase(8).inicio;

const ESC = 1050;                        // px por metro
const borde = (y) => 650 + 40 * Math.sin(y / 170) + 22 * Math.sin(y / 61 + 1.3);   // x del borde en px de mundo
const az = k.azar(88);
const PIEDRAS = Array.from({ length: 160 }, () => ({ x: az() * 1080, y: -2600 + az() * 4800, r: 4 + az() * 12, a: az() * 3, c: az() }));
const MATAS = Array.from({ length: 1400 }, () => ({ x: 560 + az() * 620, y: -2600 + az() * 4800, r: 12 + az() * 26, c: az() }));
// los pasos: suben por la tierra, cada vez más cerca del borde; el último pisa el borde en «musgo»
const PASOS = Array.from({ length: 9 }, (_, i) => {
  const y = 1500 - i * 380;
  const izq = i % 2 === 0;
  return { y, x: (izq ? 380 : 520) + i * 12, izq, t: T0 + 0.1 + i * ((Tmus - T0 - 0.1) / 8) };
});
PASOS[8].x = borde(PASOS[8].y) - 20;

export function dibuja(g, t) {
  // la cámara sube con los pasos
  const camY = k.mez(1150, PASOS[8].y + 80, k.suave(k.tramo(t, T0, Tmus + 0.2)));
  g.save(); g.translate(0, 960 - camY);
  const y0 = camY - 1100, y1 = camY + 1100;
  // la tierra
  const tg = g.createLinearGradient(0, y0, 1080, y1); tg.addColorStop(0, "#a8724a"); tg.addColorStop(1, "#7a4c2c");
  g.fillStyle = tg; g.fillRect(0, y0, 1080, y1 - y0);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.fillStyle = g.createPattern(GRANO, "repeat"); g.fillRect(0, y0, 1080, y1 - y0); g.restore();
  for (const p of PIEDRAS) {
    if (p.y < y0 - 20 || p.y > y1 + 20 || p.x > borde(p.y)) continue;
    g.fillStyle = "rgba(40,20,10,0.35)"; g.beginPath(); g.ellipse(p.x + 3, p.y + 3, p.r, p.r * 0.7, p.a, 0, 6.2832); g.fill();
    g.fillStyle = k.mezColor("#8a6a52", "#d8b898", p.c); g.beginPath(); g.ellipse(p.x, p.y, p.r, p.r * 0.7, p.a, 0, 6.2832); g.fill();
  }
  // el musgo, a la derecha del borde
  g.beginPath(); g.moveTo(1100, y0);
  for (let y = y0; y <= y1; y += 20) g.lineTo(borde(y), y);
  g.lineTo(1100, y1); g.closePath();
  const mg = g.createLinearGradient(600, 0, 1080, 0); mg.addColorStop(0, "#3f8a2a"); mg.addColorStop(1, "#2a6a1e");
  g.fillStyle = mg; g.fill();
  for (const m of MATAS) {
    if (m.y < y0 - 40 || m.y > y1 + 40 || m.x < borde(m.y) - 10) continue;
    const gr = g.createRadialGradient(m.x - m.r * 0.3, m.y - m.r * 0.3, 1, m.x, m.y, m.r);
    gr.addColorStop(0, m.c < 0.5 ? "#9ade5a" : "#7ac84a"); gr.addColorStop(1, "rgba(30,80,20,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(m.x, m.y, m.r, 0, 6.2832); g.fill();
  }
  // las pisadas en la tierra: se hunden un poco (más oscuras)
  for (const p of PASOS) {
    if (t < p.t) continue;
    const e = t - p.t, al = Math.min(1, e / 0.1);
    g.save(); g.translate(p.x, p.y); g.rotate(0.08); g.scale(ESC, ESC);
    huella(g, "60,32,16", 0.55 * al, p.izq);
    g.restore();
    // el golpe de cada paso
    k.brillo(g, p.x, p.y, 260, "255,220,170", 0.35 * k.pulso(t, p.t + 0.05, 0.12));
  }
  // «tierra»: la tierra se marca con un brillo cálido; «musgo»: la onda que corre por el borde
  const ti = k.pulso(t, Ttie + 0.1, 0.3);
  if (ti > 0.01) k.brillo(g, 330, PASOS[6].y, 900, "255,190,120", 0.35 * ti);
  const on = k.tramo(t, Tmus - 0.05, Tmus + 0.9);
  if (on > 0) {
    const yc = PASOS[8].y, alc = 900 * k.entra(on), al = (1 - k.tramo(t, Fin - 0.55, Fin - 0.2));
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (const [w, a] of [[34, 0.22], [12, 0.9]]) {
      g.strokeStyle = `rgba(200,255,150,${a * al})`; g.lineWidth = w;
      g.beginPath(); for (let y = yc - alc; y <= yc + alc; y += 12) { const x = borde(y); y === yc - alc ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    }
    g.restore();
    k.brillo(g, PASOS[8].x + 30, yc, 700, "220,255,170", 0.8 * k.pulso(t, Tmus + 0.1, 0.3) * al);
  }
  g.restore();
  // la luz baja del atardecer, desde la izquierda
  g.save(); g.globalCompositeOperation = "soft-light";
  const lg = g.createLinearGradient(0, 0, 1080, 1920); lg.addColorStop(0, "rgba(255,200,140,0.8)"); lg.addColorStop(1, "rgba(40,20,60,0.8)");
  g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920); g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 680); vg.addColorStop(0, "rgba(20,10,5,0.5)"); vg.addColorStop(1, "rgba(20,10,5,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 680);
}
