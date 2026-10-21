// «Envíaselo a ese amigo que deja la ventana abierta con el gato en casa.»
// Otro sitio: el salón de noche. Se entra con un corte en «Envíaselo».
// - El gato, de pie en el alféizar de una ventana abierta, mirando fuera; detrás, la ciudad de noche y la luna.
// - «la ventana abierta»: entra una ráfaga: las cortinas se hinchan hacia dentro y la hoja abierta se balancea.
// - La cámara se acerca despacio hasta el final.
import * as k from "#kit";
import { v } from "#voz";
import { gato, vuelta, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f10 = v.frase(10);
const T0 = f10.inicio, Tven = f10.t("ventana"), Fin = v.fin ? v.fin : f10.fin + 0.8;
const VX = 150, VY = 520, VW = 780, VH = 900, ALF = VY + VH;

const azC = azar(515);
const CIUDAD = Array.from({ length: 70 }, () => ({ x: azC(), w: 0.03 + azC() * 0.06, h: 0.15 + azC() * 0.45 }));
const VENT = Array.from({ length: 140 }, () => ({ x: azC(), y: azC(), on: azC() < 0.55 }));

function exterior(g, t) {
  const cg = g.createLinearGradient(0, VY, 0, ALF); cg.addColorStop(0, "#0c1a48"); cg.addColorStop(0.7, "#2a3a80"); cg.addColorStop(1, "#7a4a88");
  g.fillStyle = cg; g.fillRect(VX, VY, VW, VH);
  // la luna
  k.brillo(g, VX + VW * 0.75, VY + 190, 420, "220,230,255", 0.6);
  g.fillStyle = "#f4f2e6"; g.beginPath(); g.arc(VX + VW * 0.75, VY + 190, 58, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(180,180,200,0.4)"; g.beginPath(); g.arc(VX + VW * 0.75 - 18, VY + 175, 12, 0, 6.2832); g.arc(VX + VW * 0.75 + 20, VY + 205, 9, 0, 6.2832); g.fill();
  // los edificios con sus ventanas
  for (const e of CIUDAD) {
    const x = VX + e.x * VW, w = e.w * VW, h = e.h * VH * 0.8, y = ALF - h;
    g.fillStyle = "#121a3a"; g.fillRect(x, y, w, h);
  }
  for (const w of VENT) { if (!w.on) continue; const x = VX + w.x * VW, y = ALF - 30 - w.y * VH * 0.4; g.fillStyle = "rgba(255,210,120,0.8)"; g.fillRect(x, y, 7, 9); }
}

export function dibuja(g, t) {
  const acerca = 1 + 0.07 * su(tr(t, T0, f10.fin + 0.5));
  g.save(); g.translate(540, 1000); g.scale(acerca, acerca); g.translate(-540, -1000);
  // la pared del salón de noche
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#3a2440"); bg.addColorStop(1, "#1c1020");
  g.fillStyle = bg; g.fillRect(-100, -100, 1280, 2120);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.manchas, -100, -100, 1280, 2120); g.restore();
  k.brillo(g, 120, 1500, 900, "255,170,100", 0.35);
  exterior(g, t);
  // la ráfaga
  const rafaga = su(tr(t, Tven - 0.2, Tven + 0.4)) * (1 - 0.6 * su(tr(t, Tven + 0.9, f10.fin + 0.4)));
  // la hoja abierta: un marco con cristal que se balancea
  const abre = 0.55 + 0.25 * rafaga * Math.sin((t - Tven) * 5) * Math.exp(-Math.max(0, t - Tven) * 1.2);
  const hw = VW / 2 * Math.cos(abre);
  g.save();
  g.fillStyle = "rgba(170,200,255,0.12)"; g.fillRect(VX + VW - hw, VY, hw, VH);
  g.strokeStyle = "#f2e6d8"; g.lineWidth = 18; g.strokeRect(VX + VW - hw, VY, hw, VH);
  g.restore();
  // el marco
  g.fillStyle = "#f6ece0"; g.fillRect(VX - 30, VY - 30, VW + 60, 30); g.fillRect(VX - 30, VY, 30, VH); g.fillRect(VX + VW, VY, 30, VH);
  // el alféizar
  const ag = g.createLinearGradient(0, ALF, 0, ALF + 60); ag.addColorStop(0, "#fff7ee"); ag.addColorStop(1, "#b8a898");
  g.fillStyle = ag; g.fillRect(VX - 70, ALF, VW + 140, 50);
  g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(VX - 70, ALF + 50, VW + 140, 30);
  // el gato en el alféizar, mirando fuera
  const esc = 270;
  gato(g, { x: 430, y: ALF - 0.98 * esc, esc, ang: 0, t, ...vuelta(1), patalea: 0 });
  // las cortinas, que se hinchan con la ráfaga
  for (const [x0, d] of [[VX - 150, 1], [VX + VW + 150, -1]]) {
    const hin = 60 + 180 * rafaga;
    g.save();
    const cg = g.createLinearGradient(x0, 0, x0 + d * (130 + hin), 0); cg.addColorStop(0, "#9c2238"); cg.addColorStop(0.5, "#e35a6e"); cg.addColorStop(1, "#b8324a");
    g.fillStyle = cg;
    g.beginPath(); g.moveTo(x0, VY - 120);
    g.lineTo(x0 + d * 120, VY - 120);
    for (let i = 0; i <= 10; i++) { const u = i / 10, y = VY - 120 + u * (VH + 300); g.lineTo(x0 + d * (120 + hin * Math.sin(Math.PI * u) * (0.8 + 0.2 * Math.sin(t * 3 + u * 5))), y); }
    g.lineTo(x0, VY + VH + 180); g.closePath(); g.fill();
    g.fillStyle = "rgba(0,0,0,0.18)"; for (let i = 1; i < 4; i++) g.fillRect(Math.min(x0, x0 + d * i * 30), VY - 120, 6, VH + 300);
    g.restore();
  }
  g.restore();
  vineta(g, 0.5);
  velo(g, 0.45);
}
