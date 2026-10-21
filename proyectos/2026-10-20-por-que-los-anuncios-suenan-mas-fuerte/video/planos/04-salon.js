// «Mientras tanto, el mando siempre está lejos justo cuando empiezan.»
// «Yo bajo el volumen desde el móvil, con una app de mando que va por el wifi.»
// «Te dejo la que uso en el link de la bio.» «Y envíaselo a ese amigo que da un bote en cada anuncio.»
// El salón desde detrás del sofá, como en el hook. Se entra con un corte en «Mientras».
// - «el mando siempre está lejos»: la cámara cruza el salón hasta la estantería del fondo: ahí está el mando,
//   diminuto; «justo cuando empiezan»: vuelve y el anuncio estalla.
// - «Yo bajo el volumen desde el móvil»: sube el móvil en primer plano; toques en el «-» y la barra de la tele baja; las
//   ondas del sonido se encogen; «wifi»: ondas azules del móvil a la tele.
// - «link de la bio»: una etiqueta pequeña. «da un bote en cada anuncio»: llega otro anuncio, pero ya flojito: el bote
//   es pequeño.
import * as k from "#kit";
import { v } from "#voz";
import { ESTANTE, TELE, camara, mezCam, movil, ondasSonido, ondasWifi, salon, sofa } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
export const desde = (vz) => vz.frase(7).inicio;
const T7 = f7.inicio, Tlej = f7.t("lejos"), Temp = f7.t("empiezan");
const T8 = f8.inicio, Tbaj = f8.t("bajo"), Tvol = f8.t("volumen"), Twif = f8.t("wifi");
const Tlin = f9.t("link"), Tbot = f10.t("bote"), Fin = v.duracion;
const TOQUES = [Tbaj - 0.05, Tbaj + 0.3, Tvol + 0.2, Tvol + 0.5];

export function dibuja(g, t) {
  const C0 = { Z: 1.15, F: { x: 540, y: 1100 } }, LEJOS = { Z: 3.2, F: { x: ESTANTE.x + 40, y: 660 } };
  const ida = su(tr(t, T7 + 0.2, Tlej)), vuelta = su(tr(t, Tlej + 0.5, Temp + 0.1));
  const cam = mezCam(mezCam(C0, LEJOS, ida), C0, vuelta);
  const baja = TOQUES.filter((te) => t > te).length / TOQUES.length;
  const vol = mez(0.95, 0.22, su(baja));
  const anuncio = 1;
  g.save(); camara(g, cam);
  salon(g, t, { anuncio, volumen: vol, volAl: 1 });
  // el mando, allí lejos: un círculo que lo señala
  const marca = su(tr(t, Tlej - 0.4, Tlej - 0.1)) * (1 - su(tr(t, Tlej + 0.5, Tlej + 0.8)));
  if (marca > 0) { g.save(); g.strokeStyle = `rgba(255,215,140,${marca})`; g.lineWidth = 5; g.beginPath(); g.arc(ESTANTE.x + 60, 690, 70 + 8 * Math.sin(t * 10), 0, 6.2832); g.stroke(); g.restore(); k.brillo(g, ESTANTE.x + 60, 690, 260, "255,215,140", 0.6 * marca); }
  ondasSonido(g, TELE.x, TELE.y, t, mez(0.85, 0.25, su(baja)) + 0.4 * k.pulso(t, Temp + 0.1, 0.25) + 0.2 * k.pulso(t, Tbot, 0.2));
  sofa(g, t, k.pulso(t, Temp + 0.2, 0.18) + 0.25 * k.pulso(t, Tbot + 0.05, 0.15));
  g.restore();
  // la flecha que señala el mando, lejos
  if (ida > 0.5 && vuelta < 0.5) k.etiqueta(g, 560, 1150, "el mando", "255,215,140", su(tr(t, Tlej - 0.2, Tlej)) * (1 - su(tr(t, Tlej + 0.4, Tlej + 0.6))), 52);
  // el móvil, en primer plano
  const sube = entra(tr(t, T8 - 0.1, Tbaj));
  if (sube > 0) {
    const toque = TOQUES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.05, 0.1)), 0);
    const my = mez(2600, 1380, sube);
    movil(g, 760, my, 360, -0.12, { toque, nivel: vol });
    ondasWifi(g, { x: 740, y: my - 360 }, { x: TELE.x, y: TELE.y + 120 }, t, Tbaj - 0.1, Twif + 0.4);
  }
  const bio = entra(tr(t, Tlin - 0.1, Tlin + 0.2));
  if (bio > 0) { g.font = "800 46px Figtree"; const w = g.measureText("Link en la bio").width + 52; k.etiqueta(g, 540 - w / 2, 560 - 20 * (1 - bio), "Link en la bio", "140,180,255", bio, 46); }
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(8,6,16,0.55)"); vg.addColorStop(1, "rgba(8,6,16,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { toques: TOQUES, lejos: Tlej };
