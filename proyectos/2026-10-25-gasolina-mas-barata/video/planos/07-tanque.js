// «Y repostar por la mañana, porque la gasolina está más fría, no sirve: está bajo tierra, a unos quince grados todo
// el día.» y «Así que no importa a qué hora la eches:»
// La gasolinera partida por el suelo: arriba el cielo y el termómetro del aire; abajo, la tierra y el tanque enterrado.
// Se entra con un corte en «Y».
// - «repostar por la mañana»: amanece detrás de la gasolinera; el termómetro del aire marca poco.
// - «más fría»: el termómetro del aire se pone azul, a 9 °C.
// - «no sirve: está bajo tierra»: la cámara baja por la tierra hasta el tanque, lleno de gasolina.
// - «a unos quince grados»: su termómetro marca 15 °C.
// - «todo el día»: arriba, el cielo pasa a mediodía y a noche; el aire sube y baja, y el 15 no se mueve.
// - «Así que no importa a qué hora»: el cielo da vueltas deprisa, día y noche; el 15, quieto. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { gasolinera, velo, MARCA_A, AMBAR } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f7 = v.frase(7), f8 = v.frase(8);
const T0 = f7.inicio, Tman = f7.t("manana"), Tgas = f7.t("gasolina"), Tfria = f7.t("fria"), Tno = f7.t("no"), Tbajo = f7.t("bajo"), Ttie = f7.t("tierra"), Tqui = f7.t("quince"), Ttodo = f7.t("todo"), Fin7 = f7.fin;
const Thora = f8.t("hora"), Timp = f8.t("importa"), Tech = f8.t("eches");
export const momentos = { amanece: Tman, fria: Tfria, baja: Tno + 0.1, quince: Tqui };

const GY = 1250; // el suelo, en el mundo
const TX = 540, TY = 1850, TW = 920, TH = 440; // el tanque

// la hora del día: 0 medianoche, 0,25 amanecer, 0,5 mediodía, 0,75 atardecer
const hora = (t) => mez(0.19, 0.29, su(tr(t, T0 - 0.1, Tfria + 0.2))) + 0.73 * su(tr(t, Ttodo - 0.1, Fin7 + 0.25)) + 1.0 * su(tr(t, Timp - 0.1, Tech + 0.2));
const aire = (h) => 17 + 10 * Math.sin(2 * Math.PI * (h - 0.4));

function colorCielo(p) {
  const P = [[0, "#060a26", "#1a1446"], [0.22, "#2a2060", "#ff7a59"], [0.3, "#4f8fe0", "#ffc48a"], [0.5, "#2f7fe8", "#a9dcff"], [0.72, "#4b3a8f", "#ff8a4c"], [0.8, "#1a1446", "#5a2163"], [1, "#060a26", "#1a1446"]];
  for (let i = 0; i < P.length - 1; i++) if (p <= P[i + 1][0]) { const u = (p - P[i][0]) / (P[i + 1][0] - P[i][0]); return [k.mezColor(P[i][1], P[i + 1][1], u), k.mezColor(P[i][2], P[i + 1][2], u)]; }
  return [P[0][1], P[0][2]];
}

const azT = azar(61);
const PIEDRAS = Array.from({ length: 60 }, () => ({ x: azT() * 1080, y: GY + 60 + azT() * 1500, rx: 10 + azT() * 30, ry: 6 + azT() * 18, a: azT() * 3 }));
const ESTR = Array.from({ length: 90 }, () => ({ x: azT() * 1080, y: azT() * GY * 0.8, s: 1 + azT() * 2 }));

function termometro(g, x, y, alto, nivel, color) {
  // un tubo de cristal con su bola; nivel de 0 a 1
  g.save();
  k.redondo(g, x - 22, y - alto, 44, alto, 22); g.fillStyle = "rgba(230,240,255,0.25)"; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 5; g.stroke();
  g.beginPath(); g.arc(x, y + 10, 42, 0, 6.2832); g.fillStyle = `rgb(${color})`; g.fill(); g.stroke();
  const h = (alto - 30) * nivel;
  g.fillStyle = `rgb(${color})`; g.fillRect(x - 11, y - h, 22, h + 10);
  k.brillo(g, x, y + 10, 200, color, 0.6);
  g.restore();
}

export function dibuja(g, t) {
  const h = hora(t), p = ((h % 1) + 1) % 1;
  const baja = su(tr(t, Tno + 0.05, Ttie + 0.25));
  const camY = 600 * baja;
  g.save(); g.translate(0, -camY);
  // el cielo
  const [c0, c1] = colorCielo(p);
  const cg = g.createLinearGradient(0, -200, 0, GY); cg.addColorStop(0, c0); cg.addColorStop(1, c1);
  g.fillStyle = cg; g.fillRect(0, -200, 1080, GY + 200);
  const nocheAl = Math.max(0, Math.cos(2 * Math.PI * p));
  for (const e of ESTR) { g.fillStyle = `rgba(255,255,255,${0.7 * nocheAl})`; g.fillRect(e.x, e.y, e.s, e.s); }
  // el sol: sale por la izquierda y se pone por la derecha
  const as = (p - 0.25) / 0.5;
  if (as > -0.1 && as < 1.1) {
    const sx = mez(560, 1000, as), sy = GY - 40 - 1000 * Math.sin(Math.PI * Math.max(0, Math.min(1, as)));
    k.brillo(g, sx, sy, 650, "255,200,110", 0.55);
    g.fillStyle = "#fff4d6"; g.beginPath(); g.arc(sx, sy, 70, 0, 6.2832); g.fill();
  }
  // la luna, de noche
  if (nocheAl > 0.05) { const ap = ((p + 0.5) % 1 - 0.25) / 0.5; if (ap > 0 && ap < 1) { const mx = mez(-60, 1140, ap), my = GY - 150 - 800 * Math.sin(Math.PI * ap); g.fillStyle = `rgba(235,240,255,${nocheAl})`; g.beginPath(); g.arc(mx, my, 50, 0, 6.2832); g.fill(); } }
  // la gasolinera, arriba
  const luz = 0.4 + 0.6 * nocheAl;
  gasolinera(g, 690, GY, 0.55, { marca: MARCA_A, luz, tienda: luz });
  // el termómetro del aire, a la izquierda
  const manana = mez(14, 7, su(tr(t, Tman, Tfria + 0.3)));
  const ta = mez(manana, aire(h), su(tr(t, Ttodo - 0.2, Ttodo + 0.4))), frio = su(tr(ta, 16, 10)), calor = su(tr(ta, 20, 27));
  const colA = k.mezRgb(k.mezRgb("255,255,255", "90,170,255", frio), "255,120,60", calor);
  termometro(g, 110, GY - 60, 480, mez(0.15, 0.95, tr(ta, 5, 30)), colA);
  k.pastilla(g, 275, GY - 150, `${Math.round(ta)}`, "°C", colA, 1, 84);
  // «la gasolina está más fría»: el frío azul sobre los surtidores, que se va en «no sirve»
  const frioW = su(tr(t, Tgas - 0.1, Tfria + 0.2)) * (1 - su(tr(t, Tno, Tno + 0.4)));
  k.brillo(g, 690, GY - 160, 900, "110,190,255", 0.6 * frioW);
  if (frioW > 0.01) { g.save(); g.fillStyle = `rgba(40,90,190,${0.22 * frioW})`; g.fillRect(0, -200, 1080, GY + 200); g.restore(); }
  // el suelo: el asfalto y la tierra
  g.fillStyle = "#24222c"; g.fillRect(0, GY, 1080, 40);
  const tg = g.createLinearGradient(0, GY + 40, 0, GY + 1800); tg.addColorStop(0, "#6a4228"); tg.addColorStop(1, "#24140b");
  g.fillStyle = tg; g.fillRect(0, GY + 40, 1080, 1800);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(k.manchas, 0, GY + 40, 1080, 1800); g.restore();
  for (const s of PIEDRAS) { g.fillStyle = "rgba(40,25,15,0.7)"; g.beginPath(); g.ellipse(s.x, s.y, s.rx, s.ry, s.a, 0, 6.2832); g.fill(); g.fillStyle = "rgba(200,160,120,0.25)"; g.beginPath(); g.ellipse(s.x - s.rx * 0.2, s.y - s.ry * 0.3, s.rx * 0.5, s.ry * 0.35, s.a, 0, 6.2832); g.fill(); }
  // el tubo del tanque al surtidor
  g.strokeStyle = "#5d6373"; g.lineWidth = 34; g.beginPath(); g.moveTo(690, GY); g.lineTo(690, TY - TH / 2 + 10); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.3)"; g.lineWidth = 8; g.beginPath(); g.moveTo(682, GY); g.lineTo(682, TY - TH / 2 + 10); g.stroke();
  // el tanque: acero por fuera, abierto para ver la gasolina
  g.save(); g.shadowColor = "rgba(0,0,0,0.7)"; g.shadowBlur = 60; g.shadowOffsetY = 20;
  k.redondo(g, TX - TW / 2, TY - TH / 2, TW, TH, TH / 2); g.fillStyle = "#3b404c"; g.fill(); g.restore();
  const mg = g.createLinearGradient(0, TY - TH / 2, 0, TY + TH / 2); mg.addColorStop(0, "#9aa1b0"); mg.addColorStop(0.25, "#e6eaf1"); mg.addColorStop(0.6, "#6c7282"); mg.addColorStop(1, "#2f333d");
  k.redondo(g, TX - TW / 2, TY - TH / 2, TW, TH, TH / 2); g.fillStyle = mg; g.fill();
  const IW = TW - 60, IH = TH - 60;
  g.save(); k.redondo(g, TX - IW / 2, TY - IH / 2, IW, IH, IH / 2); g.clip();
  g.fillStyle = "#1a1c24"; g.fillRect(TX - IW / 2, TY - IH / 2, IW, IH);
  const nv = TY - IH / 2 + IH * 0.18;
  const gg = g.createLinearGradient(0, nv, 0, TY + IH / 2); gg.addColorStop(0, "#ffd36a"); gg.addColorStop(0.4, "#f0a030"); gg.addColorStop(1, "#9a520f");
  g.fillStyle = gg; g.beginPath(); g.moveTo(TX - IW / 2, TY + IH / 2);
  for (let x = TX - IW / 2; x <= TX + IW / 2; x += 20) g.lineTo(x, nv + Math.sin(x * 0.015 + t * 2) * 5);
  g.lineTo(TX + IW / 2, TY + IH / 2); g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.manchas, TX - IW / 2, nv, IW, IH); g.restore();
  g.restore();
  k.redondo(g, TX - IW / 2, TY - IH / 2, IW, IH, IH / 2); g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 4; g.stroke();
  // el termómetro del tanque: siempre 15
  const q = k.entra(tr(t, Tqui - 0.15, Tqui + 0.2));
  termometro(g, TX + 250, TY + 110, 260, 0.45, AMBAR);
  if (q > 0) k.pastilla(g, TX - 130, TY + 10, "15", "°C", AMBAR, q, 130);
  k.brillo(g, TX, TY, 1400, AMBAR, 0.25 * q + 0.35 * k.pulso(t, Tqui + 0.1, 0.18));
  g.restore();
  velo(g, 0.5);
}
