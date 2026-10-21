// «El cuarto, tu banco: algunos cobran hasta veinte euros al mes por la cuenta, y hay cuentas gratis.»
// Una tarjeta enorme de la que se escapa una moneda cada poco. En «cuentas gratis» la tarjeta da la vuelta, pasa a
// verde y ya no sale nada.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, fondo, velo, COL, moneda } from "../mundo.js";

const F = v.frase(6);
export const desde = F.inicio;

const Tcobran = F.t("cobran"), Tveinte = F.t("veinte"), Tcuentas = F.t("cuentas"), Tgratis = F.t("gratis");
const { tramo: tr, suave: su, entra, redondo, azar, pulso } = k;
const AC = COL.banco;
const CY = 930, CW = 820, CH = 510;

const cam = camino2D([[F.inicio, [1.25, 540, 1000]], [Tcobran - 0.15, [1.08, 540, 1050]], [Tcuentas - 0.2, [1.08, 540, 1050]], [F.fin - 0.3, [1.14, 540, 1010]]]);

// cuándo se va cada moneda: una cada ~0.4 s hasta «y hay cuentas»
const TM = []; for (let t = F.inicio + 0.15; t < Tcuentas - 0.3; t += 0.22) TM.push(t);
const GRAV = 4000;
const estado = (i) => { const az = azar(900 + i * 13); return { x0: 540 + (az() - 0.5) * 460, vx: (az() - 0.5) * 420, vy: -520 - az() * 160 }; };

function tarjeta(g, t, flip, jolt) {
  const ang = flip * Math.PI, sx = Math.cos(ang), verde = flip > 0.5;
  g.save();
  g.translate(540, CY); g.rotate(-0.09);
  g.scale(Math.max(0.02, Math.abs(sx)) * (1 + jolt * 0.035), 1 + jolt * 0.035);
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60; g.shadowOffsetY = 30;
  redondo(g, -CW / 2, -CH / 2, CW, CH, 48);
  const gr = g.createLinearGradient(-CW / 2, -CH / 2, CW / 2, CH / 2);
  if (!verde) { gr.addColorStop(0, "#2a3558"); gr.addColorStop(0.55, "#141b34"); gr.addColorStop(1, "#0a0f20"); }
  else { gr.addColorStop(0, "#52e08a"); gr.addColorStop(0.55, "#12a05a"); gr.addColorStop(1, "#0a6a3c"); }
  g.fillStyle = gr; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.save(); redondo(g, -CW / 2, -CH / 2, CW, CH, 48); g.clip();
  // franja de color y brillos
  g.beginPath(); g.moveTo(-CW / 2, 140); g.lineTo(CW / 2, 20); g.lineTo(CW / 2, 120); g.lineTo(-CW / 2, 250); g.closePath();
  g.fillStyle = verde ? "rgba(255,255,255,0.18)" : `rgba(${AC},0.88)`; g.fill();
  const sg = g.createLinearGradient(-CW / 2, -CH / 2, CW / 2, CH / 2); sg.addColorStop(0, "rgba(255,255,255,0.28)"); sg.addColorStop(0.35, "rgba(255,255,255,0.02)"); sg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = sg; g.fillRect(-CW / 2, -CH / 2, CW, CH);
  g.restore();
  // chip
  redondo(g, -330, -110, 118, 92, 18);
  const cg = g.createLinearGradient(-330, -110, -212, -18); cg.addColorStop(0, "#fff0b0"); cg.addColorStop(0.5, "#e0b248"); cg.addColorStop(1, "#a97a1a"); g.fillStyle = cg; g.fill();
  g.strokeStyle = "rgba(120,80,10,0.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-330, -64); g.lineTo(-212, -64); g.moveTo(-271, -110); g.lineTo(-271, -18); g.stroke();
  // sin contacto
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 6; g.lineCap = "round";
  for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(-150, -64, 12 * i + 6, -0.8, 0.8); g.stroke(); }
  // número y texto
  g.fillStyle = "rgba(255,255,255,0.92)"; g.font = "800 58px Figtree"; g.textAlign = "left"; g.textBaseline = "alphabetic";
  g.fillText(verde ? "0 € de comisión" : "•••• •••• •••• 4821", -340, 100);
  g.font = "700 36px Figtree"; g.fillStyle = "rgba(255,255,255,0.7)"; g.fillText(verde ? "CUENTA SIN COMISIONES" : "CUENTA", -340, -160);
  g.restore();
}

export function dibuja(g, t) {
  fondo(g, AC, 1.6, 1000);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // cada moneda que se va: sale de detrás de la tarjeta por abajo y cae
  const monedas = TM.map((tm, i) => ({ tm, i, u: t - tm })).filter((c) => c.u >= 0 && c.u < 1.6);
  const jolt = TM.reduce((s, tm) => s + pulso(t, tm + 0.05, 0.07), 0);
  const flip = su(tr(t, Tcuentas - 0.08, Tgratis + 0.1));
  const dibujaMoneda = (c) => {
    const e = estado(c.i), u = c.u;
    const x = e.x0 + e.vx * u, y = CY + 170 + e.vy * u + 0.5 * GRAV * u * u;
    k.brillo(g, x, y, 190, AC, 0.35);
    moneda(g, x, y, 62 * (1 + 0.75 * u), azar(c.i + 40)() * 6.28 + u * 11);
  };
  for (const c of monedas) if (c.u < 0.12) dibujaMoneda(c);
  tarjeta(g, t, flip, jolt);
  for (const c of monedas) if (c.u >= 0.12) dibujaMoneda(c);
  // un aro naranja en el borde de abajo cada vez que se va una
  for (const tm of TM) { const u = t - tm; if (u > 0 && u < 0.35) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${AC},${0.7 * (1 - u / 0.35)})`; g.lineWidth = 10; g.beginPath(); g.ellipse(540, CY + 250, 230 + 220 * u, 24 + 40 * u, -0.09, 0, 6.2832); g.stroke(); g.restore(); } }
  sinVista(g);
  velo(g, 0.62);
  const a = su(tr(t, Tveinte - 0.08, Tveinte + 0.2)) * (1 - su(tr(t, Tcuentas - 0.1, Tcuentas + 0.15)));
  k.pastilla(g, 540, 640, "−20", "€ al mes", "255,200,140", a, 100);
  const b = su(tr(t, Tgratis - 0.08, Tgratis + 0.2));
  k.pastilla(g, 540, 640, "0", "€ al mes", "150,255,150", b, 100);
}
