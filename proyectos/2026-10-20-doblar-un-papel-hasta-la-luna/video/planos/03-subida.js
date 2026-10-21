// «A los 17 dobleces, ya es más alto que un edificio de cuatro pisos. A los 23, más que el rascacielos más alto del
// mundo. A los 30, sale de la atmósfera y llega al espacio. Y a los 42, deja atrás la Luna: 440.000 kilómetros.»
// Otro sitio: la calle (corte en «A»). La columna de papel de pie en la acera, con 10 dobleces, y crece doblez a
// doblez: cada uno la hace el doble de alta, de golpe, y la cámara se aleja detrás para no perderla. El contador, abajo.
// - «A los 17 dobleces»: de 10 a 17; «edificio»: el de cuatro pisos, a su lado, se ilumina, y la columna ya lo pasa.
// - «A los 23»: de 18 a 23; la ciudad se encoge; «rascacielos»: se ilumina, con sus 828 m; la punta lo pasa.
// - «A los 30»: de 24 a 30: atraviesa las nubes, el cielo se oscurece, la Tierra se curva; «espacio»: la punta sale
//   al negro, por encima de la raya de los 100 km.
// - «Y a los 42»: de 31 a 42: la Tierra se hace una bola, la columna un hilo de luz; «deja atrás la Luna»: la punta
//   pasa la Luna; «440.000»: la cifra, grande. La cámara se aleja un poco, despacio, hasta el plano siguiente.
import * as k from "#kit";
import { v } from "#voz";
import { mundo, alto, anchoColumna, camaraPara, textoAltura, yDe, EDIFICIO, BURJ, sitioLuna } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, entra } = k;
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const Tedificio = f5.t("edificio"), Trasca = f6.t("rascacielos"), Tespacio = f7.t("espacio"), Tluna = f8.t("luna"), T440 = f8.t("440000");
export const N0 = 10;
// los dobleces, en tandas: [primero, último, desde, hasta]
const TANDAS = [
  [11, 17, f5.inicio + 0.05, Tedificio + 0.1],
  [18, 23, f6.inicio + 0.05, f6.t("alto") + 0.05],
  [24, 30, f7.inicio + 0.05, Tespacio - 0.05],
  [31, 42, f8.inicio + 0.1, Tluna + 0.05],
];
export const momentos = [];
for (const [a, b, t0, t1] of TANDAS) for (let i = a; i <= b; i++) momentos.push({ n: i, t: mez(t0, t1, Math.pow((i - a + 1) / (b - a + 1), 0.85)) });
export function dobleces(t) {
  let n = N0, prev = f5.inicio - 0.2;
  for (const m of momentos) { const d = Math.min(0.16, (m.t - prev) * 0.9); n += entra(tr(t, m.t - d, m.t)); prev = m.t; }
  return n;
}
// la punta, en la pantalla: a 680 mientras crece; en lo que queda tras la Luna, la cámara se aleja un poco
export const Y_FIN = 600, SUELO_FIN = 1430;
const fin = (t) => su(tr(t, Tluna + 0.6, f8.fin + 0.2));
export const camara = (t) => camaraPara(alto(dobleces(t - 0.1)), mez(1350, SUELO_FIN, fin(t)), mez(680, Y_FIN, fin(t)));
export const XT = 430;

export function dibuja(g, t) {
  const c = camara(t), n = dobleces(t), H = alto(n);
  // el edificio y el rascacielos se iluminan en su palabra (dibujados aparte, encima, con la misma escala)
  const { L } = mundo(g, t, c, XT, H, Math.min(anchoColumna(c), mez(330, 140, tr(n, N0, 15))));
  const yEd = yDe(c, EDIFICIO.h), alEd = k.pulso(t, Tedificio + 0.15, 0.3) * tr(c.s, 1, 8);
  if (alEd > 0.01) k.brillo(g, XT + EDIFICIO.x * c.s, (yEd + c.y0) / 2, EDIFICIO.h * c.s * 2.2, "255,210,140", alEd * 0.55);
  // el rascacielos: su altura junto a la punta
  const alB = tr(t, Trasca - 0.1, Trasca + 0.15) * (1 - tr(t, f7.inicio, f7.inicio + 0.3));
  if (alB > 0.01) {
    const yB = yDe(c, BURJ.h);
    k.brillo(g, XT + BURJ.x * c.s, yB, 240, "190,225,255", alB * 0.7 * (0.6 + 0.4 * k.pulso(t, Trasca + 0.15, 0.3)));
    k.etiqueta(g, XT + BURJ.x * c.s + 30, yB + 10, "828 m", "190,225,255", alB, 50);
  }
  // el espacio: la raya de los 100 km
  const alE = tr(t, Tespacio - 0.35, Tespacio) * (1 - tr(t, f8.inicio + 0.2, f8.inicio + 0.6));
  if (alE > 0.01) {
    const y100 = yDe(c, 1e5);
    g.save(); g.globalAlpha = alE; g.setLineDash([22, 16]); g.strokeStyle = "rgba(160,220,255,0.85)"; g.lineWidth = 4;
    g.beginPath(); g.moveTo(0, y100); g.lineTo(1080, y100); g.stroke(); g.restore();
    k.etiqueta(g, 620, y100 - 92, "espacio · 100 km", "160,220,255", alE, 48);
  }
  // la Luna late cuando la punta la pasa
  const late = k.pulso(t, Tluna + 0.1, 0.3);
  if (late > 0.02) k.brillo(g, L.x, L.y, L.r * 4, "255,244,220", 0.5 * late);
  // la cifra grande: «440.000 km»
  const alC = tr(t, T440 - 0.1, T440 + 0.15);
  if (alC > 0) k.pastilla(g, 770, 1090, k.fmt(Math.round(440 * entra(tr(t, T440 - 0.1, T440 + 0.5))) * 1000), "km", "255,236,170", alC, 120);
  // y la Luna, con su distancia, para compararlas
  const alL = tr(t, T440 + 0.7, T440 + 0.95);
  if (alL > 0) k.etiqueta(g, L.x - 150, L.y + L.r + 20, "Luna: 384.400 km", "235,235,245", alL, 46);
  // el contador de dobleces y la altura, abajo a la izquierda
  const N = Math.round(Math.min(n, 42)), [a, u] = textoAltura(alto(N));
  const alN = tr(t, f5.inicio, f5.inicio + 0.12);
  k.pastilla(g, 250, mez(1250, 1300, fin(t)), String(N), "dobleces", "255,236,170", alN, 96);
  k.etiqueta(g, 140, 1338, `${a} ${u}`, "190,225,255", alN * (1 - alC), 50);
}
void sitioLuna;
