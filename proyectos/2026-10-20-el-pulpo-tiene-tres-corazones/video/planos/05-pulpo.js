// «...hay que empujarla más fuerte: por eso, tres corazones. Y cuando nada a chorro, apretando el cuerpo, ese tercer
// corazón se para. Nadar así le agota en pocos metros: por eso casi siempre va andando. Así que el pulpo no anda porque
// sea lento: anda para que no se le pare el corazón. Envíaselo a ese amigo...»
// El mar otra vez, con el mismo pulpo transparente. Se entra con un corte en «hay». Una sola cámara hasta el final.
// - «hay que empujarla más fuerte»: pegados a sus tres corazones, que laten cada vez más deprisa; la sangre corre más.
// - «por eso, tres corazones»: se encienden uno, dos, tres, con su número.
// - «Y cuando nada a chorro»: la cámara se aleja; aprieta el cuerpo y sale disparado hacia arriba con su chorro.
// - «apretando el cuerpo»: la cámara se acerca al cuerpo, que se aprieta a golpes y aplasta las venas que vuelven.
// - «ese tercer corazón se para»: el del medio late cada vez más flojo y en «para» se queda gris.
// - «Nadar así le agota en pocos metros»: frena, abre los brazos y baja despacio; aparece el fondo de arena.
// - «por eso casi siempre va andando»: apoya los brazos en la arena y echa a andar; el corazón vuelve a latir.
// - «no anda porque sea lento»: en «lento», un acelerón por la arena.
// - «anda para que no se le pare el corazón»: la cámara se acerca al corazón del medio, que late grande.
// - El cierre: la cámara se aleja con el pulpo andando por el fondo; en «tres corazones», los tres se encienden juntos.
import * as k from "#kit";
import { v } from "#voz";
import { mar, vista, sinVista, camino2D, pulpo, latido, vineta, velo, chorroAgua, fondoMar, brazoPuntos, SUELO, SIS, BR1, BR2 } from "../mundo.js";

export const desde = "hay";

const { suave: su, tramo: tr, mez, entra, pulso } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const T0 = f7.t("hay"), Temp = f7.t("empujarla"), Tfue = f7.t("fuerte"), Ttre = f7.t("tres"), Tcor = f7.t("corazones"), F7 = f7.fin;
const Tnad = f8.t("nada"), Tcho = f8.t("chorro"), Tapr = f8.t("apretando"), Tcue = f8.t("cuerpo"), Tese = f8.t("ese"), Tcz = f8.t("corazon"), Tpar = f8.t("para"), F8 = f8.fin;
const Tago = f9.t("agota"), Tmet = f9.t("metros"), Teso = f9.t("eso"), Tand = f9.t("andando");
const Tlen = f10.t("lento"), Tan2 = f10.t("anda", 2), Tpare = f10.t("pare"), Tcz2 = f10.t("corazon");
const T11 = f11.inicio, Ttr3 = f11.t("tres"), Tco3 = f11.t("corazones"), FIN = 48.4;

// ---------------------------------------------------------------- dónde está el pulpo
const Tsube = Tcho - 0.05, Tfrena = Tago + 0.3;
const ALTO = 1000;
// sube a chorro, frena, y baja despacio hasta apoyarse
const pie = Math.max(...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => Math.max(...brazoPuntos(i, 0, { anda: 1, abre: 1, paso: 0 }).map((q) => q.y))));
const POSADO = SUELO - pie + 25;
const Tposa = Teso + 0.25;
const subeY = (t) => -ALTO * entra(tr(t, Tsube, Tfrena + 0.2));
const oyF = (t) => (t < Tfrena ? subeY(t) : mez(subeY(Tfrena + 0.2), POSADO, su(tr(t, Tfrena + 0.2, Tposa))));
// anda hacia la derecha; en «lento», un acelerón
const Tanda = Tposa - 0.15;
const oxF = (t) => {
  if (t < Tanda) return 0;
  const d = t - Tanda;
  return 170 * d + 650 * su(tr(t, Tlen - 0.15, Tlen + 0.45)) - 80 * su(tr(t, Tlen + 0.45, Tlen + 0.9));
};
const chorroF = (t) => su(tr(t, Tsube - 0.1, Tsube + 0.2)) * (1 - su(tr(t, Tago - 0.1, Tfrena + 0.4)));
const andaF = (t) => su(tr(t, Tposa - 0.35, Tposa + 0.25));
// el cuerpo se aprieta a golpes mientras nada
const golpes = (t) => (t > Tsube && t < Tfrena ? 0.5 + 0.5 * Math.pow(Math.max(0, Math.sin((t - Tsube) * 6.2832 * 1.3)), 2) : 1) * chorroF(t);
// el corazón del medio: flojo, se para en «para», vuelve al andar
const vivoS = (t) => Math.min(1, 1 - su(tr(t, Tpar - 0.08, Tpar + 0.12)) + su(tr(t, Tposa + 0.1, Tand + 0.3)));

// ---------------------------------------------------------------- la cámara (relativa al pulpo, salvo el cierre)
const camRel = camino2D([
  [T0, [1.75, 0, -215]], [Tfue + 0.2, [1.75, 0, -215]], [Ttre - 0.1, [1.5, 0, -215]], [F7, [1.5, 0, -215]],
  [Tcho - 0.05, [0.95, 0, -20]], [Tapr - 0.05, [0.95, 0, 30]], [Tcue + 0.1, [1.6, 0, -240]], [Tpar + 0.3, [1.6, 0, -230]],
  [Tmet, [0.72, 0, 150]], [Tposa, [0.72, 120, 120]], [Tand + 0.3, [0.75, 140, 60]],
  [Tlen - 0.2, [0.75, 120, 60]], [Tlen + 0.5, [0.72, 0, 60]], [Tan2 + 0.1, [0.85, 0, 0]], [Tcz2 - 0.25, [1.8, 0, -215]], [Tcz2 + 0.5, [1.8, 0, -215]],
  [T11 + 0.2, [1.5, 0, -150]], [Ttr3 - 0.4, [0.72, 60, -60]], [FIN, [0.7, 70, -60]],
]);

const NUM = [[BR1, "1"], [BR2, "2"], [SIS, "3"]];

export function dibuja(g, t) {
  const ox = oxF(t), oy = oyF(t) + (t > Tposa ? 8 * Math.sin(ox / 300 * 6.2832 * 2) : 0);
  const anda = andaF(t), chorro = chorroF(t);
  const fuerte = su(tr(t, Temp - 0.2, Tfue + 0.2)) * (1 - su(tr(t, F7 - 0.2, Tcho)));
  const frec = 1.25 + 1.0 * fuerte;
  const vS = vivoS(t);
  // el del medio, cada vez más flojo antes de pararse
  const flojo = 1 - 0.6 * su(tr(t, Tese, Tpar - 0.1)) * (t < Tposa ? 1 : 0);
  const P = {
    abre: 1, chorro, anda, paso: ox / 300, rayos: 1, sangre: 1,
    vivo: [1, 1, vS],
    flujo: t * 0.9 + 1.4 * fuerte * Math.max(0, t - Temp) * 0 + fuerte * 0.9 * t,
    vuelve: 1 - 0.75 * (golpes(t)),
    lat: [latido(t, frec, 0), latido(t, frec, 0.08), latido(t, frec * (t > Tese && t < Tpar ? 0.8 : 1), 0.32) * flojo],
    luzCor: [0, 0, 0],
  };
  // cada corazón se enciende en «tres corazones», y los tres juntos al final
  const Tn = [Ttre - 0.02, Ttre + 0.12, Tcor + 0.08];
  P.luzCor = Tn.map((tn, i) => pulso(t, tn + 0.05, 0.18) + pulso(t, Ttr3 + 0.1, 0.22) + pulso(t, Tco3 + 0.15, 0.25) + 0.4 * fuerte);
  P.luzCor[2] += pulso(t, Tese + 0.2, 0.2) + pulso(t, Tand + 0.05, 0.25) + pulso(t, Tcz2 + 0.05, 0.22);
  P.lat[2] = Math.max(P.lat[2], pulso(t, Tcz2 + 0.02, 0.1) * vS);
  for (const tn of [Ttr3 + 0.1, Tco3 + 0.15]) for (let i = 0; i < 3; i++) P.lat[i] = Math.max(P.lat[i], pulso(t, tn, 0.09));

  const [Z, cxR, cyR] = camRel(t);
  // en el cierre la cámara deja de seguirle de cerca y se queda mirando el fondo, un poco por delante de él
  const cx = cxR + ox, cy = cyR + oy;
  const hondo = mez(0.35, 0.6, su(tr(t, Tfrena, Tposa)));
  mar(g, t, cx, cy, Z, hondo);
  vista(g, Z, cx, cy);
  fondoMar(g, t, su(tr(t, Tago, Tposa - 0.3)) * 1);
  g.save(); g.translate(ox, oy);
  chorroAgua(g, 0, 120, chorro * (t < Tfrena ? 1 : 0), t, 1100);
  pulpo(g, t, P);
  // los números de los corazones
  const alN = su(tr(t, Ttre - 0.05, Ttre + 0.1)) * (1 - su(tr(t, F7 - 0.15, Tcho - 0.1)));
  NUM.forEach(([pos, n], i) => {
    const a = alN * su(tr(t, Tn[i] - 0.05, Tn[i] + 0.08));
    if (a <= 0.01) return;
    g.font = "800 46px Figtree"; const w = g.measureText(n).width + 52;
    k.etiqueta(g, pos[0] - w / 2 + (i === 2 ? 0 : (i ? 1 : -1) * 105), pos[1] + (i === 2 ? -160 : -130), n, "150,205,255", a, 46);
  });
  g.restore();
  vineta(g, 0.5);
  velo(g, 0.5);
}

export const momentos = { sube: Tsube, para: Tpar, posa: Tposa, lento: Tlen };
