// «Segundo: huye de la autopista, que es donde más cara está.»
// La autopista de noche, ancha, con farolas naranjas y camiones. Se entra con un corte en «Segundo».
// - «Segundo: huye de la autopista»: la cámara corre por el carril, entre estelas; a la derecha llega el área de
//   servicio con su tótem rojo.
// - «que es donde»: la cámara frena y gira hacia el tótem, que llena la pantalla a 1,49.
// - «más cara está»: el precio sube rodando hasta 1,69, con un golpe de luz roja. Reposa hasta el corte.
import * as k from "#kit";
import { v } from "#voz";
import { noche, totem, gasolinera, velo, ROJO, MARCA_B } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f5 = v.frase(5);
const T0 = f5.inicio, Taut = f5.t("autopista"), Tque = f5.t("que"), Tcara = f5.t("cara"), Fin = f5.fin;
const Tpara = Tque + 0.4, Tsube = Tcara - 0.1, Troja = Tcara + 0.45;
export const momentos = { sube: Tsube, roja: Troja };

const HOR = 900, K = 1015;
const VEL = 60;
const recorrido = (t) => { const s = Math.min(Math.max(0, t - T0 + 0.2), Tpara - T0 + 0.2), L = Tpara - T0 + 0.2; return VEL * (s - (s * s) / (2 * L)); };
const TOTAL = recorrido(Tpara);

const azC = azar(55);
const COCHES = Array.from({ length: 30 }, () => { const ida = azC() < 0.45; return { ida, x: ida ? -2 - azC() * 5 : 0.6 + azC() * 3.4, z0: azC() * 90, v: ida ? 36 : -10, camion: azC() < 0.3 }; });
const FAROLAS = Array.from({ length: 10 }, (_, i) => ({ z0: i * 10 }));

export function dibuja(g, t) {
  const d = recorrido(t), d0 = recorrido(t - 1 / 30);
  // la cámara gira hacia el área de servicio al frenar
  const gira = su(tr(t, Tque - 0.5, Tpara + 0.1));
  const pan = 700 * gira;
  const sx = (X, z) => 540 - pan + (X * K) / z;
  const sy = (Y, z) => HOR + ((2.68 - Y) * K) / z;
  noche(g, t, HOR, 1.1, pan * 0.3);
  // el resplandor naranja de la autopista
  k.brillo(g, 540 - pan, HOR, 2200, "255,150,60", 0.4);
  // el asfalto: seis carriles y la mediana
  g.fillStyle = "#1a1620"; g.beginPath(); g.moveTo(sx(0, 400), HOR); g.lineTo(sx(-9, 1.6), 1920); g.lineTo(sx(5.5, 1.6), 1920); g.fill();
  g.fillStyle = "rgba(255,255,255,0.8)";
  for (const X of [-6, -3.6, 2.2, 4.2]) for (let i = 0; i < 14; i++) {
    const z = ((((i * 7 - d) % 98) + 98) % 98) + 1.2, z1 = z + 3;
    g.beginPath(); g.moveTo(sx(X - 0.07, z), sy(0, z)); g.lineTo(sx(X + 0.07, z), sy(0, z)); g.lineTo(sx(X + 0.07, z1), sy(0, z1)); g.lineTo(sx(X - 0.07, z1), sy(0, z1)); g.fill();
  }
  // la mediana: una barrera de metal
  g.fillStyle = "#6f7484"; g.beginPath(); g.moveTo(sx(-0.6, 1.5), sy(0.9, 1.5)); g.lineTo(sx(-0.6, 300), sy(0.9, 300)); g.lineTo(sx(-0.6, 300), sy(0, 300)); g.lineTo(sx(-0.6, 1.5), sy(0, 1.5)); g.fill();
  // el área de servicio y su tótem
  const zt = 4 + (TOTAL - d) * 0.5, zg = zt + 9;
  gasolinera(g, sx(5.5, zg), sy(0, zg), 16 / zg, { marca: MARCA_B });
  // las luces: coches, camiones y farolas
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const c of COCHES) {
    const z = ((((c.z0 - d - c.v * (t - T0)) % 90) + 90) % 90) + 1.5, za = z + Math.abs(d - d0) * 3 + (c.ida ? 1.6 : 0.4);
    const col = c.ida ? "255,240,210" : "255,50,60", alto = c.camion ? 1.4 : 0.5;
    for (const dx of [-0.4, 0.4]) {
      const a = Math.min(1, 14 / z);
      g.strokeStyle = `rgba(${col},${a})`; g.lineWidth = Math.min(30, 130 / z) + 1;
      g.beginPath(); g.moveTo(sx(c.x + dx, za), sy(alto, za)); g.lineTo(sx(c.x + dx, z), sy(alto, z)); g.stroke();
    }
    k.brillo(g, sx(c.x, z), sy(alto, z), Math.min(500, 2600 / z), col, 0.5 * Math.min(1, 10 / z));
  }
  for (const f of FAROLAS) {
    const z = ((((f.z0 - d) % 100) + 100) % 100) + 1.2, za = z + Math.abs(d - d0) * 2.5;
    for (const X of [-0.6]) {
      g.strokeStyle = `rgba(255,170,70,${0.8 * Math.min(1, 10 / z)})`; g.lineWidth = Math.min(40, 160 / z);
      g.beginPath(); g.moveTo(sx(X, za), sy(7, za)); g.lineTo(sx(X, z), sy(7, z)); g.stroke();
      k.brillo(g, sx(X, z), sy(7, z), Math.min(1000, 5000 / z), "255,160,60", 0.75 * Math.min(1, 8 / z));
    }
  }
  g.restore();
  // el precio: 1,49 y, en «más cara», sube rodando a 1,69
  const sube = k.entra(tr(t, Tsube, Troja));
  totem(g, sx(3.2, zt), sy(0, zt) - 100 * 4 / zt, 4.4 / zt, { marca: MARCA_B, p1: [1, mez(4, 6, sube), 9], c1: ROJO, p2: [1, mez(3, 5, sube), 9], c2: ROJO, rotulo2: "DIÉSEL" });
  k.brillo(g, sx(3.2, zt), 900, 1700, ROJO, 0.55 * k.pulso(t, Troja, 0.16));
  velo(g, 0.6);
}
