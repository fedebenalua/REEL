// «Y la nicotina llega a tu cerebro en segundos, por eso cada calada te pide la siguiente.» + «Si tienes menos de
// veinticinco, tu»
// La cabeza: una silueta de perfil, mirando a la izquierda, grande, con el váper en los labios. Dentro se ve el cerebro.
// - «Y»: corte aquí; la cabeza con el váper en la boca, el led encendido.
// - «nicotina»: chispas naranjas entran por la boca y suben; «cerebro»: el cerebro se enciende naranja; «segundos»:
//   un contador de segundos corre y se para en 10.
// - «cada calada»: el brillo se apaga, el váper se aparta, la cabeza se agrisa; «te pide»: el cerebro late pidiendo;
//   «siguiente»: el váper vuelve a los labios y entra otra tanda de chispas.
// - «menos de veinticinco»: «< 25 años»; «cerebro»: la cámara se mete en el cerebro (sigue en el plano siguiente).
import * as k from "#kit";
import { v } from "#voz";
import { fondo, vaper, velo, NARANJA } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const T0 = f5.inicio, Tnic = f5.t("nicotina"), Tlle = f5.t("llega"), Tcer = f5.t("cerebro"), Tseg = f5.t("segundos"), Tcada = f5.t("cada"), Tcal = f5.t("calada"), Tpide = f5.t("pide"), Tsig = f5.t("siguiente");
const Tvei = f6.t("veinticinco"), Tcer6 = f6.t("cerebro");
export const momentos = { nicotina: Tnic, cerebro: Tcer, calada: Tcada, siguiente: Tsig, entra: Tcer6 };

// la cabeza, en coordenadas suyas: la nariz en x≈140, la coronilla en y=0, el cuello abajo
const OX = 250, OY = 560;
const BOCA = [200, 720], CEREBRO = [560, 430];
function silueta(g) {
  g.beginPath(); g.moveTo(600, 0);
  g.bezierCurveTo(820, 0, 900, 200, 880, 420);
  g.bezierCurveTo(870, 600, 800, 760, 700, 860);
  g.bezierCurveTo(640, 920, 620, 1000, 620, 1120);
  g.lineTo(330, 1120);
  g.bezierCurveTo(350, 1000, 330, 920, 270, 880);
  g.bezierCurveTo(230, 850, 220, 820, 240, 795);
  g.bezierCurveTo(210, 775, 190, 755, 215, 735);
  g.bezierCurveTo(230, 725, 230, 715, 215, 705);
  g.bezierCurveTo(190, 690, 200, 665, 235, 650);
  g.bezierCurveTo(180, 630, 120, 600, 160, 560);
  g.bezierCurveTo(220, 510, 240, 460, 250, 400);
  g.bezierCurveTo(260, 300, 320, 120, 420, 50);
  g.bezierCurveTo(470, 15, 530, 0, 600, 0);
  g.closePath();
}
// el camino de la nicotina: de la boca al cerebro
const camino = (u) => { const a = BOCA, b = [380, 700], c = [470, 520], d = CEREBRO; const s = 1 - u; return [s * s * s * a[0] + 3 * s * s * u * b[0] + 3 * s * u * u * c[0] + u * u * u * d[0], s * s * s * a[1] + 3 * s * s * u * b[1] + 3 * s * u * u * c[1] + u * u * u * d[1]]; };
const az = azar(55);
const CHISPAS = Array.from({ length: 28 }, (_, i) => ({ i, off: i * 0.035, dur: 0.85 + az() * 0.2, d: (az() - 0.5) * 50, r: 6 + az() * 7, f: az() * 6.28 }));
const GIROS = Array.from({ length: 9 }, () => ({ x: (az() - 0.5) * 1.6, y: (az() - 0.5) * 1.4, r: 50 + az() * 60, a: az() * 6.28, l: 2.5 + az() * 2 }));

function cerebro(g, t, luz, lata) {
  const [cx, cy] = CEREBRO;
  const col = k.mezRgb("120,90,170", NARANJA, luz);
  g.save();
  g.beginPath(); g.ellipse(cx, cy, 300, 235, -0.15, 0, 6.2832); g.clip();
  const bg = g.createRadialGradient(cx - 40, cy - 40, 20, cx, cy, 320); bg.addColorStop(0, `rgba(${col},${0.55 + 0.4 * luz})`); bg.addColorStop(1, `rgba(${col},${0.2 + 0.3 * luz})`);
  g.fillStyle = bg; g.fillRect(cx - 320, cy - 260, 640, 520);
  // las circunvoluciones: curvas que serpentean
  g.strokeStyle = `rgba(${k.mezRgb("40,25,70", "255,240,200", luz * 0.9)},0.8)`; g.lineWidth = 9; g.lineCap = "round";
  for (const q of GIROS) {
    g.beginPath();
    const x0 = cx + q.x * 300, y0 = cy + q.y * 235;
    for (let s = 0; s <= 1.001; s += 0.05) { const px = x0 + Math.cos(q.a) * s * q.r * q.l + Math.sin(s * 14 + q.a) * 22, py = y0 + Math.sin(q.a) * s * q.r * q.l + Math.cos(s * 14 + q.a) * 22; s === 0 ? g.moveTo(px, py) : g.lineTo(px, py); }
    g.stroke();
  }
  g.restore();
  k.brillo(g, cx, cy, 900, NARANJA, 0.9 * luz + 0.25 * lata);
}

export function dibuja(g, t) {
  fondo(g, t, "#1a1030");
  // la calada: el led y la chispa; la primera va con «nicotina», la segunda con «siguiente»
  const primera = su(tr(t, Tnic - 0.1, Tnic + 0.1)) * (1 - su(tr(t, Tcer, Tcer + 0.3)));
  const segunda = su(tr(t, Tsig - 0.05, Tsig + 0.15)) * (1 - su(tr(t, Tsig + 0.9, Tsig + 1.2)));
  const aparta = su(tr(t, Tcada - 0.1, Tcal + 0.2)) * (1 - su(tr(t, Tsig - 0.4, Tsig - 0.05)));
  const gris = aparta;
  const luz = su(tr(t, Tcer - 0.15, Tcer + 0.3)) * (1 - 0.9 * su(tr(t, Tcada - 0.2, Tcal + 0.2))) + 0.9 * su(tr(t, Tsig + 0.7, Tsig + 1.0));
  const lata = aparta * (0.5 + 0.5 * Math.sin((t - Tpide) * 9)) * su(tr(t, Tpide - 0.1, Tpide + 0.2));
  // la cámara: en «cerebro» (frase 6) se mete en el cerebro
  const entra = su(tr(t, Tcer6 - 0.35, Tcer6 + 0.3));
  const z = mez(1, 4.5, entra);
  g.save(); g.translate(OX + CEREBRO[0], OY + CEREBRO[1]); g.scale(z, z); g.translate(-OX - CEREBRO[0], -OY - CEREBRO[1]);
  g.save(); g.translate(OX, OY);
  // la silueta con su luz de borde, que se apaga al agrisarse
  g.save(); g.shadowColor = `rgba(${k.mezRgb("255,120,220", "120,120,130", gris)},0.9)`; g.shadowBlur = 50;
  silueta(g); const sg = g.createLinearGradient(100, 0, 900, 0); sg.addColorStop(0, k.mezColor("#3a2a58", "#2b2b32", gris)); sg.addColorStop(1, k.mezColor("#1c1430", "#161619", gris)); g.fillStyle = sg; g.fill(); g.restore();
  g.save(); silueta(g); g.clip();
  g.strokeStyle = `rgba(${k.mezRgb("255,150,230", "150,150,160", gris)},0.9)`; g.lineWidth = 7; silueta(g); g.stroke();
  cerebro(g, t, luz, lata);
  // las chispas de nicotina por dentro
  g.save(); g.globalCompositeOperation = "lighter";
  for (const c of CHISPAS) for (const T of [Tnic, Tsig + 0.05]) {
    const u = (t - T - c.off) / c.dur;
    if (u <= 0 || u >= 1) continue;
    const p = camino(u), tg = camino(Math.min(1, u + 0.02)), nx = -(tg[1] - p[1]), ny = tg[0] - p[0], n = Math.hypot(nx, ny) || 1;
    const x = p[0] + (nx / n) * c.d * Math.sin(u * 6 + c.f), y = p[1] + (ny / n) * c.d * Math.sin(u * 6 + c.f);
    g.fillStyle = `rgba(255,${Math.round(170 + 60 * u)},80,${0.9 * (1 - u * 0.5)})`; g.beginPath(); g.arc(x, y, c.r, 0, 6.2832); g.fill();
    k.brillo(g, x, y, c.r * 7, NARANJA, 0.6);
  }
  g.restore();
  g.restore();
  g.restore();
  // el váper en los labios; se aparta en «cada calada» y vuelve en «siguiente»
  const tip = [OX + BOCA[0] - 14, OY + BOCA[1] + 8];
  const dir = [Math.sin(1.07), -Math.cos(1.07)], L = 500;
  const dx = -60 * aparta, dy = 220 * aparta;
  vaper(g, tip[0] - dir[0] * L * 0.57 + dx, tip[1] - dir[1] * L * 0.57 + dy, L, 1.07 - 0.35 * aparta, { luz: 0.3 + 0.7 * Math.max(primera, segunda) });
  k.brillo(g, tip[0] - dir[0] * L * 1.05 + dx, tip[1] - dir[1] * L * 1.05 + dy, 300, "110,200,255", 0.7 * Math.max(primera, segunda));
  g.restore();
  // el contador de segundos: corre desde «llega» y se para en 10 en «segundos»
  const cuenta = su(tr(t, Tlle, Tseg + 0.1)), alC = su(tr(t, Tlle - 0.05, Tlle + 0.15)) * (1 - su(tr(t, Tcada - 0.3, Tcada)));
  k.pastilla(g, 800, 1380, k.fmt(10 * cuenta, 0), "s", NARANJA, alC, 120);
  // «< 25 años» en la frase 6
  const al25 = su(tr(t, Tvei - 0.05, Tvei + 0.15)) * (1 - su(tr(t, Tcer6 - 0.25, Tcer6)));
  k.pastilla(g, 790, 1380, "< 25", "años", "255,255,255", al25, 120);
  // al meterse en el cerebro, la luz se va y queda lo oscuro de dentro
  g.fillStyle = `rgba(20,10,24,${su(tr(t, Tcer6 - 0.1, Tcer6 + 0.18))})`; g.fillRect(0, 0, 1080, 1920);
  velo(g, 0.5);
}
