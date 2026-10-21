// «¿Sabías que cocinar sin tapa te sube la factura de la luz y del gas?» (hook elegido: la olla vista desde arriba).
// - Fotograma 0: el agua hirviendo llena toda la pantalla, con burbujas que revientan y el vapor viniendo hacia la
//   cámara; la cámara sube y deja ver el borde de la olla, las llamas que lo lamen y la encimera.
// - «factura»: una nube de monedas doradas sale del agua hacia la cámara, girando; «luz y gas»: la llama se dispara.
// - En «Aunque» pasa a la olla de lado (lado.js, la misma olla de toda la historia), que sigue hasta «vapor».
import * as k from "#kit";
import { v } from "#voz";
import { dibuja as lado, momentos as momentosLado } from "../lado.js";
import { moneda, velo, sinVista, brasa } from "../mundo.js";

export const desde = 0;

const { tramo: tr, suave: su, mez, azar, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tfactura = f1.t("factura"), Tluz = f1.t("luz"), Tgas = f1.t("gas");
const CX = 540, CY = 1010;

const az = azar(4242);
const BURB = Array.from({ length: 110 }, () => { const a = az() * 6.2832, r = Math.sqrt(az()) * 0.95; return { a, r, dur: 0.5 + az() * 0.7, ph: az(), tam: 14 + az() * 30 }; });
const VAP = Array.from({ length: 70 }, () => { const a = az() * 6.2832, r = Math.sqrt(az()) * 0.9; return { a, r, dur: 1.0 + az() * 0.8, ph: az(), s: 90 + az() * 100 }; });
const LEN = Array.from({ length: 56 }, (_, i) => ({ a: (i / 56) * 6.2832, f: az() * 10, h: 0.7 + az() * 0.6 }));
const MON = Array.from({ length: 46 }, (_, i) => ({ a: az() * 6.2832, r0: az() * 0.6, v: 520 + az() * 900, giro: 6 + az() * 8, ph: az() * 6.28, r: 52 + az() * 26, t0: Tfactura - 0.14 + Math.pow(i / 46, 0.8) * 0.65 }));

// el radio del borde de la olla en pantalla: empieza desbordando y sube hasta verla entera
const radio = (t) => mez(1250, 440, su(tr(t, 0, 2.05)));

function arriba(g, t) {
  const R = radio(t), flama = 0.8 + 0.6 * su(tr(t, Tluz - 0.1, Tluz + 0.35)) + 0.3 * k.pulso(t, Tgas, 0.12);
  // la encimera de acero oscuro, con el reflejo cálido del fuego
  g.fillStyle = "#0d1013"; g.fillRect(0, 0, 1080, 1920);
  const eg = g.createRadialGradient(CX, CY, R * 0.8, CX, CY, R * 2.4);
  eg.addColorStop(0, "rgba(255,140,60,0.5)"); eg.addColorStop(0.35, "rgba(190,90,40,0.22)"); eg.addColorStop(1, "rgba(20,40,55,0)");
  g.fillStyle = eg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalAlpha = 0.18; g.globalCompositeOperation = "screen"; g.drawImage(k.manchas, -500, -250, 2100, 2500); g.restore();
  // las llamas, que lamen el borde por fuera
  g.save(); g.globalCompositeOperation = "lighter";
  for (const l of LEN) {
    const tiembla = 0.8 + 0.25 * Math.sin(t * 16 + l.f) + 0.12 * Math.sin(t * 27 + l.f * 2), h = (60 + 90 * flama) * l.h * tiembla * (R / 440), w = 30 * (R / 440);
    const c = Math.cos(l.a), s = Math.sin(l.a), x0 = CX + c * R * 0.97, y0 = CY + s * R * 0.97, x1 = CX + c * (R * 0.97 + h), y1 = CY + s * (R * 0.97 + h);
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    gr.addColorStop(0, "rgba(90,140,255,0.95)"); gr.addColorStop(0.4, "rgba(255,170,90,0.7)"); gr.addColorStop(1, "rgba(255,120,40,0)");
    g.fillStyle = gr; g.beginPath(); g.moveTo(x0 - s * w / 2, y0 + c * w / 2); g.lineTo(x1, y1); g.lineTo(x0 + s * w / 2, y0 - c * w / 2); g.closePath(); g.fill();
  }
  g.restore();
  // el agua
  g.save(); g.beginPath(); g.arc(CX, CY, R * 0.94, 0, 6.2832); g.clip();
  const wg = g.createRadialGradient(CX, CY - R * 0.15, R * 0.05, CX, CY, R * 0.95);
  wg.addColorStop(0, "#9be2f6"); wg.addColorStop(0.55, "#3b9fd0"); wg.addColorStop(1, "#134f8a");
  g.fillStyle = wg; g.fillRect(CX - R, CY - R, R * 2, R * 2);
  g.save(); g.translate(CX, CY); g.rotate(t * 0.35); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.4; g.drawImage(k.causticas, -R, -R, R * 2, R * 2); g.rotate(-t * 0.8); g.globalAlpha = 0.25; g.drawImage(k.causticas, -R * 0.9, -R * 0.9, R * 1.8, R * 1.8); g.restore();
  // el calor del borde (la llama se ve a través del cristal)
  const hg = g.createRadialGradient(CX, CY, R * 0.6, CX, CY, R * 0.95); hg.addColorStop(0, "rgba(255,140,60,0)"); hg.addColorStop(1, `rgba(255,140,60,${0.4 * flama})`);
  g.globalCompositeOperation = "lighter"; g.fillStyle = hg; g.fillRect(CX - R, CY - R, R * 2, R * 2); g.globalCompositeOperation = "source-over";
  // las burbujas que revientan: un aro que se abre y se apaga
  for (const b of BURB) {
    const age = (((t / b.dur + b.ph) % 1) + 1) % 1, x = CX + Math.cos(b.a) * b.r * R * 0.94, y = CY + Math.sin(b.a) * b.r * R * 0.94, r = b.tam * (R / 440) * (0.3 + age * 1.4);
    g.strokeStyle = `rgba(240,252,255,${0.85 * (1 - age)})`; g.lineWidth = 3 + 4 * (R / 440) * (1 - age); g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.stroke();
    g.fillStyle = `rgba(255,255,255,${0.2 * (1 - age)})`; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  }
  g.restore();
  // el aro de acero y las asas
  g.save(); g.lineWidth = 0.075 * R; const sg = g.createLinearGradient(CX - R, CY - R, CX + R, CY + R);
  sg.addColorStop(0, "#f3f6fa"); sg.addColorStop(0.35, "#7e8791"); sg.addColorStop(0.65, "#e4e9ef"); sg.addColorStop(1, "#6a727c");
  g.strokeStyle = sg; g.beginPath(); g.arc(CX, CY, R, 0, 6.2832); g.stroke();
  g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 3; g.beginPath(); g.arc(CX, CY, R * 0.94, 0, 6.2832); g.stroke();
  for (const sx of [-1, 1]) { k.redondo(g, sx > 0 ? CX + R * 0.98 : CX - R * 0.98 - 0.4 * R, CY - 0.04 * R, 0.4 * R, 0.09 * R, 0.045 * R); g.fillStyle = "#101214"; g.fill(); }
  g.restore();
  // el vapor, hacia la cámara
  const fuerza = 1 - 0.8 * su(tr(t, 2.9, 3.7));
  g.save(); g.globalCompositeOperation = "lighter";
  for (const p of VAP) {
    const age = (((t / p.dur + p.ph) % 1) + 1) % 1, e = entra(age), x = CX + Math.cos(p.a) * p.r * R * (0.94 + 0.9 * e), y = CY + Math.sin(p.a) * p.r * R * (0.94 + 0.9 * e) - 160 * age, s = p.s * (0.4 + age * 2.0);
    g.globalAlpha = 0.11 * Math.sin(Math.PI * age) * fuerza * Math.min(1, R / 500);
    g.drawImage(NUBE_BLANCA, x - s, y - s, s * 2, s * 2);
  }
  g.restore();
  // las monedas que vienen hacia la cámara
  for (const c of MON) {
    const u = (t - c.t0) / 1.0;
    if (u < 0 || u > 1) continue;
    const r0 = c.r0 * R * 0.7, d = r0 + c.v * u * u * 1.15, x = CX + Math.cos(c.a) * d, y = CY + Math.sin(c.a) * d - 220 * u, e = 0.3 + 3.0 * u * u;
    moneda(g, x, y, c.r * e, c.ph + c.giro * u, Math.min(1, u * 8) * (1 - su(tr(u, 0.85, 1))));
  }
  // fogonazo cálido en «factura»
  k.brillo(g, CX, CY, 1500, "naranja", 0.55 * k.pulso(t, Tfactura, 0.1));
}

const NUBE_BLANCA = (() => {
  const l = k.lienzo(200), c = l.getContext("2d"), a = azar(99);
  for (let i = 0; i < 9; i++) { const x = 100 + (a() - 0.5) * 70, y = 100 + (a() - 0.5) * 60, r = 38 + a() * 34, gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(246,250,255,0.55)"); gr.addColorStop(0.55, "rgba(246,250,255,0.28)"); gr.addColorStop(1, "rgba(246,250,255,0)"); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); }
  return l;
})();

export function dibuja(g, t) {
  if (t < f2.inicio - 0.02) { arriba(g, t); velo(g, 0.8); } else lado(g, t);
}

export const momentos = { ...momentosLado, monedas: Tfactura };
