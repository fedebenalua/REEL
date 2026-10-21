// «Hasta que en los años ochenta llegó la luz infrarroja: la que usa tu mando hoy. Pulsas un botón, un chip lo
// convierte en un número, y la luz de la punta lo manda parpadeando, como un morse. Un ojito en la tele lo recibe,
// lo traduce y hace lo que le pides. Por eso el sol ya no te cambia de canal: la tele solo hace caso a ese ritmo. Y a
// día de hoy también...» (lo del móvil está en el plano 09)
// Otro sitio: el salón de hoy, de noche. Una sola cámara: el mando abajo, la tele arriba. Se entra con un corte en
// «Hasta».
// - «luz infrarroja»: sale un arco iris desde la punta del mando y, más allá del rojo, un anillo fantasma de luz que
//   no se ve (de color carmín: el color de la luz infrarroja en todo el vídeo).
// - «Pulsas un botón»: el pulgar pulsa el volumen; el mando se vuelve de cristal: la luz recorre la placa hasta el
//   chip, que enseña su número (ceros y unos) y lo manda por la pista hasta la lucecita de la punta.
// - «parpadeando, como un morse»: la lucecita parpadea (largo = 1, corto = 0) y los destellos suben por el salón;
//   la cámara sube con ellos hasta la tele.
// - «Un ojito en la tele»: los destellos entran en su ojito, que se enciende; «lo traduce»: sus ceros y unos; «hace lo
//   que le pides»: la barra de volumen sube.
// - «Por eso el sol ya no...»: entra el sol en diagonal y da en el ojito: no pasa nada. «solo hace caso a ese ritmo»:
//   llegan los destellos, el ojito se enciende y la tele cambia de canal.
// - Al acabar «ritmo» todo reposa antes del corte al mando de 1987.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { salonHoy, teleHoy, mandoHoy, manoDetras, manoDelante, destellos, ledEnc, ojoRecibe, pulsos, movilApp, manoMovilDetras, manoMovilDelante, TELE, MANDO, IR, BITS } from "../objetosHoy.js";

export const desde = (vz) => vz.frase(13).inicio;

const { suave: su, tramo: tr, mez } = k;
const f6 = v.frase(13), f7 = v.frase(14), f8 = v.frase(15), f9 = v.frase(16);
const T0 = f6.inicio, Tluz = f6.t("luz"), Tinf = f6.t("infrarroja"), Thoy = f6.t("hoy");
const Tbot = f7.t("boton"), Tchip = f7.t("chip"), Tnum = f7.t("numero"), Tpar = f7.t("parpadeando");
const Toj = f8.t("ojito"), Ttra = f8.t("traduce"), Thace = f8.t("hace"), Tpid = f8.t("pides");
const Tsol = f9.t("sol"), Tcaso = f9.t("caso"), Trit = f9.t("ritmo");
export const FIN = v.frase(17).inicio;

const MSG = destellos([{ t0: Tpar, rep: 2 }, { t0: Tsol + 0.7 }]);
const SALTOS = [Trit];

const cam = camino2D([
  [T0, [1.1, 0, 500]], [Tbot - 0.55, [1.1, 0, 500]], [Tbot + 0.4, [1.6, 0, 720]], [Tnum + 0.5, [1.6, 0, 720]],
  [Tnum + 1.1, [1.9, 0, 440]], [Tpar + 0.1, [1.9, 0, 440]], [Tpar + 2.1, [0.8, 0, -560]], [FIN, [0.8, 0, -560]],
]);

const canalDe = (t) => SALTOS.filter((s) => t >= s).length + 1;
const nieveDe = (t) => Math.max(0, ...SALTOS.map((s) => tr(t, s - 0.06, s) * (1 - tr(t, s + 0.14, s + 0.3))));

// el arco iris: del violeta (dentro) al rojo (fuera); más allá del rojo, el anillo fantasma de la luz infrarroja
const COLS = ["170,90,255", "90,90,255", "70,170,255", "90,230,120", "255,236,80", "255,160,50", "255,60,60"];
function arcoIris(g, t, al, ir) {
  const [cx, cy] = MANDO.led;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "butt";
  const grow = su(tr(t, Tluz - 0.15, Tluz + 0.5));
  COLS.forEach((c, i) => {
    const r = (150 + i * 22) * grow + 4;
    g.strokeStyle = `rgba(${c},${0.9 * al})`; g.lineWidth = 22; g.beginPath(); g.arc(cx, cy, r, Math.PI, 0); g.stroke();
    g.strokeStyle = `rgba(${c},${0.2 * al})`; g.lineWidth = 52; g.beginPath(); g.arc(cx, cy, r, Math.PI, 0); g.stroke();
  });
  if (ir > 0.01) {
    const pul = 0.75 + 0.25 * Math.sin(t * 7);
    for (let j = 0; j < 2; j++) {
      const r = (150 + 7 * 22 + 22 + j * 46) * grow;
      g.setLineDash([26, 22]); g.lineDashOffset = -t * 40 * (j + 1);
      g.strokeStyle = `rgba(${IR},${(0.8 - j * 0.2) * ir * pul})`; g.lineWidth = 24 - j * 5; g.beginPath(); g.arc(cx, cy, r, Math.PI, 0); g.stroke();
    }
    g.setLineDash([]);
    // los rayos que salen de la punta y cruzan todo
    for (let q = 0; q < 11; q++) {
      const a = Math.PI + 0.25 + (q / 10) * (Math.PI - 0.5), rr = (150 + 7 * 22 + 120) * grow;
      const lg = g.createLinearGradient(cx, cy, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); lg.addColorStop(0, `rgba(${IR},${0.55 * ir})`); lg.addColorStop(1, `rgba(${IR},0)`);
      g.strokeStyle = lg; g.lineWidth = 7; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); g.stroke();
    }
  }
  g.restore();
}

const SOLP = [-700, -1500];
export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const msgL = MSG, ojo = Math.max(ojoRecibe(t, msgL), 0.6 * ojoRecibe(t - 0.04, msgL));
  const ledL = Math.max(ledEnc(t, msgL), 0.6 * ledEnc(t - 0.04, msgL));
  const sol = su(tr(t, Tsol - 0.15, Tsol + 0.25)) * (1 - su(tr(t, Trit + 0.3, Trit + 0.8)));
  const tinte = canalDe(t) === 1 ? "80,170,255" : "255,140,80";
  salonHoy(g, t, tinte);
  // la tele y su volumen
  const volAl1 = su(tr(t, Thace - 0.1, Thace + 0.2)) * (1 - su(tr(t, Tsol - 0.2, Tsol + 0.1)));
  const vol = mez(0.28, 0.8, su(tr(t, Thace, Tpid)));
  teleHoy(g, t, { canalN: 1 + 3 * (canalDe(t) - 1), nv: nieveDe(t), ojo, vol, volAl: volAl1 });
  // el mando, con su mano, que entra desde abajo
  const sube = 1 - su(tr(t, T0 + 0.05, T0 + 0.75));
  const iniX = su(tr(t, Tbot - 0.28, Tbot - 0.05)) * (1 - su(tr(t, Tbot + 0.16, Tbot + 0.42)));
  const xray = su(tr(t, Tbot + 0.3, Tchip - 0.2)) * (1 - su(tr(t, Tpar + 0.3, Tpar + 0.9)));
  g.save(); g.translate(0, 520 * sube);
  arcoIris(g, t, su(tr(t, Tluz - 0.15, Tluz + 0.4)) * (1 - su(tr(t, Thoy - 0.5, Thoy - 0.05))), su(tr(t, Tinf - 0.1, Tinf + 0.35)) * (1 - su(tr(t, Thoy - 0.5, Thoy - 0.05))));
  manoDetras(g);
  const idle = su(tr(t, Tinf, Tinf + 0.4)) * (1 - su(tr(t, Thoy - 0.4, Thoy))) * 0.35 + 0.8 * k.pulso(t, Thoy + 0.1, 0.1);
  const encendidoAntes = su(tr(t, Tpar - 0.6, Tpar - 0.1)) * 0.3;
  mandoHoy(g, t, { xray, pulsa: iniX, led: Math.max(ledL, idle, encendidoAntes * (ledL ? 1 : 1)), uBoton: tr(t, Tbot + 0.35, Tchip - 0.05), uLed: tr(t, Tnum + 0.55, Tpar - 0.15) });
  manoDelante(g, iniX);
  g.restore();
  // los destellos que suben
  pulsos(g, t, msgL);
  // el sol, en diagonal hacia el ojito
  if (sol > 0.01) {
    const [ox, oy] = TELE.ojo, ang = Math.atan2(oy - SOLP[1], ox - SOLP[0]), len = Math.hypot(ox - SOLP[0], oy - SOLP[1]);
    g.save(); g.translate(SOLP[0], SOLP[1]); g.rotate(ang); g.globalCompositeOperation = "lighter";
    const hg = g.createLinearGradient(0, 0, len, 0); hg.addColorStop(0, `rgba(255,214,120,${0.55 * sol})`); hg.addColorStop(1, `rgba(255,190,90,${0.34 * sol})`);
    g.fillStyle = hg; g.beginPath(); g.moveTo(0, -300); g.lineTo(len, -70); g.lineTo(len, 70); g.lineTo(0, 300); g.closePath(); g.fill();
    const ng = g.createLinearGradient(0, 0, len, 0); ng.addColorStop(0, `rgba(255,248,210,${0.5 * sol})`); ng.addColorStop(1, `rgba(255,240,190,${0.25 * sol})`);
    g.fillStyle = ng; g.beginPath(); g.moveTo(0, -110); g.lineTo(len, -26); g.lineTo(len, 26); g.lineTo(0, 110); g.closePath(); g.fill();
    g.restore();
    // las chispas que rebotan en el ojito: la luz llega y no pasa nada
    const az = k.azar(61);
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 9; i++) { const a = -2.6 + az() * 1.8, d = 40 + az() * 90, ph = (t * 1.6 + az()) % 1; g.strokeStyle = `rgba(255,240,190,${0.6 * sol * (1 - ph)})`; g.lineWidth = 4; g.beginPath(); g.moveTo(ox + Math.cos(a) * d * ph, oy + Math.sin(a) * d * ph); g.lineTo(ox + Math.cos(a) * (d * ph + 22), oy + Math.sin(a) * (d * ph + 22)); g.stroke(); }
    g.restore();
  }
  if (sol > 0.01) { k.brillo(g, SOLP[0], SOLP[1], 900, "255,226,150", sol); g.fillStyle = `rgba(255,251,225,${sol})`; g.beginPath(); g.arc(SOLP[0], SOLP[1], 170, 0, 6.2832); g.fill(); k.brillo(g, SOLP[0], SOLP[1], 700, "255,250,225", 0.8 * sol); }
  sinVista(g);
  // los ceros y unos: los que el chip enseña, y los que la tele traduce
  const num = su(tr(t, Tnum - 0.08, Tnum + 0.12)) * (1 - su(tr(t, Tnum + 0.5, Tnum + 0.8)));
  k.pastilla(g, 540, 1150, BITS.join(""), "", IR, num, 108);
  const tra = su(tr(t, Ttra - 0.05, Ttra + 0.2)) * (1 - su(tr(t, Thace - 0.05, Thace + 0.15)));
  k.pastilla(g, 540, 1330, BITS.join(""), "", IR, tra, 108);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { pulsa: Tbot, chip: Tchip, numero: Tnum, parpadea: Tpar, ojito: Toj, hace: Thace, sol: Tsol, ritmo: Trit };
