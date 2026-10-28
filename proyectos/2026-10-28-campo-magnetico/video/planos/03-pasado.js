// Del escudo que se va al 5 %, las auroras que bajan, el campamento que sigue encendido, y el satélite de hoy
// cruzando el Atlántico sur.
import * as k from "#kit";
import { v } from "#voz";
import { ENC, campamento, dibujaEspacio, funde } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio - 0.04;

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const Tesc = f4.t("escudo"), Tcinco = f5.t("cinco"), Tecu = f6.t("ecuador"), Taqui = f7.t("aqui");
const Tsat = f8.t("satelites"), Tfall = f8.t("fallan");
const corte = v.frase(9).inicio - 0.04;

const Pesc = [-0.4, 0.28, 3.05];

function camEspacio(t) {
  const u = k.suave(k.tramo(t, f4.inicio, Tesc + 0.4));
  const pos = k.mezV(ENC.pos, Pesc, u);
  const mira = k.mezV(ENC.mira, [0, 0, 0], u);
  return k.mira(pos, mira);
}

export function dibuja(g, t) {
  const tp = Math.min(t, corte - 0.22);
  const baja = k.suave(k.tramo(tp, f7.inicio, Taqui - 0.05));
  const sube = k.suave(k.tramo(tp, f8.inicio, f8.t("atlantico") + 0.15));
  const cerca = baja * (1 - sube);
  const escudo = k.mez(1, 0.05, k.suave(k.tramo(tp, f4.inicio + 0.15, Tcinco)));
  const aurora = k.suave(k.tramo(tp, f6.inicio, Tecu + 0.15));
  const auroraAl = k.suave(k.tramo(tp, f6.inicio - 0.05, f6.inicio + 0.25)) * (1 - k.suave(k.tramo(tp, f8.inicio, f8.t("campo"))));
  const saa = k.suave(k.tramo(tp, f8.t("atlantico") - 0.1, f8.t("flojo")));
  const luces = 0.15 + 0.85 * k.suave(k.tramo(tp, f8.inicio, f8.t("campo")));
  const uSat = k.suave(k.tramo(tp, f8.t("sur"), Tfall + 0.05));
  const chispa = k.pulso(tp, Tfall + 0.05, 0.16);
  const cam = camEspacio(tp), antes = camEspacio(Math.min(tp, t - 1 / 60 < corte - 0.22 ? t - 1 / 60 : corte - 0.22));
  const st = {
    t: tp, escudo, aire: 0.45 + (1 - escudo) * 0.4, viento: 1, aurora, auroraAl, saa, luces,
    sat: sube > 0.65 ? { u: uSat, chispa } : null,
    velo: 0.46,
  };
  const espacio = (gg) => dibujaEspacio(gg, cam, antes, st);
  const suelo = (gg) => campamento(gg, tp);
  funde(g, cerca, espacio, suelo);
  if (cerca > 0.25 && cerca < 0.82) {
    const a = Math.sin((cerca - 0.25) / 0.57 * Math.PI);
    g.fillStyle = `rgba(190,230,255,${0.28 * a})`; g.fillRect(0, 0, 1080, 1920);
  }
  const al5 = k.suave(k.tramo(tp, Tcinco - 0.12, Tcinco + 0.2)) * (1 - k.suave(k.tramo(tp, f5.fin + 0.05, f6.inicio + 0.2)));
  if (al5 > 0.02 && cerca < 0.2) k.pastilla(g, 540, 1360, "5", "%", "140,230,255", al5, 120);
}
