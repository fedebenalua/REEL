// «This remote could copy every other remote in the house.»
// «It came from the man who designed the Apple II.»
// «And almost nobody bought it.»
// Fotograma 0: el mando crema llena la pantalla y la ráfaga violeta ya le entra.
// Luego se abre el plano, sube el ordenador y, en «nobody», los otros se van.
import * as k from "#kit";
import { v } from "#voz";
import { mando, ojo, rafaga, apple, velo } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tcopy = f1.t("copy"), Tevery = f1.t("every"), Tapple = f2.t("apple"), Tnobody = f3.t("nobody");
const Tcorte = v.frase(4).inicio;

export function dibuja(g, t) {
  g.fillStyle = "#100c09"; g.fillRect(0, 0, 1080, 1920);
  const fondo = g.createRadialGradient(540, 980, 40, 540, 1100, 1200);
  fondo.addColorStop(0, "#4a2c16"); fondo.addColorStop(0.4, "#1a1218"); fondo.addColorStop(1, "#0a080c");
  g.fillStyle = fondo; g.fillRect(0, 0, 1080, 1920);

  const abre = k.suave(k.tramo(t, 0.2, Tevery + 0.45));
  const sube = k.suave(k.tramo(t, Tapple - 0.5, Tapple + 0.45));
  const solos = k.suave(k.tramo(t, Tnobody, Tnobody + 0.6));
  const lampara = 1 - solos;
  k.brillo(g, 160, 430, 780, "255,186,100", 0.45 * lampara);

  const apagado = 1 - k.suave(k.tramo(t, Tnobody + 0.05, Tnobody + 0.65));
  apple(g, 540, k.mez(280, 760, sube * (1 - solos * 0.3)), 980, t, sube * apagado);

  const hCore = k.mez(1040, 820, Math.max(abre, sube)) ;
  const yCore = k.mez(1180, 1320, sube * (1 - solos));
  const aprende = k.suave(k.tramo(t, 0.15, Tevery + 0.9));
  const lcd = k.suave(k.tramo(t, Tcopy - 0.1, f1.t("house")));
  const pulso = 0.45 + 0.55 * Math.sin(t * 16) ** 2;
  const ojoAl = pulso * (1 - k.suave(k.tramo(t, Tapple - 0.1, Tapple + 0.35)));

  const xTv = k.mez(-40, 210, abre) - solos * 700;
  const xVcr = k.mez(1120, 880, abre) + solos * 700;
  const yBar = k.mez(1680, 1520, abre) + solos * 400;
  const otros = 1 - solos;
  mando(g, xTv, k.mez(1040, 1000, abre), 640, "tv", { ang: -0.22, al: otros, ojo: ojoAl, aprende: 0.15 });
  mando(g, xVcr, k.mez(1160, 1120, abre), 580, "vcr", { ang: 0.2, al: otros, ojo: ojoAl * 0.85 });
  mando(g, k.mez(700, 640, abre), yBar, 460, "barato", { ang: 0.12, al: otros * 0.95, ojo: ojoAl * 0.7 });
  mando(g, 540, yCore, hCore, "core", { aprende, lcd: Math.max(lcd, sube), ojo: ojoAl * (0.4 + 0.6 * otros) });

  const [ox, oy] = ojo(540, yCore, hCore);
  const fin = Tapple + 0.05;
  const e1 = ojo(xTv, k.mez(1040, 1000, abre), 640);
  const e2 = ojo(xVcr, k.mez(1160, 1120, abre), 580);
  rafaga(g, e1[0], e1[1], ox, oy, t, 0, fin, otros);
  rafaga(g, e2[0], e2[1], ox, oy + 16, t, 0.05, fin, otros);
  k.brillo(g, ox, oy, 420, "violeta", ojoAl * 0.85);
  velo(g, 0.42 + 0.28 * sube);
}
