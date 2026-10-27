// «¿Por qué les pasa? Aún no se sabe.» «Puede que su cerebro use palabras sin oírlas, o que piense de otra forma.»
// - La cabeza azul de cerca, con su cerebro de luz. «¿Por qué les pasa?»: una luz lo recorre buscando; las neuronas
//   se encienden a su paso y se apagan. «no se sabe»: la luz frena y se apaga sin haber encontrado nada.
// - «use palabras»: dentro aparecen palabras de oro con sus ondas; «sin oírlas»: las ondas se apagan y las palabras se
//   quedan transparentes, sin sonido.
// - «otra forma»: cada palabra se transforma en una forma de color (círculos, triángulos, cuadrados, estrellas).
import * as k from "#kit";
import { v } from "#voz";
import { CRANEO, ORO, AZUL, ROSA, VERDE, cabeza, fondo, forma, ondas, palabra, silencio, velo, vineta } from "../mundo.js";

export const desde = (v) => v.frase(12).inicio;
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, entra, pulso } = k;
const f12 = v.frase(12), f13 = v.frase(13);
const T0 = f12.inicio, Tpas = f12.t("pasa"), Taun = f12.t("aun"), Tsab = f12.t("sabe");
const Tcer = f13.t("cerebro"), Tuse = f13.t("use"), Tsin = f13.t("sin"), Toir = f13.t("oirlas"), To = f13.t("o"), Tpie = f13.t("piense"), Tfor = f13.t("forma");
const Tfin = v.frase(14).inicio;

// la cabeza, grande: su cráneo en (540, 930) de la pantalla
const S1 = 1.2, HX1 = 540 - CRANEO.x * S1 - 40, HY1 = 930 - CRANEO.y * S1;
// donde estaba en la prueba (04-prueba.js)
const HX0 = 330, HY0 = 1240, S0 = 0.62;

// ---------------------------------------------------------------- el cerebro de luz (local, centrado en el cráneo)
const CONTORNO = [[205, 40], [215, -55], [150, -140], [40, -175], [-80, -170], [-185, -120], [-235, -20], [-215, 60], [-150, 95], [-170, 140], [-90, 165], [-40, 120], [60, 110], [150, 95]];
function caminoCerebro(c) {
  const n = CONTORNO.length;
  c.beginPath(); c.moveTo((CONTORNO[0][0] + CONTORNO[1][0]) / 2, (CONTORNO[0][1] + CONTORNO[1][1]) / 2);
  for (let i = 1; i <= n; i++) {
    const p = CONTORNO[i % n], q = CONTORNO[(i + 1) % n];
    c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
  }
  c.closePath();
}
const NEU = (() => { const az = k.azar(5151), l = []; while (l.length < 90) { const x = -220 + az() * 430, y = -170 + az() * 300; if ((x / 215) ** 2 + ((y + 25) / 150) ** 2 < 1) l.push([x, y, az() * 6.28]); } return l; })();
const cerebroImg = (() => {
  const W = 600, H = 460, l = k.lienzo(W, H), c = l.getContext("2d");
  c.translate(W / 2, H / 2);
  caminoCerebro(c);
  const bg = c.createRadialGradient(-30, -80, 30, 0, -20, 300);
  bg.addColorStop(0, "rgba(140,200,255,0.5)"); bg.addColorStop(0.6, "rgba(70,110,230,0.35)"); bg.addColorStop(1, "rgba(40,50,160,0.3)");
  c.fillStyle = bg; c.fill();
  c.save(); c.clip();
  c.lineCap = "round"; c.strokeStyle = "rgba(190,225,255,0.4)"; c.lineWidth = 5;
  const az = k.azar(5252);
  for (let i = 0; i < 34; i++) {
    let x = -220 + az() * 440, y = -170 + az() * 300, a = az() * 6.28;
    c.beginPath(); c.moveTo(x, y);
    for (let s = 0; s < 6; s++) { a += (az() - 0.5) * 1.9; const nx = x + Math.cos(a) * 30, ny = y + Math.sin(a) * 30; c.quadraticCurveTo(x + Math.cos(a + 0.9) * 20, y + Math.sin(a + 0.9) * 20, nx, ny); x = nx; y = ny; }
    c.stroke();
  }
  c.restore();
  c.globalCompositeOperation = "lighter"; c.strokeStyle = "rgba(170,220,255,0.16)"; c.lineWidth = 2;
  for (let i = 0; i < NEU.length; i++) for (let j = i + 1; j < NEU.length; j++) { const d = Math.hypot(NEU[i][0] - NEU[j][0], NEU[i][1] - NEU[j][1]); if (d < 70) { c.beginPath(); c.moveTo(NEU[i][0], NEU[i][1]); c.lineTo(NEU[j][0], NEU[j][1]); c.stroke(); } }
  c.globalCompositeOperation = "source-over";
  c.lineWidth = 6; c.strokeStyle = "rgba(180,225,255,0.8)"; caminoCerebro(c); c.stroke();
  return l;
})();

// lo que piensa: ocho palabras, y la forma en la que se convierte cada una
const COSAS = [["vale", -120, -95], ["pan", 40, -125], ["luego", 150, -55], ["café", -180, 10], ["¿y si...?", -20, -20], ["venga", 120, 50], ["mañana", -90, 85], ["uf", 60, 120]];
const COLS = [ROSA, ORO, AZUL, VERDE, "190,130,255", "255,150,80", "120,230,255", ROSA];

export function dibuja(g, t) {
  const tf = t;
  fondo(g, tf, {});
  // la cámara se acerca al cerebro mientras se explica
  const z = mez(1, 1.22, su(tr(t, Tcer - 0.4, Tpie)));
  const crece = su(tr(t, T0 - 0.02, T0 + 0.75));
  const S = mez(S0, S1, crece), HX = mez(HX0, HX1, crece), HY = mez(HY0, HY1, crece);
  const cx = 540, cy = 930;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  const busca = tr(t, T0 + 0.05, Tsab + 0.2);
  const apaga = su(tr(t, Taun - 0.1, Tsab + 0.3));
  const enciende = su(tr(t, Tcer - 0.3, Tcer + 0.3));
  cabeza(g, HX, HY, S, tf, { tono: "azul", luz: mez(0.75, 0.5, crece) + 0.4 * enciende, dentro: (c) => {
    silencio(c, t, 0.85 * (1 - crece));
    c.save(); c.translate(CRANEO.x, CRANEO.y);
    c.globalAlpha = (0.7 + 0.3 * enciende) * crece;
    c.drawImage(cerebroImg, -300, -230);
    c.globalAlpha = 1;
    // la luz que busca: va y viene por el cerebro, frenando, y se apaga en «sabe»
    const bx = Math.sin(k.suave(busca) * 7.5) * 180, by = Math.cos(k.suave(busca) * 5.2) * 70 - 30;
    const al = su(tr(t, T0 - 0.05, T0 + 0.35)) * (1 - apaga);
    c.globalCompositeOperation = "lighter";
    if (al > 0.01) {
      k.brillo(c, bx, by, 360, "200,235,255", 0.7 * al);
      for (const [x, y] of NEU) { const d = Math.hypot(x - bx, y - by); if (d < 120) k.brillo(c, x, y, 44, "200,235,255", al * (1 - d / 120)); }
    }
    // las neuronas laten suave cuando el cerebro se enciende
    if (enciende > 0.01) for (const [x, y, f] of NEU) k.brillo(c, x, y, 34, "150,210,255", enciende * (0.35 + 0.3 * Math.sin(t * 3 + f)));
    c.globalCompositeOperation = "source-over";
    // las palabras de oro: con ondas en «use palabras»; transparentes en «sin oírlas»; formas en «otra forma»
    const salen = su(tr(t, Tuse - 0.2, Tuse + 0.35));
    const mudas = su(tr(t, Tsin - 0.1, Toir + 0.3));
    const cambia = (i) => su(tr(t, To + i * 0.1, To + 0.45 + i * 0.1));
    ondas(c, t, 0, -10, 40, 260, { periodo: 0.6, al: salen * (1 - mudas) * 0.9, ancho: 8 });
    COSAS.forEach(([p, x, y], i) => {
      const u = cambia(i), fl = Math.sin(t * 1.6 + i) * 6;
      if (u < 1) palabra(c, p, x, y + fl, 46 * mez(1, 0.6, u), salen * (1 - 0.6 * mudas) * (1 - u), ORO, 800);
      if (u > 0.01) forma(c, i % 4, x, y + fl, 34 * entra(u), t * 0.8 + i, COLS[i], u);
    });
    c.restore();
  } });
  g.restore();
  vineta(g, 0.55);
  velo(g, 0.45);
}
