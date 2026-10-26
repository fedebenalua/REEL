// «Es como intentar crecer bebiendo solo agua del grifo.»
// Otro sitio: una cocina con azulejos y luz de ventana. Se entra con un corte en «Es».
// - «Es como intentar crecer»: un grifo de metal echa agua en un vaso alto con una pajita; el vaso se va llenando.
// - «bebiendo»: la pajita sorbe (sube el agua por ella) y el nivel baja deprisa.
// - «solo agua del grifo»: el grifo lo vuelve a llenar; en «grifo», el chorro se corta y el agua se calma antes del
//   corte.
import * as k from "#kit";
import { v } from "#voz";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f4 = v.frase(4);
const T0 = f4.inicio, Tbeb = f4.t("bebiendo"), Tsolo = f4.t("solo"), Tgri = f4.t("grifo"), Fin = f4.fin;
const cierra = Tgri + 0.15;

// los azulejos, una vez
const azulejos = (() => {
  const l = k.lienzo(1080, 1920), c = l.getContext("2d"), az = azar(31);
  const bg = c.createLinearGradient(0, 0, 1080, 1920); bg.addColorStop(0, "#2a6f9a"); bg.addColorStop(1, "#0f3a5a");
  c.fillStyle = bg; c.fillRect(0, 0, 1080, 1920);
  const T = 180;
  for (let j = 0; j < 12; j++) for (let i = 0; i < 7; i++) {
    const x = i * T, y = j * T, b = az();
    const tg = c.createLinearGradient(x, y, x + T, y + T);
    tg.addColorStop(0, `rgba(255,255,255,${0.16 + b * 0.08})`); tg.addColorStop(0.5, "rgba(255,255,255,0.04)"); tg.addColorStop(1, "rgba(0,0,0,0.12)");
    c.fillStyle = tg; c.fillRect(x + 4, y + 4, T - 8, T - 8);
    c.fillStyle = "rgba(255,255,255,0.12)"; c.fillRect(x + 10, y + 10, T * 0.5, 6);
  }
  c.fillStyle = "rgba(230,240,245,0.55)";
  for (let i = 0; i <= 7; i++) c.fillRect(i * T - 3, 0, 6, 1920);
  for (let j = 0; j <= 12; j++) c.fillRect(0, j * T - 3, 1080, 6);
  return l;
})();
const azB = azar(77);
const BURBUJAS = Array.from({ length: 40 }, () => ({ x: (azB() - 0.5) * 150, f: azB(), r: 3 + azB() * 7, v: 0.6 + azB() * 0.8 }));

// el nivel del vaso (0 vacío, 1 lleno)
function nivel(t) {
  const llena = mez(0.2, 0.75, su(tr(t, T0, Tbeb)));
  const sorbe = su(tr(t, Tbeb, Tbeb + 0.55));
  const rellena = su(tr(t, Tbeb + 0.55, cierra + 0.1));
  return llena - 0.5 * sorbe + 0.62 * rellena;
}

export function dibuja(g, t) {
  // la pared
  const z = 1.3 + 0.06 * su(tr(t, T0, Fin));
  g.save(); g.translate(540, 1040); g.scale(z, z); g.translate(-540, -1060);
  g.drawImage(azulejos, 0, 0);
  // la luz de la ventana
  k.brillo(g, 160, 500, 1600, "255,225,170", 0.55);
  // la encimera
  const ey = 1380;
  const eg = g.createLinearGradient(0, ey, 0, 1920); eg.addColorStop(0, "#f0c08a"); eg.addColorStop(0.08, "#c98a4a"); eg.addColorStop(1, "#5a3418");
  g.fillStyle = eg; g.fillRect(-100, ey, 1300, 700);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45; g.drawImage(k.red, -100, ey, 1300, 600); g.restore();
  g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(-100, ey, 1300, 5);
  // el grifo: sale de la pared por la derecha y se curva sobre el vaso
  const GX = 540, top = 560;
  g.save();
  g.lineCap = "round";
  const tubo = (w, col) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(1150, 720); g.lineTo(820, 720); g.quadraticCurveTo(GX, 720, GX, top + 100); g.stroke(); };
  tubo(98, "#5c626a"); tubo(84, "#aeb5bf"); tubo(54, "#e6eaef"); tubo(16, "#ffffff");
  g.restore();
  g.beginPath(); k.redondo(g, GX - 62, top + 92, 124, 70, 18);
  k.metal(g, GX - 62, GX + 62);
  // la manilla
  const gira = 0.6 * (1 - su(tr(t, cierra - 0.1, cierra + 0.25)));
  g.save(); g.translate(930, 640); g.rotate(-gira);
  g.beginPath(); k.redondo(g, -26, -150, 52, 160, 26); k.metal(g, -26, 26);
  g.restore();
  g.beginPath(); g.ellipse(930, 650, 60, 34, 0, 0, 6.2832); k.metal(g, 870, 990);
  // el vaso
  const VX = 540, VB = 1460, VH = 600, VW0 = 300, VW1 = 360;
  const vaso = () => { g.beginPath(); g.moveTo(VX - VW1 / 2, VB - VH); g.lineTo(VX - VW0 / 2, VB); g.lineTo(VX + VW0 / 2, VB); g.lineTo(VX + VW1 / 2, VB - VH); };
  const n = Math.max(0.03, Math.min(0.97, nivel(t))), yN = VB - VH * n;
  // el agua de dentro
  g.save(); vaso(); g.closePath(); g.clip();
  const ag = g.createLinearGradient(VX - VW1 / 2, 0, VX + VW1 / 2, 0);
  ag.addColorStop(0, "rgba(90,180,240,0.55)"); ag.addColorStop(0.5, "rgba(170,225,255,0.35)"); ag.addColorStop(1, "rgba(60,140,210,0.6)");
  const ola = (1 - su(tr(t, cierra, cierra + 0.6))) * 1;
  g.beginPath(); g.moveTo(VX - 260, VB + 20);
  for (let x = -200; x <= 200; x += 20) g.lineTo(VX + x, yN + Math.sin(t * 9 + x * 0.05) * 7 * ola);
  g.lineTo(VX + 260, VB + 20); g.closePath(); g.fillStyle = ag; g.fill();
  g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(VX - 200, yN - 3, 400, 5);
  // burbujas mientras cae el chorro
  for (const b of BURBUJAS) {
    const u = ((t * b.v + b.f) % 1), y = VB - u * (VB - yN), al = ola * (1 - u);
    if (al < 0.02) continue;
    g.strokeStyle = `rgba(255,255,255,${0.6 * al})`; g.lineWidth = 2; g.beginPath(); g.arc(VX + b.x, y, b.r, 0, 6.2832); g.stroke();
  }
  g.restore();
  // la pajita: roja y blanca, inclinada; cuando sorbe, el agua sube por ella
  const PX0 = VX - 30, PY0 = VB - 30, PX1 = VX - 215, PY1 = VB - VH - 170;
  g.save(); g.lineCap = "round";
  g.strokeStyle = "#ffffff"; g.lineWidth = 34; g.beginPath(); g.moveTo(PX0, PY0); g.lineTo(PX1, PY1); g.stroke();
  g.setLineDash([46, 46]); g.strokeStyle = "#e8324a"; g.stroke(); g.setLineDash([]);
  const sube = k.pulso(t, Tbeb + 0.28, 0.32);
  if (sube > 0.02) { g.strokeStyle = `rgba(90,180,255,${0.85 * sube})`; g.lineWidth = 20; g.beginPath(); g.moveTo(PX0, PY0); g.lineTo(mez(PX0, PX1, sube), mez(PY0, PY1, sube)); g.stroke(); }
  g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = 6; g.beginPath(); g.moveTo(PX0 - 10, PY0); g.lineTo(PX1 - 10, PY1); g.stroke();
  g.restore();
  // el cristal
  vaso(); k.vidrio(g, VX - VW1 / 2, VX + VW1 / 2, 0.6);
  g.beginPath(); g.ellipse(VX, VB - VH, VW1 / 2, 18, 0, 0, 6.2832); g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 4; g.stroke();
  k.reflejo(g, VX - VW1 / 2 + 34, VB - VH + 60, 22, VH - 120, 0.35);
  // el chorro: del grifo al agua; en «grifo» se corta y lo último cae
  const corta = tr(t, cierra, cierra + 0.35);
  const yTop = top + 160 + corta * (yN - top - 160), yBot = yN;
  if (yBot - yTop > 4) {
    const cg = g.createLinearGradient(GX - 24, 0, GX + 24, 0);
    cg.addColorStop(0, "rgba(120,200,255,0.5)"); cg.addColorStop(0.4, "rgba(230,248,255,0.9)"); cg.addColorStop(1, "rgba(80,160,230,0.55)");
    g.fillStyle = cg;
    g.beginPath(); g.moveTo(GX - 20, yTop);
    for (let y = yTop; y <= yBot; y += 20) g.lineTo(GX - 18 + Math.sin(y * 0.05 + t * 20) * 3, y);
    for (let y = yBot; y >= yTop; y -= 20) g.lineTo(GX + 18 + Math.sin(y * 0.05 + t * 20 + 1) * 3, y);
    g.closePath(); g.fill();
    k.brillo(g, GX, yN, 220, "200,235,255", 0.6 * ola);
  }
  // la sombra del vaso en la encimera
  g.fillStyle = "rgba(0,0,0,0.25)"; g.beginPath(); g.ellipse(VX + 40, VB + 8, 220, 22, 0, 0, 6.2832); g.fill();
  g.restore();
  // un velo arriba, para el subtítulo
  const vg = g.createLinearGradient(0, 160, 0, 700); vg.addColorStop(0, "rgba(5,20,35,0.6)"); vg.addColorStop(1, "rgba(5,20,35,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700);
}

export const momentos = { sorbe: Tbeb, cierra };
