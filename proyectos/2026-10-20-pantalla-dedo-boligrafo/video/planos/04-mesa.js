// «Por eso no funciona con guantes, pero sí con una salchicha, que también va llena de agua con sales. /
//  Y por eso los lápices para pantallas llevan la punta de goma conductora.»
// Un sitio nuevo: una mesa de madera, vista desde arriba, con el móvil encima. Una cámara que al final se echa sobre la punta del lápiz.
// - «guantes»: un guante de lana toca dos veces y no pasa nada (cruz roja, «lana»).
// - «salchicha»: se va el guante, llega la salchicha y toca: la pantalla estalla; «agua con sales».
// - «lápices»: la salchicha se va y llega un lápiz con punta negra; «punta»: toca y estalla; la cámara se echa sobre la punta.
// - «goma conductora»: la punta de goma se ilumina con su rótulo.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, movil, pon, rafaga, nada, visto, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez, redondo, azar } = k;
const F8 = v.frase(8), F9 = v.frase(9);
const T0 = F8.inicio, Tgua = F8.t("guantes"), Tsal = F8.t("salchicha"), Tagu = F8.t("agua"), Tsl = F8.t("sales");
const Tlap = F9.t("lapices"), Tpun = F9.t("punta"), Tgom = F9.t("goma"), Tcon = F9.t("conductora");
const FIN = v.frase(10).inicio;

const G1 = [-90, 150], G2 = [40, 20], PS = [60, 130], PL = [-20, -40];
const kx = (L) => k.claves(L);
const gx = kx([[T0, G1[0] + 200], [Tgua - 0.2, G1[0]], [Tgua + 0.3, G1[0]], [Tgua + 0.65, G2[0]], [Tgua + 1.6, G2[0] + 100], [Tgua + 2.0, G2[0] + 400]]);
const gy = kx([[T0, G1[1] + 400], [Tgua - 0.2, G1[1]], [Tgua + 0.3, G1[1]], [Tgua + 0.65, G2[1]], [Tgua + 1.6, G2[1]], [Tgua + 2.0, G2[1] + 600]]);
const gh = kx([[T0, 1.4], [Tgua - 0.35, 0.5], [Tgua - 0.12, 0], [Tgua + 0.2, 0], [Tgua + 0.4, 0.6], [Tgua + 0.65, 0], [Tgua + 1.1, 0], [Tgua + 1.7, 0.7], [Tgua + 2.0, 2.0]]);
const TG1 = Tgua - 0.12, TG2 = Tgua + 0.65;
const TSAL = Tsal + 0.12;
const sx = kx([[Tgua + 1.7, PS[0] + 300], [Tsal - 0.2, PS[0] + 20], [TSAL, PS[0]], [Tlap - 0.4, PS[0]], [Tlap + 0.2, PS[0] - 300]]);
const sy = kx([[Tgua + 1.7, PS[1] + 700], [Tsal - 0.2, PS[1] + 80], [TSAL, PS[1]], [Tlap - 0.4, PS[1]], [Tlap + 0.2, PS[1] + 700]]);
const sh = kx([[Tgua + 1.7, 2.0], [Tsal - 0.2, 0.5], [TSAL, 0], [Tlap - 0.4, 0], [Tlap + 0.2, 2.0]]);
const lx = kx([[Tlap - 0.2, PL[0] - 300], [Tpun - 0.5, PL[0] - 20], [Tpun, PL[0]], [FIN, PL[0]]]);
const ly = kx([[Tlap - 0.2, PL[1] + 800], [Tpun - 0.5, PL[1] + 110], [Tpun, PL[1]], [FIN, PL[1]]]);
const lh = kx([[Tlap - 0.2, 2.2], [Tpun - 0.5, 0.5], [Tpun, 0], [FIN, 0]]);

const cam = camino2D([[T0, [1.0, 0, 20]], [Tpun - 0.2, [1.0, 0, 20]], [Tgom + 0.15, [2.6, PL[0] + 20, PL[1] + 60]], [FIN, [2.7, PL[0] + 20, PL[1] + 60]]]);

function mesa(g) {
  const bg = g.createLinearGradient(0, -1100, 0, 1100); bg.addColorStop(0, "#c58a50"); bg.addColorStop(1, "#7a4a22"); g.fillStyle = bg; g.fillRect(-1500, -1500, 3000, 3000);
  g.save(); g.globalAlpha = 0.22; g.strokeStyle = "#4a2a10"; g.lineWidth = 5;
  for (let x = -1500; x < 1500; x += 180) { g.beginPath(); g.moveTo(x, -1500); g.lineTo(x, 1500); g.stroke(); }
  const az = azar(4); g.lineWidth = 3; for (let i = 0; i < 90; i++) { const x = -1500 + az() * 3000, y = -1500 + az() * 3000; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6, y + 120 + az() * 200); g.stroke(); }
  g.restore();
  k.brillo(g, 0, -100, 1900, "255,220,160", 0.35);
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  mesa(g);
  // el móvil, tumbado sobre la mesa
  const brilla = Math.max(k.pulso(t, TSAL, 0.12), k.pulso(t, Tpun, 0.12));
  g.save(); g.translate(0, 40); g.rotate(-0.04); g.scale(0.78, 0.78); movil(g, t, { brilla }); g.restore();
  // lo que pasa en la pantalla
  nada(g, G1[0], G1[1], t - TG1, 0.9); nada(g, G2[0], G2[1], t - TG2, 0.9);
  rafaga(g, PS[0], PS[1], t - TSAL, 1.1);
  rafaga(g, PL[0], PL[1], t - Tpun, 0.9);
  if (t - TSAL > 0.2 && t < Tlap) visto(g, PS[0], PS[1], t - TSAL - 0.2, 0.8);
  // las cosas que tocan
  if (t < Tgua + 2.0) pon(g, "guante", gx(t), gy(t), -0.3, 0.85, Math.max(0, gh(t)));
  if (t > Tgua + 1.6 && t < Tlap + 0.3) pon(g, "salchicha", sx(t), sy(t), -0.28, 0.9, Math.max(0, sh(t)));
  if (t > Tlap - 0.3) pon(g, "lapiz", lx(t), ly(t), 0.15, 0.9, Math.max(0, lh(t)));
  // la punta de goma se ilumina
  const ga = su(tr(t, Tgom, Tgom + 0.3));
  if (ga > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, PL[0], PL[1] + 40, 380, "255,230,120", 0.75 * ga); g.restore(); }
  sinVista(g);
  // los rótulos
  k.etiqueta(g, 70, 1300, "lana", "170,190,255", su(tr(t, TG1 + 0.15, TG1 + 0.5)) * (1 - su(tr(t, Tgua + 1.3, Tgua + 1.7))), 62);
  const aa = su(tr(t, Tagu, Tagu + 0.3)) * (1 - su(tr(t, Tlap - 0.5, Tlap - 0.1)));
  k.etiqueta(g, 600, 1300, "agua + sales", "130,215,255", aa, 62);
  k.etiqueta(g, 200, 1560, "goma conductora", "255,230,130", su(tr(t, Tgom + 0.1, Tgom + 0.45)), 70);
  velo(g, 0.4);
  vineta(g, 0.45);
}

export const momentos = { guantes: Tgua, salchicha: Tsal, goma: Tgom };
