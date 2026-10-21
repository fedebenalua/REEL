// «La luz blanca es una mezcla de todos los colores, como en un arcoíris.»
// Otro sitio: un estudio oscuro con un prisma de cristal. Se entra con un corte en «La».
// - «La luz blanca»: un haz blanco llega desde la izquierda al prisma.
// - «mezcla»: dentro del prisma el haz se abre y sale en abanico, todos los colores.
// - «todos los colores»: una ola de brillo recorre el abanico, color a color.
// - «como en un arcoíris»: detrás sube un arcoíris enorme y el abanico se funde con él.
import * as k from "#kit";
import { v } from "#voz";
import { fondoNoche } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez, pulso } = k;
const f = v.frase(4);
const T0 = f.inicio, Tblanca = f.t("blanca"), Tmezcla = f.t("mezcla"), Ttodos = f.t("todos"), Tarco = f.t("arcoiris"), Fin = f.fin;

const BANDAS = ["255,40,50", "255,140,30", "255,235,60", "70,230,90", "60,170,255", "80,70,255", "180,70,255"];
const E = [655, 1050]; // por dónde sale del prisma
const ENTRA = [425, 1050];

export function dibuja(g, t) {
  fondoNoche(g, "#07061a", "#241055", 1100);
  const u1 = su(tr(t, T0, Tblanca + 0.35)), u2 = su(tr(t, Tmezcla - 0.1, Tmezcla + 0.75)), arco = su(tr(t, Tarco - 0.1, Tarco + 0.9));

  // el arcoíris de detrás
  if (arco > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 7; i++) {
      const R = 800 - i * 46;
      g.strokeStyle = `rgba(${BANDAS[i]},${0.62 * arco})`; g.lineWidth = 46; g.lineCap = "butt";
      g.beginPath(); g.arc(540, 1760, R * mez(0.5, 1, arco), Math.PI * 1.04, Math.PI * 1.96); g.stroke();
    }
    g.restore();
  }

  // el haz blanco que llega desde la izquierda
  const x1 = mez(-80, ENTRA[0], u1);
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const [w, a] of [[110, 0.14], [54, 0.3], [22, 0.95]]) { g.strokeStyle = `rgba(255,255,255,${a})`; g.lineWidth = w; g.beginPath(); g.moveTo(-80, ENTRA[1]); g.lineTo(x1, ENTRA[1]); g.stroke(); }
  // motas que viajan por el haz
  for (let i = 0; i < 10; i++) { const x = -80 + ((((t * 520 + i * 70) % 700) + 700) % 700) * (x1 + 80) / 700; if (x < x1) { g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(x, ENTRA[1] + ((i * 13) % 9 - 4), 3.5, 0, 6.2832); g.fill(); } }
  g.restore();

  // el abanico de colores que sale del prisma
  const fadeFan = 1 - 0.55 * arco;
  if (u2 > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 7; i++) {
      const a0 = (10 + i * 6.4) * Math.PI / 180, a1 = (10 + (i + 1) * 6.4) * Math.PI / 180, L = mez(120, 1500, u2);
      const ola = pulso(t, Ttodos + 0.2 + i * 0.13, 0.16);
      const al = (0.5 + 0.45 * ola) * fadeFan * u2;
      const gr = g.createLinearGradient(E[0], E[1], E[0] + Math.cos((a0 + a1) / 2) * L, E[1] + Math.sin((a0 + a1) / 2) * L);
      gr.addColorStop(0, `rgba(${BANDAS[i]},${al})`); gr.addColorStop(1, `rgba(${BANDAS[i]},${al * 0.55})`);
      g.fillStyle = gr; g.beginPath(); g.moveTo(E[0], E[1]); g.lineTo(E[0] + Math.cos(a0) * L, E[1] + Math.sin(a0) * L); g.lineTo(E[0] + Math.cos(a1) * L, E[1] + Math.sin(a1) * L); g.closePath(); g.fill();
      // el hilo brillante de cada color
      g.strokeStyle = `rgba(255,255,255,${0.35 * ola * fadeFan})`; g.lineWidth = 4;
      g.beginPath(); g.moveTo(E[0], E[1]); g.lineTo(E[0] + Math.cos((a0 + a1) / 2) * L, E[1] + Math.sin((a0 + a1) / 2) * L); g.stroke();
    }
    g.restore();
  }
  // el haz dentro del prisma
  g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,255,255,${0.9 * u1 * (1 - 0.7 * u2)})`; g.lineWidth = 16; g.lineCap = "round";
  g.beginPath(); g.moveTo(ENTRA[0], ENTRA[1]); g.lineTo(E[0], E[1]); g.stroke(); g.restore();

  // el prisma de cristal
  const P = [[540, 780], [300, 1230], [780, 1230]];
  g.save();
  g.shadowColor = "rgba(150,200,255,0.55)"; g.shadowBlur = 60;
  g.beginPath(); g.moveTo(...P[0]); g.lineTo(...P[1]); g.lineTo(...P[2]); g.closePath();
  const gv = g.createLinearGradient(300, 780, 780, 1230);
  gv.addColorStop(0, "rgba(235,250,255,0.42)"); gv.addColorStop(0.5, "rgba(120,170,230,0.22)"); gv.addColorStop(1, "rgba(220,235,255,0.38)");
  g.fillStyle = gv; g.fill(); g.shadowBlur = 0;
  g.strokeStyle = "rgba(235,248,255,0.9)"; g.lineWidth = 6; g.lineJoin = "round"; g.stroke();
  // reflejos del cristal
  g.beginPath(); g.moveTo(520, 840); g.lineTo(380, 1170); g.lineTo(430, 1170); g.lineTo(545, 880); g.closePath();
  g.fillStyle = "rgba(255,255,255,0.28)"; g.fill();
  g.restore();
  k.brillo(g, ENTRA[0], ENTRA[1], 320, "255,255,255", 0.7 * u1 * (1 - 0.5 * u2));
  k.brillo(g, E[0], E[1], 380, "255,255,255", 0.5 * u2 * fadeFan);

  // velo suave detrás del subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 650); vg.addColorStop(0, "rgba(7,6,26,0.55)"); vg.addColorStop(1, "rgba(7,6,26,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 650);
}
