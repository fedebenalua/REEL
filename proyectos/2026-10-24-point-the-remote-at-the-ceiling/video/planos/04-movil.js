// «Now one bounce is enough.» El mismo salón. Un rebote, y el móvil se queda con la tele.
import * as k from "#kit";
import { v } from "#voz";
import { APERTURA, MANDO, TECHO, camDe, canalEn, escenaRebote } from "../mundo.js";

const f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12), f13 = v.frase(13), f14 = v.frase(14);

const cam = camDe(
  [[f10.t("now"), 1.55], [f10.t("bounce"), 1.9], [f10.t("enough"), 1.65], [f11.inicio, 1.2], [f11.t("phone"), 1.45], [f12.t("wifi"), 1.02], [f13.t("app"), 2.2], [f13.finDe("bio") + 0.35, 2.2], [f14.t("lines"), 1.3], [f14.t("dart"), APERTURA.z], [f14.fin + 0.45, APERTURA.z]],
  [[f10.t("now"), TECHO.x], [f10.t("bounce"), TECHO.x], [f10.t("enough"), 560], [f11.inicio, 720], [f11.t("phone"), 860], [f12.t("wifi"), 720], [f13.t("app"), 860], [f13.finDe("bio") + 0.35, 860], [f14.t("lines"), 880], [f14.t("dart"), APERTURA.cx], [f14.fin + 0.45, APERTURA.cx]],
  [[f10.t("now"), 400], [f10.t("bounce"), 230], [f10.t("enough"), 940], [f11.inicio, 1120], [f11.t("phone"), 1280], [f12.t("wifi"), 1000], [f13.t("app"), 1320], [f13.finDe("bio") + 0.35, 1320], [f14.t("lines"), 1240], [f14.t("dart"), APERTURA.cy], [f14.fin + 0.45, APERTURA.cy]],
);

const saltos = [
  { t: f10.t("enough"), de: 12, a: 3 },
  { t: f12.t("wifi"), de: 3, a: 8 },
];

export const desde = "now";
export const entrada = "corte";

export function dibuja(g, t) {
  const rebote = k.suave(k.tramo(t, f10.inicio, f10.t("bounce"))) * (1 - k.suave(k.tramo(t, f10.t("enough") + 0.15, f11.t("phone") - 0.05)));
  const sube = k.entra(k.tramo(t, f11.inicio - 0.02, f11.t("phone") + 0.08));
  const seVa = k.sale(k.tramo(t, f14.t("lines") - 0.15, f14.t("remote")));
  const dardo = k.entra(k.tramo(t, f14.t("lines") - 0.05, f14.t("dart")));
  const haz = Math.max(rebote * (1 - sube), dardo);
  const movil = sube * (1 - seVa);
  const mx = k.mez(MANDO.x, 1180, sube * (1 - dardo)) ;
  const my = k.mez(MANDO.y, 1500, sube * (1 - dardo));
  const dx = k.mez(1180, MANDO.x, dardo);
  const dy = k.mez(1600, MANDO.y, dardo);
  const ang = k.mez(0.9, MANDO.ang, dardo);
  escenaRebote(g, t, cam(t), {
    tm: t,
    haz,
    ojo: (rebote > 0.05 ? 0.4 + 0.6 * k.pulso(t, f10.t("enough"), 0.16) : 0) * (1 - sube) + (t > f12.t("wifi") - 0.1 ? 0 : 0),
    canal: canalEn(t, saltos, 12),
    mando: Math.max(1 - sube, dardo),
    mx: dardo > 0.02 ? dx : mx,
    my: dardo > 0.02 ? dy : my,
    mang: dardo > 0.02 ? ang : MANDO.ang,
    movil,
    fx: 860,
    fy: k.mez(1680, 1320, sube),
    wifi: sube * (1 - dardo),
    ondas: k.suave(k.tramo(t, f12.t("talks"), f12.t("wifi") + 0.2)) * (1 - k.suave(k.tramo(t, f13.t("app"), f13.t("link")))),
    pulsa: k.pulso(t, f13.t("app"), 0.12),
    golpesTecho: [f10.t("bounce"), f14.t("dart")],
    golpesOjo: [f10.t("enough")],
    velo: 0.8,
  });
}
