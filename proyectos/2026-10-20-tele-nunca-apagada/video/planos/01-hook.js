// «¿Sabías que tu tele nunca está apagada del todo? Aunque la apagues con el mando, hay algo dentro que sigue
// despierto. Su ojito: ese que no para de mirar por si le mandas una señal.»
// Un salón de noche, todo de neón. Una sola cámara.
// - «tu tele»: la pantalla, enorme y a todo color, y la cámara se aleja; el mando entra por abajo.
// - «apagada»: pulsa y la pantalla se cierra de golpe, en una raya y un punto; el salón se queda a oscuras, y solo
//   queda el puntito rojo del sensor.
// - «hay algo dentro que sigue despierto»: el mando se va y la cámara se lanza al puntito, que se abre: es un ojo.
// - «ojito… mirar… señal»: el ojo mira a un lado y a otro, parpadea, y le llega una luz del mando: se achica la
//   pupila y destella. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { salonHoy, teleHoy, mandoHoy, TELE, MANDO, IR } from "../objetosHoy.js";
import { ojo } from "../neon.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tapa = f1.t("apagada"), Tman = f2.t("mando"), Thay = f2.t("hay"), Tdes = f2.t("despierto");
const Toj = f3.t("ojito"), Tmir = f3.t("mirar"), Tsen = f3.t("senal");
const FIN = v.frase(4).inicio;

const SX = TELE.ojo[0], SY = TELE.ojo[1];
const cam = camino2D([
  [0, [1.12, 0, -640]], [1.1, [0.78, 0, -330]], [Tman + 0.2, [0.78, 0, -330]], [Thay - 0.35, [0.82, 0, -400]],
  [Tdes + 0.0, [9.5, SX, SY]], [Tsen, [9.9, SX, SY]], [FIN - 0.3, [10.4, SX, SY]], [FIN, [10.4, SX, SY]],
]);

const PULSA = 1.5;                                    // cuándo aprieta el botón
const LEDY = -60;                                     // dónde está la lucecita del mando, en el mundo
const sube = (t) => 1 - su(tr(t, 0.05, 0.7));
const sale = (t) => su(tr(t, Tman - 0.55, Tman + 0.5));
const enc = (t) => 1 - tr(t, Tapa - 0.02, Tapa + 0.36) ** 1.6;
const rayoIr = (t) => Math.max(su(tr(t, PULSA, PULSA + 0.06)) * (1 - su(tr(t, PULSA + 0.18, PULSA + 0.28))), su(tr(t, PULSA + 0.3, PULSA + 0.36)) * (1 - su(tr(t, PULSA + 0.42, PULSA + 0.5))));

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t), e = enc(t);
  vista(g, Z, cx, cy);
  salonHoy(g, t, "255,60,180");
  // el salón se queda a oscuras cuando se cierra la pantalla
  const osc = 0.78 * su(tr(t, Tapa + 0.05, Tapa + 0.6));
  g.fillStyle = `rgba(2,0,8,${osc})`; g.fillRect(-1400, -1900, 2800, 3800);
  // el sensor: un puntito rojo que respira; luego se abre
  const resp = 0.45 + 0.35 * Math.sin(t * 2.6);
  const abre = su(tr(t, Thay + 0.1, Tdes - 0.15)) * 0.16 + su(tr(t, Tdes - 0.08, Tdes + 0.14)) * 0.84;
  teleHoy(g, t, { canalN: 0, enc: e, ojo: t < Tapa ? 0 : Math.min(1, resp + 0.2 * su(tr(t, Tapa, Tapa + 0.4))) * (1 - su(tr(t, Thay + 0.1, Thay + 0.4))) });
  // el mando entra por abajo y se va después de apagar
  const off = 700 * sube(t) + 900 * sale(t);
  const sinMando = sale(t) > 0.999;
  if (!sinMando) {
    const prensa = su(tr(t, PULSA - 0.1, PULSA)) * (1 - su(tr(t, PULSA + 0.2, PULSA + 0.32)));
    g.save(); g.translate(0, LEDY + off); g.translate(0, -282);
    mandoHoy(g, t, { led: rayoIr(t) });
    if (prensa > 0.01) k.brillo(g, -72, 400, 260, "255,255,255", 0.8 * prensa);
    g.restore();
    // la luz que va del mando al ojito de la tele
    const ri = rayoIr(t);
    if (ri > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
      g.strokeStyle = `rgba(${IR},${0.25 * ri})`; g.lineWidth = 60; g.beginPath(); g.moveTo(0, LEDY); g.lineTo(SX, SY + 30); g.stroke();
      g.strokeStyle = `rgba(${IR},${0.95 * ri})`; g.lineWidth = 20; g.beginPath(); g.moveTo(0, LEDY); g.lineTo(SX, SY + 30); g.stroke();
      g.strokeStyle = `rgba(255,235,240,${0.9 * ri})`; g.lineWidth = 7; g.beginPath(); g.moveTo(0, LEDY); g.lineTo(SX, SY + 30); g.stroke();
      g.restore();
    }
  }
  // el ojo, que sustituye al puntito del sensor
  if (t > Thay) {
    g.fillStyle = "#020203"; g.beginPath(); g.arc(SX, SY, 31.5 * su(tr(t, Thay + 0.0, Thay + 0.08)), 0, 6.2832); g.fill();
    const mirar = t < Toj + 0.3 ? 0 : t < Tmir - 0.3 ? 0.9 * su(tr(t, Toj + 0.5, Toj + 1.0)) : t < Tmir + 0.6 ? mez(0.9, -0.9, su(tr(t, Tmir - 0.3, Tmir + 0.5))) : mez(-0.9, 0, su(tr(t, Tmir + 0.8, Tmir + 1.3)));
    const par = 1 - 0.95 * k.pulso(t, Tmir + 0.55, 0.16);
    const llega = su(tr(t, Tsen, Tsen + 0.12)) * (1 - su(tr(t, Tsen + 0.45, Tsen + 0.75)));
    ojo(g, t, { x: SX, y: SY, R: 34, abre: abre * par, mx: mirar + 0.05 * Math.sin(t * 1.7), my: 0.1 * Math.sin(t * 1.3), pupila: 0.5 - 0.22 * llega, luz: su(tr(t, Tdes - 0.1, Tdes + 0.2)), flash: llega });
    // la luz de la señal que llega desde abajo
    if (llega > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
      for (const dx of [-1, -0.5, 0, 0.5, 1]) {
        const x0 = SX + dx * 150, y0 = SY + 330, x1 = SX + dx * 14, y1 = SY + 34 + 40 * (1 - llega), gr = g.createLinearGradient(0, y0, 0, y1);
        gr.addColorStop(0, `rgba(${IR},0)`); gr.addColorStop(0.7, `rgba(${IR},${0.7 * llega})`); gr.addColorStop(1, `rgba(255,230,236,${0.95 * llega})`);
        g.strokeStyle = gr; g.lineWidth = 7; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      }
      g.restore();
    }
  }
  sinVista(g);
  // el destello cuando el ojo se abre
  k.fogonazo(g, 540, 960, t - (Tdes - 0.02), 1500, "255,150,175");
  velo(g, 0.55);
  vineta(g, 0.5);
}

export const momentos = { apaga: Tapa, abre: Tdes, mira: Tmir, senal: Tsen };
