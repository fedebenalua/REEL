// «Y se nota: les cuesta más saber si los nombres de dos dibujos riman.» «Y recordar una lista de palabras.»
// «Pero si hablan en voz alta, lo hacen igual de bien.»
// - La cabeza azul abajo, mirando arriba a la derecha; arriba, dos cartas boca abajo. «se nota»: se dan la vuelta (una
//   bota y una pelota). «nombres»: debajo, «bota» y «pelota»; entre las dos, «¿riman?» y una barra que se llena a
//   trompicones, sin llegar.
// - «Y recordar»: las cartas se van y llegan cinco fichas con una palabra; en «palabras», dos se caen y se apagan.
// - «hablan en voz alta»: de la boca salen ondas de oro; las fichas caídas vuelven a su sitio y en «igual de bien» la
//   fila se enciende en verde.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, BOCA, ORO, VERDE, cabeza, fondo, frena, palabra, silencio, velo, vineta } from "../mundo.js";

export const desde = (v) => v.frase(9).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra, sale, pulso, redondo } = k;
const f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const T0 = f9.inicio, Tnota = f9.t("nota"), Tcue = f9.t("cuesta"), Tnom = f9.t("nombres"), Trim = f9.t("riman");
const Ty = f10.inicio, Tlis = f10.t("lista"), Tpal = f10.t("palabras");
const Thab = f11.t("hablan"), Talt = f11.t("alta"), Thac = f11.t("hacen"), Tigu = f11.t("igual"), Tbien = f11.t("bien");
const Tfin = v.frase(12).inicio;

// la cabeza: abajo a la izquierda, grande
const HX = 330, HY = 1240, HS = 0.62;

// ---------------------------------------------------------------- los dibujos
function pelota(g, x, y, r, t) {
  // una pelota de playa vista de frente: cinco gajos entre meridianos
  const cols = ["#ff4a4a", "#ffffff", "#2f7bff", "#ffd23a", "#2fcf6a"];
  const gira = Math.sin(t * 1.2) * 0.25;
  g.save(); g.translate(x, y);
  const meridiano = (phi, n = 24) => Array.from({ length: n + 1 }, (_, j) => { const yy = -r + (2 * r * j) / n; return [r * Math.sin(phi) * Math.sqrt(Math.max(0, 1 - (yy / r) ** 2)), yy]; });
  for (let i = 0; i < 5; i++) {
    const p0 = Math.max(-Math.PI / 2, -Math.PI / 2 + i * 0.6283 + gira), p1 = Math.min(Math.PI / 2, -Math.PI / 2 + (i + 1) * 0.6283 + gira);
    if (p1 <= p0) continue;
    const A = meridiano(p0), B = meridiano(p1).reverse();
    g.beginPath(); g.moveTo(A[0][0], A[0][1]); for (const q of A) g.lineTo(q[0], q[1]); for (const q of B) g.lineTo(q[0], q[1]); g.closePath();
    g.fillStyle = cols[i]; g.fill();
  }
  g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.save(); g.clip();
  const sg = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
  sg.addColorStop(0, "rgba(255,255,255,0.35)"); sg.addColorStop(0.55, "rgba(0,0,0,0)"); sg.addColorStop(1, "rgba(0,0,30,0.45)");
  g.fillStyle = sg; g.fillRect(-r, -r, r * 2, r * 2);
  g.restore();
  g.strokeStyle = "rgba(40,30,60,0.6)"; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(-r * 0.38, -r * 0.45, r * 0.18, r * 0.1, -0.6, 0, 6.2832); g.fill();
  g.restore();
}
function bota(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  // la bota de agua, amarilla: la caña, el pie y la suela
  g.beginPath();
  g.moveTo(-70, -120); g.lineTo(40, -120); g.lineTo(46, 30);
  g.bezierCurveTo(60, 40, 120, 45, 140, 70); g.bezierCurveTo(150, 85, 148, 100, 140, 110);
  g.lineTo(-80, 110); g.bezierCurveTo(-86, 60, -80, -40, -70, -120); g.closePath();
  const bg = g.createLinearGradient(-80, 0, 150, 0); bg.addColorStop(0, "#ffe25a"); bg.addColorStop(0.5, "#f6b81c"); bg.addColorStop(1, "#c07a08");
  g.fillStyle = bg; g.fill(); g.strokeStyle = "#7a4a06"; g.lineWidth = 5; g.stroke();
  redondo(g, -84, 98, 232, 26, 10); g.fillStyle = "#3a2a20"; g.fill();
  redondo(g, -76, -132, 124, 26, 10); g.fillStyle = "#f2a40e"; g.fill(); g.strokeStyle = "#7a4a06"; g.lineWidth = 4; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)"; redondo(g, -54, -100, 16, 170, 8); g.fill();
  g.restore();
}
// una carta que se da la vuelta: gira de 0 (boca abajo) a 1 (boca arriba)
function carta(g, x, y, w, h, gira, cara, al = 1, ang = 0) {
  if (al <= 0.01) return;
  const sx = Math.abs(Math.cos(gira * Math.PI));
  const arriba = gira > 0.5;
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(Math.max(0.02, sx), 1); g.globalAlpha *= al;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [lw, a] of [[40, 0.1], [16, 0.25]]) { redondo(g, -w / 2, -h / 2, w, h, 30); g.strokeStyle = `rgba(${AZUL},${a})`; g.lineWidth = lw; g.stroke(); }
  g.restore();
  redondo(g, -w / 2, -h / 2, w, h, 30);
  if (arriba) {
    const fg = g.createLinearGradient(0, -h / 2, 0, h / 2); fg.addColorStop(0, "#fffaf0"); fg.addColorStop(1, "#e6dccb");
    g.fillStyle = fg; g.fill();
    cara(g);
  } else {
    const fg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); fg.addColorStop(0, "#2a5ad8"); fg.addColorStop(1, "#11286e");
    g.fillStyle = fg; g.fill();
    g.save(); g.clip(); g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 10;
    for (let i = -6; i < 8; i++) { g.beginPath(); g.moveTo(-w / 2 + i * 50, -h / 2); g.lineTo(-w / 2 + i * 50 + h, h / 2); g.stroke(); }
    g.restore();
  }
  redondo(g, -w / 2, -h / 2, w, h, 30); g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 6; g.stroke();
  g.restore();
}
// una ficha con una palabra, centrada en (x, y); col: su borde y su luz
function ficha(g, x, y, texto, al, col, ang = 0, luz = 0) {
  if (al <= 0.01) return;
  const w = 188, h = 112;
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  if (luz > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, 0, 330, col, 0.6 * luz); g.restore(); }
  redondo(g, -w / 2, -h / 2, w, h, 22);
  const fg = g.createLinearGradient(0, -h / 2, 0, h / 2); fg.addColorStop(0, "#1e2c66"); fg.addColorStop(1, "#0c1438");
  g.fillStyle = fg; g.fill(); g.strokeStyle = `rgba(${col},0.95)`; g.lineWidth = 6; g.stroke();
  g.font = "800 50px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffffff"; g.fillText(texto, 0, 3);
  g.restore();
}
const LISTA = ["llave", "nube", "tren", "vaso", "flor"];
const CAEN = [1, 3];

export function dibuja(g, t) {
  const tf = t;
  fondo(g, tf, {});
  // la cabeza azul, que mira arriba a la derecha
  const busca = 0.5 + 0.5 * Math.sin(t * 7) * su(tr(t, Tcue - 0.2, Tcue + 0.3)) * (1 - su(tr(t, Trim + 0.2, Ty + 0.3)));
  cabeza(g, HX, HY, HS, tf, { tono: "azul", luz: 0.6 + 0.3 * busca, dentro: (c) => silencio(c, tf, 0.7 + 0.3 * busca) });
  // ---- las cartas
  const vanse = sale(tr(t, Ty - 0.05, Ty + 0.45));
  const gira = su(tr(t, Tnota - 0.1, Tnota + 0.45));
  const cy = 760 - vanse * 1400;
  carta(g, 300, cy, 330, 330, gira, (c) => bota(c, -20, 10, 0.95), 1, -0.06);
  carta(g, 775, cy, 330, 330, Math.max(0, gira - 0.05) / 0.95, (c) => pelota(c, 0, 0, 110, tf), 1, 0.06);
  // sus nombres
  const nom = su(tr(t, Tnom - 0.25, Tnom + 0.1)) * (1 - vanse);
  if (nom > 0.01) {
    for (const [x, n] of [[300, "bota"], [775, "pelota"]]) {
      g.save(); g.globalAlpha = nom; g.font = "800 64px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
      g.lineJoin = "round"; g.strokeStyle = "rgba(10,6,30,0.8)"; g.lineWidth = 12; g.strokeText(n, x, cy + 230); g.fillStyle = "#ffffff"; g.fillText(n, x, cy + 230);
      g.restore();
    }
  }
  // «¿riman?» y la barra que se llena a trompicones
  const pre = su(tr(t, Tcue - 0.1, Tcue + 0.3)) * (1 - vanse);
  if (pre > 0.01) {
    palabra(g, "¿riman?", 540, cy + 330, 70, pre, "200,230,255");
    const lleno = Math.min(0.62, 0.62 * tr(t, Tcue, Trim + 0.2) - 0.06 * Math.max(0, Math.sin(t * 9)) * tr(t, Tcue, Trim));
    redondo(g, 340, cy + 395, 400, 30, 15); g.globalAlpha = pre; g.fillStyle = "rgba(10,10,40,0.8)"; g.fill(); g.strokeStyle = "rgba(200,230,255,0.6)"; g.lineWidth = 3; g.stroke();
    if (lleno > 0.01) { redondo(g, 343, cy + 398, 394 * lleno, 24, 12); g.fillStyle = `rgba(${AZUL},0.95)`; g.fill(); }
    g.globalAlpha = 1;
  }
  // ---- la lista de palabras
  const ondasBoca = su(tr(t, Thab - 0.15, Talt + 0.1)) * (1 - su(tr(t, Tbien + 0.1, Tfin - 0.3)));
  const verde = su(tr(t, Tigu - 0.15, Tigu + 0.25));
  const fuera = k.sale(tr(t, Tbien + 0.3, Tfin - 0.1));
  g.save(); g.translate(0, -fuera * 1100); g.globalAlpha = 1 - su(tr(fuera, 0, 0.35));
  for (let i = 0; i < 5; i++) {
    const tl = Ty + 0.1 + i * 0.13, u = entra(tr(t, tl, tl + 0.45));
    if (u <= 0.01) continue;
    const fx = 120 + i * 210, fy = 700 + (i % 2) * 140;
    const j = CAEN.indexOf(i);
    const cae = j >= 0 ? sale(tr(t, Tpal - 0.1, Tpal + 0.45)) : 0;
    // las que se cayeron vuelven a su sitio cuando llega su palabra de oro
    const vuelve = j >= 0 ? entra(tr(t, Thac + 0.05 + j * 0.15, Thac + 0.3 + j * 0.15)) : 0;
    const x = mez(1250, fx, u), y = fy + cae * 900 * (1 - vuelve) - (vuelve > 0 ? 0 : 0);
    const col = verde > 0.5 ? VERDE : AZUL;
    if (vuelve > 0) ficha(g, fx, fy - 20 * (1 - vuelve), LISTA[i], vuelve, col, 0, verde * (0.6 + 0.4 * pulso(t, Tigu + 0.15, 0.25)) + 0.6 * pulso(t, Thac + 0.2 + j * 0.15, 0.15));
    else ficha(g, x, y, LISTA[i], 1 - su(tr(cae, 0.15, 0.6)), col, cae * (i === 1 ? -0.5 : 0.45), 0);
  }
  g.restore();
  // las ondas de oro que salen de la boca, hacia arriba a la derecha, y unas palabras que suben con ellas
  if (ondasBoca > 0.01) {
    const bx = HX + BOCA.x * HS + 20, by = HY + BOCA.y * HS;
    g.save(); g.beginPath(); g.rect(bx, 0, 1080, 1920); g.clip();
    // ondas de oro: arcos que se abren hacia delante
    g.globalCompositeOperation = "lighter";
    for (let j = 0; j < 4; j++) {
      const u = (((t - Thab) / 0.55 + j / 4) % 1 + 1) % 1, r = 40 + u * 520, a = ondasBoca * Math.sin(Math.PI * u);
      for (const [w, aa] of [[30, 0.15], [9, 0.8]]) { g.strokeStyle = `rgba(${ORO},${a * aa})`; g.lineWidth = w; g.beginPath(); g.arc(bx, by, r, -1.25, 0.5); g.stroke(); }
    }
    g.restore();
    for (const [j, i] of CAEN.entries()) {
      const u = su(tr(t, Talt - 0.2 + j * 0.15, Thac + 0.15 + j * 0.15));
      if (u > 0 && u < 1) palabra(g, LISTA[i], mez(bx + 40, 120 + i * 210, u), mez(by - 20, 700 + (i % 2) * 140, u) - Math.sin(Math.PI * u) * 120, mez(60, 80, u), Math.min(1, Math.sin(Math.PI * u) * 2), ORO);
    }
  }
  // «igual de bien»: un fogonazo verde suave
  const fog = pulso(t, Tigu + 0.15, 0.22);
  if (fog > 0.02) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 540, 770, 1300, VERDE, 0.35 * fog); g.restore(); }
  vineta(g, 0.5);
  velo(g, 0.4);
}
