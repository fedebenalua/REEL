// Hook. Frases 1 a 3. Un pasillo de fichas ya acertadas que se van; luego el mazo
// sobre la mesa, una se aparta y el montón apartado se apaga.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, velo } from "../mundo.js";

export const desde = 0;

const az = k.azar(71);
const TUNEL = Array.from({ length: 14 }, (_, i) => ({
  z: 1.6 + i * 1.55,
  x: (i % 2 === 0 ? -1 : 1) * (0.05 + (i % 3) * 0.22),
  y: -0.02 + (i % 2 === 0 ? -0.18 : 0.16),
  icono: i % 10,
  giro: (az() - 0.5) * 0.35,
}));

export function dibuja(g, t) {
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
  const Tva = f1.t("va"), T40 = f2.t("cuarenta"), Tsale = f2.t("sale"), Tap = f2.t("apartas");
  const Tsem = f3.t("semana");

  cuarto(g, t, 1);
  mesa(g, 1240);

  // Ya va deprisa en el fotograma 0: la clave de antes de 0 la pilla a media carrera.
  const avanza = k.claves([[-1.1, -0.4], [Tva, 9.2], [Tva + 0.4, 9.35]]);
  const cam = k.mira([0, 0.05, avanza(t)], [0, -0.12, avanza(t) + 14]);
  const tunel = 1 - k.suave(k.tramo(t, Tva - 0.05, Tva + 0.42));

  if (tunel > 0.02) {
    const cosas = [];
    for (const c of TUNEL) {
      const P = k.proyecta(cam, [c.x, c.y, c.z]);
      if (!P || P.z > 18) continue;
      const w = k.tamano(0.78, P.z);
      cosas.push({
        z: P.z,
        dibuja() {
          carta(g, P.x, P.y, w, {
            icono: c.icono,
            giro: c.giro,
            check: 1,
            al: tunel,
            fuego: P.z < 2.4 ? 0.42 * tunel : 0,
            brilloColor: "90,255,160",
          });
        },
      });
    }
    k.deLejosACerca(cosas);
  }

  const llega = k.entra(k.tramo(t, Tva - 0.02, T40 + 0.35));
  const abre = k.suave(k.tramo(t, T40 + 0.05, Tsale - 0.08));
  const check = k.entra(k.tramo(t, Tsale - 0.04, Tsale + 0.26));
  const aparta = k.suave(k.tramo(t, Tap - 0.02, Tap + 0.5));
  const apaga = k.entra(k.tramo(t, f3.inicio, f3.inicio + 0.4));
  const ultimo = k.entra(k.tramo(t, Tsem - 0.04, Tsem + 0.32));

  if (llega > 0.02) {
    const cx = 470, cy = 1120;
    for (let i = 0; i < 8; i++) {
      const es = i === 1;
      const abierta = (i - 3.5) * 112 * abre;
      const x0 = cx + abierta;
      const y0 = cy - Math.abs(i - 3.5) * 22 * abre;
      const x = es ? k.mez(x0, 760, aparta) : x0;
      const y = es ? k.mez(y0, 1280, aparta) : y0;
      carta(g, x, y, k.mez(90, 210, llega), {
        icono: i,
        giro: (i - 3.5) * 0.06 * abre + (es ? aparta * 0.35 : 0),
        al: llega * (es ? 1 - aparta * 0.2 : 1),
        check: es ? check : 0,
        olvido: es ? apaga : 0,
        fuego: es && check > 0.5 && aparta < 0.4 ? 0.5 : 0,
        brilloColor: "90,255,160",
      });
    }
    // el canto del mazo, para que se vean muchas
    if (abre < 0.92) {
      for (let i = 0; i < 10; i++) {
        carta(g, cx + 8 + i * 3, cy + 70 - (1 - abre) * i * 7, k.mez(80, 150, llega), {
          icono: (i + 2) % 10,
          al: llega * (1 - abre) * 0.95,
          giro: 0.02,
        });
      }
    }
    if (aparta > 0.35) {
      const al = k.suave(k.tramo(aparta, 0.35, 0.8));
      for (let i = 0; i < 4; i++) {
        carta(g, 700 + i * 18, 1180 + ultimo * (80 + i * 40), 190, {
          icono: i + 4,
          giro: 0.08 + ultimo * (i % 2 ? 0.35 : -0.3),
          al: al * (1 - ultimo * 0.15),
          olvido: 0.2 + apaga * 0.75,
          check: 0.9,
        });
      }
    }
  }

  velo(g, 0.8);
}
