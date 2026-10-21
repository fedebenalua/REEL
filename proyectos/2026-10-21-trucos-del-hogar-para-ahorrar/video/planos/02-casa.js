// El recorrido por la casa: cada truco en su habitación, y el resultado en una pastilla en el suelo de la habitación.
import * as k from "#kit";
import { v } from "#voz";
import { escena, cam, aro, T } from "../mundo.js";

export const desde = v.frase(3).inicio;
export const entrada = "sigue";

const VERDE = "130,255,170", Y = 1305;
const { tramo: tr, suave: su } = k;

// Una pastilla que entra con un pequeño golpe en t0 y se va en t1.
function pasti(g, t, t0, t1, principal, unidad, color, tam = 112) {
  const a = su(tr(t, t0, t0 + 0.16)) * (1 - su(tr(t, t1 - 0.25, t1)));
  if (a <= 0.003) return;
  const e = 1 + 0.12 * (1 - k.entra(tr(t, t0, t0 + 0.3)));
  g.save(); g.translate(540, Y); g.scale(e, e); g.translate(-540, -Y);
  k.pastilla(g, 540, Y, principal, unidad, color, a, tam);
  g.restore();
}

export function dibuja(g, t) {
  escena(g, t);
  const f = T.f;
  pasti(g, t, T.ochenta - 0.05, f[3].fin + 0.1, "−80 %", "de luz", VERDE);
  pasti(g, t, T.grado + 0.1, T.siete - 0.05, "−1 °C", "", "255,170,110");
  pasti(g, t, T.siete, f[4].fin + 0.1, "−7 %", "calefacción", VERDE);
  pasti(g, t, T.cuatro, f[5].fin + 0.1, "4×", "menos", VERDE);
  pasti(g, t, T.treinta, T.mas - 0.05, "30 °C", "", "130,205,255");
  pasti(g, t, T.mas, f[6].fin + 0.1, "80 %", "es calentar el agua", "255,150,110", 96);
  pasti(g, t, T.siete5, f[7].fin + 0.1, "−7 %", "de la nevera", VERDE);

  // el remate: cada cosa arreglada late en verde, de una en una
  const c = cam(t), ts = [T.f[8].t("pasar") + 1.2, T.f[8].t("frio") + 0.7, T.tirar - 0.1, T.tirar + 0.5, T.usas - 0.1];
  [["luz", 262, 226], ["calor", 150, 392], ["ducha", 150, 380], ["lavadora", 260, 330], ["nevera", 286, 300]].forEach(([n, ox, oy], i) => aro(g, c, n, ox, oy, t - ts[i], 330, "130,255,170"));
  avion(g, t);
}

// «Envíaselo»: un avión de papel sale de la casa hacia arriba y a la derecha.
function avion(g, t) {
  const u = tr(t, T.enviaselo + 0.05, T.factura9 + 0.25);
  if (u <= 0 || u >= 1) return;
  const e = k.suave(u), P = (s) => [260 + 900 * s, 1150 - 760 * s - 260 * Math.sin(Math.PI * s * 0.9) * (1 - s * 0.4)];
  const [x, y] = P(e), [x2, y2] = P(Math.min(1, e + 0.02)), ang = Math.atan2(y2 - y, x2 - x);
  g.save(); g.lineCap = "round";
  for (let i = 1; i <= 16; i++) { const s = Math.max(0, e - i * 0.018), [tx, ty] = P(s); g.fillStyle = `rgba(255,255,255,${0.7 * (1 - i / 16)})`; g.beginPath(); g.arc(tx, ty, 6 - i * 0.25, 0, 6.2832); g.fill(); }
  g.translate(x, y); g.rotate(ang); g.scale(2.1, 2.1);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 14;
  g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(62, 0); g.lineTo(-48, -34); g.lineTo(-22, 0); g.closePath(); g.fill();
  g.shadowBlur = 0;
  g.fillStyle = "#cfe3ff"; g.beginPath(); g.moveTo(62, 0); g.lineTo(-48, 30); g.lineTo(-22, 0); g.closePath(); g.fill();
  g.fillStyle = "#9db9ee"; g.beginPath(); g.moveTo(-22, 0); g.lineTo(-48, 30); g.lineTo(-34, 6); g.closePath(); g.fill();
  g.restore();
}
