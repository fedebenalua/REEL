// «¿Por qué tu perro te trae el juguete y no te lo suelta? No te lo regala. Te está llamando a jugar.»
// Fotograma 0: ya corre, enorme, con la pelota en la boca. La mano entra, falla, y él la deja delante mirando arriba.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2);
const Tjug = f1.t("juguete"), Tsuelta = f1.t("suelta"), Trega = f2.t("regala"), Tjugar = f2.t("jugar");

export function dibuja(g, t) {
  const x = k.claves([
    [0, 360], [0.45, 430], [Tjug, 470], [Tsuelta - 0.02, 520],
    [Tsuelta + 0.42, 455], [f2.inicio, 430], [Trega, 418], [f2.fin, 416],
  ])(t);
  const marcha = k.claves([
    [0, 1], [Tsuelta - 0.08, 1], [Tsuelta + 0.38, 0.45], [f2.inicio, 0.15], [Trega, 0], [f2.fin, 0],
  ])(t);
  const fase = Math.min(t, Trega) * 3.5;
  const Z = k.claves([
    [0, 7.15], [0.35, 6.7], [Tjug, 7.5], [Tsuelta, 6.6], [f2.inicio, 6.2], [Tjugar, 7.3], [f2.fin - 0.12, 7.15],
  ])(t);
  // El hocico queda unos 60 cm por delante del cuerpo: la cámara se queda ahí, con la pelota dentro.
  const cx = x + k.claves([[0, 22], [Tjug, 30], [Tsuelta, 18], [Tjugar, 28], [f2.fin, 26]])(t);
  const cy = k.claves([
    [0, -48], [Tjug, -44], [Tsuelta, -42], [f2.inicio, -50], [Tjugar, -58], [f2.fin, -56],
  ])(t);
  const c = { Z, cx, cy };
  m.salon(g, c, t, 0);
  m.ponVista(g, c);
  const frena = k.suave(k.tramo(t, Tsuelta - 0.08, Tsuelta + 0.28));
  const per = m.perro(g, {
    x, fase, marcha, t, pitch: 0.22 * frena * (1 - k.suave(k.tramo(t, f2.inicio, Trega))),
    cola: k.mez(0.95, 0.7, k.suave(k.tramo(t, f2.inicio, Tjugar))),
    cabeza: {
      ang: k.claves([[0, 0.12], [Tsuelta, 0.22], [f2.inicio, 0.05], [Tjugar, -0.42], [f2.fin, -0.4]])(t),
      abre: marcha > 0.4 ? 0.35 : 0.08,
      ojo: t > Tjugar - 0.2 ? 1 : 0,
      oreja: 0.15,
    },
  });
  if (marcha > 0.25) m.polvoCorre(g, t, x - 20, 1, 0);
  const boca = m.enBoca(per.nariz, 1, 4);
  const deja = k.suave(k.tramo(t, Trega - 0.05, Tjugar - 0.2));
  const sueloX = x + 58, sueloY = -13.4;
  const hop = Math.sin(deja * Math.PI) * 28;
  const bx = k.mez(boca[0], sueloX, deja), by = k.mez(boca[1], sueloY, k.sale(deja)) - hop;
  if (deja > 0.08) m.sombra(g, sueloX, 14 * k.mez(0.3, 1, deja), 0.22 * deja);
  m.pelota(g, bx, by, 1.15, Math.sin(Math.min(t, Tjugar) * 6) * 0.25 * (1 - deja));
  const entra = k.suave(k.tramo(t, f1.t("no") - 0.2, Tsuelta - 0.08));
  const falla = k.suave(k.tramo(t, Tsuelta - 0.02, Tsuelta + 0.32));
  const seVa = k.suave(k.tramo(t, f2.inicio - 0.05, f2.inicio + 0.35));
  if (seVa < 0.98) {
    const mx = k.mez(x + 120, x + 62, entra) + falla * 26 + seVa * 40;
    const my = k.mez(-78, -24, entra) + falla * 16 - seVa * 10;
    m.mano(g, mx, my, -0.55 + falla * 0.4, 1.55, k.mez(0.85, 0.25, entra) + falla * 0.4);
  }
  m.cierra(g, 0.52);
}
