// «...then open the faucet to drain it.» … «Plug the drain so nothing gets lost, pop off the cap, and unscrew the handle.»
// La cocina de perfil. «open»: la maneta gira y el grifo suelta los últimos chorros hasta quedarse seco. «Plug»: la cámara baja
// al desagüe y cae el tapón. «pop off the cap»: sube a la maneta y la tapa roja salta. «unscrew»: el destornillador saca
// el tornillo y en «handle» la maneta sale volando, dejando al aire el vástago.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaCocina, MANX, MANY } from "../cocina.js";
import { rutaCam, destornillador, velo, viñeta } from "../mundo.js";

export const desde = (vz) => vz.frase(6).t("open") - 0.04;
export const FIN = v.frase(8).inicio - 0.04;
const { suave: su, tramo: tr, mez } = k;
const F6 = v.frase(6), F7 = v.frase(7);
const T0 = desde(v), Topen = F6.t("open"), Tplug = F7.t("Plug"), Tlost = F7.t("lost"), Tpop = F7.t("pop"), Tcap = F7.t("cap"), Tand = F7.t("and"), Tunscrew = F7.t("unscrew"), Thandle = F7.t("handle");

const A = { x: 20, y: 540, s: 0.78 }, B = { x: 180, y: 780, s: 1.45 }, C = { x: -520, y: 200, s: 2.0 };
const CAMS = [[T0, A], [Tplug - 0.05, A], [Tplug + 0.55, B], [Tlost - 0.05, B], [Tlost + 0.65, C], [FIN, C]];

// el agua que sale al abrir: de golpe, y se va apagando con tosidos hasta nada
function ancho(t) {
  const a = su(tr(t, Topen + 0.4, Topen + 0.6)), b = 1 - su(tr(t, Topen + 0.7, Topen + 1.55));
  const tos = 0.6 + 0.4 * Math.sin(t * 38) * (1 - b * 0.4);
  return 68 * a * (0.25 + 0.75 * b) * (b < 0.99 ? tos : 1) * (b > 0.01 ? 1 : 0);
}

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  // la maneta
  const giroAbre = su(tr(t, Topen + 0.05, Topen + 0.6)) * 2.2;
  const lev = su(tr(t, Tpop, Tpop + 0.1));
  const tapaU = tr(t, Tpop + 0.1, Tcap + 0.45);
  const tapa = { dy: -520 * (1 - Math.pow(1 - tapaU, 2)) + 700 * 0 , dx: 80 * tapaU, rot: 9 * tapaU, al: 1 - su(tr(t, Tcap + 0.35, Tcap + 0.5)) };
  const Tdr = Tunscrew + 0.15;
  const torn = { dy: -96 * su(tr(t, Tdr + 0.15, Tdr + 0.75)), al: su(tr(t, Tcap - 0.05, Tcap + 0.25)), gira: t };
  const lift = su(tr(t, Thandle + 0.0, Thandle + 0.55));
  const manetaDy = -1500 * lift * lift;
  const sube = 26 * su(tr(t, Topen + 0.05, Topen + 0.6));
  dibujaCocina(g, t, {
    cam, chorro: { w: ancho(t) }, gotas: [], nivel: 22,
    tapon: { dy: -900 * Math.pow(1 - su(tr(t, Tplug + 0.1, Tplug + 0.62)), 2) + 0, al: su(tr(t, Tplug + 0.0, Tplug + 0.1)) },
    maneta: { rot: giroAbre, sube, tapa, tornillo: torn, vastago: lift > 0.02, vastagoY: 0, maneta: { dy: manetaDy, rot: giroAbre, al: 1 - su(tr(t, Thandle + 0.5, Thandle + 0.55)) } },
    despues: (g2, tt) => {
      // el destornillador, desde arriba, sobre el tornillo
      const entra = su(tr(tt, Tand - 0.25, Tunscrew + 0.15)), sale = su(tr(tt, Thandle - 0.1, Thandle + 0.35));
      if (entra > 0.01 && sale < 0.99) {
        const tipY = MANY - 316 - 20 + torn.dy + (1 - entra) * -900 + sale * -900;
        destornillador(g2, MANX, tipY, 0, 0.9, tt * 2);
      }
    },
  });
  velo(g, 0.36); viñeta(g, 0.42);
}
