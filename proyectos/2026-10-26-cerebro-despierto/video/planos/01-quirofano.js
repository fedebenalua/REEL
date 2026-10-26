// Gancho: el cerebro ya abierto y enorme, el guante lo hunde, el ojo está despierto.
import * as k from "#kit";
import { v } from "#voz";
import { quirofano, lampara, craneo, cerebro, guante, ojo, boca, velo } from "../mundo.js";

export const desde = 0;
const f1 = v.frase(1), f2 = v.frase(2);
const Tcer = f1.t("cerebro"), Thab = f1.t("hablando"), Tgri = f2.t("gritas");

export function dibuja(g, t) {
  const entra = k.suave(k.tramo(t, 0, 3.4));
  const pres = k.suave(k.tramo(t, Tcer - 0.12, Tcer + 0.45));
  const habla = k.suave(k.tramo(t, Thab - 0.15, Thab + 0.3)) * (1 - k.suave(k.tramo(t, Thab + 0.45, Thab + 0.85)));
  const alOjo = k.suave(k.tramo(t, 4.5, 7.05));
  const S = k.mez(360, 480, entra);
  const cx = k.mez(560, 680, alOjo);
  const cy = k.mez(1080, 1240, alOjo);

  quirofano(g, t);
  lampara(g, 1);
  craneo(g, cx, cy, S * 0.92);
  cerebro(g, cx, cy, S * 0.72, { presion: pres, tx: 0.22, ty: -0.05, brillo: 0.06 + 0.06 * Math.sin(t * 2.1) ** 2 });
  const llegaMano = k.suave(k.tramo(t, 0.15, 2.15));
  guante(g, k.mez(cx + S * 0.95, cx + S * 0.2, llegaMano), cy - S * 0.06, 220, pres * 26);
  // el ojo, en el paño, sin una cabeza suelta
  const ox = k.mez(280, 360, alOjo), oy = k.mez(760, 700, alOjo), os = k.mez(120, 190, alOjo);
  g.save();
  g.fillStyle = "#f0b090";
  g.beginPath();
  g.ellipse(ox, oy + 30, os * 1.7, os * 1.35, 0, 0, 6.28);
  g.fill();
  g.restore();
  ojo(g, ox, oy, os, 1);
  boca(g, ox + 10, oy + os * 1.15, os * 0.55, 0.2 + habla * 0.85);
  velo(g, 0.78);
}
