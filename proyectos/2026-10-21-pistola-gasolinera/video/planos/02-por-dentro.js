// «Una bomba bajo el suelo empuja la gasolina por la manguera hasta la pistola.»
// «Y la gasolina pasa tan deprisa que chupa aire por un agujerito de la punta.»
// «Cuando la gasolina sube y tapa ese agujerito, ya no entra aire.»
// «El vacío tira de una membrana, suelta un muelle y la pistola se cierra de golpe.»
// La gasolinera en corte, con una sola cámara que sigue a la gasolina:
// - «Una bomba»: el tanque enterrado, lleno, con la bomba en el fondo que se enciende y gira.
// - «empuja»: la gasolina sube por el tubo hasta el surtidor (los litros corren) y la cámara sube con ella;
//   «manguera»: corre por la manguera hasta la pistola, metida en el coche.
// - «Y la gasolina»: la cámara entra en la pistola, de cristal: la gasolina corre en rayas; «deprisa»: el
//   estrechamiento se enciende; «chupa aire»: burbujas por el tubito; la cámara baja hasta el agujerito, por el que
//   entra el aire en un hilo.
// - «sube»: la gasolina del depósito sube por el cuello y «tapa» el agujerito; el aire deja de entrar.
// - «El vacío»: la cámara sube por el tubito hasta la membrana, que se pone violeta y se hunde; «muelle»: el muelle
//   se suelta; «golpe»: la válvula se cierra con un fogonazo, la gasolina se para y el gatillo cae.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";
import { escena } from "../escena.js";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez, entra } = k;
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const T0 = f3.inicio, Tbom = f3.t("bomba"), Temp = f3.t("empuja"), Tman = f3.t("manguera"), Tpis = f3.t("pistola");
const T4 = f4.inicio, Tdep = f4.t("deprisa"), Tchu = f4.t("chupa"), Tagu = f4.t("agujerito");
const Tsub = f5.t("sube"), Ttap = f5.t("tapa"), Tya = f5.t("ya");
const T6 = f6.inicio, Tvac = f6.t("vacio"), Tmem = f6.t("membrana"), Tmue = f6.t("muelle"), Tgol = f6.t("golpe"), Fin = f6.fin;
export const golpe = Tgol + 0.02;

const pis = (x, y) => { const p = m.dePistola({ x, y }); return [p.x, p.y]; };
const cam = m.camino2D([
  [T0 - 0.1, [0.62, -2050, 2060]],
  [Temp, [0.5, -2000, 1900]],
  [Tman, [0.31, -1900, -700]],
  [Tpis + 0.1, [0.27, -560, -980]],
  [T4, [0.27, -540, -980]],
  [T4 + 0.85, [2.45, ...pis(-70, -10)]],
  [Tchu, [2.6, ...pis(-30, 0)]],
  [Tagu + 0.05, [6.5, m.AGUJERITO.x - 4, m.AGUJERITO.y - 10]],
  [Tya, [6.8, m.AGUJERITO.x - 4, m.AGUJERITO.y - 12]],
  [T6 + 0.05, [6.8, m.AGUJERITO.x - 4, m.AGUJERITO.y - 12]],
  [Tmem, [4.6, ...pis(-60, -40)]],
  [Tmue + 0.3, [4.2, ...pis(-100, -20)]],
  [Tgol + 0.35, [3.0, ...pis(-100, 0)]],
  [Fin + 0.1, [2.95, ...pis(-100, 0)]],
]);

const NIV_TAPA = m.METIDO - 22;
const az = k.azar(9090);
const HILOS = Array.from({ length: 26 }, () => ({ a: az() * 3, d: 10 + az() * 28, f: az(), r: 0.5 + az() * 0.9 }));

export function dibuja(g, t) {
  const sube = tr(t, Temp - 0.05, Tman - 0.05), lleno = tr(t, Tman - 0.05, Tpis + 0.05);
  const fluye = t < Tpis ? 0 : t < Tgol ? 1 : 1 - su(tr(t, Tgol - 0.02, Tgol + 0.06));
  const aire = t < Tchu - 0.1 ? 0 : t < Ttap ? su(tr(t, Tchu - 0.1, Tchu + 0.25)) : 1 - su(tr(t, Ttap + 0.1, Ttap + 0.35));
  const vacio = su(tr(t, Tvac - 0.05, Tvac + 0.4)) * (1 - su(tr(t, Tgol + 0.05, Tgol + 0.5)));
  const membrana = entra(tr(t, Tmem - 0.1, Tmem + 0.35));
  const muelle = 0.35 * entra(tr(t, Tmue - 0.05, Tmue + 0.2)) + 0.65 * entra(tr(t, Tgol - 0.06, Tgol + 0.04));
  const nivel = t < Tsub - 0.25 ? 380 : mez(380, NIV_TAPA, su(tr(t, Tsub - 0.25, Ttap + 0.2)));
  const gat = 1 - entra(tr(t, Tgol, Tgol + 0.12));
  const c = cam(t);
  escena(g, t, c, {
    euros: Math.max(0, t - Temp - 0.6) * 1.9, flujoSurt: tr(t, Temp, Tman),
    tanque: { gira: t * 3 + Math.max(0, t - Tbom) * 14, sube },
    manguera: { lleno: Math.max(0.0001, lleno), corre: fluye },
    cuello: { nivel, agita: 0.35 + 0.65 * fluye }, chorro: fluye,
    pistola: { flujo: t < Tpis ? 0 : fluye, aire, vacio, membrana, muelle, gatillo: gat, valvula: (1 - muelle) * gat, venturi: 0.8 * su(tr(t, Tdep - 0.1, Tdep + 0.3)) * fluye },
    despues: (g) => {
      // el brillo de la bomba al encenderse
      k.brillo(g, m.BOMBA.x, m.BOMBA.y - 40, 1200, "120,200,255", 0.7 * k.pulso(t, Tbom + 0.1, 0.25));
      // el hilo de aire que entra por el agujerito
      if (aire > 0.01) {
        const A = m.AGUJERITO;
        g.save(); g.globalCompositeOperation = "lighter";
        for (const h of HILOS) {
          const u = (h.f + t * 1.3) % 1, d = h.d * (1 - u), ang = Math.PI * 0.75 + (h.a - 1.5) * 0.45;
          const x = A.x + Math.cos(ang) * d, y = A.y + Math.sin(ang) * d * 0.6 + d * 0.15;
          g.fillStyle = `rgba(${m.AIRE},${0.9 * aire * Math.min(1, u * 4)})`; g.beginPath(); g.arc(x, y, h.r, 0, 6.2832); g.fill();
        }
        g.restore();
        k.brillo(g, A.x, A.y, 26, m.AIRE, 0.8 * aire);
      }
      // el vacío: un brillo violeta que recorre el tubito hacia la membrana
      if (vacio > 0.01 && t < Tgol + 0.3) { const p = m.MEMBRANA; k.brillo(g, p.x, p.y, 120, m.VACIO, 0.7 * vacio * (0.7 + 0.3 * Math.sin(t * 8))); }
    },
  });
  // los fogonazos: la bomba que arranca y el golpe de la válvula
  const [Z, cx, cy] = c, V = m.VALVULA;
  m.destello(g, 540 + (V.x - cx) * Z, 960 + (V.y - cy) * Z, 0.85 * k.pulso(t, golpe + 0.02, 0.07));
}
