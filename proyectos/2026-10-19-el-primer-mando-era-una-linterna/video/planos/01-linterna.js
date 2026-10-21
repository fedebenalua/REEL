// «El primer mando de la tele era una linterna, y el sol te cambiaba de canal.»
// «Apuntabas a una esquina de la pantalla, y cada esquina hacía una cosa.»
// «Pero si entraba el sol por la ventana, la tele se volvía loca.»
// El salón de 1955, con una sola cámara.
// - Fotograma 0: pegados a la boca de la linterna-pistola, que dispara su haz; la cámara sale disparada hacia atrás y
//   se ve la tele de madera; el haz da en una esquina, que se enciende verde, y la tele cambia de canal.
// - «linterna»: otro disparo, otro canal. «el sol»: entra el sol por la ventana, se encienden los cuatro ojos a la
//   vez y en «cambiaba de canal» la tele cambia sola.
// - «Apuntabas a una esquina»: la cámara se acerca; el haz da en una esquina; «cada esquina hacía una cosa»: el haz
//   pasa por las cuatro y en cada una sale lo que hace (encender, canal +, silencio, canal -).
// - «Pero si entraba el sol»: la cámara vuelve; entra el sol y en «loca» los cuatro ojos se encienden y la tele
//   cambia de canal una y otra vez. Antes del corte, el sol se va y todo se calma.
// (El creador eligió esta apertura; la otra, que empezaba pegada al ojo de la esquina, se quitó.)
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, ESQUINAS, FUNCIONES, PANT, camara, haz, linterna, mezCam, rayosDeSol, salon, tele } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tlin = f1.t("linterna"), Tsol = f1.t("sol"), Tcam = f1.t("cambiaba");
const T2 = f2.inicio, Tesq = f2.t("esquina"), Tcad = f2.t("cada"), Fin2 = f2.fin;
const T3 = f3.inicio, Tsol3 = f3.t("sol"), Tloc = f3.t("loca"), Tvol = f3.t("volvia"), Fin = v.frase(4).inicio;

// la linterna: abajo a la derecha, mirando hacia la tele (dibujada en espejo)
const GX = 860, GY = 1560, GS = 0.95, GANG = -0.62;
// los disparos: [cuándo, a qué esquina]
const TIROS = [[0.0, 1], [Tlin - 0.05, 3], [Tesq - 0.1, 0], [Tcad - 0.05, 1], [Tcad + 0.4, 2], [Tcad + 0.8, 3]];
// los cambios de canal: con cada tiro que cambia, con el sol y con la tele loca
const CAMBIOS = [0.25, Tlin + 0.2, Tcam, Tcad + 0.05, Tcad + 0.85, Tloc - 0.25, Tloc + 0.05, Tloc + 0.3];

function canal(t) { return CAMBIOS.reduce((c, te) => c + su(tr(t, te, te + 0.3)), 0); }
export function camaraEn(t, inicio = { Z: 2.4, F: { x: 640, y: 1280 } }) {
  const e = entra(tr(t, 0.05, 1.3));
  let c = mezCam(inicio, CAM0, e);
  c = mezCam(c, { Z: 1.3, F: { x: 540, y: 820 } }, su(tr(t, T2, Tesq + 0.2)) * (1 - su(tr(t, T3, Tsol3))));
  return c;
}
function tiro(t) {
  // a qué apunta y cuánto brilla el haz
  let al = 0, i = 0;
  for (let n = 0; n < TIROS.length; n++) { const [te] = TIROS[n]; const a = k.pulso(t, te + 0.12, 0.16); if (a > al) { al = a; i = TIROS[n][1]; } }
  // mientras va de una esquina a otra, se queda encendido
  al = Math.max(al, 0.85 * su(tr(t, Tcad - 0.3, Tcad - 0.1)) * (1 - su(tr(t, Tcad + 0.9, Tcad + 1.1))));
  const j = t < Tcad - 0.1 ? null : Math.min(3, Math.round((t - (Tcad - 0.2)) / 0.4));
  return { al, esquina: j ?? i };
}

export function dibuja(g, t) { escena(g, t, camaraEn(t)); }

export function escena(g, t, cam) {
  const sol = Math.max(k.pulso(t, Tsol + 0.4, 0.55), su(tr(t, Tsol3 - 0.3, Tsol3 + 0.2)) * (1 - su(tr(t, Tloc + 0.15, Tloc + 0.6))));
  const loca = tr(t, Tvol - 0.1, Tloc + 0.45) > 0 && t < Tloc + 0.45;
  const { al, esquina } = tiro(t);
  const ojos = ESQUINAS.map((_, n) => Math.max(n === esquina ? al : 0, sol * (loca ? 0.6 + 0.4 * Math.sin(t * 25 + n * 2) : 0.7)));
  g.save(); camara(g, cam);
  salon(g, t, sol);
  tele(g, t, { canal: canal(t), ojos });
  rayosDeSol(g, t, sol);
  // la linterna y su haz
  g.save(); g.translate(GX, GY); g.scale(-1, 1);
  const boca = linterna(g, 0, 0, GS, GANG, al);
  g.restore();
  const B = { x: GX - boca.x, y: GY + boca.y };
  let P = ESQUINAS[esquina];
  if (t > Tcad - 0.3 && t < Tcad + 1.0) {
    const q = (t - (Tcad - 0.2)) / 0.4, n = Math.max(0, Math.min(3, Math.floor(q))), u = su(tr(q - n, 0.55, 1));
    const a = ESQUINAS[Math.min(3, n)], b = ESQUINAS[Math.min(3, n + 1)];
    P = { x: mez(a.x, b.x, u), y: mez(a.y, b.y, u) };
  }
  haz(g, B, P, al);
  // lo que hace cada esquina
  const etq = su(tr(t, Tcad - 0.1, Tcad + 0.2)) * (1 - su(tr(t, T3 + 0.4, Tsol3 + 0.2)));
  ESQUINAS.forEach((e, n) => {
    const aparece = su(tr(t, Tcad - 0.05 + n * 0.4, Tcad + 0.2 + n * 0.4)) * etq;
    if (aparece <= 0) return;
    g.font = "800 40px Figtree"; const w = g.measureText(FUNCIONES[n]).width + 52;
    const x = e.x < PANT.x ? e.x - 20 : e.x - w + 20, y = e.y < PANT.y ? e.y - 92 : e.y + 26;
    k.etiqueta(g, x, y, FUNCIONES[n], "184,255,122", aparece, 40);
  });
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(10,25,24,0.55)"); vg.addColorStop(1, "rgba(10,25,24,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { tiros: TIROS.map((x) => x[0]), sol: Tsol, loca: Tloc };
