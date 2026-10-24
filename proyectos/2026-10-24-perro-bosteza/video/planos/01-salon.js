// El salón: el bostezo salta de una boca a la otra, y el cariño no lo explica.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);

function campana(t, a, b, c) {
  return k.suave(k.tramo(t, a, b)) * (1 - k.suave(k.tramo(t, b, c)));
}

function bocaPerro(t) {
  const inicio = k.mez(0.8, 1, k.suave(k.tramo(t, 0, 0.42)));
  const cierra = k.suave(k.tramo(t, f1.fin + 0.02, f2.t("sueno") + 0.02));
  let y = inicio * (1 - cierra);
  y = Math.max(y, campana(t, f2.t("salta") - 0.04, f2.t("salta") + 0.24, f2.fin + 0.08));
  const mitad = k.suave(k.tramo(t, f3.t("boca") + 0.02, f3.t("mitad") + 0.02));
  const mitadFuera = k.suave(k.tramo(t, f3.t("bostezo") - 0.18, f3.t("bostezo") + 0.08));
  y = Math.max(y, 0.22 * mitad * (1 - mitadFuera));
  y = Math.max(y, campana(t, f3.t("bostezo") + 0.02, f3.t("verdad") + 0.02, f3.t("verdad") + 0.4));
  y = Math.max(y, campana(t, f3.t("doble") - 0.08, f3.t("doble") + 0.16, f3.fin - 0.02));
  y = Math.max(y, campana(t, f4.t("entraba") - 0.08, f4.t("mas") - 0.02, f4.fin + 0.12));
  y = Math.max(y, campana(t, f5.t("entra") - 0.02, f5.t("igual") + 0.02, f5.fin + 0.18));
  y = Math.max(y, campana(t, f6.t("acaricies") - 0.06, f6.t("acaricies") + 0.26, f6.t("o") + 0.02));
  y = Math.max(y, campana(t, f6.t("pases") - 0.04, f6.t("largo") + 0.06, f6.fin + 0.22));
  y = Math.max(y, campana(t, f8.t("copia") + 0.02, f8.t("bostezo") + 0.12, f8.t("quiero") - 0.12));
  const fin = k.suave(k.tramo(t, f9.t("bosteza") - 0.08, f9.t("cara") + 0.35));
  if (t > f9.t("bosteza") - 0.15) {
    const sigue = 0.06 * Math.sin((t - f9.t("cara")) * 2.2);
    y = Math.max(y, Math.min(1, k.mez(0.7, 1, fin) + (t > f9.t("cara") ? sigue : 0)));
  }
  return Math.min(1, y);
}

function bocaDueno(t) {
  let y = k.mez(0.45, 1, k.suave(k.tramo(t, 0.2, f1.t("bostezas") + 0.25)));
  y *= 1 - k.suave(k.tramo(t, f1.fin - 0.05, f2.t("sueno") - 0.05));
  y = Math.max(y, campana(t, f2.t("le") - 0.08, f2.t("salta") - 0.02, f2.t("tuyo") + 0.2));
  const gape = k.suave(k.tramo(t, f3.t("abres"), f3.t("boca") + 0.08))
    * (1 - k.suave(k.tramo(t, f3.t("mitad") + 0.45, f3.t("bostezo") - 0.05)));
  y = Math.max(y, 0.3 * gape);
  y = Math.max(y, campana(t, f3.t("bostezo") - 0.08, f3.t("verdad") - 0.02, f3.t("doble") + 0.25));
  y = Math.max(y, campana(t, f4.t("contigo") - 0.05, f4.t("entraba"), f4.fin - 0.05));
  y = Math.max(y, campana(t, f6.t("acaricies") - 0.12, f6.t("acaricies") + 0.22, f6.t("o")));
  y = Math.max(y, campana(t, f6.t("pases") - 0.06, f6.t("largo"), f6.fin + 0.12));
  y = Math.max(y, campana(t, f8.inicio + 0.05, f8.t("copia"), f8.t("bostezo") + 0.35));
  y = Math.max(y, campana(t, f9.t("bosteza") - 0.15, f9.t("cara") - 0.05, f9.t("cara") + 0.55));
  return Math.min(1, y);
}

function dondeDueno(t) {
  const sale = k.suave(k.tramo(t, f6.t("o"), f6.fin + 0.05));
  const vuelve = k.suave(k.tramo(t, f7.inicio + 0.15, f7.t("todo") - 0.2));
  const x = k.mez(k.mez(m.OX, 210, sale), m.OX, vuelve);
  const yendo = sale > 0.04 && sale < 0.97 && t < f7.inicio + 0.05;
  const volviendo = vuelve > 0.04 && vuelve < 0.97;
  const paso = yendo || volviendo ? 1 : 0;
  const fase = (yendo || volviendo ? t - f6.t("o") : 0) * 1.6;
  const dir = volviendo && vuelve < 0.9 ? -1 : 1;
  return { x, paso, fase, dir };
}

export function dibuja(g, t) {
  const bp = bocaPerro(t);
  const bd = bocaDueno(t);
  const dueno = dondeDueno(t);
  const h = m.hocico(bp, -0.05);
  const entra = k.suave(k.tramo(t, f5.t("estudios") + 0.08, f5.t("extrano")));
  const seVa = k.suave(k.tramo(t, f5.fin + 0.02, f6.inicio + 0.25));
  const extraAl = entra * (1 - seVa);
  const be = campana(t, f5.t("extrano") + 0.12, f5.t("entra") + 0.05, f5.t("igual") + 0.4) * (extraAl > 0.4 ? 1 : 0);

  const cerca = 1 - k.suave(k.tramo(t, 0.08, 1.12));
  const alFinal = k.suave(k.tramo(t, f9.t("cara") - 0.05, f9.t("cara") + 0.55));
  const masCerca = k.suave(k.tramo(t, f9.t("quiero") - 0.15, Math.min(32.6, f9.fin + 0.5)));
  const Zc = k.claves([
    [1.15, 4.55],
    [f2.t("sueno"), 6.2],
    [f2.t("salta"), 5.3],
    [f2.fin, 4.7],
    [f3.t("mitad"), 5.1],
    [f3.t("doble"), 6.4],
    [f3.fin, 4.6],
    [f4.t("carino"), 4.35],
    [f5.t("extrano"), 4.15],
    [f5.t("igual"), 4.3],
    [f6.t("acaricies"), 6.6],
    [f6.t("largo"), 4.5],
    [f7.t("tension"), 6.8],
    [f7.fin, 5.2],
    [f8.t("copia"), 5.4],
    [f8.t("quiero"), 5],
    [f9.inicio, 4.5],
    [f9.t("cara") - 0.2, 4.7],
  ])(t);
  const Z = k.mez(k.mez(k.mez(Zc, 16.5, cerca), 17.2, alFinal), 21, masCerca);
  const cxC = k.claves([
    [1.15, -10],
    [f2.t("sueno"), h[0] - 6],
    [f2.t("salta"), -15],
    [f3.t("mitad"), -8],
    [f3.t("doble"), h[0]],
    [f4.t("carino"), -16],
    [f5.t("extrano"), -16],
    [f5.t("igual"), -8],
    [f6.inicio, 16],
    [f6.t("acaricies"), 40],
    [f6.t("largo"), 120],
    [f7.inicio, h[0]],
    [f8.t("copia"), -6],
    [f9.inicio, 10],
  ])(t);
  const cyC = k.claves([
    [1.15, -78],
    [f2.t("sueno"), h[1] + 6],
    [f2.t("salta"), -70],
    [f3.t("mitad"), -72],
    [f3.t("doble"), h[1] + 10],
    [f4.fin, -80],
    [f5.t("igual"), -78],
    [f6.t("acaricies"), -62],
    [f6.t("largo"), -70],
    [f7.t("tension"), h[1] + 4],
    [f8.t("copia"), -74],
    [f9.inicio, -76],
  ])(t);
  const cx = k.mez(k.mez(cxC, h[0], cerca), h[0], alFinal);
  const cy = k.mez(k.mez(cyC, h[1] + 14, cerca), h[1] + 16, alFinal);
  const c = { Z, cx, cy };

  m.sinVista(g);
  g.fillStyle = "#f6c9a6";
  g.fillRect(0, 0, 1080, 1920);
  m.ponVista(g, c);
  m.salon(g, t, Math.max(entra, 0.15));

  const acaricia = k.suave(k.tramo(t, f6.inicio + 0.05, f6.t("acaricies") - 0.02))
    * (1 - k.suave(k.tramo(t, f6.t("o") - 0.04, f6.t("o") + 0.2)));
  const mano = acaricia > 0.05 ? [m.DX - 36, -64] : null;

  if (1 - extraAl > 0.03) {
    g.save();
    g.globalAlpha = 1 - extraAl;
    m.persona(g, {
      x: dueno.x, dir: dueno.dir, fase: dueno.fase, paso: dueno.paso, t,
      inclina: -0.1 * bd, boca: bd * (1 - extraAl), mano, tira: acaricia,
    });
    g.restore();
  }

  if (extraAl > 0.03) {
    g.save();
    g.globalAlpha = extraAl;
    m.persona(g, {
      x: m.OX, dir: 1, fase: 0.2, paso: 0, t,
      inclina: -0.1 * be, boca: be,
      chaqueta: ["#9fd8ff", "#2f86e0", "#184e96"], pelo: "#efe6c8",
    });
    g.restore();
  }

  m.perro(g, {
    x: m.DX, dir: -1, marcha: 0, fase: 0.15, t,
    cola: 0.42, pitch: 0.02 * bp,
    bostezo: bp,
    cabeza: { ang: -0.06 - 0.28 * bp, oreja: 0.08 * (1 - bp) },
  });

  const ola = (t0, t1) => {
    const u = k.tramo(t, t0, t1);
    if (u <= 0 || u >= 1) return;
    const a = [dueno.x + 18 * dueno.dir, -150];
    const b = [h[0], h[1]];
    const x = a[0] + (b[0] - a[0]) * u;
    const y = a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * 22;
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = Math.sin(u * Math.PI) * 0.9;
    g.fillStyle = "#ffe27a";
    g.beginPath(); g.arc(x, y, 7 + 4 * Math.sin(u * Math.PI), 0, Math.PI * 2); g.fill();
    g.restore();
  };
  if (t < f3.inicio) ola(f2.t("le") + 0.02, f2.t("salta") + 0.02);
  ola(f8.inicio + 0.08, f8.t("copia") + 0.12);

  const amor = k.suave(k.tramo(t, f4.t("carino") - 0.08, f4.t("carino") + 0.4))
    * (1 - k.suave(k.tramo(t, f5.t("igual") - 0.15, f5.t("igual") + 0.35)));
  const amor2 = campana(t, f7.t("carino") - 0.06, f7.t("carino") + 0.2, f7.t("tension") - 0.06);
  const quiero = campana(t, f8.t("quiero") - 0.06, f8.t("quiero") + 0.18, f8.t("no") + 0.12);
  const calor = Math.max(amor, amor2, quiero);
  if (calor > 0.02) k.brillo(g, (dueno.x + m.DX) / 2, -70, 150, "255,150,110", 0.55 * calor);

  const tension = campana(t, f7.t("tension") - 0.04, f7.t("tension") + 0.26, f7.t("explican") + 0.12);
  if (tension > 0.02) {
    g.save();
    g.globalAlpha = tension;
    g.strokeStyle = "#c9a0ff"; g.lineWidth = 2.4;
    g.beginPath(); g.arc(h[0], h[1] + 6, 28 + 10 * (1 - tension), 0, Math.PI * 2); g.stroke();
    g.restore();
    k.brillo(g, h[0], h[1], 46, "violeta", 0.45 * tension);
  }

  m.sinVista(g);
  m.velo(g, 0.78);
  m.vineta(g, 0.32);
}
