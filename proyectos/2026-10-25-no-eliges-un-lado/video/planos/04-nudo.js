// Un nudo fuerte solo enciende a los que toca. El hilo que quiere cruzar se apaga.
// Luego los dos lados hacen su parte, y el destello del amigo no se queda solo en la derecha.
import * as k from "#kit";
import { v } from "#voz";
import { CERCA, cerebro, NUDO, sala, velo } from "../mundo.js";

export const desde = "enlace";

const f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12), f13 = v.frase(13), f14 = v.frase(14);
const Tenl = f10.t("enlace");
const Ttoca = f10.t("toca");
const Tent = f11.t("entero");
const Tsal = f12.t("sales");
const Tiz = f12.t("izquierdo");
const Tde = f12.t("derecho");
const Tvez = f13.t("vez");
const Tami = f14.t("amigo");
const Tder = f14.t("derecho");
const Fin = f14.fin;

const cam = k.ruta([
  [f10.inicio, { pos: [-0.62, 0.24, 1.05], mira: [-0.4, 0.2, 0.48] }],
  [Ttoca, { pos: [-0.15, 0.2, 2.15], mira: [-0.2, 0.12, 0.2] }],
  [Tent, { pos: [0.05, 0.22, 3.6], mira: [0, 0.05, 0] }],
  [Tsal, { pos: [0, 0.2, 3.15], mira: [0, 0.04, 0] }],
  [Tiz, { pos: [-0.25, 0.18, 2.9], mira: [-0.12, 0.06, 0] }],
  [Tde, { pos: [0.28, 0.18, 2.95], mira: [0.12, 0.05, 0] }],
  [Tvez, { pos: [0, 0.24, 3.25], mira: [0, 0.05, 0] }],
  [Tami, { pos: [0.15, 0.22, 3.35], mira: [0.08, 0.04, 0] }],
  [Tder, { pos: [0.4, 0.18, 2.7], mira: [0.28, 0.06, 0.1] }],
  [Tder + 0.45, { pos: [0, 0.22, 3.4], mira: [0, 0.04, 0] }],
  [v.duracion - 0.05, { pos: [0, 0.22, 3.35], mira: [0, 0.04, 0] }],
]);

function hilo(g, camara, a, b, col, al, grosor) {
  if (al < 0.03) return;
  const A = k.proyecta(camara, a), B = k.proyecta(camara, b);
  if (!A || !B) return;
  const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 - 30 * al;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(${col},${0.85 * al})`;
  g.lineWidth = grosor;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(A.x, A.y);
  g.quadraticCurveTo(mx, my, B.x, B.y);
  g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  const c = cam(t);
  const focoAl = k.suave(k.tramo(t, Tenl - 0.05, Ttoca)) * (1 - k.suave(k.tramo(t, Tsal, Tiz + 0.1)));
  const iz = k.suave(k.tramo(t, Tsal, Tiz + 0.15));
  const deBase = k.suave(k.tramo(t, Tde - 0.1, Tde + 0.25));
  const unido = k.suave(k.tramo(t, f13.inicio, Tvez + 0.15));
  const amigo = k.pulso(t, Tder, 0.14);
  sala(g, 0.25 + 0.45 * Math.max(iz, unido), 0.2 + 0.4 * Math.max(deBase, unido));
  cerebro(g, c, {
    t,
    iz: Math.max(iz, unido),
    de: Math.max(deBase, unido),
    unido,
    pulsoDer: amigo,
    foco: NUDO,
    focoR: 0.38,
    focoAl: focoAl * (1 - unido),
    chispas: 0.4 + 0.55 * Math.max(iz, deBase, unido),
  });
  const vecinos = k.suave(k.tramo(t, Tenl + 0.15, Ttoca));
  for (const p of CERCA) hilo(g, c, NUDO, p, "150,220,255", vecinos * (1 - 0.5 * k.suave(k.tramo(t, Tsal, Tiz))), 7);
  // el hilo que quiere llevarse el cerebro entero, y se queda a medias
  const intento = k.suave(k.tramo(t, Tent - 0.1, Tent + 0.35)) * (1 - k.suave(k.tramo(t, Tent + 0.45, Tent + 0.95)));
  if (intento > 0.02) {
    const fin = k.mezV(NUDO, [0.15, 0.12, 0.2], intento);
    hilo(g, c, NUDO, fin, "190,210,255", intento, 10);
  }
  // el puente corto, cuando los dos hacen su parte
  const puente = k.suave(k.tramo(t, f13.t("parte") - 0.05, Tvez));
  const quieto = 1 - k.suave(k.tramo(t, Fin - 0.05, Fin + 0.35));
  if (puente > 0.02) {
    const al = puente * (0.75 + 0.25 * quieto);
    hilo(g, c, [-0.2, 0.08, 0.15], [0.2, 0.08, 0.15], "255,220,190", al, 16);
    hilo(g, c, [-0.16, 0.22, 0.05], [0.16, 0.18, 0.08], "255,180,140", al * 0.8, 8);
    hilo(g, c, [-0.18, -0.02, 0.22], [0.18, 0.02, 0.18], "140,200,255", al * 0.75, 8);
  }
  const N = k.proyecta(c, NUDO);
  if (N && focoAl > 0.05) k.brillo(g, N.x, N.y, (k.F * 0.7) / N.z, "140,220,255", 0.75 * focoAl);
  // Al entrar, la luz del nudo llena el centro: otro sitio, no la sala de antes.
  const entraLuz = 1 - k.suave(k.tramo(t, Tenl, Tenl + 0.2));
  if (entraLuz > 0.02) {
    const rg = g.createRadialGradient(540, 1080, 40, 540, 1080, 620);
    rg.addColorStop(0, `rgba(235,250,255,${0.92 * entraLuz})`);
    rg.addColorStop(0.45, `rgba(120,190,255,${0.55 * entraLuz})`);
    rg.addColorStop(1, "rgba(8,12,28,0)");
    g.fillStyle = rg;
    g.fillRect(0, 520, 1080, 1400);
  }
  velo(g, 0.68);
}
