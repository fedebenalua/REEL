// Otra vez el jardín: uno de cada diez, el remate y el amigo del veterinario.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(8).inicio - 0.04;
export const entrada = "corte";

const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const Tdiez = f8.t("diez");
const Tmalo = f8.t("malo");
const Tvomitan = f8.t("vomitan");
const Tpurgando = f9.t("purgando");
const Tnormal = f9.t("normal");
const Tsabe = f9.t("sabe");
const Tprueba = f10.t("prueba");
const Tvet = f10.t("veterinario");

const COME = new Set([0, 1, 3, 4, 5, 6, 8, 9]);
const ENFERMO = 5;

function sitio(i) {
  return { x: m.HERO.x + (i - 4) * 198, y: m.HERO.y };
}

export function dibuja(g, t) {
  const z = k.claves([
    [f8.inicio, 0.6],
    [Tvomitan, 0.66],
    [f9.inicio, 0.62],
    [Tpurgando, 1.15],
    [Tnormal, 1.4],
    [Tsabe, 1.35],
    [f10.inicio, 0.92],
    [Tprueba, 0.95],
    [Tvet - 0.15, 1.05],
    [Tvet + 0.85, 2.15],
    [v.duracion - 0.15, 2.15],
  ])(t);
  const fx = k.claves([
    [f8.inicio, 1200],
    [f9.inicio, 1160],
    [Tpurgando, 1080],
    [Tsabe, 1080],
    [f10.inicio, 1000],
    [Tvet, 1080],
  ])(t);
  const fy = k.claves([
    [f8.inicio, 1280],
    [Tpurgando, 1120],
    [Tnormal, 1040],
    [f10.inicio, 1160],
    [Tvet + 0.7, 1000],
  ])(t);
  const cam = { z, fx, fy };
  const rojo = k.suave(k.tramo(t, Tmalo - 0.1, Tmalo + 0.35)) * (1 - k.suave(k.tramo(t, Tpurgando - 0.05, Tpurgando + 0.45)));
  const charco = k.suave(k.tramo(t, Tvomitan - 0.08, Tvomitan + 0.28)) * (1 - k.suave(k.tramo(t, Tpurgando, Tpurgando + 0.4)));
  const pregunta = k.suave(k.tramo(t, Tsabe - 0.45, Tsabe + 0.05)) * (1 - k.suave(k.tramo(t, f10.inicio, f10.inicio + 0.45)));
  const amigo = k.suave(k.tramo(t, f10.inicio, f10.inicio + 0.55)) * (1 - k.suave(k.tramo(t, Tvet + 0.15, Tvet + 0.7)));
  const cerca = k.suave(k.tramo(t, Tpurgando, Tnormal));
  const enf = sitio(ENFERMO);

  m.conCam(g, cam, () => {
    m.jardin(g, t);
    for (let i = 0; i < 10; i++) {
      const p = sitio(i);
      const es = i === ENFERMO;
      const hero = i === 4;
      const al = es || hero ? 1 : 1 - cerca * 0.92;
      if (al < 0.03) continue;
      const come = COME.has(i);
      g.save();
      g.globalAlpha *= al;
      const base = hero ? m.CANELA : m.pielDe(i);
      const sacude = es ? Math.sin(t * 8) * 20 * k.pulso(t, Tmalo, 0.35) : Math.sin(t * 5.5 + i) * 7;
      m.perro(g, p.x + sacude, p.y, hero ? k.mez(0.92, 1.75, cerca) : 0.92, {
        t, piel: es ? m.pielRoja(base, rojo) : base,
        baja: es ? 0.08 : (come ? 0.95 : 0.04),
        come: come && !es, sem: i * 0.55,
        rojo: es ? rojo : 0, miraY: es ? -6 : 3,
        cola: es ? 0.05 : 0.28, ritmo: 7,
      });
      g.restore();
    }
    if (rojo > 0.2 || charco > 0.05) {
      g.save();
      g.globalCompositeOperation = "lighter";
      g.globalAlpha *= rojo * 0.45;
      g.fillStyle = "#ff3030";
      g.beginPath();
      g.arc(enf.x, enf.y - 80, 150, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
    m.charco(g, enf.x + 20, enf.y + 40, charco);
    m.hierbaDelante(g, t);
    const ax = k.mez(280, 700, amigo);
    m.conAlfa(g, amigo, () => {
      m.persona(g, ax, 1480, 1.28, {
        t, movil: true, preocupa: 0.8, miraX: 5,
        color: "#ffd23a", color2: "#fff0a8", brazo: -0.2,
      });
    });
    m.cruz(g, ax + 40, 1120, 1.15, amigo * k.suave(k.tramo(t, Tvet - 0.12, Tvet + 0.2)));
  });
  m.interrogante(g, pregunta);
  const rush = k.suave(k.tramo(t, Tvet + 0.05, Tvet + 0.55)) * (1 - k.suave(k.tramo(t, Tvet + 0.7, Tvet + 1.05)));
  m.rafaga(g, rush);
  m.velo(g, 0.76);
}
