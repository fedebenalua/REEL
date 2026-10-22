// «A simple vista casi no se aprecia» hasta el cierre.
// El desnivel casi no se ve, el vídeo lo enseña, y al final la cámara vuelve a la cola del principio.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = "simple";
export const entrada = "corte";

const f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const Tvista = f9.t("vista");
const Tvid = f9.t("video");
const Tacer = f10.t("acerca");
const Tap = f10.t("aparta");
const Tbien = f11.t("bien");
const DUR = v.duracion;

export function dibuja(g, t) {
  const vuelve = k.suave(k.tramo(t, Tbien - 0.05, Tbien + 0.7));
  const zBase = k.claves([
    [f9.inicio, 1],
    [Tvid, 1.16],
    [f9.fin, 1.05],
    [Tacer, 1.02],
    [Tap, 0.98],
    [f11.inicio, 1],
  ]);
  const z = k.mez(zBase(t), 1.4, vuelve);
  const fy = k.mez(1100, 1080, vuelve);
  const fx = k.mez(520, 430, vuelve);
  const cam = { z, fx, fy };
  const frio = k.suave(k.tramo(t, Tap - 0.15, Tap + 0.35)) * (1 - vuelve);
  m.parque(g, cam, t, frio * 0.45);
  if (vuelve > 0.2) m.rafagas(g, t, vuelve * 0.8);

  const X = (x) => 540 + (x - cam.fx) * cam.z;
  const Y = (y) => 960 + (y - cam.fy) * cam.z;
  const S = (s) => s * cam.z;

  const muestra = k.suave(k.tramo(t, Tvid - 0.12, Tvid + 0.35));
  const quitaMarco = k.suave(k.tramo(t, f10.inicio - 0.1, f10.inicio + 0.35));
  const sesgoVideo = k.mez(0.16, 0.95, muestra);
  const sesgoRemate = k.claves([
    [f10.inicio, 0.3],
    [Tacer, 1],
    [Tap - 0.12, 1],
    [Tap + 0.15, -1],
    [f11.inicio, -1],
    [Tbien, -0.2],
    [DUR, 0.92],
  ]);
  const enRemate = k.suave(k.tramo(t, f10.inicio - 0.05, f10.inicio + 0.25));
  let sesgo = k.mez(sesgoVideo, sesgoRemate(t), enRemate);
  sesgo = k.mez(sesgo, 0.92, vuelve);

  const tw = k.mez(t, Tvid + (t - Tvid) * 0.28, muestra * (1 - enRemate));
  const angBase = m.anguloCierre(tw, sesgo, 0.92);
  const ang = k.mez(angBase, m.angulo(t - DUR, 0.92), vuelve);

  const due = k.suave(k.tramo(t, Tacer - 0.25, Tacer + 0.2)) * (1 - k.suave(k.tramo(t, Tap - 0.12, Tap + 0.2))) * (1 - vuelve);
  m.conAlfa(g, due, (c) => {
    m.personaCara(c, X(880), Y(1100), S(0.7), { t, color: "#0f8f88", claro: "#3ecfc2", sombra: "#0a5e58" });
  });
  const grande = k.suave(k.tramo(t, Tap - 0.08, Tap + 0.28)) * (1 - k.suave(k.tramo(t, f11.inicio + 0.3, f11.inicio + 0.8))) * (1 - vuelve);
  if (grande > 0.02) m.conAlfa(g, grande, (c) => m.perroFrente(c, X(230), Y(1020), S(1.12), { t }));

  const paso = k.mez(0, 0.8, k.suave(k.tramo(t, Tacer - 0.05, Tacer + 0.4))) * (1 - k.suave(k.tramo(t, Tap - 0.15, Tap + 0.05)))
    - 0.9 * k.suave(k.tramo(t, Tap - 0.05, Tap + 0.45)) * (1 - vuelve);

  const wx = k.mez(490, 400, vuelve);
  const wy = k.mez(1180, 1260, vuelve);
  const esc = k.mez(1.18, 1.12, vuelve);
  const dx = X(wx), dy = Y(wy);
  m.perroDetras(g, dx, dy, S(esc), {
    ang,
    paso: paso * (1 - vuelve),
    giro: k.mez(due * 0.4 - grande * 0.3, 0.15, vuelve),
    rastro: vuelve > 0.7 ? m.rastro(t - DUR, 0.92) : m.rastro(tw, sesgo),
    t,
  });

  const aArco = muestra * (1 - quitaMarco) + k.pulso(t, Tacer, 0.28) * 0.9 + k.pulso(t, Tap, 0.28) * 0.9;
  m.arcos(g, dx, dy, 360 * S(esc), sesgo, Math.min(1, aArco) * (1 - vuelve));
  m.marco(g, muestra * (1 - quitaMarco));

  const amigo = k.suave(k.tramo(t, f11.inicio + 0.05, f11.t("amigo") + 0.35)) * (1 - k.suave(k.tramo(t, Tbien - 0.05, Tbien + 0.45)));
  m.conAlfa(g, amigo, (c) => {
    m.personaCara(c, X(300), Y(1240), S(0.95), {
      t, sonrisa: true, pulgar: 1,
      color: "#ff6a3c", claro: "#ffb089", sombra: "#c4442a", pelo: "#2a1a12",
    });
  });

  m.velo(g, k.mez(0.66, 0.55, vuelve));
}
