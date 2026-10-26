// «Si toda esa historia cupiera en una cinta métrica, Cleopatra estaría en el centímetro 55: pasada la mitad.»
// «¿Y cómo puede ser?»
// Otro sitio: una mesa de madera con una cinta métrica de costura amarilla, de 0 a 100 cm. En el 0, una pirámide de
// juguete; en el 100, una canica que es la Luna. Se entra con un corte en «cinta».
// - «Cleopatra»: la moneda cae sobre la cinta, rebota y se queda en el 55.
// - «estaría en el centímetro 55»: la cámara se acerca; el 55 se enciende.
// - «pasada la mitad»: una raya roja cruza la cinta en el 50, por debajo de la moneda.
// - «¿Y cómo puede ser?»: la cámara se aleja otra vez y reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { moneda, luna, piramide, pon, aPantalla, F_CLEO } from "../mundo.js";

export const desde = "cinta";

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6), f7 = v.frase(7);
const T0 = f6.t("cinta"), Tcle = f6.t("cleopatra"), T55 = f6.t("55"), Tcen = f6.t("centimetro"), Tpas = f6.t("pasada"), Tmit = f6.t("mitad");
const Tcom = f7.t("como"), Tser = f7.t("ser"), Tegi = f7.t("egipto");

const Y0c = 1400, PX = 8.5, yCm = (cm) => Y0c - cm * PX, AN = 150, XN = 540 - AN * 0.17, XM = 540 + AN * 0.2;
const CM = F_CLEO * 100;                        // 55,0
export const cae = Tcle + 0.05, toca = cae + 0.42;

const Z = k.claves([[T0, 1.2], [Tcen - 0.35, 1.2], [T55 + 0.1, 4.0], [Tcom - 0.05, 4.0], [Tser + 0.55, 1.2], [Tegi, 1.2]]);
const CY = k.claves([[T0, yCm(48)], [Tcen - 0.35, yCm(48)], [T55 + 0.1, yCm(53)], [Tcom - 0.05, yCm(53)], [Tser + 0.55, yCm(48)], [Tegi, yCm(48)]]);
const ANG = 0.42;
const camara = (t) => ({ cx: 540, cy: CY(t), z: Z(t) });

// la madera de la mesa, una vez
const MESA = (() => {
  const W = 1400, H = 2400, l = k.lienzo(W, H), c = l.getContext("2d"), az = azar(515);
  c.fillStyle = "#6b3f1f"; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) {
    const x = i * 210 - 40, gr = c.createLinearGradient(x, 0, x + 210, 0);
    const b = 0.85 + az() * 0.3; gr.addColorStop(0, `rgb(${120 * b},${72 * b},${36 * b})`); gr.addColorStop(0.5, `rgb(${150 * b},${92 * b},${48 * b})`); gr.addColorStop(1, `rgb(${112 * b},${66 * b},${32 * b})`);
    c.fillStyle = gr; c.fillRect(x, 0, 210, H);
    for (let j = 0; j < 26; j++) { const xx = x + az() * 210, w = 1 + az() * 3; c.strokeStyle = `rgba(60,30,10,${0.15 + az() * 0.25})`; c.lineWidth = w; c.beginPath(); c.moveTo(xx, 0); for (let y = 0; y <= H; y += 80) c.lineTo(xx + 8 * Math.sin(y * 0.004 + j), y); c.stroke(); }
    c.fillStyle = "rgba(30,14,4,0.8)"; c.fillRect(x, 0, 4, H);
  }
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.14; c.drawImage(k.red2, 0, 0, W, H);
  return l;
})();

function cinta(g, t, c) {
  const x0 = 540 - AN / 2, ya = yCm(103), yb = yCm(-3);
  // la sombra
  g.save(); g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 18; g.shadowOffsetX = 6; g.shadowOffsetY = 8;
  g.fillStyle = "#f2c21a"; g.fillRect(x0, ya, AN, yb - ya); g.restore();
  const gr = g.createLinearGradient(x0, 0, x0 + AN, 0); gr.addColorStop(0, "#d9a40e"); gr.addColorStop(0.2, "#ffd534"); gr.addColorStop(0.6, "#ffcf2a"); gr.addColorStop(1, "#c8920a");
  g.fillStyle = gr; g.fillRect(x0, ya, AN, yb - ya);
  // las rayas de cada centímetro y medio centímetro, y los números
  g.fillStyle = "#1a1408";
  for (let mm = 0; mm <= 1000; mm += 5) {
    const y = yCm(mm / 10), cm = mm % 10 === 0, cinco = mm % 50 === 0, diez = mm % 100 === 0;
    const L = diez ? AN * 0.42 : cinco ? AN * 0.32 : cm ? AN * 0.24 : AN * 0.12, w = diez ? 1.3 : cm ? 0.9 : 0.6;
    g.fillRect(x0, y - w / 2, L * 0.45, w); g.fillRect(x0 + AN - L, y - w / 2, L, w);
  }
  g.textAlign = "center"; g.textBaseline = "middle";
  for (let cm = 1; cm < 100; cm++) {
    const y = yCm(cm), diez = cm % 10 === 0;
    let col = diez ? "#c81e1e" : "#1a1408";
    g.font = `800 ${diez ? 9 : 6.6}px Figtree`;
    g.fillStyle = col; g.fillText(String(cm), XN, y);
  }
  // el 55 que se enciende
  const e55 = su(tr(t, T55 - 0.1, T55 + 0.25));
  if (e55 > 0) {
    const y = yCm(55);
    k.brillo(g, XN, y, 34, "255,250,200", 0.8 * e55);
    g.font = "800 6.6px Figtree"; g.fillStyle = `rgba(200,20,20,${e55})`; g.fillText("55", XN, y);
  }
  // las puntas de metal
  for (const [ya2, yb2] of [[yCm(103) - 4, yCm(103) + 2], [yCm(-3) - 2, yCm(-3) + 4]]) { g.fillStyle = "#b9bec6"; g.fillRect(x0 - 1, ya2, AN + 2, yb2 - ya2); }
  // la raya de la mitad
  const m = su(tr(t, Tpas - 0.05, Tmit + 0.15));
  if (m > 0) {
    const y = yCm(50);
    g.save(); g.shadowColor = "rgba(255,60,60,0.9)"; g.shadowBlur = 8;
    g.fillStyle = "#ff3838"; g.fillRect(540 - AN * 0.7, y - 1.1, AN * 1.4 * m, 2.2); g.restore();
  }
}

export function dibuja(g, t) {
  const c = camara(t);
  g.setTransform(1, 0, 0, 1, 0, 0); g.translate(540, 960); g.rotate(ANG); g.scale(c.z, c.z); g.translate(-c.cx, -c.cy);
  g.drawImage(MESA, -900, -900, 2800, 3800);
  // la luz de la lámpara, cálida, y el borde oscuro
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const lg = g.createRadialGradient(380, 700, 100, 540, 900, 1300); lg.addColorStop(0, "rgba(255,200,120,0.32)"); lg.addColorStop(1, "rgba(20,8,0,0.55)");
  g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920); g.restore();
  cinta(g, t, c);
  // la pirámide de juguete en el 0 y la Luna-canica en el 100
  piramide(g, { A: [540, yCm(-3) + 8], BL: [450, yCm(-3) + 118], BR: [590, yCm(-3) + 118], BK: [635, yCm(-3) + 96] }, { dia: true, forro: 0 });
  luna(g, 540, yCm(103) - 58, 52, 0);
  // la moneda que cae y rebota hasta el 55
  const yM = yCm(CM), rM = 2.5 * PX;
  if (t >= cae) {
    const u = tr(t, cae, toca), esc = t < toca ? mez(3.2, 1, u * u) : 1 + 0.16 * Math.abs(Math.sin((t - toca) * 9)) * Math.exp(-(t - toca) * 6);
    const dy = t < toca ? -220 * (1 - u * u) : 0;
    g.save(); g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 14 * esc; g.shadowOffsetX = 6 * esc; g.shadowOffsetY = 8 * esc;
    g.beginPath(); g.arc(XM, yM + dy, rM * esc, 0, 6.2832); g.fillStyle = "rgba(0,0,0,0.25)"; g.fill(); g.restore();
    moneda(g, XM, yM + dy, rM * esc, t < toca ? (1 - u) * 5 : 0, 0.3 + 0.5 * k.pulso(t, T55 + 0.1, 0.3));
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(20,8,0,0.55)"); vg.addColorStop(1, "rgba(20,8,0,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
