// «Por eso yo en casa ya casi no lo toco: uso el móvil de mando.»
// «Con una app, el móvil le habla a la tele por el wifi, y ese solo lo tocas tú.»
// «Te dejo la que uso en el link de la bio.» «Y envíaselo a ese amigo que come palomitas con el mando en la mano.»
// El salón de casa, con la tele. Se entra con un corte en «Por».
// - «ya casi no lo toco»: el mando, lleno de huellas y microbios, se va resbalando fuera de la imagen.
// - «uso el móvil de mando»: sube el móvil.
// - «le habla a la tele por el wifi»: ondas azules del móvil a la tele, que cambia de canal; «solo lo tocas tú»: en el
//   móvil, una sola huella, la tuya, brilla.
// - «link de la bio»: una etiqueta pequeña. «palomitas con el mando en la mano»: entra un bol de palomitas y, metido
//   dentro, el mando lleno de microbios que saludan.
import * as k from "#kit";
import { v } from "#voz";
import { huella, mando, movil, nube, ondas, tele } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, sale, azar } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
export const desde = (vz) => vz.frase(7).inicio;
const T7 = f7.inicio, Ttoc = f7.t("toco"), Tuso = f7.t("uso"), Tmov = f7.t("movil");
const Thab = f8.t("habla"), Twif = f8.t("wifi"), Tsol = f8.t("solo"), Ttu = f8.t("tu");
const Tlin = f9.t("link"), Tpal = f10.t("palomitas"), Tman = f10.t("mando"), Fin = v.duracion;
const azP = azar(5);
const PALOMITAS = Array.from({ length: 40 }, () => ({ x: (azP() - 0.5) * 300, y: -azP() * 90, r: 16 + azP() * 12 }));

export function dibuja(g, t) {
  // la cámara: se acerca al móvil cuando habla de él y se aleja al final
  const z = su(tr(t, Tsol - 0.3, Ttu + 0.2)) * (1 - su(tr(t, Tlin + 0.3, Tpal - 0.4)));
  const Z = mez(1, 1.35, z) - 0.12 * su(tr(t, Tpal, Fin)), Fy = mez(960, 1250, z);
  g.save(); g.translate(540, 960); g.scale(Z, Z); g.translate(-540, -Fy);
  // la pared del salón y el mueble
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#2a3a4a"); fg.addColorStop(1, "#1a2430");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#6a4a34"; g.fillRect(60, 1040, 960, 110); g.fillStyle = "#3a2a1c"; g.fillRect(0, 1500, 1080, 420);
  const Tbio = f9.t("bio");
  tele(g, 540, 820, 760, t, { canal: su(tr(t, Twif + 0.1, Twif + 0.5)) + su(tr(t, Tbio + 0.1, Tbio + 0.5)), volumen: mez(0.3, 0.8, su(tr(t, Tlin, Tlin + 0.6))), volAl: su(tr(t, Tlin - 0.2, Tlin)) * (1 - su(tr(t, Tbio, Tbio + 0.3))) });
  // el mando de siempre: se va
  const va = sale(tr(t, Ttoc - 0.4, Tuso + 0.1));
  if (va < 1) { mando(g, mez(300, -300, va), 1330, 130, 0.4 + va * 2); nube(g, mez(300, -300, va) - 120, 1130, 240, 400, t, 1, 4, "120,255,140", 22); }
  // el móvil
  const sube = entra(tr(t, Tuso - 0.1, Tmov + 0.2));
  const my = mez(2600, 1330, sube) + 200 * su(tr(t, Tpal - 0.3, Tpal + 0.2));
  if (sube > 0) {
    movil(g, 560, my, 380, -0.08, { toque: Math.max(k.pulso(t, Twif + 0.05, 0.12), k.pulso(t, Tlin, 0.12), k.pulso(t, Tbio + 0.05, 0.12)), boton: t > Tlin - 0.2 && t < Tbio - 0.1 ? 1 : 3, huella: su(tr(t, Tsol - 0.1, Ttu + 0.1)) });
    if (t > Tsol - 0.1) k.brillo(g, 575, my + 160, 260, "90,255,200", 0.5 * k.pulso(t, Ttu, 0.3));
  }
  ondas(g, { x: 545, y: my - 390 }, { x: 540, y: 1000 }, t, Thab - 0.1, Twif + 0.3);
  ondas(g, { x: 545, y: my - 390 }, { x: 540, y: 1000 }, t, Tlin - 0.1, Tbio + 0.3);
  // las palomitas con el mando dentro
  const bol = entra(tr(t, Tpal - 0.4, Tpal + 0.1));
  if (bol > 0) {
    const bx = mez(1500, 760, bol), by = 1500;
    mando(g, bx + 40, by - 220, 110, 0.35); nube(g, bx - 70, by - 460, 220, 300, t, su(tr(t, Tman - 0.3, Tman + 0.2)), 6, "120,255,140", 24);
    for (const p of PALOMITAS) { const sal = Math.abs(Math.sin(t * 7 + p.x)) * 18 * su(tr(t, Tpal, Tpal + 0.3)); g.fillStyle = "#fff6d0"; g.beginPath(); g.arc(bx + p.x, by - 80 + p.y - sal, p.r, 0, 6.2832); g.fill(); g.fillStyle = "#f2c26a"; g.beginPath(); g.arc(bx + p.x + 4, by - 76 + p.y, p.r * 0.4, 0, 6.2832); g.fill(); }
    g.beginPath(); g.moveTo(bx - 200, by - 90); g.lineTo(bx + 200, by - 90); g.lineTo(bx + 150, by + 120); g.lineTo(bx - 150, by + 120); g.closePath();
    g.fillStyle = "#e0283c"; g.fill(); g.save(); g.clip(); g.fillStyle = "#fff"; for (let i = -4; i < 6; i += 2) g.fillRect(bx + i * 40, by - 100, 40, 240); g.restore();
  }
  g.restore();
  const bio = entra(tr(t, Tlin - 0.1, Tlin + 0.2));
  if (bio > 0) { g.font = "800 46px Figtree"; const w = g.measureText("Link en la bio").width + 52; k.etiqueta(g, 540 - w / 2, 640 - 20 * (1 - bio), "Link en la bio", "90,255,200", bio, 46); }
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(10,16,24,0.6)"); vg.addColorStop(1, "rgba(10,16,24,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { movil: Tmov, wifi: Twif };
