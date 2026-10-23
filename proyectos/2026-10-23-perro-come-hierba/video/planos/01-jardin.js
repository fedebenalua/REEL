// Jardín: el hocico en la hierba, la creencia, los diez perros y la edad.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const Thierba = f1.t("hierba");
const Tmalo = f2.t("malo");
const Tvomitar = f2.t("vomitar");
const Tmiraron = f3.t("miraron");
const Tocho = f3.t("ocho");
const Tnunca = f4.t("nunca");
const Tjovenes = f5.t("jovenes");
const Tcorte = v.frase(6).inicio;

const COME = new Set([0, 1, 3, 4, 5, 6, 8, 9]);

function sitio(i) {
  return { x: m.HERO.x + (i - 4) * 198, y: m.HERO.y };
}

export function dibuja(g, t) {
  const z = k.claves([
    [0, 2.15],
    [Thierba, 1.62],
    [Tmalo - 0.2, 1.15],
    [Tvomitar, 1.05],
    [Tmiraron, 1.0],
    [Tmiraron + 1.55, 0.6],
    [Tocho, 0.62],
    [Tnunca, 0.62],
    [Tjovenes - 0.15, 0.6],
    [Tjovenes + 0.7, 0.82],
    [Tcorte - 0.35, 0.84],
  ])(t);
  const fx = k.claves([
    [0, 1120],
    [Thierba, 1100],
    [Tmalo, 1280],
    [Tmiraron, 1220],
    [6.85, 780],
    [7.65, 1620],
    [8.15, 1160],
    [Tnunca, 1160],
    [Tjovenes, 1100],
    [Tjovenes + 0.8, 1100],
    [Tcorte - 0.3, 1100],
  ])(t);
  const fy = k.claves([
    [0, 1160],
    [Thierba, 1180],
    [Tmalo, 1220],
    [Tmiraron + 1.5, 1360],
    [Tjovenes + 0.6, 1320],
    [Tcorte - 0.3, 1310],
  ])(t);
  const cam = { z, fx, fy };
  const fila = k.suave(k.tramo(t, Tmiraron, Tmiraron + 1.35));
  const edad = k.suave(k.tramo(t, Tjovenes - 0.2, Tjovenes + 0.55));
  const bajaOcho = k.suave(k.tramo(t, Tocho - 0.12, Tocho + 0.38));
  const vecina = k.suave(k.tramo(t, f2.inicio, f2.inicio + 0.7)) * (1 - k.suave(k.tramo(t, Tmiraron, Tmiraron + 0.8)));
  const creencia = k.suave(k.tramo(t, Tvomitar - 0.08, Tvomitar + 0.28)) * (1 - k.suave(k.tramo(t, Tmiraron, Tmiraron + 0.9)));
  const intento = k.suave(k.tramo(t, f4.inicio, f4.inicio + 0.8));
  const trueno = k.pulso(t, Tnunca, 0.12);
  const queda = k.suave(k.tramo(t, Tnunca + 0.05, Tnunca + 0.45));

  m.conCam(g, cam, () => {
    m.jardin(g, t);
    m.conAlfa(g, vecina, () => {
      m.persona(g, 1620, 1420, 1.35, {
        t, termo: true, preocupa: k.suave(k.tramo(t, Tmalo - 0.1, Tmalo + 0.25)),
        miraX: -4, color: "#ff5a3c", color2: "#ffc2ae",
      });
    });
    for (let i = 0; i < 10; i++) {
      const p = sitio(i);
      const esHero = i === 4;
      const esCachorro = i === 1;
      const esViejo = i === 8;
      let al = 1;
      let x = p.x, y = p.y + (COME.has(i) ? Math.sin(t * 7.2 + i) * 16 * k.suave(k.tramo(t, Tocho, Tocho + 0.3)) : 0), s = 0.92;
      let viejo = 0;
      if (edad > 0.01 && !esCachorro && !esViejo) al = 1 - edad;
      if (esCachorro) {
        x = k.mez(p.x, 620, edad);
        s = k.mez(0.92, 1.72, edad);
      } else if (esViejo) {
        x = k.mez(p.x, 1580, edad);
        s = k.mez(0.92, 1.22, edad);
        viejo = edad;
      }
      if (al < 0.03) continue;
      const come = COME.has(i);
      const baja = esHero && edad < 0.5
        ? k.mez(1, come ? 0.35 + 0.65 * bajaOcho : 0.08, fila)
        : (come ? 0.25 + 0.75 * bajaOcho : 0.02) * (1 - edad) + (esCachorro ? edad : esViejo ? edad * 0.22 : 0);
      g.save();
      g.globalAlpha *= al;
      m.perro(g, x, y, esHero && edad < 0.15 ? k.mez(1.72, 0.78, fila) : s, {
        t, piel: esHero ? m.CANELA : m.pielDe(i),
        baja, come: baja > 0.45, viejo, sem: i * 0.7,
        miraY: -7, alerta: esHero ? 0.15 : 0,
        ritmo: esViejo ? 3.2 : 8,
        cola: (1 - edad) * 0.35 + (esCachorro ? edad * 0.7 : 0.1),
      });
      g.restore();
      if (esCachorro) m.monton(g, x - 20, y + 20, 18, t, edad);
      if (come && edad < 0.35) m.monton(g, x - 10, y - 20, 9, t, (esHero ? 1 - fila * 0.3 : bajaOcho) * al);
    }
    m.hierbaDelante(g, t);
    g.save();
    g.translate(1480, 980);
    g.scale(1.8, 1.8);
    m.chorro(g, 0, 0, creencia, t, true);
    g.restore();
    for (let i = 0; i < 10; i++) {
      if (!COME.has(i) || edad > 0.2) continue;
      const p = sitio(i);
      const sube = intento * (1 - queda);
      g.save();
      g.translate(p.x, p.y - 260 - sube * 80);
      g.scale(1.7 + trueno, 1.7 + trueno);
      m.chorro(g, 0, 0, sube * 0.95, t, true);
      g.restore();
    }
  });
  m.rafaga(g, 1 - k.suave(k.tramo(t, 0.05, 0.85)));
  m.velo(g, 0.78);
}
