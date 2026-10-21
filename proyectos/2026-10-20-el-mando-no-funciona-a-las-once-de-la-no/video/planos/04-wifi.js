// «Si tu tele está conectada al wifi, el móvil puede hablar con ella directamente.»
// «Con una app de mando, la pantalla del móvil se convierte en los botones de la tele.»
// «Enciendes, subes el volumen, cambias de canal… y vuelves a tu serie.»
// El salón de noche, con una sola cámara. Se entra con un corte en «Si».
// - «conectada al wifi»: en el mueble, el router; en «wifi» salen sus ondas y en la tele aparece el símbolo.
// - «el móvil»: sube el móvil; «hablar con ella»: puntos de luz azul van y vienen entre los dos.
// - «Con una app de mando»: la cámara se acerca a la pantalla del móvil; «se convierte en los botones»: los botones
//   van apareciendo uno a uno.
// - La cámara vuelve. «Enciendes»: la tele se apaga y se enciende con el toque; «subes el volumen»: sube la barra;
//   «cambias de canal»: pasa al atardecer; «vuelves a tu serie»: vuelve la serie.
import * as k from "#kit";
import { v } from "#voz";
import { SERIE, TV, appMando, iconoWifi, movil, ojito, ondasWifi, pr, router, salon, velo } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
export const desde = (vz) => vz.frase(5).inicio;
const T5 = f5.inicio, Tcon = f5.t("conectada"), Twifi = f5.t("wifi"), Tmov = f5.t("movil"), Thab = f5.t("hablar");
const T6 = f6.inicio, Tapp = f6.t("app"), Tpan = f6.t("pantalla"), Tbot = f6.t("botones"), Fin6 = f6.fin;
const Tenc = f7.t("enciendes"), Tsub = f7.t("subes"), Tcam = f7.t("cambias"), Tvue = f7.t("vuelves"), Fin = v.frase(8).inicio;
const CAM = { x: 0, y: 20, z: 0.6 }, MOVIL = { x: 560, y: 1270, w: 470, ang: -0.12 };
const Tapaga = Tenc - 0.35, Tprende = Tenc + 0.1;
const TOQUES = [Tapaga - 0.05, Tsub, Tcam, Tvue];

const azP = azar(31);
const PUNTOS = Array.from({ length: 40 }, () => ({ f: azP(), d: azP() < 0.5 ? 1 : -1, cur: (azP() - 0.5) * 220 }));
function charla(g, a, b, t, t0, t1, ida = 0) {
  const al = su(tr(t, t0, t0 + 0.2)) * (1 - su(tr(t, t1 - 0.25, t1)));
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const p of PUNTOS) {
    const dir = ida ? 1 : p.d, u0 = ((t - t0) * 1.4 + p.f) % 1, u = dir > 0 ? u0 : 1 - u0;
    const mx = (a.x + b.x) / 2 + p.cur, my = Math.min(a.y, b.y) - 160;
    const x = (1 - u) * (1 - u) * a.x + 2 * u * (1 - u) * mx + u * u * b.x, y = (1 - u) * (1 - u) * a.y + 2 * u * (1 - u) * my + u * u * b.y;
    k.brillo(g, x, y, 60, "90,220,255", al * Math.min(1, u0 * 6) * Math.min(1, (1 - u0) * 6));
  }
  g.restore();
}

export function dibuja(g, t) {
  // la cámara: zoom a la pantalla del móvil mientras aparecen los botones
  const z = su(tr(t, Tapp - 0.3, Tpan)) * (1 - su(tr(t, Tbot + 0.45, Tapaga - 0.05)));
  const Z = Math.exp(mez(0, Math.log(2.1), z)), F = { x: mez(540, MOVIL.x - 10, z), y: mez(960, MOVIL.y - 60, z) };
  g.save(); g.translate(540, 960); g.scale(Z, Z); g.translate(-F.x, -F.y);
  const encendida = 1 - su(tr(t, Tapaga, Tapaga + 0.12)) * (1 - su(tr(t, Tprende, Tprende + 0.2)));
  const canal = SERIE + su(tr(t, Tcam + 0.1, Tcam + 0.5)) - su(tr(t, Tvue + 0.1, Tvue + 0.5));
  const volAl = su(tr(t, Tsub - 0.15, Tsub + 0.1)) * (1 - su(tr(t, Tcam - 0.1, Tcam + 0.2)));
  salon(g, CAM, t, { encendida, flash: t - Tprende, canal, volumen: mez(0.3, 0.8, su(tr(t, Tsub + 0.1, Tsub + 0.7))), volAl });
  const r = router(g, CAM, t, entra(tr(t, Tcon - 0.1, Tcon + 0.3)));
  if (r) ondasWifi(g, r.x, r.y - 30 * r.s, t, su(tr(t, Twifi - 0.15, Twifi + 0.2)) * (1 - 0.6 * su(tr(t, T6, T6 + 0.5))), 1100 * r.s);
  const tv = pr(CAM, TV.X + TV.W / 2 - 50, TV.Y - TV.H / 2 + 45, TV.Z);
  iconoWifi(g, tv.x, tv.y + 20 * tv.s, 40 * tv.s, su(tr(t, Twifi, Twifi + 0.3)) * encendida);
  // el móvil
  const sube = entra(tr(t, Tmov - 0.25, Tmov + 0.2));
  const my = mez(2600, MOVIL.y, sube);
  const toque = TOQUES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.05, 0.12)), 0);
  const aparecen = mez(0, 7, tr(t, Tpan - 0.1, Tbot + 0.3)) + (t < Tapp - 0.3 ? 7 : 0);
  if (sube > 0) movil(g, MOVIL.x, my, MOVIL.w, MOVIL.ang, (c, W, H) => { appMando(0.7 * toque, aparecen)(c, W, H); iconoWifi(c, W - 120, 110, 50, 1); });
  const pm = { x: MOVIL.x - 30, y: my - 470 }, b = ojito(CAM);
  charla(g, pm, b, t, Thab - 0.15, T6 + 0.3);
  for (const te of TOQUES) charla(g, pm, b, t, te, te + 0.55, 1);
  g.restore();
  velo(g, 0.45);
}

export const momentos = { wifi: Twifi, toques: TOQUES };
