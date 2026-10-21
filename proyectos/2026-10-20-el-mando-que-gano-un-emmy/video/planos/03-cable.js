// «En 1950 salió el primer mando, pero iba atado a la tele con un cable que cruzaba el salón.»
// «Y la gente tropezaba con él.»
// El salón visto desde arriba: una alfombra, la tele arriba y el sillón abajo. Se entra con un corte en «En».
// - «1950»: la cifra; «el primer mando»: el mando color crema aparece junto al sillón.
// - «atado a la tele con un cable que cruzaba el salón»: el cable sale del mando y cruza la alfombra hasta la tele.
// - «tropezaba»: entra un pie, se engancha en el cable, el cable se tensa y el bol de palomitas vuela por los aires.
import * as k from "#kit";
import { v } from "#voz";
import { mando1950 } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f3 = v.frase(3), f4 = v.frase(4);
export const desde = (vz) => vz.frase(3).inicio;
const T0 = f3.inicio, Tano = f3.t("1950"), Tpri = f3.t("primer"), Tata = f3.t("atado"), Tcab = f3.t("cable"), Tsal = f3.t("salon");
const T4 = f4.inicio, Ttro = f4.t("tropezaba"), Fin = v.frase(5).inicio;
export const tropiezo = Ttro + 0.1;
const azP = azar(12);
const PALOMITAS = Array.from({ length: 60 }, () => ({ a: azP() * 6.28, v: 300 + azP() * 900, r: 10 + azP() * 10, g: azP() }));

const A = { x: 300, y: 1450 }, B = { x: 560, y: 520 };
function curva(u, tira) {
  const p1 = { x: 900, y: 1300 }, p2 = { x: 100, y: 800 };
  const m = 1 - u;
  let x = m * m * m * A.x + 3 * m * m * u * p1.x + 3 * m * u * u * p2.x + u * u * u * B.x, y = m * m * m * A.y + 3 * m * m * u * p1.y + 3 * m * u * u * p2.y + u * u * u * B.y;
  // donde se engancha el pie, el cable se estira hacia él
  const d = Math.exp(-Math.pow((u - 0.45) / 0.16, 2));
  x += tira * d * 180; y += tira * d * 60;
  return { x, y };
}

export function dibuja(g, t) {
  const sacude = Math.sin(t * 60) * 12 * k.pulso(t, tropiezo + 0.05, 0.12);
  // la cámara baja despacio por la alfombra siguiendo el cable, y se aleja al tropezar
  const Z = mez(1.0, 1.3, su(tr(t, T0, Tsal))) - 0.25 * su(tr(t, T4, tropiezo + 0.2)), Fy = mez(960, 1050, su(tr(t, T0, Tsal)));
  g.save(); g.translate(540, 960); g.scale(Z, Z); g.translate(-540, -Fy);
  g.translate(sacude, 0);
  // el suelo de madera y la alfombra
  g.fillStyle = "#8a5a34"; g.fillRect(-40, 0, 1160, 1920);
  g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 3; for (let x = 0; x < 1080; x += 110) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke(); }
  k.redondo(g, 110, 640, 860, 900, 40); g.fillStyle = "#2f6a8a"; g.fill();
  g.strokeStyle = "#f2c26a"; g.lineWidth = 14; k.redondo(g, 150, 680, 780, 820, 30); g.stroke();
  g.fillStyle = "rgba(242,194,106,0.4)"; for (let i = 0; i < 5; i++) { g.save(); g.translate(540, 1090); g.rotate(i * 0.628); g.fillRect(-220, -10, 440, 20); g.restore(); }
  // la tele, desde arriba (un bloque de madera) y el sillón
  k.redondo(g, 380, 330, 360, 190, 24); g.fillStyle = "#a0603a"; g.fill(); g.fillStyle = "#1a1a1e"; g.fillRect(400, 500, 320, 20);
  k.redondo(g, 170, 1540, 300, 260, 50); g.fillStyle = "#2f8a7a"; g.fill(); k.redondo(g, 210, 1560, 220, 170, 30); g.fillStyle = "#3aa892"; g.fill();
  // el bol de palomitas, a la derecha del sillón, que sale volando
  const vuela = Math.max(0, t - tropiezo);
  const bx = 760 + vuela * 300, by = 1560 - vuela * 900 + vuela * vuela * 1400, ba = vuela * 9;
  if (by < 2100) { g.save(); g.translate(bx, by); g.rotate(ba); g.fillStyle = "#e0283c"; g.beginPath(); g.arc(0, 0, 90, 0, 6.2832); g.fill(); g.fillStyle = "#fff"; for (let i = 0; i < 6; i++) g.fillRect(-90, -78 + i * 30, 180, 12); g.fillStyle = "#fff6d0"; g.beginPath(); g.arc(0, 0, 70, 0, 6.2832); g.fill(); g.restore(); }
  for (const p of PALOMITAS) {
    const x = 760 + Math.cos(p.a) * p.v * vuela * 0.8, y = 1560 + Math.sin(p.a) * p.v * vuela * 0.8 - 500 * vuela + 1400 * vuela * vuela;
    if (vuela <= 0) { g.fillStyle = "#fff6d0"; g.beginPath(); g.arc(760 + Math.cos(p.a) * 50 * p.g, 1560 + Math.sin(p.a) * 50 * p.g, p.r, 0, 6.2832); g.fill(); continue; }
    if (y > 2000) continue;
    g.fillStyle = "#fff6d0"; g.beginPath(); g.arc(x, y, p.r, 0, 6.2832); g.fill(); g.fillStyle = "#f2c26a"; g.beginPath(); g.arc(x + 3, y + 3, p.r * 0.4, 0, 6.2832); g.fill();
  }
  // el cable: crece del mando a la tele
  const crece = su(tr(t, Tata - 0.1, Tsal + 0.2)), tira = su(tr(t, tropiezo - 0.15, tropiezo + 0.05)) * (1 - su(tr(t, tropiezo + 0.4, tropiezo + 1)));
  if (crece > 0) {
    g.save(); g.lineCap = "round"; g.lineJoin = "round";
    for (const [w, c] of [[26, "#1a1a1e"], [18, "#3a3a40"], [5, "rgba(255,255,255,0.3)"]]) {
      g.beginPath(); for (let i = 0; i <= 80; i++) { const u = (i / 80) * crece, p = curva(u, tira); i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y); }
      g.strokeStyle = c; g.lineWidth = w; g.stroke();
    }
    g.restore();
  }
  // el mando de 1950, junto al sillón
  const ap = entra(tr(t, Tpri - 0.2, Tpri + 0.2));
  if (ap > 0) mando1950(g, A.x, A.y + 300 * (1 - ap) - 40 * tira, 210 * ap + 0.01, -0.2 + 0.05 * Math.sin(t * 3));
  // el pie que pasa y se engancha
  const pie = tr(t, T4 - 0.3, tropiezo + 0.3);
  if (pie > 0 && pie < 1) {
    const p = curva(0.45, tira), px = mez(-200, p.x + 60, Math.min(1, pie * 1.2)), py = p.y - 40;
    g.save(); g.translate(px, py); g.rotate(-0.3 + tira * 0.5);
    g.fillStyle = "#c94a6a"; g.beginPath(); g.ellipse(0, 0, 120, 48, 0, 0, 6.2832); g.fill(); g.fillStyle = "#f4d8e0"; g.beginPath(); g.ellipse(-20, -6, 80, 30, 0, 0, 6.2832); g.fill();
    g.restore();
  }
  g.restore();
  k.pastilla(g, 540, 1000, "1950", "", "255,215,140", su(tr(t, Tano - 0.1, Tano + 0.2)) * (1 - su(tr(t, Tata, Tata + 0.3))), 100);
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(30,15,6,0.6)"); vg.addColorStop(1, "rgba(30,15,6,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export const momentos = { tropiezo };
