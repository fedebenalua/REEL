// La otra apertura: el flash.
// - Fotograma 0: un estudio oscuro; el gato cae boca arriba de arriba abajo y cada flash deja una copia quieta suya en
//   el aire, como una foto de larga exposición. En «pie» aterriza de pie en el suelo brillante: la pantalla tiene la
//   vuelta entera dibujada, de boca arriba a de pie.
// - «aunque los sueltes boca arriba»: las copias se apagan y el gato vuelve atrás, subiendo y girando al revés hasta
//   quedar boca arriba en «arriba».
// - «Se dan la vuelta en el aire, sin nada en lo que apoyarse»: el estudio se apaga y queda el vacío azul; el gato,
//   boca arriba, patalea sin nada que tocar (igual que la otra apertura, para seguir con el plano 02).
import * as k from "#kit";
import { v } from "#voz";
import { gato, vacio, vuelta, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, lienzo } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tpie = f1.t("pie"), Taun = f1.t("aunque"), Tarr = f1.t("arriba"), Tse = f2.inicio, Taire = f2.t("aire"), Tnada = f2.t("nada");
const aterriza = Tpie - 0.03;
const SUELO = 1395, Y0 = 600, YF = SUELO - 0.98 * 240, X0 = 700, XF = 450;

// la caída: de arriba abajo, cada vez más deprisa, girando
const posY = (t) => mez(Y0, YF, Math.pow(tr(t, 0, aterriza), 1.6) * 0.75 + tr(t, 0, aterriza) * 0.25);
const posX = (t) => mez(X0, XF, su(tr(t, 0, aterriza)));
const estado = (t) => ({ x: posX(t), y: posY(t), esc: 240, ang: -0.18 * (1 - su(tr(t, 0.5, aterriza))), ...vuelta(tr(t, 0.02, aterriza - 0.1)), t });

// los flashes y sus copias quietas (dibujadas una vez)
const FLASH = [0.0, 0.36, 0.7, 1.0, 1.28, 1.55];
const COPIAS = FLASH.map((tf) => { const c = lienzo(1080, 1920); gato(c.getContext("2d"), estado(tf)); return c; });

function estudio(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#0b0d22"); bg.addColorStop(0.7, "#141634"); bg.addColorStop(1, "#05060f");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 700, 1500, "120,140,255", 0.3);
  // el suelo brillante
  const sg = g.createLinearGradient(0, SUELO, 0, 1920); sg.addColorStop(0, "#2a2c52"); sg.addColorStop(1, "#090a18");
  g.fillStyle = sg; g.fillRect(0, SUELO, 1080, 1920 - SUELO);
  g.fillStyle = "rgba(170,190,255,0.35)"; g.fillRect(0, SUELO, 1080, 4);
  k.brillo(g, 540, SUELO + 20, 900, "140,160,255", 0.25);
}

export function dibuja(g, t) {
  const deshace = su(tr(t, Taire - 0.05, Taire + 0.75));
  if (deshace > 0) vacio(g, t, 0.5, 40 * su(tr(t, Tnada, f2.fin)));
  if (deshace < 1) { g.save(); g.globalAlpha = 1 - deshace; estudio(g, t); g.restore(); }
  // las copias que va dejando cada flash
  const apaga = 1 - su(tr(t, Taun, Taun + 0.6));
  for (let i = 0; i < FLASH.length; i++) {
    if (t < FLASH[i] + 0.02 || apaga <= 0) continue;
    g.save(); g.globalAlpha = 0.5 * apaga * (0.55 + 0.45 * (i / FLASH.length)); g.drawImage(COPIAS[i], 0, 0); g.restore();
  }
  // el gato
  let e;
  if (t < aterriza) e = estado(t);
  else if (t < Taun) e = { ...estado(aterriza), ...vuelta(1), aplasta: k.pulso(t, aterriza + 0.06, 0.09) };
  else if (t < Tarr) { const w = su(tr(t, Taun, Tarr)); e = { ...estado(aterriza * (1 - w)), ...vuelta(1 - w) }; }
  else {
    // boca arriba; luego baja despacio al sitio del plano siguiente
    const w = su(tr(t, Tse, f2.fin));
    const pat = mez(0.5, 1, su(tr(t, Tnada - 0.2, Tnada + 0.3))) * (1 - 0.5 * su(tr(t, f2.fin - 0.3, f2.fin + 0.1)));
    e = { x: mez(X0, 470, w), y: mez(Y0, 1000, w), esc: mez(240, 350, w), ang: mez(-0.18, -0.12, w), ...vuelta(0), patalea: t < Tse ? 0.5 : pat, t };
  }
  if (deshace < 1 && t < Tse) {
    // su reflejo en el suelo, cuando está cerca
    const cerca = su(tr(e.y, YF - 300, YF));
    if (cerca > 0.01) { g.save(); g.globalAlpha = 0.25 * cerca; g.translate(0, 2 * SUELO); g.scale(1, -1); gato(g, e); g.restore(); g.fillStyle = "rgba(9,10,24,0.0)"; }
  }
  gato(g, e);
  // el fogonazo de cada flash
  // cada flash: un destello suave sobre el gato, que deja su copia
  let fl = 0, tfl = 0;
  for (const tf of FLASH) { const p = k.pulso(t, tf + 0.02, 0.07); if (p > fl) { fl = p; tfl = tf; } }
  if (fl > 0.01 && t < aterriza + 0.1) { const c = estado(tfl); g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, c.x, c.y, 900, "200,215,255", 0.35 * fl); g.restore(); }
  vineta(g, 0.45);
  velo(g, 0.45);
}
