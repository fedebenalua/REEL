// Lo que comparten los planos de este vídeo: el edificio de doce pisos con su hueco de ascensor, dónde está la cabina en
// cada segundo, la cámara (que sigue a la cabina y se mete en la rueda y en el imán) y los instantes de los pulsos.
// Todo sale de `t`: nada se guarda de un fotograma al siguiente.
import * as k from "#kit";
import { v } from "#voz";

export const { suave, tramo, mez, curva } = k;
export const lim = (x, a, b) => Math.max(a, Math.min(b, x));

// ---------------------------------------------------------------- el edificio (unidades: píxeles del mundo, y hacia arriba es negativo)
export const FL = 640, NPISOS = 12;                  // alto de un piso y número de pisos
export const floorY = (n) => -(n - 1) * FL;           // el suelo del piso n
export const SHAFT = { x0: 200, x1: 880 };            // el hueco
export const CAR = { x0: 340, x1: 740, h: 520, cx: 540 };
export const RAIL_L = 240, RAIL_R = 840;              // los dos raíles
export const WHEEL = { x: 293, r: 38, dy: 90 };       // la rueda, pegada al raíl de la izquierda, 90 por debajo del techo
export const MAG = { x: 822, h: 100, dy: 160 };       // el imán de cada piso, en el raíl de la derecha, 160 sobre el suelo
export const PULSOS_PISO = 27;                        // pulsos de un piso (de dibujo: no es de un ascensor concreto)
export const PITCH = FL / PULSOS_PISO;
export const pulsosDe = (f) => Math.round(PULSOS_PISO * (f - 1));

// ---------------------------------------------------------------- los segundos de la voz
const f = (n) => v.frase(n);
export const T = {
  ojos: f(2).t("ojos"), ve: f(2).t("ve"), cuenta2: f(2).t("cuenta"),
  f3: f(3).inicio, rueda: f(3).t("rueda"), pulso: f(3).t("pulso"),
  f4: f(4).inicio, sumando: f(4).t("sumando"),
  f5: f(5).inicio, donde: f(5).t("donde"),
  f6: f(6).inicio, aprendizaje: f(6).t("aprendizaje"), sube6: f(6).t("sube"), apunta: f(6).t("apunta"),
  f7: f(7).inicio, contador: f(7).t("contador"), cinco: f(7).t("cinco"), sabe7: f(7).t("sabe"),
  f8: f(8).inicio, desc: f(8).t("descuadrarse"), asi8: f(8).t("asi"), iman: f(8).t("iman"),
  f9: f(9).inicio, notan: f(9).t("notan"), frenan: f(9).t("frenan"), milimetro: f(9).t("milimetro"),
  f10: f(10).inicio, cuenta10: f(10).t("cuenta"), iman10: f(10).t("iman"), acertado: f(10).t("acertado"),
  f11: f(11).inicio, END: v.duracion,
};

// ---------------------------------------------------------------- dónde está la cabina: el piso (con decimales) en cada segundo
// El final lleva a donde empieza: la cabina sube a toda velocidad por el piso 3, y el vídeo se puede ver dos veces seguidas.
const V0 = 1.9; // pisos por segundo, al principio y al final
export const piso = curva([
  [0, 3.0], [3.4, 8.2], [7.2, 9.2], [14.2, 10.9], [17.6, 11.75], [18.0, 11.75], [21.7, 11.75],  // el hook, y sube despacio con la rueda
  [24.3, 1.0], [25.1, 1.0], [28.4, 12.0],                                                         // el viaje de aprendizaje: baja y sube entero
  [29.4, 12.0], [30.5, 3.0], [30.7, 3.0], [T.cinco + 0.05, 5.0],                                  // vuelve y llega al piso cinco
  [36.2, 5.0], [38.0, 5.35], [40.2, 5.83], [41.4, 5.97], [43.4, 6.0],                             // sube al seis y lo deja a nivel
  [44.8, 6.0], [45.3, 6.0], [49.4, 1.0],                                                          // baja contando, con un imán en cada piso
  [51.2, 1.0], [T.END, 3.0],
], V0, V0);
export const pisoF = piso;

// velocidad de la cabina en px/s
export const vel = (t) => ((pisoF(t + 0.01) - pisoF(t - 0.01)) / 0.02) * FL;
export const fondoCoche = (t) => floorY(pisoF(t));

// ---------------------------------------------------------------- las luces de los tres sensores (arriba, medio, abajo) frente al imán n
export const luces = (fl, n) => {
  const d = (n - fl) * FL;
  return [Math.abs(d - 50) <= 56, Math.abs(d) <= 56, Math.abs(d + 50) <= 56];
};
export const sensoresActivos = (t) => t >= T.asi8 + 0.25 && t <= T.f11 + 0.6;

// ---------------------------------------------------------------- los pulsos de la rueda (cada PITCH píxeles que sube) y otros instantes
const DT = 1 / 240;
export const pulsosT = [];
export const tAprende = Array(NPISOS + 2).fill(0);      // cuándo pasa por cada piso el viaje de aprendizaje
export let tAjusta = 0;                                   // cuándo el imán del piso 6 corrige la cuenta
{
  let p0 = FL * (pisoF(0) - 1);
  for (let t = DT; t < T.END; t += DT) {
    const p1 = FL * (pisoF(t) - 1);
    const a = Math.floor(p0 / PITCH), b = Math.floor(p1 / PITCH);
    if (b > a) for (let i = a + 1; i <= b; i++) pulsosT.push({ n: i, t });
    p0 = p1;
  }
  for (let n = 1; n <= NPISOS; n++) {
    let t = T.sube6 - 0.2;
    while (t < T.END && pisoF(t) < n - 0.002) t += DT;
    tAprende[n] = n === 1 ? T.sube6 : t;
  }
  let t = 38;
  while (t < T.END && !luces(pisoF(t), 6)[0]) t += DT;
  tAjusta = t;
}

// ---------------------------------------------------------------- la cámara
// Cada cosa se dibuja en el mundo y la cámara la lleva a pantalla: pantalla = S + (mundo - P) · z.
const L = Math.log, ZH = L(1.12);   // el zoom del hook: la cabina llena media pantalla
const zc = curva([
  [0, ZH], [7.4, ZH], [9.3, L(3.0)], [14.1, L(3.0)], [15.9, L(0.95)], [18.2, L(0.95)],
  [20.3, L(0.45)], [24.6, L(0.45)], [25.3, L(0.29)], [28.7, L(0.29)],
  [29.3, L(0.46)], [31.0, L(0.6)], [32.6, L(0.78)], [36.0, L(0.78)],
  [38.0, L(2.1)], [44.7, L(2.1)], [46.2, L(0.62)], [49.2, L(0.62)],
  [51.0, L(0.9)], [T.END, ZH],
], 0, 0);

// cuánto de cada encuadre hay en cada segundo: la rueda, el imán y la cabina a un lado (con la tabla al otro)
export const pesos = (t) => ({
  wRueda: suave(tramo(t, 7.5, 9.2)) * (1 - suave(tramo(t, 14.2, 15.9))),
  wIman: suave(tramo(t, 36.4, 38.2)) * (1 - suave(tramo(t, 44.9, 46.4))),
  wLado: suave(tramo(t, 20.3, 21.7)) * (1 - suave(tramo(t, 36.3, 37.3))),
});

export function camara(t) {
  const z = Math.exp(zc(t));
  const B = fondoCoche(t);
  const { wRueda, wIman: wImán, wLado } = pesos(t);
  // el punto del mundo que miramos
  let px = CAR.cx, py = B - 260;
  px = mez(px, WHEEL.x, wRueda); py = mez(py, B - CAR.h + WHEEL.dy + 30, wRueda);
  px = mez(px, 800, wImán); py = mez(py, floorY(6) - MAG.dy, wImán);
  // y dónde lo ponemos en la pantalla
  let sx = 540, sy = 1000;
  sx = mez(sx, 470, wRueda); sy = mez(sy, 1060, wRueda);
  sx = mez(sx, 300, wLado);
  sx = mez(sx, 600, wImán);
  return { z, px, py, sx, sy };
}
export const aPantalla = (c, x, y) => [c.sx + (x - c.px) * c.z, c.sy + (y - c.py) * c.z];
