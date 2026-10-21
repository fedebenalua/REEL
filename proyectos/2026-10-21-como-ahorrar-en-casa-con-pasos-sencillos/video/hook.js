// El hook, en el lavadero, con sus dos aperturas (la variante «puerta» y la variante «vapor"). La frase 2 es igual en
// las dos: la cámara se aleja hasta ver la lavadora entera, echando vapor y monedas por arriba; en «Cuatro pasos» entra
// la hucha y caen en ella cuatro monedas, una en cada palabra.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, lavadora, lavadero, moneda, vapor, hucha, RANURA, PUERTA, velo, vineta } from "./mundo.js";

const { suave: su, tramo: tr, mez, azar } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tlav = f1.t("lavar"), Tcal = f1.t("calentar"), Tagua = f1.t("agua");
const T2 = f2.inicio, Tpag = f2.t("pagas"), Tcue = f2.t("cuenta"), Tcua = f2.t("cuatro"), Tpas = f2.t("pasos"), Tgas = f2.t("gastar"), Tmen = f2.t("menos"), Fin = v.frase(3).inicio;

const HUCHA = [-40, 700], ESC_H = 0.85;
const CAIDAS = [Tcua, Tpas, Tgas, Tmen];                         // cuándo llega cada moneda a la ranura
const entraHucha = (t) => k.entra(tr(t, Tcua - 0.7, Tcua - 0.15));

// las monedas que caen al agua (frase 1) y se evaporan
const AGUA = (() => { const az = azar(3), l = []; for (let i = 0; i < 7; i++) l.push({ t0: Tcal - 0.35 + i * 0.16, x: (az() - 0.5) * 380, gira: az() }); return l; })();
// las que suben con el vapor por encima de la lavadora (frase 2)
const SUBEN = (() => { const az = azar(9), l = []; for (let i = 0; i < 16; i++) l.push({ t0: T2 - 0.2 + i * 0.17, x: (az() - 0.5) * 600, v: 380 + az() * 260, gira: az() }); return l; })();

const camPuerta = camino2D([[0, [2.3, 0, 110]], [Tcal, [2.15, 0, 120]], [Tagua + 0.3, [2.1, 0, 120]], [T2 + 0.2, [2.1, 0, 120]], [Tcue + 0.1, [0.78, 0, 60]], [Tcua - 0.3, [0.75, 0, 150]], [Fin, [0.76, 0, 160]]]);
const camVapor = camino2D([[0, [0.95, 0, -80]], [Tlav, [0.9, 0, -60]], [Tcal - 0.1, [1.2, 0, 60]], [Tagua + 0.2, [2.1, 0, 120]], [T2 + 0.2, [2.1, 0, 120]], [Tcue + 0.1, [0.78, 0, 60]], [Tcua - 0.3, [0.75, 0, 150]], [Fin, [0.76, 0, 160]]]);

export function dibujaHook(g, t, variante) {
  const [Z, cx, cy] = (variante === "vapor" ? camVapor : camPuerta)(t);
  g.fillStyle = "#101018"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, cx, cy);
  lavadero(g, t);
  // el agua: templada al principio, al rojo en «calentar»; en la variante «vapor», hirviendo desde el fotograma 0
  const caliente = variante === "vapor" ? 1 : su(tr(t, Tcal - 0.2, Tcal + 0.4));
  const calor = mez(0.42, 1, caliente), hierve = caliente;
  const giro = t * 2.4 + (variante === "vapor" ? t * 1.5 : 0);
  const calma = 1 - su(tr(t, Tmen, Fin - 0.3));
  lavadora(g, t, { calor, giro, vaho: caliente * 0.35, rueda: 1, hierve, temblor: variante === "vapor" ? (1 - su(tr(t, Tcal - 0.3, Tcal + 0.2))) * 1 + 0.2 * calma : 0.15 * caliente * calma });
  // el vapor: por la junta de la puerta y por arriba
  const sopla = variante === "vapor" ? 1 : caliente;
  vapor(g, t, PUERTA[0], PUERTA[1] - 260, 520, sopla * calma, { alto: 900, sem: 4, n: 26, tam: 1.3 });
  vapor(g, t, 0, -560, 760, sopla * su(tr(t, T2 - 0.5, T2)) * calma, { alto: 800, sem: 8, n: 20, tam: 1.4 });
  if (variante === "vapor") {
    // el fotograma 0: chorros de vapor y monedas que salen disparadas de la lavadora
    const chorro = 1 - su(tr(t, Tcal - 0.3, Tcal + 0.2));
    vapor(g, t, 0, -200, 1000, chorro * 1.6, { alto: 1400, sem: 12, n: 40, tam: 2.2 });
    const az = azar(21);
    for (let i = 0; i < 26; i++) {
      const t0 = -0.6 + i * 0.12, u = (t - t0) / 1.2; if (u < 0 || u > 1) { az(); az(); az(); continue; }
      const a = -Math.PI / 2 + (az() - 0.5) * 2.2, vv = 900 + az() * 700, gi = az();
      const x = Math.cos(a) * vv * u, y = -300 + Math.sin(a) * vv * u + 900 * u * u;
      moneda(g, x, y, 95, gi + u * 2, (1 - u) * chorro);
    }
  }
  // las monedas que caen al agua y se evaporan (frase 1)
  for (const m of AGUA) {
    const u = tr(t, m.t0, m.t0 + 0.55); if (u <= 0 || t > m.t0 + 1.1) continue;
    const y = mez(PUERTA[1] - 380, PUERTA[1] + 60, k.sale(u)), se = su(tr(t, m.t0 + 0.5, m.t0 + 1.0));
    moneda(g, PUERTA[0] + m.x * 0.6, y, 46 * (1 - 0.4 * se), m.gira + t * 1.5, 1 - se);
    if (se > 0) k.brillo(g, PUERTA[0] + m.x * 0.6, y, 260, "255,240,220", 0.5 * Math.sin(Math.PI * se));
  }
  // las que suben con el vapor por encima de la lavadora (frase 2): el dinero que se va sin darte cuenta
  for (const m of SUBEN) {
    const u = tr(t, m.t0, m.t0 + 1.6); if (u <= 0 || u >= 1) continue;
    const al = Math.sin(Math.PI * u) * calma;
    moneda(g, m.x, -560 - m.v * u * 1.6, 44, m.gira + u * 1.5, al);
  }
  // la hucha y las cuatro monedas
  const eh = entraHucha(t);
  if (eh > 0) {
    let bota = 0; for (const c of CAIDAS) bota = Math.max(bota, Math.exp(-Math.max(0, t - c) * 9) * (t > c ? 1 : 0));
    const lleno = CAIDAS.filter((c) => t > c).length / 4;
    g.save(); g.translate(mez(-1300, HUCHA[0], eh), HUCHA[1]); g.scale(ESC_H, ESC_H); hucha(g, t, { bota, brillo: lleno }); g.restore();
    for (const c of CAIDAS) {
      const u = tr(t, c - 0.42, c); if (u <= 0 || u >= 1) continue;
      const rx = HUCHA[0] + RANURA[0] * ESC_H, ry = HUCHA[1] + RANURA[1] * ESC_H;
      moneda(g, rx, mez(ry - 900, ry, u * u), 56, 0.25 + u * 0.5, 1);
    }
    for (const c of CAIDAS) if (t > c - 0.05 && t < c + 0.4) k.brillo(g, HUCHA[0] + RANURA[0] * ESC_H, HUCHA[1] + RANURA[1] * ESC_H, 380, "255,215,120", 0.8 * k.pulso(t, c + 0.05, 0.1));
  }
  sinVista(g);
  vineta(g, 0.45);
  velo(g, 0.5);
}
