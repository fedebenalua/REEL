// «Y al atardecer, la luz tiene que cruzar muchísimo más aire para llegar a ti. Por el camino, el azul se va rebotando
// hacia otro lado, y solo te llegan el naranja y el rojo.»
// Otro sitio: la Tierra de lado, con su capa de aire, y el Sol arriba. Se entra con un corte en «Y». Una sola cámara.
// - «Y al atardecer»: quien mira (un puntito) está arriba, a mediodía, y la luz le llega por un camino cortito de aire;
//   la Tierra gira y él baja hasta el borde: «cruzar muchísimo más aire»: el camino por el aire se alarga y se marca.
// - «para llegar a ti»: la cámara se acerca a ese camino largo; un fotón lo recorre.
// - «Por el camino, el azul se va rebotando hacia otro lado»: chispas azules salen disparadas a los lados, una tras
//   otra, y el haz pasa de blanco a amarillo y a naranja.
// - «solo te llegan el naranja y el rojo»: al final del camino llega rojo; el borde de la Tierra se tiñe de rojo.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, ROJO, NARANJA, AMARILLO, foton, sol, tierraConAire } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez, azar, pulso } = k;
const f9 = v.frase(9), f10 = v.frase(10);
const T0 = f9.inicio, Tatar = f9.t("atardecer"), Tcruzar = f9.t("cruzar"), Taire = f9.t("aire"), Tti = f9.t("ti");
const Tcamino = f10.t("camino"), Tazul = f10.t("azul"), Trebo = f10.t("rebotando"), Tnaranja = f10.t("naranja"), Trojo = f10.t("rojo"), Fin = f10.fin;

const C = [540, 1480], R = 360, R2 = R + 150;
const SOL = [540, 640];
const theta = k.claves([[T0, 0], [Tatar - 0.1, 0], [Tcruzar + 0.7, 86 * Math.PI / 180], [Fin, 86 * Math.PI / 180]]);
const zoom = k.claves([[T0, 1], [Taire + 0.3, 1], [Tti + 0.9, 1.75], [Fin, 1.75]]);
const foco = [k.claves([[T0, 540], [Taire + 0.3, 540], [Tti + 0.9, 860], [Fin, 860]]), k.claves([[T0, 1100], [Taire + 0.3, 1100], [Tti + 0.9, 1320], [Fin, 1320]])];

const obs = (th) => [C[0] + R * Math.sin(th), C[1] - R * Math.cos(th)];
// el camino de la luz por el aire hasta quien mira: baja en vertical, entra en la capa en yIn y llega en yObs
const caminoPor = (th) => { const [ox, oy] = obs(th), dx = ox - C[0], yIn = C[1] - Math.sqrt(Math.max(0, R2 * R2 - dx * dx)); return { ox, oy, yIn }; };

const az = azar(912);
const CHISPAS = Array.from({ length: 34 }, (_, i) => { const u = i / 33; return { u, t0: Tazul + 0.0 + u * (Tnaranja - Tazul + 0.5), lado: i % 2 ? 1 : -1, ang: (az() - 0.5) * 0.9, vel: 900 + az() * 500, y: az() }; });
const AIRE = Array.from({ length: 70 }, () => ({ r: az(), a: az() * 6.28, f: az() * 6.28 }));

export function dibuja(g, t) {
  g.fillStyle = "#02040c"; g.fillRect(0, 0, 1080, 1920);
  const Z = zoom(t), fx = foco[0](t), fy = foco[1](t);
  g.save(); g.translate(540, 1000); g.scale(Z, Z); g.translate(-fx, -fy);

  // el fondo de estrellas
  for (let i = 0; i < 60; i++) { const x = (i * 197) % 1500 - 200, y = (i * 311) % 1500 - 200 + 100; g.fillStyle = `rgba(220,230,255,${0.25 + (i % 5) * 0.12})`; g.fillRect(x, y, 2.2, 2.2); }
  // el Sol, arriba, y sus rayos que bajan en paralelo
  sol(g, SOL[0], SOL[1], 70, 1, 0.6);
  g.save(); g.globalCompositeOperation = "lighter";
  for (let x = -220; x <= 1300; x += 70) {
    const dx = x - C[0]; if (Math.abs(dx) >= R2) { g.strokeStyle = "rgba(255,248,225,0.12)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 760); g.lineTo(x, 1900); g.stroke(); continue; }
    const yIn = C[1] - Math.sqrt(R2 * R2 - dx * dx);
    g.strokeStyle = "rgba(255,248,225,0.14)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 760); g.lineTo(x, yIn); g.stroke();
  }
  g.restore();

  // la capa de aire (gruesa, para verla), la Tierra y su borde azul
  const sg = g.createRadialGradient(C[0], C[1], R * 0.98, C[0], C[1], R2);
  sg.addColorStop(0, `rgba(${AZUL},0.55)`); sg.addColorStop(0.5, `rgba(${AZUL},0.22)`); sg.addColorStop(1, `rgba(${AZUL},0.04)`);
  g.fillStyle = sg; g.beginPath(); g.arc(C[0], C[1], R2, 0, 6.2832); g.fill();
  g.strokeStyle = `rgba(${AZUL},0.35)`; g.lineWidth = 3; g.beginPath(); g.arc(C[0], C[1], R2, 0, 6.2832); g.stroke();
  tierraConAire(g, C[0], C[1], R, 0, 0.1 + theta(t) / 6.2832, 0, -1, 1.3);

  // las moléculas del aire, en su capa
  g.save(); g.fillStyle = "rgba(200,190,255,0.5)";
  for (const m of AIRE) { const rr = R + 8 + m.r * (R2 - R - 16), a = -Math.PI / 2 + (m.a - 3.14) * 0.95; g.beginPath(); g.arc(C[0] + Math.cos(a) * rr, C[1] + Math.sin(a) * rr, 3.2, 0, 6.2832); g.fill(); }
  g.restore();

  // el camino de la luz hasta quien mira
  const th = theta(t), { ox, oy, yIn } = caminoPor(th);
  const p = su(tr(t, Tazul - 0.1, Tnaranja + 0.5)), pRojo = su(tr(t, Tnaranja, Trojo + 0.35));
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const haz = g.createLinearGradient(0, yIn, 0, oy);
  haz.addColorStop(0, "rgba(255,255,255,1)");
  haz.addColorStop(0.45, `rgba(${k.mezRgb("255,255,255", "255,225,150", p)},1)`);
  haz.addColorStop(0.8, `rgba(${k.mezRgb("255,255,255", "255,150,60", p)},1)`);
  haz.addColorStop(1, `rgba(${k.mezRgb("255,255,255", "255,60,50", p * (0.4 + 0.6 * pRojo))},1)`);
  const marca = su(tr(t, Tcruzar, Tcruzar + 0.5));
  for (const [w, a] of [[46, 0.22], [22, 0.45]]) { g.strokeStyle = haz; g.globalAlpha = a * (0.55 + 0.45 * marca); g.lineWidth = w; g.beginPath(); g.moveTo(ox, 760); g.lineTo(ox, oy); g.stroke(); }
  g.restore();
  g.save(); g.lineCap = "round"; g.strokeStyle = haz; g.globalAlpha = 0.95; g.lineWidth = 9; g.beginPath(); g.moveTo(ox, 760); g.lineTo(ox, oy); g.stroke(); g.restore();

  // lo que mide el camino por el aire: un corchete
  if (marca > 0.01 && t < Tazul + 0.3) {
    g.save(); g.strokeStyle = `rgba(255,255,255,${0.9 * marca})`; g.lineWidth = 6; g.lineCap = "round";
    const bx = ox + 46; g.beginPath(); g.moveTo(bx - 14, yIn); g.lineTo(bx, yIn); g.lineTo(bx, oy); g.lineTo(bx - 14, oy); g.stroke(); g.restore();
  }
  // el camino corto del mediodía, para comparar (queda apagado)
  if (th > 0.25) { const c0 = caminoPor(0); g.save(); g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 6; g.lineCap = "round"; g.setLineDash([10, 14]); g.beginPath(); g.moveTo(c0.ox, c0.yIn); g.lineTo(c0.ox, c0.oy); g.stroke(); g.restore(); }

  // las motas de luz que viajan por el camino
  const vi = (t - Tti) * 1000;
  for (let i = 0; i < 5; i++) { const s = (((t * 600 + i * 90) % 450) + 450) % 450; const y = yIn - 150 + s * ((oy - yIn + 150) / 450); if (y > 760 && y < oy) k.brillo(g, ox, y, 40, p > 0.5 ? "255,190,120" : "255,255,255", 0.9); }

  // las chispas azules que salen disparadas a los lados
  for (const c of CHISPAS) {
    const s = (t - c.t0) * c.vel; if (s < 0) continue;
    const y0 = mez(yIn + 10, oy - 30, c.u), ax = c.lado * Math.cos(c.ang), ay = Math.sin(c.ang) * 0.8 - 0.1;
    foton(g, [[ox, y0], [ox + ax * 1500, y0 + ay * 1500]], s, AZUL, 260, 150);
  }

  // quien mira
  const obsA = th;
  g.save(); g.translate(ox, oy); g.rotate(obsA); g.scale(1.9, 1.9);
  g.shadowColor = "rgba(255,255,255,0.9)"; g.shadowBlur = 24;
  g.fillStyle = "#ffffff"; g.beginPath(); g.arc(0, -52, 18, 0, 6.2832); g.fill();
  g.beginPath(); g.moveTo(-14, -34); g.lineTo(14, -34); g.lineTo(11, 0); g.lineTo(-11, 0); g.closePath(); g.fill();
  g.restore();
  // lo que le llega: el naranja y el rojo
  k.brillo(g, ox, oy - 20, 460, "255,120,50", 0.9 * pRojo);
  k.brillo(g, ox, oy - 20, 900, ROJO, 0.55 * pRojo);
  g.restore();

  const vg = g.createLinearGradient(0, 200, 0, 650); vg.addColorStop(0, "rgba(2,4,12,0.6)"); vg.addColorStop(1, "rgba(2,4,12,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 650);
}
