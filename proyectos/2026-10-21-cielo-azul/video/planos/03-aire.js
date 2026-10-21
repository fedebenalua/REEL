// «El aire está hecho de moléculas diminutas, y la luz va chocando con ellas. El rojo casi pasa de largo, pero el azul
// rebota en todas direcciones.»
// Otro sitio: dentro del aire. Se entra con un corte en «El». Una sola cámara, que se aleja y vuelve.
// - «moléculas»: aparecen las moléculas, de una en una, con un brillo. «diminutas»: la cámara se aleja y son miles.
// - «y la luz va chocando con ellas»: fotones blancos llegan por la izquierda y chocan: salen disparados a otro lado.
// - «El rojo casi pasa de largo»: un fotón rojo cruza todo recto, entre las moléculas, sin tocar ninguna.
// - «pero el azul rebota»: un fotón azul choca con una molécula y rebota, y otra, y otra.
// - «en todas direcciones»: de cada molécula salen rayos azules a todos lados y el aire se llena de azul.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, ROJO, molecula, foton, largoRuta, fondoNoche } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, azar, pulso } = k;
const f5 = v.frase(5), f6 = v.frase(6);
const T0 = f5.inicio, Tmol = f5.t("moleculas"), Tdim = f5.t("diminutas"), Tchoc = f5.t("chocando"), Tluz = f5.t("luz");
const Trojo = f6.t("rojo"), Tlargo = f6.t("largo"), Tazul = f6.t("azul"), Treb = f6.t("rebota"), Ttodas = f6.t("todas"), Fin = f6.fin;

// las moléculas del carril (por donde van los fotones) y las del fondo
const az = azar(5150);
const LANE = [[330, 905], [470, 1140], [610, 965], [750, 1180], [860, 930], [260, 1190], [700, 800]];
const FONDO = Array.from({ length: 90 }, () => ({ x: -200 + az() * 1480, y: 250 + az() * 1500, z: 0.35 + az() * 0.55, a: az() * 6.28, f: az() * 6.28, o: az() }));
const Rm = 44; // radio de un átomo en el carril

// cámara 2D: zoom alrededor de (540, 1030)
const zoom = k.claves([[T0, 2.3], [Tdim - 0.05, 2.3], [Tdim + 0.9, 1.4], [Tluz + 2.2, 1.4]]);
const flota = (m, t) => [Math.sin(t * 1.3 + m.f) * 7, Math.cos(t * 1.1 + m.f * 1.7) * 7];

// ---- las rutas de los fotones
// los blancos de «chocando»: cada uno apunta a una molécula del carril y sale disparado a otro lado
const SALIDAS = [[-1, 1], [1, -1], [-1, -1], [1, 1], [0.2, 1], [0.3, -1], [-0.6, -1]];
const BLANCOS = LANE.map((m, i) => {
  const d = SALIDAS[i], L = Math.hypot(d[0], d[1]);
  return { ruta: [[-80, m[1]], [m[0] - Rm * 1.3, m[1]], [m[0] + (d[0] / L) * 1400, m[1] + (d[1] / L) * 1400]], t0: Tluz + 0.05 + i * 0.2, hit: i };
});
const VEL = 1250;
// el rojo: recto, entre las moléculas (carril y = 1055)
const ROJOS = [Trojo - 0.02, Tlargo + 0.28].map((t0) => ({ t0, ruta: Array.from({ length: 22 }, (_, i) => [-80 + i * 60, 1055 + Math.sin(i * 0.9) * 5]) }));
// el azul: rebota de molécula en molécula
const AZULES = [
  { t0: Tazul - 0.45, ruta: [[-80, 905], [330 - Rm * 1.3, 905], [470 - 60, 800], [610 - 40, 965 - 60], [760, 760], [1000, 520], [1300, 380]] },
  { t0: Tazul - 0.2, ruta: [[-80, 1140], [470 - Rm * 1.3, 1140], [330, 1330], [480, 1480], [700, 1700], [800, 1900]] },
];

export function dibuja(g, t) {
  fondoNoche(g, "#041033", "#0a3a85", 1000);
  const Z = zoom(t);
  g.save(); g.translate(540, 1030); g.scale(Z, Z); g.translate(-540, -1030);

  // el fondo: miles de moléculas lejanas
  for (const m of FONDO) {
    const ap = su(tr(t, T0 + 0.1 + m.o * 0.6 + (m.z < 0.6 ? 0.5 : 0), T0 + 0.9 + m.o * 0.6 + (m.z < 0.6 ? 0.5 : 0)));
    const [fx, fy] = flota(m, t);
    molecula(g, m.x + fx * 2, m.y + fy * 2, Rm * m.z * 0.8, m.a + t * 0.4, 0.55 * ap * m.z + 0.12);
  }

  // el azul del aire cuando todo rebota
  const lleno = su(tr(t, Ttodas + 0.1, Fin + 0.1));

  // las moléculas del carril
  LANE.forEach((m, i) => {
    const ap = su(tr(t, T0 + 0.25 + i * 0.1, T0 + 0.7 + i * 0.1)), [fx, fy] = flota({ f: i * 1.9 }, t);
    const choque = BLANCOS[i], dt = t - (choque.t0 + (largoRuta(choque.ruta.slice(0, 2))) / VEL);
    const luz = pulso(t, choque.t0 + largoRuta(choque.ruta.slice(0, 2)) / VEL, 0.09);
    const pop = 1 + 0.45 * pulso(t, Tmol + i * 0.08, 0.1);
    molecula(g, m[0] + fx, m[1] + fy, Rm * ap * pop, i * 0.8 + t * 0.5, ap, Math.max(luz * 0.5, lleno * 0.9));
  });

  // los fotones blancos de «chocando»
  if (t < Trojo - 0.5) for (const b of BLANCOS) foton(g, b.ruta, (t - b.t0) * VEL, "255,255,255", 190, 120);
  // el rojo, que pasa de largo
  for (const r of ROJOS) foton(g, r.ruta, (t - r.t0) * 1000, ROJO, 300, 150);
  // los azules, que rebotan
  for (const a of AZULES) foton(g, a.ruta, (t - a.t0) * 1100, AZUL, 240, 150);

  // «en todas direcciones»: de cada molécula salen rayos azules a todos lados
  if (t > Ttodas - 0.1) {
    const rr = azar(77);
    LANE.forEach((m, i) => {
      for (let q = 0; q < 5; q++) {
        const ang = rr() * 6.2832, L = 260 + rr() * 520, t0 = Ttodas + 0.02 + i * 0.07 + q * 0.03;
        const s = (t - t0) * 1500; if (s < 0) continue;
        const ruta = [[m[0], m[1]], [m[0] + Math.cos(ang) * 1700, m[1] + Math.sin(ang) * 1700]];
        foton(g, ruta, s, AZUL, L, 100, 1 - su(tr(t, Fin - 0.35, Fin + 0.1)) * 0.0);
      }
    });
  }
  g.restore();

  // el azul que lo llena todo
  k.brillo(g, 540, 1050, 2200, AZUL, 0.5 * lleno);

  const vg = g.createLinearGradient(0, 200, 0, 650); vg.addColorStop(0, "rgba(4,16,51,0.6)"); vg.addColorStop(1, "rgba(4,16,51,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 650);
}
