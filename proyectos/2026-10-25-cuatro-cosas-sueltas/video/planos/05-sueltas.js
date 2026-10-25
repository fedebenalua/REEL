// «Si llegan sueltas y no puedes repetirlas, el montón se encoge. Cowan juntó esas pruebas. De media, unas cuatro.»
// Las siete cosas, el eco se corta, tres se caen y quedan cuatro.
import * as k from "#kit";
import { v } from "#voz";
import { cosa, fondo, numero, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(8).inicio;

const f8 = v.frase(8), f9 = v.frase(9);
const Trep = f8.t("repetirlas"), Tenc = f8.t("encoge"), Tcuatro = f9.t("cuatro");
const CAEN = new Set([0, 2, 5]);
const QUIETAS = [1, 3, 4, 6];
const INICIO = [
  [250, 760], [540, 700], [830, 780],
  [220, 1120], [540, 1080], [860, 1140],
  [540, 1420],
];
const FINAL = [
  [210, 820], [870, 820], [210, 1220], [870, 1220],
];

export function dibuja(g, t) {
  fondo(g, t);
  const corta = k.suave(k.tramo(t, Trep - 0.05, Trep + 0.28));
  const cae = k.suave(k.tramo(t, Tenc - 0.05, Tenc + 0.9));
  const asienta = k.suave(k.tramo(t, Tcuatro - 0.45, Tcuatro + 0.15));
  const muestra4 = k.suave(k.tramo(t, Tcuatro - 0.05, Tcuatro + 0.25));

  if (corta < 0.95) {
    g.save();
    g.globalAlpha = 0.85 * (1 - corta);
    g.strokeStyle = "rgba(180,230,255,0.9)";
    g.lineWidth = 14;
    g.beginPath();
    g.arc(540, 1080, 220, 0.4, 5.4);
    g.stroke();
    g.beginPath();
    g.moveTo(700, 900);
    g.lineTo(760, 860);
    g.lineTo(720, 960);
    g.fillStyle = "rgba(180,230,255,0.9)";
    g.fill();
    g.restore();
  }
  if (corta > 0.15) {
    g.save();
    g.globalAlpha = Math.min(1, corta * 1.4) * (1 - k.suave(k.tramo(t, Tenc, Tenc + 0.4)));
    g.strokeStyle = "#ff3355";
    g.lineWidth = 22;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(360, 860);
    g.lineTo(740, 1280);
    g.stroke();
    g.restore();
  }

  let q = 0;
  for (let i = 0; i < 7; i++) {
    let x, y, s = 118, al = 1;
    if (CAEN.has(i)) {
      x = INICIO[i][0];
      y = k.mez(INICIO[i][1], 2100, cae);
      al = 1 - cae * 0.3;
      s = 118 * (1 - cae * 0.15);
    } else {
      const destino = FINAL[q++];
      x = k.mez(INICIO[i][0], destino[0], asienta);
      y = k.mez(INICIO[i][1], destino[1], asienta);
      s = k.mez(118, 150, asienta);
    }
    if (y < 2000) {
      g.save();
      g.globalAlpha = al;
      cosa(g, i, x, y, s);
      if (corta < 0.8 && !CAEN.has(i)) {
        g.globalAlpha = 0.28 * (1 - corta);
        cosa(g, i, x + 36, y + 28, s * 0.92);
      }
      g.restore();
    }
  }
  if (muestra4 > 0.02) numero(g, 540, 1040, "4", "255,214,90", 230, muestra4);
  velo(g);
}
