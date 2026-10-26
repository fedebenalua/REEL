// «Así que no se han perdido: están contando, para salir tantas que nadie pueda con ellas.» · «Envíaselo a ese amigo
// que lleva años diciendo que este finde sale.»
// Se vuelve al árbol del principio, con un corte en «Así»:
// - «Así que no se han perdido»: el suelo en corte, ancho, lleno de ninfas negras, cada una en su cámara con sus marcas.
// - «están contando»: las marcas de todas corren hasta 17 a la vez y relucen.
// - «para salir tantas»: giran hacia arriba y suben juntas; la cámara sube con ellas; revientan el suelo y salen
//   volando hacia la copa.
// - «Envíaselo…»: una cigarra se posa en el tronco, donde empezó el vídeo, y canta; en «sale», canta más fuerte. El
//   último fotograma es el primero (Z 2.5 en la cigarra del tronco, bajando).
import * as k from "#kit";
import { v } from "#voz";
import { canto, cigarra, hueco, marcas, mundoArbol, ninfa, sinVista, terrones, velo, vista } from "../mundo.js";

const f11 = v.frase(11), f12 = v.frase(12);
export const desde = (vz) => vz.frase(11).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const T0 = f11.inicio, Tcont = f11.t("contando"), Tpara = f11.t("para"), Tsal = f11.t("salir"), Tnad = f11.t("nadie");
const Tenv = f12.inicio, Tamigo = f12.t("amigo"), Tanos = f12.t("anos"), Tfinde = f12.t("finde"), Tsale = f12.t("sale");
const FIN = 59.2;
const CIG = [44, -1150], LC = 320;

// las ninfas: en una rejilla con algo de desorden, todas de diecisiete años
const az = azar(909);
const NINFAS = [];
for (const [fila, y] of [[0, 430], [1, 800], [2, 1170], [3, 1540]]) for (const [col, x] of [[0, -640], [1, -80], [2, 470]]) {
  NINFAS.push({ x: x + (az() - 0.5) * 120 + (fila % 2 ? 60 : -40), y: y + (az() - 0.5) * 70, L: 220 + az() * 30, n0: 11 + Math.floor(az() * 5), d: az() * 0.3, vx: (az() - 0.5) * 900, vy: 1200 + az() * 500, gi: (az() - 0.5) * 0.6 });
}
const SUBE = 1.05;
const sube = (p) => Tpara - 0.1 + p.d;
const fuera = (p) => sube(p) + SUBE;

// la cámara
const claves = [
  [T0 - 0.5, [0.7, -60, 1000]],
  [T0, [0.67, -60, 975]],
  [Tpara, [0.62, -60, 940]],
  [Tsal + 0.9, [0.5, -80, 120]],
  [Tnad + 0.9, [0.4, -20, -900]],
  [Tenv + 0.4, [0.42, 0, -1050]],
  [Tanos, [1.3, 40, -1260]],
  [Tfinde, [2.2, 44, -1215]],
  [FIN, [2.5, 44, -1160]],
  [FIN + 0.5, [2.5, 44, -1020]],
];
const cZ = k.curva(claves.map(([t, c]) => [t, Math.log(c[0])])), cX = k.curva(claves.map(([t, c]) => [t, c[1]])), cY = k.curva(claves.map(([t, c]) => [t, c[2]]));
const cam = (t) => [Math.exp(cZ(t)), cX(t), cY(t)];

// la que se posa: viene volando desde arriba a la derecha
const Tposa = Tamigo + 0.7;
function posada(t) {
  const u = su(tr(t, Tenv - 0.3, Tposa));
  const x = mez(900, CIG[0], u) + Math.sin(u * 5) * 60 * (1 - u), y = mez(-2300, CIG[1], u);
  return { x, y, ang: (1 - u) * -0.6, alas: 1 - su(tr(t, Tposa - 0.2, Tposa + 0.1)) };
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  mundoArbol(g, t, Z, cx, cy, { huecos: false });
  vista(g, Z, cx, cy);
  const cuenta = su(tr(t, Tcont - 0.35, Tcont + 0.35));
  const luz = k.pulso(t, Tcont + 0.4, 0.5);
  for (const p of NINFAS) {
    const s0 = sube(p), u = tr(t, s0, s0 + SUBE), uu = u * u;
    const al = 1 - su(tr(t, fuera(p) + 1.2, fuera(p) + 1.6));
    // la cámara y el túnel que deja al subir
    hueco(g, p.x + 15, p.y + 8, p.L * 0.7, p.L * 0.42, al);
    const y = mez(p.y, -30, uu), ang = -Math.PI / 2 * su(tr(t, s0 - 0.25, s0 + 0.1));
    if (u > 0 && u < 1) {
      g.save(); g.globalAlpha = al; g.strokeStyle = "#170b05"; g.lineCap = "round"; g.lineWidth = p.L * 0.42;
      g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x, y); g.stroke(); g.restore();
    }
    // sus marcas, que suben a 17 en «contando»
    const n = Math.round(mez(p.n0, 17, cuenta) * 4) / 4;
    const am = 1 - su(tr(t, s0 + 0.2, s0 + 0.6));
    if (am > 0.01) { g.save(); g.globalAlpha = am; marcas(g, p.x - 170, p.y - p.L * 0.62, n, 78, 0.35 + 0.65 * luz); g.restore(); }
    if (u < 1) ninfa(g, p.x, y, p.L, ang, t, { tono: 1 });
    else {
      // ya fuera: vuela hacia arriba
      const w = t - fuera(p);
      const fx = p.x + p.vx * w * 0.6, fy = -40 - p.vy * w - 300 * w * w;
      cigarra(g, fx, fy, p.L * 1.15, p.gi + Math.sin(w * 3 + p.x) * 0.15, t, { tipo: 1, alas: 1 });
    }
    terrones(g, p.x, 0, t - fuera(p), 0.7, p.n0);
    k.brillo(g, p.x, y, 260, "255,190,110", 0.5 * luz * am);
  }
  // la que se posa y canta, donde empezó
  if (t > Tenv - 0.3) {
    const c = posada(t);
    const canta = su(tr(t, Tposa + 0.2, Tposa + 0.6)) * (1 + 0.6 * k.pulso(t, Tsale + 0.1, 0.4));
    canto(g, CIG[0], CIG[1] - 40, t, Math.min(1, canta), 520 * (0.9 + 0.3 * Math.min(1, canta)));
    cigarra(g, c.x, c.y, LC, c.ang, t, { tipo: 0, canta: Math.min(1, canta), alas: c.alas });
  }
  sinVista(g);
  velo(g, 0.45);
}
