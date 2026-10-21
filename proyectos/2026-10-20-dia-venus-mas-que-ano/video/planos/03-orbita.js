// «Venus da la vuelta al Sol en solo doscientos veinticinco días. / Pero para girar una sola vez sobre sí mismo necesita
//  doscientos cuarenta y tres. / O sea, que cuando acaba su año, aún no ha acabado su primer día.»
// Un sitio nuevo: el sistema visto desde arriba, el Sol en el centro y Venus en su órbita. Una cámara que viaja.
// - frase 3: Venus da una vuelta entera al Sol; su estela azul se llena y sube la barra del AÑO hasta 225. «1 año».
// - frase 4: la cámara se echa sobre Venus; su aguja roja da una vuelta sobre sí mismo (naranja) y sube la barra del
//   DÍA hasta 243: más larga que la del año. «1 día».
// - frase 5: la cámara se aleja y todo se repite deprisa, a la vez: el año se cierra («año») y Venus aún tiene la aguja
//   sin cerrar; despacio, se termina el día.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, espacio, sol, venusDisco, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez } = k;
const F3 = v.frase(3), F4 = v.frase(4), F5 = v.frase(5);
const T0 = F3.inicio, FIN = v.frase(6).inicio;
const R = 380, RV = 110, Z2 = 2.4;
const tA0 = T0 + 0.25, tA1 = F3.t("dias") + 0.2;                  // el año: la vuelta entera
const tB0 = F4.inicio, tB1 = F4.t("tres") + 0.55;                // el día: una vuelta sobre sí mismo
const tC0 = F5.inicio, tCy = F5.t("ano") + 0.1, tCd = FIN - 0.55;   // la repetición: año y después día
const tRw = 0.25;

const cam = camino2D([
  [T0, [1.0, 0, 20]], [tA1 + 0.2, [1.0, 0, 20]],
  [tB0 + 0.1, [1.0, 0, 20]], [tB0 + 1.1, [Z2, R, 0]], [tB1 + 0.2, [Z2, R, 0]],
  [tC0 + 0.1, [Z2, R, 0]], [tC0 + 1.4, [1.0, 0, 20]], [FIN, [1.0, 0, 20]],
]);

// cuánto lleva el año (de 0 a 225) y el día (de 0 a 243), según el segundo
function progreso(t) {
  if (t < tB0 + 0.3) return { y: 225 * su(tr(t, tA0, tA1)), d: 0, pos: 225 * su(tr(t, tA0, tA1)) };
  if (t < tC0) return { y: 225, d: 243 * su(tr(t, tB0 + 0.9, tB1)), pos: 225 };
  if (t < tC0 + tRw) { const u = su(tr(t, tC0, tC0 + tRw)); return { y: 225 * (1 - u), d: 243 * (1 - u), pos: 225 }; }
  const s = t < tCy ? 225 * su(tr(t, tC0 + tRw + 0.05, tCy)) : 225 + 18 * su(tr(t, tCy + 0.15, tCd));
  return { y: Math.min(225, s), d: s, pos: s };
}

function barra(g, y, col, val, max, etiq, al = 1) {
  const x0 = 250, esc = 2.4, w = max * esc, h = 62;
  g.save(); g.globalAlpha = al;
  k.etiqueta(g, 40, y - 44, etiq, col, 1, 62);
  k.redondo(g, x0, y - h / 2, w, h, 26); g.fillStyle = "rgba(255,255,255,0.1)"; g.fill();
  const fw = Math.max(0, val * esc);
  if (fw > 2) {
    g.save(); k.redondo(g, x0, y - h / 2, w, h, 26); g.clip();
    const gr = g.createLinearGradient(x0, 0, x0 + w, 0); gr.addColorStop(0, `rgba(${col},0.55)`); gr.addColorStop(1, `rgb(${col})`);
    g.fillStyle = gr; g.fillRect(x0, y - h / 2, fw, h); g.restore();
  }
  g.font = "800 60px Figtree"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillStyle = `rgb(${col})`; g.shadowColor = `rgba(${col},0.8)`; g.shadowBlur = 20;
  g.fillText(val >= max - 0.5 ? `${max} días` : `${Math.round(val)}`, x0 + fw + 16, y + 2);
  g.restore();
}

export function dibuja(g, t) {
  espacio(g, 0.9);
  const P = progreso(t);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la órbita y la estela del año
  g.save(); g.strokeStyle = "rgba(255,255,255,0.14)"; g.lineWidth = 5; g.setLineDash([14, 16]); g.beginPath(); g.arc(0, 0, R, 0, 6.2832); g.stroke(); g.restore();
  g.save(); g.lineCap = "round"; const th = Math.min(0.9996, P.y / 225) * 6.2832;
  if (th > 0.01) {
    g.globalCompositeOperation = "lighter"; g.strokeStyle = "rgba(90,200,255,0.3)"; g.lineWidth = 34; g.beginPath(); g.arc(0, 0, R, 0, -th, true); g.stroke();
    g.globalCompositeOperation = "source-over"; g.strokeStyle = "rgb(90,200,255)"; g.lineWidth = 12; g.beginPath(); g.arc(0, 0, R, 0, -th, true); g.stroke();
  }
  g.restore();
  // el Sol
  sol(g, 0, 0, 135, t, 0);
  // Venus: en su órbita, girando
  const ang = (6.2832 * P.pos) / 225, vx = R * Math.cos(ang), vy = -R * Math.sin(ang);
  const phi = (6.2832 * (t < tB0 + 0.3 ? P.pos : P.d)) / 243;
  const aguja = su(tr(t, tB0 + 0.35, tB0 + 0.9));
  venusDisco(g, vx, vy, RV, phi, -vx, -vy, aguja);
  // el arco naranja del día alrededor de Venus
  if (P.d > 0.5) {
    g.save(); g.lineCap = "round"; const a0 = -Math.PI / 2, a1 = a0 + Math.min(0.9996, P.d / 243) * 6.2832, rr = RV * 1.34;
    g.globalCompositeOperation = "lighter"; g.strokeStyle = "rgba(255,140,60,0.3)"; g.lineWidth = 30; g.beginPath(); g.arc(vx, vy, rr, a0, a1); g.stroke();
    g.globalCompositeOperation = "source-over"; g.strokeStyle = "rgb(255,140,60)"; g.lineWidth = 11; g.beginPath(); g.arc(vx, vy, rr, a0, a1); g.stroke();
    g.restore();
  }
  // los fogonazos al cerrarse el año y el día
  for (const [tf, col] of [[tA1, "120,210,255"], [tCy, "120,210,255"], [tB1, "255,160,80"], [tCd, "255,160,80"]]) {
    const ff = k.pulso(t, tf + 0.05, 0.13);
    if (ff > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, vx, vy, 640, col, 0.75 * ff); g.restore(); }
  }
  sinVista(g);
  // las barras de abajo
  barra(g, 1580, "90,200,255", P.y, 225, "AÑO");
  const bd = su(tr(t, tB0 + 0.35, tB0 + 0.8)); if (bd > 0.01 || t >= tC0) barra(g, 1710, "255,140,60", P.d, 243, "DÍA", t >= tC0 ? 1 : bd);
  // «1 año» y «1 día»
  const ya = Math.max(su(tr(t, tA1, tA1 + 0.15)) * (1 - su(tr(t, tB0 + 0.1, tB0 + 0.4))), su(tr(t, tCy + 0.05, tCy + 0.25)) * (t > tC0 ? 1 : 0));
  const da = Math.max(su(tr(t, tB1, tB1 + 0.15)) * (1 - su(tr(t, tC0, tC0 + 0.2))), su(tr(t, tCd, tCd + 0.15)) * (t > tC0 ? 1 : 0));
  k.pastilla(g, 300, 1370, "1 año", "", "90,200,255", ya, 84);
  k.pastilla(g, 790, 1370, "1 día", "", "255,140,60", da, 84);
  velo(g, 0.4);
  vineta(g, 0.45);
}

export const momentos = { ano: tCy, vuelta: tA1, dia: tB1 };
