// Hook: un túnel de días, todos con lo que pasó todavía dentro. En «semana» se sella el día. En «hicieron» se abre el paraguas.
import * as k from "#kit";
import { v } from "#voz";
import { HERO, lluvia, paraguas, proyectaTarjeta, tunel, velo } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1);
const f2 = v.frase(2);
const Tfecha = f2.t("fecha");
const Tsemana = f2.t("semana");
const Thic = f2.t("hicieron");

const zCam = k.claves([
  [0, 3.55],
  [0.9, 7.6],
  [2.5, 11.6],
  [f1.fin, 15.35],
  [Tfecha, 15.85],
  [9.2, 15.85],
]);

export function dibuja(g, t) {
  const z = zCam(t);
  const cam = k.mira([0, 0.02, z], [0, 0.05, z + 8]);
  const sello = k.entra(k.tramo(t, Tsemana - 0.04, Tsemana + 0.34));
  const abre = k.entra(k.tramo(t, Thic - 0.06, Thic + 0.5));
  tunel(g, cam, { escenaHero: 1 });
  const r = proyectaTarjeta(cam, HERO);
  if (r && r.w > 280 && r.al > 0.85) {
    const sx = r.x - r.w * 0.36, sy = r.y - r.h * 0.18, sw = r.w * 0.72, sh = r.h * 0.48;
    lluvia(g, sx, sy, sw, sh, t, 0.25 + abre * 0.75);
    if (abre > 0.02) paraguas(g, r.x, r.y + r.h * 0.08, r.w * 0.42, abre);
    if (sello > 0.02) {
      g.save();
      g.translate(r.x, r.y + r.h * 0.28);
      g.rotate(-0.06);
      g.globalAlpha = sello;
      const sc = 0.82 + 0.18 * sello;
      g.scale(sc, sc);
      g.font = `800 ${Math.max(32, r.w * 0.13)}px Figtree`;
      g.textAlign = "center"; g.textBaseline = "middle";
      g.lineWidth = 8; g.strokeStyle = "#102416"; g.strokeText("MARTES", 0, 0);
      g.fillStyle = "#b6ff72"; g.fillText("MARTES", 0, 0);
      g.restore();
    }
  }
  velo(g, 0.8);
}
