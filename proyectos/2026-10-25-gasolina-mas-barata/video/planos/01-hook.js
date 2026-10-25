// «¿Cómo puedes conseguir gasolina más barata?»
// La carretera de noche, a toda velocidad.
// - Fotograma 0: la cámara corre por la carretera entre estelas de faros y farolas que pasan; al fondo, el tótem de
//   una gasolinera que llega.
// - «gasolina»: el tótem ya llena la pantalla y la cámara frena delante; su precio marca 1,89 en rojo.
// - «más barata»: el precio cae rodando hasta 1,39 y se vuelve verde, con un fogonazo verde. Reposa hasta el corte.
import * as k from "#kit";
import { v } from "#voz";
import { noche, totem, gasolinera, velo, VERDE, ROJO, MARCA_A } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, azar } = k;
const f1 = v.frase(1);
const Tgas = f1.t("gasolina"), Tmas = f1.t("mas"), Tbar = f1.t("barata");
const Tpara = Tgas + 0.35, Tcae = Tmas - 0.05, Tverde = Tbar + 0.3;
export const momentos = { para: Tpara, verde: Tverde };

const HOR = 980, K = 1015, SUELO = 2720;
const VEL = 75;
const recorrido = (t) => { const s = Math.min(t, Tpara); return VEL * (s - (s * s) / (2 * Tpara)); };
const TOTAL = recorrido(Tpara);

const azC = azar(9);
// coches: los de enfrente (faros blancos) y los de delante (pilotos rojos)
const COCHES = Array.from({ length: 34 }, () => { const ida = azC() < 0.5; return { ida, x: ida ? -1.6 - azC() * 1.4 : 1.4 + azC() * 1.2, z0: azC() * 90, v: ida ? 40 : -8 }; });
const FAROLAS = Array.from({ length: 16 }, (_, i) => ({ x: i % 2 ? 5.2 : -5.2, z0: Math.floor(i / 2) * 12 + (i % 2) * 6 }));

const sx = (X, z) => 540 + (X * K) / z;
const sy = (Y, z) => HOR + ((2.68 - Y) * K) / z;

function carretera(g, t, d) {
  // el asfalto
  g.fillStyle = "#14121f"; g.beginPath(); g.moveTo(540, HOR); g.lineTo(sx(-4.2, 2), 1920); g.lineTo(sx(4.2, 2), 1920); g.fill();
  // las rayas
  g.fillStyle = "rgba(255,255,255,0.85)";
  for (let i = 0; i < 14; i++) {
    const z = ((((i * 7 - d) % 98) + 98) % 98) + 1.2, z1 = z + 3;
    if (z1 > 90) continue;
    g.beginPath(); g.moveTo(sx(-0.08, z), sy(0, z)); g.lineTo(sx(0.08, z), sy(0, z)); g.lineTo(sx(0.08, z1), sy(0, z1)); g.lineTo(sx(-0.08, z1), sy(0, z1)); g.fill();
  }
  for (const s of [-1, 1]) { g.strokeStyle = "rgba(255,230,180,0.6)"; g.lineWidth = 6; g.beginPath(); g.moveTo(540, HOR); g.lineTo(sx(s * 4, 1.5), sy(0, 1.5)); g.stroke(); }
}

function luces(g, t, d, d0, al) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const c of COCHES) {
    const mover = c.v * t;
    const z = ((((c.z0 - d - mover) % 90) + 90) % 90) + 1.5;
    const za = z + (d - d0) * 3.2 + (c.ida ? 1.6 : 0.4);
    if (z > 85) continue;
    const col = c.ida ? "255,240,210" : "255,50,60";
    for (const dx of [-0.35, 0.35]) {
      const x1 = sx(c.x + dx, z), y1 = sy(0.5, z), x0 = sx(c.x + dx, za), y0 = sy(0.5, za);
      const a = al * Math.min(1, 14 / z);
      g.strokeStyle = `rgba(${col},${a})`; g.lineWidth = Math.min(30, 130 / z) + 1;
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    }
    k.brillo(g, sx(c.x, z), sy(0.5, z), Math.min(500, 2600 / z), col, al * 0.5 * Math.min(1, 10 / z));
  }
  for (const f of FAROLAS) {
    const z = ((((f.z0 - d) % 48) + 48) % 48) + 1.2, za = z + (d - d0) * 2.5;
    if (z > 46) continue;
    const x = sx(f.x, z), y = sy(5.2, z), xa = sx(f.x, za), ya = sy(5.2, za);
    g.strokeStyle = `rgba(255,200,120,${0.8 * Math.min(1, 10 / z)})`; g.lineWidth = Math.min(40, 160 / z);
    g.beginPath(); g.moveTo(xa, ya); g.lineTo(x, y); g.stroke();
    k.brillo(g, x, y, Math.min(900, 4200 / z), "255,190,110", 0.7 * Math.min(1, 8 / z));
  }
  g.restore();
}

export function dibuja(g, t) {
  const d = recorrido(t), d0 = recorrido(Math.max(0, t - 1 / 30));
  noche(g, t, HOR, 1);
  carretera(g, t, d);
  // la gasolinera, detrás del tótem
  const zt = 3.2 + (TOTAL - d) * 0.3, zg = zt + 9;
  gasolinera(g, sx(-0.3, zg), sy(0, zg), 16 / zg, { marca: MARCA_A });
  // las luces que pasan
  luces(g, t, d, d0, 1 - 0.6 * su(tr(t, Tpara - 0.2, Tpara + 0.3)));
  // el tótem: 1,89 en rojo; en «más barata» cae rodando hasta 1,39 y se pone verde
  const cae = k.entra(tr(t, Tcae, Tverde));
  const col = k.mezRgb(ROJO, VERDE, su(tr(t, Tverde - 0.25, Tverde)));
  const dec = mez(8, 3, cae), dec2 = mez(7, 2, cae);
  totem(g, sx(0, zt), sy(0, zt) - 120 * 3.2 / zt, 4.6 / zt, { marca: MARCA_A, p1: [1, dec, 9], c1: col, p2: [1, dec2, 9], c2: col });
  // el fogonazo verde al caer
  k.brillo(g, 540, 820, 1500, VERDE, 0.55 * k.pulso(t, Tverde + 0.05, 0.16));
  k.brillo(g, 540, 1220, 1500, VERDE, 0.4 * k.pulso(t, Tverde + 0.08, 0.16));
  velo(g, 0.6);
}
