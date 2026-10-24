// Nadie midió el diez por ciento: era talento, y acabó en mito.
// El sello se rompe y queda el cerebro en marcha.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, fondo, libro, motas, persona, velo } from "../mundo.js";

export const desde = "nunca";

export function dibuja(g, t) {
  const f14 = v.frase(14), f15 = v.frase(15), f16 = v.frase(16);
  const Tmid = f14.t("midio");
  const Ttal = f14.t("talento");
  const Tmito = f14.t("mito");
  const Tsobra = f15.t("sobra");
  const Tamigo = f16.t("amigo");
  const Tcabeza = f16.t("cabeza");
  const fin = v.duracion;
  const calma = 1 - k.suave(k.tramo(t, fin - 0.45, fin - 0.12));

  const abre = k.suave(k.tramo(t, f14.inicio, Tmid + 0.2));
  const talento = k.suave(k.tramo(t, Ttal - 0.25, Ttal + 0.15));
  const sello = k.suave(k.tramo(t, Tmito - 0.35, Tmito + 0.15));
  const rompe = k.suave(k.tramo(t, Tmito + 0.05, Tmito + 0.55));
  const cerebroOn = k.suave(k.tramo(t, Tsobra - 0.15, Tsobra + 0.45));
  const lejos = k.suave(k.tramo(t, Tamigo - 0.1, Tamigo + 0.55));
  const aLaCabeza = k.suave(k.tramo(t, Tcabeza - 0.1, Tcabeza + 0.55));

  const sube = k.entra(k.tramo(t, f14.inicio, Tmid + 0.15));
  fondo(g, "#140c1c", "#0c1018");
  motas(g, t, 0.2 * (1 - cerebroOn) * calma);

  const libroAl = (1 - cerebroOn) * abre;
  if (libroAl > 0.02) {
    g.save();
    g.translate(0, k.mez(520, 0, sube));
    g.globalAlpha = libroAl;
    libro(g, 540, 820, abre);
    g.fillStyle = "#3a2414";
    g.font = "800 92px Figtree";
    g.textAlign = "center";
    g.globalAlpha = libroAl * talento * (1 - sello * 0.85);
    g.fillText("TALENTO", 540, 1040);
    g.restore();
  }

  // el sello del 10 %
  if (sello > 0.02 && cerebroOn < 0.92) {
    const cae = k.sale(rompe);
    g.save();
    g.translate(540, k.mez(280, 1040, k.suave(k.tramo(t, Tmito - 0.55, Tmito + 0.2))));
    g.rotate(rompe * 0.4);
    g.globalAlpha = (1 - cerebroOn) * Math.min(1, sello * 1.2);
    const escala = k.mez(1.6, 1, k.suave(k.tramo(sello, 0.15, 1)));
    g.scale(escala * 2.1, escala * 2.1);
    // dos mitades al romperse
    const sep = rompe * 70;
    mitad(g, -sep, -rompe * 10, -0.15 * rompe, "10");
    mitad(g, sep, rompe * 16, 0.2 * rompe, "%");
    g.restore();
  }

  const zoomCabeza = k.mez(1, 1.45, aLaCabeza);
  const muestraPersona = k.mez(lejos, 0.35, aLaCabeza);
  g.save();
  g.translate(540, 980);
  g.scale(k.mez(1, zoomCabeza, cerebroOn), k.mez(1, zoomCabeza, cerebroOn));
  g.translate(-540, -980);
  if (muestraPersona > 0.05 && cerebroOn > 0.4) {
    g.save();
    g.globalAlpha = muestraPersona;
    persona(g, 540, 860, 820, { t, brazo: 0.3, boca: 0.08 });
    g.restore();
  }
  const s = k.mez(1.7, k.mez(0.55, 1.35, aLaCabeza), lejos) * cerebroOn;
  const cy = k.mez(980, k.mez(820, 760, aLaCabeza), lejos);
  const cx = 520;
  if (cerebroOn > 0.02) {
    cerebro(g, cx, cy, Math.max(0.2, s), {
      t, vivo: 1, redes: calma, nucleo: 0,
    });
  }
  g.restore();

  // el sello roto en el suelo, al final, quieto
  if (lejos > 0.4 && aLaCabeza < 0.7) {
    g.save();
    g.globalAlpha = lejos * (1 - aLaCabeza) * 0.9;
    g.translate(700, 1560);
    g.rotate(0.4);
    g.fillStyle = "#8a3030";
    g.font = "800 54px Figtree";
    g.fillText("10%", 0, 0);
    g.restore();
  }
  velo(g, 0.8);
}

function mitad(g, x, y, rot, texto) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.fillStyle = "#8d1d2a";
  k.redondo(g, -70, -50, 140, 100, 16);
  g.fill();
  g.fillStyle = "#ffe1a8";
  g.font = "800 64px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(texto, 0, 4);
  g.restore();
}
