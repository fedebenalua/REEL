// «El siguiente mando ya lo llevas en el bolsillo: tu móvil.»
// «Descarga la app que tienes en el link de la bio, y envíaselo a ese amigo que siempre está sin pilas.»
// Una fila con los mandos de la historia y el bolsillo de un vaquero. Sigue al plano del mando de hoy sin cortar: el
// mando de hoy se encoge hasta su sitio en la fila y los otros dos entran por la izquierda.
// - «El siguiente mando»: en fila, de izquierda a derecha, la linterna (1955), el martillito (1956) y el de hoy; a la
//   derecha, un hueco. «bolsillo»: en el hueco, un bolsillo vaquero con algo que asoma; «tu móvil»: el móvil salta
//   del bolsillo y se pone delante, grande.
// - «Descarga la app»: la pantalla enseña la app para descargar; «app»: el icono salta; «bio»: «Link en la bio».
// - «envíaselo a ese amigo que siempre está sin pilas»: los tres mandos viejos caen fuera de la imagen.
import * as k from "#kit";
import { v } from "#voz";
import { linterna, mandoHoy, martillito, movil } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra, sale } = k;
const f9 = v.frase(9), f10 = v.frase(10);
export const desde = (vz) => vz.frase(9).inicio;
export const entrada = "sigue";
const T9 = f9.inicio, Tbol = f9.t("bolsillo"), Tmov = f9.t("movil");
const Tdes = f10.t("descarga"), Tapp = f10.t("app"), Tbio = f10.t("bio"), Tenv = f10.t("enviaselo"), Tsin = f10.t("sin"), Fin = v.duracion;

const denim = (() => {
  const l = k.lienzo(420, 520), c = l.getContext("2d");
  const dg = c.createLinearGradient(0, 0, 420, 520); dg.addColorStop(0, "#3d6aa8"); dg.addColorStop(1, "#1f3f70");
  c.fillStyle = dg; c.fillRect(0, 0, 420, 520);
  c.strokeStyle = "rgba(255,255,255,0.08)"; c.lineWidth = 2; for (let i = -520; i < 420; i += 7) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 520, 520); c.stroke(); }
  c.globalAlpha = 0.3; c.globalCompositeOperation = "multiply"; c.drawImage(k.manchas, 0, 0, 420, 520);
  return l;
})();
function bolsillo(g, x, y, al, asoma) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y);
  g.drawImage(denim, -210, -260);
  // el móvil asomando
  if (asoma > 0) { k.redondo(g, -80, -170 - 60 * asoma, 160, 200, 26); g.fillStyle = "#f0b9c8"; g.fill(); }
  // el bolsillo, encima
  g.beginPath(); g.moveTo(-170, -120); g.quadraticCurveTo(0, -60, 170, -120); g.lineTo(150, 180); g.lineTo(0, 240); g.lineTo(-150, 180); g.closePath();
  const pg = g.createLinearGradient(0, -120, 0, 240); pg.addColorStop(0, "#4a78b8"); pg.addColorStop(1, "#2a4f88");
  g.fillStyle = pg; g.fill();
  g.setLineDash([12, 9]); g.strokeStyle = "#e8a04a"; g.lineWidth = 4; g.stroke(); g.setLineDash([]);
  g.restore();
}

export function dibuja(g, t) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#fff0e0"); fg.addColorStop(1, "#ffd0dc");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  // el fondo del plano de antes, que se va
  const va = su(tr(t, T9, T9 + 0.6));
  if (va < 1) {
    const hg = g.createLinearGradient(0, 0, 0, 1920); hg.addColorStop(0, "#ffd9e4"); hg.addColorStop(0.5, "#f6c9ff"); hg.addColorStop(1, "#b9c8ff");
    g.save(); g.globalAlpha = 1 - va; g.fillStyle = hg; g.fillRect(0, 0, 1080, 1920); k.brillo(g, 540, 900, 1600, "255,255,255", 0.5); g.restore();
  }
  // la línea del tiempo
  const fila = entra(tr(t, T9, T9 + 0.6)), cae = sale(tr(t, Tenv, Tsin + 0.3));
  const Y = 1180, dy = 1400 * cae;
  g.strokeStyle = "rgba(90,40,90,0.25)"; g.lineWidth = 6; g.beginPath(); g.moveTo(40, Y + 260 + dy); g.lineTo(1040, Y + 260 + dy); g.stroke();
  g.save(); g.globalAlpha = fila;
  const llega = 520 * (1 - fila);
  g.save(); g.translate(150 - llega, Y + dy); g.scale(-1, 1); linterna(g, 0, 0, 0.36, -1.2); g.restore();
  martillito(g, 400 - llega, Y + dy, 170, t);
  g.restore();
  // el mando de hoy: viene del plano de antes, grande, y se encoge hasta su sitio
  mandoHoy(g, mez(540, 640, fila), mez(1130, Y, fila) + dy, mez(250, 110, fila), t, { ang: mez(-0.08, 0, fila), rayos: 1 - su(tr(t, T9, T9 + 0.35)), pila: 0.08 });
  g.save(); g.globalAlpha = fila;
  const anos = [["1955", 150], ["1956", 400], ["hoy", 640]];
  for (const [a, x] of anos) k.pastilla(g, x, Y + 330 + dy, a, "", "255,215,140", 1, 60);
  g.restore();
  // el bolsillo y el móvil que salta
  const bol = su(tr(t, Tbol - 0.25, Tbol + 0.1)), salta = entra(tr(t, Tmov - 0.15, Tmov + 0.35));
  bolsillo(g, 880, Y + 20, bol * (1 - su(tr(t, Tmov, Tmov + 0.4))), su(tr(t, Tbol, Tbol + 0.3)) * (1 - salta));
  k.pastilla(g, 880, Y + 330 + dy, "?", "", "255,90,140", fila * (1 - bol), 60);
  if (salta > 0) {
    const tienda = su(tr(t, Tdes - 0.1, Tdes + 0.25)), sal = Math.max(0, Math.sin(Math.PI * tr(t, Tapp - 0.05, Tapp + 0.35))) * 0.18;
    movil(g, mez(880, 540, salta), mez(Y - 100, 1040, salta), mez(160, 400, salta), mez(0.4, -0.05, salta), { tienda, salta: sal, toque: k.pulso(t, Tmov + 0.4, 0.15) });
  }
  const bio = entra(tr(t, Tbio - 0.1, Tbio + 0.2));
  if (bio > 0) { g.font = "800 58px Figtree"; const w = g.measureText("Link en la bio").width + 52; k.etiqueta(g, 540 - w / 2, 1330 - 30 * (1 - bio), "Link en la bio", "255,77,109", bio, 58); }
  const vg = g.createLinearGradient(0, 180, 0, 640); vg.addColorStop(0, "rgba(50,16,60,0.72)"); vg.addColorStop(0.55, "rgba(50,16,60,0.5)"); vg.addColorStop(1, "rgba(50,16,60,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

export const momentos = { movil: Tmov, app: Tapp };
