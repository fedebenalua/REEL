// «Y no lo aprenden: con cinco semanas, cualquier gatito ya lo hace.»
// Otro sitio: un cuarto cálido con un cojín enorme. Se entra con un corte en «Y».
// - «Y no lo aprenden»: un gatito (cabeza grande, patas cortas) cae boca arriba, despacio, sobre el cojín.
// - «con cinco semanas»: llega «5 semanas», grande, y se queda.
// - «cualquier gatito ya lo hace»: se da la vuelta deprisa, por mitades, y en «hace» cae de pie en el cojín, que se
//   hunde; luego se queda quieto.
import * as k from "#kit";
import { v } from "#voz";
import { gato, vuelta, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f7 = v.frase(7);
const T0 = f7.inicio, Tcinco = f7.t("cinco"), Tcual = f7.t("cualquier"), Thace = f7.t("hace");
export const aterriza = Thace - 0.04;
const COJIN = { x: 540, y: 1330, rx: 430, ry: 120 };

const azL = azar(707);
const LUCES = Array.from({ length: 34 }, (_, i) => ({ x: 40 + (i / 33) * 1000, y: 230 + Math.sin(i * 0.7) * 60 + azL() * 40, c: ["255,200,110", "255,150,170", "180,220,255", "255,230,150"][i % 4], f: azL() * 6 }));
function cuarto(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#5a2f63"); bg.addColorStop(0.55, "#a2507a"); bg.addColorStop(1, "#3a1b3a");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.08; g.drawImage(k.manchas, -200, 0, 1500, 2000); g.restore();
  // una guirnalda de luces desenfocadas, arriba y detrás
  g.save(); g.globalCompositeOperation = "lighter";
  for (const l of LUCES) { const a = 0.35 + 0.15 * Math.sin(t * 2 + l.f); k.brillo(g, l.x, l.y + 420, 120, l.c, a); }
  g.restore();
  k.brillo(g, 820, 700, 1300, "255,190,140", 0.35);
  // el suelo
  const sg = g.createLinearGradient(0, 1250, 0, 1920); sg.addColorStop(0, "#5c2c3c"); sg.addColorStop(1, "#24101a");
  g.fillStyle = sg; g.fillRect(0, 1250, 1080, 670);
}
function cojin(g, hunde) {
  const { x, y, rx, ry } = COJIN, h = 150 * (1 - 0.25 * hunde);
  g.save();
  k.brillo(g, x, y + h * 0.9, rx * 2.2, "0,0,0", 0.35);
  const lado = g.createLinearGradient(x - rx, 0, x + rx, 0); lado.addColorStop(0, "#c98a1a"); lado.addColorStop(0.45, "#ffcf4a"); lado.addColorStop(1, "#a86a10");
  g.fillStyle = lado; g.beginPath(); g.ellipse(x, y + h * 0.5, rx, ry + h * 0.5, 0, 0, 6.2832); g.fill();
  const top = g.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 20, x, y, rx);
  top.addColorStop(0, "#fff0a8"); top.addColorStop(0.6, "#ffd04a"); top.addColorStop(1, "#d99a20");
  g.fillStyle = top; g.beginPath(); g.ellipse(x, y + 10 * hunde, rx * 0.97, ry * (1 - 0.15 * hunde), 0, 0, 6.2832); g.fill();
  // el botón del centro y las costuras
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.beginPath(); g.ellipse(x, y + 10 * hunde, rx * 0.97, ry, 0, 0, 6.2832); g.clip(); g.drawImage(k.red, x - rx, y - ry * 2, rx * 2, ry * 4); g.restore();
  const br = g.createRadialGradient(x - rx * 0.35, y - ry * 0.3, 0, x - rx * 0.35, y - ry * 0.3, rx * 0.5); br.addColorStop(0, "rgba(255,255,230,0.5)"); br.addColorStop(1, "rgba(255,255,230,0)");
  g.fillStyle = br; g.beginPath(); g.ellipse(x, y + 10 * hunde, rx * 0.97, ry, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#b8780e"; g.beginPath(); g.ellipse(x, y + 10 * hunde, 26, 12, 0, 0, 6.2832); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  cuarto(g, t);
  const hunde = k.pulso(t, aterriza + 0.06, 0.12) + 0.35 * su(tr(t, aterriza, aterriza + 0.2));
  cojin(g, Math.min(1, hunde));
  // el gatito: cae despacio boca arriba; en «cualquier» se da la vuelta deprisa y cae de pie en «hace»
  const esc = 300, pieY = COJIN.y - 6 - 0.78 * esc;
  let e;
  if (t < Tcual) e = { y: mez(960, 1000, su(tr(t, T0, Tcual))), ...vuelta(0), patalea: 0.6 };
  else if (t < aterriza) { const u = tr(t, Tcual, aterriza - 0.1); e = { y: mez(1000, pieY, Math.pow(tr(t, Tcual, aterriza), 1.7)), ...vuelta(u), patalea: 0.6 * (1 - u) }; }
  else e = { y: pieY + 12 * su(tr(t, aterriza, aterriza + 0.2)), ...vuelta(1), aplasta: k.pulso(t, aterriza + 0.06, 0.09) };
  gato(g, { x: 500, esc, ang: t < aterriza ? -0.12 * (1 - su(tr(t, Tcual, aterriza))) : 0, cria: 1, t, ...e });
  // «5 semanas»
  const ap = k.entra(tr(t, Tcinco - 0.12, Tcinco + 0.25));
  if (ap > 0.01) {
    g.save(); g.translate(540, 610); g.scale(mez(0.7, 1, ap), mez(0.7, 1, ap));
    k.pastilla(g, 0, 0, "5", "semanas", "255,215,120", Math.min(1, ap * 1.4), 150);
    g.restore();
  }
  vineta(g, 0.4);
  velo(g, 0.4);
}

export const momentos = { aterriza, cinco: Tcinco };
