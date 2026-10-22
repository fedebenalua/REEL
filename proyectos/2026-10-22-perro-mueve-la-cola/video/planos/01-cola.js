// «¿Por qué tu perro mueve la cola más hacia un lado que hacia el otro?»
// Parque, el perro de espaldas. Del fotograma 0 a «acercarse»: la cola enorme, el 30, su persona y la mitad izquierda.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const Tlado = f1.t("lado");
const Ttreinta = f2.t("treinta");
const Tlejos = f2.t("lejos");
const Tfin2 = f2.fin;
const Tti = f3.t("ti");
const Tder = f3.t("derecha");
const Tizq = f4.t("izquierda");
const Tacer = f4.t("acercarse");
const Tcorte = v.frase(5).t("igual");

const zoom = k.claves([
  [-0.3, 1.58],
  [0, 1.4],
  [0.5, 1.08],
  [1.05, 1],
  [Tlado, 1],
  [Tder, 1.06],
  [Tacer, 1.08],
  [Tcorte - 0.15, 1.02],
]);
const focoY = k.claves([
  [0, 1080],
  [0.7, 1160],
  [Tlado, 1180],
  [Tcorte, 1180],
]);
const focoX = k.claves([
  [0, 430],
  [0.8, 480],
  [Tcorte, 490],
]);

export function escena(g, t, modo = "viaje") {
  const z0 = zoom(t);
  const z = modo === "arcos" ? k.mez(1.02, z0, k.suave(k.tramo(t, 0.2, 1.0))) : z0;
  const cam = { z, fx: focoX(t), fy: focoY(t) };
  m.parque(g, cam, t, 0);
  if (modo === "viaje") m.rafagas(g, t, 1 - k.suave(k.tramo(t, 0.15, 0.95)));

  const X = (x) => 540 + (x - cam.fx) * cam.z;
  const Y = (y) => 960 + (y - cam.fy) * cam.z;
  const S = (s) => s * cam.z;

  const due = k.suave(k.tramo(t, Tti - 0.05, Tti + 0.7));
  m.conAlfa(g, due, (c) => {
    m.personaCara(c, X(780), Y(1220), S(0.95), { t, color: "#0f8f88", claro: "#5eefe0", sombra: "#0a5e58" });
  });

  const sesgo = k.claves([
    [0, 0.92],
    [Tder, 1],
    [Tcorte, 1],
  ]);
  const calma = k.suave(k.tramo(t, Tcorte - 0.42, Tcorte - 0.16));
  const angVivo = m.angulo(t, sesgo(t));
  const ang = k.mez(angVivo, m.extension(1).der * 0.94, calma);
  const paso = k.suave(k.tramo(t, Tacer - 0.15, Tacer + 0.45));
  const brilloL = k.suave(k.tramo(t, Tizq - 0.12, Tizq + 0.28)) * (1 - k.suave(k.tramo(t, Tcorte - 0.38, Tcorte - 0.14)));
  const nervio = k.suave(k.tramo(t, Tizq + 0.15, Tacer - 0.05)) * (1 - calma);

  const dx = X(400), dy = Y(1260);
  m.perroDetras(g, dx, dy, S(1.12), {
    ang,
    paso,
    giro: 0.35 * due + 0.15,
    brilloL,
    nervio,
    nervioHacia: 1,
    rastro: calma > 0.6 ? [] : m.rastro(t, sesgo(t)),
    t,
  });

  const aArco = k.suave(k.tramo(t, Tlejos - 0.15, Tlejos + 0.25)) * (1 - k.suave(k.tramo(t, Tfin2 - 0.15, Tti + 0.1)));
  const arcoExtra = k.pulso(t, Tder, 0.35);
  m.arcos(g, dx, dy, 360 * S(1.12), sesgo(t), Math.max(aArco, arcoExtra * 0.85));

  if (modo === "arcos") {
    const enorme = 1 - k.suave(k.tramo(t, 0.05, 1.05));
    m.arcos(g, 540, 980, 720, 0.92, enorme);
  }

  const a30 = k.suave(k.tramo(t, Ttreinta - 0.04, Ttreinta + 0.28)) * (1 - k.suave(k.tramo(t, Tfin2 - 0.25, Tfin2 + 0.05)));
  k.pastilla(g, 200, 980, "30", "", "255,220,90", a30, 132);

  m.velo(g, 0.7);
}

export function dibuja(g, t) {
  escena(g, t, "viaje");
}
