// «¿Por qué tu perro tira tanto de la correa? ... tú vas demasiado lento ... trote ... tensa ... funciona»
// El parque de día, con una sola cámara y sin cortes (frases 1 a 5):
// - Fotograma 0: el perro, enorme, a trote rápido hacia la derecha, con la correa tensa que se va por la izquierda.
// - «obedezca»: la cámara se abre hacia atrás y aparece la persona, echada hacia atrás, arrastrada.
// - «caminas a 5»: la persona va a su paso y el perro, a su lado, con la correa floja; «trote»: él acelera y la
//   correa se tensa y la arrastra otra vez; salen las dos cifras.
// - «tensa»: la cámara se acerca a la correa, que vibra.
// - «tira... paso... funciona»: el perro se para; se lanza (tira) y la persona se queda clavada; da un paso, y el
//   perro menea la cola y se le enciende una bombilla.
import * as k from "#kit";
import { v } from "#voz";
import { aPantalla, bombilla, cam, correa, parque, pastillaPop, perro, persona, polvo, ponVista, simula, sinVista, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);

const SEP = 178;
const Tcinco = f3.t("5"), Ttrote = f3.t("trote"), Tdiez = f3.t("10"), Ttensa = f4.t("tensa"), Ttira = f5.t("tira"), Tpaso = f5.t("paso"), Tfunc = f5.t("funciona");

// El movimiento de los dos.
const Tfin = v.frase(6).inicio;
const sim = simula({
  SEP, x0d: 400, x0h: 400 - SEP,
  vd: [[0, 215], [6.0, 215], [7.0, 100], [9.0, 100], [10.0, 215], [16.2, 215], [16.9, 0], [17.28, 0], [17.5, 235], [18.8, 235], [19.05, 0]],
  vh: [[0, 140], [16.0, 140], [17.1, 0], [18.24, 0], [18.4, 190], [18.95, 150], [19.35, 0]],
  anclado: [[17.5, 18.3]], paddle: [[17.5, 18.3]], T: Tfin + 2,
});

const Ta = f2.t("obedezca") - 0.1, Tb = f2.t("lento") - 0.5;
const zl = k.claves([[0, Math.log(6.2)], [Ta, Math.log(6.2)], [Tb, Math.log(3.1)], [Ttensa - 0.4, Math.log(3.1)], [Ttensa + 0.8, Math.log(3.4)], [v.frase(4).fin, Math.log(3.4)], [Ttira - 0.4, Math.log(3.25)]]);
const wm = k.claves([[0, 0], [Ta, 0], [Tb, 1]]);
const camara = (t, ov) => {
  const m = sim(t), Z = ov ? ov.Z : Math.exp(zl(t)), mid = (m.xd + m.xh) / 2 + 12;
  return cam(Z, mez(m.xd + 22, mid, ov ? ov.w : wm(t)), -370 / Z);
};

export function dibuja(g, t, ov) {
  const c = camara(t, ov), m = sim(t);
  parque(g, c, t, 0);
  ponVista(g, c);
  const dist = m.xd - m.xh, tens = su(tr(dist, 125, SEP - 1));
  // quien se destaca en cada cifra: un brillo detrás
  const rP = k.entra(tr(t, Tcinco - 0.05, Tcinco + 0.3)) * (1 - su(tr(t, Ttrote - 0.1, Ttrote + 0.1)));
  const rD = k.entra(tr(t, Ttrote, Ttrote + 0.3)) * (1 - su(tr(t, Ttensa - 0.1, Ttensa + 0.2)));
  if (rP > 0.01) k.brillo(g, m.xh + 6, -90, 260 * rP, "255,230,170", 0.55 * rP);
  if (rD > 0.01) k.brillo(g, m.xd + 10, -50, 230 * rD, "255,230,170", 0.5 * rD);
  polvo(g, t, sim.polvo);
  // el perro: a su paso, o lanzándose cuando se para y tira
  const lance = k.pulso(t, 17.9, 0.5) * (t > 17.3 && t < 18.5 ? 1 : 0), bloq = t > 17.45 && t < 18.3 ? 1 : 0;
  const feliz = su(tr(t, Tpaso + 0.35, Tpaso + 0.7)), rapido = Math.min(1, m.vd / 90) * 0.9 + 0.1 * bloq;
  const pit = 0.02 + 0.08 * tens + 0.1 * bloq * su(tr(t, 17.45, 17.7)) * (1 - su(tr(t, 18.25, 18.5)));
  const per = perro(g, {
    x: m.xd, fase: m.phD, marcha: Math.max(rapido, bloq * 0.9), pitch: pit, t,
    cola: 0.35 + 0.65 * feliz, cabeza: { ang: 0.1 * tens + 0.08 * bloq, abre: m.vd > 130 || feliz > 0.5 ? 0.8 : 0.25, ojo: feliz > 0.5 ? 1 : 0, oreja: 0.1 * tens },
  });
  // la persona: tranquila a su paso, o echada hacia atrás cuando la correa tira
  const resiste = su(tr(t, 17.45, 17.65)) * (1 - su(tr(t, 18.26, 18.45)));
  const gente = persona(g, {
    x: m.xh, fase: m.phH, paso: Math.min(1.25, m.vh / 140), inclina: 0.03 - 0.3 * tens - 0.09 * resiste, cadX: -20 * tens, pieX: 20 * tens, t,
    mano: per.collar, tira: su(tr(tens, 0.25, 0.9)),
  });
  correa(g, gente.mano, per.collar, tens, t);
  // las marcas de tirón, en la correa tensa
  if (tens > 0.9 && t > 1.2) {
    const mx = (gente.mano[0] + per.collar[0]) / 2, my = (gente.mano[1] + per.collar[1]) / 2, a = 0.55 + 0.4 * Math.sin(t * 24);
    g.save(); g.strokeStyle = `rgba(255,255,255,${a * 0.9})`; g.lineWidth = 1.7; g.lineCap = "round";
    for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { g.beginPath(); g.moveTo(mx + s * (16 + i * 10), my - 12 - i * 5); g.lineTo(mx + s * (22 + i * 11), my - 20 - i * 6); g.stroke(); }
    g.restore();
  }
  // la bombilla de «aprende... funciona»
  const luz = su(tr(t, Tpaso + 0.5, Tfunc + 0.05));
  if (t > Tpaso + 0.35) bombilla(g, m.xd + 38, -122, 2.1, luz, t);
  sinVista(g);
  // las cifras
  const pp = aPantalla(c, m.xh + 8, -205), pd = aPantalla(c, m.xd + 20, -112);
  pastillaPop(g, t, Tcinco - 0.05, pp[0], Math.max(560, pp[1]), "5", "km/h", "255,255,255", 98, Ttrote - 0.05);
  pastillaPop(g, t, Ttrote + 0.55, pd[0] > 760 ? 690 : pd[0], Math.max(560, pd[1]) - 60, "6–10", "km/h", "255,205,100", 98, Ttensa - 0.1);
  vineta(g, 0.28);
  velo(g, 0.42);
}
