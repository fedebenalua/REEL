// Los momentos de la voz que mueven la casa, y cuánto de "arreglado" está cada truco en cada segundo.
import * as k from "#kit";
import { v } from "#voz";

const { tramo: tr, suave: su } = k;
const F = (n) => v.frase(n);

export const T = {
  f: [null, ...Array.from({ length: 9 }, (_, i) => F(i + 1))],
  factura: F(1).t("factura"), dias: F(2).t("dias"),
  cambia: F(3).t("cambia"), led: F(3).t("led"), ochenta: F(3).t("ochenta"),
  grado: F(4).t("grado"), siete: F(4).t("siete"),
  ducha: F(5).t("ducha"), cuatro: F(5).t("cuatro"), menos: F(5).t("menos"), bano: F(5).t("bano"),
  treinta: F(6).t("treinta"), calentar: F(6).t("calentar"), mas: F(6).t("mas"),
  puerta: F(7).t("puerta"), rato: F(7).t("rato"), siete5: F(7).t("siete"), gasta5: F(7).t("gasta"),
  tirar: F(8).t("tirar"), usas: F(8).t("usas"), enviaselo: F(9).t("enviaselo"), factura9: F(9).t("factura"),
};

// 0 = como estaba (gastando), 1 = arreglado.
export const FIJO = {
  luz: (t) => su(tr(t, T.cambia + 0.1, T.led + 0.3)),
  calor: (t) => su(tr(t, T.grado, T.grado + 1.1)),
  ducha: (t) => su(tr(t, T.bano + 0.7, T.bano + 1.7)),
  lavadora: (t) => su(tr(t, T.treinta - 0.1, T.treinta + 1.0)),
  nevera: (t) => su(tr(t, T.siete5, T.siete5 + 0.5)),
};

// Cuánto gasta la casa entera (1 = todo al rojo, 0,1 = todo arreglado): manda en el contador y en el aura.
const PESO = { luz: 0.22, calor: 0.18, ducha: 0.18, lavadora: 0.16, nevera: 0.16 };
export const W = (t) => 0.1 + Object.keys(PESO).reduce((s, n) => s + PESO[n] * (1 - FIJO[n](t)), 0);

// La fase del disco del contador: la integral de su velocidad (así cambia de velocidad sin saltos).
const PASO = 1 / 60, FASE = new Float32Array(Math.ceil(50 / PASO) + 2);
for (let i = 1; i < FASE.length; i++) FASE[i] = FASE[i - 1] + (0.35 + 2.8 * W(i * PASO)) * PASO;
export const fase = (t) => { const x = Math.max(0, t) / PASO, i = Math.min(FASE.length - 2, Math.floor(x)); return FASE[i] + (FASE[i + 1] - FASE[i]) * (x - i); };
