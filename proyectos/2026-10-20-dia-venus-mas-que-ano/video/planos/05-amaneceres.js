// «Por eso, entre un amanecer y el siguiente pasan ciento diecisiete días. / Y en un solo año de Venus, el Sol sale casi dos veces.»
// Vuelve el suelo de Venus, pero mirando más arriba, al cielo entero. Una cámara que sube un poco.
// - antes de «amanecer»: el cielo se enciende por el oeste (izquierda).
// - «amanecer»: sale el primer Sol, cruza el cielo y se pone por el este; la noche; y vuelve a salir por el oeste.
//   Abajo, una barra con los 225 días del año, y un Sol marcado cada vez que amanece.
// - «ciento diecisiete días»: el contador cuenta de un amanecer al siguiente.
// - frase 8: el año de Venus se acaba justo antes del tercer amanecer: dos soles marcados y el tercero, apagado.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, superficie, sol, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez } = k;
const F7 = v.frase(7), F8 = v.frase(8);
const T0 = F7.inicio, Tama = F7.t("amanecer"), Tdia = F7.t("dias"), FIN = v.frase(9).inicio;
const TS = Tama - 0.05;                       // el primer amanecer
const RITMO = 36;                             // días por segundo
const T1 = TS + 117 / RITMO, T2 = TS + 225 / RITMO;   // el segundo amanecer, y el final del año
const cam = camino2D([[T0, [1.0, 0, -140]], [FIN, [1.1, 0, -170]]]);

function dias(t) { return t < TS ? -14 * (1 - su(tr(t, T0, TS))) : t < T2 ? (t - TS) * RITMO : 225 + 6 * su(tr(t, T2, FIN - 0.2)); }

const BX = 150, ESC = 3.4, BY = 1735;

function solito(g, x, y, al, r = 30) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha = al; k.brillo(g, x, y, r * 4.4, "255,200,90", 0.9);
  g.fillStyle = "#ffe488"; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 5; g.stroke(); g.restore();
}

export function dibuja(g, t) {
  const s = dias(t), [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const u = ((s % 117) + 117) % 117 / 117;
  superficie(g, t, u);
  // el camino que hace el Sol, a puntos, y el este y el oeste
  g.save(); g.setLineDash([12, 22]); g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 5; g.lineCap = "round";
  g.beginPath(); for (let i = 0; i <= 40; i++) { const a = -0.14 + (Math.PI + 0.28) * (i / 40); const x = -Math.cos(a) * 480, y = 300 - Math.sin(a) * 700; if (i === 0) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); g.restore();
  g.save(); g.font = "800 62px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(255,255,255,0.3)";
  g.fillText("OESTE", -310, 365); g.fillText("ESTE", 310, 365); g.restore();
  // el fogonazo de cada amanecer
  for (const tf of [TS, T1]) { const ff = k.pulso(t, tf + 0.2, 0.2); if (ff > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, -480, 300, 1300, "255,190,100", 0.5 * ff); g.restore(); } }
  sinVista(g);
  // la barra del año
  const ba = su(tr(t, TS, TS + 0.4));
  if (ba > 0.01) {
    g.save(); g.globalAlpha = ba;
    k.redondo(g, BX, BY - 22, 225 * ESC, 44, 22); g.fillStyle = "rgba(255,255,255,0.14)"; g.fill();
    const w = Math.min(225, Math.max(0, s)) * ESC;
    g.save(); k.redondo(g, BX, BY - 22, 225 * ESC, 44, 22); g.clip(); const gr = g.createLinearGradient(BX, 0, BX + 225 * ESC, 0); gr.addColorStop(0, "rgba(255,170,60,0.6)"); gr.addColorStop(1, "rgb(255,210,90)"); g.fillStyle = gr; g.fillRect(BX, BY - 22, w, 44); g.restore();
    k.etiqueta(g, 40, BY - 100, "1 AÑO", "255,210,90", 1, 50);
    g.restore();
    solito(g, BX, BY, su(tr(t, TS, TS + 0.3)));
    solito(g, BX + 117 * ESC, BY, su(tr(t, T1, T1 + 0.3)));
    // el tercer amanecer, que no llega a tiempo: un Sol apagado al otro lado
    const a3 = su(tr(t, F8.inicio + 0.6, F8.inicio + 1.2));
    if (a3 > 0.01) { g.save(); g.globalAlpha = 0.5 * a3; g.strokeStyle = "rgba(255,210,90,0.9)"; g.setLineDash([8, 8]); g.lineWidth = 5; g.beginPath(); g.arc(BX + 234 * ESC, BY, 30, 0, 6.2832); g.stroke(); g.restore(); }
  }
  // el contador de un amanecer al siguiente
  const c = Math.max(0, Math.min(117, s)), pa = su(tr(t, TS + 0.1, TS + 0.4)) * (1 - su(tr(t, F8.inicio + 0.5, F8.inicio + 0.9)));
  k.pastilla(g, BX + 117 * ESC / 2, 1590, `${Math.round(c)}`, "días", "255,200,90", pa, 84);
  velo(g, 0.35);
  vineta(g, 0.45);
}

export const momentos = { amanecer: Tama, dias: Tdia };
