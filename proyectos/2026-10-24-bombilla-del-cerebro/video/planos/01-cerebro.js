// Frases 1 a 4. Un solo sitio: el cerebro. La cámara vuela, se abre a la persona y vuelve.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, chispas, velo, fondo, bombilla, botella, persona, llama, rayas } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, mezV, entra, orbita, mira, proyecta, tamano, F } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const Tbot = f1.t("botella"), Tlitro = f1.t("litro"), Tgasta = f1.t("gasta"), Tbomb = f1.t("bombilla");
const Tdia = f1.t("dia"), Tnoche = f1.t("noche");
const Tcuerpo = f2.t("cuerpo"), Tbebe = f2.t("bebe"), Tcinco = f2.t("cinco");
const Tapag = f3.t("apagado"), Tsobra = f4.t("sobra");
const Tquieto = Tsobra + 0.48;

export function camEn(t) {
  const tc = Math.min(t, Tquieto);
  const vuelo = tr(tc, 0, Tbot);
  let ang = 1.25 + 0.45 * vuelo;
  let dist = 0.98 + 0.28 * vuelo;
  let alt = 0.05;
  let mx = 0.0, my = 0.02;

  const uAbre = entra(tr(tc, f1.t("pesa"), Tlitro + 0.15));
  ang = mez(ang, 0.72, uAbre);
  dist = mez(dist, 3.85, uAbre);
  alt = mez(alt, -0.02, uAbre);
  mx = mez(mx, 0, uAbre);

  const uBul = su(tr(tc, Tgasta, Tbomb + 0.2));
  ang = mez(ang, 0.62, uBul);
  dist = mez(dist, 4.05, uBul);

  const uDia = su(tr(tc, Tdia, Tnoche + 0.25));
  ang = mez(ang, 0.12, uDia * 0.3);

  const uCuerpo = su(tr(tc, f2.inicio + 0.08, Tcuerpo + 0.4));
  dist = mez(dist, 5.3, uCuerpo);
  alt = mez(alt, -0.85, uCuerpo);
  my = mez(my, -0.55, uCuerpo);
  ang = mez(ang, 1.15, uCuerpo);
  const uEmpuje = su(tr(tc, Tcinco - 0.2, f3.inicio));
  dist = mez(dist, 4.35, uEmpuje);

  const uVuelve = su(tr(tc, f3.inicio, Tapag));
  dist = mez(dist, 3.15, uVuelve);
  alt = mez(alt, 0.04, uVuelve);
  my = mez(my, 0.02, uVuelve);
  ang = mez(ang, 0.95, uVuelve);

  const uIsla = su(tr(tc, f4.t("solo"), f4.t("trocito") + 0.25));
  dist = mez(dist, 2.7, uIsla);
  ang = mez(ang, 1.05, uIsla);

  return mira(orbita(ang, dist, alt), [mx, my, 0]);
}

function poner(g, cam, X, alto, dibuja) {
  const P = proyecta(cam, X);
  if (!P) return;
  dibuja(P.x, P.y, tamano(alto, P.z));
}

export function pinta(g, t, cam) {
  const dia = su(tr(t, Tdia - 0.05, Tdia + 0.2)) * (1 - su(tr(t, Tnoche - 0.08, Tnoche + 0.28)));
  fondo(g, 1 - dia, 1);
  const uBot = entra(tr(t, Tbot - 0.08, Tlitro));
  const uBul = entra(tr(t, Tgasta - 0.05, Tbomb + 0.2));
  const seVan = 1 - su(tr(t, f2.inicio, Tcuerpo));
  const posBot = mezV([-2.2, 0.2, 0.4], [-1.55, -0.35, 0.15], uBot);
  const posBul = mezV([2.4, 0.7, 0.2], [1.55, 0.22, -0.05], uBul);

  poner(g, cam, posBot, 1.15, (x, y, h) => botella(g, x, y, h, uBot * seVan));
  poner(g, cam, posBul, 1.25, (x, y, h) => bombilla(g, x, y, h, t, uBul * seVan, 1));

  const uCuerpo = su(tr(t, f2.inicio + 0.05, Tcuerpo + 0.15));
  const uVuelve = su(tr(t, f3.inicio, f3.t("casi")));
  const alPersona = uCuerpo * (1 - uVuelve);
  const C = proyecta(cam, [0, 0, 0]);
  if (C && alPersona > 0.02) {
    const r = tamano(1.2, C.z);
    persona(g, C.x, C.y, r, alPersona);
    const pechoY = C.y + r * 2.7;
    const uSube = su(tr(t, Tbebe, Tcinco + 0.2));
    for (let i = 0; i < 5; i++) {
      const x0 = C.x - r * 0.9 + i * r * 0.45;
      const sube = i === 2;
      const x = sube ? mez(x0, C.x, uSube) : x0;
      const y = sube ? mez(pechoY, C.y + r * 0.15, uSube) : pechoY;
      const h = r * (sube ? 1.15 : 0.85);
      llama(g, x, y, h, t, i * 1.7, alPersona * (sube ? 1 : 0.85));
    }
  }

  const ap = su(tr(t, f3.t("casi"), f4.t("trocito") + 0.15));
  const cae = su(tr(t, f4.t("resto"), Tsobra + 0.32));
  cerebro(g, cam, t, { apagado: ap, isla: 1, cae, al: 1 });
  const calma = 1 - su(tr(t, Tsobra + 0.3, f4.fin));
  chispas(g, cam, t, (1 - ap * 0.85) * calma);

  rayas(g, t, (1 - su(tr(t, 0.05, Tbot))) * 0.9, 1);
  if (C && uBul > 0.2 && seVan > 0.4) k.brillo(g, C.x, C.y, (F * 1.4) / C.z, "255,170,70", 0.16 * seVan);
  velo(g, 0.58);
}

export function dibuja(g, t) { pinta(g, t, camEn(t)); }
