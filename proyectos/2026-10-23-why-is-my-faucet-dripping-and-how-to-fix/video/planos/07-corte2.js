// «Then loosen the big nut with a wrench, and pull out the stem.» … «Put it all back»
// El grifo por dentro, como mesa de trabajo. «wrench»: la llave agarra la tuerca y la gira al revés; la tuerca sube y sale
// volando; el vástago sale (el cuerpo se apaga). Cámara al vástago: el destornillador saca el tornillo, la arandela vieja cae
// y sube otra nueva, que se atornilla; «same size» la mide. «Put it all back»: todo vuelve a su sitio a toda velocidad.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaCorte, conjuntoArandela, G } from "../corte.js";
import { rutaCam, destornillador, aPant, velo, viñeta } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio - 0.04;
const F8 = v.frase(8), F9 = v.frase(9), F10 = v.frase(10);
export const FIN = F10.t("turn") - 0.14;
const { suave: su, tramo: tr, mez } = k;
const T0 = desde(v), Tloosen = F8.t("loosen"), Tnut = F8.t("nut"), Twr = F8.t("wrench"), Tpull = F8.t("pull"), Tstem = F8.t("stem");
const Tun = F9.inicio, Told = F9.t("old"), Tw9 = F9.t("washer"), Tnew = F9.t("new"), Tsame = F9.t("same"), Tsize = F9.t("size");
const Tback = F10.inicio;

const FULL = { x: 155, y: 200, s: 0.9 }, STEM = { x: 0, y: -170, s: 1.7 };
const CAMS = [[T0, FULL], [Tpull + 0.2, FULL], [Tstem + 0.5, STEM], [Tback - 0.05, STEM], [Tback + 0.6, FULL], [FIN, FULL]];
const SV = -760;                                    // cuánto sube el vástago al sacarlo

// los instantes de cada cosa
const T_LL0 = Tloosen - 0.0, T_LL1 = Tnut - 0.05;     // la llave entra
const T_G0 = Twr - 0.45, T_G1 = Twr + 0.5;            // gira
const T_NUT_VUELA = T_G1 + 0.05;
const T_STEM0 = Tpull + 0.12, T_STEM1 = Tstem + 0.35;
const T_DESTA = Told - 0.1;                           // el destornillador desatornilla
const T_CAE = Tw9 + 0.06;                             // la vieja cae
const T_NUEVA0 = Tnew - 0.55, T_NUEVA1 = Tnew + 0.35, T_APRIETA = Tsame - 0.15;

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const uG = su(tr(t, T_G0, T_G1));
  const phi = 0.95 * uG;
  const nutThread = -66 * su(tr(t, T_G0 + 0.1, T_G1));
  const vuela = Math.pow(su(tr(t, T_NUT_VUELA, T_NUT_VUELA + 0.65)), 2);
  const vuelta = 1 - Math.pow(su(tr(t, Tback + 0.2, Tback + 0.62)), 1);
  let nutDy = (nutThread - 1500 * vuela) * (t < Tback ? 1 : vuelta);
  const nutAng = 0.6 + Math.PI * 1.3 * (t < Tback ? uG : vuelta);
  const llX = (1 - su(tr(t, T_LL0, T_LL1))) * 1000 + su(tr(t, T_G1 - 0.05, T_G1 + 0.4)) * 1000;
  const vastDy = t < Tback ? SV * su(tr(t, T_STEM0, T_STEM1)) : SV * (1 - su(tr(t, Tback + 0.02, Tback + 0.55)));
  const alCuerpo = t < Tback ? 1 - 0.9 * su(tr(t, T_STEM0 + 0.3, T_STEM1 + 0.45)) : 0.1 + 0.9 * su(tr(t, Tback, Tback + 0.4));
  const antes = t < T_DESTA;
  const entre = t >= T_DESTA && t < T_APRIETA + 0.4;
  const dEst = antes ? 1 : t < T_APRIETA + 0.4 ? 0 : 0;
  const manDy = -1500 * Math.pow(1 - su(tr(t, Tback + 0.46, Tback + 0.78)), 2);
  dibujaCorte(g, t, {
    cam, alCuerpo, vastagoDy: vastDy,
    desgaste: antes ? 1 : 0, arandelaAl: entre ? 0 : 1, apreta: t > Tback + 0.5 ? 1 : 0,
    llave: { x: llX + 0, y: -30 + nutThread, ext: Math.cos(phi), esc: 1 - 0.16 * Math.sin(phi), al: t < T_G1 + 0.6 ? 1 : 0 },
    tuerca: { dy: nutDy, ang: nutAng, resalta: k.pulso(t, Tnut + 0.1, 0.22), al: 1 },
    maneta: { dy: manDy + vastDy, giro: 0, al: t > Tback + 0.4 ? 1 : 0 },
    despues: (g2, tt) => {
      g2.save(); g2.translate(0, vastDy);
      // el destornillador, desde abajo, sobre el tornillo
      const deb = (dyHead) => 558 + dyHead;
      if (tt >= Tun && tt < T_DESTA + 0.9) {
        // la arandela vieja: baja un poco con el tornillo y cae
        const bajan = 36 * su(tr(tt, T_DESTA + 0.1, T_DESTA + 0.45));
        const tau = Math.max(0, tt - T_CAE);
        const caida = 0.5 * 3600 * tau * tau;
        if (tt >= T_DESTA && tt < T_CAE + 0.7) {
          g2.save(); g2.translate(0, bajan + caida); g2.rotate(tau * 1.1 * (tau > 0 ? 1 : 0));
          conjuntoArandela(g2, 0, 1, { tn: { dy: 0 } });
          g2.restore();
        }
        const entra = su(tr(tt, Tun + 0.05, T_DESTA + 0.1)), sale = su(tr(tt, T_CAE - 0.05, T_CAE + 0.4));
        if (entra > 0.01 && sale < 0.99) destornillador(g2, 0, deb(bajan) + (1 - entra) * 900 + sale * 900, Math.PI, 0.9, tt * 2.2);
      }
      // la nueva sube y se atornilla
      if (tt >= T_NUEVA0 && tt < T_APRIETA + 0.4) {
        const up = 1 - su(tr(tt, T_NUEVA0, T_NUEVA1));
        const tornillo = 36 * (1 - su(tr(tt, T_NUEVA1 + 0.15, T_APRIETA)));
        conjuntoArandela(g2, 760 * up * up, 0, { tn: { dy: tornillo + 0, gira: tt } });
        k.brillo(g2, 0, G.arandelaY + 20 + 760 * up * up, 380, "255,200,150", 0.35 * (1 - up));
        const e2 = su(tr(tt, T_NUEVA1 + 0.05, T_NUEVA1 + 0.3)), s2 = su(tr(tt, T_APRIETA + 0.05, T_APRIETA + 0.4));
        if (e2 > 0.01 && s2 < 0.99) destornillador(g2, 0, deb(tornillo) + (1 - e2) * 900 + s2 * 900, Math.PI, 0.9, tt * 2.2);
      }
      // «same size»: una regla de borde a borde
      const m = su(tr(tt, Tsame - 0.05, Tsame + 0.2)) * (1 - su(tr(tt, Tback - 0.25, Tback - 0.05)));
      if (m > 0.01) {
        g2.save(); g2.globalAlpha = m; g2.strokeStyle = "rgba(190,255,200,0.95)"; g2.lineWidth = 6; g2.setLineDash([16, 12]);
        for (const sx of [-1, 1]) { g2.beginPath(); g2.moveTo(sx * 90, 440); g2.lineTo(sx * 90, 640); g2.stroke(); }
        g2.setLineDash([]); g2.beginPath(); g2.moveTo(-90, 640); g2.lineTo(90, 640); g2.stroke();
        for (const sx of [-1, 1]) { g2.beginPath(); g2.moveTo(sx * 90, 640); g2.lineTo(sx * 90 - sx * 24, 626); g2.moveTo(sx * 90, 640); g2.lineTo(sx * 90 - sx * 24, 654); g2.stroke(); }
        g2.restore();
      }
      g2.restore();
    },
  });
  const ml = su(tr(t, Tsame + 0.05, Tsame + 0.3)) * (1 - su(tr(t, Tback - 0.25, Tback - 0.05)));
  if (ml > 0) k.etiqueta(g, 70, 1330, "same size", "190,255,200", ml, 60);
  const tl = su(tr(t, Tnut + 0.05, Tnut + 0.3)) * (1 - su(tr(t, Twr + 0.9, Twr + 1.1)));
  if (tl > 0) k.etiqueta(g, 70, 1420, "packing nut", "255,225,140", tl, 52);
  velo(g, 0.34); viñeta(g, 0.4);
}
