// «Para que pare, párate tú. Cuando la correa se tensa, quédate quieto como un árbol. Cuando se afloja, sigues andando.»
// Otro sitio (corte en «Para»): el mismo parque, al atardecer, con la luz dorada.
// - «Para que pare»: el perro tira otra vez y la persona va arrastrada.
// - «párate»: la persona se planta; el perro se queda clavado al final de la correa, tensa y vibrando.
// - «quédate quieto como un árbol»: la cámara se acerca a la persona, que se pone derecha; le salen hojas y raíces.
// - «se afloja»: el perro vuelve la cabeza y retrocede; la correa cuelga floja y las hojas se recogen.
// - «sigues andando»: se abre la cámara y echan a andar juntos.
import * as k from "#kit";
import { v } from "#voz";
import { aPantalla, cam, correa, parque, perro, persona, polvo, ponVista, simula, sinVista, velo, vineta, ambiente } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8), f9 = v.frase(9);
const T0 = f8.inicio, Tparate = f8.t("párate"), Ttensa = f8.t("tensa,") ?? f8.t("tensa"), Tarbol = f8.t("árbol."), Tafloja = f9.t("afloja,"), Tsigues = f9.t("sigues"), Fin = f9.fin;

const SEP = 178, TP = Tparate + 0.0, TS = Tafloja - 0.3;
const sim = simula({
  SEP, x0d: 400, x0h: 400 - SEP,
  vd: [[0, 0], [T0 - 0.7, 0], [T0 - 0.6, 215], [TS - 0.1, 215], [TS + 0.03, -180], [TS + 0.45, -180], [Tsigues - 0.2, 140], [Tsigues + 0.7, 140], [Fin, 40]],
  vh: [[0, 0], [Tsigues - 0.25, 0], [Tsigues + 0.05, 140], [Tsigues + 0.7, 140], [Fin, 40]],
  anclado: [[TP, TS]], paddle: [[TP + 0.2, TS]], T: Fin + 1,
});

const zl = k.claves([[T0, Math.log(3.1)], [Tarbol - 0.75, Math.log(3.1)], [Tarbol - 0.05, Math.log(3.45)], [Tafloja - 0.35, Math.log(3.45)], [Tafloja + 0.5, Math.log(3.0)], [Fin, Math.log(3.0)]]);
const camara = (t) => {
  const m = sim(t), Z = Math.exp(zl(t)), mid = (m.xd + m.xh) / 2 + 12;
  const foco = su(tr(t, Tarbol - 0.8, Tarbol - 0.1)) * (1 - su(tr(t, Tafloja - 0.35, Tafloja + 0.5)));
  return cam(Z, mez(mid, m.xh + 108, foco), -370 / Z);
};

export function dibuja(g, t) {
  const c = camara(t), m = sim(t);
  parque(g, c, t, 1);
  ponVista(g, c);
  const dist = m.xd - m.xh, tens = su(tr(dist, 125, SEP - 1));
  polvo(g, t, sim.polvo);
  // el perro: arrastra al principio, forcejea clavado y luego vuelve a mirar
  const fuerza = su(tr(t, TP, TP + 0.25)) * (1 - su(tr(t, TS - 0.05, TS + 0.05)));
  const mira = su(tr(t, TS, TS + 0.25)) * (1 - su(tr(t, Tsigues - 0.1, Tsigues + 0.4)));
  const rapido = Math.min(1, Math.abs(m.vd) / 90) * 0.9;
  const per = perro(g, {
    x: m.xd, fase: m.phD, marcha: Math.max(rapido, 0.9 * fuerza), pitch: 0.02 + 0.08 * tens + 0.1 * fuerza, t,
    cola: 0.35 + 0.65 * mira, cabeza: { ang: 0.1 * tens - 0.22 * mira, abre: mira > 0.3 || m.vd > 130 ? 0.8 : 0.25, ojo: mira > 0.5 ? 1 : 0, oreja: 0.1 * tens },
  });
  // la persona: arrastrada, luego derecha y quieta como un árbol, luego a andar
  const quieto = su(tr(t, TP, Tarbol - 0.4));
  const arbol = su(tr(t, Tarbol - 0.12, Tarbol + 0.75)) * (1 - su(tr(t, Tafloja + 0.15, Tafloja + 1.0)));
  const gente = persona(g, {
    x: m.xh, fase: m.phH, paso: Math.min(1.25, m.vh / 140), inclina: 0.03 - 0.3 * tens * (1 - 0.85 * quieto), cadX: -20 * tens * (1 - quieto), pieX: 20 * tens * (1 - quieto), t,
    mano: per.collar, tira: su(tr(tens, 0.25, 0.9)), arbol,
  });
  correa(g, gente.mano, per.collar, tens, t);
  if (tens > 0.9 && t > Ttensa - 0.1 && t < Tafloja) {
    const mx = (gente.mano[0] + per.collar[0]) / 2, my = (gente.mano[1] + per.collar[1]) / 2, a = 0.55 + 0.4 * Math.sin(t * 24);
    g.save(); g.strokeStyle = `rgba(255,255,255,${a * 0.9})`; g.lineWidth = 1.7; g.lineCap = "round";
    for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { g.beginPath(); g.moveTo(mx + s * (16 + i * 10), my - 12 - i * 5); g.lineTo(mx + s * (22 + i * 11), my - 20 - i * 6); g.stroke(); }
    g.restore();
  }
  sinVista(g);
  ambiente(g, 1);
  vineta(g, 0.3);
  velo(g, 0.42);
}
