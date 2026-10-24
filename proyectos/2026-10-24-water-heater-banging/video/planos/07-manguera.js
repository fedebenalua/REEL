// La manguera, el agua que aclara y la llave que se abre del todo.
import * as k from "#kit";
import { v } from "#voz";
import { desague, manguera, pila, tanque, valvula } from "../cosas.js";
import { camara, chorro, cuarto, gota, guante, rutaCam, suelo, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(8).inicio;
export const entrada = "corte";

const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const Topen = f8.t("open");
const Tblast = f9.t("blast");
const Tclear = f9.t("clear");
const Tclose = f9.t("close");
const Tway = f10.t("way");
const fin = v.frase(11).inicio;
const CAM = [
  [f8.inicio, { x: 80, y: 260, s: 1.35 }],
  [f8.t("tub"), { x: 700, y: 240, s: 1.45 }],
  [Topen, { x: 120, y: 340, s: 1.7 }],
  [Tblast, { x: 760, y: 260, s: 1.55 }],
  [Tclear, { x: 820, y: 250, s: 1.62 }],
  [Tclose, { x: 90, y: 360, s: 1.75 }],
  [f10.inicio, { x: -30, y: -470, s: 1.85 }],
  [Tway, { x: -20, y: -480, s: 2.15 }],
  [fin, { x: -20, y: -480, s: 2.1 }],
];

export function dibuja(g, t) {
  const abierto = k.suave(k.tramo(t, Topen, Topen + 0.35));
  const caudal = abierto * (1 - k.suave(k.tramo(t, Tclose, Tclose + 0.45))) * k.mez(0.55, 1, k.suave(k.tramo(t, Tblast, Tblast + 0.35)));
  const sucia = 1 - k.suave(k.tramo(t, Tblast + 0.15, Tclear));
  const nivel = k.suave(k.tramo(t, Topen + 0.2, Tclear)) * 0.85;
  const crack = k.suave(k.tramo(t, f9.t("crack"), f9.t("valve")));
  const full = k.suave(k.tramo(t, f10.inicio, Tway));
  const u = k.mez(k.mez(0, 0.38, crack), 1, full);
  const manoD = k.suave(k.tramo(t, Topen - 0.15, Topen + 0.2)) * (1 - k.suave(k.tramo(t, Topen + 0.45, Topen + 0.8)));
  const manoC = k.suave(k.tramo(t, Tclose - 0.1, Tclose + 0.2)) * (1 - k.suave(k.tramo(t, Tclose + 0.45, Tclose + 0.75)));
  const manoV = k.suave(k.tramo(t, f10.inicio, f10.inicio + 0.25)) * (1 - k.suave(k.tramo(t, Tway, Tway + 0.3)));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "servicio");
  suelo(g, 560, "#1a120c");
  tanque(g, -20, 20, { calor: 0, nivel: 0.55, esc: 0.9 });
  valvula(g, -30, -480, u, "#1f8cff");
  desague(g, 50, 430, abierto * (1 - k.suave(k.tramo(t, Tclose, Tclose + 0.4))));
  manguera(g, 50, 460, 620, 250, t, caudal, sucia);
  pila(g, 820, 220, t, sucia, nivel);
  if (caudal > 0.05) chorro(g, 680, 160, 390, 22 + caudal * 16, t, caudal, sucia);
  if (caudal > 0.4) {
    for (const n of [0, 1, 2, 3, 4, 5]) {
      const p = (t * 2.2 + n / 6) % 1;
      const px = 760 + Math.sin(n * 1.7 + t * 9) * 160 * p;
      const py = 250 - (280 * p - 220 * p * p);
      gota(g, px, py, 10 + n, (1 - p) * caudal);
    }
  }
  guante(g, 180, 400, 0.6, 1.05, manoD);
  guante(g, 200, 360, -0.4, 1.05, manoC);
  guante(g, 140, k.mez(-360, -470, u), 1.1 - u, 1.15, manoV);
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.7);
}
