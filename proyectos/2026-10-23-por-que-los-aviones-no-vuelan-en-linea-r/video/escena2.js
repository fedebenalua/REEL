// «En 2020, uno cruzó de Nueva York a Londres en menos de cinco horas, con un viento de cola de más de cuatrocientos
// kilómetros por hora. Así que el piloto no se ha perdido: va por el camino más corto de una Tierra redonda, y el viento
// hace el resto.»
// El mapa del Atlántico Norte con el río de viento: el avión del récord lo cruza; luego el mapa se hace bola, gira entera
// y el avión la cruza por el camino más corto, empujado por el viento.
import * as k from "#kit";
import { v } from "#voz";
import * as geo from "./geo.js";
import { NUEVAYORK, LONDRES, velo, avionEnMapa, suave, tramo, mez, lim } from "./mundo.js";
import { dibujaViento } from "./viento.js";

const f = (n) => v.frase(n);
export const GC2 = geo.circuloMaximo(NUEVAYORK, LONDRES, 240);      // el camino más corto
export const RUMBO2 = geo.rumbo(NUEVAYORK, LONDRES, 240);            // la «recta» del mapa
const N2 = GC2.length - 1;
const AP = GC2.reduce((m, p) => (p.phi > m.phi ? p : m), GC2[0]);
const LON2 = AP.lam / geo.D, LAT2 = AP.phi / geo.D;

// los segundos
const T11 = f(11).inicio, Tdos = f(11).t("2020"), Tcruzo = f(11).t("cruzo"), Tyork = f(11).t("york"), Tcinco = f(11).t("cinco"), Thoras = f(11).finDe("horas");
const Tviento = f(11).t("viento"), Tcuatro = f(11).t("cuatrocientos"), Thora = f(11).t("hora");
const T12 = f(12).inicio, Tperdido = f(12).t("perdido"), Tva = f(12).t("va"), Tredonda = f(12).t("redonda"), Tvientos = f(12).t("viento"), Tresto = f(12).t("resto");
const T13 = f(13).inicio;

// el avión del récord: sale de Nueva York en «Nueva York» y llega en «horas»; el segundo viaje, con el viento de cola
const PASO1 = [Tyork + 0.25, Thoras - 0.05];
const PASO2 = [Tviento + 0.25, T12 - 0.9];
const PASO3 = [Tvientos - 0.2, T13 - 0.35];
const prog = (t, [a, b]) => suave(tramo(t, a, b));

// ---------------------------------------------------------------- la cámara
const M0 = T12 + 0.25, M1 = Tva + 0.55;     // la hoja se hace bola
const SPIN0 = Tva + 0.7, SPIN1 = Tvientos - 0.1; // la bola gira entera
export function vistaMapa2(t) {
  const u = suave(tramo(t, M0, M1));
  const giro = 360 * suave(tramo(t, SPIN0, SPIN1));
  const R = mez(470, 800, suave(tramo(t, Tvientos - 0.1, Tvientos + 1.5)));
  return geo.vista({ lon0: LON2 + giro, lat0: LAT2, s: mez(560, 740, u), R, u, cx: 540, cy: mez(940, 1010, u) });
}

const hhmm = (min) => `${Math.floor(min / 60)}:${String(Math.floor(min % 60)).padStart(2, "0")}`;

export function escenaRecord(g, t) {
  const V = vistaMapa2(t);
  geo.fondoMar(g, V, t);
  geo.dibujaTierra(g, V, t);

  // el río de viento: siempre, y más fuerte cuando se habla de él
  const fuerte = suave(tramo(t, Tviento - 0.1, Tviento + 0.7)) * (1 - 0.35 * suave(tramo(t, M0, M1)));
  dibujaViento(g, V, t, { al: 0.95, entra: suave(tramo(t, T11 - 0.05, T11 + 0.5)), banda: 0.5 + 0.55 * fuerte, grosor: 1 + 0.35 * fuerte });

  // la «recta» del mapa, de rayas, cuando se habla del camino más corto
  const aRayas = suave(tramo(t, M0 + 0.1, M0 + 0.8));
  geo.lineaRayas(g, V, RUMBO2, "255,255,255", 8, aRayas, 36, 28, 0, N2, 0);

  // el camino de Nueva York a Londres, que se enciende con el avión del récord
  const i1 = prog(t, PASO1) * N2;
  geo.lineaLuz(g, V, GC2, "255,164,48", 11, 1, 0, Math.max(0.01, i1));
  // las dos ciudades
  geo.marca(g, V, NUEVAYORK, "Nueva York", suave(tramo(t, T11 + 0.1, T11 + 0.4)), { dx: 120, dy: -62, rad: 16 });
  geo.marca(g, V, LONDRES, "Londres", suave(tramo(t, T11 + 0.1, T11 + 0.4)), { dx: -90, dy: -62, rad: 16 });

  // el avión (primer viaje, segundo con viento, tercero por la bola)
  let i = null, tam = 250;
  if (t >= PASO1[0] - 0.2 && t < PASO1[1] + 0.9) i = prog(t, PASO1) * N2;
  if (t >= PASO2[0] - 0.2 && t < PASO2[1] + 0.2) i = prog(t, PASO2) * N2;
  if (t >= PASO3[0] - 0.2) i = prog(t, PASO3) * N2;
  if (i !== null) {
    const al = t < PASO1[0] ? suave(tramo(t, PASO1[0] - 0.2, PASO1[0])) : 1;
    const viaje2 = t >= PASO2[0] - 0.2 && t < PASO2[1] + 0.2;
    // las hebras del viento de cola, pegadas detrás del avión
    if (viaje2 || t >= PASO3[0]) {
      const idx = i, a = lim(prog(t, PASO2) * 4, 0, 1);
      for (const d of [-0.9, -0.45, 0.45, 0.9]) {
        const pts = [];
        for (let j = 0; j <= 14; j++) { const q = lim(idx - j * 2.2, 0, N2), p = geo.entre(GC2[Math.floor(q)], GC2[Math.min(N2, Math.floor(q) + 1)], q - Math.floor(q)); pts.push({ lam: p.lam, phi: p.phi + d * geo.D, sp: Math.sin(p.phi + d * geo.D), cp: Math.cos(p.phi + d * geo.D), my: geo.merc(p.phi + d * geo.D) }); }
        geo.lineaLuz(g, V, pts, "255,236,190", 5, 0.8 * (viaje2 ? a : 0.7), 0, 14, false);
      }
    }
    avionEnMapa(g, V, GC2, i, V.u > 0.5 ? mez(250, 200, 1) : tam, { al });
  }

  // los rótulos: 2020, el reloj, el viento
  const a2020 = suave(tramo(t, Tdos - 0.05, Tdos + 0.2)) * (1 - suave(tramo(t, Tcruzo - 0.35, Tcruzo - 0.05)));
  k.pastilla(g, 540, 700, "2020", "", "255,255,255", a2020, 120);
  if (t > Tcruzo && t < PASO2[0]) {
    const aC = suave(tramo(t, PASO1[0], PASO1[0] + 0.25)) * (1 - suave(tramo(t, Tviento - 0.45, Tviento - 0.1)));
    const min = 296 * prog(t, PASO1);
    k.pastilla(g, 540, 700, hhmm(min), "h", t > PASO1[1] - 0.05 ? "255,214,120" : "255,255,255", aC, 120);
  }
  if (t > Tviento && t < T12) {
    const a = suave(tramo(t, Tviento + 0.25, Tviento + 0.55)) * (1 - suave(tramo(t, T12 - 0.3, T12 - 0.02)));
    const num = Math.round(418 * suave(tramo(t, Tviento + 0.4, Tcuatro + 0.6)));
    const esc = 1 + 0.1 * Math.exp(-Math.pow((t - Tcuatro - 0.65) / 0.18, 2));
    g.save(); g.translate(540, 700); g.scale(esc, esc); g.translate(-540, -700);
    k.pastilla(g, 540, 700, String(num), "km/h", "150,230,255", a, 120);
    g.restore();
  }
  velo(g, 0.72);
}
