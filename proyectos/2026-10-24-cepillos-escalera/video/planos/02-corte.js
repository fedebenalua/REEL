// Otro sitio: el canto donde el escalón se junta con el lateral.
// El escalón baja y el lateral no. La rendija no admite dos monedas. El zapato se lo lleva.
// Luego sale el cepillo, aparta el pie, un cordón y el bajo del pantalón.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaCorte, camara, faseHasta, GAP1 } from "../mundo.js";

export const desde = "escalon";

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const Tquieto = f4.t("quieto");
const Tmili = f5.t("milimetros"), Tmon = f5.t("monedas"), Totra = f5.t("otra");
const Tpunta = f6.t("punta"), Tlleva = f6.t("lleva");
const Tsale = f7.t("sale"), Tencima = f7.t("encima");
const Trozan = f8.t("rozan"), Tcentro = f8.t("centro");
const Tcor = f9.t("cordon"), Tpan = f9.t("pantalon");
const Tlimp = f10.t("limpian"), Tmueve = f10.t("mueve");
const VEL = 240;
const ancla = 900 - VEL * Tpunta;

const cam = camara([
  [f4.inicio - 0.2, 0.92, 40, 880],
  [Tquieto, 1.15, -80, 860],
  [f5.inicio, 1.35, -60, 900],
  [Tmili, 1.9, -160, 980],
  [Tmon, 1.35, -30, 1040],
  [Totra, 1.45, -40, 1060],
  [f6.inicio, 1.2, 180, 900],
  [Tpunta, 1.45, 40, 900],
  [Tlleva, 1.65, -40, 720],
  [f7.inicio, 1.15, -60, 860],
  [Tencima, 1.25, -20, 900],
  [Trozan, 1.35, 60, 940],
  [Tcentro, 1.12, 220, 980],
  [Tcor, 1.28, 80, 1000],
  [Tpan, 1.18, 140, 1020],
  [Tlimp, 0.78, 60, 900],
  [Tmueve, 0.86, 20, 880],
  [f10.fin, 0.86, 20, 880],
]);

export function dibuja(g, t) {
  const fase = faseHasta(t, VEL, Tmueve - 0.15, Tmueve + 0.35);
  const yPaso = ancla + fase;
  const c = cam(t);
  if (t >= f6.inicio && t <= f7.inicio) {
    const sigue = k.suave(k.tramo(t, f6.inicio, Tpunta));
    const suelta = k.suave(k.tramo(t, Tlleva + 0.25, f7.inicio));
    c.y = k.mez(yPaso, c.y, k.mez(1 - sigue, 1, suelta));
  }

  const monedas = k.entra(k.tramo(t, Tmon - 0.25, Tmon + 0.35)) * (1 - k.suave(k.tramo(t, f6.inicio, Tpunta)));
  const nMon = t < f5.t("sobre") ? 1 : 2;
  const empujeMon = k.suave(k.tramo(t, Totra - 0.15, Totra + 0.45));
  const mx = k.mez(420, 80, empujeMon);
  const my = 1080;

  const enPinza = k.suave(k.tramo(t, f6.inicio, f6.fin));
  const zapPinza = t < f7.inicio - 0.05 ? enPinza * (1 - k.suave(k.tramo(t, Tlleva + 0.15, f6.fin))) : 0;
  const xPinza = k.de(t, Tpunta - 0.2, Tlleva, 420, GAP1 + 20);
  const rojo = k.pulso(t, Tlleva, 0.28) * k.suave(k.tramo(t, Tpunta, Tlleva));

  const largo = k.de(t, Tsale - 0.05, Tencima, 0, 280);
  const llegaSeg = k.suave(k.tramo(t, f8.inicio, Trozan));
  const alCentro = k.suave(k.tramo(t, Trozan, Tcentro + 0.15));
  const xSeg = k.mez(200, 540, alCentro);
  const zapSeg = t >= f8.inicio && t < f10.inicio ? llegaSeg : t >= f10.inicio ? 1 : 0;
  const bend = t < f8.inicio ? 0.15 : k.mez(0.15, 1, k.pulso(t, Trozan, 0.35) + alCentro * 0.2);

  const alCor = k.entra(k.tramo(t, Tcor - 0.15, Tcor + 0.25));
  const alPan = k.entra(k.tramo(t, Tpan - 0.15, Tpan + 0.3));
  const seVan = 1 - k.suave(k.tramo(t, Tlimp, Tlimp + 0.6));
  const curvaCor = k.de(t, Tcor, Tcor + 0.45, 10, -80);
  const xCor = k.de(t, Tcor, Tcor + 0.5, GAP1 + 30, 360);
  const xPan = k.de(t, Tpan, Tpan + 0.55, GAP1 + 80, 520);

  const polvoSuelo = k.entra(k.tramo(t, Tlimp - 0.1, Tlimp + 0.35));
  const zapX = t < f8.inicio ? xPinza : xSeg;
  const zapY = t < f8.inicio ? yPaso : 980;
  const zapAl = t < f8.inicio ? zapPinza : zapSeg;

  dibujaCorte(g, t, c, {
    fase,
    rojo: t < f7.inicio ? rojo : 0,
    largo: t < Tsale - 0.2 ? 0 : largo,
    yZap: t >= f8.inicio ? zapY : null,
    bend: t >= Trozan - 0.2 ? bend : 0.1,
    monedas,
    nMon,
    mx,
    my: my - (nMon === 2 ? 0 : 0),
    mr: 116,
    zapato: zapAl,
    zx: zapX,
    zy: zapY,
    zL: 360,
    zang: t < f8.inicio ? k.de(t, Tpunta, Tlleva, 0, -0.35) : 0,
    aplasto: t < f8.inicio ? k.suave(k.tramo(t, Tlleva - 0.1, Tlleva + 0.15)) * 0.6 : 0,
    cordon: alCor * seVan,
    cx: xCor,
    cy: 1120,
    cLargo: 200,
    cCurva: curvaCor,
    bajo: alPan * seVan,
    bx: xPan,
    by: 1080,
    polvoSuelo,
    velo: 0.58,
  });
}
