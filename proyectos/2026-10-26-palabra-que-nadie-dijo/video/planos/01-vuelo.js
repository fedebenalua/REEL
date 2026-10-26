// El cuarto oscuro. Desde el fotograma 0, dormir está enorme y nadie la ha soltado por el megáfono.
import * as k from "#kit";
import { v } from "#voz";
import { cuaderno, ficha, luces, megafono, noche, onda, pluma, suelo, velo } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tnadie = f1.t("nadie"), Tdijo = f1.t("dijo");
const Tcama = f2.t("cama"), Tdes = f2.t("descanso"), Tdespi = f2.t("despierto");
const Tesc = f2.t("escribe"), Tdor = f2.t("dormir");
const Tno = f3.t("no"), Tpron = f3.t("pronuncio");
const corte = v.t("aula") - 0.04;
const quieto = (t) => 1 - k.suave(k.tramo(t, corte - 0.4, corte - 0.14));

const az = k.azar(19);
const CHISPAS = Array.from({ length: 42 }, () => ({ a: az() * 6.28, r: 0.35 + az() * 1.2, s: 0.45 + az() }));

const camara = k.ruta([
  [0, { pos: [0.15, 0.18, 3.05], mira: [0.15, -0.02, 1.35] }],
  [1.05, { pos: [0.28, 0.1, 2.72], mira: [0.22, -0.04, 1.25] }],
  [Tnadie - 0.05, { pos: [-0.15, 0.22, 4.15], mira: [-0.15, -0.08, 1.7] }],
  [Tdijo + 0.25, { pos: [-0.05, 0.2, 4.25], mira: [-0.1, -0.08, 1.75] }],
  [Tcama - 0.15, { pos: [0.05, 0.32, 4.7], mira: [0.35, -0.15, 1.9] }],
  [Tdespi, { pos: [0.1, 0.28, 4.85], mira: [0.4, -0.2, 1.95] }],
  [Tdor, { pos: [0.2, 0.12, 4.15], mira: [0.35, -0.35, 1.7] }],
  [Tno + 0.2, { pos: [0.12, 0.16, 4.35], mira: [0.28, -0.12, 1.75] }],
  [corte, { pos: [0.12, 0.16, 4.35], mira: [0.28, -0.12, 1.75] }],
]);

const RANURAS = [
  [1.05, 0.58, 2.2],
  [1.05, 0.02, 2.2],
  [1.05, -0.54, 2.2],
];
const NOMBRES = ["CAMA", "DESCANSO", "DESPIERTO"];
const SALIDAS = [Tcama, Tdes, Tdespi];
const MEGA = [-1.25, -0.02, 2.35];

function lateral(i, t) {
  const u = k.sale(k.tramo(t, 0, 1.35));
  const x = (i - 1) * k.mez(1.35, 2.8, u);
  const z = k.mez(1.55, 0.7, u);
  return [x, 0.15 + (i - 1) * 0.15, z];
}

export function dibuja(g, t) {
  const cam = camara(t);
  const q = quieto(t);
  noche(g, 0.04);
  luces(g, cam, 0.75);
  suelo(g, cam);

  const mega = k.proyecta(cam, MEGA);
  const muestraMega = t > Tnadie - 0.45;
  const abierto = k.suave(k.tramo(t, Tcama - 0.2, Tdespi + 0.15)) * (1 - k.suave(k.tramo(t, Tpron - 0.1, Tpron + 0.28)));
  let boca = null;
  if (mega && muestraMega) {
    const entra = k.entra(k.tramo(t, Tnadie - 0.45, Tnadie + 0.2));
    const s = (k.F * 0.95) / mega.z * entra;
    megafono(g, mega.x, mega.y, s, 0.08 + 0.92 * abierto);
    boca = { x: mega.x + s * 0.42, y: mega.y };
    SALIDAS.forEach((Ts) => {
      const u = k.tramo(t, Ts, Ts + 0.42);
      if (u > 0 && u < 1) onda(g, boca.x, boca.y, 24 + u * 140, (1 - u) * 0.75);
    });
  }

  const libro = k.proyecta(cam, [0.25, -0.72, 1.85]);
  if (libro && t > f1.fin - 0.15) {
    const s = (k.F * 1.25) / libro.z;
    const sube = k.suave(k.tramo(t, Tno - 0.08, Tno + 0.5));
    cuaderno(g, libro.x - s * 0.58, libro.y - s * 0.28, s * 1.2, s * 0.78, { vacio: sube });
    const escribe = k.tramo(t, Tesc - 0.05, Tdor + 0.2);
    if (escribe > 0 && sube < 0.9) {
      pluma(g, libro.x + s * 0.05, libro.y - (1 - Math.min(1, escribe)) * 70, s * 0.48, -0.45);
      if (sube < 0.25) {
        g.save();
        g.font = `800 ${s * 0.15}px Figtree`;
        g.fillStyle = "#7a4e08";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.globalAlpha *= Math.min(1, escribe * 1.3) * (1 - sube);
        g.fillText("DORMIR", libro.x + s * 0.05, libro.y + s * 0.16);
        g.restore();
      }
    }
  }

  NOMBRES.forEach((nombre, i) => {
    const Ts = SALIDAS[i];
    if (t < Tcama - 0.2) {
      const al = 1 - k.suave(k.tramo(t, 0.85, 1.4));
      for (let s = 3; s >= 0; s--) {
        const tt = Math.max(0, t - s * 0.035);
        ficha(g, cam, lateral(i, tt), nombre, { al: al * (0.28 + 0.24 * (3 - s)), alto: 0.46 });
      }
      return;
    }
    const u = k.entra(k.tramo(t, Ts - 0.04, Ts + 0.5));
    const pos = k.mezV(MEGA, RANURAS[i], u);
    pos[1] += Math.sin(t * 1.5 + i) * 0.025 * q * u;
    ficha(g, cam, pos, nombre, { al: k.suave(k.tramo(t, Ts - 0.08, Ts + 0.18)), alto: 0.46 });
  });

  const baja = k.suave(k.tramo(t, Tesc - 0.1, Tdor + 0.05));
  const levanta = k.suave(k.tramo(t, Tno - 0.05, Tpron - 0.2));
  const hero = [0.2, 0.0 + Math.sin(t * 1.8) * 0.025 * q, 1.4];
  const enPagina = [0.32, -0.48, 1.7];
  const suelto = [0.45, 0.28, 1.55];
  let posD = k.mezV(hero, enPagina, baja);
  posD = k.mezV(posD, suelto, levanta);
  const alHero = t < Tesc ? 1 : levanta > 0.02 ? levanta : 1 - k.suave(k.tramo(t, Tesc, Tdor + 0.1));
  const alto = k.mez(0.95, 0.5, baja * (1 - levanta)) ;
  ficha(g, cam, posD, "DORMIR", { fantasma: 1, al: alHero, alto });

  if (t < Tesc + 0.2) {
    const u = 1 - k.suave(k.tramo(t, 0, 1.2));
    for (const c of CHISPAS) {
      const a = c.a + t * 2.2;
      const r = c.r * (0.15 + u);
      const P = k.proyecta(cam, [posD[0] + Math.cos(a) * r, posD[1] + Math.sin(a) * r * 0.55, posD[2] + 0.05]);
      if (P) k.brillo(g, P.x, P.y, 8 + c.s * 14, "255,210,110", (0.25 + 0.55 * u) * c.s);
    }
  }

  velo(g);
}
