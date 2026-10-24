// «La redonda mide lo mismo por todos lados.»
// Gira, y un calibre dorado la mide en horizontal y en vertical: no cambia.
// Luego se ve el reborde, y la tapa intenta colarse y el reborde la para.
import * as k from "#kit";
import { v } from "#voz";
import { calibre, camara, sinVista, tapaRedonda, velo, vista } from "../mundo.js";

export const desde = "redonda";

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const Tmismo = f4.t("mismo");
const Testre = f5.t("estrecho");
const Trebor = f5.t("reborde");
const Tgires = f6.t("gires", 2);
const Tpara = f6.t("para");
const fin = v.t("igual") - 0.04;

const cam = camara([
  [f4.inicio - 0.2, 1.42, 0, 16],
  [Tmismo, 1.46, 0, 8],
  [11.45, 1.38, 0, 24],
  [f5.inicio + 0.35, 1.38, 0, 24],
  [Testre, 1.58, 0, 150],
  [Trebor, 1.7, 0, 190],
  [f6.inicio, 1.36, 0, 12],
  [Tpara, 1.32, 0, 8],
  [fin - 0.32, 1.3, 0, 6],
  [fin, 1.3, 0, 6],
]);

function vaiven(t, a, b) {
  const u = k.tramo(t, a, b);
  return Math.sin(u * Math.PI);
}

export function dibuja(g, t) {
  const c = cam(Math.min(t, fin));
  const ang = k.claves([
    [f4.inicio - 0.1, -0.4],
    [Tmismo, 0.15],
    [f5.inicio, 0.9],
    [f6.inicio, 1.7],
    [Tpara, 2.4],
    [fin, 2.4],
  ])(t);
  const calAng = k.claves([
    [f4.inicio, 0],
    [Tmismo, 0],
    [11.4, Math.PI / 2],
    [f5.inicio + 0.45, Math.PI / 2],
    [fin, Math.PI / 2],
  ])(t);
  const calAl = k.claves([
    [f4.inicio, 0],
    [f4.inicio + 0.2, 1],
    [f5.inicio + 0.2, 1],
    [Testre, 0],
    [fin, 0],
  ])(t);
  const empuje = 110 * vaiven(t, f6.inicio + 0.08, Tgires + 0.05) + 120 * vaiven(t, Tgires + 0.28, Tpara + 0.15);
  const anillo = Math.max(vaiven(t, Tgires, Tgires + 0.35), vaiven(t, Tpara - 0.05, Tpara + 0.35));
  // fondo oscuro, no es la calle: aquí solo está la tapa
  sinVista(g);
  g.fillStyle = "#07090e";
  g.fillRect(0, 0, 1080, 1920);
  const fondo = g.createRadialGradient(540, 900, 80, 540, 1000, 900);
  fondo.addColorStop(0, "#1a140e");
  fondo.addColorStop(1, "#07090e");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  vista(g, c.z, c.x, c.y);
  tapaRedonda(g, 0, ang, {
    dx: empuje,
    anilloDorado: anillo,
    reborde: Math.max(anillo, k.suave(k.tramo(t, Testre - 0.1, Trebor))),
  });
  calibre(g, calAng, 300, Math.max(0, Math.min(1, calAl)));
  g.restore();
  sinVista(g);
  velo(g, 0.8);
}
