// «Sonaba tan agudo que tú no lo oías, pero la tele sí.»
// «Y no le pusieron pilas por miedo a que, al gastarse, pensaras que la tele estaba rota.»
// El salón de 1955 otra vez, con el mando del martillito delante. Se entra con un corte en «Sonaba».
// - «Sonaba»: se pulsa y salen anillos azules finos y apretados, el sonido agudo, que cruzan el salón; «no lo oías»:
//   casi transparentes; «la tele sí»: su micrófono se enciende y en «sí» cambia de canal.
// - «Y no le pusieron pilas»: el mando se ve por dentro con unas pilas imaginarias, encendidas; «al gastarse», se
//   vacían en rojo; «pensaras que la tele estaba rota»: la tele se apaga y en «rota» su cristal se agrieta.
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, MICRO, camara, martillito, mezCam, ondasAgudas, salon, tele } from "../mundo.js";

const { suave: su, tramo: tr, mez } = k;
const f6 = v.frase(6), f7 = v.frase(7);
export const desde = (vz) => vz.frase(6).inicio;
const T6 = f6.inicio, Toi = f6.t("oias"), Tno = f6.t("no"), Tsi = f6.t("si"), Tgas = f7.t("gastarse"), Tpen = f7.t("pensaras"), Trot = f7.t("rota"), T7 = f7.inicio, Fin = v.frase(8).inicio;
const RX = 830, RY = 1500, RW = 330;

export function dibuja(g, t) {
  const cam = mezCam(CAM0, { Z: 1.15, F: { x: 600, y: 1050 } }, su(tr(t, T7, T7 + 0.6)));
  g.save(); camara(g, cam);
  salon(g, t, 0);
  const apaga = su(tr(t, Tpen, Tpen + 0.3));
  tele(g, t, { canal: 2 + su(tr(t, Tsi, Tsi + 0.3)), apagada: apaga, grieta: su(tr(t, Trot - 0.05, Trot + 0.2)), sonido: su(tr(t, Tsi - 0.3, Tsi)) * (1 - su(tr(t, Tsi + 0.5, Tsi + 0.8))) });
  // el sonido agudo: sale del mando hacia la tele
  const golpe = [k.pulso(t, T6 + 0.05, 0.08), 0, k.pulso(t, Tsi - 0.45, 0.08), 0];
  ondasAgudas(g, RX - 60, RY - 200, t, T6, T6 + 0.6, 1 - 0.7 * su(tr(t, Tno - 0.1, Toi)) + 0.7 * su(tr(t, Tsi - 0.6, Tsi - 0.3)), 1400);
  ondasAgudas(g, RX - 60, RY - 200, t, Tsi - 0.5, Tsi - 0.1, 1, 1400);
  // el mando: por dentro, con unas pilas imaginarias que se gastan
  const pilas = su(tr(t, T7 + 0.1, T7 + 0.5)), nivel = 1 - su(tr(t, Tgas - 0.1, Tgas + 0.6));
  g.save(); g.translate(RX, RY); g.rotate(-0.2);
  martillito(g, 0, 0, RW, t, { rayos: pilas, golpe });
  if (pilas > 0) {
    const w = RW, h = w * 1.5;
    g.save(); g.globalAlpha = pilas;
    const col = nivel > 0.4 ? "90,230,120" : "255,60,70";
    k.redondo(g, -w * 0.32, h * 0.09, w * 0.64 * Math.max(0.06, nivel), h * 0.12, w * 0.04); g.fillStyle = `rgb(${col})`; g.fill();
    g.restore();
    k.brillo(g, 0, h * 0.15, w * 1.2, nivel > 0.4 ? "90,230,120" : "255,60,70", 0.4 * pilas);
  }
  g.restore();
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(10,25,24,0.55)"); vg.addColorStop(1, "rgba(10,25,24,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { suena: T6, si: Tsi, rota: Trot };
