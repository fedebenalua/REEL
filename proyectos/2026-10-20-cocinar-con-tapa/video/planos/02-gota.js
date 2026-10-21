// «Y cada gota que se va así se lleva más de cinco veces el calor que costó calentarla.»
// Otro sitio: una gota gigante sobre la placa caliente. Se entra con un corte en «Y» (la gota ya cae en el primer
// fotograma) y se sale con otro en «Ahora».
// - «Y cada gota»: la gota cae, aterriza en «gota» y se bambolea; dentro lleva una brasa (el calor que costó calentarla).
// - «se va así»: la gota se hace vapor de golpe; la brasa se queda en la placa.
// - «se lleva más de cinco veces»: del vapor salen cinco brasas, una por palabra; en «cinco», «5×».
// - «el calor que costó calentarla»: la brasa sola se enciende y sale «1×».
import * as k from "#kit";
import { v } from "#voz";
import { brasa, brasaSolida, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio;

const { tramo: tr, suave: su, mez, entra, azar } = k;
const f = v.frase(4), T0 = f.inicio, Tgota = f.t("gota"), Tva = f.t("va"), Tasi = f.t("asi");
const Tl = [f.t("lleva"), f.t("mas"), f.t("de"), f.t("cinco"), f.t("veces")], Tcosto = f.t("costo"), Tcalor = f.t("calor");
const CX = 540, SUELO = 1395, R = 270, CAIDA = 1100;

const az = azar(77);
const PUFS = Array.from({ length: 44 }, () => { const a = az() * 6.2832, r = Math.sqrt(az()); return { a, r, s: 120 + az() * 90, ph: az() * 6.28, dx: (az() - 0.5) * 60 }; });
const NUBE = (() => {
  const l = k.lienzo(200), c = l.getContext("2d"), a = azar(31);
  for (let i = 0; i < 9; i++) { const x = 100 + (a() - 0.5) * 70, y = 100 + (a() - 0.5) * 60, r = 38 + a() * 34, gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(246,250,255,0.55)"); gr.addColorStop(0.55, "rgba(246,250,255,0.28)"); gr.addColorStop(1, "rgba(246,250,255,0)"); c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2); }
  return l;
})();

// dónde está la gota: cae, aterriza y se bambolea
const Taterriza = Tgota;
const yGota = (t) => (t < Taterriza ? mez(330, SUELO - 1.2 * R - 4, Math.pow(tr(t, T0, Taterriza), 2)) : SUELO - 1.2 * R - 4);
// la brasa de dentro, dentro de la gota; después se queda en la placa
const BRASA1 = [CX, 1170];
// las cinco: en el vapor, en círculo
const CUM = [CX, 700];
const ANG = [-1.9, -0.55, 0.7, 2.0, 3.3];
const posBrasa = (i, t) => { const q = t - Tl[i]; return [CUM[0] + Math.cos(ANG[i]) * 215 + 10 * Math.sin(t * 2 + i), CUM[1] + Math.sin(ANG[i]) * 130 + 8 * Math.sin(t * 2.6 + i * 2) - 26 * entra(Math.min(1, q / 0.5))]; };

function gota(g, t) {
  const tierra = tr(t, Taterriza, Taterriza + 0.9), vibra = Math.exp(-tierra * 3.2) * Math.sin(tierra * 28) * (t >= Taterriza ? 1 : 0);
  const caeU = tr(t, T0, Taterriza), punta = t < Taterriza ? 1 : 0.1 + 0.9 * Math.exp(-(t - Taterriza) * 9);
  const vapor = su(tr(t, Tasi - 0.05, Tasi + 0.35)), escala = 1 + 0.45 * vapor, al = 1 - vapor;
  // antes de hacerse vapor, tiembla de calor
  const calienta = tr(t, Taterriza + 0.3, Tasi) * (1 - vapor), tiembla = 1 + 0.025 * Math.sin(t * 60) * calienta;
  if (al <= 0.01) return;
  const y = yGota(t), sx = (1 - 0.13 * (t < Taterriza ? 0 : vibra) + 0.1 * caeU * (t < Taterriza ? 1 : 0)) * escala * tiembla, sy = (1 + 0.13 * vibra - 0.08 * caeU * (t < Taterriza ? 1 : 0)) * escala * tiembla;
  g.save(); g.globalAlpha *= al; g.translate(CX, y + 0.0); g.scale(sx, sy);
  const gp = () => { g.beginPath(); g.moveTo(0, -R * (1 + 0.55 * punta)); g.bezierCurveTo(0.25 * R, -R * (0.95 * punta + 0.1), R, -R * 0.5, R, R * 0.2); g.arc(0, R * 0.2, R, 0, Math.PI, false); g.bezierCurveTo(-R, -R * 0.5, -0.25 * R, -R * (0.95 * punta + 0.1), 0, -R * (1 + 0.55 * punta)); g.closePath(); };
  gp();
  const gr = g.createRadialGradient(-R * 0.3, -R * 0.2, R * 0.1, 0, R * 0.2, R * 1.1);
  gr.addColorStop(0, "rgba(190,236,255,0.62)"); gr.addColorStop(0.6, "rgba(90,180,235,0.5)"); gr.addColorStop(1, "rgba(30,110,200,0.78)");
  g.fillStyle = gr; g.fill();
  // el borde, más oscuro por abajo (el agua refracta la luz) y claro por arriba
  g.save(); gp(); g.clip();
  const bg = g.createLinearGradient(0, -R, 0, R * 1.2); bg.addColorStop(0, "rgba(255,255,255,0.35)"); bg.addColorStop(0.5, "rgba(255,255,255,0)"); bg.addColorStop(1, "rgba(255,170,90,0.35)");
  g.lineWidth = 34; g.strokeStyle = bg; gp(); g.stroke();
  g.restore();
  gp(); g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 4; g.stroke();
  // los brillos
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(-R * 0.45, -R * 0.15, R * 0.12, R * 0.3, 0.45, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)"; g.beginPath(); g.ellipse(R * 0.5, R * 0.55, R * 0.08, R * 0.16, -0.7, 0, 6.2832); g.fill();
  g.restore();
}

function nubeVapor(g, t) {
  const e = su(tr(t, Tasi, Tasi + 1.0)), sube = su(tr(t, Tasi + 0.1, Tl[4] + 0.2)), al = su(tr(t, Tasi, Tasi + 0.35));
  if (al <= 0.01) return;
  const cx = CX, cy = mez(1100, CUM[1], sube);
  g.save();
  for (const p of PUFS) {
    const x = cx + Math.cos(p.a) * p.r * 330 * e + p.dx * e + 12 * Math.sin(t * 1.3 + p.ph), y = cy + Math.sin(p.a) * p.r * 190 * e - 40 * e + 10 * Math.sin(t * 1.6 + p.ph), s = p.s * (0.5 + 0.8 * e);
    g.globalAlpha = 0.17 * al; g.drawImage(NUBE, x - s, y - s, s * 2, s * 2);
  }
  g.restore();
}

export function dibuja(g, t) {
  // la placa caliente: un fondo oscuro que se enciende por abajo
  const calor = tr(t, T0, Tasi) * 0.6 + 0.4;
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#071a24"); bg.addColorStop(0.6, "#0d2a38"); bg.addColorStop(1, "#150f10");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(CX, SUELO, 20, CX, SUELO, 900); hg.addColorStop(0, `rgba(255,120,40,${0.55 * calor})`); hg.addColorStop(0.45, `rgba(255,90,30,${0.16 * calor})`); hg.addColorStop(1, "rgba(255,90,30,0)");
  g.fillStyle = hg; g.fillRect(0, 0, 1080, 1920); g.restore();
  // la placa
  const pg = g.createLinearGradient(0, SUELO, 0, SUELO + 140); pg.addColorStop(0, "#3a2118"); pg.addColorStop(0.15, "#1b1311"); pg.addColorStop(1, "#0a0807");
  g.fillStyle = pg; g.fillRect(0, SUELO, 1080, 600);
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,150,70,${0.55 * calor})`; g.fillRect(0, SUELO, 1080, 5);
  const rg = g.createRadialGradient(CX, SUELO + 6, 10, CX, SUELO + 6, 420); rg.addColorStop(0, `rgba(255,120,40,${0.7 * calor})`); rg.addColorStop(1, "rgba(255,90,30,0)");
  g.scale(1, 0.12); g.translate(0, (SUELO + 6) / 0.12 - SUELO - 6); g.fillStyle = rg; g.fillRect(CX - 440, SUELO - 40, 880, 100); g.restore();
  g.setTransform(1, 0, 0, 1, 0, 0);

  gota(g, t);
  // la brasa de dentro de la gota; luego, sola en la placa
  const sola = su(tr(t, Tasi, Tasi + 0.3)), brilla = 0.55 + 0.35 * su(tr(t, Taterriza, Tasi)) + 0.25 * k.pulso(t, Tcosto + 0.1, 0.18) + 0.2 * k.pulso(t, Tcalor + 0.05, 0.15);
  if (t >= T0) brasaSolida(g, BRASA1[0], BRASA1[1] + 4 * Math.sin(t * 2), 78, Math.min(1, brilla) * (t < Taterriza ? 0 : 1));
  // el vapor y sus cinco brasas
  nubeVapor(g, t);
  for (let i = 0; i < 5; i++) {
    const q = t - Tl[i];
    if (q < -0.02) continue;
    const [x, y] = posBrasa(i, t), pop = q < 0.3 ? 1 + 0.5 * Math.sin((q / 0.3) * Math.PI) : 1, tam = 130 * Math.min(1, 0.2 + q * 6) * pop;
    brasaSolida(g, x, y, tam * 0.6, 0.95);
    if (q < 0.3) k.brillo(g, x, y, 420 * (1 - q / 0.3) + 100, "amarilla", 0.9 * (1 - q / 0.3));
  }
  // las cifras: «5×» sobre el vapor y «1×» sobre la brasa sola
  const a5 = su(tr(t, Tl[3] - 0.02, Tl[3] + 0.2)), a1 = su(tr(t, Tcosto - 0.02, Tcosto + 0.2));
  k.pastilla(g, CX, 940, "5×", "", "255,196,80", a5, 124 + 18 * k.pulso(t, Tl[3] + 0.05, 0.12));
  k.pastilla(g, CX, 1325, "1×", "", "255,196,80", a1, 124 + 18 * k.pulso(t, Tcosto + 0.05, 0.12));
  velo(g, 0.8);
}
