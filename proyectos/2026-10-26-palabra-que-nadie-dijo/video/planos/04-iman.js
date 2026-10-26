// Las tres palabras tiran de dormir. Luego el oído y la idea caen en el mismo hueco, y sobra un fotograma.
import * as k from "#kit";
import { v } from "#voz";
import { ficha, hilo, luces, noche, recuerdo, suelo, velo } from "../mundo.js";

export const desde = "porque";

const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const Ttodas = f8.t("todas"), Ttir = f8.t("tiraban"), Tdor = f8.t("dormir");
const Tdis = f9.t("distingue"), Toyo = f9.t("oyo"), Tvino = f9.t("vino");
const Tarma = f10.t("arma"), Tmas = f10.t("mas");
const Tenv = f11.t("enviaselo"), Ttodo = f11.t("todo");

const camara = k.ruta([
  [f8.inicio - 0.2, { pos: [0, 0.28, 5.7], mira: [0, 0.02, 2.0] }],
  [Ttir, { pos: [0, 0.22, 5.15], mira: [0, 0.0, 1.9] }],
  [Tdor + 0.25, { pos: [0, 0.18, 4.9], mira: [0, -0.02, 1.8] }],
  [Tdis, { pos: [0, 0.2, 5.2], mira: [0, 0.0, 1.85] }],
  [Toyo, { pos: [-0.15, 0.16, 4.7], mira: [-0.05, 0.0, 1.7] }],
  [Tvino, { pos: [0.1, 0.14, 4.55], mira: [0.02, -0.02, 1.65] }],
  [Tarma, { pos: [0, 0.2, 5.0], mira: [0, -0.12, 1.8] }],
  [Tmas, { pos: [0, 0.12, 4.4], mira: [0, -0.02, 1.6] }],
  [Tenv, { pos: [0, 0.08, 3.6], mira: [0, 0.02, 1.35] }],
  [v.duracion, { pos: [0, 0.04, 3.15], mira: [0, 0.02, 1.2] }],
]);

const TRES = [
  [-0.72, -0.02, 2.35],
  [0.0, 0.38, 2.5],
  [0.72, -0.02, 2.35],
];
const NOMBRES = ["CAMA", "DESCANSO", "DESPIERTO"];

function oreja(g, x, y, s, al) {
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.fillStyle = "#f0b496";
  g.beginPath();
  g.ellipse(0, 0, s * 0.38, s * 0.58, 0, 0, 6.28);
  g.fill();
  g.fillStyle = "#e09878";
  g.beginPath();
  g.ellipse(s * 0.06, 0, s * 0.18, s * 0.32, 0.2, 0, 6.28);
  g.fill();
  g.strokeStyle = "rgba(120,60,40,0.45)";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(s * 0.02, s * 0.02, s * 0.12, 0.4, 2.4);
  g.stroke();
  g.restore();
}

function nube(g, x, y, s, al) {
  g.save();
  g.globalAlpha *= al;
  g.fillStyle = "#fff6e8";
  for (const [dx, dy, rx, ry] of [[0, 0.05, 0.42, 0.28], [0.32, -0.02, 0.3, 0.22], [-0.3, 0, 0.28, 0.2], [0.05, -0.16, 0.26, 0.18]]) {
    g.beginPath();
    g.ellipse(x + dx * s, y + dy * s, rx * s, ry * s, 0, 0, 6.28);
    g.fill();
  }
  g.restore();
}

export function dibuja(g, t) {
  const cam = camara(t);
  noche(g, 0.05 + 0.04 * Math.sin(t * 1.3));
  luces(g, cam, 0.55);
  suelo(g, cam);

  const tira = k.suave(k.tramo(t, Ttodas - 0.15, Tdor + 0.05));
  const apagaTres = 1 - k.suave(k.tramo(t, Tdis - 0.15, Tdis + 0.45));
  const posD = k.mezV([0, -0.55, 3.3], [0, -0.35, 2.05], tira);
  const Pd = ficha(g, cam, posD, "DORMIR", { fantasma: 1, al: apagaTres > 0.05 ? 1 : k.suave(k.tramo(t, Tarma - 0.2, Tarma + 0.2)), alto: k.mez(0.62, 0.78, tira) });

  NOMBRES.forEach((nombre, i) => {
    const pos = TRES[i].slice();
    pos[1] += Math.sin(t * 1.3 + i) * 0.02 * apagaTres;
    const P = ficha(g, cam, pos, nombre, { al: apagaTres, alto: 0.48 });
    if (tira > 0.05 && tira < 0.98) hilo(g, P, Pd, apagaTres * (0.35 + 0.65 * tira));
  });

  const llegaCaminos = k.suave(k.tramo(t, Tdis - 0.05, Tdis + 0.4));
  const orejaP = k.proyecta(cam, [-1.15, 0.05, 1.9]);
  const nubeP = k.proyecta(cam, [1.2, 0.2, 1.95]);
  if (llegaCaminos > 0.02 && t < Tarma + 0.15) {
    if (orejaP) {
      const s = (k.F * 0.7) / orejaP.z;
      oreja(g, orejaP.x, orejaP.y, s, llegaCaminos * (t < Toyo ? 0.45 + 0.55 * k.tramo(t, Tdis, Toyo) : 1));
      const u = k.tramo(t, Toyo - 0.1, Toyo + 0.55);
      if (u > 0 && u < 1) {
        g.save();
        g.globalAlpha *= (1 - u) * llegaCaminos;
        g.strokeStyle = "rgba(255,210,140,0.8)";
        g.lineWidth = 5;
        g.beginPath();
        g.arc(orejaP.x + s * 0.35, orejaP.y, 20 + u * 90, -0.7, 0.7);
        g.stroke();
        g.restore();
      }
    }
    if (nubeP) {
      const s = (k.F * 0.85) / nubeP.z;
      const alN = llegaCaminos * k.suave(k.tramo(t, Tvino - 0.35, Tvino + 0.1));
      nube(g, nubeP.x, nubeP.y, s, alN);
    }
    const uO = k.entra(k.tramo(t, Toyo - 0.05, Toyo + 0.7));
    const uN = k.entra(k.tramo(t, Tvino - 0.08, Tvino + 0.55));
    if (uO > 0) ficha(g, cam, k.mezV([-1.05, 0.02, 1.85], [-0.12, 0.05, 1.6], uO), "DORMIR", { fantasma: 1, al: llegaCaminos, alto: 0.42 });
    if (uN > 0) ficha(g, cam, k.mezV([1.15, 0.18, 1.9], [0.12, 0.05, 1.58], uN), "DORMIR", { fantasma: 1, al: llegaCaminos * (t < Tarma ? 1 : 1 - k.tramo(t, Tarma - 0.1, Tarma + 0.25)), alto: 0.42 });
  }

  const arma = k.suave(k.tramo(t, Tarma - 0.15, Tmas + 0.15));
  if (arma > 0.02) {
    const extra = k.suave(k.tramo(t, Tmas - 0.08, Tmas + 0.45));
    const tipos = ["ventana", "cama", "tarta", "ventana"];
    const abre = k.mez(0.55, 0.95, extra);
    tipos.forEach((tipo, i) => {
      const lado = i < 2 ? -1 : 1;
      const ix = i < 2 ? i : i - 1;
      const x = lado * (0.35 + ix * abre);
      const P = k.proyecta(cam, [x, -0.25, 1.75]);
      if (!P) return;
      const s = (k.F * 0.62) / P.z;
      const queda = 1 - k.suave(k.tramo(t, Tenv - 0.05, Tenv + 0.55));
      recuerdo(g, P.x - s * 0.45, P.y - s * 0.55, s * 0.9, s * 1.15, tipo, arma * queda);
    });
    const c = k.proyecta(cam, [0, -0.05 + (1 - extra) * 0.35, k.mez(2.1, 1.45, k.suave(k.tramo(t, Tenv, v.duracion)))]);
    if (c) {
      const crece = k.mez(0.55, 1.7, k.suave(k.tramo(t, Tenv - 0.1, Ttodo + 0.45)));
      ficha(g, cam, [0, -0.02, k.mez(1.7, 1.15, k.suave(k.tramo(t, Tenv, Ttodo)))], "DORMIR", {
        fantasma: 1,
        al: extra,
        alto: 0.5 * crece,
      });
    }
  }

  velo(g);
}
