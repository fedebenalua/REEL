// «Por eso el último invento es que el mando sea tu móvil.»
// «Con una app, el móvil le habla a la tele por el wifi de casa: enciendes, subes el volumen, cambias de canal.»
// «Yo uso una que te dejo en el link de la bio.» «Y envíaselo a ese amigo que siempre esconde el mando.»
// La gala otra vez, con una sola cámara. Se entra con un corte en «Por».
// - «el último invento»: el foco busca por el escenario; «mando»: da en el mando de hoy, de pie; «móvil»: el mando
//   sale volando y en su sitio cae el móvil, con la estatuilla al lado y confeti.
// - «Con una app»: detrás baja una tele grande; el móvil se acerca; «le habla a la tele por el wifi»: ondas azules
//   del móvil a la tele. «enciendes» (la tele se enciende), «subes el volumen» (la barra), «cambias de canal».
// - «link de la bio»: una etiqueta pequeña, y otro toque: otro canal. «amigo»: confeti y la cámara se aleja. «esconde el mando»: el mando de antes asoma por detrás del telón y se
//   esconde otra vez.
import * as k from "#kit";
import { v } from "#voz";
import { camara, confeti, escenario, estatuilla, mandoHoy, movil, ondas, teleHoy } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, sale } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
export const desde = (vz) => vz.frase(7).inicio;
const T7 = f7.inicio, Tman = f7.t("mando"), Tmov = f7.t("movil");
const T8 = f8.inicio, Tapp = f8.t("app"), Thab = f8.t("habla"), Twif = f8.t("wifi"), Tenc = f8.t("enciendes"), Tsub = f8.t("subes"), Tcam = f8.t("cambias");
const Tlin = f9.t("link"), T10 = f10.inicio, Tesc = f10.t("esconde"), Fin = v.duracion;
const Tbio = f9.t("bio"), Tami = f10.t("amigo");
const TOQUES = [[Tenc, 0], [Tsub, 1], [Tcam, 3], [Tbio, 3]];

export function dibuja(g, t) {
  // el foco busca y se para en el centro
  const fx = t < Tman ? 540 + 360 * Math.sin((t - T7) * 3.2) * (1 - su(tr(t, Tman - 0.5, Tman))) : 540;
  const z = su(tr(t, T8 - 0.2, Tapp + 0.3));
  const fin = su(tr(t, T10, Fin));
  g.save(); camara(g, { Z: mez(1.05, 1.0, z) - 0.12 * fin, F: { x: 540, y: mez(1040, 960, z) } });
  escenario(g, t, { foco: 1, fx });
  // la tele grande que baja detrás
  const baja = entra(tr(t, T8 - 0.1, Tapp + 0.4));
  const enc = su(tr(t, Tenc + 0.05, Tenc + 0.2));
  if (baja > 0) teleHoy(g, 540, mez(-400, 720, baja), 760, t, { encendida: enc, flash: t - Tenc - 0.05, canal: su(tr(t, Tcam + 0.1, Tcam + 0.5)) + su(tr(t, Tbio + 0.1, Tbio + 0.5)), volumen: mez(0.3, 0.8, su(tr(t, Tsub + 0.1, Tsub + 0.6))), volAl: su(tr(t, Tsub - 0.1, Tsub + 0.1)) * (1 - su(tr(t, Tcam - 0.1, Tcam + 0.2))) });
  // el mando de hoy: llega el foco, luego sale volando
  const vuela = sale(tr(t, Tmov - 0.15, Tmov + 0.35));
  if (t > Tman - 0.4 && vuela < 1) mandoHoy(g, 540 + 900 * vuela, 1060 - 500 * vuela, 160, -0.06 + 3 * vuela, { al: su(tr(t, Tman - 0.4, Tman)) });
  // el móvil cae en su sitio
  const cae = entra(tr(t, Tmov - 0.05, Tmov + 0.3));
  const toque = TOQUES.reduce((m, [te]) => Math.max(m, k.pulso(t, te + 0.05, 0.12)), 0), boton = TOQUES.reduce((b, [te, i]) => (t > te - 0.1 ? i : b), 0);
  if (cae > 0) {
    const my = mez(-400, mez(1110, 1330, z), cae), mw = mez(230, 330, z);
    movil(g, mez(540, 520, z), my, mw, mez(0, -0.05, z), { toque, boton });
    // la estatuilla al lado
    const est = entra(tr(t, Tmov + 0.1, Tmov + 0.5)) * (1 - su(tr(t, T8 - 0.2, T8 + 0.3)));
    if (est > 0) estatuilla(g, 800, mez(1700, 1330, est), 520, t, 0.5 * k.pulso(t, Tmov + 0.4, 0.2));
    // las ondas del wifi, del móvil a la tele
    const a = { x: 520, y: my - mw * 1.0 }, b = { x: 540, y: 820 };
    ondas(g, a, b, t, Thab - 0.1, Twif + 0.4);
    for (const [te] of TOQUES) ondas(g, a, b, t, te, te + 0.35);
  }
  confeti(g, t, Tami - 0.1, su(tr(t, Tami - 0.1, Tami + 0.2)));
  confeti(g, t, Tmov + 0.2, su(tr(t, Tmov, Tmov + 0.3)) * (1 - su(tr(t, T8 + 0.6, T8 + 1.4))));
  // el amigo que esconde el mando: asoma por el telón de la izquierda y se esconde
  const asoma = Math.max(0, Math.sin(Math.PI * tr(t, Tesc - 0.6, Tesc + 0.6)));
  if (asoma > 0) mandoHoy(g, mez(-100, 150, asoma), 1150, 120, 0.5 - 0.3 * asoma);
  g.restore();
  // «Link en la bio»
  const bio = entra(tr(t, Tlin - 0.1, Tlin + 0.2));
  if (bio > 0) { g.font = "800 46px Figtree"; const w = g.measureText("Link en la bio").width + 52; k.etiqueta(g, 540 - w / 2, 1440 - 160 - 20 * (1 - bio), "Link en la bio", "255,215,140", bio, 46); }
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(10,4,12,0.55)"); vg.addColorStop(1, "rgba(10,4,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { movil: Tmov, toques: TOQUES.map((x) => x[0]) };
