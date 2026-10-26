// El test cerrado, el cuento, los estudios y las dos músicas casi iguales.
import * as k from "#kit";
import { v } from "#voz";
import { libroCerrado, tarjeta, cuento, estanteria, multitud, barra, ochoGrande, nota, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(12).t("no") - 0.04;
export const entrada = "corte";

const f12 = v.frase(12);
const f13 = v.frase(13);
const f14 = v.frase(14);
const f15 = v.frase(15);
const f16 = v.frase(16);
const Tesp = f12.t("espacio");
const Tcue = f13.t("cuento");
const Tsal = f13.t("salto");
const Tcua = f14.t("cuarenta");
const Tmil = f14.t("mil");
const Tape = f15.t("apenas");
const Tmus = f15.t("musica");
const Tocho = f16.t("ocho");

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#1a1030");
  bg.addColorStop(0.4, "#2a1840");
  bg.addColorStop(1, "#120c10");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  const lampara = g.createRadialGradient(540, 780, 30, 540, 1000, 760);
  lampara.addColorStop(0, "rgba(255,196,120,0.28)");
  lampara.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lampara;
  g.fillRect(0, 0, 1080, 1600);

  const sube = k.suave(k.tramo(t, Tcua - 0.1, Tcua + 1.1));
  const yDesk = k.mez(0, 520, sube);
  estanteria(g, k.suave(k.tramo(t, Tcua - 0.05, Tcua + 0.7)), 3);
  multitud(g, k.suave(k.tramo(t, Tmil - 0.1, Tmil + 0.55)) * (1 - k.suave(k.tramo(t, Tmil + 0.7, Tape - 0.15))), 30);

  g.save();
  g.translate(0, yDesk);

  const alLibro = 1 - k.suave(k.tramo(t, Tcue - 0.15, Tcue + 0.35));
  if (alLibro > 0.02) {
    g.save();
    g.globalAlpha = alLibro;
    libroCerrado(g, 540, 1040, 1.75);
    const fan = k.entra(k.tramo(t, Tesp - 0.08, Tesp + 0.5));
    if (fan > 0.02) {
      tarjeta(g, k.mez(540, 250, fan), k.mez(1080, 1280, fan), 1.15, "folio", k.mez(0, -0.18, fan));
      tarjeta(g, 540, k.mez(1100, 1360, fan), 1.05, "patron", 0);
      tarjeta(g, k.mez(540, 820, fan), k.mez(1080, 1280, fan), 1.15, "matriz", k.mez(0, 0.18, fan));
    }
    g.restore();
  }

  const abre = k.suave(k.tramo(t, Tcue - 0.05, Tcue + 0.7));
  const alCuento = abre * (1 - k.suave(k.tramo(t, Tcua - 0.05, Tcua + 0.45)));
  if (alCuento > 0.02) {
    g.save();
    g.globalAlpha = alCuento;
    cuento(g, 540, 1100, 1.45, abre);
    const salto = k.pulso(t, Tsal + 0.12, 0.18);
    if (salto > 0.02) {
      g.save();
      g.globalAlpha = salto;
      nota(g, 540, 860 - salto * 40, 1.6, true);
      g.restore();
    }
    g.restore();
  }
  g.restore();

  const alBarras = k.suave(k.tramo(t, Tape - 0.2, Tape + 0.35));
  const base = 1360;
  const hOtra = 460;
  const hMoz = 508;
  barra(g, 340, base, hOtra, "#e25b4a", alBarras);
  barra(g, 700, base, k.mez(90, hMoz, alBarras), "#ffd56a", alBarras);
  if (alBarras > 0.05) {
    nota(g, 700, base - hMoz - 50, 1.35, true);
    nota(g, 340, base - hOtra - 40, 1.2, false);
  }

  const rompe = k.suave(k.tramo(t, Tocho - 0.05, Tocho + 0.5));
  const alOcho = k.suave(k.tramo(t, Tocho - 0.15, Tocho + 0.12)) * (1 - rompe);
  ochoGrande(g, 540, k.mez(900, 1280, rompe), alOcho, 300);

  velo(g, 0.68);
}
