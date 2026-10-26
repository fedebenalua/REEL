// La pera mete el agua en el agujero y se oye en la bandeja. Luego, otra vez al año.
import * as k from "#kit";
import { v } from "#voz";
import { agujero, bandeja, cajaFria, camara, pera, quieto, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "turkey";
const fin = v.t("repair") - 0.04;
const f10 = v.frase(10), f11 = v.frase(11);

export function dibuja(g, t) {
  const tq = quieto(t, fin);
  const aprieta = k.suave(k.tramo(tq, f10.t("shoots") - 0.05, f10.t("shoots") + 0.28));
  const baja = k.suave(k.tramo(tq, f10.t("in"), f10.t("splash")));
  const splash = k.tramo(tq, f10.t("splash"), f10.t("splash") + 0.7);
  const otra = k.suave(k.tramo(tq, f11.t("flush"), f11.t("twice") + 0.22));
  const splash2 = k.tramo(tq, f11.t("once"), f11.t("year") - 0.05);
  const cam = rutaCam(tq, [
    [f10.t("turkey"), { x: 30, y: -80, s: 1.55 }],
    [f10.t("shoots"), { x: 10, y: 40, s: 1.7 }],
    [f10.t("splash"), { x: 0, y: 660, s: 1.55 }],
    [f11.t("flush"), { x: 0, y: 650, s: 1.5 }],
    [fin - 0.22, { x: 0, y: 660, s: 1.48 }],
  ]);
  camara(g, cam);
  cajaFria(g);
  agujero(g, 0, 200, 1.2, 0);
  pera(g, k.mez(240, 20, k.suave(k.tramo(tq, f10.t("turkey"), f10.t("shoots")))), k.mez(-260, -120, k.tramo(tq, f10.inicio, f10.t("shoots"))), 2.35, 1.05, Math.max(aprieta, otra * 0.9));
  if (aprieta > 0.15 || otra > 0.2) {
    g.strokeStyle = "rgba(214, 244, 255, 0.9)";
    g.lineWidth = 16;
    g.beginPath();
    g.moveTo(70, 40);
    g.lineTo(8, 180);
    g.stroke();
  }
  if (baja > 0.2) {
    g.strokeStyle = "rgba(150, 220, 250, 0.85)";
    g.lineWidth = 28;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(0, 230);
    g.lineTo(0, 230 + baja * 380);
    g.stroke();
  }
  bandeja(g, 0, 700, 0.45 + splash * 0.4 + splash2 * 0.3, Math.max(splash < 1 ? splash : 0, splash2 < 1 ? splash2 : 0));
  velo(g, 0.7);
  viñeta(g, 0.4);
}
