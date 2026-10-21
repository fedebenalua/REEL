// El hook y lo que sigue en el mismo mar, con el mismo pulpo y una sola cámara (frases 1 a 4). Lo usan el plano
// 01-mar.js (la cámara cae hacia el pulpo) y la otra apertura, aperturas/01-corazon.js (empieza pegada a su corazón).
// - «¿Sabías que el pulpo...»: el pulpo llega enorme abriendo los ocho brazos.
// - «tres corazones»: su cuerpo se vuelve transparente y se encienden los tres corazones, uno a uno, latiendo.
// - «y la sangre azul»: la sangre azul corre por los ocho brazos hasta las puntas.
// - «Y uno de ellos se para»: la cámara va al corazón del medio; en «para» se queda gris y el pulpo sale disparado
//   hacia arriba, con los brazos juntos y su chorro de agua. «cada vez que nada»: sube; luego frena y abre los brazos.
// - «Dos corazones empujan la sangre por las branquias»: la cámara entra en el cuerpo; los dos corazones de los lados
//   laten fuerte y la sangre casi transparente sube por las branquias; «oxígeno»: entran burbujas y salen azules.
// - «Y el tercero la reparte por el cuerpo»: el del medio late y lanza un pulso azul hacia abajo; la cámara baja con él
//   por un brazo hasta la punta; «ocho brazos»: se aleja y se encienden las ocho puntas. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { mar, vista, sinVista, camino2D, pulpo, latido, vineta, velo, chorroAgua, burbuja, brazoPuntos, SIS, BR1, BR2 } from "./mundo.js";

const { suave: su, tramo: tr, mez, entra, pulso, azar } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const Tpul = f1.t("pulpo"), Ttre = f1.t("tres"), Tcor = f1.t("corazones"), Tsan = f1.t("sangre"), Tazu = f1.t("azul");
const Tuno = f2.t("uno"), Tpara = f2.t("para"), Tnada = f2.t("nada"), F2 = f2.fin;
const Tdos = f3.t("dos"), Temp = f3.t("empujan"), Tbra = f3.t("branquias"), Toxi = f3.t("oxigeno");
const Tter = f4.t("tercero"), Trep = f4.t("reparte"), Tpun = f4.t("punta"), Tocho = f4.t("ocho"), Tbrz = f4.t("brazos"), F4 = f4.fin;
export const Tfin = v.frase(5).inicio;

// dónde está el pulpo: quieto, hasta que sale disparado hacia arriba en «para»
const Tsale = Tpara - 0.04;
const py = (t) => -1500 * entra(tr(t, Tsale, Tsale + 1.7));
const chorro = (t) => su(tr(t, Tsale - 0.08, Tsale + 0.18)) * (1 - su(tr(t, F2 - 0.1, Tdos + 0.4)));
// el corazón del cuerpo: se para en «para» y vuelve cuando deja de nadar
const vivoS = (t) => Math.min(1, 1 - su(tr(t, Tpara - 0.06, Tpara + 0.14)) + su(tr(t, Tdos + 0.1, Tdos + 0.7)));

// el brazo que sigue la cámara en «hasta la punta»
const BRAZO = 4;
const Tbaja0 = Trep - 0.1, Tbaja1 = Tocho - 0.05;
const pulsoBrazo = (t) => (t < Trep - 0.3 || t > Tbrz + 0.6 ? -1 : mez(-0.05, 1.02, su(tr(t, Trep - 0.2, Tocho))));

function camara(modo) {
  const comun = [
    [Ttre - 0.05, [0.95, 0, -30]], [Tazu + 0.3, [0.95, 0, -30]], [Tuno + 0.55, [1.55, 0, SIS[1] + 30]], [Tpara - 0.02, [1.6, 0, SIS[1] + 20]],
    [Tpara + 0.6, [0.85, 0, 330]], [F2 + 0.15, [0.9, 0, 60]], [Temp, [2.05, 0, -230]], [Toxi + 0.5, [2.15, 0, -250]],
    [Tter + 0.1, [2.0, 0, SIS[1] + 20]],
  ];
  const ini = modo === "corazon"
    ? [[0, [5.2, SIS[0], SIS[1]]], [0.22, [4.8, SIS[0], SIS[1]]], [Tpul + 0.2, [1.0, 0, -30]]]
    : [[0, [0.42, 0, -330]], [Tpul + 0.12, [1.0, 0, -30]]];
  const base = camino2D([...ini, ...comun, [Tbaja0, [2.0, 0, SIS[1] + 40]], [Tbaja1, [1.7, 0, 420]], [Tbrz + 0.55, [0.92, 0, -10]], [F4, [0.92, 0, -10]]]);
  return (t, puntos) => {
    const c = base(t);
    // de «reparte» a «ocho», la cámara baja con el pulso por el brazo
    const w = su(tr(t, Tbaja0, Tbaja0 + 0.6)) * (1 - su(tr(t, Tbaja1, Tbrz + 0.5)));
    if (w > 0 && puntos) {
      const u = Math.max(0, Math.min(1, pulsoBrazo(t))), q = puntos[Math.round(u * (puntos.length - 1))];
      c[1] = mez(c[1], q.x * 0.85, w); c[2] = mez(c[2], q.y * 0.85 + 30, w);
    }
    return c;
  };
}
const CAM = { bajada: camara("bajada"), corazon: camara("corazon") };

// las burbujas que suben deprisa mientras la cámara cae (en pantalla)
const azB = azar(6161);
const SUBEN = Array.from({ length: 46 }, () => ({ x: azB() * 1080, y: azB() * 2400, r: 10 + Math.pow(azB(), 2) * 80, v: 0.6 + azB() * 0.8 }));
// las burbujas de oxígeno que entran en las branquias (en coordenadas del pulpo)
const OXI = Array.from({ length: 22 }, (_, i) => { const lado = i % 2 ? 1 : -1; return { lado, y0: -150 - azB() * 330, x0: lado * (330 + azB() * 160), ya: -180 - azB() * 200, t0: Toxi - 0.55 + azB() * 0.7, r: 7 + azB() * 9 }; });

export function escena(g, t, modo = "bajada") {
  const P = {
    abre: modo === "corazon" ? mez(0.55, 1, su(tr(t, 0, Tpul + 0.3))) : mez(0.15, 1, su(tr(t, 0.2, Tpul + 0.45))),
    chorro: chorro(t),
    rayos: modo === "corazon" ? 1 : su(tr(t, Ttre - 0.15, Ttre + 0.15)),
    sangre: su(tr(t, Tsan - 0.1, Tazu + 0.35)),
    vivo: [1, 1, vivoS(t)],
    flujo: t * 0.9 + 0.6 * su(tr(t, Temp - 0.2, Temp + 0.3)) * Math.max(0, t - Temp),
    pulsoBrazo: pulsoBrazo(t),
    brillaBrazos: pulso(t, Tazu + 0.38, 0.22) + pulso(t, Tbrz + 0.3, 0.25),
  };
  // los corazones aparecen uno a uno en «tres corazones» y laten
  const T1 = Ttre, T2 = Ttre + 0.2, T3 = Tcor + 0.15;
  P.corAl = modo === "corazon" ? [su(tr(t, T1 - 0.05, T1 + 0.1)), su(tr(t, T2 - 0.05, T2 + 0.1)), 1] : [su(tr(t, T1 - 0.05, T1 + 0.1)), su(tr(t, T2 - 0.05, T2 + 0.1)), su(tr(t, T3 - 0.05, T3 + 0.1))];
  const fuerteB = 1 + 0.5 * su(tr(t, Temp - 0.2, Temp + 0.1)) * (1 - su(tr(t, Tter - 0.3, Tter)));
  P.lat = [latido(t, 1.25 * fuerteB, 0.0), latido(t, 1.25 * fuerteB, 0.08), latido(t, 1.25, 0.32)];
  // el corazón del medio, antes de pararse, da un latido grande
  P.lat[2] = Math.max(P.lat[2] * (t < Tdos ? 1 : 1), pulso(t, Tpara - 0.28, 0.1));
  if (t < Tsale + 0.3 && t > Tuno) P.lat[2] = Math.max(P.lat[2], pulso(t, Tuno + 0.45, 0.1));
  P.luzCor = [pulso(t, T1 + 0.05, 0.15) + 0.8 * pulso(t, Temp + 0.05, 0.25) + 0.5 * pulso(t, Toxi + 0.3, 0.3), pulso(t, T2 + 0.05, 0.15) + 0.8 * pulso(t, Temp + 0.05, 0.25) + 0.5 * pulso(t, Toxi + 0.3, 0.3), pulso(t, T3 + 0.05, 0.15) + 0.6 * pulso(t, Tuno + 0.45, 0.15) + pulso(t, Tter + 0.1, 0.2)];
  if (modo === "corazon" && t < Tpul + 0.4) { P.lat[2] = Math.max(pulso(t, 0.08, 0.09), pulso(t, 0.62, 0.09)); P.luzCor[2] += 0.8 * P.lat[2]; }
  if (t > Tter - 0.1) P.lat[2] = Math.max(P.lat[2], pulso(t, Tter + 0.12, 0.1), pulso(t, Trep - 0.1, 0.1));

  const oy = py(t);
  const puntos = brazoPuntos(BRAZO, t, P);
  const [Z, cx, cyRel] = CAM[modo](t, puntos);
  const cy = cyRel + oy;
  // el fondo: al caer, las partículas suben deprisa
  const caida = modo === "bajada" ? 2600 * (1 - entra(tr(t, 0, Tpul + 0.2))) : 0;
  mar(g, t, cx, cy + caida, Z, 0.35);
  if (modo === "bajada") {
    const al = 1 - su(tr(t, Tpul - 0.1, Tpul + 0.3));
    if (al > 0) {
      sinVista(g);
      const d = 2600 * entra(tr(t, 0, Tpul + 0.2));
      for (const b of SUBEN) {
        const y = ((b.y - d * b.v) % 2400 + 2400) % 2400 - 240;
        g.save(); g.globalAlpha = al * 0.5; g.fillStyle = "rgba(220,245,255,0.35)"; k.redondo(g, b.x - b.r * 0.5, y, b.r, b.r * 6, b.r * 0.5); g.fill(); g.restore();
        burbuja(g, b.x, y, b.r, al);
      }
    }
  }
  vista(g, Z, cx, cy);
  g.save(); g.translate(0, oy);
  chorroAgua(g, 0, 120, P.chorro * (1 - su(tr(t, Tsale + 1.0, F2 + 0.3))), t, 1100);
  pulpo(g, t, P);
  // el oxígeno que entra en las branquias
  for (const o of OXI) {
    const u = tr(t, o.t0, o.t0 + 0.75);
    if (u <= 0 || u >= 1) continue;
    const e = su(u), gx = o.lado * 120, x = mez(o.x0, gx, e), y = mez(o.y0, o.ya, e);
    burbuja(g, x, y, o.r * (1 - 0.6 * e), Math.min(1, u * 5) * (1 - su(tr(u, 0.8, 1))));
    k.brillo(g, x, y, o.r * 5, "120,200,255", 0.6 * Math.min(1, u * 5) * (1 - u));
  }
  g.restore();
  vineta(g, 0.5);
  velo(g, 0.5);
}

export const momentos = { sale: Tsale, para: Tpara };
