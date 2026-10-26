// «En un depósito de cincuenta litros, son diez euros cada vez que llenas.»
// El depósito del coche, abierto, de cristal. Se entra con un corte en «En».
// - «En un depósito de cincuenta litros»: la gasolina dorada cae por el tubo y lo llena; la cuenta llega a 50 litros.
// - «son diez euros»: un billete de 10 € sale disparado del depósito hacia la cámara.
// - «cada vez que llenas»: le siguen otros dos, uno detrás de otro. Se van antes del corte y reposa.
import * as k from "#kit";
import { v } from "#voz";
import { bokeh, billete, velo, AMBAR } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f3 = v.frase(3);
const T0 = f3.inicio, Tlit = f3.t("litros"), Tdiez = f3.t("diez"), Tcada = f3.t("cada"), Tlle = f3.t("llenas"), Fin = f3.fin;
const Tlleno = Tlit + 0.45;
const SALEN = [Tdiez - 0.05, Tcada + 0.05, Tlle - 0.05];
export const momentos = { lleno: Tlleno, billetes: SALEN };

const CX = 540, CY = 1130, W = 880, H = 540;
function forma(g) {
  g.beginPath();
  g.moveTo(CX - W / 2 + 90, CY - H / 2);
  g.lineTo(CX + W / 2 - 160, CY - H / 2);
  g.quadraticCurveTo(CX + W / 2 - 60, CY - H / 2 - 10, CX + W / 2, CY - H / 2 + 110);
  g.lineTo(CX + W / 2, CY + H / 2 - 90);
  g.quadraticCurveTo(CX + W / 2, CY + H / 2, CX + W / 2 - 90, CY + H / 2);
  g.lineTo(CX - W / 2 + 90, CY + H / 2);
  g.quadraticCurveTo(CX - W / 2, CY + H / 2, CX - W / 2, CY + H / 2 - 90);
  g.lineTo(CX - W / 2, CY - H / 2 + 60);
  g.quadraticCurveTo(CX - W / 2, CY - H / 2, CX - W / 2 + 90, CY - H / 2);
  g.closePath();
}
const azB = azar(31);
const BURBUJAS = Array.from({ length: 50 }, () => ({ x: CX - W / 2 + 40 + azB() * (W - 80), f: azB(), v: 120 + azB() * 200, r: 3 + azB() * 9 }));
const NX = CX + 300, NY = CY - H / 2; // la boca del tubo

export function dibuja(g, t) {
  // el fondo: un taller de noche, cálido y desenfocado
  const bg = g.createRadialGradient(540, 1100, 100, 540, 1100, 1300); bg.addColorStop(0, "#2b1d3c"); bg.addColorStop(1, "#07060d");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  bokeh(g, t, 0.8);
  // el balanceo suave del depósito
  const ang = 0.015 * Math.sin(t * 1.3);
  g.save(); g.translate(CX, CY); g.rotate(ang); g.translate(-CX, -CY);
  // el tubo de llenado y la pistola
  g.lineCap = "round";
  const BX = NX + 40, BY = NY - 150; // la boca del tubo, arriba
  g.strokeStyle = "#2c2f3a"; g.lineWidth = 96; g.beginPath(); g.moveTo(NX, NY + 20); g.quadraticCurveTo(NX, NY - 90, BX, BY); g.stroke();
  g.strokeStyle = "#8c93a6"; g.lineWidth = 74; g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 14; g.beginPath(); g.moveTo(NX - 24, NY + 10); g.quadraticCurveTo(NX - 24, NY - 90, BX - 22, BY); g.stroke();
  // la pistola, metida en la boca del tubo: el caño de metal, el cuerpo con su gatillo y la manguera
  g.save(); g.translate(BX, BY); g.rotate(0.75);
  g.fillStyle = "#c9ced6"; k.redondo(g, -14, -10, 28, 120, 10); g.fill();
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 30;
  g.fillStyle = "#1d2029"; g.beginPath(); g.moveTo(-40, -20); g.lineTo(40, -20); g.lineTo(60, -150); g.quadraticCurveTo(60, -230, 0, -240); g.lineTo(-30, -240); g.quadraticCurveTo(-60, -200, -50, -120); g.closePath(); g.fill(); g.restore();
  g.fillStyle = "#2fd2b0"; k.redondo(g, -46, -230, 100, 70, 24); g.fill();
  g.strokeStyle = "#3a3f4d"; g.lineWidth = 12; g.beginPath(); g.moveTo(-50, -70); g.quadraticCurveTo(-120, -90, -110, -170); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 6; g.beginPath(); g.moveTo(38, -40); g.lineTo(52, -150); g.stroke();
  g.strokeStyle = "#111"; g.lineWidth = 40; g.beginPath(); g.moveTo(0, -235); g.quadraticCurveTo(10, -420, 160, -520); g.stroke();
  g.restore();
  // la gasolina que cae por dentro hasta el fondo, mientras se llena
  const llena = su(tr(t, T0 + 0.1, Tlleno));
  const cae = t < Tlleno + 0.15 ? 1 : 1 - su(tr(t, Tlleno + 0.15, Tlleno + 0.4));
  // el depósito: el cristal oscuro por dentro
  g.save(); forma(g); g.fillStyle = "rgba(20,24,40,0.85)"; g.fill(); g.clip();
  // la gasolina: sube con su superficie que ondula
  const nivel = CY + H / 2 - (H * 0.9) * mez(0.05, 1, llena);
  const gg = g.createLinearGradient(0, nivel, 0, CY + H / 2); gg.addColorStop(0, "#ffd36a"); gg.addColorStop(0.3, "#f2a531"); gg.addColorStop(1, "#a85a12");
  g.fillStyle = gg; g.beginPath(); g.moveTo(CX - W, CY + H);
  for (let x = CX - W / 2 - 10; x <= CX + W / 2 + 10; x += 20) g.lineTo(x, nivel + Math.sin(x * 0.02 + t * 6) * 9 * (0.3 + cae));
  g.lineTo(CX + W, CY + H); g.closePath(); g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.manchas, CX - W / 2, nivel, W, CY + H / 2 - nivel); g.restore();
  // la línea brillante de la superficie
  g.strokeStyle = "rgba(255,240,190,0.8)"; g.lineWidth = 5; g.beginPath();
  for (let x = CX - W / 2 - 10; x <= CX + W / 2 + 10; x += 20) { const y = nivel + Math.sin(x * 0.02 + t * 6) * 9 * (0.3 + cae); x === CX - W / 2 - 10 ? g.moveTo(x, y) : g.lineTo(x, y); }
  g.stroke();
  // el chorro que cae desde la boca
  if (cae > 0.01) {
    const cg = g.createLinearGradient(NX - 30, 0, NX + 30, 0); cg.addColorStop(0, "rgba(242,165,49,0)"); cg.addColorStop(0.5, `rgba(255,214,110,${0.95 * cae})`); cg.addColorStop(1, "rgba(242,165,49,0)");
    g.fillStyle = cg; g.fillRect(NX - 34 * cae, NY - 10, 68 * cae, nivel - NY + 20);
    k.brillo(g, NX, nivel, 260, AMBAR, 0.6 * cae);
  }
  // las burbujas
  for (const b of BURBUJAS) {
    const y = CY + H / 2 - ((b.f * 600 + t * b.v) % 600);
    if (y < nivel + 10) continue;
    g.strokeStyle = "rgba(255,240,200,0.5)"; g.lineWidth = 2; g.beginPath(); g.arc(b.x + Math.sin(t * 3 + b.f * 9) * 6, y, b.r, 0, 6.2832); g.stroke();
  }
  g.restore();
  // el cristal: borde, brillo y reflejo
  forma(g); g.strokeStyle = "rgba(200,220,255,0.6)"; g.lineWidth = 8; g.stroke();
  g.save(); forma(g); g.clip(); g.globalCompositeOperation = "screen";
  const rg = g.createLinearGradient(CX - W / 2, CY - H / 2, CX + W / 2, CY + H / 2); rg.addColorStop(0.15, "rgba(255,255,255,0)"); rg.addColorStop(0.22, "rgba(255,255,255,0.2)"); rg.addColorStop(0.3, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(CX - W / 2, CY - H / 2, W, H); g.restore();
  g.restore();
  // la cuenta de litros
  const n = Math.round(50 * llena), cuenta = 1 - su(tr(t, Tdiez - 0.3, Tdiez));
  k.pastilla(g, 540, 1560, `${n}`, "litros", AMBAR, cuenta, 110);
  // los billetes: salen del depósito, giran y vuelan hacia la cámara
  SALEN.forEach((t0, i) => {
    const u = tr(t, t0, t0 + 0.75);
    if (u <= 0 || u >= 1) return;
    const e = k.entra(u);
    const x = mez(CX - 80 + i * 80, [-60, 1140, 540][i], e), y = mez(CY - 120, [1500, 1420, 1780][i], e) - 260 * Math.sin(u * Math.PI);
    const esc = mez(0.3, 1.5, e);
    billete(g, x, y, esc, [-0.35, 0.3, -0.1][i] + u * [1.2, -1, 0.8][i], 0.3 * Math.sin(u * 6 + i), 1 - su(tr(u, 0.75, 1)));
  });
  k.brillo(g, CX, CY - 60, 1200, "255,120,80", 0.35 * k.pulso(t, Tdiez + 0.05, 0.15));
  velo(g, 0.5);
}
