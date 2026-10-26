// «Así que crecen despacísimo: en todos esos años, solo cambian de piel cuatro veces.»
// Otro sitio: la cámara de la ninfa, de cerca. Se entra con un corte en «Así».
// - «Así que crecen despacísimo»: una ninfa pequeña y clara respira en su hueco y apenas crece.
// - «en todos esos años»: muda: se le abre la espalda con una raya de luz, sale más grande y blanda (blanca, que se
//   oscurece) y la piel vacía cae al suelo del hueco. Cuatro veces, hasta «veces», cada vez más grande; las cuatro
//   pieles quedan en fila, con su número. La cámara se aleja para que quepan.
import * as k from "#kit";
import { v } from "#voz";
import { grano, hueco, ninfa, piel, sinVista, velo, vista, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez } = k;
const f5 = v.frase(5);
const T0 = f5.inicio, Ten = f5.t("en"), Tcua = f5.t("cuatro"), Tvec = f5.t("veces"), Fin = f5.fin;
// las cuatro mudas, repartidas de «en todos» a «veces»
const MUDAS = [0, 1, 2, 3].map((i) => mez(Ten, Tvec - 0.1, i / 3));
export const mudas = MUDAS;
const DUR = 0.5;
const TAM = [210, 255, 305, 360, 430];
const SUELO = 330, FILA = [-470, -210, 75, 390];
const cam = k.curva([[T0, Math.log(2.3)], [Ten, Math.log(1.95)], [MUDAS[3] + 0.4, Math.log(0.86)]], 0, 0);
const camY = k.claves([[T0, -40], [Ten, -30], [MUDAS[3] + 0.4, 110]]);

export function dibuja(g, t) {
  const Z = Math.exp(cam(t)), cy = camY(t);
  sinVista(g); g.fillStyle = "#1a0d06"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, 0, cy);
  // la tierra alrededor
  const sg = g.createRadialGradient(0, 0, 200, 0, 0, 1600); sg.addColorStop(0, "#6b4426"); sg.addColorStop(1, "#2a160a");
  g.fillStyle = sg; g.fillRect(-1400, -1800, 2800, 3600);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.85;
  for (let i = -2; i < 2; i++) for (let j = -2; j < 2; j++) g.drawImage(grano, i * 800, j * 900, 800, 900);
  g.globalAlpha = 0.5; g.drawImage(k.manchas, -1400, -1800, 2800, 3600);
  g.restore();
  // el hueco, grande, con luz cálida dentro
  hueco(g, 0, 40, 760, 420);
  k.brillo(g, -60, -40, 1400, "255,170,90", 0.28);
  // las pieles que ya han caído, en fila
  for (let i = 0; i < 4; i++) {
    const u = tr(t, MUDAS[i] + DUR * 0.45, MUDAS[i] + DUR * 1.1);
    if (t < MUDAS[i] + DUR * 0.3) continue;
    const c = su(u), x = mez(0, FILA[i], c), y = mez(0, SUELO, c) - 120 * Math.sin(Math.PI * c) * 0.3, a = mez(0, 0.25 + i * 0.05, c);
    piel(g, x, y, TAM[i], a * (i % 2 ? -1 : 1) * 0.5);
    const ln = su(tr(t, MUDAS[i] + DUR * 1.1, MUDAS[i] + DUR * 1.4));
    if (ln > 0.01) {
      g.save(); g.globalAlpha = ln; g.font = "800 84px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.arc(FILA[i], SUELO + 150, 60, 0, 6.2832); g.fill();
      g.fillStyle = "#ffd28a"; g.fillText(String(i + 1), FILA[i], SUELO + 154);
      g.restore();
    }
  }
  // la ninfa: crece en cada muda
  let n = 0; while (n < 4 && t > MUDAS[n] + DUR * 0.3) n++;
  const ultima = n > 0 ? MUDAS[n - 1] : -10;
  const crece = n < 4 ? su(tr(t, T0, Ten)) * 0.06 : 0;
  const L = mez(TAM[n], n > 0 ? TAM[n] : TAM[0], 0) * (1 + (n === 0 ? crece : 0));
  const sale = su(tr(t, ultima + DUR * 0.3, ultima + DUR));
  const Lx = n > 0 ? mez(TAM[n - 1], TAM[n], sale) : L;
  const palida = n > 0 ? 1 - su(tr(t, ultima + DUR * 0.6, ultima + DUR * 1.6)) : 0;
  const empuja = n > 0 ? Math.sin(Math.PI * sale) * 30 : 0;
  ninfa(g, 30 + empuja, -30 - Lx * 0.05, Lx, -0.05, t, { tono: 0.2, palida: palida * 0.85 });
  // la raya de luz por la espalda justo antes de cada muda
  for (let i = 0; i < 4; i++) {
    const a = k.pulso(t, MUDAS[i] + DUR * 0.18, 0.12);
    if (a < 0.02) continue;
    const Lm = TAM[i];
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    g.strokeStyle = `rgba(255,240,200,${a})`; g.lineWidth = 12; g.beginPath(); g.moveTo(30 + Lm * 0.3, -30 - Lm * 0.13); g.quadraticCurveTo(30 + Lm * 0.1, -30 - Lm * 0.27, 30 - Lm * 0.05, -30 - Lm * 0.2); g.stroke();
    g.restore();
    k.brillo(g, 30 + Lm * 0.1, -30 - Lm * 0.22, Lm * 1.6, "255,230,180", 0.5 * a);
  }
  sinVista(g);
  vineta(g, 0.55);
  velo(g, 0.4);
}

export const momentos = { mudas: MUDAS };
