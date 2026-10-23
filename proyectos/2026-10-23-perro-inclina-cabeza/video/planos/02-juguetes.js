// «Le pedían un juguete, por su nombre.» El cuarto de los juguetes, hasta «mano».
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "juguete";

const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const Tnombre = f3.t("nombre");
const Tsiete = f4.t("siete");
const Tcuatro = f4.t("cuatro");
const Tfin4 = f4.fin;
const Ttreinta = f5.t("treinta");
const Tmeses = f5.t("meses");
const Tdos = f5.t("dos");
const Tcien = f5.t("cien");
const Tfin5 = f5.fin;
const Tlado = f6.t("lado");
const Tdespues = f6.t("despues");
const Tmano = f6.t("mano");

const SIETE = [
  [540, 1220, 1.28, m.LADEO, m.MIEL],
  [230, 1160, 0.78, -0.55, null],
  [880, 1140, 0.82, 0.48, null],
  [150, 1340, 0.62, 0.4, null],
  [930, 1360, 0.64, -0.62, null],
  [390, 1040, 0.55, -0.32, null],
  [720, 1020, 0.55, 0.6, null],
];

export function dibuja(g, t) {
  const aSiete = k.suave(k.tramo(t, Tsiete - 0.05, Tsiete + 0.5)) * (1 - k.suave(k.tramo(t, Ttreinta - 0.15, Ttreinta + 0.45)));
  const aGris = k.suave(k.tramo(t, Ttreinta - 0.05, Ttreinta + 0.45)) * (1 - k.suave(k.tramo(t, Tlado - 0.35, Tlado + 0.2)));
  const aVuelta = k.suave(k.tramo(t, Tlado - 0.3, Tlado + 0.25));
  const z = k.claves([
    [0, 1.45],
    [Tnombre - 0.1, 1.35],
    [Tnombre + 0.45, 1.12],
    [Tsiete + 0.2, 0.66],
    [Tfin4, 0.8],
    [Ttreinta + 0.3, 1.12],
    [Tdos, 0.92],
    [Tlado, 1.08],
    [Tmano - 0.2, 1.05],
  ])(t);
  const fy = k.claves([
    [0, 860],
    [Tnombre, 980],
    [Tsiete + 0.4, 1120],
    [Ttreinta + 0.4, 1000],
    [Tdos, 1180],
    [Tlado, 1080],
    [Tmano, 1080],
  ])(t);
  const cam = { z, fx: 540, fy };
  m.conCam(g, cam, () => m.cuarto(g, t));

  const aBolaNombre = (1 - aSiete) * (1 - aGris) * (1 - aVuelta);
  const oro = k.suave(k.tramo(t, Tnombre - 0.05, Tnombre + 0.35));
  if (aBolaNombre > 0.02) {
    m.conAlfa(g, aBolaNombre, (c) => m.conCam(c, cam, () => m.pelota(c, 540, 860, 150, oro)));
  }
  const aMiel = (1 - k.suave(k.tramo(t, Ttreinta - 0.1, Ttreinta + 0.4))) * (1 - aVuelta);
  if (aMiel > 0.02) {
    const tilt = m.LADEO * k.suave(k.tramo(t, Tcuatro - 0.1, Tcuatro + 0.4));
    m.conAlfa(g, aMiel, (c) => m.conCam(c, cam, () => {
      m.perro(c, 540, 1240, 1.28, { t, ladeo: tilt, oreja: 0.22, alerta: 0.45, sem: 0.6, miraX: -4 });
    }));
  }

  // diez pelotas, cuatro saltan
  if (aSiete > 0.05) {
    m.conCam(g, cam, () => {
      for (let i = 0; i < 10; i++) {
        const salta = i === 1 || i === 4 || i === 6 || i === 8;
        const u = salta ? k.suave(k.tramo(t, Tcuatro - 0.05 + (i % 3) * 0.04, Tcuatro + 0.38)) : 0;
        const x = 120 + i * 90 + (i % 2) * 18;
        const y = 1480 + (i % 3) * 16 - u * 260;
        m.pelota(g, x, y, 40 + (i % 3) * 6 + u * 18, u);
      }
    });
  }

  // siete perros, cada uno a su lado
  if (aSiete > 0.02) {
    m.conAlfa(g, aSiete, (c) => m.conCam(c, cam, () => {
      const llega = k.suave(k.tramo(t, Tsiete - 0.05, Tsiete + 0.55));
      SIETE.forEach((s, i) => {
        if (i === 0) return;
        const [x, y, sc, lado] = s;
        const tilt = lado * k.suave(k.tramo(t, Tcuatro - 0.08, Tcuatro + 0.42));
        m.perro(c, x, y + (1 - llega) * 90, sc, {
          t, ladeo: tilt, piel: m.pielDe(i), alerta: 0.35, sem: i * 0.4, oreja: 0.18,
        });
      });
    }));
  }

  // los treinta y tres: uno grande, cabeza recta, y unos pocos detrás
  if (aGris > 0.02) {
    m.conAlfa(g, aGris, (c) => m.conCam(c, cam, () => {
      const detras = [[260, 1240, 0.7], [820, 1220, 0.72], [180, 1400, 0.55], [900, 1420, 0.55]];
      detras.forEach((d, i) => m.perro(c, d[0], d[1], d[2], { t, ladeo: 0, piel: m.pielDe(i + 2), sem: i }));
      m.perro(c, 540, 1200, 1.22, { t, ladeo: 0, piel: m.GRIS, alerta: 0.05, sem: 1.4, oreja: 0.05 });
      // tres meses: tres hojas que caen y se quedan
      const colores = ["#5dce8a", "#ffd45a", "#7ec8f0"];
      colores.forEach((col, i) => {
        const t0 = Tmeses - 0.12 + i * 0.32;
        const ang = k.claves([[t0, -0.7], [t0 + 0.5, 0.06 + i * 0.05]])(t);
        const entra = k.suave(k.tramo(t, t0, t0 + 0.22));
        if (entra > 0.02) {
          c.save();
          c.globalAlpha *= entra;
          m.hoja(c, 210 + i * 36, 820, ang, col);
          c.restore();
        }
      });
    }));
  }

  // dos de cada cien: el montón, solo dos encendidas
  const aMonton = k.suave(k.tramo(t, Tdos - 0.15, Tdos + 0.25)) * (1 - k.suave(k.tramo(t, Tfin5 - 0.05, Tlado - 0.15)));
  if (aMonton > 0.02) {
    m.conAlfa(g, aMonton, (c) => m.conCam(c, cam, () => {
      const enciende = k.suave(k.tramo(t, Tcien - 0.1, Tcien + 0.3));
      for (const b of m.MONTON) m.pelota(c, b.x, b.y, b.r, b.oro ? enciende : 0);
    }));
  }

  // el mismo lado, meses después: encaja en su sombra
  if (aVuelta > 0.02) {
    const llega = k.suave(k.tramo(t, Tlado - 0.15, Tlado + 0.4));
    const otra = k.suave(k.tramo(t, Tdespues - 0.05, Tdespues + 0.45));
    const tilt = m.LADEO * Math.max(llega, otra);
    m.conAlfa(g, 0.38 * aVuelta, (c) => m.conCam(c, cam, () => {
      m.perro(c, 540, 1200, 1.32, { t: 0, ladeo: m.LADEO, oreja: 0.22, alerta: 0.4, sem: 2 });
    }));
    m.conAlfa(g, aVuelta, (c) => m.conCam(c, cam, () => {
      m.perro(c, 540, 1200, 1.32, { t, ladeo: tilt, oreja: 0.22, alerta: 0.55, sem: 0.6 });
    }));
  }

  m.velo(g, 0.5);
}
