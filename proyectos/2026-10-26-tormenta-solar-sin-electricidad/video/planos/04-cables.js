// «...eso mete corriente en los cables largos. Hoy son los de la luz: esa corriente llega a los transformadores y los
// recalienta.»
// La llanura otra vez (el mismo sitio que en 1859), con la aurora encima. Corte en «eso».
// - «eso mete corriente en los cables largos»: por los cables corren pulsos de luz amarilla, de poste a poste, hasta lo
//   lejos; la cámara avanza junto a ellos.
// - «Hoy son los de la luz»: los postes de madera se transforman en torres de alta tensión que crecen del suelo, de cerca
//   a lejos, y los cables suben con ellas; la cámara mira hacia arriba.
// - «esa corriente llega a los transformadores»: la cámara baja hasta la subestación, al pie de una torre: el
//   transformador grande delante, con los cables que le bajan; los pulsos entran en él.
// - «y los recalienta»: se pone al rojo, brilla y el aire tiembla encima; se queda así hasta el corte.
import * as k from "#kit";
import { v } from "#voz";
import { NPOSTES, auroras, cable, cielo, enganches, horizonteDe, poste, suelo, torreAlta, trazo, transformador, zPoste, LX } from "../mundo.js";

const f3 = v.frase(3), f4 = v.frase(4);
export const desde = f3.t("eso");

const { suave, tramo } = k;
const Teso = f3.t("eso"), Tcorr = f3.t("corriente"), Thoy = f4.t("hoy"), Tluz = f4.t("luz"), Tcorr2 = f4.t("corriente"), Tllega = f4.t("llega"), Ttra = f4.t("transformadores"), Trec = f4.t("recalienta"), Tfin = f4.fin;

// la torre i crece de cerca a lejos desde «Hoy»
const torre = (i, t) => suave(tramo(t, Thoy - 0.05 + i * 0.12, Thoy + 0.75 + i * 0.12));
// el transformador, al pie de la torre 3, un poco a la izquierda de la línea
const TR = [LX - 4.5, 0, zPoste(3) + 2];
export const calienta = Trec;

const camara = k.ruta([
  [Teso - 0.1, { pos: [0, 1.7, 16], mira: [0, 9.9, -24] }],
  [Thoy, { pos: [0.3, 2.2, -8], mira: [1.5, 11, -48] }],
  [Tluz + 0.3, { pos: [-0.5, 3.2, -30], mira: [2.5, 13, -70] }],
  [Ttra + 0.1, { pos: [TR[0] - 1.2, 5.2, TR[2] + 13], mira: [TR[0] + 0.4, 3.0, TR[2]] }],
  [Tfin + 0.3, { pos: [TR[0] - 1.2, 5.0, TR[2] + 12.4], mira: [TR[0] + 0.4, 3.0, TR[2]] }],
]);

// los cables que bajan de la torre 3 al transformador
const bajantes = (cr) => enganches(3, cr).map((p, q) => [p, [TR[0] - 1.5 + q * 3 * 0.5 + 0.0, 6.6, TR[2]]]);

export function dibuja(g, t) {
  const cam = camara(t), hz = horizonteDe(cam);
  cielo(g, t, 1, 0, "90,255,150", hz);
  auroras(g, t, 1, hz - 60);
  suelo(g, t, 1, 0, "90,255,150", hz);
  const corriente = suave(tramo(t, Tcorr - 0.1, Tcorr + 0.5));
  const cosas = [];
  // los postes y las torres, con sus cables, de lejos a cerca
  for (let i = NPOSTES - 1; i >= 0; i--) {
    const cr = torre(i, t), crS = torre(i + 1, t);
    const z = k.proyecta(cam, [LX, 5, zPoste(i)]);
    cosas.push({ z: z ? z.z : -1e9, dibuja: () => {
      for (let q = 0; q < 2; q++) {
        const A = enganches(i, cr)[q], B = enganches(i + 1, crS)[q], pts = cable(cam, A, B, 0.55 + 1.2 * cr);
        if (!pts) continue;
        trazo(g, pts, "rgba(18,26,30,0.95)", 2.4 + 1.2 * cr);
        // los pulsos de corriente que corren hacia lejos
        if (corriente > 0.01) {
          g.save(); g.globalCompositeOperation = "lighter";
          trazo(g, pts, `rgba(255,210,110,${0.45 * corriente})`, 3);
          trazo(g, pts, `rgba(255,190,90,${0.14 * corriente})`, 12);
          for (let p = 0; p < 2; p++) {
            const u = (((t - Tcorr) * 1.6 + p * 0.5 - i * 0.25 + q * 0.13) % 1 + 1) % 1, j = Math.min(11, Math.floor(u * 12));
            const a = pts[j], b = pts[j + 1];
            if (!a || !b) continue;
            const f = u * 12 - j, x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f, s = k.F / a.z;
            k.brillo(g, x, y, Math.min(260, Math.max(70, s * 5)), "255,214,120", corriente * Math.sin(Math.PI * u));
          }
          g.restore();
        }
      }
      poste(g, cam, i, 1 - suave(tramo(cr, 0, 0.5)));
      torreAlta(g, cam, i, cr);
    } });
  }
  // el transformador y los cables que le bajan de la torre 3
  const P = k.proyecta(cam, TR);
  if (P) cosas.push({ z: P.z - 0.1, dibuja: () => {
    const s = k.F / P.z, cal = suave(tramo(t, Trec - 0.1, Trec + 0.7));
    const llega = suave(tramo(t, Tllega - 0.2, Ttra + 0.2));
    transformador(g, P.x, P.y, s, cal, t);
    for (const [A, B] of bajantes(torre(3, t))) {
      const pts = cable(cam, A, B, 0.2);
      if (!pts) continue;
      trazo(g, pts, "rgba(18,26,30,0.95)", 3.5);
      if (llega > 0.01) {
        g.save(); g.globalCompositeOperation = "lighter";
        trazo(g, pts, `rgba(255,190,90,${0.35 * llega})`, 7);
        const u = ((t - Tllega) * 1.4) % 1, j = Math.min(11, Math.floor(u * 12)), a = pts[j], b = pts[j + 1];
        if (a && b) k.brillo(g, a.x + (b.x - a.x) * (u * 12 - j), a.y + (b.y - a.y) * (u * 12 - j), 120, "255,214,120", llega * (1 - 0.6 * cal) * Math.sin(Math.PI * u));
        g.restore();
      }
    }
  } });
  k.deLejosACerca(cosas);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(2,4,12,0.45)"); vg.addColorStop(1, "rgba(2,4,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
