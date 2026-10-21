// «Pero si sonaban unas llaves, la tele también cambiaba de canal.»
// Otro sitio: el salón de 1956: la tele de madera a la izquierda y, a la derecha, una señora con un llavero. Una sola
// cámara. Se entra con un corte en «Pero».
// - «Pero si sonaban unas llaves»: la señora saca las llaves y las agita; de ellas salen aros dorados de sonido.
// - «la tele también cambiaba de canal»: los aros llegan a la tele; nieve y cambio de canal, tres veces, con la perilla
//   girando sola. Al final, todo reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, teleVieja } from "../mundo.js";
import { salon56, ondas } from "../objetos56.js";
import { persona } from "../personas.js";

export const desde = (vz) => vz.frase(12).inicio;

const { suave: su, tramo: tr } = k;
const f = v.frase(12);
const T0 = f.inicio, Tsi = f.t("sonaban"), Tll = f.t("llaves"), FIN = v.frase(13).inicio;
const TELE_POS = [-250, 80], ELLA = [520, 740];

const cam = camino2D([[T0, [0.78, 40, 330]], [Tll - 0.3, [0.78, 40, 330]], [Tll + 0.4, [0.9, 80, 270]], [FIN, [0.9, 80, 270]]]);

// los aros de sonido salen de las llaves, donde las tiene en la mano
const ORIGEN = [ELLA[0] - 140, ELLA[1] - 610];
const ONDAS = [];
for (let te = Tll - 0.02, i = 0; te < FIN - 1.2; te += 0.3, i++) ONDAS.push({ t: te, x: ORIGEN[0], y: ORIGEN[1], col: i % 2 ? "255,236,170" : "255,200,90", al: 0.75, fin: FIN - 0.12 });

const SALTOS = [Tll + 0.95, f.t("cambiaba"), f.t("canal") + 0.08];
const canalDe = (t) => 1 + SALTOS.filter((s) => t >= s).length;
const nieveDe = (t) => Math.max(0, ...SALTOS.map((s) => tr(t, s - 0.06, s) * (1 - tr(t, s + 0.14, s + 0.3))));
const perillaDe = (t) => SALTOS.reduce((a, s) => a + 0.85 * su(tr(t, s - 0.05, s + 0.2)), 0);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  salon56(g, t);
  k.brillo(g, -250, 120, 1500, "170,200,255", 0.25);
  g.save(); g.translate(TELE_POS[0], TELE_POS[1]);
  teleVieja(g, t, { canalN: canalDe(t), nv: nieveDe(t), celdas: [0, 0, 0, 0], perilla: perillaDe(t) });
  g.restore();
  ondas(g, t, ONDAS);
  // la señora: saca las llaves en «sonaban» y las agita en «llaves»
  const agita = su(tr(t, Tsi + 0.05, Tll + 0.1)) * (1 - su(tr(t, FIN - 0.55, FIN - 0.2)));
  persona(g, t, { x: ELLA[0], y: ELLA[1], flip: -1, llaves: { agita } });
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { llaves: Tll };
