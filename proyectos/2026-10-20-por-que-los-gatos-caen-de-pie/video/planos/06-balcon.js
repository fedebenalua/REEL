// «Pero caer de pie no es caer bien: desde un balcón, muchos se rompen la barbilla o las patas.»
// Otro sitio: una casa de noche. Se entra con un corte en «Pero».
// - «Pero caer de pie no es caer bien»: el gato, de pie en la barandilla de un balcón iluminado, con la ciudad detrás.
// - «desde un balcón»: resbala y cae; la cámara baja con él junto a las ventanas encendidas, cada vez más deprisa.
// - «se rompen»: llega a la acera de pie, de golpe; se aplasta y la cara da contra el suelo.
// - «la barbilla»: la barbilla se marca en rojo. «o las patas»: las patas, en rojo. Todo se queda quieto y se apaga
//   antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { gato, vuelta, velo, vineta } from "../mundo.js";

export const desde = "pero";

const { suave: su, tramo: tr, mez, azar, lienzo } = k;
const f8 = v.frase(8);
const Tdesde = f8.t("desde"), Trom = f8.t("rompen"), Tbar = f8.t("barbilla"), Tpat = f8.t("patas"), Fin = f8.fin;
export const choca = Trom - 0.02;

// ---------------------------------------------------------------- la fachada: alta, de noche, con ventanas encendidas
const H = 4600, ACERA = 3980, BARANDA = 1180;
const fachada = lienzo(1080, H);
{
  const g = fachada.getContext("2d");
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2b3a6e"); bg.addColorStop(1, "#1a2244");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, H);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; for (let y = 0; y < H; y += 1400) g.drawImage(k.red, 0, y, 1080, 1400); g.restore();
  // ladrillo: líneas suaves
  g.strokeStyle = "rgba(10,15,40,0.25)"; g.lineWidth = 2; for (let y = 0; y < H; y += 46) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  // las ventanas, encendidas y apagadas
  const az = azar(321);
  for (let fila = 0; fila < 9; fila++) for (const x of [70, 760]) {
    const y = 1500 + fila * 300, enc = az() < 0.7;
    g.fillStyle = "#0d1228"; g.fillRect(x - 12, y - 12, 274, 214);
    const vg = g.createLinearGradient(0, y, 0, y + 190);
    if (enc) { vg.addColorStop(0, "#ffd98a"); vg.addColorStop(1, "#ff9d4a"); } else { vg.addColorStop(0, "#1f2a52"); vg.addColorStop(1, "#141b38"); }
    g.fillStyle = vg; g.fillRect(x, y, 250, 190);
    g.fillStyle = "#0d1228"; g.fillRect(x + 120, y, 10, 190);
    if (enc) k.brillo(g, x + 125, y + 95, 420, "255,190,100", 0.35);
  }
  // el balcón de arriba: su puerta encendida y la barandilla
  g.fillStyle = "#ffcf7a"; g.fillRect(310, 520, 460, 660);
  k.brillo(g, 540, 850, 1000, "255,190,110", 0.6);
  g.fillStyle = "#0d1228"; g.fillRect(530, 520, 20, 660);
  g.fillStyle = "#3a4470"; g.fillRect(120, BARANDA + 10, 840, 50);
  g.fillStyle = "#5a6698"; g.fillRect(120, BARANDA, 840, 16);
  g.fillStyle = "#4a5588"; for (let x = 140; x <= 940; x += 40) g.fillRect(x, BARANDA, 10, 260);
  g.fillStyle = "#2a3260"; g.fillRect(100, BARANDA + 250, 880, 60);
  // la acera y la farola
  const sg = g.createLinearGradient(0, ACERA, 0, H); sg.addColorStop(0, "#5a5f78"); sg.addColorStop(1, "#2a2d3e");
  g.fillStyle = sg; g.fillRect(0, ACERA, 1080, H - ACERA);
  g.strokeStyle = "rgba(20,22,35,0.6)"; g.lineWidth = 4; for (let x = -200; x < 1300; x += 180) { g.beginPath(); g.moveTo(x, ACERA); g.lineTo(x - 120, H); g.stroke(); }
  k.brillo(g, 900, ACERA - 300, 1200, "255,170,80", 0.45);
}

const YS_FIN = ACERA - 1430;
const camY = (t) => t < Tdesde ? 0 : t < choca ? YS_FIN * Math.pow(tr(t, Tdesde, choca), 1.8) : YS_FIN;

export function dibuja(g, t) {
  const ys = camY(t);
  // al principio la cámara se acerca despacio al balcón; al caer vuelve a su sitio
  const acerca = 0.1 * su(tr(t, f8.inicio, Tdesde)) * (1 - su(tr(t, Tdesde, Tdesde + 0.5)));
  g.save(); g.translate(540, 1000); g.scale(1 + acerca, 1 + acerca); g.translate(-540, -1000);
  const vel = t > Tdesde && t < choca ? YS_FIN * 1.8 * Math.pow(tr(t, Tdesde, choca), 0.8) / (choca - Tdesde) : 0;
  const pasos = Math.min(6, Math.ceil(vel / 900));
  if (pasos <= 1) g.drawImage(fachada, 0, ys, 1080, 1920, 0, 0, 1080, 1920);
  else for (let i = 0; i < pasos; i++) { g.globalAlpha = i === 0 ? 1 : 0.45; g.drawImage(fachada, 0, ys - (i / pasos) * vel * 0.025, 1080, 1920, 0, 0, 1080, 1920); }
  g.globalAlpha = 1;
  // el gato
  const esc = 320, pata = 0.98 * esc;
  let y, ang = 0, apl = 0;
  if (t < Tdesde) y = BARANDA - pata;
  else if (t < choca) y = mez(BARANDA - pata, 1430 - pata, su(tr(t, Tdesde + 0.5, choca)));
  else y = 1430 - pata + 18;
  if (t < Tdesde) ang = 0.12 * su(tr(t, f8.t("bien") - 0.3, Tdesde - 0.1)); // se asoma
  if (t >= Tdesde && t < Tdesde + 0.4) ang = 0.12 + 0.2 * Math.sin(Math.PI * tr(t, Tdesde, Tdesde + 0.4)); // resbala
  if (t >= choca) { apl = k.pulso(t, choca + 0.06, 0.1); ang = 0.3 * k.pulso(t, choca + 0.08, 0.12); }
  const r = gato(g, { x: 520, y, esc, ang, t, ...vuelta(1), aplasta: apl, patalea: 0 });
  g.restore();
  // el golpe: polvo y un destello
  const w = t - choca;
  if (w > 0 && w < 0.8) {
    const az = azar(99);
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, 560, 1440, 700, "255,240,220", 0.5 * Math.exp(-w * 8));
    for (let i = 0; i < 22; i++) { const d = az() < 0.5 ? -1 : 1, x = 560 + d * (80 + az() * 420) * w, yy = 1430 - (30 + az() * 80) * w + 160 * w * w, rr = 20 + az() * 30 + 50 * w; const gr = g.createRadialGradient(x, yy, 0, x, yy, rr); gr.addColorStop(0, `rgba(200,205,230,${0.25 * Math.max(0, 1 - w * 1.4)})`); gr.addColorStop(1, "rgba(200,205,230,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, yy, rr, 0, 6.2832); g.fill(); }
    g.restore();
  }
  // la barbilla y las patas, en rojo (se apagan antes del corte)
  const apaga = 1 - su(tr(t, Fin - 0.35, Fin - 0.05));
  const rb = su(tr(t, Tbar - 0.1, Tbar + 0.2)) * apaga, rp = su(tr(t, Tpat - 0.1, Tpat + 0.2)) * apaga;
  g.save(); g.globalCompositeOperation = "lighter";
  if (rb > 0.01) k.brillo(g, r.cabeza[0] + r.radio * 0.45, r.cabeza[1] + r.radio * 0.75, 460, "255,30,40", 1.2 * rb);
  if (rp > 0.01) for (const dx of [-0.62, 0.6]) k.brillo(g, 520 + dx * esc, 1420, 420, "255,30,40", 1.2 * rp);
  g.restore();
  vineta(g, 0.5);
  velo(g, 0.5);
}

export const momentos = { cae: Tdesde, choca };
