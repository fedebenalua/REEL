// Otra apertura: desde el primer fotograma ya se están yendo los trozos y la persona anda debajo.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, fondo, motas, persona, velo } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  const f2 = v.frase(2);
  const Tquita = f2.t("quitartelo");
  const separa = k.mez(0.45, 1, k.suave(k.tramo(t, 0, Tquita + 0.4)));
  fondo(g, "#140818", "#07060f");
  motas(g, t, 0.4);
  persona(g, 540, 1000, 880, { t, anda: 0.8, boca: 0.5, brazo: 0.2 });
  cerebro(g, 540, 820, 1.7, { t, separa, vivo: 0.08, nucleo: 1 });
  velo(g, 0.8);
}
