// «puede señalar un veneno. Crear la enfermedad, no.»
// Otra vez la pantalla: las moléculas rojas se quedan dentro. Fuera, la calle sigue igual.
// Al final la cámara vuelve a entrar en el germen, que es por donde empezó el vídeo.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, vineta, vista, sinVista, pantalla, cristal, molecula, germen, calle, vial } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio - 0.04;

const f9 = v.frase(9), f10 = v.frase(10);
const T0 = f9.inicio, Tven = f9.t("veneno"), Tenf = f9.t("enfermedad"), Tno = f9.t("no");
const Tenv = f10.inicio, Tami = f10.t("amigo"), Tsola = f10.t("sola");
const Fin = v.duracion;

const SX = 170, SY = 560, SW = 740, SH = 620;
const az = k.azar(88);
const GOTAS = Array.from({ length: 28 }, () => ({
  x: 36 + az() * (SW - 72),
  y: 36 + az() * (SH - 80),
  r: 14 + az() * 16,
  fase: az() * 6,
}));

const { suave: su, tramo: tr, mez } = k;

export function dibuja(g, t) {
  fondo(g, "90,30,70");
  // del cuarto a la calle, y al final otra vez dentro del germen
  const lejos = su(tr(t, Tenv, Tami + 0.15));
  const entra = su(tr(t, Tami + 0.35, Fin - 0.4));
  const Z = mez(mez(1.22, 0.96, lejos), 2.95, entra);
  const cy = mez(mez(1080, 1160, lejos), 900, entra);
  vista(g, Z, 540, cy);

  // la pared y la ventana
  g.fillStyle = "#140c18";
  g.fillRect(0, 0, 1080, 1920);
  const alCalle = su(tr(t, T0 + 0.2, Tven));
  calle(g, 640, 860, 380, 700, t);

  pantalla(g, SX, SY, SW, SH, 1 - entra);
  g.save();
  g.beginPath();
  g.rect(SX, SY, SW, SH);
  g.clip();
  g.fillStyle = "#07010e";
  g.fillRect(SX, SY, SW, SH);
  const intenta = k.pulso(t, Tenf + 0.05, 0.16);
  const alG = 0.55 + 0.45 * entra;
  const rG = mez(80, 340, entra) + intenta * 80 * (1 - entra);
  germen(g, SX + (entra > 0.01 ? mez(110, SW / 2, entra) : 110), SY + (entra > 0.01 ? mez(110, SH / 2, entra) : 110), rG, t * 0.4, alG, 1);
  const pulso = 1 + 0.22 * k.pulso(t, Tven, 0.16);
  const empuje = su(tr(t, Tven - 0.1, Tven + 0.15)) * (1 - su(tr(t, Tven + 0.15, Tven + 0.45)));
  for (const d of GOTAS) {
    const flota = Math.sin(t * 2.2 + d.fase) * 14;
    const salto = empuje * (24 + (d.fase % 3) * 18);
    molecula(g, SX + d.x, SY + d.y + flota - salto, d.r * pulso * (1 - entra), "roja", 1 - entra * 0.85);
  }
  g.restore();
  cristal(g, SX, SY, SW, SH, 0.4);

  // el vial sigue vacío, y se va cuando volvemos al germen
  vial(g, 230, 1320, 180, (1 - lejos) * (1 - entra) * su(tr(t, T0, T0 + 0.3)), 0);

  // un fogonazo suave en «no», el germen no sale
  const no = k.pulso(t, Tno, 0.09);
  if (no > 0.04 && entra < 0.2) k.brillo(g, SX + SW / 2, SY + SH / 2, 500, "violeta", no * 0.5);

  sinVista(g);
  vineta(g, 0.5 * (1 - entra * 0.4));
  velo(g, mez(0.8, 0.62, entra));
}
