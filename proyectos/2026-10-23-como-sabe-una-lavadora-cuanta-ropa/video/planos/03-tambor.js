// El tambor en seco, la ropa que sube a un lado y la corriente del motor.
// Frases 3, 4 y 5, una sola cámara: gira, frena abajo, sube, y el motor se enciende.
import * as k from "#kit";
import { v } from "#voz";
import { fotograma, tiempoQuieto } from "../mundo.js";

export const desde = "en";
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const corte = v.frase(6).inicio - 0.04;
const ABAJO = Math.PI / 2;
const ARRIBA = -0.42;

function palaEn(t) {
  const tFreno = f3.t("seco");
  const w = 8.5;
  if (t <= tFreno) return (t - f3.inicio) * w;
  const a0 = (tFreno - f3.inicio) * w;
  const n = Math.ceil((a0 - ABAJO) / (Math.PI * 2));
  const destino = ABAJO + n * Math.PI * 2;
  const u = k.suave(k.tramo(t, tFreno, f3.fin - 0.02));
  const giro = k.mez(a0, destino, u);
  const sube = k.suave(k.tramo(t, f4.t("sube") - 0.06, f4.t("lado") + 0.22));
  return k.mez(giro, ARRIBA + n * Math.PI * 2, sube);
}

export function dibuja(g, t) {
  const tm = tiempoQuieto(t, corte);
  const pala = palaEn(tm);
  const alrededor = 1 - k.suave(k.tramo(tm, f3.t("segundos") + 0.15, f3.fin - 0.25));
  const carga = k.suave(k.tramo(tm, f5.t("mas") - 0.05, f5.t("ropa") + 0.35));
  const base = k.suave(k.tramo(tm, f5.inicio, f5.t("corriente") + 0.25));
  const mas = k.suave(k.tramo(tm, f5.t("mas", 2) - 0.05, f5.t("corriente", 2) + 0.2));
  const pico = k.pulso(tm, f5.t("corriente", 2), 0.16);
  const corriente = Math.min(1, base * 0.62 + mas * 0.38 + pico * 0.45);
  // El tambor se queda entero en cuadro. Al hablar del motor, la cámara se corre un poco hacia él.
  const pan = k.suave(k.tramo(tm, f5.inicio, f5.t("corriente") + 0.2));
  const cam = { x: k.mez(520, 640, pan), y: k.mez(1020, 1160, pan), z: k.mez(1.05, 0.98, pan) };
  fotograma(g, cam, {
    pala, alrededor, carga, agua: 0, tm, corriente, tope: 0, arco: 0, valvula: 1, golpe: 0,
  }, "corte");
  const treinta = k.suave(k.tramo(t, f3.t("treinta") - 0.08, f3.t("treinta") + 0.16))
    * (1 - k.suave(k.tramo(t, f3.t("en", 2), f3.t("seco"))));
  if (treinta > 0.02) k.pastilla(g, 540, 720, "30 s", "", "255,210,90", treinta, 108);
}
