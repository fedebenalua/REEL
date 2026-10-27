// «¿Por qué un coche aparcado al sol puede convertirse en un horno?» · «Fuera hace 22 grados, y dentro, en una hora,
// puede llegar a 47.»
// - Fotograma 0: el sol enorme, ardiendo; la cámara cae de golpe desde él hasta el coche rojo aparcado.
// - Las ventanillas se van poniendo naranjas y del techo sube la reverberación; en «horno», el golpe de horno.
// - «Fuera»: «22 °C» en el cielo. «dentro»: la cámara entra hacia la ventanilla de atrás, donde la cifra corre de 22
//   a 47 mientras el interior se enciende.
import * as k from "#kit";
import { v } from "#voz";
import { aparcamiento, camino2D, aPantalla, VENT_TRAS_C, velo, colorCalor } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tcoche = f1.t("coche"), Thorno = f1.t("horno"), Tfuera = f2.t("fuera"), Tdentro = f2.t("dentro"), Thora = f2.t("hora"), T47 = f2.t("47");
const Fin = v.frase(3).inicio;

export const cam = camino2D([
  [0, [2.4, -330, -1150]],
  [Tcoche + 0.35, [1.02, -40, -350]],
  [Tdentro, [1.02, -40, -350]],
  [Thora + 0.5, [1.85, VENT_TRAS_C[0] + 20, VENT_TRAS_C[1] + 40]],
]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  const golpe = k.pulso(t, Thorno + 0.15, 0.35);
  const sube = su(tr(t, Tdentro, T47 + 0.3));
  const calor = Math.min(1, 0.15 + 0.35 * su(tr(t, 0.6, Thorno)) + 0.25 * su(tr(t, Thorno, Thorno + 0.4)) + 0.3 * sube);
  const brasa = Math.max(golpe, 0.25 * su(tr(t, Thorno, Thorno + 0.5)) * (1 - sube) + 0.45 * sube);
  aparcamiento(g, t, Z, cx, cy, 0, { calor, brasa });

  // la caída desde el sol: estelas de luz que pasan hacia arriba
  const caida = tr(t, 0, Tcoche + 0.35);
  if (caida > 0 && caida < 1) {
    g.save(); g.globalCompositeOperation = "lighter";
    const al = Math.sin(Math.PI * caida) * 0.5;
    for (let i = 0; i < 9; i++) {
      const x = 80 + i * 115 + 30 * Math.sin(i * 2.3), y = (1920 - ((t * 2600 + i * 410) % 2400)) , L = 320;
      const lg = g.createLinearGradient(0, y, 0, y + L);
      lg.addColorStop(0, "rgba(255,230,170,0)"); lg.addColorStop(1, `rgba(255,230,170,${al})`);
      g.fillStyle = lg; g.fillRect(x - 3, y, 6, L);
    }
    g.restore();
  }
  // el golpe de horno: una oleada de luz naranja desde las ventanillas
  if (golpe > 0.02) {
    const [wx, wy] = aPantalla(Z, cx, cy, -80, -330);
    k.brillo(g, wx, wy, 1500, "255,120,40", 0.5 * golpe);
  }

  // las cifras
  const alF = su(tr(t, Tfuera - 0.1, Tfuera + 0.25)) * (1 - su(tr(t, Fin - 0.35, Fin - 0.1)));
  if (alF > 0.01) {
    k.pastilla(g, 300, 680, "22", "°C", "150,215,255", alF, 104);
    k.etiqueta(g, 186, 770, "fuera", "150,215,255", alF, 42);
  }
  const alD = su(tr(t, Tdentro - 0.05, Tdentro + 0.3)) * (1 - su(tr(t, Fin - 0.35, Fin - 0.1)));
  if (alD > 0.01) {
    const u = su(tr(t, f2.t("en") , T47 + 0.05));
    const n = Math.round(mez(22, 47, u));
    const [wx, wy] = aPantalla(Z, cx, cy, VENT_TRAS_C[0], VENT_TRAS_C[1] + 6);
    const col = k.mezRgb("255,220,170", "255,90,60", u);
    k.pastilla(g, wx, wy, String(n), "°C", col, alD, 120 + 20 * k.pulso(t, T47 + 0.05, 0.12));
    k.etiqueta(g, wx - 100, wy + 96, "dentro", colorCalor(0.6 + 0.4 * u), alD, 42);
  }
  velo(g, 0.45);
}
