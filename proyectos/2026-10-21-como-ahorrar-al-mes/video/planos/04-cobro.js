// «Tres: págate a ti primero. El día que cobras, pasa cincuenta euros a otra cuenta antes de gastar nada.»
// Vuelta a la mesa de la cartera, con el tarro al lado. Corte en «Tres».
// - «págate a ti primero»: el tarro brilla y se marca «para ti».
// - «el día que cobras»: llueven billetes del sueldo dentro de la cartera.
// - «pasa cincuenta euros»: el primer billete, el de 50, sale volando de la cartera y cae dentro del tarro.
// - «antes de gastar nada»: por la derecha llegan los tickets de los gastos (luz, alquiler, compra) y esperan detrás.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, cartera, billete, tarro, velo, vineta, ORO, VERDE } from "../mundo.js";

export const desde = (v) => v.frase(5).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f5 = v.frase(5);
const T0 = f5.inicio, Tpag = f5.t("pagate"), Tpri = f5.t("primero"), Tcob = f5.t("cobras"), Tpasa = f5.t("pasa"), Tcin = f5.t("cincuenta"), Tcue = f5.t("cuenta"), Tant = f5.t("antes"), Tnada = f5.t("nada"), Fin = v.frase(6).inicio;

const CART = [180, 200], TARRO = [-300, 560];
const cam = camino2D([[T0, [1.1, -20, 360]], [Tpri, [1.2, -170, 400]], [Tcob - 0.2, [1.12, 0, 330]], [Tcin + 0.6, [1.12, -20, 360]], [Tant, [1.05, 60, 380]], [Fin, [1.06, 60, 380]]]);
const mantel = (() => { const l = k.lienzo(256), c = l.getContext("2d"); c.fillStyle = "#4aa8a0"; c.fillRect(0, 0, 256, 256); c.fillStyle = "rgba(255,255,255,0.13)"; c.fillRect(0, 0, 128, 256); c.fillRect(0, 0, 256, 128); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.25; c.drawImage(k.manchas, 0, 0, 256, 256); return l; })();
const SUELDO = Array.from({ length: 6 }, (_, i) => { const az = azar(40 + i); return { t0: Tcob - 0.35 + i * 0.09, x: (az() - 0.5) * 200, a: (az() - 0.5) * 0.6, n: i === 5 ? 50 : [20, 10, 20, 50, 20][i] }; });
const vuela = (t) => su(tr(t, Tcin - 0.15, Tcue + 0.1));
const TICKETS = [["Luz", "#ffd23a"], ["Alquiler", "#ff6a6a"], ["Compra", "#6ad0ff"]];

function ticket(g, nombre, color) {
  g.save(); g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 18; g.shadowOffsetY = 8;
  g.beginPath(); g.moveTo(-110, -150); g.lineTo(110, -150); for (let i = 0; i <= 10; i++) g.lineTo(110 - i * 22, 150 + (i % 2 ? 14 : 0)); g.closePath(); g.fillStyle = "#fbfaf6"; g.fill(); g.restore();
  g.fillStyle = color; g.fillRect(-110, -150, 220, 56);
  g.font = "800 40px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#1a1c24"; g.fillText(nombre, 0, -122);
  g.fillStyle = "#c8ccd4"; for (let i = 0; i < 4; i++) g.fillRect(-80, -60 + i * 40, 160 - (i % 2) * 50, 14);
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  for (let x = -2048; x < 2048; x += 256) for (let y = -1536; y < 2048; y += 256) g.drawImage(mantel, x, y, 256, 256);
  const lg = g.createRadialGradient(0, 200, 100, 0, 200, 1500); lg.addColorStop(0, "rgba(255,230,180,0.25)"); lg.addColorStop(1, "rgba(20,10,0,0.55)"); g.fillStyle = lg; g.fillRect(-2048, -1536, 4096, 3600);
  // los tickets que esperan a la derecha
  for (const [i, [n, c]] of TICKETS.entries()) {
    const u = k.entra(tr(t, Tant - 0.2 + i * 0.15, Tant + 0.4 + i * 0.15));
    if (u <= 0) continue;
    g.save(); g.translate(mez(1500, 380 + i * 95, u), 560 + i * 55); g.rotate(-0.15 + i * 0.12); g.scale(0.85, 0.85); ticket(g, n, c); g.restore();
  }
  // la cartera, con los billetes del sueldo dentro
  const dentro = SUELDO.filter((b) => t > b.t0 + 0.4).length;
  g.save(); g.translate(CART[0], CART[1]); cartera(g, { billetes: Math.min(1, dentro / 3) }); g.restore();
  for (const b of SUELDO) {
    const u = tr(t, b.t0, b.t0 + 0.45); if (u <= 0) continue;
    if (b.n === 50 && SUELDO.indexOf(b) === 5 && t > Tcin - 0.15) continue;
    if (u >= 1) { if (SUELDO.indexOf(b) === 5) { g.save(); g.translate(CART[0] - 30, CART[1] - 170); g.rotate(-0.1); billete(g, 50); g.restore(); } continue; }
    g.save(); g.translate(CART[0] + b.x * (1 - u), mez(-1000, CART[1] - 150, k.entra(u))); g.rotate(b.a * (1 - u) + u * 2 * (1 - u)); billete(g, b.n); g.restore();
  }
  // el tarro, «para ti»
  const brillo = 0.5 * su(tr(t, Tpag - 0.1, Tpri)) * (1 - su(tr(t, Tcob - 0.2, Tcob))) + k.pulso(t, Tcue + 0.1, 0.18);
  g.save(); g.translate(TARRO[0], TARRO[1]); g.scale(0.9, 0.9); tarro(g, t, 0.12 + 0.08 * su(tr(t, Tcue, Tcue + 0.3)), { brillo }); g.restore();
  // el billete de 50 que vuela al tarro
  const w = vuela(t);
  if (t > Tcin - 0.15) {
    const x = mez(CART[0] - 30, TARRO[0], w), y = mez(CART[1] - 170, TARRO[1] - 330, w) - Math.sin(Math.PI * w) * 420;
    const al = 1 - su(tr(t, Tcue, Tcue + 0.25));
    g.save(); g.translate(x, y); g.rotate(-0.1 + Math.sin(Math.PI * w) * 0.6); g.scale(mez(1, 0.7, w), mez(1, 0.7, w)); billete(g, 50, al); g.restore();
    if (w > 0 && w < 1) k.brillo(g, x, y, 500, ORO, 0.5 * Math.sin(Math.PI * w));
  }
  sinVista(g);
  const et = su(tr(t, Tpag - 0.1, Tpag + 0.2)) * (1 - su(tr(t, Fin - 0.5, Fin - 0.2)));
  if (et > 0.01) { g.save(); vista(g, Z, cx, cy); k.etiqueta(g, TARRO[0] - 110, TARRO[1] + 40, "para ti", VERDE, et, 54); g.restore(); sinVista(g); }
  const p = su(tr(t, Tcue - 0.05, Tcue + 0.2)) * (1 - su(tr(t, Fin - 0.5, Fin - 0.2)));
  if (p > 0.01) { const s = 1 + 0.2 * k.pulso(t, Tcue + 0.1, 0.12); g.save(); g.translate(540, 640); g.scale(s, s); k.pastilla(g, 0, 0, "50 €", "al mes", VERDE, p, 120); g.restore(); }
  vineta(g, 0.45);
  velo(g, 0.45, "10,30,30");
}
