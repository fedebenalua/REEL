// «...one tiny rubber washer.» … «water sneaks past.»
// El grifo por dentro, cortado. Macro de la arandela roja (el agua corre por debajo; aro de luz en «washer»). Se aleja y
// se ve la maneta girar y cerrar: en «squeezes» la arandela aprieta el asiento. Flechas de la presión en «hold the
// water back». «years»: la arandela envejece (se oscurece, se aplasta, se agrieta) y en «sneaks» el agua se cuela por
// la rendija y gotea por la boca.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaCorte, G } from "../corte.js";
import { rutaCam, aPant, velo, viñeta } from "../mundo.js";

export const desde = (vz) => vz.frase(3).t("tiny") - 0.04;
export const FIN = v.frase(6).inicio - 0.04;
const { suave: su, tramo: tr, mez } = k;
const F3 = v.frase(3), F4 = v.frase(4), F5 = v.frase(5);
const Twasher = F3.t("washer"), Tsq = F4.t("squeezes"), Tseat = F4.t("seat"), Thold = F4.t("hold"), Tyears = F5.t("years"), Tflat = F5.t("flat"), Tsneaks = F5.t("sneaks"), Tpast = F5.t("past");
const T0 = desde(v);

const FULL = { x: 155, y: 200, s: 0.9 };
const CAMS = [
  [T0, { x: 40, y: 490, s: 2.5 }], [F4.inicio + 0.1, { x: 40, y: 490, s: 2.5 }],
  [Tsq - 0.4, FULL], [Tsq + 1.0, FULL],
  [Tseat + 0.3, { x: 0, y: 520, s: 1.9 }], [F5.inicio + 0.2, { x: 0, y: 520, s: 1.9 }],
  [Tsneaks - 0.15, { x: 40, y: 540, s: 1.9 }], [Tpast + 0.5, { x: 300, y: 700, s: 1.1 }], [FIN, { x: 300, y: 700, s: 1.1 }],
];
const abre = (t) => 1 - su(tr(t, Tsq - 0.05, Tsq + 0.95));
const desg = (t) => su(tr(t, Tyears + 0.1, Tflat + 0.9));

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS), ab = abre(t), d = desg(t);
  const dy = -G.abierto * ab;
  const fuga = su(tr(t, Tsneaks - 0.1, Tpast + 0.3));
  const flujo = Math.max(ab > 0.02 ? ab : 0, fuga * 0.22);
  dibujaCorte(g, t, {
    cam, vastagoDy: dy, desgaste: d, apreta: su(tr(t, Tsq + 0.8, Tsq + 1.0)) * (1 - 0.9 * d),
    maneta: { dy, giro: 9.4 * (1 - ab) },
    tuerca: { ang: 0.6 },
    flujo, vastagoBot: G.arandelaY + dy + 40,
    presion: su(tr(t, Thold - 0.2, Thold + 0.3)) * (0.55 + 0.45 * (1 - 0.5 * fuga)),
    gotasSalida: [[Tpast + 0.1, 0.6], [Tpast + 0.75, 0.6]],
    despues: (g2, tt) => {
      // el agua que se cuela por la rendija entre la arandela gastada y el asiento
      if (fuga > 0.01) {
        const gy0 = G.arandelaY + G.arandelaTh * (1 - 0.34 * d), alto = Math.max(2, 540 - gy0);
        g2.save(); g2.globalAlpha = Math.min(1, fuga * 1.4);
        const gr = g2.createLinearGradient(0, gy0, 0, 540); gr.addColorStop(0, "rgba(160,232,255,0.95)"); gr.addColorStop(1, "rgba(40,140,230,0.95)");
        g2.fillStyle = gr; g2.fillRect(-98, gy0, 196, alto);
        g2.strokeStyle = "rgba(255,255,255,0.85)"; g2.lineWidth = 3;
        for (let i = 0; i < 5; i++) { const q = (tt * 1.6 + i / 5) % 1; g2.beginPath(); g2.moveTo(-90 + q * 180, gy0 + alto * 0.5); g2.lineTo(-90 + q * 180 + 22, gy0 + alto * 0.5); g2.stroke(); }
        g2.restore();
        k.brillo(g2, 0, 535, 300, "140,225,255", 0.4 * fuga);
      }
      // el aro de luz alrededor de la arandela en «washer»
      const u = tr(tt, Twasher - 0.05, Twasher + 0.9);
      if (u > 0 && u < 1) {
        k.brillo(g2, 0, G.arandelaY + dy + 20, 420, "255,170,120", 0.55 * Math.sin(u * Math.PI));
        g2.save(); g2.globalCompositeOperation = "lighter"; g2.strokeStyle = `rgba(255,200,150,${0.85 * (1 - u)})`; g2.lineWidth = 6;
        g2.beginPath(); g2.ellipse(0, G.arandelaY + dy + 20, 100 + 160 * k.entra(u), 40 + 60 * k.entra(u), 0, 0, 6.2832); g2.stroke(); g2.restore();
      }
    },
  });
  // las etiquetas, en pantalla
  const lw = su(tr(t, Twasher + 0.02, Twasher + 0.25)) * (1 - su(tr(t, Tsq - 0.5, Tsq - 0.3)));
  if (lw > 0) { const [x, y] = aPant(cam, -100, G.arandelaY + dy - 40); k.etiqueta(g, 70, 1420, "rubber washer", "255,160,130", lw, 52); }
  const ls = su(tr(t, Tseat + 0.05, Tseat + 0.3)) * (1 - su(tr(t, Thold + 0.7, Thold + 0.9)));
  if (ls > 0) { k.etiqueta(g, 70, 1420, "seat", "255,225,140", ls, 52); }
  const yr = su(tr(t, Tyears, Tyears + 0.2)) * (1 - su(tr(t, Tflat + 0.9, Tflat + 1.2)));
  if (yr > 0) { const n = Math.round(10 * su(tr(t, Tyears + 0.1, Tflat))); k.pastilla(g, 290, 1230, String(n), "years", "255,225,170", yr, 112); }
  velo(g, 0.32); viñeta(g, 0.4);
  const ent = 1 - su(tr(t, T0, T0 + 0.2));
  if (ent > 0) { g.fillStyle = `rgba(2,6,10,${ent})`; g.fillRect(0, 0, 1080, 1920); }
}
