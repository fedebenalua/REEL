// «Se llamaba teletexto: páginas de texto escondidas dentro de la señal de la tele.»
// Otro sitio: la señal de la tele, una tira de imágenes que pasan. Encima de cada una hay una franja negra que no se
// ve: ahí viaja el teletexto. Una cámara, con un corte de entrada en «Se».
// - «teletexto»: el nombre, enorme y de colores, sobre las imágenes que pasan.
// - «páginas de texto»: la cámara se lanza a la franja negra de una imagen, que está llena de cuadros de color.
// - «escondidas»: los cuadros se convierten en letras: es texto.
// - «dentro de la señal»: la cámara se aleja y todas las franjas se encienden de dorado, una detrás de otra.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, canal } from "../mundo.js";
import { texto, C, css } from "../teletexto.js";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez, redondo, azar } = k;
const f = v.frase(4);
const T0 = f.inicio, Ttel = f.t("teletexto"), Tpag = f.t("paginas"), Ttex = f.t("texto"), Tesc = f.t("escondidas"), Tsen = f.t("senal");
const FIN = v.frase(5).inicio;

const FW = 560, FH = 420, BH = 56, PIT = 640, NC = 28, CW = FW / NC;
// cuánto han avanzado las imágenes: rápido, y frenan para quedarse quietas antes del corte
const VEL = 560, TF = FIN - 0.55;
const tabla = []; { let d = 0; for (let i = 0; i <= 600; i++) { const tt = T0 + i * 0.01; tabla.push(d); d += VEL * (1 - su(tr(tt, TF - 0.9, TF))) * 0.01; } }
const D = (t) => { const x = (t - T0) * 100, i = Math.max(0, Math.min(tabla.length - 2, Math.floor(x))); return mez(tabla[i], tabla[i + 1], x - i); };
const I0 = 3;                                                 // la imagen a la que se lanza la cámara
const xFrame = (i, t) => i * PIT - D(t) - 250;
const w = (t) => su(tr(t, Tpag - 0.35, Tpag + 0.35)) * (1 - su(tr(t, Tsen - 0.1, Tsen + 0.8)));
const cam = (t) => {
  const z = mez(1.0, 3.3, su(tr(t, Tpag - 0.35, Tpag + 0.55))) * mez(1, 1 / 3.3 * 1.0, su(tr(t, Tsen - 0.1, Tsen + 0.8)));
  const wt = w(t); return [z, xFrame(I0, t) * wt, (-FH / 2 - BH / 2) * wt];
};

const COLS = ["R", "G", "Y", "B", "M", "C", "W"];
function franja(g, t, x, i, lit, letras) {
  const x0 = x - FW / 2, y0 = -FH / 2 - BH;
  g.fillStyle = "#06050e"; g.fillRect(x0, y0, FW, BH);
  const az = azar(300 + i * 13);
  for (let c = 0; c < NC; c++) {
    const col = COLS[Math.floor(az() * 7)], vis = az() < 0.78;
    if (!vis) continue;
    g.fillStyle = css(col, 0.85); g.fillRect(x0 + c * CW + 2, y0 + 8, CW - 4, BH - 16);
  }
  if (letras > 0.01) {
    g.save(); g.globalAlpha = letras; g.translate(x0, y0 + 6); const T = "P101 NOTICIAS HOY EN DIRECTO";
    g.fillStyle = "rgba(0,0,0,0.7)"; g.fillRect(0, 0, FW, BH - 12);
    for (let c = 0; c < NC; c++) if (T[c] && T[c] !== " ") texto(g, T[c], c, 0, CW, BH - 12, COLS[(c * 3 + 2) % 7]);
    g.restore();
  }
  if (lit > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, x, y0 + BH / 2, 420, "255,215,90", 0.9 * lit); g.fillStyle = `rgba(255,215,90,${0.45 * lit})`; g.fillRect(x0, y0, FW, BH); g.strokeStyle = `rgba(255,235,150,${lit})`; g.lineWidth = 6; g.strokeRect(x0, y0, FW, BH); g.restore();
  }
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const bg = g.createLinearGradient(0, -1200, 0, 1200); bg.addColorStop(0, "#0a0a2e"); bg.addColorStop(0.5, "#13104a"); bg.addColorStop(1, "#08061c");
  g.fillStyle = bg; g.fillRect(cx - 3000, -2400, 6000, 4800);
  // la onda de la señal, por detrás
  g.save(); g.strokeStyle = "rgba(43,233,255,0.55)"; g.lineWidth = 6; g.beginPath();
  for (let x = cx - 1400; x <= cx + 1400; x += 14) { const y = 400 + 46 * Math.sin((x + D(t)) * 0.014) + 20 * Math.sin((x + D(t) * 1.3) * 0.037); x === cx - 1400 ? g.moveTo(x, y) : g.lineTo(x, y); }
  g.stroke(); g.strokeStyle = "rgba(43,233,255,0.18)"; g.lineWidth = 22; g.stroke(); g.restore();
  // las imágenes con su franja
  const letras = su(tr(t, Ttex - 0.05, Ttex + 0.4));
  for (let i = -6; i < 30; i++) {
    const x = xFrame(i, t); if (x < cx - 1500 || x > cx + 1500) continue;
    const dorado = su(tr(t, Tsen + 0.05 + 0.1 * (i - I0 + 4) + 0, Tsen + 0.3 + 0.1 * (i - I0 + 4))) * (1 - su(tr(t, Tsen + 0.65 + 0.1 * (i - I0 + 4), Tsen + 1.0 + 0.1 * (i - I0 + 4))));
    g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 40; redondo(g, x - FW / 2, -FH / 2, FW, FH, 16); g.fillStyle = "#000"; g.fill(); g.restore();
    g.save(); redondo(g, x - FW / 2, -FH / 2, FW, FH, 16); g.clip(); g.translate(x - FW / 2, -FH / 2); canal(g, (i + 8) % 4, FW, FH, t); g.restore();
    g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 4; redondo(g, x - FW / 2, -FH / 2, FW, FH, 16); g.stroke();
    franja(g, t, x, i, dorado, i === I0 ? letras : 0);
  }
  // el nombre, enorme, de colores
  const pop = su(tr(t, Ttel - 0.1, Ttel + 0.35)), fuera = 1 - su(tr(t, Tpag - 0.4, Tpag + 0.1));
  if (pop * fuera > 0.01) {
    g.save(); g.translate(cx, cy); g.translate(0, -380 * 0 - 400); const sc = (0.6 + 0.4 * pop) * 1; g.scale(sc, sc); g.globalAlpha = pop * fuera;
    const cw = 100, ch = 140, tot = 9 * cw; g.translate(-tot / 2, -ch / 2); g.fillStyle = "rgba(0,0,0,0.65)"; g.fillRect(-14, -10, tot + 28, ch + 20);
    "TELETEXTO".split("").forEach((e, i) => texto(g, e, i, 0, cw, ch, ["Y", "C", "G", "M", "R", "Y", "C", "G", "W"][i]));
    g.restore();
  }
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { teletexto: Ttel, paginas: Tpag, escondidas: Tesc, senal: Tsen };
