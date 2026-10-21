// «Eso sí, el récord está en 12 dobleces, y hizo falta un papel de más de un kilómetro.»
// Otro sitio: un campo al atardecer (corte en «Eso»). Desde el primer fotograma, delante y grande, el taco de papel
// doblado 12 veces, gordo y redondeado por los dobleces, con la luz naranja del sol bajo.
// - «el récord está en 12 dobleces»: en «12», la cifra de oro, «12 dobleces», encima del taco.
// - «y hizo falta un papel»: del taco sale una tira de papel que se desenrolla por el campo, alejándose, hasta el
//   horizonte; la cámara sube un poco para verla entera. «kilómetro»: allá al fondo, «1,2 km».
import * as k from "#kit";
import { v } from "#voz";

export const desde = "eso";

const { suave: su, tramo: tr, mez, entra } = k;
const f11 = v.frase(11), T12 = f11.t("12"), Tpapel = f11.t("papel"), Tkm = f11.t("kilometro"), Ty = f11.t("y");
const LARGO = 1219;                                       // metros de papel (4.000 pies)
// la cámara: su altura sobre el campo (m) y dónde queda el horizonte en la pantalla
const altura = () => 1.4;
const horizonte = (t) => mez(800, 830, su(tr(t, f11.inicio, f11.fin + 0.3)));
const F = 1400;
const pantalla = (t, x, z) => ({ x: 540 + (F * x) / z, y: horizonte(t) + (F * altura(t)) / z });

const azC = k.azar(61);
const ARBOLES = Array.from({ length: 40 }, (_, i) => ({ x: (i / 40) * 1200 - 60 + azC() * 20, h: 10 + azC() * 26, w: 16 + azC() * 30 }));
const HIERBA = Array.from({ length: 900 }, () => ({ x: (azC() - 0.5) * 60, z: 1.5 + Math.pow(azC(), 2) * 60, h: 0.08 + azC() * 0.2, c: azC() }));
const campo = (() => {
  const l = k.lienzo(1080, 1200), c = l.getContext("2d");
  const gr = c.createLinearGradient(0, 0, 0, 1200);
  gr.addColorStop(0, "#c9a24a"); gr.addColorStop(0.08, "#9fa040"); gr.addColorStop(0.4, "#5e8a2e"); gr.addColorStop(1, "#2c4a1a");
  c.fillStyle = gr; c.fillRect(0, 0, 1080, 1200);
  c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.45; c.drawImage(k.manchas, 0, 0, 1080, 1200);
  return l;
})();

function cielo(g, t, yh) {
  const sg = g.createLinearGradient(0, 0, 0, yh);
  sg.addColorStop(0, "#2a3c7a"); sg.addColorStop(0.45, "#8a5a9a"); sg.addColorStop(0.75, "#f08a5a"); sg.addColorStop(1, "#ffd08a");
  g.fillStyle = sg; g.fillRect(0, 0, 1080, yh + 2);
  // el sol, bajo, a la derecha
  const sx = 820, sy = yh - 70;
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(sx, sy, 0, sx, sy, 700);
  hg.addColorStop(0, "rgba(255,230,160,0.9)"); hg.addColorStop(0.08, "rgba(255,200,120,0.55)"); hg.addColorStop(0.4, "rgba(255,150,80,0.18)"); hg.addColorStop(1, "rgba(255,150,80,0)");
  g.fillStyle = hg; g.fillRect(0, 0, 1080, 1920);
  g.restore();
  g.fillStyle = "#fff4d6"; g.beginPath(); g.arc(sx, sy, 62, 0, Math.PI * 2); g.fill();
  // nubes largas, iluminadas por abajo
  for (const [x, y, w] of [[200, 300, 520], [700, 420, 600], [380, 560, 420]]) {
    const ng = g.createLinearGradient(0, y - 30, 0, y + 30);
    ng.addColorStop(0, "rgba(120,80,140,0)"); ng.addColorStop(0.5, "rgba(255,170,130,0.45)"); ng.addColorStop(1, "rgba(255,200,150,0)");
    g.fillStyle = ng; g.beginPath(); g.ellipse(x + Math.sin(t * 0.1) * 6, y, w / 2, 26, 0, 0, Math.PI * 2); g.fill();
  }
  // los árboles del horizonte
  g.fillStyle = "#2d2a3a";
  for (const a of ARBOLES) { g.beginPath(); g.ellipse(a.x, yh - a.h * 0.5, a.w * 0.5, a.h * 0.6, 0, 0, Math.PI * 2); g.fill(); }
  g.fillRect(0, yh - 6, 1080, 6);
}

// el taco: 12 dobleces de papel de seda, un bloque gordo con los bordes redondeados por los dobleces
const capas = (() => {
  const l = k.lienzo(600, 340), c = l.getContext("2d"), a = k.azar(4);
  c.fillStyle = "#fff"; c.fillRect(0, 0, 600, 340);
  for (let y = 0; y < 340; y += 2 + a() * 3) { c.strokeStyle = `rgba(150,120,100,${0.15 + a() * 0.3})`; c.lineWidth = 0.8 + a() * 0.8; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= 600; x += 50) c.lineTo(x, y + (a() - 0.5) * 2.5); c.stroke(); }
  return l;
})();
function taco(g, x, y, w, h, t) {
  // su sombra larga, hacia la cámara y a la izquierda (el sol está detrás, a la derecha)
  g.save(); g.fillStyle = "rgba(20,30,10,0.45)"; g.beginPath(); g.ellipse(x - w * 0.15, y + h * 0.5, w * 0.7, h * 0.2, -0.05, 0, Math.PI * 2); g.fill(); g.restore();
  // la cara de arriba
  g.beginPath(); g.moveTo(x - w / 2 + 30, y - h / 2); g.lineTo(x + w / 2 - 30, y - h / 2); g.lineTo(x + w / 2 - 60, y - h / 2 - 70); g.lineTo(x - w / 2 + 70, y - h / 2 - 70); g.closePath();
  const tg = g.createLinearGradient(0, y - h / 2 - 70, 0, y - h / 2);
  tg.addColorStop(0, "#ffe2b8"); tg.addColorStop(1, "#fff4e2"); g.fillStyle = tg; g.fill();
  // el canto, con todas sus capas
  k.redondo(g, x - w / 2, y - h / 2, w, h, 36);
  const cg = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  cg.addColorStop(0, "#f2e6d6"); cg.addColorStop(0.6, "#fff6e8"); cg.addColorStop(1, "#ffd9a8");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.8; g.drawImage(capas, x - w / 2, y - h / 2, w, h);
  // el contraluz del sol por la derecha
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 1;
  const lg = g.createLinearGradient(x + w / 2 - 80, 0, x + w / 2, 0);
  lg.addColorStop(0, "rgba(255,170,80,0)"); lg.addColorStop(1, "rgba(255,170,80,0.5)");
  g.fillStyle = lg; g.fillRect(x - w / 2, y - h / 2, w, h);
  g.restore();
  void t;
}

export function dibuja(g, t) {
  const yh = horizonte(t);
  cielo(g, t, yh);
  g.drawImage(campo, 0, yh, 1080, 1920 - yh + 20);
  // la luz del sol sobre el campo, cerca del horizonte
  g.save(); g.globalCompositeOperation = "lighter";
  const cl = g.createRadialGradient(820, yh, 0, 820, yh, 600);
  cl.addColorStop(0, "rgba(255,190,110,0.45)"); cl.addColorStop(1, "rgba(255,190,110,0)");
  g.fillStyle = cl; g.fillRect(0, yh, 1080, 700); g.restore();
  // la hierba, de lejos a cerca
  for (const h of HIERBA) {
    const P = pantalla(t, h.x, h.z), alto = (F * h.h) / h.z;
    if (P.y > 1960 || P.x < -20 || P.x > 1100) continue;
    g.strokeStyle = h.c < 0.5 ? "rgba(70,110,30,0.8)" : "rgba(200,190,90,0.7)"; g.lineWidth = Math.max(1, 30 / h.z);
    g.beginPath(); g.moveTo(P.x, P.y); g.quadraticCurveTo(P.x + alto * 0.1, P.y - alto * 0.5, P.x + alto * 0.25, P.y - alto); g.stroke();
  }
  // la tira de papel: sale del taco (a 3 m) y se desenrolla hasta 1.219 m
  const sale = entra(tr(t, Tpapel - 0.5, Tkm + 0.1));
  const zFin = Math.exp(mez(Math.log(6), Math.log(LARGO), sale));
  if (sale > 0.001) {
    const A = 0.4, pasos = [];
    for (let i = 0; i <= 60; i++) pasos.push(Math.exp(mez(Math.log(6), Math.log(zFin), i / 60)));
    g.beginPath();
    pasos.forEach((z, i) => { const P = pantalla(t, -A + 0.3, z); i ? g.lineTo(P.x, P.y) : g.moveTo(P.x, P.y); });
    for (let i = pasos.length - 1; i >= 0; i--) { const P = pantalla(t, A + 0.3, pasos[i]); g.lineTo(P.x, P.y); }
    g.closePath();
    const pg = g.createLinearGradient(0, yh, 0, 1500);
    pg.addColorStop(0, "#ffd9a0"); pg.addColorStop(0.15, "#fff0da"); pg.addColorStop(1, "#fffaf2");
    g.fillStyle = pg; g.fill();
    // su borde con luz y las arrugas
    g.strokeStyle = "rgba(255,200,140,0.6)"; g.lineWidth = 2; g.stroke();
    // el rollo que se desenrolla, en la punta
    const R = pantalla(t, 0.3, zFin), r = Math.max(2, (F * 0.18) / zFin);
    if (sale < 0.995) { g.fillStyle = "#fff2dc"; g.beginPath(); g.ellipse(R.x, R.y - r, (F * A) / zFin, r, 0, 0, Math.PI * 2); g.fill(); }
  }
  // el taco, delante, grande
  // (la cámara se acerca despacio al taco mientras habla)
  const cerca = 1 + 0.08 * su(tr(t, f11.inicio, f11.fin + 0.3));
  const tx = 540, ty = 1290 + 30 * (cerca - 1) / 0.08;
  taco(g, tx, ty, 640 * cerca, 320 * cerca, t);
  // «12 dobleces», en oro, en «12»
  const al12 = entra(tr(t, T12 - 0.1, T12 + 0.2));
  void Ty;
  if (al12 > 0) {
    k.brillo(g, tx, 575, 600, "255,200,90", 0.4 * al12 * (0.6 + 0.4 * k.pulso(t, T12 + 0.2, 0.3)));
    k.pastilla(g, tx, 575 - 20 * (1 - al12), "12", "dobleces", "255,210,110", al12, 130);
  }
  // «1,2 km», allá al fondo
  const alK = tr(t, Tkm - 0.05, Tkm + 0.2);
  if (alK > 0) { const P = pantalla(t, 0.3, LARGO); k.etiqueta(g, P.x - 90, P.y - 130, "1,2 km", "255,236,190", alK, 56); g.save(); g.globalAlpha = alK; g.strokeStyle = "rgba(255,236,190,0.9)"; g.lineWidth = 3; g.beginPath(); g.moveTo(P.x, P.y - 54); g.lineTo(P.x, P.y - 4); g.stroke(); g.restore(); }
}
